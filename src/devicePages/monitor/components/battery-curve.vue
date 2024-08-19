<template>
  <view class="working-content" scroll-y="true">
    <!-- <view class="chart-content">
			<view class="line">
				<text>当前电量</text>
				<text>{{dataDic.batteryPower}}%</text>
			</view>
			<view class="line">
				<text>满电电压值</text>
				<text>26.3V</text>
			</view>
			<view class="line">
				<text>电池健康度</text>
				<text class="text-success">优秀</text>
			</view>
		</view> -->
    <view
      class="chart-content p flex align-center justify-between"
      @click="goTo('detail')"
      v-if="!oilMachine.includes(dataDic.machineTypeName)"
    >
      <text class="text-primary">查看电池详情</text>
      <text class="iconfont iconarrow-right text-gray text-xl"></text>
    </view>
    <view
      class="chart-content p flex align-center justify-between"
      @click="goTo('record')"
      v-if="!oilMachine.includes(dataDic.machineTypeName)"
    >
      <text class="text-primary">查看电池修改记录</text>
      <text class="iconfont iconarrow-right text-gray text-xl"></text>
    </view>
    <view class="chart-content">
      <view class="line bl">
        <text class="text-bold text-black"
          >每日用{{
            oilMachine.includes(dataDic.machineTypeName) ? "油" : "电"
          }}量概况(%)</text
        >
        <c-form-datepicker
          mode="yearMonth"
          v-model="month"
          icon-name="iconarrow-right"
        ></c-form-datepicker>
      </view>
      <canvas
        @touchstart="touchMonthChart"
        type="2d"
        canvas-id="month_chart"
        id="month_chart"
      ></canvas>
    </view>
    <view class="chart-content">
      <view class="line bl">
        <text class="text-bold text-black"
          >每日{{
            oilMachine.includes(dataDic.machineTypeName) ? "油" : "电"
          }}量</text
        >
        <c-form-datepicker
          mode="date"
          v-model="date"
          icon-name="iconarrow-right"
        ></c-form-datepicker>
      </view>
      <canvas
        @touchstart="touchDayChart"
        type="2d"
        canvas-id="day_chart"
        id="day_chart"
      ></canvas>
    </view>
  </view>
</template>

