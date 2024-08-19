<template>
  <view class="model-container">
    <c-nav-bar flexAlign="center" background-color="#fff">物流附件查看</c-nav-bar>
    <view class="header-file">
      {{ licenseId }}
      <text v-if="printCode">（{{ printCode }}）</text>
    </view>

    <view class="file-container">
      <template v-for="(item, index) in imglist">
        <view class="item-wrapper" style="display: flex" :key="item">
          <view class="file-item">
            <imgupload
              :imgFinishlist="imglist"
              :isDetail="true"
              :maximg="1"
              :imgurllist="imglist"
              key="index"
              :index="index"
              :imgInfo="{ ...item, index }"
            ></imgupload>
          </view>
        </view>
      </template>
    </view>
    <view class="bottom"></view>
    <view class="bottom-view">
      <view class="total">
        <view class="choosed-view" @click="back">取消</view>
        <view class="confirm-view" @click="confirm"> 确定</view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import imgupload from "@/businessPages/components/choose-device-file.vue";
export default {
  name: "choose-file-list",
  components: {
    imgupload,
  },
  data() {
    return {
      imglist: [],
      printCode: "",
      licenseId: "",
    };
  },
  onLoad(options) {
    console.log(options, "decodeURIComponent");
    this.imglist = JSON.parse(decodeURIComponent(options.imglist));
    this.printCode = JSON.parse(options.printCode);
    this.licenseId = JSON.parse(options.licenseId);
  },
  methods: {
    back() {
      uni.navigateBack();
    },
    confirm() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// ::v-deep .com-nav-bar-inner{
//   background-color: #fff !important;
//   font-size: 32rpx;
//   font-family: PingFangSC-Medium, PingFang SC;
//   font-weight: 500;
//   color: #181818;
// }
.file-item {
  margin-top: 24rpx;
}

.item-wrapper {
  flex-basis: 33.3333%;
}

.model-container {
  width: 100%;
  height: 100%;
}

.file-container {
  margin-top: 24rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 0 0 10px;
  padding-bottom: 40rpx;
}

.img-bg-view {
  width: 100%;
}

.header-file {
  height: 90rpx;
  background: #ffffff;
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  line-height: 90rpx;
  text-indent: 27rpx;
}

.bottom-view {
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
  }
}

.choosed-view {
  width: 156px;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  background-color: #d8d8d8 !important;
  color: #fff !important;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 6px;
  margin-right: 10px;
}

.choosed-view span {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  margin-left: 4px;
}

.confirm-view {
  width: 156px;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  background: #e60000;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 6px;
}

.bottom {
  height: 30px;
}
</style>
