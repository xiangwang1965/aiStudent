// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import filters from '@/utils/filters'
import dialogUtils from './dialogs/utils'
import eventHub, * as EVENTS from './utils/eventHub'
import store from './vuex/store.js'
import pkg from '../package.json'
import '@/utils'
// import { MAIN_URL } from '@/config'
// import authApi from '@/services/auth'
// import Cookies from 'js-cookie'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

Vue.config.productionTip = false

Object.keys(filters).forEach(v => Vue.filter(v, filters[v]))

Vue.prototype.$eventHub = eventHub
Vue.prototype.$EVENTS = EVENTS
Vue.prototype.$dialog = dialogUtils

Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.coursewareSelect .el-scrollbar__wrap')
    selectWrap.addEventListener('scroll', function () {
      let sign = 100
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
const elScrollBar = (el) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    el._ps_ = new PerfectScrollbar(el, {
      suppressScrollX: true
    })
  }
}

Vue.directive('scrollBar', {
  inserted (el, binding, vnode) {
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    elScrollBar(el)
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    try {
      vnode.context.$nextTick(
        () => {
          elScrollBar(el)
        }
      )
    } catch (error) {
      console.error(error)
      elScrollBar(el)
    }
  }
})


Vue.use(ElementUI)
window.onresize = setHtmlFontSize;
function setHtmlFontSize(){
    const designSize = 1920;
    // const designSize = 2500;
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const htmlDom = document.getElementsByTagName('html')[0];
    htmlDom.style.fontSize = htmlWidth*100 / designSize + 'px';
};
setHtmlFontSize();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

// window 上存放版本号
window.res = {
  name: pkg.name,
  version: pkg.version
}

console.log(`   APP ${pkg.name} v${pkg.version} is running`)
