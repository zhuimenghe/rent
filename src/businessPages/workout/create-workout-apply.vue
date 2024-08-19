<template>
  <view class="content">
    <approve-step
      :itemData="itemData"
      :updateObj="workoutDic"
      :NeedUpdate="true"
      :needStaff="itemData.formKey === 'assignee' && processObj.variables"
      :staffId="workoutDic.deliveryUser"
      :orgId="workoutDic.orgId"
      :businessOwner="workoutDic.customerSalesman"
      :needBackJson="true"
      @data-form="dataForm"
      @backTask="backTask"
    >
      <create-workout
        ref="workout"
        :initial-workout-dic="workoutDic"
        :step="step"
        :isApproval="true"
        :isFrist="false"
        :isControl="true"
        :nodeList="nodeList"
        :formKey="itemData.formKey"
        @updateWorkoutDic="handleUpdate"
        @processType="getProcess"
      ></create-workout>
      <view class="previewsave" slot="workpreview" @click="preview">预览</view>
      <view class="previewsave share" slot="share" @click="share">分享</view>
    </approve-step>
    <sany-popup ref="sanyPop"></sany-popup>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import createWorkout from "./create-workout.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import timeCompare from "@/common/common-method/common-method.js";
import { processFileDesc } from "@/common/business-method/common-method/util.js";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
export default {
  components: {
    createWorkout,
    approveStep,
    sanyPopup,
  },
  data() {
    return {
      itemData: {},
      step: 2,
      limitNumList: [],
      workoutDic: {
        logisticsPhone: "",
        logisticsCompanyName: "",
        logisticsCompanyId: "",
        logisticsPhone: "",
        logisticsCarriage: "0",
        transportMachine: [],
        transportDriver: [],
      },
      processType: "",
      processObj: {}, //退场流程obj
      nodeList: [],
      isLiangXu: false,
      isChooseTime: false,
      bool: true,
    };
  },
  watch: {
    itemData(val) {
      this.getStep(val);
    },
  },
  onUnload() {
    uni.$off("choose-success");
  },
  onLoad(options) {
    uni.$on("choose-success", (machine) => {
      this.updateMachineLists(machine);
      // 处理 fileList 的逻辑，需要在 updateMachineLists 方法后执行，以确保 fileList 也得到更新
      (this.workoutDic.machines || []).forEach((machine) => {
        if (machine.fileList) {
          machine.fileList = machine.fileList.map((file) => ({
            ...file,
            ...processFileDesc(file.fileDesc), // 假设 processFileDesc 方法处理文件描述信息
          }));
        }
      });
      this.workoutDic = { ...workoutDic };
    });

    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isLiangXu = obj.value === "liangXu" ? true : false;
      }
      let obj5 = resData.find((o) => o.code === "work_in_out_fill_date");
      if (obj5) {
        //进、退场单启用时间、结算时间是否自动填充
        this.isChooseTime = obj5.value === "false" ? true : false;
      }
    }
    // this.itemData = JSON.parse(options.item);
    this.itemData = JSON.parse(decodeURIComponent(options.item));
    console.log(this.itemData, "this.itemData ");
    this.getStep(this.itemData);
    this.getWorkInAndOutFileMust();

    // 选择附件
    uni.$on("machine-choose-filelist-done", (machine, index) => {
      console.log(machine, index, "machine-choose-filelist-done----");
      this.workoutDic.machines.length > 0
        ? this.workoutDic.machines.splice(index, 1, {
            ...machine,
            fileList: machine.fileList,
          })
        : null;
    });
  },
  methods: {
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
    preview() {
      console.log(this.workInDic, "this.workInDic");
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
      let filename = this.$gxfmethod.getFileNameDoc("新增退场单", ".docx");
      this.$gxfmethod.downFunc(
        "contractapi/api/workOut/downloadWord/v2",
        "POST",
        this.workoutDic,
        filename
      );
    },
    getWorkInAndOutFileMust() {
      this.$network
        .getData(`userapi/api/sys/param/workInAndOutFileMust`, "GET")
        .then((e) => {
          this.bool = e.value == "true" ? true : false;
        });
    },
    backTask(val) {
      if (this.nodeList.length > 0) {
        let applyList = this.getJudgeModel(this.nodeList[0].formKey);
        if (
          !applyList.find((o) => o === "logistics") &&
          !applyList.find((o) => o === "dispatch")
        ) {
          if (this.workoutDic.logisticsType == "3") {
            this.workoutDic = {
              ...this.workoutDic,
              logisticsPhone: null,
              logisticsContact: null,
              logisticsCompanyName: null,
              logisticsCompanyId: null,
            };
          }
          this.workoutDic = {
            ...this.workoutDic,
            logisticsCarriage: 0,
            transportMachine: [],
            transportDriver: [],
          };
        }
        if (!applyList.find((o) => o === "assignee")) {
          this.workoutDic = {
            ...this.workoutDic,
            deliveryUserName: null,
            deliveryUser: null,
          };
        }
        if (!applyList.find((o) => o === "deliver")) {
          if (!applyList.find((o) => o === "dispatch")) {
            let orders = [];
            //置空订单中设备
            if (this.workoutDic.orders) {
              orders = this.workoutDic.orders.map((o) => {
                return { ...o, machineList: [] };
              });
            }
            this.workoutDic = {
              ...this.workoutDic,
              orders: orders,
              machines: null,
            };
          }
          if (this.isLiangXu) {
            this.workoutDic = {
              ...this.workoutDic,
              outType: null,
              outTypeName: null,
            };
          } else {
            this.workoutDic = {
              ...this.workoutDic,
              endDate: null,
              settleDate: null,
              outType: null,
              outTypeName: null,
              inStoreDate: null,
            };
          }
        }
      }
      let param = val.param;
      param = {
        ...param,
        json: JSON.stringify(this.workoutDic),
      };
      let url = this.$url.BACK_TASK.replace(/xxx/, "contractapi");
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          uni.$emit("refresh-notification-list", {
            type: "wait",
          });
          uni.$emit("refresh-contract-list", {
            type: "workout",
          });

          uni.showToast({
            title: "退回成功",
            icon: "none",
          });
          uni.navigateBack({
            delta: 1,
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.detail[0] ? err.detail[0] : err.message,
          });
        });
    },
    getApproveData(businessKey) {
      //审批流
      this.workflowcommon.getOnlineList(businessKey).then((result) => {
        this.nodeList = result ? [...result] : [];
      });
    },
    getProcess(val) {
      this.processType = val.processType;
      this.processObj = val.processObj ? val.processObj : {};
    },
    dataForm(val) {
      let dic = JSON.parse(val);
      console.log(dic, "审批流数据回传dataForm()");
      let isShowMachineFineColumns = false;
      if (dic.machines && dic.machines.some((item) => item.fileList)) {
        isShowMachineFineColumns = true;
      }
      if (this.getJudgeModel("deliver") && !this.isChooseTime) {
        dic = {
          ...dic,
          isShowMachineFineColumns,
          endDate: dic.endDate ? dic.endDate : dic.preEndDate ? dic.preEndDate : null,
          settleDate: dic.settleDate
            ? dic.settleDate
            : dic.preSettleDate
            ? dic.preSettleDate
            : null,
        };
      }
      // TODO-WORKOUT【DO】:退场数据传递-实际调用位置
      // this.$refs.workout.setWorkDic(dic);
      let workoutDic = { ...dic };

      workoutDic.machines = (workoutDic.machines || []).map((machine) => {
        // 过滤掉 fileDesc 没有值的项
        const filteredFileList = (machine.fileList || []).filter((file) => file.fileDesc);
        return {
          ...machine,
          fileList: filteredFileList.map((file) => ({
            ...file,
            ...processFileDesc(file.fileDesc),
          })),
        };
      });
      this.workoutDic = { ...workoutDic };
      this.getApproveData(dic.businessKey);
    },
    getStep(data) {
      uni.setNavigationBarTitle({
        title: data.name,
      });
    },
    handleUpdate(val) {
      this.workoutDic = {
        ...val,
        settleDate: this.ensureDateTimeFormat(val.settleDate),
      };
    },
    // TODO-EXTRACT：抽取获取设备列表或设备列表长度的公共方法
    getCurMachineList(item) {
      if (this.workoutDic.machines) {
        let m = this.workoutDic.machines.filter((o) => {
          return o.contractOrderId === item.id;
        });
        console.log("m:" + (m ? m.length : 0));
        return m ? m.length : 0;
      } else {
        return 0;
      }
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
      return new Promise((resolve, reject) => {
        let licenseIdList = this.workoutDic.machines.map((o) => {
          return o.licenseId;
        });
        let param = {
          licenseIdList: licenseIdList,
          date: this.ensureDateTimeFormat(this.workoutDic.settleDate),
          contractNo: this.workoutDic.contractNo || "",
          businessNo: this.workoutDic.businessNo || "",
        };
        let url = this.$url.WORK_OUT_CHECK;
        this.$network
          .getData(url, "POST", param)
          .then((result) => {
            uni.hideLoading();
            //
            if (result && result.length > 0) {
              this.showModal(
                "提示",
                "[" + result.join(",") + "]结算时间不得早于进场时间或上次结算时间"
              );
              reject("fail");
            } else {
              resolve("success");
            }
          })
          .catch((e) => {
            uni.hideLoading();
            reject(e);
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
            resolve("sucess");
            this.limitNumList = result;
            // let orders = this.workoutDic.orders.filter((o) => o.workInNum > 0);
            // if (orders.some((o) => this.getCurMachineList(o) > this.getUseMaxNum(o))) {
            //   //有车辆大于可用车辆最大数
            //   console.log("fail");
            //   reject("fail");
            // } else {
            //   console.log("sucess");
            //   resolve("sucess");
            // }
          })
          .catch((e) => {
            console.log("catch");
            reject("fail");
            uni.hideLoading();
          });
      });
    },
    getUseMaxNum(item) {
      let order = this.limitNumList.find((o) => {
        return o.id === item.id;
      });
      if (order) {
        if (order.workInNum > 0) {
          let num =
            order.workInNum -
            order.actualNum -
            order.applyNum +
            (item.usedNum ? item.usedNum : 0);
          console.log("num" + num);
          return num;
        }
        return 0;
      }
      return 0;
    },
    getJudgeModel(formKey) {
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

    checkData() {
      if (!this.getJudgeModel(this.itemData.formKey)) {
        return Promise.resolve("success");
      }
      let applyList = this.getJudgeModel(this.itemData.formKey);
      if (applyList.find((o) => o === "dispatch")) {
        if (
          !this.workoutDic.machines ||
          (this.workoutDic.machines && this.workoutDic.machines.length <= 0)
        ) {
          uni.showToast({
            icon: "none",
            title: "至少选择一台退场设备",
          });
          return Promise.reject("fail");
        }
      }
      // 校验必选附件
      if (this.workoutDic.machines && this.workoutDic.machines.length) {
        for (let i = 0; i < this.workoutDic.machines.length; i++) {
          if (
            this.workoutDic.machines[i].fileList &&
            this.workoutDic.machines[i].fileList.length
          ) {
            for (let k = 0; k < this.workoutDic.machines[i].fileList.length; k++) {
              if (
                this.workoutDic.machines[i].fileList[k].required &&
                !this.workoutDic.machines[i].fileList[k].url
              ) {
                uni.showToast({
                  title: "请上传必填项",
                  duration: 2000,
                  icon: "none",
                });
                return;
              }
            }
          }
        }
      }
      if (
        this.bool &&
        applyList.find((o) => o === "deliver") &&
        (!this.workoutDic.fileList || this.workoutDic.fileList.length == 0)
      ) {
        uni.showToast({
          icon: "none",
          title: "请选择附件",
        });
        return Promise.reject("fail");
      }
      if (
        applyList.find((o) => o === "logistics") ||
        applyList.find((o) => o === "dispatch")
      ) {
        if (this.workoutDic.logisticsType == "2" && !this.workoutDic.logisticsCompanyId) {
          uni.showToast({
            icon: "none",
            title: "请选择物流公司",
          });

          return Promise.reject("fail");
        }
        if (
          this.workoutDic.logisticsType == "3" &&
          (!this.workoutDic.transportMachine ||
            this.workoutDic.transportMachine.length <= 0)
        ) {
          uni.showToast({
            icon: "none",
            title: "请选择运输车辆",
          });

          return Promise.reject("fail");
        }
        if (
          this.workoutDic.logisticsPhone &&
          !this.$datestr.isphonenum(this.workoutDic.logisticsPhone)
        ) {
          uni.showToast({
            icon: "none",
            title: "请输入正确的联系人电话",
          });

          return Promise.reject("fail");
        }
      }

      if (applyList.find((o) => o === "assignee")) {
        if (!this.workoutDic.deliveryUser) {
          uni.showToast({
            icon: "none",
            title: "请选择接机人员",
          });
          return Promise.reject("fail");
        }
      }

      if (applyList.find((o) => o === "deliver")) {
        // if (!this.workoutDic.outType) {
        // 	uni.showToast({
        // 		icon: "none",
        // 		title: "请选择退场类型"
        // 	})
        // 	return Promise.reject('fail')

        // }
        if (!this.workoutDic.endDate && !this.isLiangXu) {
          uni.showToast({
            icon: "none",
            title: "请选择接机时间",
          });
          return Promise.reject("fail");
        }
        if (!this.workoutDic.settleDate && !this.isLiangXu) {
          uni.showToast({
            icon: "none",
            title: "请选择结算时间",
          });
          return Promise.reject("fail");
        }
        if (
          !this.workoutDic.machines ||
          (this.workoutDic.machines && this.workoutDic.machines.length <= 0)
        ) {
          uni.showToast({
            icon: "none",
            title: "至少选择一台退场设备",
          });
          return Promise.reject("fail");
        }
        if (!this.isLiangXu) {
          this.workoutDic = {
            ...this.workoutDic,
            settleDate: this.workoutDic.settleDate ? this.workoutDic.settleDate : null,
            inStoreDate: this.workoutDic.inStoreDate
              ? this.findNotStr(this.workoutDic.inStoreDate, "00:00:00")
                ? this.workoutDic.inStoreDate + " 00:00:00"
                : this.workoutDic.inStoreDate
              : null,
          };
        }
        this.workoutDic = {
          ...this.workoutDic,
          outType: 1,
          outTypeName: "直接退场",
        };
        return new Promise((resolve, reject) => {
          this.getWorkOutOrderList()
            .then((res) => {
              if (applyList.find((o) => o === "deliver")) {
                this.checkMachines()
                  .then((res) => {
                    resolve("sucess");
                  })
                  .catch((e) => {
                    // uni.showToast({
                    //   icon: "none",
                    //   title: e,
                    // });
                    reject("fail");
                  });
              } else {
                resolve("sucess");
              }
            })
            .catch((e) => {
              console.log("workOut check delivery catch");
              uni.showToast({
                icon: "none",
                title: "所选车辆已超出可选范围",
              });
              reject("fail");
            });
        });
      }
      return Promise.resolve("success");
    },
    //是否查找到‘00：00：00’
    findNotStr(str, findstr) {
      return str.indexOf(findstr) === -1;
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    filterFiles() {
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

::v-deep .img-upload-view,
::v-deep .img-bg-view {
  background: #fff !important;
}

::v-deep .submit-btn,
::v-deep .cancel-btn {
  border-radius: 6rpx !important;
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
  margin: 0 8px !important;
}
</style>
