<template>
  <view class="content">
    <approve-step
      :itemData="itemData"
      @data-form="dataForm"
      :updateObj="workoutDic"
      :NeedUpdate="true"
      :needStaff="step === 3"
      :staffId="workoutDic.deliveryUser"
      :orgId="workoutDic.orgId"
      :businessOwner="workoutDic.customerSalesman"
    >
      <create-workout
        :step="step"
        @workoutDic="getDic"
        :applyData="workoutDic"
      ></create-workout>
    </approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import createWorkout from "./create-workout.vue";
import approveStep from "@/components/workflow/approve-step.vue";
export default {
  components: {
    createWorkout,
    approveStep,
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
    };
  },
  watch: {
    itemData(val) {
      this.getStep(itemData);
    },
    workoutDic(val) {
      console.log("workoutDic-apply" + JSON.stringify(val));
    },
    step(val) {
      console.log("step-apply" + val);
    },
  },
  onLoad(options) {
    console.log(options);
    // this.itemData = JSON.parse(options.item);
    this.itemData = JSON.parse(decodeURIComponent(options.item));
    this.getStep(this.itemData);
  },
  methods: {
    dataForm(val) {
      let dic = JSON.parse(val);
      this.workoutDic = { ...dic };
      if (this.step === 4) {
        this.workoutDic = {
          ...this.workoutDic,
          endDate: dic.endDate ? dic.endDate : dic.preEndDate,
          settleDate: dic.settleDate ? dic.settleDate : dic.preSettleDate,
        };
      }
    },
    etStep(data) {
      if (data.formKey === "apply") {
        //申请
        this.step = 1;
        uni.setNavigationBarTitle({
          title: "新建退场单",
        });
      } else if (data.formKey === "logistics") {
        //调度
        this.step = 2;
        uni.setNavigationBarTitle({
          title: "物流信息",
        });
      } else if (data.formKey === "assignee") {
        //交车
        this.step = 3;
        uni.setNavigationBarTitle({
          title: "指定接机人员",
        });
      } else if (data.formKey === "deliver") {
        //交车
        this.step = 4;
        uni.setNavigationBarTitle({
          title: "现场接机",
        });
      }
    },
    getDic(val) {
      this.workoutDic = { ...val };
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
            console.log("this.workoutDic" + JSON.stringify(this.workoutDic));
            let orders = this.workoutDic.orders.filter((o) => o.workInNum > 0);
            if (orders.some((o) => this.getCurMachineList(o) > this.getUseMaxNum(o))) {
              //有车辆大于可用车辆最大数
              console.log("fail");
              reject("fail");
            } else {
              console.log("sucess");
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
    checkData() {
      if (this.step === 3) {
        if (!this.workoutDic.deliveryUser) {
          uni.showToast({
            icon: "none",
            title: "请选择选择接机人员",
          });
          return Promise.reject("fail");
        }
      }
      if (this.step === 4) {
        // if (!this.workoutDic.outType) {
        // 	uni.showToast({
        // 		icon: "none",
        // 		title: "请选择退场类型"
        // 	})
        // 	return Promise.reject('fail')

        // }
        if (!this.workoutDic.endDate) {
          uni.showToast({
            icon: "none",
            title: "请选择接机时间",
          });
          return Promise.reject("fail");
        }
        if (!this.workoutDic.settleDate) {
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

        this.workoutDic = {
          ...this.workoutDic,
          // settleDate: this.workoutDic.settleDate ? (this.findNotStr(this.workoutDic.settleDate, '23:59:59') ? this.workoutDic
          // 	.settleDate +
          // 	" 23:59:59" : this.workoutDic.settleDate) : null,
          inStoreDate: this.workoutDic.inStoreDate
            ? this.findNotStr(this.workoutDic.inStoreDate, "00:00:00")
              ? this.workoutDic.inStoreDate + " 00:00:00"
              : this.workoutDic.inStoreDate
            : null,
          outType: 1,
          outTypeName: "直接退场",
        };

        return new Promise((resolve, reject) => {
          this.getWorkOutOrderList()
            .then((res) => {
              console.log("workOut check delivery sucess");
              resolve("sucess");
            })
            .catch((e) => {
              console.log("workOut check delivery sucess");
              uni.showToast({
                icon: "none",
                title: "所选车辆已超出可选范围",
              });
              reject("fail");
            });
        });

        console.log("workOut delivery sucess ----goNext");
      }

      return Promise.resolve("success");
    },
    //是否查找到‘00：00：00’
    findNotStr(str, findstr) {
      return str.indexOf(findstr) === -1;
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
</style>
