<script>
import Device from './device/device.vue'
import Construction from './construction/index.vue'
import tabMixin from "@/mixins/customTabbar";
import { mapState } from "vuex";
export default {
  name: "map",
  mixins: [tabMixin],
  components: {
    Device,
    Construction,
  },
  computed: {
    ...mapState("system", {
      tabBarHeight: "tabBarHeight",
      windowHeight: (s) => s.systemInfo.windowHeight,
      navbarHeight: (s) => s.statusBarHeight + s.titleBarHeight,
      menuWidth: (s) => s.menuBtnRect.right - s.menuBtnRect.left,
    }),
  },
  data() {
    return {
      tab: 0
    }
  },
  methods: {
    tabChange({ detail }) {
      this.tab = detail.current
    }
  }
}
</script>

<template>
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar :show-back="false" flexAlign="center">
      <view class="tabs">
        <view class="tab" :class="{ active: tab == 0 }" @click="tab = 0">设备</view>
        <view class="tab" :class="{ active: tab == 1 }" @click="tab = 1">施工点</view>
      </view>
    </c-nav-bar>
    <!-- <view :style="{height:`calc(100% - ${navbarHeight}px)`}" class="swiper">
      <device class="item" :style="{transform:`translateX(-${750*tab}rpx)`}"></device>
      <construction class="item" :style="{transform:`translateX(-${750*tab}rpx)`}"></construction>
    </view> -->
    <device :style="{ height: `calc(100% - ${navbarHeight}px)` }" v-if="tab == 0" class="item"></device>
    <construction :style="{ height: `calc(100% - ${navbarHeight}px)` }" v-if="tab == 1" class="item"></construction>
  </div>
</template>

<style scoped lang="scss">
.page{
  height:100vh;
  box-sizing: border-box;
  @include flex(column);
  overflow: auto;
}
.tabs{
  @include flex(row);
  border-radius: 8rpx;
  border: 1rpx solid $uni-color-warning;
  color:$uni-color-warning;
  .tab{
    width:160rpx;
    height:58rpx;
    @include flex(row,center,center);
    &.active{
      background: $uni-color-warning;
      color:$uni-text-color-inverse;
    }
  }
}
.swiper{
  white-space: nowrap;
  .item{
    width:750rpx;
    height:100%;
    display: inline-block;
    vertical-align: top;
  transition: transform 0.3s ease-in-out;
  }
}
</style>