<template>
	<view class="bg-icon-view" @click.stop="addPic">
		<text class="left-text">附件</text>
		<text class="right-text" v-if="num != 0">{{num}}</text>
	</view>
</template>

<script>
export default {
	props:{
		num : {
			type: [String,Number],
			default: 0
		},
	},
	methods:{
		addPic(){
			this.$emit('addPic')
		}
	}
}
</script>

<style scoped lang="scss">
.bg-icon-view{
	display: flex;
	flex-direction: row;
	padding: 4px 8px;
	font-size: 12px;
	// background: #F5F6F8; 
	border-radius: 50px;
	font-size: 14px;
}
.left-text{
	color: #E60000;
}
.right-text{
	margin-left: 2px;
	color: $uni-color-primary;
}
</style>
