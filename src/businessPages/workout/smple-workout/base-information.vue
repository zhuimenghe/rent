<template>
	<view class="base-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{ '基本信息' }}</view>
		</view>
		<selectorPick
		title="退场单号"
		:isEdit="false"
		:content="dataDic.businessNo"
		:isRequire="true"
		@clickItem="showPick('customer')"
		/>
		<selectorPick
		title="合同名称"
		placeholder="请选择合同"
		:content="getContractName(dataDic)"
		:isRequire="true"
		@clickItem="showPick('contract')"
		/>
		<selectorPick
		:isRequire="false"
		:isEdit="false"
		title="联系人"
		:content="dataDic.contactName"
		/>
		<selectorPick
		v-if="dataDic.customerId&&dataDic.customerId!=''"
		:isRequire="false"
		:isEdit="false"
		title="手机号"
		:content="dataDic.phoneNum"
		type="phone"
		/>
		<selectorPick
		title="区域"
		:isEdit="false"
		:content="dataDic.orgName"
		:isRequire="true"
		@clickItem="showPick('org')"
		/>
		<selectorPick
		title="业务负责人"
		:isEdit="false"
		:content="dataDic.customerSalesmanName"
		:isRequire="true"
		@clickItem="showPick('ssn')"
		/>
		<selectorInputIcon
		title="地点"
		placeholder="请输入地点"
		:content="dataDic.deliveryPlace"
		:isRequire="false"
		:isEdit="isEdit"
		@iconClick="gotoMap"
		@textChage="textChage($event,'deliveryPlace')"
		/>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorInputIcon from '@/components/common/selector-pick/selector-inputwithicon.vue';
export default {
	components:{
		selectorPick,
		selectorInput,
		selectorInputIcon
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
		}
	},
	data() {
		return {
			
		};
	},
	created() {
		
	},
	methods: {
		showPick(type){
			if(type == "contract" && !this.isEdit){
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.dataDic.contractNo
				});
			}
			this.$emit('clickItem',type);
		},
		textChage(e,type){
			let param = {
				type:type,
				data:e
			}
			this.$emit('textChange',param);
		},
		gotoMap(){
			if(!this.isEdit){
				return
			}
			let addrObj = {
				address: this.dataDic.deliveryPlace ? this.dataDic.deliveryPlace : '',
				latitude: this.dataDic.latitude ? this.dataDic.latitude : '',
				longitude: this.dataDic.longitude ? this.dataDic.longitude : '',
				currentRadius: this.dataDic.radius ? this.dataDic.radius : ''
			};
			uni.navigateTo({
				url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(addrObj) + '&showfence=false'
			});
		},
		getContractName(item){
			return item.customerName + "-" + item.projectName
		}
	}
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding:10px;
	background: #ffffff;
	border-radius: 10px;
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
</style>
