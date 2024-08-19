<template>
	<view class="content">
		<create-step
			processKey="servicePause"
			@submitApply="clicksave"
			:orgId="pauseDic.orgId"
			:itemData="itemData"
			@data-form="getBackData"
			:updateObj="pauseDic"
			:businessOwner="pauseDic.customerSalesman"
			:isUpdate="isUpdate"
		>
			<view class="pause-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>选择设备</text></view>
					<select-label-item
						tagName="车辆号"
						isRequired="true"
						hint="请选择车辆"
						:value="pauseDic.licenseId"
						:icon="righticon"
						@clickItemLabel="addMachineContract"
						:isSelect="!isAdjust"
					/>
				</view>
				<view class="sum-view-bg" v-if="pauseDic.licenseId">
					<view class="model-tag"><text>客户信息</text></view>
					<select-label-item
						tagName="合同名称"
						hint="请选择合同"
						:isRequired="true"
						:value="contractDicName"
						:isSelect="!isAdjust"
						:icon="righticon"
						@clickItemLabel="gotoContract"
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>区域</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ pauseDic.orgName || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>业务负责人</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ pauseDic.customerSalesmanName || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>客户名称</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ pauseDic.customerName || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>报停联系人</text></view>
						<view class="cell-input-view-right">
							<input class="input-style" type="text" v-model="pauseDic.contactName" :placeholder="isAdjust ? '' : '请输入...'" :disabled="isAdjust" />
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>报停联系人电话</text></view>
						<view class="cell-input-view-right">
							<input class="input-style" type="text" v-model="pauseDic.phoneNum" :placeholder="isAdjust ? '' : '请输入...'" :disabled="isAdjust" />
						</view>
					</view>
				</view>
				<view class="sum-view-bg" v-if="pauseDic.licenseId">
					<view class="model-tag">
						<text>设备信息（共{{ pauseDic.machines.length || '0' }}辆，总计{{ pauseDic.total || '0.00' }}元）</text>
						<view class="tag-right" v-if="!isAdjust"><i class="iconfont labelstyle iconadd" @click="addMachine"></i></view>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in pauseDic.machines" class="v-item-container" :key="i">
							<view class="item-top">
								<text>车号：{{ v.licenseId }}</text>
								<view class="top-right">
									<text>{{ v.stateName }}-{{ v.subStateName }}</text>
								</view>
							</view>
							<view class="item-row">
								<text>品牌：{{ v.machineBrand || '--' }}</text>
								<text>自喷码：{{ v.printCode || '-' }}</text>
							</view>
							<view class="item-row">
								<tag-select
									tagName="进场时间"
									:value="getDate(v.workInDate) === '' ? '--' : getDate(v.workInDate)"
									:textColor="textColor"
									:fontSize="fontSize"
									:isSelect = 'false'
								/>
								<tag-select
									tagName="退场时间"
									:value="getDate(v.workOutDate) === '' ? '--' : getDate(v.workOutDate)"
									:textColor="textColor"
									:fontSize="fontSize"
									:isSelect = 'false'
								/>
							</view>
							<view class="item-row">
								<tag-select tagName="报停开始时间" :value="getDate(v.beginDate)" @tap="showPick('beginDate', i)" :textColor="textColor" :fontSize="fontSize" />
								<tag-select tagName="报停结束时间" :value="getDate(v.endDate)" @tap="showPick('endDate', i)" :textColor="textColor" :fontSize="fontSize" />
							</view>
							<view class="item-row">
								<tag-select tagName="预计报停天数" :value="v.pauseDays || '--'" :isSelect="false" :textColor="textColor" :fontSize="fontSize"></tag-select>
								<view class="pause-options">
									<tag-input tagName="报停租金(元)" :textColor="textColor" :fontSize="fontSize">
										<input :placeholder="$t('common.inputTip')" type="digit" v-model="v.pauseHire" @input="checkInput($event, i)" />
									</tag-input>
									<i class="iconfont delete-items-icon iconzl--shanchu" @click="removeMachine(i)" v-if="showdelete(v)"></i>
								</view>
							</view>
							<view class="line-s" />
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="model-tag"><text>报停信息</text></view>
					<select-label-item
						tagName="报停类型"
						isRequired="true"
						hint="请选择报停类型"
						:value="pauseDic.pauseCauseName"
						@clickItemLabel="showPick('select')"
						:isSelect="!isAdjust"
					/>
					<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="pauseDic.fileList" type="pause_type" uploadType="attachment" maximg="20" />
					<text-label-item tagName="报停原因" placeholder="请输入报停原因..." @ipnuttext="remarkmethod" :inputValue="pauseDic.reason" :inputDisabled="isAdjust" />
				</view>
			</view>
			<w-picker :selectList="pauseTypes" @confirm="onConfirm" v-show="pauseTypes.length != 0" mode="selector" ref="selector" themeColor="#E60000" />
			<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" :pickControl="true" ref="date" themeColor="#E60000" />
		</create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import calRent from '@/common/util/cal-rent-money.js';
