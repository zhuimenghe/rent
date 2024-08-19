<template>
	<view class="creat-invoice-bg">
		<c-nav-bar-apply :business-key="businessKey">发票详情</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm" :businessOwner = "customDic.customerSalesman">
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>客户信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>客户名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{customDic.customerName || ""}}</text>
				</view>
			</view>
			<!-- <view> -->
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{customDic.orgName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text></view>
					<view class="cell-input-view-right">
						<text class="input-style"  >{{customDic.customerSalesmanName || ""}}</text>
					</view>
				</view>
				<!-- <view v-show="customDic.customerType == '1'"> -->
				<!-- <view> -->
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>地址</text></view>
						<view class="cell-input-view-right">
							<text class="input-style"  >{{customDic.address || ""}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>开户行</text></view>
						<view class="cell-input-view-right">
							<text class="input-style"  >{{customDic.openingBank || ""}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>银行账号</text></view>
						<view class="cell-input-view-right">
							<text class="input-style"  >{{customDic.bankAccount || ""}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>识别号</text></view>
						<view class="cell-input-view-right">
							<text class="input-style"  >{{customDic.taxNumber || ""}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>电话</text></view>
						<view class="cell-input-view-right">
							<view class="input-style"  >
							<labelPhone :value="customDic.phoneNum" /></view>
						</view>
					</view>
				<!-- </view> -->
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>合同名称</text></view>
					<view class="cell-input-view-right">
						<text class="input-style"  v-if="customDic.contractNo != ''">{{customDic.customerName || ""}}-{{customDic.projectName || ""}}</text>
					    <text class="input-style"  v-else>--</text>					
						</view>
				</view>
			<!-- </view> -->
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>发票信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>发票编号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{customDic.invoiceNo || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开票日期</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{changestr(customDic.invoiceDate)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>发票类型</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{customDic.typeName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>金额(含税)</text></text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(customDic.total)}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>税率(%)</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{customDic.tariff}}</text>
				</view>
			</view>
			<imgupload
			:isupload="false"
			:imgFinishlist='customDic.fileList'/>
			
			<text-label-item
			tagName="备注" 
			inputDisabled = "true"
			:inputValue="customDic.comment"/>
		</view>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
import approveStep from "@/components/workflow/approve-step.vue";
import labelPhone from '@/components/common/common-ui/label-phone.vue';

export default {
	components: {
		textLabelItem,
		imgupload,
		approveStep,
		labelPhone
	},
	data() {
		return {
			customDic:{},
			itemData:{},
			isshow:false
		};
	},
	onLoad(option) {
		// JSON.parse(decodeURIComponent(options.item));
		this.itemData = JSON.parse(decodeURIComponent(option.item));
	},
	methods: {
		changestr(str){
			if(str == null){
				return ""
			}
			return str.split(" ")[0];
		},
		saveTwo(num){
			return this.$datestr.doubleFloat(num);
		},
		calctotal(num){
			if(num == undefined){
				return ""
			}
			let fixednum = Number(num)
			return fixednum.toString();
		},
		dataForm(val) {
			this.$datestr.printlog(val)
			this.customDic = JSON.parse(val);
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
	margin: 10px;
	font-size: $uni-font-size-base;
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
