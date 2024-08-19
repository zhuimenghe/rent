<template>
  <view class="machineChoose">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="flexBewteen">
      <p class="title"><span class="line"></span>设备信息</p>
      <p style="color: #e60000; margin-right: 10px" @click="gotoAdd()">
        +添加其他设备
      </p>
    </view>
    <view class="card" v-for="(item, index) in machineList">
      <view class="top">
        <view class="left">
          <p>{{ item.serialNo }}</p>
          <p
            style="
              color: #8c8c8c;
              font-size: 12px;
              white-space: nowrap;
              margin-top: 8px;
            "
          >
            {{ item.machineTypeName }} | {{ item.height }} | {{ item.brand }} |
            {{ item.machineType }}
          </p></view
        >
        <view @click="changeCheck(index)">
          <mycheckbox
            class="checkbox"
            :checked="item.checked"
            color="#E60000"
          />
        </view>
      </view>
      <view class="bottom">
        <view class="formItem">
          <view class="flex">
            <p class="mr5 gray">租赁方式:</p>
            <picker
              @change="pickerChange($event, index)"
              :range="selectList"
              range-key="settlementTypeName"
            >
              <p class="uni-input red">{{ item.settlementTypeName }}</p>
            </picker>
          </view>
          <span style="color: #e60000">></span>
        </view>
        <view class="formItem">
          <view class="flex">
            <p class="mr5 gray">计费开始:</p>
            <picker
              mode="date"
              :value="item.startDate"
              :start="startDate"
              :end="endDate"
              @change="datePickerChangeStart($event, index)"
            >
              <view class="uni-input red">{{ item.startDate }}</view>
            </picker>
          </view>
          <span style="color: #e60000">></span>
        </view>

        <view class="formItem">
          <view class="flex">
            <p class="mr5 gray">租赁单价:</p>
            <input
              class="uni-input red"
              type="number"
              :value="item.settlementPrice"
              placeholder="0"
              @input="inputChange($event, index)"
              style="width: 50px; font-size: 14px"
            />
          </view>
          <span style="color: #e60000">元/台</span>
        </view>

        <view class="formItem">
          <view class="flex">
            <p class="mr5 gray">计费结束:</p>
            <picker
              mode="date"
              :value="item.endDate"
              :start="startDate"
              :end="endDate"
              @change="datePickerChangeEnd($event, index)"
            >
              <view class="uni-input red">{{
                endDay(item.endDate, index)
              }}</view>
            </picker>
          </view>
          <span style="color: #e60000">></span>
        </view>
      </view>
    </view>
    <view class="bottom"></view>
    <view class="flow total">
      <view class="total">
        <view class="btn back" @click="back()"><text>返回</text></view>
        <view class="btn" @click="next()"><text>下一步</text></view>
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
      machineList: [],
      selectList: [
        {
          settlementType: "1",
          settlementTypeName: "天租",
        },
        {
          settlementType: "2",
          settlementTypeName: "月租",
        },
      ],
      address: "",
      isHistory: false,
      dict: [],
    };
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },
  onLoad(option) {
    this.machineList = uni.getStorageSync("gps_machineList");
    console.log(this.machineList);
  },
  methods: {
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    back() {
      uni.navigateTo({
        url: `/devicePages/gps/constructionDetail`,
      });
      uni.setStorageSync("gps_machineList", []);
    },
    next() {
      let res = this.machineList.every((e) => {
        return e.settlementPrice == 0;
      });
      if (!res) {
        uni.setStorageSync("gps_machineList", this.machineList);
        uni.navigateTo({
          url: `/devicePages/gps/settle`,
        });
      } else {
        this.showToast("请输入租赁单价");
        return;
      }
    },
    showToast(msg) {
      uni.showToast({
        title: msg,
        icon: "none",
      });
    },
    endDay(day, index) {
      if (!day) {
        this.machineList[index].endDate = format(
          subDays(new Date(), 0),
          "yyyy-MM-dd"
        );
      } else {
        return day;
      }
    },

    changeCheck(idnex) {
      this.machineList[idnex].checked = !this.machineList[idnex].checked;
      this.$forceUpdate();
    },
    pickerChange(val, index) {
      console.log(val);
      this.machineList[index].settlementType =
        this.selectList[val.detail.value].settlementType;
      this.machineList[index].settlementTypeName =
        this.selectList[val.detail.value].settlementTypeName;
      this.$forceUpdate();
    },
    datePickerChangeStart(val, index) {
      this.machineList[index].startDate = val.detail.value;
      this.$forceUpdate();
    },
    datePickerChangeEnd(val, index) {
      this.machineList[index].endDate = val.detail.value;
      this.$forceUpdate();
    },
    inputChange(val, index) {
      console.log(val.detail.value);
      this.machineList[index].settlementPrice = val.detail.value;
      this.$forceUpdate();
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
    gotoAdd() {
      uni.setStorageSync("gps_machineList", this.machineList);
      uni.navigateTo({
        url: `/devicePages/gps/machineAdd`,
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

.card {
  background-color: #fff;
  padding: 12px;
  margin-bottom: 10px;
  .top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e6e6e6;
    .left {
    }
  }
  .bottom {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(2, 45%);
    grid-gap: 6px 30px;
    height: 60px;
    .formItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
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
.uni-picker-container {
  display: block;
}
._title {
  font-size: 14px;
  font-weight: 600;
}
.icon-car {
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.flow {
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
.bottom {
  height: 90px;
}
.red {
  color: #e60000;
}
.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 8px 0;
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
.back {
  background-color: #d8d8d8 !important;
  color: #fff !important;
}
</style>
