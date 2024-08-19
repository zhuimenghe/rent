<template>
  <view class="settle-add">
    <!-- 合同 -->
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="contractHead">
      <p class="title">
        <span class="contractType">普</span>
        {{ settleData.contractInfo.customerName }}-{{
          settleData.projectInfo.projectName
        }}
      </p>
      <view class="body">
        <p>合同编号：{{ settleData.contractInfo.contractNo }}</p>
        <p>区域：{{ settleData.contractInfo.orgName }}</p>
        <p>业务负责人：{{ settleData.contractInfo.customerSalesmanName }}</p>
        <p
          style="
            display: flex;
            justify-content: space-between;
            align-items: baseline;
          "
        >
          客户联系人：{{ settleData.contractInfo.contactName }}-{{
            settleData.contractInfo.phoneNum
          }}
        </p>
        <i
          style="position: absolute; bottom: 10px; right: 10px"
          class="iconfont phone-icon icondianhua"
          @click.stop="callPhone(settleData.phoneNum)"
        ></i>
      </view>
    </view>

    <p class="title">
      <span class="line"></span>设备结算信息
      <span style="margin-left: 5px; color: #e60000"></span>
    </p>

    <view class="cardList">
      <p class="_title">
        结算周期：{{ dateSlice(settleData.settlementInfo.settleDateStart) }}-{{
          dateSlice(settleData.settlementInfo.settleDateEnd)
        }}
      </p>
      <view
        class="card"
        v-for="(item, index) in settleData.machineInfoList"
        :key="item.licenseId"
      >
        <view class="top"
          ><p style="font-size: 14px; font-weight: 600">{{ item.serialNo }}</p>
          <p
            style="
              color: #8c8c8c;
              font-size: 12px;
              white-space: nowrap;
              margin-top: 8px;
            "
          >
            {{ item.machineTypeName }}|{{ item.height }}|{{ item.machineType }}
          </p>
        </view>
        <view class="body">
          <p>
            计费周期：{{ dateSlice(item.startDate) }}~{{
              dateSlice(item.endDate)
            }}
          </p>
          <view class="form">
            <view class="formItem">
              <view class="flex gray">
                <p class="mr5">租赁方式：</p>
                <p>{{ item.settlementTypeName }}</p>
              </view>
            </view>
            <view class="formItem">
              <view class="flex gray">
                <p class="mr5">租赁单价：</p>
                <p>{{ item.settlementPrice }}</p>
              </view>
            </view>
            <view class="formItem">
              <view class="flex">
                <p class="mr5 gray">索赔(非必填)：</p>
                <input
                  class="uni-input red"
                  type="number"
                  :value="item.claim"
                  placeholder="请输入"
                  @input="claimChange($event, index)"
                  style="width: 50px; font-size: 12px"
                />
              </view>
            </view>
            <view class="formItem">
              <view class="flex">
                <p class="mr5 gray">报停天数(非必填)：</p>
                <input
                  class="uni-input red"
                  type="number"
                  :value="item.pauseDays"
                  placeholder="请输入"
                  @input="pauseDaysChange($event, index)"
                  style="width: 50px; font-size: 12px"
                />
              </view>
            </view>
          </view>
        </view>
        <view class="foot">
          <p>
            设备小计：<span class="red">¥{{ money(item, index) }}</span>
          </p>
        </view>
      </view>
    </view>

    <p class="title">
      <span class="line"></span>运输信息
      <span style="margin-left: 5px; color: #e60000"></span>
    </p>

    <view class="transport">
      <view
        class="transportCard"
        v-for="(item, index) in settleData.transportInfoDto"
        @click="changeCheck(index)"
      >
        <view class="flex"
          ><mycheckbox
            class="mr5"
            :checked="item.settlementFlag"
            color="#E60000"
          />
          <p class="gray mr5">{{ item.workInOutDate }}</p>
          <p class="gray">{{ item.typeName }}</p></view
        >
        <input
          class="uni-input red"
          type="number"
          :value="item.logisticsCarriage"
          placeholder="请输入运费"
          @input="logisticsCarriage($event, index)"
          style="width: 100px; font-size: 14px; text-align: right"
        />
      </view>
      <view class="adjustment">
        <p class="red">优惠增收</p>
        <view class="flex">
          <view class="item red">
            <span class="mr5">+ </span>
            <span>¥</span>
            <input
              class="uni-input red"
              type="number"
              :value="settleData.adjustmentInfoDto.increasesAccount"
              placeholder="0"
              @input="increasesAccount"
              style="width: 80px; font-size: 12px"
            />
          </view>
          <view class="item">
            <span class="mr5">- </span>
            <span>¥</span>
            <input
              class="uni-input"
              type="number"
              :value="settleData.adjustmentInfoDto.reduceAccount"
              placeholder="0"
              @input="reduceAccount"
              style="width: 80px; font-size: 12px"
            />
          </view>
        </view>
      </view>
    </view>

    <view class="flow">
      <view class="total">
        <span
          >结算汇总： <span style="color: #e60000">¥{{ total }}</span>
        </span>
      </view>
      <view class="button">
        <view
          class="btn back"
          style="background-color: #d8d8d8"
          @click="btnClick('back')"
        >
          上一步</view
        >
        <view
          class="btn"
          style="background-color: #fe931f"
          @click="btnClick('save')"
        >
          提交</view
        >
      </view>
    </view>
  </view>
