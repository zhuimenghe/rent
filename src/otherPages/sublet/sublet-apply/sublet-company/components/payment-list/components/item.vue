<template>
  <view class="payment-item">
    <view class="payment-detail">
      <!-- 详情内容 -->
      <view class="payment-detail-item business-key">
        应付单号：{{ payment.businessNo }}
      </view>
      <view class="payment-detail-item rentday">
        租赁周期：
        <text v-if="payment.beginDate != 0 || payment.beginDate != '0'">
          {{ formatDateSToC(payment.beginDate) }}
        </text>
        <text v-if="payment.endDate != 0 || payment.endDate != '0'">
          ~{{ formatDateSToC(payment.endDate) }}
        </text>
      </view>
      <view class="payment-detail-item">
        转租应付：{{ moneyUtil.dealNumber(payment.surplus) || "0.00" }}
      </view>
      <view class="payment-detail-item">
        已付费用： {{ moneyUtil.dealNumber(payment.paidTotal) || "0.00" }}
      </view>
      <view class="payment-detail-item">
        剩余应付：{{ moneyUtil.dealNumber(payment.total) || "0.00" }}
      </view>
    </view>
    <view class="payment-operate" @click="editPayment(payment)">
      修改已付
      <i class="iconfont iconxiazai3" />
    </view>
  </view>
</template>
<script>
export default {
  name: "payment-item",
  props: {
    payment: Object,
    showDetails: Boolean,
  },
  //   filters: {
  //     formatDateSToC(val) {
  //       if (val) return this.$dateUtil.formatDateSToC(val);
  //       else return "-";
  //     },
  //   },
  methods: {
    formatDateSToC(val, type) {
      if (val) return this.$dateUtil.dateSFormat(val);
      else if (type === "rentBack") return "转租中";
      else return "-";
    },
    editPayment(payment) {
      this.$emit("openPaymentDialog", payment);
    }
  },
  // 其他选项...
};
</script>

<style lang="scss" scoped>
.payment-item {
  /* 样式 */
}

.payment-item {
  .payment-header {
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;

    /* 其他样式 */
    .payment-code {
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

  .payment-info {
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

  .payment-btns {
    .payment-btn {
      color: $uni-color-primary;
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }

  .payment-detail {
    /* 详情的样式 */
    display: flex;
    flex-wrap: wrap;
    padding: 12rpx 8rpx 12rpx 8rpx;
    // margin-bottom: 32rpx;
    background-color: #ffffff;
    border-radius: 8rpx;

    .payment-detail-item {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-text-color-gray;
      flex: 1 1 50%;
      /* flex-grow: 1, flex-shrink: 1, flex-basis: 50% */
      padding: 8rpx;
      box-sizing: border-box;

      /* 确保内边距不会影响总宽度 */
      &.business-key,
      &.rentday {
        flex: 1 1 100%;
      }

      .rent-back-date {
        color: $uni-color-success;
      }
    }
  }

  .payment-operate {
    display: flex;
    flex-direction: row-reverse;
    line-height: 60rpx;
    padding: 0 20rpx;
    color: #f08200;

    .iconfont {
      padding-right: 5rpx;
    }
  }
}
</style>
