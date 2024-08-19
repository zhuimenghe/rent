<template>
  <view class="bg-view">
    <c-nav-bar flexAlign="center">{{ title }}</c-nav-bar>
    <contractHead :contractDic="workInDic" @callPhone="callPhone"></contractHead>
    <workinapply
      v-if="components.includes('workinapply')"
      :iswf="iswf"
      :isedit="true"
      :isLiangXu="isLiangXu"
      :isShowNum="isShowNum"
      :isHalf="isHalf"
      :isDefaultMachine="isDefaultMachine"
      :isRoleBasedScenario="isRoleBasedScenario"
      :isshowLogistics="!(limitsDict.apply && limitsDict.dispatch)"
      :taskState="taskState"
      :nodeList="nodeList"
      :itemDict="itemDict"
      :chooseModelList="chooseModelList"
      :dataDic="workInDic"
      :showRepeat="isRemoveRepeat"
      :components="renderComponents"
      @clickevent="clickevent"
      @numClick="handleNumClick"
      @setContactVal="setContactVal"
    />

    <workinassign
      :dataDic="workInDic"
      :isedit="limitsDict.assigneeEdit"
      @clickevent="clickevent"
      v-if="components.includes('workinassign')"
    />

    <wokinMachineChoose
      v-if="components.includes('wokinMachineChoose')"
      :isControl="true"
      :isEdit="true"
      :chooseModelList="chooseModelList"
      :machines="workInDic.machines"
      :dataDic="workInDic"
      :dispatchMachines="workInDic.dispatchMachines"
      @clickevent="clickevent"
    >
    </wokinMachineChoose>
    <workinlogistics
      :dataDic="workInDic"
      :isedit="limitsDict.logisticsEdit"
      @clickevent="clickevent"
      v-if="components.includes('workinlogistics') && workInDic.logisticsType != 1"
    />
    <workinlocale
      :dataDic="workInDic"
      :isedit="true"
      @clickevent="clickevent"
      v-if="components.includes('workinlocale')"
      :isHalf="isHalf"
      :isLiangXu="isLiangXu"
    />

    <!-- 底部按钮提交 -->
    <view style="height: 80px; width: 100%"></view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle">
        <text>{{ isApprove ? "退回" : "取消" }}</text>
      </view>
      <view class="bottom-right-view warning" @click="preview">
        <text>预览</text>
      </view>
      <view class="bottom-right-view warning" @click="share">
        <text>分享</text>
      </view>
      <view class="bottom-right-view" @click="clicksave">
        <text>{{ isApprove ? "通过" : "确定" }}</text>
      </view>
    </view>

    <!-- 类型选择 -->
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
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
      @confirm="confirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />

    <!-- 确定弹窗 -->
    <alertPopup
      ref="aletrview"
      :require="true"
      @getAssignList="getAssignList"
      :mask-click="false"
      :orgId="workInDic.orgId"
    />

    <backPopup
      ref="backview"
      @choosNode="choosNode"
      :mask-click="false"
      :itemDataid="itemDict.id"
      :procDefId="itemDict.procDefId"
      urlapi="contractapi"
      :isFilter="true"
    />

    <remarkPopup ref="remarkview" @RemarkSum="remarksum" :mask-click="true" />
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import alertPopup from "@/components/common/uni-popup/alert-pop.vue";
import remarkPopup from "@/components/common/uni-popup/remark-pop.vue";
import backPopup from "@/components/common/uni-popup/back-pop.vue";
import calRent from "@/common/util/cal-rent-money.js";
import workindiffer from "./workin-differ.js";
//-----------------
import workinapply from "./steplist/workin-apply.vue";
import workinlogistics from "./steplist/workin-logistics.vue";
import workinassign from "./steplist/workin-assign.vue";
import workinlocale from "./steplist/workin-locale.vue";
import wokinMachineChoose from "./wokin-machine-choose.vue";
import contractHead from "../components/contract-head";
import sanyPopup from "@/components/common/sany/sany-popup.vue";

