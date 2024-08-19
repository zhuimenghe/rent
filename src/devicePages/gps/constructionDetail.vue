<template>
  <view class="report">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top">
      <view class="flex row">
        <span class="iconfont iconshengfenzuobiao_mianxing"></span>
        <p class="_title" style="margin-left: 5px">{{ address }}</p>
      </view>
      <view class="top_body">
        <view class="content">
          <view class="top">
            <p>施工开始时间：{{ dateRange }}</p>
            <p>当前设备数量：{{ machineNum }}</p>
            <p>
              预计营收：¥<span>{{ money(predict) }}</span>
            </p>
            <p>
              结算：¥<span>{{ money(settleTotal) }}</span>
            </p></view
          >
          <view class="flexStart">
            <p style="white-space: nowrap">合同联系人：</p>

            <p class="preWarp">{{ phoneMapStr==''?'-':phoneMapStr }}</p>
          </view>
        </view>
      </view>
    </view>
    <view class="machineList">
      <p class="title">
        <span class="line"></span>未结算设备
        <span style="margin-left: 5px; color: #e60000"
          >（{{ machineListUnSettle.length }}）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="machineListUnSettle" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <view class="machineCard" v-for="(item, index) in list" :key="index">
            <view class="head" @click="gotoDetail(1, item)">
              <view class="left">
                <i
                  class="iconfont icon-view"
                  :class="
                    item.machineTypeName
                      ? deviceIcon[item.machineTypeName]
                      : 'iconzl--jianchache1'
                  "
                ></i>
              </view>

              <view class="right">
                <view class="flexBewteen">
                  <p class="_title">{{ item.serialNo }}</p>
                  <span class="red"
                    >预计营收：¥{{ money(item.allSettleMoney) }}</span
                  >
                </view>

                <p class="gray">
                  <span class="mr5">{{ item.machineTypeName }}</span> |
                  <span class="ml5 mr5">{{ item.height }}</span
                  >|
                  <span class="ml5 mr5"> {{ item.brand }}</span>
                  |
                  <span class="ml5 mr5">{{ item.machineType }}</span>
                  |
                  <span class="ml5"> {{ item.driverTypeName }}</span>
                </p>
                <p class="gray">施工开始时间：{{ item.startDate }}</p>
              </view>
            </view>
          </view>
        </block>
      </more-list>
    </view>
    <view class="machineList">
      <p class="title">
        <span class="line"></span>已结算、未结清设备
        <span style="margin-left: 5px; color: #e60000"
          >（{{ machineListIsSettle.length }}）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="machineListIsSettle" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <view class="machineCard" v-for="(item, index) in list" :key="index">
            <view
              class="head"
              style="
                padding-bottom: 10px;
                border-bottom: 1px dashed #e6e6e6;
                margin-bottom: 10px;
              "
              @click="gotoDetail(1, item)"
            >
              <view class="left">
                <i
                  class="iconfont icon-view"
                  :class="
                    item.machineTypeName
                      ? deviceIcon[item.machineTypeName]
                      : 'iconzl--jianchache1'
                  "
                ></i>
              </view>

              <view class="right">
                <p class="_title flexBewteen">
                  <span>{{ item.serialNo }}</span>
                  <span style="color: #e60000; font-weight: 500">
                    未结清预计：{{ money(item.allSettleMoney) }}</span
                  >
                </p>
                <p class="gray">
                  <span class="mr5">{{ item.machineTypeName }}</span> |
                  <span class="ml5 mr5">{{ item.height }}</span
                  >|
                  <span class="ml5 mr5"> {{ item.brand }}</span>
                  |
                  <span class="ml5 mr5">{{ item.machineType }}</span>
                  |
                  <span class="ml5"> {{ item.driverTypeName }}</span>
                </p>
                <p class="gray">施工开始时间：{{ item.startDate }}</p>
              </view>
            </view>
            <view
              v-show="item.contracts.length > 0"
              class="contract"
              @click="gotoDetail(2, contracts.contractNo)"
              v-for="contracts in item.contracts"
              :key="contracts.contractNo"
            >
              <view class="first _title">
                <span class="_title">关联合同：</span>
                <view class="contractList">
                  <p>
                    {{ contracts.projectName }}
                  </p>
                </view>
              </view>
              <view class="second gray">
                <span>业务负责人：</span>
                {{ contracts.customerSalesmanName }}(
                {{
                  contracts.customerSalesmanPhone
                    ? contracts.customerSalesmanPhone
                    : "-"
                }})
              </view>

              <view class="settle">
                <view v-for="(settle, i) in contracts.settlements" :key="i">
                  <p>
                    结算周期：{{ dateSlice(settle.beginDate) }}~{{
                      dateSlice(settle.endDate)
                    }}
                  </p>
                  <p>
                    设备小计：¥
                    <span style="color: #e60000">{{
                      money(settle.total)
                    }}</span>
                  </p>
                </view>
              </view>
            </view>
          </view>
        </block>
      </more-list>
    </view>
    <calendar
      class="calendar"
      ref="ren"
      :markDays="markDays"
      :open="true"
      :disabledAfter="true"
      @getMon="getMon"
      @onDayClick="onDayClick"
    ></calendar>
    <view class="dayDataList">
      <p class="title">
        <view class="title"> <span class="line"></span>{{ this.curDate }}</view>

        <span style="float: right; margin-right: 10px"
          >入库{{
            dayMachineList.workInCount ? dayMachineList.workInCount : 0
          }}台、出库{{
            dayMachineList.workOutCount ? dayMachineList.workOutCount : 0
          }}台</span
        >
      </p>
      <more-list
        empty-text="暂无数据"
        :list="dayMachineList.machineList"
        :minSize="3"
      >
        <block slot="list" slot-scope="{ list }">
          <view class="machineCard" v-for="(item, index) in list" :key="index">
            <view class="head" @click="gotoDetail(1, item)">
              <view class="left">
                <i
                  class="iconfont"
                  :class="item.status == 0 ? 'iconwupinruku' : 'iconwupinchuku'"
                ></i>
              </view>

              <view class="right">
                <view class="flexBewteen">
                  <p class="_title">{{ item.serialNo }}</p>
                </view>

                <p class="gray">
                  <span class="mr5">{{ item.machineTypeName }}</span> |
                  <span class="ml5 mr5">{{ item.height }}</span
                  >|
                  <span class="ml5 mr5"> {{ item.brand }}</span>
                  |
                  <span class="ml5 mr5">{{ item.machineType }}</span>
                </p>
              </view>
            </view>
          </view>
        </block>
      </more-list>
    </view>

    <view class="bottom"></view>
    <view class="flow total">
      <view class="total">
        <span
          >未结算 <span class="red">{{ machineListUnSettle.length }}</span
          >台，预计营收：<span class="red">¥{{ totalMoney }}</span>
        </span>
        <view class="btn" @click="settle()"><text>快捷结算</text></view>
      </view>
    </view>
  </view>
