<template>
	<view class="base-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{ '基本信息' }}</view>
		</view>
		<selectorPick
		title="进场单号"
		:isEdit="false"
		:content="dataDic.businessNo"
		:isRequire="true"
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
		placeholder="请输入交机地点"
		:content="dataDic.deliveryPlace"
		:isRequire="false"
		:isEdit="isEdit"
		@iconClick="gotoMap"
		@textChage="textChage($event,'deliveryPlace')"
		/>
		<!-- <selectorPick
		title="交机时间"
		placeholder="请选择交机时间"
		:content="changeStr(dataDic.beginDate)"
		:isRequire="true"
		@clickItem="showPick('beginDate')"
		:isEdit="isEdit"
		/> -->
		<selectorPick
		title="启用时间"
		placeholder="请选择启用时间"
		:content="getSimdate(dataDic.enableDate)"
		:isRequire="true"
		@clickItem="showPick('enableDate')"
		:isEdit="isEdit"
		/>
		<!-- <selectorPick
		title="出库时间"
		placeholder="请选择出库时间"
		:content="getSimdate(dataDic.outStoreDate)"
		:isRequire="true"
		@clickItem="showPick('outStoreDate')"
		:isEdit="isEdit"
		/> -->
		<view class="cell-slider-row">
			<view class="cell-slider-row-left">{{'是否安排人员培训'}}</view>
			<view class="cell-slider-row-right">
				<switch 
				class="switch-css"
				:disabled="!isEdit" 
				color="#E60000" 
				:checked="dataDic.training"
				@change="showPick('training')" 
				/>
			</view>
		</view>
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
		changeStr(str){
			if(str == null){
				return this.isEdit ? "" :'--'
			}
			return this.$dateUtil.timeFormatYMDHM(str)
		},
		getSimdate(str){
			if (str == null) {
				return this.isEdit ? "" :'--'
			}
			return str.split(' ')[0];
		},
		showPick(type){
			if(type == "contract"){
				if (this.isEdit === false) {
					uni.navigateTo({
						url: '/contractPages/contract/contract-detail?businessNo=' + this.dataDic.contractNo
					});
					return
				}
				let url = '/businessPages/invoice/contract-choose?type=workIn&state=5,6,7,8&contractType=3';
				uni.navigateTo({
					url: url
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
.cell-slider-row{
	position: relative;
	display: flex;
	flex-direction: row;
	background: #FFFFFF;
	padding: 10px;
	border-bottom: #F0F2F4 1px solid;
}
.cell-slider-row-left {
	display: flex;
	min-width: 60px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-slider-row-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
}
.switch-css{
	transform: scale(0.7);
}
</style>
