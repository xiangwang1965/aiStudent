<template>
  <div class="payment_type" :style="selfStyle || {}">
    <div class="payInfo">
      <p class="pay_receivable">
        <span>应收<span style="color: #ABB9C6;" v-if="payTitle">（{{payTitle}}）</span></span>
        <span><span v-if="startedData && (startedData.allFee >= 0 || startedData.allFee === '待定') && startedData.startedLesssons > 0" style="color: #FF6968;">{{startedData.allFee | twoFloatFormat}}{{startedData.allFee === '待定' ? '' : '元/人/期'}}</span><span v-if="startedData && startedData.startedLesssons > 0" style="margin-left: 10px;color: #FF6968;">已开课{{startedData.startedLesssons}}讲</span><span class="pay_receivable_fee">{{config.amount | twoFloatFormat}}<span v-if="config.amount !== '待定'">元</span></span></span>
      </p>
      <p class="pay_received">
        <span>实收</span>
        <span v-if="allReceivedFee === '无需支付'">{{allReceivedFee}}</span>
        <span v-else>{{allReceivedFee | twoFloatFormat}}<span v-if="allReceivedFee !== '无需支付'">元</span></span>
      </p>
      <ul v-if="allReceivedFee!== '无需支付' && config.amount > 0">
        <li v-for="(pay, i) in config.payList">
          <span class="payment_paytype">
            <span>{{pay.name}}{{pay.id}}</span>
          </span>
          <span class="payment_input">
            <InputNumber v-model="pay.amount" :max="config.amount" :min="0" :isFloat="true" :alignRight="true" :width="'200px'" :height="'38px'" @change="inputChange"></InputNumber><span>元</span>
          </span>
        </li>
      </ul>
      <p v-if="showWarning" class="warning_text">支付金额不可为空</p>
    </div>
  </div>
