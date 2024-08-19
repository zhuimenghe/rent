<template>
  <view class="content">
    <!-- 退场详情 -->
    <c-nav-bar-apply :business-key="businessKey">退场详情</c-nav-bar-apply>
    <create-workout
      ref="workout"
      class="flex-scroll-wrapper"
      :isDetail="isDetail"
      :isApproval="false"
      :isEdit="false"
      :isFrist="false"
      :previewBtn="true"
      :nodeList="nodeList"
      :initial-workout-dic="workoutDic"
      :showWorkOutAssgin="showWorkOutAssgin"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import createWorkout from "./create-workout.vue";
import { processFileDesc } from "@/common/business-method/common-method/util.js";
export default {
  components: {
    createWorkout,
  },
  data() {
    return {
      isDetail: true,
      businessNo: "",
      nodeList: [],
      businessKey: "",
      workoutDic: {},
      showWorkOutAssgin: true,
    };
  },
  watch: {},
  onLoad(option) {
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Cxecute,
      "退场管理",
      "退场单详情"
    );
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isLiangXu = obj.value === "liangXu" ? true : false;
      }
    }
    this.businessNo = option.businessNo;
    this.getWorkOutDetail();
    uni.$on("esign-start", (obj) => {
      this.getWorkOutDetail();
    });
  },
  onUnload() {
    uni.$off("esign-start");
  },
  onShow() {
    this.$refs.workout.initTimeline();
    this.getWorkOutDetail();
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
    getApproveData(businessKey) {
      //审批流
      this.workflowcommon.getOnlineList(businessKey).then((result) => {
        console.log(result);
        if (result && result.length === 1) {
          //只有一条说明被驳回过，只显示上次申请的数据
          this.nodeList = result;
        } else {
          this.nodeList = result
            ? result.filter((o) => {
                return o.endTime && o.type === "completed";
              })
            : [];
        }
      });
    },
    //合同详情
    getWorkOutDetail() {
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
      };
      let url = this.$url.WORK_OUT_DETAIL;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          let isShowMachineFineColumns = false;
          this.businessKey = result.businessKey;
          console.log(result, "WORK_OUT_DETAIL");
          if (result.machines && result.machines.some((item) => item.fileList)) {
            isShowMachineFineColumns = true;
          }
          setTimeout(() => {
            // TODO-WORKOUT【DO】：需要修改的位置
            let workoutDic = { ...result };
            // this.$refs.workout.setWorkDic({ ...result });
            workoutDic.machines = (workoutDic.machines || []).map((machine) => ({
              ...machine,
              fileList: (machine.fileList || []).map((file) => ({
                ...file,
                ...processFileDesc(file.fileDesc),
              })),
            }));
            this.workoutDic = { ...workoutDic };
            if (!result.supplementId) {
              //非补录
              this.getApproveData(result.businessKey);
            } else {
              this.loadWorkFlow();
            }
          }, 100);

          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    loadWorkFlow() {
      this.workflowcommon.getApplyAllProcessNode("workOut").then((result) => {
        if (result.length > 0) {
          let fromKeyStr = "";
          result.forEach((o) => {
            fromKeyStr = fromKeyStr + o.formKey;
          });
          if (fromKeyStr.indexOf("assignee") == -1) {
            this.showWorkOutAssgin = false; //assignee
          }
        }
      });
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

.model-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px;
  background: #ffffff;
  border-radius: 4px;
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
  padding: 15px;
  align-items: center;
  font-weight: bold;
}

.sub-model-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 10px 15px;
  align-items: center;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 15px;
  margin-right: 15px;
  height: 45px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-section-view {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: flex-start;
}

.cell-section-view-width {
  display: flex;
  flex: 1;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-section-view-width-2 {
  display: flex;
  flex: 2;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-view {
  font-size: $uni-font-size-sm;
  color: $uni-text-color;
}

::v-deep .img-upload-view,
::v-deep .img-bg-view {
  background: #fff !important;
}

::v-deep.contractHead {
  margin-top: -8px !important;
}

::v-deep.com-nav-bar-inner-header {
  background-color: #fff;
}
</style>
