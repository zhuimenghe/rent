<template>
	<view :class="{ 'uni-scroll-tab': scroll === true }" class="uni-tab">
		<view
			v-for="(tab, index) in tabList"
			:key="index"
			:class="{ 
				'uni-tab-active': index === value, 
				'uni-tab-scroll-item': scroll === true, 
				'uni-tab-scroll-active': index === value 
			}"
			:style="[{
				color: index === value ? activeColor : defaultColor,
				backgroundColor: index === value ? activebgColor : defaultbgColor,
				borderColor: index === value ? activeColor : defaultbgColor
			}]"
			@tap="itemClick(index, tab)"
			class="uni-tab-item"
		>
			<view class="leftView">
				<text>{{tab.name}}</text>
			</view>
			<view  v-if="tab.num&&tab.num>0" class="brigeNum" :style="{background: numbackgroudColor}">
				<text>{{ tab.num }}</text>
			</view>	
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			average: 0,
			back: false
		};
	},
	props: {
		value: {
			type: Number, //当前选中下标
			default() {
				return 0;
			}
		},
		tabList: {
			type: Array,
			default() {
				return [];
			}
		},
		defaultbgColor: {
			//背景颜色
			type: String,
			default() {
				return '#FFFFFF';
			}
		},
		activebgColor: {
			type: String,
			default() {
				return '#FFFFFF';
			}
		},
		defaultColor: {
			//默认未选中文字颜色
			type: String,
			default() {
				return '#000000';
			}
		},
		activeColor: {
			//选中时文字颜色 线条颜色
			type: String,
			default() {
				return '#1e9fff';
			}
		},
		scroll: {
			//横向滑动
			type: Boolean,
			default() {
				return false;
			}
		},
		shownum: {
			type: Boolean,
			default() {
				return false;
			}
		},
		numbackgroudColor: {
			type: String,
			default() {
				return '#E60000';
			}
		}
	},
	computed: {
		barLeft() {
			return this.value * this.average;
		},
		barRight() {
			let index = this.tabList.length - this.value - 1;
			return index * this.average;
		}
	},
	created() {
		console.log('3333333333')
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
				index: index
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.uni-tab {
	position: relative;
	display: flex;
	font-size: 14px;
	height: 44px;
	line-height: 44px;
	background-color: #FFFFFF;
}

.uni-tab-item {
	display: flex;
	flex-direction: row;
	flex: 1;
	height: 44px;
	box-sizing: border-box;
	overflow: hidden;
	// align-items: center;
}

.uni-tab-scroll-item {
	flex: none;
	padding: 0px 12px;
}

.uni-tab-active {
	color: #1e9fff;
}

.uni-tab-scroll-active {
	border-bottom-width: 3px;
	border-bottom-style: solid;
}

.uni-tab-bar {
	display: block;
	height: 3px;
	position: absolute;
	bottom: 0;
	border-bottom-width: 3px;
	border-bottom-style: solid;
}

.uni-tab-bar-forward {
	transition: right 0.2s cubic-bezier(0.35, 0, 0.25, 1), left 0.2s cubic-bezier(0.35, 0, 0.25, 1) 0.09s;
}

.uni-tab-bar-backward {
	transition: right 0.2s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.2s cubic-bezier(0.35, 0, 0.25, 1);
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
	display: flex;
	height: 16px;
	border-radius: 8px;
	min-width: 16px;
	margin-top: 5px;
	margin-right: 5px;
	padding-left: 5px;
	padding-right: 5px;
	justify-content: center;
	align-items: center;
	font-size: 10px;
	color: #ffffff;
}
</style>
