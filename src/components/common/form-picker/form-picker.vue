<template lang="">
  <view class="picker flex" @click="show">
    <view class="value flex-sub"  :class="[!isEmpty(value)?'text-black':'text-gray']">{{!isEmpty(value) ? label : placeholder}}</view>
    <text class="iconfont" :class="[`iconarrow-${arrowMode}`]"></text>
		<w-picker :selectList="list" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
  components:{
    wPicker
  },
  props:{
    list:Array,
    value:[String,Number,Boolean],
    arrowMode:{
      type:String,
      default:'right'
    },
    placeholder:{
      type:String,
      default:'请选择'
    },
    isEmpty:{
      type:Function,
      // #ifdef H5
      default:(v)=>{
        return v==undefined||v==null
      },
      // #endif
      // #ifdef MP
      default:function(){
        return (v)=>{
          return v==undefined||v==null
        }
      }
      // #endif
    }
  },
  computed:{
    label(){
      if(this.list){
        let found = this.list.find(d=>d.value==this.value)
        return found ? found.label : ''
      }else{
        return ''
      }
    }
  },
  methods:{
    onConfirm({checkArr}){
      this.$emit('input', checkArr.value)
    },
    show(){
      this.$refs.selector.show();
    }
  }
}
</script>
<style lang="scss" scoped>
  .picker{
    @include flex(row,center,normal);
    .iconfont{
      font-size: $uni-font-size-xl;
      color:$uni-text-color-grey;
      margin-left:8rpx;
    }
  }
</style>