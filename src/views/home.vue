<!-- 应用首页 -->
<template>
  <div class="wrap">
    <appHeader></appHeader>
    <el-container class="content">
        <appSidebar class="appSidebarWrap"></appSidebar>
        <el-main class="content_right">
            <router-view></router-view>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import appHeader from '@/layouts/appHeader'
import appSidebar from '@/layouts/appSidebar'
import appFooter from '@/layouts/appFooter'
export default {
  data () {
    return {
    }
  },
  components: {
    appHeader,
    appSidebar,
    appFooter
  }
}
</script>

<style lang="less" scoped>
.wrap {
   width: 100%;
    height: 100%;
    min-height: 10.8rem;
    background: url('../../static/image/wrapBackground.png');
    background-size:cover;
    position:absolute;
     .content {
        width: 15.96rem;
        height: 7.90rem;
        margin: 0 auto;
        background: #F3F6FC;
        border-radius: 0.20rem;
    }
    .content_right{
        flex: 1;
        display: flex;
    }
}
</style>
