<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="item-assigner-list">
			<view class="l-item" v-for="(m, pos) in list" :key="pos" @click="changeCheck(pos)">
				<view class="item-name">{{ m.label }}</view>
				<mycheckbox class="checkbox"  :checked="m.checked" color="#E60000" />
			</view>
		</view>
		<view class="bottom-view">
			<view class="choosed-view">
				{{ $t('common.choosed') }}：
				<span>{{ chooseAssigners.length }}</span>
			</view>
			<view class="confirm-view" @click="confirm">{{ $t('common.confirm') }}</view>
		</view>
	</view>
</template>

<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components: {
		wPicker
	},
	data() {
		return {
			allList: [],
			list: [],
			chooseAssigners: [],
		};
	},
	onLoad(options) {
		if (options.choosedList) {
			this.chooseAssigners = JSON.parse(options.choosedList);
		}
		this.loadDesCTypes();
	},
	methods: {
		loadDesCTypes() {
			uni.showLoading()
			this.$network.loadType('repair_record_type').then(result => {
				this.list = result.map(o=>{
					return {
						...o,
						checked: this.chooseAssigners.some(y => y.value == o.value)
					}
				});
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		changeCheck(pos) {
			this.list[pos].checked = !this.list[pos].checked;
			this.getCheckedList();
		},
		getCheckedList() {
			this.chooseAssigners = [
				...this.list.filter(o => {
					return o.checked;
				})
			];
		},
		confirm() {
			uni.$emit('chooseReason', {
				data: this.chooseAssigners
			});
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	height: 100%;
	background: $uni-bg-color-grey;
	position: relative;
}

.search-container {
	flex-direction: row;
	justify-content: space-between;
	height: 48px;
	position: fixed;
	display: flex;
	width: 100%;
	top: 0px;
	align-items: center;
	background-color: #ffffff;
	left: 0;
	z-index: 100;
}

.search-box {
	background: #F7F7F7;
	height: 32px;
	flex: 1;
	line-height: 32px;
	display: flex;
	margin-left: 16px;
	margin-right: 16px;
	flex-direction: row;
	padding-left: 16px;
	border-radius: 4px;
}

.search-icon {
	color: #999999;
	font-size: 14px;
}

.search-content {
	color: #999999;
	font-size: 14px;
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 10px;
	flex: 1;
}

input {
	width: 95%;
}

.item-assigner-list {
	margin-top: 0px;
	margin-bottom: 56px;
}

.l-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 45px;
	background-color: #ffffff;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	border-width: 0px 0px 1px 0px;
	align-items: center;
}

.item-name {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 16px;
}

.checkbox {
	transform: scale(0.7);
	margin-right: 10px;
}

.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 48px;
	padding-bottom:env(safe-area-inset-bottom);
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
	box-shadow: 1px 0px 1px $uni-text-color-gray;
}

.choosed-view {
	margin-left: 16px;
	margin-right: 16px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.choosed-view span {
	color: $uni-color-primary;
	font-size: $uni-font-size-lg;
	margin-left: 4px;
}

.confirm-view {
	margin-right: 16px;
	font-size: $uni-font-size-base;
	color: #ffffff;
	background-color: $uni-color-primary;
	padding: 5px 10px;
	border-radius: 4px;
}
</style>
