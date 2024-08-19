<template>
  <view class="model-container">
    <view class="search">
      <view class="search-box">
        <i class="iconfont search-icon iconzl--sousuo"></i>
        <view class="search-content">
          <input
            style="flex: 1; font-size: 14px"
            placeholder="车号/自喷码"
            v-model="keyword"
            @input="search"
          />
        </view>
      </view>
      <selectView :value="height" hint="高度" @clickSelect="showPick()" />
      <view class="reset-btn" @click="reset">重置</view>
    </view>
    <template v-if="machineList.length > 0">
      <view
        v-for="(item, i) in machineList"
        :key="i"
        class="workin-dd-list"
        @click.native="changeCheck($event, i, item)"
      >
        <view class="item-title">
          <P>{{ item.licenseId }} ({{ item.printCode ? item.printCode : "-" }}) </P>
          <p class="gray">
            <span class="mr5">
              {{ item.machineHeightName ? item.machineHeightName : "-" }}
            </span>
            |
            <span class="mr5 ml5">{{ item.machineBrand ? item.machineBrand : "-" }}</span>
            |
            <span class="ml5 mr5">
              {{ item.machineTypeName ? item.machineTypeName : "-" }}
            </span>
            <span class="ml5 mr5"></span>
          </p>
        </view>
        <view class="top-right">
          <mycheckbox
            class="checkbox"
            :checked="item.checked"
            color="#E60000"
            :value="i"
          />
        </view>
      </view>
    </template>

    <view class="empty" v-else>
      <image class="img" src="../../static/empty.png"></image>
      <text class="text">暂无设备</text>
    </view>

    <view style="height: 86px; width: 100%"></view>
    <view class="bottom-view">
      <view class="total">
        <view class="choosed-view" @click="back">取消</view>
        <view class="confirm-view" @click="confirm"> 确定</view>
      </view>
    </view>
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
export default {
  data() {
    return {
      machineList: [],
      machineListCopy: [],
      item: {},
      selectList: [],
      keyword: "",
      height: "",
    };
  },
  components: {
    selectView,
    wPicker,
  },
  onLoad(option) {
    this.item = JSON.parse(decodeURIComponent(option.item));
    this.machineList = JSON.parse(decodeURIComponent(option.machine));
    console.log(this.machineList, "----------111111111");

    this.machineList = this.machineList.filter((e) => {
      return this.item.type == e.type;
    });
    console.log(this.item, "this.item ");
    this.machineListCopy = JSON.parse(decodeURIComponent(option.machine));
    this.machineListCopy = this.machineListCopy.filter((e) => {
      return this.item.type == e.type;
    });

    this.getHeight();
  },
  methods: {
    back() {
      uni.navigateBack();
    },

    changeCheck(val, index, item) {
      this.machineList.map((e) => {
        if (e.licenseId == item.licenseId) {
          e.checked = !e.checked;
          e.contractOrderId = this.item.id;
        }
      });
    },
    getHeight() {
      uni.showLoading();
      let url = this.$url.CUR_SYS_DICT;
      let param = {
        fuzzyParam: "height",
        size: -1,
      };
      this.$network
        .getData(url, "POST", param)
        .then((res) => {
          uni.hideLoading();
          this.selectList = res.records;
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    confirm() {
      let arr = this.machineList.filter((e) => e.checked);
      arr.forEach((e) => {
        e.contractOrderId = this.item.id;
      });
      let param = {
        machineList: arr,
        item: this.item,
      };
      uni.$emit("machine-choose", param);
      uni.navigateBack();
    },
    reset() {
      this.machineList = this.machineListCopy.map((item, index) => {
        item = {
          ...item,
          checked: false,
        };
        return item;
      });
      setTimeout(() => {
        if (this.keyword) {
          this.keyword = "";
        }
      }, 100);
    },
    onConfirm(val) {
      console.log(val.result);
      this.machineList = this.machineListCopy.filter((e) => {
        return val.result == e.machineHeightName;
      });
    },
    showPick() {
      this.$refs.selector.show();
    },
    search() {
      if (!!this.keyword) {
        this.machineList = this.machineList.filter((e) => {
          let a = false;
          let b = false;
          a = e.licenseId.includes(this.keyword);
          if (!!e.printCode) {
            b = e.printCode.includes(this.keyword);
          }
          return a || b;
        });
      } else {
        this.machineList = JSON.parse(JSON.stringify(this.machineListCopy));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.model-container {
  width: 100%;
  height: 100%;
}

.empty {
  @include flex(column, center, center);
  padding: 20rpx;
  margin-top: 100px;

  .img {
    width: 130rpx;
    height: 150rpx;
  }

  .text {
    margin-top: 9rpx;
    color: $uni-text-color-gray;
  }
}

.tag {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  color: $uni-text-color;
  padding-left: 15px;
  padding-bottom: 10px;
  font-size: $uni-font-size-base;
  align-items: center;
}

.workin-dd-list {
  display: flex;
  justify-content: space-between;
  margin: 4px 8px;
  padding: 6px;
  border-color: #eeeeee;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  background-color: #ffffff;

  .item-title {
    display: flex;
    flex-direction: column;
  }
}

.workin-dd-list-cell {
  margin: 4px 8px;
  border-color: #eeeeee;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  background-color: #ffffff;
}

.checkbox {
  transform: scale(0.7);
  margin-right: 4px;
  margin-left: 4px;
}

.content-view {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.iconarrow-right {
  display: flex;
  align-items: center;
  width: 20px;
  height: 100%;
  margin-right: 10px;
}

.cell-input-view-list {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 5px;
  margin-right: 5px;
  font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 32px;
  flex: 1;
}

.cell-input-view-left {
  width: auto;
  white-space: nowrap;
  font-size: $uni-font-size-sm;
  color: $uni-text-color-gray;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 48px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
  box-shadow: 1px 0px 1px $uni-text-color-gray;
}

.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.choosed-view {
  margin-left: 16px;
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.choosed-view span {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  margin-left: 4px;
}

.gray {
  color: #8c8c8c;
  font-size: 12px;
}

.ml5 {
  margin-left: 5px;
}

.mr5 {
  margin-right: 5px;
}

.confirm-view {
  margin-right: 16px;
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  padding: 5px 10px;
  border-radius: 4px;
}

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 5px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}

.chooseOther {
  display: flex;
  color: #e60000;
  font-size: 14px;
  border-top: 1px solid #e6e6e6;
  padding: 10px;
}

.bottom-view {
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;

  .total {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
  }
}

.choosed-view {
  flex:1;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  background-color: #d8d8d8 !important;
  color: #fff !important;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 6px;
  margin-right: 10px;
}

.choosed-view span {
  color: $uni-color-primary;
  font-size: $uni-font-size-lg;
  margin-left: 4px;
}

.confirm-view {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  background: #e60000;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 6px;
}

.search {
  display: flex;
  background-color: #fff;
  padding: 6px;
}

.search-box {
  width: 50%;
  background: #f7f7f7;
  height: 35px;
  line-height: 35px;
  display: flex;
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

.reset-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f4f9;
  color: #333;
  padding: 8px 10px;
  flex: 1;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}
</style>
