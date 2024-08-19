<template>
  <div class="model-container">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar flexAlign="center">短信催款</c-nav-bar>
    <div class="model-content">
      <div class="model-content-item">
        <p class="title"><span class="line"></span>短信内容</p>
        <div class="model-content-item-content">
          <text class="text-lg text-bold">基础模板</text>
          <div class="margin-top-sm">
            {{ content1 }}
            <text @click="openLink" class="link">{{ link || "" }}</text>
          </div>
          <div class="text-lg text-bold margin-top">严重违约模板</div>
          <div class="margin-top-sm">
            {{ content2 }}
            <text @click="openLink" class="link">{{ link || "" }}</text>
          </div>
        </div>
      </div>
      <div class="model-content-item">
        <p class="title"><span class="line"></span>客户信息</p>
        <div class="model-content-item-content">
          <view class="customer-info">
            <c-form-item label="选择模板">
              <c-form-picker :list="types" v-model="type"></c-form-picker>
            </c-form-item>
            <!-- <view class="customer-info-left-item">
              <view class="customer-info-left-item-title">客户名称</view>
              <view class="customer-info-left-item-content">{{ customer.name || '-' }}</view>
            </view> -->
            <select-label-item
              tagName="联系人"
              :isRequired="false"
              hint="请选择联系人"
              :value="contact.label"
              icon="iconarrow-right"
              @clickItemLabel="chooseowner"
            />
            <view class="customer-info-left-item">
              <view class="customer-info-left-item-title">推送手机号</view>
              <view class="customer-info-left-item-content">{{
                contact.phoneNum || "-"
              }}</view>
            </view>
          </view>
        </div>
      </div>

      <div class="tip">
        注意：短信发送后，为该联系人自动开启租户端权限， 该联系人可查看合同结算单。
      </div>
    </div>
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    >
      <view class="w-picker-btn" style="color: #e60000" @click="addContonct">新增</view>
    </w-picker>
    <view class="flow">
      <view :class="['button', isIPhoneX() ? 'pb80' : '']">
        <view class="btn" style="background-color: #d8d8d8" @click="btnClick('cancel')">
          取消</view
        >
        <view class="btn" style="background-color: #e60000" @click="btnClick('save')">
          确定</view
        >
      </view>
    </view>
  </div>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";

