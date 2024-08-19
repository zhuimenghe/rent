<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-container" v-if="tabList.length>0">
			<sun-tab 
			:value.sync="index" 
			:tabList="tabList" 
			activeColor="#E60000" 
			:shownum="false" 
			@change="indexchange"
			/>
		</view>
		<view class="tab-content" v-if="tabList.length>0">
			<view v-if="curItem.id == 0">
				<charlist ref="char" />
			</view>
			<view v-if="curItem.id == 1">
				<devicelist ref="device" />
			</view>
		</view>
	</view>
</template>

<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import charlist from './logstics-record/logistics-char-list.vue';
	import devicelist from './logstics-record/logistics-device-list.vue';
	export default {
		components: {
			sunTab,
			charlist,
			devicelist,
		},
		data() {
			return {
				index: 0,
				curItem: {},
				tabList: [],
				tabObjs: []
			};
		},
		onPullDownRefresh() {
			let refstr = this.curItem.ref
			this.$refs[refstr].headerrefresh();
		},
		onReachBottom() {
			let refstr = this.curItem.ref
			this.$refs[refstr].footerrefresh();
		},
		methods: {
			indexchange(e) {
				this.index = e.index;
				this.curItem = this.tabObjs[this.index];
			}
		},
		onLoad() {
			this.tabObjs = [{
					name: '物流记录',
					id: 0,
					key: "",
					ref:'char'
				},{
					name: '设备物流',
					id: 1,
					key: "",
					ref:'device'
			}]
			if (this.tabObjs.length > 0) {
				this.curItem = this.tabObjs[this.index];
			}
			this.tabList = this.tabObjs.map(o => {
				return o.name
			})
			uni.$on('refreshData-logistics-list', obj => {
				this.$refs[refstr].footerrefresh();
			})
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Logistics_Administrative,"物流记录","列表");
		},
		onUnload() {
		
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		background-color: $uni-bg-color-grey;
		position: relative;
	}
	.top-container {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 600;
	}
	.tab-content{
		width: 100%;
		background-color: $uni-bg-color-grey;
	}

	.empty {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		text-align: center;
		margin-top: 50px;
	}
</style>
