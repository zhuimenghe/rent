<template>
	<view class="query-content">
		<view class="query-top-container">
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo"></i>
				<view class="query-search-content">
					<input 
					style="flex: 1;font-size: 14px;color: #333333;" 
					:placeholder="hint" 
					placeholder-class="placeholder-style" 
					v-model="searchKey" 
					/>
				</view>
			</view>
			<view class="query-export-css" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
			<view class="query-more-css" @click="showMore" v-if="isControlMore">
				<text>筛选</text>
			</view>
		</view>
		<view v-if="isMore" style="margin-top: 4px;border-top: 1px solid #efefef;">
			<view class="more-container-row">
				<view :class="(type == 'jx' ? false : (isQueryRepair ? true : false)) ? 'select-view' : 'select-view-three'" v-if="isSSN">
					<selectView :value="salesmanObj.label" :hint="hintSSN" @clickSelect="showPick('salesman')" />
				</view>
				<view :class="(type == 'jx' ? false : (isQueryRepair ? true : false)) ? 'select-view' : 'select-view-three'" v-if="isQueryOrg">
					<selectView :value="orgObj.label" hint="区域" @clickSelect="showPick('org')" />
				</view>
				<view :class="(type == 'jx' ? false : (isQueryRepair ? true : false)) ? 'select-view' : 'select-view-three'" v-if="isQueryRepair">
					<selectView :value="taskStateObj.label" :hint="hintState" @clickSelect="showPick('task')" />
				</view>
				<view :class="(type == 'by' ? false : (isQueryRepair ? true : false)) ? 'select-view' : 'select-view-three'" v-if="isQueryState">
					<selectView :value="stateObj.label" hint="审批状态" @clickSelect="showPick('state')" />
				</view>
				<view class="select-view" v-if="isQueryCheck">
					<selectView :value="checkObj.label" hint="检修类型" @clickSelect="showPick('check')" />
				</view>
			</view> 
			<view class="title-time" v-if="isQueryCreate">{{titleName}}</view>
			<view class="more-container" v-if="isQueryTime">
				<view class="select-view">
					<selectView :value="startDate" hint="开始时间" @clickSelect="showPick('startDate')" />
				</view>
				<view class="select-view">
					<selectView :value="endDate" hint="结束时间" @clickSelect="showPick('endDate')" />
				</view>
			</view>
			<view class="title-time" v-if="isQueryCreate">单据创建时间</view>
			<view class="more-container" v-if="isQueryCreate">
				<view class="select-view">
					<selectView :value="createStartDate" hint="开始时间" @clickSelect="showPick('createstartDate')" />
				</view>
				<view class="select-view">
					<selectView :value="createEndDate" hint="结束时间" @clickSelect="showPick('createendDate')" />
				</view>
			</view>
			<view class="query-condition-btn">
				<view class="query-clear query-btn-all" @click="reset">重置</view>
				<view class="query-confirm query-btn-all" @click="query">查询</view>
			</view>
		</view>
		<w-picker 
		:selectList="QueryselectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="queryselector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="false" 
		ref="querydate" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import selectView from '@/components/common/common-ui/selector-view.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
