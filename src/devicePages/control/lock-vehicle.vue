<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-sun-tab
      style="z-index: 999; background: #ffffff"
      :value.sync="tabIndex"
      :tabList="tabs"
      activeColor="#E60000"
      activebgColor="#FFFFFF"
      defaultbgColor="#FFFFFF"
      :shownum="false"
    ></c-sun-tab>
    <view class="flex-scroll-wrapper">
      <device-list ref="deviceList" style="height:100%" v-show="tabIndex==0"></device-list>
      <operation-list ref="opList" style="height:100%" v-show="tabIndex==1"></operation-list>
    </view>
    <div class="actions-footer-flex">
      <view class="z-btn line-primary radius" @click="$refs.cautionPop.open()">注意事项</view>
      <navigator url="/devicePages/control/batch?type=lock" class="z-btn bg-primary radius">批量锁车</navigator>
      <navigator url="/devicePages/control/batch?type=unlock" class="z-btn bg-warn radius">批量解锁</navigator>
    </div>
    <uni-popup ref="cautionPop" type="center" :mask-click="true">
      <view class="caution-popup">
        <view class="text-center text-lg text-bold">注意事项</view>
        <view class="content margin-top-xl text-gray">
          1、车辆工作状态时，下达锁车指令，当次设备可正常操作，关机后即进入锁机状态； 

          2、车辆未工作状态，下发锁车指令，在下次车辆开机后开始执行锁车； 

          3、车辆未工作状态，下发解锁指令，在下次车辆开机后开始执行解锁； 

          4、尽量在高空车不工作，人员未工作的情况下进行锁车、解锁操作，避免发生意外危险。

        </view>
        <view class="flex justify-end padding-right-lg margin-top-xl">
          <view style="width:236rpx" class="z-btn bg-primary radius" @click="$refs.cautionPop.close()">关闭</view>
        </view>
      </view>
    </uni-popup>
  </div>
</template>
<script>
import DeviceList from './components/device-list.vue'
import OperationList from './components/operation-list.vue'
export default {
  components:{
    DeviceList,
    OperationList,
  },
  data(){
    return {
      tabIndex:0,
      tabs:['设备列表','操作日志']
    }
  },
  onLoad(options) {
    this.$refs.deviceList.filter.keyword = options.licenseId
  },
  onShow(){
    this.$nextTick(_=>{
      this.$refs.deviceList.loadmore(true)
      this.$refs.opList.loadmore(true)
    })
  }
}
</script>
<style lang="scss">
  .page{
    height:100%;
    @include flex(column);
    .caution-popup{
      box-sizing: border-box;
      width:648rpx;
      border-radius:8rpx;
      padding:30rpx 24rpx 24rpx 32rpx;
      background:$uni-bg-color;
      .content{
        white-space: pre-line;
      }
    }
  }
</style>