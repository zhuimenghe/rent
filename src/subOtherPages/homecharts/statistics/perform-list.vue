<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="menu-children-container" style="padding-top: 10px;">
			<view class="menu-children-item" v-for="(item,i) in menus" :key="i" @click="goTo(item.url)" v-if="item.isShow">
				<i class="iconfont childern-image":style="{color:item.color}" :class="item.icon"></i>
				<view class="childern-title">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//功能列表
				menus: [{
						title: '客户履约营收',
						icon: 'iconbiaoge',
						color: '#E60000',
						url: '/subOtherPages/homecharts/statistics/customer-overdue-list?revenueType=1',
						permission: 'customerPerform'
					},
					{
						title: '员工履约营收',
						icon: 'iconbiaoge',
						color: '#E60000',
						url: '/subOtherPages/homecharts/statistics/staff-revenue-list?revenueType=1',
						permission: 'staffPerform'
					},
					{
						title: '设备履约营收',
						icon: 'iconbiaoge',
						color: '#E60000',
						url: '/subOtherPages/homecharts/statistics/device-statistics-tab?revenueType=1',
						permission: 'machinePerform'
					},
					{
						title: '合同履约营收',
						icon: 'iconbiaoge',
						color: '#E60000',
						url: '/subOtherPages/homecharts/statistics/contract-revenue-info?revenueType=1',
						permission: 'contractPerform'
					}
				],
			}
		},
		onLoad() {
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
			this.menus = this.menus.map(o => {
				return {
					...o,
					isShow: ps && ps.some(x => x.value == o.permission)
				}
			})
		},
		methods: {
			goTo(url) {
				uni.navigateTo({
					url: url
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: $uni-bg-color-grey;
		height: 100%;
		position: relative;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		width: 85%;
		line-height: 35px;
		display: flex;
		margin-left: 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 16px;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: 14px;
	}

	.search-content {
		color: #999999;
		font-size: 14px;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.menu-item-container {
		margin: 8px;
		border-radius: 4px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: column;
		padding: 8px;
	}

	.menu-title-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding: 8px;
	}

	.title-icon-view {
		font-size: $uni-font-size-base;
		text-align: center;
	}

	.title-view {
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		font-weight: bold;
		margin-left: 8px;
	}

	.menu-children-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		background-color: #FFFFFF;
	}

	.menu-children-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 33%;
		justify-content: center;
	}

	.childern-image {
		width: 35px;
		height: 35px;
		color: $uni-color-primary;
		font-size: 30px;
	}

	.childern-image-lg {
		width: 35px;
		height: 35px;
		color: $uni-color-primary;
		font-size: 30px;
		padding: 8px;
		background-color: #f5e4e5;
		border-radius: 4px;
	}

	.childern-title {
		font-size: $uni-font-size-base;
		margin-top: 8px;
		margin-bottom: 20px;
		color: $uni-text-color;
	}

	.empty-view {
		width: calc(100% - 16px);
		padding: 8px;
		border-top: 1px solid $uni-bg-color-grey;
		color: $uni-text-color-gray;
		text-align: center;
		font-size: 14px;
	}

	//添加按钮
	.add-container {
		position: fixed;
		display: flex;
		bottom: 32px;
		right: 16px;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		box-shadow: 0px 0px 10px #E60000;
		justify-content: center;
		align-items: center;
		background-color: $uni-color-primary;
	}

	.labelstyle {
		color: #ffffff;
		font-size: 30px;
		font-weight: bold;
	}

	.pop-container {
		position: relative;
		z-index: 999;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		border-radius: 4px;
	}

	.tip-title {
		width: 100%;
		text-align: center;
		padding: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}


	.pop-gird-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
	}

	.pop-gird {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100px;
		height: 80px;
		justify-content: center;
		font-size: $uni-font-size-base;
		margin-top: 4px;
	}

	.pop-gird-image {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		text-align: center;
		padding: 8px;
	}

	.img {
		height: 50px;
		width: 50px;
	}

	.tip-image {
		font-size: 30px;
		color: $uni-color-primary;
	}

	.tip-bottom {
		width: 100%;
		padding-top: 10px;
		margin-top: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-top: 1px solid #efefef;
		font-size: 16px;
	}
</style>
