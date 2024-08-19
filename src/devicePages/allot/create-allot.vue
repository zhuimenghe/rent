<template>
  <view class="create-allot-bg">
    <create-step
      processKey="allocation"
      @submitApply="clicksave"
      :isUpdate="isUpdate"
      :itemData="itemData"
      @data-form="getBackData"
      :updateObj="allotDic"
    >
      <view class="content-container">
        <view class="sum-view-bg" style="margin-bottom: 5px">
          <view
            class="cell-input-view"
            style="
              border-bottom-width: 1px;
              border-bottom-color: #eeeeee;
              border-bottom-style: solid;
            "
          >
            <view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
          </view>
          <select-label-item
            tagName="调拨单号"
            :isRequired="true"
            :isSelect="false"
            :value="allotDic.businessNo"
          />
          <select-label-item
            tagName="调拨用户"
            :isRequired="true"
            :value="allotDic.createName"
            :isSelect="false"
          />
          <select-label-item
            tagName="调出区域"
            hint="请选择调出区域"
            :isRequired="true"
            :icon="righticon"
            @clickItemLabel="showdialog('out')"
            :value="allotDic.orgOldName"
          />
          <select-label-item
            tagName="调出地址"
            hint="请选择调出地址"
            :isRequired="true"
            :icon="addricon"
            @clickItemLabel="goTo('out')"
            :value="allotDic.addressOld"
          />
          <select-label-item
            tagName="调入区域"
            hint="请选择调入区域"
            :isRequired="true"
            :icon="righticon"
            @clickItemLabel="showdialog('in')"
            :value="allotDic.orgNewName"
          />
          <select-label-item
            tagName="调入地址"
            hint="请选择调入地址"
            :isRequired="true"
            :icon="addricon"
            @clickItemLabel="goTo('in')"
            :value="allotDic.addressNew"
          />
          <select-label-item
            tagName="是否物流"
            hint="请选择是否物流"
            :isRequired="true"
            :icon="righticon"
            @clickItemLabel="showdialog('logisticsFlag')"
            :value="allotDic.needLogistics ? '是' : '否'"
          />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>调拨原因</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                v-model="allotDic.reason"
                placeholder="请输入调拨原因...."
              />
            </view>
          </view>
          <text-label-item
            tagName="备注"
            placeholder="请输入备注..."
            @ipnuttext="remarkmethod"
            :inputValue="allotDic.remark"
          />

          <imgupload
            @uploadfinish="uploadfinish"
            @deleteUrl="deleteUrl"
            type="allot_contract"
            uploadType="attachment"
            maximg="20"
            :imgFinishlist="allotDic.fileList"
          />
        </view>
        <view class="sum-view-bg">
          <view
            class="cell-input-view"
            style="
              border-bottom-width: 1px;
              border-bottom-color: #eeeeee;
              border-bottom-style: solid;
            "
          >
            <view class="cell-input-view-left boldstyle"><text>设备信息</text></view>
            <view class="cell-input-view-right" style="justify-content: flex-end">
              <text class="choose-device-text" @click="goTo('device')">选择设备</text>
            </view>
          </view>
          <view v-for="(d, i) in allotDic.machineAllocationList" :key="i">
            <view class="device-item-container">
              <view class="item-row item-title">
                <view class="item-tag">{{ d.licenseId || "" }}</view>
                <view class="item-value">
                  <text class="input-style"
                    >{{ d.stateName || "" }}-{{ d.subStateName || "" }}</text
                  >
                </view>
              </view>
              <view class="item-row">
                <view class="item-tag">型号</view>
                <view class="item-value">
                  <text class="input-style">{{ d.machineTypeName || "" }}</text>
                </view>
              </view>
              <view class="item-row">
                <view class="item-tag">自喷码</view>
                <view class="item-value">
                  <text class="input-style">{{ d.printCode || "" }}</text>
                </view>
              </view>
              <view class="item-row">
                <view class="item-tag">当前位置</view>
                <view class="item-value">
                  <text class="input-style">{{ d.address || "" }}</text>
                </view>
              </view>
              <view class="item-bottom">
                <view class="item-tag" style="color: #ff0000" @click="deleteItem(i)"
                  >删除</view
                >
              </view>
            </view>
          </view>
        </view>
        <view class="sum-view-bg" v-if="allotDic.needLogistics">
          <view
            class="cell-input-view"
            style="
              border-bottom-width: 1px;
              border-bottom-color: #eeeeee;
              border-bottom-style: solid;
            "
          >
            <view class="cell-input-view-left"
              ><text class="boldstyle">物流信息</text></view
            >
          </view>
          <select-label-item
            tagName="物流公司"
            hint="请选择物流公司"
            :isRequired="true"
            :icon="righticon"
            @clickItemLabel="showdialog('logisticsCompany')"
            :value="
              allotDic.logisticsRecord
                ? allotDic.logisticsRecord.logisticsCompanyName
                : ''
            "
          />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>联系人</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="text"
                v-model="logisticsContact"
                placeholder="请输入联系人...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>联系人电话</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="number"
                v-model="logisticsPhone"
                placeholder="请输入联系人电话...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>物流费用</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="digit"
                v-model="logisticsCarriage"
                placeholder="请输入物流费用...."
              />
            </view>
          </view>
          <select-label-item
            tagName="物流运输时间"
            hint="请选择运输时间"
            :isRequired="true"
            :icon="dateIcon"
            @clickItemLabel="showCalendar"
            :value="
              changestr(
                allotDic.logisticsRecord && allotDic.logisticsRecord.transportTime
              )
            "
          />
        </view>
      </view>
      <!-- 类型选择 -->
      <w-picker
        :selectList="selectList"
        @confirm="onConfirm"
        mode="selector"
        ref="selector"
        themeColor="#E60000"
      />
      <w-picker
        mode="date"
        startYear="2000"
        endYear="3000"
        :current="true"
        @confirm="onConfirmTime"
        :disabledAfter="false"
        ref="date"
        themeColor="#E60000"
      />
      <!-- 日历 -->
      <!-- <uni-calendar 
			style="z-index: 999;"
			:date="defaultDate"
			@confirm="confirm" 
			:insert="false" 
			ref="calendar"
			 /> -->
    </create-step>

    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";

