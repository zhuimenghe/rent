<template>
	<view class = "create-contract-bg">
		<approve-step :itemData="itemData" @data-form="getBackData" :orgId="mesDic.orgId">
		   <baseInforMation
		   :dataDic='dataDic' 
		   :isEdit="false"
		   />
		   <deviceInforMationD
		   :dataDic='dataDic' 
		   :isEdit="false"
		   contractType="3"
		   listKey="expressList"
		   />
		   <settleInforMation 
		   :dataDic='dataDic' 
		   :isEdit="false"
		   />
		   <projectInforMation
		   :dataDic='dataDic' 
		   :isEdit="false"
		   />
		   <supplementInforMation
		   :dataDic='dataDic' 
		   :isEdit="false"
		   />
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import approveStep from '@/components/workflow/approve-step.vue';
import baseInforMation from './create-contract-components/base-information.vue';
import deviceInforMationD from './create-contract-components/device-information-detail.vue';
import settleInforMation from './create-contract-components/settle-information.vue';
import projectInforMation from './create-contract-components/project-information.vue';
import supplementInforMation from './create-contract-components/supplement-information.vue';
import calRent from '@/common/util/cal-rent-money.js';
export default {
	components:{
		approveStep,
		baseInforMation,
		deviceInforMationD,
		settleInforMation,
		projectInforMation,
		supplementInforMation
	},
	data() {
		return {
			mesDic:{},
			dataDic:{},
			itemData:null,//退回null
		};
	},
	onLoad(option) {
		if(option.item){
			this.itemData = JSON.parse(decodeURIComponent(option.item))
		}
	},
	methods: {
		//提交
		getBackData(val){
			this.mesDic = JSON.parse(val)
			let contractDetailDtoDic = this.mesDic.contractDetailDto?this.mesDic.contractDetailDto:{}
			let expressList = contractDetailDtoDic.expressList?contractDetailDtoDic.expressList:[];
			let newexpressList = expressList.map(o=>{
				let param = calRent.getTenancysWithSmple(o);
				return {
					...o,
					whole:param.whole,
					surplusDay:param.surplusDay,
				}
			});
			this.dataDic = {
				...this.dataDic,
				...this.mesDic, 
				...contractDetailDtoDic,
				expressList:newexpressList,
			}
			console.log(JSON.stringify(this.dataDic.expressList))
			this.calTotal()
		},
		calTotal(){
			let totalMoney = 0;
			this.dataDic.expressList.forEach(o => {
				let itemTotal = parseFloat(o.total);
				totalMoney += itemTotal;
			});
			this.dataDic = {
				...this.dataDic,
				totalMoney : totalMoney.toFixed(2).toString()
			}
		},
	}
};
</script>

<style lang="scss" scoped>
.create-contract-bg{
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
	width: 100%;
	padding: 10px 0px;
}
</style>