import hoursUtil from '@/common/util/day-working-hours.js';
import createStep from '@/components/workflow/create-step.vue';
import TagSelect from '@/components/common/uni-tag/tag-select.vue';
import TagInput from '@/components/common/uni-tag/tag-input.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import timeCompare from '@/common/common-method/common-method.js';

export default {
	components: {
		wPicker,
		selectLabelItem,
		textLabelItem,
		labelArrow,
		createStep,
		TagSelect,
		TagInput,
		imgupload
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			textColor: '#333333',
			fontSize: '14px',
			pauseDic: {
				category: 'service',
				machines: []
			},
			pickType: '',
			curItem: 0,
			addIndex: 0,
			pauseTypes: [],
			isAdjust: false,
			contractDicName: '',
			itemData: null,
			isUpdate: false
		};
	},
	onLoad(option) {
		if (option.id) {
			this.loaddata(option.id);
		}
		if (option.item) {
			this.itemData = JSON.parse(decodeURIComponent(option.item));
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
		}
		if(option.machineitem){
			let contractObj = JSON.parse(decodeURIComponent(option.machineitem));
			let licenseId = contractObj.licenseId;
			let machines = contractObj.machines.map(o => {
				return {
					...o,
					beginDate: o.workInDate ? o.workInDate : defaultDate, //默认车辆进场日期
					// endDate: o.workOutDate ? o.workOutDate : null,
					// pauseDays: this.getPauseDays(this.getDate(o.workInDate ? o.workInDate : defaultDate), this.getDate(o.workOutDate ? o.workOutDate : ''))
				};
			});
			this.pauseDic = {
				...this.pauseDic,
				licenseId: licenseId,
				contractNo: contractObj.dict.businessNo,
				contractDetailId: contractObj.dict.contractDetailDto.id,
				customerName: contractObj.dict.customerName,
				customerId: contractObj.dict.customerId,
				contactName: contractObj.dict.contractDetailDto.contactName,
				contactId: contractObj.dict.contractDetailDto.contactId,
				phoneNum: contractObj.dict.contractDetailDto.phoneNum,
				orgName: contractObj.dict.orgName,
				orgId: contractObj.dict.orgId,
				customerSalesman: contractObj.dict.contractDetailDto.customerSalesman,
				customerSalesmanName: contractObj.dict.contractDetailDto.customerSalesmanName,
				projectName: contractObj.dict.contractDetailDto.projectName,
				machines: machines,
				total: '0'
			};
			this.contractDicName = (this.pauseDic.customerName?this.pauseDic.customerName:'') + '-' + this.pauseDic.projectName;
		}
		this.loadPauseTypes();
		if (option.isAdjust) {
			this.isAdjust = option.isAdjust === 'true' ? true : false;
			uni.setNavigationBarTitle({
				title: '报停调整'
			});
		}
		if (!option.id && !this.itemData && !this.isAdjust) {
			this.getBusinessNo();
		}
		uni.$on('choosedMachines', obj => {
			let defaultDate = hoursUtil.dateSFormat(new Date().getTime());
			let machines = obj.data.map(o => {
				console.log(JSON.stringify(o));
				return {
					...o,
					beginDate: o.workInDate ? o.workInDate : defaultDate, //默认车辆进场日期
					// endDate: o.workOutDate ? o.workOutDate : null,
					// pauseDays: this.getPauseDays(this.getDate(o.workInDate ? o.workInDate : defaultDate), this.getDate(o.workOutDate ? o.workOutDate : ''))
				};
			});
			this.pauseDic.machines = [...this.pauseDic.machines, ...machines];
			this.calTotal();
		});
		uni.$on('choose-contract-emit', contractObj => {
			let licenseId = contractObj.licenseId;
			let machines = contractObj.machines.map(o => {
				return {
					...o,
					beginDate: o.workInDate ? o.workInDate : defaultDate, //默认车辆进场日期
					// endDate: o.workOutDate ? o.workOutDate : null,
					// pauseDays: this.getPauseDays(this.getDate(o.workInDate ? o.workInDate : defaultDate), this.getDate(o.workOutDate ? o.workOutDate : ''))
				};
			});
			this.pauseDic = {
				...this.pauseDic,
				licenseId: licenseId,
				contractNo: contractObj.dict.businessNo,
				contractDetailId: contractObj.dict.contractDetailDto.id,
				customerName: contractObj.dict.customerName,
				customerId: contractObj.dict.customerId,
				contactName: contractObj.dict.contractDetailDto.contactName,
				contactId: contractObj.dict.contractDetailDto.contactId,
				phoneNum: contractObj.dict.contractDetailDto.phoneNum,
				orgName: contractObj.dict.orgName,
				orgId: contractObj.dict.orgId,
				customerSalesman: contractObj.dict.contractDetailDto.customerSalesman,
				customerSalesmanName: contractObj.dict.contractDetailDto.customerSalesmanName,
				projectName: contractObj.dict.contractDetailDto.projectName,
				machines: machines,
				total: '0'
			};
			this.contractDicName = (this.pauseDic.customerName?this.pauseDic.customerName:'') + '-' + this.pauseDic.projectName;
		});
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-contract-emit');
		uni.$off('choosedMachines');
	},
	methods: {
		showdelete(v) {
			if (this.isAdjust) {
				return false;
			}
			if (v.licenseId === this.pauseDic.licenseId) {
				let list = this.pauseDic.machines;
				let filterlist = list.filter((o)=>{
					return v.licenseId === o.licenseId
				})
				if(filterlist.length > 1){
					return true
				}
				return false;
			}
			return true;
		},
		/**
		 * 获取单号
		 */
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'BT');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.pauseDic = {
						...this.pauseDic,
						businessNo: result
					};
				})
				.catch(err => {});
		},
		/**获取退回后通过dataForm接口获取的数据详情
		 * @param {Object} val json数据
		 */
		getBackData(val) {
			this.pauseDic = JSON.parse(val);
			this.contractDicName = this.pauseDic.customerName + '-' + this.pauseDic.projectName;
		},
		loaddata(key) {
			let param = {
				businessNo: key
			};
			this.$network
				.getData(this.$url.PAUSE_DETAIL, 'GET', param)
				.then(result => {
					this.pauseDic = {
						...result,
						id: this.isAdjust ? null : result.id,
						businessKey: this.isAdjust ? null : result.businessKey
					};
					this.contractDicName = this.pauseDic.customerName + '-' + this.pauseDic.projectName;
				})
				.catch(err => {});
		},
		//报停类型
		loadPauseTypes() {
			this.$network
				.loadType('pause_cause')
				.then(result => {
					this.pauseTypes = result;
					if (!this.itemData) {
						if (this.pauseTypes.length > 0) {
							this.pauseDic = { ...this.pauseDic, pauseCause: this.pauseTypes[0].value, pauseCauseName: this.pauseTypes[0].label };
						}
					}
				})
				.catch(err => {});
		},
		calTotal() {
			let total = this.pauseDic.machines.reduce((x, y) => {
				return x + (y.pauseDays ? Number(y.pauseDays) : 0) * (y.pauseHire ? Number(y.pauseHire) : 0);
			}, 0);
			this.pauseDic.total = total.toFixed(2);
		},
		//跳入合同列表
		gotoContract() {
			let url = '/businessPages/claim/claim-choose-contract?delta=1&item=' + encodeURIComponent(JSON.stringify(this.pauseDic));
			uni.navigateTo({
				url: url
			});
		},
		addMachineContract() {
			uni.navigateTo({
				url: '/businessPages/claim/claim-choose-machine?type=pause'
			});
		},
		/**
		 * 获取预计报停天数
		 * @param {Object} beginDate
		 * @param {Object} endDate
		 */
		getPauseDays(beginDate, endDate) {
			if (!beginDate || !endDate) {
				return null;
			}
			return calRent.getDaysOfDiffer(beginDate, endDate);
		},
		getDate(time) {
			if (!time) {
				return '';
			}
			return time.split(/\s+/)[0];
		},
		/**
		 * 添加报停设备
		 */
		addMachine() {
			if (!this.pauseDic.contractNo) {
				uni.showToast({
					icon: 'none',
					title: '请选择合同'
				});
				return;
			}
			let no = this.isUpdate ?  "" : this.pauseDic.businessNo
			uni.navigateTo({
				url: './worked-machine-by-contract?choosedList=' + JSON.stringify(this.pauseDic.machines) + '&contractNo=' + this.pauseDic.contractNo + '&businessNo=' + no + '&delta=' + 1
			});
		},
		/**
		 * 删除报停设备
		 */
		removeMachine(i) {
			this.pauseDic.machines.splice(i, 1);
			this.calTotal();
		},
		//备注
		remarkmethod(val) {
			this.pauseDic.reason = val;
		},
		//取消按钮
		clickecancle() {
			uni.navigateBack({
				delta: 1
			});
		},

		//上传图片回调
		uploadfinish(val) {
			let list = val.data;
			this.pauseDic = {
				...this.pauseDic,
				fileList: [...list]
			};
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			this.pauseDic = {
				...this.pauseDic,
				fileList: [...list]
			};
		},
		checkData() {
			if (!this.pauseDic.customerId) {
				uni.showToast({
					title: '请选择客户信息',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.pauseDic.contractNo) {
				uni.showToast({
					title: '请选择合同',
					icon: 'none'
				});
				return Promise.reject('fail');
			}

			if (!this.pauseDic.machines || (this.pauseDic.machines && this.pauseDic.machines.length <= 0)) {
				uni.showToast({
					title: '请选择设备信息',
					icon: 'none'
				});
				return Promise.reject('fail');
			}

			// if (this.pauseDic.machines.some(o => !o.endDate)) {
			// 	uni.showToast({
			// 		title: '请选择报停结束时间',
			// 		icon: 'none'
			// 	});
			// 	return Promise.reject('fail');
			// }

			if (!this.pauseDic.pauseCauseName) {
				uni.showToast({
					title: '请选择报停类型',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			let mlist = this.pauseDic.machines.map(o => {
				o.beginDate = this.getDate(o.beginDate) + ' 00:00:00';
				o.endDate = o.endDate? (this.getDate(o.endDate)+ ' 23:59:59'):null;
				return o;
			});

			this.pauseDic = { ...this.pauseDic, machines: mlist };
			return Promise.resolve('success');
		},
		//确定按钮
		clicksave(val) {
			console.log('clicksave=' + JSON.stringify(val));
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.CREATE_SERVICE_PAUSE + val, 'POST', this.pauseDic)
				.then(result => {
					uni.$emit('refresh-contract-list', {
						type: 'pause'
					});
					uni.$emit('refresh-notification-list', {
						type: 'apply'
					});
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		},
		showPick(type, item) {
			this.pickType = type;
			switch (type) {
				case 'select':
					this.$refs.selector.show();
					break;
				default:
					this.curItem = item;
					this.$refs.date.show();
					break;
			}
		},
		onConfirm(val) {
			console.log(JSON.stringify(val));
			switch (this.pickType) {
				case 'beginDate':
					if (this.pauseDic.machines[this.curItem].workInDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].workInDate)) === -1) {
						uni.showToast({
							icon: 'none',
							title: '报停开始时间不得早于车辆进场时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].workOutDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].workOutDate)) === 1) {
						uni.showToast({
							icon: 'none',
							title: '报停开始时间不得晚于车辆进场时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].endDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].endDate)) === 1) {
						uni.showToast({
							icon: 'none',
							title: '报停开始时间不得晚于报停结束时间'
						});
						return;
					}
					this.$refs.date.hide();
					this.pauseDic.machines[this.curItem].endDate = this.getDate(this.pauseDic.machines[this.curItem].endDate);
					this.pauseDic.machines[this.curItem].beginDate = val.result;
					this.pauseDic.machines[this.curItem].pauseDays = this.getPauseDays(
						this.pauseDic.machines[this.curItem].beginDate,
						this.pauseDic.machines[this.curItem].endDate
					);
					console.log('endDate:' + JSON.stringify(this.pauseDic.machines[this.curItem]));
					this.calTotal();
					break;
				case 'endDate':
					if (
						this.pauseDic.machines[this.curItem].workInDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].workInDate)) === -1) {
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得早于车辆进场时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].workOutDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].workOutDate)) === 1) {
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得晚于车辆退场时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].beginDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].beginDate)) === -1){
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得早于报停开始时间'
						});
						return;
					}
					this.$refs.date.hide();
					this.pauseDic.machines[this.curItem].beginDate = this.getDate(this.pauseDic.machines[this.curItem].beginDate);
					this.pauseDic.machines[this.curItem].endDate = val.result;
					this.pauseDic.machines[this.curItem].pauseDays = this.getPauseDays(
						this.pauseDic.machines[this.curItem].beginDate,
						this.pauseDic.machines[this.curItem].endDate
					);
					console.log('endDate:' + JSON.stringify(this.pauseDic.machines[this.curItem]));
					this.calTotal();
					break;
				case 'select':
					this.pauseDic.pauseCause = val.checkArr.value;
					this.pauseDic.pauseCauseName = val.checkArr.label;
					break;
			}
		},
		checkInput(e, i) {
			var val = e.target.value;
			console.log(e);
			setTimeout(() => {
				//限制小数两位
				if (val.indexOf('.') != -1) {
					var dotIndex = val.indexOf('.');
					if (val.length - 1 - dotIndex > 2) {
						val = val.substr(0, dotIndex + 2 + 1);
						this.getInputData(val, i);
					}
				}
				if (val.indexOf('.') == 0) {
					val = '0' + val;
					this.getInputData(val, i);
				}

				//限制0后面非。输入
				if (val.substring(0, 1) == '0' && val.length > 1 && val.substring(1, 2) != '.') {
					val = val.substring(0, 1);
					this.getInputData(val, i);
					return;
				}
				this.getInputData(val, i);
			}, 10);
		},
		getInputData(val, i) {
			this.pauseDic.machines[i].pauseHire = val;
			this.calTotal();
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	width: 100%;
	height: 100%;
}

