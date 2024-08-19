<template>
  <view class="content">
    <!-- itemData只用来在createStep查询具体的业务数据，再回传 -->
    <!-- 事件和属性一会小驼峰，一会连接线，真的难受死了 -->
    <createStep
      :itemData="itemData"
      :isUpdate="isUpdate"
      :require="true"
      :condition="processObj.variables ? workoutDic.logisticsType : ''"
      :orgId="workoutDic.orgId"
      :updateObj="workoutDic"
      :btnStyle="btnStyle"
      processKey="workOut"
      @data-form="getBackData"
      @submitApply="workoutApply"
    >
      <create-workout
        ref="workout"
        :isFrist="true"
        :isControl="true"
        :isApproval="isApproval"
        :isUpdate="isUpdate"
        :businessNo="businessNo"
        :previewBtn="false"
        :formKey="formKey"
        :nodeList="nodeList"
        :initial-workout-dic="workoutDic"
        @updateWorkoutDic="handleUpdate"
        @processType="getProcess"
      />
      <view class="previewsave" slot="workpreview" @click="preview">预览</view>
      <view class="previewsave share" slot="share" @click="share">分享</view>
    </createStep>
    <sany-popup ref="sanyPop"></sany-popup>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
const model = {
  contractName: null,
  contractNo: null,
  contractDetailId: null,
  billId: null,
  id: null,
  createBy: null,
  createTime: null,
  updateBy: null,
  updateTime: null,
  delFlag: null,
  businessKey: null,
  state: null,
  stateName: null,
  orgId: null,
  orgName: null,
  createName: null,
  locationId: null,
  locationName: null,
  customerId: null,
  customerName: null,
  customerContacts: null,
  customerPhoneNum: null,
  beginDate: null,
  endDate: null,
  constructionType: null,
  rentalType: null,
  settlementType: null,
  paymentType: null,
  advance: null,
  projectName: null,
  longitude: null,
  latitude: null,
  radius: null,
  renterTripType: null,
  invoiceFlag: false,
  invoiceType: null,
  machineList: [],
  checkResults: [],
  checkRemark: null,
  orders: [],
  //  联系人信息
  contactId: null,
  contactName: null,
  phoneNum: null,
  // 是否物流
  logistics: true,
  // 客户类别 个人客户不需要联系人   企业客户需要联系人
  customerType: null,
  deliveryPlace: null, // 交付地点
  dispatchMachines: [],
  outStoreDate: null,
  logisticsType: null,
  logisticsTypeName: null,
  logisticsContact: null,
  logisticsCompanyId: null,
  logisticsCarriage: "0",
  logisticsCompanyName: null,
  logisticsPhone: null,
  enableDate: null,
  deliveryUser: null,
  deliveryUserName: null,
  transportMachine: [],
  transportDriver: [],
};
import createWorkout from "./create-workout.vue";
import createStep from "@/components/workflow/create-step.vue";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
import { processFileDesc } from "@/common/business-method/common-method/util.js";
import datestr from "@/common/common-method/common-method.js";
export default {
  components: {
    createWorkout,
    createStep,
    sanyPopup,
  },
  data() {
    return {
      contacts: [],
      isApproval: false,
      // 此itemData虽然内容很多，但是只取其中审批相关字段，
      // 再通过统一的审批数据查询接口，获取实际的业务数据
      // 【因为itemData和实际业务数据workoutDic还是有差距】
      itemData: null,
      // 实际业务数据
      workoutDic: {
        businessNo: "",
      },
      limitNumList: [],
      businessNo: "",
      processType: "",
      processObj: {}, //退场流程obj
      formKey: "",
      nodeList: [],
      isUpdate: false,
      isChooseTime: false,
      isLoading: false, //是否提交
      btnStyle: "workout",
      bool: true,
      backUpdate: false,
    };
  },

  onLoad(options) {
    // 纯修改
    this.isUpdate = options.isUpdate && options.isUpdate == "1";
    // 审批撤回修改
    this.backUpdate = options.backType && options.backType == "2";
    // 监听 "choose-success" 事件并更新器材信息
    uni.$on("choose-success", (machine) => {
      this.updateMachineLists(machine);
      this.$forceUpdate();
    });
    // 从本地存储加载配置并初始化 workoutDic
    this.loadConfigAndInitWorkoutDic();
    // 加载角色节点
    this.getProcessNode();

    // 加载文件上传控制
    this.getWorkInAndOutFileMust();
    // 处理 options 中的额外逻辑
    this.processOptions(options);
  },
  watch: {
    "workoutDic.customerId": {
      handler(val) {
        if (val) {
          this.getContractDetail(val);
        }
      },
      immediate: true,
    },
    "workoutDic.preEndDate": {
      handler(val) {
        this.setFormDataDate();
      },
      immediate: true,
    },
    "workoutDic.preSettleDate": {
      handler(val) {
        this.setFormDataDate();
      },
      immediate: true,
    },
  },
  onUnload() {
    uni.$off("choose-success");
    uni.$off("machine-choose-filelist-done");
  },
  methods: {
    // 更新器材信息的方法
    updateMachineLists(machine) {
      // 定义一个更新器材列表的内部函数
      const updateList = (list) => {
        // 在提供的列表中寻找与当前选择的器材匹配的项
        const index = list.findIndex(
          (item) =>
            item.machineId === machine.machineId &&
            item.machineTypeId === machine.machineTypeId
        );
        // 如果找到匹配项，则使用新的器材信息更新这个项
        if (index !== -1) {
          list.splice(index, 1, { ...list[index], ...machine });
        }
      };

      // 如果存在 machines 列表，则更新该列表中的器材信息
      if (this.workoutDic.machines) {
        updateList(this.workoutDic.machines);
      }

      // 遍历 dispatchMachines 数组，并更新每个分组中的器材列表
      if (this.workoutDic.dispatchMachines) {
        this.workoutDic.dispatchMachines.forEach((dispatchMachine) => {
          updateList(dispatchMachine.machineList);
        });
      }
    },
    setFormDataDate() {
      if (this.isHaveModel("apply") && !this.isHaveModel("deliver")) {
        this.workoutDic.endDate = this.workoutDic.preEndDate;
        this.workoutDic.settleDate = this.workoutDic.preSettleDate;
      }
    },
    // 从本地存储加载配置并初始化 workoutDic
    loadConfigAndInitWorkoutDic() {
      // 从本地存储中获取配置信息
      const resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
      if (resData) {
        // 查找工作进出填充日期配置项
        const workInOutFillDate = resData.find((o) => o.code === "work_in_out_fill_date")
          ?.value;

        // 根据工作进出填充日期配置项设置 isChooseTime 标志
        this.isChooseTime = workInOutFillDate === "false";
      }

      // 定义基础日期对象，包括预计结束日期和预计结算日期
      const baseDates = {
        preEndDate: this.$datestr.getnowDate(),
        preSettleDate: this.ensureDateTimeFormat(this.$datestr.getnowdate()),
      };
      // 根据配置信息更新 workoutDic 对象
      this.workoutDic = {
        ...this.workoutDic,
        ...baseDates,
        // 如果 isChooseTime 为真，则不设置结束日期和结算日期；否则，使用基础日期
        ...(this.isChooseTime
          ? {}
          : { endDate: baseDates.preEndDate, settleDate: baseDates.preSettleDate }),
      };
    },
    // 处理 options 相关逻辑
    processOptions(options) {
      // 如果 options 中包含 contract 属性，则进行处理
      // 只有通过合同详情快捷创建进场才会执行这个方法
      if (options.contract) {
        console.log("通过合同创建了业务初始视图数据");
        // 获取业务编号
        this.getBusinessNo();
        // 解析 contract JSON 字符串为对象
        const workoutObj = JSON.parse(decodeURIComponent(options.contract));
        // TODO-WORKOUT:初始化数据方法,改ref调用为在父组件组织数据,然后传递给子组件
        this.$refs.workout.setContractData(workoutObj);
        return; // 早期返回，因为后续逻辑不需要执行
      }

      // 如果 options 中包含 item 属性，则进行处理
      // 实际在审核状态和修改状态会用到item传递数据
      if (options.item) {
        console.log("通过业务创建了业务初始视图数据");
        // 解析 item JSON 字符串为对象
        // 此itemData虽然内容很多，但是只取其中审批相关字段，
        // 再通过统一的审批数据查询接口，获取实际的业务数据
        // 【因为itemData和实际业务数据workoutDic还是有差距】
        this.itemData = JSON.parse(decodeURIComponent(options.item));
        // 根据 options 中的 workActionMode 设置审批状态
        this.isApproval = options.workActionMode !== "edit";
        // 根据 options 中的 isUpdate 设置更新状态
        this.isUpdate = options.isUpdate === "1";
      } else {
        // 如果 options 中既不包含 contract 也不包含 item 属性，则获取业务编号
        this.getBusinessNo();
      }
    },
    getContractDetail(customerId) {
      let url = this.$url.LINKMAN_COMPANY_LIST + customerId + "?dutyTypeSort=" + "4";
      this.$network
        .getData(url, "GET")
        .then((result) => {
          this.contacts = result;
          console.log(result, "contacts");
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 预览
    dealData() {
      this.workoutDic = {
        ...this.workoutDic,
        businessNo: this.workoutDic.businessNo
          ? this.workoutDic.businessNo
          : this.businessNo,
      };
    },
    preview() {
      console.log(this.workInDic, "this.workInDic");
      this.dealData();
      let filename = this.$gxfmethod.getFileNameDoc("新增退场单", ".pdf");
      this.$gxfmethod.downFunc(
        "contractapi/api/workOut/preViewWorkOut/v2",
        "POST",
        this.workoutDic,
        filename
      );
    },
    // 分享
    share() {
      this.dealData();
      let filename = this.$gxfmethod.getFileNameDoc("新增退场单", ".docx");
      this.$gxfmethod.downFunc(
        "contractapi/api/workOut/downloadWord/v2",
        "POST",
        this.workoutDic,
        filename
      );
    },
    downxlsc(url, headerDic) {
      let customerName = this.workoutDic.customerName ? this.workoutDic.customerName : "";
      let projectName = this.workoutDic.projectName ? this.workoutDic.projectName : "";
      console.log(url);
      console.log(projectName);
      console.log(customerName);

      let name = "退场-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downFuncNoHead(url, "GET", undefined, filename);
      }
    },
    //获取第一个节点的formKey
    getProcessNode() {
      this.workflowcommon.getApplyProcessNode("workOut").then((result) => {
        console.log(result, "getProcessNode");
        if (result && result.length > 0) {
          if (this.isUpdate && !this.backUpdate) {
            // 修改场景下,修改页面显示,不分角色
            // this.nodeList = [...result];
            // this.firstNode = {
            //   formKey: "apply|dispatch|assignee|deliver",
            // };
            this.formKey = "apply|dispatch|assignee|deliver";
          } else {
            // 非修改场景下,修改页面显示,分角色
            this.nodeList = [...result];
            this.formKey = result[0].formKey;
          }
        }
      });
    },
    getWorkInAndOutFileMust() {
      this.$network
        .getData(`userapi/api/sys/param/workInAndOutFileMust`, "GET")
        .then((e) => {
          this.bool = e.value == "true" ? true : false;
        });
    },
    getProcess(val) {
      this.processType = val.processType;
      this.processObj = val.processObj ? val.processObj : {};
    },
    ensureDateTimeFormat(dateStr, defaultTime = "23:59:59") {
      // 正则表达式检查格式是否为 YYYY-MM-DD
      const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

      // 如果字符串符合日期格式且不包含时间，则添加默认时间
      if (dateOnlyPattern.test(dateStr)) {
        return `${dateStr} ${defaultTime}`;
      } else {
        // 如果字符串已经包含时间或不符合日期格式，直接返回原字符串
        return dateStr;
      }
    },
    // 定义一个方法来显示模态框
    showModal(title, content, isConfirm = false, onConfirm = null) {
      this.$emit("popShow");
      this.$refs.sanyPop.showModal({
        title,
        content,
        confirmButtonName: isConfirm ? "删除" : undefined,
        cancelButtonName: "关闭",
        confirmButtonStyle: isConfirm ? "primary" : undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm && onConfirm) {
            onConfirm();
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
        },
      });
    },
    checkMachines() {
      let licenseIdList = (this.workoutDic.machines || []).map((o) => {
        return o.licenseId;
      });
      let param = {
        licenseIdList: licenseIdList,
        date: this.ensureDateTimeFormat(this.workoutDic.settleDate),
        contractNo: this.workoutDic.contractNo || "",
        businessNo: this.isUpdate || this.isApprove ? this.workoutDic.businessNo : null,
      };
      let url = this.$url.WORK_OUT_CHECK;
      return new Promise((resolve, reject) => {
        this.$network
          .getData(url, "POST", param)
          .then((result) => {
            uni.hideLoading();
            if (result && result.length > 0) {
              this.showModal(
                "提示",
                "[" + result.join(",") + "]结算时间不得早于进场时间或上次结算时间"
              );
              reject("fail");
            } else {
              resolve("sucess");
            }
          })
          .catch((e) => {
            console.log("catch");
            reject("fail");
            uni.hideLoading();
          });
      });
    },
    getWorkOutOrderList() {
      let param = {
        contractDetailId: this.workoutDic.contractDetailId || "",
        contractNo: this.workoutDic.contractNo || "",
      };
      let url = this.$url.WORK_OUT_ORDER_LEFT;
      return new Promise((resolve, reject) => {
        this.$network
          .getData(url, "GET", param)
          .then((result) => {
            uni.hideLoading();
            this.limitNumList = result;
            resolve("sucess");
            // say:此处不需要校验
            // if (orders.some((o) => o.usedNum && o.usedNum > this.getUseMaxNum(o))) {
            //   //有车辆大于可用车辆最大数
            //   reject("申请设备已超出剩余可退场数");
            // } else {
            //   //整体提交时需要判断调度车辆是否符合
            //   if (this.isHaveModel("deliver")) {
            //     if (
            //       orders.some((o) => this.getCurMachineList(o) > this.getUseMaxNum(o))
            //     ) {
            //       //有车辆大于可用车辆最大数
            //       console.log("fail");
            //       reject("所选车辆已超出可选范围");
            //     } else {
            //       console.log("sucess");
            //       resolve("sucess");
            //     }
            //   } else {
            //     resolve("sucess");
            //   }
            // }
          })
          .catch((e) => {
            console.log("catch");
            reject("fail");
            uni.hideLoading();
          });
      });
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getCurMachineList(item) {
      if (this.workoutDic.machines && this.workoutDic.machines.length) {
        let m = this.workoutDic.machines.filter((o) => {
          return o.contractOrderId === item.id;
        });
        console.log("m:" + (m ? m.length : 0));
        return m ? m.length : 0;
      } else {
        return 0;
      }
    },
    getUseMaxNum(item) {
      let order = this.limitNumList.find((o) => {
        return o.id === item.id;
      });
      if (order) {
        if (order.workInNum > 0) {
          let num = order.workInNum - order.actualNum - order.applyNum;
          console.log("num" + num);
          return num;
        }
        return 0;
      }
      return 0;
    },
    async getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, "TC");
      let result = await this.$network.getData(url, "GET", null);
      let nowDate = this.$gxfmethod.getnowdateSS();
      this.workoutDic = {
        ...this.workoutDic,
        businessNo: result,
        preSettleDate: this.workoutDic.preSettleDate
          ? this.workoutDic.preSettleDate
          : nowDate,
        preEndDate: this.workoutDic.preEndDate
          ? this.workoutDic.preEndDate
          : this.changestr(nowDate) + " 23:59:59",
        settleDate: this.workoutDic.settleDate
          ? this.workoutDic.settleDate
          : this.workoutDic.preSettleDate
          ? this.workoutDic.preSettleDate
          : nowDate,
        endDate: this.workoutDic.endDate
          ? this.workoutDic.endDate
          : this.workoutDic.preEndDate
          ? this.workoutDic.preEndDate
          : this.changestr(nowDate) + " 23:59:59",
      };
      this.businessNo = result;
    },
    // 从审批流中获取workoutDic数据
    getBackData(val) {
      // 默认赋值
      // TODO-WORKOUT【DO】：退场创建、审批、修改实际赋值位置
      // this.$refs.workout.setWorkDic(JSON.parse(val));
      // 有审批流
      if (val) {
        let workoutDic = JSON.parse(val);
        // 在 setWorkDic 方法中简化的使用示例
        workoutDic.machines = (workoutDic.machines || []).map((machine) => ({
          ...machine,
          fileList: (machine.fileList || []).map((file) => ({
            ...file,
            ...processFileDesc(file.fileDesc),
          })),
        }));
        this.workoutDic = { ...workoutDic };
      } else {
        this.workoutDic = {
          ...this.workoutDic,
          ...this.itemData,
        };
      }
    },
    handleUpdate(val) {
      if (JSON.stringify(this.workoutDic) !== JSON.stringify(val)) {
        this.workoutDic = { ...val };
      }
    },
    judgeApply() {
      if (!this.workoutDic.contractNo) {
        uni.showToast({
          icon: "none",
          title: "请选择合同",
        });
        return false;
      }
      if (!this.workoutDic.endPlace) {
        uni.showToast({
          icon: "none",
          title: "请选择送达地点",
        });
        return false;
      }
      if (!this.workoutDic.deliveryPlace) {
        uni.showToast({
          icon: "none",
          title: "请选择交机地点",
        });
        return false;
      }
      //整体填写去重
      if (!(this.isHaveModel("apply") && this.isHaveModel("deliver"))) {
        if (!this.workoutDic.preEndDate) {
          uni.showToast({
            icon: "none",
            title: "请选择计划接机时间",
          });
          return false;
        }
        if (!this.workoutDic.preSettleDate) {
          uni.showToast({
            icon: "none",
            title: "请选择计划结算时间",
          });
          return false;
        }
      }
      if (!this.workoutDic.orders) {
        uni.showToast({
          icon: "none",
          title: "退场设备不能为空",
        });
        return false;
      }

      if (
        this.bool &&
        this.isHaveModel("deliver") &&
        (!this.workoutDic.fileList || this.workoutDic.fileList.length == 0)
      ) {
        uni.showToast({
          icon: "none",
          title: "请选择附件",
        });
        return false;
      }
      if (
        !this.workoutDic.orders.some((o) => o.usedNum && Number.parseInt(o.usedNum) > 0)
      ) {
        uni.showToast({
          icon: "none",
          title: "设备数量不能为0",
        });
        return false;
      }
      return true;
    },
    judgeLogistics() {
      if (this.workoutDic.logisticsType == "2" && this.isHaveModel("logistics")) {
        if (!this.workoutDic.logisticsCompanyId) {
          uni.showToast({
            icon: "none",
            title: "请选择物流公司",
          });
          return false;
        }
        if (
          !this.workoutDic.logisticsPhone ||
          this.workoutDic.logisticsPhone.trim() === ""
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入联系人电话",
          });
          return false;
        }
        if (
          this.workoutDic.logisticsPhone &&
          !datestr.isphonenum(this.workoutDic.logisticsPhone)
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入正确的联系人电话",
          });

          return false;
        }
        if (!this.workoutDic.deliveryContact) {
          uni.showToast({
            icon: "none",
            title: "请输入交机联系人",
          });
          return false;
        }
        if (
          !this.workoutDic.deliveryPhone ||
          !datestr.isphonenum(this.workoutDic.deliveryPhone)
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入正确的交机联系人电话",
          });
          return false;
        }
        if (
          this.workoutDic.logisticsCarriage != null &&
          this.workoutDic.logisticsCarriage === ""
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入物流运费",
          });
          return false;
        }
      }
      if (this.workoutDic.logisticsType == "3" && this.isHaveModel("logistics")) {
        if (
          !this.workoutDic.transportMachine ||
          (this.workoutDic.transportMachine &&
            this.workoutDic.transportMachine.length <= 0)
        ) {
          uni.showToast({
            icon: "none",
            title: "请选择运输车辆",
          });
          return false;
        }
        if (
          !this.workoutDic.logisticsContact ||
          this.workoutDic.logisticsContact.trim() === ""
        ) {
          uni.showToast({
            icon: "none",
            title: "请选择运输联系人",
          });
          return false;
        }
        if (
          !this.workoutDic.logisticsPhone ||
          this.workoutDic.logisticsPhone.trim() === ""
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入联系人电话",
          });
          return false;
        }
        if (
          this.workoutDic.logisticsPhone &&
          !datestr.isphonenum(this.workoutDic.logisticsPhone)
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入正确的联系人电话",
          });

          return false;
        }
        if (!this.workoutDic.deliveryContact) {
          uni.showToast({
            icon: "none",
            title: "请选择交机联系人",
          });
          return false;
        }
        if (
          !this.workoutDic.deliveryPhone ||
          !datestr.isphonenum(this.workoutDic.deliveryPhone)
        ) {
          uni.showToast({
            icon: "none",
            title: "请选择交机联系人电话",
          });
          return false;
        }
        if (
          this.workoutDic.logisticsCarriage != null &&
          this.workoutDic.logisticsCarriage === ""
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入物流运费",
          });
          return false;
        }
      }
      return true;
    },
    judgeAssignee() {
      if (!this.workoutDic.deliveryUser) {
        uni.showToast({
          icon: "none",
          title: "请选择接机人员",
        });
        return false;
      }
      return true;
    },

    judgeDispatch() {
      if (
        !this.workoutDic.machines ||
        (this.workoutDic.machines && this.workoutDic.machines.length <= 0)
      ) {
        uni.showToast({
          icon: "none",
          title: "至少选择一台退场设备",
        });
        return false;
      }
      return true;
    },
    judgeDeliver() {
      if (!this.workoutDic.endDate) {
        uni.showToast({
          icon: "none",
          title: "请选择接机时间",
        });
        return false;
      }
      if (!this.workoutDic.settleDate) {
        uni.showToast({
          icon: "none",
          title: "请选择结算时间",
        });
        return false;
      }
      if (
        !this.workoutDic.machines ||
        (this.workoutDic.machines && this.workoutDic.machines.length <= 0)
      ) {
        uni.showToast({
          icon: "none",
          title: "至少选择一台退场设备",
        });
        return false;
      }
      this.workoutDic = {
        ...this.workoutDic,
        settleDate: this.workoutDic.settleDate ? this.workoutDic.settleDate : null,
        inStoreDate: this.workoutDic.inStoreDate
          ? this.findNotStr(this.workoutDic.inStoreDate, "00:00:00")
            ? this.workoutDic.inStoreDate + " 00:00:00"
            : this.workoutDic.inStoreDate
          : null,
        outType: 1,
        outTypeName: "直接退场",
      };
      return true;
    },
    //获取第一步创建的formKey
    getFirstModel(formKey) {
      if (!formKey) {
        return null;
      }
      let arr = [];
      if (formKey.indexOf("|") !== -1) {
        arr = formKey.split("|");
      } else {
        arr.push(formKey);
      }
      return arr;
    },
    isHaveModel(modelName) {
      let createList = this.getFirstModel(this.formKey);
      // 检查 createList 是否为 null 或 undefined
      if (createList && createList.find((o) => o === modelName)) {
        return true;
      }
      return false;
    },
    /**
     * 校验必选附件
     * 遍历workoutDic.machines中的每台机器，确保所有标记为必填的附件都已上传
     */
    validateAttachments() {
      if (!this.workoutDic.machines) return true;
      for (const machine of this.workoutDic.machines) {
        const missingRequiredFiles = machine.fileList?.some(
          (file) => file.required && !file.url
        );
        if (missingRequiredFiles) {
          uni.showToast({
            title: "请上传必填项",
            duration: 2000,
            icon: "none",
          });
          return false;
        }
      }
      return true;
    },

    /**
     * 根据模型名称判断是否需要进行特定的数据校验
     */
    performModelSpecificValidations() {
      if (this.isHaveModel("apply") && !this.judgeApply()) {
        console.log("apply校验不通过");
        return false;
      }
      if (this.isHaveModel("logistics") || this.isHaveModel("dispatch")) {
        console.log("logistics校验不通过");
        return this.judgeLogistics();
      }
      // 客户自运需要清空数据
      this.clearLogisticsDataForSelfDelivery();
      if (this.isHaveModel("assignee") && !this.judgeAssignee()) {
        console.log("assignee校验不通过");
        return false;
      }
      if (this.isHaveModel("deliver") && !this.judgeDeliver()) {
        console.log("deliver校验不通过");
        return false;
      }
      return true;
    },
    /**
     * 清空客户自运的物流数据
     */
    clearLogisticsDataForSelfDelivery() {
      if (this.workoutDic.logisticsType == "3") {
        Object.assign(this.workoutDic, {
          logisticsPhone: null,
          logisticsContact: null,
          logisticsCompanyName: null,
          logisticsCompanyId: null,
          logisticsCarriage: 0,
          transportMachine: [],
          transportDriver: [],
        });
      }
    },
    /**
     * 校验数据的主函数。
     * 此函数负责在数据提交前执行一系列校验步骤，确保所有必要的数据项都符合要求。
     */
    async checkData() {
      // 使用`validateAttachments`方法校验必选附件是否全部上传。
      // `call(this)`确保在`validateAttachments`方法内部可以访问当前组件的上下文(`this`)。
      if (!this.validateAttachments.call(this)) return Promise.reject("fail");
      // 检查`formKey`是否定义了需要校验的模型。如果没有找到任何模型，则校验失败。
      if (!this.getFirstModel(this.formKey)) return Promise.reject("fail");
      // 执行与特定模型相关的校验。例如，检查申请、物流、指派等模块的特定字段是否已正确填写。
      if (!this.performModelSpecificValidations.call(this)) return Promise.reject("fail");
      // 检查结算日期必须在退场日期之前
      // if (this.isHaveModel("apply") && !this.isHaveModel("deliver")) {
      //   if (!this.validatePreDates()) {
      //     uni.showToast({
      //       icon: "none",
      //       title: "计划结算日期必须在计划退场日期之前",
      //     });
      //     return Promise.reject("fail");
      //   }
      // }
      // if (this.isHaveModel("deliver")) {
      //   if (!this.validateDates()) {
      //     uni.showToast({
      //       icon: "none",
      //       title: "结算日期必须在退场日期之前",
      //     });
      //     return Promise.reject("fail");
      //   }
      // }
      if (this.isHaveModel("deliver")) {
        if (this.workoutDic.machines) {
          if (
            this.workoutDic.machines.length == 0 &&
            this.formKey.indexOf("deliver") != -1
          ) {
            uni.showToast({
              icon: "none",
              title: "请选择设备",
            });
            return Promise.reject("fail");
          }
        } else {
          uni.showToast({
            icon: "none",
            title: "请选择设备",
          });
          return Promise.reject("fail");
        }
      }

      try {
        // 异步获取当前未进场的设备列表。

        await this.getWorkOutOrderList();
        // 如果当前表单包含交付(deliver)模型，则进一步校验机器信息。
        if (this.isHaveModel("deliver")) {
          await this.checkMachines();
        }
        // 如果所有校验都通过，则函数返回"success"。
        return Promise.resolve("success");
      } catch (error) {
        // 如果在校验过程中捕获到任何错误，显示错误提示，并返回校验失败。
        // uni.showToast({
        //   icon: "none",
        //   title: error.toString(),
        // });
        return Promise.reject("fail");
      }
    },
    validatePreDates() {
      // 解析日期字符串为日期对象
      const settleDate = new Date(
        this.ensureDateTimeFormat(this.workoutDic.preSettleDate)
      );
      const endDate = new Date(this.workoutDic.preEndDate);

      // 检查日期是否有效
      if (isNaN(settleDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      // 比较日期
      if (settleDate > endDate) {
        return false;
      }

      // 如果日期校验通过，则返回 true
      return true;
    },
    validateDates() {
      // 解析日期字符串为日期对象
      const settleDate = new Date(this.ensureDateTimeFormat(this.workoutDic.settleDate));
      const endDate = new Date(this.workoutDic.endDate);

      // 检查日期是否有效
      if (isNaN(settleDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      // 比较日期
      if (settleDate > endDate) {
        return false;
      }

      // 如果日期校验通过，则返回 true
      return true;
    },
    //是否查找到‘00：00：00’
    findNotStr(str, findstr) {
      return str.indexOf(findstr) === -1;
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    workoutApply(val) {
      let vm = this;
      if (this.isLoading) {
        return;
      }
      if (this.workoutDic.machines && this.workoutDic.machines.length) {
        for (let i = 0; i < this.workoutDic.machines.length; i++) {
          if (
            this.workoutDic.machines[i].fileList &&
            this.workoutDic.machines[i].fileList.length
          ) {
            // 2.再过滤url为空的
            let fileList = this.workoutDic.machines[i].fileList.filter(
              (item) => item.url
            );
            this.workoutDic.machines.splice(i, 1, {
              ...this.workoutDic.machines[i],
              fileList,
            });
          }
        }
      }
      this.workoutDic = {
        ...this.workoutDic,
        contactName:
          this.workoutDic.contractDetailDto?.contactName ||
          (this.contacts[0] ? this.contacts[0].name : null),
        contactId:
          this.workoutDic.contractDetailDto?.contactId ||
          (this.contacts[0] ? this.contacts[0].id : null),
        phoneNum:
          this.workoutDic.contractDetailDto?.phoneNum ||
          (this.contacts[0] ? this.contacts[0].phoneNum : null),
      };
      this.isLoading = true;
      uni.showLoading({
        mask: true,
      });
      if (this.isUpdate) {
        let urlstr = this.$url.WORK_OUT_UPDATE_CHECK.replace(
          /{id}/,
          this.workoutDic.businessNo
        );
        this.$network
          .getData(urlstr, "GET", {})
          .then((checkRes) => {
            this.workoutDic = {
              ...this.workoutDic,
              outType: 1,
              outTypeName: "直接退场",
            };
            this.$network
              .getData(
                this.$url.WORK_OUT_UPDATE + val,
                "POST",
                {
                  ...this.workoutDic,
                  settleDate: this.ensureDateTimeFormat(this.workoutDic.settleDate),
                },
                { hideError: true }
              )
              .then((result) => {
                this.isLoading = false;
                uni.$emit("refresh-contract-list", {
                  type: "workout",
                });
                uni.$emit("refresh-notification-list", {
                  type: "apply",
                });
                uni.navigateBack({
                  animationDuration: 200,
                });
                uni.hideLoading();
              })
              .catch((err) => {
                this.isLoading = false;
                uni.hideLoading();
                uni.showToast({
                  title: err.message,
                  icon: "none",
                });
              });
          })
          .catch((checkRes) => {
            if (checkRes && checkRes.code == 500) {
              // 在调用showModal之前构建消息
              let message = checkRes.message || "请联系客服人员";

              // 检查是否有result
              if (checkRes.result) {
                let documentNumbers;

                // 如果result是数组，使用join方法拼接单据号
                if (Array.isArray(checkRes.result)) {
                  documentNumbers = checkRes.result.join(", ");
                } else {
                  // result是字符串，直接使用
                  documentNumbers = checkRes.result;
                }

                // 将单据号拼接到消息上
                message += ` 相关单据号: ${documentNumbers}`;
              }
              // 删除检查失败，显示失败信息
              this.showModal("无法修改", message);
            }
          });
      } else {
        this.workoutDic = {
          ...this.workoutDic,
          outType: 1,
          outTypeName: "直接退场",
        };
        this.$network
          .getData(this.$url.WORK_OUT_CREATE + val, "POST", {
            ...this.workoutDic,
            settleDate: this.ensureDateTimeFormat(this.workoutDic.settleDate),
          })
          .then((result) => {
            this.isLoading = false;
            uni.$emit("refresh-contract-list", {
              type: "workout",
            });
            uni.$emit("refresh-notification-list", {
              type: "apply",
            });
            uni.navigateBack({
              animationDuration: 200,
            });
            uni.hideLoading();
          })
          .catch((err) => {
            this.isLoading = false;
            uni.hideLoading();
            uni.showToast({
              title: err.message,
              icon: "none",
            });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
}

.cancel-btn {
  color: black !important;
}

.previewsave {
  width: 160rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f08200;
  border-radius: 6rpx;
  color: #fff;
}

.share {
  margin-left: 8px !important;
}

::v-deep .img-upload-view,
::v-deep .img-bg-view {
  background: #fff !important;
}

::v-deep .cancel-btn {
  border-radius: 6rpx !important;
}
</style>
