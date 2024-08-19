<template>
	<view class="content">
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			选择合同/客户
			<template v-slot:fixed>
				<view class="top-container" v-if="!singleCard">
					<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange" />
				</view>
				<view class="search-container" v-if="isShowSelect">
					<view class="search-top">
						<view class="select-view">
							<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
						</view>
						<view class="search-box">
							<i class="iconfont search-icon iconzl--sousuo"></i>
							<view class="search-content">
								<input placeholder="客户名称" v-model="customerName" placeholder-class="placeholder-style" style="font-size: 14px;" />
							</view>
						</view>
						<view class="search-box" v-if="singleCard=='contract'||(!singleCard&&index==0)">
							<i class="iconfont search-icon iconzl--sousuo"></i>
							<view class="search-content">
								<input placeholder="项目名称" v-model="projectName" placeholder-class="placeholder-style" style="font-size: 14px;" />
							</view>
						</view>
					</view>
					<view class="search-top">
						<view class="btn-reset" @click="reset">重置</view>
						<view class="btn-confirm" @click="submit">确定</view>
					</view>
				</view>
			</template>
		</c-nav-bar-btns>
		<view class="list-container" :style="{'margin-top':singleCard?'8px':'45px'}">
			<view v-if="singleCard=='contract'||(!singleCard&&index==0)">
				<tabSettleContract ref="contractList"  :isFirst='isFirst' />
			</view>
			<view v-if="singleCard=='customer'||(!singleCard&&index==1)">
				<tabSettleCustomer ref="customerList"  :isFirst='isFirst' />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import tabSettleContract from './tab-settle-contract.vue';
	import tabSettleCustomer from './tab-settle-customer.vue';
	export default {
		components: {
			selectView,
			wPicker,
			sunTab,
			tabSettleContract,
			tabSettleCustomer
		},
		data() {
			return {
				"navBtns": [
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
				customerName: '',
				projectName: '',
				//业务负责人
				salesmanList: [],
				salesmanObj: {},
				pickType: '',
				index: 0,
				tabList: ['合同', '客户'],
				isFirst: true,
				singleCard: ''

			};
		},
		onLoad(options) {
			this.isFirst = options.isFirst == 'true' ? true : false
			this.singleCard = options.singleCard ? options.singleCard : ''
			if (this.singleCard == 'contract') {
				uni.setNavigationBarTitle({
					title: '选择合同'
				})
			} else if (this.singleCard == 'customer') {
				uni.setNavigationBarTitle({
					title: '选择客户'
				})
			} else {
				uni.setNavigationBarTitle({
					title: '选择合同/客户'
				})
			}
			this.loadOwnerList();
			this.headerrefreshInfo()
		},
		onPullDownRefresh() {
			this.headerrefreshInfo()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			onNavBarButtonTap() {
				this.isShowSelect = !this.isShowSelect;
			},
			reset() {
				this.salesmanObj = {};
				this.customerName = "";
				this.projectName="";
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
				switch (this.singleCard) {
					case 'contract':
						setTimeout(() => {
							this.$refs.contractList.headerrefresh(
								this.salesmanObj.label ? this.salesmanObj.label : '',
								this.customerName,
								this.projectName);
						}, 100);
						break;
					case 'customer':
						setTimeout(() => {
							this.$refs.customerList.headerrefresh(
								this.salesmanObj.label ? this.salesmanObj.label : '',
								this.customerName);
						}, 100);
						break;
					default:
						switch (this.index) {
							case 0:
								setTimeout(() => {
									this.$refs.contractList.headerrefresh(
										this.salesmanObj.label ? this.salesmanObj.label : '',
										this.customerName,
										this.projectName);
								}, 100);
								break;
							case 1:
								setTimeout(() => {
									this.$refs.customerList.headerrefresh(
										this.salesmanObj.label ? this.salesmanObj.label : '',
										this.customerName );
								}, 100);
								break;
							default:
								break;
						}
						break;
				}

			},
			footerrefresh() {
				switch (this.singleCard) {
					case 'contract':
						this.$refs.contractList.footerrefresh(
							this.salesmanObj.label ? this.salesmanObj.label : '',
							this.customerName,
							this.projectName);
						break;
					case 'customer':
						this.$refs.customerList.footerrefresh(
							this.salesmanObj.label ? this.salesmanObj.label : '',
							this.customerName );
						break;
					default:
						switch (this.index) {
							case 0:
								this.$refs.contractList.footerrefresh(
									this.salesmanObj.label ? this.salesmanObj.label : '',
									this.customerName,
									this.projectName);
								break;
							case 1:
								this.$refs.customerList.footerrefresh(
									this.salesmanObj.label ? this.salesmanObj.label : '',
									this.customerName);
								break;
							default:
								break;
						}
						break;
				}

			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
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




		},

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
		// position: fixed;
		top: 45px;
		left: 0px;
		z-index: 950;
	}

	.top-container {
		// position: fixed;
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

	.export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
		margin-left: 5px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
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
