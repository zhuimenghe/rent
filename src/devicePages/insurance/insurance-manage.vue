<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="goTo('create')" v-if="isShowAdd"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="top-container">
			<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange"></sun-tab>
		</view>
		<view class="list-container">
			<view v-if="index==0">
				<tabDevice ref='device' />
			</view>
			<view v-if="index==1">
				<tabRecord ref='record' />
			</view>
		</view>
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import tabDevice from './tab-insurance-device.vue'
	import tabRecord from './tab-insurance-record.vue'
	export default {
		components: {
			selectView,
			wPicker,
			sunTab,
			tabDevice,
			tabRecord
		},
		data() {
			return {
				index: 0,
				tabList: ['在保设备', '保险记录'],
				isShowAdd: true,

			};
		},
		onLoad(options) {
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
			if (ps && ps.length > 0) {
				this.isShowAdd = ps.some(x => x.value === this.$savekey.PERMISSION_INSURANCE_ADD);
			}

			setTimeout(() => {
				this.headerrefreshInfo()
			}, 100)
			uni.$on('refresh-insurance-list', usnerinfo => {
				this.headerrefreshInfo()
			});
		},
		onPullDownRefresh() {
			this.headerrefreshInfo()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		onUnload() {
			uni.$off('refresh-insurance-list')
		},
		methods: {
			goTo(type) {
				uni.navigateTo({
					url: './create-insurance'
				})
			},
			indexchange(e) {
				setTimeout(() => {
					this.index = e.index
					this.headerrefreshInfo()
				}, 10)
			},
			headerrefreshInfo() {
				switch (this.index) {
					case 0:
						this.$refs.device.headerrefresh();
						break;
					case 1:
						this.$refs.record.headerrefresh();
						break;
					default:
						break;
				}
			},
			footerrefresh() {
				switch (this.index) {
					case 0:
						this.$refs.device.footerrefresh();
						break;
					case 1:
						this.$refs.record.footerrefresh();
						break;
					default:
						break;
				}
			},
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	//添加按钮
	.add-container {
		position: fixed;
		display: flex;
		bottom: 62px;
		right: 16px;
		height: 50px;
		width: 50px;
		border-radius: 50%;
		box-shadow: 0px 0px 10px #E60000;
		justify-content: center;
		align-items: center;
		background-color: $uni-color-primary;
		z-index: 888;
	}

	.labelstyle {
		color: #ffffff;
		font-size: 30px;
		font-weight: bold;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 800;
	}

	.list-container {
		margin-top: 45px;
	}
</style>
