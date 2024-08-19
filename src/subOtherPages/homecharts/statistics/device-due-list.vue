<template>
	<view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">设备到期列表</c-nav-bar-btns>
		<!-- 筛选view -->
		<view class="fixed-search-view" v-if="isShowSelect">
			<view class="top-search-view">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;" placeholder="自喷码/车号/品牌/型号/合同名称" placeholder-style="font-size:12px;"
							v-model="fuzzyParam" />
					</view>
				</view>
				<view class="select-view">
					<selectView :value="dueTypeObj.label" hint="到期范围" @clickSelect="showPick('dueType')" />
				</view>
			</view>
			<view class="top-search-view">
				<view class="select-view">
					<selectView :value="deviceSort.label" hint="设备类别" @clickSelect="showPick('deviceSort')" />
				</view>
				<view style="flex: 2;">
					<selectView :value="machineType.label" hint="设备类型" @clickSelect="showPick('machineType')" />
				</view>

			</view>
			<view class="top-search-view">
				<view class="select-view">
					<selectView :value="propObj.label" hint="属性" @clickSelect="showPick('prop')" />
				</view>
				<view class="select-view">
					<selectView :value="symbolObj.label" hint="关系" @clickSelect="showPick('symbol')" />
				</view>
				<view class="select-view">
					<selectView :value="propValue.label" hint="请选择" @clickSelect="showPick('propValue')" />
				</view>
			</view>
			<view class="top-search-view">
				<view class="reset-btn" @click="reset">重置</view>
				<view class="filter-view" @click="query">查询</view>
			</view>
		</view>
		<list class="list-med" show-scrollbar="false">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="list-item">
					<machineHeadNoPic :dataDic="item" />
					<view class="float-l-r">
						<view class="item-tag">合同名称</view>
						<view class="item-value">{{item.customerName||''}}-{{item.projectName }}</view>
					</view>
					<view class="float-l-r">
						<view class="item-tag">业务负责人</view>
						<view class="item-value">{{item.customerSalesmanName ||'-'}}</view>
					</view>
					<view class="float-l-r">
						<view class="item-tag">预计退场时间</view>
						<view class="item-value">{{getDate(item.endDate)}}</view>
					</view>
					<view class="float-l-r">
						<view class="item-tag">剩余天数</view>
						<view class="item-value">{{item.dueDaysCount}}天</view>
					</view>
				</view>
			</cell>
			<cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</cell>
		</list>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import badgeview from '@/components/common/image-upload/badge-icon.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import machineHeadNoPic from "@/subOtherPages/components/machine-head-no-pic.vue";
	let timer;
	export default {
		components: {
			uniLoadMore,
			filterView,
			badgeview,
			selectView,
			wPicker,
			machineHeadNoPic
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
						},
						{
								"text": "导出",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				datalist: [],
				//上拉下拉
				morestatus: 'more',
				page: 1,
				fuzzyParam: '',
				isEditAttachment: false,
				selectList: [],
				pickType: '',
				deviceSort: {
					value: '',
					label: '全部类别'
				},
				deviceSorts: [],
				//设备类型
				propValue: {},
				dueTypeObj: {},
				dueTypes: [],
				machineType: {},
				machineTypeList: [],
				//属性
				propObj: {},
				propList: [],
				//符号
				symbolObj: {},
				symbolList: [{
						label: '>=',
						value: '>='
					},
					{
						label: '=',
						value: '='
					},
					{
						label: '<=',
						value: '<='
					}
				],
				isShowSelect: false,
				heightList: [], //高度
				tonnageList: [], //吨位,
				isExportList: true,
				totalCount: '100',

			};
		},
		onLoad(option) {
			this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"设备到期统计","列表");
			this.dueTypeObj = option.dueType ? JSON.parse(decodeURIComponent(option.dueType)) : {};
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
			if (ps) {
				this.isExportList = ps.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEVICE_DUE_EXPORT);
			}
			uni.showLoading();
			this.getNetData();
			this.loadMachineType();
			this.getDeviceType();
			this.getProps();
			this.getHeightList();
			this.getTonnageList();
			this.loadDuesTypes();
		},
		watch: {
			fuzzyParam: {
				handler(val) {
					if (timer) {
						clearTimeout(timer);
					}
					timer = setTimeout(() => {
						this.page = 1;
						this.datalist = [];
						this.getNetData();
					}, 500);
				}
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		},
		//上拉加载
		onReachBottom() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.getNetData();
			this.morestatus = 'loading';
		},
		methods: {
			onNavBarButtonTap(e) {
				if (e.index == 0) {
					this.isShowSelect = !this.isShowSelect;
				} else if (e.index == 1) {
					if (this.isExportList) {
						this.exportExcel()
					} else {
						uni.showToast({
							icon: "none",
							title: "暂无导出权限，请联系管理员开通"
						})
					}
				}

			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			exportExcel(item) {
				this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"设备到期统计","导出");
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = {
					current: 1,
					size: this.totalCount,
					fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
					dueDaysType: this.dueTypeObj && this.dueTypeObj.value ? this.dueTypeObj.value : undefined,
					//当有设备类型时，才查询设备类别（高空车）
					deviceType: this.deviceSort && this.deviceSort.value ? this.deviceSort.value : undefined,
					machineTypeId: this.machineType && this.machineType.value ? this.machineType.value : undefined,
					keyType: this.propObj && this.propObj.value ? this.propObj.value : undefined,
					comparators: this.symbolObj && this.symbolObj.value ? this.symbolObj.value : undefined,
					comparisonValue: this.propValue && this.propValue.value ? this.propValue.value : undefined,
				};
				let url = this.$gxfmethod.getUrl(this.$url.DEVICE_DUE_LIST)
				let filename = this.$gxfmethod.getFileName('设备到期统计-');
				this.$gxfmethod.downFunc(url, 'POST', param, filename);
			},
			reset() {
				this.fuzzyParam = '';
				//重置
				this.machineType = {};
				this.dueTypeObj={};
				this.deviceSort = {
					value: '',
					label: '全部类别'
				}
				if (this.deviceSort && this.deviceSort.value) {
					this.loadMachineType();
					this.initProps();
				} else {
					this.symbolObj = {};
					this.propObj = {};
					this.propValue = {};
				}
				uni.showLoading();
				this.page = 1;
				this.datalist = [];
				this.getNetData();
			},
			query() {
				uni.showLoading();
				this.page = 1;
				this.datalist = [];
				this.getNetData();
			},
			//获取网络数据
			getNetData() {
				let param = {
					current: this.page,
					size: 10,
					fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
					dueDaysType: this.dueTypeObj && this.dueTypeObj.value ? this.dueTypeObj.value : undefined,
					deviceType: this.deviceSort && this.deviceSort.value ? this.deviceSort.value : undefined,
					machineTypeId: this.machineType && this.machineType.value ? this.machineType.value : undefined,
					keyType: this.propObj && this.propObj.value ? this.propObj.value : undefined,
					comparators: this.symbolObj && this.symbolObj.value ? this.symbolObj.value : undefined,
					comparisonValue: this.propValue && this.propValue.value ? this.propValue.value : undefined,

				};
				this.$network
					.getData(this.$url.DEVICE_DUE_LIST, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						let total = result.total;
						this.totalCount = total.toString();
						if (pages == this.page) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			//合同类型
			loadDuesTypes() {
				this.$network
					.loadDic('machine_due_type')
					.then(result => {
						this.dueTypes = result.records ? result.records : []

					})
					.catch(err => {});
			},
			getDeviceType() {
				let param = {
					source: 'device_type'
				};
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.deviceSorts = [];
						this.deviceSorts.push({
							label: '全部类别',
							value: ''
						});
						this.deviceSorts = this.deviceSorts.concat(
							result ?
							result.map(o => {
								return {
									value: o.key,
									label: o.value
								};
							}) : []
						);
					})
					.catch(err => {});
			},
			//设备类型
			loadMachineType() {
				let param = {
					source: 'machine_type',
					device_type: this.deviceSort && this.deviceSort.value ? this.deviceSort.value :
						undefined //设备类别默认高空车
				};
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.machineTypeList = result ?
							result.map(o => {
								return {
									value: o.key,
									label: o.value
								};
							}) : [];
					})
					.catch(err => {});
			},
			getProps() {
				this.$network
					.loadUserType('vehicle_type')
					.then(result => {
						this.propList =
							result && result.length > 0 ?
							result.map(o => {
								return {
									label: o.label,
									value: o.value
								};
							}) : [];
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
						this.heightList = result ?
							result.map(o => {
								return {
									value: o.key,
									label: o.value
								};
							}) : [];
						this.initType();
					})
					.catch(err => {});
			},
			getTonnageList() {
				let param = {
					source: 'tonnage'
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
						this.tonnageList = [];
						this.tonnageList.push({
							label: '全部',
							value: ''
						});
						this.tonnageList = result ?
							result.map(o => {
								return {
									value: o.key,
									label: o.value
								};
							}) : [];
						this.initType();
					})
					.catch(err => {});
			},

			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'deviceSort':
						this.selectList = this.deviceSorts ? this.deviceSorts : [];
						break;
					case 'dueType':
						this.selectList = this.dueTypes ? this.dueTypes : []
						break;
					case 'prop':
						if (this.deviceSort) {
							if (this.deviceSort.value == '1') {
								//高空车
								this.selectList = this.propList ?
									this.propList.filter(o => {
										return o.value == '1';
									}) : [];
							} else if (this.deviceSort.value == '2') {
								//挖掘机
								this.selectList = this.propList ?
									this.propList.filter(o => {
										return o.value == '2';
									}) : [];
							} else {
								//叉车-矿车-装载机
								this.selectList = this.propList ? this.propList : [];
							}
						}

						break;
					case 'symbol':
						this.selectList = this.symbolList ? this.symbolList : [];
						break;
					case 'propValue':
						if (this.propObj) {
							if (this.propObj.value === '1') {
								//高度
								this.selectList = this.heightList ? this.heightList : [];
							} else if (this.propObj.value === '2') {
								//吨位
								this.selectList = this.tonnageList ? this.tonnageList : [];
							} else {
								this.selectList = [];
							}
						} else {

							this.selectList = [];
							uni.showToast({
								title: '请选择属性',
								icon: 'none'
							});
						}
						break;
					case 'machineType':
						this.selectList = this.machineTypeList ? this.machineTypeList : [];
						break;
					default:
						break;
				}
				this.$refs.selector.show();
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'deviceSort':
						this.deviceSort = val.checkArr;
						this.machineType ={};
						if (this.deviceSort && this.deviceSort.value) {
							this.loadMachineType();
							this.initProps();
						} else {
							this.symbolObj = {};
							this.propObj = {};
							this.propValue = {};
						}
						break;
					case 'dueType':
						this.dueTypeObj = val.checkArr;
						break;
					case 'prop':
						this.propObj = val.checkArr;
						this.symbolObj = {
							label: '>=',
							value: '>='
						};
						if (this.propObj.value === '1') {
							//高度
							this.selectList = this.heightList ? this.heightList : [];
						} else if (this.propObj.value === '2') {
							//吨位
							this.selectList = this.tonnageList ? this.tonnageList : [];
						}
						this.initType();
						break;
					case 'symbol':
						this.symbolObj = val.checkArr;
						break;
					case 'propValue':
						this.propValue = val.checkArr;
						break;
					case 'machineType':
						this.machineType = val.checkArr;
						this.getHeightList();
						this.getTonnageList();
						break;
					default:
						break;
				}
			},
			initType() {
				//设置高度或吨位默认值
				if (this.propObj) {
					if (this.propObj.value === '1') {
						this.propValue = this.heightList && this.heightList.length > 0 ? this.heightList[0] : {};
					}
					if (this.propObj.value === '2') {
						this.propValue = this.tonnageList && this.tonnageList.length > 0 ? this.tonnageList[0] : {};
					}
				}
			},
			initProps() {
				//设置各种设备类别的属性
				if (this.deviceSort && this.deviceSort.value) {
					if (this.deviceSort.value === '1') {
						//高空车只有高度
						let s = this.propList ?
							this.propList.filter(o => {
								return o.value == '1';
							}) : [];
						//高空车
						this.propObj = s && s.length > 0 ? s[0] : {};
					} else if (this.deviceSort.value === '2') {
						//挖车只有吨位
						let s = this.propList ?
							this.propList.filter(o => {
								return o.value == '2';
							}) : [];
						//挖机
						this.propObj = s && s.length > 0 ? s[0] : {};
					} else {
						//叉车-矿车-装载机
						this.propObj = this.propList && this.propList.length > 0 ? this.propList.find(o => o.value ===
							'2') : {};
					}
					this.symbolObj = {
						label: '>=',
						value: '>='
					};
					this.getHeightList();
					this.getTonnageList();
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.contentbg {
		position: relative;
		height: 100%;
		width: 100%;
	}

	.filter-view {
		display: flex;
		justify-content: center;
		align-items: center;
		background: #E60000;
		color: #FFFFFF;
		height: 30px;
		flex: 1;
		border-radius: 4px;
		text-align: center;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 5px;
	}

	.reset-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		background: $uni-bg-color-grey;
		color: $uni-text-color;
		height: 30px;
		flex: 1;
		border-radius: 4px;
		text-align: center;
		font-size: $uni-font-size-base;
		margin-right: 10px;
		margin-left: 10px;
		margin-top: 5px;
	}

	.list-med {
		padding-bottom:env(safe-area-inset-bottom);
		position: absolute;
		width: 100%;
		top: 8px;
		background: $uni-bg-color-grey;
	}

	.list-item {
		background-color: #FFFFFF;
		padding: 8px;
		margin: 8px;
		border-radius: 4px;
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
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}



	.fixed-search-view {
		position: fixed;
		top: 0px;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding-bottom: 10px;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		z-index: 200;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	}

	.top-search-view {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		background: #ffffff;
		margin-top: 4px;
		justify-content: center;
		align-items: center;
	}

	.select-view {
		flex: 1;
	}

	.search-box {
		background: #F7F7F7;
		flex: 2;
		display: flex;
		padding: 5px 0px;
		margin: 8px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
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

	.input-style {
		background-color: #F7F7F7;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		flex: 1;
		padding: 2px 8px;
	}

	.group-total-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		margin-left: 8px;
		margin-right: 8px;
	}

	.item-view {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		padding: 4px 0px;
	}

	.group-arrow {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-lg;
	}

	.group-item-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc((100% - 16px) / 2);
		margin: 4px;
		box-sizing: border-box;
		border: 1px solid #eeeeee;
		border-radius: 4px;
		background: #eeeeee;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);

		&.active {
			background-color: #f2ffff;
			color: $uni-color-primary;
			border: $uni-color-primary solid 1px;
			box-shadow: 0px 1px 1px 0px rgba(0, 196, 196, 0.2);
		}
	}

	.group-name {
		// width: 25px;
		height: 25px;
		// background-color: #aaaaaa;
		text-align: center;
		line-height: 25px;
		// border-radius: 50%;
		font-size: $uni-font-size-base;
		color: $uni-text-color;

		&.active {
			color: $uni-color-primary;
		}
	}

	.group-line {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 16px;
		line-height: 16px;
	}

	.group-line-tag {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-xs;

		&.active {
			color: $uni-color-primary;
		}
	}

	.group-line-value {
		color: $uni-text-color;
		font-size: $uni-font-size-base;

		&.active {
			color: $uni-color-primary;
		}
	}
</style>
