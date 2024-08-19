<template>
	<view v-if="visible" class="mark">
		<view class="view">
			<text class="title">{{title}}</text>
			<scroll-view class="scroll" scroll-y>
				<view class="item" v-for="(item,index) in contents" :key="index">
					{{item}}
				</view>
			</scroll-view>
			<view v-if="!downloading" class="btns">
				<view v-if="!forced" class="cancel" @click="onCancelClick()">下次再说</view>
				<view class="sure" @click="onSureClick()">马上升级</view>
			</view>
			<cmd-progress v-else class="progress" type="circle" stroke-color="#E60000" :percent="progress" />
		</view>
	</view>
</template>
<script>
	import cmdProgress from '../cmd-progress/cmd-progress.vue'
	export default {
		name: "uniUpgrade",
		components: {
			cmdProgress
		},
		data() {
			return {
				visible: false,
				progress: 0,
				contents: [],
				downloading: false,
				success: true
			}
		},
		props: {
			forced: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: '版本更新'
			},
			content: {
				type: String,
				default: ""
			},
			description: {
				type: String,
				default: ""
			},
			downloadUrl: {
				type: String,
				default: ""
			},
			updateCode: {
				type: [String, Number],
				default: ''
			}
		},
		watch: {
			description(val) {
				var strs = this.description.split('；')
				for (var i = 0; i < strs.length; i++) {
					this.contents.push(strs[i])
				}
			}
		},
		methods: {
			show() {
				setTimeout(() => {
					if (this.success) {
						this.visible = true
					}
				}, 100);
			},
			hide() {
				setTimeout(() => {
					this.visible = false
				}, 100);
			},
			onCancelClick() {
				if (this.updateCode) {
					uni.setStorage({
						key: 'updateVersion',
						data: this.updateCode
					})
				}
				this.hide()
			},
			onSureClick() {
				// #ifdef APP-PLUS
				var platform = uni.getSystemInfoSync().platform
				if (platform == 'ios') {
					 plus.runtime.openURL(this.downloadUrl);
				} else {
					this.downloading = true
					var downloadTask = uni.downloadFile({
						url: this.downloadUrl,
						success: (downloadResult) => {
							console.log(downloadResult);
							this.hide()
							if (downloadResult.statusCode === 200) {
								plus.runtime.install(downloadResult.tempFilePath, {
									force: false
								}, function() {
									plus.runtime.restart();
								}, (e) => {
									console.log(e);
									this.success = false
									uni.showToast({
										title: '安装升级包失败',
										icon: 'none'
									})
								});
							}
						}
					});
					downloadTask.onProgressUpdate((e) => {
						this.progress = e.progress
					})
				}
				// #endif
			}
		},
	}
</script>

<style lang="scss" scoped>
	.mark {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.view {
		width: 80vw;
		background-color: white;
		border-radius: 15upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: center;
	}

	.title {
		margin-top: 20upx;
		color: $uni-color-primary;
		font-weight: bold;
		font-size: 38upx;
		text-align: center;
	}


	.scroll {
		width: 100%;
		height: 300upx;
		margin-top: 32upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.item {
		margin-left: 50upx;
		text-align: left;
		font-size: 30upx;
	}

	.btns {
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		border-width: 1px 0px 0px 0px;
		padding-bottom: 10upx;
		border-style: solid;
		border-color: $uni-bg-color-grey;
	}

	.icon {
		width: 45upx;
		height: 45upx;
		margin-right: 10upx;
	}

	.sure {
		padding: 10upx 0;
		text-align: center;
		color: $uni-color-primary;
		font-size: 30upx;
		margin-top: 10upx;
		flex: 1;
		font-weight: 500;
	}

	.cancel {
		padding: 10upx 0;
		text-align: center;
		margin-top: 10upx;
		flex: 1;
		color: $uni-text-color-gray;
		font-size: 30upx;
		font-weight: 500;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
	}

	.progress {
		margin-bottom: 20upx;
	}
</style>
