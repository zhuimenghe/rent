import Vue from "vue";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
/* 判断是否有操作权限 */

Vue.filter('esignStatusName', (v) => {

  let flowStatusName = null;
  v = v + ''
  switch (v) {
    case '0': flowStatusName = '草稿'; break;
    case '1': flowStatusName = '签署中'; break;
    case '2': flowStatusName = '已完成'; break;
    case '3': flowStatusName = '撤销'; break;
    case '5': flowStatusName = '过期'; break;
    case '7': flowStatusName = '拒签'; break;
    default: flowStatusName = '-'; break;
  }
  return flowStatusName;
})

Vue.filter('toFixed', (v, p = 2) => {
  if (v === undefined || v === null) {
    return '--'
  }
  return Number(v).toFixed(p);
})

Vue.filter('dateFormat', (v, p = 'yyyy-MM-dd') => {
  if (v === undefined || v === null) {
    return '--'
  }
  try {
    let date = typeof v === "string" || v instanceof String ? parseISO(v) : v;
    return format(date, p);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '--';
  }
})