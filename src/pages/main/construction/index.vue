<script>
import Filters from "./components/filters.vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { debounce } from "@/common/util/util";

export default {
  components: {
    Filters,
  },
  computed: {
    ...mapState("system", {
      tabBarHeight: "tabBarHeight",
      windowHeight: (s) => s.systemInfo.windowHeight,
      navbarHeight: (s) => s.statusBarHeight + s.titleBarHeight,
      menuWidth: (s) => s.menuBtnRect.right - s.menuBtnRect.left,
    }),
    ...mapState("map", {
      myLocationInited: "myLocationInited",
      centerLatitude: "centerLatitude",
      centerLongitude: "centerLongitude",
      scale: "scale",
    }),
    ...mapState("construction", {
      city: "city",
      counts: "counts",
      markers: "markers",
    }),
    // ...mapGetters("construction", ["filteredMarkers"]),
  },
  created() {
    this.init();
  },
  data() {
    return {
      curMarker: {},
    };
  },
  methods: {
    ...mapActions("map", ["getMyLocation"]),
    ...mapActions("construction", ["init", "openListFilter", "fetchList"]),
    ...mapMutations("construction", ["setState"]),
    ...mapMutations("map", {
      setMapState: "setState",
    }),
    queryChange: debounce(function ({ detail }) {
      this.setState({ query: detail.value });
      this.fetchList();
    }),
    async clickMarker(e) {
      let marker = this.markers.find((m) => m.id == e.detail.markerId);
      if (marker.isHome) {
        // if(!marker.detail){
        uni.showLoading();
        let res = await this.$network.mapHomeDetail(marker.data.address);
        marker.data = { ...marker.data, ...res };
        this.curMarker = marker.data;
        uni.hideLoading();
        // }
        this.$refs.warehousePop.open();
      } else {
        this.curMarker = marker.data;
        this.$refs.constructionPop.open();
      }
    },
    regionchange({ causedBy, detail }) {
      // console.log(causedBy,detail);
      if (detail && detail.centerLocation && causedBy != "update") {
        let { latitude, longitude } = detail.centerLocation;
        this.setMapState({
          centerLatitude: latitude,
          centerLongitude: longitude,
        });
      }
      if (causedBy == "scale") {
        this.setMapState({ scale: detail.scale });
      }
      // if (
      //   detail.scale >= 20 &&
      //   this.markers.find((m) => m.joinCluster == true)
      // ) {
      //   //进入最大尺寸
      //   let markers = this.markers.map((m) => ({ ...m, joinCluster: false }));
      //   this.setState({ markers });
      // }
      // if (
      //   detail.scale < 20 &&
      //   this.markers.find((m) => m.joinCluster == false)
      // ) {
      //   //离开最大尺寸
      //   let markers = this.markers.map((m) => ({ ...m, joinCluster: true }));
      //   this.setState({ markers });
      // }
    },
  },
};
</script>

