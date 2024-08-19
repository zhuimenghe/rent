<template>
  <view class="content">
    <view class="page-body">
      <view v-if="!edit" class="continue" @click="addMachine">+ 继续添加类型</view>
      <view v-for="(item, i) in selectType" :key="i" class="item-container">
        <view class="item-top">
          <p class="top-left">
            <span class="iconfont iconguanbi1" @click="del(item, i)" v-if="!edit"></span>
            <span class="title">
              {{ item.typeName }}&nbsp;&nbsp;({{ item.heightName }})</span
            >
          </p>
          <p class="top-left">
            <span class="iconfont iconjianhao" @click="dec(i)"></span>
            <span class="margin12">{{ item.orderNum }}</span>
            <span class="iconfont iconjiahao" @click="add(i)"></span>
          </p>
        </view>
        <view class="form">
          <view class="formItem">
            <p class="mr5 gray">日租金(元/台)</p>
            <input
              class="uni-input black"
              type="number"
              v-model="item.selfHire"
              placeholder="0"
              style="font-size: 14px"
            />
          </view>
          <view class="formItem">
            <p class="mr5 gray">月租金(元/台)</p>
            <input
              class="uni-input black"
              type="number"
              v-model="item.selfHireMonthly"
              placeholder="0"
              style="font-size: 14px"
            />
          </view>
          <view class="formItem" v-if="tripCalType!='1'">
            <p class="mr5 gray">运费类型</p>
            <view class="flexBetween">
              <picker
                mode="selector"
                :range="carriageTypesList"
                range-key="label"
                style="width: 100%"
                @change="carriagePickerChange($event, i)"
              >
                <p class="uni-input black">{{ item.carriageTypeName }}</p>
              </picker>
              <span style="color: #333333">></span>
            </view>
          </view>
          <view class="formItem" v-if="tripCalType!='1'">
            <p class="mr5 gray">运费(元/台)</p>
            <input
              class="uni-input black"
              type="number"
              v-model="item.carriage"
              placeholder="0"
              style="font-size: 14px"
            />
          </view>
          <view class="formItem">
            <p class="mr5 gray">预计进场时间 &nbsp;&nbsp; <span class="red">*</span></p>
            <view class="flexBetween">
              <picker
                mode="date"
                :value="item.beginDate"
                :start="startDate"
                :end="endDate"
                @change="datePickerChangeBeg($event, i,item)"
              >
                <view class="uni-input black">{{ dateSlice(item.beginDate) }}</view>
              </picker>
              <span style="color: #333333">></span>
            </view>
          </view>
          <view class="formItem">
            <p class="mr5 gray">预计租期</p>
            <input
              class="uni-input black"
              type="number"
              v-model="item.surplusDay"
              placeholder="0"
              @input="tenancyChange($event, i, item)"
              style="font-size: 14px"
            />
          </view>
          <view class="formItem">
            <p class="mr5 gray">预计退场时间</p>
            <view class="flexBetween">
              {{ item.endDate ? dateSlice(item.endDate) : "" }}
            </view>
          </view>
          <view class="formItem">
            <p class="mr5 gray">押金（元/台）</p>
            <input
              class="uni-input black"
              type="number"
              v-model="item.pledge"
              placeholder="0"
              style="font-size: 14px"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="bottom-view">
      <view class="bottom-n-view">
        <view class="finsih-btn" @click="finishChoose">确定</view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import parseISO from "date-fns/parseISO";
