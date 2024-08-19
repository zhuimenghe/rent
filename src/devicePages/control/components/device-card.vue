<template lang="">
  <view class="card padding-lr-lg padding-tb-lg">
    <view class="flex align-center">
      <view class="icon line-gray radius margin-right">
        <text class="iconfont iconfont-device text-primary" :class="[MACHINE_ICON_CLASS[d.machineTypeId]]"></text>
      </view>
      <view class="info text-sm flex-sub">
        <view class="flex align-center">
          <text class="text-lg">{{d.printCode || ''}}</text>
          <view class="cu-tag sm text-sm round bg-error light margin-left-sm">{{d.licenseId || ''}}</view>
        </view>
        <view class="text-gray margin-tb-sm">
          {{d.machineHeightDesc||'--'}} | {{d.machineTypeName||'--'}} | {{d.machineBrand||'--'}}
        </view>
        <view class="flex">
          <view class="cu-tag sm radius margin-right-sm" :class="[d.state =='1' ? 'bg-blue' : 'bg-warn']">{{ d.stateName || '--' }}</view>
          <view class="cu-tag sm radius margin-right-sm" :class="[d.offlineMode ? 'bg-gray' : 'bg-success']">{{d.offlineMode ? '离线' : '在线'}}</view>
        </view>
      </view>
      <navigator @click.stop :url="`/devicePages/control/history?licenseId=${d.licenseId}&printCode=${d.printCode||''}`" class="history-icon text-primary">
        <text class="iconfont iconicon_jilu text-xl"></text>
      </navigator>
    </view>
    <view class="margin-top radius bg-gray light padding-lr padding-tb-lg text-sm">
      <view class="margin-bottom">
        <text class="text-gray">定位时间：</text>
        <text class="text-black">{{d.locateDate}}</text>
      </view>
      <view>
        <text class="text-gray">所在位置：</text>
        <text class="text-black">{{d.address}}</text>
      </view>
      <view class='margin-top'>
        <text class="text-gray">当前状态：</text>
        <!-- completeStatus 0成功1失败2锁车执行中3解锁执行中 -->
        <text  :class="[lockClass]">{{d.lockTypeDesc}}
          <text v-if="d.completeStatus==2||d.completeStatus==3"> - {{d.completeStatusDesc}}</text>
        </text>
      </view>
    </view>
    <view class="margin-top-lg flex " style='justify-content: flex-end'>
    
      <slot name="actions"></slot>
    </view>
  </view>
</template>
<script>
import {MACHINE_ICON_CLASS} from '@/common/constant'
export default {
  props:{
    d:Object
  },
  data(){
    return{
      MACHINE_ICON_CLASS    
    }
  },
  computed:{
    lockClass(){
      return this.d.completeStatus==2||this.d.completeStatus==3 ? 'text-warn' : (this.d.lockStatus==0 ? 'text-success':'text-error')
    }
  },
}
</script>
<style lang="scss" scoped>
  .card{
    background: $uni-bg-color;
  }
  .icon{
    width:112rpx;
    height:112rpx;
    @include flex(row,center,center);
    font-size: 64rpx !important;
    @include hairline-surround-radius(10rpx);
  }
  .iconfont-device{
    font-size: 64rpx !important;
  }
  .history-icon{
    width:64rpx;
    height:64rpx;
    @include hairline-surround-round($uni-color-primary);
    @include flex(row,center,center);
  }
</style>