<template>
	<view class="content">
		<view>
			<!-- -->
			<modelApply 
			:invoiceDic="invoiceDic" ref='applyModel' 
			:isEdit="isEditModel('apply')" 
			v-if="isShowModel('apply')"
			@goTo='goTo' 
			@showPick='showPick' 
			@setInvoiceInput='setInvoiceInput' 
			:contractDicName='contractDicName' 
			/>

			<modelInvoice 
			:invoiceDic="invoiceDic" 
			ref='invoiceModel' 
			:isEdit="isEditModel('invoice')" 
			v-if="isShowModel('invoice')"
			@setInvoiceInput='setInvoiceInput' 
			@showPick='showPick' 
			/>
			<modelAttachment 
			:invoiceDic="invoiceDic" 
			ref='attachmentModel' 
			:isEdit="isEditModel('apply')||isEditModel('invoice')"
			v-if="isShowModel('apply')||isShowModel('invoice')"
			@setComment='setComment' 
			@updateFile='updateFile'
			/>

		</view>
		<!-- 类型选择 -->
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<!-- 时间选择 -->
		<w-picker :mode="datetype" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
		 ref="date" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import modelApply from './model/model-apply.vue';
	import modelInvoice from './model/model-invoice.vue';
	import modelAttachment from './model/model-attachment';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		components: {
			modelApply,
			modelInvoice,
			modelAttachment,
			wPicker
		},
		props: {
			//是否是第一步
			isFrist: {
				type: Boolean,
				default: false
			},
			formKey: {
				type: String,
				default: ''
			},
			applyData: {
				type: Object,
				default () {
					return {};
				}
			},
			nodeList: {
				type: Array,
				default () {
					return [];
				}
			},
			itemData: {
				type: Object,
				default () {
					return null;
				}
			},
		},
		watch: {
			invoiceDic(val) {
				this.$emit('invoiceDic', val)
			},
			nodeList(val) {
				if (!this.isEditModel('apply')) {
					this.contractDicName = this.invoiceDic.customerName + '-' + this.invoiceDic.projectName;
				}
				if (this.isEditModel('invoice') || this.isEditModel('apply')) {
					this.loadInvoiceType();
				}
			}
		},
		created() {
			this.invoiceDic={
				...this.applyData
			}
			uni.getStorage({
				key: 'invoice',
				success: (res) => {
					this.processType = res.data ? (res.data.customizedKey ? res.data.customizedKey : 'workOutBase') : 'workOutBase';
					this.$emit('processType', {
						processObj: res.data ? res.data : null,
						type: this.processType
					})
				},
				fail: () => { //没有流程的情况下
					this.processType = 'invoiceWhole';
					this.$emit('processType', {
						processObj: null,
						type: this.processType
					})
				}
			});
			//监听公司联系人返回
			uni.$on('linkman-emit-conpany', obj => {
				this.setCustomerData(obj.dict,'2');
				this.invoiceDic = {
					...this.invoiceDic,
					customerType: 2
				}
			});
			//监听个人联系人返回
			uni.$on('linkman-emit-person', obj => {
				this.setCustomerData(obj.dict,'1');
				this.invoiceDic = {
					...this.invoiceDic,
					customerType: 1
				}

			});
			uni.$on('choose-contract-emit', obj => {
				console.log('choose-contract-emit' + JSON.stringify(obj.dict));
				let contractObj = obj.dict;
				this.setContractData(contractObj);
			});


		},
		data() {
			return {
				invoiceDic: {
				},
				processType: '', //流程配置的类型
				contractDicName: "",
				datetype: 'date',
				pickType: '',
				selectList: [],
				invoiceTypes: [], //发票类型列表
				curItem: 0

			}
		},
		methods: {
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			setCustomerData(customerObj,type) {
				this.invoiceDic = {
					...this.invoiceDic,
					customerId: customerObj.id,
					customerName: customerObj.name,
					orgId: customerObj.orgId,
					orgName: customerObj.orgName,
					address: customerObj.address,
					phoneNum: type == '1' ? customerObj.phoneNum : customerObj.fixedPhone,
					openingBank: customerObj.openingBank,
					taxNumber: customerObj.taxNumber,
					customerSalesman: customerObj.salesman,
					customerSalesmanName: customerObj.salesmanName,
					bankAccount: customerObj.bankAccount,
					contractNo: null,
					contractDetailId: null,
					projectName: null,
					invoiceName:customerObj.name || ''
				}
				this.contractDicName = "";
			},
			setContractData(contractObj) {
				console.log('contractObj' + JSON.stringify(contractObj));
				this.invoiceDic = {
					...this.invoiceDic,
					contractDetailId: contractObj.contractDetailDto.id || '',
					contractNo: contractObj.businessNo || '',
					contactName: contractObj.contractDetailDto.contactName || '',
					orgName: contractObj.orgName,
					orgId: contractObj.orgId,
					customerSalesman: contractObj.contractDetailDto.customerSalesman,
					customerSalesmanName: contractObj.contractDetailDto.customerSalesmanName,
					projectName:contractObj.contractDetailDto.projectName,
				};
				this.contractDicName = contractObj.customerName + '-' + contractObj.contractDetailDto.projectName;
			},
			//备注
			setComment(val) {
				this.invoiceDic = {
					...this.invoiceDic,
					comment: val
				};
			},
			//
			setInvoiceInput(val) {
				if(this.invoiceDic.hasOwnProperty(val.prop)){
					this.invoiceDic[val.prop] =val.value
					this.invoiceDic = {
						...this.invoiceDic
					};
				}
			},
			//加载发票类型
			loadInvoiceType() {
				uni.showLoading();
				this.$network.loadType('invoice_type')
					.then(result => {
						this.invoiceTypes = result ? result : [];
						if (this.isEditModel('invoice') && this.invoiceTypes && this.invoiceTypes.length > 0) {
							this.invoiceDic = {
								...this.invoiceDic,
								type: this.invoiceTypes[0].value,
								typeName: this.invoiceTypes[0].label
							}
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			updateFile(val) {
				this.invoiceDic = { ...this.invoiceDic,
					fileList: val
				};
			},
			goTo(val) {
				let type = val.type
				switch (type) {
					case 'customer':
						uni.navigateTo({
							url: '/otherPages/linkman/linkman?nextview=false&from=invoice'
						});
						break;
					case 'contract':
						if (this.isEditModel('apply')) {
							uni.navigateTo({
								url: "/businessPages/invoice/contract-choose?customid=" + this.invoiceDic.customerId
							});
						} else {
							if (this.invoiceDic.contractNo) {
								uni.navigateTo({
									url: '/contractPages/contract/contract-detail?businessNo=' + this.invoiceDic.contractNo
								});
							}
							return;
						}
						break;
					default:
						break;
				}
			},
			showPick(val) {
				this.pickType = val.pickType
				switch (val.selectType) {
					case 'date':
					case 'dateTime':
						this.datetype = val.selectType;
						this.$refs.date.show();
						break;
					case 'selector':
						switch (this.pickType) {
							case 'invoiceType':
								this.selectList = this.invoiceTypes ? this.invoiceTypes : [];
								break;
							case 'invoiceTypeApply':
								this.selectList = this.invoiceTypes ? this.invoiceTypes : [];
								break;
						}
						this.$refs.selector.show();
						break;
				}
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'invoiceDate':
						this.invoiceDic = { 
							...this.invoiceDic,
							invoiceDate: val.result + ' 00:00:00'
						};
						break;
					case 'invoiceType':
						this.invoiceDic = { 
							...this.invoiceDic,
							type: val.checkArr.value,
							typeName: val.checkArr.label
						};
						break;
					case 'invoiceTypeApply':
						this.invoiceDic = { 
							...this.invoiceDic,
							invoiceType: val.checkArr.value,
							invoiceTypeName: val.checkArr.label
						};
						break;
					default:
						break;
				}
			},
			isShowModel(model) {
				let isShow = false; //是否显示model
				if (this.nodeList.length > 0) {
					//判断当前是是否是第一步
					if (this.isFrist) {
						//第一步是否显示model
						if (this.nodeList[0].formKey&&this.nodeList[0].formKey.indexOf(model) !== -1) {
							isShow = true
						}
					}else{ //
						//遍历所有到目前为止的流程中是否显示model
						for (let i = 0; i < this.nodeList.length; i++) {
							if (this.nodeList[i].formKey && this.nodeList[i].formKey.indexOf(model) !== -1) {
								isShow = true
								return true
							}

						}
					}
				}else { //没有流程时，都显示
					isShow = true;
				}
				return isShow;
			},
			/**是否可编辑	
			 * @param {Object} model
			 */
			isEditModel(model) {
				let isEdit = false; //是否显示model
				if (this.formKey) {
					if (this.nodeList.length > 0) {
						//判断当前是是否是第一步
						let obj = null;
						if (this.isFrist) {
							obj = this.nodeList[0];
						}else{ //
							// 判断当前流程在nodeList中是第几步
							obj = this.nodeList.find(o => {
								return o.formKey === this.formKey
							})
						}
						//第一步是否显示model
						if (obj && obj.formKey&&obj.formKey.indexOf(model) !== -1) {
							isEdit = true
						}
					}else{ //没有流程时，都显示
						isEdit = true;
					}
				}
				return isEdit;
			},
			setWorkDic(val) {
				this.invoiceDic = {
					...this.invoiceDic,
					...val
				}
				if (this.invoiceDic.customerName || this.invoiceDic.projectName) {
					this.contractDicName = this.invoiceDic.customerName + '-' + this.invoiceDic.projectName;
				} else {
					this.contractDicName = ''
				}
				
				if(this.isEditModel('apply')&&!this.invoiceDic.invoiceDate){
					this.invoiceDic = {
						...this.invoiceDic,
						invoiceDate:this.$datestr.getnowDate()
					};
				}

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
