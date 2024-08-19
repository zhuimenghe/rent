<template>
	<view class="fault-content">
		<view class="chart-content p flex align-center justify-between" @click="goTo">
			<text class="text-primary">历史异常记录</text>
			<text class="iconfont iconarrow-right text-gray text-xl"></text>
		</view>
		<view class="header">实时异常监控</view>
		<c-timeline :list="list">
			<template v-slot:default="{item}" >
				<fault-card :f="item"></fault-card>
			</template>
		</c-timeline>
	</view>
</template>

<script>
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import FaultCard from './fault-card.vue';

	export default {
		components: {
			labelArrow,
			FaultCard
		},
		props: {
			licenseId: {
				type: String, //当前选中下标
				default () {
					return '';
				}
			}
		},
		data() {
			return {
				list: []
			};
		},
		watch: {
			licenseId: {
				handler(val) {}
			}
		},
		created() {
			this.loadData();
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备监控详情","故障信息");
		},
		methods: {
			getDate(s) {
				if (!s) {
					return "--"
				}
				return this.$datestr.doubleFloat(s / 3600) + '小时';
			},
			async loadData() {
				let res = await this.$network.currentFaults(this.licenseId)
				this.list = res
			},
			goTo() {
				// uni.navigateTo({
				// 	url: './fault-warning-history-record?licenseId=' + this.licenseId
				// });
				uni.navigateTo({
					url: "./fault-warning-history-list?licenseId=" + this.licenseId
				})
			}
		}
	};
</script>

<style lang="scss" >
	@import './style.scss';
	.fault-content {
		width: 100%;
		background: $uni-bg-color-grey;
		display: flex;
		flex-direction: column;
		padding-top: 16px;
	}
</style>
<style lang="scss" scoped>
	.header{
		margin:24rpx;
		font-weight:bold;
	}
</style>
