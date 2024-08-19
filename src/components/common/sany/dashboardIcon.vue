<!--
  @component DashboardIcon
  @description 用于显示自定义图标的组件，支持自定义图标颜色和背景颜色。
  @prop icon {String} - 必需。指定图标的类名。
  @prop iconColor {String} - [默认值: "#000"] 图标的颜色。
  @prop backgroundColor {String} - [默认值: "transparent"] 图标的背景颜色。

  @example
  <dashboard-icon
    icon="icon-example"
    iconColor="#fff"
    backgroundColor="#f00"
  ></dashboard-icon>
-->
<template>
  <view class="icon-container" :style="{ backgroundColor: backgroundColor }">
    <i :class="['iconfont', `${icon}`]" :style="{ color: iconColor }"></i>
  </view>
</template>

<script>
export default {
  name: "dashboardIcon",
  /**
   * @prop {String} icon - 必需。用于指定图标的类名。
   */
  props: {
    /**
     * @prop {String} icon - 指定图标的类名。
     */
    icon: {
      type: String,
      required: true,
    },
    /**
     * @prop {String} [iconColor="#000"] - 图标的颜色，默认为黑色。
     */
    iconColor: {
      type: String,
      default: "#000", // 默认图标颜色
    },
    /**
     * @prop {String} [backgroundColor="transparent"] - 图标的背景颜色，默认透明。
     */
    backgroundColor: {
      type: String,
      default: "transparent", // 默认背景颜色
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-container {
  width: 45px;
  height: 45px;
  padding: 10px;
  line-height: 25px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.iconfont {
  font-size: 25px;
  line-height: 25px;
}
</style>