import format from "date-fns/format";
export default {
  components: {
    wPicker,
    uniPopup,
    alertPopup,
    backPopup,
    remarkPopup,
    // -------------------
    workinapply, //进场信息
    workinlogistics, //物流信息
    workinassign, //指派人员
    workinlocale, //现场交机
    wokinMachineChoose, //现场交机
    contractHead,
    sanyPopup,
  },
  data() {
    return {
      isApprove: false,
      isUpdate: false,
      iswf: false,
      title: "新建进场单",
      operateType: "add",
      components: [],
      firstNode: {},
      workInDic: {
        logisticsCarriage: "0",
        machines: [],
        dispatchMachines: [],
        isShowMachineFineColumns: false,
      },
      assginArr: [],
      selectList: [], //筛选时数据源
      type: "", //点击的类型
      datetype: "date", //时间选择器的类型
      transArr: [], //物流类型列表
      timeIndex: 0, //申请选车修改时间选中的第几项
      canclestr: "取消", //通过流程判断
      okstr: "确定", //通过流程判断
      itemDict: {}, //待办或者其他非新贱进入
      alist: [], //选择指派人员
      limitsDict: {}, //权限
      isRemoveRepeat: true,
      isShowDefault: false, //是否显示合同订单的进退场日期
      isShowNum: false, //是否显示合同约定数量和已进场数量
      isDefaultMachine: false, //是否默认显示所有的合同订单
      isLiangXu: false, //是否默认显示所有的合同订单
      isHalf: true, //是否启用半天租
      isChooseTime: false,
      listData: [],
      wokinMachineChooseIsEdit: true,
      bool: true,
      chooseModelList: [],
      index: 0,
      nodeList: [],
      formKey: "",
      taskState: undefined,
      machineTypeIdList: [],
      isRoleBasedScenario: false,
    };
  },
  computed: {
    renderComponents() {
      const arr = this.components.slice();
      const newArr = [];
      arr.forEach((item) => {
        if (newArr.indexOf(item) === -1) {
          newArr.push(item);
        }
      });
      return newArr;
    },
  },
  watch: {
    "workInDic.preBeginDate": {
      handler(val) {
        this.setFormDataDate();
      },
      immediate: true,
    },
    "workInDic.preEnableDate": {
      handler(val) {
        this.setFormDataDate();
      },
      immediate: true,
    },
    "limitsDict.canclekey": {
      handler(val) {
        if (val == "退回") {
          this.wokinMachineChooseIsEdit = false;
        }
      },
    },
    machineTypeIdList: {
      handler(val) {
        if (val.length > 0) {
          this.getMachineFileNum(val);
        }
      },
    },
  },
  onLoad(option) {
    let vm = this;
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "work_in_out_begin_date");
      if (obj) {
        //是不是默认显示合同中的进场时间
        this.isShowDefault = obj.value === "true" ? true : false;
      }

      let obj1 = resData.find((o) => o.code === "work_in_show_used_num");
      if (obj1) {
        //是否显示合同订单数据量
        this.isShowNum = obj1.value === "true" ? true : false;
      }

      let obj2 = resData.find((o) => o.code === "work_in_auto_machine");
      if (obj2) {
        //是否显示合同订单
        this.isDefaultMachine = obj2.value === "true" ? true : false;
      }
      let obj3 = resData.find((o) => o.code === "tenant_name");
      if (obj3) {
        this.isLiangXu = obj3.value === "liangXu" ? true : false;
      }
      let obj4 = resData.find((o) => o.code === "half_day_rent");
      if (obj4) {
        this.isHalf = obj4.value === "true" ? true : false;
      }
      let obj5 = resData.find((o) => o.code === "work_in_out_fill_date");
      if (obj5) {
        //进、退场单启用时间、结算时间是否自动填充
        this.isChooseTime = obj5.value === "false" ? true : false;
      }
    }
    if (option.contract) {
      let contractDic = JSON.parse(decodeURIComponent(option.contract));
      this.setContractData(contractDic);
      // 重新设置一下物流相关信息
      this.loadLogisticsCompany({
        value: this.workInDic.logisticsType,
        label: this.workInDic.logisticsTypeName,
      });
    }

    this.loadTypeList();
    //单纯获取物流信息
    this.getLogisticsType();
    //回显
    console.log(option, "option");
    if (option.item) {
      this.title = "进场单审批";
      let backType = option.backType;
      this.itemDict = JSON.parse(decodeURIComponent(option.item));
      this.isApprove = this.itemDict.state != 0 && this.itemDict.state != 3;
      this.taskState = this.itemDict.taskState;
      this.getDetailWithNo(this.itemDict.businessNo, backType);
      // 检查是否传递了 workActionMode 参数且为修改界面
      if (option.workActionMode === "edit") {
        // 进入进场单修改界面的逻辑
        this.title = "进场单修改";
        // 添加进场单修改需要的逻辑处理
        this.isApprove = false;
        this.isUpdate = true;
      } else {
        this.title = "进场单审批";
        this.isApprove = this.itemDict.state != 0 && this.itemDict.state != 3;
        this.isUpdate = false;
      }
    } else {
      let contractDic = JSON.parse(decodeURIComponent(option.contract));
      this.getBusinessNo(); //加载单号
      // 重新设置一下物流相关信息
      this.loadLogisticsCompany({
        value: this.workInDic.logisticsType,
        label: this.workInDic.logisticsTypeName,
      });
      if (contractDic.businessKey) {
        this.getcreatelist();
      } else {
        this.limitsDict = {
          apply: true,
          applyEdit: true,
          assignee: true,
          assigneeEdit: true,
          canclekey: "取消",
          deliver: true,
          deliverEdit: true,
          logistics: true,
          logisticsEdit: true,
          savekey: "确定",
        };
        this.loadAssginArr(this.workInDic.orgId);
        // this.getWorkInOrderList();
      }
    }
    //合同
    uni.$on("choose-contract-emit", (usnerinfo) => {
      this.setContractData(usnerinfo.dict);
    });
    //指定设备
    uni.$on("choosed-orders", (res) => {
      console.log(res, "choosed-orders");
      let newList = JSON.parse(JSON.stringify(res.machine));
      let dispatchMachinesNew = JSON.parse(JSON.stringify(res.listData));
      let deletedIds =
        res.deletedIds && res.deletedIds.length
          ? JSON.parse(JSON.stringify(res.deletedIds))
          : []; // 接收后端传来的需要删除的 IDs

      // 初始化 Maps 从 this.workInDic 获取现有数据
      let machinesMap = new Map(
        (this.workInDic.machines || []).map((item) => [item.machineId, item])
      );
      // 分组的设备显示数据
      let dispatchMachinesMap = new Map(
        (this.workInDic.dispatchMachines || []).map((item) => [item.id, item])
      );

      // 更新 machinesMap 数据
      newList.forEach((item) => {
        if (machinesMap.has(item.machineId)) {
          // 如果存在相同的 id，则更新
          const existingItem = machinesMap.get(item.machineId);
          machinesMap.set(item.machineId, { ...existingItem, ...item });
        } else {
          // 否则添加新的条目
          machinesMap.set(item.machineId, item);
        }
      });

      // 使用 deletedIds 删除不再需要的条目
      deletedIds.forEach((id) => {
        machinesMap.delete(id);
      });

      // 更新 dispatchMachinesMap 数据
      dispatchMachinesNew.forEach((newMachine) => {
        newMachine.usedNum = newMachine.machineList.length; // 计算 usedNum
        newMachine.machineList = newMachine.machineList.filter((i) => i.checked); // 过滤未选中的机器

        if (dispatchMachinesMap.has(newMachine.id)) {
          // 如果存在相同的 id，则更新
          const existingMachine = dispatchMachinesMap.get(newMachine.id);
          // 创建一个 ID 集合用于检查重复项
          const existingIds = new Set(
            existingMachine.machineList.map((item) => item.machineId)
          );
          // 添加不重复的新机器到列表中
          newMachine.machineList.forEach((machine) => {
            if (!existingIds.has(machine.machineId)) {
              existingMachine.machineList.push(machine);
            }
          });
          existingMachine.usedNum = existingMachine.machineList.length; // 重新计算 usedNum
        } else {
          // 否则添加新的条目
          dispatchMachinesMap.set(newMachine.id, newMachine);
        }
      });

      // 将 Map 转换回数组形式以供显示和其他操作
      this.workInDic = {
        ...this.workInDic,
        dispatchMachines: Array.from(dispatchMachinesNew.values()),
        machines: Array.from(machinesMap.values()),
      };

      // 获取附件上传规则
      this.machineTypeIdList = [];
      for (let i = 0; i < this.workInDic.machines.length; i++) {
        this.machineTypeIdList.push(this.workInDic.machines[i].machineTypeId);
      }
      console.log(this.workInDic);
    });
    // 选择型号的事件
    uni.$on("choosed-orders-model", (orders) => {
      console.log(orders, "choosed-orders-model");
      //已选的设备型号
      this.chooseModelList = orders.data || [];
      for (let i = 0; i < orders.data.length; i++) {
        orders.data[i].usedNum = orders.data[i].usedNum ? orders.data[i].usedNum : 1;
      }
      this.workInDic.orders = orders.data || [];
    });
    //物流公司选择
    uni.$on("choose-trans-emit", (transinfo) => {
      console.log("choose-trans-emit", transinfo);
      let transChooseDic = transinfo.dict;
      // 第三方物流
      if (
        this.workInDic.logisticsCompanyId &&
        this.workInDic.logisticsCompanyId === transChooseDic.companyId
      ) {
        this.workInDic = {
          ...this.workInDic,
          logisticsCompanyId: transChooseDic.companyId,
          logisticsCompanyName: transChooseDic.company.name,
          logisticsContactPerson: transChooseDic,
          logisticsContact: transChooseDic.name,
          logisticsPhone: transChooseDic.phoneNum,
          logisticsDriverId: transChooseDic.id,
          logisticsCarriage: this.workInDic.logisticsCarriage,
          transportMachine: [],
          transportDriver: [],
        };
      }
      // 自运物流
      else {
        this.workInDic = {
          ...this.workInDic,
          logisticsCompanyId: transChooseDic.companyId,
          logisticsCompanyName: transChooseDic.company.name,
          logisticsContactPerson: transChooseDic,
          logisticsContact: transChooseDic.name,
          logisticsPhone: transChooseDic.phoneNum,
          logisticsDriverId: transChooseDic.id,
          logisticsCarriage: this.workInDic.logisticsCarriage,
          transportMachine: [],
          transportDriver: [],
        };
      }
    });
    uni.$on("choosedDriver", (obj) => {
      console.log("choosedDriver", obj.data);
      this.workInDic = {
        ...this.workInDic,
        logisticsCompanyId: "",
        logisticsCompanyName: "",
        logisticsDriverId: obj.data.id,
        logisticsContactPerson: obj.data,
        logisticsContact: obj.data.name,
        logisticsPhone: obj.data.phoneNum,
      };
    });
    uni.$on("choosedlogisticsVehicle", (obj) => {
      this.workInDic = {
        ...this.workInDic,
        transportMachine: obj.data ? [...obj.data] : [],
      };
    });
    //地址选择页面回调
    uni.$on("choose-address", (obj) => {
      let result = obj.data;
      if (obj.type == "deliveryPlace") {
        this.workInDic = {
          ...this.workInDic,
          latitude: result.latitude,
          longitude: result.longitude,
          deliveryPlace: result.address,
        };
      } else if (obj.type == "startPlace") {
        this.workInDic = {
          ...this.workInDic,
          latitude: result.latitude,
          longitude: result.longitude,
          startPlace: result.address,
        };
      }
    });
    uni.$on("choose-success", (machine) => {
      // console.log(machine,'choose-success');
      for (let i = 0; i < this.workInDic.machines.length; i++) {
        if (
          machine.machineTypeId == this.workInDic.machines[i].machineTypeId &&
          machine.machineId == this.workInDic.machines[i].machineId
        ) {
          this.workInDic.machines.splice(i, 1, {
            ...this.workInDic.machines[i],
            ...machine,
          });
        }
      }
      for (let i = 0; i < this.workInDic.dispatchMachines.length; i++) {
        for (let j = 0; j < this.workInDic.dispatchMachines[i].machineList.length; j++) {
          if (
            machine.machineTypeId ==
              this.workInDic.dispatchMachines[i].machineList[j].machineTypeId &&
            machine.machineId ==
              this.workInDic.dispatchMachines[i].machineList[j].machineId
          ) {
            this.workInDic.dispatchMachines[i].machineList.splice(j, 1, {
              ...this.workInDic.dispatchMachines[i].machineList[j],
              ...machine,
            });
          }
        }
      }
    });

    this.getWorkInAndOutFileMust();
    // this.getOriginOrders()
    // 修改场景下,修改页面显示,不分角色
    this.workflowcommon.iswf("workIn").then((iswf) => {
      console.log(iswf, "workflowcommon");
      if (iswf) {
        if (option.isUpdate && option.isUpdate == "1") {
          this.components = [
            "workinapply",
            "workinlogistics",
            "workinassign",
            "workinlocale",
            "wokinMachineChoose",
            "workinlocale",
          ];
        } else {
          this.components = [];
        }
        //有审批流
        this.getProcessNode(this.components);
        this.iswf = true;
      } else {
        this.components = [
          "workinapply",
          "workinlogistics",
          "workinassign",
          "workinlocale",
          "wokinMachineChoose",
          "workinlocale",
        ];
        this.firstNode = {
          formKey: "apply|dispatch|assignee|deliver",
        };
      }
    });
    // 选择附件
    uni.$on("machine-choose-filelist-done", (machine, index) => {
      console.log(machine, index, "machine-choose-filelist-done");
      this.workInDic.machines && this.workInDic.machines.length > 0
        ? this.workInDic.machines.splice(index, 1, {
            ...machine,
            fileList: machine.fileList,
          })
        : null;
    });
  },
  onUnload() {
    uni.$off("choose-contract-emit");
    uni.$off("choosed-orders");
    uni.$off("choosed-orders-model");
    uni.$off("choose-trans-emit");
    uni.$off("choose-workincar-emit");
    uni.$off("choose-check-emit");
    uni.$off("choose-address");
    uni.$off("choose-success");
    uni.$off("machine-choose-filelist-done");
  },
  methods: {
    // 根据machineTypeId获取附件数量
    getMachineFileNum(val) {
      let param = {
        machineTypeList: val,
        scene: "0",
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

    dealMachineFileNum(res) {
      let isShowMachineFineColumns = false;
      for (let key in res) {
        isShowMachineFineColumns = true;
        console.log(key, "dealMachineFileNum");

        // 更新 dispatchMachines 中的机器列表
        this.workInDic.dispatchMachines.forEach((dispatch) => {
          dispatch.machineList.forEach((machine, machineIndex) => {
            if (machine.machineTypeId === key) {
              const existingFileDescs = new Set(
                (machine.fileList || []).map((file) => file.fileDesc)
              );
              const newFiles = res[key].fileOptionList
                .filter((file) => !existingFileDescs.has(file.fileName))
                .map((file) => ({
                  ...file,
                  fileDesc: file.fileName, // 重命名fileName到fileDesc
                  fileName: undefined, // 可以选择移除原来的fileName字段
                }));
              // 过滤掉 fileDesc 有值的项
              const filteredFileList = (machine.fileList || []).filter(
                (file) => file.fileDesc
              );

              // 正确更新文件列表，仅添加新文件，并保持machineList为数组
              dispatch.machineList[machineIndex] = {
                ...machine,
                fileList: machine.fileList
                  ? [...filteredFileList, ...newFiles]
                  : [...newFiles],
                type: "workin_machine_type",
              };
            }
          });
        });

        // 更新 machines 列表
        this.workInDic.machines.forEach((machine, index) => {
          if (machine.machineTypeId === key) {
            const existingFileDescs = new Set(
              (machine.fileList || []).map((file) => file.fileDesc)
            );
            const newFiles = res[key].fileOptionList
              .filter((file) => !existingFileDescs.has(file.fileName))
              .map((file) => ({
                ...file,
                fileDesc: file.fileName, // 重命名fileName到fileDesc
                fileName: undefined, // 可以选择移除原来的fileName字段
              }));
            // 更新文件列表，仅添加新文件
            this.workInDic.machines[index] = {
              ...machine,
              fileList: machine.fileList
                ? [...machine.fileList, ...newFiles]
                : [...newFiles],
              type: "workin_machine_type",
            };
          }
        });

        // 更新 workInDic 状态
        this.workInDic = {
          ...this.workInDic,
          isShowMachineFineColumns,
        };
      }
    },
    setFormDataDate() {
      if (this.iswf && this.components.length < 4) {
        this.workInDic.beginDate = this.workInDic.beginDate
          ? this.workInDic.beginDate
          : this.workInDic.preBeginDate;
        this.workInDic.enableDate = this.workInDic.enableDate
          ? this.workInDic.enableDate
          : this.workInDic.preEnableDate;
      } else if (!this.iswf && this.components.length >= 4) {
        this.workInDic.beginDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.workInDic.enableDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      }
    },
    getContractInfo(item) {
      let param = {
        businessNo: this.dataDic.contractNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          let orderList = result.contractDetailDto
            ? result.contractDetailDto.orderList
            : [];
          this.resetList(orderList, item);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
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
      if (!createList) {
        if (this.workInDic.businessKey) return false;
        else return true;
      }
      if (createList.find((o) => o === modelName)) {
        return true;
      }
      return false;
    },
    getProcessNode(components) {
      let vm = this;
      vm.components = components || [];
      this.workflowcommon.getApplyProcessNode("workIn").then((result) => {
        console.log(result, "getProcessNode");
        if (result && result.length > 0) {
          this.nodeList = [...result];
          this.formKey = result[0].formKey;
          if (this.formKey) {
            // 检查 formKey 是否存在且非空
            let parts = this.formKey.split("|"); // 使用 '|' 分割 formKey 字符串
            if (parts.length > 0 && parts.length < 4) {
              // 检查分割后的数组长度
              this.isRoleBasedScenario = true; // 符合条件，设置为 true
            }
          }
          this.firstNode = {
            formKey: result[0].formKey,
          };
          if (this.isHaveModel("apply")) {
            this.components = [...this.components, "workinapply"];
          }
          if (this.isHaveModel("logistics")) {
            this.components = [...this.components, "workinlogistics"];
          }
          if (this.isHaveModel("assignee")) {
            this.components = [...this.components, "workinassign"];
          }
          if (this.isHaveModel("deliver")) {
            this.components = [...this.components, "wokinMachineChoose", "workinlocale"];
          }
        }
      });
    },
    handleNumClick(operate, obj) {
      // 更新number
      let list = this.workInDic.orders.filter((item, index) => {
        if (item.id === obj.id) {
          this.index = index;
        }
        return item.id === obj.id;
      });
      // 禁用

      if (operate == "-") {
        list[0].usedNum--;
        if (list[0].usedNum <= 1) {
          list[0].usedNum = 1;
        }
      } else {
        list[0].usedNum++;
      }

      let orders = this.workInDic.orders || [];
      if (list.length > 0) {
        orders[this.index] = list[0] || {};
      }
      this.workInDic = {
        ...this.workInDic,
        orders: orders.map((item) => {
          return {
            ...item,
            checked: item.checked ? item.checked : false,
          };
        }),
      };
      this.chooseModelList = orders;
      console.log(this.workInDic, "this.workInDic");
      this.$forceUpdate();
    },
    // 获取新增合同选的所有订单
    getOriginOrders() {
      console.log(this.workInDic, "getOriginOrders");
      let param = {
        orgId: this.workInDic.orgId || null,
        contractDetailId: this.workInDic.contractDetailId || "",
        contractNo: this.workInDic.contractNo || "",
      };
      this.$network.getData(this.$url.WORKIN_ORDERS, "GET", param).then((res) => {
        console.log(res, "WORKIN_ORDERS");
      });
    },
    //根据合同获取服务人员
    loadAssginArr(orgId) {
      let param = {
        orgId: orgId,
        showAdmin: false,
        roleType: this.$savekey.USER_ROLE_SEVICER,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          let list = result;
          this.assginArr = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
            };
          });
          if (
            this.assginArr.length > 0 &&
            (!this.workInDic.deliveryUser || this.workInDic.deliveryUser == "")
          ) {
            let assginDic = this.assginArr[0];
            this.workInDic = {
              ...this.workInDic,
              deliveryUser: assginDic.value,
              deliveryUserName: assginDic.label,
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //根据合同获取当前未进场的设备
    getWorkInOrderList() {
      uni.showLoading();
      let param = {
        contractDetailId: this.workInDic.contractDetailId,
        contractNo: this.workInDic.contractNo,
      };
      let url = this.$url.WORK_IN_ORDER_LEFT;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          uni.hideLoading();
          let choosetypeArr = result
            ? result.map((o) => {
                return {
                  ...o,
                  machineList: [],
                  beginDate: this.isShowDefault
                    ? o.beginDate
                      ? o.beginDate
                      : null
                    : null,
                  endDate: this.isShowDefault
                    ? o.endDate
                      ? this.changestr(o.endDate) + " 23:59:59"
                      : null
                    : null,
                  tenancy: this.isShowDefault ? (o.tenancy ? o.tenancy : null) : null,
                  usedNum: 1,
                  checked: false,
                };
              })
            : [];
          this.workInDic = {
            ...this.workInDic,
            // orders: choosetypeArr,
          };
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //如果是是退回或者第一次新建,获取流程中的节点来控制状态的显示
    getcreatelist() {
      this.workflowcommon.getApplyProcessNode("workIn").then((result) => {
        this.limitsDict = workindiffer.getLimitWithArr(result, "apply");
        console.log(this.limitsDict, "getcreatelist");
        //可编辑且默认加载订单且不是退回的情况下显示合同订单
        if (
          this.limitsDict.applyEdit &&
          this.isDefaultMachine &&
          this.itemDict.id == null
        ) {
          this.getWorkInOrderList();
        }
        if (this.workInDic.orgId && this.workInDic.orgId != "") {
          this.loadAssginArr(this.workInDic.orgId);
        }
        if (this.limitsDict.deliverEdit && !this.isChooseTime) {
          this.workInDic = {
            ...this.workInDic,
            beginDate: this.workInDic.beginDate
              ? this.workInDic.beginDate
              : this.workInDic.preBeginDate,
            enableDate: this.workInDic.enableDate
              ? this.workInDic.enableDate
              : this.workInDic.preEnableDate,
            outStoreDate: this.workInDic.outStoreDate
              ? this.workInDic.outStoreDate
              : this.workInDic.preBeginDate,
          };
        }
      });
    },
    //如果是在审批中的,获取流程中的节点来控制状态的现实
    getonlinelist(key) {
      this.workflowcommon.getOnlineList(key).then((result) => {
        console.log(result, "getonlinelist");
        let formKey = "";
        if (result.length) {
          for (let i = 0; i < result.length; i++) {
            formKey += result[i].formKey + "|";
          }
        }
        this.firstNode = {
          formKey,
        };
        this.formKey = formKey;
        if (this.isHaveModel("apply")) {
          this.components = [...this.components, "workinapply"];
        }
        if (this.isHaveModel("logistics")) {
          this.components = [...this.components, "workinlogistics"];
        }
        if (this.isHaveModel("assignee")) {
          this.components = [...this.components, "workinassign"];
        }
        if (this.isHaveModel("deliver")) {
          this.components = [...this.components, "wokinMachineChoose", "workinlocale"];
        }
        this.limitsDict = workindiffer.getLimitWithArr(result, "online");

        if (this.limitsDict.assigneeEdit) {
          console.log("第三步选择人");
          this.loadAssginArr(this.workInDic.orgId);
        }
        if (this.limitsDict.deliverEdit && !this.isChooseTime) {
          console.log("第四步修改车辆信息");
          this.workInDic = {
            ...this.workInDic,
            beginDate: this.workInDic.beginDate
              ? this.workInDic.beginDate
              : this.workInDic.preBeginDate,
            enableDate: this.workInDic.enableDate
              ? this.workInDic.enableDate
              : this.workInDic.preEnableDate,
            outStoreDate: this.workInDic.outStoreDate
              ? this.workInDic.outStoreDate
              : this.workInDic.preBeginDate,
          };
        }
      });
    },
    // 获取单号
    getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(
        /contractapi/,
        "contractapi"
      ).replace(/{type}/, "JC");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          let nowDate = this.$gxfmethod.getnowdateSS();
          this.workInDic = {
            ...this.workInDic,
            businessNo: result,
            preBeginDate: this.workInDic.preBeginDate
              ? this.workInDic.preBeginDate
              : nowDate,
            preEnableDate: this.workInDic.preBeginDate
              ? this.workInDic.preBeginDate
              : this.isHalf
              ? nowDate
              : this.changestr(nowDate) + " 00:00:00",
          };
        })
        .catch((err) => {
          this.workInDic = {
            ...this.workInDic,
            businessNo: "",
          };
        });
    },
    //根据businessNo获取详情
    getDetailWithNo(businessNo, backType) {
      uni.showLoading();
      let param = {
        businessNo: businessNo,
      };
      let url = this.$url.WORK_IN_DETAIL;
      let isShowMachineFineColumns = false;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          if (result.machines && result.machines.some((item) => item.fileList)) {
            isShowMachineFineColumns = true;
          }
          this.workInDic = {
            ...result,
            isShowMachineFineColumns,
          };
          console.log(result, "getDetailWithNo");
          // 重新设置一下物流相关信息
          this.loadLogisticsCompany({
            value: this.workInDic.logisticsType,
            label: this.workInDic.logisticsTypeName,
          });
          // 获取附件上传规则
          this.machineTypeIdList = [];
          if (this.workInDic.machines) {
            for (let i = 0; i < this.workInDic.machines.length; i++) {
              this.machineTypeIdList.push(this.workInDic.machines[i].machineTypeId);
            }
          }
          this.chooseModelList = result.orders || [];
          if (backType != "2") {
            this.getonlinelist(result.businessKey);
          } else {
            if (this.isUpdate) {
              this.limitsDict = {
                apply: true,
                applyEdit: true,
                assignee: true,
                assigneeEdit: true,
                canclekey: "取消",
                deliver: true,
                deliverEdit: true,
                logistics: true,
                logisticsEdit: true,
                savekey: "确定",
              };
              this.loadAssginArr(this.workInDic.orgId);
            } else {
              this.getcreatelist();
            }
            this.itemDict = {
              ...this.itemDict,
              taskState: "normal",
            };
          }

          this.dealData(result);
          uni.hideLoading();
        })
        .catch((err) => {
          console.error(err);
          uni.hideLoading();
        });
    },
    //数据处理当machine中带有数据
    dealData(dict) {
      console.log(dict, "dealData");
      let list = [];
      dict.orders.forEach((e) => {
        let newdic = {
          ...e,
          machineList: [],
          checked: e.checked ? e.checked : false,
        };
        list.push(newdic);
      });
      this.workInDic = {
        ...this.workInDic,
        orders: list,
      };
      this.dealDDCarList(this.workInDic);
    },
    // -----
    //数据处理当machine中带有数据
    dealDDCarList(dict) {
      let machines = dict.machines || [];
      if (machines.length > 0) {
        let orders = JSON.parse(JSON.stringify(dict.orders));
        orders.forEach((e) => {
          let id = e.id;
          let list = [];
          machines.forEach((o) => {
            let fileList = o.fileList || [];
            for (let i = 0; i < fileList.length; i++) {
              if (
                fileList[i].fileDesc &&
                typeof fileList[i].fileDesc === "string" &&
                fileList[i].fileDesc.indexOf("|") != -1
              ) {
                let arr = fileList[i].fileDesc.split("|");
                fileList.splice(i, 1, {
                  ...fileList[i],
                  fileDesc: arr[0],
                  required: JSON.parse(arr[arr.length - 1]),
                });
              }
            }
            let contractOrderId = o.contractOrderId;
            if (contractOrderId === id) {
              let dictR = {
                machineId: o.machineId || "",
                machineTypeId: o.machineTypeId || "",
                licenseId: o.licenseId || "",
                machineBrand: o.machineBrand || "",
                machineType: o.machineType || "",
                machineTypeName: o.machineTypeName || "",
                printCode: o.printCode || "",
                machineHeight: o.machineHeight || "",
                workCheckResults: o.workCheckResults || [],
                orgName: o.orgName || "",
                orgId: o.orgId || "",
                address: o.address || "",
                machineHeightName: o.machineHeightName || "",
                typeName: o.typeName || "",
                contractOrderId: o.contractOrderId || "",
                checked: true,
                fileList: fileList,
              };
              list.push(dictR);
            }
          });
          e.machineList = [...list];
          e.usedNum = e.machineList.length;
        });
        this.$set(this.workInDic, "dispatchMachines", orders);
        this.$forceUpdate();
      }
    },
    //点击事件回传
    clickevent(val) {
      console.log("usetrans", val);
      switch (val.type) {
        case "planstart":
          this.type = "planstart";
          this.datetype = "halfDate";
          this.$refs.date.show();
          break;
        case "planenable":
          this.type = "planenable";
          // this.datetype = 'date';
          //半天租
          this.datetype = this.isHalf ? "halfDate" : "date";
          this.$refs.date.show();
          break;
        case "usetrans":
          this.type = "usetrans";
          this.selectList = this.transArr.slice().reverse() || [];
          this.$refs.selector.show();
          break;
        case "switch":
          this.workInDic = {
            ...this.workInDic,
            training: !this.workInDic.training,
          };
          break;
        case "carbegin":
          this.type = "carbegin";
          this.timeIndex = val.index;
          this.datetype = "date";
          this.$refs.date.show();
          break;
        case "carend":
          this.type = "carend";
          this.timeIndex = val.index;
          this.datetype = "date";
          this.$refs.date.show();
          break;
        case "value":
          let dic = val.data;
          this.workInDic = {
            ...dic,
          };
          break;
        case "assign":
          this.type = "assign";
          this.selectList = this.assginArr || [];
          this.$refs.selector.show();
          break;
        case "storedate":
          this.type = "storedate";
          this.datetype = "halfDate";
          this.$refs.date.show();
          break;
        case "start":
          this.type = "start";
          this.datetype = "halfDate";
          this.$refs.date.show();
          break;
        case "enable":
          this.type = "enable";
          // this.datetype = 'date';
          //半天租
          this.datetype = this.isHalf ? "halfDate" : "date";
          this.$refs.date.show();
          break;
        case "preEnableDate":
          this.type = "preEnableDate";
          this.datetype = this.isHalf ? "halfDate" : "date";
          this.$refs.date.show();
          break;
        case "preBeginDate":
          this.datetype = "halfDate";
          this.$refs.date.show();
          this.type = "preBeginDate";
          break;
        case "scanMachines": //处理扫描后的数据
          this.workInDic = {
            ...val.data,
          };
          uni.$emit("complete-add");
          break;
        default:
          break;
      }
    },
    //选择合同处理数据
    setContractData(dict) {
      console.log(dict, "setContractData");
      if (dict.customerType != "1") {
        //个人
        console.log("个人--------------------");
        this.workInDic = {
          ...this.workInDic,
          contactId: dict.customerId || "",
          contactName: dict.contractDetailDto.contactName || "",
          phoneNum: dict.contractDetailDto.phoneNum || "",
        };
      } else {
        //企业-选完合同后置空
        console.log("企业--------------------");
        if (this.workInDic.customerId != dict.customerId) {
          this.workInDic = {
            ...this.workInDic,
            contactName: "",
            phoneNum: dict.contractDetailDto.phoneNum || "",
          };
        }
      }
      console.log(dict, "---------------------");
      this.workInDic = {
        ...this.workInDic,
        contractDetailId: dict.contractDetailDto.id || "", //合同详情ID
        contractNo: dict.businessNo || "", //合同单号
        customerId: dict.customerId || "", //客户id
        customerName: dict.customerName || "", //客户名称
        projectName: dict.contractDetailDto.projectName || "", //项目名称
        latitude: dict.contractDetailDto.latitude, //维度
        longitude: dict.contractDetailDto.longitude, //经度
        deliveryPlace: dict.contractDetailDto.deliveryPlace || "", //交付地点
        customerSalesman: dict.contractDetailDto.customerSalesman,
        customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
        customerSalesmanPhone:
          dict.customerSalesmanPhoneNum ||
          dict.contractDetailDto.customerSalesmanPhoneNum ||
          "",
        deliveryPhone: dict.contractDetailDto.phoneNum || "",
        deliveryContact: dict.contractDetailDto.contactName || "",
        orgId: dict.orgId,
        orgName: dict.orgName,
        customerType: dict.customerType,
        orders: [],
        contactName: dict.contractDetailDto.contactName,
      };
      console.log(this.workInDic, "this.workInDic");
      if (this.limitsDict.assigneeEdit) {
        this.loadAssginArr(dict.orgId);
      }
      this.getWorkInOrderList();
    },
    setContactVal(val) {
      this.workInDic = {
        ...this.workInDic,
        contactId: val.id,
        contactName: val.name || "",
        phoneNum: val.phoneNum || "",
      };
    },
    // 单纯加载物流数据
    getLogisticsType() {
      uni.showLoading();
      this.$network.loadUserType("logistics_type").then((result) => {
        console.log(result, "getLogisticsType");
        this.transArr = result.map((o) => {
          return {
            label: o.label,
            value: o.value,
          };
        });
      });
    },
    //加载物流类型
    loadTypeList() {
      uni.showLoading();
      this.$network
        .loadUserType("logistics_type")
        .then((result) => {
          this.transArr = result.map((o) => {
            return {
              label: o.label,
              value: o.value,
            };
          });
          if (this.transArr.length > 0) {
            // 默认使用第三方物流
            let dict = this.transArr[1];
            this.workInDic = {
              ...this.workInDic,
              logisticsType: this.workInDic.logisticsType
                ? this.workInDic.logisticsType
                : dict.value.toString(),
              logisticsTypeName: this.workInDic.logisticsType
                ? this.workInDic.logisticsTypeName
                : dict.label,
            };
            // if (this.workInDic.logisticsType) {
            //   this.loadLogisticsCompany({
            //     value: this.workInDic.logisticsType,
            //     label: this.workInDic.logisticsTypeName,
            //   });
            // } else {
            //   // 很多情况下,并没有获取到this.workInDic信息,导致使用第三方物流数据
            //   // this.loadLogisticsCompany(dict);
            // }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //类型选择确认
    dialog(val) {
      console.log(val, "this.type", this.type);
      switch (this.type) {
        case "usetrans":
          let transDic = val.checkArr;
          if (this.workInDic.logisticsType != transDic.value) {
            if (transDic.value == "2") {
              this.loadLogisticsCompany(transDic, "confirm");
            } else {
              this.workInDic = {
                ...this.workInDic,
                logisticsType: transDic.value,
                logisticsTypeName: transDic.label,
                logisticsCompanyId: "",
                logisticsCompanyName: "",
                logisticsDriverId: "",
                logisticsContact: "",
                logisticsPhone: "",
                logisticsCarriage: "0",
              };
            }
          }
          break;
        case "assign":
          let assginDic = val.checkArr;
          this.workInDic = {
            ...this.workInDic,
            deliveryUser: assginDic.value,
            deliveryUserName: assginDic.label,
          };
          break;
        default:
          break;
      }
    },
    //日历回调
    confirm(e) {
      switch (this.type) {
        case "planstart":
          let resultT = e.result + ":00";
          this.workInDic = {
            ...this.workInDic,
            preBeginDate: resultT,
          };
          break;
        case "planenable":
          //半天租
          this.workInDic = {
            ...this.workInDic,
            preEnableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
          };

          break;
        case "carbegin":
          let choosetypeArr = this.workInDic.orders;
          choosetypeArr[this.timeIndex] = {
            ...choosetypeArr[this.timeIndex],
            endDate: choosetypeArr[this.timeIndex].endDate,
            beginDate: e.result + " 00:00:00",
          };
          this.workInDic = {
            ...this.workInDic,
            orders: [...choosetypeArr],
          };
          this.calMoney();
          break;
        case "carend":
          let list = this.workInDic.orders;
          list[this.timeIndex] = {
            ...list[this.timeIndex],
            beginDate: list[this.timeIndex].beginDate,
            endDate: e.result + " 23:59:59",
          };
          this.workInDic = {
            ...this.workInDic,
            orders: [...list],
          };
          this.calMoney();
          break;
        case "storedate":
          this.workInDic = {
            ...this.workInDic,
            outStoreDate: e.result + ":00",
          };
          break;
        case "start":
          let resultStart = e.result + ":00";
          console.log(resultStart, "resultStart");
          if (this.isLiangXu) {
            this.workInDic = {
              ...this.workInDic,
              beginDate: resultStart,
              enableDate: this.isHalf
                ? resultStart
                : this.changestr(e.result) + " 00:00:00",
              preBeginDate: resultStart,
              beginDate: resultStart,
              preEnableDate: this.isHalf
                ? resultStart
                : this.changestr(e.result) + " 00:00:00",
              outStoreDate: resultStart,
            };
          } else {
            this.workInDic = {
              ...this.workInDic,
              beginDate: resultStart,
            };
          }
          break;
        case "enable":
          //半天租
          if (this.isLiangXu) {
            this.workInDic = {
              ...this.workInDic,
              enableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
              preBeginDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
              beginDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
              preEnableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
              outStoreDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
            };
          } else {
            this.workInDic = {
              ...this.workInDic,
              enableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
            };
          }
          break;
        case "preEnableDate":
          //半天租
          this.workInDic = {
            ...this.workInDic,
            preEnableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
            enableDate: this.isHalf ? e.result + ":00" : e.result + " 00:00:00",
          };
          break;
        case "preBeginDate":
          console.log(e.result, "preBeginDate");
          //半天租
          this.workInDic = {
            ...this.workInDic,
            preBeginDate: this.isHalf ? e.result + ":00" : e.result + ":00",
            beginDate: this.isHalf ? e.result + ":00" : e.result + ":00",
          };
          break;
        default:
          break;
      }
    },

    //默认物流初始数据
    loadLogisticsCompany(transDic, type) {
      console.log("加载物流数据");
      uni.showLoading();
      let param = {
        current: 1,
        size: 1,
      };
      this.$network
        .getData(this.$url.CONTRACT_LOGISTICS_COMPANY_LIST, "POST", param)
        .then((result) => {
          let list = [...result.records];
          if (list.length > 0) {
            let transChooseDic = {
              ...list[0],
            };
            let transDriver = null;
            if (
              transChooseDic.logisticsDrivers &&
              transChooseDic.logisticsDrivers.length > 0
            )
              transDriver = transChooseDic.logisticsDrivers[0];
            else {
              transDriver = {
                id: "",
                phoneNum: "",
                name: "",
              };
            }
            if (type == "confirm") {
              // 默认设置物流信息必须使用第三方物流情况下选择
              this.workInDic = {
                ...this.workInDic,
                // logisticsType: this.workInDic.logisticsType
                //   ? this.workInDic.logisticsType
                //   : transDic.value,
                // logisticsTypeName: this.workInDic.logisticsTypeName
                //   ? this.workInDic.logisticsTypeName
                //   : transDic.label,
                logisticsType:
                  type == "confirm"
                    ? transDic.value
                    : this.workInDic.logisticsType
                    ? this.workInDic.logisticsType
                    : transDic.value,
                logisticsTypeName:
                  type == "confirm"
                    ? transDic.label
                    : this.workInDic.logisticsType
                    ? this.workInDic.logisticsTypeName
                    : transDic.label,
                logisticsCompanyId: transDic.value == "2" ? transChooseDic.id : "",
                logisticsCompanyName: transDic.value == "2" ? transChooseDic.name : "",
                logisticsContact: transDic.value == "2" ? transDriver.name : "",
                logisticsDriverId: transDic.value == "2" ? transDriver.id : "",
                logisticsPhone: transDic.value == "2" ? transDriver.phoneNum : "",
                logisticsCarriage: this.workInDic.logisticsCarriage,
              };
            } else {
              this.workInDic = {
                ...this.workInDic,
                // logisticsType: this.workInDic.logisticsType
                //   ? this.workInDic.logisticsType
                //   : transDic.value,
                // logisticsTypeName: this.workInDic.logisticsTypeName
                //   ? this.workInDic.logisticsTypeName
                //   : transDic.label,
                logisticsType:
                  type == "confirm"
                    ? transDic.value
                    : this.workInDic.logisticsType
                    ? this.workInDic.logisticsType
                    : transDic.value,
                logisticsTypeName:
                  type == "confirm"
                    ? transDic.label
                    : this.workInDic.logisticsType
                    ? this.workInDic.logisticsTypeName
                    : transDic.label,
                logisticsCompanyId:
                  transDic.value == "2"
                    ? this.workInDic.logisticsCompanyId
                      ? this.workInDic.logisticsCompanyId
                      : transChooseDic.id
                    : "",
                logisticsCompanyName:
                  transDic.value == "2"
                    ? this.workInDic.logisticsCompanyName
                      ? this.workInDic.logisticsCompanyName
                      : transChooseDic.name
                    : "",
                logisticsDriverId:
                  transDic.value == "2"
                    ? this.workInDic.logisticsDriverId
                      ? this.workInDic.logisticsDriverId
                      : transDriver.id
                    : this.workInDic.logisticsDriverId
                    ? this.workInDic.logisticsDriverId
                    : "",
                logisticsContact:
                  transDic.value == "2"
                    ? this.workInDic.logisticsContact
                      ? this.workInDic.logisticsContact
                      : transDriver.name
                    : this.workInDic.logisticsContact
                    ? this.workInDic.logisticsContact
                    : "",
                logisticsPhone:
                  transDic.value == "2"
                    ? this.workInDic.logisticsPhone
                      ? this.workInDic.logisticsPhone
                      : transDriver.phoneNum
                    : this.workInDic.logisticsPhone
                    ? this.workInDic.logisticsPhone
                    : "",
                logisticsCarriage: this.workInDic.logisticsCarriage,
              };

              console.log("this.workInDic", this.workInDic);
            }
          } else {
            this.workInDic = {
              ...this.workInDic,
              logisticsType: transDic.value,
              logisticsTypeName: transDic.label,
              logisticsCompanyId: "",
              logisticsCompanyName: "",
              logisticsContact: "",
              logisticsDriverId: "",
              logisticsPhone: "",
              logisticsCarriage: this.workInDic.logisticsCarriage,
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          this.workInDic = {
            ...this.workInDic,
            logisticsType: transDic.value,
            logisticsTypeName: transDic.label,
            logisticsCompanyId: "",
            logisticsCompanyName: "",
            logisticsContact: "",
            logisticsDriverId: "",
            logisticsPhone: "",
            logisticsCarriage: this.workInDic.logisticsCarriage,
          };
          uni.hideLoading();
        });
    },

    calMoney() {
      let choosetypeArr = this.workInDic.orders;
      choosetypeArr.forEach((o) => {
        calRent.calculateTotalWithHMS(o);
      });
      this.workInDic = {
        ...this.workInDic,
        orders: [...choosetypeArr],
      };
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    checkMachines() {
      if (this.workInDic.machines && this.workInDic.machines.length == 0) {
        return new Promise((resolve, reject) => {
          resolve("sucess");
        });
      } else {
        let licenseIdList = this.workInDic.machines.map((o) => {
          return o.licenseId;
        });
        let param = {
          licenseIdList: licenseIdList,
          date: this.workInDic.enableDate,
          contractNo: this.workInDic.contractNo || "",
          businessNo: this.isUpdate || this.isApprove ? this.workInDic.businessNo : null,
        };
        let url = this.$url.WORK_IN_CHECK;
        return new Promise((resolve, reject) => {
          this.$network
            .getData(url, "POST", param)
            .then((result) => {
              uni.hideLoading();
              if (result && result.length > 0) {
                reject("启用时间必须晚于[" + result.join(",") + "]上次退场时间");
              } else {
                resolve("sucess");
              }
            })
            .catch((e) => {
              reject("fail");
              uni.hideLoading();
            });
        });
      }
    },
    preview() {
      this.operateType = "preview";
      let vm = this;
      uni.showLoading();
      if (this.checkData()) {
        if (!this.components.includes("wokinMachineChoose")) {
          this.workInDic.beginDate = null;
          this.workInDic.enableDate = null;
        }

        console.log(this.workInDic, "this.workInDic");
        let filename = this.$gxfmethod.getFileNameDoc("新增进场单", ".pdf");
        this.$gxfmethod.downFunc(
          "contractapi/api/workIn/preViewWorkIn/v2",
          "POST",
          this.workInDic,
          filename
        );
      }
    },
    share() {
      this.operateType = "share";
      let vm = this;
      uni.showLoading();
      if (this.checkData()) {
        if (!this.components.includes("wokinMachineChoose")) {
          this.workInDic.beginDate = null;
          this.workInDic.enableDate = null;
        }
        let filename = this.$gxfmethod.getFileNameDoc("新增进场单", ".docx");
        this.$gxfmethod.downFunc(
          "contractapi/api/workIn/downloadWord/v2",
          "POST",
          this.workInDic,
          filename
        );
      }
    },
    //右边按钮
    clicksave() {
      this.operateType = "add";
      if (this.checkData()) {
        if (this.limitsDict.deliverEdit) {
          this.checkMachines()
            .then((res) => {
              uni.hideLoading();
              this.preRequest();
            })
            .catch((e) => {
              uni.showToast({
                icon: "none",
                title: e,
              });
            });
        } else {
          uni.hideLoading();
          setTimeout(() => {
            this.preRequest();
          }, 100);
        }
      }
    },
    //左边按钮
    clickecancle() {
      uni.hideLoading();
      setTimeout(() => {
        if (this.limitsDict.applyEdit && !this.isApprove) {
          //申请返回
          uni.navigateBack({
            delta: 1,
          });
        } else {
          //其他调用退回
          this.$refs.backview.open();
        }
      }, 100);
    },
    preRequest() {
      // 校验必选附件
      if (this.workInDic.machines && this.workInDic.machines.length) {
        for (let i = 0; i < this.workInDic.machines.length; i++) {
          if (
            this.workInDic.machines[i].fileList &&
            this.workInDic.machines[i].fileList.length
          ) {
            for (let k = 0; k < this.workInDic.machines[i].fileList.length; k++) {
              if (
                this.workInDic.machines[i].fileList[k].required &&
                !this.workInDic.machines[i].fileList[k].url
              ) {
                uni.showToast({
                  title: "请上传必填附件",
                  duration: 2000,
                  icon: "none",
                });
                return;
              }
            }
          }
        }
      }
      if (this.isApprove) {
        // 通过
        this.httprequestThougth();
      } else if (this.isUpdate) {
        // 修改提交
        this.httprequestUpdateData();
      } else {
        // 提交
        this.httprequestData();
      }
    },
    // 定义一个方法来显示模态框
    showModal(title, content, isConfirm = false, onConfirm = null) {
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
    //修改提交
    httprequestUpdateData() {
      let urlstr = this.$url.WORK_IN_UPDATE_CHECK;
      this.$network
        .getData(
          urlstr,
          "GET",
          { businessNo: this.workInDic.businessNo },
          { hideError: true }
        )
        .then((checkRes) => {
          this.$network
            .getData(this.$url.WORK_IN_UPDATE, "POST", this.workInDic, {
              showLoading: true,
            })
            .then((result) => {
              uni.$emit("refresh-contract-list", {
                type: "workin",
              });
              uni.$emit("refresh-notification-list", {
                type: "apply",
              });
              uni.showToast({
                title: "请上传必填附件",
                duration: 2000,
                icon: "none",
              });
              uni.navigateBack({
                animationDuration: 200,
              });
            });
        })
        .catch((err) => {
          if (err && err.code == 500) {
            // 在调用showModal之前构建消息
            let message = err.message || "请联系客服人员";

            // 检查是否有result
            if (err.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(err.result)) {
                documentNumbers = err.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = err.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("无法修改", message);
          }
        });
    },
    //提交
    httprequestData() {
      uni.showLoading({
        mask: true,
      });
      this.workflowcommon.iswf("workIn").then((iswf) => {
        if (iswf) {
          this.workflowcommon
            .getFirstNodeUser(
              "contractapi",
              "workIn",
              this.workInDic.orgId,
              this.workInDic.customerSalesman,
              this.workInDic.logisticsType
            )
            .then((showToast) => {
              if (showToast) {
                uni.hideLoading();
                setTimeout(() => {
                  this.$refs.aletrview.open();
                }, 100);
              } else {
                if (this.itemDict && this.itemDict.taskState === "back") {
                  uni.hideLoading();
                  this.$refs.remarkview.open();
                } else {
                  let assnstr = this.workflowcommon.submitData(false, []);
                  this.submitSaveData(assnstr);
                }
              }
            })
            .catch((error) => {
              uni.showToast({
                icon: "none",
                title: error.message ? error.message : "",
              });
            });
        } else {
          this.submitSaveData("");
        }
      });
    },
    // 通过
    httprequestThougth() {
      // 过滤掉空的数据
      if (this.workInDic.machines && this.workInDic.machines.length) {
        for (let i = 0; i < this.workInDic.machines.length; i++) {
          if (
            this.workInDic.machines[i].fileList &&
            this.workInDic.machines[i].fileList.length
          ) {
            // 2.再过滤url为空的
            let fileList = this.workInDic.machines[i].fileList.filter((item) => item.url);
            this.workInDic.machines.splice(i, 1, {
              ...this.workInDic.machines[i],
              fileList,
            });
          }
        }
      }
      console.log(this.itemDict, " this.itemDict");
      if (this.limitsDict.assigneeEdit && !this.limitsDict.deliverEdit) {
        //第三步直接走通过接口，添加交机人员为下个节点审批人员
        this.$refs.remarkview.open();
      } else {
        //其他非申请时候判断
        uni.showLoading({
          mask: true,
        });
        this.workflowcommon
          .getPassNodeUser("contractapi", this.itemDict.procInstId, this.workInDic.orgId)
          .then((showToast) => {
            console.log(showToast, "httprequestThougth");
            if (showToast) {
              this.$refs.aletrview.open();
              uni.hideLoading();
            } else {
              uni.hideLoading();
              this.$refs.remarkview.open();
            }
          })
          .catch((error) => {
            uni.showToast({
              icon: "none",
              title: error.message,
            });
          });
      }
    },
    //弹窗提示返回
    getAssignList(val) {
      this.alist = val.selectArr;
      let remarkstr = val.remark;
      if (this.limitsDict.applyEdit) {
        if ((this.itemDict && this.itemDict.taskState === "back") || this.isApprove) {
          let ids = [];
          this.alist.forEach((o) => {
            ids.push(o.id);
          });
          this.thoughSaveData(ids, remarkstr);
        } else {
          let assnstr = this.workflowcommon.submitData(true, this.alist);
          this.submitSaveData(assnstr);
        }
      } else {
        let ids = [];
        this.alist.forEach((o) => {
          ids.push(o.id);
        });
        this.thoughSaveData(ids, remarkstr);
      }
    },
    remarksum(val) {
      uni.showLoading({
        mask: true,
      });
      if (this.limitsDict.assigneeEdit && !this.limitsDict.deliverEdit) {
        this.thoughSaveData([this.workInDic.deliveryUser], val.remark);
      } else {
        this.thoughSaveData([], val.remark); //退回
      }
    },
    //提交接口
    submitSaveData(val) {
      // 过滤掉空的数据
      if (this.workInDic.machines && this.workInDic.machines.length) {
        for (let i = 0; i < this.workInDic.machines.length; i++) {
          if (
            this.workInDic.machines[i].fileList &&
            this.workInDic.machines[i].fileList.length
          ) {
            // 2.再过滤url为空的
            let fileList = this.workInDic.machines[i].fileList.filter((item) => item.url);
            this.workInDic.machines.splice(i, 1, {
              ...this.workInDic.machines[i],
              fileList,
            });
          }
        }
      }
      let url = this.$url.WORK_IN_CREATE + val;
      this.workInDic = {
        ...this.workInDic,
        beginDate: this.workInDic.beginDate || format(new Date(), "yyyy-MM-dd hh:mm:ss"),
        enableDate:
          this.workInDic.enableDate || format(new Date(), "yyyy-MM-dd hh:mm:ss"),
      };
      console.log(this.workInDic, "submitSaveData");
      this.$network
        .getData(url, "POST", this.workInDic, { showLoading: true })
        .then((result) => {
          uni.$emit("refresh-contract-list", {
            type: "workin",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.navigateBack({
            animationDuration: 200,
          });
        });
    },
    //通过接口
    thoughSaveData(val, inputstr) {
      let jsonstr = JSON.stringify(this.workInDic);
      // 过滤掉空的数据
      if (this.workInDic.machines && this.workInDic.machines.length) {
        for (let i = 0; i < this.workInDic.machines.length; i++) {
          if (
            this.workInDic.machines[i].fileList &&
            this.workInDic.machines[i].fileList.length
          ) {
            // 2.再过滤url为空的
            let fileList = this.workInDic.machines[i].fileList.filter((item) => item.url);
            this.workInDic.machines.splice(i, 1, {
              ...this.workInDic.machines[i],
              fileList,
            });
          }
        }
      }
      this.workflowcommon
        .passapply(
          "contractapi",
          val,
          inputstr,
          jsonstr,
          this.itemDict.procDefId,
          this.itemDict.procInstId,
          this.itemDict.id
        )
        .then((showToast) => {
          uni.$emit("refresh-contract-list", {
            type: "workin",
          });
          uni.$emit("refresh-notification-list", {
            type: "wait",
          });
          uni.navigateBack({
            animationDuration: 200,
          });
          uni.hideLoading();
        })
        .catch((error) => {
          uni.showToast({
            icon: "none",
            title: error.message,
          });
        });
    },
    getWorkInAndOutFileMust() {
      this.$network
        .getData(`userapi/api/sys/param/workInAndOutFileMust`, "GET")
        .then((e) => {
          this.bool = e.value == "true" ? true : false;
        });
    },
    //检验必填项
    checkData() {
      // 获取是否上传附件
      if (
        this.limitsDict.dispatchEdit ||
        this.limitsDict.deliverEdit ||
        this.limitsDict.applyEdit
      ) {
        if (
          workindiffer.checkData(
            this.limitsDict,
            this.workInDic,
            this.isRemoveRepeat,
            this.isLiangXu,
            this.bool,
            this.formKey || "",
            this.operateType || "add"
          )
        ) {
          return this.resetCarListTo();
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    //当时交车或者调度的时候判断一下是否选车
    resetCarListTo() {
      if (this.workInDic.machines) {
        if (
          this.workInDic.machines.length == 0 &&
          this.formKey.indexOf("deliver") != -1
        ) {
          uni.showToast({
            icon: "none",
            title: "请选择设备",
          });
          return false;
        } else {
          return true;
        }
      } else if (this.formKey.indexOf("deliver") != -1) {
        uni.showToast({
          icon: "none",
          title: "请选择设备",
        });
        return false;
      } else {
        return true;
      }
    },
    //退回
    choosNode(val) {
      let dict = val.selectArr;
      let remarkstr = val.remark;
      this.backTask(dict, remarkstr);
    },
    backTask(val, backInput) {
      if (!val.id) {
        uni.showToast({
          title: "退回节点不能为空",
          icon: "none",
        });
        return;
      }
      uni.showLoading();
      this.workflowcommon.getApplyProcessNode("workIn").then((result) => {
        let limitsDictReset = workindiffer.getLimitWithArr(result, "apply");
        let dict = this.resetDataWithBack(limitsDictReset);
        let jsonstr = JSON.stringify(dict);
        console.log(jsonstr);
        this.workflowcommon
          .backTask(
            "contractapi",
            val.id,
            backInput,
            this.itemDict.id,
            val.procInstId,
            jsonstr
          )
          .then(() => {
            uni.$emit("refresh-notification-list", {
              type: "wait",
            });
            uni.$emit("refresh-contract-list", {
              type: "workin",
            });

            uni.navigateBack({
              delta: 1,
              success() {
                // uni.showToast({
                //   title: "成功修改进场单",
                //   icon: "none",
                // });
              },
            });
          })
          .catch(() => {
            uni.showToast({
              title: "请求失败",
              icon: "none",
            });
          });
      });
    },
    resetDataWithBack(limitdictReset) {
      let dict = {
        ...this.workInDic,
      };
      return dict;
    },
  },
};
</script>

<style scoped lang="scss">
.bg-view {
  width: 100%;
  background: $uni-bg-color-grey;
}

.contractHead {
  padding: 14px 0;
  margin-top: 10px;
  background: #ffffff;

  .title {
    font-size: 16px;
    color: #222222;
    font-weight: 600;
    margin-bottom: 18px;
    margin-left: 10px;
    display: flex;
    align-items: center;

    .contractType {
      width: 22px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background-color: #f08200;
      color: #ffffff;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      margin-right: 4px;
    }
  }

  .body {
    position: relative;
    padding: 10px;
    height: 123px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 12px;
    color: #8c8c8c;
    font-weight: 400;
    background: #f6f6f6;
    margin: 0 10px;
  }
}

.phone-icon {
  padding: 4px;
  background-color: rgba(230, 0, 0, 0.08);
  color: #e60000;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 3px;
  background: #dcdfe6;
  font-size: $uni-font-size-lg;
  color: $uni-text-color-inverse;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 3px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.warning {
  background-color: #f08200;
}
</style>
