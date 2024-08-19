<template>
  <view>
    <p class="title">
      <view class="title">
        <span class="line"></span>进场设备 （需求{{ getNum() }}台）
      </view>
      <view class="add-style" @click="addItem" v-if="!isDetail">
        <text>选择设备</text>
      </view>
    </p>
    <selectorPick
      title="启用日期"
      placeholder="请选择启用日期"
      :content="getYMDHMTime(dataDic.enableDate)"
      @clickItem="chooseType('enable')"
      :isEdit="isEdit"
    />
    <selectorPick
      title="进场时间"
      placeholder="请选择进场时间"
      :content="getHalfTime(dataDic.beginDate)"
      @clickItem="chooseType('start')"
      :isEdit="isEdit"
    />
    <view class="device-infomation-bg">
      <template v-if="combinedMachines.length != 0">
        <view class="item-cell" v-for="(item, index) in combinedMachines" :key="index">
          <view class="listTitle">
            <view class="flex">
              <view>
                {{ item.typeName ? item.typeName : "" }}
                /
                {{ item.heightName ? item.heightName : "" }}
              </view>
            </view>
            <view class="flex">
              <view style="margin-right: 5px">已选/需求</view>
              <view>
                (
                <text style="color: #52c41f">
                  {{ getCheckNum(item) || 0 }}
                </text>
                /
                {{ item.usedNum || 0 }}
                )
              </view>
            </view>
          </view>
          <view class="machineList">
            <template v-if="item.machineList.length != 0">
              <view
                class="machineListItem"
                v-for="(machine, i) in item.machineList"
                :key="machine.licenseId"
              >
                <view>
                  <P class="flex">
                    <view style="display: flex;align-items: center;">
                      <span>{{ machine.licenseId }}</span>
                      <span style="margin-left: 5px" v-if="machine.printCode">
                        ({{ machine.printCode || "" }})
                      </span>
                      <span
                        class="ti"
                        v-if="
                          `${machine.typeName}-${machine.machineHeightName}` !=
                          `${item.typeName}-${item.heightName}`
                        "
                       >
                        替
                      </span>
                      <span class="mechineC" v-if="machine.contractMachineTransferInfo" @click.stop="checkTransfer(machine)">换车</span>
                    </view>
                    <view v-if="isEdit">
                      <i
                        class="iconfont delete-icon iconzl--shanchu"
                        @click="del(index, i, item, machine)"
                      ></i>
                    </view>
                  </P>
                  <p class="gray mt5">
                    <span class="mr5">
                      {{ machine.machineBrand ? machine.machineBrand : "-" }}
                    </span>
                    |
                    <span class="ml5 mr5">
                      {{ machine.machineTypeName ? machine.machineTypeName : "-" }}
                    </span>
                    <span class="ml5 mr5"></span>
                  </p>
                  <view
                    class="file"
                    :class="{ 'only-file': machine.deliveryPicCount }"
                    v-if="dataDic.isShowMachineFineColumns"
                  >
                    <span>
                      <text
                        v-if="ifFileRequire"
                        style="color: #e60000; margin-right: 2px"
                      >
                        *
                      </text>
                      进场附件上传
                    </span>
                    <!-- +"/" +
                            machine.fileList.length
                          : machine.fileList.length || 0 -->
                    <view
                      class="filenum"
                      style="display: flex; align-items: center"
                      @click="chooseFile(machine, i, index)"
                    >
                      附件（
                      {{
                        !isDetail
                          ? getCheckedNum(machine, i, index) +
                            "/" +
                            (machine.fileList.length || 0)
                          : getCheckedNum(machine, i, index)
                      }}
                      ）
                      <i
                        class="iconfont right-icon iconarrow-right"
                        :style="{
                          color: '#8c8c8c',
                          'font-size': '18px',
                          'margin-top': '2px',
                        }"
                      ></i>
                    </view>
                  </view>

                  <view class="file" v-if="machine.deliveryPicCount">
                    <view></view>
                    <view
                      class="filenum"
                      style="display: flex; align-items: center"
                      @click="chooseDeliveryFile(machine)"
                    >
                      物流附件（
                      {{ machine.deliveryPicCount }}
                      ）
                      <i
                        class="iconfont right-icon iconarrow-right"
                        :style="{
                          color: '#8c8c8c',
                          'font-size': '18px',
                          'margin-top': '2px',
                        }"
                      ></i>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </template>
      <view class="empty" v-else>
        <image class="img" src="../../static/empty.png"></image>
        <text class="text">暂无设备</text>
      </view>
    </view>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>
