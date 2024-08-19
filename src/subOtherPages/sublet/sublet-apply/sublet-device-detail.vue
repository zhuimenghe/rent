<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns  >
			转租设备详情
		</c-nav-bar-btns >
		<recordDetailHead :dataDic="dataDic" :qrcodeUrl="qrcodeUrl" :downloadQrcodeUrl="downloadQrcodeUrl"
			:isShowQrCode="isShowQrCode" :isShowUPDATA="isShowUPDATA" @canScroll="canScroll" />
		<!-- 转租信息 -->
		<view class="rentinfo">
			<view class="info-title">转租信息</view>
			<view class="info-content">
				<view class="info-item">
					<text class="text-gray">转租单号</text>
					<text class="text-dark">{{ dataDic.businessKey || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="text-gray">转租公司</text>
					<text class="text-dark">{{ dataDic.subletCompanyName || '-' }}</text>
				</view>
				<view class="info-item">
					<text class="text-gray">启用日期</text>
					<text class="text-dark">{{ dataDic.subletDate || '-' }}</text>
				</view>
			</view>
		</view>
		<!-- 分个段 -->
		<view class="title-search-bg">
		<view class="line-css"></view>
			<view class="title-search">
				<view class="flex-sub">
					<c-sun-tab :value.sync="tabindex" :tabList="tabList" @change="tabChange" :shownum="false"></c-sun-tab>
				</view>
				<view class="left-title-search" v-if="tabindex == 0">
					<view class="group-check" @click="changeGroup">
						<mycheckbox :checked="isshowContract" style="transform: scale(0.7);" />
						<text>{{ '按合同分组' }}</text>
					</view>
					<view style="margin-left: 15px;margin-right: 15px;background: #F0F2F4;height: 10px;width: 1px;" />
					<view class="filtter-click" @click="showFiltterView">{{ '筛选' }}</view>
				</view>
				<view class="text-primary flex-sub text-right" v-else>
					合计：￥{{ moneyUtil.dealNumber(settleTotal) }}
				</view>
			</view>
			<view class="filtter-item-bg" v-if="showFiltter">
				<recordSelector title="自定义显示" placeholder="自定义类型" :content='typeshow'
					@clickItem="showPick($event, 'show')" />
				<view style="margin-left: 10px;margin-right: 10px;background: #F0F2F4;height: 15px;width: 1px;" />
				<recordSelector title="开始时间" placeholder="开始时间" :content='beginDate'
					@clickItem="showPick($event, 'begin')" />
				<view style="margin-left: 10px;margin-right: 10px;background: #F0F2F4;height: 15px;width: 1px;" />
				<recordSelector title="结束时间" placeholder="结束时间" :content='endDate' @clickItem="showPick($event, 'end')" />
			</view>
			<view class="bottom-save-btn" v-if="showFiltter">
				<view class="left-save-btn" @click="gotosearch('reset')">{{ '重置' }}</view>
				<view class="right-save-btn" @click="gotosearch('ok')">{{ '查询' }}</view>
			</view>
			<view class="line-css"></view>
			<view v-if="tabindex==0">
			<detailList :dataList="lifecycleRecord" v-if="!isshowContract"/>
			<detailContractList :dataList="contractcycleRecord" v-if="isshowContract" @getExArrow = "getExArrow"/>
		</view>
		<view v-else>
			<c-timeline :list="settleList">
				<template v-slot:default="{item,index}" >
					<lvli-card :item="item"></lvli-card>
				</template>
			</c-timeline>
		</view>
	</view>
	<w-picker
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm"
		:disabledAfter="false"
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>
<script>
import recordSelector from './sublet-device/record-title-select.vue';
import detailList from './sublet-device/record-detail-list.vue';
import detailContractList from './sublet-device/record-detail-contract-list.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import recordDetailHead from './sublet-device/record-detail-head.vue'
import LvliCard from './sublet-device/lvli-card.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';

export default {
	components: {
		selectLabelItem,
		textLabelItem,
		imgupload,
		recordDetailHead,
		LvliCard,
		recordSelector,
		detailList,detailContractList,
		wPicker
	},
	data() {
		return {
			settleList:[],
			isshowContract: true,
			tabindex: 0,
			selectType: '',
			tabList: ['设备履历', '结算履历'],
			businessNo: "",
			subletDic: {},
			isShowUpdate: false,
			dataDic: {},
			showFiltter: false,
			qrcodeUrl: '',
			downloadQrcodeUrl: '',
			isShowQrCode: false,
			isShowUPDATA: false,
			tabScroller: true,
			circleTreeList: [],//生命周期树
			beginDate: '',
			endDate: '',
			lifecycleRecord:[],//非合同数据列表
			positiveOrder:true,
			contractcycleRecord:[],//合同数据列表
			typeshow:'全部',
		};
	},
	onLoad(option) {
		this.businessNo = option.businessNo||null;
		this.licenseId = option.licenseId||null;
		uni.showLoading()
		this.getDetail();
		this.getCircleData(option.licenseId)
		this.getSettleHistory(option.licenseId)
		uni.$on('refresh-device-circle', item => {
			let list = item.list;
			this.circleTreeList = [...list];
			this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
		})
	},
	onUnload() {
		uni.$off('refresh-device-circle')
	},
	methods: {
		orderReset(){
			this.positiveOrder = !this.positiveOrder
			let reverseList = [...this.lifecycleRecord.reverse()]
			this.lifecycleRecord = [...reverseList];
		},
		getExArrow(e){
			let item = e.item;
			let index = e.index;
			let dict = {
				...item,
				exportArrow:!item.exportArrow
			}
			this.contractcycleRecord.splice(index,1,dict);
		},
		async getSettleHistory(licenseId){
			let res = await this.$network.fetchMachineSettleHistory(licenseId);
			this.settleList = res.list.map(s=>{
				return{
					...s,
					// beginDate:s.beginDate ? s.beginDate.split(' ')[0] : '',
					// endDate:s.endDate ? s.endDate.split(' ')[0] : '',
					// enableDate:s.enableDate ? s.enableDate.split(' ')[0] : '',
					// settleDate:s.settleDate ? s.settleDate.split(' ')[0] : '',
				}
			});
			this.settleTotal = res.total
		},
		onConfirm(val){
			if(this.selectType =='begin'){
				this.beginDate = val.result
			}else if(this.selectType =='end'){
				this.endDate = val.result
			}
		},
		getCircleData(licenseId) {
			uni.showLoading()
			this.$network.getData(this.$url.MACHINE_LIVE_CIRCLE_FILTER, 'GET', null).then(result => {
				this.circleTreeList = result.map((o) => {
					return {
						...o,
						checked: this.isclickChoose(o.child)
					}
				});
				this.dealCircleList(this.circleTreeList, licenseId)
				uni.hideLoading();
			}).catch(err => {
				this.getlifecircle([], licenseId)
				uni.hideLoading();
			});
		},
		isclickChoose(list) {
			return list.some((o) => {
				return o.checked == true
			})
		},
		dealCircleList(result, licenseId) {
			let circleTypeList = [];
			result.forEach((o) => {
				if (o.checked) {
					let child = o.child || [];
					child.forEach((a) => {
						if (a.checked) {
							circleTypeList.push(a)
						}
					})
				}
			})
			this.typeshow = this.isallChoose(result) ? '全部' : '个性化';
			if (this.isshowContract) {
				//合同
				this.getContractlifecircle(circleTypeList, licenseId);
			} else {
				//非合同
				this.getlifecircle(circleTypeList, licenseId);
			}
		},
		//获取生命周期数据
		getlifecircle(circleTypeList, licenseId) {
			let filtterarr = [];
			circleTypeList.forEach(o => {
				filtterarr.push(o.value);
			});
			let paramDic = {
				licenseId: licenseId,
				current: this.page,
				size: 10000,
				businessTypeList: filtterarr,
				startTime: this.beginDate == '' ? undefined : (this.beginDate + " 00:00:00"),
				endTime: this.endDate == '' ? undefined : (this.endDate + " 23:59:59")
			};
			this.$network.getData(this.$url.MACHINE_RECORD_NEWLIFECYCLE, 'POST', paramDic).then(result => {
				this.lifecycleRecord = [...result.records];
				this.positiveOrder = true;
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		getContractlifecircle(circleTypeList, licenseId) {
			let filtterarr = [];
			circleTypeList.forEach(o => {
				filtterarr.push(o.value);
			});
			let paramDic = {
				licenseId: licenseId,
				current: this.page,
				size: 10000,
				businessTypeList: filtterarr,
				startTime: this.beginDate == '' ? undefined : (this.beginDate + " 00:00:00"),
				endTime: this.endDate == '' ? undefined : (this.endDate + " 23:59:59")
			};
			this.$network.getData(this.$url.MACHINE_RECORD_GROUP_LIFECYCLE, 'POST', paramDic).then(result => {
				this.contractcycleRecord = result.map((o) => {
					return {
						...o,
						exportArrow: false
					}
				});
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		//全部选中
		isallChoose(list) {
			let contactList = [];
			list.forEach(o => {
				contactList = contactList.concat(o.child);
			})
			return contactList.every((o) => {
				return o.checked == true
			})
		},
		gotosearch(type) {
			uni.showLoading();
			if (type == 'reset') {
				this.showFiltter = false;
				this.beginDate = "";
				this.endDate = "";
				this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
			} else {
				this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
			}
		},
		showPick(e, type) {
			this.selectType = type;
			if (type == 'show') {
				uni.navigateTo({
					url: './life-circle-flitter?item=' + encodeURIComponent(JSON.stringify(this.circleTreeList))
				})
			} else {
				this.$refs.date.show();
			}
		},
		showFiltterView() {
			this.showFiltter = !this.showFiltter
		},
		//显示分组类型
		changeGroup() {
			this.isshowContract = !this.isshowContract
			this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
		},
		tabChange(e) {
			this.tabindex = e.index;
		},
		canScroll(val) {
			if (val == '0') {
				this.tabScroller = false
			} else {
				this.tabScroller = true
			}
		},
		getDate(time) {
			if (!time)
				return "--"
			return time.split(/\s+/)[0];
		},
		async getDetail() {
			let param = {
				businessNo: this.businessNo,
				licenseId: this.licenseId
			}
			//  let res=await this.$network.machineDetail(this.licenseId);
			this.$network
				.getData(this.$url.SUBLET_DEVICE_DETAIL, 'GET', param)
				.then(result => {
					this.subletDic = {
						...result
					};
					this.dataDic = { ...result };
					this.getProcessNode()
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
				});
		},
		getProcessNode() {
			this.workflowcommon.getOnlineList(this.subletDic.businessKey).then((result) => {
				if (result && result.length === 1) { //只有一条说明被驳回过，只显示上次申请的数据
					this.nodeList = result
				} else {
					this.nodeList = result ? result.filter(o => {
						return o.endTime && o.type === 'completed'
					}) : []
				}
				this.isShowUpdate = this.isShowModel('update', this.nodeList, false)

			})
		},
		isShowModel(model, nodeList, isFrist) {
			let isShow = false; //是否显示model
			if (nodeList.length > 0) {
				//判断当前是是否是第一步
				if (isFrist) {
					//第一步是否显示model
					if (nodeList[0].formKey && nodeList[0].formKey.indexOf(model) !== -1) {
						isShow = true
					}

				} else { //
					//遍历所有到目前为止的流程中是否显示model
					for (let i = 0; i < nodeList.length; i++) {
						if (nodeList[i].formKey && nodeList[i].formKey.indexOf(model) !== -1) {
							isShow = true
							return true
						}

					}
				}


			} else { //没有流程时，都显示
				isShow = true;
			}

			return isShow;
		},
	},

};
</script>

<style lang="scss" scoped>
.navtitle{
	font-size: 36rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #222222;
}
.record-detail-bg-view {
	width: 100%;
	background: $uni-bg-color-grey;
}
.title-search-bg-position{
	position: fixed;
	width: 100%;
	top: 0px;
	display: flex;
	flex-direction: column;
	background:#FFFFFF;
	z-index: 50;
}
.line-css{
	width: 100%;
	height: 13px;
	background: $uni-bg-color-grey;
	z-index: 105;
}
.title-search-bg{
	display: flex;
	flex-direction: column;
	background:#FFFFFF;
	z-index: 105;
	margin-bottom: 16px !important;
}
.title-search{
	display: flex;
	flex-direction: row;
	padding:0 12px;
	align-items: center;
	background:#FFFFFF;
}
.title-left-text{
	font-weight: bold;
	font-size: 16px;
}
.left-title-search{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.group-check{
	display: flex;
	flex-direction: row;
	font-size: $uni-font-size-base;
	align-items: center;
}
.filtter-click{
	display: flex;
	color: #E60000;
	font-size: $uni-font-size-base;
}
.filtter-item-bg{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding:0px 12px;
	align-items: center;
	margin-top: 10px;
}
.bottom-save-btn{
	display: flex;
	flex-direction: row;
	padding: 12px;
}
.left-save-btn{
	flex: 1;
	margin-right: 10px;
	padding: 8px 0px;
	background: #F0F2F4;
	color: #000000;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	text-align: center;
}
.right-save-btn{
	flex: 1;
	margin-left: 10px;
	padding: 8px 0px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	text-align: center;
}


.content {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.content-container {}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	// margin: 10px;
	background: #ffffff;
	// border-radius: 4px;
	padding-bottom: 10px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 10px;
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
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.input-style {
	flex: 1;
	text-align: right;
}

.choose-device-text {
	color: $uni-color-primary;
}

.item-row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 6px 16px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.item-title {
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	padding: 4px 0px;
}

.item-bottom {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding: 4px 16px;
	font-size: $uni-font-size-base;
	border-color: $uni-bg-color-grey;
	border-width: 1px 0px 0px 0px;
	border-style: solid;
	color: #FF0000;
}

.bottom-view {
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

.bottom-left-view {
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

.bottom-right-view {
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

.item-tag {
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	align-items: flex-start;
}

.tag-view {
	display: flex;
	height: 24px;
	line-height: 24px;
	padding: 0px 4px;
	border-radius: 3px;
	font-size: $uni-font-size-sm;
	justify-content: center;
	align-items: center;
	margin-right: 5px;
	margin-top: 3px;
}

.tag1 {
	background: #EEF9E8;
	color: #57C32D;
}

.tag2 {
	background: #F9F0FF;
	color: #722ED1;
}

.tag3 {
	background: #FFF0E9;
	color: #FB7135;
}

.tag4 {
	background: #FFF1F0;
	color: #E60000;
}

.tag5 {
	background: $uni-color-primary;
	color: #FFFFFF;
}

.tag6 {
	background: #FFF8EE;
	color: #FCA01F;
}

.line-tag {
	min-width: 64px;
}

.row-line {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: $uni-font-size-base;
	min-height: 30px;
}

.text-gray {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #8C8C8C;
}

.text-dark {
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #222222;
}

.rentinfo {
	background-color: #F5F4F9;

	.info-title {
		position: relative;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #222222;
		height: 80rpx;
		line-height: 80rpx;
		margin-left: 24rpx;

		&::before {
			content: '';
			position: absolute;
			top: 11px;
			left: -12px;
			width: 8rpx;
			height: 32rpx;
			background: #E60000;
		}
	}

	.info-content {
		background-color: #fff;
		padding: 0 23rpx;

		.info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 88rpx;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}
		}
	}
}
::v-deep .licenseIdStyle{
	padding: 3rpx 10rpx;
}
</style>
