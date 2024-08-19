<template>
	<view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="goTo('create', null)" v-if="isShowAdd">
			<i class="iconfont labelstyle iconadd"></i></view>
		<view class="top-view">
			<unionDeviceQueryView
			:isExportList='!isPicker' 
			:isQueryContract="false"
			:isQuerySalesman='false'
			:isQueryTonnage="false"
			:isQueryOrg='false'
			:isQueryBrand='false'
			:isQueryModel='false'
			:isQueryTime='true'
			:isQuerySortField="false"
			:isQueryAsc="false"
			hint='品牌/型号'
			@reset='reset' 
			@query="query" 
			@exportExcel="exportExcel" />
			
			<!-- <view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input placeholder="品牌/型号" @input="searchChange" style="flex: 1;font-size: 14px;" />
					</view>
				</view>
				<view class="filter-view-style" @click="exportExcel" v-if="isExportList">
					<text>导出</text>
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
			</view> -->
		</view>
		<view class="list-sub-view">
			<view class="list-view">
				<view class="list-view-cell" v-for="(item, index) in datalist" :key="index" @click="cardClick(item)">
					<view class="cell-text">
						<view class="cell-text-left" style="font-weight: bold;color: #E60000;" @click="goTo('detail', item)"><text>{{ item.businessNo || "--"}}</text></view>
						<view class="cell-text-right" style="color: #E60000;" v-if="!isPicker">
							<text>{{ item.stateName || "--"}}</text>
						</view>
					</view>
					
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>采购日期</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.purchaseDate || "--"}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>采购设备</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text class="max-three-line">{{ item.machineStr}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>品牌</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text class="max-three-line">{{ item.brandStr}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>采购金额</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{moneyUtil.dealNumber(item.total)}}元</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>采购形式</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{item.purchaseTypeName||'--'}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>申请人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.userName || "--"}}</text>
						</view>
					</view>

					<view class="operate-container" v-if="!isPicker">
						<taskBtn :itemData="item" />
						<view class="contract-more-btn" @click="updateOrder(item)" v-if="createBy===item.createBy && item.state==='0'">修改</view>
						<view class="contract-more-btn" @click="goTo('detail', item)">详情</view>
					</view>
				</view>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</view>
		</view>
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date"
		 themeColor="#E60000" />

	</view>
</template>

