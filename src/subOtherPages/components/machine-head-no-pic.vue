<template>
	<view>
		<view class="icon-car-right-top">
			<text style="margin-right: 5px;font-size: 17px;font-weight: bold;">{{dataDic.printCode || "--"}}</text>
			<text class="licenseIdStyle">{{dataDic.licenseId || "--"}}</text>
		</view>
		<view class="icon-car-right-bottom">
			<!--类型-->
			<text>{{ dataDic.typeName || '--' }}</text>
			<text style="margin-left: 5px;margin-right: 5px;">|</text>
			<!--高度-->
			<text>{{ dataDic.heightName || '--' }}</text>
			<text style="margin-left: 5px;margin-right: 5px;">|</text>
			<!--品牌-->
			<text>{{dataDic.brand || '--'}}</text>
			<text style="margin-left: 5px;margin-right: 5px;">|</text>
			<!--型号-->
			<text>{{ dataDic.machineTypeName || '--' }}</text>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataDic: Object
		},
		methods: {

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

	.icon-view {
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
	}

	.licenseIdStyle {
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
	}

	.icon-right {
		font-size: 20px;
		color: #999999;
		font-weight: bold;
	}
</style>
