<template>
  <uni-popup ref="pop" type="center" :mask-click="true" @maskClick="popupClose" @touchmove.stop="tm">
    <view class="popup-content">
      <view class="popup-title">{{ title }}</view>
      <view class="popup-body">{{ content }}</view>
      <view class="popup-footer">
        <view
          v-if="showCancelButton"
          @click="handleCancel"
          :class="cancelButtonClassComputed"
        >
          {{ cancelButtonName }}
        </view>
        <view
          v-if="showConfirmButton"
          @click="handleConfirm"
          :class="confirmButtonClassComputed"
        >
          {{ confirmButtonName }}
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      title: "",
      content: "",
      confirmButtonName: "",
      cancelButtonName: "",
      confirmButtonStyle: "",
      cancelButtonStyle: "",
      showConfirmButton: false,
      showCancelButton: false,
      callback: null, // 用于存储成功回调函数
    };
  },
  computed: {
    confirmButtonClassComputed() {
      return this.confirmButtonStyle;
      // 根据confirmButtonStyle确定按钮样式
    },
    cancelButtonClassComputed() {
      return this.cancelButtonStyle;
      // 根据cancelButtonStyle确定按钮样式
    },
  },
  methods: {
    tm(){},
    showModal(options) {
      const {
        title = "",
        content = "",
        confirmButtonName = "",
        cancelButtonName = "关闭",
        confirmButtonStyle = "default",
        cancelButtonStyle = "default",
        success,
      } = options;

      this.title = title;
      this.content = content;
      this.confirmButtonName = confirmButtonName;
      this.cancelButtonName = cancelButtonName;
      this.confirmButtonStyle = confirmButtonStyle;
      this.cancelButtonStyle = cancelButtonStyle;
      this.showConfirmButton = !!confirmButtonName;
      this.showCancelButton = !!cancelButtonName;
      this.callback = success;
      this.$refs.pop.open();
      this.show = true; // 显示弹窗
    },
    handleConfirm() {
      this.$refs.pop.close();
      this.show = false; // 关闭弹窗
      this.$emit("popClose");
      this.callback && this.callback({ confirm: true, cancel: false });
    },
    handleCancel() {
      this.$refs.pop.close(); // 关闭弹窗
      this.show = false; // 关闭弹窗
      this.$emit("popClose");
      this.callback && this.callback({ confirm: false, cancel: true });
    },
    popupClose() {
      this.$refs.pop.close(); // 关闭弹窗
      this.show = false; // 关闭弹窗
      this.$emit("popClose");
      this.callback && this.callback({ confirm: false, cancel: true });
    },
  },
};
</script>

<style scoped lang="scss">
.popup-content {
  background-color: #ffffff;
  padding: 20px 40px;
  width: 70vw;

  .popup-title {
    flex: 1;
    color: #333;
    font-size: 16px;
    min-height: 26px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-all;
    text-align: center;
    padding-bottom: 30px;
  }

  .popup-body {
    color: #999999;
    font-size: 16px;
    padding-bottom: 30px;
    word-break: break-all;
    white-space: pre-wrap;
    /* 设置文字换行方式 */
  }

  @mixin footer-btn() {
    padding: 10px 40px;
    border-radius: 6px;
    color: #ffffff;
    font-size: 17px;
  }

  .popup-footer {
    display: flex;
    justify-content: space-around;

    .default {
      @include footer-btn();
      background-color: #d8d8d8;
    }

    .primary {
      @include footer-btn();
      background-color: #e60000;
    }

    .text {
      @include footer-btn();
      color: #e60000;
    }
  }
}

/* 样式实现 */
</style>
