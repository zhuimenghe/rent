<template>
	<view class="bgclass">
		<view class="sum-view-bg">
			<view class="car-message-view">
				<i class="iconfont icon-car" :class="cartype[dataDic.machineType] || typedefault" :style="{ color: dataDic.state == '1' ? '#4EC365' : '#F7AB2F' }"></i>
				<view class="icon-car-right">
					<view class="icon-car-right-top">
						<text style="margin-right: 5px;font-size: 17px;font-weight: bold;">{{ dataDic.printCode || '--' }}</text>
						<text style="margin-left: 5px;color: #999999;">{{ dataDic.licenseId || '--' }}</text>
					</view>
					<view class="icon-car-right-bottom">
						<text>{{ dataDic.machineTypeDesc || '--' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ dataDic.machineHeightDesc || '--' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ dataDic.machineBrand || '--' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ dataDic.machineTypeName || '--' }}</text>
						<!-- <text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{dataDic.driveTypeName || '--'}}</text> -->
					</view>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="tilte-view-sub"><view class="boldstyle">电池信息</view></view>
			<view style="display: flex;flex-direction: column;" v-if="Object.keys(dataDic.batteryInfoDto).length > 0">
				<view class="cell-input-view">
					<view class="cell-input-view-left" style="flex: 1;color: #222831;">{{ dataDic.batteryInfoDto.batteryBrand || '--' }}</view>
					<text class="type-style">{{ dataDic.batteryInfoDto.batteryTypeDesc || '--' }}</text>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">初次使用</view>
					<view class="cell-input-view-right input-style">{{ getDate(dataDic.batteryInfoDto.firstUseDate) }}</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">安装日期</view>
					<view class="cell-input-view-right input-style">{{ getDate(dataDic.batteryInfoDto.installDate) }}</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">生产日期</view>
					<view class="cell-input-view-right input-style">{{ getDate(dataDic.batteryInfoDto.produceDate) }}</view>
				</view>
				<view class="cell-input-view tilte-view-sub" style="padding-bottom: 10px;">
					<view class="cell-input-view-left">安装人</view>
					<view class="cell-input-view-right input-style">{{ dataDic.batteryInfoDto.installerName || '--' }}</view>
				</view>
				<view class="detail-view">
					<text class="type-style" @click="selectMsg('updataB')">信息更正</text>
					<text style="margin-left: 10px;" class="type-style" @click="deleteMsg('deleteB')">拆除</text>
				</view>
			</view>
			<view class="add-style" v-if="Object.keys(dataDic.batteryInfoDto).length == 0" @click="addItem('addB')"><text>+新增电池信息</text></view>
		</view>
		<view class="sum-view-bg">
			<view class="tilte-view-sub"><view class="boldstyle">充电器信息</view></view>
			<view style="display: flex;flex-direction: column;" v-if="Object.keys(dataDic.chargeInfoDto).length > 0">
				<view class="cell-input-view">
					<view class="cell-input-view-left" style="flex: 1;color: #222831;">{{ dataDic.chargeInfoDto.batteryBrand || '--' }}</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">安装日期</view>
					<view class="cell-input-view-right input-style">{{ getDate(dataDic.chargeInfoDto.installDate) }}</view>
				</view>
				<view class="cell-input-view tilte-view-sub" style="padding-bottom: 10px;">
					<view class="cell-input-view-left">安装人</view>
					<view class="cell-input-view-right input-style">{{ dataDic.chargeInfoDto.installerName || '--' }}</view>
				</view>
				<view class="detail-view">
					<text class="type-style" @click="selectMsg('updataM')">信息更正</text>
					<text style="margin-left: 10px;" class="type-style" @click="deleteMsg('deleteM')">拆除</text>
				</view>
			</view>
			<view class="add-style" v-if="Object.keys(dataDic.chargeInfoDto).length == 0" @click="addItem('addM')"><text>+新增充电器信息</text></view>
		</view>
		<view class="sum-view-bg">
			<view class="tilte-view-sub"><view class="boldstyle">更换记录</view></view>
			<view class="cell-input-record-bg" v-for="(item, index) in datalist" :key="index">
				<view class="cell-input-record">{{ item.operationTypeName || '--' }}{{ item.type == 'battery' ? '电池' : '充电器' }}</view>
				<view class="cell-input-record">{{ getDate(item.installDate) }}</view>
				<view class="cell-input-record-last" style="margin-right: 10px;">{{ item.batteryBrand || '--' }}</view>
				<view class="cell-input-record-last">{{ item.batteryTypeDesc || '--' }}</view>
			</view>
		</view>
		<!-- 弹出视图 -->
		<view class="pop-container">
			<uni-popup ref="bartty" type="center" :mask-click="false">
				<view class="uni-tip-container">
					<view class="sum-view-bg">
						<view class="tilte-view-sub" style="display: flex;justify-content: center;"><view class="boldstyle">电池信息</view></view>
						<!-- <view class="cell-input-view">
							<view class="input-view-left">
								电池类型
								<text style="color: #FF0000;">*</text>
							</view>
							<view class="border-class">
								<input
									class="input-style"
									type="text"
									@input="checkInput($event, 'batteryType')"
									:value="updataDicBattery.batteryType"
									placeholder="请输入电池类型...."
								/>
							</view>
						</view> -->
						<select-label-item
							:isRequired="true"
							tagName="电池类型"
							hint="请选择电池类型"
							:value="updataDicBattery.batteryTypeDesc"
							:icon="righticon"
							@clickItemLabel="showPick('batteryType')"
						/>
						<view class="cell-input-view">
							<view class="input-view-left">
								品牌型号
								<text style="color: #FF0000;">*</text>
							</view>
							<view class="border-class">
								<input
									class="input-style"
									type="text"
									@input="checkInput($event, 'batteryBrand')"
									:value="updataDicBattery.batteryBrand"
									placeholder="请输入品牌型号...."
								/>
							</view>
						</view>
						<select-label-item
							:isRequired="true"
							tagName="初次使用"
							hint="请选择初次使用时间"
							:value="changestr(updataDicBattery.firstUseDate)"
							:icon="righticon"
							@clickItemLabel="showPick('beginDate')"
						/>
						<select-label-item
							:isRequired="true"
							tagName="安装日期"
							hint="请选择安装日期"
							:value="changestr(updataDicBattery.installDate)"
							:icon="righticon"
							@clickItemLabel="showPick('installDate')"
						/>
						<select-label-item
							:isRequired="true"
							tagName="生产日期"
							hint="请选择电池生产日期"
							:value="changestr(updataDicBattery.produceDate)"
							:icon="righticon"
							@clickItemLabel="showPick('produceDate')"
						/>
						<select-label-item
							:isRequired="true"
							tagName="安装人"
							hint="请选择安装人"
							:value="updataDicBattery.installerName"
							:icon="righticon"
							@clickItemLabel="showPick('installer')"
						/>
						<text-label-item
							tagName="备注"
							placeholder="请输入备注...(最多20个字)"
							:moneyMaxLeng="20"
							@ipnuttext="remarkChange($event, 'remark')"
							:inputValue="updataDicBattery.remark"
						/>
						<view style="flex: 1;height: 1px;background: #E9E9E9;" />
						<view class="bottom-btn">
							<view class="btn-style left-btn" @click="cancleB('updataB')">取消</view>
							<view class="btn-style right-btn" @click="submitB('updataB')">确定</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view class="pop-container">
			<uni-popup ref="charge" type="center" :mask-click="false">
				<view class="uni-tip-container">
					<view class="sum-view-bg">
						<view class="tilte-view-sub" style="display: flex;justify-content: center;"><view class="boldstyle">充电器信息</view></view>
						<!-- <view class="cell-input-view">
							<view class="input-view-left">充电器型号<text style="color: #FF0000;">*</text></view>
							<view class="border-class">
								<input
								class="input-style" 
								type="text"
								@input="checkInput($event,'chargebatteryType')"
								:value="updataDicCharge.batteryType"
								placeholder="请输入充电器型号...." 
								/>
							</view>
						</view> -->
						<view class="cell-input-view">
							<view class="input-view-left">
								品牌型号
								<text style="color: #FF0000;">*</text>
							</view>
							<view class="border-class">
								<input
									class="input-style"
									type="text"
									@input="checkInput($event, 'chargebatteryBrand')"
									:value="updataDicCharge.batteryBrand"
									placeholder="请输入品牌型号...."
								/>
							</view>
						</view>
						<select-label-item
							:isRequired="true"
							tagName="安装日期"
							hint="请选择安装日期"
							:value="changestr(updataDicCharge.installDate)"
							:icon="righticon"
							@clickItemLabel="showPick('chargeinstallDate')"
						/>
						<select-label-item
							:isRequired="true"
							tagName="安装人"
							hint="请选择安装人"
							:value="updataDicCharge.installerName"
							:icon="righticon"
							@clickItemLabel="showPick('chargeinstaller')"
						/>
						<text-label-item
							tagName="备注"
							placeholder="请输入备注...(最多20个字)"
							:moneyMaxLeng="20"
							@ipnuttext="remarkChange($event, 'chargeremark')"
							:inputValue="updataDicCharge.remark"
						/>
						<view style="flex: 1;height: 1px;background: #E9E9E9;" />
						<view class="bottom-btn">
							<view class="btn-style left-btn" @click="cancleB('updataM')">取消</view>
							<view class="btn-style right-btn" @click="submitB('updataM')">确定</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components: {
		uniPopup,
		selectLabelItem,
		textLabelItem,
		wPicker
	},
	data() {
		return {
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			typedefault: 'iconzl--zhibiche1',
			righticon: 'iconarrow-right',
			personList: [],
			batteryTypeList:[],
			selectList: [],
			selectType: '',
			dataDic: {
				batteryInfoDto: {},
				chargeInfoDto: {}
			},
			datalist: [],
			updataDicBattery: {},
			updataDicCharge: {},
			isUpdata: false
		};
	},
	onLoad(option) {
		let dict = JSON.parse(decodeURIComponent(option.item));

		uni.showLoading();
		this.getDeatil(dict.licenseId);
		this.getUserLeaders();
		this.getbatteryTypeList();
	},
	methods: {
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
		},
		checkInput(e, type) {
			let val = e.detail.value;
			if (type == 'batteryType') {
				this.updataDicBattery = {
					...this.updataDicBattery,
					batteryType: val
				};
			} else if (type == 'batteryBrand') {
				this.updataDicBattery = {
					...this.updataDicBattery,
					batteryBrand: val
				};
			} else if (type == 'chargebatteryType') {
				this.updataDicCharge = {
					...this.updataDicCharge,
					batteryType: val
				};
			} else if (type == 'chargebatteryBrand') {
				this.updataDicCharge = {
					...this.updataDicCharge,
					batteryBrand: val
				};
			}
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//添加
		addItem(type) {
			this.isUpdata = false;
			let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
			let installer = '';
			let installerName = '';
			if (resData) {
				installer = resData.id;
				installerName = resData.username;
			}
			if (type == 'addB') {
				let dict = this.batteryTypeList.length > 0 ? this.batteryTypeList[0] : {}
				this.updataDicBattery = {
					...{},
					batteryType: dict.value ? dict.value : "",
					batteryTypeDesc: dict.label ? dict.label : "",
					batteryBrand: '',
					type: 'battery',
					licenseId: this.dataDic.licenseId,
					firstUseDate: this.$datestr.getnowdate() + ' 06:00:00',
					installDate: this.$datestr.getnowdate() + ' 06:00:00',
					produceDate: this.$datestr.getnowdate() + ' 06:00:00',
					installer: installer,
					installerName: installerName
				};
				this.$refs.bartty.open();
			} else {
				this.updataDicCharge = {
					...{},
					batteryBrand: '',
					type: 'charge',
					licenseId: this.dataDic.licenseId,
					installDate: this.$datestr.getnowdate() + ' 06:00:00',
					installer: installer,
					installerName: installerName
				};
				this.$refs.charge.open();
			}
		},
		//更新
		selectMsg(type) {
			this.isUpdata = true;
			if (type == 'updataB') {
				this.updataDicBattery = {
					...this.dataDic.batteryInfoDto
				};
				this.$refs.bartty.open();
			} else {
				this.updataDicCharge = {
					...this.dataDic.chargeInfoDto
				};
				this.$refs.charge.open();
			}
		},
		//删除
		deleteMsg(type) {
			if (type == 'deleteB') {
				uni.showModal({
					title: '提示',
					content: '确认要拆除电池?',
					success: res => {
						if (res.cancel) {
						} else {
							this.deleteItem(this.dataDic.batteryInfoDto);
						}
					}
				});
			} else {
				uni.showModal({
					title: '提示',
					content: '确认要拆除充电器?',
					success: res => {
						if (res.cancel) {
						} else {
							this.deleteItem(this.dataDic.chargeInfoDto);
						}
					}
				});
			}
		},
		deleteItem(item) {
			uni.showLoading();
			this.$network
				.getData(this.$url.DELETE_BATTERY.replace(/{id}/, item.id), 'DELETE')
				.then(result => {
					this.getDeatil(this.dataDic.licenseId);
					uni.$emit('refresh-battery-list');
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.details[0] ? err.details[0] : err.message ? err.message : ''
					});
				});
		},
		//弹窗
		showPick(type) {
			this.selectType = type;
			if (type == 'beginDate' || type == 'installDate' || type == 'chargeinstallDate' || type == 'produceDate') {
				this.$refs.date.show();
			} else if (type == 'installer') {
				this.selectList = [...this.personList];
				this.$refs.selector.show();
			}else if (type == 'batteryType') {
				this.selectList = [...this.batteryTypeList];
				this.$refs.selector.show();
			} else if (type == 'chargeinstaller') {
				this.selectList = [...this.personList];
				this.$refs.selector.show();
			}
		},
		onConfirm(val) {
			// BATTERY_SUBMIT
			if (this.selectType == 'installer') {
				//电池领用人
				this.updataDicBattery = {
					...this.updataDicBattery,
					installer: val.checkArr.value,
					installerName: val.checkArr.label
				};
			} else if (this.selectType == 'chargeinstaller') {
				//充电器领用人
				this.updataDicCharge = {
					...this.updataDicCharge,
					installer: val.checkArr.value,
					installerName: val.checkArr.label
				};
			} else if (this.selectType == 'beginDate') {
				//电池初次使用
				this.updataDicBattery = {
					...this.updataDicBattery,
					firstUseDate: val.result + ' 06:00:00'
				};
			} else if (this.selectType == 'installDate') {
				//领用时间
				this.updataDicBattery = {
					...this.updataDicBattery,
					installDate: val.result + ' 06:00:00'
				};
			}else if(this.selectType == 'produceDate'){
				this.updataDicBattery = {
					...this.updataDicBattery,
					produceDate : val.result + ' 06:00:00'
				};
			}else if (this.selectType == 'chargeinstallDate') {
				//充电器领用时间
				this.updataDicCharge = {
					...this.updataDicCharge,
					installDate: val.result + ' 06:00:00'
				};
			}else if (this.selectType == 'batteryType') {
				this.updataDicBattery = {
					...this.updataDicBattery,
					batteryType: val.checkArr.value,
					batteryTypeDesc: val.checkArr.label
				};
			}
		},
		remarkChange(e, type) {
			if (type == 'remark') {
				this.updataDicBattery = {
					...this.updataDicBattery,
					remark: e
				};
			} else if (type == 'chargeremark') {
				this.updataDicCharge = {
					...this.updataDicCharge,
					remark: e
				};
			}
		},
		//安装
		cancleB(type) {
			if (type == 'updataB') {
				this.$refs.bartty.close();
			} else {
				this.$refs.charge.close();
			}
		},
		submitB(type) {
			uni.showLoading();
			let parame = {};
			if (type != 'updataB') {
				if (!this.updataDicCharge.batteryBrand || this.updataDicCharge.batteryBrand == '') {
					uni.showToast({
						title: '请输入品牌型号',
						icon: 'none'
					});
					return;
				}
				parame = {
					...this.updataDicCharge
				};
			} else {
				// "batteryType":'',
				// "batteryBrand":"",
				if (!this.updataDicBattery.batteryType || this.updataDicBattery.batteryType == '') {
					uni.showToast({
						title: '请选择电池类型',
						icon: 'none'
					});
					return;
				}
				if (!this.updataDicBattery.batteryBrand || this.updataDicBattery.batteryBrand == '') {
					uni.showToast({
						title: '请输入品牌型号',
						icon: 'none'
					});
					return;
				}
				parame = {
					...this.updataDicBattery
				};
			}
			if (this.isUpdata) {
				this.$network
					.getData(this.$url.BATTERY_EDIT, 'PUT', parame)
					.then(result => {
						this.getDeatil(this.dataDic.licenseId);
						uni.$emit('refresh-battery-list');
						if (type == 'updataB') {
							this.$refs.bartty.close();
						} else {
							this.$refs.charge.close();
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details[0] ? err.details[0] : err.message ? err.message : ''
						});
					});
			} else {
				this.$network
					.getData(this.$url.BATTERY_SUBMIT, 'POST', parame)
					.then(result => {
						this.getDeatil(this.dataDic.licenseId);
						uni.$emit('refresh-battery-list');
						if (type == 'updataB') {
							this.$refs.bartty.close();
						} else {
							this.$refs.charge.close();
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details[0] ? err.details[0] : err.message ? err.message : ''
						});
					});
			}
		},
		getUserLeaders() {
			let param = {
				showAdmin: false
				// roleType : this.$savekey.USER_ROLE_SEVICER
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.personList = result.map(o => {
						return {
							value: o.id,
							label: o.username
						};
					});
				})
				.catch(err => {});
		},
		getbatteryTypeList(){
			this.$network.loadType('battery_type').then(result => {
				this.batteryTypeList = result;
			}).catch(err => {});
		},
		getDeatil(licenseId) {
			let parame = {
				licenseId: licenseId
			};
			this.$network
				.getData(this.$url.BATTERY_DETAIL_URL, 'GET', parame)
				.then(result => {
					let batteryInfoDto = {
						...(result.batteryInfoDto ? result.batteryInfoDto : {})
					};
					let chargeInfoDto = {
						...(result.chargeInfoDto ? result.chargeInfoDto : {})
					};
					this.dataDic = {
						...result,
						batteryInfoDto: batteryInfoDto,
						chargeInfoDto: chargeInfoDto
					};
					this.getNetData();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getNetData() {
			let parame = {
				current: '0',
				size: '-1',
				licenseId: this.dataDic.licenseId
			};
			this.$network
				.getData(this.$url.BATTERY_RECORD_LIST, 'POST', parame)
				.then(result => {
					this.datalist = [...result.records];
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.bgclass {
	width: 100%;
	min-height: 100%;
	background-color: $uni-bg-color-grey;
	padding-bottom: 10px;
	overflow-y: hidden;
}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding: 15px 10px;
	background: #ffffff;
	border-radius: 10px;
}

.car-message-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}

.icon-car {
	padding: 3px;
	font-size: 35px;
	color: #fc0000;
	border-radius: 8px;
	border: 1px #999999 solid;
}

.icon-car-right {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.icon-car-right-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}

.icon-car-right-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}

.icon-right {
	font-size: 20px;
	color: #999999;
	font-weight: bold;
}

.tilte-view-sub {
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
}

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	padding-bottom: 10px;
	color: $uni-text-color;
}

.tilte-view-sub {
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
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

.cell-input-view-left {
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}

.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.input-style {
	flex: 1;
	flex-wrap: wrap;
	// text-align: right;
	font-size: $uni-font-size-base;
	margin-right: 10px;
}

.input-view-left {
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	// margin-left: 10px;
}

.border-class {
	flex: 1;
	// padding: 5px;
	margin-left: 20px;
	// margin-top: 5px;
	// margin-bottom: 10px;
	// margin-right: 10px;
	// border-bottom: #e9e9e9 1px solid;
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	text-align: right;
}

.type-style {
	text-align: right;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	border: $uni-color-primary 1px solid;
	border-radius: 5px;
	padding: 3px 10px;
	color: $uni-color-primary;
}

.detail-view {
	display: flex;
	flex-direction: row;
	margin-top: 10px;
	padding-top: 5px;
	justify-content: flex-end;
	font-size: $uni-font-size-base;
}

.cell-input-record-bg {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px 0px 10px 0px;
	font-size: $uni-font-size-base;
	border-bottom: $uni-line-color 1px dotted;
}

.cell-input-record {
	display: flex;
	align-items: center;
	min-width: 80px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	word-break: keep-all;
	margin-right: 10px;
	text-align: center;
}

.cell-input-record-last {
	flex: 1;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	word-wrap: break-word;
	white-space: normal !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

//tips
.pop-container {
	position: relative;
}

.uni-tip-container {
	display: flex;
	flex-direction: column;
	width: 90vw;
	background-color: #fff;
	border-radius: 10px;
}

.bottom-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 10px;
}

.btn-style {
	padding: 5px 20px;
	font-size: $uni-font-size-base;
	border-radius: 5px;
}

.left-btn {
	color: $uni-text-color;
	background: #e9e9e9;
	margin-left: 40px;
}

.right-btn {
	color: #ffffff;
	background: $uni-color-primary;
	margin-right: 40px;
}

.add-style {
	display: flex;
	flex: 1;
	color: $uni-color-primary;
	font-size: $uni-font-size-lg;
	border: $uni-color-primary 1px solid;
	padding: 10px 0px;
	border-radius: 50px;
	margin: 10px;
	align-items: center;
	justify-content: center;
}
</style>
