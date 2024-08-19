<template>
  <view v-if="ishow">
    <view :class="isBorder ? 'border-btn' : 'text-style'" @click.stop="gotoDetail"
      ><text>处理</text></view
    >
  </view>
</template>

<script>
export default {
  name: "taskBtn",
  data() {
    return {
      ishow: false,
    };
  },
  props: {
    itemData: {
      type: Object,
      default() {
        return null;
      },
    },
    isBorder: {
      type: Boolean,
      default: false,
    },
  },
  onLoad(option) {},
  watch: {
    itemData(val) {
      uni.getStorage({
        key: this.$savekey.USER_INFO_MEG,
        success: (res) => {
          this.isshowBtn(res.data.id);
        },
      });
    },
  },
  methods: {
    isshowBtn(key) {
      console.log(key, "isshowBtn");
      if (this.itemData.task && this.itemData.task.assigneeList) {
        let assigneeList = this.itemData.task.assigneeList;
        this.ishow = assigneeList.some((o) => {
          return o == key;
        });
        return;
      }
      this.ishow = false;
    },
    gotoDetail() {
      if (this.itemData.task) {
        let dict = {
          ...this.itemData.task,
        };
        console.log(dict, "gotoDetail");
        // 审批流是否在回退状态
        if (dict.taskState === "back") {
          this.dealBack(this.itemData);
        } else {
          this.dealapply(this.itemData);
        }
      }
    },
    dealapply(itemData) {
      let businessNo = itemData.businessNo;
      let item = itemData.task;
      console.log(itemData, "itemDataapply");
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
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/allot-apply?item=" +
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
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/stock-detail-check?item=" +
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
          if (itemData.dimensionType == "1") {
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
    dealBack(itemData) {
      console.log(itemData, "itemDataback");
      let item = itemData.task;
      // let businessNo=itemData.businessNo;
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
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/create-purchase?item=" +
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
          if (itemData.dimensionType == "1") {
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
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-detail-check?item=" +
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
    getBusinessDetail(item) {
      uni.showLoading();
      let url = this.$url.DATA_FORM + item.businessKey;
      let urlstr = url.replace(/xxx/, this.getUrlApi(item.processKey));
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
          } else {
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
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getUrlApi(processKey) {
      let pk = processKey ? processKey : this.processKey;
      let urlapi = "";
      switch (pk) {
        case "claim":
        case "workOut":
        case "contract":
        case "cost":
        case "pause":
        case "contractChange":
        case "contractPlus":
        case "claimAdjust":
        case "pauseAdjust":
        case "commonApprove":
          urlapi = "contractapi";
          break;
        case "invoice":
        case "proceed":
        case "refund":
        case "settlementApply":
          urlapi = "settleapi";
          break;
        case "allot":
        case "allocation":
        case "maintenance":
        case "purchase":
        case "insurance":
        case "batteryPatrol":
          urlapi = "machineapi";
          break;
        case "partsStorage":
        case "partsCollar":
        case "partsReturn":
        case "partsAllocation":
        case "partsUnitPrice":
          urlapi = "partsapi";
          break;
        default:
          urlapi = "contractapi";
          break;
      }
      return urlapi;
    },
  },
  created() {
    if (this.itemData) {
      uni.getStorage({
        key: this.$savekey.USER_INFO_MEG,
        success: (res) => {
          this.isshowBtn(res.data.id);
        },
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.text-style {
  display: flex;
  margin-left: 10px;
  font-size: $uni-font-size-base;
  justify-content: center;
  align-items: center;
  color: $uni-color-primary;
}
.border-btn {
  padding: 4px 8px;
  border-radius: 16px;
  border: 1px solid $uni-color-primary;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}
</style>
