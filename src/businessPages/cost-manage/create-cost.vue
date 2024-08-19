<template>
  <view class="creat-reimburse-bg">
    <!-- 基本信息 -->
    <view class="cell-title" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
      <text>基本信息</text>
    </view>
    <view class="sum-view-bg" style="margin-bottom: 5px;">
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">成本单号</text>
          <text style="color: #FF0000;">*</text>
        </view>
        <view class="cell-input-view-right">
          <text class="input-style value">{{ reimburseDic.businessNo || "--" }}</text>
        </view>
      </view>
      <select-label-item isRequired="true" tagName="合同名称" class="oneline" tagColor="#8C8C8C" hint="请选择合同" :value="contractDicName" :icon="righticon" @clickItemLabel="gotoContract" />

      <view v-if="ischoose" style="display: flex;flex-direction: column;">
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text class="label">区域</text>
            <text style="color: #FF0000;">*</text>
          </view>
          <view class="cell-input-view-right">
            <text class="input-style value">{{ reimburseDic.orgName || "" }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text class="label">业务负责人</text>
            <text style="color: #FF0000;">*</text>
          </view>
          <view class="cell-input-view-right">
            <text class="input-style">{{ reimburseDic.customerSalesmanName || "" }}</text>
          </view>
        </view>
        <view class="cell-input-view">
          <view class="cell-input-view-left">
            <text class="label">客户名称</text>
            <text style="color: #FF0000;">*</text>
          </view>
          <view class="cell-input-view-right">
            <text class="input-style">{{ reimburseDic.customerName || "" }}</text>
          </view>
        </view>

        <select-label-item tagName="支出日期" hint="请选择日期" tagColor="#8C8C8C" isRequired="true" :value="changestr(reimburseDic.payDate)" :icon="dateIcon"
          @clickItemLabel="showCalendar" />
      </view>

      <select-label-item tagName="支出方式" tagColor="#8C8C8C" hint="请选择支出方式" isRequired="true" :value="reimburseDic.payTypeName" :icon="righticon" @clickItemLabel="showdialog('pay')" />
      <!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text class="label">支出人</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="reimburseDic.bankAccount" 
					placeholder="请输入支出人" />
				</view>
      </view>-->
      <select-label-item tagName="支出人" tagColor="#8C8C8C" hint="请选择支出人" isRequired="false" :value="reimburseDic.payUserName" :icon="righticon"
        @clickItemLabel="showdialog('payUser')" />
    </view>

    <!-- 支出金额 -->
    <view class="cell-title" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
      <text>支出金额</text>
    </view>
    <view class="sum-view-bg" v-if="ischoose" style="margin-bottom: 5px;">
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">运费</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.freightCost" placeholder="0.00" @input="textChange($event, 'freightCost')" />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">装卸费</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.handlingCost" placeholder="0.00" @input="textChange($event, 'handlingCost')" />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">沟通费</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.contactCost" placeholder="0.00" @input="textChange($event, 'contactCost')" />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">维修费</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.repairCost" placeholder="0.00" @input="textChange($event, 'repairCost')" />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">调度费</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.dispatchCost" placeholder="0.00" @input="textChange($event, 'dispatchCost')" />
        </view>
      </view>

      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text class="label">其他费用</text>
        </view>
        <view class="cell-input-view-right">
          <input maxlength="11" class="input-style" type="digit" v-model="reimburseDic.otherCost" placeholder="0.00" @input="textChange($event, 'otherCost')" />
        </view>
      </view>
      <view class="cell-input-view">
        <view class="cell-input-view-left">
          <text style="font-weight: 600;color:#222">支出总额</text>
        </view>
        <view class="cell-input-view-right">
          <text class="input-style" style="font-weight: bold;">{{ reimburseDic.totalRentalPay || 0 }}</text>
        </view>
      </view>

      <text-label-item bgcolor="#F6F6F6" tagName="支出理由" :isRequired="true" placeholder="请输入支出理由" @ipnuttext="remarkmethodReason" :inputValue="reimburseDic.payReason" />
    </view>
    <!-- 其他信息 -->
    <view class="cell-title" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
      <text>其他信息</text>
    </view>
    <view class="sum-view-bg">
      <imgupload :isImagwWrapper="false" :isShowBg="false" @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" type="cost_type" uploadType="attachment" maximg="20"
        :imgFinishlist="reimburseDic.fileList" />

      <text-label-item bgcolor="#F6F6F6" tagName="备注" placeholder="请输入备注信息..." @ipnuttext="remarkmethod" :inputValue="reimburseDic.comment" />
    </view>
    <view class="bottom-view">
      <view class="bottom-left-view" @click="clickecancle">
        <text>取消</text>
      </view>
      <view class="bottom-right-view" @click="clicksave">
        <text>确定</text>
      </view>
    </view>
    <!-- 日历 -->
    <!-- <uni-calendar 
		style="z-index: 200;"
		@confirm="confirm" 
		:insert="false" 
		ref="calendar"
		endDate="enddata"
    />-->
    <!-- 类型选择 -->
    <w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />

    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" :pickControl="true" ref="date" themeColor="#E60000" />
    <alertPopup ref="aletrview" @getAssignList="getAssignList" :mask-click="true" />
    <remarkPopup ref="remarkview" @RemarkSum="remarksum" :mask-click="true" />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import alertPopup from "@/components/common/uni-popup/alert-pop.vue";
import remarkPopup from "@/components/common/uni-popup/remark-pop.vue";
export default {
  name: "createCost",
  components: {
    selectLabelItem,
    textLabelItem,
    wPicker,
    imgupload,
    alertPopup,
    remarkPopup
  },
  data() {
    return {
      salesmanList: [],
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      ischoose: false, //是否选择合同
      backType: -1,
      backDic: {},
      reimburseDic: {
        payUserId: null,
        payReason: null,
        freightCost: 0,
        handlingCost: 0,
        contactCost: 0,
        repairCost: 0,
        dispatchCost: 0,
        otherCost: 0
      },
      contractDicName: null,
      selectList: [], //发票列表
      typeList: [],
      selectType: "",
      deviceList: [
        {
          value: "1",
          label: "已退回"
        },
        {
          value: "2",
          label: "未退回"
        }
      ],
      businessNo: null,
      isLoading: false
    };
  },
  // mounted(){
  //   if(!this.businessNo){
  //   this.getBusinessNo();
  //   }
  // },
  created() {
    this.loadOwnerList();
  },
  onLoad(option) {
    console.log(option, "option");
    let self = this;
    if (option.backType === "1" || option.backType === "2") {
      //退回1 撤回2
      this.backType = Number(option.backType);
      this.backDic = JSON.parse(decodeURIComponent(option.item));
      console.log(this.backDic, "this.backDic");
      this.loaddata(this.backDic.businessNo);
    } else {
      if (option.item) {
        this.ischoose = true;
        let contractDic = JSON.parse(decodeURIComponent(option.item));
        this.reimburseDic = {
          ...this.reimburseDic,
          customerId: contractDic.customerId || "",
          customerName: contractDic.customerName || "",
          orgId: contractDic.orgId || "",
          orgName: contractDic.orgName || "",
          customerSalesman:
            contractDic.contractDetailDto.customerSalesman || "",
          customerSalesmanName:
            contractDic.contractDetailDto.customerSalesmanName || "",
          contactName: contractDic.contractDetailDto.contactName || "",
          phoneNum: contractDic.contractDetailDto.phoneNum || "",
          contractNo: contractDic.businessNo || "",
          contractDetailId: contractDic.contractDetailDto.id || "",
          projectName: contractDic.contractDetailDto.projectName || ""
        };
        let customerName = contractDic.customerName
          ? contractDic.customerName + "-"
          : "";
        let projectName = contractDic.contractDetailDto.projectName
          ? contractDic.contractDetailDto.projectName
          : "";
        this.contractDicName = customerName + projectName;
      }
      this.reimburseDic = {
        ...this.reimburseDic,
        payDate: this.$datestr.getnowdate() + " 00:00:00"
      };
      if (!this.backDic.businessNo) {//新增
        this.getBusinessNo();
      }
      this.getSettleMsg();
      //   this.getCustomerMsg();
    }
    uni.$on("choose-contract-emit", usnerinfo => {
      this.ischoose = true;
      let contractDic = usnerinfo.dict;
      this.reimburseDic = {
        ...this.reimburseDic,
        customerId: contractDic.customerId || "",
        customerName: contractDic.customerName || "",
        orgId: contractDic.orgId || "",
        orgName: contractDic.orgName || "",
        customerSalesman: contractDic.contractDetailDto.customerSalesman || "",
        customerSalesmanName:
          contractDic.contractDetailDto.customerSalesmanName || "",
        contactName: contractDic.contractDetailDto.contactName || "",
        contractNo: contractDic.businessNo || "",
        contractDetailId: contractDic.contractDetailDto.id || "",
        projectName: contractDic.contractDetailDto.projectName || ""
      };
      let customerName = contractDic.customerName
        ? contractDic.customerName + "-"
        : "";
      let projectName = contractDic.contractDetailDto.projectName
        ? contractDic.contractDetailDto.projectName
        : "";
      this.contractDicName = customerName + projectName;
      //   this.getCustomerMsg();
      this.getSettleMsg();
    });
    this.loadInvoiceType();
    this.loadOwnerList();
    //获取当前登录用户信息
    uni.getStorage({
      key: "userinfoMesage",
      success(res) {
        console.log(res, "userinfoMesage");
        self.reimburseDic.payUserName = res.data.username;
        self.reimburseDic.payUserId = res.data.id;
      }
    });
  },
  onUnload() {
    // 取消监听事件
    uni.$off("choose-contract-emit");
  },
  methods: {
    //加载负责人
    loadOwnerList() {
      let self = this;
      let param = {
        showAdmin: false,
        orgId: this.reimburseDic.orgId
      };
      uni.showLoading();
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then(result => {
          console.log(result, "salesmanList");
          this.salesmanList = [];
          this.salesmanList.push({
            label: "全部",
            value: "",
            disabled: true
          });
          this.salesmanList = this.salesmanList.concat(
            result
              ? result.map(dict => {
                return {
                  label: dict.username,
                  value: dict.roleId
                };
              })
              : []
          );
          this.reimburseDic = {
            ...self.reimburseDic
            // payUserId: self.salesmanList[0].value,
            // payUserName: self.salesmanList[0].label,
          };
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
        });
    },
    /**
     * 获取单号
     */
    getBusinessNo() {
      let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, "CB");
      this.reimburseDic.businessNo = this.backDic.businessNo;
      if (this.reimburseDic.businessNo) return;
      this.$network
        .getData(url, "GET", null)
        .then(result => {
          this.reimburseDic = {
            ...this.reimburseDic,
            businessNo: result
          };
          console.log(this.reimburseDic, "this.reimburseDic ");
        })
        .catch(err => { });
    },
    getSettleMsg() {
      // LINKMAN_GET_CUSTOMERMSG
      let url = this.$url.CONTRACT_TOTAL + this.reimburseDic.contractNo;
      this.$network
        .getData(url, "GET", null)
        .then(result => {
          let total = result && result.total ? parseFloat(result.total) : 0;
          // this.reimburseDic.hire = total >= 0 ? '' : Math.abs(total).toString();
          this.reimburseDic = {
            ...this.reimburseDic,
            total: this.sumAllMoney().toString()
          };
          console.log(JSON.stringify(this.reimburseDic));
        })
        .catch(err => { });
    },

    //获取详情
    async loaddata(key) {
      uni.showLoading();
      // key=this.businessNo||key;
      // let url = this.$url.SETTLE_REIMBURSE_DETAIL + key;//退款详情的接口
      let detailInfo = await this.$network.getCostDetailById({
        businessNo: key
      });
      this.reimburseDic = {
        ...detailInfo
      };
      this.ischoose = true;
      let customerName = this.reimburseDic.customerName
        ? this.reimburseDic.customerName + "-"
        : "";
      let projectName = this.reimburseDic.projectName
        ? this.reimburseDic.projectName
        : "";
      this.contractDicName = customerName + projectName;
      uni.hideLoading();
    },
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //加载发票类型
    loadInvoiceType() {
      uni.showLoading();
      this.$network
        .loadType("pay_type")
        .then(result => {
          console.log(result, "result");
          this.typeList = result;
          this.reimburseDic = {
            ...this.reimburseDic,
            payType: this.typeList[0].value,
            payTypeName: this.typeList[0].label
          };
          console.log(this.typeList, "");
          uni.hideLoading();
        })
        .catch(err => {
          uni.hideLoading();
        });
    },

    //输入框
    textChange(e, type) {
      let val = e.detail ? e.detail.value : "";
      this.reimburseDic[type] = val;
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        this.reimburseDic[type] = val;
        this.reimburseDic = {
          ...this.reimburseDic,
          totalRentalPay: this.sumAllMoney().toString()
        };
      }, 30);
    },
    sumAllMoney() {
      // let hire = parseFloat(this.reimburseDic.hire || '0')
      let freightCost = parseFloat(this.reimburseDic.freightCost || "0");
      let handlingCost = parseFloat(this.reimburseDic.handlingCost || "0");
      let contactCost = parseFloat(this.reimburseDic.contactCost || "0");
      let repairCost = parseFloat(this.reimburseDic.repairCost || "0");
      let dispatchCost = parseFloat(this.reimburseDic.dispatchCost || "0");
      let otherCost = parseFloat(this.reimburseDic.otherCost || "0");
      return (
        freightCost +
        handlingCost +
        contactCost +
        repairCost +
        dispatchCost +
        otherCost
      ).toFixed(2);
    },
    //显示日历
    showCalendar() {
      this.$refs.date.show();
    },
    showdialog(type) {
      this.selectType = type;
      if (this.selectType === "device") {
        this.selectList = this.deviceList;
      } else if (this.selectType == "payUser") {
        this.selectList = this.salesmanList;
      }
      else if (this.selectType == "pay") {
        this.selectList = this.typeList;
      }
      this.$refs.selector.show();
    },
    //跳入合同列表
    gotoContract() {
      let url = "/businessPages/invoice/contract-choose?state=5,6,7,8";
      uni.navigateTo({
        url: url
      });
    },
    //跳入联系人列表
    gotocustom() {
      uni.navigateTo({
        url: "/otherPages/linkman/linkman?nextview=false"
      });
    },
    remarkmethodReason(val) {
      console.log(val, "remarkmethodReason");
      // reason 支出理由
      this.reimburseDic = {
        ...this.reimburseDic,
        payReason: val
      };
    },
    //显示弹窗
    remarkmethod(val) {
      console.log(val, "remarkmethodReason");

      //备注
      this.reimburseDic = {
        ...this.reimburseDic,
        remark: val
      };
    },
    //日历回调
    confirm(e) {
      this.reimburseDic = {
        ...this.reimburseDic,
        payDate: e.fulldate + " 00:00:00"
      };
    },
    onConfirm(e) {
      this.reimburseDic = {
        ...this.reimburseDic,
        payDate: e.result + " 00:00:00"
      };
      this.$refs.date.hide();
    },
    //弹窗回调
    dialog(val) {
      console.log(this.selectType, 'dialog');
      if (this.selectType === "device") {
        this.reimburseDic = {
          ...this.reimburseDic,
          deviceState: val.checkArr.value,
          deviceStateName: val.checkArr.label
        };
      } else if (this.selectType === "payUser") {
        this.reimburseDic = {
          ...this.reimburseDic,
          payUserId: val.checkArr.value,
          payUserName: val.checkArr.label
        };
      } else if (this.selectType == 'pay') {
        this.reimburseDic = {
          ...this.reimburseDic,
          payType: val.checkArr.value,
          payTypeName: val.checkArr.label
        };
      }
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.reimburseDic = {
        ...this.reimburseDic,
        fileList: list
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.reimburseDic = {
        ...this.reimburseDic,
        fileList: list
      };
    },
    //取消按钮
    clickecancle() {
      uni.navigateBack({
        delta: 1
      });
    },
    //确定按钮
    clicksave() {
      if (!this.reimburseDic.contractNo) {
        uni.showToast({
          title: "请选择合同",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!this.reimburseDic.payDate) {
        uni.showToast({
          title: "请选择日期",
          icon: "none",
          duration: 2000
        });
        return;
      }

      if (!this.reimburseDic.payReason) {
        uni.showToast({
          title: "请输入支出理由",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!this.reimburseDic.payTypeName) {
        uni.showToast({
          title: "请选择支出方式",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (!this.reimburseDic.payUserName) {
        uni.showToast({
          title: "请选择支出人",
          icon: "none",
          duration: 2000
        });
        return;
      }
      this.httprequestData();
    },
    httprequestData() {
      uni.showLoading({
        mask: true
      });
      this.workflowcommon.iswf("cost").then(iswf => {
        if (iswf) {
          this.workflowcommon
            .getFirstNodeUser(
              "contractapi",
              "cost",
              this.reimburseDic.orgId,
              this.reimburseDic.customerSalesman
            )
            .then(showToast => {
              if (showToast) {
                this.$refs.aletrview.open();
                uni.hideLoading();
              } else {
                if (this.backType === 1) {
                  //退回
                  uni.hideLoading();
                  this.$refs.remarkview.open();
                } else {
                  let assnstr = this.workflowcommon.submitData(false, []);
                  this.submitSaveData(assnstr);
                }
              }
            })
            .catch(error => {
              uni.showToast({
                title: error.message,
                icon: "none"
              });
            });
        } else {
          if (this.backType === 1) {
            //退回
            uni.hideLoading();
            this.$refs.remarkview.open();
          } else {
            this.submitSaveData("");
          }
        }
      });
    },
    remarksum(val) {
      this.thoughSaveData([], val.remark); //退回
    },
    //弹窗提示返回
    getAssignList(val) {
      console.log(this.backType, "getAssignList");
      let alist = val.selectArr;
      console.log(alist, "alist");
      if (alist.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择审批人"
        });
        return;
      }
      if (this.backType === 1) {
        let asList = alist.map(o => {
          return o.id;
        });
        //退回
        this.thoughSaveData(asList, "");
      } else {
        let assnstr = this.workflowcommon.submitData(true, alist);
        this.submitSaveData(assnstr);
      }
    },
    submitSaveData(val) {
      console.log(val, "submitSaveData");
      if (this.isLoading) {
        return;
      }
      this.reimburseDic = {
        ...this.reimburseDic,
        freightCost: this.reimburseDic.freightCost ? this.reimburseDic.freightCost : 0,
        handlingCost: this.reimburseDic.handlingCost ? this.reimburseDic.handlingCost : 0,
        contactCost: this.reimburseDic.contactCost ? this.reimburseDic.contactCost : 0,
        repairCost: this.reimburseDic.repairCost ? this.reimburseDic.repairCost : 0,
        dispatchCost: this.reimburseDic.dispatchCost ? this.reimburseDic.dispatchCost : 0,
        otherCost: this.reimburseDic.otherCost ? this.reimburseDic.otherCost : 0,
      };
      this.isLoading = true;
      this.$network
        .createCost(this.reimburseDic, val,true)
        .then(result => {
          console.log(result, "result");
          this.isLoading = false;
          uni.$emit("refresh-contract-list", {
            type: "cost"
          });
          uni.$emit("refresh-notification-list", {
            type: "apply"
          });
          uni.navigateBack({
            animationDuration: 200
          });
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    thoughSaveData(val, inputstr) {
      uni.showLoading({
        mask: true
      });
      this.reimburseDic = {
        ...this.reimburseDic
      };
      this.reimburseDic.task = null;
      let jsonstr = JSON.stringify(this.reimburseDic);
      this.workflowcommon
        .passapply(
          "contractapi",
          val,
          inputstr,
          jsonstr,
          this.backDic.procDefId,
          this.backDic.procInstId,
          this.backDic.id
        )
        .then(showToast => {
          uni.$emit("refresh-notification-list", {
            type: "wait"
          });
          uni.$emit("refresh-contract-list", {
            type: "refund"
          });
          uni.navigateBack({
            animationDuration: 100
          });
          uni.hideLoading();
        })
        .catch(error => {
          uni.hideLoading();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.uni-page-head {
  background: #fff !important;
}

.creat-reimburse-bg {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 0 16rpx;
  margin-bottom: 70px;
  background: #ffffff;
  border-radius: 10px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 16rpx;
  font-size: $uni-font-size-base;
  border-bottom: 1px dotted #e6e6e6;
}

.column {
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column !important;
}

.cell-input-view-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right {
  display: flex;
  flex: 1;
  margin-left: 10px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
  padding-right: 10px;
  line-height: 16px;
  font-size: $uni-font-size-base;
  color: #222;
}

// .reason-bg{
// 	input::-webkit-input-placeholder {
// font-size: 24rpx !important;
// font-family: PingFangSC-Regular, PingFang SC;
// font-weight: 400 !important;
// color: #8C8C8C !important;
// line-height: 33rpx;
// }
// }
.reason-input::-webkit-input-placeholder {
  font-size: 20rpx !important;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400 !important;
  color: #8c8c8c !important;
  line-height: 33rpx;
}

.reason-bg {
  margin-top: 24rpx;
  background-color: #f6f6f6;
  width: 100%;
  min-height: 120rpx;
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

.boldstyle {
  margin-top: 5px;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-bottom: 10px;
}

.cell-title {
  position: relative;
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #222222;
  margin: 0 16rpx;
  line-height: 80rpx;

  &::before {
    content: "";
    position: absolute;
    top: 12px;
    left: -8px;
    width: 4rpx;
    height: 28rpx;
    background: $uni-color-primary;
  }
}

.label {
  font-size: $uni-font-size-base;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
}

::v-deep .img-upload-view {
  min-height: 0;
  padding: 0;
}
</style>
