<template>
  <view class="">
    <c-nav-bar-apply :business-key="itemData.businessKey">结清单审批</c-nav-bar-apply>
    <approve-step :itemData="itemData" @data-form="dataForm">
      <view class="contractHead">
        <p class="title">{{ formInfo.customerName }}-{{ formInfo.projectName }}</p>
        <view class="body">
          <p>合同编号：{{ c.businessNo }}</p>
          <p>区域：{{ c.orgName }}</p>
          <p>业务负责人：{{ c.contractDetailDto.customerSalesmanName }}</p>
          <p style="display: flex; justify-content: space-between; align-items: center">
            客户联系人：{{ c.contractDetailDto.contactName }}-{{
              c.contractDetailDto.phoneNum
            }}
            <i
              class="iconfont phone-icon icondianhua"
              @click.stop="$gxfmethod.callPhone(c.phoneNum)"
            ></i>
          </p>
        </view>
      </view>
      <p class="title"><span class="line"></span>结清单号（{{ formInfo.businessNo }}）</p>
      <view class="form">
        <c-form-item label="履约营收（A）">
          <text>{{ moneyUtil.dealNumber(formInfo.receiveTotal) }}</text>
        </c-form-item>
        <c-form-item label="履约欠款（A-C）">
          <text>{{ moneyUtil.dealNumber(acDiff) }}</text>
        </c-form-item>
        <c-form-item label="结算营收（A）">
          <view class="flex">
            <span class="padding-right">{{
              moneyUtil.dealNumber(settlementReceiveTotal)
            }}</span>
            <text
              class="iconfont iconxiala1 text-warn text-xs"
              style="transform: rotate(-90deg)"
            ></text>
            <text class="text-warn">{{
              moneyUtil.dealNumber(formInfo.receiptTotal)
            }}</text>
            <businessTips
              class="text-warn margin-left-sm"
              tips="结清后结算营收"
              color="#fe931f"
            />
          </view>
        </c-form-item>
        <c-form-item label="结算欠款（B-C）">
          <view class="flex">
            <text class="padding-right">{{ moneyUtil.dealNumber(bcDiff) }}</text>
            <text
              class="iconfont iconxiala1 text-warn text-xs"
              style="transform: rotate(-90deg)"
            ></text>
            <text class="text-warn">{{ moneyUtil.dealNumber(0) }}</text>
            <businessTips
              class="text-warn margin-left-sm"
              tips="结清后结算欠款"
              color="#fe931f"
            />
          </view>
        </c-form-item>
        <c-form-item label="实收金额（C）">
          <text>{{ moneyUtil.dealNumber(formInfo.receiptTotal) }}</text>
        </c-form-item>
        <c-form-item>
          <text class="text-warn">注：结清后结算营收按实收金额进入数据统计</text>
        </c-form-item>
      </view>
      <p class="title"><span class="line"></span>结清</p>
      <view class="form">
        <c-form-item :label="bcDiff > 0 ? '优惠' : '增收'">
          <text>{{ moneyUtil.dealNumber(adjustAccount) }}</text>
        </c-form-item>
        <c-form-item label="结清调整备注" is-col>
          <textarea
            v-model="formInfo.bcReason"
            class="remark"
            disabled
            placeholder-style="color:#999999"
            placeholder="请输入调整原因..."
          />
        </c-form-item>
      </view>
    </approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import approveStep from "@/components/workflow/approve-step.vue";
export default {
  components: {
    approveStep,
  },
  data() {
    return {
      workInCount: 0,
      workOutCount: 0,
      saleList: [],
      settlementList: [],
      saleSum: 0,
      itemData: {},
      formInfo: {},
      c: {
        contractDetailDto: {},
      },
    };
  },
  onLoad(option) {
    this.itemData = JSON.parse(decodeURIComponent(option.item));
  },
  computed: {
    settlementReceiveTotal() {
      return Number(this.formInfo.settlementReceiveTotal) + Number(this.saleSum);
    },
    acDiff() {
      return Number(this.formInfo.receiveTotal) - Number(this.formInfo.receiptTotal);
    },
    bcDiff() {
      return Number(this.settlementReceiveTotal) - Number(this.formInfo.receiptTotal);
    },
    adjustAccount() {
      return Math.abs(this.bcDiff);
    },
  },
  methods: {
    dataForm(val) {
      this.formInfo = JSON.parse(val);
      uni.showLoading();
      this.getContractDetail(this.formInfo.contractNo);
      this.settlementPage(this.formInfo.contractNo);
      this.salesList(this.formInfo.contractNo);
      uni.hideLoading();
    },
    async getContractDetail(contractNo) {
      let param = {
        businessNo: contractNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.c = await this.$network.getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param);
    },
    async settlementPage(contractNo) {
      let url = this.$url.SETTLE_JQLIST_DETAIL + contractNo;
      let res = await this.$network.getData(url, "GET", null);
      this.settlementList = res || [];

      this.formInfo.settlementReceiveTotal = this.settlementList.reduce((x, y) => {
        let total = y.settleInfoDto.receivable ? y.settleInfoDto.receivable.total : 0;
        return x + Number(total);
      }, 0);
    },
    /* 优惠增收 */
    async salesList(contractNo) {
      let param = {
        current: 1,
        size: 1000,
        contractNo: contractNo,
        state: "4",
      };
      let res = await this.$network.getData(this.$url.DISCOUNT_LIST, "POST", param);
      this.saleList = res.records;
      this.saleSum = 0;
      this.saleList.map((o) => {
        if (o.adjustType === "increases") {
          this.saleSum += Number(o.adjustAccount);
        } else {
          this.saleSum -= Number(o.adjustAccount);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form {
  padding: 0 24rpx;
  background: $uni-bg-color;
}

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
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

.contractHead {
  padding: 14px 0;
  margin-top: 10px;
  background: #ffffff;
  .title {
    font-size: 16px;
    color: #222222;
    font-weight: 600;
    margin-bottom: 18px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    .contractType {
      width: 22px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background-color: #f08200;
      color: #ffffff;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      margin-right: 4px;
    }
  }
  .body {
    position: relative;
    padding: 10px;
    height: 123px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 12px;
    color: #8c8c8c;
    font-weight: 400;
    background: #f6f6f6;
    margin: 0 10px;
  }
}
.phone-icon {
  padding: 4px;
  background-color: rgba(230, 0, 0, 0.08);
  color: #e60000;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}
.remark {
  height: 120px;
  background: #f6f6f6;
  border-radius: 6rpx;
  font-size: $uni-font-size-base;
  padding: 20rpx 17rpx;
  display: block;
  width: 100%;
  box-sizing: border-box;
}
</style>
