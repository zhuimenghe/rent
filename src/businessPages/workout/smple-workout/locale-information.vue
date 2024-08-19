<template>
	<view class="base-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{'现场接机'}}</view>
			<!-- <view class="title-right">{{'关联交机单'}}</view> -->
		</view>
		<selectorPick
		v-if="!isLX"
		title="接机时间"
		placeholder="请选择接机时间"
		:content="changeStr(dataDic.endDate)"
		:isRequire="true"
		@clickItem="showPick('endDate')"
		:isEdit="isEdit"
		/>
		<selectorPick
		title="结算时间"
		placeholder="请选择结算时间"
		:content="getSimdate(dataDic.settleDate)"
		:isRequire="true"
		@clickItem="showPick('settleDate')"
		:isEdit="isEdit"
		/>
		<view class="title-bg">
			<view class="title-left" style="font-size: 15px;">{{'确定退场设备'}}</view>
			<view class="title-right" style="font-size: 13px;" @click="gotoJJD" v-if="isEdit">{{'关联接机单'}}</view>
		</view>
		<list class="workin-dd-list">
			<cell class="workin-dd-list-cell" v-for="(item, index) in dataDic.orders" :key="index" v-if="showRow(item)">
				<view class="cell-input-view-machine">
					<view class="cell-input-view-machine-left">
						<text class="tag-view-base tag1">{{ item.typeName || '' }}</text>
						<text class="tag-view-base tag2">{{ item.heightName || '' }}</text>
						<text class="tag-view-base tag3">{{ item.machineList.length || '0' }}台</text>
						<text class="tag-view-base tag4">{{ item.settlementTypeName || '' }}</text>
						<text class="tag-view-base tag4" v-if="item.settlementType != '4' && item.settlementType != '6'">¥{{ item.hire || '' }}/{{ getType(item) }}</text>
						<text class="tag-view-base tag4" v-if="item.settlementType === '4' || item.settlementType === '6'">¥{{ item.hire || '' }}/天 ¥{{ item.hireMonthly || '' }}/月</text>
					</view>
					<view class="cell-input-view-machine-right" v-if="isEdit">
						<text class="tag-view-base tag5" @click="gotoDdCar(index, item)">{{ '复原' }}</text>
					</view>
				</view>
				<view class="cell-input-view-machine-list" v-for="(mitem, mindex) in item.machineList" :key="mindex">
					<view class="line-s" />
					<view class="cell-input-view-machine-list-head">
						<view class="head-top" style="display: flex;flex-direction: row;">
							自喷码: {{ mitem.printCode || '-' }}
							<!-- <view class="replace-text" v-if="item.height != mitem.machineHeight">【替】</view> -->
						</view>
						<view class="head-bottom">
							<text>{{ mitem.machineBrand || '--' }}-{{ mitem.machineTypeName || '--' }} | {{ mitem.licenseId || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view-list-row">
						<view class="cell-input-view-left text-color"><text>当前位置</text></view>
						<view class="cell-input-view-right" style="margin-left: 10px;">
							<text class="input-style-list">{{ mitem.address || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view-list-btn">
						<text class="tag-view-base" :class="ischeckOK(mitem.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'" @click="gotoCheckCar(mitem,index,mindex)">
							{{ ischeckOK(mitem.workCheckResults) ? '点检正常 >>' : '点检异常 >>' }}
						</text>
						<text v-if="isEdit" class="tag-view-base delbtn" @click="deleteCar(index, item, mindex, mitem)">删除</text>
					</view>
				</view>
			</cell>
		</list>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorInputIcon from '@/components/common/selector-pick/selector-inputwithicon.vue';
export default {
	components:{
		selectorPick,
		selectorInput,
		selectorInputIcon
	},
	props:{
		dataDic: {
			type: Object,
			default () {
				return {};
			}
		},
		isEdit:{
			type:Boolean,
			default:true
		},
		isLX:{
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
			
		};
	},
	created() {
		
	},
	methods: {
		showRow(item){
			if(item.machineList&&item.machineList.length>0){
				return true
			}else{
				return this.isEdit
			}
		},
		changeStr(str){
			if(str == null){
				return ""
			}
			return this.$dateUtil.timeFormatYMDHM(str)
		},
		getSimdate(str){
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		showPick(type){
			this.$emit('clickItem',type);
		},
		getType(item) {
			if (item.settlementType === '1') {
				return '天';
			} else if (item.settlementType === '5') {
				return '周';
			} else {
				return '月';
			}
		},
		ischeckOK(checkList) {
			if (!checkList) {
				return false;
			}
			let list = checkList.filter((o) => {
				return o.checked === false
			})
			if (list.length > 0) {
				return false;
			}
			return true;
		},
		gotoJJD(){
			let selects = []
			if (this.dataDic.deliverIds){
				selects = this.dataDic.deliverIds.split(',')
			}
			uni.navigateTo({
				url: "/businessPages/workout/service-receive/workout-receive-machine?contractNo=" + this.dataDic.contractNo + "&selects=" + encodeURIComponent(JSON.stringify(selects))
			})
		},
		gotoCheckCar(item,index,mindex){
			uni.navigateTo({
				url: './workout-check-list?machine=' + encodeURIComponent(JSON.stringify(item)) + "&index=" + index + "&mindex=" + mindex +"&iscleck=" + this.isEdit
			});
		},
		gotoDdCar(index,item){
			this.$emit('deleteMachine', {
				type: 'reset',
				data: index
			});
		},
		deleteCar(index, item, mindex, mitem){
			let machineList = [...item.machineList];
			machineList.splice(mindex, 1);
			let orderDic = {
				...item,
				usedNum:machineList.length.toString(),
				machineList: [...machineList]
			};
			let orderslist = [...this.dataDic.orders];
			orderslist.splice(index, 1, orderDic);
			let dict = {
				...this.dataDic,
				orders: [...orderslist]
			};
			this.$emit('deleteMachine', {
				type: 'delete',
				data: dict
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding:10px;
	background: #ffffff;
	border-radius: 10px;
}

.title-bg {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px;
	border-bottom: #e9e9e9 1px solid;
}
.title-left {
	flex: 1;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: #222831;
}
.title-right{
	font-size: $uni-font-size-base;
	font-weight: normal;
	color: $uni-color-primary;
}
.workin-dd-list {
	display: flex;
	flex-direction: column;
}
.workin-dd-list-cell {
	display: flex;
	flex-direction: column;
	padding: 0px 5px 5px 2px;
	margin-left: 10px;
	margin-right: 10px;
	background: #ffffff;
	border-bottom: $uni-line-color 1px solid;
}
.cell-input-view-machine {
	display: flex;
	margin-top: 5px;
	margin-bottom: 5px;
	flex-direction: row;
	justify-content: flex-start;
	background: #ffffff;
}

.cell-input-view-machine-left {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}

.cell-input-view-machine-right {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.tag-view-base {
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-sm;
	justify-content: center;
	align-items: center;
	margin-right: 5px;
	margin-top: 3px;
}

.tag1 {
	background: #eef9e8;
	color: #57c32d;
}

.tag2 {
	background: #eeeeee;
	color: #999999;
}

.tag3 {
	background: #fff6e7;
	color: #fab045;
}

.tag4 {
	background: #FFF1F0;
	color: #E60000;
}

.tag5 {
	background: $uni-color-primary;
	color: #ffffff;
	margin-left: 10px;
}

.cell-input-view-machine-list {
	display: flex;
	flex-direction: column;
	margin: 5px 10px;
}

.cell-input-view-machine-list-head {
	display: flex;
	flex-direction: column;
	font-size: $uni-font-size-base;
	color: #222831;
}
.head-top {
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

.text-color {
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-btn {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	padding-bottom: 5px;
}

.delbtn {
	margin-left: 20px;
	background: #ffffff;
	color: #fec7ce;
	border-color: #fec7ce;
	border-width: 1px;
	border-style: solid;
}

.checkbtnOK {
	background: #ffffff;
	color: #4ec365;
	border-color: #4ec365;
	border-width: 1px;
	border-style: solid;
}
.checkbtnError {
	background: #ffffff;
	color: #ff0000;
	border-color: #ff0000;
	border-width: 1px;
	border-style: solid;
}
.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	align-items: center;
}
</style>
