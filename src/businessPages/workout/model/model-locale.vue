<template>
  <view>
    <view class="model-tag">
      <p class="title"><span class="line"></span>{{ modelName }}</p>
      <!-- <view v-if="isEdit" style="color: #E60000; font-weight: 400 !important;" @click="correlationDelivery">关联接机单
			</view> -->
    </view>
    <view>
      <selectorPick
        title="结算日期"
        :isRequire="true"
        placeholder="请选择结算日期"
        :content="getYMDHMTime(workoutDic.settleDate)"
        @clickItem="showPick('settleDate')"
        :isEdit="isEdit"
        :rightIcon="dateIcon"
      />
      <selectorPick
        title="退场时间"
        :isRequire="true"
        placeholder="请选择退场时间"
        :content="timeFormatYMDHM(workoutDic.endDate)"
        @clickItem="showPick('endDate')"
        :isEdit="isEdit"
        :rightIcon="dateIcon"
      />
    </view>
    <view>
      <list class="workin-dd-list">
        <!-- {{ isEdit }}
        {{ getOverNum(item) > 0 }}
        {{ item.usedNum > 0 }} -->
        <!-- getOverNum(item) > 0 && -->
        <cell
          class="workin-dd-list-cell"
          v-for="(item, index) in workoutDic.orders"
          :key="index"
          v-if="isEdit ? item.usedNum > 0 : item.usedNum > 0"
        >
          <view class="cell-input-view-machine">
            <view class="cell-input-view-machine-left">
              <text>{{ item.typeName || "" }}/{{ item.heightName || "" }}</text>
              <!-- v-if="!isDetail||!isApproval" -->
              <text v-if="showDemand"
                >已选/需求({{ item.selectedNum || "0" }}/{{ item.usedNum || "0" }})</text
              >
              <!-- <text class="tag-view tag3">{{ item.usedNum || "0" }}台</text> -->
              <!-- <text class="tag-view tag4">{{
              item.settlementTypeName || ""
            }}</text> -->
            </view>
            <view class="cell-input-view-machine-right" v-if="!isDetail">
              <text class="tag-view tag5" @click="goTo('dispatch', item, index)">
                {{ "选择设备" }}
              </text>
            </view>
          </view>
          <view
            class="cell-input-view-machine-list"
            v-for="(device, i) in getItemMachineList(item)"
            :key="i"
          >
            <view class="cell-input-view-machine-list-head">
              <view class="head-top" style="display: flex; flex-direction: row;align-items: center;">
                {{ device.printCode || "" }}({{ device.licenseId || "--" }})
                <text class="replace-text" v-if="item.height != device.machineHeight">
                  替
                </text>
                <span class="mechineC" v-if="device.contractMachineTransferInfo" @click.stop="checkTransfer(device)">换车</span>
              </view>
              <view>
                <i
                  v-if="!isDetail"
                  class="iconfont delete-icon iconzl--shanchu"
                  style="color: #f08200"
                  @click="deleteCar(device, i)"
                ></i>
              </view>
            </view>
            <view class="head-bottom">
              <text style="font-size: 24rpx"
                >{{ device.machineBrand || "" }} | {{ device.machineTypeName || "--" }}
              </text>
              <!-- 自有设备 -->
              <view v-if="device.subletState == 0" class="cell-input-view-list-btn">
                <view>
                  <text
                    class="tag-view"
                    :class="
                      isCheckOK(device.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'
                    "
                    @click="goTo('check', device, index)"
                  >
                    {{
                      isCheckOK(device.workCheckResults) ? "点检正常 >>" : "点检异常 >>"
                    }}
                  </text>
                  <text
                    v-if="showStoreCheck"
                    class="tag-view"
                    :class="
                      isCheckOK(device.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'
                    "
                    @click="goTo('storeCheck', device, index)"
                  >
                    {{
                      isCheckOK(device.workCheckResults)
                        ? "入库点检正常 >>"
                        : "入库点检异常 >>"
                    }}
                  </text>
                </view>
              </view>
              <!-- 转租设备 -->
              <view
                v-else
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                "
              >
                <!-- 新增 -->
                <view v-if="!isDetail">
                  是否还租:
                  <switch
                    size="mini"
                    color="#E60000"
                    style="transform: scale(0.5)"
                    :checked="!!device.exitAndRent"
                    @change="handleRentClick(device, i, $event)"
                  />
                </view>
                <!-- 详情 -->
                <view v-else>
                  <text class="tag-view"
                    >是否还租:<text v-if="device.exitAndRent == 1">已还租</text
                    ><text v-else>未还租</text></text
                  >
                </view>
                <view>
                  <text
                    class="pd6"
                    :class="
                      isCheckOK(device.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'
                    "
                    @click="goTo('check', device, index)"
                  >
                    {{
                      isCheckOK(device.workCheckResults) ? "点检正常 >>" : "点检异常 >>"
                    }}
                  </text>
                </view>
                <text
                  v-if="showStoreCheck"
                  class="tag-view"
                  :class="
                    isCheckOK(device.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'
                  "
                  @click="goTo('storeCheck', device, index)"
                >
                  {{
                    isCheckOK(device.workCheckResults)
                      ? "入库点检正常 >>"
                      : "入库点检异常 >>"
                  }}
                </text>
              </view>
            </view>
            <view class="file" v-if="workoutDic.isShowMachineFineColumns">
              <span>
                <text v-if="ifFileRequire" style="color: #e60000; margin-right: 2px"
                  >*</text
                >退场附件上传</span
              >
              <view
                class="filenum"
                style="display: flex; align-items: center"
                @click="chooseFile(device, i)"
                >附件（{{
                  !isDetail
                    ? getCheckedNum(device, i, index) + "/" + device.fileList.length
                    : getCheckedNum(device, i, index) || 0
                }}）<i
                  class="iconfont right-icon iconarrow-right"
                  :style="{ color: '#8c8c8c', 'font-size': '18px', 'margin-top': '2px' }"
                ></i>
              </view>
            </view>
            <view class="file" v-if="device.deliveryPicCount">
              <view></view>
              <view
                class="filenum"
                style="display: flex; align-items: center"
                @click="chooseDeliveryFile(device)"
              >
                物流附件（
                {{ device.deliveryPicCount }}
                ）
                <i
                  class="iconfont right-icon iconarrow-right"
                  :style="{
                    color: '#8c8c8c',
                    'font-size': '18px',
                    'margin-top': '2px',
                  }"
                ></i>
              </view>
            </view>
            <view> </view>
          </view>
        </cell>
      </list>
    </view>
    <imgupload
      @uploadfinish="uploadfinish"
      @deleteUrl="deleteUrl"
      type="workout_type"
      uploadType="attachment"
      :maximg="20"
      :isupload="isEdit"
      :imgFinishlist="workoutDic.fileList"
    />
    <selectortextArea
      title="备注"
      placeholder="请输入备注..."
      :content="workoutDic.comment"
      :isRequire="false"
      @textChage="textChange($event, 'comment')"
      :isEdit="isEdit"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import modelDispatch from "./model-dispatch";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";

export default {
  name: "modelLocale",
  components: {
    selectorPick,
    selectorInput,
    modelDispatch,
    imgupload,
    selectortextArea,
  },
  props: {
    isControl: {
      type: Boolean,
      default: false,
    },
    isApproval: {
      type: Boolean,
      default: false,
    },
    showStoreCheck: {
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    //传入的数据
    workoutDic: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    //模块名称
    // modelName: {
    // 	type: String,
    // 	default: "退场设备（需求6台）"
    // },
    //是否去重
    isRemoveRepeat: {
      type: Boolean,
      default: false,
    },
    isLiangXu: {
      type: Boolean,
      default: false,
    },
    //是否启用半天租
    isHalf: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ifFileRequire() {
      this.workoutDic.machines = this.workoutDic.machines || [];
      if (this.workoutDic.machines.length) {
        for (let i = 0; i < this.workoutDic.machines.length; i++) {
          if (
            this.workoutDic.machines[i].fileList &&
            this.workoutDic.machines[i].fileList.length
          ) {
            let fileOptionList = this.workoutDic.machines[i].fileList.slice() || [];
            if (fileOptionList.length) {
              return fileOptionList.some((item) => item.required);
            }
          }
        }
      }
    },
    modelName() {
      let num = 0;
      let orders = this.workoutDic.orders || [];
      orders.map((item, index) => {
        let o = {
          ...item,
          usedNum: item.usedNum ? item.usedNum : 0,
        };
        num += Number(item.usedNum);
        return o;
      });
      return `退场设备（需求${num}台）`;
    },
    showDemand() {
      if (this.isDetail || this.isApproval) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {},
  data() {
    return {
      dateIcon: "iconzl--rili",
    };
  },
  created() {},
  methods: {
    // 点击查看换车信息
    checkTransfer(machine){
      this.$refs.customToast.showModal({
        title:"换车管理",
        content:`换车后车辆：${machine.contractMachineTransferInfo.licenseIdNew}\n换车日期：${machine.contractMachineTransferInfo.transferDate.split(' ')[0]}`,
        confirmButtonName: undefined,
        cancelButtonName: "知道了",
        confirmButtonStyle: undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm) {
          }  
        },
      });
    },
    textChange(e, type) {
      switch (type) {
        case "comment":
          this.$emit("setComment", e);
          break;
        default:
          break;
      }
    },
    getCheckedNum(machine) {
      console.log(machine, "getCheckedNum");
      return (
        (machine.fileList && machine.fileList.filter((item) => item.url).length) || "0"
      );
    },
    chooseFile(machine, index) {
      let fileOptionList = machine.fileList || [];
      for (let i = 0; i < fileOptionList.length; i++) {
        let obj = {
          ...fileOptionList[i],
          fileDesc: fileOptionList[i].fileName
            ? fileOptionList[i].fileName + "|" + fileOptionList[i].required
            : fileOptionList[i].fileDesc,
          type: "workout_machine_type",
          fileIdentify: machine.licenseId,
        };
        fileOptionList.splice(i, 1, obj);
      }
      machine = {
        ...machine,
        fileList: fileOptionList,
      };
      console.log(machine, "chooseFile-------");
      uni.navigateTo({
        url:
          "/businessPages/workin/choose-file-list?machine=" +
          encodeURIComponent(JSON.stringify(machine)) +
          "&index=" +
          index +
          "&isControl=" +
          this.isControl +
          "&isDetail=" +
          this.isDetail,
      });
    },
    chooseDeliveryFile(machine) {
      this.$network
        .getData(
          `${this.$url.WORK_OUT_DELIVERYPIC}?bussinessNo=${this.workoutDic.businessNo}&licenseId=${machine.licenseId}`,
          "GET"
        )
        .then((result) => {
          // 导航到文件选择列表页面，传递更新后的机器信息
          uni.navigateTo({
            url: `/businessPages/workin/delivery-file-list?imglist=${encodeURIComponent(
              JSON.stringify(result)
            )}&printCode=${machine.printCode}&licenseId=${machine.licenseId}`,
          });
        })
        .catch((err) => {
          console.log("读取物流附件失败");
        });
    },
    handleRentClick(item, index, e) {
      let exitAndRent = e.detail.value ? "1" : "0";
      let machines = this.workoutDic.machines ? this.workoutDic.machines : [];
      if (machines.length > 0) {
        machines[index].exitAndRent = exitAndRent;
      }
      this.$emit("setScanMachines", machines, true);
    },
    isCheckOK(checkList) {
      if (!checkList) {
        return false;
      }
      let list = checkList.filter((o) => {
        return o.checked === false;
      });
      if (list.length > 0) {
        return false;
      }
      return true;
    },
    deleteCar(item, index) {
      this.$emit("deleteDevice", item, index);
    },
    getOverNum(item) {
      if (item.workInNum > 0) {
        return item.workInNum - item.actualNum - item.applyNum;
      }
      return 0;
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getItemMachineList(item) {
      // 先筛选出与特定项目 item 相关联的机器列表
      const filteredMachines = this.workoutDic.machines
        ? this.workoutDic.machines.filter((o) => o.contractOrderId === item.id)
        : [];

      // 根据找到的 machineList 长度设置 item 的 selectedNum 值
      item.selectedNum = filteredMachines.length;
      // 返回筛选后的机器列表
      return filteredMachines;
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    getYMDHMTime(date) {
      let d = this.isEdit ? "" : "--";
      if (date) {
        d = this.isHalf ? this.$dateUtil.timeFormatYMDHM(date) : this.getDate(date);
      }
      return d;
    },
    timeFormatYMDHM(date) {
      let d = "";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    showPick(type) {
      let selectType = "date";
      switch (type) {
        case "settleDate":
          selectType = "date";
          break;
        case "inStoreDate":
          selectType = "date";
          break;
        case "endDate":
          selectType = "halfDate";
          break;
        case "outType":
          selectType = "selector";
          break;
        default:
          break;
      }
      this.$emit("showPick", {
        pickType: type,
        selectType: selectType,
      });
    },

    goTo(type, item, pos) {
      console.log(item, "deleteDevice");
      this.$emit("goTo", {
        type: type,
        item: item,
        index: pos,
      });
    },

    setScanMachines(machines, val) {
      this.$emit("setScanMachines", machines, val);
    },
    deleteDevice(val) {
      console.log("3333333");
      this.$emit("deleteDevice", val);
    },
    //上传图片回调
    uploadfinish(val) {
      this.$emit("updateFile", val.data);
    },
    //删除回调
    deleteUrl(val) {
      this.$emit("updateFile", val.data);
    },
    correlationDelivery() {
      this.$emit("goTo", {
        type: "correlationDelivery",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../css/workout-style";

.machine-cell::after {
  position: absolute;
  z-index: 3;
  right: -8px;
  bottom: 0;
  left: 1px;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.row-item {
  display: flex;
  width: 270px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
  background: $uni-color-primary;
  color: #ffffff;
  font-size: $uni-font-size-base;
  border-radius: 5px;
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
  justify-content: center;
  align-items: center;
}

.row-tag {
  width: 98px;
  text-align: center;
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

.model-tag {
  padding: 0 !important;
}

.cell-input-view-machine {
  display: flex;
  padding: 5px 0px;
  //padding-top: 5px;
  border-bottom: 1px solid $uni-bg-color-grey;
  flex-direction: row;
  justify-content: flex-start;
  background: #ffffff;
}

.cell-input-view-machine-left {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 550;
  padding: 5px 10px 8px 10px;
  color: #222222;
  // border-bottom: 1px solid $uni-bg-color-grey;
}

.cell-input-view-machine-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.pd6 {
  padding: 3px 10rpx;
}

.tag-view {
  display: flex;
  flex-direction: row;
  padding: 3px 6px;
  line-height: 16px;
  border-radius: 2px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}

.tag1 {
  background: #eef9e8;
  color: #57c32d;
}

.tag2 {
  background: #f9f0ff;
  color: #722ed1;
}

.tag3 {
  background: #fff0e9;
  color: #fb7135;
}

.tag4 {
  background: #fff1f0;
  color: #e60000;
}

.tag6 {
  background: #fff8ee;
  color: #fca01f;
}

.tag5 {
  background: $uni-color-primary;
  color: #fff;
  height: 56rpx;
  background: #e60000;
  border-radius: 6rpx;
  display: flex;
  padding: 0px 10px;
}

.replace-text {
  color: #fff;
  font-size: 24rpx;
  margin-left: 5px;
  font-weight: 400;
  font-family: PingFangSC-Regular, PingFang SC;
  width: 36rpx;
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f08200;
  border-radius: 50%;
}

.cell-input-view-machine-list {
  display: flex;
  flex-direction: column;
  // align-items: center;
  // border-bottom: 1px solid $uni-bg-color-grey;
  background-color: #fff;
  padding: 0 10px;
  padding-top: 5px;
}

.cell-input-view-machine-list-head {
  display: flex;
  // flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  padding-bottom: 2px;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
}

.head-top {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.head-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  padding-bottom: 5px;
}

.text-color {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
}

.line-s {
  margin-top: 5px;
  height: 1px;
  background: #dcdcdc;
}

.cell-input-view-list-btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-bottom: 5px;
}

.delbtn {
  margin-left: 20px;
  background: #ffffff;
  color: #fec7ce;
  border-color: #fec7ce;
  border-width: 1px;
  border-style: solid;
}

.checkbtnOK {
  background: #ffffff;
  color: #4ec365;
  border-color: #4ec365;
  border-width: 1px;
  border-style: solid;
}

.checkbtnError {
  background: #ffffff;
  color: #ff0000;
  border-color: #ff0000;
  border-width: 1px;
  border-style: solid;
}

::v-deep .img-upload-view {
  background-color: #fff !important;
}

.filenum {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #e60000;
}

.file {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  display: flex;
  // margin-bottom: 10rpx;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1px solid $uni-bg-color-grey;
}
.mechineC{
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #F08200;
  font-size: 12px;
  border: solid #F08200 1px;
  background-color: rgba(240, 130, 0, 0.20);
  margin-left: 6px;
  border-radius: 2px;
}
</style>
