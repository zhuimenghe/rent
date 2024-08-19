<template>
	<view class="detail-allot-bg">
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">调拨详情</c-nav-bar-btns>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text style="font-weight: bold;">基本信息</text>
				</view>
			</view>
			<select-label-item tagName="调拨单号" :isSelect="false" :value="allotDic.businessNo" />
			<select-label-item tagName="调拨用户" :isSelect="false" :value="allotDic.createName" />
			<select-label-item tagName="调出区域" :isSelect="false" :value="allotDic.orgOldNameList ? allotDic.orgOldNameList[0] : ''" />
			<select-label-item tagName="调出地址" :isSelect="false" :value="allotDic.addressOld" />
			<select-label-item tagName="调入区域" :isSelect="false" :value="allotDic.orgNewName" />
			<select-label-item tagName="调入地址" :isSelect="false" :value="allotDic.addressNew" />
			<select-label-item tagName="是否物流" :isSelect="false" :value="allotDic.needLogistics?'是':'否'" />
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>调拨原因</text></view>
				<view class="cell-input-view-right">
					<input class="input-style" v-model="allotDic.reason" disabled="true" />
				</view>
			</view>
			<text-label-item tagName="备注" :inputDisabled="true" :inputValue="allotDic.remark" />

			<imgupload :isupload="false" :imgFinishlist="allotDic.fileList" />
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left"><text style="font-weight: bold;">设备信息（共{{allotDic.machineAllocationList ? allotDic.machineAllocationList.length : "0"}}辆）</text></view>
			</view>
			<view v-for="(d,i) in allotDic.machineAllocationList ? allotDic.machineAllocationList : []" :key="i">
				<view class="device-item-container">
					<view class="item-row item-title">
						<view class="item-tag">{{d.licenseId || ""}}</view>
						<view class="item-value">
							<text class="input-style">{{d.stateName || ""}}-{{d.subStateName || ""}}</text>
						</view>
					</view>
					<view class="item-row">
						<view class="item-tag">型号</view>
						<view class="item-value">
							<text class="input-style">{{d.machineTypeName || "--"}}</text>
						</view>
					</view>
					<view class="item-row">
						<view class="item-tag">自喷码</view>
						<view class="item-value">
							<text class="input-style">{{d.printCode || "-"}}</text>
						</view>
					</view>
					<view class="item-row">
						<view class="item-tag">当前位置</view>
						<view class="item-value">
							<text class="input-style">{{d.address|| "--"}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="sum-view-bg" v-if="allotDic.needLogistics">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left"><text style="font-weight: bold;">物流信息</text></view>
			</view>
			<select-label-item 
			tagName="物流公司" 
			:isSelect="false" 
			:value="allotDic.logisticsRecord ? allotDic.logisticsRecord.logisticsCompanyName  : '--'" 
			/>
			<select-label-item 
			tagName="物流联系人" 
			:isSelect="false" 
			:value="allotDic.logisticsRecord ? allotDic.logisticsRecord.logisticsContact  : '--'" />
			<select-label-item 
			tagName="物流电话" 
			:isPhone='true' 
			:isSelect="false" 
			:value="allotDic.logisticsRecord ? allotDic.logisticsRecord.logisticsPhone  : '--'" />
			<select-label-item 
			tagName="物流费用" 
			:isSelect="false" 
			:value="allotDic.logisticsRecord ? allotDic.logisticsRecord.logisticsCarriage : '--'" />
			<select-label-item 
			tagName="物流运输时间" 
			:isSelect="false" 
			:value="allotDic.logisticsRecord && allotDic.logisticsRecord.transportTime ? changestr(allotDic.logisticsRecord.transportTime) : '--'" />
		</view>

    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload
		},
		data() {
			return {
				navBtns: [
						{
								"text": "审批流",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				businessNo: "",
				allotDic: {

				}

			};
		},
		onLoad(option) {
			this.businessNo = option.businessNo;
			this.loadDetail();
		},
		methods: {
			onNavBarButtonTap() {
				let url = '/businessPages/workin/work-flow-display?businessKey=' + this.allotDic.businessKey;
				uni.navigateTo({
					url: url
				})
			},
			changestr(str) {
				console.log(str)
				if(str === '' || str === 0){
					return '--'
				}
				let timestr = this.$datestr.dateFormat(new Date(str))
				return timestr.split(' ')[0];
			},
			getOrgOldNameList(list) {
				if (list&&list.length>0) {
					return list.join(';')
				}
				return '--'
			},
			loadDetail() {
				this.$network
					.getData(this.$url.ALLOT_DETAIL + this.businessNo, 'GET', null)
					.then(result => {
						let jsonDic = result.logisticsRecordJson ? JSON.parse(result.logisticsRecordJson) : undefined
						this.allotDic = {
							...result,
							logisticsRecord:jsonDic
						};
						
					})
					.catch(err => {

					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.detail-allot-bg {
		display: flex;
		flex: 1;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}
	.content-container {}
	
	.sum-view-bg {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 10px;
		background: #ffffff;
		border-radius: 4px;
		padding-bottom: 10px;
	}
	
	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		padding: 10px;
		border-bottom:$uni-line-color 1px dotted;
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
		font-size: $uni-font-size-base;
	}
	
	.choose-device-text {
		color: $uni-color-primary;
	}
	
	.item-row {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		padding: 5px;
		font-size: $uni-font-size-base;
	}
	
	.item-title {
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		padding: 5px 8px 5px 5rpx;
	}
	
	.item-bottom {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding: 4px 16px;
		font-size: $uni-font-size-base;
		border-color: $uni-bg-color-grey;
		border-width: 1px 0px 1px 0px;
		border-style: solid;
		color: #FF0000;
	}
	.item-tag {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}
	
	.item-value {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-left: 15px;
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
		background: #FFFFFF;
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
		color: #FFFFFF;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}
	.boldstyle{
		margin-top: 5px;
		font-size: $uni-font-size-lg;
		font-weight: bold;
		margin-bottom: 10px;
	}
</style>
