import CRUD from '../CRUD'

class Permission extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/users/list'
    this.createUrl = '/users/add'
    this.updateUrl = '/users/modify'
    this.disabledUrl = '/users/modify_active'
    this.queryRoleUrl = '/permissions/all_roles'
    this.queryUserInfoUrl = '/users'
    this.queryClassUrl = '/class/list'
    this.queryOSSUrl = '/aliyun/oss/sts_token'
  }
    // 根据角色
  queryRole () {
    return this.sendGet(this.queryRoleUrl)
  }
  // 获取用户信息
  queryUserInfo (params) {
    return this.sendGet(this.queryUserInfoUrl, params)
  }
  // 获取班级列表
  queryClass (params) {
    return this.sendGet(this.queryClassUrl, params)
  }
  // 获取OSS STS Token
  queryOSS (params) {
    return this.sendPost(this.queryOSSUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取accessToken查看图片
  getOssAccessToken (params) {
    return this.sendPost('aliyun/oss/access_token', params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default new Permission()
