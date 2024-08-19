<template>
  <c-form ref="form" :model="model" :rules="rules" class="content">
    <view class="flow-content">
      <slot></slot>
      <view style="height: 70px; width: 100%"></view>
    </view>
    <view class="flow-btns">
      <view class="cancel-btn" @click="clickBack"><text>退回</text></view>
      <slot name="workpreview"></slot>
      <slot name="share"></slot>
      <view class="submit-btn" @click="clickPass"><text>通过</text></view>
    </view>
    <view class="pop-container">
      <uni-popup ref="backTip" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="flow-choose">
            <view class="model-tag"><text>选择退回环节</text></view>
            <view class="processing-staff-item">
              <view class="assign-tag">环节名称</view>
              <view class="assign-container" @click="choosNode">
                <view class="assigners-value">{{
                  selectedNode.name || "请选择..."
                }}</view>
                <i class="iconfont iconarrow-right"></i>
              </view>
            </view>
            <view class="remark-item">
              <view>审批意见</view>
              <view class="remark-text">
                <textarea
                  class="textarea"
                  :placeholder="$t('common.inputTip')"
                  v-model="backInput"
                />
              </view>
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancel('back')">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirm('back')">确定</text>
          </view>
        </view>
      </uni-popup>
      <uni-popup ref="passTip" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="flow-choose">
            <view class="model-tag"><text>选择处理人员</text></view>
            <view class="processing-staff-item">
              <view class="assign-tag">处理人员</view>
              <view class="assign-container" @click="chooseAssign">
                <view class="assigners-value">{{ assignees || "请选择..." }}</view>
                <i class="iconfont iconarrow-right"></i>
              </view>
            </view>
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
            <text class="uni-tip-button pop-cancel" @click="cancel('pass')">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirm('pass')">确定</text>
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
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </c-form>
</template>