<script>
import selectorPick from "@/components/common/selector-pick/selector-pick.vue";
export default {
  name: "wokin-machine-choose",
  components: {
    selectorPick,
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false,
    },
    isControl: {
      type: Boolean,
      default: false,
    },
    chooseModelList: {
      type: Array,
      default() {
        return [];
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },

    machines: {
      type: Array,
      default() {
        return [];
      },
    },
    dispatchMachines: {
      type: Array,
      default() {
        return [];
      },
    },
    dataDic: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      index: 0, //dispatchMachines对应的index
      mindex: 0, //设备对应的index
      page: {
        route: [],
      },
      machineList: [],
      orderList: [],
      listDataNew: [],
      num: 0,
      deviceIcon: {
        3: "iconzl--zhibiche",
        4: "iconzl--jianchache1",
        2: "iconzl--jianchache",
        1: "iconzl--jianchache1",
      },
    };
  },
  computed: {
    combinedMachines() {
      if (this.orderList.length > 0) {
        console.log("combinedMachines----------", this.orderList);
        return this.orderList;
      } else {
        return [];
      }
    },
  },
  watch: {
    dispatchMachines: {
      handler(val) {
        let arr = [...val]; // 创建 `dispatchMachines` 数据的浅拷贝，以便进行操作而不直接影响原始数据
        this.chooseModelList = this.chooseModelList || []; // 确保 `chooseModelList` 不是 undefined，如果是则初始化为空数组
        for (let i = 0; i < val.length; i++) {
          // 遍历传入的新 `dispatchMachines` 数组
          for (let j = 0; j < this.chooseModelList.length; j++) {
            // 同时遍历 `chooseModelList`
            if (arr[i].id == this.chooseModelList[j].id) {
              // 如果两个列表中存在相同ID的项
              this.$set(arr[i], "usedNum", this.chooseModelList[j].usedNum || 0); // 更新或设置该项的 `usedNum` 属性，如果 `chooseModelList` 中的对应项没有 `usedNum`，则默认为 0
            }
          }
        }
        // 带有需求层级的设备列表(需求类型->设备 两级结构)
        this.orderList = [...arr]; // 将处理后的数组赋值给组件内的 `machineList`，触发视图更新
      },
      deep: true, // 深度监听对象内部值的变化
      immediate: true, // 立即以当前的值触发回调
    },
    // 根据需求列表和实际设备列表更新已勾选设备需求数量显示
    chooseModelList: {
      handler(val) {
        let arr = [...val]; // 创建 `chooseModelList` 数据的浅拷贝，以便进行操作而不直接影响原始数据
        for (let i = 0; i < this.orderList.length; i++) {
          // 遍历组件内部的 `machineList` 数组
          for (let j = 0; j < arr.length; j++) {
            // 同时遍历传入的新 `chooseModelList` 数组
            if (this.orderList[i].id == arr[j].id) {
              // 如果两个列表中存在相同ID的项
              this.$set(this.orderList[i], "usedNum", arr[j].usedNum || 0); // 更新或设置该项的 `usedNum` 属性，如果 `chooseModelList` 中的对应项没有 `usedNum`，则默认为 0
            }
          }
        }
      },
      deep: true, // 深度监听对象内部值的变化
      immediate: true, // 立即以当前的值触发回调
    },
  },
  methods: {
    // 点击查看换车信息
    checkTransfer(machine){
      this.$refs.customToast.showModal({
        title:"换车管理",
        content:`换车后车辆：${machine.contractMachineTransferInfo.licenseIdNew}\n换车日期：${machine.contractMachineTransferInfo.transferDate.split(' ')[0]}`,
        confirmButtonName: undefined,
        cancelButtonName: "知道了",
        confirmButtonStyle: undefined,
        cancelButtonStyle: "text",
        success: (res) => {
          if (res.confirm) {
          }  
        },
      });
    },
    ifFileRequire() {
      // 使用 flatMap 提取所有 machineList 中的 fileList，
      // 然后使用 some 检查是否至少存在一个文件项标记为必需的（required: true）。
      return this.dispatchMachines
        .flatMap((dm) => dm.machineList || [])
        .flatMap((ml) => ml.fileList || [])
        .some((file) => file.required);
    },
    getCheckNum(item) {
      let arr = [];
      item.machineList = item.machineList || [];
      arr = item.machineList.filter((e) => {
        return e.checked;
      });
      if (this.isDetail) {
        // 详情页面
        return item.machineList.length || 0;
      }
      console.log("getCheckNum", item, arr.length);
      return arr.length;
    },
    getCheckedNum(machine) {
      // 检查 machine 是否有 fileList 属性
      if (machine.fileList) {
        // 使用 filter 方法过滤 fileList 中具有 url 属性的项，即已经选中或者有效的文件
        // 然后获取这个过滤后数组的长度，即数量
        const checkedNum = machine.fileList.filter((item) => item.url).length;
        console.log("getCheckedNum", machine, checkedNum); // 打印日志，显示当前操作的机器对象，方便调试
        return checkedNum; // 返回已选中的文件数量
      } else {
        // 如果 machine 没有 fileList 属性，即没有文件列表，则默认为 0
        return "0";
      }
    },

    chooseFile(machine, index, dindex) {
      this.index = dindex; // 存储当前操作的 dispatchMachines 的索引
      this.mindex = index; // 存储当前操作的 machineList 中的机器索引

      // 更新 machine 的 fileList，为每个文件项添加额外的信息
      const updatedFileList = machine.fileList.map((file) => ({
        ...file,
        // 如果文件名存在，将文件名和是否必需连接为一个字符串；否则，保留原有的文件描述
        fileDesc: file.fileName ? `${file.fileName}|${file.required}` : file.fileDesc,
        type: "workin_machine_type", // 添加一个静态类型字段
        fileIdentify: machine.licenseId, // 添加机器的许可证ID作为标识
      }));

      // 使用更新后的 fileList 更新 machine 对象
      const updatedMachine = {
        ...machine,
        fileList: updatedFileList,
      };

      // 导航到文件选择列表页面，传递更新后的机器信息
      uni.navigateTo({
        url: `./choose-file-list?machine=${encodeURIComponent(
          JSON.stringify(updatedMachine)
        )}&index=${index}&isControl=${this.isControl}&isDetail=${this.isDetail}`,
      });
    },
    chooseDeliveryFile(machine) {
      this.$network
        .getData(
          `${this.$url.WORK_IN_DELIVERYPIC}?bussinessNo=${this.dataDic.businessNo}&licenseId=${machine.licenseId}`,
          "GET"
        )
        .then((result) => {
          // 导航到文件选择列表页面，传递更新后的机器信息
          uni.navigateTo({
            url: `./delivery-file-list?imglist=${encodeURIComponent(
              JSON.stringify(result)
            )}&printCode=${machine.printCode}&licenseId=${machine.licenseId}`,
          });
        })
        .catch((err) => {
          console.log("读取物流附件失败");
        });
    },
    getNum() {
      let num = 0;
      for (let i = 0; i < this.chooseModelList.length; i++) {
        num += this.chooseModelList[i].usedNum;
      }
      return num;
    },
    getHalfTime(date) {
      let d = this.isEdit ? "" : "--";
      if (date) {
        d = this.$dateUtil.timeFormatYMDHM(date);
      }
      return d;
    },
    chooseType(type) {
      if (this.isEdit === false) {
        return;
      }
      this.$emit("clickevent", {
        type: type,
      });
    },
    getYMDHMTime(date) {
      let d = "";
      if (date) {
        d = this.isHalf ? this.$dateUtil.timeFormatYMDHM(date) : this.changestr(date);
      }
      return d;
    },
    //时间处理
    changestr(str) {
      if (str == null) {
        return this.isEdit ? "" : "--";
      }
      return str.split(" ")[0];
    },
    del(index, i, item, machine) {
      this.orderList[index].machineList.splice(i, 1);
      let arr = [];
      this.orderList.map((e) => {
        e.machineList.map((i) => {
          arr.push(i);
        });
      });
      console.log(this.orderList);
      uni.$emit("choosed-orders", {
        listData: this.orderList,
        machine: arr,
        deletedIds: [machine.machineId],
      });
    },
    showPick(type) {
      this.$emit("clickItem", type);
    },
    textChage(e, type) {
      let param = {
        type: type,
        data: e,
      };
      this.$emit("textChange", param);
    },
    addItem() {
      if (this.chooseModelList.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请先选择需进场的订单",
        });
        return;
      } else {
        let arr = [];
        this.orderList.map((e) => {
          e.machineList.map((i) => {
            arr.push(i);
          });
        });
        uni.navigateTo({
          url:
            "./choose-workin-device?machines=" +
            encodeURIComponent(JSON.stringify(arr)) +
            "&contractDetailId=" +
            this.dataDic.contractDetailId +
            "&contractNo=" +
            this.dataDic.contractNo +
            "&businessNo=" +
            this.dataDic.businessNo +
            "&chooseModelList=" +
            encodeURIComponent(JSON.stringify(this.chooseModelList)),
        });
      }
    },
  },
  clickItem(type) {
    this.$emit("clickItem", type);
  },
  goTo(type, index, item) {},
};
</script>

