<template>
	<view class="query-content">
    <c-search-bar :placeholder="hint" :value="fuzzyParam" @input="searchChange" @clear="reset" @ok="query">
      <view style="margin-top: 4px;border-top: 1px solid #efefef;">
        <view class="more-container" v-if="isQuerykeyWord">
          <view class="query-search-box">
            <view class="query-search-content">
              <input style="flex: 1;" :placeholder="hint1" placeholder-class="placeholder-style" v-model="keyWord" />
            </view>
          </view>
        </view>
        <view class="more-container" v-if="isQueryDeviceProps">
          <view class="select-view">
            <selectView :value='typeObj.label' hint='类型' @clickSelect="showPick('type')" />
          </view>
          <view class="select-view">
            <selectView :value='heightObj.label' hint='高度' @clickSelect="showPick('height')" />
          </view>
          <!-- 如果有设备属性查询将自定义查询放在这-->
          <view class="select-view" v-if="isCustomQuery &&isQueryDeviceProps">
            <selectView :value='customObj.label' :hint='customHint' @clickSelect="showPick('custom')" />
          </view>
        </view>
        <view class="more-container">
          <view class="select-view" v-if="isQuerySalesman">
            <selectView :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" />
          </view>
          <view class="select-view" v-if="isQueryOrg">
            <selectView :value='orgObj.label' :hint='orgHint' @clickSelect="showPick('org')" />
          </view>
          <view class="select-view" v-if="isQueryOrgNew">
            <selectView :value='orgNewObj.label' :hint='orgNewHint' @clickSelect="showPick('orgNew')" />
          </view>
          <!-- 如果没有设备属性查询将自定义查询放在这-->
          <view class="select-view" v-if="isCustomQuery &&!isQueryDeviceProps">
            <selectView :value='customObj.label' :hint='customHint' @clickSelect="showPick('custom')" />
          </view>
          <view class="select-view" v-if="isShowStateQuery &&!isQueryDeviceProps">
            <selectView :value='signstateObj.label' :hint='signHint' @clickSelect="showPick('sign')" />
          </view>
        </view>


        <view class="more-container" v-if="isQueryTime">
          <view class="select-view">
            <selectView :value='startDate' hint='开始时间' @clickSelect="showPick('startDate')" />
          </view>
          <view class="select-view">
            <selectView :value='endDate' hint='结束时间' @clickSelect="showPick('endDate')" />
          </view>
        </view>

      </view>
      <view class="flex" slot="btnsRight">
        <view class="query-export-css" @click="exportExcel" v-if="isExportList">
          <text>导出</text>
        </view>
      </view>
    </c-search-bar>
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
			isBorder:{
				type:Boolean,
				default:true
			},
			hint: {
				type: String,
				default: '自喷码/车号'
			},
			hint1: {
				type: String,
				default: '合同名称'
			},
			orgHint: {
				type: String,
				default: '区域'
			},
			orgNewHint: {
				type: String,
				default: '调入区域'
			},
			isExportList: {
				type: Boolean,
				default: false
			},
			haveMore: {
				type: Boolean,
				default: true
			},
			isQuerykeyWord: {
				type: Boolean,
				default: false
			},
			isQueryfuzzyParam: {
				type: Boolean,
				default: true
			},
			//是否查询设备属性：类型、高度
			isQueryDeviceProps: {
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
			isQueryOrgNew: {
				type: Boolean,
				default: false
			},
			isQueryTime: {
				type: Boolean,
				default: false
			},
			isCustomQuery: {
				type: Boolean,
				default: false
			},
			isShowStateQuery:{
				type: Boolean,
				default: false
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
			signList: {
				type: Array,
				default () {
					return []
				}
			},
			signHint: {
				type: String,
				default: '请选择'
			},
			defaultKeyWord: {
				type: String,
				default: ''
			},
			defaultFuzzyParam: {
				type: String,
				default: ''
			},
			defaultCustomObj: {
				type: Object,
				default () {
					return {}
				}
			}

		},
		watch: {
			keyWord(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.emitData();

				}, 500);

			},
			fuzzyParam(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.emitData();

				}, 500);
			}
		},
		data() {
			return {
				selectList: [],
				orgList: [],
				salesmanlist: [],
				keyWord: '',
				fuzzyParam: '',
				isMore: false,
				salesmanObj: {},
				orgObj: {},
				orgNewObj: {},
				orgIdList: [],
				picktype: '',
				startDate: '',
				endDate: '',
				sortList: [], //类型
				sortObj: {},
				typeList: [], //类型
				typeObj: {},
				heightList: [],
				heightObj: {},
				customObj: {},
				signstateObj:{}
			}
		},
		created() {
			console.log(this.defaultCustomObj)
			this.keyWord = this.defaultKeyWord ? this.defaultKeyWord : ''
			this.fuzzyParam = this.defaultFuzzyParam ? this.defaultFuzzyParam : ''
			this.customObj = this.defaultCustomObj ? this.defaultCustomObj : {}
			uni.$on('flexible-query-auto', obj => {
				console.log('flexible-query-auto')
				this.keyWord = obj.keyWord ? obj.keyWord : ''
				this.fuzzyParam = obj.fuzzyParam ? obj.fuzzyParam : '';
				this.salesmanObj = obj.salesmanObj ? obj.salesmanObj : {};
				this.stateObj = obj.stateObj ? obj.stateObj : {};
				this.orgObj = obj.orgObj ? obj.orgObj : {};
				this.orgNewObj = obj.orgNewObj ? obj.orgNewObj : {};
				this.orgIdList = obj.orgIdList ? obj.orgIdList : [];
				this.startDate = obj.startDate ? obj.startDate : '';
				this.endDate = obj.endDate ? obj.endDate : '';
				this.sortObj = obj.sortObj ? obj.sortObj : {};
				this.typeObj = obj.typeObj ? obj.typeObj : {};
				this.heightObj = obj.heightObj ? obj.heightObj : {};
				this.customObj = obj.customObj ? obj.customObj : {};
				this.signstateObj = obj.signstateObj ?  obj.signstateObj : {};
			})
			if(this.isQueryOrg||this.isQueryOrgNew){
				this.getOrgList()
			}
			if(this.isQuerySalesman){
				this.loadOwnerList()
			}
			this.loadDeviceSort();
			this.loadDeviceType()
			this.loadDeviceHeight()

		},
		destroyed() {
			uni.$off('flexible-query-auto')
		},
		methods: {
      searchChange(val){
        if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
          this.fuzzyParam = val
					this.emitData();
				}, 500);
      },
			//重置
			reset() {
				this.isMore = false
				this.keyWord = '';
				this.fuzzyParam = '';
				this.salesmanObj = {};
				this.orgObj = {};
				this.orgNewObj = {};
				this.customObj = {};
				this.signstateObj = {};
				this.stateObj = {};
				this.orgIdList = [];
				this.startDate = ""
				this.endDate = ""
				this.sortObj = {};
				this.typeObj = {};
				this.heightObj = {};
				this.$emit('reset')
			},
			//查询
			query() {
				this.isMore = false
				this.emitData();
			},
			setMore() {
				this.isMore = !this.isMore
				this.$emit('clickMore')
			},
			emitData() {
				this.$emit('query', {
					keyWord: this.keyWord,
					fuzzyParam: this.fuzzyParam,
					salesmanObj: this.salesmanObj,
					orgIdList: this.orgIdList,
					orgObj: this.orgObj,
					orgNewObj: this.orgNewObj,
					startDate: this.startDate,
					endDate: this.endDate,
					sortObj: this.sortObj,
					typeObj: this.typeObj,
					heightObj: this.heightObj,
					customObj: this.customObj,
					signstateObj:this.signstateObj
				})
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
					case 'orgNew':
						this.selectList = this.orgList
						this.$refs.selector.show();
						break;
					case 'state':
						this.selectList = this.stateList
						this.$refs.selector.show();
						break;
					case 'sort':
						this.selectList = this.sortList
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
					case 'custom':
						this.selectList = this.customList
						this.$refs.selector.show();
						break;
					case 'sign':
						this.selectList = this.signList
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
					case 'orgNew':
						this.orgNewObj = val.checkArr;
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
						this.heightList = {}
						this.loadDeviceType()
						this.loadDeviceHeight()
						break;
					case 'type':
						this.typeObj = val.checkArr
						this.heightList = {}
						this.loadDeviceHeight()
						break;
					case 'height':
						this.heightObj = val.checkArr
						break;
					case 'custom':
						this.customObj = val.checkArr
						break;
					case 'sign':
						this.signstateObj = val.checkArr
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
					.catch(err => {
					});
			},


			//设备类别
			loadDeviceSort() {
				if (!this.isQueryDeviceProps) {
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
				if (!this.isQueryDeviceProps) {
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


			loadDeviceHeight() {
				if (!this.isQueryDeviceProps) {
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
		}

	}
</script>

<style lang="scss" scoped>

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
    padding-left: 12px;
		height: 30px;
		color: #E60000;
	}

	.query-more-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		border-radius: 4px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
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
	.input-style-search{
		flex: 1;
		font-size: 13px;
	}
</style>
