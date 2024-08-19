<template>
  <view class="select-container" :class="{ 'no-tag': !isTagName }">
    <view class="tag-title" v-if="isTagName">
      <view class="select-tag" :style="{ color: tagColor }"
        >{{ tagName }} <businessTips :tipName="tipName" v-if="isShowTip" /><span
          style="color: #ff0000"
          v-if="isRequired || isRequired == 'true'"
          >*</span
        >
      </view>
    </view>

    <view
      class="label-container"
      @click="clickLabel"
      :style="{ 'margin-right': isSelect && isShowArrow ? '0px' : '10px ' }"
    >
      <view
        class="value-label"
        :class="className"
        v-if="isLabel"
        :style="{ color: !isSelect && isPhone && value ? '#E60000' : valueColor }"
      >
        {{ isSelect ? (value ? value : hint) : value ? value : "-" }}
      </view>
      <view :class="className" class="value-label" v-if="!isLabel">
        <!--自定义标签模式-->
        <slot></slot>
      </view>
      <i
        class="iconfont gray-arrow"
        :class="icon"
        :style="{ color: arrowColor }"
        v-if="isSelect && isShowArrow"
      ></i>
    </view>
  </view>
</template>

<script>
export default {
  name: "SelectLabelItem",
  props: {
    tagName: {
      type: String,
      default: "标签",
    },
    tagColor: {
      type: String,
      default: "#111111",
    },
    height: {
      type: String,
      default: "45px",
    },
    isShowTip: {
      type: Boolean,
      default: false,
    },
    tipName: {
      type: String,
      default: "",
    },
    isShowArrow: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: "",
    },
    isPhone: {
      type: Boolean,
      default: false,
    },
    valueColor: {
      type: String,
      default: "",
    },
    arrowColor: {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
    //默认显示tagNanme模式
    isTagName: {
      type: Boolean,
      default: true,
    },
    //默认显示标签模式
    isLabel: {
      type: Boolean,
      default: true,
    },
    //是否必填显示*
    isRequired: {
      type: [Boolean, String],
      default: false,
    },
    isSelect: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "iconarrow-right",
    },
  },
  data() {
    return {};
  },
  methods: {
    clickLabel() {
      if (this.isSelect) {
        this.$emit("clickItemLabel");
      } else {
        if (this.isPhone && this.value) {
          uni.makePhoneCall({
            // 手机号
            phoneNumber: this.value,
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.select-container {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  padding: 10px;
  border-bottom: #eeeeee 1px solid;
  justify-content: space-between;
  align-items: center;
  min-height: 16px;

  &.no-tag {
    padding-left: 0px;
    border-bottom: none;

    .label-container {
      margin-left: 0;
      justify-content: space-between;
    }
  }
}

.oneline {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.tag-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  // min-width: 60px;
}

.select-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  // margin-left: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.label-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-left: 10px;
  line-height: 16px;
  justify-content: flex-end;
  align-items: center;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.gray-arrow {
  margin-right: -3px;
  margin-left: 4px;
}

.icon-css {
  margin-left: 10px;
  font-size: 16px;
  padding: 5px;
  background: $uni-color-primary;
  border-radius: 3px;
  color: #ffffff;
}
</style>
