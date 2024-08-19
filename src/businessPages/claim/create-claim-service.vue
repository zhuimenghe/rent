<template>
	<view class="content">
		<create-step
			processKey="serviceClaim"
			@submitApply="clicksave"
			:orgId="claimDic.orgId"
			:itemData="backDic"
			@data-form="getBackData"
			:updateObj="claimDic"
			:businessOwner="claimDic.customerSalesman"
			:isUpdate="isUpdate"
		>
			<view class="creat-claime-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>选择设备</text></view>
					<select-label-item
					tagName="车辆号"
					isRequired="true"
					hint="请选择车辆"
					:value="claimDic.licenseId"
					:icon="righticon"
					@clickItemLabel="addMachineContract"
					:isSelect="!isAdjust"
					/>
				</view>
				<view class="sum-view-bg" v-if="claimDic.licenseId">
					<view class="model-tag"><text>客户信息</text></view>
					<select-label-item
					tagName="合同名称"
					isRequired="true"
					hint="请选择合同"
					:value="contractDicName"
					:icon="righticon"
					@clickItemLabel="gotoContract"
					:isSelect="!isAdjust"
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>区域</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.orgName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>业务负责人</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.customerSalesmanName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>客户名称</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.customerName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>索赔联系人</text></view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="claimDic.contactName" 
							:placeholder="isAdjust ? '' : '请输入...'" 
							:disabled="isAdjust" 
							/>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>索赔联系人电话</text></view>
						<view class="cell-input-view-right">
							<input 
							class="input-style"
							type="text" 
							v-model="claimDic.phoneNum" 
							:placeholder="isAdjust ? '' : '请输入...'" 
							:disabled="isAdjust" 
							/>
						</view>
					</view>
					<select-label-item
					tagName="索赔日期"
					:isRequired="true"
					hint="请选择索赔日期"
					:value="getDate(claimDic.claimDate)"
					:icon="dateIcon"
					:isSelect="!isAdjust"
					@clickItemLabel="showPick"
					/>
				</view>
				<view class="sum-view-bg" v-if="claimDic.licenseId">
					<view class="model-tag">
						<text>设备信息</text>
						<view class="tag-right">
							<text>总计：{{ claimDic.total || '0' }}元</text>
							<i class="iconfont labelstyle iconadd" @click="addClaimMachine" v-if="!isAdjust"></i>
						</view>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in claimDic.claimMachineList" class="v-item-container" :key="i">
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
								<text>小计：{{ Number(v.total).toFixed(2) }}元</text>
								<view class="claim-options"><text @click="addClaimItem(i)">索赔项-></text></view>
								<i 
								v-if = "showdelete(v)"
								class="iconfont delete-items-icon iconzl--shanchu" 
								@click="removeClaimMachine(i)"></i>
							</view>
							<view class="line-s" />
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="claimDic.fileList" type="claim_type" uploadType="attachment" :maximg="20" />
					<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="claimDic.remark" :inputDisabled="isAdjust" />
				</view>
				<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
			</view>
		</create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
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
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			claimDic: {
				category:'service',
				total: '0',
				claimMachineList: []
			},
			addIndex: 0,
			isAdjust: false,
			contractDicName: '',
			backDic: null,
			isUpdate: false
		};
	},
	onLoad(option) {
		this.claimDic={
			...this.claimDic,
			claimDate:this.$datestr.getnowDate()
		}
		if (option.businessNo) {
			//撤回编辑
			this.loaddata(option.businessNo);
		}
		if (option.isAdjust) {
			//调整编辑
			this.isAdjust = option.isAdjust === 'true' ? true : false;
			uni.setNavigationBarTitle({
				title: '索赔调整'
			});
		}
		if (option.item) {
			//退回编辑
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			console.log('option.isUpdate============' + option.isUpdate);
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
		}
		//生成单号
		if (!option.businessNo && !this.backDic && !this.isAdjust) {
			this.getBusinessNo();
		}
		if(option.machineitem){
			let data = JSON.parse(decodeURIComponent(option.machineitem));
			let dict = data.dict;
			let licenseId = data.licenseId;
			let machines = data.machines.map(o => {
				return {
					...o,
					total: '0',
					claimList: []
				};
			});
			this.claimDic = {
				...this.claimDic,
				licenseId:licenseId,
				contractNo: dict.businessNo,
				contractDetailId: dict.contractDetailDto.id,
				customerName: dict.customerName,
				customerId: dict.customerId,
				contactName: dict.contractDetailDto.contactName,
				contactId: dict.contractDetailDto.contactId,
				phoneNum: dict.contractDetailDto.phoneNum,
				orgName: dict.orgName,
				orgId: dict.orgId,
				customerSalesman: dict.contractDetailDto.customerSalesman,
				customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
				projectName: dict.contractDetailDto.projectName,
				total:0,
				claimMachineList: machines
			};
			console.log(JSON.stringify(this.claimDic));
			this.contractDicName = this.claimDic.customerName + '-' + this.claimDic.projectName;
		}
		uni.$on('claimItems', obj => {
			this.claimDic.claimMachineList[this.addIndex].claimList = [...obj.list];
			this.claimDic.claimMachineList[this.addIndex].total = Number(obj.total).toFixed(2);
			let tn = this.claimDic.claimMachineList.reduce((t, y) => {
				return t + Number(y.total).toFixed(2);
			}, 0);
			this.claimDic.total = Number(tn).toFixed(2) + '';
		});
		uni.$on('choose-contract-emit', data => {
			let dict = data.dict;
			let licenseId = data.licenseId;
			let machines = data.machines.map(o => {
				return {
					...o,
					total: '0',
					claimList: []
				};
			});
			this.claimDic = {
				...this.claimDic,
				licenseId:licenseId,
				contractNo: dict.businessNo,
				contractDetailId: dict.contractDetailDto.id,
				customerName: dict.customerName,
				customerId: dict.customerId,
				customerType: dict.customerType,
				contactName: dict.contractDetailDto.contactName,
				contactId: dict.contractDetailDto.contactId,
				phoneNum: dict.contractDetailDto.phoneNum,
				orgName: dict.orgName,
				orgId: dict.orgId,
				customerSalesman: dict.contractDetailDto.customerSalesman,
				customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
				projectName: dict.contractDetailDto.projectName,
				total:0,
				claimMachineList: machines
			};
			console.log(JSON.stringify(this.claimDic));
			this.contractDicName = this.claimDic.customerName + '-' + this.claimDic.projectName;
		});
		uni.$on('choosedMachines', obj => {
			let machines = obj.data.map(o => {
				return {
					...o,
					total: '0',
					claimList: []
				};
			});
			this.claimDic.claimMachineList = [ ...this.claimDic.claimMachineList,...machines];
		})
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-contract-emit');
		uni.$off('claimItems');
		uni.$off('choosedMachines');
	},
	methods: {
		showdelete(v){
			if(this.isAdjust){
				return false
			}
			if(v.licenseId === this.claimDic.licenseId){
				return false
			}
			return true
		},
		getDate(time) {
			if (!time) return '';
			return time.split(/\s+/)[0];
		},
		/**获取退回后通过dataForm接口获取的数据详情
		 * @param {Object} val json数据
		 */
		getBackData(val) {
			this.claimDic = JSON.parse(val);
			this.contractDicName = this.claimDic.customerName + '-' + this.claimDic.projectName;
		},
		/**
		 * 获取变更单号
		 */
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'SP');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.claimDic = {
						...this.claimDic,
						businessNo: result
					};
				})
				.catch(err => {});
		},
		loaddata(key) {
			let param = {
				businessNo: key
			};
			this.$network
				.getData(this.$url.CLAIM_DETAIL, 'GET', param)
				.then(result => {
					this.claimDic = {
						...result,
						id: this.isAdjust ? null : result.id,
						businessKey: this.isAdjust ? null : result.businessKey
					};
					this.contractDicName = this.claimDic.customerName + '-' + this.claimDic.projectName;
				})
				.catch(err => {});
		},
		//跳入合同列表
		gotoContract() {
			let url = './claim-choose-contract?delta=1&item=' + encodeURIComponent(JSON.stringify(this.claimDic));
			uni.navigateTo({
				url: url
			});
		},
		//跳入联系人列表
		gotocustom() {
			uni.navigateTo({
				url: '/otherPages/linkman/linkman?nextview=false'
			});
		},
		showPick() {
			this.$refs.date.show();
		},
		onConfirm(val) {
			this.claimDic = { ...this.claimDic, claimDate: val.result };
		},
		addMachineContract() {
			uni.navigateTo({
				url: './claim-choose-machine?type=claim'
			});
		},
		/**
		 * 添加索赔设备
		 */
		addClaimMachine() {
			if (!this.claimDic.contractNo) {
				uni.showToast({
					icon: 'none',
					title: '请选择合同'
				});
				return;
			}
			uni.navigateTo({
				url: './machine-by-contract?choosedList=' + encodeURIComponent(JSON.stringify(this.claimDic.claimMachineList)) + '&contractNo=' +
					this.claimDic.contractNo + '&delta=' + 1
			});
		},
		/**
		 * 删除索赔设备
		 */
		removeClaimMachine(i) {
			this.claimDic.claimMachineList.splice(i, 1);
			let tn = this.claimDic.claimMachineList.reduce((t, y) => {
				return t + Number(y.total);
			}, 0);
			this.claimDic.total = tn + '';
		},
		//备注
		remarkmethod(val) {
			this.claimDic.remark = val;
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
			this.claimDic = {
				...this.claimDic,
				fileList: [...list]
			};
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			this.claimDic = {
				...this.claimDic,
				fileList: [...list]
			};
		},
		checkData() {
			if (!this.claimDic.licenseId) {
				uni.showToast({
					title: '请选择车辆',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.claimDic.customerId) {
				uni.showToast({
					title: '请选择客户信息',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.claimDic.contractNo) {
				uni.showToast({
					title: '请选择合同',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.isAdjust && !this.claimDic.claimDate) {
				uni.showToast({
					title: '请选择索赔日期',
					icon: 'none'
				});
				return Promise.reject('fail');
			}

			if (!this.claimDic.claimMachineList || (this.claimDic.claimMachineList && this.claimDic.claimMachineList.length <= 0)) {
				uni.showToast({
					title: '请选择索赔设备',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.claimDic.claimMachineList.some(o => !o.claimList || (o.claimList && o.claimList.length <= 0))) {
				uni.showToast({
					title: '所有设备索赔项不能为空',
					icon: 'none'
				});
				return Promise.reject('fail');
			}

			this.claimDic = {
				...this.claimDic,
				claimDate: this.claimDic.claimDate ? (this.findNotStr(this.claimDic.claimDate, '00:00:00') ? this.claimDic.claimDate + ' 00:00:00' : this.claimDic.claimDate) : null
			};
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
			let savedic = { ...this.claimDic };
			console.log(savedic);
			this.$network
				.getData(this.$url.CREATE_SERVICE_CLAIM + val, 'POST', savedic)
				.then(result => {
					uni.$emit('refresh-contract-list', {
						type: 'claim'
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
		addClaimItem(pos) {
			this.addIndex = pos;
			uni.navigateTo({
				url: './claim-items?claimList=' + encodeURIComponent(JSON.stringify(this.claimDic.claimMachineList[pos].claimList)) + '&isEdit=true&isAdjust=' + this.isAdjust
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
	// border-width: 0px 0px 1px 0px;
	// border-style: solid;
	// border-color: $uni-bg-color-grey;
	width: 140px;
	// height: 35px;
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
