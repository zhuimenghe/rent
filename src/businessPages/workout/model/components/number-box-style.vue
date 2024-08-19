<template>
	<view class="uni-numbox">
		<view @click="_calcValue('minus')" class="uni-numbox__minus" :class="{ 'uni-numbox-btn--disabled-minus': inputValue <= min || disabled }">
			<text class="uni-numbox--text minus" :class="{ 'uni-numbox--disabled-minus': inputValue <= min || disabled }">-</text>
		</view>
		<input 
		:disabled="true" 
		@blur="_onBlur" 
		class="uni-numbox__value" 
		type="number" 
		v-model="inputValue" 
		/>
		<view @click="_calcValue('plus')" class="uni-numbox__plus" :class="{ 'uni-numbox-btn--disabled-plus': inputValue >= max || disabled }">
			<text class="uni-numbox--text plus" :class="{ 'uni-numbox--disabled-plus': inputValue >= max || disabled }">+</text>
		</view>
	</view>
</template>
<script>
	export default {
		name: "NumberBoxStyle",
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			inputdisabled:{
				type: Boolean,
				default: true
			},
			//当数据小于等于该值时，减少做提示
			compare: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				inputValue: 0
			};
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
			inputValue(newVal, oldVal) {
				if (+newVal !== +oldVal) {
					this.$emit("change", newVal);
				}
			}
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			_calcValue(type) {
				if (this.disabled) {
					return;
				}
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;
				if (type === "minus") {
					if (this.compare) {
						// this.$datestr.printlog("compare==="+this.compare +"value=="+value);
						if (this.inputValue > this.min) {
							this.$emit("minusChange", step);

						} else {
							value -= step;
						}
					} else {
						value -= step;
					}
				} else if (type === "plus") {
					value += step;
				}
				if (value < this.min || value > this.max) {
					return;
				}

				this.inputValue = String(value / scale);
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + "").split(".")[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					// this.inputValue = 0;
					return;
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min;
				}
				this.inputValue = value;
			}
		}
	};
</script>
<style lang="scss" scoped>
	$box-height: 20px;
	$box-width: 20px;


	.uni-numbox {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// height: 40px;
		// line-height: 40px;
		align-items: center;
		justify-content: center;
	}

	.uni-numbox__value {
		// background-color: $uni-bg-color;
		width: 40px;
		// height: 30px;
		text-align: center;
		font-size: 14px;
		border-color: $uni-border-color;
		align-self: center;
		margin: 0px;
		padding-top: 4px;
	}

	.uni-numbox__minus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
		// line-height: $box-line-height;
		// text-align: center;
		font-size: 16px;
		color: $uni-color-primary;
		// background-color: $uni-bg-color;
		border-radius: 50%;
		border-style: solid;
		border-color: #e60000;
		border-width: 1px;
		z-index: 111;
	}

	.uni-numbox__plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 50rpx;
		height: 50rpx;
		border-width: 1px;
		border-style: solid;
        color:#e60000;
		border-color: #e60000;
		// background-color: $uni-color-primary;
		border-radius: 50%;
		z-index: 111;
	}

	.uni-numbox--text {
		font-size: 16px;

	}

	.minus {
		color: #E60000;
	}

	.plus {
		color: #E60000;
	}

	.uni-numbox--disabled-minus,
	.uni-numbox--disabled-plus {
		color: $uni-text-color-disable;
	}

	.uni-numbox-btn--disabled-minus,
	.uni-numbox-btn--disabled-plus {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: $box-width;
		height: $box-height;
		border-width: 1px;
		border-style: solid;
		border-color: #c0c0c0;
		// background-color: #c0c0c0;
		border-radius: 50%;
	}
</style>
