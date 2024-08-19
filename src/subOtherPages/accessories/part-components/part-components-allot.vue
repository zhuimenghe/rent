<template>
	<view class="part-components-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-part-order-bg">
			<input
			@click="goTo"
			class="top-part-order-bg-input"
			placeholder="请输入料号"
			:value="dataDic.itemNumber"
			type="text"
			:disabled="true"
			/>
			<view style="display: flex;margin-left: 15px;" v-if="isEdit">
				<UniNumberBox
				:min="0" 
				:max="getLeftNum(dataDic)" 
				@change="getNumValue" 
				:value="dataDic.partsNumber" 
				:inputdisabled="false"
				/>
			</view>
			<view style="display: flex;margin-left: 15px;" v-else>
				<UniNumberBox
				:min= "dataDic.partsNumber"
				:max= "dataDic.partsNumber"
				:compare="false"
				:value="dataDic.partsNumber"
				/> 
			</view>
		</view>
		<view class="top-part-type-bg-tag">
			<text class="tag-view tag1">{{ dataDic.partsBasics.modelName || '--' }}</text>
			<!-- <text style="margin-left: 5px;margin-right: 5px;">|</text> -->
			<text class="tag-view tag2">{{ dataDic.partsBasics.category || '--' }}</text>
			<!-- <text style="tag-view margin-left: 5px;margin-right: 5px;">|</text> -->
			<text class="tag-view tag3">{{ dataDic.partsBasics.name || '--' }}</text>
		</view>
		<!-- <view class="top-part-type-source">
			<view class="top-part-type-source-item"><text class="text-style">采购方式:</text>{{ dataDic.purchasingMethodName || '' }}</view>
			<view class="top-part-type-source-item"><text class="text-style">配件来源:</text>{{ dataDic.partsSourceName || '' }}</view>
		</view>
		<view class="top-part-type-source">
			<view class="top-part-type-source-item"><text class="text-style">单价(元):</text>{{ dataDic.salePrice || '0' }}</view>
			<view class="top-part-type-source-item"><text class="text-style">总价(元):</text>{{ dataDic.partsAmount || '0' }}</view>
		</view> -->
		<view class="top-part-type-source">
			<view class="top-part-type-source-item"><text class="text-style">适用范围:</text>{{ dataDic.partsBasics.scopeApplication || '--' }}</view>
			<i class="iconfont delete-icon iconzl--shanchu" v-if="isEdit" @click="deleteItem"></i>
		</view>
		<selectorArea
		title="备注"
		:isEdit="false"
		:content="dataDic.partsBasics.remark"
		:isRequire="false"
		@textChage="textChange"
		/>
		<!-- <view class="top-part-type-bg">
			<view class="top-part-type-bg-left">
				<view class="top-part-type-source-item"><text class="text-style">厂商品牌:</text>{{ dataDic.brandName || '' }}</view>
			</view>
			<i class="iconfont edit-icon iconzl--bianji" @click="goTo" v-if="isEdit"></i>
			<i class="iconfont delete-icon iconzl--shanchu" v-if="isEdit" @click="deleteItem"></i>
		</view> -->
	</view>
</template>

<script>
// import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import UniNumberBox from '@/components/common/uni-number-box/uni-num-box.vue';
export default{
	components:{
		UniNumberBox,
		selectorArea
	},
	props:{
		isEdit:{
			type:Boolean,
			default:true
		},
		isNumEdit:{
			type:Boolean,
			default:true
		},
		dataDic: {
			type: Object,
			default () {
				return {};
			}
		}
	},
	methods:{
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		goTo(){
			this.$emit('goTo', "");
		},
		getLeftNum(item) {
			console.log(item);
			let stockTotal = item.stockTotal || '999';
			let leftNum = Number(stockTotal);
			return leftNum;
		},
		getNumValue(val) {
			this.$emit('numChange', val.toString());
		},
		textChange(val){
			setTimeout(()=>{
				this.$emit('textChage', val.detail.value);
			}, 20);
		},
		deleteItem(){
			this.$emit('deleteItem', "");
		}
	}
}
</script>

<style lang="scss" scoped>
.part-components-bg{
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
	width: 100%;
	padding-bottom: 10px;
}
.top-part-order-bg{
	display: flex;
	flex-direction: row;
	padding: 10px;
	align-items: center;
	justify-content: flex-start;
	border-bottom: $uni-line-color 1px solid;
}
.top-part-order-bg-input{
	flex: 1;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg-tag{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-source{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-source-item{
	display: flex;
	flex: 1;
}
.text-style{
	min-width: 120rpx;
	color: #999999;
	font-size: $uni-font-size-base;
}
.tag-view {
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-base;
	justify-content: center;
	align-items: center;
	margin-right: 8px;
	margin-top: 3px;
}
.tag1 {
	
	background: #EEF9E8;
	color: #57C32D;
}

.tag2 {
	background: #FFF1F0;
	color: #E60000;
}

.tag3 {
	background: #FFF6E7;
	color: #FAB045;
}
.top-part-type-bg-left{
	display: flex;
	flex: 1;
}
.delete-icon{
	font-size: 17px;
	color: #FF0000;
	margin-left: 10px;
}
.edit-icon{
	color: #E60000;
	font-size: 16px;
	margin-left: 8px;
}
</style>
