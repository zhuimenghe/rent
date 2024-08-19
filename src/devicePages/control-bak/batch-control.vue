<template>
	<view class="content">
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="自喷码/车号" v-model="keyWord" /></view>
			</view> 
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
		</view>
		<view class="list-container">
			<list class="list-view">
				<cell v-for="(d, i) in deviceList" :key="i" :style="{ 'background-color': d.haveGps ? '#ffffff' : '#fcfcfc' }">
					<view @click="changeCheckBox(i)" >
						<view class="cell-topView">
							<i class="iconfont device-logo" :class="cartype[d.machineTypeId] || defautcar" :style="{ color: d.state == '1' ? '#4EC365' : '#F7AB2F' }"></i>
							<view class="cell-topView-med">
								<view class="licenseId-view">
									<view style="word-break: keep-all;"><text style="margin-right: 10px;min-width: 50px;">自喷吗:</text></view>
									<view style="word-break: break-word;"><text>{{ d.printCode || "-"}}</text></view>
									<view style="word-break: keep-all;"><text :style="{ color: d.offline ? '#FF0000' : '#4EC365'}">{{d.offline ? "(离线)" : "(在线)"}}</text></view>		
								</view>
								<view class="gps-view subtext-small-9"> {{d.licenseId || '--'}} | {{ d.gpsInstallTypeDesc  || '--'}}|{{ d.stateName || "--"}}-{{d.subStateName}}</view>
							</view>
							<view class="right-container" v-if="getlockstate(d).state != 5">
								<view class="right-container">
									<mycheckbox 
									:checked="d.checked" 
									class="checkbox" 
									color="#E60000" />
								</view>
							</view>
						</view>
						<view class="cell-item-coloum subtext-small-9">
							<i class="iconfont location-icon iconzl--zuobiao"></i>
							<text style="margin-left: 5px;">{{ d.address || '无法获取当前定位' }}</text>
						</view>
						<view class="cell-item-coloum subtext-small-9">
							<text style="margin-left: 10px;">{{ d.lastDataUploadTime}}</text>
						</view>
						<view class="cell-item-coloum subtext-small-9" v-if = "getlockstate(d).message">
							<text style="margin-left: 10px;min-width: 30px;">备注:</text>
							<text class="subtext-small-9" style="color: #FF0000;margin-left: 10px;">{{ getlockstate(d).message }}</text>
						</view>
						<view class="cell-item-coloum subtext-small-9" style="background: #F0AD4E;" v-if = "getlockstate(d).warnning">
							<text class="subtext-small-9" 
							style="color: #FFFFFF;margin-left: 10px;margin-top: 5px;margin-bottom: 5px;">
							{{ getlockstate(d).warnning }}
							</text>
						</view>
						<view style="margin-left: 5px;height: 1px;background: #FFFFFF;margin-top: 5px;margin-bottom: 10px;"/>
					</view>
				</cell>
				<cell><uni-load-more iconType="auto" :status="status" /></cell>
			</list>
			<view style="width: 100%;height: 80px;"/>
		</view>
		<view class="bottom-container">
			<view class="clear-btn" @click="clearAllChecked">
				<text>{{'选中设备'}}（{{ chooseList.length }}）</text>
			</view>
			<view class="confirm-btn" @click="oprationCar">{{ optionType }}</view>
		</view>
		<alertshow 
		ref="alertshow" 
		@clickOk = "clickOk"
		:dataList="chooseList"
		:title="showtitle"
		:msg="showmsg"
		/>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import alertshow from '@/components/common/uni-popup/alert-show.vue';
