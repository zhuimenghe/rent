<template>
	<view class="input-container">
		<view class="input-tag" :style="{color:textColor,'font-size':fontSize}">{{tagName}}</view>
		<view class="input-container">
			<slot></slot>
		</view>
		
		<!-- <input :class="className" :placeholder="$t('common.inputTip')" type="digit" :maxlength="moneyMaxLeng" v-model="inputValue" @input='inputCheck'/> -->
	</view>
</template>
<!--  -->
<script>
	export default {
		name: "TagInput",
		props: {
			tagName: {
				type: String,
				default: "标签"
			},
			className: {
				type: String,
				default: ""
			},
			moneyMaxLeng: {
				type: Number,
				default: 8
			},
			value: {
				type: String,
				default: ""
			},
			textColor:{
				type: String,
				default: "#999999"
			},
			fontSize:{
				type: String,
				default: "14px"
			}
		},
		data() {
			return {
				inputValue: this.value
			}
		},
		created() {
			this.inputValue = this.value
		},
		watch: {
			value(v) {
				this.$datestr.printlog("value"+v)
				this.inputValue = v
			},
			inputValue(val){
				this.$datestr.printlog("inputValue"+val)
				this.inputValue = val
				// this.$emit("input", this.val);
			}
			// inputValue(val) {

			// 	let value = null
			// 	setTimeout(() => {
			// 		//限制小数两位
			// 		if (val.indexOf(".") != -1) {
			// 			var dotIndex = val.indexOf(".");
			// 			if (val.length - 1 - dotIndex > 2) {
			// 				val = val.substr(0, dotIndex + 2 + 1);
			// 				value = val;
			// 			}
			// 		}
			// 		if (val.indexOf(".") == 0) {
			// 			val = "0" + val;
			// 			value = val;
			// 		}

			// 		//限制0后面非。输入
			// 		if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
			// 			value = val.substring(0, 1);
			// 			this.$emit("input", value);
			// 			return
			// 		}


			// 		console.error(this.inputValue);
			// 		this.$emit("input", this.inputValue);

			// 	}, 0)

			// }
		},
		methods: {
			inputCheck: function(e) {
				var val = e.target.value;
				setTimeout(() => {
					//限制小数两位
					if (val.indexOf(".") != -1) {
						var dotIndex = val.indexOf(".");
						if (val.length - 1 - dotIndex > 2) {
							val = val.substr(0, dotIndex + 2 + 1);
							this.inputValue = val;
						}
					}
					if (val.indexOf(".") == 0) {
						val = "0" + val;
						this.inputValue = val;
					}

					//限制0后面非。输入
					if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
						this.inputValue = val.substring(0, 1);
						this.$emit("input", this.inputValue);
						return
					}

				}, 0)
				this.$emit("input", this.inputValue);
			}
		}
	}
</script>

<style>
	.input-container {
		display: flex;
		margin-top: 16px;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.input-tag {
		color: #999999;
		font-size: 12px;
		height: 12px;
	}

	.input-container {
		color: #333333;
		font-size: 14px;
		
	}
</style>
