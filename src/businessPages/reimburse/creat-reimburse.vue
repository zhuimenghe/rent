<template>
<view class="creat-reimburse-bg">
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款单号</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{reimburseDic.businessNo || ""}}</text>
				</view>
			</view>
			<select-label-item
			    isRequired="true"
				tagName="合同名称"
				hint="请选择合同"
				:value="contractDicName"
				:icon="righticon"
				@clickItemLabel="gotoContract"
			/>
			<view v-if="ischoose" style="display: flex;flex-direction: column;">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{reimburseDic.orgName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style"  >{{reimburseDic.customerSalesmanName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户名称</text><text style="color: #FF0000;">*</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{reimburseDic.customerName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>退款收款人</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" 
						type="text"
						v-model="reimburseDic.contactName" 
						placeholder="请输入退款收款人...."
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>退款收款人电话</text></view>
					<view class="cell-input-view-right">
						<input class="input-style"
						type="text"
						v-model="reimburseDic.phoneNum" 
						placeholder="请输入退款联系人...." 
						/>
					</view>
				</view>
				<select-label-item
					tagName="设备情况"
					hint="请选择设备情况"
					isRequired="true"
					:value="reimburseDic.deviceStateName"
					:icon="righticon"
					@clickItemLabel="showdialog('device')"
				/>	
			</view>
			<select-label-item
				tagName="退款日期"
				hint="请选择日期"
				isRequired="true"
				:value="changestr(reimburseDic.refundTime)"
				:icon="dateIcon"
				@clickItemLabel="showCalendar"
			/>	
			<select-label-item
				tagName="付款方式"
				hint="请选择付款方式"
				isRequired="true"
				:value="reimburseDic.typeName"
				:icon="righticon"
				@clickItemLabel="showdialog('pay')"
			/>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>退款账户</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="reimburseDic.bankAccount" 
					placeholder="请输入退款账户...." />
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开户行</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="reimburseDic.openingBank" 
					placeholder="请输入开户行...." />
				</view>
			</view>	
		</view>
		<view class="sum-view-bg" v-if="ischoose"  style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>退款金额</text></view>
			</view>
			
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>租金</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="reimburseDic.hire" 
					placeholder="0.00" 
					@input="textChange($event,'hire')"
					/>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>运费</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="reimburseDic.carriage" 
					placeholder="0.00" 
					@input="textChange($event,'carriage')"
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>押金</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="reimburseDic.deposit" 
					placeholder="0.00" 
					@input="textChange($event,'deposit')"
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>索赔</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="reimburseDic.claim" 
					placeholder="0.00" 
					@input="textChange($event,'claim')"
					/>
				</view>
			</view>	
				
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>其他退款</text><businessTips tipName='reimburse' /></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="reimburseDic.other" 
					placeholder="0.00" 
					@input="textChange($event,'other')"
					/>
				</view>
			</view>	
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text style="font-weight: bold;">退款总额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style" style="font-weight: bold;">{{reimburseDic.total}}</text>
				</view>
			</view>
			<!-- <imgupload
			@uploadfinish="uploadfinish" 
			@deleteUrl="deleteUrl"
			type="refund_type" 
			uploadType="attachment"
			maximg="20"
			:imgFinishlist="reimburseDic.fileList"
			/>
			<text-label-item
			tagName="备注" 
			placeholder="请输入备注信息..." 
			@ipnuttext="remarkmethod"
			:inputValue="reimburseDic.comment"
			/> -->
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
			</view>
			<imgupload
			@uploadfinish="uploadfinish" 
			@deleteUrl="deleteUrl"
			type="refund_type" 
			uploadType="attachment"
			maximg="20"
			:imgFinishlist="reimburseDic.fileList"
			/>
			<text-label-item
			tagName="备注" 
			placeholder="请输入备注信息..." 
			@ipnuttext="remarkmethod"
			:inputValue="reimburseDic.comment"
			/>
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
		<w-picker 
		:selectList="selectList" 
		@confirm="dialog" 
		mode="selector" 
		ref="selector"
		themeColor="#E60000" 
		/>
		
		<w-picker
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="true" 
		:pickControl="true" 
		ref="date" 
		themeColor="#E60000" 
		/>
		<alertPopup 
		ref="aletrview" 
		@getAssignList="getAssignList" 
		:mask-click="true" 
		/>
		<remarkPopup
		ref="remarkview" 
		@RemarkSum="remarksum" 
		:mask-click="true" 
		/>
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
export default {
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
			dateIcon:"iconzl--rili",
			companyicon:"iconiconzhengli_zuzhijiagou",
			righticon:"iconarrow-right",
			ischoose:false,//是否选择合同
			backType:-1,
			backDic:{},
			reimburseDic:{
				total:'0.00'
			},
			contractDicName:"",
			selectList:[],//发票列表
			typeList:[],
			selectType:'',
			deviceList:[{
				value:'1',
				label:'已退回'
			},{
				value:'2',
				label:'未退回'
			}],
			isLoading:false
		};
	},
	onLoad(option) {
		console.log(option.backType,'option.backType');
		if(option.backType === "1" || option.backType === "2"){
			//退回1撤回2
			this.backType = Number(option.backType);
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(this.backDic.businessNo)
		}else{
			if(option.item){
				this.ischoose = true;
				let contractDic = JSON.parse(decodeURIComponent(option.item));;
				this.reimburseDic = {
					...this.reimburseDic,
					customerId:contractDic.customerId || "",
					customerName:contractDic.customerName || "",
					orgId:contractDic.orgId || "",
					orgName:contractDic.orgName || "",
					customerSalesman:contractDic.contractDetailDto.customerSalesman  || "",
					customerSalesmanName:contractDic.contractDetailDto.customerSalesmanName || "",
					contactName:contractDic.contractDetailDto.contactName || "",
					phoneNum:contractDic.contractDetailDto.phoneNum || "",
					contractNo:contractDic.businessNo || "",
					contractDetailId:contractDic.contractDetailDto.id || "",
					projectName:contractDic.contractDetailDto.projectName || ""
				};
				this.contractDicName = contractDic.customerName + "-" + contractDic.contractDetailDto.projectName;
			}
			this.reimburseDic = {
				...this.reimburseDic,
				"refundTime": this.$datestr.getnowdate() + " 06:00:00",
			}
			this.getBusinessNo();
			this.getSettleMsg();
			this.getCustomerMsg();
		}
		uni.$on('choose-contract-emit', usnerinfo => {
			this.ischoose = true;
			let contractDic = usnerinfo.dict;
			this.reimburseDic = {
				...this.reimburseDic,
				customerId:contractDic.customerId || "",
				customerName:contractDic.customerName || "",
				orgId:contractDic.orgId || "",
				orgName:contractDic.orgName || "",
				customerSalesman:contractDic.contractDetailDto.customerSalesman  || "",
				customerSalesmanName:contractDic.contractDetailDto.customerSalesmanName || "",
				contactName:contractDic.contractDetailDto.contactName || "",
				phoneNum:contractDic.contractDetailDto.phoneNum || "",
				contractNo:contractDic.businessNo || "",
				contractDetailId:contractDic.contractDetailDto.id || "",
				projectName:contractDic.contractDetailDto.projectName || ""
			};
			this.contractDicName = contractDic.customerName + "-" + contractDic.contractDetailDto.projectName;
			this.getCustomerMsg();
			this.getSettleMsg();
		});
		this.loadInvoiceType();
		this.loadDeviceType()
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-contract-emit');
	},
	methods: {
		/**
		 * 获取单号
		 */
		getBusinessNo() {
			let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'TK')
			this.$network.getData(url, "GET", null).then((result) => {
				this.reimburseDic = {
					...this.reimburseDic,
					businessNo:result
				};
			}).catch((err) => {
		
			})
		},
		getSettleMsg(){
			// LINKMAN_GET_CUSTOMERMSG
			let url = this.$url.CONTRACT_TOTAL + this.reimburseDic.contractNo;
			this.$network.getData(url, "GET", null).then((result) => {
				let total = result && result.total ? parseFloat(result.total) : 0;
				this.reimburseDic.hire = total >= 0 ? '' : Math.abs(total).toString();
				this.reimburseDic = {
					...this.reimburseDic,
					total:this.sumAllMoney().toString()
				}
				console.log(JSON.stringify(this.reimburseDic))
			}).catch((err) => {})
		},
		getCustomerMsg(){
			// LINKMAN_GET_CUSTOMERMSG
			let url = this.$url.LINKMAN_GET_CUSTOMERMSG + this.reimburseDic.customerId
			this.$network.getData(url, "GET", null).then((result) => {
				this.reimburseDic = {
					...this.reimburseDic,
					"bankAccount": result.bankAccount || '',
					"openingBank":result.openingBank || ''
				}
			}).catch((err) => {})
		},
		//获取详情
		loaddata(key){
			uni.showLoading()
			let url = this.$url.SETTLE_REIMBURSE_DETAIL + key
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.reimburseDic = {
						...result
					}
					this.ischoose = true;
					this.contractDicName = this.reimburseDic.customerName + "-" + this.reimburseDic.projectName;
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
				});
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//加载发票类型
		loadInvoiceType(){
			uni.showLoading();
			this.$network.loadType('pay_type')
				.then(result => {
					this.typeList = result;
					if(this.typeList&&this.typeList.length>0&&!this.reimburseDic.type){
						this.reimburseDic = {
							...this.reimburseDic,
							"type": this.typeList[0].value,
							"typeName": this.typeList[0].label,
						}
						
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
			});
		},
		loadDeviceType() {
			uni.showLoading();
			this.$network.loadType('reimburse_device_type')
				.then(result => {
					this.deviceList = result;
					if(this.deviceList&&this.deviceList.length>0&&!this.reimburseDic.deviceState){
						this.reimburseDic = {
							...this.reimburseDic,
							"deviceState": this.deviceList[0].value,
							"deviceStateName": this.deviceList[0].label,
						}
						
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//输入框
		textChange(e,type){
			let val = e.detail? e.detail.value : ""
			this.reimburseDic[type] = val;
			setTimeout(()=> {
				val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
				val = val.replace(/^\./g, ""); //验证第一个字符是数字
				val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
				val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
				this.reimburseDic[type] = val;
				this.reimburseDic = {
					...this.reimburseDic,
					total:this.sumAllMoney().toString()
				}
			}, 30);
		},
		sumAllMoney(){
			let hire = parseFloat(this.reimburseDic.hire || '0') 
			let carriage = parseFloat(this.reimburseDic.carriage || '0') 
			let deposit = parseFloat(this.reimburseDic.deposit || '0')
			let claim = parseFloat(this.reimburseDic.claim || '0')
			let other = parseFloat(this.reimburseDic.other || '0')
			return (hire + carriage + deposit + claim + other).toFixed(2);
		},
		//显示日历
		showCalendar() {
			this.$refs.date.show()
		},
		showdialog(type){
			this.selectType = type
			if(this.selectType === 'device'){
				this.selectList = this.deviceList
			}else{
				this.selectList = this.typeList
			}
			this.$refs.selector.show()
		},
		//跳入合同列表
		gotoContract(){
			let url = "/businessPages/invoice/contract-choose?state=5,6,7,8";
			uni.navigateTo({
				url: url
			});
		},
		//跳入联系人列表
		gotocustom(){
			uni.navigateTo({
				url: '/otherPages/linkman/linkman?nextview=false'
			});
		},
		//显示弹窗
		remarkmethod(val){
			this.reimburseDic = {
				...this.reimburseDic,
				"comment": val,
			}
		},
		//日历回调
		confirm(e) {
			this.reimburseDic = {
				...this.reimburseDic,
				"refundTime": e.fulldate + " 06:00:00",
			}
		},
		onConfirm(e){
			this.reimburseDic = {
				...this.reimburseDic,
				"refundTime": e.result + " 06:00:00",
			}
			this.$refs.date.hide();
		},
		//弹窗回调
		dialog(val) {
			if(this.selectType === 'device'){
				this.reimburseDic = {
					...this.reimburseDic,
					"deviceState": val.checkArr.value,
					"deviceStateName": val.checkArr.label,
				}
			}else{
				this.reimburseDic = {
					...this.reimburseDic,
					"type": val.checkArr.value,
					"typeName": val.checkArr.label,
				}
			}
		},
		//上传图片回调
		uploadfinish(val){
			let list= val.data;
			this.reimburseDic = {
				...this.reimburseDic,
				"fileList": list,
			}
		},
		//删除回调
		deleteUrl(val){
			let list= val.data;
			this.reimburseDic = {
				...this.reimburseDic,
				"fileList": list,
			}
		},
		//取消按钮
		clickecancle(){
			uni.navigateBack({
				delta: 1
			})
		},
		//确定按钮
		clicksave(){
			if(this.reimburseDic.contractNo == ""){
				uni.showToast({
					title:"请选择合同",
					icon:"none"
				})
				return
			}
			if(this.reimburseDic.phoneNum != ""){
				if(this.$datestr.isphonenum(this.reimburseDic.phoneNum) === false){
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					});
					return;
				}
			}
			if(this.reimburseDic.refundTime === ""){
				uni.showToast({
					title:"请选择日期",
					icon:"none"
				})
				return
			}
			if( !this.reimburseDic.type || this.reimburseDic.type == "" ){
				uni.showToast({
					title:"请选择付款方式",
					icon:"none"
				})
				return
			}
			if( !this.reimburseDic.deviceState || this.reimburseDic.deviceState == "" ){
				uni.showToast({
					title:"请选择设备情况",
					icon:"none"
				})
				return
			}
			this.httprequestData();
		},
		httprequestData(){
      uni.showLoading({
				mask:true
			});
			this.workflowcommon.iswf('refund').then((iswf)=>{
				if(iswf){
					this.workflowcommon
						.getFirstNodeUser('settleapi','refund',this.reimburseDic.orgId,this.reimburseDic.customerSalesman)
						.then(showToast => {
							console.log(showToast,'showToast');
							if(showToast){
								this.$refs.aletrview.open();
								uni.hideLoading();
							}else{
								if(this.backType === 1){
									//退回
									uni.hideLoading();
									this.$refs.remarkview.open();
								}else{
									let assnstr = this.workflowcommon.submitData(false, []);
									this.submitSaveData(assnstr);
								}
							}
						}).catch(error => {
							uni.showToast({
								title: error.message,
								icon: 'none'
							});
						});
				}else{
					if(this.backType === 1){
						//退回
						uni.hideLoading();
						this.$refs.remarkview.open();
					}else{
						this.submitSaveData("");
					}
				}
			})
		},
		remarksum(val){
			this.thoughSaveData([], val.remark);//退回
		},
		//弹窗提示返回
		getAssignList(val) {
			let alist = val.selectArr;
			if(this.backType === 1){
				let asList = alist.map(o => {
					return o.id
				})
				//退回
				this.thoughSaveData(asList, '');
			}else{
				let assnstr = this.workflowcommon.submitData(true, alist);
				this.submitSaveData(assnstr);
			}
		},
		submitSaveData(val) {
			if(this.isLoading){
				return
			}
			let url = this.$url.SETTLE_REIMBURSE_CREAT + val;
			this.reimburseDic = {
				...this.reimburseDic,
				hire:this.reimburseDic.hire ? this.reimburseDic.hire :'0.00',
				carriage:this.reimburseDic.carriage ? this.reimburseDic.carriage :'0.00',
				deposit:this.reimburseDic.deposit ? this.reimburseDic.deposit :'0.00',
				other:this.reimburseDic.other ? this.reimburseDic.other :'0.00'
			}
			this.isLoading = true
			this.$network
				.getData(url, 'POST', this.reimburseDic,{showLoading:true})
				.then(result => {
					this.isLoading = false
					uni.$emit('refresh-contract-list', {
					    type: "refund"
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					uni.navigateBack({
						animationDuration: 200
					});
				})
				.catch(err => {
					this.isLoading = false
				});
		},
		thoughSaveData(val, inputstr) {
			uni.showLoading({
				mask: true
			});
			this.reimburseDic = {
				...this.reimburseDic,
				hire:this.reimburseDic.hire ? this.reimburseDic.hire :'0.00',
				carriage:this.reimburseDic.carriage ? this.reimburseDic.carriage :'0.00',
				deposit:this.reimburseDic.deposit ? this.reimburseDic.deposit :'0.00',
				other:this.reimburseDic.other ? this.reimburseDic.other :'0.00'
			}
			let jsonstr = JSON.stringify(this.reimburseDic);
			this.workflowcommon
				.passapply('settleapi', val, inputstr, jsonstr, this.backDic.procDefId, this.backDic.procInstId, this.backDic
					.id)
				.then(showToast => {
					uni.$emit("refresh-notification-list", {
						type: 'wait'
					})
					uni.$emit('refresh-contract-list', {
					    type: "refund"
					});
					uni.navigateBack({
						animationDuration: 100
					});
					uni.hideLoading();
				})
				.catch(error => {
					uni.hideLoading();
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
	margin-left: 10px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
	padding-right: 10px;
	line-height: 16px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
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
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
}
</style>
