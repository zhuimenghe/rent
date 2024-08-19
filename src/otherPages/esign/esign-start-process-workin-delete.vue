<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap"
      >启动电签流程</c-nav-bar-btns
    >
    <view class="head-container">
      <view class="item-row">
        <text class="head-tag">业务模型</text>
        <text class="head-value">{{ modelType }}</text>
      </view>
      <view class="head-right">
        <view class="head-right-text">{{ flowState }}</view>
      </view>
    </view>
    <view
      class="middle-container"
      :style="{
        'margin-bottom': isStart ? '56px' : '0px',
        padding: flowList && flowList.length > 0 ? '10px 0px' : '0px',
      }"
    >
      <view
        v-if="documentState == '1'"
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          padding: 16px 0px;
        "
      >
        当前网络不稳定，请尝试手动
        <view
          style="color: #e60000; margin-left: 4px"
          @click="refreshDocument('2')"
          >刷新</view
        >
      </view>
      <view v-if="documentState == '2'">
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
            <view style="margin-top: 8px" v-if="item.signerTypeName"
              >{{ item.signerTypeName }}
            </view>
            <view class="right-item">
              <text>签署人：{{ item.signerName }} </text>
              <!-- <text>{{item.verify}} </text> -->
              <text :class="item.verify ? 'isVerified' : 'unVerified'">{{
                item.verify ? "（已认证）" : "（未认证）"
              }}</text></view
            >

            <view class="right-item" v-if="item.userObj"
              >手机号：{{ item.userObj.phoneNum }}
            </view>
            <view class="right-item" v-else="item.phoneNum"
              >手机号：{{ item.phoneNum }}
            </view>
            <view
              style="margin-top: 8px"
              v-if="
                item.actorIndentityType == '1' &&
                item.signerAuthorizedAccountName
              "
            >
              签署主体：{{ item.signerAuthorizedAccountName }}
              <span :class="item.orgVerified ? 'isVerified' : 'unVerified'">{{
                item.orgVerified ? "(已认证)" : "(未认证)"
              }}</span>
            </view>

            <view style="color: #e60000" @click="deleteItem(item, index)"
              >删除</view
            >
          </view>
        </view>
        <view
          class="addBtn"
          v-if="isStart && documentState == '2'"
          @click="addFlowUser"
        >
          新增签署人
        </view>
      </view>
      <view
        style="border-top: 1px solid #efefef"
        v-if="businessType == 'contract' || businessType == 'contractPlus'"
      >
        <imgupload
          :isupload="false"
          :imgFinishlist="fileList ? fileList : []"
        />
      </view>
    </view>
    <view class="bottom-container">
      <view class="reset-btn" @click="reload">重新加载</view>
      <view class="reset-btn" @click="reset">清除流程</view>
      <view class="btn" @click="submitFrom">启动</view>
    </view>
    <!-- 新增签署人 -->
    <view class="pop-container" style="z-index: 600">
      <uni-popup ref="flowDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">新增签署人</view>
          <view class="row-item">
            <view class="row-tag">
              <span style="color: #ff0000">*</span>
              签署方
            </view>
            <view
              @click.stop="showPick('signatory')"
              class="select-style"
              :style="{
                color: flowUserObj.signerTypeName ? '#333333' : '#999999',
              }"
            >
              <view class="select-text">{{
                flowUserObj.signerTypeName
                  ? flowUserObj.signerTypeName
                  : "签署方"
              }}</view>
              <i
                class="iconfont iconarrow-down"
                style="color: #999999; padding: 2px"
              ></i>
            </view>
            <!-- <selectView :value='flowUserObj.signerTypeName' hint='签署方' backgroundColor="#ffffff" textColor="#333333"
						 @clickSelect="showPick('signatory')" /> -->
          </view>
          <view
            class="row-item"
            v-if="flowUserObj && flowUserObj.signerType != 'leaseholder'"
          >
            <view class="row-tag">
              客户类型
              <span style="color: #ff0000">*</span>
            </view>
            <radio-group @change="radioChange($event, 'customer')">
              <label
                class="radio"
                v-for="(item, index) in customerTypeList"
                :key="index"
              >
                <radio
                  :value="item.value"
                  :checked="
                    flowUserObj.customerType &&
                    flowUserObj.customerType == item.value
                  "
                  color="#E60000"
                />
                {{ item.label }}
              </label>
            </radio-group>
          </view>
          <view class="row-item">
            <view class="row-tag">
              签署类型
              <span style="color: #ff0000">*</span>
            </view>
            <radio-group @change="radioChange($event, 'type')">
              <label
                class="radio"
                v-for="(item, index) in actorIndentityTypeList"
                :key="index"
              >
                <radio
                  :value="item.value"
                  :checked="flowUserObj.actorIndentityType == item.value"
                  color="#E60000"
                />
                {{ item.label }}
              </label>
            </radio-group>
          </view>
          <view
            class="row-item"
            v-if="
              flowUserObj &&
              ((flowUserObj.signerType == 'thirdParty' &&
                flowUserObj.customerType == 'enterprise') ||
                (flowUserObj.signerType != 'thirdParty' &&
                  flowUserObj.actorIndentityType == '1'))
            "
          >
            <view class="row-tag">
              签署主体
              <span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('organization')"
              class="select-style"
              :style="{
                color: flowUserObj.signerOrgNameLabel ? '#333333' : '#999999',
              }"
            >
              <view class="select-text">{{
                flowUserObj.signerOrgNameLabel
                  ? flowUserObj.signerOrgNameLabel
                  : "请选择签署主体"
              }}</view>
              <i
                class="iconfont iconarrow-down"
                style="color: #999999; padding: 2px"
              ></i>
            </view>
            <!-- <selectView :value='flowUserObj.signerOrgNameLabel?flowUserObj.signerOrgNameLabel:""' hint='请选择签署主体'
						 backgroundColor="#ffffff" textColor="#333333" @clickSelect="showPick('organization')" /> -->
          </view>
          <view class="row-item">
            <view class="row-tag">
              签署人
              <span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('signer')"
              class="select-style"
              :style="{
                color: flowUserObj.signerLabel ? '#333333' : '#999999',
              }"
            >
              <view class="select-text">{{
                flowUserObj.signerLabel
                  ? flowUserObj.signerLabel
                  : "请选择签署人"
              }}</view>
              <i
                class="iconfont iconarrow-down"
                style="color: #999999; padding: 2px"
              ></i>
            </view>
            <!-- <selectView :value='flowUserObj.signerLabel?flowUserObj.signerLabel:""' hint='请选择签署人' backgroundColor="#ffffff"
						 textColor="#333333" @clickSelect="showPick('signer')" /> -->
          </view>
          <view
            class="row-item"
            v-if="
              flowUserObj &&
              flowUserObj.signerType != 'thirdParty' &&
              flowUserObj.actorIndentityType != '1'
            "
          >
            <view class="row-tag">
              人员类型
              <span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('personType')"
              class="select-style"
              :style="{ color: flowUserObj.personType ? '#333333' : '#999999' }"
            >
              <view class="select-text">{{
                flowUserObj.personTypeName ? flowUserObj.personTypeName : ""
              }}</view>
              <i
                class="iconfont iconarrow-down"
                style="color: #999999; padding: 2px"
              ></i>
            </view>
          </view>
          <view
            class="tip-subtitle"
            v-if="
              flowUserObj.actorIndentityType == '1' &&
              flowUserObj.orgObj &&
              !flowUserObj.orgObj.verify
            "
          >
            当前所选的签署人成功认证该企业后，将成为该企业在租赁系统的电子签章管理员
          </view>
          <!-- <view class="row-item">
						<view class="row-tag">
							签署日期<span style="color: #FF0000;">*</span>
						</view>
						<radio-group @change="radioChange($event,'date')">
							<label class="radio">
								<radio value="0" checked="true" color="#E60000" />自动生成</label>
							<label class="radio">
								<radio value="1" color="#E60000" />手动填写</label>
						</radio-group>
					</view> -->
          <view class="uni-tip-group-button">
            <text
              class="uni-tip-button pop-cancel"
              @click="cancelDialog('sign')"
              >取消</text
            >
            <text
              class="uni-tip-button pop-confirm"
              @click="confirmDialog('sign')"
              >确定</text
            >
          </view>
        </view>
      </uni-popup>
    </view>
    <!-- 新增签署人确认 -->
    <view class="pop-container" style="z-index: 800">
      <uni-popup ref="secondConfirmDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">签署人信息确认</view>
          <view class="tip-subtitle" v-if="confirmUserInfo.msg">{{
            confirmUserInfo.msg
          }}</view>
          <select-label-item
            tagName="签署主体"
            v-if="
              confirmUserInfo &&
              ((confirmUserInfo.signerType == 'thirdParty' &&
                confirmUserInfo.customerType == 'enterprise') ||
                (confirmUserInfo.signerType != 'thirdParty' &&
                  confirmUserInfo.actorIndentityType == '1'))
            "
            :isRequired="false"
            :value="confirmUserInfo.signerAuthorizedAccountName || '-'"
            :isSelect="false"
          />
          <select-label-item
            tagName="手机号"
            :isRequired="false"
            :value="confirmUserInfo.mobile || '-'"
            :isSelect="false"
          />
          <select-label-item
            tagName="姓名"
            :isRequired="false"
            :value="confirmUserInfo.name || '-'"
            :isSelect="false"
          />
          <select-label-item
            tagName="身份证件号"
            :isRequired="false"
            :value="confirmUserInfo.idCardNum || '-'"
            :isSelect="false"
          />
          <view class="uni-tip-group-button">
            <text
              class="uni-tip-button pop-cancel"
              @click="cancelDialog('secondConfirm')"
              >取消</text
            >
            <text
              class="uni-tip-button pop-confirm"
              @click="confirmDialog('secondConfirm')"
              >确定</text
            >
          </view>
        </view>
      </uni-popup>
    </view>
    <!-- 签署人列表确认 -->
    <view class="pop-container" style="z-index: 800">
      <uni-popup ref="sysDataPop" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title">签署人信息确认</view>
          <view
            v-for="(item, pos) in sysList"
            :key="pos"
            style="
              border: 1px dotted #eeeeee;
              border-radius: 4px;
              padding: 6px;
              margin-top: 8px;
              font-size: 14px;
            "
          >
            <view>
              <view style="flex: 1">
                签署方：{{ item.signerTypeName || "--" }}
              </view>

              <view style="flex: 1">
                签署人：{{ item.signerName || "--" }}&nbsp;{{
                  item.verify ? "(已认证)" : "(未认证)"
                }}
              </view>
              <view style="flex: 1"> 手机号：{{ item.phoneNum || "--" }} </view>
            </view>
            <view v-if="item.actorIndentityType == 1" style="margin-top: 4px">
              签署主体：{{ item.signerAuthorizedAccountName || "--" }}&nbsp;{{
                item.orgVerified ? "(已认证)" : "(未认证)"
              }}
            </view>
          </view>
          <view class="uni-tip-group-button">
            <text
              class="uni-tip-button pop-cancel"
              @click="cancelDialog('sysDataPop')"
              >取消</text
            >
            <text
              class="uni-tip-button pop-confirm"
              @click="confirmDialog('sysDataPop')"
              >确定</text
            >
          </view>
        </view>
      </uni-popup>
    </view>

    <multiple-select
      v-model="showMultiple"
      :data="multipleList"
      :default-selected="defaultSelected"
      @confirm="onConfirmMultiple"
    />

    <wPicker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      :pickControl="true"
      themeColor="#E60000"
    />
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import multipleSelect from "@/components/common/multipleSelect/multipleSelect.vue";

