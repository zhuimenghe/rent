<template>
  <view>
    <p class="title"><span class="line"></span>项目信息</p>
    <view class="base-infomation-bg">
      <view class="base-infomation-cell" v-if="checkFieldChange('projectName').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            项目名称：{{ checkFieldChange("projectName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            项目名称：{{ checkFieldChange("projectName").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('constructionTypeName').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            施工类别：{{ checkFieldChange("constructionTypeName").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            施工类别：{{ checkFieldChange("constructionTypeName").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('deliveryPlace').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            交机地点：{{ checkFieldChange("deliveryPlace").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            交机地点：{{ checkFieldChange("deliveryPlace").after }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('returnPlace').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            归还地点：{{ checkFieldChange("returnPlace").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            归还地点：{{ checkFieldChange("returnPlace").after }}
          </view>
        </view>
      </view>
      <view
        class="base-infomation-cell"
        v-if="checkFieldChange('isShowMinTenancy').changed"
      >
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            最短租期：{{ checkFieldChange("isShowMinTenancy").before ? "是" : "否" }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            最短租期：{{ checkFieldChange("isShowMinTenancy").after ? "是" : "否" }}
          </view>
        </view>
      </view>
      <view class="base-infomation-cell" v-if="checkFieldChange('covenants').changed">
        <view class="base-infomation-row">
          <view class="base-infomation-tag before-tag">改前</view>
          <view class="base-infomation-text">
            其他约定：{{ checkFieldChange("covenants").before }}
          </view>
        </view>
        <view class="base-infomation-row">
          <view class="base-infomation-tag after-tag">改后</view>
          <view class="base-infomation-text">
            其他约定：{{ checkFieldChange("covenants").after }}
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
