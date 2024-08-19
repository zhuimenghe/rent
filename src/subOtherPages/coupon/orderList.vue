<template>
  <view class="order-list">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <order-item v-for="(order, index) in orders" :key="index" :order-data="order">
    </order-item>
    <EmptyData v-if="!orders || orders.length == 0" empty-text="暂无订单"></EmptyData>
    <!-- 
      <view>
      <uni-load-more iconType="auto" :status="morestatus" />
    </view> 
    -->
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import OrderItem from "../components/orderItem.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";
export default {
  components: {
    OrderItem,
    uniLoadMore,
    EmptyData,
  },
  data() {
    return {
      activeIndex: 0,
      morestatus: "more",
      // orders: [
      //   {
      //     orderNumber: '123456789',
      //     price: 299.99,
      //     coupons: [
      //       {
      //         imgUrl: 'path/to/coupon1.jpg',
      //         name: '10元抵扣',
      //         quantity: 1
      //       },
      //       {
      //         imgUrl: 'path/to/coupon2.jpg',
      //         name: '20元返现',
      //         quantity: 2
      //       }
      //     ],
      //     paymentTime: '2024-03-23 12:34:45'
      //   },
      //   {
      //     orderNumber: '987654321',
      //     price: 499.99,
      //     coupons: [
      //       {
      //         imgUrl: 'path/to/coupon3.jpg',
      //         name: '15元抵扣',
      //         quantity: 1
      //       },
      //       {
      //         imgUrl: 'path/to/coupon4.jpg',
      //         name: '25元返现',
      //         quantity: 1
      //       },
      //       {
      //         imgUrl: 'path/to/coupon5.jpg',
      //         name: '5%折扣',
      //         quantity: 3
      //       },
      //       {
      //         imgUrl: 'path/to/coupon5.jpg',
      //         name: '5%折扣',
      //         quantity: 3
      //       }
      //       , {
      //         imgUrl: 'path/to/coupon5.jpg',
      //         name: '5%折扣',
      //         quantity: 3
      //       }, {
      //         imgUrl: 'path/to/coupon5.jpg',
      //         name: '5%折扣',
      //         quantity: 3
      //       }, {
      //         imgUrl: 'path/to/coupon5.jpg',
      //         name: '5%折扣',
      //         quantity: 3
      //       }
      //     ],
      //     paymentTime: '2024-03-24 14:30:00'
      //   }
      // ]
    };
  },
  computed: {
    ...mapState("coupon", {
      ac: "activity",
      orders: "orders",
    }),
  },
  onShow() {},
  onLoad() {
    this.fetchOrderList();
  },
  mounted() {
    // this.popScan()
  },
  // onPullDownRefresh() {
  //   this.headerrefresh();
  // },
  // onReachBottom() {
  //   this.footerrefresh();
  // },
  methods: {
    ...mapActions("coupon", ["fetchOrderList"]),
    headerrefresh() {
      this.currentpage = 1;
      this.datalist = [];
      // this.loaddata();
    },
    footerrefresh() {
      if (this.morestatus == "noMore" || this.morestatus == "loading") {
        return;
      }
      this.currentpage += 1;
      // this.morestatus = "loading";
      // this.loaddata();
    },
  },
};
</script>

<style lang="scss" scoped></style>
