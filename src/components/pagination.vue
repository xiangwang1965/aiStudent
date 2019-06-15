<template>
  <div>
  <div class="pagination" v-if="config.total !== 0">
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="config.page"
      @current-change="currentPageChange"
      :page-size="config.per_page"
      :total="config.total">
    </el-pagination>
    <span class="pageNum">共{{totalPage}}页</span>
  </div>
  </div>
</template>
<script>
  export default {
    props: ['config'],
    data () {
      return {
      }
    },
    computed: {
      totalPage () {
        let total = this.config.total !== 0 ? this.config.total : 1
        return Math.ceil(total / this.config.per_page)
      },
      total () {
        return this.config.total !== 0 ? this.config.total : 1
      }
    },
    methods: {
      currentPageChange (index) {
        this.config.page = index
        this.$emit('change', index)
      }
    }
  }
</script>
<style lang="less">
.pagination {
  text-align: right;
  .pageNum {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    vertical-align: top;
    margin-top: 22px;
  }
  .el-pagination {
    display: inline-block;
    margin-top: 20px;
    .el-pager {
      li:hover {
        border: none;
      }
      .el-icon-d-arrow-left::before, .el-icon-d-arrow-right::before {
        line-height: 18px !important;
      }
    }
    button,span {
      background-color: transparent !important;
      &:hover {
        border: none;
      }
    }
  }
}
</style>
