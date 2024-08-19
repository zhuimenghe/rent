<template>
  <card :title="title" class="card-padding">
    <!-- <view slot="header-right">
      <my-check-box
        :inverseColor="true"
        :checked="isExpanded"
        class="checkbox"
        @clickBox="changeCheckBox()"
        color="#E60000"
      >
        <span class="header-right-font">展开设备</span>
      </my-check-box>
    </view> -->
    <view class="list-content" v-if="list.length > 0">
      <payment-item class="list-item" v-for="(paymentItem, paymentIndex) in list" :key="'paymentItem' + paymentItem.id" :payment="paymentItem"
        @openPaymentDialog="openPaymentDialog"></payment-item>
    </view>
    <EmptyData v-if="list.length == 0"></EmptyData>
    <uni-popup ref="payTip" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="edit-payment">
          <view class="model-tag"><text>修改已付</text></view>
          <view class="processing-payment">
            <view class="input-label">已付金额</view>
            <!-- @input="(e) => handlePaidTotalChange(e, item)" -->
            <input class="input-style" type="digit" v-model="paymentInput" placeholder="0.00" />
          </view>
          <view class="processing-payment">
            <view class="input-label">备注</view>
            <!-- @input="(e) => handlePaidTotalChange(e, item)" -->
            <input class="input-style" v-model="remarkInput" placeholder="备注" />
          </view>
        </view>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button pop-cancel" @click="paymentCancel">取消</text>
          <text class="uni-tip-button pop-confirm" @click="paymentConfirm">确定</text>
        </view>
      </view>
    </uni-popup>
  </card>
</template>

<script>
import Card from "@/components/common/sany/card.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";
import MyCheckBox from "@/components/common/check-box/check-box.vue";
import paymentItem from "./components/item.vue";
import editPayment from "../../../../mixins/editPayment.js";
export default {
  name: "payment-list",
  props: {
    list: {
      type: Array,
    },
    title: {
      type: String,
    },
  },
  mixins: [editPayment],
  data() {
    return {
      isExpanded: true,
    };
  },
  computed: {},
  components: {
    Card,
    EmptyData,
    MyCheckBox,
    paymentItem,
  },
  methods: {
    changeCheckBox() {
      this.isExpanded = !this.isExpanded;
    },
    openPaymentDialog(paymentItem) {
      this.$refs.payTip.open();
      this.paymentForm = {
        total_o: paymentItem.total,
        total: paymentItem.total,
        paidTotal_o: paymentItem.paidTotal,
        businessNo: paymentItem.businessNo,
      };
      this.paymentInput = paymentItem.paidTotal;
      this.remarkInput = paymentItem.paidRemark;
    },
    headerrefresh() {
      this.$emit("headerrefresh");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/components/__sublet-edit-payment";

.card-padding {
  // display: flex;
  padding: 8px;
  padding-top: 0;
  display: block;
}

.header-right-font {
  margin-left: 10rpx;
  // font-weight: bold;
  font-size: 24rpx;
  color: $uni-color-primary;
}

.list-content {
  background-color: $uni-bg-color-gray;
}

.list-item:not(:first-child) {
  border-top: 1rpx solid $uni-line-color;
}
</style>
