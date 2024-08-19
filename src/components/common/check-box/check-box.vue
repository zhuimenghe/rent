<template>
  <view
    :style="{
      display: 'flex',
      'flex-direction': 'row',
      'align-items': isVCenter ? 'center' : 'flex-start',
    }"
  >
    <!-- Conflicts:是否真的可以生效 -->
    <view class="bgclass" :style="getStyle" @click="changeState">
      <i
        class="iconfont checkImg iconxuanzhong"
        v-if="checked"
        :class="{ 'inverse-color': inverseColor && checked }"
      ></i>
    </view>
    <view style="margin-left: 4px">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isVCenter: {
      type: Boolean,
      default: false,
    },
    inverseColor: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: " #e60000",
    },
  },
  data() {
    return {};
  },
  computed: {
    getStyle() {
      if (this.disabled) {
        return "background-color: #DCDCDC;";
      } else if (this.inverseColor) {
        return `background-color: ${this.color};`;
      } else {
        return "background-color: #FFFFFF;";
      }
    },
  },
  created() {},
  methods: {
    changeState(e) {
      if (!this.disabled) {
        this.$emit("clickBox");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.bgclass {
  display: flex;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  border: 1px solid #d3d3d3;
}
.checkImg {
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  &.inverse-color {
    color: #ffffff;
  }
}
</style>
