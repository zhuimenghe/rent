<script>
import { queryStringfy } from "@/common/common-method/common-method";
export default {
  props: {
    esignParams: Object, //flowStatus signFlowId businessType
  },
  watch: {
    esignParams: {
      handler(val) {
        if (val.contractNo) {
          this.getMergeList(val.contractNo);
        }
      },
    },
  },
  data() {
    return {
      isAddESign: false,
      mergeEsignList: [],
    };
  },
  created() {
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.isAddESign = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_WORKOUT_ESIGN_ADD
      );
    }
  },
  computed: {
    isStartEsign() {
      return this.$datestr.isStartESignAdd(
        this.isAddESign,
        this.esignParams.flowStatus,
        this.esignParams.businessState
      );
    },
  },
  methods: {
    preview() {
      if (this.esignParams.flowStatus == 2) {
        let url = this.$url.esignRecordFile;
        let param = {
          flowId: this.esignParams.signFlowId,
        };
        this.$network
          .getData(url, "GET", param)
          .then((res) => {
            let url = res;
            let filename = this.$gxfmethod.getFileNameDoc(this.esignParams.signFlowTitle+'-','.pdf')
            this.$gxfmethod.downEsignFunc(
              url,
              "GET",
              undefined,
              filename
            );
          })
          .catch((err) => {});
      } else {
        if (this.esignParams.businessType == "settlement") {
          let url = `/settleapi/api/settlement/preViewSettlement?businessId=${this.esignParams.businessId}`;
          this.downxlsc(url);
        } else {
          let url =
            this.$url.DOWNLOAD_WORD_ESIGN.replace(
              "{businessType}",
              this.esignParams.businessType
            ) +
            "?businessNo=" +
            this.esignParams.businessNo;
          let headerDic = {
            "Content-Type": "application/json",
            Authorization: "",
          };
          this.downxlsc(url, headerDic);
        }
      }
    },
    downxlsc(url, headerDic) {
      let name = this.esignParams.businessTitle + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      }
    },
    async getMergeList(v) {
      let res =
        (await this.$network.getData(this.$url.CONTRACT_EXECUTE_INFO_ESIGN, "GET", {
          contractNo: v,
        })) || [];
      this.mergeEsignList = res
        ? res.map((item) => {
            return {
              ...item,
              checked: false,
            };
          })
        : [];
    },
    goToESign() {
      let esignParams = this.esignParams;
      let tenantObj = uni.getStorageSync(this.$savekey.TENANT_DETAIL);
      if (!tenantObj || !tenantObj.esignId) {
        uni.showToast({
          icon: "none",
          title: "当前租户还未开通电签平台，请开通后再配置",
        });
        return;
      }

      let flag = false;
      if (this.esignParams.customerType == 2) {
        if (!!this.esignParams.customerPhoneNum) {
          flag = false;
        } else {
          flag = true;
        }
      }
      if (flag && !this.esignParams.phoneNum) {
        uni.showToast({
          icon: "none",
          title: "甲方或乙方手机号没有填写",
        });
        return;
      }

      this.$gxfmethod.statisticData(
        this.$eventId.Esign_Administrative,
        "启动电签",
        "进场单启动电签"
      );
      // 合同 进场 退场 结算 可合并电签
      if (
        (esignParams.businessType == "workIn" ||
          esignParams.businessType == "workOut" ||
          esignParams.businessType == "settlement") &&
        this.mergeEsignList.length > 1
      ) {
        // 如果mergeEsignList的长度大于1才跳转到合并电签页面
        uni.navigateTo({
          url:
            `/contractPages/contract/merge-signatures?esignParams=` +
            encodeURIComponent(JSON.stringify(esignParams)) +
            "&mergeEsignList=" +
            encodeURIComponent(JSON.stringify(this.mergeEsignList)),
        });
      } else {
        uni.navigateTo({
          url:
            "/otherPages/esign/esign-start-process?isStart=true&" +
            queryStringfy(this.esignParams, false),
        });
      }
    },
    openESign() {
      let url = this.$url.esignRecordInfo;
      let param = {
        urlType: 1,
      };
      url = url.replace("{id}", this.esignParams.signFlowId);
      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          uni.navigateTo({
            url: `/otherPages/esign/webView?url=${encodeURIComponent(res)}&title=${
              this.esignParams.signFlowTitle
            }`,
          });
        })
        .catch((err) => {});
    },
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<template>
  <view class="actions-footer-flex">
    <view style="width: 100%">
      <slot name="top"></slot>
    </view>
    <view class="z-btn bg-light-gray radius" @click="goBack">返回</view>
    <view class="z-btn bg-warn radius" @click="preview">下载</view>
    <view
      class="z-btn bg-primary radius"
      v-if="isStartEsign && esignParams.businessState != 1"
      @click="goToESign()"
    >
      启动电签
    </view>
    <view
      class="z-btn bg-primary radius"
      v-if="!isStartEsign && esignParams.businessState != 1"
      @click="openESign('detail')"
    >
      电签详情
    </view>
  </view>
</template>

<style lang="scss">
esign-footer {
  z-index: 100;
}
</style>
