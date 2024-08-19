<template>
  <view class="fence-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <!-- <view class="nav-bar">
			<uniNavBar title="我的" :showBack="false" @clickRight='goTo' :btns="btns" />
    </view>-->
    <view class="tab-top-view">
      <sun-tab
        :value.sync="tabindex"
        :tabList="tabbarList"
        :scroll="false"
        @change="tabSelect"
        activeColor="#E60000"
        rangeKey="name"
        activebgColor="#FFFFFF"
        defaultbgColor="#FFFFFF"
        :shownum="false"
      ></sun-tab>
    </view>
    <view class="top-view">
      <notifyQueryView
        :isQueryRead="tabindex==3?true:false"
        :isQueryTitle="false"
        :isQueryNode="false"
        :isQueryState="tabindex!=0?true:false"
        :isControlMore="true"
        :isControlShow="isControlShow"
        :hint="tabindex==2?'单号/标题':'单号/标题/申请人'"
        @setMore="setMore"
        @query="query"
        @reset="reset"
        @markRead="markRead"
      />
    </view>
    <view class="topstyle">
      <view v-if="tabindex == 0">
        <pending ref="pendingview" />
      </view>
      <view v-if="tabindex == 1">
        <finish ref="finishview" />
      </view>
      <view v-if="tabindex == 2">
        <myapply ref="myapplyview" />
      </view>
      <view v-show="tabindex == 3">
        <remind ref="remindview" />
      </view>
    </view>

    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      v-show="selectList.length != 0"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>
<script>

