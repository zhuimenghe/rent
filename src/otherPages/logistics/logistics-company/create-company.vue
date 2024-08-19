<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="sum-view-bg" style="margin-bottom: 5px">
      <view
        class="cell-input-view"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <view class="cell-input-view-left boldstyle"><text>物流公司</text></view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"
          ><text>公司名称</text><text style="color: #ff0000">*</text></view
        >
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="dataDic.name"
            placeholder="请输入公司名称...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"
          ><text>联系人</text><text style="color: #ff0000">*</text></view
        >
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="dataDic.contacts"
            placeholder="请输入联系人...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"
          ><text>联系人电话</text><text style="color: #ff0000">*</text></view
        >
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="number"
            v-model="dataDic.phoneNum"
            placeholder="请输入联系人电话...."
          />
        </view>
      </view>
      <c-image-upload
        @uploadfinish="uploadfinish"
        @deleteUrl="deleteUrl"
        :imgFinishlist="dataDic.fileList"
        type="logistics_company"
        uploadType="attachment"
        :maximg="20"
      />
      <view class="pop-container">
        <uni-popup ref="companyDialog" type="center" :mask-click="false">
          <view class="uni-tip">
            <view class="tip-title"> 修改物流公司 </view>
            <view class="row-item">
              <view class="row-tag"> 公司名称<span style="color: #ff0000">*</span> </view>
              <input
                class="input-style"
                v-model="dialogData.name"
                placeholder="请填写公司名称..."
              />
            </view>
            <view class="row-item">
              <view class="row-tag"> 联系人<span style="color: #ff0000">*</span> </view>
              <input
                class="input-style"
                v-model="dialogData.contacts"
                placeholder="请填写联系人..."
              />
            </view>
            <view class="row-item">
              <view class="row-tag"> 联系电话<span style="color: #ff0000">*</span> </view>
              <input
                class="input-style"
                v-model="dialogData.phoneNum"
                placeholder="请填写联系电话..."
                type="number"
              />
            </view>
            <imgupload
              @uploadfinish="uploadfinishupdata"
              @deleteUrl="deleteUrlupdata"
              :imgFinishlist="dialogData.fileList"
              type="logistics_company"
              uploadType="attachment"
              :maximg="20"
            />
            <view class="uni-tip-group-button">
              <text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
              <text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
            </view>
          </view>
        </uni-popup>
      </view>
    </view>

    <driverVue :dataDic="dataDic" @clickevent="clickevent" />
    <machinesVue :dataDic="dataDic" @clickevent="clickevent" />
    <view style="height: 80px; width: 100%"></view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
      <view class="bottom-right-view" @click="clicksave">
        <text>保存</text>
      </view>
    </view>
  </view>
</template>
<script>
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import companyVue from "./logistics-company.vue";
import machinesVue from "./logistics-machines.vue";
import driverVue from "./logistics-driver.vue";
export default {
  components: {
    selectView,
    wPicker,
    companyVue,
    machinesVue,
    driverVue,
  },
  data() {
    return {
      dataDic: {
        name: "",
        contacts: "",
        phoneNum: "",
      },
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      dialogData: {},
    };
  },
  onLoad(options) {},
  watch: {
    "dataDic.name"(val) {
      let dict = {
        ...this.dataDic,
        name: val,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    "dataDic.contacts"(val) {
      let dict = {
        ...this.dataDic,
        contacts: val,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    "dataDic.phoneNum"(val) {
      let dict = {
        ...this.dataDic,
        phoneNum: val,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
  },
  methods: {
    clickevent(val) {
      switch (val.type) {
        case "value":
          let dic = val.data;
          this.dataDic = {
            ...dic,
          };
          break;
        default:
          break;
      }
    },
    //----------
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    clicksave() {
      if (!this.dataDic.name) {
        uni.showToast({
          icon: "none",
          title: "请输入公司名称",
        });
        return;
      }
      if (!this.dataDic.contacts) {
        uni.showToast({
          icon: "none",
          title: "请输入联系人",
        });
        return;
      }
      if (!this.dataDic.phoneNum) {
        uni.showToast({
          icon: "none",
          title: "请输入联系人电话",
        });
        return;
      }
      if (!this.dataDic.logisticsDrivers) {
        this.dataDic.logisticsDrivers = [];
      }
      this.dataDic.logisticsDrivers.push({
        name: this.dataDic.contacts,
        phoneNum: this.dataDic.phoneNum,
        remark: "",
        fileList: [],
        logisticsProviderType: "2",
      });
      this.$network
        .getData(this.$url.LOGISTICS_URL, "POST", this.dataDic)
        .then((result) => {
          uni.$emit("refreshData-company", {
            type: "refund",
          });
          uni.navigateBack({
            delta: 1,
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title:
              err.details && err.details[0]
                ? err.details[0]
                : err.message
                ? err.message
                : "",
          });
          uni.hideLoading();
        });
    },
    callPhone(phone) {
      if (!this.isadd && phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          success: (res) => {
            console.log("调用成功!");
          },
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.dataDic = {
        ...this.dataDic,
        fileList: [...list],
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.dataDic = {
        ...this.dataDic,
        fileList: [...list],
      };
    },
    showDialog() {
      this.dialogData = {
        ...this.dataDic,
      };
      this.$refs.companyDialog.open();
    },
    cancelDialog() {
      this.$refs.companyDialog.close();
    },
    confirmDialog() {
      if (!this.dialogData) {
        return;
      }
      if (!this.dialogData.name) {
        uni.showToast({
          title: "请填写公司名称",
          icon: "none",
        });
        return;
      }
      if (!this.dialogData.contacts) {
        uni.showToast({
          title: "请填写联系人",
          icon: "none",
        });
        return;
      }
      if (!this.dialogData.phoneNum) {
        uni.showToast({
          title: "请填写联系电话",
          icon: "none",
        });
        return;
      }
      uni.showLoading();
      this.dealInfo("PUT");
    },
    dealInfo(method) {
      this.$network
        .getData(this.$url.LOGISTICS_URL, "PUT", this.dialogData)
        .then((result) => {
          this.$emit("clickeventupdata", {
            type: "value",
            data: {},
          });
          this.cancelDialog();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title:
              err.details && err.details[0]
                ? err.details[0]
                : err.message
                ? err.message
                : "",
          });
        });
    },
    //上传图片回调
    uploadfinishupdata(val) {
      let list = val.data;
      this.dialogData = {
        ...this.dataDic,
        fileList: [...list],
      };
    },
    //删除回调
    deleteUrlupdata(val) {
      let list = val.data;
      this.dialogData = {
        ...this.dataDic,
        fileList: [...list],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: $uni-bg-color-grey;
}

.bg-view {
  width: 100%;
  background: $uni-bg-color-grey;
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

.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 10px;
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
  // 	border-bottom: 1px solid $uni-bg-color-grey;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  min-height: 24px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.update-btn {
  padding: 3px 5px;
  border-radius: 3px;
  background: $uni-color-primary;
  color: #ffffff;
  font-size: $uni-font-size-base;
  font-weight: normal;
}

.pop-container {
  position: relative;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.col-item {
  display: flex;
  margin-top: 5px;
  flex-direction: column;
  align-items: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.row-tag {
  width: 98px;
  text-align: left;
}

.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
}

.text-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
  border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
  height: 45px;
  width: calc(100% - 15px);
  margin-top: 8px;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}
</style>
