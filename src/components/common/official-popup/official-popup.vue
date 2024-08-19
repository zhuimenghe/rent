<template lang="">
  <uni-popup ref="pop" type="center" :mask-click="true">
    <image
      class="banner"
      show-menu-by-longpress
      src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"
      mode="aspectFill"
    />
  </uni-popup>
</template>
<script>
// import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
  components:{
    // uniPopup
  },
  methods:{
    open(){
      this.$refs.pop.open()
    },
    close(){
      this.$refs.pop.close()
    }
  }
}
</script>
<style lang="scss" scoped>
  .banner{
    width:596rpx;
    height:610rpx;
    // margin-bottom:100px;
  }
</style>