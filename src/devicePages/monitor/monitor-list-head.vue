<template>
  <view class="car-message-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <image class="icon-car" :src="dataDic.fileList[0].url" v-if="dataDic.fileList && dataDic.fileList.length > 0" />
    <view class="icon-car" v-else>
      <i class="iconfont icon-view" :class="deviceIcon[dataDic.machineTypeId]
        ? deviceIcon[dataDic.machineTypeId]
        : 'iconzl--jianchache1'
        "></i>
    </view>
    <view class="icon-car-right">
      <view class="icon-car-right-top">
        <text style="font-size: 16px; font-weight: bold">{{
          dataDic.printCode || "--"
        }}</text>
        <text class="licenseIdStyle">{{ dataDic.licenseId || "--" }}</text>
      </view>
      <view class="icon-car-right-med">
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
        <view class="cu-tag radius sm" :class="[dataDic.state == '1' ? 'bg-blue' : 'bg-warn']">
          <text>{{ dataDic.stateName || "--" }}</text>
          <text class="margin-lr-sm">|</text>
          <text>{{ dataDic.lockTypeDesc || "--" }}</text>
        </view>
        <view class="margin-left cu-tag sm radius bg-success" v-if="!dataDic.offlineMode">在线</view>
        <view class="margin-left cu-tag sm radius bg-error" v-else-if="Number(dataDic.offlineHours) < 30 * 24">离线</view>
        <view class="margin-left cu-tag sm radius bg-error" v-else>离线{{ getOffLineTime(dataDic.offlineHours) }}</view>
        <view class="margin-left cu-tag sm radius bg-error" v-if="Number(dataDic.lowPowerHours) >= 30 * 24">低电量{{ getOffLineTime(dataDic.lowPowerHours) }}</view>
        <view class="margin-left cu-tag sm radius bg-error" v-if="dataDic.lastCloseDays >= 30">关机{{ dataDic.lastCloseDays }}天</view>
      </view>
    </view>
    <!-- <view :class="dataDic.machineStatus!='1'?'icon-car-right-state':'icon-car-right-state-work'" v-if="!dataDic.offlineMode">
			<text >{{ dataDic.machineStatusDesc || '--' }}</text>
		</view>
		<view class="icon-car-right-state-off" v-else>
			<text>{{ '离线' }}</text>
		</view> -->
  </view>
</template>

<script>
import badgeview from "@/components/common/image-upload/badge-icon.vue";
export default {
  components: {
    badgeview,
  },
  props: {
    dataDic: Object,
  },
  data() {
    return {
      deviceIcon: {
        3: "iconzl--zhibiche",
        4: "iconzl--jianchache1",
        2: "iconzl--jianchache",
        1: "iconzl--jianchache1",
      },
    };
  },
  methods: {
    getOffLineTime(time) {
      // time:hours
      time = time || 0;
      let d = Math.floor(time / 24);
      let h = (time % 24).toFixed(1);
      return d ? d + "天" : "";
    },
    goImg() {
      this.$emit("goToImage", "");
    },
  },
};
</script>

<style scoped lang="scss">
.car-message-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
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
  margin-left: 8px;
  color: #e60000;
  background: #fff1f0;
  border-radius: 10px;
  padding: 3px 5px;
  font-size: 11px;
}

.icon-car-right-med {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
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
</style>
