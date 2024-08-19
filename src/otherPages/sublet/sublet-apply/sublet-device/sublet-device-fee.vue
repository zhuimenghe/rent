<template>
  <view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <text>合计:{{ totalMoney }}</text>
        </view>
        <view class="addStyle" @click="getTotal('add')">
          <text>新增车辆</text>
        </view>
      </view>
      <view class="bottom-search">
        <view class="row-item">
          <view class="input-style" @click="showpick('start')">{{ startTime }}</view>
          <i class="iconfont iconzl--rili" style="padding-right: 8px; color: #e60000" @click="showpick('start')"></i>
        </view>
        <view class="row-item">
          <view class="input-style" @click="showpick('end')">{{ endTime }}</view>
          <i class="iconfont iconzl--rili" style="padding-right: 8px; color: #e60000" @click="showpick('end')"></i>
        </view>
      </view>
    </view>
    <view class="list-sub-view">
      <list class="list-view">
        <cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor">
              <view class="item-head">
                <view class="head-top">设备编号:{{ item.licenseId || "--" }}</view>
                <view class="head-bottom">
                  <text>{{ item.typeName || "--" }}</text>
                  |
                  <text class="item-text">{{ item.heightName || "--" }}</text>
                  |
                  <text class="item-text">{{ item.brand || "--" }}</text>
                  |
                  <text class="item-text">{{ item.machineTypeName || "--" }}</text>
                </view>
              </view>
            </view>
            <view class="cell-text-right fontBlackcolor" style="justify-content: flex-end">
              <text>{{ item.subletStateName || "" }}</text>
            </view>
          </view>
          <view class="line-s" />
          <!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>设备编号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.licenseId || "--"}}</text>
						</view>
					</view> -->
          <view class="cell-text">
            <view class="cell-text-left fontsubcolor"><text>转租公司</text></view>
            <view class="cell-text-right fontBlackcolor">
              <text>{{ item.subletCompanyName || "--" }}</text>
            </view>
          </view>
          <!-- <view class="rowstyle">
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>类型</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.typeName || "--"}}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>高度</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ changestr(item.heightName) || "--"}}</text>
							</view>
						</view>
					</view>
					<view class="rowstyle">
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>品牌</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.brand || "--"}}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>型号</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.machineTypeName || "--"}}</text>
							</view>
						</view>
					</view> -->
          <view class="rowstyle">
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>转租方式</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.settlementTypeName || "--" }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>单价</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.price || "--" }}</text>
              </view>
            </view>
          </view>
          <view class="rowstyle">
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>启用日期</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ changestr(item.subletDate) }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>还租日期</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ changestr(item.rentBackDate) }}</text>
              </view>
            </view>
          </view>
          <view class="rowstyle">
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>转租天数</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{
                  getSubletTenancyTerm(item.subletDate, item.rentBackDate)
                }}</text>
              </view>
            </view>
            <view class="cell-text">
              <view class="cell-text-left fontsubcolor"><text>报停天数</text></view>
              <view class="cell-text-right fontBlackcolor">
                <text>{{ item.pauseDays || "0" }}</text>
              </view>
            </view>
          </view>
          <view class="line-s" />
          <view style="display: flex; flex-direction: row; justify-content: flex-end">
            <view class="bottom-text-right fontdetailcolor" @click="gotodetail(item, index)">
              <text>调整报停天数</text>
            </view>
            <view class="bottom-text-right fontdetailcolor" @click="deleteList(index)">
              <text>删除</text>
            </view>
          </view>
        </cell>
      </list>
      <view style="width: 100%; height: 80px" />
    </view>
    <view class="bottom-container">
      <view class="clear-btn" @click="getTotal('total')">
        <text>计算</text>
      </view>
      <!-- <view class="confirm-btn" @click="getTotal('expect')">
				<text>导出</text>
			</view> -->
    </view>
    <view class="pop-container">
      <uni-popup ref="daysDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">修改报停天数</view>
          <view class="row-item">
            <view class="row-tag">
              报停天数
              <span style="color: #ff0000">*</span>
            </view>
            <view class="input-style">
              <input style="flex: 1" type="number" placeholder="请输入报停天数" v-model="dayNums" />
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text class="uni-tip-button pop-cancel" @click="canceldaysDialog">取消</text>
            <text class="uni-tip-button pop-confirm" @click="confirmdaysDialog">提交</text>
          </view>
        </view>
      </uni-popup>
    </view>
    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import calDay from "@/common/util/cal-rent-money.js";
