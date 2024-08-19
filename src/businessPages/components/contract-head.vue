<template>
  <view class="contractHead">
    <p class="title">{{ contractDic.customerName }}-{{ contractDic.projectName }}</p>
    <view class="body">
      <p>合同编号：{{ contractDic.contractNo || "-" }}</p>
      <p>区域：{{ contractDic.orgName }}</p>
      <p>业务负责人：{{ contractDic.customerSalesmanName }}</p>
      <p style="display: flex; justify-content: space-between; align-items: center">
        客户联系人：{{ contactName || "" }}{{ "-" + phoneNum || "" }}
        <i class="iconfont phone-icon icondianhua" @click.stop="callPhone(phoneNum)"></i>
      </p>
    </view>
  </view>
</template>
<script>
export default {
  name: "contract-head",
  data() {
    return {
      contractObj: {},
    };
  },
  props: {
    contractDic: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    phoneNum() {
      return (
        (this.contractObj.contractDetailDto &&
          this.contractObj.contractDetailDto.phoneNum) ||
        this.contractDic.phoneNum ||
        (this.contractDic.contractDetailDto &&
          this.contractDic.contractDetailDto.phoneNum)
      );
    },
    contactName() {
      return (
        (this.contractObj.contractDetailDto &&
          this.contractObj.contractDetailDto.contactName) ||
        this.contractDic.contactName ||
        (this.contractDic.contractDetailDto &&
          this.contractDic.contractDetailDto.contactName)
      );
    },
  },
  watch: {
    "contractDic.contractNo": {
      handler(val) {
        if (val) {
          this.getContractDetail(val);
        }
      },
    },
  },
  methods: {
    async getContractDetail(contractNo) {
      this.contractObj = await this.$network.getData(
        this.$url.CONTRACT_DEATIL_BY_NO + "?businessNo=" + contractNo,
        "GET",
        null
      );
    },
    callPhone(phoneNum) {
      this.$emit("callPhone", phoneNum);
    },
  },
};
</script>
<style scoped lang="scss">
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
</style>