</template>
<script>
import MoreList from "../moreList.vue";
import Calendar from "./calendar.vue";
export default {
  name: "deviceBaseInfo",
  components: {
    MoreList,
    Calendar,
  },
  data() {
    return {
      address: "",
      deviceIcon: {
        自行直臂式: "iconzl--zhibiche",
        自行曲臂式: "iconzl--jianchache",
        自行剪叉式: "iconzl--jianchache1",
      },
      machineNum: 0,
      machineListIsSettle: [],
      machineListUnSettle: [],
      dict: [],
      dateRange: "",
      curDate: "",
      markDays: [],
      dayMachineList: [],
      settleTotal: 0,
      predict: 0,
      contactPhoneMap: {},
      phoneMapStr: "",
    };
  },

  onReady() {},
  onLoad(option) {
    uni.setStorageSync("gps_machineList", {});
    if (option.address) {
      uni.setStorageSync("address", option.address);
      uni.setStorageSync("isHistory", option.isHistory);
      uni.setStorageSync("dateRange", option.dateRange);
      this.address = option.address.toString();
      this.dateRange = option.dateRange;
      this.getMachineList(option.address, option.isHistory);
    } else {
      this.address = uni.getStorageSync("address");
      let isHistory = uni.getStorageSync("isHistory");
      this.dateRange = uni.getStorageSync("dateRange");
      this.getMachineList(this.address, isHistory);
    }
    let Y = new Date().getFullYear();
    let M = new Date().getMonth() + 1;
    let Y_M = Y + "-" + M;
    this.getMon(Y_M);
  },
  created() {},
  computed: {
    totalMoney() {
      let total = 0;
      this.machineListUnSettle.map((e) => {
        total += Number(e.allSettleMoney);
      });
      return total;
    },
  },
  methods: {
    getMachineList(address, isHistory) {
      console.log(address);
      this.$network.constructionSiteInfo(address, isHistory).then((res) => {
        let machine = res;
        if (machine.length > 0) {
          this.contactPhoneMap = machine[0].contactPhoneMap;
          this.getContactPhoneMap();
          this.machineNum = machine.length;
          machine.map((e) => {
            if (e.isSettle == "0") {
              this.machineListUnSettle.push(e);
            } else {
              this.machineListIsSettle.push(e);
            }
          });
          this.machineListUnSettle.map((e) => {
            this.predict += Number(e.allSettleMoney);
          });
          let settleTotal = 0;
          this.machineListIsSettle.forEach((e) => {
            console.log(e, "e");
            e.contracts.forEach((j) => {
              console.log(j, "j");
              j.settlements.forEach((k) => {
                console.log(k.total, "k");
                settleTotal += Number(k.total);
              });
            });
          });
          this.settleTotal = settleTotal;
        }
        this.getMoney();
      });
    },
    onDayClick(data) {
      this.curDate = data.date;
      this.dayMachineList = [];
      this.markDays.map((e) => {
        if (e.date == this.curDate) {
          this.dayMachineList = e;
        }
      });
    },
    getMoney() {
      let param = {
        current: 1,
        fuzzyParam: "price",
        size: 50,
      };
      this.$network
        .getData(this.$url.CUR_SYS_DICT, "POST", param)
        .then((res) => {
          uni.hideLoading();
          console.log(res, "");
          this.dict = res.records;
          this.machineListUnSettle.forEach((e) => {
            this.dict.forEach((j) => {
              if (e.height.slice(0, e.height.length - 1) == j.value) {
                e.settlementPrice = j.label;
                console.log(e);
              }
            });
          });
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getToday() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let week = new Date().getDay();
      let weekText = ["日", "一", "二", "三", "四", "五", "六"];
      let formatWeek = "星期" + weekText[week];
      let today = {
        date: y + "-" + this.formatNum(m + 1) + "-" + this.formatNum(d),
        week: formatWeek,
      };
      return today;
    },
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? "0" + res : res;
    },
    getMon(Y_M) {
      if (Y_M.slice(-2) != 10 && Y_M.slice(-2) != 11 && Y_M.slice(-2) != 12) {
        let arr = [];
        arr = Y_M.split("-");
        arr[1] = "0" + arr[1];
        Y_M = arr.join("-");
      }
      console.log(this.address, "this.address");
      this.$network
        .constructionSitesInfoMonth(Y_M, this.address)
        .then((res) => {
          this.markDays = res;
        });
    },

    change(val) {
      console.log(val, "11");
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    gotoDetail(type, item) {
      if (type == 1) {
        uni.navigateTo({
          url: `/devicePages/record/device-record-detail?licenseId=${item.serialNo}`,
        });
      } else {
        uni.navigateTo({
          url: `/contractPages/contract/contract-detail?contractNo=${item}`,
        });
      }
    },
    settle() {
      this.machineListUnSettle.map((e) => {
        e.checked = true;
        e.settlementType = "1";
        e.settlementTypeName = "天租";
        e.licenseId = e.serialNo;
        e.claim = 0;
        e.pauseDays = 0;
      });
      uni.setStorageSync("gps_machineList", this.machineListUnSettle);
      uni.navigateTo({
        url: `/devicePages/gps/machineChoose`,
      });
    },
    // 金额转换
    money(str) {
      if (str[0] == 0) {
        str.slice(0, 1);
      }
      return Number(str).toFixed(2);
    },
    getContactPhoneMap() {
      this.phoneMapStr = "";
      for (const key in this.contactPhoneMap) {
        this.phoneMapStr += key + `(${this.contactPhoneMap[key]})，`;
      }
      this.phoneMapStr = this.phoneMapStr.slice(0, this.phoneMapStr.length - 1);
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
    font-size: 12px;
    margin-top: 10px;
    padding: 12px;
    color: #8c8c8c;
    background-color: #f6f6f6;
    .content {
      background-color: #f6f6f6;
      .top {
        padding: 0;
        background-color: #f6f6f6;
        display: grid;
        grid-template-columns:50% 35%;
        gap: 10px 30px;
        margin-bottom: 10px;
      }
    }
  }
}
.machineList {
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
  .machineCard {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e6e6e6;
    margin-bottom: 10px;
    .head {
      display: flex;
      .left {
        box-sizing: border-box;
        display: flex;
        width: 55px;
        height: 55px;
        padding: 3px;
        border-radius: 8px;
        border: 1px $uni-line-color solid;
        align-items: center;
        justify-content: center;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        width: 100%;
      }
    }
    .contract {
      .first {
        display: flex;
        align-items: center;
        span {
          display: block;
        }
        .contractList {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 5px;
        }
      }

      .second {
        margin-top: 5px;
      }
      .settle {
        margin-top: 10px;
        padding: 12px;
        color: #8c8c8c;
        background-color: #f6f6f6;
        view {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.dayDataList {
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
    justify-content: space-between;
    align-items: center;
    .line {
      display: block;
      width: 2px;
      height: 80%;
      background-color: #e60000;
      margin-right: 10px;
    }
  }
  .machineCard {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e6e6e6;
    margin-bottom: 10px;
    .head {
      display: flex;
      .left {
        box-sizing: border-box;
        display: flex;
        width: 55px;
        height: 55px;
        padding: 3px;
        border-radius: 8px;
        border: 1px #e6e6e6 solid;
        align-items: center;
        justify-content: center;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        width: 100%;
      }
    }
    .contract {
      margin-top: 10px;
      .first {
        display: flex;
        align-items: center;
        span {
          display: block;
        }
        .contractList {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 5px;
        }
      }

      .second {
        margin-top: 5px;
      }
      .settle {
        margin-top: 10px;
        padding: 12px;
        color: #8c8c8c;
        background-color: #f6f6f6;
        view {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.flexStart {
  display: flex;
  justify-content: start;
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
  margin: 6px 0;
}
.gray {
  color: #8c8c8c;
}
.ml5 {
  margin-left: 5px;
}
.mr5 {
  margin-right: 5px;
}
.iconshengfenzuobiao_mianxing {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #e60000;
  text-align: center;
  line-height: 20px;
}
.iconwupinchuku {
  display: block;

  border-radius: 50%;
  color: #fe931f !important;
  text-align: center;
  font-size: 80upx;
  line-height: 20px;
}
.iconwupinruku {
  display: block;
  border-radius: 50%;
  color: #52c41f !important;
  text-align: center;
  line-height: 20px;
  font-size: 80upx;
}
._title {
  font-size: 14px;
  font-weight: 600;
}
.icon-car {
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.flow {
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
    .btn {
      width: 86px;
      display: flex;
      flex-direction: row;
      padding: 10px 0px;
      background: #e60000;
      color: #ffffff;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 6px;
    }
  }
}

.preWarp {
  white-space: pre-wrap !important;
  word-break: break-all;
  word-wrap: break-word;
}
.bottom {
  height: 90px;
}
.red {
  color: #e60000;
}
.calendar {
}
</style>
