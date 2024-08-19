<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-apply :business-key="dataDic.businessKey">调整单价详情</c-nav-bar-apply>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>配件信息</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>单号:</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.businessNo || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>型号:</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsBasics.modelName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsBasics.name || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>类别</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsBasics.category || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>品牌</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsBasics.brandName || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>适用范围</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsBasics.scopeApplication || "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>来源</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsSourceName || "--"}}</text>
				</view>
			</view>
			<text-label-item tagName="备注" :inputValue="dataDic.partsBasics.remark" :inputDisabled='true' tagColor="#999999"/>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>价格修改</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>当前销售单价</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.originalAmount || "0"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>调整后单价</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.adjustedAmount || "0"}}</text>
				</view>
			</view>
			<text-label-item
			tagName="备注" 
			@ipnuttext="remarkmethod"
			:inputValue="dataDic.remark"
			/>
		</view>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
export default{
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
	},
	data(){
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			
			itemData: null,
			dataDic:{}
		}
	},
	onLoad(option) {
		if (option.item) {
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(dict.businessNo)
		}
	},
	methods:{
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		//撤回时获取详情
		loaddata(key) {
			let url = this.$url.ACC_PRICE_DETAIl + key
			this.$network.getData(url, 'GET', null).then(result => {
				this.dataDic = {
					...result,
				};
			}).catch(err => {});
		},
	}
}
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
	min-width: 60px;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.cell-input-view-right {
	display: flex;
	flex: 1;
	min-height: 24px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.cell-section-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	margin: 2px 4px;
}
.cell-between {
	display: flex;
	margin: 0px 4px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.cell-section-view-width {
	display: flex;
	flex-direction: row;
	flex: 1;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	align-items: center;
	justify-content: center;
}

.cell-view {
	font-size: $uni-font-size-base;
	font-weight: bold;
	color: $uni-text-color
}
.cell-input-view-list {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	min-height: 30px;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	flex: 1;
}

.cell-input-view-list-column {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 4px;
}
.cell-input-view-left-small {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 20px;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
}
.add-btn {
	background-color: $uni-color-primary;
	padding: 2px 6px;
	border-radius: 4px;
	color: #FFFFFF;
}
.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 10px;
}
.workin-dd-list {
	display: flex;
	flex-direction: column;
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
