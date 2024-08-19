<template>
  <card :show-header="false" class="card-padding">
    <div class="header-icon">
      <icon-item v-for="(item, index) in list" :item="item" :key="index" @total="clickHandler" @sublet="clickHandler" @rentBack="clickHandler" @subletForRent="clickHandler"
        class="icon-item"></icon-item>
    </div>
  </card>
</template>

<script>
import Card from "@/components/common/sany/card.vue";
import IconItem from "./components/icon-item.vue";
export default {
  name: "icon-overview",
  props: {
    list: {
      type: Array,
    },
  },
  components: {
    Card,
    IconItem,
  },
  methods: {
    clickHandler(event) {
      if (event) {
        this.$emit(event.clickEvent, { 'clickEvent': event.clickEvent })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card-padding {
  display: flex;
  padding: 8px;
  //   padding-top: 0;
}

.header-icon {
  display: flex;
  flex-wrap: wrap;
  padding: 13px;
  margin-top: 20rpx;
  padding-left: 30px;

  .icon-item {
    flex-basis: 50%;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    display: flex;
    color: #888888;
    margin-bottom: 20rpx;
  }
}

.card {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 10rpx;
  //   padding: 36rpx 25rpx 0;
  margin-bottom: 30rpx;
}
</style>
