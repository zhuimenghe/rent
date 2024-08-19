<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar flexAlign="center" :title="title"></c-nav-bar>
    <view class="body">
      <view class="tabs" v-if="tabs.length>1">
        <view
          class="tab"
          v-for="(t, i) in tabs"
          :key="i"
          :class="{ active: activeIndex == i }"
          @click="changeTab(i)"
          >{{ t.label }}</view
        >
        <view
          class="line"
          :style="{ left: 100 * (1 / (tabs.length * 2) + activeIndex / tabs.length) + '%' }"
        ></view>
      </view>
      <swiper
        class="flex-scroll-wrapper"
        :duration="200"
        :current="activeIndex"
        @change="changeTab($event.detail.current)"
      >
        <swiper-item v-if="tabs.find(t=>t.label=='租赁咨询')">
          <WorkInList ref="workin"></WorkInList>
        </swiper-item>
        <swiper-item v-if="tabs.find(t=>t.label=='退场申请')">
          <WorkOutList ref="workout"></WorkOutList>
        </swiper-item>
        <swiper-item v-if="tabs.find(t=>t.label=='设备报修')">
          <RepairList ref="repair"></RepairList>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>
<script>
import WorkInList from './components/workin-apply-list.vue'
import WorkOutList from './components/workout-apply-list.vue'
import RepairList from './components/repair-apply-list.vue'
export default {
  components:{
    WorkInList,
    WorkOutList,
    RepairList
  },
  data() {
    return {
      activeIndex: 0,
      tabs: [
        {
          label: "租赁咨询",
          ref:'workin',
          acl:'businessApplyWorkIn'
        },
        {
          label: "退场申请",
          ref:'workout',
          acl:'businessApplyWorkOut'
        },
        {
          label: "设备报修",
          ref:'repair',
          acl:'businessApplyRepair'
        },
      ],
    };
  },
  computed:{
    title(){
      return this.tabs.length!=1 ? '业务申请':this.tabs[0].label
    }
  },
  watch:{
    activeIndex(){
      this.getData()
    }
  },
  async onLoad(){
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.tabs = this.tabs.filter(t => {
        return !t.acl || ps.some((x) => x.value === t.acl)
      })
    }
    await this.getData()
  },
  methods: {
    async changeTab(index) {
      this.activeIndex = index;
    },
    async getData(){
      await this.$refs[this.tabs[this.activeIndex].ref].loadData(true); // 重新获取数据
    }
  },
}
</script>
<style lang="scss" scoped>
  .page{
    height:100%;
    @include flex(column);
    .tabs {
      background: $uni-bg-color;
      position: relative;
      height: 96rpx;
      @include flex(row, center, space-between);

      .line {
        position: absolute;
        bottom: 0;
        left: 100rpx;
        width: 40rpx;
        height: 6rpx;
        background: $uni-color-primary;
        transform: translateX(-50%);
        transition: left 0.2s ease-in-out;
      }

      .tab {
        flex: 1;
        height: 100%;
        @include flex(row, center, center);

        &.active {
          color: $uni-color-primary;
        }
      }
    }
    .body{
      flex: 1;
      overflow: auto;
      @include flex(column);
      .list{
        height:100%;
      }
    }
  }
</style>