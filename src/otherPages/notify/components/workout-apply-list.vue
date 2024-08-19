<template lang="">
  <div class="page">
    <c-search-bar placeholder="姓名/手机号" :showFilterBtn="false" :value="keyword" @input="keywordInput">
    </c-search-bar>
    <c-loadmore-list class="flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadData">
      <view class="card" v-for="(m,i) in list" :key="i">
        <view class="title">
          {{m.name}}（{{m.phone}}）
        </view>
        <view class="body">
          <view class="line">
            <text class="label">设备类型：</text>
            <text class="">{{machineName(m.machineType)}}</text>
          </view>
          <view class="line">
            <text class="label">高度：</text>
            <text class="">{{m.machineHeight}}</text>
          </view>
          <view class="line">
            <text class="label">接收时间：</text>
            <text class="">{{m.uploadTime | dateFormat('yyyy-MM-dd HH:mm:ss')}}</text>
          </view>
          <view class="line">
            <text class="label">来源：</text>
            <text class="">{{m.resource}}</text>
          </view>
          <view class="line">
            <text class="label">状态：</text>
            <text class="">{{m.handleStatus=='0' ? '未处理':'已处理'}}</text>
          </view>
          <view class="line" v-if="m.handleStatus=='1'">
            <text class="label">处理备注：</text>
            <text class="">{{m.handleResult}}</text>
          </view>
        </view>
        <view class="actions" >
          <view class="z-btn line-primary round" v-if="m.handleStatus=='0'" @click="deal(m)">处理</view>
        </view>
      </view>
    </c-loadmore-list>
    <pop ref="pop"></pop>
  </div>
</template>
<script>
import { debounce } from '@/common/util/util';
import Pop from './confirm-popup.vue';
export default {
  components:{
    Pop
  },
  data() {
    return {
      morestatus: 'more',
      keyword: '',
      list: [],
    }
  },
  methods:{
    keywordInput: debounce(function (val) {
      this.keyword = val
      this.loadData(true)
    }, 500),
    async loadData(refresh = false){
      let { list, morestatus } = await this.$network.loadList({
        list: this.list,
        requestHandler: this.$network.workApplyList,
        refresh,
        payload: {searchparam:this.keyword,type:'1'}
      })  
      this.list = list
      this.morestatus = morestatus
    },
    machineName(mt){
      //1-自行剪叉式；2-自行曲臂式；3-自行直臂式；4-其他
      let types = {
        '1':'自行剪叉式',
        '2':'自行曲臂式',
        '3':'自行直臂式',
        '4':'其他',
      }
      return types[mt]
    },
    async deal(m){
      let res = await this.$refs.pop.open()
      if(res.confirm){
        await this.$network.handleWorkApply(m.id,res.data)
        m.handleStatus='1'
        m.handleResult=res.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .page{
    height:100%;
    @include flex(column);
    .card{
      margin-top:24rpx;
      background:#fff;
      padding:0 24rpx;
      .title{
        font-weight:bold;
        padding:24rpx 0;
        font-size:32rpx;
      }
      .body{
        background:#f6f6f6;
        padding:0 20rpx;
        overflow:auto;
        .line{
          @include flex(row,center);
          margin:16rpx 0;
          .label{
            color:#8c8c8c;
          }
        }
      }
      .actions{
        @include flex(row,center,flex-end);
        padding:24rpx 0;
      }
    }
  }
</style>