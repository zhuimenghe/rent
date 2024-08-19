<template lang="">
  <view class="report-list">
    <c-timeline :list="list">
      <template v-slot:default="{item,index}" >
        <b-report-card type="s" :item="item"></b-report-card>
      </template>
    </c-timeline>
  </view>
</template>
<script>
import {fetchUseReportList} from '@/network'
export default {
  props:{
    contractNo:String
  },
  data(){
    return{
      list:[]
    }
  },
  watch:{
    contractNo:{
      async handler(contractNo){
        if(contractNo){
          let result = await fetchUseReportList({
            current:1,size:1000,contractNo
          })
          this.list = result.records
        }
      },
      immediate:true
    }
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
  
</style>