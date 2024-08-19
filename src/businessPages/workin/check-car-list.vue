<template>
	<view class="choose-bg-view">
		<list class="list-style">
			<cell class="cell-style">
				<view class="celltop-top">
					<view class="cell-left-view">
						<view class="cell-view-part">
							<view class="cell-view-part title-style">
								<text style="font-weight: bold;">进场点检</text>
							</view>
						</view>
						<view class="cell-view-part title-style">
							<text>点检状态:</text>
							<text :style="{ color: isall(datalist) ? '#4EC365' : '#FF0000' }">
							    {{ isall(datalist) ? '正常' : '异常' }}
							</text>
						</view>
					</view>
					<view class="cell-right-view subtitle-style">
						<text @click="gotocheck()" v-if="isclick">一键点检</text>
					</view>
				</view>
				<view class="celltop" v-for="(itemcheck, indexcheck) in datalist" :key="indexcheck">
					<view class="cellview" @click="changeAllCheckBox(indexcheck, itemcheck)">
						<view class="cell-left-view  title-style">
							<text>{{ itemcheck.content || '-' }}</text>
						</view>
						<view class="cell-right-view">
							<mycheckbox 
							:checked="itemcheck.checked" 
							class="checkbox" 
							color="#E60000" 
							/>
						</view>
					</view>
					<text-label-item
					:inputDisabled="!isclick"
					tagName="备注" 
					placeholder="请输入备注..." 
					@ipnuttext="checkremark($event,indexcheck)" 
					:isRequired="false" 
					:inputValue="itemcheck.remark" 
					/>
				</view>
			</cell>
		</list>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view" v-if = 'isclick'>
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
export default {
	components: {
		textLabelItem
	},
	data() {
		return {
			datalist: [],
			isclick:true
		};
	},
	onLoad(options) {
		this.datalist = JSON.parse(decodeURIComponent(options.item));
		console.log(JSON.stringify(this.datalist))
		if(options.iscleck === 'false'){
			this.isclick = false;
		}	
	},
	methods: {
		isall(checkalllist){
			if(!checkalllist){
				return false;
			}
			let list = checkalllist.filter((o)=>{
				return o.checked === false
			})
			if(list.length > 0){
				return false;
			}
			return true;
		},
		gotocheck() {
			this.datalist = this.datalist ? this.datalist.map(dict => {
				return {
					...dict,
					checked: true
				}
			}) : [];
		},
		//可选
		changeAllCheckBox(index, item) {
			if(!this.isclick){
				return
			}
			let newitem = {
				...item,
				checked: !item.checked
			};
			this.datalist.splice(index,1,newitem)
		},
		clickecancle() {
			uni.navigateBack({
				delta: 1
			});
		},
		checkremark(e, index){
			let item = {
				...this.datalist[index],
				remark : e,
			};
			this.datalist.splice(index,1,item)
		},
		//确定按钮
		clicksave() {
			console.log(JSON.stringify(this.datalist))
			uni.$emit('choose-check-emit', {
				list: this.datalist
			});
			uni.navigateBack({
				animationDuration: 200
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	background: $uni-bg-color-grey;
}
.list-style {
	display: flex;
	flex: 1;
	flex-direction: column;
	background: $uni-bg-color-grey;
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
}
.input-style {
	flex: 1;
	text-align: right;
}
.cell-style {
	display: flex;
	flex-direction: column;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	margin-left: 10px;
	margin-right: 10px;
	background: $uni-bg-color-grey;
	padding-top: 10px;
	padding-bottom: 10px;
}
.celltop-top {
	display: flex;
	flex-direction: row;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	background: #ffffff;
	padding-top: 10px;
	padding-left: 10px;
	padding-bottom: 10px;
}
.celltop {
	display: flex;
	flex-direction: column;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	background: #ffffff;
	padding-top: 10px;
	padding-left: 10px;
	padding-bottom: 10px;
}
.cellview{
	display: flex;
	flex-direction: row;
	background: #ffffff;
}
.cell-left-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.cell-right-view {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}
.cell-view-part {
	display: flex;
	flex: 1;
	background: #ffffff;
	margin-left: 10px;
	justify-content: flex-start;
	margin: 5px;
}
.title-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
}
.checkbox {
	transform: scale(0.8);
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
.item-customdetail {
	align-items: center;
	justify-content: flex-end;
	margin-left: 20px;
}
#translate-arrow {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(-90deg);
	transition: all 1s;
}
#translate-arrow-expend {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(90deg);
	transition: all 1s;
}
</style>
