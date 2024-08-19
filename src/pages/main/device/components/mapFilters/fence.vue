<template lang="">
  <view class="fence-box">
    <view class="header">电子围栏列表</view>
    <view class="list">
      <view class="item" v-for="(f,i) in fences" :key="i" @click="pickFence(f)">
        <view class="t">
          <text>{{f.name}}</text>
          <view class="margin-left cu-tag line-success bg-success light radius">{{f.radius ? f.radius+'米' : '多边形'}}</view>
          <view class="margin-left cu-tag line-warn bg-warn light radius">{{f.machineNum}}台</view>
        </view>
        <view class="b">
          <text class="iconfont icondingwei3 text-df margin-right-sm"></text>
          <text>{{f.address}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations,mapState } from 'vuex'
export default {
  data(){
    return {
    }
  },
  computed:{
    ...mapState('map',['fences'])
  },
  methods:{
    ...mapMutations('map',['updateFence']),
    pickFence(f){
      this.updateFence(f)
      this.$emit('pick',f)
    }
  }
}
</script>
<style lang="scss">
  .fence-box{
    .header{
      font-weight: bold;
      font-size: $uni-font-size-lg;
      padding:24rpx 22rpx;
    }
    .list{
      padding:0 22rpx;
      .item{
        padding:16rpx 0;
        @include hairline-bottom();
        &:last-child{
          @include hairline-none();
        }
        .t{
          @include flex(row,center,start);
        }
        .b{
          margin-top:10rpx;
          margin-bottom:4rpx;
          @include flex(row,center,start);
          color:$uni-text-color-gray;
          font-size: $uni-font-size-sm;
        }
      }
    }
    
  }
</style>