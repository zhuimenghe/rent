<template>
  <view class="creat-invoice-bg">
    <view class="sum-view-bg">
      <view class="titleInfo">
        <p style="font-size: 16px; color: #222222; font-weight: 600">
          {{ item.licenseId }} ({{ item.printCode ? item.printCode : "-" }})
          <span
            v-if="item.subStateName"
            :class="
              item.state == 1
                ? 'icon-car-right-state-rent'
                : 'icon-car-right-state-wait'
            "
            >{{ item.stateName }}
            <text style="margin-left: 5px; margin-right: 5px">|</text
            >{{ item.subStateName }}</span
          >
        </p>
        <p class="info">
          {{ item.typeName }}|{{ item.machineTypeName }}|{{
            item.heightName
          }}|进场单号：{{ item.workInBusinessNo }}
        </p>
        <p class="info">
          启用/退场：{{ dateSlice(item.enableDate) }}/{{
            item.state == 2 ? "-" : dateSlice(item.endDate)
          }}
        </p>
      </view>

      <p class="settle"><span class="line"></span> 基本信息</p>

      <view class="form">
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>结算时间</text>
          </view>
          <view class="cell-input-view-right">
            <myUniDatetimePicker
              v-model="date"
              :value:="date"
              :start="startLimit"
              :end="endLimit"
              type="daterange"
              @maskClick="maskClick"
              @change="dateChange"
              :clear-icon="false"
            />
          </view>
        </view>

  

        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text
              >天租金（元/台）</text
            >
          </view>
          <view class="cell-input-view-right">
            <input
              @blur="getReceivableCustomize('selfHire')"
              class="input-style"
              type="digit"
              v-model="item.hire"
              placeholder="0"
            />
          </view>
        </view>

        <view
          class="cell-input-view"
        >
          <view class="cell-input-view-left">
            <text>月租金（元/台）</text>
          </view>
          <view class="cell-input-view-right">
            <input
              class="input-style"
              type="digit"
              v-model="item.hireMonthly"
              placeholder="0"
              @blur="getReceivableCustomize('selfHireMonthly')"
            />
          </view>
        </view>
        <view class="centerBox">
          <p>租期（天）：{{ item.days }}</p>
          <p>报停（天）：{{ item.pauseDays }}</p>
        </view>
        <view class="centerBox">
          <p>报停总价（元）：{{ item.pauseHireTotal }}</p>
          <p v-if="tripCalType!='1'">运费（元）：{{ item.carriage }}</p>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>押金</text>
          </view>
          <view class="cell-input-view-right">
            <p class="input-style">
              {{ item.pledge }}
            </p>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>索赔（元）</text>
          </view>
          <view class="cell-input-view-right">
            <input
              class="input-style"
              type="digit"
              v-model="item.claimTotal"
              placeholder="0"
              @blur="getReceivableCustomize()"
            />
          </view>
        </view>
        <view
          class="cell-input-view"
          v-if="
            item.settlementType == 1 ||
            item.settlementType == 4 ||
            item.settlementType == 5
          "
        >
          <view class="cell-input-view-left">
            <text>实算天数（天）</text>
          </view>
          <view class="cell-input-view-right">
            <p class="input-style">{{ item.rentDays }}</p>
          </view>
        </view>

        <view
          class="cell-input-view"
          v-if="
            item.settlementType == 2 ||
            item.settlementType == 3 ||
            item.settlementType == 6
          "
        >
          <view class="cell-input-view-left">
            <text>实算天数（月）</text>
          </view>
          <view class="cell-input-view-right">
            <p class="input-style">{{ item.calendarRentMonths }}</p>
          </view>
        </view>
        <view
          class="cell-input-view"
          v-if="
            item.settlementType == 2 ||
            item.settlementType == 3 ||
            item.settlementType == 6
          "
        >
          <view class="cell-input-view-left">
            <text>实算天数（天）</text>
          </view>
          <view class="cell-input-view-right">
 
            <p class="input-style">{{ item.calendarRentDays }}</p>
          </view>
        </view>

        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text>核算调整</text>
          </view>
          <view class="cell-input-view-right">
            <view class="input-style" style="color: #8c8c8c" @click="open">
              {{ item.account == 0 ? "0 " : account }}</view
            >
          </view>
        </view>
      </view>
      <view class="flow total">
        <view class="total">
          <span
            >设备小计： <span style="color: #e60000">¥{{ total }} </span>
          </span>
          <view class="btn" @click="clickBtn('save')"><text>保存</text></view>
        </view>
      </view>
    </view>

    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <!-- 核算 -->
    <view class="pop-container">
      <uni-popup ref="popup" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"><text>核算调整</text></view>
          <view class="dialogForm">
            <span></span>
            <p>增收</p>
            <p>减免</p>
            <p>租金</p>
            <input
              type="digit"
              v-model="item.hireIncrease"
              placeholder="0.00"
              @input="inputChange('hireIncrease',item)"
            />
            <input type="digit" v-model="item.hireReduce" placeholder="0.00" 
            @input="inputChange('hireReduce',item)"

            />
            <p>运费</p>
            <input
              type="digit"
              v-model="item.carriageIncrease"
              placeholder="0.00"
            @input="inputChange('carriageIncrease',item)"

            />
            <input
              type="digit"
              v-model="item.carriageReduce"
              placeholder="0.00"
            @input="inputChange('carriageReduce',item)"

            />
            <p>索赔</p>
            <input
              type="digit"
              v-model="item.claimTotalIncrease"
              placeholder="0.00"
            @input="inputChange('claimTotalIncrease',item)"

            />
            <input
              type="digit"
              v-model="item.claimTotalReduce"
            @input="inputChange('claimTotalReduce',item)"

              placeholder="0.00"
            />
          </view>
          <view class="textareaBox">
            <p>核算备注</p>
            <textarea
            placeholder-style="font-size:12px;color:#ccc"
              placeholder="请输入核算备注"
              v-model="item.adjustComment"
            />
          </view>
          <view class="alert-cell">
            <view class="alert-btn-left" @click="clickBtn('cancle')"
              ><text>取消</text></view
            >
            <view class="alert-btn-right" @click="clickBtn('ok')"
              ><text>保存</text></view
            >
          </view>
        </view>
      </uni-popup>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import myUniDatetimePicker from "./uni-datetime-picker/uni-datetime-picker";
