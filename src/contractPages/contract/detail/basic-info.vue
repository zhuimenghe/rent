<template>
  <view class="base-info-content">
    <!--结算信息-->
    <view class="settle">
      <view class="tag-container">
        <view class="tag">{{ settleInfo.tag }}</view>
        <view style="margin-right: 8px">
          <label-arrow
            :value="settleInfo.subTag"
            @clickLabel="goToOverdue"
            textColor="#E60000"
            arrowColor="#E60000"
          ></label-arrow>
        </view>
      </view>
      <view class="info-content">
        <view v-for="(item, index) in settleInfo.baseContent" :key="index">
          <view
            class="h-item-container"
            :class="{ 'box-line': !isLastView('base', index) }"
            v-if="item.isShow"
          >
            <view class="item-label">{{ item.label }} </view>
            <view class="item-value right-content"
              >{{ item.value || "--"
              }}<businessTips :tips="item.tips" v-if="item.tips"
            /></view>
          </view>
        </view>

        <view class="extra-container" v-if="settleInfo.isNeedOperator">
          <view
            class="h-item-container"
            :class="{ 'box-line': !isLastView('extra', index) }"
            v-for="(item, index) in settleInfo.extraContent"
            :key="index"
          >
            <view class="item-label">{{ item.label }}</view>
            <view class="item-value">{{ item.value || "--" }}</view>
          </view>
        </view>
        <view
          class="h-item-container box-line-top"
          v-if="basicInfo.contractDetailDto.prePayWorkInDays"
        >
          <text class="yufu"
            >注意：预付款到账{{
              (basicInfo.contractDetailDto &&
                basicInfo.contractDetailDto.prePayWorkInDays) ||
              ""
            }}天后设备进场</text
          >
        </view>
      </view>
    </view>
    <!--设备信息-->
    <view class="vehicle">
      <view class="tag"
        >{{ vehicleInfo.tag }}
        <view
          style="
            font-size: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
          v-if="basicInfo.contractType === '1'"
        >
          （小计{{ total }}元）
          <businessTips tipName="contractSubtotal" />
        </view>
      </view>

      <view class="vehicle-content">
        <view
          class="vehicle-item info-content"
          v-for="(order, index) in vehicleInfo.orderList"
          :key="index"
        >
          <view class="top-container">
            <view class="left-content">
              <view class="v-title main-text"
                >{{ order.typeName || "--" }}/{{
                  order.heightName || "--"
                }}</view
              >
              <view class="sub-text">{{ order.machineTypeName || "--" }}</view>
              <!-- <view class="v-subTitle sub-text" v-if="order.machineList.length>0">{{order.typeName}}/{{order.height}}米</view> -->
            </view>
            <!-- <view class="left-content">
							<view class="v-title main-text" >转租状态</view>
							<view class="sub-text" v-if="order.subletState==1">转租</view>
							<view class="sub-text" v-else>自有</view>
						</view> -->
            <view class="right-content">
              <view
                class="v-num main-text"
                v-if="basicInfo.contractType === '1'"
                >{{ order.orderNum || "--" }}台</view
              >
              <view class="v-detail sub-text" @click="changeExpand(index)">
                <text style="color: #e60000; font-size: 16px">{{
                  $t("common.detail")
                }}</text>
                <i
                  class="iconfont iconarrow-right"
                  :class="
                    order.isExpand
                      ? 'translate-arrow'
                      : 'translate-arrow-expend'
                  "
                ></i>
              </view>
            </view>
          </view>
          <view
            class="detail-content"
            :class="{ 'expand-radius': order.isExpand }"
            v-if="order.isExpand"
          >
            <view class="row-container">
              <view class="row-item">
                <view
                  class="sub-text"
                  style="display: flex; flex-direction: row"
                  >租赁方式
                  <businessTips tipName="rent" />
                </view>
                <view class="main-text m-item-value">{{
                  order.settlementTypeName
                }}</view>
              </view>
              <view class="row-item">
                <view class="sub-text">租赁单价(元/台)</view>
                <view class="main-text m-item-value">{{
                  order.hire || "0"
                }}</view>
              </view>
              <view class="row-item" v-if="order.settlementType === '4'">
                <view class="sub-text">月租(元/台)</view>
                <view class="main-text m-item-value">{{
                  order.hireMonthly
                }}</view>
              </view>
              <view class="row-item">
                <view class="sub-text">押金(元/台)</view>
                <view class="main-text m-item-value">{{
                  order.pledge || "0"
                }}</view>
              </view>
              <view class="row-item">
                <view class="sub-text">运费类型</view>
                <view class="main-text m-item-value">{{
                  order.carriageTypeName
                }}</view>
              </view>
              <view class="row-item">
                <view class="sub-text">运费(元/台)</view>
                <view class="main-text m-item-value">{{
                  order.carriage || "0"
                }}</view>
              </view>
              <view
                class="row-item"
                v-if="
                  (basicInfo.contractType === '1' && isShowDefault) ||
                  basicInfo.contractType === '3'
                "
              >
                <view class="sub-text">预计进场时间</view>
                <view class="main-text m-item-value">{{
                  getDate(order.beginDate)
                }}</view>
              </view>
              <view
                class="row-item"
                v-if="
                  (basicInfo.contractType === '1' && isShowDefault) ||
                  basicInfo.contractType === '3'
                "
              >
                <view class="sub-text">预计退场时间</view>
                <view class="main-text m-item-value">{{
                  getDate(order.endDate) || "--"
                }}</view>
              </view>
              <view
                class="row-item"
                v-if="
                  (basicInfo.contractType === '1' && isShowDefault) ||
                  basicInfo.contractType === '3'
                "
              >
                <view class="sub-text">预计租期</view>
                <view class="main-text m-item-value">{{
                  order.tenancy || "--"
                }}</view>
              </view>
              <view
                class="row-item"
                v-if="
                  order.machineList.length > 0 &&
                  (basicInfo.contractType === '1' ||
                    basicInfo.contractType === '3')
                "
              >
                <view class="assigned-text" @click="goTo(order)"
                  >已指定设备</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!--用车约定-->
    <view class="appoint">
      <view class="tag">{{ appointInfo.tag }}</view>
      <view class="info-content">
        <view v-for="(item, index) in appointInfo.content" :key="index">
          <view class="v-item-container" v-if="item.isV">
            <view class="v-item-label">{{ item.label }}</view>
            <view class="v-item-value">{{ item.value || "--" }}</view>
          </view>
          <view class="h-item-container box-line" v-else>
            <view class="item-label">{{ item.label }}</view>
            <view class="item-value">{{ item.value || "--" }}</view>
          </view>
        </view>
      </view>
    </view>

    <!--补充信息-->
    <view class="supplement">
      <view class="tag">{{ supplementInfo.tag }}</view>
      <view class="info-content" style="margin-bottom: 16px">
        <view
          class="h-item-container"
          :class="{ 'box-line': !isLastView('supplement', index) }"
          v-for="(item, index) in supplementInfo.content"
          :key="index"
        >
          <view class="item-label">{{ item.label }}</view>
          <view class="item-value">{{ item.value || "" }}</view>
        </view>
        <imgupload :isupload="false" :imgFinishlist="basicInfo.fileList" />
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import imgupload from "@/components/common/image-upload/image-upload.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";

