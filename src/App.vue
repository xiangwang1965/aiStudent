<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
    <dialogs></dialogs>
  </div>
</template>

<script>
import dialogs from '@/dialogs'
import authUtils from '@/services/auth/utils'
import authApi from '@/services/auth'
import eventHub from '@/utils/eventHub'
export default {
  name: 'app',
  components: {
    dialogs
  },
  beforeCreate () {
    if (location.search.toLowerCase().indexOf('token') !== -1) {
      authUtils.thirdLoggedIn()
    }
  },
  created () {
    // this.setRole()
  },
  methods: {
    setRole () {
      let params = {
        'type': 2
      }
      authApi.queryUserInfo(params).then(res => {
        let { id, name, role_name, school, avatar_url, is_teach, is_live } = res.data
        let brands = ''
        this.$store.state.brandList = school.brands
        school.brands.map((v, i) => {
          brands += ',' + v.name
        })
        authUtils.setUser({
          id,
          name,
          role_name,
          school_id: school.id,
          school_name: school.name,
          third_part: school.third_part,
          brands: brands.substring(1, brands.length),
          brandList: JSON.stringify(school.brands),
          permissions: school.permissions ? school.permissions : 'academic_affairs',
          is_self_live: school.is_self_live,
          avatar_url,
          is_teach,
          is_live,
          is_content: school.is_content
        })
        // app中派发user更新
        eventHub.$emit('updateUser', authUtils.getUser())
      })
    }
  }
}
</script>

<style src="normalize.css/normalize.css"></style>
<style src="./styles/common.css"></style>
<style>
html,
body {
  height: 100%;
  width:100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
