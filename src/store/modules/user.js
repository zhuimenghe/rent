import manifest from '@/manifest.json';
const state = {
  mnOpenid:'',//小程序openid
  oaOpenid:'',//公众号openid
  todoCount:0,
  settleTodoCount:0,
  messageCount:0,
  workoutDic:{},
  contactDuties:[],
  lesseeInfo:{
    identifier:''
  }
}

// getters
const getters = {
}

// actions
const actions = {
  changeWorkOutDic({dispatch,commit,state},vals){
    commit('changeWorkOutDic',vals)
  },
  async initContactDuties({ commit },val) {
    commit("setState", {contactDuties:val});
  },
}

// mutations
const mutations = {
  setState(state, payload) {
    Object.assign(state,payload)
  },
  changeWorkOutDic(state,val){
    state.workoutDic=val;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}