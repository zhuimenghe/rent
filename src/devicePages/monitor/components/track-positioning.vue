<template>
	<view class="working-content">
		<view class="tag-content">
			<view class="tag-container">
				<view class="tag-title">历史轨迹</view>
				<view class="choose-date">
					<view class="date-container">
						<view class="date-tag">
							<i class="iconfont date-icon iconzl--rili"></i>
							<text>起始时间</text>
						</view>
						<label-arrow 
						:value="startDate" 
						textColor="#333333" 
						@clickLabel="showPick('start')" 
						/>
					</view>
					<view class="arrow-container">
						<!-- <view class="date-num-view">1天</view> -->
						<view class="line"></view>
					</view>
					<view class="date-container">
						<view class="date-tag">
							<i class="iconfont date-icon iconzl--rili"></i>
							<text>截止时间</text>
						</view>
						<label-arrow 
						:value="endDate" 
						textColor="#333333" 
						@clickLabel="showPick('end')"
						/>
					</view>
				</view>
			</view>
			<view class="track-container">
				<map
				class="l-map"
				id="location-map"
				:latitude="centerLatitude"
				:longitude="centerLongitude"
				:markers="markers"
				:polyline="polyline"
				show-location="true"
				scale='15'	
				@tap="openPop"
				/>				
				<view class="map-legend">
					<view class="legend-mark">
						<view class="margin-right" v-if="carlatitudeNum!=''&&carlongitudeNum!=''">
							<image class="icon margin-right-sm" mode="aspectFit" :src="`/static/device/${machineTypeId}-on.png`"></image>
							当前位置
						</view>
						<view class="margin-right">
							<image class="icon margin-right-sm" mode="aspectFit" src="/static/zb_1.png"></image>
							<!-- <i class="iconfont iconzl--zuobiao margin-right-sm text-lg" style="color: #1278FF;"></i> -->
							开始位置
						</view>
						<view class="margin-right">
							<image class="icon margin-right-sm" mode="aspectFit" src="/static/zb_2.png"></image>
							<!-- <i class="iconfont iconzl--zuobiao margin-right-sm text-lg" style="color: #FE931F;"></i> -->
							结束位置
						</view>
						<!-- <view>
							<i class="iconfont iconzl--zuobiao" style="color: #F9AC13;"></i>
							经停
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="pop"  type="center" :mask-click="true">
			<view class="full-map-pop">
				<map
					style="width:100%;height:100%;"
					:latitude="centerLatitude"
					:longitude="centerLongitude"
					:markers="markers"
					:polyline="polyline"
					show-location="true"
					scale='15'	
					@tap="closePop"
					/>		
				<text class="iconfont iconguanbi2fill close-icon" @tap="closePop"></text>
			</view>
		</uni-popup>
		<w-picker
		mode="date" 
		startYear="2020" 
		endYear="2999" 
		:current="true" 
		@confirm="onConfirm" 
		:disabledAfter="true" 
		ref="date" 
		themeColor="#E60000" />
	</view>
</template>

