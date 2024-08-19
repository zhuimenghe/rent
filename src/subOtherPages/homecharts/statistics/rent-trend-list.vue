<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">租金详情</c-nav-bar-btns>
		<view class="top-container">
			<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange" />
		</view>
		<view class="search-container" v-if="isShowSelect">
			<autoUnionDeviceQueryView ref="autoUnionDeviceQuery" :isExportList='isExport' :isShowAll='true' :isQueryCustomTime='true'
			 :isCustomQuery="true" :isQuerySalesman="index==0?false:true" :isQueryOrg="false" :customList='rentalTypeList'
			 customHint="租赁方式" dateModel="year" :isQueryBrand='false' :isQueryModel='false' @reset='reset' @query="query"
			 @exportExcel="exportData" />


			<!-- <view class="search-top">
				<view style="flex: 1;">
					<selectView :value='getYear(year)' hint='年份' @clickSelect="showPick('year')" textSize='10px' height="28px"
					 labelWidth='40px' />
				</view>
				<view style="flex: 1;">
					<selectView :value='rentalType.label||""' hint='租赁方式' @clickSelect="showPick('rentalType')" textSize='10px' height="28px"
					 labelWidth='50px' />
				</view>
				<view style="flex: 1;">
					<selectView :value='machineType.label||""' hint='设备类别' @clickSelect="showPick('machineType')" textSize='10px' height="28px"
					 labelWidth='70px' />
				</view>
			</view>
			<view class="search-top">
				<view style="flex: 1;">
					<selectView :value='deviceHeight.label||""' hint='高度' @clickSelect="showPick('deviceHeight')" textSize='10px'
					 height="28px" labelWidth='30px' />
				</view>
				<view style="flex: 2;">
					<selectView :value='deviceModel.label||""' hint='设备型号' @clickSelect="showPick('deviceModel')" textSize='10px' height="28px"
					 labelWidth='70px' />
				</view>
				<view class="btn-export" v-if="isExport" @click="exportData">导出</view>
			</view>
			<view class="search-top">
				<view class="btn-reset" @click="reset">重置</view>
				<view class="btn-confirm" @click="submit">确定</view>
			</view> -->
		</view>
		<view class="list-container">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="float-l-r" style="border-bottom: 1px solid #efefef;">
					<view class="item-value" style="font-weight: bold;text-align: left;">{{index==0? item.typeName:item.customerSalesmanName}}</view>
					<view class="float-r" @click="changeExpand(i)">
						<view class="item-tag">{{item.settlementTypeName}}
						</view>
						<i class="iconfont iconarrow-right" :class="item.isExpand ? 'translate-arrow' : 'translate-arrow-expend'"></i>
					</view>
				</view>
				<view v-if="item.isExpand" style="border-bottom: 1px solid #efefef;">
					<view v-for="(m,pos) in item.monthList" :key="pos">
						<view class="float-l-r" v-if="rentalType.value=='4'||rentalType.value=='6'">
							<view class="item-tag">{{m.month}}月日租金</view>
							<view class="item-value">{{m.monthDayHire}}</view>
						</view>
						<view class="float-l-r">
							<view class="item-tag">{{m.month}}{{rentalType.value=='4'||rentalType.value=='6'?'月月租金':'月租金'}}</view>
							<view class="item-value">{{m.monthHire}}</view>
						</view>
					</view>
				</view>
				<view class="float-l-r" v-if="rentalType.value=='4'||rentalType.value=='6'" style="border-bottom: 1px dashed  #efefef;">
					<view class="item-tag">年平均日租金</view>
					<view class="item-value">{{getMoney(item.yearDayHire)}}</view>
				</view>

				<view class="float-l-r">
					<view class="item-tag">{{rentalType.value=='4'||rentalType.value=='6'?'年平均月租金':'年平均租金'}}</view>
					<view class="item-value">{{ getMoney(item.yearHire)}}</view>
				</view>
			</view>
			<view>
				<uni-load-more iconType="auto" :status="status" />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="year" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date"
		 themeColor="#E60000" />
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import autoUnionDeviceQueryView from '@/subOtherPages/components/auto-union-device-query-view.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	export default {
		components: {
			selectView,
			wPicker,
			uniLoadMore,
			autoUnionDeviceQueryView,
			sunTab
		},
		data() {
			return {
				"buttons": [
						{
								"text": "筛选",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				//是否显示筛选
				isShowSelect: false,
				list: [],
				page: 1,
				pagesize: 10000,
				status: 'more',
				pageList: [],
				year: '',
				rentalTypeList: [],
				machineTypeList: [],
				deviceModelList: [],
				rentalType: {},
				machineType: {},
				deviceHeight: {},
				heightList: [],
				deviceModel: {},
				selectList: [],
				deviceSort: {},
				pickType: '',
				isExport: true,
				index: 0,
				tabList: ['设备', '员工'],
				salesmanObj: {},

			};
		},
		onLoad(options) {
			 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"租金趋势统计","列表");
			this.deviceSort = options.deviceSort ? JSON.parse(decodeURIComponent(options.deviceSort)) : {};
			this.machineType = options.machineType ? JSON.parse(decodeURIComponent(options.machineType)) : {};
			this.deviceHeight = options.deviceHeight ? JSON.parse(decodeURIComponent(options.deviceHeight)) : {};
			this.deviceModel = options.deviceModel ? JSON.parse(decodeURIComponent(options.deviceModel)) : {};
			this.year = options.year ? options.year : this.$dateUtil.datetimeSFormat();
			this.rentalType = options.rentalType ? JSON.parse(decodeURIComponent(options.rentalType)) : {};
			this.salesmanObj = options.salesmanObj ? JSON.parse(decodeURIComponent(options.salesmanObj)) : {};
			this.index = this.salesmanObj && this.salesmanObj.value ? 1 : 0
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isExport = res.data.some(x => x.value === this.$savekey.PERMISSION_RENT_TREND_EXPORT);
				}
			});
			this.loadSettlementTypes();
			this.loadmachineType();
			this.loaddeviceModel();
			this.getHeightList()
		},
		onPullDownRefresh() {
			this.list = [];
			this.page = 1;
			this.loadRentTrendData();
		},
		onReachBottom() {
			if (this.status == 'noMore') {
				return;
			}
			this.status='loading'
			setTimeout(()=>{
				this.page += 1;
				let start = this.page * 10
				let end = this.pageList.length > (this.page * 10 + 10) ? (this.page * 10 + 10) : this.pageList.length
				let cutList = this.pageList.slice(start, end);
				this.list = this.list.concat(cutList)
				if (this.list.length >= this.pageList.length) {
					this.status = 'noMore';
				} else {
					this.status = 'more';
				}
			},500)
			
		},
		methods: {
			onNavBarButtonTap() {
				this.isShowSelect = !this.isShowSelect;
				if (this.isShowSelect) {
					setTimeout(() => {
						uni.$emit('device-query-auto', {
							customDate: this.year,
							typeObj: this.machineType,
							heightObj: this.deviceHeight,
							modelObj: this.deviceModel,
							customObj: this.rentalType,
							sortObj: this.deviceSort,
							salesmanObj: this.salesmanObj,
							notResetList: ['customObj', 'customDate']
						})
					}, 500)
				}
			},
			indexchange(e) {
				this.index = e.index
				this.isShowSelect = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 10
				})
				this.reset();
			},
			//展开闭合页面
			changeExpand(pos) {
				this.list[pos].isExpand = !this.list[pos].isExpand;
			},
			reset() {
				this.isShowSelect = false

				this.deviceSort = {}
				this.machineType = {};
				this.deviceHeight = {};
				this.deviceModel = {};
				this.salesmanObj = {};
				this.rentalType = this.rentalTypeList && this.rentalTypeList.length > 0 ? this.rentalTypeList[0] : this.rentalType
				// this.loaddeviceModel();
				this.loadRentTrendData()
			},
			query(val) {
				this.isShowSelect = false

				this.deviceSort = val.sortObj ? val.sortObj : {}
				this.machineType = val.typeObj ? val.typeObj : {};
				this.deviceHeight = val.heightObj ? val.heightObj : {};
				this.deviceModel = val.modelObj ? val.modelObj : {};
				this.rentalType = val.customObj ? val.customObj : {};
				this.year = val.customDate ? val.customDate : '';
				this.salesmanObj = val.salesmanObj ? val.salesmanObj : {};
				// this.loaddeviceModel();
				this.loadRentTrendData()
			},
			// submit() {
			// 	this.list = [];
			// 	this.page = 1;
			// 	this.loadRentTrendData();
			// },
			getYear(date) {
				return date ? new Date(date).getFullYear() + "年" : ''
			},
			getMoney(money) {
				return money ? '￥' + this.moneyUtil.dealNumber(money) : '-'
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'year':
						this.$refs.date.show()
						break;
					case 'rentalType':
						this.selectList = this.rentalTypeList
						this.$refs.selector.show()
						break;
					case 'machineType':
						this.selectList = this.machineTypeList
						this.$refs.selector.show()
						break;
					case 'deviceModel':
						this.selectList = this.deviceModelList
						this.$refs.selector.show()
						break;
					case 'deviceHeight':
						this.selectList = this.heightList
						this.$refs.selector.show()
						break;
					default:
						break;
				}
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'year':
						this.year = val.result + '-01-01 00:00:00'
						break;
					case 'rentalType':
						this.rentalType = val.checkArr
						break;
					case 'machineType':
						this.machineType = val.checkArr
						this.deviceModel = {}
						this.loaddeviceModel();
						break;
					case 'deviceModel':
						this.deviceModel = val.checkArr
						break;
					case 'deviceHeight':
						this.deviceHeight = val.checkArr
						this.deviceModel = {}
						this.loaddeviceModel();
						break;
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
							if (!this.rentalType || !this.rentalType.value) {
								this.rentalType = this.rentalTypeList[0]
							}
							this.loadRentTrendData()
						}
					})
					.catch(err => {});
			},
			//设备类别
			loadmachineType() {
				this.$network
					.loadType('machine_type')
					.then(result => {
						this.machineTypeList = result;
					})
					.catch(err => {});
			},
			//设备型号
			loaddeviceModel() {
				let param = {}
				if (this.machineType && this.machineType.value) {
					param = {
						type: this.machineType.value,
						height: this.deviceHeight.value
					}
				}
				this.$network
					.getData(this.$url.MACHINE_RECORD_TYPE, 'GET', param)
					.then(result => {
						this.deviceModelList = result ? result.map((o, index) => {
							return {
								value: o.name,
								label: o.name,
							};
						}) : [];
					})
					.catch(err => {});
			},
			getHeightList() {
				this.$network
					.loadUserType('machine_height')
					.then(result => {
						this.heightList =
							result && result.length > 0 ?
							result.map(o => {
								return {
									label: o.label,
									value: o.value
								};
							}) : [];
						// this.initType();
					})
					.catch(err => {});
			},


			//设备趋势
			loadRentTrendData() {
				uni.showLoading({
					mask: true
				})
				//MACHINE_TYPE(1, "设备类型维度"), CUSTOMER_SALESMAN(2, "业务负责人维度"), TYPE_HEIGHT_SALESMAN(3, "设备类型、高度维度"),
				let param = {
					settlementType: this.rentalType.value,
					mode: this.index == 0 ? '1' : '2'
				}
				if (this.deviceSort && this.deviceSort.value) {
					param = {
						...param,
						deviceType: this.deviceSort.value
					}
				}
				if (this.machineType && this.machineType.value) {
					param = {
						...param,
						type: this.machineType.value
					}
				}
				if (this.deviceModel && this.deviceModel.value) {
					param = {
						...param,
						machineType: this.deviceModel.value
					}
				}
				if (this.deviceHeight && this.deviceHeight.value) {
					param = {
						...param,
						height: this.deviceHeight.value
					}
				}
				if (this.year) {
					param = {
						...param,
						searchDate: this.year
					}
				}
				if (this.salesmanObj && this.salesmanObj.value) {
					param = {
						...param,
						customerSalesman: this.salesmanObj.value
					}
				}
				this.$network
					.getData(this.$url.CHART_RENT_TREND_URL, 'POST', param)
					.then(result => {
						let tempaList =
							result && result.length > 0 ?
							result.map(obj => {
								let monthList = obj.monthList && obj.monthList.length > 0 ? obj.monthList.map(x => {
									return {
										...x,
										monthHire: x.monthHire ? '￥' + this.moneyUtil.dealNumber(x.monthHire) : '-'
									}
								}) : [];
								return {
									...obj,
									monthList: monthList,
									isExpand: false
								};
							}) : [];
						this.pageList = [...tempaList]
						if (this.pageList.length > 10) {
							this.list = this.pageList.slice(0, 10);
							this.status = 'more';
						} else {
							this.list = this.pageList
							this.status = 'noMore';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.list = this.page == 1 ? [] : this.list
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			//---------------------下载---------------------------------------------
			exportData() {
				 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"租金趋势统计","导出");
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = []
				param.push('mode=' + (this.index == 0 ? '1' : '2'))
				if (this.year) {
					param.push('searchDate=' + encodeURIComponent(this.year))
				}
				if (this.deviceSort && this.deviceSort.value) {
					param.push('deviceType=' + this.deviceSort.value)
				}
				
				if (this.rentalType && this.rentalType.value) {
					param.push('settlementType=' + this.rentalType.value)
				}
				if (this.machineType && this.machineType.value) {
					param.push('type=' + this.machineType.value)
				}
				if (this.deviceModel && this.deviceModel.value) {
					param.push('machineType=' + this.deviceModel.value)
				}
				if (this.deviceHeight && this.deviceHeight.value) {
					param.push('height=' + this.deviceHeight.value)
				}
				if (this.salesmanObj && this.salesmanObj.value) {
					param.push('customerSalesman=' + this.salesmanObj.value)
				}

				let url = this.$url.BASE_URL + this.$url.CHART_RENT_TREND_EXPORT + '?' + param.join("&");

				let filename = this.$gxfmethod.getFileName('租金趋势统计-')
				this.$gxfmethod.downFunc(url, 'GET', undefined, filename)


			},

		},
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
		z-index: 100;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 450;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 400;
	}

	.search-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
		padding-bottom: 4px;
		width: 100%;
		z-index: 100;
	}

	.search-bottom {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		width: 100%;
		z-index: 55;
		color: $uni-color-title;
		margin: 5px;
		font-size: $uni-font-size-sm;
		text-align: center;
	}

	.select-view {
		flex: 1;
	}

	.select-view-2 {
		flex: 2;
	}

	.select-view-3 {
		flex: 3;
	}

	.search-box {
		background: #F7F7F7;
		height: 32px;
		flex: 1;
		line-height: 32px;
		display: flex;
		margin: 8px 8px;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.select-container {
		display: flex;
		width: 40%;
		flex-direction: column;
		position: relative;
	}

	.select-label {
		display: flex;
		flex-direction: row;
		margin-left: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.select-list {
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 28px;
		left: 0px;
		width: 150%;
		font-size: $uni-font-size-base;
		text-align: center;
		background-color: $uni-bg-color-grey;
		border-radius: 0px 0px 4px 4px;
	}

	.select-item {
		height: 35px;
		width: 100%;
		background-color: #ffffff;
		text-align: left;
		line-height: 35px;
		margin-top: 1rpx;
		padding-left: 15px;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		flex: 1;
	}

	.export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #ffffff;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
		margin-left: 5px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}

	.btn-export {
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-right: 8px;
		align-items: center;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
	}


	.btn-confirm {
		padding: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #ffffff;
		background-color: $uni-color-primary;
		border-radius: 4px;
		margin: 0px 4px;
		flex: 1;
	}

	.btn-reset {
		padding: 6px;
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.list-container {
		margin-top: 56px;
		padding-bottom:env(safe-area-inset-bottom);
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

	.float-r {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		text-align: end;
	}

	.item-tag {
		color: $uni-text-color-gray;
		margin: 4px 0px;
		min-width: 72px;
		font-size: $uni-font-size-base;
	}

	.item-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
	}

	.link {
		color: $uni-color-primary;
	}
</style>
