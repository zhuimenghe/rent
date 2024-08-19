<template>
  <view class="content-func">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="query-content-search">
      <view class="query-search-box-search">
        <i class="iconfont query-search-icon-search iconzl--sousuo"></i>
        <view class="query-search-content-search">
          <input placeholder="搜索功能" class="input-style-search" v-model="searchKey" />
        </view>
      </view>
    </view>
    <!-- 占位省去计算高度 -->
    <!-- <view class="query-content-search-zw">
			<view class="query-search-box-search">
				<i class="iconfont query-search-icon-search iconzl--sousuo"></i>
				<view class="query-search-content-search">
					<input placeholder="" class="input-style-search" :disabled="true" />
				</view>
			</view>
    </view>-->
    <!-- 占位省去计算高度 -->
    <!-- 搜索功能模块 -->
    <view class="sum-view-bg" v-if="searchKey != ''">
      <view class="menu-children-container">
        <view class="menu-children-item" v-for="(child, i) in searchList" :key="i" @click="goTo(child)">
          <view class="childern-image" :style="{
            background: getbgColorLinear(child),
            'box-shadow': getShadow(child),
          }">
            <i class="iconfont icon-img" :style="{ color: child.color }" :class="child.appIconName"></i>
          </view>
          <view class="childern-title">
            <text>{{ getLine(child.title) }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 已有功能模块 -->
    <view class="sum-view-bg" v-if="searchKey == ''">
      <view class="menu-title-container titleborder">
        <view class="title-view-cente">{{ "常用功能" }}</view>
        <view class="edit-style" @click="edithome('edit')" v-if="!isEdit">
          {{ "编辑" }}
        </view>
        <view class="edit-style" @click="edithome('save')" v-if="isEdit">
          {{ "保存" }}
        </view>
      </view>
      <view class="menu-children-container">
        <view class="menu-children-item" v-for="(child, i) in usemenus" :key="i" @click="goTo(child)">
          <i class="iconfont icon-delete iconzl--jinyong" v-if="isEdit" @click="dealFunctionItem(child, i, 'nor')"></i>
          <view class="childern-image" :style="{
            background: getbgColorLinear(child),
            'box-shadow': getShadow(child),
          }">
            <i class="iconfont icon-img" :style="{ color: child.color }" :class="child.appIconName"></i>
          </view>
          <view class="childern-title">
            <text>{{ getLine(child.title) }}</text>
          </view>
        </view>
      </view>
    </view>
    <!--全部功能区-->
    <view class="sum-view-bg" v-if="searchKey == ''">
      <view class="menu-title-container titleborder">
        <view class="title-view-cente">{{ "全部功能" }}</view>
      </view>
      <view v-for="(menu, index) in menus" :key="index" style="display: flex; flex-direction: column">
        <view class="menu-title-container">
          <i class="iconfont title-icon-view">{{ menu.icon }}</i>
          <view class="title-view">{{ menu.title }}</view>
        </view>
        <view class="menu-children-container">
          <view class="menu-children-item" v-for="(child, i) in menu.children" :key="i" @click="goTo(child, menu)">
            <i class="iconfont icon-delete iconzl--jinyong" v-if="checkState(child, 'delete')"
              @click="dealFunctionItem(child, i, 'delete')"></i>
            <i class="iconfont icon-add iconadd-func" v-if="checkState(child, 'add')"
              @click="dealFunctionItem(child, i, 'add')"></i>
            <view class="childern-image" :style="{
            background: getbgColorLinear(child),
            'box-shadow': getShadow(child),
          }">
              <i class="iconfont icon-img" :style="{ color: child.color }" :class="child.appIconName"></i>
            </view>
            <view class="childern-title">
              <text>{{ getLine(child.title) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
let timer;
export default {
  components: {},
  data() {
    return {
      usemenus: [],
      menus: [], //功能列表
      searchList: [], //搜索列表
      searchKey: "", //搜索字段
      isLg: false,
      isLiangXu: true,
      isEdit: false, //是否在编辑主屏幕
    };
  },
  watch: {
    searchKey(val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.searchKey = val;
        this.searchChange();
      }, 500);
    },
  },
  onLoad(option) {
    console.log(option, "functionList");
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code == "tenant_name");
      if (obj) {
        this.isLiangXu = obj.value == "liangXu" ? true : false;
      }
    }
    if (option.functionList) {
      this.usemenus = JSON.parse(decodeURIComponent(option.functionList));
    }
    //获取所有的菜单
    let menusResData = uni.getStorageSync(this.$savekey.MY_ALL_MENUS);
    console.log(menusResData, "menusResData");
    if (menusResData) {
      //有保存数据
      this.setAllMenu(menusResData);
    } else {
      //无数据
      this.getAllMenus();
    }
    // this.dealIcon();
  },
  onUnload() { },
  methods: {
    // dealIcon(){
    // 	let  neslist = commonIcon.list;
    // 	let dict = {};
    // 	neslist.forEach(o=>{
    // 		dict[o.unicode] = 'pp' + o.unicode
    // 	})
    // 	console.log(dict);
    // },
    getLine(name) {
      if (name.length > 5) {
        return name.substring(0, 2) + "\n" + name.substring(2, name.length);
      }
      return name + "\n";
    },
    isUnicode(icon) {
      return icon.indexOf("icon") == -1 ? true : false;
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
    //获取所有菜单列表
    setAllMenu(resData) {
      this.menus = resData.map((o) => {
        return {
          id: o.id,
          title: o.name,
          appIconName: o.appIconName ? o.appIconName : "iconzl--shezhi",
          iconStr: o.appIcon,
          color: o.iconColor ? o.iconColor : "",
          path: o.path ? o.path : "",
          component: o.component ? o.component : "",
          children: this.dealItem(o),
        };
      });
      this.menus = this.menus.filter(
        (o) => o.children && o.children.length > 0
      );
      uni.hideLoading();
    },
    //处理功能列表
    dealItem(o) {
      let list = [];
      if (o.children && o.children.length > 0) {
        let Titleitem = null;
        if (
          o.children.every((t) => {
            return t.type == "2";
          })
        ) {
          if (o.appComponent) {
            Titleitem = {
              id: o.id,
              title: o.name ? o.name : "",
              appIconName: o.appIconName ? o.appIconName : "iconzl--shezhi",
              color: o.iconColor ? o.iconColor : "",
              type: o.componentType ? o.componentType : "url",
              path: o.path ? o.path : "",
              component: o.component ? o.component : "",
              backgroundColor: o.iconBackgroundColor
                ? o.iconBackgroundColor
                : "",
              url: o.appComponent ? o.appComponent : "",
            };
          }
        }
        list = o.children.map((y) => {
          return {
            id: y.id ? y.id : "",
            title: y.name ? y.name : "",
            appIconName: y.appIconName ? y.appIconName : "iconzl--shezhi",
            iconStr: o.appIcon,
            color: y.iconColor ? y.iconColor : "",
            type:
              y.componentType && y.componentType == "tab"
                ? y.componentType + (o.appComponent ? "-" + o.appComponent : "")
                : "url",
            backgroundColor: y.iconBackgroundColor ? y.iconBackgroundColor : "",
            url: y.appComponent ? y.appComponent : "",
            path: o.path ? o.path : "",
            component: o.component ? o.component : "",
          };
        });
        if (Titleitem) {
          list.splice(0, 0, Titleitem);
        }
      } else {
        if (o.appComponent) {
          list = [
            {
              id: o.id,
              title: o.name ? o.name : "",
              appIconName: o.appIconName ? o.appIconName : "iconzl--shezhi",
              color: o.iconColor ? o.iconColor : "",
              type: o.componentType ? o.componentType : "url",
              path: o.path ? o.path : "",
              component: o.component ? o.component : "",
              backgroundColor: o.iconBackgroundColor
                ? o.iconBackgroundColor
                : "",
              url: o.appComponent ? o.appComponent : "",
            },
          ];
        }
      }
      return list;
    },
    //判断列表是新增还是删除
    checkState(item, type) {
      if (this.isEdit) {
        let isDelete = this.usemenus.some((o) => {
          return o.id == item.id;
        });
        if (type == "add") {
          return !isDelete;
        }
        return isDelete;
      }
      return false;
    },

    //编辑
    edithome(type) {
      if (type == "edit") {
        this.isEdit = !this.isEdit;
      } else if (type == "save") {
        uni.showLoading();
        this.saveAddAllMenus();
      }
    },
    //删除,新增功能模块
    dealFunctionItem(item, index, type) {
      if (type == "nor") {
        this.usemenus.splice(index, 1);
      } else if (type == "delete") {
        let num = this.usemenus.findIndex((o) => {
          return o.id == item.id;
        });
        this.usemenus.splice(num, 1);
      } else if (type == "add") {
        if (this.usemenus.length >= 7) {
          uni.showToast({
            icon: "none",
            title: "最多只能选择7个常用功能放置首页",
          });
          return;
        }
        this.usemenus.push(item);
      }
    },
    //搜索筛选
    searchChange() {
      let allFunctionList = [];
      this.menus.forEach((o) => {
        allFunctionList = o.children
          ? [...allFunctionList, ...o.children]
          : [...allFunctionList];
      });
      this.searchList = allFunctionList.filter((o) => {
        return o.title.indexOf(this.searchKey) != -1;
      });
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 10,
      });
    },
    goTo(child, menu) {
      console.log(child, menu, "child, menu");
      if (this.isEdit && this.searchKey == "") {
        return;
      }
      if (menu) {
        this.$gxfmethod.statisticData(
          this.$eventId.Home_Fuction,
          menu.title,
          child.title
        );
      }
      if (child.type == "url" && child.url) {
        uni.setStorage({
          data: {
            id: child.url,
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.navigateTo({
              url: child.url + `?url=${child.url}&key=${child.id}`,
            });
          },
        });
      } else if (child.type == "tab-business") {
        uni.setStorage({
          data: {
            id: child.url,
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.switchTab({
              url: "/pages/main/business",
            });
          },
        });
        //TODO 发票就没有页面
        if (child.id == "invoiceManage") {
          uni.setStorage({
            data: {
              id: "0",
            },
            key: this.$savekey.MEMORY_STORAGE,
            success: () => {
              uni.switchTab({
                url: "/pages/main/business",
              });
            },
          });
        }
      } else if (child.type == "tab-device") {
        uni.switchTab({
          url: "/pages/main/map",
        });
      } else {
        uni.setStorage({
          data: {
            id: child.url,
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.switchTab({
              url: "/pages/main/business",
            });
          },
        });
      }
    },
    /*网络请求数据*/
    //获取所有菜单
    getAllMenus() {
      uni.showLoading();
      let param = {
        isApp: true,
      };
      this.$network
        .getData(this.$url.ALL_MENUS_URL, "GET", param)
        .then((result) => {
          console.log(result, 'result11111122222');
          this.setAllMenu(result);
          uni.setStorage({
            key: this.$savekey.MY_ALL_MENUS,
            data: result,
            success: () => { },
            fail: () => { },
          });
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //保存个人菜单
    saveAddAllMenus() {
      let obj = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      if (obj) {
        let userId = obj.id;
        let paramList = this.usemenus.map((o, index) => {
          return {
            sort: index,
            permissionId: o.id,
            userId: userId,
          };
        });
        this.$network
          .getData(this.$url.SAVE_ADD_MENUS_URL, "POST", paramList)
          .then((result) => {
            console.log(result, "result");
            if (result) {
              uni.setStorage({
                key: "mySaveMenus",
                data: result,
                success: function () {
                  console.log("success");
                },
              });
            }
            this.isEdit = !this.isEdit;
            uni.showToast({
              icon: "none",
              title: "配置完成",
            });
            setTimeout(() => {
              uni.$emit("refresh-home-menus");
            }, 100);
            uni.hideLoading();
          })
          .catch((err) => {
            uni.hideLoading();
          });
      } else {
        uni.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content-func {
  width: 100%;
  position: relative;
  background-color: $uni-bg-color-grey;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}
//搜索
.query-content-search {
  position: sticky;
  display: flex;
  background: #ffffff;
  width: 100%;
  z-index: 100;
  top: 0;
}
.query-content-search-zw {
  display: flex;
  background: #ffffff;
  width: 100%;
  z-index: 0;
}
.query-search-box-search {
  position: relative;
  display: flex;
  margin: 10px;
  flex: 1;
  padding: 8px 10px;
  flex-direction: row;
  border-radius: 5px;
  justify-content: flex-start;
  align-items: center;
  background: #f7f7f7;
}

.query-search-icon-search {
  font-size: 40rpx;
  color: #999999;
}
.email-icon-search {
  margin-left: 20px;
  font-size: 60rpx;
  color: #999999;
}
.query-search-content-search {
  display: flex;
  flex: 1;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  margin-right: 10px;
}
.input-style-search {
  flex: 1;
  font-size: $uni-font-size-base;
}
//功能
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px 0px 0px 0px;
  margin-top: 10px;
  padding: 0px 10px;
  background: #ffffff;
  // border-radius: 10px;
}
.menu-title-container {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  background: #ffffff;
}
.titleborder {
  border-bottom: #e9e9e9 1px solid;
}

.title-icon-view {
  font-size: $uni-font-size-base;
  text-align: center;
}

.title-view {
  flex: 1;
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
  font-weight: bold;
  margin-left: 8px;
}
.title-view-cente {
  flex: 1;
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
  font-weight: bold;
  margin-left: 8px;
  text-align: center;
}
.edit-style {
  position: absolute;
  right: 10px;
  padding: 3rpx 20rpx;
  border-radius: 5px;
  // background: $uni-color-primary;
  color: $uni-color-primary;
  font-size: 14px;
  border: $uni-color-primary 1px solid;
}
.menu-children-container {
  display: flex;
  flex-direction: row;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  background: #ffffff;
  overflow-y: hidden;
  padding-top: 10px;
}
.menu-children-item {
  position: relative;
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
  color: white;
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
  color: $uni-text-color;
  text-align: center;
}
.icon-delete {
  position: absolute;
  padding-left: 10px;
  padding-bottom: 10px;
  right: 0px;
  top: 0px;
  color: #fc0033;
  font-size: 28rpx;
}
.icon-add {
  position: absolute;
  padding-left: 10px;
  padding-bottom: 10px;
  right: 0px;
  top: 0px;
  color: #e60000;
  font-size: 28rpx;
}
</style>
