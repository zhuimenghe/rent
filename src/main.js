import Vue from 'vue'
import App from './App'
import network from '@/network/'
import log from '@/common/common-method/log'
import uniNavBar from "@/components/common/uni-nav-bar/nav-bar.vue"
import uniNavBarSearch from '@/components/common/uni-nav-bar/nav-bar-search.vue';
import mycheckbox from '@/components/common/check-box/check-box.vue';
import badgeBottom from '@/components/common/common-ui/brige-bottom.vue'
import businessTips from '@/components/common/common-ui/business-tip.vue';
import i18n from './common/i18n/i18n'
import * as urlConstant from './network/url-constant.js'
import * as savekey from './common/common-method/save-key.js'
import datestr from '@/common/common-method/common-method.js'
import gxfmethod from '@/common/common-method/common-gxf-method.js'
import workflowcommon from '@/common/common-method/work-flow-common.js'
import moneyUtil from '@/common/util/cal-rent-money.js'
import dateUtil from '@/common/util/day-working-hours.js'
import * as eventId from '@/common/common-method/eventid-const.js'
import '@/filter'
// import commonJudge from '@/common/common-method/common-judge.js'
Vue.component('mycheckbox', mycheckbox)
Vue.component('badgeBottom', badgeBottom)
Vue.component('nav-bar', uniNavBar)
Vue.component('nav-bar-search', uniNavBarSearch)
Vue.component('businessTips', businessTips)

/* #ifdef H5 */
import unih5 from '@dcloudio/uni-h5/dist/index.css'
/* #endif */

//mixins
import share from './mixins/share.js';
import systemInfo from './mixins/systemInfo.js';
Vue.mixin(share)
Vue.mixin(systemInfo)

Vue.config.productionTip = false
Vue.prototype.$network = network
Vue.prototype._i18n = i18n
Vue.prototype.$url = urlConstant
Vue.prototype.$datestr = datestr
Vue.prototype.$gxfmethod = gxfmethod
Vue.prototype.$savekey = savekey
Vue.prototype.workflowcommon = workflowcommon
Vue.prototype.moneyUtil = moneyUtil
Vue.prototype.$dateUtil = dateUtil
Vue.prototype.$eventId = eventId
// Vue.prototype.commonJudge = commonJudge

import store from './store'

// #ifdef MP
import BeaconAction from '@/common/libs/tgp_mini_sdk.min.js'
// 上报成功回调，可根据实际业务调整，这里给到一种打印到控制台的方案
const success = e => {
  // console.log('onReportSuccess : ' + e);
};
// 上报失败回调，可根据实际业务调整，这里给到一种打印到控制台的方案
const fail = e => {
  console.log('onReportFail : ' + e);
};
const beacon = new BeaconAction({
  appkey: process.env.NODE_ENV === 'production' ? 'L96VLDYK2BC75F43' : 'LBFTVF8R32KA4NU3', //小程序appKey,必填  
  reportUrl: 'https://ubap-report.sany.com.cn/logserver/analytics/upload?tp=weapp', // 必须填写上报地址！否则会导致上报失败。
  versionCode: '', //小程序版本号，选填  
  channelID: '', //小程序渠道号，选填  
  openid: '', // 用户标示符号，选填  
  unionid: '', // 用户唯一标示符号，选填  
  delay: 5000, // 普通事件延迟上报时间(单位毫秒), 默认5000(5秒),选填 
  maxDBCount: 500, // 设置存储最大条数, 默认 500(条), 设置区间 500-5000，选填
  onPullDownRefresh: true,//下拉刷新事件统计，默认 开启，选填  
  onReachBottom: true,//页面下拉触底统计，默认 开启，选填  
  onReportSuccess: success, // 上报成功回调，选填  
  onReportFail: fail, // 上报失败回调，选填  
});
// #endif

App.mpType = 'app'
const app = new Vue({
  i18n,
  ...App,
  store
})
app.$mount()