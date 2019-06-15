<template>
  <el-header class="header">
      <div class="header_left">
            <img :src="logoImg">
        </div>

        <div class="header_right" style="cursor: pointer">
             <img :src="menuIcon">
            <!-- <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img :src="menuIcon">
                    <span class="user_name" :title="user.name">{{ user.name }}</span>
                    <i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="gotoResetPassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
        </div>
  </el-header>
</template>

<script>
  import authUtils from '@/services/auth/utils'
  import authApi from '@/services/auth'
  import eventHub from '@/utils/eventHub'
  import PermissionApi from '@/services/permission'
  import { WB_MAIN_URL, WISROOM_URL, MAIN_URL } from '@/config'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        showList: false,
        logoImg: require('../../static/image/logo.png'),
        menuIcon: require('../../static/image/menuIcon.png'),
        user: {
          name: '',
          avatar: '',
          school_name: ''
        }
      }
    },
    created () {
      // 监听用户是否修改了自己都信息，刷新自己都信息
      eventHub.$on('update', this.updateUser)
      eventHub.$on('updateUser', this.getUser)
    },
    mounted () {
      this.getUser()
    },
    methods: {
      handleCommand (command) {
        switch (command) {
          case 'gotoSetProfile' :
            location.href = WB_MAIN_URL + '/auth/setProfile?loggedIn=true&backUrl=' + location.href
            break
          case 'gotoResetPassword' :
            if (Cookies.get('FROM_URL') && Cookies.get('FROM_URL') === 'wisroom') {
              location.href = WISROOM_URL + '/login/resetPassword'
            } else {
              location.href = WB_MAIN_URL + '/auth/resetPassword?loggedIn=true'
            }
            break
          case 'logout' :
            var fromUrl = Cookies.get('FROM_URL')
            authApi.logout().then(res => {
              if (res.ok) {
                if (fromUrl && fromUrl === 'wisroom') {
                  Cookies.remove('FROM_URL', { domain: MAIN_URL })
                  location.href = WISROOM_URL + '/login/'
                } else {
                  location.href = WB_MAIN_URL + '/auth/login'
                }
              }
            })
            break
        }
      },
      updateUser (data) {
        if (data.params.id === this.user.id) {
          let params = {
            user_id: this.user.id
          }
          PermissionApi.queryUserInfo(params).then(res => {
            let { id, name, role_name, school, avatar_url } = res.data
            let brands = ''
            this.$store.state.brandList = school.brands
            school.brands.map((v, i) => {
              brands += ',' + v.name
            })
            authUtils.setUser({
              id,
              name,
              role_name,
              school_name: school.name,
              school_id: school.id,
              third_part: school.third_part,
              brands: brands.substring(1, brands.length),
              brandList: JSON.stringify(school.brands),
              permissions: school.permissions ? school.permissions : 'academic_affairs',
              avatar_url
            })
            this.getUser()
          })
        }
      },
      getUser () {
        this.user = authUtils.getUser()
        this.user.avatar = this.user.avatar_url === null || this.user.avatar_url === '' ? '../../static/avatar.jpg' : this.user.avatar_url
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    // text-align: right;
    // width: 200px;
    // height: 60px !important;
    // line-height: 60px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // position: absolute;
    // top: 0;
    // right: 0;
    // z-index: 2;
    // /* background: url(../../static/img/bg-header.jpg) no-repeat; */
    // background-size: 100%;
    // padding: 0 20px;
    .header_left {
        float: left;
        img {
            width: 3.30rem;
            height: 0.65rem;
            display: block;
            margin: 0.42rem 0 0 0.30rem;
        }
    }
    .header_right{
        float: right;
        img{
            width: 0.72rem;
            height: 0.43rem;
            display: block;
            margin: 0.49rem 0.48rem 0 0;
        }
    }
  }

  .header__right {
    color: #fff;
    font-size: 16px;
  }
  .header__right__avatar {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 11px;
    vertical-align: top;
    margin-right: 10px;
  }
  .user_name {
    display: inline-block;
    max-width: 90px;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
</style>
