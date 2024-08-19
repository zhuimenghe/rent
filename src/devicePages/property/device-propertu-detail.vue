<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="car-message-view">
			<view class="icon-car-right-top">
				<text style="margin-right: 5px;">{{ dataDic.printCode || '--' }}</text>
				|
				<text style="margin-left: 5px;">{{ dataDic.licenseId || '--' }}</text>
			</view>
			<view class="icon-car-right-bottom">
				<text>
					{{ dataDic.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ dataDic.machineHeightDesc || '--' }}&nbsp;|&nbsp;{{ dataDic.machineBrand || '--' }}&nbsp;|&nbsp;{{ dataDic.machineTypeName || '--'}}
				</text>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			dataDic:{}
		};
	},
	methods: {
		loadData(){
			
		}
	}
};
</script>
<style lang="scss" scoped>
.bg-view {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.car-message-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}
.icon-car-right-top{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-bottom{
	display: flex;
	margin-top: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}
</style>
