<template>
	<view class="invoice-list-bg">
		<view class="add-container" @click="gotocreat">
		    <i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-view">
			<notifyQueryView  
			:isQueryTitle="false" 
			:isQueryNode="false" 
			:isQueryState="true" 
			:isControlShow='false'
			 hint="单号/标题/申请人" 
			  @query="query" 
			  @reset='reset' />
			<!-- <view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;" placeholder="请输入标题" @input="searchChange" />
					</view>
				</view>
			</view> -->
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<!-- taxNumber -->
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<view style="display: flex;flex: 1;flex-direction: column;">
								<view>
									<text>{{ item.approveName || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{ item.stateName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>审批单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.businessNo || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>申请时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ changestr(item.applicationTime)}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>申请人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.applicant || '--' }}</text>
						</view>
					</view>
					
					<view class="line-s" />
					<view class="cell-text-right fontdetailcolor" @click="gotodetail(item)"><text>详情</text></view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import notifyQueryView from '@/components/common/common-ui/notify-query-view.vue';
export default {
	components: {
		uniLoadMore,
		notifyQueryView
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			fuzzyParam: '',
			startDate: "",
			endDate: "",
			state:{}
		};
	},
	onLoad() {
		uni.showLoading();
		this.loaddata();
		uni.$on('refresh-approve-list', usnerinfo => {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		})
	},
	//下拉刷新
	onPullDownRefresh() {
		this.currentpage = 1;
		this.datalist = [];
		this.loaddata();
	},
	//上拉加载
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.currentpage += 1;
		this.morestatus = 'loading';
		this.loaddata();
	},
	methods: {
		query(val) {
			this.fuzzyParam = val.fuzzyParam;
			this.state = val.stateObj
			this.startDate = val.startDate
			this.endDate = val.endDate
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		reset() {
			this.state = {}
			this.fuzzyParam = '';
			this.startDate = ""
			this.endDate = ""
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		loaddata() {
			let param = {
				current: this.currentpage,
				size: 10,
			};
			if (this.fuzzyParam) {
				param = {
					...param,
					fuzzyParam:this.fuzzyParam
				}
			
			}
			if (this.state&&this.state.value) {
				param = {
					...param,
					state: this.state.value
				}
			}
			if (this.startDate) {
				param = {
					...param,
					startDate: this.startDate+' 00:00:00'
				}
			
			}
			if (this.endDate) {
				param = {
					...param,
					endDate: this.endDate+' 23:59:59'
				}
			
			}
			this.$network
				.getData(this.$url.COMMON_APPROVE_LIST, 'POST', param)
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
		searchChange(val) {
			this.searchKey = val.detail.value;
			this.currentpage = 1;
			this.datalist = [];
			uni.showLoading();
			this.loaddata();
		},
		gotocreat() {
			uni.navigateTo({
				url: './common-approve'
			});
		},
		gotodetail(item) {
			let businessNostr = item.businessNo;
			let url = './common-approve-detail?key=' + businessNostr;
			uni.navigateTo({
				url: url
			});
		},
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.invoice-list-bg {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	background: $uni-bg-color-grey;
}
//添加按钮
.add-container {
	position: fixed;
	display: flex;
	bottom: 32px;
	right: 16px;
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
.top-view{
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 0px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}
//搜索框
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}

.search-box {
	background: #F7F7F7;
	height: 35px;
	flex: 1;
	line-height: 35px;
	display: flex;
	margin: 8px 16px;
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
	background: #eeeeee;
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
}
.cell-text-left {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
	text-align: end;
	min-width: 72px;
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
.filter-container {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 299;
	background: #FFFFFF;
}
.condition-tag {
	color: $uni-text-color-gray;
	font-size: $uni-font-size-lg;
	margin-left: 20px;
}

.condition-select {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-top: 8px;
	padding-bottom: 8px;
	margin: 15px 20px 15px 20px;
	align-items: center;
}

.condition-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.clear {
	background-color: $uni-border-color;
	margin-right: 8px;
}

.confirm {
	background-color: $uni-color-primary;
	margin-left: 8px;
}
.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
	height: 40px;
}
</style>
