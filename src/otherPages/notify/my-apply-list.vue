<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view v-for="(msg, i) in msgList" :key="i">
      <view class="item-container">
        <view class="t-top">
          <view class="num-view">{{ msg.title }}</view>
          <view class="state-view">{{ msg.stateName || "-" }}</view>
        </view>
        <view class="t-middle">
          <view class="item-row">
            <view class="title-view">审批进度</view>
            <view>{{ msg.taskName || "-" }}</view>
          </view>
          <view class="item-row">
            <view class="title-view">申请时间</view>
            <view>{{ msg.createTime }}</view>
          </view>
          <view class="item-row">
            <view class="title-view">业务单号</view>
            <view style="color: #e60000" @click="gotodetal(msg)">{{
              msg.businessNo
            }}</view>
          </view>
        </view>
        <view class="t-bottom">
          <view class="option-view" @click="gotodetal(msg)">详情</view>
          <!--只有审批中（1）的可以撤回，草稿状态（3）可以修改-->
          <view
            class="option-view"
            style="margin-left: 20px"
            @click="dealBusiness(msg)"
            v-if="msg.state === 1"
            >撤回</view
          >
          <view
            class="option-view"
            style="margin-left: 20px"
            @click="deleteBusiness(msg)"
            v-if="msg.createBy === createBy && msg.state === 3 && showDelete(msg)"
          >
            删除
          </view>
          <view
            class="option-view"
            style="margin-left: 20px"
            @click="editBusiness(msg)"
            v-if="msg.createBy === createBy && msg.state === 3"
            >修改</view
          >
        </view>
      </view>
    </view>
    <view><uni-load-more iconType="auto" :status="status" /></view>
    <remarkpop ref="remarkpop" @RemarkSum="choosNode" :mask-click="false" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import remarkpop from "@/components/common/uni-popup/remark-pop.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
