<template>
  <view class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar
      :hasPlaceholder="false"
      backgroundColor="transparent"
      textColor="#fff"
    ></c-nav-bar>
    <view class="bg-wrapper">
      <image class="bg" mode="widthFix" :src="ac.backPath"></image>
      <view class="coupons">
        <view class="coupon" v-for="(c, i) in ac.couponTypeDtos" :key="i">
          <image class="banner" :src="c.path"></image>
          <view class="btns">
            <view
              class="btn bg-primary"
              @click="updateCouponNum({ index: i, num: c.num + 1 })"
            >
              <text class="iconfont iconjia"></text>
            </view>
            <text class="margin-tb-sm">{{ c.num }}</text>
            <view class="btn" @click="updateCouponNum({ index: i, num: c.num - 1 })">
              <text class="iconfont iconjian"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer">
      <button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        立即领取
      </button>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  components: {},
  data() {
    return {
      list: [1, 2, 3, 4],
      acData: null, // 初始化一个用于存储ac值的属性
    };
  },
  computed: {
    ...mapState("coupon", {
      ac: (s) => s.activity,
    }),
  },
  onShow() {
    this.$store.dispatch("coupon/fetchRunningActivity");
  },
  onLoad() {},
  mounted() {
    this.acData = this.ac;
    // this.popScan()
  },
  methods: {
    ...mapMutations("coupon", ["updateCouponNum"]),
    async getPhoneNumber(e) {
      this.acData = this.ac;
      if (
        this.acData &&
        Array.isArray(this.acData.couponTypeDtos) &&
        this.acData.couponTypeDtos.length > 0 &&
        this.acData.couponTypeDtos.some((couponTypeDto) => couponTypeDto.num > 0)
      ) {
        if (e.detail.code) {
          let phone = "";
          try {
            phone = await this.$network.getPhoneNum(e.detail.code);
          } catch (e) {
            console.log("获取手机号失败:", e);
          }
          this.gotoOrder(phone);
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "至少选择一个订购券",
        });
        // 如果不满足条件，可以在这里处理，例如显示错误消息或者其他操作
      }
    },
    gotoOrder(phone) {
      uni.navigateTo({
        url: `/subOtherPages/coupon/order?phone=${phone}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  @include flex(column);

  .bg-wrapper {
    flex: 1;
    overflow: auto;
    position: relative;

    .bg {
      width: 100%;
      height: auto;
    }
  }

  .coupons {
    position: absolute;
    top: 780rpx;
    left: 79rpx;
  }

  .coupon {
    margin-bottom: 20rpx;
    height: 200rpx;
    @include flex(row, center);

    .banner {
      width: 480rpx;
      height: 200rpx;
      border-radius: 4px;
    }

    .btns {
      color: $uni-color-primary;
      margin-left: 38rpx;
      @include flex(column, center);

      .btn {
        width: 52rpx;
        height: 52rpx;
        border-radius: 100%;
        @include flex(row, center, center);
        font-size: 28rpx;
        border: 1rpx solid $uni-color-primary;
        background: $uni-bg-color;
        color: $uni-color-primary;
      }
    }
  }
}

.footer {
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  height: 100rpx;
  background-color: $uni-bg-color;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.27);
  @include flex(row, center, center);

  .btn {
    width: 510rpx;
    height: 72rpx;
    background: linear-gradient(360deg, #fe7437 0%, #f52f00 100%);
    border-radius: 36rpx;
    @include flex(row, center, center);
    font-size: 32rpx;
    color: $uni-text-color-inverse;
  }
}
</style>
