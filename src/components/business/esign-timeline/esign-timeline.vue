<template lang="">
  <view>
    <view class="title left">
      <view class="line"></view>
      <text class="txt">电签进度</text>
      <view
        v-if="showExpand && info.esignNodes.length > 2"
        class="text-primary flex align-center"
        @click="collapsed = !collapsed"
      >
        {{ collapsed ? "展开" : "收起" }}
        <view
          class="iconfont iconarrow-down padding-lr-sm"
          :class="{ expanded: !collapsed }"
        ></view>
      </view>
    </view>
    <view class="timeline-container">
      <!-- <view class="timeline-item" v-for="(item, index) in list" :key="index"> -->
      <view
        class="timeline-item"
        v-for="(s, i) in info.esignNodes"
        :class="{ hide: i > 1 && collapsed }"
        :key="i"
      >
        <view class="line-container">
          <view class="line-top"></view>
          <view
            class="legend line-success text-success"
            v-if="s.index < info.activeIndex"
          >
            <text class="iconfont iconxuanzhong1"></text>
          </view>
          <view
            class="legend line-error text-error"
            v-if="s.index == info.activeIndex"
          >
            <text class="">{{ i + 1 }}</text>
          </view>
          <view class="legend" v-if="s.index > info.activeIndex">
            <text class="">{{ i + 1 }}</text>
          </view>
          <!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
          <view
            class="line-bottom bg-success"
            v-if="s.index < info.activeIndex"
          ></view>
          <view class="line-bottom" v-if="s.index >= info.activeIndex"></view>
        </view>
        <view class="real-contant">
          <view class="text-lg text-bold flex">
            {{ s.name }}
            <button
              class="margin-left-xl text-primary text-normal z-btn btn"
              data-type="esign"
              :data-nodeId="s.id"
              :data-url="s.url"
              :data-title="info.title"
              open-type="share"
              :disabled="!s.url"
              v-if="info.activeIndex == s.index && s.action == '2'"
            >
              {{ s.actionDes }}
            </button>
            <text
              class="margin-left-xl text-primary text-normal"
              @click="action(s)"
              v-if="info.activeIndex == s.index && s.action == '1'"
              >{{ s.actionDes }}</text
            >
          </view>
          <view class="margin-top-lg text-gray">{{ s.operator }}</view>
          <!-- <template v-slot:default="{item,index}" ></template> -->
        </view>
      </view>
      <!-- <view class="timeline-item">
        <view class="line-container">
          <view class="line-top"></view>
          <view class="legend line-error text-error">
            <text class="">2</text>
          </view>
          <view class="line-bottom"></view>
        </view>
        <view class="real-contant">
          <view class="text-lg text-bold">甲方企业实名认证</view>
          <view class="margin-top-lg text-gray">李信上海机械设备有限公司</view>
        </view>
      </view>
      <view class="timeline-item">
        <view class="line-container">
          <view class="line-top"></view>
          <view class="legend ">
            <text class="">3</text>
          </view>
          <view class="line-bottom"></view>
        </view>
        <view class="real-contant">
          <view class="text-lg text-bold">甲方企业实名认证</view>
          <view class="margin-top-lg text-gray">李信上海机械设备有限公司</view>
        </view>
      </view> -->
    </view>
  </view>
</template>
<script>
export default {
  props: {
    businessNo: String,
    showExpand: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    businessNo: {
      async handler(no) {
        this.init();
      },
      immediate: true,
    },
  },
  data() {
    return {
      info: {
        esignNodes: [],
      },
      collapsed: false,
    };
  },
  created() {
    if (this.showExpand) {
      this.collapsed = true;
    }
  },
  computed: {},
  methods: {
    async init() {
      console.log("esign timeline init--");
      console.log(this.businessNo, "this.businessNo");
      if (this.businessNo) {
        uni.showLoading();
        //进度条数据
        this.info = await this.$network.getData(
          "/esignapi/api/esign-flow/info?businessNo=" + this.businessNo,
          "GET"
        );
        //当前节点 催办或者立即处理url
        let activeNode =
          (this.info &&
            this.info.esignNodes &&
            this.info.esignNodes[this.info.activeIndex]) ||
          {};
        if (activeNode.id) {
          let res = await this.$network.getData(
            "/esignapi/api/esign-record/urge/sms?nodeId=" + activeNode.id,
            "GET"
          );
          // 使用 Vue.set 显式修改 activeNode.url
          this.$set(this.info.esignNodes, this.info.activeIndex, {
            ...activeNode,
            url: res.url,
          });
        }

        uni.hideLoading();
      }
    },
    async action(node) {
      uni.navigateTo({
        url: `/otherPages/esign/webView?url=${encodeURIComponent(
          node.url
        )}&title=${this.info.title}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  position: relative;
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 10px 0;
  @include flex(row, center, space-between);

  .txt {
    margin-left: 10px;
  }

  .line {
    position: absolute;
    left: 0;
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
  }
}

.iconarrow-down {
  &.expanded {
    transform: rotate(180deg);
  }
}

.timeline-container {
  background: $uni-bg-color;
  padding-top: 20rpx;
  overflow: hidden;
  box-sizing: border-box;

  &.collapsed {
    height: 330rpx;
  }
}

.timeline-item {
  margin: 0 16rpx 0 24rpx;
  display: flex;
  flex-direction: row;

  &.hide {
    display: none;
  }
}

.line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-top {
  background-color: $uni-border-color;
  width: 1px;
  height: 0px;
}

.line-bottom {
  background-color: $uni-border-color;
  width: 1px;
  flex: 1;
  margin: 12rpx 0;
}

.legend {
  width: 48rpx;
  height: 48rpx;
  border: 1rpx solid $uni-border-color;
  border-radius: 100%;
  @include flex(row, center, center);
  color: #aaa;

  .iconfont {
    font-size: $uni-font-size-sm;
  }
}

//列表第一个的上半部分线不显示
.timeline-item:first-child .line-container .line-top {
  background-color: transparent !important;
}

//列表最后一个的下半部分线不显示
.timeline-item:last-child .line-container .line-bottom {
  background-color: transparent !important;
}

.real-contant {
  // display: flex;
  margin-bottom: 56rpx;
  margin-left: 24rpx;
  flex: 1;
  // flex-direction: column;
  // background-color: $uni-bg-color;
  // padding: 16px;
  border-radius: 4px;
}

.btn {
  height: auto;

  &::after {
    border: none !important;
  }
}
</style>

<!-- 
action 1 立即授权认证签署
action 2 催办
  
 -->
