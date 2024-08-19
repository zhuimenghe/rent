<template lang="">
  <view class="areas-box">
    <view class="item" :class="{active:city==a.city}" v-for="(a,i) in areas" :key="a.city" @click="pickCity(a.city)">{{a.city}}({{a.count}})</view>
  </view>
</template>
<script>
import { mapMutations, mapState,mapActions  } from 'vuex'
export default {
  computed:{
    ...mapState('construction',{
      areas:'areas',
      city:'city'
    })
  },
  methods:{
    ...mapActions('construction',['updateCity']),
    pickCity(city){
      if(this.city==city){
        city=''
      }
      this.updateCity(city)
      this.$emit('pick',city)
    }
  }
}
</script>
<style lang="scss">
  .areas-box{
    padding:20rpx 18rpx 4rpx 18rpx;
    @include flex(row,center,start);
    flex-wrap: wrap;
    .item{
      font-size:$uni-font-size-sm;
      padding:8rpx 16rpx;
      margin-right:16rpx;
      margin-bottom:16rpx;
      background: rgba(140,140,140,0.1);
      border-radius: 8rpx;
      border: 1rpx solid #8C8C8C;
      color: $uni-text-color-gray;
      line-height:1.6;
      &.active{
        background: rgba(230,0,0,0.1);
        border: 1rpx solid $uni-color-primary;
        color: $uni-color-primary;
      }
    }
  }
</style>