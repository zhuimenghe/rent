import ajax from '../interface'

const modulePath = "/contractapi/api";

//合同列表
export const fetchContractList = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/contract/page`,
    data,
    method: "post",
    showLoading
  });

/* 合同详情设备清单 */
export const getmachineInfoListApi = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/machine/rentRecord/contract/machineInfoList`,
    data,
    method: "post",
    showLoading

  });

export const getWorkInOutCount = (data) =>
  ajax.request({
    url: `${modulePath}/contract/workInOutCount`,
    data,
    method: "get",
  });

// 从高德地图搜索地点
export const inputTips = (data) =>
  ajax.request({
    url: `${modulePath}/contract/geo/input/tips`,
    data,
    method: "get",
  });
export const fetchUseReportList = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/usageReport/page`,
    data,
    method: "post",
    showLoading
  });

export const fetchReportByContractId = (contractId, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/usageReport/show?contractId=${contractId}`,
    method: "get",
    showLoading
  });

export const saveUseReport = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/usageReport`,
    data,
    method: "post",
    showLoading
  });

export const machineStore = (data) =>
  ajax.request({
    url: `${modulePath}/contract/machineStore`,
    method: "post",
    data: data
  });

/* 根据附加合同Id查询附加信息 */
export const contractPlusGetByInfo = (plusId) =>
  ajax.request({
    url: `${modulePath}/contract/plus/id/${plusId}`,
    method: "get",
  });

export const fetchCustomers = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/customer/page/new`,
    method: "post",
    data: data,
    showLoading
  });

export const customerReminders = (id) =>
  ajax.request({
    url: `${modulePath}/customer/contract/message?id=${id}`,
    method: "get",
  });

export const contractsByCustomer = (customerId, state = '') =>
  ajax.request({
    url: `${modulePath}/contract/listByCustomerId`,
    data: { customerId, state },
    method: "post",
  });

/*客户详情营收*/
export const getCustomerReceivable = (key) =>
  ajax.request({
    url: `${modulePath}/customer/${key}/receivable`,
    method: "get",
  });

export const guarantors = (data) =>//data={contractNo,contractId}
  ajax.request({
    url: `${modulePath}/contract/guarantor`,
    method: "get",
    data: data,
  });