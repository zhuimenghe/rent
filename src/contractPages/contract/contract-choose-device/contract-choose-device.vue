<template>
	<view class="choose-bg-view">
		<view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input style="flex: 1;font-size: 14px;" 
					placeholder="自喷码/车号" 
					v-model="searchKey" 
					/>
				</view>
			</view>
			<!-- <view class="query-more-css" @click="setMore">
				<text>更多</text>
			</view> -->
		</view>
		<!-- <view class="search-container-zw">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input style="flex: 1;font-size: 14px;" 
					placeholder="自喷码/车号" 
					v-model="searchKey" 
					/>
				</view>
			</view>
			<view class="query-more-css" @click="setMore">
				<text>更多</text>
			</view>
		</view> -->
		<list class="list-style">
			<view class="cell-style" v-for="(item, index) in datalist" :key="index" @click="chooseCheck(index,item)">
				<view class="cell-left-view">
					<view class="top-printcolde">
						<text class="text-tag-first">{{item.printCode || '-'}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.licenseId || '-'}}</text>
					</view>
					<view class="top-printcolde">
						<text class="text-tag-seced">{{item.typeName || '-'}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.machineHeightName || '-'}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.machineBrand || '-'}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.machineTypeName || '-'}}</text>
					</view>
					<view class="top-printcolde">
						<text class="text-tag-third">区域:{{item.orgName || '-'}}</text>
					</view>
					<view class="top-printcolde">
						<text class="text-tag-third">当前位置:{{item.address || '-'}}</text>
					</view>
					<view class="top-printcolde">
						<text class="text-tag-third">保险状态:{{item.insuranceStateName || '-'}}</text>
					</view>
					<view class="top-printcolde" v-if="item.lastWorkOutDate&&item.lastWorkOutDate!=null">
						<text class="text-tag-time">设备启用时间必须晚于上次退场时间【{{ changestr(item.lastWorkOutDate) }}】</text>
					</view>
				</view>
				<view class="cell-right-view">
					<mycheckbox 
					:checked="item.checked" 
					:disabled="item.disabled" 
					class="checkbox" 
					color="#E60000" 
					/>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="morestatus" /></view>
		</list>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import timeCompare from '@/common/common-method/common-method.js';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
