<template>
	<view class="sum-view-bg" style="margin-bottom: 5px;">
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #DCDCDC;border-bottom-style: solid;">
			<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
		</view>
		<view class="cell-input-view">
			<view class="cell-input-view-left"><text>补录单号:</text></view>
			<view class="cell-input-view-right">
				<text class="input-style">{{ dataDic.businessNo || '--' }}</text>
			</view>
		</view>
		<select-label-item 
		tagName="合同名称" 
		:isRequired="true"
		 hint="请选择合同" 
		:value="getcontractName(dataDic)" 
		:icon="righticon" 
		@clickItemLabel="gotoContract" 
		/>
		<view style="display: flex;flex-direction: column;" v-if="dataDic.contractNo">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.orgName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务负责人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.customerSalesmanName || '--' }}</text>
				</view>
			</view>
			<!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>联系人</text></view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="text" 
					v-model="dataDic.contactName" 
					placeholder="请输入联系人...." 
					:disabled="!isedit" 
					/>
				</view>
			</view> -->
			<contactItem
			:contactName="dataDic.contactName" 
			dutyType='4' 
			:customerId="dataDic.customerId" 
			@getContactVal="getContactVal"
			:isEdit='isedit'/>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>联系人电话</text></view>
				<view class="cell-input-view-right">
					<input
						class="input-style"
						type="number"
						v-model="dataDic.phoneNum"
						placeholder="请输入联系人电话...."
						:disabled="!isedit"
						@click="callPhone(dataDic.phoneNum)"
						:style="{ color: !isedit ? '#E60000' : '#333333' }"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import contactItem from '@/components/common/common-ui/contact-item.vue'
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		contactItem
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			contractName: '',
			choosetypeArr: []
		};
	},
	props: {
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		},
		isedit: {
			type: Boolean,
			default: true
		},
		isLiangXu: {
			type: Boolean,
			default: false
		},
	},
	watch: {
		'dataDic.contactName'(val) {
			let dict = {
				...this.dataDic,
				contactName: val
			};
			this.$emit('clickevent', {
				type: 'value',
				data: dict
			});
		},
		'dataDic.phoneNum'(val) {
			let dict = {
				...this.dataDic,
				phoneNum: val
			};
			this.$emit('clickevent', {
				type: 'value',
				data: dict
			});
		}
	},
	created() {
		//合同
		uni.$on('choose-contract-emit', usnerinfo => {
			this.setContractData(usnerinfo.dict);
		});
	},
	methods: {
		callPhone(phone) {
			if (!this.isedit && phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: res => {
						console.log('调用成功!');
					},
					fail: res => {
						console.log('调用失败!');
					}
				});
			}
		},
		getYMDHMTime(date) {
			let d = '';
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		//合同名处理
		getcontractName(val) {
			let customerName = val.customerName || '';
			let projectName = val.projectName || '';
			if (!customerName && !projectName) {
				return '';
			}
			let name = customerName + '-' + projectName;
			return name;
		},
		//时间处理
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//选择合同
		gotoContract() {
			if (this.isedit === false) {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.dataDic.contractNo
				});
				return;
			}
			let url = '/businessPages/invoice/contract-choose?type=workInOut&state=5,6,7,8';
			uni.navigateTo({
				url: url
			});
		},
		//合同信息处理
		setContractData(dict){
			let orderList = dict.contractDetailDto.orderList.map(o=>{
				return {
					...o,
					machineList:[]
				}
			});
			uni.showLoading()
			let url = this.$url.LINKMAN_PERSON_CONNECT + dict.customerId + "?dutyTypeSort=4"
			this.$network.getData(url, "GET", null).then((result) => {
				let contractDic = result.length > 0 ? result[0] : {};
				let newcontractdict = {
					...this.dataDic,
					contractDetailId: dict.contractDetailDto.id || '', //合同详情ID
					contractNo: dict.businessNo || '', //合同单号
					customerId: dict.customerId || '', //客户id
					customerName: dict.customerName || '', //客户名称
					projectName: dict.contractDetailDto.projectName || "", //项目名称
					customerSalesman: dict.contractDetailDto.customerSalesman,
					customerSalesmanName: dict.contractDetailDto.customerSalesmanName,
					orgId: dict.orgId,
					orgName: dict.orgName,
					contactName: contractDic.name || dict.contactName,
					phoneNum: contractDic.phoneNum || dict.phoneNum,
					orderList:orderList,
				}
				this.$emit('clickevent', {
					type: 'value',
					data: newcontractdict
				});
				uni.hideLoading()
			}).catch((err) => {
				uni.hideLoading()
			})
		},
		//获取联系人信息
		getContactVal(val){
			let newdataDic = {
				...this.dataDic,
				contactName: val.name || '',
				phoneNum: val.phoneNum || '',
			}
			this.$emit('clickevent', {
				type: 'value',
				data: newdataDic
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px;
	margin-bottom: 20px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
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
	min-height: 24px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
	line-height: 16px;
}

.cell-section-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	margin: 2px 4px;
}

.cell-between {
	display: flex;
	margin: 0px 4px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.cell-section-view-width {
	display: flex;
	flex-direction: row;
	flex: 1;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	align-items: center;
	justify-content: center;
}

.cell-view {
	font-size: $uni-font-size-base;
	font-weight: bold;
	color: $uni-text-color;
}

.cell-input-view-list {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	min-height: 30px;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	flex: 1;
}

.cell-input-view-list-column {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 4px;
}

.cell-input-view-left-small {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 20px;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
}

.add-btn {
	background-color: $uni-color-primary;
	padding: 2px 6px;
	border-radius: 4px;
	color: #ffffff;
}

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 5px;
}

.workin-dd-list {
	display: flex;
	flex-direction: column;
}
</style>
