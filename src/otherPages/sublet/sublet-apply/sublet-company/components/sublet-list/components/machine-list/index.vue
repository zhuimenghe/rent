<template>
  <view class="machine-list">
    <machine-item
      v-for="(machine, index) in machines"
      :key="'_machine' + index"
      :machine="machine"
      :show-details="showDetails"
      @openRentDialog="openRentDialog"
    ></machine-item>
  </view>
</template>

<script>
import MachineItem from "./components/item.vue";

export default {
  name: "machine-list",
  components: {
    MachineItem,
  },
  props: {
    machines: Array,
    showDetails: Boolean,
  },
  data() {
    return {
      currentPickerIndex: null,
      dialogData: {},
    };
  },
  methods: {
    openRentDialog(item) {
      this.$emit("openRentDialog", item);
    },
    formatDateSToC(val, type) {
      if (val) return this.$dateUtil.formatDateSToC(val);
      else if (type === "rentBack") return "转租中";
      else return "-";
    },
  },
  // 其他选项...
};
</script>

<style scoped lang="scss">
.machine-list {
  padding: 0 20rpx;
  /* 样式 */
}
</style>
