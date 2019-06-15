<template>
  <div class="authView">
    <div class="loginForm">
     <h1 class="title">忘记密码</h1>
     <span class="minTit">FORGET PASSWORD</span>
      <div class="login">
        <div class="inputstyle input_username" v-show="!pwdBoxShow">
            <img :src="urls.username">
            <input type="text" v-model="form.phone" placeholder="请输入登录手机号" mexlength="11"></input>
        </div>
        <div class="inputstyle input_password" v-show="!pwdBoxShow">
            <img class="codeImg" :src="urls.code" alt="">
            <input id="codeInput" v-model="form.code" type="text" placeholder="请输入验证码">
            <a class="getCode" @click="getCode">{{codeText}}</a>
        </div>
        <el-button v-show="!pwdBoxShow" class="btn" type="primary" round @click="pwdBoxHandle">下一步</el-button>
        <div class="inputstyle input_username" v-show="pwdBoxShow">
            <input v-model="pwd.first" class="confirmInput" id="passwordOne"  type="password" placeholder="请输入新的密码" />
        </div>
        <div class="inputstyle input_password" v-show="pwdBoxShow">
           <input class="confirmInput" v-model="pwd.second" id="passwordTwo" type="password" placeholder="请再次输入密码" />
        </div>
        <el-button v-show="pwdBoxShow" class="btn" type="primary" round @click="resetPwdHandle">提交</el-button>
        <a id="forget" v-show="pwdBoxShow" @click="hideBoxHandle">返回</a>
      </div>
      </div>
    <!-- <appHeader is-login></appHeader> -->
  </div>
</template>

<script>
import appHeader from "@/layouts/appHeader";
import authApi from "@/services/auth";
import toggleSchool from "./components/toggleSchool";
export default {
  data() {
    return {
    urls:{
        username: require("../../../static/img/username.png"),
        code:require("../../../static/img/code.png"),
    },
      multiple: false,
      users: [],
      token: "",
      form: {
        phone: "",
        code: ""
      },
      pwd:{
        first:'',
        second:''
      },
      codeText:'获取验证码',
      validCode: true,
      pwdBoxShow:false
    };
  },
  components: {
    appHeader,
    toggleSchool
  },
  methods: {
    //倒计时
	sms (){
        console.log('ab');
        let time = 60;
        if (this.validCode) {
            this.validCode = false;
            var t = setInterval(()=> {
                time--;
               this.codeText= time + "秒后重新获取";
                if (time == 0) {
                    clearInterval(t);
                    this.codeText = "重新获取";
                    this.validCode = true;
                }
            },1000)
        }
    },
    getCode(){
        this.sms();
        let params = {
            phone:this.form.phone
        }
        authApi.getCode(params).then(res => {
        if (res.code == "001")  {
            console.log(res);
        }
      });

    },
    resetPwdHandle() {
        if (this.pwd.first !== this.pwd.second ) {
            this.$message({
                message:'两次密码输入不一致',
                type:'error'
            });
            return false;
        }
        let params = {
            phone:this.form.phone,
            verificode:this.form.code,
            passwd:this.pwd.first
        }
      authApi.upadtePwd(params).then(res => {
        if (res.code == "001") {
            console.log(res);
        }
      });
    },
    doToggle(res) {
      this.multiple = res.multiple;
      this.users = res.data.users;
      this.token = res.data.token;
    },
    pwdBoxHandle() {
        if (!this.form.phone) {
            this.$message({
            message: '请输入手机号码',
            type:'error'
          })
          return false;
      } else if (!this.form.code) {
        this.$message({
            message: '请输入验证码',
            type:'error'
          })
          return false;
      }
      this.pwdBoxShow = true;
    },
    hideBoxHandle(){
        this.pwdBoxShow = false;
    }
  }
};

</script>

