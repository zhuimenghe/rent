<template>
  <view style="width:100vw;height:100vh;position:fixed;left:0;top:0;z-index:9999;">
    <view style="width:100vw;height:100vh;display:flex;flex-direction: column;">
      <camera frame-size="large" device-frame-size="large" resolution="high" device-resolution="high" :position="device"
        :device-position="device" :flash="flash" :device-flash="flash" @error="error" @initdone="success"
        style="flex:1;position: relative;">
        <view class="previewer1" v-show="!outputPath">
          <watermark :config="config"></watermark>
        </view>
        <!-- <cover-view class="tools1" :class="{ 'hidden': showSelector || outputPath }">
          <cover-image class="img" src="@/static/png/menu.png"></cover-image>
          <cover-image class="img" src="@/static/png/pintu.png"></cover-image>
          <cover-image class="img" src="@/static/png/huafu.png"></cover-image>
          <cover-image class="img" src="@/static/png/fl.png" v-show="flash === 'auto'"
            @click="flash = 'on'"></cover-image>
          <cover-image class="img" src="@/static/png/fl-on.png" v-show="flash === 'on'"
            @click="flash = 'torch'"></cover-image>
          <cover-image class="img" src="@/static/png/fl-torch.png" v-show="flash === 'torch'"
            @click="flash = 'off'"></cover-image>
          <cover-image class="img" src="@/static/png/fl-off.png" v-show="flash === 'off'"
            @click="flash = 'auto'"></cover-image>
          <cover-image class="img" src="@/static/png/hengping.png"></cover-image>
        </cover-view> -->
        <image class="output" v-if="outputPath" :src="outputPath"></image>
      </camera>
      <view class="footer" v-show="outputPath">
        <view class="flex-col-center" @click.stop="outputPath = ''">
          <view class="btn1">取消</view>
        </view>
        <view class="flex-col-center" @click="confirm">
          <view class="btn1">完成</view>
        </view>
      </view>
      <view class="footer" v-show="!outputPath">
        <view class="flex-col-center" @click.stop="cancel">
          <view class="btn1">取消</view>
        </view>
        <view class="cameraBtn" @click="takePhoto">
          <view class="cameraBtn2"></view>
        </view>
        <view class="flex-col-center" @click.stop="showRemark">
          <view class="btn1">备注</view>
        </view>
      </view>
    </view>
    <uni-popup ref="pop" type="center" :mask-click="true">
      <view class="popup">
        <view class="text-center text-xl text-bold">备注</view>
        <view class="margin-top-xl ">
          <view style="border:1px solid #ccc;padding:5px;margin-top:10px;overflow:hidden;box-sizing:border-box">
            <textarea auto-height v-model="remark" placeholder-style="color:#8c8c8c;font-size:14px;"
              placeholder="请输入备注" />
          </view>
        </view>
        <view class="flex justify-between margin-top-xl">
          <view style="width:236rpx;background:#F4F3F8;color:#8c8c8c" class="z-btn bg-light-gray radius"
            @click="$refs.pop.close()">取消</view>
          <view style="width:236rpx" class="z-btn bg-primary radius" @click="confirmRemark">确定</view>
        </view>
      </view>
    </uni-popup>
    <view style="position: absolute;top: -999999px;">
      <outputer ref="outputer"></outputer>
    </view>
  </view>
</template>

<script>
import watermark from './watermark'
// import outputer from './outputer'
import outputer from './outputer2'
export default {
  name: 'water-camera',
  data() {
    return {
      flash: 'auto', //闪光灯，值为auto, on, off,torch
      orientation: 'vertical',//画面方向，默认vertical竖屏，horizontal横屏
      device: 'back', //前置或后置摄像头，值为front, back
      remark: '',
      config: {
        type: 'locationTime',
        form: {}
      },
      maxZoom: 1,
      outputPath: '',
    }
  },
  components: {
    outputer, watermark
  },
  mounted() {
    this.cameraCTX = uni.createCameraContext();
    this.frameListen = this.cameraCTX.onCameraFrame((frame) => {
      if (this.waitCameraFrame) {
        this.waitCameraFrame(frame)
        this.waitCameraFrame = null;
      }
    });
    this.frameListen.start({
      success() {
        console.log('frameListen start success')
      },
      fail() {
        this.frameListen = null;
        console.log('frameListen start fail')
      }
    })
  },
  beforeDestroy() {
    this.frameListen && this.frameListen.stop({
      success: () => {
        this.frameListen = null;
        console.log('frameListen stop success')
      },
      fail: () => {
        this.frameListen = null;
        console.log('frameListen stop fail')
      }
    })
  },
  methods: {
    showRemark() {
      this.remark = this.config.form.remark
      this.$refs.pop.open()
    },
    confirmRemark() {
      this.config.form = { remark: this.remark }
      this.$refs.pop.close()
    },
    cancel() {
      this.$emit('cancel')
    },
    rotateCamera() {

    },
    async getCameraPhoto() {
      if (this.frameListen && 1 === 2) {
        const frame = await new Promise((resolve) => {
          this.waitCameraFrame = resolve;
        });
        return {
          filePath: new Uint8ClampedArray(frame.data),
          width: frame.width,
          height: frame.height,
        };
      } else {
        const { tempImagePath: filePath } = await this.$gxfmethod.promisify(this.cameraCTX.takePhoto)({
          quality: 'normal',
        });
        console.log('0.5', new Date().getTime())
        const photoInfo = await this.$gxfmethod.promisify(uni.getImageInfo)({
          src: filePath,
        });
        console.log('1', photoInfo, new Date().getTime())
        return {
          filePath: filePath,
          width: photoInfo.width,
          height: photoInfo.height,
        };
      }
    },
    async takePhoto() {
      console.log('0', new Date().getTime())
      if (this.handing) {
        return;
      }
      try {
        this.handing = true;
        const photoInfo = await this.getCameraPhoto();
        //先清空文件空间
        const fs = uni.getFileSystemManager()
        var dirPath = wx.env.USER_DATA_PATH
        let {files} = await this.$gxfmethod.promisify(fs.readdir)({dirPath});
        await Promise.allSettled(files.filter(f=>!f.includes('miniprogramLog')).map(f=>this.$gxfmethod.promisify(fs.unlink)({filePath:  dirPath + '/' +f})))

        this.outputPath = await this.$refs.outputer.output(this.config, photoInfo);
      } catch (err) {
        console.error(err);
        uni.showToast({
          icon: 'error',
          title: '处理失败'
        })
      } finally {
        this.handing = false;
      }
    },
    success(e) {
      this.maxZoom = e.detail.maxZoom;
      console.log('初始化相机成功', e)
    },
    error(e) {
      console.error('初始化相机失败', e)
      return uni.showToast({
        icon: 'error',
        title: '初始化相机失败'
      })
    },
    confirm() {
      this.$emit('confirm', [this.outputPath])
    },
    sharePhoto() {
      uni.showShareImageMenu({
        path: this.outputPath,
      })
    }
  }
}
</script>

<style scoped lang="scss">
	@import './camera.scss';
  .popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 40rpx;
    background: $uni-bg-color;
  }
</style>