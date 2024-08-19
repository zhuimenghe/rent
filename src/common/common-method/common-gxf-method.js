import * as savekey from './save-key.js'
import * as urlConstant from '../../network/url-constant.js'
import fommartStr from './common-method.js'
import utiltime from '../util/day-working-hours.js'
import { wxDownloadFile } from '@/network/file'
import { reverseGeo } from '@/network/modules/machineapi'

//秒数转小时+分钟
const issameRoleType = function (res, type) {
  let roleTypeList = res.roleTypeList || [];
  return roleTypeList.some(o => {
    return o == type
  })
}
const issameAllRoleType = function (res, type) {
  let roleTypeList = res.roleTypeList || [];
  return roleTypeList.every(o => {
    return o == type
  })
}
const RoleName = function (res) {
  let roleTypeList = res.roleIdNameList || [];
  return roleTypeList.toString()
}
const getorgName = function (res) {
  let orgIds = res.orgIds || [];
  let orgId = res.orgId || ""
  let index = orgIds.findIndex(o => {
    return o === orgId
  });
  let OrgNames = res.orgName;
  let arr = OrgNames.split('|');
  return arr[index]
}
const forEachObj = function (url, obj) {
  let urlstr = urlConstant.BASE_URL + url;
  Object.keys(obj).forEach((key) => {
    if (key === 'beginDate' || key === 'endDate' || key === 'startTime' || key === 'endTime') {
      if (obj[key] && obj[key] != '') {
        urlstr = urlstr + "&" + key + '=' + encodeURIComponent(obj[key])
      }
    } else {
      if (obj[key] && obj[key] != '') {
        urlstr = urlstr + "&" + key + '=' + obj[key]
      }
    }
  });
  return urlstr;
}
const downFunc = function (url, method, data, filename) {
  // #ifdef MP-WEIXIN || H5
  wxDownloadFile(url, method, data, filename)
  // #endif
  // #ifdef APP-PLUS
  uni.showLoading({
    title: '正在下载中,请稍等...',
    mask: true,
  })
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
  let param = {
    method: method,
    data: JSON.stringify(data),
    filename: filename
  }
  let downloadTask = plus.downloader.createDownload(url, param, function (d, status) {
    if (status == 200) {
      console.log(d);
      uni.openDocument({
        filePath: d.filename,
        success: function (res) {
          console.log(res);
          console.log('打开文档成功');
          uni.hideLoading()
        },
        fail: (error) => {
          uni.showToast({
            icon: "none",
            title: "打开文档失败"
          })
        }
      });
    } else {
      console.log("Download failed: " + status);
      uni.showToast({
        icon: "none",
        title: "Download failed: " + status
      })
    }
  });
  downloadTask.setRequestHeader('Content-Type', 'application/json')
  downloadTask.setRequestHeader('Authorization', headerDic.Authorization)
  downloadTask.start();
  // #endif
}
const downFuncNoHead = function (url, method, data, filename) {
  // #ifdef APP-PLUS
  let param = {
    method: method,
    data: JSON.stringify(data),
    filename: filename
  }
  let downloadTask = plus.downloader.createDownload(url, param, function (d, status) {
    if (status == 200) {
      console.log(d);
      uni.openDocument({
        filePath: d.filename,
        success: function (res) {
          console.log(res);
          console.log('打开文档成功');
          uni.hideLoading()
        },
        fail: (error) => {
          uni.showToast({
            icon: "none",
            title: "打开文档失败"
          })
        }
      });
    } else {
      console.log("Download failed: " + status);
      uni.showToast({
        icon: "none",
        title: "Download failed: " + status
      })
    }
  });
  downloadTask.start();
  // #endif
}
const getUrl = function (str) {
  let url = urlConstant.BASE_URL + str + '?isExport=true'
  return url
}
const getFileName = function (str) {
  let timestr = fommartStr.dateFormat(new Date, 'yyyyMMddhhmmss')
  let url = str + timestr + ".xlsx"
  // #ifdef APP-PLUS
  url = "_doc/" + str + timestr + ".xlsx"
  // #endif
  return url
}
const getFileNameDoc = function (str, type) {
  let timestr = fommartStr.dateFormat(new Date, 'yyyyMMddhhmmss')
  let url = str + timestr + type
  // #ifdef APP-PLUS
  url = "_doc/" + str + timestr + type
  // #endif
  return url
}
const getMoneyPart = function (val) {
  val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  val = val.replace(/^\./g, ""); //验证第一个字符是数字
  val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
  val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
  return val
}
const getIntString = function (val) {
  val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  val = val.replace(/^\./g, ""); //验证第一个字符是数字
  val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
  val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", "");
  val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, ''); //只能输入两个小数
  return val
}
const getNSIntString = function (val) {
  val = val.replace(/[^\d]/g, ""); //清除"数字"和"."以外的字符
  return val
}
const getNextDays = function (days) {
  let current = (new Date()).getTime();
  let future = current + days * 24 * 3600 * 1000;
  let fomart = utiltime.dateSFormat(future) + " " + dateHHMM()
  console.log(fomart)
  return fomart
}
const dateHHMM = function () {
  let date = new Date()
  let h = date.getHours();
  let m = date.getMinutes();
  if (m > 30) {
    return h + ':30:00'
  }
  return h + ':00:00'
}
const dateHHMMSS = function () {
  return " 23:59:59"
}
const getSystemDays = function (type) {
  let resData = uni.getStorageSync(savekey.CONFIG_INFO)
  if (resData) {
    if (type == '1') {
      let obj3 = resData.find(o => o.code === 'machine_repair_end_day')
      if (obj3) {
        console.log(JSON.stringify(obj3))
        if (parseInt(obj3.value) > 0) {
          return parseInt(obj3.value)
        }
      }
    } else if (type == '2') {
      let obj3 = resData.find(o => o.code === 'machine_check_repair_end_day')
      if (obj3) {
        if (parseInt(obj3.value) > 0) {
          return parseInt(obj3.value)
        }
      }
    } else if (type == '3') {
      let obj3 = resData.find(o => o.code === 'machine_maintence_end_day')
      if (obj3) {
        if (parseInt(obj3.value) > 0) {
          return parseInt(obj3.value)
        }
      }
    } else if (type == '4') {
      let obj3 = resData.find(o => o.code === 'machine_inspection_end_day')
      if (obj3) {
        if (parseInt(obj3.value) > 0) {
          return parseInt(obj3.value)
        }
      }
    }
  }
  return 0
}
const getYMDHMTime = function (date) {
  if (!date) {
    return
  }
  return date.split(/\s+/)[0];
  // let d = ''
  // if (date) {
  // 	console.log(date)
  // 	let newdate = date.split('.')[0]
  // 	console.log(newdate)
  // 	d = utiltime.timeFormatYMDHM(newdate);
  // }
  // return d;
}
const paramsStr = function (obj) {
  let result = '';
  let item;
  for (item in obj) {
    if (obj[item] && String(obj[item])) {
      result += `&${item}=${obj[item]}`;
    }
  }
  if (result) {
    result = '?' + result.slice(1);
  }
  return result;
}
const isSF = function () {
  let resData = uni.getStorageSync(savekey.CONFIG_INFO)
  let isSF = false
  if (resData) {
    let obj = resData.find(o => o.code === 'scene_code')
    if (obj) {
      isSF = obj.value == 'true' ? true : false
    }
  }
  console.log(isSF)
  return isSF;
}

