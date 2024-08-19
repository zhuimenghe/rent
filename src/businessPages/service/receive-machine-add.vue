<!-- 新建交机单 -->
<template>
	<view class="receive-machine-add">
		<view class="grid" style="margin-top: 10px;">
			<view class="header">
				<text style="font-weight: bold;">基本信息</text>
			</view>

			<view>
				<!-- 单号 -->
				<select-label-item class="cell-item" className="cell-value" tagName="交机单号" :isRequired="true"
					:value="formData.businessNo" :isSelect="false" />

				<!-- 区域 -->
				<select-label-item class="cell-item" className="cell-value" :isRequired="true" tagName="区域"
					hint="请选择区域" :value="formData.orgName" :icon="righticon" @clickItemLabel="showPick('org')"
					:isSelect="isEdit" />

				<!-- 地点 -->
				<view class="cell-input-view">
					<view class="cell-input-view-left" style="flex: none;  width: 65px !important;">
						<text>地点位置</text>
						<span style="color: #FF0000;">*</span>
					</view>
					<view class="cell-input-view-right" style="width: calc(100% - 85px);">
						<input class="input-style" style="width: 100%;margin-left: 10px;" type="text" v-model="formData.deliveryPlace"
							placeholder="请选择地点位置...." :disabled="!isEdit" />
					</view>
					<view class="addressstyle" @click="showPick('place')">
						<i class="iconfont arrow iconzl--zuobiao"></i>
					</view>
				</view>


				<!-- 交机时间 -->
				<select-label-item class="cell-item" className="cell-value" :isRequired="true" tagName="接机时间"
					hint="请选择接机时间" :value="formData.endDate" :icon="righticon" @clickItemLabel="showPick('endDate')"
					:isSelect="isEdit" />

				<!-- 结算时间 -->
				<select-label-item class="cell-item" className="cell-value" :isRequired="true" tagName="结算时间"
					hint="请选择结算时间" :value="formData.settleDate" :icon="righticon"
					@clickItemLabel="showPick('settleDate')" :isSelect="isEdit" />

				<!-- 接机联系人 -->
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>接机联系人</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" :disabled="!isEdit" type="text" v-model="formData.contactName"
							placeholder="接机联系人" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>手机号</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" :disabled="!isEdit" type="number" v-model="formData.phoneNum"
							placeholder="手机号" />
					</view>
				</view>

			</view>


		</view>


		<!-- 设备列表 -->
		<view class="grid">
			<view class="header ">
				<text style="width: calc(100% - 100px); ">设备信息</text>


				<view class="right-btns" v-if="isEdit">

					<view @click="scanCode"
						style="height: 20px; width: 20px; display: flex; justify-content: center; align-items: center; ">
						<i class="iconfont iconzl--saoma" style="color: #E60000;"></i>
					</view>

					<view @click="addMachine"
						style="height: 20px; width: 20px; display: flex; justify-content: center; align-items: center; margin-left: 10px;">
						<i class="iconfont iconjia" style="color: #E60000;"></i>
					</view>
				</view>

			</view>


			<view>

				<template v-if="machines.length>0">
					<machine-cell v-for="machine in machines" :key="machine.licenseId" :machine="machine"
						:is-edit="isEdit" @delteMachine="delteMachine" @updateCheckResult="updateCheckResult" />
				</template>

				<view v-else class="no-info">
					暂无设备信息
				</view>



			</view>


		</view>


		<!-- 其他信息 -->
		<view class="grid">
			<view class="header">
				<text style="font-weight: bold;">其他信息</text>
			</view>

			<view>

				<imgupload :is-show-label="false" @uploadfinish="uploadfinish" @deleteUrl="deleteUrl"
					type="workout_type" uploadType="attachment" maximg="9" :imgFinishlist="formData.fileList"
					:isupload="isEdit" />

				<text-label-item :is-show-label="false" :inputValue="formData.remark" :inputDisabled="!isEdit"
					placeholder="备注..." @ipnuttext="ipnuttext" />

			</view>


		</view>


		<view v-if="isEdit" style="height: 80px;width: 100%;"></view>
		<view v-if="isEdit" class="bottom-view">

			<view class="bottom-left-view" @click="clickeCancle">
				<text>取消</text>
			</view>

			<view class="bottom-right-view" @click="clickSave">
				<text>提交</text>
			</view>
		</view>


		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker :mode="dateType" startYear="2000" endYear="2100" :current="true" @confirm="onConfirm" ref="date"
			themeColor="#E60000" />


    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import SelectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import WPicker from '@/components/common/w-picker/w-picker.vue';
	import Imgupload from '@/components/common/image-upload/image-upload.vue';
	import TextLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import MachineCell from "./machine-cell"
	import machineModel from "./machine-cell/machine-model.js"
	export default {
		name: 'receive-machine-add',
		components: {
			SelectLabelItem,
			WPicker,
			MachineCell,
			Imgupload,
			TextLabelItem
		},
		data() {
			return {
				machines: [],
				isEdit: true,
				righticon: 'iconarrow-right',
				dateType: 'date',
				checkList: [],
				formData: {
					businessNo: null,
					beginDate: null, //交机时间
					deliveryPlace: null, //交机地点
					orgId: null, //区域ID
					orgName: null, //区域名称
					latitude: null, //维度
					longitude: null, //经度
					enableDate: null, //启用时间
					outStoreDate: null, //出库时间
					deliveryUser: null, //交机联系人id
					deliveryUserName: null, //交机联系人
					contactId: null,
					contactName: null,
					phoneNum: null,
					fileList: [], //附件
					remark: null, //备注
					endDate: this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
					settleDate: this.dateFormat(new Date(), 'yyyy-MM-dd'),
					dispatchMachines: [] //设备列表
				},
				selectList: [],
				selectType: null,
				orgList: [],
				userList: [],
				defaultMachine: {},
				checkLicenseId: null,
				deliveryUser: null,
				deliveryUserName: null,

			}
		},
		async onLoad(option) {
			let res = await this.$gxfmethod.getLocationWithAddr()
			this.formData.latitude = res.latitude
			this.formData.longitude = res.longitude
			this.formData.deliveryPlace = res.address
			let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
			if (resData) {

				this.deliveryUser = resData.id
				this.deliveryUserName = resData.username
				this.formData.orgName = this.$gxfmethod.getorgName(resData)
				this.formData.orgId = resData.orgId

			};


			if (option.type && option.type == 'detail') {
				uni.setNavigationBarTitle({
					title: '接机单预览'
				})
				this.isEdit = false;

				this.getDeliverDetail(option.businessNo)
			} else {
				uni.setNavigationBarTitle({
					title: '新建接机单'
				})
				this.isEdit = true;
				this.getBusinessNo()
				this.getOrgList()
				// this.getUserLeaders()
			}

			this.getCheckList('init', option.licenseId)


			uni.$on('choose-address', obj => {


				let result = obj.data;
				console.log(result);
				switch (this.selectType) {
					case 'place': {
						this.formData.deliveryPlace = result.address
						this.formData.latitude = result.latitude
						this.formData.longitude = result.longitude
						break;
					};
				default:
					break;
				}
			});


			uni.$on('choose-check-emit', list => {
				this.machines = this.machines.map(o => {
					let workCheckResults = o.workCheckResults
					if (this.checkLicenseId == o.licenseId) {
						workCheckResults = list.list
					}
					return {
						...o,
						workCheckResults: workCheckResults
					}
				})
			});

			uni.$on('assgin-vehicle', list => {
				let data = list.data.filter(o => !this.machines.some(y => y.licenseId == o.licenseId));
				this.machines = [...this.machines, ...data.map(o => {
					let m = machineModel({
						...o,
						workCheckResults: [...this.checkList]
					})
					return {
						...m
					}
				})]

			})

		},
		methods: {
			dateFormat(date, fmt) {
				var o = {
					"M+": date.getMonth() + 1, //月份 
					"d+": date.getDate(), //日 
					"h+": date.getHours(), //小时 
					"m+": date.getMinutes(), //分 
					"s+": date.getSeconds(), //秒 
					"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
					"S": date.getMilliseconds() //毫秒 
				};
				if (/(y+)/.test(fmt)) {
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				}
				for (var k in o) {
					if (new RegExp("(" + k + ")").test(fmt)) {
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
							.length)));
					}
				}
				return fmt;
			},

			//获取点检项
			getCheckList(type, licenseId) {
				let param = {
					type: 'work'
				};
				this.$network
					.getData(this.$url.GET_CHECK_LISWT, 'GET', param)
					.then(result => {
						this.checkList = result ?
							result.map(o => {
								return {
									id: o.id,
									content: o.content,
									checked: true
								};
							}) : [];

						if (type == 'init' && licenseId) {
							this.getMachineInfo(licenseId)
						}
					})
					.catch(err => {});
			},
			getOrgList() {
				let _self = this
				this.$network.getData(this.$url.ORG_ALL, "GET").then((result) => {
					if (result && result.length > 0) {
						result.forEach(function dep(o) {
							_self.orgList = [..._self.orgList, {
								value: o.id,
								label: o.name,
								children: o.children
							}];
							if (o.children && o.children.length > 0) o.children.map(dep);
						})
					}
				}).catch((err) => {})
			},
			//加载服务人员
			getUserLeaders() {
				let param = {
					showAdmin: false,
					// orgId : "",
					// roleType : this.$savekey.USER_ROLE_SEVICER
				}
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.userList = result.map(o => {
							return {
								label: o.username,
								value: o.id
							}
						})
					}).catch(err => {});
			},

			getBusinessNo() {
				let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'JIEJI');
				this.$network
					.getData(url, 'GET', null)
					.then(result => {
						this.formData = {
							...this.formData,
							businessNo: result
						};
					})
					.catch(err => {});
			},
			getMachineInfo(licenseId, type) {
				let urlstr = this.$url.MACHINE_RECORD_DETAIL + licenseId;
				this.$network.getData(urlstr, 'GET', null).then(result => {
					console.log(result)
					if (result && result.licenseId) {

						let machine = machineModel({
							...result,
							workCheckResults: [...this.checkList]
						})
						this.machines = [...this.machines, {
							...machine
						}]

						if (!type) {
							this.defaultMachine = {
								...machine
							}
						}
					} else {
						if (type == 'qr') {
							uni.showModal({
								title: '提示',
								content: "未能识别当前二维码...",
								showCancel: false,
								confirmText: '确认'
							});
						}

					}

					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			ipnuttext(v) {
				this.formData.remark = v
			},
			getDeliverDetail(businessNo) {

				this.$network
					.getData(this.$url.CONTRACTAPI_DELIVER_FROM_DETAIL, 'GET', {
						businessNo: businessNo
					})
					.then(result => {
						this.formData = {
							...result,
							settleDate: result.settleDate ? result.settleDate.split(' ')[0] : null
						};
						console.log(result)
						this.machines = this.formData && this.formData.dispatchMachines ? this.formData
							.dispatchMachines : []

					})
			},
			showPick(type) {

				this.selectType = type;
				switch (type) {
					case "org": //选择区域
					{

						this.selectList = [...this.orgList];
						this.$refs.selector.show();
						break;
					}
					case "place": //地点
					{

						let placeDic = {
							address: this.formData.deliveryPlace || '',
							latitude: this.formData.latitude || '',
							longitude: this.formData.longitude || '',
							currentRadius: '0'
						}
						uni.navigateTo({
							url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(placeDic)
						});
						break;
					}
					case "contacts": //联系人
					{
						this.selectList = this.userList;
						this.$refs.selector.show();
						break;
					}
					case "endDate": {
						this.dateType = 'dateTime'
						this.$refs.date.show();
						break;
					}
					case "settleDate": {
						this.dateType = 'date'
						this.$refs.date.show();
						break;
					}
					default: {
						break;
					}
				}
			},
			onConfirm(val) {
				console.log(val)
				switch (this.selectType) {
					case "org": {
						let org = val.checkArr || {}
						this.formData.orgId = org.value
						this.formData.orgName = org.label
						break
					}
					case "contacts": //联系人
					{
						let obj = val.checkArr || {}
						this.formData.deliveryUser = obj.value
						this.formData.deliveryUserName = obj.label
						break;
					}
					case "endDate": {
						let result = val.result;
						this.formData.endDate = result
						break;
					}
					case "settleDate": {
						let result = val.result;
						this.formData.settleDate = result
						break;
					}
					default: {
						break
					}
				}

			},
			uploadfinish(val) {
				let list = val.data;
				this.formData.fileList = list
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.formData.fileList = list

			},
			delteMachine(machine) {
				this.machines = this.machines.filter(o => o.licenseId != machine.licenseId)
			},
			scanCode(orderList) {
				uni.scanCode({
					success: (res) => {
						let codeResult = res.result;
						let licenseId = this.$datestr.getQueryString('licenseId', codeResult);
						//是否已添加当前设备
						let isRepeat = false
						if (this.machines.some(o => o.licenseId == licenseId)) {
							uni.showModal({
								title: '提示',
								content: "当前设备已添加",
								confirmText: '继续扫码',
								success: res => {
									if (res.cancel) {} else {
										this.scanCode()
									}
								}
							});
							return
						}

						this.getMachineInfo(licenseId, 'qr')


					},
					fail: (e) => {
						console.log(e)

					}
				});

			},
			updateCheckResult(licenseId) {
				this.checkLicenseId = licenseId
			},
			addMachine() {

				uni.navigateTo({
					url: `/businessPages/service/machine-select?defultSelects=${encodeURIComponent(JSON.stringify(this.machines))}`
				})

			},
			clickeCancle() {

				// this.formData = {
				// 	businessNo: this.formData.businessNo,
				// 	beginDate: null, //交机时间
				// 	deliveryPlace: null, //交机地点
				// 	orgId: null, //区域ID
				// 	orgName: null, //区域名称
				// 	latitude: null, //维度
				// 	longitude: null, //经度
				// 	endDate: null, //接机时间
				// 	settleDate: null, //结算时间
				// 	deliveryUser: null, //交机联系人id
				// 	deliveryUserName: null, //交机联系人
				// 	contactId: null,
				// 	contactName: null,
				// 	phoneNum: null,
				// 	fileList: [], //附件
				// 	remark: null, //备注
				// 	dispatchMachines: [] //设备列表
				// }
				// this.machines = [{
				// 	...this.defaultMachine
				// }]
				uni.navigateBack({
					animationDuration:100
				})

			},
			clickSave() {


				if (!this.formData.orgId) {
					uni.showToast({
						icon: 'none',
						title: "请选择区域"
					})
					return
				}

				if (!this.formData.deliveryPlace) {
					uni.showToast({
						icon: 'none',
						title: "请选择地点位置"
					})
					return
				}

				if (!this.formData.endDate || this.formData.endDate == null) {
					uni.showToast({
						icon: 'none',
						title: "请选择接机时间"
					})
					return
				}
				if (!this.formData.settleDate) {
					uni.showToast({
						icon: 'none',
						title: "请选择结算时间"
					})
					return
				}

				if (this.formData.phoneNum) {
					if (this.$datestr.isphonenum(this.formData.phoneNum) === false) {
						uni.showToast({
							icon: 'none',
							title: '请输入正确手机号'
						});
						return;
					}
				}


				// if (!this.formData.deliveryUser) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: "请选择交机联系人"
				// 	})
				// 	return
				// }
				if (this.machines.length <= 0) {
					uni.showToast({
						icon: 'none',
						title: "请至少添加一台设备"
					})
					return
				}


				console.log(this.formData)

				let url = this.$url.CONTRACTAPI_DELIVER_FROM;
				this.$network.getData(url, 'POST', {
					...this.formData,
					settleDate: `${this.formData.settleDate} 00:00:00`,
					deliveryUser: this.deliveryUser,
					deliveryUserName: this.deliveryUserName,
					dispatchMachines: [...this.machines]
				}).then(() => {
					uni.$emit("update-list")
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				}).catch(err => {
					console.error(err)
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.receive-machine-add {
		display: flex;
		flex: 1;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;

		.grid {
			display: flex;
			flex-direction: column;
			margin: 5px 10px;
			background: #ffffff;
			border-radius: 4px;


			.header {
				padding: 8px;
				height: 34px;
				display: flex;
				align-items: center;
				font-weight: 500;
				border-bottom: 2px solid $uni-bg-color-grey;
			}

			.body-cell {
				position: relative;
				height: 30px;
				// padding-top: 4rpx;
				// width: calc(100% + 10px);
				// background: #E60000;

				.cell-item {
					margin-right: 0px !important;
				}

			}

			.body-cell::after {
				position: absolute;
				z-index: 3;
				right: 0;
				bottom: 0;
				left: 12px;
				height: 1px;
				content: "";
				-webkit-transform: scaleY(.5);
				transform: scaleY(.5);
				background-color: #c8c7cc;
			}


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

		.no-info {
			height: 60px;
			color: #999999;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.right-btns {
			width: 100px;
			display: flex;
			justify-content: flex-end;
		}


		.cell-input-view {
			display: flex;
			flex-direction: row;
			flex: 1;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			font-size: $uni-font-size-base;
			border-bottom: 1px dotted #F0F2F4;
		}

		.cell-input-view-left {
			display: flex;
			flex: 2;
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

		.input-style {
			font-size: 14px;
			text-align: right;
			line-height: 16px;
		}

		.addressstyle {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			width: 30px;
			margin-right: 0px;
		}

		.arrow {
			display: flex;
			font-size: 18px;
			justify-content: center;
			align-items: center;
			color: $uni-color-primary;
		}

		::v-deep.label-container {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			// width: 100px;
		}
	}
</style>
