<template>
  <view>
    <p class="title"><span class="line"></span>物流信息</p>
    <view class="sum-view-bg" style="margin: 0px">
      <!-- <selectorPick
        title="物流类型"
        placeholder="请选择物流方式"
        :content="dataDic.logisticsTypeName"
        @clickItem="chooseType('usetrans')"
        :isEdit="isedit"
      /> -->
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
          :content="dataDic.logisticsContact"
          @clickItem="goTo('transportDriver')"
          :isRequire="true"
          :isEdit="isedit"
        />
        <selectorInput
          title="联系人电话"
          placeholder="请输入联系人电话"
          :content="dataDic.logisticsPhone"
          :isRequire="true"
          @textChage="textChange($event, 'logisticsPhone')"
          textType="number"
          :isEdit="isedit"
        />
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
          :isRequire="true"
          :isEdit="isedit"
        />
        <view
          v-if="dataDic.logisticsCompanyId"
          style="display: flex; flex-direction: column"
        >
          <!-- <selectorInput
            title="物流联系人"
            placeholder="请输入物流联系人"
            :content="dataDic.logisticsContact"
            :isRequire="false"
            @textChage="textChange($event, 'logisticsContact')"
            textType="text"
            :isEdit="isedit"
          /> -->
          <selectorPick
            title="物流联系人"
            placeholder="请输入物流联系人"
            :content="dataDic.logisticsContact"
            @clickItem="gotoContact"
            :isRequire="true"
            :isEdit="isedit"
          />
          <selectorInput
            title="联系人电话"
            placeholder="请输入联系人电话"
            :content="dataDic.logisticsPhone"
            :isRequire="true"
            @textChage="textChange($event, 'logisticsPhone')"
            textType="number"
            :isEdit="isedit"
          />
        </view>
      </view>
      <selectorInput
        v-if="dataDic.logisticsType != '1'"
        title="交机联系人"
        placeholder="请输入交机联系人"
        :content="dataDic.deliveryContact"
        :isRequire="true"
        @textChage="textChange($event, 'deliveryContact')"
        textType="text"
        :isEdit="isedit"
      />
      <selectorInput
        v-if="dataDic.logisticsType != '1'"
        :isEdit="isedit"
        title="交机联系人电话"
        placeholder="请输入交机联系人电话"
        :content="dataDic.deliveryPhone"
        :isRequire="true"
        @textChage="textChange($event, 'deliveryPhone')"
        textType="number"
      />
      <selectorInput
        v-if="dataDic.logisticsType != '1'"
        title="物流运费成本"
        placeholder="请输入运输成本"
        :content="dataDic.logisticsCarriage"
        :isRequire="true"
        @textChage="textChange($event, 'logisticsCarriage')"
        textType="digit"
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
    </view>
  </view>
</template>

<script>
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
import selectorInput from "@/components/common/selector-pick/selector-input.vue";
import selectorInputIcon from "@/components/common/selector-pick/selector-inputwithicon.vue";
export default {
  components: {
    selectortextArea,
    selectorPick,
    selectorInput,
    selectorInputIcon,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      // logisticsCarriage: '',
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
    isshowLogistics: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    // dataDic(val) {
    // 	console.log(JSON.stringify(val))
    // },
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
    // "dataDic.transportMachine"(val) {
    //   this.getVehicleName();
    // },
    // "dataDic.transportDriver"(val) {
    //   this.getDriverName();
    // },
    dataDic: {
      handler(val) {
        this.getDriverName();
        this.getVehicleName();
      },
      deep: true,
      immediate: true,
    },
  },
  // created() {
  //   // this.logisticsCarriage = this.dataDic.logisticsCarriage || '0';
  //   this.getDriverName();
  //   this.getVehicleName();
  // },
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
    chooseType(type) {
      if (this.isedit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
      });
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
      } else if (type == "logisticsPhone") {
        // val = val.replace(/[^0-9]/g, "").slice(0, 11);
        let dict = {
          ...this.dataDic,
          logisticsPhone: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      } else if (type == "deliveryContact") {
        let dict = {
          ...this.dataDic,
          deliveryContact: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      } else if (type == "deliveryPhone") {
        // val = val.replace(/[^0-9]/g, "").slice(0, 11);
        let dict = {
          ...this.dataDic,
          deliveryPhone: val,
        };
        this.$emit("clickevent", {
          type: "value",
          data: dict,
        });
      } else if (type == "logisticsCarriage") {
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
    getVehicleName() {
      // if(this.dataDic.logisticsType=='2'||this.dataDic.logisticsType=='1'){
      //   this.mNames=this.dataDic.logisticsCompanyName
      // }else{
      //   let names =
      //   this.dataDic && this.dataDic.transportMachine
      //     ? this.dataDic.transportMachine.map((o) => {
      //         return o.licenseId;
      //       })
      //     : [];
      // this.mNames = names.join(",");

      // }
      if (this.dataDic && this.dataDic.transportMachine) {
        let names =
          this.dataDic && this.dataDic.transportMachine
            ? this.dataDic.transportMachine.map((o) => {
                return o.licenseId;
              })
            : [];
        this.mNames = names.join(",");
      } else {
        this.mNames = this.dataDic.logisticsCompanyName;
      }
    },
    getDriverName() {
      console.log(this.dataDic, "getDriverName");
      // if(this.dataDic.logisticsType=='2'||this.dataDic.logisticsType=='1'){
      //   this.dNames=this.dataDic.logisticsContact
      // }else{
      //   let names =
      //   this.dataDic && this.dataDic.transportDriver
      //     ? this.dataDic.transportDriver.map((o) => {
      //         return o.name;
      //       })
      //     : [];
      // this.dNames = names.join(",");
      // }
      if (this.dataDic && this.dataDic.transportDriver) {
        let names =
          this.dataDic && this.dataDic.transportDriver
            ? this.dataDic.transportDriver.map((o) => {
                return o.name;
              })
            : [];
        this.dNames = names.join(",");
      } else {
        this.dNames = this.dataDic.logisticsContact;
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
    gotoTrans() {
      if (this.isedit) {
        uni.navigateTo({
          url: "./trans-driver",
        });
      }
    },
    gotoContact() {
      if (this.isedit) {
        uni.navigateTo({
          url: "./trans-driver",
        });
      }
    },
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
          // 默认选中
          // ?choosedId=" +
          // this.dataDic.logisticsContactPerson.id
          uni.navigateTo({
            url: "/otherPages/logistics/choose-logistics-driver-contract?isEdit=true",
          });
          break;
        default:
          break;
      }
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
  },
};
</script>

<style scoped lang="scss">
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  background: #ffffff;
  padding-bottom: 10px;
}

.cell-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
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

.input-style {
  flex: 1;
  text-align: right;
  font-size: $uni-font-size-base;
}

.boldstyle {
  font-size: $uni-font-size-lg;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 10px;
}

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 6px 0;
  margin: 4px 0;
  display: flex;
  align-items: center;

  .line {
    display: block;
    width: 2px;
    height: 80%;
    background-color: #e60000;
    margin-right: 10px;
  }
}
</style>
