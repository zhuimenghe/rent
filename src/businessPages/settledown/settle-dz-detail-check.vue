<template>
	<view class="creat-invoice-bg">
		<c-nav-bar-apply :business-key="customDic.businessKey">对账单详情</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm" :businessOwner = "customDic.customerSalesman">
			<view class="sum-view-bg">
				<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
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
						<labelPhone :value="customDic.type ==='1' ? customDic.phoneNum  : settleInfoDic.phoneNum"/></view>
					</view>
				</view>	
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>总计</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="color: #4cd964;" v-if="$datestr.doubleFloat(customDic.total) < 0">{{ $datestr.doubleFloat(customDic.total)}}</text>
						<text class="input-style" style="color: #FF0000;" v-else>{{$datestr.doubleFloat(customDic.total)}}</text>
					</view>
				</view>	
				<view class="cell-input-bottom-view" @click="gotodetail">
					<text>查看详细信息</text>
				</view>	
			</view>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import approveStep from "@/components/workflow/approve-step.vue";
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	components: {
		textLabelItem,
		approveStep,
		labelPhone
	},
	data() {
		return {
			customDic:{},
			settleInfoDic:{},
			itemData:{},
			downloadTask:null
		};
	},
	onLoad(option) {
		this.itemData = JSON.parse(decodeURIComponent(option.item));
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
		dataForm(val) {
			this.customDic = JSON.parse(val);
			if(this.customDic.settleInfoDto){
				if(this.customDic.settleInfoDto.contractReceivableList){
					this.settleInfoDic = this.customDic.settleInfoDto.contractReceivableList[0]
				}
			}	
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
	border-bottom: 1px dotted #F0F2F4;
}
.cell-input-bottom-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: center;
	margin: 20px 10px 20px 10px;
	color:#E60000;
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
