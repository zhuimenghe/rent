<template>
  <view class="content">
    <create-step
      processKey="contractChange"
      @submitApply="preSubmit"
      :itemData="itemData"
      @data-form="getBackData"
      :updateObj="baseInfo"
      :orgId="baseInfo.orgId"
      :businessOwner="baseInfo.customerSalesman"
      :isUpdate="isUpdate"
      :contractChange="false"
    >
      <view class="change-bg">
        <view class="change-no-container">
          <text class="change-no">变更编号：{{ baseInfo.changeNo || "--" }}</text>
          <text class="change-btn" @click="goTo('contractList')" v-if="!itemData">
            {{ contractId ? "选择其他合同" : "选择合同" }}
          </text>
        </view>

        <view v-if="contractId || itemData">
          <contractDetailHead
            :baseInfo="baseInfo.originContractDto"
            :showContact="false"
            :isChangeCustomer="true"
            @changeCustomer="changeCustomer"
          />

          <view class="customer-info-container" v-if="isChangeCustomer">
            <view class="model-tag"><span class="line"></span>客户信息</view>
            <view class="model-content">
              <view class="row-line-between">
                <view class="customer-name">客户名称</view>
                <view class="row-line" style="color: #e60000" @click="goTo('customer')">
                  {{ baseInfo.customerName }}
                  <i class="iconfont iconarrow-right" style="margin-left: 4px"></i>
                </view>
              </view>
              <view class="row-line sub-text">
                <view>改前</view>
                <view>{{ baseInfo.originContractDto.customerName }}</view>
              </view>
            </view>
          </view>
          <!-- 结算信息 -->
          <settledown-info
            :settlementObj="settlementObj"
            :dataDic="baseInfo.contractDetailDto"
            @clickItem="(val) => showPick(val, 0, 'settledown')"
            @textChange="(val) => textChange(val, 'settledown')"
            @prePayChange="handleprePayChange"
            @invoiceChange="handleinvoiceChange"
          ></settledown-info>
          <!-- 项目信息 -->
          <project-info
            :dataDic="baseInfo.contractDetailDto"
            @minTenancyChange="handleMinTenancyChange"
            @clickItem="(val) => showPick(val, 0, 'project')"
            @textChange="(val) => textChange(val, 'project')"
            :isEdit="true"
          >
          </project-info>
          <authorizedPersonInformation
            ref="authorizedPersonInformation"
            v-if="baseInfo.customerId"
            :dataDic="baseInfo"
            @dialog="handleDialog"
          />
          <!--设备信息 -->
          <view class="device-container">
            <view class="model-tag"><span class="line"></span>设备信息</view>
            <view
              class="device-item-container model-content"
              :style="{
                'border-color': item.changed
                  ? item.changed == 1
                    ? '#722ED1'
                    : '#E60000'
                  : '#FFFFFF',
              }"
              v-for="(item, i) in baseInfo.contractDetailDto.orderList"
              :key="i"
            >
              <view class="row-line">
                <view class="d-title"
                  >{{ item.typeName }}-{{ item.heightName || "" }}</view
                >
                <view
                  v-if="item.changed"
                  :class="item.changed === 1 ? 'update-tag' : 'update-tag-new'"
                >
                  {{ item.changed === 1 ? "改后" : "新增" }}
                </view>
              </view>
              <view class="sub-text">{{ item.machineTypeName }}</view>
              <view class="d-info">
                <view class="info-cell">
                  <view class="info-cell-key">数量</view>
                  <view class="info-cell-value">
                    <input
                      v-model="item.orderNum"
                      :disabled="!item.changed"
                      type="number"
                      @input="checkNum($event, i, item)"
                    />
                  </view>
                </view>

                <view class="info-cell">
                  <view class="info-cell-key">日租金(元/台)</view>
                  <view class="info-cell-value">
                    <input
                      v-model="item.selfHire"
                      type="digit"
                      :disabled="!item.changed"
                      @input="checkInput($event, 'selfHire', i)"
                    />
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">月租金(元/台)</view>
                  <view class="info-cell-value">
                    <input
                      v-model="item.selfHireMonthly"
                      type="digit"
                      :disabled="!item.changed"
                      @input="checkInput($event, 'selfHireMonthly', i)"
                    />
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">押金(元/台)</view>
                  <view class="info-cell-value">
                    <input
                      v-model="item.pledge"
                      type="digit"
                      :disabled="!item.changed"
                      @input="checkInput($event, 'pledge', i)"
                    />
                  </view>
                </view>
                <view class="info-cell" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                  <view class="info-cell-key">运费(元/台)</view>
                  <view class="info-cell-value">
                    <input
                      v-model="item.carriage"
                      type="digit"
                      :disabled="!item.changed"
                      @input="checkInput($event, 'carriage', i)"
                    />
                  </view>
                </view>
                <view class="info-cell" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                  <view class="info-cell-key">运费类型</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="item.carriageTypeName"
                      textColor="#333333"
                      :disabled="!item.changed"
                      @clickLabel="showPick('carriageType', i)"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计进场时间</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="getDate(item.beginDate)"
                      textColor="#333333"
                      :disabled="!item.changed"
                      @clickLabel="showTimePick('beginDate', i)"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计租期</view>
                  <view class="info-cell-value">
                    <view v-if="!item.whole && !isModify">{{
                      item.surplusDay || ""
                    }}</view>
                    <view
                      v-else
                      style="display: flex; flex-direction: row; align-items: center"
                    >
                      <input
                        type="number"
                        :value="item.surplusDay || ''"
                        @input="getInputData('surplusDay', $event, i)"
                        :disabled="!item.changed"
                        style="
                          height: 16px;
                          width: 32px;
                          font-size: 14px;
                          border: 1px solid #e9e9e9;
                          border-radius: 4px;
                          margin-right: 4px;
                          text-align: center;
                        "
                      />
                      <view>天</view>
                    </view>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计退场时间</view>
                  <view class="info-cell-value">{{ getDate(item.endDate) || "--" }}</view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">变更生效时间</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="item.enableTime ? getDate(item.enableTime) : '--'"
                      textColor="#333333"
                      :disabled="!item.changed"
                      @clickLabel="showTimePick('enableTime', i)"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">指定设备</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="getMachineNum(item)"
                      textColor="#333333"
                      :disabled="!item.changed"
                      @clickLabel="showAssignPop(item, i)"
                    ></label-arrow>
                  </view>
                </view>
              </view>
              <view class="middle-option top-line">
                <view>
                  <view class="option-msg sub-text row-line" v-if="item.changed == 1">
                    改前信息
                    <i class="iconfont sub-text iconarrow-down"></i>
                  </view>
                </view>
                <view class="option-container row-line">
                  <view
                    class="option-btn-update icon-text"
                    v-if="!item.changed"
                    @click="modifyItem(i)"
                  >
                    <i class="iconfont btn-icon iconzl--bianji"></i>
                    更改
                  </view>
                  <view
                    class="option-btn-recall icon-text"
                    v-if="item.changed == 1"
                    @click="recallItem(item, i)"
                  >
                    <i class="iconfont btn-icon iconchehui"></i>
                    撤回
                  </view>
                  <view
                    class="option-btn-delete icon-text"
                    @click="deleteItem(i)"
                    v-if="item.changed == 2"
                  >
                    <i class="iconfont btn-icon iconzl--shanchu"></i>
                    删除
                  </view>
                </view>
              </view>
              <view class="top-line" v-if="getOriginOrder(item)">
                <view class="row-line sub-text">
                  <view>数量</view>
                  <view>{{ getOriginOrder(item).orderNum }}</view>
                </view>

                <view
                  class="row-line sub-text"
                  v-if="
                    item.settlementType == 1 ||
                    item.settlementType == 4 ||
                    item.settlementType == 2 ||
                    item.settlementType == 3
                  "
                >
                  <view>{{
                    item.settlementType == "2" || item.settlementType == "3"
                      ? "月租金(元/台)"
                      : "日租金(元/台)"
                  }}</view>
                  <view>{{ getOriginOrder(item).hire }}</view>
                </view>
                <view class="row-line sub-text" v-if="item.settlementType == '4'">
                  <view>月租金(元/台)</view>
                  <view>{{ getOriginOrder(item).hireMonthly }}</view>
                </view>
                <view class="row-line sub-text">
                  <view>押金(元/台)</view>
                  <view>{{ getOriginOrder(item).pledge }}</view>
                </view>

                <view class="row-line sub-text" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                  <view>运费(元/台)</view>
                  <view>{{ getOriginOrder(item).carriage }}</view>
                </view>

                <view class="row-line sub-text" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                  <view>运费类型</view>
                  <view>{{ getOriginOrder(item).carriageTypeName }}</view>
                </view>
                <view class="row-line sub-text" v-if="isShowDefault">
                  <view>预计进场时间</view>
                  <view>{{ getDate(getOriginOrder(item).beginDate) }}</view>
                </view>
                <view class="row-line sub-text" v-if="isShowDefault">
                  <view>预计租期</view>
                  <view>{{ getTenancyFn(getOriginOrder(item)) || "--" }}</view>
                </view>
                <view class="row-line sub-text" v-if="isShowDefault">
                  <view>预计退场时间</view>
                  <view>{{ getDate(getOriginOrder(item).endDate) || "--" }}</view>
                </view>
                <view class="row-line sub-text">
                  <view>变更生效时间</view>
                  <view>{{ getDate(getOriginOrder(item).enableTime) || "--" }}</view>
                </view>
                <view class="row-line sub-text">
                  <view>指定设备</view>
                  <view
                    :style="{
                      color:
                        getOriginOrder(item).machineList &&
                        getOriginOrder(item).machineList.length > 0
                          ? '#E60000'
                          : '#333333',
                    }"
                    @click="goToAssgined(getOriginOrder(item))"
                  >
                    {{
                      getOriginOrder(item).machineList
                        ? getOriginOrder(item).machineList.length
                        : "0"
                    }}
                  </view>
                </view>
              </view>
            </view>
            <!-- <view class="total-view">合同预收合计：{{total}}</view> -->
            <view class="add-device icon-text" @click="goTo('addVehicle')">
              <i class="iconfont btn-icon iconjia"></i>
              新增
            </view>
          </view>

          <!-- 基本信息-->
          <view class="base-container">
            <view class="model-tag"><span class="line"></span>基本信息</view>
            <view class="model-content">
              <select-label-item
                tagName="更改人"
                :value="changeUser.createName"
                :isSelect="false"
              />
              <view class="line"></view>
              <select-label-item
                tagName="更改时间"
                :value="getDate(changeUser.createTime)"
                :isSelect="false"
              />
              <select-label-item
                tagName="结算模式"
                :isRequired="true"
                hint="请选择结算模式"
                :value="
                  baseInfo.settleMode && baseInfo.settleMode == 2
                    ? '按照变更生效时间结算'
                    : '始终以最后变更的约定结算'
                "
                @clickItemLabel="showPick('settleMode')"
              />
              <text-label-item
                tagName="更改原因"
                placeholder="请输入备注..."
                @ipnuttext="remarkmethod"
                :inputValue="baseInfo.changeReason || ''"
              />
              <imgupload
                @uploadfinish="uploadfinish"
                @deleteUrl="deleteUrl"
                :imgFinishlist="baseInfo.fileList"
                type="contractChange"
                uploadType="attachment"
                maximg="20"
              />
            </view>
          </view>
        </view>

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
          @confirm="onConfirm"
          :disabledAfter="false"
          ref="date"
          themeColor="#E60000"
        />
      </view>
    </create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import calRent from "@/common/util/cal-rent-money.js";
