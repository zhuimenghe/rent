<template>
  <view class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <scroll-view class="flex-scroll-wrapper" scroll-y>
      <view class="info-card">
        <view class="head">
          <text class="iconfont" :class="[c.type == 2 ? 'iconkehu2' : 'iconqiye2']">
          </text>
          <text class="margin-left-sm text-bold text-lg">{{ c.name }} </text>
        </view>
        <view class="detail">
          <view class="line">
            <view class="flex-2">区域：{{ c.orgName }}</view>
            <view class="flex-3">业务负责人：{{ c.salesmanName || "-" }}</view>
          </view>
          <view class="line">
            <view class="flex-2"> 客户类型：{{ c.type == "1" ? "企业" : "个人" }} </view>
            <view class="flex-3">创建时间：{{ c.createTime || "-" }}</view>
          </view>
          <view class="line">
            <view class="flex-1"> 客户地址：{{ c.address || "-" }} </view>
          </view>
        </view>
      </view>
      <view class="reminder" v-if="reminders.length > 0">
        <view class="head">重要提醒</view>
        <view
          class="item"
          v-for="(r, i) in reminders"
          :key="i"
          @click="goTo(r.type == 'workIn' ? 'workIn' : 'settle', r)"
        >
          <view>{{ r.m1 }}</view>
          <view class="flex justify-between">
            <text>{{ r.m2 }}</text>
            <view>
              {{ r.type == "workIn" ? "进场" : "结算" }}
              <text class="iconfont iconarrow-right"></text>
            </view>
          </view>
        </view>
      </view>
      <view class="main">
        <view class="tabs">
          <view
            class="tab"
            v-for="(t, i) in tabs"
            :key="i"
            :class="{ active: tab == i }"
            @click="tab = i"
            >{{ t }}</view
          >
          <view
            class="line"
            :style="{ left: 100 * (1 / (tabs.length * 2) + tab / tabs.length) + '%' }"
          ></view>
        </view>
        <base-info v-show="tab == 0" :c="c" ref="base"></base-info>
        <contract v-show="tab == 1" :c="c" ref="contract"></contract>
        <device v-show="tab == 2" :c="c" ref="device"></device>
      </view>
    </scroll-view>
    <view class="actions-footer-flex">
      <view class="btn z-btn bg-warn radius" @click="createContract">新增合同</view>
      <navigator
        :url="`/otherPages/linkman/custom-proceed?id=${c.id}`"
        class="btn z-btn bg-primary radius"
        >新增客户收款</navigator
      >
      <view class="btn z-btn bg-primary radius" @click="download">下载设备明细 </view>
    </view>
  </view>
</template>

<script>
import BaseInfo from "./components/custom-detail-base.vue";
import Contract from "./components/custom-detail-contract.vue";
import Device from "./components/custom-detail-device.vue";
export default {
  components: {
    BaseInfo,
    Contract,
    Device,
  },
  data() {
    return {
      tab: 0,
      tabs: ["基本信息", "合同信息", "设备履约"],
      c: {
        otherAttachmentsList: [],
        businessLicenseList: [],
        contactsList: [],
      },
      reminders: [],
    };
  },
  onLoad(options) {
    this.c.id = options.id;
    uni.$on("goto-business", (usnerinfo) => {
      uni.switchTab({
        url: "/pages/main/business",
      });
    });
  },
  onUnload() {
    uni.$off("goto-business");
  },
  onShow() {
    this.getDetail();
    this.getReminders();
  },
  mounted() {
    this.$refs.base.init(this.c.id);
    this.$refs.contract.init(this.c.id);
    this.$refs.device.init(this.c.id);
  },
  methods: {
    download() {
      let url =
        this.$url.BASE_URL +
        `settleapi/api/receivable/machine/customer?isExport=true&customerId=${this.c.id}`;
      this.$datestr.downFunc(url);
    },
    async getDetail() {
      let url = this.$url.CUSRTOMER_DETAIL + this.c.id;
      this.c = await this.$network.getData(url, "GET", null);
    },
    async getReminders() {
      this.reminders = await this.$network.customerReminders(this.c.id);
      this.reminders.forEach((r) => {
        let msgs = r.messageStr.split("】");
        r.m1 = msgs[0] + "】";
        r.m2 = msgs[1];
        r.businessNo = r.contractNo;
        r.customerId = this.c.id;
      });
    },
    async goTo(type, item) {
      switch (type) {
        case "workIn":
          // if (item.state != "5" &&
          //     item.state != "6" &&
          //     item.state != "7" &&
          //     item.state != "8") {
          //   return;
          // }
          let result = await this.$network.getData(
            this.$url.CONTRACT_DEATIL_BY_NO,
            "GET",
            { businessNo: item.businessNo, contractStateList: "4,5,6,7,8,9" }
          );
          let path =
            item.contractType == "3" ? "create-workin-simple" : "create-workin-step-all";
          uni.navigateTo({
            url: `/businessPages/workin/${path}?contract=${encodeURIComponent(
              JSON.stringify(result)
            )}`,
          });
          break;
        case "settle":
          // if (item.state != "6" &&
          //     item.state != "7" &&
          //     item.state != "8") {
          //   return;
          // }
          uni.navigateTo({
            url: `/businessPages/settledown/settle-add?contracts=${item.businessNo}&customerId=${item.customerId} `,
          });
          break;
        default:
          break;
      }
    },
    createContract() {
      uni.navigateTo({
        url: `/contractPages/contract/create-contract?${
          this.c.type == "1" ? "clink" : "link"
        }=${encodeURIComponent(JSON.stringify(this.c))}`,
      });
    },
  },
};
</script>
<style lang="scss">
@import "./components/custom-detail.scss";

.page {
  height: 100%;
  @include flex(column);

  .info-card {
    background-color: $uni-bg-color;
    padding: 24rpx;
    $background-color: $uni-bg-color;

    .head {
      @include flex(row, center);

      .iconfont {
        font-size: 32rpx;
        color: $uni-color-warning;
      }
    }

    .detail {
      margin-top: 28rpx;
      background-color: $uni-bg-color-grey;
      padding: 4rpx 16rpx;

      .line {
        @include flex(row, center, space-between);
        color: $uni-text-color-gray;
        padding: 10rpx 0;
        font-size: $uni-font-size-sm;
      }
    }
  }

  .reminder {
    margin-top: 20rpx;
    background-color: $uni-bg-color;
    padding: 16rpx;

    .head {
      padding-left: 8rpx;
      font-weight: bold;
    }

    .item {
      margin-top: 10rpx;
      padding: 9rpx;
      background: #fff5e8;
      border-radius: 6rpx;
      border: 1px solid $uni-color-warning;
      color: $uni-color-warning;
      font-size: $uni-font-size-sm;
    }
  }

  .main {
    margin-top: 20rpx;
    padding-bottom: 30rpx;
    background-color: $uni-bg-color;

    .tabs {
      top: 0;
      background: $uni-bg-color;
      height: 96rpx;
      margin-bottom: 29rpx;
      @include flex(row, center, space-between);
      @include hairline-bottom();
      position: sticky;
      z-index: 10;

      .line {
        position: absolute;
        bottom: 0;
        left: 100rpx;
        width: 80rpx;
        height: 6rpx;
        background: $uni-color-primary;
        transform: translateX(-50%);
        transition: left 0.2s ease-in-out;
      }

      .tab {
        flex: 1;
        height: 100%;
        @include flex(row, center, center);

        &.active {
          color: $uni-color-primary;
        }
      }
    }
  }
}
</style>