<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import unionDeviceQueryView from '@/components/common/common-ui/union-device-query-view.vue';
	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker,
			taskBtn,
			unionDeviceQueryView
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
				purchaseTypes: [],
				isShowAdd: true,
				deleteItem: true,
				createBy: '',
				isPicker: true,
				totalCount: '100',
				type:'',
				height:'',
				deviceType:''//设备类别
			};
		},
		onLoad(options) {
			this.isPicker = !!options.isPicker
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_PURCHASE_ADD)
					this.deleteItem = res.data.some(x => x.value === this.$savekey.PERMISSION_PURCHASE_DELETE)
				}
			})
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.createBy = res.data.id;
				}
			});
			uni.$on('refresh-list', obj => {
				this.headerrefresh();
			})
			uni.$on('refresh-notification-list', obj => {
				this.headerrefresh();
			})
			this.loaddata();
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备采购","列表");
			
		},
		onPullDownRefresh() {
			this.headerrefresh()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			cardClick(item){
				if(this.isPicker){
					let pages = getCurrentPages()
  				let currentPage = pages[pages.length-2]
					currentPage.$vm.setPurchaseNo(item.businessNo)
					uni.navigateBack()
				}else{
					this.goTo('detail',item)
				}
			},
			reset() {
				this.startTime = '';
				this.endTime = '';
				this.type=''
				this.height=''
				this.deviceType=''
				this.searchKey=''
				this.headerrefresh();
			},
			query(val) {
				this.searchKey = val.fuzzyParam;
				this.deviceType = val.sortObj && val.sortObj.value ? val.sortObj.value : '';
				this.type = val.typeObj && val.typeObj.value ? val.typeObj.value : '';
				this.height = val.heightObj && val.heightObj.value ? val.heightObj.value : '';
				this.startTime = val.startDate;
				this.endTime = val.endDate;
				this.headerrefresh();
			},
			
			goTo(type, item) {
				switch (type) {
					case 'create':
						uni.navigateTo({
							url: './create-purchase'
						})
						break;
					case 'detail':
						uni.navigateTo({
							url: './purchase-detail?businessNo=' + item.businessNo
						})
						break;
					default:
						break;
				}
			},
			getDate(time) {
				if (!time)
					return "--"
				return time.split(/\s+/)[0];
			},
			getNum(list) {
				if (list) {
					return list.reduce((x, y) => {
						return x + (y.purchaseNumber ? Number(y.purchaseNumber) : 0)
					}, 0)
				}
				return 0
			},
			getAllBrand(item){
				let machines = item.recordList ? item.recordList : [];
				if (!machines || machines.length <= 0) return '-';
				let arr = [];
				machines.forEach(o => {
					if (!arr.some(x=>x==o.brand)) {
						arr = [...arr, o.brand];
					}
				});
				let result = arr.join(',');
				return result;
			},
			getMachinesNum(item) {
				let machines = item.recordList ? item.recordList : [];
				if (!machines || machines.length <= 0) return '-';
				let arr = [];
				let map = {};
				machines = machines.map(o => {
					return {
						type: o.type,
						purchaseNumber: o.purchaseNumber,
						height:o.height,
						heightName: o.heightName?o.heightName:'-',
						typeName: o.typeName?o.typeName:'-'
					};
				});
				machines.forEach(o => {
					if (map[o.type + '-' + o.height]) {
						arr.forEach(y => {
							if (y.type == o.type && y.height == o.height) {
								y.purchaseNumber += o.purchaseNumber;
								return;
							}
						});
					} else {
						arr = [...arr, o];
						map[o.type + '-' + o.height] = o;
					}
				});
				let needDevice = arr
					.map(o => {
						return o.typeName + '|' + o.heightName + ':' + (o.purchaseNumber ? o.purchaseNumber+'台' : '-');
					})
					.join('\n');
				return needDevice;
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
				this.loaddata();
			},
			loaddata() {
				uni.showLoading();
				let param = {
					current: this.currentpage,
					size: 5,
					fuzzyParam: this.searchKey,
					deviceType: this.deviceType?this.deviceType:undefined,
					type: this.type?this.type:undefined,
					height: this.height?this.height:undefined,
					startDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined,
					
				};
				this.$network
					.getData(this.$url.PURCHASE_LIST, 'POST', param)
					.then(result => {
						let list =result&&result.records?result.records.map(o=>{
							let machineStr = this.getMachinesNum(o)
							let brandStr = this.getAllBrand(o)
							return{
								...o,
								machineStr:machineStr,
								brandStr:brandStr
							}
						}):[]
						this.datalist = this.datalist.concat(list);
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total.toString()
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			updateOrder(item) {
				uni.navigateTo({
					url: './create-purchase?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			deleteOrder(item) {
				let _self = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除' + item.businessNo + '记录',
					success: function(res) {
						if (res.confirm) {
							_self.deletePurchse(item)
						} else if (res.cancel) {}
					}
				});
			},
			deletePurchse(item) {
				uni.showLoading({
					mask: true
				})
				let url = this.$url.PURCHASE_LIST.replace(/{businessNo}/, item.businessNo)
				this.$network
					.getData(url, 'DELETE', null)
					.then(result => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '删除成功'
						})
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details ? err.details[0] : err.message
						})
					});
			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
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
			exportExcel(item) {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				// let param = {
				// 	businessNo: this.searchKey,
				// 	beginDate:this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				// 	endDate:this.endTime != '' ? this.endTime + ' 23:59:59' :undefined
				// };
				// let url= this.$url.PURCHASE_LIST + '?isExport=true&current=1&size='+ this.totalCount
				// let downurl = this.$gxfmethod.forEachObj(url,param)
				// console.log(downurl)
				let param = {
					current: 1,
					size: this.totalCount,
					fuzzyParam: this.searchKey,
					deviceType: this.deviceType?this.deviceType:undefined,
					type: this.type?this.type:undefined,
					height: this.height?this.height:undefined,
					startDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
				};
				let url = this.$gxfmethod.getUrl(this.$url.PURCHASE_LIST)
				let filename = this.$gxfmethod.getFileName("采购记录列表-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
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
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	//筛选父视图
	.filter-view-style {
		height: 35px;
		width: 60px;
		display: flex;
		background: $uni-color-primary;
		font-size: $uni-font-size-base;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		z-index: 955;
		color: #FFFFFF;
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
		background: #ffffff;
	}

	.cell-text {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		margin-top: 5px;
	}

	.cell-text-left {
		display: flex;
		flex: 1;
		margin-left: 10px;
		min-width: 64px;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.cell-text-right {
		display: flex;
		margin-right: 10px;
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
		padding: 10px;
		margin-top: 5px;
		justify-content: flex-end;
		align-items: center;
		border-top: $uni-line-color 1px solid;
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

	.contract-more-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		// padding: 4px 10px;
		// border-radius: 50px;
		// border: 1px solid $uni-color-primary;
	}

	//=================
</style>
