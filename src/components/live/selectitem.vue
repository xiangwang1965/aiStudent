<!-- 双师筛选的条件 -->
<template>
  <div id='selectComponent' class="selectComponent">
    <h6 class="selectItem__title">{{selectData.title}}</h6>
    <ul class="selectItem__content">
      <li class="selectItem__item" v-for="(item,index) in selectData.option" :key="index" :class="{selectItem__item__active:index===activeitem}" @click="doSelect(item,index,selectData.name)">{{item.value}}</li>
      <div class="clearfix"></div>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeitem: 0,
      selectData: {}
    }
  },
  props: ['selectItem', 'params'],
  watch: {
    selectItem: {
      handler (val, oldval) {
        this.selectData = Object.assign({}, this.selectItem)
      },
      deep: true
    }
  },
  created () {
    this.selectData = Object.assign({}, this.selectItem)
  },
  methods: {
    doSelect (data, index, name) {
      this.activeitem = index
      switch (name) {
        case 'subject':
          this.params.subject_id = data.key
          break
        case 'grade':
          this.params.grade_id = data.key
          break
        case 'term':
          this.params.term_id = data.key
          break
        case 'level':
          this.params.level = data.key
          break
        case 'status':
          this.params.status = data.key
          break
      }
      this.$emit('params', this.params)
    }
  }
}
</script>
<style scoped>
.selectComponent {
  display: flex;
  justify-content:flex-start;
  margin-bottom: 16px;
}
.selectItem__title{
  width :60px;
  display : flex;
  height: 30px;
  line-height: 30px;
  flex-shrink: 0;
  justify-content: flex-end;
  margin-right: 60px;
}
.selectItem__content{
  display : flex;
  flex-wrap:wrap;
  text-align: center;
}
.selectItem__item {
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 13px;
  padding: 0 12px;
  margin-right: 35px;
}
.selectItem__item:hover {
  color: rgb(47, 160, 255);
  background-color: #fff;
}
.selectItem__item__active {
  background-color: rgba(60,117,246,0.1);
  color: #3C75F6 !important;
}
</style>
