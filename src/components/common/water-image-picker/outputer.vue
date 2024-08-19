<template>
  <view>
    <wxml-to-canvas v-if="canvasWidth && canvasHeight" class="outputCanvas" :width="canvasWidth"
      :height="canvasHeight"></wxml-to-canvas>
    <canvas v-if="converterInfo" canvas-id="converter" binderror="converterResult"
      :style="'width: ' + (converterInfo.width) + 'px; height: ' + (converterInfo.height) + 'px;'"></canvas>
  </view>
</template>

<script>
import waterMarkProvider from './watermark/index.js';

let systemInfo = uni.getSystemInfoSync();
export default {
  name: 'outputer',
  data() {
    return {
      canvasWidth: 0,
      canvasHeight: 0,
      converterInfo: false,
    }
  },
  created() {

  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {
    converterResult(err, filePath) {
      const converterInfo = this.converterInfo;
      console.log(666, err, filePath, converterInfo.width, converterInfo.height)
      this.converterInfo = false;
      if (converterInfo) {
        if (err) {
          converterInfo.reject(err)
        } else {
          converterInfo.resolve(filePath)
        }
      }
    },
    async getPhotoFilePath(photoInfo) {
      if (!photoInfo.filePath.byteLength) {
        return photoInfo.filePath;
      }
      console.log(photoInfo.filePath)
      return new Promise((resolve, reject) => {
        this.converterInfo = { resolve, reject, width: photoInfo.width, height: photoInfo.height };
          /* this.$nextTick */setTimeout(() => {
          let ctx = uni.createCanvasContext('converter', this);
          uni.canvasPutImageData({
            canvasId: 'converter',
            data: photoInfo.filePath,
            x: 0, y: 0,
            width: photoInfo.width, height: photoInfo.height,
            success: (res) => {
              ctx.draw(false, (res) => {
                setTimeout(() => {
                  uni.canvasToTempFilePath({
                    canvasId: 'converter',
                    quality: 1,
                    success: (res) => {
                      uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath
                      })
                      this.converterResult(null, res.tempFilePath)
                    },
                    fail: (err) => {
                      this.converterResult(err)
                    }
                  }, this);
                }, 3000)
              })
            },
            fail: (err) => {
              this.converterResult(err)
            }
          }, this)
        }, 1000)
      });
    },
    async output(config, photoInfo) {
      const waterMark = waterMarkProvider.getProvider(config.type);

      const canvasWidth = photoInfo.width ? photoInfo.width / this.systemInfo.pixelRatio : this.systemInfo.windowWidth;
      const canvasHeight = photoInfo.height ? photoInfo.height / this.systemInfo.pixelRatio : this.systemInfo.windowHeight;

      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;

      const photoFilePath = await this.getPhotoFilePath(photoInfo);

      let { wxml, style } = await waterMark.render(config.form, canvasWidth, canvasHeight);
      wxml = `<view class="canvas">
        <image class="photo" src="${photoFilePath}"/>
        ${wxml}
        </view>`
      style.photo = {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
      }
      style.canvas = {
        width: canvasWidth,
        height: canvasHeight,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(255,255,255,0)',
      }
      console.log('style', style, this.systemInfo, new Date().getTime())
      await this.$gxfmethod.whileTaskDone(() => {
        const outputCanvas = this.selectComponent('.outputCanvas')
        return outputCanvas.renderToCanvas({ wxml, style });
      }, 20, 50)
      console.log('renderToCanvas', new Date().getTime())
      const { tempFilePath } = await this.$gxfmethod.whileTaskDone(() => {
        const outputCanvas = this.selectComponent('.outputCanvas')
        return outputCanvas.canvasToTempFilePath({
          fileType: 'jpg',
          quality: 1
        });
      }, 20, 50)
      console.log('canvasToTempFilePath', style, new Date().getTime())
      return tempFilePath;
    }
  }
}
</script>

<style></style>