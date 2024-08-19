<template>
	<view class="creat-invoice-bg">
		<!-- <c-nav-bar-apply :business-key="customDic.businessKey">结算单详情</c-nav-bar-apply> -->
		<view class="sum-view-bg">
			<view class="cell-input-view" 
			style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;justify-content: space-between;align-items: center;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
				<view style="color: #E60000;font-size: 14px;" @click="goToEsign('start')" v-if="isEnableESigin">启动电签</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>对账单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{customDic.businessNo || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left" v-if="customDic.type !='1'"><text>合同名称</text></view>
				<view class="cell-input-view-left" v-else><text>客户名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style" v-if="customDic.type !='1'">{{settleInfoDic.customerName || ""}} -- {{settleInfoDic.projectName || ""}}</text>
					<text class="input-style"  v-else>{{customDic.customerName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="customDic.type !='1'">
				<view class="cell-input-view-left"><text>合同类型</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{settleInfoDic.contractTypeName}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="customDic.type !='1'">
				<view class="cell-input-view-left"><text>合同单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{settleInfoDic.businessNo || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开始日期</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{changestr(customDic.beginDate)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>结束日期</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{changestr(customDic.endDate)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{customDic.orgName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务负责人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ customDic.type ==='1' ? customDic.customerSalesmanName || "--" : settleInfoDic.customerSalesmanName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>联系人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{customDic.type ==='1' ? customDic.contactName || "--" : settleInfoDic.contactName  || "--"}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>电话</text></view>
				<view class="cell-input-view-right">
					<view class="input-style">
					<labelPhone  :value="customDic.type ==='1' ? customDic.phoneNum: settleInfoDic.phoneNum"/></view>
					
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>总计</text></view>
				<view class="cell-input-view-right">
					<text class="input-style" style="color: #4cd964;" v-if="$datestr.doubleFloat(customDic.total) < 0">{{ $datestr.doubleFloat(customDic.total)}}</text>
					<text class="input-style" style="color: #FF0000;" v-else>{{$datestr.doubleFloat(customDic.total)}}</text>
				</view>
			</view>	
			<view class="cell-input-bottom-view" >
				<view style="flex: 1;text-align: center;" @click="goToEsign('detail')" v-if="customDic.flowId">电签详情</view>
				<view style="flex: 1;text-align: center;" @click="gotodetail">查看详细信息</view>
			</view>	
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	components: {
		textLabelItem,
		labelPhone
	},
	data() {
		return {
			customDic:{},
			settleInfoDic:{},
			itemDict:{},
			downloadTask:null,
			isAddESign: true,
			eSignConfig: '',
			isEnableESigin: false,
			businessNo:""
		};
	},
	onLoad(option) {
		this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"灵活结算","对账单详情");
		let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
		if (ps) {
			this.isAddESign = ps.some(x => x.value === this.$savekey.PERMISSION_STATEMENT_ESIGN_ADD)
		}
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (resData) {
			this.eSignConfig = resData.find(o => o.code === 'esign_start_node')
		    console.log("eSignConfig" + JSON.stringify(this.eSignConfig))
		}
		this.businessNo = option.businessNo;
		this.loaddata(this.businessNo);
		uni.$on('esign-start', obj => {
			this.loaddata(this.businessNo);
		})
	},
	onUnload() {
		if (this.downloadTask) {
			this.downloadTask.abort()
		}
	},
	methods: {
		changestr(str){
			if(!str){
				return "--"
			}
			return str.split(" ")[0];
		}, 
		/**
		 * 是否可以启动电签
		 * @param {Object} signStatus ：电签状态
		 * @param {Object} state 合同状态
		 * @param {Object} eSignConfig 电签配置
		 */
		isStartESignAdd(signStatus, state, eSignConfig) {
			if (this.isAddESign && (!signStatus ||
					// signStatus == '0' ||
					signStatus == '3' ||
					signStatus == '5' ||
					signStatus == '7')) {
				let eSignStartNode = eSignConfig && eSignConfig.value ? eSignConfig.value : null;
				// 1. adopt 合同审批通过后启动。    2.  apply 合同申请后即可启动。
				if (!eSignStartNode || eSignStartNode == "adopt") { //审批完成
					return state != "1" && state != "0" ? true : false;
				} else if (eSignStartNode == "apply") {
					return true
				};
				return false;
			}
			return false;
		},
		loaddata(key){
			let url = this.$url.SETTLE_DZ_DETAIL + key
			this.$network.getData(url, 'GET', null).then(result => {
				this.customDic = result
				this.isEnableESigin = this.isStartESignAdd(this.customDic.signStatus, this.customDic.state, this.eSignConfig);
				if(this.customDic.settleInfoDto){
					if(this.customDic.settleInfoDto.contractReceivableList){
						this.settleInfoDic = this.customDic.settleInfoDto.contractReceivableList[0]
					}
				}	
			}).catch(err => {});
		},
		goToEsign(type) {
			switch (type) {
				case 'start':
					let tenantObj = uni.getStorageSync(this.$savekey.TENANT_DETAIL)
					if (!tenantObj||!tenantObj.esignId) {
						uni.showToast({
							icon: "none",
							title: '当前租户还未开通电签平台，请开通后再配置'
						})
						return;
					}
					this.$gxfmethod.statisticData(this.$eventId.Esign_Administrative,"启动电签","对账单启动电签");
					uni.navigateTo({
						url: '/otherPages/esign/esign-start-process?isStart=true&businessType=statement' +
							"&customerId=" + this.customDic.customerId +
							"&customerName=" + this.customDic.customerName +
							"&customerType=" + this.customDic.customerType +
							"&contactId=" + (this.customDic.type =='1' ? (this.customDic.contactId?this.customDic.contactId:'') : (this.settleInfoDic.contactId?this.settleInfoDic.contactId:'')) +
							'&businessId=' + this.customDic.id +
							'&businessTitle=' + (this.customDic.customerName + '-' + this.getProjectNames()) +
							'&businessNo=' + this.customDic.businessNo +
							'&flowId=' + this.customDic.flowId +
							'&customerSalesman=' + this.customDic.customerSalesman +
							'&customerSalesmanName=' + this.customDic.customerSalesmanName
		
					})
					break;
				case 'detail':
					uni.navigateTo({
						url: '/otherPages/esign/esign-flow-detail?businessType=statement&flowId=' + this.customDic.flowId + '&docId=' +
							this.customDic.docId
					})
					break;
				default:
					break;
			}
		
		},
		getProjectNames() {
			let prosList = this.customDic.settleInfoDto && this.customDic.settleInfoDto.contractReceivableList && this.customDic
				.settleInfoDto.contractReceivableList.length > 0 ? this.customDic.settleInfoDto.contractReceivableList.map(o => {
					return o.projectName
				}) : null;
		
			return prosList ? prosList.join(',') : ''
		},
		gotodetail() {
			uni.showLoading()
			this.$network.rentalPag("statement",()=>{
				this.downM()
			},(msg)=>{
				console.log("失败");
				uni.showToast({
					icon:'none',
					title:msg
				})
			})

		},
		downM(){
			let url = this.$url.BASE_URL + "settleapi/api/statement/export?businessNo=" + this.customDic.businessNo
			let name ="对账单-" + this.customDic.customerName + "-"
			let filename = this.$gxfmethod.getFileName(name)
			this.$gxfmethod.downFunc(url,'GET',undefined,filename)
			
		},
	}
};
</script>

<style lang="scss" scoped>
.creat-invoice-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	margin-bottom: 70px;
	background: #ffffff;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom: 1px dotted $uni-line-color;
}
.cell-input-bottom-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: center;
	margin: 20px 10px 20px 10px;
	color: #E60000;
	font-size: $uni-font-size-lg;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.boldstyle{
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
	line-height: 16px;
}
</style>
