<template>
  <view class="choose-bg-view">
    <view class="top-view">
      <view class="search-container">
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content">
            <input style="flex: 1" placeholder="合同名称/合同号" v-model="searchKey" />
          </view>
        </view>
        <!-- <view class="filter-view-style">
					<filter-view 
					@clickFilter="filtrateMenu" 
					:isExpendArrow="showfilter"
					backgroundColor="#F7F7F7" 
					textColor="#222831" 
					/>
				</view> -->
      </view>
      <view class="bottom-search" v-if="showfilter">
        <view class="bottom-search-top">
          <label-arrow
            style="flex: 1"
            :value="orgDic.label"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showpick('org')"
          />
          <label-arrow
            style="margin-left: 30px; flex: 1"
            :value="salesDic.label"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showpick('sales')"
          />
        </view>
        <view class="bottom-search-top">
          <label-arrow
            style="flex: 1"
            :value="searchDate"
            arrowColor="#999999"
            textColor="#222831"
            textSize="14"
            arrowSize="14"
            @clickLabel="showpick('date')"
          />
          <view style="margin-left: 30px; flex: 1" />
        </view>
        <view class="condition-btn">
          <view class="clear btn" @click="clearsum">清除</view>
          <view class="confirm btn" @click="oksum">查询</view>
        </view>
      </view>
      <view class="line-s" />
    </view>
    <list class="list-style">
      <cell class="cell-style" v-for="(item, index) in datalist" :key="index">
        <view @click="backToPre(item)">
          <view class="cell-view-part title-style">
            <text style="color: #e60000" v-if="item.contractType != '1'">【框】</text>
            <text>{{ item.customerName || "" }}-{{ item.projectName }}-合同</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>合同单号:{{ item.businessNo || "--" }}</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>进场时间:{{ changestr(item.workInDate) }}</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>退场时间:{{ changestr(item.workOutDate) }}</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>区域:{{ item.orgName || "--" }}</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>业务负责人:{{ item.customerSalesmanName || "--" }}</text>
          </view>
        </view>
      </cell>
      <cell>
        <view><uni-load-more iconType="auto" :status="morestatus" /></view>
      </cell>
    </list>
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
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
      :disabledAfter="true"
      ref="date"
      themeColor="#E60000"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import filterView from "@/components/common/common-ui/filter-view.vue";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import badgeview from "@/components/common/image-upload/badge-icon.vue";
