<template>
	<view class="selector-input-bg">
		<view class="selector-input-cell-left"><text>{{title}}</text><text style="color: #FF0000;" v-if="isRequire">*</text></view>
		<view class="selector-input-cell-right">
			<textarea
			v-if="isEdit"
			class="selector-input-style" 
			:placeholder="placeholder"
			:value="content"
			@input="textChange"
			/>
			<textarea
			v-if="!isEdit"
			class="selector-input-style" 
			:value="content"
			:disabled="true"
			/>
		</view>
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
			setTimeout(()=>{
				this.$emit('textChage', val.detail.value);
			}, 20);
		}
	}
}
</script>

<style lang="scss" scoped>
.selector-input-bg{
	position: relative;
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
	padding: 10px;
	// border-bottom: #F0F2F4 1px solid;
}
.selector-input-cell-left {
	display: flex;
	min-width: 60px;
	flex-direction: row;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selector-input-cell-right {
	display: flex;
	flex: 1;
	margin-top: 10px;
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
	width: 100%;
	height: 50px;
	text-align: left;
	font-size: $uni-font-size-base;
	border: #F0F2F4 1px solid;
	padding: 5px;
}
</style>
