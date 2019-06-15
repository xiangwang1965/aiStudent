import Base from './Base'

/**
 * 增删改查 基础类
 * services中可以直接继承该类
 * 只需要在 子类 constructor 中配置相对应的 url 即可
 * 如果该类不满足需求，可以继承Base类，方法全部手写
 */
class CRUD extends Base {
  constructor () {
    super()
    this.queryUrl = ''
    this.createUrl = ''
    this.updateUrl = ''
    this.destroyUrl = ''
    this.disabledUrl = ''
  }

  /**
   * 查询方法
   * @param { Object } params get参数
   */
  query (params) {
    return this.sendGet(this.queryUrl, params).then(res => {
      return res
    })
  }

  /**
   * 新增方法
   * @param { Object } params get参数
   */
  create (params) {
    return this.sendPost(this.createUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }

  /**
   * 修改方法
   * @param { Object } params get参数
   */
  update (params) {
    return this.sendPost(this.updateUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }

  /**
   * 删除方法
   * @param { Object } params get参数
   */
  destroy (params) {
    return this.sendGet(this.destroyUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }

  /**
   * 禁用方法
   * @param { Object } params get参数
   */
  disabled (params) {
    return this.sendPost(this.disabledUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
}

export default CRUD
