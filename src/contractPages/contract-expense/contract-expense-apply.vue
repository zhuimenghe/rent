<template>
  <view class="content">
    <c-nav-bar-apply :business-key="expenseDic.businessKey">附加合同审批</c-nav-bar-apply>
    <approve-step
      :itemData="itemData"
      @data-form="dataForm"
      :orgId="contractDic.orgId"
      :businessOwner="contractDic.customerSalesman"
    >
      <view class="change-bg">
        <view class="change-no-container">
          <text class="change-no">追加编号：{{ expenseDic.businessNo || "--" }}</text>
        </view>
        <view>
          <contractDetailHead
            :baseInfo="contractDic"
            :isEnableESigin="isEnableESigin"
            @goToESign="goToESign"
          />
          <!--设备信息-->
          <view class="device-container">
            <view class="model-tag">设备信息</view>

            <view
              class="device-item-container model-content"
              style="border-color:#E60000"
              v-for="(item, i) in expenseDic.orderList"
              :key="i"
            >
              <view class="row-line">
                <view class="d-title"
                  >{{ item.typeName }}-{{ item.heightName || "" }}</view
                >
                <view class="update-tag-new">新增</view>
              </view>
              <view class="sub-text">{{ item.machineTypeName }}</view>
              <view class="d-info">
                <view class="info-cell">
                  <view class="info-cell-key">数量</view>
                  <view class="info-cell-value">
                    <input v-model="item.orderNum" type="number" :disabled="true" />
                  </view>
                </view>
                <view
                  class="info-cell"
                  v-if="
                    item.settlementType == 1 ||
                    item.settlementType == 4 ||
                    item.settlementType == 2 ||
                    item.settlementType == 3
                  "
                >
                  <view class="info-cell-key">{{
                    item.settlementType == "2" || item.settlementType == "3"
                      ? "月租金(元/台)"
                      : "日租金(元/台)"
                  }}</view>
                  <view class="info-cell-value">
                    <input v-model="item.hire" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell" v-if="item.settlementType == '4'">
                  <view class="info-cell-key">月租金(元/台)</view>
                  <view class="info-cell-value">
                    <input v-model="item.hireMonthly" type="digit" :disabled="true" />
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">押金(元/台)</view>
                  <view class="info-cell-value">
                    <!-- <input v-model="item.pledge" type="digit" :disabled="true" /> -->
                    <text>{{ item.pledge || "0" }}</text>
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费(元/台)</view>
                  <view class="info-cell-value">
                    <text>{{ item.carriage || "0" }}</text>

                    <!-- <input v-model="item.carriage" type="digit" :disabled="true" /> -->
                  </view>
                </view>
                <view class="info-cell" v-if="contractDic.contractDetailDto.tripCalType !='1'">
                  <view class="info-cell-key">运费类型</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="item.carriageTypeName"
                      textColor="#333333"
                      :disabled="true"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计进场时间</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="getDate(item.beginDate)"
                      textColor="#333333"
                      :disabled="true"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计租期</view>
                  <view class="info-cell-value">{{ getTenancyFn(item) || '--'}}</view>
                </view>
                <view class="info-cell" v-if="isShowDefault">
                  <view class="info-cell-key">预计退场时间</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="getDate(item.endDate) || '--'"
                      textColor="#333333"
                      :disabled="true"
                    ></label-arrow>
                  </view>
                </view>
                <view class="info-cell">
                  <view class="info-cell-key">指定设备</view>
                  <view class="info-cell-value">
                    <label-arrow
                      :value="getMachineNum(item)"
                      textColor="#333333"
                      @clickLabel="showAssignPop(item, i)"
                    ></label-arrow>
                  </view>
                </view>
              </view>
            </view>
            <view class="total-view">本次追加预收合计：{{ total }}</view>
          </view>

          <view>
            <view class="model-tag space-between" @click="isExpend = !isExpend">
              <text>原合同订单</text>
              <i
                class="iconfont iconarrow-right"
                :id="isExpend ? 'translate-arrow' : 'translate-arrow-expend'"
              ></i>
            </view>
            <view v-if="isExpend">
              <view
                class="device-item-container model-content"
                v-for="(item, i) in contractDic.contractDetailDto.orderList"
                :key="i"
              >
                <view class="row-line">
                  <view class="d-title"
                    >{{ item.typeName }}-{{ item.heightName || "" }}</view
                  >
                </view>
                <view class="sub-text">{{ item.machineTypeName }}</view>
                <view class="d-info">
                  <view class="info-cell">
                    <view class="info-cell-key">数量</view>
                    <view class="info-cell-value">
                      <input v-model="item.orderNum" type="number" :disabled="true" />
                    </view>
                  </view>
                  <view
                    class="info-cell"
                    v-if="
                      item.settlementType == 3 ||
                      item.settlementType == 2 ||
                      item.settlementType == 1 ||
                      item.settlementType == '4'
                    "
                  >
                    <view class="info-cell-key">{{
                      item.settlementType == "2" || item.settlementType == "3"
                        ? "月租金(元/台)"
                        : "日租金(元/台)"
                    }}</view>
                    <view class="info-cell-value">
                      <input v-model="item.hire" type="digit" :disabled="true" />
                    </view>
                  </view>
                  <view class="info-cell" v-if="item.settlementType == '4'">
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
                      <label-arrow
                        :value="item.carriageTypeName"
                        textColor="#333333"
                        :disabled="true"
                      ></label-arrow>
                    </view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计进场时间</view>
                    <view class="info-cell-value">
                      <label-arrow
                        :value="getDate(item.beginDate)"
                        textColor="#333333"
                        :disabled="true"
                      ></label-arrow>
                    </view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计租期</view>
                    <view class="info-cell-value">{{ item.tenancy || '--' }}</view>
                  </view>
                  <view class="info-cell" v-if="isShowDefault">
                    <view class="info-cell-key">预计退场时间</view>
                    <view class="info-cell-value">
                      <label-arrow
                        :value="getDate(item.endDate) || '--'"
                        textColor="#333333"
                        :disabled="true"
                      ></label-arrow>
                    </view>
                  </view>

                  <view class="info-cell">
                    <view class="info-cell-key">指定设备</view>
                    <view class="info-cell-value">
                      <label-arrow
                        :value="getMachineNum(item)"
                        textColor="#333333"
                        @clickLabel="showAssignPop(item, i, false)"
                      ></label-arrow>
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
              <selectLabelItem
                tagName="运费减免约定"
                :isRequired="false"
                :value="expenseDic.renterTripTypeName || '-'"
                :isSelect="false"
              />
              <text-label-item
                tagName="备注"
                :inputDisabled="true"
                :inputValue="expenseDic.remark || ''"
              />
              <imgupload :imgFinishlist="expenseDic.fileList" :isupload="false" />
            </view>
          </view>
        </view>
      </view>
    </approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import { differenceInDays } from "date-fns";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import approveStep from "@/components/workflow/approve-step.vue";
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
    approveStep,
    labelPhone,
    contractDetailHead,
  },
  data() {
    return {
      total: 0,
      itemData: {},
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
    };
  },
  onLoad(option) {
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowDefault = obj.value === "liangXu" ? false : true;
      }
    }
    // this.itemData = JSON.parse(option.item);
    this.itemData = JSON.parse(decodeURIComponent(option.item));
  },
  methods: {
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      let day = differenceInDays(new Date(row.endDate), new Date(row.beginDate)) + 1;
      return day + "天";
    },
    dataForm(val) {
      console.log(val);
      this.expenseDic = JSON.parse(val);
      this.total = this.expenseDic.orderList.reduce((x, y) => {
        return x + Number(y.total);
      }, 0);
      this.total = this.total.toFixed(2);
      this.getContractDetail(this.expenseDic.contractNo);
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
        })
        .catch((err) => {
          uni.hideLoading();
        });
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
    getExpenseDetail() {
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
      };
      this.$network
        .getData(this.$url.CONTRACT_EXPANSE, "GET", param)
        .then((result) => {
          uni.hideLoading();
          this.expenseDic = result;
          this.total = expenseDic.orderList.reduce((x, y) => {
            return x + Number(y.total);
          }, 0);
          this.total = this.total.toFixed(2);
          this.getContractDetail(result.contractNo);
        })
        .catch((err) => {
          uni.hideLoading();
        });
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
.contract-type text {
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
  margin: 4px 0px;
  align-items: center;
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
