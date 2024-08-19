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
			<view v-if="curItem.id == 1">
				<repairmachine ref="machine" />
			</view>
			<view v-if="curItem.id == 0">
				<repairlist ref="repair" :searchString = "searchStr"/>
			</view>
		</view>
	</view>
</template>
<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import repairlist from './repair-list-tab.vue';
	import repairmachine from './repair-list-machine.vue';
	export default {
		components: {
			sunTab,
			repairlist,
			repairmachine,
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
					name: '设备维修',
					id: 1,
					key: "",
					refs:"machine"
					},{
					name: '维修记录',
					id: 0,
					key: "",
					refs:"repair"
				}]
			if (this.tabObjs.length > 0) {
				this.curItem = this.tabObjs[this.index];
			}
			this.tabList = this.tabObjs.map(o => {
				return o.name
			})
			uni.$on('refreshData-repair', obj => {
				// console.log(JSON.stringify(this.curItem))
				this.$refs[this.curItem.refs].headerrefresh();
			})
			uni.$on('refreshData-repair-list', obj => {
				console.log("------------")
				let item = obj.item;
				this.index = 1;
				this.curItem = this.tabObjs[this.index];
				this.searchStr= item.licenseId
			})
			uni.$on('changelicenId', obj => {
				console.log("++++++++++++++")
				this.searchStr = obj.licenseId;
			});
			
		},
		onUnload() {
			uni.$off('refreshData-repair')
			uni.$off('refreshData-repair-list')
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
