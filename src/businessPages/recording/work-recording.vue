<template>
	<view class="bg-view">
		<logisticsrecording 
		:dataDic="workrecordDic" 
		:isedit="isedit" 
		@clickevent="clickevent" 
		/>
		<dispatchrecording
		v-if="workrecordDic.contractNo"
		:dataDic="workrecordDic" 
		:isedit="isedit" 
		@clickevent="clickevent" 
		/>
		<!-- 底部按钮提交 -->
		<view style="height: 80px;width: 100%;"></view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle">
				<text>{{ canclestr }}</text>
			</view>
			<view class="bottom-right-view" @click="clicksave">
				<text>{{ okstr }}</text>
			</view>
		</view>

		<!-- 类型选择 -->
		<w-picker 
		:selectList="selectList" 
		@confirm="dialog" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		<!-- 时间选择 -->
		<w-picker 
		:mode="datetype" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="confirm" 
		:disabledAfter="false"
		ref="date"
		themeColor="#E60000" 
		/>

		<!-- 确定弹窗 -->
		<alertPopup 
		ref="aletrview"
		@getAssignList="getAssignList" 
		:mask-click="false" 
		:orgId="workrecordDic.orgId" 
		/>
		<backPopup 
		ref="backview" 
		@choosNode="choosNode" 
		:mask-click="false" 
		:itemDataid="itemDict.id" 
		:procDefId="itemDict.procDefId"
		urlapi="contractapi" 
		:isFilter="true" 
		/>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
	import backPopup from '@/components/common/uni-popup/back-pop.vue';
	import calRent from '@/common/util/cal-rent-money.js';
	//-----------------
	import logisticsrecording from './logistics-recording.vue'
	import dispatchrecording from './dispatch-recording.vue'
	export default {
		components: {
			wPicker,
			uniPopup,
			alertPopup,
			backPopup,
			// ===========
			logisticsrecording,
			dispatchrecording
		},
		data() {
			return {
				workrecordDic: {
					workInDto:{},
					workOutDto:{}
				},
				selectList: [], //筛选时数据源
				type: "", //点击的类型
				datetype: 'date', //时间选择器的类型
				transArr: [], //物流类型列表
				isedit:true,
				
				canclestr: "取消", //通过流程判断
				okstr: "确定", //通过流程判断
				
				alist: [], //选择指派人员
				
			}
		},
		onLoad(option) {
			this.loadTypeList(); //加载物流类型
			this.getBusinessNo();
		},
		onUnload() {
			uni.$off('choose-contract-emit');
			uni.$off('choose-workincar-emit');
			uni.$off('choose-trans-emit');
		},
		methods: {
			// 获取单号
			getBusinessNo() {
				let url = this.$url.CREATE_BUSINESS_NO.replace(/contractapi/, "contractapi").replace(/{type}/, 'JTBL')
				this.$network.getData(url, "GET", null).then((result) => {
					this.workrecordDic = {
						...this.workrecordDic,
						businessNo: result
					};
				}).catch((err) => {
					this.workrecordDic = {
						...this.workrecordDic,
						businessNo: ""
					};
				})
			},
			//根据businessNo获取详情
			getDetailWithNo(businessNo,backType) {
				uni.showLoading();
				let param = {
					businessNo: businessNo
				};
				let url = this.$url.WORK_IN_DETAIL;
				this.$network.getData(url, 'GET', param).then(result => {
					this.workrecordDic = result;
					this.dealData(result)
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			//数据处理当machine中带有数据
			dealData(dict) {
				let list = [];
				dict.orders.forEach(e => {
					let newdic = {
						...e,
						machineList: []
					}
					list.push(newdic)
				});
				this.workrecordDic = {
					...this.workrecordDic,
					beginDate: this.workrecordDic.beginDate || this.workrecordDic.preBeginDate,
					enableDate: this.workrecordDic.enableDate || this.workrecordDic.preEnableDate,
					orders: list
				}
				this.dealDDCarList(this.workrecordDic);
			},
			// -----
			//数据处理当machine中带有数据
			dealDDCarList(dict) {
				let machines = dict.machines || []
				if (machines.length > 0) {
					let orders = dict.orders;
					orders.forEach((e) => {
						let id = e.id;
						let list = [];
						machines.forEach((o) => {
							let contractOrderId = o.contractOrderId;
							if (contractOrderId === id) {
								let dictR = {
									licenseId: o.licenseId || "",
									machineBrand: o.machineBrand || "",
									machineType: o.machineType || "",
									machineTypeName: o.machineTypeName || "",
									printCode: o.printCode || "",
									machineHeight: o.machineHeight || "",
									workCheckResults: o.workCheckResults || "",
									orgName: o.orgName || "",
									orgId: o.orgId || ""

								};
								list.push(dictR)
							}
						})
						e.machineList = [...list];
					})
					this.workrecordDic = {
						...this.workrecordDic,
						orders: orders
					}
				}
			},
			//点击事件回传
			clickevent(val) {
				switch (val.type) {
					case 'jclogisticsType':
						this.type = val.type;
						this.selectList = this.transArr || [];
						this.$refs.selector.show();
						break;
					case 'jcassign':
						this.type = val.type;
						this.loadAssginArr(this.workrecordDic)
						break
					case 'tclogisticsType':
						this.type = val.type;
						this.selectList = this.transArr || [];
						this.$refs.selector.show();
						break;
					case 'tcassign':
						this.type = val.type;
						this.loadAssginArr(this.workrecordDic)
						break
					case 'carbegin':
						this.type = 'carbegin';
						this.timeIndex = val.index
						this.datetype = 'date';
						this.$refs.date.show();
						break;
					case 'carend':
						this.type = 'carend';
						this.timeIndex = val.index
						this.datetype = 'date';
						this.$refs.date.show();
						break;
					case 'value':
						let dic = val.data;
						this.workrecordDic = {
							...dic
						}
						break;
					default:
						break;
				}
			},
			//加载物流类型
			loadTypeList() {
				uni.showLoading();
				this.$network.loadUserType('logistics_type').then(result => {
					this.transArr = result.map(o => {
						return {
							label: o.label,
							value: o.value
						};
					});
					if (this.transArr.length > 0) {
						let dict = this.transArr[0]
						this.workrecordDic = {
							...this.workrecordDic,
							workInDto:{
								logisticsType: dict.value.toString(),
								logisticsTypeName: dict.label
							},
							workOutDto:{
								logisticsType: dict.value.toString(),
								logisticsTypeName: dict.label
							}
						}
					}
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			//加载交接人
			loadAssginArr(val){
				let param = {
					orgId: val.orgId,
					showAdmin: false,
					roleType: this.$savekey.USER_ROLE_SEVICER
				}
				this.$network.getData(this.$url.USER_LEADERS, 'GET', param).then(result => {
					let list = result;
					let assginArr = list.map(dict => {
						return {
							label: dict.username,
							value: dict.id
						};
					});
					this.selectList = assginArr || [];
					this.$refs.selector.show();	
				}).catch(err => {
					uni.hideLoading()
				});
			},
			//弹窗费非时间
			dialog(val) {
				switch (this.type) {
					case 'jclogisticsType':
						let jctransDic = val.checkArr;
						this.workrecordDic = {
							...this.workrecordDic,
							workInDto:{
								...this.workrecordDic.workInDto,
								logisticsType: jctransDic.value,
								logisticsTypeName: jctransDic.label
							}
						}
						break;
					case 'jcassign':
						let jcassginDic = val.checkArr;
						this.workrecordDic = {
							...this.workrecordDic,
							workInDto:{
								...this.workrecordDic.workInDto,
								deliveryUser: jcassginDic.value,
								deliveryUserName: jcassginDic.label
							}
						}
						break
					case 'tclogisticsType':
						let tctransDic = val.checkArr;
						this.workrecordDic = {
							...this.workrecordDic,
							workOutDto:{
								...this.workrecordDic.workOutDto,
								logisticsType: tctransDic.value,
								logisticsTypeName: tctransDic.label
							}
						}
						break;
					case 'tcassign':
						let tcassginDic = val.checkArr;
						this.workrecordDic = {
							...this.workrecordDic,
							workOutDto:{
								...this.workrecordDic.workOutDto,
								deliveryUser: tcassginDic.value,
								deliveryUserName: tcassginDic.label
							}
						}
						break
					default:
						break;
				}
			},
			//日历回调
			confirm(e) {
				switch (this.type) {
					case 'carbegin':
						let choosetypeArr = this.workrecordDic.orders;
						choosetypeArr[this.timeIndex] = {
							...choosetypeArr[this.timeIndex],
							endDate: choosetypeArr[this.timeIndex].endDate,
							beginDate: e.result + " 00:00:00"
						};
						this.workrecordDic = {
							...this.workrecordDic,
							orders: [...choosetypeArr]
						}
						// this.calMoney();
						break;
					case 'carend':
						let list = this.workrecordDic.orders;
						console.log(JSON.stringify(list))
						list[this.timeIndex] = {
							...list[this.timeIndex],
							beginDate: list[this.timeIndex].beginDate,
							endDate: e.result + " 23:59:59"
						};
						this.workrecordDic = {
							...this.workrecordDic,
							orders: [...list]
						}
						// this.calMoney();
						break;
					default:
						break;
				}
			},
			calMoney() {
				let choosetypeArr = this.workrecordDic.orders;
				choosetypeArr.forEach(o => {
					calRent.calculateTotalWithHMS(o)
				});
				this.workrecordDic = {
					...this.workrecordDic,
					orders: [...choosetypeArr]
				}
			},
			//时间处理
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			//---------------------------------------------------------------------------------------------------------------------
			//右边按钮
			clicksave() {
				if (this.checkData()) {
					if (this.limitsDict.applyEdit) {
						//申请调用提交接口
						this.httprequestData()
					} else {
						//其他调用通过接口
						this.httprequestThougth()
					}
				}
			},
			//左边按钮
			clickecancle() {
				if (this.limitsDict.applyEdit) {
					//申请返回
					uni.navigateBack({
						delta: 1
					});
				} else {
					//其他调用退回
					this.$refs.backview.open();
				}
			},
			//提交
			httprequestData() {
				uni.showLoading({
					mask: true
				});
				this.workflowcommon.iswf('workIn').then(iswf => {
					if (iswf) {
						this.workflowcommon
							.getFirstNodeUser('contractapi', 'workIn',
								this.workrecordDic.orgId,
								this.workrecordDic.customerSalesman,
								this.workrecordDic.logisticsType)
							.then(showToast => {
								if (showToast) {
									uni.hideLoading();
									this.$refs.aletrview.open();
								} else {
									if (this.itemDict && this.itemDict.taskState === "back") {
										this.thoughSaveData([], '');
									} else {
										let assnstr = this.workflowcommon.submitData(false, []);
										this.submitSaveData(assnstr);
									}
								}
							})
							.catch(error => {
								uni.showToast({
									title: error.message
								});
							});
					} else {
						this.submitSaveData('');
					}
				});
			},
			// 通过
			httprequestThougth() {
				if (this.limitsDict.assigneeEdit && !this.limitsDict.deliverEdit) {
					//第三步直接走通过接口，添加交机人员为下个节点审批人员
					this.thoughSaveData([this.workrecordDic.deliveryUser], '');
				} else {
					//其他非申请时候判断
					uni.showLoading({
						mask: true
					});
					this.workflowcommon
						.getPassNodeUser('contractapi', this.itemDict.procInstId, this.workrecordDic.orgId)
						.then(showToast => {
							if (showToast) {
								this.$refs.aletrview.open();
								uni.hideLoading();
							} else {
								this.thoughSaveData([], '');
							}
						})
						.catch(error => {
							uni.showToast({
								icon: "none",
								title: error.message
							});
						});
				}
			},
			//弹窗提示返回
			getAssignList(val) {
				this.alist = val.selectArr;
				let remarkstr = val.remark;
				uni.showLoading({
					mask: true
				});
				if (this.limitsDict.applyEdit) {
					if (this.itemDict && this.itemDict.taskState === "back") {
						let ids = [];
						this.alist.forEach(o => {
							ids.push(o.id);
						});
						this.thoughSaveData(ids, remarkstr);
					} else {
						let assnstr = this.workflowcommon.submitData(true, this.alist);
						this.submitSaveData(assnstr);
					}

				} else {
					let ids = [];
					this.alist.forEach(o => {
						ids.push(o.id);
					});
					this.thoughSaveData(ids, remarkstr);
				}
			},
			//提交接口
			submitSaveData(val) {
				let url = this.$url.WORK_IN_CREATE + val;
				this.$network.getData(url, 'POST', this.workrecordDic).then(result => {
					uni.$emit('refresh-contract-list', {
						type: "workin"
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				}).catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
			},
			//通过接口
			thoughSaveData(val, inputstr) {
				let jsonstr = JSON.stringify(this.workrecordDic);
				this.workflowcommon
					.passapply('contractapi',
						val,
						inputstr,
						jsonstr,
						this.itemDict.procDefId,
						this.itemDict.procInstId,
						this.itemDict.id)
					.then(showToast => {
						uni.$emit("refresh-notification-list", {
							type: 'wait'
						})
						uni.navigateBack({
							animationDuration: 200
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
			//检验必填项
			checkData() {
				return true
			},
			//当时交车或者调度的时候判断一下是否选车
			resetCarListTo() {
				let machinesArr = [];
				this.workrecordDic.orders.forEach(item => {
					let machineList = item.machineList;
					let contractOrderId = item.id || '';
					let machineHeight = item.height || '';
					let machineTypeName = item.typeName || '';
					machineList.forEach(machineitem => {
						let dict = {
							contractOrderId: contractOrderId,
							licenseId: machineitem.licenseId,
							machineId: machineitem.id,
							machineBrand: machineitem.machineBrand,
							machineHeight: machineitem.machineHeight,
							machineType: machineTypeName,
							machineTypeName: machineitem.machineTypeName,
							printCode: machineitem.printCode,
							state: machineitem.state,
							stateName: machineitem.stateName,
							orgId: machineitem.orgId,
							orgName: machineitem.orgName,
							workCheckResults: machineitem.workCheckResults,
							storeCheckResults: machineitem.storeCheckResults,
						};
						machinesArr.push(dict);
					});
				});
				if (machinesArr.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择设备'
					});
					return false;
				}
				this.workrecordDic = {
					...this.workrecordDic,
					machines: machinesArr
				}
				return true
			},
			//退回========================================================
			choosNode(val) {
				console.log(val);
				let dict = val.selectArr;
				let remarkstr = val.remark;
				this.backTask(dict, remarkstr);
			},
			backTask(val, backInput) {
				if (!val.id) {
					uni.showToast({
						title: '退回节点不能为空',
						icon: 'none'
					});
					return;
				}
				this.workflowcommon.getApplyProcessNode('workIn').then((result) => {
					let jsonstr = JSON.stringify(this.workrecordDic)
					this.workflowcommon.backTask('contractapi', val.id, backInput, this.itemDict.id, val.procInstId, jsonstr).then(() => {
						uni.$emit("refresh-notification-list", {
							type: 'wait'
						})
						uni.showToast({
							title: '退回成功',
							icon: 'none'
						});
						uni.navigateBack({
							delta: 1
						});
					}).catch(() => {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						});
					});
				})
			}
		}
	}
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
	.export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		border-radius: 4px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
		border: 1px solid $uni-color-primary;
	}
</style>
