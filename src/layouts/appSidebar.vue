<template>
  <div class="appSideWrap">
    <div class="content_left">
      <div class="teacher_box">
        <img :src="logoImg" alt class="photo">
        <p class="name">{{tInfo.name}}</p>
        <p class="id">ID:{{tInfo.id}}</p>
        <span class="grade">Level{{tInfo.level}}</span>
        <div class="statistics">
            <div class="item">
              <p class="num">{{tInfo.totalStu}}</p>
              <p class="txt">培训学生总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalCourse}}</p>
              <p class="txt">培训课程总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalDay}}</p>
              <p class="txt">上课总天数</p>
            </div>
          </div>
       <div class="lesson_lock">
            <div :class="item.class" class="lock_row" :key="i" v-for="(item,i) in levelsData">
              <div class="name">{{item.tit}}</div>
              <div class="lock_level">
                <div class="lock_item" :key="t" v-for="(l,t) in item.list">
                  <img :src="item.icon" v-if="tInfo.level < l.level" class="lock">
                  <p>Leverl {{l.level}}</p>
                  <p>{{l.name}}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="btn_124 out_login" @click="logout">退出登录</div>
    </div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import authApi from "@/services/auth";
import teacherApi from '@/services/teacher'
import eventHub from "@/utils/eventHub";
import { IMS_URL } from "@/config";
export default {
  data() {
    return {
      menuList: [],
      logoImg: require("../../static/image/person_background.png"),
      levelsData: [
        {
          tit: "SCRATCH",
          icon: require("../../static/image/lock_yellow.png"),
          class:'lock_row_y',
          aciveClass:'unlock_y',
          list: [
            {
              level: 1,
              name: "初级编程"
            },
            {
              level: 2,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "PYTHON",
           icon: require("../../static/image/lock_blue.png"),
           class:'lock_row_b',
            aciveClass:'unlock_b',
          list: [
            {
              level: 3,
              name: "初级编程"
            },
            {
              level: 4,
              name: "初级编程"
            },
            {
              level: 5,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "NOIP",
          icon: require("../../static/image/lock_red.png"),
          class:'lock_row_r',
          aciveClass:'unlock_r',
          list: [
            {
              level: 6,
              name: "初级编程"
            },
            {
              level: 7,
              name: "初级编程"
            },
            {
              level: 8,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "AI",
          icon: require("../../static/image/lock_purple.png"),
          class:'lock_row_p',
          aciveClass:'unlock_p',
          list: [
            {
              level: 9,
              name: "初级编程"
            },
            {
              level: 10,
              name: "初级编程"
            },
            {
              level: 11,
              name: "初级编程"
            },
            {
              level: 12,
              name: "初级编程"
            }
          ]
        }
      ],
      routes: ["/class", "/teacher", "/buy", "/course", "/classroom"],
      is_live: 1,
      temp: [],
      userInfo:{},
      tInfo:{}
    };
  },
  computed: {
    defaultActive() {
      let index = this.routes.indexOf("/" + this.$route.path.split("/")[1]);
      if (index !== -1) {
        return this.routes[index];
      }
      return "";
    },
    hasFaceTeaching() {
      let num = 0;
      this.faceTeachingBrand.map(v => {
        if (authUtils.getUser().brands.indexOf(v) >= 0) {
          num++;
        }
      });
      if (num === 0) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.temp = this.menuList;
    this.getUser()
    // this.handleSelect(this.$route.path)
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    getUser() {
      // this.is_live = authUtils.getUser() && authUtils.getUser().is_live
      // this.menuList = this.is_live ? this.liveList : this.tofaceList
      // 判断是否是平台双师1或魔法双师0
      console.log(authUtils.getUser());
      this.userInfo = authUtils.getUser();
      if (this.userInfo.id) {
          this.queryTeacherInfo(this.userInfo.id);
      } else {
          this.$message({
              message:'教师id不存在，请确认用户身份',
              type:'error'
          })
      }
    //   this.is_self_live =
    //     authUtils.getUser() && authUtils.getUser().is_self_live;
    //   this.menuList = [];
    //   this.menuList = this.is_self_live ? this.platformList : this.liveList;
    //   // 如果third_part存在，使用对应的第三方侧栏
    //   if (authUtils.getUser().third_part) {
    //     this.menuList = this[authUtils.getUser().third_part + "List"];
    //   }
    },
    go(item) {},
    logout() {
        authApi.logout().then(res=>{
            this.$router.push({
                name:'auth'
            })
        });
    },
     queryTeacherInfo(id) {
      var p = {};
      p.teacherId = id || "1";
      teacherApi.queryTeacherInfo(p).then(res => {
        if (res.code === "001") {
          this.tInfo = res.data;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.appSideWrap {
    width:4.5rem;
    height: 100%;
    background: url("../../static/image/contentLeftBg.png");
    background-size: 100%;
    position: relative;
    .out_login{
        position: absolute;
        border:1px solid #fff;
        bottom: 0.42rem;
        left:1.19rem;
    }

}
</style>
