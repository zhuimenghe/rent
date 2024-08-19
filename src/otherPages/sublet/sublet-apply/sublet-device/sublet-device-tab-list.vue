<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view" v-if="mode == 'normal' && !(deviceState && deviceState.value)">
      <flexibleQueryView
        hint="自喷码/车号/型号/品牌"
        :isBorder="false"
        :isQuerykeyWord="true"
        :isExportList="isExportList"
        hint1="转租公司"
        :defaultKeyWord="keyWord"
        :isQueryDeviceProps="true"
        :isQuerySalesman="false"
        :isQueryOrg="false"
        :isCustomQuery="true"
        :customList="stateList"
        :defaultCustomObj="subletState"
        customHint="设备状态"
        @reset="reset"
        @query="query"
        @exportExcel="exportExcel"
      />
    </view>
    <view
      class="list-sub-view list-panel"
      :class="{ 'batch-edit': mode != 'normal' || (deviceState && deviceState.value) }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
    >
      <list class="list-view">
        <cell
          class="list-view-cell"
          v-for="(item, index) in datalist"
          :key="index"
          :class="{ 'batch-edit': mode != 'normal' }"
        >
          <view style="padding: 8px 0 0 12px" @click="gotoRentDeviceDetail(item)">
            <view class="item-head">
              <view class="head-top">
                <view
                  >{{ item.printCode || "-" }}
                  <text class="license">{{ item.licenseId || "-" }}</text>
                </view>
                <view v-if="mode === 'batchEdit'" class="cell-text-right fontBlackcolor" @click="changeCheck(index, item)">
                  <!-- :disabled="item.checked == true ? true : false" -->
                  <mycheckbox
                    class="checkbox"
                    :checked="item.checked == true ? true : false"
                    color="#E60000"
                  />
                </view>
                <view v-else>
                  <text v-if="item.subletState == 0"></text>
                  <text
                    v-else-if="item.subletState == 1"
                    class="cell-text-right"
                    style="color: #52c41a"
                    >{{ "租赁中" || "-" }}</text
                  >
                  <text
                    v-else-if="item.subletState == 2"
                    class="cell-text-right"
                    style="color: #f08200"
                    >{{ item.subletStateName || "-" }}</text
                  >
                </view>
              </view>
              <view class="head-bottom">
                <text>{{ item.typeName || "-" }}&nbsp;&nbsp;</text>
                <text class="item-text"
                  >|&nbsp;&nbsp;{{ item.heightName || "-" }}&nbsp;&nbsp;</text
                >
                <text class="item-text"
                  >|&nbsp;&nbsp;{{ item.brand || "-" }}&nbsp;&nbsp;</text
                >
                <text class="item-text"
                  >|&nbsp;&nbsp;{{ item.machineTypeName || "-" }}</text
                >
              </view>
            </view>
          </view>
          <view
            class="cell-bg"
            @click.stop="gotoDetail(item)"
            :class="{ 'batch-edit': mode != 'normal' }"
          >
            <view class="cell-text" v-if="mode === 'normal'">
              <view class="cell-text-left fontsubcolor"
                ><text class="cell-text-common">转租单号：</text>
                <text style="color: #e60000">{{ item.businessKey || "-" }}</text>
              </view>
            </view>
            <view class="cell-text" v-if="mode === 'normal'">
              <view class="cell-text-left fontsubcolor">
                <text class="cell-text-common">起租日期：</text>
                <text class="cell-text-dark">{{ getDate(item.actualSubletDate) }}</text>
              </view>
              <view class="cell-text-left fontsubcolor">
                <text class="cell-text-common">还租日期：</text>
                <text class="cell-text-dark">{{ getDate(item.rentBackDate) }}</text>
              </view>
            </view>
            <view class="cell-text" v-if="mode === 'normal'">
              <view class="cell-text-left fontsubcolor">
                <text class="cell-text-common">转租公司：</text>
                <text class="cell-text-dark">{{ item.subletCompanyName || "-" }}</text>
              </view>
            </view>
            <view class="cell-text" v-if="mode === 'batchEdit'">
              <view class="cell-text-left fontsubcolor">
                <span
                  :style="{
                    color: '#000000',
                  }"
                  >还租日期
                  <span style="color: #ff0000">*</span>
                </span>
              </view>

              <view class="cell-text-right fontBlackcolor">
                <view class="input-style" @click="showTimePick(index)">
                  <text style="color: #999999">
                    {{
                      getDate(item.rentBackDate) !== "-"
                        ? getDate(item.rentBackDate)
                        : "请选择还租日期"
                    }}
                  </text>
                </view>
                <i
                  class="iconfont iconarrow-right"
                  :style="{
                    'padding-right': '8px',
                    color: '#999999',
                  }"
                >
                </i>
              </view>
            </view>
          </view>

          <view class="operate-container" v-if="mode === 'normal'">
            <view
              class="delete-view"
              @click="showDialog(item)"
              v-if="item.subletState !== '2' && isShowRent"
              >还租
            </view>
            <view
              class="delete-view"
              v-if="item.subletState != 2"
              @click="updataMes(item)"
              >修改</view
            >
            <view
              class="delete-view"
              @click="pauseItem(item)"
              v-if="isShowPause && item.subletState != 2"
              >报停
            </view>
          </view>
        </cell>
        <view class="load-more" :class="{ 'batch-edit': mode != 'normal' }">
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
            <view class="input-style">
              <text class="input-style-text">{{ dialogData.businessKey }}</text></view
            >
          </view>
          <view class="row-item">
            <view class="row-tag">
              设备编号
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style"
              ><text class="input-style-text">{{ dialogData.licenseId }}</text></view
            >
          </view>
          <view class="row-item">
            <view class="row-tag">转租日期<span style="color: #ffffff">*</span></view>
            <view class="input-style">
              <text class="input-style-text">
                {{ getDate(dialogData.subletDate) }}
              </text>
            </view>
          </view>
          <view class="row-item">
            <view class="row-tag">
              还租日期
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style" @click="showTimePickPopup">
              <text class="input-style-text">
                {{ getDate(dialogData.rentBackDate) }}
              </text>
              <i
                class="iconfont iconarrow-right"
                :style="{
                  color: '#e60000',
                }"
              >
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
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      @cancel="onCancel"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <!-- 底部固定按钮 -->
    <view class="fixed-button" :class="{ hidden: hideButton || !isAnyChecked }">
      <view class="submit-button" @click="handleBatchRent">确定</view>
    </view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import flexibleQueryView from "@/components/common/common-ui/flexible-query-view.vue";
