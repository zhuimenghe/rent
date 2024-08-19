<template>
  <div class="list">
    <c-search-bar
      placeholder="自喷码/车号"
      :value="filter.keyword"
      @input="keywordInput"
      @clear="onClear"
      @ok="search"
    >
      <view
        class="flex margin-tb padding-lr-sm"
        hover-class="none"
        :hover-stop-propagation="false"
      >
        <c-form-picker
          arrowMode="down"
          placeholder="租赁状态"
          class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm"
          :list="rentalStateList"
          v-model="filter.state"
        ></c-form-picker>
        <c-form-picker
          arrowMode="down"
          placeholder="在线状态"
          class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm"
          :list="offlineList"
          v-model="filter.offline"
        ></c-form-picker>
        <c-form-picker
          arrowMode="down"
          placeholder="锁机状态"
          class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm"
          :list="lockList"
          v-model="filter.lockType"
        ></c-form-picker>
        <!-- <selectView class="flex-sub" :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" /> -->
        <!-- <selectView class="flex-sub" :value='reportType.label' hint='报告类型' @clickSelect="showPick('reportType')" /> -->
      </view>
    </c-search-bar>
    <c-loadmore-list
      scroll-y
      class="flex-scroll-wrapper"
      :loadMoreStatus="morestatus"
      @loadmore="loadmore"
    >
      <card class="margin-bottom-lg" v-for="d in list" :key="d.licenseId" :d="d">
        <view slot="actions">
          <view
            class="z-btn radius"
            :class="[d.showLockBtn ? 'bg-primary' : 'bg-disable']"
            @click="confirmOperate(1, d)"
            >锁车</view
          >
          <view
            class="z-btn radius margin-left bg-primary"
            v-if="d.dynamicPasswordSupport"
            @click="handlePassword(d)"
            >密码解锁</view
          >
          <view
            class="z-btn radius margin-left"
            :class="[d.showLockBtn ? 'bg-disable' : 'bg-primary']"
            @click="confirmOperate(0, d)"
            >解锁</view
          >
        </view>
      </card>
    </c-loadmore-list>
    <uni-popup :animation="false" ref="confirmPop" type="center" :mask-click="true">
      <view class="confirm-popup">
        <view class="text-center text-lg text-bold">提示</view>
        <view class="margin-top-xl text-gray">
          <view style="margin-bottom: 3px; color: #222; font-size: 32rpx">
            您确定将以下设备进行{{ curOpType ? "锁车" : "解锁" }}吗？
          </view>
          <view class="licenseid">
            <text class="label">机号</text>
            <text class="label">自喷码</text>
          </view>
          <view class="licenseid">
            <text class="value">{{ curDevice.licenseId || "-" }}</text>
            <text class="value">{{ curDevice.printCode || "-" }}</text>
          </view>
          <view class="reason" v-if="curOpType">
            <text class="value">锁车原因</text>
            <view style="border: 1px solid #ccc; padding: 2px; margin-top: 10px">
              <textarea
                v-model="reason"
                placeholder-style="color:#8c8c8c;font-size:14px;padding:6px"
                placeholder="请输入锁车原因"
              />
            </view>
          </view>
          <!-- <view>
            设备当前<text class="text-warn">{{curDevice.offlineMode ? '离线' : '在线'}}、{{curDevice.lockTypeDesc}}</text>
            状态
          </view> -->
        </view>
        <view class="flex justify-between margin-top-xl">
          <view
            style="width: 236rpx; background: #f4f3f8; color: #8c8c8c"
            class="z-btn bg-light-gray radius"
            @click="$refs.confirmPop.close()"
            >取消</view
          >
          <view
            style="width: 236rpx"
            class="z-btn bg-primary radius"
            @click="confirmOperation"
            >确定</view
          >
        </view>
      </view>
    </uni-popup>
  </div>
</template>
<script>
import { debounce } from "@/common/util/util";
import Card from "./device-card.vue";
import { fetchControlDevices, loadList, lockDevice } from "@/network";

let defaultFilter = {
  keyword: "",
  state: null,
  offline: null,
  lockType: null,
};
export default {
  components: {
    Card,
  },
  data() {
    return {
      filter: { ...defaultFilter },
      morestatus: "more",
      rentalStateList: [],
      offlineList: [
        { label: "在线", value: false },
        { label: "离线", value: true },
      ],
      lockList: [
        { label: "未锁", value: 4 },
        { label: "已锁", value: 3 },
      ],
      list: [],
      curOpType: 0,
      curDevice: {},
      reason: null,
    };
  },
  created(options) {
    this.loadrental();
  },
  methods: {
    handlePassword(deviceInfo) {
      let url = `/devicePages/control/components/lock-by-password?licenseId=${deviceInfo.licenseId}`;
      uni.navigateTo({
        url: url,
      });
    },
    keywordInput: debounce(function (val) {
      this.filter.keyword = val;
      this.loadmore(true);
    }, 500),
    onClear() {
      this.filter = { ...defaultFilter };
      this.search();
    },
    search() {
      this.loadmore(true);
    },
    async loadmore(refresh = false, size = 10) {
      let { list, morestatus } = await loadList({
        size,
        list: this.list,
        requestHandler: fetchControlDevices,
        refresh,
        payload: { ...this.filter },
      });
      this.list = list;
      this.morestatus = morestatus;
    },
    loadrental() {
      this.$network
        .loadUserType("rental_status")
        .then((result) => {
          this.rentalStateList = result ? result : [];
        })
        .catch((err) => {});
    },
    confirmOperate(opType = 0, d) {
      this.curDevice = d;
      this.curOpType = opType;
      if (d.showLockBtn && opType === 1) {
        this.$refs.confirmPop.open();
      }
      if (!d.showLockBtn && opType === 0) {
        this.$refs.confirmPop.open();
      }
    },
    async confirmOperation() {
      if (this.curOpType && !this.reason) {
        uni.showToast({
          title: "请输入锁车原因",
          duration: 2000,
          icon: "none",
        });
        return;
      }
      uni.showLoading({
        title: "提交中",
        mask: true,
      });
      this.$refs.confirmPop.close();
      await lockDevice({
        licenseIdList: [this.curDevice.licenseId],
        operationType: this.curOpType,
        opReason: this.reason,
      });
      uni.showToast({
        title: "指令提交成功",
        duration: 1500,
      });
      this.loadmore(true, this.list.length);
    },
  },
};
</script>
<style lang="scss" scoped>
.list {
  height: 100%;
  @include flex(column);

  .confirm-popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 30rpx 32rpx 24rpx 32rpx;
    background: $uni-bg-color;
  }

  .licenseid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #e6e6e6;
    line-height: 70rpx;

    text {
      flex: 1;
      text-align: center;
    }

    .label {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #888888;
    }

    .value {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }
  }

  .reason {
    margin-top: 40rpx;

    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }

    textarea {
      height: 150rpx;
      font-size: 13px;
    }
  }
}
</style>