export default {
  components: {
    selectLabelItem,
    textLabelItem,
    wPicker,
    createStep,
    imgupload,
  },
  watch: {
    logisticsContact(val) {
      this.allotDic = {
        ...this.allotDic,
        logisticsRecord: {
          ...this.allotDic.logisticsRecord,
          logisticsContact: val,
        },
      };
    },
    logisticsPhone(val) {
      this.allotDic = {
        ...this.allotDic,
        logisticsRecord: {
          ...this.allotDic.logisticsRecord,
          logisticsPhone: val,
        },
      };
    },
    logisticsCarriage(val) {
      this.allotDic = {
        ...this.allotDic,
        logisticsRecord: {
          ...this.allotDic.logisticsRecord,
          logisticsCarriage: val,
        },
      };
    },
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      addricon: "iconzl--zuobiao",
      righticon: "iconarrow-right",
      selectList: [],
      defaultDate: "",
      choosetype: "",
      logisticsFlags: [
        {
          label: "否",
          value: false,
        },
        {
          label: "是",
          value: true,
        },
      ],
      logisticsList: [],
      logistics: {},
      regions: [],
      region: {},
      outAddress: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      inAddress: {
        latitude: 0,
        longitude: 0,
        address: "",
      },
      jumpType: "",
      allotDic: {
        logisticsRecord: {
          logisticsContact: "",
          logisticsPhone: "",
          logisticsCarriage: "0",
        },
      },
      isUpdate: false,
      itemData: null,
      logisticsContact: "",
      logisticsPhone: "",
      logisticsCarriage: "0",
      isNeedNo: false,
    };
  },
  onLoad(option) {
    if (option.item) {
      this.itemData = JSON.parse(decodeURIComponent(option.item));
      this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false) : false;
    } else {
      this.initAllot();
      this.isNeedNo = true;
      // this.getBusinessNo();
    }
    this.loadLogistics();
    this.loadOrgs();

    uni.$on("choose-allot-device", (obj) => {
      this.allotDic = {
        ...this.allotDic,
        machineAllocationList: [...obj.list],
      };
    });
    uni.$on("choose-address", (obj) => {
      this.$datestr.printlog("choose-address==" + JSON.stringify(obj.data));
      switch (this.jumpType) {
        case "out":
          this.outAddress = obj.data;
          this.allotDic = {
            ...this.allotDic,
            addressOld: this.outAddress.address,
          };
          break;
        case "in":
          this.inAddress = obj.data;
          this.allotDic = {
            ...this.allotDic,
            addressNew: this.inAddress.address,
          };
          break;
        default:
          break;
      }
    });
  },
  methods: {
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    getBackData(val) {
      let dict = JSON.parse(val);
      this.allotDic = {
        ...dict,
        orgOld: dict.orgOldList[0],
        orgOldName: dict.orgOldNameList[0],
        logisticsRecord: {
          ...(dict.logisticsRecord || {}),
          transportTime: this.changestr(
            dict.logisticsRecord && dict.logisticsRecord.transportTime
          ),
        },
      };
      this.logisticsCarriage = this.allotDic.logisticsRecord.logisticsCarriage;
      this.logisticsContact = this.allotDic.logisticsRecord.logisticsContact;
      this.logisticsPhone = this.allotDic.logisticsRecord.logisticsPhone;
    },
    getBusinessNo() {
      let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, "DB");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.allotDic = {
            ...this.allotDic,
            businessNo: result,
          };
        })
        .catch((err) => {});
    },
    initAllot() {
      this.$network
        .getData(this.$url.ALLOT_INIT, "POST", null)
        .then((result) => {
          this.allotDic = {
            ...this.allotDic,
            createName: result.userName,
          };
          if (this.isNeedNo) {
            this.allotDic = {
              ...this.allotDic,
              businessNo: result.businessNo,
            };
          }
        })
        .catch((err) => {});
    },
    loadLogistics() {
      let param = {
        current: 1,
        size: 2000,
      };
      this.$network
        .getData(this.$url.MACHINE_LOGISTICS_COMPANY_LIST, "POST", param)
        .then((result) => {
          this.logisticsList = result.records.map((o) => {
            return {
              label: o.name,
              value: o.id,
            };
          });
        })
        .catch((err) => {});
    },
    loadLogisticsInfo(logisticsCompanyId) {
      let urlstr = this.$url.MACHINE_LOGISTICS_COMPANY_INFO.replace(
        /xxx/,
        logisticsCompanyId
      );
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          this.logisticsContact = result.contacts;
          this.logisticsPhone = result.phoneNum;
          this.allotDic = {
            ...this.allotDic,
            logisticsRecord: {
              ...this.allotDic.logisticsRecord,
              logisticsContact: result.contacts,
              logisticsPhone: result.phoneNum,
              logisticsCarriage: "0",
            },
          };
        })
        .catch((err) => {});
    },
    loadOrgs() {
      this.$network
        .getData(this.$url.ORG_LIST, "GET", null)
        .then((result) => {
          console.log(JSON.stringify(result));
          let orgs = result || [];
          let orgList = [];
          orgs.forEach(function dep(o) {
            orgList = [
              ...orgList,
              {
                label: o.name,
                value: o.id,
              },
            ];
            if (o.children && o.children.length > 0) o.children.map(dep);
          });
          this.regions = orgList;
        })
        .catch((err) => {});
    },
    deleteItem(pos) {
      this.allotDic.machineAllocationList.splice(pos, 1);
    },
    goTo(type) {
      this.jumpType = type;
      switch (type) {
        case "device":
          if (!this.allotDic.orgOld) {
            uni.showToast({
              title: "请选择调出区域",
              icon: "none",
            });
            return;
          }
          let urlStr = "./allot-car-choose?orgId=" + this.allotDic.orgOld;
          if (this.allotDic.machineAllocationList) {
            urlStr +=
              "&machineList=" +
              encodeURIComponent(JSON.stringify(this.allotDic.machineAllocationList));
          }
          uni.navigateTo({
            url: urlStr,
          });
          break;
        case "in":
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" + JSON.stringify(this.inAddress),
          });
          break;
        case "out":
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(this.outAddress),
          });
          break;
        default:
          break;
      }
    },

    //显示日历
    showCalendar() {
      this.$refs.date.show();
    },
    showdialog(type) {
      this.choosetype = type;
      // this.selectList = this.proceedList;
      switch (this.choosetype) {
        case "out":
        case "in":
          this.selectList = this.regions ? this.regions : [];
          this.$refs.selector.show();
          break;
        case "logisticsFlag":
          this.selectList = this.logisticsFlags ? this.logisticsFlags : [];
          this.$refs.selector.show();
          break;
        case "logisticsCompany":
          this.selectList = this.logisticsList ? this.logisticsList : [];
          this.$refs.selector.show();
          break;
        default:
          break;
      }
    },
    //输入框回调
    remarkmethod(val) {
      this.allotDic.remark = val;
    },
    //日历回调
    onConfirmTime(val) {
      this.allotDic = {
        ...this.allotDic,
        logisticsRecord: {
          ...this.allotDic.logisticsRecord,
          transportTime: val.result,
        },
      };
    },
    //弹窗回调
    onConfirm(val) {
      switch (this.choosetype) {
        case "out":
          this.allotDic = {
            ...this.allotDic,
            orgOld: val.checkArr.value,
            orgOldName: val.checkArr.label,
          };
          break;
        case "in":
          this.allotDic = {
            ...this.allotDic,
            orgNew: val.checkArr.value,
            orgNewName: val.checkArr.label,
          };
          break;
        case "logisticsCompany":
          this.allotDic = {
            ...this.allotDic,
            logisticsRecord: {
              ...this.allotDic.logisticsRecord,
              logisticsCompanyId: val.checkArr.value,
              logisticsCompanyName: val.checkArr.label,
            },
          };
          this.loadLogisticsInfo(val.checkArr.value);
          break;
        case "logisticsFlag":
          this.allotDic = {
            ...this.allotDic,
            needLogistics: val.checkArr.value,
            logisticsRecord: null,
          };
          this.logisticsCarriage = "0";
          this.logisticsContact = "";
          this.logisticsPhone = "";
          break;
        default:
          break;
      }
    },
    checkData() {
      let savedicnew = {
        ...this.allotDic,
        logisticsRecord: this.allotDic.logisticsRecord
          ? {
              ...this.allotDic.logisticsRecord,
              transportTime: this.allotDic.logisticsRecord.transportTime
                ? this.allotDic.logisticsRecord.transportTime + " 00:00:00"
                : null,
            }
          : null,
      };
      let savedic = {
        ...savedicnew,
        allocationRecordJson: JSON.stringify(savedicnew.machineAllocationList),
        logisticsRecordJson: JSON.stringify(savedicnew.logisticsRecord),
        logisticsCarriage: savedicnew.logisticsRecord
          ? savedicnew.logisticsRecord.logisticsCarriage
            ? savedicnew.logisticsRecord.logisticsCarriage
            : 0
          : 0,
      };
      this.allotDic = {
        ...savedic,
      };
      if (!this.allotDic.orgOld) {
        this.showToast("请选择调出区域");
        return Promise.reject("fail");
      }
      if (!this.allotDic.addressOld) {
        this.showToast("请选择调出地址");
        return Promise.reject("fail");
      }
      if (!this.allotDic.orgNewName) {
        this.showToast("请选择调入区域");
        return Promise.reject("fail");
      }
      if (!this.allotDic.addressNew) {
        this.showToast("请选择调入地址");
        return Promise.reject("fail");
      }
      if (this.allotDic.orgOld === this.allotDic.orgNew) {
        this.showToast("调出区域不能与调入区域相同");
        return Promise.reject("fail");
      }
      if (
        !this.allotDic.machineAllocationList ||
        this.allotDic.machineAllocationList.length <= 0
      ) {
        this.showToast("请选择调拨车辆");
        return Promise.reject("fail");
      }
      if (
        this.allotDic.needLogistics &&
        (!this.allotDic.logisticsRecord ||
          !this.allotDic.logisticsRecord.logisticsCompanyName)
      ) {
        this.showToast("请选择物流公司");
        return Promise.reject("fail");
      }
      if (
        this.allotDic.needLogistics &&
        (!this.allotDic.logisticsRecord || !this.allotDic.logisticsRecord.transportTime)
      ) {
        this.showToast("请选择物流时间");
        return Promise.reject("fail");
      }
      return Promise.resolve("sucess");
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    //确定按钮
    clicksave(val) {
      this.$network
        .getData(this.$url.ALLOT_CREATE + val, "POST", this.allotDic)
        .then((result) => {
          uni.$emit("refresh-db-list", {
            type: "wait",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.navigateBack({
            animationDuration: 200,
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details[0],
          });
        });
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.allotDic = {
        ...this.allotDic,
        fileList: list,
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.allotDic = {
        ...this.allotDic,
        fileList: list,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.create-allot-bg {
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
  margin: 10px;
  background: #ffffff;
  border-radius: 4px;
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
  font-size: $uni-font-size-base;
}

.choose-device-text {
  color: $uni-color-primary;
}

.item-row {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 5px;
  font-size: $uni-font-size-base;
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
  border-width: 1px 0px 1px 0px;
  border-style: solid;
  color: #ff0000;
}
.item-tag {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.item-value {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-left: 15px;
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
.boldstyle {
  margin-top: 5px;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}
</style>
