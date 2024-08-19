import {
  queryStringfy
} from '@/common/common-method/common-method'
export default {
  onLoad() {
    // 设置默认的转发参数
    this.$share = {
      title: '', // 默认为小程序名称
      path: '', // 默认为当前页面路径
      imageUrl: '' // 默认为当前页面的截图
    }
  },
  onShareAppMessage() {
    /* 
    微信小程序自动组装的path，会将参数encode一次，但是我们页面的参数传参前都已经encode了，会造成分享时参数encode两次问题
    所以这里path手动拼装
    */
    if (!this.$share.path) {
      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      console.log('onshare options', currentPage.options)
      let query = queryStringfy(currentPage.options, false)
      this.$share.path = `/${currentPage.route}${query ? '?' + query : ''}`
    }
    return this.$share
  }
}
