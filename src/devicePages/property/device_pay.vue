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
			<view class="cell-input-view" style="padding: 10px 0px;">
				<view class="cell-input-view-left"><text>总计</text></view>
				<view class="cell-input-view-right"  style="color: #E60000;" @click="isshowPay = !isshowPay">
					<text class="input-style" >¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="cell-input-view" v-if="isshowPay">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>保险支出</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="text-align: left;">¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>物流支出</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="text-align: left;">¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					</view>
				</view>
			</view>
			<view class="cell-input-view" v-if="isshowPay">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>维修支出</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="text-align: left;">¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>保养支出</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="text-align: left;">¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					</view>
				</view>
			</view>
			<view class="cell-input-view" v-if="isshowPay">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>其他支出</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="text-align: left;">¥{{moneyUtil.dealNumber(payDic.total).toString()}}</text>
					</view>
				</view>
				<view class="cell-input-view"/>
			</view>
		</view>
		<list style="margin-top: 80px;">
			<cell class="list-view-cell" v-for="(item,index) in dataList" :key="index">
				<view class="car-message-view">
					<view class="icon-car-right-top">
						<text style="margin-right: 5px;">{{item.printCode || "--"}}</text>|<text style="margin-left: 5px;">{{item.licenseId || "--"}}</text>
					</view>
					<view class="icon-car-right-bottom">
						<text>{{ item.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ item.machineHeightDesc || '--' }}&nbsp;|&nbsp;{{ item.machineBrand || '--' }}&nbsp;|&nbsp;{{item.machineTypeName || '--'}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" >{{item.orgName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>出厂日期</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" >{{item.orgName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>采购价格</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>保险支出</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>物流支出</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>维修支出</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>保养支出</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>其他支出</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(dataList.total).toString()}}</text>
						</view>
					</view>
				</view>
				<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
				<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
					<view class="all-records-view" @click="gotoDetail(item,index)">
						<text>详情</text>
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
			dataList:[],
			selectList:[],
			isExportList: true,
			isshowPay:false,
			payDic:{
				total:100000000
			}
		}
	},
	methods: {
		gotoDetail(item,index){
			
		},
		loadData(){
			
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
		reset(val) {
			// this.searchKey = "";
			// this.orgObj = {};
			// this.salesmanObj = {};
			// this.stateObj = {};
			// this.currentpage = 1;
			// this.datalist = [];
		},
		query(val) {
			
		},
		exportExcel() {
			uni.showLoading({
				title: '正在下载中,请稍等...',
				mask: true,
			})
			let param = {
			};
			let url = this.$gxfmethod.getUrl(this.$url.WORK_IN_PAGE)
			console.log(url)
			let filename = this.$gxfmethod.getFileName("设备营收列表-")
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
	padding: 5px 0px;
	margin: 0px 5px;
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
	margin-left: 10px;
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
	margin-top: 5px;
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
