<!-- 创建班级-选择班级类型 -->
<template>
  <div id='classtypeComponents' class="classtypeComponents">
    <el-form label-width="100px" size="mini" :model="params">
      <el-form-item label="学科：" prop="subject_id">
        <el-select @change="getProductList('grade')" v-model="params.subject_id" placeholder="请选择学科">
          <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级：" prop="grade_id">
        <el-select @change="getProductList('term')" v-model="params.grade_id" placeholder="请选择年级">
          <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学期：" prop="term_id">
        <el-select @change="getProductList('level')" v-model="params.term_id" placeholder="请选择学期">
          <el-option v-for="item in termList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班型：" prop="level">
        <el-select @change="getProductList('base_class')" v-model="params.level" placeholder="请选择班型">
          <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型：" prop="base_class_id">
        <el-select @change="changeBaseClass" v-model="params.base_class_id" placeholder="请选择课程类型">
          <el-option v-for="item in base_class_list" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="doClose" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      <el-button type="primary" size="small" @click="doConform" class="cac-button-one conform-button confirm_button" round>确 定</el-button>
    </span>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import liveApi from '../../services/live'
export default {
  data () {
    return {
      optionLevel: [],
      optionGrade: [],
      optionTerm: [],
      optionBaseClass: [],
      twiceChoose: false,
      courseList: [],
      subjectList: [],
      gradeList: [],
      termList: [],
      levelList: [],
      base_class_list: []
    }
  },
  props: {
    params: Object,
    optionSubject: Array
  },
  created () {
    this.getProductList('subject')
  },
  methods: {
    // 获取课节
    fetchCourses (id) {
      let params = {
        'base_class_id': id
      }
      classroomApi.queryCourseByType(params).then(res => {
        if (res.ok) {
          this.courseList = res.data
          if (res.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '当前班型无对应课节，请重新选择班型',
              center: true
            })
          } else {
            if (this.params.start_date) {
              this.courseList.forEach(item => {
                item.date = this.params.start_date
              })
            }
          }
        }
      })
    },
    // 如果4个条件确认出来的班型不唯一，再进行一次选择
    handleBaseClass (value) {
      this.optionBaseClass.forEach(item => {
        if (item.base_class_id === value) {
          this.params.base_class_id = value
          this.params.base_class_id = value
          this.params.base_class_name = item.base_class_name
          this.fetchCourses(this.params.base_class_id)
        }
      })
    },
    getProductList (myType) {
      let params = {
        type: myType,
        product_id: this.params.product_id,
        subject_id: this.params.subject_id,
        grade_id: this.params.grade_id,
        term_id: this.params.term_id,
        level_id: this.params.level
      }
      /* eslint-disable */
      liveApi.createClassOption(params).then(res => {
        if (res.ok) {
          switch (myType) {
            case 'product':
              this.productList = res.data
              res.data = []
            case 'subject':
              this.subjectList = res.data
              res.data = []
              this.params.subject_id = ''
            case 'grade':
              this.gradeList = res.data
              res.data = []
              this.params.grade_id = ''
            case 'term':
              this.termList = res.data
              res.data = []
              this.params.term_id = ''
            case 'level':
              this.levelList = res.data
              res.data = []
              this.params.level = ''
            case 'base_class':
              this.base_class_list = res.data
              this.params.base_class_id = ''
          }
        }
      })
    },
    changeBaseClass () {
      this.base_class_list.forEach(item => {
        if (item.id === this.params.base_class_id) {
          this.base_class = item.name
          this.params.base_class_name = item.name
        }
      })
      this.fetchCourses(this.params.base_class_id)
    },
    // 取消
    doClose () {
      this.$emit('close', false)
    },
    // 确认
    doConform () {
      this.$emit('close', this.params, this.courseList)
    }
  }
}
</script>
<style scoped>
.classtypeComponents > div {
  margin-bottom: 15px;
}
.dialog-footer {
  display: block;
  text-align: center;
}
.cancel.cac-button-two {
  width: 100px;
  margin-right: 65px;
}
.conform-button {
  width: 90px;
  margin-left: 20px;
}
</style>