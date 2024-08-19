<template>
	<view class = "create-workout-bg">
		<c-nav-bar-apply :business-key="dataDic.businessKey">快捷进场详情</c-nav-bar-apply>
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
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import baseInforMation from './workin-simple/base-information.vue';
import deviceInforMation from './workin-simple/device-information-detail.vue';
import assginInforMation from './workin-simple/assign-information.vue';
import otherInforMation from './workin-simple/other-information.vue';
export default {
	components:{
		baseInforMation,
		assginInforMation,
		otherInforMation,
		deviceInforMation
	},
	data() {
		return {
			dataDic:{
			},
			isLiangXu:false
		};
	},
	onLoad(option) {
		this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute,"进场管理","进场单详情");
		let LXresData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (LXresData) {
			let liangxuData = LXresData.find(o => o.code === 'tenant_name')
			if (liangxuData) {
				this.isLiangXu = liangxuData.value === 'liangXu' ? true : false
			}
		}
		if(option.businessNo){
			this.loadDetailData(option.businessNo);
		}
	},
	methods: {
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
