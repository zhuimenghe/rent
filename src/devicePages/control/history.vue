<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="head text-lg text-bold padding-lg flex align-center bg-page hair-border-top">
      <text>{{printCode || ''}}</text>
      <view class="flex-sub margin-left-sm">
        <view class="cu-tag sm round bg-error light text-sm text-normal">{{licenseId}}</view>
      </view>
      <text>共计：{{total}}条</text>
    </view>
    <c-loadmore-list scroll-y class="flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadmore">
      <view class="card bg-page margin-top-lg padding-lg" v-for="r in list" :key="r.id">
        <view class="text-bold">{{r.opType==1 ? '锁车':'解锁'}}</view>
        <view class="margin-top text-gray text-sm">
          <text>操作时间：{{r.opDate || '--'}}</text>
          <text class="margin-left-lg">操作人：{{r.opName}}</text>
        </view>
        <view class="margin-top text-gray text-sm">
          <text>执行时间：{{r.completeStatus==0 ? r.executionTime : '--'}}</text>
          <text class="margin-left-lg">执行结果：<text :class="[resultClass(r.completeStatus)]">{{r.completeStatusDesc}}</text></text>
        </view>
        <view class="margin-top text-gray text-sm" v-if="r.completeStatus==1">
          失败原因：{{r.sendStatus==6 ? '指令撤销' :'执行失败，请联系三一服务人员'}}
        </view>
      </view>
    </c-loadmore-list>
  </div>
</template>
<script>
import {fetchDeviceOpList,loadList} from '@/network'
export default {
  data(){
    return{
      morestatus:'more',
      list:[],
      licenseId:'',
      printCode:'',
      total:0,
    }
  },
  onLoad(options) {
    this.licenseId = options.licenseId
    this.printCode = options.printCode
    this.loadmore(true)
  },
  methods:{
    async loadmore(refresh=false){
      let {list,morestatus,total} = await loadList({
        list:this.list,
        requestHandler:fetchDeviceOpList,
        refresh,
        payload:{
          licenseIdList:[this.licenseId]
        }
      })
      this.list = list.map(d=>{
        return{
          ...d,
          finalMessage:d.completeStatus!==0 ? d.reqSuccessDesc||d.eviActionMessageDesc||d.sendStatusDesc||d.failureCauseDesc||'' : d.completeStatusDesc
        }
      })
      this.morestatus = morestatus
      this.total = total
    },
    resultClass(completeStatus){
      var map = {
        0:'text-success',
        1:'text-error',
        2:'text-warn',
        3:'text-warn',
      }
      return map[completeStatus]
    }
  }
}
</script>
<style lang="scss">
  .page{
    height:100%;
    @include flex(column);
  }
</style>