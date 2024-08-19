<template>
	<view class="execute-info-content">
		<!--合同营收-->
		<view class="earning container">
			<view class="tag">{{ earningInfo.tag }}</view>
			<view class="info-content">
				<view class="earning-item">
					<view class="e-item-title">营收【含运费】<text class="e-item-sub-title">(履约/已收)</text></view>
					<view class="e-item-value">
						￥{{ earningInfo.content.revenuePerform }}/￥{{ earningInfo.content.revenueReceived }}
					</view>
				</view>
				<view class="earning-item">
					<view class="e-item-title">押金<text class="e-item-sub-title">(约定/已收)</text>
					</view>
					<view class="e-item-value">
						￥{{ earningInfo.content.pledgeAppoint }}/￥{{ earningInfo.content.pledgeReceived }}
					</view>
				</view>

				<view class="earning-item">
					<view class="e-item-title">运费<text class="e-item-sub-title">(履约/已收)</text></view>
					<view class="e-item-value">
						￥{{ earningInfo.content.carriagePerform }}/￥{{ earningInfo.content.carriageReceived }}
					</view>
				</view>
			</view>
		</view>

		<!--执行记录-->
		<view class="record">
			<view class="tag">{{ recordInfo.tag }}</view>
			<view class="record-content">
				<!--tab-->
				<view class="record-flow" :style="{ position: flowPosition, top: flowTopHeight }">
					<view class="flow-tag">
						<view class="flow-item" :class="{ selected: isShowApprove }" @click="showApproveView">审批流</view>
						<view class="flow-item" :class="{ selected: isShowExcute }" @click="showExcuteView">执行流</view>
					</view>
					<!--设置宽度 禁止滚出屏幕-->
					<view class="scroll-container">
						<scroll-view scroll-x="true" show-scrollbar="false">
							<view class="tabs-container">
								<view class="tab-item" :class="{ selected: t.checked }" v-for="(t, index) in recordInfo.tabs" :key="index"
								 @click="changeTab(index)">
									<text>{{ t.label }}</text>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
				<!--tab下页面-->
				<view :style="{ 'margin-top': flowMargintop }">
					<!--审批流的页面-->
					<view class="execute-flow-content" v-if="isShowApprove">
						<view class="execute-flow-item" v-for="(f, i) in recordInfo.historicRecord" :key="i">
							<view class="line-container">
								<view class="line-top"></view>
								<view class="middle-circle"></view>
								<!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
								<view class="line-bottom"></view>
							</view>
							<view class="real-contant">
								<view class="item-top">
									<view class="execute-flow-name">
										<text class="flow-name">{{f.name}}</text>
									</view>
									<view class="execute-time">{{ f.endTime||"" }}</view>
								</view>
								<view class="item-middle">
									<view class="b-left">
										<text style="width: 52px">处理人</text>
										<view class="execute-creator">{{getAssignees(f)||"--"}}</view>
										<text class="flow-result" v-if="f.deleteReason && f.deleteReason!==''">{{f.deleteReason}}</text>
									</view>
								</view>
								<view class="item-bottom">{{f.comment||""}}</view>
								<view class="item-cell" v-for="(item, index) in f.flowComment" :key="index">
									<view class="timeclassshow">
										<view class="spanstyle">{{item.createName}}</view>
										<view class="timeclass">{{item.createTime}}</view>
									</view>
									<view style="margin-top: 5px;">
										{{item.comment}}
									</view>
									<view style="height: 1px;background: #E9E9E9;flex: 1;margin-top: 10px;" />
								</view>
								<view calss="bottom-comment">
									<view class="cell-text-right-all" @click="gotoWrite(f)">
										<text>写评论...</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!--执行流的页面-->
					<view class="execute-flow-content" v-if="isShowExcute">
						<view class="execute-flow-item" v-for="(f, i) in recordInfo.excuteRecord" :key="i">
							<view class="line-container">
								<view class="line-top"></view>
								<view class="middle-circle"></view>
								<!--:style="{ 'border-color': getFlowIcon(f.businessType).color }"-->
								<view class="line-bottom"></view>
							</view>
							<view class="real-contant">
								<view class="item-top">
									<view class="execute-flow-name">
										<i class="iconfont r-icon" :class="getFlowIcon(f.businessType).svg" :style="{ color: getFlowIcon(f.businessType).color }"></i>
										<text>{{getFlowIcon(f.businessType).name }}</text>
									</view>
									<view class="execute-time">{{ f.createTime }}</view>
								</view>
								<view class="item-bottom">
									<view class="b-left">
										<text>发起人</text>
										<view class="execute-creator">{{ f.createName || '---' }}</view>
									</view>
									<view>
										<label-arrow value="查看" @clickLabel="goTo(f)"></label-arrow>
									</view>

								</view>
							</view>
						</view>
					</view>
					<!--具体操作页面-->
					<view class="bgview" v-if="!isShowExcute && !isShowApprove">
						<list class="list-view-bg">
							<cell class="list-view-bg" v-if="tabIndex == 0">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<workincell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 1">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<claimcell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 2">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<workoutcell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 3">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<receiptcell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 4">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<reimbursecell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 5">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<settlecell class="cellBgView" :dic="cell" />
								</view>
							</cell>
							<cell class="list-view-bg" v-if="tabIndex == 6">
								<view class="cell-item" v-for="(cell, index) in recordInfo.curFlowData" :key="index">
									<pausecell class="cellBgView" :dic="cell" />
								</view>
							</cell>
						</list>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import workincell from '@/contractPages/contract/detail/contract-detail-cel/workincell.vue';
	import claimcell from '@/contractPages/contract/detail/contract-detail-cel/claimcell.vue';
	import workoutcell from '@/contractPages/contract/detail/contract-detail-cel/workoutcell.vue';
	import receiptcell from '@/contractPages/contract/detail/contract-detail-cel/receiptcell.vue';
	import reimbursecell from '@/contractPages/contract/detail/contract-detail-cel/reimbursecell.vue';
	import settlecell from '@/contractPages/contract/detail/contract-detail-cel/settlecell.vue';
	import pausecell from '@/contractPages/contract/detail/contract-detail-cel/pausecell.vue';
	import calRent from "@/common/util/cal-rent-money.js"
	var _self;
	export default {
		name: 'execute-info',
		components: {
			labelArrow,
			workincell,
			claimcell,
			workoutcell,
			receiptcell,
			reimbursecell,
			settlecell,
			pausecell
		},
		props: {
			isfixed: {
				type: Boolean,
				default () {
					return false;
				}
			},
			contractNo: {
				type: String,
				default: ''
			},
			businessKey: {
				type: String,
				default: ''
			}
		},
		watch: {
			isfixed(val) {
				if (val == false) {
					this.flowPosition = 'relative';
					this.flowTopHeight = '0px';
					this.flowMargintop = '0px';
				} else {
					this.flowPosition = 'fixed';
					this.flowTopHeight = '44px';
					this.flowMargintop = '50px';
				}
			},

			contractNo(val) {
				if (this.contractNo) {
					this.getContractRecevice();
					this.getExecuteData();
					this.getWorkInList();
					this.getClaimList();
					this.getWorkOutList();
					this.getRecepitList();
					this.getPauseList();
					this.getSettleList();
					this.getRefundList();
				}

			},
			businessKey(val) {
				console.log("businessKey" + val)
				if (this.businessKey) {
					this.getApproveData()
				}
			}

		},
		data() {
			return {
				//选项卡吸附设置
				flowPosition: 'relative',
				flowTopHeight: '0px',
				flowMargintop: '0px',
				//tabbar点击index
				tabIndex: 0,
				isShowExcute: false,
				isShowApprove: true,
				earningInfo: {
					tag: '合同营收',
					content: {
						revenuePerform: '0.00', //营收-履约
						revenueReceived: '0.00', //营收-已收
						pledgeAppoint: '0.00', //押金-约定
						pledgeReceived: '0.00', //押金-已收
						carriagePerform: '0.00', //运费-履约
						carriageReceived: '0.00' //运费-已收
					}
				},
				recordInfo: {
					tag: '执行记录',
					tabs: [{
							label: '进场',
							value: 0,
							checked: false,
							list: [], //进场列表
						},
						{
							label: '索赔',
							value: 1,
							checked: false,
							list: [], //索赔列表
						},
						{
							label: '退场',
							value: 2,
							checked: false,
							list: [], //退场列表
						},
						{
							label: '收款',
							value: 3,
							checked: false,
							list: []
						},
						{
							label: '退款',
							value: 4,
							checked: false,
							list: []
						},
						{
							label: '结算',
							value: 5,
							checked: false,
							list: []
						},
						{
							label: '报停',
							value: 6,
							checked: false,
							list: []
						}
					],
					curFlowData: [],
					historicRecord: [],
					excuteRecord: []
				}
			};
		},
		created() {
			console.log("created" + this.contractNo)
			_self = this;
			if (this.businessKey) {
				this.getApproveData()
			}
			if (this.contractNo) {
				this.getContractRecevice();
				this.getExecuteData();
				this.getWorkInList();
				this.getClaimList();
				this.getWorkOutList();
				this.getRecepitList();
				this.getPauseList();
				this.getSettleList();
				this.getRefundList();
			}
			uni.$on('refresh-list', usnerinfo => {
				this.getApproveData();
			})

		},
		methods: {
			getAssignees(item) {
				if (item.endTime) {
					return item.assignee
				}
				let ass = item.assigneeList ? item.assigneeList.join("/") : null
				if (ass) {
					return ass + "(未审批)"
				} else {
					return null;
				}
			},
			getContractRecevice() {
				let self = this;
				this.$network.getData(this.$url.CONTRACT_DETAIL_RECEIVABLE + "?contractNo=" + this.contractNo, "GET", null).then((
					result) => {
					let revenuePerform = 0;
					let revenueReceived = 0;
					if (result.receivableCurrent) {
						revenuePerform = (result.receivableCurrent.hire ? Number.parseFloat(result.receivableCurrent.hire) : 0) +
							(result.receivableCurrent.claim ? Number.parseFloat(result.receivableCurrent.claim) : 0) +
							(result.receivableCurrent.carriage ? Number.parseFloat(result.receivableCurrent.carriage) : 0) // 履约营收

						this.earningInfo.content.revenuePerform = calRent.dealNumber(revenuePerform + "")
						this.earningInfo.content.pledgeAppoint = result.receivableCurrent.pledge ? calRent.dealNumber(result.receivableCurrent
							.pledge) : "0.00"
						this.earningInfo.content.carriagePerform = result.receivableCurrent.carriage ? calRent.dealNumber(result.receivableCurrent
							.carriage) : "0.00"

					}
					if (result.receipt) {
						revenueReceived = (result.receipt.hire ? Number.parseFloat(result.receipt.hire) : 0) +
							(result.receipt.claim ? Number.parseFloat(result.receipt.claim) : 0) +
							(result.receipt.carriage ? Number.parseFloat(result.receipt.carriage) : 0) //已收营收

						console.log("revenueReceived:" + revenueReceived)
						this.earningInfo.content.revenueReceived = calRent.dealNumber(revenueReceived + "")
						this.earningInfo.content.pledgeReceived = result.receipt.deposit ? calRent.dealNumber(result.receipt.deposit) :
							"0.00" ////已收押金
						this.earningInfo.content.carriageReceived = result.receipt.carriage ? calRent.dealNumber(result.receipt.carriage) :
							"0.00"
					}


					let customerReceiptTotalDone =
						result && result.receipt ? Number(result.receipt.deposit) : 0; //已收押金
					//计算应收比例
					this.debtRatio(revenuePerform, revenueReceived, customerReceiptTotalDone)

				}).catch((err) => {

				})
			},
			debtRatio(debtExpireTotal, debtExpireTotalDone, customerReceiptTotalDone) {
				let obj = {
					value: '',
					tip: ''
				};
				if (debtExpireTotal > 0) {
					let debtRatio = ((debtExpireTotal - customerReceiptTotalDone - debtExpireTotalDone) / debtExpireTotal) * 100
					if (debtRatio < 10) { //无、轻
						obj = {
							value: '',
							tip: ''
						}
					} else if (debtRatio > 10 && debtRatio < 30) { //中
						obj = {
							value: '中',
							tip: '(履约已收-押金)/履约营收 < 30% 并且 (履约已收-押金)/履约营收 > 10% '
						}
					} else {
						obj = {
							value: '高',
							tip: ' (履约已收-押金)/履约营收 > 30%'
						}
					}
				}

				this.$emit('debtRatio', obj);

			},
			getApproveData() { //审批流
				let param = {
					"businessKey": this.businessKey
				}
				let url = this.$url.HISTORIC_FLOW_LIST.replace(/xxx/, "contractapi");
				this.$network.getData(url, "GET", param).then((result) => {
					this.recordInfo.historicRecord = result;

				}).catch((err) => {

				})
			},
			getExecuteData() { //执行流
				let self = this;
				this.$network.getData(this.$url.CONTRACT_EXECUTE_INFO + "?contractNo=" + this.contractNo, "GET", null).then((result) => {
					self.recordInfo.excuteRecord = result;

				}).catch((err) => {

				})
			},
			getWorkInList() { //进场
				let self = this;
				let param = {
					contractNo: this.contractNo,
					current: 1,
					size: 1000
				}
				this.$network.getData(this.$url.WORK_IN_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[0].list = result;
				}).catch((err) => {

				})
			},
			getClaimList() { //索赔
				let self = this;
				let param = {
					contractNo: this.contractNo,
					current: 1,
					size: 1000
				}
				this.$network.getData(this.$url.CLAIM_PAGE, "POST", param).then((result) => {
					self.recordInfo.tabs[1].list = result.records;
				}).catch((err) => {

				})
			},
			getWorkOutList() { //退场
				let self = this;
				let param = {
					contractNo: this.contractNo
				}
				this.$network.getData(this.$url.WORK_OUT_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[2].list = result;
				}).catch((err) => {

				})
			},
			getRecepitList() { //收款
				let self = this;
				let param = {
					contractNo: this.contractNo,
					current: 1,
					size: 1000
				}
				this.$network.getData(this.$url.SETTLE_PROCEEDS_PAGE, "POST", param).then((result) => {
					self.recordInfo.tabs[3].list = result.records;
				}).catch((err) => {

				})
			},
			getRefundList() { //退款
				let self = this;
				let param = {
					contractNo: this.contractNo,
					current: 1,
					size: 1000
				}
				this.$network.getData(this.$url.SETTLE_REIMBURSE_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[4].list = result.records;
				}).catch((err) => {

				})
			},
			getSettleList() { //结算
				let self = this;
				let param = {
					contractNo: this.contractNo,
					current: 1,
					size: 1000
				}
				this.$network.getData(this.$url.SETTLEMENT_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[5].list = result.records;
				}).catch((err) => {

				})
			},
			getPauseList() { //报停
				let self = this;
				let param = {
					contractNo: this.contractNo
				}
				this.$network.getData(this.$url.PAUSE_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[6].list = result;
				}).catch((err) => {

				})
			},
			getInvoiceList() { //发票
				let self = this;
				let param = {
					contractNo: this.contractNo//接口没有字段
				}
				this.$network.getData(this.$url.INVOICE_LIST, "POST", param).then((result) => {
					self.recordInfo.tabs[7].list = result;
				}).catch((err) => {
			
				})
			},
			getFlowData(index) {
				this.recordInfo.curFlowData = this.recordInfo.tabs[index].list;
				console.log("getFlowData:" + index + JSON.stringify(this.recordInfo.curFlowData))
			},
			getFlowIcon(flowType) {
				let icon = {
					svg: 'iconzl--hetong',
					color: '#E60000',
					name: ''
				};
				switch (flowType) {
					case 'contract':
						icon.svg = 'iconzl--hetong';
						icon.color = '#E60000';
						icon.name = '合同';
						break;
					case 'contractChange':
						icon.svg = 'iconzl--hetong';
						icon.color = '#5A7AE8';
						icon.name = '合同变更';
						break;
					case 'workIn':
						icon.svg = 'iconzl--ruchang';
						icon.color = '#E60000';
						icon.name = '进场';
						break;
					case 'workOut':
						icon.svg = 'iconzl--chuchang';
						icon.color = '#5A7AE8';
						icon.name = '退场';
						break;
					case 'pause':
						icon.svg = 'iconzl--zhuyi';
						icon.color = '#FB7135';
						icon.name = '报停';
						break;
					case 'claim':
						icon.svg = 'iconzl--suopei';
						icon.color = '#FCA01F';
						icon.name = '索赔';
						break;
					case 'settle':
						icon.svg = 'iconico_home_obligation';
						icon.color = '#FCA01F';
						icon.name = '结清';
						break;
					case 'settlement':
						icon.svg = 'iconico_home_obligation';
						icon.color = '#FCA01F';
						icon.name = '结算';
						break;
					case 'proceeds':
						icon.svg = 'iconico_home_obligation';
						icon.color = '#E60000';
						icon.name = '收款';
						break;
					case 'reimburse':
						icon.svg = 'iconico_home_obligation';
						icon.color = '#ff5500';
						icon.name = '退款';
						break;
					case 'contractPlus':
						icon.svg = 'iconzl--hetong';
						icon.color = '#5A7AE8';
						icon.name = '合同附加';
						break;
					case 'invoice':
						icon.svg = 'iconfapiao';
						icon.color = '#5A7AE8';
						icon.name = '发票';
						break;

					default:
						break;
				}
				return icon;
			},
			gotoWrite(item) {
				uni.navigateTo({
					url: "/businessPages/workin/work-flow-write?item=" + encodeURIComponent(JSON.stringify(item))
				})
			},
			goTo(item) {
				switch (item.businessType) {
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
					case 'reimburse':
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
							url: './contract-detail?id=' + item.id
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
							url: '/contractPages/contract-change/contract-change-detail?businessNo=' + item.contractNo
						});
						break;


					default:
						uni.showToast({
							icon: "none",
							title: "该功能未在APP开放，请去PC端处理"
						})
						break;
				}
			},
			showExcuteView() {
				this.isShowExcute = true;
				this.isShowApprove = false;
				this.recordInfo.tabs.map(t => {
					return (t.checked = false);
				});
			},
			showApproveView() {
				this.isShowExcute = false;
				this.isShowApprove = true;
				this.recordInfo.tabs.map(t => {
					return (t.checked = false);
				});
			},
			changeTab(index) {
				this.isShowExcute = false;
				this.isShowApprove = false;
				if (!this.recordInfo.tabs[index].checked) {
					this.recordInfo.tabs[index].checked = true;
				}
				for (let i = 0; i < this.recordInfo.tabs.length; i++) {
					if (i != index) {
						this.recordInfo.tabs[i].checked = false;
					}
				}
				this.tabIndex = index;
				this.getFlowData(index);
			},
			onPageScroll(e) {
				if (e.scrollTop >= 203) {
					_self.flowPosition = 'fixed';
					_self.flowTopHeight = '88px';
					_self.flowMargintop = '66px';
				} else {
					_self.flowPosition = 'relative';
					_self.flowTopHeight = '0px';
					_self.flowMargintop = '0px';
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.execute-info-content {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
	}

	/**公共组件**/
	.container {
		margin: 8px;
	}

	/**信息标题**/
	.tag {
		padding: 12px 8px 8px 8px;
		color: $uni-text-color;
		font-weight: 600;
		font-size: $uni-font-size-base;
	}

	/**具体信息外边框**/
	.info-content {
		background-color: #ffffff;
		border-radius: 4px;
		padding: 16px 16px 8px 16px;
	}

	.earning-top {
		display: flex;
		flex-direction: row;
	}

	.earning-item {
		display: flex;
		flex-direction: column;
		margin-bottom: 16px;
		flex: 1;
	}

	.e-item-title {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.e-item-sub-title {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
		margin-top: 4px;
	}

	.e-item-value {
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		font-weight: bold;
		margin-top: 8px;
	}

	.earning-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding-top: 8px;
	}

	/**执行记录**/
	.record-flow {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		padding: 8px 0px;
		background-color: #ffffff;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.flow-tag {
		width: 160px;
		margin-right: 4px;
		margin-left: 4px;
		min-width: 80px;
		text-align: center;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-color: $uni-text-color-disable;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
	}

	.flow-item {
		flex: 1;
		text-align: center;
		padding: 4px;

		&.selected {
			background: #E60000;
			color: #ffffff;
			border-radius: 8px;
		}
	}

	.scroll-container {
		width: calc(100% - 169px);
		background: #ffffff;
	}

	.tabs-container {
		display: flex;
		flex: 1;
		flex-direction: row;
		width: calc(100% - 168px);
	}

	.tab-item {
		padding: 4px 8px;
		white-space: nowrap;

		&.selected {
			background: #E60000;
			color: #ffffff;
			border-radius: 16px;
		}
	}

	.execute-flow-item {
		margin: 0px 16px;
		display: flex;
		flex-direction: row;
	}

	.line-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.line-top {
		background-color: $uni-text-color-gray;
		width: 1px;
		height: 30px;
	}

	.line-bottom {
		background-color: $uni-text-color-gray;
		width: 1px;
		flex: 1;
	}

	.middle-circle {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		border-width: 4px;
		border-color: #E60000;
		border-style: solid;
	}

	.real-contant {
		display: flex;
		margin-left: 16px;
		margin-top: 8px;
		margin-bottom: 8px;
		flex: 1;
		flex-direction: column;
		background-color: #ffffff;
		padding: 16px;
		border-radius: 4px;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.r-icon {
		color: #E60000;
		font-size: 14px;
		margin-right: 4px;
	}

	.execute-flow-name {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.flow-name {
		font-size: $uni-font-size-base;
		font-weight: bold;
		color: $uni-text-color;
	}

	.flow-result {
		margin-left: 8px;
		border: 1px solid $uni-color-primary;
		padding: 2px 4px;
		border-radius: 4px;
		color: $uni-color-primary;
	}

	.execute-time {
		font-size: $uni-font-size-xs;
		color: $uni-text-color-gray;
	}

	.execute-creator {
		margin-left: 8px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.item-middle {
		display: flex;
		flex-direction: row;
		font-size: $uni-font-size-base;
		justify-content: space-between;
		margin-top: 8px;
		color: $uni-text-color;
	}

	.item-bottom {
		display: flex;
		flex-direction: row;
		font-size: $uni-font-size-base;
		justify-content: space-between;
		margin-top: 8px;
		color: $uni-text-color-gray;
	}

	.b-left {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.execute-option {
		margin-left: 16px;
		word-wrap: break-word;
	}

	//列表第一个的上半部分线不显示
	.execute-flow-item:first-child .line-container .line-top {
		background-color: $uni-bg-color-grey;
	}

	//列表最后一个的下半部分线不显示
	.execute-flow-item:last-child .line-container .line-bottom {
		background-color: $uni-bg-color-grey;
	}

	//操作页面
	.bgview {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.list-view-bg,
	.cell-item {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.cellBgView {
		display: flex;
		flex: 1;
		flex-direction: column;
		margin: 10px;
		background: #ffffff;
	}

	.cell-text {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}

	.cell-text-left {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-left: 15px;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.cell-text-right {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-right: 15px;
		justify-content: flex-end;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.fontBlackcolor {
		color: $uni-text-color;
	}

	.fontdetailcolor {
		color: $uni-color-primary;
	}

	.fontgreencolor {
		color: #4cd964;
	}

	.line-s {
		margin-top: 5px;
		margin-left: 10px;
		margin-right: 10px;
		height: 1px;
		background: #eeeeee;
	}

	.item-cell {
		display: flex;
		flex-direction: column;
		padding: 5px;
		font-size: $uni-font-size-base;
		color: #222831;
		background: $uni-bg-color-grey;
	}

	.spanstyle {
		display: flex;
		flex: 1;
		flex-direction: row;
		margin-top: 5px;
		color: #222831;
		font-weight: bold;
		font-size: $uni-font-size-base;
		margin-right: 5px;
	}

	.bottom-comment {
		display: flex;
		flex-direction: row;
		margin: 5px;
		justify-content: flex-end;
	}

	.cell-text-right-all {
		margin-top: 5px;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #e0e0e0;
		border: 1px solid #e0e0e0;
		padding: 5px 5px;
		border-radius: 4px;
	}

	.timeclass {
		display: flex;
		flex-direction: row;
		margin-top: 5px;
		margin-bottom: 5px;
		margin-right: 0px;
		justify-content: flex-end;
		font-size: $uni-font-size-sm;
		color: #999999;
	}

	.timeclassshow {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
