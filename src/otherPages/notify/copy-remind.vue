<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="list-container">
			<view v-for="(msg, i) in msgList" :key="i">
				<view class="item-container">
					<view class="t-top">
						<view class="num-view">{{ msg.title }}</view>
						<view class="state-view">{{ msg.data.stateName || '-' }}</view>
					</view>
					<view class="t-middle">
						<view class="item-row">
							<view class="title-view">内容</view>
							<view style="text-align: end;">{{ msg.content || '--' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">审批进度</view>
							<view>{{ msg.data.taskName || '-' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">接收时间</view>
							<view>{{ msg.createTime || '-' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">申请人</view>
							<view>{{ msg.createByName ? msg.createByName : '--' }}</view>
						</view>
						<view class="item-row">
							<view class="title-view">业务单号</view>
							<view style="color: #E60000;" @click="dealBusiness(msg)">{{ msg.data.businessNo || '-' }}</view>
						</view>
					</view>

					<view class="t-bottom"><view class="option-view" @click="dealBusiness(msg)">详情</view></view>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="status" /></view>
		</view>
		<!-- <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" /> -->
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
	data() {
		return {
			page: 1,
			pageSize: 10,
			status: 'more',
			msgList: [],
			selectList: [],
			pickType: '',
			noticeType: {
				label: '抄送',
				value: '1'
			},
			noticeTypes: [
				{
					label: '抄送',
					value: '1'
				},
				{
					label: '提醒',
					value: '3'
				}
			],
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
			ids: []
		};
	},
	created() {
		// this.loadMsgList();
	},
	methods: {
		getTagName(processName) {
			if (processName && processName.indexOf('[')) {
				return processName.substring(0, processName.indexOf('['));
			}
			return '';
		},
		loadMsgList(processKey, nodeName, readTag, state, fuzzyParam, startDate, endDate) {
			this.status = 'loading';
			let param = {
				current: this.page,
				size: this.pageSize,
				read: readTag,
				noticeType: '1'
			};
			if (processKey) {
				param = {
					...param,
					processKey: processKey
				};
			}
			if (nodeName) {
				param = {
					...param,
					name: nodeName
				};
			}
			if (fuzzyParam) {
				param = {
					...param,
					fuzzyParam: fuzzyParam
				};
			}
			if (state) {
				param = {
					...param,
					state: state
				};
			}
			if (startDate) {
				param = {
					...param,
					beginDate: startDate + ' 00:00:00'
				};
			}
			if (endDate) {
				param = {
					...param,
					endDate: endDate + ' 23:59:59'
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
		markAllRead() {
			this.markRead(this.ids);
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
					uni.$emit('refresh-notification-list');
					// this.refreshheader();
				})
				.catch(err => {});
		},
		gotodetal(data) {
			let item = data.data;
			switch (data.contentType) {
				case 'commonApprove':
					uni.navigateTo({
						url: '/businessPages/workflow/common-approve-detail?key=' + item.businessNo
					});
					break;
				case 'workIn':
					uni.navigateTo({
						url: '/businessPages/workin/workin-detail?businessNo=' + item.businessNo
					});
					break;
				case 'expressWorkIn':
					uni.navigateTo({
						url: '/businessPages/workin/workin-simple-detail?businessNo=' + item.businessNo
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
				case 'serviceClaim':
					uni.navigateTo({
						url: '/businessPages/claim/claim-detail?businessNo=' + item.businessNo
					});
					break;
				case 'contract':
					uni.navigateTo({
						url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
					});
					break;
				case 'expressContract':
					uni.navigateTo({
						url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
					});
					break;
				case 'workOut':
					uni.navigateTo({
						url: '/businessPages/workout/workout-detail?businessNo=' + item.businessNo
					});
					break;
				case 'expressWorkOut':
					uni.navigateTo({
						url: '/businessPages/workout/workout-detail-simple?businessNo=' + item.businessNo
					});
					break;
				case 'pause':
					uni.navigateTo({
						url: '/businessPages/pause/pause-detail?id=' + item.businessNo
					});
					break;
				case 'servicePause':
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
					let businessNostr = item.businessNo;
					let url = '/businessPages/settledown/settle-detail?businessNo=' + businessNostr;
					uni.navigateTo({
						url: url
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
				case 'purchase':
					uni.navigateTo({
						url: '/devicePages/purchase/purchase-detail?businessNo=' + item.businessNo
					});
					break;
				case 'partsStorage':
					uni.navigateTo({
						url: '/subOtherPages/accessories/acc-storagein/acc-storagein-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'partsCollar':
					uni.navigateTo({
						url: '/subOtherPages/accessories/acc-receive/acc-recelive-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'partsReturn':
					uni.navigateTo({
						url: '/subOtherPages/accessories/acc-back/acc-back-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'partsAllocation':
					uni.navigateTo({
						url: '/subOtherPages/accessories/acc-allot/acc-allot-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'partsUnitPrice':
					uni.navigateTo({
						url: '/subOtherPages/accessories/acc-inventory/adjust-price-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'sublet':
					uni.navigateTo({
						url: '/otherPages/sublet/sublet-apply/sublet-apply-detail?businessNo=' + item.businessNo
					});
					break;
				case 'workInOut':
					uni.navigateTo({
						url: '/businessPages/additional-recording/add-record-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'insurance':
					uni.navigateTo({
						url: '/devicePages/insurance/insurance-detail?businessNo=' + item.businessNo
					});
					break;
				case 'settlementApply':
					this.loadSettlementApplyData(item.businessNo);
					break;
				case 'inspection':
					uni.navigateTo({
						url: '/devicePages/polling/polling-detail?businessNo=' + item.businessNo
					});
					break;
				case 'contractDiscounts':
					uni.navigateTo({
						url: '/businessPages/discounts/discounts-detail?businessNo=' + item.businessNo
					});
					break;
				case 'batteryPatrol':
					uni.navigateTo({
						url: '/devicePages/battery-polling/battery-polling-detail?businessNo=' + item.businessNo
					});
					break;
				case 'allocation':
					uni.navigateTo({
						url: '/devicePages/allot/allot-detail?businessNo=' + item.businessNo
					});
					break;
				default:
					uni.showToast({
						icon: 'none',
						title: '该功能未在APP开放，请去PC端查看'
					});
					break;
			}
		},
		// showPick(type) {
		// 	this.pickType = type;
		// 	console.log("showPick" + this.pickType)
		// 	switch (this.pickType) {
		// 		case 'notice':
		// 			this.selectList = this.noticeTypes
		// 			break;
		// 		case 'read':
		// 			this.selectList = this.readList
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	this.$refs.selector.show();
		// },
		// onConfirm(val) {
		// 	console.log("onConfirm" + this.pickType + val)
		// 	switch (this.pickType) {
		// 		case 'notice':
		// 			this.noticeType = val.checkArr
		// 			break;
		// 		case 'read':
		// 			this.readTag = val.checkArr
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	this.refreshheader()

		// },
		refreshheader(processKey, nodeName, readTag, state, fuzzyParam, startDate, endDate) {
			this.page = 1;
			this.msgList = [];
			this.ids = [];
			this.loadMsgList(processKey, nodeName, readTag, state, fuzzyParam, startDate, endDate);
		},
		refreshhfooter(processKey, nodeName, readTag, state, fuzzyParam, startDate, endDate) {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.loadMsgList(processKey, nodeName, readTag, state, fuzzyParam, startDate, endDate);
			this.morestatus = 'loading';
		},
		loadSettlementApplyData(key) {
			let param = {
				businessNo: key
			};
			this.$network.getData(this.$url.APPLY_DATEIL, 'GET', param).then(result => {
				console.log(result.dimensionType);
				if (result.dimensionType == '1') {
					//客户维度
					uni.navigateTo({
						url: '/businessPages/settle-apply/customer/application-customer-detail?businessNo=' + key
					});
				} else {
					uni.navigateTo({
						url: '/businessPages/settle-apply/contract/application-contract-detail?businessNo=' + key
					});
				}
			}).catch(err => {});
		},
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	background-color: $uni-bg-color-grey;
	position: relative;
}

.input-style {
	background-color: #F7F7F7;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 30px;
	flex: 1;
	line-height: 30px;
	padding: 2px 8px;
}

.btn {
	color: #ffffff;
	background-color: $uni-color-primary;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 24px;
	width: 60px;
	line-height: 24px;
	text-align: center;
	margin-right: 16px;
	margin-left: 8px;
}

.list-container {
	margin-top: 8px;
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
	justify-content: space-between;
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
	display: flex;
	flex-direction: row;
	align-items: center;
}

.state-view {
	min-width: 64px;
	text-align: end;
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
