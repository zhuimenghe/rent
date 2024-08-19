<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view" v-if="mode == 'normal'">
      <flexibleQueryView hint="自喷码/车号/型号/品牌" :isQuerykeyWord="true" :isExportList="isExportList" hint1="转租公司" :defaultKeyWord="keyWord" :isQueryDeviceProps="true"
        :isQuerySalesman="false" :isQueryOrg="false" :isCustomQuery="true" :customList="stateList" :defaultCustomObj="subletState" customHint="设备状态" @reset="reset" @query="query"
        @exportExcel="exportExcel" />

      <!-- <view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="转租公司/转租单号/设备编号" @input="searchChange" />
					</view>
				</view>
				<view class="filter-view-style" @click="exportExcel" v-if="isExportList">
					导出
				</view>
			</view> -->
    </view>
    <view class="list-sub-view" :class="{ 'batch-edit': mode != 'normal' }">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index" :class="{ 'batch-edit': mode != 'normal' }">
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <view class="item-head">
                <view class="head-top">
                  <span>{{ item.printCode || "-" }}</span>
                  <span v-if="mode == 'normal'">|</span>
                  <span :class="{ license: mode == 'batchEdit' }">
                    {{ item.licenseId || "--" }}
                  </span>
                </view>
                <view class="head-bottom">
                  <text>{{ item.typeName || "--" }}</text>
                  |
                  <text class="item-text">{{ item.heightName || "--" }}</text>
                  |
                  <text class="item-text">{{ item.machineTypeName || "--" }}</text>
                  |
                  <text class="item-text">{{ item.brand || "--" }}</text>
                </view>
              </view>
            </view>
            <view v-if="mode === 'batchEdit'" class="cell-text-right fontBlackcolor" @click="changeCheck(index, item)" >
              <mycheckbox class="checkbox" :checked="item.checked" color="#E60000" :disabled="true"  />
            </view>
            <view v-else class="cell-text-right fontBlackcolor">
              <text>{{ item.subletStateName || "--" }}</text>
            </view>
          </view>
          <view class="line-s" />
          <view class="cell-text" @click="gotoDetail(item)" v-if="mode === 'normal'">
            <view class="cell-text-left fontsubcolor"><text>转租单号</text></view>
            <view class="cell-text-right fontBlackcolor" style="color: #e60000">
              <text>{{ item.businessKey || "--" }}</text>
            </view>
          </view>
          <view class="cell-text" v-if="mode === 'normal'">
            <view class="cell-text-left fontsubcolor"><text>起租日期</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ getDate(item.actualSubletDate) }}</text>
            </view>
          </view>
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <span :style="{
                color: mode === 'batchEdit' ? '#000000' : '#999999',
              }">还租日期
                <span style="color: #ff0000" v-if="mode === 'batchEdit'">*</span>
              </span>
            </view>
            <view class="cell-text-right fontBlackcolor" v-if="mode === 'normal'">
              <text>{{ getDate(item.rentBackDate) }}</text>
            </view>
            <view class="cell-text-right fontBlackcolor" v-else>
              <view class="input-style" @click="showTimePick(index)">
                <text style="color: #999999">
                  {{
                    getDate(item.rentBackDate) !== "--"
                    ? getDate(item.rentBackDate)
                    : "请选择还租日期"
                  }}
                </text>
              </view>
              <i class="iconfont iconarrow-right" :style="{
                    'padding-right': '8px',
                    color: mode === 'batchEdit' ? '#999999' : '#e60000',
                  }">
              </i>
            </view>
          </view>
          <view class="cell-text" v-if="mode === 'normal'">
            <view class="cell-text-left fontsubcolor"><text>转租公司</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.subletCompanyName || "--" }}</text>
            </view>
          </view>
          <view class="line-s" v-if="mode === 'normal'" />
          <view class="operate-container" v-if="mode === 'normal'">
            <view class="delete-view" @click="showDialog(item)" v-if="item.subletState !== '2' && isShowRent">还租</view>
            <view class="delete-view" @click="updataMes(item)">修改</view>
            <view class="delete-view" @click="pauseItem(item)" v-if="isShowPause">报停</view>
          </view>
        </cell>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </list>
    </view>
    <view class="pop-container">
      <uni-popup ref="companyDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">还租</view>
          <view class="row-item">
            <view class="row-tag">
              转租单号
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style"> <text class="input-style-text">{{ dialogData.businessKey }}</text></view>
          </view>
          <view class="row-item">
            <view class="row-tag">
              设备编号
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style"><text class="input-style-text">{{ dialogData.licenseId }}</text></view>
          </view>
          <view class="row-item">
            <view class="row-tag">转租日期<span style="color: #FFFFFF">*</span></view>
            <view class="input-style"><text class="input-style-text">{{ getDate(dialogData.subletDate) }}</text></view>
          </view>
          <view class="row-item">
            <view class="row-tag">
              还租日期
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style" @click="showTimePick">
              <text class="input-style-text"> {{ getDate(dialogData.rentBackDate) }}</text>
              <i class="iconfont iconarrow-right" :style="{
                color: '#e60000',
              }">
              </i>
            </view>

          </view>

          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
          </view>
        </view>
      </uni-popup>
    </view>
    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import flexibleQueryView from "@/components/common/common-ui/flexible-query-view.vue";
