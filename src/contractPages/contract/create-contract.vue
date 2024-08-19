<template>
  <view class="create-contract-bg">
    <c-nav-bar flexAlign="center">新建合同</c-nav-bar>
    <create-step
      ref="wf"
      processKey="contract"
      @submitApply="submit"
      @preview="preview"
      :orgId="dataDic.orgId"
      :itemData="backDic"
      @data-form="getBackData"
      :updateObj="dataDic"
      :businessOwner="dataDic.customerSalesman"
      :isUpdate="isUpdate"
      :isContract="true"
    >
      <template #total>
        <view class=""
          >预计营收：<span style="color: #e60000">¥{{ dataDic.totalMoney }}</span></view
        >
      </template>
      <template #preview>
        <view class="cancel-btn" @click="preview"><text>预览</text></view>
      </template>
      <baseInforMation
        :dataDic="dataDic"
        @clickItem="clickItem"
        @textChange="textChange"
      />
      <settleInforMation
        :settlementObj="settlementObj"
        :dataDic="dataDic"
        @clickItem="clickItem"
        @clickSelect="clickSelect"
        @textChange="textChange"
        @prePayChange="handleprePayChange"
        @invoiceChange="handleinvoiceChange"
      />
      <projectInforMation
        :dataDic="dataDic"
        @minTenancyChange="handleMinTenancyChange"
        @clickItem="clickItem"
        @textChange="textChange"
        :isEdit="true"
      />
      <deviceInforMation
        ref="deviceInforMation"
        :dataDic="dataDic"
        @deleteItem="deleteItem"
        contractType="1"
        listKey="orderList"
      />
      <authorizedPersonInformation
        ref="authorizedPersonInformation"
        v-if="dataDic.customerId"
        :dataDic="dataDic"
        @dialog="handleDialog"
        @textChange="textChange"
      />
      <supplementInforMation
        :dataDic="dataDic"
        @clickItem="clickItem"
        @textChange="textChange"
      />
    </create-step>
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
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import createStep from "@/components/workflow/create-step.vue";
import hoursUtil from "@/common/util/day-working-hours.js";
import contractMixin from "./contractMixin/index.js";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import baseInforMation from "@/contractPages/contract/create-contract-components/base-information.vue";
import deviceInforMation from "@/contractPages/contract/create-contract-components/device-information.vue";
import authorizedPersonInformation from "@/contractPages/contract/create-contract-components/authorized-person-information.vue";
import settleInforMation from "@/contractPages/contract/create-contract-components/settle-information.vue";
import projectInforMation from "@/contractPages/contract/create-contract-components/project-information.vue";
import supplementInforMation from "@/contractPages/contract/create-contract-components/supplement-information.vue";
import { differenceInDays } from "date-fns";
export default {
  mixins: [contractMixin],
  components: {
    createStep,
    baseInforMation,
    deviceInforMation,
    authorizedPersonInformation,
    settleInforMation,
    projectInforMation,
    supplementInforMation,
    wPicker,
  },
  data() {
    return {
      navBtns: [
        {
          text: "草稿",
          fontSize: "14px",
          color: "#E60000",
          width: "auto",
        },
      ],
      PayMonthsettlementDayTypeList: [], //结算日类型-预付月结
      // settlementDayList: [], //结算日

      selectType: "",
      dataDic: {
        debtAdvance: "0.00",
        allocateFlag: false,
        workInAndOutUser: null,
        settlementUser: null,
        contractGuarantorUser: null,
        totalMoney: "0",
        orderList: [],
        paperContractNo: "",
        prePayWorkInDays: "",
        invoiceTax: "",
        isShowMinTenancy: false,
        estimatedRent: "", //合同预估租金
      },
      backDic: null, //退回null
      isUpdate: false,
      isGoToBusiness: false,
      isShowConfig: true,
      defaultProjectName: "",
      version: null,
      previewFirst: true,
    };
  },
  async onLoad(option) {
    // this.defaultProjectName = this.$gxfmethod.defaultProjectName()
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowConfig = obj.value === "liangXu" ? false : true;
      }
    }
    await this.setOrgAndSaleman().then((obj) => {
      console.log(obj, "setOrgAndSaleman");
      this.dataDic = {
        ...this.dataDic,
        ...obj,
      };
    });
    if (option.link) {
      //个人
      let obj = JSON.parse(decodeURIComponent(option.link));
      this.isGoToBusiness = true;
      let c = {
        customerId: obj.id, //客户名称ID
        customerName: obj.name, //客户名称
        contactId: null, //联系人ID
        phoneNum: obj.phoneNum, //联系人手机号
        contactName: obj.name, //联系人名称
        customerSalesmanName: obj.salesmanName,
        customerSalesman: obj.salesman,
        customerType: 2,
      };
      this.setCustomerInfo(c);
    }
    if (option.clink) {
      //企业
      let obj = JSON.parse(decodeURIComponent(option.clink));
      this.isGoToBusiness = true;
      let dict = obj.contactsList[0];
      let c = {
        customerId: obj.id, //客户名称ID
        customerName: obj.name, //客户名称
        contactId: dict.id, //联系人ID
        phoneNum: dict.phoneNum, //联系人手机号
        contactName: dict.name, //联系人名称
        customerSalesmanName: obj.salesmanName,
        customerSalesman: obj.salesman,
        customerType: 1,
      };
      this.setCustomerInfo(c);
    }
    //是否修改
    this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false) : false;
    //是否是被退回等处理的状态
    if (option.item) {
      this.backDic = JSON.parse(decodeURIComponent(option.item));
    }
    //是否有合同号
    if (option.contractNo) {
      this.loadDetailData(option.contractNo);
    }
    //没有合同号、也不是需要处理的状态生成新的合同单号
    if (!this.isUpdate && !option.item) {
      // 交机地点填充到当前的地址
      // this.$gxfmethod.getCurAddress((obj) => {
      // this.dataDic = {
      //   ...this.dataDic,
      //   deliveryPlace: obj,
      //   returnPlace: obj,
      // };
      // });
      this.getBusinessNo();
    }
    /*
      加载字典项配置
      */
  },
  methods: {
    onNavBarButtonTap(e) {
      //接口保存草稿
      uni.showLoading({
        mask: true,
      });
      let isnext = true;
      if (this.dataDic.orderList && this.dataDic.orderList.length > 0) {
        for (let i = 0; i < this.dataDic.orderList.length; i++) {
          let m = this.dataDic.orderList[i];
          for (let j = i + 1; j < this.dataDic.orderList.length; j++) {
            let n = this.dataDic.orderList[j];
            if (
              m.type === n.type &&
              m.height === n.height &&
              m.settlementType === n.settlementType &&
              this.$datestr.doubleFloat(m.hire) == this.$datestr.doubleFloat(n.hire) &&
              this.$datestr.doubleFloat(m.hireMonthly) ==
                this.$datestr.doubleFloat(n.hireMonthly)
            ) {
              isnext = false;
            }
          }
        }
      }
      if (isnext === false) {
        this.showToast("订单中有类型、高度、租赁方式、租金重复,不可提交");
        return;
      }
      this.constructData();
      this.checkprojectName()
        .then(() => {
          this.$network
            .getData(this.$url.EDIT_CONTRACT + "?draft=true", "POST", this.dataDic)
            .then((result) => {
              uni.hideLoading();
              uni.$emit("refresh-contract-list", {
                type: "contract",
              });
              this.showToast("草稿保存成功");
              uni.$emit("refreshList", {
                type: "",
              });
              uni.navigateBack({});
            })
            .catch((err) => {
              this.showToast(err.message);
            });
        })
        .catch((msg) => {
          if (msg) {
            this.showToast(msg);
          }
          // this.showToast('已存在客户名称、项目名称、业务负责人都相同的合同，请修改');
        });
    },
    setOrgAndSaleman() {
      return new Promise(async (resolve, reject) => {
        let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
        console.log(resData, "resData---------------------------");
        let dataObj = {};
        if (resData) {
          //默认当前用户的区域和当前用户（如果用户是业务人员）为合同业务负责人
          let resOrgName = resData.orgName;
          let arr = resOrgName.split("|");
          dataObj = {
            orgId: resData.orgIds[0],
            orgName: arr[0],
          };
          if (this.$gxfmethod.issameRoleType(resData, this.$savekey.USER_ROLE_BUSINESS)) {
            dataObj = {
              ...dataObj,
              customerSalesman: resData.id,
              customerSalesmanName: resData.username,
            };
          }
        }
        let userList = await this.$network.getData(this.$url.USER_LEADERS, "GET", {
          showAdmin: false,
          orgId: dataObj.orgId,
          isAll: true,
          roleType: this.$savekey.USER_ROLE_BUSINESS,
        });
        this.userList = userList.map((dict) => {
          return {
            label: dict.username,
            value: dict.id,
            orgIds: dict.orgIds,
          };
        });
        resolve({
          ...dataObj,
        });
      });
    },

    resetPaymentTypeDayData(e, dict) {
      this.dataDic = {
        ...this.dataDic,
        paymentType: e.value,
        paymentTypeName: e.label,
        settlementDayTypeName: dict.label,
        settlementDayType: dict.value,
        settlementDayName: this.settlementDayList[0].label,
        settlementDay: this.settlementDayList[0].value,
      };
    },
    getdebtMoney() {
      let allocatePrice = this.dataDic.advance || "0";
      let paidAdvance = this.dataDic.paidAdvance || "0";
      let allocatePriceNum = Number.parseFloat(allocatePrice) || 0;
      let paidAdvanceNum = Number.parseFloat(paidAdvance) || 0;
      let debitMoney =
        Number.parseFloat(allocatePriceNum) - Number.parseFloat(paidAdvanceNum);
      this.dataDic = {
        ...this.dataDic,
        debtAdvance: this.$datestr.doubleFloat(debitMoney),
      };
    },
    getMachineTypes(names) {
      return names.join(",");
    },

    addItem() {
      this.$refs.deviceInforMation();
    },

    /*网络数据字典项*/
    loadDetailData(contractNo) {
      uni.showLoading();
      this.$network
        .getData(
          this.$url.CONTRACT_DEATIL_BY_NO + "?businessNo=" + contractNo,
          "GET",
          null
        )
        .then((result) => {
          console.log(result, "result111");
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
          let orderList = contractDetailDtoDic.orderList
            ? contractDetailDtoDic.orderList
            : [];
          console.log(orderList, "orderList222");
          let neworderList = orderList.map((o) => {
            let obj = {
              ...o,
              beginDate: this.getDate(o.beginDate),
              endDate: this.getDate(o.endDate),
            };
            let day =
              differenceInDays(new Date(obj.endDate), new Date(obj.beginDate)) + 1; //回显预计租期
            // let param = calRent.getTenancys(o);
            return {
              ...o,
              // whole: param.whole,
              surplusDay: day,
            };
          });
          this.dataDic = {
            ...this.dataDic,
            ...this.mesDic,
            ...contractDetailDtoDic,
            orderList: neworderList,
          };
          this.calTotal();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: "none",
          });
          uni.hideLoading();
        });
    },
    //获取单号
    getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, "HT");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.dataDic = {
            ...this.dataDic,
            businessNo: result,
            contractType: "1",
            contractTypeName: "普通合同",
            constructionType: ["7"], //施工类型
            constructionTypeName: "其他", //施工类型
          };
        })
        .catch((err) => {});
    },
    getDate(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    getBackData(val) {
      this.mesDic = JSON.parse(val);
      console.log(this.mesDic, "getBackData");
      let contractDetailDtoDic = this.mesDic.contractDetailDto
        ? this.mesDic.contractDetailDto
        : {};
      let orderList = contractDetailDtoDic.orderList
        ? contractDetailDtoDic.orderList
        : [];
      let neworderList = orderList.map((o) => {
        let obj = {
          ...o,
          beginDate: this.getDate(o.beginDate),
          endDate: this.getDate(o.endDate),
        };
        let day = differenceInDays(new Date(o.endDate), new Date(o.beginDate)) + 1; //回显预计租期
        return {
          ...o,
          // whole: param.whole,
          surplusDay: day,
        };
      });
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
      this.dataDic = {
        ...this.dataDic,
        ...this.mesDic,
        ...contractDetailDtoDic,
        orderList: neworderList,
        isShowMinTenancy: contractDetailDtoDic.minTenancy ? true : false,
      };
      this.calTotal();
    },

    submit(val) {
      let _this = this;
      uni.showLoading({
        mask: true,
      });
      if (this.version) {
        this.dataDic.version = this.version;
      }
      this.dataDic.contractDetailDto = {
        ..._this.dataDic.contractDetailDto,
        monthConfig: _this.settlementObj.value,
        orderList: _this.dataDic.contractDetailDto.orderList.map((o, i) => {
          //月租选择自然月  settlementType设为3
          if (o.settlementType == "2" && _this.settlementObj.value === "0") {
            o.settlementType = "3";
          }
          // tenancy
          if (o.beginDate && o.endDate && !o.tenancy) {
            let day = differenceInDays(new Date(o.endDate), new Date(o.beginDate)) + 1; //回显预计租期
            o.tenancy = day + "天";
          }
          if(_this.dataDic.tripCalType == "1"){
            o.carriage = 0,
            o.carriageType = "1"
          }
          return {
            ...o,
          };
        }),
      };
      this.$network
        .getData(this.$url.EDIT_CONTRACT + val, "POST", this.dataDic)
        .then((result) => {
          uni.$emit("refresh-contract-list", {
            type: "contract",
          });
          uni.$emit("refreshList", {
            type: "",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.showToast({
            icon: "none",
            title: "创建合同成功",
          });
          if (this.isGoToBusiness) {
            uni.$emit("goto-business", {
              type: "apply",
            });
          } else {
            uni.navigateBack({
              delta: 1,
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: err.message,
            icon: "none",
          });
        });
    },
    preview() {
      this.$refs.wf.validate()
        .then((res) => {
          this.constructData();
          this.$gxfmethod.downFunc(this.$url.CONTRACT_PREVIEWCONTRACT, 'POST', this.dataDic, this.dataDic.contractDetailDto.projectName+'.pdf')
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            uni.showToast({ title: errors[0].message, icon: "none" });
          }
        }); 
    },
    // downxlsc(url, headerDic) {
    //   let customerName = this.dataDic.customerName ? this.dataDic.customerName : "";
    //   let projectName = this.dataDic.projectName ? this.dataDic.projectName : "";
    //   console.log(url);
    //   console.log(projectName);
    //   console.log(customerName);

    //   let name = "合同-" + customerName + projectName + "-";
    //   if (headerDic != null) {
    //     let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
    //     this.$gxfmethod.downFunc(url, "GET", undefined, filename);
    //   } else {
    //     let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
    //     this.$gxfmethod.downFuncNoHead(url, "GET", undefined, filename);
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
.create-contract-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
  width: 100%;
  padding: 10px 0px;
}

.cancel-btn {
  display: flex;
  width: 72px;
  height: 32px;
  border-radius: 6px;
  margin-right: 15px;
  background: #fe931f;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
