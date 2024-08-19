<template>
	<view>
		<view class="value-style" :style="{ color: value ? fontColor : '#333333' }" @click="callPhone">{{ value ? value : '--' }}</view>
	</view>
</template>

<script>
export default {
	name: 'phoneLabel',
	props: {
		value: {
			type: String,
			default: ''
		},
		fontColor: {
			type: String,
			default: '#E60000'
		}
	},
	data() {
		return {};
	},
	methods: {
		callPhone() {
			if (this.value) {
				uni.makePhoneCall({
					// 手机号
					phoneNumber: this.value,
					// 成功回调
					success: (res) => {
						console.log('调用成功!');
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!');
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.value-style {
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
</style>