import encUtf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import modeECB from 'crypto-js/mode-ecb';
import padPkcs7 from 'crypto-js/pad-pkcs7';
import Base64 from 'crypto-js/enc-base64';

const key = encUtf8.parse("dlVWXnPTSQzd74OY"); //十六位十六进制数作为密钥
// const iv = encUtf8.parse("ABCDEF1234123412"); //十六位十六进制数作为密钥偏移量
/*加密函数*/
const encrypt = function (word) {
  let srcs = encUtf8.parse(word);
  let encrypted = AES.encrypt(srcs, key, {
    // iv: iv,
    mode: modeECB,
    padding: padPkcs7
  });
  return encrypted.toString();
}
/*解密函数*/
const decrypt = function (word) {
  let encryptedHexStr = Base64.parse(word);
  let srcs = Base64.stringify(encryptedHexStr);
  let decrypt = AES.encrypt(srcs, key, {
    // iv: iv,
    mode: modeECB,
    padding: padPkcs7
  });
  let decryptedStr = decrypt.toString(encUtf8);
  return decryptedStr.toString();
}
//api
const getDeletApi = function (processKey) {
  let pk = processKey ? processKey : '';
  let urlapi = '';
  switch (pk) {
    case 'contract':
      urlapi = 'contract';
      break;
    case 'workIn':
      urlapi = 'workIn';
      break;
    case 'workOut':
      urlapi = 'workOut';
      break;
    case 'claim':
      urlapi = 'claim';
      break;
    case 'pause':
      urlapi = 'pause';
      break;
    case 'serviceClaim':
      urlapi = 'serviceClaim';
      break;
    case 'servicePause':
      urlapi = 'servicePause';
      break;
    case 'proceeds':
      urlapi = 'proceeds';
      break;
    case 'refund':
      urlapi = 'reimburse';
      break;
    case 'settlement':
      urlapi = 'settlement';
      break;
    case 'settle':
      urlapi = 'settle';
      break;
    case 'repair':
      urlapi = 'machine/repair';
      break;
    case 'maintenance':
      urlapi = 'maintenance/record';
      break;
    case 'checkRepair':
      urlapi = 't-check-repair';
      break;
    case 'inspection':
      urlapi = 'inspection/record';
      break;
    //暂时不可删除
    case 'statement':
      urlapi = 'statement';
      break;
    case 'settlementApply':
      urlapi = 'settlementApply';
      break;
    case 'purchase':
      urlapi = 'purchase';
      break;
    case 'invoice':
      urlapi = 'invoice';
      break;
    case 'contractChange':
      urlapi = 'contract/changeId';
      break;
    case 'contractPlus':
      urlapi = 'contract/plus';
      break;
    case 'claimAdjust':
      urlapi = 'claimAdjust';
      break;
    case 'pauseAdjust':
      urlapi = 'pauseAdjust';
      break;
    case 'commonApprove':
      urlapi = 'commonApprove';
      break;
    case 'workInOut':
      urlapi = 'workInOut';
      break;
    case 'sublet':
      urlapi = 'sublet';
      break;
    case 'contractDiscounts':
      urlapi = 'contractDiscounts';
      break;
    case 'allot':
      urlapi = 'allot';
      break;
    case 'allocation':
      urlapi = 'allocation';
      break;
    case 'partsStorage':
      urlapi = 'partsStorage';
      break;
    case 'partsCollar':
      urlapi = 'partsCollar';
      break;
    case 'partsReturn':
      urlapi = 'partsReturn';
      break;
    case 'partsAllocation':
      urlapi = 'partsAllocation';
      break;
    case 'partsUnitPrice':
      urlapi = 'partsUnitPrice';
      break;
    case 'batteryPatrol':
      urlapi = 'battery-patrol-record';
      break;
    case 'insurance':
      urlapi = 'machine-insurance';
      break;
    default:
      urlapi = '';
      break;
  }
  return urlapi;
}
const shareList = function () {
  let shareList = [{
    icon: "/static/sharemenu/wx.png",
    text: "微信好友",
  }, {
    icon: "/static/sharemenu/pyq.png",
    text: "朋友圈"
  }];
  return shareList
}
const getUserListWithType = function (userlist, type) {
  let roleTypeList = userlist;
  let list = [];
  userlist.forEach(o => {
    if (o.roleTypeList.some(e => {
      return e == type
    })) {
      list.push(o);
    }
  })
  return list
}
const defaultProjectName = function () {
  let timestr = fommartStr.dateFormat(new Date, 'yyyyMMddhhmm')
  return '项目' + timestr;
}
const subDateWithHHMMSS = function (datestr) {
  if (!datestr || datestr == null) {
    return '--';
  }
  return datestr.split(' ')[0];
}
const getnowdateSS = function () {
  let date = new Date;
  let year = date.getFullYear(); //当前年份
  let month = date.getMonth() + 1; //当前的月份(0-11,0代表1月) 
  let days = date.getDate(); //当前的星期X(0-6,0代表星期天) 
  let hour = date.getHours(); //获取系统时间
  let minute = date.getMinutes(); //分
  // let second = date.getSeconds();//秒
  if (month < 10) {
    month = "0" + month;
  }
  if (days < 10) {
    days = "0" + days;
  }
  if (minute < 15) {
    minute = '00';
  }
  if (minute > 15 && minute < 45) {
    minute = '30';
  }
  if (minute > 45) {
    minute = '00';
    hour = hour + 1;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  // return year + "-" + month + "-" + days + " " + hour + ":" + minute + ':' + second;
  return year + "-" + month + "-" + days + " " + hour + ":" + minute + ':00';
}
const getTimeWithTime = function (dateTime, hours) {
  let dateTimeDate = new Date(dateTime.replace(/-/g, "/").replace(/-/g, "/"));
  let totalNum = dateTimeDate.getTime();
  let leftHours = totalNum + (parseInt(hours) * 3600000)
  let date = new Date(leftHours);
  let year = date.getFullYear(); //当前年份
  let month = date.getMonth() + 1; //当前的月份(0-11,0代表1月) 
  let days = date.getDate(); //当前的星期X(0-6,0代表星期天) 
  let hour = date.getHours(); //获取系统时间
  let minute = date.getMinutes(); //分
  let second = date.getSeconds(); //秒
  if (month < 10) {
    month = "0" + month;
  }
  if (days < 10) {
    days = "0" + days;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year + "-" + month + "-" + days + " " + hour + ":" + minute + ':' + second;
}
const getSpaceWord = function (keyword) {
  if (!keyword || parseFloat(keyword) == 0) {
    return ""
  } else {
    return keyword
  }
}
const downEsignFunc = function (url, method, data, filename) {
  // #ifdef MP-WEIXIN || H5
  uni.showLoading({
    title: '正在下载中,请稍等...',
    mask: true,
  })
  console.log(url, filename);
  let filePath = `${wx.env.USER_DATA_PATH}/${filename}`
  uni.downloadFile({
    url: url,
    filePath,
    success: function (res) {
      uni.openDocument({
        filePath: res.filePath,
        fileType: 'pdf',
        showMenu: true,
        success: function (res) {
          console.log('打开文档成功');
        },
        fail: function (err) {
          console.log(err, 'err');
        }
      });
    },
    complete() {
      uni.hideLoading()
      console.log("111");
    },
    fail: function () {
    }
  });
  // wxDownloadFile(url,method,data,filename)
  // #endif
  // #ifdef APP-PLUS
  let param = {
    method: method,
    data: JSON.stringify(data),
    filename: filename
  }
  let platform = uni.getSystemInfoSync().platform;
  if (platform === 'ios') {
    let headtype = filename.split(".")[0];
    let footerstyle = filename.split(".")[1];
    let timestr = fommartStr.dateFormat(new Date, 'yyyyMMddhhmmss')
    param.filename = headtype + '-' + timestr + "." + footerstyle;
  }
  let downloadTask = plus.downloader.createDownload(url, param, function (d, status) {
    if (status == 200) {
      console.log(d);
      uni.openDocument({
        filePath: d.filename,
        success: function (res) {
          console.log(res);
          console.log('打开文档成功');
          uni.hideLoading()
        },
        fail: (error) => {
          uni.showToast({
            icon: "none",
            title: "打开文档失败"
          })
        }
      });
    } else {
      uni.showToast({
        icon: "none",
        title: "Download failed: " + status
      })
    }
  });
  downloadTask.start();
  // #endif
}
const statisticData = function (eventId, keystring, funcstring) {
  // #ifdef APP-PLUS
  let teamId = uni.getStorageSync('teamId');
  let valueString = `${keystring}-${funcstring}`
  let userInfo = uni.getStorageSync("userinfoMesage");
  let lesseeInfo = userInfo["lesseeInfo"] ? userInfo["lesseeInfo"] : {};
  let state = lesseeInfo["state"] ? lesseeInfo["state"] : '';
  if (state == 2) {
    let param = {};
    param[teamId] = valueString;
    console.log(JSON.stringify(param));
    plus.statistic.eventTrig(eventId, param);
  }
  // #endif
}
//用于替换字符串中的特殊字符
const replaceStr = function (item) {
  let dictTostr = JSON.stringify(item);
  let dealStr = dictTostr.replace(/%/g, "$百分号$")
  return dealStr;
}
const restartStr = function (jsonstr) {
  let dealStr = jsonstr.replace(/\$百分号\$/g, "%")
  let item = JSON.parse(dealStr)
  console.log(item)
  return item;
}
const getMoneyS = function (val) {
  let value = val ? val.toString() : ""
  if (value.indexOf("$$SENSITIVE$$") != -1) {
    return "***";
  }
  return value;
}

//经纬度转位置信息
const pointToAddress = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    let point = new plus.maps.Point(longitude, latitude);
    plus.maps.Map.reverseGeocode(point, {}, event => {
      resolve(event.address)
    },
      error => reject(error));
    // #endif
    // #ifndef APP-PLUS
    reverseGeo(latitude, longitude).then(res => {
      resolve(res.address)
    })
    // #endif
  })
}

