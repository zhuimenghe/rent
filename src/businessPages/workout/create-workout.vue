<template>
  <view class="content">
    <c-nav-bar flexAlign="center" v-if="!isDetail">
      {{ titleL }}
    </c-nav-bar>
    <scroll-view scroll-y class="flex-scroll-wrapper">
      <contractHead :contractDic="workoutDic" @callPhone="handleCallPhone"></contractHead>
      <view>
        <b-esign-timeline
          v-if="isDetail & isShowEsignTimeline"
          ref="timeline"
          showExpand
          :businessNo="workoutDic.businessNo"
        ></b-esign-timeline>
        <modelApply
          v-if="isShowModel('apply')"
          ref="applyModel"
          :businessNo="businessNo"
          :workoutDic="workoutDic"
          :isDetail="isDetail"
          :isEdit="isEditModel('apply') && !isDetail"
          :previewBtn="previewBtn"
          :isRemoveRepeat="isShowRepeat('apply') && isShowRepeat('deliver')"
          :isRemoveLogistics="isShowModel('apply') && isShowModel('dispatch')"
          @goTo="goTo"
          @showPick="showPick"
          @getNumValue="getNumValue"
          @setComment="setComment"
          @setContactVal="setContactVal"
          @deliveryPlace="setdeliveryPlace"
          @setEndPlace="setEndPlace"
          @setMileage="setMileage"
        />

        <modelAssign
          v-if="isShowModel('assignee') && showWorkOutAssgin"
          ref="assignModel"
          :workoutDic="workoutDic"
          :isEdit="isEditModel('assignee') && !isDetail"
          @showPick="showPick"
        />

        <!--:isRemoveRepeat="isShowModel('apply') && isShowModel('deliver') &&isEditModel('apply') && isEditModel('deliver')"-->
        <modelLocale
          v-if="isShowModel('deliver')"
          ref="localeModel"
          :workoutDic="workoutDic"
          :isControl="isControl"
          :isApproval="isApproval"
          :isDetail="isDetail"
          :isEdit="isEditModel('deliver') && !isDetail"
          @updateFile="updateFile"
          @showPick="showPick"
          @goTo="goTo"
          @setComment="setComment"
          @deleteDevice="deleteDevice"
          @setScanMachines="setScanMachines"
        />
        <modelLogistics
          v-if="
            isShowModel('dispatch') ||
            (isShowModel('logistics') && workoutDic.logisticsType !== '1')
          "
          ref="logisticsModel"
          :workoutDic="workoutDic"
          :modelName="isShowModel('dispatch') ? '调度' : '物流信息'"
          :isEdit="(isEditModel('dispatch') || isEditModel('logistics')) && !isDetail"
          :showLogistics="workoutDic.logisticsType !== '1'"
          :showSelectLogistics="isShowModel('dispatch')"
          @goTo="goTo"
          @setLogistics="setLogistics"
          @showPick="showPick"
        >
        </modelLogistics>
      </view>
    </scroll-view>
    <esign-footer v-if="isDetail" :esignParams="esignParams"></esign-footer>
    <!-- 类型选择 -->
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <!-- 时间选择 -->
    <w-picker
      :mode="datetype"
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
import modelApply from "./model/model-apply.vue";
import modelLogistics from "./model/model-logistics.vue";
import modelDispatch from "./model/model-dispatch";
import modelAssign from "./model/model-assign.vue";
import modelLocale from "./model/model-locale.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import contractHead from "../components/contract-head";
import esignFooter from "../components/esign-footer.vue";
import { getDate, handleCallPhone } from "@/common/business-method/common-method/util.js";

