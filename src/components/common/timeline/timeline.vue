<template lang="">
  <view class="timeline-container">
    <view class="timeline-item" v-for="(item, index) in list" :key="index">
      <view class="line-container">
        <view class="line-top"></view>
        <view class="middle-circle"></view>
        <!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
        <view class="line-bottom"></view>
      </view>
      <view class="real-contant">
        <slot :item="item" :index="index"></slot>
        <!-- <template v-slot:default="{item,index}" ></template> -->
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    list:Array
  }
}
</script>
<style lang="scss" scoped>
.timeline-item {
	margin: 0 16rpx 0 24rpx;
	display: flex;
	flex-direction: row;
}

.line-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.line-top {
	background-color: $uni-border-color;
	width: 1px;
	height: 30px;
}

.line-bottom {
	background-color: $uni-border-color;
	width: 1px;
	flex: 1;
}

.middle-circle {
	width:14rpx;
	height: 14rpx;
	border-radius: 50%;
	border-width: 7rpx;
	border-color: #E60000;
	border-style: solid;
}

//列表第一个的上半部分线不显示
.timeline-item:first-child .line-container .line-top {
	background-color: transparent;
}

//列表最后一个的下半部分线不显示
.timeline-item:last-child .line-container .line-bottom {
	background-color: transparent;
}

.real-contant {
	// display: flex;
	margin-left: 24rpx;
	margin-top: 8px;
	margin-bottom: 8px;
	flex: 1;
	// flex-direction: column;
	background-color: $uni-bg-color;
	// padding: 16px;
	border-radius: 4px;
}
</style>