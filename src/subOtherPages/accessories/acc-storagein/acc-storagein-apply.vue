<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="dataDic.businessKey">入库单详情</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm" :orgId="dataDic.orgId">
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
				</view>
				<selectorPick title="入库单号" :isEdit="false" :content="dataDic.businessNo" :isRequire="true" />
				<selectorPick title="区域" :content="dataDic.orgName" :isRequire="true" :isEdit="false" />
				<selectorPick title="入库人" :content="dataDic.warehousesName" :isRequire="true" :isEdit="false" />
				<selectorPick title="入库时间" :content="changestr(dataDic.storageTime)" :isRequire="true" :isEdit="false" />
				<selectorPick title="总价(元)" :isEdit="false" :content="dataDic.partsAmount" :isRequire="false" />
			</view>
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>入库配件列表</text></view>
				</view>
				<view v-for="(item, index) in dataDic.partsStorageLists" :key="index" class="cell-view"><partComponentsAdd :isEdit="false" :dataDic="item" /></view>
			</view>
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
				</view>
				<imgupload :isupload="false" :imgFinishlist="dataDic.fileList" />
				<selectorArea title="备注" placeholder="请输入备注" :content="dataDic.remark" :isRequire="false" :isEdit="false" />
			</view>
		</approve-step>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import partComponentsAdd from '../part-components/part-components-add.vue';
import approveStep from '@/components/workflow/approve-step.vue';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		imgupload,
		partComponentsAdd,
		approveStep
	},
	computed: {},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			itemData: {},
			dataDic: {}
		};
	},
	onLoad(option) {
		if (option.item) {
			this.itemData = JSON.parse(decodeURIComponent(option.item));
		}
	},
	onUnload() {},
	methods: {
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		dataForm(val) {
			this.dataDic = JSON.parse(val);
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
