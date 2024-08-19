<template>
  <view class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="flex-scroll-wrapper">
      <view class="form">
        <view class="line">
          <text class="text-gray label">
            购券人
            <text class="text-primary label">*</text>
          </text>
          <input type="text" class="flex-1" v-model="name" placeholder="请输入姓名" />
        </view>
        <view class="line">
          <text class="text-gray label">
            手机号
            <text class="text-primary label">*</text>
          </text>
          <input
            type="text"
            class="flex-1"
            v-model="phoneNum"
            placeholder="请输入手机号"
          />
        </view>
        <view class="line">
          <text class="text-gray label">
            公司名称
            <text class="text-primary label">*</text>
          </text>
          <input
            type="text"
            class="flex-1"
            v-model="identifierName"
            placeholder="请输入公司名称"
          />
        </view>
      </view>
      <view class="detail">
        <view class="header"> 抵扣券信息 </view>
        <view
          class="item"
          v-for="(c, i) in ac.couponTypeDtos"
          :key="i"
          :style="'display:' + (c.num != 0 ? 'flex;' : 'none;')"
        >
          <template v-if="c.num != 0">
            <view class="image-container">
              <image class="img" :src="c.path" mode="heightFix"></image>
            </view>
            <view class="flex-1">
              <view class="text-lg text-bold"> {{ c.name }}订购券 </view>
              <view class="cu-tag radius line-primary sm margin-top" v-if="c.machineType">
                {{ c.machineType }}
              </view>
              <view class="flex align-center justify-between margin-top-lg">
                <view class="text-primary">
                  <text class="text-sm">￥</text>
                  <text class="text-xl">{{ splitAmount(c.paymentAmount).integer }}.</text>
                  <text class="text-sm">{{
                    splitAmount(c.paymentAmount).fractional
                  }}</text>
                </view>
                <view class="btns">
                  <view
                    class="ac text-xl"
                    @click="updateCouponNum({ index: i, num: c.num - 1 })"
                    >-</view
                  >
                  <view class="mid">{{ c.num }}</view>
                  <view
                    class="ac text-xl"
                    @click="updateCouponNum({ index: i, num: c.num + 1 })"
                    >+</view
                  >
                </view>
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>
    <view class="total text-grey">
      共计<text class="text-primary padding-lr-sm">{{ numTotal }}</text
      >张订购券
    </view>
    <view class="footer">
      <view class="text-grey"
        >需支付<text class="text-lg text-primary padding-lr-sm">{{ payTotal }}</text
        >元</view
      >
      <view class="btn" @click="startPay">立即支付</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { createOrder } from "@/network/modules/couponapi";
export default {
  components: {},
  data() {
    return {
      name: "",
      phoneNum: "",
      identifier: "",
      identifierName: "",
    };
  },
  computed: {
    ...mapState("coupon", {
      ac: (s) => s.activity,
      openid: "openid",
    }),
    numTotal() {
      return this.ac.couponTypeDtos.reduce((ac, cp) => ac + cp.num, 0);
    },
    discountTotal() {
      return this.ac.couponTypeDtos.reduce(
        (ac, cp) => ac + cp.num * Number(cp.couponAmount),
        0
      );
    },
    payTotal() {
      return this.ac.couponTypeDtos.reduce(
        (ac, cp) => ac + cp.num * Number(cp.paymentAmount),
        0
      );
    },
  },
  onShow() {},
  onLoad(options) {
    this.phoneNum = options.phone || "";
    uni.getStorage({
      key: this.$savekey.TENANT_DETAIL,
      success: (res) => {
        console.log(res);
        this.identifierName = res.data.organizationName;
      },
    });
    uni.getStorage({
      key: "teamId",
      success: (res) => {
        console.log(res);
        this.identifier = res.data;
      },
    });
  },
  mounted() {
    // this.popScan()
  },
  methods: {
    ...mapMutations("coupon", ["updateCouponNum"]),
    splitAmount(amount) {
      const parts = amount.toString().split(".");
      return {
        integer: parts[0], // 整数部分
        fractional: parts.length > 1 ? parts[1] : "00", // 如果没有小数部分，则默认为'00'
      };
    },
    async startPay() {
      if (!this.name) {
        return uni.showToast({ icon: "none", title: "请填写购券人" });
      }
      if (!this.phoneNum) {
        return uni.showToast({ icon: "none", title: "请填写手机号" });
      }
      if (!this.identifierName) {
        return uni.showToast({ icon: "none", title: "请填写公司名称" });
      }
      let hasNum = false;
      let orderList = this.ac.couponTypeDtos
        .filter((c) => c.num > 0)
        .map((c) => {
          if (c.num > 0) {
            hasNum = true;
          }
          return {
            couponTypeId: c.id,
            machineType: c.machineType,
            couponTypeName: c.name,
            paymentAmount: c.paymentAmount,
            count: c.num,
          };
        });
      if (!hasNum) {
        return uni.showToast({ icon: "none", title: "请选择卡券" });
      }

      uni.showLoading({
        mask: true,
      });
      let res = await createOrder({
        name: this.name,
        phoneNum: this.phoneNum,
        identifier: this.identifier,
        identifierName: this.identifierName,
        openId: this.openid,
        orderList,
      });
      console.log(res);
      uni.hideLoading();
      uni.requestPayment({
        provider: "wxpay",
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.packageStr,
        signType: res.signType,
        paySign: res.paySign,
        success() {
          console.log("支付成功");
          uni.showToast({ title: "支付成功" });
          uni.redirectTo({ url: "/subOtherPages/coupon/orderList" });
        },
        fail(e) {
          console.log("支付拉起失败", e);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  @include flex(column);

  .form {
    background: $uni-bg-color;

    .line {
      @include hairline-bottom();
      @include flex(row, center);
      height: 85rpx;
      padding: 0 32rpx;

      .label {
        width: 150rpx;
      }

      input {
        font-size: $uni-font-size-base;
      }
    }
  }

  .detail {
    margin-top: 24rpx;
    background: $uni-bg-color;

    .header {
      @include hairline-bottom();
      font-weight: bold;
      font-size: 30rpx;
      padding: 24rpx;
    }

    .item {
      padding: 24rpx;
      @include flex(row, center);
      @include hairline-bottom();

      .image-container {
        border-radius: 4px;
        width: 160rpx;
        height: 160rpx;
        margin-right: 24rpx;
        overflow: hidden;
        position: relative;

        .img {
          width: auto;
          height: 100%;
        }
      }

      .flex-1 {
      }

      .btns {
        @include flex(row);
        font-weight: bold;
        font-size: 30rpx;
        width: 200rpx;
        height: 64rpx;
        border-radius: 64rpx;
        border: 1rpx solid #e6e6e6;
        padding: 0 12rpx;

        .mid {
          @include flex(row, center, center);
          width: 64rpx;
          height: 64rpx;
          border-left: 1rpx solid #e6e6e6;
          border-right: 1rpx solid #e6e6e6;
        }

        .ac {
          flex: 1;
          height: 64rpx;
          @include flex(row, center, center);
        }
      }
    }
  }
}

.total {
  padding: 20rpx 30rpx;
  background: #fff2cf;
}

.footer {
  padding: 0 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: content-box;
  height: 100rpx;
  background-color: $uni-bg-color;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.27);
  @include flex(row, center, space-between);

  .btn {
    width: 255rpx;
    height: 72rpx;
    background: linear-gradient(360deg, #fe7437 0%, #f52f00 100%);
    border-radius: 36rpx;
    @include flex(row, center, center);
    font-size: 32rpx;
    color: $uni-text-color-inverse;
  }
}
</style>
