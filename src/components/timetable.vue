<template>
  <div class="timeTableDialog">
    <p class="timeTitle">
      <el-button-group>
        <el-button type="text" size="mini" icon="el-icon-arrow-left" @click="leftWeek"></el-button>
        <el-button type="text" size="mini">
          <span>{{timeTitle.mondayYear}}年</span>
          <span>{{timeTitle.mondayMonth}}月</span>
          <span style="color:#3E434C;">{{timeTitle.mondayDay}}</span>
          <span style="color:#3E434C;">-</span>
          <span v-if="timeTitle.mondayYear !== timeTitle.sundayYear">{{timeTitle.sundayYear}}年</span>
          <span v-if="timeTitle.mondayMonth !== timeTitle.sundayMonth">{{timeTitle.sundayMonth}}月</span>
          <span style="color:#3E434C;">{{timeTitle.sundayDay}}日</span>
        </el-button>
        <el-button type="text" size="mini" icon="el-icon-arrow-right" @click="rightWeek"></el-button>
      </el-button-group>
      <el-button class="cac-button-one-today today_button" size="mini" @click="initWeekDate">今天</el-button>
    </p>
    <div class="statusBox">
      <span style="margin-right:20px;">
        <span class="busyIcon"></span>
        <span>已占用</span>
      </span>
      <span>
        <span class="emptyIcon"></span>
        <span>空闲</span>
      </span>
      <el-input v-if="isWisroom !== 'wisroom'" style="float:right;width:220px;" size="mini" @keyup.enter.native="getTimeData" v-model="searchKey" :placeholder="searchHolder">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getTimeData"></i>
      </el-input>
    </div>
    <div class="timeTableWrap">
      <el-table :data="tableData" height="455" :header-cell-class-name="'timeTableTitle'" fit>
        <el-table-column label="面授主讲" class-name="firstColumn" v-if="role === 'teacher'" prop="scene_teacher_name" show-overflow-tooltip>

        </el-table-column>
        <el-table-column width="100" label="教室" class-name="firstColumn" v-if="role === 'class'" prop="class_name" show-overflow-tooltip>

        </el-table-column>
        <el-table-column width="130" :class-name="title.today ? 'todayColumn' : ''" v-for="(title, index) in tableTitle" :key="index" :label="title.label">
          <template slot-scope="scope">
            <div v-if="scope.row.data[index].length < 4">
              <span v-for="(time,index) in scope.row.data[index]" :key="index">{{time}}</span>
            </div>
            <div v-else>
              <span v-if="index < 2" v-for="(time,index) in scope.row.data[index]" :key="index">{{time}}</span>
              <el-popover
                placement="right"
                width="110"
                trigger="click">
                <span
                  style="display:block;background-color:#FFF;'border-bottom':1px solid #7A808D;">更多排课</span>
                <span
                  v-if="index > 1"
                  v-for="(time,index) in scope.row.data[index]"
                  :key="index"
                  style="display:block;font-size:12px;">
                  <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:#FF6D2D;margin-bottom: 3px;"></span>
                  {{time}}
                </span>
                <span slot="reference" style="background-color:#FF6D2D;color:#FFF;cursor:pointer;">更多排课</span>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getStartDate, formatDay } from '@/utils'
