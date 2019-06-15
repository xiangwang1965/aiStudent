<!-- 添加学生页面 -->
<template>
  <div class='addStudentPage'>
    <div class="main">
      <div class="leftTable">
        <p class="leftTitle">学生列表</p>
        <div class="selectRow">
          <el-input class="searchInput" clearable placeholder="请输入学生姓名、ID、手机号" @keyup.enter.native="doSelect" v-model="params.key">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="doSelect"></i>
          </el-input>
          <el-select class="searchSelect" style="width:90px;margin-right:10px;" v-model="params.grade" placeholder="年级" clearable>
            <el-option v-for="item in optionGrade" :key="item.key" :label="item.value" :value="item.value">
            </el-option>
          </el-select>
          <el-select class="searchSelect" style="width:120px;" v-model="params.status" placeholder="全部学生" clearable>
            <el-option v-for="item in statusList" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
          <el-button style="min-width:60px;" icon="el-icon-search" class="selectRow__button cac-button-two searchBtn spc_filter" @click="doSelect">筛选</el-button>
        </div>
        <div class="tableWrapper">
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
            <el-table-column align="center" width="55">
              <template slot-scope="scope">
                <i class="el-icon-circle-plus" @click="addChoose(scope.row)" v-show="scope.row.active!=true"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="学生ID" prop="id" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="手机号" prop="telephone" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="学生姓名" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="学生年级" prop="grade" show-overflow-tooltip></el-table-column>
          </el-table>
          <pagination :config="params" @change="refresh"></pagination>
          <!-- <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.per_page" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
          </el-pagination> -->
        </div>
      </div>
      <div class="middelDiv"></div>
      <div class="rightTable">
        <el-tooltip class="item" :disabled="class_name.length<18" effect="dark" :content="class_name" placement="top">
          <p class="rightTitle">{{class_name}}</p>
        </el-tooltip>
        <div class="tableWrapper chooseTable">
          <el-table
            empty-text="请在左侧表格进行选择"
            height="410"
            :data="chooseData"
            size="mini"
            highlight-current-row
            tooltip-effect="dark"
            ref="multipleTable">
            <el-table-column align="center" width="55">
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
    </div>
    <div class="bottom">
      <p class="warning_info">
        点击“+”号即可在右侧预览班级内的所有学生，点击“-”号即可删掉班级内的学生，避免您添加错误信息，点击下方的“确定“才能将所有学生添加到班级。
      </p>
      <el-button type="primary" size="small" class="add_student cac-button-two cancel_button" @click="cancel">取 消</el-button>
      <el-button type="primary" size="small" class="add_student cac-button-one confirm_button" @click="doSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import studentApi from '@/services/student'
