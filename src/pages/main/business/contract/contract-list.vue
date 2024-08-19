<template>
  <view class="content">
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <c-search-bar placeholder="合同名称" :value="searchKey" @input="searchChange" @clear="clearsum" @ok="oksum">
        <view slot="pre">
          {{ totalNum }}笔
        </view>
        <view class="filter-view">
          <view
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              margin: 0 5px;
              width: 100%;
            "
          >
            <selectView
              style="width: 33%"
              :value="salesmanObj.label"
              hint="业务负责人"
              @clickSelect="showPick('salesman')"
            />
            <selectView
              style="width: 33%"
              :value="orgObj.label"
              hint="区域"
              @clickSelect="showPick('org')"
            />
            <selectView
              style="width: 33%"
              :value="stateObj.label"
              hint="合同进度"
              @clickSelect="showPick('contractprogress')"
            />
            <selectView
              style="width: 33%; margin-top: 15rpx"
              :value="flowStatusObj.label"
              hint="签署状态"
              @clickSelect="showPick('flowStatus')"
            />
          </view>
        </view>

        <view class="filter-view" >
          <view class="select-view-row">合同签订时间</view>
          <view class="btn-container">
            <view
              class="btn"
              :class="{ active: timeType === 'month' }"
              @click="selectDate('month')"
              >本月</view
            >
            <view
              class="btn"
              :class="{ active: timeType === 'year' }"
              @click="selectDate('year')"
              >本年</view
            >
            <view
              class="btn"
              :class="{ active: timeType === 'custom' }"
              @click="selectDate('custom')"
              >自定义</view
            >
          </view>
        </view>
        <view class="filter-view" v-if="showTime">
          <view class="bottom-search-top">
            <label-arrow
              style="flex: 1"
              :value="startTime"
              arrowColor="#999999"
              textColor="#222831"
              textSize="14"
              arrowSize="14"
              @clickLabel="showdatepick('starttime')"
            />
            <label-arrow
              style="margin-left: 30px; flex: 1"
              :value="endTime"
              arrowColor="#999999"
              textColor="#222831"
              textSize="14"
              arrowSize="14"
              @clickLabel="showdatepick('endtime')"
            />
          </view>
        </view>
        <view class="filter-view">
          <view class="select-view-row">合同创建时间</view>
          <view class="btn-container">
            <view
              class="btn"
              :class="{ active: timeCType === 'cmonth' }"
              @click="selectDate('cmonth')"
              >本月</view
            >
            <view
              class="btn"
              :class="{ active: timeCType === 'cyear' }"
              @click="selectDate('cyear')"
              >本年</view
            >
            <view
              class="btn"
              :class="{ active: timeCType === 'ccustom' }"
              @click="selectDate('ccustom')"
              >自定义</view
            >
          </view>
        </view>
        <view class="filter-view" v-if="showCTime">
          <view class="bottom-search-top">
            <label-arrow
              style="flex: 1"
              :value="startCTime"
              arrowColor="#999999"
              textColor="#222831"
              textSize="14"
              arrowSize="14"
              @clickLabel="showdatepick('startctime')"
            />
            <label-arrow
              style="margin-left: 30px; flex: 1"
              :value="endCTime"
              arrowColor="#999999"
              textColor="#222831"
              textSize="14"
              arrowSize="14"
              @clickLabel="showdatepick('endctime')"
            />
          </view>
        </view>
        <view class="flex" slot="btnsRight">
          <view class="more-css" @click.stop="exportExcel"><text>下载</text></view>
          <view class="more-css" @click.stop="goToDraft"><text>草稿</text></view>
        </view>
      </c-search-bar>
    </view>
    <view class="list-container">
      <businessItemFrame
        bgcolor="#fff"
        margin="8px 0"
        padding="0"
        v-for="(contract, i) in contractList"
        :key="i"
        :stateName="contract.state !== '6' ? contract.stateName : ''"
        :attachmentNum="contract.fileListNum ? contract.fileListNum : 0"
        :showHeadTag="contract.contractType != '1'"
        @addPic="gotoFileList(contract)"
        @click.native="goTo('detail', contract)"
      >
        <block slot="title">
          <view class="row-line" style="align-items: flex-start">
            <view v-if="contract.contractType != '1'">
              <headTag
                :value="contract.contractType == '2' ? '框' : '快'"
                :backgroundColor="contract.contractType == '2' ? '#1278FF' : '#F08200'"
              ></headTag>
            </view>

            <!-- <view style="height: 18px;min-width: 16px;margin-right: 6px;line-height: 18px;" v-if="contract.contractType != '1'">
							<text class="title-tag-text" :style="{ 'background-color': contract.contractType == '3' ? '#FE931F' : '#E60000' }">
								{{ contract.contractType == '2' ? '框' : contract.contractType == '3' ? '快' : '' }}
							</text>
						</view>
 -->
            <view class="oneleveltitle">
              {{ contract.customerName || "" }}
              -
              {{
                contract.contractDetailDto ? contract.contractDetailDto.projectName : ""
              }}
            </view>
          </view>
        </block>
        <block slot="state">
          <view v-if="contract.state == '6'">
            <span style="color: #1278ff">进{{ contract.workInCount || "0" }}</span>
            <span style="color: #e6e6e6; font-size: 14px; margin: 0px 0px">|</span>
            <span style="color: #f08200">退{{ contract.workOutCount || "0" }}</span>
            <span style="color: #e6e6e6; font-size: 14px; margin: 0px 0px">|</span>
            <span style="color: #8c8c8c">停{{ contract.pauseCount || "0" }}</span>
          </view>
        </block>
        <block slot="subContent">
          <view class="max-one-line">
            {{ contract.businessNo }}
            &nbsp;|&nbsp;
            {{ contract.customerSalesmanName || "-" }}
            &nbsp;|&nbsp;
            {{ getDeviceNumStr(contract) }}
            &nbsp;|&nbsp;
            {{ contract.orgName || "-" }}
          </view>
        </block>
        <block slot="content">
          <view>
            <view class="row-line padding-tb-xs text-gray">
              <view class="text-gray flex-1">
                履约营收（A）：￥{{ contract.revenuePerform }}
              </view>
              <view class="text-gray flex-1">
                履约欠款（A-C）：￥{{ contract.acDiff }}
              </view>
            </view>
            <view class="row-line padding-tb-xs text-gray">
              <view class="text-gray flex-1">
                结算营收（B）：￥{{ contract.settlement }}
                <span class="text-success" v-if="contract.isSettled">
                  （结清前￥{{ contract.originSettlementReceiveTotal }}）
                </span>
              </view>
              <view class="text-gray flex-1">
                结算欠款（B-C）：￥{{ contract.bcDiff }}
                <span class="text-success" v-if="contract.isSettled">
                  （结清前￥{{ contract.originBcDiff }}）
                </span>
              </view>
            </view>
            <view class="row-line padding-tb-xs text-gray">
              <view class="text-gray flex-1">
                实收（C）：￥{{ contract.revenueReceived }}
              </view>
              <view class="text-gray flex-1" style="display: flex; align-items: center">
                欠款天数
                <businessTips tips="欠款天数从有结算单未付款或未付清的第二天开始计算" />
                ：
                {{ contract.arrearDays || "0" }}
              </view>
            </view>
            <view class="row-line padding-tb-xs">
              <view class="text-gray flex-1"> 合同状态：{{ contract.stateName }} </view>
              <view class="text-gray flex-1">
                签署状态：{{ contract.flowStatus | esignStatusName }}
              </view>
            </view>
          </view>
        </block>
        <block slot="options">
          <view class="row-line">
            <taskBtn :itemData="contract" :isBorder="true" />
            <view
              class="option-btn"
              @click.stop="editcontract(contract)"
              v-if="contract.state === '0' || contract.state === '3'"
            >
              修改
            </view>
            <view
              class="option-btn"
              @click.stop="pigeonholeSave(contract)"
              v-if="contract.state == '9' && addPigenohole"
            >
              归档
            </view>
            <view
              class="option-btn"
              @click.stop="share(contract)"
              v-if="contract.state != 1"
            >
              分享
            </view>
            <view
              class="option-btn"
              @click.stop="goTo('delete', contract)"
              v-if="addDelete && !(contract.state == '4')"
            >
              删除
            </view>
            <view
              class="option-btn"
              @click.stop="goTo('more', contract)"
              v-if="showMore(contract) && isshowMore && showButton(contract)"
            >
              更多
            </view>
          </view>
        </block>
      </businessItemFrame>
    </view>
    <view><uni-load-more iconType="auto" :status="status" /></view>
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
      @confirm="onConfirmDate"
      :disabledAfter="true"
      ref="date"
      themeColor="#E60000"
    />
    <view class="pop-container">
      <uni-popup ref="morePop" type="center" :mask-click="true">
        <view class="uni-tip">
          <view
            @click.stop="goTo('workIn', curPopContract)"
            v-if="curPopContract.contractType != '3'"
            :class="
              addWorkIn &&
              (curPopContract.state == '5' ||
                curPopContract.state == '6' ||
                curPopContract.state == '7' ||
                curPopContract.state === '8') &&
              curPopContract.contractType != '3'
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            进场
          </view>
          <view
            v-if="curPopContract.contractType == '3'"
            @click.stop="goTo('workInSimple', curPopContract)"
            :class="
              addExWorkIn &&
              (curPopContract.state == '5' ||
                curPopContract.state == '6' ||
                curPopContract.state == '7' ||
                curPopContract.state === '8') &&
              curPopContract.contractType == '3'
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            快捷进场
          </view>
          <view
            class="pop-item-line"
            v-if="curPopContract.contractType != '3'"
            @click.stop="goTo('workOut', curPopContract)"
            :class="
              curPopContract.state === '6' && addWorkOut ? 'pop-item' : 'pop-item-disable'
            "
          >
            退场
          </view>
          <view
            class="pop-item-line"
            v-if="curPopContract.contractType == '3'"
            @click.stop="goTo('workOutSimple', curPopContract)"
            :class="
              curPopContract.state === '6' && addExWorkOut
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            快捷退场
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('proceed', curPopContract)"
            :class="addProceed ? 'pop-item' : 'pop-item-disable'"
            >收款</view
          >
          <view
            class="pop-item-line"
            @click.stop="goTo('refund', curPopContract)"
            :class="addRefund ? 'pop-item' : 'pop-item-disable'"
            >退款</view
          >
          <view
            class="pop-item-line"
            :class="
              curPopContract.state === '6' || curPopContract.state === '7'
                ? 'pop-item'
                : 'pop-item-disable'
            "
            @click.stop="goTo('settle', curPopContract)"
            >结算
          </view>
          <view
            class="pop-item-line"
            :class="canContractSettled(curPopContract) ? 'pop-item' : 'pop-item-disable'"
            @click.stop="goTo('settled', curPopContract)"
          >
            结清
          </view>
          <view class="pop-item-line pop-item" @click.stop="goTo('cost', curPopContract)"
            >成本</view
          >
          <view
            class="pop-item-line"
            @click.stop="goTo('claim', curPopContract)"
            :class="
              (curPopContract.state === '6' ||
                curPopContract.state === '7' ||
                curPopContract.state === '8') &&
              addClaim
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            索赔
          </view>
          <view
            v-if="curPopContract.arrearDays"
            class="pop-item-line pop-item"
            @click.stop="goTo('smsDunning', curPopContract)"
          >
            短信催款
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('pause', curPopContract)"
            :class="
              (curPopContract.state === '6' ||
                curPopContract.state === '7' ||
                curPopContract.state === '8') &&
              addPause
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            报停
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('discounts', curPopContract)"
            :class="
              addDiscounts &&
              (curPopContract.state == '6' ||
                curPopContract.state == '7' ||
                curPopContract.state == '8')
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            优惠/增收
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('changeContract', curPopContract)"
            :class="
              addChange &&
              curPopContract.contractType === '1' &&
              !curPopContract.plusIng &&
              !curPopContract.changeIng
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            合同变更
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('delete', curPopContract)"
            :class="
              addDelete && !(curPopContract.state == '4')
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            删除合同
          </view>
          <view
            class="pop-item-line"
            @click.stop="goTo('contractExpense', curPopContract)"
            :class="
              addExpanse &&
              curPopContract.contractType === '1' &&
              !curPopContract.plusIng &&
              !curPopContract.changeIng
                ? 'pop-item'
                : 'pop-item-disable'
            "
          >
            附加合同
          </view>
        </view>
      </uni-popup>
    </view>
    <view class="pop-container">
      <uni-popup ref="downDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"
            >默认导出的数据是列表页面查询到的前100条数据，当前可导出条数{{
              totalNum
            }}条。</view
          >
          <view class="row-item">
            <view class="row-tag">开始条数</view>
            <input
              class="input-style"
              type="number"
              v-model="startNum"
              placeholder="请输入开始条数"
            />
          </view>
          <view class="row-item">
            <view class="row-tag">结束条数</view>
            <input
              class="input-style"
              type="number"
              v-model="endNum"
              placeholder="请输入结束条数"
            />
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click.stop="cancelDialog">取消</text>
            <text class="uni-tip-button pop-confirm" @click.stop="confirmDialog"
              >确定</text
            >
          </view>
        </view>
      </uni-popup>
    </view>
    <c-contract-eco-share
      ref="share"
      :settleRevenue="curContract.settlement"
      :settleArrears="curContract.bcDiff"
      :paid="curContract.revenueReceived"
      :contract="curContract"
    ></c-contract-eco-share>

    <settle-pop ref="settlePop"></settle-pop>
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
  </view>
