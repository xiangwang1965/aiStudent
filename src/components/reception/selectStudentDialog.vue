<template>
  <el-dialog title="选择学生" class="selectStudentDialog"
    :visible.sync="config.visible"
    @open="getStudentList(true)"
    append-to-body
    width="1050px">
    <div class="searchKeyWrap">
      <el-select size="medium" placeholder="请选择校区" clearable v-model="student.campus_id">
        <el-option v-for="campus in campusList" :key="campus.id" :label="campus.name" :value="campus.id"></el-option>
      </el-select>
      <el-button type="primary" class="cac-button-one el-button--primary el-button--small is-round spc_filter" size="small" round @click="getStudentList()">筛选</el-button>
      <el-input class="searchInput" style="width:260px;" @keyup.enter.native="getStudentList()" placeholder="请输入学生姓名、手机号、ID" v-model="student.studentKey">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getStudentList()"></i>
      </el-input>
    </div>
    <el-table
      ref="studentTable"
      :data="studentList.list"
      @row-click="rowClick"
      height="445px"
      :highlight-current-row="true">
      <el-table-column label="姓名" prop="name">

      </el-table-column>
      <el-table-column label="手机号" align="center" prop="telephone">

      </el-table-column>
      <el-table-column label="所属校区" align="center" prop="campus_name">

      </el-table-column>
      <el-table-column v-if="from === 'addfee' && isCharge >= 0" align="center" label="补费课程/班级" prop="canAddFee">

      </el-table-column>
      <el-table-column v-if="from === 'quit' && isCharge >= 0" align="center" label="退费退班" prop="canQuitFee">

      </el-table-column>
      <el-table-column v-if="!from" align="center" label="已在班级" prop="current_class_count">

      </el-table-column>
      <!-- <el-table-column label="在读课程" prop="name">

      </el-table-column> -->
    </el-table>
    <pagination :config="pageConfig" @change="goPage"></pagination>
    <div class="footer" slot="footer">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button dialog_cancel_button" round @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button dialog_confirm_button" round @click="selectStudentDone">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import pagination from '@/components/pagination'
  import staffApi from '@/services/internal/staff'
  import receptionApi from '@/services/reception'
  import authUtils from '@/services/auth/utils'
  import { requireAgainPage } from '@/utils'
  export default {
    props: ['config', 'from', 'class_type'],
    data () {
      return {
        student: {
          campus_id: ''
        },
        campusList: [],
        studentList: {
          list: [],
          total: 0
        },
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        selectStudent: {},
        isCharge: authUtils.getUser().permissions.indexOf('enroll_charge')
      }
    },
    components: {
      pagination: pagination
    },
    created () {
      this.getCampusList()
      this.getStudentList()
    },
    methods: {
      getCampusList () {
        staffApi.getCampusList({status: 1}).then(res => {
          this.campusList = res
        })
      },
      getStudentList (flag) {
        var params = {
          page: flag ? this.pageConfig.page : 1,
          per_page: this.pageConfig.per_page
        }
        if (this.class_type) {
          params.class_type = this.class_type
        }
        if (this.student.campus_id) {
          params.campus_id = this.student.campus_id
        }
        if (this.student.studentKey) {
          params.key = this.student.studentKey
        }
        receptionApi.getStudentList(params).then(res => {
          this.studentList.list = res.data.data
          this.pageConfig.page = Number(res.data.current_page)
          this.studentList.total = this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getStudentList()
          }
        })
      },
      rowClick (row) {
        this.$refs.studentTable.setCurrentRow(row)
        this.selectStudent = row
      },
      selectStudentDone () {
        this.$emit('select', this.selectStudent)
        this.config.visible = false
      },
      cancel () {
        this.$refs.studentTable.setCurrentRow()
        this.config.visible = false
      },
      goPage (index) {
        this.pageConfig.page = index
        this.getStudentList(true)
      }
    }
  }
</script>
<style lang="less">
.selectStudentDialog {
  .el-dialog__header {
    padding: 30px 30px 10px 30px;
    .el-dialog__title {
      font-weight: bold;
    }
  }
  .el-dialog__body {
    padding: 10px 30px;
    td {
      height: 50px;
    }
  }
  .searchKeyWrap {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    .searchInput {
      float: right;
    }
    .el-button {
      min-width: 90px;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
