import Base from '../Base'
import authUtils from './utils'
import store from '@/vuex/store.js'
class Auth extends Base {
  constructor () {
    super()
    this.authUrl = '/ws/api/user/login2'
    this.loginUrl = '/ws/api/user/login2'
    this.getCodeUrl = '/ws/api/verificode'
    this.logoutUrl = '/auth/logout'
    this.resetPwdUrl = '/ws/api/user/modifyPwd'
    this.queryUserListUrl = '/auth/users'
  }

  /**
   * 认证接口
   * @param { Object } params {telephone, password, type: 1 教师APP、2教师PC、3学生端}
   */
  auth (params) {
    params.type = 2
    return this.sendPost(this.authUrl, params).then(res => {
      if (res.code == '001') {
        authUtils.removeToken()
        // 只有一个yonghu     直接登录
        if (res.data.users.length === 1) {
          return this.login({
            id: res.data.users[0].id, // TODO 如果登录在这里用需要判断学校个数来提示选择
            token: res.data.token
          })
        } else {
          // 多个机构切换
          res.multiple = true
          return res
        }
      }
      this.handleError(res, {
        errorOnly: true
      })
    })
  }
  /**
   * 登录接口
   * @param { Object } params {id, token, type:0，1，2   学生，教师，机构。}
   */
  login (params) {
    params.type = 1
    return this.sendPost(this.loginUrl, params).then(res => {
      if (res.code == '001') {
        authUtils.setToken(res.data.token)
        let { id, name, user_type, username } = res.data
        code: null
        authUtils.setUser({
          id,
          name,
          user_type,
          username
        })
      }
      this.handleError(res, {
        success: '登录成功'
      })
      return res
    })
  }
  /**
   * 修改密码
   * @param { Object } params {id, token, type: 1 教师APP、2教师PC、3学生端}
   */
  upadtePwd (params) {
    return this.sendPost(this.resetPwdUrl, params).then(res => {
      if (res.code == '001') {
        this.handleError(res, {
            success: '修改成功'
          })
        return res
      } else {
        this.handleError(res, {
            success: res.msg
          })
        return res
      }
    })
  }

  /**
   * 退出登录
   */
  logout () {
    return new Promise((resolve, reject) => {
        authUtils.removeToken()
        authUtils.removeUser()
        resolve({
        ok: true
        })
    })
  }
    /**
   * 获取验证码
   */
  getCode (params) {
    return this.sendPost(this.getCodeUrl, params).then((res)=>{
        this.handleError(res, {
            success: '发送成功'
          })
          return res
    });
  }

  /**
   * 获取当前用户信息
   */
  queryUserInfo (params) {
    return this.sendGet(this.queryUserInfoUrl, params).then((res) => {
      if (res.ok) {
        this.setBrandList(res.data.school.brands)
      }
      return res
    })
  }
  setBrandList (list) {
    store.state.brandList = list
  }
  /**
   * 获取当前用户学校
   */
  fetchSchool () {
    return this.sendGet(this.queryUserListUrl)
  }
}

export default new Auth()
