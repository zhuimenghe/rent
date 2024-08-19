<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="add-container" @click="gotocreat" v-if="isShowAdd">
      <i class="iconfont labelstyle iconadd"></i>
    </view>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content">
            <input
              style="flex: 1; font-size: 14px"
              placeholder="单号/物流公司"
              @input="searchChange"
              v-model="searchKey"
            />
          </view>
        </view>
        <view class="export-view-style" @click="exportExcel" v-if="isExportList"
          >导出</view
        >
        <view class="filter-view-style" @click="filtrateMenu"><text>筛选</text></view>
      </view>
      <view class="bottom-search" v-if="showfilter">
        <view class="bottom-search-top">
          <label-arrow
            style="flex: 1"
            :value="startDate"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showpick('start')"
          />
          <label-arrow
            style="margin-left: 30px; flex: 1"
            :value="endDate"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showpick('end')"
          />
        </view>
        <view class="condition-btn">
          <view class="clear btn" @click="clearsum">清除</view>
          <view class="confirm btn" @click="oksum">查询</view>
        </view>
      </view>
    </view>
    <c-loadmore-list
      scroll-y
      class="flex-scroll-wrapper"
      :loadMoreStatus="morestatus"
      @loadmore="footerrefresh"
    >
      <view class="list-view-cell" v-for="(item, index) in datalist" :key="index">
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>物流公司</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.logisticsCompanyName || "--" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>付款周期</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ getDate(item.startTime) }}-{{ getDate(item.endTime) }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>应付款</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ $datestr.doubleFloat(item.payable) || "0.00" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>已付款</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ $datestr.doubleFloat(item.paid) || "0.00" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>剩余应付</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text style="color: #4cd964" v-if="parseFloat(item.remainingPayable) < 0">
              {{ $datestr.doubleFloat(item.remainingPayable) || "0.00" }}
            </text>
            <text style="color: #ff0000" v-else>
              {{ $datestr.doubleFloat(item.remainingPayable) || "0.00" }}
            </text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>车次数</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.trainNumber || "--" }}</text>
          </view>
        </view>
        <!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>里程数</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.distance || '--' }}公里</text>
						</view>
					</view> -->
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>收款人</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.logisticsContact || "--" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>收款人联系方式</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.logisticsPhone || "--" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>我方负责人</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.customerSalesmanName || "--" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>单号</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.businessNo || "--" }}</text>
          </view>
        </view>
        <view class="line-s" />
        <view class="operate-container">
          <view class="delete-view" v-if="isupdata" @click="goToPay(index, item)"
            >已付</view
          >
          <view class="delete-view" @click="goToDetail(item)">详情</view>
          <view class="delete-view" v-if="isdelete" @click="deleteItem(item)">删除</view>
        </view>
      </view>
    </c-loadmore-list>
    <view class="pop-container">
      <uni-popup ref="picDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">修改物流已付</view>
          <view class="row-item">
            <view class="row-tag"><text>已付金额</text></view>
            <view class="left-style"><text>￥</text></view>
            <view class="input-style" style="margin-left: 5px">
              <input
                class="text-style"
                type="digit"
                placeholder="请输入已付金额"
                v-model="logisticsCarriage"
              />
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
          </view>
        </view>
      </uni-popup>
    </view>
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="true"
      ref="date"
      themeColor="#E60000"
    />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
