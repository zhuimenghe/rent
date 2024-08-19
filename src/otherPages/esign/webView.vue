<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <web-view class="webview" :src="url" fullscreen></web-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      title: "",
    };
  },
  onLoad(option) {
    this.url = this.url = decodeURIComponent(option.url);
    this.title = option.title;
  },
  methods: {
    onShareAppMessage() {
      return {
        title: this.title, //转发的标题。当前小程序名称
        path: `/otherPages/esign/webView?url=${encodeURIComponent(this.url)}`, //转发的路径
        imageUrl:
          "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
      };
    },
  },
};
</script>

<style>
.webview {
  width: 100%;
  height: 300px;
}
</style>
