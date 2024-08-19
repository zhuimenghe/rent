<template>
  <scroll-view scroll-y :class="[prefixCls]" :scroll-top="scrollTop" @scrolltolower="scrollToBottom" @scroll="scroll" :lower-threshold="lowerThreshold">
    <view class="_inner">
      <slot></slot>
      <view v-if="showLoadmore">
        <uni-load-more :status="loadMoreStatus" v-if="loadMoreStatus" :contentText="{contentnomore:'没有更多内容了',contentrefresh:'正在加载...',contentdown:'上拉显示更多'}"></uni-load-more>
        <view class="empty-data-box" v-else>
          <image mode="widthFix" src="/static/empty.png"></image>
          <text class="text">{{emptyText}}</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
	export default {
		options:{
      styleIsolation:'shared'
    }, 
    beforeMount(){

    },
    props:{
      loadMoreStatus:{
        type:String,
        default:'',
        validator: function (value) {
          return ['more', 'loading','noMore',''].indexOf(value) !== -1
        }
      },
      showLoadmore:{
        type:Boolean,
        default:true
      },
      lowerThreshold:{
        type:Number,
        default:300
      },
      emptyText:{
        type:String,
        default:'暂无内容'
      }
    },
		data() {
			return {
        prefixCls:'com-list',
        scrollTop:0,
        currentTop:0
			}
		},
		computed:{
		},
		methods: {
      scrollToBottom(){
        if(this.loadMoreStatus&&this.loadMoreStatus!='loading'&&this.loadMoreStatus!='noMore'){
          this.$emit('loadmore')
        }
      },
      scroll: function(e) {
        this.currentTop = e.detail.scrollTop
      },
      backToTop(){
        this.scrollTop = this.currentTop
        this.$nextTick(()=>{
          console.log('nnmnm');
            this.scrollTop = 0
        });
      }
		}
	}
</script>

<style lang="scss">
  $prefix:com-list;
  .#{$prefix}{
    height:100%;
    flex:1;
    overflow:auto;
    position:relative;
    ._inner{
      padding-bottom:env(safe-area-inset-bottom);
      @include flex(column,initial,initial);
    }
  }
  .empty-data-box{
    margin-top:100rpx;
    margin-bottom:30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color:var(--text-color-gray);
    .icon{
      width:7600rpx;
    }
    .text{
      font-size: 28rpx;
    }
  }
</style>