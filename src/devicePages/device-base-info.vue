<template>
	<view class="base-info">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<i class="iconfont cell-top-image" :class="cartype[item.machineTypeId]  || ''" :style="{ color: item.machineTypeId == '0' ? '#4EC365' : '#4EC365' }">
			</i>
		<view class="info-container">
			<view class="license-id-view">
				{{item.licenseId}}
			</view>
			<view class="sub-title-container">
				<text class="sub-title-tag">型号</text>
				<text class="sub-title-value">{{item.machineTypeName||'--'}}</text>
				<text class="sub-title-tag">自喷码</text>
				<text class="sub-title-value">{{item.printCode||'-'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'deviceBaseInfo',
		props: {
			item: {
				type: Object,
				default () {
					return null
				}
			}
		},
		data() {
			return {
				cartype: {
					'3': 'iconzl--zhibiche1',
					'4': 'iconzl--jianchache2',
					'2': 'iconzl--qubiche',
					'1': 'iconzl--jianchache2'
				}
			};
		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped>
	.base-info {
		display: flex;
		flex-direction: row;
		align-items: center;

	}

	.info-container {
		display: flex;
		margin-top: 5px;
		margin-right: 15px;
		justify-content: flex-end;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.license-id-view {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		font-weight: bold;
	}

	.sub-title-container {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.sub-title-tag {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-xs;
	}

	.sub-title-tag {
		color: $uni-text-color-grey;
		font-size: $uni-font-size-sm;
		margin-left: 4px;
		margin-right: 16px;
	}
</style>
