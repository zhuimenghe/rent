<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"><input style="flex: 1" placeholder="请输入公司" @input="searchChange" /></view>
        </view>
      </view>
    </view>
    <view class="list-sub-view">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view @click="backTopre(item)">
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>公司名称</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.name || "--" }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>联系人</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.contact || "--" }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>联系电话</text></view>
              <view class="cell-text-right fontBlackcolor">
                {{ item.phone }}
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>地址</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.address || "--" }}</text>
              </view>
            </view>
          </view>
        </cell>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </list>
    </view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
let timer;
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "more",
      searchKey: "",
    };
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  methods: {
    headerrefresh() {
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    footerrefresh() {
      if (this.morestatus == "noMore") {
        return;
      }
      this.currentpage += 1;
      this.morestatus = "loading";
      this.loaddata();
    },
    loaddata() {
      let param = {
        current: this.currentpage,
        size: 20,
        name: this.searchKey,
      };
      this.$network
        .getData(this.$url.SUBLET_CONMPANY_LIST, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          this.$datestr.printlog(JSON.stringify(this.datalist));
          let pages = result.pages;
          if (pages <= this.currentpage) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    searchChange(val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.searchKey = val.detail.value;
        this.currentpage = 1;
        this.datalist = [];
        this.loaddata();
      }, 500);
    },
    backTopre(item) {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 2];
      if (currentPage.route.includes('sublet-tab')) {
        uni.redirectTo({
          url: "/otherPages/sublet/sublet-pay/sublet-pay-add?company=" +
            encodeURIComponent(JSON.stringify(item)),
        });
      }
      else {
        uni.$emit("choose-company-emit", {
          dict: item,
        });
        uni.navigateBack({
          animationDuration: 300,
        });
      }
    },
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: "./sublet-apply/sublet-device/sublet-device-list",
    });
  },
  onReachBottom() {
    this.footerrefresh();
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
}

//添加按钮
.add-container {
  position: fixed;
  display: flex;
  bottom: 32px;
  right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #e60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.labelstyle {
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
}

//搜索框
.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 1px;
  width: 100%;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0px;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 16px;
  flex-direction: row;
  padding-left: 16px;
  border-radius: 4px;
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

//列表的subview
.list-sub-view {
  display: flex;
  background: $uni-bg-color-grey;
  margin-top: 55px;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;
}

//列表cell
.list-view-cell {
  // margin-left: 10px;
  // margin-right: 10px;
  margin-bottom: 5px;
  background: #ffffff;
  // border-radius: 4px;
  padding: 5px;
}

.cell-text {
  display: flex;
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: center;
}

.cell-text-left {
  display: flex;
  flex: 1;
  margin-left: 15px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.cell-text-right {
  display: flex;
  flex: 1.5;
  text-align: right;
  margin-right: 15px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}

.fontBlackcolor {
  color: $uni-text-color;
}

.fontdetailcolor {
  color: $uni-color-primary;
  margin-bottom: 10px;
}

.fontgreencolor {
  color: #4cd964;
}

.line-s {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: #eeeeee;
}

.operate-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
}

.fontsubcolor {
  color: $uni-text-color-gray;
}

.pop-container {
  position: relative;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  line-height: 50px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.row-tag {
  width: 98px;
  text-align: left;
}

.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
  border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;

  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}
</style>
