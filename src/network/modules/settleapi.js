import ajax from '../interface'

const modulePath = "/settleapi/api";
const modulePath1 = "settleapi/api";
/*  手机解绑微信 */
export const fetchMachineSettleHistory = (licenseId) =>
  ajax.request({
    url: `${modulePath}/settlement/settlementResume?licenseId=${licenseId}`,
    method: "get",
  });
// 结算预览
export const previewSettle = (data) =>
  ajax.request({
    url: `${modulePath1}/settlement/export/v2`,
    method: "post",
    data
  });

export const proceedsByCustomer = (customerId) =>
  ajax.request({
    url: `${modulePath}/proceeds/list?customerId=${customerId}`,
    method: "get",
  });

export const withdrawsByCustomer = (customerId) =>
  ajax.request({
    url: `${modulePath}/reimburse/list?customerId=${customerId}`,
    method: "get",
  });

export const invoicesByCustomer = (customerId) =>
  ajax.request({
    url: `${modulePath}/invoice/list?customerId=${customerId}`,
    method: "get",
  });

export const machineByCustomer = ({ customerId, isSubletState, isRental }) =>
  ajax.request({
    url: `${modulePath}/receivable/machine/customer`,
    data: { customerId, isSubletState, isRental },
    method: "get",
  });

export const settleAdd = (data, wfQuery) =>
  ajax.request({
    url: `${modulePath}/settle${wfQuery}`,
    data,
    method: "post"
  });