<template>
	<view class="content">
		<createStep 
		processKey="invoice" 
		@submitApply="invoiceApply" 
		:orgId="invoiceDic.orgId" 
		:itemData="itemData" 
		@data-form="getBackData" 
		:updateObj="invoiceDic" 
		:isUpdate='isUpdate'>
		 
			<baseInvoice 
			@invoiceDic="getDic" 
			ref="invoice"
			@processType='getProcess' 
			:isFrist='true' 
			:itemData="itemData"
			:formKey='formKey'
			:nodeList="nodeList"
			:applyData='invoiceDic'/>

		</createStep>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import baseInvoice from './base-invoice.vue'
	import createStep from "@/components/workflow/create-step.vue"
	import commonMethod from '@/common/common-method/common-method.js'
	export default {
		components: {
			baseInvoice,
			createStep
		},
		data() {
			return {
				itemData: null,
				invoiceDic: {
					taxNumber:'',
					address:'',
					openingBank:'',
					bankAccount:'',
					invoiceSum:'',
					invoiceNo:'',
					total:'',
					tariff:'',
					fileList:[]
				},
				businessNo: "",
				processType: "",
				processObj: {}, //发票流程obj
				formKey: '',
				nodeList: [],
				isUpdate: false

			}
		},
		onLoad(options) {
			
			//定制会使用formKey
			this.itemData =options.item? JSON.parse(decodeURIComponent(options.item)):null
			this.isUpdate = options.isUpdate ? (options.isUpdate === "1" ? true : false) : false
			this.getProcessNode();
			if(!this.itemData){
				this.invoiceDic = {
					...this.invoiceDic,
					"invoiceDate": this.$datestr.getnowDate()
				}
				this.getBusinessNo()
				
			}

		},
		methods: {
			getBusinessNo() {
				let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'KP')
				this.$network.getData(url, "GET", null).then((result) => {
					this.invoiceDic={
						...this.invoiceDic,
						businessNo:result,
					}
					this.$refs.invoice.setWorkDic(this.invoiceDic);
				}).catch((err) => {
			
				})
			},
			//获取第一个节点的formKey
			getProcessNode() {
				this.workflowcommon.getApplyProcessNode('invoice').then((result) => {
					if (result && result.length > 0) {
						this.nodeList = [...result];
						this.formKey = result[0].formKey
					}

				})
			},
			getProcess(val) {
				this.processType = val.processType;
				this.processObj = val.processObj ? val.processObj : {};
			},
			getBackData(val) {
				//默认赋值
				this.$refs.invoice.setWorkDic(JSON.parse(val));
			},
			getDic(val) {
				this.invoiceDic = { ...val
				}
			},
			judgeApply() {
				if (!this.invoiceDic.customerId) {
					uni.showToast({
						icon: "none",
						title: "请选择客户"
					})
					return false
				}
				if (!this.invoiceDic.invoiceType) {
					uni.showToast({
						icon: "none",
						title: "请输入开票类型"
					})
					return false
				}
				if (!this.invoiceDic.invoiceSum) {
					uni.showToast({
						icon: "none",
						title: "请输入开票金额"
					})
					return false
				}
				return true
			},
			judgeInvoice() {
				if (!this.invoiceDic.invoiceNo) {
					uni.showToast({
						icon: "none",
						title: "请输入发票号码"
					})
					return false
				}
				if (!this.invoiceDic.type) {
					uni.showToast({
						icon: "none",
						title: "请选择发票类型"
					})
					return false
				}
				if (!this.invoiceDic.invoiceDate) {
					uni.showToast({
						icon: "none",
						title: "请选择开票日期"
					})
					return false
				}
				if (!this.invoiceDic.total||Number(this.invoiceDic.total)<=0) {
					uni.showToast({
						icon: "none",
						title: "请输入有效金额"
					})
					return Promise.reject('fail')
				
				}
				
				return true

			},
			//获取第一步创建的formKey
			getFirstModel(formKey) {
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
			isHaveModel(modelName) {
				let createList = this.getFirstModel(this.formKey);
				if (createList.find(o => o === modelName)) {
					return true;
				}
				return false;
			},
			checkData() {
				if (!this.getFirstModel(this.formKey)) {
					return Promise.reject('fail')
				}
				let result = true
				if (this.isHaveModel('apply')) {
					result = this.judgeApply()
				}
				if (!result) {
					return Promise.reject('fail')
				}

				if (this.isHaveModel('invoice')) {
					result = this.judgeInvoice()
				} else {
					this.invoiceDic = {
						...this.invoiceDic,
						invoiceNo: null,
						type: null,
						typeName: null,
						invoiceDate: null,
						total: 0,
						tariff:0
					}
				}
				if (!result) {
					return Promise.reject('fail')
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
			invoiceApply(val) {
				uni.showLoading({
					mask: true
				})

				this.$network
					.getData(this.$url.SETTLE_INVOICE_CREAT + val, 'POST', this.invoiceDic)
					.then(result => {
						uni.$emit("refresh-contract-list", {
							type: 'invoice'
						})
						uni.$emit("refresh-notification-list", {
							type: 'apply'
						})
						uni.navigateBack({
							animationDuration: 200
						});
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
					});
			}
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
