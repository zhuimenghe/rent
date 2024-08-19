<template>
  <view
    v-if="
      checkFieldChange('workInAndOutUserName').changed &&
      checkFieldChange('settleUserName').changed &&
      checkFieldChange('contractGuarantorUserName').changed
    "
  >
    <p class="title"><span class="line"></span>授权人信息</p>
    <view class="base-infomation-bg">
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('workInAndOutUserName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            进退场授权人：{{ checkFieldChange("workInAndOutUserName").before || "-" }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            进退场授权人：{{ checkFieldChange("workInAndOutUserName").after || "-" }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('settleUserName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            结算授权人：{{ checkFieldChange("settleUserName").before || "-" }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            结算授权人：{{ checkFieldChange("settleUserName").after || "-" }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('contractGuarantorUserName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            合同保证人：{{ checkFieldChange("contractGuarantorUserName").before || "-" }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            合同保证人：{{ checkFieldChange("contractGuarantorUserName").after || "-" }}
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
        currentData = JSON.parse(this.baseInfo.extendedData);
      } catch (error) {
        console.error("Failed to parse baseInfo.extendedData:", error);
        return { changed: true, error: "Invalid current data format" };
      }

      // 尝试解析 baseInfo.originContractDto.extendedData
      let originalData;
      try {
        originalData = JSON.parse(this.baseInfo.originContractDto.extendedData);
      } catch (error) {
        console.error("Failed to parse baseInfo.originContractDto.extendedData:", error);
        return { changed: true, error: "Invalid original data format" };
      }

      // 获取对应字段的值
      let currentValue = normalizeEmptyValues(currentData[fieldName]);
      let originalValue = normalizeEmptyValues(originalData[fieldName]);

      // 比较两个值是否相等
      if (currentValue !== originalValue) {
        return {
          changed: true,
          before: originalValue,
          after: currentValue,
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
  }

  border-bottom: 1px solid #e6e6e6;

  &:last-child {
    border-bottom: none;
  }
}
</style>
