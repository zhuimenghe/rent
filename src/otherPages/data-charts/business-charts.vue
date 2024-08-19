<template>
	<scroll-view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<!-- v-if="chartTeamBusiness" -->
		<view class="model-view" v-if="false">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconbiaoge"></i>
					<view>{{ '业务营收' }}</view>
				</view>
				<view class="tag-right line-row" @click="goTo('personteam')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<view class="line-row">
					<view class="col-item tab-head" v-for="(item, i) in personRevenueTeam" :key="i">{{ item.name }}</view>
				</view>
				<view class="line-row">
					<view class="tab-content" v-for="(item, i) in personRevenueTeam" :key="i">
						<view>￥{{ item.data }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="chartTeamBusiness">
			<view class="model-tag">
				<i class="iconfont chart-icon iconxinzeng"></i>
				<view>{{ '业务新增' }}</view>
			</view>
			<view class="chart-content">
				<view class="line-row">
					<view class="row-bottom-arrow right-border" @click="goTo('contractteam')">
						<view class="col-item ">
							<view class="legend-name">合同数</view>
							<view class="legend-data">{{ contractNumTeam }}</view>
						</view>
						<i class="iconfont arrow-icon iconarrow-right"></i>
					</view>

					<view class="row-bottom-arrow" @click="goTo('customer')">
						<view class="col-item">
							<view class="legend-name">客户数</view>
							<view class="legend-data">{{ customerNumTeam }}</view>
						</view>
						<i class="iconfont arrow-icon iconarrow-right"></i>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="chartBusiness">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconbiaoge"></i>
					<view>{{ '个人营收' }}</view>
				</view>
				<view class="tag-right line-row" @click="goTo('person')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<view class="line-row">
					<view class="col-item tab-head" v-for="(item, i) in personRevenue" :key="i">{{ item.name }}</view>
				</view>
				<view class="line-row">
					<view class="tab-content" v-for="(item, i) in personRevenue" :key="i">
						<view>￥{{ item.data }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="chartBusiness">
			<view class="model-tag">
				<i class="iconfont chart-icon iconxinzeng"></i>
				<view>{{ '个人业务新增' }}</view>
			</view>
			<view class="chart-content">
				<view class="line-row">
					<view class="row-bottom-arrow right-border" @click="goTo('contract')">
						<view class="col-item ">
							<view class="legend-name">合同数</view>
							<view class="legend-data">{{ contractNum }}</view>
						</view>
						<i class="iconfont arrow-icon iconarrow-right"></i>
					</view>

					<view class="row-bottom-arrow" @click="goTo('customer')">
						<view class="col-item">
							<view class="legend-name">客户数</view>
							<view class="legend-data">{{ customerNum }}</view>
						</view>
						<i class="iconfont arrow-icon iconarrow-right"></i>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="chartStaff">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconrenshu"></i>
					<view>员工排行榜</view>
				</view>
				<view class="tag-right line-row" @click="goTo('staff')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<sun-tab
					:value.sync="staffIndex"
					:tabList="tabList"
					:scroll="false"
					:isFlex="false"
					activeColor="#E60000"
					:shownum="false"
					@change="changeTab($event, 'staff')"
				></sun-tab>
				<view>
					<view v-if="staffList[staffIndex] && staffList[staffIndex].length > 0">
						<view class="item-container" v-for="(item, index) in staffList[staffIndex]" :key="index" v-if="index < 5" @click="goTo('staffRevenue', item)">
							<view class="item-name">
								<image
									v-if="index <= 2 && staffIndex == 0"
									class="img-tag"
									:src="index == 0 ? '/static/image/gj.png' : index == 1 ? '/static/image/yj.png' : '/static/image/jj.png'"
								></image>
								<text class="name-text" :style="{ 'margin-left': index > 2 && staffIndex == 0 ? '18px' : '2px' }">{{ item.name }}</text>
							</view>
							<view>￥{{ moneyUtil.dealNumber(item.value) }}</view>
						</view>
					</view>
					<view class="empty-view" v-else>暂无数据</view>
				</view>
			</view>
		</view>

		<view class="model-view" v-if="chartClient">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconzl--kehuguanli--"></i>
					<view>客户排行榜</view>
				</view>
				<view class="tag-right line-row" @click="goTo('overdue')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<sun-tab
					:value.sync="customerIndex"
					:tabList="tabList"
					:scroll="false"
					:isFlex="false"
					activeColor="#E60000"
					:shownum="false"
					@change="changeTab($event, 'customer')"
				></sun-tab>
				<view v-if="customerList[customerIndex] && customerList[customerIndex].length > 0">
					<view class="item-container" v-for="(item, index) in customerList[customerIndex]" :key="index" v-if="index < 5" @click="goTo('customerRevenue', item)">
						<view class="item-name">
							<image
								v-show="index <= 2 && customerIndex == 0"
								class="img-tag"
								:src="index == 0 ? '/static/image/gj.png' : index == 1 ? '/static/image/yj.png' : '/static/image/jj.png'"
							></image>
							<text class="name-text" :style="{ 'margin-left': index > 2 && customerIndex == 0 ? '18px' : '2px' }">{{ item.name }}</text>
						</view>
						<view>￥{{ moneyUtil.dealNumber(item.value) }}</view>
					</view>
				</view>
				<view class="empty-view" v-else>暂无数据</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
export default {
	components: {
		sunTab
	},
	props: {
		chartClient: {
			type: Boolean,
			default: true
		},
		chartStaff: {
			type: Boolean,
			default: true
		},
		chartBusiness: {
			type: Boolean,
			default: true
		},
		chartTeamBusiness: {
			type: Boolean,
			default: true
		},
		staffStatistics: {
			type: Boolean,
			default: true
		},
		customerStatistics: {
			type: Boolean,
			default: true
		},
		contractStatistics: {
			type: Boolean,
			default: true
		},
		beginDate: {
			type: String,
			default: ''
		},
		endDate: {
			type: String,
			default: ''
		},
		customerId: {
			type: String,
			default: ''
		},
		customerName: {
			type: String,
			default: ''
		},
		orgIdList: {
			type: Array,
			default() {
				return [];
			}
		},
		orgObj: {
			type: Object,
			default() {
				return null;
			}
		},
		revenueType: {
			type: String,
			default: '1'
		}
	},
	data() {
		return {
			staffIndex: 0,
			customerIndex: 0,
			tabList: ['营收排行', '应收排行'],
			staffList: [],
			customerList: [],
			customerNum: 0,
			contractNum: 0,
			personRevenue: [],
			customerNumTeam: 0,
			contractNumTeam: 0,
			personRevenueTeam: [],
			requsetCount: 0,
			receivableType: '2'
		};
	},
	created() {
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
		if (resData) {
			let obj = resData.find(o => o.code === 'account_type');
			if (obj) {
				//是不是默认显示合同中的进场时间
				this.receivableType = obj.value;
			}
		}
		this.loadData(this.beginDate, this.endDate, this.orgIdList);
	},
	methods: {
		goTo(type, item, index) {
			switch (type) {
				case 'contract':
					uni.setStorage({
						data: {
							id: this.$savekey.MS_CONTRACT,
							param: {
								customerId: this.customerId,
								customerName: this.customerName
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
				case 'contractteam':
					uni.setStorage({
						data: {
							id: this.$savekey.MS_CONTRACT,
							param: {
								customerId: '',
								customerName: '业务负责人'
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
				case 'customer':
					uni.navigateTo({
						url: '/otherPages/linkman/custom-admin'
					});
					break;
				case 'staff':
					if (!this.staffStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					uni.navigateTo({
						url:
							'/subOtherPages/homecharts/statistics/staff-revenue-list?beginDate=' +
							this.beginDate +
							'&endDate=' +
							this.endDate +
							'&orgObj=' +
							encodeURIComponent(JSON.stringify(this.orgObj)) +
							'&revenueType=' +
							this.revenueType
					});

					break;
				case 'person':
					if (!this.contractStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					uni.getStorage({
						key: this.$savekey.USER_INFO_MEG,
						success: res => {
							let userObj = {
								label: res.data.username,
								value: res.data.id
							};
							uni.navigateTo({
								url:
									'/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
									this.beginDate +
									'&endDate=' +
									this.endDate +
									'&orgObj=' +
									encodeURIComponent(JSON.stringify(this.orgObj)) +
									'&salesman=' +
									encodeURIComponent(JSON.stringify(userObj)) +
									'&revenueType=' +
									this.revenueType
							});
						}
					});
					break;
				case 'personteam':
					if (!this.contractStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					uni.navigateTo({
						url:
							'/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
							this.beginDate +
							'&endDate=' +
							this.endDate +
							'&orgObj=' +
							encodeURIComponent(JSON.stringify(this.orgObj)) +
							'&revenueType=' +
							this.revenueType
					});
					break;
				case 'staffRevenue':
					if (!this.contractStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					// console.log(item)
					let salesman = {
						label: item.name,
						value: item.id
					};
					if (this.staffIndex === 1) {
						uni.navigateTo({
							url:
								'/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
								this.beginDate +
								'&endDate=' +
								this.endDate +
								'&orgObj=' +
								encodeURIComponent(JSON.stringify(this.orgObj)) +
								'&salesman=' +
								encodeURIComponent(JSON.stringify(salesman)) +
								'&indexNum=1&sortType=debt' +
								'&revenueType=' +
								this.revenueType
						});
					} else {
						uni.navigateTo({
							url:
								'/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
								this.beginDate +
								'&endDate=' +
								this.endDate +
								'&orgObj=' +
								encodeURIComponent(JSON.stringify(this.orgObj)) +
								'&salesman=' +
								encodeURIComponent(JSON.stringify(salesman)) +
								'&sortType=revenue' +
								'&revenueType=' +
								this.revenueType
						});
					}

					break;
				case 'customerRevenue':
					if (!this.contractStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					if (this.customerIndex === 1) {
						uni.navigateTo({
							url:
								'/subOtherPages/homecharts/statistics/contract-revenue-info?customerName=' +
								item.name +
								'&beginDate=' +
								this.beginDate +
								'&endDate=' +
								this.endDate +
								'&orgObj=' +
								encodeURIComponent(JSON.stringify(this.orgObj)) +
								'&indexNum=1&sortType=debt' +
								'&revenueType=' +
								this.revenueType
						});
					} else {
						uni.navigateTo({
							url:
								'/subOtherPages/homecharts/statistics/contract-revenue-info?customerName=' +
								item.name +
								'&beginDate=' +
								this.beginDate +
								'&endDate=' +
								this.endDate +
								'&orgObj=' +
								encodeURIComponent(JSON.stringify(this.orgObj)) +
								'&sortType=revenue' +
								'&revenueType=' +
								this.revenueType
						});
					}
					break;
				case 'overdue':
					if (!this.customerStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}

					uni.navigateTo({
						url:
							'/subOtherPages/homecharts/statistics/customer-overdue-list?beginDate=' +
							this.beginDate +
							'&endDate=' +
							this.endDate +
							'&orgObj=' +
							encodeURIComponent(JSON.stringify(this.orgObj)) +
							'&revenueType=' +
							this.revenueType
					});
					break;
				default:
					break;
			}
		},
		loadData(beginDate, endDate, orgIdList) {
			uni.showLoading();
			this.requsetCount = 0;
			this.getStaffData(beginDate, endDate, orgIdList);
			this.getCustomerData(beginDate, endDate, orgIdList);

			if (this.chartBusiness) {
				this.getPersonData(beginDate, endDate, orgIdList, false);
				this.getContractCount(beginDate, endDate, orgIdList);
				this.getCustomerCount(beginDate, endDate, orgIdList);
			}
			if (this.chartTeamBusiness) {
				// this.getPersonData(beginDate, endDate, orgIdList, true);
				this.getContractCountTeam(beginDate, endDate, orgIdList);
				this.getCustomerCountTeam(beginDate, endDate, orgIdList);
			}
		},
		changeTab(e, type) {
			switch (type) {
				case 'staff':
					setTimeout(() => {
						this.staffIndex = e.index;
					}, 100);
					break;
				case 'customer':
					setTimeout(() => {
						this.customerIndex = e.index;
					}, 100);
					break;
				default:
					break;
			}
		},
		hiddenLoadingWithNum() {
			uni.hideLoading();
			// this.requsetCount = this.requsetCount + 1;
			// console.log(this.requsetCount);
			// if (this.chartBusiness && this.chartTeamBusiness) {
			// 	if (this.requsetCount >= 8) {
			// 		uni.hideLoading();
			// 	}
			// } else if (!this.chartBusiness && !this.chartTeamBusiness) {
			// 	if (this.requsetCount >= 2) {
			// 		uni.hideLoading();
			// 	}
			// } else {
			// 	if (this.requsetCount >= 3) {
			// 		uni.hideLoading();
			// 	}
			// }
		},
		getStaffData(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				orgIdList: orgIdList && orgIdList.length > 0 ? orgIdList : [],
				receivableType: this.revenueType == '2' ? this.receivableType : this.revenueType,
				debtType: '1'
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.STATISTICS_STAFF, 'POST', param)
				.then(result => {
					//营收列表排名
					let res = result && result.length > 0 ? result.filter(o => o.receivable) : [];
					let reneueList =
						res.length > 0
							? res.sort((x, y) => {
									let xr = x.receivable.total ? Number(x.receivable.total) : 0;
									let yr = y.receivable.total ? Number(y.receivable.total) : 0;
									if (xr < yr) {
										return 1;
									}
									if (xr > yr) {
										return -1;
									}
									return 0;
							  })
							: [];

					this.staffList[0] = [
						...reneueList.map(o => {
							return {
								name: o.name,
								orgName: o.orgName,
								value: o.receivable.total,
								id: o.value
							};
						})
					];

					//应收列表排名
					// let res1 = result && result.length > 0 ? result.filter(o => o.receivable && o.receipt) : []
					let debtList =
						result && result.length > 0
							? result.sort((x, y) => {
									let debtX =
										(x.receivable && x.receivable.total ? Number(x.receivable.total) : 0) - (x.receipt && x.receipt.total ? Number(x.receipt.total) : 0);
									let debtY =
										(y.receivable && y.receivable.total ? Number(y.receivable.total) : 0) - (y.receipt && y.receipt.total ? Number(y.receipt.total) : 0);
									if (debtX < debtY) {
										return 1;
									}
									if (debtX > debtY) {
										return -1;
									}
									return 0;
							  })
							: [];
					//营收列表排名
					this.staffList[1] = [
						...debtList.map(o => {
							return {
								name: o.name,
								orgName: o.orgName,
								value: Number(o.payable),
								id: o.value
							};
						})
					];
					this.staffList = JSON.parse(JSON.stringify(this.staffList));
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},
		getCustomerData(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				orgIdList: orgIdList && orgIdList.length > 0 ? orgIdList : [],
				receivableType: this.revenueType == '2' ? this.receivableType : this.revenueType,
				debtType: '1'
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.STATISTICS_CUSTOMER, 'POST', param)
				.then(result => {
					//营收列表排名
					let res = result && result.length > 0 ? result.filter(o => o.receivable) : [];
					let reneueList =
						res.length > 0
							? res.sort((x, y) => {
									let xr = x.receivable.total ? Number(x.receivable.total) : 0;
									let yr = y.receivable.total ? Number(y.receivable.total) : 0;
									if (xr < yr) {
										return 1;
									}
									if (xr > yr) {
										return -1;
									}
									return 0;
							  })
							: [];

					this.customerList[0] = [
						...reneueList.map(o => {
							return {
								name: o.name,
								orgName: o.orgName,
								value: o.receivable.total
							};
						})
					];

					//应收列表排名
					let res1 = result && result.length > 0 ? result.filter(o => o.receivable && o.receipt) : [];
					let debtList =
						res1 && res1.length > 0
							? res1.sort((x, y) => {
									let debtX = (x.receivable.total ? Number(x.receivable.total) : 0) - (x.receipt.total ? Number(x.receipt.total) : 0);
									let debtY = (y.receivable.total ? Number(y.receivable.total) : 0) - (y.receipt.total ? Number(y.receipt.total) : 0);
									if (debtX < debtY) {
										return 1;
									}
									if (debtX > debtY) {
										return -1;
									}
									return 0;
							  })
							: [];
					//营收列表排名
					this.customerList[1] = [
						...debtList.map(o => {
							return {
								name: o.name,
								orgName: o.orgName,
								value: Number(o.payable)
							};
						})
					];
					this.customerList = [...this.customerList];
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},

		//个人面板或管理面板
		getPersonData(beginDate, endDate, orgIdList, isManager) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				orgIdList: orgIdList && orgIdList.length > 0 ? orgIdList : [],
				receivableType: this.revenueType == '2' ? this.receivableType : this.revenueType,
				customerSalesman: isManager ? undefined : this.customerId,
				debtType: '1'
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.STATISTICS_REVENUE, 'POST', param)
				.then(result => {
					let receivable = result && result.receivable && result.receivable.total ? Number(result.receivable.total) : 0;
					let receipt = result && result.receipt && result.receipt.total ? Number(result.receipt.total) : 0;
					// let debt = receivable - receipt;
					let debt = result && result.payable ? Number(result.payable) : 0;

					if (isManager) {
						this.personRevenueTeam = [
							{
								data: this.moneyUtil.dealNumber(receivable),
								name: '营收款'
							},
							{
								data: this.moneyUtil.dealNumber(receipt),
								name: '已收款'
							},
							{
								data: this.moneyUtil.dealNumber(debt),
								name: '应收款'
							}
						];
					} else {
						this.personRevenue = [
							{
								data: this.moneyUtil.dealNumber(receivable),
								name: '营收款'
							},
							{
								data: this.moneyUtil.dealNumber(receipt),
								name: '已收款'
							},
							{
								data: this.moneyUtil.dealNumber(debt),
								name: '应收款'
							}
						];
					}

					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},
		getContractCount(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				customerSalesman: this.customerId
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.CONTRACT_NUM, 'POST', param)
				.then(result => {
					this.contractNum = result ? result : 0;
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},
		getCustomerCount(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				salesman: this.customerId
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.CUSTOMER_NUM, 'POST', param)
				.then(result => {
					this.customerNum = result ? result : 0;
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},
		getContractCountTeam(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				salesman: this.customerId,
				isManager: true
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.CONTRACT_NUM, 'POST', param)
				.then(result => {
					this.contractNumTeam = result ? result : 0;
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		},
		getCustomerCountTeam(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				salesman: this.customerId,
				isManager: true
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.CUSTOMER_NUM, 'POST', param)
				.then(result => {
					this.customerNumTeam = result ? result : 0;
					this.hiddenLoadingWithNum();
				})
				.catch(err => {
					this.hiddenLoadingWithNum();
				});
		}
	}
};
</script>

<style scoped lang="scss">
.content {
	background-color: $uni-bg-color-grey;
}

.model-view {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	padding: 8px 8px 16px 8px;
	border-radius: 10px;
	margin: 8px;
}

.model-tag {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 32px;
	line-height: 32px;
	color: $uni-color-subtitle;
	font-size: $uni-font-size-base;
}

.model-tag-between {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 32px;
	line-height: 32px;
	color: $uni-color-subtitle;
	font-size: $uni-font-size-base;
}

.tag-left {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.tag-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}

.row-bottom-arrow {
	display: flex;
	flex-direction: row;
	align-items: flex-end;
	justify-content: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	flex: 1;
}

.chart-icon {
	margin-right: 4px;
	font-size: $uni-font-size-base;
	color: #a2a2a2;
	display: flex;
	flex-direction: column;
	justify-content: end;
	align-items: flex-end;
}

.arrow-icon {
	height: 16px;
	font-size: $uni-font-size-base;
	color: #a2a2a2;
	display: flex;
	flex-direction: column;
	justify-content: end;
	align-items: flex-end;
}

.chart-content {
	display: flex;
	flex-direction: column !important;
	justify-content: space-between;
	padding: 8px;
	background-color: #ffffff;
}

.line-row {
	display: flex;
	flex-direction: row !important;
}

.tab-head {
	background-color: #eeeeee;
	color: $uni-text-color;
	font-size: $uni-font-size-sm;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	padding: 2px 0px;
}

.tab-content {
	background-color: #ffffff;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	padding: 2px 0px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.top-border {
	border-top: 1px solid $uni-bg-color-grey;
}

.col-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.right-border {
	border-right: 1px solid $uni-bg-color-grey;
}

.legend-name {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-grey;
	margin-left: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.legend-data {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	font-weight: bold;
}

.item-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 8px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}

.item-name {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.img-tag {
	width: 16px;
	height: 16px;
}

.name-text {
	margin-left: 2px;
}

.empty-view {
	width: 100%;
	height: 100px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
</style>
