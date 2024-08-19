<template>
	<view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content"><input placeholder="请输入物流单号" @input="searchChange" /></view>
				</view>
				<view class="filter-view-style">
					<filter-view @clickFilter="filtrateMenu" backgroundColor="#ffffff" 
					textColor="#222222"  />
				</view>
			</view>
			<view class="filter-container" v-if="isshow">
				<view class="condition-tag">时间段</view>
				<view class="condition-select">
					<label-arrow :value="startTime == '' ? '起始时间' : startTime" textColor="#555555" @clickLabel="showPick('startTime')" />
					<view style="width: 30%;height: 1px;background-color: #999999;" />
					<label-arrow :value="endTime == '' ? '结束时间' : endTime" textColor="#555555" @clickLabel="showPick('endTime')" />
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">确定</view>
				</view>
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>物流单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.logisticsKey || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.transportTime || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输公司</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.logisticsCompanyName || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输类型</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.transportTypeName || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>进退场单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.businessKey || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>客户名称</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerName || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输台量</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineNum || ""}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>物流金额</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.logisticsCarriage || ""}}</text>
						</view>
					</view>
				</cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
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
	var _self;
	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'more',
				searchKey: "",
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				isshow: false,
			};
		},
		mounted() {
			uni.showLoading();
			this.loaddata();
		},
		created() {
			_self = this
		},
		onPullDownRefresh() {
			this.headerrefresh()
		},
		onReachBottom() {
			this.footerrefresh() 
		},
		methods: {
			headerrefresh() {
				_self.currentpage = 1;
				_self.datalist = [];
				_self.loaddata();
			},
			footerrefresh() {
				if (_self.morestatus == 'noMore') {
					return;
				}
				_self.currentpage += 1;
				_self.morestatus = 'loading';
				_self.loaddata();
			},
			loaddata() {
				let param = {
					current: this.currentpage,
					size: 20,
					logisticsKey: this.searchKey,
				};
				//顶部时间参数
				if (this.startTime != '' && this.endTime != '') {
					this.datalist = [];
					param.current = 1;
					param.beginDate = this.startTime + ' 00:00:00';
					param.endDate = this.endTime + ' 23:59:59';
				}
				//=================
				this.$network
					.getData(this.$url.LOGISTICS_RECORD, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						this.$datestr.printlog(JSON.stringify(this.datalist))
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
			searchChange(val) {
				this.searchKey = val.detail.value;
				_self.currentpage = 1;
				_self.datalist = [];
				this.loaddata();
			},
			goTo(type, item) {
				switch (type) {
					case 'create':
						uni.navigateTo({
							url: '/businessPages/claim/creat-claim'
						})
						break;
					case 'detail':
						let businessNostr = item.businessNo;
						let url = '/businessPages/claim/claim-detail?businessNo=' + businessNostr;
						uni.navigateTo({
							url: url
						});
						break;
					case 'adjust':
						uni.navigateTo({
							url: '/businessPages/claim/creat-claim?businessNo=' + item.businessNo
						});
						break;
					default:
						break;
				}

			},
			//顶部时间方法
			filtrateMenu() {
				this.isshow = !this.isshow;
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'startTime':
						this.$refs.date.show();
						break;
					case 'endTime':
						this.$refs.date.show();
						break;
					default:
						break;
				}
			},
			onConfirm(val) {
				let self = this;
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
				uni.pageScrollTo({
					scrollTop: self.curScrollTop,
					duration: 300
				});
			},
			clearsum() {
				this.startTime = '';
				this.endTime = '';
				this.isshow = !this.isshow;
				this.loaddata();
			},
			oksum() {
				if (this.startTime === '' || this.endTime === '') {
					uni.showToast({
						title: '开始时间或者结束时间不能为空',
						icon: 'none'
					});
					return;
				} else {
					this.loaddata();
				}
				this.isshow = !this.isshow;
			}
			//=================
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.claim-list-bg {
		display: flex;
		flex: 1;
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	//添加按钮
	.add-container {
		position: fixed;
		display: flex;
		bottom: 32px;
		right: 16px;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		box-shadow: 0px 0px 10px #E60000;
		justify-content: center;
		align-items: center;
		background-color: $uni-color-primary;
	}

	.labelstyle {
		color: #ffffff;
		font-size: 30px;
		font-weight: bold;
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
		top: 0;
		left: 0px;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: center;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	//筛选父视图
	.filter-view-style {
		height: 35px;
		display: flex;
		background: #eeeeee;
		align-items: center;
		justify-content: center;
		// margin-right: 10px;
		border-radius: 5px;
	}

	//列表的subview
	.list-sub-view {
		display: flex;
		flex: 1;
		background: $uni-bg-color-grey;
		margin-top: 55px;
	}

	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	//列表cell
	.list-view-cell {
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 5px;
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

	.line-s {
		margin-top: 5px;
		margin-left: 10px;
		margin-right: 10px;
		height: 1px;
		background: #eeeeee;
	}

	.operate-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 10px;
		margin-top: 10px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
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
		top: 0;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 299;
		margin-top: 35px;
		background: #ffffff;
	}

	.condition-tag {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-lg;
		margin-left: 20px;
	}

	.condition-select {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 8px;
		padding-bottom: 8px;
		margin: 15px 20px 15px 20px;
		align-items: center;
	}

	.condition-btn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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

	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
	}

	//=================
</style>
