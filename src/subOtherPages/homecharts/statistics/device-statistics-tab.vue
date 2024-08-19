<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			<text class="navtitle">设备营收统计</text>
		</c-nav-bar-btns>
		<view class="top-view" :style="{ top: navBarHeight + 'px' }">
			<sun-tab v-if="revenueType != '1'" :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000"
				:shownum="false" @change="indexchange" />
			<unionDeviceQueryView :showRent="true" :isExportList='revenueType == "1" ? devicePerformExport : deviceExport'
				:isQueryContract="false" :isQueryTime='true' @reset='reset' @query="query"
				@exportExcel="gotoOther('export')" :sortFields="sortFields" :isQuerySort="true" :isQueryAsc="true"
				ref="unionDeviceQuery" />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor">
							<view class="item-head">
								<view class="head-top">{{ item.printCode || '--' }}<text class="item-text license">{{
									item.licenseId || '--' }}</text></view>
								<view class="head-bottom">
									<text class="item-text">{{ item.typeName || '--' }}</text><text class="item-text"> | {{
										item.heightName || '--' }}</text><text class="item-text"> | {{ item.brand || '--'
	}}</text><text class="item-text">| {{ item.machineTypeName || '--' }}</text><text
										class="item-text">| {{ item.subletState == 1 ? '转租' : '自有' }}设备</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<i class="iconfont item-customdetail"
								:class="item.expandArrow ? 'iconarrow-up' : 'iconarrow-down'"
								@click="expendArrow(item, index)" ref="expandArrow">

							</i>
						</view>
					</view>
					<view class="line-s" />
					<view>
						<view class="itemshadow" style="" v-for="(dtoitem, dtoindex) in item.machineReceivableDtoList"
							:key="dtoindex" v-if="item.expandArrow">
							<view class="cell-text">
								<view class="cell-text-left fontsubcolor"><text>合同名称：<text class="text-right">{{
									dtoitem.customerName || '--' }}-{{ dtoitem.projectName || '--' }}</text></text>
								</view>
							</view>
							<view class="cell-text" style="display: flex;justify-content: space-between;"  v-if="isShowField('customerSalesmanName')">
								<view class="cell-text-left fontsubcolor"><text>业务负责人：<text class="text-right">{{
									dtoitem.customerSalesmanName || '--' }}</text></text></view>
									<view class="cell-text-left fontsubcolor" style="margin-right:20px"  v-if="isShowField('receivableAccount')"><text>营收：<text
											class="text-right">￥{{ dtoitem.receivableCurrent ?
												moneyUtil.dealNumber(dtoitem.receivableCurrent.total) : '--' }}</text></text>
								</view>
							</view>

							<view class="cell-text" @click="gotoDetail(dtoitem)">
								<view class="cell-text-left fontsubcolor"><text>合同编号：<text class="text-right fcred">{{
									dtoitem.businessNo || '--' }}</text></text></view>
								<!-- <i class="iconfont iconarrow-right" style="padding-right: 8px;color: #E60000;"></i> -->
							</view>
							<!-- <view class="line-s" style="margin-bottom: 5px;" /> -->
						</view>
					</view>
					<view class="cell-text" v-if="isShowField('orgName')">
						<view class="cell-text-left fontsubcolor"><text class="region">区域</text></view>
						<view class="cell-text-right fontsubcolor">
							<text>{{ item.orgName || '--' }}</text>
						</view>
					</view>
				</cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import unionDeviceQueryView from '@/components/common/common-ui/union-device-query-view.vue'
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
import { mapState } from 'vuex';
let timer;
export default {
	components: {
		uniLoadMore,
		labelArrow,
		unionDeviceQueryView,
		sunTab
	},
	props: {
		areaDic: {
			type: Object,
			default() {
				return {};
			}
		},
		beginDate: {
			type: String,
			default: ""
		},
		enDate: {
			type: String,
			default: ""
		},


	},
	data() {
		return {
			"navBtns": [
				{
					"text": "配置",
					"type": "none",
					"fontSize": "14px",
					"color": "#E60000",
					"width": "auto"
				}
			],
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			orgList: [],
			selectType: "",
			showfileter: false,
			totalCount: '0',
			downloadTask: null,
			contractName: '',
			searchKey: '',
			type: '',
			height: '',
			machineType: '',
			brand: '',
			startDate: '',
			endDate: '',
			orgDic: {},
			deviceType: '',
			index: 0,
			tabList: ['结算营收', '账期营收'],
			deviceExport: true,
			devicePerformExport: true,
			accountType: '',
			showFields: null,
			sortFields: [],
			ascObj: {},
			ascList: [],
			revenueType: '1',
			dstartDate: '',
			dendDate: '',
			dorgDic: {},
			rentDic:{}
		};
	},
	computed: {
		...mapState('system', ['navBarHeight'])
	},
	onLoad(options) {
		this.revenueType = options.revenueType ? options.revenueType : '1'
		switch (this.revenueType) {
			case '1': //履约
				this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse, "履约营收统计", "设备列表");
				uni.setNavigationBarTitle({
					title: '设备履约营收统计'
				})
				break;
			case '2': //账期
				this.index = 1
				break;
			case '5': //结算
				this.index = 0
				break;
			default:
				break;
		}
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (resData) {
			let obj = resData.find(o => o.code === 'account_type') //营收类型
			if (obj) {
				this.accountType = obj.value
			}
		}
		this.dstartDate = options.beginDate ? options.beginDate : '';
		this.dendDate = options.endDate ? options.endDate : '';
		this.dorgDic = options.orgObj ? JSON.parse(decodeURIComponent(options.orgObj)) : {};

		this.startDate = this.dstartDate;
		this.endDate = this.dendDate;
		this.orgDic = this.dorgDic;
		setTimeout(() => {
			this.$refs.unionDeviceQuery.setDefultData(this.dstartDate, this.dendDate, this.dorgDic);
		}, 100);
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				this.deviceExport = res.data.some(x => x.value === this.$savekey.PERMISSION_DEVICE_REVENUE_EXPORT);
				this.devicePerformExport = res.data.some(x => x.value === this.$savekey.PERMISSION_DEVICE_PERFORM_STATISTICS);
			}
		});
		uni.showLoading();
		this.loaddata();
		this.getFields()
		uni.$on('machinerConfigResfresh', obj => {
			this.headerrefresh();
			this.getFields()
		})
	},
	onUnload() {
		uni.$off('machinerConfigResfresh')
	},
	onPullDownRefresh() {
		this.currentpage = 1;
		this.datalist = [];
		this.loaddata();
	},
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.currentpage += 1;
		this.morestatus = 'loading';
		this.loaddata();
	},
	methods: {
		onNavBarButtonTap(e) {
			uni.navigateTo({
				url: '/subOtherPages/homecharts/config_dynamic_field?emitType=machinerConfigResfresh&type=' + dynamicFieldsUtil.STATISTICS_DEVICE
			})

		},
		isShowField(field) {
			return dynamicFieldsUtil.isShowField(this.showFields, field)
		},
		indexchange(e) {
			//置空搜索条件
			this.index = e.index
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 10
			})
			setTimeout(() => {
				this.$refs.unionDeviceQuery.resetDef(this.dstartDate, this.dendDate, this.dorgDic);
			}, 100);
			// this.datalist = [];
			// this.currentpage = 1;
			// this.loaddata();
		},
		getFields() {
			this.$network
				.getData(this.$url.GET_DYNAMIC_FIELD.replace(/{type}/, dynamicFieldsUtil.STATISTICS_DEVICE), 'GET')
				.then(result => {
					this.showFields = result && result.fields ? result.fields : null;
					this.sortFields = dynamicFieldsUtil.getSortFieldsByType(dynamicFieldsUtil.STATISTICS_DEVICE, this.showFields)
					console.log(this.sortFields, 'this.sortFields');
				})
				.catch(err => { });
		},
		expendArrow(item, index) {
			this.datalist.splice(index, 1, {
				...item,
				expandArrow: item.expandArrow ? !item.expandArrow : true
			})
		},
		gotoDetail(item) {
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
			});
		},
		gotoOther(type) {
			if (type === 'filter') {
				this.showfileter = !this.showfileter;
			} else {
				this.exportList()
			}
		},
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
		},
		loaddata() {
			console.log(this.rentDic,'this.rentDic');
			let param = {
				receivableType: this.revenueType == '1' ? '1' : (this.index == 0 ? '5' : '4'),
				current: this.currentpage,
				size: 20,
				fuzzyParam: this.searchKey ? this.searchKey : undefined,
				contractName: this.contractName ? this.contractName : undefined,
				deviceType: this.deviceType ? this.deviceType : undefined,
				type: this.type ? this.type : undefined,
				height: this.height ? this.height : undefined,
				machineType: this.machineType ? this.machineType : undefined,
				brand: this.brand ? this.brand : undefined,
				beginDate: this.startDate ? this.startDate + ' 00:00:00' : undefined,
				endDate: this.endDate ? this.endDate + ' 23:59:59' : undefined,
				customerSalesman: this.customerSalesman ? this.customerSalesman : undefined,
				orgId: this.orgDic && this.orgDic.value ? this.orgDic.value : undefined,
				subletState:this.rentDic&&(this.rentDic.value==1||Number(this.rentDic.value)===0)?this.rentDic.value:null
			};
			let url = this.revenueType != '1' ? this.$url.DEVICE_STATISTICS_V2_LIST : this.$url.DEVICE_STATISTICS_LIST
			this.$network
				.getData(url, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					this.totalCount = result.total.toString();
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				}).catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		getOrgList() {
			let _self = this
			this.$network.getData(this.$url.ORG_ALL, "GET").then((result) => {
				if (result && result.length > 0) {
					result.forEach(function dep(o) {
						_self.orgList = [..._self.orgList, {
							value: o.id,
							label: o.name,
							children: o.children
						}];
						if (o.children && o.children.length > 0) o.children.map(dep);
					})
				}
			}).catch((err) => { })
		},
		reset() {
			this.contractName = '';
			this.searchKey = '';
			this.type = '';
			this.height = '';
			this.machineType = '';
			this.brand = '';
			this.deviceType = ''
			this.customerSalesman = ''
			this.startDate = this.beginDate;
			this.endDate = this.enDate;
			this.orgDic = this.areaDic;
			this.headerrefresh();

		},
		query(val) {
			this.contractName = val.contractName;
			this.searchKey = val.fuzzyParam;
			this.deviceType = val.sortObj && val.sortObj.value ? val.sortObj.value : '';
			this.type = val.typeObj && val.typeObj.value ? val.typeObj.value : '';
			this.height = val.heightObj && val.heightObj.value ? val.heightObj.value : '';
			this.machineType = val.modelObj && val.modelObj.value ? val.modelObj.value : '';
			this.brand = val.brandObj && val.brandObj.value ? val.brandObj.value : '';
			this.startDate = val.startDate;
			this.endDate = val.endDate;
			this.orgDic = val.orgObj;
			this.customerSalesman = val.salesmanObj && val.salesmanObj.value ? val.salesmanObj.value : '';
			this.rentDic=val.rentObj?val.rentObj:null;
			this.headerrefresh();
		},
		headerrefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		exportList() {
			uni.showLoading({
				title: '正在下载中,请稍等...',
				mask: true,
			})
			let param = {
				receivableType: this.revenueType == '1' ? '1' : (this.index == 0 ? '5' : '4'),
				current: this.currentpage,
				size: this.totalCount,
				fuzzyParam: this.searchKey,
				contractName: this.contractName,
				deviceType: this.deviceType ? this.deviceType : undefined,
				type: this.type ? this.type : undefined,
				height: this.height ? this.height : undefined,
				machineType: this.machineType ? this.machineType : undefined,
				brand: this.brand ? this.brand : undefined,
				beginDate: this.startDate ? this.startDate + ' 00:00:00' : undefined,
				endDate: this.endDate ? this.endDate + ' 23:59:59' : undefined,
				customerSalesman: this.customerSalesman ? this.customerSalesman : undefined,
				orgId: this.orgDic && this.orgDic.value ? this.orgDic.value : undefined,
				subletState:this.rentDic&&(this.rentDic.value==1||Number(this.rentDic.value)===0)?this.rentDic.value:null
			};
			let url = this.$gxfmethod.getUrl(this.revenueType != '1' ? this.$url.DEVICE_STATISTICS_V2_LIST : this.$url.DEVICE_STATISTICS_LIST)
			let revenueTypeName = this.revenueType == '1' ? '履约' : (this.index == 0 ? '结算' : '账期')
			let filename = this.$gxfmethod.getFileName(`营收统计-设备${revenueTypeName}营收报表`)
			this.$gxfmethod.downFunc(url, 'POST', param, filename)
		}
	},
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
	width: 100%;
	background: #FFFFFF;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.top-view {
	z-index: 100;
	position: sticky;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: 100;
	top: 0px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}

