<template lang="">
  <view class="picker" @click="show">
    <view class="value" :class="{'text-gray':!value}">{{dateStr || '请选择'}}</view>
    <text class="iconfont" :class="[iconName||'iconzl--rili']"></text>
		<w-picker :mode="mode" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
  </view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
import util from '@/common/common-method/common-method';
export default {
  components:{
    wPicker
  },
  props:{
    value:[String,Date],
    iconName:String,
    mode:{
      default:'date',
      type:String
    }
  },
  computed:{
    dateStr(){
      if (!(this.value instanceof Date)) {
        return this.value
      }
      if(this.mode=='date'){
        return util.timeTransform(this.value,'yyyy-MM-dd')
      }else if(this.mode=='yearMonth'){
        return util.timeTransform(this.value,'yyyy-MM')
      }else if(this.mode=='year'){
        return util.timeTransform(this.value,'yyyy')
      }
    }
  },
  methods:{
    onConfirm({result}){
      this.$emit('input', result);
    },
    show(){
      this.$refs.date.show();
    }
  }
}
</script>
<style lang="scss" scoped>
  .picker{
    @include flex(row,center,normal);
    .iconfont{
      font-size: $uni-font-size-lg;
      color:$uni-text-color-grey;
      margin-left:8rpx;
    }
  }
</style>