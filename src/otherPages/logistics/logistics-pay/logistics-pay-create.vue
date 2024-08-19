<template>
  <view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="sum-view-bg">
      <view class="model-tag">
        <text>基本信息</text>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>应付单号</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ transDic.businessNo || "--" }}</text>
        </view>
      </view>
      <select-label-item
        isRequired="true"
        tagName="物流方"
        hint="请选择物流方"
        :value="transDic.logisticsCompanyName"
        :icon="righticon"
        @clickItemLabel="chooseItem('company')"
      />
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>物流方联系人</text></view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="transDic.logisticsContact"
            placeholder="请输入物流方联系人...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>联系人电话</text></view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="transDic.logisticsPhone"
            placeholder="请输入联系人电话...."
          />
        </view>
      </view>
      <select-label-item
        isRequired="true"
        tagName="应付开始日期"
        hint="请选择开始日期"
        :value="getDate(transDic.startTime)"
        :icon="righticon"
        @clickItemLabel="chooseItem('start')"
      />
      <select-label-item
        isRequired="true"
        tagName="应付结束日期"
        hint="请选择结束日期"
        :value="getDate(transDic.endTime)"
        :icon="righticon"
        @clickItemLabel="chooseItem('end')"
      />
      <select-label-item
        isRequired="true"
        tagName="我方负责人"
        hint="请选择我方负责人"
        :value="transDic.customerSalesmanName"
        :icon="righticon"
        @clickItemLabel="chooseItem('salesman')"
      />
    </view>
    <view class="sum-view-bg">
      <view class="model-tag">
        <text>合计</text>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>车次数</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ transDic.trainNumber || "--" }}</text>
        </view>
      </view>
      <!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>里程数</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ transDic.distance || 0 }}</text>
				</view>
			</view> -->
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>应付金额</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{
            $datestr.doubleFloat(transDic.paidTotal) || "0.00"
          }}</text>
        </view>
      </view>
    </view>
    <view class="sum-view-bg">
      <view class="model-tag">
        <text>货物物流记录</text>
        <text class="add-style" @click="addlogistic">新增</text>
      </view>
      <view
        class="vehicle-list-container"
        v-if="transDic.list && transDic.list.length > 0"
      >
        <view
          v-for="(item, index) in transDic.list ? transDic.list : []"
          class="v-item-container"
          :key="index"
        >
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>货物描述</text></view>
            <view class="cell-input-view-right">
              <text class="text-style">{{ item.goodsName || "--" }}</text>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>货物备注</text></view>
            <view class="cell-input-view-right">
              <text class="text-style">{{ item.remark || "--" }}</text>
            </view>
          </view>
          <!-- <view class="cell-input-view">
						<view class="cell-input-view-left"><text>起运地点</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ item.transportAddress || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>目标地点</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ item.arrivalAddress || '--' }}</text>
						</view>
					</view> -->
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>物流费用</text></view>
            <view class="cell-input-view-right">
              <text class="text-style">{{ item.logisticsCarriage || "0" }}</text>
            </view>
          </view>
          <!-- <view class="cell-input-view">
						<view class="cell-input-view-left"><text>里程数</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ item.distance || '--' }}</text>
						</view>
					</view> -->
          <view class="line-s" />
        </view>
      </view>
    </view>
    <view style="height: 80px; width: 100%"></view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
      <view class="bottom-right-view" @click="clicksave"><text>保存</text></view>
    </view>
    <!-- 类型选择 -->
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
      @confirm="onConfirm"
      :disabledAfter="false"
      :pickControl="true"
      ref="date"
      themeColor="#E60000"
    />
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";

