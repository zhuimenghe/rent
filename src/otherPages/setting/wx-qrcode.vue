<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view>
			<image class="qrcode-img" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend"
			 :src="qrcodeImg"></image>
		</view>
		<view class="qrcode-tip">长按保存二维码到相册，<view style='color: #E60000;' @tap='goToWechat'>去微信</view>绑定用户</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: null,
				downloadTask: null,
				qrcodeImg: 'http://rentalbayfile-stage.oss-cn-shanghai.aliyuncs.com/weixin/QzpcVXNlcnNcYWRtaW5cQXBwRGF0YVxSb2FtaW5nXERpbmdUYWxrXDM3OTkzMTg4X3YyXEltYWdlRmlsZXNcMTU5MTc3MDc4NTIxNl9xcmNvZGVfZm9yX2doX2Q1ZDBlYTZhYzFjM18yNTguanBn.jpg?OSSAccessKeyId=LTAI4FpBhdK7MBfSXDq6k2KB&Expires=37591967419&Signature=aWHBOwNeQKVsuB7yLyYi9lJvru0%3D'
			}
		},
		methods: {
			handletouchstart(e) {
				this.time = setTimeout(() => {
					this.onLongPress(e)
				}, 1000); //这里设置定时器，定义长按1000毫秒触发长按事件，时间可以自己改，  
				return false;
			},
			handletouchend() {
				clearTimeout(this.time); //清除定时器    
				if (this.time != 0) {
					//处理点击时间  
				}
				return false;
			},
			handletouchmove() {
				clearTimeout(this.time); //清除定时器    
				this.time = 0;
			},
			onLongPress() {
				// 处理长按事件  
				this.saveImgToLocal();
			},
			saveImgToLocal() {
				uni.showModal({
					title: '提示',
					content: '确定保存到相册吗',
					success: (res) => {
						if (res.confirm) {
							if (this.downloadTask) {
								this.downloadTask.abort();
							}
							this.downloadTask = uni.downloadFile({
								url: this.qrcodeImg, //图片地址
								success: (res) => {
									console.log("download=="+JSON.stringify(res))
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
					
					 if(plus.os.name == "iOS") {  
					     plus.runtime.openURL("weixin://") 
					}else{
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
				this.downloadTask.abort();
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
