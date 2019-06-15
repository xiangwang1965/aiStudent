<template>
      <div class="wrap">
        <appHeader></appHeader>
        <div class="content">
            <div class="content_left">
                <div class="top">
                    <img :src="images.back" alt="" class="back" @click="goBack">
                    <span class="tit">小智AI助教</span>
                    </div>
                <div class="talk_list">
                    <div :key="p" v-for="(item,p) in showDetail">
                        <div class="talk-box" :key="t" v-for="(d,t) in item" v-if="d">
                            <img :src="images.robot" class="photo"/>
                            <div class="gradient">
                                <div class="gradient-box" >
                                    {{d}}
                                </div>
                            </div>
                        </div>
                         <!-- <div class="talk-box" :key="t" v-for="(d,t) in item">
                            <img :src="images.robot" class="photo"/>
                            <div class="gradient">
                                <div class="gradient-box" >
                                    33333
                                </div>
                            </div>
                        </div> -->
                    </div>
                </div>

            </div>
            <div class="content_c" v-if="!showPractice">
                <ul class="page_list">
                    <li :key="i" v-for="(item,i) in pptData">
                        <div class="num">{{item.index}}</div>
                        <div class="page" @click="changeShowInfo(item,i)">
                            <img class="page_img" :src="item.image" alt="">
                        </div>
                    </li>
                    <!-- <li>
                        <div class="num">04</div>
                        <div class="page">
                            <div class="change">+</div>
                        </div>
                    </li> -->

                </ul>
            </div>
            <div class="content_right">
                <el-image v-if="!showPractice"
                    style="width: 100%; height: 100%"
                    :src="showPic"
                    :fit="fit"></el-image>
                     <iframe v-if="showPractice" src="http://edu.wiser-bot.com/wsedu/scratch/build/index.html" frameborder="0" width="100%" height="100%" id="childFrame" scrolling="no"></iframe>
            </div>
        </div>
        <footer>
            <div class="btn_254" @click="changeTab(false)" style="background: #ACCFFF;margin: 0 0.17rem 0 4.02rem;">讲解模式</div>
            <div class="btn_254" @click="changeTab(true)">实践模式</div>
        </footer>

    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
