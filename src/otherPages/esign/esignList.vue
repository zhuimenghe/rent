<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="search-container" :style="{ top: posTop + 'px' }">
      <view class="search-top">
        <view class="select-container"> </view>
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"
            ><input
              placeholder="签署合同名称"
              placeholder-class="placeholder-style"
              @input="searchChange"
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
      <view class="filter-view" v-if="showCTime && isShowGroup">
        <view class="bottom-search-top">
          <label-arrow
            style="flex: 1"
            :value="startCTime"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showdatepick('startctime')"
          />
          <label-arrow
            style="margin-left: 30px; flex: 1"
            :value="endCTime"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showdatepick('endctime')"
          />
        </view>
      </view>
    </view>
    <view class="list-container" show-scrollbar="false">
      <view v-for="(item, index) in datalist" :key="index" class="box">
        <view class="title"
          ><span>{{ item.title }}</span>
          <span
            style="font-size: 14px"
            :class="
              item.flowStatus == 1
                ? 'status1'
                : item.flowStatus == 2
                ? 'status2'
                : 'status3'
            "
          >
            {{ getStatus(item.flowStatus) }}
          </span>
        </view>
        <view class="create"
          ><span style="margin-right: 15px"> 发起人：{{ item.createBy }}</span>
          <span> {{ item.createDate }} </span>
        </view>
        <view class="signers"
          ><span style="margin-right: 15px"> 签署人：{{ item.signer }}</span>
        </view>
        <view class="cell-bg-view">
          <view class="bottom-btns-view">
            <view class="tag-btns-view" @click.stop="download(item)">{{
              "下载"
            }}</view>
            <view class="tag-btns-view" @click.stop="revoke(item)">{{
              "撤销"
            }}</view>
            <button
              style="line-height: 20px !important; margin-right: 0"
              class="tag-btns-view"
              open-type="share"
            >
              {{ "催办" }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <view>
      <view><uni-load-more iconType="auto" :status="morestatus" /></view>
    </view>
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
export default {
  components: {},
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
    };
  },
  components: {
    wPicker,
    labelArrow,
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
  },
  methods: {
    getList() {
      let param = {
        current: this.page,
        size: this.pageSize,
      };
      let url = this.$url.esignRecordPage;
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.datalist = result.records;
          this.datalist.forEach((e) => {
            e.signerArr = e.signer.split(",");
          });
          if (pages == this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
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
          this.showTime = false;
          this.timeType = type;
          break;
        case "year":
          this.showTime = false;
          this.timeType = type;
          break;
        case "custom":
          this.showTime = !this.showTime;
          this.timeType = type;
          break;
        case "cmonth":
          this.showCTime = false;
          this.timeCType = type;
          break;
        case "cyear":
          this.showCTime = false;
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
        this.startCTime = val.result;
      } else if (this.picktype === "endctime") {
        this.endCTime = val.result;
      }
    },
    searchChange(val) {
      this.searchKey = val.detail.value;
      this.page = 1;
      this.contractList = [];
      this.getContractData();
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
    download(item) {
      //http://{{test-address}}/esignapi/api/esign-record/c1371e01f3ad49b8ae8e9ba3e7ca5990/revoke
      let url = this.$url.esignRecordRevoke;
      console.log(url);
      console.log(item);
      // this.$network
      //   .getData(url, "POST")
      //   .then((res) => {

      //   })
      //   .catch((err) => {});
    },
    revoke(item) {
      //http://{{test-address}}/esignapi/api/esign-record/c1371e01f3ad49b8ae8e9ba3e7ca5990/revoke
      let url = this.$url.esignRecordRevoke;
      console.log(url);
      console.log(item);
      url = url.replace("{id}", item.flowId);

      this.$network
        .getData(url, "POST")
        .then((res) => {})
        .catch((err) => {});
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 1px;
  width: 100%;
  z-index: 100;
  position: fixed;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
  left: 0px;
}
.list-med {
  position: relative;
  width: 100%;
  background: $uni-bg-color-grey;
}

.search-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 100;
  border-bottom: 1px solid $uni-bg-color-grey;
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

.list-container {
  margin-top: calc(64px);
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
</style>
