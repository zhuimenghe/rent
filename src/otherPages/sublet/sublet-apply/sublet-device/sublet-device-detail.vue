<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="content-container">
			<view class="sum-view-bg">
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<view class="item-head">
							<view class="head-top">
								<view>{{dataDic.licenseId||"--"}}</view>
								<!-- <input type="text" v-model="dataDic.licenseId" placeholder="请输入车号"/>
								<text style="font-size: 12px;color: #aaa;margin-left: 8px;font-weight:400">（可编辑）</text> -->
							</view>
							<view class="head-bottom">
								<text>{{ dataDic.typeName || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.heightName || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.brand || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.machineTypeName || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ dataDic.subletStateName || '--' }}</text>
					</view>
				</view>
				<view class="line-s" />
				<view class="cell-input-view" @click="gotoDetail">
					<view class="cell-input-view-left">
						<text>转租单号</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style" style="color: #E60000;">{{ dataDic.businessKey || '--' }}</text>
					</view>
					<i class="iconfont iconarrow-right" style="color: #E60000;"></i>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>转租公司</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">
							{{dataDic.subletCompanyName || '--'}}
						</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>车身喷码</text>
					</view>
					<view class="cell-input-view-right">
						<view class="input-style">
							{{dataDic.printCode||'-'}}
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>启用日期</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">
							{{ getDate(dataDic.subletDate) }}
						</text>
					</view>
				</view>
				<select-label-item tagName="起租日期" :isSelect="false" :value="getDate(dataDic.actualSubletDate)" />
				<select-label-item tagName="还租日期" :isSelect="false" :value="getDate(dataDic.rentBackDate)" />
				<text-label-item tagName="备注" :inputDisabled="true" :inputValue="dataDic.remark" />
			</view>
		</view>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
		},
		data() {
			return {
				dataDic: {
				},
			};
		},
		onLoad(option) {
			if (option.licenseId) {
				this.getDetail(option.licenseId)
			}
		},
		methods: {
			//时间
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getDetail(licenseId) {
				this.$network.getData(this.$url.SUBLET_DEVICE_DETAIL, 'GET', {
					licenseId: licenseId
				}).then(result => {
					this.dataDic = result?result:{}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.message ? err.message : err.details[0]
					});
				});
			},
			//=--------
			gotoDetail() {
				let businessNostr = this.dataDic.businessKey;
				let url = '../sublet-apply-detail?businessNo=' + businessNostr;
				uni.navigateTo({
					url: url
				});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}

	.content-container {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		flex: 1;
		// margin: 10px;
		background: #ffffff;
		// border-radius: 4px;
		padding-bottom: 10px;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin: 10px;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-left {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
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

	.bottom-view {
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 60px;
		justify-content: flex-end;
		flex-direction: row;
		align-items: center;
		background: #ffffff;
		z-index: 100;
	}

	.bottom-left-view {
		display: flex;
		flex: 1;
		height: 40px;
		border-radius: 20px;
		background: $uni-bg-color-grey;
		font-size: $uni-font-size-lg;
		color: $uni-color-primary;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
		margin-left: 10px;
	}

	.bottom-right-view {
		display: flex;
		flex: 1;
		height: 40px;
		border-radius: 20px;
		background: $uni-color-primary;
		font-size: $uni-font-size-lg;
		color: #ffffff;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}

	.item-head {
		margin-top: 10px;
	}

	.head-top {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		font-weight: bold;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.head-bottom {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		margin-bottom: 4px;
		margin-top: 4px;
	}

	.line-s {
		margin-top: 10px;
		margin-bottom: 10px;
		height: 1px;
		background: #eeeeee;
	}
</style>
