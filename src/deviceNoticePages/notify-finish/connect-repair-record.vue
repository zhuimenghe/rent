<template>
	<view class="list-bg">
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view style="display: flex;flex: 1;flex-direction: column;">
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>维修单号</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.businessNo || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>维修状态</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.repairStateName || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>维修开始时间</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.startDate || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>维修结束时间</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.endDate || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>维修人</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.repairter || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="t-bottom">
						<view class="cell-text-right fontdetailcolor" style="margin-right: 20px;" @click="gotodetal(item)">详情</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
var timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		wPicker
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			oldList : [],
			morestatus: 'more',
			licenseKey:'',
			itemDic:{},
		};
	},
	onLoad(option) {
		if(option.item){
			this.itemDic = JSON.parse(decodeURIComponent(option.item))
			this.licenseKey = this.itemDic.licenseId;
			this.oldList = this.itemDic.businessList || []
		}
		uni.showLoading();
		this.loaddata();
	},
	methods: {
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
				businessNos:this.itemDic.businessNos
			};
			let url = this.$url.MACHINE_REPAIR_LIST;
			this.$network.getData(url, 'POST', param).then(result => {
				this.datalist = this.datalist.concat(result.records);
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
		//详情
		gotodetal(item) {
			let url = '/devicePages/repair/repair-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		}
	},
	onPullDownRefresh() {
		this.currentpage = 1;
		this.datalist = [];
		this.loaddata();
	},
	// onReachBottom() {
	// 	if (this.morestatus == 'noMore') {
	// 		return;
	// 	}
	// 	this.currentpage += 1;
	// 	this.morestatus = 'loading';
	// 	this.loaddata();
	// },
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	background: $uni-bg-color-grey;
}
//添加按钮
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
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
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
.filter-view-style{
	height: 35px;
	width: 60px;
	display: flex;
	background: $uni-color-primary;
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
	color: #FFFFFF;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	background: $uni-bg-color-grey;
	// margin-top: 55px;
	margin-top: 0px;
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
	border-radius: 5px;
}
.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
	margin: 5px 10px;
}
.cell-text-left {
	display: flex;
	flex: 1;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
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

.bottom-search{
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 5px 0px;
	background: #FFFFFF;
	margin-bottom: 1px;
}
.bottom-search-top{
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
.t-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	border-width: 1px 0px 0px 0px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
	padding-top: 10px;
	margin-right: 10px;
}
.checkbox {
	transform: scale(0.7);
	margin-right: 10px;
	margin-bottom: 10px;
}
.bottom-container {
	position: fixed;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	height: 72px;
	width: 100%;
	justify-content: space-between;
}
.confirm-btn {
	flex: 1;
	background-color: $uni-color-primary;
	margin: 16px 16px 16px 8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	border-radius: 4px;
	font-size: 14px;
}
</style>

