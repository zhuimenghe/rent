<template>
  <view class="choose-bg-view">
    <c-search-bar placeholder="客户名称/项目名称" :style="{ top: '0px',position:'sticky' }" :value="keyWord" @input="searchChange" :showBtns="false">
    </c-search-bar>
    <view class="list-style">
      <view class="cell-style" v-for="(item, index) in datalist" :key="index">
        <view @click="backToPre(item)">
          <view class="cell-view-part title-style">
            <text style="color: #fe931f" v-if="item.contractType === '3'">【快】</text>
            <text style="color: #e60000" v-if="item.contractType === '2'">【框】</text>
            <text>{{ item.contactName || "" }}-{{ item.projectName }}-合同</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>{{ "合同单号:" + item.businessNo }}</text>
          </view>
          <view class="cell-view-part subtitle-style">
            <text>{{ "状态:" + item.stateName }}</text>
          </view>
        </view>
      </view>
      <view>
        <view>
          <uni-load-more iconType="auto" :status="morestatus" />
        </view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import { debounce } from '@/common/util/util';
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      datalist: [],
      page: 1,
      morestatus: "more",
      customerId: "",
      statestr: "",
      contractType: "", //合同类型
      pauseNo: "",
      keyWord: "",
      businessType: "",
      isFirst: false, //是否第一地步就是选择合同
      isLoading: false, //是否可点击
    };
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
    console.log(options);
    let title = options.title || "选择合同";
    uni.setNavigationBarTitle({
      title: title,
    });
    this.customid = options.customid || "";
    this.statestr = options.state || "";
    this.contractType = options.contractType || "";
    this.pauseNo = options.businessNo || "";
    this.businessType = options.type || "";
    console.log("businessType===============" + this.businessType);
    if (this.businessType == "workInOut") {
      this.contractType = "1,2";
    }
    if (this.businessType == "workIn" && this.contractType == "") {
      let data = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
      console.log(data);
      let nomalAdd = data.some((x) => x.value === this.$savekey.PERMISSION_WORK_IN_ADD);
      let simpleAdd = data.some(
        (x) => x.value === this.$savekey.PERMISSION_SIMPLE_WORKIN_ADD
      );
      console.log(nomalAdd);
      console.log(simpleAdd);
      if (!nomalAdd || !simpleAdd) {
        if (!nomalAdd) {
          this.contractType = "3";
        } else if (!simpleAdd) {
          this.contractType = "1,2";
        }
      }
    }
    this.isFirst = options.isFirst && options.isFirst == "true" ? true : false;
    uni.showLoading();
    this.getdata();
    uni.$on("choose-contract-machine", (obj) => {
      this.closePage(obj.contract, obj.machine, obj.type);
    });
  },
  onUnload() {
    uni.$off("choose-contract-machine");
  },
  methods: {
    searchChange:debounce(function (val) {
      this.keyWord = val
      this.searchTo()
    }, 500),
    closePage(contract, machineList, type) {
      uni.showLoading({
        mask: true,
      });
      setTimeout(() => {
        uni.hideLoading();
        switch (type) {
          case "pause":
            uni.redirectTo({
              url:
                "/businessPages/pause/create-pause?contract=" +
                encodeURIComponent(JSON.stringify(contract)) +
                "&machineList=" +
                encodeURIComponent(JSON.stringify(machineList)),
            });
            break;
          case "claim":
            uni.redirectTo({
              url:
                "/businessPages/claim/creat-claim?contract=" +
                encodeURIComponent(JSON.stringify(contract)) +
                "&machineList=" +
                encodeURIComponent(JSON.stringify(machineList)),
            });
            break;
          default:
            break;
        }
      }, 200);
    },
    searchTo() {
      this.page = 1;
      this.datalist = [];
      this.getdata();
    },
    getdata() {
      if (this.isLoading) {
        return;
      }
      let param = {
        current: this.page,
        size: 20,
        state: "6,7,8",
        isApplyQuery: true,
      };

      this.isLoading = true;
      this.$network
        .getData(
          this.$url.CONTRACT_DETAIL_RECEIVABLE_PAGE +
            "?timestamp=" +
            new Date().getTime(),
          "POST",
          param
        )
        .then((result) => {
          this.isLoading = false;
          let list = result.records;
          //正在变更和附加中的合同不可被选择变更或附加
          if (
            this.businessType == "changeContract" ||
            this.businessType == "contractExpense"
          ) {
            list = result.records.filter((o) => {
              return !o.changeIng && !o.plusIng;
            });
          }
          console.log(list);
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
          this.isLoading = false;
          uni.hideLoading();
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
        });
    },
    getContractDetail(item) {
      uni.showLoading();
      let param = {
        businessNo: item.businessNo,
        contractStateList: "4,5,6,7,8,9",
      };
      this.$network
        .getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", param)
        .then((result) => {
          uni.hideLoading();
          uni.$emit("choose-contract-emit", {
            dict: result,
          });
          //索赔和报停选完合同后，需要继续选车
          if (this.businessType == "pause") {
            uni.navigateTo({
              url:
                "/businessPages/pause/worked-machine-by-contract?contractNo=" +
                result.businessNo +
                "&delta=2&businessNo=" +
                this.pauseNo +
                "&contract=" +
                encodeURIComponent(JSON.stringify(result)) +
                "&isFirst=" +
                this.isFirst,
            });
          } else if (this.businessType == "claim") {
            uni.navigateTo({
              url:
                "/businessPages/claim/machine-by-contract?contractNo=" +
                result.businessNo +
                "&delta=2&contract=" +
                encodeURIComponent(JSON.stringify(result)) +
                "&isFirst=" +
                this.isFirst,
            });
          } else {
            //第一次选合同后，去对应的业务新建页面
            if (this.isFirst) {
              this.goToNextCreate(result);
            } else {
              uni.navigateBack({
                animationDuration: 200,
              });
            }
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    backToPre(item) {
      this.getContractDetail(item);
    },
    goToNextCreate(item) {
      uni.hideLoading();
      uni.redirectTo({
        url: `/businessPages/settledown/settle-add?contracts=${item.businessNo}&customerId=${item.customerId} `,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: $uni-bg-color-grey;
}

.list-style {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 16rpx;
}

.cell-style {
  display: flex;
  flex-direction: column;
  border-bottom-color: #eeeeee;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  background: #ffffff;
}

.cell-view-part {
  display: flex;
  flex: 1;
  background: #ffffff;
  margin-left: 10px;
  justify-content: flex-start;
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

.top-search-view {
  position: fixed;
  display: flex;
  flex-direction: row;
  height: 50px;
  width: 100%;
  background: #ffffff;
  justify-content: center;
  align-items: center;
  z-index: 991;
}

.search-box {
  background: #eeeeee;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 16px;
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
  flex: 1;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}

.filter-view-style {
  height: 35px;
  width: 60px;
  display: flex;
  background: #e60000;
  color: #ffffff;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
  z-index: 955;
}

.text-style {
  font-size: $uni-font-size-base;
}
</style>
