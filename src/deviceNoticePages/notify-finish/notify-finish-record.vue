<template>
	<view class="content">
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content"><input style="flex: 1;font-size: 14px;" placeholder="车号/自喷码" v-model="searchKey" /></view>
				</view>
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content"><input style="flex: 1;font-size: 14px;" placeholder="任务单号" v-model="businessSearch" /></view>
				</view>
				<view class="btnstyle" @click="gotoOther('filter')"><text>筛选</text></view>
				<view class="btnstyle-export" @click="gotoOther('export')" v-if="deviceExport"><text>导出</text></view>
			</view>
			<view class="bottom-search" v-if="showfileter">
				<view class="bottom-search-top">
					<label-arrow style="flex: 1;" :value="startDate" arrowColor="#999999" textColor="#222831" textSize="14" arrowSize="14" @clickLabel="showpick('start')" />
					<label-arrow
						style="margin-left: 30px;flex: 1;"
						:value="endDate"
						arrowColor="#999999"
						textColor="#222831"
						textSize="14"
						arrowSize="14"
						@clickLabel="showpick('end')"
					/>
				</view>
				<view class="bottom-search-top">
					<label-arrow style="flex: 1;" :value="gettiltle()" arrowColor="#999999" textColor="#222831" textSize="14" arrowSize="14" @clickLabel="showpick('state')" />
					<view style="margin-left: 30px;flex: 1;" />
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">查询</view>
				</view>
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor">
							<view class="item-head" v-if="item.task">
								<view class="head-top">
									<text style="margin-right: 5px;">{{ item.task.printCode || '--' }}</text>
									|
									<text style="margin-left: 5px;">{{ item.task.licenseId || '--' }}</text>
								</view>
								<view class="head-bottom">
									<text>{{ item.task.machineTypeDesc || '--' }}</text>
									|
									<text class="item-text">{{ item.task.heightName || '--' }}</text>
									|
									<text class="item-text">{{ item.task.brand || '--' }}</text>
									|
									<text class="item-text">{{ item.task.machineTypeName || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<text>{{ item.todoStateName || '--' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>任务单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.taskNo || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>任务类型</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.businessTypeName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>开始日期</text></view>
						<view class="cell-text-right">
							<text>{{ $gxfmethod.getYMDHMTime(item.task.genTime) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>截止日期</text></view>
						<view class="cell-text-right" :style="{ color: item.task.isOverTime ? '#FF0000' : '#111111' }">
							<text>{{ $gxfmethod.getYMDHMTime(item.endDate) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>完成日期</text></view>
						<view class="cell-text-right">
							<text>{{ $gxfmethod.getYMDHMTime(item.doneDate) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text" v-for="(t, i) in item.businessList" :key="i" @click="gotoDetail(item, t)">
						<view class="cell-text-left fontsubcolor" v-if="i == 0"><text>关联单号</text></view>
						<view class="cell-text-right" style="color: #E60000;">
							<text>{{ t.businessNo || '--' }}</text>
						</view>
						<i class="iconfont cellrightImg iconarrow-right"></i>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>任务备注</text></view>
						<view class="cell-text-right">
							<text>{{ item.task ? (item.task.remark ? item.task.remark : '--') : '--' }}</text>
						</view>
					</view>
					<view class="cell-text" v-if="item.todoState == '4'">
						<view class="cell-text-left fontsubcolor"><text>关闭备注</text></view>
						<view class="cell-text-right">
							<text>{{ item.closeRemark || '--' }}</text>
						</view>
					</view>
					<view class="line-s" v-if="item.todoState!='4'"/>
					<view class="cell-text" v-if="item.todoState!='4'">
						<view class="cell-text-right" style="color: #E60000;" v-if="item.businessType == '1'">
							<!-- <text @click="gotoOther('addwx',item)">新增维修单</text> -->
							<text @click="gotoOther('connectwx', item)" style="margin-left: 20px;">关联维修单</text>
						</view>
						<view class="cell-text-right" style="color: #E60000;" v-if="item.businessType == '2'">
							<!-- <text @click="gotoOther('addby',item)">新增保养单</text> -->
							<text @click="gotoOther('connectby', item)" style="margin-left: 20px;">关联保养单</text>
						</view>
						<view class="cell-text-right" style="color: #E60000;" v-if="item.businessType == '3'">
							<!-- <text @click="gotoOther('addjx',item)">新增检修单</text> -->
							<text @click="gotoOther('connectjx', item)" style="margin-left: 20px;">关联检修单</text>
						</view>
						<view class="cell-text-right" style="color: #E60000;" v-if="item.businessType == '4'">
							<!-- <text @click="gotoOther('addxj',item)">新增巡检单</text> -->
							<text @click="gotoOther('connectxj', item)" style="margin-left: 20px;">关联巡检单</text>
						</view>
						<view class="cell-text-right" style="color: #E60000;" v-if="item.businessType == '20'">
							<!-- <text @click="gotoOther('addxj',item)">新增巡检单</text> -->
							<text @click="gotoOther('connectdcxj', item)" style="margin-left: 20px;">关联巡检单</text>
						</view>
					</view>
				</cell>
				<cell><uni-load-more iconType="auto" :status="morestatus" /></cell>
			</list>
		</view>
		<multiple-select v-model="show" :data="stateArr" :default-selected="defaultSelected" @confirm="onConfirm" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import multipleSelect from '@/components/common/multipleSelect/multipleSelect.vue';
let timer;
export default {
	components: {
		uniLoadMore,
		wPicker,
		labelArrow,
		multipleSelect
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			businessSearch: '',
			startDate: '开始时间',
			endDate: '结束时间',
			selectType: '',
			selectList: [],
			showfileter: false,
			deviceExport: false,
			stateArr: [{ value: '3', label: '已完成' }, { value: '4', label: '已关闭' }],
			stateDicArr: [{ value: '3', label: '已完成' }, { value: '4', label: '已关闭' }],
			defaultSelected: ['3', '4'],
			show: false
		};
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
	onLoad() {
		uni.showLoading();
		this.loaddata();
		uni.$on('choose-repair-emit', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('choose-maintain-emit', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('choose-hostling-emit', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('choose-polling-emit', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('refreshData-repair', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('refresh-maintain', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('refreshData-overhaul', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('refresh-polling', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
	},
	onUnload() {
		uni.$off('choose-repair-emit');
		uni.$off('choose-maintain-emit');
		uni.$off('choose-hostling-emit');
		uni.$off('choose-polling-emit');
		uni.$off('refreshData-repair');
		uni.$off('refresh-maintain');
		uni.$off('refreshData-overhaul');
		uni.$off('refresh-polling');
	},
	watch: {
		searchKey: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
			}
		},
		businessSearch: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
			}
		}
	},
	methods: {
		//判断是否点击
		gettiltle() {
			let getstr = '';
			if (this.stateDicArr.length > 0) {
				this.stateDicArr.forEach(o => {
					if (getstr != '') {
						getstr = getstr + ',' + o.label;
					} else {
						getstr = o.label;
					}
				});
			}
			return getstr;
		},
		getLoadStr() {
			let getstr = '';
			if (this.stateDicArr.length > 0) {
				this.stateDicArr.forEach(o => {
					if (getstr != '') {
						getstr = getstr + ',' + o.value;
					} else {
						getstr = o.value;
					}
				});
			}
			return getstr;
		},
		//----------------
		getArr(liststr) {
			let newlist = liststr.split(',');
			return newlist;
		},
		gotoDetail(item, t) {
			if (item.businessType == '1') {
				let param = {
					businessNo: t.businessNo
				};
				uni.navigateTo({
					url: '/devicePages/repair/repair-detail?item=' + encodeURIComponent(JSON.stringify(param))
				});
			} else if (item.businessType == '2') {
				uni.navigateTo({
					url: '/devicePages/maintain/maintain-detail?businessNo=' + t.businessNo
				});
			} else if (item.businessType == '3') {
				let param = {
					businessNo: t.businessNo
				};
				uni.navigateTo({
					url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(param))
				});
			} else if (item.businessType == '4') {
				uni.navigateTo({
					url: '/devicePages/polling/polling-detail?businessNo=' + t.businessNo
				});
			}else if (item.businessType == '20') {
				uni.navigateTo({
					url: '/devicePages/battery-polling/battery-polling-detail?businessNo=' + t.businessNo
				});
			}
		},
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
		},
		headerrefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.loaddata();
		},
		loaddata() {
			let param = {
				type: '2',
				current: this.currentpage,
				size: 5,
				keyword: this.searchKey,
				businessNo: this.businessSearch,
				startTime: this.startDate == '开始时间' ? undefined : this.startDate + ' 00:00:00',
				endTime: this.endDate == '结束时间' ? undefined : this.endDate + ' 23:59:59',
				taskState: this.getLoadStr() == '' ? undefined : this.getLoadStr()
			};
			this.$network
				.getData(this.$url.MACHINE_TODO_PAGE, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
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
		clearsum() {
			this.startDate = '开始时间';
			this.endDate = '结束时间';
			this.searchKey = '';
			this.businessSearch = '';
			this.stateDicArr = [{ value: '3', label: '已完成' }, { value: '4', label: '已关闭' }];
			(this.defaultSelected = ['3', '4']), uni.showLoading();
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		oksum() {
			uni.showLoading();
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		showpick(type) {
			this.selectType = type;
			if (type === 'state') {
				this.show = true;
			} else if (type === 'org') {
				this.selectList = [...this.orgList];
				this.$refs.selector.show();
			} else {
				this.$refs.date.show();
			}
		},
		onConfirm(val) {
			if (this.selectType === 'start') {
				this.startDate = val.result;
			} else if (this.selectType === 'end') {
				this.endDate = val.result;
			} else if (this.selectType === 'state') {
				if (val.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '至少存在一个任务状态'
					});
					return;
				}
				this.stateDicArr = [...val];
				this.defaultSelected = this.stateDicArr.map(o => {
					return o.value;
				});
				this.show = false;
			}
		},
		exportList() {
			// uni.showLoading({
			// 	title:'正在下载中,请稍等...',
			// 	mask:true,
			// })
			// let param = {
			// 	isUnionContract:true,
			// 	keyword:this.searchKey != "" ? this.searchKey : undefined,
			// 	orgId : this.orgDic.value != "" ? this.orgDic.value : undefined
			// }
			// let url = this.$url.BASE_URL + "settleapi/api/receivable/machine/account/export";
			// console.log(url)
			// let filename = this.$gxfmethod.getFileName('设备营收统计-')
			// console.log(filename)
		},
		gotoOther(type, item) {
			switch (type) {
				case 'addwx':
					uni.navigateTo({
						url: '/devicePages/repair/create-repair?rwitem=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'addby':
					uni.navigateTo({
						url: '/devicePages/maintain/create-maintain?rwitem=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'addjx':
					uni.navigateTo({
						url: '/devicePages/hostling/create-service?rwitem=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'addxj':
					uni.navigateTo({
						url: '/devicePages/polling/create-polling?rwitem=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'connectwx':
					uni.navigateTo({
						url: './connect-repair?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'connectby':
					uni.navigateTo({
						url: './connect-maintain?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'connectjx':
					uni.navigateTo({
						url: './connect-hostling?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'connectxj':
					uni.navigateTo({
						url: './connect-polling?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'connectdcxj':
					uni.navigateTo({
						url: './connect-battery-polling?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'filter':
					this.showfileter = !this.showfileter;
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
	width: 100%;
	background: #ffffff;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.top-view {
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: 100;
	top: 0px;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
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
	display: flex;
	margin: 5px;
	padding: 8px 10px;
	flex-direction: row;
	padding-left: 10px;
	border-radius: 5px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
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
	margin: 5px;
	padding: 8px 10px;
	flex-direction: row;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	color: #222222;
	font-size: $uni-font-size-base;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 50px;
}

//列表
.list-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}

//列表cell
.list-view-cell {
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 5px;
	background: #ffffff;
	border-radius: 10px;
	padding: 5px 5px 10px 5px;
}

.item-head {
	display: flex;
	flex-direction: column;
}

.head-top {
	display: flex;
	flex-direction: row;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
}

.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-bottom: 4px;
	margin-top: 4px;
}

.item-text {
	margin-right: 2px;
	margin-left: 2px;
}

.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin-top: 5px;
	justify-content: center;
}

.cell-text-left {
	display: flex;
	min-width: 50px;
	margin-left: 10px;
	justify-content: flex-start;
	// align-items: center;
	font-size: $uni-font-size-base;
}

.cell-text-right {
	display: flex;
	flex: 1;
	margin-left: 5px;
	margin-right: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.fontBlackcolor {
	color: $uni-text-color;
}

.line-s {
	margin-top: 5px;
	margin-bottom: 5px;
	height: 1px;
	background: #eeeeee;
}

.fontsubcolor {
	color: $uni-text-color-gray;
	font-weight: normal;
}
.bottom-search {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 5px 0px;
	background: #ffffff;
	margin-bottom: 1px;
}
.bottom-search-top {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin: 10px;
	align-items: center;
	background: #ffffff;
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
.cellrightImg {
	font-size: $uni-font-size-base;
	margin-left: 5px;
	color: $uni-color-primary;
	text-align: center;
}
</style>
