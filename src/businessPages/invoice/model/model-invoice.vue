<template>
	<view>
		<view class="model-container">
			<view class="model-tag"><text>{{modelName}}</text></view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>发票号码</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="invoiceDic.invoiceNo" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入发票号码...':'-'" 
					/>
				</view>
			</view>
			<select-label-item 
			tagName="发票类型" 
			:value="invoiceDic.typeName" 
			:isSelect="isEdit" 
			@clickItemLabel="clickShowPick('invoiceType')"
			:icon="righticon" 
			/>
			<select-label-item 
			tagName="开票日期" 
			hint="请选择开票日期" 
			:value="getDate(invoiceDic.invoiceDate)" 
			:isRequired ='true'
			:icon="dateIcon" 
			:isSelect="isEdit"
			@clickItemLabel="clickShowPick('invoiceDate')" 
			/>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>发票金额</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="number" 
					v-model="invoiceDic.total" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'0.00':'-'"
					@blur="checkMoney"
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>开票收款金额</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="number" 
					v-model="invoiceDic.proceedTotal" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入开票金额':'-'"
					@blur="checkAllMoney"
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>税率（单位%）</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="number" 
					v-model="invoiceDic.tariff" 
					:disabled="!isEdit" 
					:placeholder="isEdit?'请输入税率......':'-'" 
					/>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	export default {
		name: 'modelApply',
		components: {
			selectLabelItem,
			textLabelItem
		},
		props: {
			//传入的数据
			invoiceDic: {
				type: Object,
				default () {
					return {
						invoiceNo:'',
						total:'0',
						tariff:'0'
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
				default: "发票信息"
			},
		},
		watch: {
			'invoiceDic.invoiceNo'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'invoiceNo',
					value: val
				})
			},
			'invoiceDic.total'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'total',
					value: val 
				})
				
			},
			'invoiceDic.tariff'(val) {
				this.$emit("setInvoiceInput", {
					prop: 'tariff',
					value: val
				})
			},
		},
		data() {
			return {
				dateIcon: 'iconzl--rili',
				righticon: 'iconarrow-right',
				invoiceNo: '',
				total: '',
				tariff: ''
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
			clickShowPick(val) {
				this.pickType = val;
				let selectType = 'date'
				switch (this.pickType) {
					case 'invoiceDate':
						selectType = 'date'
						break;
					case 'invoiceType':
						selectType = 'selector'
						break;
					default:
						break;
				}
				this.$emit("showPick", {
					pickType: this.pickType,
					selectType: selectType
				})
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			checkMoney(){
				this.$emit("setInvoiceInput", {
					prop: 'total',
					value: this.moneyUtil.getCheckMoney(this.invoiceDic.total)
				})
			},
			checkAllMoney(){
				this.$emit("setInvoiceInput", {
					prop: 'proceedTotal',
					value: this.moneyUtil.getCheckMoney(this.invoiceDic.proceedTotal)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../css/invoice-style";
</style>
