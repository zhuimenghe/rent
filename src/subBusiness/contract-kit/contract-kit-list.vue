<template>
	<view class="change-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="gotocreat"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="top-view" :style="{top:posTop+'px'}">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;" placeholder="请输入客户名称或者项目名称" @input="searchChange" />
					</view>
				</view>
				<view class="export-css" @click="exportExcel" v-if="isExportList">
					<text>导出</text>
				</view>
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<!-- taxNumber -->
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<view style="display: flex;flex: 1;flex-direction: column;">
								<view>
									<text> {{item.customerName }}-{{ item.contractDetailDto.projectName||"" }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{ item.stateName || '-' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>合同单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.changeNo || '-' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>支付约定</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '-' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>区域</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.contractDetailDto.customerSalesmanName || '-' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text-right fontdetailcolor">
						<taskBtn :itemData='item'/>
						<view  style="margin-left: 20px;" @click="gotodetail(item)">
							<text>合同详情</text>
						</view>
						<view style="margin-left: 20px;"  @click="gotodetail(item)">
							<text>更多操作</text>
						</view>
					</view>
				</cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
		</view>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
	import {mapState} from 'vuex'
var _self;
export default {
	components: {
		filterView,
		uniLoadMore,
		labelArrow,
		wPicker,
		taskBtn
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'loading',
			searchKey: '',
			pickType: '',
			isshow: false,
			isExportList:true
		};
	},
	computed:{
			...mapState('system',{
				posTop:s=>s.statusBarHeight+s.titleBarHeight,
			}),
		},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	created() {
		_self = this;
	},
	methods: {
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
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
				fuzzyParam: this.searchKey
			};
			this.$network
				.getData(this.$url.CONTRACT_CHANGE_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
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
			uni.showLoading();
			this.loaddata();
		},
		gotocreat() {
			uni.navigateTo({
				url: '/contractPages/contract-kit/create-contract-kit'
			});
		},
		gotodetail(item) {
			let businessNostr = item.businessNo;
			let url = '/businessPages/invoice/invoice-detail?businessNo=' + businessNostr;
			uni.navigateTo({
				url: url
			});
		},
		exportExcel(){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			let url = this.$url.BASE_URL + "machineapi/api/cr-work-out-machine/export/mobile?current=1&size=" + '100000'
			if(this.searchKey != ""){
				url = url + "&keyword=" + this.searchKey
			}
			this.$datestr.downFunc(url)
		},
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.change-list-bg {
	display: flex;
	flex: 1;
	flex-direction: column;
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
.top-view{
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
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
.filter-view-style {
	height: 35px;
	display: flex;
	background: #eeeeee;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: calc(55px);
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
.export-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	background: #FFFFFF;
	border-radius: 4px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	border: 1px solid $uni-color-primary;
}
</style>
