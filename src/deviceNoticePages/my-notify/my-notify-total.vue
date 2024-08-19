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
				<repair ref="repair" :orgObj="orgDic" :stateDict="stateDic"/>
			</view>
			<view v-if="curItem.id == 1">
				<maintain ref="maintain" :orgObj="orgDic" :stateDict="stateDic"/>
			</view>
			<view v-if="curItem.id == 2">
				<hostling ref="hostling" :orgObj="orgDic" :stateDict="stateDic"/>
			</view>
			<view v-if="curItem.id == 3">
				<polling ref="polling" :orgObj="orgDic" :stateDict="stateDic"/>
			</view>
			<view v-if="curItem.id == 4">
				<battery ref="battery" :orgObj="orgDic" :stateDict="stateDic"/>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import repair from './my-repair-notify.vue';
import maintain from './my-maintain-notify.vue';
import hostling from './my-hostling-notify.vue';
import polling from './my-polling-notify.vue';
import battery from './my-battery-notify.vue';

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
			orgDic:null,
			stateDic:{value :'',label:'全部'}
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
	onLoad(option) {
		if(option.orgObj){
			let orgObj = JSON.parse(decodeURIComponent(option.orgObj));
			if(orgObj.value == ""){
				this.orgDic = {
					value :'',
					label:'全部'
				}
			}else{
				this.orgDic = {
					...orgObj
				}
			}
		}
		if(option.stateDic){
			let stateDict = JSON.parse(decodeURIComponent(option.stateDic));
			console.log(JSON.stringify(stateDict));
			if(stateDict.value == ""){
				this.stateDic = {
					value :'',
					label:'全部'
				}
			}else{
				this.stateDic = {
					...stateDict
				}
			}
		}
		this.tabObjs = [{
				name: '维修待办',
				id: 0,
				key: 'repairTodoList',
				ref:'repair'
			},{
				name: '保养待办',
				id: 1,
				key: 'maintainTodoList',
				ref:'maintain'
			},{
				name: '检修待办',
				id: 2,
				key: 'checkTodoList',
				ref:'hostling'
			},{
				name: '巡检待办',
				id: 3,
				key: 'inpectionTodoList',
				ref:'polling'
			},{
				name: '电池待办',
				id: 4,
				key: 'batteryTodoList',
				ref:'battery'
			}];
		let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
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
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Service_Task,"待办任务","列表");
	},
	onUnload() {
		uni.$off('refresh-device-work-list');
		uni.$off('choose-repair-emit')
		uni.$off('choose-maintain-emit')
		uni.$off('choose-hostling-emit')
		uni.$off('choose-polling-emit')
		uni.$off('refreshData-repair')
		uni.$off('refresh-maintain')
		uni.$off('refreshData-overhaul')
		uni.$off('refresh-polling')
	},
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