import authUtil from '@/services/auth/utils'
import receptionApi from '@/services/reception'
export default {
  props: ['role', 'campus_id', 'brandId'],
  data () {
    return {
      todayStartTime: '',
      mondayTime: '',
      sundayTime: '',
      searchKey: '',
      tableData: [],
      isWisroom: authUtil.getUser().third_part === 'wisroom' ? 'wisroom' : -1
    }
  },
  created () {
    this.initWeekDate()
  },
  computed: {
    searchHolder () {
      switch (this.role) {
        case 'teacher':
          return '请输入老师名称'
        case 'class':
          return '请输入教室名称'
        default:
          return '请输入关键字'
      }
    },
    timeTitle () {
      let mondayDate = new Date(this.mondayTime)
      let sundayDate = new Date(this.sundayTime)
      let obj = {
        mondayYear: mondayDate.getFullYear(),
        mondayMonth: mondayDate.getMonth() + 1,
        mondayDay: mondayDate.getDate(),
        sundayYear: sundayDate.getFullYear(),
        sundayMonth: sundayDate.getMonth() + 1,
        sundayDay: sundayDate.getDate()
      }
      return obj
    },
    tableTitle () {
      let date = this.mondayTime
      let oneDayTime = 24 * 60 * 60 * 1000
      let arr = [{label: 'monday', value: '周一'},
          {label: 'tuesday', value: '周二'},
          {label: 'wednesday', value: '周三'},
          {label: 'thursday', value: '周四'},
          {label: 'friday', value: '周五'},
          {label: 'saturday', value: '周六'},
          {label: 'sunday', value: '周日'}]
      let titleArr = []
      arr.map((v, index) => {
        let obj = {
          label: new Date(date + index * oneDayTime).getMonth() + 1 + '月' + new Date(date + index * oneDayTime).getDate() + '日' + '（' + v.value + '）'
        }
        if (getStartDate(date + index * oneDayTime) === this.todayStartTime) {
          obj.today = true
        } else {
          obj.today = false
        }
        titleArr.push(obj)
      })
      return titleArr
    }
  },
  methods: {
    initWeekDate () {
      let nowDate = new Date()
      let nowTime = nowDate.getTime()
      let day = nowDate.getDay()
      let oneDayTime = 24 * 60 * 60 * 1000
      let monday = day === 0 ? 6 : day - 1
      let sunday = day === 0 ? 0 : 7 - day
      this.mondayTime = nowTime - monday * oneDayTime
      this.sundayTime = nowTime + sunday * oneDayTime
      this.todayStartTime = getStartDate(nowTime)
      this.getTimeData()
    },
    leftWeek () {
      let oneWeekTime = 7 * 24 * 60 * 60 * 1000
      this.mondayTime -= oneWeekTime
      this.sundayTime -= oneWeekTime
      this.getTimeData()
    },
    rightWeek () {
      let oneWeekTime = 7 * 24 * 60 * 60 * 1000
      this.mondayTime += oneWeekTime
      this.sundayTime += oneWeekTime
      this.getTimeData()
    },
    getTimeData () {
      let params = {
        school_id: authUtil.getUser().school_id,
        start_time: formatDay(new Date(this.mondayTime)),
        end_time: formatDay(new Date(this.sundayTime)),
        campus_id: this.campus_id
      }
      if (this.brandId) {
        params.brand = this.brandId
      }
      if (this.searchKey) {
        params.key = this.searchKey
      }
      receptionApi[this.role + 'TimeTable'](params).then(res => {
        this.tableData = res.data.data
      })
    },
    clearTimeData () {
      this.tableData = []
      this.searchKey = ''
    }
  }
}
</script>
<style lang="less">
.timeTableDialog {
  text-align: left;
  .timeTitle {
    .el-button {
      font-size: 24px !important;
      color: #7A808D;
    }
    .today_button {
      color:#3C75F6;
      vertical-align:middle;
      font-size:14px !important;
      min-width: 50px;
    }
  }
  .statusBox {
    line-height:50px;
    span {
      display: inline-block;
      vertical-align: middle;
    }
    .busyIcon, .emptyIcon {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #FFE5D9;
    }
    .emptyIcon {
      background-color: #EEE;
    }
    input {
      border-radius: 15px;
    }
  }
  .timeTableWrap {
    .el-table {
      height: auto;
      td, th {
        .cell {
          font-size: 12px !important;
        }
      }
      td {
        padding: 0 !important;
        .cell {
          height: 100%;
          span {
            display: inline-block;
            width: 80px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 2px;
            background-color: #FFE5D9;
          }
        }
      }
      .firstColumn {
        .cell {
          height: auto;
          width: 90px;
        }
      }
      .el-table__row {
        td:last-of-type {
          .cell {
            min-width: 140px;
          }
        }
      }
    }
    .el-table--mini td:last-of-type .cell,
    .el-table .el-table__body tr td:last-of-type .cell,.el-table .has-gutter tr th:nth-last-of-type(2) .cell{
        min-width: 150px;
    }
    .todayColumn {
      background-color: #F3FAFF;
    }
  }
}
</style>
