<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-nav-bar>批量{{operationType==1 ? '锁车':'解锁'}}</c-nav-bar>
    <c-search-bar placeholder="自喷码/车号" :showFilterBtn="false" :value="keyword" @input="keywordInput">
    </c-search-bar>
    <c-loadmore-list scroll-y class="flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadmore">
      <card class="margin-top-lg" v-for="d in list" :key="d.licenseId" :d="d" @click.native="toggle(d)">
        <view slot="actions">
          <view class="selection">
            <text class="iconfont iconxuanzhong" v-if="picked(d.licenseId)"></text>
          </view>
        </view>
      </card>
    </c-loadmore-list>
    <view class="actions-footer-flex padding-lr">
      <view class="flex-sub text-bold">
        选中设备（<text class="text-primary">{{licenseIdList.length}}</text>）台
      </view>
      <view class="z-btn radius bg-warn" v-if="batchLockKey=='1'"  @click="showConfirm">批量解锁</view>
      <view class="z-btn radius bg-primary" v-else @click="showConfirm">批量锁车</view>
    </view>
    <uni-popup ref="pop" type="center" :mask-click="true">
      <view class="popup">
        <view class="text-center text-xl text-bold">提示</view>
        <view class="margin-top-xl ">
          <view class="text-gray"> 
            确定批量锁定以下<text class="text-primary">【{{licenseIdList.length}}】</text>台设备？
          </view>
          <view >
            <view class="licenseid">
            <text class="label">机号</text>
            <text class="label">自喷码</text>
          </view>
            <view  v-for="(id,index) in licenseIdList" :key="id">
    
          <view class="licenseid">
            <text class="value">{{id||'-'}}</text>
            <text class="value">{{printCodeList[index]||'-'}}</text>
          </view>
        
            </view>
            <view class="reason" v-if="batchLockKey!='1'">
            <text class="value">锁车原因</text>
            <view style="border:1px solid #ccc;padding:5px;margin-top:10px;overflow:hidden;box-sizing:border-box">
               <textarea
               v-model="reason"
               placeholder-style="color:#8c8c8c;font-size:14px;"
              placeholder="请输入锁车原因"
            />
            </view>

          </view>
          </view>
        </view>
        <view class="flex justify-between margin-top-xl">
          <view style="width:236rpx;background:#F4F3F8;color:#8c8c8c" class="z-btn bg-light-gray radius" @click="$refs.pop.close()">取消</view>
          <view style="width:236rpx" class="z-btn bg-primary radius" @click="confirmOperation">确定</view>
        </view>
      </view>
    </uni-popup>
  </div>
</template>
<script>
import { debounce } from '@/common/util/util';
import Card from './components/device-card.vue';
import { fetchControlDevices, loadList, lockDevice } from '@/network';

export default {
  components: {
    Card
  },
  data() {
    return {
      operationType: 0,
      morestatus: 'more',
      batchLockKey: '1',
      keyword: '',
      list: [],
      licenseIdList: [],
      printCodeList: [],
      reason:null
    }
  },
  onLoad(options) {
    this.batchLockKey = options.type == 'lock' ? '0' : '1' // //0获取可以锁车的设备   1获取可以解锁的设备
    this.operationType = options.type == 'lock' ? 1 : 0 // 1锁车 0 解锁
    this.loadmore(true)
  },
  methods: {
    picked(lid) {
      return this.licenseIdList.includes(lid)
    },
    keywordInput: debounce(function (val) {
      this.keyword = val
      this.loadmore(true)
    }, 500),
    async loadmore(refresh = false) {
      let { list, morestatus } = await loadList({
        list: this.list,
        requestHandler: fetchControlDevices,
        refresh,
        payload: {
          keyword: this.keyword,
          batchLockKey: this.batchLockKey
        }
      })
      this.list = list
      this.morestatus = morestatus
    },
    toggle(d) {
      console.log(d,'toggle');
      let i = this.licenseIdList.indexOf(d.licenseId);
      if (i !== -1) {
        this.licenseIdList.splice(i, 1);
        this.printCodeList.splice(i, 1);

      } else {
        this.licenseIdList.push(d.licenseId);
        this.printCodeList.push(d.printCode);
      }
    },
    showConfirm() {
      if (this.licenseIdList.length == 0) {
        return uni.showToast({
          title: '请选择设备',
          duration: 2000,
          icon: 'none'
        });
      }
      this.$refs.pop.open()
    },
    async confirmOperation() {
      if(this.batchLockKey!='1'&&!this.reason){
        uni.showToast({
        title: '请输入锁车原因',
        duration: 2000,
        icon:'none'
      });return;
      }
      uni.showLoading({
        title: '提交中',
        mask:true,
      });
      this.$refs.pop.close()
      await lockDevice({ licenseIdList: this.licenseIdList, operationType: this.operationType,opReason:this.reason })
      uni.navigateBack()
      uni.showToast({
        title: '指令提交成功',
        duration: 1500,
      });
      this.loadmore(true, this.list.length)
    }
  }
}
</script>
<style lang="scss">
.page {
  height: 100%;
  @include flex(column);

  .selection {
    width: 56rpx;
    height: 56rpx;
    border: 1rpx solid $uni-color-primary;
    border-radius: 4rpx;
    // @include hairline-surround-radius(4rpx,$uni-color-primary);
    @include flex(row, center, center);

    .iconfont {
      font-size: 38rpx;
      color: $uni-color-primary;
    }
  }

  .popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 40rpx;
    background: $uni-bg-color;
  }

  .licenseid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #E6E6E6;
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
    margin-top: 30rpx;
    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #222222;
    }

    textarea {
      height: 150rpx;
    }
  }
}</style>