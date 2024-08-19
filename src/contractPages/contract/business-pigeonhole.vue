<template>
  <view class="img-upload-view">
    <c-nav-bar flexAlign="center">附件上传</c-nav-bar>
    <list class="list-view">
      <cell class="cell-row" v-for="(allitem, allindex) in imgurllist" :key="allindex"
        v-if="allitem.dtoList.length > 0">
        <view class="section-header">
          <text>{{ allitem.title || '--' }}</text>
        </view>
        <view class="img-bg">
          <view v-for="(item, index) in allitem.dtoList" :key="index" style="flex-direction: column;">
            <view class="section-header-subtitle" style="color: #E60000;" @click="gotodetail(item)">
              <text style="flex: 1;">{{ item.businessNo || '--' }}</text>
              <i class="iconfont iconarrow-right" style="padding-right: 8px;color: #E60000;"></i>
            </view>
            <view class="lineView" />
            <view class="img-bg-view">
              <view class="img-upload-img" v-for="(fileitem, fileindex) in item.fileList" :key="fileindex">
                <image class="closeimg" src="/static/closeimg.png" @click="deleteImg(item, fileindex)"
                  v-if="editlimits(item) && canpigeonhole" />
                <image class="downbtn" src="/static/xiazai.png" @click="downDocument(fileitem)"
                  v-if="isdoc(fileitem)" />
                <image class="img" :src="urltonewurl(fileitem.url)" @click="lookpic(item, fileindex)" />
              </view>
              <view class="img-upload-img" @click="addimgWithPhone(item)"
                v-if="isuser(item) && (!item.fileList || item.fileList.length < Number(maximg)) && canpigeonhole">
                <image class="img" src="/static/addimg.png" />
              </view>
            </view>
            <view class="lineView" />
          </view>
        </view>
      </cell>
    </list>
    <c-water-image-picker ref="picker" @confirm="imgsConfrim"></c-water-image-picker>
    <!-- <view class="bottom-view" v-if="canpigeonhole && addPigenohole">
			<button class="btnstyle" @click="updataStatus">{{ '归档' }}</button>
		</view> -->
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      imgurllist: [],
      type: 'contract',
      uploadType: 'attachment',
      maximg: 60,
      downloadTask: null,
      itemDic: {},
      canpigeonhole: true,
      userid: '',
      addPigenohole: true,
      curItem: null
    };
  },
  onLoad(option) {
    this.itemDic = JSON.parse(decodeURIComponent(option.item));
    let isedit = option.isedit;
    this.canpigeonhole = option.canpigeonhole == '1' ? true : false;
    this.getDeatail(this.itemDic);
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: res => {
        this.userid = res.data.id;
      }
    });
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.addPigenohole = res.data.some(x => x.value == this.$savekey.PERMISSION_ADD_PIGENOHOLE)
      }
    })
  },
  methods: {
    editlimits(item) {
      if (item.canUploadFile == '0') {
        return false
      } else {
        return true
      }
    },
    isuser(item) {
      if (item.canUploadFile == '0') {
        return false
      } else {
        return true
      }
    },
    isdoc(item) {
      if (item.filePath) {
        let fileName = item.filePath;
        let suffixIndex = fileName.lastIndexOf('.');
        let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
        if (suffix != 'BMP' && suffix != 'JPG' && suffix != 'JPEG' && suffix != 'PNG' && suffix != 'GIF' && suffix !=
          'ICO' && suffix != 'WEBP') {
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
        // console.log(suffix);
        if (suffix == 'BMP' || suffix == 'JPG' || suffix == 'JPEG' || suffix == 'PNG' || suffix == 'GIF' || suffix ==
          'ICO' || suffix == 'WEBP') {
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
    updataStatus() {
      let urlstr = this.$url.CONTRACT_UPDATA_STATE.replace(/xxx/, this.itemDic.id);
      this.$network
        .getData(urlstr, 'PUT', null)
        .then(result => {
          uni.showToast({
            icon: 'none',
            title: '归档成功'
          });
          uni.$emit('refresh-contract-list', {
            type: 'contract'
          });
          uni.navigateBack({
            animationDuration: 100
          })
        }).catch(err => {
          uni.showToast({
            icon: 'none',
            title: err.message + (err.details ? ":" + err.details[0] : "")
          });
        });
    },
    //附件保存
    saveFiles(item, list) {
      let param = {
        businessNo: item.businessNo,
        fileList: list
      };
      this.$network
        .getData(this.$url.CONTRACT_FILELIST_SAVE, 'POST', param)
        .then(result => {
          uni.showToast({
            icon: 'none',
            title: '保存附件成功'
          });
          uni.$emit('refresh-contract-list', {
            type: 'contract'
          });
          this.getDeatail(this.itemDic);
        })
        .catch(err => {
          uni.showToast({
            icon: 'none',
            title: err.message
          });
        });
    },
    getDeatail(itemDic) {
      uni.showLoading();
      let urlstr = this.$url.CONTRACT_FILE_LIST.replace(/xxx/, itemDic.id);
      this.$network
        .getData(urlstr, 'GET', null)
        .then(result => {
          this.dealBackData(result)
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
        });
    },
    dealBackData(result) {
      this.imgurllist = [];
      let contractEntity = result.contractEntity ? [result.contractEntity] : []; //合同
      let contractEntityDic = {
        title: '合同附件',
        dtoList: contractEntity
      }
      this.imgurllist.push(contractEntityDic)
      // let contractPlusEntities = result.contractPlusEntities ? result.contractPlusEntities : [];//合同附加
      // let contractPlusEntitiesDic = {
      // 	title:'合同附加附件',
      // 	dtoList:contractPlusEntities
      // }
      // this.imgurllist.push(contractPlusEntitiesDic)
      let workInEntities = result.workInEntities ? result.workInEntities : []; //进场
      let workInEntitiesDic = {
        title: '进场附件',
        dtoList: workInEntities
      }
      this.imgurllist.push(workInEntitiesDic)
      let workOutEntities = result.workOutEntities ? result.workOutEntities : []; //退场
      let workOutEntitiesDic = {
        title: '退场附件',
        dtoList: workOutEntities
      }
      this.imgurllist.push(workOutEntitiesDic)
      let proceedsDtos = result.proceedsDtos ? result.proceedsDtos : []; //收款
      let proceedsDtosDic = {
        title: '收款附件',
        dtoList: proceedsDtos
      }
      this.imgurllist.push(proceedsDtosDic)
      let reimburseDtos = result.reimburseDtos ? result.reimburseDtos : []; //退款
      let reimburseDtosDic = {
        title: '退款附件',
        dtoList: reimburseDtos
      }
      this.imgurllist.push(reimburseDtosDic)
      let pauseEntities = result.pauseEntities ? result.pauseEntities : []; //报停
      let pauseEntitiesDic = {
        title: '报停附件',
        dtoList: pauseEntities
      }
      this.imgurllist.push(pauseEntitiesDic)
      let claimEntities = result.claimEntities ? result.claimEntities : []; //索赔
      let claimEntitiesDic = {
        title: '索赔附件',
        dtoList: claimEntities
      }
      this.imgurllist.push(claimEntitiesDic)
    },
    //浏览
    lookpic(item, index) {
      let fileList = item.fileList || []
      if (this.isdoc(fileList[index])) {
        return;
      }
      let urlarr = [];
      let docarr = [];
      fileList.forEach(o => {
        if (this.isdoc(o) == false) {
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
    deleteImg(item, index) {
      uni.showModal({
        title: "提示",
        content: "确认删除该附件么?",
        success: (res) => {
          if (res.confirm) {
            uni.showLoading();
            let fileList = item.fileList || [];
            let items = fileList[index];
            let url = this.$url.UPLOAD_IMG_DELETE + items.id;
            this.$network.getData(url, 'DELETE', null).then(result => {
              // this.saveFiles(item, fileList)
              this.getDeatail(this.itemDic);
            }).catch(err => {
              uni.showToast({
                icon: 'none',
                title: err.message
              })
            });
          }
        }
      })
    },
    //添加
    addimgWithPhone(item) {
      let fileList = item.fileList ? item.fileList : [];
      let max = Number(this.maximg) - fileList.length;
      if (max <= 0) {
        return;
      }
      this.curItem = item
      this.$refs.picker.show(max)
      // uni.chooseImage({
      // 	count: max,
      // 	success: chooseImageRes => {
      // 		let tempFiles = chooseImageRes.tempFiles;
      // 		let list = tempFiles.map(o => {
      // 			return {
      // 				url: o.path
      // 			};
      // 		});
      // 		this.imglist = [...list];
      // 		this.uploadWithAll(item);
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
      this.uploadWithAll(this.curItem);
    },
    //上传全部
    uploadWithAll(itemDic) {
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
        this.dealData(itemDic, obj);
      });
    },
    //处理保存数据
    dealData(item, list) {
      let dealList = list.map(o => {
        return {
          ...o
        };
      });
      setTimeout(() => {
        let fileList = item.fileList || [];
        this.saveFiles(item, fileList.concat(list))
      }, 100)
    },
    //单一循环
    upload(uploadUrl, headerDic, path_arr, name, type, uploadTYpe) {
      let num = path_arr.length;
      return new Promise(async (resolve, reject) => {
        let img_urls = [];
        for (let i = 0; i < num; i++) {
          let filePath = path_arr[i].uri;
          this.$datestr.printlog('filePath' + filePath);
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
    //--------------------------------------
    downDocument(item) {
      console.log(item.url)
      uni.showLoading({
        title: '正在下载中,请稍等...',
        mask: true
      });
      let url = item.url;
			this.$gxfmethod.downFunc(url)
      // this.downstart(url);
    },
    // downstart(url, headerDic) {
    //   if (this.downloadTask) {
    //     this.downloadTask.abort();
    //     this.downloadTask = null;
    //   }
    //   this.downloadTask = uni.downloadFile({
    //     url: url,
    //     success: res => {
    //       console.log(res);
    //       let filePath = res.tempFilePath;
    //       let platform = uni.getSystemInfoSync().platform;
    //       if (platform == 'android') {
    //         uni.saveFile({
    //           tempFilePath: filePath,
    //           success: function (res) {
    //             var savedFilePath = res.savedFilePath;
    //             uni.openDocument({
    //               filePath: savedFilePath,
    //               success: function (res) {
    //                 console.log(res);
    //                 console.log('打开文档成功');
    //                 uni.hideLoading();
    //               },
    //               fail: error => {
    //                 uni.showToast({
    //                   icon: 'none',
    //                   title: '下载失败'
    //                 });
    //               }
    //             });
    //           },
    //           fail: error => {
    //             uni.showToast({
    //               icon: 'none',
    //               title: '下载失败'
    //             });
    //           }
    //         });
    //       } else {
    //         uni.openDocument({
    //           filePath: escape(filePath),
    //           success: function (res) {
    //             console.log(res);
    //             console.log('打开文档成功');
    //             uni.hideLoading();
    //           },
    //           fail: error => {
    //             uni.showToast({
    //               icon: 'none',
    //               title: '下载失败'
    //             });
    //           }
    //         });
    //       }
    //     },
    //     fail: error => {
    //       console.log(error);
    //       uni.showToast({
    //         icon: 'none',
    //         title: '下载失败'
    //       });
    //     },
    //     complete: () => {
    //       setTimeout(() => {
    //         this.hide();
    //       }, 100);
    //     }
    //   });
    // },
    hide() {
      if (this.downloadTask) {
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
    //---------------------跳转
    gotodetail(item) {
      console.log(item, 'gotodetail');
      let name = item.businessNo.substring(0, 2)
      if (item.businessNo.indexOf('HT') != -1) {
        name = "HT"
      }
      switch (name) {
        case 'HT':
          uni.navigateTo({
            url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
          });
          break;
        case 'JC':
          uni.navigateTo({
            url: '/businessPages/workin/workin-detail?businessNo=' + item.businessNo
          });
          break;
        case 'TC':
          uni.navigateTo({
            url: '/businessPages/workout/workout-detail?businessNo=' + item.businessNo
          });
          break;
        case 'SK':
          uni.navigateTo({
            url: '/businessPages/proceed/porceeds-detail?businessNo=' + item.businessNo
          });
          break;
        case 'TK':
          uni.navigateTo({
            url: '/businessPages/reimburse/reimburse-detail?businessNo=' + item.businessNo
          });
          break;
        case 'SP':
          uni.navigateTo({
            url: '/businessPages/claim/claim-detail?businessNo=' + item.businessNo
          });
          break;
        case 'BT':
          uni.navigateTo({
            url: '/businessPages/pause/pause-detail?id=' + item.businessNo
          });
          break;
        default:
          // uni.showToast({
          // 	icon: "none",
          // 	title: "该功能未在APP开放，请去PC端查看"
          // })
          uni.navigateTo({
            url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
          });
          break;
      }
    },
  },
  created() {

  }
};
</script>

<style lang="scss" scoped>
	.img-upload-view {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		background: #FFFFFF;
	}

	.img-bg-view {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		background: #FFFFFF;
	}

	.img-upload-img {
		position: relative;
		// height: 50px;
		align-items: center;
		justify-content: flex-start;
		margin-top: 10px;
		margin-bottom: 5px;
		z-index: 100;
	}

	.img-bg {
		display: flex;
		padding: 0px 10px 10px 10px;
		flex-direction: column;
	}

	.closeimg {
		position: absolute;
		height: 20px;
		width: 20px;
		top: 0;
		right: 0;
		z-index: 100;
	}

	.downbtn {
		position: absolute;
		height: 20px;
		width: 20px;
		top: calc(50% - 10px);
		left: calc(50% - 10px);
		z-index: 300;
	}

	.list-view {
		display: flex;
		width: 100%;
		flex-direction: row;
		flex-wrap: wrap;
		overflow: auto;
		margin-bottom: 70px;
	}

	.cell-row {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.section-header {
		display: flex;
		padding: 10px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background: $uni-bg-color-grey;
	}

	.section-header-subtitle {
		display: flex;
		padding: 10px 15px 5px 15px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		background: #FFFFFF;
	}

	.img-upload-img {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 60px;
	}

	.img {
		height: 50px;
		width: 50px;
		border: 1px solid #eeeeee;
	}

	.bottom-view {
		display: flex;
		position: fixed;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 60px;
		font-size: 14px;
		background: #FFFFFF;
		text-align: center;
		color: #ffffff;
		z-index: 104;
	}

	.btnstyle {
		flex: 1;
		margin: 10px;
		font-size: 14px;
		background: $uni-color-primary;
		text-align: center;
		color: #ffffff;
		z-index: 105;
	}

	.lineView {
		flex: 1;
		height: 1px;
		background: #d4d4d4;
		margin-top: 5px;
	}
</style>
