<template>
  <view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap"
      >新增转租应付</c-nav-bar-btns
    >
    <!-- 公司详情-头部 -->
    <company-header :companyInfo="companyDic"></company-header>
    <p class="title">
      <span class="line"></span>
      <text style="flex: 1">应付单号：{{ settleDic.businessNo || "--" }}</text>
      <text @click="selectApply" class="sublet-button"> 选择转租单 </text>
    </p>
    <payment-form
      :externalPaymentForm="formInfo"
      :businessNo="settleDic.businessNo"
      @update-sublease-order="updateSublet"
      @update-machine="updateMachine"
      @update-machine-notfetch="updateMachineNotFetch"
      @update-sublet-notfetch="updateSubletNotFetch"
    ></payment-form>
    <p class="title">
      <span class="line"></span>
      <text>结算成本汇总</text>
    </p>
    <payment-total
      :externalPaymentTotal="formInfo"
      :businessNo="settleDic.businessNo"
      @update-settleInfo="updateSettleInfo"
    ></payment-total>
    <view style="padding-bottom: 280rpx"></view>
    <!-- 底部固定按钮 -->
    <view class="fixed-button">
      <view class="payment-summary">
        <view
          >汇总：<text class="text-red-color"
            >￥{{ moneyUtil.dealNumber(receivableTotal) }}</text
          ></view
        >
        <view class="text-orange-color">{{ getSummary }}</view>
      </view>
      <view class="payment-button">
        <view class="cancel-button button" @click="handleBCanclePayment">取消</view>
        <view class="submit-button button" @click="handleBAddPayment">生成应付单</view>
      </view>
    </view>
  </view>
