<template>
  <view>
    <view
      :class="['l-popup-box popup-transition']"
      :data-distance="distance"
      :data-translate-x="translateX"
      @touchstart="popup.touchstart"
      @touchmove="popup.touchmove"
      @touchend="popup.touchend"
      :style="popStyle"
    >
      <view class="popup-inner" :style="{width:width+'px'}">
        <slot />
      </view>
    </view>
  </view>
</template>
<script lang="wxs" module="popup">
var distance = null
var popupInstance = null
var startPageX
var startTime = null
var translateX = 0
var isMoving = false
function touchstart(event, ownerInstance) {
  startTime = event.timeStamp
  startPageX = event.changedTouches[0].pageX;
  popupInstance = ownerInstance.selectComponent(".l-popup-box");
  var dataset = event.instance.getDataset()
  distance =  Number(dataset.distance)
  translateX = Number(dataset.translateX)
  isMoving = false
  // return false
}

function touchmove(event) {
  var pageX =  event.changedTouches[0].pageX;
  var moveX = pageX - startPageX
  var finalTranslateX = moveX + translateX
  if(finalTranslateX>0) finalTranslateX = 0
  var style = {
    transform:'translate3d('+finalTranslateX+'px,0,0)',
    transition:'none'
  }
  if(finalTranslateX<0){
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
    popupInstance.setStyle({})
    return 
  }
  var pageX = event.changedTouches[0].pageX;
  var moveX = pageX - startPageX
  var isLeft = moveX < 0
  var finalTranslateX = moveX + translateX
  var duration = (event.timeStamp - startTime)
  var speed = Math.abs(moveX/duration)
  //关闭的情况
  //1.向左 速度比较大超过0.25
  //2.向左 -finalTranslateX>distance * 1/5
  //3.向右 -finalTranslateX > distance * 4/5  并且速度不超过0.25
  if( (speed>0.25&&isLeft) || (-finalTranslateX>distance * 1/5 && isLeft) 
  ||(-finalTranslateX > distance * 4/5 && !isLeft && speed<=0.25 ) ){
    var remainSec = (distance+finalTranslateX)/speed/1000
    var aniSec = remainSec < 0.2 ? remainSec : 0.2 
    popupInstance.setStyle({
      transform:'translate3d('+(-distance)+'px,0,0)',
      transition: 'transform '+aniSec+'s ease-out'
    })
    ownerInstance.callMethod("handlePopup", {show: false})
    ownerInstance.setTimeout(function(){
      popupInstance.setStyle({})
    }, aniSec*1000);
    // closePopup(event, ownerInstance)
  }else{
    var remainSec = -finalTranslateX/speed/1000
    var aniSec = remainSec < 0.2 ? remainSec : 0.2 
    popupInstance.setStyle({
      transform:'translate3d(0,0,0)',
      transition: 'transform '+aniSec+'s ease-out'
    })
    ownerInstance.callMethod("handlePopup", {show: true})
    ownerInstance.setTimeout(function(){
      popupInstance.setStyle({})
    }, aniSec*1000);
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
      default: 100,
    },
    width: {
      type: Number,
      default: 260,
    },
    initWidth:{
      type: Number,
      default: 0,
    },
    value: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    top:{
      type:Number,
      default:0
    }
  },
  mounted(){
    this.classes = ['l-popup-box','popup-transition']
  },
  data() {
    return {
      showPopup: false,
      classes:['l-popup-box']
    };
  },
  computed: {
    popStyle(){
      let style = `transform:translate3d(${this.translateX}px,0,0);z-index:${this.zIndex};top:${this.top}px`
      return style
    },
    translateX(){
      return this.showPopup ? 0 : -this.distance;
    },
    distance(){
      return this.width-this.initWidth;
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
.l-popup-box{
  position: fixed;
  left:0;
  top:0;
  // padding-bottom:calc(var(--safe-area-inset-bottom));
  box-sizing: content-box;
  overflow: visible;
  transform:translate3d(-100%,0,0);
  .popup-inner{
    overflow: visible;
  }
}
.popup-transition{
  transition: transform 0.2s ease-out;
}
</style>