//getLocation with address
const getLocationWithAddr = async () => {
  let [err, res] = await uni.getLocation({
    type: 'gcj02'
  });
  if (err) {
    return {}
  }
  let { latitude, longitude } = res;
  let address = await pointToAddress(latitude, longitude)
  return { ...res, address }
}

//当前位置
const getCurAddress = async (callBack) => {
  uni.getLocation({
    type: 'gcj02',
    success: async res => {
      let address = await pointToAddress(res.latitude, res.longitude);
      callBack(address)
    }
  });

}
const callPhone = (phone) => {
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone,
      success: res => {
        console.log('调用成功!');
      },
      fail: res => {
        console.log('调用失败!');
      }
    });
  }
}

export default {
  issameRoleType,
  issameAllRoleType,
  RoleName,
  forEachObj,
  downFunc,
  getUrl,
  getFileName,
  getMoneyPart,
  getIntString,
  getorgName,
  getNextDays,
  getSystemDays,
  getYMDHMTime,
  dateHHMMSS,
  paramsStr,
  isSF,
  encrypt,
  decrypt,
  getDeletApi,
  shareList,
  getUserListWithType,
  defaultProjectName,
  subDateWithHHMMSS,
  getnowdateSS,
  getTimeWithTime,
  getSpaceWord,
  downEsignFunc,
  statisticData,
  getNSIntString,
  replaceStr,
  restartStr,
  getMoneyS,
  getFileNameDoc,
  downFuncNoHead,
  pointToAddress,
  getCurAddress,
  getLocationWithAddr,
  callPhone,
  promisify(func) {
    return function (args) {
      return new Promise((resolve, reject) => {
        func({
          ...args,
          success: (res) => {
            console.log('调用成功', res)
            resolve(res)
          },
          fail: (err) => {
            console.error('调用出错', err)
            reject(err)
          },
        })
      })
    };
  },
  whileTaskDone(task, max_retry_times = 3, delay) {
    let times = 0;
    const _task_ = async (resolve, reject) => {
      try {
        const result = await task(!!times);
        resolve(result);
      } catch (err) {
        times++;
        if (times >= max_retry_times) {
          return reject(err)
        }
        setTimeout(async () => {
          await _task_(resolve, reject)
        }, delay || Math.random() * times * times * 1000)
      }
    }
    return new Promise(async (resolve, reject) => {
      await _task_(resolve, reject)
    })
  }
}
