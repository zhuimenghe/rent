<template>
  <view class="settle-adds">
    <c-nav-bar-apply :business-key="customDic.businessKey">结算单详情</c-nav-bar-apply>
    <view class="flex-scroll-wrapper">
      <view class="contractHead">
        <p class="title">
          <span class="contractType">{{
            contractTypeName(settleInfoDic && settleInfoDic.contractType)
          }}</span>
          {{ settleInfoDic.customerName }}-{{ settleInfoDic.projectName }}
        </p>
        <view class="body">
          <p>合同编号：{{ settleInfoDic.businessNo }}</p>
          <p>区域：{{ settleInfoDic.orgName }}</p>
          <p>业务负责人：{{ settleInfoDic.customerSalesmanName }}</p>
          <p style="display: flex; justify-content: space-between; align-items: center">
            客户联系人：{{ settleInfoDic.contactName }}-{{ settleInfoDic.phoneNum }}
            <i
              class="iconfont phone-icon icondianhua"
              @click.stop="callPhone(settleInfoDic.phoneNum)"
            ></i>
          </p>
        </view>
      </view>
      <b-esign-timeline
        ref="timeline"
        v-if="isShowEsignTimeline"
        showExpand
        :businessNo="customDic.businessNo"
      ></b-esign-timeline>
      <!-- 本期结算 -->
      <p class="settle">
        <span class="line"></span> 本期结算:
        <span style="margin-left: 5px">{{ customDic.businessNo }}</span>
      </p>

      <!--结算设备  -->
      <view class="detail" v-show="!showDetial">
        <view class="title" @click="showList">
          <p style="color: #222222">
            {{ settleInfoDic.projectName }}
          </p>
          <p style="color: #e60000">展开 <span class="iconfont iconarrow-down"></span></p>
        </view>

        <view class="body">
          <p v-if="settleInfoDic.monthConfig=='30'">月份计算：30天为一个月</p>
          <p v-else-if="settleInfoDic.monthConfig=='0'">月份计算：自然月</p>
          <p v-else>月份计算：-</p>
          <p>支付约定：{{ settleInfoDic.paymentTypeName }}</p>
          <p v-if="settleInfoDic.paymentType==='2'
            ||settleInfoDic.paymentType==='3'||settleInfoDic.paymentType==='4'">
            结算日方式：
            {{ settleInfoDic.settlementDayTypeName || '-'}}
          </p>
          <p v-if="settleInfoDic.settlementDayType==='2' || 
            settleInfoDic.settlementDayType==='6' || settleInfoDic.settlementDayType==='10'">
            结算日：  
            {{ settleInfoDic.settlementDay ? settleInfoDic.settlementDay+'号'  :"-" }}
          </p>
          <p>减免约定：{{ settleInfoDic.renterTripTypeName }}</p>
          <!-- <p>业务负责人：{{ settleInfoDic.customerSalesmanName }}</p> -->
          <p>运费计算方式：{{ settleInfoDic.tripCalType=='1'? '按趟计费':'按台计费' }}</p>
          <p v-if="settleInfoDic.tripCalType=='1'">单趟运费金额：{{ settleInfoDic.tripVal }}元</p>
          <p>其他约定：{{ settleInfoDic.covenants || '--' }}</p>
          <!-- <p>预付：￥{{ settleInfoDic.advance || 0 }}</p> -->
          <!-- <p>开始时间：{{ date[0] && dateSlice(date[0]) }}</p> -->
          <!-- <p>结束时间：{{ date[1] && dateSlice(date[1]) }}</p> -->
          <!-- <p>结算设备数量：{{ settleInfoDic.machineReceivableList.length }}</p> -->
        </view>

        <view class="total">
          <view style="display: flex;align-items: center;">
            <view>
              合同小计：<span style="color: #e60000">¥{{ receivable.total }}</span>
            </view>
            <view v-if="settleInfoDic.tripCalType=='1'" style="margin-left: 100rpx;">
              运费合计：<span style="color: #e60000">¥{{ (customDic.tripNum*settleInfoDic.tripVal).toFixed(2) }}</span>
            </view>
          </view>
          <p style="color: #fe931f">注:合同抵扣金额不计算到对账（结算）汇总</p>
        </view>
      </view>

      <!--结算设备 展开 -->
      <view class="detail" v-show="showDetial">
        <view class="title" @click="showList">
          <p style="color: #222222">
            {{ settleInfoDic.projectName }}
          </p>
          <p style="color: #e60000">收起 <span class="iconfont iconarrow-up"></span></p>
        </view>

        <view class="body">
          <p v-if="settleInfoDic.monthConfig=='30'">月份计算：30天为一个月</p>
          <p v-else-if="settleInfoDic.monthConfig=='0'">月份计算：自然月</p>
          <p v-else>月份计算：-</p>
          <p>支付约定：{{ settleInfoDic.paymentTypeName }}</p>
          <p v-if="settleInfoDic.paymentType==='2'
            ||settleInfoDic.paymentType==='3'||settleInfoDic.paymentType==='4'">
            结算日方式：
            {{ settleInfoDic.settlementDayTypeName || '-'}}
          </p>
          <p v-if="settleInfoDic.settlementDayType==='2' || 
            settleInfoDic.settlementDayType==='6' || settleInfoDic.settlementDayType==='10'">
            结算日：  
            {{ settleInfoDic.settlementDay ? settleInfoDic.settlementDay+'号'  :"-" }}
          </p>
          <p>减免约定：{{ settleInfoDic.renterTripTypeName }}</p>
          <!-- <p>业务负责人：{{ settleInfoDic.customerSalesmanName }}</p> -->
          <p>运费计算方式：{{ settleInfoDic.tripCalType=='1'? '按趟计费':'按台计费' }}</p>
          <p v-if="settleInfoDic.tripCalType=='1'">单趟运费金额：{{ settleInfoDic.tripVal }}元</p>
          <p>其他约定：{{ settleInfoDic.covenants || '--' }}</p>
        </view>
        <view class="form">
          <view class="cell-input-view">
            <view class="cell-input-view-left">
              <text>结算周期</text>
            </view>
            <view class="cell-input-view-right">
              <myUniDatetimePicker
                v-model="date"
                type="daterange"
                :clear-icon="false"
                disabled
              />
            </view>
          </view>
          <view v-if="settleInfoDic.tripCalType=='1'" class="cell-input-view">
            <view class="cell-input-view-left">
              <text>运输趟数</text>
            </view>
            <view class="cell-input-view-right" style="justify-content: flex-end;">
              <view style="display: flex; align-items: center">
                <text class="circle leftcircle disabled">-</text>
                <text class="number">{{ customDic.tripNum || 0 }}</text>
                <text class="circle rightcircle disabled">+</text>
              </view>
              </view>
            </view>
        </view>

        <p class="settle"><span class="line"></span> 本期结算设备</p>

        <view
          class="machine"
          v-for="(item, index) in settleInfoDic.machineReceivableList"
          :key="index"
        >
          <view class="content-view">
            <view class="titleInfo">
              <p style="font-size: 16px; color: #222222; font-weight: 600">
                {{ item.licenseId }} ({{ item.printCode ? item.printCode : "-" }})
                <span
                  :class="
                    item.state == 1
                      ? 'icon-car-right-state-rent'
                      : 'icon-car-right-state-wait'
                  "
                  >{{ item.stateName }}
                  <text style="margin-left: 5px; margin-right: 5px">|</text
                  >{{ item.subStateName }}</span
                >
                <span class="mechineC" v-if="item.contractMachineTransferInfo" @click.stop="checkTransfer(item)">换车</span>
              </p>
              <p
                style="
                  color: #8c8c8c;
                  font-size: 10px;
                  white-space: nowrap;
                  margin-top: 8px;
                "
              >
                {{ item.typeName }}|{{ item.machineTypeName }}|{{
                  item.heightName
                }}|进场单号{{ item.workInBusinessNo }}
              </p>
            </view>
          </view>
          <view class="info" v-if="item.show">
            <!-- <p>结算周期：{{}}-{{}}</p> -->
            <view class="">
              <p style="margin: 5px 0">
                结算周期：{{ dateSlice(item.beginDate) }}~{{ dateSlice(item.endDate) }}
              </p>
              <view class="infoText">
                <p>租期：{{ getTenancyFn(item) }}</p>
                <p>报停：{{ item.pauseDays }}天</p>
                <p>实算天数：{{ item.rentDays }}天</p>
                <p>租赁约定：{{ item.originSettlementTypeName }}</p>
                <p v-if="item.settlementType == '1'">日租金：¥{{ item.hire }}</p>
                <p v-if="item.settlementType == '2' || item.settlementType == '3'">
                  月租金：¥{{ item.hire }}
                </p>
                <p v-if="item.settlementType == '5'">周租金：¥{{ item.hire }}</p>
                <p v-if="item.settlementType == '4' || item.settlementType == '6'">
                  日租金/月租金：¥{{ item.hire }}/¥{{ item.hireMonthly }}
                </p>
                <p>报停总价：¥{{ item.pauseHireTotal }}</p>
                <p v-if="settleInfoDic.tripCalType!='1'">
                  运费：¥{{ item.carriage }}
                </p>
                <p>押金：¥{{ item.pledge }}</p>
                <p>索赔：¥{{ item.claimTotal }}</p>
                <p>核算调整：{{ item.adjust ? item.adjust : 0 }}</p>
              </view>
            </view>
          </view>
          <view class="total">
            <p>
              设备小计：
              <span style="color: #e60000">¥{{ item.receivableTotal }}</span>
            </p>
            <span style="color: #e60000" @click="drop(index)" v-if="!item.show">
              查看详情 <span class="iconfont iconarrow-down"></span>
            </span>
            <span style="color: #e60000" @click="drop(index)" v-else>
              收起 <span class="iconfont iconarrow-up"></span>
            </span>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>抵扣</text>
          </view>
          <view class="cell-input-view-right">
            <view class="input-style"> {{ settleInfoDic.deduct }}</view>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>人工费</text>
          </view>
          <view class="cell-input-view-right">
            <view class="input-style"> {{ settleInfoDic.laborCost }}</view>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>其他费用</text>
          </view>
          <view class="cell-input-view-right">
            <view class="input-style"> {{ settleInfoDic.other }}</view>
          </view>
        </view>
        <view class="total">
          <view style="display: flex;align-items: center;">
            <view>
              合同小计：<span style="color: #e60000">¥{{ receivable.total }}</span>
            </view>
            <view v-if="settleInfoDic.tripCalType=='1'" style="margin-left: 100rpx;">
              运费合计：<span style="color: #e60000">¥{{ (customDic.tripNum*settleInfoDic.tripVal).toFixed(2) }}</span>
            </view>
          </view>
          
          <p style="color: #fe931f">注:合同抵扣金额不计算到对账（结算）汇总</p>
        </view>
      </view>

      <!-- 结算汇总 -->
      <view class="flex">
        <p class="settle"><span class="line"></span> 结算汇总</p>
      </view>

      <view class="confluence">
        <view class="row">
          <view class="left">
            <p class="blod">当期结算营收：¥{{ receivable.total }}</p>
            <p class="orange">注:以本次结算数据计算为准</p>
          </view>
          <view class="gray row-item">
            <p>运费：¥{{ receivable.carriage }}</p>
            <p>租金：¥{{ receivable.hire }}</p>
            <p>索赔：¥{{ receivable.claim }}</p>
            <p>其他：¥{{ receivable.other }}</p>
          </view>
        </view>
        <view class="row" style="padding-top: 10px">
          <view class="left">
            <p class="blod">结余实收：¥{{ balanceTotal }}</p>
            <p class="orange">注:结余实收=全部已收-已结算</p>
          </view>
          <view class="gray row-item">
            <p>全部实收：¥{{ receipt.total || 0 }}</p>
            <p>已结算营收：¥{{ settleTotal }}</p>
            <p>本次抵扣：¥{{ settleInfoDic.deduct }}</p>
          </view>
        </view>
        <view class="total">
          <p>当期收款：¥{{ receiptPeriod.total || 0 }}</p>
          <p>当期应收：¥{{ periodTotal }}</p>
          <p>上期应收：¥{{ receivableTotal - periodTotal }}</p>
        </view>
      </view>
    </view>
    <esign-footer :esignParams="esignParams">
      <template #top>
        <view class="footer-total">
          <span
            >汇总： <span style="color: #e60000">¥{{ receivableTotal }}</span>
          </span>
          <span style="color: #fe931f; margin-left: 10px"
            >本次结算：¥{{ receivable.total }}-结余实收¥{{ balanceTotal }}</span
          >
        </view>
      </template>
    </esign-footer>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import myUniDatetimePicker from "./uni-datetime-picker/uni-datetime-picker";
