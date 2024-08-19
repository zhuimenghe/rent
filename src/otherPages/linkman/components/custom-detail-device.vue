<template lang="">
  <view>
    <!-- <view> -->
      <!-- <view class="contract-head hairline padding-lr">
        <text class="iconfont iconwangqianguanli-copy"></text>
        <view class="flex-1">
          <view class="name">河南维嘉机械有限公司-昆山南站项目</view>
          <view class="sub margin-top">
            <view>约定：8台（在租：4台 退场：4台）</view>
          </view>
        </view>
      </view> -->
      <view class="card device-card" v-for="(m,i) in list" :key="i">
        <view class="device-head">
          <view class="text-bold text-lg">{{m.licenseId}}
            <span v-if="m.printCode">（{{m.printCode}}）</span>
          </view> 
          <view class="margin-top flex justify-between">
            <view class="text-gray">{{m.typeName}} | {{m.machineTypeName}} | {{m.heightName}}</view>
            <text class="text-success" :class="[m.settleDate?'text-warn':'text-success']">{{m.settleDate ? '已退租' : '租赁中'}}</text>
          </view>
        </view>
        <view class="detail" :class="{opened:m.opened}">
          <view class="line margin-top">
            <view class="flex-3">
              租金单价：
              <span v-if="m.settlementType==1">￥{{m.hire}}/天</span>
              <span v-else-if="m.settlementType==4">￥{{m.hire}}/天、￥{{m.hireMonthly}}/月</span>
              <span v-else>￥{{m.hire}}/月</span>
            </view>
            <view class="flex-2">履约租期：{{getTenancyFn(m)}}</view>
          </view>
          <view class="line">
            <view class="flex-3">
              运费：￥{{m.carriage}}
            </view>
            <view class="flex-2">报停天数：{{m.pauseDays}}天</view>
          </view>
          <view class="line">
            <view class="flex-3">
              押金：￥{{m.pledge}}
            </view>
            <view class="flex-2">索赔：￥{{m.claimTotal}}</view>
          </view>
          <view class="line">进退日期：{{m.enableDate?m.enableDate.split(' ')[0]:'--'}}~{{m.settleDate?m.settleDate.split(' ')[0]:'--'}}</view>
          <view class="line margin-bottom">起算/截止日期：{{m.beginDate?m.beginDate.split(' ')[0]:'--'}}~{{m.endDate?m.endDate.split(' ')[0]:'--'}}</view>
        </view>
        <view class="footer">
          <view class="text-lg">
            履约租金：<text class="text-warn">￥{{moneyUtil.dealNumber(m.hireTotal)}}</text>
          </view>
          <view class="text-primary flex align-center" @click="toggle(i)">
            {{m.opened?'收起':'查看详细数据'}}
            <text class="iconfont iconarrow-down text-bold text-xl" :class="{opened:m.opened}"></text>
          </view>
        </view>
      </view>
      <view v-if="!list||!list.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    <!-- </view> -->
  </view>
</template>
<script>
import calRent from "@/common/util/cal-rent-money.js";
export default {
  props:{
    c:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data(){
    return{
      list:[]
    }
  },
  methods:{
    async init(id){
      this.list = await this.$network.machineByCustomer({
        customerId:id||this.c.id,
      })
    },
    getTenancyFn(row) {
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";

      return calRent.calculationTenancy(
        row.settlementType,
        row.beginDate,
        row.endDate,
      );
    },
    toggle(i){
      this.list[i].opened=!this.list[i].opened
      this.$set(this.list,i,this.list[i])
    }
  }
}
</script>
<style lang="scss">
@import './custom-detail.scss';
.device-card{
  padding:0 20rpx;
  margin-bottom:24rpx;
  margin-top:0rpx!important;
  .device-head{
    padding:20rpx 0;
  }
  .detail{
    overflow: hidden;
    box-sizing:border-box;
    @include hairline-top();
    font-size:24rpx;
    color:$uni-text-color-gray;
    .line{
      @include flex(row,center,flex-start);
      padding:8rpx 0;
    }
    transition:height 0.3s ease-in-out;
    height:0;
    @include flex(column,normal,center);
    &.opened{
      height:272rpx
    }
  }
  .footer{
    background:$uni-bg-color;
    height:90rpx;
    @include hairline-top();
    @include flex(row,center,space-between);
    .iconfont{
      transition:transform 0.3s ease-in-out;
      &.opened{
        transform:rotate(180deg);
      }
    }
  }
}
  
</style>