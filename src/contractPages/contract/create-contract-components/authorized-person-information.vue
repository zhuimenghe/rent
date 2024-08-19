<template>
  <view>
    <p class="title"><span class="line"></span>授权人信息</p>
    <view class="base-infomation-bg">
      <view class="base-infomation-cell">
        <view class="base-infomation-selector">
          <select-label-item
            :isShowArrow="isShowArrow"
            tagName="进退场授权人"
            :isRequired="false"
            arrowColor="#AFAFAF"
            hint="请选择进退场授权人"
            :value="authorizerInfo.workInAndOutUser.name"
            :isEdit="isEdit"
            icon="iconarrow-right"
            @clickItemLabel="chooseowner('workInAndOutUser')"
          />
        </view>
        <view class="base-infomation-icon base-infomation-selector">
          <view>
            <i class="iconfont iconshouji1"></i>
            <text>{{ authorizerInfo.workInAndOutUser.phoneNum || "-" }}</text>
          </view>
          <view>
            <i class="iconfont iconfont1 iconshenfenzhengkapian"></i>
            <text>{{ authorizerInfo.workInAndOutUser.identity || "-" }}</text>
          </view>
        </view>
      </view>
      <view class="base-infomation-cell">
        <view class="base-infomation-selector">
          <select-label-item
            :isShowArrow="isShowArrow"
            tagName="结算授权人"
            :isEdit="isEdit"
            :isRequired="false"
            arrowColor="#AFAFAF"
            hint="请选择结算授权人"
            :value="authorizerInfo.settlementUser.name"
            icon="iconarrow-right"
            @clickItemLabel="chooseowner('settlementUser')"
          />
        </view>
        <view class="base-infomation-icon base-infomation-selector">
          <view>
            <i class="iconfont iconshouji1"></i>
            <text>{{ authorizerInfo.settlementUser.phoneNum || "-" }}</text>
          </view>
          <view>
            <i class="iconfont iconfont1 iconshenfenzhengkapian"></i>
            <text>{{ authorizerInfo.settlementUser.identity || "-" }}</text>
          </view>
        </view>
      </view>
      <view class="base-infomation-cell">
        <view class="base-infomation-selector">
          <select-label-item
            :isShowArrow="isShowArrow"
            tagName="合同保证人"
            :isEdit="isEdit"
            :isRequired="false"
            arrowColor="#AFAFAF"
            hint="请选择合同保证人"
            :value="authorizerInfo.contractGuaranteeUser.name"
            icon="iconarrow-right"
            @clickItemLabel="chooseowner('contractGuaranteeUser')"
          />
        </view>
        <view class="base-infomation-icon base-infomation-selector">
          <view>
            <i class="iconfont iconshouji1"></i>
            <text>{{ authorizerInfo.contractGuaranteeUser.phoneNum || "-" }}</text>
          </view>
          <view>
            <i class="iconfont iconfont1 iconshenfenzhengkapian"></i>
            <text>{{ authorizerInfo.contractGuaranteeUser.identity || "-" }}</text>
          </view>
        </view>
      </view>
    </view>
    <w-picker
      :selectList="selectList"
      @cancel="handleCancel"
      @confirm="dialog"
      mode="selector"
      canText="删除"
      ref="selector"
      themeColor="#E60000"
    >
      <view class="w-picker-btn" style="color: #e60000" @click="addContonct">新增</view>
    </w-picker>
  </view>
