<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="请输入自喷码/车号" v-model="searchKey" />
					</view>
				</view>
				<view class="filter-view-style" @click="downXLS" v-if="exportShow">
					<text>导出</text>
				</view>
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>车号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineDto.licenseId || '--' }}</text>
						</view>	
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>自喷码</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineDto.printCode || '-' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>类型</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineDto.machineTypeDesc || '--' }}</text>
						</view>	
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>高度</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.machineDto.machineHeightDesc || '--' }}</text>
						</view>
					</view>
					<!-- <view class="line-s" /> -->
					<!-- <view class="cell-text"> 
						<view class="cell-text-left fontsubcolor"><text>退场时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.workOutTime || '--' }}</text>
						</view>
					</view> -->
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerSalesmanName || '--' }}</text>
						</view>
					</view> -->
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>接机人员</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.deliveryUserName || '--' }}</text>
						</view>
					</view> -->
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>区域</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '--' }}</text>
						</view>
					</view> -->
					<view class="cell-text" style="margin-bottom: 10px;">
						<view class="cell-text-left fontsubcolor"><text>位置</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.address || '--' }}</text>
						</view>
					</view>
					<view class="line-s"  v-if="isShowAdd"/>
					<view class="t-bottom" v-if="isShowAdd">
						<view
						v-if="isShowAdd"
						class="cell-text-right fontdetailcolor" 
						@click='gotodetail(item)'>检修</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
var timer;
export default {
	components: {
		filterView,
		uniLoadMore,
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			isShowAdd:true,
			downloadTask:null,
			totolNum:0,
			exportShow:true
		};
	},
	watch: {
		searchKey: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					uni.showLoading()
					this.searchKey = val;
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500)
			}
		}
	},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	created() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_STOCK_ADD)
				this.exportShow = res.data.some(x => x.value === this.$savekey.PERMISSION_CHECK_EXPORT) 
			}
		})
	},
	methods: {
		downXLS(item){
			// if (this.downloadTask) {
			// 	// this.downloadTask.abort();
			// 	this.downloadTask = null;
			// }
			// let url = this.$url.BASE_URL + "machineapi/api/cr-work-out-machine/export/mobile/inRen?current=1&size=" + this.totolNum
			// if(this.searchKey != ""){
			// 	url = url + "&keyword=" + this.searchKey
			// }
			
			let param = {
				current : 1,
				size : this.totolNum,
				keyword: this.searchKey,
			};
			let url = this.$url.BASE_URL + "machineapi/api/cr-work-out-machine/export/inRen"
			let filename = this.$gxfmethod.getFileName("在租检修列表-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
		hide() {
			if (this.downloadTask) {
				// this.downloadTask.abort()
				this.downloadTask = null;
			}
		},
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
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
				size: 10,
				keyword: this.searchKey,
				storageLeasedType:'2'
			};
			this.$network
				.getData(this.$url.RENTAL_WAIT_SERVICE_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totolNum = result.total;
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		gotodetail(item) {
			uni.showLoading()
			let param = {
				current: this.currentpage,
				size: 10000,
				keyword: item.machineDto.licenseId
			};
			this.$network
				.getData(this.$url.STOCK_SERVICE_LIST, 'POST', param)
				.then(result => {
					let list = result.records || []
					let filtterList = list.filter((o)=>{
						return o.state === "1"
					})
					uni.hideLoading();
					if(filtterList.length > 0){
						let ordernumstr = "";
						filtterList.forEach(o=>{
							if(ordernumstr === ""){
								ordernumstr = o.businessNo
							}else{
								ordernumstr = ordernumstr + "," + o.businessNo
							}
							
						})
						uni.showModal({
							title: '提示',
							content: "已存在审批中的检修单据;\n单号为:" + ordernumstr,
							confirmText: "查看检修单",
							success: function (res) {
								if (res.confirm) {
								    let url = '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(filtterList[0]));
								    uni.navigateTo({
								    	url: url
								    });
								} 
							}
						});
					}else{
						uni.navigateTo({
							url: './create-service?type=2&item=' + encodeURIComponent(JSON.stringify(item))
						});
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
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
	z-index: 900;
}
.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}
.top-view{
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
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
.filter-view-style{
	height: 35px;
	width: 60px;
	display: flex;
	background: #FFFFFF;
	border: 1px solid $uni-color-primary;
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
	color: $uni-color-primary;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 99px;
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
}
.cell-text-left {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
	min-width: 40px;
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
.fontsubcolor {
	color: $uni-text-color-gray;
}
.filter-container {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 299;
	background: #FFFFFF;
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
.t-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
