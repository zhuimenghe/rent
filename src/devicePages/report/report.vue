<template>
  <view class="report">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top">
      <view class="title">
        <p>报告日期：{{ lastDay }}</p>
        <view class="download" @click="download">
          <p class="iconfont iconxiazai2"></p>
          <p>下载</p>
        </view>
      </view>
      <view class="top_body">
        <view class="box">
          <image src="../../static/shigongdian.png" />

          <p>
            <span style="color: #222222; font-size: 18px; font-weight: 600">{{
              constructionSitesList.totalSite || 0
            }}</span
            ><span style="color: #666666">施工点</span>
          </p>
          <p>
            <span style="color: #222222; font-size: 18px; font-weight: 600">{{
              constructionSitesList.totalMachine || 0
            }}</span
            ><span style="color: #666666">设备数量</span>
          </p>
        </view>
        <view class="box">
          <image src="../../static/cangku.png" />
          <p>
            <span style="color: #222222; font-size: 18px; font-weight: 600">{{
              home.homeCount
            }}</span
            ><span style="color: #666666">仓库</span>
          </p>
          <p>
            <span style="color: #222222; font-size: 18px; font-weight: 600">{{
              home.homeMachineCount
            }}</span>
            <span style="color: #666666">设备数量</span>
          </p>
        </view>
      </view>
    </view>
    <view class="construction">
      <p class="title">
        <span class="line"></span>施工点
        <span style="margin-left: 5px; color: #e60000"
          >（{{
            constructionSitesList.sites.length
              ? constructionSitesList.sites.length
              : 0
          }}）</span
        >
      </p>
      <view class="constructionList">
        <more-list
          empty-text="暂无数据"
          :list="constructionSitesList.sites"
          :minSize="3"
        >
          <block slot="list" slot-scope="{ list }">
            <navigator
              class="lowBatteryCard"
              v-for="(item, i) in list"
              :key="i"
              :url="`/devicePages/gps/constructionDetail?address=${
                item.address
              }&isHistory=${false}&dateRange=${dateBegan(item.dateRange)}`"
            >
              <view class="flex row">
                <span class="iconfont iconshengfenzuobiao_mianxing"></span>
                <p class="_title" style="margin-left: 5px">
                  {{ item.address }}
                </p>
              </view>
              <view class="flexBewteen row">
                <span class="gray"
                  >施工开始时间：{{ dateBegan(item.dateRange) }}</span
                >
                <!-- <span style="color: #fe931f"
                  >入场{{ item.noSettleDay }}天未结算</span
                > -->
              </view>
              <view class="flex row">
                <span class="gray"
                  >施工设备：{{ getMap(item.machineMap) }}</span
                >
              </view>
            </navigator>
          </block>
        </more-list>
      </view>
    </view>
    <view class="construction">
      <p class="title">
        <span class="line"></span>低电量设备
        <span style="margin-left: 5px; color: #e60000"
          >（{{ lowBatteryList.length ? lowBatteryList.length : 0 }}）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="lowBatteryList" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <navigator
            class="lowBatteryCard"
            v-for="(item, i) in list"
            :key="i"
            :url="`/devicePages/monitor/device-monitor-detail?licenseId=${item.licenseId}&deviceNum=${item.deviceNum}`"
          >
            <view class="flex row">
              <p style="font-size: 14px; font-weight: 600">
                {{ item.licenseId }}
              </p>
              <p class="_state" :style="{ backgroundColor: item._color }">
                {{ item.stateName }}
              </p>
              <p class="_state" :style="{ backgroundColor: item.color }">
                {{ item._state }}
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                {{ item.machineTypeDesc }}|{{ item.machineHeightDesc }}|{{
                  item.machineBrand
                }}|{{ item.machineTypeName }}
              </p>
              <p style="color: #222222">
                {{ item._state == "开机" ? "电量：" : "预计电量："
                }}{{ item.bePower }}%
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                <span
                  class="iconfont iconshijian"
                  style="margin-right: 5px"
                ></span
                >最后回传时间：{{ item.lastDataUploadTime }}
              </p>
              <p style="color: #222222" v-show="item._state != '开机'">
                {{ item._state == "离线" ? "离线时长：" : "关机时长："
                }}{{ item.days }}天
              </p>
            </view>
            <view class="flex row gray">
              <p>
                <span
                  class="iconfont icondingwei3"
                  style="margin-right: 5px"
                ></span
                >{{ item.address }}
              </p>
            </view>
          </navigator>
        </block>
      </more-list>
    </view>
    <view class="construction">
      <p class="title">
        <span class="line"></span>待充电设备
        <span style="margin-left: 5px; color: #e60000"
          >（{{ assoiList.length ? assoiList.length : 0 }}）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="assoiList" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <navigator
            class="lowBatteryCard"
            v-for="(item, i) in list"
            :key="i"
            :url="`/devicePages/monitor/device-monitor-detail?licenseId=${item.licenseId}&deviceNum=${item.deviceNum}`"
          >
            <view class="flex row">
              <p style="font-size: 14px; font-weight: 600">
                {{ item.licenseId }}
              </p>
              <p class="_state" :style="{ backgroundColor: item._color }">
                {{ item.stateName }}
              </p>
              <p class="_state" :style="{ backgroundColor: item.color }">
                {{ item._state }}
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                {{ item.machineTypeDesc }}|{{ item.machineHeightDesc }}|{{
                  item.machineBrand
                }}|{{ item.machineTypeName }}
              </p>
              <p style="color: #222222">
                {{ item._state == "开机" ? "电量：" : "预计电量："
                }}{{ item.bePower }}%
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                <span
                  class="iconfont iconshijian"
                  style="margin-right: 5px"
                ></span
                >最后回传时间：{{ item.lastDataUploadTime }}
              </p>
              <p style="color: #222222" v-show="item._state != '开机'">
                日均耗电：{{ item.avgBatteryLevel }}%
              </p>
            </view>
            <view class="flex row gray">
              <p>
                <span
                  class="iconfont icondingwei3"
                  style="margin-right: 5px"
                ></span
                >{{ item.address }}
              </p>
            </view>
          </navigator>
        </block>
      </more-list>
    </view>
  </view>
</template>
<script>
import differenceInDays from "date-fns/differenceInDays";
import parseISO from "date-fns/parseISO";
import subDays from "date-fns/subDays";
import format from "date-fns/format";
import MoreList from "../moreList.vue";
export default {
  name: "deviceBaseInfo",
  components: {
    MoreList,
  },
  data() {
    return {
      lowBatteryList: [],
      assoiList: [],
      lastDay: "",
      constructionSitesList: {},
      home: {},
      isShowMore: false,
    };
  },

  onLoad() {
    this.getLowBatteryList();
    this.getConstructionSitesList();
    this.getHome();
    this.lastDay = format(subDays(new Date(), 1), "yyyy-MM-dd");
  },
  computed: {},
  methods: {
    async getLowBatteryList() {
      let res = await this.$network.lowPower();
      let res1 = await this.$network.chargePower();
      let machineList = [];
      this.lowBatteryList = [...res, ...res1];
      this.lowBatteryList.map((e) => {
        let today = new Date().getTime();
        e.days = differenceInDays(
          today,
          parseISO(e.lastDataUploadTime).getTime()
        );
        if (e.accStatus == 0 && e.offlineMode == false) {
          e._state = "关机";
          e.color = "#1278FF";
        } else if (e.accStatus == 1 && e.offlineMode == false) {
          e._state = "开机";
          e.color = "#52C41A";
        } else if (e.offlineMode == true) {
          e._state = "离线";
          e.color = "#BBBBBB";
        }
        if (e.state == "1") {
          e.stateName = "待租";
          e._color = "#FE931F";
        } else {
          e.stateName = "在租";
          e._color = "#52C41A";
        }
        machineList.push(e.licenseId);
      });
      this.assoi(machineList);
    },
    getConstructionSitesList() {
      this.$network.constructionSites(false).then((res) => {
        this.constructionSitesList = res;
      });
    },
    async getHome() {
      this.home = await this.$network.monitorHome();
      console.log(this.home);
    },
    assoi(machineList) {
      console.log(machineList);
      this.$network.assoi(machineList).then((res) => {
        this.assoiList = res;
        this.assoiList.map((e) => {
          let today = new Date().getTime();
          e.days = differenceInDays(
            today,
            parseISO(e.lastDataUploadTime).getTime()
          );
          if (e.accStatus == 0 && e.offlineMode == false) {
            e._state = "关机";
            e.color = "#1278FF";
          } else if (e.accStatus == 1 && e.offlineMode == false) {
            e._state = "开机";
            e.color = "#52C41A";
          } else if (e.offlineMode == true) {
            e._state = "离线";
            e.color = "#BBBBBB";
          }
          if (e.state == "1") {
            e.stateName = "待租";
            e._color = "#FE931F";
          } else {
            e.stateName = "在租";
            e._color = "#52C41A";
          }
        });
      });
    },
    download() {
      let url = this.$url.BASE_URL + "machineapi/api/machine/monitor/pdf";
      let headerDic = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      let loginMes = uni.getStorageSync("loginMesage");
      if (loginMes) {
        let access_token = loginMes.token_type + " " + loginMes.access_token;
        headerDic.Authorization = access_token;
      }
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      console.log(url, "1234");
      uni.downloadFile({
        url: url,
        header: headerDic,
        success: function (res) {
          var filePath = res.tempFilePath;
          console.log(filePath, "filePath");
          uni.openDocument({
            filePath: filePath,
            fileType: "pdf",
            showMenu: true,
            success: function (res) {
              console.log("打开文档成功");
            },
            fail: function (err) {
              console.log(err, "err");
            },
          });
        },
        complete() {
          uni.hideLoading();
          console.log("111");
        },
        fail: function () {},
      });
    },
    gotoMachineDetail(item) {
      uni.navigateTo({
        url: `/devicePages/monitor/device-monitor-detail?licenseId=${item.licenseId}&deviceNum=${item.deviceNum}`,
      });
    },
    gotoConstruction(address, isHistory) {
      uni.navigateTo({
        url: `/devicePages/gps/constructionDetail?address=${address}&isHistory=${isHistory}`,
      });
    },
    getMap(item) {
      let str = "";
      for (const key in item) {
        str += key + item[key] + "|";
      }
      str = str.slice(0, -1);
      return str;
    },
    dateBegan(item) {
      return item.slice(0, item.length - 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}
.top {
  padding: 12px;
  background-color: #fff;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 18px;
      font-weight: 600;
      color: #181818;
    }
    .download {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 63px;
      height: 32px;
      background: rgba(230, 0, 0, 0.1);
      border-radius: 6px;
      border: 1px solid #e60000;
      color: #e60000;
      p {
        height: 20px;
        line-height: 20px;
        font-size: 14px !important;
        color: #e60000;
      }
    }
  }
  .top_body {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    .box {
      width: 168px;
      height: 67px;
      background: #ffffff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      p {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      image {
        width: 40px;
        height: 40px;
      }
    }
  }
}
.construction {
  background-color: #fff;
  margin: 10px 0;
  font-size: 12px;
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    margin: 8px 0;
    padding: 10px 0;
    display: flex;
    align-items: center;
    .line {
      display: block;
      width: 2px;
      height: 80%;
      background-color: #e60000;
      margin-right: 10px;
    }
  }
  .constructionCard {
  }
  .lowBatteryCard {
    padding: 0 10px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  ._state {
    width: 34px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    background: #52c41a;
    border-radius: 2px;
    margin-left: 6px;
    color: #fff;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.flexBewteen {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row {
  margin: 4px 0;
}
.gray {
  color: #8c8c8c;
}
.iconshengfenzuobiao_mianxing {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(230, 0, 0, 0.1);
  color: #e60000;
  text-align: center;
  line-height: 20px;
}

._title {
  font-size: 14px;
  font-weight: 600;
}

.more-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  background: #ffffff;
  margin-right: 4px;
  border: 1px solid #999999;
  border-radius: 4px;
  font-size: $uni-font-size-base;
  color: #999999;
}
</style>
