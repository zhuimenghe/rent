<template lang="">
  <view class="page">
    <view class="card lr">
      <view class="header">
        <text class="title">报告编号：{{r.reportNo || ''}}</text>
        <view class="type" :class="[`t-${r.reportType}`]">{{REPORT_TYPE_NAME_MAP[r.reportType] || r.reportType}}</view>
      </view>
      <view class="desc-line">
        时间范围：{{r.reportStartDate | date}} ~ {{r.reportEndDate | date}}
      </view>
    </view>
    <view class="card">
      <view class="legend-header left">合同基本信息</view>
      <view class="info-box">
        <view class="line">
          <text class="label">合同名称：</text>
          <text class="value">{{r.contractName}}</text>
        </view>
        <view class="line">
          <text class="label">设备数量：</text>
          <text class="value">{{r.machineNum}}台</text>
        </view>
        <view class="line">
          <text class="label">业务负责人：</text>
          <text class="value">{{r.customerSalesmanName}}</text>
        </view>
        <view class="line">
          <text class="label">生成时间：</text>
          <text class="value">{{r.reportDate}}</text>
        </view>
      </view>
    </view>
    <view class="card">
      <view class="legend-header left">设备使用情况</view>
    </view>
    <view class="chart-panel">
      <view class="flex justify-between">
        <view class="data-card">
          <view class="icon-box">
            <text class="iconfont iconnaozhong text-warning"></text>
          </view>
          <view class="right">
            <view class="h">{{r.reportContent.machineUsageInfo.totalWorktime}}</view>
            <view class="d">实际总工作时长(h)</view>
          </view>
        </view>
        <view class="data-card">
          <view class="icon-box">
            <text class="iconfont icontixianfeishuai text-primary"></text>
          </view>
          <view class="right">
            <view class="h">{{r.reportContent.machineUsageInfo.workRate}}</view>
            <view class="d">开工率(%)</view>
          </view>
        </view>
      </view>
      <view class="card lr" v-if="jianchaData&&jianchaData.length">
        <view class="legend-header left text-df">剪叉车预警</view>
        <view class="flex align-center chart-box">
          <view class="total-info">
            <view class="title">总计</view>
            <view class="count">
              <text class="num">{{totalJiancha}}</text>
              <text>次</text>
            </view>
          </view>
          <canvas type="2d" canvas-id="piejiancha" id="piejiancha" class="chart" />
          <view class="legend">
            <view class="item" v-for="(d,i) in jianchaData" :key="i">
              <view class="icon" :style="{backgroundColor:d.color}"></view>
              <view class="name">{{d.name}}</view>
              <view class="count">{{d.data}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="card lr" v-if="bicheData&&bicheData.length">
        <view class="legend-header left text-df">臂车预警</view>
        <view class="flex align-center chart-box">
          <view class="total-info">
            <view class="title">总计</view>
            <view class="count">
              <text class="num">{{totalBiche}}</text>
              <text>次</text>
            </view>
          </view>
          <canvas type="2d" canvas-id="piebiche" id="piebiche" class="chart" />
          <view class="legend">
            <view class="item" v-for="(d,i) in bicheData" :key="i">
              <view class="icon" :style="{backgroundColor:d.color}"></view>
              <view class="name">{{d.name}}</view>
              <view class="count">{{d.data}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="card lr" :key="i" v-for="(w,i) in r.reportContent.machineWarnInfo">
      <view class="header">
        {{w.warnType}}
        <view class="licenseId">{{w.machineCode}}</view>
      </view>
      <view class="desc-line">
        <text class="flex-sub">持续时长：{{w.duration}}</text>
        <view class="fixed-right-w">车型：{{w.machineName}}</view>
      </view>
      <view class="desc-line">
        预警区间：{{w.startTime}} ~ {{w.endTime}}
      </view>
    </view>
    <view class="bottom-view" v-if="!r.reportNo">
			<view class="btn" @click="saveReport"><text>保存</text></view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import uCharts from "@/components/common/u-charts/u-charts"
import { mapState } from 'vuex';
import {canvas2dCtx} from '@/common/util/util';
import {REPORT_TYPE_NAME_MAP} from '@/common/constant'
import {fetchUseReportList,fetchReportByContractId,saveUseReport} from '@/network'
let charts={}
let colors = ['#027AFF', '#10CBE1', '#FE931F', '#6F62FF', '#FF6952']
export default {
  onLoad(options){
    console.log(options,'loadReportDataByReportNo');
    let {reportNo,contractId} = options
    //获取数据
    if(reportNo){
      this.loadReportDataByReportNo(reportNo)
    }else if(contractId){
      this.loadReportDataByContractId(contractId)
    }
  },
  filters:{
    date(dateStr){
      return dateStr ? dateStr.split(' ')[0] : '--'
    }
  },
  data(){
    return{
      r:{
        reportContent:{
          machineWarnStatistics:{},
          machineUsageInfo:{},
          machineWarnInfo:[]
        }
      },
      REPORT_TYPE_NAME_MAP,
      colors,
      totalJiancha:0,
      totalBiche:0,
    }
  },
  computed:{
		...mapState('system',{
      // #ifdef MP-WEIXIN
			pixelRatio:s=>s.systemInfo.pixelRatio,
      // #endif
      // #ifndef MP-WEIXIN
			pixelRatio:s=>1,
      // #endif
		}),
    jianchaData(){
      let d = this.r.reportContent.machineWarnStatistics['自行剪叉车']
      if(!d) return []
      this.totalJiancha = 0
      return Object.keys(d).map((k,i)=>{
        this.totalJiancha += d[k]
        return {
          name:k,
          data:d[k],
          unit: '台',
          color: colors[i%colors.length],
        }
      })
    },
    bicheData(){
      let d = this.r.reportContent.machineWarnStatistics['自行直臂车']
      if(!d) return []
      this.totalBiche = 0
      return Object.keys(d).map((k,i)=>{
        this.totalBiche += d[k]
        return {
          name:k,
          data:d[k],
          unit: '台',
          color: colors[i%colors.length],
        }
      })
    }
	},
  watch:{
    jianchaData(jianchaData){
      this.showPie('piejiancha',jianchaData)
    },
    bicheData(bicheData){
      this.showPie('piebiche',bicheData)
    }
  },
  methods:{
    async loadReportDataByContractId(contractId){ 
      this.r = await fetchReportByContractId(contractId)
    },
    async loadReportDataByReportNo(reportNo){
      let result = await fetchUseReportList({
        current:1,size:1,
        reportNo
      })
      console.log(result,'loadReportDataByReportNo');
      this.r = result&&result.records.length ? result.records[0] : {}
    },
    async saveReport(){
      let result = await saveUseReport(this.r)
      this.r = result
      uni.showToast({
        title:'保存成功'
      })
    },
    async showPie(canvasId,chartData){
      let cWidth = uni.upx2px(386);
			let cHeight = uni.upx2px(328);
			let context = uni.createCanvasContext(canvasId, this);
			// #ifdef MP-WEIXIN
			context = await canvas2dCtx('#'+canvasId,this)
			// #endif
			charts[canvasId] = new uCharts({
				context,
				width: cWidth*this.pixelRatio,
				height: cHeight*this.pixelRatio,
				padding: [20, 5, 5, 5],
				dataLabel: false,
				fontSize: 10,
				background: '#FFFFFF',
				pixelRatio: this.pixelRatio,
				animation: true,
				type: 'ring',
				legend: {
					show: false,
          // position:'right',
          // lineHeight:30 * this.pixelRatio,
          // padding:20
				},
				series: chartData,
				extra: {
					ring: {
						ringWidth: 6,
						labelWidth: 15
					}
				}
			});
    },
    showPieBiche(){

    }
  }
};
</script>
<style lang="scss" scoped>
.page{
  padding-bottom:calc(70px + env(safe-area-inset-bottom));
}
.card{
  background: $uni-bg-color;
  margin-top:20rpx;
  padding:24rpx 0;
  position: relative;
  &.lr{
    padding:24rpx;
  }
}
.legend-header{
  background: $uni-bg-color;
  padding:0 24rpx;
  font-size: $uni-font-size-lg;
  position: relative;
  font-weight: bold;
  &::before{
    content:'';
    display: block;
    width:8rpx;
    height:28rpx;
    background:$uni-color-primary;
    position: absolute;
    left:0;
    top:50%;
    transform: translateY(-50%);
  }
}
.header{
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-bottom: 20rpx;
  @include flex(row, center, space-between);
  .type {
    font-size: $uni-font-size-sm;
    padding: 8rpx 16rpx;
    border-radius: 6rpx;
    border: 1rpx solid #333;
    line-height: 1;
    &.t-1,
    &.t-2 {
      background: #fdf5e5;
      color: #f08200;
      border-color: #f08200;
    }
    &.t-3 {
      background: #fce5e5;
      color: #e60000;
      border-color: #e60000;
    }
    &.t-4 {
      background: #e7f1ff;
      color: #1278ff;
      border-color: #1278ff;
    }
  }
  .licenseId{
    width:350rpx;
    font-weight: normal;
    color:$uni-color-warning;
  }
}
.desc-line{
  @include flex(row);
  font-size:$uni-font-size-sm;
  color:$uni-text-color-gray;
  margin-top:20rpx;
}
.fixed-right-w{
  width:350rpx;
}
.info-box{
  margin:24rpx 24rpx 0 24rpx;
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
.chart-panel{
  padding: 14rpx 24rpx 0 24rpx;
  .data-card{
    width:340rpx;
    border-radius: 8rpx;
    background:$uni-bg-color;
    padding-top: 20rpx;
    padding-bottom: 24rpx;
    @include flex(row, center,normal);
    .icon-box{
      width:80rpx;
      text-align: center;
      font-size: 50rpx;
    }
    .right{
      .h{
        font-size:40rpx;
        font-weight: bold;
      }
      .d{
        font-size:$uni-font-size-sm;
        color:$uni-text-color-grey;
      }
    }
  }
}
.chart-box{
  position:relative;
}
.chart{
  width:386rpx;
  height:328rpx;
}
.legend{
  font-size:$uni-font-size-sm;
  margin-left:20rpx;
  flex:1;
  .item{
    height:60rpx;
    @include flex(row,center);
    .icon{
      width:15rpx;
      height:15rpx;
      margin-right:20rpx;
    }
    .name{
      flex:1;
      color:$uni-text-color-gray;
    }
    .count{
      font-weight: bold;
    }
  }
}
.total-info{
  position: absolute;
  z-index: 11;
  left:193rpx;
  top:calc(7px + 50%);
  transform: translate(-50%,-50%);
  @include flex(column,center);
  .title{
    color:$uni-text-color-grey;
    font-weight: bold;
    margin-bottom:8rpx;
  }
  .count{
    font-size: 36rpx;
    color:$uni-text-color-gray;
    .num{
      color:$uni-text-color;
      // $uni-color-primary;
      font-weight: bold;
      padding-right:12rpx;
    }
  }
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
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2000);
}

.btn{
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
	margin: 0 25rpx;
}
</style>