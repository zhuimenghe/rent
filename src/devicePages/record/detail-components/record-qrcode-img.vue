<template>
	<view @tap="preview">
		<i class="iconfont qrcode-img iconqrcode" :style="{color:color}"></i>
	</view>
</template>

<script>
export default {
	props: {
		url: {
			type: String,
			default: ''
		},
		downloadUrl: {
			type: String,
			default: ''
		},
		color:{
			type: String,
			default: '#FFFFFF'
		}
	},
	data() {
		return {
			downloadTask: null
		};
	},
	methods: {
		preview() {
			console.log(this.url)
			uni.previewImage({
				urls: [this.url],
        showmenu:true,
				// longPressActions: {
				// 	itemList: ['保存图片'],
				// 	success: data => {
				// 		this.saveImgToLocal();
				// 	},
				// 	fail: err => {
				// 		console.log(err.errMsg);
				// 	}
				// }
			});
		},
		saveImgToLocal() {
			uni.showModal({
				title: '提示',
				content: '确定保存到相册吗',
				success: res => {
					if (res.confirm) {
						if (this.downloadTask) {
							this.downloadTask = null;
						}
						console.log(this.downloadUrl);
						this.downloadTask = uni.downloadFile({
							url: this.downloadUrl, //图片地址
							success: res => {
								console.log('download==' + JSON.stringify(res));
								if (res.statusCode === 200) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: () => {
											uni.showToast({
												title: '保存成功',
												icon: 'none'
											});
											if (this.downloadTask) {
												this.downloadTask.abort();
											}
										},
										fail: () => {
											uni.showToast({
												title: '保存失败',
												icon: 'none'
											});
										}
									});
								}
							}
						});
					} else if (res.cancel) {
					}
				}
			});
		},
	},
	onUnload() {
		if (this.downloadTask) {
			this.downloadTask = null;
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.qrcode-img {
	color: #FFFFFF;
	font-size: 30px;
}
</style>
