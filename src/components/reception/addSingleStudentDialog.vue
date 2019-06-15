<template>
  <el-dialog title="选择学生" class="addSingleStudentDialog"
             @open="getStudentList"
             :visible.sync="config.visible"
             append-to-body
             width="1050px">
    <div class="searchKeyWrap">
      <el-select size="medium" placeholder="请选择校区" clearable v-model="student.campus_id">
        <el-option v-for="campus in campusList" :key="campus.id" :label="campus.name" :value="campus.id"></el-option>
      </el-select>
      <el-button type="primary" class="cac-button-one el-button--primary el-button--small is-round spc_filter" size="small" round @click="getStudentList()">筛选</el-button>
      <el-input class="searchInput" style="width:220px;" @keyup.enter.native="getStudentList()" placeholder="请输入学生姓名、手机号、ID" v-model="student.studentKey">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getStudentList()"></i>
      </el-input>
    </div>
    <el-table
      ref="studentTable"
      :data="studentList.list"
      @row-click="rowClick"
      height="440px"
      :highlight-current-row="true">
      <el-table-column label="学生ID" prop="id">

      </el-table-column>
      <el-table-column label="手机号" prop="telephone">

      </el-table-column>
      <el-table-column label="姓名" prop="name">

      </el-table-column>
      <el-table-column label="年级" prop="grade">

      </el-table-column>
    </el-table>
    <pagination :config="pageConfig" @change="goPage"></pagination>
    <div class="footer" slot="footer">
      <el-button type="primary" size="small" class="clearfix cac-button-two cancel-button dialog_cancel_button" round @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="clearfix cac-button-one create-button dialog_confirm_button" round @click="addStudentDone">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import pagination from '@/components/pagination'
  import staffApi from '@/services/internal/staff'
  import receptionApi from '@/services/reception'
  import { requireAgainPage } from '@/utils'
  export default {
    props: ['config', 'classId'],
    data () {
      return {
        student: {
          campus_id: ''
        },
        campusList: [],
        studentList: {
          list: [{
            name: '学生1',
            telephone: '13666666666',
            campus_name: '校区1'
          }, {
            name: '学生2',
            telephone: '13666666666',
            campus_name: '校区1'
          }, {
            name: '学生3',
            telephone: '13666666666',
            campus_name: '校区1'
          }],
          total: 0
        },
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        addStudent: {}
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
        if (this.classId) {
          params.class_id = this.classId
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
        this.addStudent = row
      },
      addStudentDone () {
        this.$emit('select', this.addStudent)
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
  .addSingleStudentDialog {
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
