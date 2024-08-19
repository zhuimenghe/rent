<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <!-- <view class="top-container" v-if="tabList.length > 0">
		    <sun-tab
		    :value.sync="index" 
		    :tabList="tabList" 
		    activeColor="#E60000" 
		    :shownum="false" 
		    @change="indexchange" 
		    />
		</view> -->
    <!-- <view class="tab-content" v-if="tabList.length > 0"> -->
    <view v-if="curItem.id == 0">
      <subletapplylist ref="apply" :companyName="companyName" :companyId="companyId" :applyState="applyState" :checkedList="checkedList" />
    </view>
    <view v-if="curItem.id == 1">
      <subletpauselist ref="pause" :companyId="companyId" />
    </view>
    <view v-if="curItem.id == 2">
      <subletpaylist ref="pay" :companyId="companyId" :paymentState="paymentState" />
    </view>
    <view v-if="curItem.id == 3">
      <subletDevice ref="device" :companyId="companyId" :deviceState="deviceState" />
    </view>
    <!-- </view> -->
  </view>
</template>

<script>
import sunTab from "@/components/common/sun-tab/sun-tab.vue";
import subletapplylist from "./sublet-apply/sublet-apply-list.vue";
import subletpauselist from "./sublet-pause/sublet-pause-list.vue";
import subletpaylist from "./sublet-pay/sublet-pay-list.vue";
import subletDevice from "./sublet-apply/sublet-device/sublet-device-tab-list.vue";
export default {
  components: {
    sunTab,
    subletapplylist,
    subletpauselist,
    subletpaylist,
    subletDevice,
  },
  data() {
    return {
      index: null,
      curItem: {
        id: null,
        ref: null,
      },
      tabList: [],
      tabObjs: [],
      checkedList: [],
      companyName: "",
      companyId: "",
      deviceState: {},
      paymentState: {},
      applyState: {}
    };
  },
  onPullDownRefresh() {
    let refstr = this.curItem.ref;
    this.$refs[refstr].headerrefresh();
  },
  onReachBottom() {
    let refstr = this.curItem.ref;
    this.$refs[refstr].footerrefresh();
  },
  methods: {
    indexchange(e) {
      this.index = e.index;
      this.curItem = this.tabObjs[this.index];
    },
    // #ifdef WEB
    parseOptions(optionsString) {
      // 第一步：解析出真正的URL部分
      const urlStart = optionsString.indexOf("url=");
      if (urlStart === -1) {
        return {};
      }
      const actualUrl = optionsString.substring(urlStart + 4); // "url="长度为4

      // 第二步：从URL中解析查询参数
      const urlParts = actualUrl.split("?");
      if (urlParts.length < 2) {
        return {};
      }
      const queryParamsString = urlParts[1];
      const queryParams = new URLSearchParams(queryParamsString);
      const params = {};

      queryParams.forEach((value, key) => {
        params[key] = value;
      });

      return params;
    },
    // #endif
  },

  onLoad(options) {
    this.deviceState = options.deviceState ? JSON.parse(options.deviceState) : {};
    this.paymentState = options.paymentState ? JSON.parse(options.paymentState) : {};
    this.applyState = options.applyState ? JSON.parse(options.applyState) : {};
    this.checkedList = options.checkedList ? JSON.parse(decodeURIComponent(options.checkedList)) : [];
    this.companyName = options.companyName ? options.companyName : "";
    this.companyId = options.companyId ? options.companyId : "";
    this.tabObjs = [
      {
        name: "转租申请",
        id: 0,
        key: this.$savekey.PERMISSION_SUBLET_APPLY,
        ref: "apply",
      },
      {
        name: "转租报停",
        id: 1,
        key: this.$savekey.PERMISSION_SUBLET_PAUSE,
        ref: "pause",
      },
      {
        name: (this.paymentState.batchEditMode == "payable") ? "付款" : "转租应付",
        id: 2,
        key: this.$savekey.PERMISSION_SUBLET_PAY,
        ref: "pay",
      },
      {
        name: (this.deviceState.batchEditMode == "return") ? "还租" : "转租设备",
        id: 3,
        key: this.$savekey.PERMISSION_SUBLET_DEVICE,
        ref: "device",
      },
    ];
    // uni.getStorage({
    // 	key: this.$savekey.USER_PRIVILEGES_MEG,
    // 	success: (res) => {
    // 		this.tabObjs = this.tabObjs.filter(o => {
    // 			return !o.key || res.data.some(x => x.value === o.key)
    // 		})
    // 		this.tabList = this.tabObjs.map(o => {
    // 			return o.name
    // 		})
    // 		if (this.tabObjs.length > 0) {
    // 			this.curItem = this.tabObjs[this.index];
    // 		}
    // 	}
    // })
    uni.$on("refresh-sublet-list", (obj) => {
      let refstr = this.curItem.ref;
      this.$refs[refstr].headerrefresh();
    });
    uni.$on("refresh-maintain", () => {
      let refstr = this.curItem.ref;
      this.$refs[refstr].headerrefresh();
    });

    // #ifdef WEB
    // options = this.parseOptions(options.index);
    this.index = options.index ? Number(options.index) : 0;
    // #endif
    // #ifdef MP-WEIXIN
    this.index = options.index ? Number(options.index) : 0;
    // #endif


    this.curItem = this.tabObjs[this.index];
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: this.curItem.name,
      });
    }, 50);
  },
  onUnload() {
    uni.$off("refresh-sublet-list");
    uni.$off("refresh-maintain");
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.top-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 500;
}

.empty {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  margin-top: 50px;
}
</style>
