<!-- 创建教师已课程-->
<template>
  <div class='myCourseComponent'>
    <div class="mycourseWrap">
      <div>
        <p class="mycourseWrap__name">{{baseClasses.base_class_name}}</p>
        <span class="mycourseWrap__date">截止时间：{{baseClasses.expired_at}}</span>
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
  props: ['baseClasses'],
  components: {},
  created () {
    this.baseClasses.expired_at = this.baseClasses.expired_at.split(' ')[0]
  },
  methods: {}
}
</script>
<style scoped>
.myCourseComponent {
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin: 6px;
}
.mycourseWrap {
  width: 210px;
  height: 120px;
  min-height: 80px;
  border-radius: 3px;
  border: 1px dashed;
  padding: 15px;
  overflow: over;
}
.mycourseWrap__name {
  font-size: 14px;
  line-height: 18px;
  color: #3E434C;
  white-space:wrap;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  overflow:hidden;
}
.mycourseWrap__date {
  position: absolute;
  bottom: 15px;
  line-height: 30px;
}
</style>