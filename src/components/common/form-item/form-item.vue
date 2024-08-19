<template>
  <div class="item-wrapper" :class="{borderless:borderless,col:isCol}"> 
    <div class="label" :class="{required:required}">
      {{label}}
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props:{
    label:{
      type:String,
      default:''
    },
    required:Boolean,
    borderless:Boolean,
    isCol:{
      type:Boolean,
      default:false
    }
  }
}
</script>
<style lang="scss" scoped>
  .item-wrapper{
    padding:23rpx 0;
    @include hairline-bottom();
    @include flex(row,center,space-between);
    &.col{
      @include flex(column,flex-start,space-between);
      .label{
        padding-bottom:23rpx;
      }
    }
    &.borderless{
      &::after{
        border:none;
      }
    }
    font-size: $uni-font-size-base;
    .label{
      color:#8C8C8C;
      &.required{
        &:after{
          content:'*';
          color:red;
        }
      }
    }
  }
</style>