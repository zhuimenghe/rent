<template>
	<view class="content">
		<view class="top-container" v-if="tabList.length > 0">
		    <sun-tab
		    :value.sync="index" 
		    :tabList="tabList" 
		    activeColor="#E60000" 
		    :shownum="false" 
		    @change="indexchange" 
		    /> 
		</view>
		<view class="tab-content" v-if="tabList.length > 0">
			<view v-if="curItem.id == 0">
				<repair ref="repair"/>
			</view>
			<view v-if="curItem.id == 1">
				<maintain ref="maintain"/>
			</view>
			<view v-if="curItem.id == 2">
				<hostling ref="hostling"/>
			</view>
			<view v-if="curItem.id == 3">
				<polling ref="polling"/>
			</view>
			<view v-if="curItem.id == 4">
				<battery ref="battery"/>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import repair from './notify-send-repair.vue';
import maintain from './notify-send-maintain.vue';
import hostling from './notify-send-hostling.vue';
import polling from './notify-send-polling.vue';
import battery from './notify-send-battery.vue';

export default {
	components: {
		sunTab,
		repair,
		maintain,
		hostling,
		polling,
		battery
	},
	data() {
		return {
			index: 0,
			curItem: {},
			tabList: [],
			tabObjs: [],
		};
	},
	onPullDownRefresh() {
		let refstr = this.curItem.ref;
		this.$refs[refstr].headerrefresh();
	},
	onReachBottom() {
		let refstr = this.curItem.ref;
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
				name: '维修任务',
				id: 0,
				key: 'repairTodoList',
				ref:'repair'
			},{
				name: '保养任务',
				id: 1,
				key: 'maintainTodoList',
				ref:'maintain'
			},{
				name: '检修任务',
				id: 2,
				key: 'checkTodoList',
				ref:'hostling'
			},{
				name: '巡检任务',
				id: 3,
				key: 'inpectionTodoList',
				ref:'polling'
			},{
				name: '电池巡检',
				id: 4,
				key: 'batteryTodoList',
				ref:'battery'
			}];
		let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		console.log(resData);
		this.tabObjs = this.tabObjs.filter(o => {
			return !o.key || resData.some(x => x.value === o.key)
		})
		if (this.tabObjs.length > 0) {
			this.curItem = this.tabObjs[this.index];
		}
		this.tabList = this.tabObjs.map(o => {
			return o.name;
		});
		uni.$on('refresh-device-work-list', usnerinfo => {
			let refstr = this.curItem.ref;
			this.$refs[refstr].headerrefresh();
		});
	},
	onUnload() {
		uni.$off('refresh-device-work-list');
	}
};
</script>

<style scoped lang="scss">
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
	z-index: 500;
}

.empty {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	text-align: center;
	margin-top: 50px;
}	
</style>
