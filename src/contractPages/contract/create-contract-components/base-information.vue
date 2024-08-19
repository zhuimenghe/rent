<template>
  <view>
    <p class="title"><span class="line"></span>合同基本信息</p>
    <view class="base-infomation-bg">
      <selectorPick
        title="合同单号"
        :isEdit="false"
        :content="dataDic.businessNo"
        :isRequire="true"
        @clickItem="showPick('customer')"
      />
      <selectorPick
        title="合同类型"
        :isEdit="false"
        :content="dataDic.contractTypeName"
        :isRequire="true"
        @clickItem="showPick('customer')"
      />
      <selectorPick
        title="组织"
        placeholder="请选择区域"
        :content="dataDic.orgName"
        :isRequire="true"
        @clickItem="showPick('org')"
        :isEdit="isEdit"
      />
      <selectorPick
        title="客户名称"
        placeholder="请选择客户名称"
        :content="dataDic.customerName"
        :isRequire="true"
        @clickItem="showPick('customer')"
        :isEdit="isEdit"
      >
      <text v-if="dataDic.customerType==1" @click.self.stop="gotoRisk" slot="title-icon" class="iconfont" :class="[`client-icon-1`, `iconqiye2`]"></text>

    </selectorPick>
      <selectorPick
        title="业务负责人"
        placeholder="请选择业务负责人"
        :content="dataDic.customerSalesmanName"
        :isRequire="true"
        @clickItem="showPick('ssn')"
        :isEdit="isEdit"
      />
    
    
      <selectorPick
        v-if="dataDic.customerId && dataDic.customerId != ''"
        :isRequire="false"
        :isEdit="false"
        title="联系人"
        :content="dataDic.contactName"
      />
      <selectorPick
        v-if="dataDic.customerId && dataDic.customerId != ''"
        :isRequire="false"
        :isEdit="false"
        title="手机号"
        :content="dataDic.phoneNum"
        type="phone"
      />
    
    
    </view>
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
export default {
  components: {
    selectorPick,
    selectorInput,
  },
  props: {
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
  data() {
    return {
      placeholder: "",
    };
  },
  created() {
    if (this.isSimple) {
      this.placeholder = "默认：" + this.$gxfmethod.defaultProjectName();
    } else {
      this.placeholder = "请输入项目名称";
    }
  },
  methods: {
    gotoRisk(){
      uni.navigateTo({
            url: `/contractPages/contract/components/enterprise-risk-inquiry?customerId=${this.dataDic.customerId}&name=${this.dataDic.customerName}&contactName=${this.dataDic.contactName}&phoneNum=${this.dataDic.phoneNum}`
          });
    },
    showPick(type) {
      if (type == "ssn") {
        let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
        console.log(resData,'resData');
        if (resData) {
          if (
            this.$gxfmethod.issameAllRoleType(
              resData,
              this.$savekey.USER_ROLE_BUSINESS
            )
          ) {
            uni.showToast({
              icon: "none",
              title: "当前业务负责人不可修改",
            });
            return;
          }
        }
      }
      this.$emit("clickItem", type);
    },
    textChage(e, type) {
      let param = {
        type: type,
        data: e,
      };
      this.$emit("textChange", param);
    },
  },
};
</script>

<style lang="scss" scoped>
.client-icon-1{
  color: #e60000;
  margin-left: 5rpx;
}
.base-infomation-bg {
  display: flex;
  flex-direction: column;
  padding:0 10px;
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
  margin-top: 1px;
  padding-top: 0;
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
