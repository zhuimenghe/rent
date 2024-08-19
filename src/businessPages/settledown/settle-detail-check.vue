<template>
  <view class="creat-invoice-bg">
    <c-nav-bar-apply :business-key="customDic.businessKey">结算单审批</c-nav-bar-apply>
    <approve-step
      :updateObj="customDic"
      :NeedUpdate="true"
      :itemData="itemData"
      @data-form="dataForm"
      :businessOwner="customDic.customerSalesman"
    >
      <view class="settle-add">
        <!-- 合同 -->
        <view class="contractHead">
          <p class="title">
            <span class="contractType">{{
              contractTypeName(
                contractReceivableList[0] && contractReceivableList[0].contractType
              )
            }}</span>
            {{ contractReceivableList[0] && contractReceivableList[0].customerName }}-{{
              contractReceivableList[0] && contractReceivableList[0].projectName
            }}
          </p>
          <view class="body">
            <p>
              合同编号：{{
                (contractReceivableList[0] && contractReceivableList[0].businessNo) || "-"
              }}
            </p>
            <p>
              区域：{{
                (contractReceivableList[0] && contractReceivableList[0].orgName) || "-"
              }}
            </p>
            <p>
              业务负责人：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].customerSalesmanName) ||
                "-"
              }}
            </p>
            <p style="display: flex; justify-content: space-between; align-items: center">
              客户联系人：{{
                contractReceivableList[0] && contractReceivableList[0].contactName
              }}-{{ contractReceivableList[0] && contractReceivableList[0].phoneNum }}
              <i
                class="iconfont phone-icon icondianhua"
                @click.stop="
                  callPhone(
                    contractReceivableList[0] && contractReceivableList[0].phoneNum
                  )
                "
              ></i>
            </p>
          </view>
        </view>
        <!-- 本期结算 -->
        <p class="settle">
          <span class="line"></span> 本期结算:
          <span style="margin-left: 5px">{{ customDic.businessNo || "" }}</span>
        </p>

        <!--结算设备  -->
        <view class="detail" v-if="!showDetial">
          <view class="title" @click="showList">
            <p style="color: #222222">
              {{
                (contractReceivableList[0] && contractReceivableList[0].projectName) ||
                "-"
              }}
            </p>
            <p style="color: #e60000">
              展开 <span class="iconfont iconarrow-down"></span>
            </p>
          </view>
          <view class="body">
            <p v-if="contractReceivableList[0].monthConfig=='30'">月份计算：30天为一个月</p>
            <p v-else-if="contractReceivableList[0].monthConfig=='0'">月份计算：自然月</p>
            <p v-else>月份计算：-</p>
            <p>
              支付约定：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].paymentTypeName) ||
                "-"
              }}
            </p>
            <p v-if="contractReceivableList[0].paymentType==='2'
              ||contractReceivableList[0].paymentType==='3'||contractReceivableList[0].paymentType==='4'">
              结算日方式：
              {{ contractReceivableList[0].settlementDayTypeName || '-'}}
            </p>
            <p v-if="contractReceivableList[0].settlementDayType==='2' || 
              contractReceivableList[0].settlementDayType==='6' || contractReceivableList[0].settlementDayType==='10'">
              结算日：  
              {{ contractReceivableList[0].settlementDay ? contractReceivableList[0].settlementDay+'号'  :"-" }}
            </p>
            <p>
              减免约定：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].renterTripTypeName) ||
                "-"
              }}
            </p>
            <p>运费计算方式：{{ contractReceivableList[0].tripCalType=='1'? '按趟计费':'按台计费' }}</p>
            <p v-if="contractReceivableList[0] && contractReceivableList[0].tripCalType == '1'">单趟运费金额：{{ contractReceivableList[0].tripVal }}元</p>
            <p>其他约定：{{ contractReceivableList[0].covenants || '--' }}</p>
            <!-- <p>
              业务负责人：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].customerSalesmanName) ||
                "-"
              }}
            </p> -->
            <!-- <p>
              预付：￥{{
                money(
                  (contractReceivableList[0] && contractReceivableList[0].advance) || 0
                )
              }}
            </p>
            <p>开始时间：{{ date[0] && dateSlice(date[0]) }}</p>
            <p>结束时间：{{ date[1] && dateSlice(date[1]) }}</p>
            <p>
              结算设备数量：{{
                contractReceivableList[0] &&
                contractReceivableList[0].machineReceivableList.length
              }}
            </p> -->
          </view>
          <view class="total">
            <view style="display: flex;align-items: center;">
              <view>
              合同小计：<span style="color: #e60000">¥{{ allMachineTotal }}</span>
              </view>
              <view v-if="contractReceivableList[0] && contractReceivableList[0].tripCalType=='1'" style="margin-left: 100rpx;">
                运费合计：<span style="color: #e60000">¥{{ (tripTime*contractReceivableList[0].tripVal).toFixed(2) }}</span>
              </view>
            </view>
            <p style="color: #fe931f">注:合同抵扣金额不计算到对账（结算）汇总</p>
          </view>
        </view>

        <!--结算设备 展开 -->
        <view class="detail" v-if="showDetial">
          <view class="title" @click="showList">
            <p style="color: #222222">
              {{ contractReceivableList[0].projectName }}
            </p>
            <p style="color: #e60000">收起 <span class="iconfont iconarrow-up"></span></p>
          </view>
          <view class="body">
            <p v-if="contractReceivableList[0].monthConfig=='30'">月份计算：30天为一个月</p>
            <p v-else-if="contractReceivableList[0].monthConfig=='0'">月份计算：自然月</p>
            <p v-else>月份计算：-</p>
            <p>
              支付约定：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].paymentTypeName) ||
                "-"
              }}
            </p>
            <p v-if="contractReceivableList[0].paymentType==='2'
              ||contractReceivableList[0].paymentType==='3'||contractReceivableList[0].paymentType==='4'">
              结算日方式：
              {{ contractReceivableList[0].settlementDayTypeName || '-'}}
            </p>
            <p v-if="contractReceivableList[0].settlementDayType==='2' || 
              contractReceivableList[0].settlementDayType==='6' || contractReceivableList[0].settlementDayType==='10'">
              结算日：  
              {{ contractReceivableList[0].settlementDay ? contractReceivableList[0].settlementDay+'号'  :"-" }}
            </p>
            <p>
              减免约定：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].renterTripTypeName) ||
                "-"
              }}
            </p>
            <p>运费计算方式：{{ contractReceivableList[0].tripCalType=='1'? '按趟计费':'按台计费' }}</p>
            <p v-if="contractReceivableList[0] && contractReceivableList[0].tripCalType == '1'">单趟运费金额：{{ contractReceivableList[0].tripVal }}元</p>
            <p>其他约定：{{ contractReceivableList[0].covenants || '--' }}</p>
            <!-- <p>
              业务负责人：{{
                (contractReceivableList[0] &&
                  contractReceivableList[0].customerSalesmanName) ||
                "-"
              }}
            </p>
            <p>
              预付：￥{{
                money(
                  (contractReceivableList[0] && contractReceivableList[0].advance) || 0
                )
              }}
            </p> -->
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
                  @maskClick="maskClick"
                  :clear-icon="false"
                  @change="dateChange"
                />
              </view>
            </view>
            <view v-if="contractReceivableList[0] && contractReceivableList[0].tripCalType=='1'" class="cell-input-view">
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
                    @click="numClick('-', contractReceivableList[0])"
                    >-</text
                  >
                  <text class="number">{{ tripTime || 0 }}</text>
                  <text
                    class="circle rightcircle"
                    @click="numClick('+', contractReceivableList[0])"
                    >+</text
                  >
                </view>
              </view>
            </view>
          </view>

          <p class="settle"><span class="line"></span> 本期结算设备</p>
          <view
            class="machine"
            v-for="(item, index) in contractReceivableList[0].machineReceivableList"
            :key="index"
          >
            <view class="content-view" @click="changeCheck(index)">
              <mycheckbox class="checkbox" :checked="item.checked" color="#E60000" />
              <view class="titleInfo">
                <p style="font-size: 16px; color: #222222; font-weight: 600">
                  {{ item.licenseId }} ({{ item.printCode ? item.printCode : "-" }})
                  <span
                    v-if="item.subStateName"
                    :class="
                      item.state == 1
                        ? 'icon-car-right-state-rent'
                        : 'icon-car-right-state-wait'
                    "
                    >{{ item.stateName ? item.stateName : "" }}
                    <text style="margin-left: 5px; margin-right: 5px"></text
                    >{{ item.subStateName ? "|" + item.subStateName : "" }}</span
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
              <view>
                <p style="margin: 5px 0">
                  结算周期：{{ dateSlice(item.beginDate) }}~{{ dateSlice(item.endDate) }}
                </p>
                <view class="infoText">
                  <p>租期：{{ getTenancyFn(item) }}</p>
                  <p>报停：{{ item.pauseDays }}天</p>
                  <p>实算天数：{{ item.rentDays }}天</p>
                  <p>租赁约定：{{ item.originSettlementTypeName }}</p>
                  <p v-if="item.settlementType == '1'">日租金：¥{{ (item.hire) }}</p>
                  <p v-if="item.settlementType == '2' || item.settlementType == '3'">
                    月租金：¥{{ money(item.hire) }}
                  </p>
                  <p v-if="item.settlementType == '5'">周租金：¥{{ money(item.hire) }}</p>
                  <p v-if="item.settlementType == '4' || item.settlementType == '6'">
                    日租金/月租金：¥{{ money(item.hire) }}/¥{{ money(item.hireMonthly) }}
                  </p>
                  <p>报停总价：¥{{ money(item.pauseHireTotal) }}</p>
                  <p v-if="contractReceivableList[0].tripCalType!='1'">
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
                @click="gotoDetial(item, index,contractReceivableList[0].tripCalType)"
              ></span>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left">
              <text>抵扣</text>
            </view>
            <view class="cell-input-view-right">
              <view class="input-style" style="color: #8c8c8c" @click="open">
                {{ money(deduction) || "0.00" }}></view
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
                v-model="contractReceivableList[0].laborCost"
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
                v-model="contractReceivableList[0].other"
                placeholder="0"
              />
            </view>
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
          <view class="total row">
            <p>当期收款：¥{{ money(receiptPeriod.total || 0) }}</p>
            <p>当期应收：¥{{ money(periodTotal) }}</p>
            <p>上期应收：¥{{ money(receivableTotal - periodTotal) }}</p>
          </view>
          <view class="total pb20">
            <p>
              <span
                >汇总： <span style="color: #e60000">¥{{ receivableTotal }}</span>
              </span>
            </p>
            <p>本次结算：¥{{ money(receivable.total) }}</p>
            <p>结余实收¥{{ balanceTotal }}</p>
          </view>
        </view>

        <!-- button -->
        <view class="flow" :class="['button', isIPhoneX() ? 'pb80' : '']">
          <view class="total">
            <span>
              <span style="color: #e60000">¥{{ receivableTotal }}</span>
            </span>
            <span style="color: #fe931f; margin-left: 10px"
              >本次结算：¥{{ money(receivable.total) }}</span
            >
            <span style="color: #fe931f; margin-left: 10px"
              >结余实收¥{{ balanceTotal }}</span
            >
          </view>
        </view>

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
          <uni-popup ref="popup" type="center" :mask-click="false">
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
                <view class="alert-btn-right" @click="clickBtn('ok')"
                  ><text>保存</text></view
                >
              </view>
            </view>
          </uni-popup>
        </view>
      </view>
    </approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import alertPopup from "@/components/common/uni-popup/alert-pop.vue";
