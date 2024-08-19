<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="add-container" v-if="isShowAdd && mode == 'normal'" @click="goToCreate('create', null)">
      <i class="iconfont labelstyle iconadd"></i>
    </view>
    <view class="search-container" v-if="mode == 'normal'">
      <view class="search-box">
        <view class="search-content">
          <input style="flex: 1; font-size: 14px" placeholder="公司名称/联系人/电话" :value="searchKey" @input="searchChange" />
        </view>
      </view>
      <view class="btnstyle" @click="exportExcel" v-if="isExportList">
        <text>导出</text>
      </view>
    </view>
    <view style="width: 100%; height: 60px" v-if="mode == 'normal'" />
    <view class="list-sub-view">
      <view class="list-view">
        <view class="list-view-cell" v-for="(item, index) in datalist" :key="index" :class="{ 'batch-edit': mode != 'normal' }">
          <view class="cell-text">
            <view class="cell-text-left fontBlackcolor" style="color: #000000;flex:3">
              <text>转租单号：{{ item.businessNo || "" }}</text>
            </view>
            <view class="cell-text-right fontgreencolor" v-if="mode == 'normal'">
              <text>{{ item.stateName || "" }}</text>
            </view>
            <view v-else-if="mode === 'batchEdit'" class="cell-text-right fontBlackcolor" @click="changeCheck(index, item)">
              <!-- :disabled="item.checked == true ? true : false" -->
              <mycheckbox class="checkbox" :checked="item.checked == true ? true : false" color="#E60000" />
            </view>
          </view>
          <view class="line-s" />
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>公司名称</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.subletCompanyName || "" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>转租数量（台）</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.state !== '4' ? "-" : item.allTotal || "0" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>还租数量（台）</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.state !== '4' ? "-" : item.rentBackCount || "0" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>启用时间</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ getDate(item.subletDate) }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>转租申请人</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.customerName || "-" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>区域</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.orgName || "" }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <text>履约应付</text>
            </view>
            <view class="cell-text-right fontBlackcolor">
              <text>
                {{
                  item.state !== '4'
                  ? "-"
                  : "￥" + (moneyUtil.dealNumber(item.receivable) || "0")
                }}
              </text>
            </view>
          </view>
          <view class="cell-text" v-if="mode != 'normal'">
            <view class="cell-text-left fontsubcolor">
              <text>进度</text>
            </view>
            <view class="cell-text-right fontgreencolor">
              <text>
                {{ item.stateName || "" }}
              </text>
            </view>
          </view>
          <view class="line-s" v-if="mode == 'normal'" />
          <view class="operate-container" v-if="mode == 'normal'">
            <taskBtn :itemData="item" />
            <view class="all-records-view" @click="editCreate(item)" v-if="ishowupdata(item)">修改</view>
            <view class="all-records-view" @click="goTo(item)">详情</view>
          </view>
        </view>
        <view class="load-more" :class="{ 'batch-edit': mode != 'normal' }"><uni-load-more iconType="auto" :status="morestatus" /></view>
      </view>
    </view>
    <!-- 底部固定按钮 -->
    <view class="fixed-button" :class="{ hidden: hideButton || !isAnyChecked }">
      <view class="submit-button" @click="handleBatchSelect">确定</view>
    </view>
  </view>
</template>

