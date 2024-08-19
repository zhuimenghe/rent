<template>
	<view class="content">
			<image class="img" src="/static/image/developing.png"></image>
			<view class="text"> 功能正在开发中...</view>
		

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.img{
		height: 250px;
		width: 250px;
	}
	.text{
		margin-top: 16px;
		color: $uni-text-color-gray;
		font-size: $uni-font-size-lg;
		
	}
</style>
