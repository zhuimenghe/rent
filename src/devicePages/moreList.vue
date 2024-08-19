<template lang="">
  <view class="list-container">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="list" v-if="list && list.length">
      <slot></slot>
      <slot name="list" :list="renderList"></slot>
      <view class="more" @click="toggleExpanded" v-if="list.length > 3">
        {{ expanded ? "收起" : "更多" }}
        <text
          class="iconfont iconarrow-down"
          :class="{ expanded: expanded }"
        ></text>
      </view>
    </view>
    <view class="empty" v-else>
      <image class="img" src="/static/empty.png"></image>
      <text class="text">{{ emptyText }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    emptyText: {
      type: String,
      default: "当前暂无数据",
    },
    list: {
      type: Array,
      default: (_) => [],
    },
    minSize: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    renderList() {
      return this.expanded ? this.list : this.list.slice(0, this.minSize);
    },
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
  },
};
</script>
<style lang="scss" scoped>
.more {
  height: 70rpx;
  @include flex(row, center, center);
  color: $uni-color-primary;
  font-size: $uni-font-size-sm;
  .iconfont {
    margin-left: 10rpx;
    font-size: $uni-font-size-lg;
    color: $uni-text-color-grey;
    transition: transform ease-in 0.2s;
    &.expanded {
      transform: rotate(180deg);
    }
  }
}
.empty {
  @include flex(column, center, center);
  padding: 20rpx;
  .img {
    width: 77rpx;
    height: 80rpx;
  }
  .text {
    margin-top: 9rpx;
    color: $uni-text-color-gray;
  }
}
</style>
