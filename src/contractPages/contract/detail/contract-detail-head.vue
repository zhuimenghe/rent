<template>
  <view class="header-container">
    <view class="row-line-between">
      <view>
        <view class="header-title row-line" style="flex: 1">
          <view v-if="baseInfo.contractType != '1'">
            <headTag
              :value="baseInfo.contractType == '2' ? '框' : '快'"
              :backgroundColor="baseInfo.contractType == '2' ? '#1278FF' : '#F08200'"
            ></headTag>
          </view>
          <!-- <view class="tag-style" :style="{'background-color':baseInfo.contractType== '3'?'#FE931F':'#E60000'}" v-if="baseInfo.contractType!='1'">{{baseInfo.contractType== '2'?'框':(baseInfo.contractType== '3'?'快':'')}}</view> -->
          <view
            style="line-height: 20px"
            :style="{
              'padding-left': baseInfo.contractType == '1' ? '10px' : '0px',
            }"
            >{{ baseInfo.customerName || "" }}-{{
              baseInfo.contractDetailDto.projectName || ""
            }}</view
          >
        </view>
      </view>

      <view style="text-align: end">
        <text style="color: #ff6d59" v-if="isOverdue">逾期</text>
        <view
          class="row-line header-sub-title"
          v-if="debtRatio && debtRatio.value"
          style="min-width: 100px; text-align: right"
          >应收比例：<text>{{ debtRatio.value || "-" }}</text
          ><i class="iconfont tip-style iconzl--zhushi" @click="showTip"></i
        ></view>
      </view>
    </view>
    <view class="head-content">
      <view class="content-text">{{ baseInfo.businessNo }}</view>
      <view class="content-text">区域：{{ baseInfo.orgName || "-" }}</view>
      <view class="content-text"
        >业务负责人：{{ baseInfo.contractDetailDto.customerSalesmanName || "-" }}</view
      >
      <view class="row-line-between content-text" v-if="showContact">
        客户联系人：{{ baseInfo.contractDetailDto.contactName || "--" }}/{{
          baseInfo.contractDetailDto.phoneNum || "-"
        }}
        <i
          class="iconfont phone-icon icondianhua"
          @click.stop="callPhone(baseInfo.contractDetailDto.phoneNum)"
        ></i>
      </view>
    </view>
    <view class="row-line" style="justify-content: flex-end">
      <view
        class="btn-style btn-style-left"
        @click="goTo('detail')"
        v-if="haveEsgin && showDetail"
      >
        电签详情<i class="iconfont iconarrow-right" style="margin-left: 2px"></i>
      </view>
      <view
        class="btn-style btn-style-right"
        @click="goTo('start')"
        v-if="haveEsgin && isEnableESigin"
      >
        <i class="iconfont iconqidong" style="margin-right: 2px"></i>启动电签
      </view>
      <view class="btn-style" @click="clickBtn('change')" v-if="isChangeCustomer">
        更改客户名称
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import headTag from "@/components/common/common-ui/head-tag.vue";
export default {
  components: {
    headTag,
  },
  props: {
    //是否有电签功能
    haveEsgin: Boolean,
    baseInfo: {
      type: Object,
      default() {
        return null;
      },
    },
    isOverdue: Boolean,
    isEnableESigin: Boolean,
    isChangeCustomer: Boolean,
    flowId: Boolean,
    showDetail: Boolean,
    debtRatio: {
      type: Object,
      default() {
        return null;
      },
    },
    showContact: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    callPhone(value) {
      if (value) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: value,
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
    },
    showTip() {
      this.$emit("showTip");
    },
    goTo(type) {
      this.$emit("goToESign", type);
    },
    clickBtn(type) {
      this.$emit("changeCustomer");
    },
  },
};
</script>

<style lang="scss" scoped>
.header-container {
  margin-top: 10px;
  padding: 12px 12px 12px 0px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #8c8c8c;
}
.header-title {
  line-height: 26px;
  font-size: 16px;
  font-weight: 800;
  color: #222222;
}
.tip-style {
  font-size: 12px;
  margin-left: 6rpx;
}
.tag-style {
  line-height: 20px;
  font-size: 12px;
  text-align: center;
  width: 20px;
  border-radius: 4px;
  color: #ffffff;
  margin-right: 8px;
}
.header-sub-title {
  line-height: 20px;
  padding: 6px 0px;
  font-size: 12px;
}
.head-content {
  margin-left: 12px;
  margin-top: 12px;
  border-radius: 8px;
  background: #f6f6f6;
  padding: 8px 12px;
  font-size: 12px;
  color: #8c8c8c;
  display: flex;
  flex-direction: column;
}
.content-text {
  line-height: 24px;
}
.phone-icon {
  padding: 4px;
  background-color: rgba(230, 0, 0, 0.08);
  color: #e60000;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}

.btn-style {
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: calc(50% - 8px);
  border: 1px solid #ffffff;
  margin-top: 12px;
  line-height: 34px;
  color: #ffffff;
  background-color: #e60000;
  border: 1px solid $uni-color-primary;
}
.btn-style-left {
  color: #ffffff;
  background-color: #e60000;
  margin-right: 8px;
}
.btn-style-right {
  color: #e60000;
  background-color: #ffffff;
  margin-left: 8px;
}

// .header-container{
// 	padding: 12px;
// 	border-radius:4px;
// 	// box-shadow: 0px 9px 10px rgba(51, 51, 51, 0.08);
// 	margin: 8px;
// 	display: flex;
// 	flex-direction: column;
// 	background-color: #FFFFFF;

// }
// .header-title{
// 	line-height: 26px;
// 	font-size: 16px;
// 	color: #333333;
// 	font-weight: 800;

// }
// .tip-style{
// 	font-size: 12px;
// 	margin-left: 6rpx;
// }
// .tag-style{
// 	line-height: 20px;
// 	font-size: 12px;
// 	text-align: center;
// 	width: 20px;
// 	border-radius: 4px;
// 	color: #FFFFFF;
// 	margin-right: 8px;
// }
// .header-sub-title{
// 	line-height: 20px;
// 	padding: 6px 0px;
// 	font-size: 12px;
// 	color: #999999;

// }
// .head-content{
// 	border-radius: 8px;
// 	background-color: #F5F5F5;
// 	padding: 8px 12px;
// 	font-size: 12px;
// 	color: #777777;
// 	display: flex;
// 	flex-direction: column;
// }
// .content-text{
// 	line-height: 20px;
// }
// .phone-icon{
// 	padding: 4px;
// 	background-color: #FFFFFF;
// 	color:#777777 ;
// 	width: 22px;
// 	height: 22px;
// 	text-align: center;
// 	line-height: 22px;
// 	border-radius: 50%;
// 	margin-right: 8px;
// }

// .btn-style {
// 	border-radius: 4px;
// 	font-size: 14px;
// 	display: flex;
// 	flex-direction: row;
// 	justify-content: center;
// 	align-items: center;
// 	flex: 1;
// 	border: 1px solid #E60000;
// 	margin-top: 12px;
// 	line-height: 34px;
// }
// .btn-style-left {
// 	color: #E60000;
// 	background-color: #FFFFFF;
// 	margin-right: 8px;
// }
// .btn-style-right {
// 	color: #FFFFFF;
// 	background-color: #E60000;
// 	margin-left: 8px;
// }
</style>
