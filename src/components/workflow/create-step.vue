<template>
  <c-form ref="form" :model="model" :rules="rules" class="content">
    <view class="flow-content">
      <slot></slot>
      <view
        style="
          height: 70px;
          width: 100%;
          padding-bottom: calc(env(safe-area-inset-bottom) - 10px);
        "
      ></view>
    </view>
    <view :class="btnStyle">
      <slot name="total"></slot>
      <view class="cancel-btn btn" @click="clickCancle" v-if="!isContract"
        ><text>取消</text></view
      >
      <slot name="workpreview"></slot>
      <slot name="share"></slot>
      <view class="btn" @click="save" v-if="isContract"><text></text></view>

      <slot name="preview"></slot>
      <view class="submit-btn cancel-btn btn" @click="clickSubmit"
        ><text>提交</text></view
      >
    </view>
    <view class="pop-container">
      <uni-popup ref="passTip" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="flow-choose">
            <view class="model-tag"><text>选择处理人员</text></view>
            <view class="processing-staff-item">
              <view class="assign-tag"
                >处理人员<text v-if="require" style="color: #ff0000">*</text></view
              >
              <view class="assign-container" @click="chooseAssign">
                <view class="assigners-value">{{ assignees || "请选择..." }}</view>
                <i class="iconfont iconarrow-right"></i>
              </view>
            </view>
            <view class="remark-item">
              <view>审批意见</view>
              <view class="remark-text">
                <textarea :placeholder="$t('common.inputTip')" v-model="passInput" />
              </view>
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancel()">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirm()">确定</text>
          </view>
        </view>
      </uni-popup>
      <uni-popup ref="submitTip" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="flow-choose">
            <view class="remark-item">
              <view>审批意见</view>
              <view class="remark-text">
                <textarea
                  class="textarea"
                  :placeholder="$t('common.inputTip')"
                  v-model="passInput"
                />
              </view>
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="submitcancel()">取消</text>
            <text class="uni-tip-button pop-confirm" @click="submitconfirm()">确定</text>
          </view>
        </view>
      </uni-popup>
    </view>
  </c-form>
</template>

