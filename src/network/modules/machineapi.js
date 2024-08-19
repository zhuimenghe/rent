import ajax from '../interface'
import md5 from 'crypto-js/md5';
import { PARAMS_SIGN_KEY } from '@/common/constant'

const modulePath = "machineapi/api";

//设备列表
export const machineList = (data, showExecutionInfo = false) =>
  ajax.request({
    url: `${modulePath}/machine/page?showExecutionInfo=${showExecutionInfo}`,
    method: "post",
    data
  });

//设备监控详情
export const monitorDetail = (licenseId) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/licenseId/` + licenseId,
    method: "get",
  });

//添加设备
export const machineScanCreate = (licenseId) =>
  ajax.request({
    url: `${modulePath}/machine/scan/${licenseId}`,
    method: "post",
  });

//添加设备
export const machineCreate = (data) =>
  ajax.request({
    url: `${modulePath}/machine`,
    data,
    method: "post",
  });
//查设备详情
export const machineDetail = (id) =>
  ajax.request({
    url: `${modulePath}/machine/${id}`,
    method: "get",
  });

//修改设备
export const machineUpdate = (data) =>
  ajax.request({
    url: `${modulePath}/machine`,
    data,
    method: "put",
  });

export const machineTypeSelect = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/machine/type/selected`,
    data,
    method: "get",
    showLoading
  });

/*  生成业务单号 */
export const reverseGeo = (latitude, longitude) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/location`,
    data: { longitude, latitude },
    method: "get",
  });

//设备监控详情
export const mapCount = () =>
  ajax.request({
    url: `${modulePath}/machine/getCount`,
    method: "post",
    data: {}
  });

//电子围栏列表
export const fenceList = (data) =>
  ajax.request({
    url: `${modulePath}/fence/getFencePage?isExport=false`,
    method: "post",
    data: data
  });
//电子围栏-根据id获取详情
export const fenceInfo = (id, data) =>
  ajax.request({
    url: `${modulePath}/fence/${id}`,
    method: "get",
    data: data
  });

//地图数据统计
export const fenceMapStatistic = (data) =>
  ajax.request({
    url: `${modulePath}/machine/count?showGpsOnLineNum=true`,
    method: "get",
    data: data
  });

//监控列表
export const monitorList = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/page`,
    method: "post",
    data: data
  });

//监控-设备实际工作时长
export const actualWorkTime = (licenseId, day) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/queryActualWorktime`,
    method: "post",
    data: { licenseId, day }
  });
//监控-设备开机时长
export const OnlineTime = (licenseId, day) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/queryStartUpTime`,
    method: "post",
    data: { licenseId, day }
  });
//监控-月每日工作开机时长柱状图
export const machineMonthWorkTime = (licenseId, month) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/statisticsOfMonth`,
    method: "post",
    data: { licenseId, month }
  });
//监控-年每月开工率
export const machineYearWorkRatio = (licenseId, year) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/workRateOfMonth`,
    method: "post",
    data: { licenseId, year }
  });
//监控-月每日电量使用情况
export const machineMonthBatteryUsage = (licenseId, month) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/batteryStatus`,
    method: "post",
    data: { licenseId, month }
  });
//监控-每日电量
export const machineDayBatteryUsage = (licenseId, startDate) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/batteryPoint?oneRemove=true`,
    method: "post",
    data: { licenseId, startDate }
  });
//监控-每日电量当前故障
export const currentFaults = (licenseId) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/fault/current?licenseId=${licenseId}`,
    method: "get",
  });
//监控-每日电量当前故障
export const historicalFaults = (data) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/fault/page`,
    method: "post",
    data
  });
//监控-轨迹
export const gpsTrack = ({ licenseId, startDate, endDate }) =>
  ajax.request({
    url: `${modulePath}/machineStatistics/gps`,
    method: "post",
    data: { licenseId, startDate, endDate }
  });

//控制，解锁及
export const fetchControlDevices = (data) =>
  ajax.request({
    url: `${modulePath}/machine/remote/v2/machine/page`,
    method: "post",
    data: data
  });

export const lockDevice = ({ licenseIdList, operationType,opReason }) => {//operationType 0解锁 1锁车
  let timestamp = new Date().getTime()
  let sign = md5(timestamp + PARAMS_SIGN_KEY).toString()
  return ajax.request({
    url: `${modulePath}/machine/remote/v2/operation`,
    method: "post",
    data: { licenseIdList, operationType, timestamp, sign ,opReason }
  });
}

export const fetchOperationList = (data) => //operationType 0解锁 1锁车
  ajax.request({
    url: `${modulePath}/machine/remote/v2/log/page`,
    method: "post",
    data: data
  });

export const fetchDeviceOpList = (data) => //operationType 0解锁 1锁车
  ajax.request({
    url: `${modulePath}/machine/remote/v2/log/item/page`,
    method: "post",
    data: data
  });
//每日报告-低电量20%
export const lowPower = () =>
  ajax.request({
    url: `${modulePath}/machine/monitor/lowPower`,
    method: "get",
  });
//每日报告-低电量10%
export const chargePower = () =>
  ajax.request({
    url: `${modulePath}/machine/monitor/chargePower`,
    method: "get",
  });


//每日报告-获取待充电设备
export const assoi = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/assoi`,
    method: "post",
    data
  });

export const monitorPdf = () =>
  ajax.request({
    url: `${modulePath}/machine/monitor/pdf`,
    method: "get",
  });

export const constructionSites = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/constructionSites?isHistory=${data}`,
    method: "get",
  });



export const constructionSiteInfo = (address, isHistory) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/constructionSite/info?address=${address}&isHistory=${isHistory}`,
    method: "get",
  });


export const monitorHome = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/home`,
    method: "get",
  });

//施工点地图
export const constructionMapSites = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/constructionSites/app`,
    method: "get",
    data: data
  });
export const constructionMapAreas = () =>
  ajax.request({
    url: `${modulePath}/machine/monitor/constructionSites/areaList`,
    method: "get"
  });
export const mapHomeDetail = (address) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/home/detail`,
    method: "get",
    data: { address }
  });

export const constructionSitesInfoMonth = (month, address) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/constructionSites/info/month?month=${month}&address=${address}`,
    method: "get",
  });

export const homeAdmin = (data) =>
  ajax.request({
    url: `${modulePath}/machine/home-admin`,
    method: "post",
    data: data
  });

export const workApplyList = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/getConsultRecordPage`,
    method: "post",
    data: data
  });
export const handleWorkApply = (id,handleResult) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/updateConsultRecord`,
    method: "post",
    data: {id,handleResult}
  });

export const repairApplyList = (data) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/getMachineRepairsPage`,
    method: "post",
    data: data
  });
export const handleRepairApply = (id,handleResult) =>
  ajax.request({
    url: `${modulePath}/machine/monitor/updateMachineRepairs`,
    method: "post",
    data: {id,handleResult}
  });