<script>
import { debounce } from '@/common/util/util';
import wPicker from "@/components/common/w-picker/w-picker.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
export default {
  name: "ApproveStep",
  components: {
    wPicker,
    uniPopup,
  },
  props: {
    itemData: {
      type: Object,
      default() {
        return {};
      },
    },
    //数据是否可以编辑，是：需要重新校验数据
    NeedUpdate: {
      type: Boolean,
      default: false,
    },
    updateObj: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否直接在具体页面指定审批人员
    needStaff: {
      type: Boolean,
      default: false,
    },
    //具体页面指定审批人员Id
    staffId: {
      type: String,
      default: "",
    },
    orgId: {
      type: String,
      default: "",
    },
    businessOwner: {
      type: String,
      default: "",
    },
    needBackJson: {
      type: Boolean,
      default: false,
    },
    model: Object,
    rules: Object,
  },
  watch: {
    itemData(val) {
      this.getWatchData();
    },
    updateObj(val) {
      if (this.NeedUpdate) {
        val.task = null;
        this.jsonStr = JSON.stringify(val);
      }
    },
  },
  data() {
    return {
      alist: [], //指定的审批人
      selectList: [],
      selectedNode: {},
      assignees: "",
      choosedList: [],
      isNeedAssign: false,
      backInput: "",
      passInput: "",
      jsonStr: "",
      urlapi: "contractapi",
    };
  },
  created() {
    if (this.itemData.businessNo) {
      this.getWatchData();
    }
    console.log(this.itemData, "itemData");
    uni.$on("choosedAssign", (obj) => {
      this.alist = obj.data;
      this.choosedList = [];
      this.alist.forEach((o) => {
        this.choosedList.push(o.username);
      });
      this.assignees = this.choosedList.join(",");
    });
  },
  methods: {
    getWatchData() {
      this.urlapi = this.$datestr.getUrlApi(this.itemData.processKey);
      this.getProcessNode();
      this.loaddata(this.itemData.businessKey);
    },
    loaddata(key) {
      let url = this.$url.DATA_FORM + key;
      let urlstr = url.replace(/xxx/, this.urlapi);
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          this.jsonStr = result;
          this.$emit("data-form", this.jsonStr);
          // setTimeout(() =>{

          // }, 100);
        })
        .catch((err) => {});
    },
    choosNode() {
      this.$refs.selector.show();
    },
    chooseAssign() {
      uni.navigateTo({
        url:
          "/businessPages/workflow/choose-assigner?choosedList=" +
          JSON.stringify(this.alist),
      });
    },
    onConfirm(val) {
      //{"checkArr":{"label":"专票","value":1},"defaultVal":[1],"result":"专票"}
      this.selectedNode = val.checkArr;
    },
    /**
     * 获取第一个节点是否设置的审批人
     */
    getProcessNode() {
      let self = this;
      let urlstr = this.$url.PROCESS_NODE.replace(/xxx/, this.urlapi);
      let param = {
        id: this.itemData.procDefId,
      };
      this.$network
        .getData(urlstr, "GET", param)
        .then((result) => {
          let list = result;
          if (list) {
            let startNode = list.find((o) => o.type === 0);
            if (startNode) {
              let line = list.find((o) => o.source === startNode.id);
              let firstNode = list.find((o) => o.id === line.target);
              console.log(result, "getBackNode");
              this.getBackNode(firstNode);
            }
          }
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.detail[0] ? err.detail[0] : err.message,
          });
        });
    },
    getBackNode(firstNode) {
      let self = this;
      let url = this.$url.BACK_LIST + this.itemData.id;
      let urlstr = url.replace(/xxx/, this.urlapi);
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          this.selectList = result
            ? result.map((o) => {
                return {
                  ...o,
                  value: o.id,
                  label: o.name,
                };
              })
            : [];
          if (firstNode && this.selectList) {
            this.selectList = this.selectList.filter((o) => o.key === firstNode.id);
          }
        })
        .catch((err) => {});
    },
    /**
     * 驳回审批接口
     */
    backTask() {
      if (!this.selectedNode.id) {
        uni.showToast({
          title: "退回节点不能为空",
          icon: "none",
        });
        return;
      }

      let param = {
        backTaskId: this.selectedNode.id,
        comment: this.backInput,
        id: this.itemData.id,
        procInstId: this.selectedNode.procInstId,
      };

      if (!this.needBackJson) {
        uni.showLoading({
          mask: true,
        });
        let url = this.$url.BACK_TASK.replace(/xxx/, this.urlapi);
        this.$network
          .getData(url, "POST", param)
          .then((result) => {
            uni.$emit("refresh-notification-list", {
              type: "wait",
            });
            uni.$emit("refresh-contract-list", {
              type: "wait",
            });
            uni.$emit("refresh-acc-list", {
              type: "workin",
            });
            uni.$emit("refresh-additional-list", {
              type: "workin",
            });
            uni.$emit("refreshData-repair", {
              type: "",
            });
            uni.$emit("refresh-insurance-list", {
              type: "insurance",
            });
            uni.$emit("refreshData-repair");
            uni.$emit("refresh-maintain");
            uni.$emit("refreshData-overhaul");
            uni.$emit("refresh-polling");
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
      } else {
        this.$emit("backTask", { param: param });
      }
    },

    /**
     * 通过审批接口
     */
    passTask() {
      uni.showLoading({
        mask: true,
      });
      let ids = [];
      if (this.needStaff) {
        //在页面指定下个节点审批人
        ids = [this.staffId];
      } else {
        if (this.isNeedAssign) {
          if (this.choosedList.length <= 0) {
            uni.showToast({
              icon: "none",
              title: "请选择处理人员",
            });
            return;
          }
          this.alist.forEach((o) => {
            ids.push(o.id);
          });
        }
      }
      let param = {
        assignees: ids,
        comment: this.passInput,
        json: this.jsonStr,
        procDefId: this.itemData.procDefId,
        procInstId: this.itemData.procInstId,
        taskId: this.itemData.id,
      };
      this.$parent.filterFiles && this.$parent.filterFiles();
      // 初始化按趟计费数据
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
      console.log("param:" + JSON.stringify(param));
      let url = this.$url.PASS_TASK.replace(/xxx/, this.urlapi);
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          uni.$emit("refresh-notification-list", {
            type: "wait",
          });
          uni.$emit("refresh-contract-list", {
            type: "wait",
          });
          uni.$emit("refresh-acc-list", {
            type: "",
          });
          uni.$emit("refresh-additional-list", {
            type: "workin",
          });
          uni.$emit("refreshData-repair", {
            type: "",
          });
          uni.$emit("refresh-insurance-list", {
            type: "insurance",
          });
          uni.$emit("refreshData-repair");
          uni.$emit("refresh-maintain");
          uni.$emit("refreshData-overhaul");
          uni.$emit("refresh-polling");
          uni.$emit("refresh-sublet-list");
          uni.showToast({
            title: "通过成功",
            icon: "none",
          });
          uni.navigateBack({
            delta: 1,
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.detail ? err.detail[0] : err.message,
          });
        });
    },
    /**
     * 获取第一个节点是否设置的审批人
     */
    getNextNodeUser() {
      let urlstr = this.$url.NEXT_NODE_USER.replace(/xxx/, this.urlapi);
      let param = {
        procInstId: this.itemData.procInstId,
      };
      if (this.businessOwner) {
        param = {
          ...param,
          businessOwner: this.businessOwner,
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
          this.isNeedAssign = !result || result.length <= 0;
          if (this.isNeedAssign) {
            this.$refs.passTip.open();
          } else {
            //提交
            this.$refs.submitTip.open();
            // this.passTask();
          }
        })
        .catch((err) => {});
    },
    cancel(type) {
      switch (type) {
        case "back": //退回
          this.$refs.backTip.close();
          break;
        case "pass": //通过
          this.$refs.passTip.close();
          break;
        default:
          break;
      }
    },
    confirm:debounce(function(type) {
      switch (type) {
        case "back": //退回
          this.$refs.backTip.close();
          this.backTask();
          break;
        case "pass": //通过
          this.$refs.passTip.close();
          this.passTask();
          break;
        default:
          break;
      }
    },300),
    submitcancel() {
      this.$refs.submitTip.close();
    },
    submitconfirm:debounce(function(type) {
      this.$refs.submitTip.close();
      setTimeout(() => {
        uni.showLoading({
          mask: true,
        });
        this.passTask();
      }, 50);
    },300),
    validate() {
      let validatePromise;
      if (this.model && this.rules) {
        validatePromise = validatePromise = this.$refs.form.validate();
      } else {
        validatePromise = this.$parent.checkData();
      }
      return validatePromise;
    },
    /**
     * 提交申请
     */
    clickPass:debounce(function () {
      if (this.needStaff) {
        //是否在具体页面指定了审批人
        if (!this.NeedUpdate) {
          this.passTask()();
        } else {
          //父组件开启校验时，校验方法名一定要为checkData()
          this.$parent
            .checkData()
            .then((res) => {
              this.passTask();
            })
            .catch((e) => {
              console.info(e);
            });
        }
      } else {
        if (!this.NeedUpdate) {
          this.getNextNodeUser();
        } else {
          //父组件开启校验时，校验方法名一定要为checkData()
          this.validate()
            .then((res) => {
              this.getNextNodeUser();
            })
            .catch((e) => {
              console.info(e);
            });
        }
      }
      // if (!this.NeedUpdate) {
      // 	this.getNextNodeUser();
      // } else { //父组件开启校验时，校验方法名一定要为checkData()
      // 	this.$parent.checkData().then(res => {
      // 		this.getNextNodeUser();
      // 	}).catch(e => {
      // 		console.info(e)
      // 	})
      // }
    },300),
    /**
     * 退回
     */
    clickBack() {
      this.$refs.backTip.open();
    },
  },
};
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
  overflow: scroll;
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

.flow-btns {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  padding-bottom: calc(env(safe-area-inset-bottom) - 10px);
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 998;
}

.cancel-btn {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: #dcdfe6;
  font-size: $uni-font-size-lg;
  color: $uni-bg-color-grey;
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
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}
</style>
