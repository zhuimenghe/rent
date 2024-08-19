<template>
  <view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <moreQueryView
        :isExportList="false"
        :isQueryOrg="false"
        @reset="reset"
        @query="query"
        @exportExcel="exportExcel"
        :isQueryTime="true"
        :isQueryEsign="true"
      />
    </view>
    <list class="list-view">
      <cell v-for="(item, index) in datalist" :key="index">
        <businessItemFrame
          :stateName="item.stateName || ''"
          :showAttachment="true"
          :attachmentNum="item.fileListNum ? item.fileListNum : 0"
          @addPic="goImg(item)"
        >
          <block slot="title">
            <view>{{ item.customerName || "" }}-{{ item.projectName || "" }}</view>
          </block>
          <block slot="subContent">
            <view class="max-one-line">
              {{ item.businessNo }}&nbsp;|&nbsp;{{
                item.customerSalesmanName || "-"
              }}&nbsp;|&nbsp;{{ item.claimMachineList.length || "0" }}台&nbsp;|&nbsp;{{
                item.orgName || "-"
              }}
            </view>
          </block>
          <block slot="content">
            <view>
              <view
                class="row-line"
                style="text-align: center; height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 索赔金额： </view>
                ￥{{ formatMoney(item.total) }}
              </view>
              <view
                class="row-line"
                style="text-align: center; height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 索赔日期： </view>
                {{ getDate(item.claimDate) || "-" }}
              </view>
              <view
                class="row-line"
                style="text-align: center; height: 20px; margin-right: 2px"
              >
                <view class="row-line" style="color: #999999"> 电签状态： </view>
                {{ item.flowStatus | esignStatusName }}
              </view>
            </view>
          </block>
          <block slot="options">
            <view class="row-line">
              <taskBtn :itemData="item" :isBorder="true" />
              <view
                class="option-btn"
                @click.stop="goTo('update', item)"
                v-if="createBy === item.createBy && item.state === '0'"
                >修改</view
              >
              <view
                class="option-btn"
                @click.stop="goTo('adjust', item)"
                v-if="item.canAdjust"
                >调整</view
              >
              <view class="option-btn" @click.stop="goTo('detail', item)">详情</view>
            </view>
          </block>
        </businessItemFrame>
      </cell>
      <view>
        <uni-load-more iconType="auto" :status="morestatus" />
      </view>
    </list>
    <view class="add-icon" @click="createCost">
      <view class="line horizontal"></view>
      <view class="line vertical"></view>
    </view>
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>

<script>
import filterView from "@/components/common/common-ui/filter-view.vue";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import { mapState } from "vuex";

export default {
  components: {
    filterView,
    uniLoadMore,
    labelArrow,
    wPicker,
    taskBtn,
    uniPopup,
    moreQueryView,
    businessItemFrame,
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
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  created() {
    this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute, "索赔管理", "列表");
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isShowAddBusiness = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_BUSINESS
        );
        this.isShowAddService = res.data.some(
          (x) => x.value === this.$savekey.PERMISSION_CLAIM_MANAGE_ADD_SERIVE
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.createBy = res.data.id;
      },
    });
  },
  methods: {
    reset(val) {
      this.searchKey = "";
      this.salesmanObj = {};
      this.esignStatusObj = {};
      this.startTime = "";
      this.endTime = "";
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    query(val) {
      console.log(val);
      this.searchKey = val.contractName;
      this.salesmanObj = val.salesmanObj;
      this.startTime = val.startDate;
      this.endTime = val.endDate;
      this.esignStatusObj = val.esignStatusObj;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    formatMoney(money) {
      return money ? this.moneyUtil.dealNumber(money + "") : "-";
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
        beginDate: this.startTime != "" ? this.startTime + " 00:00:00" : undefined,
        flowStatus: this.esignStatusObj.value,
        endDate: this.endTime != "" ? this.endTime + " 23:59:59" : undefined,
      };
      this.$network
        .getData(this.$url.CLAIM_PAGE, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          this.$datestr.printlog(JSON.stringify(this.datalist));
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
    },
    onConfirm(val) {
      let self = this;
      switch (this.pickType) {
        case "startTime":
          this.startTime = val.result;
          break;
        case "endTime":
          this.endTime = val.result;
          break;
        case "create":
          this.addClaim(val.checkArr.value);
          uni.setStorage({
            key: this.$savekey.LAST_CREATE_TYPE + "_claim_" + this.$datestr.getUserId(),
            data: val.checkArr.value,
          });
          break;
        default:
          break;
      }
      uni.pageScrollTo({
        scrollTop: self.curScrollTop,
        duration: 300,
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
        customerSalesman: this.salesmanObj.value != "" ? this.salesmanObj.value : null,
      };
      let url = this.$gxfmethod.getUrl(this.$url.CLAIM_PAGE);
      console.log(url);
      let filename = this.$gxfmethod.getFileName("索赔列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
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
          "&type=userapi" +
          "&filetype=claim_type",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  margin-top: calc(55px);
}
//顶部时间
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

.pop-container {
  position: relative;
  z-index: 999;
}

.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  width: 300px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
}

.pop-item-line {
  display: flex;
  width: 100%;
  padding: 10px 0px;
  font-size: $uni-font-size-base;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.lineView {
  width: 100%;
  height: 1px;
  background: $uni-bg-color-grey;
}
</style>
