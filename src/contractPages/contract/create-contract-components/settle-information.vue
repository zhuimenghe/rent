<template>
  <view>
    <p class="title"><span class="line"></span>结算信息</p>
    <view class="base-infomation-bg">
      <view>
        <selectorPick
          title="月份计算"
          placeholder="请选择月份计算方式"
          :content="settlementObj.label"
          @clickItem="showPick('settlementType')"
          :isEdit="isEdit"
          :isRequire="false"
        />
      </view>
      <view>
        <selectorPick
          title="支付约定"
          placeholder="请选择支付约定方式"
          :content="dataDic.paymentTypeName"
          @clickItem="showPick('paymentType')"
          :isEdit="isEdit"
          :isRequire="false"
        />
      </view>
      <selectorInput
        v-if="dataDic.paymentType == '3'"
        textType="digit"
        title="预付金额(元)"
        placeholder="0.00"
        :content="dataDic.advance"
        :isRequire="true"
        @textChage="textChage($event, 'advance')"
        :isEdit="isEdit"
      />
      <view v-if="dataDic.paymentType == '3'" class="prepay selector-input-bg">
        <view>预付款到账后几天内进场</view>
        <view style="display: flex">
          <input
            type="number"
            @blur.trim="prePayChange"
            v-model="dataDic.prePayWorkInDays"
            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
          />
          天</view
        >
      </view>
      <view v-if="dataDic.paymentType">
        <selectorPick
          v-if="dataDic.paymentType == '2' || dataDic.paymentType == '3'"
          title="结算日类型"
          placeholder="请选择结算日类型"
          :content="dataDic.settlementDayTypeName"
          :isRequire="true"
          @clickItem="showPick('settlementDayType')"
          :isEdit="isEdit"
        />
      </view>
      <view v-if="dataDic.paymentType && dataDic.settlementDayType">
        <selectorPick
          v-if="
            (dataDic.paymentType == '2' || dataDic.paymentType == '3') &&
            dataDic.settlementDayType == '2'
          "
          title="结算日"
          placeholder="请选择结算日"
          :content="dataDic && dataDic.settlementDay ? dataDic.settlementDay + '号' : ''"
          :isRequire="true"
          @clickItem="showPick('settlementDay')"
          :isEdit="isEdit"
        />
      </view>
      <selectorPick
        title="运费减免约定"
        placeholder="请选择运费减免约定"
        :content="dataDic.renterTripTypeName"
        :isRequire="true"
        @clickItem="showPick('renterTripType')"
        :isEdit="isEdit"
      />
      <selectorPick
        title="运费计算方式"
        placeholder="请选择运费计算方式"
        :content="dataDic.tripCalType=='1'?'按趟计费':'按台计费'"
        :isRequire="true"
        @clickItem="showPick('tripCalType')"
        :isEdit="isEdit"
      >
        <view slot="title-icon">
          <businessTips tips="按趟计费，系统默认一个进场或退场单据为一趟物流" :color="'#f3a73f'" />
        </view>
      </selectorPick>
      <selectorInput
        v-if="dataDic.tripCalType=='1'"
        textType="digit"
        title="单趟运费金额"
        placeholder="0.00"
        :content="dataDic.tripVal"
        :isRequire="true"
        @textChage="textChage($event, 'tripVal')"
        :isEdit="isEdit"
      />
      <selectorPick
        title="开发票"
        placeholder="请选择发票类型"
        :content="dataDic.invoiceTypeName"
        :isRequire="false"
        @clickItem="showPick('invoiceType')"
        :isEdit="isEdit"
      />
      <view v-if="dataDic.invoiceType != 0" class="selector-pick-bg">
        <view class="selector-pick-cell-left">发票税额</view>
        <view class="selector-pick-cell-right">
          <input
            v-if="isEdit"
            :max="100"
            :min="0"
            @blur.trim="invoiceChange"
            placeholder-style="color:#F76260;font-size:8px"
            v-model="invoiceTax"
            @input="inputClick"
            class="uni-input"
            type="digit"
            placeholder=" "
          /><text v-else>{{ dataDic.invoiceTax || 0 }}</text
          >&nbsp;&nbsp;%
        </view>
      </view>
      <selectorPick
        title="是否需要配备操作人员"
        placeholder="是否需要配备操作人员"
        :content="dataDic.allocateFlag ? '是' : '否'"
        :isRequire="false"
        @clickItem="showPick('allocateFlag')"
        :isEdit="isEdit"
      />
      <selectorInput
        v-if="dataDic.allocateFlag"
        textType="digit"
        title="人天单价(元)"
        placeholder="0.00"
        :content="dataDic.allocatePrice"
        :isRequire="false"
        @textChage="textChage($event, 'allocatePrice')"
        :isEdit="isEdit"
      />
    </view>
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
  },
  props: {
    settlementObj: {
      type: Object,
      default() {
        return {};
      },
    },
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
  },
  data() {
    return {
      placeholder: "",
      prePayWorkInDays: "",
      invoiceTax: 0,
    };
  },

  created() {
    this.placeholder = this.$gxfmethod.defaultProjectName();
    setTimeout(() => {
      if (this.dataDic.invoiceTax) {
        this.invoiceTax = this.dataDic.invoiceTax;
        this.prePayWorkInDays = this.dataDic.prePayWorkInDays;
      }
    }, 30);
  },
  watch: {
    dataDic(val) {
      if (val.invoiceTax) {
        this.invoiceTax = val.invoiceTax;
        this.prePayWorkInDays = val.prePayWorkInDays;
      }
    },
  },
  methods: {
    invoiceChange(val) {
      let value = val.detail.value || "";
      if (value > 100) {
        value = 100;
      } else if (value < 0) {
        value = 0;
      }
      this.invoiceTax = value;
      this.$emit("invoiceChange", value);
    },
    inputClick(e) {
      console.log(e, "e");
      const o = e.detail.value || "";
      const inputRule = /[^\d]/g;
      this.$nextTick(() => {
        this.dataDic.invoiceTax = o.replace(inputRule, "");
      });
    },

    prePayChange(val) {
      let value = val.detail.value || "";
      this.$emit("prePayChange", value);
    },
    showDayType() {
      if (
        this.dataDic &&
        (this.dataDic.paymentType == "2" || this.dataDic.paymentType == "3")
      ) {
        return true;
      }
      return false;
    },
    showDay() {
      if (
        this.dataDic &&
        (this.dataDic.paymentType == "2" || this.dataDic.paymentType == "3") &&
        this.dataDic.settlementDayType == "2"
      ) {
        return true;
      }
      return false;
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
      console.log(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  background: #ffffff;
}
input {
  border: 1px solid #eee;
  width: 70px;
  font-size: 14px;
  padding: 5rpx;
}
.selector-pick-bg {
  position: relative;
  display: flex;
  flex-direction: row;
  background: #ffffff;
  padding: 10px;
  border-bottom: #f0f2f4 1px dotted;
}
.selector-pick-cell-left {
  display: flex;
  min-width: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.selector-pick-cell-right {
  display: flex;
  flex: 1;
  margin-left: 10px;
  align-items: center;
  justify-content: flex-end;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}
.settle-infomation-bg {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: #f0f2f4 1px dotted;
  background: #ffffff;
}
.prepay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 10px 10px;
  border-bottom: #f0f2f4 1px dotted;
  background-color: #fff;
  input {
    width: 30px;
    margin-right: 5px;
  }
}
.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}
.title-left {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}
.selector-pick-cell-top {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding: 10px;
}
.selector-bg {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: #ffffff;
}
.tag-class {
  font-size: 14px;
  padding: 3px 10px;
  border-radius: 5px;
  border: $uni-color-primary 1px solid;
  margin-right: 10px;
  color: $uni-color-primary;
}
.tag-class-unclick {
  font-size: 14px;
  padding: 3px 10px;
  border-radius: 5px;
  margin-bottom: 5px;
  border: #999999 1px solid;
  margin-right: 10px;
  color: #999999;
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
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
</style>
