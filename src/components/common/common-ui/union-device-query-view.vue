<template>
	<view class="query-content">
		<view class="query-top-container">
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo" v-if="!isQueryContract"></i>
				<view class="query-search-content">
					<input style="flex: 1;" :placeholder="hint" placeholder-class="placeholder-style" v-model="fuzzyParam" />
				</view>
			</view>
			<view class="query-search-box" v-if="isQueryContract">
				<i class="iconfont query-search-icon iconzl--sousuo" v-if="!isQueryContract"></i>
				<view class="query-search-content">
					<input style="flex: 1;" placeholder="合同名称" placeholder-class="placeholder-style" v-model="contractName" />
				</view>
			</view>
			<view class="query-export-css" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
			<view class="query-more-css" @click="isMore=!isMore" v-if="!isShowAll">
				<text>筛选</text>
			</view>
		</view>
		<view v-if="!isShowAll&&isMore||isShowAll" style="margin-top: 4px;border-top: 1px solid #efefef;">
			<view class="more-container" v-if="isQueryTime">
				<view class="select-view">
					<selectView :value='startDate' hint='开始时间' @clickSelect="showPick('startDate')" />
				</view>
				<view class="select-view">
					<selectView :value='endDate' hint='结束时间' @clickSelect="showPick('endDate')" />
				</view>
			</view>
			<view class="more-container">
				<view class="select-view" v-if="isQuerySalesman">
					<selectView :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" />
				</view>
				<view class="select-view" v-if="isQuerySort">
					<selectView :value='sortObj.label' hint='设备类别' @clickSelect="showPick('sort')" />
				</view>
				<view class="select-view" v-if="isQueryType">
					<selectView :value='typeObj.label' hint='设备类型' @clickSelect="showPick('type')" />
				</view>
			</view>
			<view class="more-container">
				<view class="select-view" v-if="isQueryHeight">
					<selectView :value='heightObj.label' hint='高度' @clickSelect="showPick('height')" />
				</view>
				<view class="select-view" v-if="isQueryTonnage">
					<selectView :value='tonnageObj.label' hint='吨位' @clickSelect="showPick('tonnage')" />
				</view>
				<view class="select-view" v-if="isQueryBrand">
					<selectView :value='brandObj.label' hint='品牌' @clickSelect="showPick('brand')" />
				</view>
			</view>
			<view class="more-container">
				<view class="select-view" v-if="isQueryModel">
					<selectView :value='modelObj.label' hint='型号' @clickSelect="showPick('model')" />
				</view>
				<view class="select-view" v-if="isQueryOrg">
					<selectView :value='orgObj.label' hint='区域' @clickSelect="showPick('org')" />
				</view>
			</view>
			<view class="more-container">
				<view class="select-view" v-if="isQuerySortField">
					<selectView :value="sortFieldObj.label" hint="排序" @clickSelect="showPick('sortField')" />
				</view>
				<view class="select-view" v-if="isQueryAsc">
					<selectView :value="ascObj.label" hint="正/倒序" @clickSelect="showPick('asc')" />
				</view>
				<view class="select-view" v-if="showRent">
					<selectView :value="rentObj.label" hint="转租状态" @clickSelect="showPick('rent')" />
				</view>
			</view>

			<view class="query-condition-btn">
				<view class="query-clear query-btn-all" @click="reset">重置</view>
				<view class="query-confirm query-btn-all" @click="query">查询</view>
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date"
		 themeColor="#E60000" />
	</view>
</template>

