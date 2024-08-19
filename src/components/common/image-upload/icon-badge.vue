<template>
	<view class="bgview" @click="addPic">
		<i class="iconfont icon" :class="iconstr" :style="{color:iconColor,fontSize:fontSize}"></i>
		<view class="badge-view" :style="{background:background}" v-if="num != 0"><text>{{num > 99 ? '99+' : num}}</text></view>
	</view>
</template>
<script>
export default {
	data() {
		return {
		};
	},
	props:{
		iconstr:{
			type: String,
			default: "iconzl--tixing"
		},
		num : {
			type: Number,
			default: 0
		},
		bageSize : {
			type: String,
			default: "16px"
		},
		background:{
			type: String,
			default: "#FF0000"
		},
		iconColor:{
			type: String,
			default: "#999999"
		},
		fontSize:{
			type: String,
			default: "25px"
		}
	},
	methods:{
		addPic(){
			this.$emit('addPic')
		}
	}
}
</script>

<style scoped lang="scss">
.bgview {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin-left: 10px;
}
.icon {
	font-size: 25px;
	color: #999999;
	text-align: center;
	padding: 5px;
}
.badge-view {
	margin-left: -10px;
	margin-top: -5px;
	display: flex;
	height: 15px;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	min-width: 15px;
	border-radius: 20px;
	padding: 2px 3px;
	color: #ffffff;
	background: #FF0000;
}
</style>
