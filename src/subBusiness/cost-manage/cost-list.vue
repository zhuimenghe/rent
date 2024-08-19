<template>
  <view class="cost-list">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <moreQueryView :isClear="true" :isDownLoad="true" :isExportList="false" :isQueryOrg="false" :isQueryState="false" :isQueryTime="true" hint="合同名称" @reset="reset" @query="query"
        @exportExcel="exportExcel" />

    </view>
    <view class="list-view">
      <view>
        <businessItemFrame :attachIconShow="true" v-for="(item, index) in datalist" :key="index" @click="gotodetail(item)" :stateName="item.stateName || ''" :showAttachment="true"
          :attachmentNum="item.fileListNum ? item.fileListNum : 0" @addPic="goImg(item)">
          <block slot="title" class="title">
            <view>{{ item.customerName || "" }}-{{ item.projectName || "" }}</view>
          </block>
          <block slot="subContent">
            <view class="max-one-line">
              {{ item.businessNo }}&nbsp;|&nbsp;业务负责人：{{
                item.customerSalesmanName || "-"
              }}&nbsp;|&nbsp;{{ item.orgName || "-" }}
            </view>
          </block>
          <block slot="content">
            <view class="content">
              <view class="row-line">
                <view class="row-line row-line1">
                  <text class="label">
                    支出日期：
                    <text class="value">
                      {{
                        changestr(item.payDate)
                      }}
                    </text>
                  </text>
                  <text class="label" style="margin-left: 15px">
                    支出人：
                    <text class="value">{{ item.payUserName || "-" }}</text>
                  </text>
                </view>
              </view>
              <view class="row-line" style="text-align: center; height: 20px; margin-right: 2px">
                <view class="row-line row-line1" style="color: #999999">
                  <text class="label">支出金额：</text>
                  <text class="value">
                    ￥{{
                      saveTwo(item.total) !== "0.00"
                      ? saveTwo(item.totalRentalPay)
                      : item.state === "1"
                        ? "--"
                        : "0.00"
                    }}
                  </text>
                </view>
              </view>
            </view>
          </block>
          <block slot="options">
            <view class="row-line">
              <taskBtn :itemData="item" :isBorder="true" />
              <view class="option-btn" @click.stop="editCreate(item)" v-if="ishowupdata(item)">修改</view>
              <view class="option-btn" @click.stop="gotodetail(item)">详情</view>
            </view>
          </block>
        </businessItemFrame>
      </view>

      <view>
        <uni-load-more iconType="auto" :status="morestatus" />
      </view>
    </view>
    <!-- <view class="add-icon" @click="createCost">
      <view class="line horizontal"></view>
      <view class="line vertical"></view>
    </view> -->
  </view>
</template>

<script>
import { mapState } from "vuex";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";

