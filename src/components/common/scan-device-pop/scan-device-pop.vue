<template lang="">
  <uni-popup ref="pop" type="center" :mask-click="true">
    <view class="container">
      <image class="image" mode="heightFix" :src="imgUrl"></image>
      <div class="desc" v-if="licenseId">
        <div>
          车号“{{licenseId}}”
        </div>
        <div>请确认是否添加至设备档案</div>
      </div>
      <div class="desc" v-else>
        <div>很抱歉，无法识别，当前仅支持<text class="text-primary">SANY</text>设备扫码快速添加。</div>
      </div>
      <view class="btns">
        <view class="btn z-btn bg-light-gray radius" @click="close">取消</view>
        <view class="btn z-btn bg-primary radius" @click="add">{{licenseId?'':'手动'}}添加</view>
      </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  data(){
    return{
      licenseId:''
    }
  },
  computed:{
    imgUrl(){
      return this.licenseId ? '/static/device/scan-success.png' : '/static/device/scan-error.png'
    }
  },
  methods:{
    open(licenseId){
      this.licenseId = licenseId
      this.$refs.pop.open()
    },
    close(){
      this.$refs.pop.close()
    },
    async add(){
      if(this.licenseId){
        //调用接口添加设备{licenseId}
        await this.$network.machineScanCreate(this.licenseId)
        uni.showToast({title:'添加成功'})
      }else{
        //手动添加  跳转
        uni.navigateTo({ url: '/devicePages/record/device-record-add' })
      }
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>
  .container{
    box-sizing: border-box;
    width:504rpx;
    height:478rpx;
    @include flex(column,center,space-evenly);
    padding:0 38rpx;
    background: $uni-bg-color;
    .image{
      width:auto;
      height:180rpx;
    }
    .desc{
      font-size:$uni-font-size-base;
      line-height:40rpx;
      word-break: break-all;
    }
    .btns{
      width:100%;
      @include flex(row,center,space-between);
      .btn{
        width:196rpx;
        height:64rpx;
      }
    }
  }
</style>