<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="filter-view">
			<view class="line-container">
				<input v-model="searchKey" class="input-style" :placeholder="warningType.value == 'business_warning' ? '标题/内容/业务单号' : '标题/内容'" />
				<view class="more-css" @click="isShowMore = !isShowMore">更多</view>
			</view>
			<view v-if="isShowMore">
				<view class="line-container">
					<view class="select-view"><selectView :value="childTypeObj.label" hint="类型" @clickSelect="showPick('type')" /></view>
					<view class="select-view"><selectView :value="readTag.label" @clickSelect="showPick('read')" /></view>
					<view class="btn" @click="markRead(ids)" v-if="readTag.value != 'true'">一键已读</view>
				</view>
				<view class="line-container">
					<view class="select-view"><selectView :value="startDate" hint="开始时间" @clickSelect="showPick('startDate')" /></view>
					<view class="select-view"><selectView :value="endDate" hint="结束时间" @clickSelect="showPick('endDate')" /></view>
				</view>
				<view class="line-container" v-if="warningType.value == 'business_warning'">
					<view class="select-view">
						<selectView 
						:value='salesmanDic.label' 
						hint='业务负责人' 
						@clickSelect="showPick('ssn')" 
						/>
					</view>
					<view class="select-view" />
				</view>
				<view class="line-container">
					<view class="clear btn-all" @click="reset">重置</view>
					<view class="confirm btn-all" @click="query">查询</view>
				</view>
			</view>
		</view>
		<view class="list-container">
			<view v-for="(msg, i) in msgList" :key="i">
				<view class="item-container">
					<view class="t-top">
						<view class="num-view">{{ msg.title || '--' }}</view>
					</view>
					<view class="t-middle">
						<view class="item-row">
							<view class="title-view">内容</view>
							<view style="text-align: end;">{{ msg.content || '--' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">消息类型</view>
							<view style="text-align: end;">{{ msg.messageTypeName || '--' }}</view>
						</view>
						<view class="item-row" v-if="msg.data && msg.data.printCode">
							<view class="title-view">自喷吗</view>
							<view>{{ msg.data && msg.data.printCode ? msg.data.printCode : '-' }}</view>
						</view>
						<view class="item-row" v-else-if="msg.messageTypeValue == 18">
							<view class="title-view">业务单号</view>
							<view @click="dealBusiness(msg)" style="color: #E60000;">{{ getNo(msg) }}</view>
						</view>
						<view class="item-row" v-if="showBusinessNo(msg.messageTypeValue)">
							<view class="title-view">业务单号</view>
							<view @click="dealBusiness(msg)" style="color: #E60000;">{{ msg.formKey || '--' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">时间</view>
							<view>{{ msg.createTime ? msg.createTime : '--' }}</view>
						</view>
					</view>
					<view class="t-bottom"><view class="option-view" @click="dealBusiness(msg)">详情</view></view>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="status" /></view>
		</view>
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date" themeColor="#E60000" />
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import selectView from '@/components/common/common-ui/selector-view.vue';

var timer;
export default {
	components: {
		uniLoadMore,
		labelArrow,
		wPicker,
		selectView
	},
	props: {
		childTypeList: {
			type: Array,
			default: function() {
				return [];
			}
		},
		warningType: {
			type: Object,
			default: function() {
				return null;
			}
		}
	},
	data() {
		return {
			page: 1,
			pageSize: 5,
			status: 'more',
			msgList: [],
			selectList: [],
			pickType: '',
			readList: [
				{
					label: '已读',
					value: 'true'
				},
				{
					label: '未读',
					value: 'false'
				}
			],
			readTag: {
				label: '未读',
				value: 'false'
			},
			searchKey: '',
			ids: [],
			childTypeObj: {},
			isShowMore: false,
			startDate: '',
			endDate: '',
			salesmanDic: {
				value: '',
				label: '业务负责人'
			},
			salesmanArr: []
		};
	},
	watch: {
		searchKey: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.refreshheader();
				}, 500);
			}
		}
	},
	created() {
		if(this.warningType.value === 'business_warning'){
			this.loadOwnerList();
		}
	},
	mounted() {
		this.loadMsgList();
	},
	methods: {
		getNo(item){
			let noticeJsonDict = item.noticeJson ? JSON.parse(item.noticeJson) : {};
			if(noticeJsonDict.businessNo){
				return noticeJsonDict.businessNo
			}
			return "--"
		},
		reset() {
			this.searchKey = '';
			this.childTypeObj = {};
			this.startDate = '';
			this.endDate = '';
			this.readTag = {
				label: '未读',
				value: 'false'
			};
			this.salesmanDic = {
				value:"",
				label: '业务负责人',
			}
			
			this.refreshheader();
		},
		query() {
			this.isShowMore = false;
			this.refreshheader();
		},
		getTagName(processName) {
			if (processName && processName.indexOf('[')) {
				return processName.substring(0, processName.indexOf('['));
			}
			return '';
		},
		loadMsgList() {
			this.status = 'loading';
			let param = {
				current: this.page,
				size: this.pageSize,
				read: this.readTag.value,
				warningType: this.warningType && this.warningType.value ? this.warningType.value : undefined,
				messageTypeValue: this.childTypeObj && this.childTypeObj.value ? this.childTypeObj.value : undefined,
				beginDate: this.startDate ? (this.startDate + ' 00:00:00') : undefined,
				endDate: this.endDate ? (this.endDate + ' 23:59:59') : undefined,
				customerSalesman: this.salesmanDic.value == "" ? undefined : this.salesmanDic.value
			};
			if (this.searchKey) {
				param = {
					...param,
					fuzzyParam: this.searchKey
				};
			}
			this.$network
				.getData(this.$url.READ_LIST, 'POST', param)
				.then(result => {
					let idList = result.records
						? result.records.filter(o => {
								return !o.read;
						  })
						: [];

					this.ids = this.ids.concat(
						idList.length > 0
							? idList.map(o => {
									return o.id;
							  })
							: []
					);
					this.msgList = this.msgList.concat(result.records);
					let pages = result.pages;
					if (pages <= this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				});
		},
		dealBusiness(data) {
			this.gotodetal(data);
			if (!data.read) {
				//未读标记成已读
				this.markRead([data.id]);
			}
		},
		markRead(ids) {
			if (ids.length === 0) {
				return;
			}
			let param = {
				ids: ids
			};
			this.$network
				.getData(this.$url.MARK_READ, 'PUT', param)
				.then(result => {
					uni.$emit('refresh-tab');
					this.refreshheader();
				})
				.catch(err => {});
		},
		loadOwnerList() {
			let param = {
				showAdmin: false,
				roleType: this.$savekey.USER_ROLE_BUSINESS
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.salesmanArr = [];
					this.salesmanArr.push({
						label: '全部',
						value: ''
					});
					this.salesmanArr = this.salesmanArr.concat(
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
		},
		showBusinessNo(messageTypeValue){
			return messageTypeValue=='4'|| messageTypeValue=='6'|| messageTypeValue == '13' || messageTypeValue == '15'||messageTypeValue == '14'?true:false
		},
		gotodetal(data) {
			console.log(data,'gotodetal');
			let item = data.data||{};
			item.licenseId=item.licenseId?item.licenseId:item.serial_no?item.serial_no:item.id?item.id:'';
			// 业务类通知
			if (data.messageTypeValue == '4') {
				//合同到期提醒
				switch (data.contentType) {
					case 'workIn':
						uni.navigateTo({
							url: '/businessPages/workin/workin-detail?businessNo=' + item.businessNo
						});
						break;
					case 'invoice':
						uni.navigateTo({
							url: '/businessPages/invoice/invoice-detail?businessNo=' + item.businessNo
						});
						break;
					case 'proceeds':
						uni.navigateTo({
							url: '/businessPages/proceed/porceeds-detail?businessNo=' + item.businessNo
						});
						break;
					case 'refund':
						uni.navigateTo({
							url: '/businessPages/reimburse/reimburse-detail?businessNo=' + item.businessNo
						});
						break;
					case 'claim':
						uni.navigateTo({
							url: '/businessPages/claim/claim-detail?businessNo=' + item.businessNo
						});
						break;
					case 'contract':
						uni.navigateTo({
							url: '/contractPages/contract/contract-detail?businessNo=' + data.formKey
						});
						break;
					case 'workOut':
						uni.navigateTo({
							url: '/businessPages/workout/workout-detail?businessNo=' + item.businessNo
						});
						break;
					case 'pause':
						uni.navigateTo({
							url: '/businessPages/pause/pause-detail?id=' + item.businessNo
						});
						break;
				
					case 'contractChange':
						uni.navigateTo({
							// url: '/contractPages/contract-change/contract-change-detail?businessNo=' + item.businessNo
							url: '/contractPages/contract-change/contract-change-detail?id=' + item.tableId
						});
						break;
					case 'contractPlus':
						uni.navigateTo({
							url: '/contractPages/contract-expense/contract-expense-detail?businessKey=' + item.businessKey
						});
						break;
					case 'repair':
						uni.navigateTo({
							url: '/devicePages/repair/repair-detail?item=' + encodeURIComponent(JSON.stringify(item))
						});
						break;
					case 'maintenance':
						uni.navigateTo({
							url: '/devicePages/maintain/maintain-detail?businessNo=' + item.businessNo
						});
						break;
					case 'checkRepair':
						uni.navigateTo({
							url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(item))
						});
						break;
					case 'settlement':
						uni.navigateTo({
							url: '/businessPages/settledown/settle-detail?businessNo=' + item.businessNo
						});
						break;
					case 'statement':
						uni.navigateTo({
							url: '/businessPages/settledown/settle-dz-detail?businessNo=' + item.businessNo
						});
						break;
					case 'settle':
						uni.navigateTo({
							url: '/businessPages/settledown/settle-finish-detail-show?item=' + encodeURIComponent(JSON.stringify(item))
						});
						break;
					case 'insurance':
						uni.navigateTo({
							url: '/devicePages/insurance/insurance-detail?businessNo=' + item.businessNo
						});
						break;
					case 'contractDiscounts':
						uni.navigateTo({
							url: '/businessPages/discounts/discounts-detail?businessNo=' + item.businessNo
						});
						break;
					default:
						uni.showToast({
							icon: 'none',
							title: '该功能未在APP开放，请去PC端查看'
						});
						break;
				}
			} else if (data.messageTypeValue == '3') {
				//设备离线
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + item.licenseId
				});
			} else if (data.messageTypeValue == '1') {
				//故障信息
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + item.licenseId + '&tabIndex=2'
				});
			} else if (data.messageTypeValue == '2') {
				//超出围栏
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + data.formKey
				});
			} else if (data.messageTypeValue == '9') {
				//设备保养
				uni.navigateTo({
					url: '/devicePages/maintain/maintain-record-list?licenseId=' + data.formKey
				});
			} else if (data.messageTypeValue == '6') {
				//合同逾期（首日）
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + data.formKey
				});
			} else if (data.messageTypeValue == '7') {
				//异常工作
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + data.formKey
				});
			} else if (data.messageTypeValue == '10') {
				//未充满
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + data.formKey
				});
			} else if (data.messageTypeValue == '11') {
				//未充电
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + data.formKey + '&tabIndex=1'
				});
			} else if (data.messageTypeValue == '12') {
				//低电量提醒
				uni.navigateTo({
					url: '/devicePages/monitor/device-monitor-detail?licenseId=' + data.formKey
				});
			} else if (data.messageTypeValue == '13' || data.messageTypeValue == '15') {
				//合同未归档|合同结算提醒
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + data.formKey
				});
			}else if (data.messageTypeValue == '14') {
				//报停超过30天
				uni.navigateTo({
					url: '/businessPages/pause/pause-detail?id=' + data.formKey
				});
			}else if (data.messageTypeValue == '17') {
				// //电池巡检
				uni.navigateTo({
					url:'/devicePages/battery-polling/battery-polling-all'
				})
			}else if (data.messageTypeValue == '18') {
				//签署详情
				let noticeJsonDict = data.noticeJson ? JSON.parse(data.noticeJson) : {};
				uni.navigateTo({
					url: '/otherPages/esign/esign-flow-detail?businessType=' + noticeJsonDict.businessType + '&flowId=' + noticeJsonDict.flowId + '&docId=' + noticeJsonDict.docId
				})
			} else if(data.messageTypeValue == '19'){
			//报告详情
				let formKey=data.formKey;
				uni.navigateTo({
					url:'/businessPages/useReport/use-report-detail?reportNo='+formKey
				});
			}else if(data.messageTypeValue=='22'){
			//报告详情
				let formKey=data.formKey;
				uni.navigateTo({
					url:'/devicePages/report/report'
				});
			}
			else {
				//默认
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + data.formKey
				});
			}
		},
		showPick(type) {
			this.pickType = type;
			console.log('showPick' + this.pickType);
			switch (this.pickType) {
				case 'startDate':
				case 'endDate':
					this.$refs.date.show();
					break;
				case 'read':
					this.selectList = this.readList;
					this.$refs.selector.show();
					break;
				case 'type':
					this.selectList = this.childTypeList ? [...this.childTypeList] : [];
					this.$refs.selector.show();
					break;
				case 'ssn':
					this.selectList = this.salesmanArr;
					this.$refs.selector.show();
					break;
				default:
					break;
			}
		},
		onConfirm(val) {
			console.log('onConfirm' + this.pickType + val);
			switch (this.pickType) {
				case 'read':
					this.readTag = val.checkArr;
					break;
				case 'type':
					this.childTypeObj = val.checkArr;
					break;
				case 'startDate':
					this.startDate = val.result;
					break;
				case 'endDate':
					this.endDate = val.result;
					break;
				case 'ssn':
					this.salesmanDic = val.checkArr;
					break;
				default:
					break;
			}
		},
		initData() {
			this.childTypeObj = {};
			this.searchKey = '';
			this.readTag = {
				label: '未读',
				value: 'false'
			};
			this.salesmanDic = {
				value:"",
				label: '业务负责人',
			}
		},
		refreshheader() {
			this.page = 1;
			this.msgList = [];
			this.ids = [];
			this.loadMsgList();
		},
		refreshhfooter() {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.loadMsgList();
			this.morestatus = 'loading';
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	background-color: $uni-bg-color-grey;
	position: relative;
}

