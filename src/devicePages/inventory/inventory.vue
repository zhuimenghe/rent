<template>
  <view class="databgclass">
    <!-- 设备总览 -->
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="over-view-bg">
      <view class="title-bg">
        <view class="title-left">{{ "设备总览" }}</view>
        <view class="title-right" @click="open()">
          <text style="font-weight: 700; font-size: 16px">{{ area }}</text>
          <i class="iconfont title-icon iconarrow-right"></i>
        </view>
      </view>
      <view class="over-view-content">
        <view class="charts-box">
          <canvas type="2d" canvas-id="arcbar" id="arcbar" class="charts" />
        </view>
        <view class="middle">
          <p style="font-weight: 700; font-size: 16px">
            {{ inventory.totalCount ? inventory.totalCount : 0 }}
          </p>
          <p style="color: #8c8c8c; font-size: 12px">总数</p></view
        >
        <view class="right">
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.selfCount ? inventory.selfCount : 0 }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">自有</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.subLetCountc ? inventory.subLetCountc : 0 }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">转租</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.forRentCount ? inventory.forRentCount : 0 }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">待租</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.inRentCount ? inventory.inRentCount : 0 }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">已租</p></view
          >
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom" :safe-area="true" @close="close()">
      <scroll-view class="uni-pop" scroll-y>
        <Tree
          :range="range"
          rangeKey="name"
          idKey="id"
          :multiple="true"
          :selectParent="true"
          title="选择区域"
          @confirm="treeConfirm"
        >
        </Tree>
      </scroll-view>
    </uni-popup>

    <view class="list">
      <view
        class="list-card"
        show-scrollbar="false"
        v-for="(item, index) in datalist"
        :key="index"
        @click.stop="gotoDetial(item)"
      >
        <view class="title_row" style="width: 100%">
          <p style="font-size: 16px; font-weight: 600">{{ item.height }}</p>
          <p style="font-size: 16px; font-weight: 600">
            {{ item.machineType }}
          </p>
          <p style="font-size: 14px">
            出租率
            <span :class="item.color">{{
              (item.rate * 100).toFixed(2) + "%"
            }}</span>
          </p>
          <p style="float: right; text-align: right; color: #8c8c8c">></p>
        </view>
        <view class="content_row">
          <p>总数：{{ item.totalCount }}</p>
          <p>待租：{{ item.forRentCount }}</p>
          <p>报停：{{ item.pauseCount }}</p>
          <p>已锁：{{ item.lockCount }}</p>
        </view>
      </view>
      <view>
        <view><uni-load-more iconType="auto" :status="morestatus" /></view>
      </view>
    </view>
  </view>
