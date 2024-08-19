<template>
  <view class="workin-out">
    <!-- 头部 -->
    <view class="header-icon card">
      <template v-for="(item, index) in workInOutList">
        <view class="icon-item" :key="index">
          <view class="img-wrapper">
            <dashboard-icon
              :icon="item.icon"
              :iconColor="item.color"
              :backgroundColor="item.bgc"
            ></dashboard-icon>
          </view>
          <view class="txt">
            <text>{{ item.name }}</text>
            <text class="bold">{{ item.num }}台</text>
          </view>
        </view>
      </template>
    </view>
    <view class="main">
      <!-- 进场记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view class="titleDot1">
            <view class="titleDot2"></view>
          </view>
          <text style="margin-left: 5px">进场记录</text>
        </view>
        <template v-if="workInList.length > 0">
          <view class="list" v-for="(item, index) in workInList" :key="index">
            <view class="list-item" @click="goTo(item, 'workIn')">
              <view class="date">
                <text
                  >启用日期：{{
                    (item.beginDate && item.beginDate.split(" ")[0]) || "-"
                  }}</text
                >
                <text>共计：{{ (item.machines && item.machines.length) || 0 }}台</text>
              </view>
              <view class="gray"
                >进场数量：
                <template v-for="item1 in item.someList">
                  {{ item1.heightName }}({{ item1.number }}台）
                </template>
              </view>
              <view class="gray">
                <text>运输方式：{{ item.logisticsTypeName || "-" }}</text>
                <text class="second">交机人：{{ item.deliveryUserName || "-" }}</text>
              </view>
              <view class="gray">
                <text>审批状态：{{ item.stateName || "-" }}</text>
                <text class="second"
                  >签署进度：{{ getFlowStatus(item.flowStatus) || "-" }}</text
                >
              </view>
            </view>
            <view class="btns">
              <view
                class="btn"
                v-if="
                  checkAllPermissions(['workInDelete']) &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
                @click.stop="deleteWorkIn(item)"
              >
                <i class="iconfont icondelete" style="color: coral"></i>
                <text>删除</text>
              </view>
              <view
                class="btn"
                v-if="
                  checkAllPermissions(['workInModify']) &&
                  item.state === '4' &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
                @click.stop="updateWorkIn(item)"
              >
                <i class="iconfont iconxiugai" style="color: coral"></i>
                <text>修改</text>
              </view>
              <view class="btn">
                <i class="iconfont iconxiazai3" style="color: coral"></i>
                <text @click="onNavBarButtonTap(item, 'workIn')">下载</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>
      <!-- 退场记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view class="titleDot1">
            <view class="titleDot2"></view>
          </view>
          <text style="margin-left: 5px">退场记录</text>
        </view>
        <template v-if="workOutList.length > 0">
          <view class="list" v-for="(item, index) in workOutList" :key="index">
            <view class="list-item" @click="goTo(item, 'workOut')">
              <view class="date">
                <text
                  >结算日期：{{
                    (item.settleDate && item.settleDate.split(" ")[0]) || "-"
                  }}</text
                >
                <text>共计：{{ (item.machines && item.machines.length) || 0 }}台</text>
              </view>
              <view class="gray flex"
                >退场数量：
                <template v-for="item1 in item.someList">
                  {{ item1.heightName }}
                  (
                  {{ item1.number }}
                  台）<!-- <text v-if="item.someList.length>1">、</text> -->
                </template>
              </view>
              <view class="gray">
                <text>运输方式：{{ item.logisticsTypeName || "-" }}</text>
                <text class="second">交机人：{{ item.deliveryUserName || "-" }}</text>
              </view>
              <view class="gray">
                <text>审批状态：{{ item.stateName || "-" }}</text>
                <text class="second"
                  >签署进度：{{ getFlowStatus(item.flowStatus) || "-" }}</text
                >
              </view>
            </view>
            <view class="btns">
              <view
                class="btn"
                v-if="
                  checkAllPermissions(['workOutDelete']) &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
                @click.stop="deleteWorkOut(item)"
              >
                <i class="iconfont icondelete" style="color: coral"></i>
                <text>删除</text>
              </view>
              <view
                class="btn"
                v-if="
                  checkAllPermissions(['workOutModify']) &&
                  item.state === '4' &&
                  item.contractState != '4' &&
                  item.contractState != '9'
                "
                @click.stop="updateWorkOut(item)"
              >
                <i class="iconfont iconxiugai" style="color: coral"></i>
                <text>修改</text>
              </view>
              <view class="btn" @click="onNavBarButtonTap(item, 'workOut')">
                <i class="iconfont iconxiazai3" style="color: coral"></i>
                <text>下载</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>

      <!-- 签署记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view class="titleDot1">
            <view class="titleDot2"></view>
          </view>
          <text style="margin-left: 5px">进退场签署记录</text>
        </view>
        <template v-if="esignList.length > 0">
          <view class="list" v-for="(item, index) in esignList" :key="index">
            <view class="list-item" @click="goToDetail(item)">
              <view class="date">
                <text>{{ item.title || "-" }}</text>
                <p :class="item.color">
                  {{ getFlowStatus(item.flowStatus) || "-" }}
                </p>
              </view>
              <view class="_gray">
                <text>发起时间：{{ item.createDate.slice(0, -3) || "-" }}</text>
                <text class="second">发起人：{{ item.createBy || "-" }}</text>
              </view>
              <view class="gray">
                <view> 签署方：</view>
                <view>
                  <p
                    style="margin-bottom: 6px"
                    v-for="(item1, index1) in item.signer"
                    :key="index1"
                  >
                    {{ item1 }}
                  </p>
                </view>
              </view>
            </view>
            <view class="_btns">
              <view v-if="item.flowStatus == 1" class="btn_item">
                <i class="iconfont iconchehui1" style="color: coral"></i>
                <text @click.stop="revoke(item)">撤回</text>
              </view>
              <view v-if="item.flowStatus == 1" class="btn_item">
                <i class="iconfont iconleftfont-17" style="color: coral"></i>
                <button
                  v-if="item.flowStatus == 1"
                  class="tag-btns-view"
                  @click="share(item)"
                  data-type="esign"
                  open-type="share"
                >
                  {{ "催办" }}
                </button>
              </view>
              <view class="btn_item">
                <i class="iconfont iconxiazai3" style="color: coral"></i>
                <text @click="download(item)">下载</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>
      <!-- 报停记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view class="titleDot1">
            <view class="titleDot2"></view>
          </view>
          <text style="margin-left: 5px">报停记录</text>
        </view>
        <template v-if="stopRecord.length > 0">
          <view class="list">
            <view
              class="list-item border-1"
              v-for="(item, index) in stopRecord"
              @click="goTo(item, 'pause')"
              :key="index"
            >
              <view class="date">
                <text
                  >报停时间：{{
                    (item.beginDate && item.beginDate.split(" ")[0]) || "-"
                  }}</text
                >
                <text>共计：{{ (item.machines && item.machines.length) || 0 }}台</text>
              </view>
              <view class="gray">
                <text>报停人：{{ item.createName || "-" }}</text>
                <text class="second">报停类型：{{ item.pauseCauseName || "-" }}</text>
              </view>
              <view class="gray">
                <text>审批状态：{{ item.stateName || "-" }}</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>

      <!-- 索赔记录 -->
      <view class="workin-record">
        <view class="item-title">
          <view class="titleDot1">
            <view class="titleDot2"></view>
          </view>
          <text style="margin-left: 5px">索赔记录</text>
        </view>
        <template v-if="claimList.length > 0">
          <view class="list">
            <view
              class="list-item border-1"
              v-for="(item, index) in claimList"
              @click="goTo(item, 'claim')"
              :key="index"
            >
              <view class="date">
                <text
                  >索赔时间：{{
                    (item.claimDate && item.claimDate.split(" ")[0]) || "-"
                  }}</text
                >
                <text
                  >共计：{{
                    (item.claimMachineList && item.claimMachineList.length) || 0
                  }}台</text
                >
              </view>
              <view class="gray">
                <text>索赔金额：{{ Number(item.total).toFixed(2) || "0:00" }}元</text>
                <text class="second">审批状态：{{ item.stateName || "-" }}</text>
              </view>
            </view>
          </view>
        </template>
        <view class="empty-data-box" v-else>
          <image class="icon" mode="widthFix" src="/static/empty.png"></image>
          <text class="text">暂无数据</text>
        </view>
      </view>
    </view>
    <sany-popup ref="sanyPop" @popClose="popClose"></sany-popup>
  </view>
</template>
<script>
import dashboardIcon from "@/components/common/sany/dashboardIcon.vue";
import {
  checkAllPermissions,
  showToast,
} from "@/common/business-method/common-method/util.js";
import sanyPopup from "@/components/common/sany/sany-popup.vue";
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: { dashboardIcon, sanyPopup },
  data() {
    return {
      workInOutCount: {},
      workInList: [],
      workOutList: [],
      esignWorkin: [],
      esignWorkOut: [],
      stopRecord: [],
      claimList: [],

      isAddESign: false,
    };
  },
  created() {
    console.log(this.baseInfo, "this.baseInfo");
    this.init();
    this.loaddata();
    this.loaddataworkout();
    this.loaddataStopRecord();
    this.getClaimList();
  },
  onload() {
    let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
    if (ps) {
      this.isAddESign = ps.some(
        (x) => x.value === this.$savekey.PERMISSION_WORKIN_ESIGN_ADD
      );
    }
    y;
    this.loaddata();
    this.loaddataworkout();
  },
  methods: {
    checkAllPermissions,
    showToast,
    popClose() {
      this.$emit("popClose");
    },
    // 定义一个方法来显示模态框
    showModal(title, content, isConfirm = false, onConfirm = null) {
      this.$emit("popShow");
      this.$refs.sanyPop.showModal({
        title,
        content,
        confirmButtonName: isConfirm ? "删除" : undefined,
        cancelButtonName: "关闭",
        confirmButtonStyle: isConfirm ? "primary" : undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm && onConfirm) {
            onConfirm();
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
        },
      });
    },
    updateWorkOut(item) {
      let urlstr = this.$url.WORK_OUT_UPDATE_CHECK.replace(/{id}/, item.businessNo);
      this.$network
        .getData(urlstr, "GET", {}, { hideError: true })
        .then((checkRes) => {
          uni.navigateTo({
            url:
              "/businessPages/workout/create-workout-first?isUpdate=1&workActionMode=edit&item=" +
              encodeURIComponent(JSON.stringify(item)),
          });
        })
        .catch((err) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("无法修改", message);
          }
        });
    },
    deleteWorkOut(item) {
      // 替换URL中的占位符
      let checkUrl = this.$url.WORK_OUT_DELETE_CHECK.replace(/{id}/, item.businessNo);

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", {}, { hideError: true })
        .then((checkRes) => {
          // 检查通过，请求用户确认是否删除
          this.showModal(
            "删除确认",
            "注意：您将删除当前退场单，该操作不可恢复,该操作执行后立即生效。",
            true,
            () => {
              // 用户确认删除，执行删除操作
              this.performDeleteWorkOut(item.businessNo);
            }
          );
        })
        .catch((err) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("删除失败", message);
          }
        });
    },
    // 定义一个方法来执行删除操作
    performDeleteWorkOut(businessNo) {
      let deleteUrl = this.$url.WORK_OUT_DELETE.replace(/{id}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.loaddataworkout(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },
    updateWorkIn(item) {
      let urlstr = this.$url.WORK_OUT_UPDATE_CHECK;
      this.$network
        .getData(urlstr, "GET", { businessNo: item.businessNo }, { hideError: true })
        .then((checkRes) => {
          if (item.expressFlag) {
            uni.navigateTo({
              url:
                "/businessPages/workin/create-workin-simple?isUpdate=1&workActionMode=edit&item=" +
                encodeURIComponent(JSON.stringify(item)),
            });
          } else {
            uni.navigateTo({
              url:
                "/businessPages/workin/create-workin-step-all?item=" +
                encodeURIComponent(JSON.stringify(item)) +
                "&backType=2&workActionMode=edit",
            });
          }
        })
        .catch((err) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("无法修改", message);
          }
        });
    },
    deleteWorkIn(item) {
      // 替换URL中的占位符
      let checkUrl = this.$url.WORK_IN_DELETE_CHECK;

      // 先进行删除前的检查
      this.$network
        .getData(checkUrl, "GET", { businessNo: item.businessNo }, { hideError: true })
        .then((checkRes) => {
          // 检查通过，请求用户确认是否删除
          this.showModal(
            "删除确认",
            "注意：您将删除当前进场单，该操作不可恢复,该操作执行后立即生效。",
            true,
            () => {
              // 用户确认删除，执行删除操作
              this.performDeleteWorkIn(item.businessNo);
            }
          );
        })
        .catch((err) => {
          if (checkRes && checkRes.code == 500) {
            // 在调用showModal之前构建消息
            let message = checkRes.message || "请联系客服人员";

            // 检查是否有result
            if (checkRes.result) {
              let documentNumbers;

              // 如果result是数组，使用join方法拼接单据号
              if (Array.isArray(checkRes.result)) {
                documentNumbers = checkRes.result.join(", ");
              } else {
                // result是字符串，直接使用
                documentNumbers = checkRes.result;
              }

              // 将单据号拼接到消息上
              message += ` 相关单据号: ${documentNumbers}`;
            }
            // 删除检查失败，显示失败信息
            this.showModal("删除失败", message);
          }
        });
    },
    // 定义一个方法来执行删除操作
    performDeleteWorkIn(businessNo) {
      let deleteUrl = this.$url.WORK_IN_DELETE.replace(/{id}/, businessNo);
      this.$network
        .getData(deleteUrl, "DELETE", {})
        .then(() => {
          this.loaddata(); // 刷新头部
        })
        .catch((err) => {
          this.showToast(err);
        });
    },

    goTo(item, type) {
      let self = this;
      item = { ...item, businessType: type };
      switch (item.businessType) {
        case "settle":
          if (
            !(
              (this.baseInfo.state === "6" ||
                this.baseInfo.state === "7" ||
                this.baseInfo.state === "8") &&
              this.addClaim
            )
          ) {
            return;
          }
          uni.redirectTo({
            url: `/businessPages/settledown/settle-add?contracts=${this.baseInfo.businessNo}&customerId=${this.baseInfo.customerId} `,
          });
          break;
        case "workIn":
          uni.navigateTo({
            url: "/businessPages/workin/workin-detail?businessNo=" + item.businessNo,
          });
          break;
        case "invoice":
          uni.navigateTo({
            url: "/businessPages/invoice/invoice-detail?businessNo=" + item.businessNo,
          });
          break;
        case "proceeds":
          uni.navigateTo({
            url: "/businessPages/proceed/porceeds-detail?businessNo=" + item.businessNo,
          });
          break;
        // 退款
        case "reimburse":
          uni.navigateTo({
            url:
              "/businessPages/reimburse/reimburse-detail?businessNo=" + item.businessNo,
          });
          break;
        //成本
        case "cost":
          uni.navigateTo({
            url: "/businessPages/cost-manage/cost-detail?businessNo=" + item.businessNo,
          });
          break;
        case "costlist":
          let customerName = item.customerName ? item.customerName + "-" : null;
          let projectName = item.projectName ? item.projectName : null;
          let contractName = customerName
            ? customerName
            : null + contractName
            ? contractName
            : null;
          uni.switchTab({
            url: "/pages/main/business",
            success: function (e) {
              let info = {
                param: {
                  contractName,
                },
                key: "costManage",
                id: 15,
              };
              uni.setStorage({
                key: self.$savekey.MEMORY_STORAGE,
                data: info,
              });
            },
          });
          break;

        case "claim":
          uni.navigateTo({
            url: "/businessPages/claim/claim-detail?businessNo=" + item.businessNo,
          });
          break;
        case "contract":
          uni.navigateTo({
            url: "./contract-detail?id=" + item.id,
          });
          break;
        case "workOut":
          uni.navigateTo({
            url: "/businessPages/workout/workout-detail?businessNo=" + item.businessNo,
          });
          break;
        case "pause":
          uni.navigateTo({
            url: "/businessPages/pause/pause-detail?id=" + item.businessNo,
          });
          break;
        case "contractChange":
          console.log(item);
          uni.navigateTo({
            url: "/contractPages/contract-change/contract-change-detail?id=" + item.id,
          });
          break;
        case "statement":
          uni.navigateTo({
            url:
              "/businessPages/settledown/settle-dz-detail?businessNo=" + item.businessNo,
          });
          break;
        default:
          uni.showToast({
            icon: "none",
            title: "该功能未在APP开放，请去PC端处理",
          });
          break;
      }
    },
    // 索赔记录
    async getClaimList() {
      //索赔
      let self = this;
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(this.$url.CLAIM_PAGE, "POST", param);
      console.log(res, "getClaimList");
      this.claimList = res.records || [];
    },
    // 报停记录
    async loaddataStopRecord() {
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(this.$url.PAUSE_PAGE, "POST", param);
      this.stopRecord = res.records
        ? res.records.map((item) => {
            console.log(item, "item");
            return item;
          })
        : [];
    },
    // 进场记录
    async loaddata() {
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(this.$url.WORK_IN_PAGE, "POST", param);
      let businessArr = [];
      // this.workInList=res.records||[];
      this.workInList = res.records
        ? res.records.map((o) => {
            let someList = [];
            if (o.machines) {
              let types = o.machines.map((y) => {
                return `${y.type}&${y.machineHeight}`;
              });
              let list = [...new Set(types)];

              someList = list.map((y) => {
                let arr = y.split("&");

                let obj = {
                  number: 0,
                  type: null,
                  height: null,
                };

                if (arr.length == 2) {
                  obj.type = arr[0];
                  obj.height = arr[1];
                }

                let filters = o.machines.filter(
                  (z) => z.machineHeight == obj.height && z.type == obj.type
                );

                obj.number = filters.length;

                return {
                  ...obj,
                  typeName: filters.length > 0 ? filters[0].typeName : null,
                  heightName: filters.length > 0 ? filters[0].machineHeightName : null,
                };
              });
            }
            businessArr.push(o.businessNo);
            return {
              ...o,
              someList: someList,
            };
          })
        : [];
      if (this.workInList.length) {
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "workIn",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignWorkin = res;
          })
          .catch((err) => {});
      }
    },
    async loaddataworkout() {
      let param = {
        current: 1,
        size: 5000,
        contractNo: this.baseInfo.businessNo,
      };
      let res = await this.$network.getData(this.$url.WORK_OUT_PAGE, "POST", param);
      let businessArr = [];
      this.workOutList = res.records
        ? res.records.map((o) => {
            let someList = [];
            if (o.machines) {
              let types = o.machines.map((y) => {
                return `${y.type}&${y.machineHeight}`;
              });
              let list = [...new Set(types)];

              someList = list.map((y) => {
                let arr = y.split("&");

                let obj = {
                  number: 0,
                  type: null,
                  height: null,
                };

                if (arr.length == 2) {
                  obj.type = arr[0];
                  obj.height = arr[1];
                }

                let filters = o.machines.filter(
                  (z) => z.machineHeight == obj.height && z.type == obj.type
                );

                obj.number = filters.length;

                return {
                  ...obj,
                  typeName: filters.length > 0 ? filters[0].typeName : null,
                  heightName: filters.length > 0 ? filters[0].machineHeightName : null,
                };
              });
            }
            businessArr.push(o.businessNo);
            return {
              ...o,
              someList: someList,
            };
          })
        : [];

      if (this.workOutList.length) {
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "workOut",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignWorkOut = res;
          })
          .catch((err) => {});
      }
    },
    getEsignList() {
      let param = {
        current: 1,
        size: 50,
        businessNo: this.businessNo,
        businessType: this.businessType,
      };
      let url = this.$url.esignRecordPage;
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.esignList = result;
          this.datalist.forEach((e) => {
            e.signerArr = e.signer.split(",");
          });
        })
        .catch((err) => {});
    },
    onNavBarButtonTap(obj, type) {
      if (
        this.baseInfo.state !== "0" &&
        this.baseInfo.state !== "3" &&
        this.baseInfo.state !== "12"
      ) {
        if (obj.flowStatus == 2) {
          let url = this.$url.esignRecordFile;
          let param = {
            flowId: obj.signFlowId,
          };
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              let url = res;
              let filename = obj.title + ".pdf";
              // #ifdef APP-PLUS
              filename = "_doc/" + obj.title + ".pdf";
              // #endif
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
            this.downDocument(headerDic, obj, type);
          }
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "暂无下载权限",
        });
      }
    },
    downDocument(headerDic, obj, type) {
      let url =
        type == "workIn"
          ? this.$url.DOWNLOAD_WORD_WORKIN + "?businessNo=" + obj.businessNo
          : this.$url.DOWNLOAD_WORD_WORKOUT + "?businessNo=" + obj.businessNo;
      this.downxlsc(url, headerDic, obj, type);

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
      //         this.downxlsc(url, headerDic, obj, type);
      //       }, 100);
      //     }
      //   });
    },
    downxlsc(url, headerDic, obj, type) {
      let customerName = obj.customerName ? obj.customerName : "";
      let projectName = obj.projectName && obj.projectName ? obj.projectName : "";
      let name = type == "workIn" ? "进场-" : "退场-" + customerName + projectName + "-";
      if (headerDic != null) {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
        this.$gxfmethod.downFunc(url, "GET", undefined, filename);
      } else {
        let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
        this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
      }
    },
    onShareAppMessage(ops) {
      let promise;

      if (ops.from === "button") {
        let url = this.$url.esignRecordInfo;
        let param = {
          urlType: 2,
        };
        url = url.replace("{id}", this.flowId);
        console.log(url);
        promise = new Promise((resolve) => {
          this.$network
            .getData(url, "GET", param)
            .then((res) => {
              resolve({
                title: this.title,
                imageUrl:
                  "https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
                path: `/otherPages/esign/webView?url=${encodeURIComponent(res)}&title=${
                  this.title
                }`,
              });
            })
            .catch((err) => {});
        });
      }
      return {
        promise,
      };
    },
    async init() {
      if (!this.baseInfo.businessNo || !this.baseInfo.id) return;
      let res = await this.$network.getWorkInOutCount({
        businessNo: this.baseInfo.businessNo,
        id: this.baseInfo.id,
      });
      this.workInOutCount = res;
      console.log(res, "getWorkInOutCount");
    },

    revoke(item) {
      uni.showModal({
        title: "提示",
        content: "是否确认撤销当前电签流程？",
        success: (res) => {
          if (res.confirm) {
            let url = this.$url.esignRecordRevoke;
            url = url.replace("{id}", item.flowId);
            this.$network
              .getData(url, "POST")
              .then((res) => {
                setTimeout(() => {
                  this.loaddata();
                  this.loaddataworkout();
                  this.getEsign();
                  this.$emit("refresh");
                }, 1000);
              })
              .catch((err) => {});
          }
        },
      });
    },
    getFlowStatus(type) {
      let str = "";
      switch (type) {
        case 1:
          str = "签署中";
          break;
        case 2:
          str = "已完成";
          break;
        case 3:
          str = "撤销";
          break;
        case 7:
          str = "拒签";
          break;
        default:
          break;
      }
      return str;
    },
    getEsign() {
      this.esignList = [];
      if (this.workInList.length) {
        let businessArr = [];
        this.workInList.forEach((e) => {
          businessArr.push(e.businessNo);
        });
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "workIn",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignWorkin = res;
            this.$forceUpdate();
          })
          .catch((err) => {});
      }
      if (this.workOutList.length) {
        let businessArr = [];
        this.workOutList.forEach((e) => {
          businessArr.push(e.businessNo);
        });
        let url = this.$url.esignRecordPage;
        this.$network
          .getData(url, "POST", {
            current: 1,
            size: 50,
            businessNo: businessArr.join(","),
            businessType: "workOut",
          })
          .then((result) => {
            let res = result.records;
            res.forEach((e) => {
              e.signer = e.signer.split(",");
              switch (e.flowStatus) {
                case 1:
                  e.color = "blue";
                  break;
                case 2:
                  e.color = "green";
                  break;
                case 3:
                  e.color = "yellow";
                  break;
                case 7:
                  e.color = "red";
                  break;
                default:
                  break;
              }
            });
            this.esignWorkOut = res;
            this.$forceUpdate();
          })
          .catch((err) => {});
      }
    },
    goToDetail(item) {
      let url = this.$url.esignRecordInfo;
      let param = {
        urlType: 1,
      };
      url = url.replace("{id}", item.flowId);

      this.$network
        .getData(url, "GET", param)
        .then((res) => {
          uni.navigateTo({
            url: `/otherPages/esign/webView?url=${encodeURIComponent(res)}&title=${
              item.title
            }`,
          });
        })
        .catch((err) => {});
    },
    share(item) {
      let obj = {};
      obj.flowId = item.flowId;
      obj.title = item.title;
      console.log(obj, "77777777777777");
      this.$emit("share", obj);
    },
    download(item) {
      if (item.flowStatus == 2) {
        let url = this.$url.esignRecordFile;
        let param = {
          flowId: item.flowId,
        };
        this.$network
          .getData(url, "GET", param)
          .then((res) => {
            let url = res;
            let filename = item.title + ".pdf";
            // #ifdef APP-PLUS
            filename = "_doc/" + item.title + ".pdf";
            // #endif
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

          let url =
            this.getUrlUploadFile(item.businessType) + "?businessNo=" + item.businessNo;

          this.downxlsc(url, headerDic, item.title);
        }
      }
    },
    getUrlUploadFile(type) {
      let url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
      switch (type) {
        case "contract":
          url = this.$url.DOWNLOAD_WORD_CONTRACT;
          break;
        case "contractPlus":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_PLUS;
          break;
        case "settlement": //结算
          url = this.$url.BASE_URL + "settleapi/api/settlement/export";
          break;

        case "workIn": //进场
          url = this.$url.DOWNLOAD_WORD_WORKIN;
          break;
        case "workOut": //退场
          url = this.$url.DOWNLOAD_WORD_WORKOUT;
          break;
        case "esignMerge": //合并电签
          url = this.$url.ESIGN_DOWNLOAD_URL_CONTRACT_MERGE;
          break;
        default:
          break;
      }
      return url;
    },
  },
  computed: {
    workInOutList() {
      let _this = this;
      return [
        {
          name: "合同约定",
          num: _this.workInOutCount["contractOrderMachineCount"] || 0,
          icon: "iconhetong3",
          color: "#52c41a",
          bgc: "#EDF9E8",
        },
        {
          name: "当前进场",
          num: _this.workInOutCount["workInMachineCount"] || 0,
          icon: "iconzl--ruchang",
          color: "#6a5fff",
          bgc: " #F0EFFF",
        },
        {
          name: "在租",
          num: _this.workInOutCount["rentCount"] || 0,
          icon: "iconzl--zhuanzu1",
          color: "#fe931f",
          bgc: "#FEF4E8",
        },
        {
          name: "退场",
          num: _this.workInOutCount["workOutMachineCount"] || 0,
          icon: "iconzl--chuchang",
          color: "#3988ff",
          bgc: "#EBF3FF",
        },
      ];
    },
    esignList() {
      return [...this.esignWorkin, ...this.esignWorkOut];
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-data-box {
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  color: var(--text-color-gray);

  .icon {
    width: 108rpx;
  }

  .text {
    font-size: 28rpx;
  }
}

.card {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 10rpx;
  padding: 36rpx 25rpx 0;
  margin-bottom: 30rpx;
}

.border-1 {
  border-bottom: 1rpx solid #e6e6e6;
}

.list {
  padding-bottom: 10rpx;

  .list-item {
    padding: 22rpx 25rpx;
    padding-bottom: 10rpx;
  }

  .date {
    display: flex;
    justify-content: space-between;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #222222;
    margin-bottom: 16rpx;
  }

  .flex {
    flex-wrap: nowrap;
  }

  .gray {
    display: flex;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8c8c8c;
    margin-bottom: 12rpx;

    text {
      flex-basis: 50%;
    }
  }
}

._gray {
  display: grid;
  grid-template-columns: 60% 40%;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  margin-bottom: 12rpx;
}

.workin-record {
  background: #ffffff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 10rpx;
  margin-bottom: 38rpx;

  // padding-bottom: 8rpx;
  .list:last-child {
    padding-bottom: 0 !important;
  }
}

.btns {
  width: 100%;
  height: 64rpx;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  color: coral;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200;
  box-sizing: border-box;
  justify-content: flex-end;
  // padding: 0 40rpx;

  .btn {
    display: flex;
    align-items: center;
    margin-left: calc(25% - 56px);
    padding: 0 10rpx;
  }
}

.workin-out {
  background-color: #fff;
  padding: 28rpx 16rpx;

  .header-icon {
    display: flex;
    flex-wrap: wrap;
    padding-left: 13px;

    .icon-item {
      flex-basis: 50%;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      display: flex;
      color: #888888;
      margin-bottom: 30rpx;

      .img-wrapper {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .txt {
        margin-left: 18rpx;
        display: flex;
        flex-direction: column;

        .bold {
          font-size: 32rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #222222;
          margin-top: 5rpx;
        }
      }
    }
  }

  .main {
    .item-title {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #222222;
      line-height: 50rpx;
      padding: 22rpx 25rpx;
      border-bottom: 1rpx solid #e6e6e6;
    }
  }
}

._btns {
  width: 100%;
  height: 64rpx;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #f08200;
  box-sizing: border-box;
  justify-content: flex-end;
  padding: 0 40rpx;

  .btn_item {
    display: flex;
    align-items: baseline;
    margin-left: 25px;
  }
}

.tag-btns-view {
  position: relative;
  display: inline;
  color: #f08200;
  background-color: none;
  font-size: 28rpx;
  border: none;
  padding: 0;
}

.tag-btns-view::after {
  border: none !important;
}

uni-button::after {
  border: none !important;
}

.blue {
  color: #1278ff;
}

.green {
  color: #52c41a;
}

.yellow {
  color: #f08200;
}

.red {
  color: #e60000;
}
</style>
