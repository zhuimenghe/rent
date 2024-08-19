<template lang="">
  <view class="list-box">
    <view class="filters">
      <view class="f" :class="{active:status=='warehouse'}" @click="toggleStatus('warehouse')">仓库({{counts.warehouse}})</view>
      <view class="f" :class="{active:status=='construction'}" @click="toggleStatus('construction')">施工点({{counts.construction}})</view>
    </view>
    <view class="list">
      <view class="item flex" v-for="(l,i) in filteredList" :key="i" @click="pick(l)">
        <text class="iconfont icondingwei3 text-df margin-right-sm color-gray margin-top-xs"></text>
        <view class="flex-1">
          <view>{{l.data.address}}</view>
          <view class="flex justify-between margin-top text-sm" v-if="l.isHome">
            <view class="text-gray">设备数量：剪{{l.data.machineMap['剪']||0}}|臂{{l.data.machineMap['臂']||0}}</view>
            <view class="text-error" v-if="l.data.lowPowerCount">低电量：{{l.data.lowPowerCount}}</view>
          </view>
          <view class="flex justify-between margin-top text-sm" v-else>
            <view class="text-gray">施工开始时间：{{l.data.startDate}}</view>
            <view class="text-error" v-if="l.data.lowPowerCount">低电量：{{l.data.lowPowerCount}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data(){
    return{
      sc:{
        'on':['line-success','bg-success'],
        'off':['line-gray','bg-gray'],
        'mal':['line-error','bg-error'],
      }
    }
  },
  computed:{
    ...mapState('construction',{
      markers:'markers',
      counts:'counts',
      status:'listStatus'
    }),
    filteredList(){
      if(this.status=='warehouse'){
        return this.markers.filter(m=>m.isHome)
      }else{
        return this.markers.filter(m=>!m.isHome)
      }
    }
  },
  methods:{
    ...mapMutations('construction',['setState']),
    ...mapMutations('map',['navToDevice']),
    toggleStatus(status){
      this.setState({listStatus:status})
    },
    pick(m){
      let centerLatitude = m.data.latitude
      let centerLongitude =  m.data.longitude
      this.navToDevice({centerLatitude,centerLongitude})
      this.$emit('pick',{centerLatitude,centerLongitude})
    }
  }
}
</script>
<style lang="scss">
  .list-box{
    .filters{
      @include flex(row,center);
      padding:24rpx 22rpx;
      .f{
        padding:8rpx 20rpx;
        margin-right:12rpx;
        background: #F5F5F5;
        border-radius: 100rpx;
        color:$uni-text-color-gray;
        &.active{
          background: rgba(230,0,0,0.1);
          color:$uni-color-primary;
        }
      }
    }
    .list{
      padding:0 22rpx;
      .item{
        padding:16rpx 0;
        @include hairline-bottom();
        &:last-child{
          @include hairline-none();
          margin-bottom:16rpx;
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