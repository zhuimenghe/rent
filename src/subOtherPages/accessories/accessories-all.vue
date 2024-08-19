<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">配件管理</c-nav-bar-btns>
		<view class="top-container" v-if="tabList.length > 0" :style="{top:navBarHeight+'px'}">
			<sun-tab :value.sync="index" :tabList="tabList" activeColor="#E60000" :shownum="false" @change="indexchange" />
		</view>
		<view class="tab-content" v-if="tabList.length > 0">
			<view v-if="curItem.id == 0">
				<inventory ref="inventory" :areaArr="areaArr" />
			</view>
			<view v-if="curItem.id == 1">
				<storagein ref="storagein" :areaArr="areaArr" :inassginArr="assignArr" />
			</view>
			<view v-if="curItem.id == 2">
				<receive ref="receive" :areaArr="areaArr" :inassginArr="assignArr" />
			</view>
			<view v-if="curItem.id == 3">
				<back ref="back" :areaArr="areaArr" :inassginArr="assignArr" />
			</view>
			<view v-if="curItem.id == 4">
				<allot ref="allot" :areaArr="areaArr" :inassginArr="assignArr" />
			</view>
		</view>
		<view style="display: flex;flex: 1;justify-content: center;align-items: center;height: 100%;" v-else>
			<text>{{'暂无权限'}}</text>
		</view>
	</view>
</template>

<script>
	import sunTab from '@/components/common/sun-tab/sun-tab.vue';
	import inventory from './acc-inventory/acc-inventory-list.vue';
	import storagein from './acc-storagein/acc-storagein-list.vue';
	import receive from './acc-receive/acc-receive-list.vue';
	import back from './acc-back/acc-back-list.vue';
	import allot from './acc-allot/acc-allot-list.vue';
import { mapState } from 'vuex';
	export default {
		components: {
			sunTab,
			inventory,
			storagein,
			receive,
			back,
			allot
		},
		data() {
			return {
				"navBtns": [
						{
								"text": "配置",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				index: 0,
				curItem: {},
				tabList: [],
				tabObjs: [],
				areaArr: [],
				assignArr: [],
				showBaseic:true
			};
		},
		computed:{
			...mapState('system',['navBarHeight'])
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
			onNavBarButtonTap() {
				uni.navigateTo({
					url:'/subOtherPages/accessories/acc-base/acc-base-list'
				})
			},
			indexchange(e) {
				this.index = e.index;
				this.curItem = this.tabObjs[this.index];
			},
			loadAreaList() {
				uni.showLoading();
				let urlstr = this.$url.ORG_LIST;
				this.$network
					.getData(urlstr, 'GET', null)
					.then(result => {
						let list = result;
						this.areaArr = [{
							label: '全部',
							value: ''
						}]
						this.areaArr = this.areaArr.concat(this.getChildren(list));
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getChildren(data) {
				let arr = [];
				if (data) {
					data.forEach(o => {
						let a = {
							value: o.id,
							label: o.name,
							children: o.children
						};
						arr = [...arr, a];
						if (o.children && o.children.length > 0) {
							arr = [...arr, ...this.getChildren(o.children)];
						}
					});
				}
				return arr;
			},
			//加载服务人员
			getUserLeaders() {
				let param = {
					showAdmin: false,
					orgId: "",
					// roleType : this.$savekey.USER_ROLE_SEVICER
				}
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.assignArr = [{
							label: '全部',
							value: ''
						}]
						this.assignArr = this.assignArr.concat(result ? result.map(o => {
							return {
								label: o.username,
								value: o.id
							}
						}) : [])
					}).catch(err => {});
			}
		},
		onLoad() {
			this.loadAreaList();
			this.getUserLeaders();
			let funcList = [{
				name: '配件库存',
				id: 0,
				key: 'partStock',
				ref: 'inventory'
			}, {
				name: '配件入库',
				id: 1,
				key: 'partsPutin',
				ref:'storagein'
			},{
				name: '配件出库',
				id: 2,
				key: 'partsReceive',
				ref: 'receive'
			}, {
				name: '配件退回',
				id: 3,
				key: 'partsBack',
				ref: 'back'
			}, {
				name: '配件调拨',
				id: 4,
				key: 'partsAllocation',
				ref: 'allot'
			}];
			let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
			if(resData){
				this.showBaseic = resData.some(x => x.value === this.$savekey.PERMISSION_PARTBASE_LIST);
				this.tabObjs = funcList.filter(o => {
					return !o.key || resData.some(x => x.value === o.key)
				})
				if (this.tabObjs.length > 0) {
					this.curItem = this.tabObjs[this.index];
				}
				this.tabList = this.tabObjs.map(o => {
					return o.name;
				});
			}
			if(!this.showBaseic){
				if (this.isshowMore === false) {
					// #ifdef APP-PLUS
					let webView = this.$mp.page.$getAppWebview();
					webView.setTitleNViewButtonStyle(0, {
						width: '0',
					});
					// #endif
					// #ifndef APP-PLUS
					this.navBtns = []
					// #endif
				}
			}
			uni.$on('refresh-acc-list', usnerinfo => {
				setTimeout(()=>{
					let refstr = this.curItem.ref;
					this.$refs[refstr].headerrefresh();
				}, 100);
			});
		},
		onUnload() {
			uni.$off('refresh-acc-list');
		}
	};
</script>

<style scoped lang="scss">
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

	.empty {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		text-align: center;
		margin-top: 50px;
	}
</style>