</template>
<script>
import companyHeader from "../sublet-apply/sublet-company/components/company-header.vue";
import paymentForm from "./components/payment-form/index.vue";
import paymentTotal from "./components/payment-total/index.vue";
import subMonths from "date-fns/subMonths";
export default {
  components: {
    companyHeader,
    paymentForm,
    paymentTotal,
  },
  data() {
    return {
      buttons: [],
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      textColor: "#333333",
      fontSize: "14px",
      settleDic: {},
      companyDic: {},
      formInfo: {
        id: null,
        createBy: null,
        createName: null,
        createTime: null,
        updateBy: null,
        updateName: null,
        updateTime: null,
        delFlag: 0,
        start: null,
        end: null,
        businessNo: "",
        subletCompanyId: "",
        subletNo: null,
        beginDate: "",
        endDate: "",
        total: 0,
        increase: null,
        paidTotal: 0,
        paidRemark: "",
        reduce: null,
        settleInfoDto: {
          payableCurrent: {
            total: "",
            price: "",
            freight: "",
            laborCost: "",
            other: "",
            pauseHire: null,
            beginDate: null,
            endDate: null,
          },
          payable: {
            total: 0,
            price: 0,
            freight: 0,
            laborCost: "",
            other: 0,
            pauseHire: null,
            beginDate: "",
            endDate: "",
          },
          paidTotal: null,
          subletPayableList: [],
        },
        remark: null,
        payableCurrent: null,
        subletCompanyName: null,
        contact: null,
        phone: null,
        userName: null,
        orgName: null,
        address: null,
        settlementNos: [],
        deposit: 0,
      }, // 内部用于处理的数据,
      selectIds: [],
      isDetail: false,
      downloadTask: null,
      isupdata: true,
      settlementType: "generateSettle",
    };
  },
  computed: {
    getSummary() {
      return `本次结算剩余应付：当期转租成本 ¥${
        this.formInfo.settleInfoDto.payable.total || 0
      } - 已付 ¥${this.formInfo.paidTotal || 0}`;
    },
    receivableTotal() {
      let _this = this.formInfo.settleInfoDto;
      if (
        !_this.payable ||
        _this.payable.total === undefined ||
        _this.payable.total === null
      ) {
        return 0;
      }
      this.formInfo.total = Number(_this.payable.total) - this.formInfo.paidTotal;
      return this.formInfo.total;
    },
  },
  created() {
    // 事件监听
    uni.$on("choose-apply-emit", (data) => {
      const checkList = data.checkList;
      this.selectIds = checkList.map((o) => o.businessNo);
      let beginDate =
        this.$dateUtil
          .dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss")
          .split(" ")[0] + " 00:00:00";
      let endDate =
        this.$dateUtil.dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss").split(" ")[0] +
        " 23:59:59";
      this.$network
        .getData(this.$url.SUBLET_PAY_GET, "POST", {
          subletNoList: this.selectIds,
          beginDate: beginDate,
          endDate: endDate,
        })
        .then((res) => {
          // this.formInfo = res;
          this.setFormInfo(res);
        });
    });
  },
  onLoad(option) {
    this.businessCode();
    this.companyDic = JSON.parse(decodeURIComponent(option.company));
    if (this.companyDic) {
      this.settleDic.subletCompanyId = this.companyDic.id;
      this.settleDic.subletCompanyName = this.companyDic.name;
      this.settleDic.orgName = this.companyDic.orgName;
      this.settleDic.contact = this.companyDic.contact;
      this.settleDic.address = this.companyDic.address;
    }

    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isupdata = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_DOWNLOAD
        );
      },
    });
    if (this.isupdata === false) {
      // #ifdef APP-PLUS
      let webView = this.$mp.page.$getAppWebview();
      webView.setTitleNViewButtonStyle(0, {
        width: "0",
      });
      // #endif
      // #ifndef APP-PLUS
      this.buttons = [];
      // #endif
    }
  },
  onUnload() {
    this.hide();
  },
  onHide() {
    this.hide();
  },
  methods: {
    setFormInfo(info) {
      let settlementNos = !info.settlementNos ? this.settleNoList : info.settlementNos;

      let list =
        info.settleInfoDto && info.settleInfoDto.subletPayableList
          ? info.settleInfoDto.subletPayableList.map((o) => {
              return {
                ...o,
                // 此处需要修改
                // machinePayableList: this.isEdit
                //   ? o.machinePayableList.filter((y) => {
                //     let beginDate = new Date(this.$escapeDate(y.beginDate)).getTime();
                //     let endDate = new Date(this.$escapeDate(y.endDate)).getTime();

                //     if ((!y.lastSettleDate && !y.lastApplySettleDate) || settlementNos.length > 0) {
                //       return beginDate <= endDate;
                //     }
                //     let lastSettleDate = null;
                //     if (y.lastSettleDate) {
                //       lastSettleDate = new Date(this.$escapeDate(y.lastSettleDate)).getTime();
                //     } else {
                //       lastSettleDate = new Date(this.$escapeDate(y.lastApplySettleDate)).getTime();
                //     }

                //     if (y.lastApplySettleDate) {
                //       let lastApplySettleDate = new Date(this.$escapeDate(y.lastApplySettleDate)).getTime();
                //       lastSettleDate = lastApplySettleDate > lastSettleDate ? lastApplySettleDate : lastSettleDate;
                //     }
                //     return beginDate <= endDate && lastSettleDate < endDate;
                //   })
                //   : [...o.machinePayableList],
              };
            })
          : [];

      this.formInfo = {
        ...info,
        // customerSalesman: customerSalesman,
        settleInfoDto: {
          ...info.settleInfoDto,
          subletPayableList: list.map((o) => {
            return {
              ...o,
              checked: true,
              settlementCycle: [
                o.beginDate
                  ? this.$dateUtil.dateSFormat(o.beginDate)
                  : this.$dateUtil
                      .dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss")
                      .split(" ")[0] + " 00:00:00",
                o.endDate
                  ? this.$dateUtil.dateSFormat(o.beginDate)
                  : this.$dateUtil
                      .dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss")
                      .split(" ")[0] + " 23:59:59",
              ],
              machinePayableList: o.machinePayableList.map((y) => {
                return {
                  ...y,
                  checked: true,
                  settlementCycle: [
                    y.beginDate
                      ? this.$dateUtil.dateSFormat(y.beginDate)
                      : this.$dateUtil
                          .dateSFormat(subMonths(new Date(), 1), "yyyy-MM-dd HH:mm:ss")
                          .split(" ")[0] + " 00:00:00",
                    y.endDate
                      ? this.$dateUtil.dateSFormat(y.endDate)
                      : this.$dateUtil
                          .dateSFormat(new Date(), "yyyy-MM-dd HH:mm:ss")
                          .split(" ")[0] + " 23:59:59",
                  ],
                  adjust: Number(y.increase || 0) - Number(y.reduce || 0),
                };
              }),
            };
          }),
        },
        settlementNos: settlementNos,
      };
      console.log("-------------------  this.formInfo", this.formInfo);
    },
    onNavBarButtonTap() {
      if (this.isupdata === false) {
        uni.showToast({
          icon: "none",
          title: "暂无下载权限...",
        });
        return;
      } else {
        uni.showModal({
          title: "提示",
          content: "确定要导出应付单报表么?",
          success: (res) => {
            if (res.cancel) {
            } else {
              this.exportInvoice(this.settleDic);
            }
          },
        });
      }
    },
    loadData(dict) {
      uni.showLoading();
      let param = {
        businessNo: dict.businessNo,
      };
      this.$network
        .getData(this.$url.SUBLET_PAY_DETAIL, "GET", param)
        .then((result) => {
          this.settleDic = {
            ...result,
          };
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    businessCode() {
      if (!this.isDetail) {
        this.$network
          .getData(this.$url.CREATE_MACHINE_NO, "GET", { prefix: "ZZYF" })
          .then((res) => {
            this.$set(this.settleDic, "businessNo", res);
          });
      }
    },
    selectApply() {
      let checkedList = this.formInfo.settleInfoDto.subletPayableList.map(
        (item) => item.subletNo
      );
      let state = { batchEditMode: "select" };
      let url = `../sublet-tab?index=0&companyId=${
        this.settleDic.subletCompanyId
      }&companyName=${this.settleDic.subletCompanyName}&applyState=${JSON.stringify(
        state
      )}&checkedList=${encodeURIComponent(JSON.stringify(checkedList))}`;
      uni.navigateTo({
        url: url,
      });
    },
    hide() {
      if (this.downloadTask) {
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
    updateSublet(param) {
      let { modifiedInfo, sublet } = param;
      this.$network
        .getData(this.$url.SUBLET_PAY_CUSTOMIZE, "POST", modifiedInfo)
        .then((res) => {
          let newMachinePayableList = res.machinePayableList || [];

          // 更新 this.formInfo.settleInfoDto.subletPayableList
          if (newMachinePayableList.length > 0) {
            this.formInfo.settleInfoDto.subletPayableList.forEach((subletItem) => {
              if (subletItem.subletNo === sublet.subletNo) {
                subletItem.laborCost = sublet.laborCost; // 假设这是绑定的数据
                subletItem.other = sublet.other; // 假设这是绑定的数据
                subletItem.remark = sublet.remark; // 假设这是绑定的数据
                subletItem.beginDate = sublet.beginDate; // 假设这是绑定的数据
                subletItem.endDate = sublet.endDate; // 假设这是绑定的数据
                subletItem.checked = sublet.checked; // 假设这是绑定的数据
                // 用新的 machinePayableList 更新匹配的 subletPayableList 项
                subletItem.machinePayableList = newMachinePayableList.map((o) => {
                  let y = subletItem.machinePayableList.find(
                    (y) => y.licenseId === o.licenseId
                  );
                  return {
                    ...o,
                    checked: y ? y.checked : true,
                    settlementCycle: [
                      this.$dateUtil.dateSFormat(o.beginDate) || new Date(),
                      this.$dateUtil.dateSFormat(o.endDate) || new Date(),
                    ],
                  };
                });
                console.log("subletItem", subletItem);
                subletItem.machinePayableList.filter((o) => {
                  let beginDate = new Date(o.beginDate.replace(/-/g, "/")).getTime();
                  let endDate = new Date(o.endDate.replace(/-/g, "/")).getTime();
                  let lastSettleDate = o.lastSettleDate
                    ? new Date(o.lastSettleDate.replace(/-/g, "/")).getTime()
                    : new Date(o.lastApplySettleDate.replace(/-/g, "/")).getTime();
                  if (o.lastApplySettleDate) {
                    let lastApplySettleDate = new Date(
                      o.lastApplySettleDate.replace(/-/g, "/")
                    ).getTime();
                    lastSettleDate =
                      lastApplySettleDate > lastSettleDate
                        ? lastApplySettleDate
                        : lastSettleDate;
                  }
                  // && lastSettleDate < endDate
                  // 此处原来有上一次还租的逻辑,现在WEB端因为使用子组件数据导致不生效,小程序也同样修改为不生效
                  return beginDate <= endDate;
                });
              }
            });
            console.log("updateSublet-formInfo-inner", this.formInfo.settleInfoDto);
          }
          // this.$set(this.formInfo, "settleInfoDto", this.formInfo.settleInfoDto)
          this.organizeFormInfo();
          console.log("updateSublet-formInfo-1", this.formInfo.settleInfoDto);
          let formInfoCopy = JSON.parse(JSON.stringify(this.formInfo));
          formInfoCopy._updateTimestamp = Date.now(); // 添加或更新时间戳

          this.formInfo = { ...formInfoCopy };
          console.log("updateSublet-formInfo-2", this.formInfo.settleInfoDto);
        });
    },
    updateMachine(param) {
      let { modifiedInfo, machine, sublet } = param;
      this.$network
        .getData(this.$url.SUBLET_PAY_CUSTOMIZE, "POST", modifiedInfo)
        .then((res) => {
          let newMachinePayableList = res.machinePayableList || [];

          // 更新 this.formInfo.settleInfoDto.subletPayableList
          if (newMachinePayableList.length > 0) {
            this.formInfo.settleInfoDto.subletPayableList.forEach((subletItem) => {
              if (subletItem.subletNo === sublet.subletNo) {
                // 用新的 machinePayableList 更新匹配的 subletPayableList 项
                subletItem.machinePayableList = subletItem.machinePayableList.map(
                  (item) => {
                    // 查找在 newMachinePayableList 中与当前项 licenseId 匹配的项
                    let matchedItem = newMachinePayableList.find(
                      (o) => o.licenseId === item.licenseId
                    );

                    // 如果存在匹配项，则更新当前项，否则保持不变
                    if (matchedItem) {
                      return {
                        ...item, // 保留原有属性
                        // 更新属性
                        checked: matchedItem.checked ?? true,
                        beginDate:
                          this.$dateUtil.dateSFormat(matchedItem.beginDate) || new Date(),
                        endDate:
                          this.$dateUtil.dateSFormat(matchedItem.endDate) || new Date(),
                        settlementCycle: [
                          this.$dateUtil.dateSFormat(matchedItem.beginDate) || new Date(),
                          this.$dateUtil.dateSFormat(matchedItem.endDate) || new Date(),
                        ],
                        days: matchedItem.days || 0,
                        price: matchedItem.price || 0,
                        hireMonthly: matchedItem.hireMonthly || 0,
                        pauseDays: matchedItem.pauseDays || 0,
                        rentDays: matchedItem.rentDays || 0,
                        calendarMonths: matchedItem.calendarMonths || 0,
                        calendarRentMonths: matchedItem.calendarRentMonths || 0,
                        calendarRentDays: matchedItem.calendarRentDays || 0,
                        calendarDays: matchedItem.calendarDays,
                        freight: matchedItem.freight || 0,
                        pledge: matchedItem.pledge || 0,
                        hireTotal: matchedItem.hireTotal || 0,
                        pauseHireTotal: matchedItem.pauseHireTotal || 0,
                        originCarriage: matchedItem.originCarriage,
                        machineClaimDtoList: matchedItem.machineClaimDtoList || [],
                        machinePauseDtoList: matchedItem.machinePauseDtoList || [],
                      };
                    } else {
                      return item;
                    }
                  }
                );
              }
            });
          }
          // this.$set(this.formInfo, "settleInfoDto", this.formInfo.settleInfoDto)
          this.organizeFormInfo();
          console.log("formInfo-1", this.formInfo);
          let formInfoCopy = JSON.parse(JSON.stringify(this.formInfo));
          formInfoCopy._updateTimestamp = Date.now(); // 添加或更新时间戳
          this.formInfo = { ...formInfoCopy };
        });
    },
    updateMachineNotFetch(param) {
      let { modifiedInfo, machine, sublet } = param;
      // 遍历 settleInfoDto.subletPayableList 查找对应的 sublet
      this.formInfo.settleInfoDto.subletPayableList.forEach((subletItem) => {
        if (subletItem.subletNo === sublet.subletNo) {
          // 遍历 machinePayableList 查找对应的 machine
          subletItem.machinePayableList.forEach((machineItem) => {
            if (machineItem.licenseId === machine.licenseId) {
              // 更新 machineItem 的字段为 modifiedInfo 对应的字段
              for (let key in modifiedInfo) {
                if (modifiedInfo.hasOwnProperty(key)) {
                  machineItem[key] = modifiedInfo[key];
                }
              }
            }
          });
        }
      });
      this.organizeFormInfo();
      console.log("formInfo-1", this.formInfo);
      let formInfoCopy = JSON.parse(JSON.stringify(this.formInfo));
      formInfoCopy._updateTimestamp = Date.now(); // 添加或更新时间戳
      this.formInfo = { ...formInfoCopy };
    },
    updateSubletNotFetch(param) {
      let { modifiedInfo, sublet } = param;
      // 遍历 settleInfoDto.subletPayableList 查找对应的 sublet
      this.formInfo.settleInfoDto.subletPayableList.forEach((subletItem) => {
        if (subletItem.subletNo === sublet.subletNo) {
          // 更新 machineItem 的字段为 modifiedInfo 对应的字段
          for (let key in modifiedInfo) {
            if (modifiedInfo.hasOwnProperty(key)) {
              subletItem[key] = modifiedInfo[key];
            }
          }
        }
      });
      this.organizeFormInfo();
      console.log("formInfo-1", this.formInfo);
      let formInfoCopy = JSON.parse(JSON.stringify(this.formInfo));
      formInfoCopy._updateTimestamp = Date.now(); // 添加或更新时间戳
      this.formInfo = { ...formInfoCopy };
    },
    updateSettleInfo(param) {
      let modifiedInfo = param;
      for (let key in modifiedInfo) {
        if (modifiedInfo.hasOwnProperty(key)) {
          this.formInfo.settleInfoDto[key] = modifiedInfo[key];
          this.formInfo[key] = modifiedInfo[key];
        }
      }
      console.log("formInfo-paidTotal", this.formInfo);
      let formInfoCopy = JSON.parse(JSON.stringify(this.formInfo));
      formInfoCopy._updateTimestamp = Date.now(); // 添加或更新时间戳
      this.formInfo = { ...formInfoCopy };
    },
    organizeFormInfo() {
      // 初始化用于存储日期的数组
      let dates = [];
      let freightTotal = 0;
      let totalHireTotal = 0;
      let totalIncrease = 0;
      let totalReduce = 0;
      let totalPauseHireTotal = 0;
      let totalLaborCost = 0;
      let totalOther = 0;

      this.formInfo.settleInfoDto.subletPayableList.forEach((sublet) => {
        if (!sublet.checked) return;
        let checkedMachines = sublet.machinePayableList.filter(
          (machine) => machine.checked
        );

        // 收集所有选中机器的日期
        checkedMachines.forEach((machine) => {
          if (machine.beginDate)
            dates.push(new Date(machine.beginDate.replace(/-/g, "/")));
          if (machine.endDate) dates.push(new Date(machine.endDate.replace(/-/g, "/")));

          // 累加统计值
          freightTotal += Number(machine.freight || 0);
          totalHireTotal += Number(machine.hireTotal || 0);
          totalIncrease += Number(machine.increase || 0);
          totalReduce += Number(machine.reduce || 0);
          totalPauseHireTotal += Number(machine.pauseHireTotal || 0);
        });

        totalLaborCost += Number(sublet.laborCost || 0);
        totalOther += Number(sublet.other || 0);
      });

      // 寻找最早和最晚的日期
      let minDate = dates.length ? new Date(Math.min.apply(null, dates)) : null;
      let maxDate = dates.length ? new Date(Math.max.apply(null, dates)) : null;

      // 更新统计值
      this.formInfo.settleInfoDto.payable = {
        total:
          totalHireTotal +
          freightTotal +
          totalIncrease -
          totalReduce +
          totalPauseHireTotal +
          totalLaborCost +
          totalOther,
        price: totalHireTotal + totalPauseHireTotal,
        freight: freightTotal,
        laborCost: totalLaborCost,
        other: totalOther + totalLaborCost,
        pauseHire: totalPauseHireTotal,
        beginDate: minDate ? minDate.toISOString().split("T")[0] : "",
        endDate: maxDate ? maxDate.toISOString().split("T")[0] : "",
      };
      this.formInfo.total =
        Number(this.formInfo.settleInfoDto.payable.total) -
        Number(this.formInfo.paidTotal);
    },
    handleBCanclePayment(type) {
      uni.navigateBack({
        delta: 1,
        success() {
          if (type == "success") {
            uni.$emit("refresh-subletpay-list");
            uni.showToast({
              title: "成功提交转租应付单",
              icon: "none",
            });
          }
        },
      });
    },
    handleBAddPayment() {
      this.validateAndSubmitSettlement();
    },
    /** * 验证并提交结算单。 */
    validateAndSubmitSettlement() {
      // 首先进行验证
      if (!this.validate()) {
        return;
      }
      // 设置结算类型为 "generateSettle"
      this.settlementType = "generateSettle";
      // 检查是否可以进行结算
      if (!this.isNextSettlement()) {
        return;
      }
      // 提交结算单
      this.submit([], "settlement");
    },
    /* 校验必填字段，确保至少选择了一条设备。 */
    validate() {
      // 映射 settleInfoDto.subletPayableList 数组，只保留选中的设备（machinePayableList 中被选中的项）
      let subletPayableList = this.formInfo.settleInfoDto.subletPayableList.map((o) => {
        return {
          ...o,
          machinePayableList: o.machinePayableList.filter((o) => o.checked),
        };
      });
      // 过滤掉没有选中任何设备的列表项
      subletPayableList = subletPayableList.filter(
        (o) => o.machinePayableList.length > 0
      );

      // 如果没有选中至少一条设备，则显示错误消息并返回 false
      if (subletPayableList.length <= 0) {
        uni.showToast({
          title: "请至少选择一条设备进行操作...",
          icon: "none",
        });
        // this.$message.error("请至少选择一条设备进行操作...");
        return false;
      }
      return true;
    },

    /*判断是否能结算*/
    isNextSettlement() {
      if (this.settlementType === "generateSettle") {
        return this.formInfo.settleInfoDto.subletPayableList.every((o) => {
          return o.machinePayableList.every((machine) => {
            if (!machine.checked) return true;

            let lastSettleDate = machine.lastSettleDate
              ? new Date(machine.lastSettleDate.replace(/-/g, "/")).getTime()
              : null;
            let lastApplySettleDate = machine.lastApplySettleDate
              ? new Date(machine.lastApplySettleDate.replace(/-/g, "/")).getTime()
              : null;
            lastSettleDate = Math.max(lastSettleDate, lastApplySettleDate || 0);

            let beginDate = new Date(machine.beginDate.replace(/-/g, "/")).getTime();
            let endDate = new Date(machine.endDate.replace(/-/g, "/")).getTime();

            if (
              lastSettleDate &&
              (lastSettleDate > beginDate || lastSettleDate > endDate)
            ) {
              uni.showToast({
                title: "车辆本次结算周期必须大于上一个结算日期",
                icon: "none",
              });
              // this.$message.error("车辆本次结算周期必须大于上一个结算日期");
              return false;
            }
            return true;
          });
        });
      }
    },
    submit(data) {
      // 用于记录需要检查的机器列表
      let checkMachines = [];

      // 初始化最小和最大日期
      let beginDate = Infinity;
      let endDate = -Infinity;

      // 构建提交表单的机器应付列表
      let subletPayableList = this.formInfo.settleInfoDto.subletPayableList
        .map((item) => {
          let machines = item.machinePayableList.filter((machine) => machine.checked);
          if (machines.length === 0) return null;
          machines = machines.map((item) => {
            item.beginDate = this.$dateUtil.datetimeFormat(item.beginDate);
            item.endDate = this.$dateUtil.datetimeFormat(item.endDate);
            return item;
          });
          let contractMinDate = Math.min(
            ...machines.map((machine) =>
              new Date(machine.beginDate.replace(/-/g, "/")).getTime()
            )
          );
          let contractMaxDate = Math.max(
            ...machines.map((machine) =>
              new Date(machine.endDate.replace(/-/g, "/")).getTime()
            )
          );

          checkMachines.push(
            ...machines.map((machine) => ({
              beginDate: this.$dateUtil.datetimeFormat(machine.beginDate),
              endDate: this.$dateUtil.datetimeFormat(machine.endDate),
              licenseId: machine.licenseId,
            }))
          );

          beginDate = Math.min(beginDate, contractMinDate);
          endDate = Math.max(endDate, contractMaxDate);

          return {
            ...item,
            beginDate: this.$dateUtil.datetimeFormat(contractMinDate),
            endDate: this.$dateUtil.datetimeFormat(contractMaxDate),
            machinePayableList: machines,
          };
        })
        .filter((item) => item !== null);

      // 构建提交表单
      let form = {
        ...this.formInfo,
        settleInfoDto: {
          ...this.formInfo.settleInfoDto,
          subletPayableList,
        },
      };

      // 设置整体表单的开始和结束日期
      form.settleInfoDto.payable.beginDate = this.$dateUtil.datetimeFormat(beginDate);
      form.settleInfoDto.payable.endDate = this.$dateUtil.datetimeFormat(endDate);
      form.beginDate = form.settleInfoDto.payable.beginDate;
      form.endDate = form.settleInfoDto.payable.endDate;

      // 初始化业务信息对象
      let businessInfo = {
        businessNo: this.settleDic.businessNo, // 从组件数据获取业务编号
        subletCompanyId: this.companyDic.id, // 获取子公司ID
        paidRemark: this.formInfo.paidRemark, // 获取支付备注
        paidTotal: this.formInfo.paidTotal, // 获取支付总额
      };
      // 调用 API 提交结算单
      this.$network
        .getData(this.$url.SUBLET_PAY_ADD, "POST", {
          ...form,
          ...businessInfo,
        })
        .then((res) => {
          this.handleBCanclePayment("success");
          // this.formInfo = res;
          // this.setFormInfo(res);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_sublet-styles";

.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.sublet-button {
  width: 156rpx;
  padding: 0 10rpx;
  height: 56rpx;
  background: #e60000;
  border-radius: 6rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-right: 32rpx;
}

.pause-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  // margin: 10px;
  background: #ffffff;
  // border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px solid;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.text-style {
  flex: 1;
  text-align: right;
}

.input-style {
  text-align: right;
  // border-width: 0px 0px 1px 0px;
  // border-style: solid;
  // border-color: $uni-bg-color-grey;
  width: 140px;
  height: 35px;
}

.model-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  padding: 15px;
  align-items: center;
}

.tag-right,
.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.labelstyle {
  color: $uni-color-primary;
  font-size: 24px;
  margin-left: 10px;
}

.attachment-icon {
  color: $uni-color-primary;
  font-size: 14px;
  margin-left: 10px;
}

.delete-items-icon {
  color: #ff0000;
  font-size: 14px;
  margin-left: 10px;
}

.vehicle-list-container {
  padding: 15px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.item-row tag-select {
  flex: 1;
}

.pause-options {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $uni-color-primary;
}

.item-row text {
  flex: 1;
}

.line-s {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 1px;
  background: #eeeeee;
}

.fixed-button {
  display: flex;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.2);
  flex-direction: column;
  height: 220rpx;
  z-index: 90;

  .payment-summary {
    width: 100%;

    .text-red-color {
      color: #e60000;
    }

    .text-orange-color {
      color: #f08200;
    }
  }

  .payment-button {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
