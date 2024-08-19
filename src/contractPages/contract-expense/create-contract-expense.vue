<template>
  <view class="content">
    <create-step processKey="contractPlus" @submitApply="preSubmit" :itemData="itemData" @data-form="getBackData"
      :updateObj="expenseDic" :orgId="contractDic.orgId" :businessOwner="contractDic.customerSalesman"
      :isUpdate="isUpdate" :contractChange="false">
      <view class="change-bg">
        <view class="change-no-container">
          <text class="change-no">追加编号：{{ expenseDic.businessNo || "--" }}</text>
          <text class="change-btn" @click="goTo('contractList')" v-if="!itemData">
            {{ contractId ? "选择其他合同" : "选择合同" }}
          </text>
        </view>
        <view v-if="contractId || itemData">
          <contractDetailHead :baseInfo="contractDic" />

          <!--设备信息-->
          <view class="device-container">
            <view class="model-tag">设备信息</view>
            <view class="device-item-container model-content" style="border-color:#E60000"
              v-for="(item, i) in expenseDic.orderList" :key="i">
              <view class="row-line">
                <view class="d-title">{{ item.typeName }}-{{ item.heightName || "" }}</view>
                <view class="update-tag-new">新增</view>
              </view>
              <view class="sub-text">{{ item.machineTypeName }}</view>
              <view class="d-info">
                <view class="info-cell">
                  <view class="info-cell-key">数量</view>
                  <view class="info-cell-value">
                    <input v-model="item.orderNum" type="number" @input="checkNum($event, i)" />
                  </view>
                </view>

                <view class="info-cell">
                  <view class="info-cell-key">日租金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.selfHire" type="digit" @input="checkInput($event, 'selfHire', i)" />
                  </view>
                </view>

                <view class="info-cell">
                  <view class="info-cell-key">月租金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.selfHireMonthly" type="digit"
                      @input="checkInput($event, 'selfHireMonthly', i)" />
                  </view>
                </view>

                <view class="info-cell">
                  <view class="info-cell-key">押金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.pledge" type="digit" @input="checkInput($event, 'pledge', i)" />
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.carriage" type="digit" @input="checkInput($event, 'carriage', i)" />
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费类型</view>
                  <view class="info-cell-value">
                    <label-arrow :value="item.carriageTypeName" textColor="#333333"
                      @clickLabel="showPick('carriageType', i)"></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计进场时间</view>
                  <view class="info-cell-value">
                    <label-arrow :value="getDate(item.beginDate)" textColor="#333333"
                      @clickLabel="showTimePick('beginDate', i)"></label-arrow>
                  </view>
                </view>

                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计租期</view>
                  <view class="info-cell-value">
                    <!-- {{item.tenancy}} -->
                    <view style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                      ">
                      <!-- <view style="
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                        " v-if="item.settlementType !== '1' &&
                          item.settlementType !== '4' &&
                          item.settlementType !== '6'
                          ">
                        <input type="number" v-model="item.whole" @input="getInputData('whole', $event, i)" style="
                            height: 16px;
                            width: 32px;
                            font-size: 14px;
                            border: 1px solid #e9e9e9;
                            border-radius: 4px;
                            margin-right: 4px;
                            text-align: center;
                          " />
                        <view>{{
                          item.settlementType === "5" ? "周" : "月"
                        }}</view>
                      </view> -->
                      <input type="number" :value="item.surplusDay" @input="getInputData('surplusDay', $event, i)" style="
                          height: 16px;
                          width: 32px;
                          font-size: 14px;
                          border: 1px solid #e9e9e9;
                          border-radius: 4px;
                          margin-right: 4px;
                          text-align: center;
                        " />
                      <view>天</view>
                    </view>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计退场时间</view>
                  <view class="info-cell-value">{{
                    getDate(item.endDate) || "--"
                  }}</view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">指定设备</view>
                  <view class="info-cell-value">
                    <label-arrow :value="getMachineNum(item)" textColor="#333333"
                      @clickLabel="showAssignPop(item, i, true)"></label-arrow>
                  </view>
                </view>
              </view>
              <view class="middle-option top-line">
                <view class="option-btn-delete icon-text" @click="deleteItem(i)">
                  <i class="iconfont btn-icon iconzl--shanchu"></i>
                  删除
                </view>
              </view>
            </view>

            <view class="add-device icon-text" @click="goTo('addVehicle')">
              <i class="iconfont btn-icon iconjia"></i>
              新增
            </view>
            <view class="total-view">
              <text>本次追加预收合计：{{ total }}</text>
            </view>
          </view>
          <view>
            <view class="model-tag space-between" @click="isExpend = !isExpend">
              <text>原合同订单</text>
              <i class="iconfont iconarrow-right" :id="isExpend ? 'translate-arrow' : 'translate-arrow-expend'">
              </i>
            </view>
            <view v-if="isExpend">
              <view class="device-item-container model-content"
                v-for="(item, i) in contractDic.contractDetailDto.orderList" :key="i">
                <view class="row-line">
                  <view class="d-title">{{ item.typeName || "" }}-{{ item.heightName || "" }}</view>
                </view>
                <view class="sub-text">{{ item.machineTypeName || "" }}</view>
                <view class="d-info">
                  <view class="info-cell">
                    <view class="info-cell-key">数量</view>
                    <view class="info-cell-value">
                      <input v-model="item.orderNum" type="number" :disabled="true" />
                    </view>
                  </view>
                  <view class="info-cell" v-if="item.settlementType == 1 || item.settlementType == 3|| item.settlementType == 2||item.settlementType == 4">
                    <view class="info-cell-key">{{item.settlementType == 2||item.settlementType == 3?'月租金':'日租金'}}(元/台)</view>
                    <view class="info-cell-value">
                      <input v-model="item.hire" type="digit" :disabled="true" />
                    </view>
                  </view>
                  <view class="info-cell" v-if="item.settlementType == 4">
                    <view class="info-cell-key">月租金(元/台)</view>
                    <view class="info-cell-value">
                      <input v-model="item.hireMonthly" type="digit" :disabled="true" />
                    </view>
                  </view>

                  <view class="info-cell">
                    <view class="info-cell-key">押金(元/台)</view>
                    <view class="info-cell-value">
                      <input v-model="item.pledge" type="digit" :disabled="true" />
                    </view>
                  </view>
                  <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                    <view class="info-cell-key">运费(元/台)</view>
                    <view class="info-cell-value">
                      <input v-model="item.carriage" type="digit" :disabled="true" />
                    </view>
                  </view>
                  <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                    <view class="info-cell-key">运费类型</view>
                    <view class="info-cell-value">
                      <label-arrow :value="item.carriageTypeName" textColor="#333333" :disabled="true"></label-arrow>
                    </view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计进场时间</view>
                    <view class="info-cell-value">
                      <label-arrow :value="getDate(item.beginDate)" textColor="#333333" :disabled="true"></label-arrow>
                    </view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计退场时间</view>
                    <view class="info-cell-value">
                      <label-arrow :value="getDate(item.endDate)" textColor="#333333" :disabled="true"></label-arrow>
                    </view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计租期</view>
                    <view class="info-cell-value">{{
                     getTenancyFn(item)
                    }}</view>
                  </view>
                  <view class="info-cell">
                    <view class="info-cell-key">指定设备</view>
                    <view class="info-cell-value">
                      <label-arrow :value="item.machineList ? item.machineList.length : 0" textColor="#333333"
                        @clickLabel="showAssignPop(item, i, false)"></label-arrow>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 基本信息-->
          <view class="base-container">
            <view class="model-tag">其他信息</view>
            <view class="model-content">
              <selectLabelItem tagName="运费减免约定" isRequired="true" hint="请选择" :value="expenseDic.renterTripTypeName"
                :icon="righticon" @clickItemLabel="showPick('rentalTripType', null)" />
              <text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod"
                :inputValue="expenseDic.remark || ''" />
              <imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="expenseDic.fileList"
                type="contractPlus" uploadType="attachment" maximg="20" />
            </view>
          </view>
        </view>
        <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
        <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
          ref="date" themeColor="#E60000" />
      </view>
    </create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import format from "date-fns/format";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import calRent from "@/common/util/cal-rent-money.js";
