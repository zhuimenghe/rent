<template>
	<view class="workout-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view style="flex: 3;">
					<view class="search-box" v-if="type==='customer'">
						<i class="iconfont search-icon iconzl--sousuo"></i>
						<view class="search-content"><input style="flex: 1;" placeholder="请输入合同名称" v-model="contractName" /></view>
					</view>
				</view>
				<view class="filter-view-style">
					<filter-view @clickFilter="filtrateMenu" backgroundColor="#ffffff" 
					textColor="#222222"  />
				</view>
			</view>
			<view class="filter-container" v-if="isshow">
				<view class="condition-select">
					<label-arrow :value="startTime == '' ? '起始时间' : startTime" textColor="#999999" @clickLabel="showPick('startTime')" />
					<view style="width: 25%;height: 1px;background-color: #999999;" />
					<label-arrow :value="endTime == '' ? '结束时间' : endTime" textColor="#999999" @clickLabel="showPick('endTime')" />
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">确定</view>
				</view>
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<!-- taxNumber -->
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text" v-if="type==='customer'">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<text>{{ item.customerName || '' }}-{{ item.projectName || '' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>合同账期</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ getDate(item.periodBeginDate)||'--'}}至{{getDate(item.periodEndDate)||'--'}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>逾期日</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ getDate(item.overdueBeginDate)|| '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>本期逾期金额</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.debtPeriodOccur || '--' }}元</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>本期实时金额</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.debtPeriod || '--' }}元</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>截止本期总逾期（实时）</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.debtOverdue || '--' }}元</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>逾期结束</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ getDate(item.overdueEndDate)||'--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>已逾期天数</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.overDueDays || '--' }}天</text>
						</view>
					</view>
					<view class="cell-text" v-if="type==='customer'">
						<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerSalesmanName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text" v-if="type==='customer'">
						<view class="cell-text-left fontsubcolor"><text>更新时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.createTime || '--' }}</text>
						</view>
					</view>

				</cell>
				<view style="padding-bottom: 64px;">
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
		</view>
		<view class="bottom-view">
			<!-- <view class="choosed-view">上次更新时间：<span>{{datalist.length>0?datalist[0].createTime:'--'}} </span></view> -->
			<view class="confirm-view" @click="updateData">更新</view>
		</view>
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm"
		 :disabledAfter="false" ref="date" themeColor="#E60000" />
	</view>
</template>

