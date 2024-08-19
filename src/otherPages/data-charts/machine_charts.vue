<template>
	<view class="bgview">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="rental-bg">
			<view class="sum-view-bg" v-if="serviceTast">
				<view class="title-bg">
					<i class="iconfont chart-icon iconbiaoge"></i>
					<view class="title-left">{{ '服务任务' }}</view>
					<view class="title-right" @click="moreClick('service')">
						<text>{{ '更多' }}</text>
						<i class="iconfont title-icon iconarrow-right"></i>
					</view>
				</view>
				<view class="content-bg" v-for="(item, index) in serviceList" :key="index">
					<view class="content-left">
						<view class="content-icon-bg" :style="{background:item.background}">
							<i class="iconfont content-icon" :class="item.icon":style="{color:item.color}"></i>
						</view>
						<view class="content-title">{{ item.name }}</view>
					</view>
					<view class="content-right">{{ item.data || '0' }}台</view>
				</view>
			</view>
			<view class="sum-view-bg" v-if="chartDue">
				<view class="title-bg">
					<i class="iconfont chart-icon iconbiaoge"></i>
					<view class="title-left">设备到期统计</view>
					<view class="title-right" @click="moreClick('dueDevice')">
						<text>更多</text>
						<i class="iconfont title-icon iconarrow-right"></i>
					</view>
				</view>
				<view class="chart-content">
					<view class="col-item" v-for="(item, i) in dueDeviceList" :key="i">
						<view class="legend-name">
							{{ item.dueDays }}
						</view>
						<view class="legend-data" @click="moreClick('dueDevice',item)">{{ item.count }}</view>
					</view>
				</view>

			</view>
			<view class="bg-item" v-if="chartInventory">
				<view class="rental-title">
					<i class="iconfont chart-icon iconbiaoge"></i>
					<view class="title-left"><text>库存</text></view>
					<view class="right-style-all" @click="stockAll">
						<view><text>更多</text></view>
						<i class="iconfont cellrightImg iconarrow-right"></i>
					</view>
				</view>
				<sun-tab style="width: 730upx;" defaultbgColor="#FFFFFF" activebgColor="#FFFFFF" :value.sync="stockindex" :tabList="stocktabList"
				 activeColor="#E60000" :shownum="false" :isFlex="false" @change="stockchange" />
				<view style="width: 100%;height: 2px;background: #F5F4F9;" />
				<list class="liststyle">
					<cell>
						<view class="titleView">
							<view class="leftView">
								<text>{{ getTitle() }}</text>
							</view>
							<view class="rightView"><text>待租</text></view>
							<view class="rightView"><text>已租</text></view>
							<view class="rightView"><text>总数</text></view>
						</view>
					</cell>
					<cell v-for="(item, index) in stockList" :key="index">
						<view class="titleView">
							<view class="leftView cellcolor">
								<text v-if="stockindex === 0 && item.heightName" style="color: #000000;font-weight: bold;font-size: 17px;">{{ item.heightName || '--' }}</text>
								<text v-if="stockindex === 0 && item.heightName">/</text>
								<text v-if="stockindex === 0">{{ item.dimensionName || '--' }}</text>
								<text v-if="stockindex != 0">{{ item.label || '--' }}</text>
							</view>
							<view class="rightView cellcolor">
								<text>{{ item.totalCount - item.count }}</text>
							</view>
							<view class="rightView cellcolor">
								<text>{{ item.count || 0 }}</text>
							</view>
							<view class="rightView cellcolor">
								<text>{{ item.totalCount || 0 }}</text>
							</view>
						</view>
					</cell>
				</list>
			</view>
		</view>
	</view>
</template>

