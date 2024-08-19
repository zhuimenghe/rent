<template>
  <view class="content">
    <view class="item-assigner-list">
      <view
        v-for="(v, i) in list"
        :key="i"
        class="item-container"
        @click="changeCheck(i)"
      >
        <mycheckbox
          class="checkbox"
          :checked="v.checked"
          color="#E60000"
          :disabled="v.disabled"
        />
        <view class="v-item">
          <view class="item-top">
            <view class="replace-view">
              <text>自喷码：{{ v.printCode || "-" }}</text>
              <view class="replace-text" v-if="v.replace">【替】</view>
            </view>
            <text style="margin-right: 8px"
              >{{ v.stateName || "" }}-{{ v.subStateName || "" }}</text
            >
          </view>
          <view class="item-row">
            <view>车号：{{ v.licenseId || "-" }}</view>
            <text>型号：{{ v.machineBrand || "-" }}-{{ v.machineTypeName || "--" }}</text>
          </view>
          <view class="mechineC" v-if="v.contractMachineTransferInfo" @click.stop="checkTransfer(v)">换车</view>
          <view style="font-size: 10px; color: #f5222d; padding: 5px 5px 5px 0" v-if="v.showTip">
            <text>设备结算时间不得早于进场时间【{{ getDate(v.workInDate) }}】</text>
          </view>
          <view
            style="font-size: 10px; color: #f5222d; padding: 2px 5px 5px 0px"
            v-if="v.showSettleTip"
          >
            <text
              >结算时间不得早于上次结算时间【{{ getDate(v.lastSettlementDate) }}】
            </text>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-view" @click="changeAll">
      <mycheckbox class="checkbox" color="#E60000" :checked="isAllChecked"
        >全选</mycheckbox
      >
      <view class="top-right">
        <view class="choosed-view"
          >已选：{{ disCheckedList ? disCheckedList.length : 0 }}</view
        >
        <view class="confirm-view" @click="confirm">确定</view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import timeCompare from "@/common/common-method/common-method.js";
export default {
  data() {
    return {
      list: [],
      searchKey: "",
      disCheckedList: [],
      chooseAssigners: [],
      orderId: "",
      isAllChecked: false,
      settleTime: "",
      height: "",
    };
  },
  onLoad(options) {
    console.log(options, "onLoad");
    this.disCheckedList = options.choosedList
      ? JSON.parse(decodeURIComponent(options.choosedList))
      : [];
    this.orderId = options.orderId;
    this.height = options.height;
    this.settleTime = options.settleTime;
    this.getMachineList(options.businessNo, options.contractNo);
  },
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
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    changeCheck(pos) {
      this.list[pos].checked = !this.list[pos].checked;
      if (
        !this.list[pos].checked &&
        this.list[pos].showTip &&
        this.list[pos].showSettleTip
      ) {
        this.list[pos].disabled = true;
      }
      // this.list[pos].disabled=!(this.list[pos].workInDate && timeCompare.timedifferent(this.settleTime, this.getDate(this.list[pos].workInDate)) !== -1) &&
      // 	!this.disCheckedList.some(y => y.licenseId === this.list[pos].licenseId) ? true : false
      this.getCheckedList();
      this.isAllChecked = !this.list.some((o) => !o.disabled && !o.checked);
    },
    changeAll(e) {
      this.isAllChecked = !this.isAllChecked;
      if (this.isAllChecked) {
        this.list = this.list.map((o) => {
          return {
            ...o,
            checked: o.disabled ? o.checked : true,
          };
        });
        this.getCheckedList();
      } else {
        this.list = this.list.map((o) => {
          return {
            ...o,
            checked: o.disabled ? o.checked : false,
          };
        });
        this.getCheckedList();
      }
    },
    /**
     * 可选择的列表
     */
    getMachineList(businessNo, contractNo) {
      let param = {
        workOutNo: businessNo,
        contractNo: contractNo,
      };
      this.$network
        .getData(this.$url.WORKED_MACHINE_LIST_BY_CONTRACT, "GET", param)
        .then((result) => {
          // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
          let arr = result
            ? result.filter((o) => o.contractOrderId === this.orderId)
            : [];

          arr.forEach((o) => {
            if (!this.list.some((y) => y.licenseId === o.licenseId)) {
              this.list = [...this.list, o];
            }
          });
          this.list = this.list.map((o) => {
            return {
              ...o,
              replace: this.height !== o.machineHeight,
              checked: this.disCheckedList.some((y) => y.licenseId === o.licenseId),
              showTip:
                o.workInDate &&
                timeCompare.timedifferent(this.settleTime, this.getDate(o.workInDate)) !==
                  -1
                  ? false
                  : true,
              disabled:
                (!(
                  o.workInDate &&
                  timeCompare.timedifferent(
                    this.settleTime,
                    this.getDate(o.workInDate)
                  ) !== -1
                ) ||
                  !(
                    !o.lastSettlementDate ||
                    (o.lastSettlementDate &&
                      timeCompare.timedifferent(
                        this.settleTime,
                        this.getDate(o.lastSettlementDate)
                      ) !== -1)
                  )) &&
                !this.disCheckedList.some((y) => y.licenseId === o.licenseId)
                  ? true
                  : false,
              showSettleTip:
                !o.lastSettlementDate ||
                (o.lastSettlementDate &&
                  timeCompare.timedifferent(
                    this.settleTime,
                    this.getDate(o.lastSettlementDate)
                  ) !== -1)
                  ? false
                  : true,
            };
          });
          this.isAllChecked = !this.list.some((o) => !o.disabled && !o.checked);
        })
        .catch((err) => {});
    },
    getCheckedList() {
      this.disCheckedList = [
        ...this.list.filter((o) => {
          return o.checked;
        }),
      ];
    },
    confirm() {
      let self = this;
      let arr = this.disCheckedList.slice();
      arr = arr.map((item, index) => {
        return {
          ...item,
          orderId: self.orderId,
        };
      });
      uni.$emit("choosedMachines", {
        data: arr,
      });
      uni.navigateBack({
        delta: 1, //此处直接使用变量无效果
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
  position: relative;
}

.item-assigner-list {
  margin-bottom: 56px;
}

.item-container {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: 8px;
  border-radius: 4px;
}

.v-item {
  flex: 1;
}

.checkbox {
  transform: scale(0.7);
  margin-right: 10px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
}

.item-row {
  display: flex;
  flex-direction: row;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
}

.item-row text {
  flex: 1;
}

.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.replace-view {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.replace-text {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 5px;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 48px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
  box-shadow: 1px 0px 1px $uni-text-color-gray;
}

.choosed-view {
  margin-left: 16px;
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.choosed-view span {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  margin-left: 4px;
}

.confirm-view {
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  padding: 5px 10px;
  border-radius: 4px;
}
.mechineC{
  width: 40px;
  height: 20px;
  margin-top: -10px;
  margin-bottom: 5px;
  line-height: 20px;
  text-align: center;
  color: #F08200;
  font-size: 12px;
  border: solid #F08200 1px;
  background-color: rgba(240, 130, 0, 0.20);
  border-radius: 2px;
}
</style>
