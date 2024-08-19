<template lang="">
  <view class="card">
    <view class="line justify-between">
      <text class="text-bold">{{f.levelName}}</text>
      <text>{{f.faultName}}</text>
    </view>
    <view class="line text-sm justify-between">
      <text>提醒时间：{{f.date}}</text>
      <text class="text-success" :class="[levelClasses[f.level]]">{{f.level | levelName}}</text>
    </view>
    <!-- <view class="line text-gray text-sm">
      <text class="iconfont icondingwei3"></text>
      <text class="iconfont iconshijian"></text>
      江苏省昆山啊hi 
    </view> -->
  </view>
</template>
<script>
export default {
  props:{
    f:Object
  },
  filters:{
    levelName(l){
      var map = {
        1:'警示',
        2:'轻微故障',
        3:'一般故障',
        4:'严重故障',
      }
      return map[l]
    }
  },
  data(){
    return{
      levelClasses:{
        1:'text-success',
        2:'text-warn',
        3:'text-warn',
        4:'text-error',
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .card{
		padding:20rpx 30rpx;
		.line{
			margin-bottom:20rpx;
			@include flex(row,center,normal);
			&:last-child{
				margin-bottom:0;
			}
			.iconfont{
				margin-right:10rpx;
			}
		}
	}
</style>