import addDays from "date-fns/addDays";
import subMonths from "date-fns/subMonths";
let timer;
export default {
  components: {
    labelArrow,
    wPicker,
    filterView,
    uniPopup,
  },
  data() {
    return {
      iconstr: "iconzl--rili",
      showfilter: false,
      datalist: [],
      selectType: "",
      startTime: "开始时间",
      endTime: "结束时间",
      dayNums: 0,
      dayItemIndex: -1,
      totalMoney: 0,
      downloadTask: null,
    };
  },
  onLoad() {
    // sublet-device-list
    let date = new Date();
    this.startTime = this.$datestr.dateFormat(
      addDays(subMonths(date, 1), 1),
      "yyyy-MM-dd"
    );
    this.endTime = this.$datestr.dateFormat(date, "yyyy-MM-dd");
    uni.$on("sublet-device-list", (o) => {
      this.datalist = o.item.map((y) => {
        return {
          ...y,
          pauseDays: y.pauseDays || 0,
        };
      });
    });
  },
  methods: {
    getSubletTenancyTerm(startTime, endTime) {
      if (startTime && endTime) {
        return (
          calDay.getDaysOfDiffer(this.changestr(startTime), this.changestr(endTime)) +
          "天"
        );
      }
      return "--";
    },
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    showpick(type) {
      this.selectType = type;
      this.$refs.date.show();
    },
    onConfirm(val) {
      if (this.selectType === "start") {
        this.startTime = val.result;
      } else {
        this.endTime = val.result;
      }
    },
    getTotal(type) {
      if (type === "total") {
        this.confirmDialog();
      } else if (type === "expect") {
        this.downLoadDoc();
      } else {
        uni.navigateTo({
          url:
            "./sublet-device-add?item=" +
            encodeURIComponent(JSON.stringify(this.datalist)),
        });
      }
    },
    cancelDialog() {
      this.$refs.companyDialog.close();
    },
    confirmDialog() {
      if (this.startTime === "开始时间") {
        uni.showToast({
          icon: "none",
          title: "请选择开始时间",
        });
        return;
      }
      if (this.endTime === "结束时间") {
        uni.showToast({
          icon: "none",
          title: "请选择结束时间",
        });
        return;
      }
      if (
        this.$datestr.timedifferent(
          this.endTime + " 23:59:59",
          this.startTime + " 00:00:00"
        ) === -1
      ) {
        uni.showToast({
          icon: "none",
          title: "开始日期不能晚于结束日期",
        });
        return;
      }
      if (this.datalist.length === 0) {
        uni.showToast({
          icon: "none",
          title: "请新增车辆",
        });
        return;
      }
      // this.$refs.companyDialog.close();
      this.calTotal();
    },
    calTotal() {
      uni.showLoading();
      let list = this.datalist.map((o) => {
        return {
          licenseId: o.licenseId,
          pauseDays: o.pauseDays,
          beginDate: this.startTime + " 00:00:00",
          endDate: this.endTime + " 23:59:59",
        };
      });
      this.$network
        .getData(this.$url.CAL_SUBLET_TOTAL, "POST", list)
        .then((result) => {
          this.totalMoney = result.hireTotal;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    deleteList(index) {
      this.datalist.splice(index, 1);
    },
    gotodetail(item, index) {
      this.dayItemIndex = index;
      this.dayNums = item.pauseDays || 0;
      this.$refs.daysDialog.open();
    },
    canceldaysDialog() {
      this.$refs.daysDialog.close();
    },
    confirmdaysDialog() {
      let item = {
        ...this.datalist[this.dayItemIndex],
        pauseDays: Number(this.dayNums),
      };
      this.datalist.splice(this.dayItemIndex, 1, item);
      this.$refs.daysDialog.close();
    },
    //--
    downLoadDoc(item) {
      // let headerDic = {
      // 	'Content-Type': 'application/json',
      // 	'Authorization': '',
      // };
      // let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
      // if (loginMes) {
      // 	let access_token = loginMes.token_type + " " + loginMes.access_token;
      // 	headerDic.Authorization = access_token;
      // 	this.downDocument(headerDic,item)
      // }
    },
    hide() {
      if (this.downloadTask) {
        this.downloadTask.abort();
        this.downloadTask = null;
      }
    },
  },
  onUnload() {
    this.hide();
  },
  onHide() {
    this.hide();
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

//添加按钮
.add-container {
  position: fixed;
  display: flex;
  bottom: 50px;
  right: 20px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #e60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.labelstyle {
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
}

//搜索框
.top-view {
  z-index: 100;
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 0px;
  left: 0px;
  margin-bottom: 1px;
  background: #ffffff;
  padding-bottom: 5px;
}

.list-sub-view {
  display: flex;
  flex: 1;
  flex-direction: column;
  background: $uni-bg-color-grey;
  margin-top: 100px;
}

//列表
.list-view {
  display: flex;
  flex: 1;
  flex-direction: column;
}

//列表cell
.rowstyle {
  display: flex;
  flex-direction: row;
}

.list-view-cell {
  // margin-left: 10px;
  // margin-right: 10px;
  margin-bottom: 5px;
  background: #ffffff;
}

.cell-text {
  display: flex;
  flex: 1;
  margin-top: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.cell-text-left {
  display: flex;
  min-width: 50px;
  margin-top: 5px;
  margin-left: 15px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.cell-text-right {
  display: flex;
  flex: 1;
  margin-top: 5px;
  margin-right: 15px;
  margin-left: 10px;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.fontBlackcolor {
  color: $uni-text-color;
}

.fontdetailcolor {
  color: $uni-color-primary;
  margin-bottom: 10px;
}

.fontgreencolor {
  color: #4cd964;
}

.line-s {
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  height: 1px;
  background: #eeeeee;
}

.fontsubcolor {
  color: $uni-text-color-gray;
}

.bottom-search {
  display: flex;
  flex-direction: row;
  width: 100%;
  background: #ffffff;
  margin-bottom: 1px;
}

.bottom-search-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 5px;
  align-items: center;
  background: #ffffff;
  font-size: $uni-font-size-base;
}

.condition-btn {
  display: flex;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}

.btn {
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

.addStyle {
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
  color: #e60000;
  font-size: $uni-font-size-sm;
  display: flex;
  background: #eeeeee;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  height: 35px;
}

.bottom-text-right {
  display: flex;
  margin: 10px;
  justify-content: flex-end;
  align-items: center;
  font-size: $uni-font-size-base;
}

.filter-view-style {
  height: 35px;
  display: flex;
  background: #eeeeee;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
}

.search-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: #ffffff;
  margin-bottom: 1px;
  width: 100%;
  padding: 5px;
}

.search-box {
  background: #ffffff;
  height: 35px;
  line-height: 35px;
  display: flex;
  flex: 1;
  margin-left: 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: $uni-font-size-base;
}

.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
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
  flex: 1;
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

.pop-container {
  position: relative;
}

.item-head {}

.head-top {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
}

.head-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-bottom: 4px;
  margin-top: 4px;
}

.item-text {
  margin-right: 2px;
  margin-left: 2px;
}

.bottom-container {
  position: fixed;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  height: 72px;
  width: 100%;
  justify-content: space-between;
}

.clear-btn {
  flex: 1;
  background-color: $uni-color-primary;
  margin: 16px 8px 16px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #ffffff;
  font-size: 14px;
}

.confirm-btn {
  flex: 1;
  background-color: $uni-color-primary;
  margin: 16px 16px 16px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 4px;
  font-size: 14px;
}
</style>
