<template>
	<view class="content">
		<c-nav-bar-apply :business-key="applyDic.businessKey">对账结算申请审批</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>基本信息</text></view>
					<select-label-item tagName="单号" :isRequired="true" :isSelect="false" :value="applyDic.businessNo" />
					<select-label-item tagName="客户名称" :isRequired="true" :value="applyDic.customerName"
						:isSelect="false" />
					<select-label-item tagName="业务负责人" :isSelect="false" :value="applyDic.customerSalesmanName||''" />
					<select-label-item tagName="申请类型" :isRequired="true"
						:value="applyDic.applyType=='statement'?'对账':'结算'" :isSelect="false" />
				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text>合同信息</text>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in applyDic.contractInfoDtoList" class="v-item-container" :key="i">
							<view class="item-col">
								<view class="item-top">
									<view class="item-col" style="flex: 2;">
										<text style="font-weight: bold;">{{ v.projectName }}</text>
										<text class="subText">业务负责人：{{ v.customerSalesmanName||'-' }}</text>

									</view>
									<view class="item-col" style="text-align: end;">
										<text class="subText"> {{v.contactName||''}}</text>
										<text class="subText"> {{v.contactPhoneNum||''}}</text>
									</view>
								</view>
								<view class="item-row">
									<tag-select :tagName="typeName+'开始时间'" :value="getDate(v.beginDate)"
										:isSelect="false" :textColor="textColor" :fontSize="fontSize" />
									<tag-select :tagName="typeName+'结束时间'" :value="getDate(v.endDate)"
										:isSelect="false" :textColor="textColor" :fontSize="fontSize" />
								</view>
							</view>
						</view>
					</view>
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
	import TagSelect from '@/components/common/uni-tag/tag-select.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload,
			approveStep,
			wPicker,
			TagSelect
		},
		data() {
			return {
				righticon: 'iconarrow-right',
				textColor: '#333333',
				fontSize: '14px',
				itemData: {},
				applyDic: {
					contractInfoDtoList: []
				},
				contractDicName: '',
				typeName: ''
			}

		},
		onLoad(option) {
			this.itemData = JSON.parse(decodeURIComponent(option.item));

		},
		methods: {
			gotoContract() {
				uni.navigateTo({
					url: '..//contractPages/contract/contract-detail?businessNo=' + this.applyDic.contractNo
				});
			},
			dataForm(val) {
				this.applyDic = val ? JSON.parse(val) : {};
				this.contractDicName = this.applyDic.contractInfoDtoList[0].customerName + '-' + this.applyDic
					.contractInfoDtoList[
						0].customerName.projectName;
				this.typeName = this.applyDic.applyType == 'statement' ? '对账' : '结算'
			},
			getDate(time) {
				if (!time) return '-';
				return time.split(/\s+/)[0];
			}
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

	.vehicle-list-container {
		padding: 15px;
	}

	.checkbox {
		transform: scale(0.8);
	}


	.v-item-container {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid $uni-bg-color-grey;
		padding-bottom: 4px;
		margin-bottom: 4px;
	}

	.item-col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1
	}


	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.subText {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		margin-top: 4px;
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
		padding-left: 2px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.item-row text {
		flex: 1;
	}
</style>
