<template>
  <view class="content">
    <view>
      <!-- <modelApply 
			:invoiceDic="invoiceDic" ref='applyModel' 
			:isEdit="isEditModel('apply')" 
			v-if="isShowModel('apply')"
			@goTo='goTo' 
			@showPick='showPick' 
			@setInvoiceInput='setInvoiceInput' 
			:contractDicName='contractDicName' 
			/> -->
      <!-- 基本信息 -->
      <view class="base-info">
        <view class="common-title"> 基本信息 </view>
        <view class="base-content">
          <view class="base-content-item">
            <text class="label">成本单号</text>
            <text class="value">{{ invoiceDic.businessNo || "--" }}</text>
          </view>
          <view class="base-content-item" @click="gotoContactDetail">
            <text class="label">合同名称</text>
            <text class="value icon" :style="{ 'margin-right': '15px' }">{{
              invoiceDic.contractName || "--"
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">区域</text>
            <text class="value">{{ invoiceDic.orgName || "--" }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">业务负责人</text>
            <text class="value">{{
              invoiceDic.customerSalesmanName || "--"
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">客户名称</text>
            <text class="value">{{ invoiceDic.customerName || "--" }}</text>
          </view>
          <!-- <view class="base-content-item">
            <text class="label">预计总租金</text>
            <text class="value">¥{{saveTwo(invoiceDic.totalRentalPay)||''}}</text>
          </view> -->
          <view class="base-content-item">
            <text class="label">支出日期</text>
            <text class="value">{{
              invoiceDic.payDate&&invoiceDic.payDate.split(" ")[0] || "--"
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">支出方式</text>
            <text class="value">{{ invoiceDic.payTypeName || "--" }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">支出人</text>
            <text class="value">{{ invoiceDic.payUserName || "--" }}</text>
          </view>
        </view>
      </view>

      <!-- 支出金额 -->
      <view class="base-info">
        <view class="common-title"> 支出金额 </view>
        <view class="base-content">
          <view class="base-content-item">
            <text class="label">运费</text>
            <text class="value">{{
              saveTwo(invoiceDic.freightCost) || 0
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">装卸费</text>
            <text class="value">{{
              saveTwo(invoiceDic.handlingCost) || 0
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">沟通费</text>
            <text class="value">{{
              saveTwo(invoiceDic.contactCost) || 0
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">调度费</text>
            <text class="value">{{
              saveTwo(invoiceDic.dispatchCost) || 0
            }}</text>
          </view>
          <view class="base-content-item">
            <text class="label">其他费用</text>
            <text class="value">{{ saveTwo(invoiceDic.otherCost) || 0 }}</text>
          </view>
          <view class="base-content-item">
            <text class="label fw600">支出总额</text>
            <text class="value"
              >¥{{ saveTwo(invoiceDic.totalRentalPay) || "0" }}</text
            >
          </view>
          <view class="reason">
            <view class="label fw500">支出理由</view>
            <view class="value">{{ invoiceDic.payReason || "--" }}</view>
          </view>
        </view>
      </view>

      <!-- 其他信息 -->
      <view class="base-info">
        <view class="common-title"> 其他信息 </view>
        <view class="base-content">
          <view class="base-content-item">
            <text class="label fw500">附件</text>
          </view>
          <!-- <view class="image-wrapper">
            <image v-for="item in invoiceDic.fileList" :key="item.id" :src="item.url"></image>
          </view> -->
          <imgupload :isupload="false" :isShowBg="false" :isShowLabel="false" :imgFinishlist="invoiceDic.fileList" />
          <view class="reason">
            <view class="label fw500">备注</view>
            <view class="value">{{ invoiceDic.remark || "" }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 类型选择 -->
    <w-picker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
    <!-- 时间选择 -->
    <w-picker
      :mode="datetype"
      startYear="2000"
      endYear="3000"
      :current="true"
      @confirm="onConfirm"
      :disabledAfter="false"
      ref="date"
      themeColor="#E60000"
    />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import modelApply from "../invoice/model/model-apply.vue";
import modelInvoice from "../invoice/model/model-invoice.vue";
import modelAttachment from "../invoice/model/model-attachment";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";

export default {
  name: "base-cost",
  components: {
    modelApply,
    modelInvoice,
    modelAttachment,
    wPicker,
    imgupload,
  },
  props: {
    //是否是第一步
    isFrist: {
      type: Boolean,
      default: false,
    },
    formKey: {
      type: String,
      default: "",
    },
    applyData: {
      type: Object,
      default() {
        return {};
      },
    },
    nodeList: {
      type: Array,
      default() {
        return [];
      },
    },
    itemData: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  watch: {
    invoiceDic(val) {
      this.$emit("invoiceDic", val);
    },
    applyData(val) {
      this.invoiceDic = {
        ...val,
      };
    },
    nodeList(val) {
      if (!this.isEditModel("apply")) {
        this.contractDicName =
          this.invoiceDic.customerName + "-" + this.invoiceDic.projectName;
      }
      if (this.isEditModel("invoice") || this.isEditModel("apply")) {
        this.loadInvoiceType();
      }
    },
  },
  created() {
    console.log(this.applyData, "this.applyData");
    this.invoiceDic = {
      ...this.applyData,
    };
    uni.getStorage({
      key: "invoice",
      success: (res) => {
        this.processType = res.data
          ? res.data.customizedKey
            ? res.data.customizedKey
            : "workOutBase"
          : "workOutBase";
        this.$emit("processType", {
          processObj: res.data ? res.data : null,
          type: this.processType,
        });
      },
      fail: () => {
        //没有流程的情况下
        this.processType = "invoiceWhole";
        this.$emit("processType", {
          processObj: null,
          type: this.processType,
        });
      },
    });
    //监听公司联系人返回
    uni.$on("linkman-emit-conpany", (obj) => {
      this.setCustomerData(obj.dict, "2");
      this.invoiceDic = {
        ...this.invoiceDic,
        customerType: 2,
      };
    });
    //监听个人联系人返回
    uni.$on("linkman-emit-person", (obj) => {
      this.setCustomerData(obj.dict, "1");
      this.invoiceDic = {
        ...this.invoiceDic,
        customerType: 1,
      };
    });
    uni.$on("choose-contract-emit", (obj) => {
      console.log("choose-contract-emit" + JSON.stringify(obj.dict));
      let contractObj = obj.dict;
      this.setContractData(contractObj);
    });
  },
  data() {
    return {
      invoiceDic: {},
      processType: "", //流程配置的类型
      contractDicName: "",
      datetype: "date",
      pickType: "",
      selectList: [],
      invoiceTypes: [], //发票类型列表
      curItem: 0,
    };
  },
  methods: {
    saveTwo(num) {
      return this.$datestr.doubleFloat(num);
    },
    gotoContactDetail() {
      let id = "1585819114461130754";
      let contractNo=this.invoiceDic.contractNo;
      let url = "/contractPages/contract/contract-detail?contractNo=" + contractNo;
      uni.navigateTo({
        url: url,
      });
    },
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    setCustomerData(customerObj, type) {
      this.invoiceDic = {
        ...this.invoiceDic,
        customerId: customerObj.id,
        customerName: customerObj.name,
        orgId: customerObj.orgId,
        orgName: customerObj.orgName,
        address: customerObj.address,
        phoneNum: type == "1" ? customerObj.phoneNum : customerObj.fixedPhone,
        openingBank: customerObj.openingBank,
        taxNumber: customerObj.taxNumber,
        customerSalesman: customerObj.salesman,
        customerSalesmanName: customerObj.salesmanName,
        bankAccount: customerObj.bankAccount,
        contractNo: null,
        contractDetailId: null,
        projectName: null,
        invoiceName: customerObj.name || "",
      };
      this.contractDicName = "";
    },
    setContractData(contractObj) {
      console.log("contractObj" + JSON.stringify(contractObj));
      this.invoiceDic = {
        ...this.invoiceDic,
        contractDetailId: contractObj.contractDetailDto.id || "",
        contractNo: contractObj.businessNo || "",
        contactName: contractObj.contractDetailDto.contactName || "",
        orgName: contractObj.orgName,
        orgId: contractObj.orgId,
        customerSalesman: contractObj.contractDetailDto.customerSalesman,
        customerSalesmanName:
          contractObj.contractDetailDto.customerSalesmanName,
        projectName: contractObj.contractDetailDto.projectName,
      };
      this.contractDicName =
        contractObj.customerName +
        "-" +
        contractObj.contractDetailDto.projectName;
    },
    //备注
    setComment(val) {
      this.invoiceDic = {
        ...this.invoiceDic,
        comment: val,
      };
    },
    //
    setInvoiceInput(val) {
      if (this.invoiceDic[val.prop]) {
        this.invoiceDic[val.prop] = val.value;
        this.invoiceDic = {
          ...this.invoiceDic,
        };
      }
    },
    //加载发票类型
    loadInvoiceType() {
      uni.showLoading();
      this.$network
        .loadType("invoice_type")
        .then((result) => {
          this.invoiceTypes = result ? result : [];
          if (
            this.isEditModel("invoice") &&
            this.invoiceTypes &&
            this.invoiceTypes.length > 0
          ) {
            this.invoiceDic = {
              ...this.invoiceDic,
              type: this.invoiceTypes[0].value,
              typeName: this.invoiceTypes[0].label,
            };
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    updateFile(val) {
      this.invoiceDic = { ...this.invoiceDic, fileList: val };
    },
    goTo(val) {
      let type = val.type;
      switch (type) {
        case "customer":
          uni.navigateTo({
            url: "/otherPages/linkman/linkman?nextview=false&from=invoice",
          });
          break;
        case "contract":
          if (this.isEditModel("apply")) {
            uni.navigateTo({
              url:
                "/businessPages/invoice/contract-choose?customid=" +
                this.invoiceDic.customerId,
            });
          } else {
            if (this.invoiceDic.contractNo) {
              uni.navigateTo({
                url:
                  "/contractPages/contract/contract-detail?businessNo=" +
                  this.invoiceDic.contractNo,
              });
            }
            return;
          }
          break;
        default:
          break;
      }
    },
    showPick(val) {
      this.pickType = val.pickType;
      switch (val.selectType) {
        case "date":
        case "dateTime":
          this.datetype = val.selectType;
          this.$refs.date.show();
          break;
        case "selector":
          switch (this.pickType) {
            case "invoiceType":
              this.selectList = this.invoiceTypes ? this.invoiceTypes : [];
              break;
            case "invoiceTypeApply":
              this.selectList = this.invoiceTypes ? this.invoiceTypes : [];
              break;
          }
          this.$refs.selector.show();
          break;
      }
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "invoiceDate":
          this.invoiceDic = {
            ...this.invoiceDic,
            invoiceDate: val.result + " 00:00:00",
          };
          break;
        case "invoiceType":
          this.invoiceDic = {
            ...this.invoiceDic,
            type: val.checkArr.value,
            typeName: val.checkArr.label,
          };
          break;
        case "invoiceTypeApply":
          this.invoiceDic = {
            ...this.invoiceDic,
            invoiceType: val.checkArr.value,
            invoiceTypeName: val.checkArr.label,
          };
          break;
        default:
          break;
      }
    },
    isShowModel(model) {
      let isShow = false; //是否显示model
      if (this.nodeList.length > 0) {
        //判断当前是是否是第一步
        if (this.isFrist) {
          //第一步是否显示model
          if (
            this.nodeList[0].formKey &&
            this.nodeList[0].formKey.indexOf(model) !== -1
          ) {
            isShow = true;
          }
        } else {
          //
          //遍历所有到目前为止的流程中是否显示model
          for (let i = 0; i < this.nodeList.length; i++) {
            if (
              this.nodeList[i].formKey &&
              this.nodeList[i].formKey.indexOf(model) !== -1
            ) {
              isShow = true;
              return true;
            }
          }
        }
      } else {
        //没有流程时，都显示
        isShow = true;
      }
      return isShow;
    },
    /**是否可编辑
     * @param {Object} model
     */
    isEditModel(model) {
      let isEdit = false; //是否显示model
      if (this.formKey) {
        if (this.nodeList.length > 0) {
          //判断当前是是否是第一步
          let obj = null;
          if (this.isFrist) {
            obj = this.nodeList[0];
          } else {
            //
            // 判断当前流程在nodeList中是第几步
            obj = this.nodeList.find((o) => {
              return o.formKey === this.formKey;
            });
          }
          //第一步是否显示model
          if (obj && obj.formKey && obj.formKey.indexOf(model) !== -1) {
            isEdit = true;
          }
        } else {
          //没有流程时，都显示
          isEdit = true;
        }
      }
      return isEdit;
    },
    setWorkDic(val) {
      this.invoiceDic = {
        ...this.invoiceDic,
        ...val,
      };
      if (this.invoiceDic.customerName || this.invoiceDic.projectName) {
        this.contractDicName =
          this.invoiceDic.customerName + "-" + this.invoiceDic.projectName;
      } else {
        this.contractDicName = "";
      }

      if (this.isEditModel("apply") && !this.invoiceDic.invoiceDate) {
        this.invoiceDic = {
          ...this.invoiceDic,
          invoiceDate: this.$datestr.getnowDate(),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  background: $uni-bg-color-grey;
  .base-info {
    .common-title {
      position: relative;
      margin-top: 23rpx;
      font-size: $uni-font-size-base;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #222222;
      margin-left: 16rpx;
      &::before {
        content: "";
        display: block;
        position: absolute;
        top: 2rpx;
        left: -17rpx;
        width: 4rpx;
        height: 28rpx;
        background: $uni-color-primary;
      }
    }
    .base-content {
      margin: 25rpx 16rpx;
      padding: 0px 13px 0px;
      background: #fff;
      
      .base-content-item {
        &:last-child::after{
          border-bottom: none !important;
        }
      
        @include flex(row, center, space-between);
        height: 88rpx;
        line-height: 88rpx;
        @include hairline-bottom();
        .iconxiangyou1 {
          font-size: 16rpx;
          color: #333333;
          margin-left: 16rpx;
          opacity: 0.4;
        }
        .label {
          font-size: $uni-font-size-base;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8c8c8c;
        }
        .value {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #222222;
        }
        .fw600 {
          font-weight: 600 !important;
          color: #222222;
        }
        .fw500 {
          font-weight: 500 !important;
          color: #222222;
        }
        &:last-child {
          border-bottom: none;
        }
      }

      .reason {
        font-size: $uni-font-size-base;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
        padding-bottom:15px;
        .label {
          height: 88rpx;
          line-height: 88rpx;
          font-weight: 500;
        }
        .value {
          font-size: $uni-font-size-sm;
          background: #f6f6f6;
          border-radius: 6rpx;
          padding: 8px 8px 5px 8px;
          line-height: 24px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      .image-wrapper {
        display: flex;
        align-items: center;
        height: 104rpx;
        padding: 20rpx 0 24rpx 0;
        image {
          width: 104rpx;
          height: 104rpx;
          margin-right: 16rpx;
        }
      }
    }
  }

  .icon {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 15px;
      right: -18px;
      width: 24rpx;
      height: 24rpx;
      border-width: 3rpx 3rpx 0 0;
      border-color: #222;
      transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0);
      border-style: solid;
    }
  }
}

::v-deep .list-view{
  margin-left: 0 !important;
}
.img-upload-view{
  min-height: 0; 
  padding: 0;
  margin-top: 5px;

}
::v-deep .border{
  margin-top: 5px !important;
}
</style>
