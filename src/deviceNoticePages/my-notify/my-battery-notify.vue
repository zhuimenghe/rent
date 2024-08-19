<template>
	<view class="content">
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input 
						style="flex: 1;font-size: 14px;" 
						placeholder="车号/自喷码" 
						v-model="searchKey" 
						/>
					</view>
				</view>
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input 
						style="flex: 1;font-size: 14px;" 
						placeholder="任务单号" 
						v-model="businessSearch" 
						/>
					</view>
				</view>
				<view class="btnstyle" @click="gotoOther('filter')">
					<text>筛选</text>
				</view>
				<view class="btnstyle-export" @click="gotoOther('export')" v-if="deviceExport">
					<text>导出</text>
				</view>
			</view>
			<view class="bottom-search" v-if="showfileter">
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
				<view class="bottom-search-top">
					<label-arrow
					style="flex: 1;"
					:value="orgDic.label" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('org')"
					/>
					<label-arrow
					style="margin-left: 30px;flex: 1;"
					:value="stateDic.label" 
					arrowColor="#999999" 
					textColor="#222831" 
					textSize="14" 
					arrowSize="14" 
					@clickLabel="showpick('state')"
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
						<view class="cell-text-left fontsubcolor">
							<view class="item-head"  v-if="item.task">
								<view class="head-top">
									<text style="margin-right: 5px;">{{ item.task.printCode || '--' }}</text>|<text style="margin-left: 5px;">{{ item.task.licenseId || '--' }}</text>
								</view>
								<view class="head-bottom">
									<text>{{ item.task.machineTypeDesc || '--' }}</text>
									|
									<text class="item-text">{{ item.task.heightName || '--' }}</text>
									|
									<text class="item-text">{{ item.task.brand || '--' }}</text>
									|
									<text class="item-text">{{ item.task.machineTypeName || '--' }}</text>
								</view>
							</view>
						</view>
						<view class="cell-text-right fontBlackcolor"  style="color: #E60000;">
							<text>{{item.todoState == '-1' ? item.task.stateName : item.todoStateName}}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>任务单号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.taskNo || '--' }}</text>
						</view>
					</view>
					<view class="cell-text" @click="gotoDetail(item)">
						<view class="cell-text-left fontsubcolor"><text>合同名称</text></view>
						<view class="cell-text-right fontBlackcolor" style="color: #E60000;">
							<text>{{ item.task.customerName || '--' }}-{{ item.task.projectName || '--' }}</text>
						</view>
						<i class="iconfont cellrightImg iconarrow-right"></i>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>电池信息</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.task.batteryInfo || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>巡检规则</text></view>
						<view class="cell-text-right">
							<text>{{ item.task.ruleName || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>巡检等级</text></view>
						<view class="cell-text-right">
							<text>{{ getLevelString(item.task.level) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>开始日期</text></view>
						<view class="cell-text-right">
							<text>{{ $gxfmethod.getYMDHMTime(item.task.genTime) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>截止日期</text></view>
						<view class="cell-text-right" :style="{'color': item.task.isOverTime ? '#FF0000' : '#111111'}">
							<text>{{$gxfmethod.getYMDHMTime(item.endDate) || '--' }}</text>
						</view>
					</view>
					<view class="cell-text" v-if="item.todoState !='-1'">
						<view class="cell-text-left fontsubcolor"><text>任务备注</text></view>
						<view class="cell-text-right">
							<text>{{item.task ? (item.task.remark ? item.task.remark : '--') : '--' }}</text>
						</view>
					</view>
					<view class="cell-text" v-if="item.state == '5'">
						<view class="cell-text-left fontsubcolor"><text>备注</text></view>
						<view class="cell-text-right">
							<text>{{item.closeRemark || '--' }}</text>
						</view>
					</view>
					<view class="line-s" />
					<view class="cell-text">
						<view class="cell-text-right" style="color: #E60000;">
							<text @click="gotoOther('project',item)" >巡检项目</text>
							<text v-if="item.todoState =='6'"  @click="gotoOther('add',item)" style="margin-left: 10px;">新增巡检单</text>
							<text v-if="item.todoState =='6'"  @click="gotoOther('connect',item)" style="margin-left: 10px;">关联巡检单</text>
							<text v-if="item.todoState =='-1' || item.todoState =='1'"  @click="gotoOther('gettask',item)" style="margin-left: 10px;">领取</text>
							<text v-if="item.todoState =='-1' || item.todoState =='6'" @click="gotoOther('close',item)" style="margin-left: 10px;">关闭</text>
						</view>
					</view>
				</cell>
				<cell><uni-load-more iconType="auto" :status="morestatus" /></cell>
			</list>
		</view>
		<view class="pop-container">
			<uni-popup ref="devicedialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title">任务领取</view>
					<view class="row-item">
						<view class="row-tag"><text>巡检人</text><text style="color: #FF0000;">*</text></view>
						<view class="input-style">
							<text>{{dialogData.userNameList || '请选择保养人'}}</text>
						</view>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
						<text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
					</view>
				</view>
			</uni-popup>
		</view>
		<view class="pop-container">
			<uni-popup ref="tipslog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title">提示</view>
					<view class="row-item">
						<text>关闭操作将该任务置成已完成，请确认</text>
					</view>
					<view class="row-item-remark">
						<textarea
						class="textarea" 
						placeholder="请输入备注" 
						v-model="remarkIn"
						/>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button pop-cancel" @click="cancelRDialog">取消</text>
						<text class="uni-tip-button pop-confirm" @click="confirmRDialog">确定</text>
					</view>
				</view>
			</uni-popup>
		</view>
		<taskcreateservice :showDialog='showDialog' @clickevent='clickevent'/>
		<w-picker 
		:mode="dateType" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="false" 
		ref="date" 
		themeColor="#E60000" 
		/>
		<w-picker 
		:selectList="selectList"
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import taskcreateservice from '@/components/common/uni-popup/task-create-service'

let timer;
export default {
	components: {
		uniLoadMore,
		wPicker,
		labelArrow,
		uniPopup,
		taskcreateservice
	},
	props:{
		orgObj:{
			type:Object,
			default:null
		},
		stateDict:{
			type:Object,
			default:null
		}
	},
	data() {
		return {
			currentpage: 1,
			datalist: [],
			dateType:"date",
			morestatus: 'more',
			searchKey: '',
			businessSearch:"",
			startDate:'开始时间',
			endDate:'结束时间',
			selectType:"",
			selectList:[],
			dialogData:{},
			showfileter:false,
			deviceExport:false,
			remarkIn:'',
			closeItem:{},
			//区域筛选
			orgDic:{},
			orgList:[],
			showDialog:false,
			chooseItem:{},
			isThree:false,
			stateDic:{value:'',label:'全部'},
			stateArr:[{value:'',label:'全部'},
			          {value:'-1',label:'待领取'},
			          {value:'1',label:'已下发待领取'}],
			stateTArr:[{value:'',label:'全部'},
			          {value:'-1',label:'待领取'},
					  {value:'1',label:'已下发待领取'},
			          {value:'6',label:'已领取待处理'}]
		};
	},
	mounted() {
		uni.showLoading();
		let url = this.$url.MACHINE_ISWAIT_COUNT + "inspection_show_todo";
		this.$network.getData(url, 'GET', null).then(result => {
			this.isThree = result.value?result.value:false
		}).catch(err => {
			
		});
		this.loadAreaList();
		if(this.stateDict){
			this.stateDic = {
				...this.stateDict
			};
		}
		if(this.orgObj){
			this.orgDic = {
				...this.orgObj
			};
			this.loaddata();
		}else{
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.orgDic = {
						label:this.$gxfmethod.getorgName(res.data),
						value:res.data.orgId,
					};
					this.loaddata();
				},
				fail:error=>{
					this.loaddata();
				}
			});
		}
		
		uni.$on('choose-polling-emit', obj => {
			uni.showLoading();
			this.headerrefresh();
		});
		uni.$on('refresh-polling', obj => {
			uni.showLoading();
			this.headerrefresh();
		})
	},
	created() {
	},
	watch: {
		searchKey: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
			}
		},
		businessSearch: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.currentpage = 1;
					this.datalist = [];
					this.loaddata();
				}, 500);
			
			}
		},
	},
	methods: {
		loadAreaList() {
			uni.showLoading();
			let urlstr = this.$url.ORG_LIST;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					let list = result;
					this.orgList = [{
						label: '全部',
						value: ''
					}]
					this.orgList = this.orgList.concat(this.getChildren(list));
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getChildren(data) {
			let arr = [];
			if (data) {
				data.forEach(o => {
					let a = {
						value: o.id,
						label: o.name,
						children: o.children
					};
					arr = [...arr, a];
					if (o.children && o.children.length > 0) {
						arr = [...arr, ...this.getChildren(o.children)];
					}
				});
			}
			return arr;
		},
		getLevelString(level) {
			if (level != undefined && level != null) {
				return level + '级巡检'
			}
			return "--"
		},
		gotoDetail(item){
			uni.navigateTo({
				url: '/contractPages/contract/contract-detail?businessNo=' + item.task.contractNo
			});
		},
		clickevent(val){
			console.log(val.isLocal);
			this.showDialog = false
			if(val.isLocal == '1'){
				uni.navigateTo({
					url:"/devicePages/battery-polling/create-battery-polling?isLocal=1&rwitem=" + encodeURIComponent(JSON.stringify(this.chooseItem))
				})
			}else if(val.isLocal == '2'){
				uni.navigateTo({
					url:"/devicePages/battery-polling/create-battery-polling?rwitem=" + encodeURIComponent(JSON.stringify(this.chooseItem))
				})
			}
		},
		gotoOther(type,item){
			if(type === 'add'){
				if(this.$gxfmethod.isSF()){
					this.chooseItem = {
						...item
					}
					this.showDialog = !this.showDialog
				}else{
					uni.navigateTo({
						url:"/devicePages/battery-polling/create-battery-polling?rwitem=" + encodeURIComponent(JSON.stringify(item))
					})
				}
			}else if(type === 'connect'){
				uni.navigateTo({
					url:"../notify-finish/connect-battery-polling?item=" + encodeURIComponent(JSON.stringify(item))
				})
			}else if(type === 'filter'){
				this.showfileter = !this.showfileter;
			}else if(type === 'gettask'){
				uni.getStorage({
					key: this.$savekey.USER_INFO_MEG,
					success: res => {
						this.dialogData = {
							...this.dialogData,
							todoState:item.todoState,
							"userIdList":res.data.id,
							"userNameList":res.data.username,
							machineRemindIds:item.id,
							// deadlineTime:this.$gxfmethod.getNextDays(this.$gxfmethod.getSystemDays())
						}
						// this.$refs.devicedialog.open()
						uni.showModal({
							title: '提示',
							content: '确定领取该任务?',
							success: res => {
								if (res.confirm) {
									this.confirmDialog();
								}
							}
						});
					}
				});
			}else if(type === 'project'){
				uni.navigateTo({
					url:"./rules-levels-list?levelId=" + item.task.levelId
				})
			}else if(type === 'close'){
				this.closeItem = {
					...item
				}
				this.remarkIn = "";
				this.$refs.tipslog.open()
			}
		},
		cancelDialog() {
			this.$refs.devicedialog.close()
		},
		confirmDialog() {
			uni.showLoading()
			this.dialogData = {
				...this.dialogData,
				"type":'todo'
			}
			let url = this.$url.MACHINE_SEND_USER;
			if(this.dialogData.todoState != '-1'){
				url = this.$url.MACHINE_TAST_TODOR;
			}
			this.$network.getData(url, 'POST', this.dialogData).then(result => {
				uni.showToast({
					title:"任务领取成功",
					icon: 'none'
				});
				setTimeout(() =>{
					this.cancelDialog()	
					this.headerrefresh()
				}, 500);
			}).catch(err => {
				let message = err.message || ""
				let details = err.details ? err.details[0] : ""
				uni.showToast({
					title: message + "," + details,
					icon: 'none'
				});
			});
		},
		getDate(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
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
				type:'1',
				noticeType:'20',
				current: this.currentpage,
				size: 5,
				keyword: this.searchKey,
				businessNo:this.businessSearch,
				startTime:this.startDate == '开始时间' ? undefined : (this.startDate + " 00:00:00"),
				endTime:this.endDate == '结束时间' ? undefined : (this.endDate + " 23:59:59"),
				orgIds:this.orgDic.value == "" ? undefined : [this.orgDic.value],
				taskState:this.stateDic.value == "" ? undefined : this.stateDic.value,
			};
			this.$network
				.getData(this.$url.MACHINE_TODO_PAGE, 'POST', param)
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
				}).catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		clearsum(){
			this.startDate = "开始时间";
			this.endDate = "结束时间";
			this.searchKey = '';
			this.businessSearch = ""
			this.stateDic = {
				value:'',
				label:'全部'
			}
			let res = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
			if (res) {
				this.orgDic = {
					label:this.$gxfmethod.getorgName(res),
					value:res.orgId,
				};
			}
			uni.showLoading()
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		oksum(){
			uni.showLoading()
			this.showfileter = false;
			this.currentpage = 1;
			this.datalist = [];
			this.loaddata();
		},
		showpick(type) {
			this.selectType = type
			if(type === 'org'){
				this.selectList = [...this.orgList]
				this.$refs.selector.show();
			}else if(type === 'state'){
				if(!this.isThree){
					this.selectList = [...this.stateArr]
				}else{
					this.selectList = [...this.stateTArr]
				}
				this.$refs.selector.show();
			}else{
				this.$refs.date.show();
			}
		},
		onConfirm(val) {
			if(this.selectType === "start"){
				this.startDate = val.result
			}else if(this.selectType === "end"){
				this.endDate = val.result
			}else if(this.selectType === "endline"){
				this.dialogData = {
					...this.dialogData,
					deadlineTime:val.result + this.$gxfmethod.dateHHMMSS()
				}
			}else if(this.selectType == "org"){
				this.orgDic = {
					...val.checkArr
				}
			}else if(this.selectType == "state"){
				this.stateDic = {
					...val.checkArr
				}
			}
		},
		cancelRDialog() {
			this.$refs.tipslog.close()
		},
		confirmRDialog() {
			if(this.closeItem.todoState == '-1'){
				//关闭
				uni.showLoading()
				let param = {
					businessNo:this.closeItem.task.businessNo,
					closeRemark:this.remarkIn,
					type:"todo"
				};	
				this.$network.getData(this.$url.MACHINE_MENU_CLOSE_LY, 'GET', param).then(result => {
					uni.showToast({
						title:"任务关闭成功",
						icon: 'none'
					});
					setTimeout(() =>{
						this.cancelRDialog()	
						this.headerrefresh()
					}, 500);
				}).catch(err => {
					let message = err.message || ""
					let details = err.details ? err.details[0] : ""
					uni.showToast({
						title: message + "," + details,
						icon: 'none'
					});
				});
			}else{
				//关闭
				uni.showLoading()
				let param = {
					id:this.closeItem.id,
					closeRemark:this.remarkIn,
					type:"todo"
				};	
				this.$network.getData(this.$url.MACHINE_MENU_CLOSE_WAIT, 'GET', param).then(result => {
					uni.showToast({
						title:"任务关闭成功",
						icon: 'none'
					});
					setTimeout(() =>{
						this.cancelRDialog()	
						this.headerrefresh()
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
		},
		exportList(){
			// uni.showLoading({
			// 	title:'正在下载中,请稍等...',
			// 	mask:true,
			// })
			// let param = {
			// 	isUnionContract:true,
			// 	keyword:this.searchKey != "" ? this.searchKey : undefined,
			// 	orgId : this.orgDic.value != "" ? this.orgDic.value : undefined
			// }
			// let url = this.$url.BASE_URL + "settleapi/api/receivable/machine/account/export";
			// console.log(url)
			// let filename = this.$gxfmethod.getFileName('设备营收统计-')
			// console.log(filename)
		},
	},
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	background: #FFFFFF;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

//搜索框
.top-view {
	z-index: 100;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	z-index: 100;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #FFFFFF;
}
.search-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	margin-bottom: 1px;
	width: 100%;
}
.filter-view-style {
	display: flex;
	background: #eeeeee;
	align-items: center;
	justify-content: center;
	height: 40px;
	padding-left: 10px;
	padding-right: 10px;
	margin-right: 10px;
	border-radius: 5px;
	color: #E60000;
	font-size: $uni-font-size-sm;
}
.search-box {
	background: #F7F7F7;
	flex: 1;
	display: flex;
	margin: 5px;
	padding: 8px 10px;
	flex-direction: row;
	padding-left: 10px;
	border-radius: 5px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
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
.btnstyle{
	display: flex;
	margin: 5px;
	padding: 8px 10px;
	flex-direction: row;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
	color: #222222;
	font-size: $uni-font-size-base;
}
//列表的subview
.list-sub-view {
	padding-bottom:env(safe-area-inset-bottom);
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 100px;
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
	border-radius: 10px;
	padding: 5px 5px 10px 5px;
}

.item-head {
	display: flex;
	flex-direction: column;
}

.head-top {
	display: flex;
	flex-direction: row;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
}

.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-bottom: 4px;
	margin-top: 4px;
}

.item-text {
	margin-right: 2px;
	margin-left: 2px;
}

.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin-top: 5px;
	justify-content: center;
}

.cell-text-left {
	display: flex;
	min-width: 50px;
	margin-left: 10px;
	justify-content: flex-start;
	// align-items: center;
	font-size: $uni-font-size-base;
}

.cell-text-right {
	display: flex;
	flex: 1;
	margin-left: 5px;
	margin-right: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}

.fontBlackcolor {
	color: $uni-text-color;
}

.line-s {
	margin-top: 5px;
	margin-bottom: 5px;
	height: 1px;
	background: #eeeeee;
}

.fontsubcolor {
	color: $uni-text-color-gray;
	font-weight: normal;
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
.cellrightImg {
	font-size: $uni-font-size-base;
	margin-left: 5px;
	color: $uni-color-primary;
	text-align: center;
}
.pop-container {
		position: relative;
	}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
}

.tip-title {
	padding: 10px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
}

.row-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px 0px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
}
.col-item {
	display: flex;
	margin-top: 5px;
	flex-direction: column;
	align-items: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.row-tag {
	width: 98px;
	text-align: left;
}
.input-style {
	display: flex;
	flex: 1;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	justify-content: flex-end;
}
.text-style{
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	height: 45px;
	width: calc(100% - 15px );
	margin-top: 8px;
}
.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;
	font-size: $uni-font-size-base;
}
.pop-cancel {
	margin-right: 8px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}
.pop-confirm {
	color: #FFFFFF;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
.row-item-remark {
	display: flex;
	flex-direction: column;
	padding: 10px 0px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
}
.textarea {
	background-color: #f7f8f9;
	border-radius: 4px;
	width: 285px;
	height: 72px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	padding: 8px;
}
</style>
