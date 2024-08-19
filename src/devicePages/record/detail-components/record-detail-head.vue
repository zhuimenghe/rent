<template>
  <view class="car-message-view">
    <view class="r-head-view">
      <image
        class="icon-car"
        :src="dataDic.fileList[0].url"
        v-if="dataDic.fileList && dataDic.fileList.length > 0"
      />
      <view class="icon-car" v-else>
        <i
          class="iconfont icon-view"
          :class="
            deviceIcon[dataDic.machineTypeId]
              ? deviceIcon[dataDic.machineTypeId]
              : 'iconzl--jianchache1'
          "
        ></i>
      </view>
      <view class="icon-car-right">
        <!-- idDataDicNull -->
        <view
          class="icon-car-right-top"
          style="color: #e60000"
          v-if="idDataDicNull"
        >
          该设备已退租或已删除
        </view>

        <view class="icon-car-right-top" v-else>
          <text style="font-size: 16px; font-weight: bold">
            {{ dataDic.printCode || "" }}
          </text>
          <text class="licenseIdStyle">{{ dataDic.licenseId || "--" }}</text>
        </view>
        <view class="icon-car-right-med" style="color: #8c8c8c">
          <text>{{ dataDic.machineTypeDesc || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineHeightDesc || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineBrand || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.machineTypeName || "--" }}</text>
          <text style="margin-left: 3px; margin-right: 3px">|</text>
          <text>{{ dataDic.driveTypeName || "--" }}</text>
        </view>
        <view class="icon-car-right-med">
          <view class="icon-car-right-state-rent" v-if="dataDic.state == '1'">
            <text>{{ dataDic.stateName || "--" }}</text>
            <text style="margin-left: 5px; margin-right: 5px">|</text>
            <text>{{ dataDic.subStateName || "--" }}</text>
          </view>
          <view class="icon-car-right-state-wait" v-else>
            <text>{{ dataDic.stateName || "--" }}</text>
            <text style="margin-left: 5px; margin-right: 5px">|</text>
            <text>{{ dataDic.subStateName || "--" }}</text>
          </view>
        </view>
      </view>
      <view class="icon-car-right-state">
        <qrcodeImg
          :url="qrcodeUrl"
          :downloadUrl="downloadQrcodeUrl"
          v-if="isShowQrCode"
          color="#F08200"
        />
      </view>
    </view>
    <view :class="isEx ? 'bottom-btns-list' : 'bottom-btns-list-last'">
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">区域:</view>
          <view class="cell-line-value">{{ dataDic.orgName }}</view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">生产日期:</view>
          <view class="cell-line-value">{{
            changestr(dataDic.productDate)
          }}</view>
        </view>
      </view>
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">采购日期:</view>
          <view class="cell-line-value">{{
            changestr(dataDic.purchaseTime)
          }}</view>
        </view>
        <view class="cell-line-row" @click="editPrice">
          <view class="cell-line-tag">采购价格:</view>
          <view class="cell-line-value"
            >￥{{ moneyUtil.dealNumber(dataDic.machineMillPrice) }}</view
          >
          <i class="iconfont icon-add iconzl--bianji" v-if="isShowUPDATA"></i>
        </view>
      </view>
    </view>
    <view class="bottom-btns-list" v-if="isEx">
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">保修期限:</view>
          <view class="cell-line-value">
            {{
              dataDic.warrantyInfoDto &&
              dataDic.warrantyInfoDto.warrantyPeriodName
                ? dataDic.warrantyInfoDto.warrantyPeriodName
                : "--"
            }}({{ dataDic.purchaseStateName || "-" }})
          </view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">保修状态:</view>
          <view class="cell-line-value">{{
            dataDic.purchaseStateName || "--"
          }}</view>
        </view>
      </view>
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">发动机序列号:</view>
          <view class="cell-line-value">
            {{
              dataDic.machineExpandInfoDto &&
              dataDic.machineExpandInfoDto.engineNumber
                ? dataDic.machineExpandInfoDto.engineNumber
                : "--"
            }}
          </view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">环保码:</view>
          <view class="cell-line-value">
            {{
              dataDic.machineExpandInfoDto &&
              dataDic.machineExpandInfoDto.environmentalCode
                ? dataDic.machineExpandInfoDto.environmentalCode
                : "--"
            }}
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-btns-list" v-if="isEx">
      <view class="cell-bg-row">
        <view class="cell-line-row" @click="gotoDetial()">
          <view class="cell-line-tag">保险单号:</view>
          <view class="cell-line-value" style="color: #e60000">
            {{ dataDic.insuranceNo || "--" }}
          </view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">开始日期:</view>
          <view class="cell-line-value">{{
            dateSlice(dataDic.insuranceStartDate) || "--"
          }}</view>
        </view>
      </view>
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">结束日期:</view>
          <view class="cell-line-value">
            {{ dateSlice(dataDic.insuranceEndDate) || "--" }}
          </view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">剩余在保天数:</view>
          <view class="cell-line-value"
            >{{ dataDic.remainingTime || "--" }}天</view
          >
        </view>
      </view>
    </view>
    <view class="bottom-btns-list" v-if="dataDic.deviceNum && isEx">
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">GPS编码:</view>
          <view class="cell-line-value">{{ dataDic.deviceNum || "--" }}</view>
        </view>
        <view class="cell-line-row">
          <view class="cell-line-tag">GPS安装类型:</view>
          <view class="cell-line-value">{{
            dataDic.gpsInstallTypeDesc || "--"
          }}</view>
        </view>
      </view>
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">总工作时长:</view>
          <view class="cell-line-value">{{
            $datestr.getDateStr(dataDic.workDuration)
          }}</view>
        </view>
      </view>
    </view>
    <view class="bottom-btns-list" v-if="dataDic.deviceNum && isEx">
      <view class="cell-bg-row">
        <view class="cell-line-row" @click="gotoAddress">
          <view class="cell-line-tag">当前位置:</view>
          <view class="cell-line-value" style="color: #e60000; flex: 1">{{
            dataDic.address || "--"
          }}</view>
          <i class="iconfont icon-add iconzl--zuobiao"></i>
        </view>
      </view>
      <view class="cell-bg-row">
        <view class="cell-line-row">
          <view class="cell-line-tag">更新时间:</view>
          <view class="cell-line-value">{{
            dataDic.lastDataUploadTime || "--"
          }}</view>
        </view>
      </view>
    </view>

    <view class="export-arrow-view" @click="exportArrow">
      <text v-if="!isEx">展开</text>
      <i class="iconfont icon-ex iconarrow-down" v-if="!isEx"></i>
      <text v-if="isEx">收起</text>
      <i class="iconfont icon-ex iconarrow-up" v-if="isEx"></i>
    </view>
    <view class="pop-container">
      <uni-popup ref="startDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">修改采购价格</view>
          <view class="row-item">
            <view class="row-tag"><text>采购价格</text></view>
            <view class="left-style"><text>￥</text></view>
            <view class="input-style" style="margin-left: 5px">
              <input
                class="text-style"
                type="text"
                placeholder="请输入初始价格"
                v-model="salePrice"
              />
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="cancelDialog"
              >取消</text
            >
            <text class="uni-tip-button pop-confirm" @click="confirmDialog"
              >确定</text
            >
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script>
import badgeview from "@/components/common/image-upload/badge-icon.vue";
import qrcodeImg from "./record-qrcode-img.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
export default {
  components: {
    badgeview,
    qrcodeImg,
    uniPopup,
  },
  props: {
    idDataDicNull: {
      type: Boolean,
      default: false,
    },
    isShowQrCode: {
      type: Boolean,
      default: true,
    },
    isShowUPDATA: {
      type: Boolean,
      default: true,
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    qrcodeUrl: {
      type: String,
      default: "",
    },
    downloadQrcodeUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      deviceIcon: {
        3: "iconzl--zhibiche",
        4: "iconzl--jianchache1",
        2: "iconzl--jianchache",
        1: "iconzl--jianchache1",
      },
      isEx: false,
      salePrice: "",
    };
  },
  watch: {
    salePrice(val) {
      this.salePrice = val;
      setTimeout(() => {
        this.salePrice = this.$gxfmethod.getMoneyPart(val);
      }, 10);
    },
  },
  methods: {
    gotoAddress() {
      uni.openLocation({
        latitude: parseFloat(this.dataDic.amaplatitudeNum),
        longitude: parseFloat(this.dataDic.amaplongitudeNum),
        name: this.dataDic.address,
        address: this.dataDic.address,
      });
    },
    goImg() {
      this.$emit("goToImage", "");
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
    exportArrow() {
      this.isEx = !this.isEx;
    },
    editPrice() {
      if (!this.isShowUPDATA) {
        return;
      }
      this.salePrice = this.dataDic.machineMillPrice || "";
      this.$emit("canScroll", "0");
      this.$refs.startDialog.open();
    },
    cancelDialog() {
      this.$refs.startDialog.close();
      this.$emit("canScroll", "1");
    },
    gotoDetial() {
      if (!this.dataDic.insuranceNo) return;
      uni.navigateTo({
        url:
          "/devicePages/insurance/insurance-detail?businessNo=" +
          this.dataDic.insuranceNo,
      });
    },
    confirmDialog() {
      if (this.salePrice === "") {
        uni.showToast({
          icon: "none",
          title: "请输入车辆初始价格",
        });
        return;
      }
      //
      uni.showLoading();
      let urlstr = this.$url.MACHINE_UPDATA_PRICE;
      let param = {
        id: this.dataDic.id,
        machineMillPrice: this.salePrice.toString(),
      };
      this.$network
        .getData(urlstr, "PUT", param)
        .then((result) => {
          setTimeout(() => {
            this.dataDic = {
              ...this.dataDic,
              machineMillPrice: this.salePrice.toString(),
            };
            this.$refs.startDialog.close();
            this.$emit("canScroll", "1");
            uni.hideLoading();
          }, 100);
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message,
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.car-message-view {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  width: 100%;
  z-index: 200;
}
.r-head-view {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  margin: 0px 8px;
  padding: 12px 8px;
  border-radius: 12px;
  color: #8c8c8c;
  border-bottom: 1px dotted #e6e6e6;
}
.icon-car {
  display: flex;
  width: 45px;
  height: 45px;
  padding: 3px;
  border-radius: 8px;
  border: 1px $uni-line-color solid;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.icon-car-right {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.icon-car-right-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}
.licenseIdStyle {
  margin-left: 10px;
  color: #e60000;
  background: #fff1f0;
  border-radius: 10px;
  padding: 0px 10px;
  font-size: 24upx;
}
.icon-car-right-med {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 11px;
  margin-left: 10px;
  padding: 3px 0px;
}
.icon-car-right-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-left: 10px;
}
.icon-right {
  font-size: 20px;
  color: #999999;
  font-weight: bold;
}
.icon-car-right-state {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-left: 10px;
}
.bottom-btns-list {
  display: flex;
  flex-direction: column;
  margin: 12px 0px 0px 0px;
  padding-bottom: 12px;
  border-bottom: $uni-line-color 1px solid;
}
.bottom-btns-list-last {
  display: flex;
  flex-direction: column;
  margin: 12px 0px 0px 0px;
}
.cell-bg-row {
  display: flex;
  flex: 1;
  padding: 4px 8px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.cell-line-row {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cell-line-value {
  font-size: $uni-font-size-base;
  color: #333333;
}

.cell-line-tag {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
  margin-right: 5px;
  min-width: 60px;
}
.icon-car-right-state-rent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 10px;
  background: #1890ff;
  border-radius: 5px;
}
.icon-car-right-state-wait {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 10px;
  background: #f0ad4e;
  border-radius: 5px;
}
.export-arrow-view {
  display: flex;
  flex-direction: row;
  margin: 12px 17px;
  background: #f0f2f4;
  border-radius: 4px;
  padding: 10px 0px;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: $uni-font-size-base;
  color: #555555;
}
.icon-ex {
  margin-left: 5px;
}
.icon-add {
  margin-left: 5px;
  color: $uni-color-primary;
  font-size: 15px;
}
//tip
.pop-container {
  position: relative;
}
.uni-tip {
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 80vx;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 5px;
  border-bottom: $uni-line-color 1px solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}
.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  border-bottom: $uni-line-color 1px solid;
}

.row-tag {
  width: 98px;
  text-align: left;
}

.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-top: 10px;
  padding-bottom: 10px;
  flex: 1;
}

.text-style {
  flex: 1;
  text-align: left;
  font-size: $uni-font-size-base;
}

.left-style {
  display: flex;
  margin-left: 10px;
}
.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 5px;
  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 5px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}
.pop-confirm {
  color: #ffffff;
  margin-left: 5px;
  background: $uni-color-primary;
  border-radius: 4px;
}
</style>
