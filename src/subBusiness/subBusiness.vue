<template>
  <view class="business-content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar :show-back="showBack">
      <view class="title-bar">
        <view class="right-container">
          <view v-if="curItem.isAdd">
            <view  class="add-device-my"  @click.stop="goToAdd()">
              <text class="iconfont iconadd"></text>
            </view>
          </view>
          <i class="iconfont icon-view iconliebiaodaochu" @click.stop="exportExcel" v-if="curItem.isExport"></i>
        </view>
        <view class="title-view row-line" @click.stop="showPick(curItem)">
          <view>{{ curItem.label }}列表</view>
          <view class="arrow-down"></view>
        </view>
      </view>
    </c-nav-bar>
    <view class="business-container" :style="{ paddingBottom: `${tabBarHeight}px` }" v-if="tabObjs.length > 0">
      <view v-if="curItem.value == 3">
        <claim-list ref="claim" />
      </view>
      <view v-if="curItem.value == 4">
        <proceedslist ref="proceeds" />
      </view>
      <view v-if="curItem.value == 5">
        <reimburselist ref="reimburse" />
      </view>
      <view v-if="curItem.value == 7">
        <pauselist ref="pause" />
      </view>
      <view v-if="curItem.value == 8">
        <contractChangeList ref="contractchange" />
      </view>
      <view v-if="curItem.value == 9">
        <contractKitList ref="contractkit" />
      </view>
      <view v-if="curItem.value == 10">
        <contractExpenseList ref="contractexpense" />
      </view>
      <view v-if="curItem.value == 14">
        <discountsList ref="discounts" />
      </view>
      <view v-if="curItem.value == 15">
        <costlist ref="cost" />
      </view>
    </view>
    <!-- <c-scan-device-pop ref="scanPop"></c-scan-device-pop> -->
    <w-picker :selectList="tabObjs" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>

<script>

