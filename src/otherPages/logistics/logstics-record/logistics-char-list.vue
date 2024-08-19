<template>
	<view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<flexibleQueryView :isExportList='isExportList' hint='业务单号/物流单号/项目名称' :isQuerySalesman="false" :isQueryOrg='false'
			 :isCustomQuery="false" :isQueryTime="true" :customList='businessTypeList' customHint='运输类型' @reset='reset' @query="query"
			 @exportExcel="exportExcel" />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left">{{ item.businessNo || '--' }}</view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerSalesmanName || '--' }}</text>
						</view>
						<badgeview style="margin-right: 5px;align-items: center;" :num='item.fileList ? item.fileList.length : 0' @addPic="goImg(item)" />
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ changestr(item.createTime)}}</text>
							<!-- <text>{{ item.transportTime || '--' }}</text> -->
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输数量（台）</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineNum || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>物流金额</text></view>
						<view class="cell-text-right fontBlackcolor">
							￥{{moneyUtil.dealNumber(item.logisticsCarriage || "0")}}
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>运输类型</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.transportTypeName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor" ><text>业务单号</text></view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<text @click="goBusiness(item)">{{ item.externalKey || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>合同名称</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{item.customerName||'--'}}-{{ item.projectName || '--' }}</text>
						</view>
					</view>

					<view class="line-s" />
					<view style="display: flex;flex-direction: row;justify-content: flex-end;margin-top: 5px;">
						<view class="cell-text-right fontdetailcolor" @click="gotoupdata(item)" v-if="isupdata"><text>修改</text></view>
						<view class="cell-text-right fontdetailcolor" @click="gotoDetail(item)"><text>详情</text></view>
					</view>
				</cell>
				<cell>
					<uni-load-more iconType="auto" :status="morestatus" />
				</cell>
			</list>
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
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import badgeview from '@/components/common/image-upload/badge-icon.vue'
	import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
	var timer;
	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker,
			uniPopup,
			badgeview,
			flexibleQueryView
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'more',
				searchKey: '',
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				isshow: false,
				isupdata: true,
				isExportList: true,
				totalCount: '100',
				businessTypeList: [],
				businessType: '',
				salesmanObj: {}
			};
		},
		onPullDownRefresh() {
			this.headerrefresh();
		},
		onReachBottom() {
			this.footerrefresh();
		},
		created() {
			uni.$on('refresh-record-list', e => {
				uni.showLoading()
				this.headerrefresh();
			});
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isupdata = res.data.some(x => x.value === this.$savekey.PERMISSION_LOGISTICS_UPDATA);
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			});
		},
		mounted() {
			uni.showLoading();
			this.loaddata();
			this.loadBusinessType();
		},
		methods: {
			changestr(str) {
				if (str == null) {
					return '--';
				}
				return str.split(' ')[0];
			},
			reset(val) {
				this.searchKey = '';
				this.businessType = ''
				this.salesmanObj = {}
				this.startTime = ''
				this.endTime = ''
				this.headerrefresh();

			},
			query(val) {
				this.searchKey = val.fuzzyParam;
				this.salesmanObj = val.salesmanObj;
				this.businessType = val.customObj && val.customObj.value ? val.customObj.value : '';
				this.startTime = val.startDate
				this.endTime = val.endDate
				this.headerrefresh();
			},
			//运输类型
			loadBusinessType() {
				this.$network
					.loadType('logistics_business_type')
					.then(result => {
						this.businessTypeList = result;
					})
					.catch(err => {});

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
				let param = {
					current: this.currentpage,
					size: 20,
					logisticsKey: this.searchKey,
					businessType: this.businessType ? this.businessType : undefined,
					customerSalesman: this.salesmanObj.value != "" ? this.salesmanObj.value : undefined,
					beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
				};
				this.$network
					.getData(this.$url.LOGISTICS_RECORD, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						this.$datestr.printlog(JSON.stringify(this.datalist));
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			gotoupdata(item) {
				let url = './logstics-record/logistics-record-detail?item=' + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: url
				});
			},
			gotoDetail(item) {
				let url = './logstics-record/logistics-record-detail?isedit=1&item=' + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: url
				});
			},
			goBusiness(item) {
				switch (item.businessType) {
					case '2': //进场
						uni.navigateTo({
							url: '/businessPages/workin/workin-detail?businessNo=' + item.externalKey
						});
						break;
					case '3': //退场
						uni.navigateTo({
							url: '/businessPages/workout/workout-detail?businessNo=' + item.externalKey
						});
						break;
					case '4': //调拨
						uni.navigateTo({
							url: '/devicePages/allot/allot-detail?businessNo=' + item.externalKey
						});
						break;
					default:
						break;
				}
			},
			goImg(item) {
				let isedit = this.isuser(item)
				uni.navigateTo({
					url: "../../../components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
						"&isedit=" + isedit + "&filetype=logistics_list"
				})
			},
			isuser(item) {
				if (item.canUploadFile == '0') {
					return false
				} else {
					return true
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
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				// let param = {
				// 	logisticsKey: this.searchKey,
				// 	beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				// 	endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
				// };
				// let url= this.$url.LOGISTICS_RECORD + '?isExport=true&current=1&size='+ this.totalCount
				// let downurl = this.$gxfmethod.forEachObj(url,param)
				// console.log(downurl)

				let param = {
					current: 1,
					size: this.totalCount,
					logisticsKey: this.searchKey,
					beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
				};
				let url = this.$url.BASE_URL + this.$url.LOGISTICS_RECORD + '?isExport=true'
				let filename = this.$gxfmethod.getFileName('物流记录列表-');
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
		margin-top: 50px;
		background: $uni-bg-color-grey;
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
		position: relative;
	}

	.search-box {
		display: flex;
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 16px;
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
		padding-bottom: 5px;
		background: #ffffff;
	}

	.cell-text {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		min-height: 16px;
		align-items: center;
	}

	.cell-text-left {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-left: 15px;
		min-width: 60px;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.cell-text-right {
		display: flex;
		margin-top: 5px;
		margin-left: 10px;
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
		z-index: 500;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		top: 44px;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 299;
		margin-top: 5px;
		background: #ffffff;
	}

	.condition-tag {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-base;
		margin-left: 20px;
		margin-top: 5px;
	}

	.condition-select {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 5px;
		padding-bottom: 5px;
		margin: 5px 20px;
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
		padding: 5px;
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

	.line-s {
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 10px;
		height: 1px;
		background: #eeeeee;
	}
</style>
