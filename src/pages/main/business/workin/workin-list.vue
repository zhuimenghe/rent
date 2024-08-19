<template>
  <view class="workin-list-bg">
    <view class="top-view" :style="{ top: posTop + 'px' }">
      <moreQueryView
        :isExportList="false"
        :showTotalCount="true"
        :isDownLoad="true"
        @reset="reset"
        @query="query"
        :isQueryState="true"
        :isQueryEsign="true"
        :isQueryTime="true"
        @exportExcel="exportExcel"
      >
        <text slot="totalCount" class="count">{{ totalCount }}笔</text>
      </moreQueryView>
    </view>
    <list class="list-view">
      <!-- taxNumber -->
      <cell v-for="(item, index) in datalist" :key="index">
        <businessItemFrame
          :stateName="item.stateName || ''"
          :attachmentNum="item.fileListNum ? item.fileListNum : 0"
          :showAttachment="item.state === '4'"
          bgcolor="#FFFFFF"
          padding="0px"
          @addPic="goImg(item)"
          @click.native="gotodetail(item)"
        >
          <block slot="title">
            <view>{{ item.customerName || "" }}-{{ item.projectName || "" }}</view>
          </block>
          <block slot="subContent">
            <view class="max-one-line">
              {{ item.businessNo }}
              &nbsp;|&nbsp;
              {{ item.customerSalesmanName || "-" }}
              &nbsp;|&nbsp;
              {{ item.orgName || "-" }}
            </view>
          </block>
          <block slot="content">
            <view>
              <view class="row-line padding-tb-xs text-gray">
                <view class="text-gray flex-1">
                  <view class="row-line" style="color: #999999">
                    启用时间： {{ changestr(item.enableDate || item.preEnableDate) }}
                  </view>
                </view>
                <view class="text-gray flex-1">
                  <view class="row-line" style="color: #999999">
                    运输方式： {{ item.logisticsTypeName || "" }}
                  </view>
                </view>
              </view>
              <view class="row-line padding-tb-xs text-gray">
                <view class="text-gray flex-1">
                  <view class="row-line" style="color: #999999">
                    审批状态： {{ item.stateName || "" }}
                  </view>
                </view>
                <view class="text-gray flex-1">
                  <view class="row-line" style="color: #999999">
                    签署状态： {{ item.flowStatus | esignStatusName }}
                  </view>
                </view>
              </view>
              <view class="row-line padding-tb-xs text-gray">
                <view class="text-gray flex-1">
                  <view class="row-line" style="color: #999999">
                    进场设备： {{ getMachinesNum(item) }}
                  </view>
                </view>
              </view>
            </view>
          </block>
          <block slot="options">
            <view class="row-line">
              <taskBtn :itemData="item" :isBorder="true" />
              <view
                class="option-btn"
                @click.stop="editCreate(item)"
                v-if="
                  checkAllPermissions(['workInModify']) &&
                  item.state === '4' &&
                  item.flowStatus != '2' &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
              >
                修改
              </view>
              <view
                class="option-btn"
                @click.stop="backEditCreate(item)"
                v-if="ishowupdata(item)"
              >
                修改
              </view>
              <view
                class="option-btn"
                @click.stop="deleteWorkIn(item)"
                v-if="
                  checkAllPermissions(['workInDelete']) &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
              >
                删除
              </view>
            </view>
          </block>
        </businessItemFrame>
      </cell>
      <view>
        <uni-load-more iconType="auto" :status="morestatus" />
      </view>
    </list>
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
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
  </view>
</template>

<script>
import filterView from "@/components/common/common-ui/filter-view.vue";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import badgeview from "@/components/common/image-upload/badge-icon.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
import moreQueryView from "@/components/common/common-ui/business-query-bar.vue";
import businessItemFrame from "@/components/common/common-ui/business-item-frame.vue";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
import {
  checkAllPermissions,
  showToast,
} from "@/common/business-method/common-method/util.js";
import { mapState } from "vuex";

