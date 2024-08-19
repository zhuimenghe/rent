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
				<maintainlist ref="maintain" :searchString = "searchStr"/>
			</view>
			<view v-if="curItem.id == 1">
				<maintainmachine ref="machine" />
			</view>
		</view>
	</view>
</template>
<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import maintainlist from './maintain-list.vue';
	import maintainmachine from './maintain-machine.vue';
	export default {
		components: {
			sunTab,
			maintainlist,
			maintainmachine,
		},
		data() {
			return {
				index: 0,
				curItem: {},
				tabList: [],
				tabObjs: [],
				searchStr:''
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
				name: '设备保养',
				id: 1,
				key: "",
				refs:"machine",
			},{
				name: '保养记录',
				id: 0,
				key: "",
				refs:"maintain"
			}]
			if (this.tabObjs.length > 0) {
				this.curItem = this.tabObjs[this.index];
			}
			this.tabList = this.tabObjs.map(o => {
				return o.name
			})
			uni.$on('refresh-maintain', obj => {
				this.$refs[this.curItem.refs].headerrefresh();
			})
			uni.$on('refreshData-maintain-list', obj => {
				let item = obj.item;
				this.index = 1;
				this.curItem = this.tabObjs[this.index];
				console.log(item.licenseId)
				this.searchStr= item.licenseId
			})
			uni.$on('changelicenId', obj => {
				this.searchStr = obj.licenseId;
			});
		},
		onUnload() {
			uni.$off('refresh-maintain')
			uni.$off('refreshData-maintain-list')
			uni.$off('changelicenId')
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
