<template>
	<view class="car-message-view">
		<view class="r-head-view">
			<image class="icon-car" :src="dataDic.fileList[0].url" v-if="dataDic.fileList && dataDic.fileList.length > 0" />
			<view class="icon-car" v-else>
				<i class="iconfont icon-view" :class="
					deviceIcon[dataDic.machineTypeId] ? deviceIcon[dataDic.machineTypeId] : 'iconzl--jianchache1'
				"></i>
			</view>
			<view class="icon-car-right">
				<view class="icon-car-right-top">
					<text style="margin-right: 5px;font-size: 16px;font-weight: bold;">
						{{ dataDic.printCode || '--' }}
					</text>
					<text class="licenseIdStyle">{{ dataDic.licenseId || '--' }}</text>
				</view>
				<view class="icon-car-right-med" style="color:#8C8C8C">
					<text>{{ dataDic.typeName || '--' }}</text>
					<text style="margin-left: 3px;margin-right: 3px;">|</text>
					<text>{{ dataDic.heightName || '--' }}</text>
					<text style="margin-left: 3px;margin-right: 3px;">|</text>
					<text>{{ dataDic.brand || '--' }}</text>
					<text style="margin-left: 3px;margin-right: 3px;">|</text>
					<text>{{ dataDic.machineTypeName || '--' }}</text>
				</view>
				<view class="icon-car-right-med">
					<view class="icon-car-right-state-rent renting" v-if="dataDic.subletState == '1'">
						<text>转租中</text>
					</view>
					<view class="icon-car-right-state-rent" v-if="dataDic.subletState == '2'">
						<text>已还租</text>
					</view>

				</view>
			</view>
			<view class="line-s"></view>
		</view>
		<view class="bgcon">
			<view class="row">
				<text class="text-gray">区域：</text>
				<text class="text-dark">{{ dataDic.address || '--' }}</text>
			</view>
			<view class="row my">
				<view>
					<text class="text-gray">起租日期：</text>
					<text class="text-dark">{{ changestr(dataDic.actualSubletDate) || '--' }}</text>
				</view>
				<view>
					<text class="text-gray">还租日期：</text>
					<text class="text-dark">{{ changestr(dataDic.rentBackDate) || '--' }}</text>
				</view>
			</view>
			<view class="row">
				<text class="text-gray">备注： </text>
				<text class="text-dark">{{ dataDic.remark || '--' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import qrcodeImg from './record-qrcode-img.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		badgeview,
		qrcodeImg,
		uniPopup
	},
	props: {
		isShowQrCode: {
			type: Boolean,
			default: false
		},
		isShowUPDATA: {
			type: Boolean,
			default: true
		},
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		},
		qrcodeUrl: {
			type: String,
			default: ''
		},
		downloadQrcodeUrl: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			deviceIcon: {
				'3': 'iconzl--zhibiche',
				'4': 'iconzl--jianchache1',
				'2': 'iconzl--jianchache',
				'1': 'iconzl--jianchache1'
			},
			isEx: false,
			salePrice: ''
		};
	},
	watch: {
		salePrice(val) {
			this.salePrice = val;
			setTimeout(() => {
				this.salePrice = this.$gxfmethod.getMoneyPart(val);
			}, 10);
		}
	},
	methods: {
		gotoAddress() {
			uni.openLocation({
				latitude: parseFloat(this.dataDic.amaplatitudeNum),
				longitude: parseFloat(this.dataDic.amaplongitudeNum),
				name: this.dataDic.address,
				address: this.dataDic.address
			});
		},
		goImg() {
			this.$emit('goToImage', '');
		},
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		exportArrow() {
			this.isEx = !this.isEx;
		},
		editPrice() {
			if (!this.isShowUPDATA) {
				return;
			}
			this.salePrice = this.dataDic.machineMillPrice || '';
			this.$emit('canScroll', '0');
			this.$refs.startDialog.open();
		},
		cancelDialog() {
			this.$refs.startDialog.close();
			this.$emit('canScroll', '1');
		},
		confirmDialog() {
			if (this.salePrice === '') {
				uni.showToast({
					icon: 'none',
					title: '请输入车辆初始价格'
				});
				return;
			}
			//
			uni.showLoading();
			let urlstr = this.$url.MACHINE_UPDATA_PRICE;
			let param = {
				id: this.dataDic.id,
				machineMillPrice: this.salePrice.toString()
			};
			this.$network
				.getData(urlstr, 'PUT', param)
				.then(result => {
					setTimeout(() => {
						this.dataDic = {
							...this.dataDic,
							machineMillPrice: this.salePrice.toString()
						};
						this.$refs.startDialog.close();
						this.$emit('canScroll', '1');
						uni.hideLoading();
					}, 100);
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		}
	}
};
</script>

<style scoped lang="scss">
.car-message-view {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	width: 100%;
	z-index: 200;
}

.r-head-view {
	display: flex;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	margin: 0px 8px;
	padding: 12px 8px;
	border-radius: 12px;
	color: #8C8C8C;
	border-bottom: 1px solid #E6E6E6;
}

.icon-car {
	display: flex;
	width: 45px;
	height: 45px;
	padding: 3px;
	border-radius: 8px;
	border: 1px $uni-line-color solid;
	align-items: center;
	justify-content: center;
	background: #ffffff;
}

.icon-view {
	font-size: 80upx;
	color: #fc0000;
}

.icon-car-right {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.icon-car-right-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}

.licenseIdStyle {
	margin-left: 10rpx;
	color: #e60000;
	background: #fff1f0;
	border-radius: 10px;
	padding: 3rpx 10px;
	font-size: 24rpx;
}

.icon-car-right-med {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #ffffff;
	font-size: 11px;
	margin-left: 10px;
	padding: 3px 0px;
}

.icon-car-right-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}

