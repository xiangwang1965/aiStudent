<!-- 双师课程简介 -->
<template>
  <div class="mediaComponent">
    <div class="top">
      <div class="imgWrap">
        <span class="imgWrapInner">
          <img :src="mediaInfo.cover_image" class="mediaInfo__img">
          <span class="mediaInfo__info__title__right" :class="{'mediaInfo__info__title__right__orange':mediaInfo.status_id===1,'mediaInfo__info__title__right__green':mediaInfo.status_id===2,'mediaInfo__info__title__right__gray':mediaInfo.status_id===3||mediaInfo.status_id===4}">
            {{mediaInfo.status}}</span>
        </span>
      </div>
      <div class="mediaInfo__info">
        <div class="mediaInfo__info__title">
          <h5 class="mediaInfo__info__title__left">{{mediaInfo.name}}</h5>
        </div>
        <ul class="mediaInfo__info__detail">
          <li>
            <p>主讲老师</p>
            <span>{{mediaInfo.teacher_name}}</span>
          </li>
          <li>
            <p>上课日期</p>
            <span>{{mediaInfo.classDate}}</span>
          </li>
          <li>
            <p>总讲次数</p>
            <span>{{mediaInfo.lesson_count}}</span>
          </li>
          <li>
            <p>课程总数</p>
            <span>{{mediaInfo.total_amount}}</span>
          </li>
          <li>
            <p>剩余课程数</p>
            <span>{{mediaInfo.available_amount}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="from === 'prepareLesson'" class="bottom">
      <el-button class="mediaInfo__info__button cac-button-three" size="small" round type="primary" @click="checkDetail(mediaInfo)">查看详情</el-button>
      <el-button class="mediaInfo__info__button cac-button-one" size="small" round type="primary" @click="prepareLesson(mediaInfo)" :disabled="mediaInfo.status_id===4 || mediaInfo.status_id===3 || mediaInfo.available_amount===0">排课</el-button>
    </div>
    <div v-else class="bottom">
      <el-button class="mediaInfo__info__button cac-button-three" size="small" round type="primary" @click="checkDetail(mediaInfo)">查看详情</el-button>
      <el-button class="mediaInfo__info__button cac-button-one" size="small" round type="primary" @click="createClass(mediaInfo)" :disabled="mediaInfo.status_id===4 || mediaInfo.status_id===3 || mediaInfo.available_amount===0">创建班级</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mediatitle: ['']
    }
  },
  props: {
    mediaInfo: Object,
    from: String
  },
  methods: {
    checkDetail (mediaInfo) {
      let detailPath = ''
      if (this.from === 'prepareLesson') {
        detailPath = 'prepareLessonDetail'
      } else {
        detailPath = 'livedetail'
      }
      this.$router.push({ name: detailPath, query: { code: mediaInfo.code } })
    },
    createClass (mediaInfo) {
      this.$router.push({ name: 'liveClassedit', query: { 'create': 'create', 'code': mediaInfo.code, 'detail_code': mediaInfo.detail_code, 'id': mediaInfo.id } })
    },
    prepareLesson (mediaInfo) {
      this.$router.push({ name: 'scheduleLesson', query: { 'create': 'create', 'code': mediaInfo.code, 'detail_code': mediaInfo.detail_code, 'id': mediaInfo.live_class_id } })
    }
  }
}
</script>
<style lang="less">
.mediaComponent {
  background-color: #fff;
  margin-bottom: 40px;
  overflow: hidden;
  padding-right: 20px;
  text-align: center;
  .imgWrap {
    display: inline-block;
    vertical-align: top;
    .imgWrapInner {
      position: relative;
      display: inline-block;
    }
  }
  .mediaInfo__img {
    width: 164px;
    height: 164px;
    overflow: hidden;
    text-align: center;
  }
  .mediaInfo__info {
    display: inline-block;
    width: 330px;
    text-align: left;
    padding-left: 30px;
    flex: 1;
  }
  .mediaInfo__info__title {
    display: flex;
  }
  .mediaInfo__info__title__left {
    font-size: 16px;
    font-weight: 700;
    flex: 2;
  }

  .mediaInfo__info__title__right {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 54px;
    height: 22px;
    line-height: 22px;
    background-color: #7a808d;
    color: #fff;
    border-radius: 0px 0px 12px 0px;
  }
  .mediaInfo__info__title__right__orange {
    background: rgba(255,118,65,.8);
  }
  .mediaInfo__info__title__right__green {
    background: rgba(64,217,128,.8);
  }
  .mediaInfo__info__title__right__gray {
    background:rgba(122,128,141,.8);
  }
  .mediaInfo__info__detail > li > p {
    display: inline-block;
    width: 60px;
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
    font-size: 12px;
    font-weight: 500px;
    color: #888d9d;
  }
  .bottom {
    max-width: 440px;
    display: flex;
    .el-button.is-disabled, .el-button.is-disabled:hover {
      color: white !important;
      background-color: #A0CFFF !important;
    }
  }
  .mediaInfo__info__button {
    max-width: 100px;
    flex: 1;
    line-height: 5px;
    margin-top: 10px;
    margin-right: 20px;
    font-size: 13px;
  }
}
</style>
