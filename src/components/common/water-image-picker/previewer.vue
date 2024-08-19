<template>
  <wxml-to-canvas v-if="canvasWidth && canvasHeight" class="previewCanvas" :width="canvasWidth"
    :height="canvasHeight"></wxml-to-canvas>
</template>

<script>
import waterMarkProvider from './watermark/index.js';

export default {
  name: 'previewer',
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
      canvasWidth: 0,
      canvasHeight: 0,
    }
  },
  created() {

  },
  mounted() {
    this.unwatch = this.$watch('config', async (nvalue) => {
      if (!nvalue || !nvalue.type) {
        return;
      }
      console.log('on preview render', nvalue)
      if (nvalue.refresh) {
        await this.preview(nvalue);
      } else {
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.$nextTick(async () => {
          await this.preview(nvalue);
        }, 0)
      }
    }, {
      deep: true,
      immediate: true,
    })
  },
  beforeDestroy() {
    this.unwatch && this.unwatch();
  },
  methods: {
    async preview(config) {
      const waterMark = waterMarkProvider.getProvider(config.type);

      const canvasWidth = this.systemInfo.windowWidth;
      const canvasHeight = this.systemInfo.windowHeight;

      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;

      let { wxml, style } = await waterMark.render(config.form, canvasWidth, canvasHeight);
      wxml = `<view class="canvas">${wxml}</view>`
      style.canvas = {
        width: canvasWidth,
        height: canvasHeight,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(255,255,255,0)',
      }
      try {
        await this.$gxfmethod.whileTaskDone(() => {
          const previewCanvas = this.selectComponent('.previewCanvas')
          return previewCanvas.renderToCanvas({ wxml, style });
        }, 6, 300)
      } catch (err) {
        console.error('渲染出错', err)
        uni.showToast({
          icon: 'error',
          title: '水印加载失败'
        })
      }
    },
    canvasToTempFilePath(args = {}) {
      const previewCanvas = this.selectComponent('.previewCanvas')
      return previewCanvas.canvasToTempFilePath({
        fileType: 'png',
        // quality:0.8,
        // dpr:1,
        ...args,
      });
    }
  }
}
</script>

<style></style>