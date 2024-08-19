<template>
  <!-- :class="{ 'pop-show': popShowFlag }" -->
  <view
    class="business-content"
    :disable-pull-down-refresh="popShowFlag"
    :class="{ 'pop-show': popShowFlag }"
  >
    <s-sany-popup ref="customToast"></s-sany-popup>
    <!-- 头部导航 -->
    <view class="com-nav-bar" :class="[theme]" :style="{ width: '100%' }">
      <view
        class="com-nav-bar-inner"
        :class="{ shadow: hasShadow }"
        :style="{
          background: transparentMode ? transparentBgColor : backgroundColor,
        }"
      >
        <view
          class="n-status-bar"
          :style="{ height: statusBarHeight + 'px' }"
          v-if="hasStatusBar"
        ></view>
        <view
          class="com-nav-bar-inner-header"
          v-if="showHeader"
          :style="{
            padding: `11px 10px`,
            width: `calc(100% - ${comTabBarPaddingRight + 'px'} )`,
            height: `${titleBarHeight}px`,
            boxSizing: 'border-box',
          }"
        >
          <view class="_back" style @click="goBack" v-if="showBack && _needBack">
            <text
              class="iconfont iconarrow-right"
              style="font-size: 60rpx; transform: rotate(180deg)"
              :style="{ color: textColor }"
            ></text>
          </view>
          <view
            class="_title"
            :style="{
              justifyContent: flexAlign,
              color: textColor,
              paddingRight: showBack ? '60px' : '0px',
            }"
          >
            <text
              v-for="item in tabList"
              @click="curItem = item"
              :class="[curItem.value == item.value ? 'active-tab' : '', 'tabitem']"
              :key="item.name"
              >{{ item.text }}</text
            >
          </view>
        </view>
        <slot name="fixed"></slot>
      </view>
      <view class="_placeholder bg-white" v-if="hasPlaceholder">
        <view
          class="n-status-bar"
          :style="{ height: statusBarHeight + 'px' }"
          v-if="hasStatusBar"
        ></view>
        <view v-if="showHeader" :style="{ height: titleBarHeight + 'px' }"></view>
      </view>
    </view>
    <view
      class="business-container"
      :style="{ paddingBottom: `${tabBarHeight}px`, 'margin-top': `${marTop}px` }"
    >
      <view v-if="curItem.value == 0">
        <contract-list ref="contract" @popShow="popShow" @popClose="popClose" />
      </view>
      <view v-if="curItem.value == 1">
        <workinlist ref="workin" @popShow="popShow" @popClose="popClose" />
      </view>
      <view v-if="curItem.value == 2">
        <workoutlist ref="workout" @popShow="popShow" @popClose="popClose" />
      </view>
      <view v-if="curItem.value == 4">
        <constructionSitesList
          ref="constructionSitesList"
          @popShow="popShow"
          @popClose="popClose"
        />
      </view>

      <view v-if="curItem.value == 11">
        <settleAccountsList
          ref="settleaccounts"
          @popShow="popShow"
          @popClose="popClose"
        />
      </view>
    </view>
    <c-scan-device-pop ref="scanPop"></c-scan-device-pop>
    <view class="add-device-my" v-if="curItem.isAdd" @click="goToAdd()">
      <text class="iconfont iconadd"></text>
    </view>
  </view>
</template>

