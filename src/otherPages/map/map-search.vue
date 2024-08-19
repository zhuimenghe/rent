<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入地址" v-model="keyWord" focus auto-focus/>
				</view>
			</view>
			<!-- <view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view> -->
		</view>
		<view style="margin-top: 50px;">
			<view v-for="(item, index) in datalist" :key="index">
				<view class="list-view-cell" @click="chooseAdress(item,index)">
					<view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left" style="color: #222831;">
								<text>{{item.name}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left">
								<text>{{item.district}}{{item.address}}</text>
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;" />
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import { debounce } from "@/common/util/util";
export default{
	components:{
		uniLoadMore
	},
	data() {
		return {
			datalist: [],
			keyWord: '',
			lactionStr:"",
		};
	},
	watch: {
		keyWord: {
			handler(val) {
				this.$datestr.printlog(val);
				this.getNetData();
			}
		}
	},
	onLoad(option) {
		uni.getLocation({
			type: 'gcj02',
			success: (res)=>{
				this.lactionStr = res.longitude.toString() + ',' + res.latitude.toString()
			}
		});
	},
	methods: {
		//搜索
		searchTo() {
			this.datalist = [];
			this.getNetData();
		},
		chooseAdress(item,index){
			uni.$emit('getaddressWithSearch', {
				item:item,
			});
			uni.navigateBack({
				delta: 1
			});
		},
		//获取数据
		getNetData: debounce(function(){
			uni.showLoading();
			this.$network.inputTips({
				keywords: this.keyWord,
				location:this.lactionStr
			}).then(res=>{
				let dataDic = res;
				this.datalist = dataDic?.tips.filter(t=>t.location.length);//有的结果没有经纬度 会报错
				uni.hideLoading()
			}).catch(err=>{
				console.log(err)
				uni.hideLoading()
			})
		},700) 
		
	},
};
</script>

<style lang="scss" scoped>
.bg-view {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.list-view-cell {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #ffffff;
	border-bottom-style: solid;
	margin-top: 5px;
	margin-bottom: 5px;
	border-bottom-color: #eeeeee;
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
.icon-car {
	font-size: 40px;
}
.icon-car-right {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.icon-car-right-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-top-arrow {
	font-size: 15px;
	margin-left: 10px;
	color: $uni-text-color-gray;
}
.icon-car-right-bottom {
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
.all-records-view {
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
.all-records-arrow {
	font-size: 15px;
	margin-left: 10px;
	color: $uni-color-primary;
}
.top-search-view {
	position: fixed;
	display: flex;
	flex-direction: row;
	height: 50px;
	width: 100%;
	background: #ffffff;
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
.filter-view-style {
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
</style>
