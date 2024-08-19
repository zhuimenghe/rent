<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="head-container" ref="headView">
			<headSearchView placeholder="搜索" ref="searchView" :focus="true" :isSlotLeft="true" @search="searchInput">
				<block slot="left">
					<view>
						<image class="back-view" src="/static/icon-back.png" @click="back"></image>
					</view>

				</block>
				<block slot="right">
					<view class="filtrate-view row-line">
						<view class="filtrate-search-btn" @click="searchInput">
							搜索
						</view>
					</view>

				</block>
			</headSearchView>
			<!-- 最近模块 -->
			<view class="cache-container" v-if="cacheLocation&&cacheLocation.length>0">
				<view class="row-line-between">
					<view class="model-title">
						最近访问
					</view>
					<view class="model-sub-title" @click="removeCache">
						清除搜索记录
					</view>
				</view>
				<view class="row-wrap">
					<view class="cache-txt" v-for="(item,index) in cacheLocation" :key="index"
						@click="searchHistory(item)">
						{{item}}
					</view>
				</view>
			</view>
			<view v-if="businessList.length>0">
				<sunTab :value.sync="index" :tabList="businessList" :scroll="false" activeColor="#E60000"
					@change="tabChange" rangeKey="name" />
			</view>

		</view>
		<view style="margin-bottom: 8px;" :style="{'margin-top':marginTop}">
			<view v-if="businessList.length>0">
				<allTab :allDataList="allDataList" v-if="!curItem||!curItem.id" @goMore="goMore" @goTo="goTo" />
				<modelTab :allDataList="dataList" v-if="curItem&&curItem.id" @goTo="goTo" :modelType="curItem.id"
					:moreStatus="moreStatus" :keyOne="keyOne" :keyTwo="keyTwo" />
			</view>
			<view style="width: 100%;margin-top: 20px;text-align: center;font-size: 12px;color: #999999;" v-else>
				暂无数据
			</view>

		</view>

	</view>
</template>