export default {
	components: { 
		uniLoadMore,
		alertshow
	},
	data() {
		return {
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			defautcar: 'iconzl--jianchache2',
			page: 1,
			status: 'more',
			optionType: '解锁',
			optionNum:3,
			searchKey: '',
			isShowSelect: false,
			deviceList: [],
			keyWord:"",
			checkedList: [],
			chooseList:[],
			showmsg:"",
			showtitle:""
		};
	},
	methods: {
		searchTo(){
			uni.showLoading()
			this.page = 1;
			this.deviceList = [];
			this.getDeviceData();
		},
		getDeviceData(type) {
			let parame = { 
				current: this.page, 
				size: 10 ,
				lockType:this.optionNum,
				keyword:this.keyWord
			};
			this.$network
				.getData(this.$url.CONTROL_ALL_CAR_LIST, 'POST', parame)
				.then(result => {
					this.deviceList = this.deviceList.concat(result.records);
					let pages = result.pages;
					if (pages == this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					this.resetList();
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		resetList(){
			this.deviceList = this.deviceList.map((item)=>{
				if(this.chooseList.some((o)=>{
					return o.licenseId === item.licenseId
				})){
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
		/*****锁车问题*****/
		getlockstate(item){
			if(item.machineControlLogDto){
				let dict = item.machineControlLogDto;
				 if(dict.code){
					return this.getCarstate(item);
				}
			}else{
				return {
					state:item.lockType,
					des:item.lockTypeDesc,
					message:"",
					warnning:""
				 }
			}	   
		},
		getCarstate(item){
			let dict = item.machineControlLogDto;
			switch (dict.code) {
				case 400:
				case 200:
				case 8886:
				    return {
						state:item.lockType,
						des:item.lockTypeDesc,
						message:dict.operateDate + " | " + dict.codeName,
						warnning:""
					}				
					break;
				case 8880:
				case 8882:
				case 8884:
				case 1111:
				case 2222:
				    return this.gettimedifference(item,"")
					break;
				case 8881:
					return {
						state:item.lockType,
						des:item.lockTypeDesc,
						message:dict.operateDate + " | " + dict.codeName,
						warnning:"提示：发送指令失败可能是因为之前有指令未发送成功，请上电、等待数据回传后重试。"
					}
					break;		
				case 8883:
				    return {
				    	state:item.lockType,
				    	des:item.lockTypeDesc,
				    	message:dict.operateDate + " | " + dict.codeName,
				    	warnning:"提示：设备无回传数据，可能是未通电或进入低功耗或信号不佳，建议通电或等待12小时或将设备移到通信良好的地方等待状态更新。"
				    }
					break;
				case 8885:
				    return {
				    	state:item.lockType,
				    	des:item.lockTypeDesc,
				    	message:dict.operateDate + " | " + dict.codeName,
				    	warnning:"提示：下发指令失败可能是因为重复下发指令，请上电、等待数据回传后重试。"
				    }
				    break;
				case 8886:
					return this.gettimedifference(item,"提示：需要ACC上电才能执行命令，请将ACC上电、等待数据回传后重试。")
				    break;		
				case 8887:
					return this.gettimedifference(item,"提示：如果下发指令时ACC是开启状态，直接重启ACC；如果下发指令时ACC是关闭状态，需要打开ACC，等待3分钟回传数据后再重启ACC。")
					break;
				case 8888:
					return this.gettimedifference(item,"提示：设备无回传数据，可能是未通电或进入低功耗或信号不佳，建议通电或等待12小时或将设备移到通信良好的地方等待状态更新。")
					break;
				default:
					break;
			}
		},
		gettimedifference(item,msg){
			let dict = item.machineControlLogDto;
			let operateDate = dict.operateDate || ""
			return {
				state:item.lockType,
				des:item.lockTypeDesc,
				message:dict.operateDate + " | " + dict.codeName,
				warnning:msg
			}
		// 	if(this.$datestr.gettimedifferencenow(operateDate) > 60*5*1000){
		// 		return {
		// 			state:item.lockType,
		// 			des:item.lockTypeDesc,
		// 			message:dict.operateDate + " | " + dict.codeName,
		// 			warnning:msg
		// 		}
		// 	}else{
		// 		return {
		// 			state:5,
		// 			des:item.lockType === 3 ? "解锁中" : "锁车中",
		// 			message:dict.operateDate + " | " +dict.codeName,
		// 			warnning:msg
		// 		}
		// 	}
		},
		/**********/
		//改变选中状态
		changeCheckBox(pos) {
			this.deviceList[pos].checked = !this.deviceList[pos].checked;
			setTimeout(()=> {
				if(this.deviceList[pos].checked){
					this.Removerepetition(this.deviceList[pos],true)
				}else{
					this.Removerepetition(this.deviceList[pos],false)
				}
			}, 10);
		},
		Removerepetition(item,isremove){
			if(isremove){
				this.chooseList.push(item)
			}else{
				let index = this.chooseList.findIndex((o)=>{
					console.log(o.licenseId)
					console.log(item.licenseId)
					return o.licenseId === item.licenseId
				})
				this.chooseList.splice(index,1)
			}
		},
		//获得选中设备
		getChooseVehicleNum() {
			return this.deviceList.filter(v => {
				return v.checked;
			});
		},
		oprationCar(){
			if (this.chooseList.length == 0){
				uni.showToast({
					title: '请选择需要操作的车辆',
					icon: 'none'
				});
				return;
			}
			if (this.optionNum === 3) {
				/*统计*/
				this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备控制","批量解锁");
				this.showtitle = '您将对'+ this.chooseList.length +'台设备进行解锁'
			} else if (this.optionNum == 4) {
				/*统计*/
				this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备控制","批量锁车");
				this.showtitle = '您将对'+ this.chooseList.length +'台设备进行锁车'
			}
			this.showmsg = "以下为所选设备列表"
			this.$refs.alertshow.open();
		},
		//锁车操作
		clickOk(){
			this.$refs.alertshow.close();
			uni.showLoading();
			let licensearr = this.chooseList.map((info)=>{
				let lisenid = info.licenseId;
				return lisenid;
			})
			let parame = { 
				licenseIdList: licensearr, 
				operationType: this.optionNum === 3 ? 4 : 3 ,
			};
			this.$network.getData(this.$url.CONTROL_LOCKORUNLOCK_LIST, 'POST', parame).then(result => {
				if(licensearr.length === 1){
					uni.showToast({
						icon: 'none',
						title: result.message,
						duration: 1500
					});
				}else{
					let success = this.getToastMes("发送指令成功:",result.success || []);
					let offline = this.getToastMes("离线状态:",result.offline || []);
					let ubBind = this.getToastMes("未绑定:",result.ubBind || []);
					let exceptionList = this.getToastMes("发送指令错误:",result.exceptionList || []);
					let noDataIot = this.getToastMes("未在物联网中查询到可操作的设备:",result.noDataIot || []);
					let noData = this.getToastMes("未找到设备数据:",result.noData || []);
					let commondFail = this.getToastMes("发送指令失败:",result.commondFail || []);
					let error = this.getToastMes("操作的状态错误:",result.error || []);
					let toastMsg = success + offline + ubBind + exceptionList + noDataIot + noData + commondFail + error + "请前往锁车日志中查看"
					uni.showModal({
						title: '提示',
						content: toastMsg,
						showCancel:false
					})
				}
				this.page = 1;
				this.deviceList = [];
				this.chooseList = [];
				this.getDeviceData();
				uni.$emit('refreshData-log', {
					type:""
				});
			}).catch(err => {
				uni.showToast({
					icon: 'none',
					title: err.message,
					duration: 1500
				});
			});
		},
		getToastMes(msg,list){
			if(list.length === 0){
				return ""
			}else{
				return msg + list.length + "台\n"
			}
		},
		//清除
		clearAllChecked() {
			// return this.deviceList.map(function(d) {
			// 	d.checked = false;
			// });
			if(this.chooseList.length > 0){
				this.$refs.alertshow.close();
				uni.navigateTo({
					url:"./choose-control-list?item=" + encodeURIComponent(JSON.stringify(this.chooseList))
				})
			}else{
				uni.showToast({
					icon:'none',
					title:'暂无选中设备'
				})
			}
			
		},
		chooseSelect(item) {
			this.searchType = item;
			this.isShowSelect = false;
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.deviceList = [];
		this.getDeviceData();
	},
	onReachBottom() {
		this.$datestr.printlog('onReachBottom');
		if (this.status == 'noMore') {
			return;
		}
		this.page += 1;
		this.getDeviceData();
	},
	onNavigationBarButtonTap() {
		this.deviceList = this.deviceList.map(function(d) {
			return {
				...d,
				checked:true
			};
		});
		this.chooseList = [...this.deviceList];
		return;
	},
	onLoad(options) {
		switch (options.controlType) {
			case 'lock':
				this.optionType = '锁车';
				this.optionNum = 4;
				this.getDeviceData();
				break;
			case 'unlock':
				this.optionType = '解锁';
				this.optionNum = 3;
				this.getDeviceData();
				break;
			default:
				break;
		}
		uni.$on('changeList', usnerinfo => {
			this.chooseList = usnerinfo.list;
			this.page = 1;
			this.deviceList = [];
			this.getDeviceData();
		});
	}
};
</script>

<style lang="scss" scoped>
.nav-bar {
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 10;
}
.list-container {
	margin-top: 50px;
}
.cell-topView{
	display:flex;
	width: 100%;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
}
.cell-topView-med{
	display:flex;
	flex:1;
	margin-left: 10px;
	flex-direction:column
}
.right-container{
	margin-left: 10px;
	margin-right: 10px;
}
.cell-item-coloum{
	display:flex;
	flex-direction: row;
	margin-left: 10px;
	margin-right: 10px;
	min-width: 50px;
	margin-top: 5px;
}
/***12号字体 #555555**/
.subtext-small-5 {
	color: $uni-color-subtitle;
	font-size: $uni-font-size-sm;
}

/***12号字体#999999**/
.subtext-small-9 {
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
}

/***12号字体#999999**/
.subtext-small-c {
	color: $uni-text-color-disable;
	font-size: $uni-font-size-sm;
}

.content {
	width: 100%;
	background-color: $uni-bg-color-grey;
}

.list-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background-color: #ffffff;
	padding: 16px;
	margin-bottom: 1rpx;
}

.left-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.icon-bg {
	width: 50px;
	height: 50px;
	border-radius: 50%;
	line-height: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.device-logo {
	display: flex;
	margin-left: 10px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	font-size: 40px;
}

.selfprinting-view {
	margin-top: 4px;
}

.middle-container {
	margin-left: 8px;
	margin-right: 8px;
	flex: 1;
}

.licenseId-view {
	display: flex;
	flex: 1;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}

.gps-data-view {
	display: flex;
	flex: 1;
	justify-content: flex-start;
	align-items: center;
}

.gps-address {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 8px;
	word-wrap: break-word;
}

.location-icon {
	margin-left: 10px;
	width: 15px;
	height: 15px;
}

.location-date-view {
	// margin-left: 18px;
	margin-top: 4px;
}

.state-container {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.state-container span {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	display: flex;
	flex-direction: row;
	margin-left: 4px;
	margin-right: 8px;
}

.btn-container {
	color: #ffffff;
	font-size: $uni-font-size-base;
	background-color: #007aff;
	padding: 4px 8px;
	justify-content: center;
	line-height: 22px;
	text-align: center;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 22px;
	width: 58px;
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
	top: 0px;
	z-index: 980;
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

.clear-btn {
	flex: 1;
	background-color: $uni-color-primary;
	margin: 16px 8px 16px 16px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	color: #FFFFFF;
	font-size: 14px;
}

.confirm-btn {
	flex: 1.5;
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
