/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */

/*
// 开放的接口
import http from './interface'

http.config.baseUrl = "http://localhost:8080/api/"

http.request(url:'user/list',method:'GET').then((res)=>{
  console.log(JSON.stringify(res))
})
http.get('user/list').then((res)=>{
  console.log(JSON.stringify(res))
})
http.get('user/list', {status: 1}).then((res)=>{
  console.log(JSON.stringify(res))
})
http.post('user', {id:1, status: 1}).then((res)=>{
  console.log(JSON.stringify(res))
})
http.put('user/1', {status: 2}).then((res)=>{
  console.log(JSON.stringify(res))
}) 
http.delete('user/1').then((res)=>{
  console.log(JSON.stringify(res))
}) 

*/

import * as urlConstant from './url-constant.js'
import * as savekey from "../common/common-method/save-key.js"
import cm, {
  queryStringfy
} from '@/common/common-method/common-method'

const whiteList401 = [
  'machineapi/api/machine/overall',
  'contractapi/api/customer/getCustomerCount',
  'contractapi/api/workflow/actTask/todoList',
  'machineapi/api/machineRemind/taskTodoCount',
  'settleapi/api/receivable/statistics',
  'userapi/api/auth/user/getAppPermissionsByUserId',
  'userapi/api/notice/warningListAndUnreadCount',
  'userapi/api/auth/user/checkNeedUpdatePass',
  'userapi/api/auth/user/list',
  'userapi/api/auth/org/all',
  'weixinapi/wechat/code2Session',
]

const loginPageRoute = 'pages/login'

