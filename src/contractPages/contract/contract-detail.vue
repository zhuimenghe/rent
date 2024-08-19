<template>
  <view class="content" :class="[isShowBtns ? 'bb62' : '']">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns-sub
      :buttons="navBtns"
      @onNavBarButtonTap="onNavBarButtonTap"
    >
      合同详情
    </c-nav-bar-btns-sub>
    <view class="header-container">
      <view class="row-line-between">
        <view>
          <view class="header-title row-line" style="flex: 1">
            <view v-if="baseInfo.contractType != '1'">
              <headTag
                :value="baseInfo.contractType == '2' ? '框' : '快'"
                :backgroundColor="
                  baseInfo.contractType == '2' ? '#1278FF' : '#F08200'
                "
              ></headTag>
            </view>
            <!-- <view class="tag-style" :style="{'background-color':baseInfo.contractType== '3'?'#FE931F':'#E60000'}" v-if="baseInfo.contractType!='1'">{{baseInfo.contractType== '2'?'框':(baseInfo.contractType== '3'?'快':'')}}</view> -->
            <view
              style="line-height: 20px"
              :style="{
                'padding-left': baseInfo.contractType == '1' ? '10px' : '0px',
              }"
            >
              {{ baseInfo.customerName || "" }}
              -
              {{ baseInfo.contractDetailDto.projectName || "" }}
            </view>
          </view>
        </view>

        <view style="text-align: end">
          <text style="color: #ff6d59" v-if="isOverdue">逾期</text>
          <view
            class="row-line header-sub-title"
            style="min-width: 100px; text-align: right"
            >应收比例：<text>{{ debtRatio.value || "-" }}</text
            ><i class="iconfont tip-style iconzl--zhushi" @click="showTip"></i
          ></view>
        </view>
      </view>
      <view class="head-content">
        <view class="content-text">合同编号：{{ baseInfo.businessNo }}</view>
        <view class="content-text">区域：{{ baseInfo.orgName || "-" }}</view>
        <view class="content-text">
          业务负责人：
          {{ baseInfo.contractDetailDto.customerSalesmanName || "-" }}
        </view>
        <view class="row-line-between content-text">
          客户联系人：
          {{ baseInfo.contractDetailDto.contactName || "--" }}
          /
          {{ baseInfo.contractDetailDto.phoneNum }}
          <i
            class="iconfont phone-icon icondianhua"
            @click.stop="callPhone(baseInfo.contractDetailDto.phoneNum)"
          ></i>
        </view>
      </view>
    </view>
    <b-esign-timeline
      ref="timeline"
      v-if="isShowEsignTimeline"
      showExpand
      :businessNo="baseInfo.businessNo"
    ></b-esign-timeline>
    <view class="main-container margin-top">
      <!-- tab区 -->
      <view class="tab-container" :style="{ top: topheight }">
        <view class="uni-tab">
          <view
            v-for="(tab, index) in tabList"
            :key="index"
            :class="{
              'uni-tab-active': index === tabindex,
              'uni-tab-scroll-active': index === tabindex,
            }"
            :style="{
              color: index === tabindex ? activeColor : defaultColor,
              backgroundColor:
                index === tabindex ? activebgColor : defaultbgColor,
            }"
            @click="itemClick(index, tab)"
            class="uni-tab-item"
          >
            <view class="tab-top">
              <view class="leftView">
                <text>{{ tab }}</text>
              </view>
            </view>
            <view
              class="tab-line"
              :style="{
                backgroundColor:
                  index === tabindex ? activeColor : defaultbgColor,
              }"
            ></view>
          </view>
        </view>
      </view>
      <!-- 内容区 -->
      <view v-if="tabindex == 0">
        <!-- 内容区 -->
        <!-- 结算信息 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">结算信息</text>
          </view>

          <view class="row">
            <view class="row-item">
              <text class="label">月份计算：</text>
              <text class="value">{{
                (baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.monthConfig === "0"
                  ? "自然月"
                  : "30天为一个月") || ""
              }}</text>
            </view>
          </view>
          <view class="row">
            <view class="row-item">
              <text class="label">支付约定：</text>
              <text class="value">{{
                (baseInfo.contractDetailDto &&
                  baseInfo.contractDetailDto.paymentTypeName) ||
                ""
              }}</text>
            </view>
          </view>
          <view class="row">
            <view
              class="row-item"
              v-if="
                baseInfo.contractDetailDto.paymentType === '3' ||
                baseInfo.contractDetailDto.paymentType === '4'
              "
            >
              <text class="label">预付金额：</text>
              <text class="value">
                {{
                  (
                    (baseInfo.contractDetailDto &&
                      Number(baseInfo.contractDetailDto.advance)) ||
                    0
                  ).toFixed(2) || ""
                }}
              </text>
            </view>
          </view>
          <view class="row">
            <view
              class="row-item"
              v-if="baseInfo.contractDetailDto.paymentType === '3'"
            >
              <text class="label">预付款到账后几天内进场：</text>
              <text class="value">
                {{
                  (baseInfo.contractDetailDto &&
                    Number(baseInfo.contractDetailDto.prePayChange)) ||
                  0 ||
                  ""
                }}
              </text>
            </view>
          </view>
          <view class="row">
            <view
              v-if="
                baseInfo.contractDetailDto.paymentType === '2' ||
                baseInfo.contractDetailDto.paymentType === '3' ||
                baseInfo.contractDetailDto.paymentType === '4'
              "
            >
              <text class="label">结算日方式：</text>
              <text class="value">{{
                baseInfo.contractDetailDto.settlementDayTypeName || "-"
              }}</text>
            </view>
          </view>
          <view class="row">
            <view
              class="row-item"
              v-if="
                baseInfo.contractDetailDto.settlementDayType === '2' ||
                baseInfo.contractDetailDto.settlementDayType === '6' ||
                baseInfo.contractDetailDto.settlementDayType === '10'
              "
            >
              <text class="label">结算日：</text>
              <text class="value">{{
                baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.settlementDay
                  ? baseInfo.contractDetailDto.settlementDay + " 号"
                  : "-"
              }}</text>
            </view>
          </view>
          <view class="row">
            <view class="row-item">
              <text class="label">运费减免约定：</text>
              <text class="value">{{
                (baseInfo.contractDetailDto &&
                  baseInfo.contractDetailDto.renterTripTypeName) ||
                ""
              }}</text>
            </view>
          </view>
          <view class="row">
            <view class="row-item flexBox">
              <view class="label flexBox"
                >运费计算方式
                <businessTips
                  v-if="
                    baseInfo.contractDetailDto &&
                    baseInfo.contractDetailDto.tripCalType == '1'
                  "
                  tips="按趟计费，系统默认一个进场或退场单据为一趟物流"
                  :color="'#f3a73f'"
                />
                ：</view
              >
              <text class="value"
                >{{
                  baseInfo.contractDetailDto &&
                  baseInfo.contractDetailDto.tripCalType == "1"
                    ? "按趟计费"
                    : "按台计费"
                }}
              </text>
            </view>
          </view>
          <view
            v-if="
              baseInfo.contractDetailDto &&
              baseInfo.contractDetailDto.tripCalType == '1'
            "
            class="row"
          >
            <view class="row-item">
              <text class="label">单趟运费金额：</text>
              <text class="value"
                >{{
                  (baseInfo.contractDetailDto &&
                    Number(baseInfo.contractDetailDto.tripVal).toFixed(2)) ||
                  "0.00"
                }}元</text
              >
            </view>
          </view>
          <view class="row">
            <view class="row-item">
              <text class="label">配备人员：</text>
              <text class="value">{{
                baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.allocateFlag
                  ? "是"
                  : "否"
              }}</text>
            </view>
          </view>
          <view class="row">
            <view
              class="row-item"
              v-if="
                baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.allocateFlag
              "
            >
              <text class="label">人天单价：</text>
              <text class="value"
                >{{
                  (baseInfo.contractDetailDto &&
                    Number(baseInfo.contractDetailDto.allocatePrice).toFixed(
                      2
                    )) ||
                  "0:00"
                }}元</text
              >
            </view>
          </view>
          <view class="row">
            <view class="row-item">
              <text class="label">是否开票：</text>
              <text class="value">{{
                (baseInfo.contractDetailDto &&
                  baseInfo.contractDetailDto.invoiceTypeName) ||
                ""
              }}</text>
            </view>
          </view>
          <view
            v-if="
              baseInfo.contractDetailDto &&
              baseInfo.contractDetailDto.invoiceType != 0
            "
            class="row-item"
          >
            <text class="label">发票税额：</text>
            <text class="value"
              >{{
                (baseInfo.contractDetailDto &&
                  baseInfo.contractDetailDto.invoiceTax) ||
                0
              }}%</text
            >
          </view>
          <view class="row" style="margin-bottom: 5px">
            <view v-if="baseInfo.contractDetailDto.paymentType === '3'">
              <view class="value" style="color: #e60000"
                >注意：预付款到账
                {{ baseInfo.contractDetailDto.prePayWorkInDays || "" }}
                天后设备进场
              </view>
            </view>
          </view>
        </view>

        <!-- 项目信息 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">项目信息</text>
          </view>
          <view class="row-item">
            <text class="label">项目名称：</text>
            <text class="value">{{
              (baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.projectName) ||
              "--"
            }}</text>
          </view>
          <view
            class="row-item"
            v-if="
              baseInfo.contractDetailDto &&
              baseInfo.contractDetailDto.constructionTypeName
            "
          >
            <text class="label">施工类别：</text>
            <text class="value">{{
              baseInfo.contractDetailDto &&
              baseInfo.contractDetailDto.constructionTypeName
            }}</text>
          </view>
          <view class="row-item flexs">
            <text class="label">交机地点：</text>
            <text class="value">{{
              (baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.deliveryPlace) ||
              "--"
            }}</text>
          </view>
          <view class="row-item flexs">
            <text class="label">归还地点：</text>
            <text class="value">{{
              (baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.returnPlace) ||
              "--"
            }}</text>
          </view>
          <view class="row-item flexs">
            <text class="label">最短租期：</text>
            <text class="value">{{
              baseInfo.contractDetailDto &&
              baseInfo.contractDetailDto.minTenancy
                ? baseInfo.contractDetailDto.minTenancy
                : "--"
            }}</text>
          </view>
          <view class="row-item flexs">
            <text class="label">其他约定：</text>
            <text class="value">{{
              (baseInfo.contractDetailDto &&
                baseInfo.contractDetailDto.covenants) ||
              "--"
            }}</text>
          </view>
        </view>
        <!-- 电子签署 -->
        <view class="container-item">
          <view class="esign-title">
            <view class="item-title">
              <view class="titleDot1">
                <view class="titleDot2"></view>
              </view>
              <text style="margin-left: 5px">电子签署</text>
            </view>

            <view
              class="operate"
              v-if="baseInfo.state != '1' && baseInfo.signFlowId"
            >
              <text
                v-if="esignList[0].flowStatus == 1"
                style="margin-right: 15px; color: #e60000"
                @click="revoke"
                >撤回</text
              >
              <button
                v-if="esignList[0].flowStatus == 1"
                class="tag-btns-view"
                @click="shareContract"
                data-type="esign"
                open-type="share"
              >
                {{ "催办" }}
              </button>
              <text
                style="margin-right: 15px; color: #e60000"
                @click="gotoDetail"
                >查看</text
              >
              <text
                style="margin-left: 5px; color: #e60000"
                @click="downloadEsign(esignList[0])"
                >下载</text
              >
            </view>
          </view>
          <view class="excute-container">
            <template v-if="esignList.length > 0">
              <view class="esign">
                <view class="row-item flexs">
                  <text class="label">签署方：</text>
                  <text class="value">{{ esignList[0].signer }}</text>
                </view>

                <view class="row-item flexs">
                  <text class="label">发起时间：</text>
                  <text class="value">{{
                    esignList[0].createDate.slice(0, -3)
                  }}</text>
                </view>
                <view class="row-item flexs">
                  <text class="label">签署进度：</text>
                  <span
                    :class="esignList[0].flowStatus == '2' ? 'green' : 'red'"
                  >
                    {{ getEsignStatus(esignList[0].flowStatus) }}
                  </span>
                </view>
              </view>
            </template>
            <view class="empty-data-box" v-else>
              <image
                class="icon"
                mode="widthFix"
                src="/static/empty.png"
              ></image>
              <text class="text">暂无数据</text>
            </view>
          </view>
        </view>

        <!-- 设备需求 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">设备需求</text>
          </view>

          <view class="device-container">
            <template v-if="baseInfo.contractDetailDto.orderList.length > 0">
              <view
                class="device-item"
                v-for="(item, index) in baseInfo.contractDetailDto.orderList"
              >
                <view class="device-item-title">
                  <text>{{ item.typeName }}/{{ item.heightName }}</text>
                  <text>{{ item.orderNum || 0 }}台</text>
                </view>

                <view class="sub-info">
                  <view class="hire">
                    <template v-if="item.settlementType == 1">
                      <text class="hire-item-txt">
                        {{ Number(item.hire).toFixed(2) || "0:00" }}/天
                      </text>
                    </template>
                    <template v-else-if="item.settlementType == 4">
                      <text class="hire-item-txt">
                        {{ Number(item.hire).toFixed(2) || "0:00" }}/天
                      </text>
                      <text class="hire-item-txt">
                        {{ Number(item.hireMonthly).toFixed(2) || "0:00" }}/月
                      </text>
                    </template>
                    <template v-else>
                      <text class="hire-item-txt">
                        {{ Number(item.hire).toFixed(2) || "0:00" }}/月
                      </text>
                    </template>

                    <text
                      v-if="
                        baseInfo.contractDetailDto &&
                        baseInfo.contractDetailDto.tripCalType != '1'
                      "
                      class="hire-item-txt"
                    >
                      运费:{{
                        (item.carriage && Number(item.carriage).toFixed(2)) ||
                        "0.00"
                      }}/台
                    </text>
                    <text class="hire-item-txt"
                      >预租期:{{ getTenancyFn(item) || "-" }}</text
                    >
                  </view>
                </view>

                <view class="bg-gray">
                  <text
                    >预计进场：{{
                      (item.beginDate && item.beginDate.split(" ")[0]) || "-"
                    }}</text
                  >
                  <text
                    >预计退场：{{
                      (item.endDate && item.endDate.split(" ")[0]) || "-"
                    }}</text
                  >
                  <text
                    v-if="
                      baseInfo.contractDetailDto &&
                      baseInfo.contractDetailDto.tripCalType != '1'
                    "
                  >
                    运费类型：{{ item.carriageTypeName || "-" }}
                  </text>
                  <text
                    >押金：{{
                      Number(item.pledge).toFixed(2) || "0:00"
                    }}/台</text
                  >
                </view>
              </view>
            </template>
            <view class="empty-data-box" v-else>
              <image
                class="icon"
                mode="widthFix"
                src="/static/empty.png"
              ></image>
              <text class="text">暂无数据</text>
            </view>
          </view>
        </view>
        <!-- 授权人信息 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">授权人信息</text>
          </view>

          <view class="device-container">
            <template v-if="auths.length > 0">
              <template class="auth-item" v-for="(item, index) in auths">
                <view class="auth-item">
                  <view class="auth-label">{{ item.type || "" }}：</view>
                  <view class="auth-value">{{ item.name || "-" }}</view>
                  <view
                    v-if="item.verified"
                    class="auth-verified"
                    :class="{ 'text-success': item.verified }"
                  >
                    （{{ item.verified ? "已认证" : "未认证" }}）</view
                  >
                </view>
                <view class="auth-item">
                  <view class="auth-label">身份证号：</view>
                  <view class="auth-value">{{ item.identity || "-" }}</view>
                </view>
                <view class="auth-item">
                  <view class="auth-label">手机号：</view>
                  <view class="auth-value">{{ item.phoneNum || "-" }}</view>
                </view>
              </template>
            </template>
            <view class="empty-data-box" v-else>
              <image
                class="icon"
                mode="widthFix"
                src="/static/empty.png"
              ></image>
              <text class="text">暂无数据</text>
            </view>
          </view>
        </view>

        <!-- 附件 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">附件</text>
          </view>

          <view>
            <imgupload
              v-if="baseInfo.fileList.length > 0"
              :isupload="false"
              :isShowBg="false"
              :isShowLabel="false"
              :imgFinishlist="baseInfo.fileList"
            ></imgupload>
            <view class="empty-data-box" v-else>
              <image
                class="icon"
                mode="widthFix"
                src="/static/empty.png"
              ></image>
              <text class="text">暂无数据</text>
            </view>
          </view>
        </view>

        <!-- 合同执行 -->
        <view class="container-item">
          <view class="item-title">
            <view class="titleDot1">
              <view class="titleDot2"></view>
            </view>
            <text style="margin-left: 5px">合同执行</text>
          </view>
          <view class="excute-container">
            <template v-if="executeList.length > 0">
              <view class="excute-item" v-for="item in executeList">
                <view class="excute-item-title">
                  <view class="bold">
                    <i
                      class="iconfont r-icon"
                      :class="getFlowIcon(item.businessType).svg"
                      :style="{
                        color: getFlowIcon(item.businessType).color,
                        'margin-right': '5px',
                      }"
                    ></i
                    >{{ getFlowIcon(item.businessType).name || "-" }}
                  </view>
                  <text class="shin">{{ item.createTime || "-" }}</text>
                </view>
                <view class="info">
                  <text>发起人：{{ item.createName || "-" }}</text>
                  <text style="color: #e60000" @click="viewDetail(item)"
                    >查看</text
                  >
                </view>
              </view>
            </template>
            <view class="empty-data-box" v-else>
              <image
                class="icon"
                mode="widthFix"
                src="/static/empty.png"
              ></image>
              <text class="text">暂无数据</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="tabindex == 1">
        <workinOut
          :baseInfo="baseInfo"
          @share="share"
          @refresh="getContractDetail"
          ref="workinOut"
        ></workinOut>
      </view>
      <view v-if="tabindex == 2">
        <receiveRefunds :baseInfo="baseInfo"></receiveRefunds>
      </view>
      <view v-if="tabindex == 3">
        <settlement
          :baseInfo="baseInfo"
          @share="share"
          ref="settlement"
        ></settlement>
      </view>
      <view v-if="tabindex == 4">
        <deviceInventory :baseInfo="baseInfo"></deviceInventory>
      </view>
    </view>
    <view class="pop-container">
      <uni-popup ref="tipPop" type="center" :mask-click="true">
        <view class="uni-tip" style="font-size: 14px">
          {{ debtRatio.tip }}
        </view>
      </uni-popup>
    </view>
    <moreOperate
      :receivableDetails="receivableDetails"
      @goToESign="goToESign"
      @isShowBtns="handleisShowBtns"
      :addPigenohole="addPigenohole"
      :addCost="addCost"
      :addRefund="addRefund"
      :addClaim="addClaim"
      :addPause="addPause"
      :addExpanse="addExpanse"
      :addChange="addChange"
      :baseInfo="baseInfo"
      :isStartESignAdd="isEnableESigin"
      :addProceed="addProceed"
      :addWorkOut="addWorkOut"
      :addWorkIn="addWorkIn"
    >
    </moreOperate>
  </view>
