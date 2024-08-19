<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<searchHeader 
			:isExportList='isExportList' 
			@reset='reset' 
			@query="query" 
			@exportExcel="exportExcel"
			/>
		</view>
		<list style="margin-top: 40px;">
			<cell class="list-view-cell" v-for="(item,index) in dataList" :key="index">
				<view class="car-message-view">
					<view class="icon-car-right-top">
						<text style="margin-right: 5px;">{{item.printCode || "--"}}</text>|<text style="margin-left: 5px;">{{item.licenseId || "--"}}</text>
					</view>
					<!-- <view class="icon-car-right-bottom">
						<text>{{ item.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ item.machineHeightDesc || '--' }}&nbsp;|&nbsp;{{ item.machineBrand || '--' }}&nbsp;|&nbsp;{{item.machineTypeName || '--'}}</text>
					</view> -->
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>采购价格</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.machineMillPrice).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>首付</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.firstPay).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>融资额</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.financeMoney).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>管理费</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.manageExpense).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>月还款额</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.repayMoneyEach).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>还款期数</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >{{item.repayNumber || '0'}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>初次还款日期</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >{{getDate(item.firstRepayDate)}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>融资成本</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.financePrice).toString()}}</text>
						</view>
					</view>
				</view>
				<view style="height: 1px;flex: 1;background: #EEEEEE;margin-top: 10px;"  v-if="isShowAdd"/>
				<view style="display: flex;flex-direction: row;margin-bottom: 10px;justify-content: flex-end;"  v-if="isShowAdd">
					<view class="all-records-view" @click="updataMsg(item,index)">
						<text>修改</text>
					</view>
				</view>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import searchHeader from './property_search.vue'
export default {
	components: {
		uniLoadMore,
		searchHeader
	},
	data() {
		return {
			morestatus: 'more',
			page: 1,
			keyWord:'',
			dataList:[],
			isExportList: true,
			isShowAdd:true,
			totalNum:'100'
		}
	},
	onPullDownRefresh() {
		this.headerrefresh()
	},
	onReachBottom() {
		this.footerrefresh();
	},
	onLoad() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_FINANCING_DEVICE);
				// //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		})
		uni.$on('refresh-financing-list', obj => {
			this.headerrefresh()
		});
		uni.showLoading();
		this.loadData();
	},
	methods: {
		updataMsg(item,index){
			uni.navigateTo({
				url:"./updata-financing?item=" + encodeURIComponent(JSON.stringify(item))
			})
		},
		loadData(){
			let parame = {
				current: this.page, 
			    size: 10 ,
				keyWord:this.keyWord
			};
			this.$network.getData(this.$url.MACHINE_FINANCE_LIST, 'POST', parame).then(result => {
				this.dataList = this.dataList.concat(result.records);
				let pages = result.pages;
				let total = result.total;
				if (pages <= this.page) {
					this.morestatus = 'noMore';
				} else {
					this.morestatus = 'more';
				}
				this.totalNum = result.total.toString()
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}).catch(err => {
				this.morestatus = 'noMore';
				uni.stopPullDownRefresh();
				uni.hideLoading();
			});
		},
		headerrefresh() {
			this.page = 1;
			this.dataList = [];
			this.loadData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.morestatus = 'loading';
			this.loadData();
		},
		getDate(time) {
			if (!time) {
				return "--";
			}
			return time.split(/\s+/)[0];
		},
		reset(val) {
			
		},
		query(val) {
			this.keyWord = val.searchKey;
			this.headerrefresh();
		},
		exportExcel() {
			uni.showLoading({
				title: '正在下载中,请稍等...',
				mask: true,
			})
			let param = {
				current : 1,
				size : this.totalNum,
				keyWord:this.keyWord
			};
			let url = this.$gxfmethod.getUrl(this.$url.MACHINE_FINANCE_LIST)
			console.log(url)
			let filename = this.$gxfmethod.getFileName("融资管理列表-")
			this.$gxfmethod.downFunc(url, 'POST', param, filename)
		}
	}
};
</script>

<style lang="scss" scoped>
.bg-view {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}	
.list-view-cell{
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #FFFFFF;
	margin-top: 5px;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}
.car-message-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}
.icon-car-right-top{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-bottom{
	display: flex;
	margin-top: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}
.icon-car-right-top-arrow{
	font-size: 15px;
	margin-left: 10px;
	color: $uni-text-color-gray;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 5px 10px;
	font-size: $uni-font-size-base;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 15px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}
.all-records-view{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	margin-top: 10px;
}
.top-view {
	z-index: 300;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 0;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
}
</style>
