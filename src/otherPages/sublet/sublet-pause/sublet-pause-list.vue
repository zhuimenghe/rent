<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="add-container" @click="goToCreate('create', null)"
      ><i class="iconfont labelstyle iconadd"></i
    ></view>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"
            ><input
              style="flex: 1; font-size: 14px"
              placeholder="转租公司/自喷码/车号"
              @input="searchChange"
              v-model="searchKey"
          /></view>
        </view>
        <!-- <view class="filter-view-style"><filter-view @clickFilter="filtrateMenu" :isExpendArrow="showfilter" backgroundColor="#ffffff" 
					textColor="#222222"  /></view> -->
        <view class="export-view-style" @click="exportExcel" v-if="isExportList"
          ><text>导出</text></view
        >
      </view>
      <!-- <view class="bottom-search" v-if="showfilter">
				<view class="bottom-search-top">
					<label-arrow style="flex: 1;" :value="typeDic.label" arrowColor="#999999" textColor="#222831" textSize="14" arrowSize="14" @clickLabel="showpick('type')" />
					<label-arrow
						style="margin-left: 30px;flex: 1;"
						:value="heightDic.label"
						arrowColor="#999999"
						textColor="#222831"
						textSize="14"
						arrowSize="14"
						@clickLabel="showpick('height')"
					/>
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">查询</view>
				</view>
			</view> -->
      <view class="tips"
        ><text
          >注意:转租报停仅用于记录转租设备报停和计算转租应付费用,与租赁业务中的"设备报停"无关</text
        ></view
      >
    </view>
    <view class="list-sub-view">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view class="cell-text" @click="gotoDetail(item)">
            <view class="cell-text-left fontsubcolor"><text>报停单号</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.businessNo || "--" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租公司</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.companyName || "--" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>报停类型</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.pauseCauseName || "--" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>报停数量</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.machineNum }}</text>
            </view>
          </view>
          <view class="line-s" />
          <view class="operate-container">
            <view class="delete-view" @click="goToCreate('delete', item)">删除</view>
            <view class="delete-view" @click="goToCreate('updata', item)">修改</view>
            <view class="delete-view" @click="goToCreate('detail', item)">详情</view>
          </view>
        </cell>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </list>
    </view>
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import startOfDay from "date-fns/startOfDay";
import differenceInDays from "date-fns/differenceInDays";
import parseISO from "date-fns/parseISO";
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
      morestatus: "more",
      searchKey: "",
      showfilter: false,
      typeDic: {
        value: "",
        label: "请选择类型",
      },
      heightDic: {
        value: "",
        label: "请选择高度",
      },
      selectType: "",
      selectList: [],
      isExportList: true,
      totalCount: "100",
    };
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  created() {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租报停",
      "列表"
    );
  },
  methods: {
    getDate(time) {
      if (!time) return "--";
      return time.split(/\s+/)[0];
    },
    //------------------------machine_type
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
        // type: this.typeDic.value === '' ? null : this.typeDic.value,
        // height: this.heightDic.value === '' ? null : this.heightDic.value
      };
      this.$network
        .getData(this.$url.SUBLET_PAUSE_PAGE, "POST", param)
        .then((result) => {
          let res = result.records.map((o) => {
            let total = o.machines ? o.machines.length : 0;
            let day = 0;
            if (o.machines) {
              o.machines.forEach((m) => {
                day +=
                  differenceInDays(
                    startOfDay(m.endDate ? parseISO(m.endDate) : new Date()),
                    startOfDay(parseISO(m.beginDate))
                  ) + 1;
              });
            }

            return {
              ...o,
              machineNum: `共${total}台/${day}天`,
            };
          });
          this.datalist = this.datalist.concat(res);
          let pages = result.pages;
          if (pages <= this.currentpage) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          this.totalCount = result.total.toString();
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    //新建
    goToCreate(type, item) {
      if (type === "create") {
        let url = "./sublet-pause/create-sublet-pause";
        uni.navigateTo({
          url: url,
        });
      } else if (type === "updata") {
        let url =
          "./sublet-pause/create-sublet-pause?item=" +
          encodeURIComponent(JSON.stringify(item));
        uni.navigateTo({
          url: url,
        });
      } else if (type === "delete") {
        this.deteleItem(item);
      } else if (type === "detail") {
        uni.navigateTo({
          url:
            "./sublet-pause/sublet-pause-detail?item=" +
            encodeURIComponent(JSON.stringify(item)),
        });
      }
    },
    deteleItem(item) {
      uni.showModal({
        title: "提示",
        content: "确认要删除该转租报停单?",
        success: (res) => {
          if (res.cancel) {
          } else {
            uni.showLoading();
            let urlstr = this.$url.SUBLET_PAUSE_DELETE + item.businessNo;
            this.$network
              .getData(urlstr, "DELETE", null)
              .then((result) => {
                this.headerrefresh();
              })
              .catch((err) => {
                uni.showToast({
                  icon: "none",
                  title: err.message + ":" + err.details[0],
                });
              });
          }
        },
      });
    },
    //跳入详情
    gotoDetail(item) {
      let businessNostr = item.businessKey;
      let url = "./sublet-apply/sublet-apply-detail?businessNo=" + businessNostr;
      uni.navigateTo({
        url: url,
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
    //----------
    filtrateMenu() {
      this.showfilter = !this.showfilter;
    },
    clearsum() {
      this.heightDic = {
        value: "",
        label: "请选择高度",
      };
      this.typeDic = {
        value: "",
        label: "请选择类型",
      };
      this.searchKey = "";
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
    showpick(t) {
      this.selectType = t;
      if (t === "type") {
        this.getTypeList("machine_type");
      } else if (t === "height") {
        this.getTypeList("machine_height");
      }
      this.$refs.selector.show();
    },
    dialog(val) {
      if (this.selectType === "type") {
        this.typeDic = val.checkArr;
      } else if (this.selectType === "height") {
        this.heightDic = val.checkArr;
      }
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	fuzzyParam: this.searchKey,
      // 	type: this.typeDic.value === '' ? undefined : this.typeDic.value,
      // 	height: this.heightDic.value === '' ? undefined : this.heightDic.value
      // };
      // let url = this.$url.SUBLET_PAUSE_PAGE + '?isExport=true&current=1&size=' + this.totalCount;
      // let downurl = this.$gxfmethod.forEachObj(url, param);
      // console.log(downurl);

      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.searchKey,
        type: this.typeDic.value === "" ? undefined : this.typeDic.value,
        height: this.heightDic.value === "" ? undefined : this.heightDic.value,
      };
      let url = this.$gxfmethod.getUrl(this.$url.SUBLET_PAUSE_PAGE);
      console.log(url);
      let filename = this.$gxfmethod.getFileName("转租报停记录-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
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
  // top: 44px;
  top: 0px;
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

.tips {
  display: flex;
  margin: 5px 10px;
  margin-top: 0px;
  padding: 5px;
  background: #f0ad4e;
  color: #ff0000;
  font-size: $uni-font-size-sm;
}

.search-box {
  background: #f7f7f7;
  flex: 1;
  height: 35px;
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
  width: 100%;
  background: $uni-bg-color-grey;
  // margin-top: 145px;
  margin-top: 100px;
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

.item-head {
}

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

.delete-view {
  margin-left: 15px;
}

.fontsubcolor {
  color: $uni-text-color-gray;
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
  box-shadow: 0px 0px 10px rgba(#000000, 0.2);
  justify-content: center;
  align-items: center;
  background-color: #f08200;
}

.labelstyle {
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
}

//筛选父视图
.filter-view-style {
  height: 35px;
  width: 60px;
  display: flex;
  background: $uni-color-primary;
  font-size: $uni-font-size-base;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
  color: #ffffff;
}

.bottom-search {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px 0px;
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
</style>
