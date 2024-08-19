<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="search-top">
      <view class="search-box">
        <i class="iconfont search-icon iconzl--sousuo"></i>
        <view class="search-content">
          <input
            placeholder="司机姓名/手机号"
            v-model="fuzzyParam"
            style="font-size: 14px"
          />
        </view>
      </view>
      <view class="btn-confirm" @click="submit">搜索</view>
      <view class="export-css" @click="exportExcel" v-if="isExportList"
        ><text>导出</text></view
      >
    </view>
    <c-loadmore-list
      scroll-y
      class="flex-scroll-wrapper"
      :loadMoreStatus="morestatus"
      @loadmore="footerrefresh"
    >
      <view class="list-view-cell" v-for="(item, index) in datalist" :key="index">
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>司机姓名</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.name || "-" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>手机号</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.phoneNum || "-" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>备注</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.remark || "-" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>创建人</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ item.createName || "-" }}</text>
          </view>
        </view>
        <view class="cell-text">
          <view class="cell-text-left fontsubcolor"><text>创建时间</text></view>
          <view class="cell-text-right fontBlackcolor">
            <text>{{ changestr(item.createTime) }}</text>
          </view>
        </view>
        <view class="operate-container">
          <view class="delete-view" @click="showDialog('attachment', item)">
            附件({{ item.fileList ? item.fileList.length : 0 }})
          </view>
          <view
            class="delete-view"
            @click="showDialog('update', item)"
            v-if="isPermissionEdit"
          >
            修改
          </view>
          <view class="delete-view" @click="deleteItem(item)" v-if="isPermissionDelete"
            >删除</view
          >
        </view>
      </view>
    </c-loadmore-list>
    <view class="pop-container">
      <uni-popup ref="manDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">{{ tipTitle }}</view>
          <view class="row-item" v-if="operateType != 'attachment'">
            <view class="row-tag">
              司机姓名
              <span style="color: #ff0000">*</span>
            </view>
            <input
              class="input-style"
              v-model="dialogData.name"
              placeholder="请输入司机姓名..."
            />
          </view>
          <view class="row-item" v-if="operateType != 'attachment'">
            <view class="row-tag">
              手机号
              <span style="color: #ff0000">*</span>
            </view>
            <input
              class="input-style"
              v-model="dialogData.phoneNum"
              placeholder="请输入手机号..."
              type="number"
            />
          </view>
          <view class="col-item" v-if="operateType != 'attachment'">
            <view class="row-tag">备注</view>
            <textarea
              class="text-style"
              v-model="dialogData.remark"
              placeholder="请输入备注..."
            />
          </view>
          <view style="margin-left: -10px">
            <imgupload
              @uploadfinish="uploadfinish"
              @deleteUrl="deleteUrl"
              :imgFinishlist="dialogData.fileList"
              type="logistics_driver"
              uploadType="attachment"
              :maximg="20"
              :isupload="iseditAtt"
            />
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
export default {
  components: {
    uniLoadMore,
    uniPopup,
    imgupload,
  },
  props: {
    isPermissionEdit: {
      type: Boolean,
      default: true,
    },
    isPermissionDelete: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      fuzzyParam: "",
      morestatus: "more",
      pickType: "",
      tipTitle: "新增司机信息",
      dialogData: {
        name: "",
        phoneNum: "",
        remark: "",
      },
      operateType: "create",
      iseditAtt: true,
      isExportList: true,
      totalCount: "100",
    };
  },
  created() {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  methods: {
    changestr(str) {
      if (str == null) {
        return "-";
      }
      return str.split(" ")[0];
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
    submit() {
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    loaddata() {
      uni.showLoading();
      let param = {
        current: this.currentpage,
        size: 20,
        fuzzyParam: this.fuzzyParam,
        logisticsProviderType: "3",
      };
      this.$network
        .getData(this.$url.OUER_LOGISTICES_DRIVER_PAGE, "POST", param)
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
    createPop() {
      this.showDialog("create", null);
    },
    hidePop() {
      this.cancelDialog();
    },
    showDialog(type, item) {
      this.operateType = type;
      if (type === "update") {
        this.iseditAtt = true;
        this.dialogData = {
          ...item,
        };
        this.tipTitle = "修改司机信息";
      } else if (type === "create") {
        this.iseditAtt = true;
        this.dialogData = {
          name: "",
          phoneNum: "",
          remark: "",
        };
        this.tipTitle = "新增司机信息";
      } else if (type == "attachment") {
        this.iseditAtt = this.getAttchMent(item);
        this.dialogData = {
          ...item,
        };
        this.tipTitle = "附件";
      }
      this.$refs.manDialog.open();
    },
    getAttchMent(item) {
      if (item.canUploadFile == "0") {
        return false;
      } else {
        return true;
      }
    },
    cancelDialog() {
      this.$refs.manDialog.close();
    },
    confirmDialog() {
      if (!this.dialogData) {
        return;
      }
      if (!this.dialogData.name) {
        uni.showToast({
          title: "请输入姓名",
          icon: "none",
        });
        return;
      }
      if (!this.dialogData.phoneNum) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return;
      }
      if (this.$datestr.isphonenum(this.dialogData.phoneNum) === false) {
        uni.showToast({
          icon: "none",
          title: "请输入正确手机号",
        });
        return;
      }
      switch (this.operateType) {
        case "create":
          this.dialogData = {
            ...this.dialogData,
            logisticsProviderType: "3",
          };
          this.dealInfo("POST");
          break;
        case "update":
          this.dealInfo("PUT");
          break;
        case "attachment":
          this.dealInfo("PUT");
          break;
        default:
          break;
      }
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.dialogData = {
        ...this.dialogData,
        fileList: [...list],
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.dialogData = {
        ...this.dialogData,
        fileList: [...list],
      };
    },
    dealInfo(method) {
      this.$network
        .getData(this.$url.OUER_LOGISTICES_DRIVER_EDIT, method, this.dialogData)
        .then((result) => {
          this.cancelDialog();
          this.headerrefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title:
              err.details && err.details[0]
                ? err.details[0]
                : err.message
                ? err.message
                : "",
          });
        });
    },
    deleteItem(item) {
      uni.showModal({
        title: "提示",
        content: "确定要删除" + item.name,
        success: (res) => {
          if (res.confirm) {
            let urlstr = this.$url.DELETE_OUER_LOGISTICES_DRIVER.replace(/{id}/, item.id);
            this.$network
              .getData(urlstr, "DELETE", null)
              .then((result) => {
                this.headerrefresh();
              })
              .catch((err) => {});
          } else if (res.cancel) {
          }
        },
      });
    },
    exportExcel() {
      let param = {
        current: 1,
        size: this.totalCount,
        fuzzyParam: this.licenseId,
        logisticsProviderType: "3",
      };
      let url =
        this.$url.BASE_URL + this.$url.OUER_LOGISTICES_DRIVER_PAGE + "?isExport=true";
      let filename = this.$gxfmethod.getFileName("物流司机记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
  width: 100%;
  // height: 100%;
  background: $uni-bg-color-grey;
  position: relative;
  flex: 1;
  @include flex(column);
}

.search-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
  padding-bottom: 4px;
  width: 100%;
  z-index: 100;
  // position: fixed;
  top: 44px;
  left: 0px;
  padding-top: 6px;
}

.search-box {
  background: #f7f7f7;
  height: 32px;
  flex: 1;
  line-height: 32px;
  display: flex;
  margin: 0px 8px;
  flex-direction: row;
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  flex: 1;
}

.btn-confirm {
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  border-radius: 4px;
  margin: 0px 4px;
}
.export-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  background: #ffffff;
  border-radius: 4px;
  margin-right: 5px;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
}

.select-view {
  flex: 1;
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
  padding: 5px 5px 8px 5px;
}

.cell-text {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
}

.cell-text-left {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-left: 15px;
  justify-content: flex-start;
  align-items: center;
  min-width: 56px;
  font-size: $uni-font-size-base;
}

.cell-text-right {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-right: 15px;
  justify-content: flex-end;
  text-align: end;
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

.operate-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 10px;
  margin-top: 10px;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  padding-top: 4px;
  border-top: 1px solid #eeeeee;
}

.fontsubcolor {
  color: $uni-text-color-gray;
}
.delete-view {
  margin-left: 10px;
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
  margin-top: 16px;
  flex-direction: column;
  align-items: flex-start;
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
}
.text-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 2px 6px;
  border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
  height: 45px;
  width: calc(100% - 40px);
  margin-top: 8px;
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
