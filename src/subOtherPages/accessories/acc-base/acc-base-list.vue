<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" 
						placeholder="配件型号/名称/类别" 
						v-model="searchKey" 
						/>
					</view>
				</view>
				<view class="add-style" @click="createBase" v-if="showBaseicAdd">
					<i class="iconfont labelstyle iconadd"></i>
				</view>
			</view>
			<view class="line-s" />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-top-bg">
						<view class="cell-top-left">{{ item.modelName || "--"}}</view>
						<view class="cell-top-right">
							<text>{{ item.category || '--' }}</text>
							<text style="margin-left: 5px;margin-right: 5px;">|</text>
							<text>{{ item.name || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>适用范围</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.scopeApplication || "--"}}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>备注</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.remark || "--"}}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="bottom-line-bg">
						<view class="bottom-line-left" @click="updataList(item,'updata')">修改</view>
						<view class="bottom-line-right" @click="updataList(item,'delete')">删除</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
let timer;
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			righticon:"iconarrow-right",
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey:"",
			showBaseicAdd:true
		};
	},
	onLoad(option) {
		uni.showLoading();
		this.loaddata();
		let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		if(resData){
			this.showBaseicAdd = resData.some(x => x.value === this.$savekey.PERMISSION_PARTBASE_ADD);
		}
		uni.$on('refresh-acc-base-list', usnerinfo => {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		});
	},
	onUnload() {
		uni.$off('refresh-acc-base-list');
	},
	watch: {
		searchKey: {
			handler(val) {
				if(timer){
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
	onPullDownRefresh() {
		this.currentpage = 1;
		this.datalist = [];
		this.loaddata();
	},
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.currentpage += 1;
		this.morestatus = 'loading';
		this.loaddata();
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url:'/subOtherPages/accessories/acc-base/create-acc-base'
		})
	},
	methods: {
		createBase(){
			uni.navigateTo({
				url:'/subOtherPages/accessories/acc-base/create-acc-base'
			})
		},
		loaddata() {
			let param = {
				current: this.currentpage,
				size: 10,
				likeName: this.searchKey,
			};
			this.$network
				.getData(this.$url.ACC_BASE_LIST, 'POST', param)
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
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		updataList(item,type){
			if(type == 'delete'){
				this.changeData('此操作将永久删除该数据, 是否继续?',item);
			}else if(type == 'updata'){
				uni.navigateTo({
					url:'/subOtherPages/accessories/acc-base/create-acc-base?item=' + encodeURIComponent(JSON.stringify(item)) 
				})
			}
		},
		changeData(msg,item){
			uni.showModal({
				title: '提示',
				content: msg,
				success: res => {
					if (res.cancel) {} else {
						this.deleteItem(item)
					}
				}
			});
		},
		deleteItem(item){
			uni.showLoading();
			let deleteUrl = this.$url.ACC_BASE_LIST_DELETE + item.id
			this.$network.getData(deleteUrl, 'DELETE', null).then(result => {
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			}).catch(err => {
				uni.showToast({
					title: err.message + "," + err.details[0],
					icon: 'none'
				});
			});
		},
	}
};
</script>
<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
//搜索框
.top-view {
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 0;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}
.bottom-search{
	display: flex;
	flex-direction: column;
	width: 100%;
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
.search-box {
	background: #F7F7F7;
	padding: 10px;
	flex: 1;
	display: flex;
	margin: 8px;
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
	margin-right: 10px;
}
.add-style{
	display: flex;
	width: 30px;
	height: 30px;
	background: $uni-color-primary;
	border-radius:50%;
	color: #FFFFFF;
	margin-right: 10px;
	align-items: center;
	justify-content: center;
}
//筛选父视图
.filter-view-style {
	height: 35px;
	display: flex;
	background: #eeeeee;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 55px;
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
	padding: 10px 0px 0px 0px;
	border-radius: 10px;
}
.cell-top-bg{
	display: flex;
	flex-direction: row;
	padding:3px 10px;
	align-items: center;
	justify-content: flex-start;
}
.cell-top-left{
	flex: 1;
	font-size: 14px;
	color: #222831;
}
.cell-top-right{
	margin-left: 10px;
	font-size: 12px;
	color: #999999;
}
.cell-text {
	display: flex;
	flex: 1;
	padding:3px 10px;
	flex-direction: row;
	justify-content: center;
}
.cell-text-left {
	display: flex;
	min-width: 60px;
	justify-content: flex-start;
	align-items: center;
	font-size: 14px;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: 14px;
}
.fontBlackcolor {
	color: $uni-text-color;
}
.fontdetailcolor {
	color: $uni-color-primary;
	margin-bottom: 10px;
}
.fontgreencolor {
	color: #4cd964;
}
.cell-bottom-right {
	display: flex;
	margin-right: 15px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
}
.fontsubcolor{
	color: $uni-text-color-gray;
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
.bottom-line-bg{
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
}
.bottom-line-left{
	font-size: 14px;
	color: $uni-color-primary;
}
.bottom-line-right{
	margin-left: 20px;
	font-size: 14px;
	color: #FF0000;
}
.labelstyle {
	color: #ffffff;
	font-size: 20px;
	font-weight: bold;
}
</style>
