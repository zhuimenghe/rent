<template>
  <view class="container">
    <view
      class="search-box"
      :style="{ width: `calc(100% - ${menuWidth}px)` }"
      @click="gotoSearch"
    >
      <text class="iconfont iconzl--sousuo"></text>
      自喷码/车号/地址
    </view>
    <view
      class="map-container"
      :style="{ marginBottom: bottomInitHeight + 'px' }"
    >
      <map
        v-if="myLocationInited"
        class="map-view"
        id="device-map"
        @markertap="clickMarker"
        @regionchange="regionchange"
        :latitude="centerLatitude"
        :longitude="centerLongitude"
        :scale="scale"
        :max-scale="20"
        :markers="filteredMarkers"
        :polygons="polygons"
        :circles="circles"
        :show-location="true"
      >
        <view class="legend-view">
          <view class="legend" @click="openListFilter('on')">
            <image class="img" src="/static/device/legend-on.png"></image>
            <view class="label">在线({{ counts.on }})</view>
          </view>
          <view class="legend" @click="openListFilter('off')">
            <image class="img" src="/static/device/legend-off.png"></image>
            <view class="label">离线({{ counts.off }})</view>
          </view>
          <view class="legend" @click="openListFilter('mal')">
            <image class="img" src="/static/device/legend-mal.png"></image>
            <view class="label">故障({{ counts.mal }})</view>
          </view>
        </view>
        <view class="address-bg" @click="getMyLocation">
          <image class="address-icon" src="/static/dingwei.png" />
        </view>
      </map>
    </view>
    <c-bottom-drawer
      v-model="showBottomDrawer"
      :init-height="bottomInitHeight"
      :height="bottomDrawerHeight"
    >
      <view class="bd-wrapper" :style="{ paddingBottom: tabBarHeight + 'px' }">
        <panel ref="bd"></panel>
      </view>
    </c-bottom-drawer>
    <c-scan-device-pop ref="scanPop"></c-scan-device-pop>
    <uni-popup ref="callout" type="center" :mask-click="true">
      <view class="callout-container">
        <view class="box">
          <view class="title">
            <text class="licenseId">{{ curMarker.licenseId }}</text>
            <text class="printcode">{{ curMarker.printCode || "" }}</text>
          </view>
          <view class="line margin-top">
            {{ curMarker.machineTypeDesc }} |
            {{ curMarker.machineHeightDesc }} |
            {{ curMarker.machineTypeName }} | {{ curMarker.driveTypeName }}
          </view>
          <view class="line margin-top">
            <view
              class="cu-tag line-success bg-success light radius margin-right"
              v-if="curMarker.machineStatus"
              >在线</view
            >
            <view
              class="cu-tag line-gray bg-gray light radius margin-right "
              v-else
              >离线</view
            >
            <view v-if="curMarker.isSanyMachine" class="cu-tag line-warn bg-warn light radius margin-right"
              >{{ oilMachine.includes(curMarker.machineTypeName) ? "油量" : "电量" }}：{{
                curMarker.batteryPower
              }}%</view
            >
          </view>
        </view>
        <view class="box">
          <view class="line margin-top">
            <text class="iconfont icondingwei3"></text>
            {{ curMarker.address }}
          </view>
          <view class="line margin-top-lg">
            <text class="iconfont iconshijian"></text>
            定位时间：{{ curMarker.locateDate }}
          </view>
          <view class="line margin-top-lg">
            <text class="iconfont icongengxinshijian"></text>
            最后回传：{{ curMarker.lastDataUploadTime }}
          </view>
        </view>
        <view class="btns">
          <view class="btn" @click="gotoMachineDetail(curMarker.licenseId)"
            >设备档案</view
          >
          <view v-if="curMarker.isSanyMachine" class="btn" @click="gotoMachineMonitor(curMarker.licenseId)"
            >设备监控</view
          >
        </view>
      </view>
      <view class="callout-close" @click="$refs.callout.close()">
        <text class="iconfont iconclose-circle"></text>
      </view>
    </uni-popup>
    <filters></filters>
    <!-- <c-tab-bar active="device"></c-tab-bar> -->
  </view>
</template>

<script>
import Panel from "./components/mapPanel/index.vue";
import Filters from "./components/mapFilters/index.vue";
import tabMixin from "@/mixins/customTabbar";
import {isSanyMachine} from '@/common/util/util.js'
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

const DEVICE_STATUS = {
  ON: "on",
  MAL: "mal",
  OFF: "off",
};

