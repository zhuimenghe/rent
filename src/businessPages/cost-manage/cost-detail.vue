<template>
  <view class="content">
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap"
      >成本详情</c-nav-bar-btns
    >
    <baseCost
      :applyData="invoiceDic"
      :isFrist="false"
      ref="invoice"
      :nodeList="nodeList"
    ></baseCost>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import baseCost from "./base-cost.vue";
export default {
  components: {
    baseCost,
  },
  data() {
    return {
      navBtns: [
        {
          text: "审批流",
          type: "none",
          fontSize: "14px",
          color: "#E60000",
          width: "auto",
        },
      ],
      invoiceDic: {},
      businessNo: "",
      nodeList: [],
      downloadTask: null,
      businessKey: "20221103095843748008",
    };
  },
  watch: {},
  onUnload() {
    this.hide();
  },
  onHide() {
    this.hide();
  },
  onLoad(option) {
    console.log(option, "option");
    this.$gxfmethod.statisticData(
      this.$eventId.Settle_Administrative,
      "发票管理",
      "发票详情"
    );
    this.businessNo = option.businessNo;
    this.getInvoiceDetail();
  },
  methods: {
    ishowupdata(item) {
      return this.iscreator(item) && (item.state === "0" || item.state === "3");
    },
    onNavBarButtonTap(e) {
      //审批流
      let url =
        "/businessPages/workin/work-flow-display?businessKey=" +
        this.businessKey;
      uni.navigateTo({
        url: url,
      });
    },
    getApproveData(businessKey) {
      //审批流
      this.workflowcommon.getOnlineList(businessKey).then((result) => {
        if (result && result.length === 1) {
          //只有一条说明被驳回过，只显示上次申请的数据
          this.nodeList = result;
        } else {
          this.nodeList = result
            ? result.filter((o) => {
                return o.endTime && o.type === "completed";
              })
            : [];
        }
      });
    },
    //成本详情
    async getInvoiceDetail() {
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
      };
      let detailInfo =await this.$network.getCostDetailById(param);
	  this.invoiceDic=detailInfo;
	  this.businessKey=detailInfo.businessKey;
	  this.getApproveData(detailInfo.businessKey)
      	uni.hideLoading();
    },
    exportInvoice(item) {
      console.log(JSON.stringify(item));
      let url =
        this.$url.BASE_URL +
        "contractapi/api/invoice/download?businessNo=" +
        item.businessNo;
      let filename = "_doc/开票申请单-" + item.customerName + ".xlsx";
      this.$gxfmethod.downFunc(url, "GET", undefined, filename);

    },
    hide() {
      if (this.downloadTask) {
        console.log("invoice---hiden");
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .com-nav-bar-inner-header {
  background-color: #fff;
  padding: 0 0 0 24rpx !important;
}
.com-nav-bar {
  color: #8c8c8c;
  font-size: 20rpx !important;
}
::v-deep .header {
  .title {
    font-size: $uni-font-size-lg;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #181818;
  }
}

.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
}

.model-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px;
  background: #ffffff;
  border-radius: 4px;
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
  padding: 15px;
  align-items: center;
  font-weight: bold;
}

.sub-model-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 10px 15px;
  align-items: center;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 15px;
  margin-right: 15px;
  height: 45px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-section-view {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-start;
}

.cell-section-view-width {
  display: flex;
  flex: 1;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-section-view-width-2 {
  display: flex;
  flex: 2;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-view {
  font-size: $uni-font-size-sm;
  color: $uni-text-color;
}
</style>
