<template>
	<view>
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view v-if="type=='maintain'"> 
			<maintainlist ref="maintain" :showHeader="false" :licenseId="licenseId"/>
		</view>
		<view v-if="type=='polling'">
			<pollingrecord ref="polling" :showHeader="false" :licenseId="licenseId" />
		</view>
		<view v-if="type=='repair'">
			<repairlist ref="repair" :showHeader="false" :licenseId="licenseId" />
		</view>
		<view v-if="type=='hostling'">
			<overhaulrecord ref="hostling" :showHeader="false" :licenseId="licenseId" />
		</view>
		<view v-if="type=='battery'">
			<batteryrecord ref="battery" :showHeader="false" :licenseId="licenseId" />
		</view>
	</view>
</template>

<script>
	import maintainlist from './maintain/maintain-list.vue';
	import pollingrecord from './polling/polling-record-list.vue';
	import repairlist from './repair/repair-list-tab.vue';
	import overhaulrecord from './hostling/overhaul-record-list.vue';
	import batteryrecord from './battery-polling/battery-polling-record.vue';
	
	export default {
		components:{
			maintainlist,
			pollingrecord,
			repairlist,
			overhaulrecord,
			batteryrecord
		},
		data() {
			return {
				licenseId:'',
				type:''
			}
		},
		onLoad(option) {
			this.licenseId = option.licenseId
			this.type = option.type ? option.type:''
			setTimeout(()=>{
				uni.setNavigationBarTitle({
					title:option.title
				})
			}, 100);
		},
		onPullDownRefresh() {
			this.$refs[this.type].headerrefresh();
		},
		onReachBottom() {
			this.$refs[this.type].footerrefresh();
			
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
