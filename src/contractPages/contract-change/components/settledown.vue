<template>
  <view>
    <p class="title"><span class="line"></span>结算信息</p>
    <view class="base-infomation-bg">
      <view class="base-infomation-cell" v-if="checkFieldChange('monthConfig').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            月份计算：{{
              checkFieldChange("monthConfig").before === "0" ? "自然月" : "30天为一个月"
            }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            月份计算：{{
              checkFieldChange("monthConfig").after === "0" ? "自然月" : "30天为一个月"
            }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('paymentTypeName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            支付约定：{{ checkFieldChange("paymentTypeName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            支付约定：{{ checkFieldChange("paymentTypeName").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('advance').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            预付金额：{{ checkFieldChange("advance").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            预付金额：{{ checkFieldChange("advance").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('prePayWorkInDays').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            预付款到账后几天内进场：{{ checkFieldChange("prePayWorkInDays").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            预付款到账后几天内进场：{{ checkFieldChange("prePayWorkInDays").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('settlementDayTypeName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            结算日类型：{{ checkFieldChange("settlementDayTypeName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            结算日类型：{{ checkFieldChange("settlementDayTypeName").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('settlementDay').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            结算日：{{ checkFieldChange("settlementDay").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            结算日：{{ checkFieldChange("settlementDay").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('renterTripTypeName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            运费减免约定：{{ checkFieldChange("renterTripTypeName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            运费减免约定：{{ checkFieldChange("renterTripTypeName").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('tripCalType').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text flexBox">
            运费计算方式
            <businessTips v-if="baseInfo.originContractDto.contractDetailDto.tripCalType=='1'" tips="按趟计费，系统默认一个进场或退场单据为一趟物流" :color="'#f3a73f'" />
            ：{{ checkFieldChange("tripCalType").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text flexBox">
            运费计算方式
            <businessTips v-if="baseInfo.contractDetailDto.tripCalType=='1'" tips="按趟计费，系统默认一个进场或退场单据为一趟物流" :color="'#f3a73f'" />
            ：{{ checkFieldChange("tripCalType").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('tripVal').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            单趟运费金额：{{ checkFieldChange("tripVal").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            单趟运费金额：{{ checkFieldChange("tripVal").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('invoiceTypeName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            开发票：{{ checkFieldChange("invoiceTypeName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            开发票：{{ checkFieldChange("invoiceTypeName").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('invoiceTax').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            发票税额：{{ checkFieldChange("invoiceTax").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            发票税额：{{ checkFieldChange("invoiceTax").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('allocateFlag').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            是否需要配备操作人员：
            {{ checkFieldChange("allocateFlag").before ? "是" : "否" }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            是否需要配备操作人员：
            {{ checkFieldChange("allocateFlag").after ? "是" : "否" }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('allocatePrice').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            人天单价：
            {{ checkFieldChange("allocatePrice").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            人天单价：
            {{ checkFieldChange("allocatePrice").after }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    baseInfo: {},
  },
  methods: {
    checkFieldChange(fieldName) {
      // 内部函数来规范化空值
      function normalizeEmptyValues(value) {
        return value === undefined || value === null || value === "" ? "-" : value;
      }
      // 尝试解析 baseInfo.extendedData
      let currentData;
      try {
        currentData = this.baseInfo.contractDetailDto;
      } catch (error) {
        console.error("Failed to parse baseInfo.contractDetailDto:", error);
        return { changed: true, error: "Invalid current data format" };
      }

      // 尝试解析 baseInfo.originContractDto.extendedData
      let originalData;
      try {
        originalData = this.baseInfo.originContractDto.contractDetailDto;
      } catch (error) {
        console.error(
          "Failed to parse baseInfo.originContractDto.contractDetailDto:",
          error
        );
        return { changed: true, error: "Invalid original data format" };
      }

      // 获取对应字段的值
      let currentValue = normalizeEmptyValues(currentData[fieldName]);
      let originalValue = normalizeEmptyValues(originalData[fieldName]);

      // 按趟计费金额
      if(fieldName == 'tripVal'){
        console.log(currentData,originalValue,'currentData')
        if(currentData.tripCalType == '1' && currentValue != originalValue){
            return {
              changed: true,
              before: originalValue,
              after: currentValue,
            }
        }else{
          return {
            changed: false,
          };
        }
      }
      // 比较两个值是否相等
      if (currentValue !== originalValue) {
        let list = ["按台计费","按趟计费"]
        return {
          changed: true,
          before: fieldName=='tripCalType' ? list[Number(originalValue||0)] : originalValue,
          after: fieldName=='tripCalType' ? list[Number(currentValue||0)] : currentValue,
        };
      } else {
        return {
          changed: false,
        };
      }
    },
  },
};
</script>
<style scoped lang="scss">
.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}

.base-infomation-bg {
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.base-infomation-cell {
  padding: 10px;

  .base-infomation-row {
    display: flex;
    align-items: center;

    .base-infomation-tag {
      border-radius: 6px;
      overflow-wrap: break-word;
      font-size: 14px;
      font-weight: normal;
      text-align: center;
      white-space: nowrap;
      line-height: 24px;
      padding: 0 10px;
      margin: 0 5px 0 5px;

      &.before-tag {
        color: rgba(254, 147, 31, 1);
        border: 1px solid rgba(254, 147, 31, 1);
        background-color: rgba(254, 147, 31, 0.2);
      }

      &.after-tag {
        color: rgba(230, 0, 0, 1);
        border: 1px solid rgba(230, 0, 0, 1);
        background-color: rgba(230, 0, 0, 0.2);
      }
    }

    .base-infomation-text {
      color: rgba(34, 34, 34, 1);
      font-size: 14px;
      line-height: 26px;
      padding: 7px 0;
      word-break: break-all;
    }
    .flexBox{
      display: flex;
      align-items: center;
    }
  }

  border-bottom: 1px solid #e6e6e6;

  &:last-child {
    border-bottom: none;
  }
}
</style>
