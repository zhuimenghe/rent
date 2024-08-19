<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar-apply :business-key="subletDic.businessKey">转租详情审批</c-nav-bar-apply>
    <approve-step :itemData="itemData" @data-form="dataForm" :orgId="subletDic.orgId" :updateObj="subletDic" :NeedUpdate="true">
      <view class="content-container">
        <p class="title"><span class="line"></span>基本信息</p>
        <view class="sum-view-bg" style="margin-bottom: 5px">
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>转租单号</text><text style="color: #ff0000">*</text></view>
            <view class="cell-input-view-right">
              <text class="input-style">{{ subletDic.businessNo || "" }}</text>
            </view>
          </view>
          <select-label-item tagName="区域" hint="请选择区域" :value="subletDic.orgName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('area')" />
          <select-label-item tagName="转租申请人" hint="请选择转租申请人" :value="subletDic.userName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('apply')" />
          <select-label-item tagName="公司名称" hint="请选择转租公司" :value="subletDic.subletCompanyName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('company')" />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>联系人</text></view>
            <view class="cell-input-view-right">
              <text class="input-style">{{ subletDic.contactName || "-" }}</text>
            </view>
          </view>
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>电话</text></view>
            <view class="cell-input-view-right">
              <view class="input-style">
                <labelPhone :value="subletDic.phone" />
              </view>
            </view>
          </view>
          <select-label-item tagName="启用时间" hint="请选择启用时间" :isRequired="true" :value="changestr(subletDic.subletDate)" :icon="righticon" @clickItemLabel="showPick('time')" />
          <select-label-item tagName="运输方式" hint="请选择运输方式" :value="subletDic.transportTypeName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('trans')" />
          <view class="cell-input-view">
            <view class="cell-input-view-left"><text>运费</text></view>
            <view class="cell-input-view-right">
              <input class="input-style" type="digit" v-model="subletDic.freight" placeholder="0.00" />
            </view>
          </view>
          <select-label-item tagName="接机人" hint="请选择接机人" :value="subletDic.customerName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('assgin')" />
          <select-label-item tagName="月份计算方式" hint="请选择月份计算方式" :value="subletDic.monthTypeName" :icon="righticon" :isRequired="true" @clickItemLabel="showPick('monthType')" />
          <!-- <imgupload :isupload="false" :imgFinishlist="subletDic.fileList" />
          <text-label-item
            tagName="备注"
            :inputDisabled="true"
            :inputValue="subletDic.remark"
          /> -->
        </view>
        <p class="title">
          <span class="line"></span>
          <text style="flex: 1">转租设备</text>
          <text @click="addacc" class="sublet-button"> 修改 </text>
        </p>
        <view class="sum-view-bg">
          <view v-for="(item, index) in subletDic.orderList" :key="index" class="cell-view">
            <view class="cell-input-view">
              <view class="cell-input-view-left-top">
                <text class="input-style" style="text-align: left">
                  {{ item.typeName || "-" }} | {{ item.heightName || "-" }} |
                  {{ item.brand || "-" }}-{{ item.machineTypeName || "-" }}
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
          <EmptyData v-if="!subletDic.orderList || subletDic.orderList.length == 0" empty-text="暂无设备"></EmptyData>
        </view>
        <p class="title">
          <span class="line"></span>
          <text style="flex: 1">其他</text>
        </p>
        <view class="sum-view-bg">
          <imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="subletDic.fileList" type="sublet_type" uploadType="attachment" maximg="20" />
          <text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="subletDic.remark" />
        </view>
        <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
        <!-- :disabledAfter="false" -->
        <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" ref="date" themeColor="#E60000" />
      </view>
    </approve-step>
  </view>
