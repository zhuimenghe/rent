<template>
  <view class="button-container">
    <view @click="buttonClick" class="button-item">
      <i
        :class="['iconfont', buttonItem.iconClass]"
        :style="{ color: buttonItem.iconColor }"
      ></i>
      {{ buttonItem.btnName }}
    </view>
  </view>
</template>

<script>
export default {
  name: "ButtonComponent",
  props: {
    buttonItem: {
      type: Object,
      required: true,
      default: () => ({
        name: "", // 按钮名称
        icon: {
          class: "", // 图标类名
          color: "", // 图标颜色
        },
        onClick: () => {}, // 点击事件处理函数
      }),
    },
  },
  methods: {
    buttonClick() {
      this.$emit(this.buttonItem.name);
    },
  },
};
</script>

<style scoped lang="scss">
.button-container {
  text-align: center;
  background-color: #fff;
  line-height: 60rpx;
  font-size: 14rpx;
  color: #999;
  /* Your button styles */
}
.button-item {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 32rpx;
  .iconfont {
    margin-right: 10rpx;
    font-size: 32rpx;
  }
}
</style>