export default {
  components: {
    uniLoadMore,
    uniPopup,
    wPicker,
    flexibleQueryView,
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
      pickType: "",
      isshow: false,
      dialogData: {},
      dayNums: 0,
      dayItem: {},
      isShowPause: true,
      isShowRent: true,
      isExportList: true,
      totalCount: "100",
      stateList: [],
      fuzzyParam: "",
      keyWord: "",
      subletState: {},
      type: "",
      height: "",
      currentPickerIndex: null, // 用于存储当前操作的 item 索引
    };
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  onLoad(options) {
    uni.showLoading();
    this.keyWord = options.companyName ? options.companyName : "";
    this.subletState = options.deviceState ? JSON.parse(options.deviceState) : {};

    // 确保this.subletState存在，然后检查batchEditMode
    if (this.subletState && this.subletState.batchEditMode) {
      // 如果batchEditMode有值，设置为批量编辑模式
      this.mode = "batchEdit";
      this.batchEditMode = this.subletState.batchEditMode;
    } else {
      // 否则设置为普通模式
      this.mode = "normal";
      this.batchEditMode = null;
    }
    // console.log("this.subletState", this.subletState);
    this.loadState();
    this.loaddata();

    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isShowPause = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_PAUSE
        );
        this.isShowRent = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_RENT
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.$on("refresh-list", () => {
      this.headerrefresh();
    });
  },
  methods: {
    reset(val) {
      this.fuzzyParam = "";
      this.keyWord = "";
      this.type = "";
      this.height = "";
      this.subletState = {};
      this.headerrefresh();
    },
    query(val) {
      this.fuzzyParam = val.fuzzyParam; //自喷码/车号/型号/品牌
      this.keyWord = val.keyWord; //公司名称subletCompanyName
      this.type = val.typeObj && val.typeObj.value ? val.typeObj.value : "";
      this.height = val.heightObj && val.heightObj.value ? val.heightObj.value : "";
      this.subletState = val.customObj ? val.customObj : {};
      this.headerrefresh();
    },
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

    //设备类型
    loadState() {
      this.$network
        .loadType("sublet_state")
        .then((result) => {
          this.stateList = result;
        })
        .catch((err) => { });
    },

    loaddata() {
      let param = {
        current: this.currentpage,
        size: this.mode == "normal" ? 20 : -1,
        subletCompanyName: this.keyWord ? this.keyWord : undefined,
        keyWord: this.fuzzyParam ? this.fuzzyParam : undefined,
        subletState:
          this.subletState && this.subletState.value ? this.subletState.value : undefined,
        type: this.type ? this.type : undefined,
        height: this.height ? this.height : undefined,
      };
      this.$network
        .getData(this.$url.SUBLET_DEVICE_LIST, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
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
    showTimePick(itemIndex) {
      this.currentPickerIndex = itemIndex; // 存储当前的 item 索引
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    onConfirm(val) {
      this.dialogData = {
        ...this.dialogData,
        rentBackDate: val.result,
      };

      // 使用存储的索引来更新 dataList
      if (
        this.currentPickerIndex !== null &&
        this.currentPickerIndex >= 0 &&
        this.currentPickerIndex < this.datalist.length
      ) {
        this.datalist[
          this.currentPickerIndex
        ].rentBackDate = this.dialogData.rentBackDate;
        this.datalist[this.currentPickerIndex].checked = true;
      }

      // 重置 currentPickerIndex
      this.currentPickerIndex = null;
    },
    showdaysDialog(item) {
      this.dayItem = item;
      this.dayNums = this.dayItem.pauseDays || 0;
      this.$refs.daysDialog.open();
    },
    canceldaysDialog() {
      // this.dayNums = this.dayItem.pauseDays || 0
      this.$refs.daysDialog.close();
    },
    confirmdaysDialog() {
      let urlstr = this.$url.RETURN_SUBLET_DEVICE.replace(
        /{businessNo}/,
        this.dayItem.businessKey
      )
        .replace(/{licenseId}/, this.dayItem.licenseId)
        .replace(/{rentBackDate}/, this.dayItem.rentBackDate + " 00:00:00");
      this.$network
        .getData(urlstr, "PUT", null)
        .then((result) => {
          this.$refs.daysDialog.close();
          this.headerrefresh();
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message + ":" + err.details[0],
          });
        });
    },
    //跳入详情
    gotoDetail(item) {
      let url = "./sublet-device-detail?licenseId=" + item.licenseId;
      uni.navigateTo({
        url: url,
      });
    },
    //还租
    showDialog(item) {
      this.dialogData = {
        ...item,
        rentBackDate:
          item.rentBackDate && item.rentBackDate != null
            ? item.rentBackDate
            : this.$datestr.getnowdate(),
      };
      this.$refs.companyDialog.open();
    },
    cancelDialog() {
      this.$refs.companyDialog.close();
    },
    confirmDialog() {
      uni.showModal({
        title: "提示",
        content: "该操作会影响到转租应付，请知晓",
        success: (res) => {
          if (res.cancel) {
          } else {
            if (!this.dialogData) {
              return;
            }
            if (!this.dialogData.rentBackDate) {
              uni.showToast({
                icon: "none",
                title: "请选择还租日期",
              });
              return;
            }
            if (
              this.$datestr.timedifferent(
                this.dialogData.rentBackDate + " 23:59:59",
                this.dialogData.subletDate
              ) === -1
            ) {
              uni.showToast({
                icon: "none",
                title: "还租日期不能早于启用日期",
              });
              return;
            }
            let urlstr = this.$url.RETURN_SUBLET_DEVICE.replace(
              /{businessNo}/,
              this.dialogData.businessKey
            )
              .replace(/{licenseId}/, this.dialogData.licenseId)
              .replace(
                /{rentBackDate}/,
                encodeURIComponent(this.dialogData.rentBackDate + " 00:00:00")
              );
            this.$network
              .getData(urlstr, "PUT", null)
              .then((result) => {
                this.$refs.companyDialog.close();
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
    //修改
    updataMes(item) {
      let url = "./sublet-device-updata?item=" + encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: url,
      });
    },
    //报停
    pauseItem(item) {
      uni.navigateTo({
        url:
          "../../sublet-pause/create-sublet-pause?deviceItem=" +
          encodeURIComponent(JSON.stringify(item)),
      });
    },
    // 切换item的checked状态
    changeCheck(index, item) {
      this.$set(item, "checked", !item.checked); // 使用 Vue.set 确保响应性

      // 如果需要对整个列表进行额外操作，可以在这里添加
    },
    gotoFee() {
      uni.navigateTo({
        url: "./sublet-device-fee",
      });
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      // let param = {
      // 	fuzzyParam: this.fuzzyParam
      // };
      // let url= this.$url.SUBLET_DEVICE_LIST + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)

      let param = {
        current: 1,
        size: this.totalCount,
        subletCompanyName: this.keyWord ? this.keyWord : undefined,
        keyWord: this.fuzzyParam ? this.fuzzyParam : undefined,
        subletState:
          this.subletState && this.subletState.value ? this.subletState.value : undefined,
        type: this.type ? this.type : undefined,
        height: this.height ? this.height : undefined,
      };
      let url = this.$gxfmethod.getUrl(this.$url.SUBLET_DEVICE_LIST);
      let filename = this.$gxfmethod.getFileName("转租车辆记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
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
  background: $uni-color-primary;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 10px;
  border-radius: 5px;
  color: #ffffff;
  font-size: $uni-font-size-base;
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
  background: $uni-bg-color-grey;
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
}

//列表cell
.list-view-cell {
  // margin-left: 10px;
  // margin-right: 10px;
  margin-bottom: 5px;
  background: #ffffff;
  // border-radius: 4px;
  padding: 5px;

  &.batch-edit {
    margin-top: 15px;
  }
}

.item-head {}

.head-top {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;

  .license {
    display: inline-flex;
    padding: 5rpx 18rpx;
    background: #fbd9d9;
    border-radius: 16rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #e60000;
    margin-left: 14rpx;
  }
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
  display: flex;
  flex-direction: row;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-top: 7px;
  padding-bottom: 7px;
  flex: 1;
  border-bottom: 1px solid $uni-bg-color-grey;
  text-align: right;

  .input-style-text {
    flex: 1
  }
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
</style>
