<template>
  <view class="img-upload-view">
    <view class="img-bg-view">
      <list class="list-view">
        <cell>
          <view class="img-upload-img">
            <image
              class="closeimg"
              src="/static/closeimg.png"
              @click="deleteImg(imgInfo.index)"
              v-if="isControl && imgInfo.url"
            />
            <view>
              <view v-if="!imgInfo.url" class="img-upload-img" @click="addimgWithPhone">
                <!-- <image class="img" src="/static/addimg.png" /> -->
                <div class="img-btn"></div>
              </view>
              <image
                v-else
                class="img"
                :src="urltonewurl(imgInfo.url)"
                @click="lookpic(imgInfo.index)"
              />
            </view>
            <view class="img-upload-title">
              <text class="filename"
                ><text v-if="imgInfo.required" style="color: #ff0000">*</text
                >{{ imgInfo.fileName || imgInfo.fileDesc || "-" }}</text
              >
            </view>
          </view>
        </cell>
      </list>
    </view>
    <c-water-image-picker ref="picker" @confirm="imgsConfrim"></c-water-image-picker>
  </view>
</template>
<script>
export default {
  name: "choose-device-file",
  data() {
    return {
      imglist: [],
      imgurllist: [],
      downloadTask: null,
    };
  },
  created() {
    let fList =
      this.imgFinishlist && this.imgFinishlist.length > 0 ? this.imgFinishlist : [];
    let list = fList.map((o) => {
      return {
        url: o.url,
      };
    });
    this.imglist = list;
    this.imgurllist = [...fList];

    console.log(this.imgInfo, "imgInfo");
  },
  watch: {
    imgFinishlist(val) {
      if (val && val != null) {
        let list = val.map((o) => {
          return {
            url: o.url,
          };
        });
        this.imglist = [...list];
        this.imgurllist = [...val];
      }
    },
  },
  props: {
    imgInfo: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "附件",
    },
    isControl: {
      type: [Boolean, String],
      default: false,
    },
    imgFinishlist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    maximg: {
      type: [String, Number],
      default: "60",
    },
    type: {
      type: String,
      default: "contract",
    },
    uploadType: {
      type: String,
      default: "attachment",
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
    dealData({ result }) {
      let info = {
        ...this.imgInfo,
        url: result.url,
        filePath: result.filePath,
        bucket: result.bucket,
        name: result.name,
        type: result.type,
      };
      console.log(info, result, "-----------------1111111111");

      // this.imgurllist = this.imgurllist.concat(dealList);
      // console.log(dealList,this.imgurllist,'this.imgurllist');
      // 传好的数据
      this.$emit("uploadfinish", info);
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
            let item = this.imgInfo;
            if (item.id) {
              let url = this.$url.UPLOAD_IMG_DELETE + item.id;
              this.$network
                .getData(url, "DELETE", null)
                .then((result) => {
                  uni.hideLoading();
                  this.$emit("deleteUrl", index);
                  uni.hideLoading();
                })
                .catch((err) => {
                  uni.showToast({
                    icon: "none",
                    title: err.message,
                  });
                  uni.hideLoading();
                });
            } else {
              this.$emit("deleteUrl", index);
              uni.hideLoading();
            }
          }
        },
      });
    },

    //添加
    addimgWithPhone() {
      if (!this.isControl) return;

      this.$refs.picker.show();

      // uni.chooseImage({
      // 	count: 1,
      // 	sizeType: ['compressed'],
      // 	success: chooseImageRes => {
      // 		console.log(chooseImageRes, JSON.stringify(chooseImageRes), 'chooseImageRes');
      // 		let tempFiles = chooseImageRes.tempFiles;
      // 		let list = tempFiles.map(item => {
      // 			return {
      // 				...this.imgInfo,
      // 				url: item.path,
      // 			};
      // 		});
      // 		console.log(list, 'addimgWithPhone');
      // 		// this.imglist = [...list];
      // 		this.uploadWithAll(list);
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
          ...this.imgInfo,
          url: item,
        };
      });
      this.uploadWithAll(list);
    },
    //上传全部
    uploadWithAll(list) {
      let headerDic = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      let loginMes = uni.getStorageSync("loginMesage");
      if (loginMes) {
        let access_token = loginMes.token_type + " " + loginMes.access_token;
        headerDic.Authorization = access_token;
      }
      let timestr = new Date().getTime().toString();
      let imgInfo = {
        ...list[0],
        uri: list[0].url,
        name: timestr,
      };
      console.log(this.imgInfo, "this.imgInfo");
      let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
      this.upload(uploadUrl, headerDic, imgInfo, "file", this.type, this.uploadType)
        .then((url) => {
          console.log(url, "uploadWithAll");
          this.dealData(url);
        })
        .catch((err) => {
          console.log(err, "dealData");
        });
    },
    //单一循环
    upload(uploadUrl, headerDic, file, name, type, uploadTYpe) {
      return new Promise((resolve, reject) => {
        let filePath = file.uri || "";
        console.log(filePath, "filePath22222");
        this.uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe).then(
          (img_url) => {
            resolve(img_url);
          }
        );
        // if (filePath.substring(0, 4) != 'http') {
        // 	 this.uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe).then(img_url => {
        // 		resolve(img_url);
        // 	}).catch(error => {
        // 		console.log('error');
        // 		reject(error)
        // 	});
        // }
      });
    },
    //上传单张照片
    uploadOneImg(uploadUrl, headerDic, filePath, name, type, uploadTYpe) {
      return new Promise((resolve, reject) => {
        uni.showLoading({
          mask: true,
          title: "图片上传中",
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
            console.log(uploadFileRes, "uploadFileRes");
            uni.hideLoading();
            let resData = uploadFileRes.data ? JSON.parse(uploadFileRes.data) : {};
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
            console.log(error, "uploadOneImg");
            uni.hideLoading();
            reject(error);
          },
        });
      });
    },
    hide() {
      if (this.downloadTask) {
        console.log("invoice---hiden");
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.img-upload-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
}

.filename {
  /* 超出10个字隐藏，之所以设置11em是因为省略号占一个位置 */
  width: 6em;
  overflow: hidden;
  /* 显示省略符号来代表被修剪的文本。 */
  text-overflow: ellipsis;
  text-align: center;
  /* 文本不换行 */
  white-space: nowrap;
}

.img-upload-title {
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.img-upload-img {
  position: relative;
  align-items: center;
  justify-content: flex-start;
  margin-top: 5px;
  margin-bottom: 5px;
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
  // overflow: auto;
  justify-content: space-between;
  flex-wrap: wrap;
}

.img {
  width: 204rpx;
  height: 204rpx;
  background: #ffffff;
}

.img-btn {
  position: relative;
  flex: 1;
  width: 204rpx;
  height: 204rpx;
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
</style>