<script>
import { debounce } from '@/common/util/util';
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
export default {
  name: "CreateStep",
  components: {
    uniPopup,
  },
  props: {
    require: {
      type: Boolean,
      default: false,
    },
    //业务名称
    processKey: {
      type: String,
      default: "",
    },
    controllWf: {
      //外部控制是否走工作流
      type: Boolean,
      default: true,
    },
    condition: {
      type: String,
      default: "",
    },
    orgId: {
      type: String,
      default: "",
    },
    //被退回、撤回是传入的item
    itemData: {
      type: Object,
      default() {
        return null;
      },
    },
    //是否是修改状态
    isUpdate: {
      type: Boolean,
      default: false,
    },
    //需要提交的对象
    updateObj: {
      type: Object,
      default() {
        return {};
      },
    },
    businessOwner: {
      type: String,
      default: "",
    },
    btnStyle: {
      type: String,
      default: "flow-btns",
    },
    model: Object,
    rules: Object,
    isContract: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    itemData(val) {
      this.getFormData(val.businessKey);
    },
    updateObj(val) {
      console.log(val, "updateObj");
      if (this.itemData) {
        this.jsonStr = JSON.stringify(val);
      }
    },
  },
  data() {
    return {
      assignees: "",
      isShowAssignView: true,
      choosedList: [],
      alist: [],
      wf: true, //是否走工作流
      jsonStr: "",
      //意见建议
      passInput: "",
    };
  },
  created() {
    uni.$on("choosedAssign", (obj) => {
      this.alist = obj.data;
      this.choosedList = [];
      this.alist.forEach((o) => {
        this.choosedList.push(o.username);
      });
      this.assignees = this.choosedList.join(",");
    });
    this.workflowcommon.iswf(this.processKey).then((iswf) => {
      this.wf = iswf;
      console.log(
        this.processKey,
        this.wf,
        "-----------------------------this.processKey"
      );
    });
    if (this.itemData) {
      this.getFormData(this.itemData.businessKey);
    }
    if (this.itemData) {
      this.jsonStr = JSON.stringify(this.updateObj);
    }
  },
  mounted() {
    console.log(this.btnStyle, "btnStyle");
  },
  methods: {
    chooseAssign() {
      uni.navigateTo({
        url:
          "/businessPages/workflow/choose-assigner?choosedList=" +
          JSON.stringify(this.alist),
      });
    },
    getFormData(key) {
      let url = this.$url.DATA_FORM + key;
      let urlstr = url.replace(
        /xxx/,
        this.$datestr.getUrlApi(
          this.itemData.processKey ? this.itemData.processKey : this.processKey
        )
      );
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          this.jsonStr = result;
          this.$emit("data-form", this.jsonStr);
        })
        .catch((err) => {});
    },
    /**
     * 获取第一个节点是否设置的审批人
     */
    getFirstNodeUser() {
      uni.showLoading({
        mask: true,
      });
      let urlstr = this.$url.FIRST_NODE_USER.replace(
        /xxx/,
        this.$datestr.getUrlApi(this.processKey)
      );
      let param = {
        processKey: this.processKey,
        businessOwner: this.businessOwner || this.updateObj.customerSalesman,
      };
      // if (this.businessOwner) {
      //   param = {
      //     ...param,
      //     businessOwner: this.businessOwner,
      //   };
      // }
      if (this.condition) {
        param = {
          ...param,
          conditionKey: "logisticsType",
          conditionValue: this.condition,
        };
      }
      if (this.orgId) {
        param = {
          ...param,
          orgId: this.orgId,
        };
      }
      this.$network
        .getData(urlstr, "GET", param)
        .then((result) => {
          this.isShowAssignView = result.length <= 0;
          console.log(result, "result");
          uni.hideLoading();
          setTimeout(() => {
            if (this.isShowAssignView) {
              this.$refs.passTip.open();
            } else {
              if (this.itemData && !this.isUpdate) {
                this.$refs.submitTip.open();
              } else {
                this.submitData();
              }
              // this.submitData();
            }
          }, 100);
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.detail[0] ? err.detail[0] : err.message,
          });
        });
    },
    submitData() {
      let queryStr = "?wf=true";
      let idStr = "";
      let ids = [];

      if (this.isShowAssignView) {
        this.alist.forEach((o) => {
          ids.push(o.id);
        });

        idStr = ids.join(",");
        queryStr += "&assignees=" + idStr;
      }
      if (this.require && ids.length == 0 && this.isShowAssignView) {
        uni.showToast({
          icon: "none",
          title: "处理人员不能为空",
          duration: 2000,
        });
        return;
      }
      if (this.itemData) {
        if (this.isUpdate) {
          this.$emit("submitApply", queryStr);
        } else {
          this.passTask(ids);
        }
      } else {
        this.$emit("submitApply", queryStr);
      }
    },
    /**
     * 通过审批接口
     */
    passTask(ids) {
      let param = {
        assignees: ids,
        comment: this.passInput,
        json: this.jsonStr,
        procDefId: this.itemData.procDefId,
        procInstId: this.itemData.procInstId,
        taskId: this.itemData.id,
      };
      // 审批撤回按趟计费时修改
      let info = JSON.parse(this.jsonStr)
      if(info.contractDetailDto && 
      info.contractDetailDto.orderList && 
      info.contractDetailDto.tripCalType=='1'){
        info.contractDetailDto.orderList = info.contractDetailDto.orderList.map(item=>{
          return {
            ...item,
            carriage:0,
            carriageType:"1"
          }
        })
        param.json = JSON.stringify(info)
      }
      console.log('info',info)
      console.log("param:" + JSON.stringify(param));
      let url = this.$url.PASS_TASK.replace(
        /xxx/,
        this.$datestr.getUrlApi(
          this.itemData.processKey ? this.itemData.processKey : this.processKey
        )
      );
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          uni.$emit("refresh-notification-list", {
            type: "wait",
          });
          uni.$emit("refresh-contract-list", {
            type: "workin",
          });
          uni.$emit("refresh-acc-list", {
            type: "",
          });
          uni.$emit("refresh-additional-list", {
            type: "workin",
          });
          uni.$emit("refresh-insurance-list", {
            type: "insurance",
          });
          uni.$emit("refreshData-repair");
          uni.$emit("refresh-maintain");
          uni.$emit("refreshData-overhaul");
          uni.$emit("refresh-polling");
          uni.showToast({
            title: "提交成功",
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
    async validate() {
      let validatePromise;
      if (this.model && this.rules) {
        validatePromise = this.$refs.form
          .validate()
          .then((err) => {
            if (err) {
              throw err;
            }
          })
      } else {
        validatePromise = this.$parent.checkData && (await this.$parent.checkData());
        // #ifdef H5
        let cd = findCheckData(this.$parent);
        validatePromise = cd && cd();
        // #endif
      }
      return validatePromise;
    },
    /**
     * 提交申请
     */
    clickSubmit:debounce(async function() {
      if (this.$parent.preWFSubmit) {
        let res = await this.$parent.preWFSubmit();
        console.log(res, "clickSubmit");
        if (!res) return;
      }
      this.validate()
        .then((res) => {
          if (this.controllWf && this.wf) {
            if (this.isUpdate) {
              console.log("isUpdate");
              this.$emit("submitApply", "");
            } else {
              this.getFirstNodeUser();
            }
          } else {
            if (this.itemData) {
              //状态3是撤回
              if (this.isUpdate) {
                console.log("isUpdate");
                this.$emit("submitApply", "");
              } else {
                this.$refs.submitTip.open();
                // 	this.passTask([]);
              }
            } else {
              this.$emit("submitApply", "");
            }
          }
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            uni.showToast({ title: errors[0].message, icon: "none" });
          }
        });
    }),

    preview() {
      this.validate()
        .then((res) => {
          this.$emit("preview", "");
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            uni.showToast({ title: errors[0].message, icon: "none" });
          }
        });
    },

    /**
     * 取消
     */

    clickCancle() {
      uni.navigateBack();
    },

    save() {
      this.$emit("onNavBarButtonTap");
    },

    cancel() {
      this.$refs.passTip.close();
    },

    confirm:debounce(function(type) {
      if (this.choosedList.length <= 0) {
        uni.showToast({
          icon: "none",
          title: "请选择处理人员",
        });
        return;
      }
      this.$refs.passTip.close();
      this.submitData();
    }),
    submitcancel() {
      this.$refs.submitTip.close();
    },
    submitconfirm:debounce(function (type) {
      this.$refs.submitTip.close();
      this.submitData();
    }),
  },
};
function findCheckData(vm) {
  if (!vm) return null;
  if (vm.checkData) return vm.checkData;
  return findCheckData(vm.$parent);
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.flow-content {
  margin-bottom: 68px;
}

.pop-container {
  position: relative;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}

.flow-choose {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 4px;
}

.model-tag {
  display: flex;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-weight: bold;
  font-size: $uni-font-size-base;
  align-items: center;
}

.processing-staff-item {
  padding: 10px 0px;
  margin: 0px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.assign-tag {
  width: 72px;
  min-width: 72px;
}

.assign-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.remark-item {
  padding: 10px 0px;
  margin: 0px 10px;
  display: flex;
  flex-direction: column;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.textarea {
  background-color: #fbfbfb;
  border-radius: 4px;
  width: calc(100% - 32px);
  height: 72px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  margin-top: 8px;
  padding: 8px;
}

.flow-btns {
  padding: 0 10px;
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0;
  height: 60px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 998;
  padding-bottom: calc(env(safe-area-inset-bottom) - 10px);
}

.cancel-btn {
  display: flex;
  height: 32px;
  background: #fe931f;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
}

.submit-btn {
  display: flex;
  height: 32px;
  border-radius: 6px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  width: 72px !important;
}

.btn {
  flex: 1;
  margin: 0 10rpx;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;

  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}

.workout {
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
  z-index: 1001;
  padding-bottom: calc(env(safe-area-inset-bottom) - 10px);

  .cancel-btn {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 20px;
    background: #dcdfe6;
    font-size: 16px;
    color: #fff;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    margin-left: 10px;
  }

  .submit-btn {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 20px;
    background: #e60000;
    font-size: 16px;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
  }
}
</style>