import EventHub from '../../utils/eventHub'
import pagination from '@/components/pagination'
import { requireAgainPage } from '@/utils'
export default {
  data () {
    return {
      loading: false,
      tableData: [],
      chooseData: [],
      params: {
        page: 1,
        per_page: 8,
        total: 0,
        status: '',
        grade: '',
        key: ''
      },
      optionGrade: [
        { value: '一年级', key: 1 },
        { value: '二年级', key: 2 },
        { value: '三年级', key: 3 },
        { value: '四年级', key: 4 },
        { value: '五年级', key: 5 },
        { value: '六年级', key: 6 },
        { value: '初一', key: 7 },
        { value: '初二', key: 8 },
        { value: '初三', key: 9 },
        { value: '高一', key: 10 },
        { value: '高二', key: 11 },
        { value: '高三', key: 12 }
      ],
      optionStudentStatus: [
        { value: '有课', key: 1 },
        { value: '无课', key: 2 }
      ],
      statusList: [
        { value: '全部学生', key: 1 },
        { value: '未分班学生', key: 2 }
      ]
    }
  },
  props: ['class_name', 'class_id', 'class_type'],
  components: {
    pagination
  },
  mounted () {
    this.refresh()
  },
  watch: {
    class_id () {
      this.refresh()
      this.chooseData.length = 0
    }
  },
  created () {
    EventHub.$on('updateStudent', this.test)
  },
  methods: {
    test (data) {
      this.refresh()
    },
    // 根据班级id获取不在这个班级的学生列表
    refresh (index) {
      this.params.page = index || this.params.page
      this.params.class_id = Number(this.class_id)
      this.loading = true
      studentApi.query(this.params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.ok) {
          this.tableData = res.data.data
          this.params.total = res.data.total
          if (requireAgainPage(this.params) > 0) {
            this.params.page = requireAgainPage(this.params)
            this.refresh()
          }
          this.tableData.forEach(item => {
            item.class_status = item.current_class_count === 0 ? '无课' : '有课'
          })
          this.compareDate(this.tableData, this.chooseData)
        }
      })
    },
    doSelect () {
      this.params.page = 1
      this.refresh(this.params)
    },
    addChoose (item) {
      this.$set(item, 'active', true)
      this.chooseData.push(item)
      console.log(this.chooseData)
    },
    doSubmit () {
      if (this.chooseData.length === 0) {
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
        studentsId = studentsId.slice(0, studentsId.length - 1)
        studentsVDId = studentsVDId.slice(0, studentsVDId.length - 1)
        let params = {
          'class_id': Number(this.class_id),
          'student_ids': studentsId,
          'vd_student_ids': studentsVDId,
          'class_type': this.class_type
        }
        let loadingInstance = this.$loading({
          text: '添加中...'
        })
        classroomApi.updateStudent(params).then(res => {
          setTimeout(() => {
            loadingInstance.close()
          }, 500)
          if (res.ok) {
            this.$message({
              type: 'success',
              message: '添加成功！',
              center: true
            })
            this.refresh(this.params)
            this.chooseData = []
            this.$emit('close', 'success')
          }
        })
      }
    },
    cancel () {
      this.$emit('close')
    },
    deleteChoose (index, item) {
      this.chooseData.splice(index, 1)
      this.backCompare(this.tableData, item.id)
    },
    // 判断当前获取的学生中是否已经在选择的列表中，有的话不现实+号
    compareDate (newDate, active) {
      if (Array.isArray(newDate) && Array.isArray(active)) {
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
      if (Array.isArray(newDate)) {
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
    }
  }
}
</script>
<style lang="less">
.addStudentPage {
  margin-top: 2px;
  text-align: left;
  .main {
    display: flex;
    overflow: hidden;
  }
  .selectRow {
    width: 100%;
    height: 30px;
    text-align: left;
    padding: 0;
    margin-top: 0;
    .searchInput {
      float: right;
      width: 220px;
      height: 30px;
      line-height: 30px;
    }
    .searchSelect, .searchBtn {
      float: left;
    }
  }
  .leftTable {
    width: 560px;
    height: 450px;
    float: left;
  }
  .rightTable {
    width: 338px;
    height: 450px;
    float: right;
    position: relative;
  }
  .leftTitle, .rightTitle {
    width: 360px;
    height:30px;
    overflow: hidden;
    font-size:18px;
    text-overflow: ellipsis;
    font-family:PingFangSC-Medium;
    font-weight:bold;
    color:#3E434C;
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

  .middelDiv {
    width: 20px;
  }
  .warning_info {
    font-size: 14px;
    width: 100%;
    margin-top:10px;
    text-align: left;
  }
  .add_student {
    height: 40px;
    margin-top: 10px;
  }
  .studentInfo h4 {
    margin-bottom: 10px;
  }
  .el-icon-circle-plus,
  .el-icon-remove {
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
  }
  .el-pagination.userTable__page {
    margin-top: 10px;
  }
  .tableWrapper {
    margin-top: 12px;
  }
  .tableWrapper:nth-child(2){
    margin-top: 0;
  }
  .chooseTable.el-table--border{
    border-bottom: none;
  }
  .pagination {
    text-align: center;
    .el-pagination {
      margin-top: 10px;
      text-align: center;
    }
    .pageNum {
      margin-top: 10px;
    }
  }
  .bottom {
    text-align: center;
  }
}
</style>
