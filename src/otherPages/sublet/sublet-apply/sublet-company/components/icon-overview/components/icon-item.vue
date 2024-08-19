<template>
  <view class="icon-item" :key="item.name" @click="clickHandler(item)">
    <view class="img-wrapper">
      <!-- <img :src="item.icon" alt="" /> -->
      <dashboard-icon :icon="item.icon" :iconColor="item.color" :backgroundColor="item.bgc"></dashboard-icon>
    </view>
    <view class="txt">
      <text>{{ item.name }}</text>
      <text class="bold">{{ item.num }}<text v-if="item.unit">{{ item.unit }}</text></text>
    </view>
  </view>
</template>

<script>
import dashboardIcon from "@/components/common/sany/dashboardIcon.vue";
export default {
  name: "icon-item",
  props: {
    item: {
      type: Object,
    },
  },
  components: { dashboardIcon },
  methods: {
    clickHandler(item) {

      if (item.clickEvent) {
        this.$emit(item.clickEvent, { 'clickEvent': item.clickEvent })
      }
    }
  }
};
</script>

<style lang="scss" scope>
.icon-item {
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  display: flex;
  color: #888888;

  .img-wrapper {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .txt {
    margin-left: 18rpx;
    display: flex;
    flex-direction: column;

    .bold {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-top: 5rpx;
    }
  }
}
</style>
