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
			</view>
			<view class="line-s" />
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view @click="chooseCheck(index,item)">
						<partHeadView :dataDic="item"/>
						<view class="cell-text">
							<view class="cell-text-left fontsubcolor"><text>适用范围</text></view>
							<view class="cell-text-right fontBlackcolor">
								<text>{{ item.scopeApplication || "--"}}</text>
							</view>
						</view>
						<view class="line-s" />
						<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
							<view class="cell-bottom-right fontdetailcolor">
								<mycheckbox
								:disabled="!item.stockTotal || item.stockTotal <= 0"
								:checked="item.checked" 
								class="checkbox" 
								/>
							</view>
						</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
		<view style="width: 100%;height: 80px;"/>
		<view class="bottom-container">
			<view class="confirm-btn" @click="oprationCar">{{ '确定' }}（{{ selectArr.length }}）</view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import mycheckbox from '@/components/common/check-box/check-box.vue';
import partHeadView from '../part-components/part-head-view.vue';
let timer;
export default {
	components: {
		uniLoadMore,
		mycheckbox,
		partHeadView
	},
	data() {
		return {
			righticon:"iconarrow-right",
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey:"",
			selectArr:[],
			orgId:""
		};
	},
	mounted() {
	},
	onLoad(option) {
		this.selectArr = JSON.parse(decodeURIComponent(option.list))
		this.orgId = option.orgId
		uni.showLoading();
		this.loaddata();
		
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
	methods: {
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		loaddata() {
			let param = {
				current: this.currentpage,
				size: 10,
				orgId:this.orgId,
				likeName: this.searchKey?this.searchKey:undefined,
			};
			this.$network
				.getData(this.$url.ACC_INVENTORY_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.dealList();
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
				if(this.selectArr.some((o)=>{ return o.itemNumber === item.itemNumber })){
					return {
						...item,
						checked : true
					}
				}
				return {
					...item,
					checked : false
				}
			})
		},
		chooseCheck(index,item){
			if(!item.stockTotal || item.stockTotal <= 0){
				return
			}
			this.datalist[index].checked = !this.datalist[index].checked;
			setTimeout(()=> {
				if(this.datalist[index].checked){
					this.Removerepetition(this.datalist[index],true)
				}else{
					this.Removerepetition(this.datalist[index],false)
				}
			}, 10);
		},
		Removerepetition(item,isremove){
			if(isremove){
				let newitem = {
					...item,
					partsBasics:item,
					partsNumber:'0',
					partsAmount:"0"
				}
				this.selectArr.push(newitem)
			}else{
				let index = this.selectArr.findIndex((o)=>{
					return o.itemNumber === item.itemNumber
				})
				this.selectArr.splice(index,1)
			}
		},
		oprationCar(){
			uni.$emit('choose-acc-emit', {
				list: this.selectArr
			});
			uni.navigateBack({
				animationDuration:100
			})
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
	height: 35px;
	flex: 1;
	line-height: 35px;
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
//筛选父视图
.filter-view-style {
	height: 35px;
	display: flex;
	background: #F7F7F7;
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
}
.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
}
.cell-text-left {
	display: flex;
	min-width: 50px;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-right: 15px;
	margin-left: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
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
	margin-top: 5px;
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
.checkbox {
	transform: scale(0.8);
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
