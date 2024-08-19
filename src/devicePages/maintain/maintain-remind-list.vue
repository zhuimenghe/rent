<template>
	<view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">保养提醒</c-nav-bar-btns>
		<!-- 筛选view -->
		<view class="add-container" @click="goTo('search', null)"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="请输入车号或自喷码" @input="searchChange" /></view>
			</view>
		</view>
		<list class="list-med" show-scrollbar="false">
			<cell v-for="(item,index) in datalist" :key="index">
				<view class="cell-bg-view" @click="goTo('create',item)">
					<view class="cell-top-view">
						<i class="iconfont cell-top-image" :class="cartype[item.machineTypeId] || typedefault" :style="{ color: item.state == '1' ? '#4EC365' : '#F7AB2F' }">
							
						</i>
						<view class="cell-top-medView">
							<view class="cell-top-medView-top">
								<view class="cell-top-medView-left">
									<text>{{item.licenseId || "--"}}</text>
								</view>
								<view class="cell-top-medView-right">
									<text>{{item.printCode || "-"}}</text>
								</view>
							</view>
							<view class="cell-top-medView-bottom">
								<text>
									{{item.machineTypeName || "--"}}&nbsp;|&nbsp;{{item.machineBrand || "--"}}&nbsp;{{item.deviceNum || "--"}}&nbsp;|&nbsp;{{item.gpsInstallType || "--"}}
								</text>
							</view>
						</view>
					</view>
					<view class="item-middle">
						<view class="remind-left">
							<view>保养提醒：{{getLevelString(item.level)}}</view>
							<view class="last-time">上次保养：{{item.operateDate||"--"}}</view>
						</view>
						<i class="iconfont arrow-icon iconarrow-right"></i>

					</view>
					<view class="update-time">更新时间：{{item.updateTime||"--"}}</view>

				</view>
			</cell>
			<cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</cell>
		</list>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import numToChinese from '@/common/util/num-to-chinese.js';
	export default {
		components: {
			uniLoadMore,
			filterView
		},
		data() {
			return {
				navBtns: [
						{
								"text": "记录",
								"type": "none",
								"fontSize": "14px"
						}
				],
				//设备类型
				cartype: {
					'3': 'iconzl--zhibiche1',
				    '4': 'iconzl--jianchache2',
				    '2': 'iconzl--qubiche',
				    '1': 'iconzl--jianchache2'

				},
				typedefault: 'iconzl--zhibiche1',
				datalist: [{
					"id": "8",
					"createBy": "北谷电子",
					"createName": null,
					"createTime": "2019-12-16 10:36:56",
					"updateBy": null,
					"updateName": null,
					"updateTime": null,
					"delFlag": 0,
					"serialNumber": "BY000000123",
					"licenseId": "LWJAS100PH0700087",
					"rulesId": "1205767970257842177",
					"levelId": "1205776521856495617",
					"comment": "正常",
					"operateDate": null,
					"printCode": "print_test",
					"machineType": "11200001157",
					"machineTypeName": "R6",
					"rulesName": null,
					"level": 3,
					"contentIds": null,
					"contentNames": null
				}],
				//上拉下拉
				morestatus: "more",
				page: 1,
				searchKey: ""
			}
		},
		onLoad() {
			this.getNetData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		},
		//上拉加载
		onReachBottom() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.getNetData();
			this.morestatus = 'loading';
		},
		methods: {
			onNavBarButtonTap(e) {
				// this.$datestr.printlog(e);
				uni.navigateTo({
					url: "./device-record-detail"
				})
			},
			filtrateMenu() {
				// uni.navigateTo({
				// 	url:'./monitor-filtrate'
				// })
			},
			//跳入详情页
			goTo(type, item) {
				switch (type) {
					case 'create':
						uni.navigateTo({
							url: './create-maintain?listItem=' + encodeURIComponent(JSON.stringify(item))+"&isRemind=true"
						})
						break;
					case 'search':
						uni.navigateTo({
							url: './search-maintain-machine'
						})
						break;

					default:
						break;
				}

			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				this.page = 1;
				this.datalist = [];
				this.getNetData();
			},
			//获取网络数据
			getNetData() {
				uni.showLoading();
				let parame = {
					"current": this.page,
					"size": 10,
					"keyWord": this.searchKey
				};
				this.$network.getData(this.$url.MAINTAIN_LIST, "POST", parame).then((result) => {
					this.datalist = this.datalist.concat(result.records);
					this.$datestr.printlog(this.datalist.length);
					let pages = result.pages;
					let total = result.total;

					if (pages == this.page) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				}).catch((err) => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
			},
			getLevelString(level) {
				if (level === 0) {
					return '首保'
				}
				return numToChinese.getChineseOfNum(level) ? numToChinese.getChineseOfNum(level) + "级保养" : '--'
			}

		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: './maintain-record-list'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.contentbg {
		position: relative;
		height: 100%;
		width: 100%;
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
		z-index: 999;
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
		top: 0px;
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
		margin-right: 10px;
		border-radius: 5px;
	}

	.list-med {
		position: absolute;
		width: 100%;
		top: 55px;
		background: $uni-bg-color-grey;
	}

	.cell-bg-view {
		position: relative;
		display: flex;
		flex-direction: column;
		background: #FFFFFF;
		margin: 5px 15px 5px 15px;
		border-radius: 5px;
	}

	.cell-top-view {
		display: flex;
		flex: 1;
		flex-direction: row;
		margin: 10px;
		height: 50px;
		align-items: center;
		justify-content: flex-start;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
	}

	.cell-top-image {
		width: 50px;
		font-size: 40px;
	}

	.cell-top-medView {
		display: flex;
		flex: 1;
		flex-direction: column;
		margin-left: 10px;
		justify-content: flex-start;
	}

	.cell-top-medView-top {
		display: flex;
		flex: 1;
		flex-direction: row;
	}

	.cell-top-medView-bottom {
		display: flex;
		flex: 1;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;

	}

	.cell-top-medView-left {
		flex: 1;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.cell-top-medView-right {
		margin-right: 0px;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
	}

	.item-middle {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0px 10px 4px 10px;
		padding-bottom: 8px;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
	}

	.last-time {
		color: $uni-text-color-disable;
		font-size: $uni-font-size-sm;
	}

	.arrow-icon {
		font-size: 30px;
		color: $uni-text-color-gray;
	}

	.item-bottom {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 0px 10px 4px 10px;
	}

	.update-time {
		color: $uni-text-color-disable;
		font-size: $uni-font-size-sm;
		margin: 0px 10px 4px 10px;
	}
</style>
