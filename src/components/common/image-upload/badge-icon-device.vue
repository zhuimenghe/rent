<template>
	<view class="bgview" @click.stop="addPic">
		<i class="iconfont icon iconfujian" :style="{'font-size':bageSize}"></i>
		<view class="badge-view" v-if="num != 0">
			<text>{{num}}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	watch: {
		num(val) {
		}
	},
	props:{
		num : {
			type: Number,
			default: 0
		},
		bageSize : {
			type: String,
			default: "18px"
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
	z-index: 100;
	align-self: center;
}
.icon {
	// margin-top: 5px;
	font-size: 18px;
	color: $uni-color-primary;
	// width: 20px;
	// height: 20px;
	text-align: center;
	line-height: 20px;
}
.badge-view {
	// position: absolute;
	// top: 0px;
	// left: 20px;
	margin-left: -10px;
	margin-top: -5px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	height: 15px;
	min-width: 15px;
	border-radius: 10px;
	color: #ffffff;
	background: $uni-color-primary;
}
</style>
