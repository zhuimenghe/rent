<template>
  <view class="workin-out">
    <!-- 头部 -->
    <view class="header-icon card">
      <view class="column flex-3">
        <view class="header-item">
          <view class="label">
            履约营收
            <businessTips tipName="revenue" />
          </view>
          <view class="value">{{
            moneyUtil.dealNumber(computedReceivableDetails.fulfillmentRevenue)
          }}</view>
          <!-- <view class="text-success text-sm" v-if="receivableDetails.isSettled">结清前：{{ moneyUtil.dealNumber(receivableDetails.originReceiveTotal) }}</view> -->
        </view>
        <view class="header-item">
          <view class="label">
            结算营收
            <businessTips tipName="settleRevenue" />
          </view>
          <view class="value">{{
            moneyUtil.dealNumber(computedReceivableDetails.settleRevenue)
          }}</view>
          <view class="text-success text-sm" v-if="receivableDetails.isSettled"
            >结清前：{{
              moneyUtil.dealNumber(receivableDetails.originSettlementReceiveTotal)
            }}</view
          >
        </view>
      </view>
      <view class="column flex-3">
        <view class="header-item">
          <view class="label">
            履约欠款
            <businessTips tipName="performanceOfArrears" />
          </view>
          <view class="value">{{
            moneyUtil.dealNumber(computedReceivableDetails.performanceOfArrears)
          }}</view>
          <!-- <view class="text-success text-sm" v-if="receivableDetails.isSettled">结清前：{{ moneyUtil.dealNumber(computedReceivableDetails.originPerformanceOfArrears) }}</view> -->
        </view>
        <view class="header-item">
          <view class="label">
            结算欠款
            <businessTips tipName="settleArrears" />
          </view>
          <view class="value">{{
            moneyUtil.dealNumber(computedReceivableDetails.settleArrears)
          }}</view>
          <view class="text-success text-sm" v-if="receivableDetails.isSettled"
            >结清前：{{
              moneyUtil.dealNumber(computedReceivableDetails.originSettleArrears)
            }}</view
          >
        </view>
      </view>
      <view class="column">
        <view class="header-item">
          <view class="label">
            实收
            <businessTips tipName="paid" />
          </view>
          <view class="value">{{
            moneyUtil.dealNumber(computedReceivableDetails.paid)
          }}</view>
        </view>
      </view>
    </view>
    <view class="main">
      <!-- 设备履约 -->
      <view class="workin-record">
        <view class="item-title">
          <view style="display: flex; align-items: center">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 3px" class="bold">设备履历</text>
          </view>
          <view class="title-txt">
            <text style="margin-left: 3px"
              >履约租金合计
              <text class="bold">{{ moneyUtil.dealNumber(total) }}</text></text
            >
          </view>
        </view>
        <template v-if="machineReceivableList.length > 0">
          <view class="list">
            <view
              class="list-item list-item-settle"
              v-for="item in machineReceivableList"
              :key="item.licenseId"
            >
              <view class="sps">
                <view>
                  <text
                    class="bold"
                    v-if="item.licenseId || item.printCode"
                    style="margin-right: 4px"
                    >{{ item.licenseId }} {{ item.printCode || "" }}</text
                  >
                  <text class="thin"
                    >（{{ item.typeName || ""
                    }}{{ item.heightName ? "|" + item.heightName : "" }}）</text
                  >
                </view>
                <view class="myiconfont">
                  <i
                    @click="toggleShowMore(item)"
                    :class="[
                      'iconfont search-icon',
                      item.isShowMore ? 'iconarrow-up' : 'iconarrow-down',
                    ]"
                    style="color: #e60000; font-size: 16px"
                  ></i>
                </view>
              </view>

              <view class="gray mb16 mt12">
                <text class="thin">履约租期：{{ item.rentDays || "-" }}天</text>
                <text class="thin"
                  >履约租金：<text style="color: #222">{{
                    moneyUtil.dealNumber(item.hireTotal)
                  }}</text></text
                >
              </view>
              <view v-if="item.isShowMore">
                <view class="gray mb16 mt12" v-if="item.settlementType == 1">
                  <text class="thin"
                    >日租金：<text>{{ moneyUtil.dealNumber(item.hire) }}元</text></text
                  >
                  <text class="thin">月租金：0元</text>
                </view>
                <view class="gray mb16 mt12" v-else-if="item.settlementType == 4">
                  <text class="thin"
                    >日租金：<text>{{ moneyUtil.dealNumber(item.hire) }}元</text></text
                  >
                  <text class="thin"
                    >月租金：{{ moneyUtil.dealNumber(item.hireMonthly) }}元</text
                  >
                </view>
                <view class="gray mb16 mt12" v-else>
                  <text class="thin">日租金：<text>0元</text></text>
                  <text class="thin"
                    >月租金：{{ moneyUtil.dealNumber(item.hire) }}元</text
                  >
                </view>
                <view class="gray mb16 mt12">
                  <text class="thin"
                    >进场日期：{{
                      (item.enableDate && item.enableDate.split(" ")[0]) || "-"
                    }}</text
                  >
                  <text class="thin"
                    >退场日期：{{
                      (item.settleDate && item.settleDate.split(" ")[0]) || "-"
                    }}</text
                  >
                </view>
                <view class="gray mb16 mt12">
                  <text class="thin"
                    >租赁状态：<text v-if="!item.settleDate">租赁中</text>
                    <text v-else>已还租</text></text
                  >
                  <text class="thin">报停天数：{{ item.pauseDays || 0 }}</text>
                </view>
                <view class="pb16 mygray mt12">
                  <text
                    >{{receivableDetails.tripCalType!='1'?'报停/押金/运费/索赔：':'报停/押金/索赔：'}}{{
                      moneyUtil.dealNumber(item.pauseHireTotal)
                    }}/{{ moneyUtil.dealNumber(item.pledge) }}{{
                      receivableDetails.tripCalType!='1' ? '/'+ moneyUtil.dealNumber(item.carriage) : ''
                    }}/{{ moneyUtil.dealNumber(item.claimTotal) }}</text
                  >
                </view>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>
      <!-- 结算记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view style="display: flex; align-items: center">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 3px" class="bold">
              <text>结算记录</text>
            </text>
          </view>
          <!-- <view class="title-txt">
            <text style="margin-left: 3px;color:#e60000"
              >总结算单预览
              </text>
          </view> -->
        </view>
        <template v-if="settleList.length > 0">
          <view class="list">
            <template v-for="(row, index) in settleList">
              <view class="list-item-settle" @click="goTo(row)" :key="index">
                <view class="list-item">
                  <view class="date">
                    <text
                      >结算周期：{{ row.beginDate && row.beginDate.split(" ")[0] }}/{{
                        row.endDate && row.endDate.split(" ")[0]
                      }}</text
                    >
                    <text v-if="row.stateName" style="color: #52c41a">{{
                      row.stateName || ""
                    }}</text>
                  </view>
                  <view class="gray">
                    <text>结算人员：{{ row.createName || "-" }}</text>
                    <text class="second"
                      >押金抵扣：{{ moneyUtil.dealNumber(row.deposit) }}</text
                    >
                  </view>
                  <view class="gray">
                    <text class="second"
                      >减免总额：{{ moneyUtil.dealNumber(row.reduce) }}</text
                    >
                    <text
                      >应收合计：<text style="color: #e60000">{{
                        moneyUtil.dealNumber(row.total)
                      }}</text></text
                    >
                  </view>
                  <view class="gray">
                    <text class="second"
                    >签署进度：{{ getFlowStatus(row.flowStatus) || "-" }}</text>
                  </view>
                </view>
                <view
                  class="btns"
                  v-if="
                    checkAllPermissions(['settlementDelete']) &&
                    row.contractState != '4' &&
                    row.contractState != '9'
                  "
                >
                  <!--  -->
                  <view class="btn" @click.stop="deleteSettlement(row)">
                    <i class="iconfont icondelete" style="color: coral"></i>
                    <text>删除</text>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>

      <!-- 结清记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view style="display: flex; align-items: center">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 3px" class="bold">结清记录</text>
          </view>
        </view>
        <template v-if="settledList.length > 0">
          <view class="list">
            <template v-for="row in settledList">
              <view class="list-item">
                <view class="date">
                  <text
                    >申请时间：{{ row.createTime && row.createTime.split(" ")[0] }}</text
                  >
                  <text v-if="row.stateName" style="color: #52c41a">{{
                    row.stateName || ""
                  }}</text>
                </view>
                <view class="gray">
                  <text>结清单号：{{ row.businessNo }}</text>
                </view>
                <view class="gray">
                  <text>
                    履约营收：{{ moneyUtil.dealNumber(row.receiveTotal || 0) }}
                  </text>
                  <text class="second">
                    履约欠款：{{
                      moneyUtil.dealNumber(
                        Number(row.receiveTotal || 0) -
                          Number(row.receipt ? row.receipt.total : 0)
                      )
                    }}
                  </text>
                </view>
                <view class="gray">
                  <text>
                    结算营收：{{ moneyUtil.dealNumber(row.settlementReceiveTotal) }}
                  </text>
                  <text class="second">
                    结算欠款：{{
                      moneyUtil.dealNumber(
                        Number(row.settlementReceiveTotal || 0) -
                          Number(row.receipt ? row.receipt.total : 0)
                      )
                    }}
                  </text>
                </view>
                <view class="gray">
                  <text>
                    实收金额：{{
                      moneyUtil.dealNumber(row.receipt ? row.receipt.total : 0)
                    }}
                  </text>
                  <text class="text-primary">
                    {{ row.adjustType == "reduce" ? "优惠" : "增收" }}：{{
                      moneyUtil.dealNumber(row.adjustAccount)
                    }}
                  </text>
                </view>
                <view class="gray" v-if="row.bcReason">
                  {{ row.adjustType == "reduce" ? "优惠" : "增收" }}调整备注
                </view>
                <view v-if="row.bcReason" class="remark-box">
                  {{ row.bcReason }}
                </view>
              </view>
            </template>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>

      <!-- 优惠增收记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view style="display: flex; align-items: center">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 3px" class="bold">优惠增收记录</text>
          </view>
        </view>
        <template v-if="discountList.length > 0">
          <view class="list">
            <template v-for="row in discountList">
              <view class="list-item">
                <view class="date">
                  <text
                    >申请时间：{{ row.createTime && row.createTime.split(" ")[0] }}</text
                  >
                  <text v-if="row.stateName" style="color: #52c41a">{{
                    row.stateName || ""
                  }}</text>
                </view>
                <view class="gray">
                  <text>调整单号：{{ row.businessNo }}</text>
                </view>
                <view class="gray">
                  <text>
                    调整类型：{{ row.adjustType == "reduce" ? "优惠" : "增收" }}
                  </text>
                  <text class="second">
                    结算营收：{{ Number(row.receivable || 0).toFixed(2) || "0" }}
                  </text>
                </view>
                <view class="gray">
                  <text>
                    实收金额：{{ Number(row.receipt || 0).toFixed(2) || "0" }}
                  </text>
                  <text class="text-primary">
                    {{ row.adjustType == "reduce" ? "优惠" : "增收" }}：{{
                      Number(row.adjustAccount || 0).toFixed(2) || "0"
                    }}
                  </text>
                </view>
                <view class="gray" v-if="row.remark"> 备注： </view>
                <view v-if="row.remark" class="remark-box">
                  {{ row.remark }}
                </view>
              </view>
            </template>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>

      <!-- 签署记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view style="display: flex; align-items: center">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 3px" class="bold">结算签署记录</text>
          </view>
        </view>
        <template v-if="esignList.length > 0">
          <view class="list" v-for="(item, index) in esignList">
            <view class="list-item" @click="goToDetail(item)">
              <view class="date">
                <text>{{ item.title || "-" }}</text>
                <p :class="item.color">
                  {{ getFlowStatus(item.flowStatus) || "-" }}
                </p>
              </view>
              <view class="_gray">
                <text>发起时间：{{ item.createDate.slice(0, -3) || "-" }}</text>
                <text class="second">发起人：{{ item.createBy || "-" }}</text>
              </view>
              <view class="gray">
                <view> 签署方：</view>
                <view>
                  <p style="margin-bottom: 6px" v-for="item1 in item.signer">
                    {{ item1 }}
                  </p>
                </view>
              </view>
            </view>
            <view class="_btns">
              <view v-if="item.flowStatus == 1" class="btn_item">
                <i class="iconfont iconchehui1" style="color: coral"></i>
                <text @click.stop="revoke(item)">撤回</text>
              </view>
              <view v-if="item.flowStatus == 1" class="btn_item">
                <i class="iconfont iconleftfont-17" style="color: coral"></i>
                <button
                  v-if="item.flowStatus == 1"
                  class="tag-btns-view"
                  @click="share(item)"
                  data-type="esign"
                  open-type="share"
                >
                  {{ "催办" }}
                </button>
              </view>
              <view class="btn_item" v-if="item.flowStatus == 2">
                <i class="iconfont iconxiazai3" style="color: coral"></i>
                <text @click="download(item)">下载</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>
    </view>
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
  </view>
