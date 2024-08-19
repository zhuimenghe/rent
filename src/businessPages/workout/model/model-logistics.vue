<template>
  <view>
    <!-- <view class="model-tag"><text>{{modelName}}</text></view> -->
    <p class="title"><span class="line"></span>{{ modelName }}</p>
    <!-- <view v-if="showSelectLogistics">
      <selectorPick
        title="物流类型"
        :isRequire="true"
        placeholder="请选择物流类型"
        :content="workoutDic.logisticsTypeName || ''"
        @clickItem="clickShowPick('logistics')"
        :isEdit="isEdit"
      />
    </view> -->
    <view
      v-if="showLogistics && workoutDic.logisticsType == '3'"
      style="display: flex; flex-direction: column"
    >
      <selectorPick
        :isRequire="true"
        title="物流车辆"
        placeholder="请选择物流车辆"
        :content="vName"
        @clickItem="goTo($event, 'transportMachine')"
      />
      <selectorPick
        title="物流司机"
        placeholder="请选择物流司机"
        :content="logisticsContact"
        @clickItem="goTo($event, 'transportDriver')"
      />
      <selectorInput
        title="联系人电话"
        placeholder="请输入联系人电话..."
        :content="logisticsPhone"
        @textChage="textChange($event, 'logisticsPhone')"
        :isEdit="isEdit"
        @clickItem="callPhone(logisticsPhone)"
        :textColor="!isEdit ? '#E60000' : '#111111'"
        textType="number"
      />
      <selectorInput
        v-if="dataDic.logisticsType != '1'"
        title="交机联系人"
        placeholder="请输入交机联系人"
        :content="workoutDic.deliveryContact"
        @textChage="textChange($event, 'deliveryContact')"
        textType="text"
        :isEdit="isEdit"
      />
      <selectorInput
        v-if="dataDic.logisticsType != '1'"
        title="交机联系人电话"
        placeholder="请输入交机联系人电话"
        :content="workoutDic.deliveryPhone"
        @textChage="textChange($event, 'deliveryPhone')"
        textType="number"
      />
      <selectorInput
        title="物流运费成本"
        placeholder="请输入物流运费成本..."
        :content="logisticsCarriage"
        @textChage="textChange($event, 'logisticsCarriage')"
        :isEdit="isEdit"
        textType="digit"
      />

      <selectortextArea
        title="物流备注"
        placeholder="请输入物流备注..."
        :content="workoutDic.logisticsRemark"
        :isRequire="false"
        @textChage="textChange($event, 'logisticsRemark')"
        :isEdit="isEdit"
      />
    </view>
    <view
      v-if="showLogistics && workoutDic.logisticsType != '3'"
      style="display: flex; flex-direction: column"
    >
      <selectorPick
        :isRequire="true"
        title="物流公司"
        placeholder="请选择物流公司"
        :content="workoutDic.logisticsCompanyName"
        @clickItem="goTo($event, 'logisticsContact')"
        :isEdit="isEdit"
      />
      <selectorPick
        title="物流联系人"
        placeholder="请输入物流联系人"
        :content="logisticsContact"
        @clickItem="goTo($event, 'logisticsContact')"
        :isEdit="isEdit"
      />
      <!-- <selectorInput
        title="物流联系人"
        placeholder="请输入物流联系人..."
        :content="logisticsContact"
        @textChage="textChange($event, 'logisticsContact')"
        @clickItem="gotoContact"
        :isEdit="isEdit"
      /> -->
      <selectorInput
        title="联系人电话"
        placeholder="请输入联系人电话..."
        :content="logisticsPhone"
        @textChage="textChange($event, 'logisticsPhone')"
        :isEdit="isEdit"
        @clickItem="callPhone(logisticsPhone)"
        :textColor="!isEdit ? '#E60000' : '#111111'"
        textType="number"
      />
      <selectorInput
        title="交机联系人"
        placeholder="请输入交机联系人"
        :content="workoutDic.deliveryContact"
        @textChage="textChange($event, 'deliveryContact')"
        textType="text"
        :isEdit="isEdit"
      />
      <selectorInput
        title="交机联系人电话"
        placeholder="请输入交机联系人电话"
        :content="workoutDic.deliveryPhone"
        @textChage="textChange($event, 'deliveryPhone')"
        textType="number"
      />
      <selectorInput
        title="物流运费成本"
        placeholder="请输入物流运费成本..."
        :content="logisticsCarriage"
        @textChage="textChange($event, 'logisticsCarriage')"
        :isEdit="isEdit"
        textType="digit"
      />

      <selectortextArea
        title="物流备注"
        placeholder="请输入物流备注..."
        :content="workoutDic.logisticsRemark"
        :isRequire="false"
        @textChage="textChange($event, 'logisticsRemark')"
        :isEdit="isEdit"
      />
    </view>
    <view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
