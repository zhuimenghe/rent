<template>
	<view class="content">
		<approve-step :itemData="itemData" @data-form="dataForm" :updateObj='invoiceDic' :NeedUpdate="true" :orgId="invoiceDic.orgId"
		 :businessOwner="invoiceDic.customerSalesman" :needBackJson='true' @backTask="backTask">
			<baseInvoice @invoiceDic="getDic" :applyData="invoiceDic" @processType='getProcess' :isFrist='false' ref="invoice"
			 :nodeList="nodeList" :formKey='itemData.formKey'></baseInvoice>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import baseInvoice from './base-invoice.vue'
	import approveStep from "@/components/workflow/approve-step.vue"
	import timeCompare from '@/common/common-method/common-method.js';
	export default {
		components: {
			baseInvoice,
			approveStep
		},
		data() {
			return {
				itemData: null,
				invoiceDic: {
					invoiceNo: '',
					total: '',
					tariff: ''
				},
				processType: "",
				processObj: {}, //退场流程obj
				nodeList: []
			}

		},
		onLoad(options) {
			console.log(options)
			this.itemData = options.item ? JSON.parse(decodeURIComponent(options.item)) : null;
			if (this.itemData) {
				this.getStep(this.itemData);
			}

		},
		onNavigationBarButtonTap() {
			let url = '/businessPages/workin/work-flow-display?businessKey=' + this.invoiceDic.businessKey;
			uni.navigateTo({
				url: url
			})
		},
		methods: {
			backTask(val) {
				if (this.nodeList.length > 0) {
					let applyList = this.getJudgeModel(this.nodeList[0].formKey);
					if (!applyList.find(o => o === 'invoice')) {
						this.invoiceDic = {
							...this.invoiceDic,
							invoiceNo: null,
							type: null,
							typeName: null,
							invoiceDate: null,
							total: 0,
							tariff: 0
						}
					}
				}
				let param = val.param;
				param = {
					...param,
					json: JSON.stringify(this.invoiceDic)
				}
				let url = this.$url.BACK_TASK.replace(/xxx/, 'settleapi');
				this.$network
					.getData(url, 'POST', param)
					.then(result => {
						uni.$emit("refresh-notification-list", {
							type: 'wait'
						})
						uni.$emit('refresh-contract-list', {
							type: 'wait'
						});
						uni.showToast({
							title: "退回成功",
							icon: "none"
						})
						uni.navigateBack({
							delta: 1
						})

					})
					.catch(err => {
						uni.showToast({
							icon: "none",
							title: err.detail[0] ? err.detail[0] : err.message
						})
					});

			},
			getApproveData(businessKey) { //审批流
			console.log('getApproveData===========')
				this.workflowcommon.getOnlineList(businessKey).then((result) => {
					this.nodeList = result ? [...result] : []
				})
			},
			getProcess(val) {
				this.processType = val.processType;
				this.processObj = val.processObj ? val.processObj : {};
			},
			dataForm(val) {
				let dic = JSON.parse(val)
				this.$refs.invoice.setWorkDic(JSON.parse(val));
				this.getApproveData(dic.businessKey)

			},
			getStep(data) {
				uni.setNavigationBarTitle({
					title: data.name
				})
			},
			getDic(val) {
				this.invoiceDic = { ...val
				}
			},
			getJudgeModel(formKey) {
				if (!formKey) {
					return null
				}
				let arr = []
				if (formKey.indexOf('|') !== -1) {
					arr = formKey.split("|")
				} else {
					arr.push(formKey)
				}
				return arr
			},

			checkData() {
				if (!this.getJudgeModel(this.itemData.formKey)) {
					return Promise.resolve('success')
				}
				let applyList = this.getJudgeModel(this.itemData.formKey);
				if (applyList.find(o => o === 'invoice')) {
					if (!this.invoiceDic.invoiceNo) {
						uni.showToast({
							icon: "none",
							title: "请输入发票号码"
						})
						return Promise.reject('fail')

					}
					if (!this.invoiceDic.type) {
						uni.showToast({
							icon: "none",
							title: "请选择发票类型"
						})
						return Promise.reject('fail')

					}
					if (!this.invoiceDic.invoiceDate) {
						uni.showToast({
							icon: "none",
							title: "请选择开票日期"
						})
						return Promise.reject('fail')

					}
					if (!this.invoiceDic.total || Number(this.invoiceDic.total) <= 0) {
						uni.showToast({
							icon: "none",
							title: "请输入有效金额"
						})
						return Promise.reject('fail')

					}
				}

				return Promise.resolve('success')
			},
			//是否查找到‘00：00：00’
			findNotStr(str, findstr) {
				return str.indexOf(findstr) === -1;
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}
</style>
