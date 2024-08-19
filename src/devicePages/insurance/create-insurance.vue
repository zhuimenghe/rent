<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step processKey="insurance" @submitApply="clicksave" :itemData="backDic" @data-form="getBackData" :updateObj="insuranceDic"
		 :isUpdate="isUpdate">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>保险单信息</text></view>
					<select-label-item 
					tagName="保险业务编号" 
					:isRequired="true" 
					:isSelect="false" 
					:value="insuranceDic.businessNo" 
					/>
					<select-label-item 
					tagName="保险单号" 
					:isRequired="true" 
					:isLabel="false" 
					:isSelect="false"
					>
						<input 
						class="input-style" 
						type="text" 
						v-model="insuranceDic.insuranceKey"
						placeholder="请输入..." 
						/>
					</select-label-item>
					<select-label-item 
					tagName="保险公司" 
					:isRequired="true" 
					:isLabel="false" 
					:isSelect="false"
					>
						<input 
						class="input-style" 
						type="text" 
						v-model="insuranceDic.insuranceCompany"
						placeholder="请输入..." 
						/>
					</select-label-item>
					<select-label-item 
					tagName="保险金额" 
					:isRequired="true" 
					:isLabel="false" :isSelect="false"
					>
						<input 
						class="input-style" 
						type="digit" 
						v-model="insuranceDic.insuranceAmount"
						placeholder="请输入..." 
						@input="checkInput($event)" 
						/>
					</select-label-item>
					<select-label-item 
					tagName="生效开始时间" 
					:isRequired="true" 
					hint="请选择开始时间" 
					:value="getDate(insuranceDic.insuranceStartDate)"
					:icon="dateIcon" 
					@clickItemLabel="showPick('start')" 
					/>
					<select-label-item 
					tagName="生效结束时间" 
					:isRequired="true" 
					hint="请选择结束时间" 
					:value="getDate(insuranceDic.insuranceEndDate)"
					:icon="dateIcon" 
					@clickItemLabel="showPick('end')" 
					/>
					<select-label-item 
					tagName="购买日期" 
					:isRequired="true" 
					hint="请选择购买时间" 
					:value="getDate(insuranceDic.buyTime)" 
					:icon="dateIcon"
					@clickItemLabel="showPick('buyTime')" 
					/>
					<select-label-item 
					tagName="购买负责人" 
					:isRequired="true" 
					hint="请选择购买负责人" 
					:value="insuranceDic.insuranceOfficerName"
					:icon="righticon" 
					@clickItemLabel="showPick('buyUser')" 
					/>
					<select-label-item 
					tagName="区域" 
					:isRequired="true" 
					hint="请选择区域" 
					:value="insuranceDic.orgName"
					:icon="righticon" 
					@clickItemLabel="showPick('org')" 
					/>
					<select-label-item
					tagName="保险费率(%)" 
					:isRequired="true" 
					:isLabel="false" 
					:isSelect="false"
					>
						<input 
						class="input-style" 
						type="number" 
						v-model="insuranceDic.insuranceRate"
						placeholder="0.00" 
						/>
					</select-label-item>
				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text>设备信息</text>
						<i class="iconfont labelstyle iconadd" @click="addMachine"></i>
					</view>
					<view class="vehicle-list-container">
						<view class="item-head">
							<view style="flex: 5;" class="item-head-item">车号</view>
							<view style="flex: 3;" class="item-head-item">自喷吗</view>
							<view style="flex:1;" class="item-head-item">操作</view>
						</view>
						<view v-for="(v, i) in insuranceDic.machineList" class="v-item-container" :key="i">
							<view class="item-top">
								<text style="flex: 5;" class="item-top-item">{{ v.licenseId||'--' }}</text>
								<text style="flex: 3;" class="item-top-item">{{ v.printCode || '-' }}</text>
								<i class="iconfont item-top-item iconzl--shanchu" style="flex:1;color: #FF0000;" @click="removeMachine(i)"></i>
							</view>

						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="insuranceDic.fileList" type="insurance_type"
					 uploadType="attachment" :maximg="20" />
					<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="insuranceDic.remark" />
				</view>
				<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
				 ref="date" themeColor="#E60000" />
				<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
			</view>
		</create-step>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import createStep from '@/components/workflow/create-step.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload,
			createStep,
			wPicker
		},
		computed: {},
		watch:{
			'insuranceDic.insuranceRate'(val) {
				this.insuranceDic = {
					...this.insuranceDic,
					insuranceRate: val
				};
				setTimeout(()=>{
					this.insuranceDic = {
						...this.insuranceDic,
						insuranceRate: this.$gxfmethod.getMoneyPart(val.toString())
					};
				}, 50);
			}
		},
		data() {
			return {
				dateIcon: 'iconzl--rili',
				companyicon: 'iconiconzhengli_zuzhijiagou',
				righticon: 'iconarrow-right',
				selectList: [],
				insuranceDic: {
					insuranceKey: '',
					insuranceCompany: '',
					insuranceAmount: '',
					insuranceRate:'',
					machineList: []
				},
				pickType: '',
				backDic: null,
				isUpdate: false,
				buyUserList:[],
				orgList:[]
			};
		},
		onLoad(option) {
			console.log('option' + JSON.stringify(option));
			if (option.item) {
				//退回编辑
				this.backDic = JSON.parse(decodeURIComponent(option.item));
				this.isUpdate = option.isUpdate ? (option.isUpdate == '1' ? true : false) : false;
				console.log(this.isUpdate)
				uni.setNavigationBarTitle({
					title:'修改保险单'
				})
				if(this.isUpdate){
					this.loaddata(this.backDic.businessNo);
				}
			}else{
				uni.getStorage({
					key: this.$savekey.USER_INFO_MEG,
					success: res => {
						this.insuranceDic = {
							...this.insuranceDic,
							orgId:res.data.orgId,
							orgName:this.$gxfmethod.getorgName(res.data),
						}
					}
				});
				this.getBusinessNo();
			}
			uni.$on('choosedMachines', obj => {
				console.log(obj)
				// this.insuranceDic.machineList = obj.data ? [...obj.data] : [];
				this.insuranceDic = {
					...this.insuranceDic,
					machineList: obj.data && obj.data.length > 0 ? obj.data.map(o => {
						return {
							id: o.id,
							licenseId: o.licenseId,
							printCode: o.printCode
						}
					}) : []
				}

			});
			this.getUsers();
			this.loadAreaList();
		},
		onUnload() {
			// 取消监听事件
			uni.$off('choosedMachines');
		},
		methods: {
			getBusinessNo() {
				let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, 'BX')
				this.$network.getData(url, "GET", null).then((result) => {
					this.insuranceDic = {
						...this.insuranceDic,
						"businessNo": result,
					}
				}).catch((err) => {})
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			/**获取退回后通过dataForm接口获取的数据详情
			 * @param {Object} val json数据
			 */
			getBackData(val) {
				if(!this.isUpdate){
					let dict = JSON.parse(val);
					this.insuranceDic = {
						...dict
					};
				}
				
			},
			loaddata(key) {
				let param = {
					businessNo: key
				};
				this.$network
					.getData(this.$url.INSURANCE_DETAIL_URL, 'GET', param)
					.then(result => {
						this.insuranceDic = {
							...result
						};
					})
					.catch(err => {});
			},
			getUsers() {
				let param = {
					showAdmin: false
				};
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						if (result && result.length > 0) {
							this.buyUserList = result.map(o => {
								return {
									value: o.id,
									label: o.username
								};
							});
						}
					})
					.catch(err => {});
			},
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
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'start':
					case 'end':
					case 'buyTime':
						this.$refs.date.show();
						break;
					case 'buyUser':
					    this.selectList = this.buyUserList;
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
			onConfirm(val) {
				switch (this.pickType) {
					case 'start':
						this.insuranceDic = { ...this.insuranceDic,
							insuranceStartDate: val.result + ' 00:00:00'
						};
						break;
					case 'end':
						this.insuranceDic = { ...this.insuranceDic,
							insuranceEndDate: val.result + ' 23:59:59'
						};
						break;
					case 'buyTime':
						this.insuranceDic = { ...this.insuranceDic,
							buyTime: val.result + ' 00:00:00'
						};
						break;
					case 'buyUser':
						this.insuranceDic = { ...this.insuranceDic,
							insuranceOfficer: val.checkArr.value,
							insuranceOfficerName: val.checkArr.label
						};
						break;
					case 'org':
						this.insuranceDic = { 
							...this.insuranceDic,
							orgId: val.checkArr.value,
							orgName: val.checkArr.label
						};
						break;
					default:
						break;
				}

			},
			/**
			 * 添加保险设备
			 */
			addMachine() {
				uni.navigateTo({
					url: './insurance-choose-machine?chooseList=' + encodeURIComponent(JSON.stringify(this.insuranceDic.machineList))
				});
			},
			/**
			 * 删除保险设备
			 */
			removeMachine(i) {
				this.insuranceDic.machineList.splice(i, 1);
			},
			//备注
			remarkmethod(val) {
				this.insuranceDic.remark = val;
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
				this.insuranceDic = {
					...this.insuranceDic,
					fileList: [...list]
				};
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.insuranceDic = {
					...this.insuranceDic,
					fileList: [...list]
				};
			},
			checkInput(e) {
				var val = e.target.value;
				setTimeout(() => {
					//限制小数两位
					if (val.indexOf('.') != -1) {
						var dotIndex = val.indexOf('.');
						if (val.length - 1 - dotIndex > 2) {
							val = val.substr(0, dotIndex + 2 + 1);
							this.insuranceDic = {
								...this.insuranceDic,
								insuranceAmount: val
							};
						}
					}
					if (val.indexOf('.') == 0) {
						val = '0' + val;
						this.insuranceDic = {
							...this.insuranceDic,
							insuranceAmount: val
						};
					}

					//限制0后面非。输入
					if (val.substring(0, 1) == '0' && val.length > 1 && val.substring(1, 2) != '.') {
						val = val.substring(0, 1);
						this.insuranceDic = {
							...this.insuranceDic,
							insuranceAmount: val
						};
						return;
					}
					
					if (Number(val) > 10000000000) {
						val = 10000000000 + '.00'
						this.insuranceDic = {
							...this.insuranceDic,
							insuranceAmount: val
						};
						return;
					}
					this.insuranceDic = {
						...this.insuranceDic,
						insuranceAmount: val
					};
					console.log(this.insuranceDic.insuranceAmount)
				}, 100);
			},
			checkData() {
				if (!this.insuranceDic.insuranceKey) {
					uni.showToast({
						title: '请输入保险单号',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.insuranceCompany) {
					uni.showToast({
						title: '请输入保险公司',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.insuranceAmount) {
					uni.showToast({
						title: '请输入保险金额',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.insuranceStartDate) {
					uni.showToast({
						title: '请选择生效开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.insuranceEndDate) {
					uni.showToast({
						title: '请选择生效结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.$datestr.timedifferent(this.getDate(this.insuranceDic.insuranceEndDate), this.getDate(this.insuranceDic.insuranceStartDate)) !=1) {
					uni.showToast({
						title: '生效结束时间必须晚于生效开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				
				} 
				if (!this.insuranceDic.buyTime) {
					uni.showToast({
						title: '请选择购买时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.insuranceOfficerName) {
					uni.showToast({
						title: '请选择购买负责人',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.insuranceDic.machineList || (this.insuranceDic.machineList && this.insuranceDic.machineList.length <=
						0)) {
					uni.showToast({
						title: '请选择保险设备',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				this.insuranceDic = {
					...this.insuranceDic,
					licenseIdList: this.insuranceDic.machineList
				}
				if (!this.insuranceDic.insuranceRate) {
					// uni.showToast({
					// 	title: '请输入保险费率',
					// 	icon: 'none'
					// });
					// return Promise.reject('fail');
					this.insuranceDic = {
						...this.insuranceDic,
						insuranceRate:'0.00'
					}
				}
				return Promise.resolve('success');
			},
			//是否查找到‘00：00：00’
			findNotStr(str, findstr) {
				return str.indexOf(findstr) === -1;
			},
			//确定按钮
			clicksave(val) {
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.INSURANCE_CREATE_URL + val, 'POST', this.insuranceDic)
					.then(result => {
						uni.$emit('refresh-insurance-list', {
							type: 'insurance'
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
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
						uni.hideLoading();
					});
			},

		}
	};
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.creat-bg {
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
		margin: 10px;
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
		// border-width: 0px 0px 1px 0px;
		// border-style: solid;
		// border-color: $uni-bg-color-grey;
		// padding: 5px 0px;
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

	.attachment-icon {
		color: $uni-color-primary;
		font-size: 10px;
		margin-left: 10px;
	}

	.delete-items-icon {
		color: #ff0000;
		font-size: 14px;
	}

	.vehicle-list-container {
		padding: 15px;
	}

	.item-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.item-head-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: #FFFFFF;
		border-width: 1px;
		border-style: solid;
		color: #FFFFFF;
		font-size: $uni-font-size-base;
		background-color: #aaaaaa;
		height: 30px;
		line-height: 30px;
		padding-left: 2px;
	}


	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-top-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 1px;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
		padding-left: 2px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.claim-options {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-color-primary;
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

	.line-s {
		margin-top: 5px;
		margin-left: 5px;
		margin-right: 5px;
		height: 1px;
		background: #eeeeee;
	}
</style>
