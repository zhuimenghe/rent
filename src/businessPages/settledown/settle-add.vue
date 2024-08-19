<template>
  <view class="settle-add">
    <template
      v-for="(contractReceivableItem, contractReceivableIndex) in contractReceivableList"
    >
      <view v-if="contractReceivableIndex == 0" :key="contractReceivableIndex">
        <!-- 合同 -->
        <view class="contractHead">
          <p class="title">
            <span class="contractType">
              {{ contractTypeName(contractReceivableItem.contractType) }}</span
            >
            {{ contractReceivableItem.customerName }}-{{
              contractReceivableItem.projectName
            }}
          </p>
          <view class="body">
            <p>合同编号：{{ contractReceivableItem.businessNo }}</p>
            <p>区域：{{ contractReceivableItem.orgName }}</p>
            <p>业务负责人：{{ contractReceivableItem.customerSalesmanName }}</p>
            <p style="display: flex; justify-content: space-between; align-items: center">
              客户联系人：{{ contractReceivableItem.contactName }}-{{
                contractReceivableItem.phoneNum
              }}
              <i
                class="iconfont phone-icon icondianhua"
                @click.stop="callPhone(contractReceivableItem.phoneNum)"
              ></i>
            </p>
          </view>
        </view>
        <!-- 本期结算 -->
        <p class="settle">
          <span class="line"></span> 本期结算:
          <span style="margin-left: 5px">{{ JSbusinessNo }}</span>
        </p>

        <!--结算设备  -->
        <view class="detail" v-if="!showDetial">
          <view class="title">
            <p style="color: #222222">
              {{ contractReceivableItem.projectName }}
            </p>
            <p style="color: #e60000" @click="showList">
              展开 <span class="iconfont iconarrow-down"></span>
            </p>
          </view>

          <view class="body">
            <p v-if="contractReceivableItem.monthConfig=='30'">月份计算：30天为一个月</p>
            <p v-else-if="contractReceivableItem.monthConfig=='0'">月份计算：自然月</p>
            <p v-else>月份计算：-</p>
            <p>支付约定：{{ contractReceivableItem.paymentTypeName }}</p>
            <p v-if="contractReceivableItem.paymentType==='2'
              ||contractReceivableItem.paymentType==='3'||contractReceivableItem.paymentType==='4'">
              结算日方式：
              {{ contractReceivableItem.settlementDayTypeName || '-'}}
            </p>
            <p v-if="contractReceivableItem.settlementDayType==='2' || 
              contractReceivableItem.settlementDayType==='6' || contractReceivableItem.settlementDayType==='10'">
              结算日：  
              {{ contractReceivableItem.settlementDay ? contractReceivableItem.settlementDay+'号'  :"-" }}
            </p>
            <p>减免约定：{{ contractReceivableItem.renterTripTypeName }}</p>
            <p>运费计算方式：{{ contractReceivableItem.tripCalType=='1'? '按趟计费':'按台计费' }}</p>
            <p v-if="contractReceivableItem.tripCalType == '1'">单趟运费金额：{{ contractReceivableItem.tripVal }}元</p>
            <p>其他约定：{{ contractReceivableItem.covenants || '--' }}</p>
            <!-- <p>业务负责人：{{ contractReceivableItem.customerSalesmanName }}</p> -->
            <!-- <p>预付：￥{{ money(contractReceivableItem.advance || 0) }}</p> -->
            <!-- <p>开始时间：{{ date[0] && dateSlice(date[0]) }}</p> -->
            <!-- <p>结束时间：{{ date[1] && dateSlice(date[1]) }}</p> -->
            <!-- <p>结算设备数量：{{ contractReceivableItem.machineReceivableList.length }}</p> -->
          </view>

          <view class="total">
            <view style="display: flex;align-items: center;">
              <view>
                合同小计：<span style="color: #e60000">¥{{ allMachineTotal }}</span>
              </view>
              <view v-if="contractReceivableItem.tripCalType=='1'" style="margin-left: 100rpx;">
                运费合计：<span style="color: #e60000">¥{{ (tripTime*contractReceivableItem.tripVal).toFixed(2) }}</span>
              </view>
            </view>
            
            <p style="color: #fe931f">注:合同抵扣金额不计算到对账（结算）汇总</p>
          </view>
        </view>

        <!--结算设备 展开 -->
        <view class="detail" v-if="showDetial">
          <view class="title">
            <p style="color: #222222">
              {{ contractReceivableItem.projectName }}
            </p>
            <p style="color: #e60000" @click="showList">
              收起 <span class="iconfont iconarrow-up"></span>
            </p>
          </view>

          <view class="body">
            <p v-if="contractReceivableItem.monthConfig=='30'">月份计算：30天为一个月</p>
            <p v-else-if="contractReceivableItem.monthConfig=='0'">月份计算：自然月</p>
            <p v-else>月份计算：-</p>
            <p>支付约定：{{ contractReceivableItem.paymentTypeName }}</p>
            <p v-if="contractReceivableItem.paymentType==='2'
              ||contractReceivableItem.paymentType==='3'||contractReceivableItem.paymentType==='4'">
              结算日方式：
              {{ contractReceivableItem.settlementDayTypeName || '-'}}
            </p>
            <p v-if="contractReceivableItem.settlementDayType==='2' || 
              contractReceivableItem.settlementDayType==='6' || contractReceivableItem.settlementDayType==='10'">
              结算日：  
              {{ contractReceivableItem.settlementDay ? contractReceivableItem.settlementDay+'号'  :"-" }}
            </p>
            <p>减免约定：{{ contractReceivableItem.renterTripTypeName }}</p>
            <p>运费计算方式：{{ contractReceivableItem.tripCalType=='1'? '按趟计费':'按台计费' }}</p>
            <p v-if="contractReceivableItem.tripCalType == '1'">单趟运费金额：{{ contractReceivableItem.tripVal }}元</p>
            <p>其他约定：{{ contractReceivableItem.covenants || '--' }}</p>
            <!-- <p>业务负责人：{{ contractReceivableItem.customerSalesmanName }}</p> -->
            <!-- <p>预付：￥{{ money(contractReceivableItem.advance || 0) }}</p> -->
          </view>
          <view class="form">
            <view class="cell-input-view">
              <view class="cell-input-view-left">
                <text>结算时间</text>
              </view>
              <view class="cell-input-view-right">
                <myUniDatetimePicker
                  v-model="date"
                  type="daterange"
                  @maskClick="maskClick"
                  :clear-icon="false"
                  @change="dateChange"
                />
              </view>
            </view>
            <view v-if="contractReceivableItem.tripCalType=='1'" class="cell-input-view">
              <view class="cell-input-view-left">
                <text>运输趟数</text>
              </view>
              <view class="cell-input-view-right" style="justify-content: flex-end;">
                <view style="display: flex; align-items: center">
                  <text
                    class="circle leftcircle"
                    :class="[
                      tripTime <=0 ? 'disabled' : '',
                    ]"
                    @click="numClick('-', contractReceivableItem)"
                    >-</text
                  >
                  <text class="number">{{ tripTime || 0 }}</text>
                  <text
                    class="circle rightcircle"
                    @click="numClick('+', contractReceivableItem)"
                    >+</text
                  >
                </view>
              </view>
            </view>
          </view>
          <p class="settle"><span class="line"></span> 本期结算设备</p>
          <view
            class="machine"
            v-for="(item, index) in contractReceivableItem.machineReceivableList"
            :key="index"
          >
            <view class="content-view" @click="changeCheck(index)">
              <mycheckbox class="checkbox" :checked="item.checked" color="#E60000" />
              <view class="titleInfo">
                <p style="font-size: 16px; color: #222222; font-weight: 600;">
                  {{ item.licenseId }} ({{ item.printCode ? item.printCode : "-" }})
                  <span
                    :class="
                      item.state == 1
                        ? 'icon-car-right-state-rent'
                        : 'icon-car-right-state-wait'
                    "
                    >{{ item.stateName ? item.stateName : "" }}
                    <text style="margin-left: 5px; margin-right: 5px"></text>
                    {{ item.subStateName ? "|" + item.subStateName : "" }}
                  </span>
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
                  <p v-if="item.settlementType == '1'">日租金：¥{{ money(item.hire) }}</p>
                  <p v-if="item.settlementType == '2' || item.settlementType == '3'">
                    月租金：¥{{ money(item.hire) }}
                  </p>
                  <p v-if="item.settlementType == '5'">周租金：¥{{ money(item.hire) }}</p>
                  <p v-if="item.settlementType == '4' || item.settlementType == '6'">
                    日租金/月租金：¥{{ money(item.hire) }}/¥{{ money(item.hireMonthly) }}
                  </p>
                  <p>报停总价：¥{{ money(item.pauseHireTotal) }}</p>
                  <p v-if="contractReceivableItem.tripCalType!='1'">
                    运费：¥{{ money(item.carriage) }}
                  </p>
                  <p>押金：¥{{ money(item.pledge) }}</p>
                  <p>索赔：¥{{ money(item.claimTotal) }}</p>
                  <p>核算调整：{{ item.account ? money(item.account) : 0 }}</p>
                </view>
              </view>
            </view>
            <view class="total">
              <p>
                设备小计：
                <span style="color: #e60000">¥{{ machineTotal(item, index) }}</span>
              </p>
              <span style="color: #e60000" @click="drop(index)" v-if="!item.show">
                查看详情 <span class="iconfont iconarrow-down"></span>
              </span>
              <span style="color: #e60000" @click="drop(index)" v-else>
                收起 <span class="iconfont iconarrow-up"></span>
              </span>
              <span
                class="iconfont iconzl--bianji"
                style="color: #e60000; text-align: center"
                @click="gotoDetial(item, index,contractReceivableItem.tripCalType)"
              ></span>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left">
              <text>抵扣</text>
            </view>
            <view class="cell-input-view-right">
              <view class="input-style" style="color: #8c8c8c" @click="open">
                {{ money(deduction) }}></view
              >
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left">
              <text>人工费</text>
            </view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="digit"
                v-model="contractReceivableItem.laborCost"
                placeholder="0"
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left">
              <text>其他费用</text>
            </view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="digit"
                v-model="contractReceivableItem.other"
                placeholder="0"
              />
            </view>
          </view>
          <view class="total">
            <view style="display: flex;align-items: center;">
              <view>
                合同小计：<span style="color: #e60000">¥{{ allMachineTotal }}</span>
              </view>
              <view v-if="contractReceivableItem.tripCalType=='1'" style="margin-left: 100rpx;">
                运费合计：<span style="color: #e60000">¥{{ (tripTime*contractReceivableItem.tripVal).toFixed(2) }}</span>
              </view>
            </view>
            <p style="color: #fe931f">注:合同抵扣金额不计算到对账（结算）汇总</p>
          </view>
        </view>

        <!-- 结算汇总 -->
        <view class="flex">
          <p class="settle"><span class="line"></span> 结算汇总</p>
          <p style="font-size: 14px; color: #e60000" @click="gotoCollection()">
            选择收退款单
          </p>
        </view>

        <view class="confluence">
          <view class="row">
            <view class="left">
              <p class="blod">当期结算营收：¥{{ contractTotal }}</p>
              <p class="orange">注:以本次结算数据计算为准</p>
            </view>
            <view class="gray row-item">
              <p>运费：¥{{ receivableCarriageTotal }}</p>
              <p>租金：¥{{ receivableHireTotal }}</p>
              <p>索赔：¥{{ receivableClaimTotal }}</p>
              <p>其他：¥{{ receivableLaborCostTotal }}</p>
            </view>
          </view>
          <view class="row" style="padding-top: 10px">
            <view class="left">
              <p class="blod">结余实收：¥{{ balanceTotal }}</p>
              <p class="orange">注:结余实收=全部已收-已结算</p>
            </view>
            <view class="gray row-item">
              <p>全部实收：¥{{ money(receipt.total || 0) }}</p>
              <p>已结算营收：¥{{ money(settleTotal) }}</p>
              <p>本次抵扣：¥{{ money(deduction) }}</p>
            </view>
          </view>
          <view class="total">
            <p>当期收款：¥{{ money(receiptPeriod.total || 0) }}</p>
            <p>当期应收：¥{{ money(periodTotal) }}</p>
            <p>上期应收：¥{{ money(receivableTotal - periodTotal) }}</p>
          </view>
          <view :class="[isIPhoneX() ? 'h105' : 'h80']"></view>
        </view>

        <!-- button -->
        <view class="flow">
          <view class="total">
            <span
              >汇总： <span style="color: #e60000">¥{{ receivableTotal }}</span>
            </span>
            <span style="color: #fe931f; margin-left: 10px"
              >本次结算：¥{{ money(receivable.total) }}-结余实收¥{{ balanceTotal }}</span
            >
          </view>
          <view :class="['button', isIPhoneX() ? 'pb80' : '']">
            <view
              class="btn"
              style="background-color: #d8d8d8"
              @click="btnClick('cancel')"
            >
              取消</view
            >
            <view
              class="btn"
              style="background-color: #fe931f"
              @click="btnClick('preview')"
            >
              预览</view
            >
            <view class="btn" style="background-color: #e60000" @click="btnClick('save')">
              生成结算单</view
            >
          </view>
        </view>
      </view>
    </template>
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <alertPopup ref="aletrview" @getAssignList="getAssignList" :mask-click="true" />
    <!-- 抵扣 -->
    <view class="pop-container">
      <uni-popup
        ref="popup"
        type="center"
        :mask-click="false"
        v-if="contractReceivableList && contractReceivableList.length > 0"
      >
        <view class="uni-tip">
          <view class="tip-title"><text>抵扣</text></view>
          <view class="tip-title" style="font-size: 14px; font-weight: 400">
            <p>剩余押金：¥{{ money(surplusReceiptDeposit) }}</p>
            <p style="margin-left: 40px">
              剩余运费：¥{{ money(surplusReceiptCarriage) }}
            </p>
          </view>
          <view class="dialogForm">
            <span></span>
            <p>押金抵扣</p>
            <p>运费减免</p>
            <p>租金</p>
            <input
              type="digit"
              v-model="contractReceivableList[0].pledgeHire"
              placeholder="0"
            />
            <input
              type="digit"
              v-model="contractReceivableList[0].carriageHire"
              placeholder="0"
            />
            <p>运费</p>
            <input
              type="digit"
              v-model="contractReceivableList[0].pledgeCarriage"
              placeholder="0"
            />
            <p>-</p>
            <p>索赔</p>
            <input
              type="digit"
              v-model="contractReceivableList[0].pledgeClaim"
              placeholder="0"
            />
            <input
              type="digit"
              v-model="contractReceivableList[0].carriageClaim"
              placeholder="0"
            />
          </view>

          <view class="alert-cell">
            <view class="alert-btn-left" @click="clickBtn('cancle')"
              ><text>取消</text></view
            >
            <view class="alert-btn-right" @click="clickBtn('ok')"><text>保存</text></view>
          </view>
        </view>
      </uni-popup>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import myUniDatetimePicker from "./uni-datetime-picker/uni-datetime-picker";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import parseISO from "date-fns/parseISO";