<script>
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import hoursUtil from '@/common/util/day-working-hours.js';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	name: 'WorkingHours',
	components: {
		labelArrow,
		wPicker
	},
	props: {
		licenseId: {
			type: String, //当前选中下标
			default() {
				return '';
			}
		},
		machineTypeId:{
			type: String, //当前选中下标
			default:'1'
		},
		carlatitudeNum: {
			type: [Number,String], //当前选中下标
			default() {
				return '';
			}
		},
		carlongitudeNum: {
			type: [Number,String], //当前选中下标
			default() {
				return '';
			}
		},
		caraddress: {
			type: String, //当前选中下标
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			locationAddr: '',
			locationTime: '',
			pickType: 'start',
			startDate: '选择开始时间',
			endDate: '选择结束时间',
			startDateValue: '',
			endDateValue: '',
			centerLatitude: 0,
			centerLongitude: 0,
			polyline: [{
					points: [],
					color: '#52c41a',
					arrowLine: true,
					width: 6
			}],
			markers: [],
			stratAddress: '--',
			endAddress: '--',
			startAddDate: '--',
			endAddDate: '--',
		};
	},
	created() {
    this.centerLatitude = Number(this.carlatitudeNum)
    this.centerLongitude = Number(this.carlongitudeNum)
		this.markers = [{
      id:2,
			latitude: Number(this.carlatitudeNum),
			longitude: Number(this.carlongitudeNum),
			iconPath: `/static/device/${this.machineTypeId}-on.png`,
			width: 35,			
			height: 47,
			callout: {
				content: this.caraddress
			}
		}];
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备监控详情","轨迹定位");
	},
	mounted() {
	},
	methods: {
		openPop(){
			this.$refs.pop.open()
		},
		closePop(){
			this.$refs.pop.close()
		},
		async getDeviceDustribution() {
			uni.showLoading()
			let self = this;
			let startTime = this.startDateValue;
			let endTime = this.endDateValue;
			let queryDic = {
				startDate: startTime,
				endDate: endTime,
				licenseId: this.licenseId,
			};
			let result = await this.$network.gpsTrack(queryDic)
      let pointArr = result;
      let filterArr = [];
      for (let i = 0; i < pointArr.length; i++) {
        let pointDic = pointArr[i];
        if (pointDic.locateStatus == '1' || pointDic.locateStatus == 'A') {
          filterArr.push(pointDic);
        }
      }
      if (filterArr.length <= 0) {
        filterArr = pointArr;
      }
      if (filterArr.length > 0) {
        // let dictFirst = filterArr[0];
        // let dictEnd = filterArr[filterArr.length - 1];
        //起初起点取得第0项.终点取最后一项,张婧让改为起点取最后一项,终点取第一项
        let dictFirst = filterArr[filterArr.length - 1];
        let dictEnd = filterArr[0];
        self.stratAddress = dictFirst.address;
        self.startAddDate = dictFirst.locateDateTime;
        this.centerLatitude = Number(dictFirst.latitudeNum)
        this.centerLongitude = Number(dictFirst.longitudeNum)
        let startMarks = {
          id:0,
          latitude: Number(dictFirst.latitudeNum),
          longitude: Number(dictFirst.longitudeNum),
          iconPath: '/static/zb_1.png',
          width: 32,			
          height: 32,
          callout: {
            content: dictFirst.address
          }
        };
        self.endAddress = dictEnd.address;
        self.endAddDate = dictEnd.locateDateTime;
        let endMarks = {
          id:1,
          latitude: Number(dictEnd.latitudeNum),
          longitude: Number(dictEnd.longitudeNum),
          iconPath: '/static/zb_2.png',
          width: 32,			
          height: 32,
          callout: {
            content: dictEnd.address
          }
        };
        self.markers = [
          startMarks,
          endMarks,
          {
            id:2,
            latitude: Number(this.carlatitudeNum),
            longitude: Number(this.carlongitudeNum),
            iconPath: `/static/device/${this.machineTypeId}-on.png`,
            width: 35,			
            height: 47,
            callout: {
              content: this.caraddress
            }
          },
        ];
      }
      let points = filterArr.map(record => {
        let latitude = Number(record.latitudeNum);
        let longitude = Number(record.longitudeNum);
        return {
          latitude: latitude,
          longitude: longitude
        };
      });
      self.polyline[0].points = [...points];
      uni.hideLoading();
		},
		showPick(type) {
			this.pickType = type;
			this.$refs.date.show();
		},
		onConfirm: function(val) {
			let oldValue = "";
			let oldDate = "";
			switch (this.pickType) {
				case 'start':
				    oldValue = this.startDateValue;
				    oldDate = this.startDate;
					this.startDateValue = val.result;
					this.startDate = hoursUtil.formatDateSToC(val.result);
					break;
				case 'end':
				    oldValue = this.endDateValue;
				    oldDate = this.endDate;
					this.endDateValue = val.result;
					this.endDate = hoursUtil.formatDateSToC(val.result);
					break;
				default:
					break;
			}
			if(this.startDate == '选择开始时间'){
				return
			}
			if(this.endDate == '选择结束时间'){
				return
			}
			let start = this.startDateValue + " 00:00:00";
			let end = this.endDateValue + " 23:59:50"
			if(this.$datestr.timedifferent(start,end) != -1){
				console.log("开始时间晚于结束时间")
				// if(this.pickType == 'start'){
				// 	this.startDateValue = oldValue
				// 	this.startDate = oldDate
				// }else if(this.pickType == 'end'){
				// 	this.endDateValue = oldValue
				// 	this.endDate = oldDate
				// }
				return
			}
			console.log(this.$datestr.timeLeft(start,end));
			// if(this.$datestr.timeLeft(start,end) > 3){
			// 	if(this.pickType == "start"){
			// 		let dateStart = new Date(start.replace(/-/g, "/").replace(/-/g, "/"));
			// 		let newTimes = dateStart.getTime() + (1000*3600*24*2.5);
			// 		this.endDateValue = hoursUtil.dateSFormat(newTimes);
			// 		this.endDate = hoursUtil.formatDateSToC(this.endDateValue);
			// 	}else if(this.pickType == "end"){
			// 		let dateEnd = new Date(end.replace(/-/g, "/").replace(/-/g, "/"));
			// 		let newTimes = dateEnd.getTime() - (1000*3600*24*2.5);
			// 		this.startDateValue = hoursUtil.dateSFormat(newTimes);
			// 		this.startDate = hoursUtil.formatDateSToC(this.startDateValue);
			// 	}
			// }
			this.getDeviceDustribution();
		},
		// showPick(type) {
		// 	let self = this;
		// 	this.pickType = type;
		// 	let defaultDate;
		// 	switch (type) {
		// 		case 'start':
		// 			defaultDate = this.startDateValue;
		// 			break;
		// 		case 'end':
		// 			defaultDate = this.endDateValue;
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	// this.$refs.date.show();
		// 	// 通过 id 获取 nvue 子窗体
		// 	const subNVue = uni.getSubNVueById('pick');
		// 	// uni.$emit('default-pick-date', {
		// 	// 	defaultDate: defaultDate
		// 	// });
		// 	// // 打开 nvue 子窗体
		// 	subNVue.show('slide-in-bottom', 300, {});
		// 	// 关闭 nvue 子窗体
		// 	// subNVue.hide('fade-out', 300)
		// },
	}
};
</script>

