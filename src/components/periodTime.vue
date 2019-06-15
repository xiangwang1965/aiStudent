<template>
<div class="periodTime">
  <el-time-picker
    v-model="config.start"
    format="HH:mm"
    value-format="HH:mm"
    placeholder="任意时间点">
  </el-time-picker>
  <el-time-picker
    arrow-control
    v-model="config.end"
    format="HH:mm"
    value-format="HH:mm"
    placeholder="任意时间点">
  </el-time-picker>
</div>
</template>

<script>
  export default {
    name: 'periodTime',
    props: ['config'],
    data () {
      return {}
    },
    methods: {
      init () {

      }
    }
  }
</script>

<style scoped>

</style>
