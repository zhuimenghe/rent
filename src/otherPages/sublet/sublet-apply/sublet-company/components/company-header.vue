<template>
	<view class="header-container">
		<view>
			<view class="row-line-between">
				<view class="header-title row-line" style="flex: 1">
					<view style="line-height: 20px; padding-left: 10px">
						{{ companyInfo.name || '' }}
					</view>
				</view>
			</view>
			<view class="head-content">
				<view class="content-text">区域：{{ companyInfo.orgName || '-' }}</view>
				<view class="content-text">联系人：{{ companyInfo.contact || '-' }}</view>
				<view class="content-text">地址：{{ companyInfo.address || '-' }}</view>
				<view class="row-line-between content-text">
					电话：
					{{ companyInfo.phone || '-' }}
					<i class="iconfont phone-icon icondianhua" @click.stop="callPhone(companyInfo.phone)"></i>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		companyInfo: {
			type: Object
		}
	},
	data() {
		return {};
	}, methods: {
		callPhone(phone) {
			if (!this.isedit && phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: res => {
						console.log('调用成功!');
					},
					fail: res => {
						console.log('调用失败!');
					}
				});
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.header-container {
	margin-top: 10px;
	// margin-bottom: 12px;
	padding: 12px 12px 12px 0px;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	color: #8c8c8c;
}

.header-title {
	line-height: 26px;
	font-size: 14px;
	font-weight: 800;
	color: #222222;
}

.head-content {
	margin-left: 12px;
	margin-top: 35rpx;
	background: #f6f6f6;
	padding: 12px 10px;
	font-size: 14px;
	color: #8c8c8c;
	display: flex;
	flex-direction: column;

	.content-text {
		line-height: 30px;
	}

	.row-line-right {
		display: flex;
		flex-direction: row-reverse;
	}

	.phone-icon {
		background-color: rgba(230, 0, 0, 0.08);
		color: #e60000;
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		margin-right: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
	}
}
</style>
