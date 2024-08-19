<template lang="">
  <view class="luli-card">
    <view class="flex align-center">
      <view class="flex align-center flex-sub">
        <text class="iconfont iconzl--hetong text-primary"></text>
        <text class="margin-left-sm text-bold text-df">{{$gxfmethod.subDateWithHHMMSS(item.beginDate)}}~{{$gxfmethod.subDateWithHHMMSS(item.endDate)}}</text>
      </view>
      <text class="text-primary text-sm">小计：￥{{moneyUtil.dealNumber(item.total)}}</text>
    </view>
    <view class="desc">
      <navigator :url="`/businessPages/settledown/settle-detail?businessNo=${item.businessNo}`" class="left text-primary">
        <text>结算单号：</text>
        <text>{{item.businessNo}}</text>
      </navigator>
      <view class="right">
        <text>结算周期：</text>
        <text>{{item.days}}天</text>
      </view>
    </view>
    <view class="desc">
      <view class="left">
        <text>启用时间：</text>
        <text>{{$gxfmethod.subDateWithHHMMSS(item.enableDate)}}</text>
      </view>
      <view class="right">
        <text>退场时间：</text>
        <text>{{$gxfmethod.subDateWithHHMMSS(item.settleDate)}}</text>
      </view>
    </view>
    <navigator :url="`/contractPages/contract/contract-detail?businessNo=${item.contractNo}`" class="desc text-primary">
      项目名称：{{item.projectName}}
    </navigator>
  </view>
</template>
<script>
export default {
  props:{
    item:Object
  }
}
</script>
<style lang="scss" scoped>
  .luli-card{
    padding:26rpx;
    .desc{
      font-size:$uni-font-size-sm;
      margin-top:16rpx;
      color:$uni-text-color-gray;
      @include flex(row,center,start);
      .left{
        flex:4;
        @include flex(row,center,start);
      }
      .right{
        flex:3;
        @include flex(row,center,start);
      }
    }
  }
</style>