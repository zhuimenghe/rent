<template>
	<view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="goTo('search', null)" v-if="isShowAdd&&showHeader"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="top-view" v-if="showHeader">
			<searchHeader
			type="by"
			:keyword="searchString"
			:isExportList='isExportList' 
			:isControlMore="true"
			:isQueryOrg="true" 
			:isSSN="true" 
			:isQueryState="true" 
			:isQueryTime="true" 
			:isQueryCreate="true" 
			:isQueryRepair="false"
			@query="query"
			@exportExcel="exportExcel"
			/>
		</view>
		<list class="list-med" show-scrollbar="false" :style="{top:showHeader?'100px':'8px'}">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="cell-bg-view">
					<view class="cell-top-view">
						<view class="icon-car-right" style="color: #E60000;" @click="goTo('detail', item)">
							<text>{{item.businessNo || "--"}}</text>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{item.stateName || "--"}}</text>
						</view>
						<!-- <badgeview
						:num='item.fileListNum ? item.fileListNum : 0' 
						@addPic="goImg(item)" 
						/> -->
					</view>
					<view class="item-middle">
						<view class="tag"><text>区域</text></view>
						<view class="value">
							<text>{{item.orgName ? item.orgName : "--"}}</text>
						</view>
					</view>
					<view class="item-middle">
						<view class="tag"><text>自喷码</text></view>
						<view class="value">
							<text>{{item.machineDto && item.machineDto.printCode ? item.machineDto.printCode : "--"}}</text>
						</view>
					</view>
					<view class="item-middle">
						<view class="tag"><text>车号</text></view>
						<view class="value">
							<text>{{item.licenseId || "--"}}</text>
						</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养开始时间</view>
						<view class="value">{{ getYMDHMTime(item.operateStartDate) || '--' }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养结束时间</view>
						<view class="value">{{ getYMDHMTime(item.operateEndDate) || '--' }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养时长</view>
						<view class="value">{{ $datestr.doubleFloat(item.maintenanceDuration) || '--' }}小时</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养级别</view>
						<view class="value">{{ getLevelString(item.level) }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养人</view>
						<view class="value">{{ item.maintenancePersonName || '--' }}</view>
					</view>
					<view class="item-bottom">
						<view style="display: flex;flex: 1;justify-content: flex-start;">
							<badgeBottom
							:num='item.fileListNum ? item.fileListNum : 0' 
							@addPic="goImg(item)" 
							/>
						</view>
						<taskBtn :itemData="item" />
						<view class="option" @click="goTo('update', item)" v-if="userid === item.createBy && item.state === '0'">修改</view>
						<view class="option" @click="goTo('detail', item)">详情</view>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
		<deviceView :showDialog='showDialog' type='maintain'/>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import filterView from '@/components/common/common-ui/filter-view.vue';
import numToChinese from '@/common/util/num-to-chinese.js';
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
import deviceView from '@/components/common/common-ui/device-add-view.vue'
import searchHeader from '@/components/common/common-ui/device-query-record.vue'

let timer;
export default {
	components: {
		uniLoadMore,
		filterView,
		badgeview,
		taskBtn,
		deviceView,
		searchHeader
	},
	props: {
		searchString: {
			type: String,
			default: ""
		},
		showHeader: {
			type: Boolean,
			default:true
		},
		licenseId:{
			type: String,
			default: ""
		}
	},
	data() {
		return {
			datalist: [],
			//上拉下拉
			morestatus: 'more',
			page: 1,
			userid: '',
			isShowAdd: true,
			isExportList:true,
			totalCount:'100',
			showDialog:false,
			needShowDialog:true,
			searchObj:{}
		};
	},
	created() {
		if(this.searchString == ""){
			this.getNetData()
		}
		let userPdata = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		this.isShowAdd = userPdata.some(x => x.value === this.$savekey.PERMISSION_MACHINE_MAINTAIN_ADD);
		let userInfodata = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
		this.userid = userInfodata.id;
		this.needShowDialog = this.$gxfmethod.isSF()
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","保养记录列表");
		
	},
	methods: {
		getYMDHMTime(date) {
			let d = '--'
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		//跳入详情页
		goTo(type, item) {
			switch (type) {
				case 'detail':
					uni.navigateTo({
						url: '/devicePages/maintain/maintain-detail?businessNo=' + item.businessNo
					});
					break;
				case 'search':
					if(this.needShowDialog){
						this.showDialog = !this.showDialog
					}else{
						uni.navigateTo({
							url:"/devicePages/repair/create-choose-car?type=maintain"
						})
					}
					break;
				case 'update':
					uni.navigateTo({
						url: '/devicePages/maintain/create-maintain?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
					});
					break;
				default:
					break;
			}
		},
		//获取网络数据
		getNetData() {
			let bDate =  this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
			let eDate = this.$dateUtil.timeFormat(new Date()) + " 23:59:59";
			uni.showLoading();
			let parame = {
				current: this.page, 
			    size: 10 ,
				keyWord: this.searchObj.searchKey,
				servicer:this.searchObj.salesmanValue,
				orgId:this.searchObj.orgValue,
				state:this.searchObj.stateValue,
				beginDate:this.searchObj.startDate ? this.searchObj.startDate : bDate,
				endDate:this.searchObj.endDate ? this.searchObj.endDate : eDate,
				createBeginDate:this.searchObj.createStartDate,
				createEndDate:this.searchObj.createEndDate,
				licenseId: this.licenseId ? this.licenseId : undefined,
			};
			this.$network.getData(this.$url.MAINTAIN_LIST, 'POST', parame).then(result => {
				this.datalist = this.datalist.concat(result.records);
				this.$datestr.printlog(this.datalist.length);
				let pages = result.pages;
				let total = result.total;
				if (pages <= this.page) {
					this.morestatus = 'noMore';
				} else {
					this.morestatus = 'more';
				}
				this.totalCount = result.total.toString()
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}).catch(err => {
				this.morestatus = 'noMore';
				uni.stopPullDownRefresh();
				uni.hideLoading();
			});
		},
		getLevelString(level) {
			if (level != undefined && level != null) {
				if (level === 0) {
					return '首保';
				}
				return level + '级保养'
			}
			return "--"
		},
		goImg(item) {
			console.log(JSON.stringify(item));
			let isedit = this.isuser(item);
			uni.navigateTo({
				url:
					'/components/common/image-upload/upload_zb_apendix?item=' +
					encodeURIComponent(JSON.stringify(item)) +
					'&isedit=' +
					isedit +
					'&type=userapi' +
					'&filetype=maintance'
			});
		},
		isuser(item) {
			if (item.canUploadFile == '0') {
				return false
			} else {
				return true
			}
		},
		exportExcel(){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			let bDate =  this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
			let eDate = this.$dateUtil.timeFormat(new Date()) + " 23:59:59";
			let param = {
				current: 1, 
			    size: this.totalCount ,
				keyWord: this.searchObj.searchKey,
				servicer:this.searchObj.salesmanValue,
				orgId:this.searchObj.orgValue,
				state:this.searchObj.stateValue,
				beginDate:this.searchObj.startDate ? this.searchObj.startDate : bDate,
				endDate:this.searchObj.endDate ? this.searchObj.endDate : eDate,
				createBeginDate:this.searchObj.createStartDate,
				createEndDate:this.searchObj.createEndDate,
			};
			let url= this.$gxfmethod.getUrl(this.$url.MAINTAIN_LIST)
			let filename = this.$gxfmethod.getFileName("设备保养记录-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
		//下拉刷新
		headerrefresh() {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		},
		//上拉加载
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.getNetData();
			this.morestatus = 'loading';
		},
		query(val){
			console.log(val);
			uni.showLoading()
			if(this.searchObj.searchKey != val.searchKey){
				uni.$emit('changelicenId', {
					licenseId: val.searchKey
				});
			}
			this.searchObj = {
				...val
			}
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		},
	}
};
</script>

<style lang="scss" scoped>
.contentbg {
	position: relative;
	height: 100%;
	width: 100%;
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
	z-index: 300;
	background-color: $uni-color-primary;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.top-view{
	z-index: 300;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}
.list-med {
	position: absolute;
	width: 100%;
	top: 100px;
	background: $uni-bg-color-grey;
}

.cell-bg-view {
	position: relative;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 5px;
	margin-top: 5px;
}

.cell-top-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin: 5px 10px;
	align-items: center;
	justify-content: flex-start;
}

.cell-top-image {
	width: 50px;
	font-size: 40px;
}

.item-middle {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 5px 10px 0px 10px;
}

.last-time {
	color: $uni-text-color-disable;
	font-size: $uni-font-size-sm;
}

.arrow-icon {
	font-size: 30px;
	color: $uni-text-color-gray;
}

.item-bottom {
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
	border-top: $uni-line-color 1px solid;
	margin-top: 5px;
}
.option {
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
.icon-car-right{
	display: flex;
	flex: 1;
	flex-direction: column;
	font-size: $uni-font-size-base;
}
.icon-car-right-top{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-top-arrow{
	font-size: 15px;
	margin-left: 10px;
	color: $uni-text-color-gray;
}
.icon-car-right-bottom{
	display: flex;
	margin-top: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 5px;
	justify-content: flex-end;
	align-items: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
.fontgreencolor {
	color: #4cd964;
}
</style>
