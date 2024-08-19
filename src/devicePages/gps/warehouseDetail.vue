<template>
  <view class="report">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="top">
      <view class="flex row">
        <span class="iconfont iconshengfenzuobiao_mianxing"></span>
        <p class="_title" style="margin-left: 5px">{{ address }}</p>
      </view>
      <view class="top_body">
        <view class="content">
          <view class="top">
            <p>仓库地址：{{ address }}</p>
            <p>设备数量：{{ machineStr }}</p>
            <p>
              管理员：<span
                >{{
                  `${form.adminName ? form.adminName : "-"}(${
                    form.adminPhone ? form.adminPhone : "-"
                  })`
                }}
              </span>

              <span
                class="iconfont iconzl--bianji"
                style="color: #e60000; text-align: center; margin-left: 5px"
                @click="dialog()"
              >
              </span>
            </p>
          </view>
        </view>
      </view>
    </view>

    <view class="construction">
      <p class="title">
        设备列表（{{ machineList.length }}）
        <span class="red"
          >（低电量设备：{{ lowPowerLicenseIds.length }}台）</span
        >
      </p>
      <more-list empty-text="暂无数据" :list="machineList" :minSize="3">
        <block slot="list" slot-scope="{ list }">
          <navigator
            class="lowBatteryCard"
            v-for="(item, i) in list"
            :key="i"
            :url="`/devicePages/monitor/device-monitor-detail?licenseId=${item.licenseId}&deviceNum=${item.deviceNum}`"
          >
            <view class="flex row">
              <p style="font-size: 14px; font-weight: 600">
                {{ item.serialNo }}
              </p>
              <p class="_state" :style="{ backgroundColor: item.color }">
                {{ item.statusName }}
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                {{ item.machineTypeName ? item.machineTypeName : "-" }}|{{
                  item.height
                }}|{{ item.brand?item.brand:'-' }}|{{ item.machineType }}
              </p>
              <p style="color: #222222">
                {{ item.machineStatus == "1" ? "电量：" : "预计电量："
                }}{{ item.batteryLevel }}%
              </p>
            </view>
            <view class="flexBewteen row gray">
              <p>
                <span
                  class="iconfont iconshijian"
                  style="margin-right: 5px"
                ></span
                >最后回传时间：{{ item.lastDataUploadTime }}
              </p>
              <p style="color: #222222" v-if="item.machineStatus != '1'">
                {{ item.statusName }}时长：{{ item.offlineDays }}天
              </p>
            </view>
          </navigator>
        </block>
      </more-list>
    </view>

    <view class="pop-container">
      <uni-popup ref="popup" type="center" :mask-click="false">
        <view class="uni-tip">
          <view class="tip-title"><text>编辑管理员</text></view>
          <view class="alert-cell">
            <view class="alert-left-title"
              >仓库管理员姓名:<text style="color: #ff0000">*</text></view
            >
            <view class="alert-right-title">
              <input
                style="flex: 1; font-size: 14px"
                placeholder=""
                :value="form.adminName"
                @input="textChange($event, 'adminName')"
              />
            </view>
          </view>
          <view class="alert-cell">
            <view class="alert-left-title"
              >仓库管理员电话:<text style="color: #ff0000">*</text></view
            >
            <view class="alert-right-title">
              <input
                style="flex: 1; font-size: 14px"
                placeholder=""
                :value="form.adminPhone"
                @input="textChange($event, 'adminPhone')"
              />
            </view>
          </view>
          <view class="alert-cell">
            <view class="alert-btn-left" @click="clickBtn('cancle')"
              ><text>取消</text></view
            >
            <view class="alert-btn-right" @click="clickBtn('ok')"
              ><text>保存</text></view
            >
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>
<script>
import MoreList from "../moreList.vue";
import Calendar from "./calendar.vue";
import uniPopup from "@/components/common/uni-popup/uni-popup.vue";
export default {
  name: "deviceBaseInfo",
  components: {
    MoreList,
    Calendar,
    uniPopup,
  },
  data() {
    return {
      address: "",
      machineList: [],
      form: {
        adminName: "",
        adminPhone: "",
      },
      lowPowerLicenseIds: "",
      machineStr: "",
    };
  },

  onReady() {},
  onLoad(option) {
    this.address = option.address;
    this.getMachineList();
  },
  created() {},
  computed: {},
  methods: {
    getMachineList() {
      this.$network.mapHomeDetail(this.address).then((res) => {
        this.machineList = res.machineList;
        this.machineList.map((e) => {
          if (e.machineStatus == "1") {
            e.statusName = "开机";
            e.color = "#52C41A";
          } else if (e.machineStatus == "2") {
            e.statusName = "离线";
            e.color = "#BBBBBB";
          } else {
            e.statusName = "关机";
            e.color = "#1278FF";
          }
          console.log(e.offlineDays);
        });
        for (const key in res.machineMap) {
          this.machineStr += `${key}${res.machineMap[key]} |`;
        }
        this.machineStr = this.machineStr.slice(
          this.machineStr,
          this.machineStr.length - 1
        );
        this.form.adminName = res.adminName;
        this.form.adminPhone = res.adminPhone;
        this.lowPowerLicenseIds = res.lowPowerLicenseIds;
      });
    },
    change(val) {
      console.log(val, "11");
    },
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    gotoDetail(type, item) {
      if (type == 1) {
        uni.navigateTo({
          url: `/devicePages/record/device-record-detail?licenseId=${item.serialNo}`,
        });
      } else {
        uni.navigateTo({
          url: `/contractPages/contract/contract-detail?contractNo=${item}`,
        });
      }
    },
    dialog() {
      this.$refs.popup.open();
    },
    textChange(e, type) {
      let value = e.detail.value ? e.detail.value : "";
      if (type == "adminName") {
        this.form.adminName = value;
      } else if (type == "adminPhone") {
        this.form.adminPhone = value;
      }
    },
    clickBtn(type) {
      if ("ok") {
        let param = {
          address: this.address,
          adminName: this.form.adminName,
          adminPhone: this.form.adminPhone,
        };
        this.$network.homeAdmin(param).then((res) => {});
      } else {
      }
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
}
.top {
  padding: 12px;
  background-color: #fff;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 18px;
      font-weight: 600;
      color: #181818;
    }
    .download {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 63px;
      height: 32px;
      background: rgba(230, 0, 0, 0.1);
      border-radius: 6px;
      border: 1px solid #e60000;
      color: #e60000;
      p {
        height: 20px;
        line-height: 20px;
        font-size: 14px !important;
        color: #e60000;
      }
    }
  }
  .top_body {
    font-size: 12px;
    margin-top: 10px;
    padding: 12px;
    color: #8c8c8c;
    background-color: #f6f6f6;
    .content {
      background-color: #f6f6f6;
      .top {
        padding: 0;
        background-color: #f6f6f6;
        display: grid;
        gap: 10px 0;
      }
    }
  }
}
.machineList {
  background-color: #fff;
  margin: 10px 0;
  font-size: 12px;
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    margin: 8px 0;
    padding: 0 10px;
    padding-top: 10px;
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
  .machineCard {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e6e6e6;
    margin-bottom: 10px;
    .head {
      display: flex;
      .left {
        box-sizing: border-box;
        display: flex;
        width: 55px;
        height: 55px;
        padding: 3px;
        border-radius: 8px;
        border: 1px $uni-line-color solid;
        align-items: center;
        justify-content: center;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        width: 100%;
      }
    }
    .contract {
      .first {
        display: flex;
        align-items: center;
        span {
          display: block;
        }
        .contractList {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 5px;
        }
      }

      .second {
        margin-top: 5px;
      }
      .settle {
        margin-top: 10px;
        padding: 12px;
        color: #8c8c8c;
        background-color: #f6f6f6;
        view {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.dayDataList {
  background-color: #fff;
  margin: 10px 0;
  font-size: 12px;
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    margin: 8px 0;
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .line {
      display: block;
      width: 2px;
      height: 80%;
      background-color: #e60000;
      margin-right: 10px;
    }
  }
  .machineCard {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e6e6e6;
    margin-bottom: 10px;
    .head {
      display: flex;
      .left {
        box-sizing: border-box;
        display: flex;
        width: 55px;
        height: 55px;
        padding: 3px;
        border-radius: 8px;
        border: 1px #e6e6e6 solid;
        align-items: center;
        justify-content: center;
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 10px;
        width: 100%;
      }
    }
    .contract {
      margin-top: 10px;
      .first {
        display: flex;
        align-items: center;
        span {
          display: block;
        }
        .contractList {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 5px;
        }
      }

      .second {
        margin-top: 5px;
      }
      .settle {
        margin-top: 10px;
        padding: 12px;
        color: #8c8c8c;
        background-color: #f6f6f6;
        view {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.flexStart {
  display: flex;
  justify-content: start;
}
.flex {
  display: flex;
  align-items: center;
}
.flexBewteen {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row {
  margin: 6px 0;
}
.gray {
  color: #8c8c8c;
}
.ml5 {
  margin-left: 5px;
}
.mr5 {
  margin-right: 5px;
}
.iconshengfenzuobiao_mianxing {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #e60000;
  text-align: center;
  line-height: 20px;
}
.iconwupinchuku {
  display: block;

  border-radius: 50%;
  color: #fe931f !important;
  text-align: center;
  font-size: 80upx;
  line-height: 20px;
}
.iconwupinruku {
  display: block;
  border-radius: 50%;
  color: #52c41f !important;
  text-align: center;
  line-height: 20px;
  font-size: 80upx;
}
._title {
  font-size: 14px;
  font-weight: 600;
}
.icon-car {
}
.icon-view {
  font-size: 80upx;
  color: #fc0000;
}
.flow {
  width: 100%;
  position: fixed;
  padding-top: 10px;
  margin-top: 10px;
  background-color: #ffffff;
  bottom: 0;
  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0px;
    .btn {
      width: 86px;
      display: flex;
      flex-direction: row;
      padding: 10px 0px;
      background: #e60000;
      color: #ffffff;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 6px;
    }
  }
}

.preWarp {
  white-space: pre-wrap !important;
  word-break: break-all;
  word-wrap: break-word;
}
.bottom {
  height: 90px;
}
.red {
  color: #e60000;
}
.construction {
  background-color: #fff;
  margin: 10px 0;
  font-size: 12px;
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    margin: 8px 0;
    padding: 10px;
    padding-bottom: 0;
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
  .constructionCard {
  }

  .lowBatteryCard {
    padding: 0 10px;
    border-top: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  ._state {
    width: 34px;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    background: #52c41a;
    border-radius: 2px;
    margin-left: 6px;
    color: #fff;
  }
}
.pop-container {
  position: relative;
}
/* 提示窗口 */
.uni-tip {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  padding: 15px;
  width: 80vw;
  background-color: #fff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}

.tip-title {
  display: flex;
  padding: 5px;
  width: 100%;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  justify-content: center;
  align-items: center;
}
.alert-cell {
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 10px 15px;
  border-bottom: $uni-line-color solid 1px;
  align-items: center;
}
.alert-left-title {
  font-size: 14px;
  color: $uni-text-color;
  font-weight: normal;
}
.alert-right-title {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
}
.text-area-css {
  width: calc(100% - 20px);
  height: 100px;
  background: $uni-line-color;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
}
.alert-btn-left {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 10px 0px;
  border-radius: 50px;
  background: $uni-line-color;
  color: #000000;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}
.alert-btn-right {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 10px 0px;
  border-radius: 50px;
  background: $uni-color-primary;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
