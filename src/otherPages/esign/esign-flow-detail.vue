<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap"
      >电签详情</c-nav-bar-btns
    >
    <view class="head-container">
      <view class="item-row">
        <text class="head-tag">业务模型</text>
        <text class="head-value">{{ modelType }}</text>
      </view>
      <view class="head-right">
        <view class="head-right-text">{{ flowDesc }}</view>
      </view>
    </view>
    <view
      class="middle-container"
      :style="{ padding: flowList && flowList.length > 0 ? '10px 0px' : '0px' }"
    >
      <view
        v-for="(item, index) in flowList"
        :key="index"
        class="item-container"
      >
        <view class="item-left">
          <view class="line-top" v-if="index != 0"></view>
          <view
            class="circle-num"
            :style="{ 'margin-top': index == 0 ? '10px' : '0px' }"
            >{{ index + 1 }}</view
          >
          <view
            class="line"
            v-if="flowList && flowList.length != index + 1"
          ></view>
        </view>
        <view class="item-right">
          <view class="item-row">
            <view style="margin-top: 8px" v-if="item.signerType"
              >{{ getSignerTypeName(item.signerType) }}
            </view>
          </view>
          <view class="item-row flex">
            <view style="margin-top: 8px" v-if="item.signerTypeName"
              >{{ item.signerTypeName
              }}{{ item.signerTypeName == "承租方" ? "(乙方)" : "(甲方)" }}
            </view>
            <view class="right-item">
              <text>签署人：{{ item.signerName }} </text>
              <text :class="item.verified ? 'isVerified' : 'unVerified'"
                >{{ item.verified ? "（已认证）" : "（未认证）" }}
              </text>
            </view>

            <view
              :style="{ color: getSignStatus(item.signStatus).signStatusColor }"
              >{{ getSignStatus(item.signStatus).signStatusName }}
            </view>
          </view>
          <view class="item-row">
            <view style="margin-top: 8px">手机号：{{ item.mobileNum }} </view>
          </view>

          <view
            style="margin-top: 8px"
            v-if="
              item.signerAuthorizedAccountType == '0' &&
              item.personTypes &&
              item.personTypes != ''
            "
            >人员类型：{{ item.personTypes }}</view
          >
          <view
            style="margin-top: 8px"
            v-if="item.signerAuthorizedAccountType == '1'"
            >签署主体：{{ item.signerAuthorizedAccountName }}
            <span :class="item.signerOrgVerified ? 'isVerified' : 'unVerified'"
              >({{ item.signerOrgVerified ? "已认证" : "未认证" }})</span
            >
          </view>
          <view class="item-row">
            <view
              class="linkBtn"
              @click="share(item)"
              v-if="flowStatus == 1 && item.signStatus == 1"
              >签署链接
            </view>
          </view>
          <view class="item-row">
            <view
              class="linkBtn"
              @click="getPersonLink(item)"
              v-if="flowStatus == 0 && item.verifyStatus < '2'"
            >
              个人认证
            </view>
            <span
              class="slicer"
              v-if="
                flowStatus == 0 &&
                item.verifyStatus < '2' &&
                !item.signerOrgVerified &&
                item.signerAuthorizedAccountType == '1'
              "
              >|</span
            >
            <view
              class="linkBtn"
              @click="getOrgLink(item)"
              v-if="
                flowStatus == 0 &&
                !item.signerOrgVerified &&
                item.signerAuthorizedAccountType == '1'
              "
            >
              企业认证
            </view>
          </view>

          <view style="margin-top: 4px" v-if="item.signStatus == '4'"
            >原因描述：{{ item.description }}
          </view>
          <view class="time-view">{{ item.signTime || "" }}</view>
        </view>
      </view>
      <view v-if="businessType == 'contract'">
        <imgupload
          :isupload="false"
          :imgFinishlist="fileList ? fileList : []"
        />
      </view>
    </view>
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
export default {
  components: {
    labelArrow,
    imgupload,
    uniPopup,
    selectView,
    wPicker,
  },
  data() {
    return {
      navBtns: [
        {
          text: "查看文档",
          type: "none",
          fontSize: "14px",
          color: "#E60000",
          width: "auto",
        },
      ],
      isStart: true,
      modelType: "合同",
      businessType: "contract",
      fileList: [],
      downloadTask: null,
      flowList: [],
      docId: "",
      documentUrl: "",
      flowId: "",
      flowDesc: "",
      flowStatus: null,
    };
  },
  onLoad(option) {
    this.$gxfmethod.statisticData(
      this.$eventId.Esign_Administrative,
      "签署记录",
      "签署详情"
    );
    this.setTag("0");
    this.businessType = option.businessType ? option.businessType : "";
    this.flowId = option.flowId ? option.flowId : "";
    this.docId = option.docId ? option.docId : "";
    if (this.businessType == "contract") {
      this.modelType = "合同";
    } else if (this.businessType == "settlement") {
      this.modelType = "结算";
    } else if (this.businessType == "contractPlus") {
      this.modelType = "附加合同";
    } else if (this.businessType == "workIn") {
      this.modelType = "进场";
    } else if (this.businessType == "workOut") {
      this.modelType = "退场";
    } else if (this.businessType == "statement") {
      this.modelType = "对账";
    }

    this.getFlowList();
    this.getFlowDetail();
    this.getAttachmentList();
  },
  methods: {
    onNavBarButtonTap() {
      this.getPdfView();
    },
    //设置右上角电钮
    setTag(width) {
      // #ifdef APP-PLUS
      let webView = this.$mp.page.$getAppWebview();
      webView.setTitleNViewButtonStyle(0, {
        width: width,
      });
      // #endif
      // #ifndef APP-PLUS
      this.navBtns =
        width == "auto"
          ? [
              {
                text: "查看文档",
                type: "none",
                fontSize: "14px",
                color: "#E60000",
                width: "auto",
              },
            ]
          : [];
      // #endif
    },
    getSignerTypeName(signerType) {
      switch (signerType) {
        case "leaseholder":
          return "租赁方（甲方）";
        case "tenantry":
          return "承租方（乙方）";
        case "thirdParty":
          return "其他";
        default:
          return "-";
      }
    },
    getFlowStatus(flowStatus) {
      switch (flowStatus) {
        case 0:
          return "认证中";
        case 1:
          return "签署中";
        case 2:
          return "完成";
        case 3:
          return "撤销";
        case 5:
          return "过期";
        case 7:
          return "拒签";
        default:
          return "-";
      }
    },
    getVerifyStatus(verifyStatus) {
      switch (verifyStatus) {
        case 0:
          return "未认证";
        case 1:
          return "认证中";
        case 2:
          return "已认证";
        case 3:
          return "认证失败";
        case 7:
          return "授权签署中";
        case 8:
          return "授权签署完成";
        default:
          return "-";
      }
    },
    getSignStatus(state) {
      switch (state) {
        case 1:
          return {
            signStatusName: "未签",
            signStatusColor: "#E60000",
          };
        case 2:
          return {
            signStatusName: "已签",
            signStatusColor: "#52C41A",
          };
        case 3:
          return {
            signStatusName: "失败",
            signStatusColor: "#EA5A29",
          };
        case 4:
          return {
            signStatusName: "拒签",
            signStatusColor: "#EA5A29",
          };
        default:
          return {
            signStatusName: "待签",
            signStatusColor: "#545556",
          };
      }
    },

    getAttachmentList() {
      if (!this.flowId) return;
      let param = {
        flowId: this.flowId,
      };
      this.$network
        .getData(this.$url.ESIGN_FLOW_ATTACHMENT, "GET", param)
        .then((result) => {
          this.fileList = result
            ? result.map((o) => {
                return {
                  ...o,
                  url: o.attachmentUrl ? o.attachmentUrl : "",
                };
              })
            : [];
        })
        .catch((err) => {});
    },
    getFlowList() {
      if (!this.flowId) return;
      let param = {
        flowId: this.flowId,
      };
      this.$network
        .getData(this.$url.ESIGN_FLOW_LOG, "POST", param)
        .then((result) => {
          this.flowList = result ? result : [];
          console.log(this.flowList);
        })
        .catch((err) => {});
    },
    getFlowDetail() {
      console.log("-----");
      if (!this.flowId) return;
      this.$network
        .getData(
          this.$url.ESIGN_FLOW_DETAIL.replace(/{flowId}/, this.flowId),
          "GET"
        )
        .then((result) => {
          this.flowStatus = result.flowStatus;
          this.flowDesc =
            result && result.flowDesc != null ? result.flowDesc : "-";
          if (result.flowStatus != 2) {
            this.getFileOning();
          } else {
            this.getDocFile();
          }
        })
        .catch((err) => {});
    },
    getPersonLink(item) {
      console.log(item.flowId, " item.flowId");
      this.$network
        .getData(
          this.$url.ESGIN_FIND_USER_LINK.replace(
            /{userId}/,
            item.userId
          ).replace(/{contractFlowId}/, item.flowId),
          "GET"
        )
        .then((result) => {
          if (result && result.url) {
            uni.showModal({
              title: "认证链接",
              content: result.url,
              confirmText: "复制",
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  this.getClipboardData(result.url);
                }
              },
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "暂无认证链接",
            });
          }
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details[0]
              ? err.details[0]
              : err.message
              ? err.message
              : "",
          });
        });
    },
    getOrgLink(item) {
      this.$network
        .getData(
          this.$url.ESGIN_FIND_ORG_LINK.replace(/{orgId}/, item.orgId).replace(
            /{contractFlowId}/,
            item.flowId
          ),
          "GET"
        )
        .then((result) => {
          if (result && result.url) {
            uni.showModal({
              title: "认证链接",
              content: result.url,
              confirmText: "复制",
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  this.getClipboardData(result.url);
                }
              },
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "暂无认证链接",
            });
          }
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details[0]
              ? err.details[0]
              : err.message
              ? err.message
              : "",
          });
        });
    },
    //复制数据
    getClipboardData(url) {
      uni.setClipboardData({
        data: url,
        success: () => {
          uni.showToast({
            icon: "none",
            title: "已复制",
          });
        },
      });
    },
    getFileOning() {
      if (!this.docId) {
        return;
      }
      let url = this.$url.ESIGN_FLOW_DOC_ONING.replace(/{docId}/, this.docId);
      this.$network
        .getData(url, "GET")
        .then((result) => {
          this.documentUrl =
            result && result.downloadUrl
              ? result.downloadUrl.indexOf(".pdf") != -1
                ? result.downloadUrl
                : ""
              : "";
          if (this.documentUrl) {
            this.setTag("auto");
          }
        })
        .catch((err) => {});
    },
    getDocFile() {
      if (!this.flowId) return;
      let param = {
        flowId: this.flowId,
      };
      this.$network
        .getData(this.$url.ESIGN_FLOW_DOC, "GET", param)
        .then((result) => {
          this.documentUrl =
            result && result.docs && result.docs.length > 0
              ? result.docs[0].fileUrl.indexOf(".pdf") != -1
                ? result.docs[0].fileUrl
                : ""
              : "";
          if (this.documentUrl) {
            this.setTag("auto");
          }
        })
        .catch((err) => {});
    },
    //查看文档
    getPdfView() {
      uni.showLoading({
        title: "打开中...",
        mask: true,
      });
      // this.documentUrl = decodeURIComponent(this.documentUrl)
      console.log(this.documentUrl);
      let url = this.documentUrl;
      let filename = this.businessType + ".pdf";
      // #ifdef APP-PLUS
      filename = "_doc/" + this.businessType + ".pdf";
      // #endif
      this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);

    },

    // 分享签署
    share(item) {
      console.log(this.flowId);
      console.log(item);
      let param = {
        flowId: this.flowId,
        accountId: item.userId,
        organizeId: 0,
        urlType: 0,
      };
      this.$network
        .getData(this.$url.ESGIN_ESIGN_GETSIGNURL, "GET", param)
        .then((res) => {
          console.log(res);
          uni.setClipboardData({
            data: res,
          });
          uni.showToast({
            icon: "none",
            title: "已复制签署链接可以转发好友",
          });
        })
        .catch((err) => {});
    },
  },
  onUnload() {
    if (this.downloadTask) {
      this.downloadTask.abort();
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  background-color: $uni-bg-color-grey;
  position: relative;
}
.flex {
  display: flex;
  justify-content: space-between !important;
}
.head-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 0 20px;
  border-bottom: 1px solid $uni-bg-color-grey;
  z-index: 200;
}

