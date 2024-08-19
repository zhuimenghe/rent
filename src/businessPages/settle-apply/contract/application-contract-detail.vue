<template>
	<view class="content">
		<c-nav-bar-apply :business-key="applyDic.businessKey">对账结算申请详情</c-nav-bar-apply>
		<view class="sum-view-bg">
			<view class="model-tag"><text>合同信息</text></view>
			<select-label-item tagName="单号" :isRequired="true" :isSelect="false" :value="applyDic.businessNo" />
			<select-label-item tagName="申请类型" :isRequired="true" :value="applyDic.applyType=='statement'?'对账':'结算'" :isSelect="false" />
			<select-label-item tagName="合同名称" :isRequired="true" valueColor='#E60000' :value="contractDicName"
			 @clickItemLabel="gotoContract" :isSelect="true" />
			<view v-if="applyDic.contractInfoDtoList&&applyDic.contractInfoDtoList.length>0">
				<select-label-item tagName="业务负责人" :isSelect="false" :value="applyDic.contractInfoDtoList[0].customerSalesmanName||''" />
				<select-label-item tagName="联系人" :isSelect="false" :value="applyDic.contractInfoDtoList[0].customerName||''" />
				<select-label-item tagName="联系电话" :isSelect="false" :value="applyDic.contractInfoDtoList[0].contactPhoneNum||''" />
				<select-label-item :tagName="typeName+'开始时间'" :isSelect="false" :value="getDate(applyDic.contractInfoDtoList[0].beginDate)" />
				<select-label-item :tagName="typeName+'结束时间'" :isSelect="false" hint="请选择" :value="getDate(applyDic.contractInfoDtoList[0].endDate)" />
			</view>

		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>

</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload,
		},
		data() {
			return {
				textColor: '#333333',
				fontSize: '14px',
				applyDic: {
					contractInfoDtoList: []
				},
				typeName: '',
				contractDicName: ''
			}

		},
		onLoad(option) {
			this.loaddata(option.businessNo);

		},
		methods: {
			gotoContract() {
				uni.navigateTo({
					url: '..//contractPages/contract/contract-detail?businessNo=' + this.applyDic.contractInfoDtoList[0].contractNo
				});
			},
			loaddata(key) {
				let param = {
					"businessNo": key
				}
				this.$network
					.getData(this.$url.APPLY_DATEIL, 'GET', param)
					.then(result => {
						this.applyDic = result
						this.contractDicName = this.applyDic.customerName + '-' + this.applyDic.contractInfoDtoList[0].projectName;
						this.typeName = this.applyDic.applyType == 'statement' ? '对账' : '结算'
					})
					.catch(err => {

					});
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
