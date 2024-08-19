<template>
  <view class="com-nav-bar" :class="[theme]">
    <view
      class="com-nav-bar-inner"
      :class="{ fixed: fixed, shadow: hasShadow }"
      :style="{
        background: transparentMode ? transparentBgColor : backgroundColor,
      }"
    >
      <view
        class="n-status-bar"
        :style="{ height: statusBarHeight + 'px' }"
        v-if="hasStatusBar"
      ></view>
      <view
        class="com-nav-bar-inner-header"
        v-if="showHeader"
        :style="{ padding: `0 17px`, height: titleBarHeight + 'px' }"
      >
        <view class="_back" style="" @click="goBack" v-if="showBack && _needBack">
          <text
            class="iconfont iconarrow-left"
            style="font-size: 60rpx; transform: rotate(180deg)"
            :style="{ color: textColor }"
          ></text>
        </view>
        <view
          class="_title"
          :style="{
            justifyContent: flexAlign,
            color: textColor,
            paddingRight: showBack ? '60rpx' : '0px',
          }"
        >
          <text class="_t" v-if="title">{{ title }}</text> <slot v-else></slot>
        </view>
      </view>
      <slot name="fixed"></slot>
    </view>
    <view class="_placeholder" v-if="hasPlaceholder">
      <view
        class="n-status-bar"
        :style="{ height: statusBarHeight + 'px' }"
        v-if="hasStatusBar"
      ></view>
      <view v-if="showHeader" :style="{ height: titleBarHeight + 'px' }"></view>
    </view>
  </view>
</template>

<script>
// import Color from "color";
import { mapState } from "vuex";

let app = getApp();
export default {
  options: {
    styleIsolation: "shared",
  },
  props: {
    hasStatusBar: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    hasPlaceholder: {
      type: Boolean,
      default: true,
    },
    transparentMode: {
      type: Boolean,
      default: false,
    },
    transparentRange: {
      //rpx
      type: Array,
      default: (_) => [320, 506],
    },
    backgroundColor: {
      type: String,
      default: "#F9F9F9",
    },
    textColor: {
      type: String,
      default: "",
    },
    showBack: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    flexAlign: {
      type: String,
      default: "flex-start",
    },
    hasShadow: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "", //primary
    },
    customBack: {
      type: Boolean,
      default: false,
    },
    title:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      // #ifndef MP-WEIXIN||MP-TOUTIAO
      paddingHorizontal: 10,
      // #endif
      opacity: 0,
      transparentBgColor: "transparent",
      threshold: 0.8,
    };
  },
  computed: {
    ...mapState("system", {
      statusBarHeight: (s) => s.statusBarHeight,
      titleBarHeight: (s) => s.titleBarHeight,
      // #ifdef MP-WEIXIN||MP-TOUTIAO
      paddingHorizontal: (s) => s.systemInfo.windowWidth - s.menuBtnRect.right,
      // #endif
    }),
    _needBack() {
      let pages = getCurrentPages();
      return !(pages.length == 1 && pages[0].route == "pages/index/index");
    },
  },
  watch: {
    opacity(newOp, oldOp) {
      if (newOp > this.threshold && oldOp <= this.threshold) {
        uni.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff",
        });
      }
      if (newOp <= this.threshold && oldOp > this.threshold) {
        uni.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#ffffff",
        });
      }
      this.$emit("opacity-change", newOp);
    },
  },
  methods: {
    // notifyScrollTop(scrollTop) {
    //   if (this.transparentMode) {
    //     let ratio = app.globalData.ratio || 2;
    //     scrollTop = scrollTop * ratio;
    //     let [min, max] = this.transparentRange;
    //     scrollTop -= min;
    //     let range = max - min;
    //     this.opacity = scrollTop / range > 1 ? 1 : scrollTop / range;
    //     this.opacity = this.opacity < 0 ? 0 : this.opacity;
    //     this.opacity = Math.ceil(this.opacity * 100) / 100;
    //     this.transparentBgColor = Color(this.backgroundColor)
    //       .alpha(this.opacity)
    //       .hsl()
    //       .string();
    //   }
    // },
    goBack() {
      if (this.customBack) {
        return this.$emit("back");
      }
      let pages = getCurrentPages();
      if (pages.length > 1) {
        uni.navigateBack();
      } else {
        uni.switchTab({ url: "/pages/main/home/home-static" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.com-nav-bar {
  position: relative;
  width: 100%;
  /*  #ifndef  APP-PLUS-NVUE  */
  color: $uni-text-color;
  /*  #endif  */
  &-inner {
    position: absolute;
    width: 100%;
    /*  #ifndef  APP-PLUS-NVUE  */
    background: $uni-bg-color;
    /*  #endif  */
    &.shadow {
      box-shadow: 0 0rpx 30rpx 0rpx rgba(67, 67, 95, 0.1);
    }
    &.fixed {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 999;
    }
    &-header {
      display: flex;
      align-items: center;
      ._title {
        padding-right: 60rpx;
        font-size: 28rpx;
        // font-weight: bold;
        flex: 1;
        display: flex;
        justify-content: center;
        /*  #ifndef  APP-PLUS-NVUE  */
        color: $uni-text-color;
        /*  #endif  */
        ._t{
          font-size: 32rpx;
          font-weight: bold;
        }
      }
      ._back {
        line-height: 1;
        padding: 10rpx;
        margin-left: -20rpx;
      }
    }
  }
  ._placeholder {
    width: 750rpx;
  }
  //theme
  &.primary {
    .com-nav-bar-inner {
      background: $uni-color-primary;
    }
    ._back {
      color: $uni-text-color-inverse;
    }
    ._title {
      color: $uni-text-color-inverse;
    }
  }
}
</style>