</template>

<script>
import { differenceInDays } from "date-fns";
import headTag from "@/components/common/common-ui/head-tag.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";

import workinOut from "@/contractPages/contract/detail/components/workin-out.vue";
import receiveRefunds from "@/contractPages/contract/detail/components/receiveRefunds.vue";
import settlement from "@/contractPages/contract/detail/components/settlement.vue";
import deviceInventory from "@/contractPages/contract/detail/components/device-inventory.vue";

import moreOperate from "./detail/components/more-operate.vue";
import calRent from "@/common/util/cal-rent-money.js";
import parseISO from "date-fns/parseISO";
import { queryStringfy } from "@/common/common-method/common-method";
import { isEmptyObject } from "@/common/business-method/common-method/util.js";
export default {
  components: {
    moreOperate,
    receiveRefunds,
    settlement,
    workinOut,
    headTag,
    imgupload,
    deviceInventory,
  },
  data() {
    return {
      mergeEsignList: [],
      isShowEsignDetail: false,
      isShowBtns: null,
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
      executeList: [],
      activebgColor: "#fff",
      defaultbgColor: "#FFFFFF",
      defaultColor: "#000",
      activeColor: "#E60000",
      value: 0, //当前选中下标
      //选项卡吸附设置
      positionstr: "relative",
      topheight: "0px",
      margintopH: "0px",
      //选项卡列表
      tabList: ["基本信息", "进退场", "收退款", "结算", "设备清单"],
      tabindex: 0,
      //状态栏高度
      statusBarHeight: 0,
      contractId: "",
      businessNo: "",
      contractNo: null,
      baseInfo: {
        contractDetailDto: {
          orderList: [],
        },
        extendedData: {},
      },
      receivableDetails: {},
      //二级页面状态
      isfixed: false,
      isOverdue: false, //是否逾期
      debtRatio: {
        value: "低",
        tip: "(履约已收-押金)/履约营收 < 10%",
      }, //应收比例
      addWorkIn: true,
      addExWorkIn: true,
      addWorkOut: true,
      addExWorkOut: true,
      addChange: true,
      addRefund: true,
      addCost: true,
      addProceed: true,
      addExpanse: true,
      addClaim: true,
      addPause: true,
      addPigenohole: true,
      isshowMore: true, //是否显示更多
      downloadTask: null,
      isEnableESigin: false,
      eSignConfig: null,
      isAddESign: false, //是否有增加电签的权限
      extendTagInfo: "",
      isCanEdit: false, //是否可以編輯擴展信息
      createBy: "",
      esignList: [],
      flowId: "",
      title: "",
    };
  },
  computed: {
    auths() {
      let list = [];
      if (
        this.baseInfo &&
        this.baseInfo.extendedData &&
        !isEmptyObject(this.baseInfo.extendedData)
      ) {
        let extendedData;
        try {
          // 尝试解析extendedData
          extendedData = JSON.parse(this.baseInfo.extendedData);
        } catch (error) {
          // 如果解析失败，则记录错误（或进行其他处理）并设置extendedData为null或默认值
          console.error("Parsing error in extendedData:", error);
          extendedData = {}; // 设置一个默认值，或者根据需要选择其他合适的值
          return;
        }
        if (extendedData.workInAndOutUserName) {
          list.push({
            id: extendedData.workInAndOutUserId,
            name: extendedData.workInAndOutUserName,
            verified: extendedData.workInAndOutUserIdentity,
            identity: extendedData.workInAndOutUserIdentity,
            type: "进退场授权人",
            phoneNum: extendedData.workInAndOutUserPhone,
          });
        }
        if (extendedData.settleUserName) {
          list.push({
            id: extendedData.settleUserId,
            name: extendedData.settleUserName,
            verified: extendedData.settleUserIdentity,
            identity: extendedData.settleUserIdentity,
            type: "结算授权人",
            phoneNum: extendedData.settleUserPhone,
          });
        }
        if (extendedData.contractGuarantorUserName) {
          list.push({
            id: extendedData.contractGuarantorUserId,
            name: extendedData.contractGuarantorUserName,
            verified: extendedData.contractGuarantorUserIdentity,
            identity: extendedData.contractGuarantorUserIdentity,
            type: "合同保证人",
            phoneNum: extendedData.contractGuarantorUserPhone,
          });
        }
      }
      return list;
    },
    navBtns() {
      let _this = this;
      console.log(_this.baseInfo, "_this.baseInfo");
      return [
        {
          text: "审批流",
          type: "none",
          fontSize: "14px",
          color: "#e60000",
          width: "auto",
          isShow: _this.baseInfo.businessKey,
        },
        // {
        //   text: "预览",
        //   type: "none",
        //   fontSize: "14px",
        //   width: "auto",
        // },
      ];
    },
    isShowEsignTimeline() {
      return this.baseInfo.signFlow == "1";
    },
  },

  methods: {
    async getMergeList(v) {
      let res =
        (await this.$network.getData(
          this.$url.CONTRACT_EXECUTE_INFO_ESIGN,
          "GET",
          {
            contractNo: v,
          }
        )) || [];
      this.mergeEsignList = res
        ? res.map((item) => {
            return {
              ...item,
              checked: false,
            };
          })
        : [];
    },
    getTenancyFn(row) {
      console.log(row, "getTenancyFn");
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      const formatDateString = (dateStr) => {
        // 分割日期和时间部分，假设日期和时间由空格分开
        const [datePart, timePart] = dateStr.split(" ");

        // 处理日期部分，支持“-”和“/”作为日期分隔符
        const dateParts = datePart.split(/[-\/]/);
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // 月份从0开始，因此减1
        const day = parseInt(dateParts[2], 10);

        if (timePart) {
          // 处理时间部分，假设格式为"HH:MM:SS"
          const timeParts = timePart.split(":");
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          const seconds = parseInt(timeParts[2], 10);

          return new Date(year, month, day, hours, minutes, seconds);
        } else {
          // 如果没有时间部分，只设置日期部分
          return new Date(year, month, day);
        }
      };

      let beginDate = formatDateString(row.beginDate);
      let endDate = formatDateString(row.endDate);
      let day =
        endDate.getTime() >= beginDate.getTime()
          ? differenceInDays(endDate, beginDate) + 1
          : 0;
      if (day > 0) {
        return day + "天";
      } else {
        return null;
      }
    },
    callPhone(phone) {
      if (!this.isedit && phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          success: (res) => {
            console.log("调用成功!");
          },
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    handleisShowBtns(val) {
      this.isShowBtns = val;
    },
    dealMoney(money) {
      console.log(money, "money");
      return calRent.dealNumber(money);
    },
    goTo(item) {
      let self = this;
      if (typeof item == "string") {
        item = { businessType: item };
      }
      console.log(item, "detainInfo11");
      switch (item.businessType) {
        case "pigeonhole":
          if (this.addPigenohole && this.baseInfo.state == "9") {
            uni.showModal({
              title: "提示",
              content: "确认要把该合同归档么?",
              success: (res) => {
                if (res.cancel) {
                } else {
                  this.updataStatus();
                }
              },
            });
          }
          break;
        case "useReport":
          uni.navigateTo({
            url: `/businessPages/useReport/use-report-detail?contractId=${this.baseInfo.id}`,
          });
          break;
        case "contractExpense":
          if (
            !(
              this.addExpanse &&
              this.baseInfo.contractType == "1" &&
              !this.baseInfo.plusIng &&
              !this.baseInfo.changeIng
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/create-contract-expense?id=" +
              this.baseInfo.id,
          });
          break;
        case "changeContract":
          if (
            !(
              this.addChange &&
              this.baseInfo.contractType == "1" &&
              !this.baseInfo.plusIng &&
              !this.baseInfo.changeIng
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          uni.navigateTo({
            url:
              "/contractPages/contract-change/create-contract-change?id=" +
              this.baseInfo.id,
          });
        case "workOutsimple":
          if (!(this.baseInfo.state == "6" && this.addExWorkOut)) {
            return;
          }
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-simple?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          break;
        case "workInSimple":
          if (
            !this.addExWorkIn ||
            this.baseInfo.contractType != "3" ||
            (this.baseInfo.state != "5" &&
              this.baseInfo.state != "6" &&
              this.baseInfo.state != "7" &&
              this.baseInfo.state != "8")
          ) {
            return;
          }
          this.$refs.morePop.close();
          uni.navigateTo({
            url:
              "/businessPages/workin/create-workin-simple?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          break;
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
    // 获取合同执行流
    async getExecute() {
      let contractNo = this.contractNo || this.baseInfo.businessNo;
      if (!contractNo) return;
      let res = await this.$network.getData(
        this.$url.CONTRACT_EXECUTE_INFO,
        "GET",
        {
          contractNo: contractNo,
        }
      );
      this.executeList = res;

      for (let i = 0; i < res.length; i++) {
        let time = parseISO(this.executeList[i].createTime).getTime();
        this.$set(this.executeList[i], "time", time);
      }
      this.executeList.sort((a, b) => b.time - a.time);
      // this.handleBusinessType(this.executeList)
      console.log(this.executeList, "this.executeList");
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
        case "contractDiscounts":
          icon.svg = "iconjiajianfenguanli";
          icon.color = "#5A7AE8";
          icon.name = "优惠增收";
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
    handleBusinessType(arr) {
      arr.forEach((item) => {
        switch (item.businessType) {
          case "statement":
            item.operate = "对账";
            this.$set(item, "operate", "对账");
          case "proceeds":
            item.operate = "收款";
          case "claim":
            item.operate = "索赔";
            return "索赔";
          case "pause":
            item.operate = "报停";
            return "报停";
          case "reimburse":
            item.operate = "退款";
            return "退款";
          case "invoice":
            item.operate = "发票";
            return "发票";
          case "workIn":
            item.operate = "进场";
            return "进场";
          case "settlement":
            item.operate = "结算";
            return "结算";
          case "workOut":
            item.operate = "退场";
          case "contractChange":
            item.operate = "合同变更";
            return "合同变更";
          case "settle":
            item.operate = "合同结清";
            return "合同结清";
          default:
            (item.operate = "合同"), this.$set(item, "operate", "合同");
            break;
        }
      });
    },
    viewDetail(item) {
      this.goTo(item);
    },
    itemClick(index, tab) {
      console.log(index, tab, "index");
      this.tabindex = index;
    },
    /**
     * 是否可以启动电签
     * @param {Object} signStatus ：电签状态
     * @param {Object} state 合同状态
     * @param {Object} eSignConfig 电签配置
     */
    isStartESignAdd(signStatus, state, eSignConfig) {
      if (
        this.isAddESign &&
        (!signStatus ||
          // signStatus == '0' ||
          signStatus == "3" ||
          signStatus == "5" ||
          signStatus == "7")
      ) {
        let eSignStartNode =
          eSignConfig && eSignConfig.value ? eSignConfig.value : null;
        // 1. adopt 合同审批通过后启动。    2.  apply 合同申请后即可启动。
        if (!eSignStartNode || eSignStartNode == "adopt") {
          //审批完成
          return state != "1" && state != "0" ? true : false;
        } else if (eSignStartNode == "apply") {
          return true;
        }
        return false;
      }
      return false;
    },
    isEditESignAdd(signStatus, createBy, customerSalesman) {
      if (
        !signStatus ||
        // signStatus == '0' ||
        signStatus == "3" ||
        signStatus == "5" ||
        signStatus == "7"
      ) {
        return this.createBy == createBy || this.createBy == customerSalesman;
      }
      return false;
    },
    setEsignParams() {
      let tenantObj = uni.getStorageSync(this.$savekey.TENANT_DETAIL);
      if (!tenantObj || !tenantObj.esignId) {
        uni.showToast({
          icon: "none",
          title: "当前租户还未开通电签平台，请开通后再配置",
        });
        return;
      }
      let flag = false;
      if (this.baseInfo.customerType == 2) {
        if (!!this.baseInfo.customerPhoneNum) {
          flag = false;
        } else {
          flag = true;
        }
      }
      if (flag && !this.baseInfo.contractDetailDto.phoneNum) {
        uni.showToast({
          icon: "none",
          title: "甲方或乙方手机号没有填写",
        });
        return;
      }

      this.$gxfmethod.statisticData(
        this.$eventId.Esign_Administrative,
        "启动电签",
        "合同启动电签"
      );
      let sparams = {
        businessType: "contract",
        customerId: this.baseInfo.customerId,
        customerName: this.baseInfo.customerName,
        customerType: this.baseInfo.customerType,
        contactId: this.baseInfo.contractDetailDto.contactId,
        businessId: this.baseInfo.id,
        businessTitle:
          this.baseInfo.customerName +
          "-" +
          this.baseInfo.contractDetailDto.projectName,
        businessNo: this.baseInfo.businessNo,
        contractNo: this.baseInfo.businessNo,
        flowId: this.baseInfo.flowId,
        customerSalesman: this.baseInfo.contractDetailDto.customerSalesman,
        customerSalesmanName:
          this.baseInfo.contractDetailDto.customerSalesmanName,
        customerSalesmanPhoneNum: this.baseInfo.customerSalesmanPhoneNum,
        orgId: this.baseInfo.orgId,
        contactName: this.baseInfo.contractDetailDto.contactName,
        customerPhoneNum: this.baseInfo.customerPhoneNum,
        phoneNum: this.baseInfo.contractDetailDto.phoneNum,
        signFlowTitle: `${this.baseInfo.customerName}-${this.baseInfo.contractDetailDto.projectName}`,
      };
      return sparams;
    },
    goToESign(type) {
      switch (type) {
        case "start":
          let esignParams = this.setEsignParams();
          // 如果mergeEsignList长度大于1 就跳合并电签页面
          if (this.mergeEsignList && this.mergeEsignList.length > 1) {
            uni.navigateTo({
              url:
                "/contractPages/contract/merge-signatures?esignParams=" +
                encodeURIComponent(JSON.stringify(esignParams)) +
                "&mergeEsignList=" +
                encodeURIComponent(JSON.stringify(this.mergeEsignList)),
            });
          } else {
            // 直接跳启动电签页面
            uni.navigateTo({
              url:
                "/otherPages/esign/esign-start-process?isStart=true&" +
                queryStringfy(esignParams, false),
            });
          }

          break;
        case "detail":
          uni.navigateTo({
            url:
              "/otherPages/esign/esign-flow-detail?businessType=contract&flowId=" +
              this.baseInfo.flowId +
              "&docId=" +
              this.baseInfo.docId,
          });
          break;
        default:
          break;
      }
    },
    // 合同营收
    getContractRecevice() {
      let self = this;
      this.$network
        .getData(
          this.$url.CONTRACT_DETAIL_RECEIVABLE +
            "?contractNo=" +
            this.baseInfo.businessNo,
          "GET",
          null
        )
        .then((result) => {
          this.receivableDetails = result || {};
          console.log(result, "result123");
          let revenuePerform = 0;
          let revenueReceived = 0;
          let customerReceiptTotalDone = 0;
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

          customerReceiptTotalDone =
            result && result.receipt ? Number(result.receipt.deposit) : 0; //已收押金
          console.log(customerReceiptTotalDone, "customerReceiptTotalDone");
          //计算应收比例
          this.debtRatioFn(
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
        })
        .catch((err) => {});
    },
    debtRatioFn(
      debtExpireTotal,
      debtExpireTotalDone,
      customerReceiptTotalDone
    ) {
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
            value: "低",
            tip: "(履约已收-押金)/履约营收 < 10%",
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
      console.log(obj, "debtRatio");
      this.debtRatio = { ...obj };
      // this.$set(debtRatio,)
    },

    getContractDetail() {
      let param = {};
      if (this.contractId) {
        param = {
          id: this.contractId,
        };
      } else if (this.contractNo) {
        param = {
          businessNo: this.contractNo,
        };
      } else {
        param = {
          businessNo: this.businessNo,
        };
      }
      // param.contractStateList= "4,5,6,7,8,9",
      // TODO-contractStateList:有可能需要增加参数
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          this.baseInfo = result;
          this.isShowEsignDetail =
            result.signFlowId &&
            result.flowStatus != 3 &&
            result.flowStatus != 7;
          this.isEnableESigin = this.isStartESignAdd(
            this.baseInfo.flowStatus, //3
            this.baseInfo.state, //6
            this.eSignConfig
          );
          this.isCanEdit = this.isEditESignAdd(
            this.baseInfo.flowStatus,
            this.baseInfo.createBy,
            this.baseInfo.customerSalesman
          );
          this.getOverdueFlag();
          this.getEsignList();
        })
        .catch((err) => {});
    },
    getOverdueFlag() {
      let param = {
        contractNo: this.baseInfo.businessNo,
      };
      this.$network
        .getData(this.$url.JUDGE_OVERDUE, "GET", param)
        .then((result) => {
          this.isOverdue = result.overdueBeginDate ? true : false;
          if (
            this.baseInfo.state === "0" || //草稿
            this.baseInfo.state === "1" || //审批中
            this.baseInfo.state === "5" || //待进场
            ((this.baseInfo.contractDetailDto.paymentType === "2" ||
              this.baseInfo.contractDetailDto.paymentType === "3" ||
              this.baseInfo.contractDetailDto.paymentType === "4") &&
              this.baseInfo.contractDetailDto.settlementDayType === "1")
          ) {
            this.isOverdue = false;
          }
        })
        .catch((err) => {});
    },
    showTip() {
      this.$refs.tipPop.open();
    },
    goTo(item) {
      let self = this;
      console.log(item, "detainInfo11");
      switch (item.businessType) {
        case "settle":
          if (
            !(
              (this.baseInfo.state === "6" ||
                this.baseInfo.state === "7" ||
                this.baseInfo.state === "8") &&
              this.addClaim
            )
          ) {
            return;
          }
          this.$refs.morePop.close();
          uni.redirectTo({
            url: `/businessPages/settledown/settle-add?contracts=${this.baseInfo.businessNo}&customerId=${this.baseInfo.customerId} `,
          });
          break;
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
        case "contractChange":
          console.log(item);
          uni.navigateTo({
            url:
              "/contractPages/contract-change/contract-change-detail?id=" +
              item.id,
          });
          break;
        case "contractPlus":
          console.log(item, "gotodetail");
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/contract-expense-detail?businessKey=" +
              (item.businessKey || "") +
              "&contractNo=" +
              item.contractNo +
              "&plusContractId=" +
              item.id,
          });
          break;
        case "settlement":
          let url =
            "/businessPages/settledown/settle-detail?businessNo=" +
            item.businessNo;
          uni.navigateTo({
            url: url,
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
    updataStatus() {
      let urlstr = this.$url.CONTRACT_UPDATA_STATE.replace(
        /xxx/,
        this.baseInfo.id
      );
      this.$network
        .getData(urlstr, "PUT", null)
        .then((result) => {
          uni.showToast({
            icon: "none",
            title: "归档成功",
          });
          uni.$emit("refresh-contract-list", {
            type: "contract",
          });
          this.$refs.morePop.close();
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message + (err.details ? ":" + err.details[0] : ""),
          });
        });
    },
    downDocument(headerDic) {
      let url =
        this.$url.BASE_URL +
        this.$url.DOWNLOAD_WORD_CONTRACT +
        "?businessNo=" +
        this.baseInfo.businessNo;
      this.downxlsc(url, headerDic);
    },
    downxlsc(url, headerDic) {
      let customerName = this.baseInfo.customerName
        ? this.baseInfo.customerName
        : "";
      let projectName =
        this.baseInfo.contractDetailDto &&
        this.baseInfo.contractDetailDto.projectName
          ? this.baseInfo.contractDetailDto.projectName
          : "";
      console.log(url);
      console.log(projectName);
      console.log(customerName);

      let name = "合同-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },

    downloadEsign(item) {
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
      } else {
        let headerDic = {
          "Content-Type": "application/json",
          Authorization: "",
        };
        let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
        if (loginMes) {
          let access_token = loginMes.token_type + " " + loginMes.access_token;
          headerDic.Authorization = access_token;

          let url =
            this.getUrlUploadFile(item.businessType) +
            "?businessNo=" +
            item.businessNo;

          this.downxlsc(url, headerDic, item.title);
        }
      }
    },
    revoke() {
      uni.showModal({
        title: "提示",
        content: "是否确认撤销当前电签流程？",
        success: (res) => {
          if (res.confirm) {
            let url = this.$url.esignRecordRevoke;
            url = url.replace("{id}", this.esignList[0].flowId);
            this.$network
              .getData(url, "POST")
              .then((res) => {
                setTimeout(() => {
                  this.getContractDetail();
                }, 1000);
              })
              .catch((err) => {});
          }
        },
      });
    },
    // 点击更多
    // onNavBarButtonTap(obj) {
    //   console.log(this.baseInfo, "this.baseInfo");
    //   if (obj.index == 1) {
    //     uni.getStorage({
    //       key: this.$savekey.USER_PRIVILEGES_MEG,
    //       success: (res) => {
    //         if (
    //           this.baseInfo.signStatus &&
    //           this.baseInfo.signStatus == "2" &&
    //           this.baseInfo.flowId
    //         ) {
    //           //电签状态为2，下载pdf格式文件
    //           this.getPdfUrl(this.baseInfo.flowId);
    //         } else {
    //           let isDownloadTemplate = res.data.some(
    //             (x) =>
    //               x.value === this.$savekey.PERMISSION_EXPORT_CONTRACT_TEMPLATE
    //           );
    //           if (
    //             isDownloadTemplate &&
    //             this.baseInfo.state !== "0" &&
    //             this.baseInfo.state !== "3" &&
    //             this.baseInfo.state !== "12"
    //           ) {
    //             let headerDic = {
    //               "Content-Type": "application/json",
    //               Authorization: "",
    //             };
    //             let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
    //             if (loginMes) {
    //               let access_token =
    //                 loginMes.token_type + " " + loginMes.access_token;
    //               headerDic.Authorization = access_token;
    //               this.downDocument(headerDic);
    //             }
    //           } else {
    //             uni.showToast({
    //               icon: "none",
    //               title: "暂无下载权限",
    //             });
    //           }
    //         }
    //       },
    //     });
    //   } else if (obj.index == 0) {
    //     if (this.baseInfo.isSettle) {
    //       uni.showToast({
    //         icon: "none",
    //         title: "当前合同状态无法操作",
    //       });
    //       return;
    //     }
    //     let p =
    //       this.addWorkIn ||
    //       this.addWorkOut ||
    //       this.addChange ||
    //       this.addExpanse ||
    //       this.addProceed ||
    //       this.addRefund ||
    //       this.addClaim ||
    //       this.addPause;
    //     if (p) {
    //       if (
    //         this.baseInfo.state === "1" ||
    //         this.baseInfo.state === "5" ||
    //         this.baseInfo.state === "6" ||
    //         this.baseInfo.state === "7" ||
    //         this.baseInfo.state === "8" ||
    //         this.baseInfo.state === "9"
    //       ) {
    //         this.$gxfmethod.statisticData(
    //           this.$eventId.Contract_Administrative,
    //           "合同列表",
    //           "详情-更多操作"
    //         );
    //         this.$refs.morePop.open();
    //       } else {
    //         uni.showToast({
    //           icon: "none",
    //           title: "当前合同状态无法操作",
    //         });
    //       }
    //     } else {
    //       uni.showToast({
    //         icon: "none",
    //         title: "暂无操作权限",
    //       });
    //     }
    //   }
    // },
    onNavBarButtonTap() {
      let _this = this;
      let url =
        "/businessPages/workin/work-flow-display?businessKey=" +
        _this.baseInfo.businessKey;
      uni.navigateTo({
        url: url,
      });
    },
    getEsignList() {
      let param = {
        current: 1,
        size: 50,
        businessNo: this.contractNo || this.baseInfo.businessNo,
        businessType: "contract",
      };
      let url = this.$url.esignRecordPage;
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.$nextTick(() => {
            this.esignList = result.records;
            this.esignList.forEach((e) => {
              e.signers = e.signer.split(",");
            });
          });
        })
        .catch((err) => {});
    },
    getEsignStatus(type) {
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
    gotoDetail() {
      let url = this.$url.esignRecordInfo;
      let param = {
        urlType: 1,
      };
      url = url.replace("{id}", this.esignList[0].flowId);
      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          uni.navigateTo({
            url: `/otherPages/esign/webView?url=${encodeURIComponent(
              res
            )}&title=${this.esignList[0].title}`,
          });
        })
        .catch((err) => {});
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
    download() {
      let item = this.esignList[0];
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
      } else {
        let headerDic = {
          "Content-Type": "application/json",
          Authorization: "",
        };
        let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
        if (loginMes) {
          let access_token = loginMes.token_type + " " + loginMes.access_token;
          headerDic.Authorization = access_token;

          let url =
            this.getUrlUploadFile(item.businessType) +
            "?businessNo=" +
            item.businessNo;
          this.downxlsc(url, headerDic, item.title);
        }
      }
    },
    downxlsc(url, headerDic, name) {
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },
    share(item) {
      this.flowId = item.flowId;
      this.title = item.title;
    },
    shareContract() {
      this.flowId = this.esignList[0].flowId;
      this.title = this.esignList[0].title;
    },
  },
  onUnload() {
    uni.$off("esign-start");
    // if (this.downloadTask) {
    // this.downloadTask.abort();
    // }
  },

  watch: {
    "baseInfo.businessNo": {
      handler(val) {
        if (val) {
          this.getExecute();
          this.getContractRecevice();
          this.getMergeList(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async onShareAppMessage({ target, from }) {
    var that = this;
    if (from === "button" && target.dataset.type == "esign") {
      debugger;
      let url = target.dataset.url;
      let title = target.dataset.title || that.title;
      let nodeId = target.dataset.nodeId;
      /* 先判断分享按钮是否携带url参数,不携带url参数有多种情况:
       * 一种是本身没有,需要异步获取;
       * 一种是本身有,但是未获取到; */
      if (!url) {
        /* 组件中的电签和催办,是没有flowId,使用携带的url参数或者nodeId的方式查询url */
        if (!that.flowId) {
          /* 组件中的电签和催办,使用nodeId的方式查询url */
          if (!nodeId) {
            let res = await this.$network.getData(
              "/esignapi/api/esign-record/urge/sms?nodeId=" + activeNode.id,
              "GET"
            );
            url = res.url;
          } else {
            /* 各种参数均传递失败 */
            await this.$network.getData(
              "/userapi/api/user/auth/reportFault",
              "POST",
              {
                model: "ShareAppMessage",
                dataset: target.dataset,
                businessNo: that.baseInfo.businessNo,
              }
            );
          }
        } else {
          /* 在本页面的电签和催办,是有flowId,使用flowId的方式查询url */
          try {
            url = await that.$network.getData(
              that.$url.esignRecordInfo.replace("{id}", that.flowId),
              "GET",
              {
                urlType: 2,
              }
            );
          } catch (e) {
            await this.$network.getData(
              "/userapi/api/user/auth/reportFault",
              "POST",
              {
                model: "ShareAppMessage",
                businessNo: that.baseInfo.businessNo,
                flowId: that.flowId,
                error: e,
              }
            );
          }
        }
      }
      return {
        title,
        imageUrl:
          "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
        path: `/otherPages/esign/webView?url=${encodeURIComponent(
          url
        )}&title=${title}`,
      };
    } else {
      return {
        title: that.title,
        imageUrl:
          "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
        path: `/contractPages/contract/contract-detail?title=${that.title}`,
      };
    }
  },
  onLoad(option) {
    console.log(option, "option");
    if (option.contractNo) {
      this.contractNo = option.contractNo;
    }
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Administrative,
      "合同列表",
      "合同详情"
    );
    const res = uni.getSystemInfoSync();
    const system = res.platform;
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.addWorkIn = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_WORK_IN_ADD
      );
      this.addWorkOut = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_WORK_OUT_ADD
      );
      this.addExWorkIn = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_SIMPLE_WORKIN_ADD
      );
      this.addExWorkOut = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_SIMPLE_WORKOUT_ADD
      );
      this.addChange = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_CONTRACT_CHANGE_ADD
      );
      this.addExpanse = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_CONTRACT_EXPENSE_ADD
      );
      this.addProceed = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_COLLECTION_MANAGE_ADD
      );
      this.addRefund = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_REFUND_MANAGE_ADD
      );
      this.addClaim = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_BUSINESS
      );
      this.addPause = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_PAUSE_MANAGE_ADD_BUSINESS
      );
      this.addPigenohole = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_ADD_PIGENOHOLE
      );
      this.isAddESign = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_ESIGN_ADD
      );
    }
    this.statusBarHeight = res.statusBarHeight;
    this.contractId = option.id;
    this.businessNo = option.businessNo;
    let userObj = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
    if (userObj) {
      this.createBy = userObj.id;
    }
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isshowMore = obj.value === "liangXu" ? false : true;
      }
      this.eSignConfig = resData.find((o) => o.code === "esign_start_node");
      let extendObj = resData.find((o) => o.code === "contract_extend_data");
      if (extendObj) {
        this.extendTagInfo = extendObj.value;
        let extendList = JSON.parse(this.extendTagInfo);
        if (extendList && extendList.length > 0) {
          // this.tabList.push("扩展信息");
        }
      }
    }
    uni.$on("esign-start", (obj) => {
      this.getContractDetail();
    });
    this.getContractDetail();
    if (this.baseInfo.businessNo) {
      this.getMergeList(this.baseInfo.businessNo);
    }
  },
  onShow() {
    if (this.$refs.timeline) this.$refs.timeline.init();
    this.getContractDetail();
    if (this.$refs.workinOut) {
      this.$refs.workinOut.loaddata();
      this.$refs.workinOut.loaddataworkout();
    }
    if (this.$refs.settlement) {
      this.$refs.settlement.getSettleList();
    }
  },
  onPageScroll(e) {
    if (e.scrollTop >= 143 + this.statusBarHeight) {
      this.positionstr = "fixed";
      this.margintopH = "66px";
    } else {
      this.positionstr = "relative";
      this.margintopH = "0px";
    }
    if (e.scrollTop >= 390 + this.statusBarHeight) {
      this.isfixed = true;
    } else {
      this.isfixed = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.auth-item {
  display: flex;
  margin-bottom: 20rpx;

  .auth-label {
    font-size: 26rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #8c8c8c;
  }

  .auth-value {
    font-size: 26rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #222222;
  }

  .text-success {
    color: #52c41a;
  }
}

.bb62 {
  padding-bottom: 124rpx !important;
}

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

.content {
  width: 100%;
  // height: 100%;
  background-color: #f5f4f9;
  position: relative;
}

.tab-container {
  background-color: #ffffff;
  width: 100%;
  z-index: 900;
}

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

.header-container {
  margin-top: 10px;
  // margin-bottom: 12px;
  padding: 12px 12px 12px 0px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #8c8c8c;
}

.header-title {
  line-height: 26px;
  font-size: 16px;
  font-weight: 800;
  color: #222222;
}

.tip-style {
  font-size: 12px;
  margin-left: 6rpx;
}

.tag-style {
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  width: 20px;
  border-radius: 4px;
  color: #ffffff;
  margin-right: 8px;
}

.header-sub-title {
  line-height: 20px;
  padding: 6px 0px;
  font-size: 12px;
}

.head-content {
  margin-left: 12px;
  margin-top: 35rpx;
  background: #f6f6f6;
  padding: 12px 10px;
  font-size: 12px;
  color: #8c8c8c;
  display: flex;
  flex-direction: column;
}

.content-text {
  line-height: 24px;
}

.phone-icon {
  background-color: rgba(230, 0, 0, 0.08);
  color: #e60000;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
}

.uni-tab {
  position: relative;
  display: flex;
  font-size: 14px;
  padding: 0 18rpx;
  box-sizing: border-box;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
  border-bottom: 1rpx solid #e6e6e6;
}

.uni-tab-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 44px;
  box-sizing: border-box;
}

.tab-top {
  display: flex;
  flex-direction: row;
  flex: 1;
  white-space: nowrap;
  box-sizing: border-box;
  overflow: hidden;
  align-items: center;
}

.tab-line {
  height: 3px;
  width: 60px;
  // background-color: #ff00ff;
  border-radius: 3px;
}

.uni-tab-active {
  color: #1e9fff;
}

::-webkit-scrollbar {
  height: 0px;
}

.leftView {
  flex: 1;
  align-items: center;
  text-align: center;
}

.main-container {
  background-color: #fff;
  padding-bottom: 2rpx;
  margin-bottom: 24rpx;

  .container-item {
    margin: 22rpx 16rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 32rpx;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    border-radius: 10px;

    .esign-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 22rpx;
    }

    .item-title {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 22rpx;
    }

    .row {
      display: flex;
      justify-content: space-between;
      line-height: 45rpx;
      flex-wrap: wrap;

      .row-item {
        // flex-basis: 50%;
        margin-bottom: 2rpx;
      }
    }
  }
}

