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
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>选择物流方</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ transDic.logisticsCompanyName || "--" }}</text>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>物流方联系人</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ transDic.logisticsContact || "--" }}</text>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>联系人电话</text></view>
        <view class="cell-input-view-right">
          <view class="text-style">
            <labelPhone :value="transDic.logisticsPhone" />
          </view>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>应付开始日期</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ getDate(transDic.startTime) }}</text>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>应付结束日期</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ getDate(transDic.endTime) }}</text>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"><text>我方负责人</text></view>
        <view class="cell-input-view-right">
          <text class="text-style">{{ transDic.customerSalesmanName || "--" }}</text>
        </view>
      </view>
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
            $datestr.doubleFloat(transDic.payable) || "0.00"
          }}</text>
        </view>
      </view>
    </view>
    <view class="sum-view-bg">
      <view class="model-tag">
        <text>货物物流记录</text>
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
						<view class="cell-input-view-left"><text>距离</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ item.distance || '--' }}</text>
						</view>
					</view> -->
          <view class="line-s" />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";

export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    labelPhone,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      transDic: {},
      itemDic: {},
    };
  },
  onLoad(option) {
    this.itemDic = JSON.parse(decodeURIComponent(option.item));
    this.getData();
  },
  methods: {
    getData(list) {
      uni.showLoading();
      let url = this.$url.LOGISTICES_PAY_DETAIL + this.itemDic.id;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.transDic = {
            ...result,
            list: JSON.parse(result.logisticsRecordCargoInfos),
          };
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getDate(time) {
      if (!time) {
        return "";
      }
      let timestr = time.split(/\s+/)[0];
      return timestr;
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
