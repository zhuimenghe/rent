<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="nav-bar">
			<nav-bar-search titleText="租赁记录" @change="searchChange" @clickBack="backPre" placeholder="请输入合同名称"></nav-bar-search>
		</view>
		<view class="rent-record-list">
			<view class="paddingView" :style="{height:`${headHeight}px`}"></view>
			<view class="rent-head">
				<view class="rent-item-weight-2">时间段</view>
				<view class="rent-item-weight-2">合同名称</view>
				<view class="rent-item-weight-3">营收（元）</view>
			</view>
			<view class="rent-content">
				<view class="rent-record-item" v-for="(r, i) in rentRecord" :key="i" 
				:style="{ background: r.state == 1 ? '#F5FFF6' : '#ffffff' }"
				@click="onClickItem(r)">
					<view class="rent-item-weight-2">
						<view class="start-date">{{ r.startDate }}</view>
						<view class="end-date">{{ r.endDate }}</view>
					</view>
					<view class="rent-item-weight-2">{{ r.contractName }}</view>
					<view class="rent-item-weight-3 last-grid">
						{{ r.earning }}
						<i class="iconfont iconarrow-right" style="padding-right: 8px;"></i>
					</view>
				</view>
			</view>
		</view>
		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import { mapState } from 'vuex';
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return{
				page: 1,
				pageTotal: 5,
				pageSize: 10,
				status: 'more',
				searchKey: "",
				rentRecord: [{
						startDate: '18/09/03',
						endDate: '--/--/--',
						contractName: '',
						earning: '10,000',
						state: 1
					},
					{
						startDate: '18/09/03',
						endDate: '18/10/03',
						contractName: '',
						earning: '-10,000',
						state: 0
					},
					{
						startDate: '18/09/03',
						endDate: '18/10/03',
						contractName: '',
						earning: '21,000',
						state: 0
					}
				]
			}
		},
		computed:{
			...mapState('system',{
				headHeight:s=>s.statusBarHeight+s.titleBarHeight
			})
		},
		onLoad() {
			this.getRentRecord();
		},
		methods: {
			backPre() {
				uni.navigateBack({
					delta: 1
				})
			},
			searchChange(val) {
				this.$datestr.printlog("searchChange=" + JSON.stringify(val))
				this.page = 1;
				this.pageSize = 100;
				this.records = [];
				this.searchKey = val.text;
				this.getAllotData();
			},
			getRentRecord(){
				this.status = "loading";
			
				let param = {
					"current": this.page,
					"size": this.pageSize,
					"businessKey": this.searchKey
				};
				this.$network.getData("", "POST", param).then((result) => {
					this.records = this.records.concat(result.records);
					let pages = result.pages;
					if (pages == this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
				}).catch((err) => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				})
			},
			//页面跳转
			onClickItem(item){
				
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			this.records = [];
			this.getRentRecord();
		},
		onReachBottom() {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.getRentRecord();
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	.nav-bar {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
	}

	.paddingView {
	}

	.rent-head {
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		padding: 16px;
		color: $uni-color-subtitle;
		font-size: $uni-font-size-base;
	}

	.rent-item-weight-2 {
		flex: 2;
	}

	.rent-item-weight-3 {
		flex: 3;
	}

	.rent-record-item {
		display: flex;
		flex-direction: row;
		margin-top: 1rpx;
		padding-left: 16px;
		background-color: #ffffff;
		align-items: center;
		padding-top: 4px;
		padding-bottom: 4px;
		font-size: $uni-font-size-base;
	}

	.last-grid {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