<script>
import contractList from "./business/contract/contract-list.vue";
import constructionSitesList from "./business/constructionSitesList/constructionSitesList.vue";
import workinlist from "./business/workin/workin-list.vue";
import workoutlist from "./business/workout/workout-list.vue";
import settleAccountsList from "./business/settledown/settle-accounts-list.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import tabMixin from "@/mixins/customTabbar";
import { mapState } from "vuex";
export default {
  components: {
    contractList,
    settleAccountsList,
    workinlist,
    workoutlist,
    wPicker,
    constructionSitesList,
  },
  props: {
    hasPlaceholder: {
      type: Boolean,
      default: true,
    },
    textColor: {
      type: String,
      default: "",
    },
    flexAlign: {
      type: String,
      default: "flex-start",
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    hasStatusBar: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
    theme: {
      type: String,
      default: "", //primary
    },
    hasShadow: {
      type: Boolean,
      default: false,
    },
    transparentMode: {
      type: Boolean,
      default: false,
    },
  },
  name: "business",
  mixins: [tabMixin],
  data() {
    return {
      myOption: {},
      tabList: [
        {
          text: "合同",
          name: "contract",
          value: 0,
          refName: "contract",
          isAdd: true,
          acl: "contractManage",
          handleOperation: (res) => {
            if (res) {
              this.stateObj = res.data.state;
              if (res.data.param) {
                this.setQueryParams(res.data.param);
              }
            }
            // 合同处理逻辑
            setTimeout(() => {
              this.triggerContractMethods();
            }, 100);
          },
        },
        {
          text: "进场",
          name: "workin",
          value: 1,
          refName: "workin",
          isAdd: true,
          acl: "arrivalManage",
          handleOperation: (res) => {
            console.log(res);
            // 进场处理逻辑
          },
        },
        {
          text: "退场",
          name: "workout",
          value: 2,
          refName: "workout",
          isAdd: true,
          acl: "exitManage",
          handleOperation: (res) => {
            console.log(res);
            // 退场处理逻辑
          },
        },
        {
          text: "结算",
          name: "settleaccounts",
          value: 11,
          refName: "settleaccounts",
          isAdd: true,
          acl: "flexibleSettlement",
          handleOperation: (res) => {
            // 结算处理逻辑
            if (res && res.data.param) {
              this.setSettleAccountsParams(res.data.param);
            }
          },
        },
        // {
        //   text: "施工点",
        //   name: "constructionSitesList",
        //   value: 4,
        //   refName: "constructionSitesList",
        //   isAdd: false,
        //   handleOperation: () => {
        //     // 施工点处理逻辑
        //   },
        // },
      ],
      showBack: false,
      curItem: null,
      salesman: null,
      stateObj: null,
      contractNo: "",
      beginDate: "",
      endDate: "",
      contractName: "",
      customerSalesmanName: "",
      customerSalesman: "",
      orgObj: null,
      addIcon: "iconadd-func",
      oldItem: {},
      popShowFlag: false,
    };
  },
  computed: {
    ...mapState("system", {
      comTabBarPaddingRight: (s) => {
        let val = 0;
        // #ifdef  MP-WEIXIN
        val = s.menuBtnRect.right - s.menuBtnRect.left + 25; //胶囊的宽度
        // #endif
        return val;
      },
      titleBarHeight: (s) => s.titleBarHeight,
      menuBtnRect: (s) => {
        return s.menuBtnRect;
      },
      tabBarHeight: (s) => s.tabBarHeight,
      statusBarHeight: (s) => s.statusBarHeight,
      titleBarHeight: (s) => s.titleBarHeight,
      marTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  onLoad(option) {
    console.log(typeof option.id, "onLoad");
    let that = this;
    this.myOption = { ...option };
    uni.$on("refresh-contract-list", (usnerinfo) => {
      this.headerrefreshVC();
    });
  },
  async onShow() {
    //根据权限修改tabList  contractManage  arrivalManage  exitManage  flexibleSettlement
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.tabList = this.tabList.filter((t) => {
        return !t.acl || ps.some((x) => x.value === t.acl);
      });
    }

    // 通过url进来
    let [err, res] = await uni.getStorage({
      key: this.$savekey.MEMORY_STORAGE,
    });
    if (!err && res.data) {
      this.curItem = this.tabList.find((o) => o.value == res.data.id);
    }
    // 确保 curItem 存在，如果不存在则默认为 tabList 的第一个元素
    this.curItem = this.curItem || this.tabList[0];

    // 在 tabList 中查找与 curItem 的 value 匹配的元素
    this.curItem =
      this.tabList.find((item) => item.value === this.curItem.value) || this.curItem;

    // 检查 curItem 是否存在并且拥有 handleOperation 方法
    if (this.curItem && typeof this.curItem.handleOperation === "function") {
      // 执行对应 tab 的操作
      this.curItem.handleOperation(res);
    } else {
      // 如果没有找到有效的 handleOperation 方法，可能需要处理错误或回退方案
      console.log("No valid operation handler found for the current item.");
    }

    uni.removeStorage({
      key: this.$savekey.MEMORY_STORAGE,
    });
    uni.$on("refresh-contract-list", (usnerinfo) => {
      this.headerrefreshVC();
    });
  },
  methods: {
    setQueryParams(param) {
      // 设置查询参数
      this.salesman = param.customerName
        ? {
            label: param.customerName,
            value: param.customerId,
          }
        : null;
      this.beginDate = param.beginDate || "";
      this.endDate = param.endDate || "";
      this.orgObj = param.orgDic || null;
    },
    triggerContractMethods() {
      // 触发合同相关组件的方法
      if (this.salesman) {
        this.$refs.contract.getsalemans(this.salesman);
      }
      if (this.stateObj) {
        this.$refs.contract.getStateData(this.stateObj);
      }
      if (this.beginDate && this.endDate) {
        let types = res.data.param.dataType || "";
        this.$refs.contract.getDateData(this.beginDate, this.endDate, types);
      }
      if (this.orgObj) {
        this.$refs.contract.getOrgData(this.orgObj);
      }
      setTimeout(() => {
        this.$refs.contract.allFinishLoadData();
      }, 100);
    },
    setSettleAccountsParams(param) {
      // 从传入的参数对象中提取结算所需的数据
      this.contractNo = param.contractNo || "";
      this.beginDate = param.beginDate || "";
      this.endDate = param.endDate || "";
      this.contractName = param.contractName || "";
      this.customerSalesmanName = param.customerSalesmanName || "";
      this.customerSalesman = param.customerSalesman || "";

      // 如果有必要，可以在这里调用其他方法来进一步处理这些数据
      // 例如，如果需要根据这些参数更新UI或执行其他操作
      setTimeout(() => {
        if (this.contractNo) {
          this.$refs.settleaccounts.businessSettle(
            this.contractName,
            {
              label: this.customerSalesmanName,
              value: this.customerSalesman,
            },
            this.beginDate,
            this.endDate
          );
        }
      }, 200);
    },
    showPick(curItem) {
      this.$refs.selector.show();
    },
    popShow() {
      this.popShowFlag = true;
    },
    popClose() {
      this.popShowFlag = false;
    },
    //合同草稿箱
    goToDraft() {
      this.$refs.contract.goToDraft();
    },
    goToAdd() {
      this.$refs[this.curItem.refName].goToAdd();
    },
    goToLastAdd() {
      this.$refs[this.curItem.refName].goToLastAdd();
    },
    exportExcel() {
      this.$refs[this.curItem.refName].exportExcel();
    },
    headerrefreshVC() {
      this.$refs[this.curItem.refName].headerrefresh();
    },
    footerrefreshVC() {
      this.$refs[this.curItem.refName].footerrefresh();
    },
  },

  onPullDownRefresh() {
    if (this.popShowFlag) {
      return;
    }
    this.headerrefreshVC();
  },
  onReachBottom() {
    this.footerrefreshVC();
  },
};
</script>

<style lang="scss" scoped>
.pop-show {
  overflow: hidden;
}

.business-content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
  font-size: $uni-font-size-base;
  // box-sizing: border-box;
  @include flex(column);

  ::v-deep .w-picker {
    .w-picker-cnt {
      bottom: 100rpx;
    }
  }
}

.business-container {
  flex: 1;
  // overflow: hidden;
}

.head-container {
  top: 0px;
  left: 0px;
  position: fixed;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 400;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.row-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title-bar {
  height: 56px;
  line-height: 56px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}

.left-btn {
  position: absolute;
  top: 0px;
  left: 10px;
  height: 56px;
  line-height: 56px;
  font-size: 20px;
  text-align: center;
}

.title-view {
  height: auto;
  // border: 1px solid #999999;
  // border-radius: 4px;
  height: 24px;
  padding: 0px 16px;
  font-size: 16px;
  font-weight: bold;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 8px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid #333333;
}

.right-container {
  position: absolute;
  top: 0px;
  left: 0px;
  // height: 56px;
  // line-height: 56px;
  // width: 112px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.icon-view-1 {
  font-size: 20px;
  margin-right: 6px;
}

.icon-view {
  font-size: 20px;
  padding-left: 10px;
}

.com-nav-bar {
  position: fixed !important;
  top: 0 !important;
  z-index: 1000;
  font-size: 32rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  line-height: 45rpx;
  @include hairline-bottom();
  // border-bottom:1px solid #e60000;
  /*  #ifndef  APP-PLUS-NVUE  */
  color: $uni-text-color;

  /*  #endif  */
  &-inner {
    position: fixed;
    width: 100%;
    /*  #ifndef  APP-PLUS-NVUE  */
    background: $uni-bg-color;

    /*  #endif  */
    &.shadow {
      box-shadow: 0 0rpx 30rpx 0rpx rgba(67, 67, 95, 0.1);
    }

    &.fixed {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 999;
    }

    &-header {
      display: flex;
      align-items: center;

      ._title {
        // #ifndef  MP-WEIXIN
        padding-right: 40rpx !important;
        // #endif
        font-size: 32rpx;
        // font-weight: bold;
        flex: 1;
        display: flex;
        justify-content: space-around !important;
        /*  #ifndef  APP-PLUS-NVUE  */
        color: $uni-text-color;

        .tabitem {
          // flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          padding: 10px 16rpx;
          color: #181818;

          &:first-child {
            padding-left: 10rpx !important;
          }
        }

        /*  #endif  */
      }

      ._back {
        line-height: 1;
        padding: 10rpx;
        margin-left: -20rpx;
      }
    }

    .active-tab {
      position: relative;
      font-size: 36rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #181818;

      &::after {
        content: "";
        position: absolute;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 6rpx;
        background-color: #e60000;
      }
    }
  }

  ._placeholder {
    width: 750rpx;
  }

  //theme
  &.primary {
    .com-nav-bar-inner {
      background: $uni-color-primary;
    }

    ._back {
      color: $uni-text-color-inverse;
    }

    ._title {
      color: $uni-text-color-inverse;
    }
  }
}
</style>
