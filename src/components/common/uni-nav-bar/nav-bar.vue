<template>
	<!--标题模板-->
	<view class="navbar-container" :style="{background:navBackgroundColor}">
		<view class="m-status-bar" :style="{height:statusBarHeight+'px'}">
		</view>
		<view class="title-bar">
			<view class="title-option-left">
				<i v-if="showBack" class="iconfont title-back iconarrow-right" @click="onClickBack"></i>
			</view>
			<view class="title-text">{{title}}</view>
			<view class="title-option-right" v-if="btns&&btns.length>0">
				<view v-for=" (btn,index) in btns" :key="index" class="btn-container" @click="clickOption(index,btn)">
					<i class="iconfont btn-view" v-if="btn.icon" :class="btn.text" :style="{color:btn.color?btn.color:'#333','font-size':btn.fontSize?btn.fontSize:'20px'}"></i>
					<view  v-else class="btn-view" :style="{color:btn.color?btn.color:'#333','font-size':btn.fontSize?btn.fontSize:'14px'}">{{btn.text}}</view>
					<view class="corner-view" v-if="btn.cornerNum&&Number(btn.cornerNum)>0">{{btn.cornerNum&&Number(btn.cornerNum)>99?'99+':btn.cornerNum}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
	export default {
		name: 'uniNavBar',
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
			title: {
				type: String,
				default: 'Rental Bay'
			},
			/**
			 * 标题栏背景色
			 */
			navBackgroundColor: {
				type: String,
				default: "#ffffff"
			},
			//按照以下格式数据传值
			btns: {
				type: Array,
				default: function() {
					return [
						// {
						// 		"text": "iconzl--zhuanzu1",
						// 		// "fontSize": "14px",
						// 		// "color": "#E60000",
						// 		cornerNum: '100',
						// 		icon: false
						// 	},
						// 	{
						// 		"text": "设置",
						// 		// "fontSize": "14px",
						// 		// "color": "#E60000",
						// 		cornerNum: 0,
						// 		icon: false
						// 	}
					]
				}
			}
		},
		data() {
			return {
				
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
				this.$emit('back')
			},
			/**
			 * 点击右侧按钮
			 * @param {Object} index 从左往右，0->
			 * @param {Object} btn
			 */
			clickOption(index,btn){
				this.$emit('clickRight',{
					index:index,
					detail:btn
				})
			}

		}
	}
</script>

<style>
	.navbar-container{
		z-index: 999;
	}
	.m-status-bar {
		width: 100%;
	}

	.title-bar {
		width: 100%;
		height: 44px;
		color: #fff;
		text-align: center;
		line-height: 44px;
		position: relative;
	}

	.title-text {
		color: #000000;
		font-size: 16px;
	}

	.title-option-left {
		position: absolute;
		top: 0px;
		left: 15px;
		height: 44px;
		color: #333;
		font-size: 16px;
	}

	.title-option-right {
		display: flex;
		flex-direction: row;
		position: absolute;
		top: 0px;
		right: 10px;
		height: 44px;
	}

	/**
	 * 返回
	 */
	.title-back {
		width: 12px;
		height: 20px;
		font-size: 20px;
	}

	.btn-container {
		display: flex;
		flex-direction: row;
	}

	.corner-view {
		background-color: #ff0000;
		color: #FFFFFF;
		border-radius: 50%;
		height: 20px;
		width: 25px;
		font-size: 12px;
		display: flex;
		line-height: 20px;
		flex-direction: row;
		justify-content: center;
		margin-left: -8px;

	}
	.btn-view{
		margin-left: 15px;
	}
</style>