import batchSubmit from "../../mixins/batchSubmit";
import batchChecked from "../../mixins/batchChecked";
export default {
  props: {
    deviceState: {
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
    uniPopup,
    wPicker,
    flexibleQueryView,
  },
  mixins: [batchSubmit, batchChecked],
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
      dialogData: {
        subletDate: "",
        actualSubletDate: "",
      },
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
    };
  },

  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },

  mounted() {
    uni.showLoading();
    this.loaddata();
    this.loadState();
  },
  created() {
    if (this.deviceState && this.deviceState.batchEditMode) {
      this.mode = "batchEdit";

      this.batchEditMode = this.deviceState.batchEditMode;
    }
    console.log("---------------------------------this.deviceState", this.deviceState);

    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isShowPause = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_PAUSE
        );
        this.isShowRent = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_SUBLET_RENT
        );
      },
    });
    uni.$on("refresh-list", () => {
      this.headerrefresh();
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租设备",
      "列表"
    );
  },
  methods: {
    handleBatchRent() {
      let checkList = this.checkedDatalist();
      if (checkList && checkList.length > 0) {
        this.$network
          .getData(this.$url.BATCH_RETURN_SUBLET_DEVICE, "PUT", {
            rentBackVoList: checkList,
          })
          .then((result) => {
            this.handleBatchAfter("批量还租成功");
          })
          .catch((err) => {
            uni.showToast({
              icon: "none",
              title: err.message + ":" + err.details[0],
            });
          });
      } else {
        uni.showToast({
          icon: "none",
          title: "未勾选还租设备",
        });
        return;
      }
    },
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
    //设备类型
    loadState() {
      this.$network
        .loadType("sublet_state")
        .then((result) => {
          this.stateList = result;
        })
        .catch((err) => {});
    },

    loaddata() {
      let param = {
        current: this.currentpage,
        size: this.mode == "normal" ? 20 : -1,
        subletCompanyName: this.keyWord ? this.keyWord : undefined,
        subletCompanyId: this.companyId ? this.companyId : undefined,
        machineState: this.companyId === "" ? undefined : 1,
        subletState: this.companyId === "" ? undefined : 1,
        keyWord: this.fuzzyParam ? this.fuzzyParam : undefined,
        subletState:
          this.subletState && this.subletState.value ? this.subletState.value : undefined,
        type: this.type ? this.type : undefined,
        height: this.height ? this.height : undefined,
      };
      if (this.deviceState && (this.deviceState.value || this.deviceState.value == 0)) {
        if (this.deviceState.value == 0) {
          param.subletState = "";
          param.machineState = "";
        } else if (this.deviceState.value == 1) {
          param.subletState = 1;
          param.machineState = "";
        } else if (this.deviceState.value == 2) {
          param.subletState = 2;
          param.machineState = "";
        } else if (this.deviceState.value == 3) {
          param.subletState = 1;
          param.machineState = 1;
        }
      }
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
                    this.hideButton = false;
                  } else {
                    this.hideButton = false;
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

    showTimePick(itemIndex) {
      this.currentPickerIndex = itemIndex; // 存储当前的 item 索引
      this.dialogData = this.datalist[this.currentPickerIndex];
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    showTimePickPopup() {
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    onConfirm(val) {
      // 将字符串日期转换为日期对象
      const selectedDate = new Date(val.result.replace(/-/g, "/"));
      const actualSubletDate = new Date(
        this.dialogData.actualSubletDate.replace(/-/g, "/")
      );

      // 比较日期
      if (selectedDate < actualSubletDate) {
        // 如果 selectedDate 早于 actualSubletDate，显示提示并返回
        uni.showToast({
          icon: "none",
          title: "还租日期不可早于转租开始日期",
        });
        return;
      }
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
    onCancel() {
      if (!this.datalist[this.currentPickerIndex].rentBackDate)
        this.datalist[this.currentPickerIndex].checked = false;
    },
    showdaysDialog(item) {
      this.dayItem = item;
      this.dayNums = this.dayItem.pauseDays || 0;
      this.$refs.daysDialog.open();
    },
    canceldaysDialog() {
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
    gotoRentDeviceDetail(item) {
      if (this.mode === "batchEdit") {
        return;
      }
      let businessNostr = item.businessKey;
      // let url = './sublet-apply/sublet-device-detail?businessNo=' + businessNostr+'&licenseId='+item.licenseId;
      let url =
        "/subOtherPages/sublet/sublet-apply/sublet-device-detail?licenseId=" +
        item.licenseId +
        "&businessNo=" +
        businessNostr;

      uni.navigateTo({
        url: url,
      });
    },
    //跳入详情
    gotoDetail(item) {
      if (this.mode === "batchEdit") {
        return;
      }
      let businessNostr = item.businessKey;
      let url = "./sublet-apply/sublet-apply-detail?businessNo=" + businessNostr;
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
      // if ( != 1) {
      //   uni.showToast({
      //     title: "该转租设备未退场",
      //     duration: 2000,
      //     icon: "none",
      //   });
      //   return;
      // }
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
      let url =
        "./sublet-apply/sublet-device/sublet-device-updata?item=" +
        encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: url,
      });
    },
    //报停
    pauseItem(item) {
      uni.navigateTo({
        url:
          "./sublet-pause/create-sublet-pause?deviceItem=" +
          encodeURIComponent(JSON.stringify(item)),
      });
    },
    gotoFee() {
      uni.navigateTo({
        url: "./sublet-apply/sublet-device/sublet-device-fee",
      });
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
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
@import "../../assets/components/_sublet-batch-submit";

::v-deep .query-top-container .query-export-css {
  font-size: 32rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  border: none;
}

::v-deep .query-content {
  padding: 0 !important;
}

//背景视图
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
}

//搜索框
.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 100;
  top: 0px;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;

  .load-more {
    &.batch-edit {
      padding-bottom: 120upx;
    }
  }
}

//列表cell
.list-view-cell {
  margin-bottom: 5px !important;
  background: #ffffff;

  &:first-child {
    margin-top: 15px !important;
  }

  &.batch-edit {
    margin-bottom: 5px;

    &:first-child {
      margin-top: 0px !important;
    }
  }
}

.head-top {
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.license {
  display: inline-flex;
  padding: 5rpx 18rpx;
  background: #fff1f0;
  border-radius: 10px;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #e60000;
  margin-left: 14rpx;
}

.head-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
  margin-top: 4px;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

.item-text {
  margin-right: 2px;
  margin-left: 2px;
}

.cell-text {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;

  view {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
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
    flex: 1;
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

.cell-bg {
  background-color: #f7f7f7;
  padding: 16rpx 0;
  padding-right: 14px;

  &.batch-edit {
    padding: 0;
    background-color: #ffffff;
  }
}

.cell-text-common {
  font-size: 28rpx;
  min-width: 75px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

.cell-text-dark {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
}

.list-sub-view {
  display: flex;
  flex: 1;
  background: $uni-bg-color-grey;
  margin-top: 55px;

  &.batch-edit {
    margin-top: 0;
  }
}
</style>
