<template>
  <div class="classContainer">
     <div class="content1" style="width: 7.44rem">
        <p class="content_title">购买激活码</p>
        <div class="left_content " style="overflow: auto">
            <div class="toggle_wrap" :key="i" v-for="(item,i) in tabs">
                <div class="toggle_title" :class="item.colorCls" @click="switchTab(item.id)">
                    <span>{{item.name}}</span>
                    <i :class="item.IconCls"></i>
                </div>
                <div class="toggle_box" v-show="activeIndex === item.id">
                    <div class="item" :key="k" v-for="(course,k) in dataList">
                        <div class="img">
                             <el-image :src="url"></el-image>
                        </div>
                        <div class="btn_148 bg_y" @click="dataHandle(course)">添加</div>
                    </div>
                    <div class="item">
                        <div class="img"></div>
                        <ul class="count" style="margin:0 auto">
                            <span id="num-jian" class="num-jian">-</span>
                            <input type="text" class="input-num" id="input-num" value="0" />
                            <span id="num-jia" class="num-jia">+</span>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="content2">
        <div class="content_title">
            购买激活码清单
        </div>
        <div class="right_content " style="height: 6.67rem">
            <div class="right_content_T">
                 <el-checkbox-group v-model="switchNames" @change="changSelectChange">
                    <div class="buy_line"  :key="d" v-for="(c,d) in switchData">
                        <div class="buy_line_l">
                            <el-checkbox :label="c.name" ></el-checkbox>
                        </div>
                        <div class="buy_line_r">
                            <el-input-number size="mini" v-model="c.num"></el-input-number>
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
            <div class="right_content_B">
                    <div class="buy_line">
                    <div class="buy_line_l">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"    @change="handleCheckAllChange">全选</el-checkbox>
                    </div>
                    <div class="buy_line_r">
                        <span>合计：<b>￥{{totalPrice}}</b></span>
                        <div class="btn_108" @click="payHandle">结算</div>
                    </div>
                    </div>
            </div>
        </div>
    </div>
  </div>

</template>
<script>
import buyApi from "@/services/buy";

