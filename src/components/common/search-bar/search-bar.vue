<template>
  <view class="top-view">
    <view class="search-container">
      <view :style="{marginLeft:$slots.pre?'8px':0,color:'#1890ff'}">
        <slot name="pre"></slot>
      </view>
      <view class="search-box">
        <i class="iconfont search-icon iconzl--sousuo"></i>
        <view class="search-content">
          <input
            style="flex: 1;font-size: 14px;"
            :placeholder="placeholder"
            @input="searchChange"
            :value="value"
          />
        </view>
      </view>
      <view class="btns" v-if="showBtns">
        <slot name="btns"></slot>
        <view class="filter" @click="toggleFilter" v-if="showFilterBtn"><text>筛选</text></view>
        <slot name="btnsRight"></slot>
      </view>
    </view>
		<view class="mask" v-if="showfilter" @click="showfilter = false" @touchmove.stop="tm"></view>
    <view class="bottom-search" v-if="showfilter">
      <slot></slot>
      <view class="condition-btn">
        <view class="clear btn" @click="clear">重置</view>
        <view class="confirm btn" @click="ok">查询</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    value:{
			type:String,
			default:''
		},
		placeholder:{
			type:String,
			default:'输入关键词'
		},
    showBtns:{
      type:Boolean,
      default:true
    },
    showFilterBtn:{
      type:Boolean,
      default:true
    }
  },
  data(){
    return{
      showfilter:false
    }
  },
  methods:{
    tm(){},
    searchChange(e){
      this.$emit('input',e.detail.value)
    },
    toggleFilter(){
      this.showfilter = !this.showfilter;
    },
    clear(){
			this.showfilter = false;
      this.$emit('clear')
    },
    ok(){
      this.showfilter = false;
      this.$emit('ok')
    }
  }
};
</script>
<style lang="scss" scoped>
//搜索框
.top-view {
	z-index: 100;
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: 100;
	top: 0px;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
}
.mask{
	position:fixed;
	width:100vw;
	height:100vh;
	left:0;
	top:0;
	background:$uni-bg-color-mask;
}
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	width: 100%;
	position:relative;
	z-index: 400;
}
.bottom-search{
  position: absolute;
  top:100%;
  left:0;
  width:100%;
	background: #ffffff;
}
.tips {
	display: flex;
	margin: 5px 10px;
	margin-top: 0px;
	padding: 5px;
	background: #f0ad4e;
	color: #ff0000;
	font-size: $uni-font-size-sm;
}
.search-box {
	background: #f7f7f7;
	flex: 1;
	height: 35px;
	display: flex;
	margin: 16rpx 20rpx;
	flex-direction: row;
	padding-left: 10px;
	border-radius: 5px;
	justify-content: flex-start;
	align-items: center;
}

.search-icon {
	color: #999999;
	font-size: $uni-font-size-base;
}

.search-content {
	display: flex;
	flex: 1;
	color: #999999;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}

.condition-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
  margin:24rpx 0;
}
.clear {
	background-color: $uni-border-color;
}

.confirm {
	background-color: $uni-color-primary;
}
.btns{
  font-size: $uni-font-size-base;
	color: #333333;
  margin-right: 20rpx;
  @include flex(row,center);
  .filter{
    padding:12rpx 0;
  }
}
.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
}
</style>