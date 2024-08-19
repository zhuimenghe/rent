<template>
  <view class="sublet-order-item">
    <view class="header">
      <view class="order-number">
        <view class="label">转租单号</view>
        <view class="number" @click="goto(subletItem)">{{ subletItem.businessNo }} ></view>
      </view>
      <view class="order-info">
        <view class="label">
          <text>运费:</text>
          <text>￥{{ moneyUtil.dealNumber(subletItem.freight) || 0 }}</text>
        </view>
        <view class="label">
          <text>转租单履约合计:</text>
          <text>￥{{ moneyUtil.dealNumber(subletItem.receivable) || 0 }}</text>
        </view>
      </view>
      <view class="machine-info">
        <view class="label">
          <text>转租设备数量：</text>
          <text class="label-red">{{ subletItem.machinePayableList.length || 0 }}</text>
        </view>
        <view class="label">
          <view class="collapse-info" @click="collapseInfo">{{ showDetailLabel }}
            <i class="iconfont title-icon iconarrow-right rotate-arrow" />
          </view>
        </view>
      </view>
    </view>
    <machine-list v-if="showDetail" class="machine-list" :machines="subletItem.machinePayableList" :show-details="showDetail" @openRentDialog="openRentDialog"></machine-list>
  </view>
</template>
<script>
import MachineList from "./machine-list";
export default {
  name: "sublet-item",
  components: {
    MachineList,
  },
  data() {
    return {
      showDetail: true,
      showDetailLabel: "收起设备",
    };
  },
  props: {
    subletItem: Object,
    showMachineDetails: Boolean,
  },
  methods: {
    openRentDialog(item) {
      item = {
        ...item,
        businessNo: this.subletItem.businessNo,
      };
      this.$emit("openRentDialog", item);
    },
    collapseInfo() {
      // 向父组件派发事件，传递 data.showDetail
      this.showDetail = !this.showDetail;
      this.showDetailLabel = !this.showDetail ? "展开设备" : "收起设备";
      // this.$emit("collapseToggle");
    },
    getFlattenedData(record) {
      // 从record中提取需要合并的其他属性
      const { orderList, ...recordRest } = record;
      let flattenedData = [];
      for (let order of record.orderList) {
        // 使用解构赋值和剩余参数来排除machineList属性
        const { machineList, ...orderRest } = order;
        for (let machine of machineList) {
          // 创建一个新对象，首先展开machine对象
          let combinedData = {
            ...machine,
            ...orderRest,
            ...recordRest,
            rentBackTime: null,
          };
          flattenedData.push(combinedData);
        }
      }
      return flattenedData;
    },
    goto(item) {
      let businessNostr = item.businessNo;
      let url = "../sublet-apply-detail?businessNo=" + businessNostr;
      uni.navigateTo({
        url: url,
      });
    },
  },
  // 其他选项...
};
</script>

<style scoped lang="scss">
.sublet-order-item {
  border-top: 1rpx solid $uni-line-color;
}

.sublet-order-item .header {
  padding: 20rpx 20rpx;
  border-bottom: 1rpx solid $uni-line-color;

  /* 样式 */
  .label {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $uni-text-color-gray;
    line-height: 60rpx;
  }
}

.sublet-order-item .order-number {
  // margin-left: 18rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: $uni-text-color-gray;
  line-height: 60rpx;

  .number {
    color: $uni-color-primary;
    font-size: 28rpx;
  }

  /* 单独一行的样式 */
}

.sublet-order-item .order-info {
  display: flex;
  justify-content: space-between;
  line-height: 60rpx;
  /* 其他样式 */
}

.machine-list {
  padding: 30rpx 10rpx 0 10rpx;
}

.total {
  // display: flex;
  // flex-direction: row;
  // justify-content: end;
  text-align: right;
  color: $uni-text-color-gray;
  font-size: 28rpx;
  margin-bottom: 30rpx;

  .number {
    color: $uni-color-primary;
  }
}

.label-red {
  color: $uni-color-primary;
}

.machine-info {
  display: flex;
  justify-content: space-between;
}

.collapse-info {
  display: flex;
  color: $uni-color-primary;
}

.rotate-arrow {
  transform: rotate(-90deg);
}
</style>
