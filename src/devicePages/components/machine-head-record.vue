<template>
	<view class="car-message-view">
		<image class="icon-car" :src="dataDic.fileList[0].url" v-if="dataDic.fileList && dataDic.fileList.length > 0"/>
		<view class="icon-car" v-else>
			<i class="iconfont icon-view" :class="deviceIcon[dataDic.machineTypeId]?deviceIcon[dataDic.machineTypeId]:'iconzl--jianchache1'"></i>
		</view>
		<view class="icon-car-right">
			<view class="icon-car-right-top">
				<text style="font-size: 16px;font-weight: bold;">{{dataDic.printCode || "--"}}</text>
				<text class="licenseIdStyle">{{dataDic.licenseId || "--"}}</text>
			</view>
			<view class="icon-car-right-med">
				<text>{{ dataDic.machineTypeDesc || '--' }}</text>
				<text style="margin-left: 3px;margin-right: 3px;">|</text>
				<text>{{ dataDic.machineHeightDesc || '--' }}</text>
				<text style="margin-left: 3px;margin-right: 3px;">|</text>
				<text>{{ dataDic.machineBrand || '--' }}</text>
				<text style="margin-left: 3px;margin-right: 3px;">|</text>
				<text>{{dataDic.machineTypeName || '--'}}</text>
				<text style="margin-left: 3px;margin-right: 3px;">|</text>
				<text>{{dataDic.driveTypeName || '--'}}</text>
			</view>
			<view class="icon-car-right-bottom">
				<view class="icon-car-right-state" v-if="dataDic.state =='1'">
					<text>{{ dataDic.stateName || '--' }}</text>
					<text style="margin-left: 3px;margin-right: 3px;">|</text>
					<text>{{ dataDic.subStateName || '--' }}</text>
				</view>
				<view class="icon-car-right-state-wait" v-else>
					<text>{{ dataDic.stateName || '--' }}</text>
					<text style="margin-left: 3px;margin-right: 3px;">|</text>
					<text>{{ dataDic.subStateName || '--' }}</text>
				</view>
				<view class="rent" v-if="dataDic.subletState==1">转租</view>
			</view>
		</view>
		<!-- <badgeview :num='dataDic.fileListNum ? dataDic.fileListNum : 0' @addPic="goImg(dataDic)" /> -->
	</view>
</template>

<script>
import badgeview from '@/components/common/image-upload/badge-icon.vue'
export default {
	components:{
		badgeview
	},
	props: {
		dataDic: Object
	},
	data(){
		return{
			deviceIcon: {
				'3': 'iconzl--zhibiche',
				'4': 'iconzl--jianchache1',
				'2': 'iconzl--jianchache',
				'1': 'iconzl--jianchache1'
			},
		}
	},
	methods:{
		goImg(){
			this.$emit('goToImage', "");
		}
	}
}

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
.icon-view{
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
.licenseIdStyle{
	margin-left: 8px;
	color: #E60000;
	background: #FFF1F0;
	border-radius: 10px;
	padding: 0px 10px;
	font-size: 12px;
}
.icon-car-right-med{
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
.icon-car-right-state{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #FFFFFF;
	font-size: $uni-font-size-sm;
	padding: 2px 10px;
	background: #1890FF;
	border-radius: 5px;
}
.icon-car-right-state-wait{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #FFFFFF;
	font-size: $uni-font-size-sm;
	padding: 2px 10px;
	background: #F0AD4E;
	border-radius: 5px;
}
.rent{
	margin-left: 20rpx;
	background: #52C41A;
	border-radius: 6rpx;
	padding: 2px 10px;
	color: #fff;
	text-align: center;
}
</style>
