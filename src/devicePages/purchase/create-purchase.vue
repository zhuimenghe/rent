<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step processKey="purchase" @submitApply="clicksave" :itemData="backDic" @data-form="getBackData" :updateObj="purchaseDic"
		 :isUpdate="isUpdate">
			<view class="creat-claime-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>基本信息</text></view>
					<select-label-item tagName="采购单号" :isRequired="true" :value="purchaseDic.businessNo||''" :isSelect="false" />
					<select-label-item tagName="申请人" :isRequired="true" :value="purchaseDic.userName||''" :isSelect="false" />
					<select-label-item tagName="区域" :isRequired="true" hint="请选择区域" :value="purchaseDic.orgName||''" :isSelect="true" @clickItemLabel="showPick('org')"/>
					<select-label-item tagName="采购形式" :isRequired="true" hint="请选择采购形式" :value="purchaseDic.purchaseTypeName||''"
					 :icon="righticon" @clickItemLabel="showPick('type')" :isSelect="true" />
					<select-label-item tagName="采购日期" :isRequired="true" hint="请选择采购日期" :value="getDate(purchaseDic.purchaseDate)"
					 :icon="dateIcon" :isSelect="true" @clickItemLabel="showPick('date')" />
					<select-label-item tagName="采购人" :isRequired="true" hint="请选择采购人" :value="purchaseDic.purchaseUserName||''" :icon="righticon"
					 @clickItemLabel="showPick('user')" :isSelect="true" />
					<select-label-item tagName="申请人电话" :isPhone='true' :value="purchaseDic.purchasePhoneNumber||''" :isSelect="false" />
					<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="purchaseDic.comment||''" />
				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text>设备信息</text>
						<view class="tag-right">
							<text style="font-size: 12px;color: #666666; font-weight: 100;">总计：</text>{{ moneyUtil.dealNumber(purchaseDic.total)}}<text
							 style="font-size: 12px;color: #999999; font-weight: 100;">元</text>
							<i class="iconfont labelstyle iconadd" @click="addMachine"></i>
						</view>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in purchaseDic.recordList" :key="i">
							<view class="v-item-container">
								<view class="item-row">
									<view class="info-cell-key">设备类别</view>
									<view class="info-cell-value">
										<label-arrow :value="v.deviceTypeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备类型</view>
									<view class="info-cell-value">
										<label-arrow :value="v.typeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">品牌</view>
									<view class="info-cell-value">
										<label-arrow :value="v.brand" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">型号</view>
									<view class="info-cell-value">
										<label-arrow :value="v.machineTypeName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">高度</view>
									<view class="info-cell-value">
										<label-arrow :value="v.heightName" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备数量（台）</view>
									<view class="info-cell-value">
										<input v-model="v.purchaseNumber" type="number" :disabled="false" @input="checkNum($event,'num',i)" />
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">设备单价（元）</view>
									<view class="info-cell-value">
										<input v-model="v.purchasePrice" type="digit" :disabled="false" @input="checkInput($event,'price',i)" />
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-key">单类总价（元）</view>
									<view class="info-cell-value">
										<label-arrow :value="moneyUtil.dealNumber(v.total)" textColor="#333333" :disabled="true"></label-arrow>
									</view>
								</view>
								<view class="item-row">
									<view class="info-cell-value">
										<i class="iconfont delete-items-icon iconzl--shanchu" @click="removeClaimMachine(i)"></i>
									</view>
								</view>

							</view>

						</view>
					</view>

				</view>
				<!-- <view class="sum-view-bg">
					<view class="model-tag"><text>备注及附件</text></view>
					<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="purchaseDic.comment||''" />
					<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="purchaseDic.fileList" type="purchase_type"
					 uploadType="attachment" :maximg="20" />
				</view> -->
				<w-picker 
				mode="date" 
				startYear="2000" endYear="3000" 
				:current="true" 
				@confirm="onConfirm" 
				:disabledAfter="false"
				ref="date" 
				themeColor="#E60000" 
				/>
				<w-picker 
				:selectList="selectList" 
				@confirm="onConfirm" 
				mode="selector" 
				ref="selector"
				themeColor="#E60000" 
				/>
			</view>
		</create-step>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import createStep from '@/components/workflow/create-step.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			labelArrow,
			imgupload,
			createStep,
			wPicker
		},
		computed: {},
		data() {
			return {
				dateIcon: 'iconzl--rili',
				righticon: 'iconarrow-right',
				purchaseDic: {},
				selectList: [],
				pickType: '',
				addIndex: 0,
				backDic: null,
				isUpdate: false,
				userList: [],
				purchaseTypes: [],
				orgList:[],

			};
		},
		onLoad(option) {
			console.log('option' + JSON.stringify(option));
			if (option.businessNo) { //撤回编辑
				this.loaddata(option.businessNo)
			}
			if (option.item) { //退回编辑
				this.backDic = JSON.parse(decodeURIComponent(option.item))
				this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false) : false
			}
			if (!option.businessNo && !this.backDic) {
				uni.getStorage({
					key: this.$savekey.USER_INFO_MEG,
					success: res => {
						this.purchaseDic = {
							...this.purchaseDic,
							userName: res.data.username,
							userId: res.data.id,
							orgId:res.data.orgId,
							orgName:this.$gxfmethod.getorgName(res.data),
						}
					}
				});
				this.getBusinessNo()
			}
			this.getPurchaseType();
			this.getUserLeaders();
			this.loadAreaList();
			uni.$on('choosedMachines', obj => {
				let machines = obj.data.map(o => {
					return {
						...o,
						"machineTypeName": o.name,
						"machineType": o.id,
						"purchaseNumber": this.purchaseDic.recordList && this.purchaseDic.recordList.some(y => o.id === y.machineType) ?
							this.purchaseDic.recordList
							.find(y => o.id === y.machineType).purchaseNumber : '0',
						"purchasePrice": this.purchaseDic.recordList && this.purchaseDic.recordList.some(y => o.id === y.machineType) ?
							this.purchaseDic.recordList.find(
								y => o.id === y.machineType).purchasePrice : '0',
						"total": this.purchaseDic.recordList && this.purchaseDic.recordList.some(y => o.id === y.machineType) ? this.purchaseDic
							.recordList.find(y =>
								o.id === y.machineType).total : '0.00',
					};
				});
				this.purchaseDic['recordList'] = [...machines];
				this.purchaseDic = {
					...this.purchaseDic,
					recordList: this.purchaseDic.recordList
				}
			})
		},
		onUnload() {
			// 取消监听事件
			uni.$off('choosedMachines');
		},
		methods: {
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			/**获取退回后通过dataForm接口获取的数据详情
			 * @param {Object} val json数据
			 */
			getBackData(val) {
				this.purchaseDic = JSON.parse(val)
				this.getItemTotal()
			},
			// /**
			//  * 获取变更单号
			//  */
			// getBusinessNo() {
			// 	this.$network.getData(this.$url.PURCHASE_INIT, "GET", null).then((result) => {
			// 		this.purchaseDic = {
			// 			...this.purchaseDic,
			// 			businessNo: result.businessNo,
			// 			userName: result.userName
			// 		}

			// 	}).catch((err) => {

			// 	})
			// },
			// 获取单号
			getBusinessNo() {
				let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, 'CG')
				this.$network.getData(url, "GET", null).then((result) => {
					this.purchaseDic = {
						...this.purchaseDic,
						"businessNo": result,
					}
				}).catch((err) => {})
			},
			getUserLeaders() {
				let param = {
					showAdmin: false
				}
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						if (result && result.length > 0) {
							this.userList = result.map(o => {
								return {
									value: o.id,
									label: o.username,
									phoneNum: o.phoneNum
								}
							});
						}

					})
					.catch(err => {

					});
			},
			getPurchaseType() {
				this.$network
					.loadDic('purchase_type')
					.then(result => {
						this.purchaseTypes = result.records;
						if (!this.purchaseDic.purchaseType && this.purchaseTypes && this.purchaseTypes.length > 0) {
							this.purchaseDic = {
								...this.purchaseDic,
								purchaseType: this.purchaseTypes[0].value,
								purchaseTypeName: this.purchaseTypes[0].label

							}
						}


					})
					.catch(err => {});
			},
			//区域
			loadAreaList(){
				uni.showLoading();
				let urlstr = this.$url.ORG_LIST;
				this.$network
					.getData(urlstr, 'GET', null)
					.then(result => {
						let list = result;
						this.orgList = this.getChildren(list);
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getChildren(data) {
				let arr = [];
				if (data) {
					data.forEach(o => {
						let a = {
							value: o.id,
							label: o.name
						};
						arr = [...arr, a];
						if (o.children && o.children.length > 0) {
							arr = [...arr, ...this.getChildren(o.children)];
						} 
					});
				}
				return arr;
			},
			loaddata(key) {
				let param = {
					businessNo: key
				};
				this.$network
					.getData(this.$url.PURCHASE_DETAIL, 'GET', param)
					.then(result => {
						this.purchaseDic = {
							...result
						};
						this.getItemTotal()
					})
					.catch(err => {});
			},

			showPick(type) {
				this.pickType = type;
				switch (this.pickType) {
					case 'date':
						this.$refs.date.show();
						break;
					case 'user':
						this.selectList = this.userList;
						this.$refs.selector.show();
						break;
					case 'type':
						this.selectList = this.purchaseTypes;
						this.$refs.selector.show();
						break;
					case 'org':
						this.selectList = this.orgList;
						this.$refs.selector.show();
						break;
					default:
						break;
				}

			},
			checkNum(e, type, i) {
				var val = e.target.value;
				setTimeout(() => {
					if (val.indexOf(".") !== -1) {
						console.log('1' + val)
						var dotIndex = val.indexOf(".");
						val = val.substr(0, dotIndex + 1);
						this.getInputData(type, val, i);
					}
					if (val.indexOf(".") === 0) {
						console.log('2' + val)
						val = '';
						this.getInputData(type, val, i);
					}

					//限制0后面非。输入
					if (val.substring(0, 1) === "0" && val.length > 1 && val.substring(1, 2) !== "0") {
						console.log('3' + val)
						val = val.substring(0, 1);
						this.getInputData(type, val, i);
						return
					}
					this.getInputData(type, val, i);
				}, 10)
			},
			checkInput(e, type, i) {
				var val = e.target.value;
				console.log(e)
				setTimeout(() => {
					//限制小数两位
					if (val.indexOf(".") != -1) {
						var dotIndex = val.indexOf(".");
						if (val.length - 1 - dotIndex > 2) {
							val = val.substr(0, dotIndex + 2 + 1);
							this.getInputData(type, val, i);
						}
					}
					if (val.indexOf(".") == 0) {
						val = "0" + val;
						this.getInputData(type, val, i);
					}

					//限制0后面非。输入
					if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
						val = val.substring(0, 1);
						this.getInputData(type, val, i);
						return
					}
					this.getInputData(type, val, i);
				}, 10)

			},
			//给输入框赋值
			getInputData(type, val, i) {
				console.log("type:" + type)
				if (type === "num") {
					this.purchaseDic.recordList[i].purchaseNumber = val
					this.calMoney(i);

				} else if (type === "price") {
					this.purchaseDic.recordList[i].purchasePrice = val;
					this.calMoney(i);
				}

			},
			//小计
			calMoney(i) {
				this.purchaseDic.recordList[i].total = (this.purchaseDic.recordList[i].purchasePrice ? Number(this.purchaseDic.recordList[
						i].purchasePrice) : 0) *
					(this.purchaseDic.recordList[i].purchaseNumber ? Number(this.purchaseDic.recordList[i].purchaseNumber) : 0)
				this.purchaseDic.recordList[i].total = this.purchaseDic.recordList[i].total.toFixed(2)
				this.purchaseDic.total = this.purchaseDic.recordList.reduce((x, y) => {
					return x + Number(y.total)
				}, 0)
				this.purchaseDic.total = this.purchaseDic.total.toFixed(2)
				this.purchaseDic['purchaseTotal'] = this.purchaseDic.recordList.reduce((x, y) => {
					return x + Number(y.purchaseNumber)
				}, 0)
			},
			getItemTotal() {
				let list = this.purchaseDic.recordList.map(o => {
					let total = (o.purchasePrice ? Number(o.purchasePrice) : 0) * (o.purchaseNumber ? Number(o.purchaseNumber) : 0)
					return {
						...o,
						'total': total.toFixed(2)
					}
				})
				this.purchaseDic = {
					...this.purchaseDic,
					recordList: list
				}
			},
			onConfirm(val) {
				console.log('val=' + JSON.stringify(val));
				switch (this.pickType) {
					case 'date':
						this.purchaseDic = { ...this.purchaseDic,
							purchaseDate: val.result
						};
						break;
					case 'user':
						this.purchaseDic = { ...this.purchaseDic,
							purchaseUserNo: val.checkArr.value,
							purchaseUserName: val.checkArr.label,
							purchasePhoneNumber: val.checkArr.phoneNum
						};
						break;
					case 'type':
						this.purchaseDic = { ...this.purchaseDic,
							purchaseType: val.checkArr.value,
							purchaseTypeName: val.checkArr.label
						};
						break;
					case 'org':
						this.purchaseDic = { 
							...this.purchaseDic,
							orgId: val.checkArr.value,
							orgName: val.checkArr.label
						};
						break;
					default:
						break;
				}

			},
			/**
			 * 添加索赔设备
			 */
			addMachine() {
				uni.navigateTo({
					url: './purchase-choose-device?choosedList=' + encodeURIComponent(JSON.stringify(this.purchaseDic.recordList ?
						this.purchaseDic.recordList : []))
				});
			},
			/**
			 * 删除索赔设备
			 */
			removeClaimMachine(i) {
				this.purchaseDic.recordList.splice(i, 1);
				let tn = this.purchaseDic.recordList.reduce((t, y) => {
					return t + Number(y.total);
				}, 0);
				this.purchaseDic.total = tn + '';
				this.purchaseDic = {
					...this.purchaseDic,
					recordList: this.purchaseDic.recordList
				}
			},
			//上传图片回调
			uploadfinish(val) {
				let list = val.data;
				this.purchaseDic = {
					...this.purchaseDic,
					fileList: [...list]
				};
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.purchaseDic = {
					...this.purchaseDic,
					fileList: [...list]
				};
			},
			//备注
			remarkmethod(val) {
				this.purchaseDic.comment = val;
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
				this.purchaseDic = {
					...this.purchaseDic,
					fileList: [...list]
				};
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.purchaseDic = {
					...this.purchaseDic,
					fileList: [...list]
				};
			},
			checkData() {
				if (!this.purchaseDic.purchaseType) {
					uni.showToast({
						title: '请选择采购形式',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.purchaseDic.purchaseDate) {
					uni.showToast({
						title: '请选择采购日期',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.purchaseDic.purchaseUserName) {
					uni.showToast({
						title: '请选择采购人',
						icon: 'none'
					});
					return Promise.reject('fail');
				}

				if (!this.purchaseDic.recordList || (this.purchaseDic.recordList && this.purchaseDic.recordList.length <=
						0)) {
					uni.showToast({
						title: '请添加采购设备',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.purchaseDic.recordList.some(o => !o.purchaseNumber || Number(o.purchaseNumber) <= 0)) {
					uni.showToast({
						title: '所有设备数量必须大于0',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.purchaseDic.recordList.some(o => !o.purchasePrice || Number(o.purchasePrice) <= 0)) {
					uni.showToast({
						title: '所有设备单价必须大于0',
						icon: 'none'
					});
					return Promise.reject('fail');
				}

				this.purchaseDic = {
					...this.purchaseDic,
					purchaseRecordJson: JSON.stringify(this.purchaseDic.recordList)
				}
				return Promise.resolve('success');
			},
			//是否查找到‘00：00：00’
			findNotStr(str, findstr) {
				return str.indexOf(findstr) === -1;
			},
			//确定按钮
			clicksave(val) {
				console.log('clicksave=' + JSON.stringify(val));
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.CREATE_PURCHASE + val, 'POST', this.purchaseDic)
					.then(result => {
						uni.$emit("refresh-notification-list", {
							type: 'purchase'
						})
						uni.$emit("refresh-list", {
							type: 'purchase'
						})
						uni.navigateBack({
							animationDuration: 200
						});
						uni.hideLoading();
					})
					.catch(err => {
						uni.showToast({
							title: err.detail ? err.detail[0] : err.message,
							icon: 'none'
						});
						uni.hideLoading();
					});
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

	.creat-claime-bg {
		display: flex;
		// flex: 1;
		// width: 100%;
		// margin-bottom: 68px;
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
		margin-left: 15px;
		margin-right: 15px;
		height: 45px;
		line-height: 45px;
		font-size: $uni-font-size-base;
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
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
		width: 140px;
		height: 35px;
	}

	.model-tag {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		color: $uni-text-color;
		font-weight: bold;
		font-size: $uni-font-size-lg;
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
		padding: 10px;
	}

	.v-item-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 8px;
		border: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
		margin-bottom: 10px;
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
		flex-direction: column;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		width: 33%;
		padding-bottom: 8px;
	}

	.info-cell-key {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
	}

	.info-cell-value {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 28px;
		line-height: 28px;
		align-items: center;
		display: flex;
	}

	.info-cell-value input {
		border: 1px solid $uni-bg-color-grey;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		padding: 0px 2px;
		width: 72px;
		border-radius: 4px;
	}

	.item-row text {
		flex: 1;
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
