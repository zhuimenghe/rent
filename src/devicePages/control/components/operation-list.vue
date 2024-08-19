<template lang="">
  <div class="list">
    <c-search-bar placeholder="自喷码/车号" :value="filter.keywords" @input="keywordInput" @clear="onClear" @ok="search">
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <c-form-picker arrowMode="down" placeholder="操作类型" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="opList" v-model="filter.opType"></c-form-picker>
        <c-form-picker arrowMode="down" placeholder="操作人" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="userList" v-model="filter.opUserId"></c-form-picker>
        <c-form-picker arrowMode="down" placeholder="执行结果" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="resultList" v-model="filter.completeStatus"></c-form-picker>
        <!-- <selectView class="flex-sub" :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" /> -->
        <!-- <selectView class="flex-sub" :value='reportType.label' hint='报告类型' @clickSelect="showPick('reportType')" /> -->
      </view>
    </c-search-bar>
    <c-loadmore-list scroll-y class=" flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadmore">
      <view class="card margin radius" v-for="o in list" :key="o.id">
        <view class="head">
          <view class="icon">
            <text class=" iconfont" :class="[o.type==0?'iconzl--jiesuo text-success':'iconzl--suoche text-error']"></text>
          </view>
          <view class="margin-left flex-sub">
            <view class="flex">
              <text class="text-lg">{{o.opName}}</text>
              <text class="margin-left-xl">
                {{o.type==1 ? '锁车' : '解锁'}} <text class="text-error">{{o.machineLockItemList.length}}</text> 台
              </text>
            </view>
            <text class="text-sm text-gray">
              {{o.opDate}}
            </text>
          </view>
          <view class="text-primary text-sm flex align-center" v-if="o.machineLockItemList.length>1" @click="toggleExpand(o)">
            {{o.expanded ? '收起':'更多'}}
            <text class="iconfont iconarrow-down margin-left-sm text-xl" :class="[o.expanded ? 'expanded':'']"></text>
          </view>
        </view>
        <view class="content padding-lr">
          <view class="item" v-for="d in getItemList(o)" :key="d.id">
            <view class="flex align-center">
              <text class="text-lg">{{d.printCode || ''}}</text>
              <view class="flex-sub">
                <view class="cu-tag sm text-sm round bg-error light margin-left-sm">{{d.licenseId}}</view>
              </view>
              <text :class="[resultClass(d.completeStatus)]">{{d.completeStatusDesc}}</text>
            </view>
            <view class="margin-top-sm text-gray text-sm">
              <text>序列号：{{d.orderId || ''}}</text>
              <text class="margin-left-xl" v-if="d.completeStatus==1">失败原因：{{d.sendStatus==6 ? '指令撤销' :'执行失败，请联系三一服务人员'}}</text>
            </view>
            <view class="margin-top-sm text-gray text-sm">
              执行时间：{{d.completeStatus==0 ? d.executionTime : '--'}}
            </view>
            <view class="text-gray text-sm" style="width:96%;overflow:hidden" v-if="o.type!=0&&o.opReason">
              锁车原因：{{ o.opReason||'-' }}
            </view>
          </view>
        </view>
      </view>
    </c-loadmore-list>
  </div>
</template>
<script>
import {debounce} from '@/common/util/util';
import {fetchOperationList,loadList} from '@/network';
let defaultFilter = {
  keywords:'',
  opType:null,
  opUserId:null,
  completeStatus:null,
}
export default {
  data(){
    return{
      filter:{...defaultFilter},
			morestatus: 'more',
      opList:[{value:0,label:'解锁'},{value:1,label:'锁车'}],
      userList:[],
      resultList:[{value:0,label:'成功'},{value:1,label:'失败'},{value:2,label:'锁车执行中'},{value:3,label:'解锁执行中'}],
      list:[],
    }
  },
  created(){
    this.loadOwnerList()
  },
  methods:{
    keywordInput:debounce(function(val){
      this.filter.keywords = val
      this.loadmore(true)
    },500),
    onClear(){
      this.filter = {...defaultFilter}
      this.search()
    },
    search(){
      this.loadmore(true)
    },
    async loadOwnerList() {
      let param = {
        showAdmin: false,
      };
      let result = await this.$network.getData(this.$url.USER_LEADERS, 'GET', param)
      this.userList = [{
        label: '全部',
        value: ''
      }];
      this.userList = this.userList.concat(
        result ?
        result.map(dict => {
          return {
            label: dict.username,
            value: dict.id
          };
        }) : []
      );
    },
    async loadmore(refresh=false){
      let params = {
        ...this.filter,
        completeStatus:this.filter.completeStatus!==null ? [this.filter.completeStatus] : []
      }
      let {list,morestatus} = await loadList({
        list:this.list,
        requestHandler:fetchOperationList,
        refresh,
        payload:params
      })
      this.list = list.map(o=>{
        o.machineLockItemList.forEach(d=>{
          d.finalMessage=d.completeStatus!==0 ? d.reqSuccessDesc||d.eviActionMessageDesc||d.sendStatusDesc||d.failureCauseDesc||'' : d.completeStatusDesc
        })
        return {
          ...o,
          expanded:false
        }
      })
      this.morestatus = morestatus
    },
    toggleExpand(o){
      o.expanded=!o.expanded
      this.list = [...this.list]
    },
    getItemList(o){
      return o.expanded ? o.machineLockItemList : o.machineLockItemList.slice(0,1);
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
<style lang="scss" scoped>
  .list{
    height:100%;
    @include flex(column);
  }
  .card{
    background:$uni-bg-color;
    .head{
      @include flex(row,center,center);
      @include hairline-bottom();
      padding:24rpx 16rpx;
      .icon{
        width:80rpx;
        height:80rpx;
        @include hairline-surround-radius(12rpx);
        font-size: 40rpx;
        @include flex(row,center,center);
      }
      .iconarrow-down{
        transition: transform 0.2s ease-in-out;
        &.expanded{
          transform: rotate(180deg);
        }
      }
    }
    .item{
      @include hairline-bottom($uni-border-color,dashed);
      padding: 16rpx 0;
    }
  }
</style>