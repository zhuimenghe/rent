Component({
  data: {
    active: 'home',
    tabs: [
      {
        tab: "home",
        pagePath: "/pages/main/home/home-static",
        text: "首页",
        iconPath: "/static/tab_button_home_nor.png",
        selectedIconPath: "/static/tab_button_home_sel.png",
      },
      {
        tab: "map",
        pagePath: "/pages/main/map",
        text: "设备",
        iconPath: "/static/tab_button_car_nor.png",
        selectedIconPath: "/static/tab_button_car_sel.png",
      },
      {},
      {
        tab: "business",
        pagePath: "/pages/main/business",
        text: "业务",
        iconPath: "/static/tab_button_js_nor.png",
        selectedIconPath: "/static/tab_button_js_sel.png",
      },
      {
        tab: "user",
        pagePath: "/pages/main/setting",
        text: "我的",
        iconPath: "/static/tab_button_mine_nor.png",
        selectedIconPath: "/static/tab_button_mine_sel.png",
      },
    ]
  },
  attached() {
    const query = wx.createSelectorQuery().in(this)
    query.select('.c-tab-bar').boundingClientRect((rect) => {
      // console.log(rect.height)
      if (rect.height > 0) {
        getApp().setTabBarHeight(rect.height)
      }
    }).exec()
  },
  ready() {

  },
  methods: {
    nav(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    },
    scan() {
      getApp().scanCode()
    }
  }
})