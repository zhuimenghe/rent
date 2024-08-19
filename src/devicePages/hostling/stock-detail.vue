<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="dataDic.businessKey">检修单详情</c-nav-bar-apply>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>检修单号</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.businessNo || "--"}}</text>
					<text style="margin-left: 5px;color: #00C2C3;">{{$gxfmethod.isSF() && dataDic.isLocal == '0' ? "(补录)" : ""}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.printCode || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" @click="goDetailCar(dataDic.licenseId)">
				<view class="cell-input-view-left"><text>车号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.licenseId || "--"}}</text>
				</view>
			</view>
			<!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>租赁状态</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.storageLeasedTypeName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.storageLeasedType === '2'">
				<view class="cell-input-view-left">
					<text>工地</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.projectName || "--"}}</text>
				</view>
			</view> -->
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>区域</text>
				</view>
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
				<view class="cell-input-view-left">
					<text>小时表计数</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.checkHours || "--"}}</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>检修信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修类型</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.checkRepairTypeName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>开始时间</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{getYMDHMTime(dataDic.startDate) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>结束时间</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{getYMDHMTime(dataDic.endDate) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修工时</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ $datestr.doubleFloat(dataDic.timeCost) || "--"}}小时</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>所在合同</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.contractName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修人</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.checkUserName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>同行人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.togetherPeople || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修地址</text>
				</view>
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
				<view class="cell-input-view-left">
					<text>检修金额</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.amount || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修规则</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.rulesName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修级别</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style">{{getLevelString(dataDic.level) || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>检修状态</text>
				</view>
				<view class="cell-input-view-right">
					<text class="input-style"  :style="{ color: dataDic.checkOk == true ? '#4EC365' : '#FC0D2F' }">{{ dataDic.checkOk == true ? '检修正常' : '检修异常' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="!dataDic.checkOk">
				<view class="cell-input-view-left"><text>是否需要维修</text></view>
				<view class="cell-input-view-right" style="justify-content: flex-end;">
					<mycheckbox 
					:disabled="true"
					style="transform: scale(0.8);"
					color="#E60000" 
					:checked="dataDic.needRepair == '1'" 
					/>
				</view>
			</view>
			<scroll-view class="scroll-container" scroll-x="true" show-scrollbar="false">
				<view class="tabs-container">
					<view class="tab-item" :class="{ selected: index === selectProIndex }" v-for="(t, index) in dataDic.rulesProjects ?  dataDic.rulesProjects : []" :key="index"
					 @click="changeTab(index)">
						<text>{{ t.programName }}</text>
					</view>
				</view>
			</scroll-view>
			<view scroll-y="true" show-scrollbar="false" class="pro-item-container">
				<view v-for="(o,i) in dataDic.rulesProjects&&dataDic.rulesProjects[selectProIndex] ? dataDic.rulesProjects[selectProIndex].rulesProjectContents : []" :key="i">
					<view class="option-view">
						<view class="o-left">
							<mycheckbox 
							class="checkbox" 
							:checked="o.checked" 
							color="#E60000" 
							:disabled="true"
							/>
							<view class="option-name">{{o.operationContent}}</view>
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
			:inputValue="dataDic.remark"
			/>
		</view>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import partComponent from '@/devicePages/components/parts-device-record.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		imgupload,
		wPicker,
		partComponent
	},
	computed:{},
	data() {
		return {
			selectProIndex:0,
			dataDic: {
				partsCollarLists:[]
			},
		};
	},
	onLoad(option) {
		if(option.item){
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(dict.businessNo)
		}
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","检修记录详情");
		
	},
	onUnload() {},
	methods: {
		isshowPart(){
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
		//获取检修级别描述
		getLevelString(level) {
			if (level != undefined && level != null) {
				return level + "级检修"
			}
			return "--"
		},
		changeTab(index) {
			this.selectProIndex = index;
		},
		//加载详情数据
		loaddata(key){
			uni.showLoading();
			let url = this.$url.STOCK_SERVICE_DETAIL
			let param= {
				businessNo:key
			}
			this.$network
				.getData(url, 'GET', param)
				.then(result => {
					this.dataDic = {
						...result
					};
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
				});
		},
		//修改时间显示方
		goDetailCar(liseceid){
			let urlstr =  "/devicePages/record/device-record-detail?licenseId=" + liseceid
			uni.navigateTo({
				url: urlstr
			})
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
	margin-right: 10px;
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
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 290px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 270px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	border-radius: 5px
}
.row-tag {
	width: 150px;
	text-align: center;
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
	margin-top: 3px;
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

.input-style-list {
	border: 1px solid $uni-bg-color-grey;
	font-size: $uni-font-size-sm;
	width: 100px;
	min-width: 100px;
	padding: 2px;
	margin-right: 10px;
	border-radius: 4px;
}
</style>
