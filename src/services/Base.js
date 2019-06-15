import api from './api'
// import { Message, Loading } from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'
import Qs from 'qs'
// service 基础类，只用于继承
class Base {
  /**
   * Get请求
   * @param { String } url
   * @param { Object } params
   * @param { Boolean } mute 是否loading，默认false
   */
  sendGet (url, params, mute = false) {
      console.log(url);
    // 根据业务决定是否不显示loading
    // if (!mute && params) {
    //   console.log('.' + params.target)
    //   var loadingInstance = Loading.service({
    //     text: '加载中',
    //     target: ('.' + params.target)
    //   })
    // }
    // return api.get(url, { params }).then(response => {
    //   setTimeout(() => {
    //     (!mute && params) && loadingInstance.close()
    //   }, 500)
    //   return response.data
    // }).catch(() => {
    //   setTimeout(() => {
    //     (!mute && params) && loadingInstance.close()
    //   }, 500)
    //   console.log('get error')
    // })
    return api.get(url, { params }).then(response => {
      return response.data
    }).catch(() => {
      console.log('get error')
    })
  }

  /**
   * Post 请求
   * @param { String } url
   * @param { Object } data
   */
  sendPost (url, data) {
    return api.post(url, Qs.stringify(data)).then(response => {
      return response.data
    }).catch((response) => {
      return response
    })
  }

  /**
   * service 中处理错误信息，一般在 新增，修改，删除等操作中调用
   * @param { res.data } data response 中的data
   * @param { success | error | errorOnly } options 成功或失败的 msg, errorOnly 只提示错误消息
   */
  handleError (data, options = {}) {
    if (data.code === '001') {
      !options.errorOnly && Message.success(options.success || '操作成功')
    } else {
      Message.error(data.message || options.error ||data.msg || '操作失败')
    }
  }

  /**
   * url替换工具方法
   * /test/{name} => /test/savo
   * @param { String } url 传入的 url 地址
   * @param { Object } params 要替换的参数
   */
  parseUrl (url, params) {
    Object.keys(params).forEach(key => {
      var reg = new RegExp('\\{' + key + '\\}')
      url = url.replace(reg, params[key])
    })
    return url
  }
}

export default Base
