<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="list-container">
			<view class="list-item" v-for="(contract, i) in contractList" :key="i">
				<view class="float-l-r">
					<view class="c-title">
						<text style="color: #FE931F;" v-if="contract.contractType === '3'">【快】</text>
						<text style="color: #E60000;" v-if="contract.contractType === '2'">【框】</text>
						{{ contract.customerName || '' }}-{{ contract.projectName || '' }}
					</view>
					<view class="state-view" style="color: #FE931F;">{{ contract.stateName }}</view>
				</view>
				<view class="float-l-r" @click="gotoContractDetail(contract)">
					<view class="item-tag">合同单号</view>
					<view class="item-value" style="color: #E60000;">{{ contract.businessNo || '' }}</view>
					<i class="iconfont iconarrow-right" style="padding-right: 0px;color: #E60000;"></i>
				</view>
				<view class="float-l-r"  v-if="isShowField('customerSalesmanName')">
					<view class="item-tag">业务负责人</view>
					<view class="item-value">{{ contract.customerSalesmanName || '' }}</view>
				</view>
				
				<view class="float-l-r" v-if="isShowField('receivableAccount')">
					<view class="item-tag">营收
					<businessTips tipName='performRevenue'/></view>
					<view class="item-value">￥{{ contract.revenue || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('receipt')">
					<view class="item-tag">实收
					<businessTips tipName='statisticsReceivedRevenue'/></view>
					<view class="item-value" style="color: #E60000;" @click="goTo('earning',contract)">￥{{ contract.earning || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('payable')">
					<view class="item-tag">应收
					<businessTips tipName='accountDebt'/></view>
					<view class="item-value">{{ contract.payable || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('orgName')">
					<view class="item-tag">区域</view>
					<view class="item-value">{{ contract.orgName || '' }}</view>
				</view>
				<!-- <view class="float-l-r">
					<view class="item-tag">预付应收款</view>
					<view class="item-value">￥{{ contract.advancePaymentDebtDto&&contract.advancePaymentDebtDto.debt?contract.advancePaymentDebtDto.debt: '' }}</view>
				</view> -->
			</view>
		</view>
		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>

	</view>
</template>
<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
	export default {
		components: {
			uniLoadMore,
		},
		props:{
			showFields:{
				type: Array,
				default(){
					return null
				}
			}
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				status: 'more',
				contractList: [],
				beginDate: '',
				endDate: ''
			};
		},
		mounted() {
			// this.getContractData();
		},
		methods: {
			isShowField(field){
				return dynamicFieldsUtil.isShowField(this.showFields,field)
			},
			gotoContractDetail(item) {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
				});
			},
			goTo(type, item) {
				switch (type) {
					case 'earning':
						uni.setStorage({
							data: {
								id: this.$savekey.MS_PROCEEDS,
								param: {
									contractNo: item.businessNo,
									beginDate: this.beginDate,
									endDate: this.endDate,
									contractName:item.customerName +"-"+item.projectName,
									customerSalesmanName:item.customerSalesmanName,
									customerSalesman:item.customerSalesman
								}
							},
							key: this.$savekey.MEMORY_STORAGE,
							success: () => {
								uni.switchTab({
									url: '/pages/main/business'
								});
							}
						});
						break;
					default:
						break;
				}
			},
			getContractData(orgObj, contractName, salesmanObj, beginDate, endDate,billDic,paidTypeDic,contractStateObj,sortType,orderItems) {
				uni.showLoading();
				this.beginDate= beginDate
				this.endDate= endDate
				this.status = 'loading';
				let param = {
					current: this.page,
					size: this.pageSize,
					receivableType: '1',
					contractName: contractName ? contractName : undefined,
					customerSalesman: salesmanObj && salesmanObj.value ? salesmanObj.value : undefined,
					orgIdList: orgObj && orgObj.value ? this.$datestr.getOrgIdList(orgObj) : undefined,
					beginDate: beginDate ? beginDate + " 00:00:00" : undefined,
					endDate: endDate ? endDate + " 23:59:59" : undefined,
					paidType: paidTypeDic.value === '' ? undefined : paidTypeDic.value,
					debtType: billDic.value === '' ? undefined : billDic.value,
					state: contractStateObj && contractStateObj.value ? contractStateObj.value : undefined,
					sortType:sortType?sortType:undefined,
					orderItems:orderItems?orderItems:undefined
				};
				this.$network
					.getData(this.$url.REVENUE_V2_LIST, 'POST', param)
					.then(result => {
						uni.hideLoading()
						let res = result && result.records ? result.records.map(obj => {
							let revenue = obj.receivableCurrent ? (Number(obj.receivableCurrent.total) > 0 ? Number(Number(obj.receivableCurrent
								.total).toFixed(
								2)) : 0) : 0;
							let earning = obj.receipt ? (Number(obj.receipt.total) > 0 ? Number(Number(obj.receipt.total).toFixed(
								2)) : 0) : 0;
							return {
								...obj,
								revenue: this.moneyUtil.dealNumber(revenue),
								//实收
								earning: this.moneyUtil.dealNumber(earning),
								payable: obj.payable?'￥'+this.moneyUtil.dealNumber(obj.payable):'-',
								// advancePaymentDebtDto: {
								// 	...obj.advancePaymentDebtDto,
								// 	debt: obj.advancePaymentDebtDto && obj.advancePaymentDebtDto.debt ? this.moneyUtil.dealNumber(obj.advancePaymentDebtDto
								// 		.debt) : '0.00'
								// }
							}
						}) : [];
						if (this.page == 1) {
							this.contractList = res;
						} else {
							this.contractList = this.contractList.concat(res);
						}
						let pages = result.pages;
						if (pages <= this.page) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading()
					});
			},
			headerrefresh(orgObj, contractName, salesmanObj, beginDate, endDate, billDic, paidTypeDic,contractStateObj,sortType,orderItems) {
				this.page = 1;
				this.contractList = [];
				this.getContractData(orgObj, contractName, salesmanObj, beginDate, endDate, billDic, paidTypeDic,contractStateObj,sortType,orderItems);
			},
			footerrefresh(orgObj, contractName, salesmanObj, beginDate, endDate, billDic, paidTypeDic,contractStateObj,sortType,orderItems) {
				if (this.status == 'noMore') {
					return;
				}
				this.page += 1;
				this.getContractData(orgObj, contractName, salesmanObj, beginDate, endDate, billDic, paidTypeDic,contractStateObj,sortType,orderItems);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom:env(safe-area-inset-bottom);
		width: 100%;
		// height: 100%;
		background-color: $uni-bg-color-grey;
	}

	.list-container {
		margin-top: 8px;
	}

	.list-item {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 8px;
		margin: 0px 8px 4px 8px;
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: $uni-font-size-base;
	}

	.float-l-r {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.item-tag {
		color: $uni-text-color-gray;
		margin: 4px 0px;
		min-width: 80px;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.item-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
	}

	.c-title {
		color: $uni-text-color;
		width: 65%;
		margin-bottom: 8px;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		/*要显示的行数*/
		-webkit-box-orient: vertical;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.title-tag {
		color: $uni-color-primary;
	}

	.state-view {
		font-size: $uni-font-size-base;
		color: $uni-text-color-disable;
	}

	.types-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		font-size: $uni-font-size-xs;
		padding-bottom: 8px;
	}

	.type-item-container {
		margin-bottom: 4px;
	}

	.in-type {
		padding: 0px 8px;
		border-radius: 8px;
		border-width: 1px;
		border-style: solid;
		height: 14px;
		line-height: 14px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.rent-name-view {
		color: $uni-color-primary;
		border-color: $uni-color-primary;
		margin-right: 8px;
	}

	.pay-appoint-view {
		color: #6280ed;
		border-color: #6280ed;
	}

	.operate-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}
</style>
