<template lang="">
  <uni-popup ref="pop" type="center" :mask-click="true">
    <view class="padding-lg container radius">
      <view class="text-bold text-lg">结清合同</view>
      <view class="margin-top-xl padding-tb-sm">
        结算营收：{{moneyUtil.dealNumber(settlementReceiveTotal)}}
      </view>
      <view class=" padding-tb-sm">履约营收：{{moneyUtil.dealNumber(formInfo.receiveTotal)}}</view>
      <view class=" padding-tb-sm">实收金额：{{moneyUtil.dealNumber(formInfo.receiptTotal)}}</view>
      <view class="margin-top">
        <view class="">结算营收与实收差额：{{moneyUtil.dealNumber(bcDiff)}}</view>
        <input placeholder="请输入差额原因" v-model="formInfo.bcReason" class="text-df margin-tb-sm radius padding-tb-sm padding-left" type="text">
      </view>
      <view class="margin-top">
        <view class="">履约营收与实收差额：{{moneyUtil.dealNumber(acDiff)}}</view>
        <input placeholder="请输入差额原因" v-model="formInfo.acReason" class="text-df margin-tb-sm radius padding-tb-sm padding-left" type="text">
      </view>
      <view class="text-warn text- margin-tb-lg">结清后履约营收、结算营收统一按实收金额计入统计</view>
      <view class="margin-top flex">
        <view class="z-btn radius bg-light-gray light flex-1" @click="close">取消</view>
        <view class="z-btn radius bg-primary flex-1 margin-left" @click="confirm">确定</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
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
  acReason:'',
  bcReason:''
}
export default {
  components:{
    // uniPopup
  },
  data(){
    return{
      workInCount:0,
      workOutCount:0,
      saleList:[],
      settlementList:[],
      contractState:null,
      saleSum:0,
      formInfo:{
        ...model
      }
    }
  },
  computed:{
    settlementReceiveTotal(){
      return Number(this.formInfo.settlementReceiveTotal)+Number(this.saleSum)
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
        let increase = _this.formInfo.increase
          ? Number(_this.formInfo.increase)
          : 0;
        let reduce = _this.formInfo.reduce ? Number(_this.formInfo.reduce) : 0;

        return settlementReceiveTotal - receiptTotal + increase - reduce;
      }
      return 0;
    },
    acDiff(){
      return Number(this.formInfo.receiveTotal)-Number(this.formInfo.receiptTotal)
    },
    bcDiff(){
      return Number(this.settlementReceiveTotal)-Number(this.formInfo.receiptTotal)
    },
  },
  methods:{
    open(c){
      this.init(c)
      this.$refs.pop.open()
    },
    close(){
      this.$refs.pop.close()
    },
    async init(c){
      uni.showLoading();
      this.formInfo={...model}
      await this.salesList(c.businessNo);
      await this.getContractInfo(c.businessNo);
      await this.businessCode();
      uni.hideLoading();
    },
    async getContractInfo(contractNo){
      let res = await this.$network.getData(
        this.$url.CONTRACT_DETAIL_RECEIVABLE +
          "?contractNo=" +contractNo,
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
        receiptTotal:
          res && res.receipt && res.receipt.total ? res.receipt.total : 0, //实收
        settlementTotal: 0, //我也不知道这是什么
        settlementReceiveTotal: 0, //结算营收总额
        orgId: res.orgId
      };
      this.contractState = res.state;
      this.workInCount = res.workInCount || 0;
      this.workOutCount = res.workOutCount || 0;
      await this.settlementPage(contractNo);
    },
    businessCode() {
      let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'JQ')
      return this.$network.getData(url, "GET", null).then((result) => {
        this.formInfo.businessNo = result;
      }).catch((err) => {

      })
    },
    async settlementPage(contractNo) {
      let url = this.$url.SETTLE_JQLIST_DETAIL + contractNo
			let res = await this.$network.getData(url, 'GET', null)
      this.settlementList = res || [];

      this.formInfo.settlementReceiveTotal = this.settlementList.reduce(
        (x, y) => {
          let total = y.settleInfoDto.receivable
            ? y.settleInfoDto.receivable.total
            : 0;
          return x + Number(total);
        },
        0
      );
    },
    /* 优惠增收 */
    async salesList(contractNo) {
      let param = {
				current: 1,
				size: 1000,
				contractNo: contractNo,
        state:'4'
		
			};
			let res = await this.$network.getData(this.$url.DISCOUNT_LIST, 'POST', param)
      this.saleList = res.records;
      this.saleSum = 0;
      this.saleList.map(o => {
        if (o.adjustType === "increases") {
          this.saleSum += Number(o.adjustAccount);
        } else {
          this.saleSum -= Number(o.adjustAccount);
        }
      });
    },
    canContractSettled() {
      if (this.contractState == "6") {
        return this.workInCount > 0 && this.workInCount == this.workOutCount;
      }
      return this.contractState === "8";
    },
    confirm(){
      if (this.canContractSettled()) {
        if(this.acDiff!=0&&this.formInfo.acReason==''){
          return uni.showToast({
            title: "请输入履约营收调整原因", icon: "none" 
          });
        }
        if(this.bcDiff!=0&&this.formInfo.bcReason==''){
          return uni.showToast({
            title: "请输入结算营收调整原因", icon: "none" 
          });
        }
        if (this.settlementList.some(o => o.state !== "4")) {
          return uni.showToast({
            title: "请审批完结算单再结清", icon: "none" 
          });
        } else {
          this.submit();
        }
      } else {
        this.$message.error("当前合同状态不可做结清操作....");
      }
    },
    async submit() {
      let formInfo = {
        ...this.formInfo,
        originReceiveTotal:this.formInfo.receiveTotal,
        originSettlementReceiveTotal:this.settlementReceiveTotal,
        receiveTotal:this.formInfo.receiptTotal,
        settlementReceiveTotal:this.formInfo.receiptTotal,
        settlementTotal: Number(this.settlementTotal) + Number(this.saleSum)
      };
      await this.$network.settleAdd(formInfo)
      uni.showToast({title:'提交成功'})
      this.close()
    },
  }
}
</script>
<style lang="scss">
  .container{
    background: white;
    input{
      border: 1rpx solid #E6E6E6;
    }
  }
</style>