<template>
    <div :index="oneTimeIndex" class="margin-bottom-15">
      <el-form :inline="true" ref="timeListRules" :rules="timeListRules" :model="dynamicTimeData" label-width="80px">
        <el-form-item prop="scene_start_time">
          <el-time-picker
            placeholder="开始时间"
            v-model="dynamicTimeData.scene_start_time"
            format="HH:mm"
            value-format="HH:mm"
            :editable="false"
            :clearable="false"
            :picker-options="{
              selectableRange:`00:00:00 -${dynamicTimeData.scene_end_time ? dynamicTimeData.scene_end_time+':00' : '23:59:00'}`
            }"
            @change="sceneStartTimeChange">
            <i slot="suffix" class="el-input__icon el-icon-date"></i>
          </el-time-picker>
          <!--selectableRange: selectableRangeBegin-->
        </el-form-item>
        <el-form-item prop="scene_end_time">
          <el-time-picker
            style="vertical-align: top;"
            placeholder="结束时间"
            v-model="dynamicTimeData.scene_end_time"
            format="HH:mm"
            :editable="false"
            :clearable="false"
            :picker-options="{
                selectableRange:`${dynamicTimeData.scene_start_time ? dynamicTimeData.scene_start_time+':00' : '00:00:00'}-23:59:00`
            }"
            value-format="HH:mm"
            @change="sceneEndTimeChange">
          </el-time-picker>
          <!--selectableRange: selectableRangeEnd-->
          <div class="time-one">
            <i class="el-icon-circle-plus common-icon add-icon" @click="addOneTime(index)" v-if="index==timeListLength-1"></i>
            <i class="el-icon-remove common-icon delete-icon" @click="deleteOneTime(index)" v-if="timeListLength>1"></i>
          </div>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  export default {
    name: 'dynamicTime',
    props: {
      dynamicTimeData: Object,
      oneTimeIndex: Number,
      timeListLength: Number
      // beginTimeAndEndTime: String
    },
    data () {
      return {
        index: this.oneTimeIndex,
        formName: this.dynamicTimeData,
        timeListRules: {
          scene_start_time: [{required: true, message: '请选择时间段', trigger: 'blur'}],
          scene_end_time: [{required: true, message: '请选择时间段', trigger: 'blur'}]
        }
        // selectableRangeBegin: '00:00:00-23:59:00',
        // selectableRangeEnd: '00:00:00-23:59:00'
      }
    },
    // watch: {
    //   'dynamicTimeData.scene_start_time': {
    //     handler: function (val, oldVal) {
    //       const arr = val.split(':')
    //       console.log(arr)
    //       const times = this.beginTimeAndEndTime.split('~')
    //       console.log(times)
    //       // const begin = (Number(arr[0]) + Number(times[0])) + ':' + arr[1] + ':00'
    //       // const end = (Number(arr[0]) + Number(times[1])) + ':' + arr[1] + ':00'
    //       const begin = Number(arr[0]) + Number(times[0])
    //       const end = (Number(arr[0]) + Number(times[1]))
    //       var beginTime
    //       var endTime
    //       console.log(begin)
    //       console.log(end)
    //       if (begin > 23) {
    //         beginTime = '23:59:00'
    //       } else {
    //         beginTime = begin + ':' + arr[1] + ':00'
    //       }
    //       if (end > 23) {
    //         endTime = '23:59:00'
    //       } else {
    //         endTime = end + ':' + arr[1] + ':00'
    //       }
    //       this.selectableRangeEnd = beginTime + '-' + endTime
    //       console.log(this.selectableRangeEnd)
    //     },
    //     deep: true
    //   },
    //   'dynamicTimeData.scene_end_time': {
    //     handler: function (val, oldVal) {
    //       const arr = val.split(':')
    //       console.log(arr)
    //       const times = this.beginTimeAndEndTime.split('~')
    //       console.log(times)
    //       // const begin = (Number(arr[0]) + Number(times[0])) + ':' + arr[1] + ':00'
    //       // const end = (Number(arr[0]) + Number(times[1])) + ':' + arr[1] + ':00'
    //       const begin = Number(arr[0]) - Number(times[1])
    //       const end = (Number(arr[0]) - Number(times[0]))
    //       var beginTime
    //       var endTime
    //       console.log(begin)
    //       console.log(end)
    //       if (begin < 0) {
    //         beginTime = '00:00:00'
    //       } else {
    //         beginTime = begin + ':' + arr[1] + ':00'
    //       }
    //       if (end < 0) {
    //         endTime = '00:00:00'
    //       } else {
    //         endTime = end + ':' + arr[1] + ':00'
    //       }
    //       this.selectableRangeBegin = beginTime + '-' + endTime
    //       console.log(this.selectableRangeBegin)
    //     },
    //     deep: true
    //   }
    // },
    methods: {
      // 添加一个
      addOneTime () {
        this.$refs.timeListRules.validate((valid) => {
          if (valid) {
            this.$emit('addOne')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      //  删除
      deleteOneTime (index) {
        this.$emit('deleteOne', index)
      },
      // 重置表单
      resetForm () {
        this.$refs.timeListRules.resetFields()
      },
      // 开始时间change
      sceneStartTimeChange (item) {
        this.dynamicTimeData.scene_start_time = item
        this.$emit('sceneStartTimeChange')
      },
      // 结束时间change
      sceneEndTimeChange (item) {
        this.dynamicTimeData.scene_end_time = item
        this.$emit('sceneEndTimeChange')
      }
    }
  }
</script>
<!--:disabled="status === 'edit' || !createForm.scene_base_class_id"-->
<style scoped>
  .margin-bottom-15{
    margin-bottom:10px;
  }
  .time-one{
    min-width:50px;
    display:inline-block;
  }
  .common-icon{
    line-height:50px;
    display:inline-block;
    font-size:20px;
  }
  .add-icon{
    color:#3C75F6;
  }
  .delete-icon{
    color:#FF6968;
  }
</style>
