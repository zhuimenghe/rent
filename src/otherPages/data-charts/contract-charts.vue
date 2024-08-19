<template>
	<scroll-view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<!-- v-if="chartCredit" -->
		<view class="model-view" v-if="false">
			<view class="model-tag">
				<i class="iconfont chart-icon iconzhuzhuangtu"></i>
				<view style="display: flex;flex-direction: row;align-items: center;">
					营收统计(营收金额:{{ revenueListTotal }}
					<businessTips :tips="'包含优惠/增收:￥' + discounts" v-if="revenueType == '5'" />
					)
				</view>
			</view>
			<view class="chart-content">
				<view class="chart-legend">
					<view class="legend-item" v-for="(item, i) in revenueList1" :key="i" @click="goTo('revenue')">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<view class="legend-color" :style="{ 'background-color': item.color }"></view>
							<view class="legend-name">{{ item.name }}</view>
						</view>
						<view class="legend-data">
							￥{{ item.data }}
							<i class="iconfont chart-icon iconarrow-right"></i>
						</view>
					</view>
				</view>
				<view class="chart-view">
					<view v-for="(item, i) in revenueList1" :key="i" class="chart-item" v-if="item.height >= 0">
						<view class="chart-col"><view class="chart-col" :style="{ background: item.color, height: item.height + 'upx' }"></view></view>
						<view class="chart-text">{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="chartCredit">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconrevenue-copy"></i>
					<view>营收统计</view>
				</view>
				<view class="tag-right line-row" @click="goTo('revenue')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<view class="col-item" v-for="(item, i) in revenueList2" :key="i">
					<view class="legend-name">
						{{ item.name }}
						<view class="content-subtitle" v-if="i == 0">明细</view>
						<businessTips :tipName="item.tip" v-if="i != 0"/>
					</view>
					<view class="legend-data" @click="goToDetail('revenueelse', i)">￥{{ item.data }}</view>
				</view>
			</view>
		</view>
		<!-- v-if="chartContract" -->
		<view class="model-view" v-if="false">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconzl--hetong"></i>
					<view>合同状态</view>
				</view>
				<view class="tag-right line-row" @click="goTo('contractState')">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="chart-content">
				<view class="chart-legend" style="width: 50%;">
					<view class="legend-item" v-for="(item, i) in contractStatePieList" :key="i">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<view class="legend-color" :style="{ 'background-color': item.color }"></view>
							<view class="legend-name">
								{{ item.name }}
								<view class="legend-data" style="margin-left: 8px;">{{ item.data }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="chart-view"><canvas type="2d" canvas-id="contractStatePie" id="contractStatePie" class="charts"></canvas></view>
			</view>
		</view>
		<!-- v-if="chartContract" -->
		<view class="model-view" v-if="false">
			<view class="model-tag">
				<i class="iconfont chart-icon iconzhuzhuangtu"></i>
				<view>合同营收</view>
			</view>
			<view class="chart-content">
				<view class="chart-legend">
					<view class="legend-item" v-for="(item, i) in contractRevenueList" :key="i">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<view class="legend-color" :style="{ 'background-color': item.color }"></view>
							<view class="legend-name">{{ item.name }}</view>
						</view>
						<view class="legend-data" @click="goTo('contractRevenue', item)">
							￥{{ item.data }}
							<i class="iconfont chart-icon iconarrow-right"></i>
						</view>
					</view>
				</view>
				<view class="chart-view">
					<view v-for="(item, i) in contractRevenueList" :key="i" class="chart-item">
						<view class="chart-col"><view class="chart-col" :style="{ background: item.color, height: item.height + 'upx' }"></view></view>
						<view class="chart-text">{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="model-view" v-if="rentTrendStatistics">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconzl--hetong"></i>
					<view>租金趋势</view>
				</view>
				<view class="tag-right line-row" @click="goTo('rentTrend')" v-if="rentTrendStatisticsMore">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="tag-right line-row">
				<view style="flex: 1;"><selectView :value="getYear(year)" hint="年份" @clickSelect="showPick('year')" textSize="10px" height="28px" labelWidth="40px" /></view>
				<view style="flex: 1;">
					<selectView :value="rentalType.label || ''" hint="租赁方式" @clickSelect="showPick('rentalType')" textSize="10px" height="28px" labelWidth="50px" />
				</view>
				<view style="flex: 1;">
					<selectView :value="deviceSort.label || ''" hint="设备类型" @clickSelect="showPick('deviceSort')" textSize="10px" height="28px" labelWidth="70px" />
				</view>
			</view>
			<view class="tag-right line-row" style="margin-top: 4px;">
				<view style="flex: 1;">
					<selectView :value="machineType.label || ''" hint="设备类型" @clickSelect="showPick('machineType')" textSize="10px" height="28px" labelWidth="70px" />
				</view>
				<view style="flex: 1;">
					<selectView :value="deviceHeight.label || ''" hint="高度" @clickSelect="showPick('deviceHeight')" textSize="10px" height="28px" labelWidth="30px" />
				</view>
				<view style="flex: 1;">
					<selectView :value="salesmanDic.label || ''" hint="业务负责人" @clickSelect="showPick('salesman')" textSize="10px" height="28px" labelWidth="70px" />
				</view>
				<!-- <view style="flex: 1;">
					<selectView :value='deviceModel.label||""' hint='设备型号' @clickSelect="showPick('deviceModel')" textSize='10px'
					 height="28px" labelWidth='70px' />
				</view> -->
				<view class="reset-btn" @click="resetTrend">重置</view>
			</view>
			<view class="chart-content">
				<canvas
				 type="2d"
					canvas-id="rentTrendCurve"
					id="rentTrendCurve"
					class="charts-d"
					:disable-scroll="true"
					@touchstart="touchCanvas($event, 'rentTrend')"
					@touchmove="moveCanvas($event, 'rentTrend')"
					@touchend="touchEndCanvas($event, 'rentTrend')"
				></canvas>
			</view>
		</view>
		<view class="model-view" v-if="revenueMonthlyStatistics">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconzl--hetong"></i>
					<view>营收月度统计</view>
				</view>
			</view>
			<view class="tag-right line-row">
				<selectView :value="getYear(monthlyYear)" hint="年份" @clickSelect="showPick('monthlyYear')" textSize="10px" height="28px" labelWidth="50px" />
			</view>
			<view class="chart-content" style="padding: 16px 0px;">
				<canvas
					canvas-id="revenueMonthlyColumn"
					 type="2d"
					id="revenueMonthlyColumn"
					class="charts-d"
					@touchstart="touchCanvas($event, 'monthly')"
					@touchmove="moveCanvas($event, 'monthly')"
					@touchend="touchEndCanvas($event, 'monthly')"
					:disable-scroll="true"
				></canvas>
			</view>
		</view>
		<view class="model-view" v-if="debtStatistics">
			<view class="model-tag-between">
				<view class="tag-left">
					<i class="iconfont chart-icon iconzl--hetong"></i>
					<view>应收统计</view>
				</view>
				<view class="tag-right line-row" @click="goTo('debt')" v-if="debtStatisticsMore">
					更多
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<sun-tab
				style="width: 730upx;"
				defaultbgColor="#FFFFFF"
				activebgColor="#FFFFFF"
				:value.sync="debtIndex"
				:tabList="debtTabList"
				activeColor="#E60000"
				:shownum="false"
				:isFlex="false"
				@change="debtChange"
			/>
			<view style="width: 100%;height: 2px;background: #F5F4F9;" />

			<view style="display: flex;flex-direction: row;">
				<canvas  type="2d" canvas-id="debtPerformColumn" id="debtPerformColumn" class="charts-d" @touchstart="touchstart($event, 'debtPerform')"></canvas>
				<canvas  type="2d" canvas-id="debtPaymentColumn" id="debtPaymentColumn" class="charts-d" @touchstart="touchstart($event, 'debtPayment')"></canvas>
			</view>
			<view style="display: flex;flex-direction: row;margin-top: 8px;">
				<view style="flex:1;text-align: center;font-size: 14px; color: #999999;">履约应收</view>
				<view style="flex:1;text-align: center;font-size: 14px; color: #999999;">账期应收</view>
			</view>
		</view>
		<!-- 出租率 -->
		<view class="bg-item" v-if="chartRate">
			<view class="rental-title">
				<i class="iconfont chart-icon iconzhuzhuangtu"></i>
				<view class="title-left"><text>月度出租率</text></view>
				<view class="right-style-all">
					<view class="right-style-all" @click="changeItem">
						<view style="color: #222831;text-align: center;">对比:</view>
						<selectView 
						:value="rentalDic.label || ''" 
						hint="设备类型" 
						@clickSelect="changeItem" 
						textSize="12px" 
						height="28px" 
						labelWidth="50px" 
						/>
					</view>
					<view @click="goToMoreRate"><text>更多</text></view>
					<i class="iconfont cellrightImg iconarrow-right"></i>
				</view>
			</view>
			<autoDeviceQueryComponent 
			ref="autoDeviceQueryComponent" 
			@reset="reset" 
			@query="query" 
			/>
			<canvas 
			canvas-id="canvaColumn" 
			 type="2d"
			id="canvaColumn" 
			class="charts-d" 
			@touchstart="touchstart($event, 'rentcolumn')" 
			/>
		</view>
		<!-- 出租率结束 -->
		<view class="bg-item" v-if="chartMachine">
			<view class="rental-title">
				<i class="iconfont chart-icon iconduotuduibi"></i>
				<text class="title-left">设备统计</text>
				<view class="left-filter">
					<view :class="{ 'unselect-style': statisticsType != 'all', 'select-style': statisticsType === 'all' }" @click="statistics('all')"><text>全部</text></view>
					<view :class="{ 'unselect-style': statisticsType != 'selfRent', 'select-style': statisticsType === 'selfRent' }" @click="statistics('selfRent')">
						<text>自有</text>
					</view>
					<view :class="{ 'unselect-style': statisticsType != 'sublet', 'select-style': statisticsType === 'sublet' }" @click="statistics('sublet')">
						<text>转租</text>
					</view>
				</view>
				<view class="right-style" @click="stockAll">
					<view><text>更多</text></view>
					<i class="iconfont cellrightImg iconarrow-right"></i>
				</view>
			</view>
			<sun-tab
				style="width: 730upx;"
				defaultbgColor="#FFFFFF"
				activebgColor="#FFFFFF"
				:value.sync="deviceindex"
				:tabList="devicetabList"
				activeColor="#E60000"
				:shownum="false"
				:isFlex="false"
				@change="devicechange"
			/>
			<view style="width: 100%;height: 2px;background: #F5F4F9;" />
			<view class="chart-content" v-if="deviceindex === 0">
				<view class="chart-legend" style="width: 50%;">
					<view class="legend-item" v-for="(item, i) in stateArr" :key="i">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<view class="legend-color" :style="{ 'background-color': item.color }"></view>
							<view class="legend-name">
								{{ item.name }}
								<view class="legend-data" style="margin-left: 4px;">{{ item.data }}台</view>
							</view>
						</view>
					</view>
				</view>
				<view class="chart-view">
					<canvas type="2d" style="margin-top: 5px;" canvas-id="devicecanva" id="devicecanva" class="charts-pie" @touchstart="touchstart($event, 'device')" />
				</view>
			</view>
			<view v-if="deviceindex != 0">
				<canvas type="2d" style="margin-top: 5px;" canvas-id="canvaDeviceColumn" id="canvaDeviceColumn" class="charts-d" @touchstart="touchstart($event, 'devicec')" />
			</view>
		</view>
		<view class="pop-container">
			<uni-popup ref="startDialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title"><text>营收统计</text></view>
					<view class="row-item" @click="clickContract" v-if="revenueType != '1' && contractStatistics">
						<text>合同营收统计</text>
					</view>
					<view class="row-item" @click="clickDevice" v-if="revenueType != '1' && deviceStatistics">
						<text>设备营收统计</text>
					</view>
					<view class="row-item" @click="clickContract" v-if="revenueType == '1' && contractLXStatistics">
						<text>合同履约营收统计</text>
					</view>
					<view class="row-item" @click="clickDevice" v-if="revenueType == '1' && deviceLXStatistics">
						<text>设备履约营收统计</text>
					</view>
					<view class="row-item" style="background: #dcdcdc;" @click="clickCancle">
						<text>取消</text>
					</view>
				</view>
			</uni-popup>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="year" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date" themeColor="#E60000" />
	</scroll-view>
</template>

<script>
import uCharts from "@/components/common/u-charts/u-charts"
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import selectView from '@/components/common/common-ui/selector-view.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import autoDeviceQueryComponent from '@/components/common/common-ui/auto-device-query-component.vue';
import {canvas2dCtx} from '@/common/util/util';
import { mapState } from 'vuex';
var contractStatePie = null;
var contractRevenueCol = null;
var canvaPie = null;
var canvaDeviceColumn = null;
var rentTrendCurve = null;
var debtPerformColumn = null;
var debtPaymentColumn = null;
var revenueMonthlyColumn = null;
var canvaColumn = null;
export default {
	components: {
		uniPopup,
		sunTab,
		selectView,
		wPicker,
		autoDeviceQueryComponent
	},
	props: {
		chartCredit: {
			type: Boolean,
			default: true
		},
		chartContract: {
			type: Boolean,
			default: true
		},
		contractStatistics: {
			type: Boolean,
			default: true
		},
		deviceStatistics: {
			type: Boolean,
			default: true
		},
		contractLXStatistics: {
			type: Boolean,
			default: true
		},//合同营收统计 
		deviceLXStatistics: {
			type: Boolean,
			default: true
		},//设备营收统计
		//营收月度统计
		revenueMonthlyStatistics: {
			type: Boolean,
			default: true
		},
		rentTrendStatistics: {
			type: Boolean,
			default: true
		},
		rentTrendStatisticsMore: {
			type: Boolean,
			default: true
		},
		chartMachine: {
			type: Boolean,
			default: false
		},
		debtStatistics: {
			type: Boolean,
			default: false
		},
		debtStatisticsMore: {
			type: Boolean,
			default: false
		},
		beginDate: {
			type: String,
			default: ''
		},
		endDate: {
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
		},
		chartRate: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			cWidth: '',
			cHeight: '',
			// pixelRatio: 1,
			revenueList1: [],
			revenueList2: [],
			revenueListTotal: '0.00',
			discounts: '0.00',
			contractStatePieList: [],
			contractRevenueList: [],
			colors: ['#E60000', '#10CBE1', '#3B80F5', '#FFDB33', '#FF9535'],
			//设备统计
			deviceindex: 0,
			devicetabList: ['状态', '类型', '高度', '品牌'],
			stateArr: [],
			typeArr: [],
			heightArr: [],
			brandArr: [],
			statisticsType: 'all',
			year: '',
			rentalTypeList: [],
			machineTypeList: [],
			deviceModelList: [],
			rentalType: {},
			deviceSort: {},
			deviceSortList: [],
			machineType: {},
			deviceHeight: {},
			salesmanDic: {},
			heightList: [],
			deviceModel: {},
			selectList: [],
			pickType: '',
			selectIndex: 0,
			selectType: '',
			debtIndex: 0,
			debtTabList: ['应收金额', '应收客户'],
			curYear: 3000,
			receivableType: '2',
			monthlyYear: '',
			orgList: [],
			salesmanlist: [],
			//月出租率
			rentalDic: {
				value: '-1',
				label: '去年同期'
			},
			rentalList: [],
			yearMRList: [],
			deviceSortRent:{},
			machineTypeRent:{},
			deviceHeightRent:{},
			deviceModelRent:{},
		};
	},
	computed:{
		...mapState('system',{
			pixelRatio:s=>s.systemInfo.pixelRatio
		})
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
		this.year = this.beginDate + ' 00:00:00';
		this.monthlyYear = this.beginDate + ' 00:00:00';
		this.cWidth = uni.upx2px(320);
		this.cHeight = uni.upx2px(320);
		this.loadData(this.beginDate, this.endDate, this.orgIdList);
		//设备统计
		let type = this.deviceindex + 1;
		this.getPieStateList(type, this.orgObj);
		if (this.rentTrendStatistics) {
			this.loadSettlementTypes();
			this.loadDeviceSort();
			this.loadmachineType();
			this.loadOwnerList();
			// this.loaddeviceModel();
			this.getHeightList();
		}
		if (this.revenueMonthlyStatistics) {
			this.loadMonthlyRevenueData();
		}

		if (this.debtStatistics) {
			this.loadPerformDebtData();
			this.loadPaymentDebtData();
		}
		if(this.chartRate){
			this.loadRentalData(this.orgObj, '');
		}
		this.loadAreaList();
	},
	methods: {
		//加载负责人
		loadOwnerList() {
			let param = {
				showAdmin: false,
				roleType: this.$savekey.USER_ROLE_BUSINESS
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.salesmanlist = [];
					this.salesmanlist.push({
						label: '全部',
						value: ''
					});
					this.salesmanlist = this.salesmanlist.concat(
						result
							? result.map(dict => {
									return {
										label: dict.username,
										value: dict.id
									};
							  })
							: []
					);
				})
				.catch(err => {});
		},
		resetTrend() {
			this.machineType = {};
			this.deviceHeight = {};
			this.deviceModel = {};
			this.salesmanDic = {};
			this.loadmachineType();
			// this.loaddeviceModel();
			this.getHeightList();
			this.loadRentTrendData();
		},
		getYear(date) {
			let newdate = date.replace(/-/g, '/').replace(/-/g, '/');
			return newdate ? new Date(newdate).getFullYear() + '年' : '';
		},
		showPick(type) {
			this.pickType = type;
			switch (type) {
				case 'year':
				case 'monthlyYear':
					this.$refs.date.show();
					break;
				case 'rentalType':
					this.selectList = this.rentalTypeList;
					this.$refs.selector.show();
					break;
				case 'deviceSort':
					this.selectList = this.deviceSortList;
					this.$refs.selector.show();
					break;
				case 'machineType':
					this.selectList = this.machineTypeList;
					this.$refs.selector.show();
					break;
				case 'deviceModel':
					this.selectList = this.deviceModelList;
					this.$refs.selector.show();
					break;
				case 'deviceHeight':
					this.selectList = this.heightList;
					this.$refs.selector.show();
					break;
				case 'salesman':
					this.selectList = this.salesmanlist;
					this.$refs.selector.show();
					break;
				default:
					break;
			}
		},
		onConfirm(val) {
			switch (this.pickType) {
				case 'year':
					this.year = val.result + '-01-01 00:00:00';
					this.loadRentTrendData();
					break;
				case 'monthlyYear':
					this.monthlyYear = val.result + '-01-01 00:00:00';
					this.loadMonthlyRevenueData();
					break;
				case 'rentalType':
					this.rentalType = val.checkArr;
					this.loadRentTrendData();
					break;
				case 'deviceSort':
					this.deviceSort = val.checkArr;
					this.machineType = {};
					this.deviceHeight = {};
					// this.deviceModel={}

					this.loadmachineType();
					this.getHeightList();
					// this.loaddeviceModel();
					this.loadRentTrendData();
					break;
				case 'machineType':
					this.machineType = val.checkArr;
					this.deviceHeight = {};
					// this.deviceModel = {}
					this.getHeightList();
					// this.loaddeviceModel();
					this.loadRentTrendData();
					break;
				case 'deviceModel':
					this.deviceModel = val.checkArr;
					this.loadRentTrendData();
					break;
				case 'deviceHeight':
					this.deviceHeight = val.checkArr;
					this.loadRentTrendData();
					// this.deviceModel = {}
					// this.loaddeviceModel();
					break;
				case 'salesman':
					this.salesmanDic = val.checkArr;
					this.loadRentTrendData();
					break;
				case 'rentbay':
				    this.rentalDic = val.checkArr;
				    if (this.rentalDic.value == -1) {
				    	this.reloadRentalC(this.yearMRList, '去年', '当年');
				    } else {
				    	this.loadRentalData(this.rentalDic, '');
				    }
				default:
					break;
			}
		},
		//租赁方式
		loadSettlementTypes() {
			this.$network
				.loadType('settlement_type')
				.then(result => {
					this.rentalTypeList = result;
					if (this.rentalTypeList && this.rentalTypeList.length > 0) {
						this.rentalType = this.rentalTypeList[0];
						this.loadRentTrendData();
					}
				})
				.catch(err => {});
		},
		//设备类别
		loadDeviceSort() {
			let param = {
				source: 'device_type'
			};
			this.$network
				.getData(this.$url.DEVICE_SELECT, 'POST', param)
				.then(result => {
					this.deviceSortList = [];
					this.deviceSortList.push({
						label: '全部',
						value: ''
					});
					this.deviceSortList = this.deviceSortList.concat(
						result
							? result.map((o, index) => {
									return {
										value: o.key,
										label: o.value
									};
							  })
							: []
					);
				})
				.catch(err => {});
		},
		//设备类型
		loadmachineType() {
			let param = {
				source: 'machine_type'
			};
			if (this.deviceSort && this.deviceSort.value) {
				param = {
					...param,
					device_type: this.deviceSort.value //设备类别
				};
			}
			this.$network
				.getData(this.$url.DEVICE_SELECT, 'POST', param)
				.then(result => {
					this.machineTypeList = [];
					this.machineTypeList.push({
						label: '全部',
						value: ''
					});
					this.machineTypeList = this.machineTypeList.concat(
						result
							? result.map((o, index) => {
									return {
										value: o.key,
										label: o.value
									};
							  })
							: []
					);
				})
				.catch(err => {});
		},
		//设备型号
		loaddeviceModel() {
			let param = {
				source: 'name'
			};
			if (this.deviceSort && this.deviceSort.value) {
				param = {
					...param,
					device_type: this.deviceSort.value //设备类别
				};
			}
			if (this.machineType && this.machineType.value) {
				param = {
					...param,
					machine_type: this.machineType.value
				};
			}
			if (this.deviceHeight && this.deviceHeight.value) {
				param = {
					...param,
					machine_height: this.deviceHeight.value
				};
			}
			// if (this.tonnageObj && this.tonnageObj.value) {
			// 	param = {
			// 		...param,
			// 		tonnage: this.tonnageObj.value
			// 	}
			// }
			// if (this.brandObj && this.brandObj.value) {
			// 	param = {
			// 		...param,
			// 		brand: this.tonnageObj.value
			// 	}
			// }
			this.$network
				.getData(this.$url.DEVICE_SELECT, 'POST', param)
				.then(result => {
					this.deviceModelList = [];
					this.deviceModelList.push({
						label: '全部',
						value: ''
					});
					this.deviceModelList = this.deviceModelList.concat(
						result
							? result.map((o, index) => {
									return {
										value: o.key,
										label: o.value
									};
							  })
							: []
					);
				})
				.catch(err => {});
		},
		getHeightList() {
			let param = {
				source: 'machine_height'
			};
			if (this.deviceSort && this.deviceSort.value) {
				param = {
					...param,
					device_type: this.deviceSort.value //设备类别
				};
			}
			if (this.machineType && this.machineType.value) {
				param = {
					...param,
					machine_type: this.machineType.value
				};
			}

			this.$network
				.getData(this.$url.DEVICE_SELECT, 'POST', param)
				.then(result => {
					this.heightList = [];
					this.heightList.push({
						label: '全部',
						value: ''
					});
					this.heightList = this.heightList.concat(
						result
							? result.map((o, index) => {
									return {
										value: o.key,
										label: o.value
									};
							  })
							: []
					);
				})
				.catch(err => {});
		},
		loadMonthlyRevenueData() {
			let param = {
				orgIdList: this.orgIdList ? this.orgIdList : []
			};
			if (this.monthlyYear) {
				param = {
					...param,
					searchDate: this.monthlyYear
				};
			}
			this.$network
				.getData(this.$url.CHART_REVENUE_MOTHLY_URL, 'POST', param)
				.then(result => {
					let categories = [];
					let serie = [];
					if (result && result.length > 0) {
						categories = result.map(o => {
							return o.label + '月';
						});
						serie = result.map(o => {
							let isHideMoney = new Date(this.monthlyYear).getFullYear() == new Date().getFullYear() && Number(o.label) > new Date().getMonth() + 1;
							return isHideMoney ? null : Number.parseFloat(o.value).toFixed(2);
						});
					} else {
						for (let i = 1; i < 13; i++) {
							categories.push(i + '月');
							serie.push(null);
						}
					}
					let data = {
						categories: categories,
						series: [
							{
								data: serie,
								color: '#E60000',
								legendShape: 'rect'
							}
						]
					};
					if (revenueMonthlyColumn) {
						revenueMonthlyColumn = null;
					}
					this.showdeviceColumn('revenueMonthlyColumn', data);
				})
				.catch(err => {});
		},
		//设备趋势
		loadRentTrendData() {
			let param = {
				settlementType: this.rentalType.value,
				mode: '1'
			};
			//类别
			if (this.deviceSort && this.deviceSort.value) {
				param = {
					...param,
					deviceType: this.deviceSort.value
				};
			}
			if (this.machineType && this.machineType.value) {
				param = {
					...param,
					type: this.machineType.value
				};
			}
			if (this.deviceModel && this.deviceModel.value) {
				param = {
					...param,
					machineType: this.deviceModel.value
				};
			}
			if (this.deviceHeight && this.deviceHeight.value) {
				param = {
					...param,
					height: this.deviceHeight.value
				};
			}
			if (this.year) {
				param = {
					...param,
					searchDate: this.year
				};
			}
			if (this.salesmanDic && this.salesmanDic.value) {
				param = {
					...param,
					customerSalesman: this.salesmanDic.value,
					mode: '2'
				};
			}
			this.$network
				.getData(this.$url.CHART_RENT_TREND_URL, 'POST', param)
				.then(result => {
					let categories = [];
					let serie = [];
					let serie1 = [];
					let series = [];
					if (result && result.length > 0) {
						let allData = [];
						result.forEach(o => {
							//设置x坐标点
							if (o.monthList && o.monthList.length > 0) {
								o.monthList.forEach(x => {
									if (allData.length <= 0 || !allData.some(y => y.month == x.month)) {
										allData.push({
											month: x.month,
											monthHire: x.monthHire ? Number(x.monthHire) : 0,
											monthDayHire: x.monthDayHire ? Number(x.monthDayHire) : 0,
											len: x.monthHire ? 1 : 0
										});
									} else {
										//所有设备每个月的总额
										let pos = allData.findIndex(n => n.month == x.month);
										allData[pos].monthHire = allData[pos].monthHire + (x.monthHire ? Number(x.monthHire) : 0);
										allData[pos].monthDayHire = allData[pos].monthDayHire + (x.monthDayHire ? Number(x.monthDayHire) : 0);
										allData[pos].len += x.monthHire ? 1 : 0;
									}
									//
								});
							}
						});
						categories =
							allData && allData.length > 0
								? allData.map(o => {
										return o.month + '月';
								  })
								: [];
						serie =
							allData && allData.length > 0
								? allData.map(o => {
										let isHideMoney = new Date(this.year).getFullYear() == new Date().getFullYear() && o.month > new Date().getMonth() + 1;
										return isHideMoney ? null : o.len != 0 ? (o.monthHire / o.len).toFixed(2) : 0;
								  })
								: [];
						serie1 =
							allData && allData.length > 0
								? allData.map(o => {
										let isHideMoney = new Date(this.year).getFullYear() == new Date().getFullYear() && o.month > new Date().getMonth() + 1;
										return isHideMoney ? null : o.len != 0 ? (o.monthDayHire / o.len).toFixed(2) : 0;
								  })
								: [];
					} else {
						for (let i = 1; i < 13; i++) {
							categories.push(i + '月');
							serie.push(null);
							serie1.push(null);
						}
					}

					series = [
						{
							name: this.rentalType.value == '5' ? '周租金' : this.rentalType.value == '1' ? '日租金' : '月租金',
							data: serie,
							color: '#E60000'
						}
					];
					if (this.rentalType && (this.rentalType.value == '4' || this.rentalType.value == '6')) {
						series.push({
							name: '日租金',
							data: serie1,
							color: '#ffaa00'
						});
					}
					let data = {
						categories: categories,
						series: series
					};

					if (rentTrendCurve) {
						rentTrendCurve = null;
						this.showRentCurve('rentTrendCurve', data);
					} else {
						this.showRentCurve('rentTrendCurve', data);
					}
				})
				.catch(err => {});
		},
		//履约应收统计
		loadPerformDebtData() {
			let param = {
				debtDimension: this.debtIndex == 0 ? '1' : '2', //应收统计维度 1：应收总额 2：应收客户数
				receivableType: '1' //营收类型 1：履约 2：账期 3：到期
			};

			this.$network
				.getData(this.$url.STATISTICS_DEBT, 'POST', param)
				.then(result => {
					this.setDebtCol('debtPerformColumn', result);
				})
				.catch(err => {});
		},
		//履约账期统计
		loadPaymentDebtData() {
			let param = {
				debtDimension: this.debtIndex == 0 ? '1' : '2', //应收统计维度 1：应收总额 2：应收客户数
				receivableType: this.receivableType //营收类型 1：履约 2：账期 3：到期
			};

			this.$network
				.getData(this.$url.STATISTICS_DEBT, 'POST', param)
				.then(result => {
					this.setDebtCol('debtPaymentColumn', result);
				})
				.catch(err => {});
		},
		setDebtCol(type, result) {
			let categories = ['1月内', '1~3个月', '3个月以上'];
			let series = [0, 0, 0];
			if (result.monthDebt) {
				series[0] = Number.parseFloat(result.monthDebt);
			}
			if (result.twoMonthDebt) {
				series[1] = Number.parseFloat(result.twoMonthDebt);
			}

			if (result.threeMonthDebt) {
				series[2] = Number.parseFloat(result.threeMonthDebt);
			}
			let data = {
				categories: categories,
				series: [
					{
						data: series,
						color: '#E60000'
					}
				]
			};
			switch (type) {
				case 'debtPerformColumn': //履约
					if (debtPerformColumn) {
						debtPerformColumn = null;
					}
					this.showdeviceColumn('debtPerformColumn', data);
					break;
				case 'debtPaymentColumn': //账期
					if (debtPaymentColumn) {
						debtPaymentColumn = null;
					}
					this.showdeviceColumn('debtPaymentColumn', data);
					break;
				default:
					break;
			}
		},

		//设备统计
		touchstart(e, type) {
			if (type === 'device') {
				if (canvaPie) {
					canvaPie.showToolTip(e, {
						formatter: function(item, category) {
							if (category) {
								return category + ':' + item.data + '台';
							}
							return item.name + ':' + item.data + '台';
						}
					});
				}
			} else if (type === 'devicec') {
				if (canvaDeviceColumn) {
					canvaDeviceColumn.showToolTip(e, {
						formatter: function(item, category) {
							if (category) {
								return category + ':' + item.data + '台';
							}
							return item.name + ':' + item.data + '台';
						}
					});
				}
			} else if (type === 'debtPerform') {
				if (debtPerformColumn) {
					debtPerformColumn.showToolTip(e, {
						formatter: (item, category) => {
							return this.debtIndex == 0 ? '￥' + this.moneyUtil.dealNumber(item.data) : item.data;
						}
					});
				}
			} else if (type === 'debtPayment') {
				if (debtPaymentColumn) {
					debtPaymentColumn.showToolTip(e, {
						formatter: (item, category) => {
							return this.debtIndex == 0 ? '￥' + this.moneyUtil.dealNumber(item.data) : item.data;
						}
					});
				}
			}else if(type === 'rentcolumn'){
				if (canvaColumn) {
					canvaColumn.showToolTip(e, {
						formatter: function(item, category) {
							return item.name + category + ':' + item.data + '%';
						}
					});
				}
			}
		},
		tabLoadData(orgDic) {
			//加载设备统计
			this.stateArr = [];
			this.typeArr = [];
			this.heightArr = [];
			this.brandArr = [];
			let type = this.deviceindex + 1;
			this.getPieStateList(type, orgDic);
			this.loadRentalData(orgDic, 'tab');
		},
		statistics(type) {
			this.stateArr = [];
			this.typeArr = [];
			this.heightArr = [];
			this.brandArr = [];
			this.statisticsType = type;
			let selecttype = this.deviceindex + 1;
			this.getPieStateList(selecttype, this.orgObj);
		},
		stockAll() {
			uni.navigateTo({
				url: '/devicePages/record/device-record?orgDic=' + encodeURIComponent(JSON.stringify(this.orgObj))
			});
		},
		getPieStateList(type, orgDic) {
			uni.showLoading({
				mask: true
			});
			let oList = this.$datestr.getOrgIdList(orgDic);
			let param = {
				type: type,
				// orgIdList: this.$datestr.getOrgIdList(orgDic),
				orgId: oList.length > 0 ? oList.join(',') : '',
				assetType: this.statisticsType
			};
			this.$network
				.getData(this.$url.HOME_MACHINE_STATE_LIST, 'GET', param)
				.then(result => {
					this.dealPieData(result);

					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		dealPieData(result) {
			if (this.deviceindex === 0) {
				this.stateArr = result.map((o, index) => {
					return {
						name: o.name,
						data: o.count,
						unit: '台',
						color: this.colors[index]
					};
				});
				this.showPie('devicecanva', this.stateArr);
			} else if (this.deviceindex === 1) {
				this.typeArr = result;
				this.updatacolumnChart(this.typeArr, '类型');
			} else if (this.deviceindex === 2) {
				this.heightArr = result;
				this.updatacolumnChart(this.heightArr, '高度');
			} else if (this.deviceindex === 3) {
				this.brandArr = result;
				this.updatacolumnChart(this.brandArr, '品牌');
			}
		},
		async showRentCurve(canvasId, chartData) {
			let cWidth = uni.upx2px(650);
			let cHeight = uni.upx2px(400);
			if (rentTrendCurve) {
				rentTrendCurve = null;
			}
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			rentTrendCurve = new uCharts({
				context,
				type: 'area',
				fontSize: 8,
				legend: {
					show: false
				},
				dataLabel: false,
				dataPointShape: true,
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				categories: chartData.categories,
				series: chartData.series,
				animation: true,
				enableScroll: false, //开启图表拖拽功能
				xAxis: {
					disabled: false,
					disableGrid: true,
					itemCount: 12,
					axisLine: false,
					rotateLabel: true
					// scrollShow: true, //新增是否显示滚动条，默认false
				},
				yAxis: {
					disableGrid: true,
					data: [
						{
							disabled: false,
							axisLine: false,
							min: 0,
							format: val => {
								return '￥' + this.moneyUtil.dealNumber(val);
							}
						}
					]
				},
				width: cWidth*this.pixelRatio,
				height: cHeight*this.pixelRatio,
				extra: {
					area: {
						type: 'curve',
						opacity: 0.2,
						addLine: true,
						width: 2
					}
				}
			});
		},
		touchCanvas(e, type) {
			switch (type) {
				case 'rentTrend':
					if (!rentTrendCurve) {
						return;
					}
					rentTrendCurve.scrollStart(e);
					break;
				case 'monthly':
					if (!revenueMonthlyColumn) {
						return;
					}
					revenueMonthlyColumn.scrollStart(e);
					break;
				default:
					break;
			}
		},
		moveCanvas(e, type) {
			switch (type) {
				case 'rentTrend':
					if (!rentTrendCurve) {
						return;
					}
					rentTrendCurve.scroll(e);
					break;
				case 'monthly':
					if (!revenueMonthlyColumn) {
						return;
					}
					revenueMonthlyColumn.scroll(e);
					break;
				default:
					break;
			}
		},
		touchEndCanvas(e, type) {
			switch (type) {
				case 'rentTrend':
					if (!rentTrendCurve) {
						return;
					}
					rentTrendCurve.scrollEnd(e);
					//下面是toolTip事件，如果滚动后不需要显示，可不填写
					rentTrendCurve.showToolTip(e, {
						formatter: (item, category) => {
							console.log(item);
							return category + ' ' + item.name + '： ￥' + this.moneyUtil.dealNumber(item.data);
						}
					});
					break;
				case 'monthly':
					if (!revenueMonthlyColumn) {
						return;
					}
					revenueMonthlyColumn.showToolTip(e, {
						formatter: (item, category) => {
							return '￥' + this.moneyUtil.dealNumber(item.data);
						}
					});
					break;
				default:
					break;
			}
		},
		async showdeviceColumn(canvasId, chartData) {
			let canvasObj = null;
			let cWidth = uni.upx2px(730);
			let cHeight = uni.upx2px(400);
			if (canvasId == 'canvaDeviceColumn') {
				if (canvaDeviceColumn) {
					canvaDeviceColumn = null;
				}
			} else if (canvasId == 'debtPerformColumn') {
				cWidth = uni.upx2px(650) / 2;
				cHeight = uni.upx2px(400);
				if (debtPerformColumn) {
					debtPerformColumn = null;
				}
			} else if (canvasId == 'debtPaymentColumn') {
				cWidth = uni.upx2px(650) / 2;
				cHeight = uni.upx2px(400);
				if (debtPaymentColumn) {
					debtPaymentColumn = null;
				}
			} else if (canvasId == 'revenueMonthlyColumn') {
				cWidth = uni.upx2px(650);
				if (revenueMonthlyColumn) {
					revenueMonthlyColumn = null;
				}
			}
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			canvasObj = new uCharts({
				context,
				width: cWidth*this.pixelRatio,
				height: cHeight*this.pixelRatio,
				padding: [20, 5, 5, 5],
				type: 'column',
				enableScroll: false,
				enableMarkLine: false,
				dataLabel: false,
				fontSize: 8,
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				animation: false,
				legend: {
					show: false
				},
				categories: chartData.categories,
				series: chartData.series,
				xAxis: {
					disabled: false,
					disableGrid: true,
					itemCount: canvasId == 'debtPerformColumn' || canvasId == 'debtPaymentColumn' ? 3 : 12,
					axisLine: false,
					rotateLabel: true
				},
				yAxis: {
					disableGrid: true,
					data: [
						{
							disabled: false,
							axisLine: false,
							rotateLabel: true,
							min: 0,
							format: val => {
								return ((canvasId == 'debtPerformColumn' || canvasId == 'debtPaymentColumn') && this.debtIndex == 0) || canvasId == 'revenueMonthlyColumn'
									? '￥' + this.moneyUtil.dealNumberNoZero(val)
									: val;
							}
						}
					]
				},
				extra: {
					column: {
						type: 'group',
						width: 20
					}
				}
			});
			if (canvasId == 'canvaDeviceColumn') {
				canvaDeviceColumn = canvasObj;
			} else if (canvasId == 'debtPerformColumn') {
				debtPerformColumn = canvasObj;
			} else if (canvasId == 'debtPaymentColumn') {
				debtPaymentColumn = canvasObj;
			} else if (canvasId == 'revenueMonthlyColumn') {
				revenueMonthlyColumn = canvasObj;
			}
		},
		//饼状图
		async showPie(canvasId, chartData) {
			let cWidth = uni.upx2px(320);
			let cHeight = uni.upx2px(320);
			if (canvaPie) {
				canvaPie = null;
			}
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			canvaPie = new uCharts({
				context,
				width: cWidth*this.pixelRatio,
				height: cHeight*this.pixelRatio,
				padding: [20, 5, 5, 5],
				dataLabel: false,
				fontSize: 10,
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				animation: true,
				type: 'ring',
				legend: {
					show: false
				},
				series: chartData,
				extra: {
					pie: {
						offsetAngle: -45,
						ringWidth: 20 * this.pixelRatio,
						labelWidth: 15
					}
				}
			});
		},
		//设备统计
		devicechange(e) {
			this.deviceindex = e.index;
			let type = this.deviceindex + 1;
			switch (this.deviceindex) {
				case 0:
					if (this.stateArr.length > 0) {
						this.updatapieChart();
					} else {
						this.getPieStateList(type, this.orgObj);
					}
					break;
				case 1:
					if (this.typeArr.length > 0) {
						this.updatacolumnChart(this.typeArr, '类型');
					} else {
						this.getPieStateList(type, this.orgObj);
					}
					break;
				case 2:
					if (this.heightArr.length > 0) {
						this.updatacolumnChart(this.heightArr, '高度');
					} else {
						this.getPieStateList(type, this.orgObj);
					}
					break;
				case 3:
					if (this.brandArr.length > 0) {
						this.updatacolumnChart(this.brandArr, '品牌');
					} else {
						this.getPieStateList(type, this.orgObj);
					}
					break;
				default:
					break;
			}
		},

		//应收统计
		debtChange(e) {
			this.debtIndex = e.index;
			this.loadPerformDebtData();
			this.loadPaymentDebtData();
		},
		//更新饼状图
		updatapieChart() {
			let data = {
				series: this.stateArr
			};
			canvaPie.updateData(data);
		},
		//更新柱状图
		updatacolumnChart(list, type) {
			let categories = [];
			let seriesdata = [];
			list.forEach(o => {
				categories.push(o.name);
				seriesdata.push(o.count);
			});
			let data = {
				categories: categories,
				series: [
					{
						name: type,
						data: seriesdata,
						color: '#E60000',
						legendShape: 'rect'
					}
				]
			};
			if (canvaDeviceColumn) {
				canvaDeviceColumn = null;
				this.showdeviceColumn('canvaDeviceColumn', data);
			} else {
				this.showdeviceColumn('canvaDeviceColumn', data);
			}
		},
		//
		goTo(type, item) {
			switch (type) {
				case 'contractState':
					uni.setStorage({
						data: {
							id: this.$savekey.MS_CONTRACT,
							state: {
								label: '全部进度',
								value: 'all'
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
				case 'contractRevenue':
					let stateObj = {
						label: item.name,
						value: item.value
					};
					uni.setStorage({
						data: {
							id: this.$savekey.MS_CONTRACT,
							state: stateObj
						},
						key: this.$savekey.MEMORY_STORAGE,
						success: () => {
							uni.switchTab({
								url: '/pages/main/business'
							});
						}
					});
					break;
				case 'revenue':
					if(!this.contractStatistics && !this.deviceStatistics && !this.contractLXStatistics && !this.deviceLXStatistics) {
						uni.showToast({
							icon: 'none',
							title: '用户没有对应的菜单权限,请联系管理员'
						});
						return;
					}
					this.selectType = type;
					this.$refs.startDialog.open();
					break;
				case 'rentTrend':
					uni.navigateTo({
						url:
							'/subOtherPages/homecharts/statistics/rent-trend-list?year=' +
							this.year +
							'&rentalType=' +
							encodeURIComponent(JSON.stringify(this.rentalType)) +
							'&deviceSort=' +
							encodeURIComponent(JSON.stringify(this.deviceSort)) +
							'&machineType=' +
							encodeURIComponent(JSON.stringify(this.machineType)) +
							'&deviceHeight=' +
							encodeURIComponent(JSON.stringify(this.deviceHeight)) +
							'&deviceModel=' +
							encodeURIComponent(JSON.stringify(this.deviceModel)) +
							'&salesmanObj=' +
							encodeURIComponent(JSON.stringify(this.salesmanDic))
					});

					break;
				case 'debt':
					uni.navigateTo({
						url: '/subOtherPages/homecharts/statistics/debt-list'
					});

					break;
				default:
					break;
			}
		},
		goToDetail(type, inedx) {
			if(!this.contractStatistics && !this.deviceStatistics && !this.contractLXStatistics && !this.deviceLXStatistics) {
				uni.showToast({
					icon: 'none',
					title: '用户没有对应的菜单权限,请联系管理员'
				});
				return;
			}
			this.selectType = type;
			this.selectIndex = inedx;
			this.$refs.startDialog.open();
		},
		clickContract() {
			// if (!this.contractStatistics) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '用户没有对应的菜单权限,请联系管理员'
			// 	});
			// 	return;
			// }
			if (this.selectType === 'revenueelse') {
				uni.navigateTo({
					url:
						'/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
						this.beginDate +
						'&endDate=' +
						this.endDate +
						'&orgObj=' +
						encodeURIComponent(JSON.stringify(this.orgObj)) +
						'&indexNum=' +
						this.selectIndex +
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
						'&revenueType=' +
						this.revenueType
				});
			}
			this.$refs.startDialog.close();
		},
		clickDevice() {
			// if (!this.deviceStatistics) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '用户没有对应的菜单权限,请联系管理员'
			// 	});
			// 	return;
			// }
			uni.navigateTo({
				url:
					'/subOtherPages/homecharts/statistics/device-statistics-tab?beginDate=' +
					this.beginDate +
					'&endDate=' +
					this.endDate +
					'&orgObj=' +
					encodeURIComponent(JSON.stringify(this.orgObj)) +
					'&revenueType=' +
					this.revenueType
			});
			this.$refs.startDialog.close();
		},
		clickCancle() {
			this.$refs.startDialog.close();
		},
		loadData(beginDate, endDate, orgIdList) {
			this.getRevenueData(beginDate, endDate, orgIdList);
			// this.getContractData(beginDate, endDate, orgIdList);
		},
		getRevenueData(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				orgIdList: orgIdList && orgIdList.length > 0 ? orgIdList : [],
				receivableType: this.revenueType == '2' ? this.receivableType : this.revenueType, //当前是账期营收方式时，获取账期类型
				debtType: '1'
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.STATISTICS_REVENUE, 'POST', param)
				.then(result => {
					let hire = result.receivable ? (result.receivable.hire && Number(result.receivable.hire) > 0 ? Number(Number(result.receivable.hire).toFixed(2)) : 0) : 0;
					let claim = result.receivable ? (result.receivable.claim && Number(result.receivable.claim) > 0 ? Number(Number(result.receivable.claim).toFixed(2)) : 0) : 0;
					let carriage = result.receivable
						? result.receivable.carriage && Number(result.receivable.carriage) > 0
							? Number(Number(result.receivable.carriage).toFixed(2))
							: 0
						: 0;
					this.discounts = this.moneyUtil.dealNumber(result.receivable && result.receivable.discounts ? result.receivable.discounts : 0);
					this.revenueListTotal = '￥' + this.moneyUtil.dealNumber(result.receivable && result.receivable.total ? result.receivable.total : 0);
					let total = hire + claim + carriage;
					this.revenueList1 = [
						{
							data: this.moneyUtil.dealNumber(hire),
							color: this.colors[0],
							name: '租金',
							height: (hire / total) * 300
						},
						{
							data: this.moneyUtil.dealNumber(claim),
							color: this.colors[1],
							name: '索赔',
							height: (claim / total) * 300
						},
						{
							data: this.moneyUtil.dealNumber(carriage),
							color: this.colors[2],
							name: '运费',
							height: (carriage / total) * 300
						}
					];
					if (this.revenueType == '5') {
						//结算营收时
						this.revenueList1 = [
							...this.revenueList1,
							{
								data: this.discounts,
								color: this.colors[3],
								name: '优惠/增收',
								height: -1
							}
						];
					}
					let receivables = result && result.receivable && result.receivable.total ? Number(result.receivable.total) : 0;
					let receipt = result.receipt ? (result.receipt.total && Number(result.receipt.total) > 0 ? Number(Number(result.receipt.total).toFixed(2)) : 0) : 0;
					let receivable = result.payable ? result.payable : 0;
					this.revenueList2 = [
						{
							name: '营收',
							tip: 'homeReceived',
							data: this.moneyUtil.dealNumber(receivables)
						},
						{
							name: '实收',
							tip: 'homeReceived',
							data: this.moneyUtil.dealNumber(receipt)
						},
						{
							name: '应收',
							tip: 'homeDebt',
							data: this.moneyUtil.dealNumber(receivable)
						}
					];
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getContractData(beginDate, endDate, orgIdList) {
			let param = {
				beginDate: (beginDate ? beginDate : this.$dateUtil.getFirstDayOfYear(new Date())) + ' 00:00:00',
				endDate: (endDate ? endDate : this.$dateUtil.timeFormat(new Date())) + ' 23:59:59',
				orgIdList: orgIdList && orgIdList.length > 0 ? orgIdList : [],
				receivableType: this.revenueType == '2' ? this.receivableType : this.revenueType
			};

			this.$network
				.getData(this.$url.STATISTICS_CONTRACT_STATUS, 'POST', param)
				.then(result => {
					let xStateNames = [
						{
							label: '审批中',
							value: '1'
						},
						{
							label: '待进场',
							value: '5'
						},
						{
							label: '执行中',
							value: '6'
						},
						{
							label: '待结算',
							value: '7'
						},
						{
							label: '已结清',
							value: '9'
						}
					];
					let statusList = [];
					xStateNames.forEach((o, index) => {
						let obj = result.find(y => y.value === o.value);
						if (obj) {
							statusList.push({
								name: obj.name,
								data: obj.count,
								color: this.colors[index]
							});
						} else {
							statusList.push({
								name: o.label,
								data: 0,
								color: this.colors[index]
							});
						}
					});
					let contractStates = {
						series: statusList
					};
					this.contractStatePieList = contractStates.series.map(o => {
						return {
							...o,
							data: o.data + '份'
						};
					});

					this.showRing('contractStatePie', contractStates);
					let xNames = [
						{
							label: '执行中',
							value: '6'
						},
						{
							label: '待结算',
							value: '7'
						},
						{
							label: '已结清',
							value: '9'
						}
					];
					let seriesData = [];
					this.contractRevenueList = xNames.map((o, index) => {
						let obj = result.find(y => y.value === o.value);
						return {
							value: o.value,
							data: obj ? (obj.receivable ? (Number(obj.receivable.total) > 0 ? Number(Number(obj.receivable.total).toFixed(2)) : 0) : 0) : 0,
							color: this.colors[index],
							name: o.label
						};
					});
					let rTotal = this.contractRevenueList.reduce((x, y) => {
						return x + y.data;
					}, 0);
					this.contractRevenueList = this.contractRevenueList.map(o => {
						return {
							...o,
							height: (o.data / rTotal) * 300,
							data: this.moneyUtil.dealNumber(o.data)
						};
					});
				})
				.catch(err => {});
		},

		async showRing(canvasId, chartData) {
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			contractStatePie = new uCharts({
				context,
				type: 'ring',
				fontSize: 11,
				legend: {
					show: false
				},
				extra: {
					pie: {
						offsetAngle: -45,
						ringWidth: 20 * this.pixelRatio,
						labelWidth: 15
					}
				},
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				series: chartData.series,
				animation: true,
				width: this.cWidth * this.pixelRatio,
				height: this.cHeight * this.pixelRatio,
				disablePieStroke: true,
				dataLabel: false
			});
		},
		//出租率
		reset() {
			this.deviceSortRent = {};
			this.machineTypeRent = {};
			this.deviceHeightRent = {};
			this.deviceModelRent = {};
			//加载年度出租率
			if (this.rentalDic.value == -1) {
				this.reloadRentalC(this.yearMRList, '去年', '当年');
			} else {
				this.loadRentalData(this.rentalDic, '');
			}
		},
		query(val) {
			this.deviceSortRent = val.sortObj ? val.sortObj : {};
			this.machineTypeRent = val.typeObj ? val.typeObj : {};
			this.deviceHeightRent = val.heightObj ? val.heightObj : {};
			this.deviceModelRent = val.modelObj ? val.modelObj : {};
		
			if (this.rentalDic.value == -1) {
				this.reloadRentalC(this.yearMRList, '去年', '当年');
			} else {
				this.loadRentalData(this.rentalDic, '');
			}
		},
		//获取车辆年度对比
		loadRentalData(areaDic, tabtype) {
			uni.showLoading();
			let param = {
				orgIdList: areaDic && areaDic.value != '-1' ? this.$datestr.getOrgIdList(areaDic) : [],
				searchDate: this.$datestr.getnowDate(),
				deviceType: this.deviceSortRent && this.deviceSortRent.value ? this.deviceSortRent.value : undefined,
				type: this.machineTypeRent && this.machineTypeRent.value ? this.machineTypeRent.value : undefined,
				height: this.deviceHeightRent && this.deviceHeightRent.value ? this.deviceHeightRent.value : undefined,
				machineType: this.deviceModelRent && this.deviceModelRent.value ? this.deviceModelRent.value : undefined
			};
			this.$network
				.getData(this.$url.HOME_MACHINE_YEAR_LIST, 'POST', param)
				.then(result => {
					if (this.rentalDic.value == -1) {
						this.dealRentalYearData(result);
					} else {
						if (tabtype === 'tab') {
							this.yearMRList = result;
							this.loadRentalData(this.rentalDic, '');
						} else {
							this.dealCompartYearData(result);
						}
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		dealRentalYearData(list) {
			this.yearMRList = list;
			let categories = [];
			let dataLast = [];
			let dataNow = [];
			list.forEach(o => {
				categories.push(o.label);
				if (o.lastYear) {
					let rate = this.$datestr.doubleFloat(o.lastYear.rate * 100);
					dataLast.push(rate);
				} else {
					let rate = this.$datestr.doubleFloat(0);
					dataLast.push(rate);
				}
				if (o.thisYear) {
					let rate = this.$datestr.doubleFloat(o.thisYear.rate * 100);
					dataNow.push(rate);
				} else {
					let rate = this.$datestr.doubleFloat(0);
					dataNow.push(rate);
				}
			});
			let chartData = {
				categories: categories,
				series: [
					{
						name: '去年',
						data: dataLast,
						color: '#1482FF',
						legendShape: 'rect'
					},
					{
						name: '当年',
						data: dataNow,
						color: '#E60000',
						legendShape: 'rect'
					}
				]
			};
			this.showColumn('canvaColumn', chartData);
		},
		reloadRentalC(list, namefirst, namelast) {
			let categories = [];
			let dataLast = [];
			let dataNow = [];
			list.forEach(o => {
				categories.push(o.label);
				if (o.lastYear) {
					let rate = this.$datestr.doubleFloat(o.lastYear.rate * 100);
					dataLast.push(rate);
				} else {
					dataLast.push(null);
				}
				if (o.thisYear) {
					let rate = this.$datestr.doubleFloat(o.thisYear.rate * 100);
					dataNow.push(rate);
				} else {
					dataNow.push(null);
				}
			});
			let chartData = {
				categories: categories,
				series: [
					{
						name: namefirst,
						data: dataLast,
						color: '#1482FF',
						legendShape: 'rect'
					},
					{
						name: namelast,
						data: dataNow,
						color: '#E60000',
						legendShape: 'rect'
					}
				]
			};
			console.log(JSON.stringify(chartData));
			canvaColumn.updateData(chartData);
		},
		dealCompartYearData(list) {
			let categories = [];
			let dataLast = [];
			let dataNow = [];
			this.yearMRList.forEach(o => {
				categories.push(o.label);
				if (o.thisYear) {
					let rate = this.$datestr.doubleFloat(o.thisYear.rate * 100);
					dataLast.push(rate);
				} else {
					dataLast.push(null);
				}
			});
			list.forEach(o => {
				if (o.thisYear) {
					let rate = this.$datestr.doubleFloat(o.thisYear.rate * 100);
					dataNow.push(rate);
				} else {
					dataNow.push(null);
				}
			});
			let chartData = {
				categories: categories,
				series: [
					{
						name: this.orgObj.label,
						data: dataLast,
						color: '#1482FF',
						legendShape: 'rect'
					},
					{
						name: this.rentalDic.label,
						data: dataNow,
						color: '#E60000',
						legendShape: 'rect'
					}
				]
			};
			console.log('------')
			console.log(JSON.stringify(chartData))
			canvaColumn.updateData(chartData);
		},
		//柱状图
		async showColumn(canvasId, chartData) {
			let cWidth = uni.upx2px(730);
			let cHeight = uni.upx2px(400);
			if (canvaColumn) {
				canvaColumn = null;
			}
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			canvaColumn = new uCharts({
				context,
				width: cWidth*this.pixelRatio,
				height: cHeight*this.pixelRatio,
				padding: [20, 5, 5, 5],
				type: 'column',
				enableScroll: false,
				enableMarkLine: false,
				dataLabel: false,
				fontSize: 8,
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				animation: true,
				legend: {
					show: true,
					position: 'bottom'
				},
				categories: chartData.categories,
				series: chartData.series,
				xAxis: {
					disabled: false,
					disableGrid: true,
					itemCount: 12,
					axisLine: false
				},
				yAxis: {
					disableGrid: true,
					data: [
						{
							disabled: false,
							axisLine: false,
							min: 0,
							max: 100
						}
					]
				},
				extra: {
					column: {
						type: 'group',
						width: (cWidth * 0.5) / chartData.categories.length
					}
				}
			});
		},
		loadAreaList() {
			let urlstr = this.$url.ORG_LIST;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					let list = this.getChildren(result);
					list.unshift({
						value: '-1',
						label: '去年同期'
					});
					this.rentalList = [...list];
				})
				.catch(err => {});
		},
		getChildren(data) {
			let arr = [];
			if (data) {
				data.forEach(o => {
					let a = {
						value: o.id,
						label: o.name,
						children: o.children
					};
					arr = [...arr, a];
					if (o.children && o.children.length > 0) {
						arr = [...arr, ...this.getChildren(o.children)];
					}
				});
			}
			return arr;
		},
		changeItem() {
			this.pickType = 'rentbay'
			this.selectList = [...this.rentalList];
			this.$refs.selector.show();
		},
		goToMoreRate() {
			uni.navigateTo({
				url:
					'/subOtherPages/homecharts/statistics/device-rate-list?orgObj=' +
					encodeURIComponent(JSON.stringify(this.rentalDic.value != '-1' ? this.rentalDic : null)) +
					'&deviceSort=' +
					encodeURIComponent(JSON.stringify(this.deviceSortRent)) +
					'&machineType=' +
					encodeURIComponent(JSON.stringify(this.machineTypeRent)) +
					'&deviceHeight=' +
					encodeURIComponent(JSON.stringify(this.deviceHeightRent)) +
					'&deviceModel=' +
					encodeURIComponent(JSON.stringify(this.deviceModelRent))
			});
		},
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

.reset-btn {
	background: #ffffff;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
	align-items: center;
	justify-content: center;
	padding: 0px 10px;
	line-height: 24px;
	border-radius: 10px;
	border: 1px solid $uni-text-color-gray;
}

.chart-icon {
	margin-right: 4px;
	color: #a2a2a2;
}

.chart-content {
	display: flex;
	flex-direction: row !important;
	justify-content: space-between;
	padding: 16px;
	background-color: #ffffff;
}

.chart-legend {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.legend-item {
	margin-top: 16px;
}

.legend-color {
	width: 10px;
	height: 10px;
	border-radius: 2px;
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

.chart-view {
	flex: 1;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}

.chart-col {
	width: 16px;
	height: 300upx;
	background-color: #eeeeee;
	border-radius: 8px 8px 0 0;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
}

.chart-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-left: 10px;
	padding-right: 10px;
}

.chart-text {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
	margin-top: 4px;
}

.col-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	border-right: 1px solid $uni-bg-color-grey;
}

.col-item:last-child {
	border-right: 1px solid #FFFFFF;
}
.content-subtitle {
	margin-left: 5px;
	font-size: 10px;
	color: $uni-color-primary;
}
.charts {
	width: 320upx;
	height: 320upx;
}

.pop-container {
	position: relative;
}
.right-style-all {
	display: flex;
	flex: 1;
	margin-left: 15px;
	justify-content: flex-end;
	align-items: center;
	flex-direction: row;
	color: $uni-color-primary;
	font-weight: normal;
	font-size: $uni-font-size-base;
}
/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 290px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 270px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #ffffff;
	font-size: $uni-font-size-base;
	border-radius: 5px;
}

.row-tag {
	width: 98px;
	text-align: center;
}

.bg-item {
	display: flex;
	flex-direction: column;
	margin: 10upx;
	border-radius: 5px;
	background: #ffffff;
	padding-bottom: 10px;
}

.rental-title {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-color-subtitle;
	font-size: $uni-font-size-base;
	margin: 10px;
}

.title-left {
	display: flex;
	flex-direction: row;
	margin-left: 5px;
}

.left-filter {
	display: flex;
	flex: 1;
	margin-left: 16px;
	flex-direction: row;
	justify-content: flex-end;
}

.select-style {
	background: $uni-color-primary;
	font-size: $uni-font-size-sm;
	color: #fffdef;
	align-items: center;
	justify-content: center;
	padding: 4px 10px;
	border-radius: 15px;
	border: 1px solid $uni-color-primary;
	margin-right: 10px;
}

.unselect-style {
	background: #ffffff;
	font-size: $uni-font-size-sm;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	border-radius: 15px;
	border: 1px solid $uni-color-primary;
	margin-right: 10px;
}

.right-style {
	display: flex;
	margin-left: 15px;
	justify-content: flex-end;
	align-items: center;
	flex-direction: row;
	color: $uni-color-primary;
	font-weight: normal;
	font-size: $uni-font-size-base;
}

.charts-pie {
	width: 320upx;
	height: 320upx;
}

.charts-d {
	width: 730upx;
	height: 400upx;
	background: #ffffff;
}
</style>
