<template>
  <view :class="{ 'uni-scroll-tab': scroll === true }" class="uni-tab">
    <view
      v-for="(tab, index) in tabList"
      :key="index"
      :class="{
        'uni-tab-active': index === value,
        'uni-tab-scroll-item': scroll === true,
        'uni-tab-scroll-active': index === value && isFlex,
      }"
      :style="{
        color: index === value ? activeColor : defaultColor,
        backgroundColor:
          index === value && isFlex ? activebgColor : defaultbgColor,
      }"
      @tap="itemClick(index, tab)"
      class="uni-tab-item"
    >
      <view class="tab-top">
        <view class="leftView">
          <text>{{ rangeKey == "" ? tab : tab[rangeKey] }}</text>
        </view>
        <!--:class="{'brigeNum': tab.showNum?true:false }" :style="{background: numbackgroudColor}"-->
        <text v-if="tab.showNum">({{ tab.num }})</text>
      </view>
      <view
        class="tab-line"
        v-if="!isFlex"
        :style="{
          backgroundColor: index === value ? activeColor : defaultbgColor,
        }"
      ></view>
    </view>
    <!-- <view v-if="!scroll" 
		class="uni-tab-bar"
		:style="[{ right: barRight + '%', 
		left : barLeft + '%', 
		borderColor: activeColor }]">
		</view> -->
  </view>
</template>
<script>
export default {
  options: {
    styleIsolation: "shared",
  },
  name: "uni-tab",
  data() {
    return {
      average: 0,
      back: false,
    };
  },
  props: {
    value: {
      type: Number, //当前选中下标
      default() {
        return 0;
      },
    },
    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultbgColor: {
      //背景颜色
      type: String,
      default() {
        return "#FFFFFF";
      },
    },
    activebgColor: {
      type: String,
      default() {
        return "#FFFFFF";
      },
    },
    defaultColor: {
      //默认未选中文字颜色
      type: String,
      default() {
        return "#000000";
      },
    },
    activeColor: {
      //选中时文字颜色 线条颜色
      type: String,
      default() {
        return "#E60000";
      },
    },
    rangeKey: {
      // 当tabList为对象时 显示指定下标值
      type: String,
      default() {
        return "";
      },
    },
    scroll: {
      //横向滑动
      type: Boolean,
      default() {
        return false;
      },
    },
    num: {
      type: String,
      default() {
        return "";
      },
    },
    shownum: {
      type: Boolean,
      default() {
        return false;
      },
    },
    numbackgroudColor: {
      type: String,
      default() {
        return "#E60000";
      },
    },
    isFlex: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  computed: {
    barLeft() {
      return this.value * this.average;
    },
    barRight() {
      let index = this.tabList.length - this.value - 1;
      return index * this.average;
    },
  },
  created() {
    this.average = 100 / this.tabList.length;
	console.log(this.tabList);
  },
  methods: {
    itemClick(index, tab) {
      if (this.value == index) return false;
      if (this.value > index) {
        this.back = true;
      } else {
        this.back = false;
      }
      // this.value = index;
      this.$emit("update:value", index);
      this.$emit("change", {
        tab: tab,
        index: index,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.uni-tab {
  position: relative;
  display: flex;
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
}

.uni-tab-item {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 44px;
  box-sizing: border-box;
}
.tab-top {
  display: flex;
  flex-direction: row;
  flex: 1;
  white-space: nowrap;
  box-sizing: border-box;
  overflow: hidden;
  align-items: center;
}
.tab-line {
  height: 3px;
  width: 48px;
  background-color: #ff00ff;
  border-radius: 3px;
}
.all-line-tab {
  flex: 1;
  height: 3px;
  background-color: #ffffff;
}

.uni-tab-scroll-item {
  flex: none;
  padding: 0px 12px;
  background-color: #ff00ff;
}

.uni-tab-active {
  color: #1e9fff;
}

.uni-tab-scroll-active {
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.uni-tab-bar {
  display: block;
  height: 3px;
  position: absolute;
  bottom: 0;
  border-bottom-width: 3px;
  border-bottom-style: solid;
}

.uni-tab-bar-forward {
  transition: right 0.2s cubic-bezier(0.35, 0, 0.25, 1),
    left 0.2s cubic-bezier(0.35, 0, 0.25, 1) 0.09s;
}

.uni-tab-bar-backward {
  transition: right 0.2s cubic-bezier(0.35, 0, 0.25, 1) 0.09s,
    left 0.2s cubic-bezier(0.35, 0, 0.25, 1);
}

.uni-scroll-tab {
  overflow-x: scroll;
}

::-webkit-scrollbar {
  height: 0px;
}

.leftView {
  flex: 1;
  align-items: center;
  text-align: center;
}

.brigeNum {
  height: 20px;
  border-radius: 50%;
  min-width: 20px;
  margin-left: 5px;
  margin-right: 5px;
  padding: 2px;
  line-height: 20px;
  text-align: center;
  font-size: 10px;
  color: #ffffff;
}
</style>
