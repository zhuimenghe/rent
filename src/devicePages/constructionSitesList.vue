<template>
  <view class="collection">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="tab" style="font-size: 16px; font-weight: 550">
      <p :class="flag == 1 ? 'strong' : ''" @click="change(1)">
        当前施工点({{
          constructionSitesList.length ? constructionSitesList.length : 0
        }})
        <span class="_line" v-if="flag == 1"></span>
      </p>
      <p :class="flag == 2 ? 'strong' : ''" @click="change(2)">
        历史施工点({{
          constructionSites_history.length
            ? constructionSites_history.length
            : 0
        }})
        <span class="_line" v-if="flag == 2"></span>
      </p>
    </view>

    <view class="body" v-if="flag == 1">
      <view class="constructionList">
        <view
          class="lowBatteryCard"
          v-for="(item, index) in constructionSitesList"
          @click="gotoConstruction(item.address, false)"
        >
          <view class="flex">
            <view style="width: 24px">
              <span class="iconfont iconshengfenzuobiao_mianxing"></span>
            </view>
            <view class="left">
              <p class="_title">
                {{ item.address }}
              </p>
              <p class="F14 FW500">施工起始时间：{{ item.dateRange }}</p>
            </view>
          </view>
          <view class="bottomBox" style="font-size: 14px; margin-top: 6px">
            <span class="gray">设备数量：{{ getMap(item.machineMap) }}</span>
          </view>
        </view>
      </view>
    </view>
    <view class="body" v-else>
      <view class="constructionList">
        <view
          class="lowBatteryCard"
          v-for="item in constructionSites_history"
          @click="gotoConstruction(item.address, true)"
        >
          <view class="flex">
            <view style="width: 24px">
              <span class="iconfont iconshengfenzuobiao_mianxing"></span>
            </view>
            <view class="left">
              <p class="_title">
                {{ item.address }}
              </p>
              <p class="F14 FW500">施工起始时间：{{ item.dateRange }}</p>
            </view>
          </view>
          <view class="bottomBox" style="font-size: 14px; margin-top: 6px">
            <span class="gray">设备数量：{{ getMap(item.machineMap) }}</span>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      flag: 1,
      constructionSitesList: [],
      constructionSites_history: [],
    };
  },
  onLoad(options) {},
  onShow() {},

  computed: {},
  mounted() {
    this.constructionSites();
  },
  created() {},

  methods: {
    change(i) {
      this.flag = i;
      console.log(i, this.flag);
    },
    constructionSites() {
      uni.showLoading();
      this.$network
        .constructionSites(true)
        .then((res) => {
          uni.hideLoading();
          this.constructionSites_history = res.sites;
        })
        .catch((err) => {
          uni.hideLoading();
        });

      this.$network
        .constructionSites(false)
        .then((res) => {
          uni.hideLoading();
          this.constructionSitesList = res.sites;
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    changeCheck(index, type) {
      if (type == "reimburse") {
        let total = 0;
        this.reimburse[index].checked = !this.reimburse[index].checked;
        this.reimburse.map((e) => {
          if (e.checked) {
            total++;
          }
          this.reimburseNum = total;
        });
      } else {
        let total = 0;
        this.proceedsList[index].checked = !this.proceedsList[index].checked;
        this.proceedsList.map((e) => {
          if (e.checked) {
            total++;
          }
          this.proceedsNum = total;
        });
      }
      this.$forceUpdate();
    },
    getMap(item) {
      if (JSON.stringify(item) === "{}") return 0;
      let str = "";
      for (const key in item) {
        str += key + item[key] + "|";
      }
      str = str.slice(0, -1);
      return str;
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    gotoConstruction(address, isHistory) {
      uni.navigateTo({
        url: `/devicePages/gps/constructionDetail?address=${address}&isHistory=${isHistory}`,
      });
    },
    clickBtn() {
      /* 收款 */
      let collectionData = {
        collectionCount: 0,
        proceedsNo: [],
      };
      this.proceedsList.forEach((o) => {
        if (o.checked) {
          collectionData.collectionCount += Number(o.total);
          collectionData.proceedsNo.push(o.businessNo);
        }
      });
      /* 退款 */
      let refundData = {
        refundCount: 0,
        refundNo: [],
      };
      this.reimburse.forEach((o) => {
        if (o.checked) {
          refundData.refundCount += Number(o.total);
          refundData.refundNo.push(o.businessNo);
        }
      });
      let data = {
        collectionData: { ...collectionData },
        refundData: { ...refundData },
      };
      uni.$emit("derterminCollection", data);
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.left {
  display: flex;
  padding: 0 10px;
  flex-direction: column;
  justify-content: start;
}
.collection {
  width: 100%;
}
.settle {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 8px 0;
  display: flex;
  align-items: center;
  padding: 10px myIndex;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 5px;
  }
}
.body {
  padding-bottom: 150px;
}
.tab {
  display: flex;
  background-color: #ffffff;
  justify-content: space-between;
  height: 40px;
  p {
    line-height: 40px;
    width: 45%;
    text-align: center;
    color: #222222;
    font-size: 16px;
    line-height: 40px;
    height: 100%;
    position: relative;
    ._line {
      display: block;
      width: 20px;
      height: 3px;
      background-color: #e60000;
      position: absolute;
      bottom: 0;
      left: 50%;
      translate: -10px;
    }
  }
}
.strong {
  color: #e60000 !important;
}
.card {
  box-sizing: border-box;
  height: 100%;
  background-color: #ffffff;
  height: 240px;
  padding: 10px;
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: #222222;
    font-weight: 600;
  }
  .title_info {
    padding: 15px 0;
    color: #8c8c8c;
    display: grid;
    grid-template-columns: 60% 36%;
    grid-gap: 10px;
    border-bottom: 1px dashed #e6e6e6;
  }
  .message {
    display: grid;
    grid-template-columns: repeat(3, 30%);
    padding: 10px 0;
    grid-gap: 10px 15px;
    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      span:nth-child(1) {
        color: #8c8c8c;
      }
      span:nth-child(2) {
        color: #222222;
        font-weight: 600;
      }
    }
  }
}
.flow {
  width: 100%;
  position: fixed;
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
    }
  }
}

.constructionList {
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
  .lowBatteryCard {
    background-color: #fff;
    padding: 12px 10px;
    margin-bottom: 10px;
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

.F14 {
  font-size: 14px;
}
.FW500 {
  font-weight: 600;
}
.flexBewteen {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row {
  margin: 2px 0;
}
.gray {
  color: #8c8c8c;
}
.flex {
  display: flex;
  align-items: baseline;
}
.iconshengfenzuobiao_mianxing {
  width: 33%;
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(230, 0, 0, 0.1);
  color: #e60000;
  text-align: center;
  line-height: 24px;
}
.ML25 {
  margin-left: 22px;
}
.bottomBox {
  padding-top: 8px;
  border-top: 1px solid #e6e6e6;
}
._title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222222;
}
</style>
