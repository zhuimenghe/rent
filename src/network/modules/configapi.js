import ajax from '../interface'

const modulePath = "configapi";

//合同列表
export const tenantApply = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/tenant/account-apply`,
    data,
    method: "post",
    showLoading
  });


//企业风险查询
export const enterpriseRiskInquiry = (data, showLoading = false) =>
  ajax.request({
    url: `${modulePath}/tenant/feign/enterprise/info/qxbEnterpriseRisks`,
    method: "get",
    showLoading,
    data:data
  });
