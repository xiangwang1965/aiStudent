import Cookies from 'js-cookie'
// import { MAIN_URL } from '@/config'
import { MAIN_URL } from '@/config'
import authApi from './index'
// 认证信息包括 token && 需要在发请求时带在 header 上
const TOKEN_KEY = 'ttoken'
// 登录后的用户信息
const USER_KEY = 'T_USER_INFO'
const EXPIRES = 1 // 24 小时过期

export function getToken () {
  return Cookies.get(TOKEN_KEY)
}

// token 信息
export function setToken (token) {
  if (token) {
    return Cookies.set(TOKEN_KEY, token, { expires: EXPIRES, domain: MAIN_URL })
  }
}

export function removeToken () {
  return Cookies.remove(TOKEN_KEY, { domain: MAIN_URL })
}

// 登录用户基本信息
export function setUser (user) {
  return Cookies.set(USER_KEY, user, { expires: EXPIRES, domain: MAIN_URL })
}

/**
 * 获取用户信息
 * 具体用户信息在 services/auth/index.js login方法中设置
 * @param { String } key 可选，用户信息中的键值
 */
export function getUser (key = '') {
  return Cookies.getJSON(USER_KEY) || {}
}

// 删除用户信息
export function removeUser () {
  return Cookies.remove(USER_KEY, { domain: MAIN_URL })
}

// 判断用户是否登录
export function loggedIn () {
  return !!Cookies.get(TOKEN_KEY)
}

// 第三方登录
export function thirdLoggedIn () {
  if (location.search) {
    let searchArr = location.search.substring(1, location.search.length).split('&')
    searchArr.map((v, i) => {
      let objArr = v.split('=')
      if (objArr[0] === 'token') {
        Cookies.set(TOKEN_KEY, objArr[1], { expires: EXPIRES, domain: MAIN_URL })
        Cookies.set('FROM_URL', 'wisroom', { expires: EXPIRES, domain: MAIN_URL })
        authApi.fetchSchool().then(res => {
          let { id, name, role_name, school, avatar_url, is_teach, is_live } = res.data.users[0]
          let brands = ''
          this.$store.state.brandList = school.brands
          school.brands.map((v, i) => {
            brands += ',' + v.name
          })
          this.setUser({
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
            is_live
          })
        })
      }
    })
    authApi.fetchSchool().then(res => {
      let { id, name, role_name, school, avatar_url, is_teach, is_live } = res.data.users[0]
      let brands = ''
      this.$store.state.brandList = school.brands
      school.brands.map((v, i) => {
        brands += ',' + v.name
      })
      this.setUser({
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
        is_live
      })
    })
  }
}

// 判断用户是否已经存有信息
export function hasUser () {
  return !!Cookies.get(USER_KEY)
}

// 获取登录用户的角色字符串数组
// 目前只有 教务、教师
export function getRole () {
  return getUser().role_name || ''
}

export default {
  getToken,
  setToken,
  removeToken,
  setUser,
  getUser,
  removeUser,
  loggedIn,
  hasUser,
  getRole,
  thirdLoggedIn
}
