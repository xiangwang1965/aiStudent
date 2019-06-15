<!-- 创建欲购买课程 -->
<template>
  <div class='purchaseComponent'>
    <div class="purchaseWrap">
      <p class="purchaseWrap__title">本次购买课程</p>
      <div class="base_class" v-for="(item,index) in base_class_ids" :key="index">
        <p class="base_class_name">{{item.base_class_name}}</p>
        <p class="base_class_price">
          价格：
          <span class="classes__number">&nbsp;&nbsp;{{item.price}}&nbsp;未来币</span>
        </p>
        <span class="classes__delete">
          <i class="el-icon-delete" @click="doDelete(index)"></i>
        </span>
      </div><div  class="create_class_name" style="">
        <el-button type="text" @click="showClassType=true" v-if="base_class_ids.length<=10">
          <i class="el-icon-plus"></i>
          请选择课程</el-button>
      </div>
      <p class="purchase">数量：
        <span class="purchase__number">{{base_class_ids.length}}</span>
      </p>
      <p class="purchase">账号价格：
        <span class="purchase__number">{{totalAmount}}</span>
      </p>
    </div>
    <el-dialog title="课程类型" :visible.sync="showClassType" width="450px">
      <el-form ref="form" label-width="100px" label-position="left" size="mini" :rules="classFormRules" :model="classForm">
        <el-form-item label="学科：" prop="subject_id">
          <el-select @change="getProductList('grade')" v-model="classForm.subject_id" placeholder="请选择学科">
            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级：" prop="grade_id">
          <el-select @change="getProductList('term')" v-model="classForm.grade_id" placeholder="请选择年级">
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期：" prop="term_id">
          <el-select @change="getProductList('level')" v-model="classForm.term_id" placeholder="请选择学期">
            <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班型：" prop="level">
          <el-select @change="getProductList('base_class')" v-model="classForm.level" placeholder="请选择班型">
            <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型：" prop="base_class_id">
          <el-select @change="changeBaseClass" v-model="classForm.base_class_id" placeholder="请选择课程类型">
            <el-option v-for="item in base_class_list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer footer">
        <el-button type="primary" size="small" @click="showClassType = false" class="cac-button-two cancel-button dialog_cancel_button" round>取 消</el-button>
        <el-button type="primary" size="small" @click="doConfirm" class="cac-button-one dialog_confirm_button" round>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import liveApi from '../../services/live'
export default {
  data () {
    return {
      classForm: {
        base_class_id: '',
        term_id: '',
        grade_id: '',
        base_class_name: '',
        price: '',
        subject_id: '',
        level: ''
      },
      classFormRules: {
        base_class_id: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        term_id: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        grade_id: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        base_class_name: [
          { required: false, message: '', trigger: 'change' }
        ],
        price: [
          { required: false, message: '', trigger: 'change' }
        ],
        subject_id: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择班型', trigger: 'change' }
        ]
      },
      subjectList: [],
      gradeList: [],
      termList: [],
      levelList: [],
      base_class_list: [],
      base_class_ids: [],
      base_class_name: '请选择购买课程',
      showClassType: false,
      totalAmount: 0
    }
  },
  props: [''],
  watch: {
    base_class_ids () {
      this.totalAmount = 0
      this.base_class_ids.forEach(item => {
        this.totalAmount += Number(item.price)
      })
    }
  },
  created () {
    this.getProductList('subject')
  },
  methods: {
    getProductList (myType) {
      let params = {
        type: myType,
        product_id: this.classForm.product_id,
        subject_id: this.classForm.subject_id,
        grade_id: this.classForm.grade_id,
        term_id: this.classForm.term_id,
        level_id: this.classForm.level
      }
      /* eslint-disable */
      liveApi.createClassOption(params).then(res => {
        if (res.ok) {
          switch (myType) {
            case 'product':
              this.productList = res.data
            case 'subject':
              this.subjectList = res.data
              res.data = []
              this.classForm.subject_id = ''
            case 'grade':
              this.gradeList = res.data
              res.data = []
              this.classForm.grade_id = ''
            case 'term':
              this.termList = res.data
              res.data = []
              this.classForm.term_id = ''
            case 'level':
              this.levelList = res.data
              res.data = []
              this.classForm.level = ''
            case 'base_class':
              this.base_class_list = res.data
              this.classForm.base_class_id = ''
          }
        }
      })
    },
    changeBaseClass () {
      this.base_class_list.forEach(item => {
        if (item.id === this.classForm.base_class_id) {
          console.log(item)
          this.classForm.base_class_name = item.name
          this.classForm.price = item.price
        }
      })
    },
    doConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.showClassType = false
          let { base_class_id, base_class_name, price } = this.classForm
          this.base_class_ids.push({ base_class_id, base_class_name, price })
          this.$emit('classes', this.base_class_ids)
          this.classForm = {
            base_class_id: '',
            term_id: '',
            grade_id: '',
            base_class_name: '',
            price: '',
            subject_id: '',
            level: ''
          }
        }
      })
    },
    doDelete (index) {
      this.base_class_ids.splice(index, 1)
      console.log(this.base_class_ids)
      this.$emit('classes', this.base_class_ids)
    }
  }
}
</script>
<style lang="less">
.purchaseComponent {
  .purchaseWrap__title {
    color: #7A808D;
    margin-left: 6px;
  }
  .base_class,
  .create_class_name {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 210px;
    height: 120px;
    padding: 15px;
    font-size: 14px;
    border: 1px dashed;
    margin: 6px;
    border-radius: 3px;
    p {
      line-height: 18px;
    }
    .base_class_name {
      color: #3E434C;
    }
    .base_class_price {
      position: absolute;
      bottom: 15px;
      color: #C0C9D1;
    }
    .el-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      -o-transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      -moz-transform: translateX(-50%) translateY(-50%);
      -webkit-transform: translateX(-50%) translateY(-50%);
    }
  }
  .footer {
    text-align: center;
  }
  #purchaseComponent .purchaseWrap .el-form-item__content {
    margin-left: 0;
  }
  .classes__number {
    color: #409eff;
  }
  .classes__delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    background:rgba(249,237,238,1);
    border-radius:1px 3px 1px 13px;
    cursor: pointer;
    i {
      position: absolute;
      right: 5px;
      top: 5px;
      &::before {
        width: 10px;
        height: 11px;
      }
    }
  }
  .classes__delete:hover {
    color: #409eff;
  }
  .purchase {
    margin-top: 20px;
    margin-left: 6px;
    font-size: 13px;
    height: 13px;
    line-height: 13px;
    color: #7A808D;
    .purchase__number {
      color: #3E434C;
    }
  }
  .el-dialog {
    .el-dialog__header {
      padding: 20px;
    }
    .el-dialog__body {
      padding: 0 20px 20px;
    }
    .el-form-item__label {
      float: left;
      width: 85px !important;
      height: 50px;
      line-height: 50px;
    }
    .el-form-item__content {
      width: 315px;
      margin-left: 85px !important;
    }
    .el-select {
      width: 315px;
      .el-input, input {
        width: 315px;
        height: 50px !important;
        line-height: 50px;
        border-radius: 0;
      }
    }
  }
}
</style>
