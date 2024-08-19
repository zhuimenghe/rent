<template>
  <card :title="title" class="card-padding">
    <view slot="header-right">
      <!--
         <my-check-box
        :inverseColor="true"
        :checked="isExpanded"
        class="checkbox"
        @clickBox="changeCheckBox()"
        color="#E60000"
      >
        <span class="header-right-font">展开设备</span>
      </my-check-box>
       -->
    </view>
    <view class="list-content" v-if="list.length > 0">
      <!-- :showMachineDetails="isExpanded" -->
      <sublet-item class="list-item" v-for="(subletItem, subletIndex) in list" :key="'_subletItem' + subletItem.id" :subletItem="subletItem"
        @openRentDialog="openRentDialog"></sublet-item>
      <view class="total">
        租金及运费履约应付：
        <text class="number">
          ￥{{ moneyUtil.dealNumber(total) || 0 }}
        </text>
      </view>
    </view>
    <EmptyData v-if="list.length == 0"></EmptyData>
    <uni-popup ref="rentDialog" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="tip-title">还租</view>
        <view class="row-item">
          <view class="row-tag">
            转租单号
            <span style="color: #ff0000">*</span>
          </view>
          <view class="input-style">
            <text class="input-style-text">{{ dialogData.businessNo }}</text>
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
          <view class="row-tag">转租日期</view>
          <span style="color: #FFFFFF">*</span>
          <view class="input-style">
            <text class="input-style-text">{{ getDate(dialogData.actualSubletDate) }} </text>
          </view>
        </view>
        <view class="row-item">
          <view class="row-tag">
            还租日期
            <span style="color: #ff0000">*</span>
          </view>
          <view class="input-style" @click="showTimePick">
            <text class="input-style-text">
              {{ getDate(dialogData.rentBackDate) }}
            </text>
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
  </card>
</template>

<script>
import Card from "@/components/common/sany/card.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";
import MyCheckBox from "@/components/common/check-box/check-box.vue";
import SubletItem from "./components/item.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
export default {
  name: "sublet-list",
  props: {
    list: {
      type: Array,
    },
    title: {
      type: String,
    },
    total: {
      type: String,
    }
  },
  data() {
    return {
      isExpanded: true,
      dialogData: {},
    };
  },
  computed: {},
  components: {
    Card,
    EmptyData,
    MyCheckBox,
    SubletItem,
    uniPopup,
    wPicker,
  },
  methods: {
    getDate(time) {
      if (!time) return "--";
      return time.split(/\s+/)[0];
    },
    //还租
    openRentDialog(item) {
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
      this.currentPickerIndex = itemIndex; // 存储当前的 item 索引
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    onConfirm(val) {
      // 将字符串日期转换为日期对象
      const selectedDate = new Date(val.result.replace(/-/g, '/'));
      const actualSubletDate = new Date(this.dialogData.actualSubletDate.replace(/-/g, '/'));

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
      }

      // 重置 currentPickerIndex
      this.currentPickerIndex = null;
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
                this.dialogData.actualSubletDate
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
              this.dialogData.businessNo
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
    headerrefresh() {
      this.$emit("headerrefresh");
    },
    changeCheckBox() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-padding {
  // display: flex;
  padding: 8px;
  padding-top: 0;
  display: block;
}

.header-right-font {
  margin-left: 10rpx;
  // font-weight: bold;
  font-size: 28rpx;
  color: $uni-color-primary;
}

.list-item:not(:first-child) {
  border-top: 1rpx solid $uni-line-color;
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

.total {
  // display: flex;
  // flex-direction: row;
  // justify-content: end;
  text-align: right;
  color: $uni-text-color-gray;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  padding-right: 20rpx;

  .number {
    color: $uni-color-primary;
  }
}
</style>
