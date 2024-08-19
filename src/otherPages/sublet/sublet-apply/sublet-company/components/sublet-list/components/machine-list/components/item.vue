<template>
  <view class="machine-item">
    <view class="machine-header" v-if="showDetails">
      <view>
        <view class="machine-code">
          <view class="print-code">{{ machine.printCode || "-" }}</view>
          <view class="license-id">{{ machine.licenseId || "-" }}</view>
        </view>
        <view>
          <view class="machine-info">
            <view> {{ machine.brand || "-" }}</view>
            <view> {{ machine.typeName || "-" }}</view>
            <view> {{ machine.heightName || "-" }}</view>
            <view> {{ machine.machineTypeName || "-" }}</view>
          </view>
        </view>
      </view>
      <view class="machine-btns">
        <view class="machine-btn" @click="showDialog(machine)" v-if="!machine.rentBackDate">还租</view>
      </view>
    </view>
    <view v-if="showDetails" class="machine-detail">
      <!-- 详情内容 -->
      <!-- <view class="machine-detail-item">
        租赁方式：{{ machine.settlementTypeName }}
      </view> -->
      <view class="machine-detail-item" style="flex: 1 1 100%">
        租赁单价：
        <text v-if="machine.price != 0 || machine.price != '0'">
          {{ moneyUtil.dealNumber(machine.price) }}/天
        </text>
        <text v-if="machine.hireMonthly != 0 || machine.hireMonthly != '0'">
          {{ moneyUtil.dealNumber(machine.hireMonthly) }}/月
        </text>
      </view>
      <view class="machine-detail-item">
        测试启用日期：{{ machine.actualSubletDate | dateFormat }}
        <!-- 启用日期：{{ $dateUtil.dateSFormat(new Date(machine.actualSubletDate)) }} -->
      </view>
      <view class="machine-detail-item">
        还租日期：
        <text :class="{ 'rent-back-date': !machine.rentBackDate }">
          {{ formatDateSToC(machine.rentBackDate, "rentBack") }}</text>
      </view>
      <view class="machine-detail-item"> 累计租期：{{ machine.rentDays || "-" }} </view>
      <view class="machine-detail-item">
        履约成本：{{ moneyUtil.dealNumber(machine.payableTotal) || "-" }}
      </view>
      <view class="machine-detail-item"> 报停天数：{{ machine.pauseDays || "-" }} </view>
      <view class="machine-detail-item">
        报停金额：{{ moneyUtil.dealNumber(machine.pauseHireTotal) || "-" }}
      </view>
    </view>
  </view>
</template>
<script>

export default {
  name: "machine-item",
  props: {
    machine: Object,
    showDetails: Boolean,
  },
  data() {
    return {};
  },
  //   filters: {
  //     formatDateSToC(val) {
  //       if (val) return this.$dateUtil.formatDateSToC(val);
  //       else return "-";
  //     },
  //   },
  filters: {

  },
  methods: {
    showDialog(item) {
      this.$emit("openRentDialog", item);
    },
    formatDateSToC(val, type) {
      if (val) return this.$dateUtil.dateSFormat(val);
      else if (type === "rentBack") return "转租中";
      else return "-";
    },

  },
  // 其他选项...
};
</script>

<style lang="scss" scoped>
.machine-item {
  /* 样式 */
}

.machine-item {
  .machine-header {
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;

    /* 其他样式 */
    .machine-code {
      display: flex;
      flex-direction: row;
      font-size: 32rpx;
      line-height: 40rpx;

      .license-id {
        margin-left: 16rpx;
        color: $uni-color-primary;
        background: #fff1f0;
        border-radius: 20rpx;
        padding: 0rpx 20rpx;
        font-size: 24rpx;
      }

      /* justify-content: space-between; */
    }
  }

  .machine-info {
    display: flex;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $uni-text-color-gray;
    line-height: 60rpx;

    >view:not(:last-child) {
      &:after {
        content: "|";
        padding: 0 10rpx;
      }
    }

    /* 每行两个字段的样式 */
  }

  .machine-btns {
    .machine-btn {
      color: $uni-color-primary;
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }

  .machine-detail {
    /* 详情的样式 */
    display: flex;
    flex-wrap: wrap;
    padding: 12rpx 8rpx 12rpx 8rpx;
    margin-bottom: 16rpx;
    background-color: $uni-bg-color-gray;
    border-radius: 8rpx;

    .machine-detail-item {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-text-color-gray;
      flex: 1 1 50%;
      /* flex-grow: 1, flex-shrink: 1, flex-basis: 50% */
      padding: 8rpx;
      box-sizing: border-box;

      /* 确保内边距不会影响总宽度 */
      .rent-back-date {
        color: $uni-color-success;
      }
    }
  }
}
</style>
