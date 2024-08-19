<template>
	<view class="creat-invoice-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>设备号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.licenseId || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.printCode || '-' }}</text>
				</view>
			</view>
			<view style="height: 1px;flex: 1;background: #EEEEEE;margin-top: 10px;margin-bottom: 5px;" />
			<select-label-item tagName="补液时间" :isRequired="true" hint="请选择补液时间" :value="startTime" :icon="dateIcon" @clickItemLabel="chooseStartTime" />
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>补液人</text>
					<text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right"><input class="input-style" type="text" v-model="repairperson" placeholder="请输入补液人姓名...." /></view>
			</view>
			<view style="height: 1px;flex: 1;background: #FFFFFF;margin-top: 5px;margin-bottom: 5px;" />
			<imgupload 
			@uploadfinish="uploadfinish" 
			@deleteUrl="deleteUrl" 
			type="inspection" 
			uploadType="attachment" 
			maximg="30" />

			<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" />
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
		<!-- 日历 -->
		<w-picker mode="dateTime" startYear="2000" endYear="3000" :current="true" @confirm="dialog" :disabledAfter="false" ref="datepick" themeColor="#E60000" />

		<!-- 类型选择 -->
		<w-picker :selectList="selectList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />

		<alertPopup ref="aletrview" @getAssignList="getAssignList" :mask-click="true" />
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		wPicker,
		imgupload,
		alertPopup
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			righticon: 'iconarrow-right',
			dataDic: {},
			startTime: '',
			repairperson: '',
			remark: '',
			fileList: [],
			selectList:[]
		};
	},
	onLoad(option) {
		if (option.item) {
			let item = JSON.parse(decodeURIComponent(option.item));
			this.loadData(item.licenseId);
		}
	},
	onUnload() {},
	methods: {
		loadData(licenseId) {
			let urlstr = this.$url.MACHINE_INFUSION_INIT + licenseId;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					this.dataDic = result;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		chooseStartTime() {
			this.$refs.datepick.show();
		},
		showdialog() {
			this.$refs.selector.show();
		},
		remarkmethod(val) {
			this.remark = val;
		},
		//弹窗回调
		dialog(val) {
			this.startTime = val.result;
		},
		//上传图片回调
		uploadfinish(val) {
			let list = val.data;
			this.fileList = list;
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			this.fileList = list;
		},
		//取消按钮
		clickecancle() {
			uni.navigateBack({
				delta: 1
			});
		},
		//确定按钮
		clicksave() {
			if (this.startTime === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择补液时间'
				});
				return;
			}
			if (this.repairperson === '') {
				uni.showToast({
					icon: 'none',
					title: '请输入补液人'
				});
				return;
			}
			// this.httprequestData();
			this.submitSaveData('');
		},
		httprequestData() {
			uni.showLoading({
				mask:true
			});
			this.workflowcommon
				.getFirstNodeUser('machineapi', 'infusion')
				.then(showToast => {
					this.$datestr.printlog(showToast);
					if (showToast) {
						this.$refs.aletrview.open();
						uni.hideLoading();
					} else {
						let assnstr = this.workflowcommon.submitData(false, []);
						this.$datestr.printlog(assnstr);
						this.submitSaveData(assnstr);
					}
				})
				.catch(error => {
					uni.showToast({
						icon: 'none',
						title: '请求失败,请稍后重试'
					});
					uni.hideLoading();
				});
		},
		//弹窗提示返回
		getAssignList(val) {
			let alist = val.selectArr;
			let remarkstr = val.remark;
			let assnstr = this.workflowcommon.submitData(true, alist);
			this.submitSaveData(assnstr);
		},
		submitSaveData(val) {
			uni.showLoading({
				mask:true
			});
			let savedic = {
				licenseId: this.dataDic.licenseId,
				startDate: this.startTime,
				repairter: this.repairperson,
				remark: this.remark,
				serialNumber:this.dataDic.serialNumber,
				fileList:this.fileList 
			};
			this.$datestr.printlog(JSON.stringify(savedic));
			let url = this.$url.MACHINE_INFUSION_CREATE;
			this.$network
				.getData(url, 'POST', savedic)
				.then(result => {
					uni.$emit('refreshData-infusion', {
						type:"infusion"
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					uni.navigateBack({
						delta: 2,
						animationDuration: 200
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.creat-invoice-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	margin-bottom: 70px;
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
	margin-right: 10px;
}
.input-style {
	flex: 1;
	text-align: right;
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
	background: #ffffff;
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
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
