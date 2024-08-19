<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input style="flex: 1;font-size: 14px;" placeholder="请输入自喷码/车号" v-model="searchKey" />
					</view>
				</view>
				<!-- <view class="filter-view-style" @click="filtrateMenu">
					<text>筛选</text>
				</view> -->
				<view class="filter-view-style" @click="exportExcel" v-if="isExportList">
					<text>导出</text>
				</view>
			</view>
			<view class="bottom-search" v-if="showfilter">
				<view class="bottom-search-top">
					<label-arrow
					style="flex: 1;"
					:value="startDate" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('start')"
					/>
					<label-arrow
					style="margin-left: 30px;flex: 1;"
					:value="endDate" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('end')"
					/>	
				</view>
				<view class="condition-btn">
					<view class="clear btn" @click="clearsum">清除</view>
					<view class="confirm btn" @click="oksum">查询</view>
				</view>	
			</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontBlackcolor" style="color: #000000;">
							<view style="display: flex;flex: 1;flex-direction: column;">
								<view>
									<text>检修单号:{{ item.businessNo || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontgreencolor">
							<text>{{ item.stateName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>车号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.licenseId || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>自喷码</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.printCode || '-' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修类型</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.storageLeasedType === '2' ? '在租检修' : '入库检修' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修状态</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text  :style="{color:item.checkOk ? '#4EC365' : '#FC0D2F'}">{{ item.checkOk ? "检修正常" : '检修异常' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>退场时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.workOutTime || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修时间</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.checkTime || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>检修人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.checkUserName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>业务负责人</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.customerSalesmanName || '--' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="t-bottom">
						<!-- <view class="cell-text-right fontdetailcolor"
						@click="goItemCheck(item)"  v-if="!item.checkOk">异常项</view>
						<view class="cell-text-right fontdetailcolor"
						@click="gotorepair(item)"  v-if="!item.checkOk && item.state === '4' && repairBindShow">关联维修</view>
						<view class="cell-text-right fontdetailcolor"
						@click="gothough(item)" v-if="!item.checkOk && item.state === '4' && !item.passed && checkRepairPassShow">检修通过</view> 
						<view class="cell-text-right fontdetailcolor"
						@click="dealBusiness(item)" v-if="!item.prepare && item.state === '4' && prepareAddShow && item.checkOk">整备</view> -->
						<!-- <view class="cell-text-right fontdetailcolor"
						@click="gotodush(item)" v-if="item.state === '0' && isShowAdd ">修改</view> -->
						<taskBtn :itemData="item"/>
						<view class="cell-text-right fontdetailcolor" 
						@click="gotodetal(item)">详情</view>
					</view>
				</cell>
				<view><uni-load-more iconType="auto" :status="morestatus" /></view>
			</list>
		</view>
		<w-picker
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="true" 
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import filterView from '@/components/common/common-ui/filter-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue'
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
var timer;
export default {
	components: {
		filterView,
		uniLoadMore,
		taskBtn,
		wPicker,
		labelArrow
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			searchKey: '',
			prepareAddShow:true,
			checkRepairPassShow:true,
			repairBindShow:true,
			isShowAdd:true,
			downloadTask:null,
			startDate:'开始时间',
			endDate:'结束时间',
			selectType:"",
			showfilter:false,
			isExportList:true,
			totalCount:'100'
		};
	},
	watch: {
		searchKey: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					uni.showLoading()
					this.searchKey = val;
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500)
			}
		}
	},
	mounted() {
		uni.showLoading();
		this.loaddata();
	},
	created() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_STOCK_ADD)
				this.prepareAddShow = res.data.some(x => x.value === this.$savekey.PERMISSION_PREPARE_ADD)
				this.checkRepairPassShow = res.data.some(x => x.value === this.$savekey.PERMISSION_PREPARE_THOUGH)
				this.repairBindShow = res.data.some(x => x.value === this.$savekey.PERMISSION_REPAIRBING);
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		})
		uni.$on('choose-repair', userinfo => {
			console.log(JSON.stringify(userinfo))
			let list = userinfo.data;
			let index = Number(userinfo.index);
			console.log(index)
			let orderList = [];
			list.map((o)=>{
				orderList.push(o.businessNo)
			})
			let idstr = this.datalist[index].id
			this.savebing(orderList,idstr);
		});
	},
	methods: {
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		headerrefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.loaddata();
		},
		loaddata() {
			let param = {
				current: this.currentpage,
				size: 10,
				keyword: this.searchKey,
				startTime: this.startDate === "开始时间" ? undefined : (this.startDate + " 00:00:00"),
				endTime: this.endDate === "结束时间" ? undefined : (this.endDate + " 23:59:59"),
			};
			this.$network
				.getData(this.$url.STOCK_SERVICE_LIST, 'POST', param)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
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
		//关联检修单
		gotorepair(item,index){
			uni.navigateTo({
				url:"./choose-repair?item=" + encodeURIComponent(JSON.stringify(item)) + "&index=" + index
			})
		},
		savebing(orderList,idstr){
			uni.showLoading()
			let param = {
				id: idstr,
				repairIdList: orderList
			};
			this.$network
				.getData(this.$url.BANDING_CARLIST_REPAIR, 'PUT', param)
				.then(result => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				})
				.catch(err => {});
		},
		//通过
		gothough(item) {
			uni.showModal({
				title: '提示',
				content: '确定检修通过?',
				success: res => {
					if (res.confirm) {
						this.checkCar(item)					
					}
				}
			});
		},
		checkCar(item){
			uni.showLoading()
			let url = this.$url.BANDING_CARLIST_PASS + item.id;
			this.$network
				.getData(url, 'PUT', null)
				.then(result => {
					uni.showToast({
						title: '已检修通过',
						icon: 'none'
					});
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				})
				.catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		//caogao
		gotodush(item){
			uni.navigateTo({
				url: './create-service?item=' + encodeURIComponent(JSON.stringify(item)) + "&backType=2"
			});
		},
		//异常项
		goItemCheck(item) {
			uni.navigateTo({
				url:"./abnormal-item-list?list=" + encodeURIComponent(JSON.stringify(item.abnormalList))
			})
		},
		//整备车辆
		dealBusiness(item) {
			uni.showModal({
				title: '提示',
				content: '确定是否整备车辆?',
				success: res => {
					if (res.confirm) {
						this.prepareCar(item);					
					}
				}
			});
		},
		prepareCar(item){
			let savedic = {
				businessNo:item.businessNo
			}
			let url = this.$url.FINISH_SERVIECE_ADD;
			this.$network
				.getData(url, 'POST', savedic)
				.then(result => {
					uni.showToast({
						title: '整备成功',
						icon: 'none'
					});
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				})
				.catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		//详情
		gotodetal(item) {
			let url = '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		},
		//---------------------
		exportExcel(item){
			// let param = {
			// 	keyword: this.searchKey
			// };
			// let url= this.$url.STOCK_SERVICE_LIST + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)
			let param = {
				keyword: this.keyWord,
				current : 1,
				size : this.totalCount
			};
			let url= this.$gxfmethod.getUrl(this.$url.STOCK_SERVICE_LIST)
			let filename = this.$gxfmethod.getFileName("设备检修记录列表-")
			this.$gxfmethod.downFunc(url,'POST',param,filename)
		},
		filtrateMenu(){
			this.showfilter = !this.showfilter
		},
		clearsum(){
			this.startDate = '开始时间'
			this.endDate = '结束时间'
			this.searchKey = ''
			uni.showLoading()
			this.showfilter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		oksum(){
			uni.showLoading()
			this.showfilter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		showpick(t){
			this.selectType = t;
			this.$refs.date.show()
		},
		onConfirm(val){
			if(this.selectType === "start"){
				this.startDate =  val.result;
			}else if(this.selectType === "end"){
				this.endDate =  val.result;
			}
		},
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.list-bg {
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	background: $uni-bg-color-grey;
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
	background-color: $uni-color-primary;
}
.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}
.top-view{
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}
//搜索框
.search-container {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
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
	margin-right: 10px;
}
//筛选父视图
.filter-view-style{
	height: 35px;
	width: 60px;
	display: flex;
	background: #FFFFFF;
	font-size: $uni-font-size-base;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	z-index: 955;
	border: 1px solid $uni-color-primary;
	color: $uni-color-primary;
}
//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 99px;
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
	flex: 1;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
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
.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
}
.fontsubcolor {
	color: $uni-text-color-gray;
}
.filter-container {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 299;
	background: #FFFFFF;
}
.condition-tag {
	color: $uni-text-color-gray;
	font-size: $uni-font-size-lg;
	margin-left: 20px;
}

.condition-select {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding-top: 8px;
	padding-bottom: 8px;
	margin: 15px 20px 15px 20px;
	align-items: center;
}

.bottom-search{
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 5px 0px;
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
.t-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

</style>