.icon-right {
	font-size: 20px;
	color: #999999;
	font-weight: bold;
}

.icon-car-right-state {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 5px;
	margin-left: 10px;
}

.bottom-btns-list {
	display: flex;
	flex-direction: column;
	margin: 12px 0px 0px 0px;
	padding-bottom: 12px;
	border-bottom: $uni-line-color 1px solid;
}

.bottom-btns-list-last {
	display: flex;
	flex-direction: column;
	margin: 12px 0px 0px 0px;
}

.cell-bg-row {
	display: flex;
	flex: 1;
	padding: 4px 8px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

.cell-line-row {
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

.cell-line-value {
	font-size: $uni-font-size-base;
	color: #333333;
}

.cell-line-tag {
	font-size: $uni-font-size-base;
	color: $uni-text-color-gray;
	margin-right: 5px;
	min-width: 60px;
}

.icon-car-right-state-rent {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #ffffff;
	font-size: $uni-font-size-sm;
	padding: 2px 10px;
	background: #F08200;
	border-radius: 5px;
}
.renting{
	background-color: #52C41A;
}
.icon-car-right-state-wait {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: #ffffff;
	font-size: $uni-font-size-sm;
	padding: 2px 10px;
	background: #f0ad4e;
	border-radius: 5px;
}

.export-arrow-view {
	display: flex;
	flex-direction: row;
	margin: 12px 17px;
	background: #f0f2f4;
	border-radius: 4px;
	padding: 10px 0px;
	justify-content: center;
	align-items: center;
	flex: 1;
	font-size: $uni-font-size-base;
	color: #555555;
}

.icon-ex {
	margin-left: 5px;
}

.icon-add {
	margin-left: 5px;
	color: $uni-color-primary;
	font-size: 15px;
}

//tip
.pop-container {
	position: relative;
}

.uni-tip {
	display: flex;
	flex-direction: column;
	padding: 15px;
	width: 80vx;
	background-color: #fff;
	border-radius: 10px;
}

.tip-title {
	padding: 5px;
	border-bottom: $uni-line-color 1px solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
}

.row-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin: 5px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: $uni-line-color 1px solid;
}

.row-tag {
	width: 98px;
	text-align: left;
}

.input-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding-top: 10px;
	padding-bottom: 10px;
	flex: 1;
}

.text-style {
	flex: 1;
	text-align: left;
	font-size: $uni-font-size-base;
}

.left-style {
	display: flex;
	margin-left: 10px;
}

.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 10px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 5px;
	font-size: $uni-font-size-base;
}

.pop-cancel {
	margin-right: 5px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}

.pop-confirm {
	color: #ffffff;
	margin-left: 5px;
	background: $uni-color-primary;
	border-radius: 4px;
}

.bgcon {
	padding: 16rpx 24rpx;
}

.text-gray {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #8C8C8C;
}

.text-dark {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #222222;
}
.row{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	line-height: 50rpx;
}
.my{
	justify-content: space-between;
	margin-right: 30rpx;
}
</style>
