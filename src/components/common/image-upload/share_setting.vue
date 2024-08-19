<template>
	<view class="img-upload-view">
		<view class="top-view">
			<view class="show-bg-view">
				<i class="iconfont cellImg iconzl--zhushi"></i>
				<text class="showtitle">只有图片和PDF格式的附件可以分享</text>
			</view>
			<view class="show-bottom-view">
				<text class="showsub">是否公开</text>
				<!-- <i class="iconfont cellImg iconzl--zhushi"></i> -->
			</view>
		</view>
		<view class="img-bg-view">
			<list class="list-view">
				<cell v-for="(item, index) in imgurllist" :key="index" class="cell-style">
					<view class="img-upload-img">
						<image class="downbtn" src="/static/xiazai.png" @click="downDocument(item)" v-if="isdoc(item)" />
						<image class="img" :src="urltonewurl(item.url)" @click="lookpic(index)" />
					</view>
					<view class="name-style">{{isdoc(item) ? item.name : ''}}</view>
					<switch 
					:checked="item.sharePermission == '2' ? true : false"
					:disabled="isprivtedoc(item)"
					class="switch-style" 
					color="#E60000"
					@change="changePublic(item,index)"
					/>
				</cell>
			</list>
			<button class="btnstyle" @click="oksave">{{ '保存' }}</button>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			imgurllist: [],
			type: 'prepare_type',
			businessNo: '',
		};
	},
	onLoad(option) {
		let itemDic = JSON.parse(decodeURIComponent(option.item));
		let typestring = itemDic.typestring
		this.type = itemDic.type || 'prepare_type';
		if(typestring == 'jx'){
			this.businessNo = itemDic.businessNo;
		}else if(typestring == 'battery'){
			this.businessNo = itemDic.licenseId;
		}else{
			this.businessNo = itemDic.id;
		}
		this.getDeatail(this.businessNo);
	},
	methods: {
		isdoc(item) {
			if (item.filePath) {
				let fileName = item.filePath;
				let suffixIndex = fileName.lastIndexOf('.');
				let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
				if (suffix != 'BMP' && suffix != 'JPG' && suffix != 'JPEG' && suffix != 'PNG' && suffix != 'GIF') {
					return true;
				}
			}
			return false;
		},
		isprivtedoc(item) {
			if (item.filePath) {
				let fileName = item.filePath;
				let suffixIndex = fileName.lastIndexOf('.');
				let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
				if (suffix != 'BMP' && suffix != 'JPG' && suffix != 'JPEG' && suffix != 'PNG' && suffix != 'GIF' && suffix != 'PDF') {
					return true;
				}
			}
			return false;
		},
		changePublic(item,index){
			console.log('33333');
			let dict = {
				...item,
				sharePermission:item.sharePermission == '1' ? '2' : '1'
			}
			this.imgurllist.splice(index,1,dict);
		},
		urltonewurl(url) {
			if (url) {
				let fileName = url.split('?')[0];
				let suffixIndex = fileName.lastIndexOf('.');
				let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
				if (suffix == 'BMP' || suffix == 'JPG' || suffix == 'JPEG' || suffix == 'PNG' || suffix == 'GIF' || suffix == 'ICO' || suffix == 'WEBP') {
					let urlStr = url.replace(/\+/g, '%2B');
					return urlStr;
				} else {
					if (suffix == 'PDF') {
						return '/static/zl-pdf.png';
					}
					if (suffix == 'TXT' || suffix == 'TEXT') {
						return '/static/zl-text.png';
					}
					if (suffix == 'DOC' || suffix == 'DOCX') {
						return '/static/zl-word.png';
					}
					if (suffix == 'XLS' || suffix == 'XLSX'|| suffix == 'CSV') {
						return '/static/zl-xlsx.png';
					}
					if (suffix == 'PPT' || suffix == 'PPTX') {
						return '/static/zl-ppt.png';
					}
				}
			}
			return '';
		},
		getDeatail(key) {
			uni.showLoading();
			let param = {
				businessNo: key
			};
			let url = this.$url.CONTRACT_FILELIST_FIND_USER;
			this.$network
				.getData(url, 'GET', param)
				.then(result => {
					this.imgurllist = result?result:[];;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//保存
		oksave() {
			uni.showLoading();
			let shareList = this.imgurllist.map(o=>{
				return {
					rentalFileId:o.id,
					sharePermission:o.sharePermission
				}
			})
			let url = this.$url.PUBLIC_FILE_DEAL;
			this.$network
				.getData(url, 'POST', shareList)
				.then(result => {
					uni.showToast({
						icon: 'none',
						title: '设置成功'
					});
					uni.$emit('refresh-image-list', {
						type: 'contract'
					});
					uni.navigateBack({
						delta: 1,
						animationDuration:100
					});
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		},
		//浏览
		lookpic(index) {
			if (this.isdoc(this.imgurllist[index])) {
				return;
			}
			let urlarr = [];
			let docarr = [];
			this.imgurllist.forEach(o => {
				if (this.isdoc(o) === false) {
					urlarr.push(this.urltonewurl(o.url));
				} else {
					docarr.push(this.urltonewurl(o.url));
				}
			});
			let urlstr = this.imgurllist[index].url;
			let num = urlarr.findIndex((value)=>value==urlstr);
			uni.previewImage({
				current: num,
				urls: urlarr
			});
		},
		downDocument(item) {
			uni.showLoading({
				title: '正在下载中,请稍等...',
				mask: true
			});
			let url = item.url;
			// this.downstart(url);
			this.$gxfmethod.downFunc(url)
		},
		// downstart(url, headerDic) {
		// 	uni.downloadFile({
		// 		url: url,
		// 		success: res => {
		// 			console.log(res);
		// 			let filePath = res.tempFilePath;
		// 			let platform = uni.getSystemInfoSync().platform;
		// 			if (platform === 'android') {
		// 				uni.saveFile({
		// 					tempFilePath: filePath,
		// 					success: function(res) {
		// 						var savedFilePath = res.savedFilePath;
		// 						uni.openDocument({
		// 							filePath: savedFilePath,
		// 							success: function(res) {
		// 								console.log(res);
		// 								console.log('打开文档成功');
		// 								uni.hideLoading();
		// 							},
		// 							fail: error => {
		// 								uni.showToast({
		// 									icon: 'none',
		// 									title: '下载失败'
		// 								});
		// 							}
		// 						});
		// 					},
		// 					fail: error => {
		// 						uni.showToast({
		// 							icon: 'none',
		// 							title: '下载失败'
		// 						});
		// 					}
		// 				});
		// 			} else {
		// 				uni.openDocument({
		// 					filePath: escape(filePath),
		// 					success: function(res) {
		// 						console.log(res);
		// 						console.log('打开文档成功');
		// 						uni.hideLoading();
		// 					},
		// 					fail: error => {
		// 						uni.showToast({
		// 							icon: 'none',
		// 							title: '下载失败'
		// 						});
		// 					}
		// 				});
		// 			}
		// 		},
		// 		fail: error => {
		// 			console.log(error);
		// 			uni.showToast({
		// 				icon: 'none',
		// 				title: '下载失败'
		// 			});
		// 		}
		// 	});
		// }
	},
};
</script>

<style lang="scss" scoped>
.img-upload-view {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;

.top-view{
	width:100%;
	top:0px;
	position:sticky;
	padding: 10px 0px;
	background-color: #FFFFFF;
	z-index: 200;
}
}
.show-bg-view{
	display: flex;
	flex-direction: row;
}
.cellImg{
	font-size: 15px;
	margin-left: 20px;
	color: $uni-color-primary;
}
.showtitle{
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	margin-left: 5px;
}
.img-upload-img {
	position: relative;
	height: 60px;
	align-items: center;
	justify-content: flex-start;
	margin-left: 10px;
}
.show-bottom-view{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin-top: 30px;
	margin-right: 10px;
}
.showsub{
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	margin-left: 5px;
	width: 70px;
}
.cellImg{
	font-size: 15px;
	margin-left: 5px;
	color: $uni-color-primary;
}
.img-bg-view {
	display: flex;
	flex: 1;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.list-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-bottom: 70px;
}
.cell-style{
	display: flex;
	background: #FFFFFF;
	margin-top: 5px;
	padding: 5px 0px;
	flex-direction: row;
	align-items: center;
}
.img {
	height: 50px;
	width: 50px;
	padding: 5px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
}
.btnstyle {
	position: fixed;
	bottom: calc(10px + env(safe-area-inset-bottom));
	left: 10%;
	width: 80%;
	height: 40px;
	font-size: 14px;
	background: $uni-color-primary;
	text-align: center;
	line-height: 40px;
	color: #ffffff;
}
.downbtn {
	position: absolute;
	height: 15px;
	width: 15px;
	bottom: 0;
	right: 0;
	z-index: 300;
	padding: 3px;
}
.name-style{
	flex: 1;
	margin-left: 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.switch-style{
	transform: scale(0.7);
	margin-right: 10px;
	margin-left: 10px;
	width: 70px;
}
</style>
