<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="车号/自喷码" v-model="searchKey" />
					</view>
				</view>
				<view class="btnstyle" @click="gotoOther('filter')">
					<text>筛选</text>
				</view>
				<view class="btnstyle-export" @click="gotoOther('export')" v-if="deviceExport">
					<text>导出</text>
				</view>
			</view>
			<view class="bottom-search" v-if="showfileter">
				<!-- <view class="bottom-search-top">
					<label-arrow
					style="flex: 1;"
					:value="startDate" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('start')"
					/>
					<label-arrow
					style="margin-left: 30px;flex: 1;"
					:value="endDate" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('end')"
					/>	
				</view> -->
				<view class="bottom-search-top">
					<label-arrow
					style="flex: 1;"
					:value="orgDic.label" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('org')"
					/>
					<view style="margin-left: 30px;flex: 1;"/>	
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">查询</view>
				</view>	
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor">
							<view class="item-head">
								<view class="head-top">{{ item.licenseId || '--' }}</view>
								<view class="head-bottom">
									<text>{{ item.typeName || '--' }}</text>
									|
									<text class="item-text">{{ item.heightName || '--' }}</text>
									|
									<text class="item-text">{{ item.brand || '--' }}</text>
									|
									<text class="item-text">{{ item.machineTypeName || '--' }}</text>
									|
									<text class="item-text">{{ item.printCode || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<text>{{ item.stateName || '--' }}/{{ item.subStateName || '--' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text" @click="gotoDetail(item)">
						<view class="cell-text-left fontsubcolor"><text>合同编号</text></view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<text>{{ item.contractNo || '--' }}</text>
						</view>
						<i class="iconfont iconarrow-right" style="padding-right: 8px;color: #E60000;"></i>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>合同名称</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerName || '--' }}-{{item.projectName || '--'}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>组织</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.orgName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>营收</text></view>
						<view class="cell-text-right" >
							<text>{{ moneyUtil.dealNumber(item.receivableCurrent) || '--' }}</text>
						</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
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
		<w-picker 
		:selectList="orgList"
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
let timer;
export default {
	components: {
		uniLoadMore,
		wPicker,
		labelArrow
	},
	props: {
		areaDic: {
			type: Object,
			default () {
				return {};
			}
		},
		beginDate: {
			type: String,
			default: ""
		},
		enDate: {
			type: String,
			default: ""
		},
		deviceExport: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			startDate:'开始时间',
			endDate:'结束时间',
			orgDic:{
				value:'',
				label:'全部'
			},
			orgList:[],
			selectType:"",
			showfileter:false,
			downloadTask:null
		};
	},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	created() {
		this.startDate = this.beginDate;
		this.endDate = this.enDate;
		this.orgDic = this.areaDic;
		this.getOrgList();
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
		gotoDetail(item){
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
			});
		},
		gotoOther(type){
			if(type === 'filter'){
				this.showfileter = !this.showfileter;
			}else{
				this.exportList()
			}
		},
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
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
				keyword: this.searchKey,
				orgId : this.orgDic.value === "" ? undefined : this.orgDic.value,
				isUnionContract : false
			};
			this.$network
				.getData(this.$url.DEVICE_STATISTICS_LIST, 'POST', param)
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
				}).catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		getOrgList() {
			let _self = this
			this.$network.getData(this.$url.ORG_ALL, "GET").then((result) => {
			
				if (result && result.length > 0) {
					result.forEach(function dep(o) {
						_self.orgList = [..._self.orgList, {
							value: o.id,
							label: o.name,
							children: o.children
						}];
						if (o.children && o.children.length > 0) o.children.map(dep);
					})
				}
			}).catch((err) => {})
		},
		clearsum(){
			this.startDate = this.beginDate;
			this.endDate = this.enDate;
			this.orgDic = this.areaDic;
			this.searchKey = ''
			uni.showLoading()
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		oksum(){
			uni.showLoading()
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		showpick(type) {
			this.selectType = type
			if(type === 'org'){
				this.$refs.selector.show();
			}else{
				this.$refs.date.show();
			}
		},
		onConfirm(val) {
			if(this.selectType === 'org'){
				this.orgDic = val.checkArr;
			}else if(this.selectType === "start"){
				this.startDate = val.result
			}else if(this.selectType === "end"){
				this.endDate = val.result
			}
		},
		exportList(){
			// uni.showLoading({
			// 	title:'正在下载中,请稍等...',
			// 	mask:true,
			// })
			// let param = {
			// 	isUnionContract:false,
			// 	keyword:this.searchKey != "" ? this.searchKey : undefined,
			// 	orgId : this.orgDic.value != "" ? this.orgDic.value : undefined
			// }
			// let url = this.$url.BASE_URL + "settleapi/api/receivable/machine/account/export";
			// console.log(url)
			// let filename = this.$gxfmethod.getFileName('设备营收统计-')
			// console.log(filename)
			
			let headerDic = {
				'Content-Type': 'application/json',
				'Authorization': '',
			};
			let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
			if (loginMes) {
				let access_token = loginMes.token_type + " " + loginMes.access_token;
				headerDic.Authorization = access_token;
				this.downDocument(headerDic)
			}
		},
		downDocument(headerDic){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			let url = this.$url.BASE_URL + "settleapi/api/receivable/machine/account/download?isUnionContract=false"
			if(this.searchKey != ""){
				url = url + "&keyword=" + this.searchKey
			}
			if(this.orgDic.value != ""){
				url = url + "&orgId=" + this.orgDic.value
			}
			this.$network.getData(url, 'GET', null).then(result => {}).catch(err => {
				if(err.code){
					uni.showToast({
						title: err.message + ":" +  err.details[0],
						icon: 'none'
					});
				}else{
					setTimeout(()=>{
						// this.downstart(url,headerDic)
						
						let filename = this.$gxfmethod.getFileName('设备营收统计-')
						console.log(filename)
						this.$gxfmethod.downFunc(url,'GET',undefined,filename)
						
						
					}, 100);
				}
			});
		},
		hide() {
			if (this.downloadTask) {
				this.downloadTask.abort()
				this.downloadTask = null;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
	width: 100%;
	background: #FFFFFF;
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
	z-index: 100;
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
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}
.filter-view-style {
	display: flex;
	background: #eeeeee;
	align-items: center;
	justify-content: center;
	height: 40px;
	padding-left: 10px;
	padding-right: 10px;
	margin-right: 10px;
	border-radius: 5px;
	color: #E60000;
	font-size: $uni-font-size-sm;
}
.search-box {
	background: #F7F7F7;
	flex: 1;
	height: 40px;
	display: flex;
	margin: 8px 10px;
	flex-direction: row;
	padding-left: 10px;
	border-radius: 5px;
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
.btnstyle{
	display: flex;
	margin-right: 10px;
	height: 35px;
	padding-left: 10px;
	padding-right: 10px;
	flex-direction: row;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	color: #222222;
	font-size: $uni-font-size-base;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 100px;
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
	border-radius: 4px;
	padding: 5px;
}

.item-head {
	display: flex;
	flex-direction: column;
}

.head-top {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
}

.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-bottom: 4px;
	margin-top: 4px;
}

.item-text {
	margin-right: 2px;
	margin-left: 2px;
}

.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin-top: 10px;
	margin-bottom: 10px;
	justify-content: center;
}

.cell-text-left {
	display: flex;
	flex: 1;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}

.cell-text-right {
	display: flex;
	margin-right: 15px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.fontBlackcolor {
	color: $uni-text-color;
}

.line-s {
	margin-top: 10px;
	margin-bottom: 10px;
	height: 1px;
	background: #eeeeee;
}

.fontsubcolor {
	color: $uni-text-color-gray;
}
.bottom-search{
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 5px 0px;
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
</style>
