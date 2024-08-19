<template>
  <view class="sum-view-bg" style="margin: 0px">
    <view
      class="cell-input-view"
      style="
        border-bottom-width: 1px;
        border-bottom-color: #eeeeee;
        border-bottom-style: solid;
      "
    >
      <view class="cell-input-view-left boldstyle">
        <text>车辆调度</text>
      </view>
    </view>
    <!-- <selectorPick
      title="物流类型"
      placeholder="请选择物流方式"
      :content="dataDic.logisticsTypeName"
      @clickItem="chooseType('usetrans')"
      :isEdit="isedit"
    /> -->
    <view
      class="cell-input-view"
      style="justify-content: space-between"
      v-if="dataDic.logisticsType != '1'"
    >
      <view class="cell-input-view-left">
        <text style="font-weight: bold">物流信息</text>
      </view>
    </view>
    <view
      v-if="dataDic.logisticsType == '2'"
      style="display: flex; flex-direction: column"
    >
      <selectorPick
        title="物流公司"
        placeholder="请选择物流公司"
        :content="dataDic.logisticsCompanyName"
        @clickItem="gotoTrans"
        :isEdit="isedit"
      />
      <view
        v-if="dataDic.logisticsCompanyId"
        style="display: flex; flex-direction: column"
      >
        <selectorInput
          title="物流联系人"
          placeholder="请输入物流联系人"
          :content="dataDic.logisticsContact"
          :isRequire="false"
          @textChage="textChange($event, 'logisticsContact')"
          textType="text"
          :isEdit="isedit"
        />
        <selectorInput
          v-if="isedit"
          title="联系人电话"
          placeholder="请输入联系人电话"
          :content="dataDic.logisticsPhone"
          :isRequire="false"
          @textChage="textChange($event, 'logisticsPhone')"
          textType="text"
        />
        <selectorPick
          v-if="!isedit"
          :isRequire="false"
          :isEdit="false"
          title="手机号"
          :content="dataDic.logisticsPhone"
          type="phone"
        />
      </view>
    </view>
    <view
      v-if="dataDic.logisticsType == '3'"
      style="display: flex; flex-direction: column"
    >
      <selectorPick
        title="物流车辆"
        placeholder="请选择物流车辆"
        :content="mNames"
        @clickItem="goTo('transportMachine')"
        :isEdit="isedit"
      />
      <selectorPick
        title="物流司机"
        placeholder="请选择物流司机"
        :content="dNames"
        @clickItem="goTo('transportDriver')"
        :isEdit="isedit"
      />
    </view>
    <selectorInput
      title="物流运费"
      placeholder="0.00"
      :content="isShowMoney(dataDic.logisticsCarriage)"
      :isRequire="true"
      @textChage="textChange($event, 'logisticsCarriage')"
      textType="text"
      :isEdit="isedit"
    />
    <selectortextArea
      title="物流备注"
      placeholder="请输入物流备注"
      :content="dataDic.logisticsRemark"
      :isRequire="false"
      @textChage="remarkmethod"
      :isEdit="isedit"
    />
    <view
      class="cell-input-view"
      style="justify-content: space-between"
      v-if="showCarList"
    >
      <view class="cell-input-view-left"
        ><text style="font-weight: bold">设备信息</text></view
      >
      <scanView
        :compareTime="dataDic.preEnableDate"
        :workCheckResults="workCheckResults"
        :machines="dataDic.machines"
        :orderList="dataDic.orders"
        @setScanMachines="setScanMachines"
        v-if="isedit"
      />
    </view>
    <list class="workin-dd-list" v-if="showCarList">
      <cell
        class="workin-dd-list-cell"
        v-for="(item, index) in dataDic.orders"
        :key="index"
        v-if="parseInt(item.usedNum) > 0"
      >
        <view class="cell-input-view-machine">
          <view class="cell-input-view-machine-left">
            <text class="tag-view-base tag1">{{ item.typeName || "" }}</text>
            <text class="tag-view-base tag2">{{ item.heightName || "" }}</text>
            <text class="tag-view-base tag3">{{ item.usedNum || "" }}台</text>
            <text class="tag-view-base tag4">{{ item.settlementTypeName || "" }}</text>
            <text
              class="tag-view-base tag4"
              v-if="item.settlementType != '4' && item.settlementType != '6'"
              >¥{{ $gxfmethod.getMoneyS(item.hire, false) }}/{{ getType(item) }}</text
            >
            <text
              class="tag-view-base tag4"
              v-if="item.settlementType === '4' || item.settlementType === '6'"
              >¥{{ $gxfmethod.getMoneyS(item.hire, false) }}/天 ¥{{
                $gxfmethod.getMoneyS(item.hireMonthly, false)
              }}/月</text
            >
          </view>
          <view class="cell-input-view-machine-right" v-if="isedit">
            <text class="tag-view-base tag5" @click="gotoDdCar(index, item)">{{
              "调度"
            }}</text>
          </view>
        </view>
        <view
          class="cell-input-view-machine-list"
          v-for="(mitem, mindex) in item.machineList"
          :key="mindex"
        >
          <view class="cell-input-view-machine-list-head">
            <view class="head-top">
              <view class="cell-input-view-list-btn-print">
                <text>自喷码: {{ mitem.printCode || "-" }}</text>
                <view class="replace-text" v-if="item.height != mitem.machineHeight"
                  >【替】</view
                >
              </view>
              <view class="head-bottom">
                <text
                  >{{ mitem.machineBrand || "--" }}-{{ mitem.machineTypeName || "--" }} |
                  {{ mitem.licenseId || "--" }}</text
                >
              </view>
              <view class="cell-input-view-list-row">
                <view class="cell-input-view-left text-color"><text>当前位置</text></view>
                <view class="cell-input-view-right" style="margin-left: 10px">
                  <text class="input-style-list">{{ mitem.address || "--" }}</text>
                </view>
              </view>
            </view>
            <view class="cell-input-view-list-btn">
              <text
                v-if="isedit"
                class="tag-view-base-btn delbtn"
                @click="deleteCar(index, item, mindex, mitem)"
                >删除</text
              >
            </view>
          </view>
        </view>
      </cell>
    </list>
  </view>
