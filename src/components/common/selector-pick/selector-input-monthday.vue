<template>
	<view class="selector-input-bg">
		<view class="selector-input-cell-left">{{title}}<text style="color: #FF0000;" v-if="isRequire">*</text></view>
		<view class="selector-input-cell-right">
			<input
			v-if="showWhole"
			class="selector-input-style" 
			placeholder="0"
			:value="whole"
			type="number"
			@input="textChange($event,'whole')"
			:disabled="!isEdit"
			:style="{'border-width':isEdit?'1px':'0px'}"
			/>
			<text v-if="showWhole" class="selector-input-style-text">{{wholeStr}}</text>
			<input
			class="selector-input-style" 
			placeholder="0"
			:value="surplusDay"
			type="number"
			@input="textChange($event,'surplusDay')"
			:disabled="!isEdit"
			:style="{'border-width':isEdit?'1px':'0px'}"
			/>
			<text class="selector-input-style-text">天</text>
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
		showWhole:{
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
		whole: {
			type: [Number,String],
			default: ""
		},
		surplusDay: {
			type: [Number,String],
			default: ""
		},
		wholeStr:{
			type: String,
			default: "月"
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
		textChange(val,type){
			let param = {
				type:type,
				data:val.detail.value
			}
			this.$emit('textChage', param);
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
	border-bottom: #F0F2F4 1px dotted;
}
.selector-input-cell-left {
	display: flex;
	padding: 10px;
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
	padding-right: 10px;
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
	width: 60upx;
	padding:4px 8px;
	flex-wrap:wrap;
	text-align: center;
	font-size: $uni-font-size-base;
	border-radius: 5px;
	border: $uni-line-color 1px solid;
}
.selector-input-style-text {
	margin-left: 10px;
	margin-right: 10px;
	font-size: $uni-font-size-base;
}
</style>
