<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<list>
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
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;"/>
				    <view class="sum-view-bg">
						<view class="cell-input-view" @click="gotoDetail(item)">
							<view class="cell-input-view-left"><text>维修单号</text></view>
							<view class="cell-input-view-right">
								<text class="input-style" style="color: #E60000;" >{{item.businessNo || '--'}}</text>
							</view>
							<i class="iconfont icon-car-right-top-arrow iconarrow-right" style="color: #E60000;" ></i>
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
					<view class="all-records-view" @click="change(index, item)" >
						<view>
							<mycheckbox
							:checked="item.checked" 
							class="checkbox" 
							color="#E60000" 
							/>
						</view>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
		<view style="height: 80px;width: 100%;"/>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="gotocreat"><text>新增</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
export default{
	components:{
		uniLoadMore
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
			carDic:{},
			indexnum:""
		}
	},
	onLoad(option){
		this.carDic = JSON.parse(decodeURIComponent(option.item))
		this.indexnum = option.index
		uni.showLoading();
		this.getNetData()
		uni.$on('refreshData-repair', userinfo=>{
			this.page = 1;
			this.datalist = [];
			this.getNetData();
		});
	},
	onUnload(){
		uni.$off('refreshData-repair')
	},
	methods:{
		//全部记录
		gotoDetail(item){
			let url= "/devicePages/repair/repair-detail?item=" + encodeURIComponent(JSON.stringify(item));
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
				url:"/devicePages/repair/create-repair?choose=1&item=" + encodeURIComponent(JSON.stringify(this.carDic))
			})
		},
		//保存
		clicksave(){
			let list = this.datalist.filter((item)=>{
				return item.checked;
			})
			console.log(JSON.stringify(list))
			uni.$emit('choose-repair', {
				data:list,
				index:this.indexnum
			});
			uni.navigateBack({
				delta: 1,
				animationDuration: 200
			});
		},
		//获取数据
		getNetData(){
			let parame = { 
				current: this.page, 
			    size: 10 ,
				keyWord:this.carDic.licenseId
			};
			this.$network
				.getData(this.$url.MACHINE_REPAIR_LIST, 'POST', parame)
				.then(result => {
					this.dealChooseItem(result.records)
					let pages = result.pages;
					let total = result.total;
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		dealChooseItem(list){
			let oldlist = this.carDic.repairIdList || [];
			let pushlist = list.map(o => {
				if(oldlist.indexOf(o.businessNo) > -1){
					return {
						...o,
						checked: true
					};
				}
				return {
					...o,
					checked: false
				};
			});
			this.datalist = this.datalist.concat(pushlist);
		},
		change(index, item){
			console.log('33333333');
			let dict = {
				... this.datalist[index],
				checked:!this.datalist[index].checked,
			};
			this.datalist[index] = dict;
			this.datalist = this.datalist.map((o)=>{
				return {
					...o
				}
			})
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
	height: 35px;
	width: 60px;
	display: flex;
	background: #eeeeee;
	font-size: 15px;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
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
.checkbox {
	transform: scale(0.8);
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.bottom-view{
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	z-index: 100;
}
.bottom-left-view{
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}
.bottom-right-view{
	display: flex;
	flex: 1;
    height: 40px;
    border-radius: 20px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #FFFFFF;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
