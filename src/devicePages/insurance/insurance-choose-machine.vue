<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="abs-view">
			<view class="list-head">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input :placeholder="$t('common.searchTip')" @input="searchChange"  :value="keyword" />
					</view>
				</view>
				<view class="search-btn" @click="searchData"> 搜索</view>
				<view class="clear-btn" @click="clearData"> 重置</view>
			</view>
		</view>
		<view class="list">
			<list class="list-content" show-scrollbar="false">
				<cell v-for="(v,i) in vehicles" :key="i" @click="changeCheckBox($event,i)">
					<view class="list-item">
						<view class="item-left">
							<view class="licenseId">车号:{{v.licenseId}}</view>
							<view class="printCode">自喷码:{{v.printCode||"-"}}</view>
						</view>

						<mycheckbox :checked="v.checked" class="checkbox"  color="#E60000"></mycheckbox>
					</view>
				</cell>
				<cell>
					<view>
						<uni-load-more iconType="auto" :status="status" />
					</view>
				</cell>
			</list>

		</view>
		<view class="confirm-container"><button class="confirm-btn" hover-class="confirm-btn-press" @tap="confirmChoose">{{$t('common.confirm')}}</button></view>


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
				page: 1,
				pageSize: 20,
				status: 'more',
				vehicles: [],
				chooseList: [],
				keyword: "",
			}
		},
		onLoad(options) {
			this.chooseList = JSON.parse(decodeURIComponent(options.chooseList));
			this.loadVehicleList();
		},
		methods: {
			searchChange(val) {
				this.keyword = val.detail.value.toUpperCase();
			},
			searchData() {
				this.page = 1; 
				this.loadVehicleList();
			},
			clearData() {
				this.keyword = "";
				this.page = 1;
				this.loadVehicleList();
			},
			loadVehicleList() {
				this.status = "loading";

				let param = {
					"current": this.page,
					"size": this.pageSize,
					"keyword": this.keyword,
				};
				uni.showLoading()
				this.$network.getData(this.$url.MACHINE_RECORD, "POST", param).then((result) => {
					uni.hideLoading()
					let list = result.records.map(o => {
						return { ...o,
							checked: this.chooseList.some(y => y.licenseId === o.licenseId) ||
								this.vehicles.some(v => v.checked && v.licenseId === o.licenseId)
						}
					})
					if (this.page == 1) {
						this.vehicles = list;
					} else {
						this.vehicles = this.vehicles.concat(list);
					}
					let pages = result.pages;
					if (pages <= this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
				}).catch((err) => {
					uni.hideLoading()
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				})
			},
			//获得选中设备
			getChooseVehicleNum() {
				return this.vehicles.filter(v => {
					return v.checked;
				})
			},
			//确定
			confirmChoose() {
				let chooseVehicles = this.getChooseVehicleNum();
				uni.$emit("choosedMachines", {
					data: chooseVehicles
				})
				uni.navigateBack({
					delta: 1
				})
			},
			//改变选中状态
			changeCheckBox(event, pos) {
				this.vehicles[pos].checked = !this.vehicles[pos].checked;
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateBack({
				delta: 1
			})
		},
		onPullDownRefresh() {
			this.page = 1;
			this.vehicles = [];
			this.loadVehicleList();
		},
		onReachBottom() {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.loadVehicleList();
		}
	}
</script>

<style lang="scss">
	.content {
		width: 100%;
		height: 100%;
		flex-direction: column;
		display: flex;

	}

	.abs-view {
		display: flex;
		background-color: $uni-bg-color-grey;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 300;
	}

	.top-container {
		background-color: #FFFFFF;
		flex-direction: row;
		display: flex;
		padding: 8px 16px 8px 16px;
		height: 82px;
		width: calc(100% - 2*16px);
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
	}

	.icon-vehicle {
		font-size: 72px;
		color: #E60000;
	}

	.pop-top-content {
		flex: 1;
		margin-left: 16px;
	}

	.close {
		font-size: 24px;
		color: #E9E9E9;
	}

	.view-black {
		color: #333333;
		font-size: 14px;
		font-weight: 500;
	}

	.choose-vehicle {
		color: #999999;
		font-size: 12px;
		margin-top: 4px;
	}

	.choose-assign-vehicle {
		color: #333333;
		font-size: 14px;
		font-weight: 500;
		flex-direction: row;
	}

	.choose-assign-vehicle_span {
		color: #E60000;
		font-size: 16px;
	}

	.list-head {
		flex-direction: row;
		justify-content: space-between;
		height: 48px;
		display: flex;
		width: 100%;
		align-items: center;
		background-color: #FFFFFF;
	}

	.search-box {
		background: #F7F7F7;
		height: 32px;
		flex: 1;
		line-height: 32px;
		display: flex;
		margin-left: 16px;
		margin-right: 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
	}

	.search-icon {
		color: #999999;
		font-size: 14px;
	}

	.search-content {
		color: #999999;
		font-size: 14px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 10px;
		padding-right: 10px;
		flex: 1;
	}

	.search-content input {
		flex: 1;
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

	.clear-btn {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		text-align: center;
		padding: 4px 8px;
		margin-right: 8px;
	}

	.list {
		margin-top: 56px;
		margin-bottom: 56px;
		background-color: #FFFFFF;

	}


	.list-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-width: 0px 0px 1px 0px;
		border-color: $uni-bg-color-grey;
		border-style: solid;
		padding: 8px 16px;
	}

	.item-left {
		display: flex;
		flex-direction: column;
	}

	.licenseId {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.printCode {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
		margin-top: 4px;

	}

	.checkbox {
		transform: scale(0.8);

	}

	.confirm-container {
		width: 100%;
		padding-top: 8px;
		padding-bottom:env(safe-area-inset-bottom);
		background-color: #f9f9f9;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 300;
	}

	.confirm-btn {
		margin-left: 32px;
		margin-right: 32px;
		height: 36px;
		color: #ffffff;
		background-color: #E60000;
		font-size: 14px;
		align-self: center;
	}

	.confirm-btn-press {
		margin-left: 32px;
		margin-right: 32px;
		height: 36px;
		color: #ffffff;
		background-color: #E60000;
		opacity: 0.5;
		font-size: 14px;
		align-self: center;
	}
</style>
