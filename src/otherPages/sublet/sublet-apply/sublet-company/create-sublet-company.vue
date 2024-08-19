<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <create-step @submitApply="clicksave" :controllWf="false">
      <view class="content-container">
        <view class="sum-view-bg">
          <view class="cell-input-view">
            <view class="cell-input-view-left"
              ><text>公司名称</text><span style="color: #ff0000">*</span></view
            >
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="text"
                v-model="companyDic.name"
                placeholder="请输入公司名称...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"
              ><text>联系人</text><span style="color: #ff0000">*</span></view
            >
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="text"
                v-model="companyDic.contact"
                placeholder="请输入联系人...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"
              ><text>电话</text><span style="color: #ff0000">*</span></view
            >
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="number"
                v-model="companyDic.phone"
                placeholder="请输入电话...."
              />
            </view>
          </view>

          <select-label-item
            :isRequired="true"
            tagName="区域"
            hint="请选择区域"
            :icon="righticon"
            @clickItemLabel="showdialog"
            :value="companyDic.orgName"
          />
          <selectorInputIcon
            title="地址"
            placeholder="请选择地址"
            :content="companyDic.address"
            :isRequire="true"
            @iconClick="goTo"
            @textChage="textChange($event, 'deliveryPlace')"
          />
          <!-- <select-label-item
            :isRequired="true"
            tagName="地址"
            hint="请选择地址"
            :icon="addricon"
            @clickItemLabel="goTo"
            :value="companyDic.address"
          /> -->
          <imgupload
            @uploadfinish="uploadfinish"
            @deleteUrl="deleteUrl"
            type="sublet_type"
            uploadType="attachment"
            maximg="20"
            :imgFinishlist="companyDic.fileList"
          />
          <text-label-item
            tagName="备注"
            placeholder="请输入备注..."
            @ipnuttext="remarkmethod"
            :inputValue="companyDic.remark"
          />
        </view>
      </view>
      <!-- 类型选择 -->
      <w-picker
        :selectList="regions"
        @confirm="onConfirm"
        mode="selector"
        ref="selector"
        themeColor="#E60000"
      />
    </create-step>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
    wPicker,
    createStep,
    imgupload,
    selectorInputIcon,
  },
  data() {
    return {
      addricon: "icon-css iconzl--zuobiao",
      righticon: "iconarrow-right",
      regions: [],
      region: {},
      type: "create",
      companyId: "",
      addressDic: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      companyDic: {},
    };
  },
  onLoad(option) {
    this.$datestr.printlog("option" + JSON.stringify(option));
    if (option.type) {
      this.type = option.type;
    }
    if (option.companyId) {
      this.companyId = option.companyId;
    }
    if (this.type === "create") {
      uni.setNavigationBarTitle({
        title: "新建转租公司",
      });
    } else {
      uni.setNavigationBarTitle({
        title: "修改转租公司",
      });
    }

    this.getDetail();
    this.loadOrgs();
    uni.$on("choose-address", (obj) => {
      this.$datestr.printlog("choose-address==" + JSON.stringify(obj.data));
      this.addressDic = obj.data;
      this.companyDic = {
        ...this.companyDic,
        address: this.addressDic.address,
      };
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租公司",
      "新增"
    );
  },
  methods: {
    textChange(val, type) {
      console.log(val);
      let dict = {
        ...this.dataDic,
        deliveryPlace: val,
      };
      this.companyDic.address = val;
    },
    getDetail() {
      if (this.companyId) {
        let urlstr = this.$url.SUBLET_CONMPANY_DETAIL.replace(
          /{subletCompanyId}/,
          this.companyId
        );
        this.$network
          .getData(urlstr, "GET", null)
          .then((result) => {
            this.companyDic = {
              ...result,
            };
          })
          .catch((err) => {});
      }
    },
    loadOrgs() {
      uni.showLoading();
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.regions = this.getChildren(list);
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
        });
      }
      return arr;
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.$datestr.printlog(JSON.stringify(list));
      this.companyDic = {
        ...this.companyDic,
        fileList: [...list],
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.companyDic = {
        ...this.companyDic,
        fileList: [...list],
      };
    },
    goTo() {
      uni.navigateTo({
        url: "/otherPages/map/nvr-map?deliveryAddress=" + JSON.stringify(this.addressDic),
      });
    },
    showdialog() {
      this.selectList = this.regions ? this.regions : [];
      this.$refs.selector.show();
    },
    //输入框回调
    remarkmethod(val) {
      this.companyDic.remark = val;
    },
    //弹窗回调
    onConfirm(val) {
      this.$datestr.printlog("VAL" + JSON.stringify(val));
      this.companyDic = {
        ...this.companyDic,
        orgId: val.checkArr.value,
        orgName: val.checkArr.label,
      };
    },
    checkData() {
      if (!this.companyDic.name) {
        uni.showToast({
          title: "请填写公司名称",
          icon: "none",
        });
        return Promise.reject("fail");
      }
      if (!this.companyDic.contact) {
        uni.showToast({
          title: "请填写联系人",
          icon: "none",
        });
        return Promise.reject("fail");
      }
      if (!this.companyDic.phone) {
        uni.showToast({
          title: "请填写电话",
          icon: "none",
        });
        return Promise.reject("fail");
      }
      if (!this.$datestr.isphonenum(this.companyDic.phone)) {
        uni.showToast({
          icon: "none",
          title: "请输入正确的电话",
        });

        return Promise.reject("fail");
      }

      if (!this.companyDic.orgName) {
        uni.showToast({
          title: "请选择区域",
          icon: "none",
        });
        return Promise.reject("fail");
      }
      if (!this.companyDic.address) {
        uni.showToast({
          title: "请选择地址",
          icon: "none",
        });
        return Promise.reject("fail");
      }
      return Promise.resolve("success");
    },
    //确定按钮
    clicksave() {
      if (this.type === "create") {
        this.dealData("POST");
      } else {
        this.dealData("PUT");
      }
    },
    dealData(method) {
      this.$network
        .getData(this.$url.CREATE_SUBLET_CONMPANY, method, this.companyDic)
        .then((result) => {
          uni.navigateBack({
            animationDuration: 200,
          });
          uni.$emit("refresh-list");
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.content-container {
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  // margin: 10px;
  background: #ffffff;
  // border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px solid;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.choose-device-text {
  color: $uni-color-primary;
}

.item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 6px 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-title {
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  padding: 4px 0px;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 16px;
  font-size: $uni-font-size-base;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  color: #ff0000;
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
</style>
