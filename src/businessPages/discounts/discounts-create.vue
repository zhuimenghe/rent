<template>
	<view class="content">
		<create-step processKey="contractDiscounts" @submitApply="clicksave" :itemData="backDic" @data-form="getBackData"
		 :updateObj="detailDic" :isUpdate="isUpdate">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<select-label-item tagName="调整单号" :isRequired="true" :isSelect="false" :value="detailDic.businessNo" />
					<select-label-item tagName="合同名称" :isRequired="true" :value="contractDicName" :isSelect="true" @clickItemLabel="gotoContract" />
					<view v-if="detailDic.contractNo">
						<select-label-item tagName="业务负责人" :isSelect="false" :value="detailDic.customerSalesmanName||''" />
						<select-label-item tagName="结算金额" :isSelect="false" :value="formatMoney(detailDic.receivable)" />
						<select-label-item tagName="收款金额" :isSelect="false" :value="formatMoney(detailDic.receipt)" />
						<select-label-item tagName="调整类型" :isRequired="true" hint="请选择调整类型" :value="detailDic.adjustType=='reduce'?'优惠':'增收'"
						 @clickItemLabel="showPick" :isSelect="true" />
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>调整金额</text></view>
							<view class="cell-input-view-right">
								<input class="input-style" type="digit" v-model="adjustAccount" placeholder="请输入调整金额..." />
							</view>
						</view>
						<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="detailDic.remark" />
					</view>

				</view>
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
				adjustAccount: '',
				detailDic: {
					adjustType:'reduce',
					adjustTypeName:'优惠'
				},
				pickType: '',
				backDic: null,
				isUpdate: false,
				contractDicName: '',
				typeList: [{
						label: '优惠',
						value: 'reduce'
					},
					{
						label: '增收',
						value: 'increases'
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
				this.contractDicName = contractDic.customerName + '-' + contractDic.contractDetailDto.projectName;
				this.getStatementData(contractDic.businessNo)
			}
			// uni.$on('choose-contract-emit', obj => {
			// 	this.contractDicName = obj.dict.customerName + '-' + obj.dict.contractDetailDto.projectName;
			// 	this.getStatementData(obj.dict.businessNo)

			// });

		},
		onUnload() {
			// 取消监听事件
			// uni.$off('choose-contract-emit');
		},
		methods: {
			formatMoney(num) {
				return this.$datestr.doubleFloat(num);
			},
			gotoContract() {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.detailDic.contractNo
				});
			},
			getBusinessNo() {
				let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'YH')
				this.$network.getData(url, "GET", null).then((result) => {
					this.detailDic = {
						...this.detailDic,
						"businessNo": result,
					}
				}).catch((err) => {})
			},
			remarkmethod(val) {
				this.detailDic = {
					...this.detailDic,
					remark: val
				}
			},
			getStatementData(contractNo) {
				let param = {
					contractNo: contractNo
				}
				this.$network.getData(this.$url.GET_SETTLE_BY_CONTRACT, "GET", param).then((result) => {
					if (result) {
						this.detailDic = {
							...this.detailDic,
							contractNo: result.contractNo,
							orgId: result.orgId,
							settlementNo: result.settlementNo,
							receivable: result.receivable,
							receipt: result.receipt,
							customerSalesmanName: result.customerSalesmanName,
							customerSalesman: result.customerSalesman,
							customerName:result.customerName
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
				this.detailDic = JSON.parse(val);
				this.adjustAccount = this.detailDic.adjustAccount
				this.contractDicName = this.detailDic.customerName + '-' + this.detailDic.projectName;

			},
			loaddata(key) {
				let param = {
					businessNo: key
				};
				this.$network
					.getData(this.$url.DISCOUNT_DETAIL, 'GET', param)
					.then(result => {
						this.detailDic = {
							...result
						};
						this.adjustAccount = this.detailDic.adjustAccount
						this.contractDicName = this.detailDic.customerName + '-' + this.detailDic.projectName;
					})
					.catch(err => {});
			},

			showPick() {
				this.$refs.selector.show();

			},
			onConfirm(val) {
				this.detailDic = {
					...this.detailDic,
					adjustType: val.checkArr.value
				};

			},

			//取消按钮
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			checkData() {
				if (!this.detailDic.contractNo) {
					uni.showToast({
						title: '请选择合同',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.adjustAccount || Number(this.adjustAccount)<=0) {
					uni.showToast({
						title: '请输入大于0的调整金额',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				this.detailDic = {
					...this.detailDic,
					adjustAccount: this.adjustAccount
				}
				return Promise.resolve('success');
			},
			//确定按钮
			clicksave(val) {
				this.$network
					.getData(this.$url.CREATE_DISCOUNT + val, 'POST', this.detailDic,{showLoading:true})
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
					})
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
		// height: 35px;
		// line-height: 35px;
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