<style lang="scss" scoped>
.icon-bg {
  width: 48rpx;
  height: 48rpx;
  background: #f2f2f2;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 10rpx;
}

.filenum {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #e60000;
}

.file {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8c8c8c;
  display: flex;
  margin-top: 16rpx;
  margin-bottom: 10rpx;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: #e9e9e9 1px solid;

  &.only-file {
    border-bottom: none;
  }
}

.device-infomation-bg {
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-top: 0;
  background: #ffffff;
}

.title-bg {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: #e9e9e9 1px solid;
}

.title-left {
  flex: 1;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  color: #222831;
}

.title-right {
  font-size: $uni-font-size-base;
  font-weight: normal;
  color: #999999;
}

.item-cell {
  flex-direction: row;
  padding: 5px 0;
  padding-bottom: 0;
  // border-bottom: #F0F2F4 1px dotted;
  font-size: 14px;
  color: #222222;
  font-weight: 500;
}

.gray {
  color: #8c8c8c;
  font-size: 12px;
}

.ml5 {
  margin-left: 5px;
}

.mr5 {
  margin-right: 5px;
}

.item-cell-line-bg {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.item-cell-line {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.item-cell-line-right {
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.text-tag-first {
  font-size: 14px;
  color: $uni-text-color;
  margin-right: 10px;
}

.text-tag-seced {
  font-size: 12px;
  color: $uni-text-color-gray;
}

.text-tag-line {
  font-size: 12px;
  color: $uni-text-color-gray;
  margin-left: 5px;
  margin-right: 5px;
}

.tag-view {
  display: flex;
  line-height: 18px;
  padding: 3px 5px;
  border-radius: 3px;
  font-size: $uni-font-size-sm;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: 3px;
}

.tag1 {
  background: #fff6e7;
  color: #fab045;
}

.tag2 {
  background: #fff1f0;
  color: #e60000;
}

.add-style {
  height: 56rpx;
  background: #e60000;
  border-radius: 6rpx;
  display: flex;
  background-color: $uni-color-primary;
  color: #fff;
  font-size: 14px;
  // border: #f5f4f9 15px solid;
  padding: 0px 10px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  position: relative;
}

.machineList {
  .machineListItem {
    // justify-content: space-between;
    // align-items: center;
    // padding: 6px 0;
    // border-top: #F0F2F4 1px dotted;
  }
}

.delete-icon {
  font-size: 17px;
  color: #ff0000;
  margin-left: 10px;
}

.edit-icon {
  color: #e60000;
  font-size: 16px;
  margin-left: 8px;
}

.empty {
  @include flex(column, center, center);
  padding: 20rpx;

  .img {
    width: 77rpx;
    height: 80rpx;
  }

  .text {
    margin-top: 9rpx;
    color: $uni-text-color-gray;
  }
}

.empty {
  @include flex(column, center, center);
  padding: 20rpx;

  .img {
    width: 77rpx;
    height: 80rpx;
  }

  .text {
    margin-top: 9rpx;
    color: $uni-text-color-gray;
  }
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
  justify-content: space-between;
}

.line {
  display: block;
  width: 2px;
  height: 16px;
  background-color: #e60000;
  margin-right: 10px;
}

.listTitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding: 10px 0;
  border-bottom: 1rpx solid #e9e9e9;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-car {
  display: flex;
  width: 12px;
  height: 12px;
  padding: 3px;
  border-radius: 50%;
  border: 1px $uni-line-color solid;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  background-color: #f2f2f2;
}

.icon-view {
  font-size: 16px;
  color: #fc0000;
}

.mt5 {
  margin-top: 6px;
}

.ti {
  margin-left: 6px;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #f08200;
  line-height: 18px;
  text-align: center;
  color: #fff;
}
.mechineC{
  width: 40px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  color: #F08200;
  font-size: 12px;
  border: solid #F08200 1px;
  background-color: rgba(240, 130, 0, 0.20);
  margin-left: 6px;
  border-radius: 2px;
}
</style>