export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    labelPhone,
    wPicker,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      transDic: {},
      selectList: [],
      selectType: "",
    };
  },
  onLoad(option) {
    uni.getStorage({
      key: this.$savekey.USER_INFO_MEG,
      success: (res) => {
        this.transDic = {
          ...this.transDic,
          customerSalesmanId: res.data.id,
          customerSalesmanName: res.data.username,
        };
      },
      complete: () => {
        this.getBusinessNo();
      },
    });
    this.getUserLeaders();

    uni.$on("pay-trans-emit", (data) => {
      let dict = data.dict;
      this.transDic = {
        ...this.transDic,
        logisticsCompanyId: dict.id,
        logisticsCompanyName: dict.name,
        logisticsContact: dict.contacts,
        logisticsPhone: dict.phoneNum,
      };
      this.resetAllList();
    });
    uni.$on("pay-logistic-list", (data) => {
      let list = data.item;
      this.getTotal(list);
    });
  },
  methods: {
    getTotal(list) {
      let logisticsCarriage = 0;
      // let distance = 0;
      let ids = list.map((o) => {
        logisticsCarriage = logisticsCarriage + parseFloat(o.logisticsCarriage || 0);
        // distance = distance + parseFloat(o.distance || 0)
        return o.id;
      });
      let json = JSON.stringify();
      this.transDic = {
        ...this.transDic,
        logisticsRecordCargoInfoIds: ids,
        trainNumber: list.length.toString(),
        paidTotal: this.$datestr.doubleFloat(logisticsCarriage),
        // distance:this.$datestr.doubleFloat(distance),
        payable: this.$datestr.doubleFloat(logisticsCarriage),
        list: list,
      };
    },
    getBusinessNo() {
      let url = this.$url.CREATE_LOGISTICS_NO.replace(/{type}/, "WLYF");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.transDic = {
            ...this.transDic,
            businessNo: result,
          };
        })
        .catch((err) => {});
    },
    //业务负责人
    getUserLeaders() {
      let param = {
        showAdmin: false,
        orgId: "",
        // roleType : this.$savekey.USER_ROLE_SEVICER
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          this.selectList = result.map((o) => {
            return {
              label: o.username,
              value: o.id,
            };
          });
        })
        .catch((err) => {});
    },
    getallMoney(item) {
      let machinePayableList = item.machinePayableList || [];
      let total = 0;
      machinePayableList.forEach((o) => {
        total = total + parseFloat(o.payableTotal);
      });
      return this.$datestr.doubleFloat(total);
    },
    getleft(item) {
      let total = this.$datestr.doubleFloat(item.total) || 0;
      let paidTotal = this.$datestr.doubleFloat(item.paidTotal) || 0;
      return this.$datestr.doubleFloat(parseFloat(total) + parseFloat(paidTotal));
    },
    getDate(time) {
      if (!time) {
        return "";
      }
      let timestr = time.split(/\s+/)[0];
      return timestr;
    },
    chooseItem(type) {
      this.selectType = type;
      if (this.selectType === "salesman") {
        this.$refs.selector.show();
      } else if (this.selectType === "start") {
        this.$refs.date.show();
      } else if (this.selectType === "end") {
        this.$refs.date.show();
      } else if (this.selectType === "company") {
        uni.navigateTo({
          url: "./chooseTransCompany",
        });
      }
    },
    addlogistic() {
      if (!this.transDic.logisticsCompanyId || this.transDic.logisticsCompanyId === "") {
        uni.showToast({
          icon: "none",
          title: "请选择物流方",
        });
        return;
      }
      if (!this.transDic.startTime || this.transDic.startTime === "") {
        uni.showToast({
          icon: "none",
          title: "请选择应付开始日期",
        });
        return;
      }
      if (!this.transDic.endTime || this.transDic.endTime === "") {
        uni.showToast({
          icon: "none",
          title: "请选择应付结束日期",
        });
        return;
      }
      uni.navigateTo({
        url:
          "./chooseTransList?item=" + encodeURIComponent(JSON.stringify(this.transDic)),
      });
    },
    onConfirm(val) {
      if (this.selectType === "salesman") {
        this.transDic = {
          ...this.transDic,
          customerSalesmanId: val.checkArr.value,
          customerSalesmanName: val.checkArr.label,
        };
      } else if (this.selectType === "start") {
        this.transDic = {
          ...this.transDic,
          startTime: val.result + " 00:00:00",
        };
        this.resetAllList();
        this.$refs.date.hide();
      } else if (this.selectType === "end") {
        this.transDic = {
          ...this.transDic,
          endTime: val.result + " 23:59:59",
        };
        this.resetAllList();
        this.$refs.date.hide();
      }
    },
    resetAllList() {
      this.transDic = {
        ...this.transDic,
        logisticsRecordCargoInfoIds: [],
        trainNumber: "0",
        distance: null,
        payable: "0",
        list: [],
      };
    },
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    clicksave() {
      if (!this.transDic.logisticsCompanyId || this.transDic.logisticsCompanyId === "") {
        uni.showToast({
          icon: "none",
          title: "请选择物流方",
        });
        return;
      }
      if (!this.transDic.startTime || this.transDic.startTime === "") {
        uni.showToast({
          icon: "none",
          title: "请选择应付开始日期",
        });
        return;
      }
      if (!this.transDic.endTime || this.transDic.endTime === "") {
        uni.showToast({
          icon: "none",
          title: "请选择应付结束日期",
        });
        return;
      }
      if (!this.transDic.customerSalesmanId || this.transDic.customerSalesmanId === "") {
        uni.showToast({
          icon: "none",
          title: "请选择我方负责人",
        });
        return;
      }
      if (
        !this.transDic.logisticsRecordCargoInfoIds ||
        this.transDic.logisticsRecordCargoInfoIds.length === 0
      ) {
        uni.showToast({
          icon: "none",
          title: "请选择物流记录",
        });
        return;
      }
      this.$network
        .getData(this.$url.LOGISTICES_PAY_ADD, "POST", this.transDic)
        .then((result) => {
          uni.$emit("refresh-pay-list", {
            type: "refund",
          });
          uni.navigateBack({
            delta: 1,
          });
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.pause-bg {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px;
  background: #ffffff;
  border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: $uni-line-color 1px dotted;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.text-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.model-tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  padding: 15px;
  align-items: center;
}

.tag-right,
.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}
.add-style {
  padding: 3px 5px;
  background: $uni-color-primary;
  border-radius: 3px;
  color: #ffffff;
  font-weight: normal;
  font-size: $uni-font-size-base;
}
.labelstyle {
  color: $uni-color-primary;
  font-size: 20px;
  margin-left: 10px;
}

.attachment-icon {
  color: $uni-color-primary;
  font-size: 10px;
  margin-left: 10px;
}

.delete-items-icon {
  color: #ff0000;
  font-size: 14px;
  margin-left: 10px;
}

.vehicle-list-container {
  padding: 15px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.item-row tag-select {
  flex: 1;
}

.pause-options {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: $uni-color-primary;
}

.item-row text {
  flex: 1;
}

.line-s {
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;
  height: 1px;
  background: #eeeeee;
}
.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}
</style>
