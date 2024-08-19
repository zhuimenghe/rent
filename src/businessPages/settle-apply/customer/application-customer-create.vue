<template>
	<view class="content">
		<create-step processKey="settlementApply" @submitApply="clicksave" :itemData="backDic" @data-form="getBackData"
		 :updateObj="saveDic" :isUpdate="isUpdate">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="model-tag"><text>基本信息</text></view>
					<select-label-item tagName="单号" :isRequired="true" :isSelect="false" :value="applyDic.businessNo" />
					<select-label-item tagName="客户名称" :isRequired="true" hint="请选择客户" :value="applyDic.customerName" :icon="righticon"
					 @clickItemLabel="gotoCustomer" :isSelect="true" />
					<select-label-item tagName="业务负责人" :isSelect="false" :value="applyDic.customerSalesmanName||''" />
					<select-label-item tagName="申请类型" :isRequired="true" hint="请选择申请类型" :value="applyDic.applyType=='statement'?'对账':'结算'"
					 :icon="righticon" @clickItemLabel="showPick('applyType')" :isSelect="true" />

				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text>合同信息</text>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in applyDic.contractInfoDtoList" class="v-item-container" :key="i" @click="changeCheck(i)">
							<mycheckbox class="checkbox" :checked="v.checked" color="#E60000"  />
							<view class="item-col">
								<view class="item-top">
									<view class="item-col" style="flex: 2;">
										<text style="font-weight: bold;">{{ v.projectName }}</text>
										<text class="subText">业务负责人：{{ v.customerSalesmanName||'-' }}</text>

									</view>
									<view class="item-col" style="text-align: end;">
										<text class="subText"> {{v.contactName||''}}</text>
										<text class="subText"> {{v.contactPhoneNum||''}}</text>
									</view>
								</view>
								<view class="item-row">
									<tag-select :tagName="typeName+'开始时间'" :value="getDate(v.beginDate)" @tap="showPick('start', i)"
									 :textColor="textColor" :fontSize="fontSize" />
									<tag-select :tagName="typeName+'结束时间'" :value="getDate(v.endDate)" @tap="showPick('end', i)" :textColor="textColor"
									 :fontSize="fontSize" />
								</view>
							</view>
						</view>
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
	import TagSelect from '@/components/common/uni-tag/tag-select.vue';

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			imgupload,
			createStep,
			wPicker,
			TagSelect,
		},
		data() {
			return {
				dateIcon: 'iconzl--rili',
				righticon: 'iconarrow-right',
				applyDic: {
					applyType: 'settle',
					dimensionType: '1', //客户结算
					contractInfoDtoList: []
				},
				pickType: '',
				curIndex: 0,
				backDic: null,
				isUpdate: false,
				textColor: '#333333',
				fontSize: '14px',
				typeName: '结算',
				typeList: [{
						label: '对账',
						value: 'statement'
					},
					{
						label: '结算',
						value: 'settle'
					}
				],
				saveDic:{}
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
				this.isUpdate = option.isUpdate ? (option.isUpdate == '1' ? true : false) : false;
				console.log('isUpdate'+this.isUpdate)
			}
			//生成单号
			if (!option.businessNo && !this.backDic) {
				this.getBusinessNo();
			}
			if (option.customer) {
				let customerDic = JSON.parse(decodeURIComponent(option.customer));
				let contactNoList = customerDic.contractReceivableList && customerDic.contractReceivableList.length > 0 ?
					customerDic.contractReceivableList.map(o => {
						return o.businessNo
					}) : []
				this.getStatementData(customerDic.id, contactNoList, true)
			}
			uni.$on('choose-customer-emit', obj => {
				console.log(obj)
				let contactNoList = obj.dict.contractReceivableList && obj.dict.contractReceivableList.length > 0 ?
					obj.dict.contractReceivableList.map(o => {
						return o.businessNo
					}) : []
				this.getStatementData(obj.dict.id, contactNoList, true)

			});

		},
		onUnload() {
			// 取消监听事件
			uni.$off('choose-customer-emit');
		},
		methods: {
			gotoCustomer() {
				uni.navigateTo({
					url: '/businessPages/settle-apply/choose-customer-contract?singleCard=customer&type=' + this.applyDic
						.applyType
				})
			},
			changeCheck(pos) {
				this.applyDic.contractInfoDtoList[pos].checked = !this.applyDic.contractInfoDtoList[pos].checked
				console.log(this.applyDic)
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
			getStatementData(customerId, contractNoList, isNew) {
				let param = {
					contractNoList: contractNoList,
					customerId: customerId,
					type: '1',
					isApplyQuery: true //过滤合同状态
				}
				this.$network.getData(this.$url.SETTLEMENT_DATA_URL, "POST", param).then((result) => {
					if (result) {
						let contractInfoDtoList = []
						if (isNew) { //是否第一次新建
							this.applyDic = {
								...this.applyDic,
								customerId: result.customerId,
								customerName: result.customerName,
								customerSalesman: result.customerSalesman,
								customerSalesmanName: result.customerSalesmanName,
							}
							contractInfoDtoList = result.settleInfoDto && result.settleInfoDto.contractReceivableList && result.settleInfoDto
								.contractReceivableList ? result.settleInfoDto.contractReceivableList.map(obj => {
									return {
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
										checked: false

									}

								}) : [];

						} else { //退回或撤回
							if (result.settleInfoDto && result.settleInfoDto.contractReceivableList && result.settleInfoDto
								.contractReceivableList.length > 0) {
								let effectList = result.settleInfoDto.contractReceivableList.filter(o => o.state == '6' || o.state == '7')
								contractInfoDtoList = effectList ? effectList.map(obj => {
									//原来选中的合同
									let hadObj = this.applyDic.contractInfoDtoList && this.applyDic.contractInfoDtoList.length > 0 && this.applyDic
										.contractInfoDtoList.some(x => obj.id === x.contractId) ? this.applyDic.contractInfoDtoList.find(x => obj
											.id ===
											x.contractId) : null;

									return hadObj ? {
										...hadObj,
										checked: true
									} : {
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
										checked: false

									}

								}) : []
							}

						}
						console.log(contractInfoDtoList)
						this.applyDic = {
							...this.applyDic,
							contractInfoDtoList: contractInfoDtoList
						}

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
				this.applyDic = JSON.parse(val);
				this.getStatementData(this.applyDic.customerId, [], false)
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
						this.applyDic = JSON.parse(val);
						this.getStatementData(this.applyDic.customerId, [], false)
					})
					.catch(err => {});
			},

			showPick(type, i) {
				this.pickType = type;
				switch (type) {
					case 'start':
					case 'end':
						this.curIndex = i;
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
						this.applyDic.contractInfoDtoList[this.curIndex].beginDate = val.result + ' 00:00:00'
						this.applyDic = {
							...this.applyDic
						};
						break;
					case 'end':
						this.applyDic.contractInfoDtoList[this.curIndex].endDate = val.result + ' 23:59:59'
						this.applyDic = {
							...this.applyDic
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
				if (!this.applyDic.customerId) {
					uni.showToast({
						title: '请选择客户',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				let checkedList = this.applyDic.contractInfoDtoList.filter(o => o.checked)
				if (!checkedList || checkedList.length <= 0) {
					uni.showToast({
						title: '请选择合同',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (checkedList.some(o => !o.beginDate)) {
					uni.showToast({
						title: '请选择开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (checkedList.some(o => !o.endDate)) {
					uni.showToast({
						title: '请选择结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				this.saveDic = {
					...this.applyDic,
					contractInfoDtoList: checkedList.map(o => {
						return {
							...o,
							checked: undefined
						}
					})
				}
				return Promise.resolve('success');
			},
			//确定按钮
			clicksave(val) {
				uni.showLoading({
					mask: true
				});				
				this.$network
					.getData(this.$url.CREATE_APPLY + val, 'POST', this.saveDic)
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

	.vehicle-list-container {
		padding: 15px;
	}

	.checkbox {
		transform: scale(0.8);
	}


	.v-item-container {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid $uni-bg-color-grey;
		padding-bottom: 4px;
		margin-bottom: 4px;
	}

	.item-col {
		display: flex;

		flex-direction: column;
		justify-content: center;
		flex: 1
	}


	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.subText {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		margin-top: 4px;
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
		padding-left: 2px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.item-row text {
		flex: 1;
	}
</style>
