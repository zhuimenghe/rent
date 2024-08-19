<template>
	<view class="content">
		<create-step processKey="settlementApply" @submitApply="clicksave" :itemData="backDic" @data-form="getBackData"
		 :updateObj="applyDic" :isUpdate="isUpdate">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>合同信息</text></view>
					<select-label-item tagName="单号" :isRequired="true" :isSelect="false" :value="applyDic.businessNo" />
					<select-label-item tagName="申请类型" :isRequired="true" hint="请选择申请类型" :value="applyDic.applyType=='statement'?'对账':'结算'"
					 :icon="righticon" @clickItemLabel="showPick('applyType')" :isSelect="true" />
					<select-label-item tagName="合同名称" :isRequired="true" hint="请选择合同" :value="contractDicName" :icon="righticon"
					 @clickItemLabel="gotoContract" :isSelect="true" />
					<view v-if="applyDic.contractInfoDtoList&&applyDic.contractInfoDtoList.length>0">
						<select-label-item tagName="业务负责人" :isSelect="false" :value="applyDic.contractInfoDtoList[0].customerSalesmanName||''" />
						<select-label-item tagName="联系人" :isSelect="false" :value="applyDic.contractInfoDtoList[0].customerName||''" />
						<select-label-item tagName="联系电话" :isSelect="false" :value="applyDic.contractInfoDtoList[0].contactPhoneNum||''" />
						<select-label-item :tagName="typeName+'开始时间'" :isRequired="true" hint="请选择" :value="getDate(applyDic.contractInfoDtoList[0].beginDate)"
						 :icon="dateIcon" @clickItemLabel="showPick('start')" />
						<select-label-item :tagName="typeName+'结束时间'" :isRequired="true" hint="请选择" :value="getDate(applyDic.contractInfoDtoList[0].endDate)"
						 :icon="dateIcon" @clickItemLabel="showPick('end')" />
					</view>

				</view>

				<!-- <view class="sum-view-bg">
					<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" :imgFinishlist="applyDic.fileList" type="insurance_type"
					 uploadType="attachment" :maximg="20" />
					<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="applyDic.remark" />
				</view> -->
				<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
				 ref="date" themeColor="#E60000" />
				 <w-picker :selectList="typeList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
			</view>
		</create-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
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
		data() {
			return {
				dateIcon: 'iconzl--rili',
				righticon: 'iconarrow-right',
				selectList: [],
				applyDic: {
					applyType: 'settle',
					dimensionType: '2', //合同结算
					contractInfoDtoList: []
				},
				pickType: '',
				backDic: null,
				isUpdate: false,
				contractDicName: '',
				typeName:'结算',
				typeList: [{
						label: '对账',
						value: 'statement'
					},
					{
						label: '结算',
						value: 'settle'
					}
				],
			}

		},
		onLoad(option) {
			if (option.businessNo) {
				//撤回编辑
				this.loaddata(option.businessNo);
			}
			if (option.item) {
				//退回编辑
				this.backDic = JSON.parse(decodeURIComponent(option.item));
				this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			}
			//生成单号
			if (!option.businessNo && !this.backDic) {
				this.getBusinessNo();
			}
			if (option.contract) {
				let contractDic = JSON.parse(decodeURIComponent(option.contract));
				let contactNoList = contractDic.businessNo ? [contractDic.businessNo] : []
				this.getStatementData(contractDic.customerId, contactNoList)
			}
			uni.$on('choose-contract-emit', obj => {
				let contactNoList = obj.dict.businessNo ? [obj.dict.businessNo] : []
				this.getStatementData(obj.dict.customerId, contactNoList)

			});

		},
		onUnload() {
			// 取消监听事件
			uni.$off('choose-contract-emit');
		},
		methods: {
			gotoContract() {
				uni.navigateTo({
					url: '/businessPages/settle-apply/choose-customer-contract?singleCard=contract&type=' + this.applyDic.applyType
				})
			},
			getBusinessNo() {
				let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'SQ')
				this.$network.getData(url, "GET", null).then((result) => {
					this.applyDic = {
						...this.applyDic,
						"businessNo": result,
					}
				}).catch((err) => {})
			},
			getStatementData(customerId, contractNoList) {
				let param = {
					contractNoList: contractNoList,
					customerId: customerId,
					type:'2',
				}
				this.$network.getData(this.$url.SETTLEMENT_DATA_URL, "POST", param).then((result) => {
					if (result && result.settleInfoDto && result.settleInfoDto.contractReceivableList && result.settleInfoDto.contractReceivableList
						.length > 0) {
						let obj = result.settleInfoDto.contractReceivableList[0];
						this.contractDicName = obj.customerName + '-' + obj.projectName;
						this.applyDic = {
							...this.applyDic,
							customerId: obj.customerId,
							customerName: obj.customerName,
							contractNo: obj.businessNo,
							customerSalesman: obj.customerSalesman,
							customerSalesmanName: obj.customerSalesmanName,
							contractInfoDtoList: [{
								contractId: obj.id,
								contractNo: obj.businessNo,
								contractType: obj.contractType,
								contractTypeName: obj.contractTypeName,
								contractDetailId: obj.contractDetailId,
								customerId: obj.customerId,
								customerName: obj.customerName,
								projectName: obj.projectName,
								orgId: obj.orgId,
								orgName: obj.orgName,
								beginDate: obj.settleBeginDate,
								endDate: obj.settleEndDate,
								contactName: obj.contactName,
								contactPhoneNum: obj.phoneNum,
								customerSalesman: obj.customerSalesman,
								customerSalesmanName: obj.customerSalesmanName,

							}]
						}
					} else {
						this.contractDicName = '';
						this.applyDic = {
							...this.applyDic,
							customerId: null,
							customerName: null,
							contractNo: null,
							contractInfoDtoList: []
						}
					}
				}).catch((err) => {})
			},
			getDate(time) {
				if (!time) return '-';
				return time.split(/\s+/)[0];
			},
			/**获取退回后通过dataForm接口获取的数据详情
			 * @param {Object} val json数据
			 */
			getBackData(val) {
				this.applyDic = JSON.parse(val);
				this.contractDicName = this.applyDic.contractInfoDtoList[0].customerName + '-' + this.applyDic.contractInfoDtoList[0].projectName;
			},
			loaddata(key) {
				let param = {
					businessNo: key
				};
				this.$network
					.getData(this.$url.APPLY_DATEIL, 'GET', param)
					.then(result => {
						this.applyDic = {
							...result
						};
						this.contractDicName = this.applyDic.contractInfoDtoList[0].customerName + '-' + this.applyDic.contractInfoDtoList[0].projectName;
					})
					.catch(err => {});
			},

			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'start':
					case 'end':
						this.$refs.date.show();
						break;
					case 'applyType':
						this.$refs.selector.show();
						break;
					default:
						break;
				}

			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'start':
						this.applyDic = { ...this.applyDic,
							contractInfoDtoList: [{
								...this.applyDic.contractInfoDtoList[0],
								beginDate: val.result + ' 00:00:00'
							}]
						};
						break;
					case 'end':
						this.applyDic = { ...this.applyDic,
							contractInfoDtoList: [{
								...this.applyDic.contractInfoDtoList[0],
								endDate: val.result + ' 23:59:59'
							}]
						};
						break;
					case 'applyType':
						this.applyDic = {
							...this.applyDic,
							applyType: val.checkArr.value
						};
						this.typeName = val.checkArr.label
						break;
					default:
						break;
				}

			},

			//取消按钮
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},


			checkData() {
				console.log(this.applyDic)
				if (!this.applyDic.contractInfoDtoList || this.applyDic.contractInfoDtoList.length <= 0) {
					uni.showToast({
						title: '请选择合同',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.applyDic.contractInfoDtoList[0].beginDate) {
					uni.showToast({
						title: '请选择开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.applyDic.contractInfoDtoList[0].endDate) {
					uni.showToast({
						title: '请选择结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				return Promise.resolve('success');
			},
			//确定按钮
			clicksave(val) {
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.CREATE_APPLY + val, 'POST', this.applyDic)
					.then(result => {
						uni.$emit('refresh-contract-list', {
							type: 'apply'
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
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
		height: 35px;
		line-height: 35px;
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
