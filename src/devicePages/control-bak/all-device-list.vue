
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
		<!-- <view class="top-search-view-zw">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="自喷码/车号" v-model="keyWord" /></view>
			</view> 
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
		</view> -->
		<list class="list-container">
			<cell v-for="(d, i) in deviceList" :key="i" class="cell-s">
				<view class="cell-topView">
					<i class="iconfont device-logo" :class="cartype[d.machineTypeId] || defautcar" :style="{ color: d.state == '1' ? '#4EC365' : '#F7AB2F' }"></i>
					<view class="cell-topView-med">
						<view class="licenseId-view">
							<view style="word-break: keep-all;"><text style="margin-right: 10px;min-width: 50px;">自喷码:</text></view>
							<view style="word-break: break-word;"><text>{{ d.printCode || "--"}}</text></view>
							<view style="word-break: keep-all;"><text :style="{ color: d.offline ? '#FF0000' : '#4EC365'}">{{d.offline ? "(离线)" : "(在线)"}}</text></view>
						</view>
						<view class="gps-view subtext-small-9"> {{d.licenseId || '-'}} | {{ d.gpsInstallTypeDesc  || '--'}}[{{d.deviceNum||'--'}}]</view>
					</view>
					<view class="right-container" v-if="getlockstate(d).state != 5">
						<view class="btn-container" :style="{ 'background-color': isCanControl ? (getlockstate(d).state === 4 ? '#E60000' : '#4EC365') : '#999999'}" @click="cardeal(d)">
							<i class="iconfont iconzl--suoche" style="margin-right: 2px;" v-if="getlockstate(d).state === 4"></i>
							<i class="iconfont iconzl--jiesuo" style="margin-right: 2px;" v-else></i>
							<text>{{ getlockstate(d).state == 4 ? "锁车" : "解锁" }}</text>
						</view>
					</view>
				</view>
				<view class="cell-item-coloum subtext-small-9">
					<text style="margin-left: 10px;">{{ d.lastDataUploadTime}}</text>
				</view>
				<view class="cell-item-coloum subtext-small-9">
					<text style="margin-left: 10px;">当前状态:</text>
					<text style="color: #E60000;margin-left: 10px;">{{ getlockstate(d).des }}</text>
					<i class="iconfont iconzl--hetong" style="color: #E60000;" @click="goTo(d)"></i>
				</view>
				<view class="cell-item-coloum subtext-small-9" v-if = "getlockstate(d).message">
					<text style="margin-left: 10px;min-width: 55px;">最近操作:</text>
					<text class="subtext-small-9" style="color: #FF0000;margin-left: 10px;">{{ getlockstate(d).message }}</text>
				</view>
				<view class="cell-item-coloum subtext-small-9">
					<i class="iconfont location-icon iconzl--zuobiao"></i>
					<text style="margin-left: 5px;">{{ d.address || '无法获取当前定位' }}</text>
				</view>
				<view class="cell-item-coloum subtext-small-9" style="background: #F0AD4E;" v-if = "getlockstate(d).warnning">
					<text class="subtext-small-9" 
					style="color: #FFFFFF;margin-left: 10px;margin-top: 5px;margin-bottom: 5px;">
					{{ getlockstate(d).warnning }}
					</text>
				</view>
				<view style="margin-left: 5px;height: 1px;background: #FFFFFF;margin-top: 5px;margin-bottom: 10px;"/>
			</cell>
			<cell><uni-load-more iconType="auto" :status="status" /></cell>
		</list>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
