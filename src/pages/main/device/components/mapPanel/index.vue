<template>
  <scroll-view
    :scroll-top="scrollTop"
    :scroll-y="scrollY"
    @scroll="onScroll"
    class="scroller"
  >
    <view class="panel">
      <view class="menus">
        <view class="menu" v-for="m in menus" :key="m.key" @click="gotoMenu(m)">
          <view
            class="icon"
            :style="{
              background: `linear-gradient(180deg, ${m.colors[0]} 0%, ${m.colors[1]} 100%)`,
            }"
          >
            <text class="iconfont" :class="[m.icon]"></text>
          </view>
          <text class="label">{{ m.name }}</text>
        </view>
      </view>
      <view class="statistics">
        <text class="text-bold text-lg">设备统计</text>
        <view class="cards">
          <view class="card">
            <view class="top">
              <image
                class="icon"
                src="/static/device/panel-icon-l.png"
                mode="aspectToFill"
              />
              设备总数：{{ statistic.all }}台
            </view>
            <view class="mid">
              已租<text class="text-primary">{{ statistic.rented }}</text
              >台 | 出租率<text class="text-primary">{{
                Math.round((statistic.rented * 100) / statistic.all)
                  ? Math.round((statistic.rented * 100) / statistic.all) + "%"
                  : "-"
              }}</text>
            </view>
            <navigator url="/devicePages/record/device-record" class="z-btn btn round"
              >查看</navigator
            >
          </view>
          <view class="card r">
            <view class="top">
              <image
                class="icon"
                src="/static/device/panel-icon-r.png"
                mode="aspectToFill"
              />
              监控总数：{{ statistic.gps }}台
            </view>
            <view class="mid">
              在线<text class="text-primary">{{ statistic.gpsOnLine }}</text
              >台 | 在线率<text class="text-primary">
                {{
                  Math.round((statistic.gpsOnLine * 100) / statistic.gps)
                    ? Math.round((statistic.gpsOnLine * 100) / statistic.gps) + "%"
                    : "-"
                }}
              </text>
            </view>
            <navigator
              url="/devicePages/monitor/equipment-monitoring-list"
              class="z-btn btn round"
              >查看</navigator
            >
          </view>
        </view>
      </view>
      <view class="section">
        <view class="header">
          <view
            class="z-btn tab-btn round"
            :class="{ active: tab == 'contract' }"
            @click="tab = 'contract'"
            >合同</view
          >
          <view
            class="z-btn tab-btn round"
            :class="{ active: tab == 'warehouse' }"
            @click="tab = 'warehouse'"
            >仓库</view
          >
        </view>
        <more-list
          v-if="tab == 'contract'"
          empty-text="当前暂无合同"
          :list="contracts"
          @handleMore="handleMoreContract"
          :customHandleMore="true"
        >
          <block slot="list" slot-scope="{ list }">
            <navigator
              :url="`/contractPages/contract/contract-detail?id=${c.id}`"
              class="device-card"
              v-for="(c, i) in list"
              :key="i"
            >
              <view class="content">
                <view class="top">
                  <text class="flex-sub">{{ c.businessNo }}</text>
                  <view class="text-gray">
                    <text class="text-success padding-lr-xs">进{{ c.workInCount }}</text>
                    |
                    <text class="text-primary padding-lr-xs">退{{ c.workOutCount }}</text>
                    |
                    <text class="padding-lr-xs">停{{ c.pauseCount }}</text>
                  </view>
                </view>
                <view class="bottom"> 设备需求：{{ c.demandStr }} </view>
              </view>
            </navigator>
          </block>
        </more-list>
        <more-list v-else empty-text="当前暂无设备" :list="machines" :min-size="5">
          <view class="h device-table-line">
            <view class="flex-3 cell">高度/类型</view>
            <view class="flex-1 cell">待租</view>
            <view class="flex-1 cell">已租</view>
            <view class="flex-1 cell">总数</view>
          </view>
          <block slot="list" slot-scope="{ list }">
            <view class="device-table-line" v-for="(m, i) in list" :key="i">
              <view class="flex-3 cell"
                >{{ m.heightName || "--" }}/{{ m.dimensionName || "--" }}</view
              >
              <view class="flex-1 cell">{{ m.totalCount - m.count }}</view>
              <view class="flex-1 cell">{{ m.count || 0 }}</view>
              <view class="flex-1 cell">{{ m.totalCount || 0 }}</view>
            </view>
          </block>
        </more-list>
      </view>
      <view class="section">
        <view class="header text-bold">
          <text>
            低电量设备
            <text class="text-primary">{{
              lowPowerMachines.length ? `（${lowPowerMachines.length}）` : ""
            }}</text>
          </text>
          <view>
            <text
              class="option"
              :class="{ current: curLowPowerHours == 30 * 24 }"
              @click.stop="changeFliter('curLowPowerHours', 30 * 24)"
            >
              >30天
            </text>
            <text
              class="option"
              :class="{ current: curLowPowerHours == 60 * 24 }"
              @click.stop="changeFliter('curLowPowerHours', 60 * 24)"
            >
              >60天
            </text>
            <text
              class="option"
              :class="{ current: curLowPowerHours == 90 * 24 }"
              @click.stop="changeFliter('curLowPowerHours', 90 * 24)"
            >
              >90天
            </text>
          </view>
        </view>
        <more-list empty-text="当前暂无低电量设备" :list="lowPowerMachines">
          <template slot="list" slot-scope="{ list }">
            <navigator
              :url="`/devicePages/monitor/device-monitor-detail?licenseId=${m.licenseId}`"
              class="device-card"
              v-for="(m, i) in list"
              :key="i"
            >
              <text class="icon iconfont iconjiancha"></text>
              <view class="content">
                <view class="top" style="display: flex; justify-content: space-between">
                  <text>{{ m.licenseId }}</text>
                  <!-- v-if='m.isSanyMachine' -->
                  <text
                    >当前{{
                      oilMachine.includes(m.machineTypeName) ? "油量" : "电量"
                    }}：{{ m.batteryPower }}%</text
                  >
                </view>
                <view class="bottom">
                  <text class="iconfont icondidian margin-right-sm text-df"> </text>
                  {{ m.address }}
                </view>
              </view>
            </navigator>
          </template>
        </more-list>
      </view>
      <view class="section">
        <view class="header text-bold">
          <text>
            离线设备
            <text class="text-primary">{{
              offlineMachines.length ? `（${offlineMachines.length}）` : ""
            }}</text>
          </text>
          <view>
            <text
              class="option"
              :class="{ current: curOfflineHours == 30 * 24 }"
              @click.stop="changeFliter('curOfflineHours', 30 * 24)"
            >
              >30天
            </text>
            <text
              class="option"
              :class="{ current: curOfflineHours == 60 * 24 }"
              @click.stop="changeFliter('curOfflineHours', 60 * 24)"
            >
              >60天
            </text>
            <text
              class="option"
              :class="{ current: curOfflineHours == 90 * 24 }"
              @click.stop="changeFliter('curOfflineHours', 90 * 24)"
            >
              >90天
            </text>
          </view>
        </view>
        <more-list empty-text="当前暂无离线设备" :list="offlineMachines">
          <block slot="list" slot-scope="{ list }">
            <navigator
              :url="`/devicePages/monitor/device-monitor-detail?licenseId=${m.licenseId}`"
              class="device-card"
              v-for="(m, i) in list"
              :key="i"
            >
              <text class="icon iconfont iconjiancha"></text>
              <view class="content">
                <view class="top" style="display: flex; justify-content: space-between">
                  <text>{{ m.licenseId }}</text>
                  <!-- <text>离线时长：{{{{m.offlineHours}}h}}</text> -->
                  <text>离线时长：{{ getOffLineTime(m.offlineHours) }}</text>
                </view>
                <view class="bottom">
                  <text class="iconfont iconshijian margin-right-sm text-df"> </text>
                  最后回传时间：{{ m.lastDataUploadTime }}
                </view>
              </view>
            </navigator>
          </block>
        </more-list>
      </view>
      <view class="section">
        <view class="header text-bold">
          <text>
            关机设备
            <text class="text-primary">
              {{ closeMachines.length ? `（${closeMachines.length}）` : "" }}
            </text>
          </text>
          <view>
            <text
              class="option"
              :class="{ current: curLastCloseDays == 30 }"
              @click.stop="changeFliter('curLastCloseDays', 30)"
            >
              >30天
            </text>
            <text
              class="option"
              :class="{ current: curLastCloseDays == 60 }"
              @click.stop="changeFliter('curLastCloseDays', 60)"
            >
              >60天
            </text>
            <text
              class="option"
              :class="{ current: curLastCloseDays == 90 }"
              @click.stop="changeFliter('curLastCloseDays', 90)"
            >
              >90天
            </text>
          </view>
        </view>
        <more-list empty-text="当前暂无关机设备" :list="closeMachines">
          <block slot="list" slot-scope="{ list }">
            <navigator
              :url="`/devicePages/monitor/device-monitor-detail?licenseId=${m.licenseId}`"
              class="device-card"
              v-for="(m, i) in list"
              :key="i"
            >
              <text class="icon iconfont iconjiancha"></text>
              <view class="content">
                <view class="top" style="display: flex; justify-content: space-between">
                  <text>{{ m.licenseId }}</text>
                  <!-- <text>离线时长：{{{{m.offlineHours}}h}}</text> -->
                  <text>关机时长：{{ m.lastCloseDays }}天</text>
                </view>
                <view class="bottom">
                  <text class="iconfont iconshijian margin-right-sm text-df"> </text>
                  上一次关机时间：{{ m.lastCloseTime }}
                </view>
              </view>
            </navigator>
          </block>
        </more-list>
      </view>
      <view class="bb"></view>
    </view>
  </scroll-view>
