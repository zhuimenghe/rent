<template lang="">
  <p-l-painter ref="painter" :board="options"></p-l-painter>
</template>

<script>
import waterMarkProvider from './watermark/index.js';
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  data() {
    return {
      options: {},
    }
  },
  watch: {
    config: {
      async handler(nvalue) {
        if (!nvalue || !nvalue.type) {
          return;
        }
        console.log('on preview render', nvalue)
        this.preview(nvalue)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async preview(config) {
      const waterMark = waterMarkProvider.getProvider(config.type);

      this.options = await waterMark.render(config.form, this.systemInfo.windowWidth, this.systemInfo.windowHeight);
      console.log('l-painter config', this.options);
    }
  }
}
</script>

<style lang="">

</style>