<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import autoDeviceQueryComponent from '@/components/common/common-ui/auto-device-query-component.vue';
	export default {
		components: {
			sunTab,
			selectView,
			autoDeviceQueryComponent
		},
		props: {
			areaDic: {
				type: Object,
				default () {
					return {
						value: '',
						label: '全部'
					};
				}
			},
			chartRate: {
				type: Boolean,
				default: true
			},
			chartMachine: {
				type: Boolean,
				default: false
			},
			chartInventory: {
				type: Boolean,
				default: true
			},
			chartDue: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				requestCount: 0,
				heightstr: '700upx',
				stockindex: 0,
				stocktabList: ['全部', '类型', '高度'],
				//设备库存
				stockAllArr: [],
				stockTypeArr: [],
				stockHeightArr: [],
				stockList: [],
				colors: ['#E60000', '#22D3FF', '#3B80F5', '#FFDB33', '#FF9535', '#FC0000', '#148200', '#9047DD'],
				machineType: {},
				deviceHeight: {},
				deviceModel: {},
				deviceSort: {},
				serviceList: [],
				serviceTast: true,
				dueMore:true,
				dueDeviceList: [],
			};
		},
		created() {
			//获取区域
			// this.loadAreaList();
			// if (this.chartRate) {
			// 	this.loaddeviceModel();
			// }
			this.getTastServer(this.areaDic);
			//加载年度出租率
			// this.loadRentalData(this.rentalDic, '');
			//加载当年月度出租率
			// this.loadRentalMonthData();
			//加载设备统计
			// let type = this.deviceindex + 1;
			// this.getPieStateList(type, this.areaDic);
			//加载库存统计
			let stokctype = this.getstockType();
			this.getStockData(stokctype, this.areaDic);
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
			if (ps) {
				this.serviceTast = ps.some(x => x.value === this.$savekey.PERMISSION_SERVICE_TASK);
				// this.dueMore = ps.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEVICE_DUE_MORE);
				
			}
			if(this.chartDue){
				this.getDeviceDueCount()
			}

		},
		methods: {
			// reset() {
			// 	this.deviceSort = {};
			// 	this.machineType = {};
			// 	this.deviceHeight = {};
			// 	this.deviceModel = {};
			// 	//加载年度出租率
			// 	if (this.rentalDic.value == -1) {
			// 		this.reloadRentalC(this.yearMRList, '去年', '当年');
			// 	} else {
			// 		this.loadRentalData(this.rentalDic, '');
			// 	}
			// },
			// query(val) {
			// 	this.deviceSort = val.sortObj ? val.sortObj : {};
			// 	this.machineType = val.typeObj ? val.typeObj : {};
			// 	this.deviceHeight = val.heightObj ? val.heightObj : {};
			// 	this.deviceModel = val.modelObj ? val.modelObj : {};

			// 	if (this.rentalDic.value == -1) {
			// 		this.reloadRentalC(this.yearMRList, '去年', '当年');
			// 	} else {
			// 		this.loadRentalData(this.rentalDic, '');
			// 	}
			// },
			//型号/类型/高度
			getTitle() {
				if (this.stockindex === 0) {
					return '高度/类型';
				}
				if (this.stockindex === 1) {
					return '类型';
				}
				if (this.stockindex === 2) {
					return '高度';
				}
				return '';
			},
			//
			tabLoadData(orgDic) {
				this.requestCount = 0;
				// this.areaDic = orgDic;
				//加载年对比
				// this.loadRentalData(orgDic, 'tab');
				//加载设备统计
				// this.stateArr = [];
				// this.typeArr = [];
				// this.heightArr = [];
				// this.brandArr = [];
				// let type = this.deviceindex + 1;
				// this.getPieStateList(type, orgDic);
				//加载库存统计
				this.stockAllArr = [];
				this.stockTypeArr = [];
				this.stockHeightArr = [];
				let stokctype = this.getstockType();
				this.getStockData(stokctype, orgDic);
				this.getTastServer(orgDic);
			},
			//------------
			getstockType() {
				let typestr = 'all';
				switch (this.stockindex) {
					case 0:
						typestr = 'all';
						break;
					case 1:
						typestr = 'type';
						break;
					case 2:
						typestr = 'height';
						break;
					default:
						break;
				}
				return typestr;
			},
			//数据层
			//设备型号
			loaddeviceModel() {
				let param = {
					source: 'name'
				};
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.modelTypeList = [];
						this.modelTypeList.push({
							label: '全部',
							value: ''
						});
						this.modelTypeList = this.modelTypeList.concat(
							result ?
							result.map((o, index) => {
								return {
									value: o.key,
									label: o.value
								};
							}) : []
						);
					})
					.catch(err => {});
			},
			//获取库存数据型号
			getStockData(type, orgDic) {
				uni.showLoading();
				let param = {
					dimension: type,
					orgIdList: this.$datestr.getOrgIdList(orgDic)
					// orgId: orgId
				};
				this.$network
					.machineStore(param)
					.then(result => {
						this.dealStockData(result);
						this.requestCount = this.requestCount + 1;
						if (this.requestCount >= 2) {
							uni.hideLoading();
						}
					})
					.catch(err => {
						this.requestCount = this.requestCount + 1;
						if (this.requestCount >= 2) {
							uni.hideLoading();
						}
					});
			},
			dealStockData(result) {
				if (this.stockindex === 0) {
					console.log(JSON.stringify(result));
					let list = result.map(o => {
						let heightName = o.heightName === null ? '666' : o.heightName;
						let num = parseInt(heightName.replace(/米/, ''));
						return {
							...o,
							sortNum: num
						};
					});
					list.sort((a, b) => {
						return a.sortNum > b.sortNum ? 1 : -1;
					});
					console.log(JSON.stringify(list));
					this.stockAllArr = list;
					this.stockList = [...this.stockAllArr];
				} else if (this.stockindex === 1) {
					this.stockTypeArr = result;
					this.stockList = [...this.stockTypeArr];
				} else if (this.stockindex === 2) {
					this.stockHeightArr = result;
					this.stockList = [...this.stockHeightArr];
				}
			},
			//库存=======
			stockchange(e) {
				this.stockindex = e.index;
				let type = this.getstockType();
				switch (this.stockindex) {
					case 0:
						if (this.stockAllArr.length > 0) {
							this.stockList = [...this.stockAllArr];
						} else {
							this.getStockData(type, this.areaDic);
						}
						break;
					case 1:
						if (this.stockTypeArr.length > 0) {
							this.stockList = [...this.stockTypeArr];
						} else {
							this.getStockData(type, this.areaDic);
						}
						break;
					case 2:
						if (this.stockHeightArr.length > 0) {
							this.stockList = [...this.stockHeightArr];
						} else {
							this.getStockData(type, this.areaDic);
						}
						break;
					default:
						break;
				}
			},
			stockAll() {
				uni.navigateTo({
					url: '/devicePages/record/device-record?orgDic=' + encodeURIComponent(JSON.stringify(this.areaDic))
				});
			},
			goToMoreRate() {
				uni.navigateTo({
					url: '/subOtherPages/homecharts/statistics/device-rate-list?orgObj=' +
						encodeURIComponent(JSON.stringify(this.rentalDic.value != '-1' ? this.rentalDic : null)) +
						'&deviceSort=' +
						encodeURIComponent(JSON.stringify(this.deviceSort)) +
						'&machineType=' +
						encodeURIComponent(JSON.stringify(this.machineType)) +
						'&deviceHeight=' +
						encodeURIComponent(JSON.stringify(this.deviceHeight)) +
						'&deviceModel=' +
						encodeURIComponent(JSON.stringify(this.deviceModel))
				});
			},
			//选择器回调
			changeItem() {
				this.$refs.selector.show();
			},
			chooseItem(val) {
				this.rentalDic = val.checkArr;
				if (this.rentalDic.value == -1) {
					this.reloadRentalC(this.yearMRList, '去年', '当年');
				} else {
					this.loadRentalData(this.rentalDic, '');
				}
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
					series: [{
							name: this.areaDic.label,
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
				canvaColumn.updateData(chartData);
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
					series: [{
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
				canvaColumn.updateData(chartData);
			},
			getDeviceDueCount() {
				uni.showLoading();
				this.$network
					.getData(this.$url.DEVICE_DUE_COUNT, 'GET')
					.then(result => {
						this.dueDeviceList = result
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getTastServer(dict) {
				uni.showLoading();
				let param = {
					orgId: dict.value != "" ? dict.value : undefined,
				};
				this.$network
					.getData(this.$url.MACHINE_TAST_COUNT, 'GET', param)
					.then(result => {
						this.serviceList = [];
						Object.keys(result).forEach((t) => {
							this.getNameWiteKey(t, result[t])
						})
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getNameWiteKey(t, num) {
				let item = {};
				switch (t) {
					case "repairNum":
						item = {
							icon: 'iconzl--weixiu',
							name: '维修',
							data: num.toString(),
							showArrow: '0',
							type: '',
							color: '#FFFFFF',
							background: '#1278FF'
						}
						break;
					case "maintenanceNum":
						item = {
							icon: 'iconshebeibaoyang',
							name: '保养',
							data: num.toString(),
							showArrow: '0',
							type: '',
							color: '#FFFFFF',
							background: '#10CBE1'
						}
						break;
					case "inspectionNum":
						item = {
							icon: 'iconshebeixunjian',
							name: '巡检',
							data: num.toString(),
							showArrow: '0',
							type: '',
							color: '',
							background: '#FE931F'
						}
						break;
					case "tcheckRepairNum":
						item = {
							icon: 'iconshebeijianxiu',
							name: '检修',
							data: num.toString(),
							showArrow: '0',
							type: '',
							color: '',
							background: '#FD473B'
						}
						break;
					default:
						break;
				}
				this.serviceList.push(item);
			},
			moreClick(t,item) {
				switch (t) {
					case 'service':
						if (!this.serviceTast) {
							uni.showToast({
								icon: 'none',
								title: '用户没有对应的菜单权限,请联系管理员'
							});
							return;
						}
						uni.navigateTo({
							url: '/deviceNoticePages/my-notify/my-notify-total?orgObj=' +
								encodeURIComponent(JSON.stringify(this.areaDic))
						});
						break;
					case 'dueDevice':
						if (!this.dueMore) {
							uni.showToast({
								icon: 'none',
								title: '用户没有对应的菜单权限,请联系管理员'
							});
							return;
						}
						
						let obj = {}
						if(item){
							obj = {
								label:item.dueDays,
								value:item.dueDaysType
							}
						}
						uni.navigateTo({
							url: '/subOtherPages/homecharts/statistics/device-due-list?dueType='+encodeURIComponent(JSON.stringify(obj))
						});
						break;
					default:
						break;
				}

			}
		}
	};
</script>

<style scoped lang="scss">
	.bgview {
		width: 100%;
		background: $uni-bg-color-grey;
	}

	.tag-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
	}

	.rental-bg {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: $uni-bg-color-grey;
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

	.title-right-style {
		display: flex;
		margin-left: 8px;
		justify-content: flex-end;
		align-items: center;
		flex-direction: row;
		color: $uni-color-primary;
		font-weight: normal;
		font-size: $uni-font-size-base;
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

	.cellrightImg {
		font-size: $uni-font-size-base;
		margin-left: 5px;
		color: $uni-color-primary;
		text-align: center;
	}

	.charts {
		width: 730upx;
		height: 400upx;
		background: #ffffff;
	}

	.stockcharts {
		width: 730upx;
		background: #ffffff;
	}

	.chart-view {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.charts-pie {
		width: 320upx;
		height: 320upx;
	}

	.chart-content {
		margin-top: 5px;
		display: flex;
		flex-direction: row !important;
		justify-content: space-between;
		padding: 16px;
		background-color: #ffffff;
		margin-left: 10upx;
		margin-right: 10upx;
		border-radius: 5px;
	}

	.chart-legend {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.legend-item {
		margin-top: 10px;
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

	.chart-icon {
		color: #a2a2a2;
	}

	.liststyle {
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.titleView {
		display: flex;
		flex-direction: row;
		background: #ffffff;
		padding: 10px;
		justify-content: flex-start;
		border-bottom: 1px solid #eeeeee;
	}

	.leftView {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: #ffffff;
		font-size: $uni-font-size-base;
		color: #222831;
		margin-right: 1px;
	}

	.rightView {
		display: flex;
		flex-direction: row;
		width: 20%;
		justify-content: center;
		align-items: center;
		background: #ffffff;
		font-size: $uni-font-size-base;
		color: #222831;
		margin-right: 1px;
	}

	.cellcolor {
		color: $uni-color-subtitle;
	}

	.title-bg {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.title-left {
		font-size: $uni-font-size-lg;
		font-weight: bold;
		color: #222831;
	}

	.title-right {
		display: flex;
		flex: 1;
		justify-content: flex-end;
		align-items: center;
		flex-direction: row;
		color: #999999;
		font-size: $uni-font-size-sm;
	}

	.title-icon {
		margin-left: 5px;
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.content-bg {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px;
		border-bottom: #e9e9e9 1px solid;
	}

	.content-left {
		display: flex;
		flex: 1;
		justify-content: flex-start;
		align-items: center;
		flex-direction: row;
	}

	.content-right {
		display: flex;
		margin-left: 25px;
		color: #1F285D;
		font-size: $uni-font-size-base;
	}

	.content-right-icon {
		margin-left: 5px;
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.content-icon-bg {
		display: flex;
		flex-direction: row;
		width: 56rpx;
		height: 56rpx;
		justify-content: center;
		align-items: center;
		background: #E60000;
		border-radius: 50%;
	}

	.content-icon {
		font-size: 34rpx;
		color: #FFFFFF;
	}

	.content-title {
		font-size: $uni-font-size-base;
		color: $uni-font-size-title;
		margin-left: 10px;
	}

	.content-subtitle {
		font-size: $uni-font-size-sm;
		color: $uni-color-primary;
		margin-left: 10px;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		margin: 10px 5px 0px 5px;
		padding: 30rpx 10px;
		background: #ffffff;
		border-radius: 10px;
	}

	.chart-content {
		display: flex;
		flex-direction: row !important;
		justify-content: space-between;
		padding: 16px;
		background-color: #ffffff;
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
</style>
