<template lang="">
  <div>
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top">
      <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/esign-success.png"></image>
      <text class="text-bold margin-top-lg text-lg">签署发起成功</text>
      <text class="text-gray margin-top-xl">签署流程已发起，电签进度全部完成后，即签署完成。</text>
      <view class="z-btn line-primary margin-tb-xl" @click="back">返回详情</view>
    </view>
    
    <b-esign-timeline ref="timeline" :businessNo="businessNo"></b-esign-timeline>
  </div>
</template>
<script>
export default {
  components:{
  },
  onShow(){
    if(this.$refs.timeline) this.$refs.timeline.init()
  },
  onLoad(options){
    this.businessNo = options.businessNo;
    console.log(options,'00000000000');
    this.fromPath=options.fromPath||''
  },
  data(){
    return {
      businessNo:'',
      list:[1,2],
      fromPath:''
    }
  },
  methods:{
    back(){
      let delta=1;
      if(this.fromPath&&this.fromPath=='merge-signatures'){
        delta=2;
      }
      uni.navigateBack({
         delta
      });    
    },
    async onShareAppMessage({target,from}) {
      if (from === "button"&&target.dataset.type=='esign') {
        let url = target.dataset.url
        let title = target.dataset.title
        return {
          title,
          imageUrl:"https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
          path: `/otherPages/esign/webView?url=${encodeURIComponent(url)}&title=${title}`,
        }
      }
    },
  }
}
</script>
<style lang="scss">
.top{
  background: $uni-bg-color;
  @include flex(column,center);
  .img{
    width: 205rpx;
    height:198rpx;
    margin-top:33rpx;
  }
}
</style>