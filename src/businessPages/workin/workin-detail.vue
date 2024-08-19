<template>
  <view class="bg-view">
    <c-nav-bar-apply :business-key="workInDic.businessKey">进场详情</c-nav-bar-apply>
    <scroll-view scroll-y class="flex-scroll-wrapper">
      <view class="contractHead">
        <p class="title">{{ workInDic.customerName }}-{{ workInDic.projectName }}</p>
        <view class="body">
          <p>合同编号：{{ workInDic.contractNo || "-" }}</p>
          <p>区域：{{ workInDic.orgName }}</p>
          <p>业务负责人：{{ workInDic.customerSalesmanName }}</p>
          <p style="display: flex; justify-content: space-between; align-items: center">
            客户联系人：{{ workInDic.contactName }}-{{ workInDic.phoneNum }}
            <i
              class="iconfont phone-icon icondianhua"
              @click.stop="callPhone(workInDic.phoneNum)"
            ></i>
          </p>
        </view>
      </view>
      <b-esign-timeline
        ref="timeline"
        v-if="isShowEsignTimeline"
        showExpand
        :businessNo="workInDic.businessNo"
      ></b-esign-timeline>

      <workinapply
        :previewBtn="true"
        path="workin-detail"
        :dataDic="workInDic"
        :isedit="false"
        :showRepeat="isRemoveRepeat"
        :isRoleBasedScenario="isRoleBasedScenario"
        :isShowNum="isShowNum"
        :isshowLogistics="!(limitsDict.apply && limitsDict.dispatch)"
        v-if="components.includes('workinapply')"
        :components="renderComponents"
        :isLiangXu="isLiangXu"
        :isHalf="isHalf"
        :iswf="iswf"
      />
      <!-- v-if="components.includes('workinlogistics')&&workInDic.logisticsType!=1" -->

      <wokinMachineChoose
        :isControl="false"
        :isDetail="true"
        :machines="workInDic.machines"
        :dataDic="workInDic"
        v-if="components.includes('wokinMachineChoose')"
        :chooseModelList="workInDic.orders"
        :isEdit="false"
        :dispatchMachines="workInDic.dispatchMachines || []"
      >
      </wokinMachineChoose>
      <!-- <workindispatch :dataDic="workInDic" :isedit="false" :showCarList="!limitsDict.deliver"
        v-if="components.includes('workindispatch')" :isLiangXu="isLiangXu" /> -->

      <workinlogistics
        :dataDic="workInDic"
        v-if="components.includes('workinlogistics') && workInDic.logisticsType != 1"
        :isedit="false"
        :isLiangXu="isLiangXu"
      />
      <workinassign
        :dataDic="workInDic"
        :isedit="false"
        v-if="components.includes('workinassign')"
        :isLiangXu="isLiangXu"
      />
      <workinlocale
        :dataDic="workInDic"
        :isedit="false"
        v-if="components.includes('wokinMachineChoose')"
        :isLiangXu="isLiangXu"
        :isHalf="isHalf"
      />
    </scroll-view>
    <esign-footer :esignParams="esignParams"></esign-footer>
    <!-- <view class="actions-footer-flex">
      <view class="z-btn bg-gray light radius" >返回</view>
      <view class="z-btn bg-warn radius" @click="preview">下载</view>
      <view class="z-btn bg-primary radius" v-if="isStartEsign" @click="goToESign('start')" >
        启动电签
      </view>
      <view class="z-btn bg-primary radius" v-if="isShowEsignDetail" @click="goToESign('detail')" >
        电签详情
      </view>
    </view> -->
  </view>
</template>

