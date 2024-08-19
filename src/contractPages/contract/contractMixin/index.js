import calRent from "@/common/util/cal-rent-money.js";
import { hasDupliaceDemand } from "@/contractPages/util";
export default {
  watch: {
    settlementObj: {
      handler(val) {
        this.calTotal();
      },
      deep: true,
    },
    dataDic: {
      handler(val) {
        if (
          val.workInAndOutUser ||
          val.settleUser ||
          val.contractGuarantorUser
        ) {
          this.handleAuthorizedInformation(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  onLoad() {
    this.loadrentalTypes(); //租赁性质
    this.loadcarriageTypes(); //运费类型
    this.loadinviceTypes();
    this.loadrenterTripTypes();
    this.loadsettlementDateMonth();
    this.loadsettlementDatePay(); //预付
    this.loadNotifice();
    this.loadsettlementDatePayMonth(); //预付+月结
    this.loadUserList();
    for (let i = 1; i < 32; i++) {
      this.settlementDayList.push({
        label: i + "号",
        value: i,
      });
    }
    uni.$on("edit-item-device", (obj) => {
      let type = obj.type;
      if (type == "delete") {
        let indexnum = obj.index;
        this.dataDic.orderList.splice(indexnum, 1);
        this.calTotal();
      } else if (type == "add") {
        this.dataDic = {
          ...this.dataDic,
          orderList: [...this.dataDic.orderList, ...obj.data],
          contractDetailDto: {
            ...this.dataDic.contractDetailDto,
            orderList: [...this.dataDic.orderList, ...obj.data],
          },
        };
        this.calTotal();
      } else {
        this.dataDic.orderList.map((e, i) => {
          if (
            `${obj.data[0].typeName}${obj.data[0].height}` ==
            `${e.typeName}${e.height}`
          ) {
            this.dataDic.orderList.splice(i, 1, obj.data[0]);
          }
        });
        this.calTotal();
      }
    });
    uni.$on("refreshData-connect", (item) => {
      this.$refs.authorizedPersonInformation.getCustomerContoncts(
        this.dataDic.customerId
      );
    });
    let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
    this.orgList = [...resOrgList];
  },
  onUnload() {
    this.offNotifice();
  },
  created() {
    this.loadPaymentTypes(); //支付约定
  },
  data() {
    return {
      rentalTypeList: [], //租赁性质
      // settlementTypeList: [], //租赁方式
      carriageTypesList: [], //运费类型
      settlementDayList: [],
      selectList: [],
      mesDic: {},
      orgList: [],
      minTenancyList: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "0",
          label: "否",
        },
      ], //是否配备操作人员列表
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
      renterTripTypeList: [], //运费减免类型
      PaysettlementDayTypeList: [],
      paymentTypeList: [],
      userList: [],
      //默认30天
      settlementObj: {
        value: "30",
        label: "30天为一个月",
      },
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
      invoiceTypeList: [],
      MonthsettlementDayTypeList: [],
    };
  },
  methods: {
    //运费类型carriage_type
    loadcarriageTypes() {
      this.$network
        .loadType("carriage_type")
        .then((result) => {
          this.carriageTypesList = result;
          uni.setStorageSync("carriage", this.carriageTypesList);
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    handleMinTenancyChange(val) {
      this.dataDic.minTenancy = val;
    },

    handleinvoiceChange(val) {
      this.dataDic.invoiceTax = val;
    },
    handleprePayChange(val) {
      console.log(val, "handleprePayChange");
      this.dataDic.prePayWorkInDays = val;
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
    constructData() {
      let contractDetailDto = this.mesDic.contractDetailDto
        ? this.mesDic.contractDetailDto
        : {};
      this.dataDic = {
        ...this.mesDic,
        ...this.dataDic,
        minTenancy: this.dataDic.isShowMinTenancy
          ? this.dataDic.minTenancy
            ? this.dataDic.minTenancy
            : ""
          : "",
        deliveryPlace: this.dataDic.deliveryPlace
          ? this.dataDic.deliveryPlace
          : "",
        returnPlace: this.dataDic.returnPlace ? this.dataDic.returnPlace : "",
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
        customerName: this.dataDic.customerName
          ? this.dataDic.customerName
          : "",
        paperContractNo: this.dataDic.paperContractNo
          ? this.dataDic.paperContractNo
          : "",
        fileList: this.dataDic.fileList ? this.dataDic.fileList : [],
        contractType: this.dataDic.contractType
          ? this.dataDic.contractType
          : "",
        contractTypeName: this.dataDic.contractTypeName
          ? this.dataDic.contractTypeName
          : "",
        monthConfig: this.settlementObj.value,
        signDate: this.dataDic.signDate ? this.dataDic.signDate : "",
        invoiceTax: this.dataDic.invoiceFlag ? this.dataDic.invoiceTax : "",
        contractDetailDto: {
          ...contractDetailDto,
          monthConfig: this.settlementObj.value,
          prePayWorkInDays: this.dataDic.prePayWorkInDays
            ? this.dataDic.prePayWorkInDays
            : "",
          invoiceTax: this.dataDic.invoiceFlag ? this.dataDic.invoiceTax : "",
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
          paidAdvance: this.dataDic.paidAdvance
            ? this.dataDic.paidAdvance
            : "0.00",
          debtAdvance: this.dataDic.debtAdvance
            ? this.dataDic.debtAdvance
            : "0.00",
          settlementDayType: this.dataDic.settlementDayType
            ? this.dataDic.settlementDayType
            : "",
          settlementDayTypeName: this.dataDic.settlementDayTypeName
            ? this.dataDic.settlementDayTypeName
            : "",
          settlementDay: this.dataDic.settlementDay
            ? this.dataDic.settlementDay
            : "",
          settlementDayName: this.dataDic.settlementDayName
            ? this.dataDic.settlementDayName
            : "",
          renterTripType: this.dataDic.renterTripType
            ? this.dataDic.renterTripType
            : "",
          tripCalType: this.dataDic.tripCalType 
            ? this.dataDic.tripCalType
            : "0",
          tripVal: this.dataDic.tripVal 
          ? this.dataDic.tripVal
          : null,
          renterTripTypeName: this.dataDic.renterTripTypeName
            ? this.dataDic.renterTripTypeName
            : "",
          invoiceType: this.dataDic.invoiceType ? this.dataDic.invoiceType : "",
          invoiceTypeName: this.dataDic.invoiceTypeName
            ? this.dataDic.invoiceTypeName
            : "",
          invoiceFlag: this.dataDic.invoiceFlag ? this.dataDic.invoiceFlag : "",
          allocateFlag: this.dataDic.allocateFlag
            ? this.dataDic.allocateFlag
            : false,
          allocatePrice: this.dataDic.allocatePrice
            ? this.dataDic.allocatePrice
            : "0.00",
          rentalType: this.dataDic.rentalType ? this.dataDic.rentalType : "",
          rentalTypeName: this.dataDic.rentalTypeName
            ? this.dataDic.rentalTypeName
            : "",
          constructionType: this.dataDic.constructionType
            ? this.dataDic.constructionType
            : [],
          constructionTypeName: this.dataDic.constructionTypeName
            ? this.dataDic.constructionTypeName
            : "",
          deliveryPlace: this.dataDic.deliveryPlace
            ? this.dataDic.deliveryPlace
            : "",
          returnPlace: this.dataDic.returnPlace ? this.dataDic.returnPlace : "",
          covenants: this.dataDic.covenants ? this.dataDic.covenants : "",
          minTenancy: this.dataDic.isShowMinTenancy
            ? this.dataDic.minTenancy
              ? this.dataDic.minTenancy
              : ""
            : "",
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
      let isfail = true;
      this.dataDic.orderList.forEach((o) => {
        if (
          (o.hire == "" || Number.parseFloat(o.hire) == 0) &&
          (o.hireMonthly == "" || Number.parseFloat(o.hireMonthly) == 0)
        ) {
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
        if (
          this.dataDic.settlementDayType == "2" &&
          !this.dataDic.settlementDay
        ) {
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

      let hasDuplicate = hasDupliaceDemand(this.dataDic.orderList);
      if (hasDuplicate) {
        this.showToast("设备需求重复，请修改");
        return Promise.reject("fail");
      }

      this.constructData();
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
    checkprojectName() {
      let projectDic = {
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
            reject(
              err.details ? err.details[0] : err.message ? err.message : ""
            );
          });
      });
    },
    askSubmit() {
      return new Promise((resolve, reject) => {
        let leaderOrgIds = this.userList.some((o) => {
          return o.value == this.dataDic.customerSalesman;
        })
          ? this.userList.find((o) => o.value == this.dataDic.customerSalesman)
            .orgIds
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
          contractDetailDto: {
            ...this.dataDic.contractDetailDto,
            constructionType: nameIds, //施工类型
            constructionTypeName: names.join(","), //施工类型
          },
        };
      });
      //加载地图
      uni.$on("choose-address", (obj) => {
        let result = obj.data;
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
              latitude: result.latitude, //		围栏纬度
              longitude: result.longitude, //		围栏经度
              fenceId: "", //	围栏id
              fenceName: "", //	围栏名称
              radius: result.currentRadius, //围栏半径
              contractDetailDto: {
                ...this.dataDic.contractDetailDto,
                deliveryPlace: result.address,
              },
            };
            break;
          case "returnPlace":
            this.dataDic = {
              ...this.dataDic,
              returnPlace: result.address, //	交付地点
              contractDetailDto: {
                ...this.dataDic.contractDetailDto,
                returnPlace: result.address,
              },
            };
            break;
          default:
            break;
        }
      });
    },
    offNotifice() {
      uni.$off("refreshData-connect");
      uni.$off("linkman-emit");
      uni.$off("linkman-emit-person");
      uni.$off("choosedConstruction");
      uni.$off("choose-address");
      uni.$off("choose-simple-device");
      uni.$off("edit-item-device");
    },
    //结算日类型-预付后月结
    loadsettlementDatePayMonth() {
      this.$network
        .loadType("settlement_prepaid_monthly_type")
        .then((result) => {
          this.PayMonthsettlementDayTypeList = result;
        })
        .catch((err) => { });
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
        .catch((err) => { });
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
        .catch((err) => { });
    },
    //运费减免类型carriage_type
    loadrenterTripTypes() {
      this.$network
        .loadType("renter_trip_type")
        .then((result) => {
          this.renterTripTypeList = result;
          if (
            this.renterTripTypeList.length > 0 &&
            !this.dataDic.renterTripType
          ) {
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
    //结算方式payment_type
    loadPaymentTypes() {
      uni.showLoading();
      this.$network
        .loadType("payment_type")
        .then((result) => {
          console.log(result, "loadPaymentTypes");
          this.paymentTypeList = result;
          if (!this.dataDic.paymentType && this.paymentTypeList.length > 0) {
            this.dataDic = {
              ...this.dataDic,
              paymentTypeName: this.paymentTypeList[0].label,
              paymentType: this.paymentTypeList[0].value,
            }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    calTotal() {
      let totalMoney = 0;
      this.dataDic.orderList.forEach((o) => {
        let obj = calRent.calculateTotalSelf(o, this.settlementObj.value);
        let itemTotal = parseFloat(obj.total);
        totalMoney += itemTotal;
      });
      this.dataDic = {
        ...this.dataDic,
        totalMoney: totalMoney.toFixed(2).toString(),
        estimatedRent:totalMoney.toFixed(2).toString()
      };
    },
    async loadUserList() {
      let userList = await this.$network.getData(
        this.$url.USER_LEADERS,
        "GET",
        {
          showAdmin: false,
          orgId: this.dataDic.orgId,
          isAll: true,
          roleType: this.$savekey.USER_ROLE_BUSINESS,
        }
      );
      console.log(userList, "userList");
      this.userList = userList.map((dict) => {
        return {
          label: dict.username,
          value: dict.id,
          orgIds: dict.orgIds,
        };
      });
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
              this.$gxfmethod.issameAllRoleType(
                resData,
                this.$savekey.USER_ROLE_BUSINESS
              )
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
        .catch((err) => { });
    },
    onConfirm(val) {
      console.log(val, "onConfirm");
      switch (this.selectType) {
        case "org":
          this.dataDic = {
            ...this.dataDic,
            orgId: val.checkArr.value,
            orgName: val.checkArr.label,
          };
          this.loadOwnerList(this.dataDic.orgId);
          break;
        case "isShowMinTenancy":
          this.dataDic = {
            ...this.dataDic,
            isShowMinTenancy: val.checkArr.value == "1" ? true : false,
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
          // 按趟计费
        case "tripCalType":
          if(val.checkArr.value=='0'){
            this.dataDic.tripVal = null;
          }
          this.dataDic = {
            ...this.dataDic,
            tripCalType: val.checkArr.value,
          }
          break;
        case "settlementDayType":
          this.dataDic = {
            ...this.dataDic,
            settlementDayTypeName: val.checkArr.label,
            settlementDayType: val.checkArr.value,
          };
          if (
            this.dataDic &&
            (this.dataDic.paymentType == "2" ||
              this.dataDic.paymentType == "3") &&
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
        case "settlementType":
          this.settlementObj = {
            value: val.checkArr.value,
            label: val.checkArr.label,
          };
          this.dataDic = {
            ...this.dataDic,
            contractDetailDto: {
              ...this.dataDic.contractDetailDto,
              monthConfig: this.settlementObj.value,
            },
          };
          break;
        case "paymentType":
          this.dataDic = {
            ...this.dataDic,
            paymentTypeName: val.checkArr.label,
            paymentType: val.checkArr.value,
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
    //结算日类型-月结
    loadsettlementDateMonth() {
      this.$network
        .loadType("settlement_monthly_type")
        .then((result) => {
          this.MonthsettlementDayTypeList = result;
        })
        .catch((err) => { });
    },
    //结算日类型-预付
    loadsettlementDatePay() {
      this.$network
        .loadType("settlement_prepaid_type")
        .then((result) => {
          this.PaysettlementDayTypeList = result;
        })
        .catch((err) => { });
    },
    clickItem(e) {
      this.selectType = e;
      switch (this.selectType) {
        case "customer":
          let customerDic = {
            orgId: this.dataDic.orgId,
            orgName: this.dataDic.orgName,
            customerSalesman: this.dataDic.salesman,
            customerSalesmanName: this.dataDic.salesmanName,
          };
          this.handleDialog({
            workInAndOutUser: null,
            settleUser: null,
            contractGuarantorUser: null,
          });
          this.handleAuthorizedInformation({
            workInAndOutUser: null,
            settleUser: null,
            contractGuarantorUser: null,
          });
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
        case "isShowMinTenancy":
          this.selectList = [...this.minTenancyList];
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
        case "tripCalType":
          this.selectList = [{label:'按台计费',value:'0'},{label:'按趟计费',value:"1"}]
          this.$refs.selector.show();
          break;
        case "settlementDayType":
          this.selectList =
            this.dataDic.paymentType == "3"
              ? [...this.PaysettlementDayTypeList]
              : [...this.MonthsettlementDayTypeList];
          this.$refs.selector.show();
          break;
        case "settlementType":
          this.selectList = this.settleList;
          this.$refs.selector.show();
          break;
        case "paymentType":
          this.selectList = this.paymentTypeList;
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
              "./choose-work-content?choosedIdList=" +
              encodeURIComponent(JSON.stringify(choosedIdList)),
          });
          break;
        case "deliveryPlace":
          let addrObj = {
            address: this.dataDic.deliveryPlace
              ? this.dataDic.deliveryPlace
              : "",
            latitude: this.dataDic.latitude ? this.dataDic.latitude : "",
            longitude: this.dataDic.longitude ? this.dataDic.longitude : "",
            currentRadius: this.dataDic.radius ? this.dataDic.radius : "",
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
            address: this.dataDic.deliveryPlace
              ? this.dataDic.deliveryPlace
              : "",
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
    /*输入框监听*/
    textChange(val) {
      console.log(val, "textChange");
      if (val.type == "project") {
        this.dataDic = {
          ...this.dataDic,
          projectName: val.data,
          contractDetailDto: {
            ...this.dataDic.contractDetailDto,
            projectName: val.data,
          },
        };
      } else if (val.type == "isShowMinTenancy") {
        this.dataDic = {
          ...this.dataDic,
          minTenancy: val.data.detail.value,
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
      } else if(val.type == "tripVal"){
        // 按趟计费金额
        this.dataDic = {
          ...this.dataDic,
          tripVal: val.data
        }
        setTimeout(() => {
          this.dataDic = {
            ...this.dataDic,
            tripVal: this.$gxfmethod.getMoneyPart(val.data),
          };
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
        console.log(val.data, "deliveryPlace");
        this.dataDic = {
          ...this.dataDic,
          deliveryPlace: val.data,
          // returnPlace: val.data,
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
    handleDialog(val) {
      console.log(val, "val");
      this.dataDic = {
        ...this.dataDic,
        workInAndOutUser: val.workInAndOutUser || null,
        settleUser: val.settlementUser || null,
        contractGuarantorUser: val.contractGuaranteeUser || null,
      };
    },
    // 处理授权人信息
    handleAuthorizedInformation(val) {
      let ext = {};
      if (val.workInAndOutUser) {
        ext.workInAndOutUserId = val.workInAndOutUser.id || "";
        ext.workInAndOutUserName = val.workInAndOutUser.name || "";
        ext.workInAndOutUserPhone = val.workInAndOutUser.phoneNum || "";
        ext.workInAndOutUserIdentity = val.workInAndOutUser.identity || "";
      } else {
        ext.workInAndOutUserId = "";
        ext.workInAndOutUserName = "";
        ext.workInAndOutUserPhone = "";
        ext.workInAndOutUserIdentity = "";
      }

      if (val.settleUser) {
        ext.settleUserId = val.settleUser.id || "";
        ext.settleUserName = val.settleUser.name || "";
        ext.settleUserPhone = val.settleUser.phoneNum || "";
        ext.settleUserIdentity = val.settleUser.identity || "";
      } else {
        ext.settleUserId = "";
        ext.settleUserName = "";
        ext.settleUserPhone = "";
        ext.settleUserIdentity = "";
      }

      if (val.contractGuarantorUser) {
        ext.contractGuarantorUserId = val.contractGuarantorUser.id || "";
        ext.contractGuarantorUserName = val.contractGuarantorUser.name || "";
        ext.contractGuarantorUserPhone =
          val.contractGuarantorUser.phoneNum || "";
        ext.contractGuarantorUserIdentity =
          val.contractGuarantorUser.identity || "";
      } else {
        ext.contractGuarantorUserId = "";
        ext.contractGuarantorUserName = "";
        ext.contractGuarantorUserPhone = "";
        ext.contractGuarantorUserIdentity = "";
      }
      console.log(ext, "ext11111111");
      this.$set(this.dataDic, "extendedData", JSON.stringify(ext));
      this.$set(this.mesDic, "extendedData", JSON.stringify(ext));
    },

    //set客户信息
    setCustomerInfo(obj, type) {
      switch (
      type //person个人
      ) {
        case "person":
          obj = {
            customerId: obj.dict.id,
            customerName: obj.dict.name,
            contactId: null,
            phoneNum: obj.dict.phoneNum,
            contactName: obj.dict.name,
            customerSalesmanName: obj.dict.salesmanName,
            customerSalesman: obj.dict.salesman,
            customerType: 2,
          };
          break;
        case "enterprise": //企业
          obj = {
            customerId: obj.customer.id,
            customerName: obj.customer.name,
            contactId: obj.dict.id,
            phoneNum: obj.dict.phoneNum,
            contactName: obj.dict.name,
            customerSalesmanName: obj.customer.salesmanName,
            customerSalesman: obj.customer.salesman,
            customerType: 1,
          };
          break;
        default:
          break;
      }
      let found = this.userList.find(
        (item) => item.value == obj.customerSalesman
      );
      if (!found) {
        obj.customerSalesman = "";
        obj.customerSalesmanName = "";
      } else {
        obj.customerSalesmanName = found.label;
      }
      this.dataDic = {
        ...this.dataDic,
        ...obj,
      };
      this.$forceUpdate();
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
  },
};