import calRent from "@/common/util/cal-rent-money.js";
import esignFooter from "../components/esign-footer.vue";
import parseISO from "date-fns/parseISO";
export default {
  components: {
    textLabelItem,
    labelPhone,
    myUniDatetimePicker,
    esignFooter,
  },
  data() {
    return {
      customDic: {},
      settleInfoDic: {
        machineReceivableList: [],
      },
      receivable: {},
      receipt: {},
      receiptPeriod: {},
      settleTotal: 0,
      itemDict: {},
      downloadTask: null,
      eSignConfig: "",
      businessNo: "",
      showDetial: false,
      date: [],
    };
  },
  onLoad(option) {
    this.$gxfmethod.statisticData(
      this.$eventId.Settle_Administrative,
      "灵活结算",
      "结算单详情"
    );
    this.businessNo = option.businessNo;
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      this.eSignConfig = resData.find((o) => o.code === "esign_start_node");
    }
    uni.$on("esign-start", (obj) => {
      this.loaddata();
    });
    this.loaddata();
  },
  onShow() {
    this.loaddata();
    if (this.$refs.timeline) this.$refs.timeline.init();
  },
  onUnload() {
    if (this.downloadTask) {
      this.downloadTask.abort();
    }
  },
  async onShareAppMessage({ target, from }) {
    if (from === "button" && target.dataset.type == "esign") {
      let url = target.dataset.url;
      let title = target.dataset.title;
      return {
        title,
        imageUrl:
          "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
        path: `/otherPages/esign/webView?url=${encodeURIComponent(url)}&title=${title}`,
      };
    }
  },
  computed: {
    esignParams() {
      return {
        businessState: this.customDic.state,
        flowStatus: this.customDic.flowStatus,
        signFlowId: this.customDic.signFlowId,
        businessType: "settlement",
        contactId: this.settleInfoDic.contactId,
        contactName: this.settleInfoDic.contactName,
        customerId: this.customDic.customerId,
        customerName: this.customDic.customerName,
        businessId: this.customDic.id,
        businessTitle:
          this.customDic.customerName + "-" + this.settleInfoDic.projectName + "结算单",
        businessNo: this.customDic.businessNo,
        contractNo: this.customDic.contractNo,
        // flowId:this.workInDic.flowId,
        customerSalesman: this.customDic.customerSalesman,
        customerSalesmanName: this.customDic.customerSalesmanName,
        customerSalesmanPhoneNum: this.customDic.customerSalesmanPhone,
        customerPhoneNum: this.customDic.customerPhoneNum,
        orgId: this.customDic.orgId,
        phoneNum: this.settleInfoDic.phoneNum,
        customerType: this.settleInfoDic.customerType,
        signFlowTitle: `${this.customDic.customerName}-${this.settleInfoDic.projectName}`,
      };
    },
    isShowEsignTimeline() {
      return this.customDic.signFlow == "1";
    },
    // 设备小计
    contractTotal() {
      if (!this.settleInfoDic.machineReceivableList) return 0;
      let list = this.settleInfoDic.machineReceivableList.filter((o) => o.checked);
      let total = list.reduce((x, y) => x + Number(y.receivableTotal), 0);
      this.settleInfoDic.receivableTotal =
        total +
        Number(this.settleInfoDic.laborCost || 0) +
        Number(this.settleInfoDic.other || 0);
      return this.settleInfoDic.receivableTotal;
    },
    /*结余已收*/
    balanceTotal() {
      let receiptTotal = 0;
      if (this.receipt.total) receiptTotal = Number(this.receipt.total);
      return receiptTotal - Number(this.settleTotal);
    },
    periodTotal() {
      return this.receivable.total - this.receiptPeriod.total;
    },
    // 汇总
    receivableTotal() {
      if (
        !this.receivable ||
        this.receivable.total === undefined ||
        this.receivable.total === null
      ) {
        return 0;
      }
      return Number(this.receivable.total) - Number(this.balanceTotal);
    },
  },
  methods: {
    // 点击查看换车信息
    checkTransfer(machine){
      this.$refs.customToast.showModal({
        title:"换车管理",
        content:`换车后车辆：${machine.contractMachineTransferInfo.licenseIdNew}\n换车日期：${machine.contractMachineTransferInfo.transferDate.split(' ')[0]}`,
        confirmButtonName: undefined,
        cancelButtonName: "知道了",
        confirmButtonStyle: undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm) {
          }  
        },
      });
    },
    showList() {
      this.showDetial = !this.showDetial;
    },
    contractTypeName(type) {
      if (type == "1") {
        return "普";
      } else if (type == "2") {
        return "框";
      } else if (type == "3") {
        return "快";
      }
    },
    drop(index) {
      this.$set(
        this.settleInfoDic.machineReceivableList[index],
        "show",
        !this.settleInfoDic.machineReceivableList[index].show
      );
      this.$forceUpdate();
    },
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      let object = calRent.calculationTenancy(
        row.settlementType,
        row.beginDate,
        row.endDate,
        true
      );
      // row.rentDays = object.days;
      return object.label;
    },
    // 时间显示
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    // 设备小计
    machineTotal(item) {
      console.log(item, "machineTotal");
      item.hireIncrease ? item.hireIncrease : (item.hireIncrease = 0);
      item.carriageIncrease ? item.carriageIncrease : (item.carriageIncrease = 0);
      item.claimTotalIncrease ? item.claimTotalIncrease : (item.claimTotalIncrease = 0);
      item.hireReduce ? item.hireReduce : (item.hireReduce = 0);
      item.carriageReduce ? item.carriageReduce : (item.carriageReduce = 0);
      item.claimTotalReduce ? item.claimTotalReduce : (item.claimTotalReduce = 0);
      let total = 0.0;
      // total =
      //   Number(item.hireTotal) +
      //   Number(item.pauseHireTotal) +
      //   Number(item.claimTotal) +
      //   Number(item.carriage) +
      //   Number(item.hireIncrease) +
      //   Number(item.carriageIncrease) +
      //   Number(item.claimTotalIncrease) -
      //   Number(item.hireReduce) -
      //   Number(item.carriageReduce) -
      //   Number(item.claimTotalReduce);
      let increase =
        Number(item.hireIncrease) +
        Number(item.carriageIncrease) +
        Number(item.claimIncrease);
      let reduce =
        Number(item.hireReduce) + Number(item.carriageReduce) + Number(item.claimReduce);

      var receivableTotal =
        Number(item.hireTotal) +
        Number(item.carriage) +
        increase +
        Number(item.claimTotal) +
        Number(item.pauseHireTotal) -
        reduce;
      return Number(receivableTotal.toFixed(2));
    },
    loaddata() {
      let url = this.$url.SETTLE_DETAIL + this.businessNo;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          console.log(result, "loaddata");
          this.customDic = result;
          this.receivable = result.settleInfoDto.receivable;
          this.settleTotal = result.settleInfoDto.settleTotal;
          this.receipt = result.settleInfoDto.receipt;
          this.receiptPeriod = result.settleInfoDto.receiptPeriod;
          this.date = [result.beginDate, result.endDate];
          result.settleInfoDto.contractReceivableList.forEach((c) => {
            c.machineReceivableList.forEach((m) => {
              m.adjust =
                -Number(m.hireReduce || 0) -
                Number(m.carriageReduce || 0) -
                Number(m.claimReduce || 0) +
                Number(m.hireIncrease || 0) +
                Number(m.carriageIncrease || 0) +
                Number(m.claimIncrease || 0);
              m.receivableTotal = this.machineTotal(m);
              m.checked = true;
              m.show = false;
            });
            c.machineReceivableList.sort((a, b) => {
              parseISO(a.enableDate).getTime() - parseISO(b.enableDate).getTime();
            });
          });
          if (this.customDic.settleInfoDto) {
            if (this.customDic.settleInfoDto.contractReceivableList) {
              this.settleInfoDic = this.customDic.settleInfoDto.contractReceivableList[0];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    goToEsign(type) {
      switch (type) {
        case "start":
          let tenantObj = uni.getStorageSync(this.$savekey.TENANT_DETAIL);
          if (!tenantObj || !tenantObj.esignId) {
            uni.showToast({
              icon: "none",
              title: "当前租户还未开通电签平台，请开通后再配置",
            });
            return;
          }

          let flag = false;
          if (this.customDic.settleInfoDto.settleInfoDic.customerType == 2) {
            if (!!this.customDic.customerPhoneNum) {
              flag = false;
            } else {
              flag = true;
            }
          }
          if (flag && !this.customDic.settleInfoDto.settleInfoDic.phoneNum) {
            uni.showToast({
              icon: "none",
              title: "甲方或乙方手机号没有填写",
            });
            return;
          }
          this.$gxfmethod.statisticData(
            this.$eventId.Esign_Administrative,
            "启动电签",
            "结算单启动电签"
          );
          uni.navigateTo({
            url:
              "/otherPages/esign/esign-start-process?isStart=true&businessType=settlement" +
              "&customerType=" +
              this.customDic.settleInfoDto.settleInfoDic.customerType +
              "&contactId=" +
              (this.customDic.type == "1"
                ? this.customDic.contactId
                  ? this.customDic.contactId
                  : ""
                : this.settleInfoDic.contactId
                ? this.settleInfoDic.contactId
                : "") +
              "&businessTitle=" +
              (this.customDic.customerName + "-" + this.getProjectNames()) +
              "&flowId=" +
              this.customDic.flowId +
              "&customerName=" +
              this.customDic.customerName +
              "&customerId=" +
              this.customDic.customerId +
              "&businessId=" +
              this.customDic.id +
              "&businessNo=" +
              this.customDic.businessNo +
              "&contractNo=" +
              this.customDic.contractNo +
              "&customerSalesman=" +
              this.customDic.customerSalesman +
              "&customerSalesmanName=" +
              this.customDic.customerSalesmanName +
              "&customerSalesmanPhoneNum=" +
              this.customDic.customerSalesmanPhone +
              "&orgId=" +
              this.customDic.orgId +
              "&contactName=" +
              this.customDic.settleInfoDto.settleInfoDic.contactName +
              "&customerPhoneNum=" +
              this.customDic.customerPhoneNum +
              "&phoneNum=" +
              this.customDic.settleInfoDto.settleInfoDic.phoneNum +
              "&signFlowTitle=" +
              `${this.customDic.customerName}` +
              this.getProjectNames(),
          });
          break;
        case "detail":
          let url = this.$url.esignRecordInfo;
          let param = {
            urlType: 1,
          };
          url = url.replace("{id}", this.customDic.signFlowId);
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              uni.navigateTo({
                url: `/otherPages/esign/webView?url=${encodeURIComponent(
                  res
                )}&title=${this.getProjectNames()}`,
              });
            })
            .catch((err) => {});
          break;
        default:
          break;
      }
    },
    getProjectNames() {
      let prosList =
        this.customDic.settleInfoDto &&
        this.customDic.settleInfoDto.contractReceivableList &&
        this.customDic.settleInfoDto.contractReceivableList.length > 0
          ? this.customDic.settleInfoDto.contractReceivableList.map((o) => {
              return o.projectName;
            })
          : null;

      return prosList ? prosList.join(",") : "";
    },
    gotodetail() {
      uni.showLoading();
      if (this.customDic.flowStatus == 2) {
        let url = this.$url.esignRecordFile;
        let param = {
          flowId: this.customDic.signFlowId,
        };
        this.$network
          .getData(url, "GET", param)
          .then((res) => {
            let url = res;
            this.$gxfmethod.downEsignFunc(
              url,
              "GET",
              undefined,
              this.settleInfoDic.customerName + settleInfoDic.projectName
            );
          })
          .catch((err) => {});
      } else {
        this.$network.rentalPag(
          "settlement",
          () => {
            this.downM();
          },
          (msg) => {
            console.log("失败");
            uni.showToast({
              icon: "none",
              title: msg,
            });
          }
        );
      }
    },
    downM() {
      let url =
        this.$url.BASE_URL +
        "settleapi/api/settlement/export?businessNo=" +
        this.customDic.businessNo;
      let name = "结算单-" + this.customDic.customerName + "-";
      let filename = this.$gxfmethod.getFileName(name);
      this.$gxfmethod.downFunc(url, "GET", undefined, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
.settle-adds {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
  height: 100%;
}

.contractHead {
  padding: 14px 0;
  margin-top: 10px;
  background: #ffffff;

  .title {
    font-size: 16px;
    color: #222222;
    font-weight: 600;
    padding-bottom: 18px;
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
    padding: 10px;
    height: 123px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 28rpx;
    color: #8c8c8c;
    font-weight: 400;
    background: #f6f6f6;
    margin: 0 10px;
  }
}

.settle {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 8px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 5px;
  }
}

.detail {
  background-color: #ffffff;
  padding: 14px 10px;

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 16px;
  }

  .body {
    display: grid;
    grid-template-columns: 1fr 0.8fr;
    grid-row-gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #d8d8d8;

    p {
      font-size: 26rpx;
      font-weight: 400;
      color: #8c8c8c;
    }
  }

  .total {
    padding-top: 10px;

    p {
      font-size: 14px;
      font-weight: 500;
      color: #222222;
    }

    p:last-child {
      font-size: 12px;
      margin-top: 8px;
    }
  }
}
.blod {
  font-size: 15px;
  color: #222222;
  font-weight: 600;
  margin-bottom: 8px;
}
.orange {
  font-size: 13px;
  color: #fe931f;
}
.row {
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 22rpx;
}
.row-item {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  p {
    flex-basis: 50%;
    margin-top: 12rpx;
  }
}
.gray {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}
.confluence {
  padding: 10px 10px 0px 10px;
  background-color: #ffffff;

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #d8d8d8;
    padding-bottom: 10px;
    height: 70px;

    .left {
      p {
        font-size: 15px;
        color: #222222;
        font-weight: 600;
      }

      p:last-child {
        font-size: 12px;
        margin-top: 8px;
        color: #fe931f;
      }
    }

    .right {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #8c8c8c;
    }
  }

  .total {
    padding: 30rpx 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 10px;
    color: #222222;
    font-size: 15px;
    font-weight: 600;
  }
}

