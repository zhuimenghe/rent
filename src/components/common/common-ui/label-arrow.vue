<template>
	<view style="display: flex;flex: 1;">
		<view class="label-arrow-container" 
		:style="{'font-size':textSize+'px',color:textColor}" 
		@click="clickLabel">
			<text style="flex: 1;">{{value || '-'}}<i class="iconfont arrow-icon" 
			:class="iconstr"
			:style="{'font-size':arrowSize+'px',color:arrowColor,'margin-left':2+'px'}" 
			v-if="!disabled"></i></text>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: [String,Number],
				default: ""
			},
			textSize:{
				type:String,
				default:"14"
			},
			textColor:{
				type:String,
				default:"#999999"
			},
			arrowSize:{
				type:String,
				default:"14"
			},
			arrowColor:{
				type:String,
				default:"#999999"
			},
			disabled:{
				type: Boolean,
				default: false
			},
			iconstr:{
				type:String,
				default:'iconarrow-right'
			}
			
		},
		watch:{
			value(v){
				console.log("value"+v)
			}
		},
		methods:{
			clickLabel(){
				if(!this.disabled){
					this.$emit('clickLabel');
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.label-arrow-container {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
		align-content: center;
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
	}
	.arrow-icon{
		justify-content: flex-end;
		text-align: center;
	}
</style>