</template>
<script>
  import InputNumber from '@/components/inputNumber'
  import { twoFloatFormat } from '@/utils'
  export default {
    props: ['config', 'showWarning', 'startedData', 'selfStyle', 'transferAmount', 'payTitle'],
    data () {
      return {
        payTypeList: [
          {
            type: '5',
            name: '自动支付'
          }, {
            type: '4',
            name: '现金'
          }, {
            type: '3',
            name: '微信'
          }, {
            type: '2',
            name: '支付宝'
          }, {
            type: '1',
            name: '银联'
          }
        ],
        surplusMoneyList: [],
        allReceivedFee: 0
      }
    },
    components: {
      InputNumber
    },
    filters: {
      twoFloatFormat: twoFloatFormat
    },
    watch: {
      config: function (val, oldval) {
        this.getAllReceivedFee()
      }
    },
    computed: {
      selectPayIds () {
        let str = ''
        this.config.payList.map((o) => {
          str += o.type + '|'
        })
        return str
      },
      allArrears () {
        let amount = 0
        this.config.payList.map((v) => {
          amount += v.amount * 1
        })
        return (this.config.amount * 100 - amount * 100) / 100
      }
    },
    created () {
      this.getAllReceivedFee()
      this.config.payList.map((v) => {
        this.surplusMoneyList.push({surplusMoney: this.config.amount})
      })
    },
    methods: {
      inputChange (val) {
        this.getAllReceivedFee()
        // this.getSurplusMoney(this.config.payList)
        // this.$set()
        this.config.payList.map((v, index) => {
          if (v.amount === val) {
            this.$set(this.config.payList[index], 'amount', val)
            this.$forceUpdate()
          }
        })
      },
      getAllReceivedFee () {
      /*  else if (this.transferAmount && this.config.amount - this.transferAmount <= 0) {
          this.allReceivedFee = '无需支付'
        } */
        if (isNaN(this.config.amount)) {
          this.config.amount = 0
        }
        if (this.config.amount === '待定' || this.config.amount <= 0) {
          this.allReceivedFee = '无需支付'
        } else {
          let amount = 0
          this.config.payList.map((v) => {
            amount += v.amount * 1
          })
          this.allReceivedFee = amount
        }
        this.$emit('change', this.allReceivedFee)
      },
      getSurplusMoney (arr) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i + 1]) {
            if (arr[i - 1]) {
              this.surplusMoneyList[i].surplusMoney = this.config.amount - arr[i - 1].amount - arr[i + 1].amount
            } else {
              this.surplusMoneyList[i].surplusMoney = this.config.amount - arr[i + 1].amount - arr[i + 2].amount
            }
          } else {
            this.surplusMoneyList[i].surplusMoney = this.config.amount - arr[i - 1].amount - arr[i - 2].amount
          }
        }
      },
      moneyInput (index, val) {
        this.config.payList[index].amount = val * 1
        this.$set(this.config.payList[index], 'amount', val * 1)
        this.$emit('setMoney', (index, val))
      },
      addPayment () {
        let canPush = true
        let enptyType = ''
        if (this.config.payList.length >= this.payTypeList.length) {
          this.$message({
            type: 'warning',
            message: '暂不支持其他支付方式'
          })
          return
        }
        let nowMoney = 0
        this.config.payList.map((v) => {
          nowMoney += v.amount * 1
        })
        if (nowMoney >= this.config.amount) {
          this.$message({
            type: 'warning',
            message: '已达应收金额，无需支付更多'
          })
          return
        }
        this.config.payList.map((v) => {
          if (!v.amount || !v.type) {
            canPush = false
            enptyType = !v.type ? 'type' : 'amount'
          }
        })
        if (canPush) {
          this.config.payList.push({
            type: '',
            amount: ''
          })
        } else {
          this.$message({
            type: 'warning',
            message: (enptyType === 'amount' ? '收款金额' : '收款方式') + '不能为空'
          })
        }
      },
      deletePayment (index) {
        this.$msgbox({
          title: '提示',
          message: '此操作将永久删除该文件, 是否继续?',
          confirmButtonText: '确定',
          confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
          cancelButtonText: '取 消',
          cancelButtonClass: 'cac-button-two dialog_cancel_button is-round',
          showCancelButton: true
        }).then(() => {
          this.config.payList.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
.payment_type {
  width: 100%;
  background: #f9fbfc;
  p {
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
  }
  .pay_receivable {
    border-bottom: 1px solid rgba(238,238,238,1);
  }
  .pay_arrears {
    border-top: 1px solid rgba(238,238,238,1);
  }
  .pay_receivable, .pay_received {
    & > span:last-of-type, .pay_receivable_fee {
      font-size: 18px;
      font-weight: 500;
      & > span {
        font-size: 12px;
        font-weight: 400;
        color: #7A808D;
        margin-left: 5px;
      }
    }
    .pay_receivable_fee {
      font-weight: 500 !important;
      color: #3E434C !important;
      font-size: 18px !important;
    }
  }
  ul {
    li {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      margin: 0;
      .payment_paytype {
        display: inline-block;
        text-align: center;
        border-radius: 3px;
        i {
          margin-right: 10px;
        }
      }
      .payment_input {
        & > span {
          margin-left: 5px;
          font-size: 12px;
          font-weight: 400;
          color: #7A808D;
        }
      }
      .el-select {
        width: 200px;
        height: 50px;
        line-height: 50px;
        .el-input, input {
          width: 100%;
          height: 50px;
          line-height: 50px;
        }
      }
      .el-input {
        width: 150px;
        margin-right: 3px;
      }
      .el-icon-circle-plus {
        &::before {
          color: yellowgreen;
        }
      }
      .el-icon-circle-close {
        &::before {
          color: #ccc;
        }
      }
      .inputNumber {
        input {
          text-align: right;
        }
      }
    }
  }
  .warning_text {
    display: block;
    text-align: right;
    height: 20px;
    line-height: 20px;
    color: #FF6968;
  }
}
</style>
