<template>
	<view class="pop-container">
		<uni-popup ref="deviceDialog" type="center" :mask-click="false">
			<view class="uni-tip">
				<view class="row-item" @click="clickLocal">
					<view class="row-tag"><text>现场录入</text></view>
				</view>
				<view class="row-item" @click="clickDevice">
					<view class="row-tag"><text>单据补录</text></view>
				</view>
				<view class="row-item" style="background: #dcdcdc;" @click="clickCancle">
					<view class="row-tag"><text>取消</text></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	props: {
		showDialog: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		showDialog: {
			handler(val) {
				if(val){
					this.$refs.deviceDialog.open();
				}else{
					this.$refs.deviceDialog.close();
				}
			}
		},
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		clickDevice(){
			this.$refs.deviceDialog.close();
			this.$emit('clickevent', {
				isLocal: "2"
			});
		},
		clickLocal(){
			this.$refs.deviceDialog.close();
			this.$emit('clickevent', {
				isLocal: "1"
			});
		},
		clickCancle(){
			this.$refs.deviceDialog.close();
			this.$emit('clickevent', {
				isLocal: "3"
			});
		}
	}
};
</script>
<style lang="scss">
.pop-container {
	position: relative;
	z-index: 400;
}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 290px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 270px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #ffffff;
	font-size: $uni-font-size-base;
	border-radius: 5px;
}

.row-tag {
	width: 98px;
	text-align: center;
}
</style>
