let e = uni.getSystemInfoSync();
let s = {}
s.ratio = 750 / e.windowWidth;
s.systemInfo = e;
// #ifndef MP
s.canPay = true;
// #endif
// #ifdef MP
s.canPay = e.platform != "ios";
// #endif
s.statusBarHeight = e.statusBarHeight;
if (e.platform == "android") {
  s.titleBarHeight = 48;
} else {
  s.titleBarHeight = 44;
}
// #ifdef MP-WEIXIN||MP-TOUTIAO
s.menuBtnRect = uni.getMenuButtonBoundingClientRect();
s.titleBarHeight =
  s.menuBtnRect.bottom +
  s.menuBtnRect.top -
  2 * e.statusBarHeight;
// #endif
// #ifdef MP-ALIPAY
s.titleBarHeight = e.titleBarHeight;
// #endif
s.navBarHeight = s.titleBarHeight + s.statusBarHeight

export default {
  data() {
    return {
      systemInfo: s.systemInfo,
    };
  },
}
