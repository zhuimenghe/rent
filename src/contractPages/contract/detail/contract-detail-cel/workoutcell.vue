<!-- 退场 -->
<template>
	<view class="cellBgView">
		<view class="cell-text">
			<view class="cell-text-left fontBlackcolor" style="color: #000000;"><text>{{ dic.businessNo||"--" }}</text></view>
			<view class="cell-text-right fontgreencolor"><text>{{ dic.stateName||"--" }}</text></view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>退场时间</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.endDate||"--" }}</text>
			</view>
		</view>
		<!-- <view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>启用时间</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.useTime }}</text>
			</view>
		</view> -->
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>退场人员</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.createName||"--" }}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>退场数量</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.machines?dic.machines.length:"0" }}台</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.customerSalesmanName||"--" }}</text>
			</view>
		</view>
		<view class="line-s" />
		<view class="cell-text-right fontdetailcolor" @click="goTo"><text>详情</text></view>
	</view>
</template>
<script>
export default {
	props: {
		dic: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	methods: {
		goTo() {
			let url = ""
			let businessNostr = this.dic.businessNo;
			let businessKey = this.dic.businessKey;
			if(this.dic.expressFlag){
				url = '/businessPages/workout/workout-detail-simple?businessNo=' + businessNostr  + '&businessKey=' + businessKey;;
			}else{
				url = '/businessPages/workout/workout-detail?businessNo=' + businessNostr  + '&businessKey=' + businessKey;;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cellBgView {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin: 10px;
	padding-bottom: 10px;
	background: #ffffff;
}
.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
}
.cell-text-left {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	padding: 0px;
	margin-right: 15px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.fontBlackcolor {
	color: $uni-text-color;
}
.fontdetailcolor {
	color: $uni-color-primary;
}
.fontgreencolor {
	color: #4cd964;
}
.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
}
</style>

