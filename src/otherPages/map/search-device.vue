<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-search-view">
			<view class="left-btb" @click="changeDic">
				<text>{{selectDic.label}}</text>
				<i class="iconfont icon-cion iconarrow-down"></i>
			</view>
			<view class="search-box" v-if="selectDic.value == '0'">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="自喷码/车号" v-model="keyWordL" style="font-size: 14px;"/>
				</view>
			</view>
			<view class="search-box-add" v-if="selectDic.value == '1'">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入地址" v-model="keyWordA" style="font-size: 14px;"/>
				</view>
			</view>
			<view v-if="selectDic.value=='0'" class="right-btb" @click="searchP">{{"搜索"}}</view>
		</view>
		<!-- <view class="top-search-view-zw">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入地址"/>
				</view>
			</view>
		</view> -->
		<view style="margin-top: 5px;" v-if="selectDic.value == '0'">
			<view v-for="(item, index) in datalist" :key="index">
				<view class="list-view-cell" @click="chooseLicenseId(item,index)">
					<view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left" style="color: #222831;">
								<text>{{item.printCode ? item.printCode : '--'}}</text>
								<text style="margin-left: 5px;margin-right: 5px;">|</text>
								<text>{{item.licenseId ? item.licenseId : '--'}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left">
								<text>{{item.address||"-"}}</text>
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;" />
				</view>
			</view>
		</view>
		<view style="margin-top: 5px;" v-if="selectDic.value == '1'">
			<view v-for="(item, index) in datalist" :key="index" v-if="item.location&&item.location.length>0">
				<view class="list-view-cell" @click="chooseAdress(item,index)">
					<view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left" style="color: #222831;">
								<text>{{item.name}}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left">
								<text>{{item.district}}{{item.address.length>0?item.address:""}}</text>
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;" />
				</view>
			</view>
		</view>
		<w-picker
		:selectList="selectList" 
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
import { debounce } from "@/common/util/util";
var timer;
export default{
	components:{
		uniLoadMore,
		wPicker
	},
	data() {
		return {
			datalist: [],
			keyWordA: '',
			keyWordL:'',
			lactionStr:"",
			selectList:[{"value":'0',"label":'设备'},{"value":'1',"label":'地址'}],
			selectDic:{"value":'0',"label":'设备'}
		};
	},
	watch: {
		keyWordA: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.getNetData();
				}, 500);
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
		searchP() {
			uni.showLoading()
			this.getCheckList()
			
		},
		changeDic(){
			this.$refs.selector.show();
		},
		onConfirm(val){
			this.selectDic = {
				...val.checkArr
			}
		},
		chooseLicenseId(item,index){
			let param = {
				type:'device',
				data:item
			}
			uni.$emit('device-search', param);
			uni.navigateBack({
				delta: 1
			});
		},
		chooseAdress(item,index){
			let param = {
				type:'address',
				data:item
			}
			uni.$emit('device-search', param);
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
				this.datalist = dataDic?.tips;//有的结果没有经纬度 会报错
				uni.hideLoading()
			}).catch(err=>{
				console.log(err)
				uni.hideLoading()
			})
		},700),
		getCheckList(){
			let param = {
				keyword: this.keyWordL
			};
			this.$network.getData(this.$url.DEVICE_MAP_DISTRIBUTION + '?timestamp=' + new Date().getTime(), 'POST', param).then(result => {
					let list = result.map.records.filter(o => {
						return o.authorityStatus == 1;
					});
					let filtterList = list.map(record => {
						let latitude = parseFloat(record.amaplatitudeNum);
						let longitude = parseFloat(record.amaplongitudeNum);
						let m = {
							latitude: latitude,
							longitude: longitude,
							printCode:record.printCode?record.printCode:'--',
							licenseId:record.licenseId?record.licenseId:'--',
							address:record.address?record.address:'--'
						};
						return m;
					});
					this.datalist = [...filtterList];
					uni.hideLoading()
				}).catch(err => {
					this.datalist = [...[]];
					uni.hideLoading()
				});
		}
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
	position: sticky;
	display: flex;
	flex-direction: row;
	padding: 5px 0px;
	width: 100%;
	background: #ffffff;
	justify-content: center;
	align-items: center;
	z-index: 100;
}
.top-search-view-zw{
	position:relative;
	display: flex;
	flex-direction: row;
	padding: 5px 0px;
	width: 100%;
	background: #ffffff;
	justify-content: center;
	align-items: center;
	z-index: 0;
}
.left-btb{
	display: flex;
	flex-direction: row;
	margin-left: 5px;
	padding: 8px 10px;
	color: #999999;
	background: #eeeeee;
	font-size: 14px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-right: #E9E9E9 1px solid;
	align-items: center;
}
.right-btb{
	margin-right: 5px;
	padding: 8px 10px;
	color: #FFFFFF;
	background: #E60000;
	font-size: 14px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	border-left: #E9E9E9 1px solid;
}
.icon-cion{
	margin-left: 5px;
}
.search-box {
	background: #F7F7F7;
	padding: 8px 10px;
	flex: 1;
	display: flex;
	flex-direction: row;
	padding-left: 16px;
	justify-content: flex-start;
	align-items: center;
}
.search-box-add{
	background: #eeeeee;
	padding: 8px 10px;
	flex: 1;
	display: flex;
	flex-direction: row;
	padding-left: 16px;
	justify-content: flex-start;
	align-items: center;
	margin-right: 5px;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
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
