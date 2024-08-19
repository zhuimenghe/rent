<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<view style="display: flex;flex: 1;flex-direction: column;">
								<view>
									<text>检修单号:{{ item.businessNo || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{ item.stateName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>车号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.licenseId || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>自喷码</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.printCode || '-' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修状态</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text  :style="{color:item.checkOk ? '#4EC365' : '#FC0D2F'}">{{ item.checkOk ? "检修正常" : '检修异常' }}</text>
						</view>
					</view>
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>整备状态</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text :style="{color:item.prepare ? '#4EC365' : '#222831'}">{{ item.prepare ? "已整备" : '未整备' }}</text>
						</view>
					</view> -->
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退场时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.workOutTime || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.checkTime || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.checkUserName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerSalesmanName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>接机人员</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.deliveryUserName || '--' }}</text>
						</view>
					</view>
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>区域</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '--' }}</text>
						</view>
					</view> -->
					<view class="line-s" />
					<view class="t-bottom">
						<view class="cell-text-right fontdetailcolor" 
						@click="gotodetal(item)">详情</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
var timer;
export default {
	components: {
		filterView,
		uniLoadMore,
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
		};
	},
	onLoad(option) {
		this.searchKey = option.licenseId;
		uni.showLoading();
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
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		loaddata() {
			let param = {
				current: this.currentpage,
				size: 10,
				licenseId: this.searchKey
			};
			this.$network
				.getData(this.$url.STOCK_SERVICE_LIST, 'POST', param)
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
		gotodetal(item) {
			let url = './stock-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		}
	}
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
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 5px;
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
.t-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

</style>
