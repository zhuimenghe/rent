<template>
	<view class="selector-input-bg">
		<view class="selector-input-cell-left">{{title}}<text style="color: #FF0000;" v-if="isRequire">*</text></view>
		<view class="selector-input-cell-right">
			<input v-if="isEdit" class="selector-input-style" :placeholder="placeholder" :value="content"
				:type="textType" @input="textChange" />
			<view v-if="!isEdit" class="selector-input-style" @click="clickItem" :style="{color:textColor}">
				{{content||'--'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isEdit: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ""
			},
			isRequire: {
				type: Boolean,
				default: true
			},
			content: {
				type: [Number, String],
				default: ""
			},
			placeholder: {
				type: String,
				default: ""
			},
			textType: {
				type: String,
				default: "text"
			},
			textColor: {
				type: String,
				default: "#111111"
			},
		},
		data() {
			return {
				righticon: 'iconarrow-right',
			};
		},
		created() {},
		methods: {
			textChange(val) {
				this.$emit('textChage', val.detail.value);
			},
			clickItem(){
				if(!this.isEdit){
					this.$emit("clickItem")
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.selector-input-bg {
		position: relative;
		display: flex;
		flex-direction: row;
		background: #FFFFFF;
		padding: 10px;
		border-bottom: #F0F2F4 1px solid;
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

	.right-icon {
		margin-left: 5px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.placeholder-text {
		color: #999999;
	}

	.selector-input-style {
		flex: 1;
		flex-wrap: wrap;
		text-align: right;
		font-size: $uni-font-size-base;
	}
</style>
