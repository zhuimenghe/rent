<template>
	<view class="query-content">
		<view class="query-top-container">
		<slot v-if="showTotalCount" name="totalCount"></slot>
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo"></i>
				<view class="query-search-content">
					<input style="flex: 1;font-size: 14px;color: #333333;" :placeholder="hint" placeholder-class="placeholder-style"
					 v-model="contractName" />
				</view>
			</view>
			<view class="query-export-css" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
			<view class="query-more-css" @click="showMore">
				<text>筛选</text>
			</view>
			<view class="query-more-css" @click="exportExcel" v-if="isDownLoad">
				<text>下载</text>
			</view>
		</view>
		<view v-if="isControlMore?isControlShow:isMore " style="margin-top: 4px;border-top: 1px solid #efefef;">
			<view class="more-container-top">
				<view class="select-view-top">
					<selectView :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" />
				</view>
				<view class="select-view-top" v-if="isQueryOrg">
					<selectView :value='orgObj.label' hint='区域' @clickSelect="showPick('org')" />
				</view>
				<view class="select-view-top" v-if='isQueryState'>
					<selectView :value='stateObj.label' hint='审批状态' @clickSelect="showPick('state')" />
				</view>
        <view class="select-view-top" v-if='isQueryEsign'>
					<selectView :value='esignStatusObj.label' hint='电签状态' @clickSelect="showPick('esign')" />
				</view>
				<view class="select-view-top" v-if='isQueryCustom'>
					<selectView :value='customObj.label' :hint='customHint' @clickSelect="showPick('custom')" />
				</view>
				<view class="select-view" v-if='isApplyDate'>
					<selectView :value='applyDate' hint='发起时间' @clickSelect="showPick('applyDate')" />
				</view>
				<slot></slot>
			</view>
			<view class="more-container" v-if="isQueryTime">
				<view class="select-view">
					<selectView :value='startDate' hint='开始时间' @clickSelect="showPick('startDate')" />
				</view>
				<view class="select-view">
					<selectView :value='endDate' hint='结束时间' @clickSelect="showPick('endDate')" />
				</view>

			</view>
			<view class="query-condition-btn">
				<view class="query-clear query-btn-all" @click="reset">{{isClear?'清除':'重置'}}</view>
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
			showTotalCount:{
				type:Boolean,
				default:false
			},
			//为true时，展示清除 否则展示重置
			isClear:{
				type:Boolean,
				default:false
			},
			//是否会展示下载按钮
			isDownLoad:{
				type:Boolean,
				default:false
			},
			hint: {
				type: String,
				default: '合同名称'
			},
			//是否外部控制显示更多
			isControlMore: {
				type: Boolean,
				default: false
			},
			isControlShow: {
				type: Boolean,
				default: false
			},
			isQueryCustom: {
				type: Boolean,
				default: false
			},
			customList: Array,
			customHint: String,
			isExportList: {
				type: Boolean,
				default: false
			},
			isQueryOrg: {
				type: Boolean,
				default: true
			},
			isQueryState: {
				type: Boolean,
				default: false
			},
			isQueryTime: {
				type: Boolean,
				default: false
			},
			isApplyDate: {
				type: Boolean,
				default: false
			},
      isQueryEsign: {
				type: Boolean,
				default: false
			},
		},
		watch: {
			contractName(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					// 不显示更多是直接搜索
					this.$emit('query', {
						contractName: this.contractName,
						salesmanObj: this.salesmanObj,
						orgObj: this.orgObj,
						orgIdList: this.orgIdList,
						stateObj: this.stateObj,
						startDate: this.startDate,
						endDate: this.endDate,
						applyDate:this.applyDate,
					  esignStatusObj: this.esignStatusObj,
					})

				}, 500);

			}

		},
		data() {
			return {
				selectList: [],
				orgList: [],
				salesmanlist: [],
				stateList: [],
				contractName: '',
				isMore: false,
				salesmanObj: {},
				orgObj: {},
				stateObj: {},
				orgIdList: [],
				picktype: '',
				startDate: '',
				endDate: '',
				applyDate:'',
				customObj: {},
        esignStatusObj:{},
        esignStatuses:[{
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '签署中'
        },
        {
          value: 2,
          label: '已完成'
        },
        {
          value: 3,
          label: '撤销'
        },
        {
          value: 5,
          label: '过期'
        },
        {
          value: 7,
          label: '拒签'
        }]
			}
		},
		created() {
			this.isMore = this.isControlShow
			//设置查询条件-可置空
			uni.$on('business-query-notify', obj => {
				this.contractName = obj.contractName ? obj.contractName : '';
				this.salesmanObj = obj.salesmanObj ? obj.salesmanObj : {};
				this.orgObj = obj.orgObj ? obj.orgObj : {};
				this.stateObj = obj.stateObj ? obj.stateObj : {};
				this.orgIdList = obj.orgIdList ? obj.orgIdList : [];
				this.startDate = obj.startDate ? obj.startDate : '';
				this.endDate = obj.endDate ? obj.endDate : '';
				this.applyDate = obj.applyDate ? obj.applyDate : '';
				this.customObj = obj.customObj ? obj.customObj : [];
			})
			this.getOrgList()
			this.loadOwnerList()
			this.loadStateTypes()
		},
		methods: {
			setContractName(val) {
				this.contractName = val
			},
			setCustomObj(val) {
				this.customObj = val
			},
			showMore() {
				this.isMore = !this.isMore
				this.$emit('setMore', this.isMore)
			},
			//重置
			reset() {
				this.isMore = false
				this.contractName = '';
				this.salesmanObj = {};
        this.esignStatusObj = {}
				this.orgObj = {};
				this.stateObj = {};
				this.customObj = {};
				this.orgIdList = [];
				this.startDate = ""
				this.endDate = ""
				this.applyDate = ""
				this.$emit('reset', {
					contractName: this.contractName,
					salesmanObj: this.salesmanObj,
					orgObj: this.orgObj,
					orgIdList: this.orgIdList,
					stateObj: this.stateObj,
					startDate: this.startDate,
					applyDate: this.applyDate,
					endDate: this.endDate,
					customObj: this.customObj

				})
			},
			//查询
			query() {
				this.isMore = false
				this.$emit('query', {
					contractName: this.contractName,
					salesmanObj: this.salesmanObj,
					orgIdList: this.orgIdList,
					orgObj: this.orgObj,
					stateObj: this.stateObj,
					startDate: this.startDate,
					endDate: this.endDate,
					applyDate: this.applyDate,
					customObj: this.customObj,
					esignStatusObj: this.esignStatusObj,
				})
			},
			//导出
			exportExcel() {
				this.$emit('exportExcel')
			},
			showPick(type) {
				this.picktype = type
				switch (type) {
					case 'applyDate':
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
					case 'custom':
						this.selectList = this.customList
						this.$refs.selector.show();
						break;
          case 'esign':
						this.selectList = this.esignStatuses
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
					case 'applyDate':
						this.applyDate = val.result;
						break;
					case 'startDate':
						this.startDate = val.result;
						break;
					case 'endDate':
						this.endDate = val.result;
						break;
					case 'custom':
						this.customObj = val.checkArr;
						break;
          case 'esign':
						this.esignStatusObj = val.checkArr;
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
			//流程审批状态
			loadStateTypes() {
				this.$network
					.loadUserType('business_state')
					.then(result => {
						this.stateList = result;
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
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
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
		margin: 4px 8px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.query-search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.query-down{
		font-size:$uni-font-size-base;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #222222;
		line-height: 42px;
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
		font-size: $uni-font-size-base;
		color: #E60000;
		border: 1px solid #E60000;
		background: #FFFFFF;
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
	}
	.more-container-top{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: center;
	}
	.select-view-top{
		margin-top: 4px;
		width: 50%;
	}
	.select-view {
		width: 50%;
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
