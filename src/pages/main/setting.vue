<template>
  <view class="bgview" :style="{ paddingBottom: `${tabBarHeight + 10}px` }">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view">
      <image src="/static/my_top_bg.png" mode="scaleToFill" class="top-bg" />
      <view class="headView row-line">
        <image class="headImg" src="/static/my/icon_head_logo.png" />
        <view class="rightView">
          <view class="nickStyle">{{ itemDic.username || "游客" }}</view>
          <view class="positionStyle">{{ itemDic.roleName || "无" }}</view>
        </view>
      </view>
    </view>

    <view class="content-view">
      <view class="model-view" v-for="(m, i) in menus" :key="i">
        <view class="topView-setting" @click="goto(item)" v-for="(item, index) in m" :key="index"
          v-if="isshowLab(item)">
          <image class="cellImg" v-if="item.imgsrc" mode="aspectFit" :src="item.imgsrc"></image>
          <i v-if="item.icon" class="iconfont cellrightImg" :class="item.icon"></i>

          <label class="titleStyle">{{ item.name }}</label>
          <i class="iconfont cellrightImg iconarrow-right"></i>
        </view>
      </view>
      <!-- <view class="model-view">
				<view class="topView-setting" @click="toBind">
					<image class="cellImg" src="/static/my/icon_weixin.png"></image>
					<label class="titleStyle">微信通知</label>
					<view style="padding-right: 8px; font-size: 14px; color: #333333;">
						{{ isBindWechat ? '已绑定' : '去绑定' }}
					</view>
					<i class="iconfont cellrightImg iconarrow-right" v-if="!isBindWechat"></i>
				</view>
				<view class="topView-setting" @click="goto(noticeItem)">
					<image class="cellImg" :src="noticeItem.imgsrc"></image>
					<label class="titleStyle">{{ noticeItem.name }}</label>
					<i class="iconfont cellrightImg iconarrow-right"></i>
				</view>
			</view> -->
      <view class="model-view">
        <view class="topView-setting" @click="updateVersion">
          <image class="cellImg" src="/static/my/icon_version.png"></image>
          <label class="titleStyle"> 版本 </label>
          <view style="
              padding-right: 8px;
              font-size: 14px;
              color: #333333;
              text-align: center;
            ">
            v{{ version }}
          </view>
          <view class="circle-view" v-if="downloadUrl"></view>
        </view>
        <view class="topView-setting" @click="goto(item)" v-for="(item, index) in items" :key="index">
          <image class="cellImg" :src="item.imgsrc"></image>
          <label class="titleStyle">{{ item.name }}</label>
          <i class="iconfont cellrightImg iconarrow-right"></i>
        </view>
      </view>
      <view class="bottom-view">
        <view class="bottom-right-view" @click="loginOut" v-if="itemDic.username">
          <text>退出登录</text>
        </view>
      </view>
    </view>
    <c-scan-device-pop ref="scanPop"></c-scan-device-pop>
    <c-official-popup ref="op"></c-official-popup>
    <!-- <upgrade title="发现新版本" ref="upgrade" :description="description" :downloadUrl="downloadUrl" :forced="false" /> -->
    <!-- <c-tab-bar active="user"></c-tab-bar> -->
  </view>
</template>

