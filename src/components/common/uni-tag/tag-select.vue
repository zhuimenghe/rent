<template>
	<view class="select-container">
		<view class="tag-title">
			<view class="select-tag" :style="{color:textColor,'font-size':fontSize}">{{tagName}}</view>
			<businessTips :tipName='tipName' v-if="isShowTip" />
			<view class="annotation" v-if="isShowAnnotate">
				<icon type="warn" color="#fca01f" size="12px" />
				<text style="margin-left: 5px; font-size: 12px; color: #fca01f;">如不明确具体车号，可不选</text>
			</view>
		</view>

		<view class="label-container" @click="clickLabel">
			<view :class="value?'value-label':'hint-label'" v-if="isLabel">{{value?value:hint}}</view>
			<view :class="className" class="value-label" v-if="!isLabel">
				<slot></slot>
			</view>
			<i class="iconfont gray-arrow iconarrow-right" v-if="isSelect"></i>
		</view>
	</view>
</template>

<script>
	export default {
		name: "TagSelect",
		props: {
			tagName: {
				type: String,
				default: "标签"
			},
			isShowTip: {
				type: Boolean,
				default: false
			},
			tipName: {
				type: String,
				default: ""
			},
			className: {
				type: String,
				default: ""
			},
			value: {
				type: [String, Number],
				default: " "
			},
			hint: {
				type: [String, Number],
				default: "请选择"
			},
			isLabel: {
				type: Boolean,
				default: true
			},
			isShowAnnotate: {
				type: Boolean,
				default: false
			},
			isSelect: {
				type: Boolean,
				default: true
			},
			textColor: {
				type: String,
				default: "#999999"
			},
			fontSize: {
				type: String,
				default: "14px"
			}
		},
		data() {
			return {}
		},
		methods: {
			clickLabel() {
				if (this.isSelect) {
					this.$emit('click')
				}

			}

		}
	}
</script>

<style>
	.select-container {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		margin-top: 16px;
		flex: 1;
	}

	.tag-title {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.annotation {
		margin-left: 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.select-tag {
		color: #999999;
		font-size: 12px;
		height: 12px;
	}

	.label-container {
		margin-top: 8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 30px;
		line-height: 30px;
	}

	.gray-arrow {
		color: #333333;
		font-size: 16px;
		align-self: center;
	}

	.value-label {
		color: #333333;
		font-size: 14px;
		align-self: center;
	}

	.hint-label {
		color: #999999;
		font-size: 14px;
		align-self: center;
	}
</style>