let timer;
export default {
  components: {
    uniLoadMore,
    wPicker,
    filterView,
    labelArrow,
    uniPopup,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "more",
      searchKey: "",
      showfilter: false,
      startDate: "开始时间",
      endDate: "结束时间",
      selectType: "",
      isupdata: true,
      isdelete: true,
      isShowAdd: true,
      logisticsCarriage: "0",
      selectItem: {},
      isExportList: true,
      totalCount: "100",
    };
  },
  watch: {
    logisticsCarriage(val) {
      this.logisticsCarriage = val;
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        this.logisticsCarriage = val;
      }, 50);
    },
  },
  onLoad() {
    uni.showLoading();
    this.loaddata();
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isupdata = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_LOGISTICS_PAY_UPDATA
        );
        this.isdelete = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_LOGISTICS_PAY_DELETE
        );
        this.isShowAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_LOGISTICS_PAY_ADD
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.$on("refresh-pay-list", (e) => {
      uni.showLoading();
      this.headerrefresh();
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Logistics_Administrative,
      "物流应付",
      "列表"
    );
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  methods: {
    getleft(item) {
      let total = this.$datestr.doubleFloat(item.total) || 0;
      let paidTotal = this.$datestr.doubleFloat(item.paidTotal) || 0;
      return this.$datestr.doubleFloat(parseFloat(total) + parseFloat(paidTotal));
    },
    getDate(time) {
      if (!time) return "--";
      let timestr = time.split(/\s+/)[0];
      return timestr.replace(/-/g, "/");
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
        fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
        startTime:
          this.startDate === "开始时间" ? undefined : this.startDate + " 00:00:00",
        endTime: this.endDate === "结束时间" ? undefined : this.endDate + " 23:59:59",
      };
      this.$network
        .getData(this.$url.LOGISTICES_PAY_LIST, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          let pages = result.pages;
          this.totalCount = result.total.toString();
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
    //新建
    gotocreat() {
      let url = "./logistics-pay-create";
      uni.navigateTo({
        url: url,
      });
    },
    goToDetail(item) {
      let url = "./logistics-pay-detail?item=" + encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: url,
      });
    },
    //跳入详情
    goToPay(index, item) {
      this.selectItem = {
        ...item,
      };
      this.$refs.picDialog.open();
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
      this.startDate = "开始时间";
      this.endDate = "结束时间";
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
      this.$refs.date.show();
    },
    onConfirm(val) {
      if (this.selectType === "start") {
        this.startDate = val.result;
      } else if (this.selectType === "end") {
        this.endDate = val.result;
      }
    },
    cancelDialog() {
      this.$refs.picDialog.close();
    },
    confirmDialog() {
      if (this.logisticsCarriage === "") {
        uni.showToast({
          title: "请输入已付金额",
          icon: "none",
        });
        return;
      }
      uni.showLoading();
      setTimeout(() => {
        this.updataPrice();
      }, 100);
    },
    updataPrice() {
      uni.showModal({
        title: "提示",
        content: "确定要修改该条应付记录么?",
        success: (res) => {
          if (res.confirm) {
            let param = {
              id: this.selectItem.id,
              paid: this.$datestr.doubleFloat(this.logisticsCarriage),
            };
            let urlstr = this.$url.LOGISTICES_PAY_DELETE + this.selectItem.id;
            this.$network
              .getData(urlstr, "PUT", param)
              .then((result) => {
                this.headerrefresh();
                this.$refs.picDialog.close();
              })
              .catch((err) => {
                uni.showToast({
                  title: err.message + "," + err.details ? err.details[0] : "",
                  icon: "none",
                });
              });
          } else if (res.cancel) {
            uni.hideLoading();
          }
        },
      });
    },
    deleteItem(item) {
      uni.showModal({
        title: "提示",
        content: "确定要删除该条应付记录么?",
        success: (res) => {
          if (res.confirm) {
            let urlstr = this.$url.LOGISTICES_PAY_DELETE + item.id;
            this.$network
              .getData(urlstr, "DELETE", null)
              .then((result) => {
                uni.showLoading();
                this.headerrefresh();
              })
              .catch((err) => {
                uni.showToast({
                  title: err.message + "," + err.details ? err.details[0] : "",
                  icon: "none",
                });
              });
          } else if (res.cancel) {
            uni.hideLoading();
          }
        },
      });
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
      // 	startTime: this.startDate === "开始时间" ? undefined : (this.startTime + " 00:00:00"),
      // 	endTime: this.endDate === "结束时间" ? undefined : (this.startTime + " 23:59:59"),
      // };
      // let url= this.$url.LOGISTICES_PAY_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)

      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
        startTime:
          this.startDate === "开始时间" ? undefined : this.startDate + " 00:00:00",
        endTime: this.endDate === "结束时间" ? undefined : this.endDate + " 23:59:59",
      };
      let url = this.$url.BASE_URL + this.$url.LOGISTICES_PAY_LIST + "?isExport=true";
      let filename = this.$gxfmethod.getFileName("物流应付记录-");
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
  @include flex(column);
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

//搜索框
.top-view {
  z-index: 100;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 100;
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
  margin-top: 50px;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;
}

//列表cell
.list-view-cell {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  background: #ffffff;
  border-radius: 4px;
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
  z-index: 11;
  display: flex;
  bottom: 50px;
  right: 16px;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #e60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}
//筛选父视图
.filter-view-style {
  height: 35px;
  width: 60px;
  display: flex;
  font-size: $uni-font-size-base;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
  z-index: 955;
  color: #333333;
}
.bottom-search {
  position: absolute;
  top: 100%;
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
  padding: 10px 0px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  border-bottom: 1px solid $uni-bg-color-grey;
}
.col-item {
  display: flex;
  margin-top: 5px;
  flex-direction: column;
  align-items: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.row-tag {
  width: 98px;
  text-align: left;
  padding: 2px 6px;
}
.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
}
.text-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
  border-radius: 4px;
  width: calc(100% - 15px);
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
.left-style {
  display: flex;
  margin-left: 10px;
}
</style>
