<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<companyVue :dataDic="dataDic" :isedit = 'false' :isadd = 'false'/>
		<driverVue :dataDic="dataDic" :isedit = 'false'/>
		<machinesVue :dataDic="dataDic" :isedit = 'false'/>
	</view>
</template>
<script>
import companyVue from './logistics-company/logistics-company.vue';
import machinesVue from './logistics-company/logistics-machines.vue';
import driverVue from './logistics-company/logistics-driver.vue';
export default {
	components: {
		companyVue,
		machinesVue,
		driverVue
	},
	data() {
		return {
			dataDic: {}
		};
	},
	onLoad(options) {
		let item = JSON.parse(decodeURIComponent(options.item));
		this.getDetail(item)
	},
	methods: {
		getDetail(item){
			let url = this.$url.MACHINE_LOGISTICS_COMPANY_MSG + item.id
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...result
					}
				})
				.catch(err => {
					
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: $uni-bg-color-grey;
}
.bg-view {
	width: 100%;
	background: $uni-bg-color-grey;
}

.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
}

.bottom-left-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}

.bottom-right-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
