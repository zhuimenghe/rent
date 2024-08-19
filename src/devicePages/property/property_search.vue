<template>
	<view class="query-content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="query-top-container">
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo"></i>
				<view class="query-search-content">
					<input 
					style="flex: 1;font-size: 14px;color: #333333;" 
					:placeholder="hint" 
					v-model="searchKey" 
					/>
				</view>
			</view>
			<view class="query-export-css" @click="exportExcel" v-if="isExportList"><text>导出</text></view>
			<view class="query-more-css" @click="showMore"  v-if="isControlMore"><text>更多</text></view>
		</view>
		<view v-if="isControlMore && isMore" style="margin-top: 4px;border-top: 1px solid #EFEFEF;border-bottom: 1px solid #EFEFEF;padding-bottom: 5px;">
			<view class="more-container" v-if="isQueryTime">
				<view class="select-view">
					<selectView :value="startDate" hint="开始时间" @clickSelect="showPick('startDate')" />
				</view>
				<view class="select-view">
					<selectView :value="endDate" hint="结束时间" @clickSelect="showPick('endDate')" />
				</view>
			</view>
			<view class="more-container">
				<view class="select-view" v-if="isQuerySsn">
					<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
				</view>
				<view class="select-view" v-if="isQueryOrg">
					<selectView :value="orgObj.label" hint="区域" @clickSelect="showPick('org')" />
				</view>
			</view>
			<view class="query-condition-btn">
				<view class="query-clear query-btn-all" @click="reset">重置</view>
				<view class="query-confirm query-btn-all" @click="query">查询</view>
			</view>
		</view>
		<w-picker 
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="true" 
		ref="date" 
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
			default: '车号/自喷码'
		},
		//是否外部控制显示更多
		isControlMore: {
			type: Boolean,
			default: false
		},
		isExportList: {
			type: Boolean,
			default: false
		},
		isQuerySsn: {
			type: Boolean,
			default: true
		},
		isQueryOrg: {
			type: Boolean,
			default: true
		},
		isQueryTime: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		searchKey(val) {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				// 不显示更多是直接搜索
				this.$emit('query', {
					searchKey: this.searchKey,
					salesmanObj: this.salesmanObj,
					orgObj: this.orgObj,
					orgIdList: this.orgIdList,
					stateObj: this.stateObj,
					startDate: this.startDate,
					endDate: this.endDate
				});
			}, 500);
		}
	},
	data() {
		return {
			selectList: [],
			orgList: [],
			salesmanlist: [],
			stateList: [],
			searchKey: '',
			isMore: false,
			salesmanObj: {},
			orgObj: {},
			stateObj: {},
			orgIdList: [],
			picktype: '',
			startDate: '',
			endDate: ''
		};
	},
	created() {
		this.getOrgList();
		this.loadOwnerList();
	},
	methods: {
		setSearchKey(val) {
			this.searchKey = val;
		},
		showMore() {
			this.isMore = !this.isMore;
		},
		//重置
		reset() {
			this.searchKey = '';
			this.salesmanObj = {};
			this.orgObj = {};
			this.orgIdList = [];
			this.startDate = '';
			this.endDate = '';

			this.$emit('reset', {
				searchKey: this.searchKey,
				salesmanObj: this.salesmanObj,
				orgObj: this.orgObj,
				orgIdList: this.orgIdList,
				startDate: this.startDate,
				endDate: this.endDate
			});
		},
		//查询
		query() {
			this.isMore = false;
			this.$emit('query', {
				searchKey: this.searchKey,
				salesmanObj: this.salesmanObj,
				orgObj: this.orgObj,
				orgIdList: this.orgIdList,
				startDate: this.startDate,
				endDate: this.endDate
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
					this.$refs.date.show();
					break;
				case 'salesman':
					this.selectList = this.salesmanlist;
					this.$refs.selector.show();
					break;
				case 'org':
					this.selectList = this.orgList;
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
					this.orgIdList = [val.checkArr.value];
					break;
				case 'startDate':
					this.startDate = val.result;
					break;
				case 'endDate':
					this.endDate = val.result;
					break;
				default:
					break;
			}
		},
		//区域
		getOrgList() {
			let _self = this;
			this.$network
				.getData(this.$url.ORG_ALL, 'GET')
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
						result
							? result.map(dict => {
									return {
										label: dict.username,
										value: dict.id
									};
							  })
							: []
					);
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.query-content {
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	width: 100%;
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
	background-color: #F7F7F7;
	flex: 1;
	display: flex;
	margin: 4px 8px;
	flex-direction: row;
	padding:5px 0px 5px 16px;
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
	padding:5px 8px;
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
	padding:5px 8px;
	background: #ffffff;
	border: 1px solid #999999;
	border-radius: 4px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
	color: #999999;
}

.more-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 4px;
	flex: 1;
}

.select-view {
	width: 50%;
}

.query-condition-btn {
	display: flex;
	margin-top: 5px;
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
	padding: 5px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
}
</style>
