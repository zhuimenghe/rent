<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="purchaseDic.businessKey">采购详情</c-nav-bar-apply>
			<view class="creat-claime-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>基本信息</text></view>
					<select-label-item tagName="采购单号" :isRequired="true" :value="purchaseDic.businessNo||'--'" :isSelect="false" />
					<select-label-item tagName="申请人" :isRequired="true" :value="purchaseDic.userName||'--'" :isSelect="false" />
					<select-label-item tagName="区域" :isRequired="true" hint="请选择区域" :value="purchaseDic.orgName||'--'" :isSelect="false"/>
					<select-label-item tagName="采购形式" :isRequired="true" :value="purchaseDic.purchaseTypeName||'--'"
					 :isSelect="false" />
					<select-label-item tagName="采购日期" :isRequired="true"  :value="getDate(purchaseDic.purchaseDate)"
					 :isSelect="false" />
					<select-label-item tagName="采购人" :isRequired="true"  :value="purchaseDic.purchaseUserName||'--'"
					 :isSelect="false" />
					<select-label-item tagName="申请人电话" :isPhone='true' :value="purchaseDic.purchasePhoneNumber||'--'" :isSelect="false" />
					<text-label-item tagName="备注"  :inputValue="purchaseDic.comment||''" :disabled="true" />
				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text>设备信息</text>
						<view class="tag-right">
							<text style="font-size: 12px;color: #666666; font-weight: 100;">总计：</text>{{ moneyUtil.dealNumber(purchaseDic.total) }}<text
							 style="font-size: 12px;color: #999999; font-weight: 100;">元</text>
						</view>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in purchaseDic.recordList" :key="i">

							<view class="v-item-container">
								<view class="item-row">
									<view class="info-cell-key">设备类别</view>
									<view class="info-cell-value">
										<label-arrow :value="v.deviceTypeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备类型</view>
									<view class="info-cell-value">
										<label-arrow :value="v.typeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">品牌</view>
									<view class="info-cell-value">
										<label-arrow :value="v.brand" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">型号</view>
									<view class="info-cell-value">
										<label-arrow :value="v.machineTypeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">高度</view>
									<view class="info-cell-value">
										<label-arrow :value="v.heightName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备数量（台）</view>
									<view class="info-cell-value">
										<label-arrow :value="v.purchaseNumber.toString()" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备单价（元）</view>
									<view class="info-cell-value">
										<label-arrow :value="moneyUtil.dealNumber(v.purchasePrice).toString()" textColor="#333333" :disabled="true"></label-arrow>
										</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">单类总价（元）</view>
									<view class="info-cell-value">
										<label-arrow :value="moneyUtil.dealNumber(v.total).toString()" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			<!-- <view class="sum-view-bg">
				<view class="model-tag"><text>备注及附件</text></view>
				<text-label-item tagName="备注" :inputValue="purchaseDic.comment||''" :disabled="true" />
				<imgupload :isupload="false" :imgFinishlist='purchaseDic.fileList' />
			</view> -->
			</view>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import approveStep from '@/components/workflow/approve-step.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			labelArrow,
			approveStep,
			imgupload
		},
		computed: {},
		data() {
			return {
				purchaseDic: {},
				itemData:null

			};
		},
		onLoad(option) {
			console.log("option------------"+JSON.stringify(option))
			this.businessNo = option.businessNo
			console.log("businessNo----------------"+JSON.stringify(this.businessNo))
			this.getDetail();

		},
		methods: {
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getDetail(key) {
				let param = {
					businessNo: this.businessNo
				};
				this.$network
					.getData(this.$url.PURCHASE_DETAIL, 'GET', param)
					.then(result => {
						this.purchaseDic = {
							...result
						};
						this.getItemTotal();
					})
					.catch(err => {});
			},
			getItemTotal() {
				let list =this.purchaseDic.recordList.map(o=>{
					let total = (o.purchasePrice ? Number(o.purchasePrice) : 0) *(o.purchaseNumber ? Number(o.purchaseNumber) : 0)
					return {
						...o,
						total:total.toFixed(2).toString()
					}
				})
				this.purchaseDic = {
					...this.purchaseDic,
					recordList:list
				}
				console.log("getItemTotal------------"+JSON.stringify(this.purchaseDic))
			}

		},
	};
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.creat-claime-bg {
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
		margin-left: 15px;
		margin-right: 15px;
		height: 45px;
		line-height: 45px;
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
		width: 140px;
		height: 35px;
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
		padding: 10px;
	}

	.v-item-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 8px;
		border: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-row {
		display: flex;
		flex-direction: column;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		width: 33%;
		padding-bottom: 8px;
	}

	.info-cell-key {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
	}

	.info-cell-value {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 28px;
		line-height: 28px;
		align-items: center;
		display: flex;
	}

	.info-cell-value input {
		border: 1px solid $uni-bg-color-grey;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		padding: 0px 2px;
		width: 72px;
		border-radius: 4px;
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
</style>
