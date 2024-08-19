import { fetchActivity, fetchOrderList, fetchCouponList } from '@/network/modules/couponapi'
import { code2Session } from '@/network/modules/userapi'

const state = {
  openid: '',
  activity: null,
  tabs: [{
    label: '待使用',
    value: 'PAID',
    list: [
    ],
  }, {
    label: '已使用',
    value: 'WRITE_OFF',
    list: [
    ]
  }, {
    label: '已作废',
    value: 'CANCEL',
    list: [
    ]
  }],
  orders: []
}

// getters
const getters = {
}

// actions
const actions = {
  async init({ dispatch, commit, state }, code) {
    let res = await code2Session(code)
    commit('setState', { openid: res.openid })
    dispatch('fetchRunningActivity')
  },
  async fetchRunningActivity({ dispatch, commit, state }) {
    let activity = await fetchActivity()
    if (activity) {
      activity.couponTypeDtos.forEach(d => d.num = 0)
      commit('setState', { activity })
    }
  },
  // async fetchCouponList({ dispatch, commit, state }) {
  //   let tasks = state.tabs.map(async t => {
  //     let list = await fetchCouponList(state.openid, t.value, t.value)
  //     t.list = list
  //   })
  //   await Promise.all(tasks)
  //   commit('setState', { tabs: state.tabs })
  // },

  async fetchOrderList({ dispatch, commit, state }) {
    let identifier = null
    uni.getStorage({
      key: 'teamId',
      success: async res => {
        console.log(res)
        identifier = res.data;
        let list = await fetchOrderList(state.openid, identifier)
        state.orders = list
        commit('setState', { orders: state.orders })
      },
      fail: async e => {
        console.log(e)
        let list = await fetchOrderList(state.openid, identifier)
        state.orders = list
        commit('setState', { orders: state.orders })
      },
    });

  }
}

// mutations
const mutations = {
  setState(state, payload) {
    Object.assign(state, payload)
  },
  updateCouponNum(state, { index, num }) {
    let coupon = state.activity.couponTypeDtos[index]
    if (num >= 0 && num <= coupon.limitCount) {
      state.activity.couponTypeDtos[index].num = num
      // state.activity.couponTypeDtos = state.activity.couponTypeDtos.slice()
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}