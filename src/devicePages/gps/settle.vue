<template>
  <view class="create-contract-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <p class="title"><span class="line"></span>项目信息</p>
    <projectInforMation
      :dataDic="dataDic"
      @clickItem="clickItem"
      @textChange="textChange"
    />
    <p class="title"><span class="line"></span>合同信息</p>

    <baseInforMation :dataDic="dataDic" @clickItem="clickItem" @textChange="textChange" />
    <p class="title"><span class="line"></span>结算信息</p>

    <settleInforMation
      :dataDic="dataDic"
      @clickItem="clickItem"
      @clickSelect="clickSelect"
      @textChange="textChange"
      @prePayChange="handleprePayChange"
      :isShowConfig="isShowConfig"
    />
    <p class="title"><span class="line"></span>补充信息</p>
    <supplementInforMation
      :dataDic="dataDic"
      @clickItem="clickItem"
      @textChange="textChange"
    />
    <view class="flow total">
      <view class="total">
        <view class="btn back" @click="back()"><text>上一步</text></view>
        <view class="btn" @click="next()"><text>下一步</text></view>
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
</template>
<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import baseInforMation from "./create-contract-components/base-information.vue";
import settleInforMation from "./create-contract-components/settle-information.vue";
import projectInforMation from "./create-contract-components/project-information.vue";
import supplementInforMation from "./create-contract-components/supplement-information.vue";
import calRent from "@/common/util/cal-rent-money.js";
import hoursUtil from "@/common/util/day-working-hours.js";

