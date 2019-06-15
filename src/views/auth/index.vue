<template>
  <div class="authView">
    <el-form
      class="loginForm"
      ref="form"
      :model="form"
      size="mini"
      @keyup.enter.native="handleLogin"
    >
     <h1 class="title">登录</h1>
     <span class="minTit">LOGIN RIGEST</span>
      <span class="tit2">欢迎您回来</span>
      <div class="login">
        <div class="inputstyle input_username">
            <img :src="urls.username">
            <input type="text" v-model="form.uid" placeholder="账号" mexlength="11"></input>
        </div>
        <div class="inputstyle input_password">
          <img class="passwordCode" :src="urls.pwd">
          <input id="password" type="password" v-model="form.passwd" placeholder=密码>
        </div>
         <el-button class="btn" type="primary" round @click="handleLogin">登录</el-button>
        <a id="forget" @click="goForget">忘记密码?</a>
        <!--<p class="prompt">账号错误</p>-->
        <p class="phone"></p>
      </div>
    </el-form>
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
        pwd:require("../../../static/img/password.png"),
    },
      multiple: false,
      users: [],
      token: "",
      form: {
        uid: "",
        passwd: ""
      }
    };
  },
  components: {
    appHeader,
    toggleSchool
  },
  methods: {
    goForget(){
        this.$router.push('forget');
    },
    handleLogin() {
      authApi.login(this.form).then(res => {
        if (res.code == "001") {
          res.multiple
            ? this.doToggle(res)
            : this.$router.push({ path: "/class" });
        }
      });
    },
    doToggle(res) {
      this.multiple = res.multiple;
      this.users = res.data.users;
      this.token = res.data.token;
    },
    doLogin(data) {
      if (data === true) {
        this.multiple = false;
        return false;
      }
      data.token = this.token;
      authApi.login(data).then(res => {
        if (res.ok) {
          this.$router.push({ path: "/" });
        }
      });
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
  font-size: 14px;
  color: #ccc;
  line-height: 56px;
  text-align: center;
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
