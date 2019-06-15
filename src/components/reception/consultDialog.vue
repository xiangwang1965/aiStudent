<template>
  <el-dialog title="从咨询本导入" class="consultDialog" @open="dialogOpen" append-to-body :visible.sync="config.visible" width="1200px" height="580px">
    <div class="searchContent" style="overflow:hidden;">
      <el-input style="float:right;" class="searchInput" v-model.trim="userName" @keyup.enter.native="doSelect" placeholder="请输入学生姓名、手机号">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="doSelect"></i>
      </el-input>
    </div>
    <el-table
      ref="table"
      class="courseListTable"
      v-loading="loading"
      :data="consultList"
      highlight-current-row
      @current-change="handleCurrentChange">
      <el-table-column label="选择" width="50">
        <template slot-scope="scope">
          <el-radio v-model="radioFlag" @click="handleRadioSelect(scope.row.orderId)" :label="scope.row.orderId"></el-radio>
        </template>
      </el-table-column>
       <el-table-column prop="orderId" align="center" label="序号" width="50">
      </el-table-column>

      <el-table-column prop="student_name" align="center" label="学生姓名" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="name" align="center" label="微信昵称" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="tel" align="center" label="手机号" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="status_name" label="身份状态" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="activity_count" align="center" label="参加活动次数" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="activity_time" align="center" label="首次活动时间" show-overflow-tooltip>
      </el-table-column>

    </el-table>
    <pagination :config="pageConfig" @change="getConsultList"></pagination>
    <div slot="footer">
      <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
      <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="handleSelectConsult">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import pagination from '@/components/pagination'
import consultApi from '@/services/enroll/consult'
import util from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'

export default {
  props: ['config', 'selectedList'],
  data () {
    return {
      userName: '',
      selectConsult: '',
      radioFlag: '',
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      consultList: [],
      loading: false,
      selectedIdList: [],
      isDefault: true
    }
  },
  components: {
    pagination
  },
  created () {
  },
  methods: {
    init () {
      this.getConsultList()
    },
    getConsultList (page) {
      this.pageConfig.page = page && typeof page === 'number' ? page : this.pageConfig.page

      let params = {}
      if (/\d+/.test(this.userName)) {
        params.tel = this.userName
      } else {
        params.student_name = this.userName
      }
      params.page = this.pageConfig.page
      params.per_page = this.pageConfig.per_page
      params.is_student = 1
      params.school_id = util.getUser().school_id

      this.loading = true
      consultApi.queryConsultList(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 0)
        if (res.status_code === 200) {
          res.data.lists.forEach((item, index) => {
            item.orderId = (this.pageConfig.page - 1) * (this.pageConfig.per_page) + (index + 1)
          })
          this.radioFlag = ''
          this.consultList = res.data.lists
          this.pageConfig.total = res.data.total
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getConsultList()
          }
        }
      })
    },
    dialogOpen () {
      this.init()
      this.selectedIdList = []
      this.radioFlag = ''
      this.isDefault = true
    },
    doSelect () {
      this.pageConfig.page = 1
      this.getConsultList()
    },
    cancelSelect () {
      this.$refs.table.clearSelection()
      this.pageConfig.page = 1
      // this.visible = false
      this.$parent.dialogConsultConfig.visible = false
    },
    handleSelectConsult () {
      if (!this.selectConsult) {
        this.$message({
          message: '请选择学员',
          type: 'warning',
          center: true
        })
        return
      }
      this.$emit('selectConsultDone', this.selectConsult)
      this.$parent.dialogConsultConfig.visible = false
    },
    handleCurrentChange (val) {
      this.selectConsult = val
      if (val) {
        this.handleRadioSelect(val.orderId)
      }
      // this.$emit('selectConsultDone', val)
    },
    handleRadioSelect (id) {
      this.radioFlag = id
    }
  }
}
</script>
<style lang="less">
.consultDialog {
  font-size: 12px;
  .el-dialog__header {
    padding: 20px 20px 10px;
    .el-dialog__title {
      font-weight: bold;
    }
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 10px;
    min-height: 450px;
    .el-table__header-wrapper {
      .el-checkbox {
        display: none;
      }
    }
    .el-table__body-wrapper {
      overflow-x: hidden;
    }
  }
  .searchContent {
    .el-select {
      width: 110px;
    }
    .searchInput {
      float: right;
      width: 220px;
    }
    .el-input__icon {
      line-height: 1;
    }
  }
  .courseListTable {
    margin-top: 10px;
    font-size: 12px;
  }
  .radio-active {
    background: blue;
  }
  .radio-full {
    background: #fff;
  }
  .el-radio .el-radio__label {
    font-size: 0;
  }
}
</style>
