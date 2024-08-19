<template>
  <view>
    <p class="title"><span class="line"></span>基本信息</p>
    <view class="base-infomation-bg">
      <selectorInput
        title="姓名"
        placeholder="请输入"
        :content="dataDic.operatorName"
        :isRequire="true"
        @textChage="textChage($event, 'operatorName')"
      />
      <selectorInput
        title="身份证号"
        placeholder="请输入"
        :content="dataDic.operatorIdentity"
        :isRequire="true"
        @textChage="textChage($event, 'operatorIdentity')"
      />
      <selectorPick
        title="组织"
        placeholder="请输入"
        :content="dataDic.orgName"
        :isRequire="true"
        @clickItem="showPick('org')"
      />
      <selectorInput
        title="操作车型"
        placeholder="请输入"
        :content="dataDic.operatorMachineType"
        :isRequire="true"
        @textChage="textChage($event, 'operatorMachineType')"
      />
      <selectorPick
        title="培训时间"
        placeholder="请选择培训时间"
        :content="dataDic.operatorTrainDate"
        :isRequire="true"
        @clickItem="showPick('operatorTrainDate')"
      />
      <selectorPick
        title="有效日期"
        placeholder="请选择有效日期"
        :content="dataDic.effectiveDate"
        :isRequire="true"
        @clickItem="showPick('effectiveDate')"
      />
    </view>
    <p class="title"><span class="line"></span> 头像上传</p>
    <view class="base-infomation-bg">
      <view class="imageUpload" @click="imageUpload">
        <view v-if="!cropFilePath" class="iconfont iconpaizhao paizhao"></view>
        <p v-if="!cropFilePath">点击上传</p>
        <image
          v-else
          class="imageShow"
          :src="cropFilePath"
          mode="aspectFit"
        ></image>
      </view>
      <image-cropper
        :src="tempFilePath"
        :cropWidth="150"
        :cropHeight="200"
        @confirm="confirm"
        @cancel="cancel"
      ></image-cropper>
    </view>
    <view class="bottom-view">
      <view class="botton" @click="chooseSeal">选择印章</view>
    </view>
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="dateConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>
<script>
import ImageCropper from "./invinbg-image-cropper.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
export default {
  components: {
    selectorPick,
    wPicker,
    selectorInput,
    ImageCropper,
  },
  props: {},
  data() {
    return {
      placeholder: "",
      dataDic: {
        id: null,
        operatorName: "",
        operatorIdentity: "",
        operatorMachineType: "",
        operatorTrainDate: "",
        effectiveDate: "",
        orgId: "",
        iconFile: {},
        sealFileList: [],
        targetFilePath: "",
      },
      tempFilePath: "",
      cropFilePath: "",
      selectList: [],
      orgList: [],
      selectType: "",
    };
  },
  created() {},
  onLoad(option) {
    if (option.dataDic) {
      this.dataDic = JSON.parse(decodeURIComponent(option.dataDic));
      this.cropFilePath = this.dataDic.iconFile.url;
    }

    let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
    this.orgList = [...resOrgList];
  },
  methods: {
    showPick(type) {
      switch (type) {
        case "org":
          this.selectList = [...this.orgList];
          this.$refs.selector.show();
          break;
        case "operatorTrainDate":
          this.selectType = "operatorTrainDate";
          this.$refs.date.show();
          break;
        case "effectiveDate":
          this.selectType = "effectiveDate";
          this.$refs.date.show();
          break;
        default:
          break;
      }
    },
    textChage(e, type) {
      switch (type) {
        case "operatorName":
          this.dataDic.operatorName = e;
          break;

        case "operatorIdentity":
          this.dataDic.operatorIdentity = e;
          break;
        case "operatorMachineType":
          this.dataDic.operatorMachineType = e;
          break;

        default:
          break;
      }
    },

    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
    },
    //删除回调
    deleteUrl(val) {
      this.$emit("textChange", param);
    },
    imageUpload() {
      uni.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: (res) => {
          this.tempFilePath = res.tempFilePaths.shift();
          console.log(this.tempFilePath);
        },
        fail: (error) => {
          uni.hideLoading();
        },
      });
    },
    onConfirm(val) {
      this.dataDic = {
        ...this.dataDic,
        orgId: val.checkArr.value,
        orgName: val.checkArr.label,
      };
    },
    dateConfirm(val, type) {
      if (this.selectType == "effectiveDate") {
        this.dataDic.effectiveDate = val.result + " 00:00:00";
      }
      if (this.selectType == "operatorTrainDate") {
        this.dataDic.operatorTrainDate = val.result + " 00:00:00";
      }
      this.$forceUpdate();
      console.log(this.dataDic);
    },
    confirm(e) {
      console.log(e);
      this.tempFilePath = "";
      this.cropFilePath = e.detail.tempFilePath;
      let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
      let headerDic = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      let loginMes = uni.getStorageSync("loginMesage");
      if (loginMes) {
        let access_token = loginMes.token_type + " " + loginMes.access_token;
        headerDic.Authorization = access_token;
      }
      this.uploadOneImg(uploadUrl, headerDic, this.cropFilePath);
    },
    cancel() {},
    chooseSeal() {
      if (this.dataDic.operatorName.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请输入姓名",
        });
        return;
      }
      if (this.dataDic.operatorIdentity.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请输入身份证号",
        });
        return;
      }
      if (this.dataDic.operatorMachineType.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请输入操作车型",
        });
        return;
      }
      if (this.dataDic.orgName.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择组织",
        });
        return;
      }
      if (this.dataDic.operatorTrainDate.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择培训时间",
        });
        return;
      }
      if (this.dataDic.effectiveDate.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择有效日期",
        });
        return;
      }
      if (JSON.stringify(this.dataDic.iconFile) == "{}") {
        uni.showToast({
          icon: "none",
          title: "请选择头像",
        });
        return;
      }
      if (!this.$datestr.isIdCard(this.dataDic.operatorIdentity)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的身份证号",
        });
        return;
      }

      uni.navigateTo({
        url: `/otherPages/logistics/sealAdd?dataDic=${encodeURIComponent(
          JSON.stringify(this.dataDic)
        )}`,
      });
    },

    uploadOneImg(uploadUrl, headerDic, filePath) {
      uni.showLoading();
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
          this.dataDic.iconFile = { ...pic.result };
          console.log(this.dataDic.iconFile);
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
  display: flex;
  flex-direction: column;
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
  width: 90px;
  height: 120px;
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
  height: 120px;
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