.pause-bg {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	background: #ffffff;
	border-radius: 4px;
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
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.text-style {
	flex: 1;
	text-align: right;
}

.input-style {
	text-align: right;
	width: 140px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.model-tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	padding: 15px;
	align-items: center;
}

.tag-right,
.top-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
}

.labelstyle {
	color: $uni-color-primary;
	font-size: 20px;
	margin-left: 10px;
}

// .attachment-icon {
// 	color: $uni-color-primary;
// 	font-size: 10px;
// 	margin-left: 10px;
// }

.delete-items-icon {
	color: #ff0000;
	font-size: 14px;
	margin-left: 10px;
}

.vehicle-list-container {
	padding: 15px;
}

.item-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	height: 45px;
	line-height: 45px;
}

.item-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 8px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.item-row tag-select {
	flex: 1;
}

.pause-options {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: $uni-color-primary;
}

.item-row text {
	flex: 1;
}

// .bottom-view {
// 	position: fixed;
// 	display: flex;
// 	left: 0px;
// 	right: 0px;
// 	bottom: 0px;
// 	height: 60px;
// 	justify-content: flex-end;
// 	flex-direction: row;
// 	align-items: center;
// 	background: #ffffff;
// 	z-index: 100;
// }

// .bottom-left-view {
// 	display: flex;
// 	flex: 1;
// 	height: 40px;
// 	border-radius: 20px;
// 	background: $uni-bg-color-grey;
// 	font-size: $uni-font-size-lg;
// 	color: $uni-color-primary;
// 	align-items: center;
// 	justify-content: center;
// 	font-weight: bold;
// 	margin-right: 10px;
// 	margin-left: 10px;
// }

// .bottom-right-view {
// 	display: flex;
// 	flex: 1;
// 	height: 40px;
// 	border-radius: 20px;
// 	background: $uni-color-primary;
// 	font-size: $uni-font-size-lg;
// 	color: #ffffff;
// 	align-items: center;
// 	justify-content: center;
// 	font-weight: bold;
// 	margin-right: 10px;
// }
.line-s {
	margin-top: 5px;
	margin-left: 5px;
	margin-right: 5px;
	height: 1px;
	background: #eeeeee;
}
</style>
