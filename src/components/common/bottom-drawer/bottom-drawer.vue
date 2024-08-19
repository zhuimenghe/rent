<template>
  <view class="popup-container" @touchmove.native.stop.prevent>
    <view
      :class="['mask']"
      :style="{ zIndex: zIndex - 1 }"
      :catchtouchmove="true"
      v-if="showPopup"
      @click="popup.closePopup"
    />
    <!-- @touchstart="popup.touchstart"
      @touchmove="popup.touchmove"
      @touchend="popup.touchend" -->
    <view
      :class="['popup-box popup-transition']"
      :data-distance="distance"
      :data-translate-y="translateY"
      :style="popStyle"
      @touchstart="popup.touchstart"
      @touchmove="popup.touchmove"
      @touchend="popup.touchend"
    >
      <view class="move-btn flex row" id="popup-move-btn">
        <view class="line"></view>
        <!-- <text class="iconfont iconzhankai" v-if="showPopup"></text>
        <view class="line" v-else></view> -->
      </view>
      <view class="popup-inner" :style="{height:height+'px'}">
        <slot />
      </view>
    </view>
  </view>
</template>
<script lang="wxs" module="popup">
var distance = null
var popupInstance = null
var startPageY
var startTime = null
var translateY = 0
var isMoving = false
function touchstart(event, ownerInstance) {
  startTime = event.timeStamp
  startPageY = event.changedTouches[0].pageY;
  popupInstance = ownerInstance.selectComponent(".popup-box");
  var dataset = event.instance.getDataset()
  distance =  Number(dataset.distance)
  translateY = Number(dataset.translateY)
  isMoving = false
  // return false
}

function touchmove(event) {
  var pageY =  event.changedTouches[0].pageY;
  var moveY = pageY - startPageY
  var finalTranslateY = moveY + translateY
  if(finalTranslateY<0) finalTranslateY = 0
  var style = {
    transform:'translate3d(0,'+finalTranslateY+'px,0)',
    transition:'none'
  }
  if(finalTranslateY>0){
    isMoving = true
  }
  popupInstance.setStyle(style)
  // return false
}

function touchend(event, ownerInstance) {
  return handleTouchEnd(event, ownerInstance)
}

function touchcancel(event, ownerInstance) {
  return handleTouchEnd(event, ownerInstance)
}

function handleTouchEnd(event, ownerInstance) {
  if(!isMoving){
    return 
  }
  var pageY = event.changedTouches[0].pageY;
  var moveY = pageY - startPageY
  var isUp = moveY < 0
  var finalTranslateY = moveY + translateY
  var duration = (event.timeStamp - startTime)
  var speed = Math.abs(moveY/duration)
  //关闭的情况
  //1.向下 速度比较大超过0.25
  //2.向下 finalTranslateY>distance * 1/5
  //3.向上 finalTranslateY > distance * 4/5  并且速度不超过0.25
  if( (speed>0.25&&!isUp) || (finalTranslateY>distance * 1/5 && !isUp) 
  ||(finalTranslateY > distance * 4/5 && isUp && speed<=0.25 ) ){
    var remainSec = (distance-finalTranslateY)/speed/1000/2
    var aniSec = remainSec < 0.2 ? remainSec : 0.2 
    console.log(remainSec,aniSec,'===')
    popupInstance.setStyle({
      transform:'translate3d(0,'+distance+'px,0)',
      transition: 'transform '+aniSec+'s ease-out'
    })
    ownerInstance.callMethod("handlePopup", {show: false})
    // closePopup(event, ownerInstance)
  }else{
    var remainSec = finalTranslateY/speed/1000/2
    var aniSec = remainSec < 0.2 ? remainSec : 0.2 
    console.log(remainSec,aniSec,'===')
    popupInstance.setStyle({
      transform:'translate3d(0,0px,0)',
      transition: 'transform '+aniSec+'s ease-out'
    })
    ownerInstance.callMethod("handlePopup", {show: true})
  }
  // return false
}

function closePopup(event, ownerInstance) {
  popupInstance.setStyle({
    transition: 'transform 0.2s ease-out'
  })
  ownerInstance.callMethod("handlePopup", {show: false})
}

module.exports = {
  touchstart: touchstart,
  touchmove: touchmove,
  touchend: touchend,
  touchcancel: touchcancel,
  closePopup: closePopup,
}
</script>

<script>
export default {
  emits: {
    close: null,
    open: null,
    "update:modelValue": null,
  },
  props: {
    zIndex: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 500,
    },
    initHeight:{
      type: Number,
      default: 160,
    },
    value: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPopup: false,
      windowH: uni.getSystemInfoSync().windowHeight
    };
  },
  computed: {
    systemInfo() {
      return uni.getSystemInfoSync();
    },
    popStyle(){
      let style = `transform:translate3d(0,${this.translateY}px,0);z-index:${this.zIndex};`
      return style
    },
    translateY(){
      return this.showPopup ? 0 : this.distance;
    },
    distance(){
      return this.height-this.initHeight;
    }
  },
  watch: {
    // #ifdef VUE3
    modelValue: {
      immediate: true,
      handler(newVal) {
        this.handlePopup({ show: newVal });
        if (newVal) {
          this.$emit("open");
        } else {
          this.$emit("close");
        }
      },
    },
    // #endif
    // #ifndef VUE3
    value: {
      immediate: true,
      handler(newVal) {
        this.showPopup = newVal;

        // this.handlePopup({ show: newVal });
      },
    },
    // #endif
  },
  methods: {
    handlePopup(res) {
      this.showPopup = res.show;
      // #ifndef VUE3
      this.$emit("input", res.show);
      // #endif
      // #ifdef VUE3
      this.$emit("update:modelValue", res.show);
      // #endif
    },
    open() {
      this.handlePopup({ show: true });
    },
    close() {
      this.handlePopup({ show: false });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