.filter-view {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	padding: 4px 8px;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 48px;
	left: 0px;
	width: calc(100% - 16px);
}

.line-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	margin-top: 4px;
	flex: 1;
}

.select-view {
	flex: 1;
}

.input-style {
	background-color: #F7F7F7;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 35px;
	flex: 1;
	line-height: 35px;
	padding: 0px 8px;
	margin-right: 8px;
	margin-left: 4px;
}

.btn {
	color: #ffffff;
	background-color: $uni-color-primary;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 30px;
	width: 60px;
	margin-right: 4px;
	line-height: 30px;
	text-align: center;
}

.more-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	background: #ffffff;
	margin-right: 4px;
	border: 1px solid #999999;
	border-radius: 4px;
	font-size: $uni-font-size-base;
	color: #999999;
}

.condition-btn {
	display: flex;
	margin-top: 10px;
	flex-direction: row;
	justify-content: space-between;
	background: #ffffff;
}

.btn-all {
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

.clear {
	background-color: $uni-border-color;
}

.confirm {
	background-color: $uni-color-primary;
}

.list-container {
	margin-top: 108px;
	padding-bottom:env(safe-area-inset-bottom);
}

.item-container {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	border-radius: 4px;
	margin: 8px;
	padding: 8px;
}

.t-top {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	padding-bottom: 8px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
}

.num-view {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
}

.state-view {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.t-middle {
	display: flex;
	flex-direction: column;
	margin: 8px 0px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
}

.item-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-bottom: 8px;
}

.title-view {
	width: 70px;
	min-width: 70px;
}

.t-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.option-view {
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
</style>
