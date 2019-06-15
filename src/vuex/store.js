import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var state = {
  count: 1,
  brandList: []
}

var mutations = {
  init () {
    console.log('vuex init')
  }
}

var getters = {
  computedCount: (state) => {
    return state.count++
  }

}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
