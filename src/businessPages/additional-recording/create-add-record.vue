<template>
	<view class="bg-view">
		<create-step
			processKey="workInOut"
			@submitApply="clicksave"
			:orgId="dataDic.orgId"
			:itemData="backDic"
			@data-form="getBackData"
			:updateObj="dataDic"
			:isUpdate="isUpdate"
		>
			<basePart :dataDic="dataDic" :isedit="true" @clickevent="clickevent" />
			<workinPart
				:dataDic="dataDic.workInDto"
				:isedit="true"
				:showassgin="showWorkinAssgin"
				@clickevent="clickevent"
			/>
			<workoutPart
				:dataDic="dataDic.workOutDto"
				:isedit="true"
				:showassgin="showWorkOutAssgin"
				@clickevent="clickevent"
			/>
			<devicePart
				:dataDic="dataDic"
				:isedit="true"
				@clickevent="clickevent"
				v-if="dataDic.orderList && dataDic.orderList.length > 0"
			/>
			<!-- 类型选择 -->
			<w-picker :selectList="selectList" @confirm="confirm" mode="selector" ref="selector" themeColor="#E60000" />
			<!-- 时间选择 -->
			<w-picker
				:mode="dateType"
				startYear="2000"
				endYear="3000"
				:current="true"
				@confirm="confirm"
				:disabledAfter="false"
				ref="date"
				themeColor="#E60000"
			/>
		</create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
