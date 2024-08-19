<template>
	<view class="selector-pick-bg" @click="showPick">
		<view class="selector-pick-cell-left">
			{{title}}
			<text style="color: #FF0000;" v-if="isRequire">*</text>
			<slot name="title-icon"></slot>
		</view>
		<view class="selector-pick-cell-right" v-if="isEdit">
			<text v-if="content&&content!=''" :style="{'color':type != 'phone' ? '#222831' : '#E60000'}">{{content}}</text>
			<text class="placeholder-text" v-else>{{placeholder}}</text>
			<i class="iconfont right-icon" :class="rightIcon" v-if="isEdit" :style="{'color':type != 'phone' ? '#222831' : '#E60000'}"></i>
		</view>
		<view class="selector-pick-cell-right" v-if="!isEdit">
			<text :style="{'color':type != 'phone' ? '#222831' : '#E60000'}">{{content||'--'}}</text>
		</view>
	</view>
</template>

<script>
export default{
	props:{
		isEdit:{
			type:Boolean,
			default:true
		},
		type:{
			type: String,
			default: "click"
		},
		title: {
			type: String,
			default: ""
		},
		isRequire:{
			type:Boolean,
			default:true
		},
		content: {
			type: [Number,String],
			default: ""
		},
		placeholder:{
			type: String,
			default: ""
		},
		rightIcon:{
			type: String,
			default: "iconarrow-right"
		},
	},
	data() {
		return {
		};
	},
	created() {
	},
	methods:{
		showPick(){
			if(!this.isEdit && this.type == 'phone'){
				if(this.content != ''){
					uni.makePhoneCall({
						phoneNumber: this.content,
						success: (res) => {
							console.log('调用成功!')
						},
						fail: (res) => {
							console.log('调用失败!')
						}	
					});
				}
				return
			}else if(!this.isEdit && this.type != 'phone'){
				return
			}
			this.$emit('clickItem', {});
		},
	}
}
</script>

<style lang="scss" scoped>
.selector-pick-bg{
	position: relative;
	display: flex;
	flex-direction: row;
	background: #FFFFFF;
	padding:12px 10px;
	border-bottom: #F0F2F4 1px solid;
}
.selector-pick-cell-left {
	display: flex;
	min-width: 60px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selector-pick-cell-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-end;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.right-icon{
	margin-left: 5px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.placeholder-text{
	color: #999999;
}
</style>
