<template>
  <view class="create-contract-bg">
    <approve-step
      :updateObj="dataDic"
      :NeedUpdate="true"
      :itemData="itemData"
      @data-form="getBackData"
      :orgId="mesDic.orgId"
    >
      <baseInforMation
        :dataDic="dataDic"
        :isEdit="true"
        @clickItem="clickItem"
        @textChange="textChange"
      />
      <deviceInforMation
        ref="deviceInforMation"
        :dataDic="dataDic"
        @deleteItem="deleteItem"
        contractType="1"
        listKey="orderList"
      />
      <settleInforMation
        @clickSelect="clickSelect"
        @textChange="textChange"
        @prePayChange="handleprePayChange"
        @invoiceChange="handleinvoiceChange"
        :dataDic="dataDic"
        @clickItem="clickItem"
        :settlementObj="settlementObj"
        :isEdit="true"
      />
      <projectInforMation
        @minTenancyChange="handleMinTenancyChange"
        @textChange="textChange"
        @clickItem="clickItem"
        :itemData="itemData"
        :dataDic="dataDic"
        :isEdit="true"
      />
      <authorizedPersonInformation
        ref="authorizedPersonInformation"
        :isEdit="true"
        @dialog="handleDialog"
        :isShowArrow="true"
        @textChange="textChange"
        :dataDic="dataDic"
      />
      <supplementInforMation
        :dataDic="dataDic"
        :isEdit="true"
        @clickItem="clickItem"
        @textChange="textChange"
      />
    </approve-step>
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import baseInforMation from "@/contractPages/contract/create-contract-components/base-information.vue";
import deviceInforMation from "@/contractPages/contract/create-contract-components/device-information.vue";
import authorizedPersonInformation from "@/contractPages/contract/create-contract-components/authorized-person-information.vue";
import settleInforMation from "@/contractPages/contract/create-contract-components/settle-information.vue";
import projectInforMation from "@/contractPages/contract/create-contract-components/project-information.vue";
import supplementInforMation from "@/contractPages/contract/create-contract-components/supplement-information.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import contractMixin from "./contractMixin/index.js";
export default {
  mixins: [contractMixin],
  components: {
    approveStep,
    baseInforMation,
    deviceInforMation,
    authorizedPersonInformation,
    settleInforMation,
    projectInforMation,
    supplementInforMation,
    wPicker,
  },
  data() {
    return {
      dataDic: {},
      itemData: {}, //退回null
    };
  },
  onLoad(option) {
    if (option.item) {
      this.itemData = JSON.parse(decodeURIComponent(option.item));
    }
  },
  methods: {
    getBackData(val) {
      this.mesDic = JSON.parse(val);
      let contractDetailDtoDic = this.mesDic.contractDetailDto
        ? this.mesDic.contractDetailDto
        : {};

      let monthConfig =
        (contractDetailDtoDic && contractDetailDtoDic.monthConfig !== undefined) ||
        contractDetailDtoDic.monthConfig !== null
          ? contractDetailDtoDic.monthConfig
          : "30";
      this.settlementObj = {
        ...this.settlementObj,
        value: monthConfig,
        label: monthConfig === "0" ? "自然月" : "30天为一个月",
      };
      this.dataDic = {
        tripCalType: "0",//按台计费测试使用
        ...this.dataDic,
        ...this.mesDic,
        ...contractDetailDtoDic,
        isShowMinTenancy: contractDetailDtoDic.minTenancy ? true : false,
        monthConfig: this.settlementObj.value,

      };
      this.calTotal();
    },
    calTotal() {
      let total = this.dataDic.orderList.reduce((x, y) => {
        return x + Number(y.total);
      }, 0);
      this.dataDic = {
        ...this.dataDic,
        totalMoney: total,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.create-contract-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
  width: 100%;
  padding: 10px 0px;
}
</style>
