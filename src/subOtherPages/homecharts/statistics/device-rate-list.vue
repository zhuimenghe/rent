<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">设备出租率</c-nav-bar-btns>
		<view class="search-container" v-if="isShowSelect">
			<autoUnionDeviceQueryView :isExportList='isExport' :isShowAll='true' :isQueryCustomTime='true' :isQuerySalesman="false"
			 :isQueryOrg="true" dateModel="year" :isQueryBrand='false' :isQueryModel='true' @reset='reset' @query="query"
			 @exportExcel="exportData" />
		</view>
		<view class="list-container">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="float-l-r" style="border-bottom: 1px solid #efefef;" @click="changeExpand(i)">
					<view class="item-value" style="font-weight: bold;text-align: left;padding: 8px 0px;">{{item.machineTypeName}}</view>
					<i class="iconfont iconarrow-right" :class="item.isExpand ? 'translate-arrow' : 'translate-arrow-expend'"></i>
				</view>
				<view v-if="item.isExpand" style="border-bottom: 1px solid #efefef;">
					<view v-for="(m,pos) in item.machineRateDtos" :key="pos">
						<view class="float-l-r">
							<view class="item-tag">{{m.month}}月出租率</view>
							<view class="item-value">{{getRate(m.rate)}}</view>
						</view>
					</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">年平均出租率</view>
					<view class="item-value">{{getRate(item.yearHire)}}</view>
				</view>
			</view>

		</view>
		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import autoUnionDeviceQueryView from '@/subOtherPages/components/auto-union-device-query-view.vue';
	export default {
		components: {
			selectView,
			wPicker,
			uniLoadMore,
			autoUnionDeviceQueryView
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
				orgObj: {},
				orgIdList: [],
				machineType: {},
				deviceHeight: {},
				heightList: [],
				deviceModel: {},
				selectList: [],
				deviceSort: {},
				pickType: '',
				isExport: true,

			};
		},
		onLoad(options) {
			 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"出租率","列表");
			this.year = new Date().getFullYear() + '-01-01 00:00:00';
			this.deviceSort = options.deviceSort ? JSON.parse(decodeURIComponent(options.deviceSort)) : {};
			this.machineType = options.machineType ? JSON.parse(decodeURIComponent(options.machineType)) : {};
			this.deviceHeight = options.deviceHeight ? JSON.parse(decodeURIComponent(options.deviceHeight)) : {};
			this.deviceModel = options.deviceModel ? JSON.parse(decodeURIComponent(options.deviceModel)) : {};
			this.orgObj = options.orgObj ? JSON.parse(decodeURIComponent(options.orgObj)) : {};
			this.orgIdList = options.orgObj ? this.$datestr.getOrgIdList(this.orgObj) : []
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isExport = res.data.some(x => x.value === this.$savekey.PERMISSION_RATE_EXPORT);
				}
			});
			this.loadRentalData();
		},
		onPullDownRefresh() {
			this.list = [];
			this.page = 1;
			this.loadRentalData();
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
							orgObj: this.orgObj,
							orgIdList: this.orgIdList,
							sortObj: this.deviceSort,
							notResetList: ['customDate']
						})
					}, 500)
				}
			},
			getRate(rate){
				let r = rate ? Number(rate) * 100 : 0
				return  r.toFixed(2)+'%'
			},
			//展开闭合页面
			changeExpand(pos) {
				this.list[pos].isExpand = !this.list[pos].isExpand;
			},
			reset() {
				this.isShowSelect = false;
				this.deviceSort = {}
				this.machineType = {};
				this.deviceHeight = {};
				this.deviceModel = {};
				this.orgObj = {}
				this.orgIdList = []

				this.list = [];
				this.page = 1;
				this.loadRentalData();
			},
			query(val) {
				this.isShowSelect = false;
				this.deviceSort = val.sortObj ? val.sortObj : {}
				this.machineType = val.typeObj ? val.typeObj : {};
				this.deviceHeight = val.heightObj ? val.heightObj : {};
				this.deviceModel = val.modelObj ? val.modelObj : {};
				this.orgObj = val.orgObj ? val.orgObj : {};
				this.year = val.customDate ? val.customDate : '';
				this.orgIdList = val.orgIdList ? val.orgIdList : '';
				this.list = [];
				this.page = 1;
				this.loadRentalData();
			},
			getYear(date) {
				return date ? new Date(date).getFullYear() + "年" : ''
			},
			getMoney(money) {
				return money ? '￥' + this.moneyUtil.dealNumber(money) : '-'
			},
			//获取车辆年度对比
			loadRentalData() {
				uni.showLoading();
				let param = {
					orgIdList: this.orgObj && this.orgObj.value ? this.$datestr.getOrgIdList(this.orgObj) : undefined,
					searchDate: this.year,
					deviceType: this.deviceSort && this.deviceSort.value ? this.deviceSort.value : undefined,
					type: this.machineType && this.machineType.value ? this.machineType.value : undefined,
					height: this.deviceHeight && this.deviceHeight.value ? this.deviceHeight.value : undefined,
					machineType: this.deviceModel && this.deviceModel.value ? this.deviceModel.value : undefined,
				};
				this.$network
					.getData(this.$url.MACHINE_YEAR_LIST, 'POST', param)
					.then(result => {
						let tempaList =
							result && result.length > 0 ?
							result.map(obj => {
								return {
									...obj,
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
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			loadMore() {
				if (this.status == 'noMore') {
					return
				}
				this.page += 1;
				let spliceList = this.pageList.splice(0, (this.pageList.length > 10 ? 10 : this.pageList.length))
				this.list = [...spliceList];
				this.status = this.pageList.length > 0 ? 'more' : 'noMore';
			},
			//---------------------下载---------------------------------------------
			exportData() {
				 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"出租率","导出");
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = {
					orgIdList: this.orgObj && this.orgObj.value ? this.$datestr.getOrgIdList(this.orgObj) : undefined,
					searchDate: this.year,
					deviceType: this.deviceSort && this.deviceSort.value ? this.deviceSort.value : undefined,
					type: this.machineType && this.machineType.value ? this.machineType.value : undefined,
					height: this.deviceHeight && this.deviceHeight.value ? this.deviceHeight.value : undefined,
					machineType: this.deviceModel && this.deviceModel.value ? this.deviceModel.value : undefined,
				};
				let url = this.$gxfmethod.getUrl(this.$url.MACHINE_YEAR_LIST)
				let filename = this.$gxfmethod.getFileName("出租率-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
				
				// let param = []
				// if (this.year) {
				// 	param.push('searchDate=' + encodeURIComponent(this.year))
				// }
				// if (this.rentalType && this.rentalType.value) {
				// 	param.push('settlementType=' + this.rentalType.value)
				// }
				// if (this.machineType && this.machineType.value) {
				// 	param.push('type=' + this.machineType.value)
				// }
				// if (this.deviceModel && this.deviceModel.value) {
				// 	param.push('machineType=' + this.deviceModel.value)
				// }
				// if (this.deviceHeight && this.deviceHeight.value) {
				// 	param.push('height=' + this.deviceHeight.value)
				// }



				// let url = this.$url.BASE_URL + this.$url.MACHINE_YEAR_LIST + '?' + param.join("&");

				// let filename = this.$gxfmethod.getFileName('出租率-')


			},

		},
	};
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom:env(safe-area-inset-bottom);
		width: 100%;
		// height: 100%;
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
		z-index: 950;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 1000;
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
