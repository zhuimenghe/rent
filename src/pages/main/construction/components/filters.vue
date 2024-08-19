<template lang="">
  <view class="filters">
    <view class="filters-bar" :style="{top:top+'px'}">
      <view class="item" v-for="f in filters" :key="f.key" :class="{active:f.active}" @tap="togglePop(f)">
        <text class="iconfont" :class="[f.icon]"></text>
        <text class="label">{{f.label}}</text>
      </view>
    </view>
    <c-left-pop from="left" :value="filters[0].active" @input="togglePop(filters[0],$event)" :top="top" :width="popWidth2">
			<view class="filter-box" :style="{maxHeight:maxHeight+'px'}">
        <scroll-view class="scroll flex-scroll-wrapper" scroll-y>
          <areas @pick="togglePop(filters[0])"></areas>
        </scroll-view>
      </view>
		</c-left-pop>
    <c-left-pop from="left" :value="filters[1].active" @input="togglePop(filters[1],$event)" :top="top" :width="popWidth">
			<view class="filter-box" :style="{maxHeight:maxHeight+'px'}">
        <scroll-view class="scroll flex-scroll-wrapper" scroll-y>
          <list @pick="togglePop(filters[1])"></list>
        </scroll-view>
      </view>
		</c-left-pop>
  </view>
</template>
<script>
import Areas from './areaFilters.vue'
import List from './listFilters.vue'
import { mapState,mapActions } from 'vuex'
export default {
  components:{
    Areas,
    List,
  },
  data(){
    return {
      showPop:false,
      popWidth:uni.upx2px(550),
      popWidth2:uni.upx2px(600),
      inTransition:false,
    }
  },
  computed:{
    ...mapState('system',{
      tabBarHeight:'tabBarHeight',
			top:s=>s.statusBarHeight + s.titleBarHeight+60,
      windowHeight:s=>s.systemInfo.windowHeight,
			navbarHeight:s=>s.statusBarHeight + s.titleBarHeight
		}),
    ...mapState('construction',{
      filters:'filters',
		}),
    maxHeight(){
      return this.windowHeight - this.top - this.tabBarHeight - uni.upx2px(200) - 60 -30; //-top - tabbar - 底部drawer - legend - 底部margin
    },
  },
  methods:{
    ...mapActions('construction',['toggleFilter','closeAllFilters']),
    togglePop(f,forceValue){
      if(forceValue!==undefined&&forceValue==f.active){
        return
      }
      this.toggleFilter(f)
      // if(!this.inTransition){
      //   this.inTransition = true
      //   let old = f.active
      //   let timeout = !!this.filters.find(f=>f.active) ? 150 : 0
      //   this.closeAllFilters()
      //   setTimeout(() => {
      //     this.updateFilter({...f,active:!old})
      //     this.inTransition = false
      //   }, timeout);
      // }
    }
  }
}
</script>
<style lang="scss">
  .filters-bar{
    box-shadow: 0px 0px 10rpx 0px rgba(0,0,0,0.2);
    border-radius: 10rpx;
    background: $uni-bg-color;
    width:80rpx;
    position: fixed;
    right:24rpx;
    padding:0 12rpx;
    color:$uni-text-color;
    line-height:1.6;
    .item{
      padding:18rpx 10rpx;
      @include flex(column,center,center);
      font-size: $uni-font-size-xs;
      // color:$uni-text-color-gray;
      @include hairline-bottom();
      &:last-child{
        @include hairline-none();
      }
      &.active{
        color:$uni-color-primary;
      }
      .iconfont{
        margin-bottom:6rpx;
        font-size: $uni-font-size-lg;
      }
      .label{
        line-height:1.6;
      }
    }
  }
  .filter-box{
    width:100%;
    padding-left:24rpx;
    box-sizing: border-box;
    @include flex(column);
    overflow: visible;
    .scroll{
      box-shadow: 0px 0px 14rpx 0px rgba(0,0,0,0.15);
      background: $uni-bg-color;
      border-radius: 10rpx;
    }
  }
</style>