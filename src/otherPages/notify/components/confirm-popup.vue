<template lang="">
  <uni-popup ref="pop" type="center" @maskClick="cancel" @touchmove.stop="tm">
    <view class="popup">
      <view class="text-center text-xl text-bold">提示</view>
      <view class="reason">
        <view style="border:1px solid #ccc;padding:5px;margin-top:10px;overflow:hidden;box-sizing:border-box">
          <textarea
            v-model="remark"
            placeholder-style="color:#8c8c8c;font-size:14px;"
            placeholder="请输入处理备注"
          />
        </view>
      </view>
      <view class="flex justify-between margin-top-xl">
        <view style="width:236rpx;background:#F4F3F8;color:#8c8c8c" class="z-btn bg-light-gray radius" @click="cancel">取消</view>
        <view style="width:236rpx" class="z-btn bg-primary radius" @click="confirm">确定</view>
      </view>
    </view>
    </view>
  </uni-popup>
</template>
<script>
export default {
  data(){
    return{
      remark:'',
      resolve:null
    }
  },
  methods:{
    tm(){},
    open(){
      this.remark = ''
      this.$refs.pop.open()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
      });
    },
    cancel(){
      this.$refs.pop.close()
      this.resolve({
        confirm:false,
      })
    },
    confirm(){
      this.$refs.pop.close()
      this.resolve({
        confirm:true,
        data:this.remark
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 40rpx;
    background: $uni-bg-color;
  }
  .reason {
    margin-top: 30rpx;
    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }

    textarea {
      width:100%;
      height: 150rpx;
    }
  }
</style>