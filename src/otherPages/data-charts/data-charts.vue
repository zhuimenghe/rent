<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="empty" v-if="tabList.length <= 0">您暂无业务权限</view>
		<view class="top-container" v-if="tabList.length > 0">
			<sunTab 
			:value.sync="index" 
			:tabList="tabList" 
			:scroll="false" 
			activeColor="#E60000" 
			:shownum="false"
			@change="indexchange" 
			/>
			<view class="filter-view">
				<view class="select-view"><selectView :value="orgName" hint="请选择区域" @clickSelect="showPick('org')" textSize="14px" textColor="#333333" /></view>
				<view class="btn-container">
					<view v-if="curItem.id != 2" class="btn" :class="{ active: dateType === 'month' }" @click="selectDate('month')">本月</view>
					<view v-if="curItem.id != 2" class="btn" :class="{ active: dateType === 'year' }" @click="selectDate('year')">本年</view>
					<view v-if="curItem.id != 2" class="btn" :class="{ active: dateType === 'custom' }" @click="changeDate">自定义</view>
				</view>
			</view>
			<view class="filter-view" v-if="isShow">
				<view class="select-view"><selectView :value="startTime" hint="开始时间" @clickSelect="showPick('startTime')" /></view>
				<view style="width:50px;height: 1px;background-color: #999999;" />
				<view class="select-view"><selectView :value="endTime" hint="结束时间" @clickSelect="showPick('endTime')" /></view>
				<view class="btn" @click="reset">重置</view>
			</view>
		</view>
		<!-- 占位符 -->
		<!-- <view class="top-container-zw" v-if="tabList.length > 0">
			<sunTab 
			:value.sync="index" 
			:tabList="tabList" 
			:scroll="false" 
			activeColor="#E60000" 
			:shownum="false"
			@change="indexchange" 
			/>
			<view class="filter-view">
				<view class="select-view"><selectView :value="orgName" hint="请选择区域" @clickSelect="showPick('org')" textSize="14px" textColor="#333333" /></view>
				<view class="btn-container">
					<view v-if="curItem.id != 2" class="btn" :class="{ active: dateType === 'month' }" @click="selectDate('month')">本月</view>
				</view>
			</view>
		</view> -->
		<!-- 占位符 -->
		<view class="tab-content" v-if="tabList.length > 0">
			<view v-if="curItem.id == 0">
				<contractCharts
					:beginDate="startTime"
					:endDate="endTime"
					:orgIdList="orgIdList"
					:orgObj="orgDic"
					:revenueType="revenueType"
					:chartCredit="chartCredit"
					:chartContract="chartContract"
					:contractStatistics="contractStatistics"
					:deviceStatistics="deviceStatistics"
					:contractLXStatistics="contractLXStatistics"
					:deviceLXStatistics="deviceLXStatistics"
					:rentTrendStatistics="rentTrendStatistics"
					:rentTrendStatisticsMore="rentTrendStatisticsMore"
					:debtStatistics="debtStatistics"
					:debtStatisticsMore="debtStatisticsMore"
					:revenueMonthlyStatistics="revenueMonthlyStatistics"
					ref="contractCharts"
					:chartMachine="chartMachine"
					:chartRate="chartRate" 
				/>
			</view>
			<view v-if="curItem.id == 1">
				<businessCharts
					:beginDate="startTime"
					:endDate="endTime"
					:orgIdList="orgIdList"
					:orgObj="orgDic"
					:revenueType="revenueType"
					:chartClient="chartClient"
					:chartStaff="chartStaff"
					:customerId="customerId"
					:customerName="customerName"
					:chartBusiness="chartBusiness"
					:chartTeamBusiness="chartTeamBusiness"
					:staffStatistics="staffStatistics"
					:customerStatistics="customerStatistics"
					:contractStatistics="contractStatistics"
					ref="businessCharts"
				/>
			</view>
			<view v-if="curItem.id == 2">
				<machineCharts 
				ref="machineCharts" 
				:areaDic="orgDic" 
				:chartRate="chartRate" 
				:chartMachine="chartMachine" 
				:chartInventory="chartInventory" 
				:chartDue="chartDue"
				/>
			</view>
		</view>
		<w-picker 
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="false" 
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import selectView from '@/components/common/common-ui/selector-view.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import contractCharts from './contract-charts.vue';
import businessCharts from './business-charts.vue';
import machineCharts from './machine_charts.vue';
export default {
	components: {
		sunTab,
		selectView,
		wPicker,
		contractCharts,
		businessCharts,
		machineCharts
	},
	data() {
		return {
			index: 0,
			curItem: {},
			tabList: [],
			tabObjs: [],
			selectList: [],
			orgList: [
				{
					value: '-1',
					label: '全部区域'
				}
			],
			orgName: '全部区域',
			startTime: '',
			endTime: '',
			orgIdList: [],
			isShow: false,
			pickType: '',
			dateType: '',
			//车辆使用区域
			orgDic: {
				value: '',
				label: '全部区域'
			},
			chartCredit: true, //营收统计
			chartContract: true, //合同统计
			chartClient: true, //客户
			chartStaff: true, //员工
			chartInventory: true, //库存
			chartRate: true, //出租率
			chartMachine: true, //设备统计
			chartDue:true,//设备到期统计
			chartBusiness: true, //个人
			chartTeamBusiness: true, //管理者
			staffStatistics: true, //員工营收统计
			customerStatistics: true, //客户营收统计
			contractStatistics: true, //合同营收统计
			deviceStatistics: true, //设备营收统计
			contractLXStatistics: true, //合同营收统计
			deviceLXStatistics: true, //设备营收统计
			rentTrendStatistics: true, //租金趋势
			rentTrendStatisticsMore: true, //租金趋势-更多
			debtStatistics: true, //应收统计-更多
			debtStatisticsMore: true, //应收统计-更多
			revenueMonthlyStatistics: true, //月度营收统计
			customerId: '',
			customerName: '',
			systemTime: '',
			isStartSysTime: false,
			revenueType: '5',
			revenueTypeList: []
		};
	},
	onShow() {
		this.loadUnreadNum();
	},
	methods: {
		uploadDeviceMessage() {
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, item => {
				let itemDic = {
					...plus.os,
					model: plus.device.model,
					appVersion: item.version
				};
				let param = {
					device: JSON.stringify(itemDic)
				};
				let url = this.$url.POST_DEVICE;
				this.$network
					.getData(url, 'POST', param)
					.then(result => {})
					.catch(err => {});
			});
			// #endif
		},
		changeDate() {
			this.isShow = !this.isShow;
			this.dateType = 'custom';
		},
		selectDate(type) {
			this.dateType = type;
			switch (type) {
				case 'week':
					this.isShow = false;
					this.startTime = this.$dateUtil.getFirstDayOfWeek(new Date());
					this.endTime = this.$dateUtil.timeFormat(new Date());
					this.loadTabData();
					break;
				case 'month':
					this.isShow = false;
					this.startTime = this.$dateUtil.getFirstDayOfMonth(new Date());
					this.endTime = this.$dateUtil.timeFormat(new Date());
					this.loadTabData();
					break;
				case 'year':
					this.isShow = false;
					this.startTime = this.$dateUtil.getFirstDayOfYear(new Date());
					this.endTime = this.$dateUtil.timeFormat(new Date());
					this.loadTabData();
					break;
				case 'custom':
					this.loadTabData();
					break;
				default:
					break;
			}
		},
		loadTabData() {
			switch (this.curItem.id) {
				case 0:
					this.$refs.contractCharts.loadData(this.startTime, this.endTime, this.orgIdList);
					this.$refs.contractCharts.tabLoadData(this.orgDic);
					break;
				case 1:
					this.$refs.businessCharts.loadData(this.startTime, this.endTime, this.orgIdList);
					break;
				case 2:
					this.$refs.machineCharts.tabLoadData(this.orgDic);
					break;
				default:
					break;
			}
		},
		reset() {
			this.orgName = '全部';
			this.startTime = this.isStartSysTime && this.systemTime ? this.systemTime : this.$dateUtil.getFirstDayOfYear(new Date());
			this.endTime = this.$dateUtil.timeFormat(new Date());
			this.orgIdList = [];
			this.dateType = this.isStartSysTime && this.systemTime ? 'custom' : 'year';
			this.isShow = false;
			this.orgDic = {
				value: '',
				label: '全部'
			};
			this.loadTabData();
		},
		indexchange(e) {
			setTimeout(() => {
				this.index = e.index;
				this.curItem = this.tabObjs[this.index];
				if (this.curItem.id == 2) {
					this.isShow = false;
				}
			}, 100);
		},
		showPick(type) {
			this.pickType = type;
			switch (type) {
				case 'org':
					this.selectList = this.orgList ? this.orgList : [];
					this.$refs.selector.show();
					break;
				case 'revenueType':
					this.selectList = this.revenueTypeList ? this.revenueTypeList : [];
					this.$refs.selector.show();
					break;
				case 'startTime':
				case 'endTime':
					this.$refs.date.show();
					break;
				default:
					break;
			}
		},
		onConfirm(val) {
			switch (this.pickType) {
				case 'startTime':
					this.startTime = val.result;
					break;
				case 'endTime':
					this.endTime = val.result;
					break;
				case 'org':
					this.orgName = val.checkArr.label;
					if (val.checkArr.value !== '-1') {
						this.orgIdList = this.$datestr.getOrgIdList(val.checkArr);
						this.orgDic = val.checkArr;
					} else {
						this.orgIdList = [];
						this.orgDic = {
							value: '',
							label: val.checkArr.label
						};
					}
					break;
				case 'revenueType':
					this.revenueType = val.checkArr;
					break;
				default:
					break;
			}
			this.loadTabData();
		},
		getOrgList() {
			let _self = this;
			this.$network
				.getData(this.$url.ORG_ALL, 'GET', null)
				.then(result => {
					if (result && result.length > 0) {
						result.forEach(function dep(o) {
							_self.orgList = [
								..._self.orgList,
								{
									value: o.id,
									label: o.name,
									children: o.children
								}
							];
							if (o.children && o.children.length > 0) o.children.map(dep);
						});
					}
				})
				.catch(err => {});
		},
		loadUnreadNum() {
			let param = {
				current: 1,
				size: 1
			};
			this.$network
				.getData(this.$url.TO_DO_LIST, 'POST', param)
				.then(result => {
					let total = result.total;
					if (Number(total) > 0) {
						uni.setTabBarBadge({
							index: 4,
							text: Number(total) > 99 ? '99+' : total
						});
					} else {
						uni.removeTabBarBadge({
							index: 4
						});
					}
				})
				.catch(err => {});
		}
	},

	onLoad() {
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
		if (resData) {
			let obj = resData.find(o => o.code == 'use_tenant_start_date'); //是否启用系统时间
			let obj1 = resData.find(o => o.code == 'tenant_start_date'); //系统启用时间
			let obj2 = resData.find(o => o.code == 'receivable_config'); //租户营收类别配置
			if (obj) {
				//是不是默认显示合同中的进场时间
				this.isStartSysTime = obj.value == 'true' ? true : false;
				if (this.isStartSysTime && obj1) {
					this.systemTime = obj1.value;
				}
			}
			if (obj2) {
				this.revenueType = obj2.value;
			}
		}
		this.startTime = this.isStartSysTime && this.systemTime ? this.systemTime : this.$dateUtil.getFirstDayOfYear(new Date());
		this.endTime = this.$dateUtil.timeFormat(new Date());
		this.dateType = this.isStartSysTime && this.systemTime ? 'custom' : 'year';
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				this.chartCredit = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_CREDIT);
				console.log('chartCredit---' + this.chartCredit);
				this.chartContract = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_CONTRACT);
				this.chartClient = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_CLINET);
				this.chartBusiness = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_BUSINESS);
				this.chartTeamBusiness = res.data.some(x => x.value === this.$savekey.PERMISSION_MANAGER_STATISTICS);
				this.chartStaff = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_STAFF);
				this.chartInventory = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_INVENTTORY);
				this.chartRate = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_RATE);
				this.chartMachine = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_MACHINE);
				this.staffStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_STAFF_REVENUE_STATISTICS);
				this.customerStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_CUSTOMER_REVENUE_STATISTICS);
				this.contractStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_CONTRACT_REVENUE_STATISTICS);
				this.deviceStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_DEVICE_REVENUE_STATISTICS);
				this.contractLXStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_CONTRACT_LX_REVENUE_QRCODE);
				this.deviceLXStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_LX_REVENUE_QRCODE);
				this.rentTrendStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_RENT_TREND_STATISTICS);
				this.rentTrendStatisticsMore = res.data.some(x => x.value === this.$savekey.PERMISSION_RENT_TREND_STATISTICS_MORE);
				this.debtStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEBT);
				this.debtStatisticsMore = res.data.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEBT_MORE);
				this.revenueMonthlyStatistics = res.data.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_REVENUE_MONTHLY);
				this.chartDue = res.data.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEVICE_DUE_COUNT);
				this.tabObjs = [];
				if (this.chartCredit || this.chartContract) {
					this.tabObjs.push({
						name: '运营',
						id: 0
					});
				}
				if (this.chartClient || this.chartStaff || this.chartBusiness) {
					this.tabObjs.push({
						name: '业务',
						id: 1
					});
				}
				if (this.chartInventory || this.chartRate || this.chartMachine||this.chartDue) {
					this.tabObjs.push({
						name: '设备',
						id: 2
					});
				}
				this.tabList = this.tabObjs.map(o => {
					return o.name;
				});
				if (this.tabObjs.length > 0) {
					this.curItem = this.tabObjs[this.index];
				}
			}
		});
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: res => {
				this.customerId = res.data.id;
				this.customerName = res.data.username;
			}
		});
		this.getOrgList();
		// this.uploadDeviceMessage();
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	min-height: 100%;
	background-color: $uni-bg-color-grey;
	position: relative;
}

.top-container {
	position: sticky;
	top: 0px;
	left: 0px;
	width: 100%;
	z-index: 300;
	display: flex;
	flex-direction: column;
}
.top-container-zw {
	z-index: 0;
	display: flex;
	flex-direction: column;
}
.empty {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	text-align: center;
	margin-top: 50px;
}

.filter-view {
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	padding: 10px 0px;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	align-items: center;
	justify-content: flex-start;
}

.btn-container {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}

.select-view-left {
	display: flex;
	flex: 1;
	flex-direction: row;
}

.select-view {
	flex: 1;
}

.btn {
	padding: 2px 8px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	background-color: #ffffff;
	border-radius: 16px;
	border: 1px solid $uni-color-primary;
	margin: 0px 4px;

	&.active {
		background-color: $uni-color-primary;
		color: #ffffff;
	}
}

.btn-confirm {
	padding: 4px 6px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: #ffffff;
	background-color: $uni-color-primary;
	border-radius: 4px;
	margin: 0px 4px;
}

.btn-reset {
	padding: 4px 6px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	background-color: $uni-bg-color-grey;
	border-radius: 4px;
	margin: 0px 4px;
}

.tab-content {
	display: flex;
	flex-direction: column;
}
</style>
