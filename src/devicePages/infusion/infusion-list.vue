<template>
	<view class="bg-view"> 
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" v-if="isShowAdd" @click="gotocreat">
			<i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="自喷码/车号" v-model = "keyWord" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
			<view class="export-view-style" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
		</view>
		<list style="margin-top: 50px;">
			<cell v-for="(item,index) in datalist" :key="index">
				<view class="list-view-cell">
					<view class="car-message-view">
						<i class="iconfont icon-car" :class="item.machineDto && cartype[item.machineDto.machineType] ? cartype[item.machineDto.machineType] : typedefault" :style="{ color: item.machineDto && item.machineDto.state == '1' ? '#4EC365' : '#F7AB2F' }">
							
						</i>
						<view class="icon-car-right">
							<view class="icon-car-right-top">
								<text>{{item.machineDto ? item.machineDto.printCode : "--"}}</text>
								<text class="icon-car-right-licenseId">车号:{{item.licenseId || "--"}}</text>
							</view>
							<view class="icon-car-right-bottom">
								{{item.machineDto ? item.machineDto.machineTypeDesc : "--"}}&nbsp;
								|&nbsp;{{item.machineDto ? item.machineDto.machineHeightDesc : "--"}}&nbsp;
								|&nbsp;{{item.machineDto ? item.machineDto.machineTypeName : "--"}}&nbsp;
								|&nbsp;{{item.machineDto ? item.machineDto.machineBrand : "--"}}
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
				    <view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>补液单号</text></view>
							<view class="cell-input-view-right"  style="color: #E60000;" @click="allrecords(item,index)">
								<text class="input-style"  >{{item.businessNo || '--'}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>补液时间</text></view>
							<view class="cell-input-view-right">
								<text class="input-style"  >{{item.startDate || '--'}}</text>
							</view>
						</view>
				    	<view class="cell-input-view">
				    		<view class="cell-input-view-left"><text>补液人</text></view>
				    		<view class="cell-input-view-right">
				    			<text class="input-style"  >{{item.repairter || '--'}}</text>
				    		</view>
				    	</view>
				    	
				    </view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
					<view class="all-records-view" @click="allrecords(item,index)">
						<taskBtn :itemData="item"/>
						<view>
							<text>详情</text>
						</view>
						<i class="iconfont all-records-arrow iconarrow-right"></i>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue'
export default{
	components:{
		uniLoadMore,
		taskBtn
	},
	data(){
		return{
			datalist:[],
			//上拉下拉
			morestatus: 'more',
			page: 1,
			keyWord:'',
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			typedefault:'iconzl--zhibiche1',
			isShowAdd:true,
			isExportList:true,
			totalCount:'100'
		}
	},
	onLoad(){
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_INFUSION_ADD);
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		})
		uni.showLoading();
		this.getNetData()
		uni.$on('refreshData-infusion', userinfo=>{
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		});
		uni.$on('refresh-notification-list', obj => {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		})
	},
	onUnload(){
		uni.$off('refreshData-infusion')
	},
	methods:{
		//全部记录
		allrecords(item,index){
			let url= "./infusion-detail?item=" + encodeURIComponent(JSON.stringify(item));
		    uni.navigateTo({
		    	url:url
		    })
		},
		//搜索
		searchTo(){
		  this.page = 1;
		  this.datalist = [];
		  this.getNetData();
		},
		//创建/devicePages/repair/
		gotocreat(){
			uni.navigateTo({
				url:"/devicePages/repair/create-choose-car?type=infusion"
			})
		},
		//获取数据
		getNetData(){
			let parame = { 
				current: this.page, 
			    size: 20 ,
				keyWord:this.keyWord
			};
			this.$network
				.getData(this.$url.MACHINE_INFUSION_LIST, 'POST', parame)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					let total = result.total;
					if (pages == this.page) {
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
			// let param = {
			// 	keyWord:this.keyWord
			// };
			// let url= this.$url.MAINTAIN_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)
			
			let param = {
				current : 1,
				size : this.totalCount,
				keyWord:this.keyWord
			};
			let url= this.$gxfmethod.getUrl(this.$url.MACHINE_INFUSION_LIST)
			let filename = this.$gxfmethod.getFileName("设备补液记录列表-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
	},
	//下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.datalist = [];
		this.getNetData();
	},
	//上拉加载
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.page += 1;
		this.getNetData();
		this.morestatus = 'loading';
	},
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
	margin-left: 15px;
	margin-right: 15px;
	margin-top: 10px;
	margin-bottom: 10px;
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
	justify-content: space-between;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-licenseId{
	font-size: 12px;
	margin-right: 10px;
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
.all-records-view{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	margin-top: 10px;
	margin-bottom: 10px;
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
.top-search-view{
	position: fixed;
	display: flex;
	flex-direction: row;
	height: 50px;
	width: 100%;
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
	color: #999999;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.filter-view-style{
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
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
.export-view-style{
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	display: flex;
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
	color: $uni-color-primary;
	background: #FFFFFF;
	border: 1px solid $uni-color-primary;
}
</style>