<style scoped>
.authView {
  width: 100%;
  height: 100%;
  background-image: url("../../../static/img/login_home_bg.png");
  background-size: cover;
  border: 1px solid #979797;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.5);
}
.loginForm {
  position: absolute;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;

  margin-left: -248px;
  margin-top: -271px;
  left: 50%;
  top: 50%;
  width: 496px;
  height: 542px;
  padding: 35px 35px 15px 35px;
  background: rgba(255, 255, 255, 0.6);
  border: 3px solid #4b93f9;
  border-radius: 25px;
  box-shadow: 0 0 25px #cac6c6;
}
.title {
  font-size: 33px;
  color: #fff;
  letter-spacing: 20px;
  text-align: center;
  line-height: 48px;
}
.minTit {
    display:block;
    opacity: 0.7;
font-family: ArialRoundedMTBold;
font-size: 12px;
color: #FFFFFF;
letter-spacing: 1.6px;
text-align: center;
}
.tit2 {
    margin-top:30px;
    display:block;
    font-family: HYQiHei-EES;
font-size: 13px;
color: #FFFFFF;
letter-spacing: 1.73px;
text-align: center;
}
.center {
  width: 1234px;
  height: 726px;
  /* background-image: url(../images/denglukkk.png); */
  background-size: 100% 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -617px;
  margin-top: -363px;
}
.login {
  width: 336px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -168px;
  margin-top: -100px;
}
.login h2 {
  font-size: 34px;
  color: #fff;
  text-align: center;
  line-height: 42px;
  font-weight: 400;
  margin-bottom: 80px;
}
.prompt {
  color: #f00;
  font-size: 16px;
  line-height: 20px;
  text-indent: 20px;
  margin-top: 10px;
}
.inputstyle {
     width: 100%;
    height: 56px;
    margin: 10px 0;
    border-radius: 50px;
    background: rgba(216,216,216,0.44);
    border: 2px solid #FFFFFF;
    border-radius: 27.5px;
}
.inputstyle img {
  display: block;
  float: left;
  margin-left: 16px;
  margin-right: 12px;
}
.input_username img {
  width: 20px;
  height: 24px;
  margin-top: 16px;
}
.passwordCode {
  width: 19px;
  height: 21px;
  margin-top: 18px;
}
.codeImg {
  width: 28px;
  height: 28px;
  margin-top: 14px;
  margin-right: 5px !important;
}
.inputstyle input {
  display: block;
  float: left;
  width: 80%;
  height: 100%;
  border: none;
  font-size: 16px;
  background: transparent;
  color: #fff;
}
#codeInput {
  width: 50%;
}
.getCode {
  width: 110px;
  height: 56px;
  display: block;
  float: left;
  line-height: 56px;
  text-align: center;
  font-family: HYQiHei-FZS;
  font-size: 13px;
  color: #357BDE;
  letter-spacing: 2.05px;
}
.confirmInput {
  margin-left: 30px;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #1c64c9 inset;
  border: none !important;
  color: #fff !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.btn {
  display: block;
  width: 100%;
  height: 56px;
  color:  #fff;
  font-size: 22px;
  text-align: center;
  margin-top: 20px;
  background: #4B93F9;
  border-radius: 27.5px;
}
#forget {
  display: block;
  float: right;
  font-size: 14px;
  color:#4B93F9 ;
  line-height: 30px;
}
#forget:hover {
  text-decoration: underline;
}

/*é®ç½©*/
.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  display: none;
}
.content {
  width: 300px;
  height: 200px;
  background: #fff;
  border-radius: 10px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -100px;
  z-index: 100;
}
.close {
  display: block;
  width: 14px;
  height: 14px;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
.promptPic {
  display: block;
  width: 110px;
  height: 86px;
  margin: auto;
  margin-top: 40px;
}
.content p {
  font-size: 22px;
  color: #1e0a4b;
  text-align: center;
  line-height: 40px;
  margin-top: 10px;
  font-family: "å¹¼åœ†";
  font-weight: bold;
}
.phone {
  display: none;
}
.shade {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
}
.loading {
  display: block;
  width: 200px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
  z-index: 999;
}
</style>
