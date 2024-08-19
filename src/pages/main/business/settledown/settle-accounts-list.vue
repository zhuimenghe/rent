<template>
  <view class="list-bg">
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <moreQueryView
        :isDownLoad="true"
        :isExportList="false"
        hint="客户名称/项目名称"
        :isQueryOrg="false"
        :isQueryState="false"
        :isQueryTime="true"
        :isQueryEsign="true"
        :isQueryCustom="true"
        :customList="debtTypeList"
        customHint="结算应收"
        @reset="reset"
        @query="query"
        @exportExcel="exportExcel"
        :draft="true"
      />
    </view>
    <list class="list-view">
      <cell v-for="(item, index) in datalist" :key="index">
        <businessItemFrame
          bgcolor="#fff"
          :stateName="item.stateName || ''"
          :showAttachment="false"
          @click.native="gotodetailTo(item)"
          margin="8px 0"
          padding="0"
        >
          <block slot="title">
            <view>{{ item.customerName || "--" }}</view>
          </block>
          <block slot="subContent">
            <view class="max-one-line">
              {{ item.businessNo }}
              &nbsp;|&nbsp;
              {{ item.customerSalesmanName || "-" }}
              &nbsp;| &nbsp;
              {{ item.orgName || "-" }}
            </view>
          </block>
          <block slot="content">
            <view>
              <view
                class="row-line"
                style="text-align: center; height: 28px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999">
                  结算周期： {{ changestr(item.beginDate) }}~{{ changestr(item.endDate) }}
                </view>
              </view>
              <view class="row-line" style="height: 28px; margin-right: 2px">
                <view class="row-line" style="color: #999999; width: 100%">
                  <view class="text-gray flex-1 row-line">
                    结算维度： {{ item.type == "2" ? "合同" : "客户" }}
                  </view>
                  <view class="text-gray flex-1 row-line">
                    签署状态： {{ item.flowStatus | esignStatusName }}
                  </view>
                </view>
              </view>
              <view class="row-line" style="height: 28px; margin-right: 2px">
                <view class="row-line" style="color: #999999; width: 100%">
                  <view class="text-gray flex-1 row-line">
                    上期应收
                    <businessTips tips="本期结算之前的累计应收" />： ￥
                    {{ saveTwo(item.lastDebt) }}
                  </view>
                  <view class="text-gray flex-1 row-line">
                    当期营收
                    <businessTips tipName="curSettleRevenue" />： ￥
                    {{ saveTwo(item.settlementReceive ? item.settlementReceive : 0) }}
                  </view>
                </view>
              </view>
              <view class="row-line" style="height: 28px; margin-right: 2px">
                <view class="row-line" style="color: #999999; width: 100%">
                  <view class="text-gray flex-1 row-line">
                    当期收款
                    <businessTips tipName="settleEarning" />： ￥
                    {{ saveTwo(item.periodReceipt ? item.periodReceipt : 0) }}
                  </view>
                  <view class="text-gray flex-1 row-line">
                    当期应收
                    <businessTips tipName="settleDebt" />： ￥
                    {{ saveTwo(item.periodReceive ? item.periodReceive : 0) }}
                  </view>
                </view>
              </view>

              <view class="row-line" style="height: 28px; margin-right: 2px">
                <view class="row-line" style="color: #999999; width: 100%">
                  <view class="text-gray flex-1 row-line">
                    结算应收
                    <businessTips tipName="settleReceivable" />：￥
                    {{ saveTwo(item.settlement) }}
                  </view>
                  <view class="text-gray flex-1 row-line">
                    结算营收
                    <businessTips tipName="settleRevenue" />： ￥
                    {{ saveTwo(item.allSettlementTotal ? item.allSettlementTotal : 0) }}
                  </view>
                </view>
              </view>
              <view
                class="row-line"
                style="text-align: center; height: 28px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999">
                  实收
                  <businessTips tips="截止到本次结算的累计收款总额" />： ￥
                  {{ saveTwo(item.receipt ? item.receipt : 0) }}
                </view>
              </view>
            </view>
          </block>
          <block slot="options">
            <view class="row-line">
              <taskBtn :itemData="item" :isBorder="true" />
              <view class="option-btn" @click.stop="gotodetail(item)" v-if="isDownload">
                查看报表
              </view>
              <!-- item.contractState是合同状态，在已结清和已归档不显示删除、修改 -->
              <view
                class="option-btn"
                @click.stop="deleteSettlement(item)"
                v-if="
                  checkAllPermissions(['settlementDelete']) &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
              >
                删除
              </view>
              <!-- <view class="option-btn" @click.stop="gotodetailTo(item)">详情</view> -->
            </view>
          </block>
        </businessItemFrame>
      </cell>
      <view>
        <uni-load-more iconType="auto" :status="morestatus" />
      </view>
    </list>

    <view class="add-device" @click="gotoDetial(), goToAdd()">
      <text class="iconfont iconadd"></text>
    </view>
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
  </view>
