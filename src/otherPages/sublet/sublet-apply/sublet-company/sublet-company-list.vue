<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="add-container" @click="goTo('create', null)" v-if="isPermissionAdd"
      ><i class="iconfont labelstyle iconadd"></i
    ></view>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"
            ><input
              style="flex: 1; font-size: 14px"
              placeholder="公司名称/联系人/电话"
              @input="searchChange"
          /></view>
        </view>
        <view class="filter-view-style" @click="exportExcel" v-if="isExportList"
          >导出</view
        >
      </view>
    </view>
    <view class="list-sub-view">
      <view class="list-view">
        <view class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>公司名称</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.name || "" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>联系人（电话）</text></view>
            <view class="cell-text-right fontBlackcolor">
              <view style="display: flex">
                {{ item.contact || "" }}
                (
                <labelPhone :value="item.phone" fontColor="#000000" />
                )
              </view>
            </view>
          </view>
          <!-- 
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>联系电话</text></view>
						<view class="cell-text-right fontBlackcolor">
							<labelPhone :value="item.phone" fontColor="#000000" />
						</view>
					</view > 
					-->

          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租单（个）</text></view>
            <view class="cell-text-right themecolor" @click="goTo('order', item)">
              <text>{{ item.orderCount || 0 }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租中（台）</text></view>
            <view
              class="cell-text-right themecolor"
              @click="goTo('device', item, { value: '1', label: '转租中' })"
            >
              <text>{{ item.subletCount || 0 }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>已还租（台）</text></view>
            <view
              class="cell-text-right themecolor"
              @click="goTo('device', item, { value: '2', label: '已还租' })"
            >
              <text>{{ item.rentBackCount || 0 }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>闲置转租（台）</text></view>
            <view
              class="cell-text-right themecolor"
              @click="goTo('device', item, { value: '3', label: '闲置转租' })"
            >
              <text>{{ item.subletForRentCount || 0 }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>履约应付</text>
              <businessTips :tips="labelTips" />
            </view>
            <view class="cell-text-right fontBlackcolor"
              >￥{{
                moneyUtil.dealNumber(item.subletReceivable ? item.subletReceivable : 0)
              }}</view
            >
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>转租应付</text>
              <businessTips :tips="labelTips" />
            </view>
            <view class="cell-text-right fontBlackcolor"
              >￥{{
                moneyUtil.dealNumber(item.subletSettle ? item.subletSettle : 0)
              }}</view
            >
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>已付总额</text>
              <businessTips :tips="labelTips" />
            </view>
            <view class="cell-text-right fontBlackcolor"
              >￥{{ moneyUtil.dealNumber(item.paidTotal ? item.paidTotal : 0) }}</view
            >
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>剩余应付</text>
              <businessTips :tips="labelTips" />
            </view>
            <view class="cell-text-right fontBlackcolor"
              >￥{{ moneyUtil.dealNumber(item.remaining ? item.remaining : 0) }}</view
            >
          </view>
          <view class="line-s" />
          <view class="operate-container">
            <view class="update-view" @click="goTo('detail', item)">详情</view>
            <view class="update-view" @click="goTo('apply', item)">转租</view>
            <view
              class="update-view"
              @click="goTo('device', item, { value: 3, batchEditMode: 'return' })"
              v-if="item.subletForRentCount > 0"
              >还租</view
            >
            <view
              class="update-view"
              @click="goTo('payment', item, { batchEditMode: 'payable' })"
              >付款</view
            >
            <view
              class="update-view"
              @click="goTo('update', item)"
              v-if="isPermissionEdit"
              >修改</view
            >
            <view
              class="update-view"
              @click="deleteItem(item)"
              v-if="item.orderCount === 0 && isPermissionDelete"
              >删除</view
            >
          </view>
        </view>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
let timer;
export default {
  components: {
    uniLoadMore,
    uniPopup,
    labelPhone,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "more",
      searchKey: "",
      startTime: "", //筛选的开始时间
      endTime: "", //筛选的结束时间
      pickType: "",
      isshow: false,
      tipTitle: "新建物流公司",
      dialogData: {},
      operateType: "create",
      isPermissionAdd: true,
      isPermissionEdit: true,
      isPermissionDelete: true,
      isExportList: true,
      totalCount: "100",
      labelTips: `履约应付：
					  <br>
					转租设备从启用至今产生的费用
					  <br>
					转租应付（转租成本）：
					  <br>
					转租应付单合计的费用
					  <br>
					已付总额：
					  <br>
					已付给转租公司的费用
					  <br>
					 剩余应付：
					  <br>
					 转租应付-已付总额`,
    };
  },
  mounted() {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isPermissionAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_COMPANY_ADD
        );
        this.isPermissionEdit = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_COMPANY_EDIT
        );
        this.isPermissionDelete = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_COMPANY_DELETE
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.showLoading();
    this.loaddata();
    uni.$on("refresh-list", () => {
      uni.showLoading();
      this.headerrefresh();
    });
  },
  created() {
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租公司",
      "列表"
    );
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
      if (this.morestatus == "noMore" || this.morestatus == "loading") {
        return;
      }
      this.currentpage += 1;
      // this.morestatus = "loading";
      this.loaddata();
    },
    loaddata() {
      this.morestatus = "loading";
      let param = {
        current: this.currentpage,
        size: 20,
        fuzzyParam: this.searchKey,
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
    deleteItem(item) {
      if (item.subletCount > 0) {
        uni.showToast({
          icon: "none",
          title: "公司存在转租设备，无法删除",
        });
        return;
      }
      uni.showModal({
        title: "提示",
        content: "确认要删除该公司?",
        success: (res) => {
          if (res.cancel) {
          } else {
            uni.showLoading();
            let urlstr = this.$url.DELETE_SUBLET_CONMPANY.replace(/{id}/, item.id);
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
    goTo(type, item, state) {
      const urlMap = {
        create: "./create-sublet-company?type=create",
        update: item ? `./create-sublet-company?type=update&companyId=${item.id}` : "",
        detail: item ? `./sublet-company-detail?companyId=${item.id}` : "",
        device: item
          ? `../../sublet-tab?index=3&companyName=${item.name}&companyId=${
              item.id
            }&deviceState=${JSON.stringify(state)}`
          : "",
        order: item ? `../../sublet-tab?index=0&companyName=${item.name}` : "",
        apply: item ? `../create-sublet?companyId=${item.id}` : "",
        payment: item
          ? `../../sublet-tab?index=2&companyId=${item.id}&companyName=${
              item.name
            }&paymentState=${JSON.stringify(state)}`
          : "",
      };

      const url = urlMap[type];
      if (url) {
        uni.navigateTo({ url });
      } else {
        console.error("Invalid navigation type:", type);
      }
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	fuzzyParam: this.searchKey
      // };
      // let url= this.$url.SUBLET_CONMPANY_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)

      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.searchKey,
      };
      let url = this.$gxfmethod.getUrl(this.$url.SUBLET_CONMPANY_LIST);
      let filename = this.$gxfmethod.getFileName("转租公司记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: "../sublet-apply/sublet-device/sublet-device-list",
    });
  },
  onPullDownRefresh() {
    this.headerrefresh();
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

.filter-view-style {
  display: flex;
  margin-right: 10px;
  height: 35px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  background-color: #ffffff;
  border: 1px solid $uni-color-primary;
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

.update-view {
  margin-left: 14px;
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
