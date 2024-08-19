<template>
	<view class="choose-item-view-bg" @click="clickItem">
		<input
		class="choose-item-view-input"
		:disabled="true"
		:placeholder="placeholder"
		:value="content"
		/>
		<i class="iconfont arrow-icon" :class="iconstr"></i>
	</view>
</template>

<script>
export default {
	components: {},
	props: {
		placeholder: {
			type: String,
			default: '请选择开始日期'
		},
		content: {
			type: String,
			default: ''
		},
		iconstr: {
			type: String,
			default: 'iconarrow-right'
		},
	},
	methods:{
		clickItem(){
			this.$emit('clickItem')
		}
	}
		
}
</script>

<style scoped lang="scss">
.choose-item-view-bg{
	display: flex;
	flex: 1;
	flex-direction: row;
	padding: 5px 10px;
	align-items: center;
	border: #E9E9E9 1px solid;
	border-radius: 5px;
}
.choose-item-view-input{
	flex: 1;
	font-size: $uni-font-size-base;
	color: #222831;
}
.arrow-icon{
	font-size: 20px;
	color: #222831;
}
</style>