import claimList from "./claim/claim-list.vue";
import proceedslist from "./proceed/proceeds-list.vue";
import reimburselist from "./reimburse/reimburse-list.vue";
import costlist from "./cost-manage/cost-list.vue";
import contractChangeList from "./contract-change/contract-change-list";
import pauselist from "./pause/pause-list.vue";
import contractKitList from "./contract-kit/contract-kit-list.vue";
import contractExpenseList from "./contract-expense/contract-expense-list";
import discountsList from "./discounts/discount-list";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import tabMixin from "@/mixins/customTabbar";
import { mapState } from "vuex";
export default {
  components: {
    proceedslist,
    reimburselist,
    claimList,
    contractChangeList,
    pauselist,
    contractKitList,
    contractExpenseList,
    discountsList,
    wPicker,
    costlist
  },
  name: "subBusiness",
  mixins: [tabMixin],
  data() {
    return {
      showBack: true,
      curItem: {
        label: "索赔",
        value: 3,
        refName: 'claim'
      },
      tabObjs: [],
      salesman: null,
      stateObj: null,
      contractNo: "",
      beginDate: "",
      endDate: "",
      contractName: "",
      customerSalesmanName: "",
      customerSalesman: "",
      orgObj: null,
      addIcon: "iconadd-func"
    };
  },
  computed: {
    ...mapState("system", ["tabBarHeight"])
  },
  onLoad(option) {
    this.tabObjs = [
      {
        label: "索赔",
        value: 3,
        refName: "claim",
        key: this.$savekey.PERMISSION_CLAIM_MANAGE,
        addKey: [
          this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_BUSINESS,
          this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_SERIVE
        ],
        isAdd: true,
        isExport: true
      },
      {
        label: "收款",
        value: 4,
        refName: "proceeds",
        key: this.$savekey.PERMISSION_COLLECTION_MANAGE,
        addKey: [this.$savekey.PERMISSION_COLLECTION_MANAGE_ADD],
        isAdd: true,
        isExport: true
      },
      {
        label: "退款",
        value: 5,
        refName: "reimburse",
        key: this.$savekey.PERMISSION_REFUND_MANAGE,
        addKey: [this.$savekey.PERMISSION_REFUND_MANAGE_ADD],
        isAdd: true,
        isExport: true
      },

      {
        label: "报停",
        value: 7,
        refName: "pause",
        key: this.$savekey.PERMISSION_PAUSE_MANAGE,
        addKey: [
          this.$savekey.PERMISSION_PAUSE_MANAGE_ADD_BUSINESS,
          this.$savekey.PERMISSION_PAUSE_MANAGE_ADD_SERIVE
        ],
        isAdd: true,
        isExport: true
      },
      {
        label: "合同变更",
        value: 8,
        refName: "contractchange",
        key: this.$savekey.PERMISSION_CONTRACT_CHANGE,
        addKey: [this.$savekey.PERMISSION_CONTRACT_CHANGE_ADD],
        isAdd: true,
        isExport: true
      },
      {
        label: "附加合同",
        value: 10,
        refName: "contractexpense",
        key: this.$savekey.PERMISSION_CONTRACT_EXPENSE,
        addKey: [this.$savekey.PERMISSION_CONTRACT_EXPENSE_ADD],
        isAdd: true,
        isExport: true
      },
      {
        label: "优惠/增收",
        value: 14,
        refName: "discounts",
        key: this.$savekey.PERMISSION_BUSINESS_DISCOUNTS,
        exportKey: this.$savekey.PERMISSION_BUSINESS_DISCOUNTS_EXPORT,
        isAdd: false, //没有新增功能
        isExport: true
      },
      {
        label: "成本",
        value: 15,
        refName: "cost",
        key: this.$savekey.PERMISSION_BUSINESS_COST,
        exportKey: this.$savekey.PERMISSION_BUSINESS_COST_EXPORT,
        isAdd: true, //没有新增功能
        isExport: true
      }
    ];
    let key = option.key || '';
    if (key) {
      this.tabObjs.find((item, index) => {
        if (item.key == key) {
          this.curItem = { label: item.label, value: item.value, ...this.tabObjs[index] }
        }
      })
    } else {
      this.curItem = {
        ...this.tabObjs[0]
      }
    }
    uni.$on("refresh-contract-list", usnerinfo => {
      this.headerrefreshVC();
    });
  },
  onShow() {
    this.getAddIcon();
    // this.showBack = this.curItem.value == 15;
    console.log(this.curItem.value,'typeof')
    // this.$refs[this.curItem.refName].loaddata();
  },
  methods: {
    popScan(licenseId) {
      this.$refs.scanPop.open(licenseId);
    },
    getAddIcon() {
      this.addIcon = "iconadd-func";
      if (this.curItem.value == "0") {
        this.addIcon = "iconxinzenghetong";
        let type = uni.getStorageSync(
          this.$savekey.LAST_CREATE_TYPE +
          "_contract_" +
          this.$datestr.getUserId()
        );
        let msgData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
        let isShowAdd = msgData.some(
          x => x.value === this.$savekey.PERMISSION_CONTRACT_ADD
        );
        let isShowExAdd = msgData.some(
          x => x.value === this.$savekey.PERMISSION_SIMPLE_CONTRACT_ADD
        );
        if (isShowAdd || isShowExAdd) {
          if ((type == "1" || type == "2") && !isShowAdd) {
            type = "3";
            uni.setStorageSync(
              this.$savekey.LAST_CREATE_TYPE +
              "_contract_" +
              this.$datestr.getUserId(),
              "3"
            );
          } else if (type == "3" && !isShowExAdd) {
            type = "1";
            uni.setStorageSync(
              this.$savekey.LAST_CREATE_TYPE +
              "_contract_" +
              this.$datestr.getUserId(),
              "1"
            );
          }
        }
        switch (type) {
          case "1": //普通合同
            this.addIcon = "iconxinzenghetong";
            break;
          case "2": //框架合同
            this.addIcon = "iconxinzengkuangjiahetong";
            break;
          case "3": //快捷合同
            this.addIcon = "iconxinzengkuaijiehetong";
            break;
          default:
            break;
        }
      } else if (this.curItem.value == "3") {
        this.addIcon = "iconxinzengyewusuopei";
        let type = uni.getStorageSync(
          this.$savekey.LAST_CREATE_TYPE + "_claim_" + this.$datestr.getUserId()
        );
        switch (type) {
          case "business": //业务索赔
            this.addIcon = "iconxinzengyewusuopei";
            break;
          case "service": //服务索赔
            this.addIcon = "iconxinzengfuwusuopei";
            break;
          default:
            break;
        }
      } else if (this.curItem.value == "7") {
        this.addIcon = "iconxinzengyewubaoting";
        let type = uni.getStorageSync(
          this.$savekey.LAST_CREATE_TYPE + "_pause_" + this.$datestr.getUserId()
        );
        switch (type) {
          case "business": //业务报停
            this.addIcon = "iconxinzengyewubaoting";
            break;
          case "service": //服务
            this.addIcon = "iconxinzengfuwubaoting";
            break;
          default:
            break;
        }
      }
    },
    showPick(curItem) {
      console.log(curItem, 'curItem');
      this.$refs.selector.show();
    },
    onConfirm(val) {
      this.curItem = val.checkArr;
      this.getAddIcon();
      uni.pageScrollTo({
        scrollTop: 0
      });
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
    }
  },

  onPullDownRefresh() {
    this.headerrefreshVC();
  },
  onReachBottom() {
    this.footerrefreshVC();
  }
};
</script>

<style lang="scss" scoped>
.business-content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
  font-size: $uni-font-size-base;
  // box-sizing: border-box;
  @include flex(column);

  ::v-deep.w-picker {
    .w-picker-cnt {
      bottom: 0 !important;
    }
  }
}

.business-container {
  flex: 1;
  // overflow: auto;
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
</style>
