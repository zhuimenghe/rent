<template>
  <view class="car-message-view">
    <view class="r-head-view">
      <image
        class="icon-car"
        :src="dataDic.fileList[0].url"
        v-if="dataDic.fileList && dataDic.fileList.length > 0"
      />
      <view class="icon-car" v-else>
        <i
          class="iconfont icon-view"
          :class="
            deviceIcon[dataDic.machineTypeId]
              ? deviceIcon[dataDic.machineTypeId]
              : 'iconzl--jianchache1'
          "
        ></i>
      </view>
      <view class="icon-car-right">
        <view class="icon-car-right-top">
          <text style="margin-right: 5px; font-size: 16px; font-weight: bold">
            {{ dataDic.printCode || "--" }}
          </text>
          <text class="licenseIdStyle">{{ dataDic.licenseId || "--" }}</text>
        </view>
        <view class="icon-car-right-med" style="color: #8c8c8c">
          <text>{{ dataDic.machineTypeDesc || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineHeightDesc || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineBrand || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineTypeName || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.driveTypeName || "--" }}</text>
        </view>
        <view class="icon-car-right-med">
          <view
            class="cu-tag radius sm"
            :class="[dataDic.state == '1' ? 'bg-blue' : 'bg-warn']"
          >
            <text>{{ dataDic.stateName || "--" }}</text>
            <text class="margin-lr-sm">|</text>
            <text>{{ dataDic.lockTypeDesc || "--" }}</text>
          </view>
          <view
            class="margin-left cu-tag sm radius bg-success"
            v-if="!dataDic.offlineMode"
            >在线</view
          >
          <view class="margin-left cu-tag sm radius bg-error" v-else
            >当前离线{{ getOffLineTime(dataDic.offlineHours) }}</view
          >
        </view>
      </view>
      <view class="icon-car-right-state">
        <qrcodeImg
          :url="qrcodeUrl"
          :downloadUrl="downloadQrcodeUrl"
          v-if="isShowQrCode"
          color="#F08200"
        />
      </view>
    </view>
    <view class="bottom-btns-list">
      <view class="cell-line-row">
        <view class="cell-line-tag">实际工作总时长:</view>
        <view class="cell-line-value text-primary">{{
          $datestr.getDateStr(dataDic.workDuration)
        }}</view>
      </view>
      <view class="cell-line-row">
        <view class="cell-line-tag"
          >当前{{
            oilMachine.includes(dataDic.machineTypeName) ? "油量" : "电量"
          }}:</view
        >
        <view
          class="cell-line-value"
          :class="[powerClass(dataDic.batteryPower)]"
          >{{ dataDic.batteryPower }}%</view
        >
      </view>
      <view class="cell-line-row">
        <view class="cell-line-tag">当前定位:</view>
        <view class="cell-line-value">{{ dataDic.address }}</view>
      </view>
      <view class="cell-line-row" style="flex: 1">
        <view class="cell-line-tag" style="min-width: 20px">最近回传:</view>
        <view class="cell-line-value">{{ dataDic.lastDataUploadTime }}</view>
      </view>
      <view class="cell-line-row" style="flex: 1">
        <view class="cell-line-tag" style="min-width: 20px">定位时间:</view>
        <view class="cell-line-value">{{ dataDic.locateDate }}</view>
      </view>
    </view>
    <view class="space-css" />
    <view class="title-bg">
      <view class="title-text-css">{{ "运行状况" }}</view>
      <view class="item-list">
        <view
          class="item-bg"
          v-for="(item, index) in iconList"
          :key="index"
          @click="showToastAlert(index)"
        >
          <i class="iconfont icon-state" :class="item.icon"></i>
          <text class="state-right-class" v-if="index != 3">{{
            item.des
          }}</text>
          <text
            class="state-error-class"
            v-if="index == 3 && dataDic.warningFlag"
            >{{ item.des || "" }}</text
          >
          <text
            class="state-right-class"
            v-if="index == 3 && !dataDic.warningFlag"
            >{{ item.des || "" }}</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import qrcodeImg from "@/devicePages/record/detail-components/record-qrcode-img.vue";
