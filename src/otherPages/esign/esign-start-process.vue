<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="flex-1" :style="{'margin-bottom': isStart ? '76px' : '0px',}">
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
          padding: flowList && flowList.length > 0 ? '10px 0px' : '0px',
        }"
      >
        <view style="overflow:auto">
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
              <view style="margin-top: 8px" v-if="item.signerType"
                >{{ item.signerType | signerTypeName }}
              </view>
              <view class="right-item">
                <text>签署人：{{ item.signerName || "-" }} </text>
                <!-- <text>{{item.userVerified}} </text> 
                p-->
                <text :class="item.verify ? 'isVerified' : 'unVerified'">{{
                  item.verify ? "（已认证）" : "（未认证）"
                }}</text>
              </view>

              <view class="right-item" v-if="item.userObj"
                >手机号：{{ item.userObj.phoneNum || "-" }}
              </view>
              <view class="right-item" v-else>手机号：{{ item.phoneNum || "-" }}
              </view>
              <view
                class="right-item"
                v-if="
                  item.actorIndentityType == '1' &&
                  item.signerAuthorizedAccountName
                "
              >
                签署主体：{{ item.signerAuthorizedAccountName || "-" }}
                <span :class="item.orgObj.verify ? 'isVerified' : 'unVerified'">{{
                  item.orgObj.verify ? "(已认证)" : "(未认证)"
                }}</span>
              </view>

              <view style="color: #e60000" @click="deleteItem(item, index)"
                >删除</view
              >
            </view>
          </view>
          <view class="addBtn" v-if="isStart" @click="addFlowUser">
            新增签署人
          </view>
        </view>
      </view>
      <view v-if="msg" class="text-warn padding">{{ msg }}</view>
    </view>
    <view class="actions-footer-flex">
      <view class="z-btn bg-warn radius" @click="getPdfView">预览</view>
      <view class="z-btn bg-primary radius" @click="submitForm" v-if="signFile">发起签署</view>
    </view>
    <view class="pop-container" style="z-index: 600">
      <uni-popup ref="flowDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"> 新增签署人 </view>
          <view class="row-item">
            <view class="row-tag">
              签署方<span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('signatory')"
              class="select-style"
              :style="{
                color: flowUserObj.signerType ? '#333333' : '#999999',
              }"
            >
              <view class="select-text" v-if="flowUserObj.signerType">
                {{ flowUserObj.signerType | signerTypeName}}
              </view>
              <view class="select-text" v-else>签署方</view>
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
              客户类型<span style="color: #ff0000">*</span>
            </view>
            <radio-group @change="radioChange($event, 'customer')">
              <label
                class="radio"
              >
                {{ customerTypeName }}
              </label>
            </radio-group>
          </view>
          <view class="row-item">
            <view class="row-tag">
              签署类型<span style="color: #ff0000">*</span>
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
                />{{ item.label }}
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
              签署主体<span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('organization')"
              class="select-style"
              :style="{
                color: flowUserObj.signerOrgNameLabel ? '#333333' : '#999999',
              }"
            >
              <view class="select-text">
                {{
                  flowUserObj.signerOrgNameLabel
                    ? flowUserObj.signerOrgNameLabel
                    : "请选择签署主体"
                }}
              </view>

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
              签署人<span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('signer')"
              class="select-style"
              :style="{
                color: flowUserObj.signerLabel ? '#333333' : '#999999',
              }"
            >
              <view class="select-text">
                {{
                  flowUserObj.signerLabel
                    ? flowUserObj.signerLabel
                    : "请选择签署人"
                }}
              </view>

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
              (businessType == 'workIn' || businessType == 'workOut') &&
              flowUserObj &&
              flowUserObj.signerType != 'thirdParty' &&
              flowUserObj.actorIndentityType != '1'
            "
          >
            <view class="row-tag">
              人员类型<span style="color: #ff0000">*</span>
            </view>
            <view
              @click.stop="showPick('personType')"
              class="select-style"
              :style="{ color: flowUserObj.personType ? '#333333' : '#999999' }"
            >
              <view class="select-text">
                {{
                  flowUserObj.personTypeName ? flowUserObj.personTypeName : ""
                }}
              </view>
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
            当前所选的签署人成功认证该企业后，将成为该企业在租赁系统的电子签章管理员</view
          >
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
    <view class="pop-container" style="z-index: 800">
      <uni-popup ref="secondConfirmDialog" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"> 签署人信息确认 </view>
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
    <view class="pop-container" style="z-index: 800">
      <uni-popup ref="sysDataPop" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"> 签署人信息确认 </view>
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
                签署方：{{ item.signerType | signerTypeName }}
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
    <wPicker
      :selectList="selectList"
      @confirm="onConfirm"
      mode="selector"
      ref="selector"
      :pickControl="true"
      themeColor="#E60000"
    />
    <!-- <web-view :src="url" v-if="hasUrl" fullscreen></web-view> -->
  </view>