</template>

<script>
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import {
  checkAllPermissions,
  showToast,
} from "@/common/business-method/common-method/util.js";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
import { mapState } from "vuex";

export default {
  components: {
    uniLoadMore,
    taskBtn,
    moreQueryView,
    businessItemFrame,
    sanyPopup,
  },
  data() {
    return {
      currentpage: 1,
      datalist: [],
      morestatus: "loading",
      searchKey: "",
      startTime: "", //筛选的开始时间
      endTime: "", //筛选的结束时间
      downloadTask: null,
      isDownload: true,
      totalCount: "100",
      salesmanObj: {},
      debtTypeObj: {},
      esignStatusObj: {},
      debtTypeList: [
        {
          label: "结算应收>0",
          value: "1",
        },
        {
          label: "结算应收=0",
          value: "2",
        },
        {
          label: "结算应收<0",
          value: "3",
        },
      ],
    };
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  mounted() {
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isDownload = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_EXPORT_SETTLEMENT
        );
      },
    });
    uni.showLoading();
    this.loaddata();
  },
  created() {
    this.$gxfmethod.statisticData(
      this.$eventId.Settle_Administrative,
      "灵活结算",
      "结算单记录列表"
    );
  },

  methods: {
    checkAllPermissions,
    // 定义一个方法来处理删除结算的操作
    deleteSettlement(item) {
      // 替换URL中的占位符
      let checkUrl = this.$url.SETTLEMENT_DELETE_CHECK.replace(
        /{businessNo}/,
        item.businessNo
      );

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", {})
        .then((checkRes) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("删除失败", message);
          } else {
            // 检查通过，请求用户确认是否删除
            this.showModal(
              "删除确认",
              "注意：您将删除当前结算单，该操作不可恢复,该操作执行后立即生效。",
              true,
              () => {
                // 用户确认删除，执行删除操作
                this.performDelete(item.businessNo);
              }
            );
          }
        })
        .catch((err) => {
          this.showToast(err);
        });
    },

    // 定义一个方法来显示模态框
    showModal(title, content, isConfirm = false, onConfirm = null) {
      this.$emit("popShow");
      this.$refs.sanyPop.showModal({
        title,
        content,
        confirmButtonName: isConfirm ? "删除" : undefined,
        cancelButtonName: "关闭",
        confirmButtonStyle: isConfirm ? "primary" : undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm && onConfirm) {
            onConfirm();
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
        },
      });
    },
    popClose() {
      this.$emit("popClose");
    },
    // 定义一个方法来执行删除操作
    performDelete(businessNo) {
      let deleteUrl = this.$url.SETTLEMENT_DELETE.replace(/{businessNo}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.headerrefresh(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },
    reset(val) {
      this.searchKey = "";
      this.salesmanObj = {};
      this.esignStatusObj = {};
      this.currentpage = 1;
      this.startTime = "";
      this.endTime = "";
      this.datalist = [];
      this.debtTypeObj = {};
      this.loaddata();
    },
    gotoDetial() {
      uni.navigateTo({
        url:
          "/businessPages/invoice/contract-choose-settle?title=新增结算合同&type=settle&&isFirst=true",
      });
    },
    goToAdd() {
      uni.navigateTo({
        url:
          "/businessPages/invoice/contract-choose-settle?title=新增结算合同&type=settle&&isFirst=true",
      });
    },
    query(val) {
      console.log(val);
      this.searchKey = val.contractName;
      this.startTime = val.startDate;
      this.endTime = val.endDate;
      this.salesmanObj = val.salesmanObj;
      this.debtTypeObj = val.customObj;
      this.esignStatusObj = val.esignStatusObj;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    //其他页面跳转过来调用
    businessSettle(contractName, salesmanObj, beginDate, endDate) {
      setTimeout(() => {
        uni.$emit("business-query-notify", {
          contractName: contractName,
          salesmanObj: salesmanObj,
          startDate: beginDate,
          endDate: endDate,
        });
        this.searchKey = contractName;
        this.salesmanObj.label = salesmanObj.label;
        this.salesmanObj.value = salesmanObj.value;
        this.startTime = beginDate;
        this.endTime = endDate;
        this.headerrefresh();
      }, 100);
    },
    getProjectName(item) {
      if (
        item &&
        item.settleInfoDto &&
        item.settleInfoDto.contractReceivableList &&
        item.settleInfoDto.contractReceivableList.length > 0
      ) {
        let nameList = item.settleInfoDto.contractReceivableList.map((o) => {
          return o.projectName;
        });
        return nameList.join(",");
      }
      return "--";
    },
    hide() {
      if (this.downloadTask) {
        this.downloadTask.abort();
      }
    },
    changestr(str) {
      if (!str) {
        return "";
      }
      return str.split(" ")[0];
    },
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
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
        size: 10,
        fuzzyParam: this.searchKey,
        customerSalesman:
          this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
        beginDate: this.startTime ? this.startTime + " 00:00:00" : undefined,
        endDate: this.endTime ? this.endTime + " 23:59:59" : undefined,
        debtType:
          this.debtTypeObj && this.debtTypeObj.value ? this.debtTypeObj.value : undefined,
        flowStatus: this.esignStatusObj.value,
      };
      this.$network
        .getData(this.$url.SETTLE_LIST_ACCOUNT, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(
            result && result.records
              ? result.records.map((o) => {
                  let receivable =
                    o.settleInfoDto &&
                    o.settleInfoDto.receivable &&
                    o.settleInfoDto.receivable.total
                      ? Number(o.settleInfoDto.receivable.total)
                      : 0;
                  let settleTotal =
                    o.settleInfoDto && o.settleInfoDto.settleTotal
                      ? Number(o.settleInfoDto.settleTotal)
                      : 0;

                  let lastTotal =
                    (o.total ? Number(o.total) : 0) -
                    (o.periodTotal ? Number(o.periodTotal) : 0);
                  return {
                    ...o,
                    settleRevenue: receivable + settleTotal,
                    lastTotal: lastTotal,
                  };
                })
              : []
          );
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
    gotodetail(item) {
      uni.showLoading();
      this.$network.rentalPag(
        "settlement",
        () => {
          this.downM(item);
        },
        (msg) => {
          console.log("失败");
          uni.showToast({
            icon: "none",
            title: msg,
          });
        }
      );
    },
    downM(item) {
      let url =
        this.$url.BASE_URL +
        "settleapi/api/settlement/export?businessNo=" +
        item.businessNo;
      let name = "结算单-" + item.customerName + "-";
      let filename = this.$gxfmethod.getFileName(name);
      this.$gxfmethod.downFunc(url, "GET", undefined, filename);
    },
    gotodetailTo(item) {
      let url = "/businessPages/settledown/settle-detail?businessNo=" + item.businessNo;
      if (item.type == "1") {
        //客户维度结算详情，晨瑀和朱所说不做，用老的
        url =
          "/businessPages/settledown/settle-detail-customer?businessNo=" +
          item.businessNo;
      }
      uni.navigateTo({
        url: url,
      });
    },
    exportExcel() {
      this.$gxfmethod.statisticData(
        this.$eventId.Settle_Administrative,
        "灵活结算",
        "结算单记录导出"
      );
      uni.showLoading({
        title: "正在下载中,请稍等...",
        mask: true,
      });
      let param = {
        fuzzyParam: this.searchKey,
        beginDate: this.startTime != "" ? this.startTime + " 00:00:00" : undefined,
        endDate: this.endTime != "" ? this.endTime + " 23:59:59" : undefined,
        customerSalesman:
          this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
      };
      let url = this.$url.BASE_URL + "settleapi/api/settlement/list/export";
      console.log(url);
      let filename = this.$gxfmethod.getFileName("结算列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
  display: flex;
  flex: 1;
  width: 100%;
  background: $uni-bg-color-grey;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: calc(55px);
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

.add-device {
  width: 96rpx;
  height: 96rpx;
  background: #f08200;
  box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.2);
  @include flex(row, center, center);
  border-radius: 100%;
  color: $uni-text-color-inverse;
  position: fixed;
  right: 44rpx;
  bottom: 136px;

  .iconfont {
    font-size: 48rpx;
  }
}
</style>
