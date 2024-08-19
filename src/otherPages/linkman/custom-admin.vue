<template>
  <view class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <c-search-bar placeholder="客户名称" :value="filter.name" @input="keywordInput" @clear="onClear" @ok="loadmore(true)">
      <view slot="pre">
        {{ total }}
      </view>
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <c-form-picker arrowMode="down" placeholder="业务负责人"
          class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="salesmanlist"
          v-model="filter.salesmanId"></c-form-picker>
        <c-form-picker arrowMode="down" placeholder="区域" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm"
          :list="orgs" v-model="filter.region"></c-form-picker>
      </view>
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <c-form-picker arrowMode="down" placeholder="客户类型"
          class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="clientTypes"
          v-model="filter.type"></c-form-picker>
        <view class="flex-1 padding-tb padding-lr margin-lr-sm"></view>
        <!-- <c-form-picker arrowMode="down" placeholder="排序" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="clientTypes" v-model="filter.sort"></c-form-picker> -->
        <!-- <c-form-picker arrowMode="down" placeholder="消息提醒" class="flex-sub bg-gray light padding-tb padding-lr margin-lr-sm" :list="clientTypes" v-model="filter.msg"></c-form-picker> -->
      </view>
      <view slot="btns">
        <view style="margin-right:20rpx" @click="download">下载</view>
      </view>
    </c-search-bar>
    <c-loadmore-list scroll-y class="flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadmore">
      <navigator :url="'/otherPages/linkman/custom-detail?id=' + c.id" class="card" v-for="(c, i) in list" :key="i">
        <view class="top">
          <view class="name">
            <view>
              <text class="iconfont"
                :class="[`client-icon-${c.type}`, `${c.type == 2 ? 'iconkehu2' : 'iconqiye2'}`]"></text>
              <text class="text-lg text-bold">{{ c.name }}</text>
            </view>
            <view class="icon" v-if="c.settleContractCount + c.workInContractCount > 0">
              <text class="iconfont iconxiaoxi"></text>
              <text class="num">{{ c.settleContractCount + c.workInContractCount }}</text>
            </view>
          </view>
          <view class="contact">{{ c.contactName || '--' }} | {{ c.phoneNum || '--' }}</view>
        </view>
        <view class="mid">
          <view class="line">
            <view class="flex-1">业务负责人：{{ c.salesmanName }}</view>
            <view class="flex-1">实收：￥{{ moneyUtil.dealNumber(c.receiptTotal) }}</view>
          </view>
          <view class="line">
            <view class="flex-1">履约营收：￥{{ moneyUtil.dealNumber(c.receivableTotal) }}</view>
            <view class="flex-1">履约欠款：￥{{ moneyUtil.dealNumber(c.payable) }}</view>
          </view>
          <view class="line">
            <view class="flex-1">结算营收：￥{{ moneyUtil.dealNumber(c.settlement) }}</view>
            <view class="flex-1">结算欠款：￥{{ moneyUtil.dealNumber(c.settlementArrear) }}</view>
          </view>
          <view class="line">
            <view class="flex-1">租赁中设备：{{ c.rentalMachineCount }}</view>
            <view class="flex-1">已退租设备：{{ c.noRentalMachineCount }}</view>
          </view>
        </view>
        <view class="bottom padding-top">
          <!-- <text class="text-primary text-sm">设备数：{{c.machineCount}}（租赁中:{{c.rentalMachineCount}}、已退租:{{c.noRentalMachineCount}}）</text> -->
          <!-- <navigator :url="`/otherPages/overdue/overdue-record?type=customer&customerId=${c.id}`" @click.stop=""
            class="z-btn line-primary round margin-left">逾期记录</navigator>
          <view class="z-btn line-primary round margin-left" v-if="isPermissionEdit" @click.stop="editCustomer(c, i)">修改
          </view>
          <navigator :url="`/otherPages/linkman/custom-proceed?id=${c.id}`" @click.stop=""
            class="z-btn line-primary round margin-left">收款</navigator>
          <view class="z-btn line-primary round margin-left" v-if="isPermissionDelete" @click.stop="deleteCustomer(c, i)">
            删除</view> -->
            <view class="z-btn line-primary round margin-left"  @click.stop="goTo('more', c, i)">
            更多</view>
        </view>
   
      </navigator>
    </c-loadmore-list>
    <view class="add-container" @click="openPop" v-if="isPermissionAddPerson || isPermissionAddCompany">
      <text class="iconfont iconadd"></text>
    </view>
    <view class="pop-container">
          <uni-popup ref="morePop" type="center" :mask-click="true">
            <view class="uni-tip">
            
              <view @click.stop="goTo('editCustomer', currentCustomer, currentCustomer.index)" v-if="isPermissionEdit" :class="true ? 'pop-item'
                : 'pop-item-disable'
                ">
                修改
              </view>
              <view class="pop-item-line" @click.stop="goTo('proceed', currentCustomer)" :class="true
                ? 'pop-item'
                : 'pop-item-disable'
                ">
                收款
              </view>
              <view @click.stop="goTo('smsDunning', currentCustomer)" v-if="Number(currentCustomer.settlementArrear)>0" :class="true
                ? 'pop-item'
                : 'pop-item-disable'
                ">
                短信催款
              </view>
              <view @click.stop="goTo('overdueRecords', currentCustomer)" :class="true
                ? 'pop-item'
                : 'pop-item-disable'
                ">
                逾期记录
              </view>
              <view @click.stop="goTo('riskInquiries', currentCustomer)" v-if="currentCustomer.type==1" class="pop-item">
                风险查询
              </view>
              <view class="pop-item-line" v-if="isPermissionDelete" @click.stop="deleteCustomer( currentCustomer, currentCustomer.index)" :class="true
                ? 'pop-item'
                : 'pop-item-disable'
                ">
                删除
              </view>
            </view>
          </uni-popup>
        </view>
    <uni-popup ref="startDialog" type="center" :mask-click="true">
      <view class="uni-tip">
        <view class="tip-title"><text>新建客户</text></view>
        <view class="row-item" @click="addPersonal" v-if="isPermissionAddPerson">
          <view class="row-tag"><text>新建个人客户</text></view>
        </view>
        <view class="row-item" @click="addEnterprise" v-if="isPermissionAddCompany">
          <view class="row-tag"><text>新建企业客户</text></view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { debounce } from '@/common/util/util';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import { loadList, fetchCustomers } from '@/network';
