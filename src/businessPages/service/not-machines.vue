<template>
	<view class="content">
		<!-- <view class="abs-view">以下设备型号不符合订单需求</view> -->
		<list class="list-content" show-scrollbar="false">
			<cell v-for="(v,i) in list" :key="i">
				<view class="list-item">
					<view class="item-left">
						<view style="display: flex; align-items: flex-end;">
							<view class="licenseId">{{v.printCode||"-"}}</view>
							<view class="printCode" style="margin-left: 8px;">{{v.licenseId}}</view>
						</view>

						<view style="display: flex; margin-top: 4px;">
							
							<text class="printCode">{{v.typeName || '-'}}</text>
							<text class="vertical printCode">|</text>
							
							<text class="printCode">{{v.machineHeightName || '-'}}</text>
							<text class="vertical printCode">|</text>
						
						
							<text class="printCode">{{v.machineBrand || '-'}}</text>
							<text class="vertical printCode">|</text>

							<text class="printCode">{{v.machineTypeName || '-'}}</text>
							<!-- <text class="vertical printCode">|</text> -->

							<!-- <text class="printCode">{{v.driveTypeName || '-'}}</text> -->
						</view>

					</view>


				</view>
			</cell>
		</list>


    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	export default {
		name: 'not-machines',
		data() {
			return {
				list: []
			}
		},
		onLoad(option) {

			if (option.list) {
				this.list = JSON.parse(decodeURIComponent(option.list))
				console.log(this.list)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		flex-direction: column;
		display: flex;

	}

	.abs-view {
		display: flex;
		background-color: $uni-bg-color-grey;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		height: 60px;
		width: 100%;

	}

	.list-content {
		// margin-top: 60px;
		// margin-bottom: 56px;
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


	}

	.vertical {
		margin: 0 4px;
		font-weight: 600;
	}
</style>
