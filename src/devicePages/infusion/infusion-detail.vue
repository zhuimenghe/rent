
<template>
	<view class="creat-invoice-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>设备号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.machineDto ? dataDic.machineDto.licenseId : "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>自喷码</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.machineDto ? dataDic.machineDto.printCode : "--"}}</text>
				</view>
			</view>
			<view style="height: 1px;flex: 1;background: #EEEEEE;margin-top: 10px;margin-bottom: 5px;"/>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>补液人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{objDic.repairter || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>补液时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{objDic.startDate || "--"}}</text>
				</view>
			</view>
			<imgupload
			:isupload="false"
			:imgFinishlist='objDic.fileList'/>
			
			<text-label-item
			tagName="备注" 
			:inputDisabled = "true"
			:inputValue="objDic.remark"/>
		</view>
	</view>
</template>
<script>
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
export default {
	components: {
		textLabelItem,
		imgupload,
	},
	data() {
		return {
			dateIcon:"iconzl--rili",
			righticon:"iconarrow-right",
			dataDic:{},
			objDic:{}
		};
	},
	onLoad(option) {
		if(option.item){
			this.$datestr.printlog(option.item)
			this.dataDic = JSON.parse(option.item);
			this.loadData();
		}
	},
	onUnload() {
	},
	methods: {
		loadData() {
			let url = this.$url.MACHINE_INFUSION_DETAIL + this.dataDic.id;
			this.$network.getData(url, 'GET', null).then(result => {
					this.objDic = result;
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
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
</style>
