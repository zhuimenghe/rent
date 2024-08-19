<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-container">
			<sun-tab :value.sync="index" :tabList="tabList" :isFlex="false" activeColor="#E60000" :shownum="false" @change="indexchange"></sun-tab>
		</view>
		<view class="list-container">
			<view v-if="tabObjList[index].id=='user'">
				<tabStaff ref='staff' @refresh="headerrefreshInfo" />
			</view>
			<view v-if="tabObjList[index].id=='person'">
				<tabPerson ref='person' @refresh="headerrefreshInfo"/>
			</view>
			<view v-if="tabObjList[index].id=='company'">
				<tabCompany ref='company' @refresh="headerrefreshInfo"/>
			</view>
		</view>
	</view>
</template>
<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import tabStaff from './tab-staff-list.vue'
	import tabPerson from './tab-person-list.vue'
	import tabCompany from './tab-company-list.vue'
	export default {
		components: {
			selectView,
			wPicker,
			sunTab,
			tabStaff,
			tabPerson,
			tabCompany
		},
		data() {
			return {
				index: 0,
				tabList: ['个人客户', '企业客户'],
				isPermissionRentalUser: false,
				tabObjList: [{
						id: "user",
						name: '租赁员工'
					},
					{
						id: "person",
						name: '个人客户'
					},
					{
						id: "company",
						name: '企业客户'
					}
				],
			};
		},
		onLoad(options) {
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG)
			if (ps && ps.length > 0) {
				this.isPermissionRentalUser = ps.some(x => x.value === this.$savekey.PERMISSION_ESIGN_RENTAL_USER);
			}
			if (this.isPermissionRentalUser) {
				this.tabList = ['租赁员工', '个人客户', '企业客户'];
				this.tabObjList= [{
						id: "user",
						name: '租赁员工'
					},
					{
						id: "person",
						name: '个人客户'
					},
					{
						id: "company",
						name: '企业客户'
					}
				];
			} else {
				this.tabList = ['个人客户', '企业客户'];
				this.tabObjList= [
					{
						id: "person",
						name: '个人客户'
					},
					{
						id: "company",
						name: '企业客户'
					}
				];
			}
			setTimeout(() => {
				this.headerrefreshInfo()
			}, 100)

		},
		onPullDownRefresh() {
			this.headerrefreshInfo()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			indexchange(e) {
				setTimeout(() => {
					this.hidePop();
					this.index = e.index
					this.headerrefreshInfo()
				}, 10)
			},
			hidePop() {
				// if (this.index == 0) {
				// 	this.$refs.vehicle.hidePop();
				// } else {
				// 	this.$refs.motorman.hidePop();
				// }
			},
			headerrefreshInfo() {
				switch (this.tabObjList[this.index].id) {
					case 'user':
						this.$refs.staff.headerrefresh();
						break;
					case 'person':
						this.$refs.person.headerrefresh();
						break;
					case 'company':
						this.$refs.company.headerrefresh();
						break;
					default:
						break;
				}
			},
			footerrefresh() {
				switch (this.tabObjList[this.index].id) {
					case 'user':
						this.$refs.staff.footerrefresh();
						break;
					case 'person':
						this.$refs.person.footerrefresh();
						break;
					case 'company':
						this.$refs.company.footerrefresh();
						break;
					default:
						break;
				}
			},
		}

	}
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
		z-index: 800;
	}

	.list-container {
		margin-top: 45px;
	}
</style>
