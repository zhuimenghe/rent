<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<flexibleQueryView
				:isExportList="false"
				hint="物料号/型号/名称/类别"
				:isQuerySalesman="false"
				:isQueryOrg="true"
				:isQueryTime="true"
				orgHint="出库区域"
				@reset="reset"
				@query="query"
			/>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index" >
					<view style="display: flex;flex-direction: column;" @click="chooseItem(item)">
						<view class="cell-text">
							<view class="cell-text-left fontBlackcolor" style="color: #000000;">
								<view style="display: flex;flex: 1;flex-direction: column;font-weight: bold;">
									<view>
										<text>{{ item.businessNo || '--' }}</text>
									</view>
								</view>
							</view>
							<view class="cell-text-right fontgreencolor">
								<text>{{ item.stateName || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>出库时间</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ changestr(item.collarTime) || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>出库数量</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>共{{ item.partsType || '--' }}种/{{ item.receivingQuantity || '-' }}个</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>出库区域</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.orgName || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>领用人</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.leaderName || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="line-s" />
					<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;align-items: center;">
						<view class="bottom-text-right fontdetailcolor" @click="gotodetail(item)">
							<text>详情</text>
						</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
		<w-picker 
		:selectList="selectList" 
		@confirm="dialog" 
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
		:disabledAfter="true" 
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
let timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		labelArrow,
		wPicker,
		badgeview,
		taskBtn,
		flexibleQueryView
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			isShowAdd: true,
			selectList: [],
			areaCode: {},
			inassginDic: {},
			selectType: '',
			showfilter: false,
			startTime: '',
			endTime: '',
			userid: '',
			isExportList: true,
			totalCount: '100'
		};
	},
	onLoad(option) {
		uni.showLoading()
		this.loaddata();
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
		chooseItem(item){
			uni.$emit('choose-receive-no',item);
			uni.navigateBack({
				animationDuration:200
			})
		},
		reset(val) {
			this.searchKey = '';
			this.startTime = '';
			this.endTime = '';
			this.areaCode = {};
			this.headerrefresh();
		},
		query(val) {
			this.searchKey = val.fuzzyParam;
			this.areaCode = val.orgObj;
			this.startTime = val.startDate;
			this.endTime = val.endDate;
			this.headerrefresh();
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		saveTwo(num) {
			return this.$datestr.doubleFloat(num);
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
			let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
			let userId = resData.id;
			let param = {
				current: this.currentpage,
				size: 10,
				state:'4',
				createBy:userId,
				likeName: this.searchKey === '' ? undefined : this.searchKey,
				orgId: this.areaCode && this.areaCode.value ? this.areaCode.value : undefined,
				startTime: this.startTime ? this.startTime + ' 00:00:00' : undefined,
				endTime: this.endTime ? this.endTime + ' 23:59:59' : undefined
			};
			this.$network
				.getData(this.$url.ACC_RECEIVE_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totalCount = result.total;
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		gotodetail(item) {
			let url = '../acc-receive/acc-recelive-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		},
		showpick(type) {
			this.selectType = type;
			if (type === 'area') {
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'rkr') {
				this.selectList = this.inassginArr;
				this.$refs.selector.show();
			} else {
				this.$refs.date.show();
			}
		},
		dialog(val) {
			if (this.selectType === 'area') {
				this.areaCode = val.checkArr;
			} else if (this.selectType === 'rkr') {
				this.inassginDic = val.checkArr;
			}
		},
		onConfirm(val) {
			if (this.selectType === 'starttime') {
				this.startTime = val.result;
			} else {
				this.endTime = val.result;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	width: 100%;
	background: $uni-bg-color-grey;
}

//添加按钮
.add-container {
	position: fixed;
	display: flex;
	bottom: 50px;
	right: 20px;
	height: 50px;
	width: 50px;
	border-radius: 50%;
	box-shadow: 0px 0px 10px #E60000;
	justify-content: center;
	align-items: center;
	background-color: $uni-color-primary;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.top-view {
	z-index: 300;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
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
	background: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}

.search-box {
	background: #F7F7F7;
	height: 35px;
	flex: 1;
	line-height: 35px;
	display: flex;
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
	margin-right: 10px;
}

//筛选父视图
.filter-view-style {
	height: 35px;
	display: flex;
	background: $uni-color-primary;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
}

//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 55px;
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
}

.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.cell-text-left {
	display: flex;
	min-width: 50px;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}

.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-right: 15px;
	margin-left: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.fontBlackcolor {
	color: $uni-text-color;
}

.fontdetailcolor {
	color: $uni-color-primary;
	margin-bottom: 10px;
}

.fontgreencolor {
	color: #4cd964;
}

.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
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

.bottom-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
	margin-left: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.export-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	background: #FFFFFF;
	border-radius: 4px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	border: 1px solid $uni-color-primary;
}
</style>
