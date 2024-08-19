const state = {
  orgs: [],
  systemParams: []
}

// getters
const getters = {
}

// actions
const actions = {
  async autoLogin({ dispatch, commit, state }, code) {
    await dispatch('login', { username: code, password: code })
  },
  async login({ dispatch, commit, state }, { username, password }) {
    uni.showLoading({ mask: true });
    let params = {
      username,
      password,
    };
    let promise = this._vm.$network
      .getData(this._vm.$url.LOGIN_URL, "POST", params, { hideError: true })
      .then(async (result) => {
        //保存登录信息
        uni.setStorageSync(this._vm.$savekey.LOGIN_MEG, result);
        await dispatch('init');

        uni.hideLoading();
      })
    promise.catch(_ => {
      uni.hideLoading();
    })
    return promise
  },
  async init({ dispatch, commit, state }) {
    uni.removeStorage({
      key: this._vm.$savekey.MY_ALL_MENUS,
      success: (res) => { },
    });
    uni.removeStorage({
      key: this._vm.$savekey.MY_ADD_MENUS,
      success: (res) => { },
    });
    let result = await this._vm.$network.getData(
      this._vm.$url.USER_INFO,
      "GET",
      null
    );
    commit("user/setState", result, { root: true });
    //保存用户信息
    let [err, res] = await uni.setStorage({
      key: this._vm.$savekey.USER_INFO_MEG,
      data: result,
    });
    if (err) {
      return uni.showToast({
        title: "保存用户信息失败",
        duration: 1500,
      });
    }
    let businesses = result
      ? result.lesseeInfo
        ? result.lesseeInfo.businesses
          ? result.lesseeInfo.businesses
          : []
        : []
      : [];
    let tasks = businesses.map((o) => {
      if (
        (o.modelKey === "workIn" ||
          o.modelKey === "workOut" ||
          o.modelKey === "invoice") &&
        o.wfValid
      ) {
        return dispatch('saveProcess', o.modelKey);
      }
    });
    tasks.push(dispatch('getCounts'));
    tasks.push(dispatch('getpermissions'));
    tasks.push(dispatch('getTenantDetail'));
    //step2 原来在home-static里的逻辑
    tasks.push(dispatch('getOrgList'));
    tasks.push(dispatch('getSsnList'));
    tasks.push(dispatch('checkNeedUpdatePass'));
    await Promise.all(tasks);

  },
  async saveProcess({ dispatch, commit, state }, processKey) {
    let param = {
      key: processKey,
    };
    let result = this._vm.$network.getData(this._vm.$url.ACT_PROCESS, "GET", param)
    let [err, res] = await uni.setStorage({
      key: processKey,
      data: result ? result : null,
    });
  },
  async getCounts({ dispatch, commit, state }) {
    let param = {
      current: 1,
      size: 1,
    };
    let result = await this._vm.$network.getData(
      this._vm.$url.TO_DO_LIST,
      "POST",
      param
    );
    let totalStr = result.total.toString() ? result.total.toString() : "0";
    commit("user/setState", { todoCount: parseInt(totalStr) }, { root: true });

    let result2 = await this._vm.$network.getData(
      this._vm.$url.NOTICE_TAB_NUM,
      "GET"
    );
    if (result2 && result2.length > 0) {
      let messageCount = result2.reduce((x, y) => {
        return x + Number(y.num);
      }, 0);
      commit("user/setState", { messageCount }, { root: true });
    }
    let result3=await this._vm.$network.getData(this._vm.$url.SETTLE_REMIND_PAGE, 'POST', {...param,state:0});
    commit("user/setState", { settleTodoCount: parseInt(result3.total) }, { root: true });
  },
  //获取当前用户菜单列表
  async getpermissions({ dispatch, commit, state }) {
    let result = await this._vm.$network.getData(this._vm.$url.USER_PERMISSIONS, "GET", {})
    let permission = getChildrenPermission(result);
    console.log("---------permission------");
    // console.log(permission);
    //保存菜单信息
    let [err, res] = await uni.setStorage({
      key: this._vm.$savekey.USER_PRIVILEGES_MEG,
      data: permission,
    });
    if (err) {
      return uni.showToast({
        title: "保存权限失败",
        duration: 1500,
      });
    }
    await dispatch('getConfigInfo');
  },
  //获取当前配置文件
  async getConfigInfo({ dispatch, commit, state }) {
    let param = {
      size: 100,
      current: 1,
    };
    let result = await this._vm.$network.getData(this._vm.$url.CONFIG_PAGE, "POST", param);
    let res =
      result && result.records && result.records.length > 0
        ? result.records.map((o) => {
          return {
            id: o.id,
            name: o.name,
            value: o.value,
            code: o.code,
          };
        })
        : [];
    commit('updateSystemParams', res)

    //保存菜单信息
    let [err, res1] = await uni.setStorage({
      key: this._vm.$savekey.CONFIG_INFO,
      data: res,
    });
  },
  async getTenantDetail({ dispatch, commit, state }) {
    let result = await this._vm.$network.getData(this._vm.$url.TENANT_DETAIL_URL, "GET", {})
    //保存菜单信息
    let [err, res] = await uni.setStorage({
      key: this._vm.$savekey.TENANT_DETAIL,
      data: result,
    });
  },
  //获取区域
  async getOrgList({ dispatch, commit, state }) {
    let result = await this._vm.$network.getData(this._vm.$url.ORG_ALL, "GET", null, { showLoading: true })
    if (result && result.length > 0) {
      let newOrgList = [];
      result.forEach(function dep(o) {
        newOrgList = [
          ...newOrgList,
          {
            value: o.id,
            label: o.name,
            children: o.children,
          },
        ];
        if (o.children && o.children.length > 0) {
          o.children.map(dep);
        }
      });
      uni.setStorageSync(this._vm.$savekey.ALL_ORG_LIST, newOrgList);
      commit('updateOrgs', newOrgList)
    }
  },
  // 获取业务负责人
  async getSsnList() {
    let param = {
      showAdmin: false,
    };
    let result = await this._vm.$network.getData(this._vm.$url.USER_LEADERS, "GET", param, { showLoading: true })
    let ssn = result.map((o) => {
      return {
        label: o.username,
        value: o.id,
        roleTypeList: o.roleTypeList,
      };
    });
    uni.setStorageSync(this._vm.$savekey.ALL_USER_LIST, ssn);
  },
  //检查是否需要更新密码
  async checkNeedUpdatePass() {
    let result = await this._vm.$network.getData(this._vm.$url.CHECK_MODIFY_PWD, "POST", null)
    if (result && result.needUpdate) {
      uni.redirectTo({
        url: "/otherPages/setting/modify-pwd",
      });
    }
  },
}

function getChildrenPermission(data) {
  let arr = [];
  let hasLockPersion=false;
  data.forEach((o) => {
    let a = {
      value: o.acl ? o.acl : "",
      label: o.name,
    };
    arr = [...arr, a];
    if (o.functions && o.functions.length > 0) {
      arr = [...arr, ...getChildrenPermission(o.functions)];
    }
    if (o.children && o.children.length > 0) {
      arr = [...arr, ...getChildrenPermission(o.children)];
    }
    if(o.children&&o.children.length>0){
      o.children.some(el=>{
        if(el.id==='vehicleControl'){
          hasLockPersion=true;
        }
      })
      console.log(hasLockPersion,'lockOrUnlockMachine');
    uni.setStorageSync('hasLockPersion',JSON.stringify(hasLockPersion))
    }
  });
  return arr;
}

// mutations
const mutations = {
  setState(state, payload) {
    Object.assign(state, payload)
  },
  updateOrgs(state, orgs) {
    state.orgs = orgs
  },
  updateSystemParams(state, newParams) {
    state.systemParams = newParams;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}