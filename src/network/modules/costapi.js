import ajax from '../interface'

const modulePath = "contractapi/api";

//成本列表
export const costList = (data,showLoading=false) =>
  ajax.request({
    url: `${modulePath}/cost/search`,
    data,
    method: "post",
    showLoading
  });

  //   查看成本详情
export const getCostDetailById  = (data,showLoading=false) =>
  ajax.request({
    url: `${modulePath}/cost/info`,
    data,
    method: "get",
    showLoading
  });


//新建成本
  export const createCost = (data, str, showLoading=false) =>
  ajax.request({
    url: `${modulePath}/cost${str ? "?" + str : ""}`,
    data,
    method: "post",
    showLoading
  });