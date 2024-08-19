import http from './interface'
import * as urlConstant from './url-constant.js'
import * as apiMachine from './modules/machineapi'
import * as apiConfig from './modules/configapi'
import * as apiUser from './modules/userapi'
import * as apiContract from './modules/contractapi'
import * as apiCost from './modules/costapi'
import * as apiCoupon from './modules/couponapi'

import * as apiSettlement from './modules/settleapi'
export * from './modules/contractapi'
export * from './modules/costapi'
export * from './modules/machineapi'
export * from './modules/configapi'
export * from './modules/couponapi'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
const getData = function (url, method, data, options = {}) {
  if (method === "GET") {
    return http.get(url, data, options)
  } else if (method === "POST") {
    return http.post(url, data, options);
  } else if (method === "PUT") {
    return http.put(url, data, options)
  } else if (method === "DELETE") {
    return http.delete(url, data, options)
  } else {
    return http.request({
      url,
      method,
      data,
      ...options
    })
  }
};
//获取配置类型
const loadType = function (type) {
  let url = urlConstant.MACHINE_TYPE + type;
  return getData(url, 'GET', null);
}
const loadUserType = function (type) {
  let url = urlConstant.USER_SYS_DICT + type;
  return getData(url, 'GET', null);
}

const loadDic = function (type) {
  let param = {
    "type": type,
    size: 1000
  }
  return getData(urlConstant.CUR_SYS_DICT, 'POST', param);
}
const rentalPag = function (type, success, fail) {
  let param = {
    "current": 1,
    "size": 200,
    "uploadType": "template",
  }
  getData(urlConstant.RENTAL_PAG_SAVE, 'POST', param).then(result => {
    let list = result && result.records ? [...result.records] : [];
    if (list.findIndex((item) => { return item.type == type }) == -1) {
      fail("尚未配置模板,请联系管理员处理")
    } else {
      success()
    }
  }).catch(err => {
    fail("请求失败,请稍后重试...")
  });
}

export const loadList = async ({ size = 10, list, payload, requestHandler, refresh, showLoading = false }) => {
  let current = list && list.length ? Math.floor(list.length / size) + 1 : 1
  if (refresh === true) {
    current = 1
    list = []
  }
  let querys = { current, size, ...payload }
  let resp = await requestHandler(querys, showLoading)
  let total = resp.total
  list = list.concat(resp.records)
  let noMore = resp.records.length < size
  let morestatus = noMore ? (list.length ? 'noMore' : '') : 'more'
  return { list, noMore, morestatus, total }
}

export default {
  getData,
  loadType,
  loadUserType,
  loadDic,
  rentalPag,
  loadList,
  ...apiMachine,
  ...apiUser,
  ...apiContract,
  ...apiCost,
  ...apiSettlement,
  ...apiConfig,
  ...apiCoupon,
}