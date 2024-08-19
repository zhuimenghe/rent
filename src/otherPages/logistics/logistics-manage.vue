<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap"
      >我方物流</c-nav-bar-btns
    >
    <view class="top-container">
      <sun-tab
        :value.sync="index"
        :tabList="tabList"
        :isFlex="false"
        activeColor="#E60000"
        :shownum="false"
        @change="indexchange"
      ></sun-tab>
    </view>

    <tabVehicle
      v-if="index == 0"
      ref="vehicle"
      :isPermissionEdit="isPermissionVehicleEdit"
      :isPermissionDelete="isPermissionVehicleDelete"
    ></tabVehicle>
    <tabMotorman
      v-if="index == 1"
      ref="motorman"
      :isPermissionEdit="isPermissionDriverEdit"
      :isPermissionDelete="isPermissionDriverDelete"
    ></tabMotorman>
  </view>
</template>
<script>
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import sunTab from "@/components/common/sun-tab/sun-tab.vue";
import tabVehicle from "./tab-logistics-vehicle.vue";
import tabMotorman from "./tab-logistics-motorman.vue";
export default {
  components: {
    selectView,
    wPicker,
    sunTab,
    tabVehicle,
    tabMotorman,
  },
  data() {
    return {
      buttons: [
        {
          text: "新建",
          type: "none",
          fontSize: "14px",
          color: "#E60000",
        },
      ],
      index: 0,
      tabList: ["物流车辆", "物流司机"],
      isPermissionDriverAdd: true,
      isPermissionDriverEdit: true,
      isPermissionDriverDelete: true,
      isPermissionVehicleAdd: true,
      isPermissionVehicleEdit: true,
      isPermissionVehicleDelete: true,
    };
  },
  onLoad(options) {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isPermissionDriverAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_DRIVER_ADD
        );
        this.isPermissionDriverEdit = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_DRIVER_EDIT
        );
        this.isPermissionDriverDelete = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_DRIVER_DELETE
        );
        this.isPermissionVehicleAdd = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_ADD
        );
        this.isPermissionVehicleEdit = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_EDIT
        );
        this.isPermissionVehicleDelete = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_DELETE
        );
      },
    });
    setTimeout(() => {
      this.headerrefreshInfo();
    }, 100);
  },
  onPullDownRefresh() {
    this.headerrefreshInfo();
  },
  onReachBottom() {
    this.footerrefresh();
  },
  methods: {
    onNavBarButtonTap() {
      this.showPop();
    },
    indexchange(e) {
      setTimeout(() => {
        this.hidePop();
        this.index = e.index;
        this.headerrefreshInfo();
      }, 10);
    },
    showPop() {
      switch (this.index) {
        case 0:
          if (this.isPermissionVehicleAdd) {
            this.$refs.vehicle.createPop();
          } else {
            uni.showToast({
              icon: "none",
              title: "暂无新建车辆权限",
            });
          }

          break;
        case 1:
          if (this.isPermissionDriverAdd) {
            this.$refs.motorman.createPop();
          } else {
            uni.showToast({
              icon: "none",
              title: "暂无新建司机权限",
            });
          }

          break;
        default:
          break;
      }
    },
    hidePop() {
      if (this.index == 0) {
        this.$refs.vehicle.hidePop();
      } else {
        this.$refs.motorman.hidePop();
      }
    },
    headerrefreshInfo() {
      switch (this.index) {
        case 0:
          this.$refs.vehicle.headerrefresh();
          break;
        case 1:
          this.$refs.motorman.headerrefresh();
          break;
        default:
          break;
      }
    },
    footerrefresh() {
      switch (this.index) {
        case 0:
          this.$refs.vehicle.footerrefresh();
          break;
        case 1:
          this.$refs.motorman.footerrefresh();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
  @include flex(column);
}

.top-container {
  // position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 800;
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
}

.search-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 55;
  color: $uni-color-title;
  margin: 5px;
  font-size: $uni-font-size-sm;
  text-align: center;
}

.select-view {
  flex: 1;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 8px 0px 8px;
  flex-direction: row;
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.select-container {
  display: flex;
  width: 40%;
  flex-direction: column;
  position: relative;
}

.select-label {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.select-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 28px;
  left: 0px;
  width: 150%;
  font-size: $uni-font-size-base;
  text-align: center;
  background-color: $uni-bg-color-grey;
  border-radius: 0px 0px 4px 4px;
}

.select-item {
  height: 35px;
  width: 100%;
  background-color: #ffffff;
  text-align: left;
  line-height: 35px;
  margin-top: 1rpx;
  padding-left: 15px;
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

.export-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 30px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid $uni-color-primary;
  margin-left: 5px;
  margin-right: 5px;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
}

.btn-confirm {
  padding: 6px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  border-radius: 4px;
  margin: 0px 4px;
  flex: 1;
}

.btn-reset {
  padding: 6px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  background-color: $uni-bg-color-grey;
  border-radius: 4px;
  margin: 0px 4px;
}

.list-item {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 8px;
  margin: 0px 8px 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: $uni-font-size-base;
}

.float-l-r {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-tag {
  color: $uni-text-color-gray;
  margin: 4px 0px;
  width: 72px;
  min-width: 72px;
  font-size: $uni-font-size-base;
}

.item-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.c-title {
  color: $uni-text-color;
  width: 65%;
  margin-bottom: 8px;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  /*要显示的行数*/
  -webkit-box-orient: vertical;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title-tag {
  color: $uni-color-primary;
}

.state-view {
  font-size: $uni-font-size-base;
  color: $uni-text-color-disable;
}

.types-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: $uni-font-size-xs;
  padding-bottom: 8px;
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

.pay-appoint-view {
  color: #6280ed;
  border-color: #6280ed;
}

.operate-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
}

.contract-detail-btn {
  margin-top: 5px;
  margin-right: 15px;
}

.pop-container {
  position: relative;
  z-index: 999;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
}

.pop-item {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-disable {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-line {
  border-style: solid;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
}
</style>
