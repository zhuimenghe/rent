<template>
	<view class="content">
		<view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder-style="font-size:14px" placeholder="请输入客户名称或项目名称"
						@input="searchChange" /></view>
			</view>
		</view>
		<view class="list-container">
			<businessItemFrame v-for="(contract, i) in contractList" :key="i"
				:stateName="contract.stateName||''" :showAttachment="false" :showContent="false">
				<block slot="title">
					<view class="row-line" style="align-items: flex-start;">
						<view style="height: 18px;min-width: 16px;margin-right: 6px;line-height: 18px;"
							v-if="contract.contractType!= '1'">
							<text class="title-tag-text"
								:style="{'background-color':contract.contractType== '3'?'#E60000':'#b7d1ff'}">
								{{contract.contractType== '2'?'框':(contract.contractType== '3'?'快':'普')}}
							</text>
						</view>

						<view>
							{{ contract.customerName || '' }}-{{ contract.contractDetailDto ? contract.contractDetailDto.projectName : '' }}

						</view>
					</view>
				</block>
				<block slot="subContent">
					<view class="max-one-line">
						{{contract.customerSalesmanName|| "-"}}&nbsp;|&nbsp;{{contract.orgName|| "-"}}&nbsp;|&nbsp;{{getDeviceNumStr(contract)}}
					</view>
				</block>
				<block slot="options">
					<view class="row-line">
						<view class="option-btn" @click.stop="goTo('detail', contract)"
							v-if="contract.state != '0' && contract.state != '3'">合同详情</view>
						<view class="option-btn" @click.stop="editcontract(contract)"
							v-if="contract.state === '0' || contract.state === '3'">修改</view>
					</view>
				</block>
			</businessItemFrame>

		</view>
		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	var _self;
	export default {
		components: {
			uniLoadMore,
			uniPopup,
			businessItemFrame
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				status: 'more',
				searchKey: '',
				contractList: [],
				curPopContract: null
			};
		},
		mounted() {

		},
		onLoad() {
			_self = this;
			this.getContractData();
			uni.$on('refreshList', obj => {
				this.getRefeshData();
			});
		},
		onUnload() {
			uni.$off('refreshList')
		},
		methods: {
			editcontract(item) {
				if (item.contractType == '1') {
					uni.navigateTo({
						url: './create-contract?isUpdate=1&contractNo=' + item.businessNo
					});
				} else if (item.contractType == '2') {
					uni.navigateTo({
						url: '/contractPages/contract-kit/create-contract-kit?isUpdate=1&contractNo=' + item.businessNo
					});

				} else if (item.contractType == '3') {
					uni.navigateTo({
						url: './create-contract-simple?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
					});

				}

			},
			goTo(type, item) {
				switch (type) {
					case 'detail':
						uni.navigateTo({
							url: '/contractPages/contract/contract-detail?businessNo=' + item.businessNo
						});
						break;
					default:
						break;
				}
			},
			searchChange(val) {
				setTimeout(() => {
					this.$datestr.printlog('searchChange=' + JSON.stringify(val));
					this.searchKey = val.detail.value;
					_self.page = 1;
					_self.contractList = [];
					this.getContractData();
				}, 500)

			},
			getDeviceNumStr(contract) {
				let orderList = contract.contractDetailDto.orderList;
				if (!orderList)
					return '';
				let arr = [];
				let map = {};
				orderList = orderList.map(o => {
					return {
						type: o.type,
						orderNum: o.orderNum,
						typeShortName: o.typeShortName
					}
				})
				orderList.forEach(o => {
					if (map[o.type]) {
						arr.forEach(y => {
							if (y.type === o.type) {
								y.orderNum += o.orderNum
								return;
							}
						})

					} else {
						arr = [...arr, o]
						map[o.type] = o;
					}
				})
				let needDevice = arr
					.map(o => {
						return o.typeShortName + (o.orderNum ? o.orderNum : '-');
					})
					.join(' / ');
				return needDevice;
			},

			getContractData() {
				this.status = 'loading';
				let param = {
					current: this.page,
					size: this.pageSize,
					fuzzyParam: this.searchKey,
					draft: true
				};
				this.$network
					.getData(this.$url.CONTRACT_LIST + '?timestamp=' + new Date().getTime(), 'POST', param)
					.then(result => {
						this.contractList = this.contractList.concat(result.records);

						let pages = result.pages;
						if (pages <= this.page) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						this.status = 'noMore';
						uni.stopPullDownRefresh();
					});
			},
			getRefeshData() {
				_self.page = 1;
				_self.contractList = [];
				_self.getContractData();
			},
		},
		onPullDownRefresh() {
			this.getRefeshData();
		},
		onReachBottom() {
			this.$datestr.printlog('onReachBottom==' + this.status);
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.getContractData();
		}
	};
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
		margin: 8px 8px;
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

	.list-container {
		margin-top: 60px;
	}
	.title-tag-text {
		color: #ffffff;
		box-sizing: border-box;
		font-size: 12px;
		padding: 2px;
		text-align: center;
		background-color: #E60000;
		border-radius: 4px;
		font-weight: 400;
	}
</style>
