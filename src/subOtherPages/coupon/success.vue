<template>
	<view class="page" >
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar textColor="#fff" flexAlign="center" backgroundColor="transparent" :hasPlaceholder="false">
      <text class="text-xl">付款成功</text>
    </c-nav-bar>
    <image
      class="top"
      src="/static/home_top_bg.png"
      mode="aspectFill"
    />
    <view class="container">
      <image class="icon margin-bottom-xl" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/order-success.png"></image>
      <text class="margin-tb-lg text-xl text-warn text-bold">恭喜您付款成功！</text>
      <view class="text-center text-grey margin-top-lg" style="width:447rpx">您已成功付款，共获得5张抵扣券，总计可抵扣6000元现金。</view>
      <view class="btn bg">我的订单 <text class="iconfont iconarrow-right"></text></view>
      <view class="btn line">我的订单 <text class="iconfont iconarrow-right"></text></view>
    </view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	components: {
	},
	data() {
		return {
		};
	},
	computed:{
	},
	onShow() {
	},
	onLoad() {
	},
	mounted(){
		// this.popScan()
	},
	methods: {
	},
};
</script>
<style lang="scss" scoped>
.page{
  height:100%;
  @include flex(column);

}
.top{
  width:100%;
  height:263rpx;
}
.container{
  box-sizing: border-box;
  position: fixed;
  top:185rpx;
  width:702rpx;
  left:24rpx;
  border-radius: 8px;
  background: $uni-bg-color;
  @include flex(column,center);
  padding:73rpx 53rpx;
  z-index: 2;
  .icon{
    margin-top:70rpx;
    width:379rpx;
    height:205rpx;
  }
  .btn{
    width: 598rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 24rpx;
    @include flex(row,center,center);
    &.bg{
      background: linear-gradient(360deg, #FE7437 0%, #F52F00 100%);
      color:#fff;
      margin-top:157rpx;
    }
    &.line{
      border:1rpx solid $uni-color-primary;
      color: $uni-color-primary;
      margin-top:62rpx;
    }
  }
}
</style>
