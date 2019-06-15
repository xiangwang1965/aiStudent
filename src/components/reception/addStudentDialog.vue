<!-- 添加学生页面 -->
<template>
  <el-dialog class="addStudentDialog" append-to-body :visible.sync="config.visible" width="1050px" title="添加学生" @open="dialogOpen">
    <div class="main">
      <div class="leftTable">
        <p class="leftTitle">学生列表</p>
        <div class="selectRow">
          <el-input class="searchInput" style="width:150px;" @keyup.enter.native="doSelect" placeholder="请输入学生姓名、ID、手机号" v-model="params.key">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="doSelect"></i>
          </el-input>
          <el-select class="searchSelect" style="margin-right:10px;" v-model="params.grade" placeholder="年级" clearable>
            <el-option v-for="item in gradeList" :key="item.grade_id" :label="item.grade_name" :value="item.grade_id">
              {{item.grade_name}}
            </el-option>
          </el-select>
          <el-select class="searchSelect" style="width:120px;" v-model="status" placeholder="全部学生" clearable>
            <el-option v-for="item in statusList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          <el-button type="primary" style="min-width:80px;"  class="cac-button-one spc_filter" round @click="doSelect">筛选</el-button>
          <!--<el-button type="primary" style="min-width:80px;" icon="el-icon-search" class="selectRow__button cac-button-two searchBtn" @click="doSelect">筛选</el-button>-->
        </div>
        <div class="tableWrapper spc_table">
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            height="325"
            size="mini"
            highlight-current-row
            tooltip-effect="dark"
            ref="multipleTable">
            <el-table-column align="center" width="60">
              <template slot-scope="scope">
                <i class="el-icon-circle-plus" @click="addChoose(scope.row)" v-show="scope.row.active!=true"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="学生ID" prop="id" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="学生姓名" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="学生年级" prop="" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.grade || '无'}}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination :config="params" @change="refresh"></pagination>
          <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
          </el-pagination> -->
        </div>
      </div><div class="rightTable">
        <el-tooltip class="item" :disabled="class_name && class_name.length< 18" effect="dark" :content="class_name ? class_name : ''" placement="top">
          <p class="rightTitle">{{class_name}}</p>
        </el-tooltip>
        <div class="tableWrapper chooseTable spc_table">
          <el-table
            empty-text="请在左侧表格进行选择"
            height="403"
            :data="chooseData"
            size="mini"
            highlight-current-row
            tooltip-effect="dark"
            ref="multipleTable">
            <el-table-column align="center" width="60">
              <template slot-scope="scope">
                <i class="el-icon-remove" @click="deleteChoose(scope.$index,scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="学生ID" prop="id" show-overflow-tooltip width="65"></el-table-column>
            <el-table-column align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="学生姓名" prop="name" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="dialogBottom">
        <p class="warning_info">
          点击“+”号即可在右侧预览班级内的所有学生，点击“-”号即可删掉班级内的学生，避免您添加错误信息，点击下方的“确定“才能将所有学生添加到班级。
        </p>
        <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="small" class="add_student cac-button-one dialog_confirm_button" round @click="doSubmit">确 定</el-button>
      </div>
      <i style="clear:both;"></i>
    </div>
  </el-dialog>
</template>

