<template>
	<view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input placeholder="物流单号/货物名称" v-model="searchKey" style="flex:1;font-size: 14px;"/>
					</view>
				</view>
				<view class="export-view-style" @click="exportExcel" v-if="isExportList">
					导出
				</view>
				<view class="filter-view-style" @click="filtrateMenu">
					<text>筛选</text>
				</view>
			</view>
			<view class="filter-container" v-if="isshow">
				<view class="condition-tag">时间段</view>
				<view class="condition-select">
					<label-arrow :value="startTime == '' ? '起始时间' : startTime" textColor="#555555" @clickLabel="showPick('startTime')" />
					<view style="width: 30px;height: 1px;background-color: #FFFFFF;" />
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
					<view class="head-contract-view">
						<view class="head-contract-s-view">
							<view class="cell-text">
								<view class="cell-text-left fontBlackcolor" style="color: #000000;">
									<text class="fontsubcolor left-title-style">货物名称</text>
									<text style="margin-left: 15px;">{{item.goodsName || "--"}}</text>
								</view>
							</view>
							<view class="cell-text">
								<view class="cell-text-left fontBlackcolor" style="color: #000000;">
									<text class="fontsubcolor left-title-style">运费总计</text>
									<text style="margin-left: 15px;">￥{{moneyUtil.dealNumber(item.logisticsCarriage || "0")}}</text>
								</view>
							</view>
							<view class="cell-text">
								<view class="cell-text-left fontBlackcolor" style="color: #000000;">
									<text class="fontsubcolor left-title-style">车次数</text>
									<text style="margin-left: 15px;">{{item.cargoInfos ? item.cargoInfos.length : "0"}}</text>
								</view>
							</view>
						</view>
						<view class="head-contract-e-view">
							<i class="iconfont item-customdetail"
							:class="item.expandArrow ? 'iconarrow-up' : 'iconarrow-down'"
							@click="expendArrow(item,index)"
							ref="expandArrow">
							
							</i>
						</view>
						<view class="line-s" />
					</view>
					<view class="head-contract-s-view subback" style="padding:5px 0px 5px 15px;" v-for="(itemList, indexList) in item.cargoInfos" :key="indexList" v-if="item.expandArrow">
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>目的地</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ itemList.arrivalAddress || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>物流公司</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ itemList.logisticsCompanyName || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>物流联系人</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ itemList.logisticsContact || '--' }}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>物流联系人电话</text></view>
							<view class="cell-text-right fontBlackcolor">
								<view><labelPhone :value="itemList.logisticsPhone"/></view>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>物流运费</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>￥{{moneyUtil.dealNumber(itemList.logisticsCarriage || "0")}}</text>
							</view>
						</view>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>创建时间</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ itemList.createTime || '--' }}</text>
							</view>
						</view>
						<view class="line-s-white" />
					</view>
				</cell>
				<cell>
					<uni-load-more iconType="auto" :status="morestatus" />
				</cell>
			</list>
		</view>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="false" 
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';
var timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		labelArrow,
		wPicker,
		labelPhone
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
			isExportList:true,
			totalCount:'100'
		};
	},
	watch: {
		searchKey: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					uni.showLoading();
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
				
			}
		}
	},
	onPullDownRefresh() {
		this.headerrefresh();
	},
	onReachBottom() {
		this.footerrefresh();
	},
	created() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		});
	},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	methods: {
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
				businessKey: this.searchKey,
				beginDate:this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				endDate:this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
			};
			this.$network
				.getData(this.$url.LOGISTICS_TRANS_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					this.totalCount = result.total.toString()
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
		expendArrow(item,index){
			this.datalist.splice(index,1,{
				...item,
				expandArrow:!item.expandArrow
			})
		},
		gotoDetail(item) {
			let url = './logstics-record/logistics-record-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
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
		//=================
		exportExcel(){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			// let param = {
			// 	businessKey: this.searchKey,
			// 	beginDate:this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
			// 	endDate:this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
			// };
			// let url= this.$url.LOGISTICS_TRANS_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)
			
			let param = {
				current : 1,
				size : this.totalCount,
				businessKey: this.searchKey,
				beginDate:this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				endDate:this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
			};
			let url= this.$url.BASE_URL + this.$url.LOGISTICS_TRANS_LIST + '?isExport=true'
			let filename = this.$gxfmethod.getFileName('设备物流记录-');
			this.$gxfmethod.downFunc(url,'POST',param,filename)
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
.filter-view-style{
	height: 35px;
	width: 60px;
	display: flex;
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
	color: #333333;
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
	align-items: center;
	justify-content: flex-start;
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
	margin-top:5px;
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
.head-contract-view{
	display: flex;
	flex-direction: row;
	padding: 5px 0px;
	align-items: center;
	justify-content: flex-start;
}
.head-contract-s-view{
	display: flex;
	flex: 1;
	flex-direction: column;
	
}
.head-contract-e-view{
	display: flex;
	flex-direction: column;
	margin-left: 10px;
	margin-right: 10px;
}
.item-customdetail {
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: flex-end;
	margin-right: 5px;
}
.subback{
	background: $uni-bg-color-grey;
}
.line-s-white {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 2px;
	background: #FFFFFF;
}
.left-title-style{
	white-space:nowrap;
	min-width: 80px;
}
.zw-style{
	display: flex;
	width: 20px;
	height: 20px;
	border-radius: 3px;
}
</style>
