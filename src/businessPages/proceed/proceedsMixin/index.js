export default {
  data() {
    return {
      fileList: [],
      remark: "", //备注
      proceedDate: "", //收款日期
      dateIcon: "iconzl--rili",
      contractDicName: "",
      contractDic: {
        contractDetailDto: {},
      },
      rentTypeDic: {}, //租金类型
      proceedTypeDic: {}, //收款方式
      proceeder: "",
      proceederphone: "",
      righticon: "iconarrow-right",
      proceedList: [],
      selectList: [], //列表
      rentTypeList: [], //租赁方式
      rentmoney: "", //租金
      pledgemoney: "", //押金
      transmoney: "", //运费
      cliammoney: "", //索赔
      personmoney: "", //人工费
      debtmoney: "", //拖欠费
      servicemoney: "", //代收服务费
    };
  },
  computed: {
    total() {
      let total = 0;
      let rental = this.rentmoney != "" ? Number(this.rentmoney) : 0;
      let trans = this.transmoney != "" ? Number(this.transmoney) : 0;
      let pledg = this.pledgemoney != "" ? Number(this.pledgemoney) : 0;
      let cliam = this.cliammoney != "" ? Number(this.cliammoney) : 0;
      let personm = this.personmoney != "" ? Number(this.personmoney) : 0;
      let debt = this.debtmoney != "" ? Number(this.debtmoney) : 0;
      let servicem = this.servicemoney != "" ? Number(this.servicemoney) : 0;
      total = rental + trans + pledg + cliam + personm + debt - servicem;
      return total.toFixed(2);
    },
  },
  onLoad() {
    uni.$on("choose-contract-emit", (usnerinfo) => {
      console.log(usnerinfo, "usnerinfo");
      this.ischoose = true;
      this.contractDic = usnerinfo.dict;
      this.proceeder = this.contractDic.contractDetailDto.contactName || "";
      this.proceederphone = this.contractDic.contractDetailDto.phoneNum || "";
      this.contractDicName =
        this.contractDic.customerName +
        "-" +
        this.contractDic.contractDetailDto.projectName;
    });
    this.loadInvoiceType();
    this.loadRentType();
  },
  onUnload() {
    // 取消监听事件
    uni.$off("choose-contract-emit");
  },
  methods: {
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.fileList = list;
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.fileList = list;
    },
    //输入框回调
    remarkmethod(val) {
      this.remark = val;
    },
    loadRentType() {
      uni.showLoading();
      this.$network
        .loadType("rent_collection_type")
        .then((result) => {
          this.rentTypeList = result;
          if (this.rentTypeList.length > 0 && !this.rentTypeDic.value) {
            this.rentTypeDic = {
              ...this.rentTypeList[0],
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    //弹窗回调
    dialog(val) {
      console.log(val, "dialog");
      if (this.choosetype == "pay") {
        this.proceedTypeDic = val.checkArr;
      } else {
        this.rentTypeDic = val.checkArr;
      }
    },
    //加载付款方式列表
    loadInvoiceType() {
      uni.showLoading();
      this.$network
        .loadType("pay_type")
        .then((result) => {
          this.proceedList = result;
          if (this.proceedList.length > 0 && !this.proceedTypeDic.value) {
            this.proceedTypeDic = {
              ...this.proceedList[0],
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    showdialog(type) {
      this.choosetype = type;
      if (this.choosetype == "pay") {
        this.selectList = this.proceedList ? this.proceedList : [];
      } else {
        this.selectList = this.rentTypeList ? this.rentTypeList : [];
      }
      this.$refs.selector.show();
    },
    //显示日历
    showCalendar() {
      this.$refs.date.show();
    },
    onConfirm(val) {
      this.proceedDate = val.result;
      this.$refs.date.hide();
    },
    //跳入合同列表
    gotoContract() {
      let url = "/businessPages/invoice/contract-choose?state=5,6,7,8";
      uni.navigateTo({
        url: url,
      });
    },
  },
};
