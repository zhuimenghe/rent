import { pause } from '@/common/util/util';

const DEVICE_STATUS = {
  ON: 'on',
  MAL: 'mal',
  OFF: 'off'
}

const DEVICE_STATUS_TEXT = {
  'on': '在线',
  'off': '离线',
  'mal': '故障',
}

var inTransition = false

const state = {
  myLocation: null,
  myLocationInited: false,
  centerLatitude: 39.54,
  centerLongitude: 116.23,
  scale: 10,
  markers: [],
  polygons: [],
  circles: [],
  counts: {
    mal: 0,
    off: 0,
    on: 0,
  },
  mapCount: null,
  areas: [],
  fences: [],
  city: '全国',
  orgId: '',
  //filter popups
  filters: [
    {
      label: '区域',
      icon: 'iconshengfenzuobiao_mianxing',
      key: 'area',
      active: false
    }, {
      label: '组织',
      icon: 'iconmap-site-full',
      key: 'org',
      active: false
    }, {
      label: '列表',
      icon: 'iconjiluliebiao',
      key: 'list',
      active: false
    },
    {
      label: '围栏',
      icon: 'iconfence-full',
      key: 'fence',
      active: false
    }
  ],
  //list filter
  listStatus: 'on'
}

// getters
const getters = {
  filteredMarkers(state) {
    let { city, markers, orgId } = state
    return markers.filter(m => {
      //city
      if (city != '全国' && m.data.country != city) {
        return false
      }
      if (orgId && m.data.orgId != orgId) {
        return false
      }
      //org
      return true
    })
  },
  orgs(state, getters, rootState) {
    let orgs = rootState.global.orgs
    if (orgs && state.mapCount) {
      orgs.forEach(org => {
        let found = state.mapCount.count.orgCount.find(c => c.orgid == org.value)
        if (found) {
          org.count = found.count
        }
      })
      return orgs
    } else {
      return []
    }
  }
}

// actions
const actions = {
  async init({ dispatch, commit, state }) {
    dispatch('getMyLocation')
    dispatch('fetchCounts')
    dispatch('fetchFences')

    let result = await this._vm.$network.getData(this._vm.$url.DEVICE_MAP_DISTRIBUTION + '?timestamp=' + new Date().getTime(), 'POST', {})
    let num = 0;
    console.log(result, 'getMyLocation');
    let markers = result.map.records.filter(o => {
      return o.authorityStatus == 1;
    });
    markers = markers.map(record => {
      num++;
      let latitude = parseFloat(record.amaplatitudeNum);
      let longitude = parseFloat(record.amaplongitudeNum);
      let printCode = record.printCode
        ? record.printCode
        : record.licenseId
          ? record.licenseId
          : '--';
      let status = !record.offlineMode ? (record.warningFlag ? DEVICE_STATUS.MAL : DEVICE_STATUS.ON) : DEVICE_STATUS.OFF
      let m = {
        status,
        statusText: DEVICE_STATUS_TEXT[status],
        printCode,
        licenseId: record.licenseId,
        id: num,
        latitude: latitude,
        longitude: longitude,
        width: 35,
        height: 47,
        iconPath: `/static/device/${record.machineTypeId}-${status}.png`,
        joinCluster: true,
        customCallout: {
          display: 'BYCLICK'
        },
        data: record
      };
      return m;
    });
    // 按离线时长逆序排列
    markers.sort((m1, m2) => {
      return m2.data.offlineHours - m1.data.offlineHours
    })
    let areas = [{ count: markers.length, city: '全国' }]

    let mapCount = await this._vm.$network.mapCount();
    areas = areas.concat(mapCount.count.areaCount)

    commit('setState', { markers, areas, mapCount })
  },
  getMyLocation({ dispatch, commit, state }) {
    console.log('cur mylocation:', state.myLocation);
    if (!state.myLocation) {
      uni.getLocation({
        type: 'gcj02',
        success: function (res) {
          console.log('mylocation:', res);
          let centerLatitude = res.latitude
          let centerLongitude = res.longitude
          commit('setState', { myLocation: res, centerLatitude, centerLongitude })
          // setTimeout(() => {
          //   console.log('timeout update mylocation:', res);
          //   commit('setState', { myLocation: res, centerLatitude, centerLongitude })
          // }, 700);
        },
        fail: function (err) {
          console.error(err)
          wx.openSetting({
            success(res) {
              console.log(res.authSetting)
            }
          })
        },
        complete: function () {
          commit('setState', { myLocationInited: true })
        }
      });
    } else {
      let centerLatitude = state.myLocation.latitude
      let centerLongitude = state.myLocation.longitude
      commit('setState', { centerLatitude, centerLongitude, myLocationInited: true })
    }
  },
  async fetchCounts({ dispatch, commit, state }) {
    let result = await this._vm.$network.getData(this._vm.$url.DEVICE_MAP_CLAC, 'GET', null);
    let counts = {
      mal: 0,
      off: 0,
      on: 0,
      all: 0
    };
    if (Array.isArray(result) && result.length >= 4) {
      counts.mal = result[1]?.total || 0;
      counts.off = result[3]?.total || 0;
      counts.on = result[0]?.total - counts.off;
      counts.all = result[0]?.total || 0;
    } else {
      console.error("Unexpected result format or length");
    }
    commit('setState', { counts });
  },
  async fetchFences({ dispatch, commit, state }) {
    let res = await this._vm.$network.fenceList({ current: 1, size: 1000, type: 'temp' });
    commit('setState', { fences: res.records })
  },
  async closeAllFilters({ dispatch, commit, state }) {
    //有打开的需要时关闭，再打开新的
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
  updateFence(state, fence) {
    state.circles = []
    state.polygons = []
    if (fence.pathType == '0') {//圆
      state.circles = [{
        latitude: fence.latitude,
        longitude: fence.longitude,
        color: '#e60000', fillColor: '#E600001A',
        radius: fence.radius
      }]
    } else {
      state.polygons = [{
        points: fence.pathJsonList,
        strokeColor: '#e60000', fillColor: '#E600001A'
      }]
    }
    state.centerLatitude = fence.latitude
    state.centerLongitude = fence.longitude
    state.scale = 16
  },
  navToDevice(state, { centerLatitude, centerLongitude }) {
    state.centerLatitude = centerLatitude
    state.centerLongitude = centerLongitude
    state.scale = 18
    state.city = '全国'
    state.orgId = ''
  },
  updateCity(state, city) {
    state.city = city
    state.scale = 3
  },
  updateOrg(state, orgId) {
    state.orgId = orgId
    state.scale = 3
  },
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