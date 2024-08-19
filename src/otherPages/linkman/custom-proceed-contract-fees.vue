<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="flex-scroll-wrapper">
      <p class="title"><span class="line"></span>收款明细</p>
      <view class="form">
        <c-form-item label="租金（元）" required>
          <input class="input" type="digit" v-model="form.hire" @input="numInput($event,'hire')" placeholder="请输入">
        </c-form-item>
        <c-form-item label="索赔（元）" required>
          <input class="input" type="digit" v-model="form.claim" @input="numInput($event,'claim')" placeholder="请输入">
        </c-form-item>
        <c-form-item label="运费（元）" required>
          <input class="input" type="digit" v-model="form.carriage" @input="numInput($event,'carriage')" placeholder="请输入">
        </c-form-item>
        <c-form-item label="人工费（元）" required>
          <input class="input" type="digit" v-model="form.laborCost" @input="numInput($event,'laborCost')" placeholder="请输入">
        </c-form-item>
        <c-form-item label="逾期欠款（元）" required>
          <input class="input" type="digit" v-model="form.debt" @input="numInput($event,'debt')" placeholder="请输入">
        </c-form-item>
        <c-form-item label="代收手续费（元）" required>
          <input class="input" type="digit" v-model="form.serviceCharge" @input="numInput($event,'debt')" placeholder="请输入">
        </c-form-item>
      </view>
      <view class="text-gray text-right padding-lg">总计：￥{{form.total}}</view>
    </view>
    <view class="actions-footer-flex">
      <view class="btn z-btn bg-light-gray radius" @click="cancel">取消</view>
      <view class="btn z-btn bg-primary radius" @click="confirm">提交</view>
    </view>
  </div>
</template>
<script>
import {commonFeesAdjust} from './util'
export default {
  data(){
    return{
      form:{
        id:'',
        total:0,
        hire: 0,//租金
        claim: 0,//索赔
        carriage: 0,//运费
        laborCost: 0,//人工费
        debt: 0,//逾期
        serviceCharge: 0,//代收手续费 减法
      }
    }
  },
  onLoad(options){
    this.form = JSON.parse(options.data)
  },
  methods:{
    numInput(e,forceKey='debt'){
      this.$nextTick(_=>{
        let c = this.form
        //+serviceCharge -debt -laborCost -carriage -claim - hire
        let keys = ['debt','laborCost','carriage','claim','hire']
        let ops = [-1,-1,-1,-1,-1]
        // let keys = ['hire','claim','carriage','laborCost','debt','serviceCharge']
        // let ops = [-1,-1,-1,-1,-1,1]
        commonFeesAdjust(Number(c.total)+Number(c.serviceCharge),c,keys,ops,forceKey)
      })
    },
    cancel(){
      uni.navigateBack({ delta: 1 })
    },
    confirm(){
      var pages = getCurrentPages();
      pages[pages.length-2].$vm.modifyContract(this.form)
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>
<style lang="scss" scoped>
  .page{
    height:100%;
    @include flex(column);
  }
  
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding: 6px 0;
    margin: 4px 0;
    display: flex;
    align-items: center;
    .line {
      display: block;
      width: 2px;
      height: 80%;
      background-color: #e60000;
      margin-right: 10px;
    }
  }
  .form{
    padding:0 24rpx;
    background: $uni-bg-color;
    .input{
      flex:1;
      text-align: right;
    }
  }
</style>