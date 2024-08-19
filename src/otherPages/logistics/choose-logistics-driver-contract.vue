<template>
  <view class="content">
    <view class="add-container" @click="createDriver">
      <i class="iconfont labelstyle iconadd"></i>
    </view>
    <view class="item-assigner-list">
      <view class="l-item" v-for="(m, pos) in list" :key="pos" @click="changeCheck(pos)">
        <view class="item-name"> {{ m.name }}-{{ m.phoneNum }} </view>
        <mycheckbox class="checkbox" :checked="m.checked" color="#E60000" v-if="isEdit" />
      </view>
    </view>
    <view class="bottom-view" v-if="isEdit">
      <view class="choosed-view"
        >已选：<span>{{ chooseDriver ? 1 : 0 }} </span></view
      >
      <view class="confirm-view" @click="confirm">确定</view>
    </view>
    <uni-popup ref="driverDialog" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="tip-title">新建司机</view>
        <view>
          <view class="row-item">
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
          <view class="row-item">
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
          <view class="col-item">
            <view class="row-tag">备注</view>
            <textarea
              class="text-style"
              v-model="dialogData.remark"
              placeholder="请输入备注..."
            />
          </view>
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
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      allList: [],
      list: [],
      searchKey: "",
      chooseDriver: null,
      isEdit: true,
      typestr: "",
      dialogData: {
        name: "",
        phoneNum: "",
        remark: "",
        fileList: [],
      },
    };
  },
  onLoad(options) {
    // this.getDrivers(choosedId);
    const choosedId = options.choosedId ? options.choosedId : "";
    this.isEdit = options.isEdit == "true" ? true : false;
    this.getDrivers(choosedId);
    if (this.isEdit) {
      //   this.getDrivers(choosedId);
    } else {
      uni.setNavigationBarTitle({
        title: "司机信息",
      });
      //   this.chooseDriver = this.list.find((driver) => driver.id === choosedId) || null;
      //   this.list = this.chooseDriver ? [this.chooseDriver] : [];
    }
    if (options.type) {
      this.typestr = options.type;
    }
  },
  methods: {
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
    createDriver() {
      this.$refs.driverDialog.open();
    },
    cancelDialog() {
      this.dialogData = {
        name: "",
        phoneNum: "",
        remark: "",
        fileList: [],
      };
      this.$refs.driverDialog.close();
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

      this.dialogData = {
        ...this.dialogData,
        logisticsProviderType: "3",
      };
      let url = this.$url.OUER_LOGISTICES_DRIVER_EDIT;
      this.$network
        .getData(url, "POST", this.dialogData)
        .then((result) => {
          this.cancelDialog();
          this.getDrivers();
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
    searchChange(val) {
      this.searchKey = val.detail.value;
      if (this.searchKey) {
        this.list = this.allList.filter((o) => {
          return o.username.indexOf(this.searchKey) != -1;
        });
      } else {
        this.list = [...this.allList];
      }
    },
    changeCheck(pos) {
      this.list.forEach((item, index) => {
        if (index === pos) {
          item.checked = !item.checked;
          this.chooseDriver = item.checked ? item : null;
        } else {
          item.checked = false;
        }
      });
    },
    /**
     * 可选择的审批人列表
     */
    getDrivers(choosedId) {
      let param = {
        logisticsProviderType: "3",
      };
      this.$network
        .getData(this.$url.OUER_LOGISTICES_DRIVER_LIST, "GET", param)
        .then((result) => {
          this.allList = result
            ? result.map((o) => {
                return {
                  ...o,
                  checked: o.id === choosedId,
                };
              })
            : [];
          this.list = [...this.allList];
          this.chooseDriver = this.list.find((driver) => driver.id === choosedId) || null;
        });
    },
    getCheckedList() {
      this.chooseDriver = [
        ...this.list.filter((o) => {
          return o.checked;
        }),
      ];
    },
    confirm() {
      if (this.chooseDriver) {
        uni.$emit("choosedDriver", {
          data: this.chooseDriver,
          type: this.typestr,
        });
        uni.navigateBack({
          delta: 1,
        });
      } else {
        this.$refs.customToast.showModal({
          title: "异常",
          content: "请先选择一个物流联系人",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
  position: relative;
}

.search-container {
  flex-direction: row;
  justify-content: space-between;
  height: 48px;
  position: fixed;
  display: flex;
  width: 100%;
  top: 0px;
  align-items: center;
  background-color: #ffffff;
  left: 0;
  z-index: 100;
}

.search-box {
  background: #f7f7f7;
  height: 32px;
  flex: 1;
  line-height: 32px;
  display: flex;
  margin-left: 16px;
  margin-right: 16px;
  flex-direction: row;
  padding-left: 16px;
  border-radius: 4px;
}

.search-icon {
  color: #999999;
  font-size: 14px;
}

.search-content {
  color: #999999;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  flex: 1;
}

input {
  width: 95%;
}

.item-assigner-list {
  margin-top: 8px;
  margin-bottom: 56px;
}

.l-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 45px;
  background-color: #ffffff;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  align-items: center;
}

.item-name {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-left: 16px;
}

.checkbox {
  transform: scale(0.7);
  margin-right: 10px;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 48px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
  box-shadow: 1px 0px 1px $uni-text-color-gray;
}

.choosed-view {
  margin-left: 16px;
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.choosed-view span {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  margin-left: 4px;
}

.confirm-view {
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  padding: 5px 10px;
  border-radius: 4px;
}

//添加按钮
.add-container {
  position: fixed;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 100px;
  right: 44rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
  box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.2);
  color: $uni-text-color-inverse;
  background-color: #f08200;

  .iconfont {
    font-size: 48rpx;
  }
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
}
</style>
