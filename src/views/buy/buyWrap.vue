<!-- 班级容器 -->
<template>
  <div id='buyWrapPage'>
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
<style scoped>
    #buyWrapPage {
        display:flex;
        flex:1;
        width:100%;
        height:100%;
    }
</style>