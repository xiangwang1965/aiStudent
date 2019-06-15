<template>
  <div class="CourseSettingItem">
    <div class="courseName">第{{index+1}}讲{{ lesson_name }}</div>
    <div class="courseSettingWrapper">
      <div class="courseSetting__top">
        <span class="courseSetting__top__title">
          课程日期
        </span>
        <el-date-picker v-model="vm.date" :editable="false" :disabled="!vm.is_special||!vm.status" size="small" type="date" placeholder="选择日期" format="yyyy-MM-dd" :picker-options="dateOption">
        </el-date-picker>
        <el-checkbox v-model="vm.is_special" @change="handleChange" :disabled="!vm.status">特殊设置</el-checkbox>
      </div>
      <div class="courseSetting__bottom">
        <el-time-select :editable="false" placeholder="起始时间" @change="handleChange" :disabled="!vm.is_special||!vm.status" size="small" v-model="vm.startTime" :picker-options="{
            start: '06:00',
            step: '00:15',
            end: '23:00',
            maxTime: vm.endTime
          }">
        </el-time-select>
        <span class="setDateView__all__middle"> 至</span>
        <el-time-select :editable="false" placeholder="结束时间" @change="handleChange" :disabled="!vm.is_special||!vm.status" size="small" v-model="vm.endTime" :picker-options="{
            start: '06:00',
            step: '00:15',
            end: '23:00',
            minTime: vm.startTime
          }">
        </el-time-select>
      </div>
    </div>
  </div>
</template>

<script>
import { getOffsetDate, getNextWeekday } from '@/utils'
export default {
  props: {
    lesson_name: String, // 标题
    symbol: [Number, String], // 选择的周几标示，可能是每天:7 或者周几:0-6
    nextWeekday: Date, // 排课最近的那天
    startTime: String, // 开始时间
    endTime: String, // 结束时间
    index: Number, // 用来决定当前组件日期的index
    is_special: Boolean, // 修改时用来判断是否特殊设置了
    date: Date, // 修改的时候这个课节的日期
    startDate: { tyep: Date || String }, // 班级的课程开始时间
    commonStartTime: String, // 总体的开始上课时间
    commonEndTime: String, // 总体的开始下课时间
    status: Boolean, // 这个课节的上课状态
    lessonDate: Number, // 课程时段
    value: {
      type: Object
    }
  },
  data () {
    return {
      dateOption: {
        disabledDate: (time) => {
          // 比较课程开始时间和当前日期谁更大，去较大值作为禁用条件
          let maxDate = this.startDate.getTime() > (Date.now() - 3600 * 1000 * 24) ? this.startDate.getTime() : Date.now() - 3600 * 1000 * 24
          return time.getTime() < maxDate
        }
      },
      vm: {
        date: '',
        startTime: '',
        endTime: '',
        is_special: false,
        status: true
      }
    }
  },
  computed: {
    // 课程的时间间隔， symbol === 7 代表每天
    step () {
      return this.symbol === 7 ? 1 : 7
    }
  },
  created () {
    if (this.$route.query.create === 'edit') {
      for (var key in this.vm) {
        this.vm[key] = this[key]
      }
    }
    this.setLastTime()
  },
  watch: {
    nextWeekday (val) {
      !this.vm.is_special && (this.vm.date = getOffsetDate(this.index * this.step, val))
      // this.origin_date = this.vm.date
      this.handleChange()
    },
    startTime (val) {
      val && (!this.vm.is_special) && (this.vm.startTime = val)
      // this.origin_startTime = val
      this.handleChange()
    },
    endTime (val) {
      val && (!this.vm.is_special) && (this.vm.endTime = val)
      // this.origin_endTime = val
      this.handleChange()
    },
    'vm.is_special' (val, oldval) {
      if (oldval) {
        // this.$route.query.create === 'create' ? this.getCreateTime() :
        this.getEditTime()
      }
    },
    commonStartTime (val) {
      !this.vm.is_special && (this.vm.startTime = this.commonStartTime)
    },
    commonEndTime (val) {
      !this.vm.is_special && (this.vm.endTime = this.commonEndTime)
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', this.vm)
    },
    setLastTime () {
      // 本来handleChange() 可以直接放在created中，为了解决更改班级类型时自动赋值的问题，初始化时间
      if (this.$route.query.create === 'create') {
        !this.vm.is_special && (this.vm.date = getOffsetDate(this.index * this.step, this.nextWeekday))
        this.startTime && (!this.vm.is_special) && (this.vm.startTime = this.startTime)
        this.endTime && (!this.vm.is_special) && (this.vm.endTime = this.endTime)
      }
      this.handleChange()
    },
    // 创建是取消特殊设置
    // getCreateTime () {
    //   this.vm.date = this.origin_date
    //   this.vm.startTime = this.origin_startTime
    //   this.vm.endTime = this.origin_endTime
    // },
    // 修改时取消特殊设置
    getEditTime () {
      this.vm.date = getOffsetDate(this.index * this.step, getNextWeekday(this.startDate, this.lessonDate))
      this.vm.startTime = this.commonStartTime
      this.vm.endTime = this.commonEndTime
    }
  }
}
</script>

<style scoped>
.CourseSettingItem {
  height: 100px;
  margin-right: 0;
}
.courseSetting__top {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.courseName {
  height: 58px;
  width: 100%;
  line-height: 58px;
}
.setDateView__all__middle {
  margin: 0 5px;
  display: inline-block;
}
.courseSettingWrapper {
  display: flex;
  width: 100%;
}
.courseSettingWrapper > div {
  flex: 1;
}
.courseSetting__top .el-date-editor.el-input {
  margin: 0 14px 0 12px;
}
.courseSetting__top__title {
  font-size: 12px;
}
@media (max-width: 1418px) {
  .CourseSettingItem {
    height: 150px;
  }
}
.el-date-editor.el-input {
  min-width: 150px;
  width: 45%;
}
</style>
