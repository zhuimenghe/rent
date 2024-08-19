<template>
  <view>
    <p class="title"><span class="line"></span>{{ modelName }}</p>
    <view class="sum-view-bg" style="margin-bottom: 5px">
      <selectorPick
        title="退场单号"
        :isEdit="false"
        :content="businessNo || workoutDic.businessNo"
        :isRequire="true"
      />
      <selectorPick
        title="物流类型"
        placeholder="请选择物流类型"
        :content="workoutDic.logisticsTypeName"
        @clickItem="clickShowPick('logistics')"
        :isEdit="isEdit"
      />

      <selectorInputIcon
        title="接机地点"
        placeholder="请选择接机地点"
        :content="workoutDic.deliveryPlace"
        :isRequire="true"
        :isEdit="isEdit"
        @iconClick="goTo($event, 'deliveryPlace')"
        @textChage="textChange($event, 'deliveryPlace')"
      />
      <selectorInputIcon
        title="送达地点"
        placeholder="请输入送达地点"
        :content="workoutDic.endPlace"
        :isRequire="true"
        :isEdit="isEdit"
        @iconClick="goTo($event, 'endPlace')"
        @textChage="textChange($event, 'endPlace')"
      />
      <selectorInput
        title="里程(km)"
        :isRequire="false"
        :content="workoutDic.mileage"
        placeholder="请输入里程"
        @textChage="textChange($event, 'mileage')"
        textType="digit"
        :isEdit="isEdit"
      />
      <view v-if="!isLiangXu">
        <selectorPick
          v-if="!isRemoveRepeat"
          title="计划结算日期"
          :isRequire="true"
          placeholder="请选择结算时间"
          :content="getYMDHMTime(workoutDic.preSettleDate) || ''"
          @clickItem="clickShowPick('preSettleDate')"
          :isEdit="isEdit"
          :rightIcon="dateIcon"
        />
        <selectorPick
          v-if="!isRemoveRepeat"
          title="计划接机时间"
          :isRequire="true"
          placeholder="请选择接机时间"
          :content="timeFormatYMDHM(workoutDic.preEndDate)"
          @clickItem="clickShowPick('preEndDate')"
          :isEdit="isEdit"
          :rightIcon="dateIcon"
        />
      </view>
      <view style="border-bottom: 1px dotted #e6e6e6">
        <view class="sub-model-tag">
          <text class="line"></text><text>退场设备需求</text>
        </view>
        <view class="cell-section-view">
          <view class="cell-section-view-width"><text>型号/高度</text></view>
          <view class="cell-section-view-width" style="justify-content: center"
            ><text>已进/流程中/已退</text></view
          >
          <view class="cell-section-view-width" style="justify-content: center"
            ><text>退场数量</text></view
          >
        </view>
        <view
          v-if="(isEdit && getOverNum(item) > 0) || (!isEdit && item.usedNum > 0)"
          v-for="(item, i) in workoutDic.orders"
          :key="i"
        >
          <view class="cell-section-view-width-item">
            <view>
              <view style="display: flex; flex-direction: column; align-items: center">
                <text class="cell-view"
                  >{{ item.typeName || "--" }}/{{ item.heightName || "--" }}</text
                >
              </view>
            </view>
            <view
              class="cell-section-view-width cell-view"
              style="justify-content: center"
            >
              <view>
                {{ item.workInNum || "--" }}
                /
                {{ item.applyNum || "--" }}
                /
                {{ item.actualNum || "--" }}
              </view>
            </view>
            <view
              class="cell-section-view-width cell-view"
              style="justify-content: center"
            >
              <number-box-style
                :min="isEdit ? 0 : item.usedNum"
                :max="isEdit ? getOverNum(item) : item.usedNum"
                :compare="false"
                @class="vehicle - num"
                @change="getNumValue($event, i, item)"
                :value="item.usedNum"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import NumberBoxStyle from "./components/number-box-style.vue";