export default {
  components: {
    wPicker,
    createStep,
    baseInforMation,
    settleInforMation,
    projectInforMation,
    supplementInforMation,
  },
  data() {
    return {
      orgList: [],
      userList: [],
      PaysettlementDayTypeList: [], //结算日类型-预付
      MonthsettlementDayTypeList: [], //结算日类型-月结
      PayMonthsettlementDayTypeList: [], //结算日类型-预付月结
      settlementDayList: [], //结算日
      renterTripTypeList: [], //运费减免类型
      invoiceTypeList: [], //发票类型
      rentalTypeList: [], //租赁性质
      settlementTypeList: [], //租赁方式
      carriageTypesList: [], //运费类型
      allocateFlagList: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ], //是否配备操作人员列表
      selectType: "",
      selectList: [],
      mesDic: {}, //退回或者提交的dict
      dataDic: {
        debtAdvance: "0.00",
        allocateFlag: false,
        totalMoney: "0.00",
        orderList: [],
        paperContractNo: "",
        prePayWorkInDays: "",
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
  onLoad(option) {
    // this.defaultProjectName = this.$gxfmethod.defaultProjectName()
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowConfig = obj.value === "liangXu" ? false : true;
      }
    }
    let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
    this.orgList = [...resOrgList];
    this.setOrgAndSaleman().then((obj) => {
      this.dataDic = {
        ...this.dataDic,
        ...obj,
      };
    });
    if (option.link) {
      //个人
      let obj = JSON.parse(decodeURIComponent(option.link));
      this.isGoToBusiness = true;
      this.dataDic = {
        ...this.dataDic,
        customerId: obj.id, //客户名称ID
        customerName: obj.name, //客户名称
        contactId: null, //联系人ID
        phoneNum: obj.phoneNum, //联系人手机号
        contactName: obj.name, //联系人名称
      };
    }
    if (option.clink) {
      //企业
      let obj = JSON.parse(decodeURIComponent(option.clink));
      this.isGoToBusiness = true;
      let dict = obj.contactsList[0];
      this.dataDic = {
        ...this.dataDic,
        customerId: obj.id, //客户名称ID
        customerName: obj.name, //客户名称
        contactId: dict.id, //联系人ID
        phoneNum: dict.phoneNum, //联系人手机号
        contactName: dict.name, //联系人名称
      };
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
      // this.$gxfmethod.getCurAddress((obj) => {
      //   this.dataDic = {
      //     ...this.dataDic,
      //     deliveryPlace: obj,
      //     returnPlace: obj,
      //   };
      // });
      this.getBusinessNo();
    }
    /*
              加载字典项配置
              */
    this.loadsettlementDatePay(); //预付
    this.loadsettlementDateMonth(); //月结
    this.loadsettlementDatePayMonth(); //预付+月结
    this.loadrenterTripTypes(); //运费减免类型
    this.loadinviceTypes(); //发票类型
    this.loadrentalTypes(); //租赁性质
    this.loadSettlementTypes(); //租赁方式
    this.loadcarriageTypes(); //运费类型
    for (let i = 1; i < 32; i++) {
      this.settlementDayList.push({
        label: i + "号",
        value: i,
      });
    }

    this.dataDic = {
      ...this.dataDic,
      deliveryPlace: uni.getStorageSync("address"),
      returnPlace: uni.getStorageSync("address"),
    };

    this.loadNotifice(); //加载数据
  },
  onUnload() {
    this.offNotifice();
  },
  methods: {
    handleprePayChange(val) {
      this.dataDic.prePayWorkInDays = val;
    },
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
            .getData(this.$url.EDIT_CONTRACT + "?draft=true", "POST", this.mesDic)
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
        //当前用户不是业务人员，则默认显示当前区域的第一个业务人员
        if (this.userList.length > 0 && !dataObj.customerSalesman) {
          dataObj = {
            ...dataObj,
            customerSalesman: this.userList[0].value,
            customerSalesmanName: this.userList[0].label,
          };
        }

        resolve({
          ...dataObj,
        });
      });
    },
    clickSelect(e) {
      if (e.value != "2" && e.value != "3") {
        this.dataDic = {
          ...this.dataDic,
          paymentType: e.value,
          paymentTypeName: e.label,
        };
      } else {
        this.resetPaymentTypeData(e);
      }
    },
    calTotal() {
      let totalMoney = 0;
      this.dataDic.orderList.forEach((o) => {
        let obj = calRent.calculateTotalNew(o);
        let itemTotal = parseFloat(obj.total);
        totalMoney += itemTotal;
      });
      this.dataDic = {
        ...this.dataDic,
        totalMoney: totalMoney.toFixed(2).toString(),
      };
    },
    resetPaymentTypeData(e) {
      if (e.value == "2" && this.MonthsettlementDayTypeList.length > 0) {
        let dict = this.MonthsettlementDayTypeList[0];
        if (dict.value == "2") {
          this.resetPaymentTypeDayData(e, dict);
        } else {
          this.dataDic = {
            ...this.dataDic,
            paymentType: e.value,
            paymentTypeName: e.label,
            settlementDayTypeName: dict.label,
            settlementDayType: dict.value,
          };
        }
      } else if (e.value == "3" && this.PaysettlementDayTypeList.length > 0) {
        let dict = this.PaysettlementDayTypeList[0];
        if (dict.value == "2") {
          this.resetPaymentTypeDayData(e, dict);
        } else {
          this.dataDic = {
            ...this.dataDic,
            paymentType: e.value,
            paymentTypeName: e.label,
            settlementDayTypeName: dict.label,
            settlementDayType: dict.value,
          };
        }
      }
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

    clickItem(e) {
      this.selectType = e;
      switch (this.selectType) {
        case "customer":
          let customerDic = {
            orgId: this.dataDic.orgId,
            orgName: this.dataDic.orgName,
            customerSalesman: this.dataDic.customerSalesman,
            customerSalesmanName: this.dataDic.customerSalesmanName,
          };
          uni.navigateTo({
            url:
              "/otherPages/linkman/linkman?dutyType=2&item=" +
              encodeURIComponent(JSON.stringify(customerDic)),
          });
          break;
        case "org":
          this.selectList = [...this.orgList];
          this.$refs.selector.show();
          break;
        case "ssn":
          this.selectList = [...this.userList];
          this.$refs.selector.show();
          break;
        case "renterTripType":
          this.selectList = [...this.renterTripTypeList];
          this.$refs.selector.show();
          break;
        case "settlementDayType":
          this.selectList =
            this.dataDic.paymentType == "3"
              ? [...this.PaysettlementDayTypeList]
              : [...this.MonthsettlementDayTypeList];
          this.$refs.selector.show();
          break;
        case "settlementDay":
          this.selectList = [...this.settlementDayList];
          this.$refs.selector.show();
          break;
        case "invoiceType":
          this.selectList = [...this.invoiceTypeList];
          this.$refs.selector.show();
          break;
        case "allocateFlag":
          this.selectList = [...this.allocateFlagList];
          this.$refs.selector.show();
          break;
        case "rentalType":
          this.selectList = [...this.rentalTypeList];
          this.$refs.selector.show();
          break;
        case "constructionType":
          let choosedIdList = this.dataDic.constructionType
            ? this.dataDic.constructionType
            : [];
          uni.navigateTo({
            url:
              "/devicePages/gps/choose-work-content?choosedIdList=" +
              encodeURIComponent(JSON.stringify(choosedIdList)),
          });
          break;
        case "deliveryPlace":
          let addrObj = {
            address: this.dataDic.deliveryPlace ? this.dataDic.deliveryPlace : "",
            latitude: this.dataDic.latitude ? this.dataDic.latitude : "",
            longitude: this.dataDic.longitude ? this.dataDic.longitude : "",
            currentRadius: this.dataDic.radius ? this.dataDic.radius : "",
          };
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(addrObj) +
              "&showfence=false",
          });
          break;
        case "returnPlace":
          let returnPlaceaddrObj = {
            address: this.dataDic.deliveryPlace ? this.dataDic.deliveryPlace : "",
            latitude: this.dataDic.latitude ? this.dataDic.latitude : "",
            longitude: this.dataDic.longitude ? this.dataDic.longitude : "",
            currentRadius: this.dataDic.radius ? this.dataDic.radius : "",
          };
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(returnPlaceaddrObj) +
              "&showfence=true",
          });
          break;
        case "signDate":
          this.$refs.date.show();
          break;
        default:
          break;
      }
    },
    //加载负责人
    loadOwnerList(orgId) {
      let param = {
        showAdmin: false,
        orgId: orgId,
        isAll: true,
        roleType: this.$savekey.USER_ROLE_BUSINESS,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          let list = result;
          this.userList = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
              orgIds: dict.orgIds,
            };
          });
          let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
          if (
            !(
              resData &&
              this.$gxfmethod.issameAllRoleType(resData, this.$savekey.USER_ROLE_BUSINESS)
            )
          ) {
            if (this.userList && this.userList.length > 0) {
              this.dataDic = {
                ...this.dataDic,
                customerSalesman: this.userList[0].value,
                customerSalesmanName: this.userList[0].label,
              };
            } else {
              this.dataDic = {
                ...this.dataDic,
                customerSalesman: "",
                customerSalesmanName: "",
              };
            }
          }
        })
        .catch((err) => {});
    },
    onConfirm(val) {
      switch (this.selectType) {
        case "org":
          this.dataDic = {
            ...this.dataDic,
            orgId: val.checkArr.value,
            orgName: val.checkArr.label,
          };
          this.loadOwnerList(this.dataDic.orgId);
          break;
        case "ssn":
          this.dataDic = {
            ...this.dataDic,
            customerSalesman: val.checkArr.value,
            customerSalesmanName: val.checkArr.label,
          };
          break;
        case "renterTripType":
          this.dataDic = {
            ...this.dataDic,
            renterTripTypeName: val.checkArr.label,
            renterTripType: val.checkArr.value,
          };
          break;
        case "settlementDayType":
          this.dataDic = {
            ...this.dataDic,
            settlementDayTypeName: val.checkArr.label,
            settlementDayType: val.checkArr.value,
          };
          if (
            this.dataDic &&
            (this.dataDic.paymentType == "2" || this.dataDic.paymentType == "3") &&
            this.dataDic.settlementDayType == "2"
          ) {
            if (!this.dataDic.settlementDay) {
              this.dataDic = {
                ...this.dataDic,
                settlementDayName: this.settlementDayList[0].label,
                settlementDay: this.settlementDayList[0].value,
              };
            }
          }
          break;
        case "settlementDay":
          this.dataDic = {
            ...this.dataDic,
            settlementDayName: val.checkArr.label,
            settlementDay: val.checkArr.value,
          };
          break;
        case "invoiceType":
          let invoiceFlag = false;
          if (val.checkArr.value === "0") {
            invoiceFlag = false;
          } else {
            invoiceFlag = true;
          }
          this.dataDic = {
            ...this.dataDic,
            invoiceTypeName: val.checkArr.label,
            invoiceType: val.checkArr.value,
            invoiceFlag: invoiceFlag,
          };
          break;
        case "allocateFlag":
          this.dataDic = {
            ...this.dataDic,
            allocateFlag: val.checkArr.value == "1" ? true : false,
          };
          break;
        case "rentalType":
          this.dataDic = {
            ...this.dataDic,
            rentalTypeName: val.checkArr.label,
            rentalType: val.checkArr.value,
          };
          break;
        case "signDate":
          this.dataDic = {
            ...this.dataDic,
            signDate: val.result + " 00:00:00",
          };
          break;
        default:
          break;
      }
    },
    /*输入框监听*/
    textChange(val) {
      if (val.type == "project") {
        this.dataDic = {
          ...this.dataDic,
          projectName: val.data,
        };
      } else if (val.type == "advance") {
        this.dataDic = {
          ...this.dataDic,
          advance: val.data,
        };
        setTimeout(() => {
          this.dataDic = {
            ...this.dataDic,
            advance: this.$gxfmethod.getMoneyPart(val.data),
          };
          this.getdebtMoney();
        }, 50);
      } else if (val.type == "paidAdvance") {
        this.dataDic = {
          ...this.dataDic,
          paidAdvance: val.data,
        };
        setTimeout(() => {
          this.dataDic = {
            ...this.dataDic,
            paidAdvance: this.$gxfmethod.getMoneyPart(val.data),
          };
          this.getdebtMoney();
        }, 50);
      } else if (val.type == "allocatePrice") {
        this.dataDic = {
          ...this.dataDic,
          allocatePrice: val.data,
        };
        setTimeout(() => {
          this.dataDic = {
            ...this.dataDic,
            allocatePrice: this.$gxfmethod.getMoneyPart(val.data),
          };
        }, 50);
      } else if (val.type == "deliveryPlace") {
        this.dataDic = {
          ...this.dataDic,
          deliveryPlace: val.data,
          returnPlace: val.data,
        };
      } else if (val.type == "returnPlace") {
        this.dataDic = {
          ...this.dataDic,
          returnPlace: val.data,
        };
      } else if (val.type == "covenants") {
        this.dataDic = {
          ...this.dataDic,
          covenants: val.data,
        };
      } else if (val.type == "paperContractNo") {
        this.dataDic = {
          ...this.dataDic,
          paperContractNo: val.data,
        };
      } else if (val.type == "fileList") {
        this.dataDic = {
          ...this.dataDic,
          fileList: val.data,
        };
      } else if (val.type == "remark") {
        this.dataDic = {
          ...this.dataDic,
          remark: val.data,
        };
      }
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
      let defaultS =
        this.settlementTypeList.length > 0 ? this.settlementTypeList[0].value : null;
      newItem.forEach((o) => {
        arr = [
          ...arr,
          {
            type: o.type,
            typeName: o.typeName,
            height: o.height,
            heightName: o.heightName,
            machineType: o.list.map((y) => y.id),
            machineTypeName: this.getMachineTypes(
              o.list.map((y) => y.brand + "-" + y.name)
            ),
            machineList: [],
            beginDate: defaultDate + " 00:00:00",
            carriage: "",
            endDate: null,
            whole: null,
            surplusDay: null,
            hire: "",
            hireMonthly: "0",
            orderNum: 1,
            carriageTypeName:
              this.carriageTypesList.length > 0 ? this.carriageTypesList[0].label : null,
            carriageType:
              this.carriageTypesList.length > 0 ? this.carriageTypesList[0].value : null,
            pledge: "",
            settlementType: defaultS,
            tenancy: calRent.calculateDays(defaultDate, defaultDate, defaultS),
            total: "0.00",
            settlementTypeName:
              this.settlementTypeList.length > 0
                ? this.settlementTypeList[0].label
                : null,
          },
        ];
      });
      let list = [...arr, ...(this.dataDic.orderList ? this.dataDic.orderList : [])];
      this.dataDic = {
        ...this.dataDic,
        orderList: [...list],
      };
    },
    getMachineTypes(names) {
      return names.join(",");
    },
    //set客户信息
    setCustomerInfo(obj, type) {
      switch (
        type //person个人
      ) {
        case "person":
          this.dataDic = {
            ...this.dataDic,
            customerId: obj.dict.id,
            customerName: obj.dict.name,
            contactId: null,
            phoneNum: obj.dict.phoneNum,
            contactName: obj.dict.name,
          };
          console.log(this.dataDic.customerId, "----------");

          break;
        case "enterprise": //企业
          this.dataDic = {
            ...this.dataDic,
            customerId: obj.customer.id,
            customerName: obj.customer.name,
            contactId: obj.dict.id,
            phoneNum: obj.dict.phoneNum,
            contactName: obj.dict.name,
          };
          break;
        default:
          break;
      }
    },
    loadNotifice() {
      //企业用户
      uni.$on("linkman-emit", (obj) => {
        this.setCustomerInfo(obj, "enterprise");
      });
      //个人用户
      uni.$on("linkman-emit-person", (obj) => {
        this.setCustomerInfo(obj, "person");
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
        this.dataDic = {
          ...this.dataDic,
          constructionType: nameIds, //施工类型
          constructionTypeName: names.join(","), //施工类型
        };
      });
      //加载地图
      uni.$on("choose-address", (obj) => {
        let result = obj.data;
        console.log(obj, "-------");
        switch (this.selectType) {
          case "deliveryPlace":
            if (!this.dataDic.returnPlace) {
              this.dataDic = {
                ...this.dataDic,
                returnPlace: result.address, //	交付地点
              };
            }
            this.dataDic = {
              ...this.dataDic,
              deliveryPlace: result.address, //	交付地点
            };
            break;
          case "returnPlace":
            this.dataDic = {
              ...this.dataDic,
              returnPlace: result.address, //	交付地点
            };
            break;
          default:
            break;
        }
      });
      uni.$on("chooseVehicle", (obj) => {
        this.getSelectData(obj.data);
      });
      uni.$on("edit-item-device", (obj) => {
        let type = obj.type;
        if (type == "delete") {
          let indexnum = obj.index;
          this.dataDic.orderList.splice(indexnum, 1);
          this.calTotal();
        } else {
          let indexnum = obj.index;
          this.dataDic.orderList.splice(indexnum, 1, obj.data);
          this.calTotal();
        }
      });
    },
    offNotifice() {
      uni.$off("linkman-emit");
      uni.$off("linkman-emit-person");
      uni.$off("choosedConstruction");
      uni.$off("choose-address");
      uni.$off("choose-simple-device");
      uni.$off("edit-item-device");
    },
    /*网络数据字典项*/
    loadDetailData(contractNo) {
      uni.showLoading();
      let param = {
        businessNo: contractNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          this.mesDic = {
            ...result,
          };
          let contractDetailDtoDic = this.mesDic.contractDetailDto
            ? this.mesDic.contractDetailDto
            : {};
          let orderList = contractDetailDtoDic.orderList
            ? contractDetailDtoDic.orderList
            : [];
          let neworderList = orderList.map((o) => {
            // let obj = {
            // 	...o,
            // 	"beginDate": this.getDate(o.beginDate),
            // 	"endDate": this.getDate(o.endDate)
            // }
            let param = calRent.getTenancys(o);
            return {
              ...o,
              whole: param.whole,
              surplusDay: param.surplusDay,
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
    //结算日类型-预付
    loadsettlementDatePay() {
      this.$network
        .loadType("settlement_prepaid_type")
        .then((result) => {
          this.PaysettlementDayTypeList = result;
        })
        .catch((err) => {});
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
    //结算日类型-预付后月结
    loadsettlementDatePayMonth() {
      this.$network
        .loadType("settlement_prepaid_monthly_type")
        .then((result) => {
          this.PayMonthsettlementDayTypeList = result;
        })
        .catch((err) => {});
    },
    //运费减免类型carriage_type
    loadrenterTripTypes() {
      this.$network
        .loadType("renter_trip_type")
        .then((result) => {
          this.renterTripTypeList = result;
          if (this.renterTripTypeList.length > 0 && !this.dataDic.renterTripType) {
            this.dataDic = {
              ...this.dataDic,
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
    //发票类型
    loadinviceTypes() {
      this.$network
        .loadType("invoice_type")
        .then((result) => {
          this.invoiceTypeList = [...result];
          if (!this.dataDic.invoiceType && this.invoiceTypeList.length > 0) {
            this.dataDic = {
              ...this.dataDic,
              invoiceType: this.invoiceTypeList[0].value,
              invoiceTypeName: this.invoiceTypeList[0].label,
            };
          }
        })
        .catch((err) => {});
    },
    //租赁性质
    loadrentalTypes() {
      this.$network
        .loadType("rental_type")
        .then((result) => {
          this.rentalTypeList = [...result];
          if (!this.dataDic.rentalType && this.rentalTypeList.length > 0) {
            this.dataDic = {
              ...this.dataDic,
              rentalType: this.rentalTypeList[0].value,
              rentalTypeName: this.rentalTypeList[0].label,
            };
          }
        })
        .catch((err) => {});
    },
    //租赁方式
    loadSettlementTypes() {
      this.$network
        .loadType("settlement_type")
        .then((result) => {
          this.settlementTypeList = result;
        })
        .catch((err) => {});
    },
    //运费类型carriage_type
    loadcarriageTypes() {
      this.$network
        .loadType("carriage_type")
        .then((result) => {
          this.carriageTypesList = result;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getDate(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //提交
    getBackData(val) {
      this.mesDic = JSON.parse(val);
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
        let param = calRent.getTenancys(obj);
        return {
          ...o,
          whole: param.whole,
          surplusDay: param.surplusDay,
        };
      });
      this.dataDic = {
        ...this.dataDic,
        ...this.mesDic,
        ...contractDetailDtoDic,
        orderList: neworderList,
      };
      this.calTotal();
    },
    checkData() {
      if (!this.dataDic.customerName) {
        this.showToast("请选择客户信息");
        return Promise.reject("fail");
      }
      if (!this.dataDic.projectName) {
        this.showToast("请填写项目名");
        return Promise.reject("fail");
      }
      if (!this.dataDic.orgName) {
        this.showToast("请选择区域");
        return Promise.reject("fail");
      }
      if (!this.dataDic.customerSalesmanName) {
        this.showToast("请选择业务负责人");
        return Promise.reject("fail");
      }

      if (
        !this.dataDic.orderList ||
        (this.dataDic.orderList && this.dataDic.orderList.length <= 0)
      ) {
        this.showToast("请选择设备信息");
        return Promise.reject("fail");
      }
      console.log(JSON.stringify(this.dataDic.orderList));
      let isfail = true;
      this.dataDic.orderList.forEach((o) => {
        if (
          (o.settlementType == "4" || o.settlementType == "6") &&
          (o.hireMonthly == "" || parseFloat(o.hireMonthly) == 0)
        ) {
          isfail = false;
        } else if (o.hire == "" || Number.parseFloat(o.hire) == 0) {
          isfail = false;
        }
      });
      if (!isfail) {
        this.showToast("租金必须大于0");
        return Promise.reject("fail");
      }
      if (this.dataDic.paymentType == "2" || this.dataDic.paymentType == "3") {
        if (!this.dataDic.settlementDayTypeName) {
          this.showToast("请选择结算日类型");
          return Promise.reject("fail");
        }
        if (this.dataDic.settlementDayType == "2" && !this.dataDic.settlementDay) {
          this.showToast("请选择结算日");
          return Promise.reject("fail");
        }
      }
      if (!this.dataDic.renterTripTypeName) {
        this.showToast("请选择运费减免约定");
        return Promise.reject("fail");
      }
      if (!this.dataDic.constructionTypeName) {
        this.showToast("请选择作业内容");
        return Promise.reject("fail");
      }
      if (!this.dataDic.deliveryPlace) {
        this.showToast("请选择交机地点");
        return Promise.reject("fail");
      }

      let hasDuplicate = this.hasDupliaceDemand(this.dataDic.orderList);
      if (hasDuplicate) {
        this.showToast("设备需求重复，请修改");
        return Promise.reject("fail");
      }

      this.constructData();
      // return Promise.reject('fail');
      return new Promise((resolve, reject) => {
        this.askSubmit()
          .then((res) => {
            if (!this.backDic) {
              this.checkprojectName()
                .then(() => {
                  resolve("sucess");
                })
                .catch((msg) => {
                  if (msg) {
                    this.showToast(msg);
                  }
                  reject("fail");
                });
            } else {
              resolve("sucess");
            }
          })
          .catch((err) => {
            reject("fail");
          });
      });
      return Promise.resolve("success");
    },

    submit(val) {
      uni.showLoading({
        mask: true,
      });
      if (this.version) {
        this.mesDic.version = this.version;
      }
      this.$network
        .getData(this.$url.EDIT_CONTRACT + val, "POST", this.mesDic)
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
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    checkData() {
      if (!this.dataDic.customerName) {
        this.showToast("请选择客户信息");
        return Promise.reject("fail");
      }
      if (!this.dataDic.projectName) {
        this.showToast("请填写项目名");
        return Promise.reject("fail");
      }
      if (!this.dataDic.orgName) {
        this.showToast("请选择区域");
        return Promise.reject("fail");
      }
      if (!this.dataDic.customerSalesmanName) {
        this.showToast("请选择业务负责人");
        return Promise.reject("fail");
      }

      if (this.dataDic.paymentType == "2" || this.dataDic.paymentType == "3") {
        if (!this.dataDic.settlementDayTypeName) {
          this.showToast("请选择结算日类型");
          return Promise.reject("fail");
        }
        if (this.dataDic.settlementDayType == "2" && !this.dataDic.settlementDay) {
          this.showToast("请选择结算日");
          return Promise.reject("fail");
        }
      }
      if (!this.dataDic.renterTripTypeName) {
        this.showToast("请选择运费减免约定");
        return Promise.reject("fail");
      }
      if (!this.dataDic.constructionTypeName) {
        this.showToast("请选择作业内容");
        return Promise.reject("fail");
      }
      if (!this.dataDic.deliveryPlace) {
        this.showToast("请选择交机地点");
        return Promise.reject("fail");
      }
      return Promise.resolve();
    },

    next() {
      let param = {
        machineInfoList: uni.getStorageSync("gps_machineList"),
        projectInfo: {
          projectName: this.dataDic.projectName,
          constructionType: this.dataDic.constructionType,
          constructionTypeName: this.dataDic.constructionTypeName,
          rentalType: this.dataDic.rentalType,
          rentalTypeName: this.dataDic.rentalTypeName,
          deliveryPlace: this.dataDic.deliveryPlace,
          returnPlace: this.dataDic.returnPlace,
        },
        contractInfo: {
          contractNo: this.dataDic.businessNo,
          contractType: this.dataDic.contractType,
          contractTypeName: this.dataDic.contractTypeName,
          customerId: this.dataDic.customerId,
          customerName: this.dataDic.customerName,
          contactId: this.dataDic.contactId,
          contactName: this.dataDic.contactName,
          phoneNum: this.dataDic.phoneNum,
          orgId: this.dataDic.orgId,
          orgName: this.dataDic.orgName,
          customerSalesman: this.dataDic.customerSalesman,
          customerSalesmanName: this.dataDic.customerSalesmanName,
        },
        settlementInfo: {
          paymentType: this.dataDic.paymentType,
          paymentTypeName: this.dataDic.paymentTypeName,
          renterTripType: this.dataDic.renterTripType,
          renterTripTypeName: this.dataDic.renterTripTypeName,
          invoiceFlag: this.dataDic.invoiceFlag,
          invoiceType: this.dataDic.invoiceType,
          invoiceTypeName: this.dataDic.invoiceTypeName,
          allocateFlag: this.dataDic.allocateFlag,
        },
        otherInfoDto: {
          signDate: this.dataDic.signDate,
          paperContractNo: this.dataDic.paperContractNo,
          fileList: this.dataDic.fileList,
        },
        transportInfoDto: [],
        adjustmentInfoDto: {
          reduceAccount: null,
          increasesAccount: null,
        },
      };
      this.checkData()
        .then(() => {
          uni.setStorageSync("settleData", param);
          uni.navigateTo({
            url: `/devicePages/gps/settleNotarize`,
          });
        })
        .catch(() => {});
    },
    constructData() {
      let contractDetailDto = this.mesDic.contractDetailDto
        ? this.mesDic.contractDetailDto
        : {};
      this.mesDic = {
        ...this.mesDic,
        businessNo: this.dataDic.businessNo ? this.dataDic.businessNo : "",
        orgId: this.dataDic.orgId ? this.dataDic.orgId : "",
        orgName: this.dataDic.orgName ? this.dataDic.orgName : "",
        customerSalesman: this.dataDic.customerSalesman
          ? this.dataDic.customerSalesman
          : "",
        customerSalesmanName: this.dataDic.customerSalesmanName
          ? this.dataDic.customerSalesmanName
          : "",
        customerId: this.dataDic.customerId ? this.dataDic.customerId : "",
        customerName: this.dataDic.customerName ? this.dataDic.customerName : "",
        paperContractNo: this.dataDic.paperContractNo ? this.dataDic.paperContractNo : "",
        fileList: this.dataDic.fileList ? this.dataDic.fileList : [],
        contractType: this.dataDic.contractType ? this.dataDic.contractType : "",
        contractTypeName: this.dataDic.contractTypeName
          ? this.dataDic.contractTypeName
          : "",
        signDate: this.dataDic.signDate ? this.dataDic.signDate : "",
        contractDetailDto: {
          ...contractDetailDto,
          prePayWorkInDays: this.dataDic.prePayWorkInDays
            ? this.dataDic.prePayWorkInDays
            : "",
          // "projectName": this.dataDic.projectName ? this.dataDic.projectName : this.defaultProjectName,
          projectName: this.dataDic.projectName ? this.dataDic.projectName : "",
          customerSalesman: this.dataDic.customerSalesman
            ? this.dataDic.customerSalesman
            : "",
          customerSalesmanName: this.dataDic.customerSalesmanName
            ? this.dataDic.customerSalesmanName
            : "",
          contactId: this.dataDic.contactId ? this.dataDic.contactId : null,
          contactName: this.dataDic.contactName ? this.dataDic.contactName : "",
          phoneNum: this.dataDic.phoneNum ? this.dataDic.phoneNum : "",
          paymentType: this.dataDic.paymentType ? this.dataDic.paymentType : "",
          paymentTypeName: this.dataDic.paymentTypeName
            ? this.dataDic.paymentTypeName
            : "",
          advance: this.dataDic.advance ? this.dataDic.advance : "0.00",
          paidAdvance: this.dataDic.paidAdvance ? this.dataDic.paidAdvance : "0.00",
          debtAdvance: this.dataDic.debtAdvance ? this.dataDic.debtAdvance : "0.00",
          settlementDayType: this.dataDic.settlementDayType
            ? this.dataDic.settlementDayType
            : "",
          settlementDayTypeName: this.dataDic.settlementDayTypeName
            ? this.dataDic.settlementDayTypeName
            : "",
          settlementDay: this.dataDic.settlementDay ? this.dataDic.settlementDay : "",
          settlementDayName: this.dataDic.settlementDayName
            ? this.dataDic.settlementDayName
            : "",
          renterTripType: this.dataDic.renterTripType ? this.dataDic.renterTripType : "",
          renterTripTypeName: this.dataDic.renterTripTypeName
            ? this.dataDic.renterTripTypeName
            : "",
          invoiceType: this.dataDic.invoiceType ? this.dataDic.invoiceType : "",
          invoiceTypeName: this.dataDic.invoiceTypeName
            ? this.dataDic.invoiceTypeName
            : "",
          invoiceFlag: this.dataDic.invoiceFlag ? this.dataDic.invoiceFlag : "",
          allocateFlag: this.dataDic.allocateFlag ? this.dataDic.allocateFlag : "",
          allocatePrice: this.dataDic.allocatePrice ? this.dataDic.allocatePrice : "0.00",
          rentalType: this.dataDic.rentalType ? this.dataDic.rentalType : "",
          rentalTypeName: this.dataDic.rentalTypeName ? this.dataDic.rentalTypeName : "",
          constructionType: this.dataDic.constructionType
            ? this.dataDic.constructionType
            : [],
          constructionTypeName: this.dataDic.constructionTypeName
            ? this.dataDic.constructionTypeName
            : "",
          deliveryPlace: this.dataDic.deliveryPlace ? this.dataDic.deliveryPlace : "",
          returnPlace: this.dataDic.returnPlace ? this.dataDic.returnPlace : "",
          covenants: this.dataDic.covenants ? this.dataDic.covenants : "",
          latitude: this.dataDic.latitude ? this.dataDic.latitude : "",
          longitude: this.dataDic.longitude ? this.dataDic.longitude : "",
          fenceId: this.dataDic.fenceId ? this.dataDic.fenceId : "",
          fenceName: this.dataDic.fenceName ? this.dataDic.fenceName : "",
          radius: this.dataDic.radius ? this.dataDic.radius : "",
          remark: this.dataDic.remark ? this.dataDic.remark : "",
          orderList: this.dataDic.orderList ? this.dataDic.orderList : [],
        },
      };
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    askSubmit() {
      return new Promise((resolve, reject) => {
        let leaderOrgIds = this.userList.some((o) => {
          return o.value == this.dataDic.customerSalesman;
        })
          ? this.userList.find((o) => o.value == this.dataDic.customerSalesman).orgIds
          : null;
        if (
          leaderOrgIds &&
          leaderOrgIds.length > 0 &&
          !leaderOrgIds.some((x) => x == this.dataDic.orgId)
        ) {
          uni.showModal({
            title: "提示",
            content: "您选择的业务负责人并非当前选定区域，是否继续操作",
            confirmText: "继续",
            success: (res) => {
              if (res.cancel) {
                reject("fail");
              } else {
                resolve("success");
              }
            },
          });
        } else {
          resolve("success");
        }
      });
    },
    hasDupliaceDemand(orderList) {
      let demandList = [];
      orderList.forEach((o) => {
        if (o.machineType && o.machineType.length) {
          o.machineType.forEach((mt) => {
            demandList.push({ ...o, machineType: mt });
          });
        } else {
          demandList.push({ ...o, machineType: null });
        }
      });
      //校验唯一性
      let hasDuplicate = demandList.some((d1) => {
        return demandList.some((d2) => {
          if (d1 != d2) {
            if (
              d1.type == d2.type &&
              d1.height == d2.height &&
              d1.machineType == d2.machineType &&
              d1.settlementType == d2.settlementType &&
              Number(d1.hire) == Number(d2.hire) &&
              Number(d1.hireMonthly) == Number(d2.hireMonthly)
            ) {
              return true;
            }
          }
        });
      });
      return hasDuplicate;
    },
    checkprojectName() {
      let projectDic = {
        // projectName: this.dataDic.projectName ? this.dataDic.projectName : this.defaultProjectName,
        projectName: this.dataDic.projectName ? this.dataDic.projectName : "",
        customerId: this.dataDic.customerId,
        customerSalesman: this.dataDic.customerSalesman,
      };
      if (this.dataDic.businessNo) {
        projectDic.businessNo = this.dataDic.businessNo;
      }
      return new Promise((resolve, reject) => {
        this.$network
          .getData(this.$url.CONTRACT_CHECK_NAME, "POST", projectDic)
          .then((result) => {
            resolve("success");
          })
          .catch((err) => {
            reject(err.details ? err.details[0] : err.message ? err.message : "");
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.create-contract-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
  width: 100%;
}
.cancel-btn {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}
.flow {
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
    .btn {
      width: 156px;
      display: flex;
      flex-direction: row;
      padding: 10px 0px;
      background: #e60000;
      color: #ffffff;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
.back {
  background-color: #d8d8d8 !important;
  color: #fff !important;
}
</style>
