<template>
  <view class="more-btns" v-if="isShowBtns">
    <template v-for="item in btns">
      <view
        class="item"
        v-if="item.isShow"
        :class="[item.name == '更多' ? 'more' : '']"
        @click="handleBtnClick(item)"
      >
        <i class="iconfont left-btn" :class="item.icon"></i>
        <text class="btn-text">{{ item.name }}</text>
      </view>
    </template>

    <uni-popup ref="downDialog" type="dialog">
      <view class="pop">
        <template v-for="item1 in operateList">
          <view class="pop-item" v-if="item1.isShow">
            <view class="pop-item-title">{{ item1.name }}</view>
            <view class="item-wrapper">
              <template v-for="(item, index) in item1.list">
                <view class="pop-item-1" v-if="item.show" @click="handleIconClick(item)">
                  <view class="icon-wrapper">
                    <i class="iconfont" :class="item.icon"></i>
                  </view>
                  <text class="txt">{{ item.name }}</text>
                </view>
              </template>
            </view>
          </view>
        </template>
        <view class="close-btn" @click="close">关闭</view>
      </view>
    </uni-popup>
    <c-contract-eco-share
      ref="share"
      :settleRevenue="computedReceivableDetails.settleRevenue"
      :settleArrears="computedReceivableDetails.settleArrears"
      :paid="computedReceivableDetails.paid"
      :contract="baseInfo"
    ></c-contract-eco-share>
  </view>
