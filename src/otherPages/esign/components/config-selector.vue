<template>
	<view :style="{width:width+'%'}" class="row-container row-line">
		<view class="row-container" style="min-width: 70px;margin-left: 8px;">
			<text>{{label}}</text>
			<span style="color: #FF0000;margin-left: 2px;" v-if="rules.required">*</span>
		</view>
		<view class="value-container row-container"  @click="select">
			<view class="label-view" :style="{color:getLabel(value)?'#333333':'#999999'}">{{getLabel(value)?getLabel(value):placeholder}}</view>
			<i class='iconfont arrow-view iconarrow-down' v-if="!disabled"></i>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'configSelector',
		props: {
			label: {
				type: String,
				default: 'selector'
			},
			value: {
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
			dataProp: {
				type: String,
				default: 'selector'
			},
			//数据
			dataList: {
				type: Array,
				default () {
					return[]
				}
			},
		},

		data() {
			return {

			}
		},
		methods: {
			select() {
				if (!this.disabled) {
					this.$emit('clickSelector', {
						dataProp: this.dataProp,
						value: this.value
					})
				}
			},
			getLabel(value){
				return this.dataList.some(o=>o.value==value)?(this.dataList.find(o=>o.value==value).label?this.dataList.find(o=>o.value==value).label:''):''
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
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.value-container {
		background-color: #F7F7F7;
		border-radius: 4px;
		margin: 0px 8px;
		padding: 0px 8px;
		line-height: 32px;
		color: #333333;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		flex: 1 !important;
	}


	.label-view {
		
		font-size: $uni-font-size-base;
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
	}
</style>