import sunTab from "@/components/common/sun-tab/sun-tab.vue";
import myapply from "./my-apply-list.vue";
import pending from "./pending-notifications.vue";
import finish from "./finish-notifications.vue";
import remind from "./copy-remind.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import notifyQueryView from "@/components/common/common-ui/notify-query-view.vue";
export default {
  components: {
    sunTab,
    myapply,
    pending,
    finish,
    remind,
    selectView,
    wPicker,
    notifyQueryView
  },
  data() {
    return {
      tabindex: 0,
      // tabbarList: ['我的待办', '我的已办', '我的申请', '消息提醒'],
      tabbarList: [
        {
          name: "我的待办",
          num: 0,
          showNum: true
        },
        {
          name: "我的已办"
        },
        {
          name: "我的申请"
        },
        {
          name: "我的抄送",
          num: 0,
          showNum: true
        }
      ],
      selectList: [],
      titleList: [],
      stateList: [],
      toDoTotal: 0,
      copyTotal: 0,
      pickType: "",
      title: {},
      state: {},
      btns: [
        {
          text: "\ue622",
          cornerNum: 0,
          color: "#ff0000",
          icon: true
        }
      ],
      fuzzyParam: "",
      nodeObj: {},
      readTag: {
        label: "未读",
        value: "false"
      },
      isControlShow: false,
      startDate: "",
      endDate: ""
    };
  },
  onLoad(option) {
    if (option.index) {
      this.tabindex = Number(option.index);
    }
    // 108px':'148px
    uni.$on("refresh-notification-list", obj => {
      this.loadUnreadNum();
      this.loadTodoNum();
      switch (this.tabindex) {
        case 0:
          this.$refs.pendingview.refreshheader(
            this.title.value,
            this.nodeObj.label,
            this.fuzzyParam,
            this.state.value,
            this.startDate,
            this.endDate
          );
          break;
        case 1:
          this.$refs.finishview.refreshheader(
            this.title.value,
            this.nodeObj.label,
            this.fuzzyParam,
            this.state.value,
            this.startDate,
            this.endDate
          );
          break;
        case 2:
          this.$refs.myapplyview.refreshheader(
            this.title.value,
            this.nodeObj.label,
            this.state.value,
            this.fuzzyParam,
            this.startDate,
            this.endDate
          );
          break;
        case 3:
          this.$refs.remindview.refreshheader(
            this.title.value,
            this.nodeObj.label,
            this.readTag.value,
            this.state.value,
            this.fuzzyParam,
            this.startDate,
            this.endDate
          );
          break;

        default:
          break;
      }
    });
    uni.$on("refresh-service-list", usnerinfo => {
      this.$refs.myapplyview.refreshheader(
        this.title.value,
        this.nodeObj.label,
        this.state.value,
        this.fuzzyParam,
        this.startDate,
        this.endDate
      );
    });
    this.loadStateTypes();
    this.loadProcessTypes();
  },
  onShow() {
    this.loadImportanceNum();
    this.loadUnreadNum();
    this.loadTodoNum();
  },
  onUnload() {
    uni.$off("refresh-service-list");
    uni.$off("refresh-notification-list");
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initdata();
  },
  //上拉加载
  onReachBottom() {
    if (this.tabindex === 0) {
      this.$refs.pendingview.refreshhfooter(
        this.title.value,
        this.nodeObj.label,
        this.fuzzyParam,
        this.state.value,
        this.startDate,
        this.endDate
      );
    } else if (this.tabindex === 1) {
      this.$refs.finishview.refreshhfooter(
        this.title.value,
        this.nodeObj.label,
        this.fuzzyParam,
        this.state.value,
        this.startDate,
        this.endDate
      );
    } else if (this.tabindex === 2) {
      this.$refs.myapplyview.refreshhfooter(
        this.title.value,
        this.nodeObj.label,
        this.state.value,
        this.fuzzyParam,
        this.startDate,
        this.endDate
      );
    } else if (this.tabindex === 3) {
      this.$refs.remindview.refreshhfooter(
        this.title.value,
        this.nodeObj.label,
        this.readTag.value,
        this.state.value,
        this.fuzzyParam,
        this.startDate,
        this.endDate
      );
    }
  },
  methods: {
    //搜索-------------
    setMore(val) {
      this.isControlShow = val;
    },
    query(val) {
      this.fuzzyParam = val.fuzzyParam;
      this.title = val.titleObj;
      this.state = val.stateObj;
      this.nodeObj = val.nodeObj;
      this.readTag = val.readTag;
      this.startDate = val.startDate;
      this.endDate = val.endDate;
      this.initdata();
    },
    reset() {
      this.title = {};
      this.state = {};
      this.fuzzyParam = "";
      this.nodeObj = {};
      this.readTag = {
        label: "未读",
        value: "false"
      };
      this.startDate = "";
      this.endDate = "";
      this.initdata();
    },
    markRead() {
      this.$refs.remindview.markAllRead();
    },
    //-------------------------------------

    initdata() {
      if (this.tabindex === 0) {
        this.$refs.pendingview.refreshheader(
          this.title.value,
          this.nodeObj.label,
          this.fuzzyParam,
          this.state.value,
          this.startDate,
          this.endDate
        );
      } else if (this.tabindex === 1) {
        this.$refs.finishview.refreshheader(
          this.title.value,
          this.nodeObj.label,
          this.fuzzyParam,
          this.state.value,
          this.startDate,
          this.endDate
        );
      } else if (this.tabindex === 2) {
        this.$refs.myapplyview.refreshheader(
          this.title.value,
          this.nodeObj.label,
          this.state.value,
          this.fuzzyParam,
          this.startDate,
          this.endDate
        );
      } else if (this.tabindex === 3) {
        this.$refs.remindview.refreshheader(
          this.title.value,
          this.nodeObj.label,
          this.readTag.value,
          this.state.value,
          this.fuzzyParam,
          this.startDate,
          this.endDate
        );
      }
    },
    goTo(e) {
      switch (e.index) {
        case 0:
          uni.navigateTo({
            url: "/otherPages/notify/importance-notification"
          });
          break;
        case 1:
          uni.navigateTo({
            url: "/pages/main/setting"
          });
          break;
        default:
          break;
      }
      console.log(e);
    },
    loadImportanceNum() {
      this.$network
        .getData(this.$url.NOTICE_TAB_NUM, "GET")
        .then(result => {
          this.btns[0].cornerNum =
            result.length > 0
              ? result.reduce((x, y) => {
                  return x + Number(y.num);
                }, 0)
              : 0;

  

        })
        .catch(err => {});
    },
    setTabNum() {
      this.tabbarList[0].num = this.toDoTotal > 99 ? "99+" : this.toDoTotal;
      this.tabbarList[3].num = this.copyTotal > 99 ? "99+" : this.copyTotal;
    },
    loadUnreadNum() {
      this.$network
        .getData(this.$url.UNREAD_LIST, "GET")
        .then(result => {
          //抄送
          let list = result
            ? result.filter(o => {
                return o.noticeType == "1";
              })
            : [];
          this.copyTotal = list.length > 0 ? list[0].num : 0;
          this.setTabNum();
        })
        .catch(err => {});
    },
    loadTodoNum() {
      let param = {
        current: 1,
        size: 1
      };
      this.$network
        .getData(this.$url.TO_DO_LIST, "POST", param)
        .then(result => {
          this.toDoTotal = result.total ? Number(result.total) : 0;
          let totalStr = result.total.toString()
            ? result.total.toString()
            : "0";
          this.$store.commit("user/setState", {
            todoCount: parseInt(totalStr)
          });
          this.setTabNum();
          if (this.toDoTotal > 0) {
            uni.setTabBarBadge({
              index: 4,
              text: this.toDoTotal > 99 ? "99+" : this.toDoTotal + ""
            });
          } else {
            uni.removeTabBarBadge({
              index: 4
            });
          }
        })
        .catch(err => {});
    },
    tabSelect(e) {
      this.isControlShow = false;

      this.title = {};
      this.state = {};
      this.fuzzyParam = "";
      this.nodeObj = {};
      this.readTag = {
        label: "未读",
        value: "false"
      };
      this.startDate = "";
      this.endDate = "";
      uni.$emit("notify-query-change");
      //将条件置空后，在切换页面不会出现重复刷新
      this.tabindex = e.index;
      if (this.tabindex === 3) {
        //有默认参数，不可直接使用created方法加载数据
        this.initdata();
      }
    },

    showPick(type) {
      console.log("showPick---" + type);
      this.pickType = type;
      switch (type) {
        case "title":
          this.selectList = this.titleList ? this.titleList : [];
          break;
        case "state":
          this.selectList = this.stateList ? this.stateList : [];
          break;
        default:
          break;
      }
      this.$refs.selector.show();
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "title":
          this.title = {
            value: val.checkArr.value,
            label: val.checkArr.label
          };
          break;
        case "state":
          this.state = {
            value: val.checkArr.value,
            label: val.checkArr.label
          };
          break;
        default:
          break;
      }
      this.initdata();
    },
    //
    loadStateTypes() {
      this.$network
        .loadUserType("business_state")
        .then(result => {
          this.stateList = result;
        })
        .catch(err => {});
    },
    loadProcessTypes() {
      let param = {
        current: 1,
        size: 999,
        latest: true
      };
      this.$network
        .getData(this.$url.BUSINESS_PROCESS, "GET", param)
        .then(result => {
          this.titleList = result.records
            ? result.records.map(o => {
                return {
                  value: o.processKey,
                  label: o.name,
                  procDefId: o.procDefId
                };
              })
            : [];
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.fence-bg-view {
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: relative;
}

.nav-bar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}
.tab-top-view {
  position: fixed;
  top: 0px;
  width: 100%;
  height: 44px;
  background: #ffffff;
  z-index: 101;
  display: flex;
  flex-direction: column;
}

.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 44px;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;
}

.filter-view {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  align-self: center;
  width: 100%;
  padding-top: 8px;
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
.topstyle {
  padding-bottom: env(safe-area-inset-bottom);
  margin-top: 115px;
}
</style>
