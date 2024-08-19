<template>
	<view class="working-content" scroll-y="true">
		<view class="chart-content">
			<c-sun-tab 
				:value.sync="tabindex" 
				:tabList="tabList" 
				:scroll="true" 
				@change="tabChange" 
				activeColor="#E60000"
				defaultColor='#7B8395'
				activebgColor="#FFFFFF" 
				defaultbgColor="#FFFFFF" 
				:shownum="false"
			/>
			<view class="box" v-if="tabindex==0">
				<view class="flex justify-between align-center">
					<view class="chart-tag">
						当日累计实际工作时长
						<span>{{ todayHours || 0 }}</span>
					</view>
					<c-form-datepicker v-model="workHourDate" icon-name="iconarrow-right"></c-form-datepicker>
				</view>
				<view class="chart-tips" style="margin-bottom: 10px;" v-if="updateStr != ''">
					<text>tips:最后更新时间:{{updateStr}}</text>
				</view>
				<canvas type="2d" style="width: 668rpx; height: 100rpx;" canvas-id="work_bar_chart" id="work_bar_chart"/>
			</view>
			<view class="box" v-else>
				<view class="flex justify-between align-center">
					<view class="chart-tag">
						当日开机时长
						<span>{{ todayHours2 || 0 }}</span>
					</view>
					<c-form-datepicker v-model="onlineDate" icon-name="iconarrow-right"></c-form-datepicker>
				</view>
				<view class="chart-tips" style="margin-bottom: 10px;" v-if="updateStr2 != ''">
					<text>tips:最后更新时间:{{updateStr2}}</text>
				</view>
				<canvas type="2d" style="width: 668rpx; height: 100rpx;" canvas-id="online_bar_chart" id="online_bar_chart" />
			</view>
		</view>
		<view class="chart-content">
			<view class="box">
				<view class="chart-tag flex justify-between">
					<view class="text-bold">月每日实际工作时长(h)</view>
					<c-form-datepicker mode="yearMonth" v-model="workMonth" icon-name="iconarrow-right"></c-form-datepicker>
				</view>
			</view>
			<canvas @touchstart="touchMonthWorkChart" type="2d" class="chart" canvas-id="month_work_column_chart" id="month_work_column_chart" ></canvas>
		</view>
		<view class="chart-content">
			<view class="box">
				<view class="chart-tag flex justify-between">
					<view class="text-bold">月度开工率(%)</view>
					<c-form-datepicker mode="year" v-model="ratioYear" icon-name="iconarrow-right"></c-form-datepicker>
				</view>
			</view>
			<canvas @touchstart="touchYearRatioChart" type="2d" class="chart" canvas-id="year_work_ratio_chart" id="year_work_ratio_chart" ></canvas>
		</view>

		<w-picker mode="yearMonth" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
		 ref="date" themeColor="#E60000" />
	</view>
</template>

<script>
	import uCharts from "@/components/common/u-charts/u-charts"
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import hoursUtil from '@/common/util/day-working-hours.js';
	import {canvas2dCtx} from '@/common/util/util';
