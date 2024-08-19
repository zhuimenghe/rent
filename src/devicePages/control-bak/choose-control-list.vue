<template>
	<view class="uni-tip">
		<view class="flow-choose">
			<view class="cell-style">
				<view class="cell-style-left"><text>车号</text></view>
				<view class="cell-style-left"><text>自喷码</text></view>
				<view class="cell-style-right"></view>
			</view>
			<scroll-view scroll-y="true" style="margin-top: 5px;margin-bottom: 5px;">
				<view class="cell-style" v-for="(item, index) in dataList" :key="index">
					<view class="cell-style-left">
						<text>{{ item.licenseId || '--' }}</text>
					</view>
					<view class="cell-style-left">
						<text>{{ item.printCode || '-' }}</text>
					</view>
					<view class="cell-style-right" @click="deletList(index)"><text>移除</text></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			dataList: []
		};
	},
	onLoad(option) {
		this.dataList = JSON.parse(decodeURIComponent(option.item));
	},
	methods: {
		deletList(index) {
			this.dataList.splice(index, 1);
			uni.$emit('changeList', {
				list: this.dataList
			});
		}
	}
};
</script>

<style scoped lang="scss">
.uni-tip {
	position: relative;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	border-radius: 10px;
	width: 100%px;
}
.title-view {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.flow-choose {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-radius: 4px;
	z-index: 500;
}
.cell-style {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin: 5px;
}
.cell-style-left {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-bottom: 5px;
	justify-content: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.cell-style-right {
	width: 40px;
	display: flex;
	margin-top: 5px;
	margin-bottom: 5px;
	justify-content: center;
	color: #E60000;
	font-size: $uni-font-size-base;
}
.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;
	font-size: $uni-font-size-base;
}

.pop-cancel {
	margin-right: 8px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}

.pop-confirm {
	color: #ffffff;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
</style>
