<template>
  <view class="content">
    <view v-if="tab == 1">
      <view class="page-body">
        <view
          v-for="(item, i) in types"
          :key="i"
          class="item-container"
          @click="changeType($event, i, item)"
        >
          <view class="item-top" v-if="!item.choosed">
            <view class="item-title">
              <P>{{ item.typeName }}&nbsp;&nbsp;({{ item.heightName || "" }}) </P>
              <P class="gray mt5"
                >待租/全部：<span
                  :class="total(item.list, 'count') == 0 ? 'red' : 'green'"
                >
                  {{ total(item.list, "count") }}</span
                >/{{ total(item.list, "all") }}</P
              >
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
        </view>
      </view>
      <view class="bottom-view">
        <view class="bottom-n-view">
          <p>当前已选{{ checkNum }}个类型</p>
          <view class="finsih-btn" @click="finishChoose">确定</view>
        </view>
      </view>
    </view>
    <view v-else>
      <vehicleEdit
        :types="types"
        :tripCalType="tripCalType"
        @tabChange="tabChange"
        @back="back"
        :edit="edit"
      ></vehicleEdit>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import hoursUtil from "@/common/util/day-working-hours.js";
import calRent from "@/common/util/cal-rent-money.js";
import vehicleEdit from "./vehicleEdit.vue";
export default {
  components: { vehicleEdit },
  data() {
    return {
      types: [],
      oldTypes: [],
      selectMachine: [], //选中设备列表
      carriageTypesList: [],
      isAllChecked: false,
      checkNum: 0,
      tab: 1,
      edit: false,
      tripCalType: "0"
    };
  },
  onLoad(option) {
    if (option.types) {
      this.oldTypes = JSON.parse(decodeURIComponent(option.types));
    }
    if(option.tripCalType){
      this.tripCalType = JSON.parse(option.tripCalType)
    }
    if (option.tab) {
      this.tab = option.tab;
      console.log(this.tab);
      this.types = [JSON.parse(option.item)];
      this.edit = true;
      this.$forceUpdate();
    } else {
      this.loadMachine();
    }
    uni.$on("del-type-item", (item) => {
      this.types.forEach((e) => {
        if (`${item.typeName}${item.height}` == `${e.typeName}${e.height}`) {
          e.checked = false;
        }
      });
    });
  },
  methods: {
    //类型选择change
    changeType(e, i, item) {
      //选中某个类型和高度的数据
      this.types[i].checked = !this.types[i].checked;
      this.checkNum = 0;
      this.types.forEach((e) => {
        if (e.checked) {
          this.checkNum++;
        }
      });
    },

    changeAll() {
      this.isAllChecked = !this.isAllChecked;
      this.types = this.types.map((o) => {
        return {
          ...o,
          selfHire: 0,
          selfHireMonthly: 0,
          list: o.list.map((y) => {
            return {
              ...y,
              checked: this.isAllChecked,
            };
          }),
          checked: this.isAllChecked,
        };
      });
    },
    //型号选择change
    changeMachineItem(e, i, pos) {
      this.types[i].list[pos].checked = !this.types[i].list[pos].checked;
      this.types[i].checked = this.types[i].list.some((o) => o.checked);
    },
    //过滤选中数据
    getSelectData() {
      this.$datestr.printlog(JSON.stringify(this.selectMachine));
    },
    finishChoose() {
      this.carriageTypesList = uni.getStorageSync("carriage");
      if (!(this.carriageTypesList && this.carriageTypesList.length > 0)) {
        this.loadcarriageTypes();
      }
      let defaultDate = hoursUtil.dateSFormat(new Date().getTime());
      this.types.map((o, i) => {
        o.machineType = [];
        o.machineList = [];
        o.beginDate = defaultDate + " 00:00:00";
        o.carriage = "";
        o.endDate = "";
        o.whole = null;
        o.surplusDay = null;
        o.hire = "";
        o.hireMonthly = "";
        o.orderNum = 1;
        o.carriageTypeName =
          this.carriageTypesList.length > 0 ? this.carriageTypesList[0].label : null;
        o.carriageType =
          this.carriageTypesList.length > 0 ? this.carriageTypesList[0].value : null;
        o.pledge = "";
        o.settlementType = 1;
        o.tenancy = calRent.calculateDays(defaultDate, defaultDate, 1);
        o.total = "0.00";
        o.settlementTypeName = "";
      });
      this.tab = 2;
    },
    // 获取运费类型
    loadcarriageTypes() {
      this.$network
        .loadType("carriage_type")
        .then((result) => {
          this.carriageTypesList = result;
          uni.setStorageSync("carriage", this.carriageTypesList);
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    tabChange(val) {
      this.tab = val;
    },
    //加载数据
    loadMachine() {
      uni.showLoading({
        mask: true,
      });
      this.$network
        .getData(this.$url.MACHINE_BRAND_HEIGTH_LIST, "GET", null)
        .then((result) => {
          uni.hideLoading();
          this.types = [];
          let arr = result.filter((e) => {
            return e.device_type == 1;
          });
          console.log(arr, "arr");
          arr.forEach((o) => {
            if (!this.types.some((y) => y.height === o.height && y.type === o.type)) {
              let objs = arr.filter((y) => y.height === o.height && y.type === o.type);
              objs = objs.map((x) => {
                x.checked = false;
                return {
                  ...x,
                };
              });
              this.types = [
                ...this.types,
                {
                  type: o.type,
                  typeName: o.typeName,
                  height: o.height,
                  heightName: o.heightName,
                  choosed: false,
                  checked: false,
                  list: objs,
                  machineTypeName: `${o.brand}-${o.name}`,
                },
              ];
            }
          });

          this.types.sort(function (x, y) {
            if (x.type < y.type) {
              return -1;
            }
            if (x.type > y.type) {
              return 1;
            }
            if (x.type == y.type) {
              if (x.height < y.height) {
                return -1;
              }
              if (x.height > y.height) {
                return 1;
              }
            }
            return 0;
          });
          if (this.oldTypes.length != 0) {
            this.types.map((e) => {
              this.oldTypes.map((item) => {
                if (`${item.typeName}${item.height}` == `${e.typeName}${e.height}`) {
                  e.choosed = true;
                }
              });
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    total(arr, type) {
      let num = 0;
      if (type == "count") {
        arr.forEach((e) => {
          num += e.count;
        });
      } else {
        arr.forEach((e) => {
          num += e.all;
        });
      }
      return num;
    },
    back() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: calc(100vh - 71px);
  overflow-y: scroll;
}

.item-container {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin: 8px;
  border-radius: 4px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  align-items: center;
  z-index: 99;
}

.item-title {
  display: flex;
  flex-direction: column;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  padding: 10px;
}

.top-right {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.checkbox {
  transform: scale(0.8);
}

.translate-arrow {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(-90deg);
  transition: all 500ms;
}

.translate-arrow-expend {
  font-size: 16px;
  margin-right: 16px;
  transform: rotate(90deg);
  transition: all 500ms;
}

.item-machine-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px;
}

.l-item {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
  margin-right: 16px;
}

.bottom-view {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: $uni-bg-color-grey;
  z-index: 100;
  background-color: #ffffff;
}

.bottom-n-view {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 0px 16px;
  margin-bottom: 5px;
}

.totalNum {
  width: 80px;
  text-align: center;
  color: $uni-text-color;
  font-weight: bold;
  font-size: $uni-font-size-lg;
}

.finsih-btn {
  width: 160px;
  height: 40px;
  text-align: center;
  font-size: $uni-font-size-lg;
  line-height: 40px;
  color: #ffffff;
  align-self: center;
  background: $uni-color-primary;
  border-radius: 5px;
}

.gray {
  font-size: 12px;
  font-weight: 400;
  color: #8c8c8c;
}

.mt5 {
  margin-top: 5px;
}

.red {
  color: #e60000;
}

.green {
  color: #52c41a;
}
</style>
