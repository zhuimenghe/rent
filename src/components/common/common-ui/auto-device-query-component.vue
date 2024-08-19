<template>
	<view class="query-content">
		<view class="query-pros-content">
			<view class="select-view" v-if="isQueryCustomTime">
				<selectView :value='getDateLabel(customDate)' :hint='timeHint' @clickSelect="showPick('customDate')" />
			</view>
			<view class="select-view" v-if="isCustomQuery">
				<selectView :value='customObj.label' :hint='customHint' @clickSelect="showPick('custom')" />
			</view>
			<view class="select-view" v-if="isQuerySort">
				<selectView :value='sortObj.label' hint='类别' @clickSelect="showPick('sort')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view" v-if="isQueryType">
				<selectView :value='typeObj.label' hint='类型' @clickSelect="showPick('type')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view" v-if="isQueryHeight&&sortObj.value!='2'">
				<selectView :value='heightObj.label' hint='高度' @clickSelect="showPick('height')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view" v-if="isQueryTonnage&&sortObj.value&&sortObj.value!='1'">
				<selectView :value='tonnageObj.label' hint='吨位' @clickSelect="showPick('tonnage')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view" v-if="isQueryBrand">
				<selectView :value='brandObj.label' hint='品牌' @clickSelect="showPick('brand')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view" v-if="isQueryModel">
				<selectView :value='modelObj.label' hint='型号' @clickSelect="showPick('model')" :textSize='textSize' :height="labelHeight" />
			</view>
			<view class="select-view">
				<view style="padding: 4px;display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
					<view class="query" @click="query">
						<text>查询</text>
					</view>
					<view class="query-clear" @click="reset">
						<text>重置</text>
					</view>
				</view>

			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker :mode="dateType" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true"
		 ref="date" themeColor="#E60000" />
	</view>
</template>

<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		components: {
			selectView,
			wPicker,
		},
		props: {
			timeHint: {
				type: String,
				default: '年份'
			},
			isCustomQuery: {
				type: Boolean,
				default: false
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
				default: false
			},
			isQueryModel: {
				type: Boolean,
				default: true
			},
			isQueryCustomTime: {
				type: Boolean,
				default: false
			},
			dateModel: {
				type: String,
				default: 'date'
			},
			customList: {
				type: Array,
				default () {
					return []
				}
			},
			customHint: {
				type: String,
				default: '请选择'
			},
		},
		data() {
			return {
				textSize: '12px',
				labelHeight: '28px',
				selectList: [],
				picktype: '',
				customDate: '',
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
				dateType: 'date',
				customObj: {},
				notResetList: [], //不需要重置的条件
			}
		},
		created() {
			uni.$on('device-query-auto', obj => {
				this.customDate = obj.customDate ? obj.customDate : '';
				this.sortObj = obj.sortObj ? obj.sortObj : {};
				this.typeObj = obj.typeObj ? obj.typeObj : {};
				this.tonnageObj = obj.tonnageObj ? obj.tonnageObj : {};
				this.heightObj = obj.heightObj ? obj.heightObj : {};
				this.brandObj = obj.brandObj ? obj.brandObj : {};
				this.modelObj = obj.modelObj ? obj.modelObj : {};
				this.customObj = obj.customObj ? obj.customObj : {};
				this.notResetList = obj.notResetList ? obj.notResetList : []
			})
			// this.getOrgList()
			// this.loadOwnerList()
			this.loadDeviceSort()
			this.loadDeviceType()
			this.loadDeviceTonnage()
			this.loadDeviceHeight()
			this.loadDeviceBrand()
			this.loadDeviceModel()

		},
		destroyed() {
			uni.$off('device-query-auto')
		},
		methods: {
			setData() {
				this.$emit('query', {
					sortObj: this.sortObj,
					typeObj: this.typeObj,
					tonnageObj: this.tonnageObj,
					heightObj: this.heightObj,
					brandObj: this.brandObj,
					modelObj: this.modelObj,
					customObj: this.customObj,
					customDate: this.customDate

				})
			},
			//重置
			reset() {
				this.customDate = this.notResetList.some(o => o == 'customDate') ? this.customDate : '';
				this.sortObj = this.notResetList.some(o => o == 'sortObj') ? this.sortObj : {};
				this.typeObj = this.notResetList.some(o => o == 'typeObj') ? this.typeObj : {};;
				this.tonnageObj = this.notResetList.some(o => o == 'tonnageObj') ? this.tonnageObj : {};
				this.heightObj = this.notResetList.some(o => o == 'heightObj') ? this.heightObj : {};
				this.modelObj = this.notResetList.some(o => o == 'modelObj') ? this.modelObj : {};
				this.brandObj = this.notResetList.some(o => o == 'brandObj') ? this.brandObj : {};
				this.customObj = this.notResetList.some(o => o == 'customObj') ? this.customObj : {};
				this.loadDeviceType()
				this.loadDeviceTonnage()
				this.loadDeviceHeight()
				this.loadDeviceBrand()
				this.loadDeviceModel()
				this.$emit('reset')
			},
			//查询
			query() {
				this.setData();
			},
			showPick(type) {
				this.picktype = type
				switch (type) {
					case 'customDate':
						this.dateType = 'year'
						this.$refs.date.show();
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
					case 'custom':
						this.selectList = this.customList
						this.$refs.selector.show();
						break;
					default:
						break;
				}

			},
			onConfirm(val) {
				switch (this.picktype) {
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
					case 'custom':
						this.customObj = val.checkArr
						break;
					case 'customDate':
						//根据自定义日期类型组装完整日期类型
						if (this.dateModel == 'year') {
							this.customDate = val.result + '-01-01 00:00:00'
						}

						break;
					default:
						break;
				}
			},
			getDateLabel(date) {
				let result = ''
				if (this.dateModel == 'year') {
					let newdate = date.replace(/-/g, "/").replace(/-/g, "/")
					result = newdate ? new Date(newdate).getFullYear() + "年" : ''
				}
				return result
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
						brand: this.tonnageObj.value
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
		padding: 4px 8px;
		display: flex;
		flex-direction: column;
	}

	.query-pros-content {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		background-color: #FFFFFF;
	}

	.select-view {
		width: calc((100% - 16px)/3 - 4px);
		padding: 4px;
	}

	.query {
		padding: 4px 8px;
		border: 1px solid $uni-color-primary;
		color: $uni-color-primary;
		background-color: #FFFFFF;
		border-radius: 4px;
		font-size: $uni-font-size-sm;
	}

	.query-clear {
		padding: 4px 8px;
		border: 1px solid $uni-border-color;
		color: $uni-border-color;
		background-color: #FFFFFF;
		border-radius: 4px;
		margin-left: 4px;
		font-size: $uni-font-size-sm;
	}
</style>
