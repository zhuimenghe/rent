<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="请输入自喷码或者车号" @input="searchTo" /></view>
			</view>
			<view class="search-btn" @click="searchData"> 搜索</view>
		</view>
		<list style="margin-top: 50px;">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="list-view-cell" @click="chooseThisCar(item,index)">
					<view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>车号</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{ item.licenseId || '--' }}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>自喷码</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{ item.printCode || '-' }}</text>
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;" />
				</view>
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
				keyWord: '',
			};
		},
		onLoad() {},
		methods: {
			//搜索
			searchTo(val) {
				this.keyWord = val.detail.value
			},
			searchData() {
				if (!this.keyWord) {
					uni.showToast({
						icon: 'none',
						title: '请输入车号或自喷吗查询'
					})
					return;
				}
				this.datalist = [];
				this.getNetData();
			},
			//选中设备
			chooseThisCar(item, index) {
				let url = "./create-maintain?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: url
				})

			},
			//获取数据
			getNetData() {
				uni.showLoading();
				let urlStr = this.$url.SEARCH_MAINTAIN_MACHINE.replace(/{keyWord}/, this.keyWord)
				this.$network.getData(urlStr, "GET", null).then((result) => {

					this.datalist = result;
					if (!this.datalist || this.datalist.length <= 0) {
						uni.showToast({
							icon: 'none',
							title: '暂无查询数据'
						})
					}

					uni.hideLoading();
				}).catch((err) => {
					uni.hideLoading();
				})
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

	.list-view-cell {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: #ffffff;
		border-bottom-style: solid;
		margin-top: 5px;
		margin-bottom: 5px;
		border-bottom-color: #eeeeee;
		border-bottom-width: 1px;
	}

	.car-message-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-left: 15px;
		margin-right: 15px;
		margin-top: 10px;
		margin-bottom: 10px;
		font-size: $uni-font-size-base;
	}

	.icon-car {
		font-size: 40px;
	}

	.icon-car-right {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.icon-car-right-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	.icon-car-right-top-arrow {
		font-size: 15px;
		margin-left: 10px;
		color: $uni-text-color-gray;
	}

	.icon-car-right-bottom {
		display: flex;
		margin-top: 5px;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		margin-left: 10px;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		background: #ffffff;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		margin-top: 5px;
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
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.input-style {
		flex: 1;
		text-align: right;
	}

	.all-records-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		margin-right: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.all-records-arrow {
		font-size: 15px;
		margin-left: 10px;
		color: $uni-color-primary;
	}

	.top-search-view {
		position: fixed;
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		background: #ffffff;
		justify-content: space-between;
		align-items: center;
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
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	.search-btn {
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		border-radius: 4px;
		text-align: center;
		padding: 4px 8px;
		margin-right: 8px;
	}

	.filter-view-style {
		height: 35px;
		width: 60px;
		display: flex;
		background: #eeeeee;
		font-size: 15px;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
	}
</style>
