<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content">
            <input style="flex: 1" placeholder="转租公司/转租单号/设备编号" @input="searchChange" />
          </view>
        </view>
        <view class="filter-view-style">
          <filter-view @clickFilter="showfilter = !showfilter" :isExpendArrow="showfilter" backgroundColor="#ffffff" textColor="#222222" />
        </view>
      </view>
      <view class="bottom-search" v-if="showfilter">
        <view class="bottom-search-top">
          <label-arrow style="flex: 1" :value="typeDic.label" arrowColor="#999999" textColor="#222831" textSize="14" arrowSize="14" @clickLabel="showpick('type')" />
          <label-arrow style="margin-left: 30px; flex: 1" :value="stateDic.label" arrowColor="#999999" textColor="#222831" textSize="14" arrowSize="14"
            @clickLabel="showpick('state')" />
        </view>
        <view class="condition-btn">
          <view class="clear btn" @click="clearsum">清除</view>
          <view class="confirm btn" @click="oksum">查询</view>
        </view>
      </view>
      <view class="line-s" />
    </view>
    <view class="list-sub-view">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view @click="changeCheckBox(index)">
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor">
                <view class="item-head">
                  <view class="head-top">{{ item.businessKey || "--" }}</view>
                  <view class="head-bottom">
                    <text>{{ item.typeName || "--" }}</text>
                    |
                    <text class="item-text">{{ item.heightName || "--" }}</text>
                    |
                    <text class="item-text">{{ item.brand || "--" }}</text>
                    |
                    <text class="item-text">{{ item.machineTypeName || "--" }}</text>
                  </view>
                </view>
              </view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.subletStateName || "" }}</text>
              </view>
            </view>
            <view class="line-s" />
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>设备编号</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.licenseId || "" }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>转租公司</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.subletCompanyName || "" }}</text>
              </view>
            </view>
            <view class="line-s" />
            <view class="operate-container">
              <view class="right-container">
                <mycheckbox  :checked="item.checked" class="checkbox" color="#E60000" />
              </view>
            </view>
          </view>
        </cell>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </list>
      <view style="width: 100%; height: 80px" />
    </view>
    <view class="bottom-container">
      <view class="clear-btn" @click="clearAllChecked">
        <text>重置</text>
      </view>
      <view class="confirm-btn" @click="oprationCar">确定</view>
    </view>
    <w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";

