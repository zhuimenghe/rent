<template>
  <view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap"
      >设备档案</c-nav-bar-btns
    >
    <!-- 筛选view -->
    <view class="fixed-search-view" :style="{ top: navBarHeight + 'px' }">
      <c-search-bar placeholder="自喷码/车号/品牌/型号" :value="keyWord" @input="searchChange" @clear="reset" @ok="query">
        <view slot="pre">
          {{ filtrateNum }}台
        </view>
        <view class="top-search-item-view">
          <view class="select-view">
            <selectView
              :value="deviceSort.label"
              hint="设备类别"
              @clickSelect="showPick('deviceSort')"
            />
          </view>
          <view class="select-view" v-if="deviceSort && deviceSort.value">
            <selectView
              :value="machineType.label"
              hint="设备类型"
              @clickSelect="showPick('machineType')"
            />
          </view>
          <view class="select-view" v-if="deviceSort && deviceSort.value">
            <selectView
              :value="propObj.label"
              hint="属性"
              @clickSelect="showPick('prop')"
            />
          </view>
          <view class="select-view" v-if="deviceSort && deviceSort.value">
            <selectView
              :value="symbolObj.label"
              hint="关系"
              @clickSelect="showPick('symbol')"
            />
          </view>
          <view class="select-view" v-if="deviceSort && deviceSort.value">
            <selectView
              :value="propValue.label"
              hint="请选择"
              @clickSelect="showPick('propValue')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="rentalState.label"
              hint="租赁状态"
              @clickSelect="showPick('state')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="businessState.label"
              hint="业务状态"
              @clickSelect="showPick('businessState')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="areaObj.label"
              hint="区域"
              @clickSelect="showPick('area')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="purchaseStateObj.label"
              hint="保修状态"
              @clickSelect="showPick('purchaseState')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="licenseSortObj.label"
              hint="机号排序"
              @clickSelect="showPick('licenseSort')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="printcodeSortObj.label"
              hint="自喷码排序"
              @clickSelect="showPick('printcodeSort')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="rentObj.label"
              hint="转租状态"
              @clickSelect="showPick('rent')"
            />
          </view>
          <view class="select-view">
            <selectView
              :value="insuranceState.label"
              hint="保险状态"
              @clickSelect="showPick('insuranceState')"
            />
          </view>
        </view>
      </c-search-bar>
    </view>
    <view class="list-med" show-scrollbar="false">
      <view>
        <view class="group-total-container" v-if="isShowGroup">
          <view
            class="group-item-container"
            :class="{ active: item.selected }"
            v-for="(item, index) in groupList"
            :key="index"
            @click="selectType(item)"
          >
            <view class="group-name" :class="{ active: item.selected }">{{
              item.name
            }}</view>
            <view class="group-line">
              <text class="group-line-tag" :class="{ active: item.selected }"
                >设备数量：</text
              >
              <text
                class="group-line-value"
                :class="{ active: item.selected }"
                >{{ item.deviceNum || "0" }}</text
              >
            </view>
            <view class="group-line">
              <text class="group-line-tag" :class="{ active: item.selected }"
                >GPS装机数：</text
              >
              <text
                class="group-line-value"
                :class="{ active: item.selected }"
                >{{ item.gpsInstalled || "0" }}</text
              >
            </view>
          </view>
        </view>
        <view class="item-view" v-if="isShowGroup">
          <view class="num-tag">当前类型：{{ filtrateNum }}台</view>
        </view>
      </view>
      <view v-for="(item, index) in datalist" :key="index">
        <view class="cell-bg-view" @click.stop="gotoVC(item, 'detail')">
          <machineHeadRecord :dataDic="item" @goToImage="goImg($event, item)" />
          <view class="cell-item-bg">
            <view
              class="cell-item-row"
              v-if="item.state == '2'"
              @click.stop="gotoContractDetial(item)"
            >
              <view class="cell-line-row">
                <view class="cell-line-tag">业务:</view>
                <view class="cell-line-value">{{
                  `${item.contractCustomerName}-${item.contractProjectName}` ||
                  "--"
                }}</view>
              </view>
            </view>
            <view class="cell-item-row" v-if="item.state == '2'">
              <view class="cell-line-row">
                <view class="cell-line-tag">执行进度:</view>
                <view class="cell-line-value">{{
                  item.contractProgress | progressName
                }}</view>
              </view>
              <view class="cell-line-row">
                <view class="cell-line-tag">执行日期:</view>
                <view class="cell-line-value">{{
                  $gxfmethod.subDateWithHHMMSS(item.contractExecutionTime)
                }}</view>
              </view>
              <!-- <view class="cell-line-row">
								<view class="cell-line-tag">GPS编号:</view>
								<view class="cell-line-value">{{ item.deviceNum || '--' }}</view>
							</view> -->
              <view />
            </view>

            <view class="cell-item-row">
              <view class="cell-line-row">
                <view class="cell-line-tag">区域:</view>
                <view class="cell-line-value">{{ item.orgName || "--" }}</view>
              </view>
            </view>
            <view class="cell-item-row">
              <view class="cell-line-row">
                <view class="cell-line-tag">保修状态:</view>
                <view class="cell-line-value">{{
                  item.purchaseStateName || "-"
                }}</view>
              </view>
              <view class="cell-line-row" @click.stop="gotoDetial(item)">
                <view class="cell-line-tag">保险状态:</view>
                <view
                  :class="
                    item.insuranceStateName == '在保'
                      ? 'green'
                      : 'cell-line-value'
                  "
                  >{{ item.insuranceStateName || "-" }}</view
                >
              </view>

              <view />
            </view>
            <!-- 在租 -->
          </view>
          <view class="bottom-btns-view">
            <view
              style="
                margin-right: 20px;
                display: flex;
                flex: 1;
                justify-content: flex-start;
              "
            >
              <badgeBottom
                :num="item.fileListNum ? item.fileListNum : 0"
                @addPic="goImg('e', item)"
              />
            </view>
            <view class="tag-btns-view" @click.stop="share(item)">{{
              "分享"
            }}</view>
            <view class="tag-btns-view" @click.stop="gotoVC(item, 'more')">{{
              "更多"
            }}</view>
            <view
              class="tag-btns-view"
              @click.stop="gotoVC(item, 'monitor')"
              v-if="item.deviceNum"
              >{{ "监控" }}</view
            >
          </view>
        </view>
      </view>
      <view>
        <view><uni-load-more iconType="auto" :status="morestatus" /></view>
      </view>
    </view>
    <view class="add-device" @click="gotoAdd">
      <text class="iconfont iconadd"></text>
    </view>
    <device-share ref="share" :d="curDevice"></device-share>
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
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import filterView from "@/components/common/common-ui/filter-view.vue";
import badgeview from "@/components/common/image-upload/badge-icon.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import machineHeadRecord from "@/devicePages/components/machine-head-record.vue";
import DeviceShare from "@/devicePages/components/device-share.vue";
import { mapState } from "vuex";
let timer;
export default {
  components: {
    uniLoadMore,
    filterView,
    badgeview,
    selectView,
    wPicker,
    machineHeadRecord,
    DeviceShare
  },
  data() {
    return {
      curDevice:null,
      navBtns: [
        {
          fontSize: "15px",
          color: "#000000",
          text: "\ue695",
        },
        {
          fontSize: "15px",
          color: "#000000",
          text: "\ue72c",
        },
      ],
      //设备类型
      filtrateNum: "0",
      datalist: [],
      //上拉下拉
      morestatus: "more",
      page: 1,
      rentalState: {},
      // "WORKIN","WORKOUT","PAUSE","CLAIM","STATEMENT","SETTLEMENT"
      //   进场     退场       报停    索赔      对账         结算
      businessState: {},
      businessStateList: [
        {
          label: "进场",
          value: "WORKIN",
        },
        {
          label: "退场",
          value: "WORKOUT",
        },
        {
          label: "报停",
          value: "PAUSE",
        },
        {
          label: "索赔",
          value: "CLAIM",
        },
        {
          label: "对账",
          value: "STATEMENT",
        },
        {
          label: "结算",
          value: "SETTLEMENT",
        },
      ],
      licenseSortList: [
        {
          label: "机号正序",
          value: "license_id asc",
        },
        {
          label: "机号倒序",
          value: "license_id desc",
        },
      ],
      licenseSortObj: {},
      printcodeSortList: [
        {
          label: "自喷码正序",
          value: "print_code asc",
        },
        {
          label: "自喷码倒序",
          value: "print_code desc",
        },
      ],
      rentList: [
        {
          label: "自有",
          value: "0",
        },
        {
          label: "转租",
          value: "1",
        },
      ],
      insuranceStateList: [
        {
          value: 1,
          label: "未投保",
        },
        {
          value: 2,
          label: "脱保",
        },
        {
          value: 3,
          label: "在保",
        },
      ],
      rentObj: {},
      insuranceState: {},
      printcodeSortObj: {},
      rentalStateList: [],
      areaObj: {},
      areaList: [],
      keyWord: "",
      isEditAttachment: false,
      selectList: [],
      pickType: "",
      //设备类型
      propValue: {},
      deviceSort: {
        label: "全部类别",
        value: "",
      },
      deviceSorts: [],
      machineType: {},
      machineTypeList: [],
      //属性
      propObj: {},
      propList: [],
      //符号
      symbolObj: {
        label: ">=",
        value: ">=",
      },
      symbolList: [
        {
          label: ">=",
          value: ">=",
        },
        {
          label: "=",
          value: "=",
        },
        {
          label: "<=",
          value: "<=",
        },
      ],
      isShowSelect: false,
      groupList: [],
      isShowGroup: false,
      heightList: [], //高度
      tonnageList: [], //吨位,
      isExportList: true,
      totalCount: "100",
      purchaseStateObj: {},
      purchaseStateList: [
        {
          label: "保内",
          value: "true",
        },
        {
          label: "保外",
          value: "false",
        },
      ],
    };
  },
  filters: {
    progressName(progress) {
      switch (progress) {
        case "statement":
          return "对账";
        case "proceeds":
          return "收款";
        case "claim":
          return "索赔";
        case "pause":
          return "报停";
        case "reimburse":
          return "退款";
        case "invoice":
          return "发票";
        case "workIn":
          return "进场";
        case "settlement":
          return "结算";
        case "workOut":
          return "退场";
        case "contractChange":
          return "合同变更";
        case "settle":
          return "合同结清";
        default:
          return "新增合同";
      }
    },
  },
  computed: {
    ...mapState("system", ["navBarHeight"]),
  },
  onLoad(option) {
    if (option.orgDic) {
      this.areaObj = JSON.parse(decodeURIComponent(option.orgDic));
    }
    uni.showLoading();
    this.getNetData();
    this.getGroupCount();
    this.getDeviceType();
    this.loadMachineType();
    this.getProps();
    this.getHeightList();
    this.getTonnageList();
    this.loadRentalState();
    this.loadAreaList();
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: (res) => {
        this.isEditAttachment = res.data.some(
          (x) =>
            x.value === this.$savekey.PERMISSION_MACHINE_EDIT ||
            x.value === this.$savekey.PERMISSION_MACHINE_ADD
        );
        //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
      },
    });
    uni.$on("refresh-contract-list", (usnerinfo) => {
      this.page = 1;
      this.datalist = [];
      this.getNetData();
    });
    /*统计*/
    this.$gxfmethod.statisticData(
      this.$eventId.Device_Administrative,
      "设备档案",
      "列表"
    );
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.datalist = [];
    this.getNetData();
    this.getGroupCount();
  },
  //上拉加载
  onReachBottom() {
    if (this.morestatus == "noMore") {
      return;
    }
    this.page += 1;
    this.getNetData();
    this.morestatus = "loading";
  },
  methods: {
    searchChange(val) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        this.keyWord = val;
        this.query()
      }, 500);
    },
    share(item){
      this.curDevice = item
      this.$nextTick((_) => this.$refs.share.share());
    },
    gotoAdd() {
      uni.navigateTo({ url: "/devicePages/record/device-record-add" });
    },
    onNavBarButtonTap(e) {
      if (e.index === 0) {
        this.isShowGroup = !this.isShowGroup;
      } else {
        if (this.isExportList) {
          /*统计*/
          this.$gxfmethod.statisticData(
            this.$eventId.Device_Administrative,
            "设备档案",
            "导出"
          );
          this.exportExcel();
        } else {
          uni.showToast({
            title: "暂无权限",
            icon: "none",
          });
        }
      }
    },
    filtterShow() {
      this.isShowSelect = !this.isShowSelect;
    },
    exportExcel(item) {
      let param = {
        current: 1,
        size: this.totalCount,
        keyword: this.keyWord != "" ? this.keyWord : undefined,
        keyType: this.propObj.value ? this.propObj.value : undefined,
        comparisonValue: this.propValue.value
          ? this.propValue.value
          : undefined,
        state:
          this.rentalState && this.rentalState.value
            ? this.rentalState.value
            : undefined,
        deviceType:
          this.deviceSort && this.deviceSort.value && this.deviceSort.value
            ? this.deviceSort.value
            : undefined,
        comparators:
          this.symbolObj && this.symbolObj.value
            ? this.symbolObj.value
            : undefined,
        machineTypeId:
          this.machineType && this.machineType.value
            ? this.machineType.value
            : undefined,
        orgIdList:
          this.areaObj && this.areaObj.value
            ? this.$datestr.getOrgIdList(this.areaObj)
            : undefined,
      };
      console.log(JSON.stringify(this.areaObj));
      // if (this.machineTypeList.length > 0) {
      // 	params.machineTypeList = this.machineTypeList;
      // }
      // if (this.areaObj && this.areaObj.value) {
      // 	params.orgIdList = this.$datestr.getOrgIdList(this.areaObj);
      // }
      // let url= this.$url.MACHINE_RECORD + '?isExport=true&current=1&size='+ this.totalCount
      // let downurl = this.$gxfmethod.forEachObj(url,param)
      // console.log(downurl)
      let url = this.$url.BASE_URL + "machineapi/api/machine/export";
      // let url = this.$gxfmethod.getUrl(this.$url.MACHINE_RECORD)
      console.log(JSON.stringify(param));
      let filename = this.$gxfmethod.getFileName("设备档案-");
      this.$gxfmethod.downFunc(url, "POST", param, filename);
    },
    //获取区域
    loadAreaList() {
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET")
        .then((result) => {
          let list = result;
          this.areaList = this.getChildren(list);
        })
        .catch((err) => {});
    },
    getChildren(data) {
      let arr = [];
      if (data) {
        data.forEach((o) => {
          let a = {
            value: o.id,
            label: o.name,
          };
          arr = [...arr, a];
          if (o.children && o.children.length > 0) {
            arr = [...arr, ...this.getChildren(o.children)];
          }
        });
      }
      return arr;
    },
    //租赁状态
    loadRentalState() {
      this.$network
        .loadUserType("rental_status")
        .then((result) => {
          this.rentalStateList = result ? result : [];
        })
        .catch((err) => {});
    },
    reset() {
      this.keyWord = "";
      this.deviceSort = {
        label: "全部类别",
        value: "",
      };
      //重置
      this.rentalState = {};
      this.insuranceState = {};
      this.businessState = {};
      this.areaObj = {};
      this.machineType = {};
      this.purchaseStateObj = {};
      this.licenseSortObj = {};
      this.printcodeSortObj = {};
      this.rentObj = {};

      this.selectType({
        deviceType: "",
        name: "",
      });
      uni.showLoading();
      this.page = 1;
      this.datalist = [];
      this.getNetData();
    },

    query() {
      uni.showLoading();
      this.page = 1;
      this.datalist = [];
      this.getNetData();
    },
    //跳入详情页
    gotoVC(item, type) {
      if (type == "detail") {
        uni.navigateTo({
          url:
            "/devicePages/record/device-record-detail?licenseId=" +
            item.licenseId,
        });
      } else if (type == "monitor") {
        uni.navigateTo({
          url:
            "/devicePages/monitor/device-monitor-detail?licenseId=" +
            item.licenseId,
        });
      } else {
        uni.navigateTo({
          url: "/pages/main/machine-scan-home?licenseId=" + item.licenseId,
        });
      }
    },
    //获取网络数据
    getNetData() {
      let params = {
        current: this.page,
        size: 5,
        keyword: this.keyWord,
      };
      if (this.deviceSort && this.deviceSort.value && this.deviceSort.value) {
        params.deviceType = this.deviceSort.value;
        if (this.machineType && this.machineType.value) {
          params.machineTypeId = this.machineType.value;
        }
        if (this.propObj && this.propObj.value) {
          params.keyType = this.propObj.value;
        }
        if (this.symbolObj && this.symbolObj.value) {
          params.comparators = this.symbolObj.value;
        }
        if (this.propValue && this.propValue.value) {
          params.comparisonValue = this.propValue.value;
        }
      }
      //租赁状态
      if (this.rentalState && this.rentalState.value) {
        params.state = this.rentalState.value;
      }
      //租赁状态
      if (this.businessState && this.businessState.value) {
        params.businessType = this.businessState.value;
      }
      //区域
      if (this.areaObj && this.areaObj.value) {
        params.orgIdList = this.$datestr.getOrgIdList(this.areaObj);
      }
      //保修
      if (this.purchaseStateObj && this.purchaseStateObj.value) {
        params.purchaseState = this.purchaseStateObj.value;
      }
      if (this.insuranceState && this.insuranceState.value) {
        params.insuranceState = this.insuranceState.value;
      }
      //排序
      params.pageSort =
        this.licenseSortObj.value || this.printcodeSortObj.value || "";
      //租赁状态
      params.subletState = this.rentObj.value || null;

      this.$network
        .machineList(params, true)
        .then((result) => {
          this.datalist = this.datalist.concat(result.records);
          let pages = result.pages;
          let total = result.total;
          this.filtrateNum = total;
          this.totalCount = total.toString();
          if (pages == this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    //获取车辆统计数据
    getGroupCount() {
      this.$network
        .getData(this.$url.MACHINE_TYPE_COUNT, "GET", null)
        .then((result) => {
          // this.groupList = result && result.length > 0 ? result.filter(o => {
          // 		return o.gpsInstalled > 0 || o.deviceNum > 0
          // 	}) : [],
          this.groupList =
            result && result.length > 0
              ? result.map((o) => {
                  return {
                    ...o,
                    name: o.name ? o.name : "全部类别",
                    deviceType: o.deviceType ? o.deviceType : "",
                  };
                })
              : [];
          this.groupList = this.groupList.map((o) => {
            return {
              ...o,
              selected:
                this.deviceSort && this.deviceSort.value === o.deviceType,
            };
          });
        })
        .catch((err) => {});
    },

    //设备类型
    loadMachineType() {
      let param = {
        source: "machine_type",
      };
      if (this.deviceSort && this.deviceSort.value) {
        param = {
          ...param,
          device_type: this.deviceSort.value, //设备类别
        };
      }
      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.machineTypeList = result
            ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
            : [];
        })
        .catch((err) => {});
    },
    getDeviceType() {
      let param = {
        source: "device_type",
      };
      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.deviceSorts = [];
          this.deviceSorts.push({
            label: "全部类别",
            value: "",
          });
          this.deviceSorts = this.deviceSorts.concat(
            result
              ? result.map((o) => {
                  return {
                    value: o.key,
                    label: o.value,
                  };
                })
              : []
          );
        })
        .catch((err) => {});
    },
    getProps() {
      this.$network
        .loadUserType("vehicle_type")
        .then((result) => {
          this.propList =
            result && result.length > 0
              ? result.map((o) => {
                  return {
                    label: o.label,
                    value: o.value,
                  };
                })
              : [];
        })
        .catch((err) => {});
    },
    gotoDetial(item) {
      console.log(111);
      uni.navigateTo({
        url:
          "/devicePages/insurance/insurance-detail?businessNo=" +
          item.insuranceNo,
      });
    },
    gotoContractDetial(item) {
      uni.navigateTo({
        url:
          "/contractPages/contract/contract-detail?contractNo=" +
          item.contractNo,
      });
    },
    getHeightList() {
      let param = {
        source: "machine_height",
      };
      if (this.deviceSort && this.deviceSort.value) {
        param = {
          ...param,
          device_type: this.deviceSort.value, //设备类别
        };
      }
      if (this.machineType && this.machineType.value) {
        param = {
          ...param,
          machine_type: this.machineType.value,
        };
      }

      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.heightList = result
            ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
            : [];
          this.initType();
        })
        .catch((err) => {});
    },
    getTonnageList() {
      let param = {
        source: "tonnage",
      };
      if (this.deviceSort && this.deviceSort.value) {
        param = {
          ...param,
          device_type: this.deviceSort.value, //设备类别
        };
      }
      if (this.machineType && this.machineType.value) {
        param = {
          ...param,
          machine_type: this.machineType.value,
        };
      }

      this.$network
        .getData(this.$url.DEVICE_SELECT, "POST", param)
        .then((result) => {
          this.tonnageList = [];
          this.tonnageList.push({
            label: "全部",
            value: "",
          });
          this.tonnageList = result
            ? result.map((o) => {
                return {
                  value: o.key,
                  label: o.value,
                };
              })
            : [];
          this.initType();
        })
        .catch((err) => {});
    },
    goImg(e, item) {
      let isedit = this.isuser(item);
      uni.navigateTo({
        url:
          "/components/common/image-upload/upload_zb_apendix?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&filetype=vehicle_type&isedit=" +
          isedit +
          "&isshowShare=1",
      });
    },
    isuser(item) {
      if (item.canUploadFile == "0") {
        return false;
      } else {
        return true;
      }
    },
    showPick(type) {
      this.pickType = type;
      switch (type) {
        case "deviceSort":
          this.selectList = this.deviceSorts ? this.deviceSorts : [];
          break;
        case "prop":
          if (this.deviceSort) {
            if (this.deviceSort.value == "1") {
              //高空车
              this.selectList = this.propList
                ? this.propList.filter((o) => {
                    return o.value == "1";
                  })
                : [];
            } else if (this.deviceSort.value == "2") {
              //挖掘机
              this.selectList = this.propList
                ? this.propList.filter((o) => {
                    return o.value == "2";
                  })
                : [];
            } else {
              //叉车-矿车-装载机
              this.selectList = this.propList ? this.propList : [];
            }
          }

          break;
        case "symbol":
          this.selectList = this.symbolList ? this.symbolList : [];
          break;
        case "propValue":
          if (this.propObj) {
            if (this.propObj.value === "1") {
              //高度
              this.selectList = this.heightList ? this.heightList : [];
            } else if (this.propObj.value === "2") {
              //吨位
              this.selectList = this.tonnageList ? this.tonnageList : [];
            }
          } else {
            this.selectList = [];
            uni.showToast({
              title: "请选择属性",
              icon: "none",
            });
          }

          break;
        case "state":
          this.selectList = this.rentalStateList ? this.rentalStateList : [];
          break;
        case "businessState":
          this.selectList = this.businessStateList
            ? this.businessStateList
            : [];
          break;
        case "area":
          this.selectList = this.areaList ? this.areaList : [];
          break;
        case "purchaseState":
          this.selectList = this.purchaseStateList
            ? this.purchaseStateList
            : [];
          break;
        case "machineType":
          this.selectList = this.machineTypeList ? this.machineTypeList : [];
          break;
        case "licenseSort":
          this.selectList = this.licenseSortList || [];
          break;
        case "printcodeSort":
          this.selectList = this.printcodeSortList || [];
          break;
        case "rent":
          this.selectList = this.rentList || [];
          break;
        case "insuranceState":
          this.selectList = this.insuranceStateList || [];
          break;
        default:
          break;
      }
      this.$refs.selector.show();
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "deviceSort":
          this.deviceSort = val.checkArr;
          this.groupList = this.groupList.map((o) => {
            return {
              ...o,
              selected:
                this.deviceSort && this.deviceSort.value === o.deviceType,
            };
          });
          if (this.deviceSort && this.deviceSort.value) {
            this.loadMachineType();
            this.initProps();
          } else {
            this.symbolObj = {
              label: ">=",
              value: ">=",
            };
            this.propObj = {};
            this.propValue = {};
          }
          break;
        case "prop":
          this.propObj = val.checkArr;
          if (this.propObj.value === "1") {
            //高度
            this.selectList = this.heightList ? this.heightList : [];
          } else if (this.propObj.value === "2") {
            //吨位
            this.selectList = this.tonnageList ? this.tonnageList : [];
          }
          this.initType();
          break;
        case "symbol":
          this.symbolObj = val.checkArr;
          break;
        case "propValue":
          this.propValue = val.checkArr;
          break;
        case "state":
          this.rentalState = val.checkArr;
          break;
        case "businessState":
          this.businessState = val.checkArr;
          break;
        case "area":
          this.areaObj = val.checkArr;
          break;
        case "purchaseState":
          this.purchaseStateObj = val.checkArr;
          break;
        case "machineType":
          this.machineType = val.checkArr;
          this.getHeightList();
          this.getTonnageList();
          break;
        case "licenseSort":
          this.licenseSortObj = val.checkArr;
          this.printcodeSortObj = {};
          break;
        case "printcodeSort":
          this.printcodeSortObj = val.checkArr;
          this.licenseSortObj = {};
          break;
        case "rent":
          this.rentObj = val.checkArr;
          break;
        case "insuranceState":
          this.insuranceState = val.checkArr;
          break;
        default:
          break;
      }
    },
    selectType(item) {
      if (this.deviceSort.value !== item.deviceType) {
        this.rentalState = {};
        this.areaObj = {};
        this.machineType = {};
        this.purchaseStateObj = {};
      }
      this.deviceSort = {
        label: item.name,
        value: item.deviceType,
      };
      this.groupList = this.groupList.map((o) => {
        return {
          ...o,
          selected: this.deviceSort && this.deviceSort.value === o.deviceType,
        };
      });
      if (this.deviceSort && this.deviceSort.value) {
        this.loadMachineType();
        this.initProps();
      } else {
        this.symbolObj = {
          label: ">=",
          value: ">=",
        };
        this.propObj = {};
        this.propValue = {};
      }

      this.page = 1;
      this.datalist = [];
      this.getNetData();
    },
    initType() {
      //设置高度或吨位默认值
      if (this.propObj) {
        if (this.propObj.value === "1") {
          this.propValue =
            this.heightList && this.heightList.length > 0
              ? this.heightList[0]
              : {};
        }
        if (this.propObj.value === "2") {
          this.propValue =
            this.tonnageList && this.tonnageList.length > 0
              ? this.tonnageList[0]
              : {};
        }
      }
    },
    initProps() {
      //设置各种设备类别的属性
      if (this.deviceSort && this.deviceSort.value) {
        if (this.deviceSort.value === "1") {
          //高空车只有高度
          let s = this.propList
            ? this.propList.filter((o) => {
                return o.value == "1";
              })
            : [];
          //高空车
          this.propObj = s && s.length > 0 ? s[0] : {};
        } else if (this.deviceSort.value === "2") {
          //挖车只有吨位
          let s = this.propList
            ? this.propList.filter((o) => {
                return o.value == "2";
              })
            : [];
          //挖机
          this.propObj = s && s.length > 0 ? s[0] : {};
        } else {
          //叉车-矿车-装载机
          this.propObj =
            this.propList && this.propList.length > 0
              ? this.propList.find((o) => o.value === "2")
              : {};
        }
        this.getHeightList();
        this.getTonnageList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentbg {
  position: relative;
  min-height: 100%;
  width: 100%;
}

.filter-view {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e60000;
  color: #ffffff;
  padding: 8px 10px;
  flex: 1;
  border-radius: 4px;
  text-align: center;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
}
.filtrate-top-left {
  margin-left: 10px;
  color: #1890ff;
  font-size: 14px;
}
.reset-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $uni-bg-color-grey;
  color: $uni-text-color;
  padding: 8px 10px;
  flex: 1;
  border-radius: 4px;
  text-align: center;
  font-size: $uni-font-size-base;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 5px;
}

.list-med {
  position: relative;
  width: 100%;
  background: $uni-bg-color-grey;
}

.num-tag {
  background: #ffffff;
  border-radius: 5px;
  width: 100%;
  padding: 10px 0px;
  text-align: center;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.cell-bg-view {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin: 8px 8px 0px 8px;
  border-radius: 8px;
  padding: 8px;
}
.cell-item-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 10px 5px 0px 5px;
  padding: 10px 5px;
  justify-content: flex-start;
  background: rgba(240, 242, 244, 0.7);
  border-radius: 10px;
}
.cell-item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cell-line-row {
  display: flex;
  width: 100%;
  padding: 4px 0px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cell-line-value {
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.cell-line-tag {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
  margin-right: 5px;
}
.fixed-search-view {
  position: sticky;
  top: 0px;
  width: 100%;
  background-color: #ffffff;
  z-index: 200;
}
.fixed-search-view-zw {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  z-index: 1;
  width: 100%;
}
.top-search-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  background: #ffffff;
  margin-top: 4px;
  width: 100%;
}
.top-search-item-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #ffffff;
  width: 100%;
}
.select-view {
  margin-top: 5px;
  width: 30%;
  margin-top: 5px;
  margin-left: calc(10% / 4);
}

.search-box {
  background: #f7f7f7;
  flex: 1;
  display: flex;
  padding: 8px 0px;
  margin: 8px 0px 8px 8px;
  flex-direction: row;
  padding-left: 16px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}
.filtter-btn {
  display: flex;
  padding: 6px 10px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #222222;
  margin: 0px 10px;
  // color: $uni-color-primary;
  // margin-right: 10px;
  // border: $uni-color-primary 1px solid;
}
.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  display: flex;
  flex: 1;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}

