<template>
  <view class="uni-numbox">
    <view
      @click="_calcValue('minus')"
      class="uni-numbox__minus"
      :class="{ 'uni-numbox-btn--disabled-minus': value <= min || disabled }"
    >
      <text
        class="uni-numbox--text minus"
        :class="{ 'uni-numbox--disabled-minus': value <= min || disabled }"
        >-</text
      >
    </view>
    <input
      :disabled="inputdisabled"
      @input="textChange"
      class="uni-numbox__value"
      type="number"
      :value="value"
    />
    <view
      @click="_calcValue('plus')"
      class="uni-numbox__plus"
      :class="{ 'uni-numbox-btn--disabled-plus': value >= max || disabled }"
    >
      <text
        class="uni-numbox--text plus"
        :class="{ 'uni-numbox--disabled-plus': value >= max || disabled }"
        >+</text
      >
    </view>
  </view>
</template>
<script>
export default {
  name: "UniNumBox",
  props: {
    value: {
      type: [Number, String],
      default: 1,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inputdisabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _calcValue(type) {
      if (this.disabled) {
        return;
      }
      let value = parseInt(this.value);
      let step = this.step;
      if (type === "minus") {
        if (value > this.min) {
          value -= step;
        } else {
          this.$emit("minusChange", step);
        }
      } else if (type === "plus") {
        if (value < this.max) {
          value += step;
        } else {
          this.$emit("plusChange", step);
        }
      }
      this.$emit("change", value);
    },
    textChange(event) {
      let value = event.detail.value;
      if (value == "") {
        this.$emit("change", this.min);
        return;
      }
      this.$emit("change", value);
      setTimeout(() => {
        value = this.$gxfmethod.getNSIntString(value);
        if (value > this.max) {
          value = this.max;
        } else if (value < this.min) {
          value = this.min;
        }
        this.$emit("change", value);
      }, 30);
    },
  },
};
</script>
<style lang="scss" scoped>
$box-height: 20px;
$box-width: 20px;

.uni-numbox {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  // height: 40px;
  // line-height: 40px;
  align-items: center;
  justify-content: center;
}

.uni-numbox__value {
  background-color: $uni-bg-color;
  width: 40px;
  // height: 30px;
  text-align: center;
  font-size: 14px;
  border-color: $uni-border-color;
  align-self: center;
  margin: 0px;
  padding-top: 4px;
}

.uni-numbox__minus {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: $box-width;
  height: $box-height;
  // line-height: $box-line-height;
  // text-align: center;
  font-size: 16px;
  color: $uni-color-primary;
  background-color: $uni-bg-color;
  border-radius: 50%;
  border-style: solid;
  border-color: $uni-color-primary;
  border-width: 1px;
}

.uni-numbox__plus {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: $box-width;
  height: $box-height;
  border-width: 1px;
  border-style: solid;
  border-color: $uni-color-primary;
  background-color: $uni-color-primary;
  border-radius: 50%;
}

.uni-numbox--text {
  font-size: 15px;
}

.minus {
  color: #e60000;
}

.plus {
  color: $uni-bg-color;
}

.uni-numbox--disabled-minus,
.uni-numbox--disabled-plus {
  color: $uni-text-color-disable;
}

.uni-numbox-btn--disabled-minus,
.uni-numbox-btn--disabled-plus {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: $box-width;
  height: $box-height;
  border-width: 1px;
  border-style: solid;
  border-color: $uni-bg-color-grey;
  background-color: $uni-bg-color-grey;
  border-radius: 50%;
}
</style>
