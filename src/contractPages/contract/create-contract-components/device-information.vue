<template>
  <view>
    <p class="title">
      <view class="title"> <span class="line"></span>预租设备</view>
      <view class="add-style" @click="addItem">
        <text>选择设备</text>
      </view>
    </p>
    <view class="device-infomation-bg">
      <!-- <view
        style="
          padding: 0px 8px;
          background-color: #ffffff;
          border-bottom: 1px solid #efefef;
        "
        v-if="contractType == '2' && dataDic.orderList.length > 0"
      >
        <selectLabelItem
          tagName="租赁方式"
          :isShowTip="true"
          tipName="rent"
          :value="dataDic.allRentType"
          @clickItemLabel="clickItem('allRentType')"
        />
      </view> -->

      <!--v-if="dataDic[listKey].length != 0"  -->
      <view v-if="dataDic[listKey].length != 0">
        <view
          v-if="dataDic[listKey].length != 0"
          class="item-cell"
          v-for="(item, index) in dataDic[listKey]"
          :key="index"
        >
          <view class="item-cell-line-bg">
            <view class="item-cell-line" v-if="contractType == '3'">
              <text class="text-tag-first">{{ item.printCode || "--" }}</text>
              <text class="text-tag-seced">{{ item.typeName || "" }}</text>
              <text class="text-tag-line">|</text>
              <text class="text-tag-seced">{{ item.heightName || "" }}</text>
            </view>
            <view class="row-line-between" v-if="contractType != '3'">
              <view class="row-line" style="align-items: flex-start">
                <text class="text-tag-first" style="white-space: nowrap"
                  >{{ item.typeName || "--" }}/{{ item.heightName || "" }}</text
                >
                <text class="text-tag-seceds">({{ item.orderNum }}台)</text>
              </view>
            </view>
            <view class="item-cell-line">
              <view class="item-cell-line">
                <view class="tag-view tag2" v-if="item.settlementType == '1'">
                  ¥{{ item.hire || "0.00" }}/天</view
                >
                <view class="tag-view tag2" v-if="item.settlementType == '2'||item.settlementType == '3'">
                  ¥{{ item.hire || "0.00" }}/月</view
                >
                <view
                  class="tag-view tag2"
                  v-if="
                    item.settlementType == '4' || item.settlementType == '6'
                  "
                >
                  ¥{{ item.hire || "0.00" }}/天&nbsp;&nbsp;{{
                    item.hireMonthly || "0.00"
                  }}/月</view
                >
                <view class="tag-view tag1" v-if="dataDic.tripCalType != '1'"
                  >运：¥{{ item.carriage || "0.00" }}</view
                ></view
              >

              <view class="item-cell-line-right">
                <i
                  class="iconfont edit-icon iconzl--bianji"
                  @click="goTo('edit', index, item)"
                ></i>
                <i
                  class="iconfont delete-icon iconzl--shanchu"
                  @click="goTo('delete', index, item)"
                ></i>
              </view>
            </view>
          </view> </view
      ></view>

      <view class="empty" v-else>
        <image class="img" src="/static/empty.png"></image>
        <text class="text">暂无设备</text>
      </view>
    </view>
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
    selectLabelItem,
  },
  props: {
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    //是否是快捷合同
    contractType: {
      type: String,
      default: "1",
    },
    listKey: {
      type: String,
      default: "orderList",
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.dataDic, "dataDic");
  },
  methods: {
    getType(item) {
      if (item.settlementType == "1") {
        return "天";
      } else if (item.settlementType =="5") {
        return "周";
      } else {
        return "月";
      }
    },
    showPick(type) {
      this.$emit("clickItem", type);
    },
    textChage(e, type) {
      let param = {
        type: type,
        data: e,
      };
      this.$emit("textChange", param);
    },
    addItem() {
      // if (this.contractType == "3") {
      //   uni.navigateTo({
      //     url:
      //       "/contractPages/contract/contract-choose-device/contract-choose-device?machineList=" +
      //       encodeURIComponent(JSON.stringify(this.dataDic[this.listKey])),
      //   });
      // } else {
      //   uni.navigateTo({
      //     url: `/contractPages/contract/choose-vehicle?types=${encodeURIComponent(
      //       JSON.stringify(this.dataDic.orderList)
      //     )}`,
      //   });
      // }

      uni.navigateTo({
        url: `/contractPages/contract/choose-vehicle?types=${encodeURIComponent(
          JSON.stringify(this.dataDic.orderList)
        )}&tripCalType=${JSON.stringify(this.dataDic.tripCalType || "0")}`,
      });
    },
    clickItem(type) {
      this.$emit("clickItem", type);
    },
    goTo(type, index, item) {
      item.checked = true;
      if (type == "delete") {
        this.$emit("deleteItem", index);
      } else {
        console.log(item,'----------------------------------');
        uni.navigateTo({
          url: `/contractPages/contract/choose-vehicle?tab=2&edit=true&item=${JSON.stringify(
            item
          )}&tripCalType=${JSON.stringify(this.dataDic.tripCalType || "0")}`,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.device-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #ffffff;
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}

.title-left {
  flex: 1;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}

.title-right {
  font-size: $uni-font-size-base;
  font-weight: normal;
  color: #999999;
}

.item-cell {
  display: flex;
  flex-direction: row;
  padding: 10px 5px;
  margin-left: 5px;
  margin-right: 5px;
  border: $uni-line-color 1px solid;
  border-radius: 5px;
  margin-bottom: 5px;
}

.item-cell-line-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.item-cell-line {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.item-cell-line-right {
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.text-tag-first {
  font-size: 14px;
  color: $uni-text-color;
  margin-right: 10px;
}

.text-tag-seced {
  font-size: 12px;
  color: $uni-text-color-gray;
}

.text-tag-line {
  font-size: 12px;
  color: $uni-text-color-gray;
  margin-left: 5px;
  margin-right: 5px;
}

.tag-view {
  display: flex;
  line-height: 18px;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: 3px;
}

.tag1 {
  background: #fff6e7;
  color: #fab045;
}

.tag2 {
  background: #fff1f0;
  color: #e60000;
}

.add-style {
  height: 80%;
  display: flex;
  background-color: $uni-color-primary;
  color: #fff;
  font-size: 14px;
  border: $uni-color-primary 1px solid;
  padding: 4px 10px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.delete-icon {
  font-size: 17px;
  color: #ff0000;
  margin-left: 10px;
}

.edit-icon {
  color: #e60000;
  font-size: 16px;
  margin-left: 8px;
}
.empty {
  @include flex(column, center, center);
  padding: 20rpx;
  .img {
    width: 77rpx;
    height: 80rpx;
  }
  .text {
    margin-top: 9rpx;
    color: $uni-text-color-gray;
  }
}
.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.line {
  display: block;
  width: 2px;
  height: 16px;
  background-color: #e60000;
  margin-right: 10px;
}
</style>