.input-style {
  background-color: #f7f7f7;
  font-size: $uni-font-size-base;
  border-radius: 4px;
  flex: 1;
  padding: 2px 8px;
}

.group-total-container {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-left: 8px;
  margin-right: 8px;
}

.item-view {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0px;
}

.group-arrow {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-lg;
}

.group-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc((100% - 16px) / 2);
  margin: 4px;
  box-sizing: border-box;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  background: #eeeeee;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);

  &.active {
    background-color: #f2ffff;
    color: $uni-color-primary;
    border: $uni-color-primary solid 1px;
    box-shadow: 0px 1px 1px 0px rgba(0, 196, 196, 0.2);
  }
}

.group-name {
  // width: 25px;
  height: 25px;
  // background-color: #aaaaaa;
  text-align: center;
  line-height: 25px;
  // border-radius: 50%;
  font-size: $uni-font-size-base;
  color: $uni-text-color;

  &.active {
    color: $uni-color-primary;
  }
}

.group-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 16px;
  line-height: 16px;
}

.group-line-tag {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-xs;

  &.active {
    color: $uni-color-primary;
  }
}

.group-line-value {
  color: $uni-text-color;
  font-size: $uni-font-size-base;

  &.active {
    color: $uni-color-primary;
  }
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
.green {
  color: #52c41a;
}
</style>
