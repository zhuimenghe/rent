<!-- 索赔 -->
<template>
	<view class="cellBgView">
		<view class="cell-text">
			<view class="cell-text-left fontBlackcolor" style="color: #000000;">
				<text>{{ dic.businessNo||"--" }}</text>
			</view>
			<view class="cell-text-right fontgreencolor">
				<text>{{ dic.stateName||"--"  }}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>客户名称</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.customerName||"--"  }}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>项目名称</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ getProjectName(dic)}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{dic.customerSalesmanName || "--"}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>对账维度</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.type=='2'?'合同':'客户'}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>对账周期</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{changestr(dic.beginDate)}}~{{changestr(dic.endDate)}}</text>
			</view>
		</view>
		
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>对账营收</text>
				<businessTips tipName='settleRevenue' />
			</view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{saveTwo(dic.settleInfoDto&&dic.settleInfoDto.receivable?dic.settleInfoDto.receivable.total:0)}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>履约营收</text>
				<businessTips tipName='performRevenue' />
			</view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ saveTwo(dic.settleInfoDto&&dic.settleInfoDto.receivableCurrent?dic.settleInfoDto.receivableCurrent.total:0)}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>实收</text>
				<businessTips tipName='receivedRevenue' />
			</view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ saveTwo(dic.receipt?dic.receipt.total:0)}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>应收</text>
				<businessTips tipName='settleReceivable' />
			</view>
			<view class="cell-text-right fontBlackcolor">
				<text style="color: #4cd964;" v-if="saveTwo(dic.total) < 0">{{ saveTwo(dic.total)}}</text>
				<text style="color: #FF0000;" v-else>{{ saveTwo(dic.total)}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>区域</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.orgName || ""}}</text>
			</view>
		</view>
		<view class="line-s" />
		<view class="cell-text-right fontdetailcolor" @click="goTo"><text>详情</text></view>
	</view>
</template>
<script>
	export default {
		props: {
			dic: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		data() {
			return {};
		},
		methods: {
			goTo() {
				let businessNostr = this.dic.businessNo;
				let url = '/businessPages/settledown/settle-dz-detail?businessNo=' + businessNostr;
				uni.navigateTo({
					url: url
				});
			},
			getProjectName(item) {
				if (item && item.settleInfoDto && item.settleInfoDto.contractReceivableList && item.settleInfoDto.contractReceivableList
					.length > 0) {
					let nameList = item.settleInfoDto.contractReceivableList.map(o => {
						return o.projectName;
					})
					return nameList.join(',')
				}
				return '--'
			
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			saveTwo(num) {
				return this.$datestr.doubleFloat(num);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.cellBgView {
		display: flex;
		flex: 1;
		flex-direction: column;
		margin: 10px;
		padding-bottom: 10px;
		background: #ffffff;
	}

	.cell-text {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}

	.cell-text-left {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-left: 15px;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.cell-text-right {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-right: 15px;
		justify-content: flex-end;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.fontBlackcolor {
		color: $uni-text-color;
	}

	.fontdetailcolor {
		color: $uni-color-primary;
	}

	.fontgreencolor {
		color: #4cd964;
	}

	.line-s {
		margin-top: 5px;
		margin-left: 10px;
		margin-right: 10px;
		height: 1px;
		background: #eeeeee;
	}
</style>
