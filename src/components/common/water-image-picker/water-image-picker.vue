<template lang="">
  <div>
    <water-camera v-if="type==0" @cancel="type=-1" @confirm="confirm"></water-camera>
    <water-preview ref="preview" v-if="type==1" @cancel="type=-1" @confirm="confirm"></water-preview>
  </div>
</template>

<script>
import WaterCamera from './water-camera'
import WaterPreview from './water-preview'
export default {
  components: {
    WaterCamera,
    WaterPreview
  },
  data() {
    return {
      type: -1,
    }
  },
  methods: {
    show(count = 9) {
      uni.showActionSheet({
        itemList: ['拍摄', '从相册选择'],
        success: ({ tapIndex }) => {
          this.type = tapIndex
          this.$nextTick(_ => {
            if (tapIndex == 1) {
              this.$refs.preview.pick(count)
            }
          })
        }
      })
    },
    confirm(imgs) {
      this.type = -1
      this.$emit('confirm', imgs)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>