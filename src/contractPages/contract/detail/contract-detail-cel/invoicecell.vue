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
			<view class="cell-text-left fontsubcolor"><text>区域</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.orgName || '--' }}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>开票日期</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ getDate(dic.invoiceDate)  }}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>发票类型</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.typeName||"--"}}</text>
			</view>
		</view>
		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>发票金额</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{saveTwo(dic.total)!=='0.00'?saveTwo(dic.total): (dic.state==='1'?'--':'0.00') }}</text>
			</view>
		</view>

		<view class="cell-text">
			<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
			<view class="cell-text-right fontBlackcolor">
				<text>{{ dic.customerSalesmanName||"--"  }}</text>
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
			getDate(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			saveTwo(num) {
				return this.$datestr.doubleFloat(num);
			},
			goTo() {
				uni.navigateTo({
					url: '/businessPages/invoice/invoice-detail?businessNo=' + this.dic.businessNo
				});
			}
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