import hoursUtil from "@/common/util/day-working-hours.js";
import commonUtils from "@/common/common-method/common-method.js";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import contractDetailHead from "@/contractPages/contract/detail/contract-detail-head.vue";
import { hasDupliaceDemand } from "../util";
import parseISO from "date-fns/parseISO";

import {
  differenceInDays,
} from "date-fns";
import addDays from "date-fns/addDays";
export default {
  components: {
    labelArrow,
    selectLabelItem,
    textLabelItem,
    imgupload,
    wPicker,
    createStep,
    labelPhone,
    contractDetailHead,
  },
  data() {
    return {
      righticon: "iconarrow-right",
      total: 0,
      contractId: "",
      selectList: [],
      carriageTypes: [], //运费方式
      rentTypes: [], //租赁方式
      curItem: 0,
      pickType: "", //选中pick的type
      contractDic: {
        contractDetailDto: {
          orderList: [],
        },
      },
      expenseDic: {},
      isExpend: false,
      itemData: null,
      isUpdate: false,
      isShowDefault: true,
      rentalTripTypes: [],
    };
  },
  onLoad(option) {
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowDefault = obj.value === "liangXu" ? false : true;
      }
    }
    this.contractId = option.id;
    if (option.item) {
      this.itemData = JSON.parse(decodeURIComponent(option.item));
      this.isUpdate = option.isUpdate
        ? option.isUpdate === "1"
          ? true
          : false
        : false;
    } else {
      this.getBusinessNo();
      if (this.contractId) {
        this.getContractDetail();
      }
    }

    this.loadcarriageTypes();
    this.loadSettlementTypes();
    this.loadRentalTripTypes();

    uni.$on("choose-contract-emit", (contractObj) => {
      this.contractId = contractObj.dict.id;
      this.getContractDetail(contractObj.dict.contractId);
    });

    uni.$on("chooseVehicle", (obj) => {
      this.getSelectData(obj.data);
    });
    uni.$on("assgin-vehicle", (obj) => {
      let assgins = [];
      if (obj.data && obj.data.length > 0) {
        obj.data.forEach((o) => {
          assgins = [
            ...assgins,
            {
              id: o.id,
              licenseId: o.licenseId,
              printCode: o.printCode,
              machineBrand: o.brand,
              machineType: o.type,
              machineTypeName: o.typeName,
            },
          ];
        });
      }
      this.expenseDic.orderList[this.curItem].machineList = [...assgins];
      this.expenseDic = {
        ...this.expenseDic,
        orderList: this.expenseDic.orderList.map((o,i)=>{
          if(o.settlementType==2){
                  o.selfHireMonthly=o.hire||'0';
                  o.selfHire='0'
                }else{
                  o.selfHire=o.hire||'0';
                  o.selfHireMonthly=o.hireMonthly||'0';
                }
                return  {
                  ...o
                }
        })
      };
      console.log(
        JSON.stringify(this.expenseDic.orderList[this.curItem].machineList)
      );
    });

    uni.$on("edit-item-device", (obj) => {
      let type = obj.type;
      if (type == "delete") {
        let indexnum = obj.index;
        this.expenseDic.orderList.splice(indexnum, 1);
        this.calTotal();
      } else if (type == "add") {
        this.expenseDic.orderList = [
          ...this.expenseDic.orderList,
          ...obj.data,
        ];
        this.calTotal();
      } else {
        this.expenseDic.orderList.map((e, i) => {
          if (
            `${obj.data[0].typeName}${obj.data[0].height}` ==
            `${e.typeName}${e.height}`
          ) {
            this.expenseDic.orderList.splice(i, 1, obj.data[0]);
          }
        });
        this.calTotal();
      }
    });
  },
  watch:{
    'expenseDic.orderList':{
      handler(val){
        let totalMoney = 0;
        let monthConfig=this.contractDic.contractDetailDto&&this.contractDic.contractDetailDto.monthConfig!==undefined||this.contractDic.contractDetailDto.monthConfig!==null?this.contractDic.contractDetailDto.monthConfig:'30';
        if(val&&val.length>0){
          val.forEach(o=>{
            if(o.settlementType==2){
                  o.selfHireMonthly=o.hire||'0';
                  o.selfHire='0'
                }else{
                  o.selfHire=o.hire||'0';
                  o.selfHireMonthly=o.hireMonthly||'0';
                }
        let obj = calRent.calculateTotalSelf(o,monthConfig);
        let itemTotal = parseFloat(obj.total);
        totalMoney += itemTotal;
          })
        }
        this.total =totalMoney.toFixed(2).toString()
      },
      deep:true
    }
  },
  methods: {
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "--";
      let day = differenceInDays(new Date(row.endDate), new Date(row.beginDate))+1;
      return day+'天';
    },
    getBackData(val) {
      this.expenseDic = JSON.parse(val);
      this.total = this.expenseDic.orderList.reduce((x, y) => {
        return x + Number(y.total);
      }, 0);
      this.total = this.total.toFixed(2);
      // let orderList = this.expenseDic.orderList.map(o => {
      // 	return {
      // 		...o,
      // 		beginDate: this.getDate(o.beginDate),
      // 		endDate: this.getDate(o.endDate)
      // 	}
      // })
      // this.expenseDic = {
      // 	...this.expenseDic,
      // 	orderList: orderList
      // }
      this.expenseDic.orderList.forEach((o) => {
        calRent.getTenancys(o);
        console.log(o);
      });
      this.contractId = this.expenseDic.contractId;
      this.getContractDetail();
    },
    //过滤选中数据
    getSelectData(rowTypes) {
      let newItem = rowTypes.filter((t) => {
        if (t.checked) {
          t.list = t.list.filter((m) => {
            return m.checked;
          });
        }
        return t.checked;
      });
      let arr = [];
      let defaultDate = hoursUtil.dateSFormat(new Date().getTime());
      let defaultS = this.rentTypes.length > 0 ? this.rentTypes[0].value : null;
      newItem.forEach((o) => {
        arr = [
          ...arr,
          {
            type: o.type,
            typeName: o.typeName,
            height: o.height,
            heightName: o.heightName,
            machineType: o.list.map((y) => y.id),
            machineTypeName: this.getMachineTypes(o.list.map((y) => y.name)),
            machineList: [],
            beginDate: defaultDate + " 00:00:00",
            carriage: "0.00",
            endDate: null,
            whole: null,
            surplusDay: null,
            hire: "0.00",
            hireMonthly: "0.00",
            orderNum: 1,
            carriageTypeName:
              this.carriageTypes.length > 0
                ? this.carriageTypes[0].label
                : null,
            carriageType:
              this.carriageTypes.length > 0
                ? this.carriageTypes[0].value
                : null,
            pledge: "0.00",
            settlementType: defaultS,
            tenancy: calRent.calculateDays(defaultDate, defaultDate, defaultS),
            total: "0.00",
            settlementTypeName:
              this.rentTypes.length > 0 ? this.rentTypes[0].label : null,
          },
        ];
      });

      this.expenseDic.orderList = [...this.expenseDic.orderList, ...arr];
      console.log("contractDic" + JSON.stringify(this.expenseDic));
    },
    getMachineTypes(names) {
      return names.join(",");
    },
    /**
     * 获取指定设备的数量，直接在value赋值，页面刷新有问题
     * @param {Object} item
     */
    getMachineNum(item) {
      return item.machineList ? item.machineList.length : 0;
    },
    //运费类型carriage_type
    loadcarriageTypes() {
      this.$network
        .loadType("carriage_type")
        .then((result) => {
          this.carriageTypes = result;
          uni.setStorageSync("carriage", this.carriageTypes);
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //租赁方式
    loadSettlementTypes() {
      this.$network
        .loadType("settlement_type")
        .then((result) => {
          this.rentTypes = result;
        })
        .catch((err) => { });
    },
    /**
     * 获取变更单号
     */
    getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, "HTZJ");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          console.log("getBusinessNo" + result);
          this.expenseDic = {
            ...this.expenseDic,
            businessNo: result,
          };
          console.log("getBusinessNo" + JSON.stringify(this.expenseDic));
        })
        .catch((err) => { });
    },
    /**
     * 获取合同详情
     */
    getContractDetail() {
      uni.showLoading();
      this.$network
        .getData(
          this.$url.CONTRACT_DEATIL_BY_NO + "?id=" + this.contractId,
          "GET",
          null
        )
        .then((result) => {
          uni.hideLoading();
          this.contractDic = result;
          if (!this.itemData) {
            this.isExpend = false;
            this.expenseDic = {
              businessNo: this.expenseDic.businessNo,
              contractNo: this.contractDic.businessNo,
              contractId: this.contractDic.id,
              contractDetailId: this.contractDic.contractDetailDto.id,
              projectName: this.contractDic.contractDetailDto.projectName,
              customerName: this.contractDic.customerName,
              customerSalesman: this.contractDic.customerSalesman,
              renterTripType: this.contractDic.contractDetailDto.renterTripType,
              renterTripTypeName:
                this.contractDic.contractDetailDto.renterTripTypeName,
              orderList: [],
            };
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //上传图片回调
    uploadfinish(val) {
      console.log("uploadfinish" + JSON.stringify(val));
      let list = val.data;
      this.expenseDic = {
        ...this.expenseDic,
        fileList: list,
      };
      console.log("this.expenseDic" + JSON.stringify(this.expenseDic));
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.expenseDic = {
        ...this.expenseDic,
        fileList: list,
      };
    },
    //备注
    remarkmethod(val) {
      this.expenseDic = {
        ...this.expenseDic,
        remark: val,
      };
      console.log("changeReason" + this.expenseDic);
    },
    //显示时间选择器
    showTimePick: function (type, i) {
      this.pickType = type;
      this.curItem = i;
      console.log("showTimePick" + this.curItem);
      this.$refs.date.show();
    },
    showPick: function (type, i) {
      this.pickType = type;
      this.curItem = i ? i : 0;
      console.log("showPick" + this.curItem);
      switch (this.pickType) {
        case "rentType": //租赁方式
          this.selectList = this.rentTypes ? this.rentTypes : [];
          break;
        case "carriageType": //运费方式
          this.selectList = this.carriageTypes ? this.carriageTypes : [];
          break;
        case "rentalTripType":
          this.selectList = this.rentalTripTypes ? this.rentalTripTypes : [];
          break;
      }
      this.$refs.selector.show();
    },
    /*获取数据完成*/
    /*底部弹窗选择类型*/
    onConfirm: function (val) {
      //{"checkArr":{"label":"专票","value":1},"defaultVal":[1],"result":"专票"}
      console.log(val);
      console.log("curItem" + this.curItem);
      switch (this.pickType) {
        case "carriageType": //运费方式
          this.expenseDic.orderList[this.curItem].carriageTypeName =
            val.checkArr.label;
          this.expenseDic.orderList[this.curItem].carriageType =
            val.checkArr.value;

          break;
        case "rentType": //租赁方式
          this.expenseDic.orderList[this.curItem].settlementTypeName =
            val.checkArr.label;
          this.expenseDic.orderList[this.curItem].settlementType =
            val.checkArr.value;
          this.expenseDic.orderList[this.curItem].whole = null;
          this.expenseDic.orderList[this.curItem].surplusDay = null;
          if (this.expenseDic.orderList[this.curItem].settlementType === "4") {
            this.expenseDic.orderList[this.curItem].hireMonthly = 0.0;
          }
          this.calMoney();

          break;
        case "beginDate": //进场日
          this.expenseDic.orderList[this.curItem].beginDate =
            val.result + " 00:00:00";
          this.calMoney();

          break;
        case "endDate": //预计结束时间
          this.expenseDic.orderList[this.curItem].endDate =
            val.result + " 23:59:59";

          this.calMoney();

          break;
        case "rentalTripType":
          this.expenseDic = {
            ...this.expenseDic,
            renterTripType: val.checkArr.value, //
            renterTripTypeName: val.checkArr.label, //
          };
          break;
        default:
          break;
      }
    },
    /** 删除
     * @param {Object} pos
     */
    deleteItem(pos) {
      this.expenseDic.orderList.splice(pos, 1);
      this.calMoney();
    },
    checkNum(e, i) {
      var val = e.target.value;
      setTimeout(() => {
        if (val.indexOf(".") !== -1) {
          console.log("1" + val);
          var dotIndex = val.indexOf(".");
          val = val.substr(0, dotIndex + 1);
          this.getInputData("orderNum", val, i);
        }
        if (val.indexOf(".") === 0) {
          console.log("2" + val);
          val = "";
          this.getInputData("orderNum", val, i);
        }
        //限制0后面非。输入
        if (
          val.substring(0, 1) === "0" &&
          val.length > 1 &&
          val.substring(1, 2) !== "0"
        ) {
          console.log("3" + val);
          val = val.substring(0, 1);
          this.getInputData("orderNum", val, i);
          return;
        }
        this.getInputData("orderNum", val, i);
      }, 10);
    },
    checkInput(e, type, i) {
      var val = e.target.value;
      console.log(e);
      setTimeout(() => {
        //限制小数两位
        if (val.indexOf(".") != -1) {
          var dotIndex = val.indexOf(".");
          if (val.length - 1 - dotIndex > 2) {
            val = val.substr(0, dotIndex + 2 + 1);
            this.getInputData(type, val, i);
          }
        }
        if (val.indexOf(".") == 0) {
          val = "0" + val;
          this.getInputData(type, val, i);
        }

        //限制0后面非。输入
        if (
          val.substring(0, 1) == "0" &&
          val.length > 1 &&
          val.substring(1, 2) != "."
        ) {
          val = val.substring(0, 1);
          this.getInputData(type, val, i);
          return;
        }
        this.getInputData(type, val, i);
      }, 50);
    },
    //给输入框赋值
    getInputData(type, val, i) {
      console.log(type, val, i,'getInputData')
      let monthConfig=this.contractDic.contractDetailDto&&this.contractDic.contractDetailDto.monthConfig!==undefined||this.contractDic.contractDetailDto.monthConfig!==null?this.contractDic.contractDetailDto.monthConfig:'30';
      if (type === "selfHire") {
        this.expenseDic.orderList[i].selfHire = val;
        this.expenseDic.orderList[i].hire = val;
        let obj = calRent.calculateTotalSelf(this.expenseDic.orderList[i],monthConfig);
        console.log(obj,'calRent');
        this.expenseDic.orderList[i].total=parseFloat(obj.total);
        this.calMoney();
      } else if (type === "selfHireMonthly") {
        this.expenseDic.orderList[i].selfHireMonthly = val;
        this.expenseDic.orderList[i].hireMonthly = val;
        let obj = calRent.calculateTotalSelf(this.expenseDic.orderList[i],monthConfig);
        this.expenseDic.orderList[i].total=parseFloat(obj.total)
        this.calMoney();
      } else if (type === "pledge") {
        this.expenseDic.orderList[i].pledge = val;
        this.calMoney();
      } else if (type === "carriage") {
        this.expenseDic.orderList[i].carriage = val;
        this.calMoney();
      } else if (type === "orderNum") {
        this.expenseDic.orderList[i].orderNum = val ? Number(val) : "";
        this.calMoney();
      } else if (type === "whole") {
        this.expenseDic.orderList[i].whole = val.detail.value;
        this.calMoney();
      } else if (type === "surplusDay") {
        this.expenseDic.orderList[i].surplusDay = val.detail.value;
        // 这里要重新计算一下退场时间
        if(val.detail.value != 0){
          let date = addDays(
          parseISO(this.expenseDic.orderList[i].beginDate).getTime(),
          val.detail.value - 1
        );
        this.expenseDic.orderList[i].endDate = format(date, "yyyy-MM-dd") + " 23:59:59";
        this.$forceUpdate();
        }else{
          this.expenseDic.orderList[i].endDate='';
        }
        this.calMoney();
      }
    },
    //小计
    calMoney() {
      let totalMoney = 0;
      this.expenseDic.orderList.forEach((o) => {
        let itemTotal = Number.parseFloat(o.total);
        totalMoney += itemTotal;
        o.total=Number.parseFloat(o.total)
      });
      this.total = totalMoney.toFixed(2);
    },
    getDate(time) {
      if (!time) return null;
      console.log(time,'getDate');
      return time.split(/\s+/)[0];
    },
    goTo(type) {
      switch (type) {
        case "addVehicle": //新增设备
          uni.navigateTo({
            url: `/contractPages/contract/choose-vehicle?tripCalType=${JSON.stringify(this.contractDic.contractDetailDto && this.contractDic.contractDetailDto.tripCalType || "0")}`,
          });
          break;
        case "contractList": //选择合同
          uni.navigateTo({
            url: "/businessPages/invoice/contract-choose?type=contractExpense&state=5,6,7,8&contractType =1",
          });
          break;

        default:
          break;
      }
    },
    //去指定设备
    showAssignPop(item, i, isJump) {
      console.info(i);
      this.curItem = i;
      if (!isJump) {
        //不可编辑情况下，，跳详情
        if (item.machineList && item.machineList.length > 0) {
          uni.navigateTo({
            url:
              "/contractPages/contract/assigned-vehicle?machineList=" +
              encodeURIComponent(JSON.stringify(item.machineList)),
          });
        }
      } else {
        //可编辑，去指定设备
        if (this.expenseDic.orderList[i].orderNum <= 0) {
          uni.showToast({
            title: "请选择设备数量",
            icon: "none",
          });
          return;
        }
        // if (!this.expenseDic.orderList[i].machineType || this.expenseDic.orderList[i]
        // 	.machineType
        // 	.length <= 0) {
        // 	uni.showModal({
        // 		content: "请选择具体设备品牌/型号",
        // 		showCancel: false,
        // 		confirmText: "知道了"
        // 	})
        // 	return
        // }
        uni.navigateTo({
          url:
            "/contractPages/contract/assign-vehicle?item=" +
            encodeURIComponent(
              JSON.stringify(this.expenseDic.orderList[this.curItem])
            ),
        });
      }
    },
    goToAssgined(item) {
      if (this.getMachineNum(item) > 0) {
        uni.navigateTo({
          url:
            "/contractPages/contract/assigned-vehicle?machineList=" +
            encodeURIComponent(JSON.stringify(item.machineList)),
        });
      }
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    calTotal() {
      let totalMoney = 0;
      let monthConfig=this.contractDic.contractDetailDto&&this.contractDic.contractDetailDto.monthConfig!==undefined||this.contractDic.contractDetailDto.monthConfig!==null?this.contractDic.contractDetailDto.monthConfig:'30';
      this.expenseDic.orderList.forEach((o) => {
        let obj = calRent.calculateTotalSelf(o,monthConfig);
        let itemTotal = parseFloat(obj.total);
        totalMoney += itemTotal;
        o.total=parseFloat(obj.total);
      });
      this.total =totalMoney.toFixed(2).toString()
    },
    //运费减免约定
    loadRentalTripTypes() {
      this.$network
        .loadType("renter_trip_type")
        .then((result) => {
          this.rentalTripTypes = result;
        })
        .catch((err) => { });
    },
    //是否查找到‘00：00：00’
    findNotStr(str, findstr) {
      return str.indexOf(findstr) === -1;
    },
    checkData() {
      let self = this;
      if (
        !self.expenseDic.orderList ||
        (self.expenseDic.orderList && self.expenseDic.orderList.length <= 0)
      ) {
        self.showToast("请添加设备信息");
        return Promise.reject("fail");
      }
      if (!self.expenseDic.renterTripType) {
        self.showToast("请选择运费减免约定");
        return Promise.reject("fail");
      }
      if (
        self.expenseDic.orderList.some((o) => !o.orderNum || o.orderNum === 0)
      ) {
        self.showToast("设备数量必须大于0");
        return Promise.reject("fail");
      }
      // for (let i = 0; i < self.expenseDic.orderList.length; i++) {
      // 	let m = self.expenseDic.orderList[i];
      // 	for (let j = i + 1; j < self.expenseDic.orderList.length; j++) {
      // 		let n = self.expenseDic.orderList[j];
      // 		if (
      // 			m.type === n.type &&
      // 			m.height === n.height &&
      // 			m.settlementType === n.settlementType &&
      // 			this.$datestr.doubleFloat(m.hire) == this.$datestr.doubleFloat(n.hire) &&
      // 			this.$datestr.doubleFloat(m.hireMonthly) == this.$datestr.doubleFloat(n.hireMonthly)
      // 		) {
      // 			self.showToast('订单中有类型、高度、租赁方式重复，不可提交');
      // 			return Promise.reject('fail');
      // 		}
      // 	}
      // }
      let hasDuplicate = hasDupliaceDemand(this.expenseDic.orderList);
      if (hasDuplicate) {
        this.showToast("设备需求重复，请修改");
        return Promise.reject("fail");
      }
      for (let i = 0; i < self.expenseDic.orderList.length; i++) {
        let o = self.expenseDic.orderList[i];
        console.log("o.machineType" + JSON.stringify(o.machineType));
        let bo = self.contractDic.contractDetailDto.orderList.some((y) => {
          console.log("y.machineType" + JSON.stringify(y.machineType));
          return (
            o.type === y.type &&
            o.height === y.height &&
            o.settlementType === y.settlementType &&
            this.$datestr.doubleFloat(o.hire) ==
            this.$datestr.doubleFloat(y.hire) &&
            this.$datestr.doubleFloat(o.hireMonthly) ==
            this.$datestr.doubleFloat(y.hireMonthly)
          );
        });
        if (bo) {
          self.showToast(
            "附加订单不可与原合同订单重复【类型、高度、租赁方式、租金】"
          );
          return Promise.reject("fail");
        }
      }
      if (
        self.expenseDic.orderList.some(
          (o) =>
            (o.hire === "" ||
            Number.parseFloat(o.hire) === 0)&&((Number.parseFloat(o.hireMonthly) === 0) ||o.hireMonthly === ""))
      ) {
        self.showToast("租金必须大于0");
        return Promise.reject("fail");
      }
      let orderList = this.expenseDic.orderList.map((o) => {
        o.beginDate = o.beginDate ? o.beginDate : null;
        o.endDate = o.endDate ? o.endDate : null;
        if(o.settlementType==2){
                  o.selfHireMonthly=o.hire||'0';
                  o.selfHire='0'
                }else{
                  o.selfHire=o.hire||'0';
                  o.selfHireMonthly=o.hireMonthly||'0';
                }
        return {
          ...o
        };
      });

      this.expenseDic = {
        ...this.expenseDic,
        orderList: orderList,
      };
      return Promise.resolve("success");
    },
    preSubmit(val) {
      uni.showLoading({
        mask: true,
      });
      this.$network
        .getData(
          this.$url.PRE_CONTRACT_EXPANSE.replace(
            /{contractId}/,
            this.expenseDic.contractId
          ).replace(/{contractNo}/, this.expenseDic.contractNo),
          "POST",
          null
        )
        .then((result) => {
          uni.hideLoading();
          this.submit(val);
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.details ? err.details[0] : err.message,
          });
        });
    },
    submit(val) {
      uni.showLoading({
        mask: true,
      });
      let monthConfig=this.contractDic.contractDetailDto&&this.contractDic.contractDetailDto.monthConfig;
      let orderList=this.expenseDic&&this.expenseDic.orderList||[];
      orderList.map((o,index)=>{
        if (Number(o.selfHire) && Number(o.selfHireMonthly)) {
            // 日租转月租
            o.settlementType = '4';
            o.hire = o.selfHire;
            o.hireMonthly = o.selfHireMonthly;
          } else if (Number(o.selfHire) && !Number(o.selfHireMonthly)) {
            o.settlementType = '1';
            o.hire = o.selfHire;
            o.hireMonthly=0;
          } else if (!Number(o.selfHire) && Number(o.selfHireMonthly)) {
            o.settlementType = '2';
            o.hire = o.selfHireMonthly;
            o.hireMonthly=0;
          }
              //月租选择自然月  settlementType设为3
            if(o.settlementType=='2'&&monthConfig==='0'){
              o.settlementType='3'
            }
            let obj = calRent.calculateTotalSelf(o,monthConfig);
            return {
              ...o,
              total:parseFloat(obj.total)
            }
      });
      this.expenseDic.orderList=[...orderList];
      console.log(this.expenseDic,'this.expenseDic')
      this.$network
        .getData(this.$url.CONTRACT_EXPANSE + val, "POST", this.expenseDic)
        .then((result) => {
          console.log(JSON.stringify(result));
          uni.$emit("refresh-contract-list", {
            type: "contractExpense",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.showToast({
            icon: "none",
            title: "附加合同成功",
          });
          uni.navigateBack({
            delta: 1,
          });
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.message,
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.change-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.change-no-container {
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.change-no {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
}

.change-btn {
  color: $uni-color-primary;
  font-size: $uni-font-size-sm;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 4px;
}

// 详情头container 蓝色模块
.contract-info-conntainer {
  background: linear-gradient(to bottom right, #5b7bec, #6c8cff);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  padding: 8px;
  margin: 8px 8px 16px 8px;
  border-radius: 4px;
}

//合同信息第一行 （标题）
.contract-tite {
  font-size: $uni-font-size-base;
  font-weight: bold;
}

//合同信息第二行 业务单号
.contract-business-no {
  font-size: $uni-font-size-sm;
  margin-top: 4px;
}

//合同信息第三行 合同类型
.contract-type text {
  font-size: $uni-font-size-sm;
  margin-top: 8px;
  padding: 2px 8px;
  border-radius: 8px;
  background-color: #4a63be;
}

//第四行 客戶相關信息
.customer-info {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
  align-items: center;
}

//第四行 客戶相關信息
.customer-info-left {
  display: flex;
  flex-direction: row;
}

.contract-region-container,
.contract-contact-container {
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-sm;
}

.contract-region,
.contract-contact {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
}

.v-line {
  background-color: #ffffff;
  margin: 8px 16px;
  width: 1rpx;
}

.change-customer-name {
  font-size: $uni-font-size-base;
  background-color: $uni-color-primary;
  padding: 4px 8px;
  border-radius: 4px;
}

.model-tag {
  margin: 16px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.model-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
  margin: 0px 8px 8px 8px;
  font-size: $uni-font-size-base;
  border-width: 3px 0px 0px 0px;
  border-style: solid;
  border-color: #ffffff;
}

.row-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 4px 0px;
  align-items: center;
}

.sub-text {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
}

.icon-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.col-line {
  margin-top: 16px;
}

.radio-group {
  display: flex;
  flex-direction: row;
  margin-top: 6px;
}

.radio-view {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: $uni-bg-color-grey;
  color: $uni-text-color-gray;
  margin-right: 8px;

  &.selected {
    background: #f2ffff;
    color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
  }
}

.update-tag-new {
  color: $uni-color-primary;
  font-size: $uni-font-size-xs;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #fff1f0;
}

.update-tag {
  color: #722ed1;
  font-size: $uni-font-size-xs;
  border: 1px solid #d3adf7;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #f9f0ff;
}

.d-info {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  padding-top: 8px;
}

.info-cell {
  width: 33%;
  padding-bottom: 8px;
}

.info-cell-key {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  display: flex;
  flex-flow: row;
  align-items: center;
}

.info-cell-value {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 24px;
  line-height: 24px;
}

.middle-option {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}

.top-line {
  padding: 8px 0px;
  border-width: 1px 0px 0px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.line {
  border-width: 1px 0px 0px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.option-btn-update {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 6px;
}

.option-btn-update {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 6px;
}

.option-btn-recall {
  color: #722ed1;
  border: 1px solid #722ed1;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 10px;
}

.option-btn-delete {
  color: #555555;
  border: 1px solid #555555;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 10px;
}

.btn-icon {
  margin-right: 2px;
  font-size: 13px;
}

.info-cell-value input {
  font-size: $uni-font-size-base;
  line-height: 24px;
  height: 24px;
}

.total-view {
  font-size: $uni-font-size-base;
  color: #000000;
  text-align: end;
  padding: 8px;
}

.space-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#translate-arrow {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(-90deg);
  transition: all 1s;
}

#translate-arrow-expend {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(90deg);
  transition: all 1s;
}

.add-device {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  font-size: $uni-font-size-base;
  border-radius: 4px;
  text-align: center;
  padding: 6px 0px;
  margin: 8px 8px;
  font-weight: bold;
  background-color: #fff1f0;
}
</style>
