<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			客户营收统计
			<template v-slot:fixed>
				<view class="search-container" v-if="isShowSelect">
					<view class="search-top">
						<view class="select-view">
							<selectView :value="customerTypeObj.label" hint="客户类型" @clickSelect="showPick('customerType')" />
						</view>

						<view class="search-box">
							<i class="iconfont search-icon iconzl--sousuo"></i>
							<view class="search-content"><input placeholder="客户名称" style="font-size: 14px;" v-model="searchKey" /></view>
						</view>
					</view>
					<view class="search-top">
						<view class="select-view">
							<selectView :value="beginDate" hint="开始时间" @clickSelect="showPick('beginDate')" />
						</view>
						<view class="select-view">
							<selectView :value="endDate" hint="结束时间" @clickSelect="showPick('endDate')" />
						</view>

					</view>
					<view class="search-top">
						<view class="select-view-3">
							<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
						</view>
						<view class="select-view-3">
							<selectView :value="orgObj.label" hint="区域" @clickSelect="showPick('org')" />
						</view>
					</view>
					<view class="search-top">
						<view class="select-view-3">
							<selectView :value="proceedDic.label" hint="实收-全部" @clickSelect="showPick('proceed')" />
						</view>
						<view class="select-view-3">
							<selectView :value="billDic.label" hint="应收-全部" @clickSelect="showPick('bill')" />
						</view>
					</view>
					<view class="search-top">
						<view class="select-view">
							<selectView :value="sortFieldObj.label" hint="排序" @clickSelect="showPick('sort')" />
						</view>
						<view class="select-view">
							<selectView :value="ascObj.label" hint="正/倒序" @clickSelect="showPick('asc')" />
						</view>
						<view class="select-view" v-if="revenueType=='1'?isPerformExport:isExport">
							<view class="btn-export" @click="exportData">导出</view>
						</view>
					</view>

					<view class="search-top">
						<view class="btn-reset" @click="reset">重置</view>
						<view class="btn-confirm" @click="submit">确定</view>
					</view>
				</view>
			</template>
		</c-nav-bar-btns>
		<view class="top-container" v-if="revenueType!='1'">
			<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange" />
		</view>
		<view class="list-container" :style="{'margin-top':revenueType!='1'?'56px':'8px'}">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="float-l-r">
					<view class="item-tag">客户名称</view>
					<view class="item-value">{{ item.name || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('customerSalesmanName')">
					<view class="item-tag">业务负责人</view>
					<view class="item-value">{{ item.customerSalesmanName || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('receivableAccount')">
					<view class="item-tag">营收
						<businessTips tipName='performRevenue' />
					</view>
					<view class="item-value link" @click="goTo('revenue', item)">￥{{ item.revenue || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('receiptTotal')">
					<view class="item-tag">实收
						<businessTips tipName='customerReceivedRevenue' />
					</view>
					<view class="item-value link" @click="goTo('revenue', item)">￥{{ item.earning || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('debt')">
					<view class="item-tag">应收
						<businessTips tipName='accountDebt' />
					</view>
					<view class="item-value link" @click="goTo('revenue', item)">{{ item.debt || '' }}</view>
				</view>
				<view class="float-l-r" v-if="isShowField('orgName')">
					<view class="item-tag">区域</view>
					<view class="item-value">{{ item.orgName || '' }}</view>
				</view>
				<view style="background-color: #EEEEEE; height: 1rpx; width: 100%; margin: 8px 0px 0px 0px;"></view>
				<view class="operate-container">
					<view class="contract-detail-btn" @click="goTo('overdue', item)">逾期记录</view>
				</view>
			</view>
			<view>
				<uni-load-more iconType="auto" :status="status" />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date"
		 themeColor="#E60000" />
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
	export default {
		components: {
			selectView,
			wPicker,
			uniLoadMore,
			sunTab
		},
		data() {
			return {
				"navBtns": [
						{
								"text": "筛选",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						},
						{
								"text": "配置",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				//是否显示筛选
				isShowSelect: false,
				selectList: [],
				//合同名称
				searchKey: '',
				//客户类型
				customerTypeList: [],
				customerTypeObj: {},
				//区域
				orgList: [],
				orgObj: {},
				//
				beginDate: '',
				endDate: '',
				pickType: '',
				list: [],
				orgIdList: [],
				page: 1,
				pagesize: 10000,
				status: 'more',
				pageList: [],
				isExport: true,
				isPerformExport: true,
				downloadTask: null,
				contractStatistics: true,
				systemTime: '',
				isStartSysTime: false,
				salesmanList: [],
				salesmanObj: {},
				index: 0,
				tabList: ['结算营收', '账期营收'],
				accountType: '',
				showFields: null,
				sortFields: [],
				sortFieldObj: {},
				ascObj: {},
				ascList: [],
				revenueType: '1',
				proceedArr: [{
					label: '实收-全部',
					value: ''
				}, {
					label: '实收 > 0',
					value: '1'
				}, {
					label: '实收 = 0',
					value: '2'
				}, {
					label: '实收 < 0',
					value: '3'
				}],
				proceedDic: {
					label: '实收-全部',
					value: ''
				},
				billArr: [{
					label: '应收-全部',
					value: ''
				}, {
					label: '应收 > 0',
					value: '1'
				}, {
					label: '应收 = 0',
					value: '2'
				}, {
					label: '应收 < 0',
					value: '3'
				}],
				billDic: {
					label: '应收-全部',
					value: ''
				},
			};
		},
		onLoad(options) {
			this.revenueType = options.revenueType ? options.revenueType : '1'
			switch (this.revenueType) {
				case '1': //履约
				this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"履约营收统计","客户列表");
					uni.setNavigationBarTitle({
						title: '客户履约营收统计'
					})
					break;
				case '2': //账期
				    this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"客户营收统计","列表");
					this.index = 1
					break;
				case '5': //结算
				   this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"客户营收统计","列表");
					this.index = 0
					break;
				default:
					break;
			}
			if (options.indexNum && options.indexNum == 1) {
				this.billDic = {
					label: '应收 > 0',
					value: '1'
				}
			}
			let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
			if (resData) {
				let obj = resData.find(o => o.code === 'use_tenant_start_date') //是否启用系统时间
				let obj1 = resData.find(o => o.code === 'tenant_start_date') //系统开启的时间
				if (obj) {
					//是不是默认显示合同中的进场时间
					this.isStartSysTime = obj.value == 'true' ? true : false
					if (this.isStartSysTime && obj1) {
						this.systemTime = obj1.value
					}
				}
				let obj2 = resData.find(o => o.code === 'account_type') //营收类型
				if (obj2) {
					this.accountType = obj2.value
				}

			}
			this.ascList = dynamicFieldsUtil.SORT_ASC_ARRAY
			this.beginDate = options.beginDate ? options.beginDate : (this.isStartSysTime && this.systemTime ? this.systemTime :
				this.$dateUtil.getFirstDayOfYear(new Date()));
			this.endDate = options.endDate ? options.endDate : '';
			this.orgObj = options.orgObj ? JSON.parse(decodeURIComponent(options.orgObj)) : {};
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isExport = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_CUSTOMER_REVENUE);
					this.isPerformExport = res.data.some(x => x.value === this.$savekey.PERMISSION_CUSTOMER_PERFORM_STATISTICS);
				}
			});
			this.getCustomerTypeList();
			this.getOrgList();
			this.getCustomerData();
			this.loadOwnerList();
			this.getFields()
			uni.$on('cusomterConfigResfresh', obj => {
				this.list = [];
				this.page = 1;
				this.getCustomerData();
				this.getFields()
			})
		},
		onPullDownRefresh() {
			this.list = [];
			this.page = 1;
			this.getCustomerData();
		},
		onReachBottom() {
			if (this.status == 'noMore') {
				return;
			}
			this.status='loading'
			setTimeout(()=>{
				this.page += 1;
				let start = this.page * 10
				let end = this.pageList.length > (this.page * 10 + 10) ? (this.page * 10 + 10) : this.pageList.length
				let cutList = this.pageList.slice(start, end);
				this.list = this.list.concat(cutList)
				if (this.list.length >= this.pageList.length) {
					this.status = 'noMore';
				} else {
					this.status = 'more';
				}
			},1000)
			

		},
		methods: {
			onNavBarButtonTap(e) {
				if (e.index == 0) {
					this.isShowSelect = !this.isShowSelect;
				} else if (e.index == 1) {
					uni.navigateTo({
						url: '/subOtherPages/homecharts/config_dynamic_field?emitType=cusomterConfigResfresh&type=' + dynamicFieldsUtil.STATISTICS_CUSTOMER
					})
				}

			},
			reset() {
				this.list = [];
				this.page = 1;
				this.beginDate = this.isStartSysTime && this.systemTime ? this.systemTime : this.$dateUtil.getFirstDayOfYear(new Date());
				this.endDate = '';
				this.orgObj = {};
				this.customerTypeObj = {};
				this.isShowSelect = false;
				this.searchKey = '';
				this.salesmanObj = {}
				this.proceedDic= {
					label: '实收-全部',
					value: ''
				};
				this.billDic={
					label: '应收-全部',
					value: ''
				};
				this.sortFieldObj= {};
				this.getCustomerData();
			},
			submit() {
				this.isShowSelect = false;
				this.list = [];
				this.page = 1;
				this.getCustomerData();
			},
			isShowField(field) {
				return dynamicFieldsUtil.isShowField(this.showFields, field)
			},
			indexchange(e) {
				this.index = e.index
				this.orgObj = {};
				this.customerTypeObj = {};
				this.isShowSelect = false;
				this.searchKey = '';
				this.salesmanObj = {}

				uni.pageScrollTo({
					scrollTop: 0,
					duration: 10
				})

				this.list = [];
				this.page = 1;
				this.getCustomerData();
			},
			getFields() {
				this.$network
					.getData(this.$url.GET_DYNAMIC_FIELD.replace(/{type}/, dynamicFieldsUtil.STATISTICS_CUSTOMER), 'GET')
					.then(result => {
						this.showFields = result && result.fields ? result.fields : null;
						this.sortFields = dynamicFieldsUtil.getSortFieldsByType(dynamicFieldsUtil.STATISTICS_CUSTOMER, this.showFields)
					})
					.catch(err => {});
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'org':
						this.selectList = this.orgList ? this.orgList : [];
						this.$refs.selector.show();
						break;
					case 'state':
						this.selectList = this.itemStateList ? this.itemStateList : [];
						this.$refs.selector.show();
						break;
					case 'customerType':
						this.selectList = this.customerTypeList ? this.customerTypeList : [];
						this.$refs.selector.show();
						break;
					case 'salesman':
						this.selectList = this.salesmanList ? this.salesmanList : [];
						this.$refs.selector.show();
						break;

					case 'beginDate':
					case 'endDate':
						this.$refs.date.show();
						break;
					case 'sort':
						this.selectList = this.sortFields ? this.sortFields : [];
						this.$refs.selector.show();
						break;
					case 'asc':
						this.selectList = this.ascList ? this.ascList : [];
						this.$refs.selector.show();
						break;
					case 'proceed':
						this.selectList = this.proceedArr ? this.proceedArr : [];
						this.$refs.selector.show();
						break;
					case 'bill':
						this.selectList = this.billArr ? this.billArr : [];
						this.$refs.selector.show();
						break;
					default:
						break;
				}
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'org':
						this.orgObj = val.checkArr;
						this.orgIdList = this.$datestr.getOrgIdList();
						break;
					case 'customerType':
						this.customerTypeObj = val.checkArr;
						break;
					case 'salesman':
						this.salesmanObj = val.checkArr;
						break;
					case 'beginDate':
						this.beginDate = val.result;
						break;
					case 'endDate':
						this.endDate = val.result;
						break;
					case 'sort':
						this.sortFieldObj = val.checkArr;
						break;
					case 'asc':
						this.ascObj = val.checkArr;
						break;
					case 'proceed':
						this.proceedDic = val.checkArr;
						break;
					case 'bill':
						this.billDic = val.checkArr;
						break;
					default:
						break;
				}
			},
			//客户类型
			getCustomerTypeList() {
				this.$network
					.loadUserType('customer_type')
					.then(result => {
						this.customerTypeList = result ? result : [];
					})
					.catch(err => {});
			},
			//加载负责人
			loadOwnerList() {
				let param = {
					showAdmin: false,
					roleType: this.$savekey.USER_ROLE_BUSINESS
				};
				uni.showLoading();
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.salesmanList = result ? result.map(dict => {
							return {
								label: dict.username,
								value: dict.id
							};
						}) : []
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getOrgList() {
				let _self = this;
				this.$network
					.getData(this.$url.ORG_ALL, 'GET', null)
					.then(result => {
						if (result && result.length > 0) {
							result.forEach(function dep(o) {
								_self.orgList = [
									..._self.orgList,
									{
										value: o.id,
										label: o.name,
										children: o.children
									}
								];
								if (o.children && o.children.length > 0) o.children.map(dep);
							});
						}
					})
					.catch(err => {});
			},
			goTo(type, item) {
				switch (type) {
					case 'revenue':
						let revenueType = this.revenueType != '1' ? (this.index == 1 ? '2' : '5') : '1'
						let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
						if (ps && ps.length > 0) {
							this.contractStatistics = ps.some(x => x.value === this.$savekey.PERMISSION_CONTRACT_REVENUE_STATISTICS)
							if (!this.contractStatistics) {
								uni.showToast({
									icon: "none",
									title: '用户没有对应的菜单权限,请联系管理员'
								})
								return
							}
						}
						//缺少customerSalesman--orgIds
						let salesman = {
							label: item.customerSalesmanName,
							value: item.customerSalesman
						};

						uni.navigateTo({
							url: '/subOtherPages/homecharts/statistics/contract-revenue-info?beginDate=' +
								this.beginDate +
								'&endDate=' +
								this.endDate +
								'&salesman=' +
								encodeURIComponent(JSON.stringify(salesman)) +
								'&customerName=' +
								item.name + '&revenueType=' + revenueType+
								'&billDic='+encodeURIComponent(JSON.stringify(this.billDic))+
								'&proceedDic='+encodeURIComponent(JSON.stringify(this.proceedDic))
						});
						break;
					case 'overdue':
						uni.navigateTo({
							url: '/otherPages/overdue/overdue-record?type=customer&customerId=' + item.value
						});
						break;
					default:
						break;
				}
			},
			getCustomerData() {
				uni.showLoading();
				let param = {
					receivableType: this.revenueType == '1' ? '1' : (this.index == 0 ? '5' : this.accountType),
					current: this.page,
					size: this.pagesize,
					paidType: this.proceedDic&&this.proceedDic.value ?this.proceedDic.value: undefined ,
					debtType: this.billDic&&this.billDic.value ?this.billDic.value: undefined ,
					orderItems: this.sortFieldObj && this.sortFieldObj.value ? [{
						asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
						column: this.sortFieldObj.value
					}] : undefined
				};
				if (this.beginDate) {
					param = {
						...param,
						beginDate: this.beginDate + ' 00:00:00'
					};
				}
				if (this.endDate) {
					param = {
						...param,
						endDate: this.endDate + ' 23:59:59'
					};
				}
				if (this.orgObj && this.orgObj.value) {
					param = {
						...param,
						orgIdList: this.$datestr.getOrgIdList(this.orgObj)
					};
				}
				if (this.customerTypeObj && this.customerTypeObj.value) {
					param = {
						...param,
						customerType: this.customerTypeObj.value
					};
				}
				if (this.salesmanObj && this.salesmanObj.value) {
					param = {
						...param,
						customerSalesman: this.salesmanObj.value
					};
				}
				if (this.searchKey) {
					param = {
						...param,
						customerName: this.searchKey
					};
				}

				this.$network
					.getData(this.$url.STATISTICS_CUSTOMER_V2_PAGE, 'POST', param)
					.then(result => {
						let tempaList =
							result ?
							result.map(obj => {
								let revenue = obj.receivable ? (Number(obj.receivable.total) > 0 ? Number(Number(obj.receivable.total).toFixed(
									2)) : 0) : 0;
								let earning = obj.receipt ? (Number(obj.receipt.total) > 0 ? Number(Number(obj.receipt.total).toFixed(2)) : 0) :
									0;
								let debt = Number(obj.receivableTotal).toFixed(2) - earning;
								return {
									...obj,
									revenue: this.moneyUtil.dealNumber(revenue),
									//实收
									earning: this.moneyUtil.dealNumber(earning),
									debt: obj.payable ? '￥' + this.moneyUtil.dealNumber(obj.payable) : '-',
								};
							}) : [];
						this.pageList = [...tempaList]
						if (this.pageList.length > 10) {
							this.list = this.pageList.slice(0, 10);
							this.status = 'more';
						} else {
							this.list = this.pageList
							this.status = 'noMore';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.list = this.page == 1 ? [] : this.list
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			}, //---------------------下载---------------------------------------------
			exportData() {
				 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"客户营收统计","导出");
				this.downxlsc();
			},
			downxlsc() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = {
					paidType: this.proceedDic&&this.proceedDic.value ?this.proceedDic.value: undefined ,
					debtType: this.billDic&&this.billDic.value ?this.billDic.value: undefined ,
					receivableType: this.revenueType == '1' ? '1' : (this.index == 0 ? '5' : this.accountType),
					beginDate: this.beginDate ? this.beginDate + " 00:00:00" : undefined,
					endDate: this.endDate ? this.endDate + " 23:59:59" : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					orgIdList: this.orgObj && this.orgObj.value ? this.$datestr.getOrgIdList(this.orgObj) : undefined,
					customerType: this.customerTypeObj && this.customerTypeObj.value ? this.customerTypeObj.value : undefined,
					customerName: this.searchKey ? this.searchKey : undefined,
					orderItems: this.sortFieldObj && this.sortFieldObj.value ? [{
						asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
						column: this.sortFieldObj.value
					}] : undefined
				};
				let url = this.$gxfmethod.getUrl(this.$url.STATISTICS_CUSTOMER_V2_PAGE)
				let  revenueTypeName = this.revenueType == '1' ? '履约' : (this.index == 0 ? '结算' : '账期')
				let filename = this.$gxfmethod.getFileName(`营收统计-客户${revenueTypeName}营收报表`)
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
		},
		onUnload() {
			uni.$off('cusomterConfigResfresh')
			if (this.downloadTask) {
				console.log('contract---hiden');
				this.downloadTask.abort();
			}
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		padding-bottom:env(safe-area-inset-bottom);
		width: 100%;
		// height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
		z-index: 100;
		// position: fixed;
		top: 0px;
		left: 0px;
		z-index: 950;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 600;
	}

	.search-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
		padding-bottom: 4px;
		width: 100%;
		z-index: 100;
	}

	.search-bottom {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		width: 100%;
		z-index: 55;
		color: $uni-color-title;
		margin: 5px;
		font-size: $uni-font-size-sm;
		text-align: center;
	}

	.select-view {
		flex: 1;
	}

	.select-view-2 {
		flex: 2;
	}

	.select-view-3 {
		flex: 3;
	}

	.search-box {
		background: #F7F7F7;
		height: 32px;
		flex: 1;
		line-height: 32px;
		display: flex;
		margin: 8px 8px;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.select-container {
		display: flex;
		width: 40%;
		flex-direction: column;
		position: relative;
	}

	.select-label {
		display: flex;
		flex-direction: row;
		margin-left: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.select-list {
		position: absolute;
		display: flex;
		flex-direction: column;
		top: 28px;
		left: 0px;
		width: 150%;
		font-size: $uni-font-size-base;
		text-align: center;
		background-color: $uni-bg-color-grey;
		border-radius: 0px 0px 4px 4px;
	}

	.select-item {
		height: 35px;
		width: 100%;
		background-color: #ffffff;
		text-align: left;
		line-height: 35px;
		margin-top: 1rpx;
		padding-left: 15px;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		flex: 1;
	}

	.export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #ffffff;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
		margin-left: 5px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}

	.btn-confirm {
		padding: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #ffffff;
		background-color: $uni-color-primary;
		border-radius: 4px;
		margin: 0px 4px;
		flex: 1;
	}

	.btn-reset {
		padding: 6px;
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.btn-export {
		padding: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
	}

	.list-container {
		margin-top: 56px;
	}

	.list-item {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 8px;
		margin: 0px 8px 4px 8px;
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: $uni-font-size-base;
	}

	.float-l-r {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.item-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: $uni-text-color-gray;
		margin: 4px 0px;
		width: 72px;
		min-width: 72px;
		font-size: $uni-font-size-base;
	}

	.item-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
	}

	.link {
		color: $uni-color-primary;
	}

	.c-title {
		color: $uni-text-color;
		width: 65%;
		margin-bottom: 8px;
		overflow: hidden;
		display: -webkit-box;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		/*要显示的行数*/
		-webkit-box-orient: vertical;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.title-tag {
		color: $uni-color-primary;
	}

	.state-view {
		font-size: $uni-font-size-base;
		color: $uni-text-color-disable;
	}

	.operate-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}

	.contract-detail-btn {
		margin-top: 5px;
	}
</style>
