<template>
  <view>
    <view class="sum-view-bg" style="margin-bottom: 5px">
      <view
        class="cell-input-view"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <view class="cell-input-view-left boldstyle">
          <text>基本信息</text>
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"
          ><text>补录单号</text><text style="color: #ff0000">*</text></view
        >
        <view class="cell-input-view-right">
          <text class="input-style">{{ dataDic.businessNo || "--" }}</text>
        </view>
      </view>
      <select-label-item
        tagName="合同名称"
        isRequired="true"
        hint="请选择合同"
        :value="getcontractName(dataDic)"
        :icon="righticon"
        @clickItemLabel="gotoContract"
      />
      <view v-if="dataDic.contractNo">
        <view class="cell-input-view">
          <view class="cell-input-view-left"><text>联系人</text></view>
          <view class="cell-input-view-right">
            <input
              class="input-style"
              type="text"
              v-model="dataDic.contactName"
              placeholder="请输入联系人...."
              :disabled="!isedit"
            />
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"><text>联系人电话</text></view>
          <view class="cell-input-view-right">
            <input
              class="input-style"
              type="number"
              :style="{ color: !isedit ? '#E60000' : '#333333' }"
              v-model="dataDic.phoneNum"
              placeholder="请输入联系人电话...."
              :disabled="!isedit"
              @click="callPhone(dataDic.phoneNum)"
            />
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"><text>区域</text></view>
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataDic.orgName || "--" }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left"><text>业务负责人</text></view>
          <view class="cell-input-view-right">
            <text class="input-style">{{ dataDic.customerSalesmanName || "--" }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="sum-view-bg" style="margin-bottom: 5px" v-if="dataDic.contractNo">
      <view
        class="cell-input-view"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <view class="cell-input-view-left boldstyle">
          <text>进场物流</text>
        </view>
      </view>
      <select-label-item
        tagName="进场物流方式"
        hint="请选择进场物流方式"
        :value="dataDic.workInDto.logisticsTypeName"
        :icon="righticon"
        @clickItemLabel="chooseType('jclogisticsType')"
      />
      <select-label-item
        tagName="进场交机人"
        hint="请选择进场交机人"
        :value="dataDic.workInDto.deliveryUserName"
        :icon="righticon"
        @clickItemLabel="chooseType('jcassign')"
      />
      <view v-if="dataDic.workInDto.logisticsType === '2'">
        <select-label-item
          tagName="进场物流公司"
          hint="请选进场择物流公司"
          :value="dataDic.workInDto.logisticsCompanyName"
          :icon="righticon"
          @clickItemLabel="gotoTrans('jc')"
        />
        <view v-if="dataDic.workInDto.logisticsCompanyId">
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>进场联系人</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="text"
                v-model="dataDic.workInDto.logisticsContact"
                :disabled="!isedit"
                placeholder="请输入进场联系人...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>进场联系人电话</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="number"
                v-model="dataDic.workInDto.logisticsPhone"
                :disabled="!isedit"
                placeholder="请输入联系人电话...."
                @click="callPhone(dataDic.workInDto.logisticsPhone)"
                :style="{ color: !isedit ? '#E60000' : '#333333' }"
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"
              ><text>进场物流费</text><text style="color: #ff0000">*</text></view
            >
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="digit"
                v-model="jclogisticsCarriage"
                placeholder="请输入物流运费...."
                :disabled="!isedit"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="sum-view-bg" style="margin-bottom: 5px" v-if="dataDic.contractNo">
      <view
        class="cell-input-view"
        style="
          border-bottom-width: 1px;
          border-bottom-color: #eeeeee;
          border-bottom-style: solid;
        "
      >
        <view class="cell-input-view-left boldstyle">
          <text>退场物流</text>
        </view>
      </view>
      <select-label-item
        tagName="退场物流方式"
        hint="请选择退场物流方式"
        :value="dataDic.workOutDto.logisticsTypeName"
        :icon="righticon"
        @clickItemLabel="chooseType('tclogisticsType')"
      />
      <select-label-item
        tagName="退场交机人"
        hint="请选择退场交机人"
        :value="dataDic.workOutDto.deliveryUserName"
        :icon="righticon"
        @clickItemLabel="chooseType('tcassign')"
      />
      <view v-if="dataDic.workOutDto.logisticsType === '2'">
        <select-label-item
          tagName="退场物流公司"
          hint="请选退场择物流公司"
          :value="dataDic.workOutDto.logisticsCompanyName"
          :icon="righticon"
          @clickItemLabel="gotoTrans('tc')"
        />
        <view v-if="dataDic.workOutDto.logisticsCompanyId">
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>退场联系人</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="text"
                v-model="dataDic.workOutDto.logisticsContact"
                :disabled="!isedit"
                placeholder="请输入退场联系人...."
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>退场联系人电话</text></view>
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="number"
                v-model="dataDic.workOutDto.logisticsPhone"
                :disabled="!isedit"
                placeholder="请输入联系人电话...."
                @click="callPhone(dataDic.workOutDto.logisticsPhone)"
                :style="{ color: !isedit ? '#E60000' : '#333333' }"
              />
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"
              ><text>退场物流费</text><text style="color: #ff0000">*</text></view
            >
            <view class="cell-input-view-right">
              <input
                class="input-style"
                type="digit"
                v-model="tclogisticsCarriage"
                placeholder="请输入物流运费...."
                :disabled="!isedit"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      chooseTypeName: "jc",
      jclogisticsCarriage: "",
      tclogisticsCarriage: "",
    };
  },
  props: {
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isedit: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dataDic(val) {
      console.log(JSON.stringify(val));
    },
    //进场
    jclogisticsCarriage(val) {
      this.jclogisticsCarriage = val;
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        this.jclogisticsCarriage = val;
        let dictNew = {
          ...this.dataDic,
          workInDto: {
            ...this.dataDic.workInDto,
            logisticsCarriage: this.jclogisticsCarriage,
          },
        };
        this.$emit("clickevent", {
          type: "value",
          data: dictNew,
        });
      }, 10);
    },
    "dataDic.workInDto.logisticsContact"(val) {
      let dict = {
        ...this.dataDic,
        workInDto: {
          ...this.dataDic.workInDto,
          logisticsContact: val,
        },
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    "dataDic.workInDto.logisticsPhone"(val) {
      let dict = {
        ...this.dataDic,
        workInDto: {
          ...this.dataDic.workInDto,
          logisticsPhone: val,
        },
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    //退场
    tclogisticsCarriage(val) {
      this.tclogisticsCarriage = val;
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        this.tclogisticsCarriage = val;
        let dictNew = {
          ...this.dataDic,
          workOutDto: {
            ...this.dataDic.workOutDto,
            logisticsCarriage: this.jclogisticsCarriage,
          },
        };
        this.$emit("clickevent", {
          type: "value",
          data: dictNew,
        });
      }, 10);
    },
    "dataDic.workOutDto.logisticsContact"(val) {
      let dict = {
        ...this.dataDic,
        workOutDto: {
          ...this.dataDic.workOutDto,
          logisticsContact: val,
        },
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    "dataDic.workOutDto.logisticsPhone"(val) {
      let dict = {
        ...this.dataDic,
        workOutDto: {
          ...this.dataDic.workOutDto,
          logisticsPhone: val,
        },
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
  },
  created() {
    this.jclogisticsCarriage = this.dataDic.workInDto.logisticsCarriage || "0";
    this.tclogisticsCarriage = this.dataDic.workOutDto.logisticsCarriage || "0";
    //合同
    uni.$on("choose-contract-emit", (usnerinfo) => {
      this.setContractData(usnerinfo.dict);
    });
    //物流公司选择
    uni.$on("choose-trans-emit", (usnerinfo) => {
      this.setlogisticsData(usnerinfo.dict);
    });
  },
  methods: {
    callPhone(phone) {
      if (!this.isedit) {
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
    //时间处理
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //选择合同
    gotoContract() {
      if (this.isedit === false) {
        uni.navigateTo({
          url:
            "/contractPages/contract/contract-detail?businessNo=" +
            this.dataDic.contractNo,
        });
        return;
      }
      let url = "/businessPages/invoice/contract-choose?state=5,6,7,8";
      uni.navigateTo({
        url: url,
      });
    },
    //选择合同处理数据
    setContractData(dict) {
      let dictNew = {
        ...this.dataDic,
        contractDetailId: dict.contractDetailDto.id || "", //合同详情ID
        contractNo: dict.businessNo || "", //合同单号
        customerId: dict.customerId || "", //客户id
        customerName: dict.customerName || "", //客户名称
        projectName: dict.contractDetailDto.projectName || "", //项目名称
        customerSalesman: dict.contractDetailDto.customerSalesman,
        customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
        orgId: dict.orgId,
        orgName: dict.orgName,
        contactName: dict.contractDetailDto.contactName || "",
        phoneNum: dict.contractDetailDto.phoneNum || "",
        orders: dict.contractDetailDto.orderList || [],
      };
      this.$emit("clickevent", {
        type: "value",
        data: dictNew,
      });
    },
    //合同名处理
    getcontractName(val) {
      let customerName = val.customerName || "";
      let projectName = val.projectName || "";
      if (!customerName && !projectName) {
        return "";
      }
      let name = customerName + "-" + projectName;
      return name;
    },
    //
    setlogisticsData(transChooseDic) {
      let dictNew = {
        ...this.dataDic,
      };
      console.log(JSON.stringify(transChooseDic));
      console.log(this.chooseTypeName);
      if (this.chooseTypeName === "jc") {
        dictNew = {
          ...dictNew,
          workInDto: {
            ...dictNew.workInDto,
            logisticsCompanyId: transChooseDic.id,
            logisticsCompanyName: transChooseDic.name,
            logisticsContact: transChooseDic.contacts,
            logisticsPhone: transChooseDic.phoneNum,
            logisticsCarriage: 0,
          },
        };
      } else {
        dictNew = {
          ...dictNew,
          workOutDto: {
            ...dictNew.workOutDto,
            logisticsCompanyId: transChooseDic.id,
            logisticsCompanyName: transChooseDic.name,
            logisticsContact: transChooseDic.contacts,
            logisticsPhone: transChooseDic.phoneNum,
            logisticsCarriage: 0,
          },
        };
      }
      this.$emit("clickevent", {
        type: "value",
        data: dictNew,
      });
    },
    gotoTrans(type) {
      this.chooseTypeName = type;
      if (this.isedit) {
        uni.navigateTo({
          url: "/businessPages/workin/trans-company",
        });
      }
    },
    //各种弹窗选择
    chooseType(type) {
      if (this.isedit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 10px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
  font-size: $uni-font-size-base;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  min-height: 24px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>
