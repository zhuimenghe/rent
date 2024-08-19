<template>
  <view class="content">
    <image class="logoimg" mode="aspectFit" src="/static/image/logo.png" :style="{ marginTop: `${headHeight}px` }" />
    <view class="welcome-view">
      <view>hello,你好</view>
      <view style="margin-top: 12px">欢迎登录三一智慧租赁系统</view>
    </view>
    <view class="userview">
      <text class="textStyle">{{ $t("login.team") }}</text>
      <view class="row-line">
        <i class="iconfont input-icon iconqiye1"></i>
        <input class="userFieldStyle" :placeholder="$t('login.teamPlaceholder')" v-model="teamId" />
      </view>
    </view>
    <view class="passviewOut">
      <text class="textStyle">{{ $t("login.account") }}</text>
      <view class="row-line">
        <i class="iconfont input-icon iconzhanghao"></i>
        <input class="userFieldStyle" :placeholder="$t('login.accountPlaceholder')" v-model="userName" />
      </view>
    </view>
    <view class="passviewOut">
      <text class="textStyle">{{ $t("login.password") }}</text>
      <view class="passview">
        <view class="row-line" style="flex: 1">
          <i class="iconfont input-icon iconsuoding"></i>
          <input class="pasFieldStyle" v-bind:password="isShow" :placeholder="$t('login.passwordPlaceholder')"
            v-model="passWord" />
        </view>

        <image class="eyestyle" @click="changeEye" v-bind:src="imgsrc"></image>
      </view>
    </view>
    <view class="checkView">
      <checkbox class="checkstyle" color="#E60000" @click="remenberPassWord" v-bind:checked="isSelected">
        {{ $t("login.remember") }}
      </checkbox>
    </view>
    <button class="btnstyle bg-primary" @click="loginclick">
      {{ btnTitle }}
    </button>
    <button class="btnstyle bg-warn" @click="registerClick">企业注册</button>
    <button class="btnstyle line-primary bg-page" @click="skipLogin">
      游客登录
    </button>
    <view class="rule-view">
      <checkbox class="checkstyle" color="#E60000" :checked="checkRule" @click="checkRule = !checkRule" />
      <view>我已阅读并接受该</view>
      <view style="color: #fe931f" @click="goTo">《法律声明和隐私条款》</view>
    </view>
    <!-- 	<view class="bottomView">
			<text class="textStyle">──── &nbsp;&nbsp; {{ $t('login.company') }} &nbsp;&nbsp; ────</text>
		</view> -->
    <view class="pop-container">
      <uni-popup ref="privacyTip" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="flow-choose">
            <view class="model-tag"><text>隐私权限</text></view>
            <view class="pop-content">
              <p>
                您在使用北谷租赁管家前，请认真阅读并充分理解相关用户条款、平台规则及隐私政策。当您点击同意相关条款，并开始使用产品或服务，即表示您已经理解并同意该条款，该条款将构成对您具有法律约束力的文件。
              </p>
              <p style="color: #000000; font-weight: bold; margin: 8px 0px">
                用户隐私政策主要包含以下内容：
              </p>
              <p>
                1.个人信息（包括手机号码、位置、行程信息等）的手机使用规则及设备权限的调用情况
              </p>
              <p>
                2.您确认当前页面并不会直接开启相关权限，我们会就具体权限开启另行征得您的同意。
              </p>
              <p>
                <a style="color: #e60000" @click="goTo()">相关法律条款及隐私政策</a>
              </p>
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="clickPrivacy('cancel')">拒绝</text>
            <text class="uni-tip-button pop-confirm" @click="clickPrivacy('agree')">同意</text>
          </view>
        </view>
      </uni-popup>
    </view>
    <!-- <upgrade
      title="发现新版本"
      ref="upgrade"
      :description="description"
      :downloadUrl="downloadUrl"
      :updateCode="updateCode"
      :forced="forced"
    /> -->
    <modifyPwdPopup ref="modifyPop" :isComponent="true" :isOldPwd="true" :userName="userName" :tenant="teamId"
      title="温馨提示" subTitle="距上次修改密码已超过90天,为了您的账号安全,请及时修改密码" @confirm="updateOldPwdCompleted" />
  </view>
