<template lang="">
  <div class="page">
    <c-search-bar placeholder="合同名称" :value="searchKey" @input="searchKeyInput" @clear="onClear" @ok="search">
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <selectView class="flex-sub" :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" />
        <selectView class="flex-sub" :value='reportType.label' hint='报告类型' @clickSelect="showPick('reportType')" />
      </view>
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <selectView class="flex-sub" :value='startDate' hint='开始时间' @clickSelect="showPick('startDate')" />
        <selectView class="flex-sub" :value='endDate' hint='结束时间' @clickSelect="showPick('endDate')" />
      </view>
    </c-search-bar>
    <c-loadmore-list scroll-y class=" flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="loadmore">
      <b-report-card v-for="r in list" :key="r.id" :item="r"></b-report-card>
    </c-loadmore-list>
    <c-w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<c-w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date"
		 themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
  </div>
</template>
<script>
import selectView from '@/components/common/common-ui/selector-view.vue';
import { debounce } from '@/common/util/util';
import { REPORT_TYPES } from '@/common/constant'
import { fetchUseReportList, loadList } from '@/network'
export default {
  components: {
    selectView,
  },
  onLoad() {
    this.loadOwnerList()
    this.loadmore(true)
  },
  data() {
    return {
      morestatus: 'more',
      picktype: '',
      salesmanlist: [],
      reportTypes: REPORT_TYPES,
      selectList: [],
      list: [],
      //
      searchKey: '',
      startDate: '',
      endDate: '',
      salesmanObj: {},
      reportType: {},
    }
  },
  methods: {
    searchKeyInput: debounce(function (val) {
      this.searchKey = val
      this.loadmore(true)
    }, 500),
    onClear() {
      this.searchKey = ''
      this.startDate = ''
      this.endDate = ''
      this.salesmanObj = {}
      this.reportType = {}
      this.search()
    },
    search() {
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
    showPick(type) {
      this.picktype = type
      switch (type) {
        case 'startDate':
        case 'endDate':
          this.$refs.date.show();
          break;
        case 'salesman':
          this.selectList = this.salesmanlist
          this.$refs.selector.show();
          break;
        case 'reportType':
          this.selectList = this.reportTypes
          this.$refs.selector.show();
          break;
        default:
          break;
      }

    },
    onConfirm(val) {
      switch (this.picktype) {
        case 'salesman':
          this.salesmanObj = val.checkArr;
          break;
        case 'reportType':
          this.reportType = val.checkArr;
          break;
        case 'startDate':
          this.startDate = val.result;
          break;
        case 'endDate':
          this.endDate = val.result;
          break;
        default:
          break;
      }
    },
    async loadmore(refresh = false) {
      let { list, morestatus } = await loadList({
        list: this.list,
        requestHandler: fetchUseReportList,
        refresh,
        payload: {
          contractName: this.searchKey,
          reportType: this.reportType.value,
          reportDate1: this.startDate ? this.startDate + ' 00:00:00' : '',
          reportDate2: this.endDate ? this.endDate + ' 23:59:59' : '',
          customerSalesmanId: this.salesmanObj.value
        }
      })
      this.list = list
      this.morestatus = morestatus
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  height: 100%;
  @include flex(column);

  ::v-deep .card {
    margin-top: 16rpx;
  }
}
</style>