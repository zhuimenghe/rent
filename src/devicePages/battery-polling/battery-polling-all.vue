<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-container" v-if="tabList.length > 0"><sun-tab :value.sync="index" :tabList="tabList" activeColor="#E60000" :shownum="false" @change="indexchange" /></view>
		<view class="tab-content" v-if="tabList.length > 0">
			<view v-if="curItem.id == 1">
				<deviceList ref="machine"/>
			</view>
			<view v-if="curItem.id == 0">
				<recordList ref="record" :searchString="searchStr"/>
			</view>
		</view>
	</view>
</template>
<script>
	
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import recordList from './battery-polling-record.vue';
import deviceList from './battery-polling-device.vue';
export default {
	components: {
		sunTab,
		recordList,
		deviceList
	},
	data() {
		return {
			index: 0,
			curItem: {},
			tabList: [],
			tabObjs: [],
			searchStr: ''
		};
	},
	onPullDownRefresh() {
		this.$refs[this.curItem.refs].headerrefresh();
	},
	onReachBottom() {
		this.$refs[this.curItem.refs].footerrefresh();
	},
	methods: {
		indexchange(e) {
			this.index = e.index;
			this.curItem = this.tabObjs[this.index];
		}
	},
	onLoad() {
		this.tabObjs = [{
			name: '电池巡检',
			id: 1,
			key: '',
			refs: 'machine'
		},{
			name: '巡检记录',
			id: 0,
			key: '',
			refs: 'record'
		}];
		if (this.tabObjs.length > 0) {
			this.curItem = this.tabObjs[this.index];
		}
		this.tabList = this.tabObjs.map(o => {
			return o.name;
		});
		// uni.$on('refreshData-repair', obj => {
		// 	console.log("--------refreshData-repair-----------")
		// 	this.$refs[this.curItem.refs].headerrefresh();
		// })
		uni.$on('refresh-polling', obj => {
			this.$refs[this.curItem.refs].headerrefresh();
		});
		uni.$on('refreshData-polling-list', obj => {
			let item = obj.item;
			this.index = 1;
			this.curItem = this.tabObjs[this.index];
			this.searchStr = item.licenseId;
		});
		uni.$on('changelicenId', obj => {
			this.searchStr = obj.licenseId;
		});
	},
	onUnload() {
		uni.$off('refreshData-polling');
		uni.$off('refreshData-polling-list');
		uni.$off('changelicenId');
	}
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
	z-index: 500;
}
.empty {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	text-align: center;
	margin-top: 50px;
}
</style>
