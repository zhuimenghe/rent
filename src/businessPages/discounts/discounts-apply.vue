<template>
	<view class="content">
		<c-nav-bar-apply :business-key="detailDic.businessKey">优惠/增收审批</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm">
			<view class="sum-view-bg">
				<select-label-item tagName="调整单号" :isRequired="true" :isSelect="false" :value="detailDic.businessNo" />
				<select-label-item tagName="合同名称" :isRequired="true" valueColor='#E60000' :value="contractDicName" :isSelect="true" @clickItemLabel="gotoContract" />
				<view v-if="detailDic.contractNo">
					<select-label-item tagName="业务负责人" :isSelect="false" :value="detailDic.customerSalesmanName||''" />
					<select-label-item tagName="结算金额" :isSelect="false" :value="formatMoney(detailDic.receivable)" />
					<select-label-item tagName="收款金额" :isSelect="false" :value="formatMoney(detailDic.receipt)" />
					<select-label-item tagName="调整类型" :isRequired="true" :value="detailDic.adjustType=='reduce'?'优惠':'增收'" :isSelect="false" />
					<select-label-item tagName="调整金额" :isSelect="false" :value="formatMoney(detailDic.adjustAccount)" />
					<text-label-item tagName="备注" :inputDisabled="true" :inputValue="detailDic.remark" />
				</view>

			</view>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>

</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import approveStep from '@/components/workflow/approve-step';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload,
			approveStep,
			wPicker
		},
		data() {
			return {
				itemData: {},
				detailDic: {},
				contractDicName: '',
			}

		},
		onLoad(option) {
			this.itemData = JSON.parse(decodeURIComponent(option.item));

		},
		methods: {
			gotoContract() {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.detailDic.contractNo
				});
			},
			dataForm(val) {
				this.detailDic = val ? JSON.parse(val) : {};
				this.contractDicName = this.detailDic.customerName + '-' + this.detailDic.projectName;
			},
			formatMoney(num) {
				return this.$datestr.doubleFloat(num);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.creat-bg {
		display: flex;
		// flex: 1;
		// width: 100%;
		// margin-bottom: 68px;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 10px;
		background: #ffffff;
		border-radius: 4px;
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
		justify-content: flex-end;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.text-style {
		flex: 1;
		text-align: right;
	}

	.input-style {
		text-align: right;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
		height: 35px;
		line-height: 35px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.model-tag {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		color: $uni-text-color;
		font-weight: bold;
		font-size: $uni-font-size-lg;
		padding: 15px;
		align-items: center;
	}

	.tag-right,
	.top-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
	}

	.labelstyle {
		color: $uni-color-primary;
		font-size: 20px;
		margin-left: 10px;
	}

	.attachment-icon {
		color: $uni-color-primary;
		font-size: 10px;
		margin-left: 10px;
	}

	.delete-items-icon {
		color: #ff0000;
		font-size: 14px;
	}

	.vehicle-list-container {
		padding: 15px;
	}

	.item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.item-head-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: #FFFFFF;
		border-width: 1px;
		border-style: solid;
		color: #FFFFFF;
		font-size: $uni-font-size-base;
		background-color: #aaaaaa;
		height: 30px;
		line-height: 30px;
		padding-left: 2px;
	}


	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-top-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 1px;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
		padding-left: 2px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.claim-options {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-color-primary;
	}

	.item-row text {
		flex: 1;
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

	.line-s {
		margin-top: 5px;
		margin-left: 5px;
		margin-right: 5px;
		height: 1px;
		background: #eeeeee;
	}
</style>
