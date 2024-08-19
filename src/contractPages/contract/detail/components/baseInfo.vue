<template>
  <view class="baseinfo">
    <!-- 结算信息 -->
    <view class="container-item">
      <view class="item-title">
        <view class="titleDot1">
          <view class="titleDot2"></view>
        </view>
        <text style="margin-left:5px">结算信息</text>
      </view>

      <view class="row">
        <view class='row-item'>
          <text class="label">支付约定：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.paymentTypeName || ''
          }}</text>
        </view>
        <view class='row-item'>
          <text class="label">运费减免约定：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.renterTripTypeName || ''
          }}</text>
        </view>
      </view>
      <view class="row">
        <view class='row-item'>
          <text class="label">配备人员：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.allocateFlag ? '是' : '否'
          }}</text>
        </view>
        <view class='row-item' v-if="baseInfo.contractDetailDto && baseInfo.contractDetailDto.allocateFlag">
          <text class="label">人天单价：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.allocatePrice }}元</text>
        </view>
        <view class='row-item'>
          <text class="label">是否开票：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.invoiceTypeName || ''
          }}</text>
        </view>
        <view v-if="baseInfo.contractDetailDto && baseInfo.contractDetailDto.invoiceType != 0" class='row-item'>
          <text class="label">发票税额：</text>
          <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.invoiceTax || 0
          }}%</text>
        </view>
      </view>
    </view>

    <!-- 项目信息 -->
    <view class="container-item">
      <view class="item-title">
        <view class="titleDot1">
          <view class="titleDot2"></view>
        </view>
        <text style="margin-left:5px">项目信息</text>
      </view>

      <view class="row-item">
        <text class="label">项目名称：</text>
        <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.projectName || '--'
        }}</text>
      </view>
      <view class="row-item" v-if='baseInfo.contractDetailDto && baseInfo.contractDetailDto.constructionTypeName'>
        <text class="label">施工类别：</text>
        <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.constructionTypeName
        }}</text>
      </view>
      <view class="row-item">
        <text class="label">交机地点：</text>
        <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.deliveryPlace || '--'
        }}</text>
      </view>
      <view class="row-item">
        <text class="label">归还地点：</text>
        <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.returnPlace || '--'
        }}</text>
      </view>
      <view class="row-item">
        <text class="label">其他约定：</text>
        <text class="value">{{ baseInfo.contractDetailDto && baseInfo.contractDetailDto.covenants || '--' }}</text>
      </view>

    </view>

    <!-- 设备需求 -->
    <view class="container-item">
      <view class="item-title">
        <view class="titleDot1">
          <view class="titleDot2"></view>
        </view>
        <text style="margin-left:5px">设备需求</text>
      </view>

      <view class="device-container">
        <template v-if="baseInfo.contractDetailDto.orderList.length > 0">
          <view class="device-item" v-for="(item, index) in baseInfo.contractDetailDto.orderList">
            <view class="device-item-title">
              <text>{{ item.typeName }}/{{ item.heightName }}</text>
              <text>{{ item.orderNum || 0 }}台</text>
            </view>

            <view class="sub-info">
              <text>1200/天</text>
              <text>3200/月</text>
              <text>押金:{{ item.pledge || 0 }}/台</text>
              <text>预租期{{ item.tenancy || '-' }}</text>
            </view>

            <view class="bg-gray">
              <text>约定进场：{{ item.beginDate && item.beginDate.split(' ')[0] || '-' }}</text>
              <text>约定退场：{{ item.endDate && item.endDate.split(' ')[0] || '-' }}</text>
              <text>运费类型：{{ item.carriageTypeName || '-' }}</text>
              <text>运费/台：{{ item.carriage && Number(item.carriage).toFixed(2) || '0.00' }}</text>
            </view>
          </view>
        </template>
        <view class="data-empty" v-else>暂无数据</view>
      </view>

    </view>

    <!-- 附件 -->
    <view class="container-item">
      <view class="item-title">
        <view class="titleDot1">
          <view class="titleDot2"></view>
        </view>
        <text style="margin-left:5px">附件</text>
      </view>

      <view>
        <imgupload v-if="baseInfo.fileList.length == 0" :isupload="false" :isShowBg="false" :isShowLabel="false"
          :imgFinishlist="baseInfo.fileList"></imgupload>
      </view>
    </view>

    <!-- 合同执行 -->
    <view class="container-item">
      <view class="item-title">
        <view class="titleDot1">
          <view class="titleDot2"></view>
        </view>
        <text style="margin-left:5px">合同执行</text>
      </view>
      <view class="excute-container">
        <view class="excute-item" v-for="item in executeList">
          <view class="excute-item-title">

            <text class="bold"><i class="iconfont r-icon" :class="getFlowIcon(item.businessType).svg"
                :style="{ color: getFlowIcon(item.businessType).color, 'margin-right': '5px' }"></i>{{
                  getFlowIcon(item.businessType).name || '-' }}</text>
            <text class="shin">{{ item.createTime || '-' }}</text>
          </view>
          <view class="info">
            <text>发起人：{{ item.createName || '-' }}</text>
            <text style="color:#e60000" @click="viewDetail(item)">查看</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import imgupload from "@/components/common/image-upload/image-upload.vue";