</template>
<script>
import uCharts from "../../components/common/u-charts/u-charts";
import { mapState } from "vuex";
import { canvas2dCtx } from "@/common/util/util";
import Tree from "./tki-tree";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
var uChartsInstance = {};
export default {
  components: { Tree, uniPopup },
  data() {
    return {
      datalist: [],
      morestatus: "more",
      totalCount: "100",
      page: 1,
      inventory: {}, //库存
      range: [], //地区
      rangeList: [],
      area: "",
    };
  },
  created() {},
  mounted() {
    this.getOverViewData();
    this.getOrgList();
  },
  onLoad() {
    this.getList();
  },
  watch: {},
  computed: {
    ...mapState("system", {
      // #ifdef MP-WEIXIN
      pixelRatio: (s) => s.systemInfo.pixelRatio,
      // #endif
      // #ifndef MP-WEIXIN
      pixelRatio: (s) => 1,
      // #endif
    }),
  },
  methods: {
    getOverViewData() {
      let orgIds = [];
      if (this.rangeList.length > 0) {
        this.rangeList.forEach((e) => {
          orgIds.push(e.id);
        });
      }
      let parame = {
        orgIds: orgIds.join(","),
      };
      console.log(parame, "parame");
      this.$network
        .getData(this.$url.MACHINE_OVERALL, "GET", parame)
        .then((res) => {
          this.inventory = res;
          console.log(this.inventory);

          let arcbar = {
            series: [
              {
                name: "正确率",
                color: "#FF2B2B",
                data: res.rate,
              },
            ],
          };
          this.drawCharts("arcbar", arcbar);
        })
        .catch((err) => {});
    },
    // machine/inventory/list
    getList() {
      // 是否进行地域选择
      let orgIds = [];
      if (this.rangeList.length > 0) {
        this.rangeList.forEach((e) => {
          orgIds.push(e.id);
        });
      }
      let parame = {
        orgIds: orgIds.join(","),
      };
      console.log(parame, "parame");

      // 获取设备数据
      this.$network
        .getData(this.$url.MACHINE_INVENTORY_LIST, "GET", parame)
        .then((result) => {
          this.datalist = this.datalist.concat(result);
          // 颜色渐变

          this.datalist.map((e) => {
            if (e.rate.toFixed(2) * 100 < 60) {
              e.color = "red";
            } else if (
              e.rate.toFixed(2) * 100 >= 60 &&
              e.rate.toFixed(2) * 100 < 60
            ) {
              e.color = "yellow";
            } else {
              e.color = "green";
            }
          });
          console.log(this.datalist);
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
    gotoDetial(item) {
      console.log(item);
      let orgIds = [];
      if (this.rangeList.length > 0) {
        this.rangeList.forEach((e) => {
          orgIds.push(e.id);
        });
      }
      item.orgIds = orgIds;
      console.log(item.orgIds);
      uni.navigateTo({
        url:
          "./inventory-detail?data=" + encodeURIComponent(JSON.stringify(item)),
      });
    },
    async drawCharts(id, data) {
      let context = uni.createCanvasContext(id, this);
      // #ifdef MP-WEIXIN
      context = await canvas2dCtx("#" + id, this);
      // #endif
      let cWidth = uni.upx2px(160);
      let cHeight = uni.upx2px(160);
      uChartsInstance[id] = new uCharts({
        type: "arcbar",
        context,
        width: cWidth * this.pixelRatio,
        height: cHeight * this.pixelRatio,
        pixelRatio: this.pixelRatio,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        padding: undefined,
        title: {
          name: (data.series[0].data * 100).toFixed(2) + "%",
          color: "#FFAB60",
          fontSize: 18,
        },
        subtitle: {
          name: "出租率",
          fontSize: 12,
          color: "#8c8c8c",
        },
        extra: {
          arcbar: {
            type: "circle",
            width: 4,
            startAngle: 1.5,
            endAngle: 0.25,
            gap: 2,
            borderColor: "#E6E6E6",
            linearType: "custom",
            customColor: ["#FFAB60", "#FF2B2B"],
          },
        },
      });
    },
    //下拉刷新
    onPullDownRefresh() {
      this.page = 1;
      this.datalist = [];
      this.getList();
    },
    //上拉加载
    onReachBottom() {
      if (this.morestatus == "noMore") {
        return;
      }
      this.page += 1;
      this.getList();
      this.morestatus = "loading";
    },
    open() {
      this.$refs.popup.open("bottom");
    },
    getOrgList() {
      this.$network
        .getData(this.$url.ORG_LIST, "GET", {})
        .then((res) => {
          this.range = res;
          this.range[0].root = true;
          this.area = this.range[0].name;
        })
        .catch((err) => {});
    },
    close() {
      this.$refs.popup.close();
    },

    treeConfirm(data) {
      this.datalist = [];
      this.rangeList = data;
      this.area = this.rangeList[0].name;
      this.getList();
      this.getOverViewData();
      this.close();
      this.area = this.rangeList[0].name;
    },
  },
};
</script>

<style lang="scss" scoped>
.red {
  color: #e60000;
}
.green {
  color: #52c41a;
}
.yellow {
  color: #fe931f;
}
.databg .databgclass {
  width: 100%;
  height: 100%;
  position: relative;
  // box-sizing: border-box;
  @include flex(column);
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
      display: grid;
      grid-template-columns: 15% 30% 25% 30%;
      align-items: center;
      color: #222222;
      p {
        white-space: nowrap;
      }
    }
    .content_row {
      display: grid;
      grid-template-columns: 25% 25% 25% 25%;
      color: #8c8c8c;
      p {
        white-space: nowrap;
      }
    }
  }
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.title-left {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}
.title-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  font-size: 26rpx;
}

.over-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 15px 10px;
  padding-bottom: 0;
  background: #ffffff;
}
.charts-box {
  width: 245rpx;
  height: 245rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #e6e6e6;
  canvas {
    width: 160rpx;
    height: 160rpx;
  }
}
.over-view-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  border-top: 1px solid #e6e6e6;
  .middle {
    width: 25%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    p {
      text-align: center;
    }
  }
  .right {
    width: 35%;
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    view {
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.uni-pop {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  height: 500px;
}
</style>
