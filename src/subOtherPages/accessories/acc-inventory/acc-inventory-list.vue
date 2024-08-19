<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:`${navBarHeight+44}px`}">
			<view class="topTitle">
				<view class="item-view">
					<view class="item-view-top">
						<text>库存总数(个)</text>
					</view>
					<view class="item-view-bottom">
						<text>{{totalDic.count}}</text>
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-top">
						<text>配件型号(种)</text>
					</view>
					<view class="item-view-bottom">
						<text>{{totalDic.partsModelCount}}</text>
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-top">
						<text>配件类型(类)</text>
					</view>
					<view class="item-view-bottom">
						<text>{{totalDic.partsCategoryCount}}</text>
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-top">
						<text>库存总额(元)</text>
					</view>
					<view class="item-view-bottom">
						<text>{{totalDic.money}}</text>
					</view>
				</view>
			</view>
			<flexibleQueryView 
			:isExportList='isExportList' 
			hint='物料号/型号/名称/类别' 
			:isQuerySalesman="false" 
			:isQueryOrg='true'
			 :isCustomQuery="true" 
			 :isQueryTime="true" 
			 :customList='sourceArr' 
			 customHint='配件来源' 
			 orgHint="入库区域"
			 @reset='reset' 
			 @query="query"
			 @exportExcel="exportExcel" 
			 />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<partHeadView :dataDic="item"/>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>适用范围</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.scopeApplication || "--"}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>区域</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || "--"}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>库存总额</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>￥{{ item.stockAmount || "--"}}</text>
						</view>
					</view>
					<!-- <view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>库存单价</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>￥{{ item.salePrice || "--"}}</text>
						</view>
					</view> -->
					<view class="line-s" />
					<view class="bottom-btns-class">
						<!-- <view class="cell-bottom-right fontdetailcolor" @click="gotoCreate(item,'rk')" v-if = "isShowAddStock">
							<text>入库</text>
						</view> -->
						<view class="cell-bottom-right fontdetailcolor" @click="gotoCreate(item,'ly')" v-if = "isShowAddRec && Number(item.stockTotal) > 0">
							<text>出库</text>
						</view>
						<view class="cell-bottom-right fontdetailcolor" @click="gotoCreate(item,'db')" v-if = "isShowAddBack && Number(item.stockTotal) > 0">
							<text>调拨</text>
						</view>
					<!-- 	<view class="cell-bottom-right fontdetailcolor" @click="gotoCreate(item,'dj')" v-if = "isShowAddPrice">
							<text>调整单价</text>
						</view> -->
						<view class="cell-bottom-right fontdetailcolor" @click="gotoCreate(item,'xq')">
							<text>详情</text>
						</view>
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
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
import partHeadView from '../part-components/part-head-view.vue';
import { mapState } from 'vuex';
let timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		labelArrow,
		wPicker,
		selectLabelItem,
		flexibleQueryView,
		partHeadView
	},
	data() {
		return {
			righticon:"iconarrow-right",
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey:"",
			isShowAddPrice:true,
			isShowAddStock:true,
			isShowAddRec:true,
			isShowAddBack:true,
			isShowAddAlloct:true,
			
			showfilter:false,
			selectType:'area',
			selectList:[],
			sourceArr:[],
			areaCode:{},
			sourceCode:{},
			totalDic:{},
			isExportList:true,
			totalCount : '100',
			startTime:'',
			endTime:''
			
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
			success: (res) => {
				this.isShowAddPrice = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTPRICE_ADD)
				this.isShowAddStock = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTSTOCK_ADD)
				this.isShowAddRec = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTRECEVICE_ADD)
				this.isShowAddBack = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTBACK_ADD)
				this.isShowAddAlloct = res.data.some(x => x.value === this.$savekey.PERMISSION_PARTALLOCT_ADD)
			}
		})
		this.loadSourceList();
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Part_Administrative,"配件库存","列表");
	},
	props: {
		areaArr: {
			type: Array,
			default () {
				return [];
			}
		}
	},
	methods: {
		reset(val) {
			this.searchKey = '';
			this.areaCode={};
			this.sourceCode = {}
			this.startTime = ''
			this.endTime = ''
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		
		},
		query(val) {
			
			this.searchKey = val.fuzzyParam;
			this.sourceCode = val.customObj;
			this.areaCode=val.orgObj;
			this.startTime = val.startDate
			this.endTime = val.endDate
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		loadSourceList() {
			this.$network.loadUserType('parts_source').then(result => {
				this.sourceArr = result.map(o => {
					return {
						label: o.label,
						value: o.value
					};
				});
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		saveTwo(num){
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
				size: 5,
				likeName: this.searchKey === "" ? undefined : this.searchKey,
				source:  this.sourceCode.value || undefined,
				orgId: this.areaCode&&this.areaCode.value?this.areaCode.value:undefined,
				beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
			};
			this.$network
				.getData(this.$url.ACC_INVENTORY_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totalCount = result.total
					this.loadstatisticsdata();
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		loadstatisticsdata() {
			this.$network
				.getData(this.$url.ACC_INVENTORY_STATISTICS, 'GET')
				.then(result => {
					this.totalDic = {
						...result
					};
				}).catch(err => {});
		},
		gotoCreate(item,type){
			let url = ""
			switch (type) {
				case 'rk':
					url = "./acc-storagein/create-acc-storagein?inventory="
					break;
				case 'ly':
					url = "./acc-receive/create-acc-recelive?inventory="
					break;
				case 'db':
					url = "./acc-allot/create-acc-allot?inventory="
					break;
				case 'dj':
					url = "./acc-inventory/adjust-price?inventory="
					break;
				case 'xq':
					url = "./acc-inventory/acc-inverntory-detail?item="
					break;
				default:
					break;
			}
			url = url + encodeURIComponent(JSON.stringify(item))
			uni.navigateTo({
				url: url
			});
		},
		
		exportExcel(){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			// let param = {
			// 	likeName: this.searchKey === "" ? undefined : this.searchKey,
			// 	orgId: this.areaCode.value || undefined,
			// 	source:  this.sourceCode.value || undefined,			};
			// let url= this.$url.ACC_INVENTORY_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)
			
			let param = {
				"current":1,
				"size":this.totalCount,
				likeName: this.searchKey === "" ? undefined : this.searchKey,
				source:  this.sourceCode.value || undefined,
				beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
				endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined
			};
			let url= this.$gxfmethod.getUrl('partsapi/rental/partsStock/page')
			console.log(url)
			let filename = this.$gxfmethod.getFileName("配件记录列表-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
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
.top-view {
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
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}
.bottom-search{
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #FFFFFF;
	margin-bottom: 1px;
}
.bottom-search-top{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin: 10px;
	align-items: center;
	background: #FFFFFF;
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
	margin-top: 155px;
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
	border-radius: 5px;
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
	margin-left: 10px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-right: 10px;
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
.bottom-btns-class{
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
}
.cell-bottom-right {
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
.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
}
.fontsubcolor{
	color: $uni-text-color-gray;
}
.topTitle{
	width: 100%;
	height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background: #FFFFFF;
	margin-top: 10px;
	margin-bottom: 5px;
}
.item-view{
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.item-view-top{
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
}
.item-view-bottom{
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: $uni-font-size-sm;
	color: $uni-color-primary;
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