.machine {
  border: 1px solid #e6e6e6;
  padding: 5px;
  margin: 5px 0;

  .content-view {
    border-bottom: 1px dashed #e6e6e6;
    padding: 8px;
  }

  .info {
    .infoText {
      display: grid;
      grid-template-columns: 1.5fr 1.2fr;
      grid-row-gap: 5px;
    }

    padding: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    border-bottom: 1px dashed #e6e6e6;
  }

  .total {
    display: grid;
    padding: 8px 5px;
    grid-template-columns: 1fr 1fr 0.1fr;
    align-items: center;
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

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  font-size: $uni-font-size-base;
  border-bottom: 1px dotted $uni-line-color;
  background-color: #fff;
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
  margin-left: 10px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  line-height: 16px;
}

.dialog {
  width: 80%;
  height: 60%;
  background-color: #ffffff;
}

.icon-car-right-state-rent {
  margin-left: 5px;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 10px;
  background: #1890ff;
  border-radius: 5px;
}

.icon-car-right-state-wait {
  margin-left: 5px;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 4px;
  background: #f0ad4e;
  border-radius: 5px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
}

.footer-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18rpx;
  padding: 0 14rpx;
}
.mechineC{
  display: inline-block;
  width: 40px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #F08200;
  font-size: 12px;
  border: solid #F08200 1px;
  background-color: rgba(240, 130, 0, 0.20);
  margin-left: 6px;
  border-radius: 2px;
}
.circle {
  display: inline-block;
  width: 48rpx;
  height: 48rpx;
  background: #ffffff;
  border: 1rpx solid #e60000;
  border-radius: 50%;
  line-height: 46rpx;
  text-align: center;
  font-size: 30rpx;
  color: #e60000;
}
.leftcircle {
  margin-right: 26rpx;
}
.disabled {
  border: 1rpx solid #8c8c8c;
  color: #8c8c8c;
}
.number {
  font-size: 26rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
}
.rightcircle {
  margin-left: 26rpx;
}
</style>
