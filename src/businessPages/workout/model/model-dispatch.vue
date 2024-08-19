<template>
  <view class="model-container">
    <view class="tag" style="justify-content: space-between; padding-left: 5px">
      <text>{{ modelName }}</text>
      <scanView
        :compareTime="isSettleDate ? workoutDic.settleDate : workoutDic.preSettleDate"
        :machines="workoutDic.machines"
        :orderList="workoutDic.orders"
        :businessNo="workoutDic.businessNo"
        :contractNo="workoutDic.contractNo"
        bussinessType="workOut"
        @setScanMachines="setScanMachines"
        v-if="showDispatch"
      />
    </view>
    <list class="workin-dd-list">
      <cell
        class="workin-dd-list-cell"
        v-for="(item, index) in workoutDic.orders"
        :key="index"
        v-if="showDispatch ? getOverNum(item) > 0 && item.usedNum > 0 : item.usedNum > 0"
      >
        <view class="cell-input-view-machine">
          <view class="cell-input-view-machine-left">
            <text class="tag-view tag1">{{ item.typeName || "" }}</text>
            <text class="tag-view tag2">{{ item.heightName || "" }}</text>
            <text class="tag-view tag3">{{ item.usedNum || "0" }}台</text>
            <text class="tag-view tag4">{{ item.settlementTypeName || "" }}</text>
            <text class="tag-view tag6" v-if="item.settlementType == '1'"
              >¥ {{ item.hire || "0" }}/{{ getType(item) }}</text
            >
            <text
              class="tag-view tag6"
              v-if="item.settlementType == '2' || item.settlementType == '3'"
              >¥ {{ item.hire || "0" }}/月</text
            >
            <view
              class="tag-view tag4"
              v-if="item.settlementType === '4' || item.settlementType === '6'"
              >¥ {{ item.hire || "0" }}/天
              <view style="margin-left: 4px">{{ item.hireMonthly || "0" }}/月</view>
            </view>
          </view>
          <view class="cell-input-view-machine-right" v-if="showDispatch">
            <text class="tag-view tag5" @click="goTo('dispatch', item, index)">{{
              "调度"
            }}</text>
          </view>
        </view>
        <view
          class="cell-input-view-machine-list"
          v-for="(device, i) in getItemMachineList(item)"
          :key="i"
        >
          <view class="cell-input-view-machine-list-head">
            <view class="head-top" style="display: flex; flex-direction: row"
              >自喷码: {{ device.printCode || "-" }}
              <text class="replace-text" v-if="item.height != device.machineHeight"
                >【替】</text
              >
            </view>
            <view class="head-bottom">
              <text
                >{{ device.machineBrand || "--" }}-{{ device.machineTypeName || "--" }} |
                {{ device.licenseId || "--" }}</text
              >
            </view>
          </view>
          <view>
            <!-- 自有设备 -->
            <view v-if="device.subletState == 0" class="cell-input-view-list-btn">
              <view v-if="showCheck">
                <text
                  class="tag-view"
                  :class="
                    isCheckOK(device.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'
                  "
                  @click="goTo('check', device, index)"
                >
                  {{ isCheckOK(device.workCheckResults) ? "点检正常 >>" : "点检异常 >>" }}
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
              <text v-if="showDispatch" class="tag-view delbtn" @click="deleteCar(device)"
                >删除</text
              >
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
                  {{ isCheckOK(device.workCheckResults) ? "点检正常 >>" : "点检异常 >>" }}
                </text>
                <text v-if="showDispatch" class="pd6 delbtn" @click="deleteCar(device)"
                  >删除</text
                >
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
        </view>
        <!-- <view class="cell-bottom-list-row">
					<view class="check-container" >
						<view @click="goTo('check', item,index)"><text style="text-align: center;color: #E60000;">退场点检</text></view>
						<view @click="goTo('storeCheck', item,index)"  style="margin-left: 10px;"><text style="text-align: center;color: #E60000;">入库点检</text></view>
					</view>
					<view @click="goTo('dispatch', item,index)" style="margin-left: 10px;" v-if="showDispatch"><text style="text-align: center;color: #E60000;">调度设备({{getMachineListLength(item)}})</text></view>
					<view style="margin-left: 10px;" @click="goTo('detail', item,index)"><text>设备详情</text></view>
				</view> -->
      </cell>
    </list>
  </view>
</template>

<script>
import scanView from "@/businessPages/components/device-scan-view.vue";
export default {
  name: "modelDispatch",
  components: {
    scanView,
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false,
    },
    workoutDic: {
      type: Object,
      default() {
        return {};
      },
    },
    showCheck: {
      type: Boolean,
      default: false,
    },
    showDispatch: {
      type: Boolean,
      default: true,
    },
    showStoreCheck: {
      type: Boolean,
      default: false,
    },
    //模块名称
    modelName: {
      type: String,
      default: "设备信息111 ",
    },
    //是否去重
    isRemoveRepeat: {
      type: Boolean,
      default: false,
    },
    isSettleDate: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    workoutDic: {
      handler(val) {
        this.$emit("workoutDicd", val);
        this.$store.dispatch("user/changeWorkOutDic", val);
      },
      deep: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleRentClick(item, index, e) {
      let exitAndRent = e.detail.value ? "1" : "0";
      let machines = this.workoutDic.machines ? this.workoutDic.machines : [];
      if (machines.length > 0) {
        machines[index].exitAndRent = exitAndRent;
      }
      this.$emit("setScanMachines", machines, true);
    },
    setScanMachines(machines) {
      console.log(machines);
      this.$emit("setScanMachines", machines);
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getMachineListLength(item) {
      if (this.workoutDic.machines) {
        return this.workoutDic.machines.filter((o) => {
          return o.contractOrderId === item.id;
        }).length;
      } else {
        return 0;
      }
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getItemMachineList(item) {
      return this.workoutDic.machines
        ? this.workoutDic.machines.filter((o) => {
            return o.contractOrderId === item.id;
          })
        : [];
    },
    getOverNum(item) {
      if (item.workInNum > 0) {
        return item.workInNum - item.actualNum - item.applyNum;
      }
      return 0;
    },
    getType(item) {
      if (item.settlementType === "1") {
        return "天";
      } else if (item.settlementType === "5") {
        return "周";
      } else {
        return "月";
      }
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
    deleteCar(item) {
      this.$emit("deleteDevice", item);
    },
    goTo(type, item, pos) {
      console.log(item, "deleteDevice");
      this.$emit("goTo", {
        type: type,
        item: item,
        index: pos,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.model-container {
  // width: 100%;
  height: 100%;
}

.tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: $uni-text-color;
  padding-bottom: 10px;
  font-size: $uni-font-size-base;
  align-items: center;
  font-weight: bold;
}

.workin-dd-list {
  display: flex;
  flex-direction: column;
}

.workin-dd-list-cell {
  display: flex;
  flex-direction: column;
  padding: 0px 5px 5px 2px;
  background: #ffffff;
}

.cell-input-view-list {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 5px;
  margin-right: 5px;
  height: 30px;
  font-size: $uni-font-size-base;
}

.check-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}

//---------车辆新
.cell-input-view-machine {
  display: flex;
  padding: 5px 0px;
  border-bottom: 1px solid $uni-bg-color-grey;
  flex-direction: row;
  justify-content: flex-start;
  background: #ffffff;
}

.cell-input-view-machine-left {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
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
  margin-top: 3px;
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
  color: #ffffff;
  margin-left: 10px;
}

.replace-text {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 5px;
}

.cell-input-view-machine-list {
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.cell-input-view-machine-list-head {
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-base;
  color: #222831;
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
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-bottom: 4px;
  margin-top: 4px;
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
</style>
