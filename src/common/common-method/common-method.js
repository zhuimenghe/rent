import * as savekey from './save-key.js'
import { reverseGeo } from '@/network/modules/machineapi'
import format from 'date-fns/format';
//秒数转小时+分钟
const getDateStr = function (times) {
  let h
  let m
  h = Math.floor(times / 3600)
  m = Math.floor((times % 3600) / 60)
  if (m) {
    return h + '小时' + m + '分钟'
  } else {
    return h + '小时'
  }
};
const dateFormat = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!(date instanceof Date)) {
    return date
  }
  return format(date, fmt)
  // let o = {
  // 	'M+': date.getMonth() + 1, // 月份
  // 	'd+': date.getDate(), // 日
  // 	'h+': date.getHours(), // 小时
  // 	'm+': date.getMinutes(), // 分
  // 	's+': date.getSeconds(), // 秒
  // 	'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
  // 	'S': date.getMilliseconds() // 毫秒
  // }
  // if (/(y+)/.test(fmt)) {
  // 	fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  // }
  // for (let k in o) {
  // 	if (new RegExp('(' + k + ')').test(fmt)) {
  // 		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k])
  // 			.length)))
  // 	}
  // }
  // return fmt
}
const timeTransform = (time, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  return dateFormat(new Date(time), fmt)
}
//计算最近一周的时间点
const getDateRange = function (dateNow, intervalDays, bolPastTime, styleStr) {
  let oneDayTime = 24 * 60 * 60 * 1000;
  let lastDayNum;
  let lastDay = '';
  if (bolPastTime == true) {
    lastDayNum = new Date(dateNow.getTime() - intervalDays * oneDayTime);
  } else {
    lastDayNum = new Date(dateNow.getTime() + intervalDays * oneDayTime);
  }
  let year = lastDayNum.getFullYear();
  let month = lastDayNum.getMonth() + 1;
  let day = lastDayNum.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (styleStr == 'yyyy-MM-dd hh:mm:ss') {
    lastDay = year + '-' + month + '-' + day + ' 00:00:00';
  } else if (styleStr == 'MM/dd') {
    lastDay = month + '/' + day;
  } else {
    lastDay = year + '-' + month + '-' + day;
  }
  return lastDay;
}
const getnowdate = function () {
  let date = new Date;
  let year = date.getFullYear(); //当前年份
  let month = date.getMonth() + 1; //当前的月份(0-11,0代表1月) 
  let days = date.getDate(); //当前的星期X(0-6,0代表星期天) 
  if (month < 10) {
    month = "0" + month;
  }
  if (days < 10) {
    days = "0" + days;
  }
  return year + "-" + month + "-" + days;
}
const doubleFloat = function (num) {
  if (num == undefined) {
    return ""
  } else {
    let fixednum = Number(num);
    // 取消保留两位小数
    let finishnum = fixednum.toFixed(0);
    return finishnum.toString();
  }
}
const printlog = function (log) {
  // console.log(log)
}
const isphonenum = function (num) {
  //验证手机格式
  let str = num;
  let reg = /^1\d{10}$/;
  // let reg = /^1(3[0-9]|4[5,7,9]|5[0-9]|6[2,5,6,7]|7[1-3,5-9]|8[0-9]|9[1,8,9])\d{8}$/;
  if (!reg.test(str)) {
    return false;
  }
  return true
}
const isemail = function (email) {
  //验证邮箱格式
  let str1 = email;
  let reg1 = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (!reg1.test(str1)) {
    return false;
  }
  return true
}
const isIdCard = function (idcode) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  // let reg = /(^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$)/;
  //           // /(^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
  // 		  ///(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
  // if (!reg.test(card)) {
  // 	return false;
  // }
  // return true
  let weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let check_code = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
  let code = idcode + "";
  let last = idcode[17]; // 最后一位
  let seventeen = code.substring(0, 17);
  let arr = seventeen.split("");
  let len = arr.length;
  let num = 0;
  for (let i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }
  // 获取余数
  let resisue = num % 11;
  let last_no = check_code[resisue];
  let idcard_patter =
    /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
  // 判断格式是否正确
  let format = idcard_patter.test(idcode);
  return !!(last === last_no && format);
}
//判断两个时间点的大小
/**
 * @param {Object} date1
 * @param {Object} date2
 * 前一个时间点大于后一个时间点 1
   小于 -1
   等于0
 */
