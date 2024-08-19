<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="content-container">
      <!-- 公司详情-头部 -->
      <company-header :companyInfo="companyDic"></company-header>
      <view class="main-container">
        <!-- 公司详情-TAB -->
        <view class="tab-container" :style="{ top: topheight }">
          <view class="uni-tab">
            <view v-for="(tab, index) in tabList" :key="index" :class="{
              'uni-tab-active': tab.name === tabCurrent,
              'uni-tab-scroll-active': tab.name === tabCurrent,
            }" :style="{
  color: tab.name === tabCurrent ? activeColor : defaultColor,
  backgroundColor: tab.name === tabCurrent ? activebgColor : defaultbgColor,
}" @click="itemClick(tab.name, tab)" class="uni-tab-item">
              <view class="tab-top">
                <view class="leftView">
                  <text>{{ tab.label }}</text>
                </view>
              </view>
              <view class="tab-line" :style="{
                backgroundColor: tab.name === tabCurrent ? activeColor : defaultbgColor,
              }"></view>
            </view>
          </view>
        </view>
        <company-machine :overviews="overviewList" v-if="tabCurrent === 'machine'" :sublets="datalist" :companyInfo="companyDic" @headerrefresh="getListData"
          @total="goTo('device', companyDic, { value: 0, label: '转租设备' })" @sublet="goTo('device', companyDic, { value: 1, label: '转租设备' })"
          @rentBack="goTo('device', companyDic, { value: 2, label: '转租设备' })" @subletForRent="goTo('device', companyDic, { value: 3, label: '转租设备' })"></company-machine>
        <company-payment :overviews="overviewPaymentList" v-if="tabCurrent === 'payment'" :payments="paymentDataList" @headerrefresh="headerrefresh"></company-payment>
      </view>
      <buttonPanel class="button-panel" @sublet="goTo('apply', companyDic)" @rent="goTo('device', companyDic, { value: 3, batchEditMode: 'return' })"
        @payment="goTo('payment', companyDic, {})" @pay="goTo('pay', companyDic, { batchEditMode: 'payable' })"></buttonPanel>
    </view>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import companyHeader from "./components/company-header.vue";