let timer;
export default {
  components: {
    uniLoadMore,
    wPicker,
    filterView,
    labelArrow,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      chooseList: [],
      morestatus: "more",
      searchKey: "",
      pickType: "",
      showfilter: false,
      typeDic: {
        value: "",
        label: "请选择类型",
      },
      stateDic: {
        value: "",
        label: "请选择状态",
      },
      selectList: [],
    };
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  onLoad(option) {
    this.chooseList = JSON.parse(decodeURIComponent(option.item));
    uni.showLoading();
    this.loaddata();
  },
  methods: {
    getDate(time) {
      if (!time) return "--";
      return time.split(/\s+/)[0];
    },
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
        fuzzyParam: this.searchKey,
        subletState: this.stateDic.value === "" ? null : this.stateDic.value,
        type: this.typeDic.value === "" ? null : this.typeDic.value,
      };
      this.$network
        .getData(this.$url.SUBLET_DEVICE_LIST, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          this.resetList();
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
    resetList() {
      this.datalist = this.datalist.map((item) => {
        if (
          this.chooseList.some((o) => {
            return o.licenseId === item.licenseId;
          })
        ) {
          return {
            ...item,
            checked: true,
          };
        }
        return {
          ...item,
          checked: false,
        };
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
    changeCheckBox(pos) {
      this.datalist[pos].checked = !this.datalist[pos].checked;
      setTimeout(() => {
        if (this.datalist[pos].checked) {
          this.Removerepetition(this.datalist[pos], true);
        } else {
          this.Removerepetition(this.datalist[pos], false);
        }
      }, 10);
    },
    Removerepetition(item, isremove) {
      if (isremove) {
        this.chooseList.push(item);
      } else {
        let index = this.chooseList.findIndex((o) => {
          return o.licenseId === item.licenseId;
        });
        this.chooseList.splice(index, 1);
      }
    },
    //清除
    clearAllChecked() {
      this.chooseList = [];
      this.datalist = this.datalist.map((o) => {
        return {
          ...o,
          checked: false,
        };
      });
    },
    oprationCar() {
      uni.$emit("sublet-device-list", {
        item: this.chooseList,
      });
      uni.navigateBack({
        animationDuration: 100,
      });
    },
    chooseSelect(item) {
      this.searchType = item;
      this.isShowSelect = false;
    },
    showpick(type) {
      this.selectType = type;
      if (this.selectType === "type") {
        this.getTypeList("machine_type");
      } else if (this.selectType === "state") {
        this.getUserType("machine_type");
      }
    },
    dialog(val) {
      if (this.selectType === "type") {
        this.typeDic = val.checkArr;
      } else if (this.selectType === "state") {
        this.stateDic = val.checkArr;
      }
    },
    //------------------------
    getTypeList(type) {
      uni.showLoading();
      this.$network
        .loadType(type)
        .then((result) => {
          this.selectList = result;
          this.$refs.selector.show();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getUserType(type) {
      uni.showLoading();
      this.$network
        .loadUserType("sublet_state")
        .then((result) => {
          this.selectList = result.map((o, index) => {
            return {
              label: o.label,
              value: o.value,
            };
          });
          this.$refs.selector.show();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    clearsum() {
      this.typeDic = {
        value: "",
        label: "请选择类型",
      };
      this.stateDic = {
        value: "",
        label: "请选择状态",
      };
      uni.showLoading();
      this.showfilter = false;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    oksum() {
      uni.showLoading();
      this.showfilter = false;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
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

.labelstyle {
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
}

//搜索框
.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 100;
  top: 0;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;
}

.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 1px;
  width: 100%;
}

.filter-view-style {
  display: flex;
  background: #eeeeee;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 10px;
  border-radius: 5px;
  color: #e60000;
  font-size: $uni-font-size-sm;
}

.search-box {
  background: #f7f7f7;
  flex: 1;
  height: 40px;
  display: flex;
  margin: 8px 10px;
  flex-direction: row;
  padding-left: 10px;
  border-radius: 5px;
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
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: 65px;
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

.item-head {}

.head-top {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.head-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-bottom: 4px;
  margin-top: 4px;
}

.item-text {
  margin-right: 2px;
  margin-left: 2px;
}

.cell-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
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
  flex: 1;
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
  margin: 10px;
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
  padding-top: 7px;
  padding-bottom: 7px;
  flex: 1;
  border-bottom: 1px solid $uni-bg-color-grey;
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

.delete-view {
  margin-left: 15px;
}

.right-container {
  margin-left: 10px;
  margin-right: 10px;
}

.checkbox {
  transform: scale(0.8);
}

.bottom-container {
  position: fixed;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  height: 72px;
  width: 100%;
  justify-content: space-between;
}

.clear-btn {
  flex: 1;
  background-color: #df5000;
  margin: 16px 8px 16px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #ffffff;
  font-size: 14px;
}

.confirm-btn {
  flex: 1.5;
  background-color: $uni-color-primary;
  margin: 16px 16px 16px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 4px;
  font-size: 14px;
}

.bottom-search {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  margin-bottom: 1px;
}

.bottom-search-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px;
  align-items: center;
  background: #ffffff;
}

.condition-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  color: #ffffff;
  font-size: $uni-font-size-base;
}

.bottom-text-right {
  display: flex;
  margin-top: 5px;
  margin-right: 15px;
  margin-left: 10px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}
</style>