.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}

.filter-view-style {
	display: flex;
	background: #eeeeee;
	align-items: center;
	justify-content: center;
	height: 40px;
	padding-left: 10px;
	padding-right: 10px;
	margin-right: 10px;
	border-radius: 5px;
	color: #E60000;
	font-size: $uni-font-size-sm;
}

.search-box {
	background: #F7F7F7;
	flex: 1;
	height: 40px;
	display: flex;
	margin: 8px 10px;
	flex-direction: row;
	padding-left: 10px;
	border-radius: 5px;
	justify-content: flex-start;
	align-items: center;
}

.search-icon {
	color: #999999;
	font-size: $uni-font-size-base;
}

.search-content {
	display: flex;
	flex: 1;
	color: #999999;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}

.btnstyle {
	display: flex;
	margin-right: 10px;
	height: 35px;
	padding-left: 10px;
	padding-right: 10px;
	flex-direction: row;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	background-color: $uni-color-primary;
}

.top-container {
	position: fixed;
	top: 0px;
	left: 0px;
	width: 100%;
	z-index: 600;
}

//列表的subview
.list-sub-view {
	padding-bottom: env(safe-area-inset-bottom);
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
}

//列表
.list-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}

//列表cell
.list-view-cell {
	margin-top: 10px;
	background: #ffffff;
	padding:10px 5px;
}

