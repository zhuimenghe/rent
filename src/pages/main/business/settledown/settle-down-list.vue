<template>
	<view class="list-bg">
		<view class="top-view" :style="{top:posTop+'px'}">
			<moreQueryView :isExportList='false' hint='客户名称/项目名称' :isQueryOrg="false" :isQueryState="false" :isQueryTime="true"
			 @reset='reset' @query="query" />
		</view>
		<list class="list-view">
			<cell v-for="(item, index) in datalist" :key="index">

				<businessItemFrame  :stateName="item.stateName || ''" :showAttachment="false">
					<block slot="title">
						<view>{{ item.customerName || "--"}}</view>
					</block>
					<block slot="subContent">
						<view class="max-one-line">
							{{item.businessNo}}&nbsp;|&nbsp;{{item.customerSalesmanName|| "-"}}&nbsp;|&nbsp;{{item.orgName|| "-"}}
						</view>
					</block>
					<block slot="content">
						<view>
							<view class="row-line" style="text-align: start;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;white-space: nowrap;">
									项目名称：
								</view>
								{{ getProjectName(item) }}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									对账维度：
								</view>
								{{item.type=='2'?'合同':'客户'}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									对账周期：
								</view>
								{{changestr(item.beginDate)}}~{{changestr(item.endDate)}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									对账营收
									<businessTips tipName='settleRevenue' />：
								</view>
								￥{{saveTwo(item.settleInfoDto&&item.settleInfoDto.receivable?item.settleInfoDto.receivable.total:0)}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									履约营收
									<businessTips tipName='performRevenue' />：
								</view>
								￥{{ saveTwo(item.receivableCurrent?item.receivableCurrent.total:0)}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									实收
									<businessTips tipName='receivedRevenue' />：
								</view>
								￥{{ saveTwo(item.settleInfoDto&&item.settleInfoDto.receipt?item.settleInfoDto.receipt.total:0)}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									应收
									<businessTips tipName='settleReceivable' />：
								</view>
								<text style="color: #666666;" v-if="saveTwo(item.total) < 0">￥{{ saveTwo(item.total)}}</text>
								<text style="color: #FF0000;" v-else>￥{{ saveTwo(item.total)}}</text>
							</view>


						</view>
					</block>
					<block slot="options">
						<view class="row-line">
							<taskBtn :itemData="item" :isBorder="true" />
							<view class="option-btn" @click.stop="gotodetail(item)" v-if="isDownload">查看报表</view>
							<view class="option-btn" @click.stop="gotodetailTo(item)">详情</view>
						</view>
					</block>
				</businessItemFrame>

			</cell>
			<view>
				<uni-load-more iconType="auto" :status="morestatus" />
			</view>
		</list>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import moreQueryView from '@/components/common/common-ui/business-query-bar.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	import {mapState} from 'vuex'

	export default {
		components: {
			uniLoadMore,
			taskBtn,
			moreQueryView,
			businessItemFrame
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'loading',
				searchKey: "",
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				downloadTask: null,
				isDownload: true,
				totalCount: '100',
				salesmanObj: {}
			};
		},
		computed:{
			...mapState('system',{
				posTop:s=>s.statusBarHeight+s.titleBarHeight,
			}),
		},
		mounted() {
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isDownload = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_SETTLEMENT_DETAIL);
				}
			});
			uni.showLoading();
			this.loaddata();
		},
		created() {
			this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"灵活结算","对账单记录列表");
		},

		methods: {
			reset(val) {
				this.searchKey = "";
				this.salesmanObj = {};
				this.currentpage = 1;
				this.startTime = ''
				this.endTime = ""
				this.datalist = [];
				this.loaddata();
			},
			query(val) {
				console.log(val)
				this.searchKey = val.contractName;
				this.startTime = val.startDate
				this.endTime = val.endDate
				this.salesmanObj = val.salesmanObj;
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			getProjectName(item) {
				if (item && item.settleInfoDto && item.settleInfoDto.contractReceivableList && item.settleInfoDto.contractReceivableList
					.length > 0) {
					let nameList = item.settleInfoDto.contractReceivableList.map(o => {
						return o.projectName;
					})
					return nameList.join(',')
				}
				return '--'

			},
			gotodetailTo(item) {
				if (this.downloadTask) {
					this.downloadTask.abort()
				}
				let businessNostr = item.businessNo;
				let url = '/businessPages/settledown/settle-dz-detail?businessNo=' + businessNostr;
				uni.navigateTo({
					url: url
				});
			},
			hide() {
				console.log('onHide')
				if (this.downloadTask) {
					this.downloadTask.abort()
				}
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			saveTwo(num) {
				return this.$datestr.doubleFloat(num);
			},
			headerrefresh() {
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			footerrefresh() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.currentpage += 1;
				this.morestatus = 'loading';
				this.loaddata();
			},
			loaddata() {
				let param = {
					current: this.currentpage,
					size: 10,
					fuzzyParam: this.searchKey,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					beginDate: this.startTime ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime ? this.endTime + ' 23:59:59' : undefined
				};
				this.$network
					.getData(this.$url.SETTLE_LIST_DOWN, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			gotodetail(item) {
				uni.showLoading()
				this.$network.rentalPag("statement",()=>{
					this.downM(item)
				},(msg)=>{
					console.log("失败");
					uni.showToast({
						icon:'none',
						title:msg
					})
				})
			},
			downM(item){
				let url = this.$url.BASE_URL + "settleapi/api/statement/export?businessNo=" + item.businessNo
				let name = "对账单-" + item.customerName + "-"
				let filename = this.$gxfmethod.getFileName(name)
				this.$gxfmethod.downFunc(url, 'GET', undefined, filename)
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				
				let param = {
					"current": 1,
					"size": this.totalCount,
					fuzzyParam: this.searchKey,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					beginDate: this.startTime ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime ? this.endTime + ' 23:59:59' : undefined
				};
				let url =this.$gxfmethod.getUrl(this.$url.SETTLE_LIST_DOWN);
				console.log(url)
				let filename = this.$gxfmethod.getFileName("对账列表-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.list-bg {
		display: flex;
		flex: 1;
		width: 100%;
		background: $uni-bg-color-grey;
	}

	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: $uni-bg-color-grey;
		margin-top: calc( 55px);
	}

	.top-view {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}
</style>
