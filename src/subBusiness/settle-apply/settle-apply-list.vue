<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:posTop+'px'}">
			<flexibleQueryView :isExportList='false' hint='客户名称/项目名称' :isQuerySalesman="true" :isQueryOrg='false' :isCustomQuery="true"
			 :customList='typeList' customHint='申请类型' @reset='reset' @query="query"/>
		</view>
		<list class="list-view">
				<cell  v-for="(item, index) in datalist" :key="index">
					<businessItemFrame  :stateName="item.stateName || ''"
					 :showAttachment="false">
						<block slot="title">
							<view>{{ item.customerName || '-' }}</view>
						</block>
						<block slot="subContent">
							<view class="max-one-line">
								{{item.businessNo}}&nbsp;|&nbsp;{{item.customerSalesmanName|| "-"}}
							</view>
						</block>
						<block slot="content">
							<view>
								<view class="row-line" style="text-align: start;min-height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;;white-space: nowrap;">
										项目名称：
									</view>
									{{ getProjectName(item) }}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										申请类型：
									</view>
									{{item.applyType=='statement'?'对账' :'结算'}}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										申请维度：
									</view>
									{{ item.dimensionType=='2'?'合同' :'客户' }}
								</view>
					
							</view>
						</block>
						<block slot="options">
							<view class="row-line">
								<taskBtn :itemData="item" :isBorder="true" />
							<view class="option-btn" @click.stop="goTo('update', item)" v-if="ishowupdata(item)">修改</view>
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
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
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
				createBy: '',
				selectList: [],
				dimensionList: [{
						label: '全部',
						value: ''
					}, {
						label: '客户维度',
						value: '1'
					},
					{
						label: '合同维度',
						value: '2'
					}
				],
				dimensionObj: {},
				typeList: [{
						label: '全部',
						value: ''
					}, {
						label: '对账申请',
						value: 'statement'
					},
					{
						label: '结算申请',
						value: 'settle'
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
				if (item &&  item.contractInfoDtoList && item.contractInfoDtoList
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
					fuzzyParam: this.searchKey,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					applyType: this.typeObj && this.typeObj.value ? this.typeObj.value : undefined

				};
				this.$network
					.getData(this.$url.APPLY_PAGE, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			goToAdd(){
				uni.navigateTo({
					url: '/businessPages/settle-apply/choose-customer-contract?isFirst=true'
				});
			},
			goTo(type, item) {
				switch (type) {
					case 'detail':
						if (item.dimensionType == '1') { //客户维度
							uni.navigateTo({
								url: '/businessPages/settle-apply/customer/application-customer-detail?businessNo=' + item.businessNo
							});
						} else {
							uni.navigateTo({
								url: '/businessPages/settle-apply/contract/application-contract-detail?businessNo=' + item.businessNo
							});
						}
						break;
					case 'update':
						console.log(item)
						if (item.dimensionType == '1') { //客户维度
							uni.navigateTo({
								url: '/businessPages/settle-apply/customer/application-customer-create?isUpdate=1&item=' +
									encodeURIComponent(JSON.stringify(item))
							});
						} else {
							uni.navigateTo({
								url: '/businessPages/settle-apply/contract/application-contract-create?isUpdate=1&item=' +
									encodeURIComponent(JSON.stringify(item))
							});
						}
						break;
					default:
						break;
				}
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
		margin-top: calc( 55px);
	}

</style>
