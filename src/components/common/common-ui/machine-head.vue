<template>
	<view class="car-message-view">
		<image class="icon-car" :src="dataDic.fileList[0].url" v-if="dataDic.fileList && dataDic.fileList.length > 0"/>
		<view class="icon-car" v-else>
			<i class="iconfont icon-view" :class="deviceIcon[dataDic.machineTypeId]?deviceIcon[dataDic.machineTypeId]:'iconzl--jianchache1'"></i>
		</view>
		<view class="icon-car-right">
			<view class="icon-car-right-top">
				<text style="margin-right: 5px;font-size: 17px;font-weight: bold;">{{dataDic.printCode || "--"}}</text>
				<text class="licenseIdStyle">{{dataDic.licenseId || "--"}}</text>
			</view>
			<view class="icon-car-right-bottom">
				<text>{{ dataDic.machineTypeDesc || '--' }}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text>
				<text>{{ dataDic.machineHeightDesc || '--' }}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text>
				<text>{{ dataDic.machineBrand || '--' }}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text>
				<text>{{dataDic.machineTypeName || '--'}}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text>
				<text>{{dataDic.driveTypeName || '--'}}</text>
			</view>
		</view>
		<i class="iconfont icon-right iconarrow-right"></i>
	</view>
</template>

<script>
export default {
	props: {
		dataDic: Object
	},
	data(){
		return{
			deviceIcon: {
				'1':'iconzl--jianchache1',//高空车
				'2': 'iconwaji1', //挖掘机
				'3': 'iconlixianchache1', //叉车
				'4': 'iconkuangche11', //矿车
				'5': 'iconzhuangzaiji11' //装载机
			},
		}
	},
	methods:{
		
	}
}

</script>

<style scoped lang="scss">
.car-message-view {
	display: flex;
	width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.icon-car {
	display: flex;
	width: 40px;
	height: 40px;
	padding: 3px;
	border-radius: 8px;
	border: 1px #999999 solid;
	align-items: center;
	justify-content: center;
}
.icon-view{
	font-size: 35px;
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
	margin-left: 10px;
	color: #E60000;
	background: #FFF1F0;
	border-radius: 10px;
	padding: 0px 10px;
	font-size: 24upx;
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
