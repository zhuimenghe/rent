<template>
  <view class="content">
    <web-view class="webview" :src="url" allow="iframe"></web-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(option) {
    this.url = decodeURIComponent(option.url);
  },
  methods: {},
};
</script>

<style>
.webview {
  width: 100%;
  height: 300px;
}
</style>
