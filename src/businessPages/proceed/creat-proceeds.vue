<template>
	<view class="creat-proceeds-bg">
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view"
				style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<select-label-item isRequired="true" tagName="合同名称" hint="请选择合同" :value="contractDicName" :icon="righticon"
				@clickItemLabel="gotoContract" />
			<view v-show="ischoose">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ contractDic.orgName || "" }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ contractDic.contractDetailDto.customerSalesmanName || "" }}</text>
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
				<view class="cell-input-view-left">
					<text>代收手续费</text>
					<businessTips tipName='servicefee' />
					<!-- <text style="font-size: 12px;color: #999999;">(本项目为扣除金额)</text> -->
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
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
		<!-- 日历 -->
		<!-- <uni-calendar 
		style="z-index: 200;"
		@confirm="confirm" 
		:insert="false" 
		ref="calendar" 
		endDate="enddata"
		/> -->
		<!-- 类型选择 -->
		<w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true"
			:pickControl="true" ref="date" themeColor="#E60000" />

		<alertPopup ref="aletrview" @getAssignList="getAssignList" :mask-click="true" />
		<remarkPopup ref="remarkview" @RemarkSum="remarksum" :mask-click="true" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import wPicker from '@/components/common/w-picker/w-picker.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
import remarkPopup from '@/components/common/uni-popup/remark-pop.vue';
import processsMixin from './proceedsMixin/index'
export default {
	mixins: [processsMixin],
	components: {
		selectLabelItem,
		textLabelItem,
		wPicker,
		imgupload,
		alertPopup,
		remarkPopup
	},
	data() {
		return {
			ischoose: false,//是否选择联系人
			isperson: false,//是否是个人或者企业
			enddata: '',
			choosetype: '',
			businessNo: "",
			backType: -1,
			backDic: {},
			backDicDetail: {},
			isShowDefault: true,
			gps: false
		};
	},
	onLoad(option) {
		if (option.gps) {
			this.gps = true
		}
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (resData) {
			let obj = resData.find(o => o.code === 'tenant_name')
			if (obj) {
				this.isShowDefault = obj.value === 'liangXu' ? false : true
			}
		}
		if (option.backType === "1" || option.backType === "2") {
			//退回1撤回2
			this.backType = Number(option.backType);
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(this.backDic.businessNo)
		} else {
			//正常状态进入
			if (option.item) {
				this.ischoose = true;
				this.contractDic = JSON.parse(decodeURIComponent(option.item))
				this.proceeder = this.contractDic.contractDetailDto.contactName || "";
				this.proceederphone = this.contractDic.contractDetailDto.phoneNum || "";
				this.contractDicName = this.contractDic.customerName + "-" + this.contractDic.contractDetailDto.projectName;
			}
			this.proceedDate = this.$datestr.getnowdate();
			this.getBusinessNo();
		}
		this.enddata = this.$datestr.getnowdate();
	},

	methods: {
		//加载详情数据
		loaddata(key) {
			uni.showLoading();
			let url = this.$url.SETTLE_PROCEEDS_DETAIL + key
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dealData(result)
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
				});
		},
		dealData(result) {
			this.ischoose = true;
			this.businessNo = result.businessNo;
			this.backDicDetail = result;
			this.contractDic = {
				customerId: result.customerId,
				customerName: result.customerName,
				orgId: result.orgId,
				orgName: result.orgName,
				customerId: result.customerId,
				businessNo: result.contractNo,
				contractDetailDto: {
					id: result.contractDetailId,
					projectName: result.projectName,
					customerSalesman: result.customerSalesman,
					customerSalesmanName: result.customerSalesmanName,
					contactName: result.contactName,
					phoneNum: result.phoneNum,
				}
			}
			this.proceeder = this.contractDic.contractDetailDto.contactName || "";
			this.proceederphone = this.contractDic.contractDetailDto.phoneNum || "";
			this.contractDicName = this.contractDic.customerName + "-" + this.contractDic.contractDetailDto.projectName;

			this.proceedDate = this.changestr(result.receiptDate);
			this.proceedTypeDic = {
				value: result.type,
				label: result.typeName
			}

			this.rentmoney = this.$datestr.doubleFloat(result.hire);
			this.rentTypeDic = {
				value: result.paymentType,
				label: result.paymentTypeName
			}
			this.transmoney = this.$datestr.doubleFloat(result.carriage);
			this.pledgemoney = this.$datestr.doubleFloat(result.deposit);

			this.cliammoney = this.$datestr.doubleFloat(result.claim);
			this.personmoney = this.$datestr.doubleFloat(result.laborCost);
			this.debtmoney = this.$datestr.doubleFloat(result.debt);
			this.servicemoney = this.$datestr.doubleFloat(result.serviceCharge);

			this.fileList = result.fileList || []
			this.remark = result.comment

		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		/**
		 * 获取单号
		 */
		getBusinessNo() {
			let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'SK')
			this.$network.getData(url, "GET", null).then((result) => {
				this.businessNo = result;
			}).catch((err) => {

			})
		},

		//日历回调
		// confirm(e) {
		// 	this.proceedDate = e.fulldate
		// },

		//取消按钮
		clickecancle() {
			uni.navigateBack({
				delta: 1
			})
		},
	
		//确定按钮
		clicksave() {
			if (this.contractDicName === "") {
				uni.showToast({
					title: "请选择合同",
					icon: "none"
				})
				return
			}
			if (this.proceederphone != "") {
				if (this.$datestr.isphonenum(this.proceederphone) === false) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					});
					return;
				}
			}
			if (this.proceedDate === "") {
				uni.showToast({
					title: "请选择日期",
					icon: "none"
				})
				return
			}
			if (this.proceedTypeDic.value == undefined) {
				uni.showToast({
					title: "请选择支付方式",
					icon: "none"
				})
				return
			}
			if (this.rentmoney === "") {
				uni.showToast({
					title: "请输入租金",
					icon: "none"
				})
				return
			}
			if (this.rentTypeDic == undefined) {
				uni.showToast({
					title: "请选择租金类型",
					icon: "none"
				})
				return
			}
			this.httprequestData();
		},
		httprequestData() {
			this.workflowcommon.iswf('proceeds').then((iswf) => {
				if (iswf) {
					this.workflowcommon
						.getFirstNodeUser('settleapi', 'proceeds', this.contractDic.orgId, this.contractDic.contractDetailDto.customerSalesman)
						.then(showToast => {
							if (showToast) {
								this.$refs.aletrview.open();
							} else {
								if (this.backType === 1) {
									this.$refs.remarkview.open();
									// this.thoughSaveData([], '');//退回
								} else {
									let assnstr = this.workflowcommon.submitData(false, []);
									this.submitSaveData(assnstr);
								}
							}
						})
						.catch(error => {
							uni.showToast({
								icon: "none",
								title: error.message
							});
						});
				} else {
					if (this.backType === 1) {
						//退回
						this.$refs.remarkview.open();
						// this.thoughSaveData([], '');
					} else {
						this.submitSaveData("");
					}
				}
			})
		},
		//弹窗提示返回
		getAssignList(val) {
			let alist = val.selectArr;
			if (this.backType === 1) {
				let asList = alist.map(o => {
					return o.id
				})
				//退回
				let remark = val.remark || ""
				this.thoughSaveData(asList, remark);
			} else {
				let assnstr = this.workflowcommon.submitData(true, alist);
				this.submitSaveData(assnstr);
			}
		},
		remarksum(val) {
			this.thoughSaveData([], val.remark);//退回
		},
		submitSaveData(val) {
			let savedic = {
				...this.backDicDetail,
				"businessNo": this.businessNo,
				"customerId": this.contractDic.customerId,
				"customerName": this.contractDic.customerName || "",
				"orgId": this.contractDic.orgId || "",
				"orgName": this.contractDic.orgName || "",

				"customerSalesman": this.contractDic.contractDetailDto.customerSalesman || "",
				"customerSalesmanName": this.contractDic.contractDetailDto.customerSalesmanName || "",

				"contactName": this.proceeder,
				"phoneNum": this.proceederphone,

				"contractNo": this.contractDic.businessNo || "",
				"contractDetailId": this.contractDic.contractDetailDto.id || "",
				"projectName": this.contractDic.contractDetailDto.projectName || "",

				"receiptDate": this.proceedDate + " 06:00:00",
				"type": this.proceedTypeDic.value,
				"typeName": this.proceedTypeDic.label,
				"comment": this.remark,

				"hire": this.$datestr.doubleFloat(this.rentmoney),
				"paymentType": this.rentTypeDic.value,
				"carriage": this.$datestr.doubleFloat(this.transmoney == "" ? '0' : this.transmoney),
				"deposit": this.$datestr.doubleFloat(this.pledgemoney == "" ? '0' : this.pledgemoney),
				"claim": this.$datestr.doubleFloat(this.cliammoney == "" ? '0' : this.cliammoney),
				"laborCost": this.$datestr.doubleFloat(this.personmoney == "" ? '0' : this.personmoney),
				"debt": this.$datestr.doubleFloat(this.debtmoney == "" ? '0' : this.debtmoney),
				"serviceCharge": this.$datestr.doubleFloat(this.servicemoney == "" ? '0' : this.servicemoney),

				"total": this.$datestr.doubleFloat(this.total),
				"fileList": this.fileList,
			}
			let url = this.$url.SETTLE_PROCEEDS_CREAT + val;
			this.$network
				.getData(url, 'POST', savedic,{showLoading:true})
				.then(result => {
					uni.$emit('refresh-contract-list', {
						type: "proceed"
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					if (this.gps) {
						uni.switchTab({
							url: "/pages/main/business",
						});

					} else {
						uni.navigateBack({
							animationDuration: 200
						});
					}

				})
		},
		thoughSaveData(val, inputstr) {
			uni.showLoading({
				mask: true
			});
			let savedic = {
				...this.backDicDetail,
				"businessNo": this.businessNo,
				"customerId": this.contractDic.customerId,
				"customerName": this.contractDic.customerName || "",
				"orgId": this.contractDic.orgId || "",
				"orgName": this.contractDic.orgName || "",

				"customerSalesman": this.contractDic.contractDetailDto.customerSalesman || "",
				"customerSalesmanName": this.contractDic.contractDetailDto.customerSalesmanName || "",

				"contactName": this.proceeder,
				"phoneNum": this.proceederphone,

				"contractNo": this.contractDic.businessNo || "",
				"contractDetailId": this.contractDic.contractDetailDto.id || "",
				"projectName": this.contractDic.contractDetailDto.projectName || "",

				"receiptDate": this.proceedDate + " 06:00:00",
				"type": this.proceedTypeDic.value,
				"typeName": this.proceedTypeDic.label,
				"comment": this.remark,

				"hire": this.$datestr.doubleFloat(this.rentmoney),
				"paymentType": this.rentTypeDic.value,
				"carriage": this.$datestr.doubleFloat(this.transmoney == "" ? '0' : this.transmoney),
				"deposit": this.$datestr.doubleFloat(this.pledgemoney == "" ? '0' : this.pledgemoney),
				"claim": this.$datestr.doubleFloat(this.cliammoney == "" ? '0' : this.cliammoney),
				"laborCost": this.$datestr.doubleFloat(this.personmoney == "" ? '0' : this.personmoney),
				"debt": this.$datestr.doubleFloat(this.debtmoney == "" ? '0' : this.debtmoney),
				"serviceCharge": this.$datestr.doubleFloat(this.servicemoney == "" ? '0' : this.servicemoney),

				"total": this.$datestr.doubleFloat(this.total),
				"fileList": this.fileList,
			}
			let jsonstr = JSON.stringify(savedic);
			this.workflowcommon
				.passapply('settleapi', val, inputstr, jsonstr, this.backDic.procDefId, this.backDic.procInstId, this.backDic
					.id)
				.then(showToast => {
					uni.$emit("refresh-notification-list", {
						type: 'wait'
					})
					uni.$emit('refresh-contract-list', {
						type: "proceed"
					});
					uni.navigateBack({
						animationDuration: 100
					});
					uni.hideLoading();
				})
				.catch(error => {
					uni.showToast({
						icon: "none",
						title: error.message
					});
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
	font-size: $uni-font-size-base;
	color: $uni-text-color;
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
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	margin-top: 10px;
}
</style>
