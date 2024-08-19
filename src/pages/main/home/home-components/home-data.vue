<template>
  <view
    class="databgclass"
    v-if="revenuePrivilege || personPrivilege || serviceTask"
  >
    <s-sany-popup ref="customToast"></s-sany-popup>
    <!-- 设备总览 -->
    <view class="over-view-bg">
      <view class="title-bg">
        <view class="title-left">{{ "设备总览" }}</view>
        <view class="title-right" @click="gotoInventory()">
          <text style="color: #e60000">{{ "更多" }}</text>
          <i class="iconfont title-icon iconarrow-right"></i>
        </view>
      </view>
      <view class="over-view-content">
        <view class="charts-box">
          <canvas
            type="2d"
            canvas-id="arcbar"
            id="arcbar"
            class="charts"
            @touchend="tap"
          />
        </view>
        <view class="middle">
          <p style="font-weight: 700; font-size: 16px">
            {{ inventory.totalCount }}
          </p>
          <p style="color: #8c8c8c; font-size: 12px">总数</p></view
        >
        <view class="right">
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.selfCount }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">自有</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.subLetCount }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">转租</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.forRentCount }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">待租</p></view
          >
          <view class="">
            <p style="font-weight: 700; font-size: 16px">
              {{ inventory.inRentCount }}
            </p>
            <p style="color: #8c8c8c; font-size: 12px">已租</p></view
          >
        </view>
      </view>
    </view>

    <view class="data-head">
      <!-- <view class="org-bg" @click="showPick('org')">
        <view class="org-content">{{ orgDic.label }}</view>
        <i class="iconfont org-icon iconzl--zhankai"></i>
      </view> -->
      <view class="data-head-title">
        <view
           :class="{
            'unselect-style': dataType != '1',
            'select-style': dataType == '1',
          }"
           @click="clickDate('1')"
          >本月</view
          >
      <view
            :class="{
              'unselect-style': dataType != '4',
              'select-style': dataType == '4',
            }"
            @click="clickDate('4')"
            >上月</view
          >
      <view
        :class="{
          'unselect-style': dataType != '2',
          'select-style': dataType == '2',
        }"
        @click="clickDate('2')"
        >本年</view
        >
        <view
          :class="{
            'unselect-style': dataType != '5',
            'select-style': dataType == '5',
          }"
          @click="clickDate('5')"
          >累计</view
        >
        <view
          :class="{
          'unselect-style': dataType != '3',
          'select-style': dataType == '3',
          }"
          @click="clickDate('3')"
          >自定义</view
        >
      </view>
      <view class="data-head-time" v-if="dataType == '3'">
        <labelArrowView
          class="flex-sub"
          placeholder="请选择开始时间"
          :content="startTime"
          :iconstr="iconstr"
          @clickItem="showPick('start')"
        />
        <labelArrowView
          class="flex-sub"
          style="margin-left: 40rpx"
          placeholder="请选择结束时间"
          :content="endTime"
          :iconstr="iconstr"
          @clickItem="showPick('end')"
        />
        <view class="search-go" @click="searchClick">{{ "搜索" }}</view>
      </view>
    </view>
    <!-- 营收统计 -->
    <view class="sum-view-bg" v-if="revenuePrivilege">
      <view class="title-bg">
        <view class="title-left">{{ "营收统计" }}</view>
        <view class="title-right" @click="moreClick('revenue')">
          <text style="color: #e60000">{{ "更多" }}</text>
          <i class="iconfont title-icon iconarrow-right"></i>
        </view>
      </view>
      <view class="content-box">
        <view
          v-for="(item, index) in revenueList"
          :class="{'content-bg':true,'no-border':index==revenueList.length-1}"
          :key="index"
        >
        <view class="content-left">
          <view
            class="content-icon-bg"
            :style="{ background: item.background }"
          >
            <i
              class="iconfont content-icon"
              :class="item.icon"
              :style="{ color: item.color }"
            ></i>
          </view>
          <view class="content-title">{{ item.name }}</view>
          <!-- <view
            style="color: #fe8020; font-size: 28rpx; margin-left: 8rpx"
            v-if="index == 0"
            @click="moreClick('revenue')"
            >（明细）</view
          > -->
        </view>
        <view class="content-right">￥{{ item.data }}</view>
      </view>
      </view>
      
    </view>
    <!-- 个人看板 -->
    <!-- <view class="sum-view-bg" v-if="personPrivilege">
      <view class="title-bg">
        <view class="title-left">{{ "个人看板" }}</view>
        <view class="title-right">
					<text style="color: #E60000;">{{'更多'}}</text>
					<i class="iconfont title-icon iconarrow-right"></i>
				</view>
      </view>
      <view
        class="content-bg"
        v-for="(item, index) in personRevenue"
        :key="index"
        @click="clickPerson(item.type)"
      >
        <view class="content-left">
          <view
            class="content-icon-bg"
            :style="{ background: item.background }"
          >
            <i
              class="iconfont content-icon"
              :class="item.icon"
              :style="{ color: item.color }"
            ></i>
          </view>
          <view class="content-title">{{ item.name }}</view>
        </view>
        <view class="content-right">{{ item.data }}</view>
        <i
          class="iconfont content-right-icon iconarrow-right"
          v-if="item.showArrow == '1'"
        ></i>
      </view>
    </view> -->
    <!-- 服务任务 -->
    <view class="sum-view-bg" v-if="serviceTask">
      <view class="title-bg">
        <view class="title-left">{{ "服务任务" }}</view>
        <view class="title-right" @click="moreClick('service')">
          <text style="color: #e60000">{{ "更多" }}</text>
          <i class="iconfont title-icon iconarrow-right"></i>
        </view>
      </view>
      <view class="content-box">
        <view v-for="(item, index) in serviceList" :key="index">
          <view
            :class="{'content-bg':true,'no-border':index==serviceList.length-1}"
            v-if="getPraShow(item)"
          >
            <view class="content-left">
              <view
                class="content-icon-bg"
                :style="{ background: item.background }"
              >
                <i
                  class="iconfont content-icon"
                  :class="item.icon"
                  :style="{ color: item.color }"
                ></i>
              </view>
              <view class="content-title">{{ item.name }}</view>
            </view>
            <view class="content-right">{{ item.data || "0" }}台</view>
          </view>
        </view>
      </view>
    </view>
    <view class="pop-container">
      <uni-popup ref="startDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <text>营收统计</text>
          <view
            class="row-item"
            @click="clickItem('contract')"
            v-if="revenueType != '1' && contractStatistics"
          >
            <text>合同营收统计</text>
          </view>
          <view
            class="row-item"
            @click="clickItem('device')"
            v-if="revenueType != '1' && deviceStatistics"
          >
            <text>设备营收统计</text>
          </view>
          <view
            class="row-item"
            @click="clickItem('contract')"
            v-if="revenueType == '1' && contractLXStatistics"
          >
            <text>合同履约营收统计</text>
          </view>
          <view
            class="row-item"
            @click="clickItem('device')"
            v-if="revenueType == '1' && deviceLXStatistics"
          >
            <text>设备履约营收统计</text>
          </view>
          <view
            class="row-item"
            style="background: #dcdcdc"
            @click="clickItem('cancle')"
            ><text>取消</text></view
          >
        </view>
      </uni-popup>
    </view>
  </view>
