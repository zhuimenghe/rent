<template>
	<view class="creat-proceeds-bg">
		<c-nav-bar-apply :business-key="proceedsDic.businessKey">收款审批</c-nav-bar-apply>
		<approve-step :updateObj='updateObj' :NeedUpdate="true"  :itemData="itemData" @data-form="dataForm" :orgId="proceedsDic.orgId"
			:businessOwner="proceedsDic.customerSalesman">
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view"
					style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
				</view>
				<select-label-item isRequired="true" tagName="合同名称" hint="请选择合同" :value="contractDicName" :icon="righticon"
					@clickItemLabel="gotoContract" />
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ contractDic.orgName || "" }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ contractDic.customerSalesmanName ||
							contractDic.contractDetailDto.customerSalesmanName
							|| "" }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户名称</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ contractDic.customerName || "" }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户联系人</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="text" v-model="proceeder" placeholder="请输入收款款联系人...." />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>联系人电话</text></view>
					<view class="cell-input-view-right">
						<view class="input-style">
							<input class="input-style" type="text" v-model="proceederphone" placeholder="请输入收款联系人电话...." />
						</view>
					</view>
				</view>
				<select-label-item tagName="收款日期" hint="请选择日期" isRequired="true" :value="proceedDate" :icon="dateIcon"
					@clickItemLabel="showCalendar" />
				<select-label-item tagName="收款方式" hint="请选择付款方式" isRequired="true" :value="proceedTypeDic.label"
					:icon="righticon" @clickItemLabel="showdialog('pay')" />

				<select-label-item v-if="isShowDefault" tagName="租金类型" hint="请选择租金类型" isRequired="true"
					:value="rentTypeDic.label" :icon="righticon" @clickItemLabel="showdialog('rent')" />
			</view>
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view"
					style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle"><text>收款金额</text></view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>租金</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="rentmoney" placeholder="请输入租金金额...."
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>押金</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="pledgemoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>运费</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="transmoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>索赔</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="cliammoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>人工费</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="personmoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>逾期应收</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="debtmoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>代收手续费</text>
						<businessTips tipName='servicefee' />
					</view>
					<view class="cell-input-view-right">
						<input class="input-style" type="digit" v-model="servicemoney" placeholder="0.00"
							placeholder-class="placeholder-style" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text style="font-weight: bold;">收款总额</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="font-weight: bold;">{{ total }}</text>
					</view>
				</view>
			</view>
			<view class="sum-view-bg" :style="{'padding-bottom': '0px'}">
				<view class="cell-input-view"
					style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
				</view>
				 <imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" type="proceed_type" uploadType="attachment"
				:imgFinishlist="fileList ? fileList : []" maximg="20" />
				<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="remark" />
			</view>
		</approve-step>
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true"
			:pickControl="true" ref="date" themeColor="#E60000" />
		<w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import processsMixin from './proceedsMixin/index'
