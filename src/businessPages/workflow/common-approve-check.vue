<template>
	<view class="creat-invoice-bg">
		<c-nav-bar-apply :business-key="dataDic.businessKey">通用审批</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm">
		<view class="sum-view-bg">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>申请编号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.businessNo }}</text>
				</view>
			</view>

			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>标题</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.approveName }}</text>
				</view>
			</view>

			<text-label-item tagName="内容" :inputDisabled = "true" :inputValue="dataDic.content" />

			<imgupload
			:isupload="false"
			:imgFinishlist='dataDic.fileList'
			/>
		</view>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import approveStep from "@/components/workflow/approve-step.vue";
export default {
	components: {
		textLabelItem,
		imgupload,
		approveStep
	},
	data() {
		return {
			dataDic: {},
			itemData:{},
		};
	},
	onLoad(option) {
		this.itemData = JSON.parse(decodeURIComponent(option.item));
	},
	methods: {
		dataForm(val) {
			this.dataDic = JSON.parse(val);
		},
	}
};
</script>

<style lang="scss" scoped>
.creat-invoice-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	margin-bottom: 70px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 10px;
	font-size: $uni-font-size-base;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
}
.bottom-left-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}
.bottom-right-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
