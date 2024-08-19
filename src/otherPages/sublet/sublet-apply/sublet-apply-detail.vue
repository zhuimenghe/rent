<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-apply :business-key="subletDic.businessKey">转租详情</c-nav-bar-apply>
    <view class="content-container">
      <p class="title"><span class="line"></span>基本信息</p>
      <view class="sum-view-bg" style="margin-bottom: 5px">
        <select-label-item tagName="单号" :isSelect="false" :value="subletDic.businessNo" />
        <select-label-item tagName="转租申请人" :isSelect="false" :value="subletDic.userName" />
        <select-label-item tagName="申请区域" :isSelect="false" :value="subletDic.orgName" />
        <select-label-item tagName="转租公司" :isSelect="false" :value="subletDic.subletCompanyName" />
        <select-label-item tagName="公司联系人" :isSelect="false" :value="subletDic.contactName" />
        <select-label-item tagName="电话" :isPhone="true" :isSelect="false" :value="subletDic.phone" />
        <select-label-item tagName="启用时间" :isSelect="false" :value="getDate(subletDic.subletDate)" />
        <select-label-item tagName="运输方式" :isSelect="false" :value="subletDic.transportTypeName" />
        <select-label-item tagName="运费" :isSelect="false" :value="subletDic.freight" />
        <select-label-item tagName="接机人" :isSelect="false" :value="subletDic.customerName" />
        <select-label-item tagName="月份计算方式" :isSelect="false" :value="subletDic.monthType === '1' ? '30天为一个月' : '自然月'" />
      </view>
      <p class="title">
        <span class="line"></span>
        <text style="flex: 1">转租设备</text>
      </p>
      <view class="sum-view-bg machine-list">
        <view v-for="(machine, machineIndex) in machineList" :key="machineIndex">
          <view class="machine-item">
            <view class="machine-header">
              <view>
                <view class="machine-code">
                  <view class="print-code">{{ machine.printCode || "-" }}</view>
                  <view class="license-id">{{ machine.licenseId || "-" }}</view>
                </view>
                <view>
                  <view class="machine-info">
                    <view> {{ machine.brand || "-" }}</view>
                    <view> {{ machine.typeName || "-" }}</view>
                    <view> {{ machine.heightName || "-" }}</view>
                    <view> {{ machine.machineTypeName || "-" }}</view>
                  </view>
                </view>
              </view>
              <!-- @click="rent('pay', item)" -->
              <view class="machine-btns">
                <view class="machine-btn" @click="showDialog(machine)" v-if="!machine.rentBackDate && subletDic.state == '4'">还租</view>
              </view>
            </view>
            <view class="machine-detail">
              <view class="machine-detail-item" style="flex: 1 1 100%">
                租赁单价：
                <text v-if="machine.price != 0 || machine.price != '0'">
                  {{ moneyUtil.dealNumber(machine.price) }}/天
                </text>
                <text v-if="machine.hireMonthly != 0 || machine.hireMonthly != '0'">
                  {{ moneyUtil.dealNumber(machine.hireMonthly) }}/月
                </text>
              </view>
              <view class="machine-detail-item">
                启用日期：{{ formatDateSToC(machine.subletDate) }}
              </view>
              <view class="machine-detail-item">
                还租日期：
                <text :class="{ 'rent-back-date': !machine.rentBackDate }">
                  {{ formatDateSToC(machine.rentBackDate, "rentBack") }}</text>
              </view>
              <view class="machine-detail-item">
                累计租期：{{ machine.rentDays || "-" }}
              </view>
              <view class="machine-detail-item">
                履约成本：{{ moneyUtil.dealNumber(machine.allTotal) || "-" }}
              </view>
              <view class="machine-detail-item"> 报停天数：{{ machine.pauseDays || "-" }} </view>
              <view class="machine-detail-item">
                报停金额：{{ moneyUtil.dealNumber(machine.pauseHireTotal) || "-" }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <p class="title">
        <span class="line"></span>
        <text style="flex: 1">其他</text>
      </p>
      <view class="sum-view-bg" v-if="(subletDic.fileList && subletDic.fileList.length > 0) || subletDic.remark">
        <imgupload :isupload="false" :imgFinishlist="subletDic.fileList" v-if="subletDic.fileList && subletDic.fileList.length > 0" />
        <text-label-item class="text-label" tagName="备注" :inputDisabled="true" :inputValue="subletDic.remark" v-if="subletDic.remark" />
      </view>
      <view class="sum-view-bg" v-else>
        <EmptyData empty-text="暂无数据"></EmptyData>
      </view>
    </view>
    <uni-popup ref="rentDialog" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="tip-title">还租</view>
        <view class="row-item">
          <view class="row-tag">
            转租单号
            <span style="color: #ff0000">*</span>
          </view>
          <view class="input-style">
            <text class="input-style-text">{{ dialogData.businessKey }} </text>
          </view>
        </view>
        <view class="row-item">
          <view class="row-tag">
            设备编号
            <span style="color: #ff0000">*</span>
          </view>
          <view class="input-style">
            <text class="input-style-text">{{ dialogData.licenseId }}</text>
          </view>
        </view>
        <view class="row-item">
          <view class="row-tag">
            转租日期
            <span style="color: #FFFFFF">*</span>
          </view>
          <view class="input-style">
            <text class="input-style-text"> {{ getDate(dialogData.subletDate) }}</text>
          </view>
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
    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    EmptyData,
    uniPopup,
    wPicker,
  },
  data() {
    return {
      businessNo: "",
      subletDic: {},
      dialogData: {},
      machineList: [],
      isShowUpdate: false,
    };
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  onLoad(option) {
    this.businessNo = option.businessNo;
    uni.showLoading();
    this.getDetail();
    this.getMachineList();
  },
  methods: {
    async headerrefresh() {
      await this.getDetail();
      await this.getMachineList();
      uni.stopPullDownRefresh();
    },
    getDate(time) {
      if (!time) return "-";
      return time.split(/\s+/)[0];
    },
    async getDetail() {
      let param = {
        businessNo: this.businessNo,
      };
      try {
        const result = await this.$network
          .getData(this.$url.SUBLET_APPLY_DETAIL, "GET", param)
        this.subletDic = { ...result };
        this.getProcessNode();
      } catch (err) {
        // 处理错误的逻辑
        console.error(err);
      } finally {
        uni.hideLoading();
      }
      // this.$network
      //   .getData(this.$url.SUBLET_APPLY_DETAIL, "GET", param)
      //   .then((result) => {
      //     this.subletDic = {
      //       ...result,
      //     };
      //     this.getProcessNode();
      //     uni.hideLoading();
      //   })
      //   .catch((err) => {
      //     uni.hideLoading();
      //   });
    },
    async getMachineList() {
      let urlstr = this.$url.SUBLET_APPLY_MACHINE_LIST.replace(
        /{businessNo}/,
        this.businessNo
      );
      try {
        const result = await this.$network.getData(urlstr, "GET", null);
        this.machineList = [...result];

      } catch (err) {
        // 处理错误的逻辑
        console.error(err);
      } finally {
        uni.hideLoading();
      }
      // this.$network
      //   .getData(urlstr, "GET", null)
      //   .then((result) => {
      //     this.machineList = [...result];
      //     uni.stopPullDownRefresh();
      //     uni.hideLoading();
      //   })
      //   .catch((err) => {
      //     uni.hideLoading();
      //   });
    },
    getProcessNode() {
      this.workflowcommon.getOnlineList(this.subletDic.businessKey).then((result) => {
        if (result && result.length === 1) {
          //只有一条说明被驳回过，只显示上次申请的数据
          this.nodeList = result;
        } else {
          this.nodeList = result
            ? result.filter((o) => {
              return o.endTime && o.type === "completed";
            })
            : [];
        }
        this.isShowUpdate = this.isShowModel("update", this.nodeList, false);
      });
    },
    isShowModel(model, nodeList, isFrist) {
      let isShow = false; //是否显示model
      if (nodeList.length > 0) {
        //判断当前是是否是第一步
        if (isFrist) {
          //第一步是否显示model
          if (nodeList[0].formKey && nodeList[0].formKey.indexOf(model) !== -1) {
            isShow = true;
          }
        } else {
          //
          //遍历所有到目前为止的流程中是否显示model
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].formKey && nodeList[i].formKey.indexOf(model) !== -1) {
              isShow = true;
              return true;
            }
          }
        }
      } else {
        //没有流程时，都显示
        isShow = true;
      }

      return isShow;
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
      this.$refs.rentDialog.open();
    },
    showTimePick(itemIndex) {
      // this.dialogData = this.machineList[itemIndex]
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    onConfirm(val) {
      // 将字符串日期转换为日期对象
      const selectedDate = new Date(val.result.replace(/-/g, '/'));
      const actualSubletDate = new Date(this.dialogData.subletDate.replace(/-/g, '/'));

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
    },
    cancelDialog() {
      this.$refs.rentDialog.close();
    },
    confirmDialog() {
      // if (this.dialogData.state != 1) {
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
                this.$refs.rentDialog.close();
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
    formatDateSToC(val, type) {
      if (val) return this.$dateUtil.dateSFormat(val);
      else if (type === "rentBack")
        if (this.subletDic.state != '4') {
          return "-";
        }
        else {
          return "转租中";
        }
      else return "-";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_sublet-styles";

.content {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.content-container {}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  //   margin: 10px;
  background: #ffffff;
  //   border-radius: 4px;
  padding-bottom: 10px;

  &.machine-list {
    margin: 13rpx;
    border-radius: 8px;
    box-shadow: 0rpx 0rpx 24rpx 0rpx rgba(0, 0, 0, 0.16);
  }
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.choose-device-text {
  color: $uni-color-primary;
}

.item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 6px 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-title {
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  padding: 4px 0px;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 16px;
  font-size: $uni-font-size-base;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  color: #ff0000;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.item-tag {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
}

.tag-view {
  display: flex;
  height: 24px;
  line-height: 24px;
  padding: 0px 4px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: 3px;
}

.tag1 {
  background: #eef9e8;
  color: #57c32d;
}

.tag2 {
  background: #f9f0ff;
  color: #722ed1;
}

.tag3 {
  background: #fff0e9;
  color: #fb7135;
}

.tag4 {
  background: #fff1f0;
  color: #e60000;
}

.tag5 {
  background: $uni-color-primary;
  color: #ffffff;
}

.tag6 {
  background: #fff8ee;
  color: #fca01f;
}

.line-tag {
  min-width: 64px;
}

.row-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: $uni-font-size-base;
  min-height: 30px;
}

.text-label {
  ::v-deep .textarea {
    // background-color: #e6e6e6 !important;
    padding: 14px;
    width: calc(100%);
    margin-left: 0;
  }
}

.machine-list {
  .machine-item {
    /* 样式 */
  }

  .machine-item {
    .machine-header {
      display: flex;
      /* flex-direction: column; */
      justify-content: space-between;

      /* 其他样式 */
      .machine-code {
        display: flex;
        flex-direction: row;
        font-size: 32rpx;
        line-height: 40rpx;

        .license-id {
          margin-left: 16rpx;
          color: $uni-color-primary;
          background: #fff1f0;
          border-radius: 20rpx;
          padding: 0rpx 20rpx;
          font-size: 24rpx;
        }

        /* justify-content: space-between; */
      }
    }

    .machine-info {
      display: flex;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-text-color-gray;
      line-height: 60rpx;

      >view:not(:last-child) {
        &:after {
          content: "|";
          padding: 0 10rpx;
        }
      }

      /* 每行两个字段的样式 */
    }

    .machine-btns {
      .machine-btn {
        color: $uni-color-primary;
        font-size: 28rpx;
        line-height: 40rpx;
      }
    }

    .machine-detail {
      /* 详情的样式 */
      display: flex;
      flex-wrap: wrap;
      padding: 12rpx 8rpx 12rpx 8rpx;
      margin-bottom: 16rpx;
      background-color: $uni-bg-color-gray;
      border-radius: 8rpx;

      .machine-detail-item {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: $uni-text-color-gray;
        flex: 1 1 50%;
        /* flex-grow: 1, flex-shrink: 1, flex-basis: 50% */
        padding: 8rpx;
        box-sizing: border-box;

        /* 确保内边距不会影响总宽度 */
        .rent-back-date {
          color: $uni-color-success;
        }
      }
    }
  }
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
}
</style>
