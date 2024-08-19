<template>
	<!--筛选-->
	<view class="f-sort" :style="{'background-color':backgroundColor,color:textColor}" @click="clickFilter">
		<view class="f-sort-btn">{{$t('common.filtrate')}}</view>
		<i class="iconfont iconzl--zhankai" :class="isExpendArrow ? 'f-sort-corner-expend' : 'f-sort-corner'"></i>
	</view>
</template>

<script>
	export default{
		name:"FilterView",
		props:{
			backgroundColor:{
				type:String,
				default:"#ffffff"
			},
			textColor:{
				type:String,
				default:"#222222"
			},
			isExpendArrow:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				// isExpendArrow:false
			}
		},
		methods:{
			clickFilter(e){
				// this.isExpendArrow = !this.isExpendArrow;
				this.$emit("clickFilter",e)
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.f-sort {
		display: flex;
		flex-direction: row;
		font-size: 12px;
		margin-right: 8px;
		text-align: center;
		align-items: center;
		border-radius: 4px;
		padding: 6px 8px 6px 8px;
		background-color: $uni-border-color;
		color: $uni-text-color;
	}
	.f-sort-btn{
		
	}
	.f-sort-corner{
		font-size: 10px;
		height: 8px;
		transform: rotate(0deg);
		transition: all 500ms;
	}
	.f-sort-corner-expend {
		font-size: 10px;
		height: 8px;
		transform: rotate(180deg);
		transition: all 500ms;
	}
</style>
