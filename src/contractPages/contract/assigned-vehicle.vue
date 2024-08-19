<template>
	<view class="content">
		<list class="list-content" show-scrollbar="false">
			<cell v-for="(v,i) in machineList" :key="i">
				<view class="list-item">
					<view class="licenseId">车号:{{v.licenseId}}</view>
					<view class="printCode">自喷码:{{v.printCode||"-"}}</view>
				</view>
			</cell>
		</list>

    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				machineList: [], //已指定的设备
			}
		},
		onLoad(options) {
			this.machineList = JSON.parse(decodeURIComponent(options.machineList));
		},
		methods: {
		},
		onNavigationBarButtonTap() {
			uni.navigateBack({
				delta:1
			})
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		flex-direction: column;
		display: flex;
		background-color: $uni-bg-color-grey;

	}

	.list-content {
		// flex: 1;
		// bottom: 0px;

	}

	.list-item {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-width: 0px 0px 1px 0px;
		border-color: $uni-bg-color-grey;
		background-color: #FFFFFF;
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
