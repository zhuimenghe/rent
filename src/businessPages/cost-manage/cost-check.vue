<template>
  <view class="creat-reimburse-bg">
    <c-nav-bar-apply :business-key="itemData.businessKey"
      >成本详情</c-nav-bar-apply
    >
    <approve-step
      :itemData="itemData"
      @data-form="dataForm"
      :orgId="dataInfo.orgId"
      :businessOwner="dataInfo.customerSalesman"
    >
      <view
        class="cost-detail-title"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <text>基本信息</text>
      </view>

      <view class="sum-view-bg">
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">成本单号</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataInfo.businessNo || "--" }}</text>
          </view>
        </view>
        <view class="cell-input-view cell-contract">
          <view class="cell-input-view-left"
            ><text class="label">合同名称</text></view
          >
          <view class="cell-input-view-right" @click="gotoCDetail(dataInfo)">
            <text class="input-style icon" :style="{ 'margin-right': '26px' }"
              >{{ dataInfo.projectName ? dataInfo.projectName + "-" : ""
              }}{{ dataInfo.contractName || "--" }}
              <!-- <i class="iconfont cellrightImg iconarrow-right" :style="{'font-size':'22px'}"></i> -->
            </text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">区域</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataInfo.orgName || "--" }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">业务负责人</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              dataInfo.customerSalesmanName || "--"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">客户名称</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataInfo.customerName || "--" }}</text>
          </view>
        </view>

        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">支出日期</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              (dataInfo.payDate && dataInfo.payDate.split(" ")[0]) || "--"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">支出方式</text></view
          >
          <view class="cell-input-view-right">
            <view class="cell-input-view-right">
              <text class="input-style">{{
                dataInfo.payTypeName || "--"
              }}</text>
            </view>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">支出人</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataInfo.payUserName || "--" }}</text>
          </view>
        </view>
      </view>
      <view
        class="cost-detail-title"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <text>支出金额</text>
      </view>
      <view class="sum-view-bg">
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">运费</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              saveTwo(dataInfo.freightCost) || "0"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">装卸费</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              saveTwo(dataInfo.handlingCost) || "0"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">沟通费</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              saveTwo(dataInfo.contactCost) || "0"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">调度费</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              saveTwo(dataInfo.dispatchCost) || "0"
            }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text class="label">其他费用</text></view
          >
          <view class="cell-input-view-right">
            <text class="input-style">{{
              saveTwo(dataInfo.otherCost) || "0"
            }}</text>
          </view>
        </view>

        <view class="cell-input-view">
          <view class="cell-input-view-left"
            ><text style="font-weight: bold">支出总额</text></view
          >
          <view class="cell-input-view-right">
            <text
              class="input-style"
              style="font-weight: 600; color: #222222"
              >{{ saveTwo(dataInfo.totalRentalPay) || "0" }}</text
            >
          </view>
        </view>
        <view class="column reason">
          <view class="label">支出理由</view>
          <view class="value">{{ dataInfo.payReason || "" }}</view>
        </view>
      </view>
      <view
        class="cost-detail-title"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <text>其他信息</text>
      </view>
      <view class="sum-view-bg">
        <!-- <imgupload :isupload="false" :imgFinishlist="dataInfo.fileList" /> -->
        <view class="base-content-item">
          <text class="fw500">附件</text>
        </view>
        <imgupload
          :isupload="false"
          :isShowBg="false"
          :isShowLabel="false"
          :imgFinishlist="dataInfo.fileList"
        />

        <view class="column">
          <view class="label">备注</view>
          <view class="value">{{ dataInfo.remark || "" }}</view>
        </view>
      </view>
    </approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    approveStep,
    labelPhone,
  },
  data() {
    return {
      reimburseDic: {},
      itemData: {},
      businessNo: null,
      dataInfo: {},
    };
  },
  watch: {
    businessNo(val) {
      if (!val) return;
      this.getInvoiceDetail();
    },
  },
  onLoad(option) {
    this.$datestr.printlog(option);
    this.itemData = JSON.parse(decodeURIComponent(option.item));
    this.businessNo=this.itemData.businessNo;
    this.businessNo&&this.getInvoiceDetail();
  },
  methods: {
    //成本详情
    async getInvoiceDetail() {
      uni.showLoading();
      let param = {
        businessNo: this.businessNo,
      };
      let detailInfo = await this.$network.getCostDetailById(param);
      this.dataInfo = detailInfo || {};
      this.businessKey=detailInfo.businessKey;
      uni.hideLoading();
    },
    gotoCDetail(item) {
      uni.navigateTo({
        url:
          "/contractPages/contract/contract-detail?businessNo=" +
          item.contractNo,
      });
    },
    dataForm(val) {
      this.$datestr.printlog(val);
      this.reimburseDic = JSON.parse(val);
      this.reimburseDic.task = null
      this.businessNo = this.reimburseDic?.businessNo;
    },
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    changestr(str) {
      this.$datestr.printlog(str);
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
   async loaddata(key) {
      // let url = this.$url.SETTLE_REIMBURSE_DETAIL + key;
      let detailInfo = await this.$network.getCostDetailById({
        businessNo: key
      });
        this.reimburseDic = {
        ...detailInfo
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.base-content-item {
  padding: 10px;
  .image-wrapper {
    display: flex;
    align-items: center;
    height: 104rpx;
    margin-top: 23rpx;
    image {
      width: 104rpx;
      height: 104rpx;
      margin-right: 16rpx;
    }
  }
}
.label {
  font-weight: 500;
  color: #8c8c8c;
}
.value {
  font-size: $uni-font-size-sm;
  background: #f6f6f6;
  border-radius: 6rpx;
  padding: 20rpx 16rpx;
  color: #222;
}
.column {
  padding: 10px;
  flex-direction: column !important;
  .label {
    margin-bottom: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: #222222;
    font-size: 28rpx;
  }
  .value {
    background-color: #f6f6f6;
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    font-size: 24rpx;
    line-height: 63rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    padding: 20rpx 16rpx;
    border-radius: 6rpx;
  }
}

.icon {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    top: 4px;
    right: -15px;
    width: 24rpx;
    height: 24rpx;
    border-width: 3rpx 3rpx 0 0;
    border-color: #222;
    transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
    border-style: solid;
  }
}
.cell-contract {
  padding: 10px 0 10px 10px !important;
  i {
    vertical-align: text-bottom;
  }
}
.cost-detail-title {
  position: relative;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #222222;
  margin: 16rpx 20rpx;
  &::before {
    content: "";
    position: absolute;
    top: 2rpx;
    left: -20rpx;
    width: 4rpx;
    height: 28rpx;
    background: $uni-color-primary;
  }
}
.creat-reimburse-bg {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}
.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px;
  margin-bottom: 5px;
  background: #ffffff;
  border-radius: 10px;
  padding-bottom: 10px;
}
.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  font-size: $uni-font-size-base;
  border-bottom: 1px dotted #f0f2f4;
}
.cell-input-view-left {
  display: flex;
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
.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-bottom: 10px;
}
.reason {
  .value {
    font-size: $uni-font-size-sm;
    background: #f6f6f6;
    border-radius: 6rpx;
    padding: 20rpx 16rpx;
    line-height: 65rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>
