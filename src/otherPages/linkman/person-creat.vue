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
          <text>姓名</text>
          <text style="color: #ff0000">*</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="customName"
            placeholder="请输入姓名...."
          />
          <i
            v-if="contractlist.length === 0"
            class="iconfont iconpaizhao paizhao"
            @click="takePic"
          ></i>
          <!-- #ifdef APP-PLUS -->
          <i
            class="iconfont txlview icontongxunlu"
            @click="gotoPhoneContract"
          ></i>
          <!-- #endif -->
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>手机号</text>
          <text style="color: #ff0000">*</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="phoneNum"
            placeholder="请输入手机号...."
          />
        </view>
        <!-- <i
          v-if="contractlist.length === 0"
          class="iconfont addView iconadd"
          @click="addNewPhoneNum"
        ></i> -->
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>身份证号</text>
          <text style="color: #ff0000" v-if="idcardRequair">*</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="idcardnum"
            placeholder="请输入身份证号...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>客户地址</text></view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="customAddress"
            placeholder="请输入客户地址...."
          />
        </view>
      </view>
      <select-label-item
        tagName="区域"
        tagColor='#8c8c8c'
        isRequired="true"
        hint="请选择区域"
        :value="areaDic.label"
        :icon="righticon"
        @clickItemLabel="choosearea"
      />
      <select-label-item
        tagName="业务负责人"
        tagColor='#8c8c8c'
        isRequired="true"
        hint="请选择业务负责人"
        :value="ownerDic.label"
        :icon="righticon"
        @clickItemLabel="chooseowner"
      />
      
    
      <view v-for="(item, index) in contractlist" :key="index">
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>副手机号{{ index + 1 }}</text>
          </view>
          <view class="cell-input-view-right">
            <input
              class="input-style"
              type="number"
              v-model="contractlist[index]"
              placeholder="请输入手机号...."
            />
          </view>
          <i
            v-if="contractlist.length < 2 && index === contractlist.length - 1"
            class="iconfont addView iconadd"
            @click="addNewPhoneNum"
          ></i>
          <i class="iconfont addView iconjian" @click="deleteItem(index)"></i>
        </view>
      </view>
   
    
      <imgupload
        titleColor="#8c8c8c"
        :idRequair="idcardRequair"
        @uploadfinish="uploadfinishFront"
        @deleteUrl="deleteUrlFront"
        type="customer_identitycard_front"
        uploadType="attachment"
        maximg="1"
        title="身份证人像面"
        :imgFinishlist="identityCardFront"
        :takePicUrl="takePicUrl"
        ref="front"
      />
      <imgupload
        titleColor="#8c8c8c"
        :idRequair="idcardRequair"
        @uploadfinish="uploadfinishBehind"
        @deleteUrl="deleteUrlBehind"
        type="customer_identitycard_behind"
        uploadType="attachment"
        maximg="1"
        title="身份证国徽面"
        :imgFinishlist="identityCardBehind"
      />
      <imgupload
        titleColor="#8c8c8c"
        @uploadfinish="uploadAttachment"
        @deleteUrl="deleteAttachment"
        type="personal_customer_attachment"
        uploadType="attachment"
        maximg="20"
        title="其他附件"
        :imgFinishlist="fileList"
      />
      <text-label-item
        tagName="备注"
        tagColor='#8c8c8c'
        placeholder="请输入备注..."
        @ipnuttext="remarkmethod"
        :inputValue="saveDic.remark"
        :isShowBorder="true"
      />
    </view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle"
        ><text>取消</text></view
      >
      <view class="bottom-right-view" @click="clicksave"
        ><text>保存</text></view
      >
    </view>
    <!-- 类型选择 -->
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
export default {
  components: {
    selectLabelItem,
    wPicker,
    imgupload,
    textLabelItem,
  },
  data() {
    return {
      righticon: "iconarrow-right",
      areaDic: {},
      ownerDic: {},
      customName: "",
      phoneNum: "",
      contractlist: [],
      idcardnum: "",
      customAddress: "",
      type: "area",
      areaList: [],
      ownerList: [],
      selectList: [],
      identityCardFront: [],
      identityCardBehind: [],
      fileList: [],
      saveDic: {},
      isedit: false,
      topage: "",
      idcardRequair: false,
      takePicUrl: null,
      identityCardFrontAuto:[]
    };
  },
  onLoad(option) {
    // is_identity_required
    this.topage = option.choose || "";
    if (option.edit == "true") {
      let item = JSON.parse(decodeURIComponent(option.item));
      this.getDetailWithId(item.id);
      this.isedit = true;
    } else {
      let res = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      if (res) {
        this.areaDic = {
          label: res.orgName,
          value: res.orgIds[0],
        };
        // if (res.roleType === this.$savekey.USER_ROLE_BUSINESS) {
        if (
          this.$gxfmethod.issameRoleType(res, this.$savekey.USER_ROLE_BUSINESS)
        ) {
          this.ownerDic = {
            label: res.username,
            value: res.id,
          };
        }
      }
    }
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "is_identity_required");
      if (obj) {
        //是否必须输入身份证
        this.idcardRequair = obj.value === "true" ? true : false;
      }
    }
    this.loadAreaList();
    uni.$on("phone-contract-item", (item) => {
      let dict = item.data;
      this.customName = dict.displayName || "";
      this.phoneNum = this.phoneNumShow(dict);
    });
    uni.$on("goto-business", (usnerinfo) => {
      uni.switchTab({
        url: "/pages/main/business",
      });
    });
  },
  onUnload() {
    uni.$off("goto-business");
  },
  methods: {
    //获取详情
    getDetailWithId(customId) {
      let url = this.$url.CUSRTOMER_DETAIL + customId;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          let item = result;
          this.areaDic = {
            label: item.orgName,
            value: item.orgId,
          };
          this.ownerDic = {
            label: item.salesmanName,
            value: item.salesman,
          };
          this.customName = item.name || "";
          this.phoneNum = item.phoneNum || "";
          this.contractlist = item.secondaryPhoneList || [];
          this.idcardnum = item.identity || "";
          this.customAddress = item.address || "";
          this.identityCardFront = item.identityCardFront || [];
          this.identityCardBehind = item.identityCardBehind || [];
          this.fileList = item.personalCustomerAttachmentFileList || [];
          this.saveDic = {
            ...result,
          };
        })
        .catch((err) => {});
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
    addNewPhoneNum() {
      if (this.contractlist.length < 2) {
        this.contractlist.push("");
      }
    },
    deleteItem(index) {
      this.contractlist.splice(index, 1);
    },
    remarkmethod(val) {
      this.saveDic.remark = val;
    },
    //加载地区
    loadAreaList() {
      uni.showLoading();
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.areaList = this.getChildren(list);
          if (this.isedit === false) {
            if (this.areaList.length > 0) {
              let org = this.areaList.find((item) => {
                if (item.value === this.areaDic.value) {
                  return item;
                }
              });
              this.areaDic = org;
              this.loadOwnerList(this.areaDic.value, false);
            }
          } else {
            this.loadOwnerList(this.areaDic.value, false);
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getChildren(data) {
      let arr = [];
      if (data) {
        data.forEach((o) => {
          let a = {
            value: o.id,
            label: o.name,
          };
          arr = [...arr, a];
          if (o.children && o.children.length > 0) {
            arr = [...arr, ...this.getChildren(o.children)];
          }
          // else {
          // 	arr = [...arr, a];
          // }
        });
      }
      return arr;
    },
    //加载负责人
    loadOwnerList(orgId, isfirst) {
      let param = {
        showAdmin: false,
        orgId: orgId,
        roleType: this.$savekey.USER_ROLE_BUSINESS,
      };
      uni.showLoading();
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          let list = result;
          this.ownerList = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
            };
          });
          if (isfirst === true) {
            if (this.ownerList.length > 0) {
              this.ownerDic = this.ownerList[0];
            }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    choosearea() {
      this.type = "area";
      this.selectList = [];
      this.selectList = [...this.areaList];
      this.showdialog();
    },
    chooseowner() {
      this.type = "owner";
      this.selectList = [];
      this.selectList = [...this.ownerList];
      this.showdialog();
    },
    //显示底部picker
    showdialog() {
      this.$refs.selector.show();
    },
    //弹窗回调
    dialog(val) {
      if (this.type === "area") {
        this.areaDic = val.checkArr;
        this.loadOwnerList(this.areaDic.value, true);
      } else if (this.type === "owner") {
        this.ownerDic = val.checkArr;
      }
    },
    //上传图片回调正面
    uploadfinishFront(val) {
      let list = val.data;
      this.identityCardFront = list;
      console.log(val.data, "-------------");
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
              type: "customer_identitycard_front",
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
                    console.log(result);
                    this.customName = result.name;
                    this.idcardnum = result.idNum;
                    this.customAddress = result.address;
                    this.takePicUrl = resData.result;
                    console.log(resData.result.url, "resData.result.url");
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

    //取消按钮
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    gotoPhoneContract() {
      uni.navigateTo({
        url: "./phone-contract-list",
      });
    },
    //确定按钮
    clicksave() {
      if (this.areaDic.label == undefined || this.areaDic.label === "") {
        uni.showToast({
          icon: "none",
          title: "请选择区域",
        });
        return;
      }
      if (this.ownerDic.label === undefined || this.ownerDic.label === "") {
        uni.showToast({
          icon: "none",
          title: "请选择业务负责人",
        });
        return;
      }
      if (this.customName === "") {
        uni.showToast({
          icon: "none",
          title: "请输入姓名",
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
      if (this.$datestr.isphonenum(this.phoneNum) === false) {
        uni.showToast({
          icon: "none",
          title: "请输入正确手机号",
        });
        return;
      }
      if (this.idcardRequair) {
        if (this.idcardnum == "") {
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
      if (this.idcardnum != "") {
        if (this.$datestr.isIdCard(this.idcardnum) === false) {
          uni.showToast({
            icon: "none",
            title: "请输入正确身份证号",
          });
          return;
        }
      }
      this.httprequestData();
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
    httprequestData() {
      uni.showLoading({
        mask: true,
      });
      let list = this.contractlist.filter((o) => {
        return o != "";
      });
      this.saveDic.orgId = this.areaDic.value;
      (this.saveDic.salesman = this.ownerDic.value),
        (this.saveDic.name = this.customName),
        (this.saveDic.phoneNum = this.phoneNum),
        (this.saveDic.secondaryPhoneList = list);
      (this.saveDic.identity = this.idcardnum),
        (this.saveDic.address = this.customAddress),
        (this.saveDic.type = "2");
      this.saveDic.identityCardFront = this.identityCardFront.concat(this.identityCardFrontAuto) || [];
      this.saveDic.identityCardBehind = this.identityCardBehind;
      this.saveDic.personalCustomerAttachmentFileList = this.fileList;
      let method = "POST";
      if (this.isedit === true) {
        method = "PUT";
      }
      this.$network
        .getData(this.$url.LINKMAN_PERSON_CREAT, "POST", this.saveDic)
        .then((result) => {
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
          uni.$emit("refreshData-linkman", {
            type: "person",
          });
          if (this.isedit === false) {
            uni.showModal({
              title: "提示",
              content: "是否使用该用户新建合同?",
              success: (res) => {
                if (res.cancel) {
                  uni.navigateBack({
                    delta: 1,
                  });
                } else {
                  if (this.topage === "") {
                    uni.navigateTo({
                      url:
                        "/contractPages/contract/create-contract?link=" +
                        encodeURIComponent(JSON.stringify(result)),
                    });
                  } else {
                    uni.$emit("linkman-emit-person", {
                      dict: result,
                    });
                    uni.navigateBack({
                      delta: 2,
                    });
                  }
                }
              },
            });
          } else {
            uni.navigateBack({
              delta: 1,
            });
          }
        })
        .catch((err) => {
          if (err.code == 50003) {
            uni.showToast({
              title: err.details[0],
              icon: "none",
            });
          } else {
            uni.showToast({
              title: err.message,
              icon: "none",
            });
          }
          uni.hideLoading();
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
  color:#8c8c8c;
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

.paizhao {
  margin-left: 10px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  text-align: center;
  color: #e60000;
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
  border-radius: 6rpx;
  background: #D8D8D8;
  font-size: $uni-font-size-lg;
  color: #fff;
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
  border-radius: 6rpx;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin: 10px;
}
</style>
