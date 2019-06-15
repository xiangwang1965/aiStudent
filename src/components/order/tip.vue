<template>
  <div class="tooltip-wrap">
    <el-tooltip :content="content" :disabled="disabled" :size="size">
       <p :style="width" style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;margin-bottom: 12px;word-break:break-all;">
        <slot name="order"></slot>
        <span @mouseover="handleShowInner" class="content-desc-title" style="line-height:20px;">{{content}}</span>
      </p>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      require: true
    },
    size: {
      require: true
    },
    width: {
      require: true
    }
    // type: {
    //   require: true
    // }
  },
  data () {
    return {
      disabled: true
    }
  },
  methods: {
    handleShowInner () {
      // let width = getComputedStyle(target, null).width || target.currentStyle.width

      if (this.content.replace(/[\u0391-\uFFE5]/g, 'aa').length > this.size) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .order-list-item-content-desc {
    font-size: 12px;
    color: #ABB9C6;

    .content-desc-type {
      display: inline-block;
      width: 32px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: #58E0AC;
      border-radius: 4px;
      color: #fff;
      margin-right: 4px;
    }
    .content-desc-title {
      font-size: 13px;
      font-weight: 500;
      color: #3E434C;
      // display: inline-block;
      width: 180px;
      // padding-top: 3px;
      word-break: break-all;
    }
 }
  .not-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

