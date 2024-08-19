<template>
  <view
    :class="isFrame ? 'frame-container' : 'inner-container'"
    :style="{ 'padding-left': isFrame && showHeadTag ? '0px' : '8px' }"
  >
    <view class="row-line-between" style="align-items: flex-start">
      <view>
        <view class="c-title">
          <text v-if="title">{{ title || "-" }}</text>
          <slot name="title" v-else></slot>
        </view>
        <view
          style="font-size: 12px; color: #aaaaaa; width: 100%"
          :style="{ 'padding-left': showHeadTag ? '8px' : '0px' }"
        >
          <view v-if="subTitle">{{ subTitle }}</view>
          <slot v-else name="subTitle"></slot>
        </view>
      </view>
      <view class="row-line" style="justify-content: flex-end" v-if="isShowState">
        <view
          class="state-view"
          style="min-width: 60px; color: #f08200"
          v-if="stateName"
          >{{ stateName }}</view
        >
        <view class="state-view" style="min-width: 90px" v-else>
          <slot name="state"></slot>
        </view>
      </view>
    </view>
    <view :style="{ 'padding-left': isFrame && showHeadTag ? '8px' : '0px' }">
      <view class="row-line frame-detail-top" style="color: #999999; font-size: 14px">
        <slot name="subContent"></slot>
      </view>
      <slot name="contentList"></slot>
      <view
        class="content-block"
        style="color: #666666; border-radius: 4px; font-size: 14px"
        :style="{ 'background-color': bgcolor, padding: padding, margin: margin }"
        v-if="showContent"
      >
        <slot name="content"></slot>
      </view>
      <view :class="[showContent?'line-top':'']" class="row-line-between frame-detail-bottom" style="position: relative">
        <view v-if="showAttachment" class="attacment-style row-line" @click.stop="addPic"
          >附件
          <!-- @click.stop="exportExcel" -->
          <i
            style="margin-left: 5px; vertical-align: bottom"
            v-if="!attachmentNum && attachIconShow"
            class="iconfont icon-view iconfujian1"
          ></i>
          <span style="margin-left: 2px">{{ attachmentNum ? attachmentNum : "" }}</span>
        </view>
        <!--占位-->
        <view style="width: 1px" v-else></view>
        <slot name="options"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import badgeview from "@/components/common/image-upload/badge-icon.vue";
export default {
  components: {
    badgeview,
  },
  props: {
    margin: {
      type: String,
      default: "8px 0px",
    },
    padding: {
      type: String,
      default: "8px",
    },
    bgcolor: {
      type: String,
      default: "#F6F6F6",
    },
    attachIconShow: {
      type: Boolean,
      default: false,
    },
    title: String,
    stateName: String,
    subTitle: String,
    attachmentNum: [String, Number],
    isFrame: {
      type: Boolean,
      default: true,
    },
    showAttachment: {
      type: Boolean,
      default: true,
    },
    showContent: {
      type: Boolean,
      default: true,
    },
    isShowState: {
      type: Boolean,
      default: true,
    },
    showHeadTag: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    addPic() {
      this.$emit("addPic");
    },
  },
};
</script>

<style lang="scss" scoped>
.frame-container {
  background-color: #ffffff;
  margin: 8px 0px;
  // border-radius: 8px;
  padding: 8px;
}

.frame-detail-top {
  position: relative;
  padding-bottom: 10rpx;
  &::before {
    content: "";
    position: absolute;
    top: 22px;
    left: -8px;
    right: -8px;
    height: 1rpx;
    background: #e6e6e6;
  }
}

.frame-detail-bottom {
  position: relative;
  padding-top: 16rpx;
  padding-bottom: 2rpx;
  // &::before {
  //   content: "";
  //   position: absolute;
  //   top: -0px;
  //   left: -8px;
  //   right: -8px;
  //   height: 1rpx;
  //   background: #e6e6e6;
  // }
}

.line-top{
  &::before {
    content: "";
    position: absolute;
    top: -0px;
    left: -8px;
    right: -8px;
    height: 1rpx;
    background: #e6e6e6;
  }
}

.inner-container {
  background-color: #ffffff;
}

.c-title {
  flex: 1;
  color: $uni-text-color;
  font-size: 16px;
  min-height: 26px;
  // max-height: 52px;
  font-weight: 600;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  /*要显示的行数*/
  -webkit-box-orient: vertical;
  word-wrap: break-all !important;
}

.state-view {
  font-size: $uni-font-size-base;
  color: $uni-text-color-disable;
  text-align: right;
  height: 24px;
  line-height: 24px;
}

.attacment-style {
  font-size: 14px;
  color: #e60000;
  border-radius: 16px;
  padding: 4px 0px;
  line-height: 20px;
}
</style>
