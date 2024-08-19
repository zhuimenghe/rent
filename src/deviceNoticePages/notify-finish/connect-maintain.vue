<template>
	<view class="contentbg">
		<!-- <view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input 
					style="flex: 1;font-size: 14px;" 
					placeholder="请输入保养单号" 
					v-model="searchKey" 
					/>
				</view>
			</view>
		</view> -->
		<list class="list-med" show-scrollbar="false">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="cell-bg-view">
					<view class="item-middle">
						<view class="tag">保养单号</view>
						<view class="value">{{ item.businessNo || '--' }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养级别</view>
						<view class="value">{{ getLevelString(item.level) }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养人</view>
						<view class="value">{{ item.maintenancePersonName || '' }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养开始时间</view>
						<view class="value">{{ item.operateStartDate || '' }}</view>
					</view>
					<view class="item-middle">
						<view class="tag">保养结束时间</view>
						<view class="value">{{ item.operateEndDate || '' }}</view>
					</view>
					<!-- <view class="item-middle">
						<view class="tag">保养性质</view>
						<view class="value">{{ item.natureName || '' }}</view>
					</view> -->
					<view class="item-bottom">
						<view 
						class="option" 
						style="margin-right: 20px;" 
						@click="goTo('detail', item)">详情</view>
						<view @click="chooseItem(item,index)"  v-if="!FromRecord">
							<mycheckbox
							:disabled="item.disable"
							:checked="item.checked ? item.checked : false"
							class="checkbox"
							color="#E60000;"
							/>
						</view>
					</view>
				</view>
			</cell>
			<cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</cell>
		</list>
		<view style="width: 100%;height: 80px;"  v-if="!FromRecord"/>
		<view class="bottom-container"  v-if="!FromRecord">
			<view class="confirm-btn" @click="bingOrder">确定({{selectArr.length}})</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import numToChinese from '@/common/util/num-to-chinese.js';
export default {
	components: {
		uniLoadMore,
	},
	data() {
		return {
			datalist: [],
			selectArr:[],
			oldList:[],
			morestatus: 'more',
			page: 1,
			licenseKey:'',
			itemDic:{},
			FromRecord:false
		};
	},
	onLoad(option) {
		if(option.type){
			this.FromRecord = option.type == "1" ? true : false
		}
		if(option.item){
			this.itemDic = JSON.parse(decodeURIComponent(option.item))
			this.licenseKey = this.itemDic.licenseId;
			this.oldList = this.itemDic.businessList || []
			this.selectArr = this.itemDic.businessList || []
		}
		uni.showLoading();
		this.getNetData();
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
	methods: {
		//跳入详情页
		goTo(type, item) {
			uni.navigateTo({
				url: '/devicePages/maintain/maintain-detail?businessNo=' + item.businessNo
			});
		},
		//获取网络数据
		getNetData() {
			let parame = {
				current: this.page,
				size: 10,
				keyWord:this.FromRecord ? undefined : this.licenseKey,
				businessNos:this.FromRecord ? this.itemDic.businessNos : undefined
			};
			this.$network
				.getData(this.$url.MAINTAIN_LIST, 'POST', parame)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					if(!this.FromRecord){
						this.dealList();
					}
					let pages = result.pages;
					let total = result.total;
					if (pages == this.page) {
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
		dealList(){
			this.datalist = this.datalist.map((item)=>{
				if(this.selectArr.some((o)=>{ return o.businessNo === item.businessNo })){
					return {
						...item,
						checked : true,
						disable:this.oldList.some((o)=>{ return o.businessNo === item.businessNo })
					}
				}
				return {
					...item,
					checked : false,
					disable:false
				}
			})
		},
		getLevelString(level) {
			if (level === 0) {
				return '首保';
			}
			return numToChinese.getChineseOfNum(level) ? numToChinese.getChineseOfNum(level) + '级保养' : '--';
		},
		chooseItem(item,index){
			if(item.disable){
				return
			}
			let newitem = {
				...item,
				checked:item.checked ? !item.checked : true
			}
			this.datalist.splice(index,1,newitem)
			setTimeout(()=> {
				if(newitem.checked){
					this.Removerepetition(newitem,true)
				}else{
					this.Removerepetition(newitem,false)
				}
			}, 10)
		},
		Removerepetition(item,isremove){
			if(isremove){
				this.selectArr.push(item)
			}else{
				let index = this.selectArr.findIndex((o)=>{
					return o.businessNo === item.businessNo
				})
				this.selectArr.splice(index,1)
			}
		},
		bingOrder(item){
			if(this.selectArr.length === 0){
				uni.showToast({
					title: "请选择需要关联的保养单",
					icon: "none"
				})
				return
			}
			let businessNos = [];
			this.selectArr.forEach(o=>{
				businessNos.push(o.businessNo)
			})
			let param = {
				id:this.itemDic.id,
				businessNos:businessNos.join(','),
			}
			this.$network.getData(this.$url.MACHINE_TODO_CONNECT, 'PUT', param).then(result => {
				uni.showToast({
					title:"关联成功",
					icon: 'none'
				});
				uni.$emit('choose-maintain-emit', {
					list: this.selectArr
				});
				setTimeout(() =>{
					uni.navigateBack({
						animationDuration:100
					})
				}, 500);
			}).catch(err => {
				let message = err.message || ""
				let details = err.details ? err.details[0] : ""
				uni.showToast({
					title: message + "," + details,
					icon: 'none'
				});
			});
		}
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
	z-index: 999;
	background-color: $uni-color-primary;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
	z-index: 100;
	position: fixed;
	top: 0px;
	left: 0px;
	z-index: 999;
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
	justify-content: center;
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

//筛选父视图
.filter-view-style {
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
	color: #ffffff;
}
.checkbox {
	transform: scale(0.7);
	margin-right: 10px;
	margin-bottom: 10px;
}
.list-med {
	position: absolute;
	width: 100%;
	// top: 55px;
	top: 0px;
	background: $uni-bg-color-grey;
}

.cell-bg-view {
	position: relative;
	display: flex;
	flex-direction: column;
	background: #ffffff;
	margin: 10px;
	border-radius: 5px;
}

.cell-top-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin: 10px;
	height: 50px;
	align-items: center;
	justify-content: flex-start;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}

.cell-top-image {
	width: 50px;
	font-size: 40px;
}

.cell-top-medView {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-left: 10px;
	justify-content: flex-start;
}

.cell-top-medView-top {
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
}

.cell-top-medView-bottom {
	display: flex;
	flex: 1;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
}

.cell-top-medView-left {
	flex: 1;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.cell-top-medView-right {
	margin-right: 0px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	margin-right: 10px;
}

.item-middle {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 5px 10px;
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
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin: 0px 10px 4px 10px;
	padding-top: 4px;
	border-width: 1px 0px 0px 0px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}

.option {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
	margin-bottom: 10px;
	font-size: $uni-font-size-base;
	justify-content: center;
	align-items: center;
	color: $uni-color-primary;
}
.bottom-container {
	position: fixed;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	height: 72px;
	width: 100%;
	justify-content: space-between;
}
.confirm-btn {
	flex: 1;
	background-color: $uni-color-primary;
	margin: 16px 16px 16px 8px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	border-radius: 4px;
	font-size: 14px;
}
</style>