</template>
<script>
export default {
  props: {
    receivableDetails: {
      type: Object,
      default: () => {},
    },
    addPigenohole: {
      type: Boolean,
      default: true,
    },
    addCost: {
      type: Boolean,
      default: true,
    },
    addRefund: {
      type: Boolean,
      default: true,
    },
    addClaim: {
      type: Boolean,
      default: true,
    },
    addPause: {
      type: Boolean,
      default: true,
    },
    addExpanse: {
      type: Boolean,
      default: true,
    },
    addChange: {
      type: Boolean,
      default: true,
    },
    isStartESignAdd: {
      type: Boolean,
      default: false,
    },
    baseInfo: {
      type: Object,
      default: () => {},
    },
    addWorkIn: {
      type: Boolean,
      default: true,
    },
    addWorkOut: {
      type: Boolean,
      default: true,
    },
    addProceed: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      addDiscounts: false,
      addSettled: false,
    };
  },

  computed: {
    computedReceivableDetails() {
      let _this = this;
      let obj = {
        paid:
          (_this.receivableDetails.receipt && this.receivableDetails.receipt.total) || 0, //实收
        fulfillmentRevenue:
          (_this.receivableDetails.receivableCurrent &&
            _this.receivableDetails.receivableCurrent.total) ||
          0, //履约营收
        performanceOfArrears:
          ((_this.receivableDetails.receivableCurrent &&
            _this.receivableDetails.receivableCurrent.total) ||
            0) -
          ((_this.receivableDetails.receipt && this.receivableDetails.receipt.total) ||
            0), // 履约欠款
        settleRevenue:
          (_this.receivableDetails.settlement && this.receivableDetails.settlement) || 0, //结算营收
        settleArrears:
          ((_this.receivableDetails.settlement && this.receivableDetails.settlement) ||
            0) -
          ((_this.receivableDetails.receipt && this.receivableDetails.receipt.total) ||
            0), //结算欠款
      };
      if (this.receivableDetails.isSettled) {
        // obj.fulfillmentRevenue = this.receivableDetails.newReceiveTotal
        // obj.performanceOfArrears = 0
        obj.settleRevenue = this.receivableDetails.newSettlementReceiveTotal;
        obj.settleArrears = 0;
      }
      return obj;
    },
    isShowBtns() {
      let obj = null;
      obj = this.btns.find((item) => item.isShow);
      this.$emit("isShowBtns", obj);
      return obj;
    },
    operateList() {
      let _this = this;
      return [
        {
          isShow: _this.baseInfo && _this.baseInfo.state != 1,
          name: "业务操作",
          list: [
            {
              name: "进场",
              icon: "iconzl--ruchang",
              id: "workIn",
              show:
                (_this.baseInfo.state == "5" ||
                  _this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8") &&
                _this.baseInfo.contractType != "3" &&
                _this.addWorkIn,
            },
            {
              name: "退场",
              icon: "iconzl--chuchang",
              id: "workOut",
              show:
                _this.baseInfo.state == "6" &&
                _this.baseInfo.contractType != "3" &&
                _this.addWorkOut,
            },
            {
              name: "收款",
              icon: "iconshoukuan1",
              id: "proceed",
              show:
                _this.addProceed &&
                (_this.baseInfo.state == "5" ||
                  _this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8"),
            },
            {
              name: "结算",
              icon: "iconziyuan",
              id: "settle",
              show: _this.baseInfo.state === "6" || _this.baseInfo.state === "7",
            },
            {
              name: "变更合同",
              icon: "iconhetongbiangengguanli",
              id: "changeContract",
              show:
                (_this.baseInfo.state == "5" ||
                  _this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8") &&
                this.addChange &&
                _this.baseInfo.contractType == "1",
            },
            {
              name: "附加合同",
              icon: "iconreport-fill",
              id: "contractExpense",
              show:
                (_this.baseInfo.state == "5" ||
                  _this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8") &&
                this.addExpanse &&
                _this.baseInfo.contractType == "1",
            },
            {
              name: "报停",
              icon: "icontingzhi",
              id: "pause",
              show:
                (_this.baseInfo.state === "6" ||
                  _this.baseInfo.state === "7" ||
                  _this.baseInfo.state === "8") &&
                _this.addPause,
            },
            {
              name: "索赔",
              icon: "iconsuopei",
              id: "claim",
              show:
                (_this.baseInfo.state === "6" ||
                  _this.baseInfo.state === "7" ||
                  _this.baseInfo.state === "8") &&
                _this.addClaim,
            },
            {
              name: "退款",
              icon: "icontuikuan1",
              id: "refund",
              show:
                _this.addRefund &&
                (_this.baseInfo.state == "5" ||
                  _this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8"),
            },
            {
              name: "成本",
              icon: "iconchengbenfenxi",
              id: "cost",
              show:
                _this.baseInfo.state == "5" ||
                _this.baseInfo.state == "6" ||
                _this.baseInfo.state == "7" ||
                _this.baseInfo.state === "8",
            },
            {
              name: "归档",
              icon: "iconguidang-copy",
              id: "pigeonhole",
              show: _this.baseInfo.state == "9" && _this.addPigenohole,
            },
            {
              name: "结清",
              icon: "icondangan1-copy",
              id: "contractSettledAdd",
              show: this.canContractSettled() && _this.addSettled,
            },
            {
              name: "优惠增收",
              icon: "icondangan1-copy",
              id: "addContractDiscounts",
              show:
                (_this.baseInfo.state == "6" ||
                  _this.baseInfo.state == "7" ||
                  _this.baseInfo.state === "8") &&
                _this.addDiscounts,
            },
            // {
            //     name: '发票',
            //     icon: 'icondianzifapiao-copy',
            //     id: 'invoice',
            //     show: true
            // },
          ],
        },
        {
          isShow: true,
          name: "合同操作",
          list: [
            //     {
            //     name: '预览',
            //     icon: 'iconchakan',
            //     id: 'contractPreview',
            //     show: true

            // },
            {
              name: "下载",
              icon: "iconxiazai3",
              id: "contractDownloadWord",
              show: true,
            },
            {
              name: "查看报告",
              icon: "iconreport-fill",
              id: "useReport",
              show: true,
            },
            {
              name: "附件",
              icon: "iconfujianziliao",
              id: "annex",
              show: true,
            },
            {
              name: "启动电签",
              icon: "iconwangqianguanli-copy",
              id: "signatureAdd",
              show: _this.isStartESignAdd && this.baseInfo.state != "1",
            },

            {
              name: "电签详情",
              icon: "iconwangqianguanli-copy",
              id: "signatureShow",
              show: !_this.isStartESignAdd && this.baseInfo.state != "1",
            },
            {
              name: "短信催款",
              icon: "iconxiaoxi3",
              id: "smsDunning",
              show: _this.receivableDetails.arrearDays > 0,
            },
          ],
        },
      ];
    },
    btns() {
      let _this = this;
      return [
        {
          name: "启动电签",
          icon: "iconwangqianguanli-copy",
          id: "signatureAdd",
          isShow: _this.isStartESignAdd && _this.baseInfo.state != 1,
        },

        {
          name: "电签详情",
          icon: "iconwangqianguanli-copy",
          id: "signatureShow",
          isShow: !_this.isStartESignAdd && _this.baseInfo.state != 1,
        },
        // {
        //     name: '启动电签',
        //     icon: 'iconzl--chuchang',
        //     id: 'workOut',
        //     isShow: _this.baseInfo && _this.baseInfo.state != 1,
        // },
        {
          name: "进场",
          icon: "iconzl--ruchang",
          id: "workIn",
          isShow:
            (_this.baseInfo.state == "5" ||
              _this.baseInfo.state == "6" ||
              _this.baseInfo.state == "7" ||
              _this.baseInfo.state === "8") &&
            _this.baseInfo.contractType != "3" &&
            _this.addWorkIn,
        },
        {
          name: "收款",
          icon: "iconshoukuan1",
          id: "proceed",
          isShow:
            _this.baseInfo &&
            _this.baseInfo.state != 1 &&
            _this.addProceed &&
            (_this.baseInfo.state == "5" ||
              _this.baseInfo.state == "6" ||
              _this.baseInfo.state == "7" ||
              _this.baseInfo.state === "8"),
        },
        {
          name: "分享",
          icon: "iconshare",
          id: "share",
          isShow: _this.baseInfo && _this.baseInfo.state != 1,
        },
        // {
        //   name: "下载",
        //   icon: "iconxiazai3",
        //   id: "downDialog",
        //   isShow: _this.baseInfo && _this.baseInfo.state != 1,
        // },

        {
          name: "更多",
          // isShow: _this.baseInfo && _this.baseInfo.arrearDays,
          isShow: true,
          id: "more",
        },
      ];
    },
  },
  created() {
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    this.addDiscounts = ps.some(
      (x) => x.value === this.$savekey.PERMISSION_ADD_DISCOUNTS
    );
    this.addSettled = ps.some((x) => x.value === this.$savekey.PERMISSION_ADD_SETTLED);
  },
  methods: {
    close() {
      this.$refs.downDialog.close();
    },
    canContractSettled() {
      if (this.baseInfo.state == "6" || this.baseInfo.state == "7") {
        return (
          this.baseInfo.workInCount > 0 &&
          this.baseInfo.workInCount == this.baseInfo.workOutCount
        );
      }
      return this.baseInfo.state === "8";
    },
    async handleIconClick(item) {
      console.log(item, "item");
      switch (item.id) {
        case "workIn":
          if (
            !this.addWorkIn ||
            this.baseInfo.contractType == "3" ||
            (this.baseInfo.state != "5" &&
              this.baseInfo.state != "6" &&
              this.baseInfo.state != "7" &&
              this.baseInfo.state != "8")
          ) {
            return;
          }
          uni.navigateTo({
            // url: '/businessPages/workin/creat-workin?contract=' + encodeURIComponent(JSON.stringify(this.baseInfo))
            url:
              "/businessPages/workin/create-workin-step-all?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        //收款
        case "proceed":
          if (!this.addProceed) {
            return;
          }
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        // 结算
        case "settle":
          if (
            !(
              (this.baseInfo.state === "6" ||
                this.baseInfo.state === "7" ||
                this.baseInfo.state === "8") &&
              this.addClaim
            )
          ) {
            return uni.showToast({ title: "当前合同暂无法结算" });
          }
          uni.redirectTo({
            url: `/businessPages/settledown/settle-add?contracts=${this.baseInfo.businessNo}&customerId=${this.baseInfo.customerId} `,
          });
          this.$refs.downDialog.close();
          break;
        //变更
        case "changeContract":
          if (
            !(
              this.addChange &&
              this.baseInfo.contractType == "1" &&
              !this.baseInfo.plusIng &&
              !this.baseInfo.changeIng
            )
          ) {
            return;
          }
          uni.navigateTo({
            url:
              "/contractPages/contract-change/create-contract-change?id=" +
              this.baseInfo.id,
          });
          this.$refs.downDialog.close();

          break;
        //附加合同
        case "contractExpense":
          if (
            !(
              this.addExpanse &&
              this.baseInfo.contractType == "1" &&
              !this.baseInfo.plusIng &&
              !this.baseInfo.changeIng
            )
          ) {
            return;
          }
          uni.navigateTo({
            url:
              "/contractPages/contract-expense/create-contract-expense?id=" +
              this.baseInfo.id,
          });
          this.$refs.downDialog.close();
          break;
        // 报停
        case "pause":
          // if (
          //   !(
          //     (this.baseInfo.state == "6" ||
          //       this.baseInfo.state == "7" ||
          //       this.baseInfo.state == "8") &&
          //     this.addPause
          //   )
          // ) {
          //   return;
          // }
          uni.navigateTo({
            url:
              "/businessPages/pause/create-pause?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        // 索赔
        case "claim":
          // if (
          //   !(
          //     (this.baseInfo.state == "6" ||
          //       this.baseInfo.state == "7" ||
          //       this.baseInfo.state == "8") &&
          //     this.addClaim
          //   )
          // ) {
          //   return;
          // }
          uni.navigateTo({
            url:
              "/businessPages/claim/creat-claim?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        //退款
        case "refund":
          if (!this.addRefund) {
            return;
          }
          uni.navigateTo({
            url:
              "/businessPages/reimburse/creat-reimburse?item=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        case "contractSettledAdd":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settled-add?contractNo=" +
              this.baseInfo.businessNo,
          });
          this.$refs.downDialog.close();
          break;
        case "addContractDiscounts":
          let params = {
            contractNo: this.baseInfo.businessNo,
          };
          await this.$network
            .getData(this.$url.GET_SETTLE_BY_CONTRACT, "GET", params)
            .then((result) => {
              uni.navigateTo({
                url:
                  "/businessPages/discounts/discounts-create?contract=" +
                  encodeURIComponent(JSON.stringify(this.baseInfo)),
              });
            })
            .catch((err) => {
              uni.showToast({
                title: err.details ? err.details[0] : err.message,
                icon: "none",
              });
            });
          this.$refs.downDialog.close();
          break;
        //成本
        case "cost":
          if (!this.addCost) {
            return;
          }
          uni.navigateTo({
            url:
              "/businessPages/cost-manage/create-cost?item=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          this.$refs.downDialog.close();
          break;
        //短信催款
        case "smsDunning":
          uni.navigateTo({
            url:
              `/otherPages/linkman/sms-dunning?customerId=` +
              this.baseInfo.customerId +
              `&customer=` +
              encodeURIComponent(
                JSON.stringify({ ...this.baseInfo, name: this.baseInfo.customerName })
              ),
          });
          this.$refs.downDialog.close();
          break;
        //   归档
        case "pigeonhole":
          // if (this.addPigenohole && this.baseInfo.state == "9")
          if (this.addPigenohole) {
            uni.showModal({
              title: "提示",
              content: "确认要把该合同归档么?",
              success: (res) => {
                if (res.cancel) {
                } else {
                  this.updataStatus();
                }
              },
            });
          }
          this.$refs.downDialog.close();
          break;
        case "contractPreview":
          //   预览
          uni.getStorage({
            key: this.$savekey.USER_PRIVILEGES_MEG,
            success: (res) => {
              if (
                this.baseInfo.signStatus &&
                this.baseInfo.signStatus == "2" &&
                this.baseInfo.flowId
              ) {
                //电签状态为2，下载pdf格式文件
                this.getPdfUrl(this.baseInfo.flowId);
              } else {
                let isDownloadTemplate = res.data.some(
                  (x) => x.value === this.$savekey.PERMISSION_EXPORT_CONTRACT_TEMPLATE
                );
                if (
                  isDownloadTemplate &&
                  this.baseInfo.state !== "0" &&
                  this.baseInfo.state !== "3" &&
                  this.baseInfo.state !== "12"
                ) {
                  let headerDic = {
                    "Content-Type": "application/json",
                    Authorization: "",
                  };
                  let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
                  if (loginMes) {
                    let access_token = loginMes.token_type + " " + loginMes.access_token;
                    headerDic.Authorization = access_token;
                    this.downDocument(headerDic);
                  }
                } else {
                  uni.showToast({
                    icon: "none",
                    title: "暂无下载权限",
                  });
                }
              }
            },
          });
          this.$refs.downDialog.close();
          break;
        case "useReport":
          uni.navigateTo({
            url: `/businessPages/useReport/use-report-detail?contractId=${this.baseInfo.id}`,
          });
          this.$refs.downDialog.close();
        // 附件
        case "annex":
          this.gotoFileList(this.baseInfo);
          this.$refs.downDialog.close();
          break;
        //启动电签
        case "signatureAdd":
          this.$emit("goToESign", "start");
          this.$refs.downDialog.close();
          break;
        //电签详情
        case "signatureShow":
          let url = this.$url.esignRecordInfo;
          let param = {
            urlType: 1,
          };
          url = url.replace("{id}", this.baseInfo.signFlowId);

          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              console.log(encodeURIComponent(res));
              uni.navigateTo({
                url: `/otherPages/esign/webView?url= ${encodeURIComponent(res)}&title=${
                  this.baseInfo.customerName
                }-${this.baseInfo.contractDetailDto.projectName}`,
              });
            })
            .catch((err) => {});
          this.$refs.downDialog.close();
          break;
        case "contractDownloadWord":
          this.onNavBarButtonTap(item);
          this.$refs.downDialog.close();
          break;
      }
    },
    dialogClose() {
      this.$refs.downDialog.close();
    },
    gotoFileList(item) {
      console.log(this.baseInfo, "this.baseInfo");
      let str = "0";
      if (item.state != "4") {
        str = "1";
      }
      uni.navigateTo({
        url:
          "/contractPages/contract/business-pigeonhole?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&canpigeonhole=" +
          str,
      });
    },
    updataStatus() {
      let urlstr = this.$url.CONTRACT_UPDATA_STATE.replace(/xxx/, this.baseInfo.id);
      this.$network
        .getData(urlstr, "PUT", null)
        .then((result) => {
          uni.showToast({
            icon: "none",
            title: "归档成功",
          });
          uni.$emit("refresh-contract-list", {
            type: "contract",
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.message + (err.details ? ":" + err.details[0] : ""),
          });
        });
    },
    getPdfUrl(flowId) {
      let url = this.$url.QUERY_FINISHED_DOCUMENT + "?flowId=" + flowId;
      this.$network
        .getData(url, "GET")
        .then((result) => {
          uni.hideLoading();
          if (result && result.docs.length > 0 && result.docs[0].fileUrl) {
            this.downxlsc(result.docs[0].fileUrl, null);
          }
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: err.details && err.details[0] ? err.details[0] : err.message,
          });
        });
    },
    share() {
      this.$refs.share.share();
    },
    //启动电签
    handleBtnClick(item) {
      switch (item.id) {
        case "share":
          this.share();
          break;
        case "downDialog":
          this.onNavBarButtonTap(item);
          break;
        case "signatureAdd":
          this.$emit("goToESign", "start");
          break;
        case "signatureShow":
          let url = this.$url.esignRecordInfo;
          let param = {
            urlType: 1,
          };
          url = url.replace("{id}", this.baseInfo.signFlowId);

          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              // uni.navigateTo({
              //   url: `/otherPages/esign/webView?url= ${encodeURIComponentres}`,
              // });
              uni.navigateTo({
                url: `/otherPages/esign/webView?url=${encodeURIComponent(res)}&title=${
                  this.baseInfo.customerName
                }-${this.baseInfo.contractDetailDto.projectName}`,
              });
            })
            .catch((err) => {});

          break;
        case "workIn":
          if (
            !this.addWorkIn ||
            this.baseInfo.contractType == "3" ||
            (this.baseInfo.state != "5" &&
              this.baseInfo.state != "6" &&
              this.baseInfo.state != "7" &&
              this.baseInfo.state != "8")
          ) {
            return;
          }
          uni.navigateTo({
            // url: '/businessPages/workin/creat-workin?contract=' + encodeURIComponent(JSON.stringify(this.baseInfo))
            url:
              "/businessPages/workin/create-workin-step-all?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          break;
        case "workOut":
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?contract=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          break;
        //收款
        case "proceed":
          if (!this.addProceed) {
            return;
          }
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(this.baseInfo)),
          });
          break;
        case "more":
          this.$refs.downDialog.open();
          break;
      }
    },
    onNavBarButtonTap(obj) {
      console.log(this.baseInfo, "this.baseInfo");
      if (
        this.baseInfo.state !== "0" &&
        this.baseInfo.state !== "3" &&
        this.baseInfo.state !== "12"
      ) {
        if (this.baseInfo.flowStatus == 2) {
          let url = this.$url.esignRecordFile;
          let param = {
            flowId: this.baseInfo.signFlowId,
          };
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              let url = res;
              let customerName = this.baseInfo.customerName
                ? this.baseInfo.customerName
                : "";
              let projectName =
                this.baseInfo.contractDetailDto &&
                this.baseInfo.contractDetailDto.projectName
                  ? this.baseInfo.contractDetailDto.projectName
                  : "";
              let filename = "合同-" + customerName + projectName + "-";
              filename = this.$gxfmethod.getFileNameDoc(filename, ".pdf");
              this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
            })
            .catch((err) => {});
        } else {
          let headerDic = {
            "Content-Type": "application/json",
            Authorization: "",
          };
          let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
          if (loginMes) {
            let access_token = loginMes.token_type + " " + loginMes.access_token;
            headerDic.Authorization = access_token;
            this.downDocument(headerDic);
          }
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "暂无下载权限",
        });
      }
    },
    downDocument(headerDic) {
      let url =
        this.$url.BASE_URL +
        this.$url.DOWNLOAD_WORD_CONTRACT +
        "?businessNo=" +
        this.baseInfo.businessNo;
      this.downxlsc(url, headerDic);
      // this.$network
      //   .getData(url, "GET", null)
      //   .then((result) => {})
      //   .catch((err) => {
      //     if (err.code) {
      //       uni.showToast({
      //         title: err.message + ":" + err.details[0],
      //         icon: "none",
      //       });
      //     } else {
      //       setTimeout(() => {
      //         this.downxlsc(url, headerDic);
      //       }, 100);
      //     }
      //   });
    },
    downxlsc(url, headerDic) {
      let customerName = this.baseInfo.customerName ? this.baseInfo.customerName : "";
      let projectName =
        this.baseInfo.contractDetailDto && this.baseInfo.contractDetailDto.projectName
          ? this.baseInfo.contractDetailDto.projectName
          : "";
      let name = "合同-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        // 状态字符串
        const stateString = "4,5,6,7,8,9";

        // 将字符串转换为数组
        const statesArray = stateString.split(",");

        // 假设 this.baseInfo.state 是某个你要检查的状态值（可能是数字）
        let currentState = this.baseInfo.state;
        let param = {};

        // 将 currentState 转换为字符串，并检查是否在数组中
        if (statesArray.includes(currentState.toString())) {
          param = {
            contractStateList: "4,5,6,7,8,9",
          };
        }

        this.$gxfmethod.downFunc(url, "GET", param, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.close-btn {
  width: 100%;
  height: 45rpx;
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #e60000;
  display: flex;
  border-top: 1px solid #e6e6e6;
  margin-top: 30rpx;
  padding-top: 10rpx;
  justify-content: center;
  align-items: center;
}

::v-deep .iconfont {
  color: coral;
  font-size: 30rpx;
}

.item {
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    right: 8px;
    width: 2rpx;
    height: 33rpx;
    background: #e6e6e6;
  }
}

.more-btns {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 104rpx;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
  padding: 0 34rpx;

  .item {
    flex: 1;

    &:first-child {
      flex: 1.4;
    }
  }

  .more {
    // margin-right: 10px;
    .btn-text {
      color: #fff !important;
    }

    &::after {
      background: transparent;
    }
  }
}

.btn-text {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-left: 6rpx;
}

.more {
  width: 104rpx;
  height: 64rpx;
  background: #fe931f;
  border-radius: 6rpx;
  color: white !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pop-container {
  position: absolute;
  top: 300rpx;
  left: 50rpx;
  width: 642rpx;
  height: 764rpx;
  background: #ffffff !important;
}

::v-deep .uni-popup-dialog {
  width: 642rpx;
  height: 764rpx;
  background: #ffffff !important;
}

.pop {
  box-sizing: border-box;
  width: 642rpx;
  // height: 764rpx;
  background: #ffffff !important;
  padding: 34rpx 40rpx;
}

.pop-item-title {
  font-size: 30rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 14rpx;
}

.pop-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 14rpx;

  &:last-child {
    margin-top: 30rpx;
  }
}

.item-wrapper {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
}

.pop-item-1 {
  flex-basis: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // text-align: left;
  justify-content: center;
  margin: 10rpx 0;
  // margin-right: 5rpx;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: #fcebd6;
}

.txt {
  margin-top: 10rpx;
  text-align: left;
}
</style>