import parseISO from "date-fns/parseISO";
export default {
  components: {
    textLabelItem,
    labelPhone,
    selectorPick,
    wPicker,
    selectLabelItem,
    myUniDatetimePicker,
  },
  data() {
    return {
      item: {
        
      },
      settlementTypeList: [],
      righticon: "iconarrow-right",
      selectList: [],
      date: [],
      phoneNum: "",
      dateType: "",

      accountTotal: 0,
      account: 0,
      index: "",
      businessNo: "",
      contractNo: "",
      startLimit: "",
      endLimit: "",
      tripCalType:'0'
    };
  },
  onLoad(option) {
    this.item = JSON.parse(decodeURIComponent(option.item));
    this.$set(this.item, "selfHire", 0);
    this.$set(this.item, "selfHireMonthly", 0);
    this.$set(this.item, "claimTotalIncrease", this.item.claimIncrease||'0');
    this.$set(this.item, "claimTotalReduce", this.item.claimReduce||'0');
    console.log(JSON.parse(decodeURIComponent(option.date)));
    this.account = this.item.account;
    this.businessNo = option.businessNo;
    this.contractNo = option.contractNo;
    this.startLimit = this.item.beginDate;
    this.tripCalType = option.tripCalType;
    // 休想看懂我的代码

    if (this.item.settleDate) {
      if (
        parseISO(JSON.parse(decodeURIComponent(option.date))[1]).getTime() >
        parseISO(this.item.settleDate).getTime()
      ) {
        this.endLimit = this.item.settleDate;
      } else {
        this.endLimit = JSON.parse(decodeURIComponent(option.date))[1];
      }
    } else {
      this.endLimit = "";
    }
    console.log(this.endLimit, " this.endLimit");
    this.$nextTick(() => {
      this.date = [this.item.beginDate, this.item.endDate];
    });
    this.index = option.index;
  },
  onUnload() {},
  created() {
    this.loadSettlementTypes();
  },
  computed: {
    total() {
      let total = 0.0;
      total =
        Number(this.item.hireTotal) +
        Number(this.item.pauseHireTotal) +
        Number(this.item.claimTotal) +
        Number(this.item.carriage);
      if (this.account) {
        total = this.account + total;
      }
      this.accountTotal = total;
      return this.money(total);
    },
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
    open() {
      this.$refs.popup.open("center");
    },
    // 金额转换
    money(str) {
      return Number(str).toFixed(2);
    },
    timeSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(date.search(" "));
      }
    },
    clickShowPick(type) {
      this.dateType = type;
      this.$refs.date.show();
    },
    loadSettlementTypes() {
      this.$network
        .loadType("settlement_type")
        .then((result) => {
          this.settlementTypeList = result;
        })
        .catch((err) => {});
    },
    getReceivableCustomize(key) {
      if(key){
        if ((this.item.hire&&this.item.hire!=='0') && (this.item.hireMonthly&&this.item.hireMonthly!=='0')) {
            // 日租转月租
            this.item.settlementType = '4';
          } else if ((this.item.hire&&this.item.hire!=='0') && (!this.item.hireMonthly|| this.item.hireMonthly==='0')) {
            this.item.settlementType = '1';
            this.item.hireMonthly=0;
          } else if ((!this.item.hire|| this.item.hire==='0') && (this.item.hireMonthly&&this.item.hireMonthly!=='0')) {
            this.item.settlementType = '2';
            this.item.hire=0;
          }
      
      }
      let body;
      body = {
        contractNo: this.contractNo,
        licenseId: this.item.licenseId,
        isSettle: true,
        hire: this.item.hire,
        workInNo: this.item.workInBusinessNo,
        settlementType: this.item.settlementType,
        beginDate: this.item.beginDate,
        endDate: this.item.endDate,
        claimTotal: this.item.claimTotal,
        hireMonthly: this.item.hireMonthly,
        /*结算单合并*/
      };
      this.$network
        .getData(this.$url.receivable_customize, "GET", body)
        .then((res) => {
          console.log(res,'getReceivableCustomize');
          uni.hideLoading();
          let machineReceivableList = res.machineReceivableList || [];
          if (machineReceivableList) {
            let machine = machineReceivableList[0];
            this.item.days = machine.days || 0;
            this.item.hire = machine.hire || 0;
            this.item.pauseDays = machine.pauseDays || 0;
            this.item.rentDays = machine.rentDays || 0;
            this.item.calendarMonths = machine.calendarMonths || 0;
            this.item.calendarRentMonths = machine.calendarRentMonths || 0;
            this.item.calendarRentDays = machine.calendarRentDays || 0;
            this.item.naturalRentMonths = machine.naturalRentMonths || 0;
            this.item.naturalRentDays = machine.naturalRentDays || 0;
            this.item.calendarDays = machine.calendarDays;
            this.item.carriage = machine.carriage || 0;
            this.item.claimTotal = machine.claimTotal || 0;
            this.item.pledge = machine.pledge || 0;
            this.item.hireTotal = machine.hireTotal || 0;
            this.item.pauseHireTotal = machine.pauseHireTotal || 0;
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    maskClick(date) {
      console.log(date);
    },
    // 日期改变
    dateChange(val) {
      this.item.beginDate = val[0] + " 00:00:00";
      this.item.endDate = val[1] + " 23:59:59";
      this.item.rentDays = this.getReceivableCustomize();
    },

    chooseowner() {
      this.type = "originSettlementType";
      this.selectList = [];
      this.selectList = [...this.settlementTypeList];
      this.showdialog();
    },
    showdialog() {
      this.$refs.selector.show();
    },
    dialog(val) {
      if (this.type === "originSettlementType") {
        console.log( val.checkArr.value);
        this.item.settlementType = val.checkArr.value;
        this.item.originSettlementTypeName = val.result;
        this.getReceivableCustomize();
      }
    },
    clickBtn(type) {
      if (type == "ok") {
        this.item.hireIncrease
          ? this.item.hireIncrease
          : (this.item.hireIncrease = 0);
        this.item.carriageIncrease
          ? this.item.carriageIncrease
          : (this.item.carriageIncrease = 0);
        this.item.claimTotalIncrease
          ? this.item.claimTotalIncrease
          : (this.item.claimTotalIncrease = 0);
        this.item.claimIncrease=this.item.claimTotalIncrease;
        this.item.hireReduce
          ? this.item.hireReduce
          : (this.item.hireReduce = 0);
        this.item.carriageReduce
          ? this.item.carriageReduce
          : (this.item.carriageReduce = 0);
        this.item.claimTotalReduce
          ? this.item.claimTotalReduce
          : (this.item.claimTotalReduce = 0);
        this.item.claimReduce=this.item.claimTotalReduce;
        console.log(this.item);
        this.account =
          Number(this.item.hireIncrease) +
          Number(this.item.carriageIncrease) +
          Number(this.item.claimTotalIncrease) -
          Number(this.item.hireReduce) -
          Number(this.item.carriageReduce) -
          Number(this.item.claimTotalReduce);
        this.item.account = this.account;
      } else if (type == "save") {
        this.item.accountTotal = this.accountTotal;
        uni.$emit("getMachine", { data: this.item, index: this.index });
        uni.navigateBack({
          delta: 1,
        });
      }
      this.$refs.popup.close();
    },
    inputChange(key,item) {
      console.log(key,item,'inputChange');
    },
    addNewPhoneNum() {
      if (this.contractlist.length < 2) {
        this.contractlist.push("");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.creat-invoice-bg {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}
.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 70px;
  background: #ffffff;
}
.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  font-size: $uni-font-size-base;
  border-bottom: 1px dotted $uni-line-color;
}
.cell-input-bottom-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 20px 10px 20px 10px;
  color: #e60000;
  font-size: $uni-font-size-lg;
}
.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-bottom: 10px;
}
.cell-input-view-right {
  display: flex;
  flex: 1;
  margin-left: 10px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.input-style {
  flex: 1;
  text-align: right;
  line-height: 16px;
}
.titleInfo {
  padding: 20px;
  .info {
    color: #8c8c8c;
    font-size: 12px;
    white-space: nowrap;
    margin-top: 8px;
  }
}
.settle {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 10px 0;
  display: flex;
  align-items: center;
  background: #f6f6f6;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 5px;
  }
}
.dialog {
  width: 80%;
  height: 60%;
  background-color: #ffffff;
}

.tip-title {
  display: flex;
  padding: 5px;
  width: 100%;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: #222222;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
}
.alert-cell {
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 10px 15px;
  align-items: center;
}
.alert-btn-left {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 10px 0px;
  background: $uni-line-color;
  color: #000000;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}
.alert-btn-right {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  background: $uni-color-primary;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}
.dialogForm {
  width: 100%;
  display: grid;
  height: 160px;
  padding: 10px;
  grid-template-columns: 25% 25% 25%;
  grid-template-rows: repeat(3, 22%);
  grid-gap: 5px 30px;
  justify-items: start;
  justify-content: center;
}
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 80vw;
  background-color: #fff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  input {
    border: 1px solid #e6e6e6;
    padding: 3px;
    width: 90%;
  }
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
      width: 86px;
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
.textareaBox {
  width: 100%;
  display: grid;
  padding: 0 10px;
  grid-template-columns: 25% 25% 25%;
  grid-gap: 5px 30px;
  justify-items: start;
  justify-content: center;
  textarea {
    width: 190px;
    height: 64px;
    border: 1px solid #e6e6e6;
  }
}
.icon-car-right-state-rent {
  margin-left: 5px;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 10px;
  background: #1890ff;
  border-radius: 5px;
}
.icon-car-right-state-wait {
  margin-left: 5px;
  color: #ffffff;
  font-size: $uni-font-size-sm;
  padding: 2px 4px;
  background: #f0ad4e;
  border-radius: 5px;
}
.centerBox {
  display: grid;
  grid-template-columns: 60% 40%;
  grid-template-rows: 60% 40%;
  padding: 10px;
  border-bottom: 1px dotted #e6e6e6;
}

</style>
