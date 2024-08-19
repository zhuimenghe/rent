<template>
	<view class="row-line-between item-content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view style="width: 90%;">
			<view class="row-line" style="line-height: 16px;width: 90%;">
				<view class="title-style" v-html="title||''"></view>
				<view class="sub-title" v-html="subTitle||''" v-if="subTitle"></view>
			</view>
			<view style="font-size: 12px;color: #999999;">
				<slot></slot>
			</view>
		</view>
		<view style="width: 10%;">
			<i class="iconfont icon-style iconarrow-right"></i>
		</view>
		

	</view>
</template>

<script>
	export default {
		props: {
			title: [String, Number],
			subTitle: String

		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.item-content {
		padding: 8px;
		font-size: 14px;
		color: #333333;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: 1px solid $uni-line-color;
		width: 100%;
	}

	.title-style {
		font-size: 14px;
		color: #333333;
		width: 100%;

	}

	.sub-title {
		font-size: 12px;
		color: #999999;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		padding-left: 4px;
		max-width: 50%;
	}


	.icon-style {
		font-size: 20px;
		color: #999999;
		text-align: center;
	}
</style>
