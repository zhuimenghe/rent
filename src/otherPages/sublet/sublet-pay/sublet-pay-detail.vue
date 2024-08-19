<template>
  <view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">转租应付详情</c-nav-bar-btns>
    <!-- 公司详情-头部 -->
    <company-header :companyInfo="companyDic"></company-header>
    <p class="title">
      <span class="line"></span>
      <text style="flex: 1">应付单号：{{ settleDic.businessNo || "--" }}</text>
      <!-- <text @click="selectApply" class="sublet-button"> 选择转租单 </text> -->
    </p>
    <payment-form :externalPaymentForm="formInfo" :businessNo="settleDic.businessNo" :isPreview="true"></payment-form>
    <p class="title">
      <span class="line"></span>
      <text>结算成本汇总</text>
    </p>
    <payment-total :externalPaymentTotal="formInfo" :businessNo="settleDic.businessNo" :isPreview="true"></payment-total>
    <view style="padding-bottom:210rpx"></view>
    <!-- 底部固定按钮 -->
    <view class="fixed-button">
      <view class="payment-summary">
        <view>汇总：<text class="text-red-color">￥{{ moneyUtil.dealNumber(receivableTotal) }}</text></view>
        <view class="text-orange-color">{{ getSummary }}</view>
      </view>
      <!-- <view class="payment-button">
        <view class="cancel-button button" @click="handleBCanclePayment">取消</view>
        <view class="submit-button button" @click="handleBAddPayment">生成应付单</view>
      </view> -->
    </view>
  </view>