export default {
  components: {
    uniLoadMore,
    remarkpop,
    selectView,
    wPicker,
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
      status: "more",
      msgList: [],
      dataDic: {},
      pickType: "",
      createBy: "",
    };
  },
  created() {
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.createBy = res.data.id;
      },
    });
    uni.showLoading();
    this.loadMsgList();
  },
  methods: {
    choosNode(val) {
      uni.showLoading();
      let param = {
        id: this.dataDic.id,
        procInstId: this.dataDic.procInstId,
        comment: val.remark,
      };
      let url = this.$url.BACK_MY_APPLY;
      let urlstr = url.replace(/xxx/, this.$datestr.getUrlApi(this.dataDic.processKey));
      console.log(urlstr);
      this.$network
        .getData(urlstr, "POST", param)
        .then((result) => {
          this.refreshheader();
          uni.$emit("refresh-contract-list", {
            type: "apply",
          });
          this.$refs.remarkpop.close();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: "none",
          });
          uni.hideLoading();
          this.$refs.remarkpop.close();
        });
    },
    getTagName(processName) {
      if (processName && processName.indexOf("[")) {
        return processName.substring(0, processName.indexOf("["));
      }
      return "";
    },
    loadMsgList(processKey, nodeName, state, fuzzyParam, startDate, endDate) {
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
        .getData(this.$url.MY_APPLY_LIST, "POST", param)
        .then((result) => {
          this.msgList = this.msgList.concat(result.records);
          let pages = result.pages;
          if (pages <= this.page) {
            this.status = "noMore";
          } else {
            this.status = "more";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.status = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    dealBusiness(item) {
      this.dataDic = item;
      this.$refs.remarkpop.open();
    },
    refreshheader(processKey, nodeName, state, fuzzyParam, startDate, endDate) {
      this.page = 1;
      this.msgList = [];
      this.loadMsgList(processKey, nodeName, state, fuzzyParam, startDate, endDate);
    },
    refreshhfooter(processKey, nodeName, state, fuzzyParam, startDate, endDate) {
      if (this.status == "noMore") {
        return;
      }
      this.page += 1;
      this.loadMsgList(processKey, nodeName, state, fuzzyParam, startDate, endDate);
      this.morestatus = "loading";
    },
    gotodetal(item) {
      switch (item.processKey) {
        case "commonApprove":
          uni.navigateTo({
            url: "/businessPages/workflow/common-approve-detail?key=" + item.businessNo,
          });
          break;
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
        case "allocation":
          uni.navigateTo({
            url: "/devicePages/allot/allot-detail?businessNo=" + item.businessNo,
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
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/sublet-apply-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/add-record-detail?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url: "/devicePages/insurance/insurance-detail?businessNo=" + item.businessNo,
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "detail");
          break;
        case "inspection":
          uni.navigateTo({
            url: "/devicePages/polling/polling-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-detail?businessNo=" + item.businessNo,
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/battery-polling-detail?businessNo=" +
              item.businessNo,
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
    showDelete(item) {
      let pk = item.processKey;
      let isshow = false;
      switch (pk) {
        case "contract":
        case "workIn":
        case "workOut":
        case "expressWorkIn":
        case "expressWorkOut":
        case "claim":
        case "serviceClaim":
        case "pause":
        case "servicePause":
        case "proceeds":
        case "refund":
        case "settlement":
        case "settle":
        case "statement":
        case "repair":
        case "maintenance":
        case "checkRepair":
        case "inspection":
        case "batteryPatrol":
        case "sublet":
        case "insurance":
        case "invoice":
        case "contractChange":
        case "contractPlus":
          isshow = true;
          break;
        //暂时不可删除
        case "settlementApply":
        case "purchase":
        case "contractChange":
        case "contractPlus":
        case "claimAdjust":
        case "pauseAdjust":
        case "commonApprove":
        case "workInOut":
        case "contractDiscounts":
        case "allot":
        case "allocation":
        case "partsStorage":
        case "partsCollar":
        case "partsReturn":
        case "partsAllocation":
        case "partsUnitPrice":
          isshow = false;
          break;
        default:
          isshow = false;
          break;
      }
      return isshow;
    },
    deleteBusiness(item) {
      console.log(this.deleteApplyUrl(item));
      uni.showModal({
        title: "提示?",
        content: "此操作将永久删除该数据,是否继续?",
        success: (res) => {
          if (res.cancel) {
          } else {
            uni.showLoading();
            let urlstr = this.deleteApplyUrl(item);
            this.$network
              .getData(urlstr, "DELETE", null)
              .then((result) => {
                this.refreshheader();
              })
              .catch((err) => {
                uni.showToast({
                  icon: "none",
                  title: err.message,
                });
              });
          }
        },
      });
    },
    deleteApplyUrl(item) {
      let processKey = item.processKey;
      let apistr = this.$datestr.getUrlApi(processKey);
      let keystr = this.$gxfmethod.getDeletApi(processKey);
      if (item.processKey == "statement" || item.processKey == "contractChange") {
        return apistr + "/api/" + keystr + "/delete/" + item.tableId;
      }
      return apistr + "/api/" + keystr + "/delete/" + item.businessNo;
    },
    editBusiness(item) {
      console.log(item);
      switch (item.processKey) {
        case "contract":
          if (item.businessNo.substr(0, 3) === "KHT") {
            //框架合同
            uni.navigateTo({
              url:
                "/contractPages/contract-kit/create-contract-kit?isUpdate=1&contractNo=" +
                item.businessNo,
            });
          } else {
            //普通合同
            uni.navigateTo({
              url:
                "/contractPages/contract/create-contract?isUpdate=1&contractNo=" +
                item.businessNo,
            });
          }
          break;
        case "expressContract":
          uni.navigateTo({
            url:
              "/contractPages/contract/create-contract-simple?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "claim":
          // this.getBusinessDetail(item);
          uni.navigateTo({
            url:
              "/businessPages/claim/creat-claim?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "serviceClaim":
          uni.navigateTo({
            url:
              "/businessPages/claim/create-claim-service?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-step-all?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=2",
          });
          break;
        case "expressWorkIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-simple?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=2",
          });
          break;
        case "expressWorkOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-simple?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractChange":
          uni.navigateTo({
            url:
              "/contractPages/contract-change/create-contract-change?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&id=" +
              item.tableId,
          });
          break;
        case "contractPlus":
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/create-contract-expense?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/create-invoice?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=2",
          });
          break;
        case "refund":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/creat-reimburse?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=2",
          });
          break;
        case "pause":
          // this.getBusinessDetail(item);
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "servicePause":
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause-service?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "commonApprove":
          uni.navigateTo({
            url:
              "/businessPages/workflow/common-approve?item=" +
              encodeURIComponent(JSON.stringify(item)) +
              "&backType=2",
          });
          break;
        case "repair":
          uni.navigateTo({
            url:
              "/devicePages/repair/create-repair?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "maintenance":
          uni.navigateTo({
            url:
              "/devicePages/maintain/create-maintain?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "checkRepair":
          uni.navigateTo({
            url:
              "/devicePages/hostling/create-service?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "allocation":
          uni.navigateTo({
            url:
              "/devicePages/allot/create-allot?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "purchase":
          uni.navigateTo({
            url:
              "/devicePages/purchase/create-purchase?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsStorage":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-storagein/create-acc-storagein?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsCollar":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-receive/create-acc-recelive?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsReturn":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-back/create-acc-back?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsAllocation":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-allot/create-acc-allot?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "partsUnitPrice":
          uni.navigateTo({
            url:
              "/subOtherPages/accessories/acc-inventory/adjust-price?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "sublet":
          uni.navigateTo({
            url:
              "/otherPages/sublet/sublet-apply/create-sublet?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "workInOut":
          uni.navigateTo({
            url:
              "/businessPages/additional-recording/create-add-record?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "insurance":
          uni.navigateTo({
            url:
              "/devicePages/insurance/create-insurance?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "settlementApply":
          this.getBusinessDetail(item, "edit");
          break;
        case "inspection":
          uni.navigateTo({
            url:
              "/devicePages/polling/create-polling?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "contractDiscounts":
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-create?isUpdate=1&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "batteryPatrol":
          uni.navigateTo({
            url:
              "/devicePages/battery-polling/create-battery-polling?isUpdate=1&item=" +
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
                  "/businessPages/claim/create-claim-service?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/claim/creat-claim?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "pause") {
            if (resultDic.category === "service") {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause-service?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            }
          } else if (item.processKey === "settlementApply") {
            if (type == "edit") {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-create?isUpdate=1&item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-create?isUpdate=1&item=" +
                    encodeURIComponent(JSON.stringify(item)),
                });
              }
            } else {
              if (resultDic.dimensionType == "1") {
                //客户维度
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/customer/application-customer-detail?businessNo=" +
                    item.businessNo,
                });
              } else {
                uni.navigateTo({
                  url:
                    "/businessPages/settle-apply/contract/application-contract-detail?businessNo=" +
                    item.businessNo,
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
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  background-color: $uni-bg-color-grey;
}

.filter-view {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 2px;
  justify-content: space-between;
  align-self: center;
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
