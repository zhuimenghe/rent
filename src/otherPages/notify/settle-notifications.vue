<template>
  <view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view">
      <moreQueryView :showFilterBtn="false" :isExportList="false" hint="标题" :isQueryOrg="false" @reset="reset" @query="query"
         :isQueryTime="false" :isQueryEsign="false" />
    </view>
    <view class="list-view">
      <view class="settle-item" v-for="(item,index) in datalist" :key="index">
        <view class="settle-item-title">
          {{ item.projectName||'-' }}
        </view>
        <view class="settle-item-content">
          <view class="first">
              <view class="settle-item-label">结算方式：</view>
              <view class="settle-item-context">{{getPaymentType(item)}}</view>
          </view>
          <!-- <view class="first">
              <view class="settle-item-label">结算周期：</view>
              <view class="settle-item-context">{{
              item.settlementBeginDate
                ? item.settlementBeginDate.split(" ")[0]
                : ""
            }}-{{
              item.settlementEndDate ? item.settlementEndDate.split(" ")[0] : ""
            }}</view>
          </view> -->
          <view class="first">
              <view class="settle-item-label">接收时间：</view>
              <view class="settle-item-context">{{ item.remindDate||'-' }}</view>
          </view>
          <view class="contract" @click="gotoContract(item)">
              <view class="settle-item-label ">合同单号：</view>
              <view class="settle-item-context text-danger">{{item.contractNo||'-'}}</view>
          </view>
        </view>
        <view class="t-bottom"
          ><view class="option-view" @click="dealBusiness(item)">处理</view></view
        >
      </view>
      <view><uni-load-more iconType="auto" :status="morestatus" /></view>
    </view>

    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
      ref="date" themeColor="#E60000" />
    <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import { mapState } from "vuex";

