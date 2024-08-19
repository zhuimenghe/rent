<template>
	<view class="selector-pick-bg">
		<view class="selector-pick-cell-left">{{title}}</view>
		<view class="selector-pick-cell-right"  @click="showPick">
			<text v-if="content&&content!=''">{{content}}</text>
			<text class="placeholder-text" v-else>{{placeholder}}</text>
			<i class="iconfont right-icon" :class="righticon"></i>
		</view>
	</view>
</template>

<script>
export default{
	props:{
		title: {
			type: String,
			default: ""
		},
		content: {
			type: [Number,String],
			default: ""
		},
		placeholder:{
			type: String,
			default: ""
		},
	},
	data() {
		return {
			righticon: 'iconarrow-right',
		};
	},
	created() {
	},
	methods:{
		showPick(){
			this.$emit('clickItem', {});
		},
	}
}
</script>

<style lang="scss" scoped>
.selector-pick-bg{
	position: relative;
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
	padding: 5px;
	justify-content: center;
	align-items: center;
}
.selector-pick-cell-left {
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selector-pick-cell-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.right-icon{
	margin-left: 5px;
	font-size: $uni-font-size-base;
	color: #999999;
}
.placeholder-text{
	color: #999999;
}
</style>
