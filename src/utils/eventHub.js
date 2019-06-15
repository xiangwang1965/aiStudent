import Vue from 'vue'

// 全局事件名称
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

// 全局事件派发器 用来替换 $broadcast, see https://cn.vuejs.org/v2/guide/migration.html#events-%E9%80%89%E9%A1%B9-%E7%A7%BB%E9%99%A4
export default new Vue()
