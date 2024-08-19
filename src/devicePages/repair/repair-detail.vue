<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">维修单详情</c-nav-bar-btns>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.businessNo || "--"}}</text>
					<text style="margin-left: 5px;color: #00C2C3;">{{$gxfmethod.isSF() && dataDic.isLocal == '0' ? "(补录)" : ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.machineDto ? dataDic.machineDto.printCode : "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view"  @click="goDetailCar(dataDic.machineDto.licenseId)">
				<view class="cell-input-view-left"><text>车号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.machineDto ? dataDic.machineDto.licenseId : "--"}}</text>
				</view>
			</view> 
			<!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>租赁状态</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.natureName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.nature == '2'">
				<view class="cell-input-view-left"><text>工地</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.projectName || "--"}}</text>
				</view>
			</view> -->
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.orgName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保修状态</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.purchaseStateName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>小时表计数</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.preHours || "--"}}小时</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>维修信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开始时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{getYMDHMTime(dataDic.startDate) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>{{dataDic.isComplete == '1' ? '结束时间' : '预计结束时间'}}</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{getYMDHMTime(dataDic.endDate) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修工时</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ $datestr.doubleFloat(dataDic.repairHour) || "--"}}小时</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>所在合同</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.contractName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>是否维修完成</text></view>
				<view class="cell-input-view-right" style="justify-content: flex-end;">
					<mycheckbox 
					:disabled="true"
					style="transform: scale(0.8);"
					color="#E60000" 
					:checked="dataDic.isComplete == '1'" 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修来源</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.reasonName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" style="margin: 0px;"  v-if="dataDic.reason == '1' || dataDic.reason == '2' || dataDic.reason == '3'">
				<view style="display: flex;flex: 1;">
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>关联单号</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{dataDic.associatedBusinessNo || "--"}}</text>
						</view>
					</view>
				</view>
				<view style="color: #E60000;margin-right: 10px;" v-if="dataDic.associatedBusinessNo" @click="gotoDetail">
					<text>详情</text>
				</view>
			</view>
			<view style="display:flex; margin: 0px;flex-direction: column;"  v-if="dataDic.reason == '5'">
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>报修人</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.reporter || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>报修人联系方式</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.phoneNum || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>报修时间</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">{{getYMDHMTime(dataDic.reportTime) || "--"}}</text>
					</view>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.repairter || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>同行人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.togetherPeople || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修地址</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.address || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>往返公里数</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.mileage || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>维修金额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.repairTotal || "--"}}</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>故障信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>故障类型</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.repairTypeName || "--"}}</text>
				</view>
			</view>
			<text-label-item
			tagName="故障原因" 
			:inputDisabled = "true"
			:inputValue="dataDic.description"
			/>
			<text-label-item
			tagName="故障原因分析" 
			:inputDisabled = "true"
			:inputValue="dataDic.responsibleParty"
			/>
			<text-label-item
			tagName="故障处理措施和预防措施" 
			:inputDisabled = "true"
			:inputValue="dataDic.measures"
			/>
		</view>
		<view class="sum-view-bg">
			<partComponent :dataDic="dataDic" :isEdit='false'/>
			<view class="cell-input-view" v-if="isshowPart()">
				<view class="cell-input-view-left"><text>领用人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.leaderName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="isshowPart()">
				<view class="cell-input-view-left"><text>领用时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{changestr(dataDic.collarTime) || "--"}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>电池信息</text></view>
			</view>
			<view v-for="(item,index) in dataDic.batteryList" :key="index" class="cell-view">
				<view class="cell-input-view" style="margin: 5px 10px;">
					<view class="cell-input-view-left" style="color: #999999;"><text>电池品牌</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="margin-left:15px;">{{item.brand || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view" style="margin: 5px 10px;">
					<view class="cell-input-view-left" style="color: #999999;"><text>电池型号</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="margin-left:15px;">{{item.modelName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view" style="margin: 5px 10px;">
					<view class="cell-input-view-left" style="color: #999999;"><text>电池序列号</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="margin-left:15px;">{{item.seriesNum || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view" style="margin: 5px 10px;">
					<view class="cell-input-view-left" style="color: #999999;"><text>电池名称</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="margin-left:15px;">{{item.name || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view" style="margin: 5px 10px;">
					<view class="cell-input-view-left" style="color: #999999;"><text>电池日期</text></view>
					<view class="cell-input-view-right">
						<text class="input-style" style="margin-left:15px;">{{changestr(item.updateDate )}}</text>
					</view>
				</view>
				<text-label-item
				tagName="备注" 
				:inputDisabled = "true"
				:inputValue="item.remark"
				/>
			</view>
		</view> -->
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
			</view>
			<imgupload
			 :isupload="false"
			 :imgFinishlist='dataDic.fileList'
			 />
			<text-label-item 
			tagName="备注" 
			:inputDisabled = "true"
			:inputValue="dataDic.remark"
			/>
		</view>
	</view>	
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';
import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
import partComponent from '@/devicePages/components/parts-device-record.vue';
export default {
	components: {
		textLabelItem,
		imgupload,
		labelPhone,
		UniNumberBox,
		partComponent
	},
	data() {
		return {
			navBtns: [
					{
							"text": "审批流",
							"type": "none",
							"fontSize": "14px",
							"color": "#E60000",
							"width": "auto"
					}
			],
			dateIcon:"iconzl--rili",
			righticon:"iconarrow-right",
			dataDic:{},
			objDic:{}
		};
	},
	onLoad(option) {
		if(option.item){
			this.objDic = JSON.parse(decodeURIComponent(option.item));
			this.loadData();
		}
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","维修记录详情");
	},
	onUnload() {
	},
	methods: {
		onNavBarButtonTap() {
			let url = '/businessPages/workin/work-flow-display?businessKey=' + this.dataDic.businessKey;
			uni.navigateTo({
				url: url
			})
		},
		getYMDHMTime(date) {
			let d = '--'
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		isshowPart(){
			// if(this.dataDic.partsCollarLists){
			// 	return this.dataDic.partsCollarLists.some(o=>{return o.id})
			// }
			// return false
			if(this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0){
				return true
			}
			return false
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		goDetailCar(liseceid){
			let urlstr =  "/devicePages/record/device-record-detail?licenseId=" + liseceid
			uni.navigateTo({
				url: urlstr
			})
		},
		loadData() {
			let url = this.$url.MACHINE_REPAIR_DETAIL
			let param= {
				businessNo:this.objDic.businessNo
			}
			this.$network.getData(url, 'GET', param).then(result => {
					this.dataDic = {
						...result,
						preHours:result.preHours ? result.preHours.toString() : '',
					};
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
				});
		},
		gotoDetail(){
			if(this.dataDic.reason == '1'){
				uni.navigateTo({
					url: '/devicePages/maintain/maintain-detail?businessNo=' + this.dataDic.associatedBusinessNo
				});
			}else if(this.dataDic.reason == '2'){
				let param = {
					businessNo:this.dataDic.associatedBusinessNo
				}
				uni.navigateTo({
					url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(param))
				});
			}else if(this.dataDic.reason == '3'){
				uni.navigateTo({
					url: '/devicePages/polling/polling-detail?businessNo=' + this.dataDic.associatedBusinessNo
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.creat-bg {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	margin-bottom: 20px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom:$uni-line-color 1px dotted;
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
	margin-left: 20px;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-right: 10px;
}
.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}
.bottom-view{
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	z-index: 100;
}
.bottom-left-view{
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
.bottom-right-view{
	display: flex;
	flex: 1;
    height: 40px;
    border-radius: 20px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #FFFFFF;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
.boldstyle{
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: $uni-text-color;
}
</style>
