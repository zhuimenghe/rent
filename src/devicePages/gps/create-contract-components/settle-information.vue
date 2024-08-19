<template>
	<view class="settle-infomation-bg" v-if="dataDic">
	
		<view class="selector-pick-cell-top">支付约定</view>
		<view class="selector-bg">
			<view v-for="(item,index) in paymentTypeList" :key="index" 
			@click="clickpaymentType(item)" :class="dataDic.paymentType == item.value ? 'tag-class' : 'tag-class-unclick'">
			{{item.label}}
			</view>
		</view>
		<selectorInput
		v-if = "dataDic.paymentType == '3'"
		textType="digit"
		title="预付金额(元)"
		placeholder="0.00"
		:content="dataDic.advance"
		:isRequire="true"
		@textChage="textChage($event,'advance')"
		:isEdit="isEdit"
		/>
		<selectorInput
		v-if = "dataDic.paymentType == '3'&&isShowConfig"
		textType="digit"
		title="已付金额(元)"
		placeholder="0.00"
		:content="dataDic.paidAdvance"
		:isRequire="false"
		@textChage="textChage($event,'paidAdvance')"
		:isEdit="isEdit"
		/>
		<selectorInput
		textType="digit"
		v-if = "dataDic.paymentType == '3'"
		title="欠款金额(元)"
		:isEdit="false"
		:content="dataDic.debtAdvance"
		:isRequire="false"
		/>
		<selectorPick
		title="运费减免约定"
		placeholder="请选择运费减免约定"
		:content="dataDic.renterTripTypeName"
		:isRequire="true"
		@clickItem="showPick('renterTripType')"
		:isEdit="isEdit"
		/>
		<selectorPick
		title="开发票"
		placeholder="请选择发票类型"
		:content="dataDic.invoiceTypeName"
		:isRequire="false"
		@clickItem="showPick('invoiceType')"
		:isEdit="isEdit"
		/>
		<selectorPick
		title="是否需要配备操作人员"
		placeholder="是否需要配备操作人员"
		:content="dataDic.allocateFlag ? '是' : '否'"
		:isRequire="false"
		@clickItem="showPick('allocateFlag')"
		:isEdit="isEdit"
		/>
		<selectorInput
		v-if = "dataDic.allocateFlag"
		textType="digit"
		title="人天单价(元)"
		placeholder="0.00"
		:content="dataDic.allocatePrice"
		:isRequire="false"
		@textChage="textChage($event,'allocatePrice')"
		:isEdit="isEdit"
		/>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
export default {
	components:{
		selectorPick,
		selectorInput
	},
	props:{
		dataDic: {
			type: Object,
			default () {
				return {};
			}
		},
		isEdit:{
			type:Boolean,
			default:true
		},
		isShowConfig:{
			type:Boolean,
			default:true
		}
	},
	data() {
		return {
			placeholder:'',
			prePayWorkInDays:'',
			paymentTypeList:[],//支付约定
		};
	},
	created() {
		this.placeholder = this.$gxfmethod.defaultProjectName();
		this.loadsettlementTypes();//支付约定
	},
	methods: {
		inputClick(e) {
				const o = e.detail.value||'';
				const inputRule = /[^\d]/g
				this.$nextTick(() => {
					this.cargoNo = o.replace(inputRule, '');
					if (this.cargoNo == '') {
						return
					} else {
						//执行对应代码
					}
				})
			},

		prePayChange(val){
			console.log(val,'prePayChange');
			let value=val.detail.value||'';
			this.$emit('prePayChange',value)
		},
		showDayType() {
			if(this.dataDic&&(this.dataDic.paymentType == '2' || this.dataDic.paymentType == '3')){
				return true
			}
			return false
		},
		showDay() {
			if(this.dataDic&&((this.dataDic.paymentType == '2' || this.dataDic.paymentType == '3') && this.dataDic
						.settlementDayType == '2')){
				return true
			}
			return false
		},
		showPick(type){
			this.$emit('clickItem',type);
		},
		textChage(e,type){
			let param = {
				type:type,
				data:e
			}
			this.$emit('textChange',param);
			console.log(1);
		},
		//结算方式payment_type
		loadsettlementTypes() {
			uni.showLoading()
			this.$network.loadType('payment_type').then(result => {
				console.log(result,'loadsettlementTypes');
				this.paymentTypeList = result;
				if(!this.dataDic.paymentType || this.paymentTypeList.length>0){
					this.$emit('clickSelect',this.paymentTypeList[0])
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		clickpaymentType(item){
			if(this.isEdit == false){
				return
			}
			console.log(item,'clickpaymentType');
			this.$emit('clickSelect',item)
		}
	}
};
</script>

<style lang="scss" scoped>
.settle-infomation-bg {
	display: flex;
	flex-direction: column;
	padding:10px;
	background: #ffffff;
}
.prepay{
	display: flex;
	justify-content: space-between;
	flex-wrap: nowrap;
	padding:10px 10px;
	border-bottom: #F0F2F4 1px dotted;
	input{
		width: 30px;
		border: 1px solid #ccc;
		margin-right: 5px;
	}
}
.title-bg {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px;
	border-bottom: #e9e9e9 1px solid;
}
.title-left {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: #222831;
}
.selector-pick-cell-top{
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 10px;
}
.selector-bg{
	position: relative;
	display: flex;
	flex-direction: row;
	background: #FFFFFF;
	padding: 10px;
	border-bottom: #E9E9E9 1px solid;
}
.tag-class{
	font-size: 14px;
	padding: 3px 10px;
	border-radius: 5px;
	border: $uni-color-primary 1px solid;
	margin-right: 10px;
	color: $uni-color-primary;
}
.tag-class-unclick{
	font-size: 14px;
	padding: 3px 10px;
	border-radius: 5px;
	border: #999999 1px solid;
	margin-right: 10px;
	color: #999999;
}
.prepay{
	background-color: #fff !important;
}

</style>
