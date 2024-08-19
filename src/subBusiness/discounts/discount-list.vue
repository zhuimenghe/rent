<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:posTop+'px'}">
			<flexibleQueryView :isExportList='false' hint='合同名称' :isQuerySalesman="true" :isQueryOrg='false' :isCustomQuery="true"
			 :customList='typeList' customHint='申请类型' @reset='reset' @query="query" @exportExcel="exportExcel" />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell v-for="(item, index) in datalist" :key="index">
					<businessItemFrame :stateName="item.stateName || ''"
					 :showAttachment="false">
						<block slot="title">
							<view>{{item.customerName || ""}}-{{item.projectName || ""}}</view>
						</block>
						<block slot="subContent">
							<view class="max-one-line">
								{{item.businessNo}}&nbsp;|&nbsp;{{item.customerSalesmanName|| "-"}}
							</view>
						</block>
						<block slot="content">
							<view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										调整类型：
									</view>
									{{ item.adjustType=='reduce'?'优惠':'增收'}}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										结算金额：
									</view>
									￥{{formatMoney(item.receivable)}}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										收款金额：
									</view>
									￥{{formatMoney(item.receipt)}}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										调整金额：
									</view>
									￥{{formatMoney(item.adjustAccount)}}
								</view>
					
							</view>
						</block>
						<block slot="options">
							<view class="row-line">
								<taskBtn :itemData="item" :isBorder="true" />								
								<view class="option-btn" @click.stop="goTo('update', item)" v-if="ishowupdata(item)">修改</view>
								<view class="option-btn" @click.stop="deleteItem(item)" v-if="discountDelete">删除</view>
								<view class="option-btn" @click.stop="goTo('detail', item)">详情</view>
							</view>
						</block>
					</businessItemFrame>
				</cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import flexibleQueryView from '@/components/common/common-ui/flexible-query-bar.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	import {mapState} from 'vuex'
	export default {
		components: {
			uniLoadMore,
			taskBtn,
			flexibleQueryView,
			businessItemFrame
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'loading',
				searchKey: '',
				totalCount:100,
				discountDelete:true,
				createBy: '',
				selectList: [],
				typeList: [{
						label: '全部',
						value: ''
					}, {
						label: '优惠',
						value: 'reduce'
					},
					{
						label: '增收',
						value: 'increases'
					}
				],
				typeObj: {},
				salesmanObj: {}
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
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.discountDelete = res.data.some(x => x.value === this.$savekey.PERMISSION_DISCOUNTS_DELETE);
				}
			});
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.createBy = res.data.id;
				}
			});
		},
		methods: {
			reset(val) {
				this.searchKey = '';
				this.typeObj = {};
				this.salesmanObj = {}
				this.headerrefresh();

			},
			query(val) {
				this.searchKey = val.fuzzyParam;
				this.typeObj = val.customObj;
				this.salesmanObj = val.salesmanObj
				this.headerrefresh();
			},
			formatMoney(num) {
				return this.$datestr.doubleFloat(num);
			},
			ishowupdata(item) {
				return this.iscreator(item) && (item.state === '0' || item.state === '3')
			},
			iscreator(item) {
				if (item.createBy === this.createBy) {
					return true
				} else {
					return false
				}
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getProjectName(item) {
				if (item && item.contractInfoDtoList && item.contractInfoDtoList
					.length > 0) {
					let nameList = item.contractInfoDtoList.map(o => {
						return o.projectName;
					})
					return nameList.join(',')
				}
				return '--'

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
					contractName: this.searchKey? this.searchKey : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					adjustType: this.typeObj && this.typeObj.value ? this.typeObj.value : undefined

				};
				this.$network
					.getData(this.$url.DISCOUNT_LIST, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total;
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			goTo(type, item) {
				switch (type) {
					case 'detail':
						uni.navigateTo({
							url: '/businessPages/discounts/discounts-detail?businessNo=' + item.businessNo
						});

						break;
					case 'update':
						uni.navigateTo({
							url: '/businessPages/discounts/customer/discounts-create?isUpdate=1&item=' +
								encodeURIComponent(JSON.stringify(item))
						});
						break;
					default:
						break;
				}
			},
			deleteItem(item) {
				uni.showModal({
					title: '提示',
					content: '确认删除该优惠/增收',
					confirmText: '确认',
					success: res => {
						if (res.cancel) {} else {
							this.deleteDiscount(item)
						}
					}
				});
			},
			deleteDiscount(item) {
				uni.showLoading()
				this.$network
					.getData(this.$url.DELETE_DISCOUNT.replace(/{businessNo}/, item.businessNo), 'DELETE')
					.then(result => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '删除成功'
						})
						this.headerrefresh()
					})
					.catch(err => {

						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details ? err.details[0] : err.message
						})
					});
			},			
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				let param = {
					current: 1,
					size: this.totalCount,
					contractName: this.searchKey? this.searchKey : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					adjustType: this.typeObj && this.typeObj.value ? this.typeObj.value : undefined
				};
				let url = this.$gxfmethod.getUrl(this.$url.DISCOUNT_LIST)
				let filename = this.$gxfmethod.getFileName("优惠增收列表-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.list-bg {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	//顶部时间
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


	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: $uni-bg-color-grey;
		margin-top: calc(55px);
	}
</style>