<script>
import workinapply from "./steplist/workin-apply.vue";
import workinlogistics from "./steplist/workin-logistics.vue";
import workinassign from "./steplist/workin-assign.vue";
import workinlocale from "./steplist/workin-locale.vue";
import workindispatch from "./steplist/workin-dispatch.vue";
import workindiffer from "./workin-differ.js";
import wokinMachineChoose from "./wokin-machine-choose.vue";
import esignFooter from "../components/esign-footer.vue";
export default {
  components: {
    workinapply,
    workinlogistics,
    workinassign,
    workinlocale,
    workindispatch,
    wokinMachineChoose,
    esignFooter,
  },
  computed: {
    // 移除重复的元素
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
    isShowEsignTimeline() {
      return this.workInDic.signFlow == "1";
    },
    esignParams() {
      return {
        businessState: this.workInDic.state,
        flowStatus: this.workInDic.flowStatus,
        signFlowId: this.workInDic.signFlowId,
        businessType: "workIn",
        contactId: this.workInDic.contactId,
        customerId: this.workInDic.customerId,
        customerName: this.workInDic.customerName,
        businessId: this.workInDic.id,
        businessTitle:
          this.workInDic.customerName + "-" + this.workInDic.projectName + "进场单",
        businessNo: this.workInDic.businessNo,
        contractNo: this.workInDic.contractNo,
        // flowId:this.workInDic.flowId,
        customerSalesman: this.workInDic.customerSalesman,
        contactName: this.workInDic.contactName,
        customerPhoneNum: this.workInDic.customerPhoneNum,
        orgId: this.workInDic.orgId,
        customerSalesmanPhoneNum: this.workInDic.customerSalesmanPhone,
        customerSalesmanName: this.workInDic.customerSalesmanName,
        phoneNum: this.workInDic.phoneNum,
        customerType: this.workInDic.customerType,
        signFlowTitle: `${this.workInDic.customerName}-${this.workInDic.projectName}`,
      };
    },
  },
  data() {
    return {
      iswf: false,
      components: [],
      firstNode: {},
      workInDic: {},
      limitsDict: {},
      isRemoveRepeat: false,
      isShowNum: false,
      isLiangXu: false,
      isHalf: true,
      showWorkinAssgin: true,
      businessNo: "",
      isRoleBasedScenario: false, // 标记是否为分角色的场景
    };
  },
  onLoad(option) {
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Cxecute,
      "进场管理",
      "进场单详情"
    );
    this.businessNo = option.businessNo ? option.businessNo : "";
    this.getDetailWithNo();
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj3 = resData.find((o) => o.code === "tenant_name");
      if (obj3) {
        this.isLiangXu = obj3.value === "liangXu" ? true : false;
      }
      let obj4 = resData.find((o) => o.code === "half_day_rent");
      if (obj4) {
        this.isHalf = obj4.value === "true" ? true : false;
      }
    }
    uni.getStorage({
      key: this.$savekey.CONFIG_INFO,
      success: (res) => {
        let obj = res.data.find((o) => o.code === "work_in_show_used_num");
        if (obj) {
          this.isShowNum = obj.value === "true" ? true : false;
        }
      },
    });
    uni.$on("esign-start", (obj) => {
      this.getDetailWithNo();
    });
    this.workflowcommon.iswf("workIn").then((iswf) => {
      this.iswf = iswf;
      if (iswf) {
        //有审批流
        this.getDetailWithNo();
      } else {
        this.components = [
          "workinapply",
          "workindispatch",
          "workinassign",
          "workinlogistics",
          "workinlocale",
          "wokinMachineChoose",
          "workinlocale",
        ];
        this.firstNode = {
          formKey: "apply|dispatch|assignee|deliver",
        };
      }
    });
  },
  onShow() {
    this.getDetailWithNo();
    if (this.$refs.timeline) this.$refs.timeline.init();
  },
  onUnload() {
    uni.$off("esign-start");
  },
  async onShareAppMessage({ target, from }) {
    if (from === "button" && target.dataset.type == "esign") {
      let url = target.dataset.url;
      let title = target.dataset.title;
      return {
        title,
        imageUrl:
          "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
        path: `/otherPages/esign/webView?url=${encodeURIComponent(url)}&title=${title}`,
      };
    }
  },
  methods: {
    callPhone(value) {
      console.log(value, "callPhone");
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
    getProcessNode() {
      let vm = this;
      vm.components = [];
      this.workflowcommon.getApplyProcessNode("workIn").then((result) => {
        console.log(result, "getProcessNode");
        if (result && result.length > 0) {
          this.nodeList = [...result];
          this.formKey = result[0].formKey;
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
          if (this.isHaveModel("dispatch")) {
            this.components = [...this.components, "workindispatch"];
          }

          if (this.isHaveModel("deliver")) {
            this.components = [...this.components, "wokinMachineChoose", "workinlocale"];
          }
        }
      });
    },
    // 获取详情
    getDetailWithNo() {
      if (!this.businessNo) {
        return;
      }
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
      };
      let url = this.$url.WORK_IN_DETAIL;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          let isShowMachineFineColumns = false;
          if (result.machines && result.machines.some((item) => item.fileList)) {
            isShowMachineFineColumns = true;
          }
          console.log(result, "WORK_IN_DETAIL");
          this.getonlinelist(result.businessKey);
          this.workInDic = {
            ...result,
            isShowMachineFineColumns,
          };
          this.dealData(this.workInDic);
          this.$forceUpdate();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //数据处理当machine中带有数据
    dealData(dict) {
      console.log(dict);
      let dispatchMachines = JSON.parse(JSON.stringify(dict.orders));
      let machines = dict.machines;
      dispatchMachines.forEach((e) => {
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
          if (o.contractOrderId === id) {
            let dictR = {
              licenseId: o.licenseId || "",
              machineBrand: o.machineBrand || "",
              machineType: o.machineType || "",
              machineTypeName: o.machineTypeName || "",
              printCode: o.printCode || "",
              machineHeight: o.machineHeight || "",
              workCheckResults: o.workCheckResults || "",
              address: o.address || "",
              machineHeightName: o.machineHeightName,
              typeName: o.typeName,
              deliveryPicCount: o.deliveryPicCount,
              fileList: fileList,
              contractMachineTransferInfo: o.contractMachineTransferInfo ? {...o.contractMachineTransferInfo} : null 
            };
            list.push(dictR);
          }
        });
        e.machineList = [...list];
        e.usedNum = e.machineList.length;
      });
      this.workInDic = {
        ...this.workInDic,
        dispatchMachines: dispatchMachines,
      };
      console.log(this.workInDic, "000000000000000000");
      if (this.workInDic.supplementId) {
        this.loadWorkFlow();
      }
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    loadWorkFlow() {
      this.workflowcommon.getApplyAllProcessNode("workIn").then((result) => {
        if (result.length > 0) {
          let fromKeyStr = "";
          result.forEach((o) => {
            fromKeyStr = fromKeyStr + o.formKey;
          });
          if (fromKeyStr.indexOf("assignee") == -1) {
            this.showWorkinAssgin = false; //assignee
          }
        }
      });
    },
    getonlinelist(key) {
      this.workflowcommon.getOnlineList(key).then((result) => {
        console.log(result);
        console.log(result, "getonlinelist");

        let formKey = "";
        if (result.length) {
          let formKeys = result[0].formKey; // 获取第一个元素的 formKey
          if (formKeys) {
            // 检查 formKey 是否存在且非空
            let parts = formKeys.split("|"); // 使用 '|' 分割 formKey 字符串
            if (parts.length > 0 && parts.length < 4) {
              // 检查分割后的数组长度
              // tips:叠山用法,其他地方均不这样使用,只有在分角色,且详情页面下,调用,赋值后优先级高于其他判断条件
              this.isRoleBasedScenario = true; // 符合条件，设置为 true
            }
          }

          for (let i = 0; i < result.length; i++) {
            formKey += result[i].formKey + "|";
          }
        }
        this.firstNode = {
          formKey,
        };
        this.formKey = formKey;
        console.log(this.formKey, "this.formKey");
        if (this.isHaveModel("apply")) {
          this.components = [...this.components, "workinapply"];
        }
        if (this.isHaveModel("logistics")) {
          this.components = [...this.components, "workinlogistics"];
        }
        if (this.isHaveModel("assignee")) {
          this.components = [...this.components, "workinassign"];
        }
        if (this.isHaveModel("dispatch")) {
          this.components = [...this.components, "workindispatch"];
        }

        if (this.isHaveModel("deliver")) {
          this.components = [...this.components, "wokinMachineChoose", "workinlocale"];
        }
        this.limitsDict = workindiffer.getDetailLimitWithArr(result);
        console.log(JSON.stringify(this.limitsDict));
        if (!this.limitsDict.apply) {
          this.limitsDict = {
            apply: true,
            applyEdit: false,
            dispatch: true,
            dispatchEdit: false,
            assignee: true,
            assigneeEdit: false,
            deliver: true,
            deliverEdit: false,
          };
        }
      });
      this.workflowcommon.getApplyProcessNode("workIn").then((result) => {
        let repeatDic = workindiffer.getLimitWithArr(result, "apply");
        this.isRemoveRepeat =
          repeatDic.applyEdit && (repeatDic.deliverEdit ? repeatDic.deliverEdit : false);
      });
    },
    downxlsc(url, headerDic) {
      let customerName = this.workInDic.customerName ? this.workInDic.customerName : "";
      let projectName = this.workInDic.projectName ? this.workInDic.projectName : "";
      console.log(url);
      console.log(projectName);
      console.log(customerName);

      let name = "进场-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downFuncNoHead(url, "GET", undefined, filename);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.bg-view {
  width: 100%;
  background: $uni-bg-color-grey;
  height: 100%;
  @include flex(column);
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

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
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

.img-upload-view {
  ::v-deep.img-upload-title {
    color: #ffffff;
  }
}

.donwload {
  width: 110px;

  display: flex;
  // width: 72px;
  height: 32px;
  border-radius: 6px;
  background: #e60000;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.start {
  display: flex;
  width: 110px;
  height: 32px;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
  background: #e60000;
}

.end {
  display: flex;
  width: 110px;
  height: 32px;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
  background: #dcdfe6;
}

.flow-btns {
  padding: 0 10px;
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0;
  height: 60px;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}
</style>
