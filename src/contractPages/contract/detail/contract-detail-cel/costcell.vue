<!-- 成本 -->
<template>
  <view class="cellBgView">
    <view class="cell-text">
      <view class="cell-text-left fontBlackcolor" style="color: #000000"
        ><text>{{ dic.businessNo || "--" }}</text></view
      >
      <view class="cell-text-right fontgreencolor"
        ><text>{{ dic.stateName || "--" }}</text></view
      >
    </view>
    <view class="cell-text">
      <view class="cell-text-left fontsubcolor"><text>支出日期</text></view>
      <view class="cell-text-right fontBlackcolor">
        <text>{{ changestr(dic.payDate) }}</text>
      </view>
    </view>
    <view class="cell-text">
      <view class="cell-text-left fontsubcolor"><text>支出方式</text></view>
      <view class="cell-text-right fontBlackcolor">
        <text>{{ dic.payTypeName || "--" }}</text>
      </view>
    </view>
    <view class="cell-text">
      <view class="cell-text-left fontsubcolor"><text>支出总额</text></view>
      <view class="cell-text-right fontBlackcolor">
        <text>{{ saveTwo(dic.totalRentalPay) || 0 }}元</text>
      </view>
    </view>
    <view class="cell-text">
      <view class="cell-text-left fontsubcolor"><text>支出人</text></view>
      <view class="cell-text-right fontBlackcolor">
        <text>{{ dic.payUserName || "--" }}</text>
      </view>
    </view>
    <view class="cell-text">
      <view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
      <view class="cell-text-right fontBlackcolor">
        <text>{{ dic.customerSalesmanName || "--" }}</text>
      </view>
    </view>
    <view class="line-s" />
    <view class="cell-text-right fontdetailcolor" @click="goTo"
      ><text>详情</text></view
    >
  </view>
</template>
<script>
export default {
  props: {
	name:'cost-cell',
    dic: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
    console.log(this.dic, "dic");
  },
  methods: {
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
    goTo() {
      let businessNostr = this.dic.businessNo;
	  let id=this.dic.businessNo;
      let businessKey = this.dic.businessKey;
      let url = '/businessPages/cost-manage/cost-detail?businessNo=' + businessNostr + '&businessKey=' + businessKey+ '&id=' + id;
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cellBgView {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding:6px 0 10px 0;
  margin: 10px;
  background: #ffffff;
}

.cell-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
}

.cell-text-left {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-left: 15px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.cell-text-right {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-right: 15px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}

.fontBlackcolor {
  color: $uni-text-color;
}

.fontdetailcolor {
  color: $uni-color-primary;
}

.fontgreencolor {
  color: #4cd964;
}

.line-s {
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: #eeeeee;
}
</style>