.item-head {
	display: flex;
	flex-direction: column;
}

.head-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 32rpx;
	font-weight: 500;
	color: #222222;
	font-family: PingFangSC-Medium, PingFang SC;
}

.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 4px;
}

.item-text {
	margin-right: 2px;
	// margin-left: 2px;
	font-size: 24rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #8C8C8C;
}

.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin-top: 5px;
	justify-content: flex-start;
	align-items: center;
}

.cell-text-left {
	display: flex;
	flex-direction: row;
	min-width: 60px;
	margin-left: 10px;
	justify-content: flex-start;
	align-items: center;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #8C8C8C;
}

.cell-text-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	margin-right: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.fontBlackcolor {
	color: $uni-text-color;
}

.fcred {
	color: #E60000 !important;
}

.line-s {
	margin-top: 5px;
	height: 1px;
	background: #eeeeee;
}

.fontsubcolor {
	color: $uni-text-color-gray;
}

.bottom-search {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 5px 0px;
	background: #FFFFFF;
	margin-bottom: 1px;
}

.bottom-search-top {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin: 10px;
	align-items: center;
	background: #FFFFFF;
}

.condition-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.clear {
	background-color: $uni-border-color;
}

.confirm {
	background-color: $uni-color-primary;
}

.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
}

.item-customdetail {
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: flex-end;
}

.navtitle {
	font-size: 36rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #222222;
}

.license {
	display: inline-flex;
	// width: 208rpx;
	padding: 5rpx 18rpx;
	background: #FBD9D9;
	border-radius: 16rpx;
	font-size: 24rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #E60000;
	margin-left: 14rpx;
}

.text-right {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #222222;
}

.itemshadow {
	display: flex;
	flex-direction: column;
	margin-left: 10px;
	background: #F7F7F7;
	line-height: 50rpx;
	margin-top: 7px !important;
	padding:3rpx 17rpx  20rpx 0;
}
.region{
	margin-left: 10px !important;
}
</style>