</template>

<script>
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";

import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import scanView from "@/businessPages/components/device-scan-view.vue";
export default {
  components: {
    selectortextArea,
    selectorPick,
    selectorInput,
    selectorInputIcon,
    labelArrow,
    imgupload,
    scanView,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      logisticsCarriage: "0",
      choosetypeArr: [],
      carindex: 0,
      workCheckResults: [],
      mNames: "",
      dNames: "",
    };
  },
  props: {
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
    isedit: {
      type: Boolean,
      default: true,
    },
    showCarList: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dataDic(val) {
      console.log(JSON.stringify(val));
    },
    // logisticsCarriage(val) {
    // 	this.logisticsCarriage = val;
    // 	setTimeout(() => {
    // 		val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
    // 		val = val.replace(/^\./g, ''); //验证第一个字符是数字
    // 		val = val.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
    // 		val = val
    // 			.replace('.', '$#$')
    // 			.replace(/\./g, '')
    // 			.replace('$#$', '.');
    // 		val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    // 		this.logisticsCarriage = val;
    // 		let dictNew = {
    // 			...this.dataDic,
    // 			logisticsCarriage: this.logisticsCarriage
    // 		};
    // 		this.$emit('clickevent', {
    // 			type: 'value',
    // 			data: dictNew
    // 		});
    // 	}, 10);
    // },
    // 'dataDic.logisticsContact'(val) {
    // 	console.log(val);
    // 	let dict = {
    // 		...this.dataDic,
    // 		logisticsContact: val
    // 	};
    // 	this.$emit('clickevent', {
    // 		type: 'value',
    // 		data: dict
    // 	});
    // },
    // 'dataDic.logisticsPhone'(val) {
    // 	console.log(val);
    // 	let dict = {
    // 		...this.dataDic,
    // 		logisticsPhone: val
    // 	};
    // 	this.$emit('clickevent', {
    // 		type: 'value',
    // 		data: dict
    // 	});
    // },
    "dataDic.transportMachine"(val) {
      this.getVehicleName();
    },
    "dataDic.transportDriver"(val) {
      this.getDriverName();
    },
  },
  created() {
    this.logisticsCarriage = this.dataDic.logisticsCarriage || "0";
    this.getDriverName();
    this.getVehicleName();
    this.getdata();
    //设备
    uni.$on("choose-workincar-emit", (usnerinfo) => {
      let list = usnerinfo.list;
      let machineList = [];
      let orderslist = this.dataDic.orders;
      let choosedict = orderslist[this.carindex];
      let oldList = choosedict.machineList || [];
      list.forEach((item) => {
        let filterlist = oldList.filter((o) => {
          return o.licenseId === item.licenseId;
        });
        let dict = {
          licenseId: item.licenseId,
          machineBrand: item.brand,
          machineType: choosedict.typeName,
          machineTypeName: item.machineTypeName,
          printCode: item.printCode,
          machineHeight: item.machineHeight,
          machineHeightName: item.machineHeightName,
          address: item.address,
          orgId: item.orgId,
          orgName: item.orgName,
          workCheckResults:
            filterlist.length > 0
              ? filterlist[0].workCheckResults
              : this.workCheckResults,
        };
        machineList.push(dict);
      });
      choosedict.machineList = machineList;
      orderslist[this.carindex] = choosedict;
      let dict = {
        ...this.dataDic,
        orders: [...orderslist],
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    });
  },
  methods: {
    isShowMoney(str) {
      if (this.isedit) {
        if (str == 0) {
          return "";
        }
        return str;
      }
      return str;
    },
    textChange(val, type) {
      if (type == "logisticsContact") {
        let dict = {
          ...this.dataDic,
          logisticsContact: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      }
      if (type == "logisticsPhone") {
        let dict = {
          ...this.dataDic,
          logisticsPhone: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      }
      if (type == "logisticsCarriage") {
        let dict = {
          ...this.dataDic,
          logisticsCarriage: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
        setTimeout(() => {
          let dict = {
            ...this.dataDic,
            logisticsCarriage: this.$gxfmethod.getMoneyPart(val),
          };
          this.$emit("clickevent", {
            type: "value",
            data: dict,
          });
        }, 30);
      }
    },
    setScanMachines(orderList) {
      let dict = {
        ...this.dataDic,
        orders: [...orderList],
      };
      this.$emit("clickevent", {
        type: "scanMachines",
        data: dict,
      });
      // this.$emit('clickevent', {
      // 	type: "scanMachines",
      // 	data: machines
      // });
    },
    getVehicleName() {
      let names =
        this.dataDic && this.dataDic.transportMachine
          ? this.dataDic.transportMachine.map((o) => {
              return o.licenseId;
            })
          : [];
      this.mNames = names.join(",");
    },
    getDriverName() {
      let names =
        this.dataDic && this.dataDic.transportDriver
          ? this.dataDic.transportDriver.map((o) => {
              return o.name;
            })
          : [];
      this.dNames = names.join(",");
    },
    getType(item) {
      if (item.settlementType === "1") {
        return "天";
      } else if (item.settlementType === "5") {
        return "周";
      } else {
        return "月";
      }
    },
    callPhone(phone) {
      if (!this.isedit && phone) {
        uni.makePhoneCall({
          // 手机号
          phoneNumber: phone,
          // 成功回调
          success: (res) => {
            console.log("调用成功!");
          },

          // 失败回调
          fail: (res) => {
            console.log("调用失败!");
          },
        });
      }
    },
    //物流公司
    gotoTrans() {
      if (this.isedit) {
        uni.navigateTo({
          url: "./trans-company",
        });
      }
    },
    //司机
    goTo(type) {
      if (!this.isedit) {
        return;
      }
      switch (type) {
        case "transportMachine":
          uni.navigateTo({
            url:
              "/otherPages/logistics/choose-logistics-vehicle?isEdit=" +
              this.isedit +
              "&choosedList=" +
              encodeURIComponent(
                JSON.stringify(
                  this.dataDic.transportMachine ? this.dataDic.transportMachine : []
                )
              ),
          });
          break;
        case "transportDriver":
          uni.navigateTo({
            url:
              "/otherPages/logistics/choose-logistics-driver?isEdit=" +
              this.isedit +
              "&choosedList=" +
              encodeURIComponent(
                JSON.stringify(
                  this.dataDic.transportDriver ? this.dataDic.transportDriver : []
                )
              ),
          });
          break;
        default:
          break;
      }
    },
    //时间处理
    getYMDHMTime(date) {
      let d = "";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    changestr(str) {
      if (str == null) {
        if (this.isedit === false) {
          return "--";
        }
        return "";
      }
      return str.split(" ")[0];
    },
    //选择调度车辆
    gotoDdCar(index, item) {
      if (this.isedit === false) {
        return;
      }
      this.carindex = index;
      let list = [];
      this.dataDic.orders.map((o) => {
        if (o.machineList.length > 0) {
          o.machineList.map((o) => {
            list.push(o);
          });
        }
      });
      uni.navigateTo({
        url:
          "./workin-car-choose?item=" +
          encodeURIComponent(JSON.stringify(item)) +
          "&enableTime=" +
          this.changestr(this.dataDic.preEnableDate) +
          "&carlist=" +
          encodeURIComponent(JSON.stringify(list)),
      });
    },
    gotoCarDetail(item) {
      //调度设备详情列表
      uni.navigateTo({
        url: "./workin-car-detaillist?item=" + encodeURIComponent(JSON.stringify(item)),
      });
    },
    chooseType(type) {
      if (this.isedit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
      });
    },
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      let dict = {
        ...this.dataDic,
        fileList: list,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      let dict = {
        ...this.dataDic,
        fileList: list,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    //备注
    remarkmethod(val) {
      let dict = {
        ...this.dataDic,
        logisticsRemark: val,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    //进场点检
    getdata() {
      uni.showLoading();
      let param = {
        type: "work",
      };
      this.$network
        .getData(this.$url.GET_CHECK_LISWT, "GET", param)
        .then((result) => {
          let list = result;
          this.changeListToCheck(list);
        })
        .catch((err) => {
          uni.hideLoading();
        });
    },
    changeListToCheck(list) {
      this.workCheckResults = list.map((o) => {
        return {
          id: o.id,
          content: o.content,
          checked: true,
        };
      });
      uni.hideLoading();
    },
    deleteCar(index, item, mindex, mitem) {
      let machineList = [...item.machineList];
      machineList.splice(mindex, 1);
      let orderDic = {
        ...item,
        machineList: [...machineList],
      };
      let orderslist = [...this.dataDic.orders];
      orderslist.splice(index, 1, orderDic);
      // if (this.dataDic.machines) {
      // 	let deleteIndex = this.dataDic.machines.findIndex(o => o.licenseId == mitem.licenseId)
      // 	if(deleteIndex!=-1){
      // 		this.dataDic.machines.splice(deleteIndex, 1)
      // 	}

      // }
      let dict = {
        ...this.dataDic,
        orders: [...orderslist],
        // machines:this.dataDic.machines
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px;
  margin-bottom: 20px;
  background: #ffffff;
  border-radius: 10px;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
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
  min-height: 24px;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.replace-text {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 5px;
}
.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.cell-section-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid $uni-bg-color-grey;
  border-radius: 4px;
  margin: 2px 4px;
}

.cell-between {
  display: flex;
  margin: 0px 4px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.cell-section-view-width {
  display: flex;
  flex-direction: row;
  flex: 1;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  align-items: center;
  justify-content: center;
}

.cell-view {
  font-size: $uni-font-size-base;
  font-weight: bold;
  color: $uni-text-color;
}

.cell-input-view-list {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.cell-input-view-list-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 4px;
}

.cell-input-view-left-small {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 20px;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
}

.add-btn {
  background-color: $uni-color-primary;
  padding: 2px 6px;
  border-radius: 4px;
  color: #ffffff;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}

.workin-dd-list {
  display: flex;
  flex-direction: column;
}

.workin-dd-list-cell {
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
  background: #ffffff;
  border: $uni-line-color 1px solid;
  border-radius: 8px;
}
.cell-input-view-list {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  min-height: 30px;
  font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.cell-input-view-list-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 4px;
}

.input-style-list {
  flex: 1;
  text-align: left;
}

.input-style-list-right {
  flex: 1;
  text-align: right;
}

.cell-input-view-left-cell {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-input-view-right-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.cell-bottom-list-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  padding-right: 5px;
  margin-bottom: 10px;
}
//---------车辆新
.cell-input-view-machine {
  display: flex;
  margin-top: 5px;
  margin-bottom: 5px;
  flex-direction: row;
  justify-content: flex-start;
  background: #ffffff;
}
.cell-input-view-machine-left {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.cell-input-view-machine-right {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.tag-view-base {
  display: flex;
  padding: 3px 5px;
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
  background: #eeeeee;
  color: #999999;
}
.tag3 {
  background: #fff6e7;
  color: #fab045;
}
.tag4 {
  background: #fff1f0;
  color: #e60000;
}
.tag5 {
  background: $uni-color-primary;
  color: #ffffff;
  margin-left: 10px;
}
.cell-input-view-machine-list {
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
  border-top: ipx solid $uni-bg-color-grey;
}
.cell-input-view-machine-list-head {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  color: #222831;
  border-top: $uni-line-color 1px solid;
}

.head-top {
  display: flex;
  flex: 1;
  flex-direction: column;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  font-weight: bold;
  padding: 10px 0px 0px 0px;
}
.head-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  margin-bottom: 4px;
  margin-top: 4px;
}
.text-color {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
}
.line-s {
  margin-top: 5px;
  height: 1px;
  background: #dcdcdc;
}
.cell-input-view-list-btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 5px;
}
.delbtn {
  background: #ffffff;
  color: #fec7ce;
  border-color: #fec7ce;
  border-width: 1px;
  border-style: solid;
}
.tag-view-base-btn {
  padding: 3px 5px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
}
</style>