export default {
  name: 'settle-notifications',
  components: {
    uniLoadMore,
    moreQueryView,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "loading",
      searchKey: "",
      applyDate: "",
      startTime: "", //筛选的开始时间
      endTime: "", //筛选的结束时间
      pickType: "",
      selectList: [],
      isshow: false,
      isShowAddBusiness: true,
      isShowAddService: true,
      createBy: "",
      isExportList: true,
      totalCount: "100",
      salesmanObj: {},
      esignStatusObj: {},
      orgObj: {},
      claimTypes: [
        {
          label: "新建业务索赔",
          value: "business",
        },
        {
          label: "新建服务索赔",
          value: "service",
        },
      ],
    };
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
		...mapState('system', ['navBarHeight'])

  },
  mounted() {
    this.loaddata();
  },
  onPullDownRefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
  onReachBottom() {
        if (this.morestatus == 'noMore') {
            return;
        }
        this.currentpage += 1;
        this.morestatus = 'loading';
        this.loaddata();
    },
  methods: {
   async dealBusiness(row){
      let param = {
        contractNo:row.contractNo
      };
     await this.$network.getData(this.$url.SETTLE_REMIND_DEAL, 'GET', param)
     uni.redirectTo({
        url: `/businessPages/settledown/settle-add?contracts=${row.contractNo}&customerId=${row.customerId} `,
      });

    },
    gotoContract(row){
      if(!row.contractNo)return;
      uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + row.contractNo
				});
    },
    getPaymentType(row) {
      let info = {
        1: "退场付清",
        2: "月结",
        3: "预付",
        4: "先预付后月结",
        5: "设备退场结清欠款",
        6: "季结",
        7: "双月结",
      };
      return info[row.paymentType] || "-";
    },
    reset(val) {
      this.searchKey = "";
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    query(val) {
      this.searchKey = val.contractName;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    loaddata() {
      let param = {
        current: this.currentpage,
        size: 5,
        projectName: this.searchKey,
        state:0
      };
      // uni.showLoading();
      this.$network.getData(this.$url.SETTLE_REMIND_PAGE, 'POST', param).then(result => {
        let res = result && result.records && result.records.length > 0 ? result.records : [];
        this.datalist = this.datalist.concat(res);
        let pages = result.pages;
        this.$store.commit("user/setState", {
          settleTodoCount: parseInt(result.total)
          });
        if (pages <= this.currentpage) {
          this.morestatus = 'noMore';
        } else {
          this.morestatus = 'more';
        }
        // uni.hideLoading();
        uni.stopPullDownRefresh();
      })
        .catch(err => {
          // uni.hideLoading();
          this.morestatus = 'noMore';
          uni.stopPullDownRefresh();
        });
    },
    goToAdd() {
      this.pickType = "create";
      this.selectList = this.claimTypes ? this.claimTypes : [];
      this.$refs.selector.show();
    },
    goToLastAdd() {
      let key = this.$savekey.LAST_CREATE_TYPE + "_claim_" + this.$datestr.getUserId();
      let lastAddId = uni.getStorageSync(key);
      if (lastAddId) {
        this.addClaim(lastAddId);
      } else {
        this.addClaim("business");
      }
    },
    addClaim(type) {
      this.$gxfmethod.statisticData(
        this.$eventId.Contract_Cxecute,
        "索赔管理",
        "新增索赔"
      );
      if (type == "business") {
        uni.navigateTo({
          url:
            "/businessPages/invoice/contract-choose?type=claim&state=6,7,8&title=选择索赔合同&isFirst=true",
        });
      } else if (type == "service") {
        uni.navigateTo({
          url: "/businessPages/claim/create-claim-service",
        });
      }
    },
    goTo(type, item) {
      switch (type) {
        case "detail":
          let url = "/businessPages/claim/claim-detail?businessNo=" + item.businessNo;
          uni.navigateTo({
            url: url,
          });
          break;
        case "adjust":
          uni.showLoading();
          let urlss = this.$url.CLAIM_MACHINE_CHECK + item.businessNo;
          this.$network
            .getData(urlss, "GET", null)
            .then((result) => {
              uni.navigateTo({
                url:
                  "/businessPages/claim/creat-claim?isAdjust=true&businessNo=" +
                  item.businessNo,
              });
              uni.hideLoading();
            })
            .catch((err) => {
              uni.showToast({
                icon: "none",
                title: err.message,
              });
            });
          break;
        case "update":
          if (item.category === "service") {
            uni.navigateTo({
              url:
                "/businessPages/claim/create-claim-service?isUpdate=1&item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          } else {
            uni.navigateTo({
              url:
                "/businessPages/claim/creat-claim?isUpdate=1&item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          }
          break;
        default:
          break;
      }
    },
    showPick(type) {
      this.pickType = type;
      switch (type) {
        case "startTime":
          this.$refs.date.show();
          break;
        case "endTime":
          this.$refs.date.show();
          break;
        default:
          break;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.text-danger{
  color: #e60000;
}
.t-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.option-view {
  color: $uni-color-primary;
  font-size: 32rpx;
  border:1rpx solid $uni-color-primary ;
    width: 120rpx;
  height: 65rpx;
  border-radius: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 23rpx;
}
//背景视图
.claim-list-bg {
  width: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: calc(47px);

  .settle-item {
    padding: 24rpx;
    background-color: #fff;
    margin-top: 24rpx;

    .settle-item-title {
      font-weight: 500;
      font-size: 32rpx;
      color: #222222;
      line-height: 45rpx;
    }
  }

  .settle-item-content {
    background: #F6F6F6;
    border-radius: 6rpx;
    margin-top: 23rpx;
    padding:22rpx 20rpx;
    view{
      display: flex;
      flex-direction: row;
      &.first{
      margin-bottom: 17rpx;
      }
    }
  }
}
.contract{
  margin-top: 17rpx;
}
//顶部时间
.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  left: 0px;
  top: 0px;
  margin-bottom: 1px;
  background: #ffffff;
}
</style>