</template>
<script>
import selectLabelItem from "@/components/common/uni-item/select-label-item.vue";
import uniNumberBox from "@/components/common/uni-number-box/uni-number-box.vue";
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelPhone from "@/components/common/common-ui/label-phone.vue";
import EmptyData from "@/components/common/sany/empty-data.vue";
export default {
  components: {
    selectLabelItem,
    textLabelItem,
    imgupload,
    approveStep,
    wPicker,
    labelPhone,
    EmptyData,
    uniNumberBox,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      itemData: {},
      subletDic: {},
      selectList: [],
      areaArr: [],
      applyerArr: [],
      transArr: [],
      applyArr: [],
      assignArr: [],
      settleArr: [],
      selectType: "",
      nodeList: [],
      formKey: "",
      isShowUpdate: false,
      isEditUpdate: false,
      orderListIndex: 0,
      machineListIndex: 0,
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
    };
  },
  onLoad(option) {
    if (option.item) {
      this.itemData = JSON.parse(decodeURIComponent(option.item));
      this.formKey = this.itemData.formKey;
    }
    this.getProcessNode();

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
      const orderList = this.subletDic.orderList || [];
      this.getchecklist(list, orderList);
    });
  },
  onPullDownRefresh() {
    this.headerrefresh();
  },
  methods: {
    // 通用化setCompanyInfo方法，处理不同的数据赋值逻辑
    updateDataDic(key, value) {
      this.subletDic = { ...this.subletDic, [key]: value };
    },
    headerrefresh() {
      this.getProcessNode();
      uni.stopPullDownRefresh();
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
            label: this.subletDic.orgName,
            value: this.subletDic.orgId,
          };
          this.getUserLeadersApply(dict, true);
          this.getUserLeadersAssgin(dict, true);
          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    //加载方式
    getType() {
      this.$network
        .loadType("sublet_transport_type")
        .then((result) => {
          this.transArr = result;
          if (this.transArr.length > 0 && !this.subletDic.transportType) {
            this.subletDic = {
              ...this.subletDic,
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
    showPick(type) {
      this.selectType = type;
      if (type === "area") {
        if (
          this.subletDic.partsReturnLists &&
          this.subletDic.partsReturnLists.length > 0
        ) {
          return;
        }
        this.selectList = this.areaArr;
        this.$refs.selector.show();
      } else if (type === "assgin" || type === "apply") {
        if (!this.subletDic.orgId) {
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
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId: this.applyArr[0].value,
                userName: this.applyArr[0].label,
              };
            } else {
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId: "",
                userName: "",
              };
            }
          } else {
            if (this.applyArr.length > 0) {
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                userId:
                  this.subletDic.userId && this.subletDic.userId != ""
                    ? this.subletDic.userId
                    : this.applyArr[0].value,
                userName:
                  this.subletDic.userName && this.subletDic.userName != ""
                    ? this.subletDic.userName
                    : this.applyArr[0].label,
              };
            } else {
              this.subletDic = {
                ...this.subletDic,
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
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId: this.assignArr[0].value,
                customerName: this.assignArr[0].label,
              };
            } else {
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId: "",
                customerName: "",
              };
            }
          } else {
            if (this.assignArr.length > 0) {
              this.subletDic = {
                ...this.subletDic,
                orgId: areaCode.value,
                orgName: areaCode.label,
                customerId:
                  this.subletDic.customerId && this.subletDic.customerId != ""
                    ? this.subletDic.customerId
                    : this.assignArr[0].value,
                customerName:
                  this.subletDic.customerName && this.subletDic.customerName != ""
                    ? this.subletDic.customerName
                    : this.assignArr[0].label,
              };
            } else {
              this.subletDic = {
                ...this.subletDic,
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
    getDate(time) {
      if (!time) return "";
      return time.split(/\s+/)[0];
    },
    dataForm(val) {
      this.subletDic = JSON.parse(val);
      this.subletDic.monthTypeName = this.subletDic.monthType == 1 ? '30天为一个月' : '自然月';
      this.loadAreaList();
      this.getType();
      // this.getsettleType();
    },
    getProcessNode() {
      this.workflowcommon.getOnlineList(this.itemData.businessKey).then((result) => {
        this.nodeList = result ? [...result] : [];
        this.isShowUpdate = this.isShowModel("update", this.nodeList, false);
        this.isEditUpdate = this.isEditModel(
          "update",
          this.formKey,
          this.nodeList,
          false
        );
      });
    },
    changestr(str) {
      if (str == null) {
        return "";
      }
      return str.split(" ")[0];
    },
    //添加车辆
    addacc() {
      let orderList = this.subletDic.orderList || [];
      uni.navigateTo({
        url: "./choose-device-all?list=" + encodeURIComponent(JSON.stringify(orderList)),
      });
    },
    change(e, type, i, pos) {
      switch (type) {
        case "printCode":
          this.subletDic.orderList[i].machineList[pos].printCode = e.target.value
            ? e.target.value
            : null;
          break;
        case "licenseId":
          this.subletDic.orderList[i].machineList[pos].licenseId = e.target.value
            ? e.target.value
            : null;
          break;
        default:
          break;
      }
      this.subletDic = {
        ...this.subletDic,
        orderList: this.subletDic.orderList,
      };
    },
    onConfirm(val) {
      if (this.selectType === "area") {
        let areaCode = val.checkArr;
        if (areaCode.value === this.subletDic.orgId) {
          return;
        }
        this.getUserLeadersApply(areaCode, false);
        this.getUserLeadersAssgin(areaCode, false);
      } else if (this.selectType === "apply") {
        let assginCode = val.checkArr;
        this.subletDic = {
          ...this.subletDic,
          userId: assginCode.value,
          userName: assginCode.label,
        };
      } else if (this.selectType === "assgin") {
        let assginCode = val.checkArr;
        this.subletDic = {
          ...this.subletDic,
          customerId: assginCode.value,
          customerName: assginCode.label,
        };
      } else if (this.selectType === "trans") {
        let assginCode = val.checkArr;
        this.subletDic = {
          ...this.subletDic,
          transportType: assginCode.value,
          transportTypeName: assginCode.label,
        };
      } else if (this.selectType === "monthType") {
        let assginCode = val.checkArr;
        this.subletDic = {
          ...this.subletDic,
          monthType: assginCode.value,
          monthTypeName: assginCode.label,
        };
      } else if (this.selectType === "settletype") {
        let selectCode = val.checkArr;
        let orderList = this.subletDic.orderList;
        let dict = {
          ...orderList[this.chooseIndex],
          settlementType: selectCode.value,
          settlementTypeName: selectCode.label,
        };
        orderList.splice(this.chooseIndex, 1, dict);
        this.subletDic = {
          ...this.subletDic,
          orderList: [...orderList],
        };
      } else {
        this.subletDic = {
          ...this.subletDic,
          subletDate: val.result + " 00:00:00",
        };
      }
    },
    isShowModel(model, nodeList, isFrist) {
      let isShow = false; //是否显示model
      if (nodeList.length > 0) {
        //判断当前是是否是第一步
        if (isFrist) {
          //第一步是否显示model
          if (nodeList[0].formKey && nodeList[0].formKey.indexOf(model) !== -1) {
            isShow = true;
          }
        } else {
          //
          //遍历所有到目前为止的流程中是否显示model
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].formKey && nodeList[i].formKey.indexOf(model) !== -1) {
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
    isEditModel(model, formKey, nodeList, isFrist) {
      let isEdit = false; //是否显示model
      if (formKey) {
        if (nodeList.length > 0) {
          //判断当前是是否是第一步
          let obj = null;
          if (isFrist) {
            obj = nodeList[0];
          } else {
            //
            // 判断当前流程在nodeList中是第几步
            obj = nodeList.find((o) => {
              return o.formKey === formKey;
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
          this.checkField(this.subletDic, key, message, customCheck)
        )
      ) {
        return Promise.reject("fail");
      }

      if (
        !this.subletDic.orderList.every((order) =>
          this.orderListChecks.every(({ key, message, customCheck }) =>
            this.checkField(order, key, message, customCheck)
          )
        )
      ) {
        return Promise.reject("fail");
      }
      let machines = [];
      this.subletDic.orderList.forEach((o) => {
        machines = o.machineList ? [...machines, ...o.machineList] : [...machines];
      });
      if (machines.length <= 0 || machines.some((x) => !x.licenseId)) {
        uni.showToast({
          icon: "none",
          title: "车号不能为空",
        });
        return Promise.reject("fail");
      }
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
      return new Promise((resolve, reject) => {
        this.$network
          .getData(this.$url.SUBLET_CHECK_DEVICE, "POST", machines)
          .then((result) => {
            resolve("success");
          })
          .catch((err) => {
            uni.showToast({
              icon: "none",
              title: err.details[0] ? err.details[0] : err.message,
            });
            reject("fail");
          });
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
        this.subletDic = {
          ...this.subletDic,
          orderList: list,
        };

      }
    },
    calcTotal(price, num) {
      let total = price * num;
      return this.$datestr.doubleFloat(total);
    },
    //删除配件
    deleteCar(index) {
      this.subletDic.orderList.splice(index, 1);
    },
    deleteMachine(machineIndex, index) {
      if (this.subletDic.orderList[index].machineList.length == 1) {
        this.subletDic.orderList.splice(index, 1);
        return;
      }
      this.subletDic.orderList[index].machineList.splice(machineIndex, 1);
      this.subletDic.orderList[index].orderNum = this.subletDic.orderList[
        index
      ].machineList.length;
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
    getRandomSerialNum() {
      let now = new Date();
      let date = this.$datestr.dateFormat(now, "yyMMdd");
      return "ZZC" + date + this.getUUId(8);
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
      this.subletDic.orderList.splice(index, 1, newitem);
      this.subletDic.allTotal = this.getalltotal()
    },
    getalltotal() {
      let orderList = this.subletDic.orderList;
      let num = 0;
      orderList.forEach((o) => {
        num = num + Number(o.orderNum);
      });
      return num.toString();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_sublet-styles";

.content {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.content-container {}

.sum-view-bg {
  display: flex;
  flex-direction: column;
  flex: 1;
  //   margin: 10px;
  background: #ffffff;
  // border-radius: 4px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  //   margin: 10px;
  font-size: $uni-font-size-base;
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
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  flex: 1;
  text-align: right;
}

.choose-device-text {
  color: $uni-color-primary;
}

.item-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 6px 16px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-tag {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: flex-start;
}

.item-title {
  border-color: $uni-bg-color-grey;
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  padding: 4px 0px;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 16px;
  font-size: $uni-font-size-base;
  border-color: $uni-bg-color-grey;
  border-width: 1px 0px 0px 0px;
  border-style: solid;
  color: #ff0000;
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
  border-radius: 20px;
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
  border-radius: 20px;
  background: $uni-color-primary;
  font-size: $uni-font-size-lg;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.tag-view {
  display: flex;
  height: 24px;
  line-height: 24px;
  padding: 0px 4px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: 3px;
}

.tag1 {
  background: #eef9e8;
  color: #57c32d;
}

.tag2 {
  background: #f9f0ff;
  color: #722ed1;
}

.tag3 {
  background: #fff0e9;
  color: #fb7135;
}

.tag4 {
  background: #fff1f0;
  color: #e60000;
}

.tag5 {
  background: $uni-color-primary;
  color: #ffffff;
}

.tag6 {
  background: #fff8ee;
  color: #fca01f;
}

.line-tag {
  min-width: 64px;
}

.row-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: $uni-font-size-base;
  min-height: 30px;
}

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
