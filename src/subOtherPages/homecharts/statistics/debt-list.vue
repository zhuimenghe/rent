<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">应收统计</c-nav-bar-btns>
		<view class="search-container" v-if="isShowSelect">
			<view class="search-top">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input placeholder="项目/客户名称" v-model="fuzzyParam" placeholder-class="placeholder-style" style="font-size: 14px;" />
					</view>
				</view>
			</view>
			<view class="search-top">
				<view class="select-view">
					<selectView :value="rangeObj.label" hint="应收范围" @clickSelect="showPick('range')" />
				</view>
				<view class="select-view">
					<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
				</view>
				<view class="btn-export" v-if="isExportList" @click="exportData">导出</view>

			</view>
			<view class="search-top">
				<view class="btn-reset" @click="reset">重置</view>
				<view class="btn-confirm" @click="submit">确定</view>
			</view>
		</view>
		<view class="top-container">
			<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange" />
		</view>
		<view class="list-container">
			<view class="list-item" v-for="(item, i) in list" :key="i">
				<view class="float-l-r">
					<view class="item-tag">客户名称</view>
					<view class="item-value">{{ item.customerName || '' }}</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">项目名称</view>
					<view class="item-value">{{ item.projectName || '' }}</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">业务负责人</view>
					<view class="item-value">{{ item.customerSalesmanName || '-' }}</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">营收
					<businessTips :tipName="index==0?'performRevenue':'accountRevenue'"/></view>
					<view class="item-value">{{ item.receivable}}</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">实收
					<businessTips tipName='receivedRevenue'/></view>
					<view class="item-value">{{ item.receipt}}</view>
				</view>
				<view class="float-l-r">
					<view class="item-tag">应收
					<businessTips tipName="accountDebt"/></view>
					<view class="item-value">{{ item.debt }}</view>
				</view>

			</view>
			<view>
				<uni-load-more iconType="auto" :status="status" />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			selectView,
			wPicker,
			sunTab,
			uniLoadMore
		},
		data() {
			return {
				"buttons": [
						{
								"text": "筛选",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				//是否显示筛选
				isShowSelect: false,
				selectList: [],
				//客户名称
				fuzzyParam: '',
				//业务负责人
				salesmanList: [],
				salesmanObj: {},

				//应收范围
				rangeObj: {
					label: '1个月内',
					value: '1'
				},
				rangeList: [{
						label: '1个月内',
						value: '1'
					},
					{
						label: '1~3个月内',
						value: '2'
					},
					{
						label: '3个月以上',
						value: '3'
					}
				],

				isExportList: true, //列表导出
				downloadTask: null,
				pickType: '',
				index: 1,
				tabList: ['履约应收', '账期应收'],
				accountType: '2',
				list: [],
				status: 'more',
				pageList: [],

			};
		},
		onLoad(options) {
			let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
			if (resData) {
				let obj = resData.find(o => o.code === 'account_type') //营收类型
				if (obj) {
					this.accountType = obj.value
				}
			}
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_STATISTICS_DEBT_EXPORT);
				}
			});
			this.rangeObj = options.range ? JSON.parse(decodeURIComponent(options.range)) : {
				label: '1个月内',
				value: '1'
			}

			this.loadOwnerList();
			this.headerrefreshInfo();
		},
		onPullDownRefresh() {
			this.headerrefreshInfo()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			onNavigationBarButtonTap() {
				this.isShowSelect = !this.isShowSelect;
			},
			reset() {
				this.salesmanObj = {};
				this.fuzzyParam = "";
				this.rangeObj = {
					label: '1个月内',
					value: '1'
				}
				this.isShowSelect = false;
				this.headerrefreshInfo()
			},
			submit() {
				this.isShowSelect = false;
				this.headerrefreshInfo()
			},
			indexchange(e) {
				setTimeout(() => {
					this.index = e.index
					this.headerrefreshInfo()
				}, 100)
			},
			headerrefreshInfo() {
				this.list = [];
				this.page = 1;
				this.loadData();
			},
			footerrefresh() {
				if (this.status == 'noMore') {
					return;
				}
				this.list = [...this.pageList];
				setTimeout(() => {
					this.status = 'noMore';
				}, 1000);
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'range':
						this.selectList = this.rangeList ? this.rangeList : [];
						this.$refs.selector.show();
						break;
					case 'salesman':
						this.selectList = this.salesmanList ? this.salesmanList : [];
						this.$refs.selector.show();
						break;

					default:
						break;
				}

			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'range':
						this.rangeObj = val.checkArr;
						break;
					case 'salesman':
						this.salesmanObj = val.checkArr;
						break;
					default:
						break;
				}
			},
			//加载负责人
			loadOwnerList() {
				let param = {
					showAdmin: false,
					roleType: this.$savekey.USER_ROLE_BUSINESS
				};
				uni.showLoading();
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.salesmanList = result ? result.map(dict => {
							return {
								label: dict.username,
								value: dict.id
							};
						}) : []
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			loadData() {
				let param = {
					receivableType: this.index == 0 ? '1' : this.accountType, //营收类型 1：履约 2：账期 3：到期
					fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
					debtRange: this.rangeObj && this.rangeObj.value ? this.rangeObj.value : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined
				}

				this.$network
					.getData(this.$url.STATISTICS_DEBT_LIST, 'POST', param)
					.then(result => {
						let tempaList = result && result.length > 0 ? result.map(obj => {
							return {
								...obj,
								receivable: obj.receivable ? '￥' + this.moneyUtil.dealNumber(obj.receivable) : '-',
								//实收
								receipt: obj.receipt ? '￥' + this.moneyUtil.dealNumber(obj.receipt) : '-',
								debt: obj.debt ? '￥' + this.moneyUtil.dealNumber(obj.debt) : '-'
							}
						}) : [];
						if (this.page == 1) {
							// this.list = tempaList;
							this.pageList = tempaList;
							if (this.pageList.length > 10) {
								this.list = this.pageList.slice(0, 10);
								this.status = 'more';
							} else {
								this.list = this.pageList
								this.status = 'noMore';
							}
						} else {
							this.list = this.list.concat(tempaList);
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			//---------------------下载---------------------------------------------
			exportData() {
				let headerDic = {
					'Content-Type': 'application/json',
					Authorization: ''
				};
				let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
				if (loginMes) {
					let access_token = loginMes.token_type + ' ' + loginMes.access_token;
					headerDic.Authorization = access_token;
					this.downxlsc(headerDic);
				}
			},
			downxlsc(headerDic) {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true
				});
				let param = []
				if (this.fuzzyParam) {
					param.push('fuzzyParam=' + encodeURIComponent(this.fuzzyParam))
				}
				if (this.salesmanObj && this.salesmanObj.value) {
					param.push('customerSalesman=' + this.salesmanObj.value)
				}
				if (this.rangeObj && this.rangeObj.value) {
					param.push('debtRange=' + this.rangeObj.value)
				}
				if (this.index == 0) {
					param.push('receivableType=1')
				} else if (this.index == 1) {
					param.push('receivableType=' + this.accountType)
				}

				let url = this.$url.BASE_URL + this.$url.STATISTICS_DEBT_LIST_EXPORT + '?' + param.join("&");
				this.$datestr.downFunc(url)
			},

		}

	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
		z-index: 100;
		position: fixed;
		top: 45px;
		left: 0px;
		z-index: 950;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 1000;
	}

	.search-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
		padding-bottom: 4px;
		width: 100%;
		z-index: 100;
	}

	.select-view {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 8px 0px 8px;
		flex-direction: row;
		padding-left: 8px;
		border-radius: 4px;
		justify-content: flex-start;
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
		flex: 1;
	}

	.btn-export {
		padding: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-right: 8px;
		align-items: center;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
	}

	.btn-confirm {
		padding: 6px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		border-radius: 4px;
		margin: 0px 4px;
		flex: 1;
	}

	.btn-reset {
		padding: 6px;
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.list-container {
		margin-top: 45px;
	}

	.list-item {
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
		padding: 8px;
		margin: 0px 8px 4px 8px;
		border-radius: 4px;
		margin-bottom: 4px;
		font-size: $uni-font-size-base;
	}

	.float-l-r {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.item-tag {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: $uni-text-color-gray;
		margin: 4px 0px;
		width: 72px;
		min-width: 72px;
		font-size: $uni-font-size-base;
	}

	.item-value {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: right;
	}
</style>
