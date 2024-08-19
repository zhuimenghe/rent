<template>
  <view class="record-detail-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap"
      >监控详情</c-nav-bar-btns
    >
    <view class="flex-scroll-wrapper">
      <!-- 主要布局 -->
      <monitorDetailHead
        :dataDic="dataDic"
        :qrcodeUrl="qrcodeUrl"
        :downloadQrcodeUrl="qrcodeUrl"
        :iconList="iconList"
      />
      <sun-tab
        :value.sync="tabindex"
        :tabList="tabList"
        :scroll="false"
        @change="arrayChange"
        activeColor="#E60000"
        defaultColor="#7B8395"
        activebgColor="#FFFFFF"
        defaultbgColor="#FFFFFF"
        :shownum="false"
      />
      <working-hours :licenseId="licenseId" v-if="tabindex == 0" />
      <battery-curve
        :dataDic="dataDic"
        :licenseId="licenseId"
        :deviceNum="deviceNum"
        v-if="isLG ? false : tabindex == 1"
      />
      <fault-warning
        :licenseId="licenseId"
        v-if="isLG ? tabindex == 1 : tabindex == 2"
      />
      <track-positioning
        :licenseId="licenseId"
        :carlatitudeNum="dataDic.amaplatitudeNum"
        :carlongitudeNum="dataDic.amaplongitudeNum"
        :caraddress="dataDic.address"
        :machineTypeId="dataDic.machineTypeId"
        v-if="isLG ? tabindex == 2 : tabindex == 3"
      />
    </view>
    <device-share ref="share" :d="dataDic"></device-share>
    <view class="actions-footer-flex">
      <view class="z-btn bg-warn" @click="share">分享设备</view>
    </view>
  </view>
</template>

<script>
import monitorDetailHead from "@/devicePages/monitor/monitor-detail-components/monitor-detail-head.vue";
import sunTab from "@/components/common/sun-tab/sun-tab.vue";
import workingHours from "./components/working-hours.vue";
import batteryCurve from "./components/battery-curve.vue";
import faultWarning from "./components/fault-warning.vue";
import DeviceShare from "@/devicePages/components/device-share.vue";
import trackPositioning from "./components/track-positioning.vue";
import {mapState} from 'vuex'
export default {
  components: {
    monitorDetailHead,
    sunTab,
    workingHours,
    batteryCurve,
    faultWarning,
    trackPositioning,
    DeviceShare
  },
  data() {
    return {
      navBtns: [
        // {
        //   fontSize: "18px",
        //   color: "#000000",
        //   text: "\ue608",
        //   fontSrc: "/static/font-icon/iconfont.ttf",
        // },
        {
          fontSize: "18px",
          color: "#000000",
          text: "\ue6d3",
          fontSrc: "/static/font-icon/iconfont.ttf",
        },
      ],
      dataDic: {},
      qrcodeUrl: "",
      downloadQrcodeUrl: "",
      iconList: [
        { icon: "iconzl--suoche" },
        { icon: "iconzl--tongxunxinhao" },
        { icon: "iconzl--dingweixinhao" },
        { icon: "iconzl--baojing" },
      ],
      tabList: ["设备工况", `电池监控`, "异常监控", "设备轨迹"],
      tabindex: 0,
      licenseId: "",
      deviceNum: "",
      isLG: false,
      oilMachine: this.$store.state.machine.oilMachine,
    };
  },
  computed:{
    ...mapState('user',{
      identifier:s=>s.lesseeInfo.identifier
    })
  },
  // onPageScroll(e) {
  // 	if (e.scrollTop >= 165) {
  // 		this.showTab = true;
  // 	}else{
  // 		this.showTab = false;
  // 	}
  // },
  onLoad(option) {
    if (option.licenseId) {
      this.licenseId = option.licenseId;
      this.deviceNum = option.deviceNum;
      this.getDetailWithLiceseID(option.licenseId);
      let baseUrl = this.$url.BASE_URL + this.$url.DEVICE_ERCODE_IMG_LOGO
      this.qrcodeUrl = `${baseUrl}?licenseId=${option.licenseId}&schema=${this.identifier}`
    }
    let versonKey = uni.getStorageSync("versonKey");
    if (versonKey == "lgzj") {
      this.isLG = true;
      this.tabList = [...["设备工况", "异常监控", "设备轨迹"]];
    } else {
      this.isLG = false;
      this.tabList = [...["设备工况", "电池监控", "异常监控", "设备轨迹"]];
    }
  },
  onUnload() {
    uni.$off("refresh-device-circle");
  },
  onReachBottom() {
    // this.page = this.page + 1;
    // this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
  },
  methods: {
    share(){
      this.$refs.share.share()
    },
    onNavBarButtonTap(e) {
      if (e.text == '\ue608') {
        uni.navigateTo({
          url:
            "/devicePages/control/lock-vehicle?licenseId=" + this.licenseId,
        });
      } else if (e.text == '\ue6d3') {
        uni.navigateTo({
          url:
            "/devicePages/record/device-record-detail?licenseId=" +
            this.licenseId,
        });
      }
    },
    arrayChange(e) {
      this.tabindex = e.index;
    },
    // 获取详情
    async getDetailWithLiceseID(licenseId) {
      let result = await this.$network.monitorDetail(licenseId);
      this.dataDic = {
        ...result,
      };
      this.iconList = this.iconList.map((o, i) => {
        if (i == 0) {
          return {
            ...o,
            des: this.dataDic.lockTypeDesc,
          };
        }
        if (i == 1) {
          return {
            ...o,
            des: this.getStateWithKey("gsmSignalStrengthType")
              ? "有通信信号"
              : "无通信信号",
          };
        }
        if (i == 2) {
          return {
            ...o,
            des: this.getStateWithKey("gpsSignalStrengthType")
              ? "有定位信号"
              : "无定位信号",
          };
        }
        if (i == 3) {
          return {
            ...o,
            des: this.getWarning(this.dataDic),
          };
        }
      });
      if (this.oilMachine.includes(this.dataDic.machineTypeName)) {
        this.tabList = [...["设备工况", "油量监控", "异常监控", "设备轨迹"]];
      }
      uni.hideLoading();
    },
    getWarning(item) {
      if (!item.warningFlag) {
        return "无故障";
      }
      if (item.warningFlag && item.warningData && item.warningData != null) {
        let warningData = item.warningData;
        return warningData.description;
      } else {
        return "故障码:" + item.warningCode;
      }
    },
    getStateWithKey(key) {
      if (this.dataDic.offlineMode == true) {
        return false;
      } else {
        if (this.dataDic[key] == true) {
          return true;
        } else {
          return false;
        }
      }
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
  },
};
</script>

<style scoped lang="scss">
.record-detail-bg-view {
  width: 100%;
  height:100%;
  background: $uni-bg-color-grey;
  @include flex(column);
}
</style>