var timer;
export default {
	components: {
		selectView,
		wPicker
	},
	props: {
		hint: {
			type: String,
			default: '自喷码/车号'
		},
		type: {
			type: String,
			default: "wx"
		},
		keyword:{
			type: String,
			default: ""
		},
		isControlMore: {
			type: Boolean,
			default: false
		},
		isExportList: {
			type: Boolean,
			default: false
		},
		isSSN:{
			type: Boolean,
			default: true
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
		isQueryCreate: {
			type: Boolean,
			default: false
		},
		isQueryCheck:{
			type: Boolean,
			default: false
		},
		isQueryRepair:{
			type: Boolean,
			default: false
		}
	},
	watch: {
		searchKey(val) {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				this.postData();
			}, 500);
		}
	},
	data() {
		return {
			hintSSN:"维修人",
			hintState:"维修状态",
			titleName:"维修时间",
			
			QueryselectList: [],
			orgList: [],
			salesmanlist: [],
			stateList: [],
			taskStateList: [],
			checkList:[],
			isMore: false,
			
			searchKey: '',
			salesmanObj: {},
			orgObj: {},
			stateObj: {},
			taskStateObj: {},
			checkObj:{},
			startDate: '',
			endDate: '',
			createStartDate:"",
			createEndDate:"",
			orgIdList: [],
			picktype: '',
		};
	},
	created() {
		//设置查询条件-可置空
		this.searchKey = this.keyword;		
		this.startDate =  this.$dateUtil.getFirstDayOfYear(new Date());
		this.endDate = this.$dateUtil.timeFormat(new Date());
		
		if(this.type == "wx"){
			this.hintSSN = "维修人"
			this.titleName = "维修时间";
			this.hintState = "维修状态";
			let list = [{value:'维修中',label:'维修中'},{value:'维修完成',label:'维修完成'}]
			this.taskStateList = [...list];
		}
		if(this.type == "by"){
			this.hintSSN = "保养人"
			this.titleName = "保养时间";
		}
		if(this.type == "jx"){
			this.hintSSN = "检修人"
			this.titleName = "检修时间";
			this.hintState = "检修状态";
			this.loadCheckStateTypes();
			let listS = [{value:true,label:'检修正常'},{value:false,label:'检修异常'}]
			this.taskStateList = [...listS];
		}
		if(this.type == "xj" || this.type == "dcxj"){
			this.hintSSN = "巡检人"
			this.titleName = "巡检时间";
			this.hintState = "巡检状态";
			let list = [{value:true,label:'巡检正常'},{value:false,label:'巡检异常'}]
			this.taskStateList = [...list];
		}
		this.loadOwnerList();
		this.getOrgList();
		this.loadStateTypes();
	},
	methods: {
		showMore() {
			this.isMore = !this.isMore;
		},
		//重置
		reset() {
			this.isMore = false;
			this.searchKey = '';
			this.salesmanObj = {};
			this.orgObj = {};
			this.stateObj = {};
			this.taskStateObj = {};
			this.checkObj = {};
			this.orgIdList = [];
			this.startDate =  this.$dateUtil.getFirstDayOfYear(new Date());
			this.endDate = this.$dateUtil.timeFormat(new Date());
			this.createStartDate = '';
			this.createEndDate = '';
			this.postData()
		},
		//查询
		query() {
			this.postData()
		},
		postData(){
			if(this.createStartDate != "" && this.createEndDate==""){
				uni.showToast({
					icon:"none",
					title:"请选择单据创建结束时间"
				})
				return;
			}
			if(this.createStartDate == "" && this.createEndDate!=""){
				uni.showToast({
					icon:"none",
					title:"请选择单据创建开始时间"
				})
				return;
			}
			if(this.startDate != "" && this.endDate!=""){
				let start = this.startDate + " 00:00:00"
				let end = this.endDate + " 23:00:00"
				if (this.$datestr.timedifferent(end, start) == -1) {
					uni.showToast({
						icon: 'none',
						title: '开始时间不得晚于结束时间'
					});
					return;
				}
			}
			if(this.createStartDate != "" && this.createEndDate!=""){
				let start = this.createStartDate + " 00:00:00"
				let end = this.createEndDate + " 23:00:00"
				if (this.$datestr.timedifferent(end, start) == -1) {
					uni.showToast({
						icon: 'none',
						title: '单据创建开始时间不得晚于结束时间'
					});
					return;
				}
			}
			this.isMore = false;
			this.$emit('query', {
				searchKey: this.searchKey,
				salesmanValue: this.salesmanObj.value,
				orgValue: this.orgObj.value,
				orgIdList: this.orgIdList.length > 0 ? this.orgIdList : undefined,
				stateValue: this.stateObj.value,
				startDate: this.startDate != "" ? (this.startDate+" 00:00:00"): undefined,
				endDate: this.endDate != "" ? (this.endDate+" 23:59:59") : undefined,
				createStartDate: this.createStartDate != "" ? (this.createStartDate+" 00:00:00") : undefined,
				createEndDate: this.createEndDate != "" ? (this.createEndDate+" 23:59:59") : undefined,
				taskState: this.taskStateObj.value,
				checkState:this.checkObj.value,
			});
		},
		//导出
		exportExcel() {
			this.$emit('exportExcel');
		},
		showPick(type) {
			this.picktype = type;
			switch (type) {
				case 'startDate':
				case 'endDate':
				case 'createstartDate':
				case 'createendDate':
					this.$refs.querydate.show();
					break;
				case 'salesman':
					this.QueryselectList = this.salesmanlist;
					this.$refs.queryselector.show();
					break;
				case 'org':
					this.QueryselectList = this.orgList;
					this.$refs.queryselector.show();
					break;
				case 'state':
					this.QueryselectList = this.stateList;
					this.$refs.queryselector.show();
					break;
				case 'task':
					this.QueryselectList = this.taskStateList;
					this.$refs.queryselector.show();
					break;
				case 'check':
					this.QueryselectList = this.checkList;
					this.$refs.queryselector.show();
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
					this.orgIdList = [val.checkArr.value];
					break;
				case 'state':
					this.stateObj = val.checkArr;
					break;
				case 'task':
					this.taskStateObj = val.checkArr;
					break;
				case 'check':
					this.checkObj = val.checkArr;
					break;
				case 'startDate':
					this.startDate = val.result;
					break;
				case 'endDate':
					this.endDate = val.result;
					break;
				case 'createstartDate':
					this.createStartDate = val.result;
					break;
				case 'createendDate':
					this.createEndDate = val.result;
					break;
				default:
					break;
			}
		},
		//区域
		getOrgList() {
			let _self = this;
			this.$network.getData(this.$url.ORG_ALL, 'GET').then(result => {
				if (result && result.length > 0) {
					result.forEach(function dep(o) {
						_self.orgList = [..._self.orgList,{
							value: o.id,
							label: o.name,
							children: o.children
						}];
						if (o.children && o.children.length > 0) o.children.map(dep);
					});
				}
			}).catch(err => {});
		},
		//加载负责人
		loadOwnerList() {
			let  requesttype = "repair";
			switch (this.type){
				case "wx":
					requesttype = "repair"
					break;
				case "by":
					requesttype = "maintenance"
					break;
				case "xj":
					requesttype = "inspection"
					break;
				case "jx":
					requesttype = "checkRepair"
					break;
				case "dcxj":
					requesttype = "batteryPatrol"
					break;
				default:
					break;
			}
			let url = this.$url.DEVICE_USERS_LIST + requesttype;
			this.$network.getData(url, 'GET', null).then(result => {
				let list = result ? result : [];
				this.salesmanlist = list.map(dict => {
					return {
						label: dict.username,
						value: dict.userId
					};
				})
			}).catch(err => {});
		},
		//流程审批状态
		loadStateTypes() {
			// this.$network.loadUserType('business_state').then(result => {
			// 	this.stateList = [...result];
			// }).catch(err => {});
			this.stateList = [{"value":"4","label":"已完成"},
			{"value":"1","label":"审批中"},
			{"value":"0","label":"草稿"}]
		},
		//检修状态
		loadCheckStateTypes() {
			this.checkList = [{"value":"1","label":"入库检修"},
			{"value":"2","label":"出库检修"}];
			// this.$network.loadUserType('storage_leased_type').then(result => {
			// 	this.checkList = [...result];
			// }).catch(err => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.query-content {
	background-color: #ffffff;
	padding: 4px 8px;
	display: flex;
	flex-direction: column;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	z-index: 200;
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
.title-time{
	padding: 5px 10px;
	font-size: $uni-font-size-base;
	color: #222831;
}
.more-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 4px;
}
.more-container-row{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: 4px;
}
.select-view-three{
	margin-bottom: 5px;
	width: 33%;
}
.select-view {
	margin-bottom: 5px;
	width: 50%;
}

.query-condition-btn {
	display: flex;
	margin-top: 10px;
	flex-direction: row;
	justify-content: space-between;
	background: #ffffff;
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
