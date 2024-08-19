import parseISO from "date-fns/parseISO";
import calRent from "@/common/util/cal-rent-money.js";
import format from "date-fns/format";
export default {
  data() {
    return {
      customDic: {},
      rentFlag:false,
      date: [],
      receipt: {},
      receiptPeriod:{},
      contractId: "",
      customerId: "",
      receivable: {},
      contractReceivableList: [],
      showDetial: false,
      formInfo: {},
      settleTotal: "",
      settlementNo: "",
      proceedsNo: [], //收款单号
      refundNo: [], //退款单号
      isApproval: false,
    };
  },
  onShow() {
    uni.$on("getMachine", (data) => {
      this.$set(
        this.contractReceivableList[0].machineReceivableList,
        data.index,
        data.data
      );
    });
  },
  computed: {
    surplusReceiptCarriage() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (
        !this.contractReceivableList[0].surplusReceipt ||
        !this.contractReceivableList[0].surplusReceipt.carriage
      )
        return 0;

      return this.money(this.contractReceivableList[0].surplusReceipt.carriage);
    },
    surplusReceiptDeposit() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (
        !this.contractReceivableList[0].surplusReceipt ||
        !this.contractReceivableList[0].surplusReceipt.deposit
      )
        return 0;
      return this.money(
        Number(this.contractReceivableList[0].surplusReceipt.deposit)
      );
    },
    /* 本期结算总计 */
    contractTotal() {
      let _this = this;
      // if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
      //   return 0;
      // }
      // // let contractReceivableList=this.formInfo.settleInfoDto.contractReceivableList||[];
      // if (!this.contractReceivableList[0].machineReceivableList) return 0;
      // let list = this.contractReceivableList[0].machineReceivableList.filter(
      //   (o) => o.checked
      // );
      // console.log(list, 'contractTotal111111111111');
      // let total = list.reduce((x, y) => x + Number(y.accountTotal || 0), 0);
      // this.formInfo.receivableTotal =
      //   total +
      //   Number(this.contractReceivableList[0].laborCost || 0) +
      //   Number(this.contractReceivableList[0].other || 0);
      _this.receivable.total = _this.allMachineTotal;
      console.log(_this.receivable.total, " this.receivable.total");
      return this.money(_this.formInfo.receivableTotal);
    },
    /* 本期应收租金 */
    receivableHireTotal() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (this.contractReceivableList && this.receivable) {
        let total = this.contractReceivableList.reduce((x, y) => {
          let list = y.machineReceivableList.filter((o) => o.checked);
          let h = list.reduce(
            (z, w) =>
              z + (Number(w.hireTotal || 0) + Number(w.pauseHireTotal || 0)),
            0
          );
          return x + h;
        }, 0);
        this.receivable.hire = total;
      }
      return this.money(this.receivable.hire) || 0;
    },
    /* 本期运费 */
    receivableCarriageTotal() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (this.contractReceivableList && this.receivable) {
        let total = this.contractReceivableList.reduce((x, y) => {
          if(y.tripCalType == '1'){
            return x + y.tripVal*this.tripTime
          }else{
            let list = y.machineReceivableList.filter((o) => o.checked);
            let h = list.reduce((z, w) => z + Number(w.carriage || 0), 0);
            return x + h;
          }
         
        }, 0);
        this.receivable.carriage = total;
      }
      return this.money(this.receivable.carriage) || 0;
    },
    /* 本期索赔费用 */
    receivableClaimTotal() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (this.contractReceivableList && this.receivable) {
        let total = this.contractReceivableList.reduce((x, y) => {
          let list = y.machineReceivableList.filter((o) => o.checked);
          let h = list.reduce((z, w) => z + Number(w.claimTotal || 0), 0);
          return x + h;
        }, 0);
        this.receivable.claim = total;
      }
      return this.money(this.receivable.claim) || 0;
    },
    /* 本期其他费用 */
    receivableLaborCostTotal() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (this.contractReceivableList && this.receivable) {
        let total = this.contractReceivableList.reduce(
          (x, y) => x + (Number(y.laborCost || 0) + Number(y.other || 0)),
          0
        );
        this.receivable.other = total;
      }
      return this.money(this.receivable.other) || 0;
    },
    /*结余已收*/
    balanceTotal() {
      let receiptTotal = 0;
      if (this.receipt.total) receiptTotal = Number(this.receipt.total);
      return this.money(receiptTotal - Number(this.settleTotal));
    },
    /*抵扣合计*/
    deduction() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (this.contractReceivableList && this.receivable) {
        let row = this.contractReceivableList[0];
        let pledgeHire = row.pledgeHire ? Number(row.pledgeHire) : 0;
        let pledgeCarriage = row.pledgeCarriage
          ? Number(row.pledgeCarriage)
          : 0;
        let pledgeClaim = row.pledgeClaim ? Number(row.pledgeClaim) : 0;
        let carriageHire = row.carriageHire ? Number(row.carriageHire) : 0;
        let carriageClaim = row.carriageClaim ? Number(row.carriageClaim) : 0;
        this.contractReceivableList[0].deduct =
          pledgeHire +
          pledgeCarriage +
          pledgeClaim +
          carriageHire +
          carriageClaim || 0;
        return this.money(this.contractReceivableList[0].deduct);
      }
      return 0;
    },
    // 合同小计
    allMachineTotal() {
      if (!this.contractReceivableList || (this.contractReceivableList && this.contractReceivableList.length == 0)) {
        return 0;
      }
      if (!this.contractReceivableList[0].machineReceivableList) return 0;
      let list = this.contractReceivableList[0].machineReceivableList.filter(
        (o) => o.checked
      );
      let total = list.reduce((x, y) => x + Number(y.accountTotal) || 0, 0);
      if(this.contractReceivableList[0].tripCalType=='1'){
        total += this.tripTime * this.contractReceivableList[0].tripVal 
      }
      console.log(total, "total");
      this.formInfo.receivableTotal =
        total +
        Number(this.contractReceivableList[0].laborCost || 0) +
        Number(this.contractReceivableList[0].other || 0);
      return this.money(this.formInfo.receivableTotal);
    },
    // 合同小计
    receivableTotal() {
      if (
        !this.receivable ||
        this.receivable.total === undefined ||
        this.receivable.total === null
      ) {
        return 0;
      }
      this.formInfo.total =
        Number(this.receivable.total) - Number(this.balanceTotal);
      return this.money(
        Number(this.receivable.total) - Number(this.balanceTotal)
      );
    },
    /*当期应收 */
    periodTotal() {
      let total = Number(
        this.contractTotal -
        (this.receiptPeriod && this.receiptPeriod.total
          ? this.receiptPeriod.total
          : 0)
      );
      this.formInfo.periodTotal = total;
      this.customDic.periodReceive = total;
      this.customDic.periodTotal = total;
      this.customDic.settlement = this.receivable.total;//结算应收
      this.customDic.settlement = this.receivable.total;//结算应收
      this.customDic.allSettlementTotal = this.formInfo.receivableTotal;
      this.customDic.total = total;
      return this.money(this.formInfo.periodTotal);
    },
  },
  methods: {
    callPhone(value) {
      if (value) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: value,
          // 成功回调
          success: (res) => {
            console.log("调用成功!");
          },
          // 失败回调
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    // 自定义时间选择
    getCustomize(date) {
      uni.showLoading();
      let param = {
        contractNo: this.contractId,
        customerId: this.customerId,
        isSettle: true,
        renterTripType: this.contractReceivableList[0].renterTripType,
        beginDate: date[0],
        endDate: date[1],
        businessNo: this.businessNo?this.businessNo:null,
      };
      this.$network
        .getData(this.$url.SETTLEMENT_CUSTOMIZE, "GET", param)
        .then((res) => {
          uni.hideLoading();
          let machineReceivableList = res.machineReceivableList.map(item=>{
            item.accountTotal=this.machineTotal(item)
            return {
              ...item,
              checked: true,
            }
          })||[] ;

          if (machineReceivableList.length > 0) {
            let list = machineReceivableList.filter((o) => {
              let beginDate = parseISO(o.beginDate).getTime();
              let endDate = parseISO(o.endDate).getTime();
              if (!o.lastSettleDate && !o.lastApplySettleDate) {
                return beginDate <= endDate;
              }
              let lastSettleDate = null;
              if (o.lastSettleDate) {
                lastSettleDate = parseISO(o.lastSettleDate).getTime();
              } else {
                lastSettleDate = parseISO(o.lastApplySettleDate).getTime();
              }

              if (o.lastApplySettleDate) {
                let lastApplySettleDate = parseISO(
                  o.lastApplySettleDate
                ).getTime();
                lastSettleDate =
                  lastApplySettleDate > lastSettleDate
                    ? lastApplySettleDate
                    : lastSettleDate;
              }
              if (this.isApproval) {
                return beginDate <= endDate;
              } else {
                return beginDate <= endDate && lastSettleDate < endDate;
              }
            });
            list.map((e) => {
              e.show = false;
              e.checked = true;
              e.accountTotal = this.machineTotal(e);
            });
            console.log(list,'list99999999999999999777');
            list.sort((a, b) => parseISO(a.enableDate).getTime() - parseISO(b.enableDate).getTime())
            console.log(machineReceivableList,'machineReceivableList9999999999988888');
            this.$set(
              this.contractReceivableList[0],
              "machineReceivableList",
              list
            );
            this.formInfo = {
              ...this.formInfo,
              settleInfoDto: {
                ...this.formInfo.settleInfoDto,
                contractReceivableList: this.contractReceivableList,
              },
            };
            this.$forceUpdate();
          }
          this.receivable = res.receivableCustomize.receivable;
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    dateChange(val) {
      let that=this;
      let date = [];
      date[0] = `${val[0]} 00:00:00`.toString();
      date[1] = `${val[1]} 23:59:59`.toString();
      let contractReceivableList=that.formInfo.settleInfoDto.contractReceivableList||[];
      this.formInfo={
        ...this.formInfo,
        beginDate:date[0],
        endDate:date[1],
        settleInfoDto:{
          ...this.formInfo.settleInfoDto,
          contractReceivableList: contractReceivableList.map((o) => {
            return {
              ...o,
              settleBeginDate:date[0],
              settleEndDate:date[1],
            };
          })
        },
       
      }
      this.contractReceivableList=this.contractReceivableList.map(item=>{
        return {
          ...item,
          settleBeginDate:date[0],
          settleEndDate:date[1],
        }
      })
   console.log(this.contractReceivableList,'contractReceivableList999999999999999911111111');
      this.customDic.beginDate = date[0];
      this.customDic.endDate = date[1];
      if (val.length != 0) {
        // this.getPeriodReceipt(date);
        this.getCustomize(date);
      }
    },
    maskClick() { },
    gotoCollection() {
      uni.navigateTo({
        url: `/businessPages/settledown/collection?contractId=${this.contractId
          }&settlementNo=${this.settlementNo}&proceedsNo=${encodeURIComponent(
            JSON.stringify(this.proceedsNo)
          )}&refundNo=${encodeURIComponent(JSON.stringify(this.refundNo))}`,
      });
    },
    clickBtn(type) {
      if (type == "ok") {
        let pledgeTotal =
          Number(this.contractReceivableList[0].pledgeHire) +
          Number(this.contractReceivableList[0].pledgeCarriage) +
          Number(this.contractReceivableList[0].pledgeClaim);
        let carriageTotal =
          Number(this.contractReceivableList[0].carriageHire) +
          Number(this.contractReceivableList[0].carriageClaim);
        if (pledgeTotal > this.surplusReceiptDeposit) {
          uni.showToast({
            icon: "none",
            title: "抵扣押金超过剩余押金",
          });
          return;
        }
        if (carriageTotal > this.surplusReceiptCarriage) {
          uni.showToast({
            icon: "none",
            title: "运费减免超过剩余运费  ",
          });
          return;
        }
        this.$refs.popup.close();
      } else {
        this.contractReceivableList[0].pledgeHire = 0;
        this.contractReceivableList[0].pledgeCarriage = 0;
        this.contractReceivableList[0].pledgeClaim = 0;
        this.contractReceivableList[0].carriageHire = 0;
        this.contractReceivableList[0].pledgeHire = 0;
        this.contractReceivableList[0].carriageClaim = 0;
        this.$refs.popup.close();
      }
    },
    open() {
      this.$refs.popup.open("center");
    },
    gotoDetial(item, index,tripCalType) {
      console.log(item, index, 'gotoDetial1111');
      uni.navigateTo({
        url: `/businessPages/settledown/settle-machine?item=${encodeURIComponent(
          JSON.stringify(item)
        )}&date=${encodeURIComponent(
          JSON.stringify(this.date)
        )}&index=${index}&businessNo=${this.contractReceivableList[0].businessNo
          }&contractNo=${this.formInfo.contractNo}&tripCalType=${tripCalType}`,
      });
    },
    // 计算预计租期
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
    drop(index) {
      this.$set(
        this.contractReceivableList[0].machineReceivableList[index],
        "show",
        !this.contractReceivableList[0].machineReceivableList[index].show
      );
      this.$forceUpdate();
    },
    changeCheck(item) {
      this.contractReceivableList[0].machineReceivableList[item].checked =
        !this.contractReceivableList[0].machineReceivableList[item].checked;
      this.$forceUpdate();
    },
    showList() {
      this.showDetial = !this.showDetial;
    },
    // 金额转换
    money(str) {
      console.log(str, "money");
      if (typeof str === "number") {
        str = String(str);
      }
      if (str[0] == 0) {
        str.slice(0, 1);
      }
      return Number(str).toFixed(2);
    },
    isIPhoneX() {
      let screenHeight = wx.getSystemInfoSync().screenHeight;
      let bottom = wx.getSystemInfoSync().safeArea.bottom;
      return screenHeight !== bottom;
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

    contractTypeName(type) {
      if (type == "1") {
        return "普";
      } else if (type == "2") {
        return "框";
      } else if (type == "3") {
        return "快";
      }
    },
    //   根据结算单号查详情
    async getDraftDetail(businessNo) {
      let url = this.$url.SETTLE_DETAIL + businessNo;
      try {
        let result = await this.$network.getData(url, "GET", null);
        console.log(result, "result");
        this.setFormInfo(result);
      } catch (err) {
        console.log(err);
      }
    },
    // 设备小计
    machineTotal(item) {
      console.log(item, "machineTotal");
      item.hireTotal ? item.hireTotal : (item.hireTotal = 0);
      item.pauseHireTotal ? item.pauseHireTotal : (item.pauseHireTotal = 0);
      item.claimTotal ? item.claimTotal : (item.claimTotal = 0);
      item.carriage ? item.carriage : (item.carriage = 0);
      item.hireIncrease ? item.hireIncrease : (item.hireIncrease = 0);

      item.carriageIncrease
        ? item.carriageIncrease
        : (item.carriageIncrease = 0);

      // item.claimTotalIncrease
      //   ? item.claimTotalIncrease
      //   : (item.claimTotalIncrease = 0);
      item.claimTotalIncrease = item.claimTotalIncrease || item.claimIncrease || 0;
      item.claimTotalReduce = item.claimTotalReduce || item.claimReduce || 0;
      item.hireReduce ? item.hireReduce : (item.hireReduce = 0);
      item.carriageReduce ? item.carriageReduce : (item.carriageReduce = 0);
      // item.claimTotalReduce
      //   ? item.claimTotalReduce
      //   : (item.claimTotalReduce = 0);
      let total = 0.0;
      total =
        Number(item.hireTotal) +
        Number(item.pauseHireTotal) +
        Number(item.claimTotal) +
        Number(item.carriage) +
        Number(item.hireIncrease) +
        Number(item.carriageIncrease) +
        Number(item.claimTotalIncrease) -
        Number(item.hireReduce) -
        Number(item.carriageReduce) -
        Number(item.claimTotalReduce);
      console.log(total.toFixed(2), "total.toFixed(2)");
      return total.toFixed(2);

      // let total = 0.0;
      // total =
      //   Number(item.hireTotal) +
      //   Number(item.pauseHireTotal) +
      //   Number(item.claimTotal) +
      //   Number(item.carriage)+Number(item.account);

      // return total.toFixed(2);


      // let increase =
      //   Number(item.hireIncrease) +
      //   Number(item.carriageIncrease) +
      //   Number(item.claimIncrease);
      // let reduce =
      //   Number(item.hireReduce) +
      //   Number(item.carriageReduce) +
      //   Number(item.claimReduce);

      // var receivableTotal =
      //   Number(item.hireTotal) +
      //   Number(item.carriage) +
      //   increase +
      //   Number(item.claimTotal) +
      //   Number(item.pauseHireTotal) -
      //   reduce;
      // return Number(receivableTotal.toFixed(2));
    },
    setFormInfo(info) {
      let _this = this;
      // 处理数据
      let originContractReceivableList =
        info.settleInfoDto.contractReceivableList.map((o) => {
          return {
            ...o,
            laborCost: Number(o.laborCost) || 0,
            other: Number(o.other) || 0,
            machineReceivableList: o.machineReceivableList.map((y) => {
              let adjust =
                -Number(y.hireReduce || 0) -
                Number(y.carriageReduce || 0) -
                Number(y.claimReduce || 0) +
                Number(y.hireIncrease || 0) +
                Number(y.carriageIncrease || 0) +
                Number(y.claimIncrease || 0);
              return {
                ...y,
                checked: true,
                show: false,
                accountTotal: _this.machineTotal(y),
                account: adjust || 0,
              };
            }),
          };
        });
      console.log(originContractReceivableList, 'originContractReceivableList');
      this.contractId = info.contractNo || "";
      this.customerId = info.customerId.trim();
      this.settlementNo = info.businessNo || [];
      let contractReceivableList = originContractReceivableList.slice();
      let list = contractReceivableList.map((o) => {
        console.log(o,'o99999999999999999999999999999999999999999');
        if(o.state==6){
          this.rentFlag=true
        }
        let list = o.machineReceivableList.filter((y) => {
          let beginDate = parseISO(y.beginDate).getTime();
          let endDate = parseISO(y.endDate).getTime();
          if (!y.lastSettleDate && !y.lastApplySettleDate) {
            return beginDate <= endDate;
          }
          let lastSettleDate = null;
          if (y.lastSettleDate) {
            lastSettleDate = parseISO(y.lastSettleDate).getTime();
          } else {
            lastSettleDate = parseISO(y.lastApplySettleDate).getTime();
          }

          if (y.lastApplySettleDate) {
            let lastApplySettleDate = parseISO(y.lastApplySettleDate).getTime();
            lastSettleDate =
              lastApplySettleDate > lastSettleDate
                ? lastApplySettleDate
                : lastSettleDate;
          }
          return beginDate <= endDate && lastSettleDate < endDate;

        });
        list.sort((a, b) => parseISO(a.enableDate).getTime() - parseISO(b.enableDate).getTime())
        return {
          ...o,
          machineReceivableList: list,
        };
      });

      this.formInfo = {
        ...info,
        settleInfoDto: {
          ...info.settleInfoDto,
          contractReceivableList: list,
        },
      };
      let beginDate = this.formInfo.beginDate;
      let endDate = this.formInfo.endDate;
      this.date = [beginDate, endDate];
      this.$forceUpdate();
      this.receivable = this.formInfo.settleInfoDto.receivable;
      this.receipt = this.formInfo.settleInfoDto.receipt;
      this.receiptPeriod = {
        ...this.formInfo.settleInfoDto.receiptPeriod,
        total: this.businessNo
          ? this.formInfo.settleInfoDto.receiptPeriod.total
          : 0,
      };

      this.settleTotal = this.formInfo.settleInfoDto.settleTotal;
      // 当前合同数据
      if (!this.isApproval) {
        this.contractReceivableList = JSON.parse(
          JSON.stringify(this.formInfo.settleInfoDto.contractReceivableList)
        );
      } else {
        this.contractReceivableList = JSON.parse(
          JSON.stringify(originContractReceivableList)
        );
        this.$forceUpdate();
      }
          // 退场付清 设备未全部退场 结算周期的结束时间默认展示今天
              this.$nextTick(() => {
                if(originContractReceivableList[0].paymentType == 1&&this.rentFlag&&!this.businessNo){
                  // endDate=format(new Date(), "yyyy-MM-dd hh:mm:ss");
                  // let contractReceivableList=this.contractReceivableList||[];
                  console.log(list,'list9999999999');
                 let arr= originContractReceivableList.map((o) => {
                    if(!this.isApproval){
                      //新增页面未退场结算周期默认展示到今天
                      endDate=format(new Date(), "yyyy-MM-dd hh:mm:ss")
                    }
                  // endDate=this.isApproval?o.settleEndDate:format(new Date(), "yyyy-MM-dd hh:mm:ss");
                  this.date = [beginDate, endDate];
                   return {
                     ...o,
                     settleBeginDate:this.date[0],
                     settleEndDate:this.date[1],
                     beginDate:this.date[0],
                     endDate:this.date[1],
                     machineReceivableList: o.machineReceivableList.map((y) => {
                      let endDate=!y.endDate
                           ? format(new Date(), "yyyy-MM-dd hh:mm:ss")
                           : y.endDate;
                       return {
                         ...y,
                         endDate:endDate?endDate:this.date[1],
                       };
                     }),
                   };
                 });
                 this.formInfo = {
                  ...this.formInfo,
                  settleInfoDto: {
                    ...this.formInfo.settleInfoDto,
                    contractReceivableList:arr,
                  },
                };
                this.contractReceivableList=arr;
                if(!this.isApproval&&!this.businessNo){
                  this.dateChange(this.date)
                }
                }
              });
      if (this.businessNo) {
        //  修改页面回显选中的数据
        this.proceedsNo = this.formInfo.proceedsNo;
        this.refundNo = this.formInfo.refundNo;
      }
    },
  },
};