</template>

<script>
// import Upgrade from "@/components/common/upgrade/upgrade.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import modifyPwdPopup from "@/components/common/common-ui/modify-pwd-pop.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    // Upgrade,
    uniPopup,
    modifyPwdPopup,
  },
  data() {
    return {
      teamId: "",
      userName: "",
      passWord: "",
      btnTitle: this.$t("login.login"),
      isShow: true,
      isSelected: true,
      imgsrc: "/static/image/login_icon_invisible.png",
      versionCode: 1000,
      updateCode: 1000,
      description: "",
      islogin: true,
      downloadUrl: null,
      forced: true,
      checkRule: false,
      code: "",
      redirectUrl: "",
    };
  },
  computed: {
    ...mapState("system", {
      headHeight: (s) => s.statusBarHeight + s.titleBarHeight - 10,
    }),
  },
  async onLoad(option) {
    //分享登录页时不应该携带任何参数(redirectUrl)
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    this.$share.path = `/${currentPage.route}`
    //401重定向过来，登陆成功跳转相信页面
    this.redirectUrl = decodeURIComponent(option.redirectUrl || "");
    //判断有没有token有token 就自动登录
    let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
    if (loginMes && loginMes.access_token) {
      this.islogin = true;
    } else {
      this.islogin = false;
    }
    if (option.back == "1") {
      this.islogin = false;
    }
    this.teamId = uni.getStorageSync("teamId");
    this.userName = uni.getStorageSync("userName");
    this.passWord = uni.getStorageSync("passWord");
    uni.setStorage({
      key: "versonKey",
      data: "other",
      success: () => { },
      fail: () => { },
    });
    // #ifdef APP-PLUS
    //更新策略优化
    setTimeout(() => {
      plus.runtime.getProperty(plus.runtime.appid, (item) => {
        this.versionCode = Number.parseInt(item.versionCode);
        this.checkUpdate();
      });
    }, 100);
    // #endif
  },
  onReady() {
    // let openedApp = uni.getStorageSync(this.$savekey.IS_OPENED_APP);
    // if (!openedApp) {
    // 	uni.setStorageSync(this.$savekey.IS_OPENED_APP, true);
    // 	this.checkRule = false;
    // 	// this.$refs.privacyTip.open()
    // } else {
    // 	setTimeout(() => {
    // 		plus.runtime.getProperty(plus.runtime.appid, item => {
    // 			this.versionCode = Number.parseInt(item.versionCode);
    // 			this.checkUpdate();
    // 		});
    // 	}, 100);
    // }
  },
  methods: {
    ...mapActions('global', ['login']),
    clickPrivacy(type) {
      switch (type) {
        case "cancel":
          this.checkRule = false;
          break;
        case "agree":
          this.checkRule = true;
          break;
        default:
          break;
      }
      this.$refs.privacyTip.close();
      // #ifdef APP-PLUS
      setTimeout(() => {
        plus.runtime.getProperty(plus.runtime.appid, (item) => {
          console.log(item);
          this.versionCode = Number.parseInt(item.versionCode);
          this.checkUpdate();
        });
      }, 100);
      // #endif
    },
    goTo() {
      uni.navigateTo({
        url:
          "/pages/main/webview?url=" +
          encodeURIComponent(this.$url.BASE_SHARE_URL + "protocol.html"),
      });
    },
    checkUpdate() {
      let platform = uni.getSystemInfoSync().platform;
      let url = "";
      if (platform === "android") {
        url = this.$url.CHECK_UPDATE_URL + "android";
      } else {
        url = this.$url.CHECK_UPDATE_URL + "ios";
      }
      let param = {
        versionCode: this.versionCode.toString(),
      };
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          if (result) {
            this.getUpdateData(result);
          }
        })
        .catch((err) => {
          if (err) {
            uni.showToast({
              icon: "none",
              title: err.message
                ? err.message
                : err.data.message
                  ? err.data.message
                  : "",
            });
          } else {
          }
        });
    },
    getUpdateData(result) {
      if (this.versionCode < result.versionCode) {
        this.updateCode = result.versionCode;
        this.forced = result.forced;
        this.description = result.description;
        let platform = uni.getSystemInfoSync().platform;
        if (platform === "android") {
          this.downloadUrl = result.url;
        } else {
          this.downloadUrl = "itms-apps://apps.apple.com/cn/app/id1454483497";
        }
        // plus.runtime.openURL("itms-apps://apps.apple.com/cn/app/id1511886081");
        // plus.runtime.openURL("itms-apps://apps.apple.com/cn/app/id1454483497");
        //有记录升级数据，并且升级版本大于或等于当前升级版本时，不提示升级
        let updateVersion = uni.getStorageSync("updateVersion");
        if (updateVersion && Number(updateVersion) >= Number(this.updateCode)) {
          this.judgeLogin();
        } else {
          this.$refs.upgrade.show();
        }
      } else {
        this.judgeLogin();
      }
    },
    judgeLogin() {
      if (
        this.code ||
        (this.teamId && this.userName && this.passWord && this.islogin)
      ) {
        if (!this.checkRule) {
          uni.showToast({
            title: "请同意法律声明和隐私条款",
            icon: "none",
          });
          return;
        }
        this.accountLogin();
      }
    },
    //是否显示密码
    changeEye: function () {
      if (this.isShow == false) {
        this.imgsrc = "/static/image/login_icon_invisible.png";
      } else {
        this.imgsrc = "/static/image/login_icon_visual.png";
      }
      this.isShow = !this.isShow;
    },
    //是否记住密码
    remenberPassWord: function () {
      this.isSelected = !this.isSelected;
    },
    registerClick() {
      uni.navigateTo({ url: "/subOtherPages/register/index" });
    },
    skipLogin() {
      uni.switchTab({ url: "/pages/main/home/home-static" });
    },
    // 登录操作
    loginclick() {
      // this.$datestr.printlog('登录开始')
      // uni.switchTab({
      // 	url: './main/charts'
      // });
      // return;

      // let bb = {
      //   teamId:  "login.teamPlaceholder",
      //   userName:"login.accountPlaceholder"
      // }
      // let  S  = Object.keys(bb).find((item)=> this[item] === '')

      // if (s) return  uni.showToast({
      //     title: this.$t("login.teamPlaceholder"),
      //     icon: "none",
      //   }

      if (this.teamId == "") {
        uni.showToast({
          title: this.$t("login.teamPlaceholder"),
          icon: "none",
        });
        return;
      }
      if (this.userName == "") {
        uni.showToast({
          title: this.$t("login.accountPlaceholder"),
          icon: "none",
        });
        return;
      }
      if (this.passWord == "") {
        uni.showToast({
          title: this.$t("login.passwordPlaceholder"),
          icon: "none",
        });
        return;
      }

      uni.setStorage({
        key: "teamId",
        data: this.teamId,
        success: () => {
          this.$datestr.printlog("success");
        },
      });
      uni.setStorage({
        key: "userName",
        data: this.userName,
        success: () => {
          this.$datestr.printlog("success");
        },
      });
      if (this.isSelected) {
        uni.setStorage({
          key: "passWord",
          data: this.passWord,
          success: () => {
            this.$datestr.printlog("success");
          },
        });
      } else {
        uni.removeStorage({
          key: "passWord",
        });
      }
      if (!this.checkRule) {
        uni.showToast({
          title: "请同意法律声明和隐私条款",
          icon: "none",
        });
        return;
      }
      this.accountLogin();
    },
    updateOldPwdCompleted() {
      this.passWord = "";
    },
    //用户名密码登陆
    async accountLogin() {

      let username = `${this.userName.trim()}@${this.teamId.trim()}`;
      // #ifdef MP
      let [err, res] = await uni.login();
      if (err) {
        uni.showToast({ title: "微信登陆失败", icon: "none" });
      }
      let code = res.code;
      username = `${this.userName}@${this.teamId}#${code}`;
      // #endif
      let password = this.$gxfmethod.encrypt(this.passWord.trim());
      this.login({ username, password }).then(() => {
        this.navigationToTab();
      }).catch((err) => {
        //密码超过90天未修改
        if (err.code == 419) {
          if (this.$refs.modifyPop) {
            this.$refs.modifyPop.open();
          }
        } else {
          if (err.code == 401) {
            uni.showToast({
              icon: "none",
              title: "账号密码错误",
              duration: 3000,
            });
          } else {
            uni.showToast({
              icon: "none",
              title: err.message || err.errMsg,
              duration: 3000,
            });
          }
        }
      });
    },
    //跳转到tabbar
    navigationToTab() {
      if (this.redirectUrl) {
        console.log(this.redirectUrl);
        uni.reLaunch({
          url: this.redirectUrl,
        });
      } else {
        uni.switchTab({
          url: "/pages/main/home/home-static",
        });
      }
    },
  },
};
</script>