import myUniDatetimePicker from "./uni-datetime-picker/uni-datetime-picker";
import settleMixin from "./settleMixin/index";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
export default {
  components: {
    textLabelItem,
    approveStep,
    labelPhone,
    alertPopup,
    myUniDatetimePicker,
  },
  mixins: [settleMixin],
  data() {
    return {
      settleInfoDic: {},
      itemData: {},
      downloadTask: null,
      updateObj: {}, //需要更新的信息 都保存在这个对象里面
      tripTime:0
    };
  },
  async onLoad(option) {
    try{
      this.itemData = JSON.parse(decodeURIComponent(option.item));
      await this.getDraftDetail(this.itemData.businessNo);
      this.isApproval = true;
      this.tripTime = this.formInfo.tripNum;
    }catch(e){console.log(e,'e')}
  },
  onUnload() {
    if (this.downloadTask) {
      this.downloadTask.abort();
    }
  },
  methods: {
    // 修改趟数
    numClick(type,item){
      if(type=='-' && this.tripTime>0){
        this.tripTime--
        this.customDic.tripNum = this.tripTime
      }else if(type=='+'){
        this.tripTime++;
        this.customDic.tripNum = this.tripTime
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
    changestr(str) {
      if (!str) {
        return "--";
      }
      return str.split(" ")[0];
    },
    dataForm(val) {
      this.customDic = JSON.parse(val);
      if (this.customDic.settleInfoDto) {
        if (this.customDic.settleInfoDto.contractReceivableList) {
          this.settleInfoDic = this.customDic.settleInfoDto.contractReceivableList[0];
        }
      }
    },
    gotodetail() {
      uni.showLoading();
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
    },
    downM() {
      console.log(this.$url.BASE_URL);
      let url =
        this.$url.BASE_URL +
        "settleapi/api/settlement/export?businessNo=" +
        this.customDic.businessNo;
      let name = "结算单-" + this.customDic.customerName + "-";
      let filename = this.$gxfmethod.getFileName(name);
      this.$gxfmethod.downFunc(url, "GET", undefined, filename);
    },
    checkData() {
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

      this.customDic.settleInfoDto.receivable = this.receivable;
      let form = {
        ...this.customDic,
        settleInfoDto: {
          ...this.customDic.settleInfoDto,
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
      form.settleInfoDto.receivable.beginDate = form.beginDate + " 00:00:00";
      form.settleInfoDto.receivable.endDate = form.endDate + " 23:59:59";
      this.customDic = form;
      if (checkMachines.length <= 0) {
        uni.showToast({
          title: "请提供设备信息",
          icon: "none",
        });
        return Promise.reject("fail");
      } else {
        return Promise.resolve("success");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style/index.scss";

::v-deep .flow-btns {
  z-index: 10 !important;
  bottom: -1px !important;
}

.pb20 {
  padding-bottom: 40rpx !important;
}
</style>
