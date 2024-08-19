<template>
	<view class="base-infomation-bg">
		<view class="title-bg">
			<view class="title-left">{{ '指派交机人员' }}</view>
		</view>
		<selectorPick
		title="交机人员"
		placeholder="请选择交机人员"
		:content="dataDic.deliveryUserName"
		:isRequire="true"
		@clickItem="showPick('deliveryUser')"
		:isEdit="isEdit"
		/>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorInputIcon from '@/components/common/selector-pick/selector-inputwithicon.vue';
export default {
	components:{
		selectorPick,
		selectorInput,
		selectorInputIcon
	},
	props:{
		dataDic: {
			type: Object,
			default () {
				return {};
			}
		},
		isEdit:{
			type:Boolean,
			default:true
		}
	},
	data() {
		return {
			
		};
	},
	created() {
		
	},
	methods: {
		showPick(type){
			this.$emit('clickItem',type);
		},
	}
};
</script>

<style lang="scss" scoped>
.base-infomation-bg {
	display: flex;
	flex-direction: column;
	margin: 10px 10px 0px 10px;
	padding:10px;
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
	font-size: $uni-font-size-lg;
	font-weight: bold;
	color: #222831;
}
</style>