<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import hoursUtil from '@/common/util/day-working-hours.js';
	import badgeview from '@/components/common/image-upload/badge-icon.vue';
	var timer;
	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker,
			badgeview
		},
		watch: {
			contractName: {
				handler(val) {
					if (timer) {
						clearTimeout(timer);
					}
					timer = setTimeout(() => {
						this.headerrefresh()
					}, 500)
				}
			}
		},
		data() {
			return {
				currentpage: 1,
				datalist: [
				],
				morestatus: 'more',
				searchKey: '',
				//顶部时间参数
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				isshow: false,
				contractNo: '',
				type: 'contract', //
				contractName: "", //搜索合同名称
				customerId: ''
			};
		},
		onLoad(option) {
			if (option.contractNo) {
				this.contractNo = option.contractNo
			}
			if (option.customerId) {
				this.customerId = option.customerId;
			}
			this.type = option.type
			this.loaddata()
		},
		methods: {
			getDate(time) {
				if (!time)
					return "--"
				return time.split(/\s+/)[0];
			},
			headerrefresh() {
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			footerrefresh() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.currentpage += 1;
				this.morestatus = 'loading';
				this.datalist = this.datalist.concat(this.datalist)
				this.loaddata();
			},
			loaddata() {
				uni.showLoading();
				let param = {
					current: this.currentpage,
					size: 10,

				};
				if (this.type === 'contract') {
					param = {
						...param,
						contractNo: this.contractNo
					}
				} else if (this.type === 'customer') {
					param = {
						...param,
						customerId: this.customerId
					}

				}
				if (this.startTime) {
					param = {
						...param,
						beginDate: this.startTime + ' 00:00:00'
					}
				}
				if (this.endTime) {
					param = {
						...param,
						endDate: this.endTime + ' 23:59:59'
					}
				}
				if (this.contractName) {
					param = {
						...param,
						contractName: this.contractName
					}
				}
				this.$network
					.getData(this.$url.OVERDUE_RECORD, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			updateData() {
				uni.showModal({
					title:'提示',
					content:'更新逾期记录的过程将会持续几分钟左右，请在几分钟后重新打开逾期记录查询更新后的结果',
					showCancel:false,
					success: (res) => {
						if (res.cancel) {} else {
							uni.showLoading({
								title:"更新中，请稍后查看",
								mask:true
							})
							let param = {}
							if (this.type === 'contract') {
								param = {
									contractNo: this.contractNo
								}
							} else if (this.type === 'customer') {
								param = {
									customerId: this.customerId
								}
							
							}
							this.$network
								.getData(this.$url.OVERDUE_UPDATE, 'GET', param)
								.then(result => {
									uni.hideLoading();
									this.headerrefresh()
								})
								.catch(err => {
									uni.hideLoading();
									uni.showToast({
										icon: "none",
										title: err.detail && err.detail[0] ? err.detail[0] : err.message
									})
								});
						}
					}
				})
				
			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				this.headerrefresh();
			},
			//顶部时间方法
			filtrateMenu() {
				this.isshow = !this.isshow;
			},
			showPick(type) {
				this.pickType = type;
				this.$refs.date.show();
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'startTime':
						this.startTime = val.result;
						break;
					case 'endTime':
						this.endTime = val.result;
						break;
					default:
						break;
				}
			},
			clearsum() {
				this.startTime = '';
				this.endTime = '';
				this.isshow = false;
				this.headerrefresh();
			},
			oksum() {
				if(!((!this.startTime&&!this.endTime) || (this.startTime&&this.endTime))){
					uni.showToast({
						title: '起始或结束时间不可为空',
						icon: 'none'
					});
					return;
				}else {
					this.isshow = false;
					this.headerrefresh();
				}
			},
		},
		onPullDownRefresh() {
			this.headerrefresh()
		},
		onReachBottom() {
			this.footerrefresh()
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.workout-list-bg {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
		position: relative;
	}

	//列表的subview
	.list-sub-view {
		display: flex;
		flex-direction: column;
		margin-top: 48px;
	}

	//列表
	.list-view {
		display: flex;
		flex-direction: column;
	}

	//列表cell
	.list-view-cell {
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 5px;
		padding-bottom: 5px;
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
		margin-bottom: 10px;
	}

	.fontgreencolor {
		color: #4cd964;
	}


	.fontsubcolor {
		color: $uni-text-color-gray;
	}

	//顶部时间
	.top-view {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		top: 0px;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 299;
		background: #ffffff;
		margin-top: 40px;
	}

	.condition-tag {
		color: $uni-text-color;
		font-size: $uni-font-size-lg;
		margin-left: 20px;
		margin-top: 8px;
	}

	.condition-select {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 8px;
		padding-bottom: 8px;
		margin: 10px 20px 10px 20px;
		align-items: center;
	}

	.condition-btn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 8px;
	}

	.clear {
		background-color: $uni-border-color;
		margin-right: 8px;
	}

	.confirm {
		background-color: $uni-color-primary;
		margin-left: 8px;
	}

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 10px;
		margin-right: 10px;
		text-align: center;
		border-radius: 4px;
		flex: 1;
		color: #ffffff;
		font-size: $uni-font-size-base;
		height: 40px;
	}

	//搜索框
	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
		z-index: 100;
		position: fixed;
		top: 0px;
		left: 0px;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 4px 8px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		margin-right: 10px;
	}

	//筛选父视图
	.filter-view-style {
		height: 35px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		flex: 1;
	}

	.bottom-view {
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		justify-content: flex-end;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		z-index: 100;
		box-shadow: 1px 0px 1px $uni-text-color-gray;
	}

	.choosed-view {
		margin-left: 16px;
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: $uni-text-color-gray;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.confirm-view {
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		padding: 5px 10px;
		border-radius: 4px;
	}
</style>
