<template>
  <view class="execute-info-content">
    <!--合同营收-->
    <view class="earning">
      <!-- <view class="tag">{{ earningInfo.tag }}</view> -->
      <view class="tabs">
        <view
          :class="['tab-item', activeTabIndex == index ? 'active-tab' : '']"
          v-for="(item, index) in tab"
          @click="tabClick(index)"
          :key="index"
        >
          <text>{{ item.tag }}</text>
        </view>
      </view>
      <view v-if="activeTabIndex == 0" class="info-content">
        <view>
          <view class="earning-item">
            <view class="e-item-title">
              营收【含运费】
              <text class="e-item-sub-title">(履约/已收)</text>
              <businessTips tipName="revenue" />
            </view>
            <view class="e-item-value"
              >￥{{ earningInfo.content.revenuePerform }}/￥{{
                earningInfo.content.revenueReceived
              }}</view
            >
          </view>
          <view class="earning-item">
            <view class="e-item-title">
              押金
              <text class="e-item-sub-title">(约定/已收)</text>
              <businessTips tipName="deposit" />
            </view>
            <view class="e-item-value"
              >￥{{ earningInfo.content.pledgeAppoint }}/￥{{
                earningInfo.content.pledgeReceived
              }}</view
            >
          </view>

          <view class="earning-item">
            <view class="e-item-title">
              运费
              <text class="e-item-sub-title">(履约/已收)</text>
              <businessTips tipName="carriage" />
            </view>
            <view class="e-item-value"
              >￥{{ earningInfo.content.carriagePerform }}/￥{{
                earningInfo.content.carriageReceived
              }}</view
            >
          </view>
          <view class="earning-item">
            <view class="e-item-title">
              应收
              <businessTips tipName="debt" />
              <text class="e-item-sub-title"
                >(到期日：{{ earningInfo.content.dueDate }})</text
              >
            </view>
            <view class="e-item-value">{{ earningInfo.content.debt }}</view>
          </view>
        </view>
        <!--设备-->
        <view>
          <view
            v-for="(device, pos) in earningInfo.content.machineList"
            :key="pos"
            style="border-top: 1px solid #efefef; padding-top: 10px"
          >
            <view class="machine-header">
              <view>
                <view class="machine-row">
                  <view
                    style="
                      color: #333333;
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 18px;
                    "
                    >{{
                      device.printCode
                        ? device.printCode
                        : device.licenseId
                        ? device.licenseId
                        : ""
                    }}</view
                  >
                  <view
                    style="
                      color: #999999;
                      font-size: 12px;
                      align-items: center;
                      margin-left: 4px;
                      line-height: 18px;
                    "
                    v-if="device.printCode"
                    >{{ device.licenseId || "" }}</view
                  >
                </view>
                <view class="machine-row">
                  <view
                    class="top-text"
                    style="color: #722ed1; background-color: #f9f0ff"
                    v-if="device.contractOriginOrderId"
                    >变更</view
                  >
                  <view
                    class="top-text"
                    style="color: #e60000; background-color: #fff1f0"
                    >{{ getType(device.settlementType) }}</view
                  >
                  <view
                    class="top-text"
                    style="color: #fca01f; background-color: #fff8ee"
                    v-if="device.settlementType == '1'||device.settlementType == '2'||device.settlementType == '3'"
                  >
                    {{ device.hire }}/{{device.settlementType=='1'?'天':'月'  }}
                  </view>
                  <view
                    class="top-text"
                    style="color: #fca01f; background-color: #fff8ee"
                    v-if="device.settlementType == '4'"
                  >
                    {{ device.hire }}/天 {{ device.hireMonthly }}/月
                  </view>
                </view>
              </view>
              <view class="machine-right" @click="changeExpand(pos)">
                <view style="margin-right: 10px">
                  <text v-if="device.subletState == 1">转租</text>
                  <text v-else-if="device.subletState == 0">自有</text>
                  <text v-else>-</text>
                </view>
                <view
                  style="
                    min-width: 76px;
                    text-align: right;
                    color: #e60000;
                    font-size: 16px;
                  "
                  >{{
                    device.settleDate
                      ? "已退场"
                      : (device.stateName ? device.stateName : "-") +
                        (device.subStateName ? "-" + device.subStateName : "")
                  }}</view
                >
                <view class="v-detail">
                  <i
                    class="iconfont iconarrow-right"
                    :class="
                      device.isExpand
                        ? 'translate-arrow'
                        : 'translate-arrow-expend'
                    "
                  ></i>
                </view>
              </view>
            </view>
            <view class="machine-content" v-if="device.isExpand">
              <view class="machine-cell">
                <view class="machine-cell-key">履约租期</view>
                <view class="machine-cell-value">{{
                  getTenancyFn(device)
                }}</view>
              </view>
              <view class="machine-cell">
                <view class="machine-cell-key">报停天数</view>
                <view class="machine-cell-value">{{ device.pauseDays }}天</view>
              </view>
              <view
                class="machine-cell"
                @click="goToOrder('workIn', device.workInBusinessNo)"
              >
                <view class="machine-cell-key">启用时间</view>
                <view
                  class="machine-cell-value"
                  :style="{
                    color: device.workInBusinessNo ? '#E60000' : '#333333',
                  }"
                  >{{ getDate(device.enableDate) }}</view
                >
              </view>
              <view
                class="machine-cell"
                @click="goToOrder('workOut', device.workOutBusinessNo)"
              >
                <view class="machine-cell-key">退场日期</view>
                <view
                  class="machine-cell-value"
                  :style="{
                    color: device.workOutBusinessNo ? '#E60000' : '#333333',
                  }"
                  >{{ getDate(device.settleDate) }}</view
                >
              </view>

              <view class="machine-cell" style="width: 67%">
                <view class="machine-cell-key">结算周期</view>
                <view class="machine-cell-value"
                  >{{ getDate(device.beginDate) }}/{{
                    getDate(device.endDate)
                  }}</view
                >
              </view>
              <view class="machine-cell">
                <view class="machine-cell-key">押金</view>
                <view class="machine-cell-value">{{ device.pledge }}</view>
              </view>
              <view class="machine-cell">
                <view class="machine-cell-key">运费</view>
                <view class="machine-cell-value">{{ device.carriage }}</view>
              </view>
              <view class="machine-cell">
                <view class="machine-cell-key">索赔</view>
                <view class="machine-cell-value">{{ device.claimTotal }}</view>
              </view>
              <view class="machine-cell">
                <view class="machine-cell-key">履约租金</view>
                <view class="machine-cell-value">{{ device.hireTotal }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        v-else
        class="cost-content"
        @click="goTo({ businessType: 'costlist' })"
      >
        <view class="cost-item">
          <view class="cost-item-title">运费</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.freightCost) || 0 }}</view
          >
        </view>
        <view class="cost-item">
          <view class="cost-item-title">装卸费</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.handlingCost) || 0 }}</view
          >
        </view>

        <view class="cost-item">
          <view class="cost-item-title">维修费</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.repairCost) || 0 }}</view
          >
        </view>
        <view class="cost-item">
          <view class="cost-item-title">沟通费</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.contactCost) || 0 }}</view
          >
        </view>
        <view class="cost-item">
          <view class="cost-item-title">调度费</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.dispatchCost) || 0 }}</view
          >
        </view>
        <view class="cost-item">
          <view class="cost-item-title">转租</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.subletCost) || 0 }}</view
          >
        </view>
        <view class="cost-item">
          <view class="cost-item-title">其他</view>
          <view class="cost-item-text"
            >¥{{ dealMoney(detainInfo.otherCost) || 0 }}</view
          >
        </view>
      </view>
    </view>

    <!--执行记录-->
    <view class="record">
      <view class="tag">{{ recordInfo.tag }}</view>
      <view class="record-content">
        <!--tab-->
        <!--:style="{ position: flowPosition, top: flowTopHeight }"-->
        <view
          class="record-flow"
          :style="{ position: flowPosition, top: flowTopHeight }"
        >
          <!--设置宽度 禁止滚出屏幕-->
          <view class="scroll-container">
            <scroll-view scroll-x="true" show-scrollbar="false">
              <view class="tabs-container">
                <view
                  class="tab-item"
                  :class="{ selected: t.checked }"
                  v-for="(t, index) in recordInfo.tabs"
                  :key="index"
                  @click="changeTab(index)"
                >
                  <text>{{ t.label }}</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
        <!--tab下页面 :style="{ 'margin-top': flowMargintop }"-->
        <view class="bgview">
          <list class="list-view-bg">
            <!--审批流的页面-->
            <cell v-if="recordInfo.selectedTab.key == 'approve'">
              <view
                class="execute-flow-item"
                v-for="(f, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <view class="line-container">
                  <view class="line-top"></view>
                  <view class="middle-circle"></view>
                  <!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
                  <view class="line-bottom"></view>
                </view>
                <view class="real-contant">
                  <view class="item-top">
                    <view class="execute-flow-name">
                      <text class="flow-name">{{ f.name }}</text>
                    </view>
                    <view class="execute-time">{{ f.endTime || "" }}</view>
                  </view>
                  <view class="item-middle">
                    <view class="b-left">
                      <text style="width: 52px">处理人</text>
                      <view class="execute-creator">{{
                        getAssignees(f) || "--"
                      }}</view>
                      <text
                        class="flow-result"
                        v-if="f.deleteReason && f.deleteReason !== ''"
                        >{{ f.deleteReason }}</text
                      >
                    </view>
                  </view>
                  <view class="item-bottom">{{ f.comment || "" }}</view>
                  <view
                    class="item-cell"
                    v-for="(item, index) in f.flowComment"
                    :key="index"
                  >
                    <view class="timeclassshow">
                      <view class="spanstyle">{{ item.createName }}</view>
                      <view class="timeclass">{{ item.createTime }}</view>
                    </view>
                    <view style="margin-top: 5px">{{ item.comment }}</view>
                    <view style="margin-top: 5px; color: #e60000">{{
                      getNames(item)
                    }}</view>
                    <view
                      style="
                        height: 1px;
                        background: #e9e9e9;
                        flex: 1;
                        margin-top: 10px;
                      "
                    />
                  </view>
                  <view calss="bottom-comment">
                    <view class="cell-text-right-all" @click="gotoWrite(f)">
                      <text>写评论...</text>
                    </view>
                  </view>
                </view>
              </view>
            </cell>
            <!--执行流的页面-->
            <cell v-if="recordInfo.selectedTab.key == 'excute'">
              <view
                class="execute-flow-item"
                v-for="(f, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <view class="line-container">
                  <view class="line-top"></view>
                  <view class="middle-circle"></view>
                  <!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
                  <view class="line-bottom"></view>
                </view>
                <view class="real-contant">
                  <view class="item-top">
                    <view class="execute-flow-name">
                      <i
                        class="iconfont r-icon"
                        :class="getFlowIcon(f.businessType).svg"
                        :style="{ color: getFlowIcon(f.businessType).color }"
                      ></i>
                      <text>{{ getFlowIcon(f.businessType).name }}</text>
                    </view>
                    <view class="execute-time">{{ f.createTime }}</view>
                  </view>
                  <view class="item-bottom">
                    <view class="b-left">
                      <text>发起人</text>
                      <view class="execute-creator">{{
                        f.createName || "---"
                      }}</view>
                    </view>
                    <view>
                      <label-arrow
                        value="查看"
                        @clickLabel="goTo(f)"
                        textColor="#E60000"
                        arrowColor="#E60000"
                      ></label-arrow>
                    </view>
                  </view>
                </view>
              </view>
            </cell>

            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'workin'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <workincell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'claim'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <claimcell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'workout'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <workoutcell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <view
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'useReport'"
            >
              <report-list :contractNo="contractNo"></report-list>
            </view>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'proceed'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <receiptcell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <!-- 退款 -->
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'reimburse'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <reimbursecell class="cellBgView" :dic="cell" />
              </view>
            </cell>

            <!-- 成本 -->
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'cost'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <costcell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'settle'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <settlecell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'statement'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <statementcell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'pause'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <pausecell class="cellBgView" :dic="cell" />
              </view>
            </cell>
            <cell
              class="list-view-bg"
              v-if="recordInfo.selectedTab.key == 'invoice'"
            >
              <view
                class="cell-item"
                v-for="(cell, index) in recordInfo.selectedTab.list"
                :key="index"
              >
                <invoicecell class="cellBgView" :dic="cell" />
              </view>
            </cell>
          </list>
        </view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import workincell from "@/contractPages/contract/detail/contract-detail-cel/workincell.vue";