export default {
  components: {
    modelApply,
    modelLogistics,
    modelDispatch,
    modelAssign,
    modelLocale,
    wPicker,
    esignFooter,
    contractHead,
  },
  props: {
    isControl: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      //修改页面:
      type: Boolean,
      default: false,
    },
    // 是否是审批页面
    isApproval: {
      type: Boolean,
      default: false,
    },
    businessNo: {
      type: String,
      default: "",
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    // 是否是新增页面
    // 是否是第一步
    isFrist: {
      type: Boolean,
      default: false,
    },
    formKey: {
      type: String,
      default: "",
    },
    nodeList: {
      type: Array,
      default() {
        return null;
      },
    },
    showWorkOutAssgin: {
      type: Boolean,
      default: true,
    },
    previewBtn: {
      type: Boolean,
      default: false,
    },
    // 从父组件接收的 数据
    initialWorkoutDic: {
      type: Object,
      default: {
        orders: [],
        machines: [],
      },
    },
  },
  data() {
    return {
      machineTypeIdList: [],
      // 子组件数据副本
      workoutDic: {
        orders: [],
        machines: [],
      },
      processType: "", //流程配置的类型

      //apply
      addrObj: null,
      datetype: "date",
      pickType: "",
      selectList: [],
      transArr: [], //物流类型列表
      staffList: [], //指派人员列表
      curItem: 0,
      outTypes: [], //退场方式
      checkList: [],
      notBillMs: [],
      mBills: [],
    };
  },
  watch: {
    machineTypeIdList: {
      handler(val) {
        if (val.length > 0) {
          this.getMachineFileNum(val);
        }
      },
    },
    // 这个
    initialWorkoutDic: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.workoutDic = {
            ...this.workoutDic,
            ...newVal,
          };
          this.setWorkDic(this.workoutDic);
          this.machineTypeIdList = (this.workoutDic.machines || []).map(
            (o) => o.machineTypeId
          );
        }
        // this.$emit("workoutDic", newVal);
      },
      deep: true,
    },
    workoutDic: {
      handler(newVal) {
        this.$emit("updateWorkoutDic", newVal);
      },
      deep: true,
    },
    nodeList(val) {
      if (this.isEditModel("apply")) {
        this.loadTrans();
      }
      if (this.isEditModel("dispatch")) {
        this.loadTrans();
      }
      if (this.isEditModel("assignee")) {
        this.getUserLeaders();
      }
      if (this.isEditModel("deliver")) {
        this.loadOutTypes();
        this.getCheckList();
      }
    },
  },
  computed: {
    titleL() {
      let title = "";
      if (this.isDetail) {
        title = "退场详情";
      } else if (this.isApproval) {
        title = "退场单审批";
      } else if (this.isUpdate) {
        title = "退场单修改";
      } else {
        title = "新建退场单";
      }
      return title;
    },
    isShowEsignDetail() {
      return this.workoutDic.signFlowId == "1";
    },
    esignParams() {
      return {
        businessState: this.workoutDic.state,
        flowStatus: this.workoutDic.flowStatus,
        signFlowId: this.workoutDic.signFlowId,
        businessType: "workOut",
        contactId: this.workoutDic.contactId,
        customerId: this.workoutDic.customerId,
        customerName: this.workoutDic.customerName,
        businessId: this.workoutDic.id,
        businessTitle:
          this.workoutDic.customerName + "-" + this.workoutDic.projectName + "退场单",
        businessNo: this.workoutDic.businessNo,
        contractNo: this.workoutDic.contractNo,
        // flowId:this.workoutDic.flowId,
        customerSalesman: this.workoutDic.customerSalesman,
        contactName: this.workoutDic.contactName,
        customerPhoneNum: this.workoutDic.customerPhoneNum,
        orgId: this.workoutDic.orgId,
        customerSalesmanPhoneNum: this.workoutDic.customerSalesmanPhone,
        customerSalesmanName: this.workoutDic.customerSalesmanName,
        phoneNum: this.workoutDic.phoneNum,
        customerType: this.workoutDic.customerType,
        signFlowTitle: `${this.workoutDic.customerName}-${this.workoutDic.projectName}`,
      };
    },
    isShowEsignTimeline() {
      return this.workoutDic.signFlow == "1";
    },
  },
  async created() {
    // 数据初始化
    this.workoutDic = {
      ...this.initialWorkoutDic,
    };
    await this.loadTrans();
    this.setWorkDic(this.initialWorkoutDic);

    // 审批流相关
    uni.getStorage({
      key: "workOut",
      success: (res) => {
        this.processType = res.data
          ? res.data.customizedKey
            ? res.data.customizedKey
            : "workOutBase"
          : "workOutBase";
        this.$emit("processType", {
          processObj: res.data ? res.data : null,
          type: this.processType,
        });
      },
      fail: () => {
        //没有流程的情况下
        this.processType = "workOutWhole";
        this.$emit("processType", {
          processObj: null,
          type: this.processType,
        });
      },
    });

    //apply
    uni.$on("choose-contract-emit", (obj) => {
      console.log("choose-contract-emit" + JSON.stringify(obj.dict));
      let contractObj = obj.dict;
      this.setContractData(contractObj);
    });

    uni.$on("choose-address", (result) => {
      if (result.type == "deliveryPlace") {
        this.workoutDic = {
          ...this.workoutDic,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          deliveryPlace: result.data.address,
        };
      } else if (result.type == "endPlace") {
        this.workoutDic = {
          ...this.workoutDic,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
          endPlace: result.data.address,
        };
      }

      this.addrObj = {
        address: result.data.address,
        latitude: result.data.latitude,
        longitude: result.data.longitude,
        currentRadius: result.data.currentRadius,
      };
    });

    // logistics
    uni.$on("choose-trans-emit", (transinfo) => {
      console.log("choose-trans-emit", transinfo);
      let transChooseDic = transinfo.dict;
      // this.workoutDic = {
      //   ...this.workoutDic,
      //   logisticsCompanyId: obj.dict.id,
      //   logisticsCompanyName: obj.dict.name,
      //   logisticsContactPerson: obj.dict,
      //   logisticsContact: obj.dict.contacts,
      //   logisticsPhone: obj.dict.phoneNum,
      // };
      // 第三方物流
      if (
        this.workoutDic.logisticsCompanyId &&
        this.workoutDic.logisticsCompanyId === transChooseDic.companyId
      ) {
        this.workoutDic = {
          ...this.workoutDic,
          logisticsCompanyId: transChooseDic.companyId,
          logisticsCompanyName: transChooseDic.company.name,
          logisticsContactPerson: transChooseDic,
          logisticsContact: transChooseDic.name,
          logisticsPhone: transChooseDic.phoneNum,
          logisticsDriverId: transChooseDic.id,
          logisticsCarriage: this.workoutDic.logisticsCarriage,
          transportMachine: [],
          transportDriver: [],
        };
      }
      // 自运物流
      else {
        this.workoutDic = {
          ...this.workoutDic,
          logisticsCompanyId: transChooseDic.companyId,
          logisticsCompanyName: transChooseDic.company.name,
          logisticsContactPerson: transChooseDic,
          logisticsContact: transChooseDic.name,
          logisticsPhone: transChooseDic.phoneNum,
          logisticsDriverId: transChooseDic.id,
          logisticsCarriage: this.workoutDic.logisticsCarriage,
          transportMachine: [],
          transportDriver: [],
        };
      }
    });

    uni.$on("logisticsRemark", (obj) => {
      this.workoutDic = {
        ...this.workoutDic,
        logisticsRemark: obj.dict.logisticsRemark,
      };
    });

    // dispatch
    // 调度退场车辆型号
    uni.$on("choosedMachines", (obj) => {
      // 获取当前项目（通过 curItem 索引）已有的机器列表
      let oldList = this.getCurMachineList(this.curItem);

      // 根据新选中的机器数据构建更新后的机器列表
      let newArr = obj.data.map((o) => ({
        ...o,
        // 如果新选中的机器已存在于当前项目中，则保留原有的工作检查结果；否则，使用默认检查列表
        workCheckResults: oldList.some((y) => y.licenseId === o.licenseId)
          ? oldList.find((x) => x.licenseId === o.licenseId).workCheckResults
          : [...this.checkList],
      }));

      // 更新订单的 selectedNum 属性，即每个订单的选中机器数量
      this.workoutDic.orders.forEach((order) => {
        // 计算属于该订单的新选中机器数量，并累加到订单的 selectedNum 上
        const count = obj.data.filter((dataItem) => dataItem.orderId === order.id).length;
        order.selectedNum = (order.selectedNum || 0) + count;
      });

      // 确保 workoutDic.machines 已经初始化
      if (!this.workoutDic.machines) {
        this.workoutDic.machines = [];
      }

      // 如果是新增状态，先移除当前订单下的所有机器
      if (!this.isUpdate && !this.isApproval) {
        this.workoutDic.machines = this.workoutDic.machines.filter(
          (o) => o.contractOrderId !== this.workoutDic.orders[this.curItem].id
        );
      }
      // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
      // 获取当前订单下的机器列表，以便后续判断是否重复
      const currentOrderMachines = this.workoutDic.machines.filter(
        (o) => o.contractOrderId === this.workoutDic.orders[this.curItem].id
      );

      // 对于新选择的机器，只有当它不在当前订单的机器列表中时，才添加到 workoutDic.machines 中
      newArr.forEach((newMachine) => {
        if (
          !currentOrderMachines.some(
            (machine) => machine.licenseId === newMachine.licenseId
          )
        ) {
          this.workoutDic.machines.push(newMachine);
        }
      });
      console.log("this.workoutDic------------------", this.workoutDic);
      this.workoutDic = Object.assign({}, this.workoutDic);
      // 更新 machineTypeIdList 以便查询每台机器的附件数量
      this.machineTypeIdList = newArr.map((o) => o.machineTypeId);
    });

    uni.$on("choosedDriver", (obj) => {
      console.log("choosedDriver", obj.data);
      this.workoutDic = {
        ...this.workoutDic,
        logisticsCompanyId: "",
        logisticsCompanyName: "",
        logisticsContactPerson: obj.data,
        logisticsContact: obj.data.name,
        logisticsPhone: obj.data.phoneNum,
        logisticsDriverId: obj.data.id,
      };
      // this.workoutDic = {
      //   ...this.workoutDic,
      //   transportDriver: obj.data ? [...obj.data] : [],
      // };
    });

    uni.$on("choosedlogisticsVehicle", (obj) => {
      this.workoutDic = {
        ...this.workoutDic,
        transportMachine: obj.data ? [...obj.data] : [],
      };
    });

    //退场点检
    uni.$on("choose-check-emit", (obj) => {
      if (this.workoutDic.machines) {
        let index = this.workoutDic.machines.findIndex((o) => {
          return o.licenseId == obj.data.licenseId;
        });
        console.log(index);
        let alllist = [...this.workoutDic.machines];
        if (index != -1) {
          alllist.splice(index, 1, obj.data);
        } else {
          alllist = alllist.concat(obj.data);
        }
        // let machines = this.workoutDic.machines.filter(o => {
        // 	return o.machineId != obj.data.machineId;
        // });
        // console.log('machines' + JSON.stringify(machines));
        // this.workoutDic.machines = machines && machines.length>0 ? [...machines,obj.data]:[obj.data];
        this.workoutDic = {
          ...this.workoutDic,
          machines: alllist,
        };
      }
    });

    //入库点检
    uni.$on("choose-check-store-emit", (obj) => {
      console.log("check-store" + JSON.stringify(obj.list));

      let ms = obj.list.map((item) => {
        return {
          ...item,
        };
      });
      if (this.workoutDic.machines) {
        this.workoutDic.machines = this.workoutDic.machines.filter((o) => {
          return o.contractOrderId !== this.workoutDic.orders[this.curItem].id;
        });
        // this.workoutDic = {
        // 	...this.workoutDic,
        // 	machines: [...this.workoutDic.machines, ...ms]
        // };

        this.workoutDic["machines"] = [...this.workoutDic.machines, ...ms];
        this.workoutDic = {
          ...this.workoutDic,
          machines: this.workoutDic["machines"],
        };
      }
    });

    /* 关联交接机单 */
    uni.$on("choose-correlation", (list) => {
      let dict = {
        ...this.workoutDic,
        deliverIds: list.map((o) => o.id).join(","),
      };
      this.mBills = [...list];
      let orders = [];
      if (dict.orders && dict.orders.length > 0) {
        orders = [...dict.orders];
      }
      console.log(orders);
      this.notBillMs = [];
      list.forEach((z) => {
        let machines = z.dispatchMachines ? z.dispatchMachines : [];
        if (z.fileList && z.fileList.length > 0) {
          z.fileList.forEach((f) => {
            let fileList = dict.fileList ? dict.fileList : [];
            if (!fileList.some((y) => f.id == y.id)) {
              dict = {
                ...dict,
                fileList: [
                  ...fileList,
                  {
                    id: undefined,
                    name: f.name || null,
                    type: f.type || "workout_type",
                    uploadType: "attachment",
                    uploadTypeName: null,
                    fileDesc: "进场类型附件",
                    businessId: f.businessId,
                    url: f.url,
                    bucket: "nvr-temp",
                    filePath: f.filePath,
                  },
                ],
              };
            }
          });
        }
        /* 交机单内的所有设备 */
        machines.forEach((o) => {
          /*  1.判断当前设备型号是否否符合订单需求*/
          if (orders.some((y) => y.type == o.type && y.height == o.machineHeight)) {
            /* 2.判断当前设备有无在订单设备列表中*/
            let index = orders.findIndex(
              (y) => y.type == o.type && y.height == o.machineHeight
            );
            let ordersDic = orders[index] ? orders[index] : {};
            let usedNum = ordersDic.usedNum ? ordersDic.usedNum : 0;
            if (parseInt(usedNum) > 0) {
              let machineList = dict && dict.machines ? dict.machines : [];
              if (!machineList.some((x) => x.licenseId == o.licenseId)) {
                /* 判断退场设备有无在合同进场中 */
                if (orders.some((y) => y.id == o.contractOrderId)) {
                  if (!dict.machines || dict.machines.length <= 0) {
                    dict = {
                      ...dict,
                      machines: [o],
                    };
                  } else {
                    dict = {
                      ...dict,
                      machines: [...this.workoutDic.machines, o],
                    };
                  }
                } else {
                  console.log("当前设备型号不符合订单需求");
                  if (!this.notBillMs.some((z) => z.licenseId == o.licenseId)) {
                    this.notBillMs = [...this.notBillMs, o];
                  }
                }
              }
            } else {
              this.notBillMs = [...this.notBillMs, o];
            }
          } else {
            this.notBillMs = [...this.notBillMs, o];
          }
        });
      });
      if (this.notBillMs.length > 0) {
        uni.showModal({
          title: "提示",
          content: "已选接机单中有不符合退场的设备，是否查看？",
          confirmText: "确认",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: `/businessPages/service/not-machines?list=${encodeURIComponent(
                  JSON.stringify(this.notBillMs)
                )}`,
              });
            }
          },
        });
      }
      this.workoutDic = {
        ...dict,
      };
    });
  },
  destroyed() {
    uni.$off("choose-contract-emit");
    uni.$off("choose-address");
    uni.$off("choose-trans-emit");
    uni.$off("logisticsRemark");
    uni.$off("choosedMachines");
    uni.$off("choosedDriver");
    uni.$off("choosedlogisticsVehicle");
    uni.$off("choose-check-emit");
    uni.$off("choose-check-store-emit");
    uni.$off("choose-correlation");
  },

  methods: {
    getDate,
    handleCallPhone,

    initTimeline() {
      if (this.$refs.timeline) this.$refs.timeline.init();
    },
    // 根据machineId获取附件数量
    getMachineFileNum(val) {
      let param = {
        machineTypeList: val,
        scene: "1",
      };
      this.$network
        .getData(
          this.$url.GET_MACHINE_TYPE_SCENE_RULE_BY_MACHINETYPE +
            "?timestamp=" +
            new Date().getTime(),
          "POST",
          param
        )
        .then((res) => {
          console.log(res, "GET_MACHINE_TYPE_SCENE_RULE_BY_MACHINETYPE");
          this.dealMachineFileNum(res || {});
        });
    },
    // dealMachineFileNum(res) {
    //   //res key machineTypeId
    //   let isShowMachineFineColumns = false;
    //   for (let key in res) {
    //     isShowMachineFineColumns = true;
    //     console.log(key, "dealMachineFileNum");
    //     console.log(res[key], "res[key]");
    //     for (let i = 0; i < this.workoutDic.machines.length; i++) {
    //       if (key == this.workoutDic.machines[i].machineTypeId) {
    //         this.workoutDic.machines.splice(i, 1, {
    //           ...this.workoutDic.machines[i],
    //           fileList: res[key].fileOptionList,
    //         });
    //       }
    //     }
    //   }
    //   this.workoutDic = {
    //     ...this.workoutDic,
    //     isShowMachineFineColumns,
    //   };
    // },
    dealMachineFileNum(res) {
      let isShowMachineFineColumns = false;
      for (let key in res) {
        isShowMachineFineColumns = true;
        console.log(key, "dealMachineFileNum");
        console.log(res[key], "res[key]");
        for (let i = 0; i < this.workoutDic.machines.length; i++) {
          if (key == this.workoutDic.machines[i].machineTypeId) {
            // 使用Set来保持已有的fileDesc唯一性
            const existingFileDescs = new Set(
              (this.workoutDic.machines[i].fileList || []).map((file) => file.fileDesc)
            );
            const newFiles = res[key].fileOptionList
              .filter((file) => !existingFileDescs.has(file.fileName))
              .map((file) => ({
                ...file,
                fileDesc: file.fileName, // 重命名fileName到fileDesc
                fileName: undefined, // 可以选择移除原来的fileName字段
              }));

            // 只添加不存在的文件
            this.workoutDic.machines[i] = {
              ...this.workoutDic.machines[i],
              fileList: this.workoutDic.machines[i].fileList
                ? [...this.workoutDic.machines[i].fileList, ...newFiles]
                : [...newFiles],
            };
          }
        }
      }
      this.workoutDic = {
        ...this.workoutDic,
        isShowMachineFineColumns,
      };
    },
    //apply
    //物流类型
    loadTrans() {
      uni.showLoading();
      this.$network
        .loadUserType("logistics_type")
        .then((result) => {
          this.transArr = result ? [...result] : [];
          if (result.length > 0 && !this.workoutDic.logisticsType) {
            this.workoutDic = {
              ...this.workoutDic,
              logisticsType: result[1].value,
              logisticsTypeName: result[1].label,
            };
            // 秋果说,只有当物流类型是第三方物流时,默认给物流公司
            // if (this.workoutDic.logisticsType == "2"&&) {
            //   this.setDefaultLogisticsCompany();
            // } else {
            this.workoutDic = {
              ...this.workoutDic,
              logisticsPhone: null,
              logisticsContact: null,
              logisticsCarriage: "0",
              logisticsDriverId: null,
              logisticsCompanyName: null,
              logisticsCompanyId: null,
              transportMachine: [],
              transportDriver: [],
              // };
            };
            console.log("this.workoutDic loadTrans", this.workoutDic.logisticsContact);
            // this.setDefaultLogisticsCompany();
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 涉及扫码功能，暂时没有任何用
    setScanMachines(val, bool) {
      this.workoutDic = {
        ...this.workoutDic,
        machines: val,
      };
      if (!bool) {
        uni.$emit("complete-add");
      }
    },
    //删除当前选中的车辆
    deleteDevice(val, index) {
      let orders = this.workoutDic.orders.map((item, oIndex) => {
        console.log(item, "deleteDevice111");
        if (item.id == val.orderId) {
          return {
            ...item,
            selectedNum: item.selectedNum - 1,
          };
        } else {
          return {
            ...item,
          };
        }
      });
      this.workoutDic.orders = orders;
      let machines = this.workoutDic.machines.filter((o) => o.licenseId != val.licenseId);
      this.workoutDic = {
        ...this.workoutDic,
        machines: machines ? machines : [],
      };
    },
    // TODO-WORKOUT:初始化数据方法,移到父组件
    setContractData(contractObj) {
      if (contractObj.customerType != "1") {
        //个人
        this.workoutDic = {
          ...this.workoutDic,
          contactName: contractObj.contractDetailDto.contactName || "",
          phoneNum: contractObj.contractDetailDto.phoneNum || "",
        };
      } else {
        if (this.workoutDic.customerId != contractObj.customerId) {
          this.workoutDic = {
            ...this.workoutDic,
            contactName: "",
            phoneNum: "",
          };
        }
      }
      this.workoutDic = {
        ...this.workoutDic,
        outType: 1, //此处可能会有问题
        contractDetailId: contractObj.contractDetailDto.id || "",
        contractNo: contractObj.businessNo || "",
        customerId: contractObj.customerId || "",
        customerName: contractObj.customerName || "",
        deliveryPlace: contractObj.contractDetailDto.deliveryPlace || "",
        orgName: contractObj.orgName,
        orgId: contractObj.orgId,
        customerSalesman: contractObj.contractDetailDto.customerSalesman,
        customerSalesmanName: contractObj.contractDetailDto.customerSalesmanName,
        customerSalesmanPhone:
          contractObj.customerSalesmanPhoneNum || contractObj.contractDetailDto.phoneNum,
        projectName: contractObj.contractDetailDto.projectName,
        deliveryPhone: contractObj.contractDetailDto.phoneNum || "",
        deliveryContact: contractObj.contractDetailDto.contactName || "",
        contractDetailDto: {
          ...contractObj.contractDetailDto,
        },
      };

      this.addrObj = {
        address: contractObj.contractDetailDto.deliveryPlace
          ? contractObj.contractDetailDto.deliveryPlace
          : "",
        latitude: contractObj.contractDetailDto.latitude
          ? contractObj.contractDetailDto.latitude
          : "",
        longitude: contractObj.contractDetailDto.longitude
          ? contractObj.contractDetailDto.longitude
          : "",
        currentRadius: contractObj.contractDetailDto.radius
          ? contractObj.contractDetailDto.radius
          : "",
      };
      this.getWorkOutOrderList();
      if (this.isEditModel("assignee")) {
        this.getUserLeaders();
      }
      if (this.isEditModel("deliver")) {
        this.loadOutTypes();
        this.getCheckList();
      }
    },

    // 外部调用组件设置数据方法
    setWorkDic(val) {
      this.workoutDic = {
        ...this.workoutDic,
        ...val,
      };
    },

    setContactVal(val) {
      this.workoutDic = {
        ...this.workoutDic,
        contactId: val.id,
        contactName: val.name || "",
        phoneNum: val.phoneNum || "",
      };
    },
    setMileage(val) {
      this.workoutDic = {
        ...this.workoutDic,
        mileage: val.data.mileage,
      };
    },
    //根据合同获取当前未退场的设备
    getWorkOutOrderList() {
      uni.showLoading();
      let param = {
        contractDetailId: this.workoutDic.contractDetailId || "",
        contractNo: this.workoutDic.contractNo || "",
      };
      let url = this.$url.WORK_OUT_ORDER_LEFT;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          uni.hideLoading();
          this.workoutDic = {
            ...this.workoutDic,
            orders: [...result],
          };
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //设备配置
    getNumValue(val) {
      if (!this.workoutDic.orders[val.index].usedNum) {
        this.workoutDic.orders[val.index].usedNum = 0;
      }
      this.workoutDic.orders[val.index].usedNum = val.usedNum;
      this.workoutDic = {
        ...this.workoutDic,
        orders: [...this.workoutDic.orders],
      };
    },
    setdeliveryPlace(val) {
      this.workoutDic = {
        ...this.workoutDic,
        deliveryPlace: val,
      };
    },
    setEndPlace(val) {
      this.workoutDic = {
        ...this.workoutDic,
        endPlace: val,
      };
    },
    //备注
    setComment(val) {
      this.workoutDic = {
        ...this.workoutDic,
        comment: val,
      };
    },
    //Logistics
    setLogistics(val) {
      switch (val.prop) {
        case "logisticsCarriage":
          this.workoutDic = {
            ...this.workoutDic,
            logisticsCarriage: val.value,
          };
          break;
        case "logisticsCompanyName":
          this.workoutDic = {
            ...this.workoutDic,
            logisticsCompanyName: val.value,
          };
          break;
        case "logisticsContact":
          this.workoutDic = {
            ...this.workoutDic,
            logisticsContact: val.value,
          };
          break;

        case "logisticsPhone":
          this.workoutDic = {
            ...this.workoutDic,
            logisticsPhone: val.value,
          };
          break;
        case "deliveryContact":
          this.workoutDic = {
            ...this.workoutDic,
            deliveryContact: val.value,
          };
          break;
        case "deliveryPhone":
          this.workoutDic = {
            ...this.workoutDic,
            deliveryPhone: val.value,
          };
          break;
        case "logisticsRemark":
          this.workoutDic = {
            ...this.workoutDic,
            logisticsRemark: val.value,
          };
          break;
      }
    },
    //
    /**
     * 可选择的审批人列表
     */
    getUserLeaders() {
      let param = {
        orgId: this.workoutDic.orgId ? this.workoutDic.orgId : "",
        roleType: this.$savekey.USER_ROLE_SEVICER,
        showAdmin: false,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          if (result && result.length > 0) {
            this.staffList = result.map((o) => {
              return {
                value: o.id,
                label: o.username,
              };
            });
            if (!this.workoutDic.deliveryUser) {
              let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
              if (
                resData &&
                this.$gxfmethod.issameRoleType(resData, this.$savekey.USER_ROLE_SEVICER)
              ) {
                this.workoutDic = {
                  ...this.workoutDic,
                  deliveryUser: resData.id,
                  deliveryUserName: resData.username,
                };
              } else {
                this.workoutDic = {
                  ...this.workoutDic,
                  deliveryUser: this.staffList[0].value,
                  deliveryUserName: this.staffList[0].label,
                };
              }
            }
          }
        })
        .catch((err) => {});
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getCurMachineList(pos) {
      if (this.workoutDic.machines) {
        return this.workoutDic.machines.filter((o) => {
          return o.contractOrderId === this.workoutDic.orders[Number(pos)].id;
        });
      } else {
        return [];
      }
    },
    //deliver
    //退场方式
    loadOutTypes() {
      console.log("itemData");
      this.$network
        .loadType("work_out_type")
        .then((result) => {
          this.outTypes = result;
        })
        .catch((err) => {});
    },
    updateFile(val) {
      this.workoutDic = {
        ...this.workoutDic,
        fileList: val,
      };
    },

    getCheckList() {
      let param = {
        type: "work",
      };
      this.$network
        .getData(this.$url.GET_CHECK_LISWT, "GET", param)
        .then((result) => {
          this.checkList = result
            ? result.map((o) => {
                return {
                  id: o.id,
                  content: o.content,
                  checked: true,
                  remark: "",
                };
              })
            : [];
          if (this.workoutDic.machines && this.workoutDic.machines.length > 0) {
            let machines = this.workoutDic.machines.map((o) => {
              return {
                ...o,
                workCheckResults:
                  (!o.workCheckResults || o.workCheckResults.length <= 0) &&
                  this.isEditModel("deliver")
                    ? [...this.checkList]
                    : o.workCheckResults,
              };
            });
            this.workoutDic = {
              ...this.workoutDic,
              machines: machines,
            };
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    goTo(val) {
      console.log(val, "setDefaultLogisticsCompany");
      let type = val.type;
      this.curItem = val.index ? val.index : 0;
      switch (type) {
        case "contract":
          if (this.isEditModel("apply")) {
            uni.navigateTo({
              url: "./workout-choose-contract?contractType=1,2",
            });
          } else {
            uni.navigateTo({
              url:
                "/contractPages/contract/contract-detail?businessNo=" +
                this.workoutDic.contractNo,
            });
            return;
          }

          break;
        case "deliveryPlace":
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(this.addrObj) +
              "&showfence=false" +
              "&type=deliveryPlace",
          });
          break;
        case "endPlace":
          uni.navigateTo({
            url:
              "/otherPages/map/nvr-map?deliveryAddress=" +
              JSON.stringify(this.addrObj) +
              "&showfence=false" +
              "&type=endPlace",
          });
          break;
        case "logisticsCompany":
          uni.navigateTo({
            url: "/businessPages/workin/trans-company",
          });
          break;
        case "logisticsContact":
          uni.navigateTo({
            url: "/businessPages/workin/trans-driver",
          });
          break;
        case "check":
          uni.navigateTo({
            url:
              "./workout-check-list?machine=" +
              encodeURIComponent(JSON.stringify(val.item)) +
              "&iscleck=" +
              this.isEditModel("deliver"),
          });
          break;
        case "storeCheck":
          uni.navigateTo({
            url:
              "./check-store-car-list?machineList=" +
              encodeURIComponent(JSON.stringify(this.getCurMachineList(val.index))) +
              "&iscleck=" +
              this.isEditModel("deliver"),
          });
          break;
        case "dispatch":
          uni.navigateTo({
            url:
              "./workout-car-choose?choosedList=" +
              encodeURIComponent(JSON.stringify(this.getCurMachineList(val.index))) +
              "&contractNo=" +
              this.workoutDic.contractNo +
              "&orderId=" +
              val.item.id +
              "&settleTime=" +
              (this.isEditModel("deliver")
                ? this.getDate(this.workoutDic.settleDate)
                : this.getDate(this.workoutDic.preSettleDate)) +
              "&height=" +
              val.item.height +
              "&businessNo=" +
              this.businessNo,
          });
          break;
        case "detail":
          uni.navigateTo({
            url:
              "./workout-machine-detail?machineList=" +
              encodeURIComponent(JSON.stringify(this.getCurMachineList(val.index))) +
              "&height=" +
              val.item.height,
          });
          break;
        case "transportMachine":
          uni.navigateTo({
            url:
              "/otherPages/logistics/choose-logistics-vehicle?isEdit=" +
              (this.isEditModel("logistics") || this.isEditModel("dispatch")) +
              "&choosedList=" +
              encodeURIComponent(
                JSON.stringify(
                  this.workoutDic.transportMachine ? this.workoutDic.transportMachine : []
                )
              ),
          });
          break;
        case "transportDriver":
          uni.navigateTo({
            url: "/otherPages/logistics/choose-logistics-driver-contract?isEdit=true",
          });
          break;
        case "correlationDelivery":
          let selects = [];
          if (this.workoutDic.deliverIds) selects = this.workoutDic.deliverIds.split(",");

          uni.navigateTo({
            url: `/businessPages/service/receive-machine?type=select&selects=${encodeURIComponent(
              JSON.stringify(selects)
            )}&bills=${encodeURIComponent(JSON.stringify(this.mBills))}&contractNo=${
              this.workoutDic.contractNo
            }`,
          });
          break;
        default:
          break;
      }
    },
    showPick(val) {
      // val:{
      // 	pickType: this.pickType,
      // 	selectType: selectType
      // }
      this.pickType = val.pickType;
      switch (val.selectType) {
        case "date":
        case "dateTime":
        case "halfDate":
          this.datetype = val.selectType;
          this.$refs.date.show();
          break;
        case "selector":
          switch (this.pickType) {
            case "logistics":
              this.selectList = this.transArr ? this.transArr.slice().reverse() : [];
              break;
            case "staff":
              this.selectList = this.staffList ? this.staffList : [];
              break;
            case "outType":
              this.selectList = this.outTypes ? this.outTypes : [];
              break;
          }

          this.$refs.selector.show();
          break;
      }
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "preEndDate":
          this.workoutDic = {
            ...this.workoutDic,
            preEndDate: val.result + ":00",
          };
          break;
        case "preSettleDate":
          this.workoutDic = {
            ...this.workoutDic,
            preSettleDate: val.result + " 23:59:59",
          };
          break;
        case "logistics":
          if (val.checkArr.value != this.workoutDic.logisticsType) {
            this.workoutDic = {
              ...this.workoutDic,
              logisticsPhone: null,
              logisticsContact: null,
              logisticsDriverId: null,
              logisticsCarriage: "0",
              logisticsCompanyName: null,
              logisticsCompanyId: null,
              transportMachine: [],
              transportDriver: [],
            };
          }
          this.workoutDic = {
            ...this.workoutDic,
            logisticsType: val.checkArr.value,
            logisticsTypeName: val.checkArr.label,
          };
          // 秋果说,只有当物流类型是第三方物流时,默认给物流公司

          if (this.workoutDic.logisticsType == "2") {
            this.setDefaultLogisticsCompany();
          } else {
            this.workoutDic = {
              ...this.workoutDic,
              logisticsPhone: null,
              logisticsContact: null,
              logisticsCarriage: "0",
              logisticsDriverId: null,
              logisticsCompanyName: null,
              logisticsCompanyId: null,
              transportMachine: [],
              transportDriver: [],
            };
          }
          console.log("this.workoutDic loadTrans", this.workoutDic.logisticsContact);
          break;
        case "staff":
          this.workoutDic = {
            ...this.workoutDic,
            deliveryUser: val.checkArr.value,
            deliveryUserName: val.checkArr.label,
          };
          break;
        case "endDate":
          this.workoutDic = {
            ...this.workoutDic,
            endDate: val.result + ":00",
          };
          break;
        case "settleDate":
          this.workoutDic = {
            ...this.workoutDic,
            settleDate: val.result,
          };
          break;
        case "inStoreDate":
          this.workoutDic = {
            ...this.workoutDic,
            inStoreDate: val.result,
          };
          break;
        case "outType":
          this.workoutDic = {
            ...this.workoutDic,
            outType: val.checkArr.value,
            outTypeName: val.checkArr.label,
          };
          break;

        default:
          break;
      }
    },
    setDefaultLogisticsCompany() {
      let param = {
        current: "1",
        size: 2,
        businessKey: "",
      };
      this.$network
        .getData(this.$url.CONTRACT_LOGISTICS_COMPANY_LIST, "POST", param)
        .then((result) => {
          if (
            result &&
            result.records &&
            result.records.length > 0 &&
            !this.workoutDic.logisticsCompanyId
          ) {
            let obj = result.records[0];
            let transDriver = null;
            if (obj.logisticsDrivers && obj.logisticsDrivers.length > 0)
              transDriver = obj.logisticsDrivers[0];
            else {
              transDriver = {
                id: "",
                phoneNum: "",
                name: "",
              };
            }
            console.log("company", obj, "transDriver", transDriver);
            this.workoutDic = {
              ...this.workoutDic,
              logisticsCompanyId: obj.id,
              logisticsCompanyName: obj.name,
              logisticsDriverId: transDriver.id,
              logisticsContact: transDriver.name,
              logisticsPhone: transDriver.phoneNum,
            };
          }
          console.log(
            "this.workoutDic setDefaultLogisticsCompany",
            this.workoutDic.logisticsContact
          );
        })
        .catch((err) => {});
    },
    isShowModel(model) {
      let isShow = false; //是否显示model
      //!this.nodeList.every(o=>{return (!o.formKey || o.formKey == null)快捷退场显示所有流程
      if (
        this.nodeList.length > 0 &&
        !this.nodeList.every((o) => {
          return !o.formKey || o.formKey == null;
        })
      ) {
        //判断当前是是否是第一步
        if (this.isFrist) {
          //第一步是否显示model
          if (this.nodeList[0].formKey.indexOf(model) !== -1) {
            isShow = true;
          }
        } else {
          //
          //遍历所有到目前为止的流程中是否显示model
          for (let i = 0; i < this.nodeList.length; i++) {
            if (
              this.nodeList[i].formKey &&
              this.nodeList[i].formKey.indexOf(model) !== -1
            ) {
              isShow = true;
              return true;
            }
          }
        }
      } else {
        //没有流程时，都显示
        isShow = true;
      }
      return isShow;
    },
    //第一步所含有的model
    isShowRepeat(model) {
      let isShow = false; //是否显示model
      if (this.nodeList.length > 0) {
        if (this.nodeList[0].formKey && this.nodeList[0].formKey.indexOf(model) !== -1) {
          isShow = true;
        }
      } else {
        //没有流程时，都显示
        isShow = true;
      }

      return isShow;
    },
    /**是否可编辑
     * @param {Object} model
     */
    isEditModel(model) {
      let isEdit = false; //是否显示model
      if (this.formKey) {
        if (this.nodeList.length > 0) {
          //判断当前是是否是第一步
          let obj = null;
          if (this.isFrist) {
            obj = this.nodeList[0];
          } else {
            //
            // 判断当前流程在nodeList中是第几步
            obj = this.nodeList.find((o) => {
              return o.formKey === this.formKey;
            });
          }
          //第一步是否显示model
          if (obj && obj.formKey.indexOf(model) !== -1) {
            isEdit = true;
          }
        } else {
          //没有流程时，都显示
          isEdit = true;
        }
      } else {
        //没有流程时，都显示
        isEdit = true;
      }
      return isEdit;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
  @include flex(column);
}

.cancel-btn {
  color: black !important;
}
</style>
