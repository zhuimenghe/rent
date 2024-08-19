<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="add-container" @click="goToCreate('add', null)" v-if="mode == 'normal'"><i class="iconfont labelstyle iconadd"></i></view>
    <view class="top-view" v-if="mode == 'normal'">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content">
            <input style="flex: 1; font-size: 14px" placeholder="公司名称/联系人/电话" @input="searchChange" v-model="searchKey" />
          </view>
        </view>

        <view class="export-view-style" @click="exportExcel" v-if="isExportList">
          <text>导出</text>
        </view>
        <view class="right-filtter-btn" @click="filtterShow">{{ "筛选" }}</view>
      </view>
      <view class="top-search-view" v-if="isShowSelect">
        <view class="select-view">
          <selectView :value="totalFlag.label" hint="剩余应付" @clickSelect="showSelector" />
        </view>
      </view>
      <view class="top-search-view" style="margin: 10px 0px" v-if="isShowSelect">
        <view class="reset-btn" @click="reset">重置</view>
        <view class="filter-view" @click="query">查询</view>
      </view>
    </view>
    <view class="list-sub-view list-panel" :class="{ 'batch-edit': mode != 'normal' }" @touchstart="handleTouchStart" @touchmove="handleTouchMove">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view class="cell-text bussiness-key" v-if="mode != 'normal'">
            <view class="cell-text-left bussiness-key fontsubcolor"><text>应付单号：</text></view>
            <view class="cell-text-right bussiness-key fontBlackcolor">
              <text>{{ item.businessNo || "--" }}</text>
            </view>
          </view>
          <view class="line-s" v-if="mode != 'normal'" />
          <view class="cell-text" @click="gotoDetail(item)" v-if="mode == 'normal'">
            <view class="cell-text-left fontsubcolor"><text>应付单号</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.businessNo || "--" }}</text>
            </view>
          </view>
          <view class="cell-text" v-if="mode == 'normal'">
            <view class="cell-text-left fontsubcolor"><text>公司名称</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.subletCompanyName || "--" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租周期</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ getDate(item.beginDate) }}~{{ getDate(item.endDate) }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租费用（元）</text></view>
            <view class="cell-text-right fontBlackcolor">
              <!-- <text>{{ getleft(item) }}</text> -->
              <text>{{ $datestr.doubleFloat(item.all) || "0.00" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>已付费用（元）</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ $datestr.doubleFloat(item.paidTotal) || "0.00" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>剩余应付（元）</text></view>
            <view class="cell-text-right fontBlackcolor">
              <!-- <text style="color: #4cd964" v-if="parseFloat(item.total) < 0">{{
                $datestr.doubleFloat(item.total) || "0.00"
              }}</text>
              <text style="color: #ff0000" v-else>{{
                $datestr.doubleFloat(item.total) || "0.00"
              }}</text> -->
              <text>{{ $datestr.doubleFloat(item.total) || "0.00" }}</text>
            </view>
          </view>
          <view class="line-s" />

          <view class="operate-container" v-if="mode == 'normal'">
            <view class="delete-view" v-if="mode == 'normal' && isupdata" @click="goToCreate('pay', item)">修改已付</view>
            <view class="delete-view" v-if="mode == 'normal'" @click="goToCreate('detail', item)">详情</view>
            <view class="delete-view" v-if="mode == 'normal'" @click="delect(item)">删除</view>
          </view>
          <view class="cell-text" v-if="mode != 'normal'">
            <view class="cell-text-left fontsubcolor"><text>修改已付：</text></view>
            <view class="cell-text-right fontBlackcolor">
              <input class="input-style" type="digit" v-model="item.paidTotal" @input="(e) => handlePaidTotalChange(e, item)" placeholder="0.00" />
              <!-- <text>{{ item.businessNo || "--" }}</text> -->
            </view>
          </view>
        </cell>
        <view class="load-more" :class="{ 'batch-edit': mode != 'normal' }"><uni-load-more iconType="auto" :status="morestatus" /></view>
      </list>
    </view>
    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date" themeColor="#E60000" />
    <!-- 底部固定按钮 -->
    <view class="fixed-button" :class="{ hidden: hideButton }" v-if="mode != 'normal'">
      <view class="submit-button" @click="handleBatchPay">确定</view>
    </view>
    <uni-popup ref="payTip" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="edit-payment">
          <view class="model-tag"><text>修改已付</text></view>
          <view class="processing-payment">
            <view class="input-label">已付金额</view>
            <!-- @input="(e) => handlePaidTotalChange(e, item)" -->
            <input class="input-style" type="digit" v-model="paymentInput" placeholder="0.00" />
          </view>
          <view class="processing-payment">
            <view class="input-label">备注</view>
            <!-- @input="(e) => handlePaidTotalChange(e, item)" -->
            <input class="input-style" v-model="remarkInput" placeholder="备注" />
          </view>
        </view>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button pop-cancel" @click="paymentCancel">取消</text>
          <text class="uni-tip-button pop-confirm" @click="paymentConfirm">确定</text>
        </view>
      </view>
    </uni-popup>
    <w-picker :selectList="selectList" @confirm="onSelectConfirm" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import batchSubmit from "../mixins/batchSubmit";
import batchChecked from "../mixins/batchChecked";
import editPayment from "../mixins/editPayment";
let timer;
export default {
  props: {
    paymentState: {
      type: Object,
      default: () => null,
    },
    companyId: {
      type: String,
      default: "",
    },
  },
  components: {
    uniLoadMore,
    wPicker,
    filterView,
    labelArrow,
    selectView
  },
  mixins: [batchSubmit, batchChecked, editPayment],
  data() {
    return {
      // mode字段用于区分页面模式：'normal' 表示普通模式，'batchEdit' 表示批量编辑模式
      mode: "normal", // 可能的值为 'normal' 或 'batchEdit'
      // batchEditMode字段用于区分批量编辑的具体操作：'return' 表示批量还租，null 表示普通模式
      batchEditMode: null, // 可能的值为 'return' 或 null

      currentpage: 1,
      datalist: [],
      morestatus: "more",
      searchKey: "",
      isShowSelect: false,
      selectList: [
        { label: "剩余应付 >0", value: "1" },
        { label: "剩余应付 =0", value: "2" },
        { label: "剩余应付 <0", value: "3" },
      ],
      showfilter: false,
      totalFlag: {},
      startDate: "开始时间",
      endDate: "结束时间",
      selectType: "",
      isupdata: true,
      isExportList: true,
      totalCount: "100",
    };
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  created() {
    // 使用 prop 来设置 mode 和 batchEditMode

    if (this.paymentState && this.paymentState.batchEditMode) {
      this.mode = "batchEdit";
      this.batchEditMode = this.paymentState.batchEditMode;
      this.hideButton = true;
    }
    // 获取存储的权限信息
    this.getPrivileges();
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租应付",
      "列表"
    );
    // uni.$on("choose-company-emit", (data) => {
    //   this.redirectToTargetIfRouteMatches("sublet-choose-company", data);
    // });

    uni.$on("refresh-subletpay-list", (data) => {
      uni.showLoading();
      this.headerrefresh();
    });
  },
  // onLoad(options) {
  //   // 事件监听

  // },
  methods: {
    filtterShow() {
      this.isShowSelect = !this.isShowSelect;
    },
    showSelector() {
      this.$refs.selector.show();
    },
    onSelectConfirm(val) {
      this.totalFlag = val.checkArr;
    },
    reset() {
      this.totalFlag = {};
      uni.showLoading();
      this.headerrefresh();
      this.isShowSelect = !this.isShowSelect;
    },
    query() {
      this.headerrefresh();
      this.isShowSelect = !this.isShowSelect;
      // uni.navigateTo({
      // 	url: './monitor-filtrate?item=' + encodeURIComponent(JSON.stringify(this.filterDic))
      // });
    },
    delect(item) {
      uni.showModal({
        title: "提示",
        content: "此操作将永久删除该数据，是否继续",
        success: (res) => {
          if (res.cancel) {
          }
          else {
            let urlstr = this.$url.DELECT_SUBLET_PAYMENT.replace(
              /{id}/,
              item.id
            );

            this.$network
              .getData(urlstr, "DELETE", null)
              .then((result) => {
                this.headerrefresh();
              })
              .catch((err) => {
                uni.showToast({
                  icon: "none",
                  title: err.details.join(","),
                });
              });
          }
        },
      });
    },
    redirectToTargetIfRouteMatches(expectedRoutePartial, data, delay = 100) {
      const checkAndNavigate = () => {
        // 获取当前页面
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];

        // 检查当前页面路由是否包含期望的部分字符串
        if (currentPage.route.includes(expectedRoutePartial)) {
          // 如果符合预期，跳转到目标路由
          setTimeout(checkAndNavigate, delay);
        } else {
          // 如果不符合，延时后再次检查
          uni.navigateTo({
            url: "./sublet-pay/sublet-pay-add?company=" +
              encodeURIComponent(JSON.stringify(data.dict)),
          });
        }
      };
      // 初始检查
      checkAndNavigate();
    },
    // 通用化setCompanyInfo方法，处理不同的数据赋值逻辑
    updateDataDic(key, value) {
      this.dataDic = { ...this.dataDic, [key]: value };
    },
    getPrivileges() {
      uni.getStorage({
        key: this.$savekey.USER_PRIVILEGES_MEG,
        success: (res) => {
          this.isupdata = res.data.some(
            (x) => x.value === this.$savekey.PERMISSION_SUBLET_PAYADD
          );
          this.isupdata = true;
          // console.log("this.isupdata:", this.isupdata);
        },
      });
    },
    getleft(item) {
      let total = this.$datestr.doubleFloat(item.total) || 0;
      let paidTotal = this.$datestr.doubleFloat(item.paidTotal) || 0;
      return this.$datestr.doubleFloat(parseFloat(total) + parseFloat(paidTotal));
    },
    getDate(time) {
      // if (!time) return "--";
      // let timestr = time.split(/\s+/)[0];
      // return timestr.replace(/-/g, "/");
      if (!time) return "--";
      let timestr = time.split(/\s+/)[0];
      return timestr;
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
        size: this.mode == "normal" ? 20 : -1,
        subletCompanyId: this.companyId ? this.companyId : undefined,
        machineState: this.companyId === "" ? undefined : 1,
        subletState: this.companyId === "" ? undefined : 1,
        fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
        beginDate:
          this.startDate === "开始时间" ? undefined : this.startTime + " 00:00:00",
        endDate: this.endDate === "结束时间" ? undefined : this.startTime + " 23:59:59",
        totalFlag: this.totalFlag ? this.totalFlag.value : null
      };
      this.$network
        .getData(this.$url.SUBLET_PAY_LIST, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          this.datalist.forEach((item) => {
            item.checked = true;
            item.paidTotal_o = item.paidTotal;
            item.total_o = item.total;
            item.all = Number(item.paidTotal_o) + Number(item.total_o);
          });
          let pages = result.pages;
          if (pages <= this.currentpage) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          this.totalCount = result.total.toString();
          setTimeout(() => {
            const query = uni.createSelectorQuery().in(this);
            query
              .select(".list-panel")
              .boundingClientRect((rect) => {
                if (rect) {
                  // 获取组件高度
                  const componentHeight = rect.height;

                  // 获取窗口高度
                  const windowHeight = uni.getSystemInfoSync().windowHeight;
                  // 判断是否可滚动
                  if (componentHeight > windowHeight) {
                    if (this.datalist && this.datalist.length > 0)
                      this.hideButton = false;
                    else {
                      this.hideButton = true;
                    }
                  } else {
                    if (this.datalist && this.datalist.length > 0)
                      this.hideButton = false;
                    else {
                      this.hideButton = true;
                    }
                  }
                }
              })
              .exec();
          }, 100);
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
      if (type === "pay") {
        this.$refs.payTip.open();
        console.log("item", item);
        this.paymentForm = {
          total_o: item.total,
          total: item.total,
          paidTotal_o: item.paidTotal,
          businessNo: item.businessNo,
        };
        this.paymentInput = item.paidTotal;
        this.remarkInput = item.paidRemark;
      } else if (type === "detail") {
        uni.navigateTo({
          url:
            "./sublet-pay/sublet-pay-detail?item=" +
            encodeURIComponent(JSON.stringify(item)),
        });
      } else if (type === "add") {
        uni.navigateTo({
          url: "./sublet-apply/sublet-choose-company",
        });
      }
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
    handlePaidTotalChange(e, item) {
      console.log(e.target.value);
      const updatedItem = {
        ...item,
        paidTotal: e.target.value,
        paidTotal_o: e.target.value,
        total: Number(item.all) - Number(e.target.value),
      };

      // 找到 datalist 中对应的元素索引
      const index = this.datalist.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        // 使用 Vue.set 更新 datalist
        this.$set(this.datalist, index, updatedItem);
      }
    },
    checkedDatalist() {
      // 过滤出 checked 为 true 的元素，并重新组织数据结构
      return this.datalist
        .filter((item) => item.checked)
        .map((item) => ({
          businessNo: item.businessNo, // 将 businessKey 重命名为 businessNo
          total: item.total, // 保留 licenseId
          paidTotal: item.paidTotal, // 保留 rentBackDate
        }));
    },
    handleBatchPay() {
      this.$network
        .getData(this.$url.BATCH_SUBLET_PAY_FINISH, "PUT", {
          settlementList: this.checkedDatalist(),
        })
        .then((result) => {
          this.handleBatchAfter("批量修改付款成功");
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message + ":" + err.details[0],
          });
        });
    },
    onConfirm(val) {
      if (this.selectType === "start") {
        this.startDate = val.result;
      } else if (this.selectType === "end") {
        this.endDate = val.result;
      }
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
      // 	beginDate: this.startDate === "开始时间" ? undefined : (this.startTime + " 00:00:00"),
      // 	endDate: this.endDate === "结束时间" ? undefined : (this.startTime + " 23:59:59"),
      // };
      // let url= this.$url.SUBLET_PAY_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)

      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
        beginDate:
          this.startDate === "开始时间" ? undefined : this.startTime + " 00:00:00",
        endDate: this.endDate === "结束时间" ? undefined : this.startTime + " 23:59:59",
      };
      let url = this.$gxfmethod.getUrl(this.$url.SUBLET_PAY_LIST);
      console.log(url);
      let filename = this.$gxfmethod.getFileName("转租应付记录-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/components/__sublet-batch-submit";
@import "../assets/components/__sublet-edit-payment";

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

.right-filtter-btn {
  display: flex;
  margin: 0px 10px;
  padding: 6px 10px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #222222;
}

.top-search-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ffffff;

  .select-view {
    margin-top: 5px;
    width: 30%;
    margin-top: 5px;
    margin-left: calc(10% / 4);
  }

  .filter-view {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e60000;
    color: #ffffff;
    padding: 8px 0px;
    flex: 1;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    margin-right: 10px;
  }

  .reset-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    background: $uni-bg-color-grey;
    color: $uni-text-color;
    padding: 8px 0px;
    flex: 1;
    border-radius: 4px;
    text-align: center;
    font-size: $uni-font-size-base;
    margin-right: 10px;
    margin-left: 10px;
  }
}


//列表的subview
.list-sub-view {
  display: flex;
  width: 100%;
  background: $uni-bg-color-grey;
  // margin-top: 100px;
  margin-top: 55px;

  &.batch-edit {
    margin-top: 0;
  }
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;

  .load-more {
    &.batch-edit {
      padding-bottom: 180upx;
    }
  }
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

  &.bussiness-key {
    justify-content: flex-start;
  }
}

.cell-text-left {
  display: flex;
  flex: 1;
  margin-left: 15px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;

  &.bussiness-key {
    flex: none;
    font-weight: bolder;
    color: #000;
  }
}

.cell-text-right {
  display: flex;
  flex: 1;
  text-align: right;
  margin-right: 15px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;

  &.bussiness-key {
    font-weight: bolder;
    color: #000;
  }

  .input-style {
    border: 1upx solid #dedede;
    color: #4cd964;
    padding: 0 10upx;
    width: 200upx;
    text-align: right;
  }
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
</style>