.item-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: start;
}

.time-view {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
}

.head-tag {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
}

.head-value {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  margin-left: 8px;
}

.head-right {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  text-align: end;

  justify-content: flex-end;
}

.head-right-text {
  padding-right: 20px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.middle-container {
  background-color: #ffffff;
  margin-top: 15px;
}

.item-container {
  display: flex;
  flex-direction: row;
}

.item-left {
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-num {
  background-color: #aaaaaa;
  color: #ffffff;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  text-align: center;
  font-size: $uni-font-size-sm;
}

.line-top {
  width: 1px;
  background-color: #aaaaaa;
  height: 10px;
}

.line {
  width: 1px;
  background-color: #aaaaaa;
  flex: 1;
}

.item-right {
  margin: 10px 8px 0px 8px;
  flex: 1;
  // border: 1px solid $uni-app-color-background;
  border-radius: 4px;
  padding: 8px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.bottom-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  z-index: 200;
}

.btn {
  flex: 1;
  background-color: $uni-color-primary;
  color: #ffffff;
  text-align: center;
  margin: 2px 8px;
  border-radius: 4px;
  padding: 8px 0px;
}

/* 提示窗口 */

.pop-container {
  position: relative;
}

.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 320px;
  background-color: #fff;
  border-radius: 10px;
}

.tip-title {
  padding: 10px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
}

.row-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  line-height: 40px;
  margin-top: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.row-tag {
  width: 75px;
  min-width: 75px;
  text-align: left;
}

.radio {
  transform: scale(0.7);
  margin-right: 15px;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.uni-tip-button {
  flex: 1;
  text-align: center;
  padding: 8px;

  font-size: $uni-font-size-base;
}

.pop-cancel {
  margin-right: 8px;
  color: $uni-text-color-gray;
  background: $uni-bg-color-grey;
  border-radius: 4px;
}

.pop-confirm {
  color: #ffffff;
  margin-left: 8px;
  background: $uni-color-primary;
  border-radius: 4px;
}

.isVerified {
  color: $uni-color-success;
}
.unVerified {
  color: $uni-color-warning;
}

.linkBtn {
  color: $uni-color-primary;
}
.slicer {
  margin: 0 5px;
  color: #e60000;
}
</style>
