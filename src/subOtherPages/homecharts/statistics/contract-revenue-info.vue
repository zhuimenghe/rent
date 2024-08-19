<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			合同营收统计
			<template v-slot:fixed>
				<view class="search-container" v-if="isShowSelect">
					<view class="search-top">
						<view class="search-box">
							<i class="iconfont search-icon iconzl--sousuo"></i>
							<view class="search-content">
								<input placeholder="合同名称" v-model="contractName" placeholder-class="placeholder-style" style="font-size: 14px;" />
							</view>
						</view>
					</view>
					<view class="search-top">
						<view class="select-view">
							<selectView :value="index==1?$dateUtil.timeFormatYM(beginDate):beginDate" hint="开始时间" @clickSelect="showPick('beginDate')" />
						</view>
						<view class="select-view">
							<selectView :value="index==1?$dateUtil.timeFormatYM(endDate):endDate" hint="结束时间" @clickSelect="showPick('endDate')" />
						</view>
						<!-- <view class="export-css" @click="downExcellist"><text>导出</text></view> -->
					</view>
					<view class="search-top">
						<view class="select-view">
							<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
						</view>
						<view class="select-view">
							<selectView :value="contractStateObj.label" hint="合同进度" @clickSelect="showPick('state')" />
						</view>
						<view class="select-view">
							<selectView :value="orgObj.label" hint="区域" @clickSelect="showPick('org')" />
						</view>

					</view>
					<view class="search-top">
						<view class="select-view">
							<selectView :value="proceedDic.label" hint="实收-全部" @clickSelect="showPick('proceed')" />
						</view>
						<view class="select-view">
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
						<view class="export-css" @click="downExcellist" v-if="revenueType=='1'?isExporPerformtList:isExportList"><text>导出</text></view>
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
			<view v-if="currentObj.id==0">
				<tab-contract-perform-list ref="performList" :showFields="showFields" />
			</view>
			<view v-if="currentObj.id==1">
				<tabContractAccountList ref="accountList" :showFields="showFields" />

			</view>
			<view v-if="currentObj.id==2">
				<tabContractSettleList ref="settleList" :showFields="showFields" />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker :mode="dateMode" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
		 ref="date" themeColor="#E60000" />
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import tabContractAccountList from './tab-contract-revenue-list.vue';
	import tabContractPerformList from './tab-contract-perform-list.vue';
	import tabContractSettleList from './tab-contract-settle-list.vue';
	import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
	var timer;
	export default {
		components: {
			selectView,
			wPicker,
			sunTab,
			tabContractAccountList,
			tabContractPerformList,
			tabContractSettleList
		},
		watch: {
			contractName(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.headerrefreshInfo()
				}, 500);
			},
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
				contractName: '',
				//业务负责人
				salesmanList: [],
				salesmanObj: {},
				//区域
				orgList: [],
				orgObj: {},
				//合同状态
				contractStateObj: {},
				contractStateList: [],
				//
				beginDate: '',
				endDate: '',

				dateMode: "date",
				isExportList: true, //列表导出
				isExporPerformtList: true, //列表导出
				downloadTask: null,
				totalNum: 0,
				pickType: '',
				index: 0,
				tabList: [],
				tabListObj: [
					// {
					// 	"name": "履约营收",
					// 	"id": 0,
					// 	"ref": "performList"
					// },
					{
						"name": "结算营收",
						"id": 2,
						"ref": "settleList"
					},
					{
						"name": "账期营收",
						"id": 1,
						"ref": "accountList"
					}

				],
				currentObj: {},
				systemTime: '',
				isStartSysTime: false,
				//----------
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
				sortType: 'revenue',
				accountType: '2',
				showFields: null,
				sortFields: [],
				sortFieldObj: {},
				ascObj: {},
				ascList: [],
				revenueType: "1"
			};
		},
		onLoad(options) {
			if (options.indexNum && options.indexNum == 1) {
				this.billDic = {
					label: '应收 > 0',
					value: '1'
				}
			}
			this.revenueType = options.revenueType ? options.revenueType : '1'
			switch (this.revenueType) {
				case '1': //履约
				this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"履约营收统计","合同列表");
					uni.setNavigationBarTitle({
						title: '合同履约营收统计'
					})
					this.currentObj = {
						"name": "履约营收",
						"id": 0,
						"ref": "performList"
					}
					break;
				case '2': //账期
				 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"合同营收统计","列表");
					this.index = 1
					this.currentObj = this.tabListObj[this.index];
					break;
				case '5': //结算
				 this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"合同营收统计","列表");
					this.index = 0
					this.currentObj = this.tabListObj[this.index];
					break;
				default:
					break;
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
			this.salesmanObj = options.salesman ? JSON.parse(decodeURIComponent(options.salesman)) : {};
			this.contractName = options.customerName ? options.customerName : "";
			this.beginDate = options.beginDate ? options.beginDate : (this.isStartSysTime && this.systemTime ? this.systemTime :'');
			this.endDate = options.endDate ? options.endDate : '';
			this.orgObj = options.orgObj ? JSON.parse(decodeURIComponent(options.orgObj)) : {};
			this.billDic = options.billDic ? JSON.parse(decodeURIComponent(options.billDic)) : this.billDic;
			this.proceedDic = options.proceedDic ? JSON.parse(decodeURIComponent(options.proceedDic)) : this.proceedDic;
			this.sortType = options.sortType ? options.sortType : 'revenue'
			this.tabList = this.tabListObj.map(o => {
				return o.name;
			})
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					this.chartCredit = res.data.some(x => x.value === this.$savekey.PERMISSION_CHART_CREDIT)
					this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_CONTRACT_REVENUE_STATISTICS_EXPORT)
					this.isExporPerformtList = res.data.some(x => x.value === this.$savekey.PERMISSION_CONTRACT_PERFORM_STATISTICS_EXPORT)
					
					
				}
			})
			
			this.loadOwnerList();
			this.getContractStates();
			this.getOrgList();
			this.getFields();
			this.headerrefreshInfo()
			uni.$on('configResfresh', obj => {
				this.headerrefreshInfo()
				this.getFields()
			})
		},
		onPullDownRefresh() {
			this.headerrefreshInfo()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			onNavBarButtonTap(e) {
				if (e.index == 0) {
					this.isShowSelect = !this.isShowSelect;
				} else if (e.index == 1) {
					uni.navigateTo({
						url: '/subOtherPages/homecharts/config_dynamic_field?emitType=configResfresh&type=' + (this.currentObj.id == 2 ?
							dynamicFieldsUtil.STATISTICS_CONTRACT_SETTLE : dynamicFieldsUtil.STATISTICS_CONTRACT_ACCOUNT)
					})
				}

			},
			findCurObj(findId) {
				this.tabListObj.map((o, pos) => {
					if (o.id == findId) {
						this.index = pos
						this.currentObj = { ...o
						}
					}
				})
			},
			reset() {
				this.salesmanObj = {}
				this.contractName = ""
				this.beginDate = this.isStartSysTime && this.systemTime ? this.systemTime :''
				this.endDate = '';
				this.orgObj = {};
				this.contractStateObj = {}
				this.isShowSelect = false;
				this.proceedDic= {
					label: '实收-全部',
					value: ''
				};
				this.billDic={
					label: '应收-全部',
					value: ''
				};
				this.sortFieldObj= {};
				this.headerrefreshInfo()
			},
			submit() {
				this.isShowSelect = false;
				this.headerrefreshInfo()
			},
			indexchange(e) {
				setTimeout(() => {
					this.index = e.index
					this.currentObj = this.tabListObj[this.index];
					this.headerrefreshInfo()
					this.getFields()
				}, 100)
			},
			headerrefreshInfo() {
				switch (this.currentObj.id) {
					case 0:
						setTimeout(() => {
							this.$refs.performList.headerrefresh(
								this.orgObj,
								this.contractName,
								this.salesmanObj,
								this.beginDate,
								this.endDate,
								this.billDic,
								this.proceedDic,
								this.contractStateObj,
								this.sortType,
								(this.sortFieldObj && this.sortFieldObj.value ? [{
									asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
									column: this.sortFieldObj.value
								}] : undefined));
						}, 100);
						break;
					case 1:
						setTimeout(() => {
							this.$refs.accountList.headerrefresh(
								this.orgObj,
								this.contractName,
								this.salesmanObj,
								this.contractStateObj,
								this.beginDate,
								this.endDate,
								this.billDic,
								this.proceedDic,
								this.sortType,
								this.accountType,
								(this.sortFieldObj && this.sortFieldObj.value ? [{
									asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
									column: this.sortFieldObj.value
								}] : undefined));
						}, 100);
						break;
					case 2:
						setTimeout(() => {
							this.$refs.settleList.headerrefresh(
								this.orgObj,
								this.contractName,
								this.salesmanObj,
								this.contractStateObj,
								this.beginDate,
								this.endDate,
								this.billDic,
								this.proceedDic,
								this.sortType,
								(this.sortFieldObj && this.sortFieldObj.value ? [{
									asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
									column: this.sortFieldObj.value
								}] : undefined));
						}, 100);
						break;
					// case 0:
					// 	setTimeout(() => {
					// 		this.$refs.performList.headerrefresh(
					// 			this.orgObj,
					// 			this.contractName,
					// 			this.salesmanObj,
					// 			this.beginDate,
					// 			this.endDate,
					// 			this.billDic,
					// 			this.proceedDic,
					// 			this.contractStateObj,
					// 			this.sortType);
					// 	}, 100);
					// 	break;
					default:
						break;
				}
			},
			footerrefresh() {
				switch (this.currentObj.id) {
					case 0:
						this.$refs.performList.footerrefresh(
							this.orgObj,
							this.contractName,
							this.salesmanObj,
							this.beginDate,
							this.endDate,
							this.billDic,
							this.proceedDic,
							this.contractStateObj,
							this.sortType,
							(this.sortFieldObj && this.sortFieldObj.value ? [{
								asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
								column: this.sortFieldObj.value
							}] : undefined));
						break;
					case 1:
						this.$refs.accountList.footerrefresh(
							this.orgObj,
							this.contractName,
							this.salesmanObj,
							this.contractStateObj,
							this.beginDate,
							this.endDate,
							this.billDic,
							this.proceedDic,
							this.sortType,
							this.accountType,
							(this.sortFieldObj && this.sortFieldObj.value ? [{
								asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
								column: this.sortFieldObj.value
							}] : undefined));
						break;
					case 2:
						this.$refs.settleList.footerrefresh(
							this.orgObj,
							this.contractName,
							this.salesmanObj,
							this.contractStateObj,
							this.beginDate,
							this.endDate,
							this.billDic,
							this.proceedDic,
							this.sortType,
							(this.sortFieldObj && this.sortFieldObj.value ? [{
								asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
								column: this.sortFieldObj.value
							}] : undefined));
						break;
					default:
						break;
				}
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'org':
						this.selectList = this.orgList ? this.orgList : [];
						this.$refs.selector.show();
						break;
					case 'state':
						this.selectList = this.contractStateList ? this.contractStateList : [];
						this.$refs.selector.show();
						break;
					case 'salesman':
						this.selectList = this.salesmanList ? this.salesmanList : [];
						this.$refs.selector.show();
						break;
					case 'sort':
						this.selectList = this.sortFields ? this.sortFields : [];
						this.$refs.selector.show();
						break;
					case 'asc':
						this.selectList = this.ascList ? this.ascList : [];
						this.$refs.selector.show();
						break;
					case 'beginDate':
					case 'endDate':
						if (this.index == 1) {
							this.dateMode = 'yearMonth'
						} else {
							this.dateMode = 'date'
						}
						this.$refs.date.show();
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
						break;
					case 'state':
						this.contractStateObj = val.checkArr;
						break;
					case 'salesman':
						this.salesmanObj = val.checkArr;
						break;
					case 'beginDate':
						if (this.index == 1) {
							this.beginDate = val.result + "-01"
						} else {
							this.beginDate = val.result
						}
						break;
					case 'endDate':
						if (this.index == 1) {
							//获取当前月的最后一天
							this.endDate = this.$dateUtil.getLastDayOfMonth(new Date(val.result + "-01"))
						} else {
							this.endDate = val.result
						}
						break;
					case 'proceed':
						this.proceedDic = val.checkArr;
						break;
					case 'bill':
						this.billDic = val.checkArr;
						break;

					case 'sort':
						this.sortFieldObj = val.checkArr;
						break;
					case 'asc':
						this.ascObj = val.checkArr;
						break;
					default:
						break;
				}
			},
			getFields() {
				this.$network
					.getData(this.$url.GET_DYNAMIC_FIELD.replace(/{type}/, (this.currentObj.id == 2 ? dynamicFieldsUtil.STATISTICS_CONTRACT_SETTLE :
						dynamicFieldsUtil.STATISTICS_CONTRACT_ACCOUNT)), 'GET')
					.then(result => {
						this.showFields = result && result.fields ? result.fields : null;
						this.sortFields = dynamicFieldsUtil.getSortFieldsByType((this.currentObj.id == 2 ? dynamicFieldsUtil.STATISTICS_CONTRACT_SETTLE :
							dynamicFieldsUtil.STATISTICS_CONTRACT_ACCOUNT), this.showFields)
					})
					.catch(err => {});
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
						this.salesmanList = result ? result.map(dict => {
							return {
								label: dict.username,
								value: dict.id
							};
						}) : []
					})
					.catch(err => {});
			},
			searchChange(val) {
				setTimeout(() => {
					this.contractName = val.detail.value;
					this.headerrefreshInfo();
				}, 500);
			},
			getOrgList() {
				let _self = this
				this.$network.getData(this.$url.ORG_ALL, "GET").then((result) => {
					if (result && result.length > 0) {
						result.forEach(function dep(o) {
							_self.orgList = [..._self.orgList, {
								value: o.id,
								label: o.name,
								children: o.children
							}];
							if (o.children && o.children.length > 0) o.children.map(dep);
						})
					}


				}).catch((err) => {})
			},

			//合同状态
			getContractStates() {
				this.$network
					.loadUserType('contract_status')
					.then(result => {
						this.contractStateList = result.filter(o => {
							return o.value == '4' || o.value == '6' || o.value == '7' || o.value == '8' || o.value == '9';
						});
					})
					.catch(err => {});
			},
			//---------------------下载---------------------------------------------
			downExcellist() {
				this.$gxfmethod.statisticData(this.$eventId.Statistics_Analyse,"合同营收统计","导出");
				let headerDic = {
					'Content-Type': 'application/json',
					Authorization: ''
				};
				let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
				if (loginMes) {
					let access_token = loginMes.token_type + ' ' + loginMes.access_token;
					headerDic.Authorization = access_token;
					this.downxlsc(headerDic);
				}
			},
			downxlsc(headerDic) {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = {
					contractName: this.contractName ? this.contractName : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					orgIdList: this.orgObj && this.orgObj.value ? this.$datestr.getOrgIdList(this.orgObj) : undefined,
					beginDate: this.beginDate ? this.beginDate + " 00:00:00" : undefined,
					endDate: this.endDate ? this.endDate + " 23:59:59" : undefined,
					paidType: this.proceedDic.value === '' ? undefined : this.proceedDic.value,
					debtType: this.billDic.value === '' ? undefined : this.billDic.value,
					state: this.contractStateObj && this.contractStateObj.value ? this.contractStateObj.value : undefined,
					receivableType: this.currentObj.id == 1 ? this.accountType : (this.currentObj.id == 2 ? '5' : '1'),
					orderItems: this.sortFieldObj && this.sortFieldObj.value ? [{
						asc: this.ascObj && this.ascObj.value !== '' ? this.ascObj.value : true,
						column: this.sortFieldObj.value
					}] : undefined
				};
				let url = this.$gxfmethod.getUrl(this.$url.REVENUE_V2_LIST)
				let  revenueTypeName = this.currentObj.id == '1' ? '账期' : (this.currentObj.id == 2 ? '结算' : '履约')
				let filename = this.$gxfmethod.getFileName(`营收统计-合同${revenueTypeName}营收报表`)
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},

		},
		onUnload() {
			uni.$off('configResfresh')
			if (this.downloadTask) {
				this.downloadTask.abort();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
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
		z-index: 900;
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

	.select-view {
		// display: flex;
		flex: 1;
		// flex-direction: row;
		// align-items: center;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 8px 0px 8px;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
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
		background: #FFFFFF;
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
		color: #FFFFFF;
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

	.list-container {
		margin-top: 45px;
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

	.types-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		font-size: $uni-font-size-xs;
		padding-bottom: 8px;
	}

	.type-item-container {
		margin-bottom: 4px;
	}

	.in-type {
		padding: 0px 8px;
		border-radius: 8px;
		border-width: 1px;
		border-style: solid;
		height: 14px;
		line-height: 14px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.rent-name-view {
		color: $uni-color-primary;
		border-color: $uni-color-primary;
		margin-right: 8px;
	}

	.pay-appoint-view {
		color: #6280ed;
		border-color: #6280ed;
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
		margin-right: 15px;
	}

	.pop-container {
		position: relative;
		z-index: 999;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		border-radius: 10px;
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

	.pop-item-line {
		border-style: solid;
		border-color: $uni-bg-color-grey;
		border-width: 1px 0px 0px 0px;
	}
</style>
