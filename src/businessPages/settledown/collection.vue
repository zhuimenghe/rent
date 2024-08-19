<template>
  <view class="collection">
    <view class="tab">
      <p :class="flag == 1 ? 'strong' : ''" @click="change(1)">
        收款单 <span class="_line" v-if="flag == 1"></span>
      </p>
      <p :class="flag == 2 ? 'strong' : ''" @click="change(2)">
        退款单 <span class="_line" v-if="flag == 2"></span>
      </p>
    </view>

    <view class="body" v-if="flag == 1">
      <view v-for="(item, index) in proceedsList" :key="item.id" class="card">
        <view class="title"  @click="changeCheck(index, 'proceedsList')">
          <p>收款单：{{ item.businessNo }}</p>
          <mycheckbox
            class="checkbox"
            :checked="item.checked"
            color="#E60000"
            
        /></view>
        <view class="title_info">
          <p>合同名称：{{ item.contactName }}- {{ item.projectName }}</p>
          <p>负责人：{{ item.customerSalesmanName }}</p>
          <p>收款日期：{{ dateSlice(item.receiptDate) }}</p>
          <p>收款方式：{{ item.typeName }}</p>
        </view>
        <view class="message">
          <p>
            <span>押金（元）</span><span>{{ item.deposit || 0 }}</span>
          </p>
          <p>
            <span>租金（元）</span><span>{{ item.hire || 0 }}</span>
          </p>
          <p>
            <span>运费（元）</span><span>{{ item.carriage || 0 }}</span>
          </p>
          <p>
            <span>索赔（元）</span><span>{{ item.claim || 0 }}</span>
          </p>
          <p>
            <span>其他（元）</span><span>{{ item.other || 0 }}</span>
          </p>
          <p>
            <span style="color: #e60000">合计（元）</span
            ><span style="color: #e60000">{{ item.total || 0 }}</span>
          </p>
        </view>
      </view>
    </view>
    <view class="body" v-else>
      <view v-for="(item, index) in reimburse" :key="item.id" class="card">
        <view class="title" @click="changeCheck(index, 'reimburse')">
          <p>退款单：{{ item.businessNo }}</p>
          <mycheckbox
            class="checkbox"
            :checked="item.checked"
            color="#E60000"
           
        /></view>
        <view class="title_info">
          <p>合同名称：{{ item.contactName }}- {{ item.projectName }}</p>
          <p>负责人：{{ item.customerSalesmanName }}</p>
          <p>退款日期：{{ dateSlice(item.refundTime) }}</p>
          <p>退款方式：{{ item.typeName }}</p>
        </view>
        <view class="message">
          <p>
            <span>押金（元）</span><span>{{ item.deposit || 0 }}</span>
          </p>
          <p>
            <span>租金（元）</span><span>{{ item.hire || 0 }}</span>
          </p>
          <p>
            <span>运费（元）</span><span>{{ item.carriage || 0 }}</span>
          </p>
          <p>
            <span>索赔（元）</span><span>{{ item.claim || 0 }}</span>
          </p>
          <p>
            <span>其他（元）</span><span>{{ item.other || 0 }}</span>
          </p>
          <p>
            <span style="color: #e60000">合计（元）</span
            ><span style="color: #e60000">{{ item.total || 0 }}</span>
          </p>
        </view>
      </view>
    </view>

    <view class="flow total">
      <view class="total">
        <span
          >当前已选中：<span style="color: #e60000">{{ proceedsNum }}</span
          >个收款单，<span style="color: #e60000">{{ reimburseNum }}</span
          >个退款单
        </span>

        <view class="btn" @click="clickBtn('save')"><text>保存</text></view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import isEqual  from "date-fns/isEqual";

