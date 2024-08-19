<template>
  <view class="content">
    <c-nav-bar-apply :business-key="expenseDic.businessKey">附加合同详情</c-nav-bar-apply>
    <view class="change-bg">
      <view class="change-no-container">
        <text class="change-no">追加编号：{{ expenseDic.businessNo || "--" }}</text>
      </view>
      <view>
        <contractDetailHead :baseInfo="contractDic" :showDetail="showDetail" :isEnableESigin="isEnableESigin"
          :flowId="expenseDic.signFlowId ? true : false" :haveEsgin="true" @goToESign="goToESign" />


        <!--设备信息-->
        <view class="device-container">
          <view class="model-tag">设备信息</view>
          <view class="device-item-container model-content" style="border-color:#E60000"
            v-for="(item, i) in expenseDic.orderList" :key="i">
            <view class="row-line">
              <view class="d-title">{{ item.typeName }}-{{ item.heightName || "" }}</view>
              <view class="update-tag-new">新增</view>
            </view>
            <view class="sub-text">{{ item.machineTypeName || "--" }}</view>
            <view class="d-info">
              <view class="info-cell">
                <view class="info-cell-key">数量</view>
                <view class="info-cell-value">
                  <input v-model="item.orderNum" type="number" :disabled="true" />
                </view>
              </view>
              <view class="info-cell"
                v-if="item.settlementType == 3 || item.settlementType == 2 || item.settlementType == 1 || item.settlementType == '4'">
                <view class="info-cell-key">{{ item.settlementType == 2 || item.settlementType == 3 ? '月租金(元/台)' :
                  '日租金(元/台)' }}
                </view>
                <view class="info-cell-value">
                  <input v-model="item.hire" type="digit" :disabled="true" />
                </view>
              </view>
              <view class="info-cell" v-if="item.settlementType == '4'
                ">
                <view class="info-cell-key">月租金(元/台)</view>
                <view class="info-cell-value">
                  <input v-model="item.hireMonthly" type="digit" :disabled="true" />
                </view>
              </view>
              <view class="info-cell">
                <view class="info-cell-key">押金(元/台)</view>
                <view class="info-cell-value">
                  <!-- <input v-model="item.pledge" type="digit" :disabled="true" /> -->
                  <text>{{ item.pledge || '0' }}</text>
                </view>
              </view>
              <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                <view class="info-cell-key">运费(元/台)</view>
                <view class="info-cell-value">
                  <!-- <input
                    v-model="item.carriage"
                    type="digit"
                    :disabled="true"
                  /> -->
                  <text>{{ item.carriage || '0' }}</text>

                </view>
              </view>
              <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                <view class="info-cell-key">运费类型</view>
                <view class="info-cell-value">
                  <label-arrow :value="item.carriageTypeName" textColor="#333333" :disabled="true"></label-arrow>
                </view>
              </view>
              <view class="info-cell" v-if="isShowDefault">
                <view class="info-cell-key">预计进场时间</view>
                <view class="info-cell-value">
                  <label-arrow :value="getDate(item.beginDate)" textColor="#333333" :disabled="true"></label-arrow>
                </view>
              </view>
              <view class="info-cell" v-if="isShowDefault">
                <view class="info-cell-key">预计租期</view>
                <view class="info-cell-value">{{ getTenancyFn(item) || "--" }}</view>
              </view>
              <view class="info-cell" v-if="isShowDefault">
                <view class="info-cell-key">预计退场时间</view>
                <view class="info-cell-value">
                  <label-arrow :value="getDate(item.endDate) || '--'" textColor="#333333" :disabled="true"></label-arrow>
                </view>
              </view>
              <view class="info-cell">
                <view class="info-cell-key">指定设备</view>
                <view class="info-cell-value">
                  <label-arrow :value="getMachineNum(item)" textColor="#333333"
                    @clickLabel="showAssignPop(item, i)"></label-arrow>
                </view>
              </view>
            </view>
          </view>
          <view class="total-view">本次追加预收合计：{{ total || 0 }}</view>
        </view>
        <view>
          <view class="model-tag space-between" @click="isExpend = !isExpend">
            <text>原合同订单</text>
            <i class="iconfont iconarrow-right" :id="isExpend ? 'translate-arrow' : 'translate-arrow-expend'"></i>
          </view>
          <view v-if="isExpend">
            <view class="device-item-container model-content" v-for="(item, i) in contractDic.contractDetailDto.orderList"
              :key="i">
              <view class="row-line">
                <view class="d-title">{{ item.typeName }}-{{ item.heightName || "" }}</view>
              </view>
              <view class="sub-text">{{ item.machineTypeName }}</view>
              <view class="d-info">
                <view class="info-cell">
                  <view class="info-cell-key">数量</view>
                  <view class="info-cell-value">
                    <input v-model="item.orderNum" type="number" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell"
                  v-if="item.settlementType == 1 || item.settlementType == 4 || item.settlementType == 2 || item.settlementType == 3">
                  <view class="info-cell-key">{{ item.settlementType == '2' || item.settlementType ==
                    '3' ? '月租金(元/台)' : '日租金(元/台)' }}</view>
                  <view class="info-cell-value">
                    <input v-model="item.hire" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell" v-if="item.settlementType == '4'
                  ">
                  <view class="info-cell-key">月租金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.hireMonthly" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">押金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.pledge" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.carriage" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费类型</view>
                  <view class="info-cell-value">
                    <label-arrow :value="item.carriageTypeName" textColor="#333333" :disabled="true"></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计进场时间</view>
                  <view class="info-cell-value">
                    <label-arrow :value="getDate(item.beginDate)" textColor="#333333" :disabled="true"></label-arrow>
                  </view>
                </view>

                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计租期</view>
                  <view class="info-cell-value">{{ getTenancyFn(item) }}</view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计退场时间</view>
                  <view class="info-cell-value">
                    <label-arrow :value="getDate(item.endDate) || '--'" textColor="#333333"
                      :disabled="true"></label-arrow>
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">指定设备</view>
                  <view class="info-cell-value">
                    <label-arrow :value="getMachineNum(item)" textColor="#333333"
                      @clickLabel="showAssignPop(item, i, false)"></label-arrow>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 其他信息-->
        <view class="base-container">
          <view class="model-tag">其他信息</view>
          <view class="model-content">
            <selectLabelItem tagName="运费减免约定" :isRequired="false" :value="expenseDic.renterTripTypeName || '-'"
              :isSelect="false" />
            <text-label-item tagName="备注" :inputDisabled="true" :inputValue="expenseDic.remark || ''" />
            <imgupload :imgFinishlist="expenseDic.fileList" :isupload="false" />
          </view>
        </view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import {
  differenceInDays,
} from "date-fns";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import calRent from "@/common/util/cal-rent-money.js";
import hoursUtil from "@/common/util/day-working-hours.js";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import contractDetailHead from "@/contractPages/contract/detail/contract-detail-head.vue";
export default {
  components: {
    labelArrow,
    selectLabelItem,
    textLabelItem,
    imgupload,
    wPicker,
    createStep,
    labelPhone,
    contractDetailHead,
  },
  data() {
    return {
      righticon: "iconarrow-right",
      total: 0,
      businessKey: "",
      contractDic: {
        contractDetailDto: {
          orderList: [],
        },
      },
      expenseDic: {
        orderList: [],
      },
      isExpend: false,
      isShowDefault: true,
      isEnableESigin: false,
      eSignConfig: null,
      isAddESign: false,
      showDetail: false,
    };
  },
  onShow() {
  },
  async onLoad(option) {
    console.log(option, "option");
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Administrative,
      "附加合同",
      "合同附加详情"
    );
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      this.eSignConfig = resData.find((o) => o.code === "esign_start_node");
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowDefault = obj.value === "liangXu" ? false : true;
      }
    }
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.isAddESign = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_PLUS_ESIGN_ADD
      );
    }
    this.businessKey = option.businessKey;
    if (!this.businessKey) {
      await this.getPlusContractInfo(option.plusContractId);
      await this.getContractDetail(option.contractNo);
    } else {
      this.getExpenseDetail();
    }
    uni.$on("esign-start", async (obj) => {
      if (!this.businessKey) {
        await this.getPlusContractInfo(option.plusContractId);
        await this.getContractDetail(option.contractNo);
      } else {
        this.getExpenseDetail();
      }
    });
  },
  methods: {
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      let day = differenceInDays(new Date(row.endDate), new Date(row.beginDate)) + 1;
      return day + '天';
    },
    getMachineTypes(names) {
      return names.join(",");
    },
    /**
     * 获取指定设备的数量，直接在value赋值，页面刷新有问题
     * @param {Object} item
     */
    getMachineNum(item) {
      return item.machineList ? item.machineList.length : 0;
    },
    // 获取附加合同设备信息
    async getPlusContractInfo(id) {
      let res = await this.$network.contractPlusGetByInfo(id);
      this.expenseDic = res || {};
      console.log(res, 'this.expenseDic');
      this.expenseDic.orderList = res.orderList || [];
      console.log(this.expenseDic, 'this.expenseDic');
      this.total = this.expenseDic.orderList.reduce((x, y) => {
        return x + Number(y.total);
      }, 0);
      this.total = this.total.toFixed(2);
      this.isEnableESigin = this.isStartESignAdd(
        this.expenseDic.flowStatus,
        this.expenseDic.state,
        this.eSignConfig
      );
    },
    /**
     * 获取合同详情
     */
    getContractDetail(contractNo) {
      uni.showLoading();
      this.$network
        .getData(
          this.$url.CONTRACT_DEATIL_BY_NO + "?businessNo=" + contractNo,
          "GET",
          null
        )
        .then((result) => {
          uni.hideLoading();
          this.contractDic = result;
          this.contractDic = {
            ...result,
            contractId: result.id,
            contractDetailId: result.contractDetailDto.id,
            contractDetailDto: {
              ...result.contractDetailDto,
              orderList: result.contractDetailDto.orderList,
            },
          };
          this.getFilterOrder();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getFilterOrder() {
      if (
        this.contractDic.contractDetailDto.orderList.length > 0 &&
        this.expenseDic.orderList.length > 0
      ) {
        this.contractDic.contractDetailDto.orderList =
          this.contractDic.contractDetailDto.orderList.filter((o) => {
            return !this.expenseDic.orderList.some((y) => y.id === o.id);
          });
      }
    },
    getDate(time) {
      if (!time) return null;
      return time.split(/\s+/)[0];
    },
    goToAssgined(item) {
      if (this.getMachineNum(item) > 0) {
        uni.navigateTo({
          url:
            "/contractPages/contract/assigned-vehicle?machineList=" +
            encodeURIComponent(JSON.stringify(item.machineList)),
        });
      }
    },
    loaddata(key) {
      this.$datestr.printlog(this.urlapi);
      let url = this.$url.DATA_FORM + key;
      let urlstr = url.replace(/xxx/, this.urlapi);
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          this.$datestr.printlog(result);
          this.jsonStr = result;
          this.$emit("data-form", this.jsonStr);
        })
        .catch((err) => { });
    },
    getExpenseDetail() {
        uni.showLoading();
        let url = this.$url.DATA_FORM + this.businessKey;
        let urlstr = url.replace(/xxx/, "contractapi");
        this.$network
          .getData(urlstr, "GET", null)
          .then((result) => {
            uni.hideLoading();
            this.expenseDic = JSON.parse(result);
            console.log(result, 'result');
            this.expenseDic.orderList = this.expenseDic.orderList || [];
            this.total = this.expenseDic.orderList.reduce((x, y) => {
              return x + Number(y.total);
            }, 0);
            this.total = this.total.toFixed(2);
            this.showDetail = this.expenseDic.signFlowId ? true : false;
            this.isEnableESigin = this.isStartESignAdd(
              this.expenseDic.flowStatus,
              this.expenseDic.state,
              this.eSignConfig
            );

            this.getContractDetail(this.expenseDic.contractNo);
          })
          .catch((err) => {
            uni.hideLoading();
          });
    },
    /**
     * 是否可以启动电签
     * @param {Object} signStatus ：电签状态
     * @param {Object} state 合同状态
     * @param {Object} eSignConfig 电签配置
     */
    isStartESignAdd(signStatus, state, eSignConfig) {
      if (
        this.isAddESign &&
        (!signStatus ||
          // signStatus == '0' ||
          signStatus == "3" ||
          signStatus == "5" ||
          signStatus == "7")
      ) {
        let eSignStartNode =
          eSignConfig && eSignConfig.value ? eSignConfig.value : null;
        // 1. adopt 合同审批通过后启动。    2.  apply 合同申请后即可启动。
        if (!eSignStartNode || eSignStartNode == "adopt") {
          //审批完成
          return state != "1" && state != "0" ? true : false;
        } else if (eSignStartNode == "apply") {
          return true;
        }
        return false;
      }
      return false;
    },
    goToESign(type) {
      switch (type) {
        case "start":
          let tenantObj = uni.getStorageSync(this.$savekey.TENANT_DETAIL);
          if (!tenantObj || !tenantObj.esignId) {
            uni.showToast({
              icon: "none",
              title: "当前租户还未开通电签平台，请开通后再配置",
            });
            return;
          }
          this.$gxfmethod.statisticData(
            this.$eventId.Esign_Administrative,
            "启动电签",
            "附加合同启动电签"
          );
          uni.navigateTo({
            url:
              "/otherPages/esign/esign-start-process?isStart=true&businessType=contractPlus" +
              "&customerId=" +
              this.contractDic.customerId +
              "&customerName=" +
              this.contractDic.customerName +
              "&customerType=" +
              this.contractDic.customerType +
              "&contactId=" +
              this.contractDic.contractDetailDto.contactId +
              "&businessId=" +
              this.expenseDic.id +
              "&businessTitle=" +
              (this.contractDic.customerName +
                "-" +
                this.contractDic.contractDetailDto.projectName) +
              "&businessNo=" +
              this.expenseDic.businessNo +
              "&contractNo=" +
              this.expenseDic.businessNo +
              "&flowId=" +
              this.expenseDic.flowId +
              "&customerSalesman=" +
              this.contractDic.contractDetailDto.customerSalesman +
              "&customerSalesmanName=" +
              this.contractDic.contractDetailDto.customerSalesmanName +
              "&customerSalesmanPhoneNum=" +
              this.contractDic.customerSalesmanPhoneNum +
              "&orgId=" +
              this.contractDic.orgId +
              "&contactName=" +
              this.contractDic.contractDetailDto.contactName +
              "&customerPhoneNum=" +
              this.contractDic.customerPhoneNum +
              "&phoneNum=" +
              this.contractDic.contractDetailDto.phoneNum +
              "&signFlowTitle=" +
              `${this.contractDic.customerName}-${this.contractDic.contractDetailDto.projectName}`,
          });
          // uni.navigateTo({
          // 	url: '/otherPages/esign/esign-start-process?isStart=true&businessType=contractPlus' +
          // 		"&customerId=" + this.contractDic.customerId +
          // 		"&customerName=" + this.contractDic.customerName +
          // 		"&customerType=" + this.contractDic.customerType +
          // 		"&contactId=" + this.contractDic.contractDetailDto.contactId +
          // 		'&businessId=' + this.expenseDic.id +
          // 		'&businessTitle=' + (this.contractDic.customerName + '-' + this.contractDic.contractDetailDto.projectName) +
          // 		'&businessNo=' + this.expenseDic.businessNo +
          // 		'&flowId=' + this.expenseDic.flowId +
          // 		'&customerSalesman=' + this.contractDic.contractDetailDto.customerSalesman +
          // 		'&customerSalesmanName=' + this.contractDic.contractDetailDto.customerSalesmanName

          // })
          break;
        case "detail":
          let url = this.$url.esignRecordInfo;
          let param = {
            urlType: 1,
          };
          url = url.replace("{id}", this.expenseDic.signFlowId);
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              uni.navigateTo({
                url: `/otherPages/esign/webView?url=${encodeURIComponent(
                  res
                )}&title=${this.expenseDic.customerName}-${this.expenseDic.projectName
                  }`,
              });
            })
            .catch((err) => { });
          break;
        default:
          break;
      }
    },
    //去指定设备
    showAssignPop(item, i) {
      //不可编辑情况下，，跳详情
      if (item.machineList && item.machineList.length > 0) {
        uni.navigateTo({
          url:
            "/contractPages/contract/assigned-vehicle?machineList=" +
            encodeURIComponent(JSON.stringify(item.machineList)),
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.change-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.change-no-container {
  margin: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.change-no {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
}

.change-btn {
  color: $uni-color-primary;
  font-size: $uni-font-size-sm;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 4px;
}

// 详情头container 蓝色模块
.contract-info-conntainer {
  background: linear-gradient(to bottom right, #5b7bec, #6c8cff);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  padding: 8px;
  margin: 8px 8px 16px 8px;
  border-radius: 4px;
}

.base-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.base-top-left {
  flex: 3;
}

.base-top-right {
  flex: 2;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  font-size: $uni-font-size-base;
}

//合同信息第一行 （标题）
.contract-tite {
  font-size: $uni-font-size-base;
  font-weight: bold;
}

//合同信息第二行 业务单号
.contract-business-no {
  font-size: $uni-font-size-sm;
  margin-top: 4px;
}

//合同信息第三行 合同类型
.contract-type {
  font-size: $uni-font-size-sm;
  margin-top: 8px;
  padding: 2px 8px;
  border-radius: 8px;
  background-color: #4a63be;
}

//第四行 客戶相關信息
.customer-info {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: space-between;
  align-items: center;
}

//第四行 客戶相關信息
.customer-info-left {
  display: flex;
  flex-direction: row;
}

.contract-region-container,
.contract-contact-container {
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-sm;
}

.contract-region,
.contract-contact {
  display: flex;
  flex-direction: row;
  margin-top: 4px;
}

.v-line {
  background-color: #ffffff;
  margin: 8px 16px;
  width: 1rpx;
}

.change-customer-name {
  font-size: $uni-font-size-base;
  background-color: $uni-color-primary;
  padding: 4px 8px;
  border-radius: 4px;
}

.model-tag {
  margin: 16px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.model-content {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
  margin: 0px 8px 8px 8px;
  font-size: $uni-font-size-base;
  border-width: 3px 0px 0px 0px;
  border-style: solid;
  border-color: #ffffff;
}

.row-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0px;
}

.sub-text {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
}

.icon-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.col-line {
  margin-top: 16px;
}

.radio-group {
  display: flex;
  flex-direction: row;
  margin-top: 6px;
}

.radio-view {
  padding: 2px 6px;
  border-radius: 4px;
  background-color: $uni-bg-color-grey;
  color: $uni-text-color-gray;
  margin-right: 8px;

  &.selected {
    background: #f2ffff;
    color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
  }
}

.update-tag-new {
  color: $uni-color-primary;
  font-size: $uni-font-size-xs;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #fff1f0;
}

.update-tag {
  color: #722ed1;
  font-size: $uni-font-size-xs;
  border: 1px solid #d3adf7;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #f9f0ff;
}

.d-info {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  padding-top: 8px;
}

.info-cell {
  width: 33%;
  padding-bottom: 8px;
}

.info-cell-key {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  display: flex;
  flex-flow: row;
  align-items: center;
}

.info-cell-value {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 24px;
  line-height: 24px;
}

.middle-option {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: $uni-font-size-base;
}

.top-line {
  padding: 8px 0px;
  border-width: 1px 0px 0px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.line {
  border-width: 1px 0px 0px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

.option-btn-update {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 6px;
}

.option-btn-update {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  border-radius: 4px;
  padding: 2px 6px;
}

.option-btn-recall {
  color: #722ed1;
  border: 1px solid #722ed1;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 10px;
}

.option-btn-delete {
  color: #555555;
  border: 1px solid #555555;
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 10px;
}

.btn-icon {
  margin-right: 2px;
  font-size: 13px;
}

.info-cell-value input {
  font-size: $uni-font-size-base;
  line-height: 24px;
  height: 24px;
}

.total-view {
  font-size: $uni-font-size-base;
  color: #000000;
  text-align: end;
  padding: 0px 8px;
}

.add-device {
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  font-size: $uni-font-size-base;
  border-radius: 4px;
  text-align: center;
  padding: 6px 0px;
  margin: 8px 8px;
  font-weight: bold;
  background-color: #fff1f0;
}

.space-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#translate-arrow {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(-90deg);
  transition: all 1s;
}

#translate-arrow-expend {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(90deg);
  transition: all 1s;
}
</style>
