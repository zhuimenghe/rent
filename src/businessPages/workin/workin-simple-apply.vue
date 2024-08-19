<template>
	<view class = "create-workout-bg">
		<c-nav-bar-apply :business-key="dataDic.businessKey">快捷进场详情</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm" :orgId="dataDic.orgId">
			<baseInforMation
			:dataDic='dataDic' 
			:isEdit="false"
			/>
			<deviceInforMation
			:dataDic='dataDic' 
			/>
			<logisticsInforMation
			:dataDic='dataDic' 
			:isEdit="false"
			/>
			<assginInforMation
			:dataDic='dataDic' 
			:isEdit="false"
			/>
			<otherInforMation
			:dataDic='dataDic' 
			:isEdit="false"
			/>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import baseInforMation from './workin-simple/base-information.vue';
import deviceInforMation from './workin-simple/device-information-detail.vue';
import assginInforMation from './workin-simple/assign-information.vue';
import otherInforMation from './workin-simple/other-information.vue';
import approveStep from '@/components/workflow/approve-step.vue';
export default {
	components:{
		baseInforMation,
		assginInforMation,
		otherInforMation,
		deviceInforMation,
		approveStep
	},
	data() {
		return {
			dataDic:{
			},
			isLiangXu:false
		};
	},
	onLoad(option) {
		let LXresData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (LXresData) {
			let liangxuData = LXresData.find(o => o.code === 'tenant_name')
			if (liangxuData) {
				this.isLiangXu = liangxuData.value === 'liangXu' ? true : false
			}
		}
		if(option.item){
			this.itemData = JSON.parse(decodeURIComponent(option.item));
		}
	},
	methods: {
		dataForm(val) {
			let result = JSON.parse(val);
			this.dataDic = {
				...result
			}
		},
		//获取详情
		loadDetailData(businessNo) {
			uni.showLoading();
			let param = {
				businessNo: businessNo,
			};
			let url = this.$url.WORK_IN_DETAIL;
			this.$network.getData(url, 'GET', param).then(result => {
				this.dataDic = {
					...result
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.create-workout-bg{
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
	width: 100%;
	padding: 10px 0px;
}
</style>
