<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="search-container">
      <view class="search-top">
        <view class="select-container"> </view>
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"
            ><input
              placeholder="签署合同名称"
              placeholder-class="placeholder-style"
              @input="searchChange"
              v-model="searchKey"
          /></view>
        </view>

        <view class="more-css" @click="isShowGroup = !isShowGroup"
          ><text>筛选</text></view
        >
      </view>
      <view class="filter-view" v-if="isShowGroup">
        <view class="select-view-row">发起签署时间</view>
        <view class="btn-container">
          <view
            class="btn"
            :class="{ active: timeCType === 'cmonth' }"
            @click="selectDate('cmonth')"
            >本月</view
          >
          <view
            class="btn"
            :class="{ active: timeCType === 'cyear' }"
            @click="selectDate('cyear')"
            >本年</view
          >
          <view
            class="btn"
            :class="{ active: timeCType === 'ccustom' }"
            @click="selectDate('ccustom')"
            >自定义</view
          >
        </view>
      </view>
      <view class="filter-view" v-if="isShowGroup">
        <view
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin: 0 5px;
            width: 100%;
          "
        >
          <selectView
            style="width: 33%; flex: 1"
            :value="createBy"
            hint="发起人"
            @clickSelect="showPick('user')"
          />
          <selectView
            style="width: 33%; flex: 1"
            :value="flowStatus.label"
            hint="签署状态"
            @clickSelect="showPick('flowStatus')"
          />
        </view>
      </view>
      <view class="filter-view" v-if="showCTime && isShowGroup">
        <view class="bottom-search-top">
          <label-arrow
            style="flex: 1"
            :value="dateSlice(startCTime)"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showdatepick('startctime')"
          />
          <label-arrow
            style="margin-left: 30px; flex: 1"
            :value="dateSlice(endCTime)"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showdatepick('endctime')"
          />
        </view>
      </view>
      <view class="condition-btn" v-if="isShowGroup">
        <view class="clear _btn" @click="clearsum">清除</view>
        <view class="confirm _btn" @click="oksum">查询</view>
      </view>
    </view>
    <view class="list-container" show-scrollbar="false">
      <view v-for="(item, index) in datalist" :key="index" class="box">
        <view class="title" @click.stop="gotoDetail(item)"
          ><span>{{ item.title }}</span>
          <p
            style="
              font-size: 14px;
              width: 38px;
              white-space: nowrap;
              text-align: right;
            "
            :class="
              item.flowStatus == 1
                ? 'status1'
                : item.flowStatus == 2
                ? 'status2'
                : 'status3'
            "
          >
            {{ getStatus(item.flowStatus) }}
          </p>
        </view>
        <view class="create" @click.stop="gotoDetail(item)"
          ><span style="margin-right: 15px"> 发起人：{{ item.createBy }}</span>
          <span> 发起时间：{{ dateSlice2(item.createDate) }} </span>
        </view>
        <view class="signers" @click.stop="gotoDetail(item)"
          ><span style="margin-right: 15px"> 签署人：{{ item.signer }}</span>
        </view>
        <view class="cell-bg-view">
          <view class="bottom-btns-view">
            <view
              class="tag-btns-view"
              v-if="
                item.flowStatus != 3 &&
                (item.businessType != 'settlement') &
                  (item.flowStatus != 2 || item.flowStatus != 1) &&
                (item.businessType != 'contractPlus') &
                  (item.flowStatus != 2 || item.flowStatus != 1)
              "
              @click.stop="download(item)"
              >{{ "下载" }}</view
            >
            <view
              class="tag-btns-view"
              v-if="item.flowStatus == 1"
              @click.stop="revoke(item)"
              >{{ "撤销" }}</view
            >
            <button
              style="line-height: 20px !important; margin-right: 0"
              v-if="item.flowStatus == 1"
              class="tag-btns-view"
              @click="share(item)"
              open-type="share"
            >
              {{ "催办" }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <view>
      <!-- <view><uni-load-more iconType="auto" :status="morestatus" /></view> -->
    </view>

    <view class="webview">
      <web-view :src="url" v-if="show"></web-view>
    </view>
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirmDate"
      :disabledAfter="true"
      ref="date"
      themeColor="#E60000"
    />
  </view>
</template>
<script>
import { mapState } from "vuex";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      isShowGroup: false,
      timeCType: "",
      showCTime: "",
      startCTime: "开始时间",
      endCTime: "结束时间",
      searchKey: "",
      datalist: [],
      morestatus: "more",
      startTime: "",
      endTime: "",
      url: "",
      show: false,
      userList: [],

      flowList: [
        {
          label: "签署中",
          value: 1,
        },
        {
          label: "已完成",
          value: 2,
        },
        {
          label: "撤销",
          value: 3,
        },
        {
          label: "拒签",
          value: 7,
        },
      ],
      flowStatus: {
        label: "",
        value: "",
      },
      createBy: "",
      selectList: [],
      flowId: "",
      title: "",
    };
  },
  components: {
    wPicker,
    labelArrow,
    selectView,
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  watch: {},
  mounted() {},
  created() {
    this.getList();
    this.getUserList();
  },

  methods: {
    getList() {
      let param = {
        current: this.page,
        size: this.pageSize,
        title: this.searchKey,
        createBy: this.createBy,
      };
      if (this.startCTime != "开始时间") {
        param.startTime = this.startCTime;
      }
      if (this.endCTime != "结束时间") {
        param.endTime = this.endCTime;
      }
      if (!!this.flowStatus.value) {
        param.flowStatus = this.flowStatus.value;
      }
      let url = this.$url.esignRecordPage;
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          this.datalist.forEach((e) => {
            e.signerArr = e.signer.split(",");
          });
          let pages = result.pages;
          if (pages == this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
        })
        .catch((err) => {});
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    dateSlice2(date) {
      if (!date) return "";

      return date.slice(0, -3);
    },
    getUserList() {
      let param = {
        isAll: true,
        showAdmin: false,
      };
      let url = this.$url.USER_LEADERS;
      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          this.userList = res;
          console.log(this.userList);
          this.userList.map((e) => {
            e.label = e.username;
          });
        })
        .catch((err) => {});
    },

    selectDate(type) {
      if (this.timeType === type) {
        this.showTime = false;
        this.timeType = "";
        return;
      }
      if (this.timeCType === type) {
        this.showCTime = false;
        this.timeCType = "";
        return;
      }
      console.log(type);
      switch (type) {
        case "month":
          this.isShow = false;
          this.startTime =
            this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00";
          this.endTime = this.$dateUtil.timeFormat(new Date()) + " 00:00:00";
          this.getList();
          break;
        case "year":
          this.isShow = false;
          this.startTime =
            this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
          this.endTime = this.$dateUtil.timeFormat(new Date()) + " 00:00:00";
          this.getList();
          break;
        case "custom":
          this.showTime = !this.showTime;
          this.timeType = type;
          break;
        case "cmonth":
          this.isShow = false;
          this.startCTime =
            this.$dateUtil.getFirstDayOfMonth(new Date()) + " 00:00:00";
          this.endCTime = this.$dateUtil.timeFormat(new Date()) + " 00:00:00";
          this.getList();
          this.timeCType = type;
          break;
        case "cyear":
          this.isShow = false;
          this.startCTime =
            this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
          this.endCTime = this.$dateUtil.timeFormat(new Date()) + " 00:00:00";
          this.getList();
          this.timeCType = type;
          break;
        case "ccustom":
          this.showCTime = !this.showCTime;
          this.timeCType = type;
          break;
        default:
          break;
      }
    },
    showdatepick(type) {
      this.picktype = type;
      this.$refs.date.show();
    },
    onConfirmDate(val) {
      if (this.picktype === "starttime") {
        this.startTime = val.result;
      } else if (this.picktype === "endtime") {
        this.endTime = val.result;
      } else if (this.picktype === "startctime") {
        this.startCTime = val.result + " 00:00:00";
      } else if (this.picktype === "endctime") {
        this.endCTime = val.result + " 23:59:59";
      }
    },
    searchChange(val) {
      this.datalist = [];
      this.searchKey = val.detail.value;
      this.page = 1;
      this.contractList = [];
      this.getList();
    },
    onPullDownRefresh() {
      this.page = 1;
      this.datalist = [];
      this.getList();
    },
    onReachBottom() {
      if (this.morestatus == "noMore") {
        return;
      }
      this.page += 1;
      this.getList();
      this.morestatus = "loading";
    },
    getStatus(type) {
      // 0: 草稿 1：签署中 2：已完成 3：撤销 5：过期 7：拒签
      let str = "";
      switch (type) {
        case 0:
          str = "草稿";
          break;
        case 1:
          str = "签署中";
          break;
        case 2:
          str = "已完成";
          break;
        case 3:
          str = "撤销";
          break;
        case 5:
          str = "过期";
          break;
        case 7:
          str = "拒签";
          break;

        default:
          break;
      }
      return str;
    },
    oksum() {
      this.page = 1;
      this.datalist = [];
      this.getList();
    },
    getUrlUploadFile(type) {
      let url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
      switch (type) {
        case "contract":
          url = this.$url.DOWNLOAD_WORD_CONTRACT;
          break;
        case "contractPlus":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_PLUS;
          break;
        case "settlement": //结算
          url = this.$url.BASE_URL + "settleapi/api/settlement/export";
          break;

        case "workIn": //进场
          url = this.$url.DOWNLOAD_WORD_WORKIN;
          break;
        case "workOut": //退场
          url = this.$url.DOWNLOAD_WORD_WORKOUT;
          break;
        case "esignMerge": //合并电签
          url = this.$url.ESIGN_DOWNLOAD_URL_CONTRACT_MERGE;
          break;
        default:
          break;
      }
      return url;
    },
    download(item) {
      console.log(item);
      if (item.flowStatus == 2) {
        let url = this.$url.esignRecordFile;
        let param = {
          flowId: item.flowId,
        };
        this.$network
          .getData(url, "GET", param)
          .then((res) => {
            let url = res;
            let filename = item.title + ".pdf";
            // #ifdef APP-PLUS
            filename = "_doc/" + item.title + ".pdf";
            // #endif
            this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
          })
          .catch((err) => {});
      } else {
        let headerDic = {
          "Content-Type": "application/json",
          Authorization: "",
        };
        let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
        if (loginMes) {
          let access_token = loginMes.token_type + " " + loginMes.access_token;
          headerDic.Authorization = access_token;

          let url =
            this.getUrlUploadFile(item.businessType) +
            "?businessNo=" +
            item.businessNo;

          this.downxlsc(url, headerDic, item.title);
        }
      }
    },
    downxlsc(url, headerDic, name) {
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },
    clearsum() {
      this.page = 1;
      this.datalist = [];
      this.startTime = "";
      this.endTime = "";
      this.searchKey = "";
      this.startCTime = "开始时间";
      this.endCTime = "结束时间";
      this.createBy = "";
      this.flowStatus = "";
      this.timeCType = "";
      this.getList();
    },
    revoke(item) {
      uni.showModal({
        title: "提示",
        content: "是否确认撤销当前电签流程？",
        success: (res) => {
          if (res.confirm) {
            let url = this.$url.esignRecordRevoke;
            url = url.replace("{id}", item.flowId);

            this.$network
              .getData(url, "POST")
              .then((res) => {
                setTimeout(() => {
                  this.clearsum();
                }, 1000);
              })
              .catch((err) => {});
          }
        },
      });
    },
    showPick(type) {
      this.picktype = type;
      switch (type) {
        case "user":
          this.selectList = this.userList;
          break;
        case "flowStatus":
          this.selectList = this.flowList;
          break;

        default:
          break;
      }
      this.$refs.selector.show();
    },
    onConfirm(val) {
      switch (this.picktype) {
        case "user":
          console.log(val);
          this.createBy = val.result;
          this.$forceUpdate();
          console.log(this.createBy);
          break;
        case "flowStatus":
          this.flowStatus.value = val.checkArr.value;
          this.flowStatus.label = val.checkArr.label;
          this.$forceUpdate();
          console.log(this.flowStatus);
          console.log(val.checkArr);
          break;

          break;
        default:
          break;
      }
    },
    gotoDetail(item) {
      let url = this.$url.esignRecordInfo;
      let param = {
        urlType: 1,
      };
      url = url.replace("{id}", item.flowId);

      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          uni.navigateTo({
            url: `/otherPages/esign/webView?url=${encodeURIComponent(
              res
            )}&title=${item.title}`,
          });
        })
        .catch((err) => {});
    },
    share(item) {
      this.flowId = item.flowId;
      this.title = item.title;
    },
    onShareAppMessage(ops) {
      let promise;
      if (ops.from === "button") {
        let url = this.$url.esignRecordInfo;
        let param = {
          urlType: 2,
        };
        url = url.replace("{id}", this.flowId);
        promise = new Promise((resolve) => {
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              resolve({
                title: this.title,
                imageUrl:
                  "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
                path: `/otherPages/esign/webView?url=${encodeURIComponent(
                  res
                )}&title=${this.title}`,
              });
            })
            .catch((err) => {});
        });
      }
      return {
        promise,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .attacment-style {
  padding: 4px 0 !important;
}
.count {
  font-size: 30rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1278ff;
  margin: 0 8rpx 0 24rpx;
}
.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.float-view {
  position: fixed;
  display: flex;
  bottom: 16px;
  right: 16px;
  width: 50px;
  height: auto;
  box-shadow: 1px 1px 4px #eeeeee;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  z-index: 300;
  background-color: #ffffff;
}

.more-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  // margin-right: 12px;
  height: 30px;
  border-radius: 4px;
  font-size: $uni-font-size-base;
  color: #222222;
}

