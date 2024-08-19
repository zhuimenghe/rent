<template>
  <view class="content">
    <c-nav-bar-apply :business-key="baseInfo.businessKey">合同变更审批</c-nav-bar-apply>
    <approve-step :itemData="itemData" @data-form="dataForm" :orgId="baseInfo.orgId">
      <view class="change-bg">
        <view class="change-no-container">
          <text class="change-no">变更编号：{{ baseInfo.changeNo || "--" }}</text>
        </view>
        <!--详情头 -->
        <contractDetailHead
          :baseInfo="baseInfo.originContractDto"
          :showContact="false"
        ></contractDetailHead>

        <view
          class="customer-info-container"
          v-if="
            baseInfo.customerName !== baseInfo.originContractDto.customerName &&
            hasCustomer
          "
        >
          <view class="model-tag"><span class="line"></span>客户信息</view>
          <view class="model-content">
            <view class="row-line customer-row">
              <view class="row-tag-before">改前</view>
              <view> 客户名称:{{ baseInfo.originContractDto.customerName }}</view>
            </view>
            <view class="row-line customer-row">
              <view class="row-tag-after">改后</view>
              <view style="color: #333333; font-size: 14px">
                客户名称:{{ baseInfo.customerName }}
              </view>
            </view>
            <view class="col-line" v-if="baseInfo.executionFlag">
              <view class="customer-info-left">
                <i class="iconfont iconzl--zhuyi" style="color: #ffaa00"></i>
                <text>当前客户下有执行中的合同，是否需要将其一并变更客户名称</text>
              </view>
              <view class="radio-group">
                <view class="radio-view" :class="{ selected: baseInfo.executionFlag }">
                  更改
                </view>
                <view class="radio-view" :class="{ selected: !baseInfo.executionFlag }">
                  不更改
                </view>
              </view>
            </view>
            <view class="col-line" v-if="baseInfo.completedFlag">
              <view class="customer-info-left">
                <i class="iconfont iconzl--zhuyi" style="color: #ffaa00"></i>
                <text>当前客户下有已完成的合同，是否需要将其一并变更客户名称</text>
              </view>
              <view class="radio-group">
                <view class="radio-view" :class="{ selected: baseInfo.completedFlag }"
                  >更改</view
                >
                <view class="radio-view" :class="{ selected: !baseInfo.completedFlag }">
                  不更改</view
                >
              </view>
            </view>
          </view>
        </view>

        <!--结算信息-->
        <settledown :baseInfo="baseInfo" v-if="hasSettledown"></settledown>

        <!--项目信息-->
        <project :baseInfo="baseInfo" v-if="hasProject"></project>

        <!--授权人信息-->
        <authorizedPerson
          :baseInfo="baseInfo"
          v-if="hasAuthorizedPerson"
        ></authorizedPerson>

        <!--设备信息-->
        <view class="device-container" v-if="hasDevice">
          <view class="model-tag"><span class="line"></span>设备信息</view>
          <view
            class="device-item-container model-content"
            :style="{
              'border-color': item.changed
                ? item.changed == 1
                  ? '#722ED1'
                  : '#E60000'
                : '#FFFFFF',
            }"
            v-for="(item, i) in baseInfo.contractDetailDto.orderList"
            :key="i"
          >
            <view class="row-line">
              <view class="d-title">
                {{ item.typeName || "" }}-{{ item.heightName || "" }}
              </view>
              <view
                v-if="item.changed"
                :class="item.changed === 1 ? 'update-tag' : 'update-tag-new'"
              >
                {{ item.changed === 1 ? "改后" : "新增" }}
              </view>
            </view>
            <view class="sub-text">{{ item.machineTypeName || "--" }}</view>
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
                  item.settlementType == 4
                "
              >
                <view class="info-cell-key"
                  >{{
                    item.settlementType == 2 || item.settlementType == 3
                      ? "月租金"
                      : "日租金"
                  }}(元/台)</view
                >
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
              <view class="info-cell" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                <view class="info-cell-key">运费(元/台)</view>
                <view class="info-cell-value">
                  <input v-model="item.carriage" type="digit" :disabled="true" />
                </view>
              </view>
              <view class="info-cell" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
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
                <view class="info-cell-value">{{ getTenancyFn(item) || "--" }}</view>
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
                <view class="info-cell-key">变更生效时间</view>
                <view class="info-cell-value">
                  <label-arrow
                    :value="getDate(item.enableTime) || '--'"
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
                    :textColor="getMachineNum(item) > 0 ? '#E60000' : '#333333'"
                    :disabled="getMachineNum(item) <= 0"
                    @clickLabel="goTo(item)"
                  >
                  </label-arrow>
                </view>
              </view>
            </view>
            <view class="middle-option top-line">
              <view>
                <view class="option-msg sub-text row-line" v-if="item.changed == 1"
                  >改前信息<i class="iconfont sub-text iconarrow-down"></i
                ></view>
              </view>
              <view class="option-container row-line"> </view>
            </view>
            <view class="top-line" v-if="getOriginOrder(item)">
              <view class="row-line sub-text">
                <view>数量</view>
                <view>{{
                  getOriginOrder(item).orderNum ? getOriginOrder(item).orderNum : 0
                }}</view>
              </view>

              <view
                class="row-line sub-text"
                v-if="
                  item.settlementType == 1 ||
                  item.settlementType == 4 ||
                  item.settlementType == 2 ||
                  item.settlementType == 3
                "
              >
                <view>{{
                  item.settlementType == "2" || item.settlementType == "3"
                    ? "月租金(元/台)"
                    : "日租金(元/台)"
                }}</view>
                <view>{{
                  getOriginOrder(item).hire ? getOriginOrder(item).hire : 0
                }}</view>
              </view>
              <view class="row-line sub-text" v-if="item.settlementType == '4'">
                <view>月租金(元/台)</view>
                <view>{{
                  getOriginOrder(item).hireMonthly ? getOriginOrder(item).hireMonthly : 0
                }}</view>
              </view>
              <view class="row-line sub-text">
                <view>押金(元/台)</view>
                <view>{{
                  getOriginOrder(item).pledge ? getOriginOrder(item).pledge : 0
                }}</view>
              </view>

              <view class="row-line sub-text" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                <view>运费(元/台)</view>
                <view>{{
                  getOriginOrder(item).carriage ? getOriginOrder(item).carriage : 0
                }}</view>
              </view>

              <view class="row-line sub-text" v-if="baseInfo.contractDetailDto.tripCalType != '1'">
                <view>运费类型</view>
                <view>{{
                  getOriginOrder(item).carriageTypeName
                    ? getOriginOrder(item).carriageTypeName
                    : "--"
                }}</view>
              </view>
              <view class="row-line sub-text" v-if="isShowDefault">
                <view>预计进场时间</view>
                <view>{{
                  getOriginOrder(item).beginDate ? getOriginOrder(item).beginDate : "--"
                }}</view>
              </view>
              <view class="row-line sub-text" v-if="isShowDefault">
                <view>预计租期</view>
                <view>{{ getTenancyFn(getOriginOrder(item)) || "--" }}</view>
              </view>
              <view class="row-line sub-text" v-if="isShowDefault">
                <view>预计退场时间</view>
                <view>{{
                  getOriginOrder(item).endDate ? getOriginOrder(item).endDate : "--"
                }}</view>
              </view>
              <view class="row-line sub-text">
                <view>变更生效时间</view>
                <view>{{
                  getOriginOrder(item).enableTime ? getOriginOrder(item).enableTime : "--"
                }}</view>
              </view>

              <view class="row-line sub-text">
                <view>指定设备</view>
                <view
                  :style="{
                    color:
                      getOriginOrder(item).machineList &&
                      getOriginOrder(item).machineList.length > 0
                        ? '#E60000'
                        : '#333333',
                  }"
                  @click="goTo(getOriginOrder(item))"
                  >{{
                    getOriginOrder(item).machineList
                      ? getOriginOrder(item).machineList.length
                      : "0"
                  }}</view
                >
              </view>
            </view>
          </view>
          <!-- <view class="total-view">合同预售合计：{{total}}</view> -->
        </view>

        <!-- 基本信息-->
        <view class="base-container">
          <view class="model-tag"><span class="line"></span>基本信息</view>
          <view class="model-content" style="padding: 0">
            <select-label-item
              tagName="更改人"
              :value="baseInfo.createName"
              :isSelect="false"
            />
            <select-label-item
              tagName="更改时间"
              :value="getDate(baseInfo.createTime)"
              :isSelect="false"
            />
            <select-label-item
              tagName="结算模式"
              :value="
                baseInfo.settleMode && baseInfo.settleMode == 2
                  ? '按照变更生效时间结算'
                  : '始终以最后变更的约定结算'
              "
              :isSelect="false"
            />
            <text-label-item
              v-if="baseInfo.changeReason"
              tagName="更改原因"
              :inputDisabled="true"
              :inputValue="baseInfo.changeReason || ''"
            />
            <imgupload :imgFinishlist="baseInfo.fileList" :isupload="false" />
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
import approveStep from "@/components/workflow/approve-step.vue";
import calRent from "@/common/util/cal-rent-money.js";
import hoursUtil from "@/common/util/day-working-hours.js";
import contractDetailHead from "@/contractPages/contract/detail/contract-detail-head.vue";
import settledown from "@/contractPages/contract-change/components/settledown.vue";
import project from "@/contractPages/contract-change/components/project.vue";
import authorizedPerson from "@/contractPages/contract-change/components/authorizedPerson.vue";
export default {
  components: {
    labelArrow,
    selectLabelItem,
    textLabelItem,
    imgupload,
    approveStep,
    contractDetailHead,
    settledown,
    authorizedPerson,
    project,
  },
  data() {
    return {
      itemData: {},
      total: 0,
      baseInfo: {
        contractDetailDto: {
          orderList: [],
        },
        originContractDto: {
          contractDetailDto: {},
        },
      },
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
    this.itemData = JSON.parse(decodeURIComponent(option.item));
  },
  computed: {
    hasSettledown() {
      return this.hasModification("3"); // 这里使用了之前定义的方法
    },
    hasProject() {
      return this.hasModification("4"); // 这里使用了之前定义的方法
    },
    hasAuthorizedPerson() {
      return this.hasModification("5"); // 这里使用了之前定义的方法
    },
    hasDevice() {
      return this.hasModification("2"); // 这里使用了之前定义的方法
    },
    hasCustomer() {
      return this.hasModification("1"); // 这里使用了之前定义的方法
    },
  },
  methods: {
    // 检查模块“修改”状态
    hasModification(num) {
      // 检查 this.baseInfo.changeMode 是否为数组
      if (Array.isArray(this.baseInfo.changeMode)) {
        // 使用 includes 方法来判断 num 是否在数组中
        return this.baseInfo.changeMode.includes(num);
      }
      // 如果 this.baseInfo.changeMode 不是一个数组，返回 false
      return false;
    },
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      if(new Date(row.endDate).getTime()>=new Date(row.beginDate).getTime()){

      }
      let day = new Date(row.endDate).getTime()>=new Date(row.beginDate).getTime() ?
       differenceInDays(new Date(row.endDate), new Date(row.beginDate))+1: 0;
      if(day>0){
        return day + "天";
      }else{
        return null
      }
    },
    dataForm(val) {
      this.baseInfo = JSON.parse(val);
      console.log(this.baseInfo, "	this.baseInfo");
      // this.total = this.baseInfo.contractDetailDto.orderList.reduce((x, y) => {
      // 	return x + Number(y.total) + (Number.parseFloat(y.pledge ? y.pledge : 0) + Number.parseFloat(
      // 		y.carriage ?
      // 		y.carriage : 0)) * y.orderNum
      // }, 0)
      // this.total = this.total.toFixed(2)

      //过滤未修改和附加合同的修改
      let orderList = this.baseInfo.contractDetailDto.orderList.filter((o) => {
        return o.changed && o.changed != 3;
      });
      this.baseInfo = {
        ...this.baseInfo,
        contractDetailDto: {
          ...this.baseInfo.contractDetailDto,
          orderList: orderList,
        },
      };
    },
    /**
     * 获取指定设备的数量，直接在value赋值，页面刷新有问题
     * @param {Object} item
     */
    getMachineNum(item) {
      return item.machineList ? item.machineList.length : 0;
    },

    /**
     * 获取原来合同对应的订单
     * @param {Object} item
     */
    getOriginOrder(item) {
      if (item.changed === 1 && item.originOrderId) {
        let originOrder = this.baseInfo.originContractDto.contractDetailDto.orderList.find(
          (o) => {
            return o.id === item.originOrderId;
          }
        );
        if (originOrder) {
          return {
            ...originOrder,
            settlementType: originOrder.settlementType,
            beginDate: this.getDate(originOrder.beginDate),
            endDate: this.getDate(originOrder.endDate),
            enableTime: this.getDate(originOrder.enableTime),
            machineList: originOrder.machineList ? originOrder.machineList : [],
          };
        } else {
          return null;
        }
      }
      return null;
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    goTo(item) {
      if (this.getMachineNum(item) > 0) {
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
.line {
  display: block;
  width: 2px;
  height: 80%;
  background-color: #e60000;
  margin-right: 10px;
}

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
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
  height: 20px;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
}

.model-content {
  background-color: #ffffff;
  // border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  // margin: 0px 8px 8px 8px;
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

.row-tag-before {
  border-radius: 6px;
  overflow-wrap: break-word;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  line-height: 24px;
  padding: 0 10px;
  margin: 0 5px 0 5px;
  color: rgba(254, 147, 31, 1);
  border: 1px solid rgba(254, 147, 31, 1);
  background-color: rgba(254, 147, 31, 0.2);
}
.row-tag-after {
  border-radius: 6px;
  overflow-wrap: break-word;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  white-space: nowrap;
  line-height: 24px;
  padding: 0 10px;
  margin: 0 5px 0 5px;
  color: rgba(230, 0, 0, 1);
  border: 1px solid rgba(230, 0, 0, 1);
  background-color: rgba(230, 0, 0, 0.2);
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
  color: #e60000;
  border: 1px solid #e60000;
  font-size: $uni-font-size-base;
  border-radius: 4px;
  text-align: center;
  padding: 6px 0px;
  margin: 8px 8px;
  font-weight: bold;
  background-color: #fff1f0;
}
.customer-row {
  justify-content: flex-start;
  line-height: 36px;
}
</style>
