import manifest from '@/manifest.json';

const state = {
  ratio: 0,
  systemInfo: {},
  statusBarHeight: 25,
  tabBarHeight: 0,
  titleBarHeight: 0,
  navBarHeight: 0,
  menuBtnRect: {},
  version: '1.0.0',
  versionCode: 100
}

// getters
const getters = {
}

// actions
const actions = {
  async init({ dispatch, commit, state }) {
    let [err, e] = await uni.getSystemInfo();
    let s = {}
    s.ratio = 750 / e.windowWidth;
    s.systemInfo = e;
    // #ifndef MP
    s.canPay = true;
    // #endif
    // #ifdef MP
    s.canPay = e.platform != "ios";
    // #endif
    s.statusBarHeight = e.statusBarHeight;
    if (e.platform == "android") {
      s.titleBarHeight = 48;
    } else {
      s.titleBarHeight = 44;
    }
    // #ifdef MP-WEIXIN||MP-TOUTIAO
    s.menuBtnRect = uni.getMenuButtonBoundingClientRect();
    s.titleBarHeight =
      s.menuBtnRect.bottom +
      s.menuBtnRect.top -
      2 * e.statusBarHeight;
    // #endif
    // #ifdef MP-ALIPAY
    s.titleBarHeight = e.titleBarHeight;
    // #endif
    s.navBarHeight = s.titleBarHeight + s.statusBarHeight

    //version
    s.version = manifest.versionName
    s.versionCode = manifest.versionCode

    console.log(s);
    commit("setState", s);

    return s
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