<template>
	<view class="bg-view">
		<c-nav-bar-apply :business-key="dataDic.businessKey">进退场补录单详情</c-nav-bar-apply>
		<basePart
		:dataDic="dataDic" 
		:isedit="false" 
		/>
		<workinPart
		:dataDic="dataDic.workInDto"
		:isedit="false" 
		:showassgin='showWorkinAssgin'
		/>
		<workoutPart
		:dataDic="dataDic.workOutDto"
		:isedit="false" 
		:showassgin="showWorkOutAssgin"
		/>
		<devicePart
		:dataDic="dataDic"
		:isedit="false"
		v-if="dataDic.orderList&&dataDic.orderList.length > 0"
		/>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
//-----------------
import basePart from './add-record-part/base-part.vue';
import workinPart from './add-record-part/work-in-part.vue';
import workoutPart from './add-record-part/work-out-part.vue';
import devicePart from './add-record-part/device-part.vue';
export default {
	components: {
		wPicker,
		// -------------------
		basePart,
		workinPart,
		workoutPart,
		devicePart,
	},
	data() {
		return {
			dataDic: {
				workInDto:{},
				workOutDto:{}
			},
			itemDic:{},
			showWorkinAssgin:true,
			showWorkOutAssgin:true,
		};
	},
	onLoad(option) {
		this.itemDic = JSON.parse(decodeURIComponent(option.item));
		this.getDetailWithNo(this.itemDic.businessNo)
		this.loadWorkFlow();
	},
	onUnload() {
		
	},
	methods: {
		getDetailWithNo(businessNo){
			uni.showLoading();
			let param = {
				businessNo: businessNo
			};
			let url = this.$url.WORKIN_OUT_DETAIL;
			this.$network.getData(url, 'GET', param).then(result => {
				this.dataDic = {
					...result
				}
				this.getContractInfo(result)
			}).catch(err => {
				uni.hideLoading();
			});		
		},
		// getContractInfo(item){
		// 	let param = {
		// 		businessNo: this.dataDic.contractNo
		// 	};
		// 	this.$network
		// 		.getData(this.$url.CONTRACT_DEATIL_BY_NO, 'GET', param)
		// 		.then(result => {
		// 			let orderList = result.contractDetailDto ? result.contractDetailDto.orderList : [];
		// 			this.resetList(orderList,item)
		// 		}).catch(err => {
		// 			uni.hideLoading();
		// 		});
		// },
		getContractInfo(item){
			let param = {
				contractDetailId: this.dataDic.contractDetailId
			};
			this.$network
				.getData(this.$url.WORK_INOUT_ORDERLIST, 'POST', param)
				.then(result => {
					let orderList = result || [];
					this.resetList(orderList,item)
				}).catch(err => {
					uni.hideLoading();
				});
		},
		resetList(orders,item){
			let machines = item.machines || []
			orders.forEach((e) => {
				let id = e.id;
				let list = [];
				machines.forEach((o) => {
					let contractOrderId = o.contractOrderId;
					if (contractOrderId === id) {
						let dictR = {
							...o,
							workCheckResults: o.workCheckResults || []
						};
						list.push(dictR)
					}
					console.log(JSON.stringify(list))
				})
				e.machineList = [...list];
			})
			this.dataDic = {
				...this.dataDic,
				orderList:orders
			}
		},
		loadWorkFlow(){
			this.workflowcommon.getApplyAllProcessNode('workIn').then((result) => {
				if(result.length>0){
					let fromKeyStr = ""
					result.forEach(o=>{
						fromKeyStr = fromKeyStr + o.formKey
					})
					if(fromKeyStr.indexOf("assignee")==-1){
						this.showWorkinAssgin = false;//assignee
					}
				}
			})
			this.workflowcommon.getApplyAllProcessNode('workOut').then((result) => {
				if(result.length>0){
					let fromKeyStr = ""
					result.forEach(o=>{
						fromKeyStr = fromKeyStr + o.formKey
					})
					if(fromKeyStr.indexOf("assignee")==-1){
						this.showWorkOutAssgin = false;//assignee
					}
				}
			})
		}
	}
};
</script>

<style scoped lang="scss">
.bg-view {
	width: 100%;
	background: $uni-bg-color-grey;
}

.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
}

.bottom-left-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}

.bottom-right-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
