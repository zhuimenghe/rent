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
					<view class="item-value" style="color: #E60000;">{{ contract.businessNo || '-' }}</view>
					<i class="iconfont iconarrow-right" style="padding-right: 0px;color: #E60000;"></i>
				</view>
				<view class="float-l-r" v-if="isShowField('customerSalesmanName')">
					<view class="item-tag">业务负责人</view>
					<view class="item-value">{{ contract.customerSalesmanName || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('receivableAccount')">
					<view class="item-tag">营收
						<businessTips tips='截止到当前，合同做过的所有结算单营收总额' />
					</view>
					<view class="item-value">￥{{ contract.revenue || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('receipt')">
					<view class="item-tag">实收
						<businessTips tips='截止到当前的收款总额' />
					</view>
					<view class="item-value" style="color: #E60000;" @click="goTo('earning',contract)">￥{{ contract.earning || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('payable')">
					<view class="item-tag">应收
						<businessTips tipName='accountDebt' />
					</view>

					<view class="item-value">{{ contract.payable || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('settlementCount')">
					<view class="item-tag">结算记录</view>
					<view class="item-value" style="color: #E60000;" @click="goTo('settle',contract)">{{ contract.settlementCount || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('orgName')">
					<view class="item-tag">区域</view>
					<view class="item-value">{{ contract.orgName || '' }}</view>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>

	</view>
</template>
<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import addDays from 'date-fns/addDays';
	import format from 'date-fns/format';
	import subMonths from 'date-fns/subMonths';
	import startOfMonth from 'date-fns/startOfMonth';
	import endOfMonth from 'date-fns/endOfMonth';
	import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
	export default {
		components: {
			uniLoadMore,
		},
		props: {
			showFields: {
				type: Array,
				default () {
					return null
				}
			}
		},
		data() {
			return {
				page: 1,
				pageSize: 5,
				status: 'more',
				contractList: [],
				beginDate: '',
				endDate: '',
			};
		},
		mounted() {
			// this.getContractData();

		},
		methods: {
			isShowField(field) {
				return dynamicFieldsUtil.isShowField(this.showFields, field)
			},
			gotoContractDetail(item) {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
				});
			},
			goTo(type, item) {
				// let accountBeginDate = ''
				// let accountEndDate = ''
				// if (this.beginDate && this.endDate) {
				// 	let accountPayDay = null
				// 	let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
				// 	if (resData) {
				// 		let obj = resData.find(o => o.code === 'account_pay_day')
				// 		accountPayDay = obj.value
				// 	}
				// 	if (accountPayDay) {
				// 		//上个月 
				// 		let date = subMonths(new Date(this.beginDate), 1);

				// 		let lastDay = endOfMonth(date).getDate();
				// 		//上个月的最后一天是否大于账期日期

				// 		if (Number(accountPayDay) < Number(lastDay)) {
				// 			accountBeginDate = addDays(startOfMonth(date), Number(accountPayDay));
				// 		} else {
				// 			accountBeginDate = startOfMonth(new Date(this.beginDate));
				// 		}
				// 		let date2 = new Date(this.endDate);
				// 		let endDay = endOfMonth(date2).getDate();

				// 		if (Number(accountPayDay) < Number(endDay)) {
				// 			accountEndDate = addDays(
				// 				startOfMonth(date2),
				// 				Number(accountPayDay) - 1
				// 			);
				// 		} else {
				// 			accountEndDate = endOfMonth(new Date(date2));
				// 		}
				// 		accountBeginDate = format(accountBeginDate, "yyyy-MM-dd");
				// 		accountEndDate = format(accountEndDate, "yyyy-MM-dd");
				// 	} else {
				// 		accountBeginDate = format(
				// 			startOfMonth(new Date(this.beginDate)),
				// 			"yyyy-MM-dd"
				// 		);
				// 		accountEndDate = format(
				// 			endOfMonth(new Date(this.endDate)),
				// 			"yyyy-MM-dd"
				// 		);
				// 	}
				// }
				switch (type) {
					case 'earning':
						uni.setStorage({
							data: {
								id: this.$savekey.MS_PROCEEDS,
								param: {
									contractNo: item.businessNo,
									beginDate: this.beginDate,
									endDate: this.endDate,
									contractName: item.customerName + "-" + item.projectName,
									customerSalesmanName: item.customerSalesmanName,
									customerSalesman: item.customerSalesman
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
					case 'settle':
						uni.setStorage({
							data: {
								id: this.$savekey.MS_SETTLE_DOWN,
								param: {
									contractNo: item.businessNo,
									beginDate: this.beginDate,
									endDate: this.endDate,
									contractName: item.customerName + "-" + item.projectName,
									customerSalesmanName: item.customerSalesmanName,
									customerSalesman: item.customerSalesman
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
			getContractData(orgObj, contractName, salesmanObj, contractStateObj, beginDate, endDate, billDic, paidTypeDic,
				sortType, accountType,orderItems) {
				this.status = 'loading';
				this.beginDate = beginDate
				this.endDate = endDate
				let param = {
					current: this.page,
					size: this.pageSize,
					receivableType: '5', //营收类型 1：履约 2：账期 3：到期
					contractName: contractName ? contractName : undefined,
					customerSalesman: salesmanObj && salesmanObj.value ? salesmanObj.value : undefined,
					orgIdList: orgObj && orgObj.value ? this.$datestr.getOrgIdList(orgObj) : undefined,
					state: contractStateObj && contractStateObj.value ? contractStateObj.value : undefined,
					beginDate: beginDate ? beginDate + " 00:00:00" : undefined,
					endDate: endDate ? endDate + " 23:59:59" : undefined,
					paidType: paidTypeDic.value === '' ? undefined : paidTypeDic.value,
					debtType: billDic.value === '' ? undefined : billDic.value,
					sortType: sortType ? sortType : undefined,
					orderItems:orderItems?orderItems:undefined
				};
				this.$network
					.getData(this.$url.REVENUE_V2_LIST, 'POST', param)
					.then(result => {
						let res = result && result.records ? result.records.map(obj => {
							let revenue = obj.receivableAccount ? (Number(obj.receivableAccount.total) > 0 ? Number(Number(obj.receivableAccount
								.total).toFixed(
								2)) : 0) : 0;
							let earning = obj.receipt ? (Number(obj.receipt.total) > 0 ? Number(Number(obj.receipt.total).toFixed(
								2)) : 0) : 0;
							return {
								...obj,
								revenue: this.moneyUtil.dealNumber(revenue),
								//实收
								earning: this.moneyUtil.dealNumber(earning),
								payable: obj.payable ? '￥' + this.moneyUtil.dealNumber(obj.payable) : '-',
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
					});
			},
			headerrefresh(orgObj, contractName, salesmanObj, contractStateObj, beginDate, endDate, billDic, paidTypeDic,
				sortType, accountType,orderItems) {
				this.page = 1;
				this.contractList = [];
				this.getContractData(orgObj, contractName, salesmanObj, contractStateObj, beginDate, endDate, billDic, paidTypeDic,
					sortType, accountType,orderItems);
			},
			footerrefresh(orgObj, contractName, salesmanObj, contractStateObj, beginDate, endDate, billDic, paidTypeDic,
				sortType, accountType,orderItems) {
				if (this.status == 'noMore') {
					return;
				}
				this.page += 1;
				this.getContractData(orgObj, contractName, salesmanObj, contractStateObj, beginDate, endDate, billDic, paidTypeDic,
					sortType, accountType,orderItems);
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
		font-size: $uni-font-size-base;
		display: flex;
		flex-direction: row;
		align-items: center;
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
</style>
