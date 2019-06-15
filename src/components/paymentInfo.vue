<template>
  <div class="paymentInfo" :style="selfStyle || {}">
    <p class="paymentInfo_title">支付信息</p>
    <p v-if="!from" class="pay_receivable">
      <span>应收总计</span>
      <span>{{config.receivableAmount | twoFloatFormat}}<span>元</span></span>
    </p>
    <p v-if="!from" class="pay_received">
      <span>汇总实收总计</span>
      <span>{{config.receivedAmount | twoFloatFormat}}<span>元</span></span>
    </p>
    <p v-if="from === 'quit'" class="pay_receivable">
      <span>应退总计</span>
      <span>{{config.receivableAmount | twoFloatFormat}}<span>元</span></span>
    </p>
    <p v-if="from === 'quit'" class="pay_received">
      <span>实退总计</span>
      <span>{{config.receivedAmount | twoFloatFormat}}<span>元</span></span>
    </p>
    <p class="pay_arrears" v-if="config.arrearsAmount > 0">
      <span>欠费</span>
      <span>{{config.arrearsAmount |twoFloatFormat}}<span>元</span></span>
    </p>
    <p class="pay_balance" v-if="config.allBalance > 0">
      <span>余额</span>
      <span>{{config.allBalance | twoFloatFormat}}<span>元</span></span>
    </p>
  </div>
</template>
<script>
import { twoFloatFormat } from '@/utils'
export default {
  props: ['config', 'selfStyle', 'from'],
  data () {
    return {}
  },
  computed: {
    allArrears () {
      let amount = 0
      this.entryData.list.map((v) => {
        let amount1 = 0
        if (v[0].payConfig.amount === '待定') {
          v[0].payConfig.amount = 0
        }
        v[0].payConfig.payList.map((o) => {
          amount1 += o.amount * 1
        })
        amount = isNaN(amount * 1) ? 0 : amount * 1 + v[0].payConfig.amount - amount1
      })
      return amount
    }
  },
  filters: {
    twoFloatFormat
  }
}
</script>
<style lang="less" scoped>
.paymentInfo {
  background: #f9fbfc;
  p {
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
    & > span:last-of-type {
      font-size: 18px;
      font-weight: 500;
      & > span {
        font-size: 12px;
        font-weight: 400;
        color: #7A808D;
        margin-left: 5px;
      }
    }
  }
  .paymentInfo_title {
    font-size: 20px;
    font-weight: 700;
    margin: 0px -15px;
    background: #fff;
  }
  .pay_receivable {
    border-bottom: 1px solid rgba(238,238,238,1);
  }
  .pay_receivable, .pay_received {
    & > span:last-of-type {
      color: #3C75F6;
      & > span {
        color: #7A808D;
        margin-left: 5px;
      }
    }
  }
  .pay_arrears {
    & > span:last-of-type {
      color: #FF6968;
    }
  }
  .pay_balance {
    & > span:last-of-type {
      color: #59C686;
    }
  }
}
</style>
