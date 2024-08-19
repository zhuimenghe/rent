<template>
  <view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar flexAlign="center">设备监控</c-nav-bar>
    <!-- 筛选view -->
    <view class="filtrate-top" :style="{ top: navBarHeight + 'px' }">
      <c-search-bar placeholder="自喷码/车号/品牌/型号" :value="keyWord" @input="searchChange" @clear="reset" @ok="query">
        <view slot="pre">
          <text>{{ filtrateNum }}</text>
        </view>
        <view class="top-search-view">
          <!-- <view class="select-view">
            <selectView :value="deviceSort.label" hint="设备类别" @clickSelect="showPick('deviceSort')" />
          </view> -->
          <view class="select-view">
            <selectView :value="typeObj.label" hint="设备类型" @clickSelect="showPick('typeObj')" />
          </view>
          <view class="select-view">
            <selectView :value="heightObj.label" hint="高度" @clickSelect="showPick('height')" />
          </view>
          <view class="select-view">
            <selectView :value="rentalState.label" hint="租赁状态" @clickSelect="showPick('state')" />
          </view>
          <!-- <view class="select-view">
            <selectView :value="errStateObj.label" hint="故障状态" @clickSelect="showPick('errState')" />
          </view> -->
          <view class="select-view">
            <selectView :value="outlineObj.label" hint="离线状态" @clickSelect="showPick('outline')" />
          </view>
          <view class="select-view">
            <selectView :value="lockObj.label" hint="锁机状态" @clickSelect="showPick('lock')" />
          </view>
          <view class="select-view">
            <selectView :value="batteryObj.label" hint="电量状态" @clickSelect="showPick('battery')" />
          </view>
          <view class="select-view">
            <selectView :value="sortObj.label" hint="排序" @clickSelect="showPick('sortType')" />
          </view>
          <view class="select-view">
            <selectView :value="offlineHoursObj.label" hint="离线情况" @clickSelect="showPick('offlineHours')" />
          </view>
          <view class="select-view">
            <selectView :value="lowPowerHoursObj.label" hint="低电量情况" @clickSelect="showPick('lowPowerHours')" />
          </view>
          <view class="select-view">
            <selectView :value="lastCloseDaysObj.label" hint="关机情况" @clickSelect="showPick('lastCloseDays')" />
          </view>
        </view>
      </c-search-bar>
    </view>
    <!-- 筛选占位 -->
    <!-- <view class="filtrate-top-zw">
			<view class="top-search-view">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="自喷码/车号/品牌/型号" v-model="keyWord" />
					</view>
				</view>
				<view class="right-filtter-btn" @click="filtterShow">{{'筛选'}}</view>
			</view>
		</view> -->
    <view class="list-med" show-scrollbar="false">
      <view v-for="(item, index) in datalist" :key="index">
        <!-- @click.stop="gotoVC(item, 'detail')" -->
        <view class="cell-bg-view" @click.stop="gotoVC(item, 'detail')">
          <monitorListHead :dataDic="item" />
          <view class="cell-warning-row" v-if="item.warningFlag">
            <i class="iconfont iconzl--guzhang"></i>
            <text style="margin-left: 5px">{{ getWarning(item) }}</text>
          </view>
          <view class="cell-item-bg">
            <view class="flex" v-if="item.isSanyMachine">
              <view class="flex flex-sub">
                <text class="text-gray">{{
                  oilMachine.includes(item.machineTypeName) ? "油量" : "电量"
                }}状态：</text>
                <text>正常</text>
              </view>
              <view class="flex flex-sub">
                <text class="text-gray">{{
                  oilMachine.includes(item.machineTypeName) ? "油量" : "电量"
                }}：</text>
                <text :class="[powerClass(item.batteryPower)]">{{ item.batteryPower }}%</text>
              </view>
            </view>
            <view class="cell-line-row" :style="{ 'align-items': !item.isSanyMachine ? 'flex-start' : 'center' }">
              <view class="cell-line-tag">定位:</view>
              <view class="cell-line-value">{{ item.address || "--" }}</view>
            </view>
            <view class="cell-line-row">
              <view class="cell-line-tag">定位时间:</view>
              <view class="cell-line-value">{{ item.locateDate || "--" }}</view>
            </view>
          </view>

          <view class="bottom-btns-view row-line-between">
            <view>
              <!-- 工作状态 -->
              <block v-if="!item.offlineMode">
                <block v-if="item.accStatus == '0'">
                  <view class="cell-line-tag row-line text-warn">
                    <i class="iconfont iconprocess-full"></i><text style="margin-left: 4px; font-size: 12px">关机</text>
                  </view>
                </block>
                <block v-else>
                  <view class="cell-line-tag row-line" style="color: #52c41a">
                    <i class="iconfont iconprocess-full"></i>
                    <text style="margin-left: 4px; font-size: 12px">开机</text>
                  </view>
                </block>
              </block>
              <block v-else>
                <view class="cell-line-tag row-line" style="color: #8c8c8c">
                  <i class="iconfont iconlixian"></i>
                  <text style="margin-left: 4px; font-size: 12px">离线</text>
                </view>
              </block>
            </view>
            <view class="row-line"  style="min-width: 150px; justify-content: flex-end">
              <view class="tag-btns-view" @click.stop="share(item)">分享</view>
              <view class="tag-btns-view" v-if="item.lowPowerHours>=720" @click.stop="goLowerPowerVoiceRemider(item)">{{
                "语音提醒"
              }}</view>
              <view class="tag-btns-view" @click.stop="gotoVC(item, 'more')">{{
                "更多"
              }}</view>
              <!-- <view v-if="item.isSanyMachine" class="tag-btns-view" @click.stop="gotoVC(item, 'detail')">{{ "详情" }}</view> -->
            </view>
          </view>
        </view>
      </view>
      <view>
        <view><uni-load-more iconType="auto" :status="morestatus" /></view>
      </view>
    </view>
    <device-share ref="share" :d="curDevice"></device-share>
    <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import DeviceShare from "@/devicePages/components/device-share.vue";
