<template>
  <view>
    <p class="title"><span class="line"></span>其他</p>
    <view class="sum-view-bg" style="margin: 0px">
      <imgupload
        @uploadfinish="uploadfinish"
        @deleteUrl="deleteUrl"
        :isupload="isedit"
        type="workin_type"
        uploadType="attachment"
        maximg="9"
        :imgFinishlist="dataDic.fileList"
      />
      <selectortextArea
        title="备注"
        placeholder="请输入备注"
        :content="dataDic.comment"
        :isRequire="false"
        @textChage="remarkmethod"
        :isEdit="isedit"
      />
    </view>
  </view>
</template>

<script>
import selectortextArea from "@/components/common/selector-pick/selector-textArea.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
export default {
  components: {
    selectortextArea,
    imgupload,
  },
  data() {
    return {
      dateIcon: "iconzl--rili",
      companyicon: "iconiconzhengli_zuzhijiagou",
      righticon: "iconarrow-right",
      contractName: "",
      choosetypeArr: [],
      typeindx: 0,
      carindex: 0,
      workCheckResults: [],
      storeCheckResults: [],
      notBillMs: [],
      mBills: [],
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
    isLiangXu: {
      type: Boolean,
      default: false,
    },
    isHalf: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dataDic(dataDic) {
      //dataDic.orders.machineList.workCheckResults 如果是null 给初始值
      // if(dataDic.orders&&dataDic.orders.length){
      // 	dataDic.orders.forEach(o=>{
      // 		o.machineList.forEach(m=>{
      // 			if(!m.workCheckResults){
      // 				m.workCheckResults = this.getchecklist(o.machineList, m.licenseId)
      // 			}
      // 		})
      // 	})
      // }
    },
  },
  created() {
    this.getdata();
    // this.getckdata();
    //设备
    uni.$on("choose-workincar-emit", (usnerinfo) => {
      let list = usnerinfo.list;
      let orderslist = this.dataDic.orders;
      let choosedict = orderslist[this.typeindx];
      let oldList = choosedict.machineList || [];
      let machineList = [];
      list.forEach((item) => {
        let dict = {
          ...item,
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
          workCheckResults: this.getchecklist(choosedict.machineList, item.licenseId),
          storeCheckResults: this.storeCheckResults,
        };
        machineList.push(dict);
      });
      choosedict.machineList = machineList;
      orderslist[this.typeindx] = choosedict;
      let dict = {
        ...this.dataDic,
        orders: [...orderslist],
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    });
    //点检项
    uni.$on("choose-check-emit", (usnerinfo) => {
      let list = usnerinfo.list;
      let orderslist = this.dataDic.orders;
      let choosedict = orderslist[this.typeindx];
      let machineList = choosedict.machineList;
      let machineDict = machineList[this.carindex];
      let newItemDict = {
        ...machineDict,
        workCheckResults: [...list],
      };
      machineList.splice(this.carindex, 1, newItemDict);
      let orderDic = {
        ...choosedict,
        machineList: [...machineList],
      };
      orderslist.splice(this.typeindx, 1, orderDic);
      let dict = {
        ...this.dataDic,
        orders: [...orderslist],
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    });

    /* 关联交接机单 */
    uni.$on("choose-correlation", (list) => {
      let dict = {
        ...this.dataDic,
        deliverIds: list.map((o) => o.id).join(","),
      };
      this.mBills = [...list];
      let orders = [];
      if (dict.orders && dict.orders.length > 0) {
        orders = [...dict.orders];
      }
      this.notBillMs = [];
      list.forEach((z) => {
        let machines = z.dispatchMachines ? z.dispatchMachines : [];
        if (z.fileList && z.fileList.length > 0) {
          z.fileList.forEach((f) => {
            let fileList = dict.fileList ? dict.fileList : [];
            if (!fileList.some((y) => f.filePath == y.filePath)) {
              dict.fileList = [
                ...fileList,
                {
                  id: undefined,
                  name: f.name || null,
                  type: f.type || "workin_type",
                  uploadType: "attachment",
                  uploadTypeName: null,
                  fileDesc: "进场类型附件",
                  businessId: undefined,
                  url: f.url,
                  bucket: "nvr-temp",
                  filePath: f.filePath,
                },
              ];
            }
          });
        }
        /* 交机单内的所有设备 */
        machines.forEach((o) => {
          /*  1.判断当前设备型号是否否符合订单需求*/
          if (orders.some((y) => y.type == o.type && y.height == o.machineHeight)) {
            /* 2.判断当前设备有无在订单设备列表中*/
            let index = orders.findIndex(
              (y) => y.type == o.type && y.height == o.machineHeight
            );
            let machineList =
              orders[index] && orders[index].machineList ? orders[index].machineList : [];
            if (!machineList.some((x) => x.licenseId == o.licenseId)) {
              dict.orders[index].machineList = [...dict.orders[index].machineList, o];
            }
          } else {
            console.log("当前设备型号不符合订单需求");
            if (!this.notBillMs.some((z) => z.licenseId == o.licenseId)) {
              this.notBillMs = [...this.notBillMs, o];
            }
          }
        });
      });
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
      if (this.notBillMs.length > 0) {
        uni.showModal({
          title: "提示",
          content: "已选交机单中有不符合进场的设备，是否查看？",
          confirmText: "确认",
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({
                url: `/businessPages/service/not-machines?list=${encodeURIComponent(
                  JSON.stringify(this.notBillMs)
                )}`,
              });
            }
          },
        });
      }
    });
  },

  destroyed() {
    console.log("组件移除了");
    uni.$off("choose-correlation");
  },
  methods: {
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
    getType(item) {
      if (item.settlementType === "1") {
        return "天";
      } else if (item.settlementType === "5") {
        return "周";
      } else {
        return "月";
      }
    },
    getchecklist(oldList, str) {
      if (oldList) {
        console.log(JSON.stringify(oldList));
        let filterlist = oldList.filter((o) => {
          return o.licenseId === str;
        });
        if (filterlist.length === 1 && filterlist[0].workCheckResults) {
          return filterlist[0].workCheckResults;
        }
      }
      return this.workCheckResults;
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return this.isedit ? "" : "--";
      }
      return str.split(" ")[0];
    },
    getHalfTime(date) {
      let d = this.isedit ? "" : "--";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    getYMDHMTime(date) {
      let d = this.isedit ? "" : "--";
      if (date) {
        d = this.isHalf ? this.$dateUtil.timeFormatYMDHM(date) : this.changestr(date);
      }
      return d;
    },
    //选择调度车辆
    gotoDdCar(index, item) {
      if (this.isedit === false) {
        return;
      }
      if (!this.dataDic.enableDate) {
        uni.showToast({
          icon: "none",
          title: "请选择启用时间",
        });
        return;
      }
      this.typeindx = index;
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
          this.changestr(this.dataDic.enableDate) +
          "&carlist=" +
          encodeURIComponent(JSON.stringify(list)),
      });
    },
    //点检
    gotoCheckCar(index, item, mindex, mitem) {
      if (this.isedit === false) {
        uni.navigateTo({
          url:
            "./check-car-list?item=" +
            encodeURIComponent(JSON.stringify(mitem.workCheckResults)) +
            "&iscleck=false",
        });
        return;
      }
      this.typeindx = index;
      this.carindex = mindex;
      uni.navigateTo({
        url:
          "./check-car-list?item=" +
          encodeURIComponent(JSON.stringify(mitem.workCheckResults)),
      });
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

      console.log(list);
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
        comment: val,
      };
      this.$emit("clickevent", {
        type: "value",
        data: dict,
      });
    },
    //=---==-
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
          remark: "",
        };
      });
      uni.hideLoading();
    },
    ischeckOK(checkalllist) {
      if (!checkalllist) {
        return false;
      }
      let list = checkalllist.filter((o) => {
        return o.checked === false;
      });
      if (list.length > 0) {
        return false;
      }
      return true;
    },
    correlationDelivery() {
      let selects = [];
      if (this.dataDic.deliverIds) selects = this.dataDic.deliverIds.split(",");

      uni.navigateTo({
        url: `/businessPages/service/deliver-machine?type=select&selects=${encodeURIComponent(
          JSON.stringify(selects)
        )}&bills=${encodeURIComponent(JSON.stringify(this.mBills))}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  background: #ffffff;
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

.input-style {
  flex: 1;
  text-align: right;
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

.replace-text {
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 5px;
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

.title {
  height: 20px;
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  padding: 2px 0;
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
  flex-direction: row;
  justify-content: flex-start;
  background: #ffffff;
  margin-bottom: 5px;
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
  margin: 5px;
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
  margin-bottom: 5px;
  height: 1px;
  background: #dcdcdc;
}
.cell-input-view-list-btn-print {
  display: flex;
  flex-direction: row;
}
.cell-input-view-list-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
}
.tag-view-base-btn {
  display: flex;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
}
.delbtn {
  margin-left: 10px;
  background: #ffffff;
  color: #fec7ce;
  border-color: #fec7ce;
  border-width: 1px;
  border-style: solid;
  margin-right: 0px;
}

.checkbtnOK {
  background: #ffffff;
  color: #4ec365;
  border-color: #4ec365;
  border-width: 1px;
  border-style: solid;
  margin-right: 0px;
}

.checkbtnError {
  background: #ffffff;
  color: #ff0000;
  border-color: #ff0000;
  border-width: 1px;
  border-style: solid;
  margin-right: 0px;
}

.machine-cell {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 8px;
  padding-bottom: 12px;
  font-size: 14px;

  .text-cell {
    font-size: 12px;
  }
}

.machine-cell::after {
  position: absolute;
  z-index: 3;
  right: -8px;
  bottom: 0;
  left: 1px;
  height: 1px;
  content: "";
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background-color: #c8c7cc;
}

.row-item {
  display: flex;
  width: 270px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
  background: $uni-color-primary;
  color: #ffffff;
  font-size: $uni-font-size-base;
  border-radius: 5px;
}

/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}

.row-tag {
  width: 98px;
  text-align: center;
}
</style>
