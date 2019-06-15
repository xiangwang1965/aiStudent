<template>
<div id="payView">
      <div class="succeed">
            <el-image class="succeedPic" :src="urls.suc" alt=""/>>
            <div class="succeedR">
                <h2>支付成功！</h2>
                <p>订单编号：<span>454055012543545</span></p>
                <p>支付方式：<span>微信支付</span></p>
                <p>支付时间：<span>2018-10-26</span></p>
                <p id="money">支付金额：<span>￥3999</span></p>
            </div>
        </div>
        <div class="code">
            <div class="codeimg">
                <p>激活码：<span id="biao">5348540540534035</span><a onClick="copyUrl()" href="javascript:;">复制</a></p>
            </div>
        </div>
</div>
</template>
<script>
import teacher from "@/services/teacher";
export default {
  data() {
    return {
      list: [],
      urls:{
          suc: require("../../../static/img/chenggong.png"),
          card:require("../../../static/img/jihuoma.png")
      },
      tInfo: {},
      teachId: "",
      dateOption: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      params: {
        searchTxt: ""
      }
    };
  },
  created() {
   // this.getData();
    //this.queryTeacherInfo();
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === "/student") {
      to.meta.keepAlive = false;
      this.$destroy();
    } else {
      to.meta.keepAlive = true;
      this.$destroy();
    }
    next();
  },
  methods: {
    getData() {
      teacher.querylist(this.params).then(res => {
        if (res.code === "001") {
          this.list = res.data;
        }
      });
    },
    queryTeacherInfo(id) {
        var p = {

        };
        p.teacherId = id || '1';
      teacher.queryTeacherInfo(p)
        .then(res => {
          if (res.code === "001") {
            this.tInfo = res.data;
          }
        });
    },
    getGradeList() {
      let params = {
        school_id: this.schoolId
      };
      courseApi.getGradeList(params).then(res => {
        this.optionGrade = res;
      });
    },
    getStudent() {
      let params = {
        student_id: this.student_id
      };
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.params = res.data;
          this.params.telephone = Number(this.params.telephone);
          // 家长电话只为数字类型
          this.params.parent_telephone =
            this.params.parent_telephone === ""
              ? ""
              : Number(this.params.parent_telephone);
          // gender后台返回0时显示未知
          !this.params.gender && (this.params.gender = 3);
        }
      });
    },
    handleAllDate(val) {},
    handleAddClass() {
      this.$dialog.open("classTypeChoose");
    },
    handleDelete(index, row) {
      this.$confirm("是否确定删除该学生?", "提示", {
        confirmButtonText: "确 定",
        confirmButtonClass: "cac-button-one dialog_confirm_button is-round",
        cancelButtonText: "取 消",
        cancelButtonClass: "cac-button-two dialog_cancel_button is-round"
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
            center: true
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true
          });
        });
    },

  }
};
</script>
<style lang="less" scoped>
    #payView{
    margin: 0;padding: 0;
    width: 100%;
    height: 100%;
    background: #edf2fc;
}
.succeed{
  width: 1100px;
  height: 278px;
  background: #fff;
  border-radius: 10px;
  margin: auto;
  margin-top: 10px;
}
.succeedPic{
  display: block;
  width: 119px;
  height: 109px;
  float: left;
  margin: 85px 50px 0 360px;
}
.succeedR{
  font-size: 16px;
  color: #2a2a2a;
  line-height: 30px;
}
.succeedR h2{
  font-size: 20px;
  padding-top: 50px;
  padding-bottom: 10px;
}
#money span{
  color: #ff7e4d;
}
.code{
  width: 1100px;
  padding: 34px 0;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
}
.codeimg{
  width: 400px;
  height: 230px;
background-image:url('../../../static/img/jihuoma.png');
  background-size: 100% 100%;
  margin: auto;
}
.codeimg p{
  width: calc(100% - 40px);
  padding: 20px;
  font-size: 16px;
  color: #fff;
}
.codeimg a{
  display: block;
  float: right;
  font-size: 14px;
  width: 48px;
  height: 22px;
  color: #4592fe;
  background: #fff;
  text-align: center;
  line-height: 22px;
  border-radius: 10px;
}
</style>