import taskBtn from "@/common/common-method/task_common_btn.vue";
let timer;
export default {
  components: {
    filterView,
    uniLoadMore,
    labelArrow,
    wPicker,
    badgeview,
    taskBtn,
  },
  data() {
    return {
      datalist: [],
      page: 1,
      morestatus: "more",
      deltaX: 1,
      machineItem: {},
      //------
      showfilter: false,
      searchKey: "",
      selectList: [],
      selectType: "",
      orgArr: [],
      orgDic: {
        value: "",
        label: "请选择区域",
      },
      salesArr: [],
      salesDic: {
        value: "",
        label: "请选择业务负责人",
      },
      searchDate: "请选择在租时间",
    };
  },
  watch: {
    searchKey: {
      handler(val) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          uni.showLoading();
          this.page = 1;
          this.datalist = [];
          this.getdata();
        }, 500);
      },
    },
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.datalist = [];
    this.getdata();
  },
  //上拉加载
  onReachBottom() {
    if (this.morestatus == "noMore") {
      return;
    }
    this.page += 1;
    this.morestatus = "loading";
    this.getdata();
  },
  onLoad(options) {
    this.loadAreaList();
    this.loadOwnerList();
    this.deltaX = options.delta || 1;
    this.machineItem = JSON.parse(decodeURIComponent(options.item));
    uni.showLoading();
    this.getdata();
  },
  methods: {
    changestr(str) {
      if (str == null) {
        return "--";
      }
      return str.split(" ")[0];
    },
    filtrateMenu() {
      this.showfilter = !this.showfilter;
    },
    getdata() {
      let param = {
        current: this.page,
        size: 10,
        licenseId: this.machineItem.licenseId,
        fuzzyParam: this.searchKey === "" ? undefined : this.searchKey,
        customerSalesman: this.salesDic.value === "" ? undefined : this.salesDic.value,
        orgIdList: this.orgDic.value === "" ? undefined : [this.orgDic.value],
        // orgIdList:this.orgDic.value === "" ? undefined : this.$datestr.getOrgIdList(this.orgDic),
        searchDate:
          this.searchDate === "请选择在租时间"
            ? undefined
            : this.searchDate + " 00:00:00",
        state: "6,7,8",
        isSettle: false,
      };
      this.$network
        .getData(this.$url.SEARCH_MACHINECONTRACT_CLAIM, "POST", param)
        .then((result) => {
          let list = result.records;
          this.datalist = this.datalist.concat(list);
          let pages = result.pages;
          if (pages <= this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.hideLoading();
          uni.stopPullDownRefresh();
        })
        .catch((err) => {
          uni.hideLoading();
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
        });
    },
    backToPre(item) {
      this.getContractDetail(item.businessNo);
    },
    getContractDetail(businessNo) {
      uni.showLoading();
      let param = {
        businessNo: businessNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          this.getMachineListWithContract(businessNo, result);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getMachineListWithContract(businessNo, contractDic) {
      let param = {
        contractNo: businessNo,
        type: "claim",
      };
      this.$network
        .getData(this.$url.MACHINE_LIST_BY_CONTRACT, "GET", param)
        .then((result) => {
          let list = result.filter((o) => {
            return o.licenseId === this.machineItem.licenseId;
          });
          uni.$emit("choose-contract-emit", {
            dict: contractDic,
            licenseId: this.machineItem.licenseId,
            machines: list,
          });
          if (this.deltaX == -1) {
            let goDic = {
              dict: contractDic,
              licenseId: this.machineItem.licenseId,
              machines: list,
            };
            let url =
              "/businessPages/pause/create-pause-service?machineitem=" +
              encodeURIComponent(JSON.stringify(goDic));
            uni.redirectTo({
              url: url,
            });
          } else if (this.deltaX == -2) {
            let goDic = {
              dict: contractDic,
              licenseId: this.machineItem.licenseId,
              machines: list,
            };
            let url =
              "/businessPages/claim/create-claim-service?machineitem=" +
              encodeURIComponent(JSON.stringify(goDic));
            uni.redirectTo({
              url: url,
            });
          } else {
            uni.navigateBack({
              delta: Number.parseInt(this.deltaX), //此处直接使用变量无效果
            });
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //------------------区域-------------------------------
    loadAreaList() {
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.orgArr = this.getChildren(list);
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
            children: o.children,
          };
          arr = [...arr, a];
          if (o.children && o.children.length > 0) {
            arr = [...arr, ...this.getChildren(o.children)];
          }
        });
      }
      return arr;
    },
    //------------------业务负责人-------------------------------
    loadOwnerList(orgid, isfirst) {
      uni.showLoading();
      let urlstr = this.$url.USER_LEADERS + "?showAdmin=false";
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.salesArr = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
            };
          });
        })
        .catch((err) => {});
    },
    //筛选相关
    showpick(type) {
      this.selectType = type;
      if (type === "org") {
        this.selectList = this.orgArr;
        this.$refs.selector.show();
      } else if (type === "sales") {
        this.selectList = this.salesArr;
        this.$refs.selector.show();
      } else {
        this.$refs.date.show();
      }
    },
    dialog(val) {
      if (this.selectType === "org") {
        this.orgDic = val.checkArr;
      } else if (this.selectType === "sales") {
        this.salesDic = val.checkArr;
      }
    },
    onConfirm(val) {
      this.searchDate = val.result;
    },
    clearsum() {
      this.orgArr = {
        value: "",
        label: "请选择区域",
      };
      this.salesArr = {
        value: "",
        label: "请选择业务负责人",
      };
      this.searchDate = "请选择在租时间";
      uni.showLoading();
      this.showfilter = false;
      this.page = 1;
      this.datalist = [];
      this.getdata();
    },
    oksum() {
      this.showfilter = false;
      uni.showLoading();
      this.page = 1;
      this.datalist = [];
      this.getdata();
    },
  },
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
  display: flex;
  width: 100%;
  background: $uni-bg-color-grey;
}

.list-style {
  display: flex;
  margin-top: 50px;
  width: 100%;
  flex-direction: column;
}

.cell-style {
  display: flex;
  flex-direction: column;
  border-bottom-color: #eeeeee;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  margin-left: 10px;
  margin-right: 10px;
  background: #ffffff;
}

.cell-view-part {
  display: flex;
  flex: 1;
  background: #ffffff;
  margin-left: 10px;
  justify-content: flex-start;
  align-items: center;
  margin: 5px;
}

.title-style {
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
}

.subtitle-style {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
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
}
.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  margin-bottom: 1px;
  width: 100%;
}
.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px;
  flex-direction: row;
  padding-left: 16px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
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
  margin-right: 10px;
}
//筛选父视图
.filter-view-style {
  height: 35px;
  display: flex;
  background: #eeeeee;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
}
.bottom-search {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  margin-bottom: 1px;
}
.bottom-search-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px;
  align-items: center;
  background: #ffffff;
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
</style>
