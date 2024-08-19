<template>
  <view class="button-panel">
    <button-component
      class="button-item"
      v-for="(button, index) in buttons"
      :key="index"
      :buttonItem="button"
      @sublet="handleSublet"
      @rent="handleRent"
      @payment="handlePayment"
      @pay="handlePay"
    />
  </view>
</template>

<script>
import buttonComponent from "./components/buttonComponent.vue";
export default {
  name: "button-panel",
  components: { buttonComponent },
  data() {
    return {
      buttons: [
        {
          iconClass: "iconcaidanlan-kucun-chukudan",
          iconColor: "#F08200",
          btnName: "转租",
          name: "sublet",
        },
        {
          iconClass: "iconcaidanlan-kucun-rukudan",
          iconColor: "#F08200",
          btnName: "还租",
          name: "rent",
        },
        {
          iconClass: "iconjisuanqi1",
          iconColor: "#F08200",
          btnName: "应付",
          name: "payment",
        },
        {
          iconClass: "iconfukuan",
          iconColor: "#F08200",
          btnName: "付款",
          name: "pay",
        },
        // ... 更多按钮
      ],
    };
  },
  methods: {
    handleSublet() {
      console.log("buttonClick", "sublet");
      this.$emit("sublet");
    },
    handleRent() {
      console.log("buttonClick", "rent");
      this.$emit("rent");
    },
    handlePayment() {
      console.log("buttonClick", "payment");
      this.$emit("payment");
    },
    handlePay() {
      console.log("buttonClick", "pay");
      this.$emit("pay");
    },
  },
};
</script>
<style lang="scss" scoped>
.button-panel {
  display: flex;
  background-color: #fff;
  padding-bottom: 50rpx;
}
.button-item {
  flex: 1;
}
</style>
