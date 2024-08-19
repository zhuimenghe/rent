<script>
import store from "./store";
import util from "@/common/common-method/common-method.js";
import { USER_INFO_MEG } from "@/common/common-method/save-key.js";
import { MACHINE_RECORD_DETAIL } from "@/network/url-constant.js";
import network from "@/network";

export default {
  globalData: {
    loginPromise: null,
  },
  onLaunch: async function () {
    // #ifdef MP
    let [err, res] = await uni.login();
    if (err) {
      uni.showToast({ title: "微信登陆失败", icon: "none" });
    }
    store.dispatch("coupon/init", res.code);
    //自动登录&加载用户相关信息
    let umsg = uni.getStorageSync(USER_INFO_MEG);
    if (!umsg) {
      this.globalData.loginPromise = store.dispatch("global/autoLogin", res.code);
    } else {
      store.dispatch("global/init");
    }
    // #endif

    //系统信息 & app版本
    store.dispatch("system/init");
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
      uni.setStorageSync("version", wgtinfo.version); //versionName
    });
    // #endif
    // 适配手机语言
    var lan = "zh";
    try {
      const res = uni.getSystemInfoSync();
      lan = res.language;
    } catch (e) {
      console.log("error=" + e);
    }
    console.log("lan=" + lan);
    if (lan == "en") {
      this.$i18n.locale = "en";
    }
    if (lan == "zh-Hans-CN" || lan == "zh") {
      this.$i18n.locale = "zh";
    }
    // #ifdef APP-PLUS
    if (uni.getSystemInfoSync().platform == "ios") {
      this.handleiOSPush();
    } else {
      this.handleAndroidPush();
    }
    // #endif
    uni.onTabBarMidButtonTap(() => {
      this.scanCode();
    });

    //加载字体
    uni.loadFontFace({
      global: true,
      scopes: ["native"],
      family: "iconfont",
      source:
        'url("https://at.alicdn.com/t/c/font_2984469_ysr6bza8z3e.ttf?t=1702625358612")',
      success() {
        console.log("font load success");
      },
      fail(err) {
        console.error("font load error", err);
      },
    });
  },
  onShow: async function () {},
  methods: {
    setTabBarHeight(tabBarHeight) {
      store.commit("system/setState", { tabBarHeight });
      console.log(tabBarHeight, "&&&");
    },
    scanCode() {
      uni.scanCode({
        success: (res) => {
          uni.hideLoading();
          //小程序scancode 和 showtoast冲突 延时一下
          let pages = getCurrentPages();
          let curPage = pages[0];
          setTimeout(() => {
            let codeResult = res.result;
            let licenseId =
              util.getQueryString("licenseId", codeResult) ||
              util.getQueryString("sn", codeResult);
            if (!licenseId) {
              curPage.$vm.popScan();
            } else {
              // uni.showLoading();
              let urlstr = MACHINE_RECORD_DETAIL + licenseId;
              network
                .getData(urlstr, "GET", null)
                .then((result) => {
                  console.log(result, "===");
                  if (!result || result == null) {
                    curPage.$vm.popScan(licenseId);
                  } else {
                    // uni.hideLoading();
                    uni.navigateTo({
                      url: "/pages/main/machine-scan-home?licenseId=" + licenseId,
                    });
                  }
                })
                .catch((err) => {
                  // uni.hideLoading();
                  // uni.showToast({
                  // 	title: '该车辆不存在',
                  // 	icon: 'none'
                  // });
                  curPage.$vm.popScan(licenseId);
                });
            }
          }, 100);
        },
      });
    },
    handleAndroidPush() {
      // #ifdef APP-PLUS
      console.log("APP-PLUS-Android");
      let msgObj = null;
      plus.push.addEventListener("click", (msg) => {
        setTimeout(() => {
          if (!msgObj) {
            msgObj = msg;
          }
          let payloadData = msgObj.payload;
          if (typeof msgObj.payload == "string") {
            payloadData = JSON.parse(payloadData);
          }
          let loginMes = uni.getStorageSync("loginMesage");
          if (loginMes && loginMes.access_token) {
            if (payloadData && payloadData.noticeType) {
              switch (payloadData.noticeType) {
                case "1": //抄送
                  this.dealDetail(payloadData.data, payloadData.id);
                  break;
                case "2": //消息待办
                  if (payloadData.data) {
                    this.dealBusiness(payloadData.data, payloadData.id);
                  } else {
                    uni.navigateTo({
                      url: "/businessPages/workflow/notification-tabbar",
                    });
                  }
                  break;
                case "3": //提醒
                  this.dealRemind(payloadData);
                  break;
                default:
                  break;
              }
            }
          } else {
            uni.navigateTo({
              url: "/pages/main/login",
            });
          }
        }, 1000);
      });
      plus.push.addEventListener("receive", function (msg) {
        msgObj = msg;
        console.log("receive-pushMsg" + JSON.stringify(msg));
      });
      // #endif
    },
    handleiOSPush() {
      // #ifdef APP-PLUS
      console.log("APP-PLUS-IOS");
      plus.push.addEventListener("click", (msg) => {
        setTimeout(() => {
          let msgObj = msg;
          let payloadData = msgObj.payload;
          if (typeof msgObj.payload == "string") {
            payloadData = JSON.parse(payloadData);
          }
          let customMsg = payloadData.customMsg ? JSON.parse(payloadData.customMsg) : {};
          console.log(JSON.stringify(customMsg));
          let loginMes = uni.getStorageSync("loginMesage");
          if (loginMes && loginMes.access_token) {
            if (customMsg && customMsg.noticeType) {
              switch (customMsg.noticeType) {
                case "1": //抄送
                  this.dealDetail(customMsg.data, customMsg.id);
                  break;
                case "2": //消息待办
                  if (customMsg.data) {
                    this.dealBusiness(customMsg.data, customMsg.id);
                  } else {
                    uni.navigateTo({
                      url: "/businessPages/workflow/notification-tabbar",
                    });
                  }
                  break;
                case "3": //提醒
                  this.dealRemind(customMsg);
                  break;
                default:
                  break;
              }
            }
          } else {
            uni.navigateTo({
              url: "/pages/main/login",
            });
          }
        }, 1000);
      });
      // #endif
    },
    dealRemind(payloadData) {
      switch (payloadData.messageTypeValue) {
        case "4": //合同到期提醒
          if (payloadData.contentType == "contract") {
            uni.navigateTo({
              url:
                "/contractPages/contract/contract-detail?businessNo=" +
                payloadData.formKey,
            });
          }
          break;
        case "3": //设备离线
          uni.navigateTo({
            url:
              "/devicePages/monitor/device-monitor-detail?licenseId=" +
              payloadData.formKey,
          });
          break;
        case "1": //故障信息
          uni.navigateTo({
            url:
              "/devicePages/monitor/device-monitor-detail?licenseId=" +
              payloadData.formKey +
              "&tabIndex=2",
          });
          break;
        case "9": //设备保养
          uni.navigateTo({
            url:
              "/devicePages/maintain/maintain-record-list?licenseId=" +
              payloadData.formKey,
          });
          break;
        case "11": //长时间未充电
          uni.navigateTo({
            url:
              "/devicePages/monitor/device-monitor-detail?licenseId=" +
              payloadData.formKey +
              "&tabIndex=1",
          });
          break;
        case "2": //出围栏提醒
          uni.navigateTo({
            url:
              "/devicePages/monitor/device-monitor-detail?licenseId=" +
              payloadData.formKey,
          });
          break;
        case "13": //合同未归档
        case "15": //合同结算提醒
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-detail?businessNo=" + payloadData.formKey,
          });
          break;
        case "14": //报停超过30天
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + payloadData.formKey,
          });
          break;
        case "18":
          //签署详情
          let noticeJsonDict = payloadData.data ? payloadData.data : {};
          uni.navigateTo({
            url:
              "/otherPages/esign/esign-flow-detail?businessType=" +
              noticeJsonDict.businessType +
              "&flowId=" +
              noticeJsonDict.flowId +
              "&docId=" +
              noticeJsonDict.docId,
          });
          break;
        case "17":
          // //电池巡检
          uni.navigateTo({
            url: "/devicePages/battery-polling/battery-polling-all",
          });
          break;
        default:
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-detail?businessNo=" + payloadData.formKey,
          });
          break;
      }
      this.markRead([payloadData.id]);
    },
    dealBusiness(item, idstr) {
      let url = this.$url.WORKFLOW_FINISH_STATE + item.id;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          if (result.taskType == "1") {
            if (item.taskState === "back") {
              this.dealBack(item);
            } else {
              this.dealapply(item);
            }
          } else {
            this.dealDetail(item, idstr);
          }
        })
        .catch((err) => {
          if (item.taskState === "back") {
            this.dealBack(item);
          } else {
            this.dealapply(item);
          }
        });
    },
    dealapply(item) {
      switch (item.processKey) {
        case "claim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contract":
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressContract":
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workIn":
          uni.navigateTo({
            // url: '/businessPages/workin/creat-workin?item=' + encodeURIComponent(JSON.stringify(item))
            url:
              "/businessPages/workin/create-workin-step-all?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/invoice-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/proceeds-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/workout-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "pause":
          uni.navigateTo({
            url:
              "/businessPages/pause/pause-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url:
              "/businessPages/pause/pause-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractChange":
          uni.navigateTo({
            url:
              "/contractPages/contract-change/contract-change-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/contract-expense-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "commonApprove":
          uni.navigateTo({
            url:
              "/businessPages/workflow/common-approve-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/reparir-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url:
              "/devicePages/maintain/maintain-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settle":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-finish-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/purchase-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/stock-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/allot-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/acc-storagein-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/acc-recelive-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/acc-back-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/acc-allot-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/sublet-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/add-record-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url:
              "/devicePages/insurance/insurance-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "inspection":
          uni.navigateTo({
            url:
              "/devicePages/polling/polling-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/battery-polling-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "apply");
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    dealBack(item) {
      switch (item.processKey) {
        case "claim":
          // this.getBusinessDetail(item)
          uni.navigateTo({
            url:
              "/businessPages/claim/creat-claim?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url:
              "/businessPages/claim/create-claim-service?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contract":
          if (item.businessNo.substr(0, 3) === "KHT") {
            //框架合同
            uni.navigateTo({
              url:
                "/contractPages/contract-kit/create-contract-kit?item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          } else {
            uni.navigateTo({
              url:
                "/contractPages/contract/create-contract?item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          }
          break;
        case "expressContract":
          uni.navigateTo({
            url:
              "/contractPages/contract/create-contract-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-step-all?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractChange":
          uni.navigateTo({
            url:
              "/contractPages/contract-change/create-contract-change?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&id=" +
              item.tableId,
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/create-contract-expense?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/create-invoice?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/creat-reimburse?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "pause":
          // this.getBusinessDetail(item)
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause-service?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "commonApprove":
          uni.navigateTo({
            url:
              "/businessPages/workflow/common-approve?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/create-repair?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url:
              "/devicePages/maintain/create-maintain?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/create-purchase?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/create-service?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/create-allot?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/create-acc-storagein?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/create-acc-recelive?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/create-acc-back?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/create-acc-allot?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/create-sublet?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/create-add-record?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url:
              "/devicePages/insurance/create-insurance?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "inspection":
          uni.navigateTo({
            url:
              "/devicePages/polling/create-polling?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-create?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/create-battery-polling?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "back");
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    dealDetail(item, id) {
      switch (item.processKey) {
        case "workIn":
          uni.navigateTo({
            url: "/businessPages/workin/workin-detail?businessNo=" + item.businessNo,
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-simple-detail?businessNo=" + item.businessNo,
          });
          break;
        case "invoice":
          uni.navigateTo({
            url: "/businessPages/invoice/invoice-detail?businessNo=" + item.businessNo,
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url: "/businessPages/proceed/porceeds-detail?businessNo=" + item.businessNo,
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" + item.businessNo,
          });
          break;
        case "claim":
          uni.navigateTo({
            url: "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url: "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contract":
          uni.navigateTo({
            url: "/contractPages/contract/contract-detail?businessNo=" + item.businessNo,
          });
          break;
        case "expressContract":
          uni.navigateTo({
            url: "/contractPages/contract/contract-detail?businessNo=" + item.businessNo,
          });
          break;
        case "workOut":
          uni.navigateTo({
            url: "/businessPages/workout/workout-detail?businessNo=" + item.businessNo,
          });
          break;
        case "pause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "contractChange":
          uni.navigateTo({
            // url: '/contractPages/contract-change/contract-change-detail?businessNo=' + item.businessNo
            url:
              "/contractPages/contract-change/contract-change-detail?id=" + item.tableId,
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/contract-expense-detail?businessKey=" +
              item.businessKey,
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/repair-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url: "/devicePages/maintain/maintain-detail?businessNo=" + item.businessNo,
          });
          break;
        case "purchase":
          uni.navigateTo({
            url: "/devicePages/purchase/purchase-detail?businessNo=" + item.businessNo,
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/stock-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "allocation":
          uni.navigateTo({
            url: "/devicePages/allot/allot-detail?businessNo=" + item.businessNo,
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/acc-storagein-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/acc-recelive-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/acc-back-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/acc-allot-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/add-record-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url: "/devicePages/insurance/insurance-detail?businessNo=" + item.businessNo,
          });
          break;
        case "inspection":
          uni.navigateTo({
            url: "/devicePages/polling/polling-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-detail?businessNo=" + item.businessNo,
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/battery-polling-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/sublet-apply-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "settlementApply":
          this.loadSettlementApplyData(item.businessNo);
          break;
        case "settlement":
          let url =
            "/businessPages/settledown/settle-detail?businessNo=" + item.businessNo;
          uni.navigateTo({
            url: url,
          });
          break;
        case "settle":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-finish-detail-show?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail?businessNo=" + item.businessNo,
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端查看",
          });
          break;
      }

      let param = {
        ids: [id],
      };
      this.$network
        .getData(this.$url.MARK_READ, "PUT", param)
        .then((result) => {})
        .catch((err) => {});
    },
    loadSettlementApplyData(key) {
      let param = {
        businessNo: key,
      };
      this.$network
        .getData(this.$url.APPLY_DATEIL, "GET", param)
        .then((result) => {
          if (result.dimensionType == "1") {
            //客户维度
            uni.navigateTo({
              url:
                "/businessPages/settle-apply/customer/application-customer-detail?businessNo=" +
                key,
            });
          } else {
            uni.navigateTo({
              url:
                "/businessPages/settle-apply/contract/application-contract-detail?businessNo=" +
                key,
            });
          }
        })
        .catch((err) => {});
    },
    getBusinessDetail(item, type) {
      uni.showLoading();
      let url = this.$url.DATA_FORM + item.businessKey;
      let urlstr = url.replace(/xxx/, this.getUrlApi(item.processKey));
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let resultDic = JSON.parse(result);
          if (item.processKey === "claim") {
            if (resultDic.category === "service") {
              uni.navigateTo({
                url:
                  "/businessPages/claim/create-claim-service?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/claim/creat-claim?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "pause") {
            if (resultDic.category === "service") {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause-service?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "settlementApply") {
            if (type == "back") {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-create?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-create?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              }
            } else {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-apply?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-apply?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              }
            }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    markRead(ids) {
      if (ids.length == 0) {
        return;
      }
      let param = {
        ids: ids,
      };
      this.$network
        .getData(this.$url.MARK_READ, "PUT", param)
        .then((result) => {
          uni.$emit("refresh-notification-list");
          // this.refreshheader();
        })
        .catch((err) => {});
    },
    getUrlApi(processKey) {
      let pk = processKey ? processKey : this.processKey;
      let urlapi = "";
      switch (pk) {
        case "claim":
        case "workOut":
        case "contract":
        case "pause":
        case "contractChange":
        case "contractPlus":
        case "claimAdjust":
        case "pauseAdjust":
        case "commonApprove":
          urlapi = "contractapi";
          break;
        case "invoice":
        case "proceed":
        case "refund":
        case "settlementApply":
        case "contractDiscounts":
          urlapi = "settleapi";
          break;
        case "allot":
        case "allocation":
        case "maintenance":
        case "purchase":
        case "insurance":
          urlapi = "machineapi";
          break;
        case "partsStorage":
        case "partsCollar":
        case "partsReturn":
        case "partsAllocation":
        case "partsUnitPrice":
          urlapi = "partsapi";
          break;
        default:
          urlapi = "contractapi";
          break;
      }
      return urlapi;
    },
  },

  onShow: function () {
    console.log("App Show");
    // #ifdef APP-PLUS
    var args = plus.runtime.arguments;
    if (args) {
      // 处理args参数，如直达到某新页面等
    }
    // #endif
  },

  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
@import "./assets/scss/main.scss";
/* #ifndef APP-NVUE */
@import url("./iconfont-icon.css");

/* #endif */
/*每个页面公共css */
/* #ifndef APP-PLUS-NVUE*/
html,
page {
  height: 100%;
  width: 100%;
  background-color: #f5f4f9;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.placeholder-style {
  font-size: 14px;
  color: #aaaaaa;
}

.placeholder-style-small {
  font-size: 12px;
  color: #aaaaaa;
}

.placeholder-style-smallest {
  font-size: 10px;
  color: #aaaaaa;
}

.themecolor {
  color: #e60000;
}

.row-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.row-line-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.option-btn {
  padding: 4px 8px;
  border-radius: 16px;
  border: 1px solid #e60000;
  color: #e60000;
  font-size: 14px;
  margin-left: 10px;
}

/**详情箭头动画**/
.translate-arrow {
  font-size: 16px;
  transform: rotate(-90deg);
  transition: all 500ms;
  color: #999999;
}

.max-four-line {
  white-space: normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 4 !important;
  -webkit-box-orient: vertical !important;
  word-break: break-all !important;
}

.max-three-line {
  white-space: normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  word-break: break-all !important;
}

.max-two-line {
  white-space: normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  word-break: break-all !important;
}

.max-one-line {
  white-space: normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  word-break: break-all !important;
}

.translate-arrow-expend {
  font-size: 16px;
  transform: rotate(90deg);
  transition: all 500ms;
  color: #999999;
}

.btnstyle-export {
  display: flex;
  margin: 5px;
  height: 30px;
  padding-right: 8px;
  padding-left: 8px;
  flex-direction: row;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: #e60000;
  font-size: 14px;
  background-color: #ffffff;
  border: 1px solid #e60000;
}

//筛选父视图
.export-view-style {
  margin-right: 10px;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  display: flex;
  background: #ffffff;
  border: 1px solid #e60000;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  z-index: 955;
  color: #e60000;
}

.cell-text-right {
  word-break: break-all;
}

/* #endif */

/* <i class="iconfont">&#x33;</i> 图标库用法 */
</style>