import wPicker from '@/components/common/w-picker/w-picker.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import approveStep from "@/components/workflow/approve-step.vue";
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	mixins: [processsMixin],
	components: {
		selectLabelItem,
		textLabelItem,
		imgupload,
		approveStep,
		labelPhone,
		wPicker
	},
	data() {
		return {
			proceedsDic: {
				fileList: []
			},
			isclose: true,
			itemData: {

			},
			isShowDefault: true,
			updateObj:{}
		};
	},
	onLoad(option) {
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (resData) {
			let obj = resData.find(o => o.code === 'tenant_name')
			if (obj) {
				this.isShowDefault = obj.value === 'liangXu' ? false : true
			}
		}
		this.itemData = JSON.parse(decodeURIComponent(option.item));
	},
	methods: {
		checkData() {
				// 校验必填字段
				if (this.contractDicName === "") {
				uni.showToast({
					title: "请选择合同",
					icon: "none"
				})
				return Promise.reject('fail')
			}
				if (this.rentmoney === "") {
				uni.showToast({
					title: "请输入租金",
					icon: "none"
				})
				return Promise.reject('fail')
			}
			if (this.proceedDate === "") {
				uni.showToast({
					title: "请选择收款日期",
					icon: "none"
				})
				return Promise.reject('fail')
			}
			if (this.proceedTypeDic.value == undefined) {
				uni.showToast({
					title: "请选择收款方式",
					icon: "none"
				})
				return Promise.reject('fail')
			}
			if (this.rentTypeDic == undefined) {
				uni.showToast({
					title: "请选择租金类型",
					icon: "none"
				})
				return Promise.reject('fail')
			}
			let contractDetailDto=this.contractDic.contractDetailDto||{};
			this.updateObj={
				...this.updateObj,
				"total": this.$datestr.doubleFloat(this.total),
				"customerId": this.contractDic.customerId,
				"customerName": this.contractDic.customerName || "",
				"orgId": this.contractDic.orgId || "",
				"orgName": this.contractDic.orgName || "",

				"customerSalesman": this.contractDic.customerSalesman||contractDetailDto.customerSalesman || "",
				"customerSalesmanName": this.contractDic.customerSalesmanName||contractDetailDto.customerSalesmanName || "",

				"contactName": this.proceeder,
				"phoneNum": this.proceederphone,
				"contractNo": this.contractDic.contractNo || "",
				"contractDetailId": this.contractDic.contractDetailId||contractDetailDto.id || "",
				"projectName": this.contractDic.projectName||contractDetailDto.projectName || "",

				"receiptDate": this.proceedDate + " 06:00:00",
				"type": this.proceedTypeDic.value,
				"typeName": this.proceedTypeDic.label,
				"comment": this.remark,
				"hire": this.$datestr.doubleFloat(this.rentmoney),
				"paymentType": this.rentTypeDic.value,
				"paymentTypeName": this.rentTypeDic.label,
				"carriage": this.$datestr.doubleFloat(this.transmoney == "" ? '0' : this.transmoney),
				"deposit": this.$datestr.doubleFloat(this.pledgemoney == "" ? '0' : this.pledgemoney),
				"claim": this.$datestr.doubleFloat(this.cliammoney == "" ? '0' : this.cliammoney),
				"laborCost": this.$datestr.doubleFloat(this.personmoney == "" ? '0' : this.personmoney),
				"debt": this.$datestr.doubleFloat(this.debtmoney == "" ? '0' : this.debtmoney),
				"serviceCharge": this.$datestr.doubleFloat(this.servicemoney == "" ? '0' : this.servicemoney),
				"fileList": this.fileList,
			}
			return Promise.resolve('success')
			},
		dataForm(val) {
			this.$datestr.printlog(val)
			this.proceedsDic = JSON.parse(val);
			this.updateObj={
				...this.proceedsDic
			}
			// 合同相关的信息
			this.contractDic = {
				...this.proceedsDic
			};
			this.rentmoney = this.$datestr.doubleFloat(this.contractDic.hire)
			this.proceeder = this.contractDic.contactName || "";
			this.proceedDate = this.proceedsDic.receiptDate?this.proceedsDic.receiptDate.split(" ")[0]:'';
			this.proceederphone = this.contractDic.phoneNum || "";
			this.proceedTypeDic = {
				value: this.contractDic.type,
				label: this.contractDic.typeName
			}
			this.remark = this.proceedsDic.comment||''
			this.personmoney = this.$datestr.doubleFloat(this.contractDic.laborCost);
			this.cliammoney = this.$datestr.doubleFloat(this.contractDic.claim);

			this.debtmoney = this.$datestr.doubleFloat(this.contractDic.debt);

			this.servicemoney = this.$datestr.doubleFloat(this.contractDic.serviceCharge);
			this.transmoney = this.$datestr.doubleFloat(this.contractDic.carriage);
			this.pledgemoney = this.$datestr.doubleFloat(this.contractDic.deposit);
			this.rentTypeDic = {
				value: this.contractDic.paymentType,
				label: this.contractDic.paymentTypeName
			}
			this.fileList = this.proceedsDic.fileList || []

			this.contractDicName = this.proceedsDic.customerName + '-' + this.proceedsDic.projectName;
		},
		changestr(str) {
			this.$datestr.printlog(str)
			if (str == null) {
				return ""
			}
			return str.split(" ")[0];
		},
		saveTwo(num) {
			return this.$datestr.doubleFloat(num);
		},
		gotoCDetail(item) {
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
			});
		},
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
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.input-style {
	flex: 1;
	text-align: right;
	line-height: 16px;
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
	background: #FFFFFF;
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

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	margin-top: 10px;
}
</style>
