<template lang="">
  <view>
    <view class="card">
      <view class="flex padding-top-xl padding-left-lg">
        <view class="flex-1">
          <view class="text-gray text-sm">履约营收（A）</view>
          <view class="margin-top-sm text-lg text-bold">{{moneyUtil.dealNumber(r.receivableTotal)}}</view>
        </view>
        <view class="flex-1">
          <view class="text-gray text-sm">履约欠款（A-C）</view>
          <view class="margin-top-sm text-lg text-bold">{{moneyUtil.dealNumber(r.payable)}}</view>
        </view>
        <view class="flex-1">
          <view class="text-gray text-sm">实收（C）</view>
          <view class="margin-top-sm text-lg text-bold">{{moneyUtil.dealNumber(r.receiptTotal)}}</view>
        </view>
      </view>
      <view class="flex padding-tb-xl padding-left-lg">
        <view class="flex-1">
          <view class="text-gray text-sm">结算营收（B）</view>
          <view class="margin-top-sm text-lg text-bold">{{moneyUtil.dealNumber(r.settlement)}}</view>
        </view>
        <view class="flex-1">
          <view class="text-gray text-sm">结算欠款（B-C）</view>
          <view class="margin-top-sm text-lg text-bold">{{moneyUtil.dealNumber(r.settlementArrear)}}</view>
        </view>
        <view class="flex-1">
        </view>
        
      </view>
    </view>
    <view class="card">
      <view class="head">
        <view class="icon"></view>
        合同列表
      </view>
      <view v-for="cc in contracts" :key="cc.id">
        <navigator :url="`/contractPages/contract/contract-detail?id=${cc.id}`" class="content">
          <view class="contract-head hairline">
            <text class="iconfont" :style="{color:cc.flowStatus===null?'#6A5FFF' : '#FE931F'}" 
            :class="[cc.flowStatus===null?'iconhetong4-copy-copy':'iconwangqianguanli-copy']"></text>
            <!-- iconhetong4 -->
            <view class="flex-1">
              <view class="name">{{cc.contractDetailDto.projectName}}</view>
              <view class="sub margin-top">
                <view class="flex-1">{{cc.orderSum}}</view>
                <view class="text-primary">{{cc.stateName}}</view>
              </view>
            </view>
          </view>
          <view class="padding-bottom-lg">
            <view class="flex margin-top text-gray text-sm">
              <view class="flex-1">进退场：进{{cc.workInCount ||0}} |退{{cc.workOutCount ||0}}</view>
              <view class="flex-1">实收：￥{{moneyUtil.dealNumber((cc.receiptDto&&cc.receiptDto.total)||0)}}</view>
            </view>
            <view class="flex margin-top text-gray text-sm">
              <view class="flex-1">履约营收：￥{{moneyUtil.dealNumber(cc.receivableDto ? cc.receivableDto.total : 0)}}</view>
              <view class="flex-1">履约欠款：￥{{ moneyUtil.dealNumber((cc.receivableDto&&cc.receivableDto.total)-(cc.receiptDto&&cc.receiptDto.total))}}</view>
            </view>
            <view class="flex margin-top text-gray text-sm">
              <view class="flex-1">结算营收：￥{{moneyUtil.dealNumber(cc.settlement||0)}}</view>
              <view class="flex-1">结算欠款：￥{{moneyUtil.dealNumber(cc.settlement - (cc.receiptDto&&cc.receiptDto.total))}}</view>
            </view>
            <view class="flex margin-top text-gray text-sm" v-if="cc.arrearDays">
              <view class="flex-1">欠款天数：{{cc.arrearDays||'-'}}</view>
            </view>
          </view> 
        </navigator>
        <view class="actions">
          <view class="action" :class="[cc.state != '5' &&cc.state != '6' && cc.state != '7' &&cc.state != '8' ? 'text-gray':'']" @click="goTo('workIn',cc)">
            <text class="iconfont iconzl--ruchang margin-right-xs"></text>
            进场
          </view>
          <view class="action" :class="[cc.state != '6' ? 'text-gray':'']" @click="goTo('workOut',cc)">
            <text class="iconfont iconzl--chuchang margin-right-xs"></text>
            退场
          </view>
          <view class="action" @click="goTo('proceed',cc)">
            <text class="iconfont iconshoukuan1 margin-right-xs"></text>
            收款
          </view>
          <view class="action"  :class="[cc.state != '6' && cc.state != '7' &&cc.state != '8' ? 'text-gray':'']" @click="goTo('settle',cc)">
            <text class="iconfont iconjiesuanguanli margin-right-xs"></text>
            结算
          </view>
        </view>
      </view>
      <view v-if="!contracts||!contracts.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    </view>
    <view class="card">
      <view class="head">
        <view class="icon"></view>
        退款记录
      </view>
      <view v-for="(w,i) in withdraws" :key="i">
        <view class="content padding-tb-sm">
          <view class="flex padding-tb-sm">
            <text class="flex-2 text-bold">退款日期：{{w.refundTime ? w.refundTime.split(' ')[0]:''}}</text>
            <text class="flex-1 text-bold">退款金额：{{w.total}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">退款方式：{{w.typeName}}</text>
            <text class="flex-1">退款联系人：{{w.contactName}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">联系方式：{{w.phoneNum}}</text>
            <text class="flex-1">审批状态：{{w.stateName}}</text>
          </view>
        </view>
        <view class="actions">
          <navigator :url="'/businessPages/reimburse/reimburse-detail?businessNo='+w.businessNo" class="action ">
            <text class="iconfont iconchakan1 margin-right-xs"></text>
            查看
          </navigator>
        </view>
      </view>
      <view v-if="!withdraws||!withdraws.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    </view>
    <view class="card">
      <view class="head">
        <view class="icon"></view>
        收款记录
      </view>
      <view v-for="(r,i) in receives" :key="i">
        <view class="content padding-tb-sm">
          <view class="flex padding-tb-sm">
            <text class="flex-2 text-bold">收款日期：{{r.receiptDate?r.receiptDate.split(' ')[0]:''}}</text>
            <text class="flex-1 text-bold">收款金额：{{r.total}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">收款方式：{{r.typeName}}</text>
            <text class="flex-1">收款联系人：{{r.contactName}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">联系方式：{{r.phoneNum}}</text>
            <text class="flex-1">审批状态：{{r.stateName}}</text>
          </view>
        </view>
        <view class="actions">
          <navigator :url="'/businessPages/proceed/porceeds-detail?businessNo='+r.businessNo" class="action ">
            <text class="iconfont iconchakan1 margin-right-xs"></text>
            查看
          </navigator>
        </view>
      </view>
      <view v-if="!receives||!receives.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    </view>
    <view class="card">
      <view class="head">
        <view class="icon"></view>
        开票记录
      </view>
      <view  v-for="(n,i) in invoices" :key="i">
        <view class="content padding-tb-sm">
          <view class="flex padding-tb-sm">
            <text class="flex-2 text-bold">开票日期：{{n.invoiceDate?n.invoiceDate.split(' ')[0]:''}}</text>
            <text class="flex-1 text-bold">开票金额：{{n.total}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">发票抬头：{{n.invoiceName}}</text>
          </view>
          <view class="flex padding-tb-sm text-gray text-sm">
            <text class="flex-1">开票类型：{{n.typeName}}</text>
            <text class="flex-1">审批状态：{{n.stateName}}</text>
          </view>
        </view>
        <!-- <view class="actions">
          <navigator  :url="'/businessPages/reimburse/reimburse-detail?businessNo='+w.businessNo" class="action">
            <text class="iconfont iconchakan1 margin-right-xs"></text>
            查看
          </navigator>
        </view> -->
      </view>
      <view v-if="!invoices||!invoices.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    c: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      r: {},
      contracts: [],
      receives: [],
      withdraws: [],
      invoices: []
    }
  },
  methods: {
    async init(id) {
      this.getContracts(id)
      this.getProceeds(id)
      this.getWithdraws(id)
      this.invoices = await this.$network.invoicesByCustomer(id || this.c.id)
      this.r = await this.$network.getCustomerReceivable(id || this.c.id)
    },
    async getContracts(id) {
      this.contracts = await this.$network.contractsByCustomer(id || this.c.id)
      this.contracts.forEach(c => {
        c.orderSum = c.contractDetailDto ? c.contractDetailDto.orderList.map(o => `${o.heightName}*${o.orderNum}`).join(' | ') : ''
      })
    },
    async getProceeds(id) {
      this.receives = await this.$network.proceedsByCustomer(id || this.c.id);
    },
    async getWithdraws(id) {
      this.withdraws = await this.$network.withdrawsByCustomer(id || this.c.id);
    },
    async goTo(type, item) {
      let result = await this.$network.getData(this.$url.CONTRACT_DEATIL_BY_NO, "GET", { businessNo: item.businessNo })
      switch (type) {
        case "workIn":
          if (item.state != "5" &&
            item.state != "6" &&
            item.state != "7" &&
            item.state != "8") {
            return;
          }
          uni.navigateTo({
            url: `/businessPages/workin/${item.contractType == '3' ? 'create-workin-simple' : 'create-workin-step-all'}?contract=${encodeURIComponent(JSON.stringify(result))}`,
          });
          break;
        case "workOut":
          if (item.state != "6") {
            return;
          }
          uni.navigateTo({
            url: `/businessPages/workout/${item.contractType == '3' ? 'create-workout-simple' : 'create-workout-first'}?contract=${encodeURIComponent(JSON.stringify(result))}`,
          });
          break;
        case "proceed":
          uni.navigateTo({
            url:
              "/businessPages/proceed/creat-proceeds?item=" +
              encodeURIComponent(JSON.stringify(result)),
          });
          break;
        case "settle":
          if (item.state != "6" &&
            item.state != "7" &&
            item.state != "8") {
            return;
          }
          uni.navigateTo({
            url: `/businessPages/settledown/settle-add?contracts=${item.businessNo}&customerId=${item.customerId} `,
          });
          break;
        default:
          break;
      }
    },
  }
}
</script>
<style lang="scss">
@import './custom-detail.scss';
</style>