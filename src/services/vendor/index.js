import CRUD from '../CRUD'

class Vendor extends CRUD {
  constructor () {
    super()
    this.ossUrl = '/aliyun/oss/access_token'
    this.mtsUrl = '/aliyun/mts/auth'
  }

  /**
   * 获取oss访问地址
   * type 如下：
   * file => 学生提交作业
   * video => 加密视频
   * avatar => 头像
   * commodity => 商品
   * class => 班级讲义等加密
   * audio => 老师音频
   * homework => 老师批改作业
   * @param { urls, timeout, type } params
   */
  fetchOSS (params) {
    return this.sendPost(this.ossUrl, params)
  }

  /**
   * MTS 播放方式授权
   * @param { media_id } params
   */
  fetchMTS (params) {
    return this.sendPost(this.mtsUrl, params)
  }
}

export default new Vendor()
