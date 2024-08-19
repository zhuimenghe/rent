<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" v-if="isShowAdd&&showHeader" @click="gotocreat">
			<i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-view" v-if="showHeader">
			<searchHeader
			type="xj"
			:keyword="searchString"
			:isExportList='isExportList' 
			:isControlMore="true"
			:isQueryOrg="true" 
			:isSSN="true" 
			:isQueryState="true" 
			:isQueryTime="true" 
			:isQueryCreate="true" 
			:isQueryRepair="true"
			@query="query"
			@exportExcel="exportExcel"
			/>
		</view>
		<list :style="{'margin-top':showHeader?'94px':'8px'}">
			<cell v-for="(item,index) in datalist" :key="index">
				<view class="list-view-cell">
					<view class="car-message-view">
						<view class="icon-car-right" style="color: #E60000;" @click="allrecords(item,index)">
							<text>{{item.businessNo || "--"}}</text>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{item.stateName || "--"}}</text>
						</view>
						<!-- <badgeview
						:num='item.fileList ? item.fileList.length : 0' 
						@addPic="goImg(item)" 
						/> -->
					</view>
				    <view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>区域</text></view>
							<view class="cell-input-view-right">
								<text class="input-style" >{{item.orgName ? item.orgName : "--"}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>自喷码</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{item.machineDto && item.machineDto.printCode ? item.machineDto.printCode : "--"}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>车号</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{item.licenseId || "--"}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>巡检开始时间</text></view>
							<view class="cell-input-view-right">
								<text class="input-style"  >{{getYMDHMTime(item.startDate) || '--'}}</text>
							</view>
						</view>
						<view class="cell-input-view"> 
							<view class="cell-input-view-left"><text>巡检结束时间</text></view>
							<view class="cell-input-view-right">
								<text class="input-style"  >{{getYMDHMTime(item.endDate) || '--'}}</text>
							</view>
						</view>
				    	<view class="cell-input-view">
				    		<view class="cell-input-view-left"><text>巡检工时</text></view>
				    		<view class="cell-input-view-right">
								<text class="input-style">{{ $datestr.doubleFloat(item.checkDuration) || "--"}}小时</text>
				    		</view>
				    	</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>巡检级别</text></view>
							<view class="cell-input-view-right">
								<text class="input-style"  >{{getLevelString(item.level)}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>巡检人</text></view>
							<view class="cell-input-view-right">
								<text class="input-style"  >{{item.checkUserName || '--'}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>巡检状态</text></view>
							<view class="cell-input-view-right">
								<text class="input-style" :style="{ color: item.checkOk == true ? '#4EC365' : '#FC0D2F' }">{{item.checkOk ? "巡检正常" : '巡检异常'}}</text>
							</view>
						</view>
						<view class="cell-input-view" v-if="!item.checkOk">
							<view class="cell-input-view-left"><text>异常项数量</text></view>
							<view class="cell-input-view-right"  style="color: #E60000;" @click="goabitem(item)">
								<text class="input-style"  >{{getNum(item)}}</text>
								<i class="iconfont cellrightImg iconarrow-right"></i>
							</view>
						</view>
						<view class="cell-input-view" v-if="!item.checkOk">
							<view class="cell-input-view-left"><text>是否需要维修</text></view>
							<view class="cell-input-view-right" style="justify-content: flex-end;">
								<mycheckbox
								:disabled="true"
								style="transform: scale(0.8);justify-content: flex-end;"
								color="#E60000" 
								:checked="item.needRepair == '1'" 
								/>
							</view>
						</view>
						<view class="cell-input-view" style="margin: 0px;" v-if="!item.checkOk && item.needRepair == '1'" @click="gotoDetail(item)">
							<view style="display: flex;flex: 1;">
								<view class="cell-input-view">
									<view class="cell-input-view-left"><text>维修单号</text></view>
									<view class="cell-input-view-right" :style="{ color: item.repairNo ? '#E60000' : '#000000' }">
										<text class="input-style">{{item.repairNo || "--"}}</text>
									</view>
								</view>
							</view>
							<view style="color: #E60000;margin-right: 10px;margin-left: 10px;" v-if="item.repairNo">
								<i class="iconfont cellrightImg iconarrow-right"></i>
							</view>
							<view style="color: #E60000;margin-right: 10px;margin-left: 10px;" v-else @click="gotoCreateRepair(item)">
								<text>新增</text>
							</view>
						</view>
				    </view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
					<view class="bottom-btns-class">
						<view style="display: flex;flex: 1;justify-content: flex-start;">
							<badgeBottom
							:num='item.fileList ? item.fileList.length : 0' 
							@addPic="goImg(item)" 
							/>
						</view>
						<view class="all-records-view" @click="finishrepair(item,index)" v-if="item.inspectAgain">
							<text>再次巡检</text>
						</view>
						<taskBtn :itemData="item"/>
						<view
						class="all-records-view" 
						@click="editCreate(item)"
						v-if="ishowupdata(item)">修改</view>
						<view class="all-records-view" @click="allrecords(item,index)">
							<text>详情</text>
						</view>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
		<deviceView :showDialog='showDialog' type='polling'/>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue'
import taskBtn from '@/common/common-method/task_common_btn.vue'
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import numToChinese from '@/common/util/num-to-chinese.js';
import deviceView from '@/components/common/common-ui/device-add-view.vue'
import searchHeader from '@/components/common/common-ui/device-query-record.vue'

let timer;
export default{
	components:{
		uniLoadMore,
		badgeview,
		taskBtn,
		uniPopup,
		wPicker,
		labelArrow,
		deviceView,
		searchHeader
	},
	data(){
		return{
			datalist:[],
			//上拉下拉
			morestatus: 'more',
			page: 1,
			userid:"",
			isShowAdd:true,
			isExportList:true,
			totalCount:'100',
			showDialog:false,
			needShowDialog:true,
			searchObj:{}
		}
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
	created(){
		if(this.searchString == ""){
			uni.showLoading();
			this.getNetData()
		}
		let userPdata = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		this.isShowAdd = userPdata.some(x => x.value === this.$savekey.PERMISSION_MACHINE_POLLING_ADD);
		let userInfodata = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
		this.userid = userInfodata.id;
		this.needShowDialog = this.$gxfmethod.isSF()
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","巡检记录列表");
	},
	methods:{
		getNum(item){
			let list = item.rulesProjects || [];
			let i = 0;
			list.forEach(o=>{
				let rulesProjectContents = o.rulesProjectContents || [];
				rulesProjectContents.forEach(e=>{
					if(e.checked == false){
						i = i + 1;
					}
				})
			})
			console.log(i);
			return i;
		},
		goabitem(item){
			let url= "/devicePages/hostling/abnormal-item-list?type=xj&item=" + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url:url
			})
		},
		gotoDetail(item){
			// repairNo
			if(item.repairNo){
				let param = {
					businessNo : item.repairNo
				}
				let url= "/devicePages/repair/repair-detail?item=" + encodeURIComponent(JSON.stringify(param));
				uni.navigateTo({
					url:url
				})
			}
		},
		gotoCreateRepair(item){
			// 新增维修单
			uni.navigateTo({
				url:"/devicePages/repair/create-repair?xjitem=" + encodeURIComponent(JSON.stringify(item))
			})
		},
		ishowupdata(item){
			return  this.iscreator(item) && (item.state === '0' || item.state === '3')
		},
		getYMDHMTime(date) {
			let d = '--'
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		getLevelString(level) {
			if (level != undefined && level != null) {
				return level + '级巡检'
				// return numToChinese.getChineseOfNum(level) ? numToChinese.getChineseOfNum(level) + "级巡检" : '--'
			}
			return "--"
		},
		iscreator(item) {
			if (item.createBy === this.userid) {
				return true
			} else {
				return false
			}
		},
		editCreate(item){
			uni.navigateTo({
				url: './create-polling?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		refreshList(item){
			setTimeout(()=>{
				uni.showLoading()
				this.keyWord = item.licenseId
				this.page = 1;
				this.datalist = [];
				this.getNetData();
			}, 100);
		},
		headerrefresh() {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.morestatus = 'loading';
			this.getNetData();
		},
		finishrepair(item,index){
			console.log(JSON.stringify(item));
			let itemDic = {
				...item.machineDto
			}
			let url = "/devicePages/polling/create-polling?agginitem=" + encodeURIComponent(JSON.stringify(itemDic));
			uni.navigateTo({
				url:url
			})
		},
		allrecords(item,index){
			let url= "/devicePages/polling/polling-detail?businessNo=" + item.businessNo;
		    uni.navigateTo({
		    	url:url
		    })
		},
		//创建
		gotocreat(){
			if(this.needShowDialog){
				this.showDialog = !this.showDialog
			}else{
				uni.navigateTo({
					url:"/devicePages/repair/create-choose-car?type=polling"
				})
			}
		},
		goImg(item) {
			let isedit = this.isuser(item)
			uni.navigateTo({
				url: "/components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
					"&isedit=" + isedit + "&type=userapi" + "&filetype=inspection" 
			})
		},
		isuser(item) {
			if (item.canUploadFile == '0') {
				return false
			} else {
				return true
			}
		},
		//获取数据
		getNetData(){
			let bDate =  this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
			let eDate = this.$dateUtil.timeFormat(new Date()) + " 23:59:59";
			let parame = { 
				current: this.page, 
			    size: 10 ,
				keyWord: this.searchObj.searchKey,
				servicer:this.searchObj.salesmanValue,
				orgId:this.searchObj.orgValue,
				state:this.searchObj.stateValue,
				checkOk: this.searchObj.taskState,
				beginDate:this.searchObj.startDate ? this.searchObj.startDate : bDate,
				endDate:this.searchObj.endDate ? this.searchObj.endDate : eDate,
				createBeginDate:this.searchObj.createStartDate,
				createEndDate:this.searchObj.createEndDate,
				licenseId: this.licenseId ? this.licenseId : undefined,
			};
			this.$network.getData(this.$url.MACHINE_POLLING_LIST, 'POST', parame).then(result => {
				this.datalist = this.datalist.concat(result.records);
				let pages = result.pages;
				let total = result.total;
				this.totalCount = result.total.toString()
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
		exportExcel(){
			uni.showLoading({
				title:'正在下载中,请稍等...',
				mask:true,
			})
			let bDate =  this.$dateUtil.getFirstDayOfYear(new Date()) + " 00:00:00";
			let eDate = this.$dateUtil.timeFormat(new Date()) + " 23:59:59";
			let param = { 
				current: 1, 
			    size : this.totalCount,
				keyWord: this.searchObj.searchKey,
				servicer:this.searchObj.salesmanValue,
				orgId:this.searchObj.orgValue,
				state:this.searchObj.stateValue,
				checkOk: this.searchObj.taskState,
				beginDate:this.searchObj.startDate ? this.searchObj.startDate : bDate,
				endDate:this.searchObj.endDate ? this.searchObj.endDate : eDate,
				createBeginDate:this.searchObj.createStartDate,
				createEndDate:this.searchObj.createEndDate
			};
			let url= this.$gxfmethod.getUrl(this.$url.MACHINE_POLLING_LIST)
			let filename = this.$gxfmethod.getFileName("设备巡检记录列表-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
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
}
</script>

<style lang="scss" scoped>
.bg-view{
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.list-view-cell{
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #FFFFFF;
	border-bottom-style: solid;
	margin-top: 5px;
	margin-bottom: 5px;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
}
.car-message-view {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-left: 10px;
	margin-right: 10px;
	margin-top: 5px;
	margin-bottom: 5px;
	font-size: $uni-font-size-base;
}
.icon-car{
	font-size: 40px;
}
.icon-car-right{
	display: flex;
	flex: 1;
	flex-direction: column;
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
.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	background: #ffffff;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-top: 5px;
	font-size: $uni-font-size-base;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.bottom-btns-class{
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
}
.all-records-view{
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
.all-records-arrow{
	font-size: 15px;
	margin-left: 10px;
	color: $uni-color-primary;
}
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
	z-index: 999;
	background-color: $uni-color-primary;
}
.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}
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
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 5px;
	justify-content: flex-end;
	align-items: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
.pop-container {
	position: relative;
}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
}

.tip-title {
	padding: 10px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
}

.row-item {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin: 10px 5px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.row-tag {
	width: 98px;
	text-align: left;
	padding-top: 7px;
	padding-bottom: 7px;
}

.toast-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding-top: 7px;
	padding-bottom: 7px;
	flex: 1;
	text-align:right;
}

.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;
	font-size: $uni-font-size-base;
}

.pop-cancel {
	margin-right: 8px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}

.pop-confirm {
	color: #ffffff;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
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
.fontgreencolor {
	color: #4cd964;
}
</style>