import jsonList from "./esignList.json";
export default {
  components: {
    labelArrow,
    imgupload,
    uniPopup,
    selectView,
    wPicker,
    selectLabelItem,
    multipleSelect,
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
      businessId: "",
      businessNo: "",
      businessType: "contract",
      businessTitle: "",
      fileList: [],
      selectList: [],
      downloadTask: null,
      uploadTask: null,
      flowUserObj: {
        signType: "0",
        actorIndentityType: "0", //签约主体类型 : 0-个人，1:公章
        authorizedOrgId: "", //签署企业id  actorIndentityType=1的时候传值
        signerAuthorizedAccountName: "", //签署企业 actorIndentityType=1的时候传值
        signerUserId: "", //签署人账号
        signerName: "", //签署人名称
        signerType: "leaseholder", //leaseholder=租赁房  tenantry=承租方    thirdParty=其他
        signerTypeName: "租赁方（甲方）",
        verify: true, //是否检验当前选中人或机构，
        signDateBeanType: 0, // 签署日期  0=禁止   1=必须   （2=可选)
        customerType: "", //personal=个人  enterprise=企业
        postionList: [],
      },
      signerTypeList: [
        {
          value: "leaseholder",
          label: "租赁方（甲方）",
        },
        {
          value: "tenantry",
          label: "承租方（乙方）",
        },
        {
          value: "thirdParty",
          label: "其他",
        },
      ],
      actorIndentityTypeList: [
        {
          value: "0",
          label: "个人",
        },
        {
          value: "1",
          label: "公章",
        },
      ],
      customerTypeList: [
        {
          value: "enterprise",
          label: "企业客户",
        },
        {
          value: "personal",
          label: "个人客户",
        },
      ],
      flowList: [],
      pickType: "",
      leaseeList: [], //租赁房数据list
      organizationList: [], //签署主体list
      signerList: [], //签署人
      customerId: "",
      contactId: "",
      customerSalesman: "",
      userOrganization: {}, //租赁商的认证内容
      docId: "",
      documentUrl: "",
      flowId: "",
      flowState: "",
      fileId: "",
      documentState: "1",
      //模板数据
      templateList: [],
      customerName: "",
      customerSalesmanName: "",
      isShowTip: true,
      confirmUserInfo: {}, //弹框确定时的用户信息
      sysList: [], //配置的流程列表
      leaseholderListDef: [],
      tenantryListDef: [],
      leaseholderPersonTypes: [],
      tenantryPersonTypes: [],
      showMultiple: false,
      multipleList: [],
      defaultSelected: [],
    };
  },
  onLoad(option) {
    this.setTag("0", "0");
    this.isStart = option.isStart == "true" ? true : false;
    this.customerId = option.customerId ? option.customerId : "";
    this.contactId = option.contactId ? option.contactId : "";
    this.customerSalesman = option.customerSalesman
      ? option.customerSalesman
      : "";
    this.customerName = option.customerName ? option.customerName : "";
    this.customerSalesmanName = option.customerSalesmanName
      ? option.customerSalesmanName
      : "";
    this.businessNo = option.businessNo ? option.businessNo : "";
    this.businessId = option.businessId ? option.businessId : "";
    this.businessType = option.businessType ? option.businessType : "";
    this.businessTitle = option.businessTitle ? option.businessTitle : "";
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
    console.log(option);
    let obj = uni.getStorageSync(this.$savekey.TENANT_DETAIL);
    if (obj) {
      this.userOrganization = {
        value: obj.esignId,
        label: `${obj.organizationName} ${
          obj.signerOrgVerified ? "(已认证)" : "(未认证)"
        }  `,
        name: obj.organizationName,
        id: obj.id,
        esignId: obj.esignId ? obj.esignId : "",
        orgVerified: obj.signerOrgVerified ? true : false,
      };
    }
    let userObj = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
    if (userObj) {
      this.userOrganization = {
        ...this.userOrganization,
        createBy: userObj.id ? userObj.id : "",
      };
    }

    this.loadLeaseholderPersonType(); //人员类型租赁商
    this.loadTenantryPersonType();

    this.getLeaseeData();
    this.getRentalDetail(); //租赁商信息
    this.uploadFile("2"); //获取文件
    this.getFlowAttacmentData(); //附件新增流程查看
  },
  methods: {
    onNavBarButtonTap() {
      if (this.documentState == "2") {
        this.getPdfView();
      } else {
        this.refreshDocument();
      }
    },
    //电签租赁方人员类型
    loadLeaseholderPersonType() {
      this.$network
        .loadType("leaseholder_person_type")
        .then((result) => {
          this.leaseholderPersonTypes = [...result];
        })
        .catch((err) => {});
    },
    //电签承租方人员类型
    loadTenantryPersonType() {
      this.$network
        .loadType("tenantry_person_type")
        .then((result) => {
          this.tenantryPersonTypes = [...result];
        })
        .catch((err) => {});
    },
    refreshDocument(isOpen) {
      if (!this.docId) {
        uni.showModal({
          title: "提示",
          content: "获取E签宝签署文档失败，请关闭该页面后，重新启动电签流程",
          confirmText: "确定",
          showCancel: false,
          success: (res) => {
            if (res.cancel) {
            } else {
              uni.navigateBack();
            }
          },
        });
      } else {
        this.getFileDetail(isOpen);
      }

      //
    },
    //新增时获取的数据
    getConfig() {
      let param = {
        componentId: "signatureFlowLayout",
        businessType: this.businessType,
      };
      uni.showLoading();
      this.$network
        .getData(this.$url.CONFIG_SYS_DETAIL, "GET", param)
        .then((result) => {
          uni.hideLoading();
          this.templateList =
            result && result.configValue ? JSON.parse(result.configValue) : [];
          let configList =
            result && result.configValue ? JSON.parse(result.configValue) : [];
          //流程配置
          this.templateList = configList.map((o) => {
            if (o.postionList) {
              return {
                ...o,
              };
            } else {
              let dict = {
                isFlow: o.isFlow,
                signer: o.signer,
                signerType: o.signerType,
                actorIndentityType: o.actorIndentityType,
                postionList: [
                  {
                    ex: o.ex,
                    ey: o.ey,
                    px: o.px,
                    py: o.py,
                    personType: o.personType,
                    keyWord: o.keyWord,
                    signDateBeanType: o.signDateBeanType,
                  },
                ],
              };
              return dict;
            }
          });
          // //默认取json文件中
          // this.templateList = jsonList;
          if (this.templateList.length > 0) {
            this.getDefaultList()
              .then((obj) => {
                if (obj.result) {
                  this.flowList = obj.data.map((o, index) => {
                    return {
                      ...o,
                      userObj: {
                        phoneNum: o.phoneNum,
                      },
                      order: index + 1,
                    };
                  });
                } else {
                  this.sysList =
                    obj.data && obj.data.length > 0
                      ? obj.data.map((o, index) => {
                          return {
                            ...o,
                            order: index + 1,
                          };
                        })
                      : [];
                  console.log(this.sysList);
                  console.log("this.flowUserObj");
                  if (this.sysList.length > 0) {
                    this.$refs.sysDataPop.open();
                  } else {
                    uni.showToast({
                      icon: "none",
                      title: "暂无流程配置信息",
                    });
                  }
                }
                this.flowUserObj = {
                  ...this.flowUserObj,
                  ...this.getKeyWord(
                    this.flowUserObj.signerType,
                    this.flowUserObj.personType,
                    this.flowUserObj.actorIndentityType
                  ),
                };
              })
              .catch((err) => {
                uni.showToast({
                  title: err.msg,
                  icon: "none",
                });
              });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    updateDefEsign() {
      //更新租赁方信息
      this.$network
        .getData(
          this.$url.ESIGN_DEFAULT_USER_UPDATE,
          "POST",
          this.leaseholderListDef
        )
        .then((result) => {})
        .catch((err) => {});
      //更新承租方信息
      this.$network
        .getData(
          this.$url.ESIGN_DEFAULT_CUSTOMER_UPDATE,
          "POST",
          this.tenantryListDef
        )
        .then((result) => {})
        .catch((err) => {});
    },
    //根据配置项默认显示配置某班
    getDefaultList() {
      return new Promise(async (resolve, reject) => {
        let tipMsg = "";
        let customerObj = await this.$network.getData(
          this.$url.CUSRTOMER_DETAIL + this.customerId,
          "GET",
          null
        );
        let list = [];
        let configList = this.templateList.filter(
          (o) =>
            o.isFlow &&
            !(
              customerObj.type == 2 &&
              o.signerType == "tenantry" &&
              o.actorIndentityType == 1
            ) &&
            o.signerType != "thirdParty"
        );
        //流程改动后改动的地方
        configList = configList.map((o, index) => {
          return {
            ...o,
            uuid: index,
            actorIndentityType: o.actorIndentityType, //0：个人；1:公章
            signerType: o.signerType,
            signDateBeanType: o.signDateBeanType,
            customerType:
              o.signerType == "tenantry"
                ? customerObj.type == 1
                  ? "enterprise"
                  : "personal"
                : undefined, //1：企业
            signerTypeName:
              o.signerType == "leaseholder"
                ? "租赁方（甲方）"
                : o.signerType == "tenantry"
                ? "承租方（乙方）"
                : "其他",
            position: {
              ...o.position,
            },
          };
        });
        let userListParam = [];
        let customerListParam = [];
        for (let i = 0; i < configList.length; i++) {
          if (configList[i].signerType == "leaseholder") {
            userListParam = [
              ...userListParam,
              {
                type: configList[i].actorIndentityType == 1 ? "1" : "2",
                userId: this.customerSalesman,
                uuid: configList[i].uuid,
              },
            ];
          }
          if (configList[i].signerType == "tenantry") {
            customerListParam = [
              ...customerListParam,
              {
                type:
                  customerObj.type == 1
                    ? configList[i].actorIndentityType == 0
                      ? "3"
                      : "1"
                    : "2",
                customerId: this.customerId,
                uuid: configList[i].uuid,
                customerContactId: this.contactId,
              },
            ];
          }
        }
        this.leaseholderListDef = await this.$network.getData(
          this.$url.ESIGN_DEFAULT_USER_LIST,
          "POST",
          userListParam
        );
        this.tenantryListDef = await this.$network.getData(
          this.$url.ESIGN_DEFAULT_CUSTOMER_LIST,
          "POST",
          customerListParam
        );
        let defList = [];
        if (this.leaseholderListDef && this.leaseholderListDef.length > 0) {
          defList = [...this.leaseholderListDef];
        }
        if (this.tenantryListDef && this.tenantryListDef.length > 0) {
          defList = [...defList, ...this.tenantryListDef];
        }
        defList = defList.sort((x, y) => {
          if (x.uuid < y.uuid) {
            return -1;
          }
          if (x.uuid > y.uuid) {
            return 1;
          }
          return 0;
        });
        console.log(defList);
        console.log(configList);
        console.log("defList-----------------------");
        //改动接收方式
        defList = defList.map((o) => {
          let obj = configList.find((x) => x.uuid == o.uuid);
          return {
            ...(obj ? { ...obj } : {}),
            orgVerified:
              o.esignOrgDto && o.esignOrgDto.verifyStatus == "2" ? true : false,
            verify:
              o.esignUserDto && o.esignUserDto.verifyStatus == "2"
                ? true
                : false,
            signerAuthorizedAccountName:
              o.esignOrgDto && o.esignOrgDto.name
                ? o.esignOrgDto.name
                : o.orgName
                ? o.orgName
                : "",
            authorizedOrgId:
              o.esignOrgDto && o.esignOrgDto.esignId
                ? o.esignOrgDto.esignId
                : "",
            signerName:
              o.esignUserDto && o.esignUserDto.name
                ? o.esignUserDto.name
                : o.userName
                ? o.userName
                : "",
            signerUserId:
              o.esignUserDto && o.esignUserDto.esignId
                ? o.esignUserDto.esignId
                : "",
            phoneNum:
              o.esignUserDto && o.esignUserDto.mobile
                ? o.esignUserDto.mobile
                : "",
          };
        });
        defList = defList.map((o) => {
          let postionList = o.postionList ? o.postionList : [];
          postionList = postionList.map((p) => {
            return {
              ...p,
              personTypeName: this.getPersonTypeName(p.personType),
            };
          });
          return {
            ...o,
            postionList: [...postionList],
          };
        });
        //企业客户时公章 两个都认证；
        console.log(defList);
        console.log("企业客户时公章 两个都认证");
        if (
          defList.every(
            (o) =>
              (o.customerType &&
                o.customerType == "enterprise" &&
                o.actorIndentityType == 1 &&
                o.verify &&
                o.orgVerified) ||
              ((!o.customerType ||
                o.customerType == "personal" ||
                o.actorIndentityType == 0) &&
                o.verify)
          )
        ) {
          //每一个都认证通过
          resolve({
            result: true,
            data: defList,
          });
        } else {
          //只要有一个未认证通过
          resolve({
            result: false,
            data: defList,
          });
        }
      });
    },
    getPersonTypeName(personType) {
      let list = [...this.leaseholderPersonTypes, ...this.tenantryPersonTypes];
      let obj = list.find((x) => x.value == personType);
      return obj.label;
    },
    getPersonType(itme) {
      let postionList = itme.postionList ? itme.postionList : [];
      let personType = "";
      postionList.forEach((o) => {
        if (personType == "") {
          personType = o.personTypeName;
        } else {
          personType = personType + "," + o.personTypeName;
        }
      });
      return personType;
    },
    //设置右上角电钮
    setTag(width, state) {
      this.documentState = state;
      let text = "";
      switch (state) {
        case "1":
          text = "刷新文档";
          break;
        case "2":
          text = "查看文档";
          break;
        default:
          break;
      }
      // #ifdef APP-PLUS
      let webView = this.$mp.page.$getAppWebview();
      webView.setTitleNViewButtonStyle(0, {
        width: width,
        text: text,
      });
      // #endif
      // #ifndef APP-PLUS
      this.navBtns =
        width == "auto"
          ? [
              {
                text: text,
                type: "none",
                fontSize: "14px",
                color: "#E60000",
                width: "auto",
              },
            ]
          : [];
      // #endif
    },
    /**
     * 获取文件详情
     * @param {Object} isOpen 1:打开弹框；2：请求配置
     */
    getFileDetail(isOpen) {
      uni.showLoading({
        mask: false,
      });
      this.$network
        .getData(
          this.$url.ESIGN_FLOW_DOC_ONING.replace(/{docId}/, this.docId),
          "GET"
        )
        .then((result) => {
          uni.hideLoading();
          this.fileId = result ? result.fileId : "";
          this.downloadUrl = result.downloadUrl;
          console.log(this.downloadUrl);
          //判断是否生成了pdf文件
          if (result.downloadUrl.indexOf(".pdf?") != -1) {
            this.setTag("auto", "2");
            if (isOpen == "1") {
              //打开新增弹框
              this.$refs.flowDialog.open();
            }
            //不管是否生成pdf，都去读取配置
            if (isOpen == "2") {
              //读取配置
              this.getConfig();
            }
          } else {
            this.setTag("auto", "1");
            if (isOpen) {
              uni.showToast({
                icon: "none",
                title: "文档未生成，请刷新文档",
              });
            }
          }
        })
        .catch((err) => {
          uni.hideLoading();
          this.setTag("auto", "1");
          if (isOpen) {
            uni.showToast({
              icon: "none",
              title: "文档未生成，请刷新文档",
            });
          }
        });
    },
    //新增时获取的数据
    uploadFile(isOpen) {
      uni.showLoading();
      let param = {
        businessId: this.businessId,
        businessTitle: this.businessTitle,
        businessType: this.businessType,
        initiatorAuthorizedOrgId: this.userOrganization.esignId,
      };
      let url = this.getUrlUploadFile();
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.docId = result ? result.docId : "";
          this.documentUrl =
            result && result.downloadUrl ? result.downloadUrl : "";
          this.businessType = result ? result.docType : "contract";
          if (this.docId) {
            //延时请求pdf
            setTimeout(() => {
              uni.hideLoading();
              this.getFileDetail(isOpen);
            }, 5000);
          }
        })
        .catch((err) => {
          uni.hideLoading();
          this.setTag("auto", "1");
          uni.showToast({
            icon: "none",
            title: err.message ? err.message : "",
          });
        });
    },
    getRentalDetail() {
      let url = this.$url.ESGIN_RENTAL_DETAIL.replace(
        /{id}/,
        this.userOrganization.value
      );
      this.$network
        .getData(url, "GET")
        .then((result) => {
          this.userOrganization = {
            ...this.userOrganization,
            vertify: result && result.verified ? true : false,
          };
        })
        .catch((err) => {});
    },
    //附件-新增流程时查看
    getFlowAttacmentData() {
      let url = this.getUrlAttachment(this.$url.ESIGN_ATTACHMENT_URL).replace(
        /{businessNo}/,
        this.businessNo
      );
      this.$network
        .getData(url, "GET")
        .then((result) => {
          this.fileList = result
            ? result.map((o) => {
                return {
                  ...o,
                  url: o.url ? o.url : "",
                };
              })
            : [];
        })
        .catch((err) => {});
    },
    /**租赁方
     */
    getLeaseeData() {
      let param = {
        type:
          this.flowUserObj &&
          this.flowUserObj.actorIndentityType &&
          this.flowUserObj.actorIndentityType == "1"
            ? "1"
            : "2", //2:个人：公章
      };
      this.$network
        .getData(this.$url.ESIGN_USER_PERMISSION_URL, "POST", param)
        .then((result) => {
          console.log(result,1234431);
          this.organizationList = [this.userOrganization];
          if (
            this.flowUserObj.actorIndentityType == "1" &&
            result.records.some((o) => o.adminBoolean)
          ) {
            //公章
            this.signerList = [];
            if (result && result.records && result.records.length > 0) {
              result.records.forEach((o) => {
                if (o.adminBoolean) {
                  this.signerList = [
                    ...this.signerList,
                    {
                      ...o,
                      label: o.canVerify ?`${o.username}(已认证)` : `${o.username}(未认证)`,
                      value: o.esignId,
                      name: o.username,
                      verify: o.verified,
                    },
                  ];
                }
              });
            }
          } else {
            this.signerList =
              result && result.records
                ? result.records.map((o) => {
                    return {
                      ...o,
                      label: o.canVerify ?`${o.username}(已认证)` : `${o.username}(未认证)`,
                      value: o.esignId,
                      name: o.username,
                      verify: o.canVerify,
                    };
                  })
                : [];
          }
          this.setFlowOrg();
          this.filterSignerList();
        })
        .catch((err) => {
          this.signerList = [];
          this.organizationList = [];
          this.setFlowOrg();
          this.filterSignerList();
        });
    },
    //承租方\其他方
    getOtherData() {
      let param = {
        type:
          this.flowUserObj &&
          this.flowUserObj.customerType &&
          this.flowUserObj.customerType == "enterprise"
            ? "1"
            : "2", //2:个人：1公章
        customerEntityId:
          this.flowUserObj && this.flowUserObj.signerType == "tenantry"
            ? this.customerId
            : undefined,
      };
      this.$network
        .getData(this.$url.ESIGN_OTHNER_CUSTOMTER_URL, "GET", param)
        .then((result) => {
          if (
            this.flowUserObj &&
            this.flowUserObj.customerType &&
            this.flowUserObj.customerType == "enterprise"
          ) {
            //企业客户
            this.organizationList =
              result && result.length > 0
                ? result.map((o) => {
                    return {
                      ...o,
                      label: o.verify ?`${o.name}(已认证)`: `${o.name}(未认证)`,
                      value: o.esignId,
                    };
                  })
                : [];
            if (this.organizationList && this.organizationList.length > 0) {
              this.setSignerListByOrg(this.organizationList[0]);
              this.filterSignerList();
            } else {
              this.signerList = [];
              this.organizationList = [];
              this.setSignerListByOrg();
              this.filterSignerList();
            }
          } else {
            this.organizationList = [];
            this.signerList =
              result && result.length > 0
                ? result.map((o) => {
                    return {
                      ...o,
                      label: o.verify ? `${o.name}(已认证)` : `${o.name}(未认证)`,
                      value: o.esignId,
                    };
                  })
                : [];
            this.filterSignerList();
          }
          this.setFlowOrg();
        })
        .catch((err) => {
          this.signerList = [];
          this.organizationList = [];
          this.setFlowOrg();
          this.filterSignerList();
        });
    },
    //处理选中公司的signerList
    setSignerListByOrg(orgObj) {
      this.signerList = [];
      if (
        orgObj &&
        orgObj.customerContactEntityDtos &&
        orgObj.customerContactEntityDtos.length > 0
      ) {
        //公章并且有管理员显示管理员，个人章或没有管理员显示所有联系人
        if (
          this.flowUserObj.actorIndentityType == "1" &&
          orgObj.customerContactEntityDtos.some((o) => o.adminBoolean)
        ) {
          orgObj.customerContactEntityDtos.forEach((o) => {
            if (o.adminBoolean) {
              this.signerList = [
                ...this.signerList,
                {
                  ...o,
                  label: o.verify ? `${o.name}(已认证)`: `${o.name}(未认证)`,
                  value: o.esignId,
                },
              ];
            }
          });
        } else {
          this.signerList =
            orgObj &&
            orgObj.customerContactEntityDtos &&
            orgObj.customerContactEntityDtos.length > 0
              ? orgObj.customerContactEntityDtos.map((o) => {
                  return {
                    ...o,
                    label: o.verify ?`${o.name}(已认证)` : `${o.name}(未认证)`,
                    value: o.esignId,
                  };
                })
              : [];
        }
      }
    },

    showPick(type) {
      this.pickType = type;
      switch (type) {
        case "signatory": //签署方
          this.selectList = this.signerTypeList;
          break;
        case "organization": //签署主体
          this.selectList = this.organizationList ? this.organizationList : [];
          break;
        case "signer": //签署人
          this.selectList = this.signerList ? this.signerList : [];
          break;
        case "personType":
          if (this.flowUserObj.signerType == "leaseholder") {
            //租赁方
            this.multipleList = this.leaseholderPersonTypes
              ? this.leaseholderPersonTypes
              : [];
          } else if (this.flowUserObj.signerType == "tenantry") {
            //承租方
            this.multipleList = this.tenantryPersonTypes
              ? this.tenantryPersonTypes
              : [];
          }
          break;
        default:
          break;
      }
      if (type == "personType") {
        if (this.multipleList.length > 0) {
          console.log(this.multipleList);
          this.showMultiple = !this.showMultiple;
        } else {
          uni.showToast({
            icon: "none",
            title: "暂无数据",
          });
        }
      } else {
        if (this.selectList.length > 0) {
          this.$refs.selector.show();
        } else {
          uni.showToast({
            icon: "none",
            title: "暂无数据",
          });
        }
      }
    },
    onConfirmMultiple(val) {
      if (val.length == 0) {
        uni.showToast({
          icon: "none",
          title: "至少存在一个人员类型",
        });
        return;
      }
      this.defaultSelected = val.map((o) => {
        return o.value;
      });
      this.showMultiple = false;
      console.log(this.defaultSelected);
      let personTypeStr = "";
      let personTypeNameStr = "";
      val.forEach((o) => {
        if (personTypeStr == "") {
          personTypeStr = o.value;
        } else {
          personTypeStr = personTypeStr + "," + o.value;
        }
        if (personTypeNameStr == "") {
          personTypeNameStr = o.label;
        } else {
          personTypeNameStr = personTypeNameStr + "," + o.label;
        }
      });
      this.flowUserObj = {
        ...this.flowUserObj,
        personTypeName: personTypeNameStr,
        personType: personTypeStr,
        ...this.getKeyWord(
          this.flowUserObj.signerType,
          personTypeStr,
          this.flowUserObj.actorIndentityType
        ),
      };
      console.log(this.flowUserObj);
      console.log("this.flowUserObj");
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "signatory": //签署方
          this.flowUserObj = {
            ...this.flowUserObj,
            ...val.checkArr,
            signerTypeName: val.checkArr.label,
            signerType: val.checkArr.value,
            actorIndentityType: "0",
            customerType: "",
            personTypeName: "",
            personType: "",
            ...this.getKeyWord(val.checkArr.value, "", "0"),
          };
          if (this.flowUserObj.signerType != "leaseholder") {
            this.flowUserObj = {
              ...this.flowUserObj,
              customerType: "personal",
            };
          }
          //选择签署方后初始化签章类型
          if (
            this.flowUserObj.customerType &&
            this.flowUserObj.customerType == "personal"
          ) {
            this.actorIndentityTypeList = [
              {
                value: "0",
                label: "个人",
              },
            ];
          } else {
            this.actorIndentityTypeList = [
              {
                value: "0",
                label: "个人",
              },
              {
                value: "1",
                label: "公章",
              },
            ];
          }
          this.signerList = [];
          this.organizationList = [];
          this.defaultSelected = [];
          this.setFlowOrg();
          this.filterSignerList();
          this.$refs.selector.hide();
          this.getChangeData();
          break;
        case "organization": //签署主体
          // if (val.checkArr.disabled) {
          // 	uni.showToast({
          // 		title: '不可选',
          // 		icon: 'none'
          // 	})
          // 	return;
          // }
          this.flowUserObj = {
            ...this.flowUserObj,
            signerAuthorizedAccountName: val.checkArr.name,
            authorizedOrgId: val.checkArr.value,
            signerOrgNameLabel: val.checkArr.label,
            signerName: "",
            signerUserId: "",
            orgObj: {
              ...val.checkArr,
            },
          };
          //如果是第三方机构的公章就根据机构选择签署人
          if (
            this.flowUserObj &&
            this.flowUserObj.signerType != "leaseholder" &&
            this.flowUserObj.customerType == "enterprise"
          ) {
            this.setSignerListByOrg(val.checkArr);
            this.filterSignerList();
          }
          this.$refs.selector.hide();
          break;
        case "signer": //签署人
          // if (val.checkArr.disabled) {
          // 	uni.showToast({
          // 		title: '不可选',
          // 		icon: 'none'
          // 	})
          // 	return;
          // }
          this.flowUserObj = {
            ...this.flowUserObj,
            verify: val.checkArr.verify,
            signerName: val.checkArr.name,
            signerUserId: val.checkArr.value,
            signerLabel: val.checkArr.label,
            userObj: {
              ...val.checkArr,
            },
          };
          this.$refs.selector.hide();
          break;
        case "personType":
          console.log(val.checkArr);
          this.flowUserObj = {
            ...this.flowUserObj,
            personTypeName: val.checkArr.label,
            personType: val.checkArr.value,
            ...this.getKeyWord(
              this.flowUserObj.signerType,
              val.checkArr.value,
              this.flowUserObj.actorIndentityType
            ),
          };
          console.log(this.flowUserObj);
          this.$refs.selector.hide();
          break;
        default:
          break;
      }
    },
    radioChange(e, type) {
      switch (type) {
        case "type":
          this.flowUserObj = {
            ...this.flowUserObj,
            personTypeName: "",
            personType: "",
            actorIndentityType: e.detail.value,
          };
          this.defaultSelected = [];
          this.getChangeData();
          break;
        case "date":
          this.flowUserObj = {
            ...this.flowUserObj,
            signDateBeanType: e.detail.value,
          };

          break;
        case "customer":
          this.flowUserObj = {
            ...this.flowUserObj,
            customerType: e.detail.value,
            actorIndentityType: "0",
          };
          if (this.flowUserObj.customerType == "personal") {
            this.actorIndentityTypeList = [
              {
                value: "0",
                label: "个人",
              },
            ];
          } else {
            this.actorIndentityTypeList = [
              {
                value: "0",
                label: "个人",
              },
              {
                value: "1",
                label: "公章",
              },
            ];
          }
          this.getChangeData();
          break;

        default:
          break;
      }
    },
    getChangeData() {
      if (this.flowUserObj && this.flowUserObj.signerType == "leaseholder") {
        this.getLeaseeData();
      } else {
        this.getOtherData();
      }
    },
    //默认签署人
    filterSignerList() {
      if (this.signerList && this.signerList.length > 0) {
        let salesman = this.signerList[0];
        //租赁方去查找业务负责人
        if (
          this.flowUserObj.signerType == "leaseholder" &&
          this.flowUserObj.actorIndentityType == "0"
        ) {
          let findObj = this.signerList.find(
            (o) => o.id && o.id == this.customerSalesman
          );
          salesman = findObj ? findObj : salesman;
        }
        this.flowUserObj = {
          ...this.flowUserObj,
          name: salesman.name,
          signerName: salesman.name,
          signerLabel: salesman.label,
          signerUserId: salesman.value,
          verify: salesman.verify,
          userObj: {
            ...salesman,
          },
        };
      } else {
        this.flowUserObj = {
          ...this.flowUserObj,
          signerName: "",
          signerUserId: "",
          signerLabel: "",
          verify: false,
          userObj: undefined,
        };
      }
    },
    setFlowOrg() {
      if (this.organizationList && this.organizationList.length > 0) {
        this.flowUserObj = {
          ...this.flowUserObj,
          signerAuthorizedAccountName: this.organizationList[0].name,
          signerOrgNameLabel: this.organizationList[0].label,
          authorizedOrgId: this.organizationList[0].value,
          orgObj: {
            ...this.organizationList[0],
          },
        };
      } else {
        this.flowUserObj = {
          ...this.flowUserObj,
          signerAuthorizedAccountName: "",
          authorizedOrgId: "",
          signerOrgNameLabel: "",
          orgObj: undefined,
        };
      }
    },
    addFlowUser() {
      if (this.documentState == "2") {
        this.$refs.flowDialog.open();
      } else {
        this.getFileDetail("1");
      }
    },
    cancelDialog(type) {
      switch (type) {
        case "secondConfirm":
          this.$refs.secondConfirmDialog.close();
          break;
        case "sign":
          this.flowUserObj = {
            actorIndentityType: "0", //签约主体类型 : 0-个人，1:公章
            authorizedOrgId: "", //签署企业id  actorIndentityType=1的时候传值
            signerAuthorizedAccountName: "", //签署企业 actorIndentityType=1的时候传值
            signerUserId: "", //签署人账号
            signerName: "", //签署人名称
            signerType: "leaseholder", //leaseholder=租赁房  tenantry=承租方    thirdParty=其他
            signerTypeName: "租赁方",
            verify: true, //是否检验当前选中人或机构，
            signDateBeanType: 0, // 签署日期  0=禁止   1=必须   （2=可选)
            //"customerType": "enterprise" //personal=个人  enterprise=企业
          };
          this.getLeaseeData();
          this.$refs.flowDialog.close();
          break;
        case "sysDataPop":
          this.$refs.sysDataPop.close();
          break;
        default:
          break;
      }
    },
    confirmDialog(type) {
      switch (type) {
        case "sign":
          if (!this.flowUserObj || !this.flowUserObj.signerType) {
            uni.showToast({
              icon: "none",
              title: "请选择租赁方",
            });
            return;
          }
          if (!this.flowUserObj || !this.flowUserObj.signerName) {
            uni.showToast({
              icon: "none",
              title: "请选择签署人",
            });
            return;
          }

          if (
            !this.flowUserObj ||
            !this.flowUserObj.actorIndentityType ||
            (this.flowUserObj.actorIndentityType == "1" &&
              !this.flowUserObj.signerAuthorizedAccountName)
          ) {
            uni.showToast({
              icon: "none",
              title: "请选择签署主体",
            });
            return;
          }
          if (
            this.flowUserObj &&
            this.flowUserObj.signerType != "thirdParty" &&
            this.flowUserObj.actorIndentityType != "1" &&
            !this.flowUserObj.personType
          ) {
            uni.showToast({
              icon: "none",
              title: "请选择人员类型",
            });
            return;
          }
          if (this.flowUserObj.actorIndentityType == "1") {
            this.getOrgInfo();
          } else {
            this.getSignUserInfo();
          }
          break;
        case "secondConfirm":
          this.$refs.secondConfirmDialog.close();
          this.$refs.flowDialog.close();
          let obj = {};
          if (!this.flowUserObj.positionList || this.positionList.length == 0) {
            obj = {
              ...this.getKeyWord(
                this.flowUserObj.signerType,
                this.flowUserObj.personType,
                this.flowUserObj.actorIndentityType
              ),
            };
          }
          this.flowUserObj = {
            ...this.flowUserObj,
            ...obj,
            order: this.flowList ? this.flowList.length + 1 : 1,
          };
          if (this.flowUserObj.orgObj) {
            this.flowUserObj.orgVerified = this.flowUserObj.orgObj.verify;
          }
          console.log(this.flowUserObj);
          this.flowList = this.flowList
            ? [...this.flowList, this.flowUserObj]
            : [this.flowUserObj];

          console.log(this.flowList);
          console.log("-----------------------");

          this.updateUserInfo();
          if (this.flowUserObj.actorIndentityType == 1) {
            if (this.flowUserObj.signerType != "leaseholder") {
              this.updateOrgInfo();
            } else {
              // this.updateRentalOrgInfo();ssssssssssssssssssssss
            }
          }
          break;
        case "sysDataPop":
          this.flowList = [...this.sysList];
          this.$refs.sysDataPop.close();
          this.updateDefEsign();
          break;
        default:
          break;
      }
    },
    getOrgInfo() {
      let param = {
        idNumber:
          this.flowUserObj.orgObj && this.flowUserObj.orgObj.idNumber
            ? this.flowUserObj.orgObj.idNumber
            : undefined,
        idType:
          this.flowUserObj.orgObj && this.flowUserObj.orgObj.idType
            ? this.flowUserObj.orgObj.idType
            : undefined,
        name:
          this.flowUserObj.orgObj && this.flowUserObj.orgObj.name
            ? this.flowUserObj.orgObj.name
            : undefined,
        // orgVerified:
        //   this.flowUserObj.orgObj && this.flowUserObj.orgObj.orgVerified
        //     ? true
        //     : false,
      };
      this.$network
        .getData(this.$url.ESGIN_FIND_ORG_USER_INFO, "POST", param)
        .then((res) => {
          this.confirmUserInfo = {
            ...this.flowUserObj,
            signerAuthorizedAccountName:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? res.name
                : `${res.name}(未认证)`,
          };
          this.flowUserObj = {
            ...this.flowUserObj,
            authorizedOrgId: res.esignId,
            // signerAuthorizedAccountName: res.name,
          };
          this.getSignUserInfo(true);
        })
        .catch((err) => {
          this.getSignUserInfo();
        });
    },
    getSignUserInfo(isOrg) {
      let param = {
        idCardNum:
          this.flowUserObj.userObj && this.flowUserObj.userObj.identity
            ? this.flowUserObj.userObj.identity
            : undefined,
        idCardType:
          this.flowUserObj.userObj && this.flowUserObj.userObj.identity
            ? "CRED_PSN_CH_IDCARD"
            : undefined,
        mobileNum:
          this.flowUserObj.userObj && this.flowUserObj.userObj.phoneNum
            ? this.flowUserObj.userObj.phoneNum
            : undefined,
        name:
          this.flowUserObj.userObj && this.flowUserObj.userObj.name
            ? this.flowUserObj.userObj.name
            : undefined,
      };
      this.$network
        .getData(this.$url.ESGIN_FIND_USER_INFO, "POST", param)
        .then((res) => {
          this.confirmUserInfo = {
            ...this.flowUserObj,
            ...(isOrg ? { ...this.confirmUserInfo } : null),
            ...res,
            verify:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? true
                : false,
            signerName:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? res.name
                : `${res.name}(未认证)`,
          };
          this.flowUserObj = {
            ...this.flowUserObj,
            signerUserId: res.esignId,
            verify:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? true
                : false,
            signerName: res.name ? res.name : this.flowUserObj.signerName,
          };
          this.$refs.secondConfirmDialog.open();
        })
        .catch((err) => {});
    },
    updateUserInfo() {
      let param = {
        id:
          this.flowUserObj.userObj && this.flowUserObj.userObj.id
            ? this.flowUserObj.userObj.id
            : undefined,
        esignId: this.flowUserObj.signerUserId
          ? this.flowUserObj.signerUserId
          : undefined,
      };
      let url = this.$url.USER_INFO;
      if (this.flowUserObj.signerType == "leaseholder") {
        //租赁方更新员工信息
        url = this.$url.USER_INFO;
      } else {
        //其他签署方
        if (this.flowUserObj.customerType == "personal") {
          //个人客户更新个人信息
          url = this.$url.LINKMAN_PERSON_CREAT;
        } else {
          //企业时更新联系人的信息
          url = this.$url.LINKMAN_PERSON_CONNECT_UPDATE;
        }
      }

      this.$network
        .getData(url, "PUT", param)
        .then((result) => {})
        .catch((err) => {});
    },
    updateOrgInfo() {
      let param = {
        esignId: this.flowUserObj.authorizedOrgId
          ? this.flowUserObj.authorizedOrgId
          : undefined,
        id: this.flowUserObj.orgObj.id, //LINKMAN_PERSON_CREAT
        // type: "2" //企业
      };
      this.$network
        .getData(this.$url.LINKMAN_PERSON_CREAT, "PUT", param)
        .then((result) => {})
        .catch((err) => {});
    },
    updateRentalOrgInfo() {
      let param = {
        esignId: this.flowUserObj.authorizedOrgId
          ? this.flowUserObj.authorizedOrgId
          : undefined,
        id: this.flowUserObj.orgObj.id,
      };
      this.$network
        .getData(this.$url.UPDATE_RENANT_USER, "PUT", param)
        .then((result) => {})
        .catch((err) => {});
    },
    //获取关键字
    getKeyWord(signerType, personType, actorIndentityType) {
      let objItem = {};
      let keyWordPostionList = [];
      if (personType && personType != "") {
        //存在personType必定为个人章
        let personTypeList = personType.split(",");
        if (personTypeList.length > 0) {
          let newList = [];
          this.templateList.forEach((p) => {
            let postionList = p.postionList ? p.postionList : [];
            if (postionList.length > 0) {
              let newP = postionList.map((o) => {
                return {
                  ...p,
                  ...o,
                  postionList: undefined,
                };
              });
              newList = newList.concat(newP);
            } else {
              let item = {
                ...p,
                postionList: undefined,
              };
              newList.push(item);
            }
          });
          console.log(newList);
          console.log(actorIndentityType);
          personTypeList.forEach((o) => {
            console.log(o);
            let obj = newList.find(
              (a) =>
                a.signerType == signerType &&
                a.personType == o &&
                a.actorIndentityType == actorIndentityType
            );
            if (obj) {
              let itemObj = {
                ex: obj.ex,
                ey: obj.ey,
                px: obj.px,
                py: obj.py,
                personType: obj.personType,
                personTypeName: this.getPersonTypeName(obj.personType),
                keyWord: obj.keyWord,
                signDateBeanType: obj.signDateBeanType,
              };
              keyWordPostionList.push(itemObj);
            } else {
              let noObj = {};
              switch (signerType) {
                case "leaseholder":
                  noObj = {
                    keyWord: "甲方（签章）",
                    personType: o,
                    personTypeName: this.getPersonTypeName(o),
                  };
                  break;
                case "tenantry":
                  noObj = {
                    keyWord: "乙方（签章）",
                    personType: o,
                    personTypeName: this.getPersonTypeName(o),
                  };
                  break;
                default:
                  noObj = {
                    keyWord: "乙方保证人（签章）",
                    personType: o,
                    personTypeName: this.getPersonTypeName(o),
                  };
                  break;
              }
              keyWordPostionList.push(noObj);
            }
          });
        }
      } else {
        let isHaveObj = this.templateList.find(
          (o) =>
            o.signerType == signerType &&
            o.actorIndentityType == actorIndentityType
        );
        if (isHaveObj) {
          let postionList = isHaveObj.postionList ? isHaveObj.postionList : [];
          keyWordPostionList = keyWordPostionList.concat(postionList);
        } else {
          let noObj = {};
          switch (signerType) {
            case "leaseholder":
              noObj = {
                keyWord: "甲方（签章）",
                personType: "",
              };
              break;
            case "tenantry":
              noObj = {
                keyWord: "乙方（签章）",
                personType: "",
              };
              break;
            default:
              noObj = {
                keyWord: "乙方保证人（签章）",
                personType: "",
              };
              break;
          }
          keyWordPostionList.push(noObj);
        }
      }
      console.log(keyWordPostionList);
      console.log("isHaveObj");
      objItem = {
        postionList: [...keyWordPostionList],
      };
      console.log(objItem);
      return objItem;
    },
    reset() {
      this.flowList = [];
    },
    reload() {
      if (this.documentState == "2") {
        this.getConfig();
      } else {
        this.refreshDocument("2");
      }
    },
    submitFrom() {
      if (!this.flowList || this.flowList.length <= 0) {
        uni.showToast({
          icon: "none",
          title: "请添加签署人",
        });
        return;
      }
      if (this.documentState == "2") {
        this.setPosition();
      } else {
        uni.showToast({
          title: "文档未生成，无法启动流程，请刷新文档",
          icon: "none",
        });
      }
    },
    //设置印章位置
    setPosition() {
      uni.showLoading({
        mask: true,
      });
      let kList = [];
      //通过遍历postionList获取keyWord
      console.log(this.templateList);
      console.log(this.flowList);
      if (this.templateList.length > 0) {
        this.templateList.forEach((o) => {
          let postionList = o.postionList ? o.postionList : [];
          postionList.forEach((p) => {
            if (!kList.some((x) => x == p.keyWord)) {
              kList.push(p.keyWord);
            }
          });
        });
      } else {
        this.flowList.forEach((o) => {
          let postionList = o.postionList ? o.postionList : [];
          postionList.forEach((p) => {
            if (!kList.some((x) => x == p.keyWord)) {
              kList.push(p.keyWord);
            }
          });
        });
      }
      let keyWords = kList.join(",");
      setTimeout(() => {
        let param = {
          fileId: this.fileId,
          keyWords: keyWords,
        };
        this.$network
          .getData(this.$url.ESGIN_SEARCH_WORDS_POSTION, "GET", param)
          .then((res) => {
            console.log("--333-");
            this.dealSubmitData(res);
          })
          .catch((err) => {
            console.log("---");
            this.submitData();
          });
      }, 100);
    },
    dealSubmitData(res) {
      if (res && res.length > 0) {
        this.flowList = this.flowList.map((o) => {
          let postionList = o.postionList ? o.postionList : [];
          postionList = postionList.map((p) => {
            let area = {};
            let esign = res.find((x) => x.keyword == p.keyWord);
            //------------------------------positionList---------------------------------
            if (esign && esign.positionList && esign.positionList.length > 0) {
              //------------------------------positionList---------------------------------
              let position = esign.positionList[esign.positionList.length - 1];
              if (
                position &&
                position.coordinateList &&
                position.coordinateList.length > 0
              ) {
                let pos =
                  position.coordinateList[position.coordinateList.length - 1];
                area = {
                  assignedPosbean: true,
                  signType: 1,
                  posBean: {
                    posPage: position.pageIndex,
                    posX: pos.posx,
                    posY: pos.posy,
                  },
                };
              }
            } else {
              area = {
                assignedPosbean: false,
                signType: 1,
                posBean: {
                  posPage: 1,
                  posX: 0,
                  posY: 0,
                },
              };
            }
            return {
              ...p,
              ...area,
            };
          });
          return {
            ...o,
            postionList: [...postionList],
          };
        });
      }
      this.submitData();
    },
    submitData() {
      console.log("this.submitData");
      // if (this.businessType == 'workIn') {
      // 	this.submitWorkIn();
      // } else {
      // 	this.submitOthers();
      // }
      this.submitWorkIn();
    },
    submitWorkIn() {
      // console.log(this.flowList);
      // console.log("--------------");
      this.flowList = this.flowList.map((o) => {
        let postionList = o.postionList ? o.postionList : [];
        let actorIndentityType = o.actorIndentityType;
        postionList = postionList.map((p) => {
          if (p.posBean && p.assignedPosbean) {
            let oldposBean = {
              ...p.posBean,
            };
            let deviationX =
              actorIndentityType == "1"
                ? p.ex
                  ? p.ex
                  : 78
                : p.px
                ? p.px
                : 100;
            let posX = oldposBean.posX + deviationX;
            // Y轴 坐标偏移量  个人章只要偏移 个人章半径大小即可
            let deviationY =
              actorIndentityType == "1" ? (p.ey ? p.ey : 78) : p.py ? p.py : 46;
            let posY = 0;
            if (deviationY > oldposBean.posY) {
              posY = deviationY + 20;
            } else {
              posY =
                oldposBean.posY -
                deviationY +
                (actorIndentityType == "1" ? 50 : 0);
            }
            return {
              ...p,
              posBean: {
                ...p.posBean,
                posX: posX,
                posY: posY,
              },
            };
          } else {
            return {
              ...p,
              // posBean:undefined
            };
          }
        });
        return {
          ...o,
          postionList: [...postionList],
        };
      });
      let fromList = [];
      this.flowList.forEach((o) => {
        console.log(o);
        let postionList = o.postionList ? o.postionList : [];
        let signfields = postionList.map((p) => {
          return {
            actorIndentityType: o.actorIndentityType,
            authorizedOrgId: o.authorizedOrgId ? o.authorizedOrgId : undefined,
            signerAuthorizedAccountName: o.signerAuthorizedAccountName
              ? o.signerAuthorizedAccountName
              : undefined,
            signDateBeanType: p.signType,
            signType: p.signType,
            signerUserId: o.signerUserId,
            signerName: o.signerName,
            signerType: o.signerType,
            customerType: o.customerType,
            personType: p.personType,
            personTypeName: p.personTypeName,
            uuid: o.uuid ? o.uuid.toString() : undefined,
            keyWord: p.keyWord,
            assignedPosbean: p.assignedPosbean,
            posBean: {
              ...p.posBean,
            },
          };
        });
        let itemDic = {
          signOrder: o.order,
          signfields: [...signfields],
        };
        fromList.push(itemDic);
      });
      let UploadFilelist = [];
      if (this.fileList && this.fileList.length > 0) {
        UploadFilelist = this.fileList.map((o) => {
          return {
            attachmentName: o.name,
            downloadUrl: o.url,
          };
        });
      }
      let param = {
        signers: [...fromList],
        attachmentList:
          UploadFilelist.length > 0 ? [...UploadFilelist] : undefined,
        businessId: this.businessId,
        businessTitle: this.businessTitle,
        businessType: this.businessType,
        docId: this.docId, //,1300991525216043009
        createBy: this.userOrganization.createBy,
        initiatorAuthorizedOrgId: this.userOrganization.esignId,
      };
      console.log(param);
      // ESIGN_START_WORKIN_FLOW
      // return
      this.$network
        .getData(this.$url.ESIGN_START_WORKIN_FLOW, "POST", param)
        .then((result) => {
          uni.showToast({
            icon: "none",
            title: "电签启动成功",
          });
          setTimeout(() => {
            uni.$emit("esign-start");
            uni.navigateBack({
              delta: 1,
            });
          }, 1000);
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details ? err.details[0] : err.message,
          });
        });
    },
    submitOthers() {
      let proList = [];
      let FromDataList = this.flowList.map((o) => {
        return {
          ...(o.postionList && o.postionList.length > 0
            ? o.postionList[0]
            : {}),
          signerType: o.signerType,
          actorIndentityType: o.actorIndentityType,
          uuid: o.uuid,
          customerType: o.customerType,
          signerAuthorizedAccountName: o.signerAuthorizedAccountName,
          authorizedOrgId: o.authorizedOrgId,
          signerName: o.signerName,
          signerUserId: o.signerUserId,
          order: o.order,
        };
      });
      FromDataList = FromDataList.map((o) => {
        return this.$datestr.abandonDictionary(o);
      });
      FromDataList.forEach((o) => {
        for (let pro in o) {
          //遍历对象的属性
          if (
            !proList.some((x) => x == pro) &&
            pro != "ex" &&
            pro != "ey" &&
            pro != "px" &&
            pro != "py" &&
            pro != "keyWord"
          ) {
            proList.push(pro);
          }
        }
      });
      let listObj = {};
      for (let i = 0; i < FromDataList.length; i++) {
        let actorIndentityType = FromDataList[i].actorIndentityType;
        proList.forEach((o) => {
          if (o != "posBean") {
            if (FromDataList[i][o]) {
              listObj["signFieldList[" + i + "]." + o] = FromDataList[i][o];
            }
          } else {
            let y = FromDataList[i].posBean;
            if (y) {
              listObj["signFieldList[" + i + "].posBean.posPage"] = y.posPage;
              // X轴 坐标偏移量  公章只要偏移 公章半径大小即可   个人章需要多偏移到 指定文本上面
              let deviationX =
                actorIndentityType == "1"
                  ? FromDataList[i].ex
                    ? FromDataList[i].ex
                    : 78
                  : FromDataList[i].px
                  ? FromDataList[i].px
                  : 100;
              let posX = y.posX + deviationX;

              // Y轴 坐标偏移量  个人章只要偏移 个人章半径大小即可
              let deviationY =
                actorIndentityType == "1"
                  ? FromDataList[i].ey
                    ? FromDataList[i].ey
                    : 78
                  : FromDataList[i].py
                  ? FromDataList[i].py
                  : 46;

              let posY = 0;
              if (deviationY > y.posY) {
                posY = deviationY + 20;
              } else {
                posY =
                  y.posY - deviationY + (actorIndentityType == "1" ? 50 : 0);
              }
              listObj["signFieldList[" + i + "].posBean.posY"] = posY;
              listObj["signFieldList[" + i + "].posBean.posX"] = posX;
            }
          }
        });
      }
      let attachmentlistObj = {};
      if (this.fileList && this.fileList.length > 0) {
        let alist = this.fileList.map((o) => {
          return {
            attachmentName: o.name,
            downloadUrl: o.url,
          };
        });
        let aproList = [];
        for (let pro in alist[0]) {
          //遍历对象的属性
          aproList.push(pro);
        }
        for (let i = 0; i < alist.length; i++) {
          aproList.forEach((o) => {
            attachmentlistObj["attachmentList[" + i + "]." + o] = alist[i][o];
          });
        }
      }

      let param = {
        ...listObj,
        ...attachmentlistObj,
        businessId: this.businessId,
        businessTitle: this.businessTitle,
        businessType: this.businessType,
        docId: this.docId, //,1300991525216043009
        createBy: this.userOrganization.createBy,
        initiatorAuthorizedOrgId: this.userOrganization.esignId,
      };
      this.$network
        .getData(this.$url.ESIGN_START_FLOW, "POST", param)
        .then((result) => {
          uni.hideLoading();
          uni.showToast({
            icon: "none",
            title: "启动成功",
          });
          uni.$emit("esign-start");
          uni.navigateBack({
            delta: 1,
          });
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: err.details[0] ? err.details[0] : err.message,
          });
        });
    },
    getPdfView() {
      uni.showLoading({
        title: "打开中...",
        mask: true,
      });
      let url = this.downloadUrl;
      console.log(url, "url");
      let urlhead = this.documentUrl.split("?")[0];
      console.log(urlhead);
      let listArr = urlhead.split(".");
      let footerstyle = listArr[listArr.length - 1];
      console.log(footerstyle);
      let filename = this.businessType + "." + footerstyle;
      // #ifdef APP-PLUS
      filename = "_doc/" + filename;
      // #endif
      this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
    },
    /**
     * 根据不同类型 返回不通服务接口
     * @param {Object} type
     * @param {Object} url
     */
    getUrlAttachment(url) {
      console.log(url);
      let model = "contract";
      let sevice = "contractapi";
      switch (this.businessType) {
        case "contract":
        case "contractPlus":
          model = "contract";
          sevice = "contractapi";
          break;
        case "settlement": //结算
          model = "settlement";
          sevice = "settleapi";
          break;
        case "statement": //对账
          model = "statement";
          sevice = "settleapi";
          break;
        case "workIn": //进场
          model = "workIn";
          sevice = "contractapi";
          break;
        case "workOut": //退场
          model = "workOut";
          sevice = "contractapi";
          break;
        default:
          break;
      }
      console.log(url.replace("contractapi", sevice));
      return `${sevice}/api/${model}/signAttachment?businessNo={businessNo}`;
    },
    /**    * 根据不同类型 返回不通服务接口
     * @param {Object} type
     * @param {Object} url
     */
    getUrlUploadFile() {
      let url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
      switch (this.businessType) {
        case "contract":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
          break;
        case "contractPlus":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_PLUS;
          break;
        case "settlement": //结算
          url = this.$url.ESIGN_UPLOADFILE_URL_SETTLE;
          break;
        case "statement": //对账
          url = this.$url.ESIGN_UPLOADFILE_URL_STATEMENT;
          break;
        case "workIn": //进场
          url = this.$url.ESIGN_UPLOADFILE_URL_WORK_IN;
          break;
        case "workOut": //退场
          url = this.$url.ESIGN_UPLOADFILE_URL_WORK_OUT;
          break;
        default:
          break;
      }
      return url;
    },
    deleteItem(item, index) {
      this.flowList.splice(index, 1);
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

.head-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  // position: fixed;
  top: 0px;
  left: 0px;
  padding: 8px;
  width: 100%;
  border-bottom: 1px solid $uni-bg-color-grey;
  background-color: #ffffff;
  z-index: 200;
}

