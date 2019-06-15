<!-- 班级容器 -->
<template>
  <div id='classWrapPage'>
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
 #classWrapPage {
     width:100%;
 }
</style>