export default {
  name: "CostList",
  data() {
    return {
      startTime: null, //筛选的开始时间
      endTime: null, //筛选的结束时间
      totalCount: "100",
      currentpage: 1,
      pageSize: 10,
      searchKey: "",
      typeObj: {},
      datalist: [],
      salesmanlist: [],
      salesmanObj: {
        label: "业务负责人",
        value: "",
        typeList: []
      },
      morestatus: "loading", //loading
      userid: "901"
    };
  },
  watch: {
    searchKey(val) {
      this.loaddata();
    }
  },
  computed: {
    ...mapState("system", {
      posTop: s => s.statusBarHeight + s.titleBarHeight
    })
  },
  created(option) {
    console.log(this.posTop, 'posTop');
    this.loaddata();
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.userid = res.data.id;
      }
    });
  },

  methods: {
    async loaddata() {
      let self = this;
      let param = {
        current: self.currentpage,
        size: self.pageSize,
        contractName: this.searchKey ? this.searchKey : undefined,
        customerSalesman:
          this.salesmanObj && this.salesmanObj.value
            ? this.salesmanObj.value
            : undefined,
        payDateEnd: this.endTime ? this.endTime + " 23:59:59" : null,
        payDateStart: this.startTime ? this.startTime + " 00:00:00" : null
      };
      let res = await this.$network.costList(param);
      this.datalist = this.datalist.concat(res.records);
      this.totalCount = res.records.length || 100;
      if (res.records < self.pageSize) {
        this.morestatus = "noMore";
      } else {
        this.morestatus = "more";
      }
    },
    //其他页面跳转过来调用
    costSettle(contractName, customerSalesman, payDateStart, payDateEnd) {
      setTimeout(() => {
        uni.$emit("business-query-notify", {
          contractName: contractName,
          customerSalesman: customerSalesman,
          payDateStart: payDateStart,
          payDateEnd: payDateEnd
        });
        this.searchKey = contractName;
        this.customerSalesman.label = customerSalesman.label;
        this.customerSalesman.value = customerSalesman.value;
        this.startTime = payDateStart;
        this.endTime = payDateEnd;
        this.headerrefresh();
      }, 100);
    },
    footerrefresh() {
      this.$datestr.printlog("onReachBottom==" + this.morestatus);
      if (this.morestatus == "noMore") {
        return;
      }
      this.morestatus = 'loading';
      this.currentpage += 1;
      this.loaddata();
    },
    goToAdd() {
      this.$gxfmethod.statisticData(
        this.$eventId.Settle_Administrative,
        "成本管理",
        "新增成本"
      );
      uni.navigateTo({
        url:
          "/businessPages/invoice/contract-choose?type=cost&state=5,6,7,8&title=选择合同&isFirst=true"
      });
    },
    goImg(item) {
      let isedit = true;
      if (item.canUploadFile == "0") {
        isedit = false;
      } else {
        isedit = true;
      }
      uni.navigateTo({
        url:
          "../../components/common/image-upload/upload_zb_apendix?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&isedit=" +
          isedit +
          "&type=contractapi" +
          "&filetype=cost_type"
      });
    },
    editCreate(item) {
      uni.navigateTo({
        url:
          "/businessPages/cost-manage/create-cost?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&backType=2"
      });
    },

    gotodetail(item) {
      let businessNostr = item.businessNo;
      // let businessKey = item.businessKey;
      let url =
        "/businessPages/cost-manage/cost-detail?businessNo=" + businessNostr;
      uni.navigateTo({
        url: url
      });
    },
    iscreator(item) {
      if (item.createBy === this.userid) {
        return true;
      } else {
        return false;
      }
    },
    ishowupdata(item) {
      return this.iscreator(item) && (item.state === "0" || item.state === "3");
    },
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    showPick(type) {
      this.picktype = type;
      switch (type) {
        case "salesman":
          this.selectList = this.salesmanlist;
          break;
        case "org":
          this.selectList = this.orgList;
          break;
        default:
          break;
      }
      this.$refs.selector.show();
    },
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },

    //加载业务负责人
    loadOwnerList() {
      let param = {
        showAdmin: false,
        roleType: this.$savekey.USER_ROLE_BUSINESS
      };
      // uni.showLoading();
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then(result => {
          this.salesmanlist = [];
          this.salesmanlist.push({
            label: "全部",
            value: "-1"
          });
          this.salesmanlist = this.salesmanlist.concat(
            result
              ? result.map(dict => {
                return {
                  label: dict.username,
                  value: dict.id
                };
              })
              : []
          );
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
        });
    },
    query(val) {
      console.log(val, "query");
      this.searchKey = val.contractName;
      this.typeObj = val.customObj;
      this.salesmanObj = val.salesmanObj;
      this.startTime = val.startDate;
      this.endTime = val.endDate;
      this.headerrefresh();
    },

    //加载统计数据
    headerrefresh() {
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    reset(val) {
      this.searchKey = "";
      this.typeObj = {};
      this.startTime = null;
      this.endTime = null;
      this.salesmanObj = {};
      this.headerrefresh();
    },
    exportExcel() {
      uni.showLoading({
        title: '正在下载中,请稍等...',
        mask: true,
      })
      let param = {
        current: 1,
        size: this.totalCount,
        contractName: this.searchKey ? this.searchKey : undefined,
        customerSalesman:
          this.salesmanObj && this.salesmanObj.value
            ? this.salesmanObj.value
            : undefined,
        payDateEnd: this.endTime ? this.endTime + " 23:59:59" : null,
        payDateStart: this.startTime ? this.startTime + " 00:00:00" : null
      };
      let url = this.$gxfmethod.getUrl(this.$url.COST_LIST);
      let filename = this.$gxfmethod.getFileName("成本列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    }
  },
  components: { moreQueryView, businessItemFrame, taskBtn }
};
</script>

<style lang="scss" scoped>
.add-icon {
  width: 96rpx;
  height: 96rpx;
  background: #f08200;
  border-radius: 50%;
  position: fixed;
  right: 44rpx;
  bottom: 260rpx;

  // box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.2);
  .line {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    width: 5rpx;
    height: 44rpx;
    background: #ffffff;
  }

  .horizontal {
    // transform: translateY(-25%) !important;
    top: 25%;
    transform: rotate(90deg);
  }
}

::v-deep .query-search-box {
  height: 32px !important;
  line-height: 32px;
  margin: 8rpx !important;
}

::v-deep .query-search-icon {
  font-size: 16px;
}

.option-btn {
  // width: 124rpx;
  // height: 72rpx;
  border-radius: 36rpx;
  font-size: 16px;
  text-align: center;
  padding: 3px 12px;
  border: 1px solid $uni-color-primary;
}

.btn-row {
  position: relative;
  z-index: 1;
}

.row-line {
  line-height: $uni-spacing-row-xl;
}

.row-line1 {
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-bottom: 10px;
}

.value {
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
}

::v-deep .query-more-css {
  font-size: 30rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  margin-right: 0;
  padding-right: 0;
}

::v-deep .state-view {
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200 !important;
}

::v-deep .row-line {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c !important;
  font-size: $uni-font-size-base;
}

::v-deep .c-title {
  overflow: hidden;
  min-height: 0;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  font-size: $uni-font-size-lg;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 550;
  color: #222222;
  margin-bottom: 2px;
}

.title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  min-height: 0;
}

//背景视图
.cost-list {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.frame-container {
  margin: 12px 0 0 0;
  border-radius: 0;
  padding: $uni-spacing-col-lg;
}


.filter-view {
  display: flex;
  width: 100%;
  flex-direction: row;
  background-color: #ffffff;
  padding: 10px 0px;
  align-items: center;
  justify-content: flex-start;
  font-size: $uni-font-size-base;
}

.content {
  margin: 0 0 0 8rpx;
  padding: 0px !important;
}

.title {
  font-weight: 600;
}

.select-view-top {
  width: 50% !important;
}

.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;

}

//列表
.list-view {
  position: relative;
  z-index: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: calc(55px);
}

::v-deep .attacment-style {
  font-size: 14px !important;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  padding: 4px 0;
  color: $uni-color-primary !important;
}
</style>
