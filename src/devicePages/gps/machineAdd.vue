<template>
  <view class="machineChoose">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top-search-view">
      <view class="search-box">
        <i class="iconfont search-icon iconzl--sousuo"></i>
        <view class="search-content">
          <input
            style="font-size: 14px"
            placeholder="类型/高度/品牌/机号"
            v-model="keyWord"
            @input="searchTo"
          />
        </view>
      </view>
    </view>

    <view class="cardlist" v-for="(item, index) in machineList">
      <p class="title">
        <span class="line"></span>{{ item.title }}
        <span>{{ ` ( ${item.num}/${item.child.length})` }}</span>
      </p>

      <view class="card" v-for="(childitem, i) in item.child" @click="changeCheck(index, i)">
        <view>
          <p class="_title">
            {{ childitem.licenseId }}
          </p>
          <p class="gray">
            {{ childitem.machineHeightName }} | {{ childitem.machineBrand }} | {{
              childitem.machineTypeName
            }}
          </p>
        </view>
        <mycheckbox
          class="checkbox"
          :checked="childitem.checked"
          color="#E60000"
        />
      </view>
    </view>
    <view class="flow total">
      <view class="total">
        <view class="btn" @click="back()"><text>取消</text></view>
        <view class="btn" @click="next()"><text>确定</text></view>
      </view>
    </view>
  </view>
</template>
<script>
import subDays from "date-fns/subDays";
import format from "date-fns/format";
export default {
  name: "machineChoose",
  components: {},
  data() {
    return {
      oldMachineList: [],
      machineList: [],
      keyWord: "",
      dict: [],
    };
  },
  computed: {},
  onLoad(option) {
    this.oldMachineList = uni.getStorageSync("gps_machineList");
    this.getMoney();
  },
  methods: {
    getList(keyword) {
      let param = {
        keyword,
      };
      this.$network
        .getData(this.$url.WORK_IN_CARCHOOSE_NEW, "POST", param)
        .then((result) => {
          let list = result.records;

          list.forEach((e) => {
            e.checked = false;
            e.settlementType = "1";
            e.settlementTypeName = "天租";
            e.settlementPrice = 0;
            e.serialNo = e.licenseId;
            e.brand = e.machineBrand;
            e.height = e.machineHeightName;
            e.machineType = e.machineTypeName;
            e.claim = 0;
            e.pauseDays = 0;
            e.startDate = format(subDays(new Date(), 0), "yyyy-MM-dd");
            e.endDate = format(subDays(new Date(), 0), "yyyy-MM-dd");
            this.dict.forEach((j) => {
              if (e.machineHeight == j.value) {
                e.settlementPrice = j.label;
              }
            });
          });
          let arr = this.resArr(list, this.oldMachineList);
          this.dealWith(arr);
        })
        .catch((err) => {});
    },
    getMoney() {
      let param = {
        current: 1,
        fuzzyParam: "price",
        size: 50,
      };
      this.$network
        .getData(this.$url.CUR_SYS_DICT, "POST", param)
        .then((res) => {
          uni.hideLoading();
          this.dict = res.records;
          this.getList();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    dealWith(list) {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        let has = false;
        let index = 0;
        list[i].title = `${list[i].typeName}-${list[i].machineHeightName}`;
        list[i].checked = false;
        if (i == 0) {
          arr.push({
            title: list[i].title,
            child: [list[i]],
            num: 0,
          });
          continue;
        } else {
          for (let k = 0; k < arr.length; k++) {
            if (list[i].title == arr[k].title) {
              has = true;
              index = k;
            }
          }
        }

        if (has) {
          arr[index].child.push(list[i]);
        } else {
          arr.push({
            title: list[i].title,
            child: [list[i]],
            num: 0,
          });
        }
      }
      this.machineList = arr;
    },
    changeCheck(index, i) {
      this.machineList[index].child[i].checked =
        !this.machineList[index].child[i].checked;
      let count = 0;
      this.machineList[index].child.map((e) => {
        if (e.checked) {
          count++;
        }
        this.machineList[index].num = count;
      });
      this.$forceUpdate();
    },

    resArr(arr1, arr2) {
      return arr1.filter((v) =>
        arr2.every((val) => val.licenseId != v.licenseId)
      );
    },
    getChoose(list) {},
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    searchTo(val) {
      console.log(val);
      this.getList(val.detail.value);
    },
    next() {
      let arr = [...this.oldMachineList];
      for (let i = 0; i < this.machineList.length; i++) {
        for (let j = 0; j < this.machineList[i].child.length; j++) {
          if (this.machineList[i].child[j].checked) {
            arr.push(this.machineList[i].child[j]);
          }
        }
      }
      uni.setStorageSync("gps_machineList", arr);
      uni.navigateTo({
        url: `/devicePages/gps/machineChoose`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}

.cardlist {
  width: 100%;

  .card {
    box-sizing: border-box;
    margin: 10px;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    height: 60px;
    margin-bottom: 12px;
  }
}

.flex {
  display: flex;
  align-items: center;
}
.flexBewteen {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row {
  margin: 6px 0;
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
.iconshengfenzuobiao_mianxing {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(230, 0, 0, 0.1);
  color: #e60000;
  text-align: center;
  line-height: 20px;
}
.search-content {
  display: flex;
  flex: 1;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  margin-right: 10px;
}
._title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
}
.icon-car {
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.fixed-search-view {
  position: sticky;
  top: 0px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
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
  height: 50px;
  width: 100%;
  background: #ffffff;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  background: #f7f7f7;
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

.search-btn {
  font-size: $uni-font-size-base;
  color: #ffffff;
  background-color: $uni-color-primary;
  border-radius: 4px;
  text-align: center;
  padding: 4px 8px;
  margin-right: 8px;
}

.flow {
  width: 100%;
  position: fixed;
  padding: 10px 0;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
    .btn {
      width: 156px;
      display: flex;
      flex-direction: row;
      padding: 10px 0px;
      background: #e60000;
      color: #ffffff;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}
.mr5 {
  margin-right: 5pxs;
}
.red {
  color: #e60000;
}
.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 10px 0;
  display: flex;
  align-items: center;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
</style>
