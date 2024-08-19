<template>
  <view class="fence-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="tab-top-view">
      <sun-tab
        :value.sync="tabindex"
        :tabList="tabbarList"
        :scroll="true"
        :isFlex="false"
        @change="tabSelect"
        activeColor="#E60000"
        activebgColor="#FFFFFF"
        defaultbgColor="#FFFFFF"
        rangeKey="label"
        v-if="tabbarList.length > 0"
      />
    </view>
    <view class="tab-content" v-if="tabbarList.length > 0">
      <tabRemind ref="remindview" :childTypeList="childTypeList" :warningType="warningType" />
    </view>
  </view>
</template>
<script>
import sunTab from "@/components/common/sun-tab/sun-tab.vue";
import tabRemind from "./tab-importance-remind.vue";
export default {
  components: {
    sunTab,
    tabRemind
  },
  data() {
    return {
      tabindex: 0,
      tabbarList: [],
      noticeTypeList: [],
      childTypeList: [],
      warningType: {}
    };
  },
  onLoad(option) {
    uni.$on("refresh-notification-list", obj => {
      switch (obj.type) {
        case "remind":
          this.$refs.remindview.refreshheader();
          break;

        default:
          break;
      }
      this.loadImportanceNum();
    });

    uni.$on("refresh-tab", obj => {
      this.loadImportanceNum();
    });
    this.getTabs();
  },
  onUnload() {
    uni.$off("refresh-notification-list");
    uni.$off("refresh-tab");
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initdata();
  },
  //上拉加载
  onReachBottom() {
    this.$refs.remindview.refreshhfooter();
  },
  methods: {
    tabSelect(e) {
      console.log(e,'tabSelect');
      this.tabindex = e.index;
      this.warningType = this.noticeTypeList[this.tabindex];
      this.getChildrenType();
      setTimeout(() => {
        this.$refs.remindview.initData();
        this.initdata();
      }, 100);
    },
    initdata() {
      this.$refs.remindview.refreshheader();
    },
    onConfirm(val) {},
    getTabs() {
      this.$network
        .loadUserType("warning_type")
        .then(result => {
          this.noticeTypeList = result ? result : [];
          this.tabbarList =
            this.noticeTypeList.length > 0
              ? this.noticeTypeList.map(o => {
                  return {
                    ...o,
                    showNum: true,
                    num: 0
                  };
                })
              : [];
          this.loadImportanceNum();
          if (this.noticeTypeList.length > 0) {
            this.warningType = this.noticeTypeList[this.tabindex];
            this.getChildrenType();
          }
        })
        .catch(err => {});
    },
    loadImportanceNum() {
      this.$network
        .getData(this.$url.NOTICE_TAB_NUM, "GET")
        .then(result => {
          let total = 0;
          result.map(item => {
            total += item.num;
          });
          this.$store.commit("user/setState", {
            messageCount: parseInt(total)
          });

          if (result && result.length > 0) {
            //此处不可使用直接重新赋值tabbarList整个数组的方法
            result.forEach(x => {
              this.tabbarList.forEach((y, i) => {
                if (x.value == y.value) {
                  this.tabbarList[i].num = x.num;
                }
              });
            });
          }
        })
        .catch(err => {});
    },
    getChildrenType() {
      if (this.noticeTypeList && this.noticeTypeList.length >= this.tabindex) {
        let url = this.$url.CHILDREN_TYPE.replace(
          /{parent}/,
          this.noticeTypeList[this.tabindex].value
        );
        this.$network
          .getData(url, "GET")
          .then(result => {
            this.childTypeList =
              result && result.length > 0
                ? result.map(o => {
                    return {
                      label: o.name,
                      value: o.value,
                      id: o.id
                    };
                  })
                : [];
          })
          .catch(err => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fence-bg-view {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.tab-top-view {
  position: fixed;
  top: 0;
  width: 100%;
  height: 55px;
  background: #ffffff;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.filter-view {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  align-self: center;
  width: 100%;
}

.select-view {
  flex: 1;
}

.reset-btn {
  padding: 2px 4px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  background-color: $uni-bg-color-grey;
  border-radius: 4px;
  margin: 0px 4px;
}
</style>
