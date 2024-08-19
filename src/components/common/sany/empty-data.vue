<template>
  <view class="empty-data-box" :class="[externalClass]">
    <image class="icon" mode="widthFix" src="/static/empty.png"></image>
    <text class="text">{{ emptyText }}</text>
  </view>
</template>

<script>
export default {
  props: {
    emptyText: {
      type: String,
      default: "暂无数据",
    },
    externalClass: {
      type: String,
      default: ''
    }
  },
};
</script>

<style lang="scss" scope>
.empty-data-box {
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  color: var(--text-color-gray);

  &.sublet-payment-form {
    margin: 0;
    padding: 60rpx 0;

    .text {
      margin-top: 20rpx;
    }
  }

  .icon {
    width: 108rpx;
  }

  .text {
    font-size: 28rpx;
  }
}
</style>
