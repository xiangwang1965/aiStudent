<template>
  <el-dialog
    class="payDetailDialog"
    title="费用明细"
    width="800px"
    :visible.sync="config.visible"
    @close="dialogClose"
    append-to-body>
    <el-table :data="config.list" height="444px">
      <el-table-column align="left" label="类型" prop="use_name"></el-table-column>
      <el-table-column align="center" label="方式" prop="type_name"></el-table-column>
      <el-table-column align="center" label="费用" width="200">
        <template slot-scope="scope">
          <div class="fee_info">
            <p><span class="fee_title">学费:</span><span><span v-if="scope.pay_price >= 0">+</span>{{scope.row.pay_price}}</span></p>
            <p><span class="fee_title">书本费:</span><span><span v-if="scope.pay_option_price >= 0">+</span>{{scope.row.pay_option_price}}</span></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间" prop="pay_time"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
  export default {
    props: ['config'],
    data () {
      return {
      }
    },
    methods: {
      dialogClose () {
        this.config.list = []
      }
    }
  }
</script>
<style lang="less">
  .payDetailDialog {
    text-align: left;
    .el-dialog__title {
      font-size: 24px;
    }
    .el-dialog__body {
      padding-top: 20px;
      .el-table {
        td {
          height: 50px;
        }
        .el-table__body-wrapper {
          overflow-y: scroll;
          .fee_info {
            width: 200px;
            p {
              &>span {
                width: 100px;
                &:last-of-type {
                  text-align: left;
                  margin-left: 5px;
                }
              }
            }
            span {
              display: inline-block;
            }
            .fee_title {
              display: inline-block;
              width: 80px;
              text-align: right;
            }
          }
        }
      }
    }
  }
</style>
