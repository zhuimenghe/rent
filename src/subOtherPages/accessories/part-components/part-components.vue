<template>
	<view class="part-components-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-part-order-bg">
			<input
			class="top-part-order-bg-input"
			placeholder="请输入料号"
			:value="dataDic.itemNumber"
			type="text"
			@input="textChange"
			:disabled="!isEdit"
			/>
			<view style="display: flex;margin-left: 15px;" v-if="isNumEdit">
				<uni-number-box
				:min="0" 
				:max="getLeftNum(dataDic)" 
				:compare="false" 
				@change="getNumValue" 
				:value="getStringToInt(dataDic.partsNumber)" 
				:inputdisabled="false"
				/>
			</view>
			<view style="display: flex;margin-left: 15px;" v-else>
				<uni-number-box
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
			<view class="top-part-type-source-item"><text class="text-style">采购方式:</text>{{ dataDic.purchasingMethod || '--' }}</view>
			<view class="top-part-type-source-item"><text class="text-style">配件来源:</text>{{ dataDic.partsSourceName || '--' }}</view>
		</view> -->
		<!-- <view class="top-part-type-source">
			<view class="top-part-type-source-item"><text class="text-style">单价(元):</text>{{ dataDic.salePrice || '0' }}</view>
			<view class="top-part-type-source-item"><text class="text-style">总价(元):</text>{{ dataDic.partsAmount || '0' }}</view>
		</view> -->
		<!-- <view class="top-part-type-source">
			<view class="top-part-type-source-item"><text class="text-style">区域:</text>{{ dataDic.orgName || '--' }}</view>
			<view class="top-part-type-source-item"><text class="text-style">入库时间:</text>{{ changestr(dataDic.storageTime) || '--' }}</view>
		</view> -->
		<!-- <view class="top-part-type-bg">
			<text class="text-style">适用范围:</text>{{ dataDic.partsBasics.scopeApplication || '--' }}
		</view> -->
		<view class="top-part-type-bg">
			<view class="top-part-type-bg-left">
				<text class="text-style">适用范围:</text>{{ dataDic.partsBasics.scopeApplication || '--' }}
			</view>
			<i class="iconfont delete-icon iconzl--shanchu" @click="deleteItem" v-if="isEdit||isNumEdit"></i>
		</view>
		<!-- <view class="top-part-type-bg">
			<view class="top-part-type-bg-left">
				<text class="text-style">备注:</text>{{ dataDic.partsBasics.remark || '--' }}
			</view>
			<i class="iconfont delete-icon iconzl--shanchu" @click="deleteItem" v-if="isEdit||isNumEdit"></i>
		</view> -->
	</view>
</template>

<script>
import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
export default{
	components:{
		UniNumberBox
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
		itemType:{
			type:String,
			default:'recelive'
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
		getLeftNum(item) {
			if(item.stockTotal==undefined && Number(item.canReturnNumber)){
				return item.canReturnNumber
			}else if(item.stockTotal==undefined &&  item.canReturnNumber==undefined){
				return 999
			}
			let stockTotal = item.stockTotal || 0;
			let leftNum = Number(stockTotal);
			return leftNum;
		},
		getStringToInt(val){
			if(val){
				return parseInt(val)
			}
			return 0
		},
		getNumValue(val) {
			this.$emit('numChange', val.toString());
		},
		textChange(val){
			// setTimeout(()=>{
			// 	this.$emit('textChage', val.detail.value);
			// }, 20);
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
</style>
