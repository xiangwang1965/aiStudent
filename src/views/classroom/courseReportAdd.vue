<template>
    <div class="dialog_content_big">
      <div class="dialog_center">
        <div class="dialog_l_r">
          <div class="dialog_left" style="width: 2.36rem">
            <div class="teacher_box" style="width: 100%;padding-top:0.59rem">
              <img :src="tInfo.avatar" alt class="photo">
              <p class="name">李雷</p>
              <p class="id">ID:00001</p>
              <span class="grade">副教授级</span>
              <p class="phone">联系电话：13333333333</p>
            </div>
            <div class="intr_box" style="width: 1.82rem">
              <div class="intr_row">
                <img :src="tInfo.nameIcon" alt style="width: 0.1rem;height: 0.13rem;;"> 姓名：
                <span>拉拉</span>
              </div>
            </div>
            <div class="intr_box" style="width: 1.82rem">
              <div class="intr_row">
                <img :src="tInfo.nameIcon" alt style="width: 0.1rem;height: 0.13rem;;"> 机构：
                <span>拉拉</span>
              </div>
            </div>
          </div>
            <el-form ref="form" :model="form"  @keyup.enter.native="handleSub" class="dialog_rig" style="padding:0 0.2rem;text-align: left;width:7.14rem">
            <ul class="form dialog_form">
                <el-form-item label="· 课时选择:">
                    <el-select v-model="form.hourId" placeholder="请选择课时">
                    <el-option :key="i" v-for="(item,i) in courseList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
            </el-form-item>
              <li class="form_row">
                <div class="form_lable">· 学习内容:</div>
                <div class="form_box">
                  <textarea v-model="form.value"></textarea>
                </div>
              </li>
              <li class="form_row">
                <div class="form_lable">· 课后作业:</div>
                <div class="form_box">
                  <textarea v-model="form.task"></textarea>
                </div>
              </li>
              <li class="form_row">
                <div class="form_lable">· 课堂表现:</div>
                <div class="form_box">
                  <textarea v-model="form.feedback"></textarea>
                </div>
              </li>
              <li class="form_row">
                <div class="form_lable">· 老师反馈:</div>
                <div class="form_box">
                  <textarea  v-model="form.behavior"></textarea>
                </div>
              </li>

              <li class="form_row">
                <div class="form_lable">· 课堂评估:</div>
                <div class="form_box">
                  <p>打分制度为从低到高</p>
                  <div class="radio_group">
                     <el-form-item label="操作能力">
                          <el-radio-group v-model="form.operation">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="创新能力">
                          <el-radio-group v-model="form.innovate">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                    <el-form-item label="交流能力">
                          <el-radio-group v-model="form.exchange">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="团队能力">
                          <el-radio-group v-model="form.team">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                     <el-form-item label="抗挫折能力">
                          <el-radio-group v-model="form.resist">
                            <el-radio :label="1">1分</el-radio>
                            <el-radio :label="2">2分</el-radio>
                            <el-radio :label="3">3分</el-radio>
                            <el-radio :label="4">4分</el-radio>
                            <el-radio :label="5">5分</el-radio>
                        </el-radio-group>
                     </el-form-item>
                  </div>
                </div>
              </li>
            </ul>
            <div class="dialog_bottom">
              <div class="btn_124" @click="handleSub" id="submit_s">保存</div>
            </div>
            </el-form>
        </div>
      </div>
    </div>
</template>
<script>
import classApi from "../../services/classroom";
import createStudent from "./createStudent";
export default {
  props: ["curStudent",'studentlist','courseList','curClsId'],
  data() {
    return {
      showManage: true,
      defaultImg: require("../../../static/img/student.png"),
      tInfo: {
        avatar: require("../../../static/image/person_background.png"),
        nameIcon: require("../../../static/image/name_icon.png")
      },
      currentStudent: "",
      codeList: [],
      showCreate: false,
    //   courseList:[],
      form:{
          studentId:this.curStudent.id,
          classId:this.curClsId,
          courseId:1,
          value:'',
          task:'',
          feedback:'',
          behavior:'',
          hourId:'',
          operation:'',
          innovate:'',
          exchange:'',
          team:'',
          createDate:'',
          resist:'',
          createId:''
      }
    };
  },
  components: {
    createStudent
  },
  watch: {
    currentClass() {
      console.log(this.currentClass);
    }
  },
  created() {
    // this.getCodeList(this.currentClass.id);
    console.log(this);
  },
  methods: {
      getCoursePlan(currentClass) {
      let params = {
        clsId: currentClass,
      };
        classApi.getCoursePlan(params).then(res => {
            if (res.code === '001') {
                this.courseList = res.data.list;
            }

      })
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
    @bottom:1px solid #979797;
    .el-icon-delete{
        cursor: pointer;
        color:cornflowerblue;
    }
    .top{width:100%;height:5px;border-bottom:@bottom}
    .h3{
        width:100%;
        height:44px;
        line-height:44px;
        border-bottom:@bottom;
        color:#000;
        text-align: center;
    }
    .studentManage{
        height:50vh;
        margin:0;
        padding:0;
        .left-item{
            float:left;
            width:30vw;
            height:100%;
            border-right:@bottom;
            ul{
                margin:0 auto;
                padding:0 5px;
                max-height: 150px;
                overflow-y:auto;
                li{
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    img{
                        float:left;
                        width:30px;
                        height:30px;
                        border-radius: 50%;
                        background:#000;
                    }
                    height:44px;
                    border-bottom: 1px solid #979797;
                    padding-top:10px;
                    div{
                        float:left;
                        margin-left:30px;
                        margin-top:5px;
                        width:280px;
                        p{font-size:12px;}
                    }
                    i{
                        margin-top:15px;
                        margin-right:0px;
                    }
                    &.active{
                        background:rgba(#F3F6FC);
                    }

                }
            }
            .studentInfo{
                .info {
                    height:60px;
                    border-bottom:@bottom;
                    .cac-button-one{
                        margin-top:13px;
                        width:20px;
                        height:30px;
                    }
                }
            }
        }
        .right-item{
            float:left;
            width:45vw;
            height:100%;
            ul li{
                width:450px;
                padding:10px 5px;
                background: #F3F6FC;
                border-radius: 12px;
                margin-left:10px;
                margin-top:10px;
                min-height:60px;
                overflow: auto;
                overflow-x:hidden;
                line-height:100%;
                p{
                    float:left;
                    width:100%;
                    margin-left:18px;
                    margin-top:10px;
                    span{
                        color:#9b9b9b;
                    }
                }
            }
        }
    }
</style>


