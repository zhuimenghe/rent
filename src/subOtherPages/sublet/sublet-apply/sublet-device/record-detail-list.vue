<template>
	<view class="detail-list-view">
		<view class="item-bg" v-for="(item,index) in dataList" :key="index" @click="gotoVC(item)">
			<view class="left-line-bg">
				<view class="line-bg-top" v-if="index != 0"/>
				<view class="line-bg-top backline" v-if="index == 0"/>
				<view class="line-bg-med"/>
				<view class="line-bg-bottom" v-if="index != dataList.length - 1"/>
				<view class="line-bg-bottom" style="margin-bottom: 16px;" v-if="index == dataList.length - 1"/>
			</view>
			<view class="right-line-bg">
				<view class="right-line-top">
					<i class="iconfont right-line-top-left" :class="businessType[item.businessType]?businessType[item.businessType].icon : 'iconzl--zhushi'"></i>
					<view class="right-line-top-right">{{changestr(item.businessTime)}}</view>
				</view>
				<view class="right-line-med">{{item.content || '--'}}</view>
				<view class="right-line-bottom">{{item.businessNo || '--'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components:{},
	props: {
		dataList: {
			type: Array,
			default () {
				return [];
			}
		}
	},
	data(){
		return{
			businessType: {
				RENT:{
					color:'#e60000',
					icon:'iconhuankuanguanli'
				},
				CREATE: {
					color: '#E60000', //创建
					icon: 'iconzl--tiaodu'
				},
				WAREHOUSE: {
					color: '#E60000', //入库
					icon: 'iconzl--shezhi'
				},
				WORKIN: {
					color: '#E60000',
					icon: 'iconzl--ruchang'
				},
				WORKOUT: {
					color: '#F2AC53',
					icon: 'iconzl--chuchang'
				},
				PAUSE: {
					color: '#F7703E',
					icon: 'iconzl--zhuyi'
				},
				CLAIM: {
					color: '#F2AC53',
					icon: 'iconzl--suopei'
				},
				REPAIR: {
					color: '#F7703E',
					icon: 'iconzl--weixiu'
				},
				MAINTENANCE: {
					color: '#5C7DE7',
					icon: 'iconzl--baoyang'
				},
				INSPECTION: {
					color: '#E60000',
					icon: 'iconzl--xunjian-'
				},
				ALLOCATE: {
					color: '#FB8732',
					icon: 'iconzl--tiaodu'
				},
				SETTLEMENT: {
					color: '#5C7DE7',
					icon: 'iconzl--shezhi'
				},
				CHECK_REPAIR: {
					color: '#5C7DE7',
					icon: 'iconzl--shezhi'
				},
				PREPARE: {
					color: '#5C7DE7',
					icon: 'iconzl--shezhi'
				},
				DISPATCH: {
					color: '#5C7DE7',
					icon: 'iconzl--shezhi'
				},
				SUBLET: {
					color: '#FB8732',
					icon: 'iconzl--zhuanzu1'
				},
				STATEMENT: {
					color: '#FB8732',
					icon: 'iconzl--shezhi'
				},
				CONTRACT: {
					color: '#E60000',
					icon: 'iconzl--hetong'
				},
				BATTERY_PATROL:{
					color: '#E60000',
					icon: 'iconzl--xunjian-'
				}
			},
		}
	},
	methods:{
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		gotoVC(item){
			let url = '';
			let param = null;
			switch (item.businessType) {
				case 'WORKIN':
					url = this.$url.WORK_IN_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'CLAIM':
					url = this.$url.CLAIM_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'CONTRACT':
					url = this.$url.CONTRACT_DEATIL_BY_NO;
					param = {
						id: item.id
					};
					break;
				case 'WORKOUT':
					url = this.$url.WORK_OUT_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'PAUSE':
					url = this.$url.PAUSE_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'REPAIR':
					url = this.$url.MACHINE_REPAIR_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'MAINTENANCE':
					url = this.$url.MAINTAIN_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'CHECK_REPAIR':
					url = this.$url.STOCK_SERVICE_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'SUBLET':
					url = this.$url.SUBLET_APPLY_DETAIL;
					param = {
						businessNo: item.businessNo
					};
					break;
				case 'SETTLEMENT':
					url = this.$url.SETTLE_DETAIL + item.businessNo;
					break;
				case 'ALLOCATE':
					url = this.$url.ALLOT_DETAIL + item.businessNo;
					break;
				case 'STATEMENT':
					url = this.$url.SETTLE_DZ_DETAIL + item.businessNo;
					break;
				case 'SETTLE':
					url = this.$url.SETTLE_JQ_DETAIL + item.businessNo;
					break;
				case 'INSPECTION':
				    url = this.$url.MACHINE_POLLING_DETAIL;
					param = {
						businessNo:item.businessNo
					};
				    break;
				case "BATTERY_PATROL":
				    url = this.$url.BATTERY_POLLING_DETAIL;
				    param = {
				    	businessNo:item.businessNo
				    };
				    break;
				
			}
			if (url) {
				this.$network.getData(url, 'GET', param).then(result => {
					if (result && result.id) {
						this.goToBusinessDetail(item);
					} else {
						uni.showToast({
							icon: 'none',
							title: '暂无查看权限'
						});
					}
				}).catch(err => {});
			} else {
				this.goToBusinessDetail(item);
			}
		},
		goToBusinessDetail(item) {
			switch (item.businessType) {
				case 'WORKIN':
					businessNo = uni.navigateTo({
						url: '/businessPages/workin/workin-detail?businessNo=' + item.businessNo
					});
					break;
				case 'CLAIM':
					uni.navigateTo({
						url: '/businessPages/claim/claim-detail?businessNo=' + item.businessNo
					});
					break;
				case 'CONTRACT':
					uni.navigateTo({
						url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
					});
					break;
				case 'WORKOUT':
					uni.navigateTo({
						url: '/businessPages/workout/workout-detail?businessNo=' + item.businessNo
					});
					break;
				case 'PAUSE':
					uni.navigateTo({
						url: '/businessPages/pause/pause-detail?id=' + item.businessNo
					});
					break;
				case 'REPAIR':
					uni.navigateTo({
						url: '/devicePages/repair/repair-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'MAINTENANCE':
					uni.navigateTo({
						url: '/devicePages/maintain/maintain-detail?businessNo=' + item.businessNo
					});
					break;
				case 'CHECK_REPAIR':
					uni.navigateTo({
						url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'SETTLEMENT':
					uni.navigateTo({
						url: '/businessPages/settledown/settle-detail?businessNo=' + item.businessNo
					});
					break;
				case 'ALLOCATE':
					uni.navigateTo({
						url: '/devicePages/allot/allot-detail?businessNo=' + item.businessNo
					});
					break;
				case 'SUBLET':
					uni.navigateTo({
						url: '/otherPages/sublet/sublet-apply/sublet-apply-detail?businessNo=' + item.businessNo
					});
					break;
				case 'STATEMENT':
					uni.navigateTo({
						url: '/businessPages/settledown/settle-dz-detail?businessNo=' + item.businessNo
					});
					break;
				case 'SETTLE':
					uni.navigateTo({
						url: '/businessPages/settledown/settle-finish-detail-show?item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				case 'INSPECTION':
				    uni.navigateTo({
				    	url: '/devicePages/polling/polling-detail?businessNo=' + item.businessNo
				    });
				    break;
				case 'BATTERY_PATROL':
				    uni.navigateTo({
				    	url: '/devicePages/battery-polling/battery-polling-detail?businessNo=' + item.businessNo
				    });
				    break;
				default:
					uni.showToast({
						icon: 'none',
						title: '暂无详情'
					});
					break;
			}
		},
	}
}

</script>

<style scoped lang="scss">
.detail-list-view {
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
	width: 100%;
}
.item-bg{
	display: flex;
	flex-direction: row;
}
.left-line-bg{
	display: flex;
	flex-direction: column;
	margin-left: 8px;
	justify-content: center;
	align-items: center;
}
.line-bg-top{
	height: 7px;
	background: $uni-line-color;
	width: 1px;
}
.line-bg-med{
	width: 4px;
	height: 4px;
	background: #FFFFFF;
	border-radius: 50%;
	border: 5px solid #E60000;
}
.line-bg-bottom{
	flex: 1;
	background: $uni-line-color;
	width: 1px;
}
.right-line-bg{
	display: flex;
	flex: 1;
	padding: 10px 0px;
	background: #FFFFFF;
	border-radius: 8px;
	flex-direction: column;
	margin: 0px 8px 16px 8px;
}
.right-line-top{
	display: flex;
	flex-direction: row;
	align-items: center;
}
.right-line-top-left{
	width: 20px;
	height: 20px;
	text-align: center;
	line-height: 20px;
	margin-left: 15px;
	font-size: 18px;
	color: #E60000;
}
.right-line-med{
	margin-left: 45px;
	font-size: $uni-font-size-base;
	font-weight: bold;
	color: #222222;
}
.right-line-bottom{
	margin-left: 45px;
	font-size:12px;
	color: $uni-color-primary;
}
.right-line-top-right{
	margin-left: 10px;
	font-size:12px;
	font-weight: bold;
	color: #222222;
}
.backline{
	background: $uni-bg-color-grey;
}

</style>
