<template>
	<view class="model-container">
		<view class="model-tag">
			<text>{{modelName}}</text></view>
		<select-label-item
		tagName="发票单号" 
		:isRequired="true" 
		:value="invoiceDic.businessNo" 
		:isSelect="false" 
		/>
		<select-label-item 
		tagName="客户名称" 
		:isRequired="true" 
		hint="请选择客户" 
		:value="invoiceDic.customerName" 
		:icon="righticon"
		@clickItemLabel="goTo($event, 'customer')" 
		:isSelect='isEdit' 
		/>
		<view v-if="invoiceDic.customerId" style="display: flex;flex-direction: column;">
			<select-label-item 
			tagName="区域" 
			:value="invoiceDic.orgName" 
			:isSelect="false" 
			/>
			<select-label-item 
			tagName="业务负责人" 
			:value="invoiceDic.customerSalesmanName" 
			:isSelect="false" 
			/>
			<select-label-item
			tagName="开票类型" 
			:isRequired="true"
			hint="请选择开票类型" 
			:value="invoiceDic.invoiceTypeName" 
			:icon="righticon"
			@clickItemLabel="clickShowPick('invoiceTypeApply')"
			:isSelect='isEdit' 
			/>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>开票金额</text><text style="color: #ff0000;">*</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="number" 
					v-model="invoiceDic.invoiceSum" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'0.00':''" 
					/>
				</view>
			</view>
			<select-label-item 
			tagName="合同名称" 
			hint="请选择合同" 
			:value="invoiceDic.contractNo?invoiceDic.customerName+(invoiceDic.projectName?('-'+invoiceDic.projectName):''):(isEdit?'':'--')"
			:icon="righticon" 
			@clickItemLabel="goTo($event, 'contract')" 
			:valueColor='isEdit?"#333333":"#E60000"' 
			:isSelect='isEdit'
			/>
			 <view class="cell-input-view">
			 	<view class="cell-input-view-left"><text>发票抬头</text></view>
			 	<view class="cell-input-view-right">
			 		<input 
					class="input-style" 
					type="text" 
					v-model="invoiceDic.invoiceName" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入发票抬头...':'-'" 
					/>
			 	</view>
			 </view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>纳税人识别号</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="invoiceDic.taxNumber" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入纳税人识别号...':'-'"  
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>单位地址</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="invoiceDic.address" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入单位地址...':'-'"  
					/>
				</view>
			</view>
			<select-label-item 
			tagName="电话号码" 
			:value="invoiceDic.phoneNum" 
			:isSelect="false" 
			:isPhone='true' 
			/>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>开户行</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="invoiceDic.openingBank" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入开户行...':'-'" 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>开户账号</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="number" 
					v-model="invoiceDic.bankAccount" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入开户账号...':'-'" 
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	export default {
		name: 'modelApply',
		components: {
			selectLabelItem
		},
		props: {
			//传入的数据
			invoiceDic: {
				type: Object,
				default () {
					return {
					};
				}
			},
			//是否可编辑
			isEdit: {
				type: Boolean,
				default: false
			},
			//合同名称
			contractDicName: {
				type: String,
				default: ""
			},
			//模块名称
			modelName: {
				type: String,
				default: "基本信息"
			}
		},
		watch: {
			invoiceDic(val) {
				// this.taxNumber = this.invoiceDic.taxNumber ? this.invoiceDic.taxNumber : null;
				// this.address = this.invoiceDic.address ? this.invoiceDic.address : null;
				// this.openingBank = this.invoiceDic.openingBank ? this.invoiceDic.openingBank : null;
				// this.bankAccount = this.invoiceDic.bankAccount ? this.invoiceDic.bankAccount : null;
				// this.invoiceSum = this.invoiceDic.invoiceSum ? this.invoiceDic.invoiceSum : '';
			},
			'invoiceDic.invoiceName'(val){
				this.$emit("setInvoiceInput", {
					prop: 'invoiceName',
					value: val
				})
			},
			'invoiceDic.taxNumber'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'taxNumber',
					value: val
				})
			},
			'invoiceDic.address'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'address',
					value: val
				})
			},
			'invoiceDic.openingBank'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'openingBank',
					value: val
				})
			},
			'invoiceDic.bankAccount'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'bankAccount',
					value: val
				})
			},
			'invoiceDic.invoiceSum'(val) { //开票金额
			console.log("invoiceSum----------------"+val)
			this.$emit("setInvoiceInput", {
				prop: 'invoiceSum',
				value: val
			})
			// setTimeout(()=>{
			// 	// this.invoiceSum = this.moneyUtil.getCheckMoney(val)
			// 	this.$emit("setInvoiceInput", {
			// 		prop: 'invoiceSum',
			// 		value: this.invoiceSum 
			// 	})
			// },10)
				
			},
		},
		data() {
			return {
				righticon: 'iconarrow-right',
				taxNumber: '',
				address: '',
				openingBank: '',
				bankAccount: '',
				invoiceSum: 0
			}
		},
		created() {
		},
		methods: {
			goTo(val, type) {
				this.$emit("goTo", {
					type: type
				})
			},
			checkMoney(){
				this.$emit("setInvoiceInput", {
					prop: 'invoiceSum',
					value: this.moneyUtil.getCheckMoney(this.invoiceDic.invoiceSum)
				})
			},
			clickShowPick(val) {
				this.$emit("showPick", {
					pickType: val,
					selectType: 'selector'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "../css/invoice-style";
</style>