import hoursUtil from "@/common/util/day-working-hours.js";
import compareObj from "@/common/util/compare-obj.js";
import deviceInforMation from "@/contractPages/contract/create-contract-components/device-information.vue";
import contractDetailHead from "@/contractPages/contract/detail/contract-detail-head.vue";
import settledownInfo from "@/contractPages/contract/create-contract-components/settle-information.vue";
import projectInfo from "@/contractPages/contract/create-contract-components/project-information.vue";
import authorizedPersonInformation from "@/contractPages/contract/create-contract-components/authorized-person-information.vue";
import { hasDupliaceDemand } from "../util";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import parseISO from "date-fns/parseISO";
import { differenceInDays } from "date-fns";
export default {
  components: {
    labelArrow,
    selectLabelItem,
    textLabelItem,
    imgupload,
    wPicker,
    createStep,
    contractDetailHead,
    deviceInforMation,
    projectInfo,
    settledownInfo,
    authorizedPersonInformation,
  },
  data() {
    return {
      isModify: false,
      righticon: "iconarrow-right",
      total: 0,
      isChangeCustomer: false, //是否显示客户信息
      contractId: "",
      selectList: [],
      carriageTypes: [], //运费方式
      rentTypes: [], //租赁方式
      curItem: 0,
      pickType: "", //选中pick的type
      isHaveExecution: false, //是否有执行中的合同
      isHaveCompleted: false, //是否有已完成的合同
      baseInfo: {
        changeNo: "",
        contractDetailDto: {
          orderList: [],
        },
        originContractDto: {
          contractDetailDto: {
            orderList: [],
          },
        },
        settleMode: "",
      },
      changeUser: {},
      itemData: null,
      isUpdate: false,
      settleModeList: [
        {
          label: "始终以最后变更的约定结算",
          value: 1,
        },
        {
          label: "按照变更生效时间结算",
          value: 2,
        },
      ],
      mesDic: {},
      //默认30天
      settlementObj: {
        value: "30",
        label: "30天为一个月",
      },
      changeMode: [],
      paymentTypeList: [],
      MonthsettlementDayTypeList: [],
      PaysettlementDayTypeList: [],
      settlementDayList: [],
      renterTripTypeList: [],
      invoiceTypeList: [],
      //是否配备操作人员列表
      allocateFlagList: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ],
      settleList: [
        {
          value: "30",
          label: "30天为一个月",
        },
        {
          value: "0",
          label: "自然月",
        },
      ],
      minTenancyList: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ],
      isShowDefault: true,
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
      this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false) : false;
    } else {
      this.getBusinessNo();
      this.getContractDetail();
      uni.getStorage({
        key: this.$savekey.USER_INFO_MEG,
        success: (res) => {
          this.changeUser = {
            createBy: res.data.id,
            createName: res.data.username,
            createTime: hoursUtil.datetimeSFormat(new Date().getTime()),
          };
        },
      });
    }
    for (let i = 1; i < 32; i++) {
      this.settlementDayList.push({
        label: i + "号",
        value: i,
      });
    }

    this.loadPaymentTypes();
    this.loadcarriageTypes();
    this.loadSettlementTypes();
    this.loadsettlementDatePay();
    this.loadsettlementDateMonth();
    this.loadrenterTripTypes();
    this.loadinviceTypes();

    uni.$on("choose-contract-emit", (contractObj) => {
      this.contractId = contractObj.dict.id;
      this.baseInfo = {
        changeNo: this.baseInfo.changeNo,
        contractDetailDto: {
          orderList: [],
        },
        originContractDto: {
          contractDetailDto: {
            orderList: [],
          },
        },
        settleMode: "",
      };
      this.getContractDetail();
    });
    uni.$on("linkman-emit", (obj) => {
      this.baseInfo = {
        ...this.baseInfo,
        customerId: obj.customer.id, //客户名称ID
        customerName: obj.customer.name, //客户名称
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          contactId: obj.dict.id, //联系人ID
          phoneNum: obj.dict.phoneNum, //联系人手机号
          contactName: obj.dict.name, //联系人名称
        },
      };
      this.getCustomerContract();
      this.handleDialog({
        workInAndOutUser: null,
        settlementUser: null,
        contractGuaranteeUser: null,
      });
    });
    uni.$on("linkman-emit-person", (obj) => {
      this.baseInfo = {
        ...this.baseInfo,
        customerId: obj.dict.id, //客户名称ID
        customerName: obj.dict.name, //客户名称
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          contactId: null, //联系人ID
          phoneNum: obj.dict.phoneNum, //联系人手机号
          contactName: obj.dict.name, //联系人名称
        },
      };
      this.getCustomerContract();
      this.handleDialog({
        workInAndOutUser: null,
        settlementUser: null,
        contractGuaranteeUser: null,
      });
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
      this.baseInfo.contractDetailDto.orderList[this.curItem].machineList = [...assgins];
      this.baseInfo = {
        ...this.baseInfo,
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: this.baseInfo.contractDetailDto.orderList,
        },
      };
    });
    uni.$on("edit-item-device", (obj) => {
      let type = obj.type;
      if (type == "delete") {
        let indexnum = obj.index;
        this.baseInfo.contractDetailDto.orderList.splice(indexnum, 1);
        this.calTotal();
      } else if (type == "add") {
        obj.data.forEach((i) => {
          i.changed = 2;
        });
        this.baseInfo.contractDetailDto.orderList = [
          ...this.baseInfo.contractDetailDto.orderList,
          ...obj.data,
        ];
        this.baseInfo.originContractDto.contractDetailDto.orderList = [
          ...this.baseInfo.originContractDto.contractDetailDto.orderList,
          ...obj.data,
        ];
        this.calTotal();
      } else {
        this.baseInfo.contractDetailDto.orderList.map((e, i) => {
          if (
            `${obj.data[0].typeName}${obj.data[0].height}` == `${e.typeName}${e.height}`
          ) {
            this.baseInfo.contractDetailDto.orderList.splice(i, 1, obj.data[0]);
          }
        });
        this.calTotal();
      }
    });
    //施工类别
    uni.$on("choosedConstruction", (obj) => {
      let choosedConstructionList = [...obj.data];
      let names = choosedConstructionList.map((o) => {
        return o.label;
      });
      let nameIds = choosedConstructionList.map((o) => {
        return o.value;
      });
      this.baseInfo = {
        ...this.baseInfo,
        constructionType: nameIds, //施工类型
        constructionTypeName: names.join(","), //施工类型
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          constructionType: nameIds, //施工类型
          constructionTypeName: names.join(","), //施工类型
        },
      };
    });
    //加载地图
    uni.$on("choose-address", (obj) => {
      console.log("choose-address", obj);
      let result = obj.data;
      switch (this.pickType) {
        case "deliveryPlace":
          // if (!this.baseInfo.returnPlace) {
          //   this.baseInfo = {
          //     ...this.baseInfo,
          //     returnPlace: result.address, //	交付地点
          //   };
          // }
          this.baseInfo = {
            ...this.baseInfo,
            deliveryPlace: result.address, //	交付地点
            latitude: result.latitude, //		围栏纬度
            longitude: result.longitude, //		围栏经度
            fenceId: "", //	围栏id
            fenceName: "", //	围栏名称
            radius: result.currentRadius, //围栏半径
            contractDetailDto: {
              ...this.baseInfo.contractDetailDto,
              deliveryPlace: result.address,
            },
          };
          break;
        case "returnPlace":
          this.baseInfo = {
            ...this.baseInfo,
            returnPlace: result.address, //	交付地点
            contractDetailDto: {
              ...this.baseInfo.contractDetailDto,
              returnPlace: result.address,
            },
          };
          break;
        default:
          break;
      }
    });
  },
  onUnload() {
    this.offNotifice();
  },
  methods: {
    ensureObject(input) {
      if (typeof input === "string") {
        try {
          return JSON.parse(input); // 尝试解析字符串
        } catch (e) {
          console.error("Parsing error:", e);
          return null; // 解析失败返回 null 或错误处理
        }
      } else if (typeof input === "object" && input !== null) {
        return input; // 如果已经是对象且不是 null，直接返回
      } else {
        console.error("Invalid input: input is neither JSON string nor object");
        return null; // 输入既不是字符串也不是对象，返回 null 或错误处理
      }
    },
    handleDialog(val) {
      console.log(val, "val");
      this.baseInfo.extendedData = this.ensureObject(this.baseInfo.extendedData);
      function isEmpty(value) {
        return value === null || value === undefined || value === "";
      }
      // 用当前值初始化更新前的空状态检查
      const initialEmpty = {
        workInAndOutUser: isEmpty(this.baseInfo.extendedData.workInAndOutUserName),
        contractGuarantorUser: isEmpty(
          this.baseInfo.extendedData.contractGuarantorUserName
        ),
        settlementUser: isEmpty(this.baseInfo.extendedData.settleUserName),
      };
      let updates = {};
      // 仅当 workInAndOutUser 存在并且是对象时，才展开这个对象
      if (val.workInAndOutUser && typeof val.workInAndOutUser === "object") {
        updates = {
          ...updates,
          workInAndOutUserId: val.workInAndOutUser.id || "",
          workInAndOutUserName: val.workInAndOutUser.name || "",
          workInAndOutUserPhone: val.workInAndOutUser.phoneNum || "",
          workInAndOutUserIdentity: val.workInAndOutUser.identity || "",
        };
      } else {
        updates = {
          ...updates,
          workInAndOutUserId: "",
          workInAndOutUserName: "",
          workInAndOutUserPhone: "",
          workInAndOutUserIdentity: "",
        };
      }
      // 仅当 contractGuaranteeUser 存在并且是对象时，才展开这个对象
      if (val.contractGuaranteeUser && typeof val.contractGuaranteeUser === "object") {
        updates = {
          ...updates,
          contractGuarantorUserId: val.contractGuaranteeUser.id || "",
          contractGuarantorUserName: val.contractGuaranteeUser.name || "",
          contractGuarantorUserPhone: val.contractGuaranteeUser.phoneNum || "",
          contractGuarantorUserIdentity: val.contractGuaranteeUser.identity || "",
        };
      } else {
        updates = {
          ...updates,
          contractGuarantorUserId: "",
          contractGuarantorUserName: "",
          contractGuarantorUserPhone: "",
          contractGuarantorUserIdentity: "",
        };
      }
      // 仅当 settlementUser 存在并且是对象时，才展开这个对象
      if (val.settlementUser && typeof val.settlementUser === "object") {
        updates = {
          ...updates,
          settleUserId: val.settlementUser.id || "",
          settleUserName: val.settlementUser.name || "",
          settleUserPhone: val.settlementUser.phoneNum || "",
          settleUserIdentity: val.settlementUser.identity || "",
        };
      } else {
        updates = {
          ...updates,
          settleUserId: "",
          settleUserName: "",
          settleUserPhone: "",
          settleUserIdentity: "",
        };
      }
      this.baseInfo.extendedData = {
        ...this.baseInfo.extendedData,
        ...updates,
      };

      // 检查更新后的状态，决定是否设置 changeMode
      if (
        !initialEmpty.workInAndOutUser ||
        !isEmpty(updates.workInAndOutUserName) ||
        !initialEmpty.contractGuarantorUser ||
        !isEmpty(updates.contractGuarantorUserName) ||
        !initialEmpty.settlementUser ||
        !isEmpty(updates.settleUserName)
      ) {
        this.addMode("5"); // 授权人信息有更改
      }
      this.baseInfo.extendedDataObj = this.baseInfo.extendedData;
      this.baseInfo.extendedData = JSON.stringify(this.baseInfo.extendedData);
    },
    handleMinTenancyChange(val) {
      this.addMode("4"); // 项目信息有更改
      this.baseInfo.contractDetailDto.minTenancy = val;
    },
    handleinvoiceChange(val) {
      this.addMode("3"); // 结算信息有更改
      this.baseInfo.contractDetailDto.invoiceTax = val;
    },
    handleprePayChange(val) {
      this.addMode("3"); // 结算信息有更改
      this.baseInfo.contractDetailDto.prePayWorkInDays = val;
    },
    //发票类型
    loadinviceTypes() {
      this.$network
        .loadType("invoice_type")
        .then((result) => {
          this.invoiceTypeList = [...result];
          if (
            !this.baseInfo.contractDetailDto.invoiceType &&
            this.invoiceTypeList.length > 0
          ) {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              invoiceType: this.invoiceTypeList[0].value,
              invoiceTypeName: this.invoiceTypeList[0].label,
            };
          }
        })
        .catch((err) => {});
    },
    //运费减免类型carriage_type
    loadrenterTripTypes() {
      this.$network
        .loadType("renter_trip_type")
        .then((result) => {
          this.renterTripTypeList = result;
          if (
            this.renterTripTypeList.length > 0 &&
            !this.baseInfo.contractDetailDto.renterTripType
          ) {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              renterTripTypeName: this.renterTripTypeList[0].label,
              renterTripType: this.renterTripTypeList[0].value,
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //结算日类型-月结
    loadsettlementDateMonth() {
      this.$network
        .loadType("settlement_monthly_type")
        .then((result) => {
          this.MonthsettlementDayTypeList = result;
        })
        .catch((err) => {});
    },
    //结算日类型-预付
    loadsettlementDatePay() {
      this.$network
        .loadType("settlement_prepaid_type")
        .then((result) => {
          this.PaysettlementDayTypeList = result;
        })
        .catch((err) => {});
    },
    //结算方式payment_type
    loadPaymentTypes() {
      uni.showLoading();
      this.$network
        .loadType("payment_type")
        .then((result) => {
          console.log(result, "loadPaymentTypes");
          this.paymentTypeList = result;
          if (
            !this.baseInfo.contractDetailDto.paymentType &&
            this.paymentTypeList.length > 0
          ) {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              paymentTypeName: this.paymentTypeList[0].label,
              paymentType: this.paymentTypeList[0].value,
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "--";
      let day = differenceInDays(new Date(row.endDate), new Date(row.beginDate)) + 1;
      return day + "天";
    },
    offNotifice() {
      uni.$off("edit-item-device");
    },
    addItem() {
      this.$refs.deviceInforMation();
    },
    deleteItem(index) {
      uni.showModal({
        title: "提示",
        content: "确定要删除该设备么?",
        success: (res) => {
          if (res.cancel) {
          } else {
            this.dataDic.orderList.splice(index, 1);
            this.calTotal();
          }
        },
      });
    },
    calTotal() {
      let totalMoney = 0;
      let orderList =
        (this.baseInfo &&
          this.baseInfo.contractDetailDto &&
          this.baseInfo.contractDetailDto.orderList) ||
        [];
      orderList.forEach((o) => {
        let obj = calRent.calculateTotalNew(o);
        let itemTotal = parseFloat(obj.total);
        totalMoney += itemTotal;
        // o.total=itemTotal
      });
      this.baseInfo = {
        ...this.baseInfo,
        totalMoney: totalMoney.toFixed(2).toString(),
      };
    },
    getBackData(val) {
      console.log("-----------------------");
      this.baseInfo = JSON.parse(val);
      console.log(this.baseInfo, "this.baseInfo");
      this.isHaveExecution = this.baseInfo.executionFlag;
      this.isHaveCompleted = this.baseInfo.completedFlag;
      this.isChangeCustomer =
        this.baseInfo.customerId !== this.baseInfo.originContractDto.customerId;
      this.changeUser = {
        createBy: this.baseInfo.createBy,
        createName: this.baseInfo.createName,
        createTime: this.baseInfo.createTime,
      };
      // 退回审批,应用上次的修改
      if (this.baseInfo.changeMode && this.baseInfo.changeMode.length > 0)
        this.changeMode = this.baseInfo.changeMode;
      //变更后的orderList 计算租期
      let newOrderList = this.baseInfo.contractDetailDto.orderList
        ? this.baseInfo.contractDetailDto.orderList
        : [];
      newOrderList.forEach((o) => {
        calRent.getTenancys(o);
      });
      let orderList =
        this.baseInfo.contractDetailDto && this.baseInfo.contractDetailDto.orderList;
      orderList.map((o, index) => {
        if (o.settlementType == 2 || o.settlementType == 3) {
          o.selfHireMonthly = o.hire;
          o.selfHire = 0;
        } else {
          o.selfHireMonthly = o.hireMonthly;
          o.selfHire = o.hire;
        }
        return {
          ...o,
        };
      });
      this.baseInfo.contractDetailDto.orderList = orderList;
      //原始的orderList 计算租期
      let originList = this.baseInfo.originContractDto.contractDetailDto.orderList
        ? this.baseInfo.originContractDto.contractDetailDto.orderList
        : [];
      originList.forEach((o) => {
        calRent.getTenancys(o);
      });
      this.baseInfo = {
        ...this.baseInfo,
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: newOrderList,
        },
        originContractDto: {
          ...this.baseInfo.originContractDto,
          contractDetailDto: {
            ...this.baseInfo.originContractDto.contractDetailDto,
            orderList: originList,
          },
        },
      };
    },
    //过滤选中数据
    getSelectData(rowTypes) {
      console.log("getSelectData" + JSON.stringify(rowTypes));
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
            enableTime: null,
            whole: null,
            surplusDay: null,
            hire: "0.00",
            hireMonthly: "0.00",
            selfHire: "0.00",
            selfHireMonthly: "0.00",
            orderNum: 1,
            carriageTypeName:
              this.carriageTypes.length > 0 ? this.carriageTypes[0].label : null,
            carriageType:
              this.carriageTypes.length > 0 ? this.carriageTypes[0].value : null,
            pledge: "0.00",
            settlementType: defaultS,
            tenancy: calRent.calculateDays(defaultDate, defaultDate, defaultS),
            total: "0.00",
            settlementTypeName:
              this.rentTypes.length > 0 ? this.rentTypes[0].label : null,
            changed: 2,
            originOrderId: null,
          },
        ];
      });

      let orderList = [...this.baseInfo.contractDetailDto.orderList, ...arr];
      this.baseInfo = {
        ...this.baseInfo,
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: orderList,
        },
      };
      console.log("baseInfo" + JSON.stringify(this.baseInfo));
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
        .catch((err) => {});
    },
    /**
     * 获取变更单号
     */
    getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, "HTBG");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          console.log("getBusinessNo" + result);
          this.baseInfo = {
            ...this.baseInfo,
            changeNo: result,
          };
          console.log("getBusinessNo" + JSON.stringify(this.baseInfo));
        })
        .catch((err) => {});
    },
    /**
     * 获取合同详情
     */
    getContractDetail() {
      uni.showLoading();
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO + "?id=" + this.contractId, "GET", null)
        .then((result) => {
          console.log(result, "result");
          uni.hideLoading();
          this.mesDic = {
            ...result,
          };
          let contractDetailDtoDic = this.mesDic.contractDetailDto
            ? this.mesDic.contractDetailDto
            : {};
          let monthConfig =
            (contractDetailDtoDic && contractDetailDtoDic.monthConfig !== undefined) ||
            contractDetailDtoDic.monthConfig !== null
              ? contractDetailDtoDic.monthConfig
              : "30";
          this.settlementObj = {
            ...this.settlementObj,
            value: monthConfig,
            label: monthConfig === "0" ? "自然月" : "30天为一个月",
          };
          let originList = result.contractDetailDto.orderList
            ? result.contractDetailDto.orderList
            : [];
          originList = originList.map((o) => {
            if (o.settlementType == 2 || o.settlementType == 3) {
              o.selfHireMonthly = o.hire;
              o.selfHire = 0;
            } else {
              o.selfHire = o.hire || 0;
              o.selfHireMonthly = o.hireMonthly || 0;
            }
            let day;
            if (o.endDate && o.beginDate) {
              day = new Date(o.endDate).getTime()>= new Date(o.beginDate).getTime()?
               differenceInDays(new Date(o.endDate), new Date(o.beginDate)) + 1 : null; //回显预计租期
            }

            return {
              ...o,
              surplusDay: day || "0",
              // ...calRent.getTenancys(o),
            };
          });
          let newOrderList = originList.map((o) => {
            if (o.settlementType == 2 || o.settlementType == 3) {
              o.selfHireMonthly = o.hire;
              o.selfHire = 0;
            } else {
              o.selfHire = o.hire || 0;
              o.selfHireMonthly = o.hireMonthly || 0;
            }
            return {
              ...o,
              originOrderId: o.id,
              enableTime: o.enableTime ? o.enableTime : null,
              changed: null,
            };
          });
          this.baseInfo = {
            ...result,
            changeNo: this.baseInfo.changeNo,
            originCustomerId: result.customerId ? result.customerId : null,
            originContractId: result.id ? result.id : null,
            businessKey: null,
            id: null,
            contractDetailDto: {
              ...result.contractDetailDto,
              orderList: newOrderList,
            },
            originContractDto: {
              ...result,
              contractDetailDto: {
                ...result.contractDetailDto,
                orderList: originList,
              },
            },
          };
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    /**
     * 获取原来合同对应的订单
     * @param {Object} item
     */
    getOriginOrder(item) {
      if (item.changed === 1 && item.originOrderId) {
        let originOrder = this.baseInfo.originContractDto.contractDetailDto.orderList.find(
          (o) => {
            return o.id === item.originOrderId;
          }
        );
        if (originOrder) {
          return {
            ...originOrder,
            settlementType: originOrder.settlementType,
            beginDate: originOrder.beginDate,
            endDate: originOrder.endDate,
            enableTime: originOrder.enableTime,
            machineList: originOrder.machineList ? originOrder.machineList : [],
          };
        } else {
          return null;
        }
      }
      return null;
    },
    /**
     * 修改
     * @param {Object} pos
     */
    modifyItem(pos) {
      this.isModify = true;
      this.baseInfo.contractDetailDto.orderList[pos].changed = 1;
    },
    /**
     * 撤回
     * @param {Object} item
     * @param {Object} pos
     */
    recallItem(item, pos) {
      this.isModify = false;
      console.log(this.baseInfo, "-----------------");
      let originOrder = this.baseInfo.originContractDto.contractDetailDto.orderList.find(
        (o) => {
          return o.id === item.originOrderId;
        }
      );
      console.log("originOrder", originOrder);
      this.baseInfo.contractDetailDto.orderList[pos] = {
        ...originOrder,
        originOrderId: originOrder.id,
        changed: null,
      };
      let orderList =
        this.baseInfo.contractDetailDto && this.baseInfo.contractDetailDto.orderList;
      orderList.map((o, index) => {
        if (o.settlementType == 2 || o.settlementType == 3) {
          o.selfHireMonthly = o.hire;
          o.selfHire = 0;
        } else {
          o.selfHireMonthly = o.hireMonthly;
          o.selfHire = o.hire;
        }
        return {
          ...o,
        };
      });
      this.baseInfo = {
        ...this.baseInfo,
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: [...this.baseInfo.contractDetailDto.orderList],
        },
      };
    },

    /** 删除
     * @param {Object} pos
     */
    deleteItem(pos) {
      this.baseInfo.contractDetailDto.orderList.splice(pos, 1);
      this.calMoney();
    },

    //显示弹窗
    remarkmethod(val) {
      this.baseInfo = {
        ...this.baseInfo,
        changeReason: val,
      };
      console.log("changeReason" + this.baseInfo);
    },
    //上传图片回调
    uploadfinish(val) {
      console.log("uploadfinish" + JSON.stringify(val));
      let list = val.data;
      this.baseInfo = {
        ...this.baseInfo,
        fileList: list,
      };
      console.log("this.baseInfo" + JSON.stringify(this.baseInfo));
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.baseInfo = {
        ...this.baseInfo,
        fileList: list,
      };
    },
    //显示时间选择器
    showTimePick: function (type, i) {
      this.pickType = type;
      this.curItem = i;
      console.log("showTimePick" + this.curItem);
      this.$refs.date.show();
    },
    getdebtMoney() {
      let allocatePrice = this.baseInfo.contractDetailDto.advance || "0";
      let paidAdvance = this.baseInfo.contractDetailDto.paidAdvance || "0";
      let allocatePriceNum = Number.parseFloat(allocatePrice) || 0;
      let paidAdvanceNum = Number.parseFloat(paidAdvance) || 0;
      let debitMoney =
        Number.parseFloat(allocatePriceNum) - Number.parseFloat(paidAdvanceNum);
      this.baseInfo.contractDetailDto = {
        ...this.baseInfo.contractDetailDto,
        debtAdvance: this.$datestr.doubleFloat(debitMoney),
      };
    },
    /*输入框监听*/
    textChange(val, mode) {
      if (mode === "project") {
        this.addMode("4"); // 项目信息有修改
      } else if (mode === "settledown") {
        this.addMode("3"); // 结算信息有修改
      }
      console.log(val, "textChange");
      if (val.type == "advance") {
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          advance: val.data,
        };
        setTimeout(() => {
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            advance: this.$gxfmethod.getMoneyPart(val.data),
          };
          this.getdebtMoney();
        }, 50);
      } else if (val.type == "allocatePrice") {
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          allocatePrice: val.data,
        };
        setTimeout(() => {
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            allocatePrice: this.$gxfmethod.getMoneyPart(val.data),
          };
        }, 50);
      }else if(val.type == "tripVal"){
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          tripVal: val.data,
        };
        setTimeout(() => {
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            tripVal: this.$gxfmethod.getMoneyPart(val.data),
          };
        }, 50);
      }else if (val.type == "covenants") {
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          covenants: val.data,
        };
      } else if (val.type == "returnPlace") {
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          returnPlace: val.data,
        };
      } else if (val.type == "deliveryPlace") {
        console.log(val.data, "deliveryPlace");
        this.baseInfo.contractDetailDto = {
          ...this.baseInfo.contractDetailDto,
          deliveryPlace: val.data,
        };
      } else if (val.type == "project") {
        this.baseInfo = {
          ...this.baseInfo,
          projectName: val.data,
          contractDetailDto: {
            ...this.baseInfo.contractDetailDto,
            projectName: val.data,
          },
        };
      }
    },
    showPick: function (type, i, mode) {
      if (mode === "project") {
        this.addMode("4"); // 项目信息有修改
      } else if (mode === "settledown") {
        this.addMode("3"); // 结算信息有修改
      }
      console.log(type, "type");
      this.pickType = type;
      this.curItem = i ? i : 0;
      switch (this.pickType) {
        case "constructionType":
          let choosedIdList = this.baseInfo.contractDetailDto.constructionType
            ? this.baseInfo.contractDetailDto.constructionType
            : [];
          uni.navigateTo({
            url:
              "/contractPages/contract/choose-work-content?choosedIdList=" +
              encodeURIComponent(JSON.stringify(choosedIdList)),
          });
          break;
        case "deliveryPlace":
          let addrObj = {
            address: this.baseInfo.contractDetailDto.deliveryPlace
              ? this.baseInfo.contractDetailDto.deliveryPlace
              : "",
            latitude: this.baseInfo.contractDetailDto.latitude
              ? this.baseInfo.contractDetailDto.latitude
              : "",
            longitude: this.baseInfo.contractDetailDto.longitude
              ? this.baseInfo.contractDetailDto.longitude
              : "",
            currentRadius: this.baseInfo.contractDetailDto.radius
              ? this.baseInfo.contractDetailDto.radius
              : "",
          };
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(addrObj) +
              "&showfence=true",
          });
          break;
        case "returnPlace":
          let returnPlaceaddrObj = {
            address: this.baseInfo.contractDetailDto.deliveryPlace
              ? this.baseInfo.contractDetailDto.deliveryPlace
              : "",
            latitude: this.baseInfo.contractDetailDto.latitude
              ? this.baseInfo.contractDetailDto.latitude
              : "",
            longitude: this.baseInfo.contractDetailDto.longitude
              ? this.baseInfo.contractDetailDto.longitude
              : "",
            currentRadius: this.baseInfo.contractDetailDto.radius
              ? this.baseInfo.contractDetailDto.radius
              : "",
          };
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(returnPlaceaddrObj) +
              "&showfence=true",
          });
          break;
        case "isShowMinTenancy":
          this.selectList = [...this.minTenancyList];
          this.$refs.selector.show();
          break;
        case "allocateFlag":
          this.selectList = [...this.allocateFlagList];
          this.$refs.selector.show();
          break;
        case "invoiceType":
          this.selectList = [...this.invoiceTypeList];
          this.$refs.selector.show();
          break;
        case "renterTripType":
          this.selectList = [...this.renterTripTypeList];
          this.$refs.selector.show();
          break;
        case "tripCalType":
          this.selectList = [{label:'按台计费',value:'0'},{label:'按趟计费',value:"1"}]
          this.$refs.selector.show();
          break;
        case "settlementDay":
          this.selectList = [...this.settlementDayList];
          this.$refs.selector.show();
          break;
        case "settlementDayType":
          this.selectList =
            this.baseInfo.contractDetailDto.paymentType == "3"
              ? [...this.PaysettlementDayTypeList]
              : [...this.MonthsettlementDayTypeList];
          this.$refs.selector.show();
          break;
        case "paymentType":
          this.selectList = this.paymentTypeList ? this.paymentTypeList : [];
          this.$refs.selector.show();
          break;
        case "settlementType":
          this.selectList = this.settleList ? this.settleList : [];
          this.$refs.selector.show();
          break;
        case "rentType": //租赁方式
          this.selectList = this.rentTypes ? this.rentTypes : [];
          this.$refs.selector.show();
          break;
        case "carriageType": //运费方式
          this.selectList = this.carriageTypes ? this.carriageTypes : [];
          this.$refs.selector.show();
          break;
        case "settleMode":
          this.selectList = this.settleModeList ? this.settleModeList : [];
          this.$refs.selector.show();
          break;
      }
    },
    /*获取数据完成*/
    /*底部弹窗选择类型*/
    onConfirm: function (val) {
      switch (this.pickType) {
        case "isShowMinTenancy":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            isShowMinTenancy: val.checkArr.value == "1" ? true : false,
          };
          break;
        case "allocateFlag":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            allocateFlag: val.checkArr.value == "1" ? true : false,
          };
          if (val.checkArr.value == "0") {
            // 如果不配备人员,单价重置
            this.baseInfo.contractDetailDto.allocatePrice = null;
          }
          break;
        case "invoiceType":
          let invoiceFlag = false;
          if (val.checkArr.value === "0") {
            invoiceFlag = false;
            // 如果不开发票,重置发票税率
            this.baseInfo.contractDetailDto.invoiceTax = null;
          } else {
            invoiceFlag = true;
          }
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            invoiceTypeName: val.checkArr.label,
            invoiceType: val.checkArr.value,
            invoiceFlag: invoiceFlag,
          };
          break;
        case "renterTripType":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            renterTripTypeName: val.checkArr.label,
            renterTripType: val.checkArr.value,
          };
          break;
        // 按趟计费
        case "tripCalType":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            tripCalType: val.checkArr.value,
            tripVal: val.checkArr.value == '0' ? null : this.baseInfo.contractDetailDto.tripVal
          };
          break;
        case "settlementDay":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            settlementDayName: val.checkArr.label,
            settlementDay: val.checkArr.value,
          };
          break;
        case "settlementDayType":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            settlementDayTypeName: val.checkArr.label,
            settlementDayType: val.checkArr.value,
          };
          if (
            this.baseInfo.contractDetailDto &&
            (this.baseInfo.contractDetailDto.paymentType == "2" ||
              this.baseInfo.contractDetailDto.paymentType == "3") &&
            this.baseInfo.contractDetailDto.settlementDayType == "2"
          ) {
            if (!this.baseInfo.contractDetailDto.settlementDay) {
              this.baseInfo.contractDetailDto = {
                ...this.baseInfo.contractDetailDto,
                settlementDayName: this.settlementDayList[0].label,
                settlementDay: this.settlementDayList[0].value,
              };
            }
          }
          // 如果settlementDayType不是固定日结算，或paymentType不是月结，设置settlementDay[结算日]为null
          if (
            this.baseInfo.contractDetailDto &&
            (this.baseInfo.contractDetailDto.paymentType != "2" ||
              this.baseInfo.contractDetailDto.settlementDayType != "2")
          ) {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              settlementDay: null,
            };
          }
          break;
        case "paymentType":
          this.baseInfo.contractDetailDto = {
            ...this.baseInfo.contractDetailDto,
            paymentTypeName: val.checkArr.label,
            paymentType: val.checkArr.value,
          };
          // 如果settlementDayType是退场付清，设置settlementDay[结算日类型]为null
          if (
            this.baseInfo.contractDetailDto &&
            this.baseInfo.contractDetailDto.paymentType == "1"
          ) {
          } else {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              settlementDayType: null,
            };
          }
          // 如果settlementDayType不是预付，设置advance[预付金额]、prePayWorkInDays[到账延迟]为null
          if (
            this.baseInfo.contractDetailDto &&
            this.baseInfo.contractDetailDto.paymentType == "3"
          ) {
          } else {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              advance: null,
              prePayWorkInDays: null,
            };
          }
          // 如果settlementDayType不是固定日结算，或paymentType不是月结，设置settlementDay[结算日]为null
          if (
            this.baseInfo.contractDetailDto &&
            (this.baseInfo.contractDetailDto.paymentType != "2" ||
              this.baseInfo.contractDetailDto.settlementDayType != "2")
          ) {
            this.baseInfo.contractDetailDto = {
              ...this.baseInfo.contractDetailDto,
              settlementDay: null,
            };
          }

          break;
        case "settlementType":
          this.settlementObj = {
            value: val.checkArr.value,
            label: val.checkArr.label,
          };
          this.baseInfo = {
            ...this.baseInfo,
            contractDetailDto: {
              ...this.baseInfo.contractDetailDto,
              monthConfig: this.settlementObj.value,
            },
          };
          break;
        case "carriageType": //运费方式
          this.baseInfo.contractDetailDto.orderList[this.curItem].carriageTypeName =
            val.checkArr.label;
          this.baseInfo.contractDetailDto.orderList[this.curItem].carriageType =
            val.checkArr.value;

          break;
        case "rentType": //租赁方式
          this.baseInfo.contractDetailDto.orderList[this.curItem].settlementTypeName =
            val.checkArr.label;
          this.baseInfo.contractDetailDto.orderList[this.curItem].settlementType =
            val.checkArr.value;
          this.baseInfo.contractDetailDto.orderList[this.curItem].whole = null;
          this.baseInfo.contractDetailDto.orderList[this.curItem].surplusDay = null;
          if (
            this.baseInfo.contractDetailDto.orderList[this.curItem].settlementType === "4"
          ) {
            this.baseInfo.contractDetailDto.orderList[this.curItem].hireMonthly = 0.0;
          }
          this.calMoney();

          break;
        case "beginDate": //进场日
          this.baseInfo.contractDetailDto.orderList[this.curItem].beginDate =
            val.result + " 00:00:00";

          this.calMoney();

          break;
        case "endDate": //预计结束时间
          this.$set(
            this.baseInfo.contractDetailDto.orderList[this.curItem],
            "endDate",
            val.result + " 23:59:59"
          );
          this.calMoney();

          break;
        case "settleMode":
          // this.baseInfo.settleMode = val.checkArr.value;
          this.baseInfo = {
            ...this.baseInfo,
            settleMode: val.checkArr.value,
          };
          break;
        case "enableTime":
          this.$set(
            this.baseInfo.contractDetailDto.orderList[this.curItem],
            "enableTime",
            val.result + " 00:00:00"
          );
          break;

        default:
          break;
      }
    },
    checkNum(e, i, item) {
      console.log(item, "item");
      var val = e.target.value || "";
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
      var val = e.target.value || "";
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
        if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
          val = val.substring(0, 1);
          this.getInputData(type, val, i);
          return;
        }
        this.getInputData(type, val, i);
      }, 50);
    },
    //给输入框赋值
    getInputData(type, val, i) {
      console.log("type:" + type);
      if (type === "selfHire") {
        this.baseInfo.contractDetailDto.orderList[i].selfHire = val;
        this.$forceUpdate();
        this.calMoney();
      } else if (type === "selfHireMonthly") {
        this.baseInfo.contractDetailDto.orderList[i].selfHireMonthly = val;
        this.calMoney();
      } else if (type === "pledge") {
        this.baseInfo.contractDetailDto.orderList[i].pledge = val;
        this.calMoney();
      } else if (type === "carriage") {
        this.baseInfo.contractDetailDto.orderList[i].carriage = val;
        this.calMoney();
      } else if (type === "orderNum") {
        this.baseInfo.contractDetailDto.orderList[i].orderNum = val ? Number(val) : "";
        this.calMoney();
      } else if (type === "whole") {
        this.baseInfo.contractDetailDto.orderList[i].whole = val.detail.value;
        this.calMoney();
      } else if (type === "surplusDay") {
        this.baseInfo.contractDetailDto.orderList[i].surplusDay = val.detail.value;
        this.baseInfo.contractDetailDto.orderList[i].tenancy = val.detail.value ? val.detail.value+'天': null
        let date = addDays(
          parseISO(this.baseInfo.contractDetailDto.orderList[i].beginDate).getTime(),
          val.detail.value - 1
        );
        this.baseInfo.contractDetailDto.orderList[i].endDate =
          format(date, "yyyy-MM-dd") + " 23:59:59";
        this.$forceUpdate();
        this.calMoney();
      }
    },
    //小计
    calMoney() {
      let totalMoney = 0;
      console.log("o:" + JSON.stringify(this.baseInfo.contractDetailDto.orderList));
      let monthConfig =
        (this.baseInfo.contractDetailDto &&
          this.contractDic.contractDetailDto.monthConfig !== null) ||
        this.contractDic.contractDetailDto.monthConfig !== undefined
          ? this.contractDic.contractDetailDto.monthConfig
          : "30"; //如果没有传 默认按照30天来算
      this.baseInfo.contractDetailDto.orderList.forEach((o) => {
        calRent.calculateTotalSelf(o, monthConfig);
        let itemTotal = Number.parseFloat(o.total);
        console.log("itemTotal" + itemTotal);
        totalMoney += itemTotal;
      });
      // this.total = totalMoney.toFixed(2)
      // console.log("totalMoney" + this.total)
    },
    getDate(time) {
      if (!time) return null;
      return time.split(/\s+/)[0];
    },
    goTo(type) {
      switch (type) {
        case "customer":
          uni.navigateTo({
            url:
              "/otherPages/linkman/linkman?regio=" +
              this.baseInfo.originContractDto.orgId +
              "&leader=" +
              this.baseInfo.originContractDto.contractDetailDto.customerSalesman,
          });
          break;
        case "addVehicle": //新增设备
          uni.navigateTo({
            url: `/contractPages/contract/choose-vehicle?types=${encodeURIComponent(
              JSON.stringify(this.baseInfo.contractDetailDto.orderList)
            )}&tripCalType=${JSON.stringify(this.baseInfo.contractDetailDto.tripCalType || "0")}`,
          });
          break;
        case "contractList": //新增设备
          uni.navigateTo({
            url:
              "/businessPages/invoice/contract-choose?type=changeContract&state=5,6,7,8&contractType=1",
          });
          break;

        default:
          break;
      }
    },
    //去指定设备
    showAssignPop(item, i) {
      console.info(i);
      this.curItem = i;

      if (item.changed && item.changed === 2) {
        //可编辑，去指定设备
        if (this.baseInfo.contractDetailDto.orderList[i].orderNum <= 0) {
          uni.showToast({
            title: "请选择设备数量",
            icon: "none",
          });
          return;
        }

        uni.navigateTo({
          url:
            "/contractPages/contract/assign-vehicle?item=" +
            encodeURIComponent(
              JSON.stringify(this.baseInfo.contractDetailDto.orderList[this.curItem])
            ),
        });
      } else {
        //不可编辑情况下，，跳详情
        if (item.machineList && item.machineList.length > 0) {
          uni.navigateTo({
            url:
              "/contractPages/contract/assigned-vehicle?machineList=" +
              encodeURIComponent(JSON.stringify(item.machineList)),
          });
        }
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
    getCustomerContract() {
      let param = {
        current: 1,
        size: 1,
        customerId: this.baseInfo.customerId,
      };
      this.$network
        .getData(this.$url.CONTRACT_LIST, "POST", param)
        .then((result) => {
          this.isHaveExecution = result.records.some(
            (o) => o.state === "5" || "6" || "7"
          );
          this.isHaveCompleted = result.records.some((o) => o.state === "4" || "8");
        })
        .catch((err) => {});
    },
    changeCustomer() {
      this.isChangeCustomer = true;
    },
    changeRadio(type, value) {
      switch (type) {
        case "execution":
          this.baseInfo = {
            ...this.baseInfo,
            executionFlag: value,
          };
          break;
        case "completed":
          this.baseInfo = {
            ...this.baseInfo,
            completedFlag: value,
          };
          break;
        default:
          break;
      }
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    //是否查找到‘00：00：00’
    findNotStr(str, findstr) {
      str = str || "";
      return str.indexOf(findstr) === -1;
    },
    checkData() {
      let self = this;
      if (
        this.baseInfo.contractDetailDto.paymentType == "2" ||
        this.baseInfo.contractDetailDto.paymentType == "3"
      ) {
        if (!this.baseInfo.contractDetailDto.settlementDayTypeName) {
          this.showToast("请选择结算日类型");
          return Promise.reject("fail");
        }
        if (
          this.baseInfo.contractDetailDto.settlementDayType == "2" &&
          !this.baseInfo.contractDetailDto.settlementDay
        ) {
          this.showToast("请选择结算日");
          return Promise.reject("fail");
        }
      }
      if (!this.baseInfo.contractDetailDto.renterTripTypeName) {
        this.showToast("请选择运费减免约定");
        return Promise.reject("fail");
      }
      if (!this.baseInfo.contractDetailDto.projectName) {
        this.showToast("请填写项目名");
        return Promise.reject("fail");
      }
      if (!this.baseInfo.contractDetailDto.constructionTypeName) {
        this.showToast("请选择作业内容");
        return Promise.reject("fail");
      }
      if (!this.baseInfo.contractDetailDto.deliveryPlace) {
        this.showToast("请选择交机地点");
        return Promise.reject("fail");
      }
      if (
        !self.baseInfo.contractDetailDto.orderList ||
        (self.baseInfo.contractDetailDto.orderList &&
          self.baseInfo.contractDetailDto.orderList.length <= 0)
      ) {
        self.showToast("请选择设备信息");
        return Promise.reject("fail");
      }
      if (
        self.baseInfo.contractDetailDto.orderList.some(
          (o) => !o.orderNum || o.orderNum === 0
        )
      ) {
        self.showToast("设备数量必须大于0");
        return Promise.reject("fail");
      }
      if (
        self.baseInfo.settleMode == 2 &&
        !self.baseInfo.contractDetailDto.orderList.some((o) => o.enableTime)
      ) {
        self.showToast("变更生效时间不能为空");
        return Promise.reject("fail");
      }

      let hasDuplicate = hasDupliaceDemand(this.baseInfo.contractDetailDto.orderList);
      if (hasDuplicate) {
        this.showToast("设备需求重复，请修改");
        return Promise.reject("fail");
      }
      self.baseInfo.contractDetailDto.orderList.map((o, index) => {
        if (o.selfHire && o.selfHireMonthly) {
          // 日租转月租
          o.settlementType = "4";
          o.hire = o.selfHire;
          o.hireMonthly = o.selfHireMonthly;
        } else if (o.selfHire && !o.selfHireMonthly) {
          o.settlementType = "1";
          o.hire = o.selfHire;
          o.hireMonthly = 0;
        } else if (!o.selfHire && o.selfHireMonthly) {
          o.settlementType = "2";
          o.hire = o.selfHireMonthly;
          o.hireMonthly = 0;
        } else {
          o.hire = 0;
          o.hireMonthly = 0;
        }
        return {
          ...o,
        };
      });
      if (
        self.baseInfo.contractDetailDto.orderList.some(
          (o) =>
            (o.hire == "" && o.hireMonthly == "") || (o.hire == 0 && o.hireMonthly == 0)
        )
      ) {
        self.showToast("租金必须大于0");
        return Promise.reject("fail");
      }
      let pros = [
        "type",
        "height",
        "machineType",
        "beginDate",
        "carriage",
        "endDate",
        "hire",
        "hireMonthly",
        "orderNum",
        "carriageType",
        "pledge",
        "settlementType",
      ];
      this.baseInfo.contractDetailDto.orderList = this.baseInfo.contractDetailDto.orderList.map(
        (o) => {
          let o2 = this.getOriginOrder(o);
          if (o.changed === 1) {
            let isDif = false; //是否和原来的订单一致：默认一致
            pros.forEach((pro) => {
              //判断不一样的条件
              if (
                ((pro === "beginDate" || pro === "endDate") &&
                  o[pro] != this.getDate(o2[pro])) ||
                (pro !== "beginDate" && pro !== "endDate" && o[pro] != o2[pro])
              ) {
                isDif = true;
                return;
              }
            });
            return {
              ...o,
              changed: isDif ? 1 : null,
            };
          } else {
            return { ...o };
          }
        }
      );

      let originList = this.baseInfo.originContractDto.contractDetailDto.orderList;
      let orderList = this.baseInfo.contractDetailDto.orderList;
      let changeMode = this.changeMode;

      if (this.baseInfo.customerId !== this.baseInfo.originCustomerId) {
        this.addMode("1"); // 客户信息有修改
      }

      if (
        this.baseInfo.contractDetailDto.orderList.some(
          (o) => o.changed == 1 || o.changed == 2
        )
      ) {
        this.addMode("2"); // 设备信息有修改
      }
      // TODO-CONTRACT-CHANGE:判断模式3、模式4、模式5是否发生变化
      // 计划，一开始存储一份原数据，然后在这个位置，根据原数据字段，比较是否发生变化
      // 若发生变化，添加对应模式
      if (this.changeMode && this.changeMode.length == 0) {
        self.showToast("至少进行一项改动");
        return Promise.reject("fail");
      }
      this.baseInfo = {
        ...this.baseInfo,
        changeMode: changeMode,
        createBy: this.changeUser.createBy ? this.changeUser.createBy : "",
        createName: this.changeUser.createName ? this.changeUser.createName : "",
        createTime: this.changeUser.createTime
          ? this.changeUser.createTime
          : hoursUtil.datetimeSFormat(new Date().getTime()),
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: orderList,
        },
        originContractDto: {
          ...this.baseInfo.originContractDto,
          contractDetailDto: {
            ...this.baseInfo.originContractDto.contractDetailDto,
            orderList: originList,
          },
        },
      };
      return Promise.resolve("success");
    },
    preSubmit(val) {
      console.log(val, "preSubmit");
      uni.showLoading({
        mask: true,
      });
      this.$network
        .getData(
          this.$url.PRE_CONTRACT_EXPANSE.replace(/{contractId}/, this.contractId).replace(
            /{contractNo}/,
            this.baseInfo.businessNo
          ),
          "POST",
          null
        )
        .then((result) => {
          console.log(result, "preSubmit");
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
      console.log(val, "submit");
      uni.showLoading({
        mask: true,
      });
      let monthConfig =
        this.baseInfo &&
        this.baseInfo.contractDetailDto &&
        this.baseInfo.contractDetailDto.monthConfig;
      let orderList =
        this.baseInfo &&
        this.baseInfo.contractDetailDto &&
        this.baseInfo.contractDetailDto.orderList;
      orderList.map((o, index) => {
        if (Number(o.selfHire) && Number(o.selfHireMonthly)) {
          // 日租转月租
          o.settlementType = "4";
          o.hire = o.selfHire;
          o.hireMonthly = o.selfHireMonthly;
        } else if (Number(o.selfHire) && !Number(o.selfHireMonthly)) {
          o.settlementType = "1";
          o.hire = o.selfHire;
          o.hireMonthly = 0;
        } else if (!Number(o.selfHire) && Number(o.selfHireMonthly)) {
          o.settlementType = "2";
          o.hire = o.selfHireMonthly;
          o.hireMonthly = 0;
        }
        //月租选择自然月  settlementType设为3
        if (o.settlementType == "2" && monthConfig === "0") {
          o.settlementType = "3";
        }
        if(o.tenancy == '--'){
          o.tenancy = null
        }
        if(this.baseInfo && 
        this.baseInfo.contractDetailDto && 
        this.baseInfo.contractDetailDto.tripCalType == '1'){
          o.carriage = 0,
          o.carriageType = "1"
        }
        return {
          ...o,
        };
      }); 
      this.baseInfo.contractDetailDto.orderList = [...orderList];
      this.$network
        .getData(this.$url.CREATE_CONTRACT_CHANGE + val, "POST", this.baseInfo)
        .then((result) => {
          console.log(JSON.stringify(result));
          uni.$emit("refresh-contract-list", {
            type: "contractChange",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.showToast({
            icon: "none",
            title: "合同变更成功",
          });
          uni.navigateBack({
            delta: 1,
          });
          uni.hideLoading();
        })
        .catch((err) => {
          console.log(err, "submiterr");
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.details ? err.details[0] : err.message,
          });
        });
    },
    // 添加修改模式
    addMode(newMode) {
      if (!this.changeMode.includes(newMode)) {
        this.changeMode.push(newMode);
      }
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
  margin: 4px 0;
  padding: 6px 0;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  line-height: 20px;
  height: 20px;
  font-weight: bold;
  display: flex;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}

.model-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 8px;
  // margin: 0px 8px 8px 8px;
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
  justify-content: space-between;
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
  padding: 0px 8px;
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