<style lang="scss">
.working-content {
	width: 100%;
	background: $uni-bg-color-grey;
	padding-top: 16px;
}

.tag-content {
	background: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 14px;
	margin: 8px;
	border-radius: 4px;
}

.tag-container {
	padding: 12px 12px 12px 12px;
	display: flex;
	flex-direction: column;
}

.location-container {
	display: flex;
	flex-direction: row;
	padding: 0px 10px 12px 10px;
}

.location-contnent {
	margin-left: 4px;
}

.l-addr {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.l-time {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-disable;
}

.choose-date {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
}

.date-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 2;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
}

.date-tag {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding-top: 8px;
	padding-bottom: 4px;
}

.date-icon {
	margin-right: 4px;
	color: $uni-color-subtitle;
}

.arrow-container {
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 25px;
	align-items: center;
	justify-content: center;
}

.line {
	height: 1rpx;
	background-color: #999999;
	width: 100%;
}

.track-container {
	padding: 0px 10px 16px 16px;
	background-color: #ffffff;
}

.map-scale {
	width: 30px;
	height: 50px;
	background-color: #ffffff;
	text-align: center;
	border-color: #eeeeee;
	border-width: 1rpx;
	position: absolute;
	border-style: solid;
	right: 20px;
	opacity: 0.7;
	font-size: 30px;
	color: $uni-text-color-gray;
}

.increase {
	top: 50px;
}

.decrease {
	top: 100px;
}

.l-map {
	position: relative;
	width: 100%;
	height: 240px;
}

.map-legend {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 4px;
}

.basic-data {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.basic-data checkbox {
	transform: scale(0.7);
	margin-left: -15px;
	font-size: $uni-font-size-base;
}

.legend-mark {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
	.icon{
		width:30rpx;
		height:36rpx;
	}
}

.legend-mark view {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
}

.legend-mark text {
	margin-left: 4rpx 4px;
}

.legend-address-container {
	background-color: #f3f4f4;
	padding: 16px;
	margin-top: 8px;
	border-radius: 4px;
	display: flex;
	flex-direction: row;
}

.legend-address-tag {
	margin-right: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.small-circle {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.blue {
	background: $uni-color-primary;
	margin-top: 4px;
}

.legend-line {
	width: 1px;
	flex: 1;
	background: $uni-border-color;
}

.black {
	background: #000000;
	margin-bottom: 12px;
}

.legend-address {
	font-size: $uni-font-size-base;
}

.legend-address-time {
	font-size: 10px;
	color: $uni-text-color-disable;
	font-size: $uni-font-size-sm;
	margin-top: 2px;
}

.to {
	margin-top: 8px;
}
.full-map-pop{
	width:100vw;
	height:100vh;
	.close-icon{
		font-size: 40px;
		color:#bbb;
		position:fixed;
		bottom:80rpx;
		left:50%;
		transform: translateX(-50%);
	}
}
</style>
