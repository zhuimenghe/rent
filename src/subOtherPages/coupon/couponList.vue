<template>
  <view class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="tabs">
      <view
        class="tab"
        v-for="(t, i) in tabs"
        :key="i"
        :class="{ active: activeIndex == i }"
        @click="changeTab(i)"
        >{{ t.label }}</view
      >
      <view
        class="line"
        :style="{ left: 100 * (1 / (tabs.length * 2) + activeIndex / tabs.length) + '%' }"
      ></view>
    </view>
    <swiper
      class="list-wrapper"
      :duration="200"
      :current="activeIndex"
      @change="changeTab($event.detail.current)"
    >
      <swiper-item class="list" v-for="(t, i) in tabs" :key="i">
        <view class="card" v-for="(c, ci) in t.list" :key="ci">
          <view class="image-container">
            <image class="img" :src="c.path" mode="heightFix"></image>
          </view>
          <view class="flex-1">
            <view class="top">
              <view class="flex-1">
                <view class="text-lg text-bold">{{ c.couponTypeName }}</view>
                <view
                  class="cu-tag sm line-primary margin-top-sm radius"
                  v-if="c.remark"
                  >{{ c.remark || "--" }}</view
                >
              </view>
              <!-- <view class="z-btn line-primary radius">退款</view> -->
            </view>
            <view class="margin-top-sm text-sm text-gray">付款时间：{{ c.payTime }}</view>
            <view
              class="margin-top-sm text-sm text-gray flex justify-between"
              v-if="c.orderStatus == 'PAID'"
            >
              <text>抵扣券码：{{ c.couponCode }} 核销码：{{ c.writeCode }}</text>
              <text class="text-warn" @click="copy(c)">复制</text>
            </view>
            <view
              class="margin-top-sm text-sm text-gray flex justify-between"
              v-else-if="c.orderStatus == 'WRITE_OFF'"
            >
              <text>核销时间：{{ c.writeTime }}</text>
            </view>
            <view
              class="margin-top-sm text-sm text-gray flex justify-between"
              v-else-if="c.orderStatus == 'CANCEL'"
            >
              <text>作废时间：{{ c.cancelTime }}</text>
            </view>
          </view>
        </view>
        <EmptyData v-if="!t.list || t.list.length == 0" empty-text="暂无数据"></EmptyData>
      </swiper-item>
    </swiper>
    <!-- <view class="footer" v-if="expiredDate">有效期至{{ expiredDate }}，过期自动退款。</view> -->
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import util from "@/common/common-method/common-method";
import parseISO from "date-fns/parseISO";
import { fetchCouponList } from "@/network/modules/couponapi";
import EmptyData from "@/components/common/sany/empty-data.vue";
export default {
  components: {
    EmptyData,
  },
  data() {
    return {
      activeIndex: 0,
      businessNo: "",
      identifier: "",
      tabs: [
        {
          label: "待使用",
          value: "PAID",
          list: [],
        },
        {
          label: "已使用",
          value: "WRITE_OFF",
          list: [],
        },
        {
          label: "已作废",
          value: "CANCEL",
          list: [],
        },
      ],
    };
  },
  computed: {
    ...mapState("coupon", {
      openid: "openid",
      ac: "activity",
    }),
    expiredDate() {
      return this.ac
        ? util.timeTransform(parseISO(this.ac.endTime), "yyyy年MM月dd日")
        : "";
    },
  },
  onShow() {},
  onLoad(options) {
    this.businessNo = options.businessNo || "";
    uni.getStorage({
      key: "teamId",
      success: (res) => {
        console.log(res);
        this.identifier = res.data;
        this.fetchList();
      },
      fail: async (e) => {
        console.log(e);
        this.identifier = "";
        this.fetchList();
      },
    });
  },
  mounted() {
    // this.popScan()
  },
  methods: {
    ...mapActions("coupon"),
    copy(c) {
      util.copy(c.couponCode + "\n" + c.writeCode);
    },
    async changeTab(index) {
      this.activeIndex = index;
      await this.fetchList(); // 重新获取数据
    },
    async fetchList() {
      let list = await fetchCouponList(
        this.openid,
        this.tabs[this.activeIndex].value,
        this.businessNo,
        this.identifier
      );
      this.tabs[this.activeIndex].list = list;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  @include flex(column);
}

.tabs {
  background: $uni-bg-color;
  position: relative;
  height: 96rpx;
  margin-bottom: 29rpx;
  @include flex(row, center, space-between);

  .line {
    position: absolute;
    bottom: 0;
    left: 100rpx;
    width: 40rpx;
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

.list-wrapper {
  background: $uni-bg-color;
  flex: 1;
  overflow: auto;

  .list {
    height: 100%;
    overflow: auto;
  }
}

.card {
  @include hairline-bottom();
  padding: 24rpx;
  @include flex(row, center);

  .image-container {
    width: 168rpx;
    height: 168rpx;
    border-radius: 6rpx;
    margin-right: 16rpx;
    overflow: hidden;
    position: relative;

    .img {
      width: auto;
      height: 100%;
    }
  }

  .top {
    @include flex(row, center);
  }
}

.footer {
  color: #666;
  padding: 0 30rpx;
  padding-bottom: env(safe-area-inset-bottom);
  height: 80rpx;
  line-height: 80rpx;
  background: rgba(255, 242, 207, 0.79);
}
</style>
