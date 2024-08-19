<template>
	<view class="choose-bg-view">
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view @click="backToPre(item)">
					<view class="cell-view-part title-style">
						<text>{{ item.customerName || '' }}-{{ item.projectName? item.projectName : '' }}-合同</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{ item.customerSalesmanName||'-' }}</text>
					</view>
				</view>
			</cell>
			<cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</cell>
		</list>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		props: {
			//是否第一次选择
			isFirst: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				datalist: [],
				page: 1,
				morestatus: 'loading',
			};
		},

		created() {
		},
		methods: {
			headerrefresh(customerSalesmanName, customerName, projectName) {
				this.page = 1;
				this.datalist = [];
				this.getdata(customerSalesmanName, customerName, projectName);
			},
			footerrefresh(customerSalesmanName, customerName, projectName) {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.page += 1;
				this.morestatus = 'loading';
				this.getdata(customerSalesmanName, customerName, projectName);
			},
			getdata(customerSalesmanName, customerName, projectName) {
				let param = {
					current: this.page,
					size: 20,
					customerName: customerName ? customerName : undefined,
					customerSalesmanName: customerSalesmanName ? customerSalesmanName : undefined,
					projectName: projectName ? projectName : undefined,
					isApplyQuery:true//申请对账选择合同
					
				};
				uni.showLoading();
				this.$network
					.getData(this.$url.SETTLE_CONTRACT_LIST, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result && result.records && result.records.length > 0 ? result.records : []);
						let pages = result.pages;
						if (pages <= this.page) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						uni.hideLoading();
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						uni.hideLoading();
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
					});
			},

			backToPre(item) {
				//第一次选合同后，去对应的业务新建页面
				if (this.isFirst) {
					uni.redirectTo({
						url: '/businessPages/settle-apply/contract/application-contract-create?contract=' + encodeURIComponent(JSON.stringify(
							item)) 
					})
				} else {
					uni.$emit('choose-contract-emit', {
						dict: item
					});
					uni.navigateBack({
						animationDuration: 200
					});
				}
			},

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
		margin-top: 8px;
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

	.top-search-view {
		position: fixed;
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		background: #ffffff;
		justify-content: center;
		align-items: center;
		z-index: 991;
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
		z-index: 955;
	}

	.text-style {
		font-size: $uni-font-size-base;
	}
</style>
