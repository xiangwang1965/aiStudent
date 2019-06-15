<template>
  <div class="tooltip-wrap">
    <el-tooltip :content="content" :disabled="disabled">
      <div :style="style" class="not-wrap" :class="customClass">
        <span :style="innerCustomStyle" style="display:inline-block;" @mouseover="handleShowInner($event.currentTarget)">{{content}}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      require: true
    },
    width: {
      require: true
    },
    customClass: {
      type: Object
    },
    innerCustomStyle: {
      require: false
    }
  },
  data () {
    return {
      disabled: true,
      style: {
        width: `${this.width}px`
      }
    }
  },
  methods: {
    handleShowInner (target) {
      let width = getComputedStyle(target, null).width || target.currentStyle.width

      if (parseInt(width) > this.width) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .not-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

