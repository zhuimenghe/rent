<template>
  <div class="card">
    <!-- 头部，仅当 showHeader 为 true 时显示 -->
    <div v-if="showHeader" class="card-header">
      <div class="card-header-left">
        <view class="__icon-main">
          <view class="__icon-inner"></view>
        </view>
        <!-- 假设使用 iconfont 类 -->
        <text class="card-title">{{ title }}</text>
      </div>
      <div class="card-header-right">
        <!-- 头部右侧插槽 -->
        <slot name="header-right"></slot>
      </div>
    </div>
    <!-- 默认插槽用于卡片主体内容 -->
    <slot>
      <EmptyData></EmptyData>
    </slot>
  </div>
</template>

<script>
import EmptyData from "@/components/common/sany/empty-data.vue";
export default {
  name: "sanyCard",
  components: {
    EmptyData,
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-data-box {
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  color: var(--text-color-gray);

  .icon {
    width: 108rpx;
  }

  .text {
    font-size: 28rpx;
  }
}
.card {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0, 0, 0, 0.16);
  border-radius: 20rpx;
  box-sizing: border-box;
  overflow: hidden;
  // padding: 18rpx 25rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25rpx; /* 根据需要调整 */
  border-bottom: 1rpx solid #e6e6e6;
}

.card-header-left {
  display: flex;
  align-items: center;

  .__icon-main {
    position: relative;
    width: 30rpx;
    height: 30rpx;
    background: rgba(230, 0, 0, 0.18);

    .__icon-inner {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 18rpx;
      height: 18rpx;
      background: #e60000;
    }
  }
  .card-title {
    display: flex;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 1000;
    color: #222222;
    line-height: 50rpx;
    padding: 22rpx 25rpx;
  }
}

.card-header-right {
  /* 根据需要调整样式 */
}
</style>
