<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="tab">
      <sun-tab
        :value.sync="index"
        :tabList="tabList"
        activeColor="#E60000"
        :shownum="false"
        @change="indexchange"
      />
    </view>
    <view class="list">
      <view
        class="list-card"
        show-scrollbar="false"
        v-for="(item, index) in datalist"
        :key="index"
        @click.stop="gotoVC(item)"
      >
        <view class="title_row" style="width: 100%">
          <view>
            <p style="font-size: 16px; font-weight: 600">
              {{ item.printCode ? item.printCode : "-" }}
            </p>
            <p class="licenseId">
              {{ item.licenseId }}
            </p>
          </view>

          <p style="color: #e60000; font-weight: 700">{{ item.stateName }}</p>
        </view>
        <view class="content_row">
          <p>{{ item.typeName }}</p>
          |
          <p>{{ item.machineHeight }}米</p>
          |
          <p>{{ item.machineBrand }}</p>
          |
          <p>{{ item.machineTypeName }}</p>
          |
          <p>{{ item.driveTypeName }}</p>
        </view>
      </view>
      <view>
        <view><uni-load-more iconType="auto" :status="morestatus" /></view>
      </view>
    </view>
  </view>
</template>
<script>
import sunTab from "@/devicePages/components/tab-card.vue";

export default {
  components: {
    sunTab,
  },
  data() {
    return {
      tabList: [],
      index: 0,
      datalist: [],
      morestatus: "more",
      totalCount: "100",
      page: 1,
      parame: {
        height: null,
        machineTypeName: null,
        orgIds: null,
      },
    };
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onLoad(item) {
    let data = JSON.parse(decodeURIComponent(item.data));
    console.log(data, "111111");
    uni.setNavigationBarTitle({
      title: `${data.height} 米${data.machineType}`,
    });
    this.parame.height = data.height;
    this.parame.machineTypeName = data.machineType;
    this.parame.orgIds = data.orgIds.join(",");
    this.tabList = [
      {
        name: "总数",
        id: 0,
        key: "totalCount",
        num: data.totalCount,
      },
      {
        name: "待租",
        id: 1,
        key: "forRentCount",
        num: data.forRentCount,
      },
      {
        name: "已租",
        id: 1,
        key: "inRentCount",
        num: data.inRentCount,
      },
      {
        name: "转租",

        id: 1,
        key: "subLetCount",
        num: data.subLetCount,
      },
      {
        name: "报停",
        id: 1,
        key: "pauseCount",
        num: data.pauseCount,
      },
      {
        name: "已锁",
        id: 1,
        key: "lockCount",
        num: data.lockCount,
      },
    ];
    this.getDataList();
  },
  methods: {
    indexchange(item) {
      this.datalist = [];
      this.getDataList(item.tab.key);
    },
    getDataList(type) {
      console.log(type);
      let parame = { ...this.parame };
      switch (type) {
        case "totalCount":
          parame = { ...this.parame };
          break;
        case "forRentCount":
          parame = {
            state: 1,
            ...this.parame,
          };
          break;
        case "inRentCount":
          parame = {
            state: 2,
            ...this.parame,
          };
          break;
        case "subLetCount":
          parame = {
            ...this.parame,
            assetType: "sublet",
          };
          break;
        case "pauseCount":
          parame = {
            ...this.parame,
            subState: 24,
          };
          break;
        case "lockCount":
          parame = { ...this.parame, lockType: 3 };
          break;
        default:
          break;
      }
      console.log(parame, "parame");
      parame.height=parame.height.slice(0, parame.height.length - 1)
      this.$network
        .getData(this.$url.MACHINE_INVENTORY_DETIAL, "GET", parame)
        .then((result) => {
          this.datalist = this.datalist.concat(result);
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
    gotoVC(item) {
      uni.navigateTo({
        url:
          "/devicePages/record/device-record-detail?licenseId=" +
          item.licenseId,
      });
    },
    onPullDownRefresh() {
      this.page = 1;
      this.datalist = [];
      this.getDataList();
    },
    //上拉加载
    onReachBottom() {
      if (this.morestatus == "noMore") {
        return;
      }
      this.page += 1;
      this.getDataList();
      this.morestatus = "loading";
    },
  },
  onUnload() {},
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
}

.top-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 500;
}

.empty {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  margin-top: 50px;
}
.over-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 15px 10px;
  background: #ffffff;
}
.charts-box {
  width: 120px;
  margin-top: 10px;
  padding: 20px;
  border-right: 1px solid #e6e6e6;
}
.licenseId {
  color: #e60000;
  background: #f5dada;
  border-radius: 8px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
}
.list {
  margin-top: 20px;
  width: 100%;
  .list-card {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    background: #ffffff;
    margin: 10px 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title_row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #222222;
      view {
        display: flex;
      }
      p {
        margin: 0 10px;
        white-space: nowrap;
      }
    }
    .content_row {
      width: 100%;
      display: flex;
      color: #8c8c8c;
      font-size: 14px;
      p {
        margin: 0 10px;
        white-space: nowrap;
      }
    }
  }
}
</style>
