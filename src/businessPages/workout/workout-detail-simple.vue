<template>
	<view class = "create-workout-bg"  v-if="isLoaded">
		<c-nav-bar-apply :business-key="dataDic.businessKey">快捷退场详情</c-nav-bar-apply>
		<baseInforMation
		:dataDic='dataDic' 
		:isEdit="false"
		/>
		<localeInforMation
		:dataDic='dataDic' 
		:isEdit="false"
		:isLX="isLiangXu"
		/>
		<!-- <logisticsInforMation
		:dataDic='dataDic' 
		:isEdit="false"
		/> -->
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
import baseInforMation from './smple-workout/base-information.vue';
import localeInforMation from './smple-workout/locale-information.vue';
import logisticsInforMation from './smple-workout/logistics-information.vue';
import assginInforMation from './smple-workout/assign-information.vue';
import otherInforMation from './smple-workout/other-information.vue';
export default {
	components:{
		baseInforMation,
		logisticsInforMation,
		assginInforMation,
		otherInforMation,
		localeInforMation
	},
	data() {
		return {
			dataDic:{
			},
			isLiangXu:false,
			isLoaded:false
		};
	},
	onLoad(option) {
		this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute,"退场管理","退场单详情");
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
			let url = this.$url.WORK_OUT_DETAIL;
			this.$network.getData(url, 'GET', param).then(result => {
				this.isLoaded = true
				let orderResult = result.orders || [];
				let machineresult = result.machines || []
				this.resetDeviceData(orderResult,machineresult,result);
				uni.hideLoading();
			}).catch(err => {
				this.isLoaded = true
				uni.hideLoading();
			});
		},
		resetDeviceData(orderResult,machineresult,result){
			if(machineresult.length>0){
				let orders = [];
				orderResult.forEach((e) => {
					let idstr = e.id;
					let list = [];
					machineresult.forEach((o) => {
						let contractOrderId = o.contractOrderId;
						if (contractOrderId == idstr) {
							let dictR = {
								...o,
							};
							list.push(dictR)
						}
					})
					let newdict = {
						...e,
						machineList:[...list]
					}
					orders.push(newdict)
				})
				this.dataDic = {
					...this.dataDic,
					...result,
					orders:[...orders]
				}
			}else{
				this.dataDic = {
					...this.dataDic,
					...result,
					orders:[...orderResult]
				}
			}
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