import claimcell from "@/contractPages/contract/detail/contract-detail-cel/claimcell.vue";
import workoutcell from "@/contractPages/contract/detail/contract-detail-cel/workoutcell.vue";
import receiptcell from "@/contractPages/contract/detail/contract-detail-cel/receiptcell.vue";
import reimbursecell from "@/contractPages/contract/detail/contract-detail-cel/reimbursecell.vue";
import costcell from "@/contractPages/contract/detail/contract-detail-cel/costcell.vue";
import settlecell from "@/contractPages/contract/detail/contract-detail-cel/settlecell.vue";
import pausecell from "@/contractPages/contract/detail/contract-detail-cel/pausecell.vue";
import invoicecell from "@/contractPages/contract/detail/contract-detail-cel/invoicecell.vue";
import statementcell from "@/contractPages/contract/detail/contract-detail-cel/statementcell.vue";
import reportList from "./components/report-list.vue";
import calRent from "@/common/util/cal-rent-money.js";
export default {
  name: "execute-info",
  components: {
    labelArrow,
    workincell,
    claimcell,
    workoutcell,
    receiptcell,
    reimbursecell,
    costcell,
    settlecell,
    pausecell,
    invoicecell,
    statementcell,
    reportList,
  },
  props: {
    baseInfo: {
      type: Object,
      default: () => {},
    },
    isfixed: {
      type: Boolean,
      default() {
        return false;
      },
    },
    contractNo: {
      type: String,
      default: "",
    },
    businessKey: {
      type: String,
      default: "",
    },
    contractType: {
      type: String,
      default: "1",
    },
  },
  watch: {
    isfixed(val) {
      if (val == false) {
        this.flowPosition = "relative";
        this.flowTopHeight = "0px";
        this.flowMargintop = "0px";
      } else {
        this.flowPosition = "fixed";
        this.flowTopHeight = "44px";
        this.flowMargintop = "50px";
      }
    },

    contractNo(val) {
      if (this.contractNo) {
        this.getContractRecevice();
        this.getExecuteData();
        this.getWorkInList();
        this.getClaimList();
        this.getWorkOutList();
        this.getRecepitList();
        this.getPauseList();
        this.getSettleList();
        this.getRefundList();
        this.getInvoiceList();
        this.getStatementList();
        this.getCostList();
      }
    },
    businessKey(val) {
      if (this.businessKey) {
        this.getApproveData();
      }
    },
    baseInfo: {
      handler(val) {
        this.detainInfo = { ...val };
      },
      deep: true,
    },
  },
  data() {
    return {
      detainInfo: {},
      //选项卡吸附设置
      flowPosition: "relative",
      flowTopHeight: "0px",
      flowMargintop: "0px",
      earningInfo: {
        tag: "合同营收",
        content: {
          revenuePerform: "0.00", //营收-履约
          revenueReceived: "0.00", //营收-已收
          pledgeAppoint: "0.00", //押金-约定
          pledgeReceived: "0.00", //押金-已收
          carriagePerform: "0.00", //运费-履约
          carriageReceived: "0.00", //运费-已收
          debt: "--", //预付应收金额
          dueDate: "--", //到期日
          machineList: [],
        },
      },
      tab: [
        {
          tag: "合同营收",
          content: {
            revenuePerform: "0.00", //营收-履约
            revenueReceived: "0.00", //营收-已收
            pledgeAppoint: "0.00", //押金-约定
            pledgeReceived: "0.00", //押金-已收
            carriagePerform: "0.00", //运费-履约
            carriageReceived: "0.00", //运费-已收
            debt: "--", //预付应收金额
            dueDate: "--", //到期日
            machineList: [],
          },
        },
        {
          tag: "成本支出",
          content: {
            revenuePerform: "0.00", //营收-履约
            revenueReceived: "0.00", //营收-已收
            pledgeAppoint: "0.00", //押金-约定
            pledgeReceived: "0.00", //押金-已收
            carriagePerform: "0.00", //运费-履约
            carriageReceived: "0.00", //运费-已收
            debt: "--", //预付应收金额
            dueDate: "--", //到期日
            machineList: [],
          },
        },
      ],
      activeTabIndex: 0,
      recordInfo: {
        tag: "执行记录",
        tabs: [
          {
            label: "审批流",
            checked: false,
            list: [], //审批列表
            key: "approve",
          },
          {
            label: "执行流",
            checked: false,
            list: [], //执行列表
            key: "excute",
          },
          {
            label: "进场",
            checked: false,
            list: [], //进场列表
            key: "workin",
          },
          {
            label: "索赔",
            checked: false,
            list: [], //索赔列表
            key: "claim",
          },
          {
            label: "退场",
            checked: false,
            list: [], //退场列表
            key: "workout",
          },
          {
            label: "使用报告",
            checked: false,
            list: [], //退场列表
            key: "useReport",
          },
          {
            label: "收款",
            checked: false,
            list: [],
            key: "proceed",
          },
          {
            label: "退款",
            checked: false,
            list: [],
            key: "reimburse",
          },
          {
            label: "成本",
            checked: false,
            list: [],
            key: "cost",
          },
          {
            label: "结算",
            checked: false,
            list: [],
            key: "settle",
          },
          {
            label: "报停",
            checked: false,
            list: [],
            key: "pause",
          },
          {
            label: "发票",
            checked: false,
            list: [],
            key: "invoice",
          },
          {
            label: "对账单",
            checked: false,
            list: [],
            key: "statement",
          },
        ],
        selectedTab: {},
      },
      isLiangXu: false,
    };
  },
  created() {
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isLiangXu = obj.value === "liangXu" ? true : false;
      }
    }
    if (this.isLiangXu) {
      this.recordInfo.tabs = [
        {
          label: "发票",
          checked: false,
          list: [],
          key: "invoice",
        },
        {
          label: "收款",
          checked: false,
          list: [],
          key: "proceed",
        },
        {
          label: "审批流",
          checked: false,
          list: [], //审批列表
          key: "approve",
        },
        {
          label: "执行流",
          checked: false,
          list: [], //执行列表
          key: "excute",
        },
        {
          label: "进场",
          checked: false,
          list: [], //进场列表
          key: "workin",
        },
        {
          label: "索赔",
          checked: false,
          list: [], //索赔列表
          key: "claim",
        },
        {
          label: "退场",
          checked: false,
          list: [], //退场列表
          key: "workout",
        },

        {
          label: "退款",
          checked: false,
          list: [],
          key: "reimburse",
        },
        {
          label: "结算",
          checked: false,
          list: [],
          key: "settle",
        },
        {
          label: "对账单",
          checked: false,
          list: [],
          key: "statement",
        },
        {
          label: "报停",
          checked: false,
          list: [],
          key: "pause",
        },
      ];
      this.recordInfo = {
        ...this.recordInfo,
        tabs: [...this.recordInfo.tabs],
      };
    }
    this.changeTab(0);

    if (this.businessKey) {
      this.getApproveData();
    }
    if (this.contractNo) {
      this.getContractRecevice();
      this.getExecuteData();
      this.getWorkInList();
      this.getClaimList();
      this.getWorkOutList();
      this.getRecepitList();
      this.getPauseList();
      this.getSettleList();
      this.getRefundList();
      this.getInvoiceList();
    }
    this.getCostList();

    uni.$on("refresh-list", (usnerinfo) => {
      this.getApproveData();
    });
  },
  methods: {
    dealMoney(money) {
      console.log(money, "money");
      return calRent.dealNumber(money);
    },
    tabClick(index) {
      this.activeTabIndex = index;
    },
    getNames(item) {
      let list = item.userInfo ? item.userInfo : [];
      let timeStr = "";
      list.forEach((o) => {
        if (timeStr == "") {
          timeStr = "@" + o.username;
        } else {
          timeStr = timeStr + "  @" + o.username;
        }
      });
      return timeStr;
    },
    getType(item) {
      let str;
      switch (item) {
        case "1":
          str = "日租";
          break;
        case "2"||'3':
          str = "月租";
          break;
        case "4":
          str = "日租转月租";
          break;
        default:
          break;
      }
      return str;
    },

    //展开闭合页面
    changeExpand(pos) {
      this.earningInfo.content.machineList[pos].isExpand =
        !this.earningInfo.content.machineList[pos].isExpand;
    },
    getTenancyFn(row) {
      if (!row.settlementType || !row.rentDays) return "-";

      let settlementType = row.settlementType;

      let days = Number(row.rentDays);

      switch (settlementType) {
        case "2": {
          /*月租 30天*/
          let months = Math.floor(days / 30);
          let rentDays = Math.fround(days % 30);

          return `${months}月${rentDays}天`;
        }
        case "3": {
          /*月租*/
          let months = row.calendarRentMonths;
          let rentDays = row.calendarRentDays;
          return `${months}月${rentDays}天`;
        }

        case "5": {
          /*周租*/
          let weeks = Math.floor(days / 7);
          let rentDays = Math.fround(days % 7);
          return `${weeks}周${rentDays}天`;
        }
        case "6": {
          /*月租（月份）*/
          let months = row.naturalRentMonths;
          let rentDays = row.naturalRentDays;
          return `${months}月${rentDays}天`;
        }
        default: {
          /*天租*/

          return `${days}天`;
        }
      }
    },
    getAssignees(item) {
      if (item.endTime) {
        return item.assignee;
      }
      let ass = item.assigneeList ? item.assigneeList.join("/") : null;
      if (ass) {
        return ass + "(未审批)";
      } else {
        return null;
      }
    },
    getContractRecevice() {
      let self = this;
      this.$network
        .getData(
          this.$url.CONTRACT_DETAIL_RECEIVABLE +
            "?contractNo=" +
            this.contractNo,
          "GET",
          null
        )
        .then((result) => {
          let revenuePerform = 0;
          let revenueReceived = 0;
          if (result.receivableCurrent) {
            revenuePerform =
              (result.receivableCurrent.hire
                ? Number.parseFloat(result.receivableCurrent.hire)
                : 0) +
              (result.receivableCurrent.claim
                ? Number.parseFloat(result.receivableCurrent.claim)
                : 0) +
              (result.receivableCurrent.carriage
                ? Number.parseFloat(result.receivableCurrent.carriage)
                : 0); // 履约营收

            this.earningInfo.content.revenuePerform = calRent.dealNumber(
              revenuePerform + ""
            );
            this.earningInfo.content.pledgeAppoint = result.receivableCurrent
              .pledge
              ? calRent.dealNumber(result.receivableCurrent.pledge)
              : "0.00";
            this.earningInfo.content.carriagePerform = result.receivableCurrent
              .carriage
              ? calRent.dealNumber(result.receivableCurrent.carriage)
              : "0.00";
          }
          if (result.receipt) {
            revenueReceived =
              (result.receipt.hire
                ? Number.parseFloat(result.receipt.hire)
                : 0) +
              (result.receipt.claim
                ? Number.parseFloat(result.receipt.claim)
                : 0) +
              (result.receipt.carriage
                ? Number.parseFloat(result.receipt.carriage)
                : 0); //已收营收

            console.log("revenueReceived:" + revenueReceived);
            this.earningInfo.content.revenueReceived = calRent.dealNumber(
              revenueReceived + ""
            );
            this.earningInfo.content.pledgeReceived = result.receipt.deposit
              ? calRent.dealNumber(result.receipt.deposit)
              : "0.00"; ////已收押金
            this.earningInfo.content.carriageReceived = result.receipt.carriage
              ? calRent.dealNumber(result.receipt.carriage)
              : "0.00";
          }

          if (result.advancePaymentDebt) {
            this.earningInfo.content.debt = result.advancePaymentDebt.debt
              ? "￥" + calRent.dealNumber(result.advancePaymentDebt.debt)
              : "--"; //预付应收金额
            this.earningInfo.content.dueDate = this.getDate(
              result.advancePaymentDebt.dueDate
            );
          }

          let customerReceiptTotalDone =
            result && result.receipt ? Number(result.receipt.deposit) : 0; //已收押金
          //计算应收比例
          this.debtRatio(
            revenuePerform,
            revenueReceived,
            customerReceiptTotalDone
          );

          if (result.machineReceivableList) {
            this.earningInfo.content.machineList =
              result.machineReceivableList &&
              result.machineReceivableList.length > 0
                ? result.machineReceivableList.map((o) => {
                    return {
                      ...o,
                      hire: o.hire ? "￥" + calRent.dealNumber(o.hire) : null,
                      hireMonthly: o.hireMonthly
                        ? "￥" + calRent.dealNumber(o.hireMonthly)
                        : null,
                      pledge: o.pledge
                        ? "￥" + calRent.dealNumber(o.pledge)
                        : "-",
                      carriage: o.carriage
                        ? "￥" + calRent.dealNumber(o.carriage)
                        : "-",
                      claimTotal: o.claimTotal
                        ? "￥" + calRent.dealNumber(o.claimTotal)
                        : "-",
                      hireTotal: o.hireTotal
                        ? "￥" + calRent.dealNumber(o.hireTotal)
                        : "-",
                      isExpand: false,
                    };
                  })
                : [];
          }
          console.log(
            this.earningInfo.content.machineList,
            " this.earningInfo.content.machineList"
          );
        })
        .catch((err) => {});
    },
    debtRatio(debtExpireTotal, debtExpireTotalDone, customerReceiptTotalDone) {
      let obj = {
        value: "",
        tip: "",
      };
      if (debtExpireTotal > 0) {
        let debtRatio =
          ((debtExpireTotal - customerReceiptTotalDone - debtExpireTotalDone) /
            debtExpireTotal) *
          100;
        if (debtRatio < 10) {
          //无、轻
          obj = {
            value: "",
            tip: "",
          };
        } else if (debtRatio > 10 && debtRatio < 30) {
          //中
          obj = {
            value: "中",
            tip: "(履约已收-押金)/履约营收 < 30% 并且 (履约已收-押金)/履约营收 > 10% ",
          };
        } else {
          obj = {
            value: "高",
            tip: " (履约已收-押金)/履约营收 > 30%",
          };
        }
      }

      this.$emit("debtRatio", obj);
    },
    getDate(time) {
      if (!time) return "--";
      return time.split(/\s+/)[0];
    },
    getApproveData() {
      //审批流
      let param = {
        businessKey: this.businessKey,
      };
      let url = this.$url.HISTORIC_FLOW_LIST.replace(/xxx/, "contractapi");
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "approve");
          this.recordInfo.tabs[i].list = result;
        })
        .catch((err) => {});
    },
    getExecuteData() {
      //执行流
      let self = this;
      this.$network
        .getData(
          this.$url.CONTRACT_EXECUTE_INFO + "?contractNo=" + this.contractNo,
          "GET",
          null
        )
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "excute");
          console.log(i);
          this.recordInfo.tabs[i].list = result;
          console.log(this.recordInfo);
        })
        .catch((err) => {});
    },
    getWorkInList() {
      //进场
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.WORK_IN_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "workin");
          self.recordInfo.tabs[i].list = result;
        })
        .catch((err) => {});
    },
    getClaimList() {
      //索赔
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.CLAIM_PAGE, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "claim");
          self.recordInfo.tabs[i].list = result.records;
        })
        .catch((err) => {});
    },
    getWorkOutList() {
      //退场
      let self = this;
      let param = {
        contractNo: this.contractNo,
      };
      this.$network
        .getData(this.$url.WORK_OUT_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "workout");
          self.recordInfo.tabs[i].list = result;
        })
        .catch((err) => {});
    },
    getRecepitList() {
      //收款
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.SETTLE_PROCEEDS_PAGE, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "proceed");
          self.recordInfo.tabs[i].list = result.records;
        })
        .catch((err) => {});
    },
    getRefundList() {
      //退款
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.SETTLE_REIMBURSE_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "reimburse");
          self.recordInfo.tabs[i].list = result.records;
        })
        .catch((err) => {});
    },
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    async getCostList() {
      //成本
      if (!this.contractNo) return;
      let self = this;
      let param = {
        current: 1,
        size: 1000,
        contractNo: self.contractNo,
      };
      let res = await this.$network.costList(param);
      let i = self.recordInfo.tabs.findIndex((o) => o.key == "cost");
      self.recordInfo.tabs[i].list = res.records || [];
      console.log(res, "res");
    },
    getSettleList() {
      //结算
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.SETTLEMENT_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "settle");
          self.recordInfo.tabs[i].list = result.records;
        })
        .catch((err) => {});
    },
    getPauseList() {
      //报停
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.PAUSE_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "pause");
          self.recordInfo.tabs[i].list = result;
        })
        .catch((err) => {});
    },
    getStatementList() {
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.SETTLE_LIST_DOWN, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "statement");
          this.recordInfo.tabs[i].list =
            result && result.records ? result.records : [];
        })
        .catch((err) => {});
    },
    getInvoiceList() {
      //发票
      let self = this;
      let param = {
        contractNo: this.contractNo,
        current: 1,
        size: 1000,
      };
      this.$network
        .getData(this.$url.SETTLE_INVOICE_LIST, "POST", param)
        .then((result) => {
          let i = this.recordInfo.tabs.findIndex((o) => o.key == "invoice");
          console.log(i);
          self.recordInfo.tabs[i].list =
            result && result.records ? result.records : [];
        })
        .catch((err) => {});
    },
    getFlowIcon(flowType) {
      let icon = {
        svg: "iconzl--hetong",
        color: "#E60000",
        name: "",
      };
      switch (flowType) {
        case "contract":
          icon.svg = "iconzl--hetong";
          icon.color = "#E60000";
          icon.name = "合同";
          break;
        case "contractChange":
          icon.svg = "iconzl--hetong";
          icon.color = "#5A7AE8";
          icon.name = "合同变更";
          break;
        case "workIn":
          icon.svg = "iconzl--ruchang";
          icon.color = "#E60000";
          icon.name = "进场";
          break;
        case "workOut":
          icon.svg = "iconzl--chuchang";
          icon.color = "#5A7AE8";
          icon.name = "退场";
          break;
        case "pause":
          icon.svg = "iconzl--zhuyi";
          icon.color = "#FB7135";
          icon.name = "报停";
          break;
        case "claim":
          icon.svg = "iconzl--suopei";
          icon.color = "#FCA01F";
          icon.name = "索赔";
          break;
        case "settle":
          icon.svg = "iconico_home_obligation";
          icon.color = "#FCA01F";
          icon.name = "结清";
          break;
        case "settlement":
          icon.svg = "iconico_home_obligation";
          icon.color = "#FCA01F";
          icon.name = "结算";
          break;
        case "statement":
          icon.svg = "iconico_home_obligation";
          icon.color = "#5A7AE8";
          icon.name = "对账";
          break;
        case "proceeds":
          icon.svg = "iconico_home_obligation";
          icon.color = "#E60000";
          icon.name = "收款";
          break;
        case "reimburse":
          icon.svg = "iconico_home_obligation";
          icon.color = "#ff5500";
          icon.name = "退款";
          break;
        case "cost":
          icon.svg = "iconico_home_obligation";
          icon.color = "#ff5500";
          icon.name = "成本";
          break;
        case "contractPlus":
          icon.svg = "iconzl--hetong";
          icon.color = "#5A7AE8";
          icon.name = "合同附加";
          break;
        case "invoice":
          icon.color = "#5A7AE8";
          icon.name = "发票";
          break;

        default:
          break;
      }
      return icon;
    },
    //进退场单
    goToOrder(type, businessNo) {
      if (!businessNo) {
        return;
      }
      if (this.contractType == "1" || this.contractType == "2") {
        switch (type) {
          case "workIn":
            uni.navigateTo({
              url:
                "/businessPages/workin/workin-detail?businessNo=" + businessNo,
            });
            break;
          case "workOut":
            uni.navigateTo({
              url:
                "/businessPages/workout/workout-detail?businessNo=" +
                businessNo,
            });
            break;
          default:
            break;
        }
      }
      if (this.contractType == "3") {
        switch (type) {
          case "workIn":
            uni.navigateTo({
              url:
                "/businessPages/workin/workin-simple-detail?businessNo=" +
                businessNo,
            });
            break;
          case "workOut":
            uni.navigateTo({
              url:
                "/businessPages/workout/workout-detail-simple?businessNo=" +
                businessNo,
            });
            break;
          default:
            break;
        }
      }
    },
    gotoWrite(item) {
      uni.navigateTo({
        url:
          "/businessPages/workin/work-flow-write?item=" +
          encodeURIComponent(JSON.stringify(item)),
      });
    },
    goTo(item) {
      let self = this;
      console.log(item, "detainInfo11");
      switch (item.businessType) {
        case "workIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/invoice-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/porceeds-detail?businessNo=" +
              item.businessNo,
          });
          break;
        // 退款
        case "reimburse":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" +
              item.businessNo,
          });
          break;
        //成本
        case "cost":
          uni.navigateTo({
            url:
              "/businessPages/cost-manage/cost-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "costlist":
          let customerName = item.customerName ? item.customerName + "-" : null;
          let projectName = item.projectName ? item.projectName : null;
          let contractName = customerName
            ? customerName
            : null + contractName
            ? contractName
            : null;
          uni.switchTab({
            url: "/pages/main/business",
            success: function (e) {
              let info = {
                param: {
                  contractName,
                },
                key: "costManage",
                id: 15,
              };
              uni.setStorage({
                key: self.$savekey.MEMORY_STORAGE,
                data: info,
              });
            },
          });
          break;

        case "claim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contract":
          uni.navigateTo({
            url: "./contract-detail?id=" + item.id,
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/workout-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "pause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "contractChange":
          console.log(item);
          uni.navigateTo({
            url:
              "/contractPages/contract-change/contract-change-detail?id=" +
              item.id,
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail?businessNo=" +
              item.businessNo,
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
    changeTab(index) {
      if (!this.recordInfo.tabs[index].checked) {
        this.recordInfo.tabs[index].checked = true;
      }
      for (let i = 0; i < this.recordInfo.tabs.length; i++) {
        if (i != index) {
          this.recordInfo.tabs[i].checked = false;
        }
      }
      this.recordInfo.selectedTab = this.recordInfo.tabs[index];
      // this.recordInfo.selectedTab.list.push({})
      console.log(this.recordInfo.selectedTab, "this.recordInfo.selectedTab");
    },
    onPageScroll(e) {
      if (e.scrollTop >= 203) {
        this.flowPosition = "fixed";
        this.flowTopHeight = "88px";
        this.flowMargintop = "66px";
      } else {
        this.flowPosition = "relative";
        this.flowTopHeight = "0px";
        this.flowMargintop = "0px";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-tabs {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  margin-top: 24rpx;
}

.tabs {
  display: flex;
  align-items: center;
  margin: 0 24rpx;
  line-height: 72rpx;
  background: #f5f4f9;
  justify-content: space-between;
  border-radius: 6rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;

  .tab-item {
    width: 49%;
    height: 56rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .active-tab {
    padding: 2rpx;
    margin: 0 12rpx;
    text-align: left;
    background: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
  }
}

.execute-info-content {
  width: 100%;
  height: 100%;
  //   margin-top: 34rpx;
}

.earning {
  background-color: #fff;
  padding-top: 30rpx;
}

/**公共组件**/
.container {
  margin: 8px;
}

/**信息标题**/
.tag {
  margin: 12px 8px 8px 0px;
  color: $uni-text-color;
  font-weight: bold;
  padding-left: 8px;
  border-left: 2px solid #e60000;
  font-size: $uni-font-size-base;
}

/**具体信息外边框**/
.info-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 16px 16px 8px 16px;
}

.earning-top {
  display: flex;
  flex-direction: row;
}

.earning-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  flex: 1;
}

.cost-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 16px 16px 8px 16px;
  display: flex;
  flex-direction: row;
  flex-basis: 50%;
  flex-wrap: wrap;
}

.cost-item {
  margin-bottom: 16px;
  flex: 1;
  flex-basis: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 30rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:nth-child(2n) {
    text-indent: 30rpx;
  }
}

.cost-item-title {
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  margin-bottom: 16rpx;
}

.cost-item-text {
  font-size: $uni-font-size-lg;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #222222;
}

.e-item-title {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.e-item-sub-title {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-gray;
  margin-top: 4px;
}

.e-item-value {
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
  font-weight: bold;
  margin-top: 8px;
}

.earning-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-top: 8px;
}

.machine-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.machine-right {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.v-detail {
  margin-left: 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/**详情箭头动画**/
.translate-arrow {
  font-size: 16px;
  transform: rotate(-90deg);
  transition: all 500ms;
  color: #e60000;
}

.translate-arrow-expend {
  font-size: 16px;
  transform: rotate(90deg);
  transition: all 500ms;
  color: #e60000;
}

.machine-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 4px;
  margin-top: 4px;
}

.top-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  height: 14px;
  line-height: 14px;
  padding: 2px 4px;
  margin-right: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
}

.machine-content {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  padding-top: 8px;
}

.machine-cell {
  width: 33%;
  padding-bottom: 8px;
}

.machine-cell-key {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
}

.machine-cell-value {
  color: #222222;
  font-size: $uni-font-size-base;
  height: 24px;
  line-height: 24px;
  min-width: 66px;
  font-weight: bold;
}

/**执行记录**/
.record-flow {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 8px 0px;
  background-color: #ffffff;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.flow-tag {
  width: 160px;
  margin-right: 4px;
  margin-left: 4px;
  min-width: 80px;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-color: $uni-text-color-disable;
  border-width: 0px 1px 0px 0px;
  border-style: solid;
}

.flow-item {
  flex: 1;
  text-align: center;
  padding: 4px 0px;

  &.selected {
    background: #e60000;
    color: #ffffff;
    border-radius: 8px;
  }
}

.scroll-container {
  width: 100%;
  background: #ffffff;
}

.tabs-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  width: calc(100% - 168px);
}

.tab-item {
  padding: 4px 8px;
  white-space: nowrap;

  &.selected {
    background: #e60000;
    color: #ffffff;
    border-radius: 16px;
  }
}

.execute-flow-item {
  margin: 0px 16px;
  display: flex;
  flex-direction: row;
}

.line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-top {
  background-color: $uni-border-color;
  width: 1px;
  height: 30px;
}

.line-bottom {
  background-color: $uni-border-color;
  width: 1px;
  flex: 1;
}

.middle-circle {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  border-width: 7rpx;
  border-color: #e60000;
  border-style: solid;
}

.real-contant {
  display: flex;
  margin-left: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 4px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.r-icon {
  color: #e60000;
  font-size: 14px;
  margin-right: 4px;
}

.execute-flow-name {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flow-name {
  font-size: $uni-font-size-base;
  font-weight: bold;
  color: $uni-text-color;
}

.flow-result {
  margin-left: 8px;
  border: 1px solid #10cbe1;
  padding: 2px 4px;
  border-radius: 4px;
  color: #10cbe1;
}

.execute-time {
  font-size: $uni-font-size-xs;
  color: #8c8c8c;
}

.execute-creator {
  margin-left: 8px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-middle {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  justify-content: space-between;
  margin-top: 8px;
  color: $uni-text-color;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  justify-content: space-between;
  margin-top: 8px;
  color: $uni-text-color-gray;
}

.b-left {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.execute-option {
  margin-left: 16px;
  word-wrap: break-word;
}

//列表第一个的上半部分线不显示
.execute-flow-item:first-child .line-container .line-top {
  background-color: $uni-bg-color-grey;
}

//列表最后一个的下半部分线不显示
.execute-flow-item:last-child .line-container .line-bottom {
  background-color: $uni-bg-color-grey;
}

//操作页面
.bgview {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.list-view-bg,
.cell-item {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.cellBgView {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 10px;
  background: #ffffff;
}

.cell-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
}

.cell-text-left {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-left: 7px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.cell-text-right {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-right: 15px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}

.fontBlackcolor {
  color: $uni-text-color;
}

.fontdetailcolor {
  color: $uni-color-primary;
}

.fontgreencolor {
  color: #4cd964;
}

.line-s {
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: #eeeeee;
}

.item-cell {
  display: flex;
  flex-direction: column;
  padding: 5px;
  font-size: $uni-font-size-base;
  color: #222831;
  background: $uni-bg-color-grey;
}

.spanstyle {
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 5px;
  color: #222831;
  font-weight: bold;
  font-size: $uni-font-size-base;
  margin-right: 5px;
}

.bottom-comment {
  display: flex;
  flex-direction: row;
  margin: 5px;
  justify-content: flex-end;
}

.cell-text-right-all {
  margin-top: 5px;
  align-items: center;
  font-size: $uni-font-size-base;
  color: #e0e0e0;
  border: 1px solid #e0e0e0;
  padding: 5px 5px;
  border-radius: 4px;
}

.timeclass {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 0px;
  justify-content: flex-end;
  font-size: $uni-font-size-sm;
  color: #999999;
}

.timeclassshow {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
