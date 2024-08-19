<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="gotocreat">
			<i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入自喷码或者设备号" v-model = "keyWord" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
		</view>
		<list style="margin-top: 50px;">
			<cell v-for="(item,index) in datalist" :key="index">
				<view class="list-view-cell">
					<view class="car-message-view">
						<i class="iconfont icon-car" :class="cartype[item.machineDto.machineType] || typedefault" :style="{ color: item.machineDto.state == '1' ? '#4EC365' : '#F7AB2F' }">
							
						</i>
						<view class="icon-car-right">
							<view class="icon-car-right-top">
								<view>
									<text>{{item.machineDto.licenseId || "--"}}</text>
								</view>
								<i class="iconfont icon-car-right-top-arrow iconarrow-right"></i>
							</view>
							<view class="icon-car-right-bottom">
								<text>型号:{{item.machineDto.machineTypeName ||"--"}}  |  自喷码:{{item.machineDto.printCode || "-"}}</text>
							</view>
						</view>
						<view class="cell-text-right">
							<text>{{item.stateName || "--"}}</text>
						</view>
						<badgeview
						:num='item.fileList ? item.fileList.length : 0' 
						@addPic="goImg(item)" 
						/>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
				    <view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>维修单号</text></view>
							<view class="cell-input-view-right"  style="color: #E60000;" @click="allrecords(item,index)">
								<text class="input-style"  >{{item.businessNo || '--'}}</text>
							</view>
						</view>
				    	<view class="cell-input-view">
				    		<view class="cell-input-view-left"><text>维修人</text></view>
				    		<view class="cell-input-view-right">
				    			<text class="input-style"  >{{item.repairter || '--'}}</text>
				    		</view>
				    	</view>
				    	<view class="cell-input-view">
				    		<view class="cell-input-view-left"><text>维修性质</text></view>
				    		<view class="cell-input-view-right">
				    			<text class="input-style"  >{{item.natureName || '--'}}</text>
				    		</view>
				    	</view>
				    	<view class="cell-input-view"> 
				    		<view class="cell-input-view-left"><text>维修时间</text></view>
				    		<view class="cell-input-view-right">
				    			<text class="input-style"  >{{item.startDate || '--'}}</text>
				    		</view>
				    	</view>
				    </view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
					<view class="all-records-view" @click="allrecords(item,index)">
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
import badgeview from '@/components/common/image-upload/badge-icon.vue'

export default{
	components:{
		uniLoadMore,
		badgeview
	},
	data(){
		return{
			datalist:[],
			//上拉下拉
			morestatus: 'more',
			page: 1,
			keyWord:'',
			//设备类型
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			typedefault:'iconzl--zhibiche1',
			userid:""
		}
	},
	onLoad(){
		uni.showLoading();
		this.getNetData()
		uni.$on('refreshData-repair', userinfo=>{
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		});
		uni.$on('refresh-contract-list', usnerinfo => {
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		})
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: (res) => {
				this.userid = res.data.id;
			}
		});
	},
	onUnload(){
		uni.$off('refreshData-repair')
	},
	methods:{
		//全部记录
		allrecords(item,index){
			let url= "./repair-detail?item=" + encodeURIComponent(JSON.stringify(item));
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
		//创建
		gotocreat(){
			uni.navigateTo({
				url:"./create-choose-car"
			})
		},
		goImg(item) {
			console.log(JSON.stringify(item));
			let isedit = this.isuser(item)
			uni.navigateTo({
				url: "../../../../components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
					"&isedit=" + isedit + "&type=userapi" + "&filetype=repair" 
			})
		},
		isuser(item) {
			if (item.createBy === this.userid) {
				return true
			} else {
				return false
			}
		
		},
		//获取数据
		getNetData(){
			let parame = { 
				current: this.page, 
			    size: 10 ,
				keyWord:this.keyWord
			};
			this.$network
				.getData(this.$url.MACHINE_REPAIR_LIST, 'POST', parame)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					let total = result.total;
					if (pages <= this.page) {
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
		}
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
		this.morestatus = 'loading';
		this.getNetData();
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
	z-index: 993;
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
	z-index: 991;
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
	height: 35px;
	width: 60px;
	display: flex;
	background: #eeeeee;
	font-size: 15px;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
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
</style>
