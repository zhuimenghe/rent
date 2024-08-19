<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="insuranceDic.businessKey">保险单详情</c-nav-bar-apply>
		<view class="creat-bg">
			<view class="sum-view-bg">
				<view class="model-tag"><text>保险单信息</text></view>
				<select-label-item tagName="保险业务单号" :isRequired="false" :value="insuranceDic.businessNo||'--'" :isSelect="false" />
				<select-label-item tagName="保险单号" :isRequired="false" :value="insuranceDic.insuranceKey||'--'" :isSelect="false" />
				<select-label-item tagName="保险公司" :isRequired="false" :value="insuranceDic.insuranceCompany||'--'" :isSelect="false" />
				<select-label-item tagName="保险金额" :isRequired="false" :value="getMoney(insuranceDic.insuranceAmount)" :isSelect="false" />
				<select-label-item tagName="生效开始时间" :isRequired="false" :value="getDate(insuranceDic.insuranceStartDate)" :isSelect="false" />
				<select-label-item tagName="生效结束时间" :isRequired="false" :value="getDate(insuranceDic.insuranceEndDate)" :isSelect="false" />
				<select-label-item :tagName="insuranceDic.remainingTime&&Number(insuranceDic.remainingTime)<=0?'保险状态':'剩余脱保时间'" :isRequired="false" :value="insuranceDic.remainingTime&&Number(insuranceDic.remainingTime)<=0?'已脱保':(insuranceDic.remainingTime?insuranceDic.remainingTime+'天':'-')" :isSelect="false" />
				<select-label-item tagName="购买日期" :isRequired="false" :value="getDate(insuranceDic.buyTime)" :isSelect="false" />
				<select-label-item tagName="购买负责人" :isRequired="false" :value="insuranceDic.insuranceOfficerName" :isSelect="false" />
				<select-label-item tagName="区域" :isRequired="false" :value="insuranceDic.orgName||'--'" :isSelect="false" />
				<select-label-item tagName="保险费率(%)" :isRequired="false" :value="insuranceDic.insuranceRate||'0'" :isSelect="false" />
			</view>
			<view class="sum-view-bg">
				<view class="model-tag">
					<text>设备信息</text>
				</view>
				<view class="vehicle-list-container">
					<view class="item-head">
						<view style="flex: 5;" class="item-head-item">车号</view>
						<view style="flex: 3;" class="item-head-item">自喷吗</view>
					</view>

					<view v-for="(v, i) in insuranceDic.machineList" class="v-item-container" :key="i">
						<view class="item-top">
							<text style="flex: 5;" class="item-top-item">{{ v.licenseId||'--' }}</text>
							<text style="flex: 3;" class="item-top-item">{{ v.printCode || '-' }}</text>
						</view>

					</view>
				</view>
			</view>
			<view class="sum-view-bg">
				<imgupload :isupload="false" :imgFinishlist="insuranceDic.fileList" />
				<text-label-item tagName="备注" :inputDisabled="true" :inputValue="insuranceDic.remark" />
			</view>
		</view>
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
		computed: {},
		data() {
			return {
				insuranceDic: {}
			};
		},
		onLoad(option) {
			let key = option.businessNo;
			this.loaddata(key);
		},
		methods: {
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getMoney(money) {
				return money ? this.moneyUtil.dealNumber(money) : '-'
			},
			loaddata(key) {
				let param = {
					"businessNo": key
				}
				this.$network
					.getData(this.$url.INSURANCE_DETAIL_URL, 'GET', param)
					.then(result => {
						this.insuranceDic = {
							...result,
							// insuranceRate:(result.insuranceRate ? (result.insuranceRate + "%") : '0%')
						}
					})
					.catch(err => {

					});
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
		margin-left: 10px;
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
