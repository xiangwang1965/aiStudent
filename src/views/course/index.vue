<template>
  <div class="classContainer">
    <div class="left">
      <h1 class="title">课程订单</h1>
      <div class="sideContainer">
        <div class="item">
          <div class="tabs">
            <div>
              <span :class="{active:activeTab == item.id}" :key="t" v-for="(item,t) in tabList" @click="tabHandle(item.id)">{{item.name}}</span>
            </div>
          </div>
          <div class="classList">
              <div class="order" :key="i" v-for = "(item,i) in list">
                <div class="num">
                  <p id="orderNum">
                    订单编号：
                    <span>{{item.orderNo}}</span>
                  </p>
                  <p id="state" v-if="item.status == '0'">进行中</p>
                    <p id="state" v-else-if="item.status == '2'">作废</p>
                      <p id="state" v-else>已完成</p>
                </div>
                <div class="content clearfix">
                  <img id="contentPic" :src="url" alt>
                  <div class="contentL">
                    <p id="class">{{item.orderName}}</p>
                    <p id="hour">{{item.schoolName}}</p>
                    <p style="text-align:right">
                        <span>
                        合计：
                        <i>￥{{item.totlaPic}}</i>
                      </span></p>
                       <p style="text-align:right" id="time">交易时间：{{item.tradeTime}}</p>
                  </div>
                </div>
                <div class="stateBtn">
                  <p id="btn">继续支付</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="center"></div>
    <div class="right">
      <h3>订单详情</h3>
    </div>
  </div>
</template>
<script>
import courseApi from "@/services/course";
export default {
  data() {
    return {
    tabList:[
          {
              id:'1',
              name:'全部订单'
          },
          {
              id:'2',
              name:'进行订单'
          },
          {
              id:'3',
              name:'历史订单'
          }
      ],
      activeTab:'1',
      list:[],
      url: require("../../../static/img/minipic.png")
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(index) {
        let params ={
            typeid : index || '1'
        }
      courseApi.queryOrders(params).then(res => {
          if (res.code === '001') {
              this.list = res.data;
          }
      });
    },
    tabHandle(index) {
        this.activeTab = index;
        this.getData(index);
    }
  }
};
</script>
<style lang="less" scoped>
.classContainer {
  .left {
    width: 513px;
    position: relative;
    height: 100%;
    .title {
      position: absolute;
      left: 18px;
    }
    .round {
      width: 10px;
      height: 10px;
      border: 2px solid #4592fe;
      border-radius: 50%;
      position: absolute;
      top: 43px;
    }
    .p {
      position: absolute;
      left: 26px;
      top: 40px;
      font-family: "HYQiHei-EES";
      font-size: 15px;
      color: #4592fe;
      letter-spacing: 1.5px;
    }
    .btn {
      background: #4592fe;
      border-radius: 5px;
      font-family: "HYQiHei-EES";
      font-size: 15px;
      color: #ffffff;
      letter-spacing: 1.5px;
      width: 70px;
      height: 23px;
      line-height: 23px;
      position: absolute;
      left: 307px;
      top: 40px;
      padding: 0 2px;
    }
    .sideContainer {
      position: absolute;
      width: 500px;
      left: 0px;
      .item {
        .tabs {
          width: 500px;
          height: 80px;
          position: absolute;
          left: 0px;
          top: 0px;
          border-bottom: 3px solid #4592fe;
          div {
            position: absolute;
            left: 0px;
            top: 42px;
            span {
              display: inline-block;
              background: #aacdff;
              border-radius: 6px 6px 0px 0px;
              font-family: "HYQiHei-GZS";
              font-size: 14px;
              color: #ffffff;
              width: 80px;
              height: 35px;
              letter-spacing: 0;
              text-align: center;
              line-height: 35px;
              &.active {
                background: #4592fe;
              }
            }
          }
        }
        .classList {
            top:100px;
            position:relative;
            height:100%;
          .order {
            width: 100%;
            background: #fff;
            margin-top: 10px;
            border-radius: 10px;
            padding-bottom: 20px;
            height:130px;
          }
          .num {
            width: 100%;
            height: 24px;
            border-bottom: 1px solid #efefef;
            font-family: HYQiHei-EZS;
            font-size: 12px;
            color: #9B9B9B ;
            letter-spacing: 0;
            line-height: 24px;
          }
          #orderNum {
            float: left;
            text-indent: 28px;
          }
          #state {
            float: right;
            margin-right: 28px;
          }
          #contentPic {
            display: block;
            width: 74px;
            height: 74px;
            float: left;
            margin: 22px 28px;
          }
          .contentL {
            width: calc(100% - 150px);
            float: left;
             font-family: HYQiHei-EZS;
            font-size: 12px;
            color: #9B9B9B ;
            letter-spacing: 0;
            line-height: 24px;
            padding-top: 10px;
            text-align:left;
          }
          #class {
            width: 100%;
            color: #404040;
          }
          #class span > i {
            color: #ff5e20;
            font-style: normal;
            float: right;
          }
          .stateBtn {
            width: 100%;
            height: 30px;
            position: absolute;
            bottom:10px;
          }
          .stateBtn p {
                float: right;
                width: 75px;
                height: 30px;
                border: 1px solid #ff5e20;
                color: #ff5e20;
                text-align: center;
                line-height: 30px;
                font-size: 12px;
                border-radius: 12px;
                margin-right: 10px;
                cursor: pointer;
          }
        }
      }
    }
  }
  .center {
    width: 1px;
    height: 90%;
    background: #b6b6b6;
    position: absolute;
    left: 52%;
  }
  .right {
    position: relative;
    left: 50%;
    top: 0;
    .h3 {
      font-family: HYQiHei-GZS;
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: center;
      position: absolute;
      top: 10px;
      left: 0px;
    }
  }
}
</style>