</template>

<script>
import differenceInDays from "date-fns/differenceInDays";
import parseISO from "date-fns/parseISO";
export default {
  components: {},
  data() {
    return {
      settleData: {},
    };
  },
  onLoad(options) {
    this.settleData = uni.getStorageSync("settleData");
    this.settleData.adjustmentInfoDto = {
      reduceAccount: 0.0,
      increasesAccount: 0.0,
    };
  },
  onShow() {},
  computed: {
    total() {
      let total = 0;
      let logisticsCarriage = 0;
      this.settleData.machineInfoList.map((item) => {
        let day = differenceInDays(
          parseISO(item.endDate).getTime(),
          parseISO(item.startDate).getTime()
        );
        day = day - Number(item.pauseDays) + 1;
        if (item.settlementType == "1") {
          total += Number(item.settlementPrice) * day + Number(item.claim);
        } else {
          total +=
            (Number(item.settlementPrice) / 30) * day + Number(item.claim);
          total = total.toFixed(2);
        }
      });
      this.settleData.transportInfoDto.map((item) => {
        if (item.settlementFlag) {
          logisticsCarriage += Number(item.logisticsCarriage);
        }
      });
      total =
        total +
        Number(logisticsCarriage) +
        Number(this.settleData.adjustmentInfoDto.increasesAccount) -
        Number(this.settleData.adjustmentInfoDto.reduceAccount);

      this.settleData.settlementInfo.total = total;
      return total;
    },
  },
  mounted() {
    this.getTransportInfo();
  },
  created() {},

  methods: {
    // 获取详情
    getTransportInfo() {
      uni.showLoading();
      this.settleData.machineInfoList.map((e) => {
        e.startDate += " 00:00:00";
        e.endDate += " 23:59:59";
      });
      this.$network
        .getData(this.$url.getTransportInfo, "POST", this.settleData)
        .then((res) => {
          uni.hideLoading();
          this.settleData = res;
          console.log(this.settleData);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    callPhone(phone) {
      if (!this.isedit && phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          success: (res) => {
            console.log("调用成功!");
          },
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    claimChange(val, index) {
      this.settleData.machineInfoList[index].claim = val.detail.value;
      this.$forceUpdate();
      console.log(this.machineInfoList);
    },
    increasesAccount(val) {
      this.settleData.adjustmentInfoDto.increasesAccount = val.detail.value;
      this.settleData.adjustmentInfoDto.reduceAccount = 0;
    },
    reduceAccount(val) {
      this.settleData.adjustmentInfoDto.reduceAccount = val.detail.value;
      this.settleData.adjustmentInfoDto.increasesAccount = 0;
    },
    pauseDaysChange(val, index) {
      this.settleData.machineInfoList[index].pauseDays = val.detail.value;
      this.$forceUpdate();
    },
    money(item, index) {
      if (Number(item.settlementPrice) == 0) {
        return 0;
      }
      let day = differenceInDays(
        parseISO(item.endDate).getTime(),
        parseISO(item.startDate).getTime()
      );
      day = day - Number(item.pauseDays) + 1;
      let count;
      if (item.settlementType == "1") {
        count = Number(item.settlementPrice) * day + Number(item.claim);
      } else {
        count = (Number(item.settlementPrice) / 30) * day + Number(item.claim);
        count = count.toFixed(2);
      }

      this.settleData.machineInfoList[index].hireTotal = count;
      //   console.log(this.settleData.machineInfoList);
      return count;
    },
    // 时间显示
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    changeCheck(idnex) {
      this.settleData.transportInfoDto[idnex].settlementFlag =
        !this.settleData.transportInfoDto[idnex].settlementFlag;
      this.$forceUpdate();
    },
    logisticsCarriage(val, index) {
      this.settleData.transportInfoDto[index].logisticsCarriage =
        val.detail.value;
      this.$forceUpdate();
      console.log(this.settleData);
    },
    btnClick(type) {
      switch (type) {
        case "back":
          uni.navigateBack({
            delta: 1,
          });
          break;
        case "save":
          this.save();

          break;
      }
    },
    save() {
      uni.showLoading();
      this.$network
        .getData(this.$url.fastBusiness, "POST", this.settleData)
        .then((res) => {
          uni.hideLoading();
          uni.switchTab({
            url: "/pages/main/business",
          });
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图
.settle-adds {
  display: flex;
  flex: 1;
  width: 100%;
  background: $uni-bg-color-grey;
}

.contractHead {
  padding: 14px 0;
  margin-top: 10px;
  background: #ffffff;
  .title {
    font-size: 16px;
    color: #222222;
    font-weight: 600;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    .contractType {
      width: 22px;
      height: 20px;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      background-color: #f08200;
      color: #ffffff;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      margin-right: 4px;
    }
  }
  .body {
    position: relative;
    padding: 10px;
    height: 123px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 12px;
    color: #8c8c8c;
    font-weight: 400;
    background: #f6f6f6;
    margin: 0 10px;
  }
}
.cardList {
  ._title {
    font-size: 14px;
    font-weight: 600;
    padding: 10px 12px;
    background-color: #fff;
    margin-bottom: 1px;
  }
  .card {
    margin-bottom: 1px;
    background-color: #fff;
    .top {
      padding: 10px 12px;
      border-bottom: #e6e6e6 1px dotted;
    }
    .body {
      padding: 10px 6px;

      .form {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(2, 45%);
        grid-gap: 6px 30px;
        .formItem {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
      }
    }
    .foot {
      padding: 10px 6px;
      border-top: #e6e6e6 1px dotted;
      border-bottom: 1px solid #e6e6e6;
    }
  }
}

.transport {
  background-color: #fff;
  padding: 10px 6px;
  .transportCard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e6e6e6;
    .checkbox {
      margin-right: 5px;
    }
  }
  .adjustment {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
.settle {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 8px 0;
  display: flex;
  align-items: center;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 5px;
  }
}
.red {
  color: #e60000;
}
.flow {
  width: 100%;
  bottom: 0;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  .total {
    margin: 10px;
    margin-top: 0px;
  }
  .button {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 5px;
    justify-content: space-around;
    padding: 10px 10px;
    .btn {
      color: #ffffff;
      text-align: center;
      border-radius: 4px;
      padding: 8px 5px;
    }
  }
}
.phone-icon {
  padding: 4px;
  background-color: rgba(230, 0, 0, 0.08);
  color: #e60000;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}
.alert-cell {
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 10px 15px;
  align-items: center;
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
._title {
  font-size: 14px;
  font-weight: 600;
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
input::-webkit-input-placeholder {
  color: #ccc !important;
}
input:-moz-placeholder {
  color: #ccc !important;
}
input::-moz-placeholder {
  color: #ccc !important;
}
input:-ms-input-placeholder {
  color: #ccc !important;
}
.back {
  background-color: #d8d8d8 !important;
  color: #fff !important;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
