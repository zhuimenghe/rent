<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view v-for="(msg, i) in msgList" :key="i">
      <view class="item-container">
        <view class="t-top">
          <view class="num-view">{{ msg.processName }}</view>
          <view class="state-view">{{ msg.stateName || "-" }}</view>
        </view>
        <view class="t-middle">
          <view class="item-row">
            <view class="title-view">审批进度</view>
            <view>{{ msg.name || "-" }}</view>
          </view>
          <view class="item-row">
            <view class="title-view">接收时间</view>
            <view>{{ msg.createTime }}</view>
          </view>
          <view class="item-row">
            <view class="title-view">申请人</view>
            <view>{{ msg.applyer }}</view>
          </view>
          <view class="item-row">
            <view class="title-view">业务单号</view>
            <view style="color: #e60000" @click="goDetail(msg)">{{
              msg.businessNo
            }}</view>
          </view>
        </view>
        <view class="t-bottom"
          ><view class="option-view" @click="dealBusiness(msg)">处理</view></view
        >
      </view>
    </view>
    <view><uni-load-more iconType="auto" :status="status" /></view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
      status: "more",
      msgList: [],
    };
  },
  created() {
    this.loadMsgList();
  },
  methods: {
    loadMsgList(processKey, nodeName, fuzzyParam, state, startDate, endDate) {
      this.status = "loading";
      let param = {
        current: this.page,
        size: this.pageSize,
      };
      if (processKey) {
        param = {
          ...param,
          processKey: processKey,
        };
      }
      if (nodeName) {
        param = {
          ...param,
          name: nodeName,
        };
      }
      if (fuzzyParam) {
        param = {
          ...param,
          fuzzyParam: fuzzyParam,
        };
      }
      if (state) {
        param = {
          ...param,
          state: state,
        };
      }
      if (startDate) {
        param = {
          ...param,
          beginDate: startDate + " 00:00:00",
        };
      }
      if (endDate) {
        param = {
          ...param,
          endDate: endDate + " 23:59:59",
        };
      }

      this.$network
        .getData(this.$url.TO_DO_LIST, "POST", param)
        .then((result) => {
          this.msgList = this.msgList.concat(result.records);
          let pages = result.pages;
          if (pages <= this.page) {
            this.status = "noMore";
          } else {
            this.status = "more";
          }
          uni.stopPullDownRefresh();
        })
        .catch((err) => {
          this.status = "noMore";
          uni.stopPullDownRefresh();
        });
    },
    getTagName(processName) {
      if (processName && processName.indexOf("[")) {
        return processName.substring(0, processName.indexOf("["));
      }
      return "";
    },
    goDetail(item) {
      switch (item.processKey) {
        case "workIn":
          uni.navigateTo({
            url: "/businessPages/workin/workin-detail?businessNo=" + item.businessNo,
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-simple-detail?businessNo=" + item.businessNo,
          });
          break;
        case "invoice":
          uni.navigateTo({
            url: "/businessPages/invoice/invoice-detail?businessNo=" + item.businessNo,
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url: "/businessPages/proceed/porceeds-detail?businessNo=" + item.businessNo,
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" + item.businessNo,
          });
          break;
        case "cost":
          uni.navigateTo({
            url: "/businessPages/cost-manage/cost-detail?businessNo=" + item.businessNo,
          });
          break;
        case "claim":
          uni.navigateTo({
            url: "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url: "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contract":
          uni.navigateTo({
            url: "/contractPages/contract/contract-detail?businessNo=" + item.businessNo,
          });
          break;
        case "expressContract":
          uni.navigateTo({
            url: "/contractPages/contract/contract-detail?businessNo=" + item.businessNo,
          });
          break;
        case "workOut":
          uni.navigateTo({
            url: "/businessPages/workout/workout-detail?businessNo=" + item.businessNo,
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/workout-detail-simple?businessNo=" +
              item.businessNo,
          });
          break;
        case "pause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "contractChange":
          uni.navigateTo({
            // url: '/contractPages/contract-change/contract-change-detail?businessNo=' + item.businessNo
            url:
              "/contractPages/contract-change/contract-change-detail?id=" + item.tableId,
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/contract-expense-detail?businessKey=" +
              item.businessKey,
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/repair-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url: "/devicePages/maintain/maintain-detail?businessNo=" + item.businessNo,
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/stock-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlement":
          uni.navigateTo({
            url: "/businessPages/settledown/settle-detail?businessNo=" + item.businessNo,
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail?businessNo=" + item.businessNo,
          });
          break;
        case "settle":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-finish-detail-show?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "inspection":
          uni.navigateTo({
            url: "/devicePages/polling/polling-detail?businessNo=" + item.businessNo,
          });
          break;
        case "insurance":
          uni.navigateTo({
            url: "/devicePages/insurance/insurance-detail?businessNo=" + item.businessNo,
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/sublet-apply-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-detail?businessNo=" + item.businessNo,
          });
          break;

        case "purchase":
          uni.navigateTo({
            url: "/devicePages/purchase/purchase-detail?businessNo=" + item.businessNo,
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/acc-storagein-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/acc-recelive-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/acc-back-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/acc-allot-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "allocation":
          uni.navigateTo({
            url: "/devicePages/allot/allot-detail?businessNo=" + item.businessNo,
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/add-record-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/battery-polling-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "settlementApply":
          this.loadSettlementApplyData(item.businessNo);
          break;
        case "commonApprove":
          uni.navigateTo({
            url: "/businessPages/workflow/common-approve-detail?key=" + item.businessNo,
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端查看",
          });
          break;
      }
    },
    loadSettlementApplyData(key) {
      let param = {
        businessNo: key,
      };
      this.$network
        .getData(this.$url.APPLY_DATEIL, "GET", param)
        .then((result) => {
          console.log(result.dimensionType);
          if (result.dimensionType == "1") {
            //客户维度
            uni.navigateTo({
              url:
                "/businessPages/settle-apply/customer/application-customer-detail?businessNo=" +
                key,
            });
          } else {
            uni.navigateTo({
              url:
                "/businessPages/settle-apply/contract/application-contract-detail?businessNo=" +
                key,
            });
          }
        })
        .catch((err) => {});
    },
    dealBusiness(item) {
      let url = this.$url.WORKFLOW_FINISH_STATE + item.id;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          console.log(result, "result");
          console.log(item, "item");
          if (result.taskType == "1") {
            if (item.taskState === "back") {
              this.dealBack(item);
            } else {
              this.dealapply(item);
            }
          } else {
            this.goDetail(item);
          }
        })
        .catch((err) => {
          if (item.taskState === "back") {
            this.dealBack(item);
          } else {
            this.dealapply(item);
          }
        });
    },
    dealapply(item) {
      switch (item.processKey) {
        case "claim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contract":
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressContract":
          uni.navigateTo({
            url:
              "/contractPages/contract/contract-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workIn":
          uni.navigateTo({
            // url: '/businessPages/workin/creat-workin?item=' + encodeURIComponent(JSON.stringify(item))
            url:
              "/businessPages/workin/create-workin-step-all?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/invoice-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/proceeds-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "cost":
          uni.navigateTo({
            url:
              "/businessPages/cost-manage/cost-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/workout-simple-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/allot-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "pause":
          uni.navigateTo({
            url:
              "/businessPages/pause/pause-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url:
              "/businessPages/pause/pause-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractChange":
          uni.navigateTo({
            url:
              "/contractPages/contract-change/contract-change-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/contract-expense-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "commonApprove":
          uni.navigateTo({
            url:
              "/businessPages/workflow/common-approve-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/reparir-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url:
              "/devicePages/maintain/maintain-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/stock-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settle":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-finish-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/purchase-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/acc-storagein-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/acc-recelive-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/acc-back-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/acc-allot-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/sublet-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/add-record-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url:
              "/devicePages/insurance/insurance-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "apply");
          break;
        case "inspection":
          uni.navigateTo({
            url:
              "/devicePages/polling/polling-detail-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-apply?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/battery-polling-check?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    dealBack(item) {
      // let businessNo=item.businessNo;
      switch (item.processKey) {
        case "claim":
          // this.getBusinessDetail(item)
          uni.navigateTo({
            url:
              "/businessPages/claim/creat-claim?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url:
              "/businessPages/claim/create-claim-service?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contract":
          if (item.businessNo.substr(0, 3) === "KHT") {
            //框架合同
            uni.navigateTo({
              url:
                "/contractPages/contract-kit/create-contract-kit?item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          } else {
            uni.navigateTo({
              url:
                "/contractPages/contract/create-contract?item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          }
          break;
        case "expressContract":
          uni.navigateTo({
            url:
              "/contractPages/contract/create-contract-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workIn":
          uni.navigateTo({
            // url: '/businessPages/workin/creat-workin?item=' + encodeURIComponent(JSON.stringify(item))
            url:
              "/businessPages/workin/create-workin-step-all?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-simple?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractChange":
          uni.navigateTo({
            url:
              "/contractPages/contract-change/create-contract-change?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&id=" +
              item.tableId,
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/create-contract-expense?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/create-invoice?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/creat-reimburse?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "cost":
          uni.navigateTo({
            url:
              "/businessPages/cost-manage/create-cost?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "pause":
          // this.getBusinessDetail(item)
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause-service?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "commonApprove":
          uni.navigateTo({
            url:
              "/businessPages/workflow/common-approve?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/create-repair?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url:
              "/devicePages/maintain/create-maintain?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/create-service?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=1",
          });
          break;
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/create-allot?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/create-purchase?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/create-acc-storagein?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/create-acc-recelive?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/create-acc-back?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/create-acc-allot?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/create-sublet?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/create-add-record?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url:
              "/devicePages/insurance/create-insurance?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "back");
          break;
        case "inspection":
          uni.navigateTo({
            url:
              "/devicePages/polling/create-polling?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-create?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/create-battery-polling?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlement":
          console.log(1111111111);
          uni.navigateTo({
            url: "/businessPages/settledown/settle-add?businessNo=" + item.businessNo,
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    getBusinessDetail(item, type) {
      uni.showLoading();
      let url = this.$url.DATA_FORM + item.businessKey;
      let urlstr = url.replace(/xxx/, this.$datestr.getUrlApi(item.processKey));
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let resultDic = JSON.parse(result);
          if (item.processKey === "claim") {
            if (resultDic.category === "service") {
              uni.navigateTo({
                url:
                  "/businessPages/claim/create-claim-service?item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/claim/creat-claim?item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "pause") {
            if (resultDic.category === "service") {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause-service?item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause?item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "settlementApply") {
            if (type == "back") {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-create?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-create?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              }
            } else {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-apply?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-apply?item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              }
            }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    refreshheader(processKey, nodeName, fuzzyParam, state, startDate, endDate) {
      this.page = 1;
      this.msgList = [];
      this.loadMsgList(processKey, nodeName, fuzzyParam, state, startDate, endDate);
    },
    refreshhfooter(processKey, nodeName, fuzzyParam, startDate, state, endDate) {
      if (this.status == "noMore") {
        return;
      }
      this.page += 1;
      this.loadMsgList(processKey, nodeName, fuzzyParam, state, startDate, endDate);
      this.morestatus = "loading";
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  background-color: $uni-bg-color-grey;
}

.item-container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 4px;
  margin: 8px;
  padding: 8px;
}

.t-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.num-view {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
  flex: 1;
}

.state-view {
  min-width: 64px;
  text-align: end;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.t-middle {
  display: flex;
  flex-direction: column;
  margin: 8px 0px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-bottom: 8px;
}

.title-view {
  width: 70px;
}

.t-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.option-view {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
}
</style>
