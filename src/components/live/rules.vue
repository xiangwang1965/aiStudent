<!-- 辅导老师课时费计算规则 -->
<template>
  <div id='rulesComponent'>
    <div class="rulesWrap" v-for="(item, index) in rulesData" :key="index">
      <h5>{{item.title}}</h5>
      <p>{{item.content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rulesData: [
        {title: '辅导老师激励', content: '为了激励辅导老师对学生提供优质的教学服务，未来魔法校会对辅导老师的教学服务环节进行评价，并对评价合格的老师发放现金激励。辅导老师激励金将先由未来魔法校发放至各机构，并委托各机构代为发放至机构各辅导老师。'},
        {title: '激励明细出单时间', content: '机构所有老师当月应发激励明细，在次月1日零点发出。'},
        {title: '激励发放时间', content: '辅导老师激励一月一发放，未来魔法校在每月15日将上月辅导老师激励金额发放至机构，机构收到激励金额后，应尽快发放至辅导老师。'},
        {title: '激励发放金额', content: '辅导老师可以在辅导老师APP内查看每月应得激励金额，机构应如实按照激励明细单中的金额对每一位辅导老师发放激励。'}
      ]
    }
  }
}
</script>
<style scoped>
.rulesWrap{
  text-align: left;
  margin-bottom: 15px;
}
.rulesWrap h5{
  font-size: 16px;
  margin-bottom: 5px;
  color: #333;
}
.rulesWrap p{
  color: #666;
}
</style>