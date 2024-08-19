<template>
  <view class="change-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <moreQueryView
        :isExportList="false"
        @reset="reset"
        @query="query"
        @exportExcel="exportExcel"
      />
    </view>
    <list class="list-view">
      <cell v-for="(item, index) in datalist" :key="index">
        <businessItemFrame :stateName="getStateName(item)" :showAttachment="false">
          <block slot="title">
            <view style="display: flex; flex: 1; flex-direction: row">
              <text class="change-name" v-if="isChangeInfo(item, '1')">【改名】</text>
              <text
                >{{ item.customerName }}-{{
                  item.contractDetailDto.projectName || ""
                }}</text
              >
            </view>
          </block>
          <block slot="subContent">
            <view class="max-one-line">
              {{ item.changeNo }}&nbsp;|&nbsp;{{
                item.contractDetailDto.customerSalesmanName || "-"
              }}&nbsp;|&nbsp;{{ item.orgName || "-" }}
            </view>
          </block>
          <block slot="content">
            <view>
              <view
                class="row-line"
                style="
                  align-items: top;
                  text-align: center;
                  line-height: 20px;
                  margin-right: 2px;
                "
              >
                <view style="color: #999999; min-width: 60px"> 变更类型： </view>
                <view style="text-align: left; word-break: break-all">
                  {{ isChangeInfo(item, "1") ? "客户名称变更;" : "" }}
                  {{ isChangeInfo(item, "2") ? "设备信息变更;" : "" }}
                  {{ isChangeInfo(item, "3") ? "结算信息变更;" : "" }}
                  {{ isChangeInfo(item, "4") ? "项目信息变更;" : "" }}
                  {{ isChangeInfo(item, "5") ? "授权人信息变更;" : "" }}
                </view>
              </view>
              <view
                class="row-line"
                style="text-align: center; height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999; min-width: 60px">
                  变更日期：
                </view>
                {{ changestr(item.createTime) }}
              </view>
              <view
                class="row-line"
                style="text-align: center; height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999; min-width: 60px">
                  合同单号：
                </view>
                <text style="color: #e60000" @click.stop="gotoContractDetail(item)">{{
                  item.businessNo || "-"
                }}</text>
              </view>
            </view>
          </block>
          <block slot="options">
            <view class="row-line">
              <taskBtn :itemData="item" :isBorder="true" />
              <view
                class="option-btn"
                @click.stop="goToUpdate(item)"
                v-if="createBy === item.createBy && item.state === '0'"
                ><text>修改</text></view
              >
              <view class="option-btn" @click.stop="gotodetail(item)"
                ><text>详情</text></view
              >
            </view>
          </block>
        </businessItemFrame>
      </cell>
      <view>
        <uni-load-more iconType="auto" :status="morestatus" />
      </view>
    </list>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import { mapState } from "vuex";
export default {
  components: {
    uniLoadMore,
    taskBtn,
    moreQueryView,
    businessItemFrame,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "loading",
      searchKey: "",
      createBy: "",
      totalCount: "100",
      salesmanObj: {},
      orgIdList: [],
    };
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  created() {
    this.$gxfmethod.statisticData(
      this.$eventId.Contract_Administrative,
      "合同变更",
      "列表"
    );
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.createBy = res.data.id;
      },
    });
  },
  onLoad() {
    uni.showLoading();
    this.loaddata();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.currentpage = 1;
    this.datalist = [];
    this.loaddata();
  },
  //上拉加载
  onReachBottom() {
    if (this.morestatus == "noMore") {
      return;
    }
    this.currentpage += 1;
    this.morestatus = "loading";
    this.loaddata();
  },
  methods: {
    reset(val) {
      this.searchKey = "";
      this.orgIdList = [];
      this.salesmanObj = {};
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    query(val) {
      this.searchKey = val.contractName;
      this.orgIdList = val.orgIdList;
      this.salesmanObj = val.salesmanObj;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    headerrefresh() {
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    footerrefresh() {
      if (this.morestatus == "noMore") {
        return;
      }
      this.currentpage += 1;
      this.morestatus = "loading";
      this.loaddata();
    },
    loaddata() {
      let param = {
        current: this.currentpage,
        size: 5,
        contractName: this.searchKey,
        customerSalesman: this.salesmanObj.value != "" ? this.salesmanObj.value : null,
        orgIdList:
          this.orgIdList && this.orgIdList.length > 0 ? this.orgIdList : undefined,
      };
      this.$network
        .getData(this.$url.CONTRACT_CHANGE_PAGE, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          let pages = result.pages;
          if (pages <= this.currentpage) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          this.totalCount = result.total;
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    /**是否改名
     * @param {Object} item,
     * @param {String} value :需要比对的字段  1是客户变更，2是设备变更
     */
    isChangeInfo(item, value) {
      return item.changeMode && item.changeMode.some((o) => o === value);
    },
    getStateName(item) {
      if (
        item.state !== "0" &&
        item.state !== "1" &&
        item.state !== "3" &&
        item.state !== "9"
      ) {
        return "已完成";
      } else {
        return item.stateName ? item.stateName : "";
      }
    },
    goToAdd() {
      this.$gxfmethod.statisticData(
        this.$eventId.Contract_Administrative,
        "合同变更",
        "新增"
      );
      uni.navigateTo({
        url:
          "/businessPages/invoice/contract-choose?type=changeContract&state=5,6,7,8&contractType=1&title=选择变更合同&isFirst=true",
      });
    },
    gotodetail(item) {
      let businessNostr = item.businessNo;
      let url = "/contractPages/contract-change/contract-change-detail?id=" + item.id;
      uni.navigateTo({
        url: url,
      });
    },
    gotoContractDetail(item) {
      uni.navigateTo({
        url: "/contractPages/contract/contract-detail?businessNo=" + item.businessNo,
      });
    },
    goToUpdate(item) {
      uni.navigateTo({
        url:
          "/contractPages/contract-change/create-contract-change?isUpdate=1&item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&id=" +
          item.id,
      });
    },
    exportExcel() {
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      let param = {
        current: 1,
        size: this.totalCount,
        contractName: this.searchKey,
      };
      let url = this.$gxfmethod.getUrl(this.$url.CONTRACT_CHANGE_PAGE);
      console.log(url);
      let filename = this.$gxfmethod.getFileName("合同变更记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.change-list-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: calc(55px);
}

.change-name {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  white-space: nowrap;
}
</style>
