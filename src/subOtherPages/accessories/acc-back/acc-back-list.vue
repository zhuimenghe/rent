<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="gotocreat" v-if="isShowAdd"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="top-view"  :style="{top:`${navBarHeight+44}px`}">
			<flexibleQueryView
				:isExportList="isExportList"
				hint="物料号/型号/名称/类别"
				:isQuerySalesman="false"
				:isQueryOrg="true"
				:isQueryTime="true"
				orgHint="退回区域"
				@reset="reset"
				@query="query"
				@exportExcel="exportExcel"
			/>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<view style="display: flex;flex: 1;flex-direction: column;font-weight: bold;">
								<view>
									<text>{{ item.businessNo || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{ item.stateName || '--' }}</text>
						</view>
						<!-- <badgeview
						:num='item.fileList ? item.fileList.length : 0' 
						@addPic="goImg(item)" 
						/> -->
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退回时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ changestr(item.returnTime) }}</text>
						</view>
					</view>
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>配件型号(种)</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.partsType || "--"}}</text>
						</view>
					</view> -->
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退回数量</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>共{{ item.partsType || '--' }}种/{{ item.partsNumber || '-' }}个</text>
						</view>
					</view>
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>配件总价</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>￥{{ item.partsAmount || "--"}}</text>
						</view>
					</view> -->
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退回区域</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退回人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.returnUserName || '--' }}</text>
						</view>
					</view>

					<view class="line-s" />
					<view class="bottom-btns-class">
						<view style="display: flex;flex: 1;justify-content: flex-start;">
							<badgeBottom :num="item.fileList ? item.fileList.length : 0" @addPic="goImg(item)" />
						</view>
						<taskBtn :itemData="item" />
						<view class="bottom-text-right fontdetailcolor" @click="editCreate(item)" v-if="ishowupdata(item)">修改</view>
						<view class="bottom-text-right fontdetailcolor" @click="gotodetail(item)"><text>详情</text></view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
		<w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date" themeColor="#E60000" />
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
import { mapState } from 'vuex';
let timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		labelArrow,
		wPicker,
		badgeview,
		taskBtn,
		flexibleQueryView
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			isShowAdd: true,
			selectList: [],
			areaCode: {},
			inassginDic: {},
			selectType: '',
			showfilter: false,
			startTime: '',
			endTime: '',
			userid: '',
			isExportList: true,
			totalCount: '100'
		};
	},
	computed:{
		...mapState('system',['navBarHeight'])
	},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	created() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTBACK_ADD);
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		});
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: res => {
				this.userid = res.data.id;
			}
		});
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Part_Administrative,"配件退回","列表");
	},
	props: {
		areaArr: {
			type: Array,
			default() {
				return [];
			}
		},
		inassginArr: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		reset(val) {
			this.searchKey = '';
			this.startTime = '';
			this.endTime = '';
			this.areaCode = {};
			this.headerrefresh();
		},
		query(val) {
			this.searchKey = val.fuzzyParam;
			this.areaCode = val.orgObj;
			this.startTime = val.startDate;
			this.endTime = val.endDate;
			this.headerrefresh();
		},
		ishowupdata(item) {
			return this.iscreator(item) && (item.state === '0' || item.state === '3');
		},
		iscreator(item) {
			if (item.createBy === this.userid) {
				return true;
			} else {
				return false;
			}
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		saveTwo(num) {
			return this.$datestr.doubleFloat(num);
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
				likeName: this.searchKey === '' ? undefined : this.searchKey,
				orgId: this.areaCode && this.areaCode.value ? this.areaCode.value : undefined,
				startTime: this.startTime ? this.startTime + ' 00:00:00' : undefined,
				endTime: this.endTime ? this.endTime + ' 23:59:59' : undefined
				// returnUserName: this.inassginDic.value || undefined,
			};
			this.$network
				.getData(this.$url.ACC_BACK_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totalCount = result.total;
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		goImg(item) {
			let isedit = this.isuser(item);
			uni.navigateTo({
				url:
					'../../../components/common/image-upload/upload_zb_apendix?item=' +
					encodeURIComponent(JSON.stringify(item)) +
					'&isedit=' +
					isedit +
					'&filetype=parts_return_type&refreshType=refresh-acc-list'
			});
		},
		isuser(item) {
			// if (item.createBy === this.userid) {
			// 	return true
			// } else {
			// 	return false
			// }
			if (item.canUploadFile == '0') {
				return false;
			} else {
				return true;
			}
		},
		gotocreat() {
			uni.navigateTo({
				url: './acc-back/create-acc-back'
			});
		},
		gotodetail(item) {
			let url = './acc-back/acc-back-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		},
		editCreate(item) {
			uni.navigateTo({
				url: './acc-back/create-acc-back?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		filtrateMenu() {
			this.showfilter = !this.showfilter;
		},
		showpick(type) {
			this.selectType = type;
			if (type === 'area') {
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'rkr') {
				this.selectList = this.inassginArr;
				this.$refs.selector.show();
			} else {
				this.$refs.date.show();
			}
		},
		dialog(val) {
			if (this.selectType === 'area') {
				this.areaCode = val.checkArr;
			} else if (this.selectType === 'rkr') {
				this.inassginDic = val.checkArr;
			}
		},
		onConfirm(val) {
			if (this.selectType === 'starttime') {
				this.startTime = val.result;
			} else {
				this.endTime = val.result;
			}
		},
		clearsum() {
			this.areaCode = {
				value: '',
				label: '请选择区域'
			};
			this.inassginDic = {
				value: '',
				label: '请选择退回人'
			};
			this.startTime = '请选择开始时间';
			this.endTime = '请选择结束时间';
			uni.showLoading();
			this.showfilter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		oksum() {
			uni.showLoading();
			this.showfilter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		exportExcel() {
			 
			// let param = {
			// 	likeName: this.searchKey === "" ? undefined : this.searchKey,
			// 	orgId: this.areaCode.value || undefined,
			// 	startTime: this.startTime === "请选择开始时间" ? undefined : (this.startTime + " 00:00:00"),
			// 	endTime: this.endTime === "请选择结束时间" ? undefined : (this.endTime + " 23:59:59"),
			// 	returnUserName: this.inassginDic.value || undefined,
			// };
			// let url= this.$url.ACC_BACK_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)

			let param = {
				current: 1,
				size: this.totalCount,
				likeName: this.searchKey === '' ? undefined : this.searchKey,
				orgId: this.areaCode.value || undefined,
				startTime: this.startTime ? this.startTime + ' 00:00:00' : undefined,
				endTime: this.endTime ? this.endTime + ' 23:59:59' : undefined
				// returnUserName: this.inassginDic.value || undefined,
			};
			let url = this.$gxfmethod.getUrl(this.$url.ACC_BACK_LIST);
			console.log(url);
			let filename = this.$gxfmethod.getFileName('配件退回记录列表-');
			this.$gxfmethod.downFunc(url, 'POST', param, filename);
		}
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	width: 100%;
	background: $uni-bg-color-grey;
}
//添加按钮
.add-container {
	position: fixed;
	display: flex;
	bottom: 50px;
	right: 20px;
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
.top-view {
	z-index: 300;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
}
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}
.search-box {
	background: #F7F7F7;
	height: 35px;
	flex: 1;
	line-height: 35px;
	display: flex;
	margin: 8px;
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
	background: $uni-color-primary;
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
	min-width: 50px;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-right: 15px;
	margin-left: 10px;
	min-height: 20px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.fontBlackcolor {
	color: $uni-text-color;
}
.fontdetailcolor {
	color: $uni-color-primary;
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
.bottom-search {
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #ffffff;
	margin-bottom: 1px;
}
.bottom-search-top {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin: 10px;
	align-items: center;
	background: #ffffff;
}
.condition-btn {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.clear {
	background-color: $uni-border-color;
}

.confirm {
	background-color: $uni-color-primary;
}
.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 10px;
	margin-right: 10px;
	padding-top: 5px;
	padding-bottom: 5px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
}
.bottom-btns-class {
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
}
.bottom-text-right {
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
