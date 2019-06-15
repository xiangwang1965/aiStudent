<!-- 弹窗 -->
<template>
  <div id='dialogComponent' class="dialogComponent">
    <div class="innerWrap">
      <div class="close" @click="doClose"></div>
      <div class="buttonWrap">
        <button v-for="(item,index) in users" :key="index" class="school" @click="getSchool(item)">{{item.school ? item.school.name : item.name}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    users: Array
  },
  watch: {
    users () {}
  },
  methods: {
    doClose () {
      this.$emit('school', true)
    },
    getSchool (item) {
      this.$emit('school', item)
    }
  }
}
</script>
<style scoped>
.dialogComponent {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.innerWrap {
  width: 30%;
  padding: 20px;
  padding-bottom: 50px;
  border-radius: 10px;
  background-color: #fff;
  color: #333;
  font-size: 16px;
  margin: 200px auto;
  position: relative;
}
.close {
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: url(/static/img/close.png) no-repeat;
  position: absolute;
  right: 10px;
  top: 10px;
}
.close:hover {
  background: url(/static/img/close-active.png) no-repeat;
}
.my-button{
  width: 90px;
  height: 35px;
  margin: 20px auto;
  margin-bottom: 0;
  display: block;
  background-color: #e6873e;
  color: #fff;
  border: none;
  border-radius: 10px;
  outline: none;
}
.buttonWrap{
  margin-top: 50px;
}
.school{
  display: block;
  margin: 0 auto;
  height: 40px;
  line-height: 30px;
  max-width: 100%;
  border: 1px solid #e6873e;
  border-radius: 10px;
  font-size: 20px;
  padding: 0 15px;
  padding-left: 40px;
  margin-bottom: 15px;
  background: #e6873e url(/static/img/school.png) no-repeat 3% 50%;
  background-size: 24px 24px;
  color: #fff;
  cursor: pointer;
  white-space:nowrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow:hidden;
}
.school:hover{
  opacity: .8;
}
</style>