.item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  // margin-top: 36px;
  margin-bottom: 76px;
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
  // border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
  padding: 8px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.right-item {
  margin: 10px 0;
  color: #929292;
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
  padding: 10px 0px;
  box-sizing: border-box;
  background-color: #ffffff;
}

.btn {
  flex: 3;
  background-color: $uni-color-primary;
  color: #ffffff;
  text-align: center;
  margin: 2px 8px;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 14px;
}

.reset-btn {
  flex: 2;
  background-color: #aaaaaa;
  color: #ffffff;
  text-align: center;
  margin: 2px 8px;
  border-radius: 16px;
  padding: 8px;
  font-size: 12px;
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

.tip-subtitle {
  color: #fca01f;
  font-size: $uni-font-size-sm;
  background-color: #fff8ee;
  padding: 4px 10px;
  margin: 10px 0px;
}

.select-style {
  flex: 1;
  max-width: calc(100% - 80px);
  height: 32px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  line-height: 32px;
  font-size: 14px;
  color: #333333;
  padding: 0px 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.select-text {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

.addBtn {
  font-size: $uni-font-size-sm;
  color: $uni-color-primary;
  border: 1px solid $uni-color-primary;
  width: 80px;
  height: 25px;
  border-radius: 6px;
  line-height: 25px;
  text-align: center;
  margin: 15px 20px;
}

.isVerified {
  color: $uni-color-success;
}
.unVerified {
  color: $uni-color-warning;
}
</style>
