<template lang="">
  <view class="card" :class="[type]" @click="gotoDetail">
    <view class="header">
      <text class="title">{{type=='m'?'报告':''}}编号：{{item.reportNo}}</text>
      <view class="type" :class="[`t-${item.reportType}`]">{{REPORT_TYPE_NAME_MAP[item.reportType] || item.reportType}}</view>
    </view>
    <view class="date-line">
      时间范围：{{item.reportStartDate | date}} ~ {{item.reportEndDate | date}}
    </view>
    <view class="info">
      <view class="line">
        <text class="label">合同名称：</text>
        <text class="value">{{item.contractName}}</text>
      </view>
      <view class="line">
        <text class="label">设备数量：</text>
        <text class="value">{{item.machineNum}}台</text>
      </view>
      <view class="line">
        <text class="label">业务负责人：</text>
        <text class="value">{{item.customerSalesmanName}}</text>
      </view>
      <view class="line">
        <text class="label">生成时间：</text>
        <text class="value">{{item.reportDate}}</text>
      </view>
    </view>
  </view>
</template>
<script>
import {REPORT_TYPE_NAME_MAP} from '@/common/constant'
export default {
  options:{
    styleIsolation:'shared'
  }, 
  filters:{
    date(dateStr){
      return dateStr ? dateStr.split(' ')[0] : '--'
    }
  },
  props:{
    item:Object,
    type:{
      type:String,
      default:'m'
    }
  },
  data(){
    return{
      REPORT_TYPE_NAME_MAP
    }
  },
  methods:{
    gotoDetail(){
      uni.navigateTo({
        url:`/businessPages/useReport/use-report-detail?reportNo=${this.item.reportNo}`
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .card{
    background: $uni-bg-color;
    padding:22rpx 24rpx;
    .header{
      font-size:$uni-font-size-lg;
      font-weight:bold;
      margin-bottom:24rpx;
      @include flex(row,center,space-between);
      .type{
        font-size:$uni-font-size-sm;
        padding:8rpx 16rpx;
        border-radius: 6rpx;
        border:1rpx solid #333;
        line-height:1;
        white-space: nowrap;
        &.t-1,&.t-2{
          background:#fdf5e5;
          color:#F08200;
          border-color: #F08200;
        }
        &.t-3{
          background:#fce5e5;
          color:#E60000;
          border-color: #E60000;
        }
        &.t-4{
          background:#e7f1ff;
          color:#1278FF;
          border-color: #1278FF;
        }
      }
    }
    .date-line{
      margin-bottom:24rpx;
      font-size:$uni-font-size-sm;
      color:$uni-text-color-gray;
    }
    .info{
      border-radius: 6rpx;
      background: $uni-bg-color-grey;
      overflow: auto;
      padding:0 20rpx;
      .line{
        margin:16rpx 0;
        @include flex(row);
        font-size: $uni-font-size-base;
        .label{
          color:$uni-text-color-gray;
        }
        .value{

        }
      }
    }
  }
</style>