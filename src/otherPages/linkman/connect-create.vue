<template>
  <view class="creat-person-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="title">
      <view><span class="line"></span>基本信息</view>
      <view class="tip">注：只有正确的姓名、手机号方可实名认证</view>
    </view>
    <view class="sum-view-bg">
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>姓名</text><text style="color: #ff0000">*</text>
        </view>
        <view class="cell-input-view-right">
          <input class="input-style" type="text" v-model="customName" placeholder="请输入姓名...." />
          <i class="iconfont iconpaizhao paizhao" @click="takePic"></i>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>手机号</text><text style="color: #ff0000">*</text>
        </view>
        <view class="cell-input-view-right">
          <input class="input-style" type="number" v-model="phoneNum" placeholder="请输入手机号...." />
        </view>
      </view>
      <view v-for="(item, index) in contractlist" :key="index">
        <view class="cell-input-view">
          <view class="cell-input-view-left"><text>副手机号{{ index + 1 }}</text></view>
          <view class="cell-input-view-right">
            <input class="input-style" type="number" v-model="contractlist[index]" placeholder="请输入手机号...." />
          </view>
          <i v-if="contractlist.length < 2 && index === contractlist.length - 1" class="iconfont addView iconadd"
            @click="addNewPhoneNum"></i>
          <i class="iconfont addView iconjian" @click="deleteItem(index)"></i>
        </view>
      </view>
      <view class="radio-bg">
        <view class="choose-wl"><text>联系人职责</text><text style="color: #ff0000">*</text></view>
        <view class="uni-list">
          <label class="radio" v-for="(item, index) in contactDutys" :key="index" @click="checkboxChange(item)">
            <checkbox color="#E60000" value="1" :checked="ischecked(item.value)" />
            {{ item.label }}
          </label>
        </view>
      </view>
  
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>身份证号</text><text style="color: #ff0000" v-if="idcardRequair">*</text>
        </view>
        <view class="cell-input-view-right">
          <input class="input-style" type="text" v-model="identy" placeholder="请输入身份证号...." />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>客户地址</text>
        </view>
        <view class="cell-input-view-right">
          <input class="input-style" type="text" v-model="address" placeholder="请输入客户地址...." />
        </view>
      </view>
      <imgupload 
      titleColor="#8c8c8c"
      :idRequair="idcardRequair" @uploadfinish="uploadfinishFront" @deleteUrl="deleteUrlFront"
        type="contact_identitycard_front" uploadType="attachment" maximg="1" title="身份证人像面"
        :imgFinishlist="identityCardFront" :takePicUrl="takePicUrl" ref="front" />
      <imgupload 
      titleColor="#8c8c8c"
      :idRequair="idcardRequair" @uploadfinish="uploadfinishBehind" @deleteUrl="deleteUrlBehind"
        type="contact_identitycard_behind" uploadType="attachment" maximg="1" title="身份证国徽面"
        :imgFinishlist="identityCardBehind" />
      <imgupload 
      titleColor="#8c8c8c"
      @uploadfinish="uploadAttachment" @deleteUrl="deleteAttachment"
        type="enterprise_customer_contact_attachment" uploadType="attachment" maximg="20" title="附件"
        :imgFinishlist="fileList" />
      <text-label-item 
      :isShowBorder="true"
      tagColor='#8c8c8c'
       tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="saveDic.remark" />
    </view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
      <view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
    </view>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
