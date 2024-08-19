<template>
  <view class="img-upload-view">
    <view v-if="isShowLabel" class="img-upload-title" :style="{ background: isShowBg ? '#fff' : 'transparent' }">
      <view><text :style="{color:titleColor}">{{ title }}</text>
        <text style="color: #ff0000" v-if="idRequair">*</text>
      </view>
    </view>
    <view class="img-bg-view">
      <view class="list-view">
        <view v-for="(item, index) in imgurllist" :key="index">
          <view class="img-upload-img">
            <image class="yulan" src="/static/yulan.png" v-if="item.sharePermission == '2' ? true : false" />
            <image class="closeimg" src="/static/closeimg.png" @click="deleteImg(index)" v-if="isupload" />
            <image class="downbtn" src="/static/xiazai.png" @click="downDocument(item)" v-if="isdoc(item)" />
            <image class="img" :src="urltonewurl(item.url)" @click="lookpic(index)" />
          </view>
        </view>
        <view v-if="showAddView && isupload">
          <view class="img-upload-img" @click="addimgWithPhone" v-if="isImagwWrapper">
            <!-- <image  class="img" src="/static/addimg.png" /> -->
            <div class="img-btn"></div>
          </view>
          <view v-else class="img-upload-img border" @click="addimgWithPhone">
            <view class="line"></view>
            <view class="line vertical"></view>
          </view>
        </view>
      </view>
    </view>
    <c-water-image-picker ref="picker" @confirm="imgsConfirm"></c-water-image-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imglist: [],
      imgurllist: [],
      showAddView: true,
      downloadTask: null,
      maxImgs: 60,
    };
  },
  created() {
    // this.showAddView = this.isupload;
    // if (!this.isupload) {
    let list =
      this.imgFinishlist && this.imgFinishlist.length > 0
        ? this.imgFinishlist.map((o) => {
          return {
            url: o.url,
          };
        })
        : [];
    this.imglist = list;
    console.log(this.imgFinishlist);
    this.imgurllist = this.imgFinishlist ? this.imgFinishlist : [];
    this.maxImgs = this.idRequair ? 1 : 60;
    if (this.imgurllist.length == Number(this.maxImgs)) {
      this.showAddView = false;
    } else {
      this.showAddView = true;
    }
    // }
  },
  watch: {
    imgFinishlist(val) {
      if (val && val != null) {
        let list = val.map((o) => {
          return {
            url: o.url,
          };
        });
        this.imglist = list;
        this.imgurllist = val;
        if (this.imgurllist.length == Number(this.maxImgs)) {
          this.showAddView = false;
        } else {
          this.showAddView = true;
        }
      }
    },
    takePicUrl(val) {
      this.addPic();
    },
  },

  props: {
    isImagwWrapper: {
      type: Boolean,
      default: true,
    },
    isShowBg: {
      type: Boolean,
      default: true,
    },
    isShowLabel: {
      type: Boolean,
      default: true,
    },
    idRequair: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "附件",
    },
    titleColor:{
      type: String,
      default: "#333",
    },
    isupload: {
      type: [Boolean, String],
      default: true,
    },
    imgFinishlist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    maximg: {
      type: [String, Number],
      default: "9",
    },
    type: {
      type: String,
      default: "contract",
    },
    uploadType: {
      type: String,
      default: "attachment",
    },
    takePicUrl: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  methods: {

    isdoc(item) {
      if (item.filePath) {
        let fileName = item.filePath;
        let suffixIndex = fileName.lastIndexOf(".");
        let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
        if (
          suffix != "BMP" &&
          suffix != "JPG" &&
          suffix != "JPEG" &&
          suffix != "PNG" &&
          suffix != "GIF" &&
          suffix != "ICO" &&
          suffix != "WEBP"
        ) {
          return true;
        }
      }
      return false;
    },
    urltonewurl(url) {
      if (url) {
        let fileName = url.split("?")[0];
        let suffixIndex = fileName.lastIndexOf(".");
        let suffix = fileName.substring(suffixIndex + 1).toUpperCase();
        if (
          suffix == "BMP" ||
          suffix == "JPG" ||
          suffix == "JPEG" ||
          suffix == "PNG" ||
          suffix == "GIF" ||
          suffix == "ICO" ||
          suffix == "WEBP"
        ) {
          let urlStr = url.replace(/\+/g, "%2B");
          return urlStr;
        } else {
          if (suffix == "PDF") {
            return "/static/zl-pdf.png";
          }
          if (suffix == "TXT" || suffix == "TEXT") {
            return "/static/zl-text.png";
          }
          if (suffix == "DOC" || suffix == "DOCX") {
            return "/static/zl-word.png";
          }
          if (suffix == "XLS" || suffix == "XLSX" || suffix == "CSV") {
            return "/static/zl-xlsx.png";
          }
          if (suffix == "PPT" || suffix == "PPTX") {
            return "/static/zl-ppt.png";
          }
        }
      }
      return "";
    },
    dealData(list) {
      console.log(list, "11111111111");
      let dealList = list.map((o) => {
        return {
          name: o.name,
          type: o.type,
          uploadType: o.uploadType,
          uploadTypeName: o.uploadTypeName,
          fileDesc: o.fileDesc,
          businessId: o.businessId,
          url: o.url,
          bucket: o.bucket,
          filePath: o.filePath,
        };
      });

      this.imgurllist = this.imgurllist.concat(dealList);
      console.log(this.imgurllist);
      this.imgurllist = this.imgurllist.map((o) => {
        return {
          ...o,
        };
      });
      if (this.imgurllist.length === Number(this.maxImgs)) {
        this.showAddView = false;
      } else {
        this.showAddView = true;
      }
      this.$emit("uploadfinish", {
        data: this.imgurllist,
      });
    },
    //浏览
    lookpic(index) {
      if (this.isdoc(this.imgurllist[index])) {
        return;
      }
      let urlarr = [];
      let docarr = [];
      this.imgurllist.forEach((o) => {
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
        urls: urlarr,
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
            if (item.id && this.idRequair == false) {
              let url = this.$url.UPLOAD_IMG_DELETE + item.id;
              this.$network
                .getData(url, "DELETE", null)
                .then((result) => {
                  this.imgurllist.splice(index, 1);
                  this.$emit("deleteUrl", {
                    data: this.imgurllist,
                  });
                  this.showAddView = true;
                  uni.hideLoading();
                })
                .catch((err) => {
                  uni.showToast({
                    icon: "none",
                    title: err.message,
                  });
                });
            } else {
              this.imgurllist.splice(index, 1);
              this.$emit("deleteUrl", {
                data: this.imgurllist,
              });
              this.showAddView = true;
              uni.hideLoading();
            }
          }
        },
      });
    },
    //添加
    addimgWithPhone() {
      let max = parseInt(this.maxImgs) - this.imglist.length;
      if (max <= 0) {
        return;
      }
      this.$refs.picker.show(max)
      // uni.chooseImage({
      //   count: max,
      //   sizeType: ["compressed"],
      //   success: (chooseImageRes) => {
      //     console.log(JSON.stringify(chooseImageRes));
      //     let tempFiles = chooseImageRes.tempFiles;
      //     let list = tempFiles.map((item) => {
      //       return {
      //         url: item.path,
      //       };
      //     });
      //     this.imglist = [...list];
      //     this.uploadWithAll();
      //   },
      //   fail: (error) => {
      //     uni.hideLoading();
      //   },
      // });
    },
    imgsConfirm(tempFiles) {
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
        "Content-Type": "application/json",
        Authorization: "",
      };
      let loginMes = uni.getStorageSync("loginMesage");
      if (loginMes) {
        let access_token = loginMes.token_type + " " + loginMes.access_token;
        headerDic.Authorization = access_token;
      }
      let list = this.imglist.map((item, index) => {
        let timestr = new Date().getTime().toString();
        return {
          uri: item.url,
          name: timestr,
        };
      });
      let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
      this.upload(
        uploadUrl,
        headerDic,
        list,
        "file",
        this.type,
        this.uploadType
      ).then((obj) => {
        this.dealData(obj);
      });
    },
    //单一循环
    upload(uploadUrl, headerDic, path_arr, name, type, uploadTYpe) {
      let num = path_arr.length;
      return new Promise(async (resolve, reject) => {
        let img_urls = [];
        for (let i = 0; i < num; i++) {
          let filePath = path_arr[i].uri;
          if (filePath.substring(0, 4) != "http" || process.env.NODE_ENV == 'development') {
            // let img_url = await this.uploadOneImg(uploadUrl, headerDic, filePath, name, type,
            // 	uploadTYpe, i);
            // console.log(img_url);
            await this.uploadOneImg(
              uploadUrl,
              headerDic,
              filePath,
              name,
              type,
              uploadTYpe,
              i
            )
              .then((img_url) => {
                img_urls.push(img_url.result);
                console.log(img_urls);
              })
              .catch((error) => {
                console.log("error");
              });
          }
        }
        resolve(img_urls);
      });
    },
    //上传单张照片
    uploadOneImg(
      uploadUrl,
      headerDic,
      filePath,
      name,
      type,
      uploadTYpe,
      index
    ) {
      return new Promise((resolve, reject) => {
        uni.showLoading({
          mask: true,
          title: "第" + (index + 1).toString() + "张上传中",
        });
        let uploadTask = uni.uploadFile({
          url: uploadUrl,
          filePath: filePath,
          name: name,
          formData: {
            type: type,
            uploadType: uploadTYpe,
          },
          header: headerDic,
          success: (uploadFileRes) => {
            uni.hideLoading();
            let resData = uploadFileRes.data
              ? JSON.parse(uploadFileRes.data)
              : {};
            if (resData.code && resData.code == 200) {
              console.log("sucess");
              resolve(resData);
            } else {
              console.log(uploadFileRes);
              console.log("fail");
              reject("error");
            }
          },
          fail: (error) => {
            uni.hideLoading();
            reject(error);
          },
        });
      });
    },
    // 下载
    downDocument(item) {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      let url = item.url;
      // this.downstart(url);
			this.$gxfmethod.downFunc(url)
    },
    // downstart(url, headerDic) {
    //   if (this.downloadTask) {
    //     this.downloadTask.abort();
    //     this.downloadTask = null;
    //   }
    //   this.downloadTask = uni.downloadFile({
    //     url: url,
    //     success: (res) => {
    //       console.log(res);
    //       let filePath = res.tempFilePath;
    //       let platform = uni.getSystemInfoSync().platform;
    //       if (platform === "android") {
    //         uni.saveFile({
    //           tempFilePath: filePath,
    //           success: function (res) {
    //             var savedFilePath = res.savedFilePath;
    //             uni.openDocument({
    //               showMenu: true,
    //               filePath: savedFilePath,
    //               success: function (res) {
    //                 console.log(res);
    //                 console.log("打开文档成功");
    //                 uni.hideLoading();
    //               },
    //               fail: (error) => {
    //                 uni.showToast({
    //                   icon: "none",
    //                   title: "打开文档失败",
    //                 });
    //               },
    //             });
    //           },
    //           fail: (error) => {
    //             uni.showToast({
    //               icon: "none",
    //               title: "列表导出失败",
    //             });
    //           },
    //         });
    //       } else {
    //         uni.openDocument({
    //           filePath: encodeURI(filePath),
    //           success: function (res) {
    //             console.log(res);
    //             console.log("打开文档成功");
    //             uni.hideLoading();
    //           },
    //           fail: (error) => {
    //             uni.showToast({
    //               icon: "none",
    //               title: "列表导出失败",
    //             });
    //           },
    //         });
    //       }
    //     },
    //     fail: (error) => {
    //       console.log(error);
    //       uni.showToast({
    //         icon: "none",
    //         title: "列表导出失败",
    //       });
    //     },
    //     complete: () => {
    //       setTimeout(() => {
    //         this.hide();
    //       }, 100);
    //     },
    //   });
    // },
    hide() {
      if (this.downloadTask) {
        console.log("invoice---hiden");
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
    addPic() {
      this.imgurllist.push(this.takePicUrl);
      console.log(this.takePicUrl, "this.takePicUrl");
      if (this.imgurllist.length === Number(this.maxImgs)) {
        this.showAddView = false;
      } else {
        this.showAddView = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.img-btn {
  position: relative;
  flex: 1;
  width: 95rpx;
  height: 95rpx;
  background: #ffffff;
  border: 1rpx solid #dcdfe6;

  &::before {
    display: block;
    position: absolute;
    content: "+";
    left: 50%;
    top: 50%;
    font-size: 65rpx;
    transform: translate(-50%, -50%);
    color: #8c8c8c;
  }
}
.img-upload-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
  padding: 10px 0px;
  padding-bottom: 0;
}

.img-upload-title {
  display: flex;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  align-items: center;
  justify-content: space-between;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  background-color: #f5f4f9;
  @include hairline-bottom();
}

.img-upload-img {
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 5px;
  margin-right: 5px;
}

.border {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 104rpx;
  height: 104rpx;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  margin-top: 20rpx;
}

.line {
  width: 2rpx;
  height: 32rpx;
  background: #8c8c8c;
}

.vertical {
  flex-shrink: 0;
  transform: rotate(90deg);
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

.downbtn {
  position: absolute;
  height: 15px;
  width: 15px;
  bottom: 0;
  right: 0;
  z-index: 100;
  padding: 3px;
}

.img-bg-view {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.list-view {
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: 1px solid #e7e7e7;
}

.img {
  height: 50px;
  width: 50px;
  border: 1px solid #eeeeee;
  padding: 3px;
}

.yulan {
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
</style>