//添加按钮
.add-container {
  // position: fixed;
  display: flex;
  // bottom: 32px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.rubbish-container {
  // position: fixed;
  display: flex;
  // bottom: 92px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.show-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
  position: fixed;
  display: flex;
  box-shadow: 0px 0px 10px #eeeeee;
  right: 0px;
  bottom: 16px;
  z-index: 960;
}

.close-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

.labelstyle-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.labelstylerubbish {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}

.search-container {
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  z-index: 100;
}
.list-med {
  position: relative;
  width: 100%;
  background: $uni-bg-color-grey;
}

.search-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ffffff;
}

.search-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 55;
  color: $uni-color-title;
  margin: 5px;
  font-size: $uni-font-size-sm;
  text-align: center;
}

.select-view {
  flex: 1;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 8px;
  flex-direction: row;
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.select-container {
  display: flex;
  // width: 40%;
  flex-direction: column;
  position: relative;
}

.select-label {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  justify-content: center;
  align-items: center;
  text-align: center;
  // border: 1px solid #AAAAAA;
  padding: 2px 4px;
  border-radius: 4px;
}

.select-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 28px;
  left: 0px;
  width: 150%;
  font-size: $uni-font-size-base;
  text-align: center;
  background-color: $uni-bg-color-grey;
  border-radius: 0px 0px 4px 4px;
}