export default {
  components: {
    selectLabelItem,
    wPicker,
  },
  data() {
    return {
      type: "1",
      types: [
        {
          label: "基础模版",
          value: "1",
        },
        {
          label: "严重违约模板",
          value: "2",
        },
      ],
      sms: {},
      customerId: "",
      customer: {},
      contact: {
        label: "请选择联系人",
        value: "",
      },
      contractId: "",
      contractName: "",
      selectList: [],
      ownerList: [],
      link: "",
      allowTypes: ["1", "2", "3", "5"],
    };
  },
  watch: {
    contact: {
      handler(val) {
        if (val.phoneNum) {
          this.getSmsUrl(val.phoneNum);
        }
      },
      immediate: true,
    },
  },
  computed: {
    content() {
      if (this.contractName) {
        return `尊敬的${this.sms.customerName}客户您好，【${this.sms.orgName}】提醒您，您的合同【${this.contractName}】,累计结算欠款金额【￥${this.sms.money}】元`;
      } else {
        return `尊敬的${this.sms.customerName}客户您好，【${this.sms.orgName}】提醒您，您累计结算欠款金额【￥${this.sms.money}】元`;
      }
    },
    content1() {
      return `${this.content}，请尽快还款。点击查看链接`;
    },
    content2() {
      return `${this.content}，不及时还款，系统将进行远程锁机。点击查看链接`;
    },
  },
  onLoad(options) {
    console.log(options, "+++++options");
    this.customerId = options.customerId || "";
    this.contractId = options.contractId || "";
    this.contractName = options.contractName || "";
    this.customer = options.customer
      ? JSON.parse(decodeURIComponent(options.customer))
      : null;

    this.getSmsMessage();
    this.getCustomerContoncts();
  },
  onShow() {
    this.getCustomerContoncts();
  },
  methods: {
    openLink() {
      uni.setClipboardData({
        data: this.link,
        success: function () {
          uni.showToast({ title: "复制成功", icon: "none" });
        },
      });
    },

    // 获取链接地址
    getSmsUrl(phoneNum) {
      let url = this.$url.WECHAT_RENTALMNURL + "?phoneNum=" + phoneNum;
      this.$network
        .getData(url, "GET", null)
        .then((url) => {
          console.log(url, "url");
          this.link = url;
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    // 新增联系人
    addContonct() {
      let item = {
        customerId: this.customerId,
        type: this.customer.customerType || this.customer.type,
      };
      let url =
        "./connect-create?item=" +
        encodeURIComponent(JSON.stringify(item)) +
        "&edit=true";
      uni.navigateTo({
        url: url,
      });
    },
    //弹窗回调
    dialog(val) {
      this.contact = val.checkArr;
    },
    chooseowner() {
      this.$refs.selector && this.$refs.selector.show();
    },
    /**
     * 获取当前客户下的联系人
     */
    async getCustomerContoncts(val) {
      // this.selectList = [];
      let url = this.$url.LINKMAN_PERSON_CONNECT + this.customerId;
      let resultList = await this.$network.getData(url, "GET", null);
      if (resultList && resultList.length) {
        for (let i = 0; i < resultList.length; i++) {
          let dutyList = resultList[i].dutyList || [];
          let duty = [];
          if (dutyList.length > 0) {
            this.$network
              .loadUserType("contact_duty")
              .then((allContactDuties) => {
                allContactDuties.map((item, index) => {
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
                this.selectList = resultList.filter((item) => {
                  return item.dutyList.some((d) => this.allowTypes.includes(d));
                });
                //默认展示第一个数据
                this.contact = this.selectList[0];
              })
              .catch((err) => {
                console.log(err, "err");
              });
          }
        }
      }
      uni.hideLoading();
    },
    btnClick(type) {
      if (type == "cancel") {
        uni.navigateBack({
          detail: 1,
        });
      } else if (type == "save") {
        this.saveSmsMessage();
      }
    },
    isIPhoneX() {
      let screenHeight = wx.getSystemInfoSync().screenHeight;
      let bottom = wx.getSystemInfoSync().safeArea.bottom;
      return screenHeight !== bottom;
    },
    /**
     * 获取短信催款的内容
     */
    getSmsMessage() {
      uni.showLoading();
      let urlstr = !this.contractName
        ? this.$url.CUSTOMER_URGENT_SMS + `?customerId=${this.customerId}`
        : this.$url.CONTRACT_URGENT_SMS + `?contractId=${this.contractId}`;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          uni.hideLoading();
          console.log(result, "getSmsMessage");
          this.sms = { ...result, money: result.money };
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            title: err.message,
            icon: "none",
          });
        });
    },
    /**
     * 短信催款
     */
    saveSmsMessage() {
      if (!this.link || !this.contact.id) return;
      let sContent = this["content" + this.type];
      let params = {
        phoneNum: this.contact.phoneNum,
        customerId: this.customerId,
        contact: this.contact.name,
        name: this.sms.customerName,
        salesman: this.customer.salesman || this.customer.customerSalesman,
        salesmanName: this.customer.salesmanName || this.customer.customerSalesmanName,
        arrear: this.sms.money,
        contractId: this.contractId,
        contactId: this.contact.id,
        contractName: this.contractName,
        smsContent: sContent + this.link,
      };
      let url = this.$url.CUSTOMER_RECALL_SMS_V2;
      this.$network
        .getData(url, "POST", params)
        .then((result) => {
          uni.showToast({ title: "短信发送成功" });
          uni.navigateBack({
            detail: 1,
          });
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .gray-arrow {
  margin-right: 0 !important;
}

::v-deep .select-container {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep .tag-title .select-tag {
  color: #8c8c8c !important;
}

.pb80 {
  padding-bottom: 80rpx !important;
}

.flow {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding-top: 10px;
  // margin-top: 10px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

  .button {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    justify-content: space-around;
    padding: 6px 10px 15px;

    .btn {
      color: #ffffff;
      text-align: center;
      border-radius: 4px;
      padding: 8px 5px;
    }
  }
}

.tip {
  margin-top: 40rpx;
  padding-left: 20rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fe931f;
  line-height: 40rpx;
}

.customer-info-left-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;
  border-bottom: 1px solid $uni-bg-color-grey;
}

.customer-info-left-item-content {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
  max-width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.customer-info-left-item-title {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

.model-container {
  width: 100%;
  height: 100%;
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

.model-content-item-content {
  background-color: #fff;
  padding: 20rpx 29rpx 30rpx;
  line-height: 50rpx;
  .link {
    color: #3266f8;
  }
}
</style>