import parseISO from "date-fns/parseISO";
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    imgupload
  },
  watch: {
    'baseInfo.businessNo': {
      handler(val) {
        if (val) {
          this.getExecute()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      executeList: [],

    }
  },
  created() {
    this.getExecute()
  },
  methods: {
    goTo(item) {
      let self = this;
      console.log(item, "detainInfo11");
      switch (item.businessType) {
        case "workIn":
          uni.navigateTo({
            url:
              "/businessPages/workin/workin-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "invoice":
          uni.navigateTo({
            url:
              "/businessPages/invoice/invoice-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url:
              "/businessPages/proceed/porceeds-detail?businessNo=" +
              item.businessNo,
          });
          break;
        // 退款
        case "reimburse":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" +
              item.businessNo,
          });
          break;
        //成本
        case "cost":
          uni.navigateTo({
            url:
              "/businessPages/cost-manage/cost-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "costlist":
          let customerName = item.customerName ? item.customerName + "-" : null;
          let projectName = item.projectName ? item.projectName : null;
          let contractName = customerName
            ? customerName
            : null + contractName
              ? contractName
              : null;
          uni.switchTab({
            url: "/pages/main/business",
            success: function (e) {
              let info = {
                param: {
                  contractName,
                },
                key: "costManage",
                id: 15,
              };
              uni.setStorage({
                key: self.$savekey.MEMORY_STORAGE,
                data: info,
              });
            },
          });
          break;

        case "claim":
          uni.navigateTo({
            url:
              "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contract":
          uni.navigateTo({
            url: "./contract-detail?id=" + item.id,
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/workout-detail?businessNo=" +
              item.businessNo,
          });
          break;
        case "pause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "contractChange":
          console.log(item);
          uni.navigateTo({
            url:
              "/contractPages/contract-change/contract-change-detail?id=" +
              item.id,
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail?businessNo=" +
              item.businessNo,
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    viewDetail(item) {
      this.goTo(item)

    },
    // 获取合同执行流
    async getExecute() {
      let contractNo = this.contractNo || this.baseInfo.businessNo;
      if (!contractNo) return;
      let res = await this.$network.getData(this.$url.CONTRACT_EXECUTE_INFO, 'GET', { contractNo: contractNo });
      this.executeList = res;
      for (let i = 0; i < this.executeList.length; i++) {
        let time = parseISO(this.executeList[i].createTime).getTime();
        console.log(time, '1234');
        this.$set(this.executeList[i], 'time', time)
      }
      this.executeList.sort((a, b) => b.time - a.time);
      // this.handleBusinessType(this.executeList)
      console.log(this.executeList, 'this.executeList');
    },
    getFlowIcon(flowType) {
      let icon = {
        svg: "iconzl--hetong",
        color: "#E60000",
        name: "",
      };
      switch (flowType) {
        case "contract":
          icon.svg = "iconzl--hetong";
          icon.color = "#E60000";
          icon.name = "合同";
          break;
        case "contractChange":
          icon.svg = "iconzl--hetong";
          icon.color = "#5A7AE8";
          icon.name = "合同变更";
          break;
        case "workIn":
          icon.svg = "iconzl--ruchang";
          icon.color = "#E60000";
          icon.name = "进场";
          break;
        case "workOut":
          icon.svg = "iconzl--chuchang";
          icon.color = "#5A7AE8";
          icon.name = "退场";
          break;
        case "pause":
          icon.svg = "iconzl--zhuyi";
          icon.color = "#FB7135";
          icon.name = "报停";
          break;
        case "claim":
          icon.svg = "iconzl--suopei";
          icon.color = "#FCA01F";
          icon.name = "索赔";
          break;
        case "settle":
          icon.svg = "iconico_home_obligation";
          icon.color = "#FCA01F";
          icon.name = "结清";
          break;
        case "settlement":
          icon.svg = "iconico_home_obligation";
          icon.color = "#FCA01F";
          icon.name = "结算";
          break;
        case "statement":
          icon.svg = "iconico_home_obligation";
          icon.color = "#5A7AE8";
          icon.name = "对账";
          break;
        case "proceeds":
          icon.svg = "iconico_home_obligation";
          icon.color = "#E60000";
          icon.name = "收款";
          break;
        case "reimburse":
          icon.svg = "iconico_home_obligation";
          icon.color = "#ff5500";
          icon.name = "退款";
          break;
        case "cost":
          icon.svg = "iconico_home_obligation";
          icon.color = "#ff5500";
          icon.name = "成本";
          break;
        case "contractPlus":
          icon.svg = "iconzl--hetong";
          icon.color = "#5A7AE8";
          icon.name = "合同附加";
          break;
        case "invoice":
          icon.color = "#5A7AE8";
          icon.name = "发票";
          break;

        default:
          break;
      }
      return icon;
    },
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  background-color: #fff;
  padding-bottom: 2rpx;
  margin-bottom: 24rpx;

  .container-item {
    margin: 24rpx 16rpx;
    padding: 20rpx 24rpx;
    margin-bottom: 44rpx;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    border-radius: 10px;

    .item-title {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 28rpx;
    }

    .row {
      display: flex;
      justify-content: space-between;
      // line-height: 60rpx;
      flex-wrap: wrap;

      .row-item {
        flex-basis: 50%;
        margin-bottom: 20rpx;
      }

    }
  }
}

.label {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8C8C8C;
}

.value {
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
}

.row-item {
  margin-bottom: 20rpx;
}

.device-container {
  .device-item {
    margin-bottom: 30rpx;

    .device-item-title {
      display: flex;
      justify-content: space-between;
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      margin-bottom: 18rpx;

    }

    .sub-info {
      font-size: 20rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FE931F;
      line-height: 32rpx;

      text {
        padding: 7rpx 15rpx;
        height: 40rpx;
        background: #FFEFDE;
        border-radius: 6rpx;
        margin-right: 17rpx;
      }
    }

    .bg-gray {
      display: flex;
      flex-wrap: wrap;
      padding: 16rpx;
      background: #F6F6F6;
      border-radius: 6rpx;
      margin-top: 20rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #8C8C8C;

      text {
        flex-basis: 50%;
        line-height: 44rpx;
      }
    }

    .data-empty {
      margin-top: calc(50% - 5px);
      align-self: center;
      font-size: 15px;
      color: #999999;
    }
  }
}

.excute-container {
  .excute-item {
    padding: 30rpx 24rpx;
    background: #F6F6F6;
    margin-bottom: 20rpx;

    .excute-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #222222;
      margin-bottom: 24rpx;

      .bold {
        font-weight: 500;
      }

      .shin {
        font-weight: 400;

      }

    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #888888;
    }
  }
}

::v-deep .img-upload-view {
  min-height: 0 !important;
  padding: 0 0 14rpx 0;
}

::v-deep .list-view {
  margin-left: 0;
}

::v-deep .border {
  width: 204rpx;
  height: 204rpx;
  margin-top: 0 !important;
}
</style>