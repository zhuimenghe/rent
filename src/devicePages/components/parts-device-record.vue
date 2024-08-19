<template>
	<view class="part-components-bg">
		<view class="head-cell">
			<view class="left-title"><text>配件信息</text></view>
			<view class="right-title" @click="addacc" v-if="isEdit">
				<text>+ 新增</text>
			</view>
		</view>
		<view v-for="(item,index) in dataDic.partsCollarLists" :key="index" class="cell-view">
			<view class="top-part-order-bg">
				<view class="top-part-type-bg-tag">
					<!-- <text class="tag-view tag2" v-if="item.itemNumber">{{ item.partsBasics.category || '--' }}</text> -->
					<text class="tag-view tag3">{{ item.partsBasics.name || '--' }}</text>
					<text class="tag-view tag1">{{ item.partsBasics.modelName || '--' }}</text>
				</view>
				<view style="display: flex;margin-left: 15px;" v-if="isEdit">
					<uni-number-box 
					:min="0" 
					:max="getLeftNum(item)" 
					:compare="false" 
					@change="getNumValue($event,index,item)" 
					:value="getStringToInt(item.partsNumber)" 
					:inputdisabled="false" 
					/>
				</view>
				<view style="display: flex;margin-left: 15px;" v-else>
					<uni-number-box 
					:min="item.partsNumber" 
					:max="item.partsNumber" 
					:compare="false" 
					:value="item.partsNumber" 
					/>
				</view>
			</view>
			<view class="top-part-type-bg-tag medType">
				<text class="tag-view tag2">{{ item.itemNumber || '--' }}</text>
			</view>
			<!-- <view class="top-part-type-source">
				<view class="top-part-type-source-item">
					<text class="text-style">单价(元):</text>{{ item.salePrice || '0.00' }}
				</view>
				<view class="top-part-type-source-item">
					<text class="text-style">总价(元):</text>{{ item.partsAmount || '0.00' }}
				</view>
			</view> -->
			<view class="top-part-type-bg">
				<view class="top-part-type-bg-left">
					<text class="text-style">备注:</text>
					{{ item.remark || '--' }}
				</view>
				<i class="iconfont edit-icon iconzl--bianji" @click="editItem(item,index)" v-if="isEdit"></i>
				<i class="iconfont delete-icon iconzl--shanchu" @click="deleteItem(index)" v-if="isEdit"></i>
			</view>
		</view>
		<!-- 添加弹窗 -->
		<view class="pop-container">
			<uni-popup ref="addPop" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title"><text>新增</text></view>
					<view class="row-item" @click="clickType('url')">
						<view class="row-tag"><text>从配件库存中添加</text></view>
					</view>
					<view class="row-item" @click="clickType('add')">
						<view class="row-tag"><text>手动输入配件</text></view>
					</view>
					<view class="row-item" style="background: #dcdcdc;" @click="clickCancle">
						<view class="row-tag"><text>取消</text></view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 内容弹窗 -->
		<view class="pop-container">
			<uni-popup ref="editPop" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title"><text>编辑配件信息</text></view>
					<view class="alert-cell" v-if="!itemDic.basicsId">
						<view class="alert-left-title">物料号:<text style="color: #FF0000;">*</text></view>
						<view class="alert-right-title">
							<input
							style="flex: 1;font-size: 14px;"
							placeholder="请输入物料号"
							:value="itemDic.itemNumber"
							@input="textChange($event,'itemNumber')" 
							/>
						</view>
					</view>
					<view class="alert-cell" v-if="!itemDic.basicsId">
						<view class="alert-left-title">配件名称:<text style="color: #FF0000;">*</text></view>
						<view class="alert-right-title">
							<input
							style="flex: 1;font-size: 14px;"
							placeholder="请输入配件名称"
							:value="itemDic.partsBasics.name"
							@input="textChange($event,'name')" 
							/>
						</view>
					</view>
					<view class="alert-cell" v-if="!itemDic.basicsId">
						<view class="alert-left-title">型号规格:<text style="color: #FF0000;">*</text></view>
						<view class="alert-right-title">
							<input
							style="flex: 1;font-size: 14px;"
							placeholder="请输入型号规格"
							:value="itemDic.partsBasics.modelName"
							@input="textChange($event,'modelName')" 
							/>
						</view>
					</view>
					<view class="alert-cell">
						<view class="alert-left-title">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注:</view>
						<view class="alert-right-title">
							<textarea 
							class="text-area-css"
							placeholder="请输入备注"
							:value="itemDic.remark"
							@input="textChange($event,'remark')" 
							/>
						</view>
					</view>
					<view class="alert-cell">
						<view class="alert-btn-left" @click="clickBtn('cancle')"><text>取消</text></view>
						<view class="alert-btn-right" @click="clickBtn('ok')"><text>保存</text></view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		UniNumberBox,
		uniPopup
	},
	props: {
		isEdit: {
			type: Boolean,
			default: true
		},
		itemType: {
			type: String,
			default: 'recelive'
		},
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data(){
		return{
			itemDic:{
				partsBasics:{
					
				}
			},
			indexNum:0
		}
	},
	methods: {
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		getLeftNum(item) {
			return 999;
			// if (item.stockTotal==undefined) {
			// 	return 999;
			// }
			// let stockTotal = item.stockTotal || 0;
			// let leftNum = Number(stockTotal);
			// return leftNum;
		},
		getStringToInt(val) {
			if (val) {
				return parseInt(val);
			}
			return 0;
		},
		getNumValue(val,index,item) {
			let dict = {
				...item,
				partsNumber:val.toString()
			}
			let list = this.dataDic.partsCollarLists?this.dataDic.partsCollarLists:[];
			list.splice(index,1,{...dict})
			uni.$emit('parts-edit',list)
		},
		editItem(item,index){
			this.indexNum = index;
			this.itemDic = {
				...item
			}
			this.$refs.editPop.open();
		},
		deleteItem(index) {
			uni.showModal({
				title:'提示',
				content:'确定要删除该设备么?',
				success: (res) => {
					if (res.cancel) {} else {
						let list = this.dataDic.partsCollarLists?this.dataDic.partsCollarLists:[];
						list.splice(index,1)
						uni.$emit('parts-edit',list)
					}
				}
			})
		},
		addacc(){
			this.itemDic = {
				itemNumber:"",
				partsBasics:{
					name:"",
					modelName:""
				},
				salePrice:"0.00",
				partsNumber:'0',
				remark:''
			}
			this.$refs.addPop.open();
		},
		clickType(type) {
			if(type === 'url'){
				if(!this.dataDic.orgId||this.dataDic.orgId==""){
					uni.showToast({
						title:"请先选择区域"
					})
					return;
				}
				uni.navigateTo({
					url: '/devicePages/repair/choose-part-list?list=' + encodeURIComponent(JSON.stringify(this.dataDic.partsCollarLists)) + "&orgId=" + this.dataDic.orgId
				});
			}else{
				this.indexNum = -1;
				this.itemDic = {
					partsBasics:{
						name:"",
					},
					salePrice:"0.00",
					partsNumber:'0',
					remark:''
				}
				this.$refs.editPop.open();
				
			}
			this.$refs.addPop.close();
		},
		clickCancle() {
			this.$refs.addPop.close();
		},
		clickBtn(type){
			if(type == 'ok'){
				if(!this.itemDic.itemNumber || this.itemDic.itemNumber == ''){
					uni.showToast({
						title:'请输入物料号',
						icon:'none'
					})
					return
				}
				if(!this.itemDic.partsBasics.name || this.itemDic.partsBasics.name == ''){
					uni.showToast({
						title:'请输入配件名称',
						icon:'none'
					})
					return
				}
				if(!this.itemDic.partsBasics.modelName || this.itemDic.partsBasics.modelName == ''){
					uni.showToast({
						title:'请输入型号规格',
						icon:'none'
					})
					return
				}
				let list = this.dataDic.partsCollarLists?this.dataDic.partsCollarLists:[];
				if(this.indexNum == -1){
					list.push(this.itemDic)
				}else{
					list.splice(this.indexNum,1,{...this.itemDic})
				}
				uni.$emit('parts-edit',list)
			}
			this.$refs.editPop.close();
		},
		textChange(e,type){
			let value = e.detail.value ? e.detail.value : ''
			if(type == 'name'){
				this.itemDic = {
					...this.itemDic,
					partsBasics:{
						...this.itemDic.partsBasics,
						name:value
					}
				}
			}else if(type == 'modelName'){
				this.itemDic = {
					...this.itemDic,
					partsBasics:{
						...this.itemDic.partsBasics,
						modelName:value
					}
				}
			}else if(type == 'itemNumber'){
				this.itemDic = {
					...this.itemDic,
					itemNumber:value
				}
			}else if(type == 'remark'){
				this.itemDic = {
					...this.itemDic,
					remark:value
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.part-components-bg {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	width: 100%;
	margin-top: 10px;
	padding-bottom: 10px;
}
.head-cell{
	display: flex;
	flex-direction: row;
	padding: 10px 0px;
	border-bottom: $uni-line-color solid 1px;
	justify-content: flex-start;
	align-items: center;
}
.left-title{
	margin-left: 10px;
	font-size: 16px;
	color: $uni-text-color;
	font-weight: bold;
}
.right-title{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-right: 10px;
	font-size: 14px;
	color: $uni-color-primary;
}
.top-part-order-bg {
	display: flex;
	flex-direction: row;
	padding: 10px;
	align-items: center;
	justify-content: flex-start;
}
.top-part-order-bg-input {
	flex: 1;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg-tag {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-bg {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 10px 10px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-source {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	padding: 0px 10px;
	margin-top: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.top-part-type-source-item {
	display: flex;
	flex: 1;
}
.text-style {
	min-width: 40px;
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
	background: #eef9e8;
	color: #57c32d;
}

.tag2 {
	background: #FFF1F0;
	color: #E60000;
}

.tag3 {
	background: #fff6e7;
	color: #fab045;
}
.top-part-type-bg-left {
	display: flex;
	flex: 1;
}
.edit-icon {
	font-size: 17px;
	color: $uni-color-primary;
	margin-left: 10px;
}
.delete-icon {
	font-size: 17px;
	color: #ff0000;
	margin-left: 10px;
}
.cell-view{
	display: flex;
	flex-direction: column;
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
}
//窗体
.pop-container {
	position: relative;
}
	/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 80vw;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 100%;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 80%;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	border-radius: 5px
}
.row-tag {
	width: 150px;
	text-align: center;
}
.alert-cell{
	display: flex;
	width: 100%;
	flex-direction: row;
	padding: 10px 15px;
	border-bottom: $uni-line-color solid 1px;
	align-items: center;
}
.alert-left-title{
	font-size: 14px;
	color: $uni-text-color;
	font-weight: normal;
}
.alert-right-title{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	margin-left: 10px;
}
.text-area-css{
	width: calc(100% - 20px);
	height: 100px;
	background: $uni-line-color;
	border-radius: 8px;
	padding: 8px;
	font-size: 14px;
}
.alert-btn-left{
	display: flex;
	flex: 1;
	flex-direction: row;
	padding: 10px 0px;
	border-radius: 50px;
	background: $uni-line-color;
	color: #000000;
	align-items: center;
	justify-content: center;
	margin-left: 10px;
	margin-right: 10px;
}
.alert-btn-right{
	flex: 1;
	display: flex;
	flex-direction: row;
	padding: 10px 0px;
	border-radius: 50px;
	background: $uni-color-primary;
	color: #FFFFFF;
	align-items: center;
	justify-content: center;
	margin-left: 10px;
	margin-right: 10px;
}
.medType{
	border-bottom: #F0F2F4 1px solid;
	padding-bottom: 10px;
	margin: 0px 10px;
}
</style>