import contactItem from "@/components/common/common-ui/contact-item.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  name: "modelApply",
  components: {
    selectorPick,
    selectorInput,
    selectortextArea,
    NumberBoxStyle,
    contactItem,
    selectorInputIcon,
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false,
    },
    businessNo: {
      type: String,
      default: "",
    },
    //传入的数据
    workoutDic: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    //模块名称
    modelName: {
      type: String,
      default: "退场信息",
    },
    //是否去重
    isRemoveRepeat: {
      type: Boolean,
      default: false,
    },
    //是否去重(是否物流)
    isRemoveLogistics: {
      type: Boolean,
      default: false,
    },
    isLiangXu: {
      type: Boolean,
      default: false,
    },
    //是否启用半天租
    isHalf: {
      type: Boolean,
      default: true,
    },
    previewBtn: {
      type: Boolean,
      default: false,
    },
  },
  watch: {},
  data() {
    return {
      dateIcon: "iconzl--rili",
      righticon: "iconarrow-right",
    };
  },
  created() {},
  methods: {
    callPhone(phone) {
      if (!this.isEdit && phone) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: phone,
          // 成功回调
          success: (res) => {
            console.log("调用成功!");
          },

          // 失败回调
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    //获取联系人信息
    getContactVal(val) {
      this.$emit("setContactVal", val);
    },
    goTo(val, type) {
      this.$emit("goTo", {
        type: type,
      });
    },
    clickShowPick(val) {
      this.pickType = val;
      let selectType = "date";
      switch (this.pickType) {
        case "preSettleDate":
          selectType = "date";
          break;
        case "preEndDate":
          selectType = "halfDate";
          break;
        case "logistics":
          selectType = "selector";
          break;
        default:
          break;
      }
      this.$emit("showPick", {
        pickType: this.pickType,
        selectType: selectType,
      });
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    getDateStr(time) {
      let d = this.isEdit ? "" : "--";
      if (time) {
        d = time;
      }
      return d;
    },
    getYMDHMTime(date) {
      let d = this.isEdit ? "" : "--";
      if (date) {
        d = this.getDate(date);
      }
      return d;
    },
    timeFormatYMDHM(date) {
      let d = this.isEdit ? "" : "--";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    getOverNum(item) {
      if (item.workInNum > 0) {
        return item.workInNum - item.actualNum - item.applyNum;
      }

      return 0;
    },
    //设备配置
    getNumValue(val, index, item) {
      this.$emit("getNumValue", {
        usedNum: val,
        index: index,
        item: item,
      });
    },
    textChange(e, type) {
      switch (type) {
        case "phoneNum":
          this.$emit("setContactVal", {
            phoneNum: e,
            name: this.workoutDic.contactName,
          });
          break;
        case "comment":
          this.$emit("setComment", e);
          break;
        case "deliveryPlace":
          this.$emit("deliveryPlace", e);
          break;
        case "endPlace":
          this.$emit("setEndPlace", e);
          break;
        case "mileage":
          e = e.replace(/[^0-9.]/g, "");
          // 保留第一个小数点，移除后续的小数点
          const firstDotIndex = e.indexOf(".");
          if (firstDotIndex !== -1) {
            e =
              e.substring(0, firstDotIndex + 1) +
              e.substring(firstDotIndex + 1).replace(/\./g, "");
          }
          // 确保小数点后至少有一个数字，并且小数点不能在第一个字符位置
          if (e.startsWith(".")) {
            e = "";
          }
          this.workoutDic.mileage = e;
          let dict = {
            ...this.dataDic,
            mileage: e,
          };
          this.$emit("setMileage", {
            type: "value",
            data: dict,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/workout-style";

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  // justify-content: flex-end;
  margin: 0 0 10px 0;
  background: #ffffff;
  padding-bottom: 10px;
}

.model-tag {
  display: flex;
  justify-content: flex-end;
}

.sub-model-tag {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #222222;
  padding: 5px 10px;
  padding-bottom: 20rpx;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  box-sizing: border-box;

  .line {
    width: 9rpx;
    height: 32rpx;
    background: #e60000;
    margin-right: 20rpx;
  }
}

.cell-section-view-width-item {
  display: flex;
  align-items: center;
  height: 88rpx;
  line-height: 88rpx;
  background: #f6f6f6;
  justify-content: space-between;
  margin: 16rpx 30rpx;
  padding: 0 10rpx;
}

.flow-btns {
  padding: 0 10px;
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0;
  height: 60px;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 1000;
}

.donwload {
  width: 110px;

  display: flex;
  // width: 72px;
  height: 32px;
  border-radius: 6px;
  background: #e60000;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.start {
  display: flex;
  width: 110px;
  height: 32px;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
  background: #e60000;
}

.end {
  display: flex;
  width: 110px;
  height: 32px;
  font-size: 16px;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
  background: #dcdfe6;
}
</style>
