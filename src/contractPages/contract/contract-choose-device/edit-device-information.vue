<template>
	<view class="edit-device-bg">
		<view class="model-container">
			<view class="model-tag">
				<view v-if="contractType!='3'">
					<view>{{dataDic.typeName || '-'}}/{{dataDic.heightName || '-'}}</view>
					<view class="sub-title" style="margin-top: 4px;margin-left: 0px;">
					{{dataDic.machineTypeName || ''}}
					</view>
				</view>
				<view v-if="contractType=='3'">
					<view>{{dataDic.printCode || ''}}</view>
					<view class="sub-title" style="margin-top: 4px;margin-left: 0px;">
					{{dataDic.typeName || '-'}}|{{dataDic.heightName || '-'}}{{dataDic.machineBrand || ''}}|{{dataDic.machineTypeName || ''}}
					</view>
				</view>
				
			</view>
			<selectorSlot title="数量" :isRequire="true" v-if="contractType=='1'">
				<uniNumberBox :min="1" :compare="true" @minusChange="showTip($event)" @change="getNumValue($event)"
					:value="dataDic.orderNum"></uniNumberBox>
			</selectorSlot>
			
			<selectorPick 
			title="租赁方式" 
			placeholder="请选择租赁方式" 
			:content="dataDic.settlementTypeName" 
			:isRequire="true"
			@clickItem="showPick('settlementType')" />
			<selectorInput 
			v-if="dataDic.settlementType=='4' || dataDic.settlementType=='1' || dataDic.settlementType=='6'"
			title="日租金单价(元/台)" 
			placeholder="0.00" 
			:content="dataDic.hire" 
			:isRequire="true"
			@textChage="textChange($event, 'hire')" 
			textType="digit"/>
			<selectorInput 
			v-if="dataDic.settlementType=='2' || dataDic.settlementType=='3'" 
			title="月租金单价(元/台)"
			placeholder="0.00" 
			:content="dataDic.hire" 
			:isRequire="true" 
			@textChage="textChange($event, 'hire')" 
			textType="digit"/>
			
			<selectorInput 
			v-if="dataDic.settlementType=='5'" 
			title="周租金单价(元/台)"
			placeholder="0.00" 
			:content="dataDic.hire"
			:isRequire="true" 
			@textChage="textChange($event, 'hire')" 
			textType="digit"/>
			<selectorInput 
			v-if="dataDic.settlementType=='4'|| dataDic.settlementType=='6'" 
			title="月租金单价(元/台)"
			placeholder="0.00" 
			:content="getStr(dataDic.hireMonthly)" 
			:isRequire="true"
			@textChage="textChange($event, 'hireMonthly')" 
			textType="digit"/>
			<selectorPick 
			title="运费类型" 
			placeholder="请选择运费类型" 
			:content="dataDic.carriageTypeName" 
			:isRequire="false"
			@clickItem="showPick('carriageType')" />
			
			<selectorInput 
			title="运费(元/台)" 
			placeholder="0.00" 
			:content="getStr(dataDic.carriage)" 
			:isRequire="false"
			@textChage="textChange($event, 'carriage')"
			textType="digit"/>
			<selectorInputMD 
			v-if="(isShowConfig&&contractType=='1')||contractType=='3'" 
			title="预计租期" 
			placeholder="0"
			:showWhole="dataDic.settlementType!=='1'&&dataDic.settlementType!=='4'&&dataDic.settlementType!=='6'"
			:wholeStr="dataDic.settlementType==='5'?'周':'月'" 
			:whole="dataDic.whole" 
			:surplusDay="dataDic.surplusDay"
			:isRequire="false" 
			@textChage="textChange($event, 'surplusDayMD')" />
			
			<selectorPick 
			v-if="(isShowConfig&&contractType=='1')||contractType=='3'" 
			:title="contractType=='3'?'约定进场日':'进场启用时间'" 
			:placeholder="contractType=='3'?'请选择约定进场日期':'请选择进场启用时间'" 
			:content="changestr(dataDic.beginDate)"
			:isRequire="true" 
			@clickItem="showPick('beginDate')" />
			<selectorPick 
			v-if="(isShowConfig&&contractType=='1')||contractType=='3'" 
			title="预计退场时间" 
			:isEdit="false" 
			placeholder="--"
			:content="changestr(dataDic.endDate)" 
			:isRequire="false" />
			<selectorInput 
			title="押金(元/台)" 
			placeholder="0.00" 
			:content="getStr(dataDic.pledge)" 
			:isRequire="false"
			@textChage="textChange($event, 'pledge')" 
			textType="digit"/>
			<selectorPick 
			title="小计" 
			:isEdit="false" 
			:content="dataDic.total" 
			:isRequire="false" 
			v-if="contractType!='2'" />
		</view>
		<view class="model-container" v-if="contractType=='1'">
			<view class="row-line model-tag">
				<text>指定设备</text>
				<text class="sub-title">共{{dataDic.machineList?dataDic.machineList.length:0}}台</text>
			</view>
			<multiSelectorView 
			:showLabel="false" 
			placeholder="请选择设备" 
			:values="dataDic.machineList" 
			@clickSelector="goTo('assign')"
			@deleteValue="deleteDevice" 
			:showKey="['printCode','licenseId']" />
		</view>
		<view class="bottom-btn-style">
			<view class="btn-common left-btn" @click="deleteItem">
				<text>{{ '删除' }}</text>
			</view>
			<view class="btn-common right-btn" @click="submitItem">
				<text>{{ '确定' }}</text>
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm"
			:disabledAfter="false" ref="date" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import selectorSlot from '@/contractPages/components/selector-slot.vue';
	import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
	import selectorInput from '@/components/common/selector-pick/selector-input.vue';
	import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
	import selectorInputMD from '@/components/common/selector-pick/selector-input-monthday.vue';
	import uniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
	import multiSelectorView from '@/components/common/selector-pick/multi-selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import calRent from '@/common/util/cal-rent-money.js';
	export default {
		components: {
			selectorSlot,
			selectorPick,
			selectorInput,
			selectorArea,
			selectorInputMD,
			uniNumberBox,
			multiSelectorView,
			wPicker
		},
		data() {
			return {
				dataDic: {},
				settlementTypeList: [],
				carriageTypesList: [],
				selectList: [],
				selectType: '',
				indexNum: '0',
				isShowConfig: true,
				contractType:''
			};
		},
		onLoad(option) {
			let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
			if (resData) {
				let obj = resData.find(o => o.code === 'tenant_name')
				if (obj) {
					this.isShowConfig = obj.value === 'liangXu' ? false : true
				}
			}
			this.contractType = option.contractType?option.contractType:'';
			this.dataDic = JSON.parse(decodeURIComponent(option.item));
			this.indexNum = option.index
			this.loadSettlementTypes();
			this.loadcarriageTypes();
			uni.$on('assgin-vehicle', obj => {
				let assgins = [];
				if (obj.data && obj.data.length > 0) {
					obj.data.map(o => {
						assgins = [
							...assgins,
							{
								id: o.id,
								licenseId: o.licenseId,
								printCode: o.printCode,
								machineBrand: o.brand,
								machineType: o.type,
								machineTypeName: o.typeName
							}
						];
					});
				}
				this.dataDic.machineList = [...assgins];
			});
		},
		onUnload() {
			// 取消监听事件
			uni.$off('choose-material');
		},
		methods: {
			deleteDevice(val) {
				this.dataDic.machineList.splice(val.pos, 1);
			},
			//提示
			showTip(val) {
				if (this.dataDic.machineList.length >= this.dataDic.orderNum) {
					uni.showModal({
						content: '选择设备不得小于指定设备数量',
						showCancel: false,
						confirmText: '知道了'
					});
					return;
				} else {
					this.dataDic.orderNum -= val;

				}
			},
			//获取设备类型的数量
			getNumValue(val) {
				this.dataDic.orderNum = val;
				let obj = this.calTotal(this.dataDic)
				this.dataDic = {
					...obj
				}
			},
			getStr(moneyStr) {
				if (parseFloat(moneyStr) == 0) {
					return ""
				} else {
					return moneyStr
				}
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			calTotal(obj){
				return this.contractType=='3'?calRent.calculateTotalWithSmple(obj):calRent.calculateTotalNew(obj)
			},
			textChange(val, type) {
				if (type == 'surplusDayMD') {
					if (val.type == 'whole') {
						let temDic = {
							...this.dataDic,
							whole: val.data
						};
						let param = this.calTotal(temDic);
						this.dataDic = {
							...temDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					} else if (val.type == "surplusDay") {
						let temDic = {
							...this.dataDic,
							surplusDay: val.data
						};
						let param = this.calTotal(temDic);
						this.dataDic = {
							...temDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}

				} else if (type == 'hire') {
					this.dataDic = {
						...this.dataDic,
						hire: val
					};
					setTimeout(() => {
						this.dataDic = {
							...this.dataDic,
							hire: this.$gxfmethod.getMoneyPart(val)
						};
						let param = this.calTotal(this.dataDic);
						this.dataDic = {
							...this.dataDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}, 10);
				} else if (type == 'hireMonthly') {
					this.dataDic = {
						...this.dataDic,
						hireMonthly: val
					};
					setTimeout(() => {
						this.dataDic = {
							...this.dataDic,
							hireMonthly: this.$gxfmethod.getMoneyPart(val)
						};
						let param = this.calTotal(this.dataDic);
						this.dataDic = {
							...this.dataDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}, 10);
				} else if (type == 'carriage') {
					this.dataDic = {
						...this.dataDic,
						carriage: val
					};
					setTimeout(() => {
						this.dataDic = {
							...this.dataDic,
							carriage: this.$gxfmethod.getMoneyPart(val)
						};
						let param = this.calTotal(this.dataDic);
						this.dataDic = {
							...this.dataDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}, 10);
				} else if (type == 'pledge') {
					this.dataDic = {
						...this.dataDic,
						pledge: val
					};
					setTimeout(() => {
						this.dataDic = {
							...this.dataDic,
							pledge: this.$gxfmethod.getMoneyPart(val)
						};
						let param = this.calTotal(this.dataDic);
						this.dataDic = {
							...this.dataDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}, 10);
				}
			},
			deleteItem() {
				uni.showModal({
					title: '提示',
					content: '确定要删除该订单么?',
					success: res => {
						if (res.cancel) {} else {
							let param = {
								type: 'delete',
								index: this.indexNum,
								data: this.indexNum
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
				if (((this.isShowConfig&&this.contractType=='1')||this.contractType=='3') &&(!this.dataDic.beginDate || this.dataDic.beginDate == "")) {
					uni.showToast({
						icon: 'none',
						title: contractType=='3'?'请选择进场启用时间':'请选择约定进场日期'
					});
					return;
				}
				if (this.dataDic.settlementType == '4' || this.dataDic.settlementType == '6') {
					if (!this.dataDic.hire || this.dataDic.hire == "" || parseFloat(this.dataDic.hire) <= 0) {
						uni.showToast({
							icon: 'none',
							title: '租金必须大于0'
						});
						return;
					}
					if (!this.dataDic.hireMonthly || this.dataDic.hireMonthly == "" || parseFloat(this.dataDic
							.hireMonthly) <= 0) {
						uni.showToast({
							icon: 'none',
							title: '租金必须大于0'
						});
						return;
					}
				} else {
					if (!this.dataDic.hire || this.dataDic.hire == "" || parseFloat(this.dataDic.hire) <= 0) {
						uni.showToast({
							icon: 'none',
							title: '租金必须大于0'
						});
						return;
					}
				}
				let param = {
					type: 'edit',
					index: this.indexNum,
					data: this.dataDic
				};
				console.log(this.dataDic);
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
				} else {
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
				} else if (this.selectType == 'settlementType') {
					let temDic = {
						...this.dataDic,
						settlementType: val.checkArr.value,
						settlementTypeName: val.checkArr.label,
					};
					let param = calRent.getTenancys(temDic);
					let temdDicNew = {
						...temDic,
						whole: param.whole,
						surplusDay: param.surplusDay,
					};
					setTimeout(() => {
						let paramss = this.calTotal(temdDicNew);
						this.dataDic = {
							...temdDicNew,
							endDate: paramss.endDate,
							total: paramss.total,
							tenancy: paramss.tenancy,
						};
					}, 10);
				} else if (this.selectType == 'beginDate') {
					let temDic = {}
					if (this.dataDic.lastWorkOutDate && this.dataDic.lastWorkOutDate != null) {
						let lastWorkOutDate = this.dataDic.lastWorkOutDate;
						let dataBegin = val.result + ' 00:00:00'
						if (this.$datestr.gettimedifference(dataBegin, lastWorkOutDate) > 0) {
							let lastout = this.changestr(lastWorkOutDate);
							uni.showToast({
								title: "该车辆的上次退场时间为:" + lastout + ",进场时间不得早于该时间点",
								icon: "none"
							})
							let lastStr = calRent.AddsubDays(lastWorkOutDate, 1);
							temDic = {
								...this.dataDic,
								beginDate: lastStr + ' 00:00:00'
							};
						} else {
							temDic = {
								...this.dataDic,
								beginDate: val.result + ' 00:00:00'
							};
						}
					} else {
						temDic = {
							...this.dataDic,
							beginDate: val.result + ' 00:00:00'
						};
					}
					setTimeout(() => {
						let param = this.calTotal(temDic);
						this.dataDic = {
							...temDic,
							endDate: param.endDate,
							total: param.total,
							tenancy: param.tenancy,
						};
					}, 10);
				} else if (this.selectType == 'endDate') {
					this.dataDic = {
						...this.dataDic,
						endDate: val.result + ' 23:59:59'
					};
				}
			},
			goTo(type) {
				if (this.dataDic.orderNum <= 0) {
					uni.showToast({
						title: '请选择设备数量',
						icon: 'none'
					});
					return;
				}
				uni.navigateTo({
					url: '../assign-vehicle?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
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
		background: $uni-bg-color-grey;
		width: 100%;
		padding-bottom: 60px;
	}
	.model-container{
		margin: 8px;
		background-color: #FFFFFF;
		border-radius: 4px;
		margin-top: 8px;
	}
	.model-tag{
		color: #333333;
		font-size: 16px;
		padding: 10px;
		border-bottom: 1px solid $uni-bg-color-grey;
		line-height: 18px;
	}
	.sub-title{
		font-size: 14px;
		color: #999999;
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

	.text-tag-first {
		padding: 10px;
		font-size: 16px;
		color: $uni-text-color;
		margin-right: 10px;
	}

	.text-tag-seced {
		font-size: 13px;
		color: $uni-text-color-gray;
	}

</style>
