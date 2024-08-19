<template>
  <view class="bgview">
    <view class="execute-flow-item" v-for="(f, i) in historicRecord" :key="i">
      <view class="line-container">
        <view
          class="line-top"
          :style="{ background: i === 0 ? '#F5F4F9' : '#999999' }"
        ></view>
        <view
          class="middle-circle"
          :style="{ 'border-color': f.endTime ? '#E60000' : '#999999' }"
        ></view>
        <view
          class="line-bottom"
          :style="{ background: i === historicRecord.length - 1 ? '#F5F4F9' : '#999999' }"
        ></view>
      </view>
      <view class="real-contant">
        <view class="item-top">
          <view class="execute-flow-name">
            <text class="flow-name">{{ f.name || "-" }}</text>
          </view>
          <view class="execute-time">{{ f.endTime || "" }}</view>
        </view>
        <view class="item-middle">
          <view class="b-left">
            <text style="min-width: 35px">处理人</text>
            <view class="execute-creator">{{ getAssignees(f) || "--" }}</view>
            <text class="flow-result" v-if="f.deleteReason && f.deleteReason !== ''">{{
              f.deleteReason
            }}</text>
          </view>
        </view>
        <view class="item-bottom">{{ f.comment || "" }}</view>
        <view class="item-cell" v-for="(item, index) in f.flowComment" :key="index">
          <view class="timeclassshow">
            <view class="spanstyle">{{ item.createName }}</view>
            <view class="timeclass">{{ item.createTime }}</view>
          </view>
          <view style="margin-top: 5px" class="text-comment">
            {{ item.comment }}
          </view>
          <view style="margin-top: 5px; color: #e60000">
            {{ getNames(item) }}
          </view>
          <view style="height: 1px; background: #e9e9e9; flex: 1; margin-top: 10px" />
        </view>
        <view calss="bottom-comment">
          <view class="cell-text-right" @click="gotoWrite(f)">
            <text>写评论...</text>
          </view>
        </view>
      </view>
    </view>
    <empty-data
      v-if="!historicRecord || historicRecord.length == 0"
      empty-text="暂无审批流"
    ></empty-data>
    <s-sany-popup ref="customToast"></s-sany-popup>
  </view>
</template>

<script>
import EmptyData from "@/components/common/sany/empty-data.vue";
export default {
  components: { EmptyData },
  data() {
    return {
      historicRecord: [],
      busnesskeystr: "",
      dataDict: {},
    };
  },
  onLoad(option) {
    console.log(option, "option");
    this.busnesskeystr = option.businessKey;
    this.getApproveData(this.busnesskeystr);
    uni.$on("refresh-list", (usnerinfo) => {
      this.getApproveData(this.busnesskeystr);
    });
  },
  methods: {
    getNames(item) {
      let list = item.userInfo ? item.userInfo : [];
      let timeStr = "";
      list.forEach((o) => {
        if (timeStr == "") {
          timeStr = "@" + o.username;
        } else {
          timeStr = timeStr + "  @" + o.username;
        }
      });
      return timeStr;
    },
    getApproveData(busnesskey) {
      //审批流
      let param = {
        businessKey: busnesskey,
      };
      let url = this.$url.HISTORIC_FLOW_LIST.replace(/xxx/, "contractapi");
      this.$network
        .getData(url, "GET", param)
        .then((result) => {
          console.log(result, "result");
          this.historicRecord = result;
        })
        .catch((err) => {});
    },
    getAssignees(item) {
      if (item.endTime) {
        return item.assignee;
      }
      let ass = item.assigneeList ? item.assigneeList.join("/") : null;
      if (ass) {
        return ass + "(未审批)";
      } else {
        return null;
      }
    },
    gotoWrite(item) {
      uni.navigateTo({
        url: "./work-flow-write?item=" + encodeURIComponent(JSON.stringify(item)),
      });
    },
  },
};
</script>

<style scoped lang="scss">
.bgview {
  width: 100%;
  background: $uni-bg-color-grey;
}

.execute-flow-item {
  margin: 0px 16px;
  display: flex;
  flex-direction: row;
}

.line-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-top {
  background-color: $uni-text-color-gray;
  width: 1px;
  height: 30px;
}

.line-bottom {
  background-color: $uni-text-color-gray;
  width: 1px;
  flex: 1;
}

.middle-circle {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border-width: 4px;
  border-color: #e60000;
  border-style: solid;
}

.real-contant {
  display: flex;
  margin-left: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  flex: 1;
  flex-direction: column;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 4px;
}

.item-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.r-icon {
  color: #e60000;
  font-size: 14px;
  margin-right: 4px;
}

.execute-flow-name {
  font-size: $uni-font-size-sm;
  color: $uni-text-color-grey;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flow-name {
  font-size: $uni-font-size-base;
  font-weight: bold;
  color: $uni-text-color;
}

.execute-time {
  font-size: $uni-font-size-xs;
  color: $uni-text-color-gray;
}

.execute-creator {
  margin-left: 8px;
  font-size: $uni-font-size-base;
  color: $uni-text-color;
}

.item-middle {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  justify-content: space-between;
  margin-top: 8px;
  color: $uni-text-color;
}

.item-bottom {
  display: flex;
  flex-direction: row;
  font-size: $uni-font-size-base;
  justify-content: space-between;
  margin-top: 8px;
  color: $uni-text-color-gray;
}

.b-left {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-sm;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.flow-result {
  margin-left: 8px;
  border: 1px solid $uni-color-primary;
  padding: 2px 4px;
  border-radius: 4px;
  color: $uni-color-primary;
}

.item-cell {
  display: flex;
  flex-direction: column;
  padding: 5px;
  font-size: $uni-font-size-base;
  color: #222831;
  background: $uni-bg-color-grey;
}

.spanstyle {
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 5px;
  color: #222831;
  font-weight: bold;
  font-size: $uni-font-size-base;
  margin-right: 5px;
}

.bottom-comment {
  display: flex;
  flex-direction: row;
  margin: 5px;
  justify-content: flex-end;
}

.cell-text-right {
  margin-top: 5px;
  align-items: center;
  font-size: $uni-font-size-base;
  color: #e0e0e0;
  border: 1px solid #e0e0e0;
  padding: 5px 5px;
  border-radius: 4px;
}

.timeclass {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 0px;
  justify-content: flex-end;
  font-size: $uni-font-size-sm;
  color: #999999;
}

.timeclassshow {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.text-comment {
  text-align: left;
  font-size: $uni-font-size-base;
}
</style>
