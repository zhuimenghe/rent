<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="item-container" @click="choose(item)" v-for="(item, index) in datalist" :key="index">
			<view>
				<view class="item-title">{{item.itemNumber}}</view>
				<view class="item-subtext">型号规格:{{item.partsBasics.category||'-'}}</view>
				<view class="item-subtext">区域:{{item.orgName||'-'}}</view>
				<view class="item-subtext">备注:{{item.partsBasics.remark||'-'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'more',
				basicsId: ''

			};
		},
		onLoad(option) {
			this.basicsId = option.basicsId ? option.basicsId : ''
			uni.showLoading();
			this.loaddata();
		},
		onPullDownRefresh() {
			this.headerrefresh();
		},

		methods: {
			choose(item) {
				uni.$emit('choose-material', item)
				uni.navigateBack({
					delta: 1
				})

			},
			headerrefresh() {
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			loaddata() {
				let param = {
					basicsId: this.basicsId
				};
				this.$network
					.getData(this.$url.ACC_MATERIAL_LIST, 'GET', param)
					.then(result => {
						this.datalist = result ? result : []

						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details[0] ? err.details[0] : err.message
						})
					});
			},

		}
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		background: $uni-bg-color-grey;
	}

	.item-container {
		padding: 8px;
		border-bottom: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
		background-color: #FFFFFF;
		width: calc(100% - 16px);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.item-title {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		font-weight: bold;
	}

	.item-subtext {
		font-size: $uni-font-size-base;
		color: $uni-text-color-gray;
		margin-top: 4px;
	}
</style>