</template>
<script>
import {
  checkAllPermissions,
  showToast,
} from "@/common/business-method/common-method/util.js";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
export default {
  components: {
    sanyPopup,
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      receivableDetails: {},
      workInList: [],
      workOutList: [],
      machineReceivableList: [],
      total: 0,
      vehicleInfo: {
        tag: "设备信息",
        orderList: [],
      },
      settleList: [],
      settledList: [],
      discountList: [],
      esignList: [],
      flowId: "",
      title: "",
    };
  },

  created() {
    // this.loaddata();
    // this.loaddataworkout();
    this.getReceivableContract();
    this.getSettleList();
    this.getSettledDetail();
    this.salesList();
  },
  watch: {
    machineReceivableList: {
      handler(v) {
        //设备信息
        let list = v.map((o) => {
          o.isExpand = true;
          return { ...o };
        });
        this.vehicleInfo.orderList = [...list];
        console.log(this.vehicleInfo.orderList, "this.vehicleInfo.orderList ");
        this.total = v.reduce((x, y) => {
          return x + Number(y.hireTotal);
        }, 0);
        this.total = this.total || 0;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    checkAllPermissions,
    showToast,
    popClose() {
      this.$emit("popClose");
    },
    // 定义一个方法来处理删除结算的操作
    deleteSettlement(item) {
      // 替换URL中的占位符
      let checkUrl = this.$url.SETTLEMENT_DELETE_CHECK.replace(
        /{businessNo}/,
        item.businessNo
      );

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", {}, { hideError: true })
        .then((checkRes) => {
          // 检查通过，请求用户确认是否删除
          this.showModal(
            "删除确认",
            "注意：您将删除当前结算单，该操作不可恢复,该操作执行后立即生效。",
            true,
            () => {
              // 用户确认删除，执行删除操作
              this.performDelete(item.businessNo);
            }
          );
        })
        .catch((checkRes) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("删除失败", message);
          }
        });
    },
    // 定义一个方法来显示模态框
    showModal(title, content, isConfirm = false, onConfirm = null) {
      this.$emit("popShow");
      this.$refs.sanyPop.showModal({
        title,
        content,
        confirmButtonName: isConfirm ? "删除" : undefined,
        cancelButtonName: "关闭",
        confirmButtonStyle: isConfirm ? "primary" : undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm && onConfirm) {
            onConfirm();
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
        },
      });
    },
    // 定义一个方法来执行删除操作
    performDelete(businessNo) {
      let deleteUrl = this.$url.SETTLEMENT_DELETE.replace(/{businessNo}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.getSettleList(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },
    async getSettledDetail() {
      let url = this.$url.SETTLE_JQ_CONTRACT + this.baseInfo.businessNo;
      let res = await this.$network.getData(url, "GET", null);
      this.settledList = res ? [res] : [];
    },
    async salesList() {
      let param = {
        current: 1,
        size: 1000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(this.$url.DISCOUNT_LIST, "POST", param);
      this.discountList = res.records;
    },
    toggleShowMore(item) {
      console.log(item, "toggleShowMore");
      this.machineReceivableList.forEach((item1, index) => {
        if (item1.licenseId == item.licenseId) {
          this.$set(this.machineReceivableList[index], "isShowMore", !item.isShowMore);
        }
      });
      // this.$set()
    },
    // 结算记录
    async getSettleList() {
      //结算
      let self = this;
      let param = {
        contractNo: this.baseInfo.businessNo,
        current: 1,
        size: 10000,
      };
      let res = await this.$network.getData(this.$url.SETTLEMENT_LIST, "POST", param);

      this.settleList = res.records || [];

      let businessArr = [];
      this.settleList.forEach((o) => {
        businessArr.push(o.businessNo);
      });
      if (this.settleList.length) {
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "settlement",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignList = res;
          })
          .catch((err) => {});
      }
    },
    async getReceivableContract() {
      let res = await this.$network.getData(
        this.$url.CONTRACT_DETAIL_RECEIVABLE + "?contractNo=" + this.baseInfo.businessNo,
        "GET",
        null
      );
      console.log(res, "machineReceivableList");
      this.machineReceivableList =
        res && res.machineReceivableList
          ? res.machineReceivableList.map((o) => {
              return {
                isShowMore: false,
                ...o,
                settlementType: o.originSettlementType,
                settlementTypeName: o.originSettlementTypeName,
              };
            })
          : [];
      console.log(res, this.machineReceivableList, "this.machineReceivableList");
      this.receivableDetails = res;
      //押金
      this.customerReceiptTotal =
        res && res.receivableCurrent ? Number(res.receivableCurrent.pledge) : 0; //约定押金
      this.customerReceiptTotalDone =
        res && res.receipt ? Number(res.receipt.deposit) : 0; //已收押金
      //营收
      this.debtExpireTotal =
        res && res.receivableCurrent
          ? Number(res.receivableCurrent.hire) +
            Number(res.receivableCurrent.claim) +
            Number(res.receivableCurrent.carriage)
          : 0; // 履约营收

      this.debtExpireTotalDone =
        res && res.receipt
          ? Number(res.receipt.hire) +
            Number(res.receipt.claim) +
            Number(res.receipt.carriage)
          : 0; // 已收营收

      //运费
      this.carriage =
        res && res.receivableCurrent ? Number(res.receivableCurrent.carriage) : 0; //约定运费
      this.carriageDone = res && res.receipt ? Number(res.receipt.carriage) : 0; //已收运费
    },
    goTo(item) {
      console.log(item, "item");
      let key = item.businessNo && item.businessNo.substring(0, 2);
      switch (key) {
        case "KP":
          uni.navigateTo({
            url: "/businessPages/invoice/invoice-detail?businessNo=" + item.businessNo,
          });
          break;
        case "SK":
          uni.navigateTo({
            url: "/businessPages/proceed/porceeds-detail?businessNo=" + item.businessNo,
          });
          break;
        // 退款
        case "TK":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" + item.businessNo,
          });
          break;
        case "JS":
          let url = uni.navigateTo({
            url: "/businessPages/settledown/settle-detail?businessNo=" + item.businessNo,
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
    // async loaddataheader() {
    //     let key = this.baseInfo.businessNo;
    //     let url = this.$url.SETTLE_PROCEEDS_SYNTHESIZE + key
    //     let res = await this.$network.getData(url, 'GET', null);
    //     this.workInOutCount = res;
    //     console.log(res, 'loaddata');
    // },
    async loaddataworkout() {
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(
        this.$url.SETTLE_REIMBURSE_LIST,
        "POST",
        param
      );
      this.workOutList = res.records || [];
      console.log(this.workOutList, "workOutList");
    },
    onNavBarButtonTap(obj) {
      if (
        this.baseInfo.state !== "0" &&
        this.baseInfo.state !== "3" &&
        this.baseInfo.state !== "12"
      ) {
        let headerDic = {
          "Content-Type": "application/json",
          Authorization: "",
        };
        let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
        if (loginMes) {
          let access_token = loginMes.token_type + " " + loginMes.access_token;
          headerDic.Authorization = access_token;
          this.downDocument(headerDic, obj);
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "暂无下载权限",
        });
      }
    },
    downDocument(headerDic, obj) {
      let url =
        this.$url.BASE_URL +
        this.$url.DOWNLOAD_WORD_CONTRACT +
        "?businessNo=" +
        obj.businessNo;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {})
        .catch((err) => {
          if (err.code) {
            uni.showToast({
              title: err.message + ":" + err.details[0],
              icon: "none",
            });
          } else {
            setTimeout(() => {
              this.downxlsc(url, headerDic);
            }, 100);
          }
        });
    },
    downxlsc(url, headerDic, obj) {
      let customerName = obj.customerName ? obj.customerName : "";
      let projectName = obj.projectName && obj.projectName ? obj.projectName : "";
      let name = "合同-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },

    // 进场记录
    async loaddata() {
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(
        this.$url.SETTLE_PROCEEDS_PAGE,
        "POST",
        param
      );
      this.workInList = res.records || [];
      console.log(res, this.workInList, "this.workInList");
    },
    revoke(item) {
      uni.showModal({
        title: "提示",
        content: "是否确认撤销当前电签流程？",
        success: (res) => {
          if (res.confirm) {
            let url = this.$url.esignRecordRevoke;
            url = url.replace("{id}", item.flowId);
            this.$network
              .getData(url, "POST")
              .then((res) => {
                setTimeout(() => {
                  this.getEsign();
                }, 1000);
              })
              .catch((err) => {});
          }
        },
      });
    },
    getFlowStatus(type) {
      let str = "";
      switch (type) {
        case 1:
          str = "签署中";
          break;
        case 2:
          str = "已完成";
          break;
        case 3:
          str = "撤销";
          break;
        case 7:
          str = "拒签";
          break;
        default:
          break;
      }
      return str;
    },
    getEsign() {
      this.esignList = [];
      let businessArr = [];
      this.settleList.forEach((o) => {
        businessArr.push(o.businessNo);
      });
      if (this.settleList.length) {
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "settlement",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignList = res;
            this.$forceUpdate();
          })
          .catch((err) => {});
      }
    },

    goToDetail(item) {
      let url = this.$url.esignRecordInfo;
      let param = {
        urlType: 1,
      };
      url = url.replace("{id}", item.flowId);

      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          uni.navigateTo({
            url: `/otherPages/esign/webView?url=${encodeURIComponent(res)}&title=${
              item.title
            }`,
          });
        })
        .catch((err) => {});
    },
    share(item) {
      let obj = {};
      obj.flowId = item.flowId;
      obj.title = item.title;
      this.$emit("share", obj);
    },
    download(item) {
      if (item.flowStatus == 2) {
        let url = this.$url.esignRecordFile;
        let param = {
          flowId: item.flowId,
        };
        this.$network
          .getData(url, "GET", param)
          .then((res) => {
            let url = res;
            let filename = item.title + ".pdf";
            // #ifdef APP-PLUS
            filename = "_doc/" + item.title + ".pdf";
            // #endif
            this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
          })
          .catch((err) => {});
      }
    },
    getUrlUploadFile(type) {
      let url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
      switch (type) {
        case "contract":
          url = this.$url.DOWNLOAD_WORD_CONTRACT;
          break;
        case "contractPlus":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_PLUS;
          break;
        case "settlement": //结算
          url = this.$url.BASE_URL + "settleapi/api/settlement/export";
          break;

        case "workIn": //进场
          url = this.$url.DOWNLOAD_WORD_WORKIN;
          break;
        case "workOut": //退场
          url = this.$url.DOWNLOAD_WORD_WORKOUT;
          break;
        case "esignMerge": //合并电签
          url = this.$url.ESIGN_DOWNLOAD_URL_CONTRACT_MERGE;
          break;
        default:
          break;
      }
      return url;
    },
  },
  computed: {
    computedReceivableDetails() {
      let _this = this;
      let obj = {
        paid:
          (_this.receivableDetails.receipt && this.receivableDetails.receipt.total) || 0, //实收
        fulfillmentRevenue:
          (_this.receivableDetails.receivableCurrent &&
            _this.receivableDetails.receivableCurrent.total) ||
          0, //履约营收
        performanceOfArrears:
          ((_this.receivableDetails.receivableCurrent &&
            _this.receivableDetails.receivableCurrent.total) ||
            0) -
          ((_this.receivableDetails.receipt && this.receivableDetails.receipt.total) ||
            0), // 履约欠款
        settleRevenue:
          (_this.receivableDetails.settlement && this.receivableDetails.settlement) || 0, //结算营收
        settleArrears:
          ((_this.receivableDetails.settlement && this.receivableDetails.settlement) ||
            0) -
          ((_this.receivableDetails.receipt && this.receivableDetails.receipt.total) ||
            0), //结算欠款
      };
      if (this.receivableDetails.isSettled) {
        // obj.fulfillmentRevenue = this.receivableDetails.newReceiveTotal
        // obj.performanceOfArrears = 0
        obj.originPerformanceOfArrears =
          this.receivableDetails.originReceiveTotal - obj.paid;
        obj.settleRevenue = this.receivableDetails.newSettlementReceiveTotal;
        obj.settleArrears = 0;
        obj.originsettleArrears =
          this.receivableDetails.originSettlementReceiveTotal - obj.paid;
      }
      return obj;
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-data-box {
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  color: var(--text-color-gray);

  .icon {
    width: 108rpx;
  }

  .text {
    font-size: 28rpx;
  }
}

.card {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 10rpx;
  padding: 36rpx 36rpx 0;
  margin-bottom: 30rpx;
}

.border-1 {
  border-bottom: 1rpx solid #e6e6e6;
}

.list {
  padding-bottom: 10rpx;

  .list-item {
    padding: 22rpx 28rpx;
    padding-bottom: 10rpx;
    border-bottom: 1px solid #e6e6e6;
  }

  .list-item-settle {
    border-bottom: 1px solid #e6e6e6;
  }

  .date {
    display: flex;
    justify-content: space-between;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #222222;
    margin-bottom: 16rpx;
  }

  .flex {
    flex-wrap: nowrap;
  }

  .gray {
    display: flex;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8c8c8c;
    margin-bottom: 12rpx;

    text {
      flex-basis: 50%;
    }
  }
}

.mt12 {
  margin-top: 12rpx;
}

.mb16 {
  margin-bottom: 16rpx !important;
}

.workin-record {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 10rpx;
  margin-bottom: 38rpx;

  // padding-bottom: 8rpx;
  .list:last-child {
    padding-bottom: 0 !important;
  }
}

.btns {
  width: 100%;
  height: 64rpx;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  color: coral;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200;
  box-sizing: border-box;
  justify-content: flex-end;
  padding: 0 40rpx;

  .btn {
    display: flex;
    align-items: center;
    padding: 0 10rpx;
  }
}

.workin-out {
  background-color: #fff;
  padding: 0 16rpx;

  .header-icon {
    display: flex;
    justify-content: space-between;
    // padding-bottom: 10rpx;
    margin-top: 24rpx;
  }

  .main {
    .item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 50rpx;
      padding: 22rpx 25rpx;
      border-bottom: 1rpx solid #e6e6e6;
    }
  }
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .header-item {
    margin-bottom: 34rpx;

    .label {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
      margin-bottom: 4rpx;
      display: flex;
      align-items: center;

      .iconfont {
        margin-left: 6rpx;
        font-size: 20rpx;
      }
    }

    .value {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
    }
  }
}

._gray {
  display: grid;
  grid-template-columns: 60% 40%;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-bottom: 12rpx;
}

.thin {
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

.workin-record {
  .item-title {
    .title-txt {
      display: flex;
      justify-content: space-between;

      .thin {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
      }

      .bold {
        font-size: 28rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        margin-left: 8rpx;
      }
    }
  }
}

.sps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;

  .bold {
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #222222;
  }
}

.hire {
  display: flex;
  justify-content: space-between;
}

.hire-item {
  display: flex;

  &:last-child {
    // margin-left: 16rpx;
  }
}

.hire-item-txt {
  padding: 3rpx 18rpx;
  height: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdedda;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200;

  &:first-child {
    margin-right: 16rpx;
  }
}

.list-item-settle {
  position: relative;
}

.myiconfont {
  position: absolute;
  top: 48rpx;
  right: 40rpx;
}

.pb16 {
  padding-bottom: 15rpx;
}

.mygray {
  display: flex;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

._btns {
  width: 100%;
  height: 64rpx;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200;
  box-sizing: border-box;
  justify-content: flex-end;
  padding: 0 40rpx;

  .btn_item {
    display: flex;
    align-items: baseline;
    margin-left: 25px;
  }
}

.tag-btns-view {
  position: relative;
  display: inline;
  color: #f08200;
  background-color: none;
  font-size: 28rpx;
  border: none;
  padding: 0;
}

.tag-btns-view::after {
  border: none !important;
}

uni-button::after {
  border: none !important;
}

.blue {
  color: #1278ff;
}

.green {
  color: #52c41a;
}

.yellow {
  color: #f08200;
}

.red {
  color: #e60000;
}

.remark-box {
  background: #f6f6f6;
  border-radius: 6rpx;
  padding: 20rpx 17rpx;
  font-size: $uni-font-size-sm;
  margin-bottom: 12rpx;
}
</style>