import companyMachine from "./components/company-machine.vue";
import companyPayment from "./components/company-payment.vue";
import buttonPanel from "./components/buttonPanel/index.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    companyHeader,
    companyMachine,
    companyPayment,
    buttonPanel,
  },
  data() {
    return {
      companyId: "",
      companyDic: {},
      searchKey: "",
      datalist: [],
      paymentDataList: [],
      //选项卡列表
      tabList: [
        { label: "设备概览", name: "machine" },
        { label: "转租应付", name: "payment" },
      ],
      tabCurrent: "",
      topheight: "0px",
      activebgColor: "#fff",
      defaultbgColor: "#FFFFFF",
      defaultColor: "#000",
      activeColor: "#E60000",
      value: 0, //当前选中下标
    };
  },
  computed: {
    //设备概览的iconList
    overviewList() {
      let _this = this;
      return [
        {
          name: "转租合计",
          num: Number(_this.companyDic["subletCount"]) + Number(_this.companyDic["rentBackCount"]) || 0,
          icon: "iconshuliang",
          unit: "台",
          color: "#52c41a",
          bgc: "#EDF9E8",
          clickEvent: "total",
        },
        {
          name: "转租中",
          num: _this.companyDic["subletCount"] || 0,
          icon: "iconzl--ruchang",
          unit: "台",
          color: "#6a5fff",
          bgc: " #F0EFFF",
          clickEvent: "sublet",
        },
        {
          name: "已还租",
          num: _this.companyDic["rentBackCount"] || 0,
          icon: "iconzl--chuchang",
          unit: "台",
          color: "#fe931f",
          bgc: "#FEF4E8",
          clickEvent: "rentBack",

        },
        {
          name: "闲置转租",
          num: _this.companyDic["subletForRentCount"] || 0,
          icon: "iconxianzhi",
          unit: "台",
          color: "#3988ff",
          bgc: "#EBF3FF",
          clickEvent: "subletForRent",
        },
      ];
    },
    //转租应付的iconList
    overviewPaymentList() {
      let _this = this;
      return [
        {
          name: "履约应付合计",
          num: _this.$datestr.doubleFloat(_this.companyDic["subletReceivable"]) || "0.00",
          icon: "iconshoukuan1",
          color: "#52c41a",
          bgc: "#EDF9E8",
          clickEvent: "",
        },
        {
          name: "转租应付（成本）",
          num: _this.$datestr.doubleFloat(_this.companyDic["subletSettle"]) || "0.00",
          icon: "icontuikuan1",
          color: "#6a5fff",
          bgc: " #F0EFFF",
          clickEvent: "",
        },
        {
          name: "已付费用",
          num: _this.$datestr.doubleFloat(_this.companyDic["paidTotal"]) || "0.00",
          icon: "icondianzifapiao-copy",
          color: "#fe931f",
          bgc: "#FEF4E8",
          clickEvent: "",
        },
        {
          name: "剩余应付",
          num: _this.$datestr.doubleFloat(_this.companyDic["remaining"]) || "0.00",
          icon: "iconshengyuedu",
          color: "#3988ff",
          bgc: "#EBF3FF",
          clickEvent: "",
        },
      ];
    },
  },
  onLoad(option) {
    if (option.companyId) {
      this.companyId = option.companyId;
    }
    this.tabCurrent = this.tabList[0].name;
    uni.showLoading();
    this.getDetail();
    this.getListData();
    this.getPaymentListData();
  },
  created() {
    uni.$on("refresh-subletpay-list", (data) => {
      uni.showLoading();
      this.headerrefresh();
    });
  },
  methods: {
    headerrefresh() {
      this.getDetail();
      this.getListData();
      this.getPaymentListData();
    },
    itemClick(index, tab) {
      this.tabCurrent = tab.name;
    },
    getDate(time) {
      if (!time) return "-";
      return time.split(/\s+/)[0];
    },
    getDetail() {
      if (this.companyId) {
        let urlstr = this.$url.SUBLET_CONMPANY_DETAIL.replace(
          /{subletCompanyId}/,
          this.companyId
        );
        this.$network
          .getData(urlstr, "GET", null)
          .then((result) => {
            this.companyDic = {
              ...result,
            };
            uni.hideLoading();
          })
          .catch((err) => {
            uni.hideLoading();
          });
      }
    },
    searchValue() {
      this.getListData();
    },
    getListData() {
      let param = {
        current: 1,
        size: -1,
        subletCompanyId: this.companyId,
        businessNo: this.searchKey,
        state: 4,
      };
      this.$network
        .getData(this.$url.SUBLET_CONMPANY_APPLY_LIST, "POST", param)
        .then((result) => {
          this.datalist = [...result.records];
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getPaymentListData() {
      let param = {
        current: 1,
        size: -1,
        subletCompanyId: this.companyId,
        businessNo: this.searchKey,
      };
      this.$network
        .getData(this.$url.SUBLET_PAY_LIST, "POST", param)
        .then((result) => {
          this.paymentDataList = [...result.records];
          this.paymentDataList = this.paymentDataList.map((item) => {
            // 检查 settleInfoDto.payable 是否存在，如果存在则获取其 total 值，否则默认为 0
            const total = item.settleInfoDto && item.settleInfoDto.payable ? item.settleInfoDto.payable.total : 0;

            // 返回新的对象，包含原有的所有字段和新增的 surplus 字段
            return {
              ...item,
              surplus: total,
            };
          });

        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    goTo(type, item, state) {
      const urlMap = {
        detail: item ? `./sublet-apply-detail?businessNo=${item.businessNo}` : "",
        device: item
          ? `../../sublet-tab?index=3&companyName=${item.name}&companyId=${item.id
          }&deviceState=${JSON.stringify(state)}`
          : "",
        order: item ? `../../sublet-tab?index=0&companyName=${item.name}` : "",
        apply: item ? `../create-sublet?companyId=${item.id}` : "",
        payment: item
          ? "/otherPages/sublet/sublet-pay/sublet-pay-add?company=" +
          encodeURIComponent(JSON.stringify(item))
          : "",
        pay: item
          ? `../../sublet-tab?index=2&companyId=${item.id}&companyName=${item.name
          }&paymentState=${JSON.stringify(state)}`
          : "",
      };

      const url = urlMap[type];
      if (url) {
        uni.navigateTo({ url });
      } else {
        console.error("Invalid navigation type:", type);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.tab-container {
  .uni-tab {
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0 18rpx;
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    background-color: #fff;
    border-bottom: 1rpx solid #e6e6e6;
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

  .uni-tab-active {
    color: #1e9fff;
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
    width: 60px;
    // background-color: #ff00ff;
    border-radius: 3px;
  }
}

.content-container {
  .container-item {
    margin: 22rpx 16rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 32rpx;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    border-radius: 10px;

    .esign-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 22rpx;
    }

    .item-title {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 22rpx;
    }

    .row {
      display: flex;
      justify-content: space-between;
      line-height: 45rpx;
      flex-wrap: wrap;

      .row-item {
        // flex-basis: 50%;
        margin-bottom: 2rpx;
      }
    }
  }
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  // margin: 10px;
  background: #ffffff;
  // border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px solid;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.choose-device-text {
  color: $uni-color-primary;
}

.item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 6px 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-title {
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  padding: 4px 0px;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 16px;
  font-size: $uni-font-size-base;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  color: #ff0000;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.look-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}

.item-class {
  display: flex;
  flex-direction: column;
  width: 30%;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: #eeeeee 1px solid;
}

.item-text-class {
  font-size: $uni-font-size-base;
  margin-bottom: 10px;
  color: $uni-text-color;
}

.item-text-class-b {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  font-weight: bold;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.btnstyle {
  display: flex;
  margin-left: 10px;
  margin-right: 10px;
  height: 35px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: $uni-font-size-base;
  background-color: $uni-color-primary;
}

.search-icon {
  margin-left: 10px;
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  display: flex;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}

.list-view {
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.list-view-cell {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  background: #ffffff;
  // border-radius: 5px;
}

.main-container {
  margin-top: 10px;
  padding-bottom: 120rpx;
}

.button-panel {
  position: fixed;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0, 0, 0, 0.20);
  bottom: 0rpx;
  width: 100vw;
}
</style>