//-----------------
import basePart from './add-record-part/base-part.vue';
import workinPart from './add-record-part/work-in-part.vue';
import workoutPart from './add-record-part/work-out-part.vue';
import devicePart from './add-record-part/device-part.vue';
import createStep from '@/components/workflow/create-step.vue';
export default {
	components: {
		wPicker,
		// -------------------
		basePart,
		workinPart,
		workoutPart,
		devicePart,
		createStep
	},
	data() {
		return {
			dataDic: {
				workInDto: {
					training: false
				},
				workOutDto: {}
			},
			backDic: null,
			isUpdate: false,
			//弹窗
			selectList: [],
			dateType: 'date',
			transArr: [], //物流类型
			assginList: [], //交机人
			//事件类型
			type: '',
			typeindex: 0,
			machineindex: 0,
			backNum: '1',
			showWorkinAssgin: true,
			showWorkOutAssgin: true
		};
	},
	onLoad(option) {
		this.loadTypeList();
		this.loadWorkFlow();
		this.backNum = option.num || '1';
		if (option.contract) {
			let contractDic = JSON.parse(decodeURIComponent(option.contract));
			this.setContractData(contractDic);
		}
		if (option.item) {
			uni.setNavigationBarTitle({
				title: '修改进退场补录'
			});
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			if (this.isUpdate) {
				this.getDetailWithNo();
			}
		} else {
			this.getBusinessNo(); //加载单号
		}
		this.loadAssginArr();
		//---------------监听------------------------
		uni.$on('choose-trans-emit', usnerinfo => {
			let transChooseDic = usnerinfo.dict;
			this.setLogCompany(transChooseDic, usnerinfo.type);
		});
		uni.$on('choose-address', obj => {
			let result = obj.data;
			this.setAddress(result, obj.type);
		});
		uni.$on('choosedDriver', obj => {
			let arr = obj.data ? [...obj.data] : [];
			this.setTransB('transportDriver', arr, obj.type);
		});
		uni.$on('choosedlogisticsVehicle', obj => {
			let arr = obj.data ? [...obj.data] : [];
			this.setTransB('transportMachine', arr, obj.type);
		});
	},
	onUnload() {
		uni.$off('choose-contract-emit');
		uni.$off('choose-trans-emit');
		uni.$off('choose-address');
		uni.$off('choosedDriver');
		uni.$off('choosedlogisticsVehicle');
	},
	methods: {
		//合同信息处理
		setContractData(dict) {
			let orderList = dict.contractDetailDto.orderList.map(o => {
				return {
					...o,
					machineList: []
				};
			});
			//获取用户信息
			uni.showLoading();
			let url = this.$url.LINKMAN_PERSON_CONNECT + dict.customerId + '?dutyTypeSort=4';
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					let contractDic = result.length > 0 ? result[0] : {};
					this.dataDic = {
						...this.dataDic,
						contractDetailId: dict.contractDetailDto.id || '', //合同详情ID
						contractNo: dict.businessNo || '', //合同单号
						customerId: dict.customerId || '', //客户id
						customerName: dict.customerName || '', //客户名称
						projectName: dict.contractDetailDto.projectName || '', //项目名称
						customerSalesman: dict.contractDetailDto.customerSalesman,
						customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
						orgId: dict.orgId,
						orgName: dict.orgName,
						contactName: contractDic.name || dict.contactName,
						phoneNum: contractDic.phoneNum || dict.phoneNum,
						orderList: orderList
					};
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//获取退回时的数据
		getBackData(val) {
			this.dataDic = {
				...JSON.parse(val)
			};
			this.getContractInfo(this.dataDic);
		},
		getDetailWithNo() {
			uni.showLoading();
			let param = {
				businessNo: this.backDic.businessNo
			};
			let url = this.$url.WORKIN_OUT_DETAIL;
			this.$network
				.getData(url, 'GET', param)
				.then(result => {
					this.dataDic = {
						...result
					};
					this.getContractInfo(result);
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getContractInfo(item) {
			let param = {
				contractDetailId: this.dataDic.contractDetailId
			};
			this.$network
				.getData(this.$url.WORK_INOUT_ORDERLIST, 'POST', param)
				.then(result => {
					let orderList = result || [];
					this.resetList(orderList, item);
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		// getContractInfo(item){
		// 	let param = {
		// 		businessNo: this.dataDic.contractNo
		// 	};
		// 	this.$network
		// 		.getData(this.$url.CONTRACT_DEATIL_BY_NO, 'GET', param)
		// 		.then(result => {
		// 			let orderList = result.contractDetailDto ? result.contractDetailDto.orderList : [];
		// 			this.resetList(orderList,item)
		// 		}).catch(err => {
		// 			uni.hideLoading();
		// 		});
		// },
		resetList(orders, item) {
			let machines = item.machines || [];
			orders.forEach(e => {
				let id = e.id;
				let list = [];
				machines.forEach(o => {
					let contractOrderId = o.contractOrderId;
					if (contractOrderId === id) {
						let dictR = {
							...o,
							workCheckResults: o.workCheckResults || []
						};
						list.push(dictR);
					}
				});
				e.machineList = [...list];
			});
			this.dataDic = {
				...this.dataDic,
				orderList: orders
			};
			uni.hideLoading();
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/contractapi/, 'contractapi').replace(/{type}/, 'JTBL');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...this.dataDic,
						businessNo: result
					};
				})
				.catch(err => {
					this.dataDic = {
						...this.dataDic,
						businessNo: ''
					};
				});
		},
		//交机人
		loadAssginArr() {
			let param = {
				orgId: this.dataDic.orgId,
				showAdmin: false,
				roleType: this.$savekey.USER_ROLE_SEVICER
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.assginList =
						result && result.length > 0
							? result.map(dict => {
									return {
										label: dict.username,
										value: dict.id
									};
							  })
							: [];
					let defaultAssign = {};
					let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
					if (resData && this.$gxfmethod.issameRoleType(resData, this.$savekey.USER_ROLE_SEVICER)) {
						defaultAssign = {
							label: resData.username,
							value: resData.id
						};
					} else {
						if (this.assginList.length > 0) {
							defaultAssign = {
								...this.assginList[0]
							};
						}
					}
					if (!this.dataDic || !this.dataDic.workInDto || !this.dataDic.workInDto.deliveryUser) {
						this.dataDic = {
							...this.dataDic,
							workInDto: {
								...this.dataDic.workInDto,
								deliveryUser: defaultAssign.value || '',
								deliveryUserName: defaultAssign.label || ''
							}
						};
					}
					if (!this.dataDic || !this.dataDic.workOutDto || !this.dataDic.workOutDto.deliveryUser) {
						this.dataDic = {
							...this.dataDic,
							workOutDto: {
								...this.dataDic.workOutDto,
								deliveryUser: defaultAssign.value || '',
								deliveryUserName: defaultAssign.label || ''
							}
						};
					}
				})
				.catch(err => {});
		},
		//加载物流类型
		loadTypeList() {
			uni.showLoading();
			this.$network
				.loadUserType('logistics_type')
				.then(result => {
					this.transArr = result.map(o => {
						return {
							label: o.label,
							value: o.value
						};
					});
					if (this.transArr.length > 0 && (this.dataDic.workInDto && !this.dataDic.workInDto.logisticsType)) {
						let dict = this.transArr[0];
						this.dataDic = {
							...this.dataDic,
							workInDto: {
								...this.dataDic.workInDto,
								logisticsType: dict.value.toString(),
								logisticsTypeName: dict.label
							},
							workOutDto: {
								...this.dataDic.workOutDto,
								logisticsType: dict.value.toString(),
								logisticsTypeName: dict.label
							}
						};
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//点击组件事件回传
		clickevent(val) {
			this.type = val.type || '';
			switch (val.type) {
				case 'value':
					let dic = val.data;
					this.dataDic = {
						...dic
					};
					break;
				case 'workinvalue':
					let workindic = val.data;
					this.dataDic = {
						...this.dataDic,
						workInDto: {
							...workindic
						}
					};
					break;
				case 'workoutvalue':
					let workoutdic = val.data;
					this.dataDic = {
						...this.dataDic,
						workOutDto: {
							...workoutdic
						}
					};
					break;
				case 'switch':
					this.dataDic = {
						...this.dataDic,
						workInDto: {
							...this.dataDic.workInDto,
							training: !this.dataDic.workInDto.training
						}
					};
					break;
				case 'workinassign':
					this.selectList = this.assginList ? this.assginList : [];
					this.$refs.selector.show();
					break;
				case 'workoutassign':
					this.selectList = this.assginList ? this.assginList : [];
					this.$refs.selector.show();
					break;
				case 'usetrans':
					this.selectList = this.transArr || [];
					this.$refs.selector.show();
					break;
				case 'workoutusetrans':
					this.selectList = this.transArr || [];
					this.$refs.selector.show();
					break;
				case 'workintime':
					this.typeindex = val.index;
					this.machineindex = val.mindex;
					this.datetype = 'date';
					this.$refs.date.show();
					break;
				case 'workouttime':
					this.typeindex = val.index;
					this.machineindex = val.mindex;
					this.datetype = 'date';
					this.$refs.date.show();
					break;
				default:
					break;
			}
		},
		//pick回调
		confirm(val) {
			switch (this.type) {
				case 'usetrans':
					this.dealTypeData('workin', val.checkArr);
					break;
				case 'workoutusetrans':
					this.dealTypeData('workout', val.checkArr);
					break;
				case 'workinassign':
					let workinassginDic = val.checkArr;
					this.dataDic = {
						...this.dataDic,
						workInDto: {
							...this.dataDic.workInDto,
							deliveryUser: workinassginDic.value,
							deliveryUserName: workinassginDic.label
						}
					};
					break;
				case 'workoutassign':
					let workoutassginDic = val.checkArr;
					this.dataDic = {
						...this.dataDic,
						workOutDto: {
							...this.dataDic.workOutDto,
							deliveryUser: workoutassginDic.value,
							deliveryUserName: workoutassginDic.label
						}
					};
					break;
				case 'workintime':
					let orderList = this.dataDic.orderList;
					let machinlist = orderList[this.typeindex].machineList || [];
					let machineDic = machinlist[this.machineindex];
					let newmachineDic = {
						...machineDic,
						beginDate: val.result + ' 00:00:00'
					};
					machinlist.splice(this.machineindex, 1, newmachineDic);
					let orderNewDic = {
						...orderList[this.typeindex],
						machineList: [...machinlist]
					};
					orderList.splice(this.typeindex, 1, orderNewDic);
					this.dataDic = {
						...this.dataDic,
						orderList: [...orderList]
					};
					break;
				case 'workouttime':
					let orderListout = this.dataDic.orderList;
					let machinlistout = orderListout[this.typeindex].machineList || [];
					let machineDicout = machinlistout[this.machineindex];
					let newmachineDicout = {
						...machineDicout,
						endDate: val.result + ' 23:59:59'
					};
					machinlistout.splice(this.machineindex, 1, newmachineDicout);
					let orderNewDicout = {
						...orderListout[this.typeindex],
						machineList: [...machinlistout]
					};
					orderListout.splice(this.typeindex, 1, orderNewDicout);
					this.dataDic = {
						...this.dataDic,
						orderList: [...orderListout]
					};
					console.log(JSON.stringify(this.dataDic));
					break;
				default:
					break;
			}
		},
		dealTypeData(t, transDic) {
			if (t === 'workin') {
				if (this.dataDic.workInDto && this.dataDic.workInDto.logisticsType != transDic.value) {
					this.dataDic = {
						...this.dataDic,
						workInDto: {
							...this.dataDic.workInDto,
							logisticsType: transDic.value,
							logisticsTypeName: transDic.label,
							logisticsCompanyId: transDic.value === 2 ? '' : undefined,
							logisticsCompanyName: transDic.value === 2 ? '' : undefined,
							logisticsContact: transDic.value === 2 ? '' : undefined,
							logisticsPhone: transDic.value === 2 ? '' : undefined,
							logisticsCarriage: '0',
							transportMachine: [],
							transportDriver: []
						}
					};
				}
			} else if (t === 'workout') {
				if (this.dataDic.workOutDto && this.dataDic.workOutDto.logisticsType != transDic.value) {
					this.dataDic = {
						...this.dataDic,
						workOutDto: {
							...this.dataDic.workOutDto,
							logisticsType: transDic.value,
							logisticsTypeName: transDic.label,
							logisticsCompanyId: transDic.value === 2 ? '' : undefined,
							logisticsCompanyName: transDic.value === 2 ? '' : undefined,
							logisticsContact: transDic.value === 2 ? '' : undefined,
							logisticsPhone: transDic.value === 2 ? '' : undefined,
							logisticsCarriage: '0',
							transportMachine: [],
							transportDriver: []
						}
					};
				}
			}
		},
		//数据监听
		checkData() {
			if (!this.dataDic.contractDetailId) {
				uni.showToast({
					title: '请选择合同',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.phoneNum && !this.$datestr.isphonenum(this.dataDic.phoneNum)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的联系人电话'
				});

				return Promise.reject('fail');
			}

			if (this.showWorkinAssgin && (!this.dataDic.workInDto || !this.dataDic.workInDto.deliveryUser)) {
				uni.showToast({
					title: '请选择进场交机人',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.workInDto || !this.dataDic.workInDto.deliveryPlace) {
				uni.showToast({
					title: '请选择交机地点',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.showWorkOutAssgin && (!this.dataDic.workOutDto || !this.dataDic.workOutDto.deliveryUser)) {
				uni.showToast({
					title: '请选择退场接机人',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.workOutDto || !this.dataDic.workOutDto.deliveryPlace) {
				uni.showToast({
					title: '请选择接机地点',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			//进场
			if (this.dataDic.workInDto && this.dataDic.workInDto.logisticsType === '2') {
				if (this.dataDic.workInDto.logisticsCompanyId === '' || !this.dataDic.workInDto.logisticsCompanyId) {
					uni.showToast({
						title: '请选择进场物流公司',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workInDto.logisticsContact === '' || !this.dataDic.workInDto.logisticsContact) {
					uni.showToast({
						title: '请输入物流联系人',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workInDto.logisticsPhone === '' || !this.dataDic.workInDto.logisticsPhone) {
					uni.showToast({
						title: '请输入物流联系人电话',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.$datestr.isphonenum(this.dataDic.workInDto.logisticsPhone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的物流联系人电话'
					});

					return Promise.reject('fail');
				}
				if (this.dataDic.workInDto.logisticsCarriage === '' || !this.dataDic.workInDto.logisticsCarriage) {
					uni.showToast({
						title: '请输入物流运费',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
			}
			if (this.dataDic.workInDto && this.dataDic.workInDto.logisticsType === '3') {
				if (!this.dataDic.workInDto.transportMachine || this.dataDic.workInDto.transportMachine.length === 0) {
					uni.showToast({
						title: '请选择进场物流车辆',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.workInDto.transportDriver || this.dataDic.workInDto.transportDriver.length === 0) {
					uni.showToast({
						title: '请选择进场物流司机',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workInDto.logisticsCarriage === '' || !this.dataDic.workInDto.logisticsCarriage) {
					uni.showToast({
						title: '请输入物流运费',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
			}
			//退场
			if (this.dataDic.workOutDto && this.dataDic.workOutDto.logisticsType === '2') {
				if (this.dataDic.workOutDto.logisticsCompanyId === '' || !this.dataDic.workOutDto.logisticsCompanyId) {
					uni.showToast({
						title: '请选择退场物流公司',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workOutDto.logisticsContact === '' || !this.dataDic.workOutDto.logisticsContact) {
					uni.showToast({
						title: '请输入物流联系人',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workOutDto.logisticsPhone === '' || !this.dataDic.workOutDto.logisticsPhone) {
					uni.showToast({
						title: '请输入联系人电话',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.$datestr.isphonenum(this.dataDic.workOutDto.logisticsPhone)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的物流联系人电话'
					});
				
					return Promise.reject('fail');
				}
				if (this.dataDic.workOutDto.logisticsCarriage === '' || !this.dataDic.workOutDto.logisticsCarriage) {
					uni.showToast({
						title: '请输入物流运费',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
			}
			if (this.dataDic.workOutDto && this.dataDic.workOutDto.logisticsType === '3') {
				if (
					!this.dataDic.workOutDto.transportMachine ||
					this.dataDic.workOutDto.transportMachine.length === 0
				) {
					uni.showToast({
						title: '请选择退场物流车辆',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.workOutDto.transportDriver || this.dataDic.workOutDto.transportDriver.length === 0) {
					uni.showToast({
						title: '请选择退场物流司机',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.workOutDto.logisticsCarriage === '' || !this.dataDic.workOutDto.logisticsCarriage) {
					uni.showToast({
						title: '请输入物流运费',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
			}
			//车辆
			let machinesArr = [];
			this.dataDic.orderList.forEach(item => {
				let machineList = item.machineList;
				let contractOrderId = item.id || '';
				let machineHeight = item.height || '';
				let machineTypeName = item.typeName || '';
				machineList.forEach(machineitem => {
					let dict = {
						...machineitem,
						contractOrderId: contractOrderId,
						machineHeight: machineitem.height
					};
					machinesArr.push(dict);
				});
			});
			if (machinesArr.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '请选择设备'
				});
				return Promise.reject('fail');
			}
			if (
				machinesArr.some(o => {
					return o.beginDate === '';
				}) ||
				machinesArr.some(o => {
					return o.endDate === '';
				})
			) {
				uni.showToast({
					icon: 'none',
					title: '请补全进场启用时间或退场结算时间'
				});
				return Promise.reject('fail');
			}
			this.dataDic = {
				...this.dataDic,
				machines: machinesArr
			};
			return new Promise((resolve, reject) => {
				this.checkMachines()
					.then(() => {
						resolve('success');
					})
					.catch(msg => {
						let licensStr = '';
						msg.forEach(o => {
							let licenseId = o.licenseId;
							if (licensStr === '') {
								licensStr = licenseId;
							} else {
								licensStr = licensStr + ',' + licenseId;
							}
						});
						uni.showToast({
							icon: 'none',
							title: licensStr + '进退场时间存在冲突，请修改',
							duration: 2500
						});
						reject('fail');
					});
			});
			// return Promise.resolve('success');
		},
		checkMachines() {
			let list = this.dataDic.machines.map(o => {
				return {
					beginDate: o.beginDate,
					endDate: o.endDate,
					licenseId: o.licenseId
				};
			});
			let url = this.$url.WORKIN_OUT_CHECK + this.dataDic.businessNo;
			return new Promise((resolve, reject) => {
				this.$network
					.getData(url, 'POST', list)
					.then(result => {
						if (result && result.length > 0) {
							reject(result);
						} else {
							resolve('sucess');
						}
					})
					.catch(e => {
						reject([]);
					});
			});
		},
		//确定按钮回调
		clicksave(val) {
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.WORKIN_OUT_CREATE + val, 'POST', this.dataDic)
				.then(result => {
					console.log(JSON.stringify(result));
					uni.$emit('refresh-additional-list', {});
					uni.showToast({
						icon: 'none',
						title: '创建补录单成功'
					});
					uni.navigateBack({
						delta: parseInt(this.backNum)
					});
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		//处理监听
		//处理物流公司
		setLogCompany(transChooseDic, type) {
			if (type === 'workin') {
				let dict = {};
				if (this.dataDic.logisticsCompanyId && this.dataDic.logisticsCompanyId === transChooseDic.id) {
					dict = {
						...this.dataDic.workInDto,
						logisticsCompanyId: transChooseDic.id,
						logisticsCompanyName: transChooseDic.name,
						logisticsContact: transChooseDic.contacts,
						logisticsPhone: transChooseDic.phoneNum,
						logisticsCarriage: this.dataDic.logisticsCarriage,
						transportMachine: [],
						transportDriver: []
					};
				} else {
					dict = {
						...this.dataDic.workInDto,
						logisticsCompanyId: transChooseDic.id,
						logisticsCompanyName: transChooseDic.name,
						logisticsContact: transChooseDic.contacts,
						logisticsPhone: transChooseDic.phoneNum,
						logisticsCarriage: '0',
						transportMachine: [],
						transportDriver: []
					};
				}
				this.dataDic = {
					...this.dataDic,
					workInDto: {
						...dict
					}
				};
			} else if (type === 'workout') {
				let dict = {};
				if (this.dataDic.logisticsCompanyId && this.dataDic.logisticsCompanyId === transChooseDic.id) {
					dict = {
						...this.dataDic.workOutDto,
						logisticsCompanyId: transChooseDic.id,
						logisticsCompanyName: transChooseDic.name,
						logisticsContact: transChooseDic.contacts,
						logisticsPhone: transChooseDic.phoneNum,
						logisticsCarriage: this.dataDic.logisticsCarriage,
						transportMachine: [],
						transportDriver: []
					};
				} else {
					dict = {
						...this.dataDic.workOutDto,
						logisticsCompanyId: transChooseDic.id,
						logisticsCompanyName: transChooseDic.name,
						logisticsContact: transChooseDic.contacts,
						logisticsPhone: transChooseDic.phoneNum,
						logisticsCarriage: '0',
						transportMachine: [],
						transportDriver: []
					};
				}
				this.dataDic = {
					...this.dataDic,
					workOutDto: {
						...dict
					}
				};
			}
		},
		//地址
		setAddress(result, type) {
			let dict = {
				deliveryPlace: result.address,
				latitude: result.latitude,
				longitude: result.longitude,
				radius: result.currentRadius
			};
			if (type === 'workin') {
				this.dataDic = {
					...this.dataDic,
					workInDto: {
						...this.dataDic.workInDto,
						...dict
					}
				};
			} else if (type === 'workout') {
				this.dataDic = {
					...this.dataDic,
					workOutDto: {
						...this.dataDic.workOutDto,
						...dict
					}
				};
			}
		},
		//处理车辆信息数据
		setTransB(type, list, t) {
			let dict = {};
			switch (type) {
				case 'transportMachine':
					dict = {
						transportMachine: [...list]
					};
					break;
				case 'transportDriver':
					dict = {
						transportDriver: [...list]
					};
					break;
				default:
					break;
			}
			if (t === 'workin') {
				this.dataDic = {
					...this.dataDic,
					workInDto: {
						...this.dataDic.workInDto,
						...dict
					}
				};
			} else if (t === 'workout') {
				this.dataDic = {
					...this.dataDic,
					workOutDto: {
						...this.dataDic.workOutDto,
						...dict
					}
				};
			}
		},
		loadWorkFlow() {
			this.workflowcommon.getApplyAllProcessNode('workIn').then(result => {
				if (result.length > 0) {
					let fromKeyStr = '';
					result.forEach(o => {
						fromKeyStr = fromKeyStr + o.formKey;
					});
					if (fromKeyStr.indexOf('assignee') == -1) {
						this.showWorkinAssgin = false; //assignee
					}
				}
			});
			this.workflowcommon.getApplyAllProcessNode('workOut').then(result => {
				if (result.length > 0) {
					let fromKeyStr = '';
					result.forEach(o => {
						fromKeyStr = fromKeyStr + o.formKey;
					});
					if (fromKeyStr.indexOf('assignee') == -1) {
						this.showWorkOutAssgin = false; //assignee
					}
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.bg-view {
	width: 100%;
	background: $uni-bg-color-grey;
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
	background: #ffffff;
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
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
