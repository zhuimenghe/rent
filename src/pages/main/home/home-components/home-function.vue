<template>
  <view class="funcbgclass">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="menu-children-item" v-for="(child, i) in menus" :key="i" @click="gotoFunc(child)">
      <view class="childern-image" :style="{ background: getbgColorLinear(child), 'box-shadow': getShadow(child) }">
        <i class="iconfont icon-img" :style="{ color: child.color, fontSize: '20px' }" :class="child.appIconName"></i>
      </view>
      <view class="childern-title">
        <text>{{ getLine(child.title) }}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      menus: [
        {
          appIconName: "icongonghaikehu",
          backgroundColor: "#3AE8CC,#0CCBAC",
          color: "#FFFFFF",
          id: "customerManage",
          title: "客户管理",
          type: "url",
          url: "/otherPages/linkman/custom-admin"
        },
        {
          appIconName: "iconhetongguanli",
          backgroundColor: "#FEA736,#FE7C1E",
          color: "#FFFFFF",
          id: "contractManage",
          title: "合同列表",
          type: "tab-0",
          url: "0",
        },
        {
          appIconName: "iconjisuanqi",
          backgroundColor: "#FCDA09,#FFAC04",
          color: "#FFFFFF",
          id: "flexibleSettlement",
          title: "灵活结算",
          type: "tab-11",
          url: "11",
        },
        {
          appIconName: "icona-93jianchashigaokongzuoyeche",
          backgroundColor: "#AFC9FF,#3F8BFF",
          color: "#FFFFFF",
          id: "vehicleArchives",
          title: "设备档案",
          type: "url",
          url: "/devicePages/record/device-record"
        },
        {
          appIconName: "iconjiankong",
          backgroundColor: "#AFC9FF,#3F8BFF",
          color: "#FFFFFF",
          id: "vehicleMonitoring",
          title: "设备监控",
          type: "url",
          url: "/devicePages/monitor/equipment-monitoring-list"
        },
        {
          appIconName: "iconmanual-install-copy",
          backgroundColor: "#3AE8CC,#0CCBAC",
          color: "#FFFFFF",
          id: "subletApply",
          title: "转租申请",
          type: "url",
          url: "/otherPages/sublet/sublet-tab?index=0"
        },
        {
          appIconName: "iconjinchangguanli",
          backgroundColor: "#FEA736,#FE7C1E",
          color: "#FFFFFF",
          id: "arrivalManage",
          title: "进场管理",
          type: "tab-1",
          url: "1"
        },
        { "id": "allfunction", "title": "全部功能", "type": "url", "appIconName": "iconpeizhitubiaosvg-", "color": "#FFFFFF", "backgroundColor": "#FEA736,#E60000", "url": "/pages/main/home/home-function-list" }
      ]
    };
  },
  created() {
    this.getMyAddMenus();
  },
  methods: {
    dallist() {
      let dict = {};
      console.log(dict);
    },
    getLine(name) {
      if (name.length > 5) {
        return name.substring(0, 2) + "\n" + name.substring(2, name.length);
      }
      return name + "\n";
    },
    getbgColorLinear(item) {
      let bgColorstr = item.backgroundColor;
      if (bgColorstr) {
        let arr = bgColorstr.split(",");
        if (arr.length == 2) {
          let fontColor = arr[0];
          let behindColor = arr[1];
          return (
            "linear-gradient(133deg," + fontColor + "," + behindColor + ")"
          );
        } else if (arr.length == 1) {
          return arr[0];
        } else {
          return "#3B5AFD";
        }
      } else {
        return "#3B5AFD";
      }
    },
    getShadow(item) {
      let bgColorstr = item.backgroundColor;
      if (bgColorstr) {
        let arr = bgColorstr.split(",");
        if (arr.length == 2) {
          let fontColor = arr[0];
          let behindColor = arr[1];
          return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(
            behindColor
          )},0.42)`;
        } else if (arr.length == 1) {
          return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(
            arr[0]
          )},0.42)`;
        } else {
          return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(
            "#3B5AFD"
          )},0.42)`;
        }
      } else {
        return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(
          "#3B5AFD"
        )},0.42)`;
      }
    },
    gotoFunc(child) {
      console.log(child, 'child, menu');

      let urlPath = child.url;
      let str = '';
      if (child.id == "allfunction") {
        let list = [...this.menus];
        list.splice(list.length - 1, 1);
        urlPath =
          child.url +
          "?functionList=" +
          encodeURIComponent(JSON.stringify(list));
        str = encodeURIComponent(JSON.stringify(list))
      }
      if (child.type == "url" && child.url) {
        uni.setStorage({
          data: {
            id: child.url,
            url: urlPath,
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.navigateTo({
              url: child.url + `?url=${child.url}&key=${child.id}&functionList=${str}`
            });
          }
        });
      } else if (child.type == "tab-device") {
        uni.switchTab({
          url: "/pages/main/device"
        });
      } else {
        uni.setStorage({
          data: {
            id: urlPath
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.switchTab({
              url: "/pages/main/business"
            });
          }
        });
      }
    },
    setAllMenu(resData) {
      let menusList = resData.map(o => {
        return {
          id: o.id,
          title: o.name,
          type:
            o.componentType && o.componentType == "tab"
              ? o.componentType + (o.appComponent ? "-" + o.appComponent : "")
              : "url",
          appIconName: o.appIconName ? o.appIconName : "iconzl--shezhi",
          color: o.iconColor ? o.iconColor : "",
          backgroundColor: o.iconBackgroundColor ? o.iconBackgroundColor : "",
          url: o.appComponent ? o.appComponent : ""
        };
      });
      let allDict = {
        id: "allfunction",
        title: "全部功能",
        type: "url",
        appIconName: "iconpeizhitubiaosvg-",
        color: "#FFFFFF",
        backgroundColor: "#FEA736,#E60000",
        url: "/pages/main/home/home-function-list"
      };
      menusList.push(allDict);
      this.menus = [...menusList];
    },
    isUnicode(icon) {
      return icon.indexOf("icon") == -1 ? true : false;
    },
    //刷新数据
    refreshFunctionList() {
      this.getMyAddMenus();
    },
    /*网络请求数据*/
    //获取我添加的菜单
    getMyAddMenus() {
      let param = {
        isApp: true
      };
      this.$network
        .getData(this.$url.ALL_ADD_MENUS_URL, "GET", param, {
          showLoading: true
        })
        .then(result => {
          console.log(result, 'getMyAddMenus11111111111');
          if (!result || result == null) {
            this.setAllMenu([]);
          } else {
            this.setAllMenu(result);
          }
        })
        .catch(err => { });
    }
  }
};
</script>

<style lang="scss" scoped>
.funcbgclass {
  display: flex;
  flex-direction: row;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  background: #ffffff;
  overflow-y: hidden;
  padding-top: 20px;
}

.menu-children-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  justify-content: center;
  background: #ffffff;
}

.childern-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9e9e9;
  width: 90rpx;
  height: 90rpx;
  border-radius: 50%;
}

.icon-img {
  text-align: center;
  color: $uni-color-primary;
  font-size: 50rpx;
}

.childern-title {
  flex: 1;
  background: #ffffff;
  align-items: center;
  justify-content: center;
  font-size: $uni-font-size-base;
  margin-top: 10rpx;
  margin-bottom: 20rpx;
  color: #666666;
  text-align: center;
}
</style>
