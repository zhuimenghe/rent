<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.printCode || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>车号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.licenseId || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>采购价格</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right-line">
					<input 
					class="input-style" 
					type="digit" 
					v-model="dataDic.machineMillPrice" 
					placeholder="请输入采购价格(元)...." 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>首付</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right-line">
					<input 
					class="input-style" 
					type="digit" 
					v-model="dataDic.firstPay" 
					placeholder="请输入首付(元)...." 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>融资额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">¥{{moneyUtil.dealNumber(dataDic.financeMoney).toString()}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>管理费</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right-line">
					<input 
					class="input-style" 
					type="digit" 
					v-model="dataDic.manageExpense" 
					placeholder="请输入管理费...." 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>月还款额</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right-line">
					<input 
					class="input-style" 
					type="digit"
					v-model="dataDic.repayMoneyEach" 
					placeholder="请输入月还款额(元)...." 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>还款期数</text><text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right-line">
					<input 
					class="input-style" 
					type="digit" 
					v-model="dataDic.repayNumber" 
					placeholder="请输入还款期数...." 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>融资成本</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">¥{{moneyUtil.dealNumber(dataDic.financePrice).toString()}}</text>
				</view>
			</view>
			<select-label-item
			:isRequired = "true"
			tagName="初次还款日期" 
			hint="请选择初次还款日期" 
			:value="getDate(dataDic.firstRepayDate)" 
			:icon="righticon" 
			@clickItemLabel="showPick('data')"
			/>
		</view>
		<view class="bottom-container" @click="updataMsg">
			<view class="clickbtn">
				修改
			</view>
		</view>
		<w-picker
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm"
		:disabledAfter="false"
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
var timer;
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default{
	components: {
		selectLabelItem,
		wPicker
	},
	watch:{
		'dataDic.machineMillPrice'(val) {
			if(!val){
				return;
			}
			this.dataDic = {
				...this.dataDic,
				machineMillPrice: val
			};
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				this.dataDic = {
					...this.dataDic,
					machineMillPrice: this.$gxfmethod.getMoneyPart(val.toString()),
					financeMoney:this.calcFinancingMoney(),
					financePrice: this.calcFinancingPrice()
				};
			}, 50);
		},
		'dataDic.firstPay'(val) {
			if(!val){
				return;
			}
			this.dataDic = {
				...this.dataDic,
				firstPay: val
			};
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				this.dataDic = {
					...this.dataDic,
					firstPay: this.$gxfmethod.getMoneyPart(val.toString()),
					financeMoney:this.calcFinancingMoney(),
					financePrice: this.calcFinancingPrice()
				};
			}, 50);
		},
		'dataDic.manageExpense'(val) {
			if(!val){
				return;
			}
			this.dataDic = {
				...this.dataDic,
				manageExpense: val
			};
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				this.dataDic = {
					...this.dataDic,
					manageExpense: this.$gxfmethod.getMoneyPart(val.toString()),
					financePrice: this.calcFinancingPrice()
				};
			}, 50);
		},
		'dataDic.repayMoneyEach'(val) {
			if(!val){
				return;
			}
			this.dataDic = {
				...this.dataDic,
				repayMoneyEach: val
			};
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				this.dataDic = {
					...this.dataDic,
					repayMoneyEach: this.$gxfmethod.getMoneyPart(val.toString()),
					financePrice: this.calcFinancingPrice()
				};
			}, 50);
		},
		'dataDic.repayNumber'(val) {
			if(!val){
				return;
			}
			this.dataDic = {
				...this.dataDic,
				repayNumber: val
			};
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(()=>{
				this.dataDic = {
					...this.dataDic,
					repayNumber: this.$gxfmethod.getIntString(val.toString()),
					financePrice: this.calcFinancingPrice()
				};
			}, 50);
		},
	},
	data(){
		return{
			righticon: 'iconarrow-right',
			dataDic:{}
		}
	},
	onLoad(option){
		this.dataDic = JSON.parse(decodeURIComponent(option.item));
	},
	methods:{
		getDate(time) {
			if (!time) {
				return "";
			}
			return time.split(/\s+/)[0];
		},
		calcFinancingMoney(){
			let machineMillPrice = this.dataDic.machineMillPrice ? parseFloat(this.dataDic.machineMillPrice) : 0.00;
			let firstPay = this.dataDic.firstPay ? parseFloat(this.dataDic.firstPay) : 0.00;
			let financingMoney = parseFloat(machineMillPrice) - parseFloat(firstPay)
			return financingMoney.toString()
		},
		calcFinancingPrice(){
			//融资成本 = 月还款额 * 期数 + 管理费 - 融资额
			let machineMillPrice = this.dataDic.machineMillPrice ? parseFloat(this.dataDic.machineMillPrice) : 0.00;
			let firstPay = this.dataDic.firstPay ? parseFloat(this.dataDic.firstPay) : 0.00;
			let repayMoneyEach = this.dataDic.repayMoneyEach ? parseFloat(this.dataDic.repayMoneyEach) : 0.00;
			let repayNumber = this.dataDic.repayNumber ? parseFloat(this.dataDic.repayNumber) : 0.00;
			//融资额
			let financingMoney = parseFloat(machineMillPrice) - parseFloat(firstPay);
			//管理费
			let manageExpense = this.dataDic.manageExpense ? parseFloat(this.dataDic.manageExpense) : 0.00;
			//总还款
			let totalReturn = repayNumber * repayMoneyEach;
			let financePrice = totalReturn + manageExpense - financingMoney;
			return financePrice.toString()
		},
		updataMsg(){
			if(this.dataDic.machineMillPrice == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入采购价格"
				})
				return;
			}
			if(this.dataDic.firstPay == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入首付"
				})
				return;
			}
			if(this.dataDic.manageExpense == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入管理费"
				})
				return;
			}
			if(this.dataDic.repayMoneyEach == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入月还款额"
				})
				return;
			}
			if(this.dataDic.repayNumber == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入还款期数"
				})
				return;
			}
			if(!this.dataDic.firstRepayDate){
				uni.showToast({
					icon:'none',
					title:"请输入初次还款日期"
				})
				return;
			}
			uni.showModal({
				title: '提示',
				content: "是否修改融资成本?",
				success: res => {
					if (res.confirm) {
						uni.showLoading();
						let param = {
							"id": this.dataDic.id,
							"licenseId": this.dataDic.licenseId,
							"firstPay": this.dataDic.firstPay,
							"firstRepayDate": this.dataDic.firstRepayDate,
							"machineMillPrice": this.dataDic.machineMillPrice,
							"manageExpense": this.dataDic.manageExpense,
							"repayMoneyEach":this.dataDic.repayMoneyEach,
							"repayNumber":this.dataDic.repayNumber,
							// "remark": this.dataDic.remark,
						}
						this.$network.getData(this.$url.MACHINE_FINANCE_UPDATE, 'POST', param).then(result => {
							uni.showToast({
								icon: 'none',
								title: "修改成功",
							});	
							setTimeout(()=>{
								uni.$emit("refresh-financing-list", {})
								uni.navigateBack({
									delta:1
								})
							}, 100);
						}).catch(err => {
							uni.showToast({
								icon: 'none',
								title: err.message + err.details[0],
								duration: 1500
							});	
						});
					}
				},
			});
		},
		showPick(type){
			this.$refs.date.show();
		},
		onConfirm(val){
			this.dataDic = {
				...this.dataDic,
				firstRepayDate:val.result 
			}
		}
	}
}
</script>

<style scoped lang="scss">
.bg-view{
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #F5F4F9;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px;
	margin-bottom: 10px;
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
	border-bottom:$uni-line-color 1px dotted;
	font-size: $uni-font-size-base;
}
.tilte-view-sub{
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
}
.cell-input-view-left {
	display: flex;
	min-width: 100px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	// padding: 10px;
}
.cell-input-view-right-line {
	display: flex;
	flex: 1;
	// margin-left: 50px;
	// margin-right: 10px;
	// padding: 10px 0px;
	// align-items: center;
	// justify-content: flex-start;
	// color: $uni-text-color;
	// font-size: $uni-font-size-base;
	// border-bottom: 1px #EEEEEE solid;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 50px;
	margin-right: 10px;
	// padding: 10px 0px;
	align-items: center;
	justify-content: flex-start;
}
.input-style {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
	padding-right: 10px;
}
.bottom-container {
	position: fixed;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	height: 60px;
	width: 100%;
	justify-content: space-between;
}
.clickbtn {
	flex: 1;
	background-color: $uni-color-primary;
	margin: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	color: #FFFFFF;
	font-size: 14px;
}
</style>
