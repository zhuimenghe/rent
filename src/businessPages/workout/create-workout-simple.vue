<template>
	<view class = "create-workout-bg">
		<create-step 
		processKey="expressWorkOut" 
		@submitApply="submit" 
		:orgId="dataDic.orgId" 
		:itemData="backDic" 
		@data-form="getBackData"
		:updateObj="dataDic" 
		:businessOwner="dataDic.customerSalesman"
		:isUpdate="isUpdate"
		>    
		   <baseInforMation
		   :dataDic='dataDic' 
		   @clickItem='clickItem'
		   @textChange="textChange"
		   />
		   <localeInforMation
		   :dataDic='dataDic' 
		   @clickItem='clickItem'
		   @deleteMachine="deleteMachine"
		   :isLX="isLiangXu"
		   />
		  <!-- <logisticsInforMation
		   :dataDic='dataDic' 
		   @clickItem='clickItem'
		   @textChange="textChange"
		   /> -->
		   <assginInforMation
		   :dataDic='dataDic' 
		   @clickItem='clickItem'
		   />
		   <otherInforMation
		   :dataDic='dataDic' 
		   @textChange="textChange"
		   />
		</create-step>
		<w-picker 
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		:mode="dateType" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="false"
		ref="date" 
		themeColor="#E60000" 
		/>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