var timer;
export default {
	components: {
		filterView,
		selectLabelItem,
		uniLoadMore
	},
	watch:{
		searchKey(val) {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				this.page = 1;
				this.datalist = [];
				this.getdata();
			}, 500);
		},
	},
	data() {
		return {
			searchKey:"",
			datalist: [],
			page: 1,
			morestatus:'more',
			chooseList:[],
			enableDate:""
		};
	},
	onLoad(options) {
		uni.showLoading();
		if(options.machineList){
			this.chooseList = JSON.parse(decodeURIComponent(options.machineList));
		}
		if(options.enableDate){
			this.enableDate = options.enableDate
		}
		this.getdata();
	},
	onUnload() {
		
	},
	//下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.datalist = [];
		this.getdata();
	},
	//上拉加载
	onReachBottom() {
		if (this.morestatus == 'noMore') {
			return;
		}
		this.page += 1;
		this.morestatus = 'loading';
		this.getdata();
	},
	methods: {
		changestr(time) {
			if (!time) return '';
			return time.split(/\s+/)[0];
		},
		getdata(typestr, heightstr, machineType, canlist) {
			let param = {
				current: this.page,
				size: 10,
				state: '1',
				keyword: this.searchKey,
			};
			this.$network.getData(this.$url.WORK_IN_CARCHOOSE_NEW, 'POST', param).then(result => {
				let list = result.records;
				this.datalist = this.datalist.concat(list);
				this.dealList();
				let pages = result.pages;
				if (pages <= this.page) {
					this.morestatus = 'noMore';
				} else {
					this.morestatus = 'more';
				}
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}).catch(err => {
				this.datalist = [];
				this.morestatus = 'noMore';
				uni.stopPullDownRefresh();
				uni.hideLoading();
			});
		},
		dealList() {
			this.datalist = this.datalist.map((item) => {
				if (this.chooseList.some((o) => {return o.licenseId === item.licenseId})) {
					return {
						...item,
						checked: true,
						disabled:this.canChoose(item)
					}
				}
				return {
					...item,
					checked: false,
					disabled:this.canChoose(item)
				}
			})
		},
		canChoose(item){
			if(this.enableDate != ""){
				if(item.lastWorkOutDate && timeCompare.timedifferent(this.enableDate, this.changestr(item.lastWorkOutDate)) != 1){
					return true
				}
				return false
			}
			return false
		},
		chooseCheck(index, item) {
			if(item.disabled){
				return
			}
			this.datalist[index].checked = !this.datalist[index].checked;
			setTimeout(() => {
				if (this.datalist[index].checked) {
					this.Removerepetition(this.datalist[index], true)
				} else {
					this.Removerepetition(this.datalist[index], false)
				}
			}, 10);
		},
		Removerepetition(item, isremove) {
			if (isremove) {
				let newitem = {
					...item,
				}
				this.chooseList.push(newitem)
			} else {
				let index = this.chooseList.findIndex((o) => {
					return o.licenseId === item.licenseId
				})
				this.chooseList.splice(index, 1)
			}
		},
		setMore(){
			
		},
		//确定按钮
		clicksave() {
			uni.$emit('choose-simple-device',this.chooseList)
			uni.navigateBack({
				animationDuration:200
			})
		},
		clickecancle(){
			uni.navigateBack({
				animationDuration:200
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
	display: flex;
	flex-direction: column;
	width: 100%;
	flex: 1;
	background: $uni-bg-color-grey;
}

.list-style {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	height: 45px;
	font-size: $uni-font-size-base;
}

.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
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

.cell-style {
	display: flex;
	flex-direction: row;
	border-bottom-color: $uni-line-color;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	margin-left: 10px;
	margin-right: 10px;
	background: #ffffff;
	padding-bottom: 15px;
	border-radius: 10px;
	margin-top: 5px;
}
.top-printcolde{
	margin-top: 10px;
	display: flex;
	flex-direction: row;
	padding: 0px 10px;
	align-items: center;
}
.text-tag-first{
	font-size: 16px;
	color: $uni-text-color;
}
.text-tag-seced{
	font-size: 13px;
	color: $uni-text-color-gray;
}
.text-tag-third{
	font-size: 14px;
	color: $uni-text-color;
}
.text-tag-time{
	font-size: 10px;
	color: #F5222D; 
	padding: 5px;
}
.text-tag-line{
	font-size: 13px;
	color: $uni-text-color-gray;
	margin-left: 5px;
	margin-right: 5px;
}
.cell-left-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.cell-right-view {
	display: flex;
	width: 50px;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}
.cell-view-part {
	display: flex;
	flex-direction: row;
	background: #ffffff;
	margin: 5px 10px;
	justify-content: space-between;
}

.title-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color-gray;
}

.checkbox {
	transform: scale(0.8);
}

.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
}

.bottom-left-view {
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

.bottom-right-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
.search-container {
	position: sticky;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
	z-index: 300;
}
.search-container-zw {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
	z-index: 0;
}
.search-box {
	background: #F7F7F7;
	flex: 1;
	display: flex;
	margin: 8px 10px;
	flex-direction: row;
	padding:8px 5px;
	border-radius: 4px;
	justify-content: flex-start;
	align-items: center;
}
.search-icon {
	color: #999999;
	font-size: $uni-font-size-base;
	margin-right: 5px;
}

.search-content {
	display: flex;
	flex: 1;
	color: #999999;
	font-size: $uni-font-size-base;
	margin-left: 5px;
	margin-right: 10px;
}
.query-more-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding:7px 15px;
	background: #FFFFFF;
	border: 1px solid  $uni-color-primary;
	border-radius: 4px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
}
</style>