</template>

<script>
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
const singerTypes = [
  {
    value: "leaseholder",
    label: "租赁方（甲方）",
  },
  {
    value: "tenantry",
    label: "承租方（乙方）",
  },
  {
    value: "guarantor",
    label: "保证人（乙方）",
  }
]
export default {
  components: {
    labelArrow,
    imgupload,
    uniPopup,
    selectView,
    wPicker,
    selectLabelItem,
  },
  data() {
    return {
      fileTotalPageCount:0,
      auths:[],
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
      selectList: [],
      downloadTask: null,
      uploadTask: null,
      url: "",
      hasUrl: false,
      flowUserObj: {
        signType: "0",
        actorIndentityType: "0", //签约主体类型 : 0-个人，1:公章
        authorizedOrgId: "", //签署企业id  actorIndentityType=1的时候传值
        signerAuthorizedAccountName: "", //签署企业 actorIndentityType=1的时候传值
        signerUserId: "", //签署人账号
        signerName: "", //签署人名称
        signerType: "leaseholder", //leaseholder=租赁房（甲方）  tenantry=承租方    thirdParty=其他  guarantor 合同保证人
        verify: true, //是否检验当前选中人或机构，
        signDateBeanType: 0, // 签署日期  0=禁止   1=必须   （2=可选)
        customerType: "", //personal=个人  enterprise=企业
        personType: "",
      },
      
      flowList: [],
      pickType: "",
      leaseeList: [], //租赁房数据list
      organizationList: [], //签署主体list
      signerList: [], //签署人
      customerId: "",
      contactId: "",
      customerSalesman: "",
      customerSalesmanPhoneNum: "",
      userOrganization: {},
      docId: "",
      documentUrl: "",
      flowId: "",
      flowState: "",
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
      organizationName: "",
      customerType: "",
      contactName: "",
      customerPhoneNum: "",
      phoneNum: "",
      esignId: "",
      signFlowTitle: "",
      signFile: false,
      identifier: "",
      positionList: [],
      keyword_a: {},
      keyword_b: {},
      keyword_b_gua: {},
      sysPostion: {},
      fromPath:'',
      msg:'',
      isMerge:false,
      mergeBusinessDto:null
    };
  },
  computed:{
    signerTypeList(){
      let list = [...singerTypes]
      if(this.businessType!='contract'){
        list.splice(2,1)
      }
      return list
    },
    customerTypeName(){
      return this.customerType=='1' ? "企业客户" : '个人客户'
    },
    actorIndentityTypeList(){
      let list = [{
        value: "0",
        label: "个人",
      }]
      // if(this.flowUserObj.signerType!='guarantor'&&(this.flowUserObj.signerType=='leaseholder'||this.customerType=='1')){
      //   list.push({
      //     value: "1",
      //     label: "公章",
      //   })
      // }
      if(!((this.customerType=='1'&&this.flowUserObj.signerType != "leaseholder")||this.flowUserObj.signerType == "guarantor")){
        list.push({
          value: "1",
          label: "公章",
        })
      }
      return list
    }
  },
  filters:{
    signerTypeName(signerType){
      let found = singerTypes.find(st=>st.value==signerType)
      return found ? found.label : '-'
    }
  },
  async onLoad(option) {
    this.isStart = option.isStart == "true" ? true : false;
    this.fromPath=option.fromPath||'';
    this.isMerge=option.isMerge=='true'?true:false;
    this.customerId = option.customerId ? option.customerId : "";
    this.contactId = option.contactId ? option.contactId : "";
    this.customerSalesman = option.customerSalesman
      ? option.customerSalesman
      : "";
    this.customerName = option.customerName ? option.customerName : "";
    this.customerSalesmanName = option.customerSalesmanName
      ? option.customerSalesmanName
      : "";
    this.customerSalesmanPhoneNum = option.customerSalesmanPhoneNum
      ? option.customerSalesmanPhoneNum
      : "";
    this.businessNo = option.businessNo ? option.businessNo : "";
    let  mergeBusinessDto=option.mergeBusinessDto?JSON.parse(option.mergeBusinessDto):null;
    this.mergeBusinessDto=this.isMerge?{...mergeBusinessDto,majorBusinessNo:this.businessNo||''}:mergeBusinessDto;
    this.contactName = option.contactName ? option.contactName : "";
    this.phoneNum = option.phoneNum ? option.phoneNum : "";
    this.customerPhoneNum = option.customerPhoneNum
      ? option.customerPhoneNum
      : "";
    this.customerType = option.customerType ? option.customerType : "";
    this.businessId = option.businessId ? option.businessId : "";
    this.contractNo = option.contractNo;
    this.businessType = option.businessType ? option.businessType : "";
    this.businessTitle = option.businessTitle ? option.businessTitle : "";
    this.signFlowTitle = option.signFlowTitle ? option.signFlowTitle : "";
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
    } else if (this.businessType == "claim") {
      this.modelType = "索赔";
    }

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
    console.log(userObj);
    this.identifier = userObj.lesseeInfo.identifier;
    if (userObj) {
      this.userOrganization = {
        ...this.userOrganization,
        createBy: userObj.id ? userObj.id : "",
      };
    }

    // this.getTenat();
    this.getLeaseeData();
    this.getRentalDetail();
    this.uploadFile();
    // 获取组织名称获取甲方默认
    
    this.getOrgName(option.orgId);
    await this.getContractAuths();
    // this.getSysPosition();
    // 获取乙方默认
    this.getDefault_Yi();
    this.getDefaultGuarantor();

    if (this.businessType == "workIn" || this.businessType == "workOut") {
      this.loadLeaseholderPersonType();
      this.loadTenantryPersonType();
    }
  },
  methods: {
    // 获取保证人
    async getContractAuths(){
      if(this.contractNo){
        this.auths = await this.$network.guarantors({contractNo:this.contractNo})
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
    //甲方公章（签署主体）列表
    getTenat() {
      this.$network
        .getData(this.$url.tenantPage, "POST", {
          current: 1,
          size: -1,
        })
        .then((result) => {
          this.organizationList = result.records.map((o) => {
            return {
              ...o,
              label: o.verified
                ? `${o.organizationName}(已认证)`
                : `${o.organizationName}(未认证)`,
              value: o.id,
              name: o.organizationName,
              verify: o.verified,
              orgVerified: o.signerOrgVerified,
            };
          });
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

    async getFileDetail() {
      let result = await this.$network
        .getData(
          this.$url.ESIGN_FLOW_DOC_ONING.replace(/{docId}/, this.docId),
          "GET"
        )
      this.documentUrl = result ? result.fileDownloadUrl : "";
      this.fileTotalPageCount=result ? result.fileTotalPageCount : 0;
    },
    //新增时获取的数据
    uploadFile() {
      uni.showLoading({
        mask: true,
      });
      let param = {
        businessId: this.businessId,
        businessTitle: this.businessTitle,
        businessType: this.isMerge?'esignMerge':this.businessType,
        initiatorAuthorizedOrgId: this.userOrganization.esignId,
        mergeBusinessDto:this.isMerge?this.mergeBusinessDto:null,
      };
      let url = this.getUrlUploadFile();
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          uni.hideLoading();

          this.signFile = true;
          this.docId = result ? result.docId : "";
          this.documentUrl = result ? result.downloadUrl : "";
          this.businessType = result ? result.docType : "contract";
          this.esignId = result ? result.esignId : "";
          setTimeout(() => {
            this.getPosition();
          }, 1000);
          console.log(this.esignId);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    //
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
            verify: result && result.verified ? true : false,
          };
        })
        .catch((err) => {});
    },
    /**租赁方 甲方 用户列表
     */
    getLeaseeData() {
      this.getTenat()
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
                      label: o.canVerify
                        ? `${o.username}(已认证)`
                        : `${o.username}(未认证)`,
                      value: o.esignId,
                      name: o.username,
                      verify: o.canVerify,
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
                      label: o.canVerify
                        ? `${o.username}(已认证)`
                        : `${o.username}(未认证)`,
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
          this.flowUserObj && this.flowUserObj.signerType != "leaseholder"
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
                      label: o.verify
                        ? `${o.name}(已认证)`
                        : `${o.name}(未认证)`,
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
                      label: o.verify
                        ? `${o.name}(已认证)`
                        : `${o.name}(未认证)`,
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
        // if (
        //   this.flowUserObj.actorIndentityType == "1" &&
        //   orgObj.customerContactEntityDtos.some((o) => o.adminBoolean)
        // ) {
        //   orgObj.customerContactEntityDtos.forEach((o) => {
        //     if (o.adminBoolean) {
        //       this.signerList = [
        //         ...this.signerList,
        //         {
        //           ...o,
        //           label: o.verify ? `${o.name}(已认证)` : `${o.name}(未认证)`,
        //           value: o.esignId,
        //         },
        //       ];
        //     }
        //   });
        // } else {
          this.signerList =
            orgObj &&
            orgObj.customerContactEntityDtos &&
            orgObj.customerContactEntityDtos.length > 0
              ? orgObj.customerContactEntityDtos.map((o) => {
                  return {
                    ...o,
                    label: o.verify ? `${o.name}(已认证)` : `${o.name}(未认证)`,
                    value: o.esignId,
                  };
                })
              : [];
        // }
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
          console.log(this.organizationList);
          break;
        case "signer": //签署人
          this.selectList = this.signerList ? this.signerList : [];
          break;
        case "personType":
          if (this.flowUserObj.signerType == "leaseholder") {
            //租赁方
            this.selectList = this.leaseholderPersonTypes
              ? this.leaseholderPersonTypes
              : [];
          } else if (this.flowUserObj.signerType == "tenantry") {
            //承租方
            this.selectList = this.tenantryPersonTypes
              ? this.tenantryPersonTypes
              : [];
          }
          break;
        default:
          break;
      }
      if (this.selectList.length > 0) {
        this.$refs.selector.show();
      } else {
        uni.showToast({
          icon: "none",
          title: "暂无数据",
        });
      }
    },
    onConfirm(val) {
      switch (this.pickType) {
        case "signatory": //签署方
          this.flowUserObj = {
            ...this.flowUserObj,
            ...val.checkArr,
            signerType: val.checkArr.value,
            actorIndentityType: "0",
            personType: "",
            personTypeName: "",
            customerType: "",
            ...this.getKeyWord(val.checkArr.value, ""),
          };
          if (this.flowUserObj.signerType != "leaseholder") {
            this.flowUserObj = {
              ...this.flowUserObj,
              customerType: this.customerType=='1' ? 'enterprise' : 'personal',
            };
          }
          this.signerList = [];
          this.organizationList = [];
          this.setFlowOrg();
          this.filterSignerList();
          ``;
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

          console.log(val, "----------------------");
          this.flowUserObj = {
            ...this.flowUserObj,
            signerAuthorizedAccountName: val.checkArr.name,
            orgVerified: val.checkArr.verify,
            authorizedOrgId: val.checkArr.value,
            signerOrgNameLabel: val.checkArr.label,
            // signerName: "",
            // signerUserId: "",
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
          this.flowUserObj = {
            ...this.flowUserObj,
            personTypeName: val.checkArr.label,
            personType: val.checkArr.value,
            ...this.getKeyWord(this.flowUserObj.signerType, val.checkArr.value),
          };
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
          this.getChangeData();
          break;

        default:
          break;
      }
    },
    //获取签署人列表
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
          orgVerified: this.organizationList[0].verify,
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
      this.$refs.flowDialog.open();
      // if (this.documentState == "2") {
      //   this.$refs.flowDialog.open();
      // } else {
      //   this.getFileDetail("1");
      // }
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
            (this.businessType == "workIn" || this.businessType == "workOut") &&
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
          let obj = this.getKeyWord(
            this.flowUserObj.signerType,
            this.flowUserObj.personType
          );
          this.flowUserObj = {
            ...this.flowUserObj,
            order: this.flowList ? this.flowList.length + 1 : 1,
            ...(this.keyWord ? { keyWord: this.keyWord } : obj),
          };
          if (this.flowUserObj.orgObj) {
            this.flowUserObj.orgVerified = this.flowUserObj.orgObj.verify;
          }
          this.flowList = this.flowList
            ? [...this.flowList, this.flowUserObj]
            : [this.flowUserObj];

          this.updateUserInfo();

          if (this.flowUserObj.actorIndentityType == 1) {
            if (this.flowUserObj.signerType != "leaseholder") {
              this.updateOrgInfo();
            } else {
              // this.updateRentalOrgInfo()
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
      };
      console.log(this.flowUserObj.orgObj, "  this.flowUserObj.orgObj ");
      this.$network
        .getData(this.$url.ESGIN_FIND_ORG_USER_INFO, "POST", param)
        .then((res) => {
          this.confirmUserInfo = {
            ...this.flowUserObj,
            signerAuthorizedAccountName:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? `${res.name}(已认证)`
                : `${res.name}(未认证)`,
          };
          this.flowUserObj = {
            ...this.flowUserObj,
            authorizedOrgId: res.esignId,
            orgVerified: res.verify,
            // signerAuthorizedAccountName: res.name,
          };
          this.getSignUserInfo(res);
        })
        .catch((err) => {
          this.getSignUserInfo();
        });
    },
    getSignUserInfo(orgData) {
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
            ...(orgData
              ? {
                  ...this.confirmUserInfo,
                }
              : null),
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
            orgId:orgData&&orgData.esignId,
            userId:res.esignId,
            signerUserId: res.esignId,
            verify:
              res.verifyStatus != null && res.verifyStatus == "2"
                ? true
                : false,
            // signerName: res.name ? res.name : this.flowUserObj.signerName,
          };
          this.$refs.secondConfirmDialog.open();
        })
        .catch((err) => {});
    },

    updateUserInfo() {
      console.log(this.flowUserObj, " this.flowUserObj");
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
    getKeyWord(signerType, personType) {
      let obj = {};
      let keyWord = "";
      let isHaveObj = null;
      if (!personType) {
        isHaveObj = this.templateList.find((o) => o.signerType == signerType);
      } else {
        isHaveObj = this.templateList.find(
          (o) => o.signerType == signerType && o.personType == personType
        );
      }
      if (isHaveObj && isHaveObj.keyWord) {
        obj = {
          keyWord: isHaveObj.keyWord,
          px: isHaveObj.px,
          py: isHaveObj.py,
          ex: isHaveObj.ex,
          ey: isHaveObj.ey,
        };
      } else {
        switch (signerType) {
          case "leaseholder":
            obj = {
              keyWord: "甲方（签章）",
            };
            break;
          case "tenantry":
            obj = {
              keyWord: "乙方（签章）",
            };
            break;
          default:
            obj = {
              keyWord: "乙方保证人（签章）",
            };
            break;
        }
      }
      return obj;
    },
    reset() {
      this.flowList = [];
    },
    // getSysPosition() {
    //   let url = this.$url.CUR_SYS_DICT;
    //   let param = {
    //     current: 1,
    //     size: 20,
    //     fuzzyParam: "sign_position",
    //   };
    //   this.$network.getData(url, "POST", param).then((res) => {
    //     let arr = res.records[0].value.split(",");
    //     this.sysPostion = {
    //       positionX: arr[0],
    //       positionY: arr[1],
    //     };
    //   });
    // },
    getPositionPage(id) {
      let url = `esignapi/api/eSign/esign/file/${id}`;
      return this.$network.getData(url, "GET");
    },
    getPosition() {
      let url = this.$url.CUR_SYS_DICT;
      let param = {
        current: 1,
        size: 20,
        fuzzyParam: this.getPositionKeyWord(),
      };
      this.$network
        .getData(url, "POST", param)
        .then((res) => {
          this.positionList = res.records;
          if (this.positionList.length > 0) {
            this.positionList.forEach((e) => {
              if (e.label == "keyword_a") {
                this.keywordPosition(e.value).then((res) => {
                  if (res) {
                    this.keyword_a = res;
                  }
                });
              }
              if (e.label == "keyword_b") {
                this.keywordPosition(e.value).then((res) => {
                  if (res) {
                    this.keyword_b = res;
                  }
                });
              }
              if (e.label == "keyword_b_gua") {
                this.keywordPosition(e.value).then((res) => {
                  if (res) {
                    this.keyword_b_gua = res;
                  }
                });
              }
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },

    async isAuto() {
      let orgId = "";
      // this.flowList.forEach((e, i) => {
      //   if (e.signerType == "leaseholder") {
      //     orgId = e.orgId || e.authorizedOrgId;
      //   }
      // });
      const findFirstWithTypeOne = (arr) => {
            return arr.find((element) => element.identityType =='PART_A');
        };
      let first=findFirstWithTypeOne(this.flowList)||{};
      let res = await this.$network.getData(`esignapi/api/external-auth/isAuto`, "GET", {
        identifier: this.identifier,
        orgId: first.orgId||null,
      });
      return !!res
    },
    getPositionKeyWord() {
      let type = this.businessType;
      switch (type) {
        case "contract":
          return "sign_keyword_contract";
        case "settlement":
          return "sign_keyword_settlement";
        case "workIn":
          return "sign_keyword_workIn";
        case "workOut":
          return "sign_keyword_workOut";
        default:
          return "sign_keyword_contract";
      }
    },

    checkBeforeSignOrg(orgInfo, userInfo, isAuto) {
      if (isAuto) {
        return this.$network.getData(
          `esignapi/api/eSign/check-before-sign`,
          "POST",
          {
            userId: userInfo.userId? userInfo.userId:userInfo.esignId,
            orgId: orgInfo.esignId,
            autoSign: true,
          }
        );
      } else {
        return this.$network.getData(
          `esignapi/api/eSign/check-before-sign`,
          "POST",
          {
            userId: orgInfo.adminId ? orgInfo.adminId : userInfo.userId? userInfo.userId:userInfo.esignId,
            orgId: orgInfo.esignId,
            autoSign: false,
          }
        );
      }
    },
    checkBeforeSignPsn() {
      let psn = {};
      this.flowList.forEach((e) => {
        if (e.indextype == "keyword_a" && e.actorIndentityType == "0") {
          psn = e;
        }
      });
      return this.$network.getData(
        `esignapi/api/eSign/check-before-sign`,
        "POST",
        {
          userId: psn.signerUserId,
        }
      );
    },
    getOrg() {
      let name = "";
      this.flowList.forEach((e, i) => {
        if (e.indextype == "keyword_a") {
          name = e.signerAuthorizedAccountName;
        }
      });
      return this.$network.getData(`esignapi/esign-org/findEx/user`, "POST", {
        leseeId: this.identifier,
        name,
      });
    },

    getAdminUser(id) {
      return this.$network.getData(`esignapi/esign-user/user/${id}`);
    },
    async submitForm() {
      await this.getFileDetail()
      if (!this.flowList || this.flowList.length <= 0) {
        uni.showToast({
          icon: "none",
          title: "请添加签署人",
        });
        return;
      } else {
        uni.showLoading();
        let newParams = {
          fileTotalPageCount:this.fileTotalPageCount,
          businessType: this.isMerge?'esignMerge':this.businessType,
          businessNo: this.businessNo,
          "title":this.isMerge?this.signFlowTitle +'【合并】': this.signFlowTitle + this.modelType,
          fileId: this.esignId,
          "autoSign": false,
          mergeBusinessDto:this.isMerge?this.mergeBusinessDto:null
        }

        this.flowList.forEach((e, i) => {
          switch (e.signerType) {
            case "leaseholder":
              e.identityType = 'PART_A'
              break;
            case "tenantry":
              e.identityType = 'PART_B'
              break;
            case "guarantor":
              e.identityType = 'CONTRACT_GUARANTOR'
              break;
            default:
              break;
          }
        });
        if(
          this.flowList.some((e) => {
            return e.identityType == "PART_A" && e.actorIndentityType == "1";
          })
        ){
          newParams.autoSign = await this.isAuto();
        }
        newParams.signers = this.flowList.map((f,i)=>{
          return {
            identityType:f.identityType,
            signerType:f.actorIndentityType,
            signOrder:i+1,
            phoneNum:f.userObj ? f.userObj.phoneNum : f.phoneNum,
            userId:f.userId,
            orgId:f.orgId,
            esignUserName:f.signerName
          }
        })

        let res = await this.$network.getData(this.$url.ESIGN_START_NEW, "POST", newParams)
        uni.hideLoading()
        uni.redirectTo({
          url:'/otherPages/esign/esign-start-success?businessNo='+this.businessNo+'&fromPath='+this.fromPath
        })
      }
    },
    keywordPosition(keyword) {
      let url = `esignapi/api/eSign/keyword-position`;
      let param = {
        keyword,
        fileId: this.esignId,
      };
      return this.$network.getData(url, "GET", param);
    },
    getDefaultList(data) {
      // 甲方
      // customerSalesmanName

      let param = {
        name: this.customerSalesmanName,
        mobileNum: this.customerSalesmanPhoneNum,
      };
      this.$network
        .getData(this.$url.ESGIN_FIND_USER_INFO, "POST", param)
        .then((res) => {
          let flowUserObj = {
            userId:res.esignId,
            orgId:data.esignId,
            signerName: this.customerSalesmanName,
            verify: res.verifyStatus == 0 ? false : true,
            userObj: {
              phoneNum: this.customerSalesmanPhoneNum,
            },
            signerType: "leaseholder",
            mobileNum: this.customerSalesmanPhoneNum,
            actorIndentityType: "1",
            signerAuthorizedAccountName: this.organizationName,
            orgObj: {
              verify: data.verifyStatus == 2 ? true : false,
            },
            order: 1,
            orgId: data.esignId,
          };

          this.$set(this.flowList, 0, flowUserObj);
        })
        .catch((err) => {
          uni.showToast({
            icon: "none",
            title: "请确认甲乙方信息是否正确",
          });
        });
    },
    getDefaultGuarantor(){
      // 如果是合并电签 并且单据中包括合同
      //获取默认合同保证人
        if((this.businessType=='contract'&&this.auths.contractGuarantorUser)||this.isMerge&&this.mergeBusinessDto.contractNo){
        let contactName = this.auths.contractGuarantorUser.name
        let phoneNum = this.auths.contractGuarantorUser.phoneNum
        this.findYiSigner('guarantor','0',contactName,phoneNum,3)
      }
    },
    getDefault_Yi() {
      let user = null
      if(!this.isMerge){
        switch (this.businessType) {
          case 'settlement':
            user = this.auths.settleUser
            break;
          case 'workIn':
          case 'workOut':
            user = this.auths.workInAndOutUser
            break;
          default:
            break;
        }
      }
      
      let actorIndentityType = !!user ? '0' : (this.customerType=='1' ? '1' :'0')
      user = user || {
        name:this.contactName,
        phoneNum:this.phoneNum
      }
      this.findYiSigner('tenantry',actorIndentityType,user.name,user.phoneNum,2)
    },
    findYiSigner(signerType,actorIndentityType,contactName,phoneNum,order) {
      //  个人
      if (actorIndentityType == "0") {
        let param = {
          name: contactName,
          mobileNum: phoneNum,
        };
        this.$network
          .getData(this.$url.ESGIN_FIND_USER_INFO, "POST", param)
          .then((res) => {
            let flowUserObj = {
              userId:res.esignId,
              signerName: contactName,
              verify: res.verifyStatus == 2 ? true : false,
              userObj: {
                phoneNum: phoneNum,
              },
              signerType,
              actorIndentityType: "0",
              order: 2,
              mobileNum: phoneNum,
            };
            this.$set(this.flowList, order-1, flowUserObj);
          })
          .catch((err) => {
            uni.showToast({
              icon: "none",
              title: "请确认甲乙方信息是否正确",
            });
          });
      }

      if (actorIndentityType == "1") {
        let param = {
          name: this.customerName,
        };
        let userParam = {
          name: contactName,
          mobileNum: phoneNum,
        };
        this.$network
          .getData(this.$url.ESGIN_FIND_ORG_USER_INFO, "POST", param)
          .then((res) => {
            this.$network
              .getData(this.$url.ESGIN_FIND_USER_INFO, "POST", userParam)
              .then((result) => {
                let flowUserObj = {
                  orgId:res.esignId,
                  userId:result.esignId,
                  signerName: contactName,
                  verify: result.verifyStatus == 2 ? true : false,
                  userObj: {
                    phoneNum: phoneNum,
                  },
                  signerType,
                  actorIndentityType: "1",
                  signerAuthorizedAccountName: this.customerName,
                  orgObj: {
                    verify: res.verifyStatus == 2 ? true : false,
                  },
                  order: 2,
                  mobileNum: phoneNum,
                };

                this.$set(this.flowList, order-1, flowUserObj);
              })
              .catch((err) => {
                uni.showToast({
                  icon: "none",
                  title: "请确认甲乙方信息是否正确",
                });
              });
          })
          .catch((err) => {});
      }
    },

    async getPdfView() {
      uni.showLoading({
        title: "打开中...",
        mask: true,
      });
      await this.getFileDetail()
      if(!this.documentUrl){
        return uni.showToast({
          icon: "none",
          title: "文档生成中，稍后重试",
        });
      }
      let url = this.documentUrl;
      let urlhead = this.documentUrl.split("?")[0];
      console.log(urlhead);
      let listArr = urlhead.split(".");
      let ext = listArr[listArr.length - 1];
      let filename = this.businessType + "." + ext;
      // #ifdef APP-PLUS
      filename = "_doc/" + filename;
      // #endif
      this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);

      // uni.showLoading({
      // 	title: '打开中...',
      // 	mask: true
      // });
      // if (this.downloadTask) {
      // 	this.downloadTask.abort();
      // }
      // this.downloadTask = uni.downloadFile({
      // 	url: this.documentUrl,
      // 	success: res => {
      // 		let filePath = res.tempFilePath;
      // 		uni.openDocument({
      // 			filePath: filePath,
      // 			fileType: 'pdf',
      // 			success: function(res) {
      // 				uni.hideLoading();

      // 			},
      // 			fail: error => {
      // 				uni.showToast({
      // 					icon: 'none',
      // 					title: '打开失败'
      // 				});
      // 			}
      // 		});
      // 	},
      // 	fail: error => {
      // 		uni.showToast({
      // 			icon: 'none',
      // 			title: '打开失败'
      // 		});
      // 	}
      // });
    },
    /**
     * 根据不同类型 返回不通服务接口
     * @param {Object} type
     * @param {Object} url
     */
    getUrlAttachment(url) {
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
      return `${sevice}/api/${model}/signAttachment?businessNo={businessNo}`;
    },
    /**
     * 根据不同类型 返回不通服务接口
     * @param {Object} type
     * @param {Object} url
     */
    getUrlUploadFile() {
      let url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
      switch (this.businessType) {
        case "contract":
          this.isMerge?url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_MERGE:url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT;
          break;
        case "contractPlus":
          url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_PLUS;
          break;
        case "settlement": //结算
        this.isMerge?url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_MERGE:url = this.$url.ESIGN_UPLOADFILE_URL_SETTLE;
          break;
        case "statement": //对账
          url = this.$url.ESIGN_UPLOADFILE_URL_STATEMENT;
          break;
        case "workIn": //进场
        this.isMerge?url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_MERGE:url = this.$url.ESIGN_UPLOADFILE_URL_WORK_IN;
          break;
        case "workOut": //退场
        this.isMerge?url = this.$url.ESIGN_UPLOADFILE_URL_CONTRACT_MERGE:url = this.$url.ESIGN_UPLOADFILE_URL_WORK_OUT;
          break;
        case "claim":
          url = 'contractapi/api/claim/uploadSignFile';
          break;
        default:
          break;
      }
      return url;
    },
    async getOrgName(id) {
      let url = this.$url.tenantParent.replace(/{id}/, id);
      let result = await this.$network.getData(url, "GET")
      if(result.id!=id){
        this.msg = '当前区域无实名认证信息，甲方默认使用上一级有实名信息的区域进行签署，如需更改，请前往【基础配置-组织管理】更新即可。'
      }
      this.organizationName = result.organizationName;
      let param = {
        name: this.organizationName,
      };
      let res = await this.$network.getData(this.$url.ESGIN_FIND_ORG_USER_INFO, "POST", param)
      this.getDefaultList(res);
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
  height:100%;
  @include flex(column);
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
  margin: 0px 8px 0px 8px;
  flex: 1;
  // border: 1px solid $uni-app-color-background;
  border-radius: 4px;
  padding: 0 8px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}
.right-item {
  margin: 10px 0;
  color: #929292;
}

// .bottom-container {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   position: fixed;
//   bottom: 0px;
//   left: 0px;
//   width: 100%;
//   z-index: 200;
//   padding: 10px 0px;
//   box-sizing: border-box;
//   background-color: #ffffff;
// }

// .btn {
//   flex: 3;
//   background-color: $uni-color-primary;
//   color: #ffffff;
//   text-align: center;
//   margin: 2px 8px;
//   border-radius: 16px;
//   padding: 8px 16px;
//   font-size: 14px;
// }

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