export default {
  components: {
    imgupload,
    labelArrow,
  },
  props: {
    basicInfo: Object,
    default() {
      return {
        contractDetailDto: {
          orderList: [],
        },
      };
    },
  },
  watch: {
    "basicInfo.contractDetailDto"(v) {
      //设备信息
      let list = v.orderList.map((o) => {
        o.isExpand = true;
        return { ...o };
      });
      this.vehicleInfo.orderList = [...list];
      console.log(this.vehicleInfo.orderList, "this.vehicleInfo.orderList ");
      this.total = this.vehicleInfo.orderList.reduce((x, y) => {
        return x + Number(y.total);
      }, 0);
      this.total = this.total.toFixed(2);
    },

    basicInfo(val) {
      this.basicInfo = val;
      let detail = this.basicInfo.contractDetailDto;
      //结算信息
      this.settleInfo.baseContent[0].value = detail.paymentTypeName;
      if (detail.paymentType) {
        //结算日类型
        if (
          detail.paymentType === "2" ||
          detail.paymentType === "3" ||
          detail.paymentType === "4"
        ) {
          this.settleInfo.baseContent[1].value = detail.settlementDayTypeName;
          this.settleInfo.baseContent[1].isShow = true;
        }
        ////结算日
        if (detail.paymentType === "2" && detail.settlementDayType === "2") {
          //月结
          this.settleInfo.baseContent[2].value = detail.settlementDay
            ? detail.settlementDay + "号"
            : "--";
          this.settleInfo.baseContent[2].isShow = true;
        } else if (
          detail.paymentType === "3" &&
          detail.settlementDayType === "2"
        ) {
          //预付
          this.settleInfo.baseContent[2].value = detail.settlementDay
            ? detail.settlementDay + "号"
            : "--";
          this.settleInfo.baseContent[2].isShow = true;
        } else if (
          detail.paymentType === "4" &&
          detail.settlementDayType === "2"
        ) {
          //先预付后月结
          this.settleInfo.baseContent[2].value = detail.settlementDay
            ? detail.settlementDay + "号"
            : "--";
          this.settleInfo.baseContent[2].isShow = true;
        }
        if (detail.paymentType === "3" || detail.paymentType === "4") {
          this.settleInfo.baseContent[3].value = detail.advance;
          this.settleInfo.baseContent[3].isShow = true;
          this.settleInfo.baseContent[4].value = detail.paidAdvance;
          this.settleInfo.baseContent[4].isShow = this.isShowDefault
            ? true
            : false;
          this.settleInfo.baseContent[5].value = detail.debtAdvance;
          this.settleInfo.baseContent[5].isShow = true;
        }
      }

      this.settleInfo.baseContent[6].value = detail.renterTripTypeName; //运费减免约定
      this.settleInfo.baseContent[6].tips = this.isMultiRentalTrip(
        detail.orderList
      )
        ? "该合同存在多种运费减免约定"
        : null;
      this.settleInfo.baseContent[7].value = detail.invoiceTypeName
        ? detail.invoiceTypeName
        : "--";
      this.settleInfo.isNeedOperator = detail.allocateFlag;
      this.settleInfo.baseContent[9].value = this.settleInfo.isNeedOperator
        ? "是"
        : "否";
      this.settleInfo.baseContent[8].value = detail.invoiceTax
        ? detail.invoiceTax + "%"
        : "";
      this.settleInfo.baseContent[8].isShow = detail.invoiceFlag ? true : false;
      if (this.settleInfo.isNeedOperator) {
        this.settleInfo.extraContent[0].value = detail.allocatePrice
          ? detail.allocatePrice + "元"
          : null;
        // this.settleInfo.extraContent[1].value = detail.allocateDays + "元";
      }

      //用车约定
      this.appointInfo.content[0].value = detail.projectName;
      this.appointInfo.content[1].value = detail.constructionTypeName;
      this.appointInfo.content[2].value = detail.rentalTypeName;
      this.appointInfo.content[3].value = detail.deliveryPlace;
      this.appointInfo.content[4].value = detail.returnPlace;
      this.appointInfo.content[5].value = detail.covenants;

      //补充信息
      this.supplementInfo.content[0].value = this.basicInfo.signDate
        ? this.getDate(this.basicInfo.signDate)
        : "--";
      this.supplementInfo.content[1].value = this.basicInfo.paperContractNo
        ? this.basicInfo.paperContractNo
        : "--";
    },
  },
  data() {
    return {
      settleInfo: {
        tag: "结算信息",
        subTag: "逾期记录",
        isNeedOperator: true, //是否需要操作人員 true: 显示 extraContent 人天单价和加班人天
        //基础数据
        baseContent: [
          {
            label: "支付约定",
            value: "无固定计算方式",
            isShow: true,
          },
          {
            label: "结算日类型",
            value: "",
            isShow: false,
          },
          {
            label: "结算日",
            value: "",
            isShow: false,
          },
          {
            label: "预付金额",
            value: "",
            isShow: false,
          },
          {
            label: "已付金额",
            value: "",
            isShow: false,
          },
          {
            label: "应收金额",
            value: "",
            isShow: false,
          },
          {
            label: "运费减免约定",
            value: "",
            isShow: true,
            tips: null,
          },
          {
            label: "开发票",
            value: "",
            isShow: true,
          },
          {
            label: "发票税额",
            value: "",
            isShow: false,
          },
          {
            label: "配备人员",
            value: "",
            isShow: true,
          },
        ],
        //扩展数据
        extraContent: [
          {
            label: "人天单价",
            value: "",
          },
          // ,
          // {
          // 	label: "加班人天",
          // 	value: ""
          // }
        ],
      },
      vehicleInfo: {
        tag: "设备信息",
        orderList: [],
      },
      appointInfo: {
        tag: "用车约定",
        content: [
          {
            label: "项目名称",
            value: "",
          },
          {
            label: "施工类别",
            value: "",
          },
          {
            label: "租赁性质",
            value: "",
          },
          {
            label: "交车地点",
            value: "",
          },
          {
            label: "归还地点",
            value: "",
          },
          {
            label: "其他约定",
            value: "",
            isV: true, //行布局
          },
        ],
      },
      supplementInfo: {
        tag: "补充信息",
        content: [
          {
            label: "合同签订日",
            value: "",
          },
          {
            label: "纸质合同号",
            value: "",
          },
        ],
      },
      total: "--",
      isShowDefault: true,
    };
  },
  created() {
    let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
    if (resData) {
      let obj = resData.find((o) => o.code === "tenant_name");
      if (obj) {
        this.isShowDefault = obj.value === "liangXu" ? false : true;
      }
    }
  },
  methods: {
    isMultiRentalTrip(orderList) {
      let list = orderList.filter(function (o, index, self) {
        return (
          self.findIndex(
            (x) =>
              x.renterTripType &&
              o.renterTripType &&
              x.renterTripType == o.renterTripType
          ) == index
        );
      });

      return list && list.length > 1 ? true : false;
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    //展开闭合页面
    changeExpand(pos) {
      this.vehicleInfo.orderList[pos].isExpand =
        !this.vehicleInfo.orderList[pos].isExpand;
    },
    /** 是否是最后一个item view
     * @param {Object} type
     * @param {Object} index
     */

    isLastView(type, index) {
      let self = this;
      switch (type) {
        case "base":
          return (
            index == self.settleInfo.baseContent.length - 1 &&
            !self.settleInfo.isNeedOperator
          );
          break;
        case "extra":
          return index == self.settleInfo.extraContent.length - 1;
          break;
        case "supplement":
          return index == self.supplementInfo.content.length - 1;
          break;
        default:
          break;
      }
      return false;
    },
    /*
     *订单设备title
     * @param {Object} order
     */
    getOrderTitle(order) {
      if (order && order.machineList) {
        return order.machineList.length > 0
          ? `${
              order.machineList[0].machineBrand
                ? order.machineList[0].machineBrand
                : ""
            }/${
              order.machineList[0].machineTypeName
                ? order.machineList[0].machineTypeName
                : ""
            }`
          : `${order.typeName ? order.typeName : ""}/${
              order.height ? order.height : ""
            }米`;
      }
      return "";
    },
    /**
     * 获取租金
     * 日租获取日租金 hire，月租或日租转月租 获取hireMonthly
     * @param {Object} order
     */
    getHire(order) {
      return order.settlementType == "1" ? order.hire : order.hireMonthly;
    },
    goTo(order) {
      uni.navigateTo({
        url:
          "./assigned-vehicle?machineList=" +
          encodeURIComponent(JSON.stringify(order.machineList)),
      });
    },
    goToOverdue() {
      uni.navigateTo({
        url:
          "/otherPages/overdue/overdue-record?type=contract&contractNo=" +
          this.basicInfo.businessNo,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.yufu {
  color: #e60000;
}
.base-info-content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
}

/**公共组件**/
.container {
  margin: 8px;
}

.tag-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

/**信息标题**/
.tag {
  margin: 12px 8px 8px 0px;
  color: $uni-text-color;
  font-weight: bold;
  padding-left: 8px;
  border-left: 2px solid #e60000;
  font-size: $uni-font-size-base;
}

/**具体信息外边框**/
.info-content {
  background-color: #ffffff;
  border-radius: 4px;
  margin: 8px;
}

/**单行item分割线**/
.box-line {
  border-width: 0px 0px 1rpx 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}
.box-line-top {
  border-width: 1rpx 0px 0px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
}

/**单行item**/
.h-item-container {
  padding: 16px 0px;
  margin: 0px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

//两行item
.v-item-container {
  padding: 16px 0px;
  margin: 0px 16px;
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

/**两行item的标签名**/
.v-item-label {
  font-size: $uni-font-size-base;
  color: $uni-text-color-grey;
}

/**两行item值**/
.v-item-value {
  padding: 8px;
  margin-top: 10px;
  border-radius: 4px;
  height: 60px;
  background-color: #fbfbfb;
}

/**单行item的标签名**/
.item-label {
  font-size: $uni-font-size-base;
  color: $uni-text-color-grey;
  min-width: 100px;
  width: 100px;
}

/**单行item值**/
.item-value {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  // height: 24px;
  // line-height: 24px;
}

/************************设备信息************************/

/**黑色14号字体**/
.main-text {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

/**灰色12号字体**/
.sub-text {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-gray;
}

.assigned-text {
  font-size: $uni-font-size-sm;
  color: $uni-color-primary;
}

/**单行item值**/
.m-item-value {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  height: 24px;
  line-height: 24px;
}

.vehicle-item {
  margin-bottom: 8px;
}

/**设备信息item 第一行**/
.top-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.right-content {
  display: flex;
  flex-direction: row;
}

.v-title,
.v-num {
  font-weight: 500;
}

.v-subTitle {
  margin-left: 8px;
}

.v-detail {
  margin-left: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/**详情箭头动画**/
.translate-arrow {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(-90deg);
  transition: all 500ms;
  color: #e60000;
}

.translate-arrow-expend {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(90deg);
  transition: all 500ms;
  color: #e60000;
}

.expand-radius {
  border-radius: 0px 0px 4px 4px;
}

.no-expand-radius {
  border-radius: 4px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  padding: 16px;
}

.row-container {
  display: flex;
  flex-direction: row;
  padding-bottom: 8px;
  flex-wrap: wrap;
}

.row-item {
  width: 50%;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
