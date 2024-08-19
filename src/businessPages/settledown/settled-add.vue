<template>
  <view class="">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar flexAlign="center">新建结清单</c-nav-bar>
    <create-step
      processKey="settle"
      @submitApply="submit"
      :orgId="formInfo.orgId"
      :businessOwner="formInfo.customerSalesman"
      :model="formInfo"
      :rules="rules"
    >
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
            :disabled="bcDiff==0"
            v-model="formInfo.bcReason"
            class="remark"
            placeholder-style="color:#999999"
            placeholder="请输入调整原因..."
          />
        </c-form-item>
      </view>
    </create-step>
  </view>
</template>
<script>
import createStep from "@/components/workflow/create-step.vue";
let model = {
  businessKey: null,
  businessNo: null,
  contractDetailId: null,
  contractId: null,
  contractNo: null,
  id: null,
  receiptTotal: 0,
  receiveTotal: 0,
  settlementTotal: 0,
  settlementReceiveTotal: 0,
  customerName: null,
  projectName: null,
  contractType: null,
  orgId: null,
  increase: 0,
  reduce: 0,
  comment: null,
  acReason: "",
  bcReason: "",
};
export default {
  components: {
    createStep,
  },
  data() {
    return {
      workInCount: 0,
      workOutCount: 0,
      saleList: [],
      settlementList: [],
      contractState: null,
      saleSum: 0,
      formInfo: {
        ...model,
      },
      c: {
        contractDetailDto: {},
      },
    };
  },
  computed: {
    rules() {
      return {
        bcReason: { required: this.bcDiff, message: "结清调整备注必填" },
      };
    },
    settlementReceiveTotal() {
      return Number(this.formInfo.settlementReceiveTotal) + Number(this.saleSum);
    },
    settlementTotal() {
      let _this = this;
      if (_this.formInfo) {
        let settlementReceiveTotal = _this.formInfo.settlementReceiveTotal
          ? Number(_this.formInfo.settlementReceiveTotal)
          : 0;

        let receiptTotal = _this.formInfo.receiptTotal
          ? Number(_this.formInfo.receiptTotal)
          : 0;
        let increase = _this.formInfo.increase ? Number(_this.formInfo.increase) : 0;
        let reduce = _this.formInfo.reduce ? Number(_this.formInfo.reduce) : 0;

        return settlementReceiveTotal - receiptTotal + increase - reduce;
      }
      return 0;
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
    open(c) {
      this.init(c);
      this.$refs.pop.open();
    },
    close() {
      this.$refs.pop.close();
    },
    onLoad(options) {
      this.init(options.contractNo);
    },
    async init(contractNo) {
      uni.showLoading();
      this.formInfo = { ...model };
      await this.salesList(contractNo);
      await this.getContractInfo(contractNo);
      await this.getContractDetail(contractNo);
      await this.businessCode();
      uni.hideLoading();
    },
    async getContractInfo(contractNo) {
      let res = await this.$network.getData(
        this.$url.CONTRACT_DETAIL_RECEIVABLE + "?contractNo=" + contractNo,
        "GET",
        null
      );
      this.formInfo = {
        ...this.formInfo,
        customerName: res.customerName,
        projectName: res.projectName,
        contractType: res.contractType,
        contractNo: res.businessNo,
        customerSalesman: res.customerSalesman,
        customerSalesmanName: res.customerSalesmanName,
        contractId: res.id,
        contractDetailId: res.contractDetailId,
        receiveTotal:
          res && res.receivableCurrent && res.receivableCurrent
            ? res.receivableCurrent.total
            : 0, //营收
        receiptTotal: res && res.receipt && res.receipt.total ? res.receipt.total : 0, //实收
        settlementTotal: 0, //我也不知道这是什么
        // settlementReceiveTotal: 0, //结算营收总额
        orgId: res.orgId,
      };
      this.contractState = res.state;
      this.workInCount = res.workInCount || 0;
      this.workOutCount = res.workOutCount || 0;
      await this.settlementPage(contractNo);
    },
    async getContractDetail(contractNo) {
      let param = {
        businessNo: contractNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.c = await this.$network.getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param);
    },
    businessCode() {
      let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, "JQ");
      return this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.formInfo.businessNo = result;
        })
        .catch((err) => {});
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
    canContractSettled() {
      if (this.contractState == "6" || this.contractState == "7") {
        return this.workInCount > 0 && this.workInCount == this.workOutCount;
      }
      return this.contractState === "8";
    },
    confirm() {},
    showConfirm() {
      return new Promise((resolve, reject) => {
        uni.showModal({
          title: "结清提醒",
          content:
            "您确定结清该合同吗？结清后结算营收按实收金额计入系统，如果有差额，系统将自动为您创建“优惠/增收”单据。",
          confirmColor: "#E60000",
          success: function (res) {
            if (res.confirm) {
              resolve(true);
            } else if (res.cancel) {
              reject(false);
            }
          },
        });
      });
    },
    preWFSubmit() {
      if (this.canContractSettled()) {
        if (this.settlementList.some((o) => o.state !== "4")) {
          uni.showToast({
            title: "请审批完结算单再结清",
            icon: "none",
          });
          return false;
        } else {
          return this.showConfirm();
        }
      } else {
        uni.showToast({
          title: "当前合同状态不可结清",
          icon: "none",
        });
        return false;
      }
    },
    async submit(wfQuery) {
      let formInfo = {
        ...this.formInfo,
        adjustAccount: this.adjustAccount,
        adjustType: this.bcDiff > 0 ? "reduce" : "increases",
        // originReceiveTotal:this.formInfo.receiveTotal,
        originSettlementReceiveTotal: this.settlementReceiveTotal,
        // receiveTotal:this.formInfo.receiptTotal,
        settlementReceiveTotal: this.formInfo.receiptTotal,
        settlementTotal: Number(this.settlementTotal) + Number(this.saleSum),
      };
      await this.$network.settleAdd(formInfo, wfQuery);
      uni.showToast({ title: "提交成功" });
      uni.navigateBack();
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
