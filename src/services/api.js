import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/services/auth/utils'
import config from '@/config'
import Qs from 'qs'
// 创建axios实例
console.log(config.API_URL)
const api = axios.create({
  baseURL: config.API_URL, // 后台 api 的 url
  timeout: 30000,     // 请求超时时间
  validateStatus: function (status) {
    return status < 500 // Reject only if the status code is greater than or equal to 500
  }
})

// request拦截器
api.interceptors.request.use(config => {
    if (config.url.method === 'post') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      if(config.url.indexOf("/ws/api/user/login2") === -1){
        config.headers['ttoken'] = getToken()
      }
    } else {
        config.headers['ttoken'] = getToken()
    }
  return config
}, error => {
  // Do something with request error
  console.log('request err:', error) // for debug
  return Promise.reject(error)
})

// respone拦截器
api.interceptors.response.use(res => {
  if (res.data.code == 422) { // TODO
    Message.error(res.data.msg || 'token过期,请退出重新登录')
    window.location.href = '/auth'
  }
  if (res.data.status_code === 200 && res.data) {
    res.data.ok = true
  }
  return res
}, (error, data) => {
  if (error.request && error.request.readyState === 4 && error.request.status === 0) {
    error.response = {
      'status_code': 500,
      'message': '请检查网络，稍后重试！'
    }
  } else {
    error.response.status === 500 && (error.response = { 'message': '服务器开小差，请稍后重试！' })
  }
  console.log('response err:', error)// for debug
  return Promise.reject(error.response)
})

export default api
