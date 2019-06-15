<template>
  <div class="thirdPartAuth">
    <img class=landing src="/static/img/loading-bars.svg" alt=lading>
  </div>
</template>
<script>
import authApi from '@/services/auth'
import { MAIN_URL, WISROOM_URL, WB_MAIN_URL } from '@/config'
import Cookies from 'js-cookie'
import authUtils from '@/services/auth/utils'
export default {
  data () {
    return {
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      const TOKEN_KEY = 'ADMIN_TOKEN'
      // 登录后的用户信息
      const EXPIRES = 1 // 24 小时过期
    //   if (location.search) {
    //     let searchArr = location.search.substring(1, location.search.length).split('&')
    //     searchArr.map((v, i) => {
    //       let objArr = v.split('=')
    //       if (objArr[0] === 'token') {
    //         Cookies.set(TOKEN_KEY, objArr[1], { expires: EXPIRES, domain: MAIN_URL })
    //         // Cookies.set(TOKEN_KEY, objArr[1], { expires: EXPIRES, domain: WB_MAIN_URL })
    //         Cookies.set('FROM_URL', 'wisroom', { expires: EXPIRES, domain: MAIN_URL })
    //         // Cookies.set('FROM_URL', 'wisroom', { expires: EXPIRES, domain: WB_MAIN_URL })
    //         authApi.fetchSchool().then(res => {
    //           if (res.ok) {
    //             let { id, name, role_name, school, avatar_url, is_teach, is_live } = res.data.users[0]
    //             let brands = ''
    //             this.$store.state.brandList = school.brands
    //             school.brands.map((v, i) => {
    //               brands += ',' + v.name
    //             })
    //             authUtils.setUser({
    //               id,
    //               name,
    //               role_name,
    //               school_id: school.id,
    //               school_name: school.name,
    //               third_part: school.third_part,
    //               is_self_live: school.is_self_live,
    //               brands: brands.substring(1, brands.length),
    //               brandList: JSON.stringify(school.brands),
    //               permissions: school.permissions ? school.permissions : 'academic_affairs',
    //               avatar_url,
    //               is_teach,
    //               is_live
    //             })
    //             var roleList = []
    //             if (authUtils.getUser().third_part === 'wisroom') {
    //               if (authUtils.getUser() && authUtils.getUser().role_name) {
    //                 roleList = authUtils.getUser().role_name.split(',')
    //               }
    //               if (roleList.indexOf('校长') !== -1 || roleList.indexOf('校区主管') !== -1 || roleList.indexOf('教务') !== -1) {
    //                 this.$router.push({path: '/wisroomCourseWare'})
    //               } else if (roleList.indexOf('前台') !== -1) {
    //                 this.$router.push({path: '/reception'})
    //               }
    //               if ((roleList.indexOf('辅导老师') >= 0 || roleList.indexOf('老师') >= 0) && (roleList.indexOf('校长') < 0 && roleList.indexOf('校区主管') < 0 && roleList.indexOf('教务') < 0 && roleList.indexOf('前台') < 0)) {
    //                 window.location.href = WB_MAIN_URL + '/auth/setProfile?loggedIn=true&backUrl=' + location.href
    //               }
    //             }
    //             if (!authUtils.getUser().third_part) {
    //               if (authUtils.getUser().is_self_live === 1) {
    //                 if (authUtils.getUser() && authUtils.getUser().role_name) {
    //                   roleList = authUtils.getUser().role_name.split(',')
    //                 }
    //                 // 根据是否权限只有教务来判断首页是学生班
    //                 if (roleList.indexOf('校长') !== -1 || roleList.indexOf('双师平台-校区主管') !== -1 || roleList.indexOf('双师主管') !== -1) {
    //                   this.$router.push({path: '/platformCourse'})
    //                 } else if (roleList.indexOf('教务') !== -1) {
    //                   this.$router.push({path: '/course'})
    //                 } else if (roleList.indexOf('前台') !== -1) {
    //                   this.$router.push({path: '/reception'})
    //                 }
    //                 if (roleList.indexOf('双师主讲') !== -1 && (roleList.indexOf('校长') === -1 && roleList.indexOf('双师平台-校区主管') === -1 && roleList.indexOf('双师主管') === -1 && roleList.indexOf('前台') === -1 && roleList.indexOf('教务') === -1)) {
    //                   this.$router.push({path: '/platform'})
    //                 }
    //                 if (roleList.indexOf('面授主讲') !== -1 && (roleList.indexOf('校长') === -1 && roleList.indexOf('双师平台-校区主管') === -1 && roleList.indexOf('双师主管') === -1 && roleList.indexOf('前台') === -1 && roleList.indexOf('教务') === -1)) {
    //                   this.$router.push({path: '/teaching'})
    //                 }
    //                 // 根据是否权限只有助教来判断首页是404
    //                 if ((roleList.indexOf('辅导老师') >= 0 || roleList.indexOf('老师') >= 0) && (roleList.indexOf('校长') < 0 && roleList.indexOf('双师平台-校区主管') < 0 && roleList.indexOf('双师主管') < 0 && roleList.indexOf('教务') < 0 && roleList.indexOf('前台') < 0)) {
    //                   window.location.href = WB_MAIN_URL + '/auth/setProfile?loggedIn=true&backUrl=' + location.href
    //                 }
    //               } else {
    //                 if (authUtils.getUser() && authUtils.getUser().role_name) {
    //                   roleList = authUtils.getUser().role_name.split(',')
    //                   if (roleList.indexOf('校长') !== -1 || roleList.indexOf('魔法双师-校区主管') !== -1 || roleList.indexOf('魔法双师主管') !== -1) {
    //                     this.$router.push({path: '/studentClassroom'})
    //                   } else if (roleList.indexOf('教务') !== -1) {
    //                     this.$router.push({path: '/course'})
    //                   } else if (roleList.indexOf('前台') !== -1) {
    //                     this.$router.push({path: '/reception'})
    //                   }
    //                 }
    //                 if (roleList.indexOf('面授主讲') !== -1 && (roleList.indexOf('校长') === -1 && roleList.indexOf('魔法双师-校区主管') === -1 && roleList.indexOf('魔法双师主管') === -1 && roleList.indexOf('前台') === -1 && roleList.indexOf('教务') === -1)) {
    //                   this.$router.push({path: '/teaching'})
    //                 }
    //                 if ((roleList.indexOf('辅导老师') >= 0 || roleList.indexOf('老师') >= 0) && (roleList.indexOf('校长') < 0 && roleList.indexOf('魔法双师-校区主管') < 0 && roleList.indexOf('魔法双师主管') < 0 && roleList.indexOf('教务') < 0 && roleList.indexOf('前台') < 0)) {
    //                   window.location.href = WB_MAIN_URL + '/auth/setProfile?loggedIn=true&backUrl=' + location.href
    //                 }
    //               }
    //             }
    //           } else {
        console.log(WISROOM_URL);
                // window.location.href = WISROOM_URL + '/login/'
            //   }
    //         })
    //       }
    //     })
    //   }
    }
  }
}
</script>
<style lang="less">
.thirdPartAuth {
  position: relative;
  width: 100%;
  height: 100%;
  .landing {
    position: absolute;
    width: 60px;
    left: 50%;
    top: 40%;
    margin-left: -20px;
  }
}
</style>