import createStep from '@/components/workflow/create-step.vue';
import baseInforMation from './smple-workout/base-information.vue';
import localeInforMation from './smple-workout/locale-information.vue';
import logisticsInforMation from './smple-workout/logistics-information.vue';
import assginInforMation from './smple-workout/assign-information.vue';
import otherInforMation from './smple-workout/other-information.vue';
export default {
	components:{
		wPicker,
		createStep,
		baseInforMation,
		logisticsInforMation,
		assginInforMation,
		otherInforMation,
		localeInforMation
	},
	data() {
		return {
			orgList:[],
			userList:[],
			contractList:[],
			logisticsTypeList:[],
			selectType:'',
			selectList:[],
			checkList:[],
			dataDic:{
				logisticsType: '1',
				logisticsTypeName: '客户自运',
				outType: "1"
			},
			backDic:null,//退回null,
			tempList:[],
			isUpdate:false,
			dateType:'halfDate',
			isLiangXu:false
		};
	},
	onLoad(option) {
		//默认数据源
		let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
		this.orgList = [...resOrgList];
		let resUserList = uni.getStorageSync(this.$savekey.ALL_USER_LIST);
		// this.userList = [...this.$gxfmethod.getUserListWithType(resUserList,this.$savekey.USER_ROLE_BUSINESS)]
		this.userList = [...resUserList]
		let LXresData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (LXresData) {
			let liangxuData = LXresData.find(o => o.code === 'tenant_name')
			if (liangxuData) {
				this.isLiangXu = liangxuData.value === 'liangXu' ? true : false
			}
		}
		this.getCheckList();
		if(option.contract){
			let dict = JSON.parse(decodeURIComponent(option.contract))
			this.setContractData(dict);
		}
		if (this.userList.length > 0 && !this.dataDic.deliveryUser) {
			this.dataDic = { 
				...this.dataDic,
				deliveryUser: this.userList[0].value,
				deliveryUserName: this.userList[0].label
			};
		}
		if(option.item){
			this.backDic = JSON.parse(decodeURIComponent(option.item))
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			if(this.isUpdate){
				this.loadDetailData(this.backDic.businessNo);
			}
		}else{
			//单号
			this.getBusinessNo();
		}
		/*
		加载字典项配置
		*/
	   this.loadlogisticsType();
	   this.loadNotifice()//加载数据
	},
	onUnload() {
		this.offNotifice();
	},
	methods: {
		setContractData(contractObj) {
			this.dataDic = {
				...this.dataDic,
				orgId: contractObj.orgId,
				orgName: contractObj.orgName,
				customerSalesman: contractObj.contractDetailDto.customerSalesman,
				customerSalesmanName: contractObj.contractDetailDto.customerSalesmanName,
				contractDetailId: contractObj.contractDetailDto.id || '',
				contractNo: contractObj.businessNo || '',
				customerId: contractObj.customerId || '',
				customerName: contractObj.customerName || '',
				deliveryPlace: contractObj.contractDetailDto.deliveryPlace || '',
				projectName: contractObj.contractDetailDto.projectName,
				contactName: contractObj.customerType != '2' ? contractObj.contractDetailDto.contactName : '',
				phoneNum: contractObj.customerType != '2' ? contractObj.contractDetailDto.phoneNum : '',
			};
			console.log(contractObj.customerType)
			if (contractObj.customerType == '2') { //个人
				this.loadContractData();
			}
			this.getWorkOutOrderList();
		},
		//获取详情
		loadContractData() {
			let url = this.$url.LINKMAN_COMPANY_LIST + this.dataDic.customerId + '?dutyTypeSort=' + "4";
			this.$network.getData(url, 'GET').then(result => {
				let contact = result && result.length > 0 ? result[0] : {};
				this.contractList = [...result];
				this.dataDic = {
					...this.dataDic,
					contactName: contact.name,
					phoneNum: contact.phoneNum,
				};
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		deleteMachine(val){
			if(val.type == "delete"){
				uni.showModal({
					title:'提示',
					content:'确定要删除该设备么?',
					success: (res) => {
						if (res.cancel) {} else {
							this.dataDic = {
								...val.data
							}
						}
					}
				})
			}else if(val.type == "reset"){
				uni.showModal({
					title:'提示',
					content:'确定要恢复该类型设备么?',
					success: (res) => {
						if (res.cancel) {} else {
							let tempDic ={
								... this.tempList[val.data]
							}
							this.dataDic.orders.splice(val.data,1,tempDic)
						}
					}
				})
			}
			
		},
		clickItem(e){
			this.selectType = e;
			switch (this.selectType){
				case 'contract':
					uni.navigateTo({
						url: './workout-choose-contract?contractType=3&title=选择快捷合同'
					});
					break;
				case 'logisticsType':
					this.selectList = [...this.logisticsTypeList]
					this.$refs.selector.show()
					break;
				case 'deliveryUser':
					this.selectList = [...this.userList]
					this.$refs.selector.show()
					break;
				case 'logisticsCompany':
					uni.navigateTo({
						url: '/businessPages/workin/trans-company'
					});
					break;
				case 'transportMachine':
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-vehicle?isEdit=true&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportMachine ? this.dataDic.transportMachine : []))
					});
					break;
				case 'transportDriver':
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-driver?isEdit=true&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportDriver ? this.dataDic.transportDriver : []))
					});
					break;
				case 'endDate':
					this.dateType = "halfDate"
					this.$refs.date.show()
					break;
				case 'settleDate':
					this.dateType = "date"
					this.$refs.date.show()
					break;
				default:
					break;
			}
		},
		onConfirm(val){
			switch (this.selectType){
				case 'logisticsType':
					this.dataDic = {
						...this.dataDic,
						logisticsType: val.checkArr.value,
						logisticsTypeName: val.checkArr.label,
					};
					break;
				case 'deliveryUser':
					this.dataDic = {
						...this.dataDic,
						deliveryUser: val.checkArr.value,
						deliveryUserName: val.checkArr.label,
					};
					break;
				case 'endDate':
					this.dataDic = {
						...this.dataDic,
						endDate: val.result + ':00'
					};
					break;
				case 'settleDate':
					this.dataDic = {
						...this.dataDic,
						settleDate: val.result + ' 23:59:59'
					};
					break;
				default:
					break;
			}
		},
		/*输入框监听*/
		textChange(val){
			if(val.type == 'logisticsCarriage'){
				this.dataDic = {
					...this.dataDic,
					logisticsCarriage: val.data,
				}
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						logisticsCarriage: this.$gxfmethod.getMoneyPart(val.data),
					}
				}, 50);
			}else if(val.type == "fileList"){
				this.dataDic = {
					...this.dataDic,
					fileList: val.data,
				}
			}else if(val.type == "comment"){
				this.dataDic = {
					...this.dataDic,
					comment: val.data,
				}
			}else if(val.type == "deliveryPlace"){
				this.dataDic = {
					...this.dataDic,
					deliveryPlace: val.data,
				}
			}
		},
		loadNotifice(){
			uni.$on('choose-trans-emit', obj => {
				this.dataDic = {
					...this.dataDic,
					logisticsCompanyId: obj.dict.id,
					logisticsCompanyName: obj.dict.name,
					logisticsContact: obj.dict.contacts,
					logisticsPhone: obj.dict.phoneNum
				};
			});
			uni.$on('choosedDriver', obj => {
				this.dataDic = { 
					...this.dataDic,
					transportDriver: obj.data ? [...obj.data] : []
				};
			})
			uni.$on('choosedlogisticsVehicle', obj => {
				this.dataDic = { 
					...this.dataDic,
					transportMachine: obj.data ? [...obj.data] : []
				};
			})
			uni.$on('choose-check-emit', obj => {
				console.log(JSON.stringify(obj))
				let index = parseInt(obj.index)
				let mindex = parseInt(obj.mindex);
				let dict = obj.data?obj.data:{}
				this.dataDic.orders[index].machineList.splice(mindex,1,dict);
			});
			uni.$on('choose-address', result => {
				this.dataDic = {
					...this.dataDic,
					deliveryPlace: result.data.address,
					latitude: result.data.latitude,
					longitude:result.data.longitude,
					currentRadius: result.data.currentRadius
				};
			});
			uni.$on('choose-correlation', list => {
				// deliverIds  id保存关联的单据
				this.dataDic.deliverIds = list.map(o => o.id).join(',');
				//车辆数据
				let mBills = [...list]//选中的数据
				let notBillMs = [];//不存在的车辆数据
				let orders = []
				if (this.dataDic.orders && this.dataDic.orders.length > 0) {
					orders = [...this.dataDic.orders]
				}
				list.forEach(z => {
					let machines = z.dispatchMachines ? z.dispatchMachines : [];
					if (z.fileList && z.fileList.length > 0) {
						z.fileList.forEach(f => {
							let fileList = this.dataDic.fileList ? this.dataDic.fileList : [];
							if (!fileList.some(y => f.filePath == y.filePath)) {
								this.dataDic.fileList = [...fileList, {
									id: undefined,
									name: f.name || null,
									type: f.type || 'workout_type',
									uploadType: "attachment",
									uploadTypeName: null,
									fileDesc: "退场场类型附件",
									businessId: undefined,
									url: f.url,
									bucket: "nvr-temp",
									filePath: f.filePath
								}]
							}
						})
					}
					/* 交机单内的所有设备 */
					machines.forEach(o => {
						/*  1.判断当前设备型号是否否符合订单需求*/
						if (orders.some(y => y.type == o.type && y.height == o.machineHeight)) {
							let index = orders.findIndex(y => y.id == o.contractOrderId);
							let machineList = orders[index]&&orders[index].machineList ? orders[index].machineList : [];
							if (!machineList.some(x => x.licenseId == o.licenseId)) {
								let orderMachineList = this.dataDic.orders[index].machineList;
								orderMachineList.push(o);
								let item = {
									...this.dataDic.orders[index],
									machineList:orderMachineList
								}
								this.dataDic.orders.splice(index,1,item);
							}else{
								let orderMachineList = this.dataDic.orders[index].machineList;
								let machineindex = orderMachineList.findIndex(m => m.licenseId == o.licenseId);
								orderMachineList.splice(machineindex,1,o);
								let item = {
									...this.dataDic.orders[index],
									machineList:orderMachineList
								}
								this.dataDic.orders.splice(index,1,item);
							}
						} else {
							console.log('当前设备型号不符合订单需求')
							notBillMs.push(o);
						}
					})
				})
				if (notBillMs.length > 0) {
					uni.showModal({
						title: '提示',
						content: "已选接机单中有不符合退场的设备，是否查看？",
						confirmText: '确认',
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url:'/businessPages/service/not-machines?list=' + encodeURIComponent(JSON.stringify(notBillMs))
								})
							}
						},
					})
				}
			
			})
		},
		offNotifice(){
			uni.$off('choose-trans-emit');
			uni.$off('choosedDriver');
			uni.$off('choosedlogisticsVehicle');
			uni.$off('choose-check-emit');
			uni.$off('choose-address');
		},
		/*网络数据字典项*/
		//获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'KJTC')
			this.$network.getData(url, "GET", null).then((result) => {
				this.dataDic = {
					...this.dataDic,
					"businessNo": result,
					"contractType":'3',
					"contractTypeName":'快捷合同'
				}
			}).catch((err) => {})
		},
		//物流类型
		loadlogisticsType() {
			this.$network.loadUserType('logistics_type').then(result => {
				this.logisticsTypeList = result ? [...result] : [];
				if (result.length > 0 && !this.dataDic.logisticsType) {
					this.dataDic = { 
						...this.dataDic,
						logisticsType: result[0].value,
						logisticsTypeName: result[0].label
					};
				}
			}).catch(err => {});
		},
		getWorkOutOrderList() {
			uni.hideLoading();
			let param = {
				contractDetailId: this.dataDic.contractDetailId || '',
				contractNo: this.dataDic.contractNo || ''
			};
			let url = this.$url.WORK_OUT_ORDER_LEFT;
			this.$network.getData(url, 'GET', param).then(result => {
				let orderResult  = result.map(o=>{
					return {
						...o,
						machineList:[]
					}
				})
				this.getCanWorkOutMachines(orderResult)
				if(this.backDic){
					this.resetOrderList(orderResult);
				}
			}).catch(e => {
				uni.hideLoading();
			})
		},
		getCanWorkOutMachines(orderResult) {
			let param = {
				"workOutNo": this.dataDic.businessNo || '',
				"contractNo": this.dataDic.contractNo || ''
			}
			let url = this.$url.WORKED_MACHINE_LIST_BY_CONTRACT;
			this.$network.getData(url, 'GET', param).then(result => {
				this.resetDeviceData(orderResult,result)
				uni.hideLoading();
			}).catch(e => {
				uni.hideLoading();
			})
		},
		//获取订单和退回后数据的处理
		resetDeviceData(orderResult,machineresult){
			if(machineresult.length>0){
				let orders = [];
				orderResult.forEach((e) => {
					let idstr = e.id;
					let list = [];
					machineresult.forEach((o) => {
						let contractOrderId = o.contractOrderId;
						if (contractOrderId == idstr) {
							let dictR = {
								...o,
								licenseId: o.licenseId || "",
								machineBrand: o.machineBrand || "",
								machineType: o.machineType || "",
								machineTypeName: o.machineTypeName || "",
								printCode: o.printCode || "",
								machineHeight: o.machineHeight || "",
								workCheckResults: o.workCheckResults || "",
								orgName: o.orgName || "",
								orgId: o.orgId || "",
								address:o.address || "",
								workCheckResults:[...this.checkList]
							};
							list.push(dictR)
							
						}
					})
					let newdict = {
						...e,
						usedNum:list.length.toString(),
						machineList:[...list]
					}
					orders.push(newdict)
				})
				//退回的时候不构建
				if(!this.backDic){
					this.dataDic = {
						...this.dataDic,
						orders:[...orders]
					}
				}
				//退回的情况下只保留临时数据
				this.tempList = JSON.parse(JSON.stringify(orders));
			}else{
				//退回的时候不构建
				if(!this.backDic){
					this.dataDic = {
						...this.dataDic,
						orders:[...orderResult]
					}
				}
				//退回的情况下只保留临时数据
				this.tempList = JSON.parse(JSON.stringify(orderResult));
			}
		},
		getCheckList() {
			let param = {
				type: 'work'
			};
			this.$network.getData(this.$url.GET_CHECK_LISWT, 'GET', param).then(result => {
				this.checkList = result.map(o => {
					return {
						id: o.id,
						content: o.content,
						checked: true,
						remark:""
					};
				});	
			}).catch(err => {
				uni.hideLoading();
			});
		},
		//提交
		getBackData(val){
			let result = JSON.parse(val)
			let orderResult = result.orders || [];
			let machineresult = result.machines || []
			this.resetDetailDeviceData(orderResult,machineresult,result);
		},
		checkData(){
			if (!this.dataDic.contractNo) {
				this.showToast('请选择合同');
				return Promise.reject('fail');
			}
			if (!this.dataDic.endDate && !this.isLiangXu) {
				this.showToast('请选择接机时间');
				return Promise.reject('fail');
			}
			if (!this.dataDic.settleDate) {
				this.showToast('请选择结算时间');
				return Promise.reject('fail');
			}
			if (!this.dataDic.logisticsType) {
				this.showToast('请选择物流类型');
				return Promise.reject('fail');
			}
			if (this.dataDic.logisticsType=="2") {
				if(!this.dataDic.logisticsCompanyId){
					this.showToast('请选择物流公司');
					return Promise.reject('fail');
				}
			}
			if (this.dataDic.logisticsType=="3") {
				if(!this.dataDic.transportMachine){
					this.showToast('请选择物流车辆');
					return Promise.reject('fail');
				}
				if(!this.dataDic.transportDriver){
					this.showToast('请选择物流司机');
					return Promise.reject('fail');
				}
			}
			if (!this.dataDic.deliveryUserName) {
				this.showToast('请选择接机人');
				return Promise.reject('fail');
			}
			this.dataDic = {
				...this.dataDic,
				machines:this.resetCarListToMachines()
			}
			if (!this.dataDic.machines||this.dataDic.machines.length == 0) {
				this.showToast('请选择设备');
				return Promise.reject('fail');
			}
			if (this.dataDic.logisticsType!="1" && (!this.dataDic.logisticsCarriage || this.dataDic.logisticsCarriage=='')) {
				this.dataDic = {
					...this.dataDic,
					logisticsCarriage:"0.00"
				}
			}
			// console.log(JSON.stringify(this.dataDic))
			// return Promise.reject('fail');
			
			return new Promise((resolve, reject) => {
				this.checkMachines().then(res => {
					resolve('sucess')
				}).catch(e => {
					uni.showToast({
						icon: "none",
						title: e
					})
					reject('fail')
				});
			})
			// return Promise.resolve('success');
		},
		checkMachines() {
			let licenseIdList = this.dataDic.machines.map(o => {
				return o.licenseId
			})
			let param = {
				licenseIdList: licenseIdList,
				date: this.dataDic.settleDate,
				contractNo: this.dataDic.contractNo || ''
			};
			let url = this.$url.WORK_OUT_CHECK;
			return new Promise((resolve, reject) => {
				this.$network.getData(url, 'POST', param).then(result => {
					uni.hideLoading();
					if (result && result.length > 0) {
						reject('[' + result.join(',') + ']结算时间不得早于进场时间或上次结算时间')
					} else {
						resolve('sucess')
					}
		
				}).catch(e => {
					reject('fail')
					uni.hideLoading();
				})
			})
		},
		showToast(msg) {
			uni.showToast({
				title: msg,
				icon: 'none'
			});
		},
		submit(val){
			uni.showLoading({
				mask: true
			})
			this.$network.getData(this.$url.WORK_OUT_SIMPLE_ADD + val, 'POST', this.dataDic).then(result => {
				uni.$emit("refresh-contract-list", {
					type: 'workout'
				})
				uni.$emit("refresh-notification-list", {
					type: 'apply'
				})
				uni.navigateBack({
					animationDuration: 200
				});
				uni.hideLoading()
			}).catch(err => {
				uni.showToast({
					title: err.message,
					icon: 'none'
				});
			});
		},
		//提交订单的时候重组数据源
		resetCarListToMachines() {
			let machinesArr = [];
			this.dataDic.orders.forEach(item => {
				let machineList = item.machineList;
				let contractOrderId = item.id || '';
				let machineType = item.type || '';
				let machineTypeName = item.typeName || '';
				let machineHeight = item.height || '';
				let machineHeightName = item.heightName || '';
				machineList.forEach(machineitem => {
					let dict = {
						...machineitem,
						contractOrderId: contractOrderId,
						type: machineTypeName,
						typeName: machineitem.machineTypeName,
						machineHeight: machineHeight,
						machineHeightName: machineHeightName,
						machineId: machineitem.id,
						licenseId: machineitem.licenseId,
						printCode: machineitem.printCode,
						machineBrand: machineitem.machineBrand,
						workCheckResults: machineitem.workCheckResults,
					};
					machinesArr.push(dict);
				});
			});
			return machinesArr;
		},
		//获取详情
		loadDetailData(businessNo) {
			uni.showLoading();
			let param = {
				businessNo: businessNo,
			};
			let url = this.$url.WORK_OUT_DETAIL;
			this.$network.getData(url, 'GET', param).then(result => {
				let orderResult = result.orders || [];
				let machineresult = result.machines || []
				this.resetDetailDeviceData(orderResult,machineresult,result);
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		//处理详情中数据源
		resetDetailDeviceData(orderResult,machineresult,result){
			if(machineresult.length>0){
				let orders = [];
				orderResult.forEach((e) => {
					let idstr = e.id;
					let list = [];
					machineresult.forEach((o) => {
						let contractOrderId = o.contractOrderId;
						if (contractOrderId == idstr) {
							let dictR = {
								...o,
							};
							list.push(dictR)
						}
					})
					let newdict = {
						...e,
						machineList:[...list]
					}
					orders.push(newdict)
				})
				this.dataDic = {
					...this.dataDic,
					...result,
					orders:[...orders]
				}
			}
			// else{
			// 	this.dataDic = {
			// 		...this.dataDic,
			// 		...result,
			// 		orders:[...orderResult]
			// 	}
			// }
			this.getWorkOutOrderList();
		},
		resetOrderList(orderList){
			let dataOrderList = [...this.dataDic.orders];
			console.log(JSON.stringify(orderList))
			console.log(JSON.stringify(this.dataDic.orders))
			orderList.forEach(o=>{
				if(!dataOrderList.some(e=>{return e.id == o.id})){
					let macDic = {
						...o,
						machineList:[]
					}
					dataOrderList.push(macDic)
				}
			})
			this.dataDic = {
				...this.dataDic,
				orders:[...dataOrderList]
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.create-workout-bg{
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
	width: 100%;
	padding: 10px 0px;
}
</style>