export default {
  name: "modelLogistics",
  components: {
    selectorPick,
    selectorInput,
    selectortextArea,
  },
  props: {
    //传入的数据
    workoutDic: {
      type: Object,
      default() {
        return {};
      },
    },
    //是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    //是否显示物流
    showLogistics: {
      type: Boolean,
      default: false,
    },
    //是否显示物流类型
    showSelectLogistics: {
      type: Boolean,
      default: false,
    },
    //模块名称
    modelName: {
      type: String,
      default: "物流信息",
    },
  },
  watch: {
    workoutDic(val) {
      this.logisticsContact = this.workoutDic.logisticsContact
        ? this.workoutDic.logisticsContact
        : "";
      this.logisticsCarriage = this.workoutDic.logisticsCarriage
        ? this.workoutDic.logisticsCarriage
        : "0";
      this.logisticsPhone = this.workoutDic.logisticsPhone
        ? this.workoutDic.logisticsPhone
        : "";
    },
    "workoutDic.transportMachine"(val) {
      this.getVehicleName();
    },
    "workoutDic.transportDriver"(val) {
      this.getDriverName();
    },
  },
  data() {
    return {
      righticon: "iconarrow-right",
      logisticsContact: null,
      logisticsCarriage: "0",
      logisticsPhone: null,
      dName: "",
      vName: "",
    };
  },
  created() {
    this.logisticsContact = this.workoutDic.logisticsContact
      ? this.workoutDic.logisticsContact
      : null;
    this.logisticsCarriage = this.workoutDic.logisticsCarriage
      ? this.workoutDic.logisticsCarriage
      : "0";
    this.logisticsPhone = this.workoutDic.logisticsPhone
      ? this.workoutDic.logisticsPhone
      : null;
    this.getVehicleName();
    this.getDriverName();
  },
  methods: {
    getVehicleName() {
      let names =
        this.workoutDic && this.workoutDic.transportMachine
          ? this.workoutDic.transportMachine.map((o) => {
              return o.licenseId;
            })
          : [];
      this.vName = names.join(",");
    },
    getDriverName() {
      let names =
        this.workoutDic && this.workoutDic.transportDriver
          ? this.workoutDic.transportDriver.map((o) => {
              return o.name;
            })
          : [];
      this.dName = names.join(",");
    },
    callPhone(phone) {
      if (!this.isEdit && phone) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: phone,
          // 成功回调
          success: (res) => {
            console.log("调用成功!");
          },

          // 失败回调
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    clickShowPick(val) {
      this.$emit("showPick", {
        pickType: val,
        selectType: "selector",
      });
    },
    goTo(val, type) {
      this.$emit("goTo", {
        type: type,
      });
    },
    textChange(val, type) {
      this.$emit("setLogistics", {
        prop: type,
        value: val,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../css/workout-style";

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
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}

.uni-textarea-textarea {
  background-color: #f6f6f6 !important;
}
</style>
