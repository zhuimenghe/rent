import { BASE_URL_COUPON } from '../url-constant'
import ajax from '../interface'

export const fetchActivity = () =>
  ajax.request({
    url: `${BASE_URL_COUPON}/wx/mn/promotion?status=RUNNING`,
    method: "get"
  });

export const fetchCouponList = (openId, orderStatus, orderId, identifier) =>
  ajax.request({
    url: `${BASE_URL_COUPON}/wx/mn/order`,
    method: "get",
    data: { openId, orderStatus, orderId, identifier }
  });

export const fetchOrderList = (openId, identifier) =>
  ajax.request({
    url: `${BASE_URL_COUPON}/wx/mn/coupon/order`,
    method: "get",
    data: { openId, identifier }
  });

export const createOrder = (data) =>
  ajax.request({
    url: `${BASE_URL_COUPON}/wx/mn/order`,
    method: "post",
    data: data
  });
