<template>
  <view class="creat-person-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="sum-view-bg" >
      <view class="title"><span class="line"></span>基本信息</view>
      <view class="img-wrapper">
        <imgupload
        @uploadfinish="uploadfinishYyzz"
        @deleteUrl="deleteUrlYyzz"
        type="business_license"
        uploadType="attachment"
        maximg="1"
        title="营业执照识别"
        titleColor="#8c8c8c"
        :imgFinishlist="yyzzDic"
        :takePicUrl="takePicUrl"
        ref="front"
      />
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>企业名称</text>
          <text style="color: #ff0000">*</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="customName"
            placeholder="请输入企业名称...."
          />
        </view>
        <view class="automatic-identification" @click="automaticIdentification">自动识别</view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>企业地址</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="customAddress"
            placeholder="请输入企业地址...."
          />
        </view>
      </view>
      <select-label-item
        tagName="区域"
        tagColor='#8c8c8c'
        isRequired="true"
        hint="请选择区域"
        :value="areaDic.label"
        :icon="righticon"
        @clickItemLabel="choosearea"
      />
      <select-label-item
        tagName="业务负责人"
        tagColor='#8c8c8c'
        isRequired="true"
        hint="请选择业务负责人"
        :value="ownerDic.label"
        :icon="righticon"
        @clickItemLabel="chooseowner"
      />
  
   
      <imgupload
        titleColor="#8c8c8c"
        @uploadfinish="uploadfinishOthoer"
        @deleteUrl="deleteUrlOthoer"
        type="other_attachments"
        uploadType="attachment"
        maximg="20"
        title="其他附件"
        :imgFinishlist="otherDic"
      />
      <text-label-item
        tagName="备注"
        tagColor='#8c8c8c'
        :isShowBorder="true"
        placeholder="请输入备注..."
        @ipnuttext="remarkmethod"
        :inputValue="remark"
      />
      <view class="risk-query" @click="riskQuery">
        <text>风险查询</text>
      </view>
    </view>
    <view class="title"><span class="line"></span>发票抬头</view>
    <view class="sum-view-bg" style="margin-bottom: 5px">
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>银行账号</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="bankAccount"
            placeholder="请输入银行账号...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>开户行</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="openingBank"
            placeholder="请输入开户行...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>纳税人识别号</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="taxNumber"
            placeholder="请输入纳税人识别号...."
          />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left"> <text>公司固话</text></view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="fixPhone"
            placeholder="请输入公司固话...."
          />
        </view>
      </view>
      <select-label-item
        tagColor='#8c8c8c'
        tagName="组织编码类型"
        :isRequired="false"
        hint="请选择组织编码类型"
        :value="idTypeName"
        :icon="righticon"
        @clickItemLabel="chooseIdType('idType')"
      />
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text>组织编码</text>
        </view>
        <view class="cell-input-view-right">
          <input
            class="input-style"
            type="text"
            v-model="idNumber"
            placeholder="请输入组织编码...."
          />
        </view>
      </view>
    </view>
    <view class="title"><span class="line"></span>联系人信息</view>
    <view class="sum-view-bg" style="margin-bottom: 80px">
      <list>
        <cell v-for="(item, index) in contractList" :key="index">
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>联系人</text></view>
            <view class="cell-input-view-right">
              <text class="input-style">{{ item.name || "-" }}</text>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>手机号</text></view>
            <view class="input-style">
              <labelPhone :value="item.phoneNum" />
            </view>
          </view>
          <view v-for="(d, i) in item.secondaryPhoneList" :key="i">
            <view class="cell-input-view">
              <view class="cell-input-view-left"
                ><text>副手机号{{ i + 1 }}</text></view
              >
              <view class="cell-input-view-right">
                <view class="input-style">
                  <labelPhone :value="d" />
                </view>
              </view>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>职责</text></view>
            <text class="input-style">{{ getdutyStr(item.dutyList) }}</text>
          </view>
          <view class="cell-bottom-view">
            <view
              class="btn-view style-tilte-two"
              @click="editconnect(item, index)"
              ><text>修改</text></view
            >
            <view
              class="btn-view style-tilte-three"
              @click="deleteconnect(item, index)"
              ><text>删除</text></view
            >
          </view>
          <view style="height: 1px; flex: 1; background: #eeeeee" />
        </cell>
        <cell>
          <view class="cell-input-view-btn" >
            <view class="add-contract-view" @click="gotoconnect"
              ><text>+ 新增联系人</text></view
            >
          </view>
        </cell>
      </list>
    </view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle"
        ><text>取消</text></view
      >
      <view class="bottom-right-view" @click="clicksave"
        ><text>保存</text></view
      >
    </view>
    <!-- 类型选择 -->
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
export default {
  components: {
    selectLabelItem,
    wPicker,
    imgupload,
    textLabelItem,
    labelPhone,
  },
  data() {
    return {
      righticon: "iconarrow-right",
      areaDic: {},
      ownerDic: {},
      customName: "",
      customAddress: "",
      yyzzDic: [],
      otherDic: [],
      remark: "",

      bankAccount: "",
      openingBank: "",
      taxNumber: "",
      fixPhone: "",
      idNumber: "",
      idTypeName: "",
      idType: "",

      contractList: [],
      areaList: [],
      ownerList: [],
      selectList: [],
      idTypeList: [],
      saveDic: {},
      isedit: false,
      takePicUrl: null,
      topage: "",
      businessLicenseListAuto:[]
    };
  },
  onLoad(option) {
    this.topage = option.choose || "";
    if (option.edit == "true") {
      let item = JSON.parse(decodeURIComponent(option.item));
      this.getDetailWithId(item.id);
      this.isedit = true;
    } else {
      let res = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      if (res) {
        this.areaDic = {
          label: res.orgName,
          value: res.orgIds[0],
        };
        // if(roleTypeList.some(o=>{ return o == this.$savekey.USER_ROLE_BUSINESS})) {
        if (
          this.$gxfmethod.issameRoleType(res, this.$savekey.USER_ROLE_BUSINESS)
        ) {
          this.ownerDic = {
            label: res.username,
            value: res.id,
          };
        }
      }
    }
    uni.$on("refreshData-connect", (item) => {
      let dict = item.item;
      if (item.index == -1) {
        this.contractList.push(dict);
      } else {
        this.contractList.splice(item.index, 1, dict);
      }
    });
    uni.$on("goto-business", (usnerinfo) => {
      uni.switchTab({
        url: "/pages/main/business",
      });
    });
    this.loadAreaList();
    this.getIdTypes();
    // this.loadOwnerList();
  },
  onUnload() {
    uni.$off("refreshData-connect");
    uni.$off("goto-business");
  },
  methods: {
    riskQuery(){
      // 校验客户名 根据名字来查询对应的风险
      if(!this.customName){
        uni.showToast({title:'请先输入客户名称',icon:'none'}); return;
      }else{
        // 跳转到风险查询页面
        uni.navigateTo({
            url: `/contractPages/contract/components/enterprise-risk-inquiry?name=${this.customName}`
          });
      }
    },
    automaticIdentification(){
      if(this.customName){
        let url=this.$url.COM_NAME_MATCH+'?keyword='+this.customName;
        this.$network.getData(url,'GET',null).then(res=>{
          console.log(res,'COM_NAME_MATCH');
          this.customName=res.name;
          this.idNumber=res.creditNo;
          this.taxNumber=res.creditNo;
          // this.idTypeName= "CRED_ORG_USCC";
          this.idTypeName='统一社会信用代码';
          this.customAddress=res.address;
        }).catch(err=>{
          return err
        })
      }else{
        uni.showToast({title:'请先输入客户名称',icon:'none'}); return
      }
    },
    getIdTypeName() {
      if (!this.idTypeList || this.idTypeList.length <= 0 || !this.idType) {
        return;
      }
      let obj = this.idTypeList.find((o) => o.value == this.idType);
      this.idTypeName = obj && obj.label ? obj.label : "";
    },
    getIdTypes() {
      this.$network
        .loadUserType("id_type")
        .then((result) => {
          this.idTypeList = result ? result : [];
          this.getIdTypeName();
        })
        .catch((err) => {});
    },
    //获取详情
    getDetailWithId(customId) {
      let url = this.$url.CUSRTOMER_DETAIL + customId;
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          let item = result;
          this.areaDic = {
            label: item.orgName,
            value: item.orgId,
          };
          this.ownerDic = {
            label: item.salesmanName,
            value: item.salesman,
          };
          this.customName = item.name;
          this.customAddress = item.address || "";
          this.yyzzDic = item.businessLicenseList || [];
          this.otherDic = item.otherAttachmentsList;
          this.remark = item.remark || "";
          this.bankAccount = item.bankAccount || "";
          this.openingBank = item.openingBank || "";
          this.taxNumber = item.taxNumber || "";
          this.fixPhone = item.fixedPhone || "";
          this.idNumber = item.idNumber || "";
          this.idTypeName = item.idTypeName || "";
          this.idType = item.idType;
          this.getIdTypeName();

          this.contractList = item.contactsList || [];

          this.saveDic = {
            ...item,
          };
        })
        .catch((err) => {});
    },
    getdutyStr(list) {
      let strlist = [];
      list.map((item) => {
        if (item === "1") {
          strlist.push("法人");
        }
        if (item === "2") {
          strlist.push("合同");
        }
        if (item === "3") {
          strlist.push("结算");
        }
        if (item === "4") {
          strlist.push("进退场");
        }
        if (item === "5") {
          strlist.push("财务");
        }
        if (item === "6") {
          strlist.push("合同保证人");
        }
      });
      let str = strlist.join(",");
      return str;
    },
    //加载地区
    loadAreaList() {
      uni.showLoading();
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.areaList = this.getChildren(list);
          console.log(this.areaList);
          if (this.isedit === false) {
            if (this.areaList.length > 0) {
              let org = this.areaList.find((item) => {
                if (item.value === this.areaDic.value) {
                  return item;
                }
              });
              console.log(org);
              this.areaDic = org ? org : {};
              this.loadOwnerList(this.areaDic.value, false);
            }
          } else {
            this.loadOwnerList(this.areaDic.value, false);
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getChildren(data) {
      let arr = [];
      if (data) {
        data.forEach((o) => {
          let a = {
            value: o.id,
            label: o.name,
          };
          arr = [...arr, a];
          if (o.children && o.children.length > 0) {
            arr = [...arr, ...this.getChildren(o.children)];
          }
          // else {
          // 	arr = [...arr, a];
          // }
        });
      }
      return arr;
    },
    //加载负责人
    loadOwnerList(orgId, isfirst) {
      let param = {
        showAdmin: false,
        orgId: orgId ? orgId : "",
        roleType: this.$savekey.USER_ROLE_BUSINESS,
      };
      uni.showLoading();
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          let list = result;
          this.ownerList = list.map((dict) => {
            return {
              label: dict.username,
              value: dict.id,
            };
          });
          if (isfirst === true) {
            if (this.ownerList.length > 0) {
              this.ownerDic = this.ownerList[0];
            }
          }
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    choosearea() {
      this.type = "area";
      this.selectList = [];
      this.selectList = [...this.areaList];
      this.showdialog();
    },
    chooseowner() {
      this.type = "owner";
      this.selectList = [];
      this.selectList = [...this.ownerList];
      this.showdialog();
    },
    chooseIdType() {
      this.type = "idType";
      this.selectList = [];
      this.selectList = [...this.idTypeList];
      console.log(this.selectList, " this.selectList");
      this.showdialog();
    },
    //显示底部picker
    showdialog() {
      this.$refs.selector.show();
    },
    //弹窗回调
    dialog(val) {
      this.$datestr.printlog(this.type);
      if (this.type === "area") {
        this.areaDic = val.checkArr;
        this.loadOwnerList(this.areaDic.value, true);
      } else if (this.type === "owner") {
        this.ownerDic = val.checkArr;
      } else if (this.type === "idType") {
        this.idType = val.checkArr.value;
        this.idTypeName = val.checkArr.label;
      }
    },
    deleteconnect(item, index) {
      this.contractList.splice(index, 1);
    },
    editconnect(item, index) {
      console.log(item,"edit");
      item={
        ...item,
        type:1
      }
      let url =
        "./connect-create?item=" +
        encodeURIComponent(JSON.stringify(item)) +
        "&edit=true&index=" +
        index;
      this.$datestr.printlog(JSON.stringify(item));
      uni.navigateTo({
        url: url,
      });
    },
    gotoconnect() {
      console.log("creat");
      let item={
        type:1
      }
      let url = "./connect-create?edit=false"+"&item=" + encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: url,
      });
    },
    //营业执照
    uploadfinishYyzz(val) {
      let list = val.data;
      this.yyzzDic = list;
    },
    deleteUrlYyzz(val) {
      let list = val.data;
      this.yyzzDic = list;
    },
    //其他附件
    uploadfinishOthoer(val) {
      let list = val.data;
      this.otherDic = list;
    },
    deleteUrlOthoer(val) {
      let list = val.data;
      this.otherDic = list;
    },
    //正面
    uploadfinishFront(val) {
      let list = val.data;
      this.identityCardFront = list;
    },
    deleteUrlFront(val) {
      let list = val.data;
      this.identityCardFront = list;
    },
    //反面
    uploadfinishBehind(val) {
      let list = val.data;
      this.identityCardBehind = list;
    },
    deleteUrlBehind(val) {
      let list = val.data;
      this.identityCardBehind = list;
    },
    //显示弹窗
    remarkmethod(val) {
      this.$datestr.printlog(val);
      this.remark = val;
    },
    //取消按钮
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //确定按钮
    clicksave() {
      if (this.areaDic.label == undefined || this.areaDic.label === "") {
        uni.showToast({
          icon: "none",
          title: "请选择区域",
        });
        return;
      }
      if (this.ownerDic.label === undefined || this.ownerDic.label === "") {
        uni.showToast({
          icon: "none",
          title: "请选择业务负责人",
        });
        return;
      }
      if (this.customName === "") {
        uni.showToast({
          icon: "none",
          title: "请输入姓名",
        });
        return;
      }
      // if (this.phoneNum === '') {
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '请输入手机号'
      // 	});
      // 	return;
      // }
      // if(this.$datestr.isphonenum(this.phoneNum) === false){
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '请输入正确手机号'
      // 	});
      // 	return;
      // }
      if (this.contractList.length === 0) {
        uni.showToast({
          icon: "none",
          title: "请添加联系人",
        });
        return;
      }
      this.httprequestData();
    },
    httprequestData() {
      uni.showLoading({
        mask: true,
      });
      this.saveDic.orgId = this.areaDic.value;
      this.saveDic.salesman = this.ownerDic.value;
      this.saveDic.name = this.customName;
      this.saveDic.address = this.customAddress;
      this.saveDic.businessLicenseList = this.yyzzDic.concat(this.businessLicenseListAuto);
      this.saveDic.otherAttachmentsList = this.otherDic;
      this.saveDic.remark = this.remark;
      this.saveDic.type = "1";
      this.saveDic.bankAccount = this.bankAccount;
      this.saveDic.openingBank = this.openingBank;
      this.saveDic.taxNumber = this.taxNumber;
      this.saveDic.fixedPhone = this.fixPhone;
      this.saveDic.idNumber = this.idNumber;
      this.saveDic.idType = this.idType;
      this.saveDic.idTypeName = this.idTypeName;
      this.saveDic.contactsList = this.contractList;

      let method = "POST";
      if (this.isedit === true) {
        method = "PUT";
      }
      this.$network
        .getData(this.$url.LINKMAN_PERSON_CREAT, method, this.saveDic)
        .then((result) => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功",
            icon: "none",
          });
          uni.$emit("refreshData-linkman", {
            type: "company",
          });
          if (this.isedit === false) {
            uni.showModal({
              title: "提示",
              content: "是否使用该用户新建合同?",
              success: (res) => {
                if (res.cancel) {
                  uni.navigateBack({
                    delta: 1,
                  });
                } else {
                  uni.showLoading();
                  let url =
                    this.$url.LINKMAN_PERSON_CONNECT +
                    result.id +
                    "?dutyTypeSort=2";
                  this.$network
                    .getData(url, "GET", null)
                    .then((resultList) => {
                      if (this.topage === "") {
                        let newDic = {
                          ...result,
                          contactsList: [...resultList],
                        };
                        uni.navigateTo({
                          url:
                            "/contractPages/contract/create-contract?clink=" +
                            encodeURIComponent(JSON.stringify(newDic)),
                        });
                      } else {
                        let contractDic =
                          resultList.length > 0 ? resultList[0] : {};
                        uni.$emit("linkman-emit", {
                          customer: result,
                          dict: contractDic,
                        });
                        uni.navigateBack({
                          delta: 2,
                        });
                        uni.hideLoading();
                      }
                      uni.hideLoading();
                    })
                    .catch((err) => {
                      uni.hideLoading();
                    });
                }
              },
            });
          } else {
            uni.navigateBack({
              delta: 1,
            });
          }
        })
        .catch((err) => {
          uni.hideLoading();
          if (err.code == 50003) {
            uni.showToast({
              title: err.details[0],
              icon: "none",
            });
          } else {
            uni.showToast({
              title:
                err.details && err.details[0] ? err.details[0] : err.message,
              icon: "none",
            });
          }
        });
    },
    // http://{{test-address}}/userapi/api/auth/org/bizLicense?licenseUrl
    takePic() {
      console.log(111);

      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: (chooseImageRes) => {
          console.log(JSON.stringify(chooseImageRes, "chooseImageRes"));
          const tempFilePaths = chooseImageRes.tempFilePaths;
          let uploadUrl = this.$url.BASE_URL + this.$url.UPLOAD_IMG;
          let headerDic = {
            "Content-Type": "application/json",
            Authorization: "",
          };
          let loginMes = uni.getStorageSync("loginMesage");
          if (loginMes) {
            let access_token =
              loginMes.token_type + " " + loginMes.access_token;
            headerDic.Authorization = access_token;
          }
          uni.uploadFile({
            url: uploadUrl, //仅为示例，非真实的接口地址
            header: headerDic,
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              type: "business_license",
              uploadType: "attachment",
            },
            success: (uploadFileRes) => {
              uni.hideLoading();
              let resData = uploadFileRes.data
                ? JSON.parse(uploadFileRes.data)
                : {};
              console.log(resData.result);
              this.businessLicenseListAuto[0] = resData.result;
              if (resData.code && resData.code == 200) {
                uni.showLoading({
                  mask: true,
                  title: "营业执照识别中",
                });
                // 身份证识别
                this.$network
                  .getData(this.$url.BIZLICENSE, "GET", {
                    licenseUrl: resData.result.url,
                  })
                  .then((result) => {
                    console.log(result);
                    this.customName = result.name;
                    this.idcardnum = result.idNum;
                    this.customAddress = result.address;
                    this.taxNumber = result.regNum;
                    this.idNumber = result.regNum;
                    this.idTypeName = this.idTypeList[0].label;
                    this.idType = "CRED_ORG_USCC";
                    this.takePicUrl = resData.result;
                    console.log(resData.result.url, "resData.result.url");
                    uni.hideLoading();
                  })
                  .catch((err) => {
                    uni.hideLoading();
                  });
                console.log(resData.result.url, "-------------------");
              } else {
                console.log(uploadFileRes);
                console.log("fail");
              }
            },
          });
        },
        fail: (error) => {
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .list-view{
  border-bottom: none;
}
.img-btn {
  position: relative;
  flex: 1;
  width: 204rpx;
  height: 204rpx;
  background: #ffffff;
  border: 1rpx solid #dcdfe6;

  &::before {
    display: block;
    position: absolute;
    content: "+";
    left: 50%;
    top: 50%;
    font-size: 65rpx;
    transform: translate(-50%, -50%);
    color: #8c8c8c;
  }
}
.risk-query{
  background-color: #fff;
  padding-bottom: 23rpx;
  text{
    display: inline-block;
    width: 151rpx;
    height: 56rpx;
    text-align: center;
    line-height: 56rpx;
    background: #FFFFFF;
    border-radius: 6rpx;
    border: 1rpx solid #E60000;
    font-weight: 400;
    font-size: 28rpx;
    color: #E60000;
    margin-left: 22rpx;
  }
}
.img-bg-view{
  background-color: #fff !important; 
}
.title {
    height: 88rpx;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    display: flex;
    align-items: center;
    .line {
        display: block;
        width: 2px;
        height: 34rpx;
        background-color: #e60000;
        margin-right: 10px;
    }

}
::v-deep .gray-arrow{
  margin-right: 0;
}
.automatic-identification{
  width: 144rpx;
height: 56rpx;
background: #FFFFFF;
border-radius: 6rpx;
border: 1rpx solid #E60000;
line-height: 56rpx;
text-align: center;
margin-left: 10rpx;
font-size: 28rpx;
font-family: PingFangSC, PingFang SC;
font-weight: 400;
color: #E60000;
}
::v-deep .img-upload-title{
  padding-bottom: 10rpx;
  margin-left: 0 !important;
  margin-right: 0;
  padding-left: 10px;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #222222;
}
::v-deep .img-upload-img{
  margin-top: 9px;
}
::v-deep .img-upload-view{
  // padding-bottom: 4px;
  padding-top: 4px;
  background-color: #fff;

}
.creat-person-bg {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.img-wrapper{
  border-bottom: $uni-line-color 1px dotted;
  background-color: #fff;
  padding-bottom: 12rpx;
}
.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 10rpx;
}
list{
  margin-top: 0 !important;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding:5px 10px;
  border-bottom: $uni-line-color 1px dotted;
  font-size: $uni-font-size-base;
  background-color: #fff;
  line-height: 60rpx;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #8c8c8c;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  padding-left: 8px;
}

.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.paizhao {
  margin-left: 10px;
  width: 20px;
  height: 20px;
  font-size: 20px;
  text-align: center;
  color: #e60000;
}
.bottom-left-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 6rpx;
  background: $uni-bg-color-grey;
  font-size: $uni-font-size-lg;
  color: $uni-color-primary;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;
}

.bottom-right-view {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 6rpx;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.add-contract-view {
  display: flex;
  flex: 1;
  height: 40px;
  margin-left: 20px;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: $uni-color-primary;
  font-size: $uni-font-size-base;
}
.cell-input-view-btn{
  display: flex;
  flex: 1;
  align-items: center;
  padding: 24rpx 0;
  justify-content: center;
  color: #ffffff;
  background: #fff;
  font-size: $uni-font-size-base;
  border-radius: 6rpx;
}
.cell-bottom-view {
  display: flex;
  flex: 1;
  height: 50px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.btn-view {
  display: flex;
  border-radius: 5px;
  margin-right: 10px;
  width: 60px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: $uni-font-size-base;
}

.style-tilte-one {
  background: #e60000;
  color: #ffffff;
}

.style-tilte-two {
  background: #fe931f;
  color: #eeeeee;
}

.style-tilte-three {
  background: #fffcf7;
  color: #f9c0c8;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin: 10px;
  margin-left: 0 !important;
}
</style>
