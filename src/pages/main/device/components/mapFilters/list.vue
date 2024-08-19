<template lang="">
  <view class="list-box">
    <view class="filters">
      <view class="f" :class="{active:status=='on'}" @click="toggleStatus('on')">在线({{counts.on}})</view>
      <view class="f" :class="{active:status=='off'}" @click="toggleStatus('off')">离线({{counts.off}})</view>
      <view class="f" :class="{active:status=='mal'}" @click="toggleStatus('mal')">故障({{counts.mal}})</view>
    </view>
    <view class="list">
      <view class="item" v-for="(l,i) in filteredList" :key="i" @click="pick(l)">
        <view class="t">
          <text>{{l.data.licenseId}}</text>
          <view class="margin-left cu-tag line-success bg-success light radius" :class="sc[l.status]">{{l.statusText}}&nbsp;&nbsp;<text v-if='l.status=="off"'>&nbsp;&nbsp;{{getOffLineTime(l.data.offlineHours)||'-'}}</text></view>
        </view>
        <view class="b">
          <text class="iconfont icondingwei3 text-df margin-right-sm"></text>
          <text>{{l.data.address}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
export default {
  data(){
    return{
      sc:{
        'on':['line-success','bg-success'],
        'off':['bg-warning'],
        'mal':['line-error','bg-error'],
      }
    }
  },
  computed:{
    ...mapState('map',{
      markers:'markers',
      counts:'counts',
      status:'listStatus'
    }),
    filteredList(){
      if(this.status=='all'){
        return this.markers
      }else{
        return this.markers.filter(m=>m.status==this.status)
      }
    }
  },
  methods:{
    getOffLineTime(time){
      // time:hours
      time=time||0;
      let d=Math.floor(time/24);
      let h=(time%24).toFixed(1);
      return d?d+'天'+h+'小时':h+'小时'
    },
    ...mapMutations('map',['setState','navToDevice']),
    toggleStatus(status){
      this.setState({listStatus:status})
    },
    pick(m){
      let centerLatitude = m.data.amaplatitudeNum
      let centerLongitude =  m.data.amaplongitudeNum
      this.navToDevice({centerLatitude,centerLongitude})
      this.$emit('pick',{centerLatitude,centerLongitude})
    }
  }
}
</script>
<style lang="scss">
  .list-box{
    .filters{
      @include flex(row,center,space-between);
      padding:24rpx 22rpx;
      .f{
        padding:8rpx 20rpx;
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
        }
        .t{
          @include flex(row,center,start);
          .offline{
            color: $uni-color-success ;
            margin-left: 18rpx;
            font-size:  $uni-font-size-sm;
          }
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