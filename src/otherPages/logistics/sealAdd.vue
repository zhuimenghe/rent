<template>
  <view>
    <s-sany-popup ref="customToast"></s-sany-popup>
    <p class="title"><span class="line"></span> 选择印章或新增</p>
    <view class="base-infomation-bg">
      <view class="imageUpload" @click="imageUpload">
        <view class="iconfont iconpaizhao paizhao"></view>
        <p>点击上传</p>
      </view>
      <view class="sealItem" v-for="item in sealList" @click="choose(item)">
        <view class="cover" v-if="dataDic.targetFilePath == item.filePath">
          <p>
            <i class="iconfont iconxuanzhong iconxuanzhong" @click="takePic"></i>
          </p>
        </view>
        <image class="img" mode="aspectFit" :src="item.url"></image>
      </view>
    </view>
    <view class="bottom-view">
      <view class="botton" @click="sub">确定</view>
    </view>
  </view>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      tempFilePath: "",
      sealList: [],
      chooseItem: "",
      dataDic: {},
    };
  },
  onLoad(data) {
    this.dataDic = JSON.parse(decodeURIComponent(data.dataDic));
    console.log(this.dataDic, " this.dataDic");
    this.getSealList();
  },
  methods: {
    imageUpload() {
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
          let headerDic = {
            "Content-Type": "application/json",
            Authorization: "",
          };
          let loginMes = uni.getStorageSync("loginMesage");
          if (loginMes) {
            let access_token =
              loginMes.token_type + " " + loginMes.access_token;
            headerDic.Authorization = access_token;
          }
          this.uploadOneImg(uploadUrl, headerDic, res.tempFilePaths.shift());
        },
        fail: (error) => {
          uni.hideLoading();
        },
      });
    },
    uploadOneImg(uploadUrl, headerDic, filePath) {
      console.log(this.cropFilePath);
      uni.uploadFile({
        url: uploadUrl, //仅为示例，非真实的接口地址
        header: headerDic,
        filePath: filePath,
        name: "file",
        formData: {
          type: "customer_identitycard_front",
          uploadType: "attachment",
        },
        success: (res) => {
          let pic = JSON.parse(res.data);
          this.sealList = [pic.result, ...this.sealList];
          this.dataDic.sealFileList = this.sealList;
          this.$forceUpdate();
          uni.hideLoading();
        },
      });
    },
    choose(item) {
      this.dataDic.targetFilePath = item.filePath;
      this.$forceUpdate();
    },
    getSealList() {
      let url = this.$url.certificateSaveSeale;
      this.$network
        .getData(url, "GET")
        .then((result) => {
          this.sealList = result;
          this.dataDic.sealFileList = this.sealList;
          this.dataDic.targetFilePath = this.sealList[0].filePath;
          this.$forceUpdate();
          uni.stopPullDownRefresh();
        })
        .catch((err) => { });
    },
    sub() {
      let url = this.$url.certificateAdd;
      this.$network
        .getData(url, "POST", this.dataDic)
        .then((result) => {
          uni.navigateBack({
            delta: 2,
          });
        })
        .catch((err) => { });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  padding: 10px;
  background: #ffffff;
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}
.title-left {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}
.sealItem {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 10px 10px;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e8e8e8;
  .cover {
    position: absolute;
    top: 0px;
    width: 90px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
    opacity: 0.8;
    z-index: 999;
    p {
      width: 30px;
      height: 30px;
      background-color: #fe931f;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
  }
  .img {
    width: 90%;
    height: 90%;
  }
}
.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
.imageUpload {
  margin-top: 10px;
  margin-right: 10px;
  width: 90px;
  height: 90px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .paizhao {
    font-size: 45px;
    color: #e6e6e6;
  }
  color: #8c8c8c;
}
.imageShow {
  display: block;
  width: 90px;
  height: 90px;
}
.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
  padding: 6px 10px;
  .botton {
    display: flex;
    flex: 1;
    height: 32px;
    border-radius: 6px;
    background: #e60000;
    font-size: 16px;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
}
</style>