<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	var timer;
	export default {
		components: {
			selectView,
			wPicker,
		},
		props: {
			showRent:{
				//是否展示转租状态
				type:Boolean,
				default:false
			},
			//是否直接显示所有的查询条件
			isShowAll: {
				type: Boolean,
				default: false
			},
			hint: {
				type: String,
				default: '自喷码/车号'
			},
			isExportList: {
				type: Boolean,
				default: false
			},
			isQuerySalesman: {
				type: Boolean,
				default: true
			},
			isQueryOrg: {
				type: Boolean,
				default: true
			},
			isQuerySortField: {
				type: Boolean,
				default: true
			},
			isQueryAsc: {
				type: Boolean,
				default: true
			},
			isQuerySort: {
				type: Boolean,
				default: true
			},
			isQueryType: {
				type: Boolean,
				default: true
			},
			isQueryHeight: {
				type: Boolean,
				default: true
			},
			isQueryTonnage: {
				type: Boolean,
				default: false
			},
			isQueryBrand: {
				type: Boolean,
				default: true
			},
			isQueryModel: {
				type: Boolean,
				default: true
			},

			isQueryContract: {
				type: Boolean,
				default: false
			},
			isQueryTime: {
				type: Boolean,
				default: false
			},
			isQuerySort: {
				type: Boolean,
				default: false
			},
			isQueryAsc: {
				type: Boolean,
				default: true
			},
			sortFields: {
				type: Array,
				default () {
					return null
				}
			}
		},
		watch: {
			fuzzyParam(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.setData();
				}, 500);


			},
			contractName(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.setData();
				}, 500);

			}
		},
		data() {
			return {
				selectList: [],
				orgList: [],
				salesmanlist: [],
				contractName: '',
				fuzzyParam: '',
				isMore: false,
				salesmanObj: {},
				orgObj: {},
				orgIdList: [],
				picktype: '',
				startDate: '',
				endDate: '',
				sortList: [], //类别
				sortObj: {},
				typeList: [], //类型
				typeObj: {},
				heightList: [],
				heightObj: {},
				tonnageObj: {},
				tonnageList: [],
				brandList: [], //品牌
				brandObj: {},
				modelList: [], //型号
				modelObj: {},
				ascList: [{
						"label": "正序",
						"value": true
					},
					{
						"label": "倒序",
						"value": false
					}
				],
				ascObj: {},
				rentList:[
					{
						"label": "转租",
						"value": 1
					},
					{
						"label": "自有",
						"value": 0
					}
				],
				rentObj:{},
				sortFieldObj: {},
			}
		},
		created() {
			this.getOrgList()
			this.loadOwnerList()
			this.loadDeviceSort()
			this.loadDeviceType()
			this.loadDeviceTonnage()
			this.loadDeviceHeight()
			this.loadDeviceBrand()
			this.loadDeviceModel()

		},
		methods: {
			setDefultData(bt,et,org){
				this.orgObj = org;
				this.startDate = bt;
				this.endDate = et;
			},
			setData() {
				this.$emit('query', {
					contractName: this.contractName,
					fuzzyParam: this.fuzzyParam,
					salesmanObj: this.salesmanObj,
					orgIdList: this.orgIdList,
					orgObj: this.orgObj,
					startDate: this.startDate,
					endDate: this.endDate,
					sortObj: this.sortObj,
					typeObj: this.typeObj,
					tonnageObj: this.tonnageObj,
					heightObj: this.heightObj,
					brandObj: this.brandObj,
					modelObj: this.modelObj,
					sortFieldObj: this.sortFieldObj,
					ascObj: this.ascObj,
					rentObj:this.rentObj

				})
				console.log(this.rentObj,'this.rentObjquery');
			},
			//重置
			/**
			 * @param {Object} isRequest 是否查询业务接口
			 */
			reset() {
				this.isMore = false
				this.contractName = '';
				this.fuzzyParam = '';
				this.salesmanObj = {};
				this.orgObj = {};
				this.stateObj = {};
				this.orgIdList = [];
				this.startDate = ""
				this.endDate = ""
				this.sortObj = {}
				this.typeObj = {};
				this.tonnageObj = {}
				this.heightObj = {};
				this.modelObj = {};
				this.brandObj = {};
				this.sortFieldObj={}
				this.ascObj={}
				this.rentObj={}
				this.loadDeviceType()
				this.loadDeviceTonnage()
				this.loadDeviceHeight()
				this.loadDeviceBrand()
				this.loadDeviceModel()
				this.$emit('reset')
			},
			resetDef(bt,et,org){
				this.isMore = false
				this.contractName = '';
				this.fuzzyParam = '';
				this.salesmanObj = {};
				this.orgObj = org;
				this.stateObj = {};
				this.orgIdList = [];
				this.startDate = bt;
				this.endDate = et;
				this.sortObj = {}
				this.typeObj = {};
				this.tonnageObj = {}
				this.heightObj = {};
				this.modelObj = {};
				this.brandObj = {};
				this.sortFieldObj={}
				this.ascObj={}
				this.rentObj={}
				this.loadDeviceType()
				this.loadDeviceTonnage()
				this.loadDeviceHeight()
				this.loadDeviceBrand()
				this.loadDeviceModel()
				this.$emit('reset')
			},
			//查询
			query() {
				this.isMore = false
				this.setData();
			},
			//导出
			exportExcel() {
				this.$emit('exportExcel')
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
					case 'org':
						this.selectList = this.orgList
						this.$refs.selector.show();
						break;
					case 'state':
						this.selectList = this.stateList
						this.$refs.selector.show();
						break;
					case 'type':
						this.selectList = this.typeList
						this.$refs.selector.show();
						break;
					case 'height':
						this.selectList = this.heightList
						this.$refs.selector.show();
						break;
					case 'brand':
						this.selectList = this.brandList
						this.$refs.selector.show();
						break;
					case 'tonnage':
						this.selectList = this.tonnageList
						this.$refs.selector.show();
						break;
					case 'model':
						this.selectList = this.modelList
						this.$refs.selector.show();
						break;
					case 'sort':
						this.selectList = this.sortList
						this.$refs.selector.show();
						break;
					case 'sortField':
						this.selectList = this.sortFields ? this.sortFields : [];
						this.$refs.selector.show();
						break;
					case 'asc':
						this.selectList = this.ascList ? this.ascList : [];
						this.$refs.selector.show();
						break;
					case 'rent':
						this.selectList = this.rentList ? this.rentList : [];
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
					case 'org':
						this.orgObj = val.checkArr;
						this.orgIdList = [val.checkArr.value]
						break;
					case 'state':
						this.stateObj = val.checkArr;
						break;
					case 'startDate':
						this.startDate = val.result;
						break;
					case 'endDate':
						this.endDate = val.result;
						break;
					case 'sort':
						this.sortObj = val.checkArr
						this.typeObj = {}
						this.heightObj = {}
						this.tonnageObj = {}
						this.brandObj = {}
						this.modelObj = {}
						this.loadDeviceType()
						if (this.sortObj.value != '2') { //挖掘机没有高度
							this.loadDeviceHeight()
						}

						if (this.sortObj.value != '1') { //高空車没有吨位
							this.loadDeviceTonnage()
						}
						this.loadDeviceBrand()
						this.loadDeviceModel()
						break;
					case 'type':
						this.typeObj = val.checkArr
						this.heightObj = {}
						this.tonnageObj = {}
						this.brandObj = {}
						this.modelObj = {}
						if (this.sortObj.value != '') { //没有高度的设备
							this.loadDeviceHeight()
						}

						if (this.sortObj.value != '1') { //高空車没有吨位
							this.loadDeviceTonnage()
						}
						this.loadDeviceBrand()
						this.loadDeviceModel()
						break;
					case 'height':
						this.heightObj = val.checkArr
						this.brandObj = {}
						this.modelObj = {}
						this.loadDeviceBrand()
						this.loadDeviceModel()
						break;
					case 'tonnage':
						this.tonnageObj = val.checkArr
						this.brandObj = {}
						this.modelObj = {}
						this.loadDeviceBrand()
						this.loadDeviceModel()
						break;
					case 'brand':
						this.brandObj = val.checkArr
						this.modelObj = {}
						this.loadDeviceModel()
						break;
					case 'model':
						this.modelObj = val.checkArr
						break;
					case 'sort':
						this.sortFieldObj = val.checkArr;
						break;
					case 'asc':
						this.ascObj = val.checkArr;
						break;
					case 'rent':
						this.rentObj = val.checkArr;
						break;
					default:
						break;
				}
			},

			//区域
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
					.catch(err => {});
			},


			//设备类别
			loadDeviceSort() {
				if (!this.isQuerySort) {
					return;
				}

				let param = {
					source: 'device_type'
				}
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.sortList = [];
						this.sortList.push({
							label: '全部',
							value: ''
						});
						this.sortList = this.sortList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});
			},

			//设备类型
			loadDeviceType() {
				if (!this.isQueryType) {
					return;
				}
				let param = {
					source: 'machine_type'
				}
				if (this.sortObj && this.sortObj.value) {
					param = {
						...param,
						device_type: this.sortObj.value, //设备类别
					}
				}
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.typeList = [];
						this.typeList.push({
							label: '全部',
							value: ''
						});
						this.typeList = this.typeList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});

			},

			//设备品牌
			loadDeviceBrand() {
				if (!this.isQueryBrand) {
					return;
				}
				let param = {
					source: 'brand'
				}
				if (this.sortObj && this.sortObj.value) {
					param = {
						...param,
						device_type: this.sortObj.value, //设备类别
					}
				}
				if (this.typeObj && this.typeObj.value) {
					param = {
						...param,
						machine_type: this.typeObj.value
					}
				}
				if (this.heightObj && this.heightObj.value) {
					param = {
						...param,
						machine_height: this.heightObj.value
					}
				}
				if (this.tonnageObj && this.tonnageObj.value) {
					param = {
						...param,
						tonnage: this.tonnageObj.value
					}
				}
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.brandList = [];
						this.brandList.push({
							label: '全部',
							value: ''
						});
						this.brandList = this.brandList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});
			},

			loadDeviceHeight() {
				if (!this.isQueryHeight) {
					return;
				}
				let param = {
					source: 'machine_height'
				}
				if (this.sortObj && this.sortObj.value) {
					param = {
						...param,
						device_type: this.sortObj.value, //设备类别
					}
				}
				if (this.typeObj && this.typeObj.value) {
					param = {
						...param,
						machine_type: this.typeObj.value
					}
				}

				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.heightList = [];
						this.heightList.push({
							label: '全部',
							value: ''
						});
						this.heightList = this.heightList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});

			},
			loadDeviceTonnage() {
				if (!this.isQueryTonnage) {
					return;
				}
				let param = {
					source: 'tonnage'
				}
				if (this.sortObj && this.sortObj.value) {
					param = {
						...param,
						device_type: this.sortObj.value, //设备类别
					}
				}
				if (this.typeObj && this.typeObj.value) {
					param = {
						...param,
						machine_type: this.typeObj.value
					}
				}

				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.tonnageList = [];
						this.tonnageList.push({
							label: '全部',
							value: ''
						});
						this.tonnageList = this.tonnageList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});

			},

			//设备型号
			loadDeviceModel() {
				if (!this.isQueryModel) {
					return;
				}
				let param = {
					source: 'name'
				}
				if (this.sortObj && this.sortObj.value) {
					param = {
						...param,
						device_type: this.sortObj.value, //设备类别
					}
				}
				if (this.typeObj && this.typeObj.value) {
					param = {
						...param,
						machine_type: this.typeObj.value
					}
				}
				if (this.heightObj && this.heightObj.value) {
					param = {
						...param,
						machine_height: this.heightObj.value
					}
				}
				if (this.tonnageObj && this.tonnageObj.value) {
					param = {
						...param,
						tonnage: this.tonnageObj.value
					}
				}
				if (this.brandObj && this.brandObj.value) {
					param = {
						...param,
						brand: this.brandObj.value
					}
				}
				this.$network
					.getData(this.$url.DEVICE_SELECT, 'POST', param)
					.then(result => {
						this.modelList = [];
						this.modelList.push({
							label: '全部',
							value: ''
						});
						this.modelList = this.modelList.concat(result ? result.map((o, index) => {
							return {
								value: o.key,
								label: o.value,
							};
						}) : []);
					})
					.catch(err => {});
			},
		}

	}
