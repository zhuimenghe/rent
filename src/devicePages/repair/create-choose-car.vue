<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入自喷码或者车号" 
					v-model="keyWord" 
					style="flex: 1;font-size: 14px;"
					/>
				</view>
			</view>
			<i class="iconfont scan-icon iconzl--saoma" @click="scanMachine"></i>
		</view>
		<list style="margin-top: 50px;">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="list-view-cell" @click="chooseThisCar(item)">
					<view class="sum-view-bg">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>自喷码</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{ item.printCode || '-' }}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>车号</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{ item.licenseId || '--' }}</text>
							</view>
						</view>
					</view>
					<view style="height: 1px;flex: 1;background: #EEEEEE;" />
				</view>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>
	</view>
</template>
<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
var timer;
export default{
	components:{
		uniLoadMore
	},
	data() {
		return {
			morestatus: 'more',
			page: 1,
			datalist: [],
			keyWord: '',
			type:""
		};
	},
	watch: {
		keyWord: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					this.page = 1;
					this.datalist = [];
					this.getNetData();
				}, 500)
			}
		}
	},
	onLoad(option) {
		this.type = option.type
		uni.showLoading();
		this.getNetData();
	},
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
	methods: {
		//选中设备
		chooseThisCar(item){
			if(this.type == "infusion"){
				let url = "/devicePages/infusion/infusion-create?item=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}else if(this.type == "maintain"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定保养规则后再进行保养",
						icon:"none"
					})
					return
				}
				let url = "/devicePages/maintain/create-maintain?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.redirectTo({
					url:url
				})
			}else if(this.type == "check"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定检修规则后再进行检修",
						icon:"none"
					})
					return
				}
				let url = "/devicePages/hostling/create-service?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.redirectTo({
					url:url
				})
			}else if(this.type == "polling"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定巡检规则后再进行巡检",
						icon:"none"
					})
					return
				}
				let url = "/devicePages/polling/create-polling?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.redirectTo({
					url:url
				})
			}else if(this.type == "battery"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定电池巡检规则后再进行电池巡检",
						icon:"none"
					})
					return
				}
				let url = "/devicePages/battery-polling/create-battery-polling?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.redirectTo({
					url:url
				})
			}else{
				let url = "./create-repair?itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.redirectTo({
					url:url
				})
			}
		},
		//获取数据
		getNetData() {
			let param= {
				current: this.page,
				size: 15,
				keyword: this.keyWord,
			}
			let url = this.$url.MACHINE_RECORD
			if(this.type == "maintain"){
				url = url + "?type=1"
			}else if(this.type == "check"){
				url = url + "?type=2"
			}else if(this.type == "polling"){
				url = url + "?type=3"
			}else if(this.type == "battery"){
				url = url + "?type=4"
			}
			this.$network.getData(url, 'POST', param).then(result => {
				this.datalist = this.datalist.concat(result.records);
				let pages = result.pages;
				let total = result.total;
				if (pages == this.page) {
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
		scanMachine(){
			uni.scanCode({
				success: (res) => {
					let codeResult = res.result;
					let licenseId = this.$datestr.getQueryString('licenseId', codeResult);
					// console.log(licenseId);
					// let param = {
					// 	licenseId:licenseId
					// }
					// this.chooseThisCar(param)
					this.keyWord = licenseId
					// this.page = 1;
					// this.datalist = [];
					// this.getNetData();
				}
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
	display: flex;
	flex: 1;
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
.scan-icon {
	font-size: 24px;
	color: $uni-color-primary;
	margin-right: 16px;
}
</style>
