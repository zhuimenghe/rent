import { pause } from '@/common/util/util';
import { constructionMapAreas, constructionMapSites } from '@/network/modules/machineapi'


var inTransition = false

const state = {
  markers: [],
  counts: {
    warehouse: 0,
    construction: 0
  },
  areas: [],
  city: '',
  //filter popups
  filters: [
    {
      label: '区域',
      icon: 'iconshengfenzuobiao_mianxing',
      key: 'area',
      active: false
    }, {
      label: '列表',
      icon: 'iconjiluliebiao',
      key: 'list',
      active: false
    }
  ],
  query: '',
  //list filter
  listStatus: 'warehouse'
}

// getters
const getters = {
  // filteredMarkers(state) {
  //   let { city, markers } = state
  //   return markers.filter(m => {
  //     //city
  //     if (city != '全国' && m.data.country != city) {
  //       return false
  //     }
  //     //org
  //     return true
  //   })
  // }
}

// actions
const actions = {
  async init({ dispatch, commit, state }) {
    dispatch('fetchAreas')
    dispatch('fetchList')
  },
  async fetchAreas({ dispatch, commit, state }) {
    let result = await constructionMapAreas()
    let areas = result.map(r => ({ ...r, count: r.addressNumber }))
    commit('setState', { areas })
  },
  async fetchList({ dispatch, commit, state }) {
    uni.showLoading();
    let params = {
      name: state.query,
      area: state.city
    }
    let res = await constructionMapSites(params)
    let num = 0;
    let markers = res.sites.map(r => {
      num++;
      let latitude = parseFloat(r.latitude);
      let longitude = parseFloat(r.longitude);
      r.isHome = r.isHome == 1
      let content = r.deviceNumber + ''
      let numLength = content.length
      let size = 19 + numLength * 7;
      let m = {
        id: num,
        isHome: r.isHome,
        latitude: latitude,
        longitude: longitude,
        label: {
          content,
          anchorX: -(0.5 * (numLength * 14 * 0.5)),
          anchorY: -(size / 2) - 8,
          // textAlign:'center',
          color: r.isHome ? '#1278FF' : '#52C41A',
          fontSize: 13,
        },
        width: size,
        height: size,
        iconPath: `/static/device/${r.isHome ? 'blue' : 'green'}-circle.png`,
        joinCluster: false,
        data: r
      };
      return m;
    });

    let counts = {
      warehouse: res.totalHome || 0,
      construction: res.totalSite || 0
    }

    commit('setState', { counts, markers })
    uni.hideLoading();
  },
  async updateCity({ dispatch, commit, state }, city) {
    commit('setState', { city })
    await dispatch('fetchList')
    commit('map/setState', { scale: 3 }, { root: true })
  },
  async closeAllFilters({ dispatch, commit, state }) {
    //有打开的需要时间关闭，再打开新的
    let timeout = !!state.filters.find(f => f.active) ? 150 : 0
    state.filters.forEach(f => f.active = false)
    commit('setState', { filters: state.filters })
    await pause(timeout)
  },
  async toggleFilter({ dispatch, commit, state }, f) {
    if (!inTransition) {
      inTransition = true
      let old = f.active
      await dispatch('closeAllFilters')
      let found = state.filters.find(e => e.key == f.key)
      found.active = !old
      commit('setState', { filters: state.filters })
      inTransition = false
    }
  },
  async openListFilter({ dispatch, commit, state }, status) {
    let found = state.filters.find(e => e.key == 'list')
    if (!found.active) {
      //没打开，关闭其他，打开list
      await dispatch('closeAllFilters')
      found.active = true
    }
    let listStatus = status || state.listStatus
    commit('setState', { filters: state.filters, listStatus })
  }
}

// mutations
const mutations = {
  setState(state, payload) {
    Object.assign(state, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}