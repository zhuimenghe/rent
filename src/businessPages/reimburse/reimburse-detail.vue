<template>
	<view class="creat-reimburse-bg">
		<c-nav-bar-apply :business-key="reimburseDic.businessKey">退款详情</c-nav-bar-apply>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>合同名称</text></view>
				<view class="cell-input-view-right" style="color: #E60000;" @click="gotoCDetail(reimburseDic)">
					<text class="input-style"  >{{reimburseDic.customerName || "--"}}-{{reimburseDic.projectName || "--"}}</text>
					<i class="iconfont cellrightImg iconarrow-right"></i>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{reimburseDic.orgName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务负责人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{reimburseDic.customerSalesmanName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>客户名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{reimburseDic.customerName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款收款人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{reimburseDic.contactName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款收款人电话</text></view>
				<view class="cell-input-view-right">
					<view class="input-style"  >
					<labelPhone :value="reimburseDic.phoneNum"/></view>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>设备情况</text></view>
				<view class="cell-input-view-right">
					<view class="cell-input-view-right">
						<text class="input-style">{{reimburseDic.deviceStateName || "--"}}</text>
					</view>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款日期</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{changestr(reimburseDic.refundTime )}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>付款方式</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{reimburseDic.typeName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款账户</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{reimburseDic.bankAccount || "--"}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开户行</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{reimburseDic.openingBank || "--"}}</text>
				</view>
			</view>	
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>退款金额</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>租金</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(reimburseDic.hire) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>运费</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(reimburseDic.carriage) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>押金</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(reimburseDic.deposit) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>索赔</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(reimburseDic.claim) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>其他退款</text><businessTips tipName='reimburse' /></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(reimburseDic.other) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left" style="font-weight: bold;"><text>退款总额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style" style="font-weight: bold;">{{saveTwo(reimburseDic.total )|| "--"}}</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 30px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
			</view>
			<imgupload
			:isupload="false"
			:imgFinishlist='reimburseDic.fileList'
			/>
			<text-label-item
			inputDisabled = "true"
			tagName="备注" 
			:inputValue="reimburseDic.comment"/>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		imgupload,
		labelPhone
	},
	data() {
		return {
			reimburseDic:{
			},
		};
	},
	onLoad(option) {
		this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"退款管理","退款详情");
		let key = option.businessNo;
		this.loaddata(key);
	},
	methods: {
		gotoCDetail(item){
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
			});
		},
		changestr(str){
			this.$datestr.printlog(str)
			if(str == null){
				return "--"
			}
			return str.split(" ")[0];
		},
		saveTwo(num){
			return this.$datestr.doubleFloat(num);
		},
		loaddata(key){
			let url = this.$url.SETTLE_REIMBURSE_DETAIL + key
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.reimburseDic = result
				})
				.catch(err => {
					
				});
		},
	}
};
</script>

<style lang="scss" scoped>
.creat-reimburse-bg {
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
	margin-bottom: 5px;
	background: #FFFFFF;
	border-radius: 10px;
	padding-bottom: 10px;
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
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 10px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.bottom-view{
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	z-index: 100;
}
.bottom-left-view{
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
.bottom-right-view{
	display: flex;
	flex: 1;
    height: 40px;
    border-radius: 20px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #FFFFFF;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
.boldstyle{
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
}
</style>
