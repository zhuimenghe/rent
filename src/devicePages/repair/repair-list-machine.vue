<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" v-if="isShowAdd" @click="gotocreat">
			<i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-view">
			<view class="top-search-view">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="自喷码/车号" v-model = "keyWord" />
					</view>
				</view>
			</view>
		</view>
		<list style="margin-top: 94px;">
			<cell v-for="(item,index) in datalist" :key="index">
				<view class="list-view-cell">
					<view class="car-message-view">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view class="car-message-view">
								<i class="iconfont icon-car" :class="cartype[item.machineDto.deviceType] || typedefault" :style="{ color: item.machineDto && item.machineDto.state == '1' ? '#4EC365' : '#F7AB2F' }">
									
								</i>
								<view class="icon-car-right">
									<view class="icon-car-right-top">
										<text style="margin-right: 5px;">{{item.machineDto&&item.machineDto.printCode ?item.machineDto.printCode: "--"}}</text>|<text style="margin-left: 5px;">{{item.machineDto&&item.machineDto.licenseId ?item.machineDto.licenseId: "--"}}</text>
									</view>
									<view class="icon-car-right-bottom">
										<text>{{ item.machineDto.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ item.machineDto.machineHeightDesc || '--' }}&nbsp;|&nbsp;{{ item.machineDto.machineBrand || '--' }}&nbsp;|&nbsp;{{item.machineDto.machineTypeName || '--'}}</text>
									</view>
								</view>
							</view>
							<view class="cell-input-view">
								<view class="cell-input-view-left"><text>维修状态</text></view>
								<view class="cell-input-view-right">
									<text class="input-style" >{{item.repairStateName || "--"}}</text>
								</view>
							</view>
							<view class="cell-input-view">
								<view class="cell-input-view-left"><text>维修次数</text></view>
								<view class="cell-input-view-right">
									<view class="cell-input-view-right"  style="color: #E60000;" @click="finishrepair(item)">
										<text class="input-style" >{{item.repairCount || '0'}}次</text>
										<i class="iconfont cellrightImg iconarrow-right"></i>
									</view>
								</view>
							</view>
							<view class="cell-input-view">
								<view class="cell-input-view-left"><text>最近一次维修单号</text></view>
								<view class="cell-input-view-right"  style="color: #E60000;" @click="allrecords(item)">
									<text class="input-style" >{{item.businessNo || '--'}}</text>
									<i class="iconfont cellrightImg iconarrow-right"></i>
								</view>
							</view>
						</view>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
		<deviceView :showDialog='showDialog' type='repair'/>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue'
import taskBtn from '@/common/common-method/task_common_btn.vue'
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import deviceView from '@/components/common/common-ui/device-add-view.vue'
let timer;
export default{
	components:{
		uniLoadMore,
		badgeview,
		taskBtn,
		uniPopup,
		deviceView
	},
	data(){
		return{
			datalist:[],
			//上拉下拉
			morestatus: 'more',
			currentpage: 1,
			keyWord:'',
			//设备类型
			cartype: {
				'1':'iconzl--jianchache1',//高空车
				'2': 'iconwaji1', //挖掘机
				'3': 'iconlixianchache1', //叉车
				'4': 'iconkuangche11', //矿车
				'5': 'iconzhuangzaiji11' //装
			},
			typedefault:'iconzl--jianchache1',
			userid:"",
			isShowAdd:true,
			isExportList:true,
			totalCount:'100',
			dialogData:{},
			showDialog:false,
			needShowDialog:true
		}
	},
	watch: {
		keyWord: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					uni.showLoading()
					this.keyWord = val;
					this.currentpage = 1;
					this.datalist = [];
					this.getNetData();
				}, 500)
			}
		}
	},
	created(){
		uni.showLoading();
		this.getNetData()
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_REPAIR_ADD);
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		})
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: (res) => {
				this.userid = res.data.id;
			}
		});
		this.needShowDialog = this.$gxfmethod.isSF()
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","设备维修列表");
		
	},
	methods:{
		getYMDHMTime(date) {
			let d = '--'
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		headerrefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.getNetData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.getNetData();
		},
		//搜索
		searchTo(){
		  this.currentpage = 1;
		  this.datalist = [];
		  this.getNetData();
		},
		//创建
		gotocreat(){
			if(this.needShowDialog){
				this.showDialog = !this.showDialog
			}else{
				uni.navigateTo({
					url:"./create-choose-car?type=repair"
				})
			}
		},
		expendArrow(item, index) {
			this.datalist.splice(index, 1, {
				...item,
				expandArrow: !item.expandArrow
			})
		},
		allrecords(item,index){
			let url= "./repair-detail?item=" + encodeURIComponent(JSON.stringify(item));
		    uni.navigateTo({
		    	url:url
		    })
		},
		//获取数据
		getNetData(){
			let parame = { 
				current: this.currentpage, 
			    size: 10 ,
				keyWord:this.keyWord
			};
			this.$network
				.getData(this.$url.MACHINE_REPAIR_MACHINELIST, 'POST', parame)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					let total = result.total;
					this.totalCount = result.total.toString()
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totalCount = result.total.toString()
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
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
			let param = {
				keyWord: this.keyWord,
				current : 1,
				size : this.totalCount
			};
			let url= this.$gxfmethod.getUrl(this.$url.MACHINE_REPAIR_LIST)
			let filename = this.$gxfmethod.getFileName("设备维修记录-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
		finishrepair(item){
			uni.$emit('refreshData-repair-list', {
				item: item
			});
			// this.dialogData = {
			// 	...item
			// }
			// this.$refs.repairDialog.open()
		},
		cancelDialog(){
			this.$refs.repairDialog.close()
		},
		confirmDialog(){
			if(!this.dialogData.startDate || this.dialogData.startDate === ""){
				uni.showToast({
					title: '请选择开始时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if(!this.dialogData.endDate || this.dialogData.endDate === ""){
				uni.showToast({
					title: '请选择结束时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if(!this.dialogData.repairHour || this.dialogData.repairHour === ""){
				uni.showToast({
					title: '请输入维修时长',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			uni.showLoading();
			this.$network.getData(this.$url.MACHINE_REPAIR_FINISH, 'PUT', this.dialogData).then(result => {
				this.headerrefresh();
				this.$refs.repairDialog.close()
				uni.hideLoading();
			}).catch(err => {
				let message = err.message || ""
				let details = err.details ? err.details[0] : ""
				uni.showToast({
					title: message + "," + details,
					icon: 'none'
				});
			});
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
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-left: 10px;
	margin-right: 10px;
	// margin-top: 10px;
	// margin-bottom: 10px;
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
	margin-left: 15px;
	margin-right: 15px;
	margin-bottom: 10px;
	background: #ffffff;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 5px;
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
	margin-left: 15px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.all-records-view{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	margin-top: 5px;
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
.top-search-view{
	position: fixed;
	display: flex;
	flex-direction: row;
	width: 100%;
	top: 44px;
	left: 0px;
	background: #FFFFFF;
	justify-content: center;
	align-items: center;
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
}
.filter-view-style{
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
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 5px;
	justify-content: flex-end;
	align-items: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
.item-customdetail {
	font-size: $uni-font-size-lg;
	align-items: center;
	justify-content: flex-end;
	margin-right: 5px;
}
.head-contract-s-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding-left: 20px;
	padding-right: 10px;
}
.subback {
	background: $uni-bg-color-grey;	
}

.line-s-white {
	margin-top: 10px;
	margin-bottom: 5px;
	height: 1px;
	background: #FFFFFF;
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
</style>
