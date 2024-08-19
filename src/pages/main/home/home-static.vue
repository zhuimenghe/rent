<template>
  <view class="bgclass" :style="{ paddingBottom: `${tabBarHeight + 10}px` }">
    <!-- <view class="search-style"><searchView ref="searchview" /></view> -->
    <!-- <view class="sub-view"></view> -->
    <!-- <searchView/> -->
    <!-- <taskView ref="taskview" /> -->
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar :show-back="false" backgroundColor="#fff">
      <image class="logo" src="/static/logo.png"></image>
      <view class="org-bg" @click="showPick({type:'org'})">
          <view class="org-content">{{ orgDic.label }}</view>
          <i class="iconfont org-icon iconzl--zhankai"></i>
        </view>
      <!-- <view
        class="search-box"
        :style="{ marginRight: searchRight + 'px' }"
        @click="searchFunc"
      >
        <i class="iconfont search-icon iconzl--sousuo"></i>
        <view class="search-content"> 请输入关键字 </view>
      </view> -->
    </c-nav-bar>
    <navigator
      v-if="hasActivity"
      url="/subOtherPages/coupon/activity"
      class="banner-wrapper"
    >
      <image class="banner" :src="mainPath" mode="aspectFill" />
    </navigator>

    <funcView ref="funcview" />
    <dataView ref="dataview" @showPick="showPick" :org-dic="orgDic"/>
    <!-- 弹窗 -->
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <w-picker
      :selectList="orgList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <c-official-popup ref="op"></c-official-popup>
    <c-scan-device-pop ref="scanPop"></c-scan-device-pop>
    <!-- <c-tab-bar active="home"></c-tab-bar> -->
  </view>
</template>

<script>
import { mapMutations } from "vuex";
import funcView from "./home-components/home-function.vue";
import dataView from "./home-components/home-data.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import tabMixin from "@/mixins/customTabbar";
import { mapState } from "vuex";
export default {
  components: {
    funcView,
    dataView,
    wPicker,
  },
  name: "home",
  mixins: [tabMixin],
  data() {
    return {
      pickType: "",
      //车辆使用区域
      orgDic: {
        value: "",
        label: "全部区域",
      },
    };
  },
  computed: {
    ...mapState("system", {
      tabBarHeight: "tabBarHeight",
      searchRight: (s) => s.systemInfo.windowWidth - s.menuBtnRect.left,
    }),
    ...mapState("coupon", {
      hasActivity: (s) => !!s.activity,
      mainPath: (s) => (s.activity ? s.activity.mainPath : ""),
    }),
    orgList() {
      return [
        {
          value: "",
          label: "全部区域",
        },
        ...this.$store.state.global.orgs,
      ];
    },
  },
  // onShow() {
  //   if (this.$refs.searchview) {
  //     this.$refs.searchview.loadImportanceNum();
  //   }
  // },
  onPullDownRefresh() {
    this.init();
  },
  async onLoad() {
    // 更新常用功能
    uni.$on("refresh-home-menus", () => {
      this.$refs.funcview.refreshFunctionList();
    });
    uni.setStorage({
      key: "versonKey",
      data: "other",
      success: () => {},
      fail: () => {},
    });
    await getApp().globalData.loginPromise;
    setTimeout(() => {
      if (!this.$store.state.user.oaOpenid) {
        this.$refs.op.open();
      }
    }, 1000);
    this.init();
  },
  onUnload() {
    uni.$off("refresh-home-menus");
  },
  mounted() {
    // this.popScan()
  },
  methods: {
    ...mapMutations("global", ["updateOrgs"]),
    searchFunc() {
      uni.navigateTo({
        url: "/otherPages/global-search/global-search",
      });
    },
    popScan(licenseId) {
      this.$refs.scanPop.open(licenseId);
    },
    // 选择区域时间
    showPick(dict) {
      this.pickType = dict.type;
      if (this.pickType == "org") {
        this.$refs.selector.show();
      } else {
        this.$refs.date.show();
      }
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "start":
          let startTime = val.result;
          this.$refs.dataview.setDataStartTime(startTime);
          break;
        case "end":
          let endTime = val.result;
          this.$refs.dataview.setDataEndTime(endTime);
          break;
        case "org":
          let orgIdList = [];
          if (val.checkArr.value !== "") {
            orgIdList = this.$datestr.getOrgIdList(val.checkArr);
          } else {
            orgIdList = [];
          }
          let orgDic = val.checkArr;
          this.orgDic = orgDic;
          this.$refs.dataview.setDataOrgIdList(orgIdList, orgDic);
          break;
        default:
          break;
      }
    },
    uploadCid() {
      let clientInfo = plus.push.getClientInfo();
      let url = this.$url.POST_CID.replace(/{cid}/, clientInfo.clientid);
      this.$network
        .getData(url, "POST", null)
        .then((result) => {})
        .catch((err) => {});
    },
    uploadDeviceMessage() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (item) => {
        let itemDic = {
          ...plus.os,
          model: plus.device.model,
          appVersion: item.version,
        };
        let param = {
          device: JSON.stringify(itemDic),
        };
        let url = this.$url.POST_DEVICE;
        this.$network
          .getData(url, "POST", param)
          .then((result) => {})
          .catch((err) => {});
      });
      // #endif
    },
    confirm() {},
    init() {
      //获取区域
      let p1 = this.$refs.dataview.getOverViewData();
      let p2 = this.$refs.dataview.init();
      let p3 = this.$refs.funcview.getMyAddMenus();

      // #ifdef APP-PLUS
      this.uploadCid();
      // #endif
      this.uploadDeviceMessage();
      this.$store.dispatch("coupon/fetchRunningActivity");
      Promise.all([p1, p2, p3])
        .then((res) => {
          uni.stopPullDownRefresh();
        })
        .catch((err) => {
          uni.stopPullDownRefresh();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.bgclass {
  position: relative;
  width: 100%;
  background-color: $uni-bg-color-grey;
  padding-bottom: 10px;
  overflow-y: hidden;
}
// .search-style {
//   position: fixed;
//   width: 100%;
//   top: 0px;
//   z-index: 300;
//   background-color: #ffffff;
// }
// .sub-view {
//   height: 130px;
// }
.logo {
  width: 54rpx;
  height: 64rpx;
  margin-right: 25rpx;
}
// .search-box {
//   flex: 1;
//   height: 58rpx;
//   display: flex;
//   flex-direction: row;
//   padding-left: 10px;
//   border-radius: 100px;
//   justify-content: flex-start;
//   align-items: center;
//   border: 1rpx solid #e6e6e6;
// }

// .search-icon {
//   color: #999999;
//   font-size: $uni-font-size-base;
// }

// .search-content {
//   display: flex;
//   flex: 1;
//   color: #999999;
//   font-size: $uni-font-size-base;
//   margin-left: 10px;
// }
.banner-wrapper {
  background-color: $uni-bg-color;
  padding: 0 30rpx;
  padding-top: 8px;
}
.banner {
  width: 100%;
  height: 272rpx;
  display: block;
  border-radius: 4px;
}
.org-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.org-content {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}
.org-icon {
  margin-left: 5px;
  color: #222831;
  font-size: $uni-font-size-lg;
}
</style>