const timedifferent = function (date1, date2) {
  let start = new Date(date1.replace(/-/g, "/").replace(/-/g, "/"));
  let end = new Date(date2.replace(/-/g, "/").replace(/-/g, "/"));
  if (start.getTime() == end.getTime()) {
    return 0;
  } else if (start.getTime() > end.getTime()) {
    return 1;
  } else if (start.getTime() < end.getTime()) {
    return -1;
  }
}
//获取时间格式当前
const getnowDate = function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let Minutes = date.getMinutes();
  let Seconds = date.getSeconds();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (Minutes < 10) {
    Minutes = "0" + Minutes;
  }
  if (Seconds < 10) {
    Seconds = "0" + Seconds;
  }

  return year + '-' + month + '-' + day + " " + hours + ":" + Minutes + ":" + Seconds;
}
//时间点到现在的时间差
const gettimedifferencenow = function (date1) {
  let start = new Date(date1.replace(/-/g, "/").replace(/-/g, "/"));
  let end = new Date();
  let secondcount = end.getTime() - start.getTime()
  return secondcount
}
const gettimedifference = function (date1, date2) {
  let start = new Date(date1.replace(/-/g, "/").replace(/-/g, "/"));
  let end = new Date(date2.replace(/-/g, "/").replace(/-/g, "/"));
  let secondcount = end.getTime() - start.getTime()
  return secondcount
}
const isSame = function (a, b) {
  if (a.length === 0 && b.length === 0) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  let length = 0;
  a.forEach(o => {
    if (b.some(y => y === o)) {
      length = length + 1;
    }
  });
  return a.length === length;
}


const getOrgIdList = function (orgDic) {
  let orgIdList = [];
  if (orgDic && orgDic.value != "") {
    if (orgDic.value && orgDic.value != "") {
      if (orgDic.value.indexOf(",") != -1) { //多区域
        orgIdList = orgDic.value.split(",")
      } else {
        orgIdList = [orgDic.value];
      }
    }
    if (orgDic.children && orgDic.children.length > 0) {
      orgDic.children.forEach(function dep(o) {
        orgIdList = [...orgIdList, o.id];
        if (o.children && o.children.length > 0) o.children.map(dep);
      })
    } else {
      orgIdList = [orgDic.value]
    }
  }
  return orgIdList
}

/* 舍弃字典中value为空的键值对 */
const abandonDictionary = function (dict) {
  if (!dict || Array.isArray(dict)) {
    return dict
  }
  let keys = {};
  Object.keys(dict).forEach(o => {
    let val = dict[o];
    if (
      (getType(val) === "Array" && val.length > 0) ||
      (getType(val) !== "Array" && (val || val == 0)) ||
      getType(val) === "Boolean"
    ) {
      keys[o] = val;
    }
  });
  return keys;
};

const getType = o => {
  return Object.prototype.toString.call(o).replace(/(\[object\s|\])/g, "");
};

//----------------------------下载只需要传入url
const downFunc = function (url) {
  let headerDic = {
    'Content-Type': 'application/json',
    'Authorization': '',
  };
  let loginMes = uni.getStorageSync(savekey.LOGIN_MEG);
  if (loginMes) {
    let access_token = loginMes.token_type + " " + loginMes.access_token;
    headerDic.Authorization = access_token;
  } else {
    uni.hideLoading()
    return null
  }
  let downloadTask = uni.downloadFile({
    url: url,
    header: headerDic,
    success: (res) => {
      console.log(res)
      let filePath = res.tempFilePath;
      uni.openDocument({
        filePath: filePath,
        // fileType: 'pdf',
        showMenu: true,
        success: function (res) {
          console.log(res);
          console.log('打开文档成功');
          uni.hideLoading()
        },
        fail: (error) => {
          uni.showToast({
            icon: "none",
            title: "列表导出失败"
          })
        }
      });
    },
    fail: (error) => {
      console.log(error)
      uni.showToast({
        icon: "none",
        title: "列表导出失败"
      })
    }
  });
  return downloadTask ? downloadTask : null;
}

const getUrlApi = processKey => {
  let pk = processKey ? processKey : '';
  let urlapi = '';
  switch (pk) {
    case 'claim':
    case 'serviceClaim':
    case 'workOut':
    case 'contract':
    case 'pause':
    case 'servicePause':
    case 'contractChange':
    case 'contractPlus':
    case 'claimAdjust':
    case 'pauseAdjust':
    case 'commonApprove':
    case 'workIn':
    case 'workInOut':
    case 'expressContract':
    case 'expressWorkOut':
    case 'expressWorkIn':
      urlapi = 'contractapi';
      break;
    case 'invoice':
    case 'proceeds':
    case 'refund':
    case 'settlement':
    case 'statement':
    case 'settle':
    case 'settlementApply':
    case 'contractDiscounts':
      urlapi = 'settleapi';
      break;
    case 'allot':
    case 'allocation':
    case 'maintenance':
    case 'purchase':
    case 'repair':
    case 'checkRepair':
    case 'sublet':
    case 'insurance':
    case 'inspection':
    case 'batteryPatrol':
      urlapi = 'machineapi';
      break;
    case 'partsStorage':
    case 'partsCollar':
    case 'partsReturn':
    case 'partsAllocation':
    case 'partsUnitPrice':
      urlapi = 'partsapi';
      break;
    default:
      urlapi = 'contractapi';
      break;
  }
  return urlapi;
}


/**
 * 获取url参数的值
 * @param {Object} name 参数名
 * @param {Object} url 地址
 */
const getQueryString = (name, url) => {
  let rs = new RegExp("(^|)" + name + "=([^&]*)(&|$)", "gi").exec(url);
  if (rs) {
    return decodeURI(rs[2]);
  }
  return null;
}