import monitorListHead from "./monitor-list-head.vue";
import { isSanyMachine } from "@/common/util/util.js";
import { mapState } from "vuex";
let timer;
export default {
  components: {
    uniLoadMore,
    filterView,
    wPicker,
    selectView,
    monitorListHead,
    DeviceShare,
  },
  data() {
    return {
      curDevice:null,
      filtrateNum: "0台",
      isfiltrate: false,
      datalist: [],
      //上拉下拉
      morestatus: "more",
      page: 1,
      keyWord: "",
      filterDic: {},
      deviceSort: {
        value: "1", //默认高空车，暂时只有高空车能监控
      },
      oilMachine: this.$store.state.machine.oilMachine,
      heightObj: {},
      heightList: [],
      deviceSorts: [],
      pickType: "",
      selectList: [],
      isShowSelect: false,
      isExportList: true,
      totalCount: "100",
      typeList: [],
      typeObj: {},
      rentalState: {},
      rentalStateList: [],
      errStateObj: {},
      errStateList: [
        { label: "无故障", value: false },
        { label: "有故障", value: true },
      ],
      outlineObj: {},
      outlineList: [
        { label: "在线", value: false },
        { label: "离线", value: true },
      ],
      lockObj: {},
      lockList: [
        { label: "未锁", value: 4 },
        { label: "已锁", value: 3 },
      ],
      batteryObj: {},
      batteryList: [
        { label: "0-20%", value: "0-20" },
        { label: "21%-40%", value: "21-40" },
        { label: "41%-100%", value: "41-100" },
      ],
      sortObj: {},
      sortList: [
        { label: "电量由高到低", value: "battery_power desc" },
        { label: "电量由低到高", value: "battery_power asc" },
        { label: "离线时长高到低", value: "offline_hours desc" },
        { label: "离线时长低到高", value: "offline_hours asc" },
      ],
      offlineHoursObj: {},
      offlineHoursList: [
        { label: "离线超30天", value: "720" },
        { label: "离线超60天", value: "1440" },
        { label: "离线超90天", value: "2160" },
      ],
      lowPowerHoursObj: {},
      lowPowerDaysList: [
        { label: "低电量超30天", value: "720" },
        { label: "低电量超60天", value: "1440" },
        { label: "低电量超90天", value: "2160" },
      ],
      lastCloseDaysObj: {},
      lastCloseDaysList: [
        { label: "关机超30天", value: "30" },
        { label: "关机超60天", value: "60" },
        { label: "关机超90天", value: "90" },
      ],
    };
  },
  onLoad() {
    uni.showLoading();
    this.getNetData();
    // this.getDeviceType();
    this.loadType();
    this.loadrental();
    this.getHeightList();
    // 监听事件
    uni.$on("filtrate-monitor", (usnerinfo) => {
      this.filterDic = usnerinfo;
      this.page = 1;
      this.datalist = [];
      this.getNetData();
    });
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Device_Administrative,
      "设备监控",
      "列表"
    );
  },
  onUnload() {
    // 取消监听事
    uni.$off("filtrate-monitor");
  },
  computed: {
    ...mapState("system", ["navBarHeight"]),
  },
  onNavigationBarButtonTap(e) {
    if (this.isExportList) {
      this.exportExcel();
    } else {
      uni.showToast({
        title: "暂无权限",
        icon: "none",
      });
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.datalist = [];
    this.getNetData();
  },
  //上拉加载
  onReachBottom() {
    if (this.morestatus == "noMore") {
      return;
    }
    this.page += 1;
    this.getNetData();
    this.morestatus = "loading";
  },
  methods: {
    searchChange(val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.keyWord = val;
        this.query();
      }, 500);
    },
    share(item){
      this.curDevice = item
      this.$nextTick((_) => this.$refs.share.share());
    },
    goLowerPowerVoiceRemider(item){
					let url= '/devicePages/monitor/components/low-battery-voice-reminder?item='+encodeURIComponent(JSON.stringify(item));
          uni.navigateTo({
											url: url
										});
          console.log(item,'goLowerPowerVoiceRemider');
    },
    powerClass(batteryPower) {
      if (batteryPower >= 0 && batteryPower <= 20) {
        return "text-error";
      } else if (batteryPower > 20 && batteryPower <= 40) {
        return "text-warn";
      } else {
        return "text-success";
      }
    },
    getWarningDesc(warningData) {
      if (warningData && warningData.length > 0) {
        let list = warningData.map((o) => {
          return o.description;
        });
        return list.join(";");
      }
      return "--";
    },
    filtterShow() {
      this.isShowSelect = !this.isShowSelect;
    },
    exportExcel(item) {
      let param = {
        current: 1,
        size: this.totalCount,
        keyword: this.keyWord,
        state:
          this.rentalState && this.rentalState.value !== ""
            ? this.rentalState.value
            : undefined,
        malfunction:
          this.errStateObj && this.errStateObj.value !== ""
            ? this.errStateObj.value
            : undefined,
        offline:
          this.outlineObj && this.outlineObj.value !== ""
            ? this.outlineObj.value
            : undefined,
        // earlyWarning: this.filterDic.warningIndex && this.filterDic.warningIndex.id != -1 ? this.filterDic.warningIndex.dictid :
        // 	undefined,
        deviceType:
          this.deviceSort && this.deviceSort.value ? this.deviceSort.value : undefined,
      };
      let url = this.$url.BASE_URL + this.$url.MAINTAIN_LIST + "?isExport=true";
      this.$gxfmethod.downFunc(url, "POST", param, undefined);
      // let url= this.$url.MAINTAIN_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)
      // this.$datestr.downFunc(downurl)
    },
    query() {
      uni.showLoading();
      this.page = 1;
      this.datalist = [];
      this.getNetData();
      // uni.navigateTo({
      // 	url: './monitor-filtrate?item=' + encodeURIComponent(JSON.stringify(this.filterDic))
      // });
    },
    loadrental() {
      this.$network
        .loadUserType("rental_status")
        .then((result) => {
          this.rentalStateList = result ? result : [];
        })
        .catch((err) => { });
    },
    //跳入详情页
    gotoVC(item, type) {
      if (type == "detail") {
        uni.navigateTo({
          url:
            "/devicePages/monitor/device-monitor-detail?licenseId=" +
            item.licenseId +
            "&deviceNum=" +
            item.deviceNum,
        });
      } else {
        uni.navigateTo({
          url: "/pages/main/machine-scan-home?licenseId=" + item.licenseId,
        });
      }
    },
    reset() {
      this.keyWord = "";
      this.deviceSort = {};
      this.typeObj = {};
      this.heightObj = {};
      this.rentalState = {};
      this.errStateObj = {};
      this.outlineObj = {};
      this.lockObj = {};
      this.batteryObj = {};
      this.sortObj = {};
      this.offlineHoursObj = {};
      this.lowPowerHoursObj = {};
      this.lastCloseDaysObj = {};
      this.query()
    },
    //获取网络数据
    getNetData() {
      let parame = {
        current: this.page,
        size: 5,
        keyword: this.keyWord ? this.keyWord : undefined,
        state:
          this.rentalState && this.rentalState.value !== ""
            ? this.rentalState.value
            : undefined,
        malfunction:
          this.errStateObj && this.errStateObj.value !== ""
            ? this.errStateObj.value
            : undefined,
        offline:
          this.outlineObj && this.outlineObj.value !== ""
            ? this.outlineObj.value
            : undefined,
        lockType:
          this.lockObj && this.lockObj.value !== "" ? this.lockObj.value : undefined,
        currentBatteryPower:
          this.batteryObj && this.batteryObj.value !== ""
            ? this.batteryObj.value
            : undefined,
        pageSort:
          this.sortObj && this.sortObj.value !== "" ? this.sortObj.value : undefined,
      };
      if (this.deviceSort && this.deviceSort.value) {
        parame.deviceType = this.deviceSort.value;
      }
      if (this.typeObj && this.typeObj.value) {
        parame.type = this.typeObj.value;
      }
      if (this.heightObj && this.heightObj.value) {
        parame.height = this.heightObj.value;
      }
      if (this.offlineHoursObj && this.offlineHoursObj.value) {
        parame.offlineHours = this.offlineHoursObj.value;
      }
      if (this.lowPowerHoursObj && this.lowPowerHoursObj.value) {
        parame.lowPowerHours = this.lowPowerHoursObj.value;
      }
      if (this.lastCloseDaysObj && this.lastCloseDaysObj.value) {
        parame.lastCloseDays = this.lastCloseDaysObj.value;
      }
      this.$network
        .getData(this.$url.MACHINE_MONITOR, "POST", parame)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          for (let i = 0; i < this.datalist.length; i++) {
            if (isSanyMachine(this.datalist[i].licenseId)) {
              this.$set(this.datalist[i], "isSanyMachine", true);
            } else {
              this.$set(this.datalist[i], "isSanyMachine", false);
            }
          }
          let pages = result.pages;
          let total = result.total;
          this.filtrateNum = total + "台";
          this.totalCount = result.total.toString();
          if (pages == this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    showPick(type) {
      this.pickType = type;
      switch (type) {
        case "deviceSort":
          this.selectList = this.deviceSorts ? this.deviceSorts : [];
          break;
        case "height":
          this.selectList = this.heightList ? this.heightList : [];
          break;

        case "typeObj":
          this.selectList = this.typeList ? this.typeList : [];
          break;
        case "state":
          this.selectList = this.rentalStateList ? this.rentalStateList : [];
          break;
        case "errState":
          this.selectList = this.errStateList ? this.errStateList : [];
          break;
        case "outline":
          this.selectList = this.outlineList ? this.outlineList : [];
          break;
        case "lock":
          this.selectList = this.lockList || [];
          break;
        case "battery":
          this.selectList = this.batteryList || [];
          break;
        case "sortType":
          this.selectList = this.sortList || [];
          break;
        case "offlineHours":
          this.selectList = this.offlineHoursList || [];
          break;
        case "lowPowerHours":
          this.selectList = this.lowPowerDaysList || [];
          break;
        case "lastCloseDays":
          this.selectList = this.lastCloseDaysList || [];
          break;
        default:
          break;
      }
      this.$refs.selector.show();
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "deviceSort":
          this.deviceSort = val.checkArr;
          this.typeObj = {};
          this.heightObj = {};
          this.loadType();
          this.getHeightList();
          break;
        case "typeObj":
          this.typeObj = val.checkArr;
          this.heightObj = {};
          this.getHeightList();
          break;
        case "height":
          this.heightObj = val.checkArr;
          break;
        case "state":
          this.rentalState = val.checkArr;
          break;
        case "errState":
          this.errStateObj = val.checkArr;
          break;
        case "outline":
          this.outlineObj = val.checkArr;
          break;
        case "lock":
          this.lockObj = val.checkArr;
          break;
        case "battery":
          this.batteryObj = val.checkArr;
          break;
        case "sortType":
          this.sortObj = val.checkArr;
          break;
        case "offlineHours":
          this.offlineHoursObj = val.checkArr;
          break;
        case "lowPowerHours":
          this.lowPowerHoursObj = val.checkArr;
          break;
        case "lastCloseDays":
          this.lastCloseDaysObj = val.checkArr;
          break;
        default:
          break;
      }
    },
    getDeviceType() {
      let param = {
        source: "device_type",
      };
      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.deviceSorts = [];
          this.deviceSorts.push({
            label: "全部类别",
            value: "",
          });
          this.deviceSorts = this.deviceSorts.concat(
            result
              ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
              : []
          );
        })
        .catch((err) => { });
    },
    //设备类型
    loadType() {
      let param = {
        source: "machine_type",
      };
      if (this.deviceSort && this.deviceSort.value) {
        param = {
          ...param,
          device_type: this.deviceSort.value, //设备类别
        };
      }
      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.typeList = [];
          this.typeList.push({
            label: "全部类型",
            value: "",
          });
          this.typeList = this.typeList.concat(
            result
              ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
              : []
          );
        })
        .catch((err) => { });
    },
    getHeightList() {
      let param = {
        source: "machine_height",
      };
      if (this.deviceSort && this.deviceSort.value) {
        param = {
          ...param,
          device_type: this.deviceSort.value, //设备类别
        };
      }
      if (this.typeObj && this.typeObj.value) {
        param = {
          ...param,
          machine_type: this.typeObj.value,
        };
      }
      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.heightList = [];
          this.heightList.push({
            label: "全部高度",
            value: "",
          });
          this.heightList = this.heightList.concat(
            result
              ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
              : []
          );
        })
        .catch((err) => { });
    },
    getWarning(item) {
      if (item.warningFlag && item.warningData && item.warningData != null) {
        let warningData = item.warningData;
        return warningData.action + "," + warningData.description;
      } else {
        return "未知故障,故障码:" + item.warningCode;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentbg {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.list-med {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: $uni-bg-color-grey;
}

.cell-bg-view {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin: 8px 8px 0px 8px;
  border-radius: 8px;
  padding: 8px;
}

.cell-item-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 0px 5px 0px 5px;
  padding: 10px 5px;
  justify-content: flex-start;
  background: rgba(240, 242, 244, 0.7);
  border-radius: 10px;
  margin-top: 10px;
}

.cell-line-tag {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
  margin-right: 5px;
  min-width: 40px;
}

.cell-line-row {
  display: flex;
  width: 100%;
  padding: 2px 0px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cell-warning-row {
  display: flex;
  margin-top: 10px;
  padding: 4px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ff0000;
  font-size: $uni-font-size-base;
}

.cell-line-value {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

//搜索框
.filtrate-top {
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  z-index: 100;
}

.filtrate-top-zw {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  z-index: 0;
}

.filtrate-top-left {
  margin-left: 10px;
  color: #1890ff;
  font-size: 14px;
}

.top-search-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ffffff;
}

.search-box {
  display: flex;
  background: #f7f7f7;
  margin: 10px 0px 10px 10px;
  flex: 1;
  flex-direction: row;
  padding: 8px 10px 8px 10px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  display: flex;
  flex: 2;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}

.fixed-search-view {
  position: fixed;
  top: 0px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  background: #ffffff;
  justify-content: center;
  align-items: center;
  z-index: 200;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
}

.filter-view {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e60000;
  color: #ffffff;
  padding: 8px 0px;
  flex: 1;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
  margin-right: 10px;
}

.reset-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $uni-bg-color-grey;
  color: $uni-text-color;
  padding: 8px 0px;
  flex: 1;
  border-radius: 4px;
  text-align: center;
  font-size: $uni-font-size-base;
  margin-right: 10px;
  margin-left: 10px;
}

.select-view {
  margin-top: 5px;
  width: 30%;
  margin-top: 5px;
  margin-left: calc(10% / 4);
}

.right-filtter-btn {
  display: flex;
  margin: 0px 10px;
  padding: 6px 10px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #222222;
  // margin-right: 5px;
  // color: $uni-color-primary;
  // border: $uni-color-primary 1px solid;
}

.bottom-btns-view {
  display: flex;
  flex-direction: row;
  padding: 10px 0px 0px 10px;
}

.tag-btns-view {
  padding: 3px 15px;
  border-radius: 50px;
  border: $uni-color-primary 1px solid;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}
</style>
