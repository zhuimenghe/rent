<template>
	<view class="base-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{ '物流信息' }}</view>
		</view>
		<selectorPick
		title="物流类型"
		placeholder="请选择物流类型"
		:content="dataDic.logisticsTypeName"
		:isRequire="true"
		:isEdit="isEdit"
		@clickItem="showPick('logisticsType')"
		/>
		<view style="display: flex;flex-direction: column;" v-if="dataDic.logisticsType=='2'">
			<selectorPick
			title="物流公司"
			placeholder="请选择物流公司"
			:content="dataDic.logisticsCompanyName"
			:isRequire="true"
			:isEdit="isEdit"
			@clickItem="showPick('logisticsCompany')"
			/>
			<selectorInput
			title="物流联系人"
			placeholder="请输入联系人"
			:content="dataDic.logisticsContact"
			:isRequire="true"
			:isEdit="isEdit"
			@textChage="textChage($event,'logisticsContact')"
			/>
			<selectorInput
			title="物流联系人电话"
			placeholder="请输入联系人电话"
			:content="dataDic.logisticsPhone"
			:isRequire="true"
			:isEdit="isEdit"
			@textChage="textChage($event,'logisticsPhone')"
			/>
		</view>
		<view style="display: flex;flex-direction: column;" v-if="dataDic.logisticsType=='3'">
			<selectorPick
			title="物流车辆"
			placeholder="请选择物流车辆"
			:content="getVehicleName(dataDic)"
			:isRequire="true"
			:isEdit="isEdit"
			@clickItem="showPick('transportMachine')"
			/>
			<selectorPick
			title="物流司机"
			placeholder="请选择物流司机"
			:content="getDriverName(dataDic)"
			:isRequire="true"
			:isEdit="isEdit"
			@clickItem="showPick('transportDriver')"
			/>
		</view>
		<selectorInput
		v-if="dataDic.logisticsType!='1'"
		title="物流费用(元)"
		placeholder="0.00"
		:content="dataDic.logisticsCarriage"
		:isRequire="true"
		:isEdit="isEdit"
		@textChage="textChage($event,'logisticsCarriage')"
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
		getVehicleName(dict) {
			let names = dict && dict.transportMachine ? dict.transportMachine.map(o => {
				return o.licenseId
			}) : []
			let vName = names.join(',');
			return vName
		},
		getDriverName(dict) {
			let names = dict && dict.transportDriver ? dict.transportDriver.map(o => {
				return o.name
			}) : []
			let dName = names.join(',');
			return dName
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