import calRent from "@/common/util/cal-rent-money.js";
import { getType } from "@/common/util/compare-obj.js";
import settleMixin from "./settleMixin/index";
import alertPopup from "@/components/common/uni-popup/alert-pop.vue";
export default {
  components: {
    selectorPick,
    wPicker,
    alertPopup,
    myUniDatetimePicker,
  },
  mixins: [settleMixin],
  data() {
    return {
      receiptPeriod: {},
      JSbusinessNo: "",
      settleForm: {
        allocationTime: "",
      },
      isdraft: false,
      isPreview: false,
      previewId: "",
      isFirst: true,
      businessNo: "", //修改页面传过来的值 已生成结算单的businessNo
      tripTime:0
    };
  },
  async onLoad(options) {
    try{
      if (!!options.businessNo) {
        await this.getDraftDetail(options.businessNo);
        this.businessNo = options.businessNo;
        this.JSbusinessNo = options.businessNo;
        this.tripTime = this.formInfo.tripNum;
      } else {
        //新增结算
        this.contractId = options.contracts;
        this.customerId = options.customerId.trim();
        this.getDetail();
        this.getJSbusinessNo();
      }
    }catch(e){console.log(e,'e')}
  },
  onShow() {
    uni.$on("derterminCollection", (v) => {
      console.log(v, "derterminCollection");
      let collectionData = v.collectionData;
      let refundData = v.refundData;
      this.formInfo = {
        ...this.formInfo,
        proceedsNo:
          collectionData.collectionCount > 0 ? [...collectionData.proceedsNo] : [],
        refundNo: refundData.refundCount > 0 ? [...refundData.refundNo] : [],
        settleInfoDto: {
          ...this.formInfo.settleInfoDto,
          receiptPeriod: {
            ...this.formInfo.settleInfoDto.receiptPeriod,
            total:
              (collectionData.collectionCount ? collectionData.collectionCount : 0) -
              (refundData.refundCount ? refundData.refundCount : 0),
          },
        },
      };
      this.$set(
        this.receiptPeriod,
        "total",
        (collectionData.collectionCount ? collectionData.collectionCount : 0) -
          (refundData.refundCount ? refundData.refundCount : 0)
      );
      // 如果有选中的数据
      if (collectionData.collectionCount > 0) {
        //有选中的收款单
        this.proceedsNo = this.formInfo.proceedsNo;
      } else {
        this.proceedsNo = [];
      }
      if (refundData.refundCount > 0) {
        this.refundNo = this.formInfo.refundNo;
      } else {
        this.refundNo = [];
      }
    });
  },

  methods: {
    // 修改趟数
    numClick(type,item){
      if(type=='-' && this.tripTime>0){
        this.tripTime--
      }else if(type=='+'){
        this.tripTime++
      }
    },
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
    // 获取详情
    getDetail() {
      uni.showLoading();
      let param = {
        contractNoList: [this.contractId],
        customerId: this.customerId,
        type: "2",
      };
      this.$network
        .getData(this.$url.CONTRACT_DETAIL_GETSETTLEMENTDATA, "POST", param)
        .then((res) => {
          uni.hideLoading();
          this.setFormInfo(res);
          this.$nextTick(()=>{
            this.tripTime = this.formInfo.settleInfoDto.contractReceivableList[0].tripNumLeft;
          })
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    //  获取js编号
    getJSbusinessNo() {
      this.$network
        .getData(this.$url.SETTLEBUSINESS_CODE, "GET", { prefix: "JS" })
        .then((res) => {
          this.JSbusinessNo = res;
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    // 获取本期结算
    getPeriodReceipt(date) {
      let param = {
        contractNoList: [this.contractId],
        customerId: this.customerId,
        beginDate: date[0],
        endDate: date[1],
      };
      this.$network
        .getData(this.$url.SETTLEMENT_GETPERIODRECEIPT, "POST", param)
        .then((r) => {
          this.formInfo.settleInfoDto.receiptPeriod = r || {};
          this.receiptPeriod = {
            ...r,
            total: this.businessNo ? this.formInfo.settleInfoDto.receiptPeriod.total : 0,
          };
          this.formInfo.proceedsNo = this.formInfo.proceedsNo || [];
          this.formInfo.refundNo = this.formInfo.refundNo || [];
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    // 抵扣
    rowPledge() {
      let row = this.contractReceivableList[0];
      let pledgeHire = row.pledgeHire ? Number(row.pledgeHire) : 0;
      let pledgeCarriage = row.pledgeCarriage ? Number(row.pledgeCarriage) : 0;
      let pledgeClaim = row.pledgeClaim ? Number(row.pledgeClaim) : 0;
      let carriageHire = row.carriageHire ? Number(row.carriageHire) : 0;
      let carriageClaim = row.carriageClaim ? Number(row.carriageClaim) : 0;
      this.contractReceivableList[0].deduct =
        pledgeHire + pledgeCarriage + pledgeClaim + carriageHire + carriageClaim || 0;
      return this.contractReceivableList[0].deduct;
    },
    // 判断是否能结算
    isNextSettlement() {
      for (
        let j = 0;
        j < this.contractReceivableList[0].machineReceivableList.length;
        j++
      ) {
        let obj = this.contractReceivableList[0].machineReceivableList[j];
        if (obj.checked) {
          let lastSettleDate = null;
          if (obj.lastSettleDate) {
            lastSettleDate = parseISO(obj.lastSettleDate).getTime();
          }

          if (obj.lastApplySettleDate) {
            let lastApplySettleDate = parseISO(obj.lastApplySettleDate).getTime();
            lastSettleDate =
              lastApplySettleDate > lastSettleDate ? lastApplySettleDate : lastSettleDate;
          }

          let beginDate = parseISO(obj.beginDate).getTime();
          let endDate = parseISO(obj.endDate).getTime();
          let isLastSettleDate = lastSettleDate ? true : false;

          if (
            isLastSettleDate &&
            (lastSettleDate > beginDate || lastSettleDate > endDate)
          ) {
            uni.showToast({
              icon: "none",
              title: "车辆本次结算周期必须大于上一个结算日期",
            });
            return false;
          }
        }
      }
      return true;
    },

    btnClick(type) {
      if (type == "save") {
        this.isdraft = false;
        if (!this.isNextSettlement()) return;
        this.submit("save");
      } else if (type == "draft") {
        this.isdraft = true;
        if (!this.isNextSettlement()) return;
        this.submit("draft");
      } else if (type == "preview") {
        this.isdraft = true;
        this.isPreview = true;
        if (!this.isNextSettlement()) return;
        this.submit("preview");
      } else if (type == "cancel") {
        uni.navigateBack({
          detail: 1,
        });
      }
    },
    submit(type) {
      let checkMachines = [];

      let contractReceivableList = this.contractReceivableList.map((o) => {
        return {
          ...o,
          machineReceivableList: o.machineReceivableList.filter((o) => o.checked),
        };
      });
      contractReceivableList = contractReceivableList.filter(
        (o) => o.machineReceivableList.length > 0
      );

      this.formInfo.settleInfoDto.receivable = this.receivable;
      let form = {
        ...this.formInfo,
        tripNum: this.tripTime,
        settleInfoDto: {
          ...this.formInfo.settleInfoDto,
          contractReceivableList: contractReceivableList.map((item) => {
            let machines = item.machineReceivableList ? item.machineReceivableList : [];
            checkMachines = [
              ...checkMachines,
              ...machines.map((machine) => {
                return {
                  beginDate: machine.beginDate,
                  endDate: machine.endDate,
                  licenseId: machine.licenseId,
                };
              }),
            ];

            return {
              ...item,
            };
          }),
        },
      };
      if (type == "preview") {
        this.preview();
        return;
      }
      form.settleInfoDto.receivable.beginDate = form.beginDate + " 00:00:00";
      form.settleInfoDto.receivable.endDate = form.endDate + " 23:59:59";
      this.formInfo = form;
      this.$network
        .getData(this.$url.SETTLEMENT_MACHINECHECK, "POST", checkMachines)
        .then((res) => {
          uni.hideLoading();
          if (getType(res) === "Array" && res.length === 0) {
            if (type == "save") {
              this.httprequestData();
            } else if (type == "draft") {
              this.submitSettlement("");
            }
          } else {
            let list = res ? res.map((o) => o.licenseId) : [];
            uni.showToast({
              icon: "none",
              title: `设备【${list.join(",")}】结算时间存在冲突，请调整...`,
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 审批
    httprequestData() {
      uni.showLoading({
        mask: true,
      });
      this.workflowcommon.iswf("settlement").then((iswf) => {
        if (iswf) {
          this.workflowcommon
            .getFirstNodeUser(
              "settleapi",
              "settlement",
              this.formInfo.orgId,
              this.formInfo.customerSalesman
            )
            .then((showToast) => {
              if (showToast) {
                this.$refs.aletrview.open();
                uni.hideLoading();
              } else {
                let assnstr = this.workflowcommon.submitData(false, []);
                console.log(assnstr, "assnstr");
                this.submitSettlement(assnstr);
              }
            })
            .catch((error) => {
              uni.showToast({
                title: error.message,
                icon: "none",
              });
            });
        } else {
          this.submitSettlement("");
        }
      });
    },

    //弹窗提示返回
    getAssignList(val) {
      let alist = val.selectArr;
      let assnstr = this.workflowcommon.submitData(true, alist);
      this.submitSettlement(assnstr);
    },
    // 新增结算
    submitSettlement(assnstr) {
      uni.showLoading({
        mask: true,
      });
      let statementId = this.formInfo.id || null;

      let param = {
        ...this.formInfo,
        type: "2",
        generateStatement: false,
        generateSettle: false,
        statementId: statementId,
        businessNo: this.JSbusinessNo,
        proceedsNo: this.proceedsNo ? this.proceedsNo : [],
        refundNo: this.refundNo ? this.refundNo : [],
        settleInfoDto: {
          ...this.formInfo.settleInfoDto,
          receiptPeriod: {
            ...this.formInfo.settleInfoDto.receiptPeriod,
            total:
              this.proceedsNo &&
              this.proceedsNo.length == 0 &&
              this.refundNo &&
              this.refundNo.length == 0
                ? 0
                : this.formInfo.settleInfoDto.receiptPeriod.total,
          },
        },
      };

      let url =
        this.$url.SETTLEMENT_SETTLEMENT +
        `?draft=${this.isdraft}${!!assnstr ? "&" + assnstr : ""}`;
      console.log(param, "param1111");
      this.$network
        .getData(url, "POST", param, { disableAbandonDictionary: true })
        .then((result) => {
          this.isLoading = false;
          uni.hideLoading();
          uni.$emit("refresh-contract-list", {
            type: "refund",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.navigateBack({
            animationDuration: 200,
          });
        })
        .catch((err) => {
          this.isLoading = false;
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.message,
          });
        });
    },
    preview() {
      let vm = this;
      uni.showLoading();
      let statementId = this.formInfo.id || null;
      let param = {
        ...this.formInfo,
        type: "2",
        generateStatement: false,
        generateSettle: false,
        statementId: statementId,
        businessNo: this.JSbusinessNo,
        id: this.previewId || null,
        customerSalesmanName: vm.contractReceivableList[0].customerSalesmanName || "",
      };
      let filename = this.$gxfmethod.getFileNameDoc("结算", ".xlsx");
      this.$gxfmethod.downFunc(
        "settleapi/api/settlement/export/v2",
        "POST",
        param,
        filename
      );
    },
    pledge(val) {},
    // 展示换车信息
    showChange(){}
  },
};
</script>

<style lang="scss" scoped>
@import "./style/index.scss";
.flow{
  z-index:3;
}
</style>
