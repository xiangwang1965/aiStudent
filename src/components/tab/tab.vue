<template>
  <div class="tab">
    <ul class="tab-header">
      <li v-for="item in tabHeader" :key="item.id" @click="handleTab(item.id)" :class="item.id === tabIndex ? 'tab-header-active' : 'tab-header-default'">
        {{item.label}}
        <span :class="item.id === tabIndex ? 'tab-header-line-active' : 'tab-header-line-default'" class="tab-header-line"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'tab',
  props: {
    tabHeader: {
      type: Array,
      required: true
    },
    tabIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleTab (id) {
      this.$emit('handleTabChange', id)
    }
  }
}
</script>

<style lang="less" scoped>
.tab {
  .tab-header {
    display: flex;

    li {
      margin-right: 50px;
      font-size: 18px;
      height: 25px;
      line-height: 25px;
      cursor: pointer;
      position: relative;

      .tab-header-line {
        position: absolute;
        display: inline-block;
        width: 16px;
        height: 4px;
        background:#3C75F6;
        border-radius: 2px;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
      }
      .tab-header-line-active {
        display: block;
      }
      .tab-header-line-default {
        display: none;
      }
    }
    .tab-header-active {
      color: #3E434C;
    }
    .tab-header-default {
      color: #7A808D;
    }
  }
}
</style>