import { mapState } from 'vuex';
let defaultFilter = {
  name: '',
  salesmanId: null,
  region: null,
  type: null,
  sort: null,
  msg: null,
}
export default {
  components: {
    uniPopup
  },
  data() {
    return {
      salesmanlist: [],
      filter: { ...defaultFilter },
      clientTypes: [{ label: '企业客户', value: '1' }, { label: '个人客户', value: '2' }],
      list: [1, 2, 3],
      morestatus: 'more',
      total: 0,
      isPermissionAddPerson: true,
      isPermissionAddCompany: true,
      isPermissionEdit: true,
      isPermissionDelete: true,
      currentCustomer:{
        index:0
      }
    };
  },
  computed: {
    ...mapState('global', {
      orgs: 'orgs'
    })
  },
  onLoad() {
    this.loadOwnerList()
    this.$gxfmethod.statisticData(this.$eventId.Customer_Administrative, "客户管理", "列表");
    uni.getStorage({
      key: this.$savekey.USER_PRIVILEGES_MEG,
      success: res => {
        this.isPermissionAddPerson = res.data.some(x => x.value == this.$savekey.PERMISSION_CUSTOMER_MANAGER_ADD_PERSON);
        this.isPermissionAddCompany = res.data.some(x => x.value === this.$savekey.PERMISSION_CUSTOMER_MANAGER_ADD_COMPANY);
        this.isPermissionEdit = res.data.some(x => x.value === this.$savekey.PERMISSION_CUSTOMER_MANAGER_EDIT);
        this.isPermissionDelete = res.data.some(x => x.value === this.$savekey.PERMISSION_CUSTOMER_MANAGER_DELETE);

      }
    });
  },
  onShow() {
    this.loadmore(true)
  },
  onUnload() {
  },
  //下拉刷新
  onPullDownRefresh() {
    this.loadmore(true)
  },
  methods: {
    goTo(key, c, i) {
      switch (key) {
        case 'overdueRecords':
          uni.navigateTo({
            url: `/otherPages/overdue/overdue-record?type=customer&customerId=${c.id}`
          });
          break;
        case 'riskInquiries':
          uni.navigateTo({
            url: `/contractPages/contract/components/enterprise-risk-inquiry?customerId=${c.id}&name=${c.name}&contactName=${c.contactName}&phoneNum=${c.phoneNum}`
          });
          this.$refs.morePop.close();
          break;
        case 'editCustomer':
          if (c.type == '1') {
            uni.navigateTo({
              url: './company-creat?item=' + encodeURIComponent(JSON.stringify(c)) + '&edit=true'
            });
          } else {
            uni.navigateTo({
              url: './person-creat?item=' + encodeURIComponent(JSON.stringify(c)) + '&edit=true'
            });
          }
          break;
        case 'proceed':
            uni.navigateTo({
              url: `/otherPages/linkman/custom-proceed?id=${c.id}`
            });break;
        case 'more':
            this.$gxfmethod.statisticData(
              this.$eventId.Contract_Administrative,
              "客户列表",
              "列表-更多操作"
            );
          this.currentCustomer={
              ...c,
              index: i
            }
            this.$refs.morePop.open();
          break;
        case 'smsDunning':
          // 跳转短信催款页面
          uni.navigateTo({
            url: `/otherPages/linkman/sms-dunning?customerId=`+this.currentCustomer.id+`&customer=`+encodeURIComponent(JSON.stringify({...this.currentCustomer,customerType:c.type}))
          });
          this.$refs.morePop.close();
          break;
      }
    },
    keywordInput: debounce(function (val) {
      this.filter.name = val
      this.loadmore(true)
    }, 500),
    onClear() {
      this.filter = { ...defaultFilter }
      this.loadmore(true)
    },
    //加载负责人
    loadOwnerList() {
      let param = {
        showAdmin: false,
        roleType: this.$savekey.USER_ROLE_BUSINESS
      };
      this.$network
        .getData(this.$url.USER_LEADERS, 'GET', param)
        .then(result => {
          this.salesmanlist = [];
          this.salesmanlist.push({
            label: '全部',
            value: ''
          });
          this.salesmanlist = this.salesmanlist.concat(
            result ?
              result.map(dict => {
                return {
                  label: dict.username,
                  value: dict.id
                };
              }) : []
          );
        })
        .catch(err => {
        });
    },
    editCustomer(c, i) {
      if (c.type == '1') {
        uni.navigateTo({
          url: './company-creat?item=' + encodeURIComponent(JSON.stringify(c)) + '&edit=true'
        });
      } else {
        uni.navigateTo({
          url: './person-creat?item=' + encodeURIComponent(JSON.stringify(c)) + '&edit=true'
        });
      }
    },
    //删除
    deleteCustomer(item, index) {
      uni.showModal({
        title: '提示',
        content: '确定删除该客户么?',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading();
            let urlstr = this.$url.LINKMAN_PERSON_DELETE + item.id;
            this.$network
              .getData(urlstr, 'DELETE', null)
              .then(result => {
                uni.hideLoading();
                this.loadmore(true);
                this.$refs.morePop.close();
              })
              .catch(err => {
                uni.hideLoading();
                uni.showToast({
                  title: err.message,
                  icon: "none"
                })
                this.$refs.morePop.close();
              });
          }
        }
      });
      return
    },
    download() {
      let url = this.$url.BASE_URL + "contractapi/api/customer/page/new?isExport=true";
      let filename = this.$gxfmethod.getFileName('客户列表');
      this.filter.orgIdList = this.filter.region ? [this.filter.region] : []
      let params = {
        current: 1,
        size: 9999,
        ...this.filter
      }
      this.$gxfmethod.downFunc(url, "POST", params, filename);
    },
    //上拉加载
    async loadmore(refresh = false, size = 10) {
      this.filter.orgIdList = this.filter.region ? [this.filter.region] : []
      let { list, morestatus, total } = await loadList({
        size,
        list: this.list,
        requestHandler: fetchCustomers,
        refresh,
        payload: { ...this.filter },
        showLoading: true
      })
      this.list = list
      this.morestatus = morestatus
      this.total = total
    },
    openPop() {
      this.$refs.startDialog.open();
    },
    addEnterprise() {
      this.$gxfmethod.statisticData(this.$eventId.Customer_Administrative, "客户管理", "新增客户");
      uni.navigateTo({
        url: './company-creat?edit=false'
      });
      this.$refs.startDialog.close();
    },
    addPersonal() {
      this.$gxfmethod.statisticData(this.$eventId.Customer_Administrative, "客户管理", "新增客户");
      let url = './person-creat?edit=false';
      uni.navigateTo({
        url: url
      });
      this.$refs.startDialog.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-item-disable {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item {
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-item-disable {
  color: $uni-text-color-gray;
  font-size: $uni-font-size-base;
  text-align: center;
  height: 36px;
  line-height: 36px;
  flex: 1;
  width: 100%;
}

.pop-container {
  position: relative;
  z-index: 999;
}
.page {
  height: 100%;
  @include flex(column);

  .card {
    background: $uni-bg-color;
    padding: 24rpx;
    margin-top: 24rpx;
    font-size: 26rpx;

    .top {
      @include hairline-bottom();
      padding-bottom: 16rpx;

      .name {
        @include flex(row, center, space-between);

        .client-icon-1 {
          margin-right: 5rpx;
          font-size: 35rpx;
          color: #1278FF;
        }

        .client-icon-2 {
          margin-right: 5rpx;
          font-size: 32rpx;
          color: $uni-color-warning;
        }

        .icon {
          width: 48rpx;
          height: 48rpx;
          border-radius: 100%;
          background: #e6e6e6;
          position: relative;
          @include flex(row, center, center);

          .iconfont {
            color: $uni-color-warning;
            font-size: 28rpx;
          }

          .num {
            position: absolute;
            padding: 4rpx;
            top: 0;
            right: 0;
            transform: translate3d(40%, -30%, 0);
            min-width: 28rpx;
            height: 28rpx;
            display: block;
            border-radius: 100%;
            background: $uni-color-warning;
            color: $uni-text-color-inverse;
            font-size: 20rpx;
            line-height: 1;
            box-sizing: border-box;
            text-align: center;
          }
        }
      }

      .contact {
        color: $uni-text-color-gray;
        margin-top: 11rpx;
      }
    }

    .mid {
      @include hairline-bottom();
      overflow: auto;

      .line {
        margin: 18rpx 0;
        @include flex(row, center);
        color: $uni-text-color-gray;
      }
    }

    .bottom {
      @include flex(row, center, flex-end);
    }
  }
}

.add-container {
  position: fixed;
  display: flex;
  bottom: 70px;
  right: 20px;
  height: 45px;
  width: 45px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px $uni-color-warning;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-warning;
  color: $uni-text-color-inverse;
  z-index: 330;

  .iconfont {
    font-size: 23px;
  }
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

.tip-title {
  display: flex;
  padding: 5px;
  width: 290px;
  border-width: 0px 0px 1px 0px;
  border-color: $uni-bg-color-grey;
  border-style: solid;
  color: $uni-text-color;
  font-size: $uni-font-size-lg;
  font-weight: bold;
  justify-content: center;
  align-items: center;
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
  color: #FFFFFF;
  font-size: $uni-font-size-base;
  border-radius: 5px
}

.row-tag {
  width: 98px;
  text-align: center;
}
</style>
