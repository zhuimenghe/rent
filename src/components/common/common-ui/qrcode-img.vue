<template>
	<view>
		<image class="qrcode-img" :style="{height:imgHeight,width:imgWidth}" @click="preview" :src="url"></image>
	</view>
</template>

<script>
	export default {
		props: {
			url: {
				type: String,
				default: ''
			},
			imgHeight: {
				type: String,
				default: '90px'
			},
			imgWidth: {
				type: String,
				default: '90px'
			},
			downloadUrl:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
				time: null,
				downloadTask: null
			}
		},
		methods: {
			preview() {
				uni.previewImage({
					urls: [this.url],
					longPressActions: {
						itemList: ['保存图片'],
						success: (data) => {
							this.saveImgToLocal();
						},
						fail: (err) => {
							console.log(err.errMsg);
						}
					}
				});
			},
			saveImgToLocal() {
				
				uni.showModal({
					title: '提示',
					content: '确定保存到相册吗',
					success: (res) => {
						if (res.confirm) {
							if (this.downloadTask) {
								this.downloadTask=null;
							}
							console.log(this.downloadUrl)
							this.downloadTask = uni.downloadFile({
								url:this.downloadUrl, //图片地址
								success: (res) => {
									console.log("download==" + JSON.stringify(res))
									if (res.statusCode === 200) {
										uni.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: () => {
												uni.showToast({
													title: "保存成功",
													icon: "none"
												});
												if (this.downloadTask) {
													this.downloadTask.abort();
												}
											},
											fail: () => {
												uni.showToast({
													title: "保存失败",
													icon: "none"
												});
											}
										});
									}
								}
							})

						} else if (res.cancel) {

						}
					}
				});

			},
			goToWechat() {
				// #ifdef APP-PLUS
				console.log("goToWechat");

				if (plus.runtime.isApplicationExist({
						pname: 'com.tencent.mm',
						action: 'weixin://'
					})) {
					// plus.runtime.openURL('weixin://dl/business/?ticket=t852de9efd9b540df8b355699d4f2ed63')
					console.log("微信应用已安装");

					if (plus.os.name == "iOS") {
						plus.runtime.openURL("weixin://")
					} else {
						plus.runtime.launchApplication({
								pname: 'com.tencent.mm',
								// extra: {
								// 	url: "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzODU4NzkyOQ==&scene=110#wechat_redirect"
								// }
							},
							function(e) {
								console.log('Open system default browser failed: ' + JSON.stringify(e));
							}
						);
					}

				} else {
					uni.showToast({
						icon: "none",
						title: '微信应用未安装'
					})
				}
				// #endif
			}
		},
		onUnload() {
			if (this.downloadTask) {
				this.downloadTask=null;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: #FFFFFF;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.qrcode-img {
		width: 220px;
		height: 220px;
		margin-bottom: 16px;
	}

	.qrcode-tip {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		display: flex;
		flex-direction: row;
	}
</style>
