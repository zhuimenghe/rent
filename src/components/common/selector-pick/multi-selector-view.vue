<template>
	<view :style="{width:width+'%'}" class="row-container row-line">
		<view class="row-container" style="margin:0px 8px;" v-if="showLabel">
			<text>{{label}}</text>
			<span style="color: #FF0000;margin-left: 2px;" v-if="isRequired">*</span>
		</view>
		<view class="row-container value-container"  :style="{'background-color':backgroundColor}" @click="select">
			<view class="value-item-container">
				<view v-for="(v,pos) in values" :key='pos'>
					<view 
					:class="fillBackground?'value-item':'value-item-line'"
					:style="{color:!fillBackground?textColor:'#ffffff','border-color':!fillBackground?textColor:'#EEEEEE'}"
					@click.stop="deleteValue(pos)">
						<!--如果传的是对象name传入显示的字段名-->
						<view style="margin-right: 2px;">{{showText(v)}}</view>
						<i class='iconfont iconzl--cuowu' style="color: #EEEEEE;" v-if="canDelete"></i>
					</view>
				</view>
			</view>
			<view v-if="!values||values.length<=0" style="color: #999999; font-size: 14px;flex: 1;">{{placeholder}}
			</view>
			<i class='iconfont arrow-view iconarrow-right'></i>

		</view>

	</view>
</template>

<script>
	export default {
		name: 'multiSelectorView',
		props: {
			//是否填充背景
			fillBackground: {
				type: Boolean,
				default: false
			},
			textColor: {
				type: String,
				default: '#E60000'
			},
			//选择框的背景色
			backgroundColor:{
				type: String,
				default: '#ffffff'
			},
			showLabel: {
				type: Boolean,
				default: true
			},
			label: {
				type: String,
				default: 'selector'
			},
			values: {
				type: Array,
				default () {
					return []
				}
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
			isRequired: {
				type: Boolean,
				default: false
			},
			//需要显示的字段的优先级，从第一个开始取，根据顺序直到取出对象中有数据的字段值
			showKey: {
				type: Array,
				default(){
					return []
				}
			},
			//提交时的属性
			dataProp: {
				type: String,
				default: 'selector'
			},
			canDelete: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {

			}
		},
		methods: {
			showText(obj){
				if(this.showKey&&this.showKey.length>0){
					for(let i = 0;i<this.showKey.length;i++){
						return obj[this.showKey[i]]?obj[this.showKey[i]]:'--'
						
					}
				}else{
					return obj?obj:'--'
				}
			},
			select() {
				if (!this.disabled) {
					this.$emit('clickSelector', {
						dataProp: this.dataProp,
						values: this.values
					})
				}

			},
			deleteValue(pos) {
				if (this.canDelete) {
					this.$emit('deleteValue', {
						pos: pos,
						dataProp: this.dataProp,
					})
				}

			}
		}

	}
</script>

<style lang="scss" scoped>
	.row-line {
		padding: 8px 0px;
		background-color: #FFFFFF;
	}

	.row-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 14px;
		color: #333333;
	}

	.value-container {
		background-color: #EEEEEE;
		border-radius: 4px;
		margin: 0px 8px;
		padding: 0px 8px;
		color: #333333;
		flex: 1 !important;
		display: flex;
		flex-flow: row;
		justify-content: space-between;
		align-items: center;
		min-height: 32px;
	}
	
	.value-item-container {
		padding: 4px 0px;
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
	}


	.value-item {
		background-color: #aaaaaa;
		border-radius: 2px;
		margin: 2px;
		padding: 1px 2px;
		font-size: 12px;
		color: #FFFFFF;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
     .value-item-line{
		 background-color: #ffffff;
		 border-radius: 2px;
		 margin: 2px;
		 padding: 1px 2px;
		 font-size: 12px;
		 border: 1px solid #E60000;
		 color: #E60000;
		 display: flex;
		 flex-direction: row;
		 justify-content: space-between;
		 align-items: center;
		
	}

	.label-view {
		font-size: 14px;
		color: #333333;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		display: -webkit-box !important;
		-webkit-box-orient: vertical !important;
		-webkit-line-clamp: 1 !important;
		/*行数*/
	}

	.arrow-view {
		color: #999999;
		padding: 0px 2px;
		font-size: 20px;
	}
</style>
