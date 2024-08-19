<template>
	<view class="text-container" > 
		<view v-if="isShowLabel"
			style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;">
			<view class="text-tag" :style="{color:tagColor}">{{tagName}}<span style="color: #FF0000;"
					v-if="isRequired||isRequired=='true'">*</span></view>
			<view class="edit-style" v-if="showEditText" @click="editClick">{{editText}}</view>
		</view>

		<textarea :style="{backgroundColor:bgColor}" :class="[className,isShowBorder?'border':'']" :placeholder="inputDisabled||inputDisabled=='true'?'':placeholder"
			:maxlength="moneyMaxLeng" :value="inputValue" :disabled="inputDisabled||inputDisabled=='true'"
			@input="inputCheck" />
	</view>
</template>
<!--  -->
<script>
	export default {
		name: "TextLabelItem",
		props: {
			isShowBorder: {
				type: Boolean,
				default: false
			},
			bgColor:{
				type:String,
				default:'#FFFFFF'
			},
			isShowLabel: {
				type: Boolean,
				default: true
			},
			tagName: {
				type: String,
				default: "标签"
			},
			editText: {
				type: String,
				default: "编辑"
			},
			showEditText: {
				type: Boolean,
				default: false
			},
			tagColor: {
				type: String,
				default: "#333333"
			},
			className: {
				type: String,
				default: "textarea"
			},
			moneyMaxLeng: {
				type: Number,
				default: 100
			},
			inputValue: {
				type: String,
				default: ""
			},
			isRequired: {
				type: [Boolean, String],
				default: false
			},
			placeholder: {
				type: String,
				default: ""
			},
			inputDisabled: {
				type: [Boolean, String],
				default: false
			}	
		},
		data() {
			return {
				value: this.inputValue
			}
		},

		methods: {
			inputCheck: function(e) {
				let val = e.target.value;
				console.log(val,'inputCheck');
				// this.$datestr.printlog(val)
				this.$emit("ipnuttext", val);
			},
			editClick() {
				this.$emit('editClick')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text-container {
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.text-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 10px;
		margin-top: 10px;
		flex: 2;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.edit-style {
		font-size: 14px;
		color: $uni-color-primary;
		padding-right: 8px;
	}
	.border{
		border:1rpx solid #e6e6e6;
	}
	.textarea {
		width: calc(100% - 32px);
		height: 82px;
		margin-left: 10px;
		background-color: #fbfbfb;
		border-radius: 2px;
		padding: 10px;
		margin-top: 10px;
		box-sizing: border-box;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-bottom: 16px;
		

	}
</style>