export default {
  computed: {},
  mixins: [tabMixin],
  components: {
    Panel,
    Filters,
  },
  name: "device",
  data() {
    return {
      isShowStatistics: true,
      showBottomDrawer: false,
      searchKey: "",
      mapCtx: null,
      currentPoint: {},
      // markers: [],
      clusterMarkers: [],
      showFindMachine: true,
      mapCtx: null,
      curMarker: {},
      oilMachine: this.$store.state.machine.oilMachine,
    };
  },
  watch: {
    showBottomDrawer(show) {
      if (show) {
        this.$refs.bd.refreshData();
      }
      this.$refs.bd.toggleScroll(show);
    },
  },
  computed: {
    ...mapState("system", {
      tabBarHeight: "tabBarHeight",
      windowHeight: (s) => s.systemInfo.windowHeight,
      navbarHeight: (s) => s.statusBarHeight + s.titleBarHeight,
      menuWidth: (s) => s.menuBtnRect.right - s.menuBtnRect.left,
    }),
    ...mapState("map", {
      myLocationInited:'myLocationInited',
      markers: "markers",
      city: "city",
      scale: "scale",
      polygons: "polygons",
      circles: "circles",
      centerLatitude: "centerLatitude",
      centerLongitude: "centerLongitude",
      counts: "counts",
    }),
    ...mapGetters("map", ["filteredMarkers"]),
    bottomInitHeight() {
      return uni.upx2px(200) + this.tabBarHeight;
    },
    bottomDrawerHeight() {
      return this.windowHeight - this.navbarHeight - 50;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    // this.getDeviceDustribution();
    uni.$on("device-search", (item) => {
      if (item.type == "device") {
        let Adict = item.data;
        setTimeout(() => {
          if (this.centerLatitude == Adict.latitude) {
            this.setState({ centerLatitude: Adict.latitude + 0.00001 });
          } else {
            this.setState({ centerLatitude: Adict.latitude });
          }
          if (this.centerLongitude == Adict.longitude) {
            this.setState({ centerLongitude: Adict.longitude + 0.00001 });
          } else {
            this.setState({ centerLongitude: Adict.longitude });
          }
          if (this.scale == 20) {
            this.setState({ scale: 20.2 });
          } else {
            this.setState({ scale: 20 });
          }
        }, 500);
      } else {
        let Adict = item.data;
        let location = Adict.location;
        let listlocation = location.split(",");
        if (listlocation.length === 2) {
          let latitude = parseFloat(listlocation[1]);
          let longitude = parseFloat(listlocation[0]);
          if (this.centerLatitude == latitude) {
            this.setState({ centerLatitude: latitude + 0.00001 });
          } else {
            this.setState({ centerLatitude: latitude });
          }
          if (this.centerLongitude == longitude) {
            this.setState({ centerLongitude: longitude + 0.00001 });
          } else {
            this.setState({ centerLongitude: longitude });
          }
        }
        if (this.scale == 13) {
          this.setState({ scale: 13.2 });
        } else {
          this.setState({ scale: 13 });
        }
      }
    });

    this.mapCtx = uni.createMapContext("device-map", this);
    
    this.mapCtx.initMarkerCluster({
      enableDefaultStyle: false,
      zoomOnClick: true,
      gridSize: 50,
      complete(res) {
        console.log("initMarkerCluster", res);
      },
    });
    this.mapCtx.on("markerClusterCreate", ({ clusters }) => {
      console.log("markerClusterCreate", clusters, this.clusterMarkers);
      let clusterMarkers = clusters.map((c) => {
        let content = c.markerIds.length + "";
        return {
          id: c.clusterId,
          clusterId: c.clusterId,
          ...c.center,
          width: 52,
          height: 52,
          // anchor:{x:0.5,y:0.5},
          label: {
            content: content,
            anchorX: -(0.5 * (content.length * 16 * 0.5)),
            anchorY: -26 - 8,
            // textAlign:'center',
            color: "#ffffff",
            fontSize: 16,
          },
          iconPath: `/static/device/cluster.png`,
          joinCluster: true,
        };
      });
      this.mapCtx.addMarkers({ markers: clusterMarkers });
    });
    this.mapCtx.on("markerClusterClick", ({ cluster }) => {
      console.log("markerClusterClick", cluster);
    });
    // this.init()

    // this.getDeviceDustribution();
  },
  methods: {
    ...mapActions("map", ["init", "getMyLocation", "openListFilter"]),
    ...mapMutations("map", ["setState"]),
    regionchange({ causedBy, detail }) {
      // console.log(causedBy,'=-=-==');
      if (detail && detail.centerLocation && causedBy != "update") {
        let { latitude, longitude } = detail.centerLocation;
        this.setState({ centerLatitude: latitude, centerLongitude: longitude });
      }
      if (causedBy == "scale") {
        this.setState({ scale: detail.scale });
      }
      if (
        detail.scale >= 20 &&
        this.markers.find((m) => m.joinCluster == true)
      ) {
        //进入最大尺寸
        let markers = this.markers.map((m) => ({ ...m, joinCluster: false }));
        this.setState({ markers });
      }
      if (
        detail.scale < 20 &&
        this.markers.find((m) => m.joinCluster == false)
      ) {
        //离开最大尺寸
        let markers = this.markers.map((m) => ({ ...m, joinCluster: true }));
        this.setState({ markers });
      }
    },
    gotoMachineDetail(licenseId) {
      // this.$refs.callout.close()
      let urlstr =
        "/devicePages/record/device-record-detail?licenseId=" + licenseId;
      uni.navigateTo({
        url: urlstr,
      });
    },
    gotoMachineMonitor(licenseId) {
      // this.$refs.callout.close()
      let urlstr =
        "/devicePages/monitor/device-monitor-detail?licenseId=" + licenseId;
      uni.navigateTo({
        url: urlstr,
      });
    },
    async clickMarker(e) {
      let marker = this.markers.find((m) => m.id == e.detail.markerId);
      if (marker) {
        // if(!marker.detail){
        uni.showLoading();
        this.curMarker = await this.$network.monitorDetail(marker.licenseId);
        if(isSanyMachine(this.curMarker.licenseId)){
          this.$set(this.curMarker ,'isSanyMachine',true);
        }else{
          this.$set(this.curMarker ,'isSanyMachine',false);
        }
        uni.hideLoading();
        // }
        // this.curMarker = marker.detail
        this.$refs.callout.open();
      }
    },
    popScan(licenseId) {
      this.$refs.scanPop.open(licenseId);
    },
    checkSupportFindMachine() {
      if (!this.searchKey) {
        uni.showToast({
          icon: "none",
          title: "请在左侧输入框输入自喷码或车号",
        });
        return;
      }
      this.$network
        .getData(
          this.$url.CHECK_SUPPORT_FIND_MACHINE.replace(
            /{keyWord}/,
            this.searchKey
          ),
          "GET"
        )
        .then((result) => {
          //查找到车后返回车号
          if (result) {
            uni.showModal({
              title: "提示",
              content: "确定发出找车指令",
              confirmText: "确定",
              success: (res) => {
                if (res.cancel) {
                } else {
                  this.findMachine(result);
                }
              },
            });
          }
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details ? err.details[0] : err.message,
          });
        });
    },
    findMachine(licenseId) {
      this.$network
        .getData(
          this.$url.FIND_MACHINE.replace(/{licenseId}/, licenseId),
          "GET"
        )
        .then((result) => {
          uni.showToast({
            icon: "none",
            title: "发送成功",
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details ? err.details[0] : err.message,
          });
        });
    },
    // getDeviceDustribution() {
    // 	uni.showLoading();
    // 	let self = this;
    // 	let param = {
    // 		keyword: this.searchKey
    // 	};
    // 	this.$network
    // 		.getData(this.$url.DEVICE_MAP_DISTRIBUTION + '?timestamp=' + new Date().getTime(), 'POST', param)
    // 		.then(result => {
    // 			let num = 0;
    // 			this.markers = result.map.records.filter(o => {
    // 				return o.authorityStatus == 1;
    // 			});
    // 			this.markers = this.markers.map(record => {
    // 				num++;
    // 				let latitude = parseFloat(record.amaplatitudeNum);
    // 				let longitude = parseFloat(record.amaplongitudeNum);
    // 				let printCode = record.printCode
    // 					? record.printCode
    // 					: record.licenseId
    // 					? record.licenseId
    // 					: '--';
    // 				let status = !record.offlineMode ? (record.warningFlag ? DEVICE_STATUS.MAL : DEVICE_STATUS.ON) : DEVICE_STATUS.OFF
    // 				let m = {
    // 					status,
    // 					printCode,
    // 					licenseId:record.licenseId,
    // 					id: num,
    // 					latitude: latitude,
    // 					longitude: longitude,
    // 					// label:{content:record.licenseId},
    // 					width: 35,
    // 					height: 47,
    // 					iconPath:`/static/device/qubi-${status}.png`,
    // 					joinCluster:true,
    // 					customCallout:{
    // 						display:'BYCLICK'
    // 					}
    // 				};

    // 				return m;
    // 			});

    // 			this.mapCtx.addMarkers({markers:this.markers,clear:true})

    // 			uni.hideLoading();
    // 		})
    // 		.catch(err => {
    // 			this.markers = [];
    // 			uni.hideLoading();
    // 		});
    // },
    // getFileLocalPath(fileName) {
    // 	// #ifdef APP-PLUS
    // 	if (uni.getSystemInfoSync().platform === 'android') {
    // 		return 'file:/' + plus.io.convertLocalFileSystemURL('_www' + fileName);
    // 	} else {
    // 		return fileName;
    // 	}
    // 	// #endif
    // },
    getTimeNum(item) {
      let todayDate = new Date();
      let str = item.lastDataUploadTime ? item.lastDataUploadTime : "";
      if (str == "") {
        return "0小时";
      }
      let lastDate = new Date(str.replace(/-/g, "/").replace(/-/g, "/"));
      let diffMs = todayDate.getTime() - lastDate.getTime();
      let hours = parseInt(diffMs / 3600000);
      return hours.toString() + "小时1111";
    },
    goToPage(item) {
      if (!item.url) return;
      uni.navigateTo({
        url: item.url,
      });
    },
    gotoSearch() {
      uni.navigateTo({
        url: "/otherPages/map/search-device",
      });
    },
    // scanCode() {
    // 	let self = this;
    // 	uni.scanCode({
    // 		success(res) {
    // 			let codeResult = res.result;
    // 			self.searchKey = self.$datestr.getQueryString('licenseId', codeResult);
    // 			self.getDeviceDustribution();
    // 		},
    // 		fail() {
    // 			// uni.showToast({
    // 			// 	title: '扫码失败',
    // 			// 	icon: 'none'
    // 			// });
    // 		}
    // 	});
    // }
  },
};
</script>

