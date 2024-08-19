<template>
  <view class="model-container">
    <view class="workin-dd-list">
      <view
        class="workin-dd-list-cell"
        v-for="(item, index) in listData"
        :key="index"
      >
        <view class="head"
          ><view class="content-view" @click.stop="change(index)">
            <view class="title">
              <span class="line"></span> {{ item.typeName || "" }} -
              {{ item.heightName || "" }} ({{ getCheckNum(item) }}/{{
                item.machineList.length
              }})
            </view>
            <span v-if="!item.show" class="iconfont iconarrow-right"></span>
            <span v-else class="iconfont iconarrow-down"></span>
          </view>
          <view v-if="item.show" class="tagbox">
            <p>{{ getMoney(item) }}</p>
            <p>运：¥{{ item.carriage }}</p>
          </view>
        </view>

        <view
          class="flexBetween"
          v-if="item.show"
          v-for="(machine, i) in item.machineList"
          @click="changeCheck(index, i, machine)"
        >
          <view
            >{{ machine.licenseId }}&nbsp;&nbsp;({{
              machine.printCode || "-"
            }})</view
          >
          <mycheckbox
            class="checkbox"
            :checked="machine.checked"
            color="#E60000"
          />
        </view>
        <view class="chooseOther" @click.stop="chooseOther(item)">
          选择其他设备 >
        </view>
      </view>
    </view>
    <view class="bottom"></view>
    <view class="bottom-view">
      <view class="total">
        <view class="choosed-view" @click="back">取消</view>
        <view class="confirm-view" @click="confirm"> 确定</view></view
      >
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      contractDetailId: "",
      contractNo: "",
      checkedList: [], //选中过的数组
      listData: [],
      isShowNum: true,
      businessNo: "",
      machineList: [],
      machines: [],
    };
  },
  onLoad(options) {
    uni.getStorage({
      key: this.$savekey.CONFIG_INFO,
      success: (res) => {
        let obj = res.data.find((o) => o.code === "work_in_show_used_num");
        if (obj) {
          this.isShowNum = obj.value === "true" ? true : false;
        }
      },
    });
    uni.$on("machine-choose", (res) => {
      this.listData.map((e) => {
        // 在对应的类型下添加选择的设备
        if (
          `${e.typeName}${e.heightName}` ==
          `${res.item.typeName}${res.item.heightName}`
        ) {
          e.machineList = [...e.machineList, ...res.machineList];
        } else {
          // 删除高代底
          console.log(`${e.typeName}${e.heightName}`);
          e.machineList.forEach((i, index) => {
            res.machineList.forEach((j) => {
              if (i.licenseId == j.licenseId) {
                e.machineList.splice(index, 1);
              }
            });
          });
        }
      });
      this.machineList.map((e) => {
        res.machineList.map((i) => {
          if (e.licenseId == i.licenseId) {
            e.checked = i.checked;
            e.contractOrderId = i.contractOrderId;
          }
        });
      });
      // console.log(res);

      this.$forceUpdate();
    });
    this.contractDetailId = options.contractDetailId;
    this.contractNo = options.contractNo;
    this.businessNo = options.businessNo;
    this.getWorkInOrderList();
    let machines = JSON.parse(options.machines);
    this.machines = machines;
  },
  methods: {
    //根据合同获取当前未进场的设备
    getWorkInOrderList() {
      uni.showLoading();
      let param = {
        contractDetailId: this.contractDetailId || "",
        contractNo: this.contractNo || "",
      };
      let url = this.$url.WORK_IN_ORDER_LEFT;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          uni.hideLoading();

          this.listData = result
            ? result.map((o) => {
                return {
                  ...o,
                  machineList: [],
                  show: true,
                };
              })
            : [];
          this.getMachine();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getMachine() {
      uni.showLoading();
      let param = {
        workInNo: this.businessNo,
        size: -1,
      };
      let url = this.$url.WORK_IN_CARCHOOSE_NEW;
      this.$network
        .getData(url, "POST", param)
        .then((res) => {
          uni.hideLoading();
          this.machineList = res.records.filter((e) => {
            return e.state == 1;
          });
          this.machineList.map((e) => {
            e.checked = false;
          });

          this.listData.map((e) => {
            this.machineList.map((i) => {
              i.checked = false;
              if (
                `${e.typeName}${e.height}` == `${i.typeName}${i.machineHeight}`
              ) {
                i.contractOrderId = e.id;
                e.machineList.push(i);
              }
            });
          });
          if (this.machines.length != 0) {
            this.machines.forEach((e) => {
              this.listData.map((i) => {
                if (e.contractOrderId == i.id) {
                  let flag = true;
                  i.machineList.forEach((j) => {
                    if (j.licenseId == e.licenseId) {
                      flag = false;
                      j.checked = true;
                    }
                  });

                  if (flag) {
                    i.machineList.push(e);
                  }
                }
              });
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    // 当第二次选择时不去获取类型只获取可进场车辆
    _getMachine() {
      uni.showLoading();
      let param = {
        workInNo: this.businessNo,
        size: -1,
      };
      let url = this.$url.WORK_IN_CARCHOOSE_NEW;
      this.$network
        .getData(url, "POST", param)
        .then((res) => {
          uni.hideLoading();
          let machines = res.records.filter((e) => {
            return e.state == 1;
          });
          let arr = [];
          this.listData.forEach((e) => {
            e.show = true;
            e.machineList.forEach((i) => {
              arr.push(i);
            });
          });

          res.records.forEach((e) => {
            e.checked = false;
          });
          this.machineList = this.removeDuplicateObj([...arr, ...machines]);
          this.$forceUpdate();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    removeDuplicateObj(arr) {
      let obj = {};
      arr = arr.reduce((newArr, next) => {
        obj[next.licenseId]
          ? ""
          : (obj[next.licenseId] = true && newArr.push(next));
        return newArr;
      }, []);
      return arr;
    },

    changeCheck(index, i, machine) {
      this.listData[index].machineList[i].checked =
        !this.listData[index].machineList[i].checked;

      this.machineList.map((e) => {
        if (e.licenseId == machine.licenseId) {
          e.checked = machine.checked;
        }
      });
      console.log(this.listData, "changeCheck");
      // 取消选择时 去掉当前类型中不是这个类型的车辆
      if (
        !this.listData[index].machineList[i].checked &&
        `${this.listData[index].machineList[i].typeName}${this.listData[index].machineList[i].machineHeightName}` !=
          `${this.listData[index].typeName}${this.listData[index].heightName}`
      ) {
        this.listData[index].machineList = this.listData[
          index
        ].machineList.filter((e) => {
          return e.licenseId != machine.licenseId;
        });
        this.listData.forEach((e) => {
          if (
            `${e.typeName}${e.heightName}` ==
            `${machine.typeName}${machine.machineHeightName}`
          ) {
            e.machineList.push(machine);
          }
        });
      }
      this.$forceUpdate();
    },
    back() {
      uni.navigateBack();
    },
    confirm() {
      uni.$emit("choosed-orders", {
        listData: this.listData,
        machine: this.machineList.filter((e) => e.checked),
      });
      uni.navigateBack({
        delta: 1,
      });
    },
    change(index) {
      this.listData[index].show = !this.listData[index].show;
      this.$forceUpdate();
    },
    chooseOther(item) {
      // 过滤选中的 过滤除当前类型的
      let arr = this.machineList.filter(
        (e) => !item.machineList.some((i) => i.licenseId === e.licenseId)
      );
      arr = arr.filter((e) => {
        return !e.checked;
      });
      uni.navigateTo({
        url: `./chooseOther?machine=${encodeURIComponent(
          JSON.stringify(arr)
        )}&item=${JSON.stringify(item)}`,
      });
    },
    getMoney(item) {
      let str;
      switch (item.settlementType) {
        case "1":
          str = `¥${item.hire}/天`;
          break;
        case "2":
          str = `¥${item.hire}/月`;
          break;
        case "3":
          str = `¥${item.hire}/月`;
          break;
        case "4":
          str = `¥${item.hire}/天 ¥${item.hireMonthly}/月`;
          break;
        default:
          break;
      }
      return str;
    },
    getCheckNum(item) {
      let arr = item.machineList.filter((e) => {
        return e.checked;
      });

      return arr.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.model-container {
  width: 100%;
  height: 100%;
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
  flex-direction: column;
  margin-bottom: 56px;
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

.head {
  border-bottom: 1px solid #e6e6e6;
}
.content-view {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.tagbox {
  padding: 8px 10px;
  padding-top: 0;
  display: flex;
  justify-content: start;
  align-items: center;
  p {
    display: flex;
    line-height: 18px;
    padding: 3px 5px;
    border-radius: 3px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    margin-top: 3px;
    background: #fff6e7;
    color: #fab045;
  }
}
.iconarrow-right {
  display: flex;
  align-items: center;
  width: 20px;
  height: 100%;
  margin-right: 10px;
}
.iconarrow-down {
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
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
  }
}

.top-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.choosed-view {
  width: 156px;
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
  border-radius: 6px;
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
  padding: 10px;
}
.flexBetween {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}
.flexBetween:last-of-type {
  border-bottom: none !important;
}

.tag {
  display: flex;
  line-height: 18px;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: 3px;
  background: #fff1f0;
  color: #e60000;
}
.bottom {
  height: 30px;
}
</style>