<script>
// import Upgrade from "@/components/common/upgrade/upgrade.vue";
import { mapState } from "vuex";
import tabMixin from "@/mixins/customTabbar";
export default {
  components: {
    // Upgrade,
  },
  mixins: [tabMixin],
  name: "user",
  data() {
    return {
      // pversion: '',
      isBindWechat: false,
      noticeItem: {
        name: "消息提醒",
        imgsrc: "/static/my/icon_remind.png",
        color: "#FEA736 ",
        url: "/otherPages/setting/notice-setting",
      },

      items: [
        // #ifndef MP
        {
          name: "帮助",
          imgsrc: "/static/my/icon_help.png",
          color: "#3F8BFF",
          url: "/otherPages/setting/help-list",
          decoration: "bottom-line",
        },
        {
          name: "隐私政策",
          imgsrc: "/static/my/icon_privacy.png",
          color: "#FFAC04 ",
          url:
            "/pages/main/webview?url=" +
            encodeURIComponent("https://www.sanygroup.com/privacy/"),
        },
        // #endif
      ],
      itemDic: {},
      description: "",
      downloadUrl: null,
      hasBusinessApply: false,
      hasSettleTodoApply: false,
    };
  },
  computed: {
    ...mapState("system", {
      version: "version",
      versionCode: "versionCode",
      tabBarHeight: "tabBarHeight",
    }),
    ...mapState("user", {
      todoCount: "todoCount",
      settleTodoCount: "settleTodoCount",
      messageCount: "messageCount",
    }),
    menus() {
      return [
        [
          {
            name: this.todoCount ? `我的待办（${this.todoCount}）` : "我的待办",
            imgsrc: "/static/my/icon_todo.png",
            color: "#FFAC04",
            url: "/otherPages/notify/notification-tabbar",
          },
         
          ...(this.hasSettleTodoApply ? [ {
            name: this.settleTodoCount ? `结算待办（${this.settleTodoCount}）` : "结算待办",
            imgsrc: "/static/my/icon_settle.png",
            color: "#FFAC04",
            url: "/otherPages/notify/settle-notifications",
          },] : []),
          {
            name: this.messageCount ? `重要提醒（${this.messageCount}）` : "重要提醒",
            imgsrc: "/static/my/icon_remind.png",
            color: "#3F8BFF ",
            url: "/otherPages/notify/importance-notification",
          },
          ...(this.hasBusinessApply ? [{
            name: "业务申请",
            imgsrc: "/static/my/icon_remind.png",
            color: "#3F8BFF ",
            url: "/otherPages/notify/business-apply",
          }] : []),
          {
            name: "数据图表",
            imgsrc: "/static/my/icon_chart.png",
            color: "#3F8BFF ",
            url: "/otherPages/data-charts/data-charts",
          },
          {
            name: "我的订单",
            imgsrc: "/static/my/icon_order.png",
            color: "#3F8BFF ",
            url: "/subOtherPages/coupon/orderList",
          },
        ],
        [
          {
            name: "账号信息",
            imgsrc: "/static/my/icon_account.png",
            color: "#FFAC04",
            url: "/otherPages/setting/mymessage",
          },
          {
            name: "微信通知",
            imgsrc: "/static/my/icon_weixin.png",
            color: "#FFAC04",
          },
          {
            name: "修改密码",
            imgsrc: "/static/my/icon_password.png",
            color: "#3F8BFF ",
            url: "/otherPages/setting/resetMM",
          },
        ],
      ];
    },
  },
  onLoad() {
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    console.log(ps,'ps9999999999999999999999')
    if (ps) {
      this.hasBusinessApply = ps.some(
        (x) => x.value === 'businessApply'
      );
      this.hasSettleTodoApply = ps.some(
        (x) => x.value === 'settleTodo'
      );
      console.log(this.hasSettleTodoApply,'this.hasSettleTodoApply');
    }
    // #ifdef APP-PLUS
    let platform = uni.getSystemInfoSync().platform;
    this.checkUpdate(platform);
    // #endif
    let self = this;
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: function (res) {
        self.itemDic = res.data;
        // self.getWeiXinInfo();
      },
    });
    uni.$on("refresh-user", (userinfo) => {
      let self = this;
      setTimeout(() => {
        this.$network
          .getData(this.$url.USER_INFO, "GET", null)
          .then((result) => {
            let str = JSON.stringify(result);
            this.itemDic = JSON.parse(str);
            //保存用户信息
            uni.setStorage({
              key: this.$savekey.USER_INFO_MEG,
              data: result,
              success: () => {
                this.$datestr.printlog("result");
              },
              fail: () => {
                this.$datestr.printlog("fail");
                uni.hideLoading();
                uni.showToast({
                  title: "登录失败请重试",
                  duration: 1500,
                });
              },
            });
          })
          .catch((err) => {
            this.$datestr.printlog("error");
            uni.hideLoading();
          });
      }, 100);
    });
    // this.getproversion();
  },

  onUnload() {
    uni.$off("refresh-user");
  },
  onShow() {
    // if (this.itemDic.id) {
    // 	this.getWeiXinInfo();
    // }
    this.getToDoCount();
  },
  methods: {
    async getToDoCount() {
      let param = {
        current: 1,
        size: 1,
      };
      let result = await this.$network.getData(this.$url.TO_DO_LIST, "POST", param);
      let totalStr = result.total.toString() ? result.total.toString() : "0";
      let result3 = await this.$network.getData(this.$url.SETTLE_REMIND_PAGE, 'POST', { ...param, size: 5, state: 0 });
      this.$store.commit("user/setState", { todoCount: parseInt(totalStr) });
      this.$store.commit("user/setState", { settleTodoCount: parseInt(result3.total) });
    },

    // getproversion() {
    // 	this.$network
    // 		.getData(this.$url.CHECK_PRODUCT_VERSION, 'GET')
    // 		.then(result => {
    // 			this.pversion = result.toString();
    // 		})
    // 		.catch(err => {});
    // },
    popScan(licenseId) {
      this.$refs.scanPop.open(licenseId);
    },
    checkUpdate(platform) {
      let url = "";
      if (platform === "android") {
        url = this.$url.CHECK_UPDATE_URL + "android";
      } else {
        url = this.$url.CHECK_UPDATE_URL + "ios";
      }
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          uni.hideLoading();
          if (result) {
            if (this.versionCode < result.versionCode) {
              this.description = result.description;
              if (platform === "android") {
                this.downloadUrl = result.url;
              } else {
                this.downloadUrl = "itms-apps://apps.apple.com/cn/app/id1454483497";
              }
            }
          }
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.message ? err.message : err.data.message ? err.data.message : "",
          });
        });
    },
    updateVersion() {
      if (this.downloadUrl) {
        this.$refs.upgrade.show();
      }
    },
    isshowLab(item) {
      if (item.name === "修改密码" && this.$gxfmethod.issameRoleType(this.itemDic, "0")) {
        return false;
      }
      return true;
    },
    toBind() {
      if (!this.isBindWechat) {
        uni.navigateTo({
          url: "/otherPages/setting/wx-qrcode",
        });
      }
    },
    goto(item) {
      if (item.url) {
        return uni.navigateTo({
          url: item.url,
        });
      }
      if (item.name == "微信通知") {
        //弹关注公众号 https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz
        // console.log(item);
        this.$refs.op.open();
      }
    },
    deleteCid() {
      let clientInfo = plus.push.getClientInfo();
      let url = this.$url.DELETE_CID + "/" + clientInfo.clientid;
      this.$network
        .getData(url, "DELETE", null)
        .then((result) => { })
        .catch((err) => { });
    },
    getWeiXinInfo() {
      let url = this.$url.WEIXIN_INFO.replace(/{userId}/, this.itemDic.id);
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.isBindWechat = result && result.wxOpenId ? true : false;
        })
        .catch((err) => { });
    },

    loginOut() {
      uni.showModal({
        title: "提示",
        content: "确定退出登录?",
        success: (res) => {
          if (res.confirm) {
            // #ifdef APP-PLUS
            this.deleteCid();
            // #endif

            uni.removeStorageSync(this.$savekey.LOGIN_MEG);
            uni.removeStorage({
              key: this.$savekey.USER_INFO_MEG,
              success: (res) => {
                this.$datestr.printlog("success");
              },
              fail: (err) => {
                console.log(err);
              },
            });

            uni.removeStorage({
              key: this.$savekey.USER_PRIVILEGES_MEG,
              success: (res) => {
                this.$datestr.printlog("success");
              },
              fail: (err) => {
                console.log(err);
              },
            });
            uni.removeStorage({
              key: "sys_dic",
              success: (res) => {
                this.$datestr.printlog("success");
              },
              fail: (err) => {
                console.log(err);
              },
            });
            uni.removeStorage({
              key: this.$savekey.MY_ALL_MENUS,
              success: (res) => {
                this.$datestr.printlog("success");
              },
              fail: (err) => {
                console.log(err);
              },
            });
            uni.removeStorage({
              key: this.$savekey.MY_ADD_MENUS,
              success: (res) => {
                this.$datestr.printlog("success");
              },
              fail: (err) => {
                console.log(err);
              },
            });
            uni.clearStorageSync();
            uni.reLaunch({
              url: "../login?back=1",
            });
            // uni.getStorage({
            //   key: "versonKey",
            //   success: function (res) {
            //     if (res.data === "lgzj") {
            //       uni.reLaunch({
            //         url: "../lgzjlogin?back=1",
            //       });
            //     } else {
            //       uni.reLaunch({
            //         url: "../login?back=1",
            //       });
            //     }
            //   },
            // });
          }
        },
      });
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.bgview {
  display: flex;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.top-view {
  height: 175px;
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
}

.top-bg {
  height: 130px;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.headView {
  z-index: 20;
  width: calc(100% - 24px);
  margin: 0px 12px;
  height: 90px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(207, 207, 207, 0.5),
    0px 4px 4px 0px rgba(41, 7, 8, 0.03);
  border-radius: 6px;
}

.headImg {
  width: 48px;
  height: 48px;
  margin-left: 24px;
  background: #ffffff;
  // border-radius: 50%;
}

.rightView {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 12px;
  justify-content: center;
}

.nickStyle {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #222222;
  line-height: 24px;
}

.positionStyle {
  margin-top: 10px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #666666;
  line-height: 16px;
}

.content-view {
  width: calc(100% - 24px);
  margin: 12px;
}

.model-view {
  width: calc(100% - 24px);
  background: #ffffff;
  border-radius: 4px;
  padding: 0px 12px;
  box-shadow: 0px 2px 8px 0px rgba(207, 207, 207, 0.5);
  margin-bottom: 12px;
}

.topView-setting {
  display: flex;
  width: 100%;
  padding: 12px 0px;
  align-items: center;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.cellImg {
  font-size: 18px;
  width: 18px;
  height: 18px;
  color: #e60000;
  text-align: center;
  margin-right: 12px;
  line-height: 30px;
}

.titleStyle {
  flex: 1;
  color: #222831;
  font-size: 14px;
}

.cellrightImg {
  color: #999999;
  font-size: 24px;
  text-align: center;
  line-height: 15px;
}

.bottom-view {
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  z-index: 100;
  margin-top: 50px;
  padding-bottom: 30px;
}

.bottom-right-view {
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(207, 207, 207, 0.5);
  border-radius: 6px;
  display: flex;
  flex: 1;
  padding: 12px 0px;
  font-size: 18px;
  color: #e60000;
  align-items: center;
  justify-content: center;
}

.circle-view {
  height: 6px;
  width: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background-color: #ff0000;
}
</style>
