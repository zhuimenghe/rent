import ajax from "../interface";

const modulePath = "/userapi/api";
/*  手机解绑微信 */
export const unbindWeixinWithPhone = (code) =>
  ajax.request({
    url: `${modulePath}/auth/user/wx-unbind-phone?code=${code}`,
    hideError: true,
    method: "post",
  });

/*  unionid解绑微信 */
export const unbindWeixinSelf = (code) =>
  ajax.request({
    url: `${modulePath}/auth/user/wx-unbind-self?code=${code}`,
    hideError: true,
    method: "post",
  });

/*  检查是否可以self解绑 */
export const unbindWeixinSelfCheck = (code) =>
  ajax.request({
    url: `${modulePath}/auth/user/wx-unbind-self-check?code=${code}`,
    method: "post",
  });

/*    
* 测试环境：post
正式环境:get
code 换openid*/
export const code2Session = (code) =>
  ajax.request({
    url: `weixinapi/wechat/code2Session?code=${code}`,
    method: "post",
  });

//获取手机号
export const getPhoneNum = (code) =>
  ajax.request({
    url: `weixinapi/wechat/getPhoneNum`,
    method: "get",
    data: { code },
  });
//字典管理  根据type获取列表
export const sysDictType = (data) =>
  ajax.request({
    url: `${modulePath}/sys/dict/type`,
    method: "get",
    data,
  });
