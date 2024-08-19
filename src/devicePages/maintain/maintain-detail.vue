<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">保养单详情</c-nav-bar-btns>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.businessNo || '--' }}</text>
					<text style="margin-left: 5px;color: #00C2C3;">{{$gxfmethod.isSF() && dataDic.isLocal == '0' ? "(补录)" : ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.machineDto && dataDic.machineDto.printCode ? dataDic.machineDto.printCode : '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view"  @click="goDetailCar(dataDic.licenseId)">
				<view class="cell-input-view-left"><text>车号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.machineDto && dataDic.machineDto.licenseId ? dataDic.machineDto.licenseId : '--' }}</text>
				</view>
			</view>
			<!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>租赁状态</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.natureName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.nature === '2'">
				<view class="cell-input-view-left"><text>工地</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.projectName || '--' }}</text>
				</view>
			</view> -->
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>区域</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.orgName || '--' }}</text>
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
					<text class="input-style">{{ dataDic.maintainHourmeter || '--' }}小时</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>保养信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开始时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ getYMDHMTime(dataDic.operateStartDate) || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>结束时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ getYMDHMTime(dataDic.operateEndDate) || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养时长</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ $datestr.doubleFloat(dataDic.maintenanceDuration) || "--"}}小时</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>所在合同</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.contractName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.maintenancePersonName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>同行人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.togetherPeople || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养地址</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.address || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>往返公里数</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.mileage || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养金额</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.amount || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养规则</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.rulesName }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>保养级别</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ getLevelString(dataDic.level) }}</text>
				</view>
			</view>
			<view style="height: 5px;flex: 1;background: #F5F4F9;" />
			<scroll-view class="scroll-container" scroll-x="true" show-scrollbar="false">
				<view class="tabs-container">
					<view class="tab-item" :class="{ selected: index === selectProIndex }" v-for="(t, index) in dataDic.rulesProjects ? dataDic.rulesProjects : []" :key="index" @click="changeTab(index)">
						<text>{{ t.programName }}</text>
					</view>
				</view>
			</scroll-view>
			<view scroll-y="true" show-scrollbar="false" class="pro-item-container">
				<view v-for="(o, i) in dataDic.rulesProjects && dataDic.rulesProjects[selectProIndex] ? dataDic.rulesProjects[selectProIndex].rulesProjectContents : []" :key="i">
					<view class="option-view">
						<view class="o-left">
							<mycheckbox 
							class="checkbox" 
							:checked="o.checked" 
							color="#E60000" 
							:disabled="true"
							/>
							<view class="option-name">{{ o.operationContent }}</view>
						</view>
						<input 
						class="input-style-borad" 
						v-model="o.remark" 
						v-if="!o.checked" 
						:disabled="true"
						/>
					</view>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<partComponent :dataDic="dataDic" :isEdit='false'/>
			<view class="cell-input-view" v-if="isshowPart()">
				<view class="cell-input-view-left"><text>领用人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.leaderName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="isshowPart()">
				<view class="cell-input-view-left"><text>领用时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ changestr(dataDic.collarTime) }}</text>
				</view>
			</view>
		</view>
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
			:inputValue="dataDic.comment"
			/>
		</view>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import numToChinese from '@/common/util/num-to-chinese.js';
import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
import partComponent from '@/devicePages/components/parts-device-record.vue';
export default {
	components: {
		selectLabelItem,
		imgupload,
		textLabelItem,
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
			selectProIndex: 0,
			businessNo: '',
			dataDic: {}
		};
	},
	onLoad(options) {
		this.businessNo = options.businessNo;
		this.getDetail();
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","保养保养详情");
	},
	methods: {
		onNavBarButtonTap() {
			let url = '/businessPages/workin/work-flow-display?businessKey=' + this.dataDic.businessKey;
			uni.navigateTo({
				url: url
			});
		},
		isshowPart(){
			// if(this.dataDic.partsCollarLists){
			// 	return this.dataDic.partsCollarLists.some(o=>{return o.id})
			// }
			// return true
			if(this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0){
				return true
			}
			return false
		},
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		getYMDHMTime(date) {
			let d = '--'
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		goDetailCar(liseceid) {
			let urlstr = '/devicePages/record/device-record-detail?licenseId=' + liseceid;
			uni.navigateTo({
				url: urlstr
			});
		},
		changeTab(index) {
			this.selectProIndex = index;
		},
		getDetail() {
			uni.showLoading();
			let param = {
				businessNo: this.businessNo
			};
			this.$network
				.getData(this.$url.MAINTAIN_DETAIL, 'GET', param)
				.then(result => {
					this.dataDic = {
						...result,
						// rulesProjects: [...this.getContents(result.rulesProjects)],
						maintainHourmeter: result.maintainHourmeter ? result.maintainHourmeter.toString() : ''
					};
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getLevelString(level) {
			if (level != undefined && level != null) {
				if (level === 0) {
					return '首保';
				}
				return level + '级保养'
			}
			return "--"
		},
		getContents(rawData) {
			if (!rawData) {
				return [];
			}
			return rawData.map((o, index) => {
				return {
					...o,
					checked: index === 0
				};
			});
		}
	},
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
	margin: 10px;
	margin-bottom: 10px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}
.cell-view{
	display: flex;
	flex-direction: column;
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
}
.cell-input-view-row{
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	font-size: $uni-font-size-base;
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
.cell-input-view-cell {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	font-size: $uni-font-size-base;
	background: $uni-bg-color-grey;
}
.tilte-view-sub{
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
}
.cell-input-view-left {
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
}
.input-style-borad {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	padding: 5px;
	border: 1px;
	border-radius: 3px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}
.input-style-center {
	flex: 1;
	text-align: center;
	font-size: $uni-font-size-base;
}
.boldstyle{
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: $uni-text-color;
}
.gray-arrow {
	margin-left: 4px;
}
.addressstyle {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	width: 40px;
	margin-right: 0px;
}
.arrow {
	display: flex;
	font-size: 18px;
	justify-content: center;
	align-items: center;
	color: $uni-color-primary;
}
.scroll-container {
	display: flex;
	flex-direction: column;
	width: calc(100% - 20px);
	margin: 0px 10px;
	background: #ffffff;
	border-width: 1px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
}

.tabs-container {
	display: flex;
	flex-direction: row;
}

.tab-item {
	padding: 4px 8px;
	white-space: nowrap;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selected {
	background: #FFFFFF;
	color: $uni-color-primary;
	border-width: 0px 0px 2px 0px;
	border-color: $uni-color-primary;
	border-style: solid;
}
.pro-item-container {
	height: auto;
	margin: 5px 5px 20px 5px;
}
.option-view {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: $uni-font-size-base;
}

.o-left {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: $uni-font-size-base;
	margin: 3px 0px;
}

.option-name {
	color: $uni-text-color;
	font-weight: bold;
	margin-right: 8px;
	font-size: $uni-font-size-base;
}
.checkbox {
	transform: scale(0.8);
}
</style>
