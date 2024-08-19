<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="dataDic.businessKey">配件调拨单详情</c-nav-bar-apply>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<selectorPick
			title="调拨单号"
			:isEdit="false"
			:content="dataDic.businessNo"
			:isRequire="false"
			/>
			<selectorPick
			title="调出区域"
			:isEdit="false"
			:content="dataDic.sourceRegionName"
			:isRequire="false"
			/>
			<selectorPick
			title="调入区域"
			:isEdit="false"
			:content="dataDic.targetRegionName"
			:isRequire="false"
			/>
			<selectorPick
			title="调拨人"
			:isEdit="false"
			:content="dataDic.transferName"
			:isRequire="false"
			/>
			<selectorPick
			title="调拨时间"
			:isEdit="false"
			:content="changestr(dataDic.allocationTime)"
			:isRequire="false"
			/>
			<!-- <selectorPick
			title="总价(元)"
			:isEdit="false"
			:content="dataDic.partsAmount"
			:isRequire="false"
			/> -->
			<selectorInput
			title="产生费用(元)"
			:isEdit="false"
			:content="dataDic.cost"
			:isRequire="false"
			/>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>调拨配件列表</text></view>
			</view>
			<view v-for="(item, index) in dataDic.partsAllocationLists" :key="index" class="cell-view">
				<partComponentsAllot
				:dataDic="item" 
				:isEdit='false'
				/>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view tilte-view-sub">
				<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
			</view>
			<imgupload 
			:isupload="false" 
			:imgFinishlist="dataDic.fileList" 
			/>
			<selectorArea
			title="备注"
			:isEdit="false"
			:content="dataDic.remark"
			:isRequire="false"
			/>
		</view>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import partComponentsAllot from '../part-components/part-components-allot.vue';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		imgupload,
		partComponentsAllot
	},
	computed: {},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			dataDic: {}
		};
	},
	onLoad(option) {
		if (option.item) {
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(dict.businessNo);
		}
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-acc-emit');
	},
	methods: {
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//撤回时获取详情
		loaddata(key) {
			let url = this.$url.ACC_ALLOT_DETAIL + key;
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...result
					};
				})
				.catch(err => {});
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
.cell-view {
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
}
.cell-input-view-row {
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
	margin: 10px;
	font-size: $uni-font-size-base;
}
.tilte-view-sub {
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
}
.cell-input-view-left {
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
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
.input-style-center {
	flex: 1;
	text-align: center;
}
.boldstyle {
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	color: $uni-text-color;
}
.gray-arrow {
	margin-left: 4px;
}
</style>
