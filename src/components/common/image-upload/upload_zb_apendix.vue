<template>
  <view class="img-upload-view">
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">附件上传</c-nav-bar-btns>
    <list class="list-view">
      <cell class="list-view-cell">
        <view v-for="(item, index) in imgurllist" :key="index">
          <view class="img-upload-img">
            <image class="yulan" src="/static/yulan.png"
              v-if="item.sharePermission == '2' && isshowShare ? true : false" />
            <image class="closeimg" src="/static/closeimg.png" @click="deleteImg(index)" v-if="isupload" />
            <image class="downbtn" src="/static/xiazai.png" @click="downDocument(item)" v-if="isdoc(item)" />
            <image class="img" :src="urltonewurl(item.url)" @click="lookpic(index)" />
          </view>
        </view>
        <view v-if="showAddView && isupload">
          <view class="img-upload-img" @click="addimgWithPhone">
            <image class="img" src="/static/addimg.png" />
          </view>
        </view>
      </cell>

    </list>
    <c-water-image-picker ref="picker" @confirm="imgsConfrim"></c-water-image-picker>
    <button class="btnstyle" @click="oksave" v-if="isupload">{{ '确定' }}</button>
  </view>
</template>
<script>
export default {
  data() {
    return {
      navBtns: [
        {
          "text": "分享设置",
          "type": "none",
          "fontSize": "14px",
          "color": "#E60000",
          "width": "auto"
        }
      ],
      imglist: [],
      imgurllist: [],
      showAddView: true,
      isupload: true,
      type: 'prepare_type',
      uploadType: 'attachment',
      maximg: 60,
      businessNo: '',
      typestring: '',
      refreshType: '',//刷新添加附件的列表
      dataDic: {},
      isshowShare: false
    };
  },
  onLoad(option) {
    let itemDic = JSON.parse(decodeURIComponent(option.item));
    let isedit = option.isedit;
    if (isedit === 'false') {
      this.showAddView = false;
      this.isupload = false;
    }
    if (option.type) {
      this.typestring = option.type;
    }
    if (option.refreshType) {
      this.refreshType = option.refreshType;
    }
    this.type = option.filetype || 'prepare_type';
    // console.log(JSON.stringify(itemDic));
    if (this.typestring == 'jx') {
      this.businessNo = itemDic.businessNo;
    } else if (this.typestring == 'battery') {
      this.businessNo = itemDic.licenseId;
    } else {
      this.businessNo = itemDic.id;
    }
    let data = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    let SharePoint = data.some(x => x.value === this.$savekey.PERMISSION_SHARE_SETTING);
    if (SharePoint && option.isshowShare && option.isshowShare == '1') {
      this.isshowShare = true
    }
    this.dataDic = {
      ...itemDic,
      type: this.type,
      typestring: this.typestring
    }
    // this.businessNo = itemDic.id;
    this.getDeatail(this.businessNo);
    if (this.isshowShare == false) {
      // #ifdef APP-PLUS
      let webView = this.$mp.page.$getAppWebview();
      webView.setTitleNViewButtonStyle(0, {
        width: '0',
      });
      // #endif
      // #ifndef APP-PLUS
      this.navBtns = []
      // #endif
    }
    uni.$on('refresh-image-list', usnerinfo => {
      this.getDeatail(this.businessNo);
    });
  },
  methods: {
    onNavBarButtonTap() {
      if (this.imgurllist.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '请先上传完附件后再继续做分享设置'
        })
        return
      }
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
        fileList: this.imgurllist
      };
      let url = this.$url.CONTRACT_FILELIST_SAVE_USER;
      this.$network.getData(url, 'POST', param).then(result => {
        let url = "/components/common/image-upload/share_setting?item=" + encodeURIComponent(JSON.stringify(this.dataDic))
        uni.navigateTo({
          url: url,
        })
        uni.hideLoading();
      }).catch(err => {
        uni.showToast({
          icon: 'none',
          title: err.message
        });
      });
    },
    isdoc(item) {
      if (item.filePath || item.name) {
        let fileName = item.filePath || item.name;
        let suffixIndex = fileName.lastIndexOf('.');
        let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
        if (suffix != 'BMP' && suffix != 'JPG' && suffix != 'JPEG' && suffix != 'PNG' && suffix != 'GIF') {
          return true;
        }
      }
      return false;
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
          if (suffix == 'XLS' || suffix == 'XLSX' || suffix == 'CSV') {
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
        businessNo: key,
        licenseId: this.type == 'vehicle_type' ? this.dataDic.licenseId : ''
      };
      let url = this.type == 'vehicle_type' ? this.$url.MACHINE_FILELIST : this.$url.CONTRACT_FILELIST_FIND_USER;
      this.$network
        .getData(url, 'GET', param)
        .then(result => {
          this.imgurllist = result ? result : [];
          if (this.imgurllist.length < this.maximg && this.showAddView) {
            this.showAddView = true;
          } else {
            this.showAddView = false;
          }
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
        });
    },
    //保存
    oksave() {
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
        fileList: this.imgurllist
      };
      let url = this.$url.CONTRACT_FILELIST_SAVE_USER;
      this.$network
        .getData(url, 'POST', param)
        .then(result => {
          uni.showToast({
            icon: 'none',
            title: '保存附件成功'
          });
          uni.$emit('refresh-contract-list', {
            type: 'contract'
          });
          uni.$emit('refresh-list', {
            type: 'contract'
          });
          uni.$emit('refreshData-repair')
          uni.$emit('refresh-maintain')
          uni.$emit('refreshData-overhaul')
          uni.$emit('refresh-polling')
          uni.$emit('refresh-battery-list')
          uni.$emit('refresh-insurance-list')
          uni.$emit('refresh-record-list')
          if (this.refreshType) {
            uni.$emit(this.refreshType)
          }
          uni.navigateBack({
            delta: 1
          });
        })
        .catch(err => {
          uni.showToast({
            icon: 'none',
            title: err.message
          });
        });
    },
    dealData(list) {
      let dealList = list.map(o => {
        return {
          ...o
        };
      });
      this.imgurllist = this.imgurllist.concat(dealList);
      if (this.imgurllist.length === this.maximg) {
        this.showAddView = false;
      } else {
        this.showAddView = true;
      }
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
      let num = urlarr.findIndex((value) => value == urlstr);
      uni.previewImage({
        current: num,
        urls: urlarr
      });
    },
    //删除
    deleteImg(index) {
      uni.showModal({
        title: "提示",
        content: "确认删除该附件么?",
        success: (res) => {
          if (res.confirm) {
            uni.showLoading();
            let item = this.imgurllist[index];
            if (item.id) {
              let url = this.$url.UPLOAD_IMG_DELETE + item.id;
              this.$network.getData(url, 'DELETE', null).then(result => {
                this.imgurllist.splice(index, 1);
                this.showAddView = true;
                uni.$emit('refresh-contract-list', {
                  type: 'contract'
                });
                uni.$emit('refresh-list', {
                  type: 'contract'
                });
                uni.$emit('refreshData-repair')
                uni.$emit('refresh-maintain')
                uni.$emit('refreshData-overhaul')
                uni.$emit('refresh-polling')
                uni.$emit('refresh-record-list')
                uni.hideLoading()
              }).catch(err => {
                uni.showToast({
                  icon: 'none',
                  title: err.message
                })
              });
            } else {
              this.imgurllist.splice(index, 1);
              this.showAddView = true;
              uni.$emit('refresh-contract-list', {
                type: 'contract'
              });
              uni.$emit('refresh-list', {
                type: 'contract'
              });
              uni.$emit('refreshData-repair')
              uni.$emit('refresh-maintain')
              uni.$emit('refreshData-overhaul')
              uni.$emit('refresh-polling')
              uni.$emit('refresh-record-list')
              uni.hideLoading()
            }
          }
        }
      })
    },
    //添加
    addimgWithPhone() {
      let max = this.maximg - this.imgurllist.length;
      if (max <= 0) {
        return;
      }
      this.$refs.picker.show(max)
      // uni.chooseImage({
      // 	count: max,
      // 	success: chooseImageRes => {
      // 		let tempFiles = chooseImageRes.tempFiles;
      // 		let list = tempFiles.map(item => {
      // 			return {
      // 				url: item.path
      // 			};
      // 		});
      // 		this.imglist = [...list];
      // 		this.uploadWithAll();
      // 	},
      // 	fail: error => {
      // 		uni.hideLoading();
      // 	}
      // });
    },
    imgsConfrim(tempFiles) {
      console.log(tempFiles);
      let list = tempFiles.map((item) => {
        return {
          url: item,
        };
      });
      this.imglist = [...list];
      this.uploadWithAll();
    },
    //上传全部
    uploadWithAll() {
      let headerDic = {
        'Content-Type': 'application/json',
        Authorization: ''
      };
      let loginMes = uni.getStorageSync('loginMesage');
      if (loginMes) {
        let access_token = loginMes.token_type + ' ' + loginMes.access_token;
        headerDic.Authorization = access_token;
      }
      let list = this.imglist.map((item, index) => {
        let timestr = new Date().getTime().toString();
        return {
          uri: item.url,
          name: timestr
        };
      });
      let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
      this.upload(uploadUrl, headerDic, list, 'file', this.type, this.uploadType).then(obj => {
        this.dealData(obj);
      });
    },
    //单一循环
    upload(uploadUrl, headerDic, path_arr, name, type, uploadTYpe) {
      console.log(uploadUrl, headerDic, path_arr, name, type, uploadTYpe);
      let num = path_arr.length;
      return new Promise(async (resolve, reject) => {
        let img_urls = [];
        for (let i = 0; i < num; i++) {
          let filePath = path_arr[i].uri;
          if (filePath.substring(0, 4) != 'http' || process.env.NODE_ENV == 'development') {
            // let img_url = await this.uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe, i);
            // img_urls.push(img_url.result);
            await this.uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe, i).then((img_url) => {
              img_urls.push(img_url.result);
            }).catch((error) => {
              console.log("error");
            })
          }
        }
        resolve(img_urls);
      });
    },
    //上传单张照片
    uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe, index) {
      return new Promise((resolve, reject) => {
        uni.showLoading({
          mask: true,
          title: '第' + (index + 1).toString() + '张上传中'
        });
        let uploadTask = uni.uploadFile({
          url: uploadUrl,
          filePath: filePath,
          name: name,
          formData: {
            type: type,
            uploadType: uploadTYpe
          },
          header: headerDic,
          success: uploadFileRes => {
            uni.hideLoading();
            let resData = uploadFileRes.data ? JSON.parse(uploadFileRes.data) : {};
            if (resData.code && resData.code == 200) {
              console.log("sucess");
              resolve(resData);
            } else {
              console.log("fail");
              reject("error");
            }
          },
          fail: error => {
            uni.hideLoading();
            reject(error);
          }
        });
      });
    },
    downDocument(item) {
      uni.showLoading({
        title: '正在下载中,请稍等...',
        mask: true
      });
      let url = item.url;
			this.$gxfmethod.downFunc(url)
      // this.downstart(url);
    },
    // downstart(url, headerDic) {
    //   uni.downloadFile({
    //     url: url,
    //     success: res => {
    //       let filePath = res.tempFilePath;
    //       let platform = uni.getSystemInfoSync().platform;
    //       if (platform === 'android') {
    //         uni.saveFile({
    //           tempFilePath: filePath,
    //           success: function (res) {
    //             var savedFilePath = res.savedFilePath;
    //             uni.openDocument({
    //               filePath: savedFilePath,
    //               showMenu: true,
    //               success: function (res) {
    //                 console.log(res);
    //                 console.log('打开文档成功');
    //                 uni.hideLoading();
    //               },
    //               fail: error => {
    //                 console.error(error);
    //                 uni.showToast({
    //                   icon: 'none',
    //                   title: '打开失败'
    //                 });
    //               }
    //             });
    //           },
    //           fail: error => {
    //             console.error(error);
    //             uni.showToast({
    //               icon: 'none',
    //               title: '保存失败'
    //             });
    //           }
    //         });
    //       } else {
    //         uni.openDocument({
    //           filePath: filePath,
    //           showMenu: true,
    //           success: function (res) {
    //             console.log(res);
    //             console.log('打开文档成功');
    //             uni.hideLoading();
    //           },
    //           fail: error => {
    //             console.error(error);
    //             uni.showToast({
    //               icon: 'none',
    //               title: '打开失败'
    //             });
    //           }
    //         });
    //       }
    //     },
    //     fail: error => {
    //       console.error(error);
    //       uni.showToast({
    //         icon: 'none',
    //         title: '下载失败'
    //       });
    //     }
    //   });
    // }
  },
};
</script>

<style lang="scss" scoped>
.img-upload-view {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	background: #FFFFFF;
}
.img-upload-img {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: calc(20vw - 12px);
	width: calc(20vw - 12px);
	margin-top: 10px;
	margin-left: 10px;
}
.yulan{
	position: absolute;
	height: 15px;
	width: 15px;
	top: 0;
	left: 0;
	z-index: 100;
	padding: 3px;
	background: #1482ff;
	border-top-right-radius: 15px;
	border-bottom-right-radius: 15px;
}
.closeimg {
	position: absolute;
	height: 15px;
	width: 15px;
	top: 0;
	right: 0;
	z-index: 100;
	padding: 3px;
}

// .img-bg-view {
// 	display: flex;
// 	flex: 1;
// 	justify-content: flex-start;
// 	flex-wrap: wrap;
// }

.list-view {
	display: flex;
	width: 100%;
	flex-direction: column;
	margin-bottom: 70px;
}
.list-view-cell {
	display: flex;
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
	overflow: auto;
}
// .img-upload-img {
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	height: calc(20vw - 12px);
// 	width: calc(20vw - 12px);
// }

.img {
	height: calc(20vw - 22px);
	width: calc(20vw - 22px);
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
	z-index: 999;
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
</style>
