<template>
	<view class="device-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{ '进场设备需求' }}</view>
		</view>
		<view class="item-cell" v-for="(item, index) in dataDic.expressList" :key="index">
			<view class="item-cell-line-bg">
				<view class="item-cell-line-bg-left">
					<view class="item-cell-line">
						<text class="text-tag-first">{{item.printCode || '--'}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.licenseId || ''}}</text>
					</view>
					<view class="item-cell-line">
						<text class="text-tag-seced">{{item.typeName || ''}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.heightName || ''}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.machineBrand || ''}}</text>
						<text class="text-tag-line">|</text>
						<text class="text-tag-seced">{{item.machineTypeName || ''}}</text>
					</view>
				</view>
				<view class="item-cell-line">
					<text class="tag-view" :class="ischeckOK(item.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'" @click="gotoDetail(item)">
						{{ ischeckOK(item.workCheckResults) ? '点检正常' : '点检异常' }}
					</text>
				</view>
			</view>
			<view class="item-cell-line-warp">
				<text class="tag-view tag2">{{ item.settlementTypeName || ""}}</text>
				<text class="tag-view tag2" v-if="item.settlementType!='4'&&item.settlementType!='6'">¥ {{ item.hire || '0.00' }}/{{getType(item)}}</text>
				<text class="tag-view tag2" v-if="item.settlementType=='4'||item.settlementType=='6'">¥{{ item.hire || '0.00' }}/天{{ item.hireMonthly || '0.00' }}/月</text>
				<text class="tag-view tag3">{{ item.carriageTypeName || ""}}</text>
				<text class="tag-view tag3">运:¥{{ item.carriage || "0.00"}}/台</text>
				<text class="tag-view tag3">押:¥{{ item.pledge || "0.00"}}/台</text>
			</view>
		</view>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorInputMD from '@/components/common/selector-pick/selector-input-monthday.vue';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorInputMD
	},
	props: {
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		},
		isEdit: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		getType(item) {
			if (item.settlementType === '1') {
				return '天'
			} else if (item.settlementType === '5') {
				return '周'
			} else {
				return '月'
			}
		},
		showPick(type) {
			this.$emit('clickItem', type);
		},
		textChage(e, type) {
			let param = {
				type: type,
				data: e
			};
			this.$emit('textChange', param);
		},
		gotoDetail(item){
			uni.navigateTo({
				url: '/businessPages/workin/check-car-list?item=' + encodeURIComponent(JSON.stringify(item.workCheckResults)) + '&iscleck=false'
			});
		},
		addItem(){
			uni.navigateTo({
				url:"/contractPages/contract/contract-choose-device/contract-choose-device?machineList=" + encodeURIComponent(JSON.stringify(this.dataDic.expressList))
			})
		},
		goTo(type,index,item){
			if(type == 'delete'){
				this.$emit('deleteItem', index);
			}else{
				uni.navigateTo({
					url:"/contractPages/contract/contract-choose-device/edit-device-information?item=" + encodeURIComponent(JSON.stringify(item)) + "&index=" + index
				})
			}
		},
		ischeckOK(checkList) {
			if (!checkList) {
				return false;
			}
			let list = checkList.filter((o) => {
				return o.checked === false
			})
			if (list.length > 0) {
				return false;
			}
			return true;
		},
	}
};
</script>

<style lang="scss" scoped>
.device-infomation-bg {
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding: 10px;
	background: #ffffff;
	border-radius: 10px;
}

.title-bg {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px;
	border-bottom: #e9e9e9 1px solid;
}
.title-left {
	flex: 1;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: #222831;
}
.title-right{
	font-size: $uni-font-size-base;
	font-weight: normal;
	color: #999999;
}
.item-cell{
	display: flex;
	margin-top: 10px;
	flex-direction: column;
	padding: 10px 5px;
	border: $uni-line-color 1px solid;
	border-radius: 5px;
}
.item-cell-line-bg{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
}
.item-cell-line-bg-left{
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
}
.item-cell-line{
	display: flex;
	flex-direction: row;
	align-items: center;
}
.item-cell-line-warp{
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
}
.item-cell-line-right{
	display: flex;
	flex-direction: row;
	align-items: center;
}
.text-tag-first{
	font-size: 16px;
	color: $uni-text-color;
	margin-right: 10px;
}
.text-tag-seced{
	font-size: 13px;
	color: $uni-text-color-gray;
}
.text-tag-line{
	font-size: 13px;
	color: $uni-text-color-gray;
	margin-left: 5px;
	margin-right: 5px;
}
.tag-view {
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-sm;
	justify-content: center;
	align-items: center;
	margin-right: 5px;
	margin-top: 3px;
}
.tag1 {
	background: #FFF6E7;
	color: #FAB045;
}

.tag2 {
	background: #FFF1F0;
	color: #E60000;
}
.tag3{
	background: #fff6e7;
	color: #fab045;
}
.add-style{
	display: flex;
	flex: 1;
	color: $uni-color-primary;
	font-size: $uni-font-size-lg;
	border: $uni-color-primary 1px solid;
	padding: 5px 0px;
	border-radius: 50px;
	margin-top:10px;
	align-items: center;
	justify-content: center;
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
.checkbtnOK {
	background: #ffffff;
	color: #4ec365;
	border-color: #4ec365;
	border-width: 1px;
	border-style: solid;
}
.checkbtnError {
	background: #ffffff;
	color: #ff0000;
	border-color: #ff0000;
	border-width: 1px;
	border-style: solid;
}
</style>
