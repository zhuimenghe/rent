<template>
	<view :style="{width:width+'%'}" class="row-container row-line">
		<view class="row-container" style="min-width: 70px;margin-left: 8px;">
			<text>{{label}}</text>
			<span style="color: #FF0000;margin-left: 2px;" v-if="rules.required">*</span>
		</view>
		<view class="value-container row-container">
			<view class="value-item-container">
				<view v-for="(v,pos) in values" :key='pos'>
					<view class="value-item" @click="deleteValue(pos)">
						<view style="margin-right: 2px;">{{v.label}}</view>
						<i class='iconfont arrow-view iconzl--cuowu' style="color: #EEEEEE;"></i>
					</view>
				</view>
				<view v-if="!values||values.length<=0" style="color: #999999; font-size: 14px;">{{placeholder}}</view>
			</view>
			<i class='iconfont arrow-view iconarrow-down'  @click="select"></i>

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
			}
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
						values: this.values
					})
				}

			},
			deleteValue(pos) {
				this.$emit('deleteValue', {
					pos: pos,
					dataProp: this.dataProp,
				})
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
