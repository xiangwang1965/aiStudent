<!-- 图片详情 -->
<template>
  <div id='largeImgComponents'>
    <div class="img__wrap">
      <img :src="enlargeImgUrl">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['enlargeImgUrl'],
  components: {},
  created () { },
  methods: {}
}
</script>
<style scoped>
.img__wrap{
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  text-align: center;
  margin: 0 auto;
}
.img__wrap img{
  width: 100%;
  height: 100%;
}
</style>