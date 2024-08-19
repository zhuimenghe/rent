<template>
	<view class = "create-workout-bg">
		<create-step 
		processKey="expressWorkIn" 
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
		   <deviceInforMation
		   :dataDic='dataDic' 
		   @deleteItem='deleteMachine'
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
import baseInforMation from './workin-simple/base-information.vue';
import deviceInforMation from './workin-simple/device-information.vue';
// import logisticsInforMation from './workin-simple/logistics-information.vue';
import assginInforMation from './workin-simple/assign-information.vue';
import otherInforMation from './workin-simple/other-information.vue';
import calRent from '@/common/util/cal-rent-money.js';
export default {
	components:{
		wPicker,
		createStep,
		baseInforMation,
		deviceInforMation,
		// logisticsInforMation,
		assginInforMation,
		otherInforMation
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
			settlementTypeList:[],//租赁方式
			carriageTypesList:[],//运费类型
			dataDic:{
				logisticsType: '1',
				logisticsTypeName: '客户自运',
				training: false
			},
			backDic:null,//退回null,
			tempList:[],
			isUpdate:false,
			dateType:'halfDate',
			isLiangXu:false,
			selectIndex:0
		};
	},
	onLoad(option) {
		//默认数据源
		let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
		this.orgList = [...resOrgList];
		let resUserList = uni.getStorageSync(this.$savekey.ALL_USER_LIST);
		this.userList = [...resUserList]
		let LXresData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
		if (LXresData) {
			let liangxuData = LXresData.find(o => o.code === 'tenant_name')
			if (liangxuData) {
				this.isLiangXu = liangxuData.value === 'liangXu' ? true : false
			}
		}
	
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
	   this.getCheckList();//点检项目
	   this.loadSettlementTypes();//租赁方式
	   this.loadcarriageTypes();//运费类型
	   // this.loadlogisticsType();//物流
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
				expressList:[]
			};
			if (contractObj.customerType == '2') {
				this.loadContractData();
			}
			// this.getWorkOutOrderList();
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
		//删除设备/恢复设备
		deleteMachine(val){
			if(val.type == "delete"){
				this.dataDic.expressList.splice(val.data, 1);
			}else if(val.type == "scan"){
				this.dataDic = {
					...val.data
				}
			}
		},
		clickItem(e){
			this.selectType = e;
			switch (this.selectType){
				case 'contract':
				//选择合同
					uni.navigateTo({
						url: './workout-choose-contract?contractType=3&title=选择快捷合同'
					});
					break;
				case 'training':
				//人员培训
					this.dataDic = {
						...this.dataDic,
						training: !this.dataDic.training
					}
					break;
				case 'logisticsType':
				//物流类型
					this.selectList = [...this.logisticsTypeList]
					this.$refs.selector.show()
					break;
				case 'deliveryUser':
				//接机人
					this.selectList = [...this.userList]
					this.$refs.selector.show()
					break;
				case 'logisticsCompany':
				//公司
					uni.navigateTo({
						url: '/businessPages/workin/trans-company'
					});
					break;
				case 'transportMachine':
				//设备
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-vehicle?isEdit=true&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportMachine ? this.dataDic.transportMachine : []))
					});
					break;
				case 'transportDriver':
				//司机
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-driver?isEdit=true&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportDriver ? this.dataDic.transportDriver : []))
					});
					break;
				case 'beginDate':
					this.dateType = "halfDate"
					this.$refs.date.show()
					break;
				case 'enableDate':
					this.dateType = "date"
					this.$refs.date.show()
					break;
				case 'outStoreDate':
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
				//物流类型
					this.dataDic = {
						...this.dataDic,
						logisticsType: val.checkArr.value,
						logisticsTypeName: val.checkArr.label,
					};
					break;
				case 'deliveryUser':
				//接机人
					this.dataDic = {
						...this.dataDic,
						deliveryUser: val.checkArr.value,
						deliveryUserName: val.checkArr.label,
					};
					break;
				case 'beginDate':
					this.dataDic = {
						...this.dataDic,
						enableDate: val.result + ':00',
						beginDate: val.result + ':00',
						outStoreDate: val.result + ':00',
					};
					break;
				case 'enableDate':
					this.dataDic = {
						...this.dataDic,
						enableDate: val.result + ' 00:00:00',
						beginDate: val.result + ' 00:00:00',
						outStoreDate: val.result + ' 00:00:00',
					};
					break;
				case 'outStoreDate':
					this.dataDic = {
						...this.dataDic,
						enableDate: val.result + ' 00:00:00',
						beginDate: val.result + ' 00:00:00',
						outStoreDate: val.result + ' 00:00:00',
					};
					break;
				default:
					break;
			}
		},
		textChange(val){
			if(val.type == 'logisticsCarriage'){
				//物流费
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
				//附件
				this.dataDic = {
					...this.dataDic,
					fileList: val.data,
				}
			}else if(val.type == "comment"){
				//备注
				this.dataDic = {
					...this.dataDic,
					comment: val.data,
				}
			}
		},
		loadNotifice(){
			//合同
			uni.$on('choose-contract-emit', usnerinfo => {
				this.setContractData(usnerinfo.dict);
			});
			//地址
			uni.$on('choose-address', result => {
				this.dataDic = {
					...this.dataDic,
					deliveryPlace: result.data.address,
					latitude: result.data.latitude,
					longitude:result.data.longitude,
					currentRadius: result.data.currentRadius
				};
			});
			//物流公司
			uni.$on('choose-trans-emit', obj => {
				this.dataDic = {
					...this.dataDic,
					logisticsCompanyId: obj.dict.id,
					logisticsCompanyName: obj.dict.name,
					logisticsContact: obj.dict.contacts,
					logisticsPhone: obj.dict.phoneNum
				};
			});
			//物流司机
			uni.$on('choosedDriver', obj => {
				this.dataDic = { 
					...this.dataDic,
					transportDriver: obj.data ? [...obj.data] : []
				};
			})
			//物流车辆
			uni.$on('choosedlogisticsVehicle', obj => {
				this.dataDic = { 
					...this.dataDic,
					transportMachine: obj.data ? [...obj.data] : []
				};
			})
			//选择进场车辆
			uni.$on('choose-simple-device', deviceList => {
				this.dealListWithChoose(deviceList);
			})
			//编辑进场车辆
			uni.$on("edit-item-device",obj=>{
				let type = obj.type;
				if(type == 'delete'){
					let indexnum = obj.index;
					this.dataDic.expressList.splice(indexnum, 1);
				}else{
					let indexnum = obj.index;
					this.dataDic.expressList.splice(indexnum, 1,obj.data);
				}
			})
		},
		offNotifice(){
			uni.$off('choose-address');
			uni.$off('choose-trans-emit');
			uni.$off('choosedDriver');
			uni.$off('choosedlogisticsVehicle');
			uni.$off('choose-simple-device');
			uni.$off('edit-item-device');
		},
		//处理选择车辆的返回
		dealListWithChoose(arr){
			let expressList = this.dataDic.expressList || [];
			if (arr&&arr.length>0) {
				let list = arr.map(item => {
					let filterlist = expressList.filter(o => {
						return o.licenseId == item.licenseId;
					});
					if (filterlist.length == 1) {
						return filterlist[0];
					} else {
						let lastWorkOutDate = "";
						let beginDate = this.dataDic.enableDate;
						if(item.lastWorkOutDate&&item.lastWorkOutDate!=null){
							lastWorkOutDate = item.lastWorkOutDate;
							let lastStr = calRent.AddsubDays(lastWorkOutDate,1);
							beginDate = lastStr + " 00:00:00";
						}
						return {
							...item,
							"printCode": item.printCode,
							"licenseId": item.licenseId,
							"type": item.type,
							"typeName": item.typeName,
							"height": item.machineHeight,
							"heightName": item.machineHeightName,
							"machineType":item.machineTypeId,
							"machineTypeName":item.machineTypeName,
							"machineBrand":item.machineBrand,
							"beginDate":beginDate,
							"surplusDay":"",
							"tenancy":"",
							"endDate":"",
							"settlementType":this.settlementTypeList[0].value,
							"settlementTypeName":this.settlementTypeList[0].label,
							"hire":"",
							"carriageType":this.carriageTypesList[0].value,
							"carriageTypeName":this.carriageTypesList[0].label,
							"hireMonthly":"0",
							"total":"0",
							"carriage":"0",
							"pledge":"0",
							lastWorkOutDate:lastWorkOutDate,
							workCheckResults: this.checkList,
						};
					}
				});
				this.dataDic = {
					...this.dataDic,
					expressList: [...list]
				};
			}
		},
		/*网络数据字典项*/
		//获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'KJJC')
			this.$network.getData(url, "GET", null).then((result) => {
				let nowDate = this.$gxfmethod.getnowdateSS()
				this.dataDic = {
					...this.dataDic,
					"businessNo": result,
					enableDate: this.changestr(nowDate) + ' 00:00:00',
					beginDate: this.changestr(nowDate) + ' 00:00:00',
					outStoreDate: this.changestr(nowDate) + ' 00:00:00',
				}
			}).catch((err) => {})
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
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
		//点检内容
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
			// console.log(JSON.stringify(this.dataDic))
			this.dataDic = {
				...this.dataDic
			}
			if (!this.dataDic.contractNo) {
				this.showToast('请选择合同');
				return Promise.reject('fail');
			}
			if (!this.dataDic.enableDate) {
				this.showToast('请选择进场启用时间');
				return Promise.reject('fail');
			}
			if (!this.dataDic.deliveryUserName) {
				this.showToast('请选择接机人');
				return Promise.reject('fail');
			}
			if (!this.dataDic.expressList||this.dataDic.expressList.length == 0) {
				this.showToast('请选择进场设备');
				return Promise.reject('fail');
			}
			let isfail = true;
			this.dataDic.expressList.forEach((o)=>{
				if((o.settlementType == '4' || o.settlementType == '6') && (o.hireMonthly == '' || parseFloat(o.hireMonthly) == 0)){
					isfail = false;
				}else if(o.hire == '' || Number.parseFloat(o.hire) == 0){
					isfail = false;
				}
			})
			if (!isfail) {
				this.showToast('租金必须大于0');
				return Promise.reject('fail');
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
		},
		checkMachines() {
			let licenseIdList = this.dataDic.expressList.map(o => {
				return o.licenseId
			})
			let param = {
				licenseIdList: licenseIdList,
				date: this.dataDic.enableDate,
				contractNo: this.dataDic.contractNo || ''
			};
			let url = this.$url.WORK_IN_CHECK;
			return new Promise((resolve, reject) => {
				this.$network.getData(url, 'POST', param).then(result => {
					uni.hideLoading();
					if (result && result.length > 0) {
						reject('启用时间必须晚于[' + result.join(',') + ']上次退场时间')
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
			this.$network.getData(this.$url.WORK_IN_SIMPLE_ADD + val, 'POST', this.dataDic).then(result => {
				uni.$emit("refresh-contract-list", {
					type: 'workin'
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
			this.dataDic = {
				...result,
			}
			// if(machineresult.length>0){
			// 	let orders = [];
			// 	orderResult.forEach((e) => {
			// 		let idstr = e.id;
			// 		let list = [];
			// 		machineresult.forEach((o) => {
			// 			let contractOrderId = o.contractOrderId;
			// 			if (contractOrderId == idstr) {
			// 				let dictR = {
			// 					...o,
			// 				};
			// 				list.push(dictR)
			// 			}
			// 		})
			// 		let newdict = {
			// 			...e,
			// 			machineList:[...list]
			// 		}
			// 		orders.push(newdict)
			// 	})
			// 	this.dataDic = {
			// 		...this.dataDic,
			// 		...result,
			// 		orders:[...orders]
			// 	}
			// }
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
