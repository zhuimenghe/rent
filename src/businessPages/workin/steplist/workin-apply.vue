<template>
  <view>
    <p class="title"><span class="line"></span>进场信息</p>
    <view class="sum-view-bg" style="margin: 0px">
      <selectorPick
        title="进场单号"
        :isEdit="false"
        :content="dataDic.businessNo"
        :isRequire="true"
      />
      <selectorPick
        title="物流类型"
        placeholder="请选择物流方式"
        :content="dataDic.logisticsTypeName"
        @clickItem="chooseType('usetrans')"
        :isEdit="isedit"
      />
      <view style="display: flex; flex-direction: column" v-if="dataDic.contractNo">
        <selectorInputIcon
          title="起始地点"
          placeholder="请输入起始地点"
          :content="dataDic.startPlace"
          :isEdit="isedit"
          :isRequire="true"
          @iconClick="chooseToAddres('startPlace')"
          @textChage="textChange($event, 'startPlace')"
        />
        <selectorInputIcon
          title="交机地点"
          placeholder="请输入交机地点"
          :content="dataDic.deliveryPlace"
          :isRequire="true"
          :isEdit="isedit"
          @iconClick="chooseToAddres('deliveryPlace')"
          @textChage="textChange($event, 'deliveryPlace')"
        />
        <selectorInput
          title="里程(km)"
          :isRequire="false"
          placeholder="请输入里程"
          :content="dataDic.mileage"
          @textChage="textChange($event, 'mileage')"
          textType="digit"
          :isEdit="isedit"
        />
        <selectorPick
          v-if="isRoleBasedScenario || (iswf && isShow)"
          title="计划启用日期"
          placeholder="请选择计划启用日期"
          :content="getYMDHMTime(dataDic.preEnableDate)"
          @clickItem="chooseType('preEnableDate')"
          :isEdit="isedit"
        />
        <selectorPick
          v-if="isRoleBasedScenario || (iswf && isShow)"
          title="计划交机时间"
          placeholder="请选择计划交机时间"
          :content="getHalfTime(dataDic.preBeginDate)"
          @clickItem="chooseType('preBeginDate')"
          :isEdit="isedit"
        />
        <view
          style="
            display: flex;
            align-items: center;
            margin-top: 10rpx;
            padding-bottom: 5px;
            border-bottom: #f0f2f4 1px solid;
          "
        >
          <text class="dot"></text>
          <view class="device-title"> 进场设备需求 </view>
          <view class="addbtn" @click="goToAddOrder" v-if="isedit">新增</view>
        </view>
        <view class="choose-device" v-if="dataDic.orders.length">
          <view class="choose-device-title">
            <text>型号/高度</text>
            <text>进场数量</text>
          </view>
          <view v-for="(item, index) in dataDic.orders" :key="index">
            <view class="choose-device-device">
              <view class="choose-device-device-item">
                <text
                  >{{ item.typeName || ""
                  }}{{ item.heightName ? "/" + item.heightName : "" }}</text
                >
                <view style="display: flex; align-items: center">
                  <text
                    class="circle leftcircle"
                    :class="[
                      item.usedNum == 1 || path == 'workin-detail' ? 'disabled' : '',
                    ]"
                    @click="numClick('-', item)"
                    >-</text
                  >
                  <!-- <input type="number" v-model="item.usedNum" /> -->
                  <text class="number">{{ item.usedNum || 0 }}</text>
                  <text
                    class="circle rightcircle"
                    :class="[path == 'workin-detail' ? 'disabled' : '']"
                    @click="numClick('+', item)"
                    >+</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import contactItem from "@/components/common/common-ui/contact-item.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  components: {
    labelArrow,
    contactItem,
    selectorPick,
    selectorInput,
    selectorInputIcon,
    wPicker,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      contractName: "",
      choosetypeArr: [],
    };
  },
  props: {
    nodeList: {
      type: Array,
      default() {
        return [];
      },
    },
    taskState: {
      type: String,
      default: "",
    },
    iswf: {
      type: Boolean,
      default: false,
    },
    components: {
      type: Array,
      default() {
        return [];
      },
    },
    path: {
      type: String,
      default: "",
    },
    itemDict: {
      type: Object,
      default() {
        return {};
      },
    },
    chooseModelList: {
      type: Array,
      default() {
        return [];
      },
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isedit: {
      type: Boolean,
      default: true,
    },
    isshowLogistics: {
      type: Boolean,
      default: true,
    },
    showRepeat: {
      type: Boolean,
      default: true,
    },
    isLiangXu: {
      type: Boolean,
      default: false,
    },
    isShowNum: {
      type: Boolean,
      default: false,
    },
    isHalf: {
      type: Boolean,
      default: true,
    },
    previewBtn: {
      type: Boolean,
      default: false,
    },
    isRoleBasedScenario: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isShow() {
      return this.components.length < 4;
    },
  },

  watch: {
    // dataDic(val) {
    // 	console.log(JSON.stringify(val))
    // 	// this.contractName = this.getcontractName(val);
    // },

    "dataDic.contactName"(val) {
      let dict = {
        ...this.dataDic,
        contactName: val,
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
    // showRepeat(val) {
    // 	this.showRepeat = val
    // }
  },
  methods: {
    getHalfTime(date) {
      let d = this.isEdit ? "" : "--";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    numClick(operate, obj) {
      this.$emit("numClick", operate, obj);
    },
    onConfirm(val) {
      this.searchDate = val.result;
    },
    callPhone(phone) {
      if (!this.isedit && phone) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: phone,
          // 成功回调
          success: (res) => {
            console.log("调用成功!");
          },

          // 失败回调
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    getHalfTime(date) {
      let d = "";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    getYMDHMTime(date) {
      let d = "";
      if (date) {
        d = this.isHalf ? this.$dateUtil.timeFormatYMDHM(date) : this.changestr(date);
      }
      return d;
    },
    //合同名处理
    getcontractName(val) {
      let customerName = val.customerName || "";
      let projectName = val.projectName || "";
      if (!customerName && !projectName) {
        return "";
      }
      let name = customerName + "-" + projectName;
      return name;
    },
    //获取联系人信息
    getContactVal(val) {
      this.$emit("setContactVal", val);
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //选择合同
    gotoContract() {
      if (this.isedit === false) {
        uni.navigateTo({
          url:
            "/contractPages/contract/contract-detail?businessNo=" +
            this.dataDic.contractNo,
        });
        return;
      }
      let url = "/businessPages/invoice/contract-choose?type=workIn&state=5,6,7,8";
      uni.navigateTo({
        url: url,
      });
    },
    //地点
    chooseToAddres(prop) {
      if (this.isedit === false) {
        return;
      }
      let placeDic = {
        address:
          prop == "deliveryPlace"
            ? this.dataDic.deliveryPlace
            : this.dataDic.startPlace || "",
        latitude: this.dataDic.latitude || "",
        longitude: this.dataDic.longitude || "",
        currentRadius: "0",
      };
      uni.navigateTo({
        url:
          "/otherPages/map/nvr-map?deliveryAddress=" +
          JSON.stringify(placeDic) +
          "&type=" +
          prop,
      });
    },
    textChange(val, type) {
      if (type == "startPlace") {
        let dict = {
          ...this.dataDic,
          startPlace: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      } else if (type == "deliveryPlace") {
        let dict = {
          ...this.dataDic,
          deliveryPlace: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      } else if (type == "mileage") {
        val = val.replace(/[^0-9.]/g, "");
        // 保留第一个小数点，移除后续的小数点
        const firstDotIndex = val.indexOf(".");
        if (firstDotIndex !== -1) {
          val =
            val.substring(0, firstDotIndex + 1) +
            val.substring(firstDotIndex + 1).replace(/\./g, "");
        }
        // 确保小数点后至少有一个数字，并且小数点不能在第一个字符位置
        if (val.startsWith(".")) {
          val = "";
        }
        this.dataDic.mileage = val;
        let dict = {
          ...this.dataDic,
          mileage: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      }
    },
    chooseType(type) {
      if (this.isedit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
      });
    },
    //选车
    goToAddOrder() {
      if (this.isedit === false) {
        return;
      }
      let choosetypeArr = this.dataDic.orders || [];
      uni.navigateTo({
        url:
          "./workIn-equipment-model-choose?dataDic=" +
          encodeURIComponent(JSON.stringify(this.dataDic)) +
          "&checkedList=" +
          encodeURIComponent(JSON.stringify(choosetypeArr)) +
          "&contractDetailId=" +
          this.dataDic.contractDetailId +
          "&contractNo=" +
          this.dataDic.contractNo,
      });
    },
    //选车后约定进场时间
    showTimePick(type, index) {
      if (this.isedit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
        index: index,
      });
    },
    //设备配置数量
    getNumValue(val, index, item) {
      if (this.isedit === false) {
        return;
      }
      if (!item.usedNum) {
        item.usedNum = 0;
      }
      let choosetypeArr = this.dataDic.orders || [];
      choosetypeArr[index] = {
        ...choosetypeArr[index],
        usedNum: val,
      };
      let dict = {
        ...this.dataDic,
        orders: choosetypeArr,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    deleteItem(i) {
      if (this.isedit === false) {
        return;
      }
      let choosetypeArr = this.dataDic.orders || [];
      choosetypeArr.splice(i, 1);
      let dict = {
        ...this.dataDic,
        orders: choosetypeArr,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    preview() {
      // 保存草稿
      let url = this.$url.DOWNLOAD_WORD_WORKIN + "?businessNo=" + this.dataDic.businessNo;
      let headerDic = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      this.$network
        .getData(url, "GET", null)
        .then((result) => {})
        .catch((err) => {
          if (err.code) {
            uni.showToast({
              title: err.message + ":" + err.details[0],
              icon: "none",
            });
          } else {
            setTimeout(() => {
              this.downxlsc(url, headerDic);
            }, 100);
          }
        });
    },
    downxlsc(url, headerDic) {
      let customerName = this.dataDic.customerName ? this.dataDic.customerName : "";
      let projectName = this.dataDic.projectName ? this.dataDic.projectName : "";
      console.log(url);
      console.log(projectName);
      console.log(customerName);

      let name = "进场-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downFuncNoHead(url, "GET", undefined, filename);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
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
  font-size: $uni-font-size-base;
  border-bottom: $uni-line-color 1px solid;
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

.cell-section-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
  margin: 2px 4px;
  padding: 10px;
}

.cell-between {
  display: flex;
  margin: 0px 4px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.cell-section-view-width {
  display: flex;
  flex-direction: row;
  flex: 1;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-view {
  font-size: $uni-font-size-base;
  font-weight: bold;
  color: $uni-text-color;
}

.cell-input-view-list {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.cell-input-view-list-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 4px;
}

.cell-input-view-left-small {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 20px;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
}

.add-btn {
  background-color: $uni-color-primary;
  padding: 2px 6px;
  border-radius: 4px;
  color: #ffffff;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}

.workin-dd-list {
  display: flex;
  flex-direction: column;
}

.dot {
  margin-left: 24rpx;
  margin-right: 15rpx;
  width: 9rpx;
  height: 28rpx;
  background: #e60000;
}

.device-title {
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
  flex: 1;
  box-sizing: border-box;
}

.addbtn {
  width: 96rpx;
  height: 56rpx;
  background: #e60000;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-right: 32rpx;
}

.choose-device {
  padding: 10rpx 30rpx;
}

.choose-device-title {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.choose-device-device {
  font-size: 26rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
  background-color: #f6f6f6;
  padding: 10rpx;
  margin-top: 10rpx;
}

.choose-device-device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
}

.circle {
  display: inline-block;
  width: 48rpx;
  height: 48rpx;
  background: #ffffff;
  border: 1rpx solid #e60000;
  border-radius: 50%;
  line-height: 48rpx;
  text-align: center;
  font-size: 30rpx;
  color: #e60000;
}

.leftcircle {
  margin-right: 26rpx;
}

.rightcircle {
  margin-left: 26rpx;
}

.number {
  font-size: 26rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
}

.disabled {
  border: 1rpx solid #8c8c8c;
  color: #8c8c8c;
}
</style>
