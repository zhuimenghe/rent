<template>
	<view class="selector-input-bg">
		<view class="selector-input-cell-left">{{title}}<text style="color: #FF0000;" v-if="isRequire">*</text></view>
		<view class="selector-input-cell-right">
			<text v-if="!isEdit"
			class="selector-input-style" >
				{{content}}
			</text>
			<input
			v-if="isEdit"
			class="selector-input-style" 
			:placeholder="placeholder"
			:value="content"
			:type="textType"
			@input="textChange"
			:disabled="!isEdit"
			/>
		</view>
		<i class="iconfont icon-css iconzl--zuobiao" @click="iconClick" v-if="isEdit"></i>
	</view>
</template>

<script>
export default{
	props:{
		isEdit:{
			type:Boolean,
			default:true
		},
		title: {
			type: String,
			default: ""
		},
		isRequire:{
			type:Boolean,
			default:true
		},
		content: {
			type: [Number,String],
			default: ""
		},
		placeholder:{
			type: String,
			default: ""
		},
		textType:{
			type: String,
			default: "text"
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
		textChange(val){
			this.$emit('textChage', val.detail.value);
		},
		iconClick(){
			this.$emit('iconClick', '');
		}
	}
}
</script>

<style lang="scss" scoped>
.selector-input-bg{
	position: relative;
	display: flex;
	flex-direction: row;
	background: #FFFFFF;
	padding:8px 10px;
	border-bottom: #F0F2F4 1px solid;
	align-items: center;
}
.selector-input-cell-left {
	display: flex;
	min-width: 60px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selector-input-cell-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.right-icon{
	margin-left: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.placeholder-text{
	color: #999999;
}
.selector-input-style {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
}
.icon-css{
	margin-left: 10px;
	font-size: 16px;
	padding: 5px;
	background: $uni-color-primary;
	border-radius: 3px;
	color: #FFFFFF;
}
</style>
