export default {
  onShow(){
    if (typeof this.$mp.page.getTabBar === 'function' &&
      this.$mp.page.getTabBar()) {
      this.$mp.page.getTabBar().setData({
        active:this.$options.name
      })
    }
  }
}