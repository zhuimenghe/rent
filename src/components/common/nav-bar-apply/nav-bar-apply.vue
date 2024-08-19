<template lang="">
  <c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">
    <slot></slot>
    <template v-slot:fixed>
      <slot name="fixed"></slot>
    </template>
  </c-nav-bar-btns>
</template>
<script>
export default {
  options:{
    styleIsolation:'shared'
  },
  props:{
    businessKey:String
  },
  data(){
    return{
      buttons:[
        {
          "text": "审批流",
          "type": "none",
          "fontSize": "14px",
          "color": "#E60000",
        }
      ]
    }
  },
  methods:{
    onNavBarButtonTap(){
      let url = '/businessPages/workin/work-flow-display?businessKey=' + this.businessKey;
      uni.navigateTo({
        url: url
      });
    }
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