</template>
<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import badgeview from "@/components/common/image-upload/badge-icon.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import headTag from "@/components/common/common-ui/head-tag.vue";
import sanyPopup from "@/components/common/sany/sany-popup.vue";

import settlePop from "./settle-pop.vue";
import { mapState } from "vuex";

let timer;
export default {
  components: {
    uniLoadMore,
    uniPopup,
    badgeview,
    taskBtn,
    wPicker,
    labelArrow,
    selectView,
    businessItemFrame,
    headTag,
    settlePop,
    sanyPopup,
  },
  data() {
    return {
      curContract: {},
      flowStatusList: [
        {
          value: 0,
          label: "草稿",
        },
        {
          value: 1,
          label: "签署中",
        },
        {
          value: 2,
          label: "已完成",
        },
        {
          value: 3,
          label: "撤销",
        },
        {
          value: 5,
          label: "过期",
        },
        {
          value: 7,
          label: "拒签",
        },
      ],
      page: 1,
      pageSize: 10,
      optionType: "解锁",
      status: "more",
      searchKey: "",
      isShowSelect: false,
      rentType: [],
      contractList: [],
      salesmanlist: [],
      selectList: [],
      salesmanObj: {
        label: "业务负责人",
        value: "",
      },
      orgObj: {
        label: "区域",
        value: "",
      },
      flowStatusObj: {
        label: "签署状态",
        value: "",
      },
      stateObj: {
        label: "合同进度",
        value: "",
      },
      searchTypes: [],
      checkedList: [],
      isShowAdd: true,
      isShowExAdd: true,
      curPopContract: {
        state: "-1",
      },
      addWorkIn: true,
      addWorkOut: true,
      addExWorkIn: true,
      addExWorkOut: true,
      addChange: true,
      addDelete: true,
      addExpanse: true,
      addRefund: true,
      addCost: true,
      addProceed: true,
      addClaim: true,
      addPause: true,
      isExportList: true, //列表导出
      userid: "",
      showMoreIcon: true,
      titleSum: "",
      titleDic: {},
      downloadTask: null,
      totalNum: 0,
      isShowGroup: false,
      showTime: false,
      startTime: "开始时间",
      endTime: "结束时间",
      timeType: "",
      showCTime: false,
      startCTime: "开始时间",
      endCTime: "结束时间",
      timeCType: "",
      picktype: "",
      //-----
      startNum: "1",
      endNum: "100",
      addPigenohole: true,
      isshowMore: true,
      orgList: [],
      addDiscounts: true,
      contractTypes: [],
    };
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  watch: {
    endNum(val) {
      this.endNum = val;
      setTimeout(() => {
        if (parseInt(val) > parseInt(this.totalNum)) {
          this.endNum = this.totalNum;
        }
        // if(parseInt(val) > 100){
        // 	this.endNum = '100'
        // }
      }, 100);
    },
  },
  mounted() {
    this.getContractData();
    this.getNumData();
    this.loadOwnerList();
    this.getSysDicPages();
  },
  created() {
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Administrative,
      "合同列表",
      "列表"
    );
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isShowAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_ADD
        );
        this.isShowExAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SIMPLE_CONTRACT_ADD
        );
        this.addWorkIn = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_WORK_IN_ADD
        );
        this.addWorkOut = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_WORK_OUT_ADD
        );
        this.addExWorkIn = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SIMPLE_WORKIN_ADD
        );
        this.addExWorkOut = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SIMPLE_WORKOUT_ADD
        );
        this.addChange = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_CHANGE_ADD
        );
        this.addDelete = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_DELETE
        );
        this.addExpanse = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_EXPENSE_ADD
        );
        this.addProceed = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_COLLECTION_MANAGE_ADD
        );
        this.addRefund = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_REFUND_MANAGE_ADD
        );
        this.addCost = res.data.some((x) => x.value === "costAdd");
        this.addClaim = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_BUSINESS
        );
        this.addPause = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_PAUSE_MANAGE_ADD_BUSINESS
        );
        this.isExportList = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_EXPORT_CONTRACT_LIST
        );
        this.addPigenohole = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_ADD_PIGENOHOLE
        );
        this.addDiscounts = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_ADD_DISCOUNTS
        );
        this.getAddP();
      },
    });
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.userid = res.data.id;
      },
    });
    // let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
    // if(resData){
    // 	let obj = resData.find(o => o.code === 'tenant_name')
    // 	if (obj) {
    // 		this.isshowMore = obj.value === 'liangXu' ? false : true
    // 	}
    // }
    this.getOrgList();
  },
  methods: {
    popClose() {
      this.$emit("popClose");
    },
    share(row) {
      this.curContract = row;
      this.$nextTick((_) => this.$refs.share.share());
    },
    getFlowStatusName(row) {
      if (!row) return;
      let flowStatusName = null;
      switch (row.flowStatus) {
        case 0:
          flowStatusName = "草稿";
          break;
        case 1:
          flowStatusName = "签署中";
          break;
        case 2:
          flowStatusName = "已完成";
          break;
        case 3:
          flowStatusName = "撤销";
          break;
        case 5:
          flowStatusName = "过期";
          break;
        case 7:
          flowStatusName = "拒签";
          break;
        default:
          flowStatusName = "-";
          break;
      }
      return flowStatusName;
    },
    getAddP() {
      let list = [];
      list.push({ label: "新建普通合同", value: "1" });
      this.contractTypes = [...list];
    },
    //--------------------
    clearsum() {
      this.isShowGroup = false;
      this.showTime = false;
      this.startTime = "开始时间";
      this.endTime = "结束时间";
      this.timeType = "";
      this.showCTime = false;
      this.startCTime = "开始时间";
      this.endCTime = "结束时间";
      this.timeCType = "";
      this.salesmanObj = {
        label: "业务负责人",
        value: "",
      };
      this.orgObj = {
        label: "区域",
        value: "",
      };
      this.flowStatusObj = {
        label: "签署状态",
        value: null,
      };
      this.stateObj = {
        label: "合同进度",
        value: "",
      };
      this.orgIdList = [];
      this.oksum();
    },
    oksum() {
      if (this.timeType === "custom") {
        if (this.startTime === "开始时间") {
          uni.showToast({
            icon: "none",
            title: "请选择合同签署自定义开始时间",
          });

          return;
        }
        if (this.endTime === "结束时间") {
          uni.showToast({
            icon: "none",
            title: "请选择合同签署自定义结束时间",
          });
          return;
        }
      }
      if (this.timeType === "ccustom") {
        if (this.startCTime === "开始时间") {
          uni.showToast({
            icon: "none",
            title: "请选择合同创建自定义开始时间",
          });
          return;
        }
        if (this.endCTime === "结束时间") {
          uni.showToast({
            icon: "none",
            title: "请选择合同创建自定义结束时间",
          });
          return;
        }
      }

      this.page = 1;
      this.contractList = [];
      this.getContractData();
      setTimeout(() => {
        this.isShowGroup = false;
      }, 100);
    },
    selectDate(type) {
      if (this.timeType === type) {
        this.showTime = false;
        this.timeType = "";
        return;
      }
      if (this.timeCType === type) {
        this.showCTime = false;
        this.timeCType = "";
        return;
      }
      switch (type) {
        case "month":
          this.showTime = false;
          this.timeType = type;
          break;
        case "year":
          this.showTime = false;
          this.timeType = type;
          break;
        case "custom":
          this.showTime = !this.showTime;
          this.timeType = type;
          break;
        case "cmonth":
          this.showCTime = false;
          this.timeCType = type;
          break;
        case "cyear":
          this.showCTime = false;
          this.timeCType = type;
          break;
        case "ccustom":
          this.showCTime = !this.showCTime;
          this.timeCType = type;
          break;
        default:
          break;
      }
    },
    showdatepick(type) {
      this.picktype = type;
      this.$refs.date.show();
    },
    onConfirmDate(val) {
      if (this.picktype === "starttime") {
        this.startTime = val.result;
      } else if (this.picktype === "endtime") {
        this.endTime = val.result;
      } else if (this.picktype === "startctime") {
        this.startCTime = val.result;
      } else if (this.picktype === "endctime") {
        this.endCTime = val.result;
      }
    },
    //--------------------

    getSignStatus(item) {
      if (!item.signStatus || item.signStatus == "") {
        return "-";
      }
      //0-草稿 1-签署中 2-完成 3-撤销 5-过期（签署截至日志到期后触发）7-拒签
      let state = item.signStatus;
      if (state == 0) {
        return "草稿";
      }

      if (state == 1) {
        return "签署中";
      }
      if (state == 2) {
        return "签署完成";
      }
      if (state == 3) {
        return "撤销";
      }
      if (state == 5) {
        return "过期";
      }
      if (state == 7) {
        return "拒签";
      }
      return "-";
    },
    getsalemans(obj) {
      this.salesmanObj = obj;
      // this.page = 1;
      // this.contractList = [];
      // this.getContractData();
    },
    getOrgData(org) {
      if (org != null && org.value != "") {
        this.orgObj = org;
        this.orgIdList = [this.orgObj.value];
        // this.page = 1;
        // this.contractList = [];
        // this.getContractData();
      }
    },
    getDateData(bt, et, type) {
      this.startCTime = bt;
      this.endCTime = et;
      if (type == "1") {
        this.timeCType = "cmonth";
      } else if (type == "2") {
        this.timeCType = "cyear";
      } else if (type == "3") {
        this.timeCType = "ccustom";
      }
    },
    allFinishLoadData() {
      this.page = 1;
      this.contractList = [];
      this.getContractData();
    },
    isuser(item) {
      if (
        item.createBy === this.userid ||
        item.contractDetailDto.customerSalesman === this.userid
      ) {
        return true;
      } else {
        return false;
      }
    },
    editcontract(item) {
      uni.navigateTo({
        url:
          "/contractPages/contract/create-contract?isUpdate=1&contractNo=" +
          item.businessNo,
      });
    },
    showMore(item) {
      let p =
        this.addWorkIn ||
        this.addWorkOut ||
        this.addChange ||
        this.addDelete ||
        this.addExpanse ||
        this.addProceed ||
        this.addRefund ||
        this.addClaim ||
        this.addPause;
      if (p) {
        return (
          item.state === "5" ||
          item.state === "6" ||
          item.state === "7" ||
          item.state === "8"
        );
      }
      return p;
    },
    showButton(item) {
      if (item.isSettle) {
        return false;
      }
      return true;
    },
    showPick(type) {
      this.picktype = type;
      switch (type) {
        case "salesman":
          this.selectList = this.salesmanlist;
          break;
        case "org":
          this.selectList = this.orgList;
          break;
        case "contractprogress":
          this.selectList = this.searchTypes;
          break;
        case "flowStatus":
          this.selectList = this.flowStatusList;
          break;
        default:
          break;
      }
      this.$refs.selector.show();
    },
    onConfirm(val) {
      switch (this.picktype) {
        case "salesman":
          this.salesmanObj = val.checkArr;
          break;
        case "org":
          this.orgObj = val.checkArr;
          this.orgIdList = [val.checkArr.value];
          break;
        case "flowStatus":
          this.flowStatusObj = val.checkArr;
          console.log(this.flowStatusObj, "this.flowStatusObj");
          // this.orgIdList = [val.checkArr.value];
          break;
        case "contractprogress":
          this.stateObj = val.checkArr;
          break;

        case "create":
          this.addContract(val.checkArr.value);
          uni.setStorage({
            key:
              this.$savekey.LAST_CREATE_TYPE + "_contract_" + this.$datestr.getUserId(),
            data: val.checkArr.value,
          });
          break;

        default:
          break;
      }
    },
    goToLastAdd() {
      let key = this.$savekey.LAST_CREATE_TYPE + "_contract_" + this.$datestr.getUserId();
      let lastAddId = uni.getStorageSync(key);
      if (lastAddId) {
        this.addContract(lastAddId);
      } else {
        this.addContract("1");
      }
    },
    addContract(type) {
      this.$gxfmethod.statisticData(
        this.$eventId.Contract_Administrative,
        "合同列表",
        "新增合同"
      );
      if (type == "1") {
        uni.navigateTo({
          url: "/contractPages/contract/create-contract",
        });
      } else if (type == "2") {
        uni.navigateTo({
          url: "/contractPages/contract-kit/create-contract-kit",
        });
      } else if (type == "3") {
        uni.navigateTo({
          url: "/contractPages/contract/create-contract-simple",
        });
      }
    },
    //加载负责人
    loadOwnerList() {
      let param = {
        showAdmin: false,
        roleType: this.$savekey.USER_ROLE_BUSINESS,
      };
      uni.showLoading();
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          this.salesmanlist = [];
          this.salesmanlist.push({
            label: "全部",
            value: "",
          });
          this.salesmanlist = this.salesmanlist.concat(
            result
              ? result.map((dict) => {
                  return {
                    label: dict.username,
                    value: dict.id,
                  };
                })
              : []
          );
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getStatementData(item) {
      let param = {
        contractNo: item.businessNo,
      };
      this.$network
        .getData(this.$url.GET_SETTLE_BY_CONTRACT, "GET", param)
        .then((result) => {
          uni.navigateTo({
            url:
              "/businessPages/discounts/discounts-create?contract=" +
              encodeURIComponent(JSON.stringify(item)),
          });
        })
        .catch((err) => {
          uni.showToast({
            title: err.details ? err.details[0] : err.message,
            icon: "none",
          });
        });
    },
    canContractSettled(row) {
      if (row.state == "6" || row.state == "7") {
        return row.workInCount > 0 && row.workInCount == row.workOutCount;
      }
      return row.state === "8";
    },
    goTo(type, item) {
      console.log(item, "goTo");
      switch (type) {
        case "detail":
          if (item.state != "0" && item.state != "3") {
            uni.navigateTo({
              url: "/contractPages/contract/contract-detail?id=" + item.id,
            });
          }

          break;
        case "discounts":
          if (
            !(
              (item.state === "6" || item.state === "7" || item.state === "8") &&
              this.addDiscounts
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getStatementData(item);
          break;
        case "more":
          this.curPopContract = item;
          this.$gxfmethod.statisticData(
            this.$eventId.Contract_Administrative,
            "合同列表",
            "列表-更多操作"
          );
          this.$refs.morePop.open();
          break;
        case "workIn":
          if (
            !this.addWorkIn ||
            item.contractType == "3" ||
            (item.state != "5" &&
              item.state != "6" &&
              item.state != "7" &&
              item.state != "8")
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");

          break;
        case "workInSimple":
          if (
            !this.addExWorkIn ||
            item.contractType != "3" ||
            (item.state != "5" &&
              item.state != "6" &&
              item.state != "7" &&
              item.state != "8")
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");

          break;
        case "workOut":
          if (!(item.state == "6" && this.addWorkOut)) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "workOutSimple":
          if (!(item.state == "6" && this.addExWorkOut)) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");

          break;
        case "proceed":
          if (!this.addProceed) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "refund":
          if (!this.addRefund) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "cost":
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "smsDunning":
          this.$refs.morePop.close();
          uni.navigateTo({
            url:
              `/otherPages/linkman/sms-dunning?customerId=` +
              item.customerId +
              `&customer=` +
              encodeURIComponent(JSON.stringify({ ...item, name: item.customerName })) +
              "&contractId=" +
              item.id +
              `&contractName=` +
              item.contractDetailDto.projectName,
          });
          break;
        case "claim":
          if (
            !(
              (item.state === "6" || item.state === "7" || item.state === "8") &&
              this.addClaim
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "settle":
          uni.hideLoading();
          if (
            !(
              (item.state === "6" || item.state === "7" || item.state === "8") &&
              this.addClaim
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");

          break;
        case "settled":
          if (!this.canContractSettled(item)) {
            return;
          }
          this.$refs.morePop.close();
          // this.$refs.settlePop.open(item);
          uni.navigateTo({
            url: "/businessPages/settledown/settled-add?contractNo=" + item.businessNo,
          });
          break;
        case "pause":
          if (
            !(
              (item.state === "6" || item.state === "7" || item.state === "8") &&
              this.addPause
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type, "4,5,6,7,8,9");
          break;
        case "changeContract":
          if (
            !(
              this.addChange &&
              item.contractType === "1" &&
              !item.plusIng &&
              !item.changeIng
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type);

          break;
        case "delete":
          if (!this.addDelete) {
            return;
          }
          console.log("Delete item.businessNo", item.businessNo);
          this.$refs.morePop.close();
          this.deleteContract(item.businessNo, item.customerName);

          break;
        case "contractExpense":
          if (
            !(
              this.addExpanse &&
              item.contractType === "1" &&
              !item.plusIng &&
              !item.changeIng
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          this.getContractDetail(item.businessNo, type);
          break;

        case "rubbish":
          uni.navigateTo({
            url: "/contractPages/contract/contract-list-rubbish",
          });
          break;
        default:
          break;
      }
    },
    goToDraft() {
      uni.navigateTo({
        url: "/contractPages/contract/contract-list-rubbish",
      });
    },
    goToAdd() {
      this.picktype = "create";
      this.selectList = this.contractTypes ? this.contractTypes : [];
      this.$refs.selector.show();
    },
    getContractDetail(businessNo, type, stateList) {
      let param = {
        businessNo: businessNo,
      };
      if (stateList) {
        param.contractStateList = stateList;
      }
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          switch (type) {
            case "workIn":
              uni.navigateTo({
                url:
                  "/businessPages/workin/create-workin-step-all?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "workInSimple":
              uni.navigateTo({
                url:
                  "/businessPages/workin/create-workin-simple?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "workOut":
              uni.navigateTo({
                url:
                  "/businessPages/workout/create-workout-first?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "workOutSimple":
              uni.navigateTo({
                url:
                  "/businessPages/workout/create-workout-simple?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;

            case "proceed":
              uni.navigateTo({
                url:
                  "/businessPages/proceed/creat-proceeds?item=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "refund":
              uni.navigateTo({
                url:
                  "/businessPages/reimburse/creat-reimburse?item=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "cost":
              uni.navigateTo({
                url:
                  "/businessPages/cost-manage/create-cost?item=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "claim":
              uni.navigateTo({
                url:
                  "/businessPages/claim/creat-claim?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "pause":
              uni.navigateTo({
                url:
                  "/businessPages/pause/create-pause?contract=" +
                  encodeURIComponent(JSON.stringify(result)),
              });
              break;
            case "changeContract":
              uni.navigateTo({
                url:
                  "/contractPages/contract-change/create-contract-change?id=" + result.id,
              });

              break;
            case "contractExpense":
              uni.navigateTo({
                url:
                  "/contractPages/contract-expense/create-contract-expense?id=" +
                  result.id,
              });
              break;
            case "settle":
              uni.navigateTo({
                url: `/businessPages/settledown/settle-add?contracts=${result.businessNo}&customerId=${result.customerId} `,
              });

              break;
            default:
              break;
          }
        })
        .catch((err) => {});
    },
    searchChange(val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.searchKey = val;
        this.page = 1;
        this.contractList = [];
        this.getContractData();
      }, 500);
    },
    // 定义一个方法来处理删除合同的操作
    deleteContract(businessNo) {
      // 替换URL中的占位符
      let checkUrl = this.$url.CONTRACT_DELETE_CHECK.replace(/{id}/, businessNo);

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", {})
        .then((checkRes) => {
          if (checkRes && checkRes.code == 500) {
            // 删除检查失败，显示失败信息
            this.showModal("删除失败", checkRes.message || "请联系客服人员");
          } else {
            // 检查通过，请求用户确认是否删除
            this.showModal(
              "删除确认",
              "注意：您将删除当前合同，该操作不可恢复,该操作执行后立即生效。",
              true,
              () => {
                // 用户确认删除，执行删除操作
                this.performDelete(businessNo);
              }
            );
          }
        })
        .catch((err) => {
          // this.showToast(err);
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
      let deleteUrl = this.$url.CONTRACT_DELETE.replace(/{id}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.headerrefresh(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },

    // 定义一个方法来显示toast
    showToast(err) {
      uni.showToast({
        title: err.details && err.details[0] ? err.details[0] : "发生错误",
        icon: "none",
      });
    },
    getDeviceNumStr(contract) {
      let orderList = contract.contractDetailDto
        ? contract.contractDetailDto.orderList
        : [];
      if (!orderList) return "";
      let arr = [];
      let map = {};
      orderList = orderList.map((o) => {
        return {
          type: o.type,
          orderNum: o.orderNum,
          typeShortName: o.typeShortName,
        };
      });
      orderList.forEach((o) => {
        if (map[o.type]) {
          arr.forEach((y) => {
            if (y.type === o.type) {
              y.orderNum += o.orderNum;
              return;
            }
          });
        } else {
          arr = [...arr, o];
          map[o.type] = o;
        }
      });
      let needDevice = arr
        .map((o) => {
          return o.typeShortName + (o.orderNum ? o.orderNum : "-");
        })
        .join(" / ");
      return needDevice;
    },
    //获取租赁方式
    getRentTypes(pos) {
      let orderList = this.contractList[pos].contractDetailDto.orderList;
      if (!orderList) return;
      orderList.sort(function (x, y) {
        let a = Number.parseInt(x.settlementType);
        let b = Number.parseInt(y.settlementType);
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });

      let arr = [];
      orderList.forEach((o) => {
        arr = [...arr, o.settlementTypeName];
      });
      let rr = arr.filter(function (element, index, aa) {
        return aa.indexOf(element) === index;
      });
      this.rentType.push(rr);
    },
    getSysDicPages() {
      if (this.searchTypes.length > 0) {
        this.isShowSelect = !this.isShowSelect;
        return;
      }
      this.$network
        .getData(this.$url.SYS_DIC + "/contract_status", "GET", null)
        .then((result) => {
          this.searchTypes = result.filter((o) => {
            return o.label != "草稿" && o.label != "撤回";
          });
          this.searchTypes.unshift({
            label: "全部",
            value: "",
          });
          this.searchTypes = this.searchTypes.map((o) => {
            return {
              ...o,
              checked: true,
            };
          });
          this.isShowSelect = !this.isShowSelect;
        })
        .catch((err) => {});
    },
    getOrgList() {
      let _self = this;
      this.$network
        .getData(this.$url.ORG_ALL, "GET")
        .then((result) => {
          if (result && result.length > 0) {
            result.forEach(function dep(o) {
              _self.orgList = [
                ..._self.orgList,
                {
                  value: o.id,
                  label: o.name,
                  children: o.children,
                },
              ];
              if (o.children && o.children.length > 0) o.children.map(dep);
            });
          }
        })
        .catch((err) => {});
    },
    getMoney(money) {
      return "￥" + this.moneyUtil.dealNumber(money);
    },
    getContractData() {
      this.status = "loading";
      let stateStr = "";
      if (this.stateObj) {
        stateStr = this.stateObj.value;
      }
      let param = {
        current: this.page,
        size: this.pageSize,
        contractName: this.searchKey,
        customerSalesman: this.salesmanObj.value != "" ? this.salesmanObj.value : null,
        state: stateStr,
        draft: false,
        showReceivable: true,
        orgIdList:
          this.orgIdList && this.orgIdList.length > 0 ? this.orgIdList : undefined,
        signStartDate:
          this.startTime === "开始时间" ? undefined : this.startTime + " 00:00:00",
        flowStatus: this.flowStatusObj.value !== null ? this.flowStatusObj.value : null,
        signEndDate: this.endTime === "结束时间" ? undefined : this.endTime + " 23:59:59",
        createStartDate:
          this.startCTime === "开始时间" ? undefined : this.startCTime + " 00:00:00",
        createEndDate:
          this.endCTime === "结束时间" ? undefined : this.endCTime + " 23:59:59",
      };
      //签署
      switch (this.timeType) {
        case "month":
          param = {
            ...param,
            signStartDate: this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00",
            signEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "year":
          param = {
            ...param,
            signStartDate: this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00",
            signEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "custom":
          param = {
            ...param,
            signStartDate:
              this.startTime === "开始时间" ? undefined : this.startTime + " 00:00:00",
            signEndDate:
              this.endTime === "结束时间" ? undefined : this.endTime + " 23:59:59",
          };
          break;
        default:
          break;
      }
      //创建
      switch (this.timeCType) {
        case "cmonth":
          param = {
            ...param,
            createStartDate: this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00",
            createEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "cyear":
          param = {
            ...param,
            createStartDate: this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00",
            createEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "ccustom":
          param = {
            ...param,
            createStartDate:
              this.startTime === "开始时间" ? undefined : this.startCTime + " 00:00:00",
            createEndDate:
              this.endCTime === "开始时间" ? undefined : this.endCTime + " 23:59:59",
          };
          break;
        default:
          break;
      }
      this.$network
        .getData(this.$url.CONTRACT_LIST, "POST", param)
        .then((result) => {
          let res =
            result && result.records
              ? result.records.map((obj) => {
                  let revenuePerform = 0;
                  let settlement = 0;
                  let revenueReceived = 0;
                  let debt = null;
                  // revenuePerform = Number(obj.isSettled ? obj.newReceiveTotal : (obj.receivableDto?obj.receivableDto.total:0))
                  revenuePerform = Number(
                    obj.receivableDto ? obj.receivableDto.total : 0
                  );
                  settlement = Number(
                    obj.isSettled ? obj.newSettlementReceiveTotal : obj.settlement || 0
                  );
                  if (obj.receiptDto) {
                    revenueReceived = Number(obj.receiptDto.total); //已收营收
                  }
                  let acDiff = Number(
                    obj.isSettled ? 0 : revenuePerform - revenueReceived
                  );
                  let originAcDiff = Number(
                    obj.isSettled ? obj.originReceiveTotal - revenueReceived : 0
                  );
                  let bcDiff = Number(obj.isSettled ? 0 : settlement - revenueReceived);
                  let originBcDiff = Number(
                    obj.isSettled ? obj.originSettlementReceiveTotal - revenueReceived : 0
                  );
                  return {
                    ...obj,
                    revenuePerform: this.moneyUtil.dealNumber(revenuePerform),
                    revenueReceived: this.moneyUtil.dealNumber(revenueReceived),
                    settlement: this.moneyUtil.dealNumber(settlement),
                    acDiff: this.moneyUtil.dealNumber(acDiff),
                    originAcDiff: this.moneyUtil.dealNumber(originAcDiff),
                    bcDiff: this.moneyUtil.dealNumber(bcDiff),
                    originBcDiff: this.moneyUtil.dealNumber(originBcDiff),
                    debt:
                      obj.advancePaymentDebt && obj.advancePaymentDebt.debt
                        ? Number(obj.advancePaymentDebt.debt)
                        : null,
                  };
                })
              : [];
          if (this.page == 1) {
            this.contractList = res;
          } else {
            this.contractList = this.contractList.concat(res);
          }
          console.log("this.contractList----------------------", this.contractList);
          let pages = result.pages;
          this.totalNum = result.total;
          if (parseInt(this.totalNum) > 100) {
            this.endNum = 100;
          } else {
            this.endNum = this.totalNum;
          }
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
    getNumData() {
      let url = this.$url.CONTRACT_ALLNUM_NAME;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          let firstStr = "";
          let endStr = "";
          let dict = {};
          result.forEach((o) => {
            let str = o.value;
            dict[o.value] = o.count;
            if (o.value === "all") {
              firstStr = o.name + ":" + o.count + ";";
            } else {
              endStr = endStr + o.name + ":" + o.count + ";";
            }
          });
          this.titleSum = firstStr + endStr;
          this.titleDic = {
            ...dict,
          };
          console.log(JSON.stringify(this.titleDic));
        })
        .catch((err) => {});
    },
    getRefeshData() {
      this.page = 1;
      this.contractList = [];
      this.getContractData();
    },
    headerrefresh() {
      this.getRefeshData();
    },
    footerrefresh() {
      this.$datestr.printlog("onReachBottom==" + this.status);
      if (this.status == "noMore") {
        return;
      }
      this.page += 1;
      this.getContractData();
    },
    goImg(item) {
      console.log(JSON.stringify(item));
      let isedit = this.isuser(item);
      uni.navigateTo({
        url:
          "../../components/common/image-upload/upload_apendix?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&isedit=" +
          isedit,
      });
    },
    gotoFileList(item) {
      console.log(item);
      let str = "0";
      if (item.state != "4") {
        str = "1";
      }
      uni.navigateTo({
        url:
          "/contractPages/contract/business-pigeonhole?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&canpigeonhole=" +
          str,
      });
    },
    pigeonholeSave(item) {
      uni.showModal({
        title: "提示",
        content: "确认要把该合同归档么?",
        success: (res) => {
          if (res.cancel) {
          } else {
            this.updataStatus(item);
          }
        },
      });
    },
    updataStatus(item) {
      let urlstr = this.$url.CONTRACT_UPDATA_STATE.replace(/xxx/, item.id);
      this.$network
        .getData(urlstr, "PUT", null)
        .then((result) => {
          uni.showToast({
            icon: "none",
            title: "归档成功",
          });
          this.headerrefresh();
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message + (err.details ? ":" + err.details[0] : ""),
          });
        });
    },
    //---------------------下载---------------------------------------------
    exportExcel() {
      this.$refs.downDialog.open();
    },
    cancelDialog() {
      this.$refs.downDialog.close();
    },
    confirmDialog() {
      if (this.startNum === "") {
        uni.showToast({
          icon: "none",
          title: "请输入起始数",
        });
        return;
      }
      if (Number(this.startNum) <= 0) {
        uni.showToast({
          icon: "none",
          title: "起始数必须大于0",
        });
        return;
      }
      if (this.endNum === "") {
        uni.showToast({
          icon: "none",
          title: "请输入终止数",
        });
        return;
      }
      if (parseInt(this.totalNum) < parseInt(this.startNum)) {
        uni.showToast({
          icon: "none",
          title: "起始数已经超出当前所查询的合同总数,当前合同总数为:" + this.totalNum,
        });
        return;
      }

      if (parseInt(this.endNum) < parseInt(this.startNum)) {
        uni.showToast({
          icon: "none",
          title: "终止数不能小于起始数",
        });
        return;
      }
      this.$refs.downDialog.close();
      this.downExcellist();
    },
    downExcellist() {
      let headerDic = {
        "Content-Type": "application/json",
        Authorization: "",
      };
      let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
      if (loginMes) {
        let access_token = loginMes.token_type + " " + loginMes.access_token;
        headerDic.Authorization = access_token;
        this.downDocument(headerDic);
      }
    },
    downDocument(headerDic) {
      let stateStr = this.stateObj ? this.stateObj.value : "";
      let param = {
        contractName: this.searchKey != "" ? this.searchKey : undefined,
        state: stateStr != "" ? stateStr : undefined,
        startNumber: this.startNum,
        endNumber: this.endNum,
        showReceivable: true,
        draft: false,
      };
      switch (this.timeType) {
        case "month":
          param = {
            ...param,
            signStartDate: this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00",
            signEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "year":
          param = {
            ...param,
            signStartDate: this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00",
            signEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "custom":
          if (this.startTime != "开始时间") {
            param = {
              ...param,
              signStartDate:
                this.startTime === "开始时间" ? undefined : this.startTime + " 00:00:00",
              signEndDate:
                this.endTime === "结束时间" ? undefined : this.endTime + " 23:59:59",
            };
          }
          break;
        default:
          break;
      }
      switch (this.timeCType) {
        case "cmonth":
          param = {
            ...param,
            createStartDate: this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00",
            createEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "cyear":
          param = {
            ...param,
            createStartDate: this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00",
            createEndDate: this.$dateUtil.timeFormat(new Date()) + " 23:59:59",
          };
          break;
        case "ccustom":
          if (this.startCTime != "开始时间") {
            param = {
              ...param,
              createStartDate:
                this.startCTime === "开始时间" ? undefined : this.startTime + " 00:00:00",
              createEndDate:
                this.endTime === "结束时间" ? undefined : this.endTime + " 23:59:59",
            };
          }
          break;
        default:
          break;
      }
      let url = this.$gxfmethod.getUrl("contractapi/api/contract/export");
      console.log(url);
      let filename = this.$gxfmethod.getFileName("合同列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
    resetNum() {
      this.startNum = "1";
      if (parseInt(this.totalNum) > 100) {
        this.endNum = 100;
      } else {
        this.endNum = this.totalNum;
      }
    },
    hide() {
      if (this.downloadTask) {
        console.log("contract---hiden");
        this.downloadTask.abort();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.count {
  font-size: 30rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1278ff;
  margin: 0 8rpx 0 24rpx;
}

.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.float-view {
  position: fixed;
  display: flex;
  bottom: 16px;
  right: 16px;
  width: 50px;
  height: auto;
  box-shadow: 1px 1px 4px #eeeeee;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  z-index: 300;
  background-color: #ffffff;
}

.more-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
  // margin-right: 12px;
  height: 30px;
  border-radius: 4px;
  font-size: $uni-font-size-base;
  color: #333;
}

//添加按钮
.add-container {
  // position: fixed;
  display: flex;
  // bottom: 32px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.rubbish-container {
  // position: fixed;
  display: flex;
  // bottom: 92px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.show-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
  position: fixed;
  display: flex;
  box-shadow: 0px 0px 10px #eeeeee;
  right: 0px;
  bottom: 16px;
  z-index: 960;
}

.close-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

.labelstyle-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.labelstylerubbish {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}

.search-container {
  width: 100%;
  z-index: 100;
  position: fixed;
  left: 0px;
}

.search-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.search-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 55;
  color: $uni-color-title;
  margin: 5px;
  font-size: $uni-font-size-sm;
  text-align: center;
}

.select-view {
  flex: 1;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 8px;
  flex-direction: row;
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.select-container {
  display: flex;
  // width: 40%;
  flex-direction: column;
  position: relative;
}

.select-label {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  justify-content: center;
  align-items: center;
  text-align: center;
  // border: 1px solid #AAAAAA;
  padding: 2px 4px;
  border-radius: 4px;
}

.select-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 28px;
  left: 0px;
  width: 150%;
  font-size: $uni-font-size-base;
  text-align: center;
  background-color: $uni-bg-color-grey;
  border-radius: 0px 0px 4px 4px;
}

.checkbox {
  justify-content: flex-end;
  transform: scale(0.6);
  margin-left: 10px;
}

.select-item {
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  width: 100%;
  background-color: #ffffff;
  text-align: left;
  margin-top: 1rpx;
  padding-left: 15px;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  flex: 1;
}

.list-container {
  // margin-top: calc(64px);
  display: flex;
  flex-direction: column;
  margin-top: calc(55px);
}

.title-tag-text {
  color: #ffffff;
  box-sizing: border-box;
  font-size: 12px;
  padding: 2px;
  text-align: center;
  background-color: #e60000;
  border-radius: 4px;
  font-weight: 400;
}

// .option-btn {
//   padding: 0px 10px;
//   border-radius: 20px;
//   border: 1px solid $uni-color-primary;
//   color: $uni-color-primary;
//   font-size: $uni-font-size-base;
//   margin-left: 10px;
//   height: 24px;
//   line-height: 24px;
// }

.pop-container {
  position: relative;
  z-index: 999;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.row-tag {
  width: 98px;
  text-align: left;
}

.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-top: 7px;
  padding-bottom: 7px;
  flex: 1;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.pop-item {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-disable {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-line {
  border-style: solid;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
}

.group-arrow-bg {
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
  justify-content: center;
}

.group-arrow {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-lg;
}

.group-arrow-down {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-lg;
  transform: rotate(-180deg);
  transition: all 0.5s;
}

.filter-view {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: #ffffff;
  padding: 10px 0px;
  align-items: center;
  justify-content: flex-start;
  font-size: $uni-font-size-base;
}

.select-view-row {
  margin-left: 10px;
  min-width: 80px;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
  display: flex;
  flex-direction: row;
}

.btn-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
}

.btn {
  margin-right: 10px;
  padding: 2px 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid $uni-color-primary;
  margin: 0px 4px;

  &.active {
    background-color: $uni-color-primary;
    color: #ffffff;
  }
}

.bottom-search-top {
  display: flex;
  flex: 1;
  margin: 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
}

.condition-btn {
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  background: #ffffff;
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}

.btn-all {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  color: #ffffff;
  font-size: $uni-font-size-base;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}

.oneleveltitle {
  word-break: break-all;
}
.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;
}
</style>
