<template>
	<view class="content">
		<view class="top-container" v-if="tabList.length>0">
			<sun-tab :value.sync="index" :tabList="tabList" activeColor="#E60000" :shownum="false" @change="indexchange" />
		</view>
		<view class="tab-content" v-if="tabList.length>0">
			<view v-if="curItem.id == 0">
				<tabDeviceBattery ref="device" :licenseId="licenseId"/>
			</view>
			<view v-if="curItem.id == 1">
				<tabBatteryRecord ref="record"/>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import tabDeviceBattery from './tab-device-battery.vue';
	import tabBatteryRecord from './tab-battery-record.vue';
	export default {
		components: {
			sunTab,
			tabDeviceBattery,
			tabBatteryRecord
		},
		data() {
			return {
				index: 0,
				curItem: {},
				tabList: [],
				tabObjs: [],
				licenseId: ''
			};
		},
		onPullDownRefresh() {
			this.$refs[this.curItem.refs].headerrefresh();
		},
		onReachBottom() {
			this.$refs[this.curItem.refs].footerrefresh();
		},
		onLoad(option) {
			this.tabObjs = [{
				name: '设备电池',
				id: 0,
				key: "",
				refs: "device"
			}, {
				name: '电池记录',
				id: 1,
				key: "",
				refs: "record"
			}]
			if (this.tabObjs.length > 0) {
				this.curItem = this.tabObjs[this.index];
			}
			this.tabList = this.tabObjs.map(o => {
				return o.name
			})
			if(option.licenseId){
				this.licenseId = option.licenseId;
				// setTimeout(()=>{
				// 	this.$refs[this.curItem.refs].setLicenseToKey(this.licenseId);
				// }, 100);
			}else{
				this.headerrefresh()
			}
			uni.$on('refresh-battery-list', obj => {
				this.headerrefresh()
			})
			// uni.$on('change-battery-tab', obj => {
			// 	this.index = 1;
			// 	this.curItem = this.tabObjs[this.index];
			// 	//不用调用刷新，flexible搜索会监听licenseId
			// 	this.licenseId = obj.licenseId;
			// 	// this.headerrefresh()
			// });
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"电池管理","列表");
			
		},
		methods: {
			headerrefresh() {
				setTimeout(() => {
					this.$refs[this.curItem.refs].headerrefresh();
				}, 500)
			},
			indexchange(e) {
				this.index = e.index;
				this.curItem = this.tabObjs[this.index];
				if (this.index == 0) {
					this.licenseId = ''
				}
				this.headerrefresh()
			}
		},
		onUnload() {
			uni.$off('refresh-battery-list')
			// uni.$off('change-battery-tab')
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 500;
	}

	.empty {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		text-align: center;
		margin-top: 50px;
	}
</style>