// 请求地址
let urlstr = urlConstant.BASE_URL
// 配置请求头
async function backHeader(url) {
  let ContentType = 'application/json';
  let Authorization = '';
  if (url === urlConstant.ESIGN_START_FLOW) {
    ContentType = 'application/x-www-form-urlencoded';
  }
  if (url === urlConstant.LOGIN_URL || url.indexOf(urlConstant.CHECK_UPDATE_URL) != -1 || url === urlConstant
    .DOWNLOAD_APK_URL) {
    ContentType = 'application/x-www-form-urlencoded';
    Authorization = ""
  } else {
    let app = getApp()
    let loginPromise = app && app.globalData.loginPromise
    if (loginPromise && ![urlConstant.USER_PERMISSIONS, urlConstant.LOGIN_URL, urlConstant.CONFIG_PAGE,
    urlConstant.TENANT_DETAIL_URL, urlConstant.ORG_ALL, urlConstant.USER_LEADERS, urlConstant
      .CHECK_MODIFY_PWD, urlConstant.USER_INFO, urlConstant.ACT_PROCESS, urlConstant.TO_DO_LIST,
    urlConstant.NOTICE_TAB_NUM
    ].includes(url)) {
      await loginPromise.catch(_ => { })
    }
    let loginMes = uni.getStorageSync(savekey.LOGIN_MEG);
    if (loginMes) {
      let access_token = loginMes.token_type + " " + loginMes.access_token;
      Authorization = access_token;
    }
  }
  let res = uni.getSystemInfoSync();
  let system = res.system ? res.system : "";
  let model = res.model ? res.model : "";
  let deviceNum = res.deviceId ? res.deviceId : "";
  let versionstr = uni.getStorageSync("version");
  let headerDic = {
    'Content-Type': ContentType,
    'Authorization': Authorization,
    "app_version": versionstr,
    "client_source": "2",
    "client_version": system,
    "client_type": model,
    "devcie_num": deviceNum
  };
  return headerDic;
}
let requestCount = 0
export default {
  config: {
    baseUrl: urlstr,
    header: {},
    dataType: "json",
    /* 如设为json，会对返回的数据做一次 JSON.parse */
    success() { },
    fail() { },
    complete() { }
  },
  interceptor: {
    request: null,
    response: null
  },
  async request(options) {
    // requestList showloading
    if (options.showLoading) {
      if (requestCount <= 0) {
        requestCount = 0
        uni.showLoading({
          mask: true
        })
      }
      requestCount++;
    }

    if (!options) {
      options = {}
    }
    this.config.header = await backHeader(options.url);
    this.config.header.contentType = options.contentType || this.config.header.contentType
    if (options.url.indexOf('http') == -1 && options.url.indexOf('https') == -1) {
      options.url = this.config.baseUrl + options.url
    }
    options.dataType = options.dataType || this.config.dataType;
    options.data = options.data || {};
    if (!options.disableAbandonDictionary) {
      console.log(options, 'disableAbandonDictionary');
      options.data = cm.abandonDictionary(options.data);
    }
    options.method = options.method;
    options.header = this.config.header;
    let urlList = [];
    return new Promise((resolve, reject) => {
      let _config = null
      options.complete = (response) => {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let customToast = currentPage.$vm.$refs.customToast
        //requestList  hideloading
        if (options.showLoading) {
          let delay = options.hideLoadingDelay || 150
          setTimeout(() => {
            requestCount--
            if (requestCount <= 0) {
              uni.hideLoading()
            }
          }, delay);
        }

        let statusCode = response.statusCode
        response.config = _config
        if (response.config.responseType == 'arraybuffer') { //下载arraybuffer
          return resolve(response);
        }
        if (process.env.NODE_ENV === 'development') {
          // if (urlList.findIndex(o => o.url == _config.url) != -1) {
          // 	let index = urlList.findIndex(o => o.url == _config.url)

          // 	let obj = urlList.find(o => o.url == _config.url)
          // 	let end = new Date().getTime()
          // 	console.log("请求地址【" + obj.url + "】 请求时间：【" + (end - obj.start) + " ms】")
          // 	urlList.splice(index, 1);
          // }
          if (statusCode === 200) {
            // console.log(JSON.stringify(options))
            // console.log("请求地址【" + _config.url + "】" + "请W求地址【" + _config.requestId + " 】【 结果：】" + JSON.stringify(response.data))

          }
        }
        if (this.interceptor.response) {
          let newResponse = this.interceptor.response(response)
          if (newResponse) {
            response = newResponse
          }
        }
        // 统一的响应日志记录
        // _reslog(response)x
        if (statusCode === 200) { //成功
          let res = response.data;
          if (res.code == 200) {
            let result = null
            if (res.hasOwnProperty("result")) {
              result = res.result;
            } else if (res.hasOwnProperty("data")) {
              result = res.data;
            }
            resolve(result);
          }else {
            let message = (res && res.message) || '系统错误';
            if (res.code === 50003 || res.code === 50000)
              message = res.message + "：" + res.details.join(",");
            if (!options.hideError) {
              if(customToast){
                uni.hideLoading()//uni.showToast会顶掉loading，自定义不会，防止外面写了loading没有hide
                customToast.showModal({
                  title:'异常',
                  content:message,
                  confirmButtonStyle:  "primary",
                  cancelButtonStyle: "text",
                });
              }else{
                setTimeout(() => {
                  uni.showToast({
                    title: message,
                    icon: 'none'
                  })
                }, 150);
              }
            };
            reject(res)
          }
        } else if (statusCode === 401) {
          if (whiteList401.some(e => options.url.includes(e))) {
            reject(statusCode)
            //啥也不做
          } else {
            reject(statusCode)
            // uni.showToast({title:'登陆状态失效',icon:'none'})
            //登录页401不用跳转了
            if (currentPage.route != loginPageRoute) {
              console.log('401 redirect options', currentPage.options)
              let redirectUrl = encodeURIComponent('/' + currentPage.route + '?' + queryStringfy(currentPage.options, false))
              console.log('401 redirect url', redirectUrl)
              uni.reLaunch({
                url: `/${loginPageRoute}?redirectUrl=${redirectUrl}`
              })
            }
          }
        } else {
          console.log('response：', response)
          let msg = (response.data && response.data.message) || response.errMsg
          if (msg && !options.hideError) {
            if(customToast){
              uni.hideLoading()
              customToast.showModal({
                title:'异常',
                content:msg,
                confirmButtonStyle:  "primary",
                cancelButtonStyle: "text",
              });
            }else{
              setTimeout(() => {
                uni.showToast({
                  title: 'code:' + statusCode + ';msg:' + msg,
                  icon: 'none',
                })
              }, 150);
            }
          }
          reject({
            ...response,
            code: statusCode
          })
        }
      }
      _config = Object.assign({}, this.config, options)
      _config.requestId = new Date().getTime()
      if (this.interceptor.request) {
        this.interceptor.request(_config)
      }
      // 统一的请求日志记录
      // _reqlog(_config)
      // if (process.env.NODE_ENV === 'development') {
      // 	console.log("【" + _config.requestId + "】 地址：" + _config.url)
      // 	if (_config.data) {
      // 		console.log("【" + _config.requestId + "】 参数：" + JSON.stringify(_config.data))
      // 	}
      // }
      if (process.env.NODE_ENV === 'development') {
        urlList.push({
          url: _config.url,
          start: new Date().getTime()
        })
      }
      // console.log('"请求配置【'+JSON.stringify(options)+'】')
      uni.request(_config);
    });
  },
  get(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  },
  post(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'POST';

    return this.request(options)
  },
  put(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options)
  },
  delete(url, data, options) {
    if (!options) {
      options = {}
    }
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options)
  }
}