.checkbox {
  justify-content: flex-end;
  transform: scale(0.6);
  margin-left: 10px;
}

.select-item {
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  width: 100%;
  background-color: #ffffff;
  text-align: left;
  margin-top: 1rpx;
  padding-left: 15px;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  flex: 1;
}



.title-tag-text {
  color: #ffffff;
  box-sizing: border-box;
  font-size: 12px;
  padding: 2px;
  text-align: center;
  background-color: #e60000;
  border-radius: 4px;
  font-weight: 400;
}

.option-btn {
  padding: 0px 10px;
  border-radius: 20px;
  border: 1px solid $uni-color-primary;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  height: 24px;
  line-height: 24px;
}

.pop-container {
  position: relative;
  z-index: 999;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.row-tag {
  width: 98px;
  text-align: left;
}

.input-style {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-top: 7px;
  padding-bottom: 7px;
  flex: 1;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.pop-item {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-disable {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-line {
  border-style: solid;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
}

.group-arrow-bg {
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
  align-items: center;
  justify-content: center;
}

.group-arrow {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-lg;
}

.group-arrow-down {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-lg;
  transform: rotate(-180deg);
  transition: all 0.5s;
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

.select-view-row {
  margin-left: 10px;
  min-width: 80px;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
  display: flex;
  flex-direction: row;
}

.btn-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
}

.btn {
  margin-right: 10px;
  padding: 2px 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid $uni-color-primary;
  margin: 0px 4px;

  &.active {
    background-color: $uni-color-primary;
    color: #ffffff;
  }
}

.bottom-search-top {
  display: flex;
  flex: 1;
  margin: 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
}

.condition-btn {
  display: flex;
  width: 100%;
  padding-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  background: #ffffff;
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}

.btn-all {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  color: #ffffff;
  font-size: $uni-font-size-base;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}

.bottom-btns-view {
  display: flex;
  flex-direction: row;
  padding: 10px 0px 0px 10px;
  justify-content: flex-end;
}
.tag-btns-view {
  padding: 3px 15px;
  border-radius: 50px;
  border: $uni-color-primary 1px solid;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
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
  bottom: 150rpx;
  .iconfont {
    font-size: 48rpx;
  }
}
.box {
  background-color: #fff;
  margin: 8px 0;
  padding: 12px;
}
.title {
  color: #222222;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.create {
  color: #222222;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  margin-bottom: 8px;
}

.status1 {
  color: #fe931f;
}
.status2 {
  color: #52c41a;
}
.status3 {
  color: #e60000;
}
.condition-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}
._btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  color: #ffffff;
  font-size: $uni-font-size-base;
}
</style>