import calRent from "@/common/util/cal-rent-money.js";
import { differenceInDays } from "date-fns";
export default {
  components: {},
  data() {
    return {
      selectType: [],
      isAllChecked: false,
      checkNum: 0,
      carriageTypesList: [],
      type: "add",
    };
  },
  props: {
    types: {
      type: Array,
      default() {
        return [];
      },
    },
    tripCalType:{
      type:String,
      default: '0'
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },
  watch: {},
  created() {
    this.carriageTypesList = uni.getStorageSync("carriage");
    if (!this.carriageTypesList.length) {
      this.loadcarriageTypes();
    }
  },
  mounted() {
    this.selectType = JSON.parse(JSON.stringify(this.types));
    console.log(this.selectType, "---------------");
    this.selectType = this.selectType.filter((e) => {
      return e.checked;
    });
    this.selectType.map((o) => {
      if (o.settlementType == 2 || o.settlementType == 3) {
        o.selfHireMonthly = o.hire;
        o.selfHire = 0;
      } else {
        o.selfHire = o.hire || "";
        o.selfHireMonthly = o.hireMonthly || "";
      }
      let day;
      if (o.beginDate && o.endDate) {
        day = differenceInDays(new Date(o.endDate), new Date(o.beginDate)) + 1; //回显预计租期
        o.surplusDay = day;
      }
      console.log(day, "differenceInDays");
    });
  },
  methods: {
    updateCarriageTypes() {
      // 检查 carriageTypesList 是否至少有一个元素
      if (this.carriageTypesList.length > 0) {
        const firstCarriageType = this.carriageTypesList[0];

        // 遍历 selectType 数组
        this.selectType.forEach((item) => {
          // 设置每个 item 的 carriageTypeName 和 carriageType
          item.carriageTypeName = firstCarriageType.label;
          item.carriageType = firstCarriageType.value;
        });
      }
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
    addMachine() {
      this.$emit("tabChange", 1);
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    dec(index) {
      if (this.selectType[index].orderNum == 0) {
        return;
      }
      this.selectType[index].orderNum--;
    },
    add(index) {
      this.selectType[index].orderNum++;
    },
    getMachineTypes(names) {
      return names.join(",");
    },
    carriagePickerChange(val, index) {
      console.log(val, "val");
      let vm = this;
      console.log(this.carriageTypesList, "carriageTypesList");
      let obj = {
        ...this.selectType[index],
        carriageTypeName: vm.carriageTypesList[val.detail.value].label,
        carriageType: vm.carriageTypesList[val.detail.value].value,
      };
      console.log(obj, "carriageTypesList");
      this.selectType.splice(index, 1, obj);
    },
    datePickerChangeBeg(val, i,item) {
      this.selectType[i].beginDate = val.detail.value + " 00:00:00";
      if(item.surplusDay){
        let date = addDays(
          parseISO(this.selectType[i].beginDate).getTime(),
          item.surplusDay - 1
        );
        this.selectType[i].endDate = format(date, "yyyy-MM-dd") + " 23:59:59";
        this.$forceUpdate();
      }
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    finishChoose() {
      let flag = false;
      this.selectType.map((e) => {
        if (
          (e.selfHire == "" && e.selfHireMonthly == "") ||
          (e.selfHire == "" && e.selfHireMonthly == "")
        ) {
          flag = true;
        }
      });
      for (let i = 0; i < this.selectType.length; i++) {
        if (
          Number(this.selectType[i].selfHire) &&
          Number(this.selectType[i].selfHireMonthly)
        ) {
          // 日租转月租
          this.selectType[i].settlementType = "4";
          this.selectType[i].settlementTypeName = "日租转月租";
          this.selectType[i].hire = this.selectType[i].selfHire;
          this.selectType[i].hireMonthly = this.selectType[i].selfHireMonthly;
        } else if (
          Number(this.selectType[i].selfHire) &&
          !Number(this.selectType[i].selfHireMonthly)
        ) {
          this.selectType[i].settlementType = "1";
          this.selectType[i].hire = this.selectType[i].selfHire;
          this.selectType[i].hireMonthly = "";
          this.selectType[i].settlementTypeName = "天租";
        } else if (
          !Number(this.selectType[i].selfHire) &&
          Number(this.selectType[i].selfHireMonthly)
        ) {
          this.selectType[i].settlementType = "2";
          this.selectType[i].hire = this.selectType[i].selfHireMonthly;
          this.selectType[i].hireMonthly = "";
          this.selectType[i].settlementTypeName = "月租";
        } else {
          this.selectType[i].hire = "";
          this.selectType[i].hireMonthly = "";
        }
      }
      let param = {
        type: this.edit ? "edit" : "add",
        data: JSON.parse(JSON.stringify(this.selectType)),
      };
      if (flag) {
        this.showToast("租金必须大于0");
        return;
      }
      console.log(param, ";param");
      uni.$emit("edit-item-device", param);
      uni.navigateBack();
    },

    del(item, i) {
      this.selectType.splice(i, 1);
      uni.$emit("del-type-item", item);
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    tenancyChange(val, i, item) {
      console.log(val, i, item, "tenancyChange");
      if (val.detail.value != 0) {
        this.selectType[i].tenancy = item.surplusDay + "天";
        let date = addDays(
          parseISO(this.selectType[i].beginDate).getTime(),
          val.detail.value - 1
        );
        this.selectType[i].endDate = format(date, "yyyy-MM-dd") + " 23:59:59";
        this.$forceUpdate();
      } else {
        this.selectType[i].endDate = "";
      }
      console.log(this.selectType);
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin: 8px;
  border-radius: 4px;
  padding: 15px 10px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}

.item-title {
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
  transform: scale(0.7);
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

.continue {
  margin: 8px;
  height: 40px;
  text-align: center;
  font-size: $uni-font-size-lg;
  line-height: 40px;
  color: $uni-color-primary;
  align-self: center;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid $uni-color-primary;
}

.mr5 {
  margin-bottom: 4px;
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
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: $uni-font-size-lg;
  line-height: 40px;
  color: #ffffff;
  align-self: center;
  background: $uni-color-primary;
  border-radius: 6px;
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

.iconguanbi1 {
  display: block;
  border-radius: 50%;
  color: #e6e6e6 !important;
  text-align: center;
  line-height: 20px;
  font-size: 18px;
  margin-right: 6px;
}

.iconjianhao {
  display: block;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 18px;
  color: #e6e6e6 !important;
}

.iconjiahao {
  display: block;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 18px;
  color: #e60000 !important;
}

.top-left {
  display: flex;
  align-items: center;
}

.margin12 {
  margin: 0 12px;
}

.title {
  color: #222222;
  font-size: 16px;
  font-weight: 500;
}

.form {
  display: grid;
  grid-template-columns: repeat(2, 45%);
  grid-gap: 8px 30px;
  margin-top: 10px;

  .formItem {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-bottom: 1px solid #d8d8d8;
  }
}

.black {
  color: #222222;
  padding-bottom: 5px;
}

.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
