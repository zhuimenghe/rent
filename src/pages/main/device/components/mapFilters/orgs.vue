<template lang="">
  <view class="org-box">
    <view class="item text-cut" :class="{'text-primary':orgId==o.value}" v-for="o in orgs" :key="o.value" @click="toggleOrg(o.value)">
      {{o.label}}（{{o.count||0}}）
    </view>
  </view>
</template>
<script>
import { mapMutations, mapState,mapGetters } from 'vuex'
export default {
  data(){
    return{
    }
  },
  computed:{
    ...mapState('map',['orgId']),
    ...mapGetters('map',['orgs']),
  },
  methods:{
    ...mapMutations('map',['setState','updateOrg']),
    toggleOrg(orgId){
      if(this.orgId == orgId) orgId=''
      this.updateOrg(orgId)
      this.$emit('pick',orgId)
    }
  }
}
</script>
<style lang="scss">
  .org-box{
    .item{
      padding:24rpx 28rpx;
      @include hairline-bottom();
    }
  }
</style>