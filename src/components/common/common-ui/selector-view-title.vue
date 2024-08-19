<template>
	<view class="container">
		<view :class="isShowBackground ? 'content' : 'content-no-background'" :style="{ backgroundColor: isShowBackground ? backgroundColor : '#ffffff' }" @click="clickSelect">
			<view 
			class="label-view-title" 
			:style="{ 'font-size': textSize }">{{ title || '' }}:</view>
			<view 
			class="label-view" 
			:style="{ 'font-size': textSize, color: value ? textColor : '#aaaaaa' }">
			{{ value || "" }}</view>
			<i 
			class="iconfont arrow-view iconarrow-down" 
			:style="{ color: arrowColor }" 
			:class="isExpend ? 'arrow-view' : 'arrow-view-expend'"></i>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		value: {
			type: [String, Number],
			default: '请选择'
		},
		title:{
			type: [String, Number],
			default: ''
		},
		isShowBackground: {
			type: Boolean,
			default: true
		},
		textSize: {
			type: String,
			default: '14px'
		},
		height: {
			type: String,
			default: '35px'
		},
		textColor: {
			type: String,
			default: '#AAAAAA'
		},
		arrowColor: {
			type: String,
			default: '#999999'
		},
		labelWidth: {
			type: String,
			default: ''
		},
		//是否需要转动按钮
		isExpend: {
			type: Boolean,
			default: true
		},
		backgroundColor: {
			type: String,
			default: '#F7F7F7'
		}
	},
	data() {
		return {};
	},
	methods: {
		clickSelect() {
			this.$emit('clickSelect');
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex: 1;
	padding: 0px 4px;
}
.content {
	border: 1px solid #F7F7F7;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: #F7F7F7;
	align-items: center;
	padding: 0px 2px;
	flex: 1;
}
.content-no-background {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding:0px 2px;
	flex: 1;
}
.label-view-title {
	font-size: $uni-font-size-base;
	color: #aaaaaa;
	margin-right: 2px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	padding: 8px 0px;
}
.label-view {
	margin-left: 10px;
	flex: 1;
	font-size: $uni-font-size-base;
	color: #aaaaaa;
	margin-right: 2px;
	white-space: nowrap;
	text-overflow: ellipsis;
	justify-content: center;
	overflow: hidden;
	padding: 5px 0px;
}

.arrow-view {
	color: #999999;
	padding: 2px;
}

.arrow-view-expend {
	transform: rotate(180deg);
	transition: all 500ms;
}
</style>