<script>
import receptionApi from '@/services/reception'
import courseApi from '@/services/platform/course'
import studentApi from '@/services/student'
import authUtils from '@/services/auth/utils'
import EventHub from '@/utils/eventHub'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  props: ['class_name', 'class_id', 'class_type', 'config', 'isOld'],
  data () {
    return {
      loading: false,
      tableData: [],
      chooseData: [],
      params: {
        page: 1,
        per_page: 8,
        total: 0,
        grade: '',
        key: ''
      },
      status: '',
      optionStudentStatus: [
        { value: '有课', key: 1 },
        { value: '无课', key: 2 }
      ],
      statusList: [
        { value: '全部学生', key: 1 },
        { value: '未分班学生', key: 2 }
      ],
      levelList: [],
      gradeList: [],
      courseTypeList: [],
      canSubmit: true
    }
  },
  components: {
    pagination
  },
  created () {
    EventHub.$on('updateStudent', this.test)
    if (this.isOld) {
      receptionApi.getOptionsList().then(res => {
        this.levelList = res.data.class_type
        this.gradeList = res.data.grade
        this.courseTypeList = res.data.course_types
        this.refresh()
      })
    } else {
      receptionApi.getOptionsList().then(res => {
        this.courseTypeList = res.data.course_types
        this.levelList = res.data.class_type
        this.gradeList = res.data.grade
        // this.getClassLevelList()
        // this.getGradeList()
        this.refresh()
      })
    }
  },
  watch: {
    'class_id': function (val, oldval) {
      this.chooseData = []
      this.params.page = 1
      this.params.grade = ''
      this.params.key = ''
      this.status = ''
      this.refresh()
    }
  },
  methods: {
    test (data) {
      this.refresh()
    },
    dialogOpen () {
      this.canSubmit = true
    },
    getOptionsList () {
      receptionApi.getOptionsList().then(res => {
        this.levelList = res.data.class_type
        this.gradeList = res.data.grade
      })
    },
    getClassLevelList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getClassLevelList(params).then(res => {
        this.levelList = res
      })
    },
    getGradeList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getGradeList(params).then(res => {
        this.gradeList = res
      })
    },
    // 根据班级id获取不在这个班级的学生列表
    refresh (index) {
      this.params.page = (index && typeof index === 'number') ? index : this.params.page
      let params = {}
      params = {
        grade: this.params.grade,
        key: this.params.key,
        page: this.params.page,
        per_page: this.params.per_page,
        total: this.params.total
      }
      params.class_id = this.class_id
      params.school_id = authUtils.getUser().school_id
      if (this.status * 1 === 2) {
        params.status = 2
      }
      this.loading = true
      studentApi.getAddStudentList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.status_code === 200) {
          this.tableData = res.data.data
          this.params.total = res.data.total
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.refresh()
          }
          this.tableData.forEach(item => {
            item.class_status =
              item.current_class_count === 0 ? '无课' : '有课'
          })
          this.compareDate(this.tableData, this.chooseData)
        }
      })
      // }
    },
    doSelect () {
      this.params.page = 1
      this.refresh()
    },
    addChoose (item) {
      this.$set(item, 'active', true)
      this.chooseData.push(item)
    },
    doSubmit () {
      if (this.chooseData && this.chooseData.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择学生',
          center: true
        })
      } else {
        let studentsId = ''
        let studentsVDId = ''
        this.chooseData.forEach(item => {
          studentsId += item.id + ','
          studentsVDId += item.vd_id + ','
        })
        if (studentsId) {
          studentsId = studentsId.slice(0, studentsId.length - 1)
        }
        if (studentsVDId) {
          studentsVDId = studentsVDId.slice(0, studentsVDId.length - 1)
        }
        let params = {
          class_id: Number(this.class_id),
          student_ids: studentsId,
          vd_student_id: studentsVDId
        }
        if (this.canSubmit) {
          let loadingInstance = this.$loading({
            text: '添加中...'
          })
          this.canSubmit = false
          receptionApi.addStudent(params).then(res => {
            setTimeout(() => {
              loadingInstance.close()
            }, 500)
            this.canSubmit = true
            if (res.status_code === 200) {
              if (this.params.page >= this.params.total / 8 && this.chooseData.length === this.tableData.length) {
                this.params.page --
              }
              this.$message({
                type: 'success',
                message: '添加成功',
                center: true
              })
              this.config.visible = false
              this.chooseData = []
              this.$emit('close', 'success')
            }
          })
        }
      }
    },
    deleteChoose (index, item) {
      this.chooseData.splice(index, 1)
      this.backCompare(this.tableData, item.id)
    },
    // 判断当前获取的学生中是否已经在选择的列表中，有的话不现实+号
    compareDate (newDate, active) {
      if (newDate && active && Array.isArray(newDate) && Array.isArray(active)) {
        for (var i = 0; i < newDate.length; i++) {
          for (var j = 0; j < active.length; j++) {
            if (newDate[i].id === active[j].id) {
              this.$set(newDate[i], 'active', true)
            }
          }
        }
      } else {
        console.error('类型有误')
      }
    },
    // 把选择的学生勾掉的时候判断当前筛选条件中是否应该出现
    backCompare (newDate, id) {
      if (newDate && Array.isArray(newDate)) {
        for (var i = 0; i < newDate.length; i++) {
          if (id === newDate[i].id) {
            this.$set(newDate[i], 'active', false)
          }
        }
      } else {
        console.error('类型有误')
      }
    },
    goPage (val) {
      this.params.page = val
      this.refresh(this.params)
    },
    cancel () {
      this.config.visible = false
    }
  }
}
</script>
<style lang="less">
.addStudentDialog {
  .el-input__icon{
    line-height: normal;
  }
  .el-dialog__header {
    padding: 20px 30px 10px;
    .el-dialog__title{
      font-size: 20px;
    }
  }
  .el-dialog__body {
    padding: 10px 30px 20px;
  }
  .selectRow {
    width: 100%;
    height: 30px;
    text-align: left;
    padding: 0;
    margin-top: 0;
    .searchInput {
      float: right;
      width: 220px !important;
      height: 30px;
      line-height: 30px;
      input {
        width: 220px;
      }
    }
    .searchSelect, .searchBtn {
      float: left;
    }
    .el-select, .el-input, input {
      width: 110px;
    }
  }
  .tableWrapper {
    margin-top: 10px;
      background-color: #F9FBFC;
    .el-table {
      background-color: #F9FBFC;
      .el-table__body-wrapper, .el-table__header-wrapper {
        font-size: 12px;
      }
      tr {
        background-color: #F9FBFC;
      }
    }
  }
  .leftTable, .rightTable {
    display: inline-block;
    box-sizing: border-box;
    vertical-align: top;
    height: 450px;
  }
  .leftTable {
    width: 590px;
    margin-right: 30px;
    .pagination {
      text-align: center;
      .el-pagination, .pageNum {
        margin: 5px 0;
      }
      .number {
        background-color: transparent;
      }
    }
  }
  .rightTable {
    position: relative;
    width: 366px;
    .el-icon-remove {
      color: #FF6968;
    }
    .el-table__empty-text {
      color: #ABB9C6;
    }
  }
  .leftTitle, .rightTitle {
    width: 360px;
    height:30px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 18px;
    text-overflow: ellipsis;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color:#3E434C;
  }
  .dialogBottom {
    text-align: center;
    .el-button {
      width: 100px;
    }
  }
  .leftTable h5,
  .rightTable h5 {
    margin-bottom: 15px;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 20px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .warning_info {
    font-size: 12px;
    width: 100%;
    margin-top:10px;
    text-align: left;
    color: #ABB9C6;
  }
  .add_student {
    height: 40px;
    margin-top: 20px;
  }
  .studentInfo h4 {
    margin-bottom: 10px;
  }
  .el-icon-circle-plus,
  .el-icon-remove {
    font-size: 20px;
    cursor: pointer;
  }
  .el-icon-circle-plus {
    color: #3C75F6;
  }
  .el-pagination.userTable__page {
    margin-top: 10px;
  }

  .tableWrapper:nth-child(2){
    margin-top: 0;
  }
  .chooseTable.el-table--border{
    border-bottom: none;
  }
}
</style>
