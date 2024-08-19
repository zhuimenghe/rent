<template>
	<view class="fence-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<!-- <view class="tab-top-view">
			<sun-tab
				:value.sync="tabindex"
				:tabList="tabbarList"
				:scroll="false"
				@change="tabSelect"
				activeColor="#E60000"
				activebgColor="#FFFFFF"
				defaultbgColor="#FFFFFF"
				:shownum="false"
			></sun-tab>
		</view>
		<view v-show="tabindex == 0">
			<tempfence ref='tempfence'/>
		</view>
		<view v-show="tabindex == 1">
			<garagefence ref='garagefence' />
		</view>
		<view v-show="tabindex == 2">
			<customfence ref='customfence' />
		</view> -->
		<tempfence ref='tempfence'/>
	</view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import tempfence from './detail-list/temp-fence-list.vue';
import garagefence from './detail-list/garage-fence-list.vue';
import customfence from './detail-list/custom-fence-list.vue';
export default{
	components: {
		sunTab,
		tempfence,
		garagefence,
		customfence
	},
	data() {
		return {
			tabindex:0,
			// tabbarList:['临时围栏','仓库围栏','场地围栏'],
			tabbarList:['临时围栏'],
			currentpage: 1,
			datalist: [],
			morestatus: 'more',
			
			searchKey: '',
			
		};
	},
	//下拉刷新
	onPullDownRefresh() {
		if(this.tabindex === 0){
			this.$refs.tempfence.refreshheader();
		}else if(this.tabindex === 1){
			this.$refs.garagefence.refreshheader();
		}else if(this.tabindex === 2){
			this.$refs.customfence.refreshheader();
		}
		
	},
	//上拉加载
	onReachBottom() {
		if(this.tabindex === 0){
			this.$refs.tempfence.refreshhfooter();
		}else if(this.tabindex === 1){
			this.$refs.garagefence.refreshhfooter();
		}else if(this.tabindex === 2){
			this.$refs.customfence.refreshhfooter();
		}
	},
	methods:{
		tabSelect(e){
			this.$datestr.printlog(e);
			this.tabindex = e.index;
		}
	},
	onLoad(){
		uni.$on("refresh-fence",userinfo=>{
			let type = userinfo.type;
			if(type === "temp"){
				this.$refs.tempfence.refreshheader();
			}else if(type === 'garage'){
				this.$refs.garagefence.refreshheader();
			}else if(type === "custom"){
				this.$refs.customfence.refreshheader();
			}
		})
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"电子围栏","列表");
		
	},
	onUnload(){
		
	}
}
</script>

<style lang="scss" scoped>
.fence-bg-view{
	display: flex;
	flex: 1;
	flex-direction: column;
}
.tab-top-view{
	position: fixed;
	top: 0;
	width: 100%;
	height: 50px;
	background: #FFFFFF;
}
</style>
