<template>
	<view :style="{width:width+'%'}" class="row-container row-line">
		<view class="row-container" style="min-width: 70px;margin-left: 8px;">
		  <text>{{label}}</text>
		  <span 
		   style="color: #FF0000;margin-left: 2px;"
		   v-if="rules.required"
		  >*</span>
		</view>
		<view class="row-container" style="padding-right: 8px;">
			<input
			  class="input-style" 
			  style="font-size: 14px;color: #333333;"
			   placeholder-style="color:#999999"
			  :placeholder="placeholder" 
			  :disabled="disabled"
			  v-model="value"
			/>
		</view>
		
	</view>
</template>

<script>
	var timer;
	export default {
		name:'configInput',
		props: {
			label: {
				type: String,
				default: 'Input'
			},
			defaultValue: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 100
			},
			placeholder: {
				type: String,
				default: ''
			},
			// 是否不可编辑
			disabled: {
				type: Boolean,
				default: false
			},
			//// 校验字段
			rules: {
				type: Object,
				default () {
					return {
						required: true,
						message: ""
					}
				}
			},
			//提交时的属性
			dataProp:{
				type: String,
				default: 'input1'
			}
		},
		watch:{
			value(val){
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.setEmit();
				}, 500);
				
			}
				
		},
		data() {
			return {
				value: ''
			}
		},
		created() {
			this.value = this.defaultValue
		},
		methods: {
              setEmit(){
	              this.$emit('valueChange',{
					  dataProp:this.dataProp,
					  value:this.value
					  
				  })
              },
			  //校验input------- 提交时调用
			  checkInput(){
				  if(this.rules.required && this.value){
					  uni.showToast({
					  	icon:'none',
						title:this.rules.message
					  })
					  return Promise.reject(this.dataProp+this.rules.message)
				  }
				   return Promise.resolve(this.dataProp+'---success')
			  }
		}

	}
</script>

<style lang="scss" scoped>
	.row-line{
		padding: 8px 0px;
		background-color: #FFFFFF;
	}
	.row-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.input-style {
		background-color: #F7F7F7;
		border-radius: 4px;
		margin-left: 8px;
		flex: 1;
		text-align: start;
		padding: 4px 8px;
		color: #333333;
	}
</style>
