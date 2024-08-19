<template>
	<view class="edit-device-bg">
		<view class="head-machine">
			<view class="head-machine-left">
				<text class="text-tag-first">{{dataDic.printCode || ''}}</text>
				<view class="top-part-order-bg">
					<text class="text-tag-seced">{{dataDic.typeName || ''}}</text>
					<text class="text-tag-line">|</text>
					<text class="text-tag-seced">{{dataDic.heightName || ''}}</text>
					<text class="text-tag-line">|</text>
					<text class="text-tag-seced">{{dataDic.machineBrand || ''}}</text>
					<text class="text-tag-line">|</text>
					<text class="text-tag-seced">{{dataDic.machineTypeName || ''}}</text>
				</view>
			</view>
			<text class="tag-view-base" :class="ischeckOK(dataDic.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'" @click="gotoCheckCar">
				{{ ischeckOK(dataDic.workCheckResults) ? '点检正常>>' : '点检异常>>' }}
			</text>
		</view>
		<selectorPick 
		title="租赁方式" 
		placeholder="请选择租赁方式" 
		:content="dataDic.settlementTypeName" 
		:isRequire="true" 
		@clickItem="showPick('settlementType')"
		/>
		<selectorInput 
		v-if="dataDic.settlementType=='4' || dataDic.settlementType=='1' || dataDic.settlementType=='6'"
		title="日租金单价(元/台)" 
		placeholder="0.00" 
		:content="dataDic.hire" 
		:isRequire="true" 
		@textChage="textChange($event, 'hire')" 
		/>
		<selectorInput
		v-if="dataDic.settlementType=='2' || dataDic.settlementType=='3'"
		title="月租金单价(元/台)" 
		placeholder="0.00" 
		:content="dataDic.hire" 
		:isRequire="true" 
		@textChage="textChange($event, 'hire')" 
		/>
		<selectorInput
		v-if="dataDic.settlementType=='5'"
		title="周租金单价(元/台)" 
		placeholder="0.00" 
		:content="dataDic.hire" 
		:isRequire="true" 
		@textChage="textChange($event, 'hire')" 
		/>
		<selectorInput
		v-if="dataDic.settlementType=='4'|| dataDic.settlementType=='6'"
		title="月租金单价(元/台)" 
		placeholder="0.00" 
		:content="getStr(dataDic.hireMonthly)" 
		:isRequire="true" 
		@textChage="textChange($event, 'hireMonthly')" 
		/>
		<selectorPick
		title="运费类型" 
		placeholder="请选择运费类型" 
		:content="dataDic.carriageTypeName" 
		:isRequire="false" 
		@clickItem="showPick('carriageType')"
		/>
		<selectorInput
		title="运费(元/台)" 
		placeholder="0.00" 
		:content="getStr(dataDic.carriage)" 
		:isRequire="false" 
		@textChage="textChange($event, 'carriage')" 
		/>
		<!-- <selectorPick
		title="进场启用时间" 
		placeholder="请选择进场启用时间" 
		:content="changestr(dataDic.beginDate)" 
		:isRequire="true" 
		@clickItem="showPick('beginDate')"
		/>
		<selectorInputMD
		title="预计租期" 
		placeholder="0" 
		:showWhole="dataDic.settlementType!=='1'&&dataDic.settlementType!=='4'&&dataDic.settlementType!=='6'"
		:wholeStr="dataDic.settlementType==='5'?'周':'月'"
		:whole="dataDic.whole" 
		:surplusDay="dataDic.surplusDay" 
		:isRequire="false" 
		@textChage="textChange($event, 'surplusDayMD')" 
		/>
		<selectorPick
		title="预计退场时间" 
		:isEdit="false"
		placeholder="--" 
		:content="changestr(dataDic.endDate)" 
		:isRequire="false" 
		/> -->
		<selectorInput
		title="押金(元/台)" 
		placeholder="0.00" 
		:content="getStr(dataDic.pledge)" 
		:isRequire="false" 
		@textChage="textChange($event, 'pledge')" 
		/>
		<!-- <selectorPick
		title="总计" 
		:isEdit="false"
		:content="dataDic.total" 
		:isRequire="false" 
		/> -->
		<view class="bottom-btn-style">
			<view class="btn-common left-btn" @click="deleteItem">
				<text>{{ '删除' }}</text>
			</view>
			<view class="btn-common right-btn" @click="submitItem">
				<text>{{ '确定' }}</text>
			</view>
		</view>
		<w-picker 
		:selectList="selectList" 
		@confirm="onConfirm" 
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
		:disabledAfter="false"
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import selectorInputMD from '@/components/common/selector-pick/selector-input-monthday.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import hoursUtil from '@/common/util/day-working-hours.js';
import calRent from '@/common/util/cal-rent-money.js';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		selectorInputMD,
		wPicker
	},
	data() {
		return {
			dataDic: {},
			settlementTypeList: [],
			carriageTypesList: [],
			selectList: [],
			selectType: '',
			indexNum:'0'
		};
	},
	onLoad(option) {
		this.dataDic = JSON.parse(decodeURIComponent(option.item));
		this.indexNum = option.index
		this.loadSettlementTypes();
		this.loadcarriageTypes();
		//点检项
		uni.$on('choose-check-emit', usnerinfo => {
			let list = usnerinfo.list;
			this.dataDic = {
				...this.dataDic,
				workCheckResults: [...list]
			};
		});
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-material');
	},
	methods: {
		getStr(moneyStr){
			if(parseFloat(moneyStr) == 0){
				return ""
			}else{
				return moneyStr
			}
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//点检
		gotoCheckCar(){
			uni.navigateTo({
				url: '../check-car-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic.workCheckResults))
			});
		},
		ischeckOK(checkList) {
			if (!checkList) {
				return false;
			}
			let list = checkList.filter((o) => {
				return o.checked === false
			})
			if (list.length > 0) {
				return false;
			}
			return true;
		},
		textChange(val, type) {
			if (type == 'surplusDayMD') {
				if(val.type == 'whole'){
					let temDic = {
						...this.dataDic,
						whole: val.data
					};
					let param = calRent.calculateTotalWithSmple(temDic);
					this.dataDic = {
						...temDic,
						endDate:param.endDate,
						total:param.total,
						tenancy:param.tenancy,
					};
				}else if(val.type == "surplusDay"){
					let temDic = {
						...this.dataDic,
						surplusDay: val.data
					};
					let param = calRent.calculateTotalWithSmple(temDic);
					this.dataDic = {
						...temDic,
						endDate:param.endDate,
						total:param.total,
						tenancy:param.tenancy,
					};
				}
				
			}else if (type == 'hire') {
				this.dataDic = {
					...this.dataDic,
					hire: val
				};
				setTimeout(() => {
					this.dataDic = {
						...this.dataDic,
						hire: this.$gxfmethod.getMoneyPart(val)
					};
					// let param = calRent.calculateTotalWithSmple(this.dataDic);
					// this.dataDic = {
					// 	...this.dataDic,
					// 	endDate:param.endDate,
					// 	total:param.total,
					// 	tenancy:param.tenancy,
					// };
				}, 10);
			}else if(type == 'hireMonthly') {
				this.dataDic = {
					...this.dataDic,
					hireMonthly: val
				};
				setTimeout(() => {
					this.dataDic = {
						...this.dataDic,
						hireMonthly: this.$gxfmethod.getMoneyPart(val)
					};
					// let param = calRent.calculateTotalWithSmple(this.dataDic);
					// this.dataDic = {
					// 	...this.dataDic,
					// 	endDate:param.endDate,
					// 	total:param.total,
					// 	tenancy:param.tenancy,
					// };
				}, 10);
			}else if (type == 'carriage') {
				this.dataDic = {
					...this.dataDic,
					carriage: val
				};
				setTimeout(() => {
					this.dataDic = {
						...this.dataDic,
						carriage: this.$gxfmethod.getMoneyPart(val)
					};
					// let param = calRent.calculateTotalWithSmple(this.dataDic);
					// this.dataDic = {
					// 	...this.dataDic,
					// 	endDate:param.endDate,
					// 	total:param.total,
					// 	tenancy:param.tenancy,
					// };
				}, 10);
			}else if (type == 'pledge') {
				this.dataDic = {
					...this.dataDic,
					pledge: val
				};
				setTimeout(() => {
					this.dataDic = {
						...this.dataDic,
						pledge: this.$gxfmethod.getMoneyPart(val)
					};
					// let param = calRent.calculateTotalWithSmple(this.dataDic);
					// this.dataDic = {
					// 	...this.dataDic,
					// 	endDate:param.endDate,
					// 	total:param.total,
					// 	tenancy:param.tenancy,
					// };
				}, 10);
			}
		},
		deleteItem() {
			uni.showModal({
				title: '提示',
				content: '确定要删除该设备么?',
				success: res => {
					if (res.cancel) {
					} else {
						let param = {
							type: 'delete',
							index:this.indexNum,
							data:this.indexNum
						};
						uni.$emit('edit-item-device', param);
						uni.navigateBack({
							animationDuration: 200
						});
					}
				}
			});
		},
		submitItem() {
			if (!this.dataDic.beginDate||this.dataDic.beginDate=="") {
				uni.showToast({
					icon: 'none',
					title: '请选择进场启用时间'
				});
				return;
			}
			if (this.dataDic.settlementType=='4' || this.dataDic.settlementType=='6') {
				if (!this.dataDic.hire || this.dataDic.hire=="" || parseFloat(this.dataDic.hire)<=0) {
					uni.showToast({
						icon: 'none',
						title: '租金必须大于0'
					});
					return;
				}
				if (!this.dataDic.hireMonthly || this.dataDic.hireMonthly=="" || parseFloat(this.dataDic.hireMonthly)<=0) {
					uni.showToast({
						icon: 'none',
						title: '租金必须大于0'
					});
					return;
				}
			}else{
				if (!this.dataDic.hire || this.dataDic.hire=="" || parseFloat(this.dataDic.hire)<=0) {
					uni.showToast({
						icon: 'none',
						title: '租金必须大于0'
					});
					return;
				}
			}
			let param = {
				type: 'edit',
				index:this.indexNum,
				data: this.dataDic
			};
			uni.$emit('edit-item-device', param);
			uni.navigateBack({
				animationDuration: 200
			});
		},
		showPick(type) {
			this.selectType = type;
			if (type == 'settlementType') {
				this.selectList = [...this.settlementTypeList];
				this.$refs.selector.show();
			} else if (type == 'carriageType') {
				this.selectList = [...this.carriageTypesList];
				this.$refs.selector.show();
			}else{
				this.$refs.date.show();
			}
			
		},
		onConfirm(val) {
			if (this.selectType == 'carriageType') {
				this.dataDic = {
					...this.dataDic,
					carriageType: val.checkArr.value,
					carriageTypeName: val.checkArr.label
				};
			}else if (this.selectType == 'settlementType') {
				let temDic = {
					...this.dataDic,
					settlementType: val.checkArr.value,
					settlementTypeName: val.checkArr.label,
				};
				let param = calRent.getTenancysWithSmple(temDic);
				let temdDicNew = {
					...temDic,
					whole:param.whole,
					surplusDay:param.surplusDay,
				};
				setTimeout(()=> {
					let paramss = calRent.calculateTotalWithSmple(temdDicNew);
					this.dataDic = {
						...temdDicNew,
						endDate:paramss.endDate,
						total:paramss.total,
						tenancy:paramss.tenancy,
					};
				}, 10);
			}else if (this.selectType == 'beginDate') {
				let temDic = {}
				if(this.dataDic.lastWorkOutDate&&this.dataDic.lastWorkOutDate!=null){
					let lastWorkOutDate = this.dataDic.lastWorkOutDate;
					let dataBegin = val.result + ' 00:00:00'
					console.log(lastWorkOutDate)
					console.log(dataBegin)
					if(this.$datestr.gettimedifference(dataBegin,lastWorkOutDate)>0){
						let lastout = this.changestr(lastWorkOutDate);
						uni.showToast({
							title:"该车辆的上次退场时间为:" + lastout + ",进场时间不得早于该时间点",
							icon:"none"
						})
						let lastStr = calRent.AddsubDays(lastWorkOutDate,1);
						temDic = {
							...this.dataDic,
							beginDate: lastStr + ' 00:00:00'
						};
					}else{
						temDic = {
							...this.dataDic,
							beginDate: val.result + ' 00:00:00'
						};
					}
				}else{
					temDic = {
						...this.dataDic,
						beginDate: val.result + ' 00:00:00'
					};
				}
				setTimeout(()=>{
					let param = calRent.calculateTotalWithSmple(temDic);
					this.dataDic = {
						...temDic,
						endDate:param.endDate,
						total:param.total,
						tenancy:param.tenancy,
					};
				}, 10);
			}else if (this.selectType == 'endDate') {
				this.dataDic = {
					...this.dataDic,
					endDate: val.result + ' 23:59:59'
				};
			}
		},
		goTo() {
			uni.navigateTo({
				url: '/subOtherPages/accessories/acc-storagein/choose-material-part?basicsId=' + this.dataDic.basicsId
			});
		},
		//租赁方式
		loadSettlementTypes() {
			this.$network.loadType('settlement_type').then(result => {
				this.settlementTypeList = result;
			}).catch(err => {});
		},
		//运费类型carriage_type
		loadcarriageTypes() {
			this.$network.loadType('carriage_type').then(result => {
				this.carriageTypesList = result;
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.edit-device-bg {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	width: 100%;
	padding-bottom: 10px;
}
.top-part-order-bg {
	display: flex;
	flex-direction: row;
	padding: 0px 10px 10px 10px ;
	align-items: center;
	justify-content: flex-start;
}
.top-part-order-bg-input {
	flex: 1;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg-tag {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 10px 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	border-bottom: $uni-line-color 1px solid;
}
.top-part-type-source {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-source-item {
	display: flex;
	flex: 1;
}
.text-style {
	min-width: 60px;
	color: #222831;
}
.right-text {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.tag-view {
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-base;
	justify-content: center;
	align-items: center;
	margin-right: 8px;
	margin-top: 3px;
}
.tag1 {
	background: #eef9e8;
	color: #57c32d;
}

.tag2 {
	background: #FFF1F0;
	color: #E60000;
}

.tag3 {
	background: #fff6e7;
	color: #fab045;
}
.top-part-type-bg-left {
	display: flex;
	flex: 1;
}
.delete-icon {
	font-size: 17px;
	color: #ff0000;
	margin-left: 15px;
}
.edit-icon {
	color: #E60000;
	font-size: 16px;
	margin-left: 8px;
}
.bottom-btn-style {
	position: fixed;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	width: 100%;
	justify-content: flex-start;
	padding-top: 10px;
	padding-bottom:env(safe-area-inset-bottom);
}
.btn-common {
	display: flex;
	flex: 1;
	margin-left: 10px;
	margin-right: 10px;
	border-radius: 50px;
	padding: 10px 0px;
	justify-content: center;
	align-items: center;
}
.left-btn {
	background: #ff0000;
	color: #ffffff;
	font-size: $uni-font-size-base;
}
.right-btn {
	background: $uni-color-primary;
	color: #ffffff;
	font-size: $uni-font-size-base;
}
.head-machine{
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom: $uni-line-color 1px solid;
}
.head-machine-left{
	display: flex;
	flex-direction: column;
	flex: 1;
}
.text-tag-first{
	padding: 10px;
	font-size: 16px;
	color: $uni-text-color;
	margin-right: 10px;
}
.text-tag-seced{
	font-size: 13px;
	color: $uni-text-color-gray;
}
.text-tag-line{
	font-size: 13px;
	color: $uni-text-color-gray;
	margin-left: 5px;
	margin-right: 5px;
}
.tag-view-base {
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-sm;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
	margin-top: 3px;
}
.checkbtnOK {
	background: #ffffff;
	color: #4ec365;
	border-color: #4ec365;
	border-width: 1px;
	border-style: solid;
}
.checkbtnError {
	background: #ffffff;
	color: #ff0000;
	border-color: #ff0000;
	border-width: 1px;
	border-style: solid;
}
</style>
