<template>
	<view class="change-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:posTop+'px'}">
			<moreQueryView :isExportList='false' @reset='reset' @query="query" @exportExcel="exportExcel" />
		</view>
		<list class="list-view">
			<cell v-for="(item, index) in datalist" :key="index">
				<businessItemFrame  :stateName="item.stateName||''" :showAttachment="false" :showHeadTag="item.contractType != '1'">
					<block slot="title">
						<view class="row-line" style="align-items: flex-start;">
							<!-- <view style="height: 18px;min-width: 16px;margin-right: 6px;line-height: 18px;" v-if="item.contractType!= '1'">
								<text class="title-tag-text" :style="{'background-color':item.contractType== '3'?'#FE931F':'#E60000'}">
									{{item.contractType== '2'?'框':(item.contractType== '3'?'快':'普')}}
								</text>
							</view> -->
							<view v-if="item.contractType != '1'">
								<headTag :value="item.contractType == '2' ? '框' : '快'"
								:backgroundColor= "item.contractType == '2' ? '#1278FF' : '#F08200'"></headTag>
							</view>

							<view>{{item.customerName||"" }}-{{ item.projectName||"" }}</view>
						</view>
					</block>
					<block slot="subContent">
						<view class="max-one-line">
							{{item.businessNo}}&nbsp;|&nbsp;{{item.customerSalesmanName|| "-"}}&nbsp;|&nbsp;{{item.orgName|| "-"}}
						</view>
					</block>
					<block slot="content">
						<view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									附加日期：
								</view>
								{{ changestr(item.createTime) }}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									合同单号：
								</view>
								<view style="color: #E60000;" @click.stop="gotoContractDetail(item)">
									{{ item.contractNo || '-' }}
								</view>

							</view>
						</view>
					</block>
					<block slot="options">
						<view class="row-line">
							<taskBtn :itemData="item" :isBorder="true" />
							<view class="option-btn" @click.stop="goToUpdate(item)" v-if="(createBy===item.createBy)&&(item.state === '0')"><text>修改</text></view>
							<view class="option-btn" @click.stop="gotodetail(item)"><text>详情</text></view>


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
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import moreQueryView from '@/components/common/common-ui/business-query-bar.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	import headTag from '@/components/common/common-ui/head-tag.vue';
	import {mapState} from 'vuex'

	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			taskBtn,
			moreQueryView,
			businessItemFrame,
			headTag
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'loading',
				keyWord: "",
				searchKey: '',
				createBy: '',
				totalCount: '100',
				salesmanObj: {},
				orgObj: {}
			};
		},
		computed:{
			...mapState('system',{
				posTop:s=>s.statusBarHeight+s.titleBarHeight,
			}),
		},
		mounted() {
			uni.showLoading();
			this.loaddata();
		},
		created() {
			this.$gxfmethod.statisticData(this.$eventId.Contract_Administrative,"附加合同","列表");
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.createBy = res.data.id;
				}
			});
		},
		onLoad() {
			uni.showLoading();
			this.loaddata();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		//上拉加载
		onReachBottom() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.loaddata();
		},
		methods: {
			reset(val) {
				this.searchKey = "";
				this.orgObj = {};
				this.salesmanObj = {};
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			query(val) {
				console.log(val)
				this.searchKey = val.contractName;
				this.orgObj = val.orgObj;
				this.salesmanObj = val.salesmanObj;
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
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
					contractName: this.searchKey,
					customerSalesman: this.salesmanObj.value ? this.salesmanObj.value : null,
					orgId: this.orgObj.value ? this.orgObj.value : null,
				};
				this.$network
					.getData(this.$url.CONTRACT_EXPANSE, 'GET', param)
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
			goToAdd() {
				this.$gxfmethod.statisticData(this.$eventId.Contract_Administrative,"附加合同","新增");
				uni.navigateTo({
					url: '/businessPages/invoice/contract-choose?type=contractExpense&state=5,6,7,8&contractType=1&title=选择附加合同&isFirst=true'
				});
			},
			gotodetail(item) {
				console.log(item,'gotodetail');
				let url = '/contractPages/contract-expense/contract-expense-detail?businessKey=' + (item.businessKey||'') +'&contractNo='+item.contractNo+'&plusContractId='+item.id;
				uni.navigateTo({
					url: url
				});
			},
			gotoContractDetail(item) {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
				});

			},
			goToUpdate(item) {
				uni.navigateTo({
					url: '/contractPages/contract-expense/create-contract-expense?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(
						item))
				});
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				let param = {
					contractName: this.searchKey,
				};
				let url = this.$url.CONTRACT_EXPANSE + '?isExport=true&current=1&size=' + this.totalCount
				let downurl = this.$gxfmethod.forEachObj(url, param)
				let filename = this.$gxfmethod.getFileName("合同附加记录列表-")
				this.$gxfmethod.downFunc(downurl, 'GET', param, filename)
			},

		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.change-list-bg {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	.top-view {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		left: 0px;
		margin-bottom: 1px;
		background: #FFFFFF;
	}

	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: $uni-bg-color-grey;
		margin-top: calc(55px);
	}
	.title-tag-text {
		color: #ffffff;
		box-sizing: border-box;
		font-size: 12px;
		padding: 2px;
		text-align: center;
		background-color: #E60000;
		border-radius: 4px;
		font-weight: 400;
	}

	.change-name {
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
	}
</style>