<style lang="scss" scoped>
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
  height:100%;
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
  z-index:10;
  top:18rpx;
  left:24rpx;
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

.statistics-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 36px;
  justify-content: space-between;
  align-items: center;
}

.statistics-img {
  font-size: 36px;
  margin-right: 16px;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  margin-left: 16px;
  padding: 8px;
  flex: 1;
  border-radius: 4px;
  transition: fade;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
	.slide-fade-leave-to

	/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.s-item-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.s-close {
  align-self: flex-end;
  margin-right: 0px;
  font-size: 12px;
  color: #999999;
}

.s-item {
  display: flex;
  flex-direction: row;
  padding-left: 4px;
  padding-right: 4px;
}

.s-item-icon {
  font-size: 20px;
}

.s-item-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2px;
}

.s-item-num {
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}

.s-item-tag {
  font-size: 10px;
  color: #999999;
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
      width: 42rpx;
      height: 55rpx;
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

.address-icon {
  width: 25px;
  height: 25px;
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

.callout-container {
  width: 510rpx;
  border-radius: 8rpx;
  background: $uni-bg-color;
  padding: 0 26rpx;
  font-size: $uni-font-size-sm;
  overflow: auto;
  .box {
    @include hairline-bottom($uni-border-color, dashed);
    padding-bottom: 20rpx;
  }
  .title {
    margin-top: 20rpx;
    @include flex(row, center, start);
    flex-wrap: wrap;
    .licenseId {
      font-weight: bold;
      font-size: $uni-font-size-base;
      margin-right: 16rpx;
    }
    .printcode {
      background: rgba(230, 0, 0, 0.14);
      padding: 0 15rpx;
      border-radius: 100rpx;
      color: $uni-color-primary;
    }
  }
  .line {
    color: $uni-text-color-gray;
    @include flex(row, center, start);
  }
  .iconfont {
    margin-right: 9rpx;
  }
  .btns {
    @include flex(row, center, space-around);
    height: 80rpx;
    padding-bottom: 10rpx;
    .btn {
      font-size: $uni-font-size-lg;
      font-weight: bold;
      color: $uni-color-primary;
    }
  }
}
.callout-close {
  height: 100rpx;
  padding-bottom:150px;
  @include flex(row, center, center);
  font-size: 46rpx;
  color: #fff;
}
.bd-wrapper {
  height: 100%;
  box-sizing: border-box;
}
</style>
