<template>
  <view class="model-container">
    <view class="tag"><text>设备信息</text></view>
    <list class="workin-dd-list">
      <cell
        class="workin-dd-list-cell"
        v-for="(item, index) in listData"
        :key="index"
        v-if="getOverNum(item) > 0 && item.usedNum > 0"
      >
        <view class="cell-input-view-list">
          <view class="cell-input-view-list-row" style="flex: 2">
            <view class="cell-input-view-left">类型：</view>
            <view class="cell-input-view-right">
              {{ item.typeName || "" }}
            </view>
          </view>
          <view class="cell-input-view-list-row">
            <view class="cell-input-view-left-cell">高度：</view>
            <view class="cell-input-view-right-cell">
              {{ item.heightName || "" }}
            </view>
          </view>
        </view>
        <view class="cell-input-view-list">
          <view class="cell-input-view-list-row" style="flex: 2">
            <view class="cell-input-view-left">租赁方式：</view>
            <view class="cell-input-view-right">
              {{ item.settlementTypeName || "--" }}
            </view>
          </view>
          <view class="cell-input-view-list-row">
            <view class="cell-input-view-left">数量：</view>
            <view class="cell-input-view-right"> {{ item.usedNum || "0" }}台 </view>
          </view>
        </view>
        <view class="cell-bottom-list-row">
          <view class="check-container" v-if="showCheck">
            <view @click="goTo('check', item, index)"
              ><text style="text-align: center; color: #e60000">退场点检</text></view
            >
            <view
              @click="goTo('storeCheck', item, index)"
              v-if="showStoreCheck"
              style="margin-left: 10px"
              ><text style="text-align: center; color: #e60000">入库点检</text></view
            >
          </view>
          <view
            @click="goTo('dispatch', item, index)"
            style="margin-left: 10px"
            v-if="showDispatch"
            ><text style="text-align: center; color: #e60000"
              >调度设备({{ getMachineListLength(item) }})</text
            ></view
          >
          <view style="margin-left: 10px" @click="goTo('detail', item, index)"
            ><text>设备详情</text></view
          >
        </view>
      </cell>
    </list>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
export default {
  name: "modelDevice",
  props: {
    listData: {
      type: Array,
      default() {
        return [];
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
    machines: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    getMachineListLength(item) {
      if (this.machines) {
        return this.machines.filter((o) => {
          return o.contractOrderId === item.id;
        }).length;
      } else {
        return 0;
      }
    },
    getOverNum(item) {
      if (item.workInNum > 0) {
        return item.workInNum - item.actualNum - item.applyNum;
      }
      return 0;
    },
    goTo(type, item, pos) {
      switch (type) {
        case "check":
          this.$emit("goToCheck", {
            item: item,
            pos: pos,
          });
          break;
        case "storeCheck":
          this.$emit("goToStoreCheck", {
            item: item,
            pos: pos,
          });
          break;

        case "dispatch":
          this.$emit("doDispatch", {
            item: item,
            pos: pos,
          });
          break;
        case "detail":
          this.$emit("goToDetail", {
            item: item,
            pos: pos,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.model-container {
  width: 100%;
  height: 100%;
}

.tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  padding-left: 15px;
  padding-bottom: 10px;
  font-size: $uni-font-size-base;
  align-items: center;
}

.workin-dd-list {
  display: flex;
  flex-direction: column;
}

.workin-dd-list-cell {
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-color: #eeeeee;
  border-width: 1px;
  border-style: solid;
  border-radius: 10px;
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

.cell-input-view-list-row {
  display: flex;
  flex-direction: row;
  align-self: center;
  flex: 1;
  line-height: 24px;
  height: 24px;
}

.cell-bottom-list-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  padding-right: 5px;
  margin-bottom: 10px;
}

.check-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}
</style>