</template>
<script>
import MoreList from "./moreList.vue";
import { isSanyMachine } from "@/common/util/util.js";
export default {
  components: {
    MoreList,
  },
  created() {
    this.menus = [
      {
        colors: ["#618AF1", "#76A4FA"],
        name: "设备监控",
        icon: "iconjiankongpingtai",
        url: "/devicePages/monitor/equipment-monitoring-list",
        key: this.$savekey.PERMISSION_MACHINE_MONTIOR,
      },
      {
        colors: ["#FF6B6B", "#FF7984"],
        name: "设备档案",
        icon: "icondangan1",
        url: "/devicePages/record/device-record",
        key: this.$savekey.PERMISSION_MACHINE_ARCHIVES,
      },
      {
        colors: ["#1AD1A3", "#5FDCBB"],
        name: "设备控制",
        icon: "iconsuoding1",
        url: "/devicePages/control/lock-vehicle",
        key: this.$savekey.PERMISSION_MACHINE_CONTROL,
      },
      {
        colors: ["#618AF1", "#76A4FA"],
        name: "电子围栏",
        icon: "iconfence-full",
        url: "/devicePages/fence/fence-list",
        key: this.$savekey.PERMISSION_MACHINE_FENCE,
      },
    ];

    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.menus = this.menus.filter((o) => {
          return !o.key || res.data.some((x) => x.value === o.key);
        });
        this.menus.push({
          colors: ["#FEB505", "#FFD613"],
          name: "库存查询",
          icon: "iconkucunchaxun1",
          url: "/devicePages/inventory/inventory",
          key: this.$savekey.PERMISSION_PART_MANAGE,
        });
        // this.showFindMachine = res.data.some(x => x.value === this.$savekey.PERMISSION_FIND_MACHINE);
      },
    });

    this.refreshData();
  },
  data() {
    return {
      menus: [],
      tab: "contract",
      scrollY: false,
      scrollTop: 0,
      oldScrollTop: 0,
      statistic: {
        forRent: 167,
        all: 177,
        gps: 38,
        gpsOnLine: 14,
        rented: 10,
      },
      machines: [],
      contracts: [],
      lowPowerMachines: [],
      curLowPowerHours: null,
      offlineMachines: [],
      curOfflineHours: 30 * 24,
      closeMachines: [],
      curLastCloseDays: 30,
      oilMachine: this.$store.state.machine.oilMachine,
    };
  },
  computed: {},
  methods: {
    handleMoreContract() {
      uni.setStorage({
        data: {
          id: "0",
        },
        key: this.$savekey.MEMORY_STORAGE,
        success: function success() {
          uni.switchTab({
            url: "/pages/main/business",
          });
        },
      });
    },
    getOffLineTime(time) {
      // time:hours
      time = time || 0;
      let d = Math.floor(time / 24);
      let h = (time % 24).toFixed(1);
      return d ? d + "天" + h + "小时" : h + "小时";
    },
    refreshData() {
      //加载统计数据
      this.fetchStatistic();
      this.fetchContracts();
      this.fetchMachineAll();
      this.fetchLowPowerMachines();
      this.fetchOfflineMachines();
      this.fetchCloseMachines();
    },
    async fetchMachineAll() {
      let res = await this.$network.machineStore({ dimension: "all" });
      this.machines = res;
    },
    async fetchStatistic() {
      let res = await this.$network.fenceMapStatistic();
      this.statistic = res;
    },
    async fetchContracts() {
      let params = {
        showReceivable: true,
        current: 1,
        size: 5,
        draft: false,
        state: "6",
        pageSort: "workInCount",
      };
      let res = await this.$network.fetchContractList(params);
      this.contracts = res.records.map((c) => {
        let demands = c.contractDetailDto.orderList.map(
          (o) => o.typeName + o.orderNum + "台"
        );
        let demandStr = demands.join("，");
        return {
          ...c,
          demandStr,
        };
      });
    },
    async fetchLowPowerMachines() {
      let params = {
        current: 1,
        size: 1000,
        pageSort: "battery_power desc",
      };
      if (this.curLowPowerHours) {
        params.lowPowerHours = this.curLowPowerHours;
      } else {
        params.currentBatteryPower = "0-20";
      }
      let res = await this.$network.monitorList(params);
      // for(let i=0;i<res.records.length;i++){
      //   if(isSanyMachine(res.records[i].licenseId)){
      //     this.$set(res.records[i],'isSanyMachine',true)
      //   }else{
      //     this.$set(res.records[i],'isSanyMachine',false)
      //   }
      // }
      this.lowPowerMachines = res.records;
    },
    async fetchOfflineMachines() {
      let params = {
        current: 1,
        size: 1000,
        pageSort: "offline_hours desc",
      };
      if (this.curOfflineHours) {
        params.offlineHours = Number(this.curOfflineHours);
      }
      let res = await this.$network.monitorList(params);
      this.offlineMachines = res.records.map((m) => {
        return { ...m, offlineHours: Math.round(m.offlineHours) };
      });
    },
    async fetchCloseMachines() {
      let params = {
        current: 1,
        size: 1000,
        pageSort: "offline_hours desc",
      };
      if (this.curLastCloseDays) {
        params.lastCloseDays = this.curLastCloseDays;
      }
      let res = await this.$network.monitorList(params);
      this.closeMachines = res.records;
    },
    changeFliter(key, val) {
      if (key == "curLowPowerHours") {
        if (this[key] == val) {
          this[key] = null;
          this.fetchLowPowerMachines();
          return;
        }
      }
      this[key] = val;
      if (key == "curLowPowerHours") {
        this.fetchLowPowerMachines();
      }
      if (key == "curOfflineHours") {
        this.fetchOfflineMachines();
      }
      if (key == "curLastCloseDays") {
        this.fetchCloseMachines();
      }
    },
    toggleScroll(show) {
      if (show) {
        this.scrollY = true;
      } else {
        this.scrollTop = this.oldScrollTop;
        this.$nextTick(function () {
          this.scrollTop = 0;
          setTimeout(() => {
            this.scrollY = false;
          }, 200);
        });
      }
    },
    onScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
    },
    gotoMenu(m) {
      uni.navigateTo({ url: m.url });
    },
  },
};
</script>
<style lang="scss">
.scroller {
  height: 100%;
  box-sizing: border-box;
}

