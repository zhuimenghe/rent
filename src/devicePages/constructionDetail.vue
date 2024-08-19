<template>
  <view class="report">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top">
      <view class="flex row">
        <span class="iconfont iconshengfenzuobiao_mianxing"></span>
        <p class="_title" style="margin-left: 5px">{{ address }}</p>
      </view>
      <view class="top_body">
        <p>施工开始时间：{{ dateRange }}</p>
        <p>当前设备数量：{{ machineNum }}</p>
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
                <p class="_title">{{ item.serialNo }}</p>
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
            <view class="contract" @click="gotoDetail(2, item)"></view>
            <view class="settle"></view>
          </view>
        </block>
      </more-list>
    </view>
    <view class="machineList">
      <p class="title">
        <span class="line"></span>已结算设备
        <span style="margin-left: 5px; color: #e60000"
          >（{{ machineListIsSettle.length }}）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="machineListIsSettle" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <view
            class="machineCard"
            v-for="(item, index) in machineListIsSettle"
            :key="index"
          >
            <view
              class="head"
              style="padding-bottom: 10px; border-bottom: 1px dashed #e6e6e6"
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
                  <span style="color: #e60000">
                    未结清预计：{{ item.allSettleMoney }}</span
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
              class="contract"
              @click="gotoDetail(2, item)"
              v-for="contracts in item.contracts"
              :key="contracts.contractNo"
            >
              <view class="first">
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
                {{ contracts.customerSalesmanPhone }})
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
                    <span style="color: #e60000">{{ settle.total }}</span>
                  </p>
                </view>
              </view>
            </view>
          </view>
        </block>
      </more-list>
    </view>
  </view>
</template>
<script>
import MoreList from "./moreList.vue";
export default {
  name: "deviceBaseInfo",
  components: {
    MoreList,
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
      dateRange:''
    };
  },
  onLoad(option) {
    this.address = option.address;
    this.dateRange=option.dateRange
    this.getMachineList(option.address, option.isHistory);
  },
  methods: {
    getMachineList(address, isHistory) {
      this.$network.constructionSiteInfo(address, isHistory).then((res) => {
        let machine = res;
        if (machine.length > 0) {
          this.machineNum = machine.length;
          machine.map((e) => {
            if (e.isSettle == "0") {
              this.machineListUnSettle.push(e);
            } else {
              this.machineListIsSettle.push(e);
            }
          });
        }
      });
    },

    getList() {},
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
          url: `/contractPages/contract/contract-detail?id=${item.contractNo}`,
        });
      }
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
    padding: 12px;
    justify-content: space-between;
    color: #8c8c8c;
    background-color: #f6f6f6;
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
      margin-top: 10px;
      .first {
        display: flex;
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
  background-color: rgba(230, 0, 0, 0.1);
  color: #e60000;
  text-align: center;
  line-height: 20px;
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
</style>
