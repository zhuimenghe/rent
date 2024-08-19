<template>
  <view class="device-infomation-bg">
    <view class="title-bg">
      <view class="title-left">{{ "设备需求" }}</view>
      <view class="title-right" v-if="contractType != '2'"
        >(总计:{{
          dataDic.totalMoney ? Number(dataDic.totalMoney).toFixed(2) : "0.00"
        }}元)</view
      >
    </view>
    <view
      style="
        padding: 4px;
        border-radius: 4px;
        border: 1px solid #f5f4f9;
        margin-top: 8px;
      "
      v-for="(item, index) in dataDic[listKey]"
      :key="index"
    >
      <businessItemFrame
        :isFrame="false"
        :stateName="
          contractType == '1' ? (item.orderNum ? item.orderNum + '台' : '') : ''
        "
        :showAttachment="false"
      >
        <block slot="title">
          <view class="row-line" v-if="contractType == '3'">
            {{ item.printCode || "-" }}
            <view style="margin-left: 6px; font-size: 12px; color: #999999">{{
              item.licenseId || ""
            }}</view>
          </view>
          <view class="row-line" v-if="contractType != '3'">
            {{ item.typeName || "-" }}/{{ item.heightName || "-" }}
          </view>
        </block>
        <block slot="subTitle">
          <view class="row-line" v-if="contractType == '3'">
            {{ item.typeName || "-" }}&nbsp;|&nbsp;{{
              item.heightName || "-"
            }}&nbsp;|&nbsp;{{ item.machineBrand || "-" }}&nbsp;|&nbsp;{{
              item.machineTypeName || "-"
            }}
          </view>
          <view class="row-line" v-if="contractType != '3'">
            {{ item.machineTypeName || "-" }}
          </view>
        </block>
        <block slot="subContent">
          <view class="row-line">
            <view class="tag-view tag2">{{
              item.settlementTypeName || ""
            }}</view>
            <view
              class="tag-view tag2"
              v-if="item.settlementType == '1' || item.settlementType == '2'||item.settlementType == '3'"
            >
              ¥{{ item.hire || "0.00" }}/{{ getType(item) }}</view
            >

            <view class="tag-view tag2" v-if="item.settlementType == '4'">
              ¥{{ item.hire || "0.00" }}/天&nbsp;&nbsp;{{
                item.hireMonthly || "0.00"
              }}/月</view
            >
            <view class="tag-view tag3">{{ item.carriageTypeName || "" }}</view>
            <view class="tag-view tag3"
              >运：¥{{ item.carriage || "0.00" }}/台</view
            >
          </view>
        </block>
        <block slot="content">
          <view>
            <view
              class="row-line-between"
              v-if="
                (isShowConfig && contractType == '1') || contractType == '3'
              "
            >
              <view
                class="row-line"
                style="text-align: center; line-height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 进： </view>
                {{ changestr(item.beginDate) }}
              </view>
              <view
                class="row-line"
                style="text-align: center; line-height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 退： </view>
                {{ changestr(item.endDate) }}
              </view>
              <view
                class="row-line"
                style="text-align: center; line-height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 租期： </view>
                {{ getTenancyFn(item) || "-" }}
              </view>
            </view>
            <view class="row-line">
              <view
                class="row-line"
                style="
                  flex: 1;
                  text-align: center;
                  line-height: 20px;
                  margin-right: 2px;
                "
              >
                <view class="row-line" style="color: #999999"> 押金： </view>
                ￥{{ item.pledge || "0.00" }}
              </view>
              <view
                v-if="contractType != '2'"
                class="row-line"
                style="
                  flex: 1;
                  text-align: center;
                  line-height: 20px;
                  margin-right: 2px;
                "
              >
                <view class="row-line" style="color: #999999"> 小计： </view>
                ￥{{ item.total ? Number(item.total).toFixed(2) : "0.00" }}
              </view>
            </view>
          </view>
        </block>
        <block slot="options">
          <view
            v-if="contractType == '1' && item.machineList.length > 0"
            @click.stop="goTo('assigned', item)"
            class="row-line"
            style="
              color: #e60000;
              text-align: center;
              height: 20px;
              margin-right: 2px;
              font-size: 12px;
              line-height: 20px;
            "
          >
            指定车辆<i class="iconfont iconarrow-right"></i>
          </view>
        </block>
      </businessItemFrame>
    </view>
  </view>
</template>
<script>
import {
  differenceInDays,
} from "date-fns";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectorInputMD from "@/components/common/selector-pick/selector-input-monthday.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
    selectorInputMD,
    businessItemFrame,
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
    contractType: {
      type: String,
      default: "3",
    },
    listKey: {
      type: String,
      default: "orderList",
    },
  },
  data() {
    return {
      isShowConfig: true,
    };
  },
  created() {
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowConfig = obj.value === "liangXu" ? false : true;
      }
    }
    console.log(this.dataDic, "---------");
  },
  methods: {
    getTenancyFn(row) {
      console.log(row,'row');
      if (!row.settlementType || !row.beginDate || !row.endDate) return "-";
      let day = differenceInDays(new Date(row.endDate), new Date(row.beginDate))+1;
      return day+'天';
    },
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
    getType(item) {
      if (item.settlementType === "1") {
        return "天";
      } else if (item.settlementType === "5") {
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
    goTo(type, item) {
      uni.navigateTo({
        url:
          "/contractPages/contract/assigned-vehicle?machineList=" +
          encodeURIComponent(JSON.stringify(item.machineList)),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.device-infomation-bg {
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0px 10px;
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
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
  margin-top: 10px;
  flex-direction: column;
  padding: 10px 5px;
  border: $uni-line-color 1px solid;
  border-radius: 5px;
}

.item-cell-line-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.item-cell-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-cell-line-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.text-tag-first {
  font-size: 16px;
  color: $uni-text-color;
  margin-right: 10px;
}

.text-tag-seced {
  font-size: 13px;
  color: $uni-text-color-gray;
}

.text-tag-line {
  font-size: 13px;
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

.tag3 {
  background: #fff6e7;
  color: #fab045;
}

.add-style {
  display: flex;
  flex: 1;
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  border: $uni-color-primary 1px solid;
  padding: 5px 0px;
  border-radius: 50px;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
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
</style>