export default {
  components: {
    selectLabelItem,
    imgupload,
    textLabelItem,
  },
  data() {
    return {
      righticon: "iconarrow-right",
      customName: "",
      phoneNum: "",
      email: "",
      identy: "",
      address: '',
      identityCardFront: [],
      identityCardBehind: [],
      dutyList: [],
      isPersonal: false,//c.type!=1
      contractlist: [],
      fileList: [],
      isedit: false,
      editindex: -1,
      saveDic: {},
      dataList: [],
      idcardRequair: false,
      takePicUrl: null,
      identityCardFrontAuto: []
    };
  },
  onLoad(option) {
    if (option.edit == "true") {
      let item = JSON.parse(decodeURIComponent(option.item));
      this.customName = item.name || "";
      this.phoneNum = item.phoneNum || "";
      this.contractlist = item.secondaryPhoneList || [];
      this.email = item.email || "";
      this.address = item.address || "";
      this.dutyList = item.dutyList || [];
      this.isPersonal = item.type != 1;//是否是个人客户 个人客户type=2 企业客户type=1
      this.identy = item.identity || "";
      this.identityCardFront = item.identityCardFront || [];
      this.identityCardBehind = item.identityCardBehind || [];
      this.fileList = item.enterpriseCustomerContactAttachmentFileList || [];
      this.isedit = true;
      this.editindex = Number(option.index);
      this.saveDic = {
        ...item,
      };
    }
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "is_identity_required");
      if (obj) {
        //是否必须输入身份证
        this.idcardRequair = obj.value === "true" ? true : false;
      }
    }
    uni.$on("phone-contract-item", (item) => {
      let dict = item.data;
      this.customName = dict.displayName || "";
      this.phoneNum = this.phoneNumShow(dict);
    });
    this.loadDutyType();
  },
  computed: {
    contactDutys() {
      return this.isPersonal ? this.dataList.slice(1) : this.dataList//个人客户去掉法人
    }
  },

  methods: {
    loadDutyType() {
      uni.showLoading();
      this.$network
        .loadType("contact_duty")
        .then((result) => {
          this.dataList = result;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    phoneNumShow(item) {
      if (item.phoneNumbers && item.phoneNumbers.length > 0) {
        let str1 = item.phoneNumbers[0].value.replace(/ /g, "");
        let str2 = str1.replace(/-/g, "");
        let str3 = str2.replace(/\+86/g, "");
        return str3;
      }
      return "";
    },
    gotoPhoneContract() {
      uni.navigateTo({
        url: "./phone-contract-list",
      });
    },
    addNewPhoneNum() {
      if (this.contractlist.length < 2) {
        this.contractlist.push("");
      }
    },
    deleteItem(index) {
      this.contractlist.splice(index, 1);
    },
    ischecked(str) {
      if (this.dutyList.indexOf(str) > -1) {
        return true;
      }
      return false;
    },
    checkboxChange(item) {
      console.log(item, 'checkboxChange');
      let index = this.dutyList.findIndex((o) => {
        return o === item.value;
      });
      if (index < 0) {
        this.dutyList.push(item.value);
      } else {
        this.dutyList.splice(index, 1);
      }
    },
    //上传图片回调正面
    uploadfinishFront(val) {
      let list = val.data;
      this.identityCardFront = list;
    },
    //删除回调正面
    deleteUrlFront(val) {
      let list = val.data;
      this.identityCardFront = list;
    },
    //上传图片回调反面
    uploadfinishBehind(val) {
      let list = val.data;
      this.identityCardBehind = list;
    },
    //删除回调反面
    deleteUrlBehind(val) {
      let list = val.data;
      this.identityCardBehind = list;
    },
    //上传附件回调
    uploadAttachment(val) {
      let list = val.data;
      this.fileList = list;
    },
    //删除附件
    deleteAttachment(val) {
      let list = val.data;
      this.fileList = list;
    },
    remarkmethod(val) {
      this.saveDic.remark = val;
    },
    //取消按钮
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //确定按钮
    clicksave() {
      if (this.customName === "") {
        uni.showToast({
          icon: "none",
          title: "请输入联系人姓名",
        });
        return;
      }
      if (this.phoneNum === "") {
        uni.showToast({
          icon: "none",
          title: "请输入手机号",
        });
        return;
      }
      if (this.$datestr.isphonenum(this.phoneNum) === false) {
        uni.showToast({
          icon: "none",
          title: "请输入正确手机号",
        });
        return;
      }
      if (this.contractlist.length > 0) {
        if (
          this.contractlist.find((o) => {
            return o === this.phoneNum;
          })
        ) {
          uni.showToast({
            icon: "none",
            title: "主手机号与副手机号存在重复",
          });
          return;
        }
        if (this.isRepeat(this.contractlist)) {
          uni.showToast({
            icon: "none",
            title: "副手机号存在重复",
          });
          return;
        }
        let resultlistStr = "";
        this.contractlist.forEach((o) => {
          if (o != "") {
            if (this.$datestr.isphonenum(o) === false) {
              if (resultlistStr === "") {
                resultlistStr = o;
              } else {
                resultlistStr = resultlistStr + "," + o;
              }
            }
          }
        });
        if (resultlistStr != "") {
          let toaststr = "请输入正确副手机号:[" + resultlistStr + "]不正确";
          uni.showToast({
            icon: "none",
            title: toaststr,
          });
          return;
        }
      }
      if (this.dutyList.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择联系人职责",
        });
        return;
      }
      if (this.email != "") {
        if (this.$datestr.isemail(this.email) === false) {
          uni.showToast({
            icon: "none",
            title: "请输入正确邮箱",
          });
          return;
        }
      }
      if (this.idcardRequair) {
        if (this.identy == "") {
          uni.showToast({
            icon: "none",
            title: "请输入身份证号",
          });
          return;
        }
        if (this.identityCardFront.length == 0) {
          uni.showToast({
            icon: "none",
            title: "请选择身份证人像面",
          });
          return;
        }
        if (this.identityCardBehind.length == 0) {
          uni.showToast({
            icon: "none",
            title: "请选择身份证国徽面",
          });
          return;
        }
      }
      if (this.identy != "") {
        if (this.$datestr.isIdCard(this.identy) === false) {
          uni.showToast({
            icon: "none",
            title: "请输入正确身份证号",
          });
          return;
        }
      }
      this.saveDicToNet();
    },
    isRepeat(arr) {
      console.log(JSON.stringify(arr));
      let hash = {};
      let isrepeat = false;
      arr.forEach((o) => {
        if (o != "") {
          if (hash[o]) {
            isrepeat = true;
          }
          hash[o] = true;
        }
      });
      return isrepeat;
    },
    saveDicToNet() {
      let identityCardFront=this.identityCardFront.length>0?this.identityCardFront:this.identityCardFrontAuto;
      let param = {
        id: this.saveDic.id,
        name: this.customName,
        phoneNum: this.phoneNum,
        customerId: this.saveDic.customerId,
        identity: this.identy,
        dutyList: this.dutyList,
        identityCardBehind: this.identityCardBehind || [],
        identityCardFront: identityCardFront||[],
        remark: this.saveDic.remark,
        fileList: this.fileList,
        address : this.address
      }
      let method =this.saveDic.id?'PUT': "POST";
      this.$network
        .getData(this.$url.LINKMAN_PERSON_CONNECT, method, param).then((res) => {
          uni.$emit("refreshData-connect", {
            item: res,
            index: this.editindex,
          });
          uni.navigateBack({
            delta: 1
          });
        }).catch((err) => {
          console.log(JSON.stringify(err));
          uni.navigateBack({
            delta: 1,
          });
        })

    },
    takePic() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (chooseImageRes) => {
          console.log(JSON.stringify(chooseImageRes, "chooseImageRes"));
          const tempFilePaths = chooseImageRes.tempFilePaths;
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
          uni.uploadFile({
            url: uploadUrl, //仅为示例，非真实的接口地址
            header: headerDic,
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              type: "contact_identitycard_front",
              uploadType: "attachment",
            },

            success: (uploadFileRes) => {
              uni.hideLoading();
              let resData = uploadFileRes.data
                ? JSON.parse(uploadFileRes.data)
                : {};
              this.identityCardFrontAuto[0] = resData.result;
              if (resData.code && resData.code == 200) {
                uni.showLoading({
                  mask: true,
                  title: "身份证识别中",
                });
                // 身份证识别
                this.$network
                  .getData(this.$url.IDCARDFRONT, "GET", {
                    idCardUrl: resData.result.url,
                  })
                  .then((result) => {
                    console.log(result, 'result');
                    this.customName = result.name;
                    this.identy = result.idNum;
                    this.address = result.address;
                    this.takePicUrl = resData.result;
                    uni.hideLoading();
                  })
                  .catch((err) => {
                    uni.hideLoading();
                  });
                console.log(resData.result.url, "-------------------");
              } else {
                console.log(uploadFileRes);
                console.log("fail");
              }
            },
          });
        },
        fail: (error) => {
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-left: 16rpx;
    .line {
        display: inline-block;
        width: 2px;
        height: 34rpx;
        background-color: #e60000;
        margin-right: 10px;
        position: absolute;
        top: 12px;
        left: -8px;
    }
    .tip{
      font-weight: 400;
      font-size: 24rpx;
      color: #F08200;
      margin-right: 15rpx;
    }
}
.creat-person-bg {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 70px;
  background: #ffffff;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px dotted;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #8c8c8c;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-left: 8px;
}

.txlview {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
  font-size: 20px;
  color: $uni-color-primary;
}

.addView {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 20px;
  height: 20px;
  font-size: 15px;
  border-radius: 10px;
  background: $uni-color-primary;
  color: #ffffff;
}

.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
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
}

.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.radio-bg {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: $uni-line-color 1px dotted;
}

.paizhao {
  margin-left: 10px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  text-align: center;
  color: #e60000;
}

.choose-wl {
  display: flex;
  flex-direction: row;
  padding: 10px 0px 5px 0px;
  color: #8c8c8c;
  font-size: $uni-font-size-base;
}

.uni-list {
  display: flex;
  flex: 1;
  padding: 5px 0px 10px 0px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.radio {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 33%;
  margin-top: 6px;
  color:#222;
  font-size: 15px;
  transform: scale(0.7);
}
</style>