</template>
<script>
import labelArrowView from "@/components/common/common-ui/choose-item-view.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import uCharts from "../../../../components/common/u-charts/u-charts";
import { mapState } from "vuex";
import { canvas2dCtx } from "@/common/util/util";
var uChartsInstance = {};
export default {
  components: {
    labelArrowView,
    uniPopup,
  },
  props:{
    orgDic:{
      type:Object,
      default () {
					return {};
				}
    }
  },
  data() {
    return {
      iconstr: "iconzl--rili",
      // 设备
      inventory: {
        rate:0,
        totalCount:0,
        selfCount:0,
        subLetCount:0,
        forRentCount:0,
        inRentCount:0
      },
      //区域
      orgIdList: [],
      //时间
      dataType: "1",
      settlement:0,//结算营收
      isneedsystemTime: false,
      systemTime: "",
      startTime: "",
      endTime: "",
      //数据
      revenueType: "5", //租户营收类别配置
      receivableType: "2", //当前是账期营收方式时，获取账期类型
      revenueList: [
      {
              icon: "iconyingshou",
              name: "履约营收(A)",
              tip: "homeReceived",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#3988FF",
            },
            {
              icon: "iconyingshou",
              name: "履约欠款(A-C)",
              tip: "homePayable",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#08DBE9",
            },
            {
              icon: "iconyingshou",
              name: "结算营收(B)",
              tip: "homeSettlement",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#FE931F",
            },
            {
              icon: "iconyingshou",
              name: "结算欠款(B-C)",
              tip: "homeDebt",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#52C41A",
            },
            {
              icon: "iconyingshou",
              name: "实收金额(C)",
              tip: "homeReceipt",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#FE931F",
            },
            {
              icon: "iconyingshou",
              name: "成本",
              tip: "homeTotalCost",
              data: 0,
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#1278FF",
            },
      ],
      personRevenue: [
        {
          icon: "iconyingshou",
          data: "￥0",
          name: "营收",
          showArrow: "1",
          type: "personrevenue",
          color: "#FFFFFF",
          background: "#1278FF",
        },
        {
          icon: "iconshishou",
          data: "￥0",
          name: "实收",
          showArrow: "0",
          type: "",
          color: "#FFFFFF",
          background: "#10CBE1",
        },
        {
          icon: "iconyingshou1",
          data: "￥0",
          name: "应收",
          showArrow: "0",
          type: "",
          color: "#FFFFFF",
          background: "#FE931F",
        }
      ],
      serviceList: [
        {
          icon: "iconzl--weixiu",
          name: "维修",
          data: 0,
          showArrow: "0",
          type: "",
          color: "#FFFFFF",
          background: "#1278FF",
          key: "repairTodoList",
        },
        {
          icon: "iconshebeibaoyang",
          name: "保养",
          data:0,
          showArrow: "0",
          type: "",
          color: "#FFFFFF",
          background: "#10CBE1",
          key: "maintainTodoList",
        },
        {
          icon: "iconshebeixunjian",
          name: "巡检",
          data: 0,
          showArrow: "0",
          type: "",
          color: "",
          background: "#FE931F",
          key: "inpectionTodoList",
        },
        {
          icon: "iconshebeijianxiu",
          name: "检修",
          data: 0,
          showArrow: "0",
          type: "",
          color: "",
          background: "#FD473B",
          key: "checkTodoList",
        }
      ],
      //权限
      revenuePrivilege: true, //营收统计
      personPrivilege: true, //个人看板
      contractStatistics: true, //合同营收统计
      deviceStatistics: true, //设备营收统计
      contractLXStatistics: true, //合同营收统计
      deviceLXStatistics: true, //设备营收统计
      staffStatistics: true, //員工营收统计
      customerStatistics: true, //客户营收统计
      serviceTask: true, //服务任务
    };
  },
  created() {
    // this.init()
  },
  mounted() {
    this.getOverViewData();
  },
  watch: {
    // overView: {
    //   handler(val) {
    //     this.drawCharts("arcbar", val);
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
  computed: {
    ...mapState("system", {
      // #ifdef MP-WEIXIN
      pixelRatio: (s) => s.systemInfo.pixelRatio,
      // #endif
      // #ifndef MP-WEIXIN
      pixelRatio: (s) => 1,
      // #endif
    }),
  },
  methods: {
    init(){
      //权限
      let privilegeData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
      if (privilegeData) {
        this.revenuePrivilege = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_CHART_CREDIT
        );
        this.personPrivilege = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_CHART_BUSINESS
        );
        this.contractStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_REVENUE_STATISTICS
        );
        this.deviceStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_DEVICE_REVENUE_STATISTICS
        );
        this.contractLXStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_CONTRACT_LX_REVENUE_QRCODE
        );
        this.deviceLXStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_MACHINE_LX_REVENUE_QRCODE
        );
        this.staffStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_STAFF_REVENUE_STATISTICS
        );
        this.customerStatistics = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_CUSTOMER_REVENUE_STATISTICS
        );
        this.serviceTask = privilegeData.some(
          (x) => x.value === this.$savekey.PERMISSION_SERVICE_TASK
        );
      }
      // 设备总览
      //客户信息
      let usermsgData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      if (usermsgData) {
        this.customerId = usermsgData.id;
      }
      //系统默认参数
      let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
      if (resData) {
        let issystem = resData.find((o) => o.code == "use_tenant_start_date"); //是否启用系统时间
        let dateobj = resData.find((o) => o.code == "tenant_start_date"); //系统启用时间
        let revenueTypeObj = resData.find((o) => o.code == "receivable_config"); //租户营收类别配置
        let receivableTypeObj = resData.find((o) => o.code === "account_type"); //当前是账期营收方式时，获取账期类型
        if (issystem) {
          //是不是默认显示合同中的进场时间
          this.isneedsystemTime = issystem.value == "true" ? true : false;
          if (this.isneedsystemTime && dateobj) {
            this.systemTime = dateobj.value;
          } else {
            this.systemTime = this.$dateUtil.getFirstDayOfMonth(new Date());
          }
        } else {
          this.isneedsystemTime = false;
          this.systemTime = this.$dateUtil.getFirstDayOfMonth(new Date());
        }
        if (revenueTypeObj) {
          this.revenueType = revenueTypeObj.value;
        }
        if (receivableTypeObj) {
          //是不是默认显示合同中的进场时间
          this.receivableType = receivableTypeObj.value;
        }
        this.startTime = this.systemTime;
        this.endTime = this.$dateUtil.timeFormat(new Date());
        if (this.revenuePrivilege) {
          this.getReceivedData();
        }
        if (this.personPrivilege) {
          this.getPersonData();
        }
        if (this.serviceTask) {
          this.getTastServer();
        }
      }
    },
    // ---------设备总览---------------
    // 获取设备总览数据
    getOverViewData() {
      return new Promise((resolve,reject)=>{
        this.$network
        .getData(this.$url.MACHINE_OVERALL, "GET", {})
        .then((res) => {
          this.inventory = res;
          console.log(this.inventory);

          let arcbar = {
            series: [
              {
                name: "正确率",
                color: "#FFAB60",
                data: res.rate,
              },
            ],
          };
          this.drawCharts("arcbar", arcbar);
          resolve(res)
        })
        .catch((err) => {
          let arcbar = {
            series: [
              {
                name: "正确率",
                color: "#FFAB60",
                data: 0,
              },
            ],
          };
          this.drawCharts("arcbar", arcbar);
          reject(err)
        });
      })
     
    },
    async drawCharts(id, data) {
      let context = uni.createCanvasContext(id, this);
      // #ifdef MP-WEIXIN
      context = await canvas2dCtx("#" + id, this);
      // #endif
      let cWidth = uni.upx2px(160);
      let cHeight = uni.upx2px(160);
      uChartsInstance[id] = new uCharts({
        type: "arcbar",
        context,
        width: cWidth * this.pixelRatio,
        height: cHeight * this.pixelRatio,
        pixelRatio: this.pixelRatio,
        series: data.series,
        animation: true,
        background: "#FFFFFF",
        padding: undefined,
        title: {
          name: (data.series[0].data * 100).toFixed(2) + "%",
          color: "#FFAB60",
          fontSize: 18,
        },
        subtitle: {
          name: "出租率",
          fontSize: 12,
          color: "#8c8c8c",
        },
        extra: {
          arcbar: {
            type: "circle",
            width: 4,
            startAngle: 1.5,
            endAngle: 0.25,
            gap: 2,
            borderColor: "#ffffff",
          },
        },
      });
    },
    gotoInventory() {
      uni.navigateTo({
        url: "/devicePages/inventory/inventory",
      });
    },
    tap(e) {
      uChartsInstance[e.target.id].touchLegend(e);
      uChartsInstance[e.target.id].showToolTip(e);
    },
    //更多
    moreClick(type) {
      if (type == "revenue") {
        if (
          !this.contractStatistics &&
          !this.deviceStatistics &&
          !this.contractLXStatistics &&
          !this.deviceLXStatistics
        ) {
          uni.showToast({
            icon: "none",
            title: "用户没有对应的菜单权限,请联系管理员",
          });
          return;
        }
        this.selectType = type;
        this.$refs.startDialog.open();
      } else if (type == "service") {
        if (!this.serviceTask) {
          uni.showToast({
            icon: "none",
            title: "用户没有对应的菜单权限,请联系管理员",
          });
          return;
        }
        this.selectType = type;
        uni.navigateTo({
          url:
            "/deviceNoticePages/my-notify/my-notify-total?beginDate=" +
            this.startTime +
            "&endDate=" +
            this.endTime +
            "&orgObj=" +
            encodeURIComponent(JSON.stringify(this.orgDic)) +
            "&stateDic=" +
            encodeURIComponent(
              JSON.stringify({ value: "1", label: "已下发待领取" })
            ),
        });
      }
    },
    //个人看板点击
    clickPerson(type) {
      let resdata = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      let userObj = {
        label: resdata.username,
        value: resdata.id,
      };
      if (type == "personrevenue") {
        if (!this.contractStatistics) {
          uni.showToast({
            icon: "none",
            title: "用户没有对应的菜单权限,请联系管理员",
          });
          return;
        }
        uni.navigateTo({
          url:
            "/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=" +
            this.startTime +
            "&endDate=" +
            this.endTime +
            "&orgObj=" +
            encodeURIComponent(JSON.stringify(this.orgDic)) +
            "&salesman=" +
            encodeURIComponent(JSON.stringify(userObj)) +
            "&revenueType=" +
            this.revenueType,
        });
      } else if (type == "personcontract") {
        uni.setStorage({
          data: {
            id: this.$savekey.MS_CONTRACT,
            param: {
              customerId: resdata.id,
              customerName: resdata.username,
              beginDate: this.startTime,
              endDate: this.endTime,
              dataType: this.dataType,
              // orgDic:this.orgDic
            },
          },
          key: this.$savekey.MEMORY_STORAGE,
          success: () => {
            uni.switchTab({
              url: "/pages/main/business",
            });
          },
        });
      } else if (type == "personcustomer") {
        uni.navigateTo({
          url: "/otherPages/linkman/custom-admin",
        });
      }
    },
    //点击时间段
    clickDate(type) {
      this.dataType = type;
      switch (type) {
        case "week":
          this.startTime = this.$dateUtil.getFirstDayOfWeek(new Date());
          this.endTime = this.$dateUtil.timeFormat(new Date());
          this.searchClick();
          break;
        case "1":
          this.startTime = this.$dateUtil.getFirstDayOfMonth(new Date());
          this.endTime = this.$dateUtil.timeFormat(new Date());
          this.searchClick();
          break;
        case "2":
          this.startTime = this.$dateUtil.getFirstDayOfYear(new Date());
          this.endTime = this.$dateUtil.timeFormat(new Date());
          this.searchClick();
          break;
        case "3":
          break;
        case "4":
          let now = new Date()
          this.startTime = this.$dateUtil.timeFormat(new Date(now.getFullYear(),now.getMonth()-1,1))
          this.endTime = this.$dateUtil.timeFormat(new Date(now.getFullYear(),now.getMonth(),0));
          this.searchClick();
          break;
        case "5":
          this.startTime = this.$dateUtil.timeFormat(new Date(2022,0,1))
          this.endTime = this.$dateUtil.timeFormat(new Date());
          this.searchClick();
          break;
        default:
          break;
      }
    },
    showPick(type) {
      let item = {
        type: type,
      };
      this.$emit("showPick", item);
    },
    searchClick() {
      // this.getReceivedData();
      // this.getPersonData();
      // this.getTastServer();
      if (this.revenuePrivilege) {
        this.getReceivedData();
      }
      // if (this.personPrivilege) {
      //   this.getPersonData();
      // }
      if (this.serviceTask) {
        this.getTastServer();
      }
    },
    //数据接收
    setDataStartTime(t) {
      this.startTime = t;
      this.searchClick();
    },
    setDataEndTime(t) {
      this.endTime = t;
      this.searchClick();
    },
    setDataOrgIdList(l, d) {
      this.orgIdList = l;
      // this.orgDic = d;
      this.searchClick();
    },
    //弹窗
    clickItem(t) {
      if (t == "contract") {
        // if (!this.contractStatistics) {
        // 	uni.showToast({
        // 		icon: 'none',
        // 		title: '用户没有对应的菜单权限,请联系管理员'
        // 	});
        // 	return;
        // }
        uni.navigateTo({
          url:
            "/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=" +
            this.startTime +
            "&endDate=" +
            this.endTime +
            "&orgObj=" +
            encodeURIComponent(JSON.stringify(this.orgDic)) +
            "&revenueType=" +
            this.revenueType,
        });
      } else if (t == "device") {
        // if (!this.deviceStatistics) {
        // 	uni.showToast({
        // 		icon: 'none',
        // 		title: '用户没有对应的菜单权限,请联系管理员'
        // 	});
        // 	return;
        // }
        uni.navigateTo({
          url:
            "/subOtherPages/homecharts/statistics/device-statistics-tab?beginDate=" +
            this.startTime +
            "&endDate=" +
            this.endTime +
            "&orgObj=" +
            encodeURIComponent(JSON.stringify(this.orgDic)) +
            "&revenueType=" +
            this.revenueType,
        });
      }
      this.$refs.startDialog.close();
    },
    //------------------分块数据请求----------------------------------------
    /*
		营收统计数据
		*/
    getReceivedData() {
      this.getSettlements()
      let param = {
        beginDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59",
        orgIdList:
          this.orgIdList && this.orgIdList.length > 0 ? this.orgIdList : [],
        receivableType:
          this.revenueType == "2" ? this.receivableType : this.revenueType, //当前是账期营收方式时，获取账期类型
        debtType: "1",
      };
      return new Promise((resolve,reject)=>{
        this.$network
        .getData(this.$url.STATISTICS_REVENUE, "POST", param, {
          showLoading: true,
        })
        .then((result) => {
          // 履约营收
          let receivableTotal = result.receivable
            ? result.receivable.total && Number(result.receivable.total) > 0
              ? Number(Number(result.receivable.total).toFixed(2))
              : Number('-'+Math.abs(Number(result.receivable.total)).toFixed(2))
            : 0;
            // 实收
          let receipt = result.receipt
            ? result.receipt.total && Number(result.receipt.total) > 0
              ? Number(Number(result.receipt.total).toFixed(2))
              : Number('-'+Math.abs(Number(result.receipt.total)).toFixed(2))
            : 0;
            // 成本
          let totalCost = result && result.totalCost 
            ? Number(result.totalCost) > 0 
              ? Number(Number(result.totalCost).toFixed(2))
              : Number('-'+Math.abs(Number(result.totalCost)).toFixed(2))
            : 0;
          // 履约欠款
          let payable = result.payable 
          ? Number(result.payable) > 0
            ? Number(Number(result.payable).toFixed(2))
            : Number('-'+Math.abs(Number(result.payable)).toFixed(2))
          : 0;
          this.revenueList = [
            {
              icon: "iconyingshou",
              name: "履约营收(A)",
              tip: "homeReceived",
              data: this.moneyUtil.dealNumber(receivableTotal),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#3988FF",
            },
            {
              icon: "iconyingshou",
              name: "履约欠款(A-C)",
              tip: "homePayable",
              data: this.moneyUtil.dealNumber(payable),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#08DBE9",
            },
            {
              icon: "iconyingshou",
              name: "结算营收(B)",
              tip: "homeSettlement",
              data: this.moneyUtil.dealNumber(this.settlement),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#FE931F",
            },
            {
              icon: "iconyingshou",
              name: "结算欠款(B-C)",
              tip: "homeDebt",
              data: this.moneyUtil.dealNumber(this.settlement-receipt),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#52C41A",
            },
            {
              icon: "iconyingshou",
              name: "实收金额(C)",
              tip: "homeReceipt",
              data: this.moneyUtil.dealNumber(receipt),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#FE931F",
            },
            {
              icon: "iconyingshou",
              name: "成本",
              tip: "homeTotalCost",
              data: this.moneyUtil.dealNumber(totalCost),
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#1278FF",
            },
          ];
            resolve(result)
        })
        .catch((err) => {
          reject(err)
        });
      })
    
    },
    // 结算营收数据
    getSettlements(){
      let param = {
        orgIdList: this.orgIdList && this.orgIdList.length > 0 ? this.orgIdList : [],
        beginDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59"
      }
      return new Promise((resolve,reject)=>{
        this.$network
        .getData(this.$url.STATISTICS_SETTLEMENT, "POST", param, {
          showLoading: true,
        }).then(result=>{
          this.settlement = result && result.total 
          ? Number(result.total) >0
            ? Number(Number(result.total).toFixed(2))
            : Number('-'+Math.abs(Number(result.total)).toFixed(2))
          : 0
          resolve(result)
        }).catch(err=>{
          reject(err)
        })
      })
    },
    /*
	   个人面板数据(3个接口)
	   */
    //个人面板或管理面板
    getPersonData() {
      let param = {
        beginDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59",
        orgIdList:
          this.orgIdList && this.orgIdList.length > 0 ? this.orgIdList : [],
        receivableType:
          this.revenueType == "2" ? this.receivableType : this.revenueType,
        customerSalesman: this.customerId,
        debtType: "1",
      };
      return new Promise((resolve,reject)=>{
        this.$network
        .getData(this.$url.STATISTICS_REVENUE, "POST", param, {
          showLoading: true,
        })
        .then((result) => {
          let receivable =
            result && result.receivable && result.receivable.total
              ? Number(result.receivable.total)
              : 0;
          let receipt =
            result && result.receipt && result.receipt.total
              ? Number(result.receipt.total)
              : 0;
          let debt = result && result.payable ? Number(result.payable) : 0;
          let list = [
            {
              icon: "iconyingshou",
              data: "￥" + this.moneyUtil.dealNumber(receivable),
              name: "营收",
              showArrow: "1",
              type: "personrevenue",
              color: "#FFFFFF",
              background: "#1278FF",
            },
            {
              icon: "iconshishou",
              data: "￥" + this.moneyUtil.dealNumber(receipt),
              name: "实收",
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#10CBE1",
            },
            {
              icon: "iconyingshou1",
              data: "￥" + this.moneyUtil.dealNumber(debt),
              name: "应收",
              showArrow: "0",
              type: "",
              color: "#FFFFFF",
              background: "#FE931F",
            },
          ];
          this.getContractCount(list);
        })
        .catch((err) => {
          reject(err)
        });
      })
   
    },
    getContractCount(list) {
      let param = {
        beginDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59",
        customerSalesman: this.customerId,
      };
      this.$network
        .getData(this.$url.CONTRACT_NUM, "POST", param, { showLoading: true })
        .then((result) => {
          let contractNum = result ? result : 0;
          let dict = {
            icon: "iconxinzenghetong",
            data: contractNum,
            name: "新增合同",
            showArrow: "1",
            type: "personcontract",
            color: "#FFFFFF",
            background: "#FD473B",
          };
          let totalList = [...list];
          totalList.push(dict);
          this.getCustomerCount(totalList);
        })
        .catch((err) => {});
    },
    getCustomerCount(list) {
      let param = {
        beginDate: this.startTime + " 00:00:00",
        endDate: this.endTime + " 23:59:59",
        salesman: this.customerId,
      };
      this.$network
        .getData(this.$url.CUSTOMER_NUM, "POST", param, { showLoading: true })
        .then((result) => {
          let customerNum = result ? result : 0;
          let dict = {
            icon: "iconkehuguanli",
            data: customerNum,
            name: "新增客户",
            showArrow: "1",
            type: "personcustomer",
            color: "#FFFFFF",
            background: "#FD473B",
          };
          let totalList = [...list];
          totalList.push(dict);
          this.personRevenue = [...totalList];
        })
        .catch((err) => {});
    },
    //获取未完成的服务任务
    getTastServer() {
      let param = {
        orgId: this.orgDic.value != "" ? this.orgDic.value : undefined,
      };
      return new Promise((resolve,reject)=>{
        this.$network
        .getData(this.$url.MACHINE_TAST_COUNT, "GET", param, {
          showLoading: true,
        })
        .then((result) => {
          this.serviceList = [...[]];
          Object.keys(result).forEach((t) => {
            this.getNameWiteKey(t, result[t]);
          });
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        });
      })
   
    },
    getNameWiteKey(t, num) {
      let item = {};
      switch (t) {
        case "repairNum":
          item = {
            icon: "iconzl--weixiu",
            name: "维修",
            data: num.toString(),
            showArrow: "0",
            type: "",
            color: "#FFFFFF",
            background: "#1278FF",
            key: "repairTodoList",
          };
          break;
        case "maintenanceNum":
          item = {
            icon: "iconshebeibaoyang",
            name: "保养",
            data: num.toString(),
            showArrow: "0",
            type: "",
            color: "#FFFFFF",
            background: "#10CBE1",
            key: "maintainTodoList",
          };
          break;
        case "inspectionNum":
          item = {
            icon: "iconshebeixunjian",
            name: "巡检",
            data: num.toString(),
            showArrow: "0",
            type: "",
            color: "",
            background: "#FE931F",
            key: "inpectionTodoList",
          };
          break;
        case "tcheckRepairNum":
          item = {
            icon: "iconshebeijianxiu",
            name: "检修",
            data: num.toString(),
            showArrow: "0",
            type: "",
            color: "",
            background: "#FD473B",
            key: "checkTodoList",
          };
          break;
        default:
          break;
      }
      this.serviceList.push(item);
    },
    getPraShow(item) {
      let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
      if (resData) {
        let isShow = resData.some((x) => x.value === item.key);
        return isShow;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.databgclass {
  width: 100%;
  background-color: $uni-bg-color-grey;
  padding-bottom: 10px;
  overflow-y: hidden;
}
.data-head {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 10px;
  background: #ffffff;
}
.data-head-title {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  align-items: center;
}
.select-style {
  display: flex;
  margin-left: 10px;
  background: linear-gradient(318deg, #e60000 0%, #fea736 100%);
  font-size: 26rpx;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 15px;
}

.unselect-style {
  display: flex;
  margin-left: 10px;
  background: #d8d8d8;
  font-size: 26rpx;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 15px;
}
.data-head-time {
  display: flex;
  flex-direction: row;
  background: #ffffff;
  align-items: center;
  margin-top: 10px;
}
.search-go {
  font-size: $uni-font-size-base;
  color: #ffffff;
  padding: 5px 10px;
  background: $uni-color-primary;
  border-radius: 3px;
  margin-left: 10px;
}
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 24rpx 0px 0px 0px;
  background: #ffffff;
  // border-radius: 10px;
  min-height: 150px;
}
.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 24rpx;
  padding-bottom: 22rpx;
  line-height: 42rpx;
  border-bottom: solid 2rpx #E6E6E6;
}
.title-left {
  font-size: 30rpx;
  font-weight: bold;
  padding-left: 24rpx;
  color: #222222;
}
.title-right {
  display: flex;
  padding-right: 24rpx;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  color: #999999;
  font-size: 26rpx;
}
.title-icon {
  margin-left: 5px;
  color: #999999;
  font-size: $uni-font-size-base;
}
.content-box{
  padding: 0 24rpx;
}
.content-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 17rpx 0 17rpx;
  line-height: 64rpx;
  color: #222222;
  font-size: $uni-font-size-base;
  border-bottom: #E6E6E6 2rpx solid;
}
.content-left {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
}
.content-right {
  display: flex;
  margin-left: 25px;
  color: #1f285d;
  font-size: $uni-font-size-base;
}
.content-right-icon {
  margin-left: 5px;
  color: #999999;
  font-size: $uni-font-size-base;
}
.content-icon-bg {
  display: flex;
  flex-direction: row;
  width: 56rpx;
  height: 56rpx;
  justify-content: center;
  align-items: center;
  background: #e60000;
  border-radius: 50%;
}
.content-icon {
  font-size: 34rpx;
  color: #ffffff; 
}
.content-title {
  margin-left: 10px;
}
.content-subtitle {
  font-size: $uni-font-size-sm;
  color: $uni-color-primary;
  margin-left: 10px;
}
.pop-container {
  position: relative;
}
/* 提示窗口 */
.uni-tip {
  display: flex;
  flex-direction: column;
  padding: 15px;
  width: 70vw;
  background-color: #ffffff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}

.row-item {
  display: flex;
  width: 90%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
  background: $uni-color-primary;
  color: #ffffff;
  font-size: $uni-font-size-base;
  border-radius: 5px;
}

.over-view-bg {
  display: flex;
  flex-direction: column;
  margin-top: 24rpx;
  padding-bottom: 0;
  background: #ffffff;
}
.charts-box {
  width: 245rpx;
  height: 245rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #e6e6e6;
  canvas{
    width:160rpx;
    height:160rpx;
  }
}
.over-view-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  .middle {
    width: 167rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    p {
      text-align: center;
    }
  }
  .right {
    width: 35%;
    display: flex;
    flex-wrap: wrap;

    view {
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.no-border{
  border: none;
}
</style>