export default {
  data() {
    return {
        num4:1,
        switchNames:[],
        checkAll: false,
        isIndeterminate: true,
        allPrice:0,
      tabs: [
        {
          id: 1,
          name: "SCRATCH编程",
          colorCls: "bg_y",
          IconCls: "el-icon-arrow-down"
        },
        {
          id: 2,
          name: "PYTHON编程",
          colorCls: "bg_b",
          IconCls: "el-icon-arrow-right"
        },
        {
          id: 3,
          name: "NOIP",
          colorCls: "bg_r",
          IconCls: "el-icon-arrow-right"
        },
        {
          id: 4,
          name: "NOIP",
          colorCls: "bg_p",
          IconCls: "el-icon-arrow-right"
        }
      ],
      activeIndex: 1,
      dataList: {},
      switchData: [],
      totalPrice: 0,
      url:require( "../../../static/img/content_default.png")
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
       handleChange(value) {
        console.log(value);
      },
    switchTab(index) {
      if (index === this.activeIndex) {
        this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-right";
        this.activeIndex = "";
      } else {
        if (this.activeIndex !== "") {
          this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-right";
          this.getData(index);
        }
        this.activeIndex = index;
        this.tabs[this.activeIndex - 1].IconCls = "el-icon-arrow-down";
      }
    },
    dataHandle(val) {
      let tmp = Object.assign({},val);
      tmp.checked = false;
      tmp.num = 1;
      if (this.switchData.length > 0) {
        if (
          this.switchData.every(item => {
            return item.id != tmp.id;
          })
        ) {
          this.switchData.push(tmp);
        } else {
          this.switchData.forEach((item, index) => {
            if (tmp.id == item.id) {
              this.switchData[index].num += 1;
            }
          });
        }
      } else {
        this.switchData.push(tmp);
      }

      console.log(this.switchData);
    },
    getData(typeid) {
      let params = {
        typeId: typeid || 1
      };
      buyApi.queryCourses(params).then(res => {
        if (res.code === "001") {
          this.dataList = res.data;
        }
      });
    },
     handleCheckAllChange(val) {
        this.switchNames = val ? this.switchData.map(item=>item.name) : [];
        this.isIndeterminate = false;
        if (val) {
            this.switchData.forEach(item=>{
                this.totalPrice += (+item.price)*item.num;
            })
            console.log(this.totalPrice);
            this.totalPrice = this.totalPrice.toFixed(2);
        } else {
             this.totalPrice = 0;
        }
      },
      changSelectChange(value) {
        console.log(value);
        this.totalPrice = 0;
        this.switchData.forEach(item=>{
            if (value.indexOf(item.name) > -1) {
                this.totalPrice += (+item.price)*item.num;
            }
        })
        this.totalPrice = this.totalPrice.toFixed(2);
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.switchData.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.switchData.length;
      },
      payHandle(){
          let result = [];
        this.switchData.forEach(item=>{
        if (this.switchNames.indexOf(item.name) > -1) {
            result.push({
                courseId:item.id,
                num:item.num
            });
        }
    })
        buyApi.queryAddOrder({data:JSON.stringify(result)}).then(res => {
            if (res.code === '001') {
                this.$router.push({
                    name:'payorder',
                    query:{
                        out_trade_no:res.data.out_trade_no,
                        totalPric:res.data.totalPric
                    }
                });
            }
        });
      }
  }
};

function fn(ar) {
  let json = {};
  let arr = [];
  ar.forEach(item => {
    if (!json[item.name]) {
      json[item.name] = true;
      arr.push(item);
    }
  });
  return arr;
}
</script>
<style lang="less" scoped>
.classContainer {
    display:flex;
    flex:1;
    .count {
    display: flex;
    justify-content: center;
    border: 0.01rem solid #979797;
    border-radius: 0.04rem;
    height: 0.22rem;
    width: 0.96rem;
}

.count .num-jian,
.num-jia {
    display: inline-block;
    width: 0.24rem;
    height: 0.22rem;
    line-height: 0.22rem;
    text-align: center;
    font-size: 0.14rem;
    color: #979797 ;
    cursor: pointer;

}
.count .num-jian{
    border-right: 0.01rem solid #979797;
}
.count .num-jia{
    border-left: 0.01rem solid #979797;
}
.count .input-num {
    width: 0.45rem;
    height: 0.21rem;
    color: #979797;
    border:none;
    text-align: center;
}
.toggle_title{
    width: 6.82rem;
    height: 0.61rem;
    border-radius: 0.06rem 0.06rem 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:0.3rem;
    span{
        padding-left:0.2rem;
        font-size: 0.17rem;
        color: #ffffff;
    }
    i{
        padding-right: 0.2rem;
        display: block;
        width: 0.26rem;
        height: 0.12rem;
        color:#fff;
    }
}
.toggle_title_show{
    img{
        transform: rotateZ(-90deg);
        padding-right: 0rem;
        padding-bottom: 0.2rem;
    }

}

.toggle_box{
    display: flex;
    justify-content: space-between;
    .item{
        width: 1.48rem;
        margin-bottom: 0.3rem;
        .img{
            width: 1.48rem;
            height: 1.48rem;
            background: #D8D8D8;
            margin-bottom: 0.07rem;
        }
    }
}
.right_content_T{
    height: 5.70rem;
    overflow: auto;
}
.buy_line{
    width:4.2rem;
    background: #fff;
    height: 0.85rem;
    border-radius: 0.07rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:0.15rem;
    .buy_line_l{
        font-size: 0.16rem;
        color: #4A4A4A;
        .el-checkbox{
            margin:0 0.11rem 0 0.22rem;
        }
    }
    .buy_line_r{
        margin-right: 0.19rem;
    }
}
.right_content_B{
    .buy_line{
        .buy_line_r{
            .btn_108{
                margin:0 0 0 0.32rem;
                display: inline-block;
            }
        }
    }
}
}
</style>
