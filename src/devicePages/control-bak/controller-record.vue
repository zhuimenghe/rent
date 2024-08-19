<template>
	<view class="controller-bg">
		<!-- 顶部总条数 -->
		<view class="top-total">
			<view style="flex: 1;margin-left: 15px;background: #FFFFFF;">
				<text>共计{{ datalist.length }}条</text>
			</view>
			<view class="sort">
				<!-- <view class="sort" @click="orderclick">
					<i class="iconfont" style="color: #E60000;font-size: 14px;margin-right: 4px;" v-if="positiveOrder">&#xe64f;</i>
					<i class="iconfont" style="color: #E60000;font-size: 14px;margin-right: 4px;" v-if="!positiveOrder">&#xe64e;</i>
					<text>{{positiveOrder?"正序":"倒序"}}</text>
				</view> -->
			</view>
		</view>
		<!-- 列表view -->
		<view class="list-bg-view">
			<list class="list">
				<cell v-for="(item, index) in datalist" :key="index">
					<view class="cell-view">
						<i class="iconfont item-icon"
						:class="item.lockType == 3 ? 'iconzl--suoche' : 'iconzl--jiesuo'"
						:style="[{ color: item.lockType === 3 ? '#E60000' : '#52C41A' }]">
						</i>
						<view class="item-cell-med">
							<view class="item-right">
								<view class="item-user">
									<text>{{item.describeName}}</text>
								</view>
								<view class="item-user" style="margin-left: 5px;">
									<text>{{item.licenseId || "--"}}</text>
								</view>
								<view class="item-user" style="margin-left: 5px;">
									<text>{{item.codeName || "--"}}</text>
								</view>
							</view>
							<view>
							</view>
							<view class="item-user" v-if="item.operateMsg">
								失败原因:{{item.operateMsg}}
							</view>
							<view class="record-date">{{ item.createTime  || "--"}}</view>
						</view>
					</view>
				</cell>
			</list>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			positiveOrder:true,
			datalist: []
		};
	},
	onLoad(option){
		let licenseid = option.licenseid;
		this.loaddata(licenseid)
	},
	methods: {
		orderclick(){
			this.positiveOrder=!this.positiveOrder
		},
		loaddata(licenseid){
			uni.showLoading();
			let url = this.$url.CONTROL_LOCKHISTORY_LIST + licenseid;
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
			        this.datalist = result;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
//背景
.controller-bg {
	position: relative;
	display: flex;
	flex: 1;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: #ffffff;
}
.top-total {
	position: fixed;
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 40px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	align-items: center;
	justify-content: flex-start;
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	background: #FFFFFF;
}
.sort {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-right: 15px;
}
//列表
.list-bg-view {
	margin-top: 40px;
	display: flex;
	flex: 1;
}
.list {
	flex: 1;
}
.cell-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	padding: 10px 15px 10px 15px;
	align-items: center;
}
.item-icon {
	font-size: 36px;
	margin-right: 8px;
}
.item-cell-med {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.item-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.item-user {
	font-size: 14px;
	color: $uni-text-color;
}
.record-date {
	font-size: $uni-font-size-sm;
	color: $uni-text-color-disable;
}
.item-cell-right {
	margin-right: 0;
	padding: 5px;
	border-width: 1px;
	border-color: #E60000;
	border-style: solid;
	border-radius: 10px;
	font-size: $uni-font-size-sm;
}
</style>
