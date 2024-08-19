<template>
	<view class="acc-base-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="acc-base-item">
			<selectorInput
			title="型号规格"
			placeholder="请输入型号规格"
			:content="dataDic.modelName"
			:isRequire="true"
			@textChage="textChage($event,'modelName')"
			/>
			<selectorInput
			title="配件名称"
			placeholder="请输入配件名称"
			:content="dataDic.name"
			:isRequire="true"
			@textChage="textChage($event,'name')"
			/>
			<selectorPick
			title="配件类别"
			placeholder="请选择配件类别"
			:content="dataDic.category"
			:isRequire="true"
			@clickItem="showPick('category')"
			/>
			<selectorArea
			title="适用范围"
			placeholder="通用"
			:content="dataDic.scopeApplication"
			:isRequire="false"
			@textChage="textChage($event,'scopeApplication')"
			/>
			<selectorArea
			title="备注"
			placeholder="请输入备注"
			:content="dataDic.remark"
			:isRequire="false"
			@textChage="textChage($event,'remark')"
			/>
		</view>
		<view class="bottom-btn-bg">
			<view class="bottom-btn-left" @click="cancleBtn">{{'取消'}}</view>
			<view class="bottom-btn-right" @click="saveBtn">{{'确定'}}</view>
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
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components:{
		selectorPick,
		selectorInput,
		selectorArea,
		wPicker
	},
	data() {
		return {
			dataDic:{},
			selectList:[],
			methodStr:'POST'
		};
	},
	onLoad(option) {
		if(option.item){
			uni.setNavigationBarTitle({
				title:'修改配件配置'
			})
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.dataDic = {
				...dict
			}
			this.methodStr = "PUT";
		}
		this.loadPartsType();
	},
	methods: {
		loadPartsType(){
			this.$network.loadType('part_type').then(result => {
				this.selectList = result;
				if(this.selectList.length>0 && !this.dataDic.category){
					this.dataDic = {
						...this.dataDic,
						category:this.selectList[0].label,
						categoryId:this.selectList[0].value
					}
				}
			}).catch(err => {});
		},
		showPick(type){
			this.$refs.selector.show()
		},
		onConfirm(val){
			let dict = val.checkArr;
			this.dataDic = {
				...this.dataDic,
				category:dict.label,
				categoryId:dict.value
			}
		},
		textChage(e,type){
			this.dataDic[type] = e;
		},
		saveBtn(){
			console.log(JSON.stringify(this.dataDic));
			if(!this.dataDic.modelName){
				uni.showToast({
					title:'请输入型号规格',
					icon:'none'
				})
				return
			}
			if(!this.dataDic.name){
				uni.showToast({
					title:'请输入配件名称',
					icon:'none'
				})
				return
			}
			if(!this.dataDic.scopeApplication){
				this.dataDic = {
					...this.dataDic,
					scopeApplication:"通用"
				}
			}
			// this.dataDic = {
			// 	...this.dataDic,
			// 	brandName:this.dataDic.modelName
			// }
			uni.showLoading({
				mask: true
			});
			this.$network.getData(this.$url.ACC_BASE_LIST_ADD, this.methodStr, this.dataDic).then(result => {
				uni.$emit('refresh-acc-base-list', {});
				uni.navigateBack({
					animationDuration: 200
				});
				uni.hideLoading();
			}).catch(err => {
				uni.showToast({
					title: err.message + "," + err.details[0],
					icon: 'none'
				});
				uni.hideLoading();
			});
		},
		cancleBtn(){
			uni.navigateBack({
				delta:1
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.acc-base-bg {
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
	width: 100%;
}
.acc-base-item{
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding:10px;
	background: #ffffff;
	border-radius: 10px;
}
.bottom-btn-bg{
	display: flex;
	width: 100%;
	margin-top: 20px;
}
.bottom-btn-left{
	flex: 1;
	padding: 10px 0px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	border-radius: 50px;
	background: #FFFFFF;
	border: #EEEEEE 1px solid;
	text-align: center;
	margin-right: 10px;
	margin-left: 10px;
}
.bottom-btn-right{
	flex: 1;
	padding: 10px 0px;
	font-size: $uni-font-size-base;
	background: $uni-color-primary;
	border-radius: 50px;
	color: #FFFFFF;
	border: #EEEEEE 1px solid;
	text-align: center;
	margin-left: 10px;
	margin-right: 10px;
}
</style>
