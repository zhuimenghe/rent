<template lang="">
  <view class="card bg" >
    <view class="content">
      <view class="contract-head hairline">
        <text class="iconfont iconwangqianguanli-copy"></text>
        <!-- iconhetong4 -->
        <view class="flex-1">
          <view class="name">{{c.customerName}}-{{c.contractDetailDto?c.contractDetailDto.projectName:''}}</view>
          <view class="sub margin-top">
            <view>{{c.orderSum}}</view>
          </view>
        </view>
      </view>
      <view class="text-sm text-gray">
        <view class="flex padding-top">
          <text class="flex-1">进退场：进{{c.workInCount ||0}} |退{{c.workOutCount ||0}}</text>
          <text class="flex-1">历史实收：￥{{(c.receiptDto&&c.receiptDto.total)||0}}</text>
        </view>
        <view class="flex padding-top">
          <text class="flex-1">履约营收：￥{{c.receivableDto ? c.receivableDto.total : 0}}</text>
          <text class="flex-1">履约欠款：￥{{ (c.receivableDto&&c.receivableDto.total)-(c.receiptDto&&c.receiptDto.total)}}</text>
        </view>
        <view class="flex padding-tb">
          <text class="flex-1">结算营收：￥{{c.settlement||0}}</text>
          <text class="flex-1">结算欠款：￥{{c.settlement - (c.receiptDto&&c.receiptDto.total)}}</text>
        </view>
      </view>
    </view>
    <view class="total-hire">
      <text>金额分配（元）</text>
      <input type="digit" v-model="c.total" @input="totalInput" placeholder="请输入">
    </view>
    <view class="text-primary text-right padding-right padding-tb" @click="gotoFees">
      详细分配 
      <text class="iconfont iconarrow-right margin-left text-lg text-bold"></text>
    </view>
    <view class="text-gray text-sm">
      <view class="flex padding-bottom-lg">
        <text class="flex-1 padding-left">租金：￥{{c.hire}}</text>
        <text class="flex-1">索赔：￥{{c.claim}}</text>
        <text class="flex-1">运费：￥{{c.carriage}}</text>
      </view>
      <view class="flex flex padding-bottom-lg">
        <text class="flex-1 padding-left">人工费：￥{{c.laborCost}}</text>
        <text class="flex-1">逾期欠款：￥{{c.debt}}</text>
        <text class="flex-1">代收手续费：￥{{c.serviceCharge}}</text>
      </view>
    </view>
  </view>
</template>
<script>
import {commonFeesAdjust} from '../util'
export default {
  props:{
    c:{
      type:Object,
      default() {
				return {
          total:0,//总额
          hire: 0,//zujin
          claim: 0,//索赔
          carriage: 0,//运费
          laborCost: 0,//人工费
          debt: 0,//逾期
          serviceCharge: 0,//代收手续费 减法
        };
			}
    }
  },
  watch:{
    'c.total':function(total,old){
      this.updateContractFees()
    },
  },
  methods:{
    totalInput(e){
      this.c.total = Number(e.detail.value)
      this.$emit('totalChange',this.c.total)
    },
    updateContractFees(forceKey='debt'){
      this.$nextTick(_=>{
        let c = this.c
        //+serviceCharge -debt -laborCost -carriage -claim - hire
        let keys = ['debt','laborCost','carriage','claim','hire']
        let ops = [-1,-1,-1,-1,-1]
        // let keys = ['hire','claim','carriage','laborCost','debt','serviceCharge']
        // let ops = [-1,-1,-1,-1,-1,1]
        commonFeesAdjust(Number(c.total)+Number(c.serviceCharge),c,keys,ops,forceKey)
        this.$emit('change',this.c)
      })
      // this.contracts = this.contracts.slice()
      // this.$set(this.contracts,index,c)
    },
    gotoFees(){
      uni.navigateTo({
        url: `/otherPages/linkman/custom-proceed-contract-fees?data=${JSON.stringify(this.c)}`
      });
    },
  },
}
</script>
<style lang="scss" scoped>
@import './custom-detail.scss';
.card{
    margin-bottom:24rpx;
    margin-top:0!important;
  }
  .total-hire{
    background:$uni-bg-color-gray;
    height:88rpx;
    padding-left:24rpx;
    color:$uni-text-color-gray;
    @include flex(row,center);
    input{
      padding:12rpx 24rpx;
      flex:1;
      text-align: right;
      font-size: $uni-font-size-base;
    }
  }
</style>