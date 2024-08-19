<template lang="">
  <c-nav-bar flexAlign="center">
    <view class="header">
      <template v-for="(b,i) in buttons">
        <text class="btn" v-if='b.isShow' @click="$emit('onNavBarButtonTap',{index:i,btn:b,text:b.text})"  :key="i" :style="{fontSize:b.fontSize||defaultFontSize,color:b.color}">{{b.text}}</text>
      
      </template>
      <text class="title">
        <slot></slot>
      </text>
    </view>
    <template v-slot:fixed>
      <slot name="fixed"></slot>
    </template>
  </c-nav-bar>
</template>
<script>
export default {
  options:{
    styleIsolation:'shared'
  },
  props:{
    buttons:{
      type:Array,
      default:[]
    },
    defaultFontSize:'16px'
  }
}
</script>
<style lang="scss">
  ::v-deep .com-nav-bar{
    &-inner{
      &-header{
        background-color: #fff;
        ._title{
          padding-right: 0rpx!important;

        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .header{
    background-color: #fff !important;
    width:100%;
    /* #ifdef MP */
    @include flex(row,center,flex-start);
    /* #endif */
    /* #ifdef APP-PLUS */
    @include flex(row,center,flex-end);
    /* #endif */
    position: relative;
    .btn{
      padding:20rpx 14rpx;
      font-family: 'iconfont';
      width: 84px;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #181818;
    }
    .title{
      position:absolute;
      top:50%;
      left:calc(50% - 30rpx);
      transform: translate3d(-50%,-50%,0);
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #181818;
    }
  }
</style>