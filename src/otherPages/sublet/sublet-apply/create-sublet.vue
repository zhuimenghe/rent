<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <create-step processKey="sublet" @submitApply="clicksave" :orgId="dataDic.orgId" :itemData="backDic" @data-form="getBackData" :updateObj="dataDic" :isUpdate="isUpdate">
      <view class="creat-bg">
        <p class="title"><span class="line"></span>基本信息</p>
        <view class="sum-view-bg">
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>转租单号</text><text style="color: #ff0000">*</text></view>
            <view class="cell-input-view-right">
              <text class="input-style">{{ dataDic.businessNo || "" }}</text>
            </view>
          </view>
          <select-label-item tagName="区域" hint="请选择区域" :value="dataDic.orgName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('area')" />
          <select-label-item tagName="转租申请人" hint="请选择转租申请人" :value="dataDic.userName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('apply')" />
          <select-label-item tagName="公司名称" hint="请选择转租公司" :value="dataDic.subletCompanyName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('company')" />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>联系人</text></view>
            <view class="cell-input-view-right">
              <text class="input-style">{{ dataDic.contactName || "--" }}</text>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>电话</text></view>
            <view class="cell-input-view-right">
              <view class="input-style">
                <labelPhone :value="dataDic.phone" />
              </view>
            </view>
          </view>
          <select-label-item tagName="启用时间" hint="请选择启用时间" :isRequired="true" :value="changestr(dataDic.subletDate)" :icon="righticon" @clickItemLabel="showPick('time')" />
          <select-label-item tagName="运输方式" hint="请选择运输方式" :value="dataDic.transportTypeName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('trans')" />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>运费</text></view>
            <view class="cell-input-view-right">
              <input class="input-style" type="digit" v-model="dataDic.freight" placeholder="0.00" />
            </view>
          </view>
          <select-label-item tagName="接机人" hint="请选择接机人" :value="dataDic.customerName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('assgin')" />
          <select-label-item tagName="月份计算方式" hint="请选择月份计算方式" :value="dataDic.monthTypeName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('monthType')" />
        </view>
        <p class="title">
          <span class="line"></span>
          <text style="flex: 1">转租设备</text>
          <text @click="addacc" class="sublet-button"> 新增 </text>
        </p>
        <view class="sum-view-bg">
          <view v-for="(item, index) in dataDic.orderList" :key="index" class="cell-view">
            <view class="cell-input-view">
              <view class="cell-input-view-left-top">
                <text class="input-style" style="text-align: left">
                  {{ item.typeName || "--" }} | {{ item.heightName || "--" }} |
                  {{ item.brand || "--" }}-{{ item.machineTypeName || "--" }}
                </text>
              </view>
              <view style="margin-left: 15px">
                <uni-number-box :min="1" background="transparent" color="#e60000" :compare="false" @change="getNumValue($event, index, item)" :value="item.orderNum" />
              </view>
            </view>
            <view class="cell-input-view">
              <view class="cell-input-view-left" style="color: #999999">日租金</view>
              <view class="cell-input-view-right">
                <input class="input-style" type="digit" v-model="item.price" @input="checkPrice($event, index, 'price')" placeholder="单价(元)/天" />
              </view>
            </view>
            <view class="cell-input-view">
              <view class="cell-input-view-left" style="color: #999999">月租金</view>
              <view class="cell-input-view-right">
                <input class="input-style" type="digit" v-model="item.hireMonthly" @input="checkPrice($event, index, 'hireMonthly')" placeholder="单价(元)/月" />
              </view>
            </view>
            <view class="machine-list">
              <view v-for="(machineItem, machineIndex) in item.machineList" :key="machineIndex" class="machine-item">
                <view class="cell-input-view">
                  <view class="cell-input-view-left" style="color: #999999">机号</view>
                  <view class="cell-input-view-right">
                    <input class="input-style" type="text" v-model="machineItem.licenseId" placeholder="请输入机号" />
                  </view>
                </view>
                <view class="cell-input-view">
                  <view class="cell-input-view-left" style="color: #999999">自喷码（编码）</view>
                  <view class="cell-input-view-right">
                    <input class="input-style" type="text" v-model="machineItem.printCode" placeholder="请输入自喷码(编码)" />
                  </view>
                </view>
                <view class="cell-input-view machine-delect-cell">
                  <view class="cell-input-view-right" style="justify-content: flex-end;">
                    <text class="input-style" style="color: #ff0000;flex: initial;" @click="deleteMachine(machineIndex, index)">删除</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="cell-input-view">
              <view class="cell-input-view-right" style="justify-content: flex-end;">
                <text class="input-style" style="color: #ff0000;flex: initial;" @click="deleteCar(index)">删除</text>
              </view>
            </view>
          </view>
          <EmptyData v-if="!dataDic.orderList || dataDic.orderList.length == 0" empty-text="暂无设备"></EmptyData>
        </view>
        <p class="title">
          <span class="line"></span>
          <text style="flex: 1">其他</text>
        </p>
        <view class="sum-view-bg">
          <imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="dataDic.fileList" type="sublet_type" uploadType="attachment" maximg="20" />
          <text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="dataDic.remark" />
        </view>
        <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
        <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
      </view>
    </create-step>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import uniNumberBox from "@/components/common/uni-number-box/uni-number-box.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import createStep from "@/components/workflow/create-step.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import subletJudge from "./sublet-apply-list.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";