var timer;
export default {
	components: {
		uniLoadMore,
	},
	data() {
		return {
			page: 1,
			status: 'more',
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			defautcar: 'iconzl--jianchache2',
			searchKey: '',
			deviceList: [],
			keyWord:"",
			isCanControl:true
		};
	},
	onLoad(option) {
		if(option.licenseId){
			this.keyWord = option.licenseId;
		}
		uni.showLoading();
		this.getDeviceData();
		let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		if (ps && ps.length > 0) {
			this.isCanControl = ps.some(x => x.value === this.$savekey.PERMISSION_MACHINE_LOCK_UNLOCK);
		}
	},
	methods: {
	   /*---------------------------------------------------*/
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
	   /*---------------------------------------------------*/
		//获取数据
		getDeviceData() {
			let parame = { 
				current: this.page, 
				size: 5 ,
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
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		searchTo(){
			uni.showLoading()
			this.page = 1;
			this.deviceList = [];
			this.getDeviceData();
		},
		gettimedifference(item,msg){
			let dict = item.machineControlLogDto;
			let operateDate = dict.operateDate || ""
			if(this.$datestr.gettimedifferencenow(operateDate) > 60*5*1000){
				return {
					state:item.lockType,
					des:item.lockTypeDesc,
					message:dict.operateDate + " | " + dict.codeName,
					warnning:msg
				}
			}else{
				return {
					state:5,
					des:item.lockType === 3 ? "解锁中" : "锁车中",
					message:dict.operateDate + " | " +dict.codeName,
					warnning:msg
				}
			}
		},
		//跳入记录
		goTo(item) {
			let licenseid = item.licenseId;
			let url = './controller-record?licenseid=' + licenseid;
			uni.navigateTo({
				url: url
			});
		},
		cardeal(item) {
			if(this.isCanControl == false){
				return
			}
			let locktype = 3;
			let licenseid = item.licenseId;
			let str = '';
			if (this.getlockstate(item).state === 3) {
				/*统计*/
				this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备控制","解锁");
				locktype = 4;
				str = '确定解锁车辆号为:' + licenseid + '的车辆?';
			} else if (this.getlockstate(item).state == 4) {
				/*统计*/
				this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备控制","锁车");
				locktype = 3;
				str = '确定锁定车辆号为:' + licenseid + '的车辆?';
			}
			//弹出锁定车辆的列表
			uni.showModal({
				title: '提示',
				content: str,
				success: res => {
					if (res.confirm) {
						uni.showLoading();
						let parame = { 
							licenseIdList: [licenseid], 
							operationType: locktype ,
						};
						this.$network.getData(this.$url.CONTROL_LOCKORUNLOCK_LIST, 'POST', parame).then(result => {
							uni.showToast({
								icon: 'none',
								title: result.message,
								duration: 1500
							});
							this.page = 1;
							this.deviceList = [];
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
					}
				}
			});
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.deviceList = [];
		this.getDeviceData();
	},
	onReachBottom() {
		console.log(this.status);
		if (this.status == 'noMore') {
			return;
		}
		this.status = 'loading';
		this.page += 1;
		this.getDeviceData();
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
	background: $uni-bg-color-grey;
}
.cell-s{
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
	margin-top: 3px;
}
.cell-topView{
	display:flex;
	width: 100%;
	justify-content: flex-start;
	align-items: center;
	flex-direction: row;
	background: #FFFFFF;
}
.cell-topView-med{
	display:flex;
	flex:1;
	margin-left: 5px;
	flex-direction:column
}
.right-container{
	display: flex;
	margin-left: 5px;
	margin-right: 5px;
}
.cell-item-coloum{
	display:flex;
	flex-direction: row;
	background: #FFFFFF;
	padding: 5px 5px 0px 5px;
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
	width: 50px;
}
.top-search-view {
	position: sticky;
	display: flex;
	flex-direction: row;
	height: 50px;
	width: 100%;
	background: #FFFFFF;
	justify-content: center;
	align-items: center;
	top: 0px;
	z-index: 980;
}
.top-search-view-zw{
	position: relative;
	display: flex;
	flex-direction: row;
	height: 50px;
	width: 100%;
	background: #ffffff;
	justify-content: center;
	align-items: center;
	z-index: 1;
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
</style>
/*
 SEND_WAIT(8880, "发送指令"),
 SEND_FAIL(8881, "发送指令失败"), // is_union =1    提示5
 SEND_SUCCESS(8882, "指令已下发,等待物联网回执"),
 EXECUTE_TIME_OUT(8883, "下发指令超时"), //is_union  提示3
 EXECUTE_FAIL(8885, "下发指令失败"), // is_union =1    提示4
 EXECUTE_SUCCESS(8884, "下发指令成功,等待状态同步"),
 WAIT_ACC_ON(8887, "等待车辆ACC重启"),    提示1
 WAIT_IOT_TIMEOUT(8888, "等待物联网回传数据超时"), //is_union =1    提示2
 SMS_WAIT_RESULT(8886, "等待执行结果"),    提示6
 OVER_SUCCESS(200, "指令执行成功"), // is_union =1
 OVER_FAIL(400, "指令执行失败"); // is_union =1
*/