<template>
  <view>
    <p-l-painter ref="painter" path-type="url"></p-l-painter>

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

      const photoFilePath = await this.getPhotoFilePath(photoInfo);

      let options = await waterMark.render(config.form, canvasWidth, canvasHeight);
      let ops = {
        css: options.css,
        views: [
          {
            type: 'image',
            src: photoFilePath,
            css: {
              width: '100%',
              height: '100%',
            }
          },
          ...options.views
        ]
      }
      await this.$refs.painter.render(ops)
      let { tempFilePath } = await this.$refs.painter.canvasToTempFilePath({
        fileType: "jpg",
        quality: 1,
      })

      return tempFilePath;
    }
  }
}
</script>

<style></style>