import { mapState } from 'vuex';
	var _self;
	var mwhChart = null;
	var ywrChart = null;
	var canvaColumn = null;
	var canvaLineA = null;
	export default {
		options:{
			styleIsolation:'shared'
		}, 
		name: 'WorkingHours',
		components: {
			wPicker
		},
		props: {
			licenseId: {
				type: String, //当前选中下标
				default () {
					return '';
				}
			}
		},
		data() {
			return {
				workHourDate:this.$datestr.dateFormat(new Date(), 'yyyy-MM-dd'),
				onlineDate:this.$datestr.dateFormat(new Date(), 'yyyy-MM-dd'),
				tabList:['实际工作时长','开机时长'],
				tabindex:0,
				workMonth:'',
				cWidth: '',
				cHeight: '',
				// pixelRatio: 1,
				todayHours: 0, //当天总时长
				todayHours2: 0, //当天总时长
				//当前月份
				ratioYear:new Date().getFullYear()+'',
				//当天时长时间段{start: '2019-11-25 00:20:00',end: '2019-11-25 00:30:00'}
				times: [],
				times2:[],
				//工作时长
				updateStr:"",
				updateStr2:"",
			};
		},
		computed:{
			...mapState('system',{
				pixelRatio:s=>{
					let pr = 1
					/* #ifdef MP-WEIXIN */
					pr = s.systemInfo.pixelRatio
					/* #endif */
					return pr
				}
			})
		},
		created() {
			_self = this;
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备监控详情","工作时长");
		},
		mounted() {
			this.workMonth = hoursUtil.yearMonthFormat(new Date())
			this.cWidth = uni.upx2px(702);
			this.cHeight = uni.upx2px(292);
			if (this.licenseId != "") {
				//获取当天工作累计时长
				this.getCarDayWork(this.licenseId);
				this.getCarDayOnline(this.licenseId);
				// //获取近七天时长 
				// this.getWeekData(this.licenseId);
				// //获取月工作时长
				// this.getMonthData(this.licenseId);

				this.getMonthWorkData();
				this.getYearRatioData();

			}
		},
		watch: {
			licenseId: {
				handler(val) {
					//获取当天工作累计时长
					this.getCarDayWork(val);
					this.getCarDayOnline(val);
					//获取近七天时长
					// this.getWeekData(val);
					//获取月工作时长
					// this.getMonthData(val);
				}
			},
			workHourDate(){
				this.getCarDayWork(this.licenseId);
			},
			onlineDate(){
				this.getCarDayOnline(this.licenseId);
			},
			workMonth(){
				this.getMonthWorkData()
			},
			ratioYear(){
				this.getYearRatioData()
			},
			tabindex(tabindex){
				if(tabindex==0){
					this.$nextTick(_=>{
						this.drawWorkBarChart()
					})
				}else if(tabindex==1){
					this.$nextTick(_=>{
						this.drawOnlineBarChart()
					})
				}
			}
		},
		methods: {
			tabChange(e){
				this.tabindex = e.index
			},
			//获取该车当天的实际工作时长
			async getCarDayWork(carid) {
				let result = await this.$network.actualWorkTime(carid,this.workHourDate);
				this.times = result.list || [];
				if(this.times.length>0){
					this.updateStr = this.times[this.times.length - 1].endTime
				}else{
					this.updateStr = ''
				}
				this.todayHours = result.totalStr || 0;
				this.drawWorkBarChart();
				
				uni.hideLoading();
			},
			//获取该车当天的开机时长
			async getCarDayOnline(carid) {
				let result = await this.$network.OnlineTime(carid,this.onlineDate);
				this.times2 = result.list || [];
				if(this.times2.length>0){
					this.updateStr2 = this.times2[this.times2.length - 1].endTime
				}else{
					this.updateStr2 = ''
				}
				this.todayHours2 = result.totalStr || 0;
				this.drawOnlineBarChart();
				
				uni.hideLoading();
			},
			//当日实际工作时长
			async drawWorkBarChart() {
				let canvasId = 'work_bar_chart'
				let dayCanvas = uni.createCanvasContext(canvasId, this);
				let pr = 1
				// #ifdef MP-WEIXIN
				dayCanvas = await canvas2dCtx('#'+canvasId,this)
				dayCanvas.draw = function() {}
				pr = this.pixelRatio
				// #endif
				let height = uni.upx2px(40)*pr;
				let width = uni.upx2px(668)*pr;
				dayCanvas.save();
				dayCanvas.fillStyle='#eeeeee';
				dayCanvas.lineWidth =1*pr;
				dayCanvas.fillRect(0, 0, width, height);
				dayCanvas.stroke();

				//表格
				let drawCount = 12;
				let perWidth = width / drawCount;
				let xPosition = 0;
				let strStart = 0;
				let timeStr = '00:00';
				for (let i = 0; i < drawCount; i++) {
					timeStr = (Array(2).join(0) + i * 2).slice(-2) + ':00';
					// strStart = (perWidth - context.measureText(timeStr).width)/2 + xPosition;
					strStart = 1*pr + xPosition;
					xPosition = perWidth + i * perWidth;

					dayCanvas.strokeStyle='#FFFFFF';
					dayCanvas.moveTo(xPosition, 0);
					dayCanvas.lineTo(xPosition, height);
					dayCanvas.stroke();

					dayCanvas.fillStyle='#333333';
					dayCanvas.font = `${9*pr}px sans-serif`;
					dayCanvas.fillText(timeStr, strStart, height + 15*pr);
				}
				//时间段
				dayCanvas.fillStyle='#fe931f';
				_self.times.forEach(t => {
					let startPos = hoursUtil.getStartTimePos(t.beginTime, width);
					let len = hoursUtil.getTimeBucketLength(t.beginTime, t.endTime, width);
					dayCanvas.rect(startPos, 0, len, height);
					dayCanvas.fill();
				});
				dayCanvas.draw()
			},
			//当日开机时长
			async drawOnlineBarChart() {
				let canvasId = 'online_bar_chart'
				let context = uni.createCanvasContext(canvasId, this);
				let pr = 1
				// #ifdef MP-WEIXIN
				context = await canvas2dCtx('#'+canvasId,this)
				context.draw = function() {}
				pr = this.pixelRatio
				// #endif
				let height = uni.upx2px(40)*pr;
				let width = uni.upx2px(668)*pr;
				context.save();
				context.fillStyle='#eeeeee';
				context.lineWidth =1*pr;
				context.fillRect(0, 0, width, height);
				context.stroke();

				//表格
				let drawCount = 12;
				let perWidth = width / drawCount;
				let xPosition = 0;
				let strStart = 0;
				let timeStr = '00:00';
				for (let i = 0; i < drawCount; i++) {
					timeStr = (Array(2).join(0) + i * 2).slice(-2) + ':00';
					// strStart = (perWidth - context.measureText(timeStr).width)/2 + xPosition;
					strStart = 1*pr + xPosition;
					xPosition = perWidth + i * perWidth;

					context.strokeStyle='#FFFFFF';
					context.moveTo(xPosition, 0);
					context.lineTo(xPosition, height);
					context.stroke();

					context.fillStyle='#333333';
					context.font = `${9*pr}px sans-serif`;
					context.fillText(timeStr, strStart, height + 15*pr);
				}
				//时间段
				context.fillStyle='#52c41a';
				_self.times2.forEach(t => {
					let startPos = hoursUtil.getStartTimePos(t.beginTime, width);
					let len = hoursUtil.getTimeBucketLength(t.beginTime, t.endTime, width);
					context.rect(startPos, 0, len, height);
					context.fill();
				});
				context.draw()
			},
			async getMonthWorkData(){
				let res = await this.$network.machineMonthWorkTime(this.licenseId,this.workMonth);

				this.drawMonthWorkColumnChart(res)
			},
			async drawMonthWorkColumnChart(data){
				let chartData = {
					categories:data.map((d,i)=>i+1),
					series:[{
						name:'实际工作时长',
						color:'#fe931f',
						data:data.map(d=>d.actualWorktimeHours)
					},{
						name:'开机时长',
						color:'#52c41a',
						data:data.map(d=>d.startUpTimeHours)
					}]
				}
				let canvasId = 'month_work_column_chart'
				let context = uni.createCanvasContext(canvasId, this);
				// #ifdef MP-WEIXIN
				context = await canvas2dCtx('#'+canvasId,this)
				// #endif
				mwhChart = new uCharts({
					context,
					type: 'column',
					legend: {
						show: false
					},
					fontSize: 11,
					fontColor:'#999999',
					background: '#FFFFFF',
					/* #ifdef MP-WEIXIN */
					pixelRatio: _self.pixelRatio,
					/* #endif */
					dataPointShape: true,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						labelCount:16,
						disabled: false,
						disableGrid: true
					},
					yAxis: {
						disableGrid: false,
						gridType: 'dash', //如不写此方法，Y轴刻度默认保留两位小数
						gridColor: '#eeeeee',
						data: [{
							disabled: false,
							axisLine: false,
							splitNumber: 5,
							min: 0,
						}]
					
					
					},
					dataLabel: false,
					/* #ifdef MP-WEIXIN */
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					/* #endif */
					/* #ifndef MP-WEIXIN */
					width: _self.cWidth,
					height: _self.cHeight,
					/* #endif */
					extra: {
						column: {
							type: 'group',
							width: (_self.cWidth * 0.3) / chartData.categories.length
						}
					}
				});
			},
			touchMonthWorkChart(e) {
				let vm = this
				mwhChart.showToolTip(e, {
					textList: [{ text: '8-31',color:'rgba(0,0,0,0)'},{ text: ''}, { text: '' }],
					formatter: function(item, category){
						console.log(item);
						this.textList[0].text = vm.workMonth + '-' + category
						if(item.name=='实际工作时长'){
							this.textList[1].text = item.name + ':' + item.data
							this.textList[1].color = item.color
						}else{
							this.textList[2].text = item.name + ':' + item.data
							this.textList[2].color = item.color
						}
					}
				});
			},
			async getYearRatioData(){
				let res = await this.$network.machineYearWorkRatio(this.licenseId,this.ratioYear);

				this.drawYearWorkRatioChart(res)
			},
			async drawYearWorkRatioChart(data){
				let chartData = {
					categories:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
					series:[{
						name:'月度开工率',
						color:'#fe931f',
						textSize:10,
						textColor:'#454545',
						data:data.map(d=>(d*100).toFixed(0))
					}]
				}
				let canvasId = 'year_work_ratio_chart'
				let context = uni.createCanvasContext(canvasId, this);
				// #ifdef MP-WEIXIN
				context = await canvas2dCtx('#'+canvasId,this)
				// #endif
				ywrChart = new uCharts({
					context,
					type: 'column',
					legend: {
						show: false
					},
					fontSize: 11,
					fontColor:'#999999',
					background: '#FFFFFF',
					/* #ifdef MP-WEIXIN */
					pixelRatio: _self.pixelRatio,
					/* #endif */
					dataPointShape: true,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disabled: false,
						disableGrid: true
					},
					yAxis: {
						disableGrid: false,
						gridType: 'dash', //如不写此方法，Y轴刻度默认保留两位小数
						gridColor: '#eeeeee',
						data: [{
							disabled: false,
							axisLine: false,
							splitNumber: 5,
							min: 0,
						}]
					},
					dataLabel: true,
					/* #ifdef MP-WEIXIN */
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					/* #endif */
					/* #ifndef MP-WEIXIN */
					width: _self.cWidth,
					height: _self.cHeight,
					/* #endif */
					extra: {
						column: {
							type: 'stack',
							width: (_self.cWidth * 0.3) / chartData.categories.length
						}
					}
				});
			},
			touchYearRatioChart(e) {
				ywrChart.showToolTip(e);
			},
		}
	};
</script>

<style lang="scss">
	@import './style.scss';
	.working-content {
		width: 100%;
		background: $uni-bg-color-grey;
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}
	.chart-content{
		.chart{
			width:702rpx;
			height:292rpx;
		}
	}
</style>