</template>
<script>
import store from "../../../store";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
export default {
  name: "authorized-person-information",
  components: {
    selectorPick,
    selectorInput,
    selectLabelItem,
    wPicker,
  },
  props: {
    isShowArrow: {
      type: Boolean,
      default: true,
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    isSimple: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    "dataDic.customerId": {
      handler(val) {
        if (val && this.isEdit) {
          this.getCustomerContoncts(val);
        }
      },
      immediate: true,
    },
    dataDic: {
      handler(val) {
        if (val.extendedData) {
          let extendedData = JSON.parse(val.extendedData);
          if (extendedData.workInAndOutUserName) {
            this.authorizerInfo.workInAndOutUser = {
              phoneNum: extendedData.workInAndOutUserPhone,
              name: extendedData.workInAndOutUserName,
              label: extendedData.workInAndOutUserName,
              id: extendedData.workInAndOutUserId,
              verified: extendedData.workInAndOutUserIdentity,
              identity: extendedData.workInAndOutUserIdentity,
              type: "进退场授权人",
            };
          } else {
            this.authorizerInfo.workInAndOutUser = {};
          }
          if (extendedData.settleUserName) {
            this.authorizerInfo.settlementUser = {
              phoneNum: extendedData.settleUserPhone,
              id: extendedData.settleUserId,
              name: extendedData.settleUserName,
              verified: extendedData.settleUserIdentity,
              identity: extendedData.settleUserIdentity,
              type: "结算授权人",
            };
          } else {
            this.authorizerInfo.settlementUser = {};
          }
          if (extendedData.contractGuarantorUserName) {
            this.authorizerInfo.contractGuaranteeUser = {
              phoneNum: extendedData.contractGuarantorUserPhone,
              id: extendedData.contractGuarantorUserId,
              name: extendedData.contractGuarantorUserName,
              verified: extendedData.contractGuarantorUserIdentity,
              identity: extendedData.contractGuarantorUserIdentity,
              type: "合同保证人",
            };
          } else {
            this.authorizerInfo.contractGuaranteeUser = {};
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      key: "",
      customerId: "",
      placeholder: "",
      selectList: [],
      originSelectList: [],
      authorizerInfo: {
        workInAndOutUser: {},
        settlementUser: {},
        contractGuaranteeUser: {},
      },
      dutyType: "",
      allContactDuties: [],
    };
  },
  created() {
    this.getsysDictType();
  },

  methods: {
    handleCancel() {
      switch (this.key) {
        case "workInAndOutUser":
          this.authorizerInfo.workInAndOutUser = null;
          break;
        case "settlementUser":
          this.authorizerInfo.settlementUser = null;
          break;
        case "contractGuaranteeUser":
          this.authorizerInfo.contractGuaranteeUser = null;
      }
      this.$emit("dialog", this.authorizerInfo);
    },
    async getsysDictType() {
      uni.showLoading();
      let res = await this.$network.loadUserType("contact_duty");
      this.allContactDuties = res || [];
    },
    //弹窗回调
    dialog(val) {
      switch (this.dutyType) {
        case "workInAndOutUser":
          this.authorizerInfo.workInAndOutUser = val.checkArr;
          break;
        case "settlementUser":
          this.authorizerInfo.settlementUser = val.checkArr;
          break;
        case "contractGuaranteeUser":
          this.authorizerInfo.contractGuaranteeUser = val.checkArr;
          break;
      }
      this.$emit("dialog", this.authorizerInfo);
    },
    // 新增联系人
    addContonct() {
      let customer = {
        customerId: this.dataDic.customerId || "",
        name: "",
        phoneNum: "",
        type: this.dataDic.customerType,
      };
      let url =
        "/otherPages/linkman/connect-create?item=" +
        encodeURIComponent(JSON.stringify(customer)) +
        "&edit=true";
      uni.navigateTo({
        url: url,
      });
      this.$refs.selector && this.$refs.selector.hide();
    },
    /**
     * 获取当前客户下的联系人
     */
    getCustomerContoncts(val) {
      this.selectList = [];
      let url = this.$url.LINKMAN_PERSON_CONNECT + val;
      this.$network
        .getData(url, "GET", null)
        .then((resultList) => {
          console.log(resultList, "resultList");
          if (resultList && resultList.length) {
            for (let i = 0; i < resultList.length; i++) {
              let dutyList = resultList[i].dutyList || [];
              if (resultList[i].id === "0") {
                resultList.splice(i, 1, {
                  ...resultList[i],
                  id: this.dataDic.customerId,
                });
              }
              let duty = [];
              if (dutyList.length > 0) {
                this.$network.loadUserType("contact_duty").then((res) => {
                  res.map((item, index) => {
                    dutyList.map((rs) => {
                      if (item.value == rs) {
                        duty.push(item.label);
                      }
                    });
                  });
                  resultList.splice(i, 1, {
                    ...resultList[i],
                    label: resultList[i].name + "（" + `${duty.join("、")}` + "）",
                    value: resultList[i].id,
                  });
                  this.originSelectList = resultList.slice();
                  //默认展示第一个数据
                  this.contact = resultList[0];
                });
              }
            }
          }

          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    chooseowner(key) {
      this.key = key;
      if (!this.isEdit) return;
      switch (key) {
        case "workInAndOutUser": //dutyType: "4"
          this.dutyType = "workInAndOutUser";
          console.log(this.originSelectList, "this.originSelectList");
          this.selectList = this.originSelectList.filter((c) => {
            let allowTypes = ["4"];
            return c.dutyList.some((d) => allowTypes.includes(d));
          });
          this.$refs.selector && this.$refs.selector.show();
          break;
        case "settlementUser": //dutyType: "3"
          this.dutyType = "settlementUser";
          this.selectList = this.originSelectList.filter((c) => {
            let allowTypes = ["3"];
            return c.dutyList.some((d) => allowTypes.includes(d));
          });
          this.$refs.selector && this.$refs.selector.show();
          break;
        case "contractGuaranteeUser": //dutyType: "6"
          this.dutyType = "contractGuaranteeUser";
          this.selectList = this.originSelectList.filter((c) => {
            let allowTypes = ["6"];
            return c.dutyList.some((d) => allowTypes.includes(d));
          });
          this.$refs.selector && this.$refs.selector.show();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.selector-pick-bg {
  padding: 10px 7px;
}

// .base-infomation-selector {
//     border-bottom: 1rpx solid #e8e8e8;
// }
.base-infomation-cell {
  &:last-child {
    border-bottom: none;
  }
}

.base-infomation-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #e8e8e8;
  padding: 10px 7px;

  view {
    display: flex;
    align-items: center;

    text {
      margin-left: 6rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
      width: 11em;
      overflow: hidden;
      /* 显示省略符号来代表被修剪的文本。 */
      text-overflow: ellipsis;
      /* 文本不换行 */
      white-space: nowrap;
    }
  }
}

::v-deep .iconfont {
  color: coral;
  font-size: 32rpx;
}

.iconfont1 {
  font-size: 42rpx;
}

.base-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: #ffffff;
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}

.title-left {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
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
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
</style>