.panel {
  font-size: $uni-font-size-base;
  background: $uni-bg-color-grey;
}

.bb {
  height: 20px;
  background: $uni-bg-color;
}

.menus {
  background: $uni-bg-color;
  height: 170rpx;
  @include flex(row, center, space-evenly);

  .menu {
    @include flex(column, center, center);

    .icon {
      width: 78rpx;
      height: 78rpx;
      @include flex(row, center, center);
      border-radius: 28rpx;
      color: #fff;
      font-size: 42rpx;
    }

    .label {
      margin-top: 8rpx;
      color: $uni-text-color;
      font-size: $uni-font-size-sm;
    }
  }
}

.statistics {
  background: $uni-bg-color;
  margin-top: 12rpx;
  padding: 16rpx 32rpx 20rpx 32rpx;

  .cards {
    margin-top: 20rpx;
    @include flex(row, center, normal);

    .card {
      flex: 1;
      height: 180rpx;
      margin-right: 26rpx;
      position: relative;
      padding: 13rpx 20rpx 20rpx 20rpx;
      box-sizing: border-box;
      background-size: cover;
      background-image: url(data:image/png;base64,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);

      &.r {
        background-image: url(data:image/png;base64,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);
      }

      .top {
        @include flex(row, center, start);

        .icon {
          height: 48rpx;
          width: 48rpx;
          margin-right: 3rpx;
        }

        font-weight: bold;
      }

      .mid {
        margin-top: 4rpx;
        @include flex(row, center, start);
        color: $uni-text-color-gray;
      }

      .btn {
        margin-top: 20rpx;
        width: 124rpx;
        height: 42rpx;
        color: #fff;
        box-shadow: 0px 0px 6px 0px rgba(230, 0, 0, 0.34);
        background: linear-gradient(360deg, #ff7984 0%, #ff6b6b 100%);
      }

      .bg {
        position: absolute;
        z-index: -1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
}

.section {
  margin-top: 12rpx;
  background: $uni-bg-color;

  .header {
    height: 88rpx;
    padding: 0 24rpx;
    @include flex(row, center, space-between);
    @include hairline-bottom(#e6e6e6);

    .option {
      margin-left: 10px;
      font-weight: 600;
      color: #000;
      padding: 4px 10px;
      border-radius: 30px;

      &.current {
        background-color: $uni-color-primary;
        color: #ffffff;
      }
    }

    .tab-btn {
      background: $uni-bg-color-hover;
      color: $uni-text-color-gray;
      width: 136rpx;
      height: 48rpx;
      margin-right: 24rpx;

      &.active {
        background: rgba(230, 0, 0, 0.1);
        color: $uni-color-primary;
      }
    }
  }
}

.device-card {
  @include flex(row, center, start);
  @include hairline-bottom();
  padding: 20rpx 24rpx;

  > .icon {
    font-size: 88rpx;
    color: $uni-color-primary;
    margin-right: 18rpx;
  }

  .content {
    flex: 1;

    .top {
      @include flex(row, center, start);

      .right {
        font-size: $uni-font-size-sm;
      }
    }

    .bottom {
      @include flex(row, center, start);
      margin-top: 16rpx;
      font-size: $uni-font-size-sm;
      color: $uni-text-color-gray;
    }
  }
}

.device-table-line {
  @include flex(row, center, start);
  color: $uni-text-color-grey;
  font-size: $uni-font-size-sm;
  @include hairline-bottom();

  &.h {
    background: $uni-bg-color-grey;
    @include hairline-none();

    .cell {
      padding: 8rpx 28rpx;
    }
  }

  .cell {
    padding: 15rpx 28rpx;
  }
}
</style>
