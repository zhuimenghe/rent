<template>
	<view class="creat-proceeds-bg">
		<c-nav-bar-apply :business-key="proceedsDic.businessKey">收款详情</c-nav-bar-apply>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>合同名称</text></view>
				<view class="cell-input-view-right" style="color: #E60000;" @click="gotoCDetail(proceedsDic)">
					<text class="input-style"  >{{proceedsDic.customerName || ""}}-{{proceedsDic.projectName || ""}}</text>
					<i class="iconfont cellrightImg iconarrow-right"></i>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{proceedsDic.orgName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务负责人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{proceedsDic.customerSalesmanName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>客户名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{proceedsDic.customerName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>客户联系人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{proceedsDic.contactName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>联系人电话</text></view>
				<view class="cell-input-view-right">
					<view class="input-style"  >
					<labelPhone :value="proceedsDic.phoneNum"/></view>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>收款日期</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{changestr(proceedsDic.receiptDate )}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>收款方式</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{proceedsDic.typeName || ""}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="isShowDefault">
				<view class="cell-input-view-left"><text>租金类型</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{proceedsDic.paymentTypeName || "--"}}</text>
				</view>
			</view>	
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>收款金额</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>租金</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.hire)}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>押金</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.deposit)}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>运费</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.carriage)}}</text>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>索赔</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.claim)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>人工费</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.laborCost)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>逾期应收</text></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.debt)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>代收手续费</text><businessTips tipName='servicefee' /></view>
				<view class="cell-input-view-right">
					<text class="input-style"  >{{saveTwo(proceedsDic.serviceCharge)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text style="font-weight: bold;">收款总额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style" style="font-weight: bold;">{{saveTwo(proceedsDic.total)}}</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg" :style="{'padding-bottom': '0px'}">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
			</view>	
			<imgupload
			:isupload="false"
			:imgFinishlist='proceedsDic.fileList?proceedsDic.fileList:[]'
			/>
			
			<text-label-item
			inputDisabled = "true"
			tagName="备注" 
			:inputValue="proceedsDic.comment||'--'"/>
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
			proceedsDic:{
				fileList:[]
			},
			isclose:true,
			isShowDefault:true
		};
	},
	onLoad(option) {
		this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"收款管理","收款详情");
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if(resData){
			let obj = resData.find(o => o.code === 'tenant_name')
			if (obj) {
				this.isShowDefault = obj.value === 'liangXu' ? false : true
			}
		}
		let key = option.businessNo;
		this.loaddata(key);
	},
	methods: {
		changestr(str){
			this.$datestr.printlog(str)
			if(str == null){
				return ""
			}
			return str.split(" ")[0];
		},
		saveTwo(num){
			return this.$datestr.doubleFloat(num);
		},
		loaddata(key){
			let url = this.$url.SETTLE_PROCEEDS_DETAIL + key
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.proceedsDic = result
				})
				.catch(err => {
					
				});
		},
		gotoCDetail(item){
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.creat-proceeds-bg {
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
	border-radius: 10px;
	padding-bottom: 10px;
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
	color: $uni-text-color;
	font-size: $uni-font-size-base;
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
#translate-arrow {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(-90deg);
	transition: all 0.5s;
}

#translate-arrow-expend {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(90deg);
	transition: all 0.5s;
}
.item-customdetail {
		align-items: center;
		justify-content: flex-end;
}
.boldstyle{
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	margin-top: 10px;
}
</style>