<script>
	import headSearchView from '../components/head-search/head-search-view.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import allTab from './search-all-tab.vue';
	import modelTab from './search-model-tab.vue'
	export default {
		components: {
			headSearchView,
			sunTab,
			allTab,
			modelTab
		},
		data() {
			return {
				searchValue: '',
				page: 1,
				size: 5,
				type: '',
				cacheLocation: [],
				index: 0,
				marginTop: '56px',
				dataList: [],
				allDataList:[],
				curItem: {},
				businessList: [],
				businessSecondList: [{
						id: 'vehicleArchives',
						name: '设备',
						parent: 'machine'
					},
					{
						id: 'contractManage',
						name: '合同',
						parent: 'contract'
					},
					{
						id: 'arrivalManage',
						name: '进场',
						parent: 'business'
					},
					{
						id: 'exitManage',
						name: '退场',
						parent: 'business'
					},
					{
						id: 'claimManage',
						name: '索赔',
						parent: 'business'
					},
					{
						id: 'reportManage',
						name: '报停',
						parent: 'business'
					},
					{
						id: 'proceedManage',
						name: '收款',
						parent: 'business'
					},
					{
						id: 'refundManage',
						name: '退款',
						parent: 'business'
					},
					{
						id: 'settlementManage',
						name: '结算',
						parent: 'business'
					},
					{
						id: 'vehicle-maintain',
						name: '保养',
						parent: 'service'
					},
					{
						id: 'check-repair',
						name: '检修',
						parent: 'service'
					},
					{
						id: 'inspection',
						name: '巡检',
						parent: 'service'
					},
					{
						id: 'vehicle-repair',
						name: '维修',
						parent: 'service'
					}
				],
				moreStatus: 'loading',
				keyTwo: '',
				keyOne: '',
				searchRequest:null


			}
		},
		onLoad() {
			uni.getStorage({
				key: 'location_key_'+this.$datestr.getUserId(),
				success: (res) => {
					this.cacheLocation = res.data
				}
			});
		},
		mounted() {
			this.setContentPosition()
		},
		onPullDownRefresh() {
			this.refreshData(false)
		},
		onReachBottom() {
			if (this.moreStatus == 'noMore' || !this.curItem || !this.curItem.id) {
				return;
			}
			this.page += 1;
			this.moreStatus = 'loading';
			this.searchData(false)
		},
		methods: {
			goMore(val) {
				this.curItem = {
					...val
				}
				this.index = val.id ? this.businessList.findIndex(o => o.id == val.id) : 0;
				this.size = this.curItem && this.curItem.id ? 10 : 5;
				this.refreshData(false)
			},
			goTo(val) {
				let processKey = val.processKey;
				let item = val.data
				switch (processKey) {
					case 'vehicleArchives': //设备
					    let licenseId = item.licenseId.replace(/<b style='color:red;'>/g,"").replace(new RegExp('</b>', 'g'),"")
						uni.navigateTo({
							url: '/pages/main/machine-scan-home?licenseId=' + licenseId
						});
						break;
					case 'contractManage': //合同
					    let contractNo = item.contractNo.replace(/<b style='color:red;'>/g,"").replace(new RegExp('</b>', 'g'),"")
						uni.navigateTo({
							url: '/contractPages/contract/contract-detail?businessNo=' + contractNo
						});
						break;
					case 'universal': //权限功能
						this.goFunction(item);
						break;
					default:
						break;
				}
			},
			//功能页面跳转
			goFunction(item) {
				if (item.componentType == 'url' && item.appComponent) {
					uni.navigateTo({
						url: item.appComponent
					});
				} else if (item.componentType == 'tab-business') {
					uni.setStorage({
						data: {
							id: item.appComponent
						},
						key: this.$savekey.MEMORY_STORAGE,
						success: () => {
							uni.switchTab({
								url: '/pages/main/business'
							});
						}
					});
				} else if (item.componentType == 'tab-device') {
					uni.switchTab({
						url: '/pages/main/map'
					});
				} else {
					uni.setStorage({
						data: {
							id: item.appComponent
						},
						key: this.$savekey.MEMORY_STORAGE,
						success: () => {
							uni.switchTab({
								url: '/pages/main/business'
							});
						}
					});
				}
			},
			setContentPosition() {
				setTimeout(()=>{
					uni.createSelectorQuery().in(this).select('.head-container').boundingClientRect(result => {
						if (result) {
							this.marginTop = (result.height + 10) + 'px';
						}
					}).exec()
				},200)
						
				
			},
			tabChange(e) {
				this.index = e.index;
				this.curItem = this.businessList[this.index];
				this.size = this.curItem && this.curItem.id ? 10 : 5;
				this.refreshData(false)
			},
			removeCache() {
				uni.removeStorageSync('location_key_'+this.$datestr.getUserId())
				this.cacheLocation = [];
				this.setContentPosition();
			},
			changeCache(item) {
				let list = uni.getStorageSync('location_key_'+this.$datestr.getUserId())
				this.cacheLocation = list ? [...list] : [];
				//去掉原来缓存中的数据
				let index = this.cacheLocation.findIndex(o => {
					return o == item
				})
				if (index != -1) {
					this.cacheLocation.splice(index, 1)
				}
				this.cacheLocation.unshift(item)
				this.cacheLocation = this.cacheLocation.length > 5 ? this.cacheLocation.slice(0, 5) : this.cacheLocation
				uni.setStorage({
					key: 'location_key_'+this.$datestr.getUserId(),
					data: this.cacheLocation
				});
			},
			searchInput() {
				this.curItem={};
				this.index =0;
				this.size = this.curItem && this.curItem.id ? 10 : 5;
				this.searchValue = this.$refs.searchView.getInputText();
				if (this.searchRequest) {
					this.searchRequest.abort()
				}
				this.refreshData(true);

			},
			searchHistory(val) {
				this.$refs.searchView.setDefaultValue(val);
				this.searchInput()
			},
			refreshData(isResetSearch) {
				this.page = 1;
				this.dataList = [];
				this.allDataList=[];
				this.searchData(isResetSearch);
			},
			/**
			 * @param {Object} isResetSearch  是否重新搜索
			 */
			searchData(isResetSearch) {
				uni.showLoading()
				if (this.searchValue.trim()) {
					this.changeCache(this.searchValue);
				}
				this.setContentPosition();
				let param = {
					"searchValue": this.searchValue,
					"getPermission": this.curItem || !this.curItem.id || (this.curItem.id == 'permission') ? true :
						false, //是否返回功能搜索
					"app": true, //app端
					"current": this.page,
					"size": this.size, //全部tab一页显示5个，单页显示10个
					"keyOne": this.curItem && this.curItem.id ? this.curItem.id : undefined
				};
				let header = this.$datestr.getRequestHeader();
				let url = this.$url.BASE_URL + this.$url.SEARCH_ALL_LIST
				this.searchRequest = uni.request({
					url: url,
					data: param,
					method: 'POST',
					header: { ...header
					},
					success: (res) => {
						console.log(res)
						let result= res.data.result;
						if(res.data.code==200&&result){
							if (isResetSearch) {
								this.businessList = result && result.length > 0 ? result.map(o => {
									return {
										name: o.name,
										id: o.key
									}
								}) : [];
								if (this.businessList.length > 0) {
									this.businessList.unshift({
										id: '',
										name: '全部'
									})
								}
							}
							
							if (this.curItem && this.curItem.id) { //搜索具体的业务模块
								let list = []
								if (result && result.length > 0 &&
									result[0].keyTwoReturnInfos && result[0].keyTwoReturnInfos.length > 0 &&
									result[0].keyTwoReturnInfos[0].hits && result[0].keyTwoReturnInfos[0].hits.length > 0
								) {
									list = [...result[0].keyTwoReturnInfos[0].hits];
									this.keyTwo = result[0].keyTwoReturnInfos[0].keyTwo;
									this.keyOne = result[0].key;
								}
								this.dataList = this.dataList.concat(list)
								if ((this.page * this.size) >= result[0].keyTwoReturnInfos[0].count) {
									this.moreStatus = 'noMore';
								} else {
									this.moreStatus = 'more';
								}
							} else { //全部
								this.allDataList = this.allDataList.concat(result ? result : [])
							}
						}else{
							this.businessList = []
							this.page = 1;
							this.dataList = []
							this.allDataList = []
						}
					},
					fail:()=>{
						this.businessList = []
						this.page = 1;
						this.dataList = []
						this.allDataList = []
						
					},
					complete:()=> {
						uni.stopPullDownRefresh()
						uni.hideLoading()
					}
				})
				// this.$network
				// 	.getData(this.$url.SEARCH_ALL_LIST, 'POST', param)
				// 	.then(result => {
						
				// 	})
				// 	.catch(err => {
						
				// 	});
			},
			back() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		padding-bottom:env(safe-area-inset-bottom);
		width: 100%;
		position: relative;
		background-color: $uni-bg-color-grey;
	}

	.head-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
	}

	.back-view {
		padding: 0px 8px;
		width: 24px;
		height: 24px;
		color: #333333;

	}

	.row-line {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.filtrate-view {
		// margin-right: 8px;
	}

	.filtrate-search-btn {
		color: #FFFFFF;
		font-size: 14px;
		padding: 4px 10px;
		margin-right: 8px;
		background-color: #E60000;
		border-radius: 16px;
	}

	.filtrate-btn {
		color: #999999;
		font-size: 14px;
		padding: 4px 10px;
		margin-right: 8px;
		border: 1px solid #999999;
		border-radius: 16px;
	}

	.cache-container {
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
	}

	.model-title {
		font-size: 14px;
		color: #333333;
		font-weight: 800;
	}

	.model-sub-title {
		font-size: 13px;
		color: #E60000;
	}

	.row-wrap {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.cache-txt {
		font-size: 12px;
		padding: 0px 8px;
		border: 1px solid #999999;
		color: #999999;
		border-radius: 4px;
		line-height: 20px;
		max-width: 25%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		background-color: #FFFFFF;
		margin: 6px;

	}
</style>
