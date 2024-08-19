<template>
	<view class="choose-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="filter-top-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input style="flex: 1;font-size: 14px;" placeholder="公司/联系人/手机号" v-model="searchKey" /></view>
			</view>
			<view class="filter-view-style" @click="searchTo"><text>搜索</text></view>
		</view>
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view @click="backToPre(item)">
					<view class="cell-view-part title-style">
						<text>{{ '物流公司:' + item.name }}</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{ '联系人:' + item.contacts }}</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{ '联系电话:' + item.phoneNum }}</text>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
	</view>
</template>
<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			datalist: [],
			page: 1,
			morestatus: 'more',
			typestr: '',
			searchKey: ''
		};
	},
	//下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.datalist = [];
		this.getdata();
	},
	//上拉加载
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.page += 1;
		this.morestatus = 'loading';
		this.getdata();
	},
	methods: {
		searchTo() {
			uni.showLoading();
			this.page = 1;
			this.datalist = [];
			this.getdata();
		},
		getdata(customid) {
			let param = {
				current: this.page,
				size: 20,
				businessKey: this.searchKey
			};
			this.$network
				.getData(this.$url.CONTRACT_LOGISTICS_COMPANY_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.page) {
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
		backToPre(item) {
			uni.$emit('pay-trans-emit', {
				dict: item,
			});
			uni.navigateBack({
				animationDuration: 200
			});
		}
	},
	onLoad(option) {
		if (option.type) {
			this.typestr = option.type;
		}
		this.getdata();
	}
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
}
.list-style {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-top: 50px;
}
.cell-style {
	display: flex;
	flex-direction: column;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	margin-left: 10px;
	margin-right: 10px;
	background: #ffffff;
}
.cell-view-part {
	display: flex;
	flex: 1;
	background: #ffffff;
	margin-left: 10px;
	justify-content: flex-start;
	margin: 5px;
}
.title-style {
	font-size: $uni-font-size-lg;
	color: $uni-text-color;
}
.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color-gray;
}
.filter-top-view {
	position: fixed;
	display: flex;
	flex-direction: row;
	top: 0;
	height: 50px;
	left: 0;
	right: 0;
	z-index: 100;
	background: #ffffff;
	overflow: hidden;
	align-items: center;
	justify-content: flex-start;
}

.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 50%;
	float: left;
	box-sizing: border-box;
}

.search-box {
	background: #F7F7F7;
	height: 35px;
	flex: 1;
	line-height: 35px;
	display: flex;
	margin: 8px 5px;
	flex-direction: row;
	padding-left: 5px;
	border-radius: 4px;
	justify-content: flex-start;
	align-items: center;
}

.search-icon {
	color: #999999;
	font-size: $uni-font-size-base;
	margin-right: 5px;
}

.search-content {
	display: flex;
	flex: 1;
	color: #999999;
	font-size: $uni-font-size-base;
	margin-left: 5px;
	margin-right: 10px;
}

.filter-view-style {
	height: 35px;
	display: flex;
	background: $uni-color-primary;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	font-size: $uni-font-size-base;
	color: #ffffff;
	padding-left: 10px;
	padding-right: 10px;
}
</style>
