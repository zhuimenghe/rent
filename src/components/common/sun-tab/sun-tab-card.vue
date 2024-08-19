<template>
	<view  class="uni-tab">
		<view 
		 class="uni-tab-item"
		v-for="(tab,index) in tabList" 
		:key="index" 
		 :style="[{color:index === value ? activeColor : defaultColor}]"
		 @click="itemClick(index,tab)" 
		
		 >
		 <view class="tab-top" :style="{'background-color': index === value ? '#ffffff' : defaultbgColor}">
			 <view class="leftView">
			 	{{tab}}
			 </view>
			 <text :class="{'brigeNum': shownum }" :style="{background: numbackgroudColor}">{{num}}</text>
		 </view>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-tab',
		data() {
			return {
				average: 0,
				back: false
			};
		},
		props: {
			value: {
				type: Number, //当前选中下标
				default () {
					return 0;
				}
			},
			tabList: {
				type: Array,
				default () {
					return [];
				}
			},
			defaultbgColor: { //背景颜色
				type: String,
				default () {
					return '#E60000';
				}
			},
			activebgColor: {
				type: String,
				default () {
					return '#FFFFFF';
				}
			},
			defaultColor: { //默认未选中文字颜色
				type: String,
				default () {
					return '#000000';
				}
			},
			activeColor: { //选中时文字颜色 线条颜色
				type: String,
				default () {
					return '#E60000';
				}
			},
			rangeKey: { // 当tabList为对象时 显示指定下标值
				type: String,
				default () {
					return '';
				}
			},
			scroll: { //横向滑动
				type: Boolean,
				default () {
					return false;
				}
			},
			num: {
				type: String,
				default () {
					return '';
				}
			},
			shownum: {
				type: Boolean,
				default () {
					return false;
				}
			},
			numbackgroudColor: {
				type: String,
				default () {
					return "#E60000";
				}
			},
			isFlex: {
				type: Boolean,
				default () {
					return true;
				}
			},
		},
		computed: {
			barLeft() {
				return this.value * this.average;
			},
			barRight() {
				let index = this.tabList.length - this.value - 1;
				return index * this.average;
			},
		},
		created() {
			this.average = 100 / this.tabList.length;
		},
		methods: {
			itemClick(index, tab) {
				if (this.value == index) return false;
				if (this.value > index) {
					this.back = true;
				} else {
					this.back = false;
				}
				// this.value = index;
				this.$emit('update:value', index);
				this.$emit('change', {
					tab: tab,
					index:index
				});
			}
		}
	};
</script>
<style lang="scss" scoped>

	.uni-tab {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		font-size: 14px;
		height: 44px;
		line-height: 44px;
		padding: 0px 4px;
		background-color: #E60000;
	}

	.uni-tab-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: center;
		height: 42px;
		line-height: 42px;
	}
	.tab-top{
		display: flex;
		flex-direction: row;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		align-items: center;
		border-radius: 5px 5px 0px 0px;
		margin-top: 2px;
	}
	
	.uni-tab-scroll-item {
		flex: none;
		padding: 0px 12px;
		background-color: #E60000;
	}

	.uni-tab-active {
		color: #E60000;
	}


	.uni-scroll-tab {
		overflow-x: scroll;
	}

	::-webkit-scrollbar {
		height: 0px;
	}

	.leftView {
		flex: 1;
		align-items: center;
		text-align: center;
	}

	.brigeNum {
		height: 20px;
		border-radius: 50%;
		min-width: 20px;
		margin-left: 5px;
		margin-right: 5px;
		padding: 2px;
		line-height: 20px;
		text-align: center;
		font-size: 10px;
		color: #FFFFFF;
	}
</style>
