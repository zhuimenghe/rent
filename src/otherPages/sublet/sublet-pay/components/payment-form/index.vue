<template>
  <view class="payment-form">
    <view
      class="sublet-list"
      v-if="
        paymentForm &&
        paymentForm.settleInfoDto &&
        paymentForm.settleInfoDto.subletPayableList &&
        paymentForm.settleInfoDto.subletPayableList.length > 0
      "
    >
      <view
        class="sublet-item"
        v-for="(sublet, subletIndex) in paymentForm.settleInfoDto.subletPayableList"
        :key="subletIndex"
      >
        <view class="sublet-header" @click="changeSubletCheck(sublet)">
          <view class="sublet-info">转租申请单：{{ sublet.subletNo }}</view>
          <mycheckbox
            class="checkbox"
            :checked="sublet.checked"
            color="#E60000"
            v-if="!isPreview"
          />
        </view>
        <view class="data-picker">
          <view class="label">结算周期</view>
          <view class="date-range">
            <myUniDatetimePicker
              ref="timePicker"
              v-model="sublet.dateRange"
              type="daterange"
              @maskClick="maskClick"
              :clear-icon="false"
              @change="(e) => dateChange(e, sublet, subletIndex)"
              :disabled="isPreview"
            />
          </view>
        </view>
        <view class="machine-list">
          <card
            class="machine-item"
            v-for="(machine, machineIndex) in sublet.machinePayableList"
            :key="machineIndex"
            :show-header="false"
          >
            <view class="machine-item-box">
              <view class="machine-header">
                <view class="left-section">
                  <!-- 左侧内容 -->
                  <view class="machine-info"
                    >{{ machine.licenseId }}({{ machine.printCode || "-" }})</view
                  >
                  <view class="machine-subinfo">
                    <view> {{ machine.typeName || "-" }}</view>
                    <view style="margin: 0 10rpx">|</view>
                    <view> {{ machine.machineTypeName || "-" }}</view>
                    <view style="margin: 0 10rpx">|</view>
                    <view> {{ machine.heightName || "-" }}</view>
                  </view>
                  <!-- 这里可以添加更多标签 -->
                </view>
                <view class="right-section" @click="changeMachineCheck(sublet, machine)">
                  <!-- 右侧内容 -->
                  <mycheckbox
                    class="checkbox"
                    :checked="machine.checked"
                    color="#E60000"
                    v-if="!isPreview"
                  />
                  <view
                    :class="{
                      'text-green': machine.stateName || machine.subStateName,
                      'text-orange': !machine.stateName && !machine.subStateName,
                    }"
                  >
                    {{
                      !machine.stateName && !machine.subStateName ? "已还租" : "租赁中"
                    }}</view
                  >
                  <!-- 这里可以添加更多标签 -->
                </view>
              </view>
              <view class="machine-form" v-if="machine.showDetail">
                <!-- 表单输入区域 -->
                <view class="machine-rental-period">
                  <view class="machine-label"
                    >转租周期：{{
                      $dateUtil.dateSFormat(machine.actualSubletDate) || "-"
                    }}~{{
                      machine.rentBackDate
                        ? $dateUtil.dateSFormat(machine.rentBackDate)
                        : "-"
                    }}</view
                  >
                  <!-- 
                                        <view class="machine-content">
                                        <view class="machine-content-half">启租：{{ $dateUtil.dateSFormat(machine.actualSubletDate) || '-' }}</view>
                                        <view class="machine-content-half">还租：{{ machine.rentBackDate ? $dateUtil.dateSFormat(machine.rentBackDate) : '-' }} </view>
                                        </view> 
                                    -->
                </view>

                <view class="machine-settlement-period">
                  <view class="machine-half">
                    <view class="machine-half-label">结算周期起始</view>
                    <select-label-item
                      tagName=""
                      :isTagName="false"
                      :isRequired="false"
                      hint="请选择起始日期"
                      :value="machine.settlementCycle[0]"
                      class="machine-select-item"
                      @clickItemLabel="showDatePick('beginDate', machine, sublet)"
                      v-if="!isPreview"
                    ></select-label-item>
                    <view v-else class="machine-select-item">{{
                      $dateUtil.dateSFormat(machine.beginDate) || "-"
                    }}</view>
                  </view>
                  <view class="machine-half">
                    <view class="machine-half-label">结算周期截止</view>
                    <select-label-item
                      tagName=""
                      :isTagName="false"
                      :isRequired="false"
                      hint="请选择截止日期"
                      :value="machine.settlementCycle[1]"
                      class="machine-select-item"
                      @clickItemLabel="showDatePick('endDate', machine, sublet)"
                      v-if="!isPreview"
                    ></select-label-item>
                    <view v-else class="machine-select-item">{{
                      $dateUtil.dateSFormat(machine.endDate) || "-"
                    }}</view>
                  </view>
                </view>

                <view class="machine-rent">
                  <view v-if="machine.price > 0" class="machine-content-half">
                    <view class="machine-half-label">天租金(元)</view>
                    <input
                      :value="machine.price"
                      class="machine-input-item"
                      @blur="(e) => valueChange(e, machine, sublet, 'price')"
                      :disabled="isPreview"
                    />
                  </view>
                  <view v-if="machine.hireMonthly > 0" class="machine-content-half">
                    <view class="machine-half-label">月租金(元)</view>
                    <input
                      :value="machine.hireMonthly"
                      class="machine-input-item"
                      @blur="(e) => valueChange(e, machine, sublet, 'hireMonthly')"
                      :disabled="isPreview"
                    />
                  </view>
                </view>

                <view class="machine-fees-adjustments">
                  <view class="machine-content-half">
                    <view class="machine-half-label">运费</view>
                    <input
                      type="text"
                      class="machine-input-item"
                      :value="machine.freight"
                      @blur="(e) => valueChange(e, machine, sublet, 'freight')"
                      :disabled="isPreview"
                    />
                  </view>
                  <view class="machine-content-half">
                    <view class="machine-half-label">核算调整</view>
                    <select-label-item
                      tagName=""
                      :isTagName="false"
                      :isRequired="false"
                      :hint="machine.adjust"
                      :value="machine.adjust"
                      class="machine-select-item"
                      @clickItemLabel="showAdjust(machine, sublet)"
                    ></select-label-item>
                    <!-- <view v-else class="machine-select-item">{{ Number(machine.increase || 0) - Number(machine.reduce || 0) }}</view> -->
                  </view>
                </view>

                <view class="machine-other-details">
                  <view class="machine-detail-line">
                    <view class="machine-content-half">
                      <view class="machine-half-label">报停天数：</view>
                      <text>{{ machine.pauseDays }}天</text>
                    </view>
                    <view class="machine-content-half">
                      <view class="machine-half-label">报停金额：</view>
                      <text>￥{{ moneyUtil.dealNumber(machine.pauseHireTotal) }}</text>
                    </view>
                  </view>
                  <view class="machine-detail-line">
                    <view class="machine-content-half">
                      <view class="machine-half-label">实算天数：</view>
                      <text>{{ machine.rentDays }}天</text>
                    </view>
                    <view class="machine-content-half">
                      <view class="machine-half-label">租金成本：</view>
                      <text class="text-orange-color">
                        ￥{{ moneyUtil.dealNumber(getRent(machine)) }}</text
                      >
                    </view>
                  </view>
                </view>
              </view>
              <view class="machine-subtotal">
                <view class="subtotal-label"
                  >设备小计：<text class="text-orange-color"
                    >￥{{ moneyUtil.dealNumber(machinePayableTotal(machine)) }}</text
                  ></view
                >
                <view
                  class="machine-detail-display"
                  @click="machineDetailDisplay(machine, '1', sublet)"
                >
                  {{ machine.showDetail ? "收起" : "查看详细数据" }}
                  <i
                    class="iconfont title-icon iconarrow-right"
                    :class="{
                      'rotate-arrow-positive': machine.showDetail,
                      'rotate-arrow-negative': !machine.showDetail,
                    }"
                  />
                </view>
              </view>
            </view>
          </card>
        </view>
        <view class="additional-fields">
          <!-- 附加字段 -->
          <view class="row item-with-border">
            <view class="half-width col">
              <text class="label">人工费(元)</text>
              <input
                type="digit"
                :placeholder="isPreview ? '-' : '请输入人工费'"
                class="input-field"
                :value="sublet.laborCost"
                @blur="(e) => subletValueChange(e, sublet, 'laborCost')"
                :disabled="isPreview"
              />
            </view>
            <view class="half-width col">
              <text class="label">其他费用(元)</text>
              <input
                type="digit"
                :placeholder="isPreview ? '-' : '请输入其他费用'"
                class="input-field"
                :value="sublet.other"
                @blur="(e) => subletValueChange(e, sublet, 'other')"
                :disabled="isPreview"
              />
            </view>
          </view>

          <!-- 备注 -->
          <view class="item-with-border col remark">
            <text class="label">备注</text>
            <input
              type="text"
              :placeholder="isPreview ? '-' : '备注内容'"
              class="input-field"
              :value="sublet.remark"
              @blur="(e) => subletValueChange(e, sublet, 'remark')"
              :disabled="isPreview"
            />
          </view>
        </view>
        <view class="total"
          >转租单合计：<text class="total-number"
            >￥{{ moneyUtil.dealNumber(payableTotal(sublet)) || 0 }}</text
          ></view
        >
      </view>
    </view>
    <EmptyData
      v-else
      empty-text="当前暂无转租单,请选择转租单"
      externalClass="sublet-payment-form"
    ></EmptyData>
    <w-picker
      mode="date"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <uni-popup ref="payTip" type="center" :mask-click="false">
      <view class="uni-tip">
        <view class="edit-payment">
          <view class="model-tag"><text>核算金额</text></view>
          <view class="processing-payment">
            <view class="input-label">增付</view>
            <input
              class="input-style"
              type="digit"
              v-model="adjustForm.increase"
              placeholder="0.00"
              :disabled="isPreview"
            />
          </view>
          <view class="processing-payment">
            <view class="input-label">减付</view>
            <input
              class="input-style"
              type="digit"
              v-model="adjustForm.reduce"
              placeholder="0.00"
              :disabled="isPreview"
            />
          </view>
          <view class="processing-payment">
            <view class="input-label">备注</view>
            <input
              class="input-style"
              v-model="adjustForm.adjustComment"
              :placeholder="isPreview ? '-' : '备注'"
              :disabled="isPreview"
            />
          </view>
        </view>
        <view class="uni-tip-group-button">
          <text class="uni-tip-button pop-cancel" @click="adjustCancel">取消</text>
          <text
            class="uni-tip-button pop-confirm"
            @click="adjustConfirm"
            v-if="!isPreview"
            >确定</text
          >
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import EmptyData from "@/components/common/sany/empty-data.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import myUniDatetimePicker from "../uni-datetime-picker/uni-datetime-picker";
import card from "@/components/common/sany/card.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
export default {
  name: "PaymentForm",
  props: {
    externalPaymentForm: {
      type: Object,
      default: () => ({}),
    },
    businessNo: {
      type: String,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EmptyData,
    wPicker,
    myUniDatetimePicker,
    card,
    selectLabelItem,
  },
  data() {
    return {
      paymentForm: {
        id: null,
        createBy: null,
        createName: null,
        createTime: null,
        updateBy: null,
        updateName: null,
        updateTime: null,
        delFlag: 0,
        start: null,
        end: null,
        businessNo: "",
        subletCompanyId: "",
        subletNo: null,
        beginDate: "",
        endDate: "",
        total: 0,
        increase: null,
        paidTotal: 0,
        paidRemark: "",
        reduce: null,
        settleInfoDto: {
          payableCurrent: {
            total: "",
            price: "",
            freight: "",
            laborCost: "",
            other: "",
            pauseHire: null,
            beginDate: null,
            endDate: null,
          },
          payable: {
            total: 0,
            price: 0,
            freight: 0,
            laborCost: "",
            other: 0,
            pauseHire: null,
            beginDate: "",
            endDate: "",
          },
          paidTotal: null,
          subletPayableList: [],
        },
        remark: null,
        payableCurrent: null,
        subletCompanyName: null,
        contact: null,
        phone: null,
        userName: null,
        orgName: null,
        address: null,
        settlementNos: [],
        deposit: 0,
      }, // 内部用于处理的数据
      dateType: "",
      currentSublet: {},
      currentMachine: {},
      adjustForm: {
        reduce: 0,
        increase: 0,
        adjustComment: "",
      },
    };
  },
  computed: {},
  created() {},
  watch: {
    externalPaymentForm: {
      handler(newVal) {
        this.paymentForm = { ...newVal }; // 当外部 props 改变时，更新内部数据
        this.paymentForm.settleInfoDto.subletPayableList.forEach((item) => {
          // 创建 dateRange 数组，第一个元素是 beginDate，第二个元素是 endDate
          item.dateRange = [item.beginDate, item.endDate];
          item.checked = this.isPreview ? true : item ? item.checked : true;
          item.machinePayableList.forEach((machineItem) => {
            machineItem.checked = this.isPreview
              ? true
              : machineItem
              ? machineItem.checked
              : true;
            machineItem.adjust =
              Number(machineItem.increase || 0) - Number(machineItem.reduce || 0);
            machineItem.showDetail = true;
          });
        });
        console.log("this.paymentForm.settleInfoDto", this.paymentForm.settleInfoDto);
        // this.$forceUpdate();
      },
      deep: true, // 深度监听，以便于监听对象内部属性的变化
      immediate: true, // 立即触发一次handler，确保初始值也被处理
    },
  },
  methods: {
    openStartPicker() {
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    openEndPicker() {
      this.$refs.date.show(); // 显示 date-picker 组件
    },
    machineDetailDisplay(machine, test, sublett) {
      machine.showDetail = !machine.showDetail;
      this.$forceUpdate();
    },
    // 转租单合计
    payableTotal(sublet) {
      let _this = sublet;
      if (_this) {
        if (!_this.machinePayableList) return 0;
        let list = _this.machinePayableList.filter((o) => o.checked);
        let freight = list.reduce((x, y) => x + Number(y.freight), 0);
        let total = list.reduce((x, y) => x + Number(y.hireTotal), 0);
        let increase = list.reduce((x, y) => x + Number(y.increase), 0);
        let reduce = list.reduce((x, y) => x + Number(y.reduce), 0);
        let pauseHireTotal = list.reduce((x, y) => x + Number(y.pauseHireTotal), 0);
        _this.payableTotal =
          total +
          freight +
          increase -
          reduce +
          pauseHireTotal +
          Number(_this.laborCost || 0) +
          Number(_this.other || 0);
        return _this.payableTotal;
      } else {
        return 0;
      }
    },
    /* 设备小计 */
    machinePayableTotal(machine) {
      let row = machine;
      if (!this.isEdit) row.payableTotal;
      /* 小计 = 应收租金 +
                       运费 +
                       索赔 +
                      （租金增收+运费增收+索赔增收）+
                       (报停金额) -
                      （押金抵扣租金+押金抵扣运费+押金抵扣索赔）-
                      （运费抵扣租金+运费抵扣索赔）-
                      （租金减免+运费减免+索赔减免）
                 */
      let increase = Number(row.increase);
      let reduce = Number(row.reduce);
      row.payableTotal =
        Number(row.hireTotal) +
        Number(row.freight) +
        Number(row.pauseHireTotal) +
        increase -
        reduce;
      return row.payableTotal;
    },
    getRent(row) {
      row = row || {};
      let total = Number(row.hireTotal) + Number(row.pauseHireTotal);
      return total;
    },
    modifySubleaseOrder(sublet) {
      // 收集修改后的转租单信息
      const modifiedInfo = {
        businessNo: null,
        subletNo: sublet.subletNo.trim(),
        isSettle: true,
        renterTripType: sublet.renterTripType,
        beginDate: this.$dateUtil.datetimeFormat(sublet.beginDate),
        endDate: this.$dateUtil.datetimeFormat(sublet.endDate),
        laborCost: sublet.laborCost.trim(), // 假设这是绑定的数据
        other: sublet.other.trim(), // 假设这是绑定的数据
        remark: sublet.remark.trim(), // 假设这是绑定的数据
      };

      // 使用 $emit 将修改后的信息传递给父组件
      this.$emit("update-sublease-order", { modifiedInfo: modifiedInfo, sublet: sublet });
      this.currentMachine = {};
      this.currentSublet = {};
    },
    modifyMachine() {
      // 收集修改后的设备信息
      const modifiedInfo = {
        businessNo: null,
        subletNo: this.currentSublet.subletNo.trim(),
        licenseId: this.currentMachine.licenseId.trim(),
        isSettle: true,
        price: this.currentMachine.price.trim(),
        hireMonthly: this.currentMachine.hireMonthly.trim(),
        freight: this.currentMachine.freight.trim(),
        beginDate: this.$dateUtil.datetimeFormat(this.currentMachine.beginDate),
        endDate: this.$dateUtil.datetimeFormat(this.currentMachine.endDate),
      };

      // 使用 $emit 将修改后的信息传递给父组件
      this.$emit("update-machine", {
        modifiedInfo: modifiedInfo,
        machine: this.currentMachine,
        sublet: this.currentSublet,
      });
      this.currentMachine = {};
      this.currentSublet = {};
    },
    modifyMachineNotFetch() {
      // 收集修改后的设备信息
      const modifiedInfo = {
        checked: this.currentMachine.checked,
        reduce: this.currentMachine.reduce.trim(),
        increase: this.currentMachine.increase.trim(),
        adjustComment: this.currentMachine.adjustComment.trim(),
        adjust:
          Number(this.currentMachine.increase.trim() || 0) -
          Number(this.currentMachine.reduce.trim() || 0),
      };

      // 使用 $emit 将修改后的信息传递给父组件
      this.$emit("update-machine-notfetch", {
        modifiedInfo: modifiedInfo,
        machine: this.currentMachine,
        sublet: this.currentSublet,
      });
      this.currentMachine = {};
      this.currentSublet = {};
    },
    modifySubletNotFetch() {
      const modifiedInfo = {
        checked: this.currentSublet.checked,
        laborCost: this.currentSublet.laborCost.trim(),
        other: this.currentSublet.other.trim(),
        remark: this.currentSublet.remark.trim(),
      };

      // 使用 $emit 将修改后的信息传递给父组件
      this.$emit("update-sublet-notfetch", {
        modifiedInfo: modifiedInfo,
        sublet: this.currentSublet,
      });
      this.currentSublet = {};
    },
    dateChange(e, sublet, subletIndex) {
      console.log("--------------------- dateChange", e);
      if (e && e.length > 1) {
        // const beginDate = new Date(e[0]);
        // const subletDate = new Date(sublet.beginDate);

        // if (beginDate < subletDate) {
        //     uni.showToast({
        //         icon: "none",
        //         title: "结算开始日期不可早于转租日期",
        //     });
        //     this.paymentForm.settleInfoDto.subletPayableList = this.paymentForm.settleInfoDto.subletPayableList.map(item =>
        //         item.subletNo === sublet.subletNo ? { ...item, dateRange: [sublet.beginDate, sublet.endDate] } : item
        //     );
        //     this.$refs.timePicker[subletIndex].close()
        //     this.$forceUpdate();
        //     return;
        // }
        sublet.dateRange = e;
        sublet.beginDate = e[0];
        sublet.endDate = e[1];
        this.modifySubleaseOrder(sublet);
      }
    },
    showDatePick(type, machine, sublet) {
      this.dateType = type;
      this.currentMachine = machine;
      this.currentSublet = sublet;
      this.$refs.date.show();
    },
    showAdjust(machine, sublet) {
      this.currentMachine = machine;
      this.currentSublet = sublet;
      this.adjustForm = {
        reduce: this.currentMachine.reduce,
        increase: this.currentMachine.increase,
        adjustComment: this.currentMachine.adjustComment,
      };
      this.$refs.payTip.open();
    },
    adjustCancel() {
      this.$refs.payTip.close();
      setTimeout(() => {
        this.adjustForm = {
          reduce: 0,
          increase: 0,
          adjustComment: "",
        };
        this.currentMachine = {};
        this.currentSublet = {};
      }, 800);
    },
    adjustConfirm() {
      this.currentMachine.reduce = this.adjustForm.reduce;
      this.currentMachine.increase = this.adjustForm.increase;
      this.currentMachine.adjustComment = this.adjustForm.adjustComment;
      this.modifyMachineNotFetch();
      this.adjustCancel();
    },
    onConfirm(val) {
      if (this.dateType == "beginDate") {
        // 将字符串日期转换为日期对象
        const selectedDate = new Date(val.result.replace(/-/g, "/"));
        const actualSubletDate = new Date(
          this.currentMachine.actualSubletDate.replace(/-/g, "/")
        );

        // 比较日期
        if (selectedDate < actualSubletDate) {
          // 如果 selectedDate 早于 actualSubletDate，显示提示并返回
          uni.showToast({
            icon: "none",
            title: "还租日期不可早于转租开始日期",
          });
          return;
        }
        this.currentMachine.beginDate = val.result + " 00:00:00";
        this.currentMachine.settlementCycle[0] = val.result;
      } else if (this.dateType == "endDate") {
        // 将字符串日期转换为日期对象
        const selectedDate = new Date(val.result.replace(/-/g, "/"));
        const actualSubletDate = new Date(
          this.currentMachine.actualSubletDate.replace(/-/g, "/")
        );
        const beginDate = new Date(this.currentMachine.beginDate.replace(/-/g, "/"));

        // 比较日期
        if (selectedDate < actualSubletDate) {
          // 如果 selectedDate 早于 actualSubletDate，显示提示并返回
          uni.showToast({
            icon: "none",
            title: "还租日期不可早于转租开始日期",
          });
          return;
        } else if (selectedDate < beginDate) {
          uni.showToast({
            icon: "none",
            title: "还租日期不可早于结算周期开始时间",
          });
          return;
        }

        this.currentMachine.endDate = val.result + " 00:00:00";
        this.currentMachine.settlementCycle[1] = val.result;
      }
      this.modifyMachine();
    },
    valueChange(e, machine, sublet, changedProperty) {
      this.currentMachine = machine;
      this.currentSublet = sublet;
      console.log(`${changedProperty}Change`, e.detail.value);
      // 根据 changedProperty 更新相应的属性
      this.currentMachine[changedProperty] = e.detail.value;
      if (changedProperty == "price" || changedProperty == "hireMonthly") {
        if (e.detail.value == 0) {
          this.currentMachine[changedProperty] = "1";
          console.log(`${changedProperty}Change`, this.currentMachine[changedProperty]);
          uni.showToast({
            icon: "none",
            title: "租金不能为0",
          });
        }
      }
      this.modifyMachine();
    },
    subletValueChange(e, sublet, changedProperty) {
      this.currentSublet = sublet;
      console.log(`${changedProperty}Change`, e.detail.value);

      // 根据 changedProperty 更新相应的属性
      this.currentSublet[changedProperty] = e.detail.value;

      this.modifySubletNotFetch();
    },
    changeMachineCheck(sublet, machine) {
      this.currentSublet = sublet;
      this.currentMachine = machine;
      console.log("this.currentSublet.chekced before", this.currentSublet.checked);
      this.currentMachine.checked = !this.currentMachine.checked;
      console.log("this.currentMachine.chekced", this.currentMachine.checked);
      this.modifyMachineNotFetch();
    },
    changeSubletCheck(sublet) {
      this.currentSublet = sublet;
      console.log("this.currentSublet.chekced before", this.currentSublet.checked);
      this.currentSublet.checked = !this.currentSublet.checked;
      console.log("this.currentSublet.chekced", this.currentSublet.checked);
      this.modifySubletNotFetch();
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../../assets/components/_sublet-edit-payment";

.payment-form {
  background-color: $uni-bg-color;

  /* 样式定义 */
  .sublet-list {
    /* 样式定义 */
    .sublet-item {
      padding: 10px;

      /* 样式定义 */
      .sublet-header {
        line-height: 56rpx;
        font-size: 32rpx;
        background-color: $uni-bg-color;
        display: flex;
        justify-content: space-between;
        /* 样式定义 */
      }

      .data-picker {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          // 标签样式
          // font-weight: bold;
          margin-right: 10px;
          color: #8c8c8c;
        }

        .date-range {
          // 日期范围选择器样式
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          // border: 1px solid #DCDFE6;
          padding: 2px 10px;
          color: #8c8c8c;

          .start-date,
          .end-date {
            // 开始和结束日期样式
            cursor: pointer;
            padding: 5px;
          }

          .to-label {
            // “至”字样的样式
            margin: 0 10px;
          }

          .iconic_calendar {
            // 图标样式
            margin-left: 10px;
            font-size: 16px;
          }
        }
      }

      .machine-list {
        /* 样式定义 */
        .machine-item {
          margin: 20rpx 0;
          display: block;

          .machine-item-box {
            padding: 20rpx;
          }

          /* 样式定义 */
          .machine-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1rpx solid #e6e6e6;
            padding: 10rpx 0;

            .left-section {
              display: flex;
              flex-direction: column;
              align-items: flex-statr;
              line-height: 60rpx;

              .machine-subinfo {
                display: flex;
                color: #8c8c8c;
              }
            }

            .right-section {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              line-height: 60rpx;

              .checkbox {
                height: 60rpx;
                display: flex;
                align-items: center;
              }

              .text-green {
                color: #52c41a;
              }

              .text-orange {
                color: #fe931f;
              }
            }
          }
        }

        .machine-form {
          padding-top: 20rpx;
          border-bottom: 1rpx solid #e6e6e6;

          .machine-rental-period {
          }

          .machine-settlement-period {
            display: flex;
            justify-content: space-between;

            .machine-half {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              width: 48%;
            }
          }

          .machine-rent {
            display: flex;
            justify-content: space-between;

            .machine-content-half {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              width: 48%;
            }
          }

          .machine-fees-adjustments {
            display: flex;
            justify-content: space-between;

            .machine-content-half {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              width: 48%;
            }
          }

          .machine-other-details {
            background-color: #f6f6f6;
            margin: 0 -20rpx;
            padding: 0 20rpx;

            .machine-content-half {
              justify-content: flex-start;
            }
          }

          .machine-label {
            margin-bottom: 10rpx;
            line-height: 60rpx;
          }

          .machine-content {
            display: flex;
            justify-content: space-between;
            line-height: 60rpx;
          }

          .machine-content-half {
            display: flex;
            justify-content: space-between;
            line-height: 60rpx;
            width: 48%;
          }

          .machine-half {
            display: flex;
            justify-content: space-between;
            width: 48%;
            line-height: 60rpx;
          }

          .machine-half-label {
            margin-bottom: 5rpx;
            color: #8c8c8c;
          }

          .machine-input-item {
            padding: 10rpx;
            padding-left: 0;
            border-bottom: 1rpx solid #e6e6e6;
          }

          .machine-select-item {
            border-bottom: 1rpx solid #e6e6e6;
          }

          .machine-detail-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0px;
            // background-color: lightgrey;
          }

          /* 样式定义 */
        }

        .machine-subtotal {
          display: flex;
          justify-content: space-between;
          line-height: 66rpx;
          padding-top: 10rpx;

          .machine-label {
            color: #f08200;
          }

          .machine-detail-display {
            display: flex;
            color: $uni-color-primary;

            .rotate-arrow-positive {
              transform: rotate(-90deg);
            }

            .rotate-arrow-negative {
              transform: rotate(90deg);
            }
          }
        }
      }

      .additional-fields {
        padding: 10rpx;

        .row {
          display: flex;
          justify-content: space-between;
        }

        .half-width {
          width: 48%;
        }

        .col {
          padding: 10rpx;
          border-bottom: 1rpx solid #e6e6e6;
          box-sizing: border-box;
        }

        .item-with-border {
          // border-bottom: 1rpx solid #ccc;
          padding-bottom: 10rpx;
          margin-bottom: 10rpx;

          &.remark {
            display: flex;
            justify-content: space-between;

            .label {
              flex: 1;
            }

            .input-field {
              text-align: right;
              flex: 1;
            }
          }
        }

        .label {
          display: block;
          margin-bottom: 5rpx;
        }

        .input-field {
          width: 100%;
          // 可根据需要调整输入框的其他样式
        }
      }
    }

    .total {
      padding: 10rpx;
      font-size: 32rpx;
      font-weight: bolder;

      .total-number {
        color: $uni-color-primary;
      }
    }
  }

  .text-orange-color {
    color: #fe931f;
  }
}

.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}
</style>