<template>
  <div class="container">
    <view class="search-box" :style="{ width: `calc(100% - ${menuWidth}px)` }">
      <text class="iconfont iconzl--sousuo"></text>
      <input
        class="flex-1"
        type="text"
        placeholder="施工点名称"
        @focus="openListFilter()"
        @input="queryChange"
      />
    </view>
    <view class="map-container" :style="{ marginBottom: tabBarHeight + 'px' }">
      <map
        v-if="myLocationInited"
        class="map-view"
        id="device-map"
        @markertap="clickMarker"
        @labeltap="clickMarker"
        @regionchange="regionchange"
        :latitude="centerLatitude"
        :longitude="centerLongitude"
        :scale="scale"
        :max-scale="20"
        :markers="markers"
        :show-location="true"
      >
        <view class="legend-view">
          <view class="legend" @click="openListFilter('warehouse')">
            <image class="img" src="/static/device/blue-circle.png"></image>
            <view class="label">仓库({{ counts.warehouse }})</view>
          </view>
          <view
            class="legend padding-left"
            @click="openListFilter('construction')"
          >
            <image class="img" src="/static/device/green-circle.png"></image>
            <view class="label">施工点({{ counts.construction }})</view>
          </view>
        </view>
        <view class="address-bg" @click="getMyLocation">
          <image class="address-icon" src="/static/dingwei.png" />
        </view>
      </map>
    </view>
    <uni-popup ref="warehousePop" type="center" :mask-click="true">
      <view class="callout-container">
        <view class="box text-bold">
          仓库：{{ curMarker.address || "--" }}
        </view>
        <view class="box">
          <view class="line">
            设备数量：剪{{ curMarker.machineMap["剪"] || 0 }}|曲{{
              curMarker.machineMap["臂"] || 0
            }}
          </view>
          <view class="line">
            低电量设备：<span
              class="text-warn"
              v-for="id in curMarker.lowPowerLicenseIds"
              :key="id"
              >{{ id }}</span
            >
          </view>
          <view class="line">
            管理员：{{ curMarker.adminName || "" }}
            {{ curMarker.adminPhone || "" }}
          </view>
        </view>
        <view class="btns">
          <navigator
            :url="`/devicePages/gps/warehouseDetail?address=${curMarker.address}`"
            class="btn"
            >仓库详情</navigator
          >
        </view>
      </view>
      <view class="callout-close" @click="$refs.warehousePop.close()">
        <text class="iconfont iconclose-circle"></text>
      </view>
    </uni-popup>
    <uni-popup ref="constructionPop" type="center" :mask-click="true">
      <view class="callout-container">
        <view class="box text-bold">
          施工点：{{ curMarker.address || "--" }}
        </view>
        <view class="box">
          <view class="line">
            施工开始时间：{{ curMarker.startDate || "--" }}
          </view>
          <view class="line">
            设备数量：剪{{ curMarker.machineMap["剪"] || 0 }}|曲{{
              curMarker.machineMap["臂"] || 0
            }}
          </view>
        </view>
        <view class="btns">
          <navigator
            :url="`/devicePages/gps/constructionDetail?address=${curMarker.address}&isHistory=false&dateRange=${curMarker.startDate}`"
            class="btn"
            >施工点详情</navigator
          >
        </view>
      </view>
      <view class="callout-close" @click="$refs.constructionPop.close()">
        <text class="iconfont iconclose-circle"></text>
      </view>
    </uni-popup>
    <filters></filters>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}

.map-container {
  width: 100%;
  // height: calc(100% - 176px);
  // flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

.map-view {
  width: 100%;
  height: 100%;
}

.search-box {
  position: absolute;
  z-index: 10;
  top: 18rpx;
  left: 24rpx;
  width: 460rpx;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  @include flex(row, center, start);
  background: $uni-bg-color;
  border-radius: 100px;
  height: 32px;
  padding: 0 30rpx;
  box-sizing: border-box;
  .iconfont {
    margin-right: 18rpx;
  }
}
.legend-view {
  position: absolute;
  left: 10px;
  bottom: 20px;
  // width: 210px;
  background: #ffffff;
  border-radius: 5px;
  height: 40px;
  z-index: 900;
  @include flex(row, center, space-between);
  .legend {
    margin-left: 20rpx;
    @include flex(row, center, space-between);
    .img {
      width: 26rpx;
      height: 26rpx;
      margin-right: 12rpx;
    }
    .label {
      color: $uni-text-color-gray;
      font-size: $uni-font-size-base;
    }
    &:last-child {
      margin-right: 20rpx;
    }
  }
}
.address-bg {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 900;
  background: #ffffff;
  box-shadow: 0px 0px 10rpx 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  @include flex(row, center, center);
}
.address-icon {
  width: 25px;
  height: 25px;
}

.callout-container {
  box-sizing: border-box;
  width: 700rpx;
  border-radius: 8rpx;
  background: $uni-bg-color;
  padding: 24rpx 20rpx 0 20rpx;
  overflow: auto;
  .box {
    @include hairline-bottom($uni-border-color, dashed);
    padding-bottom: 15rpx;
  }
  .line {
    margin-top: 16rpx;
    color: $uni-text-color-gray;
    font-size: $uni-font-size-sm;
    // @include flex(row, center, start);
  }
  .iconfont {
    margin-right: 9rpx;
  }
  .btns {
    @include flex(row, center, space-around);
    height: 80rpx;
    // padding-bottom: 10rpx;
    .btn {
      font-weight: bold;
      color: $uni-color-primary;
    }
  }
}
.callout-close {
  height: 100rpx;
  padding-bottom: 150px;
  @include flex(row, center, center);
  font-size: 46rpx;
  color: #fff;
}
</style>
