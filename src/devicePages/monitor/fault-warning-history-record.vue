<template>
	<view class="fault-content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="tag">
			<view class="tag-title">{{filtrateNum}}</view>
			<filter-view @clickFilter="isShow = !isShow" backgroundColor="#ffffff" 
					textColor="#222222"  :isExpendArrow="isShow"></filter-view>
		</view>
		<view style="background: #F5F4F9;height: 1rpx;width: 100%;"></view>
		<view class="filter-life-view" v-if="isShow">
			<selector 
			:defaultIndex="selectIndex"
			@change="filterChange" 
			:list="filterlist" 
			column="col_2" 
			ref="filterSelect" 
			type="radio" 
			style="width: 100%;padding: 8px 16px 0px 16px;" />
		</view>
		<view class="fault-list-container">
			<view class="fault-item" v-for="(record, index) in faultReocrd" :key="index">
				<i class="iconfont r-icon iconzl--guzhang" style="color: #FE4D01;" v-if="record.type == 'fault'"></i>
				<i class="iconfont r-icon iconzl--baojing" style="color: #F9AC13;" v-else></i>
				<view class="r-right">
					<view class="r-info">{{ record.action || "--"}}</view>
					<view class="r-addr">{{ record.address || "--" }}</view>
					<view class="r-time">{{ record.warningTime || "--" }}</view>
				</view>
			</view>
		</view>
		<view><uni-load-more iconType="auto" :status="status" /></view>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import selector from '@/components/common/selector/selector.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
export default {
	components: {
		filterView,
		selector,
		uniLoadMore
	},
	data() {
		return {
			page: 1,
			pageSize: 10,
			status: 'more',
			selectIndex:0,
			filterlist: [
				{
					id: 0,
					text: '故障',
				},
				{
					id: 1,
					text: '预警',
				}
			],
			isShow: false,
			faultReocrd: [],
			filtrateNum:"",
			liceseid:"",
			type:""
		};
	},
	onLoad(option) {
		this.licenseId = option.licenseId;
		this.getReordData("");
	},
	methods: {
		//筛选点击
		filterChange(e,index) {
			this.selectIndex = index;
			//1报警2预警
			this.type = index + 1;
			this.isShow = !this.isShow;
		},
		//获取数据
		getReordData(type) {
			let urlstr = this.$url.MACHINE_MONITOR_MAFUNCTINFOLIST;
			let queryDic = {};
			if(type == ""){
				queryDic = {
					current: this.page,
					size: this.pageSize,
					licenseId:this.licenseId
				};
			}else{
				queryDic = {
					current: this.page,
					size: this.pageSize,
					licenseId:this.licenseId,
					type:type
				};
			}
			this.$network
				.getData(urlstr, 'POST', queryDic)
				.then(result => {
					this.faultReocrd = this.faultReocrd.concat(result.records);
					let pages = result.pages;
					let total = result.total;
					this.filtrateNum = '全部:' + "( " + total + " )";
					
					if (pages == this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				});	
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.faultReocrd = [];
		this.status = 'loading';
		this.getReordData(this.type);
	},
	onReachBottom() {
		if (this.status == 'noMore') {
			return;
		}
		this.page += 1;
		this.getReordData(this.type);
	}
};
</script>

<style lang="scss" scoped>
.fault-content {
	width: 100%;
	height: 100%;
	background: $uni-bg-color-grey;
	display: flex;
	flex-direction: column;
	position: relative;
}

.tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: #ffffff;
	position: fixed;
	align-items: center;
	top: 0;
	left: 0;
	width: 100%;
}

.tag-title {
	color: $uni-text-color;
	margin: 10px 10px 10px 10px;
	font-size: $uni-font-size-base;
}

.filter-life-view {
	display: flex;
	width: 100%;
	background: #ffffff;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 44px;
	left: 0;
}

.fault-list-container {
	margin-top: 52px;
}

.fault-item {
	display: flex;
	flex-direction: row;
	margin: 0px 8px 4px 8px;
	background: #ffffff;
	padding: 16px 8px;
	border-radius: 4px;
}

.r-icon {
	font-size: 40px;
}

.r-right {
	display: flex;
	flex-direction: column;
	margin-left: 8px;
}

.r-info {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.r-addr {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
	margin: 2px 0px;
}

.r-time {
	font-size: $uni-font-size-xs;
	color: $uni-text-color-disable;
}
</style>
