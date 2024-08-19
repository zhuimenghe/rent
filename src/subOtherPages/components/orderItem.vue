<template>
  <view
    class="order-item"
    @click.stop="
      goto({ url: '/subOtherPages/coupon/couponList', businessNo: orderData.id })
    "
  >
    <!-- 顶部 -->
    <view class="order-header">
      <view class="order-header-left">
        <view class="order-number-label">订单号：</view>
        <view class="order-number">{{ orderData.businessNo }}</view>
      </view>
    </view>
    <!-- 抵扣券 -->
    <view class="coupon-section">
      <!-- 抵扣券横向滑动列表 -->
      <scroll-view class="coupon-scroll-view" scroll-x="true">
        <view class="coupon-list">
          <view
            class="coupon-item"
            v-for="(coupon, index) in orderData.orders"
            :key="index"
          >
            <image class="coupon-image" :src="coupon.path" mode="heightFix"></image>
            <!-- <view class="coupon-name">{{ coupon.name }}</view> -->
            <view class="coupon-quantity">{{ coupon.count }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 订单价格和抵扣券数量 -->
      <view class="price-coupon-info">
        <view class="order-price">¥{{ orderData.paymentAmount }}</view>
        <view class="coupon-count">共{{ totalCouponCount }}张</view>
      </view>
    </view>
    <!-- 付款时间和详情按钮 -->
    <view class="payment-details">
      <view class="payment-details-left">
        <view class="payment-time">
          <view>付款时间：</view>
          <view>{{ orderData.payTime }}</view>
        </view>
        <view
          class="details-button"
          @click.stop="
            goto({ url: '/subOtherPages/coupon/couponList', businessNo: orderData.id })
          "
        >
          <text class="details-button-text">详情</text>
          <i class="iconfont iconarrow-right"></i>
        </view>
      </view>
      <view class="payment-details-right">
        <view class="order-number-label">待使用/已使用/已作废：</view>
        <view class="order-number">{{ orderData.countStr }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    orderData: {
      type: Object,
      default: () => ({
        // 默认值可以根据实际需求进行调整
        orderNumber: "",
        price: 0,
        coupons: [],
        paymentTime: "",
      }),
    },
  },
  methods: {
    goto(item) {
      if (item.url) {
        uni.navigateTo({
          url: item.url + "?businessNo=" + item.businessNo,
        });
      }
    },
  },
  // 其他组件选项...
  computed: {
    // 添加计算属性来计算总的抵扣券数量
    totalCouponCount() {
      // 使用reduce方法累加每个项目的count值
      return this.orderData.orders.reduce((total, coupon) => total + coupon.count, 0);
    },
  },
};
</script>

<style lang="scss">
.order-item {
  @include flex(column);
  background-color: #ffffff;
  margin: 30rpx 0;
  padding: 20rpx;

  &:first-child {
    margin-top: 0;
  }

  .order-header {
    @include flex(row, center, space-between);
    // padding: 20rpx 0;
    padding-top: 10rpx;
    padding-bottom: 20rpx;
    margin-bottom: 40rpx;
    border-bottom: 1rpx solid #e6e6e6;
    color: #222222;

    &-left {
      @include flex(row, center, flex-start);
    }
  }

  .coupon-section {
    @include flex(row, center, space-between);

    .coupon-scroll-view {
      max-width: 80%;

      .coupon-list {
        @include flex(row, center, flex-start);

        .coupon-item {
          background-color: #ffafaf;
          border-radius: 6rpx;
          margin-right: 10rpx;
          min-width: 100rpx;
          width: 100rpx;
          height: 100rpx;
          overflow: hidden;
          position: relative;

          .coupon-image {
            width: auto;
            height: 100%;
          }

          .coupon-quantity {
            position: absolute;
            left: 0;
            top: 0;
            width: 35rpx;
            height: 35rpx;
            text-align: center;
            line-height: 35rpx;
            font-size: 24rpx;
            color: #ffffff;
            border-radius: 6rpx;
            background-color: rgba(#222222, 0.3);
          }
        }
      }
    }

    .price-coupon-info {
      @include flex(column, flex-end, flex-start);

      .order-price {
        color: #222222;
        font-size: 32rpx;
        @include flex(row, center, flex-start);
      }

      .coupon-count {
        color: #8c8c8c;
        font-size: 28rpx;
        @include flex(row, center, flex-start);
      }
    }
  }

  .payment-details {
    @include flex(column, flex-start, center);
    border-top: 1rpx solid #e6e6e6;
    padding-top: 20rpx;
    padding-bottom: 10rpx;
    margin-top: 40rpx;

    .payment-time {
      @include flex(row, center, flex-start);
    }

    .details-button {
      @include flex(row, center, flex-start);

      .details-button-text {
        color: #e60000;
      }
    }

    &-left {
      @include flex(row, center, space-between);
      width: 100%;
    }

    &-right {
      width: 100%;
      @include flex(row, center, flex-start);
    }
  }
}
</style>
