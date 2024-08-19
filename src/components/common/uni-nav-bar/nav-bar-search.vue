<template>
	<!--标题模板-->
	<view class="navbar-container" :style="{background:navBackgroundColor}">
		<view class="m-status-bar"  :style="{height:statusBarHeight+'px'}">
		</view>
		<view class="title-bar">
			<view class="title-option-left">
				<i v-if="showBack" class="iconfont title-back iconarrow-right" @tap="onClickBack"></i>
			</view>
			<view class="title-content">
				<view class="title-text" v-if="!isShowSearch"> {{titleText}}</view>
				<view class="search-container" v-if="isShowSearch">
					<view class="search-box">
						<i class="iconfont search-icon iconzl--sousuo"></i>
						<input class="search-content" :placeholder="placeholder" @input="inputChange" />
					</view>
				</view>
			</view>
			<view class="title-option-right" @click="isShowSearch=!isShowSearch">
				<view v-if="!isShowSearch">
					<i class="iconfont search-btn iconzl--sousuo"></i>
				</view>
				<view v-else>取消</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
	export default {
		name: 'UniNavBarSearch',
		data() {
			return {
				isShowSearch: false,
				defaultPlaceholder: this.$t('common.searchTip')
			}
		},
		props: {
			/**
			 * 是否显示返回按钮
			 */
			showBack: {
				type: Boolean,
				default: true
			},
			/**
			 * 标题
			 */
			titleText: {
				type: String,
				default: 'Rental Bay'
			},
			/**
			 * 标题栏背景色
			 */
			navBackgroundColor: {
				type: String,
				default: "#F9F9F9"
			},
			placeholder: {
				type: String,
				default: "请输入车号或自喷码"
			}
		},
		computed:{
			...mapState('system',{
				statusBarHeight:s=>s.statusBarHeight
			})
		},
		methods: {
			/**
			 * 返回点击事件
			 */
			onClickBack() {
				this.$emit('click-back')
			},
			inputChange(val) {
				this.$emit('change', val.detail.value)
			}
		}
	}
</script>

<style>
	.m-status-bar {
		width: 100%;
	}

	.title-bar {
		width: 100%;
		height: 44px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		line-height: 44px;
		color: #F9F9F9;
	}

	.title-option-left {
		margin-left: 15px;
		height: 44px;
		align-items: center;
		display: flex;
		flex-direction: row;
	}

	/**
	 * 返回
	 */
	.title-back {
		font-size: 30px;
		color: #000000;
		transform: rotate(180deg);
	}

	.title-content {
		display: flex;
		flex-direction: row;
		margin-right: 10px;
		height: 44px;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.title-text {
		font-size: 16px;
		color: #000000;
		font-weight: 500px;
		align-content: center;
	}

	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex: 1;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		width: 100%;
		line-height: 35px;
		display: flex;
		margin-left: 8px;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 4px;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: 14px;
	}

	.search-content {
		color: #999999;
		font-size: 14px;
		margin-left: 8px;
	}

	.title-option-right {
		display: flex;
		flex-direction: row;
		margin-right: 10px;
		height: 44px;
		font-size: 14px;
		color: #333333;
		align-items: center;
	}

	.search-btn {
		color: #999999;
		font-size: 20px;
	}
</style>