import appHeader from '@/layouts/appHeader'
import config from '@/config'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
export default {
  data() {
    return {
      showManage: true,
      images: {
        back:require("../../../static/image/back_p.png"),
        logo: require("../../../static/image/logo_p.png"),
        robot:require('../../../static/image/robot.jpeg')
      },
      fit:'contain',
      showPic:'',
      codeList: [],
    //   courseList:[],
        pptData:[],
        showDetail:[],
        hourid:this.$route.query.hourid,
        showPractice:false,
    };
  },
  components: {
    createStudent,
    appHeader
  },
  watch: {
    currentClass() {
      console.log(this.currentClass);
    }
  },
  created() {
      this.getpptData(1);
  },
  methods: {
      changeTab(flag) {
          this.showPractice = flag;
      },
      goBack(){
           this.$router.back()
      },
      changeShowInfo(item,i) {
          this.showPic = item.image;
          if (!this.showDetail[i]) {
            this.showDetail[i] = item.detail;
          }
          console.log(item);
            const ps = new PerfectScrollbar(this.$el.querySelector('.talk_list'));
            this.$el.querySelector('.talk_list').scrollTop =this.$el.querySelector('.talk_list').scrollHeight;
            ps.update();
        // let scrollH = ;
        // this.$el.querySelector('.talk_list').scrollTop = scrollH+'px';
      },
      getpptData(hourtype) {
        let params = {
            hourId:this.hourid,
            hourType: hourtype
        }
        classApi.getpptData(params).then(res=>{
            if (res.code === '001') {
                this.pptData = res.data;
                if (this.pptData.length) {
                    this.pptData.forEach((item,i)=>{
                    this.pptData[i].image = config.API_URL+item.image;
                    this.pptData[i].detail = item.detail.split("\\n");
                    this.pptData[i].index = String(i+1).padStart(2, '0');
                        if (i === 0) {
                            this.showPic = this.pptData[i].image;
                            this.showDetail[i] = this.pptData[i].detail;
                        }
                    })
                }
            }
            console.log(this.pptData);
        });
    },
    getCodeList(classId) {
      let params = {
        clsId: classId
      };
      classApi.getCodeList(params).then(res => {
        this.codeList = res.data.map(item => {
          item.value = item.cdk;
          return item;
        });
        if (this.$refs.child) {
          this.$refs.child.setCodeOptions(this.codeList);
        }
      });
    },
    deleteStudent(student) {
      this.$confirm("确定删除学生" + student.name + "吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      }).then(() => {
        let params = {
          clsId: this.currentClass.id,
          studentId: student.id
        };
        classApi
          .deleteStudent(params)
          .then(res => {
            if (res.code === "001") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.$router.push({ path: "/class" });
            } else {
              this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "删除失败",
              type: "error"
            });
          });
      });
    },
    handleSub() {
      classApi
        .courseReportAdd(this.form)
        .then(res => {
          if (res.code === "001") {
            this.$message({
              message: "提交成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除失败",
            type: "error"
          });
        });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.wrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 10.8rem;
    position:absolute;
    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='bg-login.png',sizingMethod='scale');
    header{
        height: 0.97rem;
        line-height: 0.97rem;
        .header_left{
            display: flex;
            align-items: center;
            height: 0.97rem;
            .back{
                padding-left: 0.3rem;
                padding-right: 0.25rem;
                width: 0.25rem;
                height: 0.4rem;
                display: block;
                margin:auto;
            }
            .logo{
                width: 1.73rem;
                height: 0.58rem;
                display: block;
                margin:auto;
            }
        }
    }
    .content{
        width: 95%;
        flex: 1;
        background: #F3F6FC;
        border-radius: 0.20rem;
        display: flex;
        border-bottom: 0.01rem solid #979797;
        margin-top: 0.3rem;
        .content_left{
            width:3.84rem;
            height: 100%;
            position: relative;
            background: #F3F6FC;
            border-right: 0.01rem solid #979797;
            .top{
                background:#2878e8;
                height: 0.51rem;
                padding-top: 0.2rem;
                display:flex;
                flex:1;
                .back{
                    padding-left: 0.3rem;
                    padding-right: 0.25rem;
                    width: 0.25rem;
                    height: 0.4rem;
                    display: block;
                }
                .tit{
                    display: block;
                    height: 0.4rem;
                     color: #fff;
                    font-size: 0.3rem;
                    text-align: center;
                }
            }
            .photo{
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 100%;
                background: #FFFFFF;
                border: 0.01rem solid #979797;
                position: relative;
                margin-top:0.04rem;
            }
            .talk_list{
                height: 6.3rem;
                background: url("../../../static/image/speak_texture.png") no-repeat;
                background-position: bottom;
                position:relative;
                // overflow-y: auto;
                // height: 90%;
                .talk-box{
                    display:flex;
                    flex:1;
                }

            }
            .gradient {
                margin-left:0.23rem;
                margin-bottom: 0.29rem;
                box-sizing: border-box;
                padding: 0.04rem;
                border-radius: 0.2rem 0.2rem 0.2rem 0;
            }
            .gradient-box {
                width: 100%;
                height: 100%;
                border-radius:0 0.2rem 0.2rem 0.2rem;
                background: #4592FE;
                display: flex;
                align-items: center;
                word-wrap:break-word;
                font-size:0.13rem;
                color:#fff;
                font-weight:bold;
                padding:0.14rem 0.19rem;
                box-sizing: border-box;
            }
            .gradient_pink{
                width: 3.05rem;
                margin-left:0.55rem;
                background-image: -webkit-linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
                background-image: -moz-linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
                background-image: linear-gradient(left,#CEBFDE 0%, #F9E8EB 100% );
            }
        }
        .content_c{
            width: 2.9rem;
            border-right: 0.01rem solid #979797;
            background: #DAE9FF;
            height: 100%;
            overflow-y:auto;
            .page_list{
                li{
                    display: flex;
                    height: 1.25rem;
                    margin-top: 0.25rem;
                    .num{
                        width: 0.57rem;
                        text-align: center;
                        color: #fff;
                        font-size: 0.2rem;
                    }
                    .page{
                        width: 1.95rem;
                        height: 1.25rem;
                        background: #fff;
                        position: relative;
                        .page_img{
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                        .change{
                            position: absolute;
                            bottom: 0;
                            width: 100%;
                            height: 0.38rem;
                            background: #4592FE;
                            opacity: 0.6;
                            color:#fff;
                            text-align: center;
                            line-height: 0.38rem;
                        }
                        .unchange{
                            background: #777777;
                            opacity: 0.7;
                        }
                        .remark{
                            position: absolute;
                            top:0;
                            left:-3.65rem;
                            width: 3.61rem;
                            height: 3.13rem;
                            background: url("../../../static/image/dialog.png") no-repeat;
                            background-size: 100%;
                            padding: 0.25rem;
                            z-index: 100;
                            box-sizing: border-box;
                            p{
                                font-size: 0.17rem;
                            }
                            .remark_input{
                                width: 3rem;
                                height: 1.71rem;
                                border: 0.01rem solid #979797;
                                border-radius: 0.06rem;
                                margin:0.18rem 0;
                                padding: 0.2rem;
                                box-sizing: border-box;
                            }
                            .btn_110{
                                width: 1.1rem;
                                height: 0.37rem;
                                background: #4994FD;
                                border-radius: 0.06rem;
                                color:#fff;
                                text-align: center;
                                line-height: 0.37rem;
                                font-size: 0.14rem;
                                cursor: pointer;
                                float: right;
                            }
                        }

                    }
                }
            }
        }
        .content_right{
            flex: 1;
            display: flex;

        }
    }
    footer{
        height: 0.94rem;
        width: 100%;
        align-items: center;
        display: flex;
    }
}


</style>