</template>
<script>
import companyHeader from "../sublet-apply/sublet-company/components/company-header.vue";
import paymentForm from "./components/payment-form/index.vue";
import paymentTotal from "./components/payment-total/index.vue";
import subMonths from "date-fns/subMonths";
export default {
  components: {
    companyHeader, paymentForm, paymentTotal
  },
  data() {
    return {
      buttons: [
      ],
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      textColor: "#333333",
      fontSize: "14px",
      settleDic: {},
      companyDic: {},
      formInfo: {
        id: null,
        createBy: null,
        createName: null,
        createTime: null,
        updateBy: null,
        updateName: null,
        updateTime: null,
        delFlag: 0,
        start: null,
        end: null,
        businessNo: '',
        subletCompanyId: '',
        subletNo: null,
        beginDate: '',
        endDate: '',
        total: 0,
        increase: null,
        paidTotal: 0,
        paidRemark: '',
        reduce: null,
        settleInfoDto: {
          payableCurrent: {
            total: '',
            price: '',
            freight: '',
            laborCost: '',
            other: '',
            pauseHire: null,
            beginDate: null,
            endDate: null,
          },
          payable: {
            total: 0,
            price: 0,
            freight: 0,
            laborCost: '',
            other: 0,
            pauseHire: null,
            beginDate: '',
            endDate: '',
          },
          paidTotal: null,
          subletPayableList: [
          ]

        },
        remark: null,
        payableCurrent: null,
        subletCompanyName: null,
        contact: null,
        phone: null,
        userName: null,
        orgName: null,
        address: null,
        settlementNos: [],
        deposit: 0,
      }, // 内部用于处理的数据,
      selectIds: [],
      isDetail: true,
      downloadTask: null,
      isupdata: true,
      settlementType: "generateSettle",
    };
  },
  computed: {
    getSummary() {
      return `本次结算剩余应付：当期转租成本 ¥${this.formInfo.settleInfoDto.payable.total || 0} - 已付 ¥${this.formInfo.paidTotal || 0}`
    },
    receivableTotal() {
      let _this = this.formInfo.settleInfoDto;
      if (!_this.payable || _this.payable.total === undefined || _this.payable.total === null) {
        return 0;
      }
      this.formInfo.total = Number(_this.payable.total) - this.formInfo.paidTotal;
      return this.formInfo.total;
    },
  },
  created() {
    // 事件监听
    uni.$on("choose-apply-emit", (data) => {
      const checkList = data.checkList;
      this.selectIds = checkList.map((o) => o.businessNo);
      let beginDate = this.$dateUtil.dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 00:00:00";
      let endDate = this.$dateUtil.dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 23:59:59";
      this.$network
        .getData(this.$url.SUBLET_PAY_GET, "POST", {
          subletNoList: this.selectIds,
          beginDate: beginDate,
          endDate: endDate,
        })
        .then((res) => {
          // this.formInfo = res;
          this.setFormInfo(res);
        });
    });
  },
  onLoad(option) {
    let dict = JSON.parse(decodeURIComponent(option.item))
    this.loadData(dict)
    console.log('-----------------dict', dict)
    // this.businessCode();
    // this.companyDic = JSON.parse(decodeURIComponent(option.company));


    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isupdata = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_DOWNLOAD
        );
      },
    });
    if (this.isupdata === false) {
      // #ifdef APP-PLUS
      let webView = this.$mp.page.$getAppWebview();
      webView.setTitleNViewButtonStyle(0, {
        width: "0",
      });
      // #endif
      // #ifndef APP-PLUS
      this.buttons = [];
      // #endif
    }
  },
  onUnload() {
    this.hide();
  },
  onHide() {
    this.hide();
  },
  methods: {
    setFormInfo(info) {
      let settlementNos = !info.settlementNos ? this.settleNoList : info.settlementNos;

      let list =
        info.settleInfoDto && info.settleInfoDto.subletPayableList
          ? info.settleInfoDto.subletPayableList.map((o) => {
            return {
              ...o,
              // 此处需要修改
              // machinePayableList: this.isEdit
              //   ? o.machinePayableList.filter((y) => {
              //     let beginDate = new Date(this.$escapeDate(y.beginDate)).getTime();
              //     let endDate = new Date(this.$escapeDate(y.endDate)).getTime();

              //     if ((!y.lastSettleDate && !y.lastApplySettleDate) || settlementNos.length > 0) {
              //       return beginDate <= endDate;
              //     }
              //     let lastSettleDate = null;
              //     if (y.lastSettleDate) {
              //       lastSettleDate = new Date(this.$escapeDate(y.lastSettleDate)).getTime();
              //     } else {
              //       lastSettleDate = new Date(this.$escapeDate(y.lastApplySettleDate)).getTime();
              //     }

              //     if (y.lastApplySettleDate) {
              //       let lastApplySettleDate = new Date(this.$escapeDate(y.lastApplySettleDate)).getTime();
              //       lastSettleDate = lastApplySettleDate > lastSettleDate ? lastApplySettleDate : lastSettleDate;
              //     }
              //     return beginDate <= endDate && lastSettleDate < endDate;
              //   })
              //   : [...o.machinePayableList],
            };
          })
          : [];

      this.formInfo = {
        ...info,
        // customerSalesman: customerSalesman,
        settleInfoDto: {
          ...info.settleInfoDto,
          subletPayableList: list.map((o) => {
            return {
              ...o,
              checked: true,
              settlementCycle: [
                o.beginDate ? this.$dateUtil.dateSFormat(o.beginDate) : this.$dateUtil.dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 00:00:00",
                o.endDate ? this.$dateUtil.dateSFormat(o.beginDate) : this.$dateUtil.dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 23:59:59",
              ],
              machinePayableList: o.machinePayableList.map((y) => {
                return {
                  ...y,
                  checked: true,
                  settlementCycle: [
                    y.beginDate ? this.$dateUtil.dateSFormat(y.beginDate) : this.$dateUtil.dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 00:00:00",
                    y.endDate ? this.$dateUtil.dateSFormat(y.endDate) : this.$dateUtil.dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss").split(" ")[0] + " 23:59:59",
                  ],
                  adjust: Number(y.increase || 0) - Number(y.reduce || 0)
                };
              }),
            };
          }),
        },
        settlementNos: settlementNos,
      };
      console.log('-------------------  this.formInfo', this.formInfo)
    },
    onNavBarButtonTap() {
      if (this.isupdata === false) {
        uni.showToast({
          icon: "none",
          title: "暂无下载权限...",
        });
        return;
      } else {
        uni.showModal({
          title: "提示",
          content: "确定要导出应付单报表么?",
          success: (res) => {
            if (res.cancel) {
            } else {
              this.exportInvoice(this.settleDic);
            }
          },
        });
      }
    },
    loadData(dict) {
      uni.showLoading();
      let param = {
        businessNo: dict.businessNo,
      };
      this.$network
        .getData(this.$url.SUBLET_PAY_DETAIL, "GET", param)
        .then((result) => {
          console.log(result)
          if (dict) {
            this.companyDic.id = result.subletCompanyId
            this.companyDic.name = result.subletCompanyName
            this.companyDic.orgName = result.orgName
            this.companyDic.contact = result.contact
            this.companyDic.address = result.address
            this.companyDic.phone = result.phone
          }
          this.settleDic = {
            ...result,
          };
          this.formInfo = {
            ...result
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    businessCode() {
      if (!this.isDetail) {
        this.$network.getData(this.$url.CREATE_MACHINE_NO, "GET", { prefix: "ZZYF" }).then((res) => {
          this.$set(this.settleDic, "businessNo", res);
        });
      }
    },
    selectApply() {
      let checkedList = this.formInfo.settleInfoDto.subletPayableList.map(item => item.subletNo);;
      let state = { batchEditMode: 'select' }
      let url = `../sublet-tab?index=0&companyId=${this.settleDic.subletCompanyId}&companyName=${this.settleDic.subletCompanyName
        }&applyState=${JSON.stringify(state)}&checkedList=${encodeURIComponent(JSON.stringify(checkedList))}`
      uni.navigateTo({
        url: url,
      });
    },
    hide() {
      if (this.downloadTask) {
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },



  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_sublet-styles";

.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.sublet-button {
  width: 156rpx;
  padding: 0 10rpx;
  height: 56rpx;
  background: #E60000;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-right: 32rpx;
}

.pause-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  // margin: 10px;
  background: #ffffff;
  // border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px solid;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.text-style {
  flex: 1;
  text-align: right;
}

.input-style {
  text-align: right;
  // border-width: 0px 0px 1px 0px;
  // border-style: solid;
  // border-color: $uni-bg-color-grey;
  width: 140px;
  height: 35px;
}

.model-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  padding: 15px;
  align-items: center;
}

.tag-right,
.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.labelstyle {
  color: $uni-color-primary;
  font-size: 24px;
  margin-left: 10px;
}

.attachment-icon {
  color: $uni-color-primary;
  font-size: 14px;
  margin-left: 10px;
}

.delete-items-icon {
  color: #ff0000;
  font-size: 14px;
  margin-left: 10px;
}

.vehicle-list-container {
  padding: 15px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.item-row tag-select {
  flex: 1;
}

.pause-options {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $uni-color-primary;
}

.item-row text {
  flex: 1;
}

.line-s {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 1px;
  background: #eeeeee;
}

.fixed-button {
  display: flex;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.20);
  flex-direction: column;
  height: 150rpx;
  z-index: 90;

  .payment-summary {
    width: 100%;

    .text-red-color {
      color: #E60000;
    }

    .text-orange-color {
      color: #F08200
    }
  }

  .payment-button {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