<style lang="scss">
page{
	background-color: #ffffff;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  background: #ffffff;
  opacity: 0.9;
  position: relative;
}

.logoimg {
  width: 150px;
  height: 60px;
  margin-left: calc(10%);
}
.welcome-view {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  border-left: 4px solid #e60000;
  font-size: 18px;
  padding: 8px 8px;
  margin-top: 32px;
  margin-bottom: 16px;
  margin-left: calc(10%);
}

.input-icon {
  align-self: center;
  font-size: 16px;
  color: #999999;
  margin: 5px;
}
.textStyle {
  color: #999999;
  font-size: 11px;
  margin-left: 5px;
}

.userview {
  margin-top: 40px;
  width: 80%;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
  align-self: center;
}

.userFieldStyle {
  margin: 5px 5px 5px 5px;
  height: 30px;
  font-size: 14px;
  justify-content: center;
  color: #222831;
}

.passviewOut {
  margin-top: 15px;
  width: 80%;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
  align-self: center;
}

.passview {
  display: flex;
  margin: 5px 0px 5px 0px;
  width: 100%;
  align-self: center;
}

.pasFieldStyle {
  margin: 5px;
  height: 30px;
  justify-content: center;
  font-size: 14px;
  color: #222831;
}

.eyestyle {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  align-self: center;
}

.checkView {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin-top: 10px;
  align-self: center;
  justify-content: flex-end;
}

.rule-view {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin-top: 14px;
  line-height: 24px;
  align-items: center;
  align-self: center;
  justify-content: flex-start;
  font-size: 13px;
  z-index: 300;
}

.checkstyle {
  font-size: 20px;
  color: #cccccc;
  transform: scale(0.7);
}

.btnstyle {
  margin-top: 18px;
  width: 80%;
  height: 40px;
  font-size: 14px;
  // background: linear-gradient(360deg, #fd743d 0%, #f52f00 100%);
  text-align: center;
  line-height: 40px;
  color: #ffffff;
}

// .bottomView {
//   position: absolute;
//   bottom: 30px;
//   display: flex;
//   justify-content: center;
//   width: 100%;
// }

.pop-container {
  position: relative;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}

.flow-choose {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 4px;
}

.model-tag {
  display: flex;
  flex: 1;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: center;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-weight: bold;
  font-size: $uni-font-size-base;
  align-items: center;
}

.pop-content {
  color: $uni-text-color;
  padding-top: 4px;
  font-size: $uni-font-size-base;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;

  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}
</style>
