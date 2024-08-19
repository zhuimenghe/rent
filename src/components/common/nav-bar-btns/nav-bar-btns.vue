<template lang="">
  <c-nav-bar flexAlign="center">
    <view class="header">
      <text class="btn" @click="$emit('onNavBarButtonTap',{index:i,btn:b,text:b.text})" v-for="(b,i) in buttons" :key="i" :style="{fontSize:b.fontSize||defaultFontSize,color:b.color}">{{b.text}}</text>
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
        ._title{
          padding-right: 0rpx!important;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .header{
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
      // margin-right:10px;
    }
    .title{
      position:absolute;
      top:50%;
      left:calc(50% - 30rpx);
      transform: translate3d(-50%,-50%,0);
    }
  }
</style>