export default {
  components: {},
  data() {
    return {
      flag: 1,
      proceedsList: [], //收款单
      reimburse: [], //退款单
      proceedsNum: 0,
      reimburseNum: 0,
      contractId: "",
      settlementNo:'',
      dateProceedsList: [],
      dateReimburse: [],
    };
  },
  onLoad(options) {
    console.log(options,'proceedsNo111');
    this.contractId = options.contractId;
    this.settlementNo=options.settlementNo;
    this.dateProceedsList =
      JSON.parse(decodeURIComponent(options.proceedsNo)) || [];
    this.dateReimburse = JSON.parse(decodeURIComponent(options.refundNo)) || [];
  },
  onShow() {},

  computed: {},
  mounted() {
    this.getProceedsList(this.contractId,this.settlementNo);
    this.getReimburseList(this.contractId,this.settlementNo);
  },
  onUnload(){
    let collectionData = {
        collectionCount: 0,
        proceedsNo: [],
      };
      this.proceedsList.forEach((o) => {
        if (o.checked) {
          collectionData.collectionCount += Number(o.total);
          collectionData.proceedsNo.push(o.businessNo);
        }
      });
      /* 退款 */
      let refundData = {
        refundCount: 0,
        refundNo: [],
      };
      this.reimburse.forEach((o) => {
        if (o.checked) {
          refundData.refundCount += Number(o.total);
          refundData.refundNo.push(o.businessNo);
        }
      });
      let data = {
        collectionData: { ...collectionData },
        refundData: { ...refundData },
      };
      uni.$emit("derterminCollection", data);
  },
  methods: {
    change(i) {
      this.flag = i;
      console.log(i, this.flag);
    },
    getProceedsList(contractId,settlementNo) {
      uni.showLoading();
      let param = {
        contractNoList: [contractId],
        settlementNoList:settlementNo?[settlementNo]:null
      };
      this.$network
        .getData(this.$url.proceeds_list, "POST", param)
        .then((res) => {
          uni.hideLoading();
          console.log(res,'getProceedsList');
          if (res.length > 0) {
            let total = 0;
            this.proceedsList = JSON.parse(JSON.stringify(res));
            this.proceedsList.map((e) => {
              if (this.dateProceedsList.indexOf(e.businessNo) != -1) {
                e.checked = true;
                total++;
              } else {
                e.checked = false;
              }
              this.proceedsNum = total;
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getReimburseList(contractId,settlementNo) {
      uni.showLoading();
      let param = {
        contractNoList: [contractId],
        settlementNoList:settlementNo?[settlementNo]:null
      };
      this.$network
        .getData(this.$url.reimburse_list, "POST", param)
        .then((res) => {
          uni.hideLoading();
          if (res.length > 0) {
            let total = 0;
            this.reimburse = JSON.parse(JSON.stringify(res));
            this.reimburse.map((e) => {
              //去掉退款单自动勾选
              if (this.dateReimburse.indexOf(e.businessNo) != -1) {
                e.checked = true;
                total++;
              } else {
                e.checked = false;
              }
              this.reimburseNum = total;
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    changeCheck(index, type) {
      if (type == "reimburse") {
        let total = 0;
        this.reimburse[index].checked = !this.reimburse[index].checked;
        this.reimburse.map((e) => {
          if (e.checked) {
            total++;
          }
          this.reimburseNum = total;
        });
      } else {
        let total = 0;
        this.proceedsList[index].checked = !this.proceedsList[index].checked;
        this.proceedsList.map((e) => {
          if (e.checked) {
            total++;
          }
          this.proceedsNum = total;
        });
      }
      this.$forceUpdate();
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },

    clickBtn() {
      /* 收款 */
      let collectionData = {
        collectionCount: 0,
        proceedsNo: [],
      };
      this.proceedsList.forEach((o) => {
        if (o.checked) {
          collectionData.collectionCount += Number(o.total);
          collectionData.proceedsNo.push(o.businessNo);
        }
      });
      /* 退款 */
      let refundData = {
        refundCount: 0,
        refundNo: [],
      };
      this.reimburse.forEach((o) => {
        if (o.checked) {
          refundData.refundCount += Number(o.total);
          refundData.refundNo.push(o.businessNo);
        }
      });
      let data = {
        collectionData: { ...collectionData },
        refundData: { ...refundData },
      };
      uni.$emit("derterminCollection", data);
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
//背景视图

.collection {
  width: 100%;
}
.settle {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  margin: 8px 0;
  display: flex;
  align-items: center;
  padding: 10px myIndex;
  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 5px;
  }
}
.body {
  padding-bottom: 150px;
}
.tab {
  display: flex;
  background-color: #ffffff;
  justify-content: space-between;
  height: 40px;
  p {
    line-height: 40px;
    width: 45%;
    text-align: center;
    color: #222222;
    font-size: 16px;
    line-height: 40px;
    height: 100%;
    position: relative;
    ._line {
      display: block;
      width: 20px;
      height: 3px;
      background-color: #e60000;
      position: absolute;
      bottom: 0;
      left: 50%;
      translate: -10px;
    }
  }
}
.strong {
  color: #181818 !important;
  font-weight: 600 !important;
  font-size: 18px !important;
}
.card {
  box-sizing: border-box;
  height: 100%;
  background-color: #ffffff;
  height: 240px;
  padding: 10px;
  margin-bottom: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: #222222;
    font-weight: 600;
  }
  .title_info {
    padding: 15px 0;
    color: #8c8c8c;
    display: grid;
    grid-template-columns: 60% 36%;
    grid-gap: 10px;
    border-bottom: 1px dashed #e6e6e6;
  }
  .message {
    display: grid;
    grid-template-columns: repeat(3, 30%);
    padding: 10px 0;
    grid-gap: 10px 15px;
    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      span:nth-child(1) {
        color: #8c8c8c;
      }
      span:nth-child(2) {
        color: #222222;
        font-weight: 600;
      }
    }
  }
}
.flow {
  width: 100%;
  position: fixed;
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
</style>