<script>
import filterView from "@/components/common/common-ui/filter-view.vue";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import batchChecked from "../mixins/batchChecked";
import batchSubmit from "../mixins/batchSubmit";
let timer;
export default {
  mixins: [batchSubmit, batchChecked],
  components: {
    filterView,
    uniLoadMore,
    labelArrow,
    wPicker,
    taskBtn,
  },
  props: {
    companyName: String,
    applyState: {
      type: Object,
      default: () => null,
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
  },
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
      isShowCompany: true,
      isShowDevice: true,
      isShowAdd: true,
      userid: "",
      rentType: [],
      totalCount: "100",
      isExportList: true,
    };
  },
  mounted() {
    uni.showLoading();
    this.searchKey = this.companyName;
    this.loaddata();

  },
  created() {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isShowCompany = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_COMPANY
        );
        this.isShowDevice = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_DEVICE
        );
        this.isShowAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_ADD
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.userid = res.data.id;
      },
    });
    if (this.applyState && this.applyState.batchEditMode) {
      this.mode = "batchEdit";
      this.batchEditMode = this.applyState.batchEditMode;
      this.hideButton = false;
      this.isShowAdd = false;
    }
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租申请",
      "列表"
    );
  },
  methods: {
    changeCheck(index, item) {
      this.$set(item, "checked", !item.checked); // 使用 Vue.set 确保响应性
      // this.$forceUpdate()
      // if (!item.rentBackDate)
      // this.showTimePick(index)
      // 如果需要对整个列表进行额外操作，可以在这里添加
    },
    checkedDatalist() {
      // 过滤出 checked 为 true 的元素，并重新组织数据结构
      return this.datalist
        .filter((item) => item.checked)
        .map((item) => ({
          businessNo: item.businessNo,
        }));
    },
    handleBatchSelect() {
      uni.$emit("choose-apply-emit", {
        checkList: this.checkedDatalist(),
      });
      uni.navigateBack({
        animationDuration: 200,
      });
    },
    ishowupdata(item) {
      return this.iscreator(item) && (item.state === "0" || item.state === "3");
    },
    iscreator(item) {
      if (item.createBy === this.userid) {
        return true;
      } else {
        return false;
      }
    },
    getDate(time) {
      if (!time) return "-";
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
        size: this.mode != "normal" ? -1 : 5,
        fuzzyParam: this.searchKey,
        state: this.mode != "normal" ? '4' : null
      };
      this.$network
        .getData(this.$url.SUBLET_APPLY_LIST, "POST", param)
        .then((result) => {
          let res = result && result.records ? result.records : []
          this.datalist = this.datalist.concat(res);
          if (this.checkedList.length > 0)
            this.updateCheckedStatus();
          // this.getRentTypes();
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
    updateCheckedStatus() {
      // 遍历 dataList
      this.datalist.forEach(item => {
        // 检查当前项的 businessNo 是否在 checkedList 中
        if (this.checkedList.includes(item.businessNo)) {
          this.$set(item, "checked", true);
          // 如果在 checkedList 中，设置 checked 为 true
          // item.checked = true;
        } else {
          // 可选：如果不在 checkedList 中，可以根据需要设置 checked 为 false
          this.$set(item, "checked", false);
          // item.checked = false;
        }
      });
    },
    getRentTypes() {
      this.rentType = [];
      this.datalist.forEach((item) => {
        let orderList = item.orderList;
        orderList.sort(function (x, y) {
          let a = Number.parseInt(x.settlementType);
          let b = Number.parseInt(y.settlementType);
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });
        let arr = [];
        orderList.forEach((o) => {
          arr = [...arr, o.settlementTypeName];
        });
        let rr = arr.filter(function (element, index, aa) {
          return aa.indexOf(element) === index;
        });
        this.rentType.push(rr);
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

    goTo(item) {
      let businessNostr = item.businessNo;
      let url = "./sublet-apply/sublet-apply-detail?businessNo=" + businessNostr;
      uni.navigateTo({
        url: url,
      });
    },
    editCreate(item) {
      uni.navigateTo({
        url:
          "./sublet-apply/create-sublet?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&isUpdate=1",
      });
    },
    goToCreate(type, item) {
      if (type === "create") {
        let url = "./sublet-apply/create-sublet";
        uni.navigateTo({
          url: url,
        });
      }
    },
    gotoOther(t) {
      switch (t) {
        case "device":
          uni.navigateTo({
            url: "./sublet-apply/sublet-device/sublet-device-list",
          });
          break;
        case "company":
          uni.navigateTo({
            url: "./sublet-apply/sublet-company/sublet-company-list",
          });
          break;
        default:
          break;
      }
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	subletCompanyName: this.searchKey
      // };
      // let url= this.$url.SUBLET_APPLY_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)

      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.searchKey,
      };
      let url = this.$gxfmethod.getUrl(this.$url.SUBLET_APPLY_LIST);
      let filename = this.$gxfmethod.getFileName("转租记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },


  },
};
</script>

<style lang="scss" scoped>
@import "../assets/components/_sublet-batch-submit";

//背景视图
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
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

  top: 0px;
  // #ifdef WEB
  top: 44px;
  // #endif
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
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.btnstyle {
  display: flex;
  margin-right: 10px;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  flex-direction: row;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  background-color: #ffffff;
  border: 1px solid $uni-color-primary;
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

//筛选父视图
.filter-view-style {
  height: 35px;
  display: flex;
  background: #eeeeee;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
}

//列表的subview
.list-sub-view {
  display: flex;
  width: 100%;
  background: $uni-bg-color-grey;
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

  &.batch-edit {
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
}

.cell-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 10px;
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
  // margin-top: 5px;
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
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: #eeeeee;
}

.operate-container {
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: flex-end;
  align-items: center;
}

.all-records-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  // padding: 4px 10px;
  // border-radius: 50px;
  // border: 1px solid $uni-color-primary;
}

.fontsubcolor {
  color: $uni-text-color-gray;
}

.types-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: $uni-font-size-xs;
  padding-left: 10px;
  padding-right: 10px;
}

.type-item-container {
  margin-bottom: 4px;
}

.in-type {
  padding: 0px 8px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  height: 14px;
  line-height: 14px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rent-name-view {
  color: $uni-color-primary;
  border-color: $uni-color-primary;
  margin-right: 8px;
}
</style>