export default {
  components: {
    qrcodeImg,
  },
  props: {
    isShowQrCode: {
      type: Boolean,
      default: true,
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    iconList: {
      type: Array,
      default() {
        return [];
      },
    },
    qrcodeUrl: {
      type: String,
      default: "",
    },
    downloadQrcodeUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      deviceIcon: {
        3: "iconzl--zhibiche",//直臂车
        4: "iconzl--jianchache1",//剪叉
        2: "iconzl--jianchache",//屈臂
        1: "iconzl--jianchache1",
      },
      oilMachine: this.$store.state.machine.oilMachine,
    };
  },
  methods: {
    getOffLineTime(time){
      // time:hours
      time=time||0;
      let d=Math.floor(time/24);
      let h=(time%24).toFixed(1);
      return d?d+'天'+h+'小时':h+'小时'
    },
    powerClass(batteryPower) {
      if (batteryPower >= 0 && batteryPower <= 20) {
        return "text-error";
      } else if (batteryPower > 20 && batteryPower <= 40) {
        return "text-warn";
      } else {
        return "text-success";
      }
    },
    showToastAlert(index) {
      if (index == 3) {
        let title = this.getWarningH(this.dataDic);
        if (title == "无故障") {
          return;
        }
        uni.showToast({
          title: title,
          icon: "none",
          duration: 3000,
        });
      }
    },
    getWarningH(item) {
      if (!item.warningFlag) {
        return "无故障";
      }
      if (item.warningFlag && item.warningData && item.warningData != null) {
        let warningData = item.warningData;
        return (
          "故障码:" +
          warningData.code +
          "\n" +
          "故障描述:" +
          warningData.description +
          "\n" +
          "行为:" +
          warningData.action
        );
      } else {
        return "未知故障,故障码:" + item.warningCode;
      }
    },
    goImg() {
      this.$emit("goToImage", "");
    },
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
.car-message-view {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  width: 100%;
  z-index: 200;
}
.r-head-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  // background: $uni-color-primary;
  margin: 0px 8px;
  padding: 12px 8px;
  border-radius: 12px;
}
.icon-car {
  display: flex;
  width: 45px;
  height: 45px;
  padding: 3px;
  border-radius: 8px;
  border: 1px $uni-line-color solid;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.icon-car-right {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.icon-car-right-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}
.licenseIdStyle {
  margin-left: 10px;
  color: #e60000;
  background: #fff1f0;
  border-radius: 10px;
  padding: 0px 10px;
  font-size: 24upx;
}
.icon-car-right-med {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color-gray;
  font-size: 11px;
  margin-left: 10px;
  padding: 3px 0px;
}
.icon-car-right-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-left: 10px;
}
.icon-right {
  font-size: 20px;
  color: #999999;
  font-weight: bold;
}
.icon-car-right-state {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-left: 10px;
}
.bottom-btns-list {
  display: flex;
  flex-direction: column;
  margin: 12px 0px;
}
.bottom-btns-row {
  display: flex;
  flex-direction: row;
  margin: 0px 0px 12px 0px;
}
.cell-line-row {
  display: flex;
  padding: 4px 24rpx;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cell-line-value {
  flex: 1;
  font-size: $uni-font-size-base;
  color: #333333;
}
.cell-line-rightB {
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
}
.cell-line-tag {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
  margin-right: 5px;
  min-width: 70px;
}
.icon-car-right-state-rent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 11px;
  padding: 2px 8px;
  background: #1890ff;
  border-radius: 5px;
}
.icon-car-right-state-wait {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 11px;
  padding: 2px 8px;
  background: #f0ad4e;
  border-radius: 5px;
}
.icon-car-right-state-off {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 11px;
  padding: 2px 8px;
  background: #fc0000;
  border-radius: 5px;
}
.line-css {
  flex: 1;
  margin: 0px 10px 12px 10px;
  background: $uni-line-color;
  height: 1px;
}
.space-css {
  width: 100%;
  height: 8px;
  background: $uni-bg-color-grey;
}
.title-bg {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding: 12px;
}
.title-text-css {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}
.item-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 12px;
}
.item-bg {
  display: flex;
  flex-direction: column;
  width: calc(25% - 7px);
  background: #f4f6f8;
  font-size: $uni-font-size-sm;
  justify-content: flex-start;
  align-items: center;
  color: #888888;
  padding: 12px 0px;
  border-radius: 8px;
}
.icon-state {
  width: 36px;
  height: 36px;
  background: #fff1f0;
  border-radius: 18px;
  text-align: center;
  line-height: 36px;
  color: $uni-color-primary;
  font-size: 20px;
  margin-bottom: 12px;
}
.state-right-class {
  font-size: 12px;
  color: #000000;
  text-align: center;
  margin: 0px 5px;
}
.state-error-class {
  font-size: 12px;
  color: #ff0909;
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0px 5px;
}
</style>