</script>

<style lang="scss" scoped>
	.query-content {
		background-color: #FFFFFF;
		padding: 0px 8px;
		display: flex;
		flex-direction: column;
	}

	//第一行
	.query-top-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background-color: #fff;
		width: 100%;
	}

	.query-search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px;
		flex-direction: row;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.query-search-icon {
		color: #999999;
		padding-left: 16px;
		font-size: $uni-font-size-base;
	}

	.query-search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		margin-right: 10px;
	}

	.query-export-css {		
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		border-radius: 4px;
		margin-right: 5px;
		font-size: 30rpx;
		// color: #E60000;
		// border: 1px solid #E60000;
		background: #FFFFFF;
	}

	.query-more-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		// border: 1px solid #999999;
		border-radius: 4px;
		margin-right: 5px;
		font-size: 30rpx;
		font-weight: 400;
		color: #222222;
	}

	.more-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
		flex: 1;
	}

	.select-view {
		flex: 1;
	}

	.query-condition-btn {
		display: flex;
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
		background: #FFFFFF;
	}

	.query-clear {
		background-color: $uni-border-color;
	}

	.query-confirm {
		background-color: $uni-color-primary;
	}

	.query-btn-all {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
		margin-right: 8px;
		padding: 8px;
		text-align: center;
		border-radius: 4px;
		flex: 1;
		color: #ffffff;
		font-size: $uni-font-size-base;
	}
</style>
