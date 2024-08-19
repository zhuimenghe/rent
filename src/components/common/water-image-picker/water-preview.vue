<template lang="">
  <view class="container">
    <c-nav-bar custom-back @back="pick" backgroundColor="#212121" textColor="#fff"></c-nav-bar>
    <swiper
      class="list-wrapper"
      :duration="200"
    >
      <swiper-item class="list" v-for="(t, i) in urls" :key="i">
        <image style="height:100%;width:100vw;background:#000" mode="aspectFit" :src="useWaterMark ? outputPaths[i] : urls[i]">
        </image>
      </swiper-item>
    </swiper>
    <view class="footer">
      <view class="flex-1">
        添加水印
        <switch
          style="transform:scale(0.8)"
          class="margin-left"
          :checked="useWaterMark"
          @change="toogle"
        />
      </view>
      <text v-if="useWaterMark" class="" @click="showRemark">备注</text>
      <view class="flex-1 text-right">
        <view v-show="canConfirm" class="z-btn radius" style="margin-left:auto;background:#06C160;" @click="confirm">完成</view>
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
      <outputer ref="outputer0"></outputer>
      <outputer ref="outputer1"></outputer>
      <outputer ref="outputer2"></outputer>
      <outputer ref="outputer3"></outputer>
      <outputer ref="outputer4"></outputer>
      <outputer ref="outputer5"></outputer>
      <outputer ref="outputer6"></outputer>
      <outputer ref="outputer7"></outputer>
      <outputer ref="outputer8"></outputer>
    </view>
  </view>
</template>

<script>
import outputer from './outputer2'
export default {
  components: { outputer },
  data() {
    return {
      urls: [],
      outputPaths: [],
      useWaterMark: true,
      remark: '',
      config: {
        type: 'locationTime',
        form: {}
      },
    }
  },
  computed: {
    canConfirm() {
      return !this.useWaterMark || this.outputPaths.length > 0
    },
  },
  methods: {
    showRemark() {
      this.remark = this.config.form.remark
      this.$refs.pop.open()
    },
    async confirmRemark() {
      this.config.form = { remark: this.remark }
      this.$refs.pop.close()
      await this.render()
    },
    toogle({ detail }) {
      this.useWaterMark = detail.value
    },
    pick(count = 9) {
      this.urls = []
      uni.chooseImage({
        count: count,
        sourceType: ['album'],
        sizeType: ["compressed"],
        success: async (res) => {
          this.urls = res.tempFilePaths
          this.render()
        },
        fail: () => {
          this.$emit('cancel')
        }
      });
    },
    async render() {
      uni.showLoading({
        title: ''
      });
      //先清空文件空间
		  const fs = uni.getFileSystemManager()
      var dirPath = wx.env.USER_DATA_PATH
      let {files} = await this.$gxfmethod.promisify(fs.readdir)({dirPath});
      await Promise.allSettled(files.filter(f=>!f.includes('miniprogramLog')).map(f=>this.$gxfmethod.promisify(fs.unlink)({filePath:  dirPath + '/' +f})))

      console.log(`--&--start multi render water mark:${new Date().getTime()}`)
      this.outputPaths = await Promise.all(this.urls.map(async (l, i) => {
        const pi = await this.$gxfmethod.promisify(uni.getImageInfo)({
          src: l,
        });
        return this.$refs['outputer' + i].output(this.config, {
          filePath: l,
          width: pi.width,
          height: pi.height,
        });
      }))
      console.log(`end:${new Date().getTime()}`)
      uni.hideLoading()
    },
    confirm() {
      let imgs = this.useWaterMark ? this.outputPaths : this.urls
      this.$emit('confirm', imgs)
    }
  }
}
</script>

<style lang="scss" scoped>
  .container{
    position:fixed;
    width:100vw;
    height:100vh;
    left:0;
    top:0;
    z-index: 9999;
    @include flex(column)
  }
  .footer{
    height:160rpx;
    background:#212121;
    @include flex(row,center);
    padding:0rpx 24rpx;
    color:#fff;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 40rpx;
    background: $uni-bg-color;
  }
  .list-wrapper {
    background: #000;
    flex: 1;
    overflow: auto;

    .list {
      height: 100%;
      overflow: auto;
    }
  }
</style>