.label {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  display: inline-block;
}
.flexBox {
  display: flex;
  align-items: center;
}
.value {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
}

.row-item {
  margin-bottom: 15rpx;
}

.device-container {
  .device-item {
    margin-bottom: 30rpx;

    .device-item-title {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 18rpx;
    }

    .sub-info {
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color: #FE931F;
      line-height: 32rpx;

      text {
        padding: 7rpx 14rpx;
        height: 40rpx;
        // background: #FFEFDE;
        border-radius: 6rpx;
        margin-right: 12rpx;
      }
    }

    .bg-gray {
      display: flex;
      flex-wrap: wrap;
      padding: 16rpx;
      background: #f6f6f6;
      border-radius: 6rpx;
      margin-top: 20rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8c8c8c;

      text {
        flex-basis: 50%;
        line-height: 44rpx;
      }
    }

    .data-empty {
      margin-top: calc(50% - 5px);
      align-self: center;
      font-size: 15px;
      color: #999999;
    }
  }
}

.excute-container {
  .excute-item {
    padding: 22rpx 24rpx;
    background: #f6f6f6;
    margin-bottom: 20rpx;

    .excute-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #222222;
      margin-bottom: 24rpx;

      .bold {
        font-weight: 500;
        display: flex;
        align-items: center;
      }

      .shin {
        font-weight: 400;
      }
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #888888;
    }
  }
}

::v-deep .img-upload-view {
  min-height: 0 !important;
  padding: 0 0 14rpx 0;
}

::v-deep .list-view {
  margin-left: 0;
}

::v-deep .border {
  width: 204rpx;
  height: 204rpx;
  margin-top: 0 !important;
}

.hire {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
}

.hire-item-txt {
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
  margin-top: 3px;
}

.esign {
  padding: 10px 11px;
  background: #f6f6f6;
  margin-bottom: 9px;

  p {
    margin-bottom: 12px;
  }
}

.green {
  color: #52c41a !important;
}

.red {
  color: #e60000 !important;
}

.tag-btns-view {
  position: relative;
  display: inline;
  font-size: 15px;
  background-color: none;
  margin-right: 15px;
  color: #e60000;
  border: none;
  padding: 0;
}

.tag-btns-view::after {
  border: none !important;
}
</style>
