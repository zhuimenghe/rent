<template>
	<view class="part-components-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-part-order-bg">
			<input
			class="top-part-order-bg-input"
			placeholder="请输入料号"
			:value="dataDic.itemNumber"
			type="text"
			@input="textChangeNumber"
			:disabled="true"
			/>
			<!-- <i class="iconfont edit-icon iconzl--bianji"></i> -->
		</view>
		<view class="top-part-order-bg">
			<view class="top-part-order-bg-input">
				<text>配件数量</text>
				<text style="color:#FF0000">*</text>
			</view>
			<view style="display: flex;margin-left: 15px;">
				<uni-number-box
				:min="0" 
				:max="getLeftNum(dataDic)" 
				:compare="false" 
				@change="getNumValue" 
				:inputdisabled="false"
				/>
			</view>
		</view>
		<selectorPick
		title="型号规格"
		:isEdit="false"
		:content="dataDic.partsBasics.modelName"
		:isRequire="false"
		/>
		<selectorPick
		title="名称"
		:isEdit="false"
		:content="dataDic.partsBasics.name"
		:isRequire="false"
		/>
		<selectorPick
		title="类别"
		:isEdit="false"
		:content="dataDic.partsBasics.category"
		:isRequire="false"
		/>
		<view class="top-part-type-bg">
			<text class="text-style">适用范围</text>
			<view class="right-text">
				<text>{{ dataDic.partsBasics.scopeApplication || '--' }}</text>
			</view>
		</view>
		<selectorPick
		title="采购方式"
		placeholder="请选择采购方式"
		:content="dataDic.purchasingMethodName"
		:isRequire="true"
		@clickItem="showPick('purchasingMethod')"
		/>
		<selectorInput
		title="采购单价(元)"
		placeholder="0.00"
		:content="dataDic.salePrice"
		:isRequire="true"
		@textChage="textChange($event,'salePrice')"
		/>
		<selectorPick
		title="总价(元)"
		:isEdit="false"
		:content="dataDic.partsAmount"
		:isRequire="false"
		/>
		<selectorPick
		title="配件来源"
		placeholder="请选择配件来源"
		:content="dataDic.partsSourceName"
		:isRequire="true"
		@clickItem="showPick('partsSourceName')"
		/>
		<selectorInput
		title="厂商品牌"
		placeholder="请输入厂商品牌"
		:content="dataDic.brandName"
		:isRequire="false"
		@textChage="textChange($event,'brandName')"
		/>
		<view class="bottom-btn-style">
			<view class="btn-common left-btn" @click="deleteItem"><text>{{'删除'}}</text></view>
			<view class="btn-common right-btn" @click="submitItem"><text>{{'确定'}}</text></view>
		</view>
		<w-picker
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default{
	components:{
		UniNumberBox,
		selectorPick,
		selectorInput,
		selectorArea,
		wPicker
	},
	data() {
		return{
			dataDic:{},
			methodsArr:[],
			sourceArr:[],
			selectList:[],
			selectType:""
		}
	},
	onLoad(option) {
		this.dataDic = JSON.parse(decodeURIComponent(option.item));
		console.log(JSON.stringify(this.dataDic));
		this.loadSourceList();
		this.loadMehtodsList();
	},
	methods:{
		getLeftNum(item) {
			let stockTotal = item.stockTotal || '999';
			let leftNum = Number(stockTotal);
			return leftNum;
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		getNumValue(val) {
			this.dataDic = {
				...this.dataDic,
				partsNumber: val.toString(),
				partsAmount: this.calcTotal(this.dataDic.salePrice, val)
			};
		},
		textChange(e,type){
			if(type =='brandName'){
				this.dataDic = {
					...this.dataDic,
					brandName:e
				}
			}else if(type =='salePrice'){
				let val = e;
				this.dataDic = {
					...this.dataDic,
					salePrice:val
				}
				setTimeout(() => {
					val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
					val = val.replace(/^\./g, ''); //验证第一个字符是数字
					val = val.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
					val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
					val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
					this.dataDic = {
						...this.dataDic,
						salePrice:val,
						partsAmount: this.calcTotal(val, this.dataDic.partsNumber)
					}
				}, 10);
			}
		},
		calcTotal(price, num) {
			let total = price * num;
			return this.$datestr.doubleFloat(total).toString();
		},
		textChangeNumber(val){
			this.dataDic = {
				...this.dataDic,
				itemNumber:val.detail.value
			}
		},
		deleteItem(){
			uni.showModal({
				title:'提示',
				content:'确定要删除该配件么?',
				success: (res) => {
					if (res.cancel) {} else {
						let param = {
							type:'delete',
						}
						uni.$emit('edit-item', param);
						uni.navigateBack({
							animationDuration:200
						})
					}
				}
			})
			
		},
		submitItem(){
			if(!this.dataDic.itemNumber){
				uni.showToast({
					icon:'none',
					title:"请输入物料号或者选已有物料号"
				})
				return
			}
			if(!this.dataDic.purchasingMethod){
				uni.showToast({
					icon:'none',
					title:"请选择采购方式"
				})
				return
			}
			if(!this.dataDic.partsSource){
				uni.showToast({
					icon:'none',
					title:"请选择配件来源"
				})
				return
			}
			if(!this.dataDic.salePrice||this.dataDic.salePrice==""){
				this.dataDic = {
					...this.dataDic,
					salePrice:"0.00"
				}
			}
			// if(!this.dataDic.brandName){
			// 	uni.showToast({
			// 		icon:'none',
			// 		title:"请输入厂商品牌"
			// 	})
			// 	return
			// }
			let param = {
				type:'edit',
				data:this.dataDic
			}
			uni.$emit('edit-item-allot', param);
			uni.navigateBack({
				animationDuration:200
			})
		},
		showPick(type){
			this.selectType = type
			if(type =="purchasingMethod"){
				this.selectList = [...this.methodsArr]
			}else if(type == "partsSourceName"){
				this.selectList = [...this.sourceArr]
			}
			this.$refs.selector.show();
		},
		onConfirm(val){
			if(this.selectType =="purchasingMethod"){
				this.dataDic = {
					...this.dataDic,
					purchasingMethod:val.checkArr.value,
					purchasingMethodName:val.checkArr.label
				}
			}else if(this.selectType == "partsSourceName"){
				this.dataDic = {
					...this.dataDic,
					partsSourceName:val.checkArr.label,
					partsSource:val.checkArr.value
				}
			}
		},
		goTo() {
			uni.navigateTo({
				url: '/subOtherPages/accessories/acc-storagein/choose-material-part?basicsId=' + this.dataDic.basicsId
			});
		},
		//加载来源
		loadSourceList() {
			this.$network.loadUserType('parts_source').then(result => {
				this.sourceArr = result.map(o => {
					return {
						label: o.label,
						value: o.value
					};
				});
				uni.hideLoading();
			}).catch(err => {
					uni.hideLoading();
			});
		},
		//加载方式
		loadMehtodsList() {
			this.$network.loadUserType('purchasing_method').then(result => {
				this.methodsArr = result.map(o => {
					return {
						label: o.label,
						value: o.value
					};
				});
				uni.hideLoading();
			}).catch(err => {
					uni.hideLoading();
			});
		},
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
	padding: 10px 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	border-bottom: $uni-line-color 1px solid;
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
	min-width: 60px;
	color: #222831;
}
.right-text{
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
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
	margin-left: 15px;
}
.edit-icon{
	color: #E60000;
	font-size: 16px;
	margin-left: 8px;
}
.bottom-btn-style{
	position: fixed;
	bottom: 0px;
	left: 0px;
	display: flex;
	flex-direction: row;
	background-color: #FFFFFF;
	width: 100%;
	justify-content: flex-start;
	padding-top: 10px;
	padding-bottom:env(safe-area-inset-bottom);
}
.btn-common{
	display: flex;
	flex: 1;
	margin-left: 10px;
	margin-right: 10px;
	border-radius: 50px;
	padding: 10px 0px;
	justify-content: center;
	align-items: center;
}
.left-btn{
	background: #FF0000;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
}
.right-btn{
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
}
</style>
