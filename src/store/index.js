import Vue from 'vue'
import Vuex from 'vuex'
//modules
import system from './modules/system'
import user from './modules/user'
import global from './modules/global'
import map from './modules/map'
import construction from './modules/construction'
import machine from './modules/machine'
import coupon from './modules/coupon'

Vue.use(Vuex)

const debug = false//process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    system,
    user,
    map,
    construction,
    machine,
    coupon,
    global
  },
  strict: debug,
})