export default {
  components: {
    filterView,
    uniLoadMore,
    labelArrow,
    wPicker,
    badgeview,
    taskBtn,
    moreQueryView,
    businessItemFrame,
    sanyPopup,
  },
  data() {
    return {
      showTotalCount: true,
      currentpage: 1,
      datalist: [],
      morestatus: "loading",
      searchKey: "",
      //顶部时间参数
      startTime: "", //筛选的开始时间
      endTime: "", //筛选的结束时间
      pickType: "",
      isshow: false,
      userid: "",
      isExportList: true,
      totalCount: "100",
      salesmanObj: {},
      esignStatusObj: {},
      applyDate: "",
      orgObj: {},
      stateObj: {},
      totalNum: 0,
    };
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => {
        return s.statusBarHeight + s.titleBarHeight;
      },
    }),
  },
  mounted() {
    uni.showLoading();
    this.loaddata();
  },
  created() {
    this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute, "进场管理", "列表");
    uni.$on("refresh-list", (usnerinfo) => {
      this.headerrefresh();
    });
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.userid = res.data.id;
      },
    });
  },
  methods: {
    checkAllPermissions,
    getHalfTime(date) {
      let d = "--";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    reset(val) {
      this.searchKey = "";
      this.orgObj = {};
      this.salesmanObj = {};
      this.stateObj = {};
      this.esignStatusObj = {};
      this.startTime = "";
      this.endTime = "";
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    query(val) {
      this.searchKey = val.contractName;
      this.orgObj = val.orgObj;
      this.stateObj = val.stateObj;
      this.salesmanObj = val.salesmanObj;
      this.startTime = val.startDate;
      this.esignStatusObj = val.esignStatusObj;
      this.endTime = val.endDate;
      this.currentpage = 1;
      this.datalist = [];
      this.loaddata();
    },
    // 定义一个方法来处理删除合同的操作
    deleteWorkIn(item) {
      // 替换URL中的占位符
      let checkUrl = this.$url.WORK_IN_DELETE_CHECK;

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", { businessNo: item.businessNo })
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
              "注意：您将删除当前进场单，该操作不可恢复,该操作执行后立即生效。",
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
      let deleteUrl = this.$url.WORK_IN_DELETE.replace(/{id}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.headerrefresh(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },

    showToast,

    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    // 定义getMachinesNum函数，用于统计各类型机器的数量
    getMachinesNum(item) {
      let machines = item.machines ? item.machines : [];
      if (!machines || machines.length <= 0) return "-";
      let arr = [];
      let map = {};
      machines = machines.map((o) => {
        return {
          type: o.type,
          useNum: 1,
          height: o.machineHeight,
          machineHeightName: o.machineHeightName,
          typeName: o.typeName,
          typeShortName: o.typeShortName ? o.typeShortName : "-",
        };
      });
      machines.forEach((o) => {
        if (map[o.type + "-" + o.height]) {
          arr.forEach((y) => {
            if (y.type == o.type && y.height == o.height) {
              y.useNum += o.useNum;
              return;
            }
          });
        } else {
          arr = [...arr, o];
          map[o.type + "-" + o.height] = o;
        }
      });
      let needDevice = arr
        .map((o) => {
          return (
            o.typeShortName +
            "/" +
            o.machineHeightName +
            ":" +
            (o.useNum ? o.useNum + "台" : "-")
          );
        })
        .join("\n");
      return needDevice;
    },
    ishowupdata(item) {
      return this.iscreator(item) && (item.state === "0" || item.state === "3");
    },
    iscreator(item) {
      if (item.createBy === this.userid) {
        return true;
      } else {
        return false;
      }
    },

    gotodetail(item) {
      let url = "";
      let businessNostr = item.businessNo;
      if (item.expressFlag) {
        url = "/businessPages/workin/workin-simple-detail?businessNo=" + businessNostr;
      } else {
        url = "/businessPages/workin/workin-detail?businessNo=" + businessNostr;
      }
      uni.navigateTo({
        url: url,
      });
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
        customerSalesman:
          this.salesmanObj.value != "" ? this.salesmanObj.value : undefined,
        orgIdList: this.orgObj.value ? [this.orgObj.value] : undefined,
        state: this.stateObj.value != "" ? this.stateObj.value : undefined,
        flowStatus: this.esignStatusObj.value,
        beginDate: this.startTime != "" ? this.startTime + " 00:00:00" : undefined,
        endDate: this.endTime != "" ? this.endTime + " 23:59:59" : undefined,
      };
      this.$network
        .getData(this.$url.WORK_IN_PAGE, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          let pages = result.pages;
          if (pages <= this.currentpage) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          this.totalCount = result.total.toString();
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
      this.$gxfmethod.statisticData(
        this.$eventId.Contract_Cxecute,
        "进场管理",
        "新增进场单"
      );
      uni.navigateTo({
        url:
          "/businessPages/invoice/contract-choose?type=workIn&state=5&title=选择进场合同&isFirst=true",
      });
    },
    //顶部时间方法
    filtrateMenu() {
      this.isshow = !this.isshow;
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
        default:
          break;
      }
      uni.pageScrollTo({
        scrollTop: self.curScrollTop,
        duration: 300,
      });
    },

    goImg(item) {
      let isedit = this.isuser(item);
      uni.navigateTo({
        url:
          "../../components/common/image-upload/upload_zb_apendix?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&isedit=" +
          isedit +
          "&type=userapi" +
          "&filetype=workin_type",
      });
    },
    isuser(item) {
      if (item.canUploadFile == "0") {
        return false;
      } else {
        return true;
      }
    },
    backEditCreate(item) {
      if (item.expressFlag) {
        uni.navigateTo({
          url:
            "/businessPages/workin/create-workin-simple?isUpdate=1&item=" +
            encodeURIComponent(JSON.stringify(item)),
        });
      } else {
        uni.navigateTo({
          url:
            "/businessPages/workin/create-workin-step-all?item=" +
            encodeURIComponent(JSON.stringify(item)) +
            "&backType=2",
        });
      }
    },
    editCreate(item) {
      let urlstr = this.$url.WORK_IN_UPDATE_CHECK;
      this.$network
        .getData(urlstr, "GET", { businessNo: item.businessNo })
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
            this.showModal("无法修改", message);
          } else {
            if (item.expressFlag) {
              uni.navigateTo({
                url:
                  "/businessPages/workin/create-workin-simple?isUpdate=1&workActionMode=edit&item=" +
                  encodeURIComponent(JSON.stringify(item)),
              });
            } else {
              uni.navigateTo({
                url:
                  "/businessPages/workin/create-workin-step-all?isUpdate=1&item=" +
                  encodeURIComponent(JSON.stringify(item)) +
                  "&backType=2&workActionMode=edit",
              });
            }
          }
        })
        .catch((err) => {
          return;
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
        customerSalesman:
          this.salesmanObj.value != "" ? this.salesmanObj.value : undefined,
        orgIdList: this.orgObj.value ? [this.orgObj.value] : undefined,
        state: this.stateObj.value != "" ? this.stateObj.value : undefined,
      };
      let url = this.$gxfmethod.getUrl(this.$url.WORK_IN_PAGE);
      console.log(url);
      let filename = this.$gxfmethod.getFileName("进场记录列表-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .query-content {
  box-shadow: none !important;
}

.search {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid #f5f4f9;
}

//背景视图
.workin-list-bg {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
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
</style>