<script>
import uCharts from "@/components/common/u-charts/u-charts";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import hoursUtil from "@/common/util/day-working-hours.js";
import calRent from "@/common/util/cal-rent-money.js";
import selectView from "@/components/common/common-ui/selector-view.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import { canvasCtx } from "@/common/util/util";
import { mapState } from "vuex";
var _self;
var monthChart = null;
var dayChart = null;
export default {
  name: "WorkingHours",
  components: {
    wPicker,
    labelArrow,
    selectView,
    selectLabelItem,
  },
  props: {
    licenseId: {
      type: String, //当前选中下标
      default() {
        return "";
      },
    },
    deviceNum: {
      type: String, //当前选中下标
      default() {
        return "";
      },
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      cWidth: "",
      cHeight: "",
      month: this.$datestr.dateFormat(new Date(), "yyyy-MM"),
      date: this.$datestr.dateFormat(new Date(), "yyyy-MM-dd"),
      oilMachine: this.$store.state.machine.oilMachine,
    };
  },
  computed: {
    ...mapState("system", {
      pixelRatio: (s) => s.systemInfo.pixelRatio,
    }),
  },
  watch: {
    licenseId: {
      handler(val) {
        this.getMonthData();
        this.getDayData();
      },
    },
    month() {
      this.getMonthData();
    },
    date() {
      this.getDayData();
    },
  },
  created() {
    _self = this;
    this.cWidth = uni.upx2px(702);
    this.cHeight = uni.upx2px(367);
    this.month = hoursUtil.yearMonthFormat(new Date());
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Device_Administrative,
      "设备监控详情",
      "电池监控"
    );
    console.log(this.dataDic, "dataDic");
  },
  mounted() {
    this.getMonthData();
    this.getDayData();
  },
  methods: {
    goTo(type) {
      switch (type) {
        case "detail":
          let item = {
            licenseId: this.licenseId,
          };
          uni.navigateTo({
            url:
              "/devicePages/battery/change-battery?item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
          break;
        case "record":
          uni.navigateTo({
            url:
              "/devicePages/battery/battery-manage?index=1&licenseId=" +
              this.licenseId,
          });
          break;
        default:
          break;
      }
    },
    async getMonthData() {
      let res = await this.$network.machineMonthBatteryUsage(
        this.licenseId,
        this.month
      );
      this.drawMonthChart(res);
    },
    async drawMonthChart(data) {
      let chartData = {
        categories: data.map((d, i) => i + 1),
        series: [
          {
            type: "column",
            name: "日耗电量",
            color: "#1278FF",
            data: data.map((d) =>
              Number(d.consumeBatteryLevel.replace("%", ""))
            ),
          },
          {
            type: "point",
            pointShape: "rect",
            name: "开始电量",
            color: "#52c41a",
            data: data.map((d) => Number(d.beginBatteryLevel.replace("%", ""))),
          },
          {
            type: "point",
            pointShape: "rect",
            name: "结束电量",
            color: "#E60000",
            data: data.map((d) => Number(d.endBatteryLevel.replace("%", ""))),
          },
        ],
      };

      let context = await canvasCtx("month_chart", this);
      monthChart = new uCharts({
        context,
        type: "mix",
        legend: {
          show: false,
        },
        fontSize: 11,
        fontColor: "#999999",
        background: "#FFFFFF",
        /* #ifdef MP-WEIXIN */
        pixelRatio: _self.pixelRatio,
        /* #endif */
        dataPointShape: true,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          // fontSize: 8,
          labelCount: 16,
          disabled: false,
          // rotateLabel:true,
          disableGrid: true,
        },
        yAxis: {
          disableGrid: false,
          gridType: "dash", //如不写此方法，Y轴刻度默认保留两位小数
          gridColor: "#eeeeee",
          data: [
            {
              disabled: false,
              axisLine: false,
              splitNumber: 5,
              min: 0,
              // max:100
            },
          ],
        },
        dataLabel: false,
        /* #ifdef MP-WEIXIN */
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        /* #endif */
        /* #ifndef MP-WEIXIN */
        width: _self.cWidth,
        height: _self.cHeight,
        /* #endif */
        extra: {
          mix: {
            column: {
              width: (_self.cWidth * 0.45) / chartData.categories.length,
            },
          },
        },
      });
    },
    touchMonthChart(e) {
      let vm = this;
      monthChart.showToolTip(e, {
        textList: [
          { text: "8-31", color: "rgba(0,0,0,0)" },
          { text: "" },
          { text: "" },
          { text: "" },
        ],
        formatter: function (item, category) {
          vm.date =
            vm.month + "-" + (category < 10 ? `0${category}` : category);
          this.textList[0].text = vm.date;
          if (item.name == "开始电量") {
            this.textList[1].text = item.name + ":" + item.data + "%";
            this.textList[1].color = item.color;
          } else if (item.name == "结束电量") {
            this.textList[2].text = item.name + ":" + item.data + "%";
            this.textList[2].color = item.color;
          } else {
            this.textList[3].text = item.name + ":" + item.data + "%";
            this.textList[3].color = item.color;
          }
        },
      });
    },
    async getDayData() {
      let res = await this.$network.machineDayBatteryUsage(
        this.licenseId,
        this.date
      );
      this.drawDayChart(res || []);
    },
    async drawDayChart(data) {
      let chartData = {
        categories: data.map((d, i) => d.x.substr(11, 5)),
        series: [
          {
            type: "line",
            name: "电量",
            color: "#52c41a",
            data: data.map((d) => Number(d.y)),
          },
        ],
      };

      let context = await canvasCtx("day_chart", this);
      dayChart = new uCharts({
        context,
        type: "line",
        legend: {
          show: false,
        },
        fontSize: 11,
        fontColor: "#999999",
        background: "#FFFFFF",
        /* #ifdef MP-WEIXIN */
        pixelRatio: _self.pixelRatio,
        /* #endif */
        dataPointShape: false,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disabled: false,
          labelCount: 7,
          disableGrid: true,
          // rotateLabel:true
        },
        yAxis: {
          disableGrid: false,
          gridType: "dash", //如不写此方法，Y轴刻度默认保留两位小数
          gridColor: "#eeeeee",
          data: [
            {
              disabled: false,
              axisLine: false,
              splitNumber: 5,
              min: 0,
              max: 100,
            },
          ],
        },
        dataLabel: false,
        /* #ifdef MP-WEIXIN */
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        /* #endif */
        /* #ifndef MP-WEIXIN */
        width: _self.cWidth,
        height: _self.cHeight,
        /* #endif */
        extra: {
          mix: {
            column: {
              width: (_self.cWidth * 0.45) / chartData.categories.length,
            },
          },
        },
      });
    },
    touchDayChart(e) {
      let vm = this;
      dayChart.showToolTip(e, {
        textList: [{ text: "8-31", color: "rgba(0,0,0,0)" }, { text: "" }],
        formatter: function (item, category) {
          this.textList[0].text = vm.date + "-" + category;
          if (item.name == "电量") {
            this.textList[1].text = item.name + ":" + item.data + "%";
            this.textList[1].color = item.color;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "./style.scss";

.working-content {
  width: 100%;
  background: $uni-bg-color-grey;
}

.chart-content {
  canvas {
    height: 367rpx;
    width: 702rpx;
  }
}
</style>
