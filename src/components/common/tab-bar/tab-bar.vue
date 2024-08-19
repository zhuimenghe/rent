<template>
  <div class="c-tab-bar">
    <div class="placeholder"></div>
    <div class="inner">
      <div class="item" v-for="(t, i) in tabs" :key="i" @click="nav(t)">
        <image
          v-if="t.tab"
          class="icon"
          mode="heightFix"
          :src="active == t.tab ? t.selectedIconPath : t.iconPath"
        ></image>
        <text class="text" :class="{selected:active == t.tab}">{{ t.text }}</text>
      </div>
      <image class="mid" src="/static/homescan.png"></image>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: String,
      default: "home",
    },
  },
  data() {
    return {
      tabs: [
        {
          tab: "home",
          pagePath: "/pages/main/home/home-static",
          text: "首页",
          iconPath: "/static/tab_button_home_nor.png",
          selectedIconPath: "/static/tab_button_home_sel.png",
        },
        {
          tab: "device",
          pagePath: "/pages/main/map",
          text: "设备",
          iconPath: "/static/tab_button_car_nor.png",
          selectedIconPath: "/static/tab_button_car_sel.png",
        },
        {},
        {
          tab: "business",
          pagePath: "/pages/main/business",
          text: "业务",
          iconPath: "/static/tab_button_js_nor.png",
          selectedIconPath: "/static/tab_button_js_sel.png",
        },
        {
          tab: "user",
          pagePath: "/pages/main/setting",
          text: "我的",
          iconPath: "/static/tab_button_mine_nor.png",
          selectedIconPath: "/static/tab_button_mine_sel.png",
        },
      ],
    };
  },
  methods:{
    nav(tab){
      let pages = getCurrentPages()
      if(pages[0].route!=tab.pagePath){
        uni.switchTab({url:tab.pagePath})
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.c-tab-bar {
  .placeholder {
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
    height: 100rpx;
  }
  .inner {
    background: $uni-bg-color;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
    height: 100rpx;
    @include flex(row, center, space-around);
    box-shadow: 0px 0px 6px 0px rgba(169,169,169,0.5);
    .item {
      padding: 0 30rpx;
      @include flex(column, center);
      .icon {
        width:auto;
        height: 60rpx;
      }
      .text {
        color: $uni-text-color-grey;
        font-size: 20rpx;
        &.selected{
          color:$uni-color-primary;
        }
      }
    }
    .mid {
      position: absolute;
      left: 50%;
      top: -35rpx;
      transform: translateX(-64rpx);
      width: 128rpx;
      height: 128rpx;
      background: url(/static/homescan.png);
      background-size: contain;
    }
  }
}
</style>