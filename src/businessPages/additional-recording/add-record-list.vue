<template>
	<view class="list-bg">
		<c-nav-bar :show-back="false">
			<view class="title-bar">
				<i class="iconfont left-btn iconfanhui" @click="goBack"></i>
				<view class="title-view row-line">进退场补录</view>
				<view class="right-container">
					<i class="iconfont icon-view iconadd-func" @click.stop="gotocreat" v-if="isShowAdd"></i>
					<i class="iconfont icon-view iconliebiaodaochu" @click.stop="exportExcel" v-if="isExportList"></i>
				</view>
			</view>
		</c-nav-bar>
		<view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input style="flex: 1;font-size: 14px;" placeholder="合同名称" v-model="searchKey" /></view>
			</view>
			<selectView :value="salesmanObj.label" hint="业务负责人" @clickSelect="showPick('salesman')" />
		</view>
		<list class="list-view" :style="{marginTop:`${statusBarHeight+116}px`}">
			<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
				<businessItemFrame :stateName="item.stateName || ''" :showAttachment="false">
					<block slot="title">
						<view>{{ item.customerName || '--' }} - {{ item.projectName || '--' }}</view>
					</block>
					<block slot="subContent">
						<view class="max-one-line">{{item.businessNo}}&nbsp;|&nbsp;{{ item.customerSalesmanName || '-' }}&nbsp;|&nbsp;{{ item.orgName || '-' }}</view>
					</block>
					<block slot="content">
						<view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">创建时间：</view>
								{{ getDate(item.createTime) }}
							</view>
						</view>
					</block>
					<block slot="options">
						<view class="row-line">
							<taskBtn :itemData="item" :isBorder="true" />
							<view class="option-btn" @click.stop="editCreate(item)" v-if="ishowupdata(item)">修改</view>
							<view class="option-btn" @click.stop="gotodetail(item)">详情</view>
						</view>
					</block>
				</businessItemFrame>
			</cell>
			<view><uni-load-more iconType="auto" :status="morestatus" /></view>
		</list>

		<w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
import selectView from '@/components/common/common-ui/selector-view.vue';
import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
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
		selectView,
		businessItemFrame
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'loading',
			searchKey: '',
			isShowAdd: true,
			selectList: [],
			areaCode: {
				value: '',
				label: '请选择区域'
			},
			inassginDic: {
				value: '',
				label: '请选择退回人'
			},
			selectType: '',
			showfilter: false,
			startTime: '请选择开始时间',
			endTime: '请选择结束时间',
			userid: '',
			isExportList: true,
			totalCount: '100',
			salesmanObj: {},
			salesmanList: []
		};
	},
	computed:{
    ...mapState('system',{
      statusBarHeight:s=>s.statusBarHeight
    })
  },
	mounted() {
		uni.showLoading();
		this.loaddata();
		this.loadOwnerList();
	},
	onLoad() {
		this.$gxfmethod.statisticData(this.$eventId.Bussiness_Tool, '进退场补录', '列表');
		uni.$on('refresh-additional-list', usnerinfo => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_ADD_WORKINOUT);
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		});
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: res => {
				this.userid = res.data.id;
			}
		});
	},
	onPullDownRefresh() {
		this.headerrefresh();
	},
	onReachBottom() {
		this.footerrefresh();
	},
	watch: {
		searchKey: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
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
					this.salesmanList = [];
					this.salesmanList.push({
						label: '全部',
						value: ''
					});
					this.salesmanList = this.salesmanList.concat(
						result
							? result.map(dict => {
									return {
										label: dict.username,
										value: dict.id
									};
							  })
							: []
					);
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		ishowupdata(item) {
			return this.iscreator(item) && (item.state === '0' || item.state === '3');
		},
		iscreator(item) {
			if (item.createBy === this.userid || item.customerSalesman === this.userid) {
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
				size: 5,
				contractName: this.searchKey === '' ? null : this.searchKey,
				customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined
			};
			this.$network
				.getData(this.$url.WORKIN_OUT_LIST, 'POST', param)
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
					'&filetype=parts_return_type'
			});
		},
		isuser(item) {
			if (item.createBy === this.userid) {
				return true;
			} else {
				return false;
			}
		},
		gotocreat() {
			let url = '/businessPages/invoice/contract-choose?title=选择进退场补录合同&state=5,6,7,8&type=workInOut&&isFirst=true';
			uni.navigateTo({
				url: url
			});
		},
		gotodetail(item) {
			let url = './add-record-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		},
		editCreate(item) {
			uni.navigateTo({
				url: './create-add-record?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		filtrateMenu() {
			this.showfilter = !this.showfilter;
		},
		showPick(type) {
			this.selectType = type;
			if (type === 'area') {
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'rkr') {
				this.selectList = this.inassginArr;
				this.$refs.selector.show();
			} else if (type == 'salesman') {
				this.selectList = this.salesmanList;
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
			} else if (this.selectType === 'salesman') {
				this.salesmanObj = val.checkArr;
				this.headerrefresh();
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
			// 	fuzzyQuery:this.searchKey,
			// };
			// let url= this.$url.WORKIN_OUT_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)
			let param = {
				current: 1,
				size: this.totalCount,
				contractName: this.searchKey,
				customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined
			};
			let url = this.$gxfmethod.getUrl(this.$url.WORKIN_OUT_LIST);
			console.log(url);
			let filename = this.$gxfmethod.getFileName('进退场补录记录列表-');
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
	position: relative;
}

.head-container {
	top: 0px;
	left: 0px;
	position: fixed;
	background-color: #ffffff;
	width: 100%;
	display: flex;
	flex-direction: column;
	z-index: 400;
	border-bottom: 1px solid $uni-bg-color-grey;
}

.status-bar-view {
	width: 100%;
}

.title-bar {
	height: 56px;
	line-height: 56px;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	position: relative;
}

.left-btn {
	position: absolute;
	top: 0px;
	left: 0px;
	height: 56px;
	line-height: 56px;
	font-size: 20px;
	text-align: center;
	color: #111111;
}

.title-view {
	height: auto;
	// border: 1px solid #999999;
	// border-radius: 4px;
	height: 24px;
	padding: 0px 16px;
	font-size: 16px;
	font-weight: bold;
}

.right-container {
	position: absolute;
	top: 0px;
	left: 25px;
	height: 56px;
	line-height: 56px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.icon-view {
	font-size: 20px;
	padding-left: 10px;
}

//搜索框
.top-view {
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	top: 0px;
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
	width: calc(100% - 8px);
	padding-right: 8px;
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

//列表
.list-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}
</style>