export const queryStringfy = function (obj, encode = true) {
  return Object.keys(obj).map((key) => {
    let data = obj[key] || '';
    if (Array.prototype.toString.call(data) !== '[object String]') {
      data = JSON.stringify(data);
    }
    return `${key}=${encode ? encodeURIComponent(data) : data}`;
  }).join('&');
}

//获得当前用户ID
const getUserId = () => {
  let res = uni.getStorageSync(savekey.USER_INFO_MEG)
  return res.id

}

const getNowDateHalf = function () {

  let date = new Date();
  let year = date.getFullYear(); //当前年份
  let month = date.getMonth() + 1; //当前的月份(0-11,0代表1月) 
  let days = date.getDate(); //当前的星期X(0-6,0代表星期天) 
  let hour = date.getHours(); //获取系统时间
  let minute = date.getMinutes(); //分
  let second = date.getSeconds(); //秒

  //当前截止到分的时间戳
  let minuteTimes = date.getTime() - (minute * 60 * 1000) - (second * 1000)

  if (minute > 15 && minute < 45) {
    minuteTimes += (30 * 60 * 1000);
  }
  if (minute > 45) {
    minuteTimes += (60 * 60 * 1000);
  }
  return timeTransform(minuteTimes)

}
//获取顶请求头
const getRequestHeader = function () {
  let headerDic = {
    'Content-Type': 'application/json'
  };
  let loginMes = uni.getStorageSync(savekey.LOGIN_MEG);
  if (loginMes) {
    let access_token = loginMes.token_type + " " + loginMes.access_token;
    headerDic.Authorization = access_token;
  }
  return headerDic;
}

/**
 * 进退场是否可以启动电签
 * isAddESign   启动电签权限
 * @param {Object} flowStatus ：电签状态
 * @param {Object} state 合同状态
 * @param {Object} eSignConfig 电签配置
 */
const isStartESignAdd = (isAddESign, flowStatus, state) => {
  // let eSignConfig = null
  // let resData = uni.getStorageSync(savekey.CONFIG_INFO)
  // if (resData) {
  //   eSignConfig = resData.find(o => o.code == 'work_start_esign_node') //进退场启动电签节点
  // }
  if (isAddESign && (!flowStatus ||
    // flowStatus == '0' ||
    flowStatus == '3' ||
    flowStatus == '5' ||
    flowStatus == '7')) {
    // let eSignStartNode = eSignConfig && eSignConfig.value ? eSignConfig.value : null;
    // // 1. adopt 合同审批通过后启动。    2.  apply 合同申请后即可启动。
    // if (!eSignStartNode || eSignStartNode == "adopt") { //审批完成
    //   return state != "1" && state != "0" ? true : false;
    // } else if (eSignStartNode == "apply") {
    //   return true
    // };
    // return false;
    return true
  }
  return false;
}
const timeLeft = function (date1, date2) {
  let end = new Date(date1.replace(/-/g, "/").replace(/-/g, "/"));
  let start = new Date(date2.replace(/-/g, "/").replace(/-/g, "/"));
  let left = start.getTime() - end.getTime();
  let days = left / (1000 * 3600 * 24)
  return days;
}

const convertHexToRGB = function (color) {
  if (color.length === 4) {
    let extendedColor = '#';
    for (let i = 1; i < color.length; i++) {
      extendedColor += color.charAt(i) + color.charAt(i);
    }
    color = extendedColor;
  }
  const values = {
    r: parseInt(color.substr(1, 2), 16),
    g: parseInt(color.substr(3, 2), 16),
    b: parseInt(color.substr(5, 2), 16)
  };
  return `${values.r}, ${values.g}, ${values.b}`;
}
//验证密码是否符合规则：字母（区分大小写）、数字、特殊符号8-20
const checkPwd = function (pwd) {
  console.log('--------------' + pwd)
  let regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&.,])[A-Za-z\\d@$!%*#?&.,]{8,20}$");
  if (!regex.test(pwd)) {
    return false;
  }
  return true
}

const copy = function (data, successToast = '复制成功') {
  // #ifdef H5
  let textarea = document.createElement("textarea")
  textarea.value = data
  textarea.readOnly = "readOnly"
  document.body.appendChild(textarea)
  textarea.select() // 选择对象
  textarea.setSelectionRange(0, data.length) //核心
  if (document.execCommand('copy')) {
    uni.showToast({
      title: successToast
    })
  }
  textarea.remove()
  // #endif
  // #ifndef H5
  uni.setClipboardData({
    data,
    success: () =>
      uni.showToast({
        title: successToast
      })
  });
  // #endif
}
export default {
  getDateStr,
  dateFormat,
  timeTransform,
  getDateRange,
  getnowdate,
  doubleFloat,
  printlog,
  isphonenum,
  isemail,
  timedifferent,
  isIdCard,
  getnowDate,
  gettimedifference,
  isSame,
  gettimedifferencenow,
  abandonDictionary,
  getOrgIdList,
  downFunc,
  getUrlApi,
  getQueryString,
  queryStringfy,
  getUserId,
  getNowDateHalf,
  getRequestHeader,
  isStartESignAdd,
  timeLeft,
  convertHexToRGB,
  checkPwd,
  copy
}
