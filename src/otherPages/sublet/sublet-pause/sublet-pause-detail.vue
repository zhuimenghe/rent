<template>
	<view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>基本信息</text>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租报停单号</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ pauseDic.businessNo || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租公司</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ pauseDic.companyName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>联系人</text>
				</view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ pauseDic.contactName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>联系人电话</text>
				</view>
				<view class="cell-input-view-right">
					<view class="text-style">
					<labelPhone :value="pauseDic.phoneNum"/></view>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>设备信息（共{{ pauseDic.machines.length || '0' }}辆，总计{{ pauseDic.total || '0.00' }}元）</text>
			</view>
			<view class="vehicle-list-container">
				<view v-for="(v, i) in pauseDic.machines" class="v-item-container" :key="i">
					<view class="item-top">
						<text>车号：{{ v.licenseId }}</text>
						<!-- <view class="top-right">
							<text>{{ v.stateName }}-{{ v.subStateName }}</text>
						</view> -->
					</view>
					<view class="item-row">
						<text>品牌：{{ v.brand || '--' }}</text>
						<text>自喷码：{{ v.printCode || '-' }}</text>
					</view>
					<view class="item-row">
						<tag-select 
						tagName="报停开始日期" 
						:value="getDate(v.beginDate)" 
						:textColor="textColor" 
						:fontSize="fontSize" 
						/>
						<tag-select 
						tagName="报停结束日期" 
						:value="getDate(v.endDate)" 
						:textColor="textColor" 
						:fontSize="fontSize"
						 />
					</view>
					<view class="item-row">
						<tag-select 
						tagName="预计报停天数" 
						:value="v.pauseDays || '--'" 
						:isSelect="false" 
						:textColor="textColor" 
						:fontSize="fontSize"
						/>
						<tag-select
						tagName="报停租金(元)" 
						:value="v.pauseHire || '0'" 
						:isSelect="false" 
						:textColor="textColor" 
						:fontSize="fontSize"
						/>
					</view>
					<view class="line-s" />
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>报停信息</text>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>报停类型</text>
				</view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ pauseDic.pauseCauseName || '--' }}</text>
				</view>
			</view>
			<imgupload 
			:isupload="false" 
			:imgFinishlist="pauseDic.fileList"  
			/>
			<text-label-item 
			tagName="备注" 
			:inputDisabled="true" 
			:inputValue="pauseDic.reason" 
			/>
		</view>
		<!-- <w-picker
		:selectList="pauseTypes" 
		@confirm="onConfirm"
		mode="selector" ref="selector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true"
		@confirm="onConfirm" 
		:disabledAfter="false" 
		:pickControl="true" 
		ref="date" 
		themeColor="#E60000" 
		/> -->
	</view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import TagSelect from '@/components/common/uni-tag/tag-select.vue';
import TagInput from '@/components/common/uni-tag/tag-input.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
// import timeCompare from '@/common/common-method/common-method.js';
import labelPhone from '@/components/common/common-ui/label-phone.vue';

export default {
	components: {
		wPicker,
		selectLabelItem,
		textLabelItem,
		labelArrow,
		TagSelect,
		TagInput,
		imgupload,
		labelPhone
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			textColor: '#333333',
			fontSize: '14px',
			pauseDic: {
				machines: []
			},
		};
	},
	onLoad(option) {
		let dict = JSON.parse(decodeURIComponent(option.item))
		this.loadData(dict)
	},
	onUnload() {
		// 取消监听事件
		uni.$off('sublet-device-list');
	},
	methods: {
		loadData(dict){
			uni.showLoading();
			let param = {
				businessNo: dict.businessNo
			}
			this.$network.getData(this.$url.SUBLET_PAUSE_DETAIL, 'GET', param).then(result => {
				this.pauseDic = { 
					...result
				};
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
		getDate(time) {
			if (!time) {
				return '';
			}
			return time.split(/\s+/)[0];
		},
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	width: 100%;
	height: 100%;
}

.pause-bg {
	display: flex;
	// flex: 1;
	// width: 100%;
	// margin-bottom: 68px;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

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
	padding: 10px;
	border-bottom:$uni-line-color 1px solid;
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
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.text-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}

.input-style {
	text-align: right;
	// border-width: 0px 0px 1px 0px;
	// border-style: solid;
	// border-color: $uni-bg-color-grey;
	// width: 140px;
	// height: 35px;
}

.model-tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	padding: 15px;
	align-items: center;
}

.tag-right,
.top-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
}

.labelstyle {
	color: $uni-color-primary;
	font-size: 24px;
	margin-left: 10px;
}

// .attachment-icon {
// 	color: $uni-color-primary;
// 	font-size: 14px;
// 	margin-left: 10px;
// }

.delete-items-icon {
	color: #ff0000;
	font-size: 14px;
	margin-left: 10px;
}

.vehicle-list-container {
	padding: 15px;
}

.item-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	height: 45px;
	line-height: 45px;
}

.item-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 8px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.item-row tag-select {
	flex: 1;
}

.pause-options {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: $uni-color-primary;
}

.item-row text {
	flex: 1;
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
.line-s {
	margin-top: 5px;
	margin-left: 5px;
	margin-right: 5px;
	height: 1px;
	background: #eeeeee;
}
</style>
