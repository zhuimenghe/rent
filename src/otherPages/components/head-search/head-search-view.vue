<template>
	<view>
		<view class="status-bar" :style="'height:'+statusBarHeight+'px'"></view>
		<view class="search-container"  :style="{height:titleBarHeight+'px',marginRight:barMarginRight+'px'}">
			<slot name="left"></slot>
			<view class="search-box" :style="{'margin-left':isSlotLeft?'0px':'8px'}">
				<view style="height: 35px;line-height: 35px;">
					<i class="iconfont iconzl--sousuo"></i>
				</view>
				<view class="search-content">
					<!--设置键盘右下角按钮的文字，仅在 type="text" 时生效。-->
					<input v-if="!disabled" style="flex: 1;padding-right: 8px;font-size: 14px;" :focus="focus" :placeholder="placeholder"
					 v-model="inputText" type="text"  confirm-type="search" @confirm='searchChange' />
					<view v-else @click="goToSearch" style="flex: 1;">
						{{placeholder}}
					</view>
					<i class="iconfont img-view iconzl--cuowu"  v-if="!disabled&&inputText"  @click="deleteInput"></i>
				</view>
			</view>
			<slot name="right"></slot>
		</view>
		<slot name="bottom"></slot>
	</view>

</template>

<script>
	import {mapState} from 'vuex';
	export default {
		props: {
			placeholder: {
				type: String,
				default: '请输入'
			},
			//搜索框是否不可用
			disabled: {
				type: Boolean,
				default: false
			},
			//是否获取焦点
			focus: {
				type: Boolean,
				default: false
			},
			//左边是否插入内容
			isSlotLeft:{
				type: Boolean,
				default: false
			}

		},
		data() {
			return {
				inputText: ''
			};
		},
		computed:{
			...mapState('system',{
				statusBarHeight:'statusBarHeight',
				titleBarHeight:'titleBarHeight',
				// #ifdef APP-PLUS
				barMarginRight:0,
				// #endif
				// #ifndef APP-PLUS
				barMarginRight:s=>s.systemInfo.windowWidth-s.menuBtnRect.left
				// #endif
			})
		},
		methods: {
			setDefaultValue(val){
				this.inputText =val; 
			},
			searchChange(e) {
				this.inputText = e.target.value
				this.$emit('search', this.inputText)
			},
			//disabled 不可点击时，点击搜索框跳转到新的页面显示搜索
			goToSearch() {
				this.$emit('goToSearch')
			},
			deleteInput() {
				this.inputText = ''
				this.$emit('search', this.inputText)
			},
			getInputText(){
				return this.inputText
			}
		}
	}
</script>

<style lang="scss" scoped>
	.status-bar{
		width: 100%;
		background-color: $uni-bg-color;
	}
	.search-container {
		display: flex;
		flex-direction: row;
		// justify-content: center;
		align-items: center;
		// padding-bottom: 10px;
		// padding-top: 10px;
		background-color: #FFFFFF;
	}

	.search-box {
		background: #F7F7F7;
		height: 32px;
		flex: 1;
		line-height: 32px;
		display: flex;
		margin: 0px 8px;
		display: flex;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 16px;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: 14px;
	}

	.search-content {
		flex: 1;
		color: #999999;
		font-size: 14px;
		margin-left: 8px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.img-view {
		height: 20px;
		width: 20px;
		font-size: 16px;
		line-height: 20px;
		color: #999999;
		margin-right: 10px;
	}
</style>
