<template>
	<view class="car-message-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="icon-car-right-top">
			<view class="icon-car-right-top-left-all">
				<text style="font-size: 16px;font-weight: bold;">{{dataDic.itemNumber || "--"}}</text>
			</view>
			<view class="icon-car-right-top-right">
				<text style="color: #E60000;">出库数量:{{ dataDic.stockTotal || '0' }}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text>
				<!-- <text style="color: #52C41A;">退回:{{ dataDic.totalToBeStored || '0' }}</text>
				<text style="margin-left: 5px;margin-right: 5px;">|</text> -->
				<text style="color: #FF0000;">可退数量:{{ dataDic.canreturn || '0' }}</text>
			</view>
		</view>
		<view class="icon-car-right-bottom">
			<text>{{ dataDic.modelName || '--' }}</text>
			<text style="margin-left: 5px;margin-right: 5px;">|</text>
			<text>{{ dataDic.category || '--' }}</text>
			<text style="margin-left: 5px;margin-right: 5px;">|</text>
			<text>{{ dataDic.name || '--' }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		dataDic: Object
	},
}
</script>

<style scoped lang="scss">
.car-message-view {
	display: flex;
	padding: 0px 10px;
	margin-top: 10px;
	flex-direction: column;
	justify-content: flex-start;
}
.icon-car-right-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.icon-car-right-top-left-all{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}
.icon-car-right-top-right{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.icon-car-right-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
.icon-right {
	font-size: 20px;
	color: #999999;
	font-weight: bold;
}
</style>