export default {
  name: "create-sublet",
  components: {
    selectLabelItem,
    textLabelItem,
    labelArrow,
    imgupload,
    createStep,
    wPicker,
    labelPhone,
    EmptyData,
    uniNumberBox,
  },
  computed: {},
  watch: {
    "dataDic.freight"(val) {
      this.dataDic = {
        ...this.dataDic,
        freight: val,
      };
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        this.dataDic = {
          ...this.dataDic,
          freight: val,
        };
      }, 10);
    },
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      dataDic: {
        freight: "",
      },
      backDic: null,
      isUpdate: false,
      //数据
      selectList: [],
      areaArr: [],
      applyerArr: [],
      transArr: [],
      applyArr: [],
      assignArr: [],
      settleArr: [],
      selectType: "",
      chooseIndex: 0,
      nodeList: [],
      fieldsToCheck: [
        { key: "orgId", message: "请选择区域" },
        { key: "subletCompanyName", message: "请选择转租公司" },
        { key: "subletDate", message: "请选择启用时间" },
        { key: "transportType", message: "请选择运输方式" },
        { key: "customerId", message: "请选择接机人" },
        { key: "monthType", message: "请选择月份计算方式" },
        {
          key: "orderList",
          message: "请新增转租车辆",
          customCheck: (value) => Array.isArray(value) && value.length > 0,
        },
      ],
      orderListChecks: [
        {
          key: "orderNum",
          message: "存在数量为零的转租车辆",
          customCheck: (o) => !!o && o != 0,
        },
        {
          key: "price",
          message: "转租车辆的日租金必须大于0",
          customCheck: (value, entireObject) => {
            const priceValid = value && value !== "" && Number(value) > 0;
            const hireMonthlyValid =
              entireObject.hireMonthly &&
              entireObject.hireMonthly !== "" &&
              Number(entireObject.hireMonthly) > 0;

            // 至少一个字段大于0
            return priceValid || hireMonthlyValid;
          },
        },
        {
          key: "hireMonthly",
          message: "转租车辆的月租金必须大于0",
          customCheck: (value, entireObject) => {
            const priceValid =
              entireObject.price &&
              entireObject.price !== "" &&
              Number(entireObject.price) > 0;
            const hireMonthlyValid = value && value !== "" && Number(value) > 0;

            // 至少一个字段大于0
            return priceValid || hireMonthlyValid;
          },
        },
      ],
      formKey: "",
      isShowUpdate: false,
      isEditUpdate: false,
    };
  },
  onLoad(option) {
    // 处理退回编辑或撤回提交
    if (option.item) {
      this.backDic = JSON.parse(decodeURIComponent(option.item));

      this.isUpdate = option.isUpdate === "1";
      uni.setNavigationBarTitle({ title: "修改转租申请" });
      // 更新相关数据
      Object.entries(this.backDic).forEach(([key, value]) => {
        this.updateDataDic(key, value);

      });

    } else {
      const resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
      const [orgName] = resData.orgName.split("|");
      const business = this.$gxfmethod.issameRoleType(
        resData,
        this.$savekey.USER_ROLE_BUSINESS
      );
      const service = this.$gxfmethod.issameRoleType(
        resData,
        this.$savekey.USER_ROLE_SEVICER
      );
      // 初始化dataDic
      this.updateDataDic("orgName", orgName);
      this.updateDataDic("orgId", resData.orgIds[0]);
      this.updateDataDic("userId", business ? resData.id : "");
      this.updateDataDic("userName", business ? resData.username : "");
      this.updateDataDic("customerId", service ? resData.id : "");
      this.updateDataDic("customerName", service ? resData.username : "");
      this.getBusinessNo();
      this.loadAreaList();
      this.getType();
      // this.getsettleType();
    }

    // 事件监听
    uni.$on("choose-company-emit", (data) => {
      const dict = data.dict;
      this.updateDataDic("subletCompanyId", dict.id);
      this.updateDataDic("subletCompanyName", dict.name);
      this.updateDataDic("contactName", dict.contact);
      this.updateDataDic("phone", dict.phone);
    });

    uni.$on("choose-device-emit", (usnerinfo) => {
      const list = usnerinfo.list || [];
      const orderList = this.dataDic.orderList || [];
      this.getchecklist(list, orderList);
    });

    // 统计数据
    this.$gxfmethod.statisticData(
      this.$eventId.Sublet_Administrative,
      "转租申请",
      "新增"
    );

    // 处理传递过来的companyId
    if (option.companyId) {
      this.getCompanyInfo(option.companyId).then((companyInfo) => {
        // 使用updateDataDic更新公司信息
        this.updateDataDic("subletCompanyId", companyInfo.id);
        this.updateDataDic("subletCompanyName", companyInfo.name);
        this.updateDataDic("contactName", companyInfo.contact);
        this.updateDataDic("phone", companyInfo.phone);
      });
    }
  },
  onUnload() {
    // 取消监听事件
    uni.$off("choose-company-emit");
    uni.$off("choose-device-emit");
  },
  methods: {
    // 通用化setCompanyInfo方法，处理不同的数据赋值逻辑
    updateDataDic(key, value) {
      this.dataDic = { ...this.dataDic, [key]: value };
    },
    //获取第一个节点的formKey
    getProcessNode() {
      this.workflowcommon.getApplyProcessNode("sublet").then((result) => {
        if (result && result.length > 0) {
          this.nodeList = [...result];
          this.formKey = result[0].formKey;
          this.isShowUpdate = subletJudge.isShowModel("update", this.nodeList, false);
          this.isEditUpdate = subletJudge.isEditModel(
            "update",
            this.formKey,
            this.nodeList,
            false
          );
        }
      });
    },
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    // 获取退回后通过dataForm接口获取的数据详情
    getBackData(val) {
      this.dataDic = JSON.parse(val);
      this.dataDic.monthTypeName = this.dataDic.monthType == 1 ? '30天为一个月' : '自然月';
      this.loadAreaList();
      this.getType();
      // this.getsettleType();
    },
    // 获取单号
    getBusinessNo() {
      let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, "ZZD");
      this.$network
        .getData(url, "GET", null)
        .then((result) => {
          this.dataDic = {
            ...this.dataDic,
            businessNo: result,
          };
        })
        .catch((err) => { });
    },
    // 假设的getCompanyInfo方法
    getCompanyInfo(companyId) {
      let urlstr = this.$url.SUBLET_CONMPANY_DETAIL.replace(
        /{subletCompanyId}/,
        companyId
      );
      return this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          return result; // 返回获取到的公司信息
        })
        .catch((err) => {
          // 错误处理逻辑
          console.error("Error fetching company info:", err);
        });
    },
    //撤回时获取详情
    loaddata(key) {
      let param = {
        businessNo: key,
      };
      let url = this.$url.SUBLET_APPLY_DETAIL;
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          this.dataDic = {
            ...result,
          };
          this.loadAreaList();
          this.getType();
          // this.getsettleType();
        })
        .catch((err) => { });
    },
    //获取区域
    loadAreaList() {
      uni.showLoading();
      let urlstr = this.$url.ORG_LIST;
      this.$network
        .getData(urlstr, "GET", null)
        .then((result) => {
          let list = result;
          this.areaArr = this.getChildren(list);
          let dict = {
            label: this.dataDic.orgName,
            value: this.dataDic.orgId,
          };
          this.getUserLeadersApply(dict, true);
          this.getUserLeadersAssgin(dict, true);
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
        });
      }
      return arr;
    },
    //加载服务人员
    getUserLeadersApply(areaCode, isfirst) {
      let param = {
        showAdmin: false,
        orgId: areaCode.value,
        roleType: this.$savekey.USER_ROLE_BUSINESS,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          this.applyArr = result.map((o) => {
            return {
              label: o.username,
              value: o.id,
            };
          });
          if (!isfirst) {
            if (this.applyArr.length > 0) {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId: this.applyArr[0].value,
                userName: this.applyArr[0].label,
              };
            } else {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId: "",
                userName: "",
              };
            }
          } else {
            if (this.applyArr.length > 0) {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId:
                  this.dataDic.userId && this.dataDic.userId != ""
                    ? this.dataDic.userId
                    : this.applyArr[0].value,
                userName:
                  this.dataDic.userName && this.dataDic.userName != ""
                    ? this.dataDic.userName
                    : this.applyArr[0].label,
              };
            } else {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId: "",
                userName: "",
              };
            }
          }
        })
        .catch((err) => { });
    },
    getUserLeadersAssgin(areaCode, isfirst) {
      let param = {
        showAdmin: false,
        orgId: areaCode.value,
        roleType: this.$savekey.USER_ROLE_SEVICER,
      };
      this.$network
        .getData(this.$url.USER_LEADERS, "GET", param)
        .then((result) => {
          this.assignArr = result.map((o) => {
            return {
              label: o.username,
              value: o.id,
            };
          });
          if (!isfirst) {
            if (this.assignArr.length > 0) {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId: this.assignArr[0].value,
                customerName: this.assignArr[0].label,
              };
            } else {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId: "",
                customerName: "",
              };
            }
          } else {
            if (this.assignArr.length > 0) {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId:
                  this.dataDic.customerId && this.dataDic.customerId != ""
                    ? this.dataDic.customerId
                    : this.assignArr[0].value,
                customerName:
                  this.dataDic.customerName && this.dataDic.customerName != ""
                    ? this.dataDic.customerName
                    : this.assignArr[0].label,
              };
            } else {
              this.dataDic = {
                ...this.dataDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId: "",
                customerName: "",
              };
            }
          }
        })
        .catch((err) => { });
    },
    //加载方式
    getType() {
      this.$network
        .loadType("sublet_transport_type")
        .then((result) => {
          this.transArr = result;
          if (this.transArr.length > 0 && !this.dataDic.transportType) {
            this.dataDic = {
              ...this.dataDic,
              transportType: this.transArr[0].value,
              transportTypeName: this.transArr[0].label,
            };
          }
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    getsettleType() {
      this.$network
        .loadType("settlement_type")
        .then((result) => {
          this.settleArr = result ? result.filter((o) => o.value != "6") : [];
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //选择器
    showType(item, index) {
      this.selectType = "settletype";
      this.chooseIndex = index;
      this.selectList = this.settleArr;
      this.$refs.selector.show();
    },
    showPick(type) {
      this.selectType = type;
      if (type === "area") {
        if (this.dataDic.partsReturnLists && this.dataDic.partsReturnLists.length > 0) {
          return;
        }
        this.selectList = this.areaArr;
        this.$refs.selector.show();
      } else if (type === "assgin" || type === "apply") {
        if (!this.dataDic.orgId) {
          uni.showToast({
            title: "请选择区域",
            icon: "none",
          });
          return;
        }
        if (type == "assgin") {
          this.selectList = [...this.assignArr];
        } else {
          this.selectList = [...this.applyArr];
        }
        this.$refs.selector.show();
      } else if (type === "trans") {
        this.selectList = this.transArr;
        this.$refs.selector.show();
      } else if (type === "company") {
        uni.navigateTo({
          url: "./sublet-choose-company",
        });
      } else if (type === "monthType") {
        this.selectList = [{
          label: "30天为一个月",
          value: "1"
        }, {
          label: "自然月",
          value: "2"
        }];
        this.$refs.selector.show();
      } else {
        this.$refs.date.show();
      }
    },
    onConfirm(val) {
      if (this.selectType === "area") {
        let areaCode = val.checkArr;
        if (areaCode.value === this.dataDic.orgId) {
          return;
        }
        this.getUserLeadersApply(areaCode, false);
        this.getUserLeadersAssgin(areaCode, false);
      } else if (this.selectType === "apply") {
        let assginCode = val.checkArr;
        this.dataDic = {
          ...this.dataDic,
          userId: assginCode.value,
          userName: assginCode.label,
        };
      } else if (this.selectType === "assgin") {
        let assginCode = val.checkArr;
        this.dataDic = {
          ...this.dataDic,
          customerId: assginCode.value,
          customerName: assginCode.label,
        };
      } else if (this.selectType === "trans") {
        let assginCode = val.checkArr;
        this.dataDic = {
          ...this.dataDic,
          transportType: assginCode.value,
          transportTypeName: assginCode.label,
        };
      } else if (this.selectType === "monthType") {
        let assginCode = val.checkArr;
        this.dataDic = {
          ...this.dataDic,
          monthType: assginCode.value,
          monthTypeName: assginCode.label,
        };
      } else if (this.selectType === "settletype") {
        let selectCode = val.checkArr;
        let orderList = this.dataDic.orderList;
        let dict = {
          ...orderList[this.chooseIndex],
          settlementType: selectCode.value,
          settlementTypeName: selectCode.label,
        };
        orderList.splice(this.chooseIndex, 1, dict);
        this.dataDic = {
          ...this.dataDic,
          orderList: [...orderList],
        };
      } else {
        this.dataDic = {
          ...this.dataDic,
          subletDate: val.result + " 00:00:00",
        };
      }
    },
    // 创建机器列表
    // Create machine
    createMachine() {
      return {
        licenseId: this.getRandomSerialNum(), // 生成许可证 ID
        printCode: null, // 根据需要设置 printCode
        actualSubletDate: null, // 使用 dataDic 中的 subletDate 或默认值
      };
    },
    //数量监听
    getNumValue(val, index, item) {
      // 获取当前 machineList
      // Get the current machineList
      let machineList = item.machineList || [];
      let currentNum = machineList.length;
      let newNum = parseInt(val);

      // 根据新旧数量比较，增加或减少 machineList 中的元素
      // Compare the new and old quantities to increase or decrease elements in machineList
      if (newNum > currentNum) {
        // 如果新数量大于当前数量，添加新元素
        // If the new quantity is greater than the current, add new elements
        for (let i = currentNum; i < newNum; i++) {
          machineList.push(this.createMachine());
        }
      } else if (newNum < currentNum) {
        // 如果新数量小于当前数量，移除最后的元素
        // If the new quantity is less than the current, remove the last elements
        machineList = machineList.slice(0, newNum);
      }
      let licenseIdList = machineList.map((machine) => machine.licenseId);
      // 创建新的 item 对象
      // Create a new item object
      let newitem = {
        ...item,
        orderNum: val.toString(),
        machineList: machineList,
        licenseIdList: licenseIdList,
        allTotal: this.calcTotal(item.price, val),
      };

      // 更新 dataDic.orderList
      // Update dataDic.orderList
      this.dataDic.orderList.splice(index, 1, newitem);
    },
    getLiseceIds(num) {
      let list = [];
      for (let i = 0; i < num; i++) {
        list.push(this.getRandomSerialNum());
      }
      return list;
    },
    getRandomSerialNum() {
      let now = new Date();
      let date = this.$datestr.dateFormat(now, "yyMMdd");
      return "ZZC" + date + this.getUUId(8);
    },
    getUUId(size) {
      let s = [];
      let hexDigits = "0123456789ABCDEF";
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      let uuid = s.join("");
      // 返回前8位
      return size ? uuid.substr(0, size) : uuid;
    },
    calcTotal(price, num) {
      let total = price * num;
      return this.$datestr.doubleFloat(total);
    },
    //输入监听
    checkPrice(e, index, type) {
      let val = e.detail.value;
      setTimeout(() => {
        val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        val = val.replace(/^\./g, ""); //验证第一个字符是数字
        val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        let newlist = [...this.dataDic.orderList];
        if (type === "price") {
          let newitem = {
            ...newlist[index],
            price: val,
          };
          this.dataDic.orderList.splice(index, 1, newitem);
        } else {
          let newitem = {
            ...newlist[index],
            hireMonthly: val,
          };
          this.dataDic.orderList.splice(index, 1, newitem);
        }
      }, 10);
    },
    //添加车辆
    addacc() {
      let orderList = this.dataDic.orderList || [];
      uni.navigateTo({
        url: "./choose-device-all?list=" + encodeURIComponent(JSON.stringify(orderList)),
      });
    },
    // 获取设备类型列表
    // Get the machineList
    getchecklist(newlist, oldList) {
      if (newlist) {
        let list = newlist.map((item) => {
          // 在旧列表中寻找匹配的项目
          // Find the matching item in the old list
          let matchedItem = oldList.find((o) => o.machineType === item.id);

          if (matchedItem) {
            // 如果找到匹配项，返回原项目
            // If a match is found, return the original item
            return matchedItem;
          } else {
            // 否则，创建一个带有默认值的新项目
            // Otherwise, create a new item with default values
            return {
              ...item,
              id: null,
              machineType: item.id,
              machineTypeName: item.name,
              price: "",
              orderNum: 1, // 默认订单数量
              machineList: Array.from({ length: 1 }, () => this.createMachine()), // 使用 createMachine 创建机器列表
              licenseIdList: [], // 默认许可证 ID 列表
            };
          }
        });
        // 更新 dataDic.orderList
        // Update dataDic.orderList
        this.dataDic = {
          ...this.dataDic,
          orderList: list,
        };

      }
    },
    //删除配件
    deleteCar(index) {
      this.dataDic.orderList.splice(index, 1);
    },
    deleteMachine(machineIndex, index) {
      if (this.dataDic.orderList[index].machineList.length == 1) {
        this.dataDic.orderList.splice(index, 1);
        return;
      }
      this.dataDic.orderList[index].machineList.splice(machineIndex, 1);
      this.dataDic.orderList[index].orderNum = this.dataDic.orderList[
        index
      ].machineList.length;
    },
    //备注
    remarkmethod(val) {
      this.dataDic = {
        ...this.dataDic,
        remark: val,
      };
    },
    //取消按钮
    clickecancle() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.dataDic = {
        ...this.dataDic,
        fileList: list,
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.dataDic = {
        ...this.dataDic,
        fileList: list,
      };
    },
    checkField(obj, key, message, customCheck = (value) => !!value) {
      // 通用字段检查函数
      // 检查给定对象的指定字段是否满足自定义验证（默认为非空检查）
      if (!customCheck(obj[key], obj)) {
        uni.showToast({ title: message, icon: "none" });
        return false;
      }
      return true;
    },
    checkData() {
      if (
        !this.fieldsToCheck.every(({ key, message, customCheck }) =>
          this.checkField(this.dataDic, key, message, customCheck)
        )
      ) {
        return Promise.reject("fail");
      }

      if (
        !this.dataDic.orderList.every((order) =>
          this.orderListChecks.every(({ key, message, customCheck }) =>
            this.checkField(order, key, message, customCheck)
          )
        )
      ) {
        return Promise.reject("fail");
      }
      let machines = [];
      this.dataDic.orderList.forEach((o) => {
        machines = o.machineList ? [...machines, ...o.machineList] : [...machines];
      });
      const uniqueLicenseIds = new Set();
      const licenseIdPattern = /^[A-Z0-9]+$/; // 只匹配大写字母和数字

      for (const item of machines) {
        if (!licenseIdPattern.test(item.licenseId)) {
          uni.showToast({
            icon: "none",
            title: "机号只能包含大写字母和数字",
          });
          return Promise.reject("机号只能包含大写字母和数字");
        }
        uniqueLicenseIds.add(item.licenseId);
      }

      if (uniqueLicenseIds.size !== machines.length) {
        uni.showToast({
          icon: "none",
          title: "车号不能重复",
        });
        return Promise.reject("duplicate licenseId");
      }

      // 设置默认运费并计算总金额，同时处理 orderList 生成 machineList
      this.dataDic = {
        ...this.dataDic,
        freight: this.dataDic.freight || "0.00",
        allTotal: this.getalltotal(),
        orderList: this.dataDic.orderList.map((o) => ({
          ...o,
          machineList: Array.from({ length: o.orderNum }, (_, index) => {
            const existingMachine = o.machineList && o.machineList[index];
            return {
              licenseId: existingMachine?.licenseId || this.getRandomSerialNum(),
              printCode: existingMachine?.printCode || null,
              actualSubletDate: existingMachine?.actualSubletDate || null,
            };
          }),
        })),
      };

      return Promise.resolve("success");
    },
    getalltotal() {
      let orderList = this.dataDic.orderList;
      let num = 0;
      orderList.forEach((o) => {
        num = num + Number(o.orderNum);
      });
      return num.toString();
    },
    //确定按钮
    clicksave(val) {
      uni.showLoading({
        mask: true,
      });
      this.$network
        .getData(this.$url.CREATE_SUBLET_APPLY + val, "POST", this.dataDic)
        .then((result) => {
          uni.$emit("refresh-sublet-list", {
            type: "",
          });
          uni.$emit("refresh-notification-list", {
            type: "apply",
          });
          uni.navigateBack({
            animationDuration: 200,
          });
          uni.hideLoading();
        })
        .catch((err) => {
          uni.showToast({
            title: err.message + "," + err.details[0],
            icon: "none",
          });
          uni.hideLoading();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_sublet-styles";

.machine-list {
  margin: 25upx;


  .machine-item {
    margin: 20rpx 0;
    border: 1upx solid #eeeeee;
  }

  .machine-delect-cell {
    background-color: #f4f4